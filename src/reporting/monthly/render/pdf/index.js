const { renderWithPuppeteer, renderWithPlaywright } = require("./engine");

async function renderMonthlyReportPdf(html, options = {}) {
  const engine = options.engine || "puppeteer";
  if (engine === "playwright") {
    return renderWithPlaywright(html, options);
  }
  return renderWithPuppeteer(html, options);
}

module.exports = {
  renderMonthlyReportPdf,
};
