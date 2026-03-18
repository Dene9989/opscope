const { escapeHtml } = require("../helpers/escape");

function SectionHeader(title, subtitle = "") {
  return `
    <div class="section-header">
      <h2>${escapeHtml(title)}</h2>
      ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
    </div>
  `;
}

module.exports = { SectionHeader };
