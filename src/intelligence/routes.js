const express = require("express");
const { createIntelligenceOrchestrator } = require("./orchestrator");
const { parseInteger, parseScopeFromRequest } = require("./api/validators");
const { presentSummary, presentInconsistency, presentScenario } = require("./api/presenters");
const { safeText } = require("./normalize/keyResolver");

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

  return router;
}

module.exports = {
  createIntelligenceRouter,
};
