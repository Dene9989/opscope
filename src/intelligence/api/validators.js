const { normalizeSourceId, safeText } = require("../normalize/keyResolver");

function parseDateParam(value) {
  const text = safeText(value);
  if (!text) {
    return "";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return "";
  }
  return text;
}

function parseFilters(raw) {
  if (!raw) {
    return {};
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return { ...raw };
  }
  const text = safeText(raw);
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

function parseInteger(value, fallback = 0, { min = 0, max = 1000 } = {}) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  const rounded = Math.floor(numeric);
  if (rounded < min) {
    return min;
  }
  if (rounded > max) {
    return max;
  }
  return rounded;
}

function parseScopeFromRequest(req, payload = {}) {
  const source = normalizeSourceId(payload.source || (req && req.query && req.query.source) || "all");
  const fromRaw = payload.from || (req && req.query && req.query.from) || "";
  const toRaw = payload.to || (req && req.query && req.query.to) || "";
  const from = parseDateParam(fromRaw);
  const to = parseDateParam(toRaw);
  const filters = parseFilters(
    payload.filters !== undefined
      ? payload.filters
      : req && req.query
        ? req.query.filters
        : {}
  );
  const projectId = safeText(
    payload.projectId ||
      filters.projectId ||
      filters.projetoId ||
      (req && req.query && (req.query.projectId || req.query.projetoId)) ||
      ""
  );
  return {
    source,
    from,
    to,
    filters,
    projectId,
  };
}

module.exports = {
  parseDateParam,
  parseFilters,
  parseInteger,
  parseScopeFromRequest,
};

