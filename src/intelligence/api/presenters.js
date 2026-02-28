const { safeText } = require("../normalize/keyResolver");

function presentSummary(summary = {}) {
  return {
    generatedAt: safeText(summary.generatedAt),
    source: safeText(summary.source || "all"),
    projectId: safeText(summary.projectId),
    totals: {
      events: Number(summary.totalEvents || 0),
      inconsistencyCount: Number(summary.inconsistencyCount || 0),
      eventsWithProjectId: Number(summary.eventsWithProjectId || 0),
      eventsWithoutProjectId: Number(summary.eventsWithoutProjectId || 0),
      openEvents: Number(summary.openEvents || 0),
      closedEvents: Number(summary.closedEvents || 0),
      overdueEvents: Number(summary.overdueEvents || 0),
      criticalOpen: Number(summary.criticalOpen || 0),
      recurringFailures: Number(summary.recurringFailures || 0),
    },
    risk: {
      score: Number(summary.riskScore || 0),
      level: safeText(summary.riskLevel || "low"),
    },
    topSources: Array.isArray(summary.topSources) ? summary.topSources : [],
    topRules: Array.isArray(summary.topRules) ? summary.topRules : [],
    recommendations: Array.isArray(summary.recommendations) ? summary.recommendations : [],
  };
}

function presentInconsistency(item = {}) {
  return {
    id: safeText(item.id),
    ruleId: safeText(item.ruleId),
    severity: safeText(item.severity),
    title: safeText(item.title),
    message: safeText(item.message),
    source: safeText(item.source),
    projectId: safeText(item.projectId),
    status: safeText(item.status || "open"),
    detectedAt: safeText(item.detectedAt),
    updatedAt: safeText(item.updatedAt || item.detectedAt),
    eventIds: Array.isArray(item.eventIds) ? item.eventIds : [],
    evidence: Array.isArray(item.evidence) ? item.evidence : [],
    metadata: item.metadata && typeof item.metadata === "object" ? item.metadata : {},
  };
}

function presentScenario(item = {}) {
  return {
    id: safeText(item.id),
    name: safeText(item.name),
    description: safeText(item.description),
    defaults: item.defaults && typeof item.defaults === "object" ? item.defaults : {},
    preview: item.preview && typeof item.preview === "object" ? item.preview : {},
    inputs: item.inputs && typeof item.inputs === "object" ? item.inputs : {},
    projection: item.projection && typeof item.projection === "object" ? item.projection : {},
    impact: item.impact && typeof item.impact === "object" ? item.impact : {},
    generatedAt: safeText(item.generatedAt),
  };
}

module.exports = {
  presentSummary,
  presentInconsistency,
  presentScenario,
};
