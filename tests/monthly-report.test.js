const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeMonthlyReportInput,
  aggregateMonthlyReport,
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
          status: "Concluída",
          dueDate: "2026-03-05",
          doneAt: "2026-03-07T10:00:00-03:00",
          category: "corretiva eletrica",
          priority: "critica",
          critical: true,
          docs: { apr: true, os: true, pte: true, pt: true },
          evidenceCount: 2,
          executionDurationHours: 5,
        },
        {
          id: "A2",
          title: "Atividade 2",
          status: "Em execução",
          dueDate: "2026-03-10",
          executionStartedAt: "2026-03-10T08:00:00-03:00",
          category: "preventiva simples",
          priority: "alta",
          docs: { apr: true, os: true },
        },
        {
          id: "A3",
          title: "Atividade 3",
          status: "Backlog",
          dueDate: "2026-03-08",
          backlogReason: "Equipe",
          category: "preventiva simples",
        },
        {
          id: "A4",
          title: "Atividade 4",
          status: "Backlog",
          dueDate: "2026-03-31",
          category: "preventiva simples",
        },
        {
          id: "A5",
          title: "Atividade 5",
          status: "Programada",
          dueDate: "2026-03-12",
          category: "preventiva simples",
        },
        {
          id: "A6",
          title: "Atividade 6",
          status: "Cancelada",
          dueDate: "2026-03-15",
          cancelReason: "Sem acesso",
        },
        {
          id: "A7",
          title: "Atividade 7",
          status: "Concluida",
          dueDate: "2026-02-28",
          doneAt: "2026-03-02T09:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: false },
          evidenceCount: 1,
          executionDurationHours: 2,
        },
        {
          id: "A8",
          title: "Atividade 8",
          status: "Concluida",
          dueDate: "2026-03-18",
          doneAt: "",
          category: "preventiva simples",
        },
        {
          id: "A9",
          title: "Atividade 9",
          status: "Concluida",
          dueDate: "2026-03-09",
          doneAt: "2026-03-10T14:00:00-03:00",
          category: "desconhecida",
          docs: {},
          executionDurationHours: 1,
        },
      ],
      rdos: [
        {
          id: "R1",
          rdoDate: "2026-03-05",
          createdAt: "2026-03-05T17:00:00-03:00",
          metrics: { total: 5, concluidas: 2 },
          evidenciasTotal: 3,
        },
        {
          id: "R2",
          rdoDate: "2026-03-20",
          createdAt: "2026-03-20T17:00:00-03:00",
          metrics: { total: 4, concluidas: 3 },
          evidenciasTotal: 5,
        },
      ],
    },
    ...overrides,
  };
}

test("normal month aggregation separates planned and executed", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  const metrics = aggregated.current.metrics;
  assert.equal(metrics.totalPlannedActivities, 7);
  assert.equal(metrics.totalExecutedActivities, 3);
  assert.equal(metrics.completed, 3);
  assert.equal(metrics.inProgress, 1);
  assert.equal(metrics.scheduled, 1);
  assert.equal(metrics.backlog, 2);
  assert.equal(metrics.cancelled, 1);
});

test("status synonym normalization works", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const activity = normalized.currentPeriod.activities.find((item) => item.id === "A2");
  const activity2 = normalized.currentPeriod.activities.find((item) => item.id === "A5");
  assert.equal(activity.status, "em_execucao");
  assert.equal(activity2.status, "agendada");
});

test("overdue and backlog remain independent", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  const metrics = aggregated.current.metrics;
  assert.equal(metrics.backlog, 2);
  assert.equal(metrics.overdue, 3);
});

test("SLA counts only eligible executed activities", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  const metrics = aggregated.current.metrics;
  assert.equal(metrics.slaEligibleActivities, 3);
  assert.equal(metrics.slaOnTime, 0);
  assert.equal(metrics.slaLate, 3);
});

test("docs compliance tracks ok/partial/unknown", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  const metrics = aggregated.current.metrics;
  assert.equal(metrics.docsRequired, 2);
  assert.equal(metrics.docsOk, 1);
  assert.equal(metrics.docsPartial, 1);
  assert.equal(metrics.docsUnknown, 1);
  assert.equal(metrics.docsCompliancePct, 50);
});

test("backlog can be non-overdue when dueDate is cutoff day", () => {
  const input = buildBaseInput();
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  const plannedSet = aggregated.current.breakdowns.byStatus;
  assert.equal(plannedSet.backlog, 2);
  assert.ok(aggregated.current.metrics.overdue >= 1);
});

test("comparison mode recalculated handles missing previousPeriod", () => {
  const input = buildBaseInput({ comparisonMode: "recalculated", previousPeriod: null });
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  assert.equal(aggregated.comparisonMode, "recalculated");
  assert.equal(aggregated.previous, null);
});

test("comparison mode provided uses previousPeriod", () => {
  const input = buildBaseInput({
    comparisonMode: "provided",
    previousPeriod: {
      period: { start: "2026-02-01", end: "2026-02-28" },
      activities: [
        {
          id: "P1",
          title: "Prev 1",
          status: "Concluida",
          dueDate: "2026-02-10",
          doneAt: "2026-02-11T10:00:00-03:00",
          category: "inspecao",
          docs: { apr: true, os: true },
        },
      ],
      rdos: [],
    },
  });
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  assert.equal(aggregated.comparisonMode, "provided");
  assert.ok(aggregated.previous);
  assert.equal(aggregated.previous.metrics.totalExecutedActivities, 1);
});

test("partial month trims planned range", () => {
  const input = buildBaseInput({
    currentPeriod: {
      period: { start: "2026-03-01", end: "2026-03-15" },
      activities: buildBaseInput().currentPeriod.activities,
      rdos: buildBaseInput().currentPeriod.rdos,
    },
  });
  const normalized = normalizeMonthlyReportInput(input);
  const aggregated = aggregateMonthlyReport(normalized);
  assert.ok(aggregated.current.metrics.totalPlannedActivities < 7);
});
