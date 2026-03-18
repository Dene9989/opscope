const { escapeHtml } = require("../helpers/escape");

function ComparisonCard(item) {
  if (!item) {
    return "";
  }
  return `
    <div class="comparison-card">
      <div class="comparison-label">${escapeHtml(item.label || "")}</div>
      <div class="comparison-values">
        <div class="comparison-value">
          <span class="comparison-caption">Atual</span>
          <span class="comparison-number">${escapeHtml(String(item.current ?? "-"))}</span>
        </div>
        <div class="comparison-value">
          <span class="comparison-caption">Anterior</span>
          <span class="comparison-number">${escapeHtml(String(item.previous ?? "-"))}</span>
        </div>
      </div>
      <div class="comparison-delta">${escapeHtml(item.deltaFormatted || "-")} ${escapeHtml(item.deltaPctFormatted || "")}</div>
    </div>
  `;
}

module.exports = { ComparisonCard };
