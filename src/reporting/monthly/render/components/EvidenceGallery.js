const { escapeHtml } = require("../helpers/escape");

function EvidenceGallery(gallery) {
  if (!gallery || !gallery.items || !gallery.items.length) {
    return "";
  }
  return `
    <div class="evidence-gallery">
      ${gallery.items
        .map((item) => `
          <figure class="evidence-card">
            <a class="evidence-link" href="${escapeHtml(item.src || "")}" target="_blank" rel="noopener">
              <img class="evidence-image" src="${escapeHtml(item.src || "")}" alt="Evidencia" />
            </a>
            <figcaption class="evidence-caption">
              ${item.caption ? `<div class="evidence-caption__title">${escapeHtml(item.caption)}</div>` : ""}
              ${item.context ? `<div class="evidence-caption__context">${escapeHtml(item.context)}</div>` : ""}
            </figcaption>
          </figure>
        `)
        .join("")}
    </div>
  `;
}

module.exports = { EvidenceGallery };

