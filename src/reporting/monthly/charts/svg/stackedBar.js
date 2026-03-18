const { escapeSvg } = require("./utils");

function renderStackedBar({
  width = 520,
  height = 220,
  padding = { top: 26, right: 16, bottom: 36, left: 40 },
  label = "SLA",
  onTime = 0,
  late = 0,
  colors = { onTime: "#16a34a", late: "#dc2626" },
} = {}) {
  const safeOnTime = Number.isFinite(onTime) ? Math.max(0, Math.round(onTime)) : 0;
  const safeLate = Number.isFinite(late) ? Math.max(0, Math.round(late)) : 0;
  const total = safeOnTime + safeLate;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barHeight = chartHeight;
  const onTimeWidth = total ? (safeOnTime / total) * chartWidth : 0;
  const lateWidth = total ? (safeLate / total) * chartWidth : 0;
  const legendY = height - 14;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${barHeight}" fill="#f3f6f9" stroke="#d9e2ec" />
      <rect x="${padding.left}" y="${padding.top}" width="${onTimeWidth}" height="${barHeight}" fill="${colors.onTime}" />
      <rect x="${padding.left + onTimeWidth}" y="${padding.top}" width="${lateWidth}" height="${barHeight}" fill="${colors.late}" />
      <text x="${padding.left}" y="${height - 10}" font-size="11" fill="#334155">${escapeSvg(label)}</text>
      <rect x="${padding.left}" y="${legendY - 10}" width="10" height="10" fill="${colors.onTime}" />
      <text x="${padding.left + 14}" y="${legendY - 1}" font-size="11" fill="#334155">${escapeSvg(`No prazo: ${safeOnTime}%`)}</text>
      <rect x="${padding.left + 150}" y="${legendY - 10}" width="10" height="10" fill="${colors.late}" />
      <text x="${padding.left + 164}" y="${legendY - 1}" font-size="11" fill="#334155">${escapeSvg(`Fora do prazo: ${safeLate}%`)}</text>
    </svg>
  `;
}

module.exports = { renderStackedBar };
