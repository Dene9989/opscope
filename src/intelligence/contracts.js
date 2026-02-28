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
  if (!raw) {
    return "unknown";
  }
  if (
    raw.includes("conclu") ||
    raw.includes("normaliz") ||
    raw.includes("fechad") ||
    raw.includes("resolvid") ||
    raw.includes("finalizad") ||
    raw.includes("done")
  ) {
    return "closed";
  }
  if (raw.includes("cancel")) {
    return "cancelled";
  }
  if (
    raw.includes("pend") ||
    raw.includes("analise") ||
    raw.includes("rascunho") ||
    raw.includes("abert") ||
    raw.includes("exec") ||
    raw.includes("aguard")
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

