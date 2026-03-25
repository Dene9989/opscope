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
    console.warn("[fix] pg nao instalado. Usando arquivo local.");
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
    return { source: "file", payload: [] };
  }
  const raw = fs.readFileSync(maintenanceFile, "utf8");
  const parsed = raw ? JSON.parse(raw) : [];
  return { source: "file", payload: parsed };
}

async function saveToDb(payload) {
  const url = process.env.OPSCOPE_DATABASE_URL || process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL ausente.");
  }
  const { Pool } = require("pg");
  const needsSsl =
    process.env.PGSSLMODE === "require" ||
    url.includes("sslmode=require") ||
    process.env.NODE_ENV === "production";
  const pool = new Pool({
    connectionString: url,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
  try {
    const serialized = JSON.stringify(payload);
    await pool.query(
      `INSERT INTO opscope_store (key, payload, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (key)
       DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
      ["data/maintenance.json", serialized]
    );
  } finally {
    await pool.end();
  }
}

function saveToFile(payload) {
  const { maintenanceFile } = buildStoragePaths();
  fs.mkdirSync(path.dirname(maintenanceFile), { recursive: true });
  fs.writeFileSync(maintenanceFile, JSON.stringify(payload, null, 2));
}

function extractItems(payload) {
  if (Array.isArray(payload)) {
    return { items: payload, wrapper: null };
  }
  if (payload && Array.isArray(payload.items)) {
    return { items: payload.items, wrapper: payload };
  }
  return { items: [], wrapper: payload };
}

function buildPayload(items, wrapper) {
  if (wrapper && typeof wrapper === "object" && Array.isArray(wrapper.items)) {
    return { ...wrapper, items };
  }
  return items;
}

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeIso(value) {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value || "").trim();
  }
  return parsed.toISOString();
}

function hasCompletionData(item) {
  if (!item || typeof item !== "object") {
    return false;
  }
  const conclusao = item.conclusao && typeof item.conclusao === "object" ? item.conclusao : null;
  return Boolean(
    item.doneAt ||
      item.concluidaEm ||
      item.dataConclusao ||
      item.completedAt ||
      item.executionFinishedAt ||
      (conclusao && conclusao.fim)
  );
}

function resolveDoneAt(item) {
  if (!item || typeof item !== "object") {
    return "";
  }
  const conclusao = item.conclusao && typeof item.conclusao === "object" ? item.conclusao : null;
  const raw =
    item.doneAt ||
    item.executionFinishedAt ||
    item.concluidaEm ||
    item.dataConclusao ||
    item.completedAt ||
    (conclusao && conclusao.fim) ||
    item.executionRegisteredAt ||
    item.execucaoRegistradaEm ||
    "";
  return normalizeIso(raw);
}

function updateToConcluida(item, updatedBy = "") {
  const nowIso = new Date().toISOString();
  const doneAt = resolveDoneAt(item) || nowIso;
  const doneBy =
    item.doneBy ||
    (item.conclusao && item.conclusao.encerradoPor) ||
    item.updatedBy ||
    item.executionStartedBy ||
    "";
  return {
    ...item,
    status: "concluida",
    doneAt: doneAt,
    executionFinishedAt: item.executionFinishedAt || doneAt,
    concluidaEm: item.concluidaEm || doneAt,
    updatedAt: nowIso,
    updatedBy: updatedBy || doneBy || item.updatedBy || "",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectId = String(args.project || args.projectId || "").trim();
  const title = String(args.title || "").trim();
  const local = String(args.local || "").trim();
  const dryRun = Boolean(args["dry-run"] || args.dryRun);
  const updatedBy = String(args.by || args.updatedBy || "").trim();
  const limit = Number.isFinite(Number(args.limit)) ? Math.max(0, Number(args.limit)) : 0;

  let store = null;
  try {
    store = await loadFromDb();
  } catch (error) {
    console.warn("[fix] Falha ao ler do banco. Usando arquivo local.", error.message || error);
    store = null;
  }
  if (!store) {
    store = loadFromFile();
  }

  const { items, wrapper } = extractItems(store.payload);
  const normalizedTitle = normalizeText(title);
  const normalizedLocal = normalizeText(local);

  const matches = items.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    if (projectId && String(item.projectId || "") !== projectId) {
      return false;
    }
    if (normalizedTitle && !normalizeText(item.titulo).includes(normalizedTitle)) {
      return false;
    }
    if (normalizedLocal && !normalizeText(item.local).includes(normalizedLocal)) {
      return false;
    }
    const status = normalizeStatus(item.status);
    if (status === "concluida" || status === "cancelada") {
      return false;
    }
    return hasCompletionData(item);
  });

  if (!matches.length) {
    console.log("Nenhuma manutencao a corrigir.");
    return;
  }

  console.log(`Encontradas ${matches.length} manutencoes com conclusao e status incorreto.`);
  const sample = matches.slice(0, 10);
  sample.forEach((item) => {
    console.log(
      `- ${item.id} | ${item.titulo || item.nome || "-"} | ${item.data || "-"} | status=${item.status}`
    );
  });

  if (dryRun) {
    console.log("Dry-run ativo. Nenhuma alteracao foi salva.");
    return;
  }

  const updatedItems = new Set(matches.map((item) => String(item.id || "")));
  const nextItems = items.map((item) =>
    item && updatedItems.has(String(item.id || "")) ? updateToConcluida(item, updatedBy) : item
  );

  const nextPayload = buildPayload(nextItems, wrapper);
  if (store.source === "db") {
    await saveToDb(nextPayload);
    console.log("Atualizado no banco com sucesso.");
  } else {
    saveToFile(nextPayload);
    console.log("Atualizado no arquivo local com sucesso.");
  }

  if (limit > 0) {
    console.log(`Observacao: limite informado ${limit} (nao aplicado).`);
  }
}

main().catch((error) => {
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
