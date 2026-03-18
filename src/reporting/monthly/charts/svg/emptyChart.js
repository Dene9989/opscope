const { escapeSvg } = require("./utils");

function renderEmptyChart({ width = 520, height = 220, message = "Sem dados" } = {}) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="#f3f6f9" stroke="#d9e2ec" />
      <text x="${width / 2}" y="${height / 2}" font-size="11" text-anchor="middle" fill="#64748b">${escapeSvg(message)}</text>
    </svg>
  `;
}

module.exports = { renderEmptyChart };
