const { KPI_TARGETS, INSIGHT_TONE } = require("./contracts");

function pushInsight(list, insight) {
  list.push(insight);
}

function buildInsights({ aggregated, comparison, integrityStatus }) {
  const insights = [];
  if (!aggregated || !aggregated.current || !aggregated.current.metrics) {
    return insights;
  }

  const metrics = aggregated.current.metrics;
  const planned = metrics.totalPlannedActivities || 0;
  const executed = metrics.totalExecutedActivities || 0;
  const executionRatioPct = planned ? Math.round((executed / planned) * 100) : 0;

  if (planned === 0) {
    pushInsight(insights, {
      id: "insight.no_planned",
      tone: INSIGHT_TONE.INFO,
      rule: "planned == 0",
      text: "Não houve atividades planejadas no período.",
      metrics: { planned },
    });
  }

  if (planned > 0 && executionRatioPct >= KPI_TARGETS.executionRatioPct) {
    pushInsight(insights, {
      id: "insight.execution_ratio_good",
      tone: INSIGHT_TONE.POSITIVE,
      rule: `executed/planned >= ${KPI_TARGETS.executionRatioPct}%`,
      text: "A execução do período manteve ritmo consistente em relação ao planejado.",
      metrics: { planned, executed, executionRatioPct },
    });
  } else if (planned > 0) {
    pushInsight(insights, {
      id: "insight.execution_ratio_low",
      tone: INSIGHT_TONE.WARNING,
      rule: `executed/planned < ${KPI_TARGETS.executionRatioPct}%`,
      text: "A taxa de execução ficou abaixo do planejado para o período.",
      metrics: { planned, executed, executionRatioPct },
    });
  }

  if (metrics.backlog > 0) {
    pushInsight(insights, {
      id: "insight.backlog_present",
      tone: INSIGHT_TONE.WARNING,
      rule: "backlog > 0",
      text: "Há backlog em aberto que requer acompanhamento operacional.",
      metrics: { backlog: metrics.backlog },
    });
  }

  if (metrics.overdue > 0) {
    pushInsight(insights, {
      id: "insight.overdue_present",
      tone: INSIGHT_TONE.WARNING,
      rule: "overdue > 0",
      text: "Foram registradas atividades vencidas no período.",
      metrics: { overdue: metrics.overdue },
    });
  }

  if (metrics.slaEligibleActivities > 0) {
    if (metrics.slaOnTimePct >= KPI_TARGETS.slaOnTimePct) {
      pushInsight(insights, {
        id: "insight.sla_good",
        tone: INSIGHT_TONE.POSITIVE,
        rule: `slaOnTimePct >= ${KPI_TARGETS.slaOnTimePct}`,
        text: "O SLA ficou dentro da meta estabelecida.",
        metrics: { slaOnTimePct: metrics.slaOnTimePct },
      });
    } else {
      pushInsight(insights, {
        id: "insight.sla_below_target",
        tone: INSIGHT_TONE.WARNING,
        rule: `slaOnTimePct < ${KPI_TARGETS.slaOnTimePct}`,
        text: "O SLA ficou abaixo da meta, indicando necessidade de ajustes operacionais.",
        metrics: { slaOnTimePct: metrics.slaOnTimePct },
      });
    }
  } else {
    pushInsight(insights, {
      id: "insight.sla_not_applicable",
      tone: INSIGHT_TONE.INFO,
      rule: "slaEligibleActivities == 0",
      text: "Não houve atividades elegíveis para cálculo de SLA no período.",
      metrics: { slaEligibleActivities: metrics.slaEligibleActivities },
    });
  }

  if (metrics.docsRequired > 0) {
    if (metrics.docsCompliancePct >= KPI_TARGETS.docsCompliancePct) {
      pushInsight(insights, {
        id: "insight.docs_good",
        tone: INSIGHT_TONE.POSITIVE,
        rule: `docsCompliancePct >= ${KPI_TARGETS.docsCompliancePct}`,
        text: "A conformidade documental ficou dentro do padrão esperado.",
        metrics: { docsCompliancePct: metrics.docsCompliancePct },
      });
    } else {
      pushInsight(insights, {
        id: "insight.docs_low",
        tone: INSIGHT_TONE.WARNING,
        rule: `docsCompliancePct < ${KPI_TARGETS.docsCompliancePct}`,
        text: "A conformidade documental ficou abaixo do ideal no período.",
        metrics: { docsCompliancePct: metrics.docsCompliancePct },
      });
    }
  }

  if (metrics.docsUnknown > 0) {
    pushInsight(insights, {
      id: "insight.docs_unknown",
      tone: INSIGHT_TONE.INFO,
      rule: "docsUnknown > 0",
      text: "Há atividades com exigências documentais indeterminadas, revisite o cadastro de categorias.",
      metrics: { docsUnknown: metrics.docsUnknown },
    });
  }

  if (metrics.critical > 0) {
    pushInsight(insights, {
      id: "insight.critical_present",
      tone: INSIGHT_TONE.WARNING,
      rule: "critical > 0",
      text: "Foram registradas atividades críticas no período.",
      metrics: { critical: metrics.critical },
    });
  }

  if (planned < 5) {
    pushInsight(insights, {
      id: "insight.low_volume",
      tone: INSIGHT_TONE.INFO,
      rule: "planned < 5",
      text: "O volume de atividades no período é baixo, o que reduz a robustez estatística das análises.",
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
          rule: "comparison.backlog.deltaPct > 20",
          text: "O backlog apresentou crescimento relevante em relação ao período anterior.",
          metrics: { current: backlogItem.current, previous: backlogItem.previous, deltaPct: backlogItem.deltaPct },
        });
      } else if (backlogItem.deltaPct < -20) {
        pushInsight(insights, {
          id: "insight.backlog_reduction",
          tone: INSIGHT_TONE.POSITIVE,
          rule: "comparison.backlog.deltaPct < -20",
          text: "Houve redução expressiva do backlog em relação ao período anterior.",
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
          rule: "comparison.slaOnTimePct.delta >= 10",
          text: "O SLA apresentou melhora significativa em relação ao período anterior.",
          metrics: { current: slaItem.current, previous: slaItem.previous, delta: slaItem.delta },
        });
      } else if (slaItem.delta <= -10) {
        pushInsight(insights, {
          id: "insight.sla_worsened",
          tone: INSIGHT_TONE.WARNING,
          rule: "comparison.slaOnTimePct.delta <= -10",
          text: "O SLA piorou de forma relevante em relação ao período anterior.",
          metrics: { current: slaItem.current, previous: slaItem.previous, delta: slaItem.delta },
        });
      }
    }
  }

  if (integrityStatus && integrityStatus !== "ok") {
    pushInsight(insights, {
      id: "insight.integrity_attention",
      tone: INSIGHT_TONE.WARNING,
      rule: "integrityStatus != ok",
      text: "Foram identificadas advertências de integridade de dados neste relatório.",
      metrics: { integrityStatus },
    });
  }

  return insights;
}

module.exports = {
  buildInsights,
};
