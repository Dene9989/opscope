const test = require("node:test");
const assert = require("node:assert/strict");

const {
  computePriorityScore,
  computeConfidence,
  computeEstimatedImpact,
} = require("../src/intelligence/turnPlan/priority");

test("priority score is deterministic for the same input", () => {
  const input = {
    severity: "critical",
    status: "aberta",
    detectedAt: "2026-02-27T10:00:00.000Z",
    recurrenceCount: 3,
    isCritical: true,
    riskScore: 78,
    openDays: 4,
  };
  const first = computePriorityScore(input, {
    now: new Date("2026-02-28T10:00:00.000Z"),
  });
  const second = computePriorityScore(input, {
    now: new Date("2026-02-28T10:00:00.000Z"),
  });
  assert.equal(first.score, second.score);
  assert.deepEqual(first.breakdown, second.breakdown);
});

test("critical/open/recurrent event scores higher than closed low severity event", () => {
  const high = computePriorityScore(
    {
      severity: "critical",
      status: "aberta",
      detectedAt: "2026-02-28T08:00:00.000Z",
      recurrenceCount: 4,
      isCritical: true,
      riskScore: 80,
      openDays: 3,
    },
    { now: new Date("2026-02-28T12:00:00.000Z") }
  );
  const low = computePriorityScore(
    {
      severity: "low",
      status: "concluida",
      detectedAt: "2026-01-10T08:00:00.000Z",
      recurrenceCount: 1,
      isCritical: false,
      riskScore: 10,
      openDays: 0,
    },
    { now: new Date("2026-02-28T12:00:00.000Z") }
  );
  assert.ok(high.score > low.score);
  assert.ok(high.score >= 70);
  assert.ok(low.score <= 30);
});

test("confidence and impact return bounded values", () => {
  const confidence = computeConfidence({
    severity: "high",
    status: "open",
    ruleId: "critical_open_overdue",
    eventIds: ["e1", "e2"],
    evidence: [{ kind: "eventId", id: "e1" }],
    projectId: "P1",
    detectedAt: "2026-02-28T08:00:00.000Z",
  });
  const impact = computeEstimatedImpact({
    priorityScore: 88,
    recurrenceCount: 3,
    isCritical: true,
  });
  assert.ok(confidence >= 0 && confidence <= 100);
  assert.ok(impact.downtimeMin > 0);
  assert.ok(impact.riskDelta < 0);
  assert.ok(impact.costDelta >= 0);
});

