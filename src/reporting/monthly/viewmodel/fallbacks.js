function fallbackExecutiveSummary(reason) {
  return {
    title: "Resumo executivo",
    text: reason || "Não há dados suficientes para produzir o resumo executivo deste período.",
    bullets: [],
  };
}

function fallbackComparison(reason) {
  return {
    available: false,
    reason: reason || "Comparação indisponível por ausência de período anterior.",
    items: [],
  };
}

function fallbackTrendAnalysis(reason) {
  return {
    text: reason || "Não há volume suficiente para análise de tendência no período.",
    weekly: [],
    insights: [],
  };
}

function fallbackOperationalBreakdown(reason) {
  return {
    text: reason || "Não há atividades suficientes para análise operacional.",
    byStatus: [],
    byType: [],
    byLocation: [],
    byTeam: [],
    byPriority: [],
  };
}

function fallbackSafetyCompliance(reason) {
  return {
    text: reason || "Dados de compliance não disponíveis para o período.",
    docs: null,
    evidenceCount: 0,
  };
}

function fallbackTechnicalHighlights(reason) {
  return {
    text: reason || "Sem destaques técnicos relevantes no período.",
    bullets: [],
  };
}

function fallbackRiskAssessment(reason) {
  return {
    text: reason || "Não foram identificados riscos operacionais relevantes.",
    risks: [],
    integrityNotes: [],
  };
}

function fallbackRecommendations(reason) {
  return {
    text: reason || "Sem recomendações adicionais para o período.",
    items: [],
  };
}

function fallbackActionPlan(reason) {
  return {
    text: reason || "Nenhuma ação sugerida para o período.",
    items: [],
  };
}

function fallbackConsolidatedTables(reason) {
  return {
    text: reason || "Sem dados consolidados para apresentar.",
    statusTable: [],
    categoryTable: [],
    locationTable: [],
    teamTable: [],
    priorityTable: [],
  };
}

function fallbackAppendix(reason) {
  return {
    text: reason || "Sem RDOs disponíveis para o período.",
    dailyRdos: [],
  };
}

module.exports = {
  fallbackExecutiveSummary,
  fallbackComparison,
  fallbackTrendAnalysis,
  fallbackOperationalBreakdown,
  fallbackSafetyCompliance,
  fallbackTechnicalHighlights,
  fallbackRiskAssessment,
  fallbackRecommendations,
  fallbackActionPlan,
  fallbackConsolidatedTables,
  fallbackAppendix,
};
