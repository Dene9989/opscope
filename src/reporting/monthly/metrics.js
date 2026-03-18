const { STATUS_NORMALIZED } = require("./contracts");
const { inRange, diffInDays, startOfDay } = require("./utils");

const METRIC_TRACEABILITY = {
  totalPlannedActivities: {
    source: "activities",
    rule: "dueDate in period and status != cancelada",
    fn: "countPlannedActivities",
    sections: ["executiveCover", "comparison", "tables"],
  },
  totalExecutedActivities: {
    source: "activities",
    rule: "doneAt in period and status == concluida",
    fn: "countExecutedActivities",
    sections: ["executiveCover", "comparison", "tables"],
  },
  completed: {
    source: "activities",
    rule: "status == concluida and dueDate in period",
    fn: "countByStatus",
    sections: ["operationalBreakdown", "tables"],
  },
  inProgress: {
    source: "activities",
    rule: "status in {em_execucao, encerramento} and dueDate in period",
    fn: "countByStatus",
    sections: ["operationalBreakdown"],
  },
  scheduled: {
    source: "activities",
    rule: "status in {agendada, liberada} and dueDate in period",
    fn: "countByStatus",
    sections: ["operationalBreakdown"],
  },
  backlog: {
    source: "activities",
    rule: "status == backlog and dueDate in period",
    fn: "countByStatus",
    sections: ["operationalBreakdown"],
  },
  overdue: {
    source: "activities",
    rule: "dueDate < cutoff and status not in {concluida, cancelada}",
    fn: "countOverdue",
    sections: ["riskSummary", "tables"],
  },
  cancelled: {
    source: "activities",
    rule: "status == cancelada and dueDate in period",
    fn: "countByStatus",
    sections: ["operationalBreakdown"],
  },
  critical: {
    source: "activities",
    rule: "critical == true or priority == critica",
    fn: "countCritical",
    sections: ["executiveCover", "riskSummary"],
  },
  slaEligibleActivities: {
    source: "activities",
    rule: "status concluida, doneAt in period, dueDate valid",
    fn: "computeSlaMetrics",
    sections: ["kpis", "charts"],
  },
  slaOnTime: {
    source: "activities",
    rule: "doneAt <= dueDate",
    fn: "computeSlaMetrics",
    sections: ["kpis", "charts"],
  },
  slaLate: {
    source: "activities",
    rule: "doneAt > dueDate",
    fn: "computeSlaMetrics",
    sections: ["kpis", "charts"],
  },
  slaNotApplicable: {
    source: "activities",
    rule: "executed but missing dueDate",
    fn: "computeSlaMetrics",
    sections: ["kpis"],
  },
  docsRequired: {
    source: "activities",
    rule: "required docs known and activity executed in period",
    fn: "computeDocsMetrics",
    sections: ["compliance"],
  },
  docsOk: {
    source: "activities",
    rule: "docs status ok and executed in period",
    fn: "computeDocsMetrics",
    sections: ["compliance"],
  },
  docsPartial: {
    source: "activities",
    rule: "docs status partial or missing and executed in period",
    fn: "computeDocsMetrics",
    sections: ["compliance"],
  },
  docsUnknown: {
    source: "activities",
    rule: "docs status unknown and executed in period",
    fn: "computeDocsMetrics",
    sections: ["compliance"],
  },
  docsCompliancePct: {
    source: "activities",
    rule: "docsOk / docsRequired",
    fn: "computeDocsMetrics",
    sections: ["compliance"],
  },
  hoursExecuted: {
    source: "activities",
    rule: "sum of executionDurationHours or computed diff",
    fn: "computeHoursExecuted",
    sections: ["kpis"],
  },
  evidenceCount: {
    source: "activities + rdos",
    rule: "sum of evidence counts",
    fn: "computeEvidenceCount",
    sections: ["compliance"],
  },
  rdoCount: {
    source: "rdos",
    rule: "rdoDate in period",
    fn: "countRdos",
    sections: ["executiveCover"],
  },
};

function isConcluida(status) {
  return status === STATUS_NORMALIZED.CONCLUIDA;
}

function isCancelada(status) {
  return status === STATUS_NORMALIZED.CANCELADA;
}

function isEmExecucao(status) {
  return status === STATUS_NORMALIZED.EM_EXECUCAO || status === STATUS_NORMALIZED.ENCERRAMENTO;
}

function isAgendada(status) {
  return status === STATUS_NORMALIZED.AGENDADA || status === STATUS_NORMALIZED.LIBERADA;
}

function buildPlannedSet(activities, period) {
  if (!period || !period.start || !period.end) {
    return [];
  }
  return activities.filter((activity) => activity.isValid && activity.dueDate && inRange(activity.dueDate, period.start, period.end));
}

function buildExecutedSet(activities, period) {
  if (!period || !period.start || !period.end) {
    return [];
  }
  return activities.filter(
    (activity) =>
      activity.isValid && isConcluida(activity.status) && activity.doneAt && inRange(activity.doneAt, period.start, period.end)
  );
}

function countPlannedActivities(plannedSet) {
  return plannedSet.filter((activity) => !isCancelada(activity.status)).length;
}

function countExecutedActivities(executedSet) {
  return executedSet.length;
}

function countByStatus(plannedSet) {
  const counts = {
    concluida: 0,
    em_execucao: 0,
    agendada: 0,
    backlog: 0,
    cancelada: 0,
  };
  plannedSet.forEach((activity) => {
    const status = activity.status;
    if (isConcluida(status)) {
      counts.concluida += 1;
    } else if (isEmExecucao(status)) {
      counts.em_execucao += 1;
    } else if (status === STATUS_NORMALIZED.BACKLOG) {
      counts.backlog += 1;
    } else if (isCancelada(status)) {
      counts.cancelada += 1;
    } else if (isAgendada(status)) {
      counts.agendada += 1;
    }
  });
  return counts;
}

function countCritical(activities) {
  return activities.filter((activity) => activity.isValid && (activity.critical || activity.priority === "critica")).length;
}

function countOverdue(plannedSet, cutoff) {
  if (!cutoff) {
    return 0;
  }
  const cutoffDay = startOfDay(cutoff);
  return plannedSet.filter((activity) => {
    if (!activity.dueDate) {
      return false;
    }
    if (isConcluida(activity.status) || isCancelada(activity.status)) {
      return false;
    }
    return startOfDay(activity.dueDate) < cutoffDay;
  }).length;
}

function computeSlaMetrics(executedSet) {
  let eligible = 0;
  let onTime = 0;
  let late = 0;
  let notApplicable = 0;

  executedSet.forEach((activity) => {
    if (!activity.dueDate) {
      notApplicable += 1;
      return;
    }
    eligible += 1;
    if (activity.doneAt && activity.dueDate && activity.doneAt <= activity.dueDate) {
      onTime += 1;
    } else {
      late += 1;
    }
  });
  const pct = eligible ? Math.round((onTime / eligible) * 100) : 0;
  return {
    slaEligibleActivities: eligible,
    slaOnTime: onTime,
    slaLate: late,
    slaNotApplicable: notApplicable,
    slaOnTimePct: pct,
  };
}

function computeDocsMetrics(executedSet) {
  let docsRequired = 0;
  let docsOk = 0;
  let docsPartial = 0;
  let docsUnknown = 0;

  executedSet.forEach((activity) => {
    const docs = activity.docs || {};
    if (docs.status === "ok") {
      docsOk += 1;
      docsRequired += 1;
    } else if (docs.status === "partial" || docs.status === "missing") {
      docsPartial += 1;
      docsRequired += 1;
    } else if (docs.status === "unknown") {
      docsUnknown += 1;
    }
  });
  const docsCompliancePct = docsRequired ? Math.round((docsOk / docsRequired) * 100) : 0;
  return {
    docsRequired,
    docsOk,
    docsPartial,
    docsUnknown,
    docsCompliancePct,
  };
}

function computeHoursExecuted(executedSet) {
  let total = 0;
  executedSet.forEach((activity) => {
    if (Number.isFinite(activity.executionDurationHours) && activity.executionDurationHours > 0) {
      total += activity.executionDurationHours;
      return;
    }
    if (activity.executionStartedAt && activity.executionFinishedAt) {
      const start = activity.executionStartedAt.getTime();
      const end = activity.executionFinishedAt.getTime();
      if (end >= start) {
        total += (end - start) / (1000 * 60 * 60);
      }
    }
  });
  return Number(total.toFixed(2));
}

function computeEvidenceCount(executedSet, rdos, period) {
  const activityEvidence = executedSet.reduce((acc, activity) => acc + (Number(activity.evidenceCount) || 0), 0);
  const rdoEvidence = rdos
    .filter((rdo) => rdo.rdoDate && inRange(rdo.rdoDate, period.start, period.end))
    .reduce((acc, rdo) => {
      const evidencias = Number(rdo.evidenciasTotal) || 0;
      const count = evidencias || (Array.isArray(rdo.evidencias) ? rdo.evidencias.length : 0);
      return acc + count;
    }, 0);
  return activityEvidence + rdoEvidence;
}

function countRdos(rdos, period) {
  return rdos.filter((rdo) => rdo.rdoDate && inRange(rdo.rdoDate, period.start, period.end)).length;
}

function groupByField(plannedSet, field) {
  return plannedSet.reduce((acc, activity) => {
    const key = activity[field] || "nao_informado";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function buildWeeklyBreakdown(plannedSet, executedSet, period) {
  if (!period || !period.start || !period.end) {
    return [];
  }
  const start = startOfDay(period.start);
  const end = startOfDay(period.end);
  const totalDays = diffInDays(start, end) + 1;
  const weeks = Math.max(1, Math.ceil(totalDays / 7));
  const buckets = Array.from({ length: weeks }, (_, idx) => {
    const weekStart = new Date(start.getTime() + idx * 7 * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(Math.min(end.getTime(), weekStart.getTime() + 6 * 24 * 60 * 60 * 1000));
    return {
      weekIndex: idx + 1,
      start: weekStart,
      end: weekEnd,
      planned: 0,
      executed: 0,
    };
  });

  plannedSet.forEach((activity) => {
    if (!activity.dueDate) {
      return;
    }
    const diff = diffInDays(start, activity.dueDate);
    const bucketIndex = Math.min(weeks - 1, Math.max(0, Math.floor(diff / 7)));
    buckets[bucketIndex].planned += 1;
  });
  executedSet.forEach((activity) => {
    if (!activity.doneAt) {
      return;
    }
    const diff = diffInDays(start, activity.doneAt);
    const bucketIndex = Math.min(weeks - 1, Math.max(0, Math.floor(diff / 7)));
    buckets[bucketIndex].executed += 1;
  });
  return buckets;
}

module.exports = {
  METRIC_TRACEABILITY,
  buildPlannedSet,
  buildExecutedSet,
  countPlannedActivities,
  countExecutedActivities,
  countByStatus,
  countCritical,
  countOverdue,
  computeSlaMetrics,
  computeDocsMetrics,
  computeHoursExecuted,
  computeEvidenceCount,
  countRdos,
  groupByField,
  buildWeeklyBreakdown,
  isConcluida,
  isCancelada,
  isEmExecucao,
  isAgendada,
};
