const { escapeHtml } = require("../helpers/escape");

function ReportHeader(header, meta) {
  const title = header && header.title ? escapeHtml(header.title) : "Relatório Mensal";
  const subtitle = header && header.subtitle ? escapeHtml(header.subtitle) : "";
  const periodLabel = header && header.periodLabel ? escapeHtml(header.periodLabel) : "";
  const emittedAtLabel = header && header.emittedAtLabel ? escapeHtml(header.emittedAtLabel) : "";
  const reportVersion = meta && meta.reportVersion ? escapeHtml(meta.reportVersion) : "";

  return `
    <header class="report-header">
      <div class="report-title">
        <h1>${title}</h1>
        ${subtitle ? `<p class="report-subtitle">${subtitle}</p>` : ""}
      </div>
      <div class="report-meta">
        ${periodLabel ? `<span><strong>Período:</strong> ${periodLabel}</span>` : ""}
        ${emittedAtLabel ? `<span><strong>Emissão:</strong> ${emittedAtLabel}</span>` : ""}
        ${reportVersion ? `<span><strong>Versão:</strong> ${reportVersion}</span>` : ""}
      </div>
    </header>
  `;
}

module.exports = { ReportHeader };
