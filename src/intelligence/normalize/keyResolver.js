const crypto = require("crypto");

const TIMESTAMP_KEYS = [
  "event_ts",
  "timestamp",
  "createdAt",
  "updatedAt",
  "registeredAt",
  "registradoEm",
  "date",
  "data",
  "datetime",
  "ocorridoEm",
  "occurredAt",
  "inicio",
  "inicioEm",
  "fim",
  "fimEm",
  "normalizedAt",
  "normalizadaEm",
];

const DUE_DATE_KEYS = [
  "dueAt",
  "dueDate",
  "deadline",
  "prazo",
  "dataPrazo",
  "plannedAt",
  "programadaPara",
];

const DONE_DATE_KEYS = [
  "doneAt",
  "completedAt",
  "closedAt",
  "normalizadaEm",
  "normalizadaAt",
  "resolvedAt",
  "finishedAt",
];

const ID_KEYS = ["id", "uuid", "eventId", "codigo", "code", "tag"];
const TITLE_KEYS = ["title", "titulo", "nome", "name", "descricao", "description", "mensagem", "message"];
const TYPE_KEYS = ["eventType", "tipo", "type", "categoria", "category", "action"];
const STATUS_KEYS = ["status", "state", "situacao", "fase"];
const SEVERITY_KEYS = ["severity", "criticidade", "prioridade", "risk", "nivel"];
const USER_KEYS = [
  "userId",
  "usuarioId",
  "ownerId",
  "responsavelId",
  "createdBy",
  "updatedBy",
  "email",
  "matricula",
  "username",
  "usuario",
  "name",
];
const PROJECT_KEYS = [
  "projectId",
  "projetoId",
  "project_id",
  "projectCode",
  "project",
  "projeto",
  "uen",
];
const ASSET_KEYS = [
  "asset",
  "ativo",
  "equipamento",
  "equipment",
  "bay",
  "alimentador",
  "subestacao",
  "substation",
];

function safeText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function normalizeSourceId(value) {
  return safeText(value).toLowerCase().replace(/[^a-z0-9_-]+/g, "_") || "all";
}

function stableHash(parts) {
  const hash = crypto.createHash("sha1");
  hash.update((Array.isArray(parts) ? parts : [parts]).map((item) => safeText(item)).join("|"));
  return hash.digest("hex");
}

function parseDate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return null;
    }
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const raw = safeText(value);
  if (!raw) {
    return null;
  }

  const brDate = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (brDate) {
    const date = new Date(
      Number(brDate[3]),
      Number(brDate[2]) - 1,
      Number(brDate[1]),
      Number(brDate[4] || 0),
      Number(brDate[5] || 0),
      Number(brDate[6] || 0)
    );
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const isoDateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateOnly) {
    const date = new Date(`${isoDateOnly[1]}-${isoDateOnly[2]}-${isoDateOnly[3]}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(raw.replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toIso(date) {
  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
}

function toDateKey(date) {
  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function walkRecord(record, callback, depth = 0, maxDepth = 3) {
  if (!record || typeof record !== "object") {
    return;
  }
  if (depth > maxDepth) {
    return;
  }
  Object.entries(record).forEach(([key, value]) => {
    callback(key, value, depth);
    if (value && typeof value === "object") {
      if (Array.isArray(value)) {
        value.slice(0, 30).forEach((item) => {
          if (item && typeof item === "object") {
            walkRecord(item, callback, depth + 1, maxDepth);
          }
        });
      } else {
        walkRecord(value, callback, depth + 1, maxDepth);
      }
    }
  });
}

function buildLookup(record) {
  const lookup = new Map();
  walkRecord(record, (key, value) => {
    const normalizedKey = safeText(key).toLowerCase();
    if (!normalizedKey || lookup.has(normalizedKey)) {
      return;
    }
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      lookup.set(normalizedKey, value);
    }
  });
  return lookup;
}

function inferFirstValue(record, keys = []) {
  if (!record || typeof record !== "object") {
    return "";
  }
  const lookup = buildLookup(record);
  for (const key of keys) {
    const value = lookup.get(safeText(key).toLowerCase());
    if (value !== undefined && value !== null && safeText(value)) {
      return safeText(value);
    }
  }
  return "";
}

function inferDate(record, keys = []) {
  if (!record || typeof record !== "object") {
    return null;
  }
  const lookup = buildLookup(record);
  for (const key of keys) {
    const value = lookup.get(safeText(key).toLowerCase());
    const parsed = parseDate(value);
    if (parsed) {
      return parsed;
    }
  }
  return null;
}

function flattenForSearch(value) {
  try {
    return JSON.stringify(value || {})
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  } catch (_) {
    return "";
  }
}

module.exports = {
  TIMESTAMP_KEYS,
  DUE_DATE_KEYS,
  DONE_DATE_KEYS,
  ID_KEYS,
  TITLE_KEYS,
  TYPE_KEYS,
  STATUS_KEYS,
  SEVERITY_KEYS,
  USER_KEYS,
  PROJECT_KEYS,
  ASSET_KEYS,
  safeText,
  normalizeSourceId,
  stableHash,
  parseDate,
  toIso,
  toDateKey,
  inferFirstValue,
  inferDate,
  flattenForSearch,
};

