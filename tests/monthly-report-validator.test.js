const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeMonthlyReportInput,
  aggregateMonthlyReport,
  validateMonthlyReport,
} = require("../src/reporting/monthly");

function buildBaseInput(overrides = {}) {
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
          doneAt: "2026-03-07T10:00:00-03:00",
          category: "corretiva eletrica",
          priority: "critica",
          critical: true,
          docs: { apr: true, os: true, pte: true, pt: true },
        },
        {
          id: "A2",
          title: "Atividade 2",
          status: "Backlog",
          dueDate: "2026-03-31",
          backlogReason: "Equipe",
          category: "preventiva simples",
        },
        {
          id: "A3",
          title: "Atividade 3",
          status: "Em execução",
          dueDate: "2026-03-08",
          category: "preventiva simples",
        },
      ],
      rdos: [],
    },
    ...overrides,
  };
}

test("schema invalid payload returns blocker", () => {
  const input = buildBaseInput({ meta: { projectName: "X" } });
  const result = validateMonthlyReport({ input });
  assert.equal(result.integrityStatus, "blocked");
  assert.ok(result.summary.blockers > 0);
});

test("status inválido gera warning", () => {
  const input = buildBaseInput();
  input.currentPeriod.activities[0].status = "status_aleatorio";
  const result = validateMonthlyReport({ input });
  assert.ok(result.issues.some((issue) => issue.code === "business.status_unknown"));
});

test("concluída sem doneAt bloqueia", () => {
  const input = buildBaseInput();
  input.currentPeriod.activities[0].doneAt = "";
  const result = validateMonthlyReport({ input });
  assert.equal(result.integrityStatus, "blocked");
  assert.ok(result.issues.some((issue) => issue.code === "business.concluida_sem_doneAt"));
});

test("overdue inconsistente bloqueia", () => {
  const input = buildBaseInput();
  input.currentPeriod.activities[2].overdue = true;
  input.currentPeriod.activities[2].dueDate = "2026-03-31";
  const result = validateMonthlyReport({ input });
  assert.ok(result.issues.some((issue) => issue.code === "business.overdue_inconsistente"));
});

test("planned divergente do breakdown bloqueia", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  aggregated.current.metrics.totalPlannedActivities = 999;
  const result = validateMonthlyReport({ input, normalized, aggregated, options: { autoAggregate: false } });
  assert.ok(result.issues.some((issue) => issue.code === "consistency.metric_mismatch"));
});

test("SLA divergente bloqueia", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  aggregated.current.metrics.slaOnTime = 99;
  const result = validateMonthlyReport({ input, normalized, aggregated, options: { autoAggregate: false } });
  assert.ok(result.issues.some((issue) => issue.code === "consistency.metric_mismatch"));
});

test("docsCompliance divergente bloqueia", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  aggregated.current.metrics.docsOk = 20;
  const result = validateMonthlyReport({ input, normalized, aggregated, options: { autoAggregate: false } });
  assert.ok(result.issues.some((issue) => issue.code === "consistency.metric_mismatch"));
});

test("previousPeriod incompatível gera blocker", () => {
  const input = buildBaseInput({ comparisonMode: "provided" });
  const result = validateMonthlyReport({ input });
  assert.ok(result.issues.some((issue) => issue.code === "schema.invalid"));
});

test("cenário com warnings sem blockers", () => {
  const input = buildBaseInput();
  input.meta.emittedAt = "2026-03-10T10:00:00-03:00";
  const result = validateMonthlyReport({ input });
  assert.equal(result.integrityStatus, "warning");
  assert.equal(result.summary.blockers, 0);
});

test("cenário bloqueado", () => {
  const input = buildBaseInput();
  input.currentPeriod.activities[0].doneAt = "";
  const result = validateMonthlyReport({ input });
  assert.equal(result.integrityStatus, "blocked");
});
