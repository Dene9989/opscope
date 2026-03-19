const { formatDelta, formatDeltaPct } = require("./formatters");

function computeDelta(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) {
    return { delta: null, deltaPct: null };
  }
  const delta = current - previous;
  const deltaPct = previous === 0 ? null : (delta / previous) * 100;
  return { delta, deltaPct };
}

function buildComparisonItem({ key, label, current, previous, format }) {
  const { delta, deltaPct } = computeDelta(current, previous);
  const trend = delta === null ? "neutral" : delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  return {
    key,
    label,
    current,
    previous,
    delta,
    deltaPct,
    deltaFormatted: formatDelta(delta),
    deltaPctFormatted: formatDeltaPct(deltaPct),
    trend,
    format,
    available: Number.isFinite(previous),
  };
}

function buildComparison(aggregated) {
  const mode = aggregated && aggregated.comparisonMode ? aggregated.comparisonMode : "recalculated";
  const current = aggregated && aggregated.current ? aggregated.current.metrics : null;
  const previous = aggregated && aggregated.previous ? aggregated.previous.metrics : null;

  if (!current || !previous) {
    return {
      available: false,
      mode,
      reason: "previous_period_missing",
      items: [],
    };
  }

  const items = [
    buildComparisonItem({
      key: "totalPlannedActivities",
      label: "Planejadas no mês",
      current: current.totalPlannedActivities,
      previous: previous.totalPlannedActivities,
      format: "number",
    }),
    buildComparisonItem({
      key: "totalExecutedActivities",
      label: "Executadas no mês",
      current: current.totalExecutedActivities,
      previous: previous.totalExecutedActivities,
      format: "number",
    }),
    buildComparisonItem({
      key: "backlog",
      label: "Backlog",
      current: current.backlog,
      previous: previous.backlog,
      format: "number",
    }),
    buildComparisonItem({
      key: "overdue",
      label: "Vencidas",
      current: current.overdue,
      previous: previous.overdue,
      format: "number",
    }),
    buildComparisonItem({
      key: "slaOnTimePct",
      label: "SLA no prazo",
      current: current.slaOnTimePct,
      previous: previous.slaOnTimePct,
      format: "percent",
    }),
    buildComparisonItem({
      key: "docsCompliancePct",
      label: "Compliance documental",
      current: current.docsCompliancePct,
      previous: previous.docsCompliancePct,
      format: "percent",
    }),
    buildComparisonItem({
      key: "hoursExecuted",
      label: "Horas executadas",
      current: current.hoursExecuted,
      previous: previous.hoursExecuted,
      format: "hours",
    }),
    buildComparisonItem({
      key: "evidenceCount",
      label: "Evidências",
      current: current.evidenceCount,
      previous: previous.evidenceCount,
      format: "number",
    }),
  ];

  return {
    available: true,
    mode,
    items,
  };
}

module.exports = {
  buildComparison,
  computeDelta,
};
