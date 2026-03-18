const { normalizeMonthlyReportInput } = require("../normalizer");
const { aggregateMonthlyReport } = require("../aggregator");
const { validateSchema } = require("./schemaValidator");
const { validateBusiness } = require("./businessValidator");
const { validateConsistency } = require("./consistencyValidator");
const { summarizeIssues, resolveIntegrityStatus } = require("./helpers");

function validateMonthlyReport({ input, normalized, aggregated, options = {} } = {}) {
  const autoNormalize = options.autoNormalize !== false;
  const autoAggregate = options.autoAggregate !== false;

  const schemaIssues = validateSchema(input);

  const normalizedData = normalized || (autoNormalize ? normalizeMonthlyReportInput(input || {}) : null);
  const aggregatedData =
    aggregated || (autoAggregate && normalizedData ? aggregateMonthlyReport(normalizedData) : null);

  const businessIssues = normalizedData ? validateBusiness(input || {}, normalizedData) : [];
  const consistencyIssues =
    normalizedData && aggregatedData ? validateConsistency(normalizedData, aggregatedData) : [];

  const issues = [...schemaIssues, ...businessIssues, ...consistencyIssues];
  const summary = summarizeIssues(issues);
  const integrityStatus = resolveIntegrityStatus(summary);

  return {
    integrityStatus,
    summary,
    issues,
  };
}

module.exports = {
  validateMonthlyReport,
};
