const { ReportPage } = require("../components/ReportPage");
const { Footer } = require("../components/Footer");

function Page(content, options = {}) {
  const withFooter = options.withFooter !== false;
  const footer = withFooter ? Footer() : "";
  return ReportPage(`${content || ""}${footer}`, options);
}

module.exports = { Page };
