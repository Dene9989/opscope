import process from "node:process";
import { performance } from "node:perf_hooks";

function parseArgs(argv) {
  const out = {};
  argv.forEach((entry) => {
    const raw = String(entry || "").trim();
    if (!raw.startsWith("--")) {
      return;
    }
    const idx = raw.indexOf("=");
    if (idx === -1) {
      out[raw.slice(2)] = "true";
      return;
    }
    const key = raw.slice(2, idx).trim();
    const value = raw.slice(idx + 1).trim();
    if (key) {
      out[key] = value;
    }
  });
  return out;
}

function toInt(value, fallback, min = 1, max = 10000) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n)) {
    return fallback;
  }
  if (n < min) {
    return min;
  }
  if (n > max) {
    return max;
  }
  return n;
}

function isoDateToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
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

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function timedRequest(url, options = {}) {
  const timeoutMs = options.timeoutMs || 30000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = performance.now();
  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body,
      signal: controller.signal,
    });
    const text = await response.text();
    const elapsedMs = performance.now() - startedAt;
    let payload = null;
    try {
      payload = JSON.parse(text);
    } catch (_) {
      payload = null;
    }
    return {
      status: response.status,
      ok: response.ok,
      elapsedMs,
      bytes: Buffer.byteLength(text, "utf8"),
      payload,
      text,
    };
  } finally {
    clearTimeout(timer);
  }
}

function buildUrl(baseUrl, path, params = {}) {
  const url = new URL(path, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

function printResult(name, result) {
  const time = `${Math.round(result.elapsedMs)} ms`;
  console.log(
    `${name.padEnd(24)} status=${String(result.status).padEnd(4)} time=${time.padEnd(8)} bytes=${formatBytes(result.bytes)}`
  );
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args.base || process.env.OPSCOPE_BASE_URL || "http://127.0.0.1:3000";
  const cookie = args.cookie || process.env.OPSCOPE_COOKIE || "";
  const projectId = args.projectId || process.env.OPSCOPE_PROJECT_ID || "";
  const date = args.date || process.env.OPSCOPE_TURN_PLAN_DATE || isoDateToday();
  const shift = args.shift || process.env.OPSCOPE_TURN_PLAN_SHIFT || "all";
  const mode = args.mode || process.env.OPSCOPE_TURN_PLAN_MODE || "assisted";
  const limit = toInt(args.limit || process.env.OPSCOPE_TURN_PLAN_LIMIT, 20, 1, 20);
  const timeoutMs = toInt(args.timeoutMs || process.env.OPSCOPE_TIMEOUT_MS, 30000, 1000, 120000);

  const headers = {
    Accept: "application/json",
  };
  if (cookie) {
    headers.Cookie = cookie;
  }

  const planUrl = buildUrl(baseUrl, "/api/turn-plan", {
    projectId,
    source: "inteligencia",
    date,
    shift,
    mode,
    limit,
    page: 1,
  });
  const planResult = await timedRequest(planUrl, { headers, timeoutMs });
  printResult("GET /api/turn-plan", planResult);
  assert(planResult.status === 200, `turn-plan status esperado 200, recebido ${planResult.status}`);
  assert(planResult.payload && planResult.payload.ok, "turn-plan payload inválido");
  assert(Array.isArray(planResult.payload.actions), "turn-plan actions deve ser array");
  assert(planResult.payload.actions.length <= 20, "turn-plan actions excedeu limite de 20");
  assert(planResult.bytes <= 1024 * 1024, "turn-plan response acima de 1MB");

  const firstAction = planResult.payload.actions[0] || null;
  if (firstAction && firstAction.id && planResult.payload.planId) {
    const feedbackUrl = buildUrl(
      baseUrl,
      `/api/turn-plan/${encodeURIComponent(planResult.payload.planId)}/feedback`
    );
    const feedbackResult = await timedRequest(feedbackUrl, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actionId: String(firstAction.id),
        outcome: "unknown",
        notes: "Smoke test feedback",
      }),
      timeoutMs,
    });
    printResult("POST /feedback", feedbackResult);
    assert(feedbackResult.status === 200, `feedback status esperado 200, recebido ${feedbackResult.status}`);
    assert(feedbackResult.payload && feedbackResult.payload.ok, "feedback payload inválido");
  } else {
    console.log("POST /feedback              skipped (sem ações disponíveis)");
  }

  const metricsUrl = buildUrl(baseUrl, "/api/turn-plan/metrics", {
    projectId,
    range: "30d",
  });
  const metricsResult = await timedRequest(metricsUrl, { headers, timeoutMs });
  printResult("GET /api/turn-plan/metrics", metricsResult);
  assert(metricsResult.status === 200, `metrics status esperado 200, recebido ${metricsResult.status}`);
  assert(metricsResult.payload && metricsResult.payload.ok, "metrics payload inválido");
  assert(
    metricsResult.payload.metrics && typeof metricsResult.payload.metrics === "object",
    "metrics ausente"
  );

  console.log("Smoke turn-plan concluído com sucesso.");
}

run().catch((error) => {
  console.error("Smoke turn-plan falhou:", error && error.message ? error.message : error);
  process.exitCode = 1;
});

