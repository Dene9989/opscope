const { escapeHtml } = require("../helpers/escape");

function MetadataBar(meta) {
  if (!meta) {
    return "";
  }
  const plant = meta.plantName ? escapeHtml(meta.plantName) : "-";
  const comparisonMode = meta.comparisonMode === "provided"
    ? "Período anterior (informado)"
    : meta.comparisonMode === "recalculated"
      ? "Período anterior (recalculado)"
      : "Sem comparativo";
  const integrityLabel = meta.integrityStatus && meta.integrityStatus !== "ok" ? "Atenção" : "OK";
  const integrityClass = meta.integrityStatus && meta.integrityStatus !== "ok" ? " tone-warning" : " tone-positive";
  const consolidationLabel = meta.isPartial ? "Parcial" : "Fechado";
  const consolidationClass = meta.isPartial ? " tone-warning" : " tone-positive";

  return `
    <div class="metadata-bar">
      <div class="metadata-item">
        <span class="metadata-label">Unidade</span>
        <span class="metadata-value">${plant}</span>
      </div>
      <div class="metadata-item${consolidationClass}">
        <span class="metadata-label">Consolidação</span>
        <span class="metadata-value">${consolidationLabel}</span>
      </div>
      <div class="metadata-item${integrityClass}">
        <span class="metadata-label">Integridade</span>
        <span class="metadata-value">${integrityLabel}</span>
      </div>
      <div class="metadata-item">
        <span class="metadata-label">Comparativo</span>
        <span class="metadata-value">${escapeHtml(comparisonMode)}</span>
      </div>
    </div>
  `;
}

module.exports = { MetadataBar };
