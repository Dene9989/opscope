const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");

const { createIntelligenceRouter } = require("../src/intelligence/routes");

function createFixture() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "opscope-turn-plan-"));
  const sourceFile = path.join(tempDir, "maintenance.json");
  const usersFile = path.join(tempDir, "users.json");
  const feedbackFile = path.join(tempDir, "turn_plan_feedback.json");
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  const records = [
    {
      id: "m1",
      projectId: "P1",
      title: "Falha no transformador principal",
      status: "aberta",
      severity: "critical",
      event_ts: now.toISOString(),
      dueAt: yesterday.toISOString(),
      descricao: "Falha de comando sem procedimento registrado",
      asset: "TR-01",
    },
    {
      id: "m2",
      projectId: "P1",
      title: "Backlog em painel auxiliar",
      status: "aberta",
      severity: "high",
      event_ts: twoDaysAgo.toISOString(),
      dueAt: yesterday.toISOString(),
      descricao: "Pendente de validacao da equipe",
      asset: "PA-11",
    },
  ];

  fs.writeFileSync(sourceFile, JSON.stringify(records, null, 2), "utf8");
  fs.writeFileSync(usersFile, "[]", "utf8");

  const app = express();
  app.use(express.json());
  app.use(
    createIntelligenceRouter({
      requireAuth: (req, _res, next) => {
        req.currentUser = { id: "u_test", name: "Tester" };
        next();
      },
      sourceRegistry: {
        inteligencia: [{ filePath: sourceFile, logicalSource: "manutencao" }],
      },
      baseDataDir: tempDir,
      usersFile,
      turnPlanEnabled: true,
      turnPlanFeedbackFile: feedbackFile,
      getDefaultProjectId: () => "P1",
      canAccessProject: () => true,
    })
  );

  const server = app.listen(0);
  const address = server.address();
  const port = address && typeof address === "object" ? address.port : 0;

  return {
    tempDir,
    feedbackFile,
    server,
    baseUrl: `http://127.0.0.1:${port}`,
  };
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.text();
  let payload = null;
  try {
    payload = JSON.parse(body);
  } catch (_) {
    payload = null;
  }
  return { response, payload, body };
}

test("GET /api/turn-plan returns prioritized actions with bounded page size", async () => {
  const fixture = createFixture();
  try {
    const { response, payload } = await requestJson(
      `${fixture.baseUrl}/api/turn-plan?projectId=P1&source=inteligencia&limit=20&page=1`
    );
    assert.equal(response.status, 200);
    assert.ok(payload && payload.ok);
    assert.equal(payload.enabled, true);
    assert.ok(typeof payload.planId === "string" && payload.planId.length > 0);
    assert.ok(Array.isArray(payload.actions));
    assert.ok(payload.actions.length > 0);
    assert.ok(payload.actions.length <= 20);

    const first = payload.actions[0];
    assert.ok(typeof first.id === "string" && first.id.length > 0);
    assert.ok(typeof first.type === "string" && first.type.length > 0);
    assert.ok(Number.isFinite(Number(first.priorityScore)));
    assert.ok(Number.isFinite(Number(first.confidence)));
    assert.ok(first.estimatedImpact && typeof first.estimatedImpact === "object");
    assert.ok(Array.isArray(first.evidence));
    assert.ok(Array.isArray(first.why));
    assert.ok(first.constraints && typeof first.constraints === "object");
  } finally {
    fixture.server.close();
    fs.rmSync(fixture.tempDir, { recursive: true, force: true });
  }
});

test("POST /api/turn-plan/:planId/feedback persists and appears in metrics", async () => {
  const fixture = createFixture();
  try {
    const planResult = await requestJson(
      `${fixture.baseUrl}/api/turn-plan?projectId=P1&source=inteligencia&limit=20&page=1`
    );
    assert.equal(planResult.response.status, 200);
    const action = Array.isArray(planResult.payload.actions) ? planResult.payload.actions[0] : null;
    assert.ok(action && action.id);

    const feedbackResult = await requestJson(
      `${fixture.baseUrl}/api/turn-plan/${encodeURIComponent(planResult.payload.planId)}/feedback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionId: action.id,
          outcome: "success",
          notes: "Executado no turno sem bloqueios.",
          timeSpentMin: 35,
          preventedDowntimeMin: 80,
        }),
      }
    );
    assert.equal(feedbackResult.response.status, 200);
    assert.ok(feedbackResult.payload && feedbackResult.payload.ok);
    assert.ok(feedbackResult.payload.item && feedbackResult.payload.item.id);

    const feedbackDoc = JSON.parse(fs.readFileSync(fixture.feedbackFile, "utf8"));
    assert.ok(Array.isArray(feedbackDoc.items));
    assert.ok(feedbackDoc.items.some((item) => item.actionId === action.id));

    const metricsResult = await requestJson(
      `${fixture.baseUrl}/api/turn-plan/metrics?projectId=P1&range=30d`
    );
    assert.equal(metricsResult.response.status, 200);
    assert.ok(metricsResult.payload && metricsResult.payload.ok);
    assert.ok(metricsResult.payload.metrics.totalFeedback >= 1);
    assert.ok(metricsResult.payload.metrics.acertos >= 1);
  } finally {
    fixture.server.close();
    fs.rmSync(fixture.tempDir, { recursive: true, force: true });
  }
});

test("closed-loop calibration lowers confidence after repeated failed outcomes", async () => {
  const fixture = createFixture();
  try {
    const initialPlan = await requestJson(
      `${fixture.baseUrl}/api/turn-plan?projectId=P1&source=inteligencia&limit=20&page=1&force=true`
    );
    assert.equal(initialPlan.response.status, 200);
    const firstAction = Array.isArray(initialPlan.payload.actions) ? initialPlan.payload.actions[0] : null;
    assert.ok(firstAction && firstAction.id);
    const baselineConfidence = Number(firstAction.confidence || 0);

    for (let i = 0; i < 3; i += 1) {
      const feedbackResult = await requestJson(
        `${fixture.baseUrl}/api/turn-plan/${encodeURIComponent(initialPlan.payload.planId)}/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionId: firstAction.id,
            outcome: "fail",
            notes: `Falha recorrente de validação ${i + 1}`,
            timeSpentMin: 15,
          }),
        }
      );
      assert.equal(feedbackResult.response.status, 200);
    }

    const calibratedPlan = await requestJson(
      `${fixture.baseUrl}/api/turn-plan?projectId=P1&source=inteligencia&limit=20&page=1&force=true`
    );
    assert.equal(calibratedPlan.response.status, 200);
    const calibratedAction = Array.isArray(calibratedPlan.payload.actions)
      ? calibratedPlan.payload.actions[0] || null
      : null;
    assert.ok(calibratedAction, "plano calibrado deve retornar ao menos uma ação");
    assert.equal(String(calibratedAction.type || ""), String(firstAction.type || ""));
    assert.ok(Number(calibratedAction.confidence || 0) <= baselineConfidence - 5);
    assert.ok(calibratedAction.learning && Number(calibratedAction.learning.sampleSize || 0) >= 3);
  } finally {
    fixture.server.close();
    fs.rmSync(fixture.tempDir, { recursive: true, force: true });
  }
});
