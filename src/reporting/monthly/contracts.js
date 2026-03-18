const { normalizeKey, normalizeText } = require("./utils");

const COMPARISON_MODES = {
  PROVIDED: "provided",
  RECALCULATED: "recalculated",
};

const INTEGRITY_STATUS = {
  OK: "ok",
  WARNING: "warning",
  BLOCKED: "blocked",
};

const VALIDATION_SEVERITY = {
  BLOCKER: "BLOCKER",
  WARNING: "WARNING",
  INFO: "INFO",
};

const STATUS_NORMALIZED = {
  AGENDADA: "agendada",
  LIBERADA: "liberada",
  EM_EXECUCAO: "em_execucao",
  ENCERRAMENTO: "encerramento",
  CONCLUIDA: "concluida",
  BACKLOG: "backlog",
  CANCELADA: "cancelada",
  UNKNOWN: "unknown",
};

const STATUS_SYNONYMS = {
  agendada: STATUS_NORMALIZED.AGENDADA,
  programada: STATUS_NORMALIZED.AGENDADA,
  planejamento: STATUS_NORMALIZED.AGENDADA,
  planejada: STATUS_NORMALIZED.AGENDADA,
  liberada: STATUS_NORMALIZED.LIBERADA,
  liberado: STATUS_NORMALIZED.LIBERADA,
  "em execucao": STATUS_NORMALIZED.EM_EXECUCAO,
  "em_execucao": STATUS_NORMALIZED.EM_EXECUCAO,
  "em andamento": STATUS_NORMALIZED.EM_EXECUCAO,
  executando: STATUS_NORMALIZED.EM_EXECUCAO,
  encerramento: STATUS_NORMALIZED.ENCERRAMENTO,
  "aguardando conclusao": STATUS_NORMALIZED.ENCERRAMENTO,
  concluida: STATUS_NORMALIZED.CONCLUIDA,
  concluido: STATUS_NORMALIZED.CONCLUIDA,
  finalizada: STATUS_NORMALIZED.CONCLUIDA,
  finalizado: STATUS_NORMALIZED.CONCLUIDA,
  backlog: STATUS_NORMALIZED.BACKLOG,
  pendencia: STATUS_NORMALIZED.BACKLOG,
  cancelada: STATUS_NORMALIZED.CANCELADA,
  cancelado: STATUS_NORMALIZED.CANCELADA,
};

const PRIORITY_NORMALIZED = {
  CRITICA: "critica",
  ALTA: "alta",
  MEDIA: "media",
  BAIXA: "baixa",
  NORMAL: "normal",
  UNKNOWN: "unknown",
};

const PRIORITY_SYNONYMS = {
  critica: PRIORITY_NORMALIZED.CRITICA,
  critico: PRIORITY_NORMALIZED.CRITICA,
  alta: PRIORITY_NORMALIZED.ALTA,
  medio: PRIORITY_NORMALIZED.MEDIA,
  media: PRIORITY_NORMALIZED.MEDIA,
  baixa: PRIORITY_NORMALIZED.BAIXA,
  normal: PRIORITY_NORMALIZED.NORMAL,
};

const DOC_KEYS = ["apr", "os", "pte", "pt"];

const DOC_REQUIREMENTS_BY_CATEGORY = {
  "preventiva simples": ["apr", "os"],
  "preventiva critica": ["apr", "os", "pte", "pt"],
  "corretiva eletrica": ["apr", "os", "pte", "pt"],
  inspecao: ["apr", "os"],
};

const DOC_VALUE_PRESENT = new Set(["sim", "true", "1", "ok", "aprovado", "completo", "presente"]);
const DOC_VALUE_PARTIAL = new Set(["parcial", "incompleto", "pendente"]);
const DOC_VALUE_ABSENT = new Set(["nao", "não", "false", "0", "ausente"]);

function normalizeStatus(raw) {
  const key = normalizeKey(raw);
  if (!key) {
    return STATUS_NORMALIZED.UNKNOWN;
  }
  const direct = STATUS_SYNONYMS[key];
  if (direct) {
    return direct;
  }
  return STATUS_NORMALIZED.UNKNOWN;
}

function normalizePriority(raw) {
  const key = normalizeKey(raw);
  if (!key) {
    return PRIORITY_NORMALIZED.UNKNOWN;
  }
  return PRIORITY_SYNONYMS[key] || PRIORITY_NORMALIZED.UNKNOWN;
}

function normalizeCategory(raw) {
  const key = normalizeKey(raw);
  return key || "desconhecida";
}

function normalizeDocValue(raw) {
  if (raw === null || raw === undefined || raw === "") {
    return "unknown";
  }
  if (typeof raw === "boolean") {
    return raw ? "present" : "absent";
  }
  const text = normalizeText(raw, { lower: true });
  if (!text) {
    return "unknown";
  }
  if (DOC_VALUE_PRESENT.has(text)) {
    return "present";
  }
  if (DOC_VALUE_PARTIAL.has(text)) {
    return "partial";
  }
  if (DOC_VALUE_ABSENT.has(text)) {
    return "absent";
  }
  return "unknown";
}

function getRequiredDocsForActivity(activity = {}) {
  const critical = Boolean(activity.critical);
  if (critical) {
    return { requiredDocs: ["apr", "os", "pte", "pt"], isUnknown: false, reason: "critical" };
  }
  const categoryKey = normalizeCategory(activity.category || activity.categoria);
  if (!categoryKey || categoryKey === "desconhecida") {
    return { requiredDocs: null, isUnknown: true, reason: "unknown_category" };
  }
  const requiredDocs = DOC_REQUIREMENTS_BY_CATEGORY[categoryKey];
  if (!requiredDocs) {
    return { requiredDocs: null, isUnknown: true, reason: "unmapped_category" };
  }
  return { requiredDocs, isUnknown: false, reason: "category" };
}

module.exports = {
  COMPARISON_MODES,
  INTEGRITY_STATUS,
  VALIDATION_SEVERITY,
  STATUS_NORMALIZED,
  PRIORITY_NORMALIZED,
  DOC_KEYS,
  DOC_REQUIREMENTS_BY_CATEGORY,
  normalizeStatus,
  normalizePriority,
  normalizeCategory,
  normalizeDocValue,
  getRequiredDocsForActivity,
};
