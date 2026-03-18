const { renderLineChart } = require("./svg/lineChart");
const { renderBarChart } = require("./svg/barChart");
const { renderStackedBar } = require("./svg/stackedBar");
const { renderEmptyChart } = require("./svg/emptyChart");

function buildWeeklyLabels(weekly) {
  return weekly.map((bucket) => `S${bucket.weekIndex}`);
}

function buildBacklogEvolution(weekly) {
  let cumulativePlanned = 0;
  let cumulativeExecuted = 0;
  return weekly.map((bucket) => {
    cumulativePlanned += bucket.planned || 0;
    cumulativeExecuted += bucket.executed || 0;
    return Math.max(0, cumulativePlanned - cumulativeExecuted);
  });
}

function buildChart({ id, title, subtitle, svg, emptyMessage }) {
  if (!svg) {
    return { id, title, subtitle, svg: renderEmptyChart({ message: emptyMessage || "Sem dados" }), empty: true };
  }
  return { id, title, subtitle, svg, empty: false };
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
    const weeklySvg = renderLineChart({
      labels,
      series: [
        { label: "Planejadas", values: planned, color: "#1d4ed8" },
        { label: "Executadas", values: executed, color: "#16a34a" },
      ],
    });
    charts.push(buildChart({
      id: "weekly_planned_executed",
      title: "Evolução semanal",
      subtitle: "Planejadas vs executadas",
      svg: weeklySvg,
      emptyMessage: "Sem dados de tendência",
    }));

    const backlogEvolution = buildBacklogEvolution(weekly);
    const backlogSvg = renderLineChart({
      labels,
      series: [{ label: "Backlog", values: backlogEvolution, color: "#b45309" }],
    });
    charts.push(buildChart({
      id: "backlog_evolution",
      title: "Evolução de backlog",
      subtitle: "Cumulativo no período",
      svg: backlogSvg,
      emptyMessage: "Sem dados de backlog",
    }));
  } else {
    charts.push(buildChart({
      id: "weekly_planned_executed",
      title: "Evolução semanal",
      subtitle: "Planejadas vs executadas",
      svg: null,
      emptyMessage: "Sem dados de tendência",
    }));
    charts.push(buildChart({
      id: "backlog_evolution",
      title: "Evolução de backlog",
      subtitle: "Cumulativo no período",
      svg: null,
      emptyMessage: "Sem dados de backlog",
    }));
  }

  const statusTable = viewModel.consolidatedTables && viewModel.consolidatedTables.statusTable ? viewModel.consolidatedTables.statusTable : [];
  const statusSvg = statusTable.length
    ? renderBarChart({
        data: statusTable.map((row) => ({ label: row.label, value: row.count })),
        yLabel: "Atividades",
      })
    : null;
  charts.push(buildChart({
    id: "status_distribution",
    title: "Distribuição por status",
    subtitle: "Planejadas",
    svg: statusSvg,
    emptyMessage: "Sem dados por status",
  }));

  const slaSvg = renderStackedBar({
    label: "SLA no prazo",
    onTime: viewModel.kpis && viewModel.kpis.cards ? (viewModel.kpis.cards.find((c) => c.key === "slaOnTimePct")?.value || 0) : 0,
    late: viewModel.kpis && viewModel.kpis.cards ? (100 - (viewModel.kpis.cards.find((c) => c.key === "slaOnTimePct")?.value || 0)) : 0,
  });
  charts.push(buildChart({
    id: "sla_on_time",
    title: "SLA no prazo vs fora do prazo",
    subtitle: "Percentual",
    svg: slaSvg,
  }));

  const categoryTable = viewModel.consolidatedTables && viewModel.consolidatedTables.categoryTable ? viewModel.consolidatedTables.categoryTable.slice(0, 8) : [];
  const categorySvg = categoryTable.length
    ? renderBarChart({
        data: categoryTable.map((row) => ({ label: row.label, value: row.count })),
        yLabel: "Atividades",
      })
    : null;
  charts.push(buildChart({
    id: "category_distribution",
    title: "Distribuição por categoria",
    subtitle: "Top categorias",
    svg: categorySvg,
    emptyMessage: "Sem dados por categoria",
  }));

  const locationTable = viewModel.consolidatedTables && viewModel.consolidatedTables.locationTable ? viewModel.consolidatedTables.locationTable.slice(0, 6) : [];
  const locationSvg = locationTable.length
    ? renderBarChart({
        data: locationTable.map((row) => ({ label: row.label, value: row.count })),
        yLabel: "Atividades",
      })
    : null;
  charts.push(buildChart({
    id: "top_locations",
    title: "Top locais",
    subtitle: "Volume por local",
    svg: locationSvg,
    emptyMessage: "Sem dados por local",
  }));

  const priorityTable = viewModel.consolidatedTables && viewModel.consolidatedTables.priorityTable ? viewModel.consolidatedTables.priorityTable : [];
  const prioritySvg = priorityTable.length
    ? renderBarChart({
        data: priorityTable.map((row) => ({ label: row.label, value: row.count })),
        yLabel: "Atividades",
      })
    : null;
  charts.push(buildChart({
    id: "criticality_priority",
    title: "Criticidade por prioridade",
    subtitle: "Distribuição",
    svg: prioritySvg,
    emptyMessage: "Sem dados de prioridade",
  }));

  return charts;
}

module.exports = {
  buildMonthlyReportCharts,
};
