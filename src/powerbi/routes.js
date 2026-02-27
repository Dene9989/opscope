const fs = require("fs");
const path = require("path");
const express = require("express");
const { exportPowerBIPack, streamZipFromDir } = require("./exportPowerBI");

function nowStamp() {
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}${mm}${dd}_${hh}${mi}`;
}

function safeSource(value) {
  return (String(value || "all").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_") || "all");
}

function parseFilters(raw) {
  if (!raw) {
    return {};
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return { ...raw };
  }
  const text = String(raw).trim();
  if (!text) {
    return {};
  }
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (_) {
    return {};
  }
}

function parseDateParam(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }
  return "";
}

function normalizeSourceId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_") || "all";
}

function buildPowerBISourcesCatalog(sourceRegistry = {}, sourceLabels = {}) {
  const normalizedCounts = new Map();
  Object.entries(sourceRegistry || {}).forEach(([rawKey, entries]) => {
    const id = normalizeSourceId(rawKey);
    const count = Array.isArray(entries) ? entries.length : 0;
    normalizedCounts.set(id, Math.max(normalizedCounts.get(id) || 0, count));
  });
  const ids = new Set(["all"]);
  Object.keys(sourceRegistry || {}).forEach((key) => {
    ids.add(normalizeSourceId(key));
  });
  const list = Array.from(ids);
  list.sort((a, b) => {
    if (a === "all") {
      return -1;
    }
    if (b === "all") {
      return 1;
    }
    return a.localeCompare(b);
  });
  return list.map((id) => {
    const fileCount = normalizedCounts.get(id) || 0;
    const label = String((sourceLabels && sourceLabels[id]) || id).trim() || id;
    return {
      id,
      label,
      fileCount,
    };
  });
}

function createPowerBIRouter(options = {}) {
  const router = express.Router();
  const auth = options.requireAuth;

  if (typeof auth !== "function") {
    throw new Error("createPowerBIRouter requires requireAuth middleware.");
  }

  router.get("/api/powerbi/sources", auth, (req, res) => {
    const sources = buildPowerBISourcesCatalog(options.sourceRegistry, options.sourceLabels);
    return res.json({
      sources,
      updatedAt: new Date().toISOString(),
    });
  });

  router.get("/api/powerbi/export", auth, async (req, res) => {
    const source = safeSource(req.query.source);
    const from = parseDateParam(req.query.from);
    const to = parseDateParam(req.query.to);
    const filters = parseFilters(req.query.filters);

    if (req.query.from && !from) {
      return res.status(400).json({ message: "Parametro from invalido. Use YYYY-MM-DD." });
    }
    if (req.query.to && !to) {
      return res.status(400).json({ message: "Parametro to invalido. Use YYYY-MM-DD." });
    }
    if (from && to && from > to) {
      return res.status(400).json({ message: "Intervalo invalido: from deve ser menor ou igual a to." });
    }

    const currentUser = req.currentUser || null;
    const defaultProjectId =
      typeof options.getDefaultProjectId === "function"
        ? String(options.getDefaultProjectId(req, currentUser) || "").trim()
        : "";

    const requestedProjectId = String(
      (filters && (filters.projectId || filters.projetoId)) || req.query.projectId || defaultProjectId || ""
    ).trim();

    if (requestedProjectId) {
      if (typeof options.canAccessProject === "function") {
        const allowed = options.canAccessProject(req, requestedProjectId, currentUser);
        if (!allowed) {
          return res.status(403).json({ message: "Projeto nao autorizado para exportacao." });
        }
      }
      filters.projectId = requestedProjectId;
    }

    let pack = null;
    try {
      pack = await exportPowerBIPack({
        source,
        from,
        to,
        filters,
        baseDataDir: options.baseDataDir,
        sourceRegistry: options.sourceRegistry,
        usersFile: options.usersFile,
        databaseUrl: options.databaseUrl,
        dbStoreTable: options.dbStoreTable,
        dbUploadsTable: options.dbUploadsTable,
      });

      const zipFileName = `opscope_powerbi_export_${source}_${nowStamp()}.zip`;
      await streamZipFromDir(res, pack.dirPath, zipFileName);
    } catch (error) {
      if (!res.headersSent) {
        return res.status(500).json({
          message: error && error.message ? error.message : "Falha ao gerar exportacao Power BI.",
          reason: "powerbi_export_failed",
        });
      }
    } finally {
      if (pack && pack.dirPath) {
        try {
          fs.rmSync(path.resolve(pack.dirPath), { recursive: true, force: true });
        } catch (_) {
          // ignore temp cleanup errors
        }
      }
    }
    return undefined;
  });

  return router;
}

module.exports = {
  createPowerBIRouter,
};
