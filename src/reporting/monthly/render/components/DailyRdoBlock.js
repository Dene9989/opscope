const { escapeHtml } = require("../helpers/escape");

function DailyRdoBlock(rdo) {
  if (!rdo) {
    return "";
  }
  return `
    <div class="daily-rdo-block">
      <div class="daily-rdo-header">
        <strong>RDO ${escapeHtml(rdo.rdoDate || "")}</strong>
        <span>ID: ${escapeHtml(rdo.id || "-")}</span>
      </div>
      <div class="daily-rdo-body">
        <span><strong>Emitido:</strong> ${escapeHtml(rdo.createdAt || "-")}</span>
        <span><strong>Por:</strong> ${escapeHtml(rdo.createdBy || "-")}</span>
        <span><strong>Evidências:</strong> ${escapeHtml(String(rdo.evidenceCount || 0))}</span>
      </div>
    </div>
  `;
}

module.exports = { DailyRdoBlock };
