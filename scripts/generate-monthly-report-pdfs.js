const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const {
  normalizeMonthlyReportInput,
  aggregateMonthlyReport,
  validateMonthlyReport,
  buildMonthlyReportViewModel,
  renderMonthlyReportHtml,
  renderMonthlyReportPdf,
} = require("../src/reporting/monthly");

const outputDir = path.join(__dirname, "..", "src", "reporting", "monthly", "examples", "outputs");

function buildBaseMeta(overrides = {}) {
  return {
    projectId: "P-834",
    projectName: "Paracatu/Solarig",
    clientName: "Solarig",
    plantName: "BSO2",
    period: { start: "2026-03-01", end: "2026-03-31" },
    timezone: "America/Sao_Paulo",
    emittedAt: "2026-04-02T10:00:00-03:00",
    reportVersion: "v2.0",
    ...overrides,
  };
}

function makeActivity(idx, overrides = {}) {
  return {
    id: `A${idx}`,
    title: `Atividade ${idx}`,
    status: "Concluida",
    dueDate: "2026-03-05",
    doneAt: "2026-03-04T08:00:00-03:00",
    category: "inspecao",
    priority: "normal",
    docs: { apr: true, os: true },
    evidenceCount: 1,
    ...overrides,
  };
}

function buildScenarioHealthy() {
  return {
    name: "healthy",
    input: {
      meta: buildBaseMeta(),
      comparisonMode: "provided",
      currentPeriod: {
        period: { start: "2026-03-01", end: "2026-03-31" },
        activities: [
          makeActivity(1, { dueDate: "2026-03-05", doneAt: "2026-03-04T08:00:00-03:00" }),
          makeActivity(2, { dueDate: "2026-03-06", doneAt: "2026-03-05T08:00:00-03:00" }),
          makeActivity(3, { dueDate: "2026-03-07", doneAt: "2026-03-06T08:00:00-03:00" }),
          makeActivity(4, { dueDate: "2026-03-08", doneAt: "2026-03-07T08:00:00-03:00" }),
          makeActivity(5, { dueDate: "2026-03-09", doneAt: "2026-03-08T08:00:00-03:00" }),
        ],
        rdos: [
          { id: "R1", rdoDate: "2026-03-05", createdAt: "2026-03-05T17:00:00-03:00", evidenciasTotal: 3 },
          { id: "R2", rdoDate: "2026-03-10", createdAt: "2026-03-10T17:00:00-03:00", evidenciasTotal: 2 },
        ],
      },
      previousPeriod: {
        period: { start: "2026-02-01", end: "2026-02-28" },
        activities: [
          makeActivity(11, { dueDate: "2026-02-10", doneAt: "2026-02-09T08:00:00-03:00" }),
          makeActivity(12, { dueDate: "2026-02-12", doneAt: "2026-02-11T08:00:00-03:00" }),
        ],
        rdos: [
          { id: "RPrev1", rdoDate: "2026-02-05", createdAt: "2026-02-05T17:00:00-03:00", evidenciasTotal: 1 },
        ],
      },
    },
  };
}

function buildScenarioWarning() {
  return {
    name: "warning",
    input: {
      meta: buildBaseMeta({ emittedAt: "2026-03-10T10:00:00-03:00", isPartial: true }),
      comparisonMode: "recalculated",
      currentPeriod: {
        period: { start: "2026-03-01", end: "2026-03-31" },
        activities: [
          makeActivity(1, { status: "StatusAleatorio", dueDate: "2026-03-05", doneAt: "2026-03-05T08:00:00-03:00" }),
          makeActivity(2, { status: "Backlog", doneAt: "", dueDate: "2026-03-12", category: "preventiva simples" }),
        ],
        rdos: [],
      },
    },
  };
}

function buildScenarioNoPrevious() {
  return {
    name: "no-previous",
    input: {
      meta: buildBaseMeta(),
      comparisonMode: "recalculated",
      currentPeriod: {
        period: { start: "2026-03-01", end: "2026-03-31" },
        activities: [
          makeActivity(1, { dueDate: "2026-03-05", doneAt: "2026-03-07T08:00:00-03:00" }),
          makeActivity(2, { status: "Backlog", doneAt: "", dueDate: "2026-03-20", category: "preventiva simples" }),
        ],
        rdos: [],
      },
      previousPeriod: null,
    },
  };
}

function buildScenarioLong() {
  const activities = [];
  for (let i = 1; i <= 60; i += 1) {
    const status = i % 5 === 0 ? "Backlog" : "Concluida";
    const dueDate = `2026-03-${String((i % 28) + 1).padStart(2, "0")}`;
    const doneAt = status === "Concluida" ? `2026-03-${String((i % 28) + 1).padStart(2, "0")}T08:00:00-03:00` : "";
    activities.push(
      makeActivity(i, {
        status,
        dueDate,
        doneAt,
        category: i % 3 === 0 ? "preventiva simples" : i % 3 === 1 ? "corretiva eletrica" : "inspecao",
        priority: i % 4 === 0 ? "critica" : "alta",
      })
    );
  }
  const rdos = [];
  for (let i = 1; i <= 18; i += 1) {
    rdos.push({
      id: `R${i}`,
      rdoDate: `2026-03-${String((i % 28) + 1).padStart(2, "0")}`,
      createdAt: `2026-03-${String((i % 28) + 1).padStart(2, "0")}T17:00:00-03:00`,
      evidenciasTotal: (i % 4) + 1,
    });
  }

  return {
    name: "long",
    input: {
      meta: buildBaseMeta(),
      comparisonMode: "recalculated",
      currentPeriod: {
        period: { start: "2026-03-01", end: "2026-03-31" },
        activities,
        rdos,
      },
    },
  };
}

async function runScenario(scenario) {
  const normalized = normalizeMonthlyReportInput(scenario.input);
  const aggregated = aggregateMonthlyReport(normalized);
  const validation = validateMonthlyReport({ input: scenario.input, normalized, aggregated, options: { autoAggregate: false } });
  const viewModel = buildMonthlyReportViewModel({ aggregated, validation, normalized });

  const html = renderMonthlyReportHtml(viewModel);
  const htmlPath = path.join(outputDir, `${scenario.name}.html`);
  fs.writeFileSync(htmlPath, html);

  const pdfBuffer = await renderMonthlyReportPdf(html, { engine: "puppeteer" });
  const pdfPath = path.join(outputDir, `${scenario.name}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);

  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pageCount = pdfDoc.getPages().length;

  const metrics = aggregated.current.metrics;
  const insights = viewModel.trendAnalysis.insights.map((insight) => insight.id);

  const summary = {
    name: scenario.name,
    integrityStatus: validation.integrityStatus,
    metrics: {
      totalPlannedActivities: metrics.totalPlannedActivities,
      totalExecutedActivities: metrics.totalExecutedActivities,
      backlog: metrics.backlog,
      overdue: metrics.overdue,
      slaOnTimePct: metrics.slaOnTimePct,
      docsCompliancePct: metrics.docsCompliancePct,
      hoursExecuted: metrics.hoursExecuted,
      evidenceCount: metrics.evidenceCount,
      rdoCount: metrics.rdoCount,
    },
    insights,
    pageCount,
    htmlPath,
    pdfPath,
  };

  fs.writeFileSync(path.join(outputDir, `${scenario.name}.summary.json`), JSON.stringify(summary, null, 2));
  return summary;
}

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const scenarios = [
    buildScenarioHealthy(),
    buildScenarioWarning(),
    buildScenarioNoPrevious(),
    buildScenarioLong(),
  ];

  const results = [];
  for (const scenario of scenarios) {
    // eslint-disable-next-line no-await-in-loop
    const summary = await runScenario(scenario);
    results.push(summary);
  }

  fs.writeFileSync(path.join(outputDir, "index.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
