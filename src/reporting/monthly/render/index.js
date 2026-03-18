const fs = require("fs");
const path = require("path");
const { renderMonthlyReportTemplate } = require("./templates/monthlyReportTemplate");
const { buildMonthlyReportCharts } = require("../charts/builder");
const { renderMonthlyReportPdf } = require("./pdf");

function loadCss(file) {
  return fs.readFileSync(path.join(__dirname, "styles", file), "utf8");
}

function renderMonthlyReportHtml(viewModel, options = {}) {
  const baseCss = loadCss("base.css");
  const printCss = loadCss("print.css");

  const charts = options.charts || buildMonthlyReportCharts(viewModel);
  const body = renderMonthlyReportTemplate(viewModel, charts);

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          ${baseCss}
          ${printCss}
        </style>
      </head>
      <body>
        ${body}
      </body>
    </html>
  `;
}

module.exports = {
  renderMonthlyReportHtml,
  renderMonthlyReportPdf,
};
