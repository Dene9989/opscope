const fs = require("fs");
const path = require("path");

require("dotenv").config();

function parseArgs(argv) {
  const args = {};
  let key = "";
  argv.forEach((token) => {
    if (token.startsWith("--")) {
      key = token.slice(2);
      if (!key) {
        return;
      }
      if (!(key in args)) {
        args[key] = true;
      }
      return;
    }
    if (!key) {
      return;
    }
    if (args[key] === true) {
      args[key] = token;
    } else if (Array.isArray(args[key])) {
      args[key].push(token);
    } else {
      args[key] = [args[key], token];
    }
  });
  return args;
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseBrazilianDateParts(value) {
  const text = normalizeText(value)
    .replace(/,\s*/g, " ")
    .replace(/\s+às?\s+/gi, " ")
    .replace(/\s*-\s*/g, " ");
  if (!text) {
    return null;
  }
  const match = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const hour = Number(match[4] || 0);
  const minute = Number(match[5] || 0);
  const second = Number(match[6] || 0);
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    return null;
  }
  return { day, month, year, hour, minute, second };
}

function parseDateTime(value) {
  if (!value && value !== 0) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const text = String(value).trim();
  if (!text) {
    return null;
  }
  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed;
  }
  const br = parseBrazilianDateParts(text);
  if (br) {
    const date = new Date(br.year, br.month - 1, br.day, br.hour, br.minute, br.second);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function getCompletedAt(item) {
  if (!item || typeof item !== "object") {
    return null;
  }
  const conclusao = item.conclusao && typeof item.conclusao === "object" ? item.conclusao : null;
  const encerramento =
    item.encerramento && typeof item.encerramento === "object" ? item.encerramento : null;
  const registroExecucao =
    item.registroExecucao && typeof item.registroExecucao === "object"
      ? item.registroExecucao
      : null;
  const candidates = [
    item.dataConclusao,
    item.doneAt,
    item.concluidaEm,
    item.concluidoEm,
    item.completedAt,
    item.executionFinishedAt,
    item.fimExecucao,
    item.fim,
    item.encerramentoEm,
    item.encerramentoFim,
    encerramento &&
      (encerramento.fim ||
        encerramento.dataFim ||
        encerramento.dataEncerramento ||
        encerramento.encerradoEm ||
        encerramento.concluidaEm),
    conclusao &&
      (conclusao.fim ||
        conclusao.dataFim ||
        conclusao.dataEncerramento ||
        conclusao.encerradoEm ||
        conclusao.concluidaEm),
    item.execucaoRegistradaEm,
    item.executionRegisteredAt,
    item.execucaoRegistradaAt,
    registroExecucao &&
      (registroExecucao.executedAt ||
        registroExecucao.executadoEm ||
        registroExecucao.registradoEm ||
        registroExecucao.dataFim ||
        registroExecucao.dataRef ||
        registroExecucao.data),
  ];
  let best = null;
  candidates.forEach((value) => {
    const parsed = parseDateTime(value);
    if (!parsed) {
      return;
    }
    if (!best || parsed.getTime() > best.getTime()) {
      best = parsed;
    }
  });
  if (!best && Array.isArray(item.registrosDiariosExecucao)) {
    item.registrosDiariosExecucao.forEach((entry) => {
      const parsed = parseDateTime(
        entry && (entry.registradoEm || entry.executadoEm || entry.data || entry.dataRef)
      );
      if (!parsed) {
        return;
      }
      if (!best || parsed.getTime() > best.getTime()) {
        best = parsed;
      }
    });
  }
  return best;
}

function monthRange(monthStr) {
  const match = String(monthStr || "").trim().match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null;
  }
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

function buildStoragePaths() {
  const storageDir = process.env.OPSCOPE_STORAGE_DIR
    ? path.resolve(process.env.OPSCOPE_STORAGE_DIR)
    : path.join(
        process.env.OPSCOPE_DATA_DIR ||
          process.env.APPDATA ||
          process.env.LOCALAPPDATA ||
          process.env.HOME ||
          path.resolve(__dirname, ".."),
        "opscope-storage"
      );
  const dataDir = process.env.OPSCOPE_DATA_DIR
    ? path.resolve(process.env.OPSCOPE_DATA_DIR)
    : path.join(storageDir, "data");
  return {
    storageDir,
    dataDir,
    maintenanceFile: path.join(dataDir, "maintenance.json"),
  };
}

async function loadFromDb() {
  const url = process.env.OPSCOPE_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    return null;
  }
  let Pool;
  try {
    ({ Pool } = require("pg"));
  } catch (error) {
    console.warn("[diag] pg nao instalado. Usando arquivo local.");
    return null;
  }
  const needsSsl =
    process.env.PGSSLMODE === "require" ||
    url.includes("sslmode=require") ||
    process.env.NODE_ENV === "production";
  const pool = new Pool({
    connectionString: url,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
  try {
    const res = await pool.query("SELECT payload FROM opscope_store WHERE key = $1", [
      "data/maintenance.json",
    ]);
    if (!res.rows.length) {
      return { source: "db", payload: [] };
    }
    const raw = res.rows[0].payload;
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return { source: "db", payload: parsed };
  } finally {
    await pool.end();
  }
}

function loadFromFile() {
  const { maintenanceFile } = buildStoragePaths();
  if (!fs.existsSync(maintenanceFile)) {
    return { source: "file", payload: [], exists: false, path: maintenanceFile };
  }
  const raw = fs.readFileSync(maintenanceFile, "utf8");
  const parsed = raw ? JSON.parse(raw) : [];
  return { source: "file", payload: parsed, exists: true, path: maintenanceFile };
}

function extractItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && Array.isArray(payload.items)) {
    return payload.items;
  }
  return [];
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const monthStr = String(args.month || "").trim() || "2026-03";
  const range = monthRange(monthStr);
  if (!range) {
    console.error("Use --month AAAA-MM (ex: 2026-03).");
    process.exit(1);
  }
  const projectFilter = String(args.project || args.projectId || "").trim();
  const useLocal = Boolean(args.local);

  const fileStore = loadFromFile();
  let store = fileStore;
  if (!useLocal) {
    loadFromDb()
      .then((dbStore) => {
        if (dbStore) {
          store = dbStore;
        }
        run(store);
      })
      .catch((error) => {
        console.warn("[diag] Falha ao ler DB. Usando arquivo local.", error.message || error);
        run(store);
      });
  } else {
    run(store);
  }

  function run(storeData) {
    const items = extractItems(storeData.payload || []);
    const rows = items.filter((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }
      if (projectFilter && String(item.projectId || "") !== projectFilter) {
        return false;
      }
      return true;
    });

    const executed = [];
    const statusCounts = {};
    rows.forEach((item) => {
      const status = normalizeText(item.status || "unknown") || "unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      const doneAt = getCompletedAt(item);
      if (doneAt && doneAt >= range.start && doneAt <= range.end) {
        executed.push({
          id: item.id,
          status: item.status,
          doneAt: doneAt.toISOString(),
          titulo: item.titulo || item.nome || "",
        });
      }
    });

    console.log(`[diag] Fonte: ${storeData.source || "file"} | Total itens: ${rows.length}`);
    console.log(`[diag] Executadas em ${monthStr}: ${executed.length}`);
    console.log("[diag] Status (top):");
    Object.keys(statusCounts)
      .sort((a, b) => (statusCounts[b] || 0) - (statusCounts[a] || 0))
      .slice(0, 10)
      .forEach((key) => {
        console.log(`  ${key}: ${statusCounts[key]}`);
      });
    console.log("[diag] Amostra executadas:");
    executed.slice(0, 10).forEach((entry) => {
      console.log(`  ${entry.id} | ${entry.status} | ${entry.doneAt} | ${entry.titulo}`);
    });
  }
}

main();
