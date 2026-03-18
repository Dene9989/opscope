const { VALIDATION_SEVERITY } = require("../contracts");
const { createIssue } = require("./helpers");
const { summarizeSlice } = require("../aggregator");
const { startOfDay } = require("../utils");

function diffMetric(expected, actual) {
  return Number(expected || 0) - Number(actual || 0);
}

function validateConsistency(normalized, aggregated) {
  const issues = [];
  if (!normalized || !aggregated) {
    return issues;
  }
  const expectedCurrent = summarizeSlice(normalized.currentPeriod, "current");
  const expectedPrevious = normalized.previousPeriod
    ? summarizeSlice(normalized.previousPeriod, "previous")
    : null;

  const actualCurrent = aggregated.current;
  if (!actualCurrent || !actualCurrent.metrics) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.BLOCKER,
        "consistency.missing_current",
        "Agregado não contém dados do período atual.",
        {},
        "consistency",
        "consistency.current.required"
      )
    );
    return issues;
  }

  const pairs = [
    ["totalPlannedActivities", "planned.total"],
    ["totalExecutedActivities", "executed.total"],
    ["completed", "status.completed"],
    ["inProgress", "status.inProgress"],
    ["scheduled", "status.scheduled"],
    ["backlog", "status.backlog"],
    ["cancelled", "status.cancelled"],
    ["overdue", "overdue.total"],
    ["critical", "critical.total"],
    ["slaEligibleActivities", "sla.eligible"],
    ["slaOnTime", "sla.onTime"],
    ["slaLate", "sla.late"],
    ["slaNotApplicable", "sla.notApplicable"],
    ["docsRequired", "docs.required"],
    ["docsOk", "docs.ok"],
    ["docsPartial", "docs.partial"],
    ["docsUnknown", "docs.unknown"],
    ["docsCompliancePct", "docs.compliancePct"],
    ["hoursExecuted", "hours.executed"],
    ["evidenceCount", "evidence.count"],
    ["rdoCount", "rdo.count"],
  ];

  pairs.forEach(([metric]) => {
    const expected = expectedCurrent.metrics[metric];
    const actual = actualCurrent.metrics[metric];
    const diff = diffMetric(expected, actual);
    if (Math.abs(diff) > 0.01) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "consistency.metric_mismatch",
          `Métrica ${metric} divergente entre normalizado e agregado.`,
          { metric, expected, actual },
          "consistency",
          "consistency.metrics.match"
        )
      );
    }
  });

  const statusSum =
    actualCurrent.metrics.completed +
    actualCurrent.metrics.inProgress +
    actualCurrent.metrics.scheduled +
    actualCurrent.metrics.backlog +
    actualCurrent.metrics.cancelled;

  if (statusSum !== actualCurrent.activityCounts.plannedInPeriod) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.BLOCKER,
        "consistency.status_sum",
        "Soma de status não bate com atividades planejadas no período.",
        { statusSum, plannedInPeriod: actualCurrent.activityCounts.plannedInPeriod },
        "consistency",
        "consistency.status.sum"
      )
    );
  }

  if (
    actualCurrent.metrics.slaEligibleActivities !==
    actualCurrent.metrics.slaOnTime + actualCurrent.metrics.slaLate
  ) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.BLOCKER,
        "consistency.sla_sum",
        "SLA elegível não bate com onTime + late.",
        {
          eligible: actualCurrent.metrics.slaEligibleActivities,
          onTime: actualCurrent.metrics.slaOnTime,
          late: actualCurrent.metrics.slaLate,
        },
        "consistency",
        "consistency.sla.sum"
      )
    );
  }

  if (actualCurrent.metrics.docsOk + actualCurrent.metrics.docsPartial > actualCurrent.metrics.docsRequired) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.BLOCKER,
        "consistency.docs_sum",
        "Docs ok/parcial excedem docs required.",
        {
          docsOk: actualCurrent.metrics.docsOk,
          docsPartial: actualCurrent.metrics.docsPartial,
          docsRequired: actualCurrent.metrics.docsRequired,
        },
        "consistency",
        "consistency.docs.sum"
      )
    );
  }

  const expectedDocsPct = actualCurrent.metrics.docsRequired
    ? Math.round((actualCurrent.metrics.docsOk / actualCurrent.metrics.docsRequired) * 100)
    : 0;
  if (expectedDocsPct !== actualCurrent.metrics.docsCompliancePct) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.BLOCKER,
        "consistency.docs_pct",
        "DocsCompliancePct não bate com docsOk/docsRequired.",
        {
          docsCompliancePct: actualCurrent.metrics.docsCompliancePct,
          expectedDocsPct,
        },
        "consistency",
        "consistency.docs.pct"
      )
    );
  }

  if (actualCurrent.metrics.overdue > actualCurrent.activityCounts.plannedInPeriod) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.BLOCKER,
        "consistency.overdue_range",
        "Overdue excede planejadas no período.",
        {
          overdue: actualCurrent.metrics.overdue,
          planned: actualCurrent.activityCounts.plannedInPeriod,
        },
        "consistency",
        "consistency.overdue.range"
      )
    );
  }

  if (aggregated.comparisonMode === "provided" && !aggregated.previous) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.BLOCKER,
        "consistency.previous_missing",
        "comparisonMode provided exige previous agregated.",
        {},
        "consistency",
        "consistency.comparison.previous"
      )
    );
  }

  if (expectedPrevious && aggregated.previous && aggregated.previous.metrics) {
    const prevActual = aggregated.previous.metrics.totalExecutedActivities;
    const prevExpected = expectedPrevious.metrics.totalExecutedActivities;
    if (prevActual !== prevExpected) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "consistency.previous_metric",
          "Métrica do período anterior divergente.",
          {
            metric: "totalExecutedActivities",
            expected: prevExpected,
            actual: prevActual,
          },
          "consistency",
          "consistency.previous.metric"
        )
      );
    }
  }

  if (actualCurrent.metrics.hoursExecuted < 0) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.WARNING,
        "consistency.hours_negative",
        "Horas executadas negativas.",
        { hoursExecuted: actualCurrent.metrics.hoursExecuted },
        "consistency",
        "consistency.hours.range"
      )
    );
  }

  if (actualCurrent.metrics.evidenceCount < 0) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.WARNING,
        "consistency.evidence_negative",
        "Contagem de evidências negativa.",
        { evidenceCount: actualCurrent.metrics.evidenceCount },
        "consistency",
        "consistency.evidence.range"
      )
    );
  }

  if (actualCurrent.metrics.overdue > 0 && aggregated.current && aggregated.current.period) {
    const cutoff = aggregated.current.period.end;
    if (cutoff && startOfDay(cutoff) > startOfDay(new Date("2100-01-01"))) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.INFO,
          "consistency.cutoff_future",
          "Cutoff muito distante, verifique período.",
          { cutoff },
          "consistency",
          "consistency.cutoff.range"
        )
      );
    }
  }

  return issues;
}

module.exports = { validateConsistency };
