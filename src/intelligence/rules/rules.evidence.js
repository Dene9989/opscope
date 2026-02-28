const { stableHash, safeText } = require("../normalize/keyResolver");

function clipText(value, max = 180) {
  const text = safeText(value);
  if (!text) {
    return "";
  }
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max - 3)}...`;
}

function summarizeEvent(event) {
  if (!event) {
    return {};
  }
  return {
    eventId: event.eventId || event.id || "",
    title: clipText(event.title),
    status: event.status || "",
    severity: event.severity || "",
    source: event.source || "",
    projectId: event.projectId || "",
    eventTs: event.eventTs || "",
    asset: event.asset || "",
  };
}

function createInconsistency({
  rule,
  severity,
  title,
  message,
  source = "",
  projectId = "",
  eventIds = [],
  evidence = [],
  metadata = {},
  detectedAt = new Date().toISOString(),
}) {
  const id = stableHash([
    rule && rule.id ? rule.id : "",
    source,
    projectId,
    message,
    ...eventIds.slice(0, 8),
  ]);
  return {
    id,
    ruleId: rule && rule.id ? rule.id : "",
    severity: severity || (rule && rule.severity) || "medium",
    title: title || (rule && rule.title) || "Inconsistência detectada",
    message: clipText(message, 380),
    source: source || "",
    projectId: projectId || "",
    eventIds: Array.isArray(eventIds) ? eventIds.filter(Boolean) : [],
    evidence: Array.isArray(evidence) ? evidence : [],
    metadata: metadata && typeof metadata === "object" ? metadata : {},
    status: "open",
    detectedAt,
    updatedAt: detectedAt,
  };
}

module.exports = {
  clipText,
  summarizeEvent,
  createInconsistency,
};

