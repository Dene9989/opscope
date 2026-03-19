const { COMPARISON_MODES } = require("./contracts");
const { parseDateOnly, parseDateTime } = require("./utils");

function validateMonthlyReportInput(input) {
  const errors = [];

  if (!input || typeof input !== "object") {
    return { ok: false, errors: [{ path: "root", message: "Input must be an object." }] };
  }

  const meta = input.meta || {};
  const currentPeriod = input.currentPeriod || {};
  const previousPeriod = input.previousPeriod;
  const comparisonMode = input.comparisonMode;

  if (!meta.projectId) {
    errors.push({ path: "meta.projectId", message: "projectId is required." });
  }
  if (!meta.projectName) {
    errors.push({ path: "meta.projectName", message: "projectName is required." });
  }
  if (!meta.clientName) {
    errors.push({ path: "meta.clientName", message: "clientName is required." });
  }
  if (!meta.period || !meta.period.start || !meta.period.end) {
    errors.push({ path: "meta.period", message: "meta.period start/end are required." });
  } else {
    if (!parseDateOnly(meta.period.start)) {
      errors.push({ path: "meta.period.start", message: "meta.period.start must be a valid date." });
    }
    if (!parseDateOnly(meta.period.end)) {
      errors.push({ path: "meta.period.end", message: "meta.period.end must be a valid date." });
    }
  }
  if (!meta.timezone) {
    errors.push({ path: "meta.timezone", message: "timezone is required." });
  }
  if (!meta.emittedAt || !parseDateTime(meta.emittedAt)) {
    errors.push({ path: "meta.emittedAt", message: "emittedAt is required and must be a valid datetime." });
  }
  if (!meta.reportVersion) {
    errors.push({ path: "meta.reportVersion", message: "reportVersion is required." });
  }

  if (!currentPeriod || typeof currentPeriod !== "object") {
    errors.push({ path: "currentPeriod", message: "currentPeriod is required." });
  } else {
    if (!currentPeriod.period || !currentPeriod.period.start || !currentPeriod.period.end) {
      errors.push({
        path: "currentPeriod.period",
        message: "currentPeriod.period start/end are required.",
      });
    } else {
      if (!parseDateOnly(currentPeriod.period.start)) {
        errors.push({
          path: "currentPeriod.period.start",
          message: "currentPeriod.period.start must be a valid date.",
        });
      }
      if (!parseDateOnly(currentPeriod.period.end)) {
        errors.push({
          path: "currentPeriod.period.end",
          message: "currentPeriod.period.end must be a valid date.",
        });
      }
    }
    if (!Array.isArray(currentPeriod.activities)) {
      errors.push({ path: "currentPeriod.activities", message: "activities must be an array." });
    }
    if (!Array.isArray(currentPeriod.rdos)) {
      errors.push({ path: "currentPeriod.rdos", message: "rdos must be an array." });
    }
    if (currentPeriod.contingencies && !Array.isArray(currentPeriod.contingencies)) {
      errors.push({ path: "currentPeriod.contingencies", message: "contingencies must be an array." });
    }
  }

  if (comparisonMode) {
    if (!Object.values(COMPARISON_MODES).includes(comparisonMode)) {
      errors.push({
        path: "comparisonMode",
        message: "comparisonMode must be provided or recalculated.",
      });
    }
  }

  if (comparisonMode === COMPARISON_MODES.PROVIDED && !previousPeriod) {
    errors.push({
      path: "previousPeriod",
      message: "previousPeriod is required when comparisonMode is provided.",
    });
  }

  if (previousPeriod && typeof previousPeriod === "object") {
    if (!previousPeriod.period || !previousPeriod.period.start || !previousPeriod.period.end) {
      errors.push({
        path: "previousPeriod.period",
        message: "previousPeriod.period start/end are required.",
      });
    } else {
      if (!parseDateOnly(previousPeriod.period.start)) {
        errors.push({
          path: "previousPeriod.period.start",
          message: "previousPeriod.period.start must be a valid date.",
        });
      }
      if (!parseDateOnly(previousPeriod.period.end)) {
        errors.push({
          path: "previousPeriod.period.end",
          message: "previousPeriod.period.end must be a valid date.",
        });
      }
    }
    if (!Array.isArray(previousPeriod.activities)) {
      errors.push({
        path: "previousPeriod.activities",
        message: "previousPeriod.activities must be an array.",
      });
    }
    if (!Array.isArray(previousPeriod.rdos)) {
      errors.push({
        path: "previousPeriod.rdos",
        message: "previousPeriod.rdos must be an array.",
      });
    }
    if (previousPeriod.contingencies && !Array.isArray(previousPeriod.contingencies)) {
      errors.push({
        path: "previousPeriod.contingencies",
        message: "previousPeriod.contingencies must be an array.",
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

module.exports = { validateMonthlyReportInput };
