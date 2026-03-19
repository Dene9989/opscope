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
  const status = card.status || {};
  const statusTone = status.tone ? ` kpi-status--${escapeHtml(status.tone)}` : "";
  const statusSymbol = status.symbol ? String(status.symbol) : "";
  const statusLabel = status.label ? String(status.label) : "";
  const detail = card.detail ? String(card.detail) : "";

  return `
    <div class="kpi-card${toneClass}">
      <div class="kpi-label">${escapeHtml(card.label || "")}</div>
      <div class="kpi-value">${escapeHtml(card.formatted || "")}</div>
      ${hasDelta ? `<div class="kpi-delta${deltaClass}">${escapeHtml(deltaValue)}</div>` : ""}
      ${statusSymbol || statusLabel ? `
        <div class="kpi-status${statusTone}">
          ${statusSymbol ? `<span class="kpi-status__icon">${escapeHtml(statusSymbol)}</span>` : ""}
          ${statusLabel ? `<span class="kpi-status__label">${escapeHtml(statusLabel)}</span>` : ""}
        </div>
      ` : ""}
      ${detail ? `<div class="kpi-detail">${escapeHtml(detail)}</div>` : ""}
    </div>
  `;
}

module.exports = { KpiCard };
