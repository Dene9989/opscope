function tryRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (error) {
    return null;
  }
}

async function renderWithPuppeteer(html, options = {}) {
  const puppeteer = tryRequire("puppeteer");
  if (!puppeteer) {
    const error = new Error("PDF engine puppeteer not installed.");
    error.code = "pdf_engine_missing";
    throw error;
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "12mm", right: "12mm", bottom: "14mm", left: "12mm" },
      ...options.pdfOptions,
    });
    return buffer;
  } finally {
    await browser.close();
  }
}

async function renderWithPlaywright(html, options = {}) {
  const playwright = tryRequire("playwright");
  if (!playwright) {
    const error = new Error("PDF engine playwright not installed.");
    error.code = "pdf_engine_missing";
    throw error;
  }

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", right: "12mm", bottom: "14mm", left: "12mm" },
    ...options.pdfOptions,
  });
  await browser.close();
  return buffer;
}

module.exports = {
  renderWithPuppeteer,
  renderWithPlaywright,
};
