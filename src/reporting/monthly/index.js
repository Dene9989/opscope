const { validateMonthlyReportInput } = require("./schema");
const { normalizeMonthlyReportInput } = require("./normalizer");
const { aggregateMonthlyReport } = require("./aggregator");
const { validateMonthlyReport } = require("./validator");
const { buildMonthlyReportViewModel } = require("./viewmodel/builder");
const { renderMonthlyReportHtml } = require("./render");
const { renderMonthlyReportPdf } = require("./render");
const { buildMonthlyReportCharts } = require("./charts");
const contracts = require("./contracts");
const metrics = require("./metrics");

module.exports = {
  validateMonthlyReportInput,
  normalizeMonthlyReportInput,
  aggregateMonthlyReport,
  validateMonthlyReport,
  buildMonthlyReportViewModel,
  renderMonthlyReportHtml,
  renderMonthlyReportPdf,
  buildMonthlyReportCharts,
  contracts,
  metrics,
};
