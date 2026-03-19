const { escapeHtml } = require("../helpers/escape");

function ContingencyTable(summary) {
  if (!summary || !Array.isArray(summary.items) || !summary.items.length) {
    return "";
  }

  return `
    <div class="contingency-table">
      <table>
        <thead>
          <tr>
            <th>Contingência</th>
            <th>Início</th>
            <th>Severidade</th>
            <th>Impacto / Consequência</th>
            <th>Resposta operacional</th>
          </tr>
        </thead>
        <tbody>
          ${summary.items
            .map(
              (item) => `
              <tr>
                <td>${escapeHtml(item.code || "-")}${item.title ? ` • ${escapeHtml(item.title)}` : ""}</td>
                <td>${escapeHtml(item.startAtLabel || "-")}</td>
                <td>${escapeHtml(item.severityLabel || "-")}</td>
                <td>${escapeHtml(item.impact || "-")}</td>
                <td>${escapeHtml(item.response || "-")}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

module.exports = { ContingencyTable };
