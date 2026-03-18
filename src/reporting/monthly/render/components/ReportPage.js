const { escapeHtml } = require("../helpers/escape");

function ReportPage(content, options = {}) {
  const className = options.className ? ` ${escapeHtml(options.className)}` : "";
  return `<section class="report-page${className}">${content || ""}</section>`;
}

module.exports = { ReportPage };
