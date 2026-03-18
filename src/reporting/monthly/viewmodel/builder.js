const {
  formatNumber,
  formatPercent,
  formatHours,
  formatDateRange,
  formatDateTime,
} = require("./formatters");
const { buildComparison } = require("./comparison");
const { buildInsights } = require("./insights");
const {
  buildExecutiveSummary,
  buildTechnicalHighlights,
  buildRiskAssessment,
  buildRecommendations,
  buildSafetyCompliance,
} = require("./narratives");
const {
  fallbackTrendAnalysis,
  fallbackOperationalBreakdown,
  fallbackConsolidatedTables,
  fallbackAppendix,
  fallbackActionPlan,
} = require("./fallbacks");
const { KPI_TARGETS, VIEWMODEL_TONE } = require("./contracts");
const { formatLabel } = require("./labels");

function mapToTable(map, total, options = {}) {
  const entries = Object.entries(map || {});
  const sum = entries.reduce((acc, [, count]) => acc + (Number(count) || 0), 0);
  const base = Math.max(Number(total) || 0, sum || 0);
  const labelContext = options.labelContext || "";
  return entries
    .map(([label, count]) => {
      const safeCount = Number(count) || 0;
      const pct = base ? Math.round((safeCount / base) * 100) : 0;
      return {
        label: formatLabel(label, labelContext),
        count: safeCount,
        pct: Math.min(100, Math.max(0, pct)),
      };
    })
    .sort((a, b) => b.count - a.count);
}

function buildKpiCard({ key, label, value, formatted, delta, deltaPct, tone }) {
  return {
    key,
    label,
    value,
    formatted,
    delta,
    deltaPct,
    tone,
  };
}

function computeExecutionRatio(metrics) {
  const planned = metrics.totalPlannedActivities || 0;
  const executed = metrics.totalExecutedActivities || 0;
  return planned ? Math.round((executed / planned) * 100) : 0;
}

function buildKpis({ metrics, comparison }) {
  if (!metrics) {
    return { cards: [] };
  }
  const executionRatioPct = computeExecutionRatio(metrics);
  const cards = [];

  const byKey = (key) => comparison && comparison.available
    ? comparison.items.find((item) => item.key === key)
    : null;

  cards.push(
    buildKpiCard({
      key: "totalPlannedActivities",
      label: "Planejadas",
      value: metrics.totalPlannedActivities,
      formatted: formatNumber(metrics.totalPlannedActivities),
      delta: byKey("totalPlannedActivities")?.deltaFormatted,
      deltaPct: byKey("totalPlannedActivities")?.deltaPctFormatted,
      tone: VIEWMODEL_TONE.NEUTRAL,
    })
  );

  cards.push(
    buildKpiCard({
      key: "totalExecutedActivities",
      label: "Executadas",
      value: metrics.totalExecutedActivities,
      formatted: formatNumber(metrics.totalExecutedActivities),
      delta: byKey("totalExecutedActivities")?.deltaFormatted,
      deltaPct: byKey("totalExecutedActivities")?.deltaPctFormatted,
      tone: executionRatioPct >= KPI_TARGETS.executionRatioPct ? VIEWMODEL_TONE.POSITIVE : VIEWMODEL_TONE.WARNING,
    })
  );

  cards.push(
    buildKpiCard({
      key: "executionRatioPct",
      label: "Execução vs planejado",
      value: executionRatioPct,
      formatted: formatPercent(executionRatioPct),
      delta: "-",
      deltaPct: "-",
      tone: executionRatioPct >= KPI_TARGETS.executionRatioPct ? VIEWMODEL_TONE.POSITIVE : VIEWMODEL_TONE.WARNING,
    })
  );

  cards.push(
    buildKpiCard({
      key: "backlog",
      label: "Backlog",
      value: metrics.backlog,
      formatted: formatNumber(metrics.backlog),
      delta: byKey("backlog")?.deltaFormatted,
      deltaPct: byKey("backlog")?.deltaPctFormatted,
      tone: metrics.backlog > 0 ? VIEWMODEL_TONE.WARNING : VIEWMODEL_TONE.POSITIVE,
    })
  );

  cards.push(
    buildKpiCard({
      key: "overdue",
      label: "Overdue",
      value: metrics.overdue,
      formatted: formatNumber(metrics.overdue),
      delta: byKey("overdue")?.deltaFormatted,
      deltaPct: byKey("overdue")?.deltaPctFormatted,
      tone: metrics.overdue > 0 ? VIEWMODEL_TONE.WARNING : VIEWMODEL_TONE.POSITIVE,
    })
  );

  cards.push(
    buildKpiCard({
      key: "slaOnTimePct",
      label: "SLA no prazo",
      value: metrics.slaOnTimePct,
      formatted: formatPercent(metrics.slaOnTimePct),
      delta: byKey("slaOnTimePct")?.deltaFormatted,
      deltaPct: byKey("slaOnTimePct")?.deltaPctFormatted,
      tone: metrics.slaOnTimePct >= KPI_TARGETS.slaOnTimePct ? VIEWMODEL_TONE.POSITIVE : VIEWMODEL_TONE.WARNING,
    })
  );

  cards.push(
    buildKpiCard({
      key: "docsCompliancePct",
      label: "Compliance documental",
      value: metrics.docsCompliancePct,
      formatted: formatPercent(metrics.docsCompliancePct),
      delta: byKey("docsCompliancePct")?.deltaFormatted,
      deltaPct: byKey("docsCompliancePct")?.deltaPctFormatted,
      tone: metrics.docsCompliancePct >= KPI_TARGETS.docsCompliancePct ? VIEWMODEL_TONE.POSITIVE : VIEWMODEL_TONE.WARNING,
    })
  );

  cards.push(
    buildKpiCard({
      key: "hoursExecuted",
      label: "Horas executadas",
      value: metrics.hoursExecuted,
      formatted: formatHours(metrics.hoursExecuted),
      delta: byKey("hoursExecuted")?.deltaFormatted,
      deltaPct: byKey("hoursExecuted")?.deltaPctFormatted,
      tone: VIEWMODEL_TONE.NEUTRAL,
    })
  );

  cards.push(
    buildKpiCard({
      key: "evidenceCount",
      label: "Evidências",
      value: metrics.evidenceCount,
      formatted: formatNumber(metrics.evidenceCount),
      delta: byKey("evidenceCount")?.deltaFormatted,
      deltaPct: byKey("evidenceCount")?.deltaPctFormatted,
      tone: VIEWMODEL_TONE.NEUTRAL,
    })
  );

  const primaryKeys = new Set([
    "totalPlannedActivities",
    "totalExecutedActivities",
    "executionRatioPct",
    "backlog",
    "overdue",
    "slaOnTimePct",
  ]);
  const primaryCards = cards.filter((card) => primaryKeys.has(card.key));
  const secondaryCards = cards.filter((card) => !primaryKeys.has(card.key));

  return {
    cards,
    primaryCards,
    secondaryCards,
  };
}

function buildTrendAnalysis({ breakdowns, insights }) {
  if (!breakdowns || !breakdowns.byWeek || !breakdowns.byWeek.length) {
    return fallbackTrendAnalysis("Sem dados de tendência semanal.");
  }
  return {
    text: "Evolução semanal do volume planejado versus executado, destacando oscilações operacionais do período.",
    weekly: breakdowns.byWeek.map((bucket) => ({
      weekIndex: bucket.weekIndex,
      start: bucket.start,
      end: bucket.end,
      planned: bucket.planned,
      executed: bucket.executed,
    })),
    insights,
  };
}

function buildOperationalBreakdown({ breakdowns, totalPlanned }) {
  if (!breakdowns) {
    return fallbackOperationalBreakdown("Sem dados de distribuição operacional.");
  }
  return {
    text: "Distribuição das atividades planejadas por status, categoria, local, equipe e prioridade, útil para leitura de concentração operacional.",
    byStatus: mapToTable(breakdowns.byStatus, totalPlanned, { labelContext: "status" }),
    byType: mapToTable(breakdowns.byType, totalPlanned, { labelContext: "category" }),
    byLocation: mapToTable(breakdowns.byLocation, totalPlanned, { labelContext: "location" }),
    byTeam: mapToTable(breakdowns.byTeam, totalPlanned, { labelContext: "team" }),
    byPriority: mapToTable(breakdowns.byPriority, totalPlanned, { labelContext: "priority" }),
  };
}

function buildActionPlan({ recommendations }) {
  if (!recommendations || !recommendations.items || !recommendations.items.length) {
    return fallbackActionPlan("Sem ações recomendadas para o período.");
  }
  const items = recommendations.items.map((rec, index) => ({
    id: `action.${index + 1}`,
    source: rec.id,
    text: rec.text,
    owner: "Coordenação O&M",
    due: "A definir",
    status: "Planejada",
  }));
  return {
    text: "Plano de ação inicial baseado nos desvios identificados.",
    items,
  };
}

function buildConsolidatedTables({ breakdowns, totalPlanned }) {
  if (!breakdowns) {
    return fallbackConsolidatedTables("Sem dados consolidados.");
  }
  return {
    text: "Tabelas consolidadas com visão completa do período para auditoria e revisão gerencial.",
    statusTable: mapToTable(breakdowns.byStatus, totalPlanned, { labelContext: "status" }),
    categoryTable: mapToTable(breakdowns.byType, totalPlanned, { labelContext: "category" }),
    locationTable: mapToTable(breakdowns.byLocation, totalPlanned, { labelContext: "location" }),
    teamTable: mapToTable(breakdowns.byTeam, totalPlanned, { labelContext: "team" }),
    priorityTable: mapToTable(breakdowns.byPriority, totalPlanned, { labelContext: "priority" }),
  };
}

function buildAppendix(normalized) {
  if (!normalized || !normalized.currentPeriod || !normalized.currentPeriod.rdos) {
    return fallbackAppendix("Sem RDOs normalizados para o período.");
  }
  const dailyRdos = normalized.currentPeriod.rdos.map((rdo) => ({
    id: rdo.id,
    rdoDate: rdo.rdoDateIso,
    createdAt: rdo.createdAtIso,
    createdBy: rdo.createdBy,
    metrics: rdo.metrics,
    evidenceCount: rdo.evidenciasTotal || (Array.isArray(rdo.evidencias) ? rdo.evidencias.length : 0),
  }));

  if (!dailyRdos.length) {
    return fallbackAppendix("Sem RDOs disponíveis para o período.");
  }

  return {
    text: "RDOs diários consolidados.",
    dailyRdos,
  };
}

function buildMonthlyReportViewModel({ aggregated, validation, normalized, options = {} } = {}) {
  if (!aggregated || !aggregated.current) {
    return null;
  }
  const current = aggregated.current;
  const metrics = current.metrics;
  const breakdowns = current.breakdowns;
  const integrityStatus = validation && validation.integrityStatus ? validation.integrityStatus : "ok";
  const integritySummary = validation && validation.summary ? validation.summary : { blockers: 0, warnings: 0, infos: 0 };

  const emittedAt = aggregated.meta && aggregated.meta.emittedAt;
  const periodStart = current.period && current.period.startIso;
  const periodEnd = current.period && current.period.endIso;

  const emittedAtDate = emittedAt ? new Date(emittedAt) : null;
  const periodEndDate = periodEnd ? new Date(`${periodEnd}T23:59:59.999`) : null;
  const isPartialByDate = emittedAtDate && periodEndDate ? emittedAtDate.getTime() < periodEndDate.getTime() : false;

  const isPartial = Boolean(
    options.isPartial ||
    isPartialByDate ||
    (validation && validation.issues && validation.issues.some((issue) => issue.code === "business.partial_missing_flag"))
  );

  const comparison = buildComparison(aggregated);
  const insights = buildInsights({ aggregated, comparison, integrityStatus });

  const executiveSummary = buildExecutiveSummary({
    metrics,
    comparison,
    integrityStatus,
    isPartial,
  });

  const technicalHighlights = buildTechnicalHighlights({ metrics, breakdowns });
  const safetyCompliance = buildSafetyCompliance({ metrics, integrityStatus });
  const riskAssessment = buildRiskAssessment({ metrics, integrityStatus });
  const recommendations = buildRecommendations({ metrics });
  const actionPlan = buildActionPlan({ recommendations });

  const kpis = buildKpis({ metrics, comparison });
  const trendAnalysis = buildTrendAnalysis({ breakdowns, insights });
  const operationalBreakdown = buildOperationalBreakdown({
    breakdowns,
    totalPlanned: metrics.totalPlannedActivities,
  });
  const consolidatedTables = buildConsolidatedTables({
    breakdowns,
    totalPlanned: metrics.totalPlannedActivities,
  });
  const appendix = buildAppendix(normalized);

  return {
    meta: {
      projectId: aggregated.meta && aggregated.meta.projectId,
      projectName: aggregated.meta && aggregated.meta.projectName,
      clientName: aggregated.meta && aggregated.meta.clientName,
      plantName: aggregated.meta && aggregated.meta.plantName,
      period: { start: periodStart, end: periodEnd },
      emittedAt,
      emittedAtLabel: formatDateTime(emittedAt),
      reportVersion: aggregated.meta && aggregated.meta.reportVersion,
      comparisonMode: aggregated.comparisonMode,
      integrityStatus,
      integritySummary,
      isPartial,
    },
    header: {
      title: "Relatório Mensal OPSCOPE",
      subtitle: `${aggregated.meta && aggregated.meta.clientName} • ${aggregated.meta && aggregated.meta.projectName}`,
      periodLabel: formatDateRange(periodStart, periodEnd),
      emittedAtLabel: formatDateTime(emittedAt),
      integrityStatus,
    },
    executiveSummary,
    kpis,
    comparisonWithPreviousPeriod: comparison,
    trendAnalysis,
    operationalBreakdown,
    safetyCompliance,
    technicalHighlights,
    riskAssessment,
    recommendations,
    actionPlan,
    consolidatedTables,
    appendix,
  };
}

module.exports = {
  buildMonthlyReportViewModel,
};
