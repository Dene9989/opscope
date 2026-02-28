const { parseDate } = require("../normalize/keyResolver");
const { summarizeEvent, createInconsistency } = require("./rules.evidence");

const EVENT_RULES = [
  {
    id: "critical_open_overdue",
    kind: "event",
    severity: "critical",
    title: "Crítico aberto e fora da janela",
    evaluate(event) {
      const signals = event && event.signals ? event.signals : {};
      return Boolean(signals.isCritical && signals.isOpen && (signals.overdue || signals.openDays >= 1));
    },
    build(event) {
      const signals = event && event.signals ? event.signals : {};
      return createInconsistency({
        rule: this,
        message: `Evento crítico permanece aberto${signals.overdue ? " e vencido" : ""}: ${event.title}.`,
        source: event.source,
        projectId: event.projectId,
        eventIds: [event.eventId],
        evidence: [summarizeEvent(event)],
        metadata: {
          openDays: signals.openDays || 0,
          riskScore: signals.riskScore || 0,
        },
      });
    },
  },
  {
    id: "contingency_missing_root_cause",
    kind: "event",
    severity: "high",
    title: "Contingência sem causa raiz clara",
    evaluate(event) {
      const source = String(event.source || "");
      const signals = event && event.signals ? event.signals : {};
      const isContingency =
        source.includes("contingenc") ||
        source.includes("contingenc") ||
        String(event.eventType || "").toLowerCase().includes("falha");
      return Boolean(isContingency && signals.isOpen && !signals.hasRootCause);
    },
    build(event) {
      return createInconsistency({
        rule: this,
        message: `Registro de contingência sem causa raiz definida: ${event.title}.`,
        source: event.source,
        projectId: event.projectId,
        eventIds: [event.eventId],
        evidence: [summarizeEvent(event)],
      });
    },
  },
  {
    id: "pmp_without_procedure",
    kind: "event",
    severity: "medium",
    title: "Atividade PMP sem procedimento vinculado",
    evaluate(event) {
      const source = String(event.source || "");
      const isPmp = source.includes("pmp");
      const signals = event && event.signals ? event.signals : {};
      return Boolean(isPmp && signals.isOpen && !signals.hasProcedure);
    },
    build(event) {
      return createInconsistency({
        rule: this,
        message: `Atividade PMP sem procedimento técnico explícito: ${event.title}.`,
        source: event.source,
        projectId: event.projectId,
        eventIds: [event.eventId],
        evidence: [summarizeEvent(event)],
      });
    },
  },
  {
    id: "status_text_conflict",
    kind: "event",
    severity: "medium",
    title: "Conflito entre status e descrição",
    evaluate(event) {
      const text = String(event.searchText || "");
      const signals = event && event.signals ? event.signals : {};
      return Boolean(signals.isOpen && text.includes("conclu") && text.includes("pendent"));
    },
    build(event) {
      return createInconsistency({
        rule: this,
        message: `Descrição indica estados conflitantes (pendente/concluída): ${event.title}.`,
        source: event.source,
        projectId: event.projectId,
        eventIds: [event.eventId],
        evidence: [summarizeEvent(event)],
      });
    },
  },
  {
    id: "project_scope_mismatch",
    kind: "event",
    severity: "high",
    title: "Dado fora do escopo do projeto ativo",
    evaluate(event, context) {
      const scopeProject = String((context && context.projectId) || "").trim();
      const eventProject = String((event && event.projectId) || "").trim();
      if (!scopeProject || !eventProject) {
        return false;
      }
      return scopeProject !== eventProject;
    },
    build(event, context) {
      const scopeProject = String((context && context.projectId) || "").trim();
      return createInconsistency({
        rule: this,
        message: `Registro com projeto divergente. Escopo atual: ${scopeProject} | registro: ${event.projectId}.`,
        source: event.source,
        projectId: scopeProject,
        eventIds: [event.eventId],
        evidence: [summarizeEvent(event)],
      });
    },
  },
];

const AGGREGATE_RULES = [
  {
    id: "recurring_failure_same_asset_7d",
    kind: "aggregate",
    severity: "high",
    title: "Falha recorrente no mesmo ativo (7 dias)",
    evaluate(events, context) {
      const now = context && context.now instanceof Date ? context.now : new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const groups = new Map();
      events.forEach((event) => {
        if (!event || !event.asset) {
          return;
        }
        if (!(event.signals && event.signals.mentionsFailure)) {
          return;
        }
        const ts = parseDate(event.eventTs);
        if (!ts || ts < weekAgo || ts > now) {
          return;
        }
        const key = `${event.projectId || "_"}::${event.asset.toLowerCase()}`;
        if (!groups.has(key)) {
          groups.set(key, []);
        }
        groups.get(key).push(event);
      });

      const issues = [];
      groups.forEach((items) => {
        if (!Array.isArray(items) || items.length < 3) {
          return;
        }
        items.sort((a, b) => {
          const ad = parseDate(a.eventTs);
          const bd = parseDate(b.eventTs);
          return (bd ? bd.getTime() : 0) - (ad ? ad.getTime() : 0);
        });
        const newest = items[0];
        issues.push(
          createInconsistency({
            rule: this,
            message: `Ativo com ${items.length} ocorrências de falha nos últimos 7 dias: ${newest.asset}.`,
            source: newest.source,
            projectId: newest.projectId,
            eventIds: items.map((item) => item.eventId),
            evidence: items.slice(0, 5).map((item) => summarizeEvent(item)),
            metadata: {
              count: items.length,
              asset: newest.asset,
            },
          })
        );
      });
      return issues;
    },
  },
  {
    id: "open_risk_backlog_cluster",
    kind: "aggregate",
    severity: "medium",
    title: "Cluster de risco aberto",
    evaluate(events) {
      const riskyOpen = events.filter(
        (event) =>
          event &&
          event.signals &&
          event.signals.isOpen &&
          (event.signals.isCritical || event.signals.isHigh || event.signals.riskScore >= 45)
      );
      if (riskyOpen.length < 5) {
        return [];
      }
      const ordered = riskyOpen.slice().sort((a, b) => (a.signals.riskScore || 0) - (b.signals.riskScore || 0));
      const pivot = ordered[ordered.length - 1];
      return [
        createInconsistency({
          rule: this,
          message: `${riskyOpen.length} eventos de alto risco seguem abertos no período analisado.`,
          source: pivot ? pivot.source : "",
          projectId: pivot ? pivot.projectId : "",
          eventIds: riskyOpen.slice(0, 12).map((item) => item.eventId),
          evidence: riskyOpen.slice(0, 6).map((item) => summarizeEvent(item)),
          metadata: { openRiskCount: riskyOpen.length },
        }),
      ];
    },
  },
];

module.exports = {
  EVENT_RULES,
  AGGREGATE_RULES,
};

