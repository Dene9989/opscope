const {
  normalizeSourceId,
  safeText,
  parseDate,
  stableHash,
} = require("./normalize/keyResolver");
const { DEFAULT_REBUILD_TTL_MS, severityValue } = require("./contracts");
const { normalizeSourceRegistry, resolveSourceEntries } = require("./ingestion/sourceRegistry");
const { loadRecordsFromEntries } = require("./ingestion/loaders");
const { buildUserIndex, normalizeRecordEvent } = require("./normalize/eventNormalizer");
const { extractSignals } = require("./normalize/signalExtractor");
const { runRules } = require("./rules/rules.engine");
const { buildScenarioPreviews, simulateScenario } = require("./scenarios/scenario.engine");
const { createIntelligenceStore } = require("./store/intelligenceStore");
const { buildTurnPlan } = require("./turnPlan/planBuilder");

function parseDay(value, endOfDay = false) {
  const date = parseDate(value);
  if (!date) {
    return null;
  }
  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

function stableSortObject(input) {
  if (Array.isArray(input)) {
    return input.map((item) => stableSortObject(item));
  }
  if (!input || typeof input !== "object") {
    return input;
  }
  const output = {};
  Object.keys(input)
    .sort()
    .forEach((key) => {
      output[key] = stableSortObject(input[key]);
    });
  return output;
}

function buildScopeKey({ source, projectId, from, to, filters }) {
  const normalizedSource = normalizeSourceId(source || "all");
  const normalizedProject = safeText(projectId);
  const normalizedFrom = safeText(from);
  const normalizedTo = safeText(to);
  const filtersHash = stableHash(JSON.stringify(stableSortObject(filters || {})));
  return [normalizedSource || "all", normalizedProject || "_", normalizedFrom || "_", normalizedTo || "_", filtersHash.slice(0, 10)].join(
    "::"
  );
}

function valueContains(haystack, needle) {
  const source = safeText(haystack).toLowerCase();
  const token = safeText(needle).toLowerCase();
  if (!token) {
    return true;
  }
  return source.includes(token);
}

function matchesAdditionalFilters(event, filters = {}) {
  if (!filters || typeof filters !== "object") {
    return true;
  }
  return Object.entries(filters).every(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return true;
    }
    const normalizedKey = safeText(key).toLowerCase();
    if (!normalizedKey || normalizedKey === "projectid" || normalizedKey === "projetoid") {
      return true;
    }
    if (normalizedKey === "search") {
      return valueContains(event.searchText, value);
    }
    const candidate = event[normalizedKey] || event[key] || "";
    if (candidate !== "") {
      return valueContains(candidate, value);
    }
    return valueContains(event.searchText, value);
  });
}

function matchesScope(event, { projectId, from, to, filters }) {
  const scopeProject = safeText(projectId);
  const eventProject = safeText(event.projectId);
  if (scopeProject && eventProject && scopeProject !== eventProject) {
    return false;
  }
  if (scopeProject && !eventProject) {
    return false;
  }

  const fromDate = parseDay(from, false);
  const toDate = parseDay(to, true);
  if (fromDate || toDate) {
    const eventDate = parseDate(event.eventTs || event.dueTs || event.doneTs || "");
    if (!eventDate) {
      return false;
    }
    if (fromDate && eventDate < fromDate) {
      return false;
    }
    if (toDate && eventDate > toDate) {
      return false;
    }
  }
  return matchesAdditionalFilters(event, filters);
}

function buildSummary({ events = [], inconsistencies = [], source = "all", projectId = "" }) {
  const totalEvents = events.length;
  const eventsWithProjectId = events.filter((event) => safeText(event.projectId)).length;
  const eventsWithoutProjectId = Math.max(0, totalEvents - eventsWithProjectId);
  const openEvents = events.filter((event) => event.signals && event.signals.isOpen).length;
  const closedEvents = events.filter((event) => event.signals && event.signals.isClosed).length;
  const overdueEvents = events.filter((event) => event.signals && event.signals.overdue).length;
  const criticalOpen = events.filter(
    (event) => event.signals && event.signals.isOpen && event.signals.isCritical
  ).length;

  const recurringFailures = inconsistencies.filter((item) =>
    String(item.ruleId || "").includes("recurring_failure")
  ).length;

  const topSourcesMap = new Map();
  events.forEach((event) => {
    const key = safeText(event.source || "unknown") || "unknown";
    topSourcesMap.set(key, (topSourcesMap.get(key) || 0) + 1);
  });
  const topSources = Array.from(topSourcesMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topRulesMap = new Map();
  inconsistencies.forEach((item) => {
    const key = safeText(item.ruleId || "generic");
    topRulesMap.set(key, (topRulesMap.get(key) || 0) + 1);
  });
  const topRules = Array.from(topRulesMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const riskBase = events.reduce((acc, event) => {
    const score = event && event.signals ? Number(event.signals.riskScore || 0) : 0;
    return acc + (Number.isFinite(score) ? score : 0);
  }, 0);
  const riskPenalty = inconsistencies.reduce((acc, item) => acc + severityValue(item.severity) * 7, 0);
  const riskScoreRaw =
    totalEvents > 0 ? Math.round(riskBase / totalEvents + riskPenalty / Math.max(totalEvents, 1)) : riskPenalty;
  const riskScore = Math.max(0, Math.min(100, riskScoreRaw));
  const riskLevel = riskScore >= 75 ? "critical" : riskScore >= 55 ? "high" : riskScore >= 30 ? "medium" : "low";

  const recommendations = [];
  if (criticalOpen > 0) {
    recommendations.push("Priorizar fechamento dos eventos críticos abertos no turno atual.");
  }
  if (overdueEvents > 0) {
    recommendations.push("Revisar carteira vencida e redistribuir responsáveis para reduzir atraso.");
  }
  if (recurringFailures > 0) {
    recommendations.push("Abrir plano técnico dedicado para ativos com falha recorrente.");
  }
  if (!recommendations.length) {
    recommendations.push("Manter monitoramento contínuo e disciplina de atualização dos registros.");
  }

  return {
    generatedAt: new Date().toISOString(),
    source,
    projectId,
    totalEvents,
    eventsWithProjectId,
    eventsWithoutProjectId,
    openEvents,
    closedEvents,
    overdueEvents,
    criticalOpen,
    recurringFailures,
    inconsistencyCount: inconsistencies.length,
    riskScore,
    riskLevel,
    topSources,
    topRules,
    recommendations,
  };
}

function buildCounts(events, inconsistencies) {
  return {
    events: Array.isArray(events) ? events.length : 0,
    inconsistencies: Array.isArray(inconsistencies) ? inconsistencies.length : 0,
  };
}

function getEventOrderTime(event) {
  const date = parseDate(event && (event.eventTs || event.dueTs || event.doneTs || ""));
  return date ? date.getTime() : 0;
}

function dedupeEvents(events = []) {
  const map = new Map();
  (Array.isArray(events) ? events : []).forEach((event) => {
    if (!event || typeof event !== "object") {
      return;
    }
    const eventId = safeText(event.eventId || event.id);
    if (!eventId) {
      return;
    }
    const key = [eventId, safeText(event.projectId || "_"), safeText(event.source || "_")].join("::");
    const current = map.get(key);
    if (!current) {
      map.set(key, event);
      return;
    }
    if (getEventOrderTime(event) >= getEventOrderTime(current)) {
      map.set(key, {
        ...current,
        ...event,
        signals: event.signals || current.signals || {},
      });
    }
  });
  return Array.from(map.values());
}

function isScopeStale(scope, ttlMs) {
  if (!scope || !scope.updatedAt) {
    return true;
  }
  const updatedAt = parseDate(scope.updatedAt);
  if (!updatedAt) {
    return true;
  }
  return Date.now() - updatedAt.getTime() > Math.max(1000, Number(ttlMs) || DEFAULT_REBUILD_TTL_MS);
}

function createIntelligenceOrchestrator(options = {}) {
  const sourceRegistry = normalizeSourceRegistry(options.sourceRegistry || {}, options.baseDataDir || "");
  const store = createIntelligenceStore({
    baseDataDir: options.baseDataDir,
    databaseUrl: options.databaseUrl,
    dbStoreTable: options.dbStoreTable,
    eventsFile: options.eventsFile,
    inconsistenciesFile: options.inconsistenciesFile,
    scenariosFile: options.scenariosFile,
    snapshotsFile: options.snapshotsFile,
  });

  const rebuildTtlMs = Math.max(30000, Number(options.rebuildTtlMs) || DEFAULT_REBUILD_TTL_MS);
  const usersFile = options.usersFile || "";

  async function rebuild(params = {}) {
    const source = normalizeSourceId(params.source || "all");
    const projectId = safeText(params.projectId);
    const from = safeText(params.from);
    const to = safeText(params.to);
    const filters = params.filters && typeof params.filters === "object" ? { ...params.filters } : {};
    const scopeKey = buildScopeKey({ source, projectId, from, to, filters });
    const generatedAt = new Date().toISOString();

    const resolvedSource = resolveSourceEntries(source, sourceRegistry);
    const rows = loadRecordsFromEntries(resolvedSource.entries);
    const userIndex = buildUserIndex(usersFile);

    const events = [];
    rows.forEach((row) => {
      const event = normalizeRecordEvent(row, {
        source: resolvedSource.source,
        userIndex,
      });
      if (!event) {
        return;
      }
      event.signals = extractSignals(event);
      if (!matchesScope(event, { projectId, from, to, filters })) {
        return;
      }
      events.push(event);
    });

    const dedupedEvents = dedupeEvents(events);

    dedupedEvents.sort((a, b) => {
      const ad = parseDate(a.eventTs || a.dueTs || a.doneTs || "");
      const bd = parseDate(b.eventTs || b.dueTs || b.doneTs || "");
      return (bd ? bd.getTime() : 0) - (ad ? ad.getTime() : 0);
    });

    const inconsistencies = runRules({
      events: dedupedEvents,
      context: {
        projectId,
        source: resolvedSource.source,
        from,
        to,
        now: new Date(),
      },
    });

    const summary = buildSummary({
      events: dedupedEvents,
      inconsistencies,
      source: resolvedSource.source,
      projectId,
    });
    const scenarios = buildScenarioPreviews({ summary });
    const counts = buildCounts(dedupedEvents, inconsistencies);
    const snapshotId = stableHash([scopeKey, generatedAt, counts.events, counts.inconsistencies]).slice(
      0,
      24
    );

    await store.saveScope(scopeKey, {
      source: resolvedSource.source,
      projectId,
      from,
      to,
      generatedAt,
      snapshotId,
      events: dedupedEvents,
      inconsistencies,
      scenarios,
      summary,
      counts,
    });

    return {
      scopeKey,
      source: resolvedSource.source,
      projectId,
      from,
      to,
      generatedAt,
      counts,
      summary,
      events: dedupedEvents,
      inconsistencies,
      scenarios,
      snapshotId,
    };
  }

  async function getScope(params = {}, options = {}) {
    const source = normalizeSourceId(params.source || "all");
    const projectId = safeText(params.projectId);
    const from = safeText(params.from);
    const to = safeText(params.to);
    const filters = params.filters && typeof params.filters === "object" ? { ...params.filters } : {};
    const scopeKey = buildScopeKey({ source, projectId, from, to, filters });
    const force = Boolean(options.force);
    const scope = !force ? await store.getScope(scopeKey) : null;
    if (scope && !isScopeStale(scope, rebuildTtlMs)) {
      return {
        ...scope,
        scopeKey,
      };
    }
    return rebuild({
      source,
      projectId,
      from,
      to,
      filters,
    });
  }

  async function getSummary(params = {}, options = {}) {
    const scope = await getScope(params, options);
    return {
      scopeKey: scope.scopeKey,
      source: scope.source,
      projectId: scope.projectId,
      from: scope.from || safeText(params.from),
      to: scope.to || safeText(params.to),
      generatedAt: scope.generatedAt || scope.updatedAt || new Date().toISOString(),
      summary: scope.summary || buildSummary({ events: scope.events || [], inconsistencies: scope.inconsistencies || [], source: scope.source, projectId: scope.projectId }),
      scenarios: Array.isArray(scope.scenarios) ? scope.scenarios : [],
      counts: scope.counts || buildCounts(scope.events || [], scope.inconsistencies || []),
    };
  }

  async function listInconsistencies(params = {}, options = {}) {
    const scope = await getScope(params, options);
    const severity = safeText(params.severity).toLowerCase();
    const status = safeText(params.status).toLowerCase();
    const limit = Number.isFinite(Number(params.limit)) ? Math.max(1, Math.min(200, Number(params.limit))) : 50;
    const offset = Number.isFinite(Number(params.offset)) ? Math.max(0, Number(params.offset)) : 0;

    let items = Array.isArray(scope.inconsistencies) ? scope.inconsistencies.slice() : [];
    if (severity) {
      items = items.filter((item) => String(item.severity || "").toLowerCase() === severity);
    }
    if (status) {
      items = items.filter((item) => String(item.status || "").toLowerCase() === status);
    }
    const total = items.length;
    const paged = items.slice(offset, offset + limit);
    return {
      scopeKey: scope.scopeKey,
      total,
      items: paged,
      generatedAt: scope.generatedAt || scope.updatedAt || new Date().toISOString(),
    };
  }

  async function getInconsistencyById(id, params = {}, options = {}) {
    const targetId = safeText(id);
    if (!targetId) {
      return null;
    }
    const scope = await getScope(params, options);
    const item = (Array.isArray(scope.inconsistencies) ? scope.inconsistencies : []).find(
      (entry) => String(entry && entry.id) === targetId
    );
    return item || null;
  }

  async function simulate(params = {}, options = {}) {
    const scenarioId = safeText(params.scenarioId || params.id);
    if (!scenarioId) {
      throw new Error("Informe scenarioId para simulação.");
    }
    const scope = await getScope(params, options);
    return simulateScenario({
      scenarioId,
      summary: scope.summary || {},
      overrides: params.overrides || {},
    });
  }

  async function getTurnPlan(params = {}, options = {}) {
    const scope = await getScope(params, options);
    const plan = buildTurnPlan({
      scope: {
        scopeKey: scope.scopeKey,
        projectId: scope.projectId,
        events: scope.events || [],
        inconsistencies: scope.inconsistencies || [],
      },
      params: {
        projectId: scope.projectId,
        date: params.date,
        shift: params.shift,
        mode: params.mode,
        limit: params.limit,
        page: params.page,
      },
    });
    return {
      ...plan,
      scopeKey: scope.scopeKey,
      source: scope.source || safeText(params.source || "all"),
    };
  }

  function health() {
    return {
      rebuildTtlMs,
      sourceCount: Object.keys(sourceRegistry || {}).length,
      storage: store.getHealth(),
      checkedAt: new Date().toISOString(),
    };
  }

  return {
    rebuild,
    getSummary,
    listInconsistencies,
    getInconsistencyById,
    simulate,
    getTurnPlan,
    health,
  };
}

module.exports = {
  createIntelligenceOrchestrator,
};
