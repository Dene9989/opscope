const { escapeHtml } = require("../helpers/escape");

function RecommendationList(recommendations) {
  if (!recommendations || !recommendations.items || !recommendations.items.length) {
    return "";
  }
  return `
    <ul class="recommendation-list">
      ${recommendations.items
        .map((item) => `<li>${escapeHtml(item.text || "")}</li>`)
        .join("")}
    </ul>
  `;
}

module.exports = { RecommendationList };
