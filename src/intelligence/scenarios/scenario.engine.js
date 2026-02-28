const { SCENARIO_CATALOG, getScenarioById } = require("./scenario.catalog");
const { estimateOperationalImpact } = require("./impact.estimator");

function normalizeOverrides(input) {
  return input && typeof input === "object" && !Array.isArray(input) ? { ...input } : {};
}

function simulateScenario({ scenarioId, summary = {}, overrides = {} }) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) {
    throw new Error("Cenário de simulação não encontrado.");
  }
  const effectiveOverrides = normalizeOverrides(overrides);
  const base = scenario.simulate({
    summary,
    overrides: effectiveOverrides,
  });
  const impact = estimateOperationalImpact(base);
  return {
    id: scenario.id,
    name: scenario.name,
    description: scenario.description,
    inputs: {
      ...scenario.defaults,
      ...effectiveOverrides,
    },
    projection: base,
    impact,
    generatedAt: new Date().toISOString(),
  };
}

function buildScenarioPreviews({ summary = {} } = {}) {
  return SCENARIO_CATALOG.map((scenario) => {
    const simulated = scenario.simulate({
      summary,
      overrides: {},
    });
    const impact = estimateOperationalImpact(simulated);
    return {
      id: scenario.id,
      name: scenario.name,
      description: scenario.description,
      defaults: { ...scenario.defaults },
      preview: {
        headline: simulated.headline || "",
        escalationIndex: impact.escalationIndex,
        priority: impact.priority,
      },
    };
  });
}

module.exports = {
  simulateScenario,
  buildScenarioPreviews,
};

