const { escapeHtml } = require("../helpers/escape");

function renderChartSummary(summary) {
  if (!summary || !summary.length) {
    return "";
  }
  return `
    <table class="chart-summary">
      <tbody>
        ${summary
          .map((row) => `
            <tr>
              <td>${escapeHtml(row.label || "")}</td>
              <td>${escapeHtml(row.value || "")}</td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `;
}

function ChartContainer(title, subtitle = "", chart = {}) {
  const hasSvg = chart && chart.svg;
  const emptyMessage = chart && chart.empty ? chart.emptyMessage || "Sem dados" : "";
  const note = chart && chart.note ? chart.note : "";
  const summary = chart && chart.summary ? chart.summary : null;
  return `
    <div class="chart-container">
      <div class="chart-header">
        <h4>${escapeHtml(title)}</h4>
        ${subtitle ? `<span class="chart-subtitle">${escapeHtml(subtitle)}</span>` : ""}
      </div>
      ${hasSvg ? `<div class="chart-svg">${chart.svg}</div>` : `<div class="chart-placeholder">${escapeHtml(emptyMessage || "Sem dados")}</div>`}
      ${note ? `<div class="chart-note">${escapeHtml(note)}</div>` : ""}
      ${renderChartSummary(summary)}
    </div>
  `;
}

module.exports = { ChartContainer };
