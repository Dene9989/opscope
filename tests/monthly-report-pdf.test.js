const test = require("node:test");
const assert = require("node:assert/strict");

const { renderMonthlyReportPdf } = require("../src/reporting/monthly");

const html = "<html><body><h1>Teste PDF</h1></body></html>";

test("pdf export throws when engine missing", async () => {
  let error;
  try {
    await renderMonthlyReportPdf(html);
  } catch (err) {
    error = err;
  }
  assert.ok(error);
  assert.equal(error.code, "pdf_engine_missing");
});
