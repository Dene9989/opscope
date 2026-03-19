const { escapeHtml } = require("../helpers/escape");

function BacklogTable(backlog) {
  if (!backlog || !Array.isArray(backlog.items) || !backlog.items.length) {
    return "";
  }

  return `
    <div class="backlog-table">
      <table>
        <thead>
          <tr>
            <th>Atividade</th>
            <th>Vencimento</th>
            <th>Local</th>
            <th>Equipe</th>
            <th>Justificativa</th>
          </tr>
        </thead>
        <tbody>
          ${backlog.items
            .map(
              (item) => `
              <tr>
                <td>${escapeHtml(item.title || "-")}</td>
                <td>${escapeHtml(item.dueDateLabel || "-")}</td>
                <td>${escapeHtml(item.location || "-")}</td>
                <td>${escapeHtml(item.responsible || "-")}</td>
                <td>${escapeHtml(item.reason || "-")}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

module.exports = { BacklogTable };
