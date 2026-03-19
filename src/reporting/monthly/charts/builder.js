const { renderLineChart } = require("./svg/lineChart");
const { renderBarChart } = require("./svg/barChart");
const { renderStackedBar } = require("./svg/stackedBar");
const { renderEmptyChart } = require("./svg/emptyChart");
const { formatNumber, formatPercent } = require("../viewmodel/formatters");

const CHART_COLORS = {
  planned: "#0b2f4f",
  executed: "#0f766e",
  backlog: "#b45309",
  barPalette: ["#0b2f4f", "#0f766e", "#c2a15c", "#64748b"],
};

function buildWeeklyLabels(weekly) {
  return weekly.map((bucket) => `S${bucket.weekIndex}`);
}

function sumByKeywordsFromTable(table, keywords) {
  if (!table || !keywords || !keywords.length) {
    return 0;
  }
  return table.reduce((acc, row) => {
    const label = String(row.label || "").toLowerCase();
    if (keywords.some((token) => label.includes(token))) {
      return acc + (Number(row.count) || 0);
    }
    return acc;
  }, 0);
}

function buildChart({ id, title, subtitle, svg, emptyMessage, note, summary }) {
  if (!svg) {
    return {
      id,
      title,
      subtitle,
      svg: renderEmptyChart({ message: emptyMessage || "Sem dados" }),
      empty: true,
      note: "",
      summary: [],
    };
  }
  return { id, title, subtitle, svg, empty: false, note, summary };
}

function buildMonthlyReportCharts(viewModel) {
  if (!viewModel) {
    return [];
  }
  const charts = [];
  const weekly = viewModel.trendAnalysis && viewModel.trendAnalysis.weekly ? viewModel.trendAnalysis.weekly : [];

  if (weekly.length) {
    const labels = buildWeeklyLabels(weekly);
    const planned = weekly.map((bucket) => bucket.planned || 0);
    const executed = weekly.map((bucket) => bucket.executed || 0);
    const totalPlanned = planned.reduce((acc, value) => acc + value, 0);
    const totalExecuted = executed.reduce((acc, value) => acc + value, 0);
    const executionPct = totalPlanned ? Math.round((totalExecuted / totalPlanned) * 100) : 0;
    const peakPlanned = weekly.reduce((acc, bucket) => (bucket.planned || 0) > (acc.planned || 0) ? bucket : acc, weekly[0]);

    const weeklySvg = renderLineChart({
      labels,
      series: [
        { label: "Planejadas", values: planned, color: CHART_COLORS.planned },
        { label: "Executadas", values: executed, color: CHART_COLORS.executed },
      ],
    });
    charts.push(buildChart({
      id: "weekly_planned_executed",
      title: "Ritmo semanal de execução",
      subtitle: "Planejado (dueDate) vs executado (doneAt) por semana",
      svg: weeklySvg,
      emptyMessage: "Sem dados de tendência",
      note: "Leitura: compare o planejado com as conclusões do mês para identificar semanas com ajuste de capacidade.",
      summary: [
        { label: "Planejadas (total)", value: formatNumber(totalPlanned) },
        { label: "Executadas (total)", value: formatNumber(totalExecuted) },
        { label: "Execução do plano", value: formatPercent(executionPct) },
        { label: "Pico de planejamento", value: peakPlanned ? `S${peakPlanned.weekIndex}` : "-" },
      ],
    }));

    const backlogSeries = weekly.map((bucket) => bucket.backlog || 0);
    const backlogSvg = renderLineChart({
      labels,
      series: [{ label: "Backlog (status)", values: backlogSeries, color: CHART_COLORS.backlog }],
    });
    const backlogPeak = weekly.reduce((acc, bucket) => (bucket.backlog || 0) > (acc.backlog || 0) ? bucket : acc, weekly[0]);
    const backlogEnd = backlogSeries.length ? backlogSeries[backlogSeries.length - 1] : 0;
    charts.push(buildChart({
      id: "backlog_evolution",
      title: "Backlog real por semana",
      subtitle: "Cumulativo baseado em status",
      svg: backlogSvg,
      emptyMessage: "Sem dados de backlog",
      note: "Leitura: backlog calculado por status real, sem diferença entre planejado e executado.",
      summary: [
        { label: "Backlog final", value: formatNumber(backlogEnd) },
        { label: "Pico de backlog", value: formatNumber(backlogPeak ? backlogPeak.backlog || 0 : 0) },
        { label: "Semana do pico", value: backlogPeak ? `S${backlogPeak.weekIndex}` : "-" },
      ],
    }));
  } else {
    charts.push(buildChart({
      id: "weekly_planned_executed",
      title: "Ritmo semanal de execução",
      subtitle: "Volume planejado vs executado por semana",
      svg: null,
      emptyMessage: "Sem dados de tendência",
    }));
    charts.push(buildChart({
      id: "backlog_evolution",
      title: "Backlog real por semana",
      subtitle: "Cumulativo baseado em status",
      svg: null,
      emptyMessage: "Sem dados de backlog",
    }));
  }

  const statusTable = viewModel.consolidatedTables && viewModel.consolidatedTables.statusTable ? viewModel.consolidatedTables.statusTable : [];
  const statusSvg = statusTable.length
    ? renderBarChart({
        data: statusTable.map((row) => ({ label: row.label, value: row.count })),
        colors: CHART_COLORS.barPalette,
        yLabel: "Atividades",
      })
    : null;
  const totalStatus = statusTable.reduce((acc, row) => acc + (row.count || 0), 0);
  const topStatus = statusTable[0];
  charts.push(buildChart({
    id: "status_distribution",
    title: "Status no período",
    subtitle: "Base: planejadas no mês + concluídas no mês (doneAt)",
    svg: statusSvg,
    emptyMessage: "Sem dados por status",
    note: "Leitura: executadas são as atividades concluídas no mês, mesmo se planejadas em outro período.",
    summary: [
      { label: "Status com maior volume", value: topStatus ? topStatus.label : "-" },
      { label: "Total no período", value: formatNumber(totalStatus) },
    ],
  }));

  const slaPct = viewModel.kpis && viewModel.kpis.cards
    ? (viewModel.kpis.cards.find((c) => c.key === "slaOnTimePct")?.value || 0)
    : 0;
  const normalizedSlaPct = Math.max(0, Math.min(100, Number(slaPct) || 0));
  const slaSvg = renderStackedBar({
    label: "SLA no prazo",
    onTime: normalizedSlaPct,
    late: 100 - normalizedSlaPct,
  });
  charts.push(buildChart({
    id: "sla_on_time",
    title: "Cumprimento de SLA",
    subtitle: "Percentual de atividades elegíveis",
    svg: slaSvg,
    note: "Leitura: percentual de atividades elegíveis entregues dentro do prazo.",
    summary: [
      { label: "No prazo", value: formatPercent(normalizedSlaPct) },
      { label: "Fora do prazo", value: formatPercent(100 - normalizedSlaPct) },
    ],
  }));

  const executedTables = viewModel.consolidatedTables && viewModel.consolidatedTables.executedTables ? viewModel.consolidatedTables.executedTables : {};
  const categoryTable = executedTables.categoryTable ? executedTables.categoryTable.slice(0, 8) : [];
  const categorySvg = categoryTable.length
    ? renderBarChart({
        data: categoryTable.map((row) => ({ label: row.label, value: row.count })),
        colors: CHART_COLORS.barPalette,
        yLabel: "Atividades",
      })
    : null;
  const topCategory = categoryTable[0];
  const totalCategory = categoryTable.reduce((acc, row) => acc + (row.count || 0), 0);
  const preventiveCount = sumByKeywordsFromTable(categoryTable, ["preventiva", "preditiva"]);
  const correctiveCount = sumByKeywordsFromTable(categoryTable, ["corretiva", "corretivo", "reparo"]);
  const preventivePct = totalCategory ? Math.round((preventiveCount / totalCategory) * 100) : 0;
  const correctivePct = totalCategory ? Math.round((correctiveCount / totalCategory) * 100) : 0;
  charts.push(buildChart({
    id: "category_distribution",
    title: "Execução por categoria",
    subtitle: "Atividades concluídas no mês",
    svg: categorySvg,
    emptyMessage: "Sem dados por categoria",
    note: "Leitura: destaca frentes preventivas/preditivas vs corretivas, sem perder contexto do esforço executado.",
    summary: [
      { label: "Categoria com maior volume", value: topCategory ? topCategory.label : "-" },
      { label: "Participação", value: topCategory ? formatPercent(topCategory.pct) : "-" },
      { label: "Preventivas/preditivas", value: totalCategory ? `${formatNumber(preventiveCount)} (${formatPercent(preventivePct)})` : "-" },
      { label: "Corretivas", value: totalCategory ? `${formatNumber(correctiveCount)} (${formatPercent(correctivePct)})` : "-" },
    ],
  }));

  const locationTable = executedTables.locationTable ? executedTables.locationTable : [];
  const locationDisplay = locationTable.slice(0, 6);
  const locationTotal = locationTable.reduce((acc, row) => acc + (row.count || 0), 0);
  const locationSvg = locationDisplay.length
    ? renderBarChart({
        data: locationDisplay.map((row) => ({ label: row.label, value: row.count })),
        colors: CHART_COLORS.barPalette,
        yLabel: "Atividades",
      })
    : null;
  charts.push(buildChart({
    id: "top_locations",
    title: "Execução por local",
    subtitle: "Atividades concluídas no mês",
    svg: locationSvg,
    emptyMessage: "Sem dados por local",
    note: "Leitura: distribuição por locais dentro do projeto, usada apenas como contexto operacional.",
    summary: [
      { label: "Locais com execução", value: formatNumber(locationTable.length) },
      { label: "Total executado", value: formatNumber(locationTotal) },
    ],
  }));

  const priorityTable = executedTables.priorityTable ? executedTables.priorityTable : [];
  const prioritySvg = priorityTable.length
    ? renderBarChart({
        data: priorityTable.map((row) => ({ label: row.label, value: row.count })),
        colors: CHART_COLORS.barPalette,
        yLabel: "Atividades",
      })
    : null;
  const topPriority = priorityTable[0];
  charts.push(buildChart({
    id: "criticality_priority",
    title: "Execução por prioridade",
    subtitle: "Criticidade das atividades concluídas",
    svg: prioritySvg,
    emptyMessage: "Sem dados de prioridade",
    note: "Leitura: identifica a pressão operacional por criticidade no período.",
    summary: [
      { label: "Prioridade com maior volume", value: topPriority ? topPriority.label : "-" },
      { label: "Participação", value: topPriority ? formatPercent(topPriority.pct) : "-" },
    ],
  }));

  return charts;
}

module.exports = {
  buildMonthlyReportCharts,
};
