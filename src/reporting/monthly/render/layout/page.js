const { ReportPage } = require("../components/ReportPage");
const { Footer } = require("../components/Footer");

function Page(content, options = {}) {
  return ReportPage(`${content || ""}${Footer()}`, options);
}

module.exports = { Page };
