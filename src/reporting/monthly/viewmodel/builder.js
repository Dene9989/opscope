const {
  formatNumber,
  formatPercent,
  formatHours,
  formatDateRange,
  formatDateTime,
  formatDateOnly,
} = require("./formatters");
const { buildComparison } = require("./comparison");
const { buildInsights } = require("./insights");
const { buildExecutedSet } = require("../metrics");
const {
  buildExecutiveSummary,
  buildTechnicalHighlights,
  buildRiskAssessment,
  buildRecommendations,
  buildSafetyCompliance,
} = require("./narratives");
const {
  fallbackTrendAnalysis,
  fallbackOperationalBreakdown,
  fallbackConsolidatedTables,
  fallbackAppendix,
  fallbackActionPlan,
} = require("./fallbacks");
const { KPI_TARGETS, VIEWMODEL_TONE } = require("./contracts");
const { formatLabel } = require("./labels");

function mapToTable(map, total, options = {}) {
  const entries = Object.entries(map || {});
  const sum = entries.reduce((acc, [, count]) => acc + (Number(count) || 0), 0);
  const base = Math.max(Number(total) || 0, sum || 0);
  const labelContext = options.labelContext || "";
  return entries
    .map(([label, count]) => {
      const safeCount = Number(count) || 0;
      const pct = base ? Math.round((safeCount / base) * 100) : 0;
      return {
        label: formatLabel(label, labelContext),
        count: safeCount,
        pct: Math.min(100, Math.max(0, pct)),
      };
    })
    .sort((a, b) => b.count - a.count);
}

function sumByKeywords(map, keywords) {
  if (!map || !keywords || !keywords.length) {
    return 0;
  }
  return Object.entries(map).reduce((acc, [key, value]) => {
    const label = String(key || "").toLowerCase();
    if (keywords.some((token) => label.includes(token))) {
      return acc + (Number(value) || 0);
    }
    return acc;
  }, 0);
}

function buildKpiCard({ key, label, value, formatted, delta, deltaPct, tone }) {
  return {
    key,
    label,
    value,
    formatted,
    delta,
    deltaPct,
    tone,
  };
}

function computeExecutionRatio(metrics) {
  const planned = metrics.totalPlannedActivities || 0;
  const executed = metrics.totalExecutedActivities || 0;
  return planned ? Math.round((executed / planned) * 100) : 0;
}

function buildKpis({ metrics, comparison }) {
  if (!metrics) {
    return { cards: [] };
  }
  const executionRatioPct = computeExecutionRatio(metrics);
  const cards = [];

  const byKey = (key) => comparison && comparison.available
    ? comparison.items.find((item) => item.key === key)
    : null;

  cards.push(
    buildKpiCard({
      key: "totalPlannedActivities",
      label: "Atividades planejadas no mês",
      value: metrics.totalPlannedActivities,
      formatted: formatNumber(metrics.totalPlannedActivities),
      delta: byKey("totalPlannedActivities")?.deltaFormatted,
      deltaPct: byKey("totalPlannedActivities")?.deltaPctFormatted,
      tone: VIEWMODEL_TONE.NEUTRAL,
    })
  );

  cards.push(
    buildKpiCard({
      key: "totalExecutedActivities",
      label: "Atividades executadas no mês",
      value: metrics.totalExecutedActivities,
      formatted: formatNumber(metrics.totalExecutedActivities),
      delta: byKey("totalExecutedActivities")?.deltaFormatted,
      deltaPct: byKey("totalExecutedActivities")?.deltaPctFormatted,
      tone: executionRatioPct >= KPI_TARGETS.executionRatioPct ? VIEWMODEL_TONE.POSITIVE : VIEWMODEL_TONE.WARNING,
    })
  );

  cards.push(
    buildKpiCard({
      key: "executionRatioPct",
      label: "Execução do plano",
      value: executionRatioPct,
      formatted: formatPercent(executionRatioPct),
      delta: "-",
      deltaPct: "-",
      tone: executionRatioPct >= KPI_TARGETS.executionRatioPct ? VIEWMODEL_TONE.POSITIVE : VIEWMODEL_TONE.WARNING,
    })
  );

  cards.push(
    buildKpiCard({
      key: "backlog",
      label: "Backlog",
      value: metrics.backlog,
      formatted: formatNumber(metrics.backlog),
      delta: byKey("backlog")?.deltaFormatted,
      deltaPct: byKey("backlog")?.deltaPctFormatted,
      tone: metrics.backlog > 0 ? VIEWMODEL_TONE.WARNING : VIEWMODEL_TONE.POSITIVE,
    })
  );

  cards.push(
    buildKpiCard({
      key: "overdue",
      label: "Vencidas",
      value: metrics.overdue,
      formatted: formatNumber(metrics.overdue),
      delta: byKey("overdue")?.deltaFormatted,
      deltaPct: byKey("overdue")?.deltaPctFormatted,
      tone: metrics.overdue > 0 ? VIEWMODEL_TONE.WARNING : VIEWMODEL_TONE.POSITIVE,
    })
  );

  cards.push(
    buildKpiCard({
      key: "slaOnTimePct",
      label: "SLA no prazo",
      value: metrics.slaOnTimePct,
      formatted: formatPercent(metrics.slaOnTimePct),
      delta: byKey("slaOnTimePct")?.deltaFormatted,
      deltaPct: byKey("slaOnTimePct")?.deltaPctFormatted,
      tone: metrics.slaOnTimePct >= KPI_TARGETS.slaOnTimePct ? VIEWMODEL_TONE.POSITIVE : VIEWMODEL_TONE.WARNING,
    })
  );

  cards.push(
    buildKpiCard({
      key: "docsCompliancePct",
      label: "Compliance documental",
      value: metrics.docsCompliancePct,
      formatted: formatPercent(metrics.docsCompliancePct),
      delta: byKey("docsCompliancePct")?.deltaFormatted,
      deltaPct: byKey("docsCompliancePct")?.deltaPctFormatted,
      tone: metrics.docsCompliancePct >= KPI_TARGETS.docsCompliancePct ? VIEWMODEL_TONE.POSITIVE : VIEWMODEL_TONE.WARNING,
    })
  );

  cards.push(
    buildKpiCard({
      key: "hoursExecuted",
      label: "Horas executadas",
      value: metrics.hoursExecuted,
      formatted: formatHours(metrics.hoursExecuted),
      delta: byKey("hoursExecuted")?.deltaFormatted,
      deltaPct: byKey("hoursExecuted")?.deltaPctFormatted,
      tone: VIEWMODEL_TONE.NEUTRAL,
    })
  );

  cards.push(
    buildKpiCard({
      key: "evidenceCount",
      label: "Evidências",
      value: metrics.evidenceCount,
      formatted: formatNumber(metrics.evidenceCount),
      delta: byKey("evidenceCount")?.deltaFormatted,
      deltaPct: byKey("evidenceCount")?.deltaPctFormatted,
      tone: VIEWMODEL_TONE.NEUTRAL,
    })
  );

  const primaryKeys = new Set([
    "totalPlannedActivities",
    "totalExecutedActivities",
    "executionRatioPct",
    "backlog",
    "overdue",
    "slaOnTimePct",
  ]);
  const primaryCards = cards.filter((card) => primaryKeys.has(card.key));
  const secondaryCards = cards.filter((card) => !primaryKeys.has(card.key));

  return {
    cards,
    primaryCards,
    secondaryCards,
  };
}

function buildTrendAnalysis({ breakdowns, insights }) {
  if (!breakdowns || !breakdowns.byWeek || !breakdowns.byWeek.length) {
    return fallbackTrendAnalysis("Sem dados de tendência semanal.");
  }
  const weekly = breakdowns.byWeek;
  const plannedTotal = weekly.reduce((acc, bucket) => acc + (bucket.planned || 0), 0);
  const executedTotal = weekly.reduce((acc, bucket) => acc + (bucket.executed || 0), 0);
  const ratio = plannedTotal ? Math.round((executedTotal / plannedTotal) * 100) : 0;

  const peakPlanned = weekly.reduce((acc, bucket) => (bucket.planned || 0) > (acc.planned || 0) ? bucket : acc, weekly[0]);
  const peakBacklog = weekly.reduce((acc, bucket) => (bucket.backlog || 0) > (acc.backlog || 0) ? bucket : acc, weekly[0]);

  const textParts = [];
  textParts.push(
    `A série semanal mostra ${ratio >= KPI_TARGETS.executionRatioPct ? "aderência" : "desvio"} entre planejamento e execução, com ${formatPercent(ratio)} do plano entregue no mês.`
  );
  if (peakPlanned && peakPlanned.planned) {
    textParts.push(`Pico de programação em S${peakPlanned.weekIndex} (${formatNumber(peakPlanned.planned)} atividades).`);
  }
  if (peakBacklog && peakBacklog.backlog) {
    textParts.push(`Backlog máximo em S${peakBacklog.weekIndex} (${formatNumber(peakBacklog.backlog)}).`);
  }
  if (insights && insights.length) {
    textParts.push("Os insights abaixo destacam pontos de atenção e estabilidade do período.");
  }
  return {
    text: textParts.join(" "),
    weekly: weekly.map((bucket) => ({
      weekIndex: bucket.weekIndex,
      start: bucket.start,
      end: bucket.end,
      planned: bucket.planned,
      executed: bucket.executed,
      backlog: bucket.backlog,
    })),
    insights,
  };
}

function buildOperationalBreakdown({ breakdowns, totalPlanned, totalPeriod, metrics }) {
  if (!breakdowns) {
    return fallbackOperationalBreakdown("Sem dados de distribuição operacional.");
  }
  const topType = Object.entries(breakdowns.byType || {}).sort((a, b) => b[1] - a[1])[0];
  const topTeam = Object.entries(breakdowns.byTeam || {}).sort((a, b) => b[1] - a[1])[0];
  const topPriority = Object.entries(breakdowns.byPriority || {}).sort((a, b) => b[1] - a[1])[0];
  const locationCount = Object.keys(breakdowns.byLocation || {}).filter((key) => (breakdowns.byLocation[key] || 0) > 0).length;
  const typeMap = breakdowns.byTypeExecuted && Object.keys(breakdowns.byTypeExecuted).length
    ? breakdowns.byTypeExecuted
    : breakdowns.byType || {};
  const totalTypeCount = Object.values(typeMap).reduce((acc, value) => acc + (Number(value) || 0), 0);
  const preventiveCount = sumByKeywords(typeMap, ["preventiva", "preditiva"]);
  const correctiveCount = sumByKeywords(typeMap, ["corretiva", "corretivo", "reparo"]);
  const preventivePct = totalTypeCount ? Math.round((preventiveCount / totalTypeCount) * 100) : 0;
  const correctivePct = totalTypeCount ? Math.round((correctiveCount / totalTypeCount) * 100) : 0;

  const concentrationParts = [];
  if (topType) {
    concentrationParts.push(`categoria ${formatLabel(topType[0], "category")}`);
  }
  if (topTeam) {
    concentrationParts.push(`equipe ${formatLabel(topTeam[0], "team")}`);
  }

  const priorityText = topPriority ? `Prioridade mais frequente: ${formatLabel(topPriority[0], "priority")}.` : "";
  const concentrationText = concentrationParts.length
    ? `A operação concentrou-se em ${concentrationParts.join(", ")}.`
    : "A distribuição operacional foi homogênea no período.";
  const topTypePct = topType && totalPlanned ? Math.round((topType[1] / totalPlanned) * 100) : 0;
  const hasPressure = metrics ? metrics.backlog > 0 || metrics.overdue > 0 : false;
  const typeLabel = topType ? formatLabel(topType[0], "category") : "";
  const typeKey = typeLabel.toLowerCase();
  const isPreventiveFocus = typeKey.includes("preventiva") || typeKey.includes("preditiva");
  let implicationText = "A distribuição por categoria está coerente com o perfil do período.";
  if (topType && isPreventiveFocus && !hasPressure) {
    implicationText = `A predominância de ${typeLabel} reforça a estratégia de confiabilidade e disciplina operacional.`;
  } else if (topType && isPreventiveFocus && hasPressure) {
    implicationText = `A predominância de ${typeLabel} ocorreu com pressão de pendências; recomenda-se balancear corretivas sem perder a rotina preventiva.`;
  } else if (topType && topTypePct >= 35 && hasPressure) {
    implicationText = `A maior concentração em ${typeLabel} sinaliza foco operacional do período; acompanhar impacto em prazos e backlog.`;
  } else if (topType && topTypePct >= 35) {
    implicationText = `A concentração em ${typeLabel} indica foco operacional do período, sem sinais de desequilíbrio relevante.`;
  }
  let strategyText = "";
  if (preventiveCount > 0) {
    strategyText = `Preventivas/preditivas representam ${formatPercent(preventivePct)} do esforço executado, fortalecendo confiabilidade.`;
  }
  if (correctiveCount > 0) {
    const correctiveText = correctivePct >= 30
      ? `Corretivas em ${formatPercent(correctivePct)} indicam falhas que exigem parada; priorizar redução de recorrência.`
      : `Corretivas em ${formatPercent(correctivePct)} seguem como resposta reativa pontual no período.`;
    strategyText = strategyText ? `${strategyText} ${correctiveText}` : correctiveText;
  }
  const locationText = locationCount
    ? `Abrangência operacional em ${formatNumber(locationCount)} locais do projeto.`
    : "";

  return {
    text: `Distribuição operacional do período (planejado vs execução). ${concentrationText} ${implicationText} ${strategyText} ${priorityText} ${locationText}`.trim(),
    byStatus: mapToTable(breakdowns.byStatus, totalPeriod || totalPlanned, { labelContext: "status" }),
    byType: mapToTable(breakdowns.byType, totalPlanned, { labelContext: "category" }),
    byLocation: mapToTable(breakdowns.byLocation, totalPlanned, { labelContext: "location" }),
    byTeam: mapToTable(breakdowns.byTeam, totalPlanned, { labelContext: "team" }),
    byPriority: mapToTable(breakdowns.byPriority, totalPlanned, { labelContext: "priority" }),
  };
}

function buildActionPlan({ recommendations }) {
  if (!recommendations || !recommendations.items || !recommendations.items.length) {
    return fallbackActionPlan("Sem ações recomendadas para o período.");
  }
  const ownerByRec = {
    "rec.backlog": "Coordenação O&M",
    "rec.overdue": "Planejamento Operacional",
    "rec.sla": "Gestão de Contrato",
    "rec.docs": "Qualidade/Compliance",
  };
  const items = recommendations.items.map((rec, index) => ({
    id: `action.${index + 1}`,
    source: rec.id,
    text: rec.text,
    owner: ownerByRec[rec.id] || "Coordenação O&M",
    due: "Próximo ciclo",
    status: "Prioritária",
  }));
  return {
    text: "Plano de ação priorizado para endereçar os principais desvios do período.",
    items,
  };
}

function buildConsolidatedTables({ breakdowns, totalPlanned, totalExecuted, totalPeriod }) {
  if (!breakdowns) {
    return fallbackConsolidatedTables("Sem dados consolidados.");
  }
  return {
    text: "Tabelas consolidadas com separação entre planejado (dueDate) e executado (doneAt) no mês.",
    statusTable: mapToTable(breakdowns.byStatus, totalPeriod || totalPlanned, { labelContext: "status" }),
    plannedTables: {
      categoryTable: mapToTable(breakdowns.byType, totalPlanned, { labelContext: "category" }),
      locationTable: mapToTable(breakdowns.byLocation, totalPlanned, { labelContext: "location" }),
      teamTable: mapToTable(breakdowns.byTeam, totalPlanned, { labelContext: "team" }),
      priorityTable: mapToTable(breakdowns.byPriority, totalPlanned, { labelContext: "priority" }),
    },
    executedTables: {
      categoryTable: mapToTable(breakdowns.byTypeExecuted, totalExecuted, { labelContext: "category" }),
      locationTable: mapToTable(breakdowns.byLocationExecuted, totalExecuted, { labelContext: "location" }),
      teamTable: mapToTable(breakdowns.byTeamExecuted, totalExecuted, { labelContext: "team" }),
      priorityTable: mapToTable(breakdowns.byPriorityExecuted, totalExecuted, { labelContext: "priority" }),
    },
  };
}

function buildAppendix(normalized) {
  if (!normalized || !normalized.currentPeriod || !normalized.currentPeriod.rdos) {
    return fallbackAppendix("Sem RDOs normalizados para o período.");
  }
  const dailyRdos = normalized.currentPeriod.rdos.map((rdo) => ({
    id: rdo.id,
    rdoDate: rdo.rdoDateIso ? formatDateOnly(rdo.rdoDateIso) : "",
    createdAt: rdo.createdAtIso ? formatDateTime(rdo.createdAtIso) : "",
    createdBy: rdo.createdBy,
    metrics: rdo.metrics,
    evidenceCount: rdo.evidenciasTotal || (Array.isArray(rdo.evidencias) ? rdo.evidencias.length : 0),
    metricsSummary: (() => {
      const parts = [];
      if (rdo.metrics && Number(rdo.metrics.total)) {
        parts.push(`Total ${formatNumber(rdo.metrics.total)}`);
      }
      if (rdo.metrics && Number(rdo.metrics.concluidas)) {
        parts.push(`Concluídas ${formatNumber(rdo.metrics.concluidas)}`);
      }
      if (rdo.metrics && Number(rdo.metrics.emExecucao)) {
        parts.push(`Em execução ${formatNumber(rdo.metrics.emExecucao)}`);
      }
      if (rdo.metrics && Number(rdo.metrics.criticas)) {
        parts.push(`Críticas ${formatNumber(rdo.metrics.criticas)}`);
      }
      return parts.join(" • ");
    })(),
  }));

  if (!dailyRdos.length) {
    return fallbackAppendix("Sem RDOs disponíveis para o período.");
  }

  return {
    text: "Consolidação diária dos RDOs emitidos no período, com evidências e resumo técnico.",
    dailyRdos,
  };
}

function extractEvidenceSource(entry) {
  if (!entry || typeof entry !== "object") {
    return "";
  }
  let source = entry.dataUrl || entry.url || entry.src || entry.preview || entry.image || entry.storagePath || "";
  if (typeof source !== "string") {
    return "";
  }
  if (!source && entry.fileId) {
    source = `/api/files/${encodeURIComponent(entry.fileId)}/content`;
  }
  return source.trim();
}

function isImageSource(source) {
  if (!source) {
    return false;
  }
  if (source.startsWith("data:image/")) {
    return true;
  }
  return /\.(png|jpe?g|gif|webp)$/i.test(source);
}

function extractEvidenceCaption(entry) {
  if (!entry || typeof entry !== "object") {
    return "";
  }
  const caption =
    entry.descricao ||
    entry.titulo ||
    entry.nome ||
    entry.label ||
    entry.tipo ||
    "";
  return String(caption || "").trim();
}

function sanitizeEvidenceCaption(raw, fallbackLabel) {
  const text = String(raw || "")
    .replace(/\.(png|jpe?g|gif|webp)$/i, "")
    .replace(/whatsapp image.*$/i, "")
    .replace(/imagem do whatsapp.*$/i, "")
    .trim();
  if (!text || text.length < 4 || /^img[_-]?\d+/i.test(text)) {
    return fallbackLabel || "";
  }
  return text;
}

function buildEvidenceGallery(normalized) {
  if (!normalized || !normalized.currentPeriod || !normalized.currentPeriod.activities) {
    return { text: "Sem evidências visuais no período.", items: [] };
  }
  const period = normalized.currentPeriod.period || {};
  const executedSet = buildExecutedSet(normalized.currentPeriod.activities || [], period);
  const items = [];
  let missingEvidence = 0;

  executedSet.forEach((activity) => {
    const evidences = Array.isArray(activity.evidences) ? activity.evidences : [];
    const evidence = evidences.find((entry) => {
      const src = extractEvidenceSource(entry);
      return src && isImageSource(src);
    });
    if (!evidence) {
      missingEvidence += 1;
      return;
    }
    const src = extractEvidenceSource(evidence);
    const rawCaption = extractEvidenceCaption(evidence);
    const fallbackLabel = activity.title || "Evidência da atividade";
    const caption = sanitizeEvidenceCaption(rawCaption, fallbackLabel);
    const context = activity.doneAt ? formatDateOnly(activity.doneAt) : activity.dueDate ? formatDateOnly(activity.dueDate) : "";
    items.push({
      src,
      caption,
      context,
      activityId: activity.id,
      activityTitle: activity.title,
    });
  });

  if (!items.length) {
    return {
      text: "Sem evidências visuais incorporadas no período. Evidências registradas permanecem disponíveis no sistema.",
      items: [],
    };
  }

  const baseText = `Evidências com pelo menos 1 foto por atividade executada (${formatNumber(items.length)} atividades).`;
  const text = missingEvidence > 0
    ? `${baseText} ${formatNumber(missingEvidence)} atividades concluídas sem evidência registrada.`
    : baseText;

  return {
    text,
    items,
  };
}

function normalizeJustification(reason) {
  const text = String(reason || "").replace(/\s+/g, " ").trim();
  if (!text) {
    return "Ausência de justificativa registrada.";
  }
  const normalized = text[0].toUpperCase() + text.slice(1);
  return normalized.endsWith(".") ? normalized : `${normalized}.`;
}

function classifyBacklogReason(text) {
  const normalized = String(text || "").toLowerCase();
  if (!normalized) {
    return "Ausência de justificativa registrada";
  }
  const rules = [
    { label: "Reprogramação operacional", keys: ["reprogram", "janela", "agenda", "calendario", "remarc"] },
    { label: "Indisponibilidade de janela", keys: ["indispon", "janela", "restricao", "clima"] },
    { label: "Dependência externa", keys: ["depend", "terceir", "cliente", "fornecedor", "extern"] },
    { label: "Restrição de acesso/liberação", keys: ["acesso", "liber", "bloque", "permissa", "seguranca"] },
    { label: "Pendência documental", keys: ["document", "os", "apr", "pte", "pt", "laudo"] },
    { label: "Contingência prioritária", keys: ["prior", "emerg", "crit", "conting"] },
  ];
  const match = rules.find((rule) => rule.keys.some((key) => normalized.includes(key)));
  return match ? match.label : "Outros fatores operacionais";
}

function buildBacklogReasonSummary(items) {
  const counts = new Map();
  items.forEach((item) => {
    const label = classifyBacklogReason(item.reasonRaw);
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function buildBacklogDetails(normalized) {
  if (!normalized || !normalized.currentPeriod || !normalized.currentPeriod.activities) {
    return { text: "Sem dados de backlog para o período.", items: [] };
  }
  const period = normalized.currentPeriod.period || {};
  const start = period.start;
  const end = period.end;
  const activities = normalized.currentPeriod.activities || [];
  const items = activities
    .filter((activity) => activity.status === "backlog" && activity.dueDate && start && end && activity.dueDate >= start && activity.dueDate <= end)
    .sort((a, b) => (a.dueDate && b.dueDate ? a.dueDate - b.dueDate : 0))
    .map((activity) => ({
      id: activity.id,
      title: activity.title,
      dueDateLabel: formatDateOnly(activity.dueDate),
      location: activity.location || "-",
      responsible: activity.responsible || "-",
      reasonRaw: activity.backlogReason || "",
      reason: normalizeJustification(activity.backlogReason),
    }));

  const pendingForReasons = activities
    .filter((activity) => activity.dueDate && start && end && activity.dueDate >= start && activity.dueDate <= end)
    .filter((activity) => activity.status !== "concluida" && activity.status !== "cancelada")
    .map((activity) => ({
      reasonRaw: activity.backlogReason || activity.cancelReason || "",
    }));

  const reasons = buildBacklogReasonSummary(pendingForReasons);
  const reasonText = reasons.length
    ? "Motivos consolidados de não execução e backlog, agrupados por tema operacional."
    : "Não há justificativas registradas para não execução no período.";

  if (!items.length) {
    return { text: "Sem backlog com vencimento no período.", items: [], reasons };
  }
  return {
    text: reasonText,
    items,
    reasons,
  };
}

const CONTINGENCY_EVENT_LABELS = {
  DESARME: "Desarme",
  TRIP: "Trip",
  FALHA_FECHAMENTO: "Falha de fechamento",
  FALHA_COMANDO: "Falha de comando",
  PERDA_REDUNDANCIA: "Perda de redundância",
  FALHA_COMUNICACAO: "Falha de comunicação",
  OUTRO: "Outro",
};

const CONTINGENCY_STATUS_LABELS = {
  DRAFT: "Rascunho",
  IN_ANALYSIS: "Em análise",
  NORMALIZED: "Normalizada",
  CLOSED: "Encerrada",
  REOPENED: "Reaberta",
};

const CONTINGENCY_SYSTEM_CONDITION_LABELS = {
  NORMAL: "Normal",
  DEGRADED: "Degradada",
  RESTRICTED: "Restrita",
  UNAVAILABLE: "Indisponível",
};

function formatContingencyLabel(map, value, fallback) {
  const key = String(value || "").trim().toUpperCase();
  return map[key] || fallback || key || "-";
}

function buildContingencySummary(normalized) {
  if (!normalized || !normalized.currentPeriod || !Array.isArray(normalized.currentPeriod.contingencies)) {
    return { text: "Sem dados de contingências no período.", items: [], count: 0 };
  }
  const list = normalized.currentPeriod.contingencies;
  if (!list.length) {
    return { text: "Sem contingências registradas no período.", items: [], count: 0 };
  }
  const items = list
    .map((item) => {
      const eventLabel = formatContingencyLabel(CONTINGENCY_EVENT_LABELS, item.eventType, "Outro");
      const statusLabel = formatContingencyLabel(CONTINGENCY_STATUS_LABELS, item.status, "Rascunho");
      const systemLabel = formatContingencyLabel(
        CONTINGENCY_SYSTEM_CONDITION_LABELS,
        item.systemCondition,
        ""
      );
      const asset = item.assetName ? item.assetName : item.substation ? item.substation : "";
      const titleParts = [eventLabel, asset].filter(Boolean);
      const title = titleParts.join(" • ");
      const impact = item.impactDescription || systemLabel || "Sem impacto registrado";
      const response = item.containmentActions || item.engineeringConclusion || "Resposta operacional não informada";
      return {
        id: item.id,
        code: item.code || item.id,
        title,
        startAtLabel: item.startAt ? formatDateTime(item.startAt) : "-",
        severityLabel: item.severity || "-",
        statusLabel,
        impact,
        response,
      };
    })
    .slice(0, 8);

  const text =
    list.length === 1
      ? "1 contingência registrada no período, com síntese técnica e impacto operacional abaixo."
      : `${formatNumber(list.length)} contingências registradas no período, consolidadas com síntese técnica e impacto operacional.`;

  return {
    text,
    items,
    count: list.length,
  };
}

function buildMonthlyReportViewModel({ aggregated, validation, normalized, options = {} } = {}) {
  if (!aggregated || !aggregated.current) {
    return null;
  }
  const current = aggregated.current;
  const metrics = current.metrics;
  const breakdowns = current.breakdowns;
  const integrityStatus = validation && validation.integrityStatus ? validation.integrityStatus : "ok";
  const integritySummary = validation && validation.summary ? validation.summary : { blockers: 0, warnings: 0, infos: 0 };

  const emittedAt = aggregated.meta && aggregated.meta.emittedAt;
  const periodStart = current.period && current.period.startIso;
  const periodEnd = current.period && current.period.endIso;

  const emittedAtDate = emittedAt ? new Date(emittedAt) : null;
  const periodEndDate = periodEnd ? new Date(`${periodEnd}T23:59:59.999`) : null;
  const isPartialByDate = emittedAtDate && periodEndDate ? emittedAtDate.getTime() < periodEndDate.getTime() : false;

  const isPartial = Boolean(
    options.isPartial ||
    isPartialByDate ||
    (validation && validation.issues && validation.issues.some((issue) => issue.code === "business.partial_missing_flag"))
  );

  const comparison = buildComparison(aggregated);
  const insights = buildInsights({ aggregated, comparison, integrityStatus });

  const executiveSummary = buildExecutiveSummary({
    metrics,
    comparison,
    integrityStatus,
    isPartial,
  });

  const technicalHighlights = buildTechnicalHighlights({ metrics, breakdowns });
  const safetyCompliance = buildSafetyCompliance({ metrics, integrityStatus });
  const riskAssessment = buildRiskAssessment({ metrics, integrityStatus });
  const recommendations = buildRecommendations({ metrics });
  const actionPlan = buildActionPlan({ recommendations });
  const backlogDetails = buildBacklogDetails(normalized);
  const contingencySummary = buildContingencySummary(normalized);

  const kpis = buildKpis({ metrics, comparison });
  const trendAnalysis = buildTrendAnalysis({ breakdowns, insights });
  const totalPeriod = current && current.activityCounts ? current.activityCounts.totalActivitiesInSlice : metrics.totalPlannedActivities;
  const operationalBreakdown = buildOperationalBreakdown({
    breakdowns,
    totalPlanned: metrics.totalPlannedActivities,
    totalPeriod,
    metrics,
  });
  const consolidatedTables = buildConsolidatedTables({
    breakdowns,
    totalPlanned: metrics.totalPlannedActivities,
    totalExecuted: metrics.totalExecutedActivities,
    totalPeriod,
  });
  const appendix = buildAppendix(normalized);
  const evidenceGallery = buildEvidenceGallery(normalized);

  return {
    meta: {
      projectId: aggregated.meta && aggregated.meta.projectId,
      projectName: aggregated.meta && aggregated.meta.projectName,
      clientName: aggregated.meta && aggregated.meta.clientName,
      plantName: aggregated.meta && aggregated.meta.plantName,
      period: { start: periodStart, end: periodEnd },
      emittedAt,
      emittedAtLabel: formatDateTime(emittedAt),
      reportVersion: aggregated.meta && aggregated.meta.reportVersion,
      comparisonMode: aggregated.comparisonMode,
      integrityStatus,
      integritySummary,
      isPartial,
    },
    header: {
      title: "RELATÓRIO DE DESEMPENHO MENSAL - HV",
      subtitle: "",
      periodLabel: formatDateRange(periodStart, periodEnd),
      emittedAtLabel: formatDateTime(emittedAt),
      integrityStatus,
    },
    executiveSummary,
    kpis,
    comparisonWithPreviousPeriod: comparison,
    trendAnalysis,
    operationalBreakdown,
    safetyCompliance,
    technicalHighlights,
    riskAssessment,
    recommendations,
    actionPlan,
    consolidatedTables,
    backlogDetails,
    contingencySummary,
    appendix,
    evidenceGallery,
  };
}

module.exports = {
  buildMonthlyReportViewModel,
};
