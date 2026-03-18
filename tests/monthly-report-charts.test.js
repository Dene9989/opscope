const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeMonthlyReportInput,
  aggregateMonthlyReport,
  validateMonthlyReport,
  buildMonthlyReportViewModel,
  buildMonthlyReportCharts,
} = require("../src/reporting/monthly");

function buildViewModel(withWeekly = true) {
  const input = {
    meta: {
      projectId: "P-834",
      projectName: "Paracatu/Solarig",
      clientName: "Solarig",
      plantName: "BSO2",
      period: { start: "2026-03-01", end: "2026-03-31" },
      timezone: "America/Sao_Paulo",
      emittedAt: "2026-03-31T10:00:00-03:00",
      reportVersion: "v2.0",
    },
    comparisonMode: "recalculated",
    currentPeriod: {
      period: { start: "2026-03-01", end: "2026-03-31" },
      activities: withWeekly
        ? [
            {
              id: "A1",
              title: "Atividade 1",
              status: "Concluida",
              dueDate: "2026-03-05",
              doneAt: "2026-03-04T08:00:00-03:00",
              category: "inspecao",
              priority: "critica",
              docs: { apr: true, os: true },
            },
          ]
        : [],
      rdos: [],
    },
  };

  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  const validation = validateMonthlyReport({ input, normalized, aggregated, options: { autoAggregate: false } });
  return buildMonthlyReportViewModel({ aggregated, validation, normalized });
}

test("chart builder returns svg for weekly charts", () => {
  const viewModel = buildViewModel(true);
  const charts = buildMonthlyReportCharts(viewModel);
  const weekly = charts.find((chart) => chart.id === "weekly_planned_executed");
  assert.ok(weekly);
  assert.ok(weekly.svg.includes("<svg"));
});

test("chart builder uses empty chart when no data", () => {
  const viewModel = buildViewModel(false);
  viewModel.trendAnalysis.weekly = [];
  const charts = buildMonthlyReportCharts(viewModel);
  const weekly = charts.find((chart) => chart.id === "weekly_planned_executed");
  assert.ok(weekly);
  assert.ok(weekly.svg.includes("Sem dados"));
});
