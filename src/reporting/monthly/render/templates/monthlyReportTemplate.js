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
const { DailyRdoBlock } = require("../components/DailyRdoBlock");
const { ChartContainer } = require("../components/ChartContainer");
const { EmptyState } = require("../components/EmptyState");
const { Page } = require("../layout/page");
const { chunkArray } = require("../helpers/chunk");
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
    return EmptyState("Sem destaques executivos para o período.");
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

function renderOperationalTables(operational) {
  if (!operational) {
    return EmptyState("Sem dados operacionais.");
  }

  const tables = [
    renderSummaryTable("Distribuição por status", operational.byStatus, { maxRows: 10 }),
    renderSummaryTable("Distribuição por tipo", operational.byType, { maxRows: 12 }),
    renderSummaryTable("Distribuição por local", operational.byLocation, { maxRows: 12 }),
    renderSummaryTable("Distribuição por equipe", operational.byTeam, { maxRows: 12 }),
    renderSummaryTable("Distribuição por prioridade", operational.byPriority, { maxRows: 10 }),
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
  const tables = [
    renderSummaryTable("Status consolidados", consolidated.statusTable, { maxRows: 10 }),
    renderSummaryTable("Categorias consolidadas", consolidated.categoryTable, { maxRows: 12 }),
    renderSummaryTable("Locais consolidados", consolidated.locationTable, { maxRows: 12 }),
    renderSummaryTable("Equipes consolidadas", consolidated.teamTable, { maxRows: 12 }),
    renderSummaryTable("Prioridades consolidadas", consolidated.priorityTable, { maxRows: 10 }),
  ].filter(Boolean);

  if (!tables.length) {
    return EmptyState("Sem tabelas consolidadas para o período.");
  }
  return tables.join("");
}

function renderDailyAppendix(appendix) {
  if (!appendix || !appendix.dailyRdos || !appendix.dailyRdos.length) {
    return EmptyState(appendix && appendix.text ? appendix.text : "Sem RDOs disponíveis.");
  }
  const chunks = chunkArray(appendix.dailyRdos, 3);
  return chunks
    .map((chunk, idx) => {
      const content = chunk.map(DailyRdoBlock).join("");
      return `<div class="daily-rdo-page${idx > 0 ? " page-break" : ""}">${content}</div>`;
    })
    .join("");
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
  const appendix = viewModel.appendix;

  const primaryKpis = viewModel.kpis && viewModel.kpis.primaryCards ? viewModel.kpis.primaryCards : (viewModel.kpis ? viewModel.kpis.cards : []);
  const secondaryKpis = viewModel.kpis && viewModel.kpis.secondaryCards ? viewModel.kpis.secondaryCards : [];

  const page1 = Page(`
    ${header}
    ${metadata}
    ${banner}

    ${SectionHeader("Visão executiva", "Indicadores chave do período.")}
    ${renderKpiGrid(primaryKpis)}

    ${SectionHeader("Resumo executivo", "Síntese gerencial do período.")}
    <div class="executive-summary">
      <p>${escapeHtml(executiveSummary.text || "")}</p>
      ${executiveSummary.bullets && executiveSummary.bullets.length ? `<ul>${executiveSummary.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
    </div>
    ${renderHighlights(executiveSummary)}

    ${SectionHeader("Comparativo com período anterior", "Variações em relação ao mês anterior.")}
    ${renderComparison(viewModel.comparisonWithPreviousPeriod)}

    ${secondaryKpis.length ? SectionHeader("Indicadores complementares", "Apoio à leitura executiva.") : ""}
    ${secondaryKpis.length ? renderKpiGrid(secondaryKpis) : ""}
  `);

  const page2 = Page(`
    ${SectionHeader("Tendências e performance", trendAnalysis.text || "")}
    <div class="chart-grid">
      ${ChartContainer("Evolução semanal", "Planejadas vs executadas", chartIndex.weekly_planned_executed)}
      ${ChartContainer("Evolução de backlog", "Cumulativo no período", chartIndex.backlog_evolution)}
      ${ChartContainer("Distribuição por status", "Planejadas", chartIndex.status_distribution)}
      ${ChartContainer("SLA no prazo vs fora do prazo", "Percentual", chartIndex.sla_on_time)}
    </div>
    ${renderInsights(trendAnalysis)}
  `, { className: "page-break" });

  const page3 = Page(`
    ${SectionHeader("Análise operacional", operationalBreakdown.text || "")}
    <div class="chart-grid">
      ${ChartContainer("Distribuição por categoria", "Top categorias", chartIndex.category_distribution)}
      ${ChartContainer("Top locais", "Volume por local", chartIndex.top_locations)}
      ${ChartContainer("Criticidade por prioridade", "Distribuição", chartIndex.criticality_priority)}
    </div>
    ${renderOperationalTables(operationalBreakdown)}
  `, { className: "page-break" });

  const page4 = Page(`
    ${SectionHeader("Segurança, compliance e evidências", safetyCompliance.text || "")}
    ${ComplianceTable(safetyCompliance) || EmptyState("Sem dados de compliance.")}

    ${SectionHeader("Análise técnica", technicalHighlights.text || "")}
    ${technicalHighlights.bullets && technicalHighlights.bullets.length ? `<ul>${technicalHighlights.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : EmptyState(technicalHighlights.text)}

    ${SectionHeader("Riscos e recomendações", riskAssessment.text || "")}
    ${renderRisks(riskAssessment)}
    ${RecommendationList(recommendations) || EmptyState(recommendations.text)}

    ${SectionHeader("Backlog e justificativas", backlogDetails && backlogDetails.text ? backlogDetails.text : "")}
    ${BacklogTable(backlogDetails) || EmptyState("Sem backlog com justificativa registrada.")}

    ${SectionHeader("Plano de ação", actionPlan.text || "")}
    ${ActionTable(actionPlan) || EmptyState(actionPlan.text)}
  `, { className: "page-break" });

  const page5 = Page(`
    ${SectionHeader("Tabelas consolidadas", consolidatedTables.text || "")}
    ${renderConsolidatedTables(consolidatedTables)}

    ${SectionHeader("Anexo técnico diário", appendix.text || "")}
    ${renderDailyAppendix(appendix)}
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
