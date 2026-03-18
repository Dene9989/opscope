const { escapeHtml } = require("../helpers/escape");
const { formatPercent } = require("../helpers/format");

function ComplianceTable(safetyCompliance) {
  if (!safetyCompliance || !safetyCompliance.docs) {
    return "";
  }
  const docs = safetyCompliance.docs;
  return `
    <table class="compliance-table">
      <thead>
        <tr>
          <th>Docs Required</th>
          <th>Docs Ok</th>
          <th>Docs Partial</th>
          <th>Docs Unknown</th>
          <th>Compliance</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${escapeHtml(String(docs.required))}</td>
          <td>${escapeHtml(String(docs.ok))}</td>
          <td>${escapeHtml(String(docs.partial))}</td>
          <td>${escapeHtml(String(docs.unknown))}</td>
          <td>${escapeHtml(formatPercent(docs.compliancePct))}</td>
        </tr>
      </tbody>
    </table>
  `;
}

module.exports = { ComplianceTable };
