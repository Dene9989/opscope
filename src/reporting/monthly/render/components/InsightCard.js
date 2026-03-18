const { escapeHtml } = require("../helpers/escape");

function InsightCard(insight) {
  if (!insight) {
    return "";
  }
  const toneClass = insight.tone ? ` tone-${escapeHtml(insight.tone)}` : "";
  return `
    <div class="insight-card${toneClass}">
      <div class="insight-text">${escapeHtml(insight.text || "")}</div>
    </div>
  `;
}

module.exports = { InsightCard };
