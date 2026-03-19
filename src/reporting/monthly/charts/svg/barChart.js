const { escapeSvg, niceMax } = require("./utils");

function wrapLabel(label, maxChars = 16, maxLines = 3) {
  const safe = String(label || "").replace(/\s+/g, " ").trim();
  if (!safe) {
    return [""];
  }
  const words = safe.split(" ");
  const lines = [];
  let current = "";
  words.forEach((word) => {
    if (!current) {
      current = word;
      return;
    }
    if ((current + " " + word).length <= maxChars) {
      current = `${current} ${word}`;
      return;
    }
    lines.push(current);
    current = word;
  });
  if (current) {
    lines.push(current);
  }
  if (lines.length > maxLines) {
    const trimmed = lines.slice(0, maxLines);
    const rest = lines.slice(maxLines).join(" ");
    if (rest) {
      trimmed[maxLines - 1] = `${trimmed[maxLines - 1]} ${rest}`;
    }
    return trimmed;
  }
  return lines;
}

function renderBarChart({
  width = 520,
  height = 240,
  padding = { top: 28, right: 16, bottom: 64, left: 46 },
  data = [],
  colors = ["#0b2f4f", "#0f766e", "#c2a15c", "#64748b"],
  yLabel = "",
} = {}) {
  if (!data.length) {
    return null;
  }
  const maxValue = niceMax(Math.max(...data.map((d) => d.value || 0)));
  const fontFamily = "IBM Plex Sans, 'Source Sans 3', 'Segoe UI', sans-serif";
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const barWidth = chartWidth / data.length;

  const ticks = maxValue ? [0, Math.round(maxValue / 2), maxValue] : [0];
  const grid = ticks
    .map((value) => {
      const y = padding.top + chartHeight - (maxValue ? (value / maxValue) * chartHeight : 0);
      return `
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e3e8f1" />
        <text x="${padding.left - 6}" y="${y + 4}" font-size="10" text-anchor="end" fill="#5b6b7c" font-family="${fontFamily}">${escapeSvg(String(value))}</text>
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
      const labelLines = wrapLabel(d.label || "");
      const lineHeight = 12;
      const labelStart = height - 12 - (labelLines.length - 1) * lineHeight;
      return `
        <rect x="${x}" y="${y}" width="${Math.max(10, barWidth - 16)}" height="${barHeight}" fill="${color}" rx="3" />
        <text x="${labelX}" y="${y - 4}" font-size="10" text-anchor="middle" fill="#2f3b4a" font-family="${fontFamily}">${escapeSvg(String(value))}</text>
        <text x="${labelX}" y="${labelStart}" font-size="9.6" text-anchor="middle" fill="#2f3b4a" font-family="${fontFamily}">
          ${labelLines.map((line, lineIndex) => `<tspan x="${labelX}" dy="${lineIndex === 0 ? 0 : lineHeight}">${escapeSvg(line)}</tspan>`).join("")}
        </text>
      `;
    })
    .join("");

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${grid}
      <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${height - padding.bottom}" stroke="#c7d2e0" />
      <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="#c7d2e0" />
      ${yLabel ? `<text x="${padding.left}" y="${padding.top - 8}" font-size="10.5" fill="#5b6b7c" font-family="${fontFamily}">${escapeSvg(yLabel)}</text>` : ""}
      ${bars}
    </svg>
  `;
}

module.exports = { renderBarChart };
