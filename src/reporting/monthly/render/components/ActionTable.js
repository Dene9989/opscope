const { escapeHtml } = require("../helpers/escape");

function ActionTable(actionPlan) {
  if (!actionPlan || !actionPlan.items || !actionPlan.items.length) {
    return "";
  }
  return `
    <table class="action-table">
      <thead>
        <tr>
          <th>Ação</th>
          <th>Responsável</th>
          <th>Prazo</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${actionPlan.items
          .map(
            (item) => `
            <tr>
              <td>${escapeHtml(item.text || "")}</td>
              <td>${escapeHtml(item.owner || "-")}</td>
              <td>${escapeHtml(item.due || "-")}</td>
              <td>${escapeHtml(item.status || "-")}</td>
            </tr>
          `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

module.exports = { ActionTable };
