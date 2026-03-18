const { escapeHtml } = require("../helpers/escape");

function WarningBanner(meta) {
  if (!meta) {
    return "";
  }
  const warnings = [];
  if (meta.isPartial) {
    warnings.push("Relatório parcial: dados consolidados até a data de emissão.");
  }
  if (meta.integrityStatus && meta.integrityStatus !== "ok") {
    warnings.push("Há alertas de integridade que podem impactar a leitura dos indicadores.");
  }

  if (!warnings.length) {
    return "";
  }

  return `
    <div class="warning-banner">
      ${warnings.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}
    </div>
  `;
}

module.exports = { WarningBanner };
