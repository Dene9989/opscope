const { escapeHtml } = require("../helpers/escape");
const { getAssetDataUri } = require("../helpers/assets");

function ReportHeader(header, meta) {
  const title = header && header.title ? escapeHtml(header.title) : "RELATÓRIO DE DESEMPENHO MENSAL - HV";
  const periodLabel = header && header.periodLabel ? escapeHtml(header.periodLabel) : "";
  const emittedAtLabel = header && header.emittedAtLabel ? escapeHtml(header.emittedAtLabel) : "";
  const clientName = meta && meta.clientName ? escapeHtml(meta.clientName) : "-";
  const projectName = meta && meta.projectName ? escapeHtml(meta.projectName) : "-";
  const opscopeLogo = getAssetDataUri("assets/img/opscope-logo.png");
  const engelmigLogo = getAssetDataUri("assets/engelmig-logo.png");

  return `
    <header class="report-header">
      <div class="report-header__grid">
        <div class="report-header__logo report-header__logo--left">
          ${engelmigLogo ? `<img class="report-logo report-logo--engelmig" src="${engelmigLogo}" alt="Engelmig" />` : ""}
        </div>
        <div class="report-header__center">
          <div class="report-header__title">${title}</div>
          <div class="report-header__meta">
            <div class="report-header__meta-item">
              <span class="report-header__meta-label">Cliente</span>
              <span class="report-header__meta-value">${clientName}</span>
            </div>
            <div class="report-header__meta-item">
              <span class="report-header__meta-label">Projeto</span>
              <span class="report-header__meta-value">${projectName}</span>
            </div>
            <div class="report-header__meta-item">
              <span class="report-header__meta-label">Período</span>
              <span class="report-header__meta-value">${periodLabel || "-"}</span>
            </div>
            <div class="report-header__meta-item">
              <span class="report-header__meta-label">Emissão</span>
              <span class="report-header__meta-value">${emittedAtLabel || "-"}</span>
            </div>
          </div>
        </div>
        <div class="report-header__logo report-header__logo--right">
          ${opscopeLogo ? `<img class="report-logo report-logo--opscope" src="${opscopeLogo}" alt="Opscope" />` : ""}
        </div>
      </div>
    </header>
  `;
}

module.exports = { ReportHeader };
