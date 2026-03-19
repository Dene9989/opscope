const { KPI_TARGETS, INSIGHT_TONE } = require("./contracts");

function computeTypeRatios(breakdowns) {
  if (!breakdowns) {
    return { total: 0, preventivePct: 0, correctivePct: 0 };
  }
  const typeMap = breakdowns.byTypeExecuted && Object.keys(breakdowns.byTypeExecuted).length
    ? breakdowns.byTypeExecuted
    : breakdowns.byType || {};
  const total = Object.values(typeMap).reduce((acc, value) => acc + (Number(value) || 0), 0);
  const preventiveCount = Object.entries(typeMap).reduce((acc, [key, value]) => {
    const label = String(key || '').toLowerCase();
    if (label.includes('preventiva') || label.includes('preditiva')) {
      return acc + (Number(value) || 0);
    }
    return acc;
  }, 0);
  const correctiveCount = Object.entries(typeMap).reduce((acc, [key, value]) => {
    const label = String(key || '').toLowerCase();
    if (label.includes('corretiva') || label.includes('corretivo') || label.includes('reparo')) {
      return acc + (Number(value) || 0);
    }
    return acc;
  }, 0);
  return {
    total,
    preventivePct: total ? Math.round((preventiveCount / total) * 100) : 0,
    correctivePct: total ? Math.round((correctiveCount / total) * 100) : 0,
  };
}

function pushInsight(list, insight) {
  list.push(insight);
}

function buildInsights({ aggregated, comparison, integrityStatus }) {
  const insights = [];
  if (!aggregated || !aggregated.current || !aggregated.current.metrics) {
    return insights;
  }

  const metrics = aggregated.current.metrics;
  const breakdowns = aggregated.current.breakdowns || {};
  const planned = metrics.totalPlannedActivities || 0;
  const executed = metrics.totalExecutedActivities || 0;
  const executionRatioPct = planned ? Math.round((executed / planned) * 100) : 0;
  const typeRatios = computeTypeRatios(breakdowns);

  if (planned === 0) {
    pushInsight(insights, {
      id: "insight.no_planned",
      tone: INSIGHT_TONE.INFO,
      text: "Período sem atividades planejadas; análise de performance não aplicável.",
      metrics: { planned },
    });
  }

  if (planned > 0 && executionRatioPct >= KPI_TARGETS.executionRatioPct) {
    pushInsight(insights, {
      id: "insight.execution_ratio_good",
      tone: INSIGHT_TONE.POSITIVE,
      text: "Execução alinhada ao planejado, indicando estabilidade de capacidade.",
      metrics: { planned, executed, executionRatioPct },
    });
  } else if (planned > 0) {
    pushInsight(insights, {
      id: "insight.execution_ratio_low",
      tone: INSIGHT_TONE.WARNING,
      text: "Execução abaixo do planejado, sugerindo recomposição e ajustes de programação.",
      metrics: { planned, executed, executionRatioPct },
    });
  }

  if (metrics.backlog > 0) {
    pushInsight(insights, {
      id: "insight.backlog_present",
      tone: INSIGHT_TONE.WARNING,
      text: "Backlog em aberto requer priorização no próximo ciclo.",
      metrics: { backlog: metrics.backlog },
    });
  } else {
    pushInsight(insights, {
      id: "insight.backlog_controlled",
      tone: INSIGHT_TONE.POSITIVE,
      text: "Backlog controlado no fechamento do período.",
      metrics: { backlog: metrics.backlog },
    });
  }

  if (metrics.overdue > 0) {
    pushInsight(insights, {
      id: "insight.overdue_present",
      tone: INSIGHT_TONE.WARNING,
      text: "Atividades vencidas reforcam a necessidade de priorizacao de prazos.",
      metrics: { overdue: metrics.overdue },
    });
  } else {
    pushInsight(insights, {
      id: "insight.overdue_absent",
      tone: INSIGHT_TONE.POSITIVE,
      text: "Sem vencimentos relevantes no período.",
      metrics: { overdue: metrics.overdue },
    });
  }

  if (metrics.slaEligibleActivities > 0) {
    if (metrics.slaOnTimePct >= KPI_TARGETS.slaOnTimePct) {
      pushInsight(insights, {
        id: "insight.sla_good",
        tone: INSIGHT_TONE.POSITIVE,
        text: "SLA dentro da meta contratual.",
        metrics: { slaOnTimePct: metrics.slaOnTimePct },
      });
    } else {
      pushInsight(insights, {
        id: "insight.sla_below_target",
        tone: INSIGHT_TONE.WARNING,
        text: "SLA abaixo da meta, demandando ajustes de capacidade e priorização.",
        metrics: { slaOnTimePct: metrics.slaOnTimePct },
      });
    }
  } else {
    pushInsight(insights, {
      id: "insight.sla_not_applicable",
      tone: INSIGHT_TONE.INFO,
      text: "Sem atividades elegíveis para cálculo de SLA no período.",
      metrics: { slaEligibleActivities: metrics.slaEligibleActivities },
    });
  }


  if (typeRatios.total) {
    if (typeRatios.preventivePct >= KPI_TARGETS.preventivePct) {
      pushInsight(insights, {
        id: "insight.preventive_ratio_good",
        tone: INSIGHT_TONE.POSITIVE,
        text: "Predominancia preventiva/preditiva reforca a confiabilidade operacional.",
        metrics: { preventivePct: typeRatios.preventivePct },
      });
    }
    if (typeRatios.correctivePct > KPI_TARGETS.correctivePctMax) {
      pushInsight(insights, {
        id: "insight.corrective_ratio_high",
        tone: INSIGHT_TONE.WARNING,
        text: "Taxa de corretivas acima da meta indica paradas e pede reducao de recorrencias.",
        metrics: { correctivePct: typeRatios.correctivePct },
      });
    }
  }

  if (metrics.docsRequired > 0) {
    if (metrics.docsCompliancePct >= KPI_TARGETS.docsCompliancePct) {
      pushInsight(insights, {
        id: "insight.docs_good",
        tone: INSIGHT_TONE.POSITIVE,
        text: "Conformidade documental dentro do padrão esperado.",
        metrics: { docsCompliancePct: metrics.docsCompliancePct },
      });
    } else {
      pushInsight(insights, {
        id: "insight.docs_low",
        tone: INSIGHT_TONE.WARNING,
        text: "Conformidade documental abaixo do ideal; revisar checklist e evidências.",
        metrics: { docsCompliancePct: metrics.docsCompliancePct },
      });
    }
  }

  if (metrics.docsUnknown > 0) {
    pushInsight(insights, {
      id: "insight.docs_unknown",
      tone: INSIGHT_TONE.INFO,
      text: "Há exigências documentais indeterminadas; revisar cadastro de categorias.",
      metrics: { docsUnknown: metrics.docsUnknown },
    });
  }

  if (metrics.critical > 0) {
    pushInsight(insights, {
      id: "insight.critical_present",
      tone: INSIGHT_TONE.WARNING,
      text: "Atividades críticas registradas, com atenção de gestão para mitigação de risco.",
      metrics: { critical: metrics.critical },
    });
  }

  if (planned < 5) {
    pushInsight(insights, {
      id: "insight.low_volume",
      tone: INSIGHT_TONE.INFO,
      text: "Volume baixo reduz a robustez estatística das análises.",
      metrics: { planned },
    });
  }

  if (comparison && comparison.available) {
    const backlogItem = comparison.items.find((item) => item.key === "backlog");
    if (backlogItem && Number.isFinite(backlogItem.deltaPct)) {
      if (backlogItem.deltaPct > 20) {
        pushInsight(insights, {
          id: "insight.backlog_growth",
          tone: INSIGHT_TONE.WARNING,
          text: "Backlog cresceu de forma relevante vs período anterior.",
          metrics: { current: backlogItem.current, previous: backlogItem.previous, deltaPct: backlogItem.deltaPct },
        });
      } else if (backlogItem.deltaPct < -20) {
        pushInsight(insights, {
          id: "insight.backlog_reduction",
          tone: INSIGHT_TONE.POSITIVE,
          text: "Backlog reduziu de forma expressiva vs período anterior.",
          metrics: { current: backlogItem.current, previous: backlogItem.previous, deltaPct: backlogItem.deltaPct },
        });
      }
    }

    const slaItem = comparison.items.find((item) => item.key === "slaOnTimePct");
    if (slaItem && Number.isFinite(slaItem.delta)) {
      if (slaItem.delta >= 10) {
        pushInsight(insights, {
          id: "insight.sla_improved",
          tone: INSIGHT_TONE.POSITIVE,
          text: "SLA apresentou melhora significativa vs período anterior.",
          metrics: { current: slaItem.current, previous: slaItem.previous, delta: slaItem.delta },
        });
      } else if (slaItem.delta <= -10) {
        pushInsight(insights, {
          id: "insight.sla_worsened",
          tone: INSIGHT_TONE.WARNING,
          text: "SLA deteriorou de forma relevante vs período anterior.",
          metrics: { current: slaItem.current, previous: slaItem.previous, delta: slaItem.delta },
        });
      }
    }
  }

  if (integrityStatus && integrityStatus !== "ok") {
    pushInsight(insights, {
      id: "insight.integrity_attention",
      tone: INSIGHT_TONE.WARNING,
      text: "Advertências de integridade de dados; revisar base antes de decisões críticas.",
      metrics: { integrityStatus },
    });
  }

  return insights;
}

module.exports = {
  buildInsights,
};
