const { escapeHtml } = require("../helpers/escape");

function EmptyState(message) {
  return `
    <div class="empty-state">
      ${escapeHtml(message || "Sem dados disponíveis.")}
    </div>
  `;
}

module.exports = { EmptyState };
