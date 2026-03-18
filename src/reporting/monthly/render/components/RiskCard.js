const { escapeHtml } = require("../helpers/escape");

function RiskCard(risk) {
  if (!risk) {
    return "";
  }
  const toneClass = risk.tone ? ` tone-${escapeHtml(risk.tone)}` : "";
  return `
    <div class="risk-card${toneClass}">
      <div class="risk-text">${escapeHtml(risk.text || "")}</div>
    </div>
  `;
}

module.exports = { RiskCard };
