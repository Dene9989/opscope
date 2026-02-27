(function () {
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

  function createButton(label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost btn--small powerbi-export-btn";
    btn.textContent = label || "Exportar Power BI";
    btn.setAttribute("data-powerbi-export-btn", "1");
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

  function ensureSlot(container) {
    if (!container) {
      return null;
    }
    if (
      container.matches(
        ".card-actions, .table-actions, .gerencial-head__actions, .access-actions, .card-head, .programacao-toolbar, .desempenho-head__actions, .performance-projects-toolbar, .performance-people-toolbar"
      )
    ) {
      return container;
    }
    const existing = container.querySelector("[data-powerbi-export-slot='1']");
    if (existing) {
      return existing;
    }
    const slot = document.createElement("div");
    slot.className = "powerbi-export-slot";
    slot.setAttribute("data-powerbi-export-slot", "1");
    container.insertBefore(slot, container.firstChild || null);
    return slot;
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
      button = createButton(label || "Exportar Power BI");
      slot.appendChild(button);
    }
    if (button.dataset.powerbiBound === "1") {
      return button;
    }
    button.dataset.powerbiBound = "1";

    button.addEventListener("click", () => {
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

    return button;
  }

  window.buildPowerBIExportUrl = buildPowerBIExportUrl;
  window.attachPowerBIExportButton = attachPowerBIExportButton;
})();
