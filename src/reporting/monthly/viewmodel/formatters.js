const { parseDateOnly } = require("../utils");

const DEFAULT_LOCALE = "pt-BR";
const DEFAULT_TIMEZONE = "America/Sao_Paulo";

const numberFormatter = new Intl.NumberFormat(DEFAULT_LOCALE);
const percentFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, { maximumFractionDigits: 1 });
const hoursFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, { maximumFractionDigits: 2 });

const dateFormatters = new Map();
const dateTimeFormatters = new Map();

function getDateFormatter(timeZone) {
  const tz = timeZone || DEFAULT_TIMEZONE;
  if (!dateFormatters.has(tz)) {
    dateFormatters.set(
      tz,
      new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: tz,
      })
    );
  }
  return dateFormatters.get(tz);
}

function getDateTimeFormatter(timeZone) {
  const tz = timeZone || DEFAULT_TIMEZONE;
  if (!dateTimeFormatters.has(tz)) {
    dateTimeFormatters.set(
      tz,
      new Intl.DateTimeFormat(DEFAULT_LOCALE, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: tz,
      })
    );
  }
  return dateTimeFormatters.get(tz);
}

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

function formatDateRange(startIso, endIso, timeZone) {
  if (!startIso || !endIso) {
    return "Período indisponível";
  }
  const start = formatDateOnly(startIso, timeZone);
  const end = formatDateOnly(endIso, timeZone);
  if (!start || !end) {
    return "Período indisponível";
  }
  return `${start} a ${end}`;
}

function formatDateTime(iso, timeZone) {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return getDateTimeFormatter(timeZone).format(date);
}

function formatDateOnly(value, timeZone) {
  if (!value) {
    return "";
  }
  const date = value instanceof Date ? value : (parseDateOnly(value) || new Date(value));
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return getDateFormatter(timeZone).format(date);
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
