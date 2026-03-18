const {
  formatNumber,
  formatPercent,
  formatHours,
} = require("./formatters");
const {
  fallbackExecutiveSummary,
  fallbackTechnicalHighlights,
  fallbackRiskAssessment,
  fallbackRecommendations,
  fallbackSafetyCompliance,
} = require("./fallbacks");
const { KPI_TARGETS } = require("./contracts");

function buildExecutiveSummary({ metrics, comparison, integrityStatus, isPartial }) {
  if (!metrics) {
    return fallbackExecutiveSummary("Não foi possível calcular métricas para o período.");
  }

  const planned = metrics.totalPlannedActivities || 0;
  const executed = metrics.totalExecutedActivities || 0;
  const ratio = planned ? Math.round((executed / planned) * 100) : 0;

  if (planned === 0) {
    return fallbackExecutiveSummary("Não houve atividades planejadas no período, portanto não há resumo executivo quantitativo.");
  }

  const textParts = [];
  textParts.push(
    `No período, foram planejadas ${formatNumber(planned)} atividades e executadas ${formatNumber(executed)} (${formatPercent(ratio)}).`
  );

  if (metrics.backlog > 0) {
    textParts.push(`Backlog em aberto de ${formatNumber(metrics.backlog)} atividades.`);
  }
  if (metrics.overdue > 0) {
    textParts.push(`Foram registradas ${formatNumber(metrics.overdue)} atividades vencidas.`);
  }
  if (metrics.slaEligibleActivities > 0) {
    textParts.push(`SLA no prazo: ${formatPercent(metrics.slaOnTimePct)}.`);
  }
  if (metrics.docsRequired > 0) {
    textParts.push(`Compliance documental: ${formatPercent(metrics.docsCompliancePct)}.`);
  }
  if (isPartial) {
    textParts.push("Relatório parcial: dados consolidados até a data de emissão.");
  }
  if (integrityStatus && integrityStatus !== "ok") {
    textParts.push("Há alertas de integridade que podem impactar a leitura dos indicadores.");
  }

  const bullets = [];
  if (comparison && comparison.available) {
    const plannedItem = comparison.items.find((item) => item.key === "totalPlannedActivities");
    const executedItem = comparison.items.find((item) => item.key === "totalExecutedActivities");
    if (plannedItem && plannedItem.delta !== null) {
      bullets.push(`Planejadas: variação de ${plannedItem.deltaFormatted} vs período anterior.`);
    }
    if (executedItem && executedItem.delta !== null) {
      bullets.push(`Executadas: variação de ${executedItem.deltaFormatted} vs período anterior.`);
    }
  }

  return {
    title: "Resumo executivo",
    text: textParts.join(" "),
    bullets,
  };
}

function buildTechnicalHighlights({ metrics, breakdowns }) {
  if (!metrics || !breakdowns) {
    return fallbackTechnicalHighlights("Dados insuficientes para análise técnica.");
  }
  const bullets = [];

  if (metrics.critical > 0) {
    bullets.push(`Foram registradas ${formatNumber(metrics.critical)} atividades críticas no período.`);
  }

  const topType = Object.entries(breakdowns.byType || {})
    .sort((a, b) => b[1] - a[1])
    .find((item) => item[0] !== "nao_informado");
  if (topType) {
    bullets.push(`Categoria dominante: ${topType[0]} (${formatNumber(topType[1])} atividades).`);
  }

  if (!bullets.length) {
    return fallbackTechnicalHighlights("Não houve destaques técnicos significativos no período.");
  }

  return {
    text: "Destaques técnicos com base na distribuição das atividades e criticidade.",
    bullets,
  };
}

function buildSafetyCompliance({ metrics, integrityStatus }) {
  if (!metrics) {
    return fallbackSafetyCompliance("Sem métricas de compliance no período.");
  }
  const textParts = [];
  if (metrics.docsRequired > 0) {
    textParts.push(`Compliance documental de ${formatPercent(metrics.docsCompliancePct)}.`);
  } else {
    textParts.push("Não houve atividades com exigência documental no período.");
  }
  if (metrics.docsUnknown > 0) {
    textParts.push("Existem atividades com exigências documentais indeterminadas.");
  }
  if (integrityStatus && integrityStatus !== "ok") {
    textParts.push("Há alertas de integridade de dados que podem afetar o compliance.");
  }

  return {
    text: textParts.join(" "),
    docs: {
      required: metrics.docsRequired,
      ok: metrics.docsOk,
      partial: metrics.docsPartial,
      unknown: metrics.docsUnknown,
      compliancePct: metrics.docsCompliancePct,
    },
    evidenceCount: metrics.evidenceCount,
  };
}

function buildRiskAssessment({ metrics, integrityStatus }) {
  if (!metrics) {
    return fallbackRiskAssessment("Sem métricas para avaliação de risco.");
  }

  const risks = [];
  if (metrics.backlog > 0) {
    risks.push({
      id: "risk.backlog",
      tone: "warning",
      rule: "backlog > 0",
      text: "Backlog em aberto pode impactar a capacidade de resposta operacional.",
      metrics: { backlog: metrics.backlog },
    });
  }
  if (metrics.overdue > 0) {
    risks.push({
      id: "risk.overdue",
      tone: "warning",
      rule: "overdue > 0",
      text: "Atividades vencidas elevam o risco de descumprimento de SLA.",
      metrics: { overdue: metrics.overdue },
    });
  }
  if (metrics.slaEligibleActivities > 0 && metrics.slaOnTimePct < KPI_TARGETS.slaOnTimePct) {
    risks.push({
      id: "risk.sla_low",
      tone: "warning",
      rule: `slaOnTimePct < ${KPI_TARGETS.slaOnTimePct}`,
      text: "SLA abaixo da meta sugere necessidade de replanejamento.",
      metrics: { slaOnTimePct: metrics.slaOnTimePct },
    });
  }
  if (metrics.docsRequired > 0 && metrics.docsCompliancePct < KPI_TARGETS.docsCompliancePct) {
    risks.push({
      id: "risk.docs_low",
      tone: "warning",
      rule: `docsCompliancePct < ${KPI_TARGETS.docsCompliancePct}`,
      text: "Compliance documental abaixo do esperado pode gerar pendências regulatórias.",
      metrics: { docsCompliancePct: metrics.docsCompliancePct },
    });
  }

  const integrityNotes = [];
  if (integrityStatus && integrityStatus !== "ok") {
    integrityNotes.push({
      id: "risk.integrity",
      tone: "warning",
      rule: "integrityStatus != ok",
      text: "Existem alertas de integridade que podem distorcer análises específicas.",
    });
  }

  if (!risks.length && !integrityNotes.length) {
    return fallbackRiskAssessment("Nenhum risco operacional relevante identificado no período.");
  }

  return {
    text: "Avaliação de riscos baseada em backlog, overdue, SLA e compliance.",
    risks,
    integrityNotes,
  };
}

function buildRecommendations({ metrics }) {
  if (!metrics) {
    return fallbackRecommendations("Sem métricas para recomendações.");
  }

  const items = [];
  if (metrics.backlog > 0) {
    items.push({
      id: "rec.backlog",
      rule: "backlog > 0",
      text: "Revisar capacidade de execução e priorizar backlog crítico.",
    });
  }
  if (metrics.overdue > 0) {
    items.push({
      id: "rec.overdue",
      rule: "overdue > 0",
      text: "Ajustar cronograma e reforçar acompanhamento de vencimentos.",
    });
  }
  if (metrics.slaEligibleActivities > 0 && metrics.slaOnTimePct < KPI_TARGETS.slaOnTimePct) {
    items.push({
      id: "rec.sla",
      rule: `slaOnTimePct < ${KPI_TARGETS.slaOnTimePct}`,
      text: "Revisar gargalos de execução para recuperar a meta de SLA.",
    });
  }
  if (metrics.docsRequired > 0 && metrics.docsCompliancePct < KPI_TARGETS.docsCompliancePct) {
    items.push({
      id: "rec.docs",
      rule: `docsCompliancePct < ${KPI_TARGETS.docsCompliancePct}`,
      text: "Atualizar cadastros de documentação e reforçar checklist operacional.",
    });
  }

  if (!items.length) {
    return fallbackRecommendations("Não foram identificadas recomendações adicionais no período.");
  }

  return {
    text: "Recomendações priorizadas com base nos desvios do período.",
    items,
  };
}

module.exports = {
  buildExecutiveSummary,
  buildTechnicalHighlights,
  buildRiskAssessment,
  buildRecommendations,
  buildSafetyCompliance,
};
