const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const archiver = require("archiver");
const fastCsv = require("fast-csv");

let PgClient = null;
try {
  ({ Client: PgClient } = require("pg"));
} catch (_) {
  PgClient = null;
}

const FACT_HEADERS = [
  "event_id",
  "event_type",
  "event_ts",
  "date_key",
  "user_id",
  "severity",
  "status",
  "title",
  "source",
  "details_json",
];
const DATE_HEADERS = [
  "date_key",
  "date_iso",
  "year",
  "quarter",
  "month",
  "month_name",
  "day",
  "day_of_week",
  "day_name",
  "week_of_year",
  "is_weekend",
];
const USER_HEADERS = ["user_id", "name", "email", "role"];
const DICT_HEADERS = ["table", "column", "type", "description"];
const DICT_ROWS = [
  ["facts_events", "event_id", "text", "ID do evento"],
  ["facts_events", "event_type", "text", "Tipo de evento"],
  ["facts_events", "event_ts", "datetime", "Timestamp em ISO"],
  ["facts_events", "date_key", "int", "Chave YYYYMMDD"],
  ["facts_events", "user_id", "text", "Usuario do evento"],
  ["facts_events", "severity", "text", "Severidade"],
  ["facts_events", "status", "text", "Status"],
  ["facts_events", "title", "text", "Titulo"],
  ["facts_events", "source", "text", "Modulo de origem"],
  ["facts_events", "details_json", "json", "Registro bruto serializado"],
  ["dim_dates", "date_key", "int", "Chave YYYYMMDD"],
  ["dim_dates", "date_iso", "date", "Data ISO"],
  ["dim_users", "user_id", "text", "ID do usuario"],
  ["dim_users", "name", "text", "Nome do usuario"],
  ["dim_users", "email", "text", "Email do usuario"],
  ["dim_users", "role", "text", "Perfil/cargo"],
].map(([table, column, type, description]) => ({ table, column, type, description }));

const TS_KEYS = [
  "event_ts",
  "timestamp",
  "createdAt",
  "updatedAt",
  "registeredAt",
  "registradoEm",
  "date",
  "data",
  "datetime",
  "occurredAt",
  "ocorridoEm",
  "startAt",
  "inicio",
  "endAt",
  "fim",
  "doneAt",
  "completedAt",
  "closedAt",
  "normalizedAt",
  "uploadAt",
  "uploadedAt",
];
const TITLE_KEYS = ["title", "titulo", "name", "nome", "descricao", "description", "message", "mensagem", "event", "evento", "code", "codigo"];
const USER_KEYS = ["userId", "usuarioId", "ownerId", "responsavelId", "createdBy", "updatedBy", "authorId", "matricula", "email", "userName", "usuario", "name"];
const STATUS_KEYS = ["status", "state", "situacao", "fase"];
const SEVERITY_KEYS = ["severity", "criticidade", "prioridade", "level"];
const TYPE_KEYS = ["eventType", "tipo", "type", "categoria", "category", "action"];
const PROJECT_KEYS = ["projectId", "projetoId", "project_id", "projectCode", "project", "projeto"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function str(v) {
  return v === null || v === undefined ? "" : String(v).trim();
}
function sourceKey(v) {
  return (str(v).toLowerCase().replace(/[^a-z0-9_-]+/g, "_") || "all");
}
function parseDate(value) {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;
    const ms = value > 1e12 ? value : value * 1000;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const txt = String(value).trim();
  const br = txt.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (br) {
    const d = new Date(Number(br[3]), Number(br[2]) - 1, Number(br[1]), Number(br[4] || 0), Number(br[5] || 0), Number(br[6] || 0));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(txt.replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
}
function parseDay(value, endOfDay = false) {
  if (!value) return null;
  const txt = String(value).trim();
  let d = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(txt)) {
    d = new Date(`${txt}T00:00:00`);
  } else {
    d = parseDate(value);
  }
  if (!d) return null;
  if (endOfDay) d.setHours(23, 59, 59, 999);
  else d.setHours(0, 0, 0, 0);
  return d;
}
function toIso(d) {
  return d && !Number.isNaN(d.getTime()) ? d.toISOString() : "";
}
function dateKey(d) {
  if (!d || Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}
function dateIso(d) {
  if (!d || Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function readJson(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return null;
  }
}
function recordsFromPayload(payload, root) {
  if (Array.isArray(payload)) return payload.map((record, index) => ({ record, path: `${root}[${index}]` }));
  if (!payload || typeof payload !== "object") return [];
  const keys = Object.keys(payload);
  const listKeys = keys.filter((k) => Array.isArray(payload[k]));
  if (!listKeys.length) return [{ record: payload, path: root }];
  const rows = [];
  listKeys.forEach((k) => payload[k].forEach((record, index) => rows.push({ record, path: `${root}.${k}[${index}]` })));
  return rows;
}
function inferKey(record, keys) {
  if (!record || typeof record !== "object") return "";
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && String(record[key]).trim()) return String(record[key]).trim();
    const match = Object.keys(record).find((k) => k.toLowerCase() === String(key).toLowerCase());
    if (match && record[match] !== undefined && record[match] !== null && String(record[match]).trim()) return String(record[match]).trim();
  }
  return "";
}
function inferTimestamp(record) {
  for (const key of TS_KEYS) {
    const d = parseDate(record ? record[key] : null);
    if (d) return d;
  }
  if (!record || typeof record !== "object") return null;
  for (const v of Object.values(record)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nested = inferTimestamp(v);
      if (nested) return nested;
    }
  }
  return null;
}
function eventIdFrom(parts) {
  const h = crypto.createHash("sha1");
  h.update(parts.join("|"));
  return h.digest("hex");
}
function flattenSearch(obj) {
  try {
    return JSON.stringify(obj || {}).toLowerCase();
  } catch (_) {
    return "";
  }
}
function normalizeRegistry(registry, baseDataDir) {
  const base = baseDataDir ? path.resolve(baseDataDir) : "";
  const out = {};
  Object.entries(registry || {}).forEach(([k, list]) => {
    const key = sourceKey(k);
    out[key] = (Array.isArray(list) ? list : []).map((entry) => {
      if (typeof entry === "string") {
        const filePath = path.isAbsolute(entry) ? path.resolve(entry) : path.resolve(base || ".", entry);
        return { filePath, fileName: path.basename(filePath), logicalSource: key };
      }
      const filePathRaw = str(entry && (entry.filePath || entry.path));
      const filePath = path.isAbsolute(filePathRaw) ? path.resolve(filePathRaw) : path.resolve(base || ".", filePathRaw);
      return {
        filePath,
        fileName: str((entry && entry.fileName) || path.basename(filePath)),
        logicalSource: sourceKey((entry && entry.logicalSource) || key),
      };
    }).filter((x) => x.filePath);
  });
  if (!out.all) {
    const all = [];
    Object.values(out).forEach((items) => {
      (items || []).forEach((it) => {
        if (!all.some((a) => a.filePath === it.filePath)) all.push(it);
      });
    });
    out.all = all;
  }
  return out;
}
function resolveSourceEntries(source, sourceRegistry, baseDataDir) {
  const safeSource = sourceKey(source);
  const registry = normalizeRegistry(sourceRegistry, baseDataDir);
  if (registry[safeSource] && registry[safeSource].length) return { source: safeSource, entries: registry[safeSource] };
  if (safeSource !== "all" && baseDataDir) {
    const maybe = path.resolve(baseDataDir, `${safeSource}.json`);
    if (fs.existsSync(maybe)) return { source: safeSource, entries: [{ filePath: maybe, fileName: path.basename(maybe), logicalSource: safeSource }] };
  }
  return { source: "all", entries: registry.all || [] };
}
function usersDim(usersFile) {
  const payload = readJson(usersFile);
  const rows = recordsFromPayload(payload, "users");
  const map = new Map();
  rows.forEach(({ record }) => {
    if (!record || typeof record !== "object") return;
    const user_id = str(record.id || record.userId || record.matricula || record.username || record.email);
    if (!user_id) return;
    if (!map.has(user_id)) {
      map.set(user_id, {
        user_id,
        name: str(record.name || record.nome || record.fullName || record.username),
        email: str(record.email),
        role: str(record.rbacRole || record.role || record.cargo),
      });
    }
  });
  return Array.from(map.values());
}
function applyFilters(event, filters) {
  const f = filters && typeof filters === "object" ? filters : {};
  const search = flattenSearch(event.details_json);
  for (const [k, v] of Object.entries(f)) {
    const key = str(k);
    if (!key || ["from", "to", "dateFrom", "dateTo"].includes(key)) continue;
    if (v === "" || v === null || v === undefined) continue;
    if (key === "search") {
      if (!search.includes(String(v).toLowerCase())) return false;
      continue;
    }
    if (key === "projectId") {
      if (str(event.__project_id) !== str(v)) return false;
      continue;
    }
    const field = str(event[key]).toLowerCase();
    const token = String(v).toLowerCase();
    if (field) {
      if (!field.includes(token)) return false;
    } else if (!search.includes(token)) {
      return false;
    }
  }
  return true;
}
function factsFromEntries({ entries, source, from, to, filters, userRows }) {
  const fromDate = parseDay(from, false);
  const toDate = parseDay(to, true);
  const userMap = new Map();
  (userRows || []).forEach((u) => {
    const id = str(u.user_id);
    if (!id) return;
    userMap.set(id.toLowerCase(), id);
    if (u.email) userMap.set(str(u.email).toLowerCase(), id);
    if (u.name) userMap.set(str(u.name).toLowerCase(), id);
  });
  const out = [];
  entries.forEach((entry) => {
    const payload = readJson(entry.filePath);
    const rows = recordsFromPayload(payload, entry.fileName || path.basename(entry.filePath));
    rows.forEach(({ record, path: recPath }, idx) => {
      if (!record || typeof record !== "object") return;
      const ts = inferTimestamp(record);
      if ((fromDate || toDate) && (!ts || (fromDate && ts < fromDate) || (toDate && ts > toDate))) return;
      const rawUser = inferKey(record, USER_KEYS);
      const mappedUser = rawUser ? userMap.get(rawUser.toLowerCase()) || rawUser : "";
      const title = inferKey(record, TITLE_KEYS) || `${source}:${entry.fileName}`;
      const event_type = inferKey(record, TYPE_KEYS) || source;
      const status = inferKey(record, STATUS_KEYS);
      const severity = inferKey(record, SEVERITY_KEYS);
      const __project_id = inferKey(record, PROJECT_KEYS);
      const event_ts = toIso(ts);
      const date_key = ts ? dateKey(ts) : "";
      const details_json = JSON.stringify(record);
      const existingId = str(record.id || record.uuid || record.eventId || record.code || record.codigo);
      const event_id = existingId || eventIdFrom([source, event_ts, title, mappedUser, entry.fileName || "", recPath || String(idx)]);
      const event = { event_id, event_type, event_ts, date_key, user_id: mappedUser, severity, status, title, source, details_json, __project_id };
      if (applyFilters(event, filters)) out.push(event);
    });
  });
  out.sort((a, b) => {
    const ad = parseDate(a.event_ts);
    const bd = parseDate(b.event_ts);
    return (ad ? ad.getTime() : 0) - (bd ? bd.getTime() : 0);
  });
  return out;
}
function isoWeek(date) {
  const t = new Date(date.valueOf());
  const day = (date.getDay() + 6) % 7;
  t.setDate(t.getDate() - day + 3);
  const firstThursday = t.valueOf();
  t.setMonth(0, 1);
  if (t.getDay() !== 4) t.setMonth(0, 1 + ((4 - t.getDay() + 7) % 7));
  return 1 + Math.ceil((firstThursday - t) / 604800000);
}
function dimDates(events, from, to) {
  const set = new Set();
  events.forEach((e) => {
    if (e.date_key) set.add(e.date_key);
  });
  const fromDate = parseDay(from, false);
  const toDate = parseDay(to, true);
  if (fromDate && toDate && fromDate <= toDate) {
    const c = new Date(fromDate.getTime());
    while (c <= toDate) {
      set.add(dateKey(c));
      c.setDate(c.getDate() + 1);
      c.setHours(0, 0, 0, 0);
    }
  }
  const keys = Array.from(set).filter(Boolean).sort();
  if (!keys.length) keys.push(dateKey(new Date()));
  return keys.map((k) => {
    const y = Number(k.slice(0, 4));
    const m = Number(k.slice(4, 6));
    const d = Number(k.slice(6, 8));
    const dt = new Date(y, m - 1, d);
    const dow = dt.getDay() === 0 ? 7 : dt.getDay();
    return {
      date_key: k,
      date_iso: dateIso(dt),
      year: y,
      quarter: Math.floor((m - 1) / 3) + 1,
      month: m,
      month_name: MONTH_NAMES[m - 1] || "",
      day: d,
      day_of_week: dow,
      day_name: DAY_NAMES[dow - 1] || "",
      week_of_year: isoWeek(dt),
      is_weekend: dow >= 6 ? "true" : "false",
    };
  });
}
function dimUsers(userRows, events) {
  const map = new Map();
  (userRows || []).forEach((r) => {
    if (r && r.user_id) map.set(r.user_id, r);
  });
  (events || []).forEach((e) => {
    const user_id = str(e.user_id);
    if (!user_id || map.has(user_id)) return;
    map.set(user_id, { user_id, name: "", email: user_id.includes("@") ? user_id : "", role: "" });
  });
  return Array.from(map.values()).sort((a, b) => a.user_id.localeCompare(b.user_id));
}
function writeCsv(filePath, rows, headers) {
  return new Promise((resolve, reject) => {
    fastCsv
      .writeToPath(filePath, rows, { headers, quoteColumns: true })
      .on("error", reject)
      .on("finish", resolve);
  });
}
function readme(source) {
  return [
    "OPSCOPE - Power BI Export",
    "==========================",
    "",
    `Source: ${source}`,
    `Generated at: ${new Date().toISOString()}`,
    "",
    "Import steps:",
    "1. Extraia o ZIP em uma pasta local.",
    "2. No Power BI Desktop: Home > Get Data > Folder.",
    "3. Selecione a pasta extraida e carregue os CSVs.",
    "",
    "Relacionamentos sugeridos:",
    "- facts_events[date_key] -> dim_dates[date_key]",
    "- facts_events[user_id]  -> dim_users[user_id]",
    "",
    "Notas:",
    "- event_ts e inferido de campos comuns (createdAt, updatedAt, timestamp, data, inicio etc.).",
    "- event_id usa id/uuid quando existir; caso contrario usa hash SHA-1 estavel.",
    "- details_json guarda o registro bruto para auditoria.",
    "",
  ].join("\n");
}
async function appendDbFacts({ facts, source, from, to, filters, databaseUrl, dbStoreTable, dbUploadsTable }) {
  if (!databaseUrl || !PgClient) return;
  const includeStore = source === "all" || source === "logs" || source === "auditoria";
  const includeUploads = source === "all" || source === "uploads";
  if (!includeStore && !includeUploads) return;
  const client = new PgClient({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 2500,
  });
  const fromDate = parseDay(from, false);
  const toDate = parseDay(to, true);
  try {
    await client.connect();
    if (includeStore) {
      try {
        const rs = await client.query(`SELECT key, updated_at, payload FROM ${dbStoreTable} ORDER BY updated_at DESC LIMIT 200`);
        rs.rows.forEach((r) => {
          const ts = parseDate(r.updated_at);
          if ((fromDate || toDate) && (!ts || (fromDate && ts < fromDate) || (toDate && ts > toDate))) return;
          const event = {
            event_id: eventIdFrom(["db_store", str(r.key), toIso(ts)]),
            event_type: "db_store",
            event_ts: toIso(ts),
            date_key: ts ? dateKey(ts) : "",
            user_id: "",
            severity: "",
            status: "stored",
            title: str(r.key),
            source,
            details_json: typeof r.payload === "string" ? r.payload : JSON.stringify(r.payload || {}),
            __project_id: "",
          };
          if (applyFilters(event, filters)) facts.push(event);
        });
      } catch (_) {}
    }
    if (includeUploads) {
      try {
        const rs = await client.query(`SELECT id, name, type, project_id, size, mime, created_at, updated_at FROM ${dbUploadsTable} ORDER BY updated_at DESC LIMIT 500`);
        rs.rows.forEach((r) => {
          const ts = parseDate(r.updated_at || r.created_at);
          if ((fromDate || toDate) && (!ts || (fromDate && ts < fromDate) || (toDate && ts > toDate))) return;
          const details = {
            id: r.id,
            name: r.name,
            type: r.type,
            project_id: r.project_id,
            size: r.size,
            mime: r.mime,
            created_at: r.created_at,
            updated_at: r.updated_at,
          };
          const event = {
            event_id: str(r.id) || eventIdFrom(["db_upload", str(r.name), toIso(ts)]),
            event_type: "upload",
            event_ts: toIso(ts),
            date_key: ts ? dateKey(ts) : "",
            user_id: "",
            severity: "",
            status: "uploaded",
            title: str(r.name),
            source,
            details_json: JSON.stringify(details),
            __project_id: str(r.project_id),
          };
          if (applyFilters(event, filters)) facts.push(event);
        });
      } catch (_) {}
    }
  } catch (_) {
    // optional only
  } finally {
    try {
      await client.end();
    } catch (_) {}
  }
}

async function exportPowerBIPack({
  source = "all",
  from = "",
  to = "",
  filters = {},
  baseDataDir = "",
  sourceRegistry = {},
  usersFile = "",
  databaseUrl = "",
  dbStoreTable = "opscope_store",
  dbUploadsTable = "opscope_uploads",
} = {}) {
  const resolved = resolveSourceEntries(source, sourceRegistry, baseDataDir);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "opscope-powerbi-"));
  const userRows = usersDim(usersFile);
  const facts = factsFromEntries({
    entries: resolved.entries,
    source: resolved.source,
    from,
    to,
    filters: filters && typeof filters === "object" ? { ...filters } : {},
    userRows,
  });

  await appendDbFacts({
    facts,
    source: resolved.source,
    from,
    to,
    filters,
    databaseUrl,
    dbStoreTable,
    dbUploadsTable,
  });

  facts.sort((a, b) => {
    const ad = parseDate(a.event_ts);
    const bd = parseDate(b.event_ts);
    return (ad ? ad.getTime() : 0) - (bd ? bd.getTime() : 0);
  });

  const factRows = facts.map((row) => {
    const clean = {};
    FACT_HEADERS.forEach((h) => {
      clean[h] = row[h] === undefined || row[h] === null ? "" : row[h];
    });
    return clean;
  });
  const dateRows = dimDates(facts, from, to);
  const usersRows = dimUsers(userRows, facts);

  await writeCsv(path.join(tempDir, "facts_events.csv"), factRows, FACT_HEADERS);
  await writeCsv(path.join(tempDir, "dim_dates.csv"), dateRows, DATE_HEADERS);
  await writeCsv(path.join(tempDir, "dim_users.csv"), usersRows, USER_HEADERS);
  await writeCsv(path.join(tempDir, "dictionary.csv"), DICT_ROWS, DICT_HEADERS);
  fs.writeFileSync(path.join(tempDir, "README.txt"), readme(resolved.source), "utf8");

  return {
    dirPath: tempDir,
    source: resolved.source,
    stats: {
      facts: factRows.length,
      dates: dateRows.length,
      users: usersRows.length,
    },
  };
}

function streamZipFromDir(res, dirPath, zipFileName) {
  return new Promise((resolve, reject) => {
    const name = str(zipFileName) || "opscope_powerbi_export.zip";
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${name}"`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("warning", (error) => {
      if (error && error.code === "ENOENT") return;
      reject(error);
    });
    archive.on("error", reject);
    res.on("finish", resolve);
    res.on("close", () => {
      if (!res.writableEnded) {
        try {
          archive.abort();
        } catch (_) {}
      }
    });

    archive.pipe(res);
    const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
    files.forEach((fileName) => archive.file(path.join(dirPath, fileName), { name: fileName }));
    archive.finalize().catch(reject);
  });
}

module.exports = {
  exportPowerBIPack,
  streamZipFromDir,
  parseDate,
  parseDay,
  resolveSourceEntries,
};
