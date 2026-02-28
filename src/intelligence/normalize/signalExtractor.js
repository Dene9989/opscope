const { parseDate, flattenForSearch } = require("./keyResolver");
const { normalizeStatus, severityValue } = require("../contracts");

function daysDiff(fromDate, toDate) {
  const from = fromDate instanceof Date ? fromDate : parseDate(fromDate);
  const to = toDate instanceof Date ? toDate : parseDate(toDate);
  if (!from || !to) {
    return null;
  }
  return Math.floor((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}

function hasAnyToken(text, tokens = []) {
  const haystack = String(text || "");
  return tokens.some((token) => haystack.includes(token));
}

function extractSignals(event, nowInput = new Date()) {
  const now = nowInput instanceof Date ? nowInput : new Date();
  const eventDate = parseDate(event.eventTs || "");
  const dueDate = parseDate(event.dueTs || "");
  const doneDate = parseDate(event.doneTs || "");

  const statusNormalized = normalizeStatus(event.status);
  const isClosed = statusNormalized === "closed" || statusNormalized === "cancelled";
  const isOpen = !isClosed;
  const isCritical = severityValue(event.severity) >= 4;
  const isHigh = severityValue(event.severity) >= 3;
  const overdue = Boolean(dueDate && isOpen && dueDate < now);

  const text = flattenForSearch(event.details);
  const mentionsFailure = hasAnyToken(text, [
    "falha",
    "erro",
    "trip",
    "desarme",
    "indisponibil",
    "falha de comando",
  ]);
  const hasRootCause = hasAnyToken(text, ["causa raiz", "root cause", "diagnostico", "diagnóstico"]);
  const hasProcedure = hasAnyToken(text, ["procedimento", "checklist", "roteiro"]);
  const hasEvidence = hasAnyToken(text, ["anexo", "evidencia", "evidência", "foto", "imagem", "arquivo"]);

  const openDays = isOpen && eventDate ? Math.max(0, daysDiff(eventDate, now) || 0) : 0;
  const closureDays = isClosed && eventDate && doneDate ? Math.max(0, daysDiff(eventDate, doneDate) || 0) : 0;

  let riskScore = 0;
  if (isCritical) riskScore += 45;
  else if (isHigh) riskScore += 28;
  if (overdue) riskScore += 24;
  if (mentionsFailure) riskScore += 18;
  if (!hasProcedure) riskScore += 8;
  if (!hasEvidence) riskScore += 5;
  if (isOpen && openDays > 3) riskScore += 12;

  const riskLevel =
    riskScore >= 70 ? "critical" : riskScore >= 45 ? "high" : riskScore >= 25 ? "medium" : "low";

  return {
    statusNormalized,
    isOpen,
    isClosed,
    isCritical,
    isHigh,
    overdue,
    openDays,
    closureDays,
    mentionsFailure,
    hasRootCause,
    hasProcedure,
    hasEvidence,
    riskScore,
    riskLevel,
  };
}

module.exports = {
  extractSignals,
};

