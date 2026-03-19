const { parseDateOnly } = require("../utils");

const DEFAULT_LOCALE = "pt-BR";

const numberFormatter = new Intl.NumberFormat(DEFAULT_LOCALE);
const percentFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, { maximumFractionDigits: 1 });
const hoursFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, { maximumFractionDigits: 2 });
const dateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const dateTimeFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }
  return numberFormatter.format(value);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return "0%";
  }
  const safe = Math.min(100, Math.max(0, value));
  return `${percentFormatter.format(safe)}%`;
}

function formatHours(value) {
  if (!Number.isFinite(value)) {
    return "0h";
  }
  return `${hoursFormatter.format(value)}h`;
}

function formatDelta(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${numberFormatter.format(value)}`;
}

function formatDeltaPct(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${percentFormatter.format(value)}%`;
}

function formatDateRange(startIso, endIso) {
  if (!startIso || !endIso) {
    return "Período indisponível";
  }
  const start = formatDateOnly(startIso);
  const end = formatDateOnly(endIso);
  if (!start || !end) {
    return "Período indisponível";
  }
  return `${start} a ${end}`;
}

function formatDateTime(iso) {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return dateTimeFormatter.format(date);
}

function formatDateOnly(value) {
  if (!value) {
    return "";
  }
  const date = value instanceof Date ? value : (parseDateOnly(value) || new Date(value));
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return dateFormatter.format(date);
}

module.exports = {
  formatNumber,
  formatPercent,
  formatHours,
  formatDelta,
  formatDeltaPct,
  formatDateRange,
  formatDateTime,
  formatDateOnly,
};
