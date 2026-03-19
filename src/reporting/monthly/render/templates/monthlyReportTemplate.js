const { ReportHeader } = require("../components/ReportHeader");
const { MetadataBar } = require("../components/MetadataBar");
const { WarningBanner } = require("../components/WarningBanner");
const { SectionHeader } = require("../components/SectionHeader");
const { KpiCard } = require("../components/KpiCard");
const { ComparisonCard } = require("../components/ComparisonCard");
const { InsightCard } = require("../components/InsightCard");
const { RiskCard } = require("../components/RiskCard");
const { RecommendationList } = require("../components/RecommendationList");
const { ActionTable } = require("../components/ActionTable");
const { renderSummaryTable } = require("../components/SummaryTable");
const { ComplianceTable } = require("../components/ComplianceTable");
const { BacklogTable } = require("../components/BacklogTable");
const { ContingencyTable } = require("../components/ContingencyTable");
const { EvidenceGallery } = require("../components/EvidenceGallery");
const { ChartContainer } = require("../components/ChartContainer");
const { EmptyState } = require("../components/EmptyState");
const { Page } = require("../layout/page");
const { escapeHtml } = require("../helpers/escape");

function renderKpiGrid(cards) {
  if (!cards || !cards.length) {
    return EmptyState("Sem KPIs disponíveis para o período.");
  }
  return `<div class="kpi-grid">${cards.map(KpiCard).join("")}</div>`;
}

function renderComparison(comparison) {
  if (!comparison || !comparison.available) {
    return EmptyState("Comparação indisponível para o período anterior.");
  }
  return `<div class="comparison-grid">${comparison.items.map(ComparisonCard).join("")}</div>`;
}

function renderInsights(trendAnalysis) {
  const insights = trendAnalysis && trendAnalysis.insights ? trendAnalysis.insights.slice(0, 6) : [];
  if (!insights.length) {
    return EmptyState("Sem insights relevantes para o período.");
  }
  return `<div class="insight-grid">${insights.map(InsightCard).join("")}</div>`;
}

function renderRisks(riskAssessment) {
  const risks = riskAssessment && riskAssessment.risks ? riskAssessment.risks.slice(0, 4) : [];
  if (!risks.length) {
    return EmptyState("Sem riscos relevantes identificados.");
  }
  return `<div class="risk-grid">${risks.map(RiskCard).join("")}</div>`;
}

function renderHighlights(executiveSummary) {
  const highlights = executiveSummary && executiveSummary.highlights ? executiveSummary.highlights : [];
  if (!highlights.length) {
    return EmptyState("Sem alertas críticos no período.");
  }
  return `
    <div class="highlight-grid">
      ${highlights
        .map((item) => `
          <div class="highlight-card${item.tone ? ` tone-${escapeHtml(item.tone)}` : ""}">
            <div class="highlight-title">${escapeHtml(item.title || "")}</div>
            <div class="highlight-text">${escapeHtml(item.text || "")}</div>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderNarrativeBlocks(blocks, className = "") {
  if (!blocks || !blocks.length) {
    return "";
  }
  const safeClass = className ? ` ${escapeHtml(className)}` : "";
  return `
    <div class="narrative-blocks${safeClass}">
      ${blocks
        .map((block) => `
          <div class="narrative-block">
            ${block.title ? `<div class="narrative-title">${escapeHtml(block.title)}</div>` : ""}
            ${block.text ? `<div class="narrative-text">${escapeHtml(block.text)}</div>` : ""}
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderExecutiveSummary(executiveSummary) {
  if (!executiveSummary) {
    return EmptyState("Sem resumo executivo para o período.");
  }
  const bullets = executiveSummary.bullets && executiveSummary.bullets.length
    ? `<ul>${executiveSummary.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
    : "";
  return `
    <div class="executive-summary">
      ${executiveSummary.title ? `<div class="executive-summary__title">${escapeHtml(executiveSummary.title)}</div>` : ""}
      ${renderNarrativeBlocks(executiveSummary.blocks)}
      ${bullets}
      ${executiveSummary.conclusion ? `<p class="executive-summary__conclusion">${escapeHtml(executiveSummary.conclusion)}</p>` : ""}
    </div>
  `;
}

function renderSectionNote(text) {
  if (!text) {
    return "";
  }
  return `<p class="section-note">${escapeHtml(text)}</p>`;
}

function renderBacklogReasons(backlogDetails) {
  const reasons = backlogDetails && backlogDetails.reasons ? backlogDetails.reasons : [];
  if (!reasons.length) {
    return EmptyState("Sem justificativas registradas para não execução no período.");
  }
  return `
    <div class="backlog-reasons">
      ${reasons
        .map((reason) => `
          <div class="backlog-reason">
            <span class="backlog-reason__label">${escapeHtml(reason.label || "")}</span>
            <span class="backlog-reason__value">${escapeHtml(String(reason.count || 0))}</span>
          </div>
        `)
        .join("")}
    </div>
  `;
}

function renderOperationalTables(operational) {
  if (!operational) {
    return EmptyState("Sem dados operacionais.");
  }

  const tables = [
    renderSummaryTable("Status no período (planejado + executado)", operational.byStatus, { maxRows: 10 }),
    renderSummaryTable("Planejado no mês por tipo", operational.byType, { maxRows: 12 }),
    renderSummaryTable("Planejado no mês por local", operational.byLocation, { maxRows: 12 }),
    renderSummaryTable("Planejado no mês por equipe", operational.byTeam, { maxRows: 12 }),
    renderSummaryTable("Planejado no mês por prioridade", operational.byPriority, { maxRows: 10 }),
  ].filter(Boolean);

  if (!tables.length) {
    return EmptyState("Sem tabelas operacionais para o período.");
  }
  return tables.join("");
}

function renderConsolidatedTables(consolidated) {
  if (!consolidated) {
    return EmptyState("Sem dados consolidados.");
  }
  const planned = consolidated.plannedTables || {};
  const executed = consolidated.executedTables || {};
  const blocks = [];

  blocks.push(renderSummaryTable("Status no período (planejado + executado)", consolidated.statusTable, { maxRows: 10 }));

  const plannedTables = [
    renderSummaryTable("Planejado no mês • Categorias", planned.categoryTable, { maxRows: 12 }),
    renderSummaryTable("Planejado no mês • Locais", planned.locationTable, { maxRows: 12 }),
    renderSummaryTable("Planejado no mês • Equipes", planned.teamTable, { maxRows: 12 }),
    renderSummaryTable("Planejado no mês • Prioridades", planned.priorityTable, { maxRows: 10 }),
  ].filter(Boolean);
  if (plannedTables.length) {
    blocks.push(`<div class="table-group-title">Planejamento do período</div>`);
    blocks.push(plannedTables.join(""));
  }

  const executedTables = [
    renderSummaryTable("Executado no mês • Categorias", executed.categoryTable, { maxRows: 12 }),
    renderSummaryTable("Executado no mês • Locais", executed.locationTable, { maxRows: 12 }),
    renderSummaryTable("Executado no mês • Equipes", executed.teamTable, { maxRows: 12 }),
    renderSummaryTable("Executado no mês • Prioridades", executed.priorityTable, { maxRows: 10 }),
  ].filter(Boolean);
  if (executedTables.length) {
    blocks.push(`<div class="table-group-title">Execução do período</div>`);
    blocks.push(executedTables.join(""));
  }

  const content = blocks.filter(Boolean).join("");
  if (!content) {
    return EmptyState("Sem tabelas consolidadas para o período.");
  }
  return content;
}

function buildChartIndex(charts) {
  return (charts || []).reduce((acc, chart) => {
    acc[chart.id] = chart;
    return acc;
  }, {});
}

function renderMonthlyReportTemplate(viewModel, charts) {
  if (!viewModel) {
    return "";
  }

  const chartIndex = buildChartIndex(charts);

  const header = ReportHeader(viewModel.header, viewModel.meta);
  const metadata = MetadataBar(viewModel.meta);
  const banner = WarningBanner(viewModel.meta);

  const executiveSummary = viewModel.executiveSummary;
  const trendAnalysis = viewModel.trendAnalysis;
  const operationalBreakdown = viewModel.operationalBreakdown;
  const safetyCompliance = viewModel.safetyCompliance;
  const technicalHighlights = viewModel.technicalHighlights;
  const riskAssessment = viewModel.riskAssessment;
  const recommendations = viewModel.recommendations;
  const actionPlan = viewModel.actionPlan;
  const consolidatedTables = viewModel.consolidatedTables;
  const backlogDetails = viewModel.backlogDetails;
  const contingencySummary = viewModel.contingencySummary;
  const evidenceGallery = viewModel.evidenceGallery;
  const hasEvidence = evidenceGallery && evidenceGallery.items && evidenceGallery.items.length;
  const hasTechnicalContent = technicalHighlights && (
    (technicalHighlights.blocks && technicalHighlights.blocks.length) ||
    (technicalHighlights.bullets && technicalHighlights.bullets.length)
  );

  const primaryKpis = viewModel.kpis && viewModel.kpis.primaryCards ? viewModel.kpis.primaryCards : (viewModel.kpis ? viewModel.kpis.cards : []);
  const secondaryKpis = viewModel.kpis && viewModel.kpis.secondaryCards ? viewModel.kpis.secondaryCards : [];
  const executiveHeadline = executiveSummary && executiveSummary.headline ? executiveSummary.headline : "";
  const executiveLead = executiveSummary && executiveSummary.lead ? executiveSummary.lead : "";

  const page1 = Page(`
    ${header}
    ${metadata}
    ${banner}

    ${executiveHeadline || executiveLead ? `
      <div class="hero">
        ${executiveHeadline ? `<div class="hero-headline">${escapeHtml(executiveHeadline)}</div>` : ""}
        ${executiveLead ? `<div class="hero-lead">${escapeHtml(executiveLead)}</div>` : ""}
      </div>
    ` : ""}

    ${SectionHeader("Visão executiva", "Síntese gerencial e indicadores críticos do período.")}
    ${renderKpiGrid(primaryKpis)}

    <div class="executive-grid">
      <div class="executive-main">
        ${renderExecutiveSummary(executiveSummary)}
      </div>
      <div class="executive-side">
        <div class="executive-side__title">Desvios e alertas</div>
        ${renderHighlights(executiveSummary)}
      </div>
    </div>

    ${SectionHeader("Comparativo com período anterior", "Variações em relação ao mês anterior.")}
    ${renderComparison(viewModel.comparisonWithPreviousPeriod)}

    ${secondaryKpis.length ? SectionHeader("Indicadores complementares", "Apoio à leitura executiva.") : ""}
    ${secondaryKpis.length ? renderKpiGrid(secondaryKpis) : ""}
  `);

  const page2 = Page(`
    ${SectionHeader("Tendências e performance", trendAnalysis.text || "")}
    <div class="chart-grid">
      ${ChartContainer((chartIndex.weekly_planned_executed && chartIndex.weekly_planned_executed.title) || "Ritmo semanal", (chartIndex.weekly_planned_executed && chartIndex.weekly_planned_executed.subtitle) || "", chartIndex.weekly_planned_executed)}
      ${ChartContainer((chartIndex.backlog_evolution && chartIndex.backlog_evolution.title) || "Backlog", (chartIndex.backlog_evolution && chartIndex.backlog_evolution.subtitle) || "", chartIndex.backlog_evolution)}
      ${ChartContainer((chartIndex.status_distribution && chartIndex.status_distribution.title) || "Status no período", (chartIndex.status_distribution && chartIndex.status_distribution.subtitle) || "", chartIndex.status_distribution)}
      ${ChartContainer((chartIndex.sla_on_time && chartIndex.sla_on_time.title) || "SLA", (chartIndex.sla_on_time && chartIndex.sla_on_time.subtitle) || "", chartIndex.sla_on_time)}
    </div>
    ${renderInsights(trendAnalysis)}
  `, { className: "page-break" });

  const page3 = Page(`
    ${SectionHeader("Análise operacional", operationalBreakdown.text || "")}
    <div class="chart-grid">
      ${ChartContainer((chartIndex.category_distribution && chartIndex.category_distribution.title) || "Categorias", (chartIndex.category_distribution && chartIndex.category_distribution.subtitle) || "", chartIndex.category_distribution)}
      ${ChartContainer((chartIndex.top_locations && chartIndex.top_locations.title) || "Locais", (chartIndex.top_locations && chartIndex.top_locations.subtitle) || "", chartIndex.top_locations)}
      ${ChartContainer((chartIndex.criticality_priority && chartIndex.criticality_priority.title) || "Prioridades", (chartIndex.criticality_priority && chartIndex.criticality_priority.subtitle) || "", chartIndex.criticality_priority)}
    </div>
    ${renderOperationalTables(operationalBreakdown)}
  `, { className: "page-break" });

  const page4 = Page(`
    ${SectionHeader("Segurança, compliance e evidências", safetyCompliance.text || "")}
    ${renderSectionNote(safetyCompliance.summary || "")}
    ${ComplianceTable(safetyCompliance) || EmptyState("Sem dados de compliance.")}

    ${SectionHeader("Análise técnica", technicalHighlights.text || "")}
    ${hasTechnicalContent
      ? `
        ${renderSectionNote(technicalHighlights.summary || "")}
        ${renderNarrativeBlocks(technicalHighlights.blocks)}
        ${technicalHighlights.bullets && technicalHighlights.bullets.length ? `<ul>${technicalHighlights.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      `
      : EmptyState(technicalHighlights.text)}

    ${SectionHeader("Contingências do período", "Resumo técnico-operacional das ocorrências do mês.")}
    ${renderSectionNote(contingencySummary && contingencySummary.text ? contingencySummary.text : "")}
    ${ContingencyTable(contingencySummary) || EmptyState("Sem contingências registradas no período.")}

    ${SectionHeader("Riscos e recomendações", riskAssessment.text || "")}
    ${renderSectionNote(riskAssessment.summary || "")}
    ${renderRisks(riskAssessment)}
    ${renderSectionNote(recommendations.text || "")}
    ${RecommendationList(recommendations) || EmptyState(recommendations.text)}

    ${SectionHeader("Backlog e justificativas", "")}
    ${renderSectionNote(backlogDetails && backlogDetails.text ? backlogDetails.text : "")}
    ${renderBacklogReasons(backlogDetails)}
    ${BacklogTable(backlogDetails) || EmptyState("Sem backlog com justificativa registrada.")}

    ${SectionHeader("Plano de ação", actionPlan.text || "")}
    ${ActionTable(actionPlan) || EmptyState(actionPlan.text)}
  `, { className: "page-break" });

  const evidenceSection = `
    ${SectionHeader("Evidências selecionadas", "Registro visual representativo das atividades executadas.")}
    ${renderSectionNote(evidenceGallery && evidenceGallery.text ? evidenceGallery.text : "")}
    ${EvidenceGallery(evidenceGallery) || EmptyState("Sem evidências visuais disponíveis para o período.")}
  `;

  const page5 = Page(`
    ${SectionHeader("Tabelas consolidadas", consolidatedTables.text || "")}
    ${renderConsolidatedTables(consolidatedTables)}
    ${hasEvidence ? evidenceSection : ""}
  `, { className: "page-break" });

  return `
    <article class="rdo-monthly">
      ${page1}
      ${page2}
      ${page3}
      ${page4}
      ${page5}
    </article>
  `;
}

module.exports = { renderMonthlyReportTemplate };
