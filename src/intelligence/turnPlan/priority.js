const { normalizeSeverity, normalizeStatus, severityValue } = require("../contracts");
const { parseDate, safeText } = require("../normalize/keyResolver");

function clamp(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return min;
  }
  if (numeric < min) {
    return min;
  }
  if (numeric > max) {
    return max;
  }
  return numeric;
}

function ageInDays(dateValue, referenceDate = new Date()) {
  const parsed = parseDate(dateValue);
  if (!parsed) {
    return null;
  }
  const diffMs = referenceDate.getTime() - parsed.getTime();
  return Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
}

function recencyPoints(ageDays) {
  if (ageDays === null || ageDays === undefined) {
    return 5;
  }
  if (ageDays <= 1) {
    return 20;
  }
  if (ageDays <= 3) {
    return 16;
  }
  if (ageDays <= 7) {
    return 12;
  }
  if (ageDays <= 14) {
    return 8;
  }
  if (ageDays <= 30) {
    return 4;
  }
  return 1;
}

function statusPoints(statusValue) {
  const normalized = normalizeStatus(statusValue);
  if (normalized === "open") {
    return 10;
  }
  if (normalized === "unknown") {
    return 4;
  }
  if (normalized === "closed") {
    return -20;
  }
  if (normalized === "cancelled") {
    return -30;
  }
  return 0;
}

function severityPoints(severityValueRaw) {
  const normalized = normalizeSeverity(severityValueRaw);
  return severityValue(normalized) * 18;
}

function recurrencePoints(recurrenceCount) {
  const count = Number(recurrenceCount);
  if (!Number.isFinite(count) || count <= 1) {
    return 0;
  }
  return clamp((Math.floor(count) - 1) * 4, 0, 15);
}

function criticalityPoints({ isCritical, riskScore, openDays }) {
  const critical = isCritical ? 10 : 0;
  const risk = clamp(Math.round(Number(riskScore || 0) / 10), 0, 10);
  const open = clamp(Math.round(Number(openDays || 0) / 2), 0, 8);
  return critical + risk + open;
}

function computePriorityScore(input = {}, options = {}) {
  const now = options.now instanceof Date ? options.now : new Date();
  const severity = safeText(input.severity);
  const status = safeText(input.status);
  const ageDays = ageInDays(input.detectedAt || input.eventTs || input.updatedAt, now);
  // Deterministic baseline: severity + recency + recurrence + status + criticality.
  const severityPart = severityPoints(severity);
  const recencyPart = recencyPoints(ageDays);
  const recurrencePart = recurrencePoints(input.recurrenceCount);
  const statusPart = statusPoints(status);
  const criticalityPart = criticalityPoints({
    isCritical: Boolean(input.isCritical),
    riskScore: Number(input.riskScore || 0),
    openDays: Number(input.openDays || 0),
  });
  const raw = severityPart + recencyPart + recurrencePart + statusPart + criticalityPart;
  const score = clamp(Math.round(raw), 0, 100);
  return {
    score,
    breakdown: {
      severity: severityPart,
      recency: recencyPart,
      recurrence: recurrencePart,
      status: statusPart,
      criticality: criticalityPart,
      ageDays,
    },
  };
}

function computeConfidence(input = {}) {
  const evidenceCount = Array.isArray(input.evidence) ? input.evidence.length : 0;
  const eventIdsCount = Array.isArray(input.eventIds) ? input.eventIds.filter(Boolean).length : 0;
  const hasRuleId = Boolean(safeText(input.ruleId));
  const hasTimestamp = Boolean(safeText(input.detectedAt || input.eventTs || input.updatedAt));
  const hasSeverity = Boolean(safeText(input.severity));
  const hasProject = Boolean(safeText(input.projectId));
  const normalizedStatus = normalizeStatus(input.status);

  let confidence = 35;
  confidence += clamp(evidenceCount * 8, 0, 24);
  confidence += eventIdsCount > 0 ? 10 : 0;
  confidence += hasRuleId ? 12 : 0;
  confidence += hasTimestamp ? 8 : 0;
  confidence += hasSeverity ? 6 : 0;
  confidence += hasProject ? 5 : 0;
  if (normalizedStatus === "unknown") {
    confidence -= 8;
  }
  return clamp(Math.round(confidence), 0, 100);
}

function computeEstimatedImpact({ priorityScore, recurrenceCount = 0, isCritical = false }) {
  const score = clamp(priorityScore, 0, 100);
  const recurrence = clamp(recurrenceCount, 0, 20);
  const criticalMultiplier = isCritical ? 1.35 : 1;
  const downtimeMin = Math.max(5, Math.round((score * 1.6 + recurrence * 9) * criticalMultiplier));
  const riskDelta = -Math.max(1, Math.round(score * 0.35 + recurrence * 0.8));
  const costDelta = Math.max(0, Math.round(score * 18 + recurrence * 120));
  return {
    downtimeMin,
    riskDelta,
    costDelta,
  };
}

module.exports = {
  computePriorityScore,
  computeConfidence,
  computeEstimatedImpact,
};
