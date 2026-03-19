const { escapeHtml } = require("../helpers/escape");

function renderIssuePhotos(item) {
  if (!item.photos || !item.photos.length) {
    return `<div class="issue-empty">Sem evidências fotográficas registradas para a anomalia.</div>`;
  }
  return `
    <div class="issue-photos">
      ${item.photos
        .map((photo) => `
          <figure class="issue-photo">
            <img class="issue-photo__img" src="${escapeHtml(photo.src || "")}" alt="Evidência da anomalia" />
            ${photo.caption ? `<figcaption class="issue-photo__caption">${escapeHtml(photo.caption)}</figcaption>` : ""}
          </figure>
        `)
        .join("")}
    </div>
  `;
}

function IntercorrenciaGallery(summary) {
  if (!summary || !summary.items || !summary.items.length) {
    return "";
  }
  return `
    <div class="issue-list">
      ${summary.items
        .map((item) => `
          <article class="issue-card">
            <div class="issue-header">
              <div class="issue-title">${escapeHtml(item.title || "Intercorrência registrada")}</div>
              <div class="issue-tags">
                <span class="issue-tag issue-tag--status status-${escapeHtml(item.statusClass || "aberta")}">${escapeHtml(item.statusLabel || "Aberta")}</span>
                <span class="issue-tag issue-tag--criticality criticality-${escapeHtml(item.criticidadeClass || "media")}">${escapeHtml(item.criticidadeLabel || "Média")}</span>
                <span class="issue-tag issue-tag--date">${escapeHtml(item.registeredAtLabel || "-")}</span>
              </div>
            </div>
            ${item.context ? `<div class="issue-context">${escapeHtml(item.context)}</div>` : ""}
            <div class="issue-body">
              <div class="issue-field">
                <div class="issue-field__label">Descrição</div>
                <div class="issue-field__value">${escapeHtml(item.description || "-")}</div>
              </div>
              <div class="issue-field">
                <div class="issue-field__label">Ação imediata</div>
                <div class="issue-field__value">${escapeHtml(item.action || "-")}</div>
              </div>
              <div class="issue-forward">${escapeHtml(item.forwardedNote || "")}</div>
            </div>
            ${renderIssuePhotos(item)}
          </article>
        `)
        .join("")}
    </div>
  `;
}

module.exports = { IntercorrenciaGallery };
