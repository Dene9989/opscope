const DAY_MS = 24 * 60 * 60 * 1000;

function isDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function stripAccents(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeText(value, options = {}) {
  if (value === null || value === undefined) {
    return "";
  }
  const { lower = false, trim = true, collapse = true } = options;
  let text = String(value);
  if (trim) {
    text = text.trim();
  }
  if (collapse) {
    text = text.replace(/\s+/g, " ");
  }
  if (lower) {
    text = text.toLowerCase();
  }
  return text;
}

function normalizeKey(value) {
  const base = stripAccents(normalizeText(value, { lower: true }));
  return base.replace(/[^a-z0-9]+/g, " ").trim();
}

function parseBrazilianDateParts(value) {
  const text = normalizeText(value);
  if (!text) {
    return null;
  }
  const cleaned = text
    .replace(/,\s*/g, " ")
    .replace(/\s+às?\s+/gi, " ")
    .replace(/\s*-\s*/g, " ");
  const match = cleaned.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const hour = Number(match[4] || 0);
  const minute = Number(match[5] || 0);
  const second = Number(match[6] || 0);
  if (
    !Number.isFinite(day) ||
    !Number.isFinite(month) ||
    !Number.isFinite(year) ||
    !Number.isFinite(hour) ||
    !Number.isFinite(minute) ||
    !Number.isFinite(second)
  ) {
    return null;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    return null;
  }
  return {
    day,
    month,
    year,
    hour,
    minute,
    second,
  };
}

function parseDateOnly(value) {
  if (!value && value !== 0) {
    return null;
  }
  if (isDate(value)) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
  const text = normalizeText(value);
  if (!text) {
    return null;
  }
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
      return null;
    }
    return new Date(year, month - 1, day);
  }
  const br = parseBrazilianDateParts(text);
  if (br) {
    return new Date(br.year, br.month - 1, br.day);
  }
  const parsed = new Date(text);
  return isDate(parsed) ? new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()) : null;
}

function parseDateTime(value) {
  if (!value && value !== 0) {
    return null;
  }
  if (isDate(value)) {
    return new Date(value.getTime());
  }
  const text = normalizeText(value);
  if (!text) {
    return null;
  }
  const br = parseBrazilianDateParts(text);
  if (br) {
    return new Date(br.year, br.month - 1, br.day, br.hour, br.minute, br.second);
  }
  const parsed = new Date(text);
  return isDate(parsed) ? parsed : null;
}

function toIsoDate(value) {
  const date = isDate(value) ? value : parseDateOnly(value);
  if (!date) {
    return "";
  }
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toIsoDateTime(value) {
  const date = isDate(value) ? value : parseDateTime(value);
  if (!date) {
    return "";
  }
  return date.toISOString();
}

function startOfDay(value) {
  const date = isDate(value) ? value : parseDateTime(value);
  if (!date) {
    return null;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(value) {
  const date = isDate(value) ? value : parseDateTime(value);
  if (!date) {
    return null;
  }
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function inRange(date, start, end) {
  if (!isDate(date) || !isDate(start) || !isDate(end)) {
    return false;
  }
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

function diffInDays(start, end) {
  if (!isDate(start) || !isDate(end)) {
    return 0;
  }
  return Math.floor((end.getTime() - start.getTime()) / DAY_MS);
}

function hashString(value) {
  const text = String(value || "");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

module.exports = {
  DAY_MS,
  stripAccents,
  normalizeText,
  normalizeKey,
  parseDateOnly,
  parseDateTime,
  toIsoDate,
  toIsoDateTime,
  startOfDay,
  endOfDay,
  inRange,
  diffInDays,
  hashString,
  isDate,
};
