const { escapeSvg, niceMax } = require("./utils");

function renderLineChart({
  width = 520,
  height = 240,
  padding = { top: 36, right: 16, bottom: 42, left: 46 },
  labels = [],
  series = [],
} = {}) {
  if (!labels.length || !series.length) {
    return null;
  }
  const maxValue = niceMax(
    Math.max(
      ...series.flatMap((s) => s.values || []).map((value) => value || 0)
    )
  );
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const step = labels.length > 1 ? chartWidth / (labels.length - 1) : chartWidth;

  const ticks = maxValue ? [0, Math.round(maxValue / 2), maxValue] : [0];
  const grid = ticks
    .map((value) => {
      const y = padding.top + chartHeight - (maxValue ? (value / maxValue) * chartHeight : 0);
      return `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e2e8f0" />
        <text x="${padding.left - 6}" y="${y + 4}" font-size="10" text-anchor="end" fill="#64748b">${escapeSvg(String(value))}</text>
      `;
    })
    .join("");

  const lines = series
    .map((serie) => {
      const points = serie.values.map((value, idx) => {
        const x = padding.left + idx * step;
        const y = padding.top + chartHeight - (maxValue ? (value / maxValue) * chartHeight : 0);
        return `${x},${y}`;
      });
      const circles = points
        .map((point) => {
          const [x, y] = point.split(",");
          return `<circle cx="${x}" cy="${y}" r="3" fill="${serie.color}" />`;
        })
        .join("");
      return `
        <polyline fill="none" stroke="${serie.color}" stroke-width="2" points="${points.join(" ")}" />
        ${circles}
      `;
    })
    .join("");

  const xLabels = labels
    .map((label, idx) => {
      const x = padding.left + idx * step;
      return `<text x="${x}" y="${height - 12}" font-size="11" text-anchor="middle" fill="#334155">${escapeSvg(label)}</text>`;
    })
    .join("");

  const legend = series
    .map((serie, idx) => {
      const lastValue = serie.values.length ? serie.values[serie.values.length - 1] : 0;
      const legendY = 16 + idx * 14;
      const legendX = width - padding.right - 140;
      return `
        <rect x="${legendX}" y="${legendY - 8}" width="10" height="10" fill="${serie.color}" />
        <text x="${legendX + 14}" y="${legendY}" font-size="10" fill="#334155">${escapeSvg(serie.label)}: ${escapeSvg(String(lastValue))}</text>
      `;
    })
    .join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${grid}
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#cbd5f5" />
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#cbd5f5" />
      ${lines}
      ${xLabels}
      ${legend}
    </svg>
  `;
}

module.exports = { renderLineChart };
