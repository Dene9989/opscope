/* eslint-disable no-console */
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
    contingenciesFile: path.join(dataDir, "contingencies.json"),
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
    console.warn("[fix] pg não instalado. Usando arquivo local.");
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
      "data/contingencies.json",
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
  const { contingenciesFile } = buildStoragePaths();
  if (!fs.existsSync(contingenciesFile)) {
    return { source: "file", payload: [], exists: false, path: contingenciesFile };
  }
  const raw = fs.readFileSync(contingenciesFile, "utf8");
  const parsed = raw ? JSON.parse(raw) : [];
  return { source: "file", payload: parsed, exists: true, path: contingenciesFile };
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
      ["data/contingencies.json", serialized]
    );
  } finally {
    await pool.end();
  }
}

function saveToFile(payload) {
  const { contingenciesFile } = buildStoragePaths();
  fs.mkdirSync(path.dirname(contingenciesFile), { recursive: true });
  fs.writeFileSync(contingenciesFile, JSON.stringify(payload, null, 2));
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

function toDateKey(value) {
  if (!value) {
    return "";
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }
  const str = String(value);
  return str.length >= 10 ? str.slice(0, 10) : "";
}

function updateSeverity(item, severity, updatedBy) {
  const nowIso = new Date().toISOString();
  return {
    ...item,
    severity: severity,
    updatedAt: nowIso,
    updatedBy: updatedBy || item.updatedBy || "",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const id = String(args.id || "").trim();
  const code = String(args.code || "").trim();
  const date = String(args.date || "").trim();
  const project = String(args.project || "").trim();
  const severity = String(args.severity || "S1").trim();
  const dryRun = Boolean(args["dry-run"] || args.dryRun);
  const applyAll = Boolean(args.all || args["apply-all"]);
  const updatedBy = String(args.by || args.updatedBy || "").trim();

  if (!id && !code && !date && !project) {
    console.error(
      "Informe ao menos um filtro: --id, --code, --date (YYYY-MM-DD) ou --project."
    );
    process.exit(1);
  }

  const fileStore = loadFromFile();
  let store = fileStore;
  let dbStore = null;
  if (!fileStore.exists) {
    try {
      dbStore = await loadFromDb();
    } catch (error) {
      console.warn("[fix] Falha ao ler do banco. Usando arquivo local.", error.message || error);
      dbStore = null;
    }
    if (dbStore) {
      store = dbStore;
    }
  }

  const { items, wrapper } = extractItems(store.payload);
  const normalizedProject = normalizeText(project);
  const normalizedCode = normalizeText(code);

  const matches = items.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    if (id && String(item.id || "") !== id) {
      return false;
    }
    if (normalizedCode && normalizeText(item.code || item.codigo).indexOf(normalizedCode) === -1) {
      return false;
    }
    if (date) {
      const key = toDateKey(item.startAt || item.startDate || item.inicio);
      if (key !== date) {
        return false;
      }
    }
    if (normalizedProject) {
      const projectText = normalizeText(item.projectId || item.project || "");
      if (!projectText.includes(normalizedProject)) {
        return false;
      }
    }
    return true;
  });

  if (!matches.length) {
    console.error("Nenhuma contingência encontrada com os filtros informados.");
    process.exit(1);
  }
  if (matches.length > 1 && !id && !code && !applyAll) {
    console.error("Mais de uma contingência encontrada. Use --id ou --code para escolher.");
    matches.forEach((item) => {
      console.error(
        `- ${item.id} | ${item.code || item.codigo || "-"} | ${toDateKey(
          item.startAt || item.startDate || item.inicio
        )} | severity=${item.severity || ""}`
      );
    });
    console.error("Para aplicar em todas, repita com --all.");
    process.exit(1);
  }

  const targets = matches.length > 1 && applyAll ? matches : [matches[0]];
  targets.forEach((target) => {
    console.log(
      `Encontrada: ${target.id} | ${target.code || target.codigo || "-"} | severity=${
        target.severity || ""
      }`
    );
  });

  const updatesById = new Map();
  targets.forEach((target) => {
    const atualizado = updateSeverity(target, severity, updatedBy);
    updatesById.set(String(atualizado.id), atualizado);
  });

  const nextItems = items.map((item) => {
    if (!item || !item.id) {
      return item;
    }
    const updated = updatesById.get(String(item.id));
    return updated || item;
  });
  const nextPayload = buildPayload(nextItems, wrapper);

  if (dryRun) {
    console.log("Dry-run ativo. Nenhuma alteração foi salva.");
    updatesById.forEach((atualizado) => {
      console.log(
        JSON.stringify(
          {
            id: atualizado.id,
            code: atualizado.code || atualizado.codigo || "",
            severity: atualizado.severity,
            updatedAt: atualizado.updatedAt,
          },
          null,
          2
        )
      );
    });
    return;
  }

  const dbConfigured = Boolean(process.env.OPSCOPE_DATABASE_URL || process.env.DATABASE_URL);
  let saved = false;
  if (fileStore.exists) {
    saveToFile(nextPayload);
    console.log("Atualizado no arquivo local com sucesso.");
    saved = true;
  }
  if (dbConfigured) {
    await saveToDb(nextPayload);
    console.log("Atualizado no banco com sucesso.");
    saved = true;
  }
  if (!saved) {
    console.error("Nenhum destino disponível para salvar (arquivo local ausente e DATABASE_URL vazio).");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
