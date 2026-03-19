const {
  buildPlannedSet,
  buildExecutedSet,
  countPlannedActivities,
  countExecutedActivities,
  countByStatus,
  countByStatusInPeriod,
  countCritical,
  countOverdue,
  computeSlaMetrics,
  computeDocsMetrics,
  computeHoursExecuted,
  computeEvidenceCount,
  countRdos,
  groupByField,
  buildWeeklyBreakdown,
  METRIC_TRACEABILITY,
  isCancelada,
} = require("./metrics");
const { STATUS_NORMALIZED } = require("./contracts");

function summarizeSlice(slice, label) {
  const period = slice.period || {};
  const activities = Array.isArray(slice.activities) ? slice.activities : [];
  const rdos = Array.isArray(slice.rdos) ? slice.rdos : [];

  const plannedSet = buildPlannedSet(activities, period);
  const executedSet = buildExecutedSet(activities, period);
  const backlogSet = plannedSet.filter((activity) => activity.status === STATUS_NORMALIZED.BACKLOG);
  const periodSet = activities.filter((activity) => activity && activity.isValid);
  const statusCounts = countByStatusInPeriod(periodSet, period);
  const totalPlannedActivities = countPlannedActivities(plannedSet);
  const totalExecutedActivities = countExecutedActivities(executedSet);
  const overdue = countOverdue(plannedSet, period.end);
  const critical = countCritical(plannedSet);
  const sla = computeSlaMetrics(executedSet);
  const docs = computeDocsMetrics(executedSet);
  const hoursExecuted = computeHoursExecuted(executedSet);
  const evidenceCount = computeEvidenceCount(executedSet, rdos, period);
  const rdoCount = countRdos(rdos, period);

  const completed = statusCounts.concluida || 0;
  const inProgress = statusCounts.em_execucao || 0;
  const scheduled = statusCounts.agendada || 0;
  const backlog = statusCounts.backlog || 0;
  const cancelled = statusCounts.cancelada || 0;

  const breakdowns = {
    byStatus: statusCounts,
    byType: groupByField(plannedSet, "category"),
    byTypeExecuted: groupByField(executedSet, "category"),
    byLocation: groupByField(plannedSet, "location"),
    byLocationExecuted: groupByField(executedSet, "location"),
    byTeam: groupByField(plannedSet, "team"),
    byTeamExecuted: groupByField(executedSet, "team"),
    byPriority: groupByField(plannedSet, "priority"),
    byPriorityExecuted: groupByField(executedSet, "priority"),
    byWeek: buildWeeklyBreakdown(plannedSet, executedSet, backlogSet, period),
  };

  const plannedNonCancelled = plannedSet.filter((activity) => !isCancelada(activity.status)).length;
  const totalPlannedCheck = plannedNonCancelled;

  return {
    label,
    period,
    metrics: {
      totalPlannedActivities,
      totalExecutedActivities,
      completed,
      inProgress,
      scheduled,
      backlog,
      overdue,
      cancelled,
      critical,
      slaEligibleActivities: sla.slaEligibleActivities,
      slaOnTime: sla.slaOnTime,
      slaLate: sla.slaLate,
      slaNotApplicable: sla.slaNotApplicable,
      slaOnTimePct: sla.slaOnTimePct,
      docsRequired: docs.docsRequired,
      docsOk: docs.docsOk,
      docsPartial: docs.docsPartial,
      docsUnknown: docs.docsUnknown,
      docsCompliancePct: docs.docsCompliancePct,
      hoursExecuted,
      evidenceCount,
      rdoCount,
      plannedNonCancelled: totalPlannedCheck,
    },
    breakdowns,
    activityCounts: {
      totalActivitiesInSlice: activities.length,
      plannedInPeriod: plannedSet.length,
      executedInPeriod: executedSet.length,
    },
  };
}

function aggregateMonthlyReport(normalizedInput) {
  if (!normalizedInput || typeof normalizedInput !== "object") {
    return null;
  }

  const current = summarizeSlice(normalizedInput.currentPeriod, "current");
  const previous = normalizedInput.previousPeriod
    ? summarizeSlice(normalizedInput.previousPeriod, "previous")
    : null;

  const comparisonMode = normalizedInput.comparisonMode || "recalculated";

  return {
    meta: {
      projectId: normalizedInput.meta && normalizedInput.meta.projectId,
      projectName: normalizedInput.meta && normalizedInput.meta.projectName,
      clientName: normalizedInput.meta && normalizedInput.meta.clientName,
      plantName: normalizedInput.meta && normalizedInput.meta.plantName,
      emittedAt: normalizedInput.meta && normalizedInput.meta.emittedAt,
      reportVersion: normalizedInput.meta && normalizedInput.meta.reportVersion,
      comparisonMode,
    },
    current,
    previous,
    comparisonMode,
    traceability: METRIC_TRACEABILITY,
    normalization: normalizedInput.normalization || {},
    statusCatalog: Object.values(STATUS_NORMALIZED),
  };
}

module.exports = {
  aggregateMonthlyReport,
  summarizeSlice,
};
