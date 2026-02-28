function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function estimateOperationalImpact(input = {}) {
  const baseOpen = toNumber(input.openEvents, 0);
  const criticalOpen = toNumber(input.criticalOpen, 0);
  const overdue = toNumber(input.overdueEvents, 0);
  const recurrence = toNumber(input.recurringFailures, 0);
  const durationHours = Math.max(1, toNumber(input.durationHours, 8));

  const escalationIndex = Math.round(
    criticalOpen * 2.4 + overdue * 1.2 + recurrence * 2 + baseOpen * 0.35 + durationHours * 0.45
  );
  const estimatedDowntimeHours = Math.max(
    0,
    Number(((criticalOpen * 0.8 + overdue * 0.3 + recurrence * 0.6) * (durationHours / 8)).toFixed(2))
  );
  const priority = escalationIndex >= 25 ? "Crítica" : escalationIndex >= 15 ? "Alta" : escalationIndex >= 8 ? "Média" : "Controlada";

  return {
    escalationIndex,
    estimatedDowntimeHours,
    priority,
  };
}

module.exports = {
  estimateOperationalImpact,
};

