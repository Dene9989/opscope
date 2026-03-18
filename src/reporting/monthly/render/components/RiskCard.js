const { escapeHtml } = require("../helpers/escape");

function RiskCard(risk) {
  if (!risk) {
    return "";
  }
  const toneClass = risk.tone ? ` tone-${escapeHtml(risk.tone)}` : "";
  return `
    <div class="risk-card${toneClass}">
      <div class="risk-text">${escapeHtml(risk.text || "")}</div>
      ${risk.rule ? `<div class="risk-rule">${escapeHtml(risk.rule)}</div>` : ""}
    </div>
  `;
}

module.exports = { RiskCard };
