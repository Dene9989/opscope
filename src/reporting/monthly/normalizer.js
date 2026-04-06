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
const UNIFIED_TEAM_KEY = "om_boa_sorte_ii";
const UNIFIED_TEAM_LABEL = "O&M Boa Sorte II";

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

function normalizeIntercorrenciaStatus(value) {
  const normalized = normalizeText(value, { lower: true }).replace(/\s+/g, "_");
  if (!normalized) {
    return "ABERTA";
  }
  if (["aberta", "aberto", "open", "nova", "pendente"].includes(normalized)) {
    return "ABERTA";
  }
  if (["em_tratativa", "tratativa", "analise", "em_analise", "investigacao"].includes(normalized)) {
    return "EM_TRATATIVA";
  }
  if (["corrigida", "corrigido", "resolvida", "resolvido", "closed", "finalizada"].includes(normalized)) {
    return "CORRIGIDA";
  }
  return "ABERTA";
}

function normalizeIntercorrenciaCriticidade(value) {
  const normalized = normalizeText(value, { lower: true }).replace(/\s+/g, "_");
  if (!normalized) {
    return "MEDIA";
  }
  if (["baixa", "baixo", "low"].includes(normalized)) {
    return "BAIXA";
  }
  if (["media", "medio", "med", "normal", "moderada"].includes(normalized)) {
    return "MEDIA";
  }
  if (["alta", "alto", "high"].includes(normalized)) {
    return "ALTA";
  }
  if (["critica", "critico", "critical", "grave"].includes(normalized)) {
    return "CRITICA";
  }
  return "MEDIA";
}

function normalizeIntercorrencia(issue, warningStore, context) {
  if (!issue || typeof issue !== "object") {
    return null;
  }
  const fotos = Array.isArray(issue.fotos)
    ? issue.fotos
    : Array.isArray(issue.evidencias)
      ? issue.evidencias
      : [];
  const descricao = normalizeText(issue.descricao || issue.detalhes || issue.descricaoFalha);
  const acaoImediata = normalizeText(issue.acaoImediata || issue.acao || issue.acaoAdotada || issue.mitigacao);
  if (!descricao && !acaoImediata && !fotos.length) {
    return null;
  }
  const issueId = disambiguateId(
    normalizeId(issue.id, `issue:${context.id}:${descricao}`, warningStore, context),
    context.issueIdCounts || new Map(),
    warningStore,
    context
  );
  const createdAt = parseDateTime(issue.criadaEm || issue.createdAt || issue.registradaEm || issue.registeredAt);
  const updatedAt = parseDateTime(
    issue.atualizadaEm || issue.updatedAt || issue.statusAtualizadoEm || issue.lastStatusAt
  );
  const correctedAt = parseDateTime(issue.corrigidaEm || issue.resolvidaEm);
  return {
    id: issueId,
    status: normalizeIntercorrenciaStatus(issue.status || issue.estado),
    criticidade: normalizeIntercorrenciaCriticidade(issue.criticidade || issue.severidade),
    descricao,
    acaoImediata,
    fotos,
    createdAt,
    createdAtIso: toIsoDateTime(createdAt),
    updatedAt,
    updatedAtIso: toIsoDateTime(updatedAt),
    correctedAt,
    correctedAtIso: toIsoDateTime(correctedAt),
    createdBy: normalizeText(issue.criadaPor || issue.createdBy || issue.registradaPor || issue.registeredBy),
    updatedBy: normalizeText(issue.atualizadaPor || issue.updatedBy || issue.statusAtualizadoPor),
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
    createdBy: UNIFIED_TEAM_LABEL,
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

function normalizeContingency(contingency, warningStore, idCounts, index) {
  const context = { record: "contingency", index };
  const id = disambiguateId(
    normalizeId(
      contingency && contingency.id,
      `contingency:${index}:${contingency && contingency.code}`,
      warningStore,
      context
    ),
    idCounts,
    warningStore,
    context
  );
  const startAt = parseDateTime(contingency && (contingency.startAt || contingency.startDate || contingency.inicio));
  if (!startAt) {
    warningStore.add("invalid_contingency_start", "Invalid contingency startAt.", { ...context, id });
  }
  const normalizedAt = parseDateTime(
    contingency && (contingency.normalizedAt || contingency.normalized_at || contingency.dataNormalizacao)
  );
  return {
    id,
    code: normalizeText(contingency && contingency.code),
    eventType: normalizeText(contingency && (contingency.eventType || contingency.tipoEvento)),
    severity: normalizeText(contingency && contingency.severity),
    status: normalizeText(contingency && contingency.status),
    systemCondition: normalizeText(contingency && contingency.systemCondition),
    startAt,
    startAtIso: toIsoDateTime(startAt),
    normalizedAt,
    normalizedAtIso: toIsoDateTime(normalizedAt),
    impactDescription: normalizeText(contingency && contingency.impactDescription),
    containmentActions: normalizeText(contingency && contingency.containmentActions),
    diagnosis: normalizeText(contingency && contingency.diagnosis),
    engineeringConclusion: normalizeText(contingency && contingency.engineeringConclusion),
    assetName: normalizeText(contingency && contingency.assetName),
    substation: normalizeText(contingency && contingency.substation),
    isValid: Boolean(startAt),
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
  const conclusao =
    activity && activity.conclusao && typeof activity.conclusao === "object" ? activity.conclusao : null;
  let doneAt = parseDateTime(activity && activity.doneAt);
  if (!doneAt) {
    doneAt = parseDateTime(activity && activity.executionFinishedAt);
  }
  if (!doneAt && conclusao) {
    doneAt = parseDateTime(
      conclusao.fim ||
        conclusao.dataFim ||
        conclusao.dataEncerramento ||
        conclusao.encerradoEm ||
        conclusao.concluidaEm
    );
  }
  if (!doneAt) {
    doneAt = parseDateTime(activity && activity.concluidaEm);
  }
  if (!doneAt) {
    doneAt = parseDateTime(activity && activity.dataConclusao);
  }
  if (!doneAt) {
    doneAt = parseDateTime(activity && activity.execucaoRegistradaEm);
  }
  if (!doneAt) {
    doneAt = parseDateTime(activity && activity.executionRegisteredAt);
  }
  if (!doneAt) {
    doneAt = parseDateTime(activity && activity.execucaoRegistradaAt);
  }
  if (!doneAt) {
    doneAt = parseDateTime(activity && activity.registroExecucao && activity.registroExecucao.registradoEm);
  }
  if (!doneAt && Array.isArray(activity && activity.registrosDiariosExecucao)) {
    let best = null;
    activity.registrosDiariosExecucao.forEach((entry) => {
      const candidate = parseDateTime(entry && (entry.registradoEm || entry.data || entry.dataRef));
      if (candidate && (!best || candidate.getTime() > best.getTime())) {
        best = candidate;
      }
    });
    if (best) {
      doneAt = best;
    }
  }
  if (activity && activity.doneAt && !doneAt) {
    warningStore.add("invalid_done_at", "Invalid doneAt.", { ...context, id });
  }
  const executionStartedAt = parseDateTime(activity && activity.executionStartedAt);
  const executionFinishedAt = parseDateTime(activity && activity.executionFinishedAt);

  let category = normalizeCategory(activity && activity.category);
  let priority = normalizePriority(activity && activity.priority);
  const isFutureStatus = status === STATUS_NORMALIZED.AGENDADA || status === STATUS_NORMALIZED.LIBERADA;
  if (isFutureStatus && (!category || category === "desconhecida")) {
    category = "programacao_futura";
  }
  if (isFutureStatus && (!priority || priority === "unknown")) {
    priority = "prioridade_pendente";
  }

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
  const evidences = Array.isArray(activity && activity.evidences)
    ? activity.evidences
    : Array.isArray(activity && activity.evidencias)
      ? activity.evidencias
      : [];

  const executionDurationHours = Number(activity && activity.executionDurationHours ? activity.executionDurationHours : 0);
  const issueContext = { ...context, id, issueIdCounts: new Map() };
  const issue = normalizeIntercorrencia(activity && (activity.issue || activity.intercorrencia), warningStore, issueContext);

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
    team: UNIFIED_TEAM_KEY,
    responsible: UNIFIED_TEAM_LABEL,
    critical: Boolean(activity && activity.critical),
    backlogReason: normalizeText(activity && activity.backlogReason),
    cancelReason: normalizeText(activity && activity.cancelReason),
    docs,
    evidenceCount,
    evidences,
    executionDurationHours,
    issue,
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
  const contingencyIdCounts = new Map();

  const activities = Array.isArray(slice && slice.activities)
    ? slice.activities.map((activity, index) =>
        normalizeActivity(activity, warningStore, activityIdCounts, index)
      )
    : [];
  const rdos = Array.isArray(slice && slice.rdos)
    ? slice.rdos.map((rdo, index) => normalizeRdo(rdo, warningStore, rdoIdCounts, index))
    : [];
  const contingencies = Array.isArray(slice && slice.contingencies)
    ? slice.contingencies.map((contingency, index) =>
        normalizeContingency(contingency, warningStore, contingencyIdCounts, index)
      )
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
    contingencies,
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
    contingenciesTotal: normalized.currentPeriod.contingencies ? normalized.currentPeriod.contingencies.length : 0,
    previousActivitiesTotal: normalized.previousPeriod ? normalized.previousPeriod.activities.length : 0,
    previousRdosTotal: normalized.previousPeriod ? normalized.previousPeriod.rdos.length : 0,
    previousContingenciesTotal: normalized.previousPeriod && normalized.previousPeriod.contingencies ? normalized.previousPeriod.contingencies.length : 0,
    docsOk: 0,
    docsPartial: 0,
    docsUnknown: 0,
    docsRequired: 0,
    docsNotRequired: 0,
    invalidActivities: 0,
    invalidRdos: 0,
    invalidContingencies: 0,
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
  if (Array.isArray(normalized.currentPeriod.contingencies)) {
    normalized.currentPeriod.contingencies.forEach((contingency) => {
      if (!contingency.isValid) {
        counts.invalidContingencies += 1;
      }
    });
  }

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
