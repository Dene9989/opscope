import process from "node:process";
import { performance } from "node:perf_hooks";

function parseArgs(argv) {
  const out = {};
  argv.forEach((entry) => {
    const raw = String(entry || "").trim();
    if (!raw.startsWith("--")) {
      return;
    }
    const eqIndex = raw.indexOf("=");
    if (eqIndex === -1) {
      out[raw.slice(2)] = "true";
      return;
    }
    const key = raw.slice(2, eqIndex).trim();
    const value = raw.slice(eqIndex + 1).trim();
    if (key) {
      out[key] = value;
    }
  });
  return out;
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(String(value === undefined || value === null ? "" : value), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  if (value < 1024) {
    return `${value} B`;
  }
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function formatMs(ms) {
  return `${Math.round(Number(ms) || 0)} ms`;
}

async function timedFetch(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);
  const headers = {
    Accept: "application/json",
  };
  if (options.cookie) {
    headers.Cookie = options.cookie;
  }
  const startedAt = performance.now();
  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });
    const body = await response.text();
    const elapsedMs = performance.now() - startedAt;
    let payload = null;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      payload = null;
    }
    return {
      ok: response.ok,
      status: response.status,
      elapsedMs,
      bytes: Buffer.byteLength(body, "utf8"),
      payload,
    };
  } finally {
    clearTimeout(timer);
  }
}

function buildUrl(baseUrl, params) {
  const url = new URL("/api/maintenance", baseUrl);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

function resultToRow(name, result, extra = {}) {
  const items = Array.isArray(result.payload && result.payload.items)
    ? result.payload.items.length
    : 0;
  const totalItems = Number(
    result.payload &&
      result.payload.pagination &&
      Number.isFinite(Number(result.payload.pagination.totalItems))
      ? Number(result.payload.pagination.totalItems)
      : items
  );
  return {
    case: name,
    status: result.status,
    timeMs: Math.round(result.elapsedMs),
    bytes: result.bytes,
    items,
    totalItems,
    note: extra.note || "",
  };
}

function printRows(rows) {
  const header = [
    "case".padEnd(22),
    "status".padEnd(8),
    "time".padEnd(10),
    "bytes".padEnd(12),
    "items".padEnd(8),
    "total".padEnd(8),
    "note",
  ].join(" ");
  console.log(header);
  console.log("-".repeat(header.length));
  rows.forEach((row) => {
    console.log(
      [
        String(row.case || "").padEnd(22),
        String(row.status || "").padEnd(8),
        formatMs(row.timeMs).padEnd(10),
        formatBytes(row.bytes).padEnd(12),
        String(row.items || 0).padEnd(8),
        String(row.totalItems || 0).padEnd(8),
        String(row.note || ""),
      ].join(" ")
    );
  });
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.base || process.env.OPSCOPE_BASE_URL || "http://127.0.0.1:3000";
  const projectId = args.projectId || process.env.OPSCOPE_PROJECT_ID || "";
  const cookie = args.cookie || process.env.OPSCOPE_COOKIE || "";
  const timeoutMs = toPositiveInt(args.timeoutMs || process.env.OPSCOPE_TIMEOUT_MS, 30000);
  const limit = toPositiveInt(args.limit || process.env.OPSCOPE_LIMIT, 100);
  const maxPages = toPositiveInt(args.maxPages || process.env.OPSCOPE_MAX_PAGES, 200);

  const common = {
    projectId,
    mode: "full",
    summary: "false",
  };

  const rows = [];

  const legacyUrl = buildUrl(baseUrl, {
    ...common,
    all: "true",
    limit,
  });
  const legacyResult = await timedFetch(legacyUrl, { cookie, timeoutMs });
  rows.push(resultToRow("legacy-all", legacyResult));

  const page1Url = buildUrl(baseUrl, {
    ...common,
    page: 1,
    limit,
  });
  const page1Result = await timedFetch(page1Url, { cookie, timeoutMs });
  rows.push(resultToRow("paged-page-1", page1Result));

  const summaryPage1Url = buildUrl(baseUrl, {
    ...common,
    mode: "summary",
    summary: "true",
    page: 1,
    limit,
  });
  const summaryPage1Result = await timedFetch(summaryPage1Url, { cookie, timeoutMs });
  rows.push(resultToRow("summary-page-1", summaryPage1Result));

  let aggregateBytes = 0;
  let aggregateMs = 0;
  let aggregateItems = 0;
  let aggregateStatus = 200;
  let aggregateTotalItems = 0;
  let hasNextPage = true;
  let page = 1;
  let fetchedPages = 0;

  while (hasNextPage && fetchedPages < maxPages) {
    const url = buildUrl(baseUrl, {
      ...common,
      page,
      limit,
    });
    const result = await timedFetch(url, { cookie, timeoutMs });
    fetchedPages += 1;
    aggregateStatus = result.status;
    aggregateBytes += result.bytes;
    aggregateMs += result.elapsedMs;
    const items = Array.isArray(result.payload && result.payload.items)
      ? result.payload.items.length
      : 0;
    aggregateItems += items;
    const pagination = result.payload && result.payload.pagination ? result.payload.pagination : null;
    if (pagination && Number.isFinite(Number(pagination.totalItems))) {
      aggregateTotalItems = Number(pagination.totalItems);
    }
    hasNextPage = Boolean(pagination && pagination.hasNextPage);
    page += 1;
    if (!result.ok) {
      hasNextPage = false;
    }
  }

  rows.push({
    case: "paged-aggregate",
    status: aggregateStatus,
    timeMs: Math.round(aggregateMs),
    bytes: aggregateBytes,
    items: aggregateItems,
    totalItems: aggregateTotalItems || aggregateItems,
    note:
      fetchedPages >= maxPages && hasNextPage
        ? `stopped at ${maxPages} pages`
        : `${fetchedPages} pages`,
  });

  console.log("Maintenance response benchmark");
  console.log(`base=${baseUrl}`);
  console.log(`projectId=${projectId || "(active project from session)"}`);
  console.log(`limit=${limit} timeoutMs=${timeoutMs}`);
  printRows(rows);

  const legacy = rows.find((row) => row.case === "legacy-all");
  const page1 = rows.find((row) => row.case === "paged-page-1");
  if (legacy && page1 && legacy.bytes > 0 && page1.bytes > 0) {
    const reductionPct = Math.max(0, ((legacy.bytes - page1.bytes) / legacy.bytes) * 100);
    console.log(
      `single-response reduction (legacy-all -> paged-page-1): ${reductionPct.toFixed(1)}%`
    );
  }
}

run().catch((error) => {
  console.error("Failed to run benchmark:", error && error.message ? error.message : error);
  process.exitCode = 1;
});
