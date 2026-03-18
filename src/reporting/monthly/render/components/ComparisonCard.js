const { escapeHtml } = require("../helpers/escape");

function ComparisonCard(item) {
  if (!item) {
    return "";
  }
  return `
    <div class="comparison-card">
      <div class="comparison-label">${escapeHtml(item.label || "")}</div>
      <div class="comparison-values">
        <span class="current">${escapeHtml(String(item.current ?? "-"))}</span>
        <span class="previous">${escapeHtml(String(item.previous ?? "-"))}</span>
      </div>
      <div class="comparison-delta">
        <span>${escapeHtml(item.deltaFormatted || "-")}</span>
        <span>${escapeHtml(item.deltaPctFormatted || "-")}</span>
      </div>
    </div>
  `;
}

module.exports = { ComparisonCard };
