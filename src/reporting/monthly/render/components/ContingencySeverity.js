const { escapeHtml } = require("../helpers/escape");

function ContingencySeverity(summary) {
  if (!summary || !summary.severityStats || !summary.severityStats.total) {
    return "";
  }
  const stats = summary.severityStats;
  const items = Array.isArray(stats.items) ? stats.items : [];
  if (!items.length) {
    return "";
  }
  const barSegments = items
    .filter((item) => item.count > 0)
    .map(
      (item) => `
        <span class="severity-bar__segment severity-${escapeHtml(item.className)}" style="width:${item.pct}%"></span>
      `
    )
    .join("");

  const legendItems = items
    .map(
      (item) => `
        <div class="severity-legend__item">
          <span class="severity-legend__label">
            <span class="severity-dot severity-${escapeHtml(item.className)}"></span>
            ${escapeHtml(item.label)}
          </span>
          <span class="severity-legend__value">${escapeHtml(String(item.count))} (${escapeHtml(String(item.pct))}%)</span>
        </div>
      `
    )
    .join("");

  const definitions = items
    .map(
      (item) => `
        <li>
          <span class="severity-defs__label">${escapeHtml(item.label)}:</span>
          ${escapeHtml(item.description || "")}
        </li>
      `
    )
    .join("");

  return `
    <div class="contingency-severity">
      <div class="contingency-severity__chart">
        <div class="severity-bar">
          ${barSegments || '<span class="severity-bar__segment severity-nao_informado" style="width:100%"></span>'}
        </div>
        <div class="severity-legend">
          ${legendItems}
        </div>
        ${stats.note ? `<div class="severity-note">${escapeHtml(stats.note)}</div>` : ""}
      </div>
      <div class="contingency-severity__defs">
        <div class="severity-defs__title">Critérios de severidade</div>
        <ul class="severity-defs">
          ${definitions}
        </ul>
      </div>
    </div>
  `;
}

module.exports = { ContingencySeverity };
