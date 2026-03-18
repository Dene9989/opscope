const {
  COMPARISON_MODES,
  STATUS_NORMALIZED,
  normalizeStatus,
  normalizePriority,
  normalizeCategory,
  normalizeDocValue,
  getRequiredDocsForActivity,
  DOC_KEYS,
} = require("./contracts");
const { validateMonthlyReportInput } = require("./schema");
const {
  normalizeText,
  parseDateOnly,
  parseDateTime,
  startOfDay,
  endOfDay,
  toIsoDate,
  toIsoDateTime,
  hashString,
} = require("./utils");

const MAX_WARNINGS = 200;

function createWarningStore() {
  const warnings = [];
  return {
    add(code, message, context = {}) {
      if (warnings.length >= MAX_WARNINGS) {
        return;
      }
      warnings.push({ code, message, ...context });
    },
    list() {
      return warnings.slice();
    },
  };
}

function normalizeId(raw, fallbackSeed, warningStore, context) {
  const text = normalizeText(raw);
  if (text) {
    return text;
  }
  const synthetic = `synthetic_${hashString(fallbackSeed)}`;
  warningStore.add("missing_id", "Missing id. Synthetic id generated.", {
    syntheticId: synthetic,
    ...context,
  });
  return synthetic;
}

function disambiguateId(id, idCounts, warningStore, context) {
  const count = idCounts.get(id) || 0;
  if (count === 0) {
    idCounts.set(id, 1);
    return id;
  }
  const next = `${id}__dup${count + 1}`;
  idCounts.set(id, count + 1);
  warningStore.add("duplicate_id", "Duplicate id detected. New id generated.", {
    originalId: id,
    newId: next,
    ...context,
  });
  return next;
}

function normalizeDocs(activity, warningStore, context) {
  const docRaw = activity && activity.docs ? activity.docs : {};
  const { requiredDocs, isUnknown, reason } = getRequiredDocsForActivity(activity);
  if (isUnknown) {
    warningStore.add("docs_unknown_requirement", "Unable to determine required docs.", {
      reason,
      ...context,
    });
  }
  const docStates = {};
  DOC_KEYS.forEach((key) => {
    docStates[key] = normalizeDocValue(docRaw[key]);
  });

  if (requiredDocs === null) {
    return {
      requiredDocs: null,
      providedDocs: [],
      missingDocs: [],
      unknownDocs: DOC_KEYS.slice(),
      status: "unknown",
    };
  }
  if (!requiredDocs.length) {
    return {
      requiredDocs: [],
      providedDocs: [],
      missingDocs: [],
      unknownDocs: [],
      status: "not_required",
    };
  }

  const providedDocs = [];
  const missingDocs = [];
  const unknownDocs = [];
  let hasPartial = false;
  requiredDocs.forEach((key) => {
    const state = docStates[key];
    if (state === "present") {
      providedDocs.push(key);
    } else if (state === "partial") {
      hasPartial = true;
      providedDocs.push(key);
    } else if (state === "unknown") {
      unknownDocs.push(key);
    } else {
      missingDocs.push(key);
    }
  });

  if (unknownDocs.length) {
    return {
      requiredDocs,
      providedDocs,
      missingDocs,
      unknownDocs,
      status: "unknown",
    };
  }
  if (missingDocs.length === 0 && !hasPartial) {
    return {
      requiredDocs,
      providedDocs,
      missingDocs,
      unknownDocs,
      status: "ok",
    };
  }
  if (providedDocs.length === 0 && missingDocs.length > 0) {
    return {
      requiredDocs,
      providedDocs,
      missingDocs,
      unknownDocs,
      status: "missing",
    };
  }
  return {
    requiredDocs,
    providedDocs,
    missingDocs,
    unknownDocs,
    status: "partial",
  };
}

function normalizeRdo(rdo, warningStore, idCounts, index) {
  const context = { record: "rdo", index };
  const id = disambiguateId(
    normalizeId(rdo && rdo.id, `rdo:${index}:${rdo && rdo.rdoDate}`, warningStore, context),
    idCounts,
    warningStore,
    context
  );
  const rdoDate = parseDateOnly(rdo && rdo.rdoDate);
  if (!rdoDate) {
    warningStore.add("invalid_rdo_date", "Invalid rdoDate.", { ...context, id });
  }
  const createdAt = parseDateTime(rdo && rdo.createdAt);
  if (!createdAt) {
    warningStore.add("invalid_rdo_createdAt", "Invalid rdo createdAt.", { ...context, id });
  }
  const metrics = rdo && rdo.metrics ? rdo.metrics : {};
  const evidencias = Array.isArray(rdo && rdo.evidencias) ? rdo.evidencias : [];
  return {
    id,
    rdoDate,
    rdoDateIso: toIsoDate(rdoDate),
    createdAt,
    createdAtIso: toIsoDateTime(createdAt),
    createdBy: normalizeText(rdo && rdo.createdBy),
    metrics: {
      total: Number(metrics.total || 0),
      concluidas: Number(metrics.concluidas || 0),
      emExecucao: Number(metrics.emExecucao || 0),
      criticas: Number(metrics.criticas || 0),
      overdue: Number(metrics.overdue || 0),
      docsOk: Number(metrics.docsOk || 0),
      docsTotal: Number(metrics.docsTotal || 0),
      tempoTotalMin: Number(metrics.tempoTotalMin || 0),
    },
    evidenciasTotal: Number(rdo && rdo.evidenciasTotal ? rdo.evidenciasTotal : 0),
    evidencias,
    filtros: rdo && rdo.filtros ? rdo.filtros : {},
    manual: rdo && rdo.manual ? rdo.manual : {},
    isValid: Boolean(rdoDate),
  };
}

function normalizeActivity(activity, warningStore, idCounts, index) {
  const context = { record: "activity", index };
  const id = disambiguateId(
    normalizeId(activity && activity.id, `activity:${index}:${activity && activity.title}`, warningStore, context),
    idCounts,
    warningStore,
    context
  );
  const title = normalizeText(activity && activity.title) || "(sem titulo)";
  if (!title || title === "(sem titulo)") {
    warningStore.add("missing_title", "Missing activity title.", { ...context, id });
  }
  const statusRaw = activity && activity.status;
  const status = normalizeStatus(statusRaw);
  if (status === STATUS_NORMALIZED.UNKNOWN) {
    warningStore.add("unknown_status", "Unknown activity status.", { ...context, id, statusRaw });
  }
  const dueDate = parseDateOnly(activity && activity.dueDate);
  if (!dueDate) {
    warningStore.add("missing_due_date", "Missing or invalid dueDate.", { ...context, id });
  }
  const doneAt = parseDateTime(activity && activity.doneAt);
  if (activity && activity.doneAt && !doneAt) {
    warningStore.add("invalid_done_at", "Invalid doneAt.", { ...context, id });
  }
  const executionStartedAt = parseDateTime(activity && activity.executionStartedAt);
  const executionFinishedAt = parseDateTime(activity && activity.executionFinishedAt);

  const category = normalizeCategory(activity && activity.category);
  const priority = normalizePriority(activity && activity.priority);

  const docs = normalizeDocs(
    {
      category,
      critical: Boolean(activity && activity.critical),
      docs: activity && activity.docs ? activity.docs : {},
    },
    warningStore,
    { ...context, id }
  );

  const evidenceCount = Number(activity && activity.evidenceCount ? activity.evidenceCount : 0);

  const executionDurationHours = Number(activity && activity.executionDurationHours ? activity.executionDurationHours : 0);

  const issues = [];
  if (status === STATUS_NORMALIZED.UNKNOWN) {
    issues.push("status_unknown");
  }
  if (!dueDate && !doneAt) {
    issues.push("missing_due_and_done");
  }
  if (status === STATUS_NORMALIZED.CONCLUIDA && !doneAt) {
    issues.push("concluida_sem_doneAt");
  }

  const isValid = issues.length === 0 || !(issues.includes("status_unknown") || issues.includes("missing_due_and_done"));

  return {
    id,
    title,
    status,
    dueDate,
    dueDateIso: toIsoDate(dueDate),
    doneAt,
    doneAtIso: toIsoDateTime(doneAt),
    executionStartedAt,
    executionFinishedAt,
    priority,
    category,
    location: normalizeText(activity && activity.location),
    team: normalizeText(activity && activity.team),
    responsible: normalizeText(activity && activity.responsible),
    critical: Boolean(activity && activity.critical),
    backlogReason: normalizeText(activity && activity.backlogReason),
    cancelReason: normalizeText(activity && activity.cancelReason),
    docs,
    evidenceCount,
    executionDurationHours,
    issues,
    isValid,
  };
}

function normalizeSlice(slice, warningStore, label) {
  const periodStart = parseDateOnly(slice && slice.period && slice.period.start);
  const periodEnd = parseDateOnly(slice && slice.period && slice.period.end);
  const start = periodStart ? startOfDay(periodStart) : null;
  const end = periodEnd ? endOfDay(periodEnd) : null;
  if (!start || !end) {
    warningStore.add("invalid_period", "Invalid period start/end.", { slice: label });
  }
  const activityIdCounts = new Map();
  const rdoIdCounts = new Map();

  const activities = Array.isArray(slice && slice.activities)
    ? slice.activities.map((activity, index) =>
        normalizeActivity(activity, warningStore, activityIdCounts, index)
      )
    : [];
  const rdos = Array.isArray(slice && slice.rdos)
    ? slice.rdos.map((rdo, index) => normalizeRdo(rdo, warningStore, rdoIdCounts, index))
    : [];

  return {
    period: {
      start,
      end,
      startIso: toIsoDate(start),
      endIso: toIsoDate(end),
    },
    activities,
    rdos,
  };
}

function normalizeMonthlyReportInput(input = {}, options = {}) {
  const warningStore = createWarningStore();
  const schemaResult = validateMonthlyReportInput(input);
  if (!schemaResult.ok) {
    schemaResult.errors.forEach((err) => {
      warningStore.add("schema_error", err.message, { path: err.path });
    });
  }

  const comparisonMode = Object.values(COMPARISON_MODES).includes(input.comparisonMode)
    ? input.comparisonMode
    : input.previousPeriod
      ? COMPARISON_MODES.PROVIDED
      : COMPARISON_MODES.RECALCULATED;

  const meta = input.meta || {};
  const normalized = {
    meta: {
      projectId: normalizeText(meta.projectId),
      projectName: normalizeText(meta.projectName),
      clientName: normalizeText(meta.clientName),
      plantName: normalizeText(meta.plantName),
      period: {
        start: toIsoDate(parseDateOnly(meta.period && meta.period.start)),
        end: toIsoDate(parseDateOnly(meta.period && meta.period.end)),
      },
      timezone: normalizeText(meta.timezone) || "America/Sao_Paulo",
      emittedAt: toIsoDateTime(parseDateTime(meta.emittedAt)),
      reportVersion: normalizeText(meta.reportVersion),
    },
    comparisonMode,
    currentPeriod: normalizeSlice(input.currentPeriod || {}, warningStore, "currentPeriod"),
    previousPeriod: input.previousPeriod
      ? normalizeSlice(input.previousPeriod || {}, warningStore, "previousPeriod")
      : null,
    normalization: {
      warnings: warningStore.list(),
    },
  };

  const counts = {
    activitiesTotal: normalized.currentPeriod.activities.length,
    rdosTotal: normalized.currentPeriod.rdos.length,
    previousActivitiesTotal: normalized.previousPeriod ? normalized.previousPeriod.activities.length : 0,
    previousRdosTotal: normalized.previousPeriod ? normalized.previousPeriod.rdos.length : 0,
    docsOk: 0,
    docsPartial: 0,
    docsUnknown: 0,
    docsRequired: 0,
    docsNotRequired: 0,
    invalidActivities: 0,
    invalidRdos: 0,
  };

  normalized.currentPeriod.activities.forEach((activity) => {
    if (!activity.isValid) {
      counts.invalidActivities += 1;
    }
    if (activity.docs) {
      if (activity.docs.status === "ok") {
        counts.docsOk += 1;
        counts.docsRequired += 1;
      } else if (activity.docs.status === "partial" || activity.docs.status === "missing") {
        counts.docsPartial += 1;
        counts.docsRequired += 1;
      } else if (activity.docs.status === "unknown") {
        counts.docsUnknown += 1;
      } else if (activity.docs.status === "not_required") {
        counts.docsNotRequired += 1;
      }
    }
  });
  normalized.currentPeriod.rdos.forEach((rdo) => {
    if (!rdo.isValid) {
      counts.invalidRdos += 1;
    }
  });

  normalized.normalization.counts = counts;
  normalized.normalization.schemaOk = schemaResult.ok;
  normalized.normalization.schemaErrors = schemaResult.errors;
  normalized.normalization.options = {
    timezone: options.timezone || normalized.meta.timezone,
  };

  return normalized;
}

module.exports = {
  normalizeMonthlyReportInput,
};
