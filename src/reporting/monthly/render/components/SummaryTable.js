const { escapeHtml } = require("../helpers/escape");
const { chunkArray } = require("../helpers/chunk");
const { formatPercent } = require("../helpers/format");

function renderSummaryTable(title, rows, options = {}) {
  const maxRows = options.maxRows || 18;
  const chunks = chunkArray(rows || [], maxRows);
  if (!chunks.length) {
    return "";
  }

  return chunks
    .map((chunk, index) => {
      return `
        <div class="summary-table" data-chunk-index="${index + 1}">
          <h3>${escapeHtml(title)}</h3>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Quantidade</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              ${chunk
                .map(
                  (row) => `
                  <tr>
                    <td>${escapeHtml(row.label)}</td>
                    <td>${escapeHtml(String(row.count))}</td>
                    <td>${escapeHtml(formatPercent(row.pct))}</td>
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

module.exports = { renderSummaryTable };
