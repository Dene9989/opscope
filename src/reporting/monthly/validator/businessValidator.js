const { VALIDATION_SEVERITY, STATUS_NORMALIZED } = require("../contracts");
const { createIssue } = require("./helpers");
const { parseDateOnly, parseDateTime, startOfDay } = require("../utils");

function validateBusiness(input, normalized) {
  const issues = [];
  const current = normalized && normalized.currentPeriod ? normalized.currentPeriod : null;
  if (!current) {
    return issues;
  }

  const meta = normalized.meta || {};
  const emittedAt = parseDateTime(meta.emittedAt);
  const reportEnd = parseDateOnly(meta.period && meta.period.end);
  const isPartial = emittedAt && reportEnd ? startOfDay(reportEnd) >= startOfDay(emittedAt) : false;

  if (isPartial && !(input && input.meta && input.meta.isPartial)) {
    issues.push(
      createIssue(
        VALIDATION_SEVERITY.WARNING,
        "business.partial_missing_flag",
        "Relatório parcial sem marcação explícita.",
        { reportEnd: meta.period && meta.period.end, emittedAt: meta.emittedAt },
        "business",
        "business.partial.flag"
      )
    );
  }

  const rawActivities = Array.isArray(input && input.currentPeriod && input.currentPeriod.activities)
    ? input.currentPeriod.activities
    : [];
  const rawById = new Map(rawActivities.map((item) => [String(item && item.id), item]));

  current.activities.forEach((activity) => {
    if (!activity) {
      return;
    }
    if (activity.status === STATUS_NORMALIZED.CONCLUIDA && !activity.doneAt) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "business.concluida_sem_doneAt",
          "Atividade concluída sem doneAt válido.",
          { activityId: activity.id, title: activity.title },
          "business",
          "business.doneAt.required"
        )
      );
    }
    if (activity.status === STATUS_NORMALIZED.CANCELADA && activity.doneAt) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.WARNING,
          "business.cancelada_com_doneAt",
          "Atividade cancelada possui doneAt preenchido.",
          { activityId: activity.id, title: activity.title },
          "business",
          "business.cancelled.doneAt"
        )
      );
    }
    if (activity.status === STATUS_NORMALIZED.UNKNOWN) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.WARNING,
          "business.status_unknown",
          "Status da atividade é desconhecido após normalização.",
          { activityId: activity.id, statusRaw: rawById.get(activity.id) && rawById.get(activity.id).status },
          "business",
          "business.status.normalization"
        )
      );
    }
    if (activity.docs && activity.docs.status === "unknown" && activity.status === STATUS_NORMALIZED.CONCLUIDA) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.WARNING,
          "business.docs_unknown",
          "Atividade concluída com documentação obrigatória indeterminada.",
          { activityId: activity.id, title: activity.title },
          "business",
          "business.docs.unknown"
        )
      );
    }
  });

  rawActivities.forEach((raw) => {
    if (!raw || !raw.id) {
      return;
    }
    const normalizedActivity = current.activities.find((item) => item.id === String(raw.id));
    if (!normalizedActivity) {
      return;
    }
    const backlogFlag = Boolean(raw.backlogReason || raw.isBacklog || raw.backlog === true);
    if (backlogFlag && normalizedActivity.status !== STATUS_NORMALIZED.BACKLOG) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "business.backlog_sem_status",
          "Atividade marcada como backlog, mas status não é backlog.",
          { activityId: normalizedActivity.id, status: normalizedActivity.status },
          "business",
          "business.backlog.status"
        )
      );
    }
    if (raw.overdue || raw.isOverdue) {
      const due = parseDateOnly(raw.dueDate);
      const cutoff = current.period && current.period.end ? current.period.end : null;
      if (due && cutoff && startOfDay(due) >= startOfDay(cutoff)) {
        issues.push(
          createIssue(
            VALIDATION_SEVERITY.BLOCKER,
            "business.overdue_inconsistente",
            "Atividade marcada como overdue com vencimento no futuro.",
            { activityId: normalizedActivity.id, dueDate: raw.dueDate },
            "business",
            "business.overdue.future"
          )
        );
      }
    }
  });

  if (normalized.comparisonMode === "provided") {
    if (!normalized.previousPeriod) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "business.previous_missing",
          "comparisonMode provided exige previousPeriod.",
          {},
          "business",
          "business.comparison.previous"
        )
      );
    } else if (normalized.previousPeriod.period && normalized.currentPeriod.period) {
      const prevEnd = normalized.previousPeriod.period.end;
      const currStart = normalized.currentPeriod.period.start;
      if (prevEnd && currStart && prevEnd >= currStart) {
        issues.push(
          createIssue(
            VALIDATION_SEVERITY.WARNING,
            "business.previous_overlap",
            "Período anterior se sobrepõe ao atual.",
            { previousEnd: normalized.previousPeriod.period.endIso, currentStart: normalized.currentPeriod.period.startIso },
            "business",
            "business.comparison.overlap"
          )
        );
      }
    }
  }

  return issues;
}

module.exports = { validateBusiness };
