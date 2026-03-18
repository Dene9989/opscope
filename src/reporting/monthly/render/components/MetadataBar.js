const { escapeHtml } = require("../helpers/escape");

function MetadataBar(meta) {
  if (!meta) {
    return "";
  }
  const client = meta.clientName ? escapeHtml(meta.clientName) : "-";
  const project = meta.projectName ? escapeHtml(meta.projectName) : "-";
  const plant = meta.plantName ? escapeHtml(meta.plantName) : "-";

  return `
    <div class="metadata-bar">
      <span><strong>Cliente:</strong> ${client}</span>
      <span><strong>Projeto:</strong> ${project}</span>
      <span><strong>Planta:</strong> ${plant}</span>
    </div>
  `;
}

module.exports = { MetadataBar };
