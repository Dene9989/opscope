const { escapeHtml } = require("../helpers/escape");
const { chunkArray } = require("../helpers/chunk");

function ActionTable(actionPlan) {
  if (!actionPlan || !actionPlan.items || !actionPlan.items.length) {
    return "";
  }
  const chunks = chunkArray(actionPlan.items, 6);
  return chunks
    .map(
      (chunk, index) => `
      <div class="action-table-block" data-chunk-index="${index + 1}">
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
            ${chunk
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
      </div>
    `
    )
    .join("");
}

module.exports = { ActionTable };
