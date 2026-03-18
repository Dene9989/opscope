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
  const total = onTime + late;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barHeight = chartHeight;
  const onTimeWidth = total ? (onTime / total) * chartWidth : 0;
  const lateWidth = total ? (late / total) * chartWidth : 0;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${padding.left}" y="${padding.top}" width="${chartWidth}" height="${barHeight}" fill="#f3f6f9" stroke="#d9e2ec" />
      <rect x="${padding.left}" y="${padding.top}" width="${onTimeWidth}" height="${barHeight}" fill="${colors.onTime}" />
      <rect x="${padding.left + onTimeWidth}" y="${padding.top}" width="${lateWidth}" height="${barHeight}" fill="${colors.late}" />
      <text x="${padding.left}" y="${height - 10}" font-size="11" fill="#334155">${escapeSvg(label)}</text>
      <text x="${padding.left + 6}" y="${padding.top + barHeight / 2}" font-size="11" fill="#ffffff">${escapeSvg(`No prazo: ${onTime}`)}</text>
      <text x="${padding.left + onTimeWidth + 6}" y="${padding.top + barHeight / 2}" font-size="11" fill="#ffffff">${escapeSvg(`Fora do prazo: ${late}`)}</text>
    </svg>
  `;
}

module.exports = { renderStackedBar };
