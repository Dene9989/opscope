const express = require("express");
const crypto = require("crypto");
const { createIntelligenceOrchestrator } = require("./orchestrator");
const { parseDateParam, parseInteger, parseScopeFromRequest } = require("./api/validators");
const { presentSummary, presentInconsistency, presentScenario } = require("./api/presenters");
const { safeText } = require("./normalize/keyResolver");
const { TurnPlanFeedbackStore, normalizeOutcome } = require("./turnPlan/feedbackStore");

function createIntelligenceRouter(options = {}) {
  const router = express.Router();
  const auth = options.requireAuth;
  if (typeof auth !== "function") {
    throw new Error("createIntelligenceRouter requires requireAuth middleware.");
  }

  const orchestrator = createIntelligenceOrchestrator({
    sourceRegistry: options.sourceRegistry || {},
    baseDataDir: options.baseDataDir || "",
    usersFile: options.usersFile || "",
    databaseUrl: options.databaseUrl || "",
    dbStoreTable: options.dbStoreTable || "opscope_store",
    rebuildTtlMs: options.rebuildTtlMs,
    eventsFile: options.eventsFile,
    inconsistenciesFile: options.inconsistenciesFile,
    scenariosFile: options.scenariosFile,
    snapshotsFile: options.snapshotsFile,
  });
  const turnPlanEnabled = Boolean(options.turnPlanEnabled);
  const turnPlanFeedbackStore = turnPlanEnabled
    ? new TurnPlanFeedbackStore({
        filePath: options.turnPlanFeedbackFile,
      })
    : null;
  const turnPlanResponseWarnBytes = Math.max(
    256 * 1024,
    Number(options.turnPlanResponseWarnBytes) || 1024 * 1024
  );
  const turnPlanCacheTtlMs = Math.max(
    30 * 1000,
    Number(options.turnPlanCacheTtlMs) || 30 * 60 * 1000
  );
  const turnPlanLearningRangeDays = Math.max(
    7,
    Math.min(180, Number(options.turnPlanLearningRangeDays) || 90)
  );
  const turnPlanCache = new Map();

  function clampNumber(value, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return min;
    }
    if (numeric < min) {
      return min;
    }
    if (numeric > max) {
      return max;
    }
    return numeric;
  }

  function hashProjectId(projectId) {
    const value = safeText(projectId);
    if (!value) {
      return "na";
    }
    return crypto.createHash("sha1").update(value).digest("hex").slice(0, 12);
  }

  function sendTurnPlanResponse(res, { status = 200, payload = {}, projectId = "", actionsCount = 0, startedAt }) {
    const safePayload = payload && typeof payload === "object" ? payload : {};
    const body = JSON.stringify(safePayload);
    const responseBytes = Buffer.byteLength(body, "utf8");
    const durationMs = Math.max(0, Date.now() - startedAt);
    const projectIdHash = hashProjectId(projectId);
    console.log(
      `[turn-plan] durationMs=${durationMs} responseBytes=${responseBytes} projectIdHash=${projectIdHash} actionsCount=${actionsCount}`
    );
    if (responseBytes > turnPlanResponseWarnBytes) {
      console.warn("[turn-plan] response payload above warning threshold.", {
        responseBytes,
        warnBytes: turnPlanResponseWarnBytes,
        projectIdHash,
      });
    }
    return res.status(status).type("application/json").send(body);
  }

  function ensureTurnPlanEnabled(res, projectId = "", startedAt = Date.now()) {
    if (turnPlanEnabled) {
      return true;
    }
    sendTurnPlanResponse(res, {
      status: 404,
      payload: {
        enabled: false,
        message: "Plano de turno desativado.",
      },
      projectId,
      actionsCount: 0,
      startedAt,
    });
    return false;
  }

  function parseRangeDays(value) {
    const raw = safeText(value).toLowerCase();
    if (!raw) {
      return 30;
    }
    const match = raw.match(/^(\d{1,3})d$/);
    if (!match) {
      return 30;
    }
    const days = Number(match[1]);
    if (!Number.isFinite(days)) {
      return 30;
    }
    return Math.max(1, Math.min(365, Math.floor(days)));
  }

  function getOutcomeScore(outcome) {
    const normalized = normalizeOutcome(outcome);
    if (normalized === "success") {
      return 1;
    }
    if (normalized === "partial") {
      return 0.5;
    }
    if (normalized === "fail") {
      return 0;
    }
    return null;
  }

  function deriveLearningProfile(rows = []) {
    const byType = new Map();
    const global = {
      total: 0,
      known: 0,
      successEquivalent: 0,
    };

    (Array.isArray(rows) ? rows : []).forEach((row) => {
      const actionType = safeText(row && row.actionType) || "other";
      const score = getOutcomeScore(row && row.outcome);
      let bucket = byType.get(actionType);
      if (!bucket) {
        bucket = {
          total: 0,
          known: 0,
          successEquivalent: 0,
        };
        byType.set(actionType, bucket);
      }
      bucket.total += 1;
      global.total += 1;
      if (score !== null) {
        bucket.known += 1;
        bucket.successEquivalent += score;
        global.known += 1;
        global.successEquivalent += score;
      }
    });

    const summarize = (bucket) => {
      const known = Number(bucket && bucket.known) || 0;
      const successEquivalent = Number(bucket && bucket.successEquivalent) || 0;
      return {
        total: Number(bucket && bucket.total) || 0,
        known,
        successRate: known > 0 ? successEquivalent / known : 0,
      };
    };

    const typeSummary = {};
    byType.forEach((bucket, actionType) => {
      typeSummary[actionType] = summarize(bucket);
    });

    return {
      byType: typeSummary,
      global: summarize(global),
    };
  }

  function applyClosedLoopCalibration(actions = [], learningProfile = null) {
    if (!learningProfile || !learningProfile.global) {
      return Array.isArray(actions) ? actions : [];
    }
    const globalStats = learningProfile.global;
    const baselineAccuracy = 0.6;
    return (Array.isArray(actions) ? actions : []).map((action) => {
      if (!action || typeof action !== "object") {
        return action;
      }
      const type = safeText(action.type) || "other";
      const typedStats = learningProfile.byType ? learningProfile.byType[type] : null;
      const stats =
        typedStats && typedStats.known >= 3
          ? typedStats
          : globalStats && globalStats.known >= 10
            ? globalStats
            : null;
      if (!stats) {
        return action;
      }
      const baseConfidence = clampNumber(Number(action.confidence || 0), 0, 100);
      const shiftRaw = Math.round((Number(stats.successRate || 0) - baselineAccuracy) * 35);
      const shift = clampNumber(shiftRaw, -12, 12);
      if (!shift) {
        return action;
      }
      const adjustedConfidence = clampNumber(Math.round(baseConfidence + shift), 0, 100);
      const learningReason = `Confiança calibrada por histórico (${Math.round(
        Number(stats.successRate || 0) * 100
      )}% em ${Number(stats.known || 0)} feedbacks).`;
      const whyBase = Array.isArray(action.why) ? action.why.slice(0, 3) : [];
      const why = whyBase.concat(learningReason);
      return {
        ...action,
        confidence: adjustedConfidence,
        why,
        learning: {
          sampleSize: Number(stats.total || 0),
          knownOutcomes: Number(stats.known || 0),
          successRatePct: Math.round(Number(stats.successRate || 0) * 100),
          confidenceAdjustment: adjustedConfidence - baseConfidence,
        },
      };
    });
  }

  function compactActionForFeedback(action) {
    return {
      id: safeText(action && action.id),
      type: safeText(action && action.type),
      priorityScore: Number(action && action.priorityScore ? action.priorityScore : 0),
      confidence: Number(action && action.confidence ? action.confidence : 0),
      recommendedNextStep: safeText(action && action.recommendedNextStep),
    };
  }

  function pruneTurnPlanCache() {
    const now = Date.now();
    for (const [planId, cached] of turnPlanCache.entries()) {
      if (!cached || !cached.expiresAt || cached.expiresAt <= now) {
        turnPlanCache.delete(planId);
      }
    }
    if (turnPlanCache.size <= 150) {
      return;
    }
    const ordered = Array.from(turnPlanCache.entries()).sort(
      (a, b) => Number((a[1] && a[1].createdAtMs) || 0) - Number((b[1] && b[1].createdAtMs) || 0)
    );
    ordered.slice(0, Math.max(0, ordered.length - 150)).forEach(([planId]) => {
      turnPlanCache.delete(planId);
    });
  }

  function resolveProjectId(req, scope) {
    const currentUser = req.currentUser || null;
    const fallbackProjectId =
      typeof options.getDefaultProjectId === "function"
        ? safeText(options.getDefaultProjectId(req, currentUser))
        : "";
    return safeText(scope.projectId || fallbackProjectId);
  }

  function ensureProjectAccess(req, projectId) {
    const currentUser = req.currentUser || null;
    if (!projectId) {
      return true;
    }
    if (typeof options.canAccessProject !== "function") {
      return true;
    }
    return Boolean(options.canAccessProject(req, projectId, currentUser));
  }

  router.get("/api/intelligence/health", auth, (req, res) => {
    return res.json({
      ok: true,
      health: orchestrator.health(),
      features: {
        turnPlanEnabled,
      },
    });
  });

  router.post("/api/intelligence/rebuild", auth, async (req, res) => {
    const scope = parseScopeFromRequest(req, req.body || {});
    const projectId = resolveProjectId(req, scope);
    const rawFrom = safeText((req.body && req.body.from) || "");
    const rawTo = safeText((req.body && req.body.to) || "");
    if (rawFrom && !scope.from) {
      return res.status(400).json({ message: "Parâmetro from inválido. Use YYYY-MM-DD." });
    }
    if (rawTo && !scope.to) {
      return res.status(400).json({ message: "Parâmetro to inválido. Use YYYY-MM-DD." });
    }
    if (scope.from && scope.to && scope.from > scope.to) {
      return res.status(400).json({ message: "Intervalo inválido: from deve ser menor ou igual a to." });
    }
    if (projectId && !ensureProjectAccess(req, projectId)) {
      return res.status(403).json({ message: "Projeto não autorizado para inteligência operacional." });
    }
    try {
      const result = await orchestrator.rebuild({
        ...scope,
        projectId,
      });
      return res.json({
        ok: true,
        source: result.source,
        projectId: result.projectId,
        scopeKey: result.scopeKey,
        generatedAt: result.generatedAt,
        counts: result.counts,
        summary: presentSummary(result.summary),
        scenarios: Array.isArray(result.scenarios) ? result.scenarios.map(presentScenario) : [],
      });
    } catch (error) {
      return res.status(500).json({
        message:
          (error && error.message) || "Falha ao reconstruir inteligência operacional.",
        reason: "intelligence_rebuild_failed",
      });
    }
  });

  router.get("/api/intelligence/summary", auth, async (req, res) => {
    const scope = parseScopeFromRequest(req, {});
    const force = String(req.query.force || "").toLowerCase() === "true";
    const projectId = resolveProjectId(req, scope);
    const rawFrom = safeText(req.query.from || "");
    const rawTo = safeText(req.query.to || "");
    if (rawFrom && !scope.from) {
      return res.status(400).json({ message: "Parâmetro from inválido. Use YYYY-MM-DD." });
    }
    if (rawTo && !scope.to) {
      return res.status(400).json({ message: "Parâmetro to inválido. Use YYYY-MM-DD." });
    }
    if (scope.from && scope.to && scope.from > scope.to) {
      return res.status(400).json({ message: "Intervalo inválido: from deve ser menor ou igual a to." });
    }
    if (projectId && !ensureProjectAccess(req, projectId)) {
      return res.status(403).json({ message: "Projeto não autorizado para inteligência operacional." });
    }
    try {
      const result = await orchestrator.getSummary(
        {
          ...scope,
          projectId,
        },
        { force }
      );
      return res.json({
        ok: true,
        scopeKey: result.scopeKey,
        source: result.source,
        projectId: result.projectId,
        from: result.from,
        to: result.to,
        generatedAt: result.generatedAt,
        summary: presentSummary(result.summary),
        scenarios: Array.isArray(result.scenarios) ? result.scenarios.map(presentScenario) : [],
        counts: result.counts || {},
      });
    } catch (error) {
      return res.status(500).json({
        message: (error && error.message) || "Falha ao carregar resumo de inteligência.",
        reason: "intelligence_summary_failed",
      });
    }
  });

  router.get("/api/intelligence/inconsistencies", auth, async (req, res) => {
    const scope = parseScopeFromRequest(req, {});
    const projectId = resolveProjectId(req, scope);
    const force = String(req.query.force || "").toLowerCase() === "true";
    const rawFrom = safeText(req.query.from || "");
    const rawTo = safeText(req.query.to || "");
    if (rawFrom && !scope.from) {
      return res.status(400).json({ message: "Parâmetro from inválido. Use YYYY-MM-DD." });
    }
    if (rawTo && !scope.to) {
      return res.status(400).json({ message: "Parâmetro to inválido. Use YYYY-MM-DD." });
    }
    if (scope.from && scope.to && scope.from > scope.to) {
      return res.status(400).json({ message: "Intervalo inválido: from deve ser menor ou igual a to." });
    }
    const limit = parseInteger(req.query.limit, 50, { min: 1, max: 200 });
    const offset = parseInteger(req.query.offset, 0, { min: 0, max: 5000 });
    const severity = safeText(req.query.severity).toLowerCase();
    const status = safeText(req.query.status).toLowerCase();
    if (projectId && !ensureProjectAccess(req, projectId)) {
      return res.status(403).json({ message: "Projeto não autorizado para inteligência operacional." });
    }
    try {
      const result = await orchestrator.listInconsistencies(
        {
          ...scope,
          projectId,
          limit,
          offset,
          severity,
          status,
        },
        { force }
      );
      return res.json({
        ok: true,
        scopeKey: result.scopeKey,
        generatedAt: result.generatedAt,
        total: result.total,
        limit,
        offset,
        items: Array.isArray(result.items) ? result.items.map(presentInconsistency) : [],
      });
    } catch (error) {
      return res.status(500).json({
        message: (error && error.message) || "Falha ao listar inconsistências.",
        reason: "intelligence_inconsistencies_failed",
      });
    }
  });

  router.get("/api/intelligence/inconsistencies/:id", auth, async (req, res) => {
    const scope = parseScopeFromRequest(req, {});
    const projectId = resolveProjectId(req, scope);
    const force = String(req.query.force || "").toLowerCase() === "true";
    const rawFrom = safeText(req.query.from || "");
    const rawTo = safeText(req.query.to || "");
    if (rawFrom && !scope.from) {
      return res.status(400).json({ message: "Parâmetro from inválido. Use YYYY-MM-DD." });
    }
    if (rawTo && !scope.to) {
      return res.status(400).json({ message: "Parâmetro to inválido. Use YYYY-MM-DD." });
    }
    if (scope.from && scope.to && scope.from > scope.to) {
      return res.status(400).json({ message: "Intervalo inválido: from deve ser menor ou igual a to." });
    }
    const id = safeText(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "ID de inconsistência inválido." });
    }
    if (projectId && !ensureProjectAccess(req, projectId)) {
      return res.status(403).json({ message: "Projeto não autorizado para inteligência operacional." });
    }
    try {
      const item = await orchestrator.getInconsistencyById(
        id,
        {
          ...scope,
          projectId,
        },
        { force }
      );
      if (!item) {
        return res.status(404).json({ message: "Inconsistência não encontrada." });
      }
      return res.json({
        ok: true,
        item: presentInconsistency(item),
      });
    } catch (error) {
      return res.status(500).json({
        message: (error && error.message) || "Falha ao carregar inconsistência.",
        reason: "intelligence_inconsistency_failed",
      });
    }
  });

  router.post("/api/intelligence/scenarios/simulate", auth, async (req, res) => {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const scope = parseScopeFromRequest(req, body);
    const projectId = resolveProjectId(req, scope);
    const force = String(req.query.force || body.force || "").toLowerCase() === "true";
    const rawFrom = safeText(body.from !== undefined ? body.from : req.query.from || "");
    const rawTo = safeText(body.to !== undefined ? body.to : req.query.to || "");
    if (rawFrom && !scope.from) {
      return res.status(400).json({ message: "Parâmetro from inválido. Use YYYY-MM-DD." });
    }
    if (rawTo && !scope.to) {
      return res.status(400).json({ message: "Parâmetro to inválido. Use YYYY-MM-DD." });
    }
    if (scope.from && scope.to && scope.from > scope.to) {
      return res.status(400).json({ message: "Intervalo inválido: from deve ser menor ou igual a to." });
    }
    const scenarioId = safeText(body.scenarioId || body.id);
    if (!scenarioId) {
      return res.status(400).json({ message: "Informe scenarioId para simulação." });
    }
    if (projectId && !ensureProjectAccess(req, projectId)) {
      return res.status(403).json({ message: "Projeto não autorizado para inteligência operacional." });
    }
    try {
      const simulation = await orchestrator.simulate(
        {
          ...scope,
          projectId,
          scenarioId,
          overrides: body.overrides && typeof body.overrides === "object" ? body.overrides : {},
        },
        { force }
      );
      return res.json({
        ok: true,
        scenario: presentScenario(simulation),
      });
    } catch (error) {
      return res.status(400).json({
        message: (error && error.message) || "Falha ao simular cenário.",
        reason: "intelligence_scenario_failed",
      });
    }
  });

  router.get("/api/turn-plan", auth, async (req, res) => {
    const startedAt = Date.now();
    const scope = parseScopeFromRequest(req, {});
    const projectId = resolveProjectId(req, scope);
    if (!ensureTurnPlanEnabled(res, projectId, startedAt)) {
      return;
    }
    const rawDate = safeText(req.query.date || "");
    const date = parseDateParam(rawDate);
    if (rawDate && !date) {
      return sendTurnPlanResponse(res, {
        status: 400,
        payload: { message: "Parâmetro date inválido. Use YYYY-MM-DD." },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    }
    const force = String(req.query.force || "").toLowerCase() === "true";
    const source = safeText(req.query.source) ? scope.source : "inteligencia";
    const mode = safeText(req.query.mode || "assisted");
    const shift = safeText(req.query.shift || "all");
    const limit = parseInteger(req.query.limit, 20, { min: 1, max: 20 });
    const page = parseInteger(req.query.page, 1, { min: 1, max: 1000 });
    if (projectId && !ensureProjectAccess(req, projectId)) {
      return sendTurnPlanResponse(res, {
        status: 403,
        payload: { message: "Projeto não autorizado para plano de turno." },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    }

    try {
      const result = await orchestrator.getTurnPlan(
        {
          ...scope,
          source,
          projectId,
          date,
          shift,
          mode,
          limit,
          page,
        },
        { force }
      );
      let learningProfile = null;
      try {
        const learningSince = new Date(
          Date.now() - turnPlanLearningRangeDays * 24 * 60 * 60 * 1000
        );
        const feedbackRows = turnPlanFeedbackStore.listFeedback({
          projectId: result.projectId || projectId,
          since: learningSince,
        });
        learningProfile = deriveLearningProfile(feedbackRows);
      } catch (_) {
        learningProfile = null;
      }
      const publicActions = applyClosedLoopCalibration(
        Array.isArray(result.actions) ? result.actions : [],
        learningProfile
      );
      const allActions = Array.isArray(result._allActionsInternal)
        ? result._allActionsInternal
        : Array.isArray(publicActions)
          ? publicActions
          : [];
      const actionIndex = new Map();
      allActions.forEach((action) => {
        const actionId = safeText(action && action.id);
        if (!actionId) {
          return;
        }
        actionIndex.set(actionId, compactActionForFeedback(action));
      });
      turnPlanCache.set(result.planId, {
        createdAtMs: startedAt,
        expiresAt: startedAt + turnPlanCacheTtlMs,
        projectId: result.projectId || projectId,
        date: result.date,
        shift: result.shift,
        mode: result.mode,
        actions: actionIndex,
      });
      pruneTurnPlanCache();
      const payload = {
        ok: true,
        enabled: true,
        planId: result.planId,
        projectId: result.projectId,
        date: result.date,
        shift: result.shift,
        mode: result.mode,
        generatedAt: result.generatedAt,
        source: result.source,
        pagination: result.pagination || {},
        actions: publicActions,
        closedLoop: {
          enabled: true,
          range: `${turnPlanLearningRangeDays}d`,
          sampleSize:
            learningProfile && learningProfile.global
              ? Number(learningProfile.global.total || 0)
              : 0,
        },
      };
      return sendTurnPlanResponse(res, {
        status: 200,
        payload,
        projectId: result.projectId || projectId,
        actionsCount: Array.isArray(payload.actions) ? payload.actions.length : 0,
        startedAt,
      });
    } catch (error) {
      return sendTurnPlanResponse(res, {
        status: 500,
        payload: {
          message: (error && error.message) || "Falha ao gerar plano de turno.",
          reason: "turn_plan_failed",
        },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    }
  });

  router.post("/api/turn-plan/:planId/feedback", auth, async (req, res) => {
    const startedAt = Date.now();
    const planId = safeText(req.params.planId);
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const actionId = safeText(body.actionId);
    const rawOutcome = safeText(body.outcome).toLowerCase();
    const allowedOutcomes = new Set(["success", "partial", "fail", "unknown"]);
    if (!ensureTurnPlanEnabled(res, safeText(body.projectId), startedAt)) {
      return;
    }
    if (!planId) {
      return sendTurnPlanResponse(res, {
        status: 400,
        payload: { message: "planId inválido." },
        projectId: "",
        actionsCount: 0,
        startedAt,
      });
    }
    if (!actionId) {
      return sendTurnPlanResponse(res, {
        status: 400,
        payload: { message: "actionId é obrigatório." },
        projectId: "",
        actionsCount: 0,
        startedAt,
      });
    }
    if (!allowedOutcomes.has(rawOutcome)) {
      return sendTurnPlanResponse(res, {
        status: 400,
        payload: { message: "outcome inválido. Use success|partial|fail|unknown." },
        projectId: "",
        actionsCount: 0,
        startedAt,
      });
    }
    pruneTurnPlanCache();
    const cachedPlan = turnPlanCache.get(planId);
    if (!cachedPlan || !cachedPlan.actions) {
      return sendTurnPlanResponse(res, {
        status: 404,
        payload: { message: "Plano expirado ou não encontrado. Gere o plano novamente." },
        projectId: "",
        actionsCount: 0,
        startedAt,
      });
    }
    const projectId = safeText(cachedPlan.projectId);
    if (projectId && !ensureProjectAccess(req, projectId)) {
      return sendTurnPlanResponse(res, {
        status: 403,
        payload: { message: "Projeto não autorizado para feedback do plano de turno." },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    }
    const action = cachedPlan.actions.get(actionId);
    if (!action) {
      return sendTurnPlanResponse(res, {
        status: 404,
        payload: { message: "Ação não encontrada para o plano informado." },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    }
    const parseOptionalInt = (value, max) => {
      if (value === undefined || value === null || value === "") {
        return null;
      }
      return parseInteger(value, 0, { min: 0, max });
    };
    try {
      const saved = turnPlanFeedbackStore.addFeedback({
        planId,
        actionId,
        projectId,
        actionType: action.type,
        outcome: normalizeOutcome(rawOutcome),
        notes: safeText(body.notes || ""),
        timeSpentMin: parseOptionalInt(body.timeSpentMin, 7 * 24 * 60),
        preventedDowntimeMin: parseOptionalInt(body.preventedDowntimeMin, 30 * 24 * 60),
      });
      return sendTurnPlanResponse(res, {
        status: 200,
        payload: {
          ok: true,
          item: saved,
        },
        projectId,
        actionsCount: 1,
        startedAt,
      });
    } catch (error) {
      return sendTurnPlanResponse(res, {
        status: 500,
        payload: {
          message: (error && error.message) || "Falha ao persistir feedback do plano de turno.",
          reason: "turn_plan_feedback_failed",
        },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    }
  });

  router.get("/api/turn-plan/metrics", auth, async (req, res) => {
    const startedAt = Date.now();
    const scope = parseScopeFromRequest(req, {});
    const projectId = resolveProjectId(req, scope);
    if (!ensureTurnPlanEnabled(res, projectId, startedAt)) {
      return;
    }
    if (projectId && !ensureProjectAccess(req, projectId)) {
      return sendTurnPlanResponse(res, {
        status: 403,
        payload: { message: "Projeto não autorizado para métricas do plano de turno." },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    }
    const rangeDays = parseRangeDays(req.query.range);
    const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);
    try {
      const rows = turnPlanFeedbackStore.listFeedback({ projectId, since });
      const outcomeCounts = {
        success: 0,
        partial: 0,
        fail: 0,
        unknown: 0,
      };
      const causes = new Map();
      let timeSpentTotal = 0;
      let timeSpentCount = 0;
      let preventedDowntimeTotal = 0;

      rows.forEach((row) => {
        const outcome = normalizeOutcome(row.outcome);
        outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1;
        if (outcome === "fail" || outcome === "partial") {
          const cause = safeText(row.causeCategory || "sem_causa");
          causes.set(cause, (causes.get(cause) || 0) + 1);
        }
        const timeSpent = Number(row.timeSpentMin);
        if (Number.isFinite(timeSpent) && timeSpent >= 0) {
          timeSpentTotal += timeSpent;
          timeSpentCount += 1;
        }
        const preventedDowntime = Number(row.preventedDowntimeMin);
        if (Number.isFinite(preventedDowntime) && preventedDowntime > 0) {
          preventedDowntimeTotal += preventedDowntime;
        }
      });

      const known = outcomeCounts.success + outcomeCounts.partial + outcomeCounts.fail;
      const acertos = outcomeCounts.success;
      const falsosPositivos = outcomeCounts.fail;
      const accuracyPct = known ? Math.round((acertos / known) * 100) : 0;
      const tempoMedioResolucaoMin = timeSpentCount
        ? Number((timeSpentTotal / timeSpentCount).toFixed(1))
        : 0;
      const topCausas = Array.from(causes.entries())
        .map(([cause, count]) => ({ cause, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return sendTurnPlanResponse(res, {
        status: 200,
        payload: {
          ok: true,
          projectId,
          range: `${rangeDays}d`,
          metrics: {
            totalFeedback: rows.length,
            acertos,
            falsosPositivos,
            outcomes: outcomeCounts,
            accuracyPct,
            tempoMedioResolucaoMin,
            preventedDowntimeMin: preventedDowntimeTotal,
            topCausas,
          },
        },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    } catch (error) {
      return sendTurnPlanResponse(res, {
        status: 500,
        payload: {
          message: (error && error.message) || "Falha ao calcular métricas do plano de turno.",
          reason: "turn_plan_metrics_failed",
        },
        projectId,
        actionsCount: 0,
        startedAt,
      });
    }
  });

  return router;
}

module.exports = {
  createIntelligenceRouter,
};
