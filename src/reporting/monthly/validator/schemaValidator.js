const { validateMonthlyReportInput } = require("../schema");
const { VALIDATION_SEVERITY } = require("../contracts");
const { createIssue } = require("./helpers");
const { parseDateOnly } = require("../utils");

function validateSchema(input) {
  const issues = [];
  const result = validateMonthlyReportInput(input);
  if (!result.ok) {
    result.errors.forEach((err) => {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "schema.invalid",
          err.message,
          { path: err.path },
          "schema",
          "schema.required"
        )
      );
    });
  }

  const meta = input && input.meta ? input.meta : {};
  if (meta && meta.period) {
    const start = parseDateOnly(meta.period.start);
    const end = parseDateOnly(meta.period.end);
    if (start && end && start > end) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "schema.period_range",
          "meta.period.start must be before meta.period.end.",
          { start: meta.period.start, end: meta.period.end },
          "schema",
          "schema.period.range"
        )
      );
    }
  }

  if (input && input.currentPeriod && input.currentPeriod.period) {
    const start = parseDateOnly(input.currentPeriod.period.start);
    const end = parseDateOnly(input.currentPeriod.period.end);
    if (start && end && start > end) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "schema.current_period_range",
          "currentPeriod.period.start must be before end.",
          { start: input.currentPeriod.period.start, end: input.currentPeriod.period.end },
          "schema",
          "schema.period.range"
        )
      );
    }
  }

  if (input && input.previousPeriod && input.previousPeriod.period) {
    const start = parseDateOnly(input.previousPeriod.period.start);
    const end = parseDateOnly(input.previousPeriod.period.end);
    if (start && end && start > end) {
      issues.push(
        createIssue(
          VALIDATION_SEVERITY.BLOCKER,
          "schema.previous_period_range",
          "previousPeriod.period.start must be before end.",
          { start: input.previousPeriod.period.start, end: input.previousPeriod.period.end },
          "schema",
          "schema.period.range"
        )
      );
    }
  }

  return issues;
}

module.exports = { validateSchema };
