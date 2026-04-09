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

function computeTypeRatios(breakdowns) {
  if (!breakdowns) {
    return {
      total: 0,
      preventiveCount: 0,
      correctiveCount: 0,
      preventivePct: 0,
      correctivePct: 0,
    };
  }
  const typeMap = breakdowns.byTypeExecuted && Object.keys(breakdowns.byTypeExecuted).length
    ? breakdowns.byTypeExecuted
    : breakdowns.byType || {};
  const total = Object.values(typeMap).reduce((acc, value) => acc + (Number(value) || 0), 0);
  const preventiveCount = sumByKeywords(typeMap, ["preventiva", "preditiva"]);
  const correctiveCount = sumByKeywords(typeMap, ["corretiva", "corretivo", "reparo"]);
  const preventivePct = total ? Math.round((preventiveCount / total) * 100) : 0;
  const correctivePct = total ? Math.round((correctiveCount / total) * 100) : 0;
  return {
    total,
    preventiveCount,
    correctiveCount,
    preventivePct,
    correctivePct,
  };
}

function buildKpiCard({ key, label, value, formatted, delta, deltaPct, tone, detail, status }) {
  return {
    key,
    label,
    value,
    formatted,
    delta,
    deltaPct,
    tone,
    detail,
    status,
  };
}

function computeExecutionRatio(metrics) {
  const planned = metrics.totalPlannedActivities || 0;
  const executed = metrics.totalExecutedActivities || 0;
  return planned ? Math.round((executed / planned) * 100) : 0;
}

function buildKpis({ metrics, comparison, breakdowns }) {
  if (!metrics) {
    return { cards: [] };
  }
  const executionRatioPct = computeExecutionRatio(metrics);
  const typeRatios = computeTypeRatios(breakdowns);
  const cards = [];
  const makeStatus = (ok, okLabel, badLabel, neutralLabel = "Informativo") => {
    if (ok === null || ok === undefined) {
      return { symbol: "", label: neutralLabel, tone: VIEWMODEL_TONE.NEUTRAL };
    }
    return ok
      ? { symbol: "", label: okLabel, tone: VIEWMODEL_TONE.POSITIVE }
      : { symbol: "", label: badLabel, tone: VIEWMODEL_TONE.WARNING };
  };
  const hasPlanned = metrics.totalPlannedActivities > 0;
  const hasExecuted = metrics.totalExecutedActivities > 0;

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
      detail: "Busca: volume planejado do mês. Soma: atividades com dueDate no período e status não cancelado. Base: programação mensal.",
      status: makeStatus(hasPlanned, "Programação ativa", "Sem programação"),
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
      detail: "Busca: entregas concluídas no mês. Soma: atividades com doneAt no período e status concluída. Base: execução real.",
      status: makeStatus(hasExecuted, "Execução registrada", "Sem execução"),
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
      detail: `Busca: aderência ao plano. Cálculo: executadas ÷ planejadas. Meta ≥ ${formatPercent(KPI_TARGETS.executionRatioPct)}.`,
      status: makeStatus(
        executionRatioPct >= KPI_TARGETS.executionRatioPct,
        "Dentro da meta",
        "Fora da meta"
      ),
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
      detail: "Busca: pendências do mês. Soma: atividades planejadas no período com status backlog. Meta = 0.",
      status: makeStatus(metrics.backlog === 0, "Controlado", "Acima do ideal"),
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
      detail: "Busca: atraso vencido. Soma: dueDate até fim do mês sem conclusão até a data de corte. Meta = 0.",
      status: makeStatus(metrics.overdue === 0, "Sem vencimentos", "Com vencimentos"),
    })
  );

  cards.push(
    buildKpiCard({
      key: "openIssues",
      label: "Intercorrências abertas",
      value: metrics.openIssues || 0,
      formatted: formatNumber(metrics.openIssues || 0),
      delta: byKey("openIssues")?.deltaFormatted,
      deltaPct: byKey("openIssues")?.deltaPctFormatted,
      tone: (metrics.openIssues || 0) > 0 ? VIEWMODEL_TONE.WARNING : VIEWMODEL_TONE.POSITIVE,
      detail: "Busca: intercorrências/falhas abertas (status aberta ou em tratativa). Soma: registros de anomalias não corrigidas no período. Meta = 0.",
      status: makeStatus((metrics.openIssues || 0) === 0, "Sem intercorrências", "Com intercorrências"),
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
      detail: `Busca: cumprimento de prazo. Base: concluídas no mês com dueDate. No prazo = doneAt ≤ dueDate; fora do prazo = 100% - no prazo. Meta ≥ ${formatPercent(KPI_TARGETS.slaOnTimePct)}.`,
      status: makeStatus(
        metrics.slaEligibleActivities > 0 ? metrics.slaOnTimePct >= KPI_TARGETS.slaOnTimePct : null,
        "Dentro da meta",
        "Fora da meta",
        "Sem base elegível"
      ),
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
      detail: `Busca: documentação correta. Cálculo: docs OK ÷ docs exigidos em atividades concluídas. Meta ≥ ${formatPercent(KPI_TARGETS.docsCompliancePct)}.`,
      status: makeStatus(
        metrics.docsRequired > 0 ? metrics.docsCompliancePct >= KPI_TARGETS.docsCompliancePct : null,
        "Dentro da meta",
        "Fora da meta",
        "Sem exigência"
      ),
    })
  );

  cards.push(
    buildKpiCard({
      key: "preventivePct",
      label: "Taxa preventiva/preditiva",
      value: typeRatios.preventivePct,
      formatted: typeRatios.total ? formatPercent(typeRatios.preventivePct) : "N/A",
      delta: "-",
      deltaPct: "-",
      tone: typeRatios.total
        ? typeRatios.preventivePct >= KPI_TARGETS.preventivePct
          ? VIEWMODEL_TONE.POSITIVE
          : VIEWMODEL_TONE.WARNING
        : VIEWMODEL_TONE.NEUTRAL,
      detail: `Busca: confiabilidade preventiva. Cálculo: preventivas/preditivas ÷ total executado no mês. Meta ≥ ${formatPercent(KPI_TARGETS.preventivePct)}.`,
      status: makeStatus(
        typeRatios.total ? typeRatios.preventivePct >= KPI_TARGETS.preventivePct : null,
        "Dentro da meta",
        "Abaixo da meta",
        "Sem base"
      ),
    })
  );

  cards.push(
    buildKpiCard({
      key: "correctivePct",
      label: "Taxa corretiva (paradas)",
      value: typeRatios.correctivePct,
      formatted: typeRatios.total ? formatPercent(typeRatios.correctivePct) : "N/A",
      delta: "-",
      deltaPct: "-",
      tone: typeRatios.total
        ? typeRatios.correctivePct <= KPI_TARGETS.correctivePctMax
          ? VIEWMODEL_TONE.POSITIVE
          : VIEWMODEL_TONE.WARNING
        : VIEWMODEL_TONE.NEUTRAL,
      detail: `Busca: exposição a corretivas. Cálculo: corretivas ÷ total executado no mês. Meta ≤ ${formatPercent(KPI_TARGETS.correctivePctMax)}.`,
      status: makeStatus(
        typeRatios.total ? typeRatios.correctivePct <= KPI_TARGETS.correctivePctMax : null,
        "Dentro da meta",
        "Acima da meta",
        "Sem base"
      ),
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
      detail: "Busca: esforço aplicado. Soma: duração registrada ou diferença entre início e fim das execuções no mês.",
      status: makeStatus(
        metrics.hoursExecuted > 0,
        "Registro presente",
        "Sem registro"
      ),
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
      detail: "Busca: rastreabilidade visual. Soma: evidências anexadas nas atividades concluídas e RDOs do mês.",
      status: makeStatus(
        metrics.evidenceCount > 0,
        "Com evidências",
        "Sem evidências"
      ),
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
    implicationText = `A predominância de ${typeLabel} reforça a disciplina preventiva; com pendências no período, manter equilíbrio entre frentes para preservar prazos.`;
  } else if (topType && topTypePct >= 35 && hasPressure) {
    implicationText = `A maior concentração em ${typeLabel} sinaliza foco operacional do período; acompanhar prazos e backlog de forma preventiva.`;
  } else if (topType && topTypePct >= 35) {
    implicationText = `A concentração em ${typeLabel} indica foco operacional do período, sem sinais de desequilíbrio relevante.`;
  }
  let strategyText = "";
  if (preventiveCount > 0) {
    strategyText = `Preventivas/preditivas representam ${formatPercent(preventivePct)} do esforço executado, fortalecendo confiabilidade.`;
  }
  if (correctiveCount > 0) {
    const correctiveText = correctivePct >= 30
      ? `Corretivas em ${formatPercent(correctivePct)} refletem demandas reativas; manter análise de causa raiz para reduzir recorrências.`
      : `Corretivas em ${formatPercent(correctivePct)} permaneceram em patamar controlado no período.`;
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
    "rec.corrective": "Engenharia de Confiabilidade",
    "rec.preventive": "Coordenação O&M",
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


function extractEvidenceSource(entry) {
  if (!entry || typeof entry !== "object") {
    return "";
  }
  let source =
    entry.dataUrl ||
    entry.url ||
    entry.src ||
    entry.preview ||
    entry.image ||
    entry.storagePath ||
    entry.filePath ||
    entry.path ||
    "";
  if (typeof source !== "string") {
    return "";
  }
  if (!source && entry.fileId) {
    source = `/api/files/${encodeURIComponent(entry.fileId)}/content`;
  }
  return source.trim();
}

function isImageSource(source, entry) {
  if (!source) {
    return false;
  }
  if (source.startsWith("data:image/")) {
    return true;
  }
  const mime = entry && (entry.mimeType || entry.mimetype || entry.contentType);
  if (mime && String(mime).toLowerCase().startsWith("image/")) {
    return true;
  }
  if (/\/api\/files\//i.test(source)) {
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
      return src && isImageSource(src, entry);
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

function normalizeMaintenanceGroupKey(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function resolveExecutionDurationHours(activity) {
  const raw = Number(activity && activity.executionDurationHours);
  if (Number.isFinite(raw) && raw > 0) {
    return raw;
  }
  const start = activity && activity.executionStartedAt instanceof Date ? activity.executionStartedAt : null;
  const end = activity && activity.executionFinishedAt instanceof Date ? activity.executionFinishedAt : null;
  if (!start || !end) {
    return null;
  }
  const diffMs = end.getTime() - start.getTime();
  if (!Number.isFinite(diffMs) || diffMs <= 0) {
    return null;
  }
  return diffMs / (1000 * 60 * 60);
}

function pickTopCategory(categoryCounts) {
  if (!categoryCounts || !categoryCounts.size) {
    return "-";
  }
  let selected = null;
  categoryCounts.forEach((count, label) => {
    if (!selected || count > selected.count || (count === selected.count && label < selected.label)) {
      selected = { label, count };
    }
  });
  return selected ? selected.label : "-";
}

function buildMaintenanceExecutionSummary(normalized) {
  if (!normalized || !normalized.currentPeriod || !normalized.currentPeriod.activities) {
    return { text: "Sem manutenções executadas no período.", rows: [] };
  }
  const period = normalized.currentPeriod.period || {};
  const executedSet = buildExecutedSet(normalized.currentPeriod.activities || [], period);
  if (!executedSet.length) {
    return { text: "Sem manutenções executadas no período.", rows: [] };
  }

  const groups = new Map();
  let missingDurations = 0;

  executedSet.forEach((activity) => {
    const title = String(activity.title || "").trim() || "(sem título)";
    const key = normalizeMaintenanceGroupKey(title) || title;
    if (!groups.has(key)) {
      groups.set(key, {
        title,
        count: 0,
        durationSum: 0,
        durationCount: 0,
        categoryCounts: new Map(),
      });
    }
    const group = groups.get(key);
    group.count += 1;

    const category = String(activity.category || "").trim();
    if (category) {
      group.categoryCounts.set(category, (group.categoryCounts.get(category) || 0) + 1);
    }

    const duration = resolveExecutionDurationHours(activity);
    if (Number.isFinite(duration)) {
      group.durationSum += duration;
      group.durationCount += 1;
    } else {
      missingDurations += 1;
    }
  });

  const rows = Array.from(groups.values())
    .map((group) => {
      const avg = group.durationCount ? group.durationSum / group.durationCount : null;
      return {
        title: group.title,
        category: pickTopCategory(group.categoryCounts),
        count: group.count,
        countLabel: formatNumber(group.count),
        avgDurationLabel: avg !== null ? formatHours(avg) : "--",
      };
    })
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.title.localeCompare(b.title);
    });

  const baseText = `Agrupamento por nome das manutenções executadas no mês. ${formatNumber(executedSet.length)} execuções no período.`;
  const text = missingDurations > 0
    ? `${baseText} ${formatNumber(missingDurations)} execuções sem duração registrada.`
    : baseText;

  return { text, rows };
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

const INTERCORRENCIA_STATUS_LABELS = {
  ABERTA: "Aberta",
  EM_TRATATIVA: "Em tratativa",
  CORRIGIDA: "Corrigida",
};

const INTERCORRENCIA_CRITICIDADE_LABELS = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
  CRITICA: "Crítica",
};

const INTERCORRENCIA_STATUS_ORDER = {
  ABERTA: 1,
  EM_TRATATIVA: 2,
  CORRIGIDA: 3,
};

const INTERCORRENCIA_CRITICIDADE_ORDER = {
  CRITICA: 1,
  ALTA: 2,
  MEDIA: 3,
  BAIXA: 4,
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

function isIssueOpen(issue) {
  if (!issue || typeof issue !== "object") {
    return false;
  }
  if (issue.status === "CORRIGIDA") {
    return false;
  }
  if (issue.correctedAt) {
    return false;
  }
  return true;
}

function buildIntercorrenciaSummary(normalized, timeZone) {
  if (!normalized || !normalized.currentPeriod || !Array.isArray(normalized.currentPeriod.activities)) {
    return { text: "Sem dados de intercorrências no período.", items: [], count: 0 };
  }
  const activities = normalized.currentPeriod.activities || [];
  const items = [];

  activities.forEach((activity) => {
    const issue = activity.issue;
    if (!issue || !isIssueOpen(issue)) {
      return;
    }
    const fotos = Array.isArray(issue.fotos) ? issue.fotos : [];
    const photos = fotos
      .map((entry) => {
        const src = extractEvidenceSource(entry);
        if (!src || !isImageSource(src, entry)) {
          return null;
        }
        const rawCaption = extractEvidenceCaption(entry);
        const caption = sanitizeEvidenceCaption(rawCaption, "Foto da anomalia");
        return { src, caption };
      })
      .filter(Boolean)
      .slice(0, 4);

    const statusKey = String(issue.status || "").toUpperCase() || "ABERTA";
    const criticidadeKey = String(issue.criticidade || "").toUpperCase() || "MEDIA";
    const registeredAt = issue.createdAt || issue.updatedAt || null;
    const registeredAtLabel = registeredAt ? formatDateTime(registeredAt, timeZone) : "-";

    const contextParts = [
      activity.location ? formatLabel(activity.location, "location") : "",
      activity.category ? formatLabel(activity.category, "category") : "",
      activity.priority ? formatLabel(activity.priority, "priority") : "",
    ].filter(Boolean);

    items.push({
      id: issue.id || activity.id,
      title: activity.title || "Intercorrência registrada",
      description: issue.descricao || "Descrição não informada.",
      action: issue.acaoImediata || "Ação imediata não registrada.",
      statusKey,
      statusLabel: INTERCORRENCIA_STATUS_LABELS[statusKey] || "Aberta",
      statusClass: statusKey.toLowerCase(),
      criticidadeKey,
      criticidadeLabel: INTERCORRENCIA_CRITICIDADE_LABELS[criticidadeKey] || "Média",
      criticidadeClass: criticidadeKey.toLowerCase(),
      registeredAtLabel,
      registeredAtValue: registeredAt ? registeredAt.getTime() : 0,
      context: contextParts.join(" • "),
      photos,
      forwardedNote: "Anomalia repassada ao cliente para decisão de intervenção.",
    });
  });

  if (!items.length) {
    return {
      text: "Sem intercorrências abertas no período. Ocorrências já corrigidas não foram incluídas.",
      items: [],
      count: 0,
    };
  }

  items.sort((a, b) => {
    const critA = INTERCORRENCIA_CRITICIDADE_ORDER[a.criticidadeKey] || 9;
    const critB = INTERCORRENCIA_CRITICIDADE_ORDER[b.criticidadeKey] || 9;
    if (critA !== critB) {
      return critA - critB;
    }
    const statusA = INTERCORRENCIA_STATUS_ORDER[a.statusKey] || 9;
    const statusB = INTERCORRENCIA_STATUS_ORDER[b.statusKey] || 9;
    if (statusA !== statusB) {
      return statusA - statusB;
    }
    return b.registeredAtValue - a.registeredAtValue;
  });

  const text =
    items.length === 1
      ? "1 intercorrência aberta registrada no período, com ação imediata e encaminhamento ao cliente."
      : `${formatNumber(items.length)} intercorrências abertas registradas no período, com ação imediata e encaminhamento ao cliente.`;

  return {
    text,
    items,
    count: items.length,
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
  const timeZone = (normalized && normalized.meta && normalized.meta.timezone) ||
    (aggregated.meta && aggregated.meta.timezone) ||
    "America/Sao_Paulo";

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
    breakdowns,
  });

  const technicalHighlights = buildTechnicalHighlights({ metrics, breakdowns });
  const safetyCompliance = buildSafetyCompliance({ metrics, integrityStatus });
  const riskAssessment = buildRiskAssessment({ metrics, integrityStatus, breakdowns });
  const recommendations = buildRecommendations({ metrics, breakdowns });
  const actionPlan = buildActionPlan({ recommendations });
  const backlogDetails = buildBacklogDetails(normalized);
  const contingencySummary = buildContingencySummary(normalized);
  const issueSummary = buildIntercorrenciaSummary(normalized, timeZone);

  const kpis = buildKpis({ metrics, comparison, breakdowns });
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
  const evidenceGallery = buildEvidenceGallery(normalized);
  const maintenanceSummary = buildMaintenanceExecutionSummary(normalized);

  return {
    meta: {
      projectId: aggregated.meta && aggregated.meta.projectId,
      projectName: aggregated.meta && aggregated.meta.projectName,
      clientName: aggregated.meta && aggregated.meta.clientName,
      plantName: aggregated.meta && aggregated.meta.plantName,
      period: { start: periodStart, end: periodEnd },
      emittedAt,
      emittedAtLabel: formatDateTime(emittedAt, timeZone),
      reportVersion: aggregated.meta && aggregated.meta.reportVersion,
      comparisonMode: aggregated.comparisonMode,
      integrityStatus,
      integritySummary,
      isPartial,
    },
    header: {
      title: "RELATÓRIO DE DESEMPENHO MENSAL - HV",
      subtitle: "",
      periodLabel: formatDateRange(periodStart, periodEnd, timeZone),
      emittedAtLabel: formatDateTime(emittedAt, timeZone),
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
    issueSummary,
    evidenceGallery,
    maintenanceSummary,
  };
}

module.exports = {
  buildMonthlyReportViewModel,
};
