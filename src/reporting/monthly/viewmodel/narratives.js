const {
  formatNumber,
  formatPercent,
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

const UNKNOWN_LABELS = new Set(["nao_informado", "desconhecida", "unknown"]);

function pickTop(map, labelContext) {
  const entry = Object.entries(map || {})
    .sort((a, b) => b[1] - a[1])
    .find(([label]) => !UNKNOWN_LABELS.has(label));
  if (!entry) {
    return null;
  }
  return {
    label: formatLabel(entry[0], labelContext),
    value: entry[1] || 0,
  };
}

function buildExecutiveSummary({ metrics, comparison, integrityStatus, isPartial }) {
  if (!metrics) {
    return fallbackExecutiveSummary("Não foi possível calcular métricas para o período.");
  }

  const planned = metrics.totalPlannedActivities || 0;
  const executed = metrics.totalExecutedActivities || 0;
  const ratio = planned ? Math.round((executed / planned) * 100) : 0;

  if (planned === 0) {
    return fallbackExecutiveSummary("Não houve atividades planejadas no período.");
  }

  const slaApplies = metrics.slaEligibleActivities > 0;
  const docsApplies = metrics.docsRequired > 0;
  const meetsExecution = ratio >= KPI_TARGETS.executionRatioPct;
  const meetsSla = slaApplies ? metrics.slaOnTimePct >= KPI_TARGETS.slaOnTimePct : true;
  const meetsDocs = docsApplies ? metrics.docsCompliancePct >= KPI_TARGETS.docsCompliancePct : true;

  const performanceTone = meetsExecution && meetsSla
    ? "desempenho operacional dentro das metas estabelecidas"
    : meetsExecution && !meetsSla
      ? "execução consistente, porém com SLA abaixo do esperado"
      : "execução abaixo do planejado, com necessidade de recomposição";

  const headline = `Execução ${formatPercent(ratio)} do planejado • SLA ${slaApplies ? formatPercent(metrics.slaOnTimePct) : "N/A"}`;
  const lead = `Planejadas ${formatNumber(planned)} atividades e executadas ${formatNumber(executed)}, indicando ${performanceTone}.`;

  const blocks = [];
  blocks.push({
    title: "Leitura do mês",
    text: `O período encerrou com ${formatNumber(executed)} entregas sobre ${formatNumber(planned)} planejadas (${formatPercent(ratio)}), com ${performanceTone}.`,
  });

  const positivePoints = [];
  if (meetsExecution) {
    positivePoints.push(`Execução dentro da meta (${formatPercent(ratio)}).`);
  }
  if (slaApplies && meetsSla) {
    positivePoints.push(`SLA sustentado em ${formatPercent(metrics.slaOnTimePct)}.`);
  }
  if (!metrics.backlog && !metrics.overdue) {
    positivePoints.push("Backlog e vencimentos sob controle.");
  }
  if (docsApplies && meetsDocs) {
    positivePoints.push(`Compliance documental em ${formatPercent(metrics.docsCompliancePct)}.`);
  }
  if (!positivePoints.length) {
    positivePoints.push("Não houve superação relevante das metas no período.");
  }
  blocks.push({
    title: "O que performou bem",
    text: positivePoints.join(" "),
  });

  const attentionPoints = [];
  if (!meetsExecution) {
    attentionPoints.push("Execução abaixo do planejado.");
  }
  if (metrics.backlog > 0) {
    attentionPoints.push(`Backlog de ${formatNumber(metrics.backlog)} atividades.`);
  }
  if (metrics.overdue > 0) {
    attentionPoints.push(`${formatNumber(metrics.overdue)} atividades vencidas.`);
  }
  if (slaApplies && !meetsSla) {
    attentionPoints.push(`SLA em ${formatPercent(metrics.slaOnTimePct)} abaixo da meta.`);
  }
  if (docsApplies && !meetsDocs) {
    attentionPoints.push(`Compliance documental em ${formatPercent(metrics.docsCompliancePct)} abaixo do esperado.`);
  }
  blocks.push({
    title: "O que exigiu atenção",
    text: attentionPoints.length ? attentionPoints.join(" ") : "Não foram observados desvios relevantes no período.",
  });

  let impactText = "A operação manteve previsibilidade de entrega, com impacto operacional controlado.";
  if (metrics.backlog > 0 || metrics.overdue > 0) {
    impactText = "O backlog e os vencimentos pressionam a capacidade instalada e exigem priorização imediata no próximo ciclo.";
  } else if (!meetsExecution) {
    impactText = "A diferença entre planejado e executado indica necessidade de ajuste de capacidade e reprogramação de frentes.";
  }
  blocks.push({
    title: "Impacto operacional",
    text: impactText,
  });

  const slaText = slaApplies
    ? `SLA em ${formatPercent(metrics.slaOnTimePct)} das atividades elegíveis.`
    : "SLA não aplicável por ausência de itens elegíveis.";
  const docsText = docsApplies
    ? `Compliance documental em ${formatPercent(metrics.docsCompliancePct)}, com ${formatNumber(metrics.docsPartial)} pendências parciais.`
    : "Sem exigência documental no período.";
  blocks.push({
    title: "SLA e compliance",
    text: `${slaText} ${docsText}`,
  });

  const bullets = [];
  if (comparison && comparison.available) {
    const plannedItem = comparison.items.find((item) => item.key === "totalPlannedActivities");
    const executedItem = comparison.items.find((item) => item.key === "totalExecutedActivities");
    if (plannedItem && plannedItem.delta !== null) {
      bullets.push(`Planejadas: variação de ${plannedItem.deltaFormatted} (${plannedItem.deltaPctFormatted || ""}).`);
    }
    if (executedItem && executedItem.delta !== null) {
      bullets.push(`Executadas: variação de ${executedItem.deltaFormatted} (${executedItem.deltaPctFormatted || ""}).`);
    }
  }

  const recommendation =
    metrics.backlog > 0 || metrics.overdue > 0 || !meetsSla
      ? "Priorizar recuperação de backlog e vencimentos, com redistribuição de equipes e ajustes no sequenciamento de atividades."
      : "Manter o ritmo operacional e reforçar governança de prazos para sustentar o desempenho.";

  let conclusion = `Conclusão gerencial: ${recommendation}`;
  if (isPartial) {
    conclusion += " Relatório parcial, sujeito a ajustes na consolidação final.";
  }
  if (integrityStatus && integrityStatus !== "ok") {
    conclusion += " Há alertas de integridade que podem afetar leituras específicas.";
  }

  const highlights = [
    {
      title: "Entrega e ritmo",
      tone: meetsExecution ? "positive" : "warning",
      text: `Execução ${formatPercent(ratio)} do planejado (${formatNumber(executed)} de ${formatNumber(planned)}).`,
    },
    {
      title: "Desvios críticos",
      tone: metrics.backlog > 0 || metrics.overdue > 0 || !meetsSla ? "warning" : "positive",
      text:
        metrics.backlog > 0 || metrics.overdue > 0 || !meetsSla
          ? `Backlog ${formatNumber(metrics.backlog)} • Vencidas ${formatNumber(metrics.overdue)} • SLA ${slaApplies ? formatPercent(metrics.slaOnTimePct) : "N/A"}.`
          : "Sem desvios críticos no período.",
    },
    {
      title: "Direcionamento",
      tone: "neutral",
      text: recommendation,
    },
  ];

  return {
    title: "Resumo executivo",
    headline,
    lead,
    text: lead,
    blocks,
    bullets,
    conclusion,
    highlights,
  };
}

function buildTechnicalHighlights({ metrics, breakdowns }) {
  if (!metrics || !breakdowns) {
    return fallbackTechnicalHighlights("Dados insuficientes para análise técnica.");
  }

  const topType = pickTop(breakdowns.byType, "category");
  const topLocation = pickTop(breakdowns.byLocation, "location");
  const topTeam = pickTop(breakdowns.byTeam, "team");
  const topPriority = pickTop(breakdowns.byPriority, "priority");

  const blocks = [];
  blocks.push({
    title: "Contexto do período",
    text: `Volume total de ${formatNumber(metrics.totalPlannedActivities)} atividades, com ${formatNumber(metrics.totalExecutedActivities)} executadas.`,
  });

  const concentrationParts = [];
  if (topType) {
    concentrationParts.push(`${topType.label} (${formatNumber(topType.value)} atividades)`);
  }
  if (topLocation) {
    concentrationParts.push(`local ${topLocation.label}`);
  }
  if (topTeam) {
    concentrationParts.push(`equipe ${topTeam.label}`);
  }
  if (concentrationParts.length) {
    blocks.push({
      title: "Concentração de esforço",
      text: `Maior concentração em ${concentrationParts.join("; ")}.`,
    });
  }

  const pendingParts = [];
  if (metrics.backlog > 0) {
    pendingParts.push(`${formatNumber(metrics.backlog)} atividades em backlog`);
  }
  if (metrics.overdue > 0) {
    pendingParts.push(`${formatNumber(metrics.overdue)} vencidas`);
  }
  if (metrics.critical > 0) {
    pendingParts.push(`${formatNumber(metrics.critical)} críticas`);
  }
  blocks.push({
    title: "Pendências relevantes",
    text: pendingParts.length ? pendingParts.join("; ") + "." : "Sem pendências críticas no período.",
  });

  const actionText = metrics.backlog > 0 || metrics.overdue > 0
    ? "Revisar criticidade e reprogramar frentes com maior impacto no SLA."
    : "Manter disciplina de programação e monitorar criticidade para sustentar estabilidade.";

  blocks.push({
    title: "Ação recomendada",
    text: actionText,
  });

  const bullets = [];
  if (metrics.critical > 0) {
    bullets.push(`Foram registradas ${formatNumber(metrics.critical)} atividades críticas no período.`);
  }
  if (topPriority) {
    bullets.push(`Prioridade dominante: ${topPriority.label} (${formatNumber(topPriority.value)} atividades).`);
  }

  return {
    text: "Leitura técnica da distribuição das atividades, criticidade e concentração operacional.",
    summary: "A análise técnica evidencia onde o esforço se concentrou e quais frentes exigem atenção de engenharia.",
    blocks,
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

  const summary = metrics.docsRequired > 0
    ? "Compliance acompanhado com base nas exigências documentais e evidências reportadas."
    : "Compliance sem exigência documental; foco em evidências e rastreabilidade.";

  return {
    text: textParts.join(" "),
    summary,
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
  const drivers = [];

  if (metrics.backlog > 0) {
    risks.push({
      id: "risk.backlog",
      tone: "warning",
      text: "Backlog em aberto pressiona capacidade e pode aumentar prazos médios de entrega.",
      metrics: { backlog: metrics.backlog },
    });
    drivers.push("backlog em aberto");
  }
  if (metrics.overdue > 0) {
    risks.push({
      id: "risk.overdue",
      tone: "warning",
      text: "Atividades vencidas elevam risco de descumprimento contratual e SLA.",
      metrics: { overdue: metrics.overdue },
    });
    drivers.push("vencimentos acima do planejado");
  }
  if (metrics.slaEligibleActivities > 0 && metrics.slaOnTimePct < KPI_TARGETS.slaOnTimePct) {
    risks.push({
      id: "risk.sla_low",
      tone: "warning",
      text: "SLA abaixo da meta sugere necessidade de replanejamento e ajuste de capacidade.",
      metrics: { slaOnTimePct: metrics.slaOnTimePct },
    });
    drivers.push("SLA abaixo da meta");
  }
  if (metrics.docsRequired > 0 && metrics.docsCompliancePct < KPI_TARGETS.docsCompliancePct) {
    risks.push({
      id: "risk.docs_low",
      tone: "warning",
      text: "Compliance documental abaixo do esperado pode gerar pendências regulatórias.",
      metrics: { docsCompliancePct: metrics.docsCompliancePct },
    });
    drivers.push("compliance documental abaixo do ideal");
  }

  if (integrityStatus && integrityStatus !== "ok") {
    risks.push({
      id: "risk.integrity",
      tone: "warning",
      text: "Alertas de integridade indicam necessidade de revisão de base de dados.",
    });
    drivers.push("alertas de integridade");
  }

  if (!risks.length) {
    return fallbackRiskAssessment("Nenhum risco operacional relevante identificado no período.");
  }

  const exposure = drivers.length >= 3 ? "elevada" : drivers.length === 2 ? "moderada" : "controlada";
  const summary = `Exposição ${exposure}. Principais vetores: ${drivers.join(", ")}.`;

  return {
    text: "Avaliação de riscos baseada em backlog, overdue, SLA e compliance.",
    summary,
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
      text: "Reprogramar backlog com base em criticidade e vencimento, definindo janela de recuperação no próximo ciclo.",
    });
  }
  if (metrics.overdue > 0) {
    items.push({
      id: "rec.overdue",
      text: "Instituir rotina semanal de revisão de vencimentos e renegociação de prazos críticos.",
    });
  }
  if (metrics.slaEligibleActivities > 0 && metrics.slaOnTimePct < KPI_TARGETS.slaOnTimePct) {
    items.push({
      id: "rec.sla",
      text: "Revisar gargalos de execução e tempos de atendimento para recuperar a meta de SLA.",
    });
  }
  if (metrics.docsRequired > 0 && metrics.docsCompliancePct < KPI_TARGETS.docsCompliancePct) {
    items.push({
      id: "rec.docs",
      text: "Regularizar documentação pendente e padronizar checklist de evidências por atividade.",
    });
  }

  if (!items.length) {
    return fallbackRecommendations("Não foram identificadas recomendações adicionais no período.");
  }

  return {
    text: "Recomendações priorizadas para o próximo ciclo, com foco em capacidade, prazos e governança documental.",
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
