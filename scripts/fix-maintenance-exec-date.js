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

function parseDateParts(value) {
  const match = String(value || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseTimeParts(value) {
  if (!value) {
    return null;
  }
  const match = String(value || "")
    .trim()
    .match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) {
    return null;
  }
  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: Number(match[3] || 0),
  };
}

function getItemTitle(item) {
  return (
    (item && (item.titulo || item.nome || item.name)) ||
    (item && item.templateTitulo) ||
    ""
  );
}

function getItemLocal(item) {
  return item && (item.local || item.subestacao || item.localizacao) ? item.local || item.subestacao || item.localizacao : "";
}

function getItemEquipamento(item) {
  const equip = item && item.equipamento !== undefined ? item.equipamento : "";
  if (typeof equip === "string") {
    return equip;
  }
  if (equip && typeof equip === "object") {
    return equip.nome || equip.name || equip.id || "";
  }
  return item && item.equipamentoId ? item.equipamentoId : "";
}

function getItemOsRef(item) {
  const conclusao = item && item.conclusao && typeof item.conclusao === "object" ? item.conclusao : null;
  const liberacao = item && item.liberacao && typeof item.liberacao === "object" ? item.liberacao : null;
  return (
    (item && (item.osReferencia || item.os || item.referencia)) ||
    (conclusao && (conclusao.referencia || conclusao.osNumero)) ||
    (liberacao && liberacao.osNumero) ||
    ""
  );
}

function buildTargetIso(item, dateStr, timeStr) {
  const dateParts = parseDateParts(dateStr);
  if (!dateParts) {
    throw new Error("Data inválida. Use AAAA-MM-DD.");
  }
  let time = parseTimeParts(timeStr);
  if (!time) {
    const base =
      (item && (item.doneAt || item.executionFinishedAt)) ||
      (item && item.conclusao && item.conclusao.fim) ||
      "";
    const baseDate = base ? new Date(base) : null;
    if (baseDate && !Number.isNaN(baseDate.getTime())) {
      time = {
        hour: baseDate.getUTCHours(),
        minute: baseDate.getUTCMinutes(),
        second: baseDate.getUTCSeconds(),
      };
    } else {
      time = { hour: 12, minute: 0, second: 0 };
    }
  }
  const utcMillis = Date.UTC(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    time.hour,
    time.minute,
    time.second
  );
  return new Date(utcMillis).toISOString();
}

function pickLatestDailyIndex(list) {
  if (!Array.isArray(list) || !list.length) {
    return -1;
  }
  let bestIndex = 0;
  let bestTime = 0;
  list.forEach((entry, idx) => {
    const ts = Date.parse(
      entry && (entry.registradoEm || entry.updatedAt || entry.createdAt || "")
    );
    const time = Number.isNaN(ts) ? 0 : ts;
    if (time >= bestTime) {
      bestTime = time;
      bestIndex = idx;
    }
  });
  return bestIndex;
}

function updateMaintenanceDates(item, targetIso, dateKey, actorId) {
  const nowIso = new Date().toISOString();
  const next = { ...item };
  next.doneAt = targetIso;
  next.executionFinishedAt = targetIso;
  next.concluidaEm = targetIso;
  next.dataConclusao = dateKey;
  next.execucaoRegistradaEm = targetIso;
  next.executionRegisteredAt = targetIso;
  next.execucaoRegistradaAt = targetIso;
  next.updatedAt = nowIso;
  next.updatedBy = actorId || next.updatedBy || "system";

  if (next.conclusao && typeof next.conclusao === "object") {
    next.conclusao = {
      ...next.conclusao,
      fim: targetIso,
    };
  }

  if (next.registroExecucao && typeof next.registroExecucao === "object") {
    next.registroExecucao = {
      ...next.registroExecucao,
      dataRef: dateKey,
      registradoEm: targetIso,
    };
  }

  if (Array.isArray(next.registrosDiariosExecucao) && next.registrosDiariosExecucao.length) {
    const lista = next.registrosDiariosExecucao.map((entry) => ({ ...entry }));
    const idx = pickLatestDailyIndex(lista);
    if (idx >= 0) {
      lista[idx].dataRef = dateKey;
      lista[idx].registradoEm = targetIso;
    }
    next.registrosDiariosExecucao = lista;
  }

  return next;
}

function printUsage() {
  console.log("Uso:");
  console.log("  node ./scripts/fix-maintenance-exec-date.js --id <ID> --date AAAA-MM-DD [--time HH:MM] [--by <matricula>] [--dry-run]");
  console.log("  node ./scripts/fix-maintenance-exec-date.js --title \"...\" --local \"...\" --equip \"...\" --date AAAA-MM-DD --dry-run");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const id = String(args.id || "").trim();
  const titleFilter = String(args.title || "").trim();
  const localFilter = String(args.local || "").trim();
  const equipFilter = String(args.equip || args.equipment || "").trim();
  const osFilter = String(args.os || args.ref || "").trim();
  const projectFilter = String(args.project || args.projectId || "").trim();
  const dateStr = String(args.date || "").trim();
  const timeStr = String(args.time || "").trim();
  const actorId = String(args.by || args.actor || "").trim();
  const dryRun = Boolean(args["dry-run"] || args.dryRun);

  if (!dateStr) {
    console.error("[fix] Informe --date AAAA-MM-DD.");
    printUsage();
    process.exit(1);
  }

  const fileStore = loadFromFile();
  let source = fileStore;
  let dbStore = null;
  if (!fileStore.exists) {
    try {
      dbStore = await loadFromDb();
    } catch (error) {
      console.warn("[fix] Falha ao ler do banco. Usando arquivo local.", error.message || error);
      dbStore = null;
    }
    if (dbStore) {
      source = dbStore;
    }
  }
  const { items, wrapper } = extractItems(source.payload);

  const normalizedTitle = normalizeText(titleFilter);
  const normalizedLocal = normalizeText(localFilter);
  const normalizedEquip = normalizeText(equipFilter);
  const normalizedOs = normalizeText(osFilter);
  const normalizedProject = normalizeText(projectFilter);

  const matches = items.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    if (id && String(item.id || "") !== id) {
      return false;
    }
    if (normalizedProject) {
      const proj = normalizeText(item.projectId || "");
      if (!proj.includes(normalizedProject)) {
        return false;
      }
    }
    if (normalizedTitle) {
      const title = normalizeText(getItemTitle(item));
      if (!title.includes(normalizedTitle)) {
        return false;
      }
    }
    if (normalizedLocal) {
      const local = normalizeText(getItemLocal(item));
      if (!local.includes(normalizedLocal)) {
        return false;
      }
    }
    if (normalizedEquip) {
      const equip = normalizeText(getItemEquipamento(item));
      if (!equip.includes(normalizedEquip)) {
        return false;
      }
    }
    if (normalizedOs) {
      const os = normalizeText(getItemOsRef(item));
      if (!os.includes(normalizedOs)) {
        return false;
      }
    }
    return true;
  });

  if (!matches.length) {
    console.error("[fix] Nenhuma manutenção encontrada com os filtros informados.");
    process.exit(1);
  }

  if (!id && matches.length !== 1) {
    console.log("[fix] Mais de uma manutenção encontrada. Use --id para escolher:");
    matches.forEach((item) => {
      console.log(
        `- ${item.id} | ${getItemTitle(item)} | ${item.data || "-"} | ${getItemLocal(item)} | status=${item.status}`
      );
    });
    process.exit(1);
  }

  const target = id ? matches.find((item) => String(item.id || "") === id) : matches[0];
  if (!target) {
    console.error("[fix] Manutenção alvo não encontrada.");
    process.exit(1);
  }

  const targetIso = buildTargetIso(target, dateStr, timeStr);
  const updated = updateMaintenanceDates(target, targetIso, dateStr, actorId);

  console.log(`[fix] Alvo: ${target.id} | ${getItemTitle(target)} | status=${target.status}`);
  console.log(`[fix] Data conclusão atual: ${target.doneAt || target.executionFinishedAt || (target.conclusao ? target.conclusao.fim : "") || "-"}`);
  console.log(`[fix] Nova data conclusão:  ${targetIso}`);
  if (dryRun) {
    console.log("[fix] --dry-run ativo. Nenhuma alteração aplicada.");
    return;
  }

  const nextItems = items.map((item) => (item && item.id === target.id ? updated : item));
  const payload = buildPayload(nextItems, wrapper);

  const dbConfigured = Boolean(process.env.OPSCOPE_DATABASE_URL || process.env.DATABASE_URL);
  let saved = false;
  if (fileStore.exists) {
    saveToFile(payload);
    console.log("[fix] Atualizado no arquivo local com sucesso.");
    saved = true;
  }
  if (dbConfigured) {
    await saveToDb(payload);
    console.log("[fix] Atualizado no banco com sucesso.");
    saved = true;
  }
  if (!saved) {
    console.error(
      "[fix] Nenhum destino disponivel para salvar (arquivo local ausente e DATABASE_URL vazio)."
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[fix] Erro:", error && error.message ? error.message : error);
  process.exit(1);
});
