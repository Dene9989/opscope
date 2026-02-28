const SEVERITY_SCALE = Object.freeze({
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
});

const DEFAULT_REBUILD_TTL_MS = Math.max(
  30000,
  Number(process.env.OPSCOPE_INTELLIGENCE_TTL_MS) || 5 * 60 * 1000
);

function safeText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function normalizeSeverity(value) {
  const raw = safeText(value).toLowerCase();
  if (!raw) {
    return "info";
  }
  if (raw.includes("crit")) {
    return "critical";
  }
  if (raw.includes("alta") || raw.includes("high") || raw === "s1") {
    return "high";
  }
  if (raw.includes("méd") || raw.includes("med") || raw === "s2") {
    return "medium";
  }
  if (raw.includes("baix") || raw.includes("low") || raw === "s3" || raw === "s4") {
    return "low";
  }
  if (SEVERITY_SCALE[raw] !== undefined) {
    return raw;
  }
  return "info";
}

function severityValue(value) {
  return SEVERITY_SCALE[normalizeSeverity(value)] || 0;
}

function compareSeverityDesc(a, b) {
  return severityValue(b) - severityValue(a);
}

function normalizeStatus(value) {
  const raw = safeText(value).toLowerCase();
  const token = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (!raw) {
    return "unknown";
  }
  if (
    token.includes("conclu") ||
    token.includes("normaliz") ||
    token.includes("fechad") ||
    token.includes("resolvid") ||
    token.includes("finalizad") ||
    token.includes("encerrad") ||
    token.includes("executad") ||
    token.includes("done")
  ) {
    return "closed";
  }
  if (token.includes("cancel")) {
    return "cancelled";
  }
  if (
    token.includes("pend") ||
    token.includes("analise") ||
    token.includes("rascunh") ||
    token.includes("abert") ||
    token.includes("exec") ||
    token.includes("aguard") ||
    token.includes("andamento") ||
    token.includes("agend") ||
    token.includes("planejad") ||
    token.includes("programad") ||
    token.includes("liberad") ||
    token.includes("ativo") ||
    token.includes("pronta")
  ) {
    return "open";
  }
  return "unknown";
}

module.exports = {
  SEVERITY_SCALE,
  DEFAULT_REBUILD_TTL_MS,
  safeText,
  normalizeSeverity,
  severityValue,
  compareSeverityDesc,
  normalizeStatus,
};
