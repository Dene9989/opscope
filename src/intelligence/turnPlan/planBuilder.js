const { normalizeSeverity, severityValue, normalizeStatus } = require("../contracts");
const { parseDate, safeText, stableHash } = require("../normalize/keyResolver");
const {
  computePriorityScore,
  computeConfidence,
  computeEstimatedImpact,
} = require("./priority");

const TURN_PLAN_MAX_ACTIONS = 20;

function clampInt(value, fallback, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  const floored = Math.floor(numeric);
  if (floored < min) {
    return min;
  }
  if (floored > max) {
    return max;
  }
  return floored;
}

function parseDateOnly(value, fallback = "") {
  const raw = safeText(value);
  if (!raw) {
    return fallback;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }
  const parsed = parseDate(raw);
  if (!parsed) {
    return fallback;
  }
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeMode(value) {
  const raw = safeText(value).toLowerCase();
  if (!raw) {
    return "assisted";
  }
  if (["assistido", "assisted", "default"].includes(raw)) {
    return "assisted";
  }
  if (["fast", "rapido", "quick"].includes(raw)) {
    return "fast";
  }
  if (["safe", "seguro", "conservative"].includes(raw)) {
    return "safe";
  }
  return raw;
}

function normalizeShift(value) {
  const raw = safeText(value).toLowerCase();
  if (!raw) {
    return "all";
  }
  if (["dia", "day", "manhã", "manha", "morning"].includes(raw)) {
    return "day";
  }
  if (["tarde", "afternoon"].includes(raw)) {
    return "afternoon";
  }
  if (["noite", "night"].includes(raw)) {
    return "night";
  }
  if (["all", "todos"].includes(raw)) {
    return "all";
  }
  return raw;
}

function clipText(value, max = 220) {
  const text = safeText(value);
  if (!text) {
    return "";
  }
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, Math.max(0, max - 3))}...`;
}

function inferActionType(entry = {}) {
  const source = safeText(entry.source).toLowerCase();
  const ruleId = safeText(entry.ruleId).toLowerCase();
  if (source.includes("manut") || ruleId.includes("maintenance")) {
    return "maintenance";
  }
  if (source.includes("conting")) {
    return "contingency";
  }
  if (source.includes("audit") || source.includes("auditoria") || ruleId.includes("audit")) {
    return "audit";
  }
  if (source.includes("pmp")) {
    return "pmp";
  }
  return "other";
}

function recommendedStepByType(type, severity) {
  if (type === "maintenance") {
    return severity === "critical"
      ? "Abrir OS imediata e mobilizar equipe de resposta."
      : "Abrir OS e designar responsável para tratativa.";
  }
  if (type === "contingency") {
    return "Validar causa raiz em campo e acionar plano de contingência.";
  }
  if (type === "audit") {
    return "Executar checklist de conformidade e registrar evidências.";
  }
  if (type === "pmp") {
    return "Programar execução PMP na próxima janela operacional.";
  }
  return "Confirmar condição operacional e registrar ação corretiva.";
}

function inferConstraints(type, entry = {}) {
  const severity = normalizeSeverity(entry.severity);
  const evidenceText = safeText(entry.message || entry.title || "").toLowerCase();
  return {
    needsWindow: type === "maintenance" || type === "pmp" || severity === "critical",
    needsSpareParts:
      type === "maintenance" &&
      (evidenceText.includes("componente") ||
        evidenceText.includes("peça") ||
        evidenceText.includes("peca") ||
        evidenceText.includes("substit")),
    needsPermission: type === "contingency" || severity === "critical",
  };
}

function collectEvidence(entry = {}, eventIndex = new Map()) {
  const evidence = [];
  const ruleId = safeText(entry.ruleId);
  if (ruleId) {
    evidence.push({
      kind: "ruleId",
      id: ruleId,
      description: `Regra acionada: ${ruleId}.`,
    });
  }

  const eventIds = Array.isArray(entry.eventIds) ? entry.eventIds.filter(Boolean) : [];
  eventIds.slice(0, 5).forEach((eventId) => {
    const related = eventIndex.get(String(eventId)) || null;
    const title = related ? clipText(related.title, 90) : "";
    const source = related ? safeText(related.source) : "";
    const description = [title, source ? `fonte ${source}` : ""].filter(Boolean).join(" | ");
    evidence.push({
      kind: "eventId",
      id: String(eventId),
      description: description || `Evento relacionado: ${eventId}.`,
    });
  });

  const metadata = entry.metadata && typeof entry.metadata === "object" ? entry.metadata : {};
  const maintenanceIds = [];
  ["maintenanceId", "maintenance_id", "osId", "ordemServicoId"].forEach((key) => {
    if (metadata[key]) {
      maintenanceIds.push(String(metadata[key]));
    }
  });
  if (Array.isArray(metadata.maintenanceIds)) {
    metadata.maintenanceIds.forEach((id) => maintenanceIds.push(String(id)));
  }
  Array.from(new Set(maintenanceIds.filter(Boolean)))
    .slice(0, 3)
    .forEach((id) => {
      evidence.push({
        kind: "maintenanceId",
        id,
        description: `Registro de manutenção associado: ${id}.`,
      });
    });

  return evidence.slice(0, 8);
}

function buildWhyBullets({
  severity,
  status,
  recurrenceCount,
  priorityBreakdown,
  detectedAt,
  isCritical,
  constraints,
}) {
  const bullets = [];
  const severityLabel = severity || "info";
  bullets.push(
    `Severidade ${severityLabel} contribuiu ${priorityBreakdown.severity} pontos na priorização.`
  );

  if (priorityBreakdown.ageDays !== null && priorityBreakdown.ageDays !== undefined) {
    bullets.push(
      `Recência do evento (${priorityBreakdown.ageDays} dias) adicionou ${priorityBreakdown.recency} pontos.`
    );
  } else if (safeText(detectedAt)) {
    bullets.push("A data de detecção está registrada e foi considerada na recência.");
  } else {
    bullets.push("Sem timestamp confiável; recência aplicada com peso conservador.");
  }

  if (recurrenceCount > 1) {
    bullets.push(
      `Recorrência observada (${recurrenceCount} ocorrências) elevou ${priorityBreakdown.recurrence} pontos.`
    );
  }
  if (normalizeStatus(status) === "open") {
    bullets.push(
      `Status aberto adicionou ${priorityBreakdown.status} pontos de urgência operacional.`
    );
  }
  if (isCritical) {
    bullets.push(
      `Sinal de criticidade elevou ${priorityBreakdown.criticality} pontos no risco operacional.`
    );
  }
  if (constraints.needsWindow) {
    bullets.push("A ação requer janela operacional para execução segura.");
  }
  if (bullets.length < 2) {
    bullets.push("Ação selecionada para reduzir risco residual do turno.");
  }
  return bullets.slice(0, 4);
}

function modeScoreAdjustment(mode, action) {
  if (mode === "fast") {
    return action.type === "contingency" || action.priorityScore >= 70 ? 5 : 0;
  }
  if (mode === "safe") {
    return action.constraints.needsPermission ? 4 : 0;
  }
  return 0;
}

function compareActions(a, b) {
  if (b.priorityScore !== a.priorityScore) {
    return b.priorityScore - a.priorityScore;
  }
  if (b.confidence !== a.confidence) {
    return b.confidence - a.confidence;
  }
  return String(a.id).localeCompare(String(b.id));
}

function mapEventsById(events = []) {
  const index = new Map();
  (Array.isArray(events) ? events : []).forEach((event) => {
    const eventId = safeText(event && (event.eventId || event.id));
    if (!eventId) {
      return;
    }
    if (!index.has(eventId)) {
      index.set(eventId, event);
    }
  });
  return index;
}

function buildActionFromInconsistency(item, eventIndex, context = {}) {
  if (!item || typeof item !== "object") {
    return null;
  }
  const severity = normalizeSeverity(item.severity);
  const type = inferActionType(item);
  const recurrenceCount = Math.max(
    1,
    Array.isArray(item.eventIds) ? item.eventIds.filter(Boolean).length : 1
  );
  const metadata = item.metadata && typeof item.metadata === "object" ? item.metadata : {};
  const scoreResult = computePriorityScore(
    {
      severity,
      status: item.status,
      detectedAt: item.detectedAt,
      updatedAt: item.updatedAt,
      recurrenceCount,
      isCritical: severityValue(severity) >= 4,
      riskScore: metadata.riskScore || 0,
      openDays: metadata.openDays || 0,
    },
    { now: context.referenceDate }
  );
  const constraints = inferConstraints(type, item);
  const evidence = collectEvidence(item, eventIndex);
  const confidence = computeConfidence({
    severity,
    status: item.status,
    detectedAt: item.detectedAt,
    projectId: item.projectId,
    ruleId: item.ruleId,
    eventIds: item.eventIds,
    evidence,
  });
  const impact = computeEstimatedImpact({
    priorityScore: scoreResult.score,
    recurrenceCount,
    isCritical: severityValue(severity) >= 4,
  });
  const why = buildWhyBullets({
    severity,
    status: item.status,
    recurrenceCount,
    priorityBreakdown: scoreResult.breakdown,
    detectedAt: item.detectedAt,
    isCritical: severityValue(severity) >= 4,
    constraints,
  });
  const actionId = stableHash([
    item.id || "",
    item.ruleId || "",
    item.projectId || "",
    item.detectedAt || "",
    item.updatedAt || "",
  ]).slice(0, 24);

  return {
    id: `tp_${actionId}`,
    type,
    title: clipText(item.title || "Acao recomendada", 120),
    summary: clipText(item.message || "Inconsistencia detectada no escopo.", 220),
    priorityScore: scoreResult.score,
    confidence,
    estimatedImpact: impact,
    evidence,
    why,
    recommendedNextStep: recommendedStepByType(type, severity),
    constraints,
    _internal: {
      severity,
      ruleId: safeText(item.ruleId),
      recurrenceCount,
      detectedAt: safeText(item.detectedAt),
      status: normalizeStatus(item.status),
      source: safeText(item.source),
      priorityBreakdown: scoreResult.breakdown,
    },
  };
}

function buildFallbackActionsFromEvents(events = [], context = {}) {
  return (Array.isArray(events) ? events : [])
    .filter((event) => event && event.signals && event.signals.isOpen)
    .map((event) => {
      const severity = normalizeSeverity(event.severity);
      const type = inferActionType(event);
      const scoreResult = computePriorityScore(
        {
          severity,
          status: event.status,
          detectedAt: event.eventTs || event.dueTs,
          recurrenceCount: 1,
          isCritical: Boolean(event.signals && event.signals.isCritical),
          riskScore: event.signals && event.signals.riskScore ? event.signals.riskScore : 0,
          openDays: event.signals && event.signals.openDays ? event.signals.openDays : 0,
        },
        { now: context.referenceDate }
      );
      const confidence = computeConfidence({
        severity,
        status: event.status,
        detectedAt: event.eventTs,
        projectId: event.projectId,
        eventIds: [event.eventId || event.id],
        evidence: [{ kind: "eventId", id: event.eventId || event.id, description: "Evento operacional aberto." }],
      });
      const impact = computeEstimatedImpact({
        priorityScore: scoreResult.score,
        recurrenceCount: 1,
        isCritical: Boolean(event.signals && event.signals.isCritical),
      });
      const constraints = inferConstraints(type, event);
      return {
        id: `tp_evt_${stableHash([event.eventId || event.id || "", event.projectId || "", event.source || ""]).slice(0, 20)}`,
        type,
        title: clipText(event.title || "Acao sugerida", 120),
        summary: clipText(`Evento aberto: ${event.title || event.eventId || "-"}`, 220),
        priorityScore: scoreResult.score,
        confidence,
        estimatedImpact: impact,
        evidence: [
          {
            kind: "eventId",
            id: String(event.eventId || event.id || ""),
            description: clipText(
              `${event.source || "origem"} | ${event.status || "status desconhecido"}`,
              160
            ),
          },
        ],
        why: [
          `Evento em aberto com score de risco ${Number(event.signals && event.signals.riskScore ? event.signals.riskScore : 0)}.`,
          "Fallback aplicado por ausência de inconsistências estruturadas no escopo.",
        ],
        recommendedNextStep: recommendedStepByType(type, severity),
        constraints,
        _internal: {
          severity,
          ruleId: "",
          recurrenceCount: 1,
          detectedAt: safeText(event.eventTs),
          status: normalizeStatus(event.status),
          source: safeText(event.source),
          priorityBreakdown: scoreResult.breakdown,
        },
      };
    });
}

function buildTurnPlan({ scope = {}, params = {}, options = {} }) {
  const referenceDate =
    options.referenceDate instanceof Date
      ? options.referenceDate
      : parseDate(params.date) || new Date();
  const date = parseDateOnly(params.date, parseDateOnly(referenceDate.toISOString()));
  const shift = normalizeShift(params.shift);
  const mode = normalizeMode(params.mode);
  const limit = clampInt(params.limit, TURN_PLAN_MAX_ACTIONS, 1, TURN_PLAN_MAX_ACTIONS);
  const page = clampInt(params.page, 1, 1, 1000);

  const events = Array.isArray(scope.events) ? scope.events : [];
  const inconsistencies = Array.isArray(scope.inconsistencies) ? scope.inconsistencies : [];
  const eventIndex = mapEventsById(events);

  let actions = inconsistencies
    .map((item) => buildActionFromInconsistency(item, eventIndex, { referenceDate }))
    .filter(Boolean);

  if (!actions.length) {
    actions = buildFallbackActionsFromEvents(events, { referenceDate });
  }

  actions = actions
    .map((action) => {
      const adjustedScore = clampInt(
        Math.round(action.priorityScore + modeScoreAdjustment(mode, action)),
        action.priorityScore,
        0,
        100
      );
      return {
        ...action,
        priorityScore: adjustedScore,
      };
    })
    .sort(compareActions);

  const totalActions = actions.length;
  const offset = (page - 1) * limit;
  const paged = actions.slice(offset, offset + limit).map((action) => {
    const { _internal, ...publicAction } = action;
    return publicAction;
  });

  const planId = stableHash([
    safeText(scope.scopeKey),
    safeText(scope.projectId || params.projectId),
    date,
    shift,
    mode,
    String(totalActions),
    ...actions.slice(0, 12).map((action) => safeText(action.id)),
  ]).slice(0, 24);

  return {
    planId: `turn_${planId}`,
    projectId: safeText(scope.projectId || params.projectId),
    date,
    shift,
    mode,
    generatedAt: new Date().toISOString(),
    pagination: {
      page,
      limit,
      totalItems: totalActions,
      totalPages: totalActions > 0 ? Math.ceil(totalActions / limit) : 1,
      hasNextPage: offset + limit < totalActions,
      hasPrevPage: page > 1,
    },
    actions: paged,
    _allActionsInternal: actions,
  };
}

module.exports = {
  TURN_PLAN_MAX_ACTIONS,
  normalizeMode,
  normalizeShift,
  buildTurnPlan,
};
