const { escapeHtml } = require("../helpers/escape");

function ChartContainer(title, subtitle = "", chart = {}) {
  const hasSvg = chart && chart.svg;
  const emptyMessage = chart && chart.empty ? chart.emptyMessage || "Sem dados" : "";
  return `
    <div class="chart-container">
      <div class="chart-header">
        <h4>${escapeHtml(title)}</h4>
        ${subtitle ? `<span class="chart-subtitle">${escapeHtml(subtitle)}</span>` : ""}
      </div>
      ${hasSvg ? `<div class="chart-svg">${chart.svg}</div>` : `<div class="chart-placeholder">${escapeHtml(emptyMessage || "Sem dados")}</div>`}
    </div>
  `;
}

module.exports = { ChartContainer };
