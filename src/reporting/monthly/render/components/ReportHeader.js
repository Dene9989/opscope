const { escapeHtml } = require("../helpers/escape");
const { getAssetDataUri } = require("../helpers/assets");

function ReportHeader(header, meta) {
  const title = header && header.title ? escapeHtml(header.title) : "Relatório Mensal";
  const subtitle = header && header.subtitle ? escapeHtml(header.subtitle) : "";
  const periodLabel = header && header.periodLabel ? escapeHtml(header.periodLabel) : "";
  const emittedAtLabel = header && header.emittedAtLabel ? escapeHtml(header.emittedAtLabel) : "";
  const reportVersion = meta && meta.reportVersion ? escapeHtml(meta.reportVersion) : "";
  const opscopeLogo = getAssetDataUri("assets/img/opscope-logo.png");
  const engelmigLogo = getAssetDataUri("assets/engelmig-logo.png");

  return `
    <header class="report-header">
      <div class="report-header__row">
        <div class="report-logos">
          ${opscopeLogo ? `<img class="report-logo report-logo--opscope" src="${opscopeLogo}" alt="OPSCOPE" />` : ""}
          ${engelmigLogo ? `<img class="report-logo report-logo--engelmig" src="${engelmigLogo}" alt="Engelmig" />` : ""}
        </div>
        <div class="report-title">
          <h1>${title}</h1>
          ${subtitle ? `<p class="report-subtitle">${subtitle}</p>` : ""}
        </div>
        <div class="report-meta report-meta--compact">
          ${periodLabel ? `<span><strong>Período:</strong> ${periodLabel}</span>` : ""}
          ${emittedAtLabel ? `<span><strong>Emissão:</strong> ${emittedAtLabel}</span>` : ""}
          ${reportVersion ? `<span><strong>Versão:</strong> ${reportVersion}</span>` : ""}
        </div>
      </div>
    </header>
  `;
}

module.exports = { ReportHeader };
