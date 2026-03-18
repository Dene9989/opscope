const { escapeHtml } = require("../helpers/escape");

function InsightCard(insight) {
  if (!insight) {
    return "";
  }
  const toneClass = insight.tone ? ` tone-${escapeHtml(insight.tone)}` : "";
  return `
    <div class="insight-card${toneClass}">
      <div class="insight-text">${escapeHtml(insight.text || "")}</div>
      ${insight.rule ? `<div class="insight-rule">${escapeHtml(insight.rule)}</div>` : ""}
    </div>
  `;
}

module.exports = { InsightCard };
