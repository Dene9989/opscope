const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeMonthlyReportInput,
  aggregateMonthlyReport,
  validateMonthlyReport,
  buildMonthlyReportViewModel,
  renderMonthlyReportHtml,
} = require("../src/reporting/monthly");

function buildInput() {
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
      ],
      rdos: [
        { id: "R1", rdoDate: "2026-03-05", createdAt: "2026-03-05T17:00:00-03:00", evidenciasTotal: 2 },
        { id: "R2", rdoDate: "2026-03-06", createdAt: "2026-03-06T17:00:00-03:00", evidenciasTotal: 1 },
        { id: "R3", rdoDate: "2026-03-07", createdAt: "2026-03-07T17:00:00-03:00", evidenciasTotal: 1 },
        { id: "R4", rdoDate: "2026-03-08", createdAt: "2026-03-08T17:00:00-03:00", evidenciasTotal: 1 },
      ],
    },
  };
}

function buildViewModel() {
  const input = buildInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  const validation = validateMonthlyReport({ input, normalized, aggregated, options: { autoAggregate: false } });
  return buildMonthlyReportViewModel({ aggregated, validation, normalized });
}

test("render includes executive header", () => {
  const viewModel = buildViewModel();
  const html = renderMonthlyReportHtml(viewModel);
  assert.ok(html.includes("report-header"));
  assert.ok(html.includes("Visão executiva"));
});

test("render shows warning banner when integrity warning", () => {
  const viewModel = buildViewModel();
  viewModel.meta.integrityStatus = "warning";
  const html = renderMonthlyReportHtml(viewModel);
  assert.ok(html.includes("warning-banner"));
});

test("render shows empty state without previous period", () => {
  const viewModel = buildViewModel();
  viewModel.comparisonWithPreviousPeriod.available = false;
  const html = renderMonthlyReportHtml(viewModel);
  assert.ok(html.includes("Comparação indisponível"));
});

test("summary table chunks when too many rows", () => {
  const viewModel = buildViewModel();
  viewModel.consolidatedTables.statusTable = Array.from({ length: 30 }, (_, idx) => ({
    label: `Status muito longo ${idx}`,
    count: idx + 1,
    pct: 3,
  }));
  const html = renderMonthlyReportHtml(viewModel);
  assert.ok(html.includes("data-chunk-index=\"2\""));
});

test("long names are rendered without truncation", () => {
  const viewModel = buildViewModel();
  viewModel.consolidatedTables.categoryTable = [
    { label: "Categoria extremamente longa para testar renderização em PDF sem truncar", count: 2, pct: 50 },
  ];
  const html = renderMonthlyReportHtml(viewModel);
  assert.ok(html.includes("Categoria extremamente longa"));
});

test("appendix paginates daily RDO blocks", () => {
  const viewModel = buildViewModel();
  const html = renderMonthlyReportHtml(viewModel);
  const matches = html.match(/daily-rdo-block/g) || [];
  assert.ok(matches.length >= 4);
  assert.ok(html.includes("daily-rdo-page"));
});
