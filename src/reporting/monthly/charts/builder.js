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
      subtitle: "Volume planejado vs executado por semana",
      svg: weeklySvg,
      emptyMessage: "Sem dados de tendência",
      note: "Leitura: compare a curva de execução com o planejado para identificar semanas de desvio e ajuste de capacidade.",
      summary: [
        { label: "Planejadas (total)", value: formatNumber(totalPlanned) },
        { label: "Executadas (total)", value: formatNumber(totalExecuted) },
        { label: "Execução do plano", value: formatPercent(executionPct) },
        { label: "Semana pico de planejamento", value: peakPlanned ? `S${peakPlanned.weekIndex}` : "-" },
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
    title: "Status das atividades planejadas",
    subtitle: "Distribuição de volume no período",
    svg: statusSvg,
    emptyMessage: "Sem dados por status",
    note: "Leitura: indica a composição do plano por status no período.",
    summary: [
      { label: "Status dominante", value: topStatus ? topStatus.label : "-" },
      { label: "Total planejadas", value: formatNumber(totalStatus) },
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

  const categoryTable = viewModel.consolidatedTables && viewModel.consolidatedTables.categoryTable ? viewModel.consolidatedTables.categoryTable.slice(0, 8) : [];
  const categorySvg = categoryTable.length
    ? renderBarChart({
        data: categoryTable.map((row) => ({ label: row.label, value: row.count })),
        colors: CHART_COLORS.barPalette,
        yLabel: "Atividades",
      })
    : null;
  const topCategory = categoryTable[0];
  charts.push(buildChart({
    id: "category_distribution",
    title: "Categorias com maior volume",
    subtitle: "Top categorias do período",
    svg: categorySvg,
    emptyMessage: "Sem dados por categoria",
    note: "Leitura: indica concentração do esforço por tipo de atividade.",
    summary: [
      { label: "Categoria dominante", value: topCategory ? topCategory.label : "-" },
      { label: "Participação", value: topCategory ? formatPercent(topCategory.pct) : "-" },
    ],
  }));

  const locationTable = viewModel.consolidatedTables && viewModel.consolidatedTables.locationTable ? viewModel.consolidatedTables.locationTable.slice(0, 6) : [];
  const locationSvg = locationTable.length
    ? renderBarChart({
        data: locationTable.map((row) => ({ label: row.label, value: row.count })),
        colors: CHART_COLORS.barPalette,
        yLabel: "Atividades",
      })
    : null;
  const topLocation = locationTable[0];
  charts.push(buildChart({
    id: "top_locations",
    title: "Locais com maior carga",
    subtitle: "Top locais do período",
    svg: locationSvg,
    emptyMessage: "Sem dados por local",
    note: "Leitura: evidencia concentração geográfica do volume planejado.",
    summary: [
      { label: "Local dominante", value: topLocation ? topLocation.label : "-" },
      { label: "Participação", value: topLocation ? formatPercent(topLocation.pct) : "-" },
    ],
  }));

  const priorityTable = viewModel.consolidatedTables && viewModel.consolidatedTables.priorityTable ? viewModel.consolidatedTables.priorityTable : [];
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
    title: "Perfil de prioridade",
    subtitle: "Distribuição por criticidade",
    svg: prioritySvg,
    emptyMessage: "Sem dados de prioridade",
    note: "Leitura: identifica o peso de criticidade no volume planejado.",
    summary: [
      { label: "Prioridade dominante", value: topPriority ? topPriority.label : "-" },
      { label: "Participação", value: topPriority ? formatPercent(topPriority.pct) : "-" },
    ],
  }));

  return charts;
}

module.exports = {
  buildMonthlyReportCharts,
};
