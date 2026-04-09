const { escapeHtml } = require("../helpers/escape");
const { chunkArray } = require("../helpers/chunk");

function MaintenanceSummaryTable(summary, options = {}) {
  if (!summary || !summary.rows || !summary.rows.length) {
    return "";
  }
  const maxRows = options.maxRows || 18;
  const chunks = chunkArray(summary.rows, maxRows);
  if (!chunks.length) {
    return "";
  }

  return chunks
    .map((chunk, index) => {
      return `
        <div class="maintenance-summary" data-chunk-index="${index + 1}">
          <table>
            <thead>
              <tr>
                <th>Manutenção</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Tempo médio</th>
              </tr>
            </thead>
            <tbody>
              ${chunk
                .map(
                  (row) => `
                  <tr>
                    <td>${escapeHtml(row.title || "-")}</td>
                    <td>${escapeHtml(row.category || "-")}</td>
                    <td>${escapeHtml(row.countLabel || "0")}</td>
                    <td>${escapeHtml(row.avgDurationLabel || "--")}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    })
    .join("");
}

module.exports = { MaintenanceSummaryTable };
