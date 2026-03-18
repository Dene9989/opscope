const { escapeHtml } = require("../helpers/escape");

function KpiCard(card) {
  if (!card) {
    return "";
  }
  const toneClass = card.tone ? ` tone-${escapeHtml(card.tone)}` : "";

  return `
    <div class="kpi-card${toneClass}">
      <div class="kpi-label">${escapeHtml(card.label || "")}</div>
      <div class="kpi-value">${escapeHtml(card.formatted || "")}</div>
      <div class="kpi-delta">
        <span>${escapeHtml(card.delta || "-")}</span>
        <span>${escapeHtml(card.deltaPct || "")}</span>
      </div>
    </div>
  `;
}

module.exports = { KpiCard };
