const { escapeSvg, niceMax } = require("./utils");

function renderLineChart({
  width = 520,
  height = 220,
  padding = { top: 26, right: 16, bottom: 38, left: 40 },
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
      return `<text x="${x}" y="${height - 10}" font-size="11" text-anchor="middle" fill="#334155">${escapeSvg(label)}</text>`;
    })
    .join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#d1d9ee" />
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#d1d9ee" />
      ${lines}
      ${xLabels}
    </svg>
  `;
}

module.exports = { renderLineChart };
