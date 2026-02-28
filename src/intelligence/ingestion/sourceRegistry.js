const path = require("path");
const { normalizeSourceId, safeText } = require("../normalize/keyResolver");

function buildEntry(rawEntry, baseDir, fallbackSource) {
  if (!rawEntry) {
    return null;
  }
  if (typeof rawEntry === "string") {
    const filePath = path.isAbsolute(rawEntry)
      ? path.resolve(rawEntry)
      : path.resolve(baseDir, rawEntry);
    return {
      filePath,
      fileName: path.basename(filePath),
      logicalSource: fallbackSource,
    };
  }
  if (typeof rawEntry !== "object") {
    return null;
  }
  const rawPath = safeText(rawEntry.filePath || rawEntry.path || rawEntry.file || rawEntry.name);
  if (!rawPath) {
    return null;
  }
  const filePath = path.isAbsolute(rawPath) ? path.resolve(rawPath) : path.resolve(baseDir, rawPath);
  return {
    filePath,
    fileName: safeText(rawEntry.fileName) || path.basename(filePath),
    logicalSource: normalizeSourceId(rawEntry.logicalSource || fallbackSource),
  };
}

function normalizeSourceRegistry(sourceRegistry = {}, baseDataDir = "") {
  const baseDir = baseDataDir ? path.resolve(baseDataDir) : process.cwd();
  const normalized = {};

  Object.entries(sourceRegistry || {}).forEach(([rawSource, rawEntries]) => {
    const sourceId = normalizeSourceId(rawSource);
    const list = Array.isArray(rawEntries) ? rawEntries : [];
    const entries = [];
    list.forEach((item) => {
      const entry = buildEntry(item, baseDir, sourceId);
      if (entry && entry.filePath) {
        const exists = entries.some(
          (stored) =>
            stored.filePath.toLowerCase() === entry.filePath.toLowerCase() &&
            stored.logicalSource === entry.logicalSource
        );
        if (!exists) {
          entries.push(entry);
        }
      }
    });
    normalized[sourceId] = entries;
  });

  if (!normalized.all) {
    normalized.all = [];
  }

  Object.values(normalized).forEach((list) => {
    (Array.isArray(list) ? list : []).forEach((entry) => {
      const exists = normalized.all.some(
        (stored) => stored.filePath.toLowerCase() === entry.filePath.toLowerCase()
      );
      if (!exists) {
        normalized.all.push({ ...entry });
      }
    });
  });

  return normalized;
}

function resolveSourceEntries(source, normalizedRegistry = {}) {
  const sourceId = normalizeSourceId(source || "all");
  if (Array.isArray(normalizedRegistry[sourceId]) && normalizedRegistry[sourceId].length) {
    return { source: sourceId, entries: normalizedRegistry[sourceId] };
  }
  return {
    source: "all",
    entries: Array.isArray(normalizedRegistry.all) ? normalizedRegistry.all : [],
  };
}

module.exports = {
  normalizeSourceRegistry,
  resolveSourceEntries,
};

