const { escapeHtml } = require("../helpers/escape");

function KpiCard(card) {
  if (!card) {
    return "";
  }
  const toneClass = card.tone ? ` tone-${escapeHtml(card.tone)}` : "";
  const deltaText = card.delta && card.delta !== "-" ? String(card.delta) : "";
  const deltaPctText = card.deltaPct && card.deltaPct !== "-" ? String(card.deltaPct) : "";
  const hasDelta = deltaText || deltaPctText;
  const deltaValue = `${deltaText}${deltaText && deltaPctText ? " " : ""}${deltaPctText}`.trim();
  const deltaClass =
    deltaValue.startsWith("+") ? " kpi-delta--positive" : deltaValue.startsWith("-") ? " kpi-delta--negative" : "";

  return `
    <div class="kpi-card${toneClass}">
      <div class="kpi-label">${escapeHtml(card.label || "")}</div>
      <div class="kpi-value">${escapeHtml(card.formatted || "")}</div>
      ${hasDelta ? `<div class="kpi-delta${deltaClass}">${escapeHtml(deltaValue)}</div>` : ""}
    </div>
  `;
}

module.exports = { KpiCard };
