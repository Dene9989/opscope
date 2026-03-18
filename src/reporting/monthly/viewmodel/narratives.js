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
const { formatLabel } = require("./labels");

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
  const meetsExecution = ratio >= KPI_TARGETS.executionRatioPct;
  const meetsSla = metrics.slaEligibleActivities > 0 && metrics.slaOnTimePct >= KPI_TARGETS.slaOnTimePct;
  const performanceTone = meetsExecution && meetsSla
    ? "desempenho operacional dentro das metas estabelecidas"
    : meetsExecution && !meetsSla
      ? "execução adequada, porém com SLA abaixo do esperado"
      : "execução abaixo do planejado, exigindo recuperação operacional";

  textParts.push(
    `No período, foram planejadas ${formatNumber(planned)} atividades e executadas ${formatNumber(executed)} (${formatPercent(ratio)}), com ${performanceTone}.`
  );

  if (metrics.backlog > 0 || metrics.overdue > 0) {
    const backlogLabel = metrics.backlog > 0 ? `${formatNumber(metrics.backlog)} em backlog` : null;
    const overdueLabel = metrics.overdue > 0 ? `${formatNumber(metrics.overdue)} vencidas` : null;
    const items = [backlogLabel, overdueLabel].filter(Boolean).join(" e ");
    textParts.push(`Principais desvios: ${items}, indicando pressão sobre a capacidade de execução.`);
  } else {
    textParts.push("Não houve acúmulo relevante de backlog ou vencimentos no período.");
  }

  if (metrics.slaEligibleActivities > 0) {
    textParts.push(`SLA no prazo em ${formatPercent(metrics.slaOnTimePct)} das atividades elegíveis.`);
  } else {
    textParts.push("SLA não aplicável por ausência de itens elegíveis.");
  }

  if (metrics.docsRequired > 0) {
    textParts.push(`Compliance documental em ${formatPercent(metrics.docsCompliancePct)}, com ${formatNumber(metrics.docsPartial)} pendências parciais.`);
  } else {
    textParts.push("Não houve exigência documental no período.");
  }

  if (isPartial) {
    textParts.push("Relatório parcial: consolidação até a data de emissão. As comparações devem ser lidas com cautela.");
  }
  if (integrityStatus && integrityStatus !== "ok") {
    textParts.push("Há alertas de integridade que podem impactar leituras específicas.");
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

  const recommendation =
    metrics.backlog > 0 || metrics.overdue > 0 || metrics.slaOnTimePct < KPI_TARGETS.slaOnTimePct
      ? "Recomenda-se priorizar a recuperação de backlog e vencimentos, além de revisar alocação de equipe para elevar o SLA."
      : "Recomenda-se manter o ritmo operacional e reforçar a disciplina de prazos para sustentar o desempenho.";

  const highlights = [
    {
      title: "Desempenho geral",
      tone: meetsExecution && meetsSla ? "positive" : "warning",
      text: `Execução em ${formatPercent(ratio)} do planejado e SLA em ${formatPercent(metrics.slaOnTimePct)}.`,
    },
    {
      title: "Foco operacional",
      tone: metrics.backlog > 0 || metrics.overdue > 0 ? "warning" : "positive",
      text:
        metrics.backlog > 0 || metrics.overdue > 0
          ? `Backlog: ${formatNumber(metrics.backlog)} • Vencidas: ${formatNumber(metrics.overdue)}.`
          : "Sem backlog ou vencimentos relevantes no período.",
    },
    {
      title: "Direcionamento",
      tone: "neutral",
      text: recommendation,
    },
  ];

  return {
    title: "Resumo executivo",
    text: `${textParts.join(" ")} ${recommendation}`,
    bullets,
    highlights,
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
    .find((item) => !["nao_informado", "desconhecida", "unknown"].includes(item[0]));
  if (topType) {
    bullets.push(
      `Categoria dominante: ${formatLabel(topType[0], "category")} (${formatNumber(topType[1])} atividades).`
    );
  }

  if (!bullets.length) {
    return fallbackTechnicalHighlights("Não houve destaques técnicos significativos no período.");
  }

  return {
    text: "Destaques técnicos com base na criticidade e distribuição das atividades.",
    bullets,
  };
}

function buildSafetyCompliance({ metrics, integrityStatus }) {
  if (!metrics) {
    return fallbackSafetyCompliance("Sem métricas de compliance no período.");
  }
  const textParts = [];
  if (metrics.docsRequired > 0) {
    textParts.push(`Compliance documental de ${formatPercent(metrics.docsCompliancePct)} no período.`);
  } else {
    textParts.push("Não houve atividades com exigência documental no período.");
  }
  if (metrics.docsUnknown > 0) {
    textParts.push("Há atividades com exigências documentais não classificadas.");
  }
  if (metrics.evidenceCount > 0) {
    textParts.push(`Evidências registradas: ${formatNumber(metrics.evidenceCount)}.`);
  }
  if (integrityStatus && integrityStatus !== "ok") {
    textParts.push("Há alertas de integridade de dados que podem afetar a leitura do compliance.");
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
      text: "Backlog em aberto pode impactar a capacidade de resposta operacional.",
      metrics: { backlog: metrics.backlog },
    });
  }
  if (metrics.overdue > 0) {
    risks.push({
      id: "risk.overdue",
      tone: "warning",
      text: "Atividades vencidas elevam o risco de descumprimento de SLA.",
      metrics: { overdue: metrics.overdue },
    });
  }
  if (metrics.slaEligibleActivities > 0 && metrics.slaOnTimePct < KPI_TARGETS.slaOnTimePct) {
    risks.push({
      id: "risk.sla_low",
      tone: "warning",
      text: "SLA abaixo da meta sugere necessidade de replanejamento.",
      metrics: { slaOnTimePct: metrics.slaOnTimePct },
    });
  }
  if (metrics.docsRequired > 0 && metrics.docsCompliancePct < KPI_TARGETS.docsCompliancePct) {
    risks.push({
      id: "risk.docs_low",
      tone: "warning",
      text: "Compliance documental abaixo do esperado pode gerar pendências regulatórias.",
      metrics: { docsCompliancePct: metrics.docsCompliancePct },
    });
  }

  if (integrityStatus && integrityStatus !== "ok") {
    risks.push({
      id: "risk.integrity",
      tone: "warning",
      text: "Existem alertas de integridade que podem distorcer análises específicas.",
    });
  }

  if (!risks.length) {
    return fallbackRiskAssessment("Nenhum risco operacional relevante identificado no período.");
  }

  return {
    text: "Avaliação de riscos baseada em backlog, overdue, SLA e compliance.",
    risks,
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
      text: "Revisar capacidade de execução e priorizar backlog crítico.",
    });
  }
  if (metrics.overdue > 0) {
    items.push({
      id: "rec.overdue",
      text: "Ajustar cronograma e reforçar acompanhamento de vencimentos.",
    });
  }
  if (metrics.slaEligibleActivities > 0 && metrics.slaOnTimePct < KPI_TARGETS.slaOnTimePct) {
    items.push({
      id: "rec.sla",
      text: "Revisar gargalos de execução para recuperar a meta de SLA.",
    });
  }
  if (metrics.docsRequired > 0 && metrics.docsCompliancePct < KPI_TARGETS.docsCompliancePct) {
    items.push({
      id: "rec.docs",
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
