const { escapeSvg, niceMax } = require("./utils");

function truncateLabel(label, max = 12) {
  const safe = String(label || "");
  if (safe.length <= max) {
    return safe;
  }
  return `${safe.slice(0, max - 1)}…`;
}

function renderBarChart({
  width = 520,
  height = 240,
  padding = { top: 28, right: 16, bottom: 54, left: 46 },
  data = [],
  colors = ["#1d4ed8", "#0ea5e9"],
  yLabel = "",
} = {}) {
  if (!data.length) {
    return null;
  }
  const maxValue = niceMax(Math.max(...data.map((d) => d.value || 0)));
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = chartWidth / data.length;

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

  const bars = data
    .map((d, idx) => {
      const value = d.value || 0;
      const barHeight = maxValue ? (value / maxValue) * chartHeight : 0;
      const x = padding.left + idx * barWidth + 8;
      const y = padding.top + (chartHeight - barHeight);
      const labelX = padding.left + idx * barWidth + barWidth / 2;
      const color = d.color || colors[idx % colors.length];
      const label = truncateLabel(d.label || "");
      return `
        <rect x="${x}" y="${y}" width="${Math.max(10, barWidth - 16)}" height="${barHeight}" fill="${color}" rx="2" />
        <text x="${labelX}" y="${y - 4}" font-size="10" text-anchor="middle" fill="#334155">${escapeSvg(String(value))}</text>
        <text x="${labelX}" y="${height - 12}" font-size="10" text-anchor="middle" fill="#334155">${escapeSvg(label)}</text>
      `;
    })
    .join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${grid}
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#cbd5f5" />
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#cbd5f5" />
      ${yLabel ? `<text x="${padding.left}" y="${padding.top - 8}" font-size="11" fill="#64748b">${escapeSvg(yLabel)}</text>` : ""}
      ${bars}
    </svg>
  `;
}

module.exports = { renderBarChart };
