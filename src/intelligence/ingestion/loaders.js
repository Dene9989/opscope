const fs = require("fs");
const path = require("path");
const INTELLIGENCE_INGEST_MAX_BYTES = Math.min(
  128 * 1024 * 1024,
  Math.max(512 * 1024, Number(process.env.OPSCOPE_INTELLIGENCE_INGEST_MAX_BYTES) || 24 * 1024 * 1024)
);
const oversizedFileWarned = new Set();

function readJsonSafe(filePath, fallback = null) {
  if (!filePath || !fs.existsSync(filePath)) {
    return fallback;
  }
  try {
    const stats = fs.statSync(filePath);
    if (stats && Number.isFinite(Number(stats.size)) && Number(stats.size) > INTELLIGENCE_INGEST_MAX_BYTES) {
      const key = path.resolve(filePath);
      if (!oversizedFileWarned.has(key)) {
        oversizedFileWarned.add(key);
        console.warn("[intelligence] Ingestao ignorou JSON por tamanho excessivo.", {
          file: filePath,
          bytes: stats.size,
          maxBytes: INTELLIGENCE_INGEST_MAX_BYTES,
        });
      }
      return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function recordsFromPayload(payload, rootPath = "payload") {
  if (Array.isArray(payload)) {
    return payload.map((record, index) => ({
      record,
      recordPath: `${rootPath}[${index}]`,
    }));
  }
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const keys = Object.keys(payload);
  const arrayKeys = keys.filter((key) => Array.isArray(payload[key]));
  if (!arrayKeys.length) {
    return [{ record: payload, recordPath: rootPath }];
  }
  const rows = [];
  arrayKeys.forEach((key) => {
    payload[key].forEach((record, index) => {
      rows.push({
        record,
        recordPath: `${rootPath}.${key}[${index}]`,
      });
    });
  });
  return rows;
}

function loadRecordsFromEntries(entries = []) {
  const rows = [];
  (Array.isArray(entries) ? entries : []).forEach((entry) => {
    const filePath = entry && entry.filePath ? path.resolve(entry.filePath) : "";
    if (!filePath || !fs.existsSync(filePath)) {
      return;
    }
    const payload = readJsonSafe(filePath, null);
    const extracted = recordsFromPayload(payload, entry.fileName || path.basename(filePath));
    extracted.forEach((item, index) => {
      if (!item || !item.record || typeof item.record !== "object") {
        return;
      }
      rows.push({
        source: entry.logicalSource || "all",
        filePath,
        fileName: entry.fileName || path.basename(filePath),
        recordPath: item.recordPath || `${entry.fileName || path.basename(filePath)}[${index}]`,
        record: item.record,
      });
    });
  });
  return rows;
}

module.exports = {
  readJsonSafe,
  recordsFromPayload,
  loadRecordsFromEntries,
};
