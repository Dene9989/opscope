function tryRequire(moduleName) {
  try {
    return require(moduleName);
  } catch (error) {
    return null;
  }
}

const fs = require("fs");
const path = require("path");
const os = require("os");

function findChromeExecutableFromCache(cacheDir) {
  if (!cacheDir) {
    return "";
  }
  const chromeRoot = path.join(cacheDir, "chrome");
  if (!fs.existsSync(chromeRoot)) {
    return "";
  }
  let entries = [];
  try {
    entries = fs.readdirSync(chromeRoot, { withFileTypes: true });
  } catch (error) {
    return "";
  }
  const versions = entries
    .filter((entry) => entry && entry.isDirectory && entry.isDirectory())
    .map((entry) => entry.name)
    .filter(Boolean)
    .sort()
    .reverse();
  const candidates = [
    ["chrome-linux64", "chrome"],
    ["chrome-linux", "chrome"],
    ["chrome-win64", "chrome.exe"],
    ["chrome-win", "chrome.exe"],
    ["chrome-mac", "Chromium.app/Contents/MacOS/Chromium"],
  ];
  for (const version of versions) {
    for (const [dirName, binName] of candidates) {
      const fullPath = path.join(chromeRoot, version, dirName, binName);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }
  }
  return "";
}

function resolvePuppeteerExecutablePath() {
  const explicit = String(process.env.PUPPETEER_EXECUTABLE_PATH || "").trim();
  if (explicit) {
    return explicit;
  }
  const cacheDirs = [
    String(process.env.PUPPETEER_CACHE_DIR || "").trim(),
    String(process.env.PUPPETEER_DOWNLOAD_PATH || "").trim(),
    path.join(process.cwd(), ".cache", "puppeteer"),
    path.join("/opt/render/project", ".cache", "puppeteer"),
    path.join("/opt/render", ".cache", "puppeteer"),
    path.join(os.homedir(), ".cache", "puppeteer"),
  ].filter(Boolean);
  for (const dir of cacheDirs) {
    const found = findChromeExecutableFromCache(dir);
    if (found) {
      return found;
    }
  }
  return "";
}

async function renderWithPuppeteer(html, options = {}) {
  const puppeteer = tryRequire("puppeteer");
  if (!puppeteer) {
    const error = new Error("PDF engine puppeteer not installed.");
    error.code = "pdf_engine_missing";
    throw error;
  }

  let executablePath = resolvePuppeteerExecutablePath();
  if (!executablePath && puppeteer && typeof puppeteer.executablePath === "function") {
    const autoPath = puppeteer.executablePath();
    if (autoPath && fs.existsSync(autoPath)) {
      executablePath = autoPath;
    }
  }
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ...(executablePath ? { executablePath } : {}),
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
