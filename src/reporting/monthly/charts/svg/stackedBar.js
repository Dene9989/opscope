const { escapeSvg } = require("./utils");

function renderStackedBar({
  width = 520,
  height = 240,
  padding = { top: 44, right: 16, bottom: 34, left: 46 },
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

  const legendY = 18;
  const legendX = padding.left;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <text x="${legendX}" y="${legendY}" font-size="11" fill="#334155">${escapeSvg(label)}</text>
      <rect x="${legendX}" y="${legendY + 6}" width="10" height="10" fill="${colors.onTime}" />
      <text x="${legendX + 14}" y="${legendY + 15}" font-size="11" fill="#334155">${escapeSvg(`No prazo: ${safeOnTime}%`)}</text>
      <rect x="${legendX + 160}" y="${legendY + 6}" width="10" height="10" fill="${colors.late}" />
      <text x="${legendX + 174}" y="${legendY + 15}" font-size="11" fill="#334155">${escapeSvg(`Fora do prazo: ${safeLate}%`)}</text>

      <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${barHeight}" fill="#f3f6f9" stroke="#d9e2ec" />
      <rect x="${padding.left}" y="${padding.top}" width="${onTimeWidth}" height="${barHeight}" fill="${colors.onTime}" />
      <rect x="${padding.left + onTimeWidth}" y="${padding.top}" width="${lateWidth}" height="${barHeight}" fill="${colors.late}" />
    </svg>
  `;
}

module.exports = { renderStackedBar };
