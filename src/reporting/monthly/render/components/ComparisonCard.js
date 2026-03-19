const { escapeHtml } = require("../helpers/escape");

function ComparisonCard(item) {
  if (!item) {
    return "";
  }
  const deltaValue = item.deltaFormatted ? String(item.deltaFormatted) : "-";
  const deltaPctValue = item.deltaPctFormatted ? String(item.deltaPctFormatted) : "";
  const deltaNumeric = Number.isFinite(item.delta) ? item.delta : null;
  const deltaClass =
    deltaNumeric !== null
      ? deltaNumeric > 0
        ? " comparison-delta--positive"
        : deltaNumeric < 0
          ? " comparison-delta--negative"
          : ""
      : "";
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
      <div class="comparison-delta${deltaClass}">${escapeHtml(deltaValue)} ${escapeHtml(deltaPctValue)}</div>
    </div>
  `;
}

module.exports = { ComparisonCard };
