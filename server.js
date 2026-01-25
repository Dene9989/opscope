const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
let sharp;
try {
  sharp = require("sharp");
} catch (error) {
  sharp = null;
}
let nodemailer;
try {
  nodemailer = require("nodemailer");
} catch (error) {
  nodemailer = null;
}
let Pool;
try {
  ({ Pool } = require("pg"));
} catch (error) {
  Pool = null;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || "opscope_dev_secret_change";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345!";
const MASTER_USERNAME = "denisson.alves";
const MASTER_NAME = "Denisson Silva Alves";
const MASTER_MATRICULA = "35269";
const MASTER_ROLE = "pcm";
const MASTER_CARGO = "T\u00e9cnico S\u00eanior de Manuten\u00e7\u00e3o";
const MASTER_PASSWORD = process.env.MASTER_PASSWORD || ADMIN_PASSWORD;
const INVITE_TTL_HOURS = 24;
const VERIFICATION_TTL_HOURS = Number(process.env.VERIFICATION_TTL_HOURS) || 24;

const LEGACY_DATA_DIR = path.join(__dirname, "data");
const LEGACY_STORAGE_DIR = path.join(__dirname, "storage");
const STORAGE_DIR = process.env.OPSCOPE_STORAGE_DIR
  ? path.resolve(process.env.OPSCOPE_STORAGE_DIR)
  : path.join(
      process.env.OPSCOPE_DATA_DIR ||
        process.env.APPDATA ||
        process.env.LOCALAPPDATA ||
        process.env.HOME ||
        path.resolve(__dirname, ".."),
      "opscope-storage"
    );
const STORAGE_DATA_DIR = path.join(STORAGE_DIR, "data");
const DATABASE_URL = process.env.OPSCOPE_DATABASE_URL || process.env.DATABASE_URL || "";
const DB_ENABLED = Boolean(DATABASE_URL);
const DB_STORE_TABLE = "opscope_store";
const DB_UPLOADS_TABLE = "opscope_uploads";
let dbPool = null;
let dbReady = false;
let dbWriteQueue = Promise.resolve();
const DATA_FILE_NAMES = [
  "invites.json",
  "audit.json",
  "maintenance.json",
  "automations.json",
  "api_logs.json",
  "health_tasks.json",
  "files.json",
  "permissoes.json",
  "projects.json",
  "equipamentos.json",
  "project_users.json",
];

const ENV_DATA_DIR = process.env.OPSCOPE_DATA_DIR
  ? path.resolve(process.env.OPSCOPE_DATA_DIR)
  : "";
const ENV_DATA_IS_LEGACY =
  ENV_DATA_DIR && path.resolve(ENV_DATA_DIR).toLowerCase() === LEGACY_DATA_DIR.toLowerCase();
const DATA_DIR = ENV_DATA_DIR && !ENV_DATA_IS_LEGACY ? ENV_DATA_DIR : STORAGE_DATA_DIR;
const LEGACY_USERS_FILE = path.join(LEGACY_DATA_DIR, "users.json");
const LEGACY_USERS_STORAGE_FILE = path.join(LEGACY_STORAGE_DIR, "users.json");
const USERS_FILE = path.join(STORAGE_DIR, "users.json");
const INVITES_FILE = path.join(DATA_DIR, "invites.json");
const AUDIT_FILE = path.join(DATA_DIR, "audit.json");
const MAINTENANCE_FILE = path.join(DATA_DIR, "maintenance.json");
const AUTOMATIONS_FILE = path.join(DATA_DIR, "automations.json");
const UPLOADS_DIR = process.env.OPSCOPE_UPLOADS_DIR
  ? path.resolve(process.env.OPSCOPE_UPLOADS_DIR)
  : path.join(STORAGE_DIR, "uploads");
const AVATARS_DIR = path.join(UPLOADS_DIR, "avatars");
const LEGACY_UPLOADS_DIR = path.join(__dirname, "uploads");
const LEGACY_AVATARS_DIR = path.join(LEGACY_UPLOADS_DIR, "avatars");
const VERIFICATIONS_FILE = path.join(STORAGE_DIR, "email_verifications.json");
const API_LOG_FILE = path.join(DATA_DIR, "api_logs.json");
const HEALTH_TASKS_FILE = path.join(DATA_DIR, "health_tasks.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const FILES_META_FILE = path.join(DATA_DIR, "files.json");
const PERMISSOES_FILE = path.join(DATA_DIR, "permissoes.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const EQUIPAMENTOS_FILE = path.join(DATA_DIR, "equipamentos.json");
const PROJECT_USERS_FILE = path.join(DATA_DIR, "project_users.json");
const PMP_ACTIVITIES_FILE = path.join(DATA_DIR, "pmp_activities.json");
const PMP_EXECUTIONS_FILE = path.join(DATA_DIR, "pmp_executions.json");
const STORE_FILES = [
  USERS_FILE,
  VERIFICATIONS_FILE,
  INVITES_FILE,
  AUDIT_FILE,
  MAINTENANCE_FILE,
  AUTOMATIONS_FILE,
  API_LOG_FILE,
  HEALTH_TASKS_FILE,
  FILES_META_FILE,
  PERMISSOES_FILE,
  PROJECTS_FILE,
  EQUIPAMENTOS_FILE,
  PROJECT_USERS_FILE,
  PMP_ACTIVITIES_FILE,
  PMP_EXECUTIONS_FILE,
];
const FILES_DIR = path.join(UPLOADS_DIR, "files");
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM = process.env.RESEND_FROM || "";
const APP_BASE_URL = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const SMTP_TIMEOUT_MS = Number(process.env.SMTP_TIMEOUT_MS) || 10000;
const DASHBOARD_CACHE_TTL_MS = 60 * 1000;
const DASHBOARD_CACHE = new Map();
const IS_DEV = process.env.NODE_ENV !== "production";
const API_LOG_LIMIT = Number(process.env.API_LOG_LIMIT) || 800;
const AVATAR_MAX_BYTES = 10 * 1024 * 1024;
const AVATAR_TARGET_BYTES = 1024 * 1024;
const AVATAR_SIZE = 512;
const ALLOWED_AVATAR_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const FILE_MAX_BYTES = 10 * 1024 * 1024;
const STORE_UPLOADS = String(process.env.OPSCOPE_STORE_UPLOADS || "true").toLowerCase() !== "false";
const STORE_UPLOADS_MAX_BYTES = Number(process.env.OPSCOPE_STORE_UPLOADS_MAX_BYTES) || FILE_MAX_BYTES;
const STORE_UPLOADS_BACKFILL_LIMIT = Number(process.env.OPSCOPE_STORE_UPLOADS_BACKFILL_LIMIT || 0);
const FILE_TYPE_CONFIG = {
  evidence: { label: "Evidências", dir: "evidencias" },
  rdo: { label: "Anexos de RDO", dir: "rdos" },
  audit: { label: "Documentos de auditoria", dir: "auditoria" },
  procedure: { label: "Procedimentos PMP", dir: "procedimentos" },
};
const FILE_ALLOWED_MIME = new Map([
  ["application/pdf", "pdf"],
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
]);
const DEFAULT_PROJECT_CODE = "834";
const DEFAULT_PROJECT_NAME = "PARACATU/SOLARIG (Boa Sorte II)";
const DEFAULT_PROJECT_LOCAIS = ["LZC-BOS2", "LZC-PCT4", "LZC-LT", "LZC-BSO2/LZC-PCT4"];
const AUTOMATION_DEFAULTS = [
  {
    id: "maintenance_critical_email",
    name: "Notificar manutenção crítica",
    enabled: true,
    event: "maintenance_created",
    condition: { type: "critical" },
    action: { type: "notify_email", to: "" },
  },
];

const PERMISSION_KEYS = [
  "create",
  "edit",
  "remove",
  "reschedule",
  "complete",
  "admin:users:read",
  "admin:users:write",
];
const FULL_PERMISSIONS = PERMISSION_KEYS.reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {});
const NO_PERMISSIONS = PERMISSION_KEYS.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {});
const SUPERVISOR_DEFAULT_PERMISSIONS = {
  ...NO_PERMISSIONS,
  create: true,
  edit: true,
  reschedule: true,
  complete: true,
};
const EXECUTOR_DEFAULT_PERMISSIONS = {
  ...NO_PERMISSIONS,
  complete: true,
};
const ROLE_DEFAULT_PERMISSIONS = {
  supervisor: SUPERVISOR_DEFAULT_PERMISSIONS,
  supervisor_om: SUPERVISOR_DEFAULT_PERMISSIONS,
  tecnico_senior: SUPERVISOR_DEFAULT_PERMISSIONS,
  tecnico_pleno: SUPERVISOR_DEFAULT_PERMISSIONS,
  tecnico_junior: EXECUTOR_DEFAULT_PERMISSIONS,
  executor: EXECUTOR_DEFAULT_PERMISSIONS,
  leitura: NO_PERMISSIONS,
};
const FULL_ACCESS_ROLES = new Set(["pcm", "diretor_om", "gerente_contrato"]);
const RELEASE_OVERRIDE_ROLES = new Set([
  "pcm",
  "diretor_om",
  "gerente_contrato",
  "supervisor_om",
]);

const PERMISSION_CATALOG = [
  {
    id: "manutencao",
    label: "Manutenções",
    permissions: [
      { key: "create", label: "Criar" },
      { key: "edit", label: "Editar" },
      { key: "remove", label: "Remover" },
      { key: "reschedule", label: "Reagendar" },
      { key: "complete", label: "Executar" },
    ],
  },
  {
    id: "usuarios",
    label: "Usuários",
    permissions: [
      { key: "admin:users:read", label: "Ler usuários" },
      { key: "admin:users:write", label: "Editar usuários" },
    ],
  },
];

const GRANULAR_PERMISSION_CATALOG = [
  { key: "editarPerfil", label: "Editar perfil (UEN/Projeto)" },
  { key: "editarPerfilOutros", label: "Editar perfil de outros" },
  { key: "verUsuarios", label: "Ver usuários" },
  { key: "convidarUsuarios", label: "Convidar usuários" },
  { key: "desativarUsuarios", label: "Desativar usuários" },
  { key: "verArquivos", label: "Ver arquivos" },
  { key: "uploadArquivos", label: "Enviar arquivos" },
  { key: "excluirArquivos", label: "Excluir arquivos" },
  { key: "vincularArquivo", label: "Vincular arquivo" },
  { key: "verRDOs", label: "Ver RDOs" },
  { key: "gerarRDOs", label: "Gerar RDOs" },
  { key: "excluirRDOs", label: "Excluir RDOs" },
  { key: "verRelatorios", label: "Ver relatórios" },
  { key: "exportarRelatorios", label: "Exportar relatórios" },
  { key: "reexecutarTarefas", label: "Reexecutar tarefas" },
  { key: "verLogsAPI", label: "Ver logs de API" },
  { key: "limparLogsAPI", label: "Limpar logs de API" },
  { key: "gerenciarAutomacoes", label: "Gerenciar automações" },
  { key: "verAutomacoes", label: "Ver automações" },
  { key: "verDiagnostico", label: "Ver diagnóstico" },
  { key: "verPainelGerencial", label: "Ver painel gerencial" },
  { key: "gerenciarProjetos", label: "Gerenciar projetos" },
  { key: "gerenciarEquipamentos", label: "Gerenciar equipamentos" },
  { key: "gerenciarEquipeProjeto", label: "Gerenciar equipe do projeto" },
  { key: "gerenciarPMP", label: "Gerenciar PMP/Cronograma" },
];
const GRANULAR_PERMISSION_KEYS = new Set(
  GRANULAR_PERMISSION_CATALOG.map((permission) => permission.key)
);
const GRANULAR_PROFILE_CATALOG = [
  { key: "pcm", label: "PCM" },
  { key: "diretor_om", label: "Diretor O&M" },
  { key: "gerente_contrato", label: "Gerente de Contrato" },
  { key: "supervisor_om", label: "Supervisor O&M" },
  { key: "tecnico_senior", label: "Tecnico Senior" },
  { key: "tecnico_pleno", label: "Tecnico Pleno" },
  { key: "tecnico_junior", label: "Tecnico Junior" },
  { key: "leitura", label: "Leitura" },
];
const GRANULAR_BASE_PERMISSIONS = {
  editarPerfil: false,
  editarPerfilOutros: false,
  verUsuarios: false,
  convidarUsuarios: false,
  desativarUsuarios: false,
  verArquivos: false,
  uploadArquivos: false,
  excluirArquivos: false,
  vincularArquivo: false,
  verRDOs: true,
  gerarRDOs: true,
  excluirRDOs: true,
  verRelatorios: true,
  exportarRelatorios: true,
  reexecutarTarefas: false,
  verLogsAPI: false,
  limparLogsAPI: false,
  gerenciarAutomacoes: false,
  verAutomacoes: false,
  verDiagnostico: false,
  verPainelGerencial: false,
  gerenciarProjetos: false,
  gerenciarEquipamentos: false,
  gerenciarEquipeProjeto: false,
  gerenciarPMP: false,
};
const GRANULAR_SUPERVISOR_PERMISSIONS = {
  ...GRANULAR_BASE_PERMISSIONS,
  editarPerfil: true,
  editarPerfilOutros: true,
};
const GRANULAR_ADMIN_PERMISSIONS = {
  ...GRANULAR_SUPERVISOR_PERMISSIONS,
  verUsuarios: true,
  convidarUsuarios: true,
  desativarUsuarios: true,
  verArquivos: true,
  uploadArquivos: true,
  excluirArquivos: true,
  vincularArquivo: true,
  reexecutarTarefas: true,
  verLogsAPI: true,
  limparLogsAPI: true,
  gerenciarAutomacoes: true,
  verAutomacoes: true,
  verDiagnostico: true,
  verPainelGerencial: true,
  gerenciarProjetos: false,
  gerenciarEquipamentos: false,
  gerenciarEquipeProjeto: false,
  gerenciarPMP: false,
};
const GRANULAR_PCM_PERMISSIONS = {
  ...GRANULAR_ADMIN_PERMISSIONS,
  gerenciarProjetos: true,
  gerenciarEquipamentos: true,
  gerenciarEquipeProjeto: true,
  gerenciarPMP: true,
};
const GRANULAR_DEFAULT_PERMISSIONS = {
  pcm: GRANULAR_PCM_PERMISSIONS,
  diretor_om: GRANULAR_ADMIN_PERMISSIONS,
  gerente_contrato: GRANULAR_ADMIN_PERMISSIONS,
  supervisor_om: GRANULAR_SUPERVISOR_PERMISSIONS,
  tecnico_senior: GRANULAR_BASE_PERMISSIONS,
  tecnico_pleno: GRANULAR_BASE_PERMISSIONS,
  tecnico_junior: GRANULAR_BASE_PERMISSIONS,
  leitura: GRANULAR_BASE_PERMISSIONS,
};

const DEFAULT_SECTIONS = {
  inicio: true,
  programacao: true,
  nova: true,
  modelos: true,
  pmp: true,
  execucao: true,
  backlog: true,
  projetos: true,
  desempenho: true,
  tendencias: true,
  relatorios: true,
  perfil: true,
};

const ADMIN_SECTIONS = ["solicitacoes", "rastreabilidade", "gerencial", "contas"];
const HEALTH_TASK_GRACE = 1.5;
const HEALTH_TASK_DEFAULTS = [
  {
    id: "recorrencias",
    label: "Geracao de recorrencias",
    intervalMinutes: 60,
    critical: true,
  },
  {
    id: "rdo_diario",
    label: "RDO diario",
    intervalMinutes: 1440,
    critical: false,
  },
  {
    id: "limpeza_programada",
    label: "Limpeza programada",
    intervalMinutes: 1440,
    critical: false,
  },
  {
    id: "backup",
    label: "Backup de dados",
    intervalMinutes: 1440,
    critical: true,
  },
];

const ipFailures = new Map();
const userFailures = new Map();
const IP_MAX_ATTEMPTS = 5;
const IP_WINDOW_MS = 10 * 60 * 1000;
const USER_MAX_ATTEMPTS = 5;
const USER_WINDOW_MS = 10 * 60 * 1000;
const USER_LOCK_MS = 15 * 60 * 1000;

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function logStoragePaths() {
  const envData = process.env.OPSCOPE_DATA_DIR || "";
  const envStorage = process.env.OPSCOPE_STORAGE_DIR || "";
  console.log("[storage] DATA_DIR=", DATA_DIR);
  console.log("[storage] STORAGE_DIR=", STORAGE_DIR);
  if (envData) {
    console.log("[storage] OPSCOPE_DATA_DIR=", envData);
  }
  if (envStorage) {
    console.log("[storage] OPSCOPE_STORAGE_DIR=", envStorage);
  }
}

function migrateLegacyDataDir() {
  const candidates = [LEGACY_DATA_DIR, STORAGE_DIR, STORAGE_DATA_DIR];
  candidates.forEach((legacyDir) => {
    if (!legacyDir || legacyDir === DATA_DIR) {
      return;
    }
    if (!fs.existsSync(legacyDir)) {
      return;
    }
    DATA_FILE_NAMES.forEach((name) => {
      const from = path.join(legacyDir, name);
      const to = path.join(DATA_DIR, name);
      if (fs.existsSync(from) && !fs.existsSync(to)) {
        fs.copyFileSync(from, to);
      }
    });
    const legacyBackups = path.join(legacyDir, "backups");
    const newBackups = path.join(DATA_DIR, "backups");
    if (fs.existsSync(legacyBackups) && !fs.existsSync(newBackups)) {
      fs.mkdirSync(newBackups, { recursive: true });
      fs.readdirSync(legacyBackups).forEach((entry) => {
        const from = path.join(legacyBackups, entry);
        const to = path.join(newBackups, entry);
        if (fs.statSync(from).isFile() && !fs.existsSync(to)) {
          fs.copyFileSync(from, to);
        }
      });
    }
  });
}

function ensureUploadDirs() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(AVATARS_DIR)) {
    fs.mkdirSync(AVATARS_DIR, { recursive: true });
  }
  if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR, { recursive: true });
  }
  Object.values(FILE_TYPE_CONFIG).forEach((config) => {
    const dirPath = path.join(FILES_DIR, config.dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
}

function ensureBackupDir() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function migrateLegacyAvatars() {
  if (LEGACY_AVATARS_DIR === AVATARS_DIR) {
    return;
  }
  if (!fs.existsSync(LEGACY_AVATARS_DIR)) {
    return;
  }
  ensureUploadDirs();
  const files = fs.readdirSync(LEGACY_AVATARS_DIR);
  files.forEach((file) => {
    const source = path.join(LEGACY_AVATARS_DIR, file);
    const target = path.join(AVATARS_DIR, file);
    if (!fs.existsSync(target)) {
      try {
        fs.copyFileSync(source, target);
      } catch (error) {
        // noop
      }
    }
  });
}

function migrateLegacyUploads() {
  if (LEGACY_UPLOADS_DIR === UPLOADS_DIR) {
    return;
  }
  if (!fs.existsSync(LEGACY_UPLOADS_DIR)) {
    return;
  }
  ensureUploadDirs();
  const copyRecursive = (source, target) => {
    if (!fs.existsSync(source)) {
      return;
    }
    const stats = fs.statSync(source);
    if (stats.isDirectory()) {
      if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
      }
      fs.readdirSync(source).forEach((entry) => {
        copyRecursive(path.join(source, entry), path.join(target, entry));
      });
      return;
    }
    if (!fs.existsSync(target)) {
      try {
        fs.copyFileSync(source, target);
      } catch (error) {
        // noop
      }
    }
  };
  const legacyFiles = path.join(LEGACY_UPLOADS_DIR, "files");
  const targetFiles = path.join(UPLOADS_DIR, "files");
  copyRecursive(legacyFiles, targetFiles);
}

async function optimizeAvatar(buffer) {
  if (!sharp) {
    return null;
  }
  const sizes = [AVATAR_SIZE, 448, 384, 320];
  const qualities = [82, 78, 74, 70, 65, 60];
  let output = null;
  for (const size of sizes) {
    for (const quality of qualities) {
      output = await sharp(buffer, { failOnError: false })
        .resize(size, size, { fit: "cover", position: "centre" })
        .webp({ quality })
        .toBuffer();
      if (output.length <= AVATAR_TARGET_BYTES) {
        return { buffer: output, ext: "webp" };
      }
    }
  }
  if (output && output.length <= AVATAR_TARGET_BYTES) {
    return { buffer: output, ext: "webp" };
  }
  return { buffer: output || buffer, ext: "webp", oversized: true };
}

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function writeJson(filePath, data, options = {}) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  if (!options.skipDb) {
    queueDbWrite(filePath, data);
  }
}

function getStoreKey(filePath) {
  if (!filePath) {
    return "";
  }
  const resolved = path.resolve(filePath);
  const storageRoot = path.resolve(STORAGE_DIR);
  if (resolved.startsWith(storageRoot)) {
    return path.relative(storageRoot, resolved).replace(/\\/g, "/");
  }
  const dataRoot = path.resolve(DATA_DIR);
  if (resolved.startsWith(dataRoot)) {
    const rel = path.relative(dataRoot, resolved).replace(/\\/g, "/");
    return rel.startsWith("data/") ? rel : `data/${rel}`;
  }
  return path.basename(resolved);
}

function shouldUseDb() {
  return DB_ENABLED && Pool;
}

async function initDatabase() {
  if (!shouldUseDb()) {
    return;
  }
  const needsSsl =
    process.env.PGSSLMODE === "require" ||
    DATABASE_URL.includes("sslmode=require") ||
    process.env.NODE_ENV === "production";
  dbPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
  await dbPool.query(
    `CREATE TABLE IF NOT EXISTS ${DB_STORE_TABLE} (
      key TEXT PRIMARY KEY,
      payload TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`
  );
  if (STORE_UPLOADS) {
    await dbPool.query(
      `CREATE TABLE IF NOT EXISTS ${DB_UPLOADS_TABLE} (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        mime TEXT NOT NULL,
        size INTEGER NOT NULL,
        project_id TEXT,
        data BYTEA NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
    );
    await dbPool.query(
      `CREATE INDEX IF NOT EXISTS ${DB_UPLOADS_TABLE}_type_name_idx ON ${DB_UPLOADS_TABLE} (type, name)`
    );
  }
  try {
    const typeCheck = await dbPool.query(
      `SELECT data_type
       FROM information_schema.columns
       WHERE table_name = $1 AND column_name = 'payload'`,
      [DB_STORE_TABLE]
    );
    const currentType = typeCheck.rows[0]?.data_type || "";
    if (currentType && currentType !== "text") {
      await dbPool.query(
        `ALTER TABLE ${DB_STORE_TABLE}
         ALTER COLUMN payload TYPE TEXT
         USING payload::text`
      );
    }
  } catch (error) {
    console.warn("[db] Falha ao ajustar coluna payload:", error.message || error);
  }
  dbReady = true;
}

async function upsertStorePayload(key, payload) {
  if (!dbReady || !dbPool || !key) {
    return;
  }
  let serialized = JSON.stringify(payload);
  if (typeof serialized !== "string") {
    serialized = "null";
  }
  await dbPool.query(
    `INSERT INTO ${DB_STORE_TABLE} (key, payload, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (key)
     DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
    [key, serialized]
  );
}

async function fetchStorePayload(key) {
  if (!dbReady || !dbPool || !key) {
    return null;
  }
  const result = await dbPool.query(
    `SELECT payload FROM ${DB_STORE_TABLE} WHERE key = $1`,
    [key]
  );
  if (!result || !result.rowCount) {
    return null;
  }
  const raw = result.rows[0].payload;
  if (raw === null || typeof raw === "undefined") {
    return null;
  }
  if (typeof raw !== "string") {
    return raw;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn("[db] Payload inválido para", key);
    return null;
  }
}

function queueDbWrite(filePath, data) {
  if (!dbReady || !dbPool) {
    return;
  }
  const key = getStoreKey(filePath);
  if (!key) {
    return;
  }
  dbWriteQueue = dbWriteQueue
    .then(() => upsertStorePayload(key, data))
    .catch((error) => {
      console.warn("[db] Falha ao salvar", key, error.message || error);
    });
}

async function flushDbWrites() {
  if (!dbReady) {
    return;
  }
  try {
    await dbWriteQueue;
  } catch (error) {
    // noop
  }
}

async function syncStoreFile(filePath) {
  const key = getStoreKey(filePath);
  if (!key || !dbReady) {
    return;
  }
  const remotePayload = await fetchStorePayload(key);
  if (remotePayload !== null && typeof remotePayload !== "undefined") {
    writeJson(filePath, remotePayload, { skipDb: true });
    return;
  }
  if (!fs.existsSync(filePath)) {
    return;
  }
  const localPayload = readJson(filePath, null);
  if (localPayload !== null && typeof localPayload !== "undefined") {
    await upsertStorePayload(key, localPayload);
  }
}

async function syncStoreFiles() {
  if (!dbReady) {
    return;
  }
  for (const filePath of STORE_FILES) {
    await syncStoreFile(filePath);
  }
}

function shouldStoreUploads() {
  return STORE_UPLOADS && dbReady && dbPool;
}

function normalizeDbBuffer(value) {
  if (!value) {
    return null;
  }
  if (Buffer.isBuffer(value)) {
    return value;
  }
  if (typeof value === "string") {
    if (value.startsWith("\\x")) {
      return Buffer.from(value.slice(2), "hex");
    }
    try {
      return Buffer.from(value, "base64");
    } catch (error) {
      return null;
    }
  }
  return null;
}

async function upsertUploadBlob(entry, buffer) {
  if (!shouldStoreUploads() || !entry || !buffer) {
    return;
  }
  if (!entry.id || buffer.length > STORE_UPLOADS_MAX_BYTES) {
    return;
  }
  try {
    await dbPool.query(
      `INSERT INTO ${DB_UPLOADS_TABLE} (id, name, type, mime, size, project_id, data, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         name = EXCLUDED.name,
         type = EXCLUDED.type,
         mime = EXCLUDED.mime,
         size = EXCLUDED.size,
         project_id = EXCLUDED.project_id,
         data = EXCLUDED.data,
         updated_at = NOW()`,
      [
        String(entry.id),
        String(entry.name || ""),
        String(entry.type || ""),
        String(entry.mime || "application/octet-stream"),
        Number(entry.size) || buffer.length,
        String(entry.projectId || ""),
        buffer,
      ]
    );
  } catch (error) {
    console.warn("[db] Falha ao salvar upload:", error.message || error);
  }
}

async function fetchUploadBlobById(id) {
  if (!shouldStoreUploads() || !id) {
    return null;
  }
  try {
    const result = await dbPool.query(
      `SELECT id, name, mime, data FROM ${DB_UPLOADS_TABLE} WHERE id = $1`,
      [String(id)]
    );
    if (!result || !result.rowCount) {
      return null;
    }
    const row = result.rows[0];
    const buffer = normalizeDbBuffer(row.data);
    if (!buffer) {
      return null;
    }
    return { buffer, mime: row.mime || "", name: row.name || "", id: row.id || "" };
  } catch (error) {
    console.warn("[db] Falha ao buscar upload:", error.message || error);
    return null;
  }
}

async function fetchUploadBlobByName(type, name) {
  if (!shouldStoreUploads() || !type || !name) {
    return null;
  }
  try {
    const result = await dbPool.query(
      `SELECT id, name, mime, data FROM ${DB_UPLOADS_TABLE}
       WHERE name = $1 AND type = $2
       ORDER BY updated_at DESC
       LIMIT 1`,
      [String(name), String(type)]
    );
    if (!result || !result.rowCount) {
      return null;
    }
    const row = result.rows[0];
    const buffer = normalizeDbBuffer(row.data);
    if (!buffer) {
      return null;
    }
    return { buffer, mime: row.mime || "", name: row.name || "", id: row.id || "" };
  } catch (error) {
    console.warn("[db] Falha ao buscar upload:", error.message || error);
    return null;
  }
}

async function deleteUploadBlob(id) {
  if (!shouldStoreUploads() || !id) {
    return;
  }
  try {
    await dbPool.query(`DELETE FROM ${DB_UPLOADS_TABLE} WHERE id = $1`, [String(id)]);
  } catch (error) {
    console.warn("[db] Falha ao remover upload:", error.message || error);
  }
}

async function backfillUploadsToDb() {
  if (!shouldStoreUploads() || !Array.isArray(filesMeta) || !filesMeta.length) {
    return;
  }
  const limit = Math.max(0, STORE_UPLOADS_BACKFILL_LIMIT || 0);
  const entries = limit ? filesMeta.slice(0, limit) : filesMeta;
  for (const entry of entries) {
    if (!entry || !entry.id || !entry.name || !entry.type) {
      continue;
    }
    const existing = await fetchUploadBlobById(entry.id);
    if (existing) {
      continue;
    }
    const typeConfig = getFileTypeConfig(entry.type);
    if (!typeConfig) {
      continue;
    }
    const filePath = path.join(FILES_DIR, typeConfig.dir, entry.name);
    const legacyPath = path.join(LEGACY_UPLOADS_DIR, "files", typeConfig.dir, entry.name);
    const sourcePath = fs.existsSync(filePath) ? filePath : legacyPath;
    if (!sourcePath || !fs.existsSync(sourcePath)) {
      continue;
    }
    const buffer = fs.readFileSync(sourcePath);
    if (!buffer.length || buffer.length > STORE_UPLOADS_MAX_BYTES) {
      continue;
    }
    await upsertUploadBlob(entry, buffer);
  }
}

function registerShutdownHandlers() {
  if (!dbReady) {
    return;
  }
  const shutdown = async () => {
    await flushDbWrites();
    if (dbPool) {
      await dbPool.end().catch(() => {});
    }
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

function normalizeLocaisList(value) {
  if (!value) {
    return [];
  }
  let items = [];
  if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === "string") {
    items = value.split(/[\n,;]+/g);
  } else {
    return [];
  }
  const normalized = items
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

function normalizeProject(record) {
  const now = new Date().toISOString();
  const pmpHoras = Number(
    record && record.pmpHorasDisponiveis !== undefined
      ? record.pmpHorasDisponiveis
      : record && record.pmpHorasSemana !== undefined
        ? record.pmpHorasSemana
        : 40
  );
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    codigo: String(record && record.codigo ? record.codigo : "").trim(),
    nome: String(record && record.nome ? record.nome : "").trim(),
    cliente: String(record && record.cliente ? record.cliente : "").trim(),
    descricao: String(record && record.descricao ? record.descricao : "").trim(),
    locais: normalizeLocaisList(record && record.locais ? record.locais : []),
    pmpHorasDisponiveis: Number.isFinite(pmpHoras) ? Math.max(0, pmpHoras) : 40,
    createdAt: record && record.createdAt ? record.createdAt : now,
    updatedAt: record && record.updatedAt ? record.updatedAt : now,
  };
}

function loadProjects() {
  const data = readJson(PROJECTS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      ...item,
      locais: normalizeLocaisList(item.locais || []),
      pmpHorasDisponiveis: Number.isFinite(Number(item.pmpHorasDisponiveis))
        ? Math.max(0, Number(item.pmpHorasDisponiveis))
        : 40,
    }));
}

function saveProjects(list) {
  writeJson(PROJECTS_FILE, list);
}

function normalizeProjectUser(record) {
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    userId: String(record && record.userId ? record.userId : "").trim(),
    papel: String(record && record.papel ? record.papel : "").trim(),
    createdAt: record && record.createdAt ? record.createdAt : new Date().toISOString(),
  };
}

function loadProjectUsers() {
  const data = readJson(PROJECT_USERS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function saveProjectUsers(list) {
  writeJson(PROJECT_USERS_FILE, list);
}

function loadEquipamentos() {
  const data = readJson(EQUIPAMENTOS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function saveEquipamentos(list) {
  writeJson(EQUIPAMENTOS_FILE, list);
}

function parseDurationToMinutes(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }
  const text = String(value || "").trim();
  if (!text) {
    return 0;
  }
  if (text.includes(":")) {
    const [h, m] = text.split(":");
    const hours = Number(h);
    const minutes = Number(m);
    if (Number.isFinite(hours) && Number.isFinite(minutes)) {
      return Math.max(0, Math.round(hours * 60 + minutes));
    }
  }
  const numeric = Number(text);
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.round(numeric));
  }
  return 0;
}

function normalizePmpActivity(record) {
  const now = new Date().toISOString();
  const year = Number(record && record.ano ? record.ano : new Date().getFullYear());
  const origemRaw = String(record && record.origem ? record.origem : "").trim().toLowerCase();
  const origem = origemRaw === "importado" ? "importado" : "manual";
  const mesesRaw = Array.isArray(record && record.meses) ? record.meses : [];
  const meses = mesesRaw
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= 0 && value <= 11);
  const procedimentoDocRaw = record && record.procedimentoDoc ? record.procedimentoDoc : null;
  let procedimentoDoc = null;
  if (procedimentoDocRaw && typeof procedimentoDocRaw === "object") {
    const url = String(procedimentoDocRaw.url || procedimentoDocRaw.dataUrl || "").trim();
    if (url) {
      const nome = String(
        procedimentoDocRaw.originalName || procedimentoDocRaw.name || "Procedimento.pdf"
      ).trim();
      procedimentoDoc = {
        id: procedimentoDocRaw.id ? String(procedimentoDocRaw.id) : "",
        url,
        name: nome,
        originalName: nome,
        mime: String(procedimentoDocRaw.mime || "application/pdf"),
      };
    }
  }
  const onlyWeekdays = Boolean(record && record.onlyWeekdays);
  const tipoManutencao = String(
    record && (record.tipoManutencao || record.tipo) ? record.tipoManutencao || record.tipo : ""
  ).trim();
  const checklistRaw = record && record.checklist ? record.checklist : [];
  const checklist = Array.isArray(checklistRaw)
    ? checklistRaw
        .map((item) => {
          if (!item) {
            return null;
          }
          if (typeof item === "string") {
            const text = item.trim();
            return text ? { descricao: text, link: "" } : null;
          }
          const descricao = String(item.descricao || item.label || "").trim();
          const link = String(item.link || item.url || "").trim();
          if (!descricao && !link) {
            return null;
          }
          return { descricao, link };
        })
        .filter(Boolean)
    : [];
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    equipamentoId: String(record && record.equipamentoId ? record.equipamentoId : "").trim(),
    nome: String(record && record.nome ? record.nome : "").trim(),
    descricao: String(record && record.descricao ? record.descricao : "").trim(),
    observacoes: String(record && record.observacoes ? record.observacoes : "").trim(),
    codigo: String(record && record.codigo ? record.codigo : "").trim(),
    tipoManutencao,
    frequencia: String(record && record.frequencia ? record.frequencia : "").trim(),
    meses,
    onlyWeekdays,
    procedimentoDoc,
    tecnicosEstimados: Math.max(0, Number(record && record.tecnicosEstimados ? record.tecnicosEstimados : 0) || 0),
    duracaoMinutos: parseDurationToMinutes(record && record.duracaoMinutos ? record.duracaoMinutos : record.duracao),
    responsavelId: String(record && record.responsavelId ? record.responsavelId : "").trim(),
    checklist,
    origem,
    procedimentos: String(record && record.procedimentos ? record.procedimentos : "").trim(),
    ano: Number.isFinite(year) ? year : new Date().getFullYear(),
    inicio: String(record && record.inicio ? record.inicio : "").trim(),
    createdAt: record && record.createdAt ? record.createdAt : now,
    createdBy: record && record.createdBy ? record.createdBy : "",
    updatedAt: record && record.updatedAt ? record.updatedAt : now,
    updatedBy: record && record.updatedBy ? record.updatedBy : "",
  };
}

function normalizePmpExecution(record) {
  const now = new Date().toISOString();
  const evidenciasRaw = record && record.evidencias ? record.evidencias : [];
  const evidencias = Array.isArray(evidenciasRaw)
    ? evidenciasRaw.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  const checklistRaw = record && record.checklist ? record.checklist : [];
  const checklist = Array.isArray(checklistRaw)
    ? checklistRaw.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    activityId: String(record && record.activityId ? record.activityId : "").trim(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    periodKey: String(record && record.periodKey ? record.periodKey : "").trim(),
    scheduledFor: String(record && record.scheduledFor ? record.scheduledFor : "").trim(),
    executedAt: String(record && record.executedAt ? record.executedAt : "").trim(),
    executorId: String(record && record.executorId ? record.executorId : "").trim(),
    status: String(record && record.status ? record.status : "").trim(),
    source: String(record && record.source ? record.source : "").trim(),
    osId: String(record && record.osId ? record.osId : "").trim(),
    rdoId: String(record && record.rdoId ? record.rdoId : "").trim(),
    observacao: String(record && record.observacao ? record.observacao : "").trim(),
    evidencias,
    checklist,
    createdAt: record && record.createdAt ? record.createdAt : now,
    updatedAt: record && record.updatedAt ? record.updatedAt : now,
  };
}

function loadPmpActivities() {
  const data = readJson(PMP_ACTIVITIES_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function savePmpActivities(list) {
  writeJson(PMP_ACTIVITIES_FILE, list);
}

function loadPmpExecutions() {
  const data = readJson(PMP_EXECUTIONS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function savePmpExecutions(list) {
  writeJson(PMP_EXECUTIONS_FILE, list);
}

function shouldRedactLogKey(key) {
  const normalized = String(key || "").toLowerCase();
  return (
    normalized.includes("password") ||
    normalized.includes("senha") ||
    normalized.includes("token") ||
    normalized.includes("authorization") ||
    normalized.includes("secret") ||
    normalized.includes("cookie") ||
    normalized.includes("session") ||
    normalized.includes("dataurl") ||
    normalized.includes("base64") ||
    normalized.includes("avatar") ||
    normalized.includes("file")
  );
}

function sanitizeLogValue(value, depth = 0) {
  if (depth > 2) {
    return "[truncated]";
  }
  if (value === null || value === undefined) {
    return value;
  }
  if (Buffer.isBuffer(value)) {
    return `[binary ${value.length} bytes]`;
  }
  if (typeof value === "string") {
    if (value.length > 240) {
      return `${value.slice(0, 240)}...`;
    }
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((entry) => sanitizeLogValue(entry, depth + 1));
  }
  if (typeof value === "object") {
    const output = {};
    Object.keys(value)
      .slice(0, 40)
      .forEach((key) => {
        if (shouldRedactLogKey(key)) {
          output[key] = "[redacted]";
          return;
        }
        output[key] = sanitizeLogValue(value[key], depth + 1);
      });
    return output;
  }
  return String(value);
}

function normalizeHealthTasks(list) {
  const base = new Map(HEALTH_TASK_DEFAULTS.map((task) => [task.id, task]));
  const output = [];
  HEALTH_TASK_DEFAULTS.forEach((task) => {
    const stored = Array.isArray(list) ? list.find((item) => item.id === task.id) : null;
    output.push({
      ...task,
      lastRun: stored && stored.lastRun ? stored.lastRun : "",
      lastStatus: stored && stored.lastStatus ? stored.lastStatus : "",
      lastError: stored && stored.lastError ? stored.lastError : "",
      lastDurationMs: stored && stored.lastDurationMs ? stored.lastDurationMs : 0,
      lastRunBy: stored && stored.lastRunBy ? stored.lastRunBy : "",
      lastBackupFile: stored && stored.lastBackupFile ? stored.lastBackupFile : "",
    });
  });
  if (Array.isArray(list)) {
    list.forEach((stored) => {
      if (!stored || !stored.id || base.has(stored.id)) {
        return;
      }
      output.push({ ...stored });
    });
  }
  return output;
}

function normalizeAutomations(list) {
  const output = [];
  const storedMap = new Map();
  if (Array.isArray(list)) {
    list.forEach((item) => {
      if (item && item.id) {
        storedMap.set(item.id, item);
      }
    });
  }
  AUTOMATION_DEFAULTS.forEach((automation) => {
    const stored = storedMap.get(automation.id);
    output.push({
      ...automation,
      projectId: stored && stored.projectId ? stored.projectId : automation.projectId || "",
      enabled: stored && typeof stored.enabled === "boolean" ? stored.enabled : automation.enabled,
      condition: { ...automation.condition, ...(stored ? stored.condition : {}) },
      action: { ...automation.action, ...(stored ? stored.action : {}) },
      lastRunAt: stored && stored.lastRunAt ? stored.lastRunAt : "",
      lastStatus: stored && stored.lastStatus ? stored.lastStatus : "",
      lastError: stored && stored.lastError ? stored.lastError : "",
      lastItemId: stored && stored.lastItemId ? stored.lastItemId : "",
      lastTriggeredBy: stored && stored.lastTriggeredBy ? stored.lastTriggeredBy : "",
    });
  });
  if (Array.isArray(list)) {
    list.forEach((item) => {
      if (!item || !item.id || AUTOMATION_DEFAULTS.some((def) => def.id === item.id)) {
        return;
      }
      output.push({ ...item });
    });
  }
  return output;
}

function saveAutomations(list) {
  writeJson(AUTOMATIONS_FILE, list);
}

function getFileTypeConfig(type) {
  const key = String(type || "").trim().toLowerCase();
  return FILE_TYPE_CONFIG[key] ? { key, ...FILE_TYPE_CONFIG[key] } : null;
}

function sanitizeFileName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

function splitMultipartBuffer(body, boundary) {
  const parts = [];
  if (!body || !boundary) {
    return parts;
  }
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let start = body.indexOf(boundaryBuffer);
  if (start === -1) {
    return parts;
  }
  start += boundaryBuffer.length;
  while (start < body.length) {
    if (body[start] === 45 && body[start + 1] === 45) {
      break;
    }
    if (body[start] === 13 && body[start + 1] === 10) {
      start += 2;
    }
    const end = body.indexOf(boundaryBuffer, start);
    if (end === -1) {
      break;
    }
    const part = body.slice(start, end - 2);
    if (part.length) {
      parts.push(part);
    }
    start = end + boundaryBuffer.length;
  }
  return parts;
}

function parseMultipartForm(req) {
  const contentType = String(req.headers["content-type"] || "");
  const match = contentType.match(/boundary=([^;]+)/i);
  if (!match) {
    return null;
  }
  const boundary = match[1].replace(/^\"|\"$/g, "");
  if (!Buffer.isBuffer(req.body)) {
    return null;
  }
  const parts = splitMultipartBuffer(req.body, boundary);
  const fields = {};
  let file = null;
  const separator = Buffer.from("\r\n\r\n");
  parts.forEach((part) => {
    const sepIndex = part.indexOf(separator);
    if (sepIndex === -1) {
      return;
    }
    const headersText = part.slice(0, sepIndex).toString("utf8");
    const content = part.slice(sepIndex + separator.length);
    const headers = {};
    headersText.split("\r\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) {
        return;
      }
      const key = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();
      headers[key] = value;
    });
    const disposition = headers["content-disposition"] || "";
    const nameMatch = disposition.match(/name=\"([^\"]+)\"/i);
    const fileMatch = disposition.match(/filename=\"([^\"]*)\"/i);
    const fieldName = nameMatch ? nameMatch[1] : "";
    if (!fieldName) {
      return;
    }
    if (fileMatch && fileMatch[1] !== undefined) {
      file = {
        fieldName,
        originalName: fileMatch[1],
        mime: headers["content-type"] || "",
        buffer: content,
      };
      return;
    }
    fields[fieldName] = content.toString("utf8").trim();
  });
  return { fields, file };
}

function canManageFiles(user) {
  if (!user) {
    return false;
  }
  if (isFullAccessRole(user.rbacRole || user.role)) {
    return true;
  }
  return hasGranularPermission(user, "verArquivos");
}

function requireSupervisor(req, res, next) {
  const user = req.currentUser || getSessionUser(req);
  if (!user || !canManageFiles(user)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  return next();
}

function saveHealthTasks(tasks) {
  writeJson(HEALTH_TASKS_FILE, tasks);
}

function getTaskHealth(task, now) {
  const expectedMs = (task.intervalMinutes || 0) * 60 * 1000;
  const lastRun = task.lastRun ? new Date(task.lastRun) : null;
  if (!lastRun || Number.isNaN(lastRun.getTime())) {
    return { status: task.critical ? "error" : "warn", nextDue: "", overdueByMin: null };
  }
  const elapsed = now.getTime() - lastRun.getTime();
  const grace = expectedMs ? expectedMs * HEALTH_TASK_GRACE : 0;
  if (expectedMs && elapsed > grace) {
    return { status: task.critical ? "error" : "warn", nextDue: "", overdueByMin: Math.round(elapsed / 60000) };
  }
  return { status: task.lastStatus === "error" ? "error" : "ok", nextDue: "", overdueByMin: null };
}

function checkJsonFile(filePath, label) {
  const exists = fs.existsSync(filePath);
  if (!exists) {
    return { label, ok: false, message: "Arquivo ausente." };
  }
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);
    const size = fs.statSync(filePath).size;
    const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed || {}).length;
    return { label, ok: true, size, count };
  } catch (error) {
    return { label, ok: false, message: "Falha ao ler JSON." };
  }
}

function runIntegrityChecks() {
  const issues = [];
  const userIds = new Set();
  let duplicateUsers = 0;
  users.forEach((user) => {
    if (!user || !user.id) {
      issues.push({ level: "error", message: "Usuário sem ID detectado." });
      return;
    }
    if (userIds.has(user.id)) {
      duplicateUsers += 1;
    }
    userIds.add(user.id);
  });
  if (duplicateUsers) {
    issues.push({ level: "error", message: `IDs duplicados em usuários: ${duplicateUsers}.` });
  }

  const validStatuses = new Set([
    "agendada",
    "liberada",
    "backlog",
    "em_execucao",
    "encerramento",
    "concluida",
    "cancelada",
  ]);
  const maintenance = loadMaintenanceData();
  let invalidStatus = 0;
  let missingIds = 0;
  let orphanUsers = 0;
  maintenance.forEach((item) => {
    if (!item || !item.id) {
      missingIds += 1;
      return;
    }
    const status = String(item.status || "").toLowerCase();
    if (status && !validStatuses.has(status)) {
      invalidStatus += 1;
    }
  });
  if (missingIds) {
    issues.push({ level: "error", message: `Manutencoes sem ID: ${missingIds}.` });
  }
  if (invalidStatus) {
    issues.push({ level: "warn", message: `Manutenções com status desconhecido: ${invalidStatus}.` });
  }
  maintenance.forEach((item) => {
    const createdBy = item && (item.createdBy || item.createdById || item.userId);
    if (createdBy && !userIds.has(createdBy)) {
      orphanUsers += 1;
    }
  });
  if (orphanUsers) {
    issues.push({
      level: "warn",
      message: `Manutenções com usuários inexistentes: ${orphanUsers}.`,
    });
  }

  let orphanAuditUsers = 0;
  auditLog.forEach((entry) => {
    if (entry && entry.userId && !userIds.has(entry.userId)) {
      orphanAuditUsers += 1;
    }
  });
  if (orphanAuditUsers) {
    issues.push({
      level: "warn",
      message: `Auditoria com usuários inexistentes: ${orphanAuditUsers}.`,
    });
  }
  return issues;
}

function buildHealthSnapshot(tasks) {
  const now = new Date();
  const files = [
    checkJsonFile(USERS_FILE, "Usuários"),
    checkJsonFile(MAINTENANCE_FILE, "Manutencoes"),
    checkJsonFile(AUDIT_FILE, "Auditoria"),
    checkJsonFile(INVITES_FILE, "Convites"),
  ];
  const dbOk = files.every((file) => file.ok);
  const dbStatus = dbOk ? "ok" : "error";

  const normalizedTasks = normalizeHealthTasks(tasks);
  const taskStatus = normalizedTasks.map((task) => ({
    ...task,
    ...getTaskHealth(task, now),
  }));
  const criticalFailed = taskStatus.some((task) => task.status === "error" && task.critical);
  const anyWarn = taskStatus.some((task) => task.status === "warn");
  const queueStatus = criticalFailed ? "error" : anyWarn ? "warn" : "ok";

  const backupTask = taskStatus.find((task) => task.id === "backup");
  const backupStatus = backupTask ? backupTask.status : "warn";

  const issues = runIntegrityChecks();
  const integrityStatus = issues.some((issue) => issue.level === "error")
    ? "error"
    : issues.length
      ? "warn"
      : "ok";

  return {
    generatedAt: now.toISOString(),
    modules: {
      database: {
        status: dbStatus,
        files,
      },
      backups: {
        status: backupStatus,
        lastRun: backupTask ? backupTask.lastRun : "",
        lastStatus: backupTask ? backupTask.lastStatus : "",
      },
      queue: {
        status: queueStatus,
        tasks: taskStatus,
      },
      integrity: {
        status: integrityStatus,
        issues,
      },
    },
  };
}

function appendApiLog(entry) {
  apiLogs.push(entry);
  if (apiLogs.length > API_LOG_LIMIT) {
    apiLogs = apiLogs.slice(apiLogs.length - API_LOG_LIMIT);
  }
  writeJson(API_LOG_FILE, apiLogs);
}

function runHealthTask(taskId, user) {
  const index = healthTasks.findIndex((task) => task.id === taskId);
  if (index === -1) {
    return null;
  }
  const now = new Date();
  let status = "ok";
  let errorMessage = "";
  let backupFile = "";
  if (taskId === "backup") {
    try {
      ensureBackupDir();
      const snapshot = {
        createdAt: now.toISOString(),
        users,
        invites,
        auditLog,
        maintenance: loadMaintenanceData(),
      };
      const fileName = `backup-${now.toISOString().replace(/[:.]/g, "-")}.json`;
      backupFile = path.join(BACKUP_DIR, fileName);
      fs.writeFileSync(backupFile, JSON.stringify(snapshot, null, 2));
    } catch (error) {
      status = "error";
      errorMessage = "Falha ao gerar backup.";
    }
  }
  const updated = {
    ...healthTasks[index],
    lastRun: now.toISOString(),
    lastStatus: status,
    lastError: errorMessage,
    lastRunBy: user ? user.id : "",
    lastBackupFile: backupFile || healthTasks[index].lastBackupFile || "",
  };
  healthTasks[index] = updated;
  saveHealthTasks(healthTasks);
  return updated;
}

function normalizeCargo(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getCargoLevel(cargo) {
  const normalized = normalizeCargo(cargo);
  if (!normalized) {
    return 0;
  }
  if (normalized.includes("diretor o m")) {
    return 6;
  }
  if (normalized.includes("gerente de contrato")) {
    return 5;
  }
  if (normalized.includes("supervisor o m")) {
    return 4;
  }
  if (normalized.includes("tecnico senior")) {
    return 3;
  }
  if (normalized.includes("tecnico pleno")) {
    return 2;
  }
  if (normalized.includes("tecnico junior")) {
    return 1;
  }
  return 0;
}

function canEditProfile(actor, target) {
  if (!actor || !target) {
    return false;
  }
  if (isFullAccessRole(actor.rbacRole || actor.role)) {
    return true;
  }
  if (actor.id === target.id) {
    return hasGranularPermission(actor, "editarPerfil");
  }
  if (!hasGranularPermission(actor, "editarPerfilOutros")) {
    return false;
  }
  const actorLevel = getCargoLevel(actor.cargo);
  const targetLevel = getCargoLevel(target.cargo);
  return actorLevel > targetLevel;
}

function getProjectById(id) {
  const target = String(id || "").trim();
  if (!target) {
    return null;
  }
  return projects.find((project) => project && project.id === target) || null;
}

function getProjectByCode(code) {
  const target = String(code || "").trim();
  if (!target) {
    return null;
  }
  return projects.find((project) => String(project.codigo || "").trim() === target) || null;
}

function ensureDefaultProject() {
  let list = Array.isArray(projects) ? projects.slice() : [];
  let defaultProject = getProjectByCode(DEFAULT_PROJECT_CODE);
  if (!defaultProject) {
    defaultProject = normalizeProject({
      codigo: DEFAULT_PROJECT_CODE,
      nome: DEFAULT_PROJECT_NAME,
      cliente: "",
      descricao: "",
      locais: DEFAULT_PROJECT_LOCAIS,
      pmpHorasDisponiveis: 40,
    });
    list = list.concat(defaultProject);
    projects = list;
    saveProjects(projects);
  }
  if (
    defaultProject &&
    (!Array.isArray(defaultProject.locais) || defaultProject.locais.length === 0)
  ) {
    defaultProject = {
      ...defaultProject,
      locais: DEFAULT_PROJECT_LOCAIS.slice(),
      pmpHorasDisponiveis:
        Number.isFinite(Number(defaultProject.pmpHorasDisponiveis))
          ? defaultProject.pmpHorasDisponiveis
          : 40,
      updatedAt: new Date().toISOString(),
    };
    list = list.map((item) => (item.id === defaultProject.id ? defaultProject : item));
    projects = list;
    saveProjects(projects);
  }
  return defaultProject;
}

function mapUserRoleToProjectRole(user) {
  const cargo = normalizeCargo(user && user.cargo);
  if (cargo.includes("diretor")) {
    return "Diretor";
  }
  if (cargo.includes("gerente")) {
    return "Gerente";
  }
  if (cargo.includes("supervisor")) {
    return "Supervisor";
  }
  if (cargo.includes("tecnico")) {
    return "Tecnico";
  }
  const role = normalizeRbacRole(user && (user.rbacRole || user.role));
  if (role === "pcm") {
    return "Gerente";
  }
  if (role === "diretor_om") {
    return "Diretor";
  }
  if (role === "gerente_contrato") {
    return "Gerente";
  }
  if (role === "supervisor_om") {
    return "Supervisor";
  }
  return "Tecnico";
}

function canSeeAllProjects(role) {
  const normalized = normalizeRbacRole(role);
  return (
    normalized === "pcm" ||
    normalized === "diretor_om" ||
    normalized === "gerente_contrato" ||
    normalized === "supervisor_om"
  );
}

function isMasterUser(user) {
  if (!user) {
    return false;
  }
  const matricula = String(user.matricula || "").trim();
  const username = String(user.username || "").trim().toLowerCase();
  const masterMatricula = String(MASTER_MATRICULA || "").trim();
  const masterUsername = String(MASTER_USERNAME || "").trim().toLowerCase();
  return (masterMatricula && matricula === masterMatricula) || (masterUsername && username === masterUsername);
}

function canDeleteMaintenance(user) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user)) {
    return true;
  }
  return normalizeRbacRole(user.rbacRole || user.role) === "pcm";
}

function canManagePmpActivities(user) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user)) {
    return true;
  }
  return normalizeRbacRole(user.rbacRole || user.role) === "pcm";
}

function getUserProjectIds(user) {
  if (!user || !user.id) {
    return [];
  }
  if (isMasterUser(user)) {
    return projects.map((project) => project.id).filter(Boolean);
  }
  if (canSeeAllProjects(user.rbacRole || user.role)) {
    return projects.map((project) => project.id).filter(Boolean);
  }
  const ids = projectUsers
    .filter((entry) => entry && entry.userId === user.id)
    .map((entry) => entry.projectId)
    .filter(Boolean);
  return Array.from(new Set(ids));
}

function getProjectIdsForUserId(userId) {
  const id = String(userId || "").trim();
  if (!id) {
    return [];
  }
  return projectUsers
    .filter((entry) => entry && entry.userId === id)
    .map((entry) => entry.projectId)
    .filter(Boolean);
}

function userHasProjectAccess(user, projectId) {
  if (!user || !projectId) {
    return false;
  }
  if (isMasterUser(user)) {
    return true;
  }
  if (canSeeAllProjects(user.rbacRole || user.role)) {
    return true;
  }
  return projectUsers.some(
    (entry) => entry && entry.userId === user.id && entry.projectId === projectId
  );
}

function ensureUserProjectLinks(defaultProjectId) {
  if (!Array.isArray(users) || !users.length) {
    return;
  }
  const existing = new Set(
    projectUsers.map((entry) => `${entry.userId || ""}:${entry.projectId || ""}`)
  );
  const created = [];
  users.forEach((user) => {
    const key = `${user.id}:${defaultProjectId}`;
    if (existing.has(key)) {
      return;
    }
    created.push(
      normalizeProjectUser({
        projectId: defaultProjectId,
        userId: user.id,
        papel: mapUserRoleToProjectRole(user),
      })
    );
  });
  if (created.length) {
    projectUsers = projectUsers.concat(created);
    saveProjectUsers(projectUsers);
  }
}

function ensureUserProjectLink(user, projectId) {
  if (!user || !user.id || !projectId) {
    return;
  }
  if (projectUsers.some((entry) => entry && entry.userId === user.id && entry.projectId === projectId)) {
    return;
  }
  const record = normalizeProjectUser({
    projectId,
    userId: user.id,
    papel: mapUserRoleToProjectRole(user),
  });
  projectUsers = projectUsers.concat(record);
  saveProjectUsers(projectUsers);
}

function setUserProjectAssignment(user, projectId) {
  if (!user || !user.id) {
    return;
  }
  const target = String(projectId || "").trim();
  projectUsers = projectUsers.filter((entry) => entry && entry.userId !== user.id);
  if (target) {
    projectUsers = projectUsers.concat(
      normalizeProjectUser({
        projectId: target,
        userId: user.id,
        papel: mapUserRoleToProjectRole(user),
      })
    );
  }
  saveProjectUsers(projectUsers);
}

function migrateRecordsProjectId(list, defaultProjectId) {
  if (!Array.isArray(list)) {
    return { list: [], changed: false };
  }
  let changed = false;
  const updated = list.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }
    if (!item.projectId) {
      changed = true;
      return { ...item, projectId: defaultProjectId };
    }
    if (!getProjectById(item.projectId)) {
      changed = true;
      return { ...item, projectId: defaultProjectId };
    }
    return item;
  });
  return { list: updated, changed };
}

function ensureProjectSeedData() {
  projects = loadProjects();
  const defaultProject = ensureDefaultProject();
  projectUsers = loadProjectUsers();
  ensureUserProjectLinks(defaultProject.id);
  equipamentos = loadEquipamentos();

  const maintenance = loadMaintenanceData();
  const maintenanceMigration = migrateRecordsProjectId(maintenance, defaultProject.id);
  if (maintenanceMigration.changed) {
    writeJson(MAINTENANCE_FILE, maintenanceMigration.list);
  }

  const auditMigration = migrateRecordsProjectId(auditLog, defaultProject.id);
  if (auditMigration.changed) {
    auditLog = auditMigration.list;
    writeJson(AUDIT_FILE, auditLog);
  }

  const filesMigration = migrateRecordsProjectId(filesMeta, defaultProject.id);
  if (filesMigration.changed) {
    filesMeta = filesMigration.list;
    writeJson(FILES_META_FILE, filesMeta);
  }

  const automationMigration = migrateRecordsProjectId(automations, defaultProject.id);
  if (automationMigration.changed) {
    automations = automationMigration.list;
    saveAutomations(automations);
  }
}

function normalizeProjectKey(value) {
  return String(value || "").trim().toUpperCase();
}

function getProjectLabel(project) {
  if (!project) {
    return "";
  }
  return `${project.codigo || "-"} - ${project.nome || "-"}`;
}

function getUserProjectKey(user) {
  const raw =
    (user && (user.projeto || user.projectKey || user.localizacao || user.location)) || "HV";
  return normalizeProjectKey(raw || "HV");
}

function getActiveProjectId(req, user) {
  if (!user) {
    return null;
  }
  const fromSession = req && req.session ? String(req.session.activeProjectId || "").trim() : "";
  if (fromSession && userHasProjectAccess(user, fromSession)) {
    return fromSession;
  }
  const ids = getUserProjectIds(user);
  if (ids.length) {
    return ids[0];
  }
  const fallback = ensureDefaultProject();
  return fallback ? fallback.id : null;
}

function parseDateOnly(value) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return startOfDay(value);
  }
  if (typeof value === "number") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : startOfDay(date);
  }
  const text = String(value).trim();
  if (!text) {
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const date = new Date(`${text}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : startOfDay(date);
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
}

function parseDateTime(value) {
  if (!value) {
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
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function diffInDays(from, to) {
  const ms = to.getTime() - from.getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

function isSameDay(a, b) {
  if (!a || !b) {
    return false;
  }
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortLabel(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

function normalizeStatus(raw) {
  const value = String(raw || "").trim().toLowerCase();
  if (!value) {
    return "agendada";
  }
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (["concluida", "concluido", "done", "completed", "finalizada", "finalizado"].includes(normalized)) {
    return "concluida";
  }
  if (["cancelada", "cancelado", "canceled", "cancelled"].includes(normalized)) {
    return "cancelada";
  }
  if (
    [
      "em_execucao",
      "execucao",
      "executando",
      "em_exec"
    ].includes(normalized)
  ) {
    return "em_execucao";
  }
  if (["encerramento", "encerrando", "encerrado", "finalizacao"].includes(normalized)) {
    return "encerramento";
  }
  if (["backlog", "atrasada", "atrasado", "overdue"].includes(normalized)) {
    return "backlog";
  }
  if (
    [
      "liberada",
      "liberado",
      "liberacao",
      "liberado_para_execucao",
      "liberada_para_execucao",
      "released"
    ].includes(normalized)
  ) {
    return "liberada";
  }
  if (
    ["agendada", "agendado", "programada", "programado", "pendente", "scheduled"].includes(
      normalized
    )
  ) {
    return "agendada";
  }
  return "agendada";
}

function getDueDate(item) {
  return parseDateOnly(item.prazo || item.data || item.dueDate || item.prazoManutencao);
}

function getCompletedAt(item) {
  return parseDateTime(
    item.dataConclusao || item.doneAt || item.concluidaEm || item.concluidoEm || item.completedAt
  );
}

function isCritical(item) {
  const crit = String(item.criticidade || "").trim().toLowerCase();
  return Boolean(
    item.safetyCritical ||
      item.critico ||
      crit === "alta" ||
      crit === "critica" ||
      crit === "critico" ||
      crit === "sim"
  );
}

function getItemTitle(item) {
  return (
    String(item.atividade || item.titulo || item.nome || item.task || "Atividade").trim() ||
    "Atividade"
  );
}

function getItemOwner(item) {
  return (
    String(
      item.responsavel ||
        item.executadaPor ||
        item.owner ||
        item.responsavelManutencao ||
        "Equipe"
    ).trim() || "Equipe"
  );
}

function matchesAutomationCondition(automation, item) {
  if (!automation || !automation.condition) {
    return false;
  }
  if (automation.condition.type === "critical") {
    return isCritical(item);
  }
  return false;
}

async function executeAutomationAction(automation, item, actor) {
  const action = automation && automation.action ? automation.action : {};
  if (action.type !== "notify_email") {
    return { status: "skipped", message: "Ação não suportada." };
  }
  const customTo = String(action.to || "").trim();
  const to = isValidEmail(customTo) ? customTo : getUserEmail(actor);
  if (!isValidEmail(to)) {
    console.warn("Automação sem destinatário válido.");
    return { status: "skipped", message: "Sem destinatário válido." };
  }
  const title = getItemTitle(item);
  const due = getDueDate(item);
  const dueLabel = due ? due.toLocaleDateString("pt-BR") : "-";
  const subject = "OPSCOPE - Manutenção crítica criada";
  const text = `Uma manutenção crítica foi criada.\n\nAtividade: ${title}\nPrazo: ${dueLabel}\nResponsável: ${getItemOwner(item)}\n\nAcesse o OPSCOPE para detalhes.`;
  const html = `
    <p>Uma manutenção <strong>crítica</strong> foi criada.</p>
    <p><strong>Atividade:</strong> ${title}</p>
    <p><strong>Prazo:</strong> ${dueLabel}</p>
    <p><strong>Responsável:</strong> ${getItemOwner(item)}</p>
    <p>Acesse o OPSCOPE para detalhes.</p>
  `;
  const resendOk = await sendEmailViaResend({ to, subject, text, html });
  if (resendOk) {
    return { status: "ok", message: "E-mail enviado via Resend." };
  }
  const smtpOk = await sendEmailViaSmtp({ to, subject, text, html });
  if (smtpOk) {
    return { status: "ok", message: "E-mail enviado via SMTP." };
  }
  console.warn("Automação sem envio de e-mail. Fallback console log.");
  console.log(`[automation] ${subject} -> ${to}`, { id: item.id, title });
  return { status: "warn", message: "Envio de e-mail indisponível." };
}

async function runAutomationsForItems(event, items, actor, ip) {
  if (!Array.isArray(items) || !items.length) {
    return;
  }
  let changed = false;
  for (const automation of automations) {
    if (!automation.enabled || automation.event !== event) {
      continue;
    }
    for (const item of items) {
      if (automation.projectId && item && item.projectId !== automation.projectId) {
        continue;
      }
      if (!matchesAutomationCondition(automation, item)) {
        continue;
      }
      const result = await executeAutomationAction(automation, item, actor);
      const now = new Date().toISOString();
      automation.lastRunAt = now;
      automation.lastStatus = result.status;
      automation.lastError = result.status === "ok" ? "" : result.message || "";
      automation.lastItemId = item.id || "";
      automation.lastTriggeredBy = actor ? actor.id : "";
      appendAudit(
        "automation_trigger",
        actor ? actor.id : null,
        {
          automationId: automation.id,
          status: result.status,
          itemId: item.id || "",
          message: result.message || "",
          projectId: automation.projectId || item.projectId || "",
        },
        ip || "unknown",
        automation.projectId || item.projectId || null
      );
      changed = true;
    }
  }
  if (changed) {
    saveAutomations(automations);
  }
}

function loadMaintenanceData() {
  const data = readJson(MAINTENANCE_FILE, []);
  return Array.isArray(data) ? data : [];
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function appendAudit(action, userId, details, ip, projectId = null) {
  const timestamp = new Date().toISOString();
  const prevHash = auditLog.length ? auditLog[auditLog.length - 1].hash : "";
  const payload = JSON.stringify({
    action,
    userId,
    details,
    ip,
    timestamp,
    prevHash,
    projectId,
  });
  const hash = sha256(payload);
  const entry = {
    id: crypto.randomUUID(),
    action,
    userId,
    details,
    ip,
    timestamp,
    prevHash,
    hash,
    projectId: projectId || (details && details.projectId ? details.projectId : null),
  };
  auditLog.push(entry);
  writeJson(AUDIT_FILE, auditLog);
}

function normalizeRbacRole(role) {
  const raw = String(role || "").trim();
  if (!raw) {
    return "tecnico_junior";
  }
  const normalized = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const mapped = {
    pcm: "pcm",
    diretor: "diretor_om",
    diretor_om: "diretor_om",
    diretor_o_m: "diretor_om",
    diretorom: "diretor_om",
    gerente: "gerente_contrato",
    gerente_contrato: "gerente_contrato",
    gerente_de_contrato: "gerente_contrato",
    gerentecontrato: "gerente_contrato",
    supervisor: "supervisor_om",
    supervisor_om: "supervisor_om",
    supervisor_o_m: "supervisor_om",
    tecnico_senior: "tecnico_senior",
    tecnicosenior: "tecnico_senior",
    tecnico_pleno: "tecnico_pleno",
    tecnicopleno: "tecnico_pleno",
    tecnico_junior: "tecnico_junior",
    tecnicojunior: "tecnico_junior",
    executor: "tecnico_junior",
    colaborador: "tecnico_junior",
    leitura: "leitura",
    admin: "pcm",
  };
  return mapped[normalized] || normalized || "tecnico_junior";
}

function isFullAccessRole(role) {
  return FULL_ACCESS_ROLES.has(normalizeRbacRole(role));
}

function isPcmRole(role) {
  return normalizeRbacRole(role) === "pcm";
}

function getUserEmail(user) {
  if (!user) {
    return "";
  }
  const direct = String(user.email || "").trim();
  if (direct) {
    return direct;
  }
  const matricula = String(user.matricula || "").trim();
  if (matricula.includes("@")) {
    return matricula;
  }
  const username = String(user.username || "").trim();
  if (username.includes("@")) {
    return username;
  }
  return "";
}

function canOverrideRelease(user) {
  if (!user) {
    return false;
  }
  const role = normalizeRbacRole(user.rbacRole || user.role);
  return RELEASE_OVERRIDE_ROLES.has(role);
}

function normalizeRole(role, rbacRole) {
  const val = String(role || "").trim().toLowerCase();
  if (val === "admin" || val === "supervisor" || val === "executor" || val === "leitura") {
    return val;
  }
  const normalizedRbac = normalizeRbacRole(rbacRole || role);
  if (isFullAccessRole(normalizedRbac)) {
    return "admin";
  }
  if (normalizedRbac === "supervisor_om") {
    return "supervisor";
  }
  if (normalizedRbac === "leitura") {
    return "leitura";
  }
  return "executor";
}

function clonePermissions(source) {
  const result = {};
  PERMISSION_KEYS.forEach((key) => {
    result[key] = Boolean(source && source[key]);
  });
  return result;
}

function buildPermissions(role, explicitPermissions) {
  const normalized = normalizeRbacRole(role);
  if (isFullAccessRole(normalized)) {
    return clonePermissions(FULL_PERMISSIONS);
  }
  const base = ROLE_DEFAULT_PERMISSIONS[normalized] || ROLE_DEFAULT_PERMISSIONS.executor || NO_PERMISSIONS;
  const permissions = clonePermissions(base);
  if (explicitPermissions && typeof explicitPermissions === "object") {
    PERMISSION_KEYS.forEach((key) => {
      if (key in explicitPermissions) {
        permissions[key] = Boolean(explicitPermissions[key]);
      }
    });
  }
  return permissions;
}

function mergePermissions(role, currentPermissions, patchPermissions) {
  if (isFullAccessRole(role)) {
    return clonePermissions(FULL_PERMISSIONS);
  }
  const permissions = buildPermissions(role, currentPermissions);
  if (patchPermissions && typeof patchPermissions === "object") {
    PERMISSION_KEYS.forEach((key) => {
      if (key in patchPermissions) {
        permissions[key] = Boolean(patchPermissions[key]);
      }
    });
  }
  return permissions;
}

function buildSections(role, explicitSections) {
  const config = { ...DEFAULT_SECTIONS };
  if (explicitSections && typeof explicitSections === "object") {
    Object.keys(DEFAULT_SECTIONS).forEach((key) => {
      if (key in explicitSections) {
        config[key] = Boolean(explicitSections[key]);
      }
    });
  }
  if (isFullAccessRole(role)) {
    ADMIN_SECTIONS.forEach((key) => {
      config[key] = true;
    });
  }
  return config;
}

function normalizeGranularPermissions(payload) {
  const normalized = {};
  GRANULAR_PROFILE_CATALOG.forEach((profile) => {
    const defaults = GRANULAR_DEFAULT_PERMISSIONS[profile.key] || GRANULAR_BASE_PERMISSIONS;
    const current = payload && typeof payload === "object" ? payload[profile.key] : null;
    const profilePermissions = {};
    GRANULAR_PERMISSION_CATALOG.forEach((perm) => {
      if (current && perm.key in current) {
        profilePermissions[perm.key] = Boolean(current[perm.key]);
        return;
      }
      profilePermissions[perm.key] = Boolean(defaults[perm.key]);
    });
    normalized[profile.key] = profilePermissions;
  });
  return normalized;
}

function getProfileKeyForUser(user) {
  if (!user) {
    return "leitura";
  }
  const rbacRole = normalizeRbacRole(user.rbacRole || user.role);
  const known = GRANULAR_PROFILE_CATALOG.some((profile) => profile.key === rbacRole);
  if (known) {
    return rbacRole;
  }
  const cargo = normalizeCargo(user.cargo);
  if (cargo.includes("supervisor o m")) {
    return "supervisor_om";
  }
  if (cargo.includes("tecnico senior")) {
    return "tecnico_senior";
  }
  if (cargo.includes("tecnico pleno")) {
    return "tecnico_pleno";
  }
  if (cargo.includes("tecnico junior")) {
    return "tecnico_junior";
  }
  return "leitura";
}

function getGranularPermissionsForUser(user) {
  const profileKey = getProfileKeyForUser(user);
  const base =
    granularPermissions && granularPermissions[profileKey]
      ? granularPermissions[profileKey]
      : GRANULAR_DEFAULT_PERMISSIONS[profileKey] || GRANULAR_BASE_PERMISSIONS;
  if (!isPcmRole(user && (user.rbacRole || user.role))) {
    return {
      ...base,
      gerenciarProjetos: false,
      gerenciarEquipamentos: false,
      gerenciarEquipeProjeto: false,
    };
  }
  return base;
}

function hasGranularPermission(user, permissionKey) {
  const permissions = getGranularPermissionsForUser(user);
  return Boolean(permissions && permissions[permissionKey]);
}

function diffGranularPermissions(before, after) {
  const changes = [];
  GRANULAR_PROFILE_CATALOG.forEach((profile) => {
    const prev = (before && before[profile.key]) || {};
    const next = (after && after[profile.key]) || {};
    GRANULAR_PERMISSION_CATALOG.forEach((perm) => {
      const from = Boolean(prev[perm.key]);
      const to = Boolean(next[perm.key]);
      if (from !== to) {
        changes.push({ perfil: profile.key, permissao: perm.key, de: from, para: to });
      }
    });
  });
  return changes;
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }
  const rbacRole = normalizeRbacRole(user.rbacRole || user.role);
  const role = normalizeRole(user.role, rbacRole);
  const email = getUserEmail(user);
  const emailVerified = user.emailVerified !== false;
  return {
    id: user.id,
    username: user.username,
    matricula: user.matricula,
    name: user.name,
    role,
    rbacRole,
    cargo: user.cargo || "",
    email,
    emailVerified,
    projeto: user.projeto || "",
    uen: user.uen || "",
    localizacao: user.localizacao || "",
    projectId: user.projectId || "",
    active: user.active !== false,
    permissions: buildPermissions(rbacRole, user.permissions),
    granularPermissions: getGranularPermissionsForUser(user),
    sections: buildSections(rbacRole, user.sections),
    avatarUrl: user.avatarUrl || "",
    avatarUpdatedAt: user.avatarUpdatedAt || "",
    createdAt: user.createdAt,
  };
}

function normalizeUserRecord(user) {
  const rbacRole = normalizeRbacRole(user.rbacRole || user.role);
  const role = normalizeRole(user.role, rbacRole);
  const email = getUserEmail(user);
  return {
    ...user,
    role,
    rbacRole,
    email,
    emailVerified: user.emailVerified !== false,
    active: user.active !== false,
    permissions: buildPermissions(rbacRole, user.permissions),
    sections: buildSections(rbacRole, user.sections),
  };
}

function ensureMasterAccount() {
  const username = MASTER_USERNAME.toLowerCase();
  const matricula = String(MASTER_MATRICULA || "").trim().toUpperCase();
  const rbacRole = normalizeRbacRole(MASTER_ROLE);
  const legacyRole = normalizeRole("admin", rbacRole);
  let index = users.findIndex((user) => String(user.username || "").toLowerCase() === username);
  if (index === -1 && matricula) {
    index = users.findIndex((user) => String(user.matricula || "").toUpperCase() === matricula);
  }

  if (index >= 0) {
    const current = users[index];
    const updated = normalizeUserRecord({
      ...current,
      username: MASTER_USERNAME,
      matricula: matricula || current.matricula,
      name: MASTER_NAME,
      role: legacyRole,
      rbacRole,
      cargo: MASTER_CARGO,
      active: true,
      permissions: buildPermissions(rbacRole, current.permissions),
      sections: buildSections(rbacRole, current.sections),
    });
    if (!updated.matricula) {
      updated.matricula = MASTER_USERNAME.toUpperCase();
    }
    if (!updated.createdAt) {
      updated.createdAt = new Date().toISOString();
    }
    if (JSON.stringify(updated) !== JSON.stringify(current)) {
      users[index] = updated;
      writeJson(USERS_FILE, users);
      appendAudit("seed_master_sync", updated.id, { username: MASTER_USERNAME }, "local");
    }
    return;
  }

  const passwordHash = bcrypt.hashSync(MASTER_PASSWORD, 12);
  const master = normalizeUserRecord({
    id: crypto.randomUUID(),
    username: MASTER_USERNAME,
    matricula: MASTER_USERNAME.toUpperCase(),
    name: MASTER_NAME,
    role: legacyRole,
    rbacRole,
    cargo: MASTER_CARGO,
    active: true,
    passwordHash,
    permissions: buildPermissions(rbacRole),
    sections: buildSections(rbacRole),
    createdAt: new Date().toISOString(),
  });
  users.push(master);
  writeJson(USERS_FILE, users);
  appendAudit("seed_master", master.id, { username: MASTER_USERNAME }, "local");
  console.log("Admin master criado: usuário", MASTER_USERNAME);
}

function seedAdmin() {
  const hasAdmin = users.some((user) => normalizeRole(user.role, user.rbacRole) === "admin");
  if (hasAdmin) {
    return;
  }
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
  const admin = normalizeUserRecord({
    id: crypto.randomUUID(),
    username: "admin",
    matricula: "ADMIN",
    name: "Administrador",
    role: "admin",
    rbacRole: "pcm",
    active: true,
    passwordHash,
    permissions: buildPermissions("pcm"),
    sections: buildSections("pcm"),
    createdAt: new Date().toISOString(),
  });
  users.push(admin);
  writeJson(USERS_FILE, users);
  appendAudit("seed_admin", admin.id, { resumo: "Admin inicial criado." }, "local");
  console.log("Admin criado: usuário admin / senha", ADMIN_PASSWORD);
}

function cleanupInvites() {
  const now = Date.now();
  invites = invites.filter((invite) => !invite.expiresAt || new Date(invite.expiresAt).getTime() > now);
  writeJson(INVITES_FILE, invites);
}

function createInviteCode() {
  return crypto.randomBytes(6).toString("base64url").toUpperCase();
}

function validatePassword(password) {
  const value = String(password || "");
  const rules = {
    length: value.length >= 12,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };
  const ok = Object.values(rules).every(Boolean);
  return { ok, rules };
}

function isValidEmail(email) {
  const value = String(email || "").trim();
  if (!value) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function withTimeout(promise, timeoutMs) {
  if (!timeoutMs || !Number.isFinite(timeoutMs)) {
    return promise;
  }
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });
}

let mailer = null;

function getMailer() {
  if (!nodemailer || !SMTP_HOST || !SMTP_FROM) {
    return null;
  }
  if (!mailer) {
    mailer = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
      connectionTimeout: SMTP_TIMEOUT_MS,
      greetingTimeout: SMTP_TIMEOUT_MS,
      socketTimeout: SMTP_TIMEOUT_MS,
    });
  }
  return mailer;
}

async function sendEmailViaResend({ to, subject, text, html }) {
  if (!RESEND_API_KEY || !RESEND_FROM) {
    return false;
  }
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  let timeoutId = null;
  if (controller) {
    timeoutId = setTimeout(() => controller.abort(), SMTP_TIMEOUT_MS);
  }
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [to],
        subject,
        text,
        html,
      }),
      signal: controller ? controller.signal : undefined,
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.warn(`Resend falhou (${response.status}).`, body);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Resend falhou.", error && error.message ? error.message : error);
    return false;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

async function sendEmailViaSmtp({ to, subject, text, html }) {
  const transporter = getMailer();
  if (!transporter) {
    return false;
  }
  try {
    await withTimeout(
      transporter.sendMail({
        from: SMTP_FROM,
        to,
        subject,
        text,
        html,
      }),
      SMTP_TIMEOUT_MS
    );
    return true;
  } catch (error) {
    console.warn("Falha ao enviar e-mail.", error && error.message ? error.message : error);
    return false;
  }
}

async function sendVerificationEmail(email, name, token) {
  const baseUrl = String(APP_BASE_URL || "").replace(/\/$/, "");
  const verifyUrl = `${baseUrl}/?verify=${encodeURIComponent(token)}`;
  const safeName = String(name || "").trim() || "colaborador";
  const subject = "Confirmação de e-mail - OPSCOPE";
  const text = `Olá, ${safeName}!\n\nConfirme seu e-mail para ativar sua conta OPSCOPE:\n${verifyUrl}\n\nSe você não solicitou o acesso, ignore este e-mail.`;
  const html = `
    <p>Olá, <strong>${safeName}</strong>!</p>
    <p>Confirme seu e-mail para ativar sua conta OPSCOPE:</p>
    <p><a href="${verifyUrl}">Confirmar e-mail</a></p>
    <p>Se você não solicitou o acesso, ignore este e-mail.</p>
  `;
  const resendOk = await sendEmailViaResend({ to: email, subject, text, html });
  if (resendOk) {
    return true;
  }
  return sendEmailViaSmtp({ to: email, subject, text, html });
}

function cleanupVerifications() {
  const now = Date.now();
  verifications = verifications.filter(
    (item) => !item.expiresAt || new Date(item.expiresAt).getTime() > now
  );
  writeJson(VERIFICATIONS_FILE, verifications);
}

function getClientIp(req) {
  return req.ip || req.connection.remoteAddress || "unknown";
}

function isIpBlocked(ip) {
  const info = ipFailures.get(ip);
  if (!info) {
    return false;
  }
  if (Date.now() - info.firstAt > IP_WINDOW_MS) {
    ipFailures.delete(ip);
    return false;
  }
  return info.count >= IP_MAX_ATTEMPTS;
}

function recordIpFailure(ip) {
  const info = ipFailures.get(ip);
  if (!info || Date.now() - info.firstAt > IP_WINDOW_MS) {
    ipFailures.set(ip, { count: 1, firstAt: Date.now() });
    return;
  }
  info.count += 1;
}

function isUserLocked(loginKey) {
  const info = userFailures.get(loginKey);
  if (!info) {
    return false;
  }
  if (info.lockedUntil && Date.now() < info.lockedUntil) {
    return true;
  }
  if (Date.now() - info.firstAt > USER_WINDOW_MS) {
    userFailures.delete(loginKey);
    return false;
  }
  return false;
}

function recordUserFailure(loginKey) {
  const info = userFailures.get(loginKey);
  if (!info || Date.now() - info.firstAt > USER_WINDOW_MS) {
    userFailures.set(loginKey, { count: 1, firstAt: Date.now(), lockedUntil: null });
    return;
  }
  info.count += 1;
  if (info.count >= USER_MAX_ATTEMPTS) {
    info.lockedUntil = Date.now() + USER_LOCK_MS;
  }
}

function clearFailures(ip, loginKey) {
  if (ip) {
    ipFailures.delete(ip);
  }
  if (loginKey) {
    userFailures.delete(loginKey);
  }
}

function getSessionUser(req) {
  if (!req.session || !req.session.userId) {
    return null;
  }
  const user = users.find((item) => item.id === req.session.userId);
  if (!user || user.active === false) {
    return null;
  }
  return user;
}

function hasPermission(user, permissionKey) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user)) {
    return true;
  }
  if (isFullAccessRole(user.rbacRole || user.role)) {
    return true;
  }
  const permissions = buildPermissions(user.rbacRole || user.role, user.permissions);
  return Boolean(permissions && permissions[permissionKey]);
}

function requireAuth(req, res, next) {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: "Nao autorizado." });
  }
  req.currentUser = user;
  return next();
}

function requirePermission(permissionKey) {
  return (req, res, next) => {
    const user = req.currentUser || getSessionUser(req);
    if (isMasterUser(user)) {
      return next();
    }
    const isLegacy = String(permissionKey || "").startsWith("admin:");
    const allowed = isLegacy
      ? hasPermission(user, permissionKey)
      : hasGranularPermission(user, permissionKey);
    if (!allowed) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    return next();
  };
}

function requireAdmin(req, res, next) {
  const user = req.currentUser || getSessionUser(req);
  if (!user || (!isMasterUser(user) && !isFullAccessRole(user.rbacRole || user.role))) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  return next();
}

function requireProjectAccess(req, res, next) {
  const user = req.currentUser || getSessionUser(req);
  const projectId =
    String(req.params.id || req.body.projectId || req.query.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatório." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  req.projectId = projectId;
  return next();
}

function buildDashboardSummary(items, projectId) {
  const today = startOfDay(new Date());
  const pendingItems = [];
  const completedItems = [];
  let missingCompletionDates = 0;

  items.forEach((item) => {
    const status = normalizeStatus(item.status);
    if (status === "cancelada") {
      return;
    }
    if (status === "concluida") {
      completedItems.push(item);
      return;
    }
    pendingItems.push(item);
  });

  const venceHoje = pendingItems.filter((item) => {
    const due = getDueDate(item);
    return due && isSameDay(due, today);
  }).length;

  const atrasadas = pendingItems.filter((item) => {
    const due = getDueDate(item);
    return due && due < today;
  }).length;

  const criticas = pendingItems.filter((item) => isCritical(item)).length;

  const score = atrasadas * 2 + criticas * 3 + venceHoje;
  let riscoImediato = "Baixo";
  if (score > 12) {
    riscoImediato = "Cr\u00edtico";
  } else if (score >= 7) {
    riscoImediato = "Alto";
  } else if (score >= 3) {
    riscoImediato = "Moderado";
  }

  const alertasOperacionais = [];
  pendingItems
    .filter((item) => isCritical(item))
    .slice(0, 3)
    .forEach((item) => {
      const due = getDueDate(item);
      const dueLabel = due ? formatDateISO(due) : "--";
      alertasOperacionais.push({
        tipo: "critico",
        msg: `${getItemTitle(item)} - prazo ${dueLabel}`,
      });
    });

  if (alertasOperacionais.length < 3) {
    pendingItems
      .filter((item) => {
        if (isCritical(item)) {
          return false;
        }
        const due = getDueDate(item);
        return due && (due < today || isSameDay(due, today));
      })
      .slice(0, 3 - alertasOperacionais.length)
      .forEach((item) => {
        const due = getDueDate(item);
        const dueLabel = due ? formatDateISO(due) : "--";
        alertasOperacionais.push({
          tipo: "aviso",
          msg: `${getItemTitle(item)} - prazo ${dueLabel}`,
        });
      });
  }

  const backlogTotal = pendingItems.filter((item) => {
    const status = normalizeStatus(item.status);
    if (status === "backlog") {
      return true;
    }
    if (status === "em_execucao" || status === "encerramento") {
      return false;
    }
    const due = getDueDate(item);
    return due && due < today;
  }).length;

  const sevenDaysAgo = startOfDay(addDays(today, -6));
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let concluidasTotal = 0;
  let concluidasNoPrazo = 0;
  let concluidasPeriodo = 0;

  completedItems.forEach((item) => {
    let completedAt = getCompletedAt(item);
    if (!completedAt) {
      completedAt = today;
      missingCompletionDates += 1;
    }
    const completedDay = startOfDay(completedAt);
    const inPeriodo = completedDay >= sevenDaysAgo && completedDay <= today;
    if (inPeriodo) {
      concluidasTotal += 1;
      const due = getDueDate(item);
      if (!due || completedDay <= due) {
        concluidasNoPrazo += 1;
      }
    }
    if (completedAt >= last24h && completedAt <= new Date()) {
      concluidasPeriodo += 1;
    }
  });

  const pontualidadePct = concluidasTotal
    ? Math.round((concluidasNoPrazo / concluidasTotal) * 100)
    : 0;

  const atrasos = pendingItems
    .map((item) => {
      const status = normalizeStatus(item.status);
      if (status === "em_execucao" || status === "encerramento") {
        return null;
      }
      const due = getDueDate(item);
      if (!due || due >= today) {
        return null;
      }
      return diffInDays(due, today);
    })
    .filter((value) => typeof value === "number");
  const atrasoMedioDias = atrasos.length
    ? Number((atrasos.reduce((acc, value) => acc + value, 0) / atrasos.length).toFixed(1))
    : 0;

  const proximasAtividades = pendingItems
    .filter((item) => {
      const status = normalizeStatus(item.status);
      return status === "agendada" || status === "liberada";
    })
    .map((item) => {
      const due = getDueDate(item);
      return due ? { item, due } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.due - b.due)
    .slice(0, 5)
    .map(({ item, due }) => {
      let status = "Em dia";
      if (isSameDay(due, today)) {
        status = "Hoje";
      } else if (due < today) {
        status = "Atrasada";
      }
      return {
        atividade: getItemTitle(item),
        responsavel: getItemOwner(item),
        prazo: formatDateISO(due),
        status,
      };
    });

  const labels = [];
  const serie = [];
  for (let i = 0; i < 7; i += 1) {
    const day = startOfDay(addDays(today, -6 + i));
    labels.push(formatShortLabel(day));
    const programadas = items.filter((item) => {
      const due = getDueDate(item);
      if (!due || !isSameDay(due, day)) {
        return false;
      }
      return normalizeStatus(item.status) !== "cancelada";
    });
    if (!programadas.length) {
      serie.push(null);
      continue;
    }
    const concluidasNoPrazoDia = programadas.filter((item) => {
      if (normalizeStatus(item.status) !== "concluida") {
        return false;
      }
      let completedAt = getCompletedAt(item);
      if (!completedAt) {
        completedAt = day;
        missingCompletionDates += 1;
      }
      const due = getDueDate(item);
      return !due || completedAt <= due;
    });
    const eficiencia = Math.round((concluidasNoPrazoDia.length / programadas.length) * 100);
    serie.push(eficiencia);
  }

  if (IS_DEV && missingCompletionDates > 0) {
    console.warn(
      `[dashboard] ${missingCompletionDates} conclusoes sem data. Assumindo hoje para calculos.`
    );
  }

  return {
    kpis: {
      venceHoje,
      atrasadas,
      criticas,
      riscoImediato,
    },
    alertasOperacionais,
    saudeOperacional: {
      pontualidadePct,
      backlogTotal,
      concluidasPeriodo,
      atrasoMedioDias,
    },
    proximasAtividades,
    graficoEficiencia: {
      labels,
      serie,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      project: projectId,
    },
  };
}

function getDefaultProjectId() {
  const defaultProject = ensureDefaultProject();
  return defaultProject ? defaultProject.id : null;
}

function getDashboardSummaryForProject(projectId) {
  const key = String(projectId || "").trim();
  const fallbackId = getDefaultProjectId();
  const resolved = key || fallbackId || "";
  const now = Date.now();
  const cached = DASHBOARD_CACHE.get(resolved);
  if (cached && cached.expiresAt > now) {
    return cached.payload;
  }
  const dataset = loadMaintenanceData();
  const filtered = dataset.filter((item) => {
    const itemProject = item && item.projectId ? item.projectId : fallbackId;
    return itemProject && itemProject === resolved;
  });
  if (IS_DEV && filtered.length === 0) {
    console.warn("[dashboard] Dataset vazio para project", resolved);
  }
  const payload = buildDashboardSummary(filtered, resolved);
  DASHBOARD_CACHE.set(resolved, { expiresAt: now + DASHBOARD_CACHE_TTL_MS, payload });
  return payload;
}

let projects = [];
let projectUsers = [];
let equipamentos = [];
let pmpActivities = [];
let pmpExecutions = [];
let users = [];
let invites = [];
let auditLog = [];
let verifications = [];
let apiLogs = [];
let healthTasks = [];
let automations = [];
let granularPermissions = null;
let filesMeta = [];

async function bootstrap() {
  ensureDataDir();
  logStoragePaths();
  migrateLegacyDataDir();
  ensureUploadDirs();
  migrateLegacyUploads();
  migrateLegacyAvatars();
  await initDatabase();
  await syncStoreFiles();
  registerShutdownHandlers();

  const usersFileExists = fs.existsSync(USERS_FILE);
  users = readJson(USERS_FILE, []);
  if (!usersFileExists) {
    const legacyCandidates = [LEGACY_USERS_STORAGE_FILE, LEGACY_USERS_FILE];
    for (const legacyPath of legacyCandidates) {
      if (!fs.existsSync(legacyPath)) {
        continue;
      }
      const legacyUsers = readJson(legacyPath, []);
      if (legacyUsers.length) {
        users = legacyUsers;
        writeJson(USERS_FILE, users);
        break;
      }
    }
  }
  invites = readJson(INVITES_FILE, []);
  auditLog = readJson(AUDIT_FILE, []);
  verifications = readJson(VERIFICATIONS_FILE, []);
  apiLogs = readJson(API_LOG_FILE, []);
  healthTasks = normalizeHealthTasks(readJson(HEALTH_TASKS_FILE, []));
  saveHealthTasks(healthTasks);
  automations = normalizeAutomations(readJson(AUTOMATIONS_FILE, []));
  saveAutomations(automations);
  granularPermissions = normalizeGranularPermissions(readJson(PERMISSOES_FILE, null));
  if (!fs.existsSync(PERMISSOES_FILE)) {
    writeJson(PERMISSOES_FILE, granularPermissions);
  }
  filesMeta = readJson(FILES_META_FILE, []);
  if (!Array.isArray(filesMeta)) {
    filesMeta = [];
  }
  await backfillUploadsToDb();
  cleanupVerifications();
  users = users.map(normalizeUserRecord);
  writeJson(USERS_FILE, users);
  ensureMasterAccount();
  seedAdmin();
  projects = loadProjects();
  projectUsers = loadProjectUsers();
  equipamentos = loadEquipamentos();
  pmpActivities = loadPmpActivities().map(normalizePmpActivity);
  if (!fs.existsSync(PMP_ACTIVITIES_FILE)) {
    savePmpActivities(pmpActivities);
  }
  pmpExecutions = loadPmpExecutions().map(normalizePmpExecution);
  if (!fs.existsSync(PMP_EXECUTIONS_FILE)) {
    savePmpExecutions(pmpExecutions);
  }
  ensureProjectSeedData();
}

app.use(express.json({ limit: "20mb" }));
app.use(
  session({
    name: "opscope.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  if (!req.originalUrl.startsWith("/api/")) {
    return next();
  }
  const startedAt = Date.now();
  res.on("finish", () => {
    const user = getSessionUser(req);
    const entry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      method: req.method,
      endpoint: req.originalUrl.split("?")[0],
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
      userId: user ? user.id : null,
      userName: user ? user.name : null,
      ip: getClientIp(req),
      params: sanitizeLogValue(req.params || {}),
      query: sanitizeLogValue(req.query || {}),
      body: sanitizeLogValue(req.body || {}),
    };
    appendApiLog(entry);
  });
  return next();
});

app.use("/uploads", express.static(UPLOADS_DIR));
app.use(express.static(__dirname));

app.get("/uploads/files/:dir/:file", async (req, res) => {
  const dir = String(req.params.dir || "").trim();
  const fileName = path.basename(String(req.params.file || "").trim());
  if (!dir || !fileName) {
    return res.status(404).send("Arquivo nao encontrado.");
  }
  const typeConfig = Object.values(FILE_TYPE_CONFIG).find((config) => config.dir === dir);
  if (!typeConfig) {
    return res.status(404).send("Arquivo nao encontrado.");
  }
  const filePath = path.join(FILES_DIR, typeConfig.dir, fileName);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  const legacyPath = path.join(LEGACY_UPLOADS_DIR, "files", typeConfig.dir, fileName);
  if (fs.existsSync(legacyPath)) {
    try {
      ensureUploadDirs();
      fs.copyFileSync(legacyPath, filePath);
    } catch (error) {
      // noop
    }
    return res.sendFile(legacyPath);
  }
  const entry = Array.isArray(filesMeta)
    ? filesMeta.find(
        (item) => item && item.type === typeConfig.key && item.name === fileName
      )
    : null;
  const blob = entry
    ? await fetchUploadBlobById(entry.id)
    : await fetchUploadBlobByName(typeConfig.key, fileName);
  if (!blob || !blob.buffer) {
    return res.status(404).send("Arquivo nao encontrado.");
  }
  const mime = blob.mime || (entry && entry.mime) || "application/octet-stream";
  res.setHeader("Content-Type", mime);
  res.setHeader("Content-Length", blob.buffer.length);
  res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
  res.end(blob.buffer);
  try {
    ensureUploadDirs();
    fs.writeFileSync(filePath, blob.buffer);
  } catch (error) {
    // noop
  }
});

app.post("/api/auth/login", async (req, res) => {
  const ip = getClientIp(req);
  if (isIpBlocked(ip)) {
    return res.status(429).json({ message: "Credenciais inválidas." });
  }
  const login = String(req.body.login || "").trim().toLowerCase();
  const senha = String(req.body.senha || "").trim();
  if (!login || !senha) {
    recordIpFailure(ip);
    return res.status(401).json({ message: "Credenciais inválidas." });
  }
  if (isUserLocked(login)) {
    recordIpFailure(ip);
    return res.status(429).json({ message: "Credenciais inválidas." });
  }
  const user = users.find((u) => {
    const username = String(u.username || "").toLowerCase();
    const matricula = String(u.matricula || "").toLowerCase();
    return login === username || login === matricula;
  });
  if (!user) {
    recordIpFailure(ip);
    recordUserFailure(login);
    appendAudit("login_fail", null, { login }, ip);
    return res.status(401).json({ message: "Credenciais inválidas." });
  }
  if (user.active === false) {
    appendAudit("login_inactive", user.id, { login }, ip);
    return res.status(403).json({ message: "Conta inativa." });
  }
  const ok = await bcrypt.compare(senha, user.passwordHash);
  if (!ok) {
    recordIpFailure(ip);
    recordUserFailure(login);
    appendAudit("login_fail", user.id, { login }, ip);
    return res.status(401).json({ message: "Credenciais inválidas." });
  }
  if (user.emailVerified === false) {
    appendAudit("login_unverified", user.id, { login }, ip);
    return res.status(403).json({ message: "E-mail não verificado. Verifique seu e-mail." });
  }
  clearFailures(ip, login);
  req.session.userId = user.id;
  const activeProjectId = getActiveProjectId({ session: req.session }, user);
  if (activeProjectId) {
    req.session.activeProjectId = activeProjectId;
  }
  appendAudit("login_success", user.id, {}, ip);
  return res.json({ user: sanitizeUser(user) });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  const userId = req.session.userId;
  req.session.destroy(() => {
    appendAudit("logout", userId, {}, getClientIp(req));
    res.json({ ok: true });
  });
});

app.get("/api/auth/me", (req, res) => {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: "Nao autenticado." });
  }
  let ids = getUserProjectIds(user);
  if (!ids.length) {
    const defaultProject = ensureDefaultProject();
    if (defaultProject) {
      ensureUserProjectLink(user, defaultProject.id);
      ids = getUserProjectIds(user);
    }
  }
  const available = projects
    .filter((project) => project && ids.includes(project.id))
    .map((project) => {
      const entry = projectUsers.find(
        (item) => item && item.projectId === project.id && item.userId === user.id
      );
      return { ...project, papel: entry ? entry.papel : "" };
    });
  const activeProjectId = getActiveProjectId(req, user);
  if (activeProjectId) {
    req.session.activeProjectId = activeProjectId;
  }
  return res.json({
    user: sanitizeUser(user),
    projects: available,
    activeProjectId: activeProjectId || "",
  });
});

app.get("/api/projetos/active", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const activeProjectId = getActiveProjectId(req, user);
  if (activeProjectId) {
    req.session.activeProjectId = activeProjectId;
  }
  return res.json({ activeProjectId: activeProjectId || "" });
});

app.post("/api/projetos/active", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.body.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto inválido." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  req.session.activeProjectId = projectId;
  return res.json({ ok: true, activeProjectId: projectId });
});

app.get("/api/projetos", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  let ids = getUserProjectIds(user);
  if (!ids.length) {
    const defaultProject = ensureDefaultProject();
    if (defaultProject) {
      ensureUserProjectLink(user, defaultProject.id);
      ids = getUserProjectIds(user);
    }
  }
  const list = projects
    .filter((project) => project && ids.includes(project.id))
    .map((project) => {
      const entry = projectUsers.find(
        (item) => item && item.projectId === project.id && item.userId === user.id
      );
      return { ...project, papel: entry ? entry.papel : "" };
    });
  return res.json({ projects: list });
});

app.post("/api/projetos", requireAuth, requirePermission("gerenciarProjetos"), (req, res) => {
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const codigo = String(payload.codigo || "").trim();
  const nome = String(payload.nome || "").trim();
  const locais = normalizeLocaisList(payload.locais || []);
  const pmpHorasDisponiveis = Number(payload.pmpHorasDisponiveis);
  if (!codigo || !nome) {
    return res.status(400).json({ message: "Código e nome são obrigatórios." });
  }
  if (projects.some((project) => String(project.codigo || "").trim() === codigo)) {
    return res.status(409).json({ message: "Codigo de projeto ja existe." });
  }
  const record = normalizeProject({
    codigo,
    nome,
    cliente: payload.cliente || "",
    descricao: payload.descricao || "",
    locais,
    pmpHorasDisponiveis: Number.isFinite(pmpHorasDisponiveis) ? pmpHorasDisponiveis : undefined,
  });
  projects = projects.concat(record);
  saveProjects(projects);
  const actor = req.currentUser || getSessionUser(req);
  if (actor) {
    const exists = projectUsers.some(
      (entry) => entry && entry.userId === actor.id && entry.projectId === record.id
    );
    if (!exists) {
      const entry = normalizeProjectUser({
        projectId: record.id,
        userId: actor.id,
        papel: mapUserRoleToProjectRole(actor),
      });
      projectUsers = projectUsers.concat(entry);
      saveProjectUsers(projectUsers);
    }
  }
  return res.json({ project: record });
});

app.put("/api/projetos/:id", requireAuth, requirePermission("gerenciarProjetos"), (req, res) => {
  const projectId = String(req.params.id || "").trim();
  const index = projects.findIndex((project) => project && project.id === projectId);
  if (index === -1) {
    return res.status(404).json({ message: "Projeto não encontrado." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const current = projects[index];
  const codigo = "codigo" in payload ? String(payload.codigo || "").trim() : current.codigo;
  const nome = "nome" in payload ? String(payload.nome || "").trim() : current.nome;
  const locais =
    "locais" in payload ? normalizeLocaisList(payload.locais || []) : current.locais || [];
  const pmpHorasDisponiveis =
    "pmpHorasDisponiveis" in payload
      ? Number(payload.pmpHorasDisponiveis)
      : Number(current.pmpHorasDisponiveis);
  if (!codigo || !nome) {
    return res.status(400).json({ message: "Código e nome são obrigatórios." });
  }
  if (
    codigo !== current.codigo &&
    projects.some((project) => String(project.codigo || "").trim() === codigo)
  ) {
    return res.status(409).json({ message: "Codigo de projeto ja existe." });
  }
  const updated = normalizeProject({
    ...current,
    ...payload,
    codigo,
    nome,
    locais,
    pmpHorasDisponiveis: Number.isFinite(pmpHorasDisponiveis) ? pmpHorasDisponiveis : undefined,
    updatedAt: new Date().toISOString(),
  });
  projects[index] = updated;
  saveProjects(projects);
  return res.json({ project: updated });
});

app.delete(
  "/api/projetos/:id",
  requireAuth,
  requirePermission("gerenciarProjetos"),
  (req, res) => {
    const projectId = String(req.params.id || "").trim();
    const defaultProject = ensureDefaultProject();
    if (defaultProject && defaultProject.id === projectId) {
      return res.status(400).json({ message: "Projeto inicial não pode ser removido." });
    }
    const index = projects.findIndex((project) => project && project.id === projectId);
    if (index === -1) {
      return res.status(404).json({ message: "Projeto não encontrado." });
    }
    projects.splice(index, 1);
    saveProjects(projects);
    projectUsers = projectUsers.filter((entry) => entry.projectId !== projectId);
    saveProjectUsers(projectUsers);
    equipamentos = equipamentos.filter((equip) => equip.projectId !== projectId);
    saveEquipamentos(equipamentos);
    pmpActivities = pmpActivities.filter((activity) => activity.projectId !== projectId);
    savePmpActivities(pmpActivities);
    pmpExecutions = pmpExecutions.filter((exec) => exec.projectId !== projectId);
    savePmpExecutions(pmpExecutions);
    return res.json({ ok: true });
  }
);

app.get("/api/projetos/:id/equipe", requireAuth, requireProjectAccess, (req, res) => {
  const projectId = req.projectId;
  const equipe = projectUsers
    .filter((entry) => entry.projectId === projectId)
    .map((entry) => {
      const user = users.find((item) => item.id === entry.userId);
      return {
        ...entry,
        user: user ? sanitizeUser(user) : null,
      };
    });
  return res.json({ equipe });
});

app.post(
  "/api/projetos/:id/equipe",
  requireAuth,
  requirePermission("gerenciarEquipeProjeto"),
  requireProjectAccess,
  (req, res) => {
    const projectId = req.projectId;
    const ids = Array.isArray(req.body.userIds)
      ? req.body.userIds
      : req.body.userId
        ? [req.body.userId]
        : [];
    const userIds = ids.map((value) => String(value || "").trim()).filter(Boolean);
    if (!userIds.length) {
      return res.status(400).json({ message: "Usuários obrigatórios." });
    }
    const created = [];
    for (const userId of userIds) {
      const alvo = users.find((item) => item.id === userId);
      if (!alvo) {
        continue;
      }
      const exists = projectUsers.some(
        (entry) => entry.userId === userId && entry.projectId === projectId
      );
      if (exists) {
        continue;
      }
      const entry = normalizeProjectUser({
        projectId,
        userId,
        papel: mapUserRoleToProjectRole(alvo),
      });
      created.push(entry);
    }
    if (!created.length) {
      return res.status(409).json({ message: "Usuários já vinculados ou inválidos." });
    }
    projectUsers = projectUsers.concat(created);
    saveProjectUsers(projectUsers);
    return res.json({ entries: created });
  }
);

app.delete(
  "/api/projetos/:id/equipe/:userId",
  requireAuth,
  requirePermission("gerenciarEquipeProjeto"),
  requireProjectAccess,
  (req, res) => {
    const projectId = req.projectId;
    const userId = String(req.params.userId || "").trim();
    const before = projectUsers.length;
    projectUsers = projectUsers.filter(
      (entry) => !(entry.projectId === projectId && entry.userId === userId)
    );
    if (projectUsers.length === before) {
      return res.status(404).json({ message: "Vínculo não encontrado." });
    }
    saveProjectUsers(projectUsers);
    return res.json({ ok: true });
  }
);

app.get("/api/projetos/:id/equipamentos", requireAuth, requireProjectAccess, (req, res) => {
  const projectId = req.projectId;
  const list = equipamentos.filter((item) => item.projectId === projectId);
  return res.json({ equipamentos: list });
});

app.post(
  "/api/projetos/:id/equipamentos",
  requireAuth,
  requirePermission("gerenciarEquipamentos"),
  requireProjectAccess,
  (req, res) => {
    const projectId = req.projectId;
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const tag = String(payload.tag || "").trim();
    const nome = String(payload.nome || "").trim();
    if (!tag || !nome) {
      return res.status(400).json({ message: "Tag e nome são obrigatórios." });
    }
    const record = {
      id: crypto.randomUUID(),
      projectId,
      tag,
      nome,
      categoria: String(payload.categoria || "").trim(),
      descricao: String(payload.descricao || "").trim(),
      metadata: payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    equipamentos = equipamentos.concat(record);
    saveEquipamentos(equipamentos);
    return res.json({ equipamento: record });
  }
);

app.put(
  "/api/equipamentos/:id",
  requireAuth,
  requirePermission("gerenciarEquipamentos"),
  (req, res) => {
    const equipamentoId = String(req.params.id || "").trim();
    const index = equipamentos.findIndex((item) => item.id === equipamentoId);
    if (index === -1) {
      return res.status(404).json({ message: "Equipamento não encontrado." });
    }
    const equipamento = equipamentos[index];
    const user = req.currentUser || getSessionUser(req);
    if (!userHasProjectAccess(user, equipamento.projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const updated = {
      ...equipamento,
      tag: "tag" in payload ? String(payload.tag || "").trim() : equipamento.tag,
      nome: "nome" in payload ? String(payload.nome || "").trim() : equipamento.nome,
      categoria:
        "categoria" in payload ? String(payload.categoria || "").trim() : equipamento.categoria,
      descricao:
        "descricao" in payload ? String(payload.descricao || "").trim() : equipamento.descricao,
      metadata:
        "metadata" in payload && payload.metadata && typeof payload.metadata === "object"
          ? payload.metadata
          : equipamento.metadata,
      updatedAt: new Date().toISOString(),
    };
    equipamentos[index] = updated;
    saveEquipamentos(equipamentos);
    return res.json({ equipamento: updated });
  }
);

app.delete(
  "/api/equipamentos/:id",
  requireAuth,
  requirePermission("gerenciarEquipamentos"),
  (req, res) => {
    const equipamentoId = String(req.params.id || "").trim();
    const index = equipamentos.findIndex((item) => item.id === equipamentoId);
    if (index === -1) {
      return res.status(404).json({ message: "Equipamento não encontrado." });
    }
    const equipamento = equipamentos[index];
    const user = req.currentUser || getSessionUser(req);
    if (!userHasProjectAccess(user, equipamento.projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    equipamentos.splice(index, 1);
    saveEquipamentos(equipamentos);
    return res.json({ ok: true });
  }
);

app.get("/api/pmp/activities", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim();
  const year = Number(req.query.year || 0);
  const allowed = new Set(getUserProjectIds(user));
  if (projectId && !allowed.has(projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  let list = pmpActivities.filter((item) => item && allowed.has(item.projectId));
  if (projectId) {
    list = list.filter((item) => item.projectId === projectId);
  }
  if (Number.isFinite(year) && year > 0) {
    list = list.filter((item) => Number(item.ano) === year);
  }
  return res.json({ activities: list });
});

app.post("/api/pmp/activities", requireAuth, requirePermission("gerenciarPMP"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  if (!canManagePmpActivities(user)) {
    return res.status(403).json({ message: "Apenas PCM pode gerenciar PMP." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId = String(payload.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatório." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const nome = String(payload.nome || "").trim();
  if (!nome) {
    return res.status(400).json({ message: "Nome da atividade obrigatório." });
  }
  const equipamentoId = String(payload.equipamentoId || "").trim();
  if (equipamentoId) {
    const equipamento = equipamentos.find((item) => item.id === equipamentoId);
    if (!equipamento || equipamento.projectId !== projectId) {
      return res.status(400).json({ message: "Equipamento inválido para o projeto." });
    }
  }
  const record = normalizePmpActivity({
    ...payload,
    projectId,
    createdBy: user ? user.id : "",
    updatedBy: user ? user.id : "",
  });
  pmpActivities = pmpActivities.concat(record);
  savePmpActivities(pmpActivities);
  return res.json({ activity: record });
});

app.put("/api/pmp/activities/:id", requireAuth, requirePermission("gerenciarPMP"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  if (!canManagePmpActivities(user)) {
    return res.status(403).json({ message: "Apenas PCM pode gerenciar PMP." });
  }
  const activityId = String(req.params.id || "").trim();
  const index = pmpActivities.findIndex((item) => item && item.id === activityId);
  if (index === -1) {
    return res.status(404).json({ message: "Atividade não encontrada." });
  }
  const current = pmpActivities[index];
  if (!userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId =
    "projectId" in payload ? String(payload.projectId || "").trim() : current.projectId;
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatório." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const equipamentoId =
    "equipamentoId" in payload ? String(payload.equipamentoId || "").trim() : current.equipamentoId;
  if (equipamentoId) {
    const equipamento = equipamentos.find((item) => item.id === equipamentoId);
    if (!equipamento || equipamento.projectId !== projectId) {
      return res.status(400).json({ message: "Equipamento inválido para o projeto." });
    }
  }
  const updated = normalizePmpActivity({
    ...current,
    ...payload,
    projectId,
    equipamentoId,
    updatedAt: new Date().toISOString(),
    updatedBy: user ? user.id : "",
  });
  pmpActivities[index] = updated;
  savePmpActivities(pmpActivities);
  return res.json({ activity: updated });
});

app.delete(
  "/api/pmp/activities/:id",
  requireAuth,
  requirePermission("gerenciarPMP"),
  (req, res) => {
    const user = req.currentUser || getSessionUser(req);
    if (!canManagePmpActivities(user)) {
      return res.status(403).json({ message: "Apenas PCM pode gerenciar PMP." });
    }
    const activityId = String(req.params.id || "").trim();
    const index = pmpActivities.findIndex((item) => item && item.id === activityId);
    if (index === -1) {
      return res.status(404).json({ message: "Atividade não encontrada." });
    }
    const current = pmpActivities[index];
    if (!userHasProjectAccess(user, current.projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    pmpActivities.splice(index, 1);
    savePmpActivities(pmpActivities);
    pmpExecutions = pmpExecutions.filter((exec) => exec.activityId !== activityId);
    savePmpExecutions(pmpExecutions);
    return res.json({ ok: true });
  }
);

app.get("/api/pmp/executions", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim();
  const year = Number(req.query.year || 0);
  const allowed = new Set(getUserProjectIds(user));
  if (projectId && !allowed.has(projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  let list = pmpExecutions.filter((item) => item && allowed.has(item.projectId));
  if (projectId) {
    list = list.filter((item) => item.projectId === projectId);
  }
  if (Number.isFinite(year) && year > 0) {
    list = list.filter((item) => {
      if (!item.scheduledFor) {
        return false;
      }
      const data = new Date(item.scheduledFor);
      return Number.isFinite(data.getTime()) && data.getFullYear() === year;
    });
  }
  return res.json({ executions: list });
});

app.post("/api/pmp/executions", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const activityId = String(payload.activityId || "").trim();
  if (!activityId) {
    return res.status(400).json({ message: "Atividade obrigatoria." });
  }
  const activity = pmpActivities.find((item) => item.id === activityId);
  if (!activity) {
    return res.status(404).json({ message: "Atividade não encontrada." });
  }
  if (!userHasProjectAccess(user, activity.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const periodKey = String(payload.periodKey || "").trim();
  const scheduledFor = String(payload.scheduledFor || "").trim();
  const status = String(payload.status || "").trim().toLowerCase();
  if ((status === "cancelada" || status === "removida") && !canManagePmpActivities(user)) {
    return res.status(403).json({ message: "Apenas PCM pode cancelar ou remover execucoes PMP." });
  }
  const existingIndex = pmpExecutions.findIndex(
    (item) =>
      item.activityId === activityId &&
      periodKey &&
      item.periodKey === periodKey &&
      item.projectId === activity.projectId
  );
  const record = normalizePmpExecution({
    ...payload,
    activityId,
    projectId: activity.projectId,
    periodKey,
    scheduledFor,
    executorId: payload.executorId || (user ? user.id : ""),
    updatedAt: new Date().toISOString(),
  });
  if (existingIndex >= 0) {
    pmpExecutions[existingIndex] = { ...pmpExecutions[existingIndex], ...record };
  } else {
    pmpExecutions = pmpExecutions.concat(record);
  }
  savePmpExecutions(pmpExecutions);
  return res.json({ execution: record });
});

app.delete(
  "/api/pmp/executions/:id",
  requireAuth,
  (req, res) => {
    const user = req.currentUser || getSessionUser(req);
    if (!canManagePmpActivities(user)) {
      return res.status(403).json({ message: "Apenas PCM pode remover execucoes PMP." });
    }
    const execId = String(req.params.id || "").trim();
    const index = pmpExecutions.findIndex((item) => item && item.id === execId);
    if (index === -1) {
      return res.status(404).json({ message: "Execução não encontrada." });
    }
    const exec = pmpExecutions[index];
    if (!userHasProjectAccess(user, exec.projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    pmpExecutions.splice(index, 1);
    savePmpExecutions(pmpExecutions);
    return res.json({ ok: true });
  }
);

app.post("/api/pmp/duplicate", requireAuth, requirePermission("gerenciarPMP"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  if (!canManagePmpActivities(user)) {
    return res.status(403).json({ message: "Apenas PCM pode gerenciar PMP." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId = String(payload.projectId || "").trim();
  const sourceYear = Number(payload.sourceYear || 0);
  const targetYear = Number(payload.targetYear || 0);
  if (!projectId || !sourceYear || !targetYear) {
    return res.status(400).json({ message: "Projeto e anos são obrigatórios." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const existentes = pmpActivities.filter(
    (item) => item.projectId === projectId && Number(item.ano) === targetYear
  );
  const existenteKey = new Set(
    existentes.map((item) => `${item.codigo}|${item.equipamentoId}|${item.nome}`.toLowerCase())
  );
  const base = pmpActivities.filter(
    (item) => item.projectId === projectId && Number(item.ano) === sourceYear
  );
  const created = [];
  base.forEach((item) => {
    const key = `${item.codigo}|${item.equipamentoId}|${item.nome}`.toLowerCase();
    if (existenteKey.has(key)) {
      return;
    }
    const copy = normalizePmpActivity({
      ...item,
      id: crypto.randomUUID(),
      ano: targetYear,
      createdAt: new Date().toISOString(),
      createdBy: user ? user.id : "",
      updatedAt: new Date().toISOString(),
      updatedBy: user ? user.id : "",
    });
    created.push(copy);
  });
  if (!created.length) {
    return res.json({ ok: true, created: [] });
  }
  pmpActivities = pmpActivities.concat(created);
  savePmpActivities(pmpActivities);
  return res.json({ ok: true, created });
});

app.patch("/api/profile", requireAuth, (req, res) => {
  const actor = req.currentUser || getSessionUser(req);
  if (!actor) {
    return res.status(401).json({ message: "Nao autorizado." });
  }
  const targetId = String(req.body.userId || "").trim();
  const targetUser =
    targetId && targetId !== actor.id
      ? users.find((item) => item.id === targetId)
      : actor;
  if (!targetUser) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  if (!canEditProfile(actor, targetUser)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const index = users.findIndex((item) => item.id === targetUser.id);
  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  const updates = {};
  if ("uen" in req.body) {
    updates.uen = String(req.body.uen || "").trim();
  }
  if ("projectId" in req.body) {
    const projectId = String(req.body.projectId || "").trim();
    if (projectId) {
      const project = getProjectById(projectId);
      if (!project) {
        return res.status(400).json({ message: "Projeto inválido." });
      }
      const label = getProjectLabel(project);
      updates.projectId = projectId;
      updates.projeto = label;
      updates.localizacao = label;
    } else {
      updates.projectId = "";
      updates.projeto = "";
      updates.localizacao = "";
    }
  }
  if ("projeto" in req.body) {
    updates.projeto = String(req.body.projeto || "").trim();
  } else if ("project" in req.body) {
    updates.projeto = String(req.body.project || "").trim();
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: "Nenhuma alteracao valida." });
  }

  const updated = normalizeUserRecord({ ...users[index], ...updates });
  users[index] = updated;
  writeJson(USERS_FILE, users);
  if ("projectId" in req.body) {
    setUserProjectAssignment(updated, updated.projectId || "");
  }
  appendAudit(
    "profile_update",
    actor.id,
    { alvo: updated.id, campos: Object.keys(updates) },
    getClientIp(req)
  );
  return res.json({ user: sanitizeUser(updated) });
});

app.post("/api/profile/avatar", requireAuth, async (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: "Nao autorizado." });
  }
  const dataUrl = String(req.body.dataUrl || "").trim();
  if (!dataUrl) {
    return res.status(400).json({ message: "Imagem não enviada." });
  }
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return res.status(400).json({ message: "Formato de imagem inválido." });
  }
  const mime = String(match[1] || "").toLowerCase();
  if (!ALLOWED_AVATAR_TYPES.has(mime)) {
    return res.status(415).json({ message: "Formato de imagem não suportado." });
  }
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length) {
    return res.status(400).json({ message: "Imagem inválida." });
  }
  if (buffer.length > AVATAR_MAX_BYTES) {
    return res.status(413).json({ message: "Imagem acima de 10 MB." });
  }
  if (!sharp) {
    return res.status(500).json({ message: "Processamento de imagem indisponivel." });
  }
  ensureUploadDirs();
  let optimized;
  try {
    optimized = await optimizeAvatar(buffer);
  } catch (error) {
    return res.status(500).json({ message: "Falha ao processar imagem." });
  }
  if (!optimized || optimized.oversized) {
    return res.status(413).json({ message: "Imagem muito grande para otimizar." });
  }
  const filename = `${user.id}-${Date.now()}.${optimized.ext}`;
  const filePath = path.join(AVATARS_DIR, filename);
  fs.writeFileSync(filePath, optimized.buffer);
  const avatarUrl = `/uploads/avatars/${filename}`;
  const avatarUpdatedAt = new Date().toISOString();
  const index = users.findIndex((item) => item.id === user.id);
  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  const updated = normalizeUserRecord({
    ...users[index],
    avatarUrl,
    avatarUpdatedAt,
  });
  users[index] = updated;
  writeJson(USERS_FILE, users);
  appendAudit("avatar_update", updated.id, { avatarUrl }, getClientIp(req));
  return res.json({ ok: true, avatarUrl, avatarUpdatedAt, user: sanitizeUser(updated) });
});

app.delete("/api/profile/avatar", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: "Nao autorizado." });
  }
  const index = users.findIndex((item) => item.id === user.id);
  if (index === -1) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  const current = users[index];
  const existingUrl = String(current.avatarUrl || "");
  if (existingUrl.startsWith("/uploads/avatars/")) {
    const filename = path.basename(existingUrl);
    const filePath = path.join(AVATARS_DIR, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        // noop
      }
    }
  }
  const updated = normalizeUserRecord({
    ...current,
    avatarUrl: "",
    avatarUpdatedAt: "",
  });
  users[index] = updated;
  writeJson(USERS_FILE, users);
  appendAudit("avatar_remove", updated.id, {}, getClientIp(req));
  return res.json({ ok: true, user: sanitizeUser(updated) });
});

app.get("/api/auth/users", requireAuth, (req, res) => {
  const actor = req.currentUser || getSessionUser(req);
  const activeProjectId = getActiveProjectId(req, actor);
  const filtered = activeProjectId
    ? users.filter((user) => userHasProjectAccess(user, activeProjectId))
    : [actor].filter(Boolean);
  return res.json({ users: filtered.map((user) => sanitizeUser(user)) });
});

app.get("/api/admin/users", requireAuth, requirePermission("verUsuarios"), (req, res) => {
  const actor = req.currentUser || getSessionUser(req);
  if (actor && isFullAccessRole(actor.rbacRole || actor.role)) {
    return res.json({ users: users.map((user) => sanitizeUser(user)) });
  }
  const allowedProjects = new Set(getUserProjectIds(actor));
  const filtered = users.filter((user) => {
    if (!user || !user.id) {
      return false;
    }
    const ids = getProjectIdsForUserId(user.id);
    return ids.some((id) => allowedProjects.has(id));
  });
  return res.json({ users: filtered.map((user) => sanitizeUser(user)) });
});

app.get("/api/admin/permissions", requireAuth, requirePermission("verUsuarios"), (req, res) => {
  return res.json({ permissions: PERMISSION_CATALOG });
});

app.get("/api/admin/permissoes", requireAuth, requirePermission("verPainelGerencial"), (req, res) => {
  return res.json({
    profiles: GRANULAR_PROFILE_CATALOG,
    permissions: GRANULAR_PERMISSION_CATALOG,
    values: granularPermissions,
  });
});

app.put("/api/admin/permissoes", requireAuth, requireAdmin, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const payload = req.body && (req.body.values || req.body.permissoes || req.body.permissions || req.body);
  const normalized = normalizeGranularPermissions(payload);
  const changes = diffGranularPermissions(granularPermissions, normalized);
  granularPermissions = normalized;
  writeJson(PERMISSOES_FILE, granularPermissions);
  appendAudit(
    "permissoes_update",
    req.session.userId,
    { alteracoes: changes },
    getClientIp(req)
  );
  return res.json({
    ok: true,
    profiles: GRANULAR_PROFILE_CATALOG,
    permissions: GRANULAR_PERMISSION_CATALOG,
    values: granularPermissions,
  });
});

app.get("/api/admin/health", requireAuth, requirePermission("verDiagnostico"), (req, res) => {
  const snapshot = buildHealthSnapshot(healthTasks);
  return res.json(snapshot);
});

app.post(
  "/api/admin/health/tasks/:id/run",
  requireAuth,
  requirePermission("reexecutarTarefas"),
  (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const taskId = String(req.params.id || "").trim();
  const updated = runHealthTask(taskId, user);
  if (!updated) {
    return res.status(404).json({ message: "Tarefa não encontrada." });
  }
  appendAudit(
    "health_task_run",
    user ? user.id : null,
    { taskId, status: updated.lastStatus },
    getClientIp(req)
  );
  return res.json({ ok: true, task: updated, snapshot: buildHealthSnapshot(healthTasks) });
  }
);

app.get("/api/admin/logs", requireAuth, requirePermission("verLogsAPI"), (req, res) => {
  const limitRaw = Number(req.query.limit || 20);
  const offsetRaw = Number(req.query.offset || 0);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 5), 100) : 20;
  const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;
  const endpoint = String(req.query.endpoint || "").trim().toLowerCase();
  const userId = String(req.query.userId || "").trim();
  const statusFilter = String(req.query.status || "").trim().toLowerCase();
  const from = parseDateTime(req.query.from);
  const to = parseDateTime(req.query.to);

  const total = apiLogs.length;
  let filtered = apiLogs.slice().sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  if (endpoint) {
    filtered = filtered.filter((entry) =>
      String(entry.endpoint || "").toLowerCase().includes(endpoint)
    );
  }
  if (userId) {
    filtered = filtered.filter((entry) => String(entry.userId || "").includes(userId));
  }
  if (statusFilter) {
    if (statusFilter === "error") {
      filtered = filtered.filter((entry) => Number(entry.status) >= 400);
    } else if (statusFilter === "4xx") {
      filtered = filtered.filter((entry) => Number(entry.status) >= 400 && Number(entry.status) < 500);
    } else if (statusFilter === "5xx") {
      filtered = filtered.filter((entry) => Number(entry.status) >= 500);
    } else if (/^\d+$/.test(statusFilter)) {
      filtered = filtered.filter((entry) => Number(entry.status) === Number(statusFilter));
    }
  }
  if (from) {
    filtered = filtered.filter((entry) => new Date(entry.timestamp).getTime() >= from.getTime());
  }
  if (to) {
    filtered = filtered.filter((entry) => new Date(entry.timestamp).getTime() <= to.getTime());
  }
  const filteredTotal = filtered.length;
  const logs = filtered.slice(offset, offset + limit);
  return res.json({ total, filteredTotal, logs, offset, limit });
});

app.get("/api/admin/automations", requireAuth, requirePermission("verAutomacoes"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  const list = automations.filter((item) => item && item.projectId === projectId);
  return res.json({ automations: list });
});

app.patch(
  "/api/admin/automations/:id",
  requireAuth,
  requirePermission("gerenciarAutomacoes"),
  (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  const automationId = String(req.params.id || "").trim();
  const index = automations.findIndex((item) => item.id === automationId);
  if (index === -1) {
    return res.status(404).json({ message: "Automação não encontrada." });
  }
  const current = automations[index];
  if (current.projectId && current.projectId !== projectId) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const updated = {
    ...current,
    enabled:
      typeof payload.enabled === "boolean" ? payload.enabled : current.enabled,
    action: {
      ...current.action,
      ...(payload.action && typeof payload.action === "object" ? payload.action : {}),
    },
  };
  automations[index] = updated;
  saveAutomations(automations);
  appendAudit(
    "automation_update",
    req.currentUser ? req.currentUser.id : null,
    { automationId, enabled: updated.enabled, projectId },
    getClientIp(req),
    projectId
  );
  return res.json({ ok: true, automations });
  }
);

app.get("/api/admin/files", requireAuth, requirePermission("verArquivos"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  const type = String(req.query.type || "").trim().toLowerCase();
  const search = String(req.query.search || "").trim().toLowerCase();
  let list = Array.isArray(filesMeta) ? filesMeta.slice() : [];
  list = list.filter((item) => item && item.projectId === projectId);
  if (type && FILE_TYPE_CONFIG[type]) {
    list = list.filter((item) => item.type === type);
  }
  if (search) {
    list = list.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const original = String(item.originalName || "").toLowerCase();
      return name.includes(search) || original.includes(search);
    });
  }
  list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return res.json({ files: list });
});

app.post(
  "/api/admin/files",
  requireAuth,
  requirePermission("uploadArquivos"),
  express.raw({ type: "multipart/form-data", limit: FILE_MAX_BYTES + 1024 * 1024 }),
  async (req, res) => {
    const user = req.currentUser || getSessionUser(req);
    const projectId = getActiveProjectId(req, user);
    if (!projectId) {
      return res.status(400).json({ message: "Projeto ativo obrigatório." });
    }
    const parsed = parseMultipartForm(req);
    if (!parsed || !parsed.file) {
      return res.status(400).json({ message: "Arquivo não enviado." });
    }
    const typeConfig = getFileTypeConfig(parsed.fields.type);
    if (!typeConfig) {
      return res.status(400).json({ message: "Tipo de arquivo inválido." });
    }
    const mime = String(parsed.file.mime || "").toLowerCase();
    if (!FILE_ALLOWED_MIME.has(mime)) {
      return res.status(415).json({ message: "Tipo de arquivo não suportado." });
    }
    if (!parsed.file.buffer || parsed.file.buffer.length === 0) {
      return res.status(400).json({ message: "Arquivo inválido." });
    }
    if (parsed.file.buffer.length > FILE_MAX_BYTES) {
      return res.status(413).json({ message: "Arquivo acima de 10 MB." });
    }
    ensureUploadDirs();
    const ext = FILE_ALLOWED_MIME.get(mime);
    const baseName = sanitizeFileName(path.parse(parsed.file.originalName || "arquivo").name);
    const unique = crypto.randomUUID().slice(0, 8);
    const fileName = `${Date.now()}-${unique}-${baseName || "arquivo"}.${ext}`;
    const dirPath = path.join(FILES_DIR, typeConfig.dir);
    const filePath = path.join(dirPath, fileName);
    try {
      fs.writeFileSync(filePath, parsed.file.buffer);
    } catch (error) {
      return res.status(500).json({ message: "Falha ao salvar arquivo." });
    }
    const actor = req.currentUser || getSessionUser(req);
    const entry = {
      id: crypto.randomUUID(),
      name: fileName,
      originalName: parsed.file.originalName || fileName,
      type: typeConfig.key,
      size: parsed.file.buffer.length,
      mime,
      url: `/uploads/files/${typeConfig.dir}/${fileName}`,
      createdAt: new Date().toISOString(),
      createdBy: actor ? actor.id : "",
      createdByName: actor ? actor.name : "",
      projectId,
    };
    filesMeta = Array.isArray(filesMeta) ? filesMeta.concat(entry) : [entry];
    writeJson(FILES_META_FILE, filesMeta);
    await upsertUploadBlob(entry, parsed.file.buffer);
    appendAudit(
      "file_upload",
      actor ? actor.id : null,
      { fileId: entry.id, name: entry.originalName, type: entry.type, projectId },
      getClientIp(req),
      projectId
    );
    return res.json({ ok: true, file: entry });
  }
);

app.delete("/api/admin/files/:id", requireAuth, requirePermission("excluirArquivos"), async (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const fileId = String(req.params.id || "").trim();
  const index = Array.isArray(filesMeta) ? filesMeta.findIndex((item) => item.id === fileId) : -1;
  if (index === -1) {
    return res.status(404).json({ message: "Arquivo não encontrado." });
  }
  const file = filesMeta[index];
  if (!userHasProjectAccess(user, file.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const typeConfig = getFileTypeConfig(file.type);
  if (typeConfig) {
    const filePath = path.join(FILES_DIR, typeConfig.dir, file.name);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        // noop
      }
    }
  }
  await deleteUploadBlob(file.id);
  filesMeta.splice(index, 1);
  writeJson(FILES_META_FILE, filesMeta);
  appendAudit(
    "file_delete",
    req.currentUser ? req.currentUser.id : null,
    { fileId, name: file.originalName, projectId: file.projectId || "" },
    getClientIp(req),
    file.projectId || null
  );
  return res.json({ ok: true });
});

app.post("/api/maintenance/sync", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  const incoming = Array.isArray(req.body.items) ? req.body.items : [];
  const sanitized = incoming
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      ...item,
      projectId,
    }));
  const existing = loadMaintenanceData();
  const existingProject = existing.filter((item) => {
    return item && item.projectId === projectId;
  });
  const existingIds = new Set(existingProject.map((item) => item.id).filter(Boolean));
  const createdItems = sanitized.filter(
    (item) => item && item.id && !existingIds.has(item.id)
  );
  const filtered = existing.filter((item) => {
    return !(item && item.projectId === projectId);
  });
  const merged = [...filtered, ...sanitized];
  writeJson(MAINTENANCE_FILE, merged);
  DASHBOARD_CACHE.delete(projectId);
  if (createdItems.length) {
    const ip = getClientIp(req);
    runAutomationsForItems("maintenance_created", createdItems, user, ip).catch((error) => {
      console.warn(
        "Automacoes falharam.",
        error && error.message ? error.message : error
      );
    });
  }
  return res.json({ ok: true, count: sanitized.length, project: projectId });
});

app.get("/api/maintenance", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const fromQuery = String(req.query.projectId || "").trim();
  const projectId = fromQuery || getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const list = loadMaintenanceData().filter((item) => item && item.projectId === projectId);
  return res.json({ items: list, projectId });
});

app.delete("/api/maintenance/:id", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const maintenanceId = String(req.params.id || "").trim();
  const fromQuery = String(req.query.projectId || "").trim();
  const projectId = fromQuery || getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  if (!maintenanceId) {
    return res.status(400).json({ message: "Manutenção inválida." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  if (!canDeleteMaintenance(user)) {
    return res.status(403).json({ message: "Apenas PCM pode remover manutencoes." });
  }
  const dataset = loadMaintenanceData();
  const index = dataset.findIndex(
    (item) => item && String(item.id || "") === maintenanceId && item.projectId === projectId
  );
  if (index === -1) {
    return res.status(404).json({ message: "Manutenção não encontrada." });
  }
  dataset.splice(index, 1);
  writeJson(MAINTENANCE_FILE, dataset);
  DASHBOARD_CACHE.delete(projectId);
  appendAudit(
    "maintenance_delete",
    user ? user.id : null,
    { manutencaoId: maintenanceId, projectId },
    getClientIp(req),
    projectId
  );
  return res.json({ ok: true, removedId: maintenanceId, projectId });
});

app.post("/api/maintenance/release", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  const maintenanceId = String(req.body.id || "").trim();
  const justificativa = String(req.body.justificativa || "").trim();
  const payloadDate =
    req.body.data ||
    req.body.dataProgramada ||
    req.body.prazo ||
    req.body.dueDate ||
    req.body.execucao;

  const dataset = loadMaintenanceData();
  const candidate = dataset.find((item) => {
    if (!item || String(item.id || "") !== maintenanceId) {
      return false;
    }
    return item && item.projectId === projectId;
  });

  const dueDate = getDueDate(candidate) || parseDateOnly(payloadDate);
  const today = startOfDay(new Date());

  if (dueDate && today < dueDate) {
    if (!canOverrideRelease(user)) {
      appendAudit(
        "maintenance_release_blocked",
        req.session.userId,
        {
          manutencaoId: maintenanceId || null,
          dataProgramada: formatDateISO(dueDate),
          projectId,
        },
        getClientIp(req),
        projectId
      );
      return res
        .status(403)
        .json({ message: "Liberação antes da data prevista não autorizada." });
    }
    if (!justificativa) {
      return res
        .status(400)
        .json({ message: "Justificativa obrigatória para liberação antecipada." });
    }
    appendAudit(
      "maintenance_release_override",
      req.session.userId,
      {
        manutencaoId: maintenanceId || null,
        dataProgramada: formatDateISO(dueDate),
        justificativa,
        role: normalizeRbacRole(user.rbacRole || user.role),
        projectId,
      },
      getClientIp(req),
      projectId
    );
    return res.json({
      ok: true,
      override: true,
      dataProgramada: formatDateISO(dueDate),
    });
  }

  return res.json({
    ok: true,
    override: false,
    dataProgramada: dueDate ? formatDateISO(dueDate) : null,
  });
});

app.patch("/api/admin/users/:id", requireAuth, requirePermission("verUsuarios"), (req, res) => {
  const userIndex = users.findIndex((item) => item.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  const current = users[userIndex];
  const actor = req.currentUser || getSessionUser(req);
  const currentRbacRole = current.rbacRole || current.role;
  const updates = {};
  let nextRbacRole = currentRbacRole;
  let roleChanged = false;
  const wantsActive = "active" in req.body;
  const wantsProfileUpdate =
    "name" in req.body ||
    "cargo" in req.body ||
    "jobTitle" in req.body ||
    "projectId" in req.body ||
    "projeto" in req.body ||
    "project" in req.body ||
    "uen" in req.body ||
    "localizacao" in req.body ||
    "location" in req.body ||
    "rbacRole" in req.body ||
    "role" in req.body ||
    "permissions" in req.body;

  if (wantsProfileUpdate && !canEditProfile(actor, current)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  if (wantsActive && !hasGranularPermission(actor, "desativarUsuarios")) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  if ("name" in req.body) {
    updates.name = String(req.body.name || "").trim();
  }
  if ("cargo" in req.body) {
    updates.cargo = String(req.body.cargo || "").trim();
  } else if ("jobTitle" in req.body) {
    updates.cargo = String(req.body.jobTitle || "").trim();
  }
  if ("projectId" in req.body) {
    const projectId = String(req.body.projectId || "").trim();
    if (projectId) {
      const project = getProjectById(projectId);
      if (!project) {
        return res.status(400).json({ message: "Projeto inválido." });
      }
      const label = getProjectLabel(project);
      updates.projectId = projectId;
      updates.projeto = label;
      updates.localizacao = label;
    } else {
      updates.projectId = "";
      updates.projeto = "";
      updates.localizacao = "";
    }
  }
  if ("projeto" in req.body) {
    updates.projeto = String(req.body.projeto || "").trim();
  } else if ("project" in req.body) {
    updates.projeto = String(req.body.project || "").trim();
  }
  if ("uen" in req.body) {
    updates.uen = String(req.body.uen || "").trim();
  }
  if ("localizacao" in req.body) {
    updates.localizacao = String(req.body.localizacao || "").trim();
  } else if ("location" in req.body) {
    updates.localizacao = String(req.body.location || "").trim();
  }
  if ("active" in req.body) {
    updates.active = Boolean(req.body.active);
  }
  if ("rbacRole" in req.body || "role" in req.body) {
    const incomingRole = "rbacRole" in req.body ? req.body.rbacRole : req.body.role;
    nextRbacRole = normalizeRbacRole(incomingRole);
    updates.rbacRole = nextRbacRole;
    updates.role = normalizeRole(req.body.role || current.role, nextRbacRole);
    roleChanged = true;
  }
  if ("permissions" in req.body || roleChanged) {
    updates.permissions = mergePermissions(nextRbacRole, current.permissions, req.body.permissions);
  }
  if (roleChanged) {
    updates.sections = buildSections(nextRbacRole, current.sections);
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: "Nenhuma alteracao valida." });
  }

  const updated = normalizeUserRecord({ ...current, ...updates });
  users[userIndex] = updated;
  writeJson(USERS_FILE, users);
  if ("projectId" in req.body) {
    setUserProjectAssignment(updated, updated.projectId || "");
  }
  appendAudit(
    "admin_user_update",
    req.session.userId,
    { alvo: updated.id, campos: Object.keys(updates) },
    getClientIp(req)
  );
  return res.json({ user: sanitizeUser(updated) });
});

app.post("/api/auth/invite", requireAuth, requirePermission("convidarUsuarios"), (req, res) => {
  cleanupInvites();
  const role = normalizeRbacRole(req.body.role || "tecnico_junior");
  const code = createInviteCode();
  const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const invite = {
    code,
    role,
    createdAt: new Date().toISOString(),
    createdBy: req.session.userId,
    expiresAt,
  };
  invites.push(invite);
  writeJson(INVITES_FILE, invites);
  appendAudit("invite_create", req.session.userId, { code, role, expiresAt }, getClientIp(req));
  return res.json({ code, role, expiresAt });
});

app.post("/api/auth/register", async (req, res) => {
  cleanupInvites();
  const emailRaw = String(req.body.email || req.body.matricula || "").trim();
  const email = emailRaw.toLowerCase();
  const matricula = emailRaw.toUpperCase();
  const nome = String(req.body.nome || "").trim();
  const senha = String(req.body.senha || "").trim();
  const senhaConfirm = String(req.body.senhaConfirm || "").trim();
  const convite = String(req.body.convite || "").trim().toUpperCase();

  const passwordCheck = validatePassword(senha);
  const errors = {};
  if (!email || !isValidEmail(email)) {
    errors.matricula = "Informe um e-mail corporativo válido.";
  }
  if (!nome) {
    errors.nome = "Informe o nome completo.";
  }
  if (!senha || !passwordCheck.ok) {
    errors.senha = "Senha fora da política.";
  }
  if (!senhaConfirm || senhaConfirm !== senha) {
    errors.senhaConfirm = "As senhas não conferem.";
  }
  if (!convite) {
    errors.convite = "Informe o codigo de convite.";
  }
  const invite = invites.find((item) => item.code === convite);
  const inviteValido = invite && new Date(invite.expiresAt).getTime() > Date.now();
  if (!inviteValido) {
    errors.convite = "Convite inválido ou expirado.";
  }
  const jaExiste = users.some(
    (user) =>
      String(user.matricula || "").toUpperCase() === matricula ||
      String(user.username || "").toLowerCase() === email ||
      String(user.email || "").toLowerCase() === email
  );
  if (jaExiste) {
    errors.matricula = "Dados inválidos.";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Dados inválidos.", errors, rules: passwordCheck.rules });
  }

  const role = normalizeRbacRole(invite.role || "tecnico_junior");
  const legacyRole = normalizeRole(role, role);
  const passwordHash = await bcrypt.hash(senha, 12);
  const user = {
    id: crypto.randomUUID(),
    username: email,
    matricula,
    email,
    emailVerified: false,
    name: nome,
    role: legacyRole,
    rbacRole: role,
    cargo: "",
    projeto: "",
    localizacao: "",
    active: true,
    passwordHash,
    permissions: buildPermissions(role),
    sections: buildSections(role),
    createdAt: new Date().toISOString(),
  };
  cleanupVerifications();
  const token = createVerificationToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + VERIFICATION_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const verification = {
    tokenHash,
    userId: user.id,
    email,
    createdAt: new Date().toISOString(),
    expiresAt,
  };
  let emailSent = false;
  let verificationRequired = true;
  try {
    emailSent = await sendVerificationEmail(email, nome, token);
  } catch (error) {
    emailSent = false;
  }
  if (!emailSent) {
    if (!IS_DEV) {
      return res.status(503).json({ message: "Envio de e-mail indisponível." });
    }
    user.emailVerified = true;
    verificationRequired = false;
    console.warn("SMTP não configurado. Verificação de e-mail ignorada em dev.");
  }
  if (emailSent) {
    verifications.push(verification);
  }
  users.push(user);
  const defaultProject = ensureDefaultProject();
  if (defaultProject) {
    const entry = normalizeProjectUser({
      projectId: defaultProject.id,
      userId: user.id,
      papel: mapUserRoleToProjectRole(user),
    });
    projectUsers = projectUsers.concat(entry);
    saveProjectUsers(projectUsers);
  }
  invites = invites.filter((item) => item.code !== convite);
  writeJson(USERS_FILE, users);
  writeJson(INVITES_FILE, invites);
  if (emailSent) {
    writeJson(VERIFICATIONS_FILE, verifications);
  }
  appendAudit("register", user.id, { matricula, role }, getClientIp(req));
  return res.json({ ok: true, verificationRequired });
});

app.get("/api/auth/verify", (req, res) => {
  cleanupVerifications();
  const token = String(req.query.token || "").trim();
  if (!token) {
    return res.status(400).json({ message: "Token inválido." });
  }
  const tokenHash = hashToken(token);
  const recordIndex = verifications.findIndex((item) => item.tokenHash === tokenHash);
  if (recordIndex === -1) {
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }
  const record = verifications[recordIndex];
  if (record.expiresAt && new Date(record.expiresAt).getTime() <= Date.now()) {
    verifications.splice(recordIndex, 1);
    writeJson(VERIFICATIONS_FILE, verifications);
    return res.status(410).json({ message: "Token expirado." });
  }
  const userIndex = users.findIndex((item) => item.id === record.userId);
  if (userIndex === -1) {
    verifications.splice(recordIndex, 1);
    writeJson(VERIFICATIONS_FILE, verifications);
    return res.status(404).json({ message: "Usuário não encontrado." });
  }
  const updated = normalizeUserRecord({
    ...users[userIndex],
    emailVerified: true,
  });
  users[userIndex] = updated;
  verifications.splice(recordIndex, 1);
  writeJson(USERS_FILE, users);
  writeJson(VERIFICATIONS_FILE, verifications);
  appendAudit("email_verify", updated.id, { email: updated.email }, getClientIp(req));
  return res.json({ ok: true, user: sanitizeUser(updated) });
});

app.get("/api/dashboard/summary", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  const payload = getDashboardSummaryForProject(projectId);
  return res.json(payload);
});

bootstrap()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`OPSCOPE auth server rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Falha ao iniciar OPSCOPE:", error);
    process.exit(1);
  });
