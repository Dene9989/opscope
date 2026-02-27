(function () {
  const ACTION_CONTAINERS_SELECTOR =
    ".card-actions, .table-actions, .gerencial-head__actions, .access-actions, .desempenho-head__actions";
  const HEADING_CONTAINERS_SELECTOR =
    ".section-title, .card-head, .desempenho-head, .performance-projects-head, .performance-people-head, .card-kpi__head, .gerencial-head, .card-header--split";
  const TOOLBAR_CONTAINERS_SELECTOR =
    ".programacao-toolbar, .intercorrencia-filtros, .contingencia-filters, .pmp-toolbar";

  let sourceCache = null;
  let sourceById = new Map();
  let sourceFetchPromise = null;

  function asText(value) {
    if (value === null || value === undefined) {
      return "";
    }
    return String(value).trim();
  }

  function normalizeSource(value) {
    return asText(value).toLowerCase().replace(/[^a-z0-9_-]+/g, "_") || "all";
  }

  function normalizeDate(value) {
    const txt = asText(value);
    if (!txt) {
      return "";
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(txt)) {
      return txt;
    }
    if (/^\d{4}-\d{2}-\d{2}T/.test(txt)) {
      return txt.slice(0, 10);
    }
    return "";
  }

  function cleanFilters(filters) {
    if (!filters || typeof filters !== "object" || Array.isArray(filters)) {
      return {};
    }
    const out = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }
      if (typeof value === "string") {
        const text = value.trim();
        if (text) {
          out[key] = text;
        }
        return;
      }
      if (typeof value === "number" || typeof value === "boolean") {
        out[key] = value;
        return;
      }
      if (Array.isArray(value) && value.length) {
        out[key] = value;
        return;
      }
      if (typeof value === "object" && Object.keys(value).length) {
        out[key] = value;
      }
    });
    return out;
  }

  function buildPowerBIExportUrl({ source, from, to, filters } = {}) {
    const params = new URLSearchParams();
    const safeSource = normalizeSource(source);
    params.set("source", safeSource);

    const safeFrom = normalizeDate(from);
    const safeTo = normalizeDate(to);
    if (safeFrom) {
      params.set("from", safeFrom);
    }
    if (safeTo) {
      params.set("to", safeTo);
    }

    const safeFilters = cleanFilters(filters);
    if (Object.keys(safeFilters).length) {
      params.set("filters", JSON.stringify(safeFilters));
    }

    return `/api/powerbi/export?${params.toString()}`;
  }

  function createButton(label, source) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost btn--small powerbi-export-btn";
    btn.textContent = label || "Exportar Power BI";
    btn.setAttribute("data-powerbi-export-btn", "1");
    btn.setAttribute("data-powerbi-source", normalizeSource(source));
    return btn;
  }

  function resolveContainer(selectorOrElement) {
    if (!selectorOrElement) {
      return null;
    }
    if (typeof selectorOrElement === "string") {
      return document.querySelector(selectorOrElement);
    }
    return selectorOrElement;
  }

  function applySlotVariant(slot, variant) {
    if (!slot || !variant) {
      return;
    }
    slot.classList.add(`powerbi-export-slot--${variant}`);
  }

  function findPreferredActionContainer(container) {
    if (!container) {
      return null;
    }
    if (container.matches(ACTION_CONTAINERS_SELECTOR)) {
      return container;
    }
    return container.querySelector(ACTION_CONTAINERS_SELECTOR);
  }

  function findPreferredHeadingContainer(container) {
    if (!container) {
      return null;
    }
    if (container.matches(HEADING_CONTAINERS_SELECTOR)) {
      return container;
    }
    return container.querySelector(HEADING_CONTAINERS_SELECTOR);
  }

  function ensureBlockSlot(container) {
    const existing = container.querySelector(":scope > [data-powerbi-export-slot='1']");
    if (existing) {
      applySlotVariant(existing, container.matches(TOOLBAR_CONTAINERS_SELECTOR) ? "toolbar" : "block");
      return existing;
    }
    const slot = document.createElement("div");
    slot.className = "powerbi-export-slot";
    slot.setAttribute("data-powerbi-export-slot", "1");
    applySlotVariant(slot, container.matches(TOOLBAR_CONTAINERS_SELECTOR) ? "toolbar" : "block");

    const heading = container.querySelector(":scope > h2, :scope > h3");
    if (heading && heading.parentElement === container) {
      heading.insertAdjacentElement("afterend", slot);
      return slot;
    }

    container.insertBefore(slot, container.firstChild || null);
    return slot;
  }

  function ensureInlineSlot(host, variant = "inline") {
    if (!host) {
      return null;
    }
    const existing = host.querySelector(":scope > [data-powerbi-export-slot='1']");
    if (existing) {
      applySlotVariant(existing, variant);
      return existing;
    }
    const slot = document.createElement("div");
    slot.className = "powerbi-export-slot powerbi-export-slot--inline";
    slot.setAttribute("data-powerbi-export-slot", "1");
    applySlotVariant(slot, variant);
    host.appendChild(slot);
    return slot;
  }

  function ensureSlot(container) {
    if (!container) {
      return null;
    }

    const actionContainer = findPreferredActionContainer(container);
    if (actionContainer) {
      return ensureInlineSlot(actionContainer, "actions");
    }

    const headingContainer = findPreferredHeadingContainer(container);
    if (headingContainer) {
      return ensureInlineSlot(headingContainer, "heading");
    }

    return ensureBlockSlot(container);
  }

  function normalizeSourcesPayload(payload) {
    if (!payload || typeof payload !== "object") {
      return [];
    }
    const list = Array.isArray(payload.sources) ? payload.sources : [];
    return list
      .map((item) => {
        if (!item || typeof item !== "object") {
          return null;
        }
        const id = normalizeSource(item.id || item.source);
        if (!id) {
          return null;
        }
        return {
          id,
          label: asText(item.label || id) || id,
          fileCount: Number.isFinite(Number(item.fileCount)) ? Number(item.fileCount) : 0,
        };
      })
      .filter(Boolean);
  }

  function setButtonSourceState(button) {
    if (!button) {
      return;
    }
    const source = normalizeSource(button.dataset.powerbiSource);
    const meta = sourceById.get(source);
    if (sourceById.size && !meta) {
      button.disabled = true;
      button.title = `Fonte Power BI indisponivel: ${source}`;
      return;
    }
    button.disabled = false;
    if (meta) {
      button.title = `Exportar Power BI (${meta.label})`;
      return;
    }
    button.title = "Exportar Power BI";
  }

  function applySourceCatalogOnButtons() {
    const buttons = document.querySelectorAll("[data-powerbi-export-btn='1']");
    buttons.forEach((button) => {
      setButtonSourceState(button);
    });
  }

  async function fetchPowerBISources(force = false) {
    if (!force && Array.isArray(sourceCache)) {
      return sourceCache;
    }
    if (!force && sourceFetchPromise) {
      return sourceFetchPromise;
    }

    sourceFetchPromise = fetch("/api/powerbi/sources", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`sources_http_${response.status}`);
        }
        const payload = await response.json().catch(() => ({}));
        const list = normalizeSourcesPayload(payload);
        sourceCache = list;
        sourceById = new Map(list.map((item) => [item.id, item]));
        applySourceCatalogOnButtons();
        return list;
      })
      .catch(() => {
        if (!Array.isArray(sourceCache)) {
          sourceCache = [];
          sourceById = new Map();
        }
        return sourceCache;
      })
      .finally(() => {
        sourceFetchPromise = null;
      });

    return sourceFetchPromise;
  }

  async function syncPowerBIExportSources(force = false) {
    const list = await fetchPowerBISources(force);
    applySourceCatalogOnButtons();
    return list;
  }

  function attachPowerBIExportButton({ containerSelector, source, getFiltersFn, label } = {}) {
    const container = resolveContainer(containerSelector);
    if (!container) {
      return null;
    }
    const slot = ensureSlot(container);
    if (!slot) {
      return null;
    }

    let button = slot.querySelector("[data-powerbi-export-btn='1']");
    if (!button) {
      button = createButton(label || "Exportar Power BI", source);
      slot.appendChild(button);
    }
    button.dataset.powerbiSource = normalizeSource(source);
    if (button.dataset.powerbiBound === "1") {
      setButtonSourceState(button);
      return button;
    }
    button.dataset.powerbiBound = "1";

    button.addEventListener("click", () => {
      if (button.disabled) {
        return;
      }
      let payload = {};
      if (typeof getFiltersFn === "function") {
        try {
          payload = getFiltersFn() || {};
        } catch (_) {
          payload = {};
        }
      }
      const filters = payload.filters && typeof payload.filters === "object" ? payload.filters : payload;
      const url = buildPowerBIExportUrl({
        source,
        from: payload.from,
        to: payload.to,
        filters,
      });
      window.open(url, "_blank", "noopener");
    });

    setButtonSourceState(button);
    if (!sourceFetchPromise && !Array.isArray(sourceCache)) {
      syncPowerBIExportSources(false).catch(() => {});
    }
    return button;
  }

  window.buildPowerBIExportUrl = buildPowerBIExportUrl;
  window.attachPowerBIExportButton = attachPowerBIExportButton;
  window.fetchPowerBISources = fetchPowerBISources;
  window.syncPowerBIExportSources = syncPowerBIExportSources;
})();
