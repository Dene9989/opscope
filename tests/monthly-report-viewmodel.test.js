const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeMonthlyReportInput,
  aggregateMonthlyReport,
  validateMonthlyReport,
  buildMonthlyReportViewModel,
} = require("../src/reporting/monthly");

function buildInput(overrides = {}) {
  return {
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
      activities: [],
      rdos: [],
    },
    ...overrides,
  };
}

function buildViewModel(input, options = {}) {
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  const validation = validateMonthlyReport({ input, normalized, aggregated, options: { autoAggregate: false } });
  return buildMonthlyReportViewModel({ aggregated, validation, normalized, options });
}

test("healthy month yields positive insights", () => {
  const input = buildInput({
    currentPeriod: {
      period: { start: "2026-03-01", end: "2026-03-31" },
      activities: [
        {
          id: "A1",
          title: "Atividade 1",
          status: "Concluida",
          dueDate: "2026-03-05",
          doneAt: "2026-03-04T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
        {
          id: "A2",
          title: "Atividade 2",
          status: "Concluida",
          dueDate: "2026-03-06",
          doneAt: "2026-03-05T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
        {
          id: "A3",
          title: "Atividade 3",
          status: "Concluida",
          dueDate: "2026-03-07",
          doneAt: "2026-03-06T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
        {
          id: "A4",
          title: "Atividade 4",
          status: "Concluida",
          dueDate: "2026-03-08",
          doneAt: "2026-03-07T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
        {
          id: "A5",
          title: "Atividade 5",
          status: "Concluida",
          dueDate: "2026-03-09",
          doneAt: "2026-03-08T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
      ],
      rdos: [],
    },
  });

  const viewModel = buildViewModel(input);
  const insightIds = viewModel.trendAnalysis.insights.map((item) => item.id);

  assert.ok(insightIds.includes("insight.sla_good"));
  assert.ok(insightIds.includes("insight.docs_good"));
  assert.equal(viewModel.riskAssessment.risks.length, 0);
});

test("backlog and SLA poor generate warnings and recommendations", () => {
  const input = buildInput({
    currentPeriod: {
      period: { start: "2026-03-01", end: "2026-03-31" },
      activities: [
        {
          id: "A1",
          title: "Atividade 1",
          status: "Concluida",
          dueDate: "2026-03-05",
          doneAt: "2026-03-10T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: false },
        },
        { id: "A2", title: "Atividade 2", status: "Backlog", dueDate: "2026-03-12", category: "preventiva simples" },
        { id: "A3", title: "Atividade 3", status: "Backlog", dueDate: "2026-03-20", category: "preventiva simples" },
      ],
      rdos: [],
    },
  });

  const viewModel = buildViewModel(input);
  const insightIds = viewModel.trendAnalysis.insights.map((item) => item.id);
  const recommendationIds = viewModel.recommendations.items.map((item) => item.id);
  const riskIds = viewModel.riskAssessment.risks.map((item) => item.id);

  assert.ok(insightIds.includes("insight.sla_below_target"));
  assert.ok(insightIds.includes("insight.backlog_present"));
  assert.ok(recommendationIds.includes("rec.sla"));
  assert.ok(recommendationIds.includes("rec.backlog"));
  assert.ok(riskIds.includes("risk.backlog"));
});

test("partial month is flagged in executive summary", () => {
  const input = buildInput({
    meta: {
      projectId: "P-834",
      projectName: "Paracatu/Solarig",
      clientName: "Solarig",
      plantName: "BSO2",
      period: { start: "2026-03-01", end: "2026-03-31" },
      timezone: "America/Sao_Paulo",
      emittedAt: "2026-03-10T10:00:00-03:00",
      reportVersion: "v2.0",
      isPartial: true,
    },
    currentPeriod: {
      period: { start: "2026-03-01", end: "2026-03-31" },
      activities: [
        {
          id: "A1",
          title: "Atividade 1",
          status: "Concluida",
          dueDate: "2026-03-05",
          doneAt: "2026-03-05T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
      ],
      rdos: [],
    },
  });

  const viewModel = buildViewModel(input, { isPartial: true });
  assert.ok(viewModel.meta.isPartial);
  assert.ok(viewModel.executiveSummary.text.includes("Relatório parcial"));
});

test("missing previous period yields comparison unavailable", () => {
  const input = buildInput({
    comparisonMode: "recalculated",
    previousPeriod: null,
    currentPeriod: {
      period: { start: "2026-03-01", end: "2026-03-31" },
      activities: [
        {
          id: "A1",
          title: "Atividade 1",
          status: "Concluida",
          dueDate: "2026-03-05",
          doneAt: "2026-03-05T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
      ],
      rdos: [],
    },
  });

  const viewModel = buildViewModel(input);
  assert.equal(viewModel.comparisonWithPreviousPeriod.available, false);
});

test("integrity warnings generate integrity insight", () => {
  const input = buildInput({
    currentPeriod: {
      period: { start: "2026-03-01", end: "2026-03-31" },
      activities: [
        {
          id: "A1",
          title: "Atividade 1",
          status: "StatusAleatorio",
          dueDate: "2026-03-05",
          doneAt: "2026-03-05T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
      ],
      rdos: [],
    },
  });

  const viewModel = buildViewModel(input);
  const insightIds = viewModel.trendAnalysis.insights.map((item) => item.id);
  assert.ok(insightIds.includes("insight.integrity_attention"));
});

test("low volume yields low volume insight", () => {
  const input = buildInput({
    currentPeriod: {
      period: { start: "2026-03-01", end: "2026-03-31" },
      activities: [
        {
          id: "A1",
          title: "Atividade 1",
          status: "Concluida",
          dueDate: "2026-03-05",
          doneAt: "2026-03-05T08:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
      ],
      rdos: [],
    },
  });

  const viewModel = buildViewModel(input);
  const insightIds = viewModel.trendAnalysis.insights.map((item) => item.id);
  assert.ok(insightIds.includes("insight.low_volume"));
});

test("no activities triggers fallback executive summary", () => {
  const input = buildInput();
  const viewModel = buildViewModel(input);
  assert.ok(viewModel.executiveSummary.text.includes("Não houve atividades planejadas"));
});
