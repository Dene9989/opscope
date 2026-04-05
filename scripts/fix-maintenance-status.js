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

function formatIsoDate(date) {
  if (!date) {
    return "";
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return parsed.toISOString().slice(0, 10);
}

function updateToConcluida(item, options = {}) {
  const nowIso = new Date().toISOString();
  const conclusao = item.conclusao && typeof item.conclusao === "object" ? item.conclusao : null;
  const doneAt =
    item.doneAt ||
    (conclusao && conclusao.fim) ||
    item.executionFinishedAt ||
    item.executionRegisteredAt ||
    nowIso;
  const doneBy =
    item.doneBy ||
    (conclusao && conclusao.encerradoPor) ||
    item.updatedBy ||
    item.executionStartedBy ||
    "";
  const executionFinishedAt = item.executionFinishedAt || (conclusao && conclusao.fim) || doneAt;
  const dataConclusao = formatIsoDate(doneAt);
  const force = Boolean(options.force);
  if (!conclusao && !force) {
    throw new Error("Conclusão ausente. Use --force para concluir mesmo assim.");
  }
  return {
    ...item,
    status: "concluida",
    doneAt: doneAt,
    doneBy: doneBy,
    executionFinishedAt: executionFinishedAt,
    concluidaEm: doneAt,
    dataConclusao: dataConclusao || item.dataConclusao || "",
    updatedAt: nowIso,
    updatedBy: options.updatedBy || doneBy || item.updatedBy || "",
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const id = String(args.id || "").trim();
  const date = String(args.date || "").trim();
  const title = String(args.title || "").trim();
  const local = String(args.local || "").trim();
  const status = String(args.status || "concluida").trim().toLowerCase();
  const dryRun = Boolean(args["dry-run"] || args.dryRun);
  const force = Boolean(args.force);
  const applyAll = Boolean(args.all || args["apply-all"]);
  const updatedBy = String(args.by || args.updatedBy || "").trim();

  if (!id && !date && !title && !local) {
    console.error(
      "Informe ao menos um filtro: --id, --date (YYYY-MM-DD), --title ou --local."
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
  const normalizedTitle = normalizeText(title);
  const normalizedLocal = normalizeText(local);

  const matches = items.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    if (id && String(item.id || "") !== id) {
      return false;
    }
    if (date && String(item.data || "") !== date) {
      return false;
    }
    if (normalizedTitle && !normalizeText(item.titulo).includes(normalizedTitle)) {
      return false;
    }
    if (normalizedLocal && !normalizeText(item.local).includes(normalizedLocal)) {
      return false;
    }
    return true;
  });

  if (!matches.length) {
    console.error("Nenhuma manutenção encontrada com os filtros informados.");
    process.exit(1);
  }
  if (matches.length > 1 && !id && !applyAll) {
    console.error("Mais de uma manutenção encontrada. Use --id para escolher.");
    matches.forEach((item) => {
      console.error(
        `- ${item.id} | ${item.titulo} | ${item.data} | ${item.local} | status=${item.status}`
      );
    });
    console.error("Para aplicar em todas, repita com --all.");
    process.exit(1);
  }

  const targets = matches.length > 1 && applyAll ? matches : [matches[0]];
  targets.forEach((target) => {
    console.log(
      `Encontrada: ${target.id} | ${target.titulo} | ${target.data} | status=${target.status}`
    );
  });

  if (status !== "concluida") {
    console.error("Este script atualmente suporta apenas --status=concluida.");
    process.exit(1);
  }

  const updatesById = new Map();
  const errors = [];
  targets.forEach((target) => {
    try {
      const atualizado = updateToConcluida(target, { force, updatedBy });
      updatesById.set(String(atualizado.id), atualizado);
    } catch (error) {
      errors.push({
        id: target.id,
        message: error && error.message ? error.message : String(error),
      });
    }
  });
  if (errors.length) {
    errors.forEach((entry) => {
      console.error(`Erro em ${entry.id}: ${entry.message}`);
    });
    process.exit(1);
  }

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
            status: atualizado.status,
            doneAt: atualizado.doneAt,
            doneBy: atualizado.doneBy,
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
    console.error("Nenhum destino disponivel para salvar (arquivo local ausente e DATABASE_URL vazio).");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
