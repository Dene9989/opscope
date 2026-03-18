const DEFAULT_LOCALE = "pt-BR";

const numberFormatter = new Intl.NumberFormat(DEFAULT_LOCALE);
const percentFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, { maximumFractionDigits: 1 });

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

module.exports = {
  formatNumber,
  formatPercent,
};
