const { VALIDATION_SEVERITY, INTEGRITY_STATUS } = require("../contracts");

function createIssue(severity, code, message, context = {}, source = "validator", rule = "") {
  return {
    severity,
    code,
    message,
    context,
    source,
    rule,
  };
}

function summarizeIssues(issues) {
  return issues.reduce(
    (acc, issue) => {
      if (issue.severity === VALIDATION_SEVERITY.BLOCKER) {
        acc.blockers += 1;
      } else if (issue.severity === VALIDATION_SEVERITY.WARNING) {
        acc.warnings += 1;
      } else {
        acc.infos += 1;
      }
      return acc;
    },
    { blockers: 0, warnings: 0, infos: 0 }
  );
}

function resolveIntegrityStatus(summary) {
  if (summary.blockers > 0) {
    return INTEGRITY_STATUS.BLOCKED;
  }
  if (summary.warnings > 0) {
    return INTEGRITY_STATUS.WARNING;
  }
  return INTEGRITY_STATUS.OK;
}

function pushIf(issues, condition, issue) {
  if (condition) {
    issues.push(issue);
  }
}

module.exports = {
  createIssue,
  summarizeIssues,
  resolveIntegrityStatus,
  pushIf,
};
