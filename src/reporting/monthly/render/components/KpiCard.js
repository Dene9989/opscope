const { escapeHtml } = require("../helpers/escape");

function KpiCard(card) {
  if (!card) {
    return "";
  }
  const toneClass = card.tone ? ` tone-${escapeHtml(card.tone)}` : "";
  const trace = card.traceability && card.traceability.rule ? escapeHtml(card.traceability.rule) : "";

  return `
    <div class="kpi-card${toneClass}">
      <div class="kpi-label">${escapeHtml(card.label || "")}</div>
      <div class="kpi-value">${escapeHtml(card.formatted || "")}</div>
      <div class="kpi-delta">
        <span>${escapeHtml(card.delta || "-")}</span>
        <span>${escapeHtml(card.deltaPct || "")}</span>
      </div>
      ${card.tooltip ? `<div class="kpi-tooltip">${escapeHtml(card.tooltip)}</div>` : ""}
      ${trace ? `<div class="kpi-trace">${trace}</div>` : ""}
    </div>
  `;
}

module.exports = { KpiCard };
