function escapeSvg(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function niceMax(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return 1;
  }
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const fraction = value / pow;
  if (fraction <= 1) return 1 * pow;
  if (fraction <= 2) return 2 * pow;
  if (fraction <= 5) return 5 * pow;
  return 10 * pow;
}

module.exports = {
  escapeSvg,
  clamp,
  niceMax,
};
