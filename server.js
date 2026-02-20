try {
  require("dotenv").config();
} catch (error) {
  // ignore if dotenv is not installed
}
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
let QRCode;
try {
  QRCode = require("qrcode");
} catch (error) {
  QRCode = null;
}
let PDFDocument;
let StandardFonts;
let rgb;
try {
  ({ PDFDocument, StandardFonts, rgb } = require("pdf-lib"));
} catch (error) {
  PDFDocument = null;
  StandardFonts = null;
  rgb = null;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
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
const VERIFICATION_CODE_LENGTH = Math.max(
  4,
  Math.min(8, Number(process.env.VERIFICATION_CODE_LENGTH) || 6)
);
const VERIFICATION_MAX_ATTEMPTS = Math.max(
  1,
  Number(process.env.VERIFICATION_MAX_ATTEMPTS) || 5
);
const VERIFICATION_RESEND_COOLDOWN_MS = Math.max(
  0,
  Number(process.env.VERIFICATION_RESEND_COOLDOWN_MS) || 60 * 1000
);
const PASSWORD_RESET_TTL_MINUTES = Math.max(
  5,
  Number(process.env.PASSWORD_RESET_TTL_MINUTES) || 30
);
const PASSWORD_RESET_MAX_ATTEMPTS = Math.max(
  1,
  Number(process.env.PASSWORD_RESET_MAX_ATTEMPTS) || 5
);
const PASSWORD_RESET_RESEND_COOLDOWN_MS = Math.max(
  0,
  Number(process.env.PASSWORD_RESET_RESEND_COOLDOWN_MS) || 60 * 1000
);
const BUILD_ID = (() => {
  if (process.env.BUILD_ID) {
    return String(process.env.BUILD_ID);
  }
  try {
    const stat = fs.statSync(path.join(__dirname, "index.html"));
    return `build-${stat.mtime.toISOString()}`;
  } catch (error) {
    return `build-${new Date().toISOString()}`;
  }
})();
const MAINT_SYNC_DEBUG = String(process.env.OPSCOPE_DEBUG_MAINT_SYNC || "").trim();
const COMPAT_SCHEMA_VERSION = 1;
const COMPAT_DATASETS = ["maintenance", "templates", "announcements", "feedbacks", "sstDocs"];
const SSE_PING_INTERVAL_MS = 25000;
const sseClients = new Map();

function sendSse(res, event, payload) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcastSse(event, payload = {}) {
  const data = {
    ...payload,
    event,
    buildId: BUILD_ID,
    emittedAt: new Date().toISOString(),
  };
  const projectId = String(payload.projectId || "").trim();
  for (const [clientId, client] of sseClients.entries()) {
    if (projectId && client.projectId && client.projectId !== projectId) {
      continue;
    }
    try {
      sendSse(client.res, event, data);
    } catch (error) {
      try {
        client.res.end();
      } catch (err) {
        // noop
      }
      sseClients.delete(clientId);
    }
  }
}

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
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPSCOPE_OPENAI_MODEL || "gpt-4o-mini-2024-07-18";
const OPENAI_TIMEOUT_MS = Number(process.env.OPSCOPE_OPENAI_TIMEOUT_MS) || 12000;
const RDO_AI_CACHE_TTL_MS = Number(process.env.OPSCOPE_RDO_AI_CACHE_TTL_MS) || 30 * 60 * 1000;
const STORAGE_READONLY_MESSAGE =
  "Armazenamento indisponivel. O sistema esta em modo somente leitura para evitar perda de dados.";
const DB_STORE_TABLE = "opscope_store";
const DB_UPLOADS_TABLE = "opscope_uploads";
let dbPool = null;
let dbReady = false;
let dbWriteQueue = Promise.resolve();
const DATA_FILE_NAMES = [
  "invites.json",
  "audit.json",
  "maintenance.json",
  "maintenance_templates.json",
  "maintenance_tombstones.json",
  "announcements.json",
  "feedbacks.json",
  "sst_docs.json",
  "compat_versions.json",
  "automations.json",
  "api_logs.json",
  "health_tasks.json",
  "files.json",
  "permissoes.json",
  "projects.json",
  "equipamentos.json",
  "project_users.json",
  "almox_items.json",
  "almox_stock.json",
  "almox_movements.json",
  "almox_kits.json",
  "sst_trainings.json",
  "sst_training_records.json",
  "sst_inspection_templates.json",
  "sst_inspections.json",
  "sst_nonconformities.json",
  "sst_incidents.json",
  "sst_aprs.json",
  "sst_permits.json",
  "sst_vehicles.json",
  "access_roles.json",
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
const MAINTENANCE_TEMPLATES_FILE = path.join(DATA_DIR, "maintenance_templates.json");
const MAINTENANCE_TOMBSTONES_FILE = path.join(DATA_DIR, "maintenance_tombstones.json");
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, "announcements.json");
const FEEDBACKS_FILE = path.join(DATA_DIR, "feedbacks.json");
const SST_DOCS_FILE = path.join(DATA_DIR, "sst_docs.json");
const COMPAT_FILE = path.join(DATA_DIR, "compat_versions.json");
const AUTOMATIONS_FILE = path.join(DATA_DIR, "automations.json");
const UPLOADS_DIR = process.env.OPSCOPE_UPLOADS_DIR
  ? path.resolve(process.env.OPSCOPE_UPLOADS_DIR)
  : path.join(STORAGE_DIR, "uploads");
const AVATARS_DIR = path.join(UPLOADS_DIR, "avatars");
const LEGACY_UPLOADS_DIR = path.join(__dirname, "uploads");
const LEGACY_AVATARS_DIR = path.join(LEGACY_UPLOADS_DIR, "avatars");
const VERIFICATIONS_FILE = path.join(STORAGE_DIR, "email_verifications.json");
const PASSWORD_RESETS_FILE = path.join(STORAGE_DIR, "password_resets.json");
const API_LOG_FILE = path.join(DATA_DIR, "api_logs.json");
const HEALTH_TASKS_FILE = path.join(DATA_DIR, "health_tasks.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const FILES_META_FILE = path.join(DATA_DIR, "files.json");
const PERMISSOES_FILE = path.join(DATA_DIR, "permissoes.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const EQUIPAMENTOS_FILE = path.join(DATA_DIR, "equipamentos.json");
const PROJECT_USERS_FILE = path.join(DATA_DIR, "project_users.json");
const ALMOX_ITEMS_FILE = path.join(DATA_DIR, "almox_items.json");
const ALMOX_STOCK_FILE = path.join(DATA_DIR, "almox_stock.json");
const ALMOX_MOVEMENTS_FILE = path.join(DATA_DIR, "almox_movements.json");
const ALMOX_KITS_FILE = path.join(DATA_DIR, "almox_kits.json");
const SST_TRAININGS_FILE = path.join(DATA_DIR, "sst_trainings.json");
const SST_TRAINING_RECORDS_FILE = path.join(DATA_DIR, "sst_training_records.json");
const SST_INSPECTION_TEMPLATES_FILE = path.join(DATA_DIR, "sst_inspection_templates.json");
const SST_INSPECTIONS_FILE = path.join(DATA_DIR, "sst_inspections.json");
const SST_NONCONFORMITIES_FILE = path.join(DATA_DIR, "sst_nonconformities.json");
const SST_INCIDENTS_FILE = path.join(DATA_DIR, "sst_incidents.json");
const SST_APRS_FILE = path.join(DATA_DIR, "sst_aprs.json");
const SST_PERMITS_FILE = path.join(DATA_DIR, "sst_permits.json");
const SST_VEHICLES_FILE = path.join(DATA_DIR, "sst_vehicles.json");
const ACCESS_ROLES_FILE = path.join(DATA_DIR, "access_roles.json");
const PMP_ACTIVITIES_FILE = path.join(DATA_DIR, "pmp_activities.json");
const PMP_EXECUTIONS_FILE = path.join(DATA_DIR, "pmp_executions.json");
const STORE_FILES = [
  USERS_FILE,
  VERIFICATIONS_FILE,
  PASSWORD_RESETS_FILE,
  INVITES_FILE,
  AUDIT_FILE,
  MAINTENANCE_FILE,
  MAINTENANCE_TEMPLATES_FILE,
  MAINTENANCE_TOMBSTONES_FILE,
  ANNOUNCEMENTS_FILE,
  FEEDBACKS_FILE,
  SST_DOCS_FILE,
  COMPAT_FILE,
  AUTOMATIONS_FILE,
  API_LOG_FILE,
  HEALTH_TASKS_FILE,
  FILES_META_FILE,
  PERMISSOES_FILE,
  PROJECTS_FILE,
  EQUIPAMENTOS_FILE,
  PROJECT_USERS_FILE,
  ALMOX_ITEMS_FILE,
  ALMOX_STOCK_FILE,
  ALMOX_MOVEMENTS_FILE,
  ALMOX_KITS_FILE,
  SST_TRAININGS_FILE,
  SST_TRAINING_RECORDS_FILE,
  SST_INSPECTION_TEMPLATES_FILE,
  SST_INSPECTIONS_FILE,
  SST_NONCONFORMITIES_FILE,
  SST_INCIDENTS_FILE,
  SST_APRS_FILE,
  SST_PERMITS_FILE,
  SST_VEHICLES_FILE,
  ACCESS_ROLES_FILE,
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
  liberacao: { label: "Documentos de liberação", dir: "liberacao" },
};
const LIBERACAO_DOC_TYPES = new Set(["apr", "os", "pte", "pt"]);
const FILE_ALLOWED_MIME = new Map([
  ["application/pdf", "pdf"],
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
]);
const DEFAULT_PROJECT_CODE = "834";
const DEFAULT_PROJECT_NAME = "PARACATU/SOLARIG (Boa Sorte II)";
const DEFAULT_PROJECT_LOCAIS = ["LZC-BOS2", "LZC-PCT4", "LZC-LT", "LZC-BSO2/LZC-PCT4"];
const DEFAULT_PROJECT_TEAM = "O&M BSO2";
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
const AUTOMATION_EMAIL_DEDUP_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const automationEmailDedup = new Map();
const MAINTENANCE_TEAM_EMAIL_PERMISSION = "receberEmailNovaManutencao";
const MAINTENANCE_TEAM_EMAIL_DEDUP_PREFIX = "maintenance_team_email";

const ALMOX_ITEM_TYPES = new Set(["FERRAMENTA", "EPI", "EPC", "CONSUMIVEL"]);
const ALMOX_ITEM_UNITS = new Set(["UN", "PAR", "CX"]);
const ALMOX_MOVEMENT_TYPES = new Set([
  "ENTRADA",
  "SAIDA",
  "TRANSFERENCIA",
  "AJUSTE",
  "DEVOLUCAO",
  "PERDA_BAIXA",
  "RESERVA",
  "LIBERACAO_RESERVA",
]);
const SST_SEVERITY_LEVELS = new Set(["BAIXA", "MEDIA", "ALTA", "CRITICA"]);

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
const FULL_ACCESS_ROLES = new Set([
  "admin",
  "gestor",
  "pcm",
  "diretor_om",
  "gerente_contrato",
]);
const RELEASE_OVERRIDE_ROLES = new Set([
  "admin",
  "gestor",
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
  { key: "verAnuncios", label: "Ver anúncios" },
  { key: "criarAnuncios", label: "Criar anúncios" },
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
  { key: "verAlmoxarifado", label: "Ver Almoxarifado" },
  { key: "gerenciarAlmoxarifado", label: "Gerenciar Almoxarifado" },
  { key: "verSST", label: "Ver SST" },
  { key: "gerenciarSST", label: "Gerenciar SST" },
];
const GRANULAR_PERMISSION_KEYS = new Set(
  GRANULAR_PERMISSION_CATALOG.map((permission) => permission.key)
);
const GRANULAR_PROFILE_CATALOG = [
  { key: "admin", label: "Admin" },
  { key: "gestor", label: "Gestor" },
  { key: "almoxarife", label: "Almoxarife" },
  { key: "tecnico_sst", label: "Tecnico SST" },
  { key: "supervisor", label: "Supervisor" },
  { key: "colaborador", label: "Colaborador" },
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
  verAnuncios: true,
  criarAnuncios: false,
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
  verAlmoxarifado: false,
  gerenciarAlmoxarifado: false,
  verSST: false,
  gerenciarSST: false,
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
  verAlmoxarifado: true,
  gerenciarAlmoxarifado: true,
  verSST: true,
  gerenciarSST: true,
};
const GRANULAR_PCM_PERMISSIONS = {
  ...GRANULAR_ADMIN_PERMISSIONS,
  gerenciarProjetos: true,
  gerenciarEquipamentos: true,
  gerenciarEquipeProjeto: true,
  gerenciarPMP: true,
};
const GRANULAR_ALMOX_PERMISSIONS = {
  ...GRANULAR_BASE_PERMISSIONS,
  verAlmoxarifado: true,
  gerenciarAlmoxarifado: true,
};
const GRANULAR_SST_PERMISSIONS = {
  ...GRANULAR_BASE_PERMISSIONS,
  verSST: true,
  gerenciarSST: true,
};
const GRANULAR_SUPERVISOR_EXT_PERMISSIONS = {
  ...GRANULAR_SUPERVISOR_PERMISSIONS,
  verAlmoxarifado: true,
  verSST: true,
};
const GRANULAR_COLABORADOR_PERMISSIONS = {
  ...GRANULAR_BASE_PERMISSIONS,
  verAlmoxarifado: true,
  verSST: true,
};
const GRANULAR_DEFAULT_PERMISSIONS = {
  admin: GRANULAR_PCM_PERMISSIONS,
  gestor: GRANULAR_ADMIN_PERMISSIONS,
  almoxarife: GRANULAR_ALMOX_PERMISSIONS,
  tecnico_sst: GRANULAR_SST_PERMISSIONS,
  supervisor: GRANULAR_SUPERVISOR_EXT_PERMISSIONS,
  colaborador: GRANULAR_COLABORADOR_PERMISSIONS,
  pcm: GRANULAR_PCM_PERMISSIONS,
  diretor_om: GRANULAR_ADMIN_PERMISSIONS,
  gerente_contrato: GRANULAR_ADMIN_PERMISSIONS,
  supervisor_om: GRANULAR_SUPERVISOR_PERMISSIONS,
  tecnico_senior: GRANULAR_BASE_PERMISSIONS,
  tecnico_pleno: GRANULAR_BASE_PERMISSIONS,
  tecnico_junior: GRANULAR_BASE_PERMISSIONS,
  leitura: GRANULAR_BASE_PERMISSIONS,
};
const ACCESS_PERMISSION_KEYS = new Set([
  "USER_READ",
  "USER_WRITE",
  "ROLE_READ",
  "ROLE_WRITE",
  "SST_READ",
  "SST_WRITE",
  "ALMOX_READ",
  "ALMOX_WRITE",
  "PROJECT_READ",
  "PROJECT_WRITE",
  "REPORTS_READ",
  "KPIS_READ",
  "ADMIN",
  "MAINT_CREATE",
  "MAINT_EDIT",
  "MAINT_REMOVE",
  "MAINT_RESCHEDULE",
  "MAINT_COMPLETE",
  "inicio",
  "programacao",
  "nova",
  "modelos",
  "execucao",
  "backlog",
  "feedbacks",
  "verAnuncios",
  "criarAnuncios",
  "receberEmailNovaManutencao",
  "perfil",
  "editarPerfil",
  "editarPerfilOutros",
  "verUsuarios",
  "convidarUsuarios",
  "desativarUsuarios",
  "verArquivos",
  "uploadArquivos",
  "excluirArquivos",
  "vincularArquivo",
  "verRDOs",
  "gerarRDOs",
  "excluirRDOs",
  "verRelatorios",
  "exportarRelatorios",
  "reexecutarTarefas",
  "verLogsAPI",
  "limparLogsAPI",
  "gerenciarAutomacoes",
  "verAutomacoes",
  "verDiagnostico",
  "verPainelGerencial",
  "gerenciarAcessos",
  "verProjetos",
  "gerenciarProjetos",
  "gerenciarEquipamentos",
  "gerenciarEquipeProjeto",
  "gerenciarPMP",
  "verAlmoxarifado",
  "gerenciarAlmoxarifado",
  "verSST",
  "gerenciarSST",
]);
const ACCESS_ROLE_PERMISSION_VERSION = 2;
const ACCESS_ROLE_DEFAULT_PERMISSION_KEYS = ["receberEmailNovaManutencao"];
const ACCESS_SECTION_PERMISSIONS = [
  "inicio",
  "programacao",
  "nova",
  "modelos",
  "execucao",
  "backlog",
  "feedbacks",
  "perfil",
];

const ACCESS_PERMISSION_ALIASES = {
  "programação": "programacao",
  "execução": "execucao",
};
const ACCESS_MAINTENANCE_PERMISSION_MAP = {
  create: "MAINT_CREATE",
  edit: "MAINT_EDIT",
  remove: "MAINT_REMOVE",
  reschedule: "MAINT_RESCHEDULE",
  complete: "MAINT_COMPLETE",
  "admin:users:read": "verUsuarios",
  "admin:users:write": "convidarUsuarios",
};

const rdoAiCache = new Map();

function normalizeAccessRoleName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeAccessPermissionList(list) {
  const result = new Set();
  (Array.isArray(list) ? list : []).forEach((perm) => {
    const rawInput = String(perm || "").trim();
    const mapped =
      ACCESS_PERMISSION_ALIASES[rawInput.toLowerCase()] || rawInput;
    const raw = String(mapped || "").trim();
    if (!raw) {
      return;
    }
    if (ACCESS_PERMISSION_KEYS.has(raw)) {
      result.add(raw);
      return;
    }
    const upper = raw.toUpperCase();
    if (ACCESS_PERMISSION_KEYS.has(upper)) {
      result.add(upper);
      return;
    }
  });
  if (result.has("MAINT_CREATE") && !result.has("MAINT_COMPLETE")) {
    result.add("MAINT_COMPLETE");
  }
  return Array.from(result);
}

function ensureSectionPermissions(list) {
  const normalized = Array.isArray(list) ? list.slice() : [];
  if (!normalized.length) {
    return normalized;
  }
  const hasSectionControl = ACCESS_SECTION_PERMISSIONS.some((key) => normalized.includes(key));
  if (!hasSectionControl) {
    return normalized.concat(ACCESS_SECTION_PERMISSIONS);
  }
  return normalized;
}

function expandAccessPermissions(list) {
  const base = new Set(normalizeAccessPermissionList(list));
  if (base.has("ADMIN")) {
    GRANULAR_PERMISSION_CATALOG.forEach((perm) => base.add(perm.key));
    return base;
  }
  if (base.has("USER_READ") || base.has("USER_WRITE")) {
    base.add("verUsuarios");
  }
  if (base.has("USER_WRITE")) {
    base.add("convidarUsuarios");
    base.add("desativarUsuarios");
  }
  if (base.has("PROJECT_READ")) {
    base.add("verProjetos");
  }
  if (base.has("PROJECT_WRITE")) {
    base.add("gerenciarProjetos");
    base.add("gerenciarEquipamentos");
    base.add("gerenciarEquipeProjeto");
  }
  if (base.has("SST_READ")) {
    base.add("verSST");
  }
  if (base.has("SST_WRITE")) {
    base.add("verSST");
    base.add("gerenciarSST");
  }
  if (base.has("ALMOX_READ")) {
    base.add("verAlmoxarifado");
  }
  if (base.has("ALMOX_WRITE")) {
    base.add("verAlmoxarifado");
    base.add("gerenciarAlmoxarifado");
  }
  if (base.has("REPORTS_READ") || base.has("KPIS_READ")) {
    base.add("verRelatorios");
  }
  return base;
}

function buildDefaultAccessRoles() {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(),
      name: "Administrador",
      permissions: ["ADMIN", "receberEmailNovaManutencao"],
      isSystem: true,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "PCM",
      permissions: [
        "USER_READ",
        "USER_WRITE",
        "ROLE_READ",
        "PROJECT_READ",
        "SST_WRITE",
        "ALMOX_READ",
        "REPORTS_READ",
        "receberEmailNovaManutencao",
      ],
      isSystem: true,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Supervisor O&M",
      permissions: ["SST_WRITE", "REPORTS_READ", "receberEmailNovaManutencao"],
      isSystem: true,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Tecnico Senior",
      permissions: ["SST_READ", "ALMOX_READ", "PROJECT_READ", "receberEmailNovaManutencao"],
      isSystem: true,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Tecnico Pleno",
      permissions: ["SST_READ", "ALMOX_READ", "PROJECT_READ", "receberEmailNovaManutencao"],
      isSystem: true,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Tecnico Junior",
      permissions: ["SST_READ", "ALMOX_READ", "PROJECT_READ", "receberEmailNovaManutencao"],
      isSystem: true,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Gerente de Contrato",
      permissions: ["REPORTS_READ", "KPIS_READ", "PROJECT_READ", "receberEmailNovaManutencao"],
      isSystem: true,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      name: "Diretor O&M",
      permissions: ["REPORTS_READ", "KPIS_READ", "PROJECT_READ", "receberEmailNovaManutencao"],
      isSystem: true,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function normalizeAccessRoleRecord(role) {
  if (!role || typeof role !== "object") {
    return null;
  }
  const id = String(role.id || "").trim() || crypto.randomUUID();
  const name = String(role.name || "").trim();
  if (!name) {
    return null;
  }
  const permissionsVersion = Number(role.permissionsVersion) || 1;
  const createdAt = role.createdAt || new Date().toISOString();
  const order = Number(role.order);
  return {
    id,
    name,
    nameNormalized: normalizeAccessRoleName(name),
    permissions: ensureSectionPermissions(normalizeAccessPermissionList(role.permissions || [])),
    isSystem: Boolean(role.isSystem),
    order: Number.isFinite(order) ? order : null,
    permissionsVersion,
    createdAt,
    updatedAt: role.updatedAt || createdAt,
  };
}

function getAccessRoleOrderValue(role, fallback = 0) {
  const order = Number(role && role.order);
  return Number.isFinite(order) ? order : fallback;
}

function ensureAccessRoleOrder(list = []) {
  let changed = false;
  const result = list
    .map((role, index) => {
      if (!role || typeof role !== "object") {
        return null;
      }
      const order = Number(role.order);
      if (Number.isFinite(order)) {
        return role;
      }
      changed = true;
      return { ...role, order: index };
    })
    .filter(Boolean);
  return { list: result, changed };
}

function sortAccessRolesByOrder(list = []) {
  return list
    .map((role, index) => ({ role, index }))
    .sort((a, b) => {
      const ao = getAccessRoleOrderValue(a.role, a.index);
      const bo = getAccessRoleOrderValue(b.role, b.index);
      if (ao !== bo) {
        return ao - bo;
      }
      return String(a.role.name || "").localeCompare(String(b.role.name || ""));
    })
    .map((entry) => entry.role);
}

function loadAccessRoles() {
  const data = readJson(ACCESS_ROLES_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  const normalized = data.map(normalizeAccessRoleRecord).filter(Boolean);
  const ensured = ensureAccessRoleOrder(normalized);
  if (ensured.changed) {
    writeJson(ACCESS_ROLES_FILE, ensured.list);
  }
  return ensured.list;
}

function saveAccessRoles(list) {
  const normalized = (Array.isArray(list) ? list : [])
    .map(normalizeAccessRoleRecord)
    .filter(Boolean);
  const ensured = ensureAccessRoleOrder(normalized);
  accessRoles = ensured.list;
  writeJson(ACCESS_ROLES_FILE, accessRoles);
  return accessRoles;
}

function applyAccessRolePermissionDefaults(list) {
  let changed = false;
  const updated = (Array.isArray(list) ? list : []).map((role) => {
    if (!role || typeof role !== "object") {
      return role;
    }
    const version = Number(role.permissionsVersion) || 1;
    if (version >= ACCESS_ROLE_PERMISSION_VERSION) {
      return role;
    }
    const permissions = ensureSectionPermissions(
      normalizeAccessPermissionList(role.permissions || [])
    );
    const nextPermissions = new Set(permissions);
    ACCESS_ROLE_DEFAULT_PERMISSION_KEYS.forEach((key) => nextPermissions.add(key));
    changed = true;
    return {
      ...role,
      permissions: Array.from(nextPermissions),
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      updatedAt: new Date().toISOString(),
    };
  });
  if (changed) {
    return saveAccessRoles(updated);
  }
  return list;
}

function seedDefaultAccessRolesIfEmpty() {
  if (accessRoles && accessRoles.length) {
    return { seeded: false, count: accessRoles.length };
  }
  const defaults = buildDefaultAccessRoles();
  saveAccessRoles(defaults);
  return { seeded: true, count: defaults.length };
}

function getAccessRoleById(roleId) {
  if (!roleId) {
    return null;
  }
  const id = String(roleId);
  return accessRoles.find((role) => String(role.id) === id) || null;
}

function getAccessRoleByName(name) {
  const normalized = normalizeAccessRoleName(name);
  if (!normalized) {
    return null;
  }
  return (
    accessRoles.find((role) => role.nameNormalized === normalized) ||
    accessRoles.find((role) => normalizeAccessRoleName(role.name) === normalized) ||
    null
  );
}

function deriveRbacRoleFromRoleName(roleName) {
  const normalized = normalizeAccessRoleName(roleName);
  if (!normalized) {
    return "";
  }
  if (normalized === "pcm") {
    return "pcm";
  }
  if (normalized.includes("administrador") || normalized === "admin") {
    return "admin";
  }
  if (normalized.includes("supervisor o m")) {
    return "supervisor_om";
  }
  if (normalized.includes("diretor o m")) {
    return "diretor_om";
  }
  if (normalized.includes("gerente de contrato")) {
    return "gerente_contrato";
  }
  if (normalized.includes("tecnico senior")) {
    return "tecnico_senior";
  }
  if (normalized.includes("tecnico pleno")) {
    return "tecnico_pleno";
  }
  if (normalized.includes("tecnico junior")) {
    return "tecnico_junior";
  }
  return normalized.replace(/[^a-z0-9]+/g, "_");
}

function getAccessPermissionsForUser(user) {
  if (!user) {
    return [];
  }
  const direct = Array.isArray(user.accessPermissions)
    ? user.accessPermissions
    : Array.isArray(user.rolePermissions)
      ? user.rolePermissions
      : [];
  if (direct.length) {
    return ensureSectionPermissions(normalizeAccessPermissionList(direct));
  }
  const role =
    (user.roleId && getAccessRoleById(user.roleId)) ||
    getAccessRoleByName(user.roleName || user.cargo || user.role);
  if (role && Array.isArray(role.permissions)) {
    return ensureSectionPermissions(normalizeAccessPermissionList(role.permissions));
  }
  return [];
}

function canViewAccessForUser(user) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user) || isFullAccessRole(user.rbacRole || user.role)) {
    return true;
  }
  const access = new Set(getAccessPermissionsForUser(user));
  return (
    access.has("ADMIN") || access.has("gerenciarAcessos")
  );
}

function canManageAccessForUser(user) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user) || isFullAccessRole(user.rbacRole || user.role)) {
    return true;
  }
  const access = new Set(getAccessPermissionsForUser(user));
  return (
    access.has("ADMIN") || access.has("gerenciarAcessos")
  );
}

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
  almoxarifado: true,
  "almoxarifado-itens": true,
  "almoxarifado-estoque": true,
  "almoxarifado-movimentacoes": true,
  "almoxarifado-epis": true,
  sst: true,
  "sst-treinamentos": true,
  "sst-inspecoes": true,
  "sst-ncs": true,
  "sst-incidentes": true,
  "sst-apr-pt": true,
};

const PROFILE_THEME_OPTIONS = new Set(["dark", "dark-contrast"]);
const PROFILE_DENSITY_OPTIONS = new Set(["comfortable", "compact"]);
const PROFILE_LANGUAGE_OPTIONS = new Set(["pt-br", "en", "es"]);
const PROFILE_TIMEZONE_OPTIONS = new Set([
  "America/Sao_Paulo",
  "America/Manaus",
  "America/Fortaleza",
]);
const PROFILE_DASHBOARD_OPTIONS = new Set(["inicio", "programacao", "desempenho"]);
const DEFAULT_PROFILE_PREFERENCES = {
  theme: "dark",
  density: "comfortable",
  language: "pt-br",
  timezone: "America/Sao_Paulo",
  dashboard: "inicio",
  notifications: {
    assignedOs: true,
    dueSoon: true,
    criticalAlerts: false,
    weeklyReports: true,
  },
};
const DEFAULT_PROFILE_SECURITY = {
  twoFactorEnabled: false,
  blockUnknownDevices: true,
};

function normalizeProfilePreferences(value) {
  const input = value && typeof value === "object" ? value : {};
  const notifications =
    input.notifications && typeof input.notifications === "object" ? input.notifications : {};
  return {
    theme: PROFILE_THEME_OPTIONS.has(input.theme)
      ? input.theme
      : DEFAULT_PROFILE_PREFERENCES.theme,
    density: PROFILE_DENSITY_OPTIONS.has(input.density)
      ? input.density
      : DEFAULT_PROFILE_PREFERENCES.density,
    language: PROFILE_LANGUAGE_OPTIONS.has(input.language)
      ? input.language
      : DEFAULT_PROFILE_PREFERENCES.language,
    timezone: PROFILE_TIMEZONE_OPTIONS.has(input.timezone)
      ? input.timezone
      : DEFAULT_PROFILE_PREFERENCES.timezone,
    dashboard: PROFILE_DASHBOARD_OPTIONS.has(input.dashboard)
      ? input.dashboard
      : DEFAULT_PROFILE_PREFERENCES.dashboard,
    notifications: {
      assignedOs:
        typeof notifications.assignedOs === "boolean"
          ? notifications.assignedOs
          : DEFAULT_PROFILE_PREFERENCES.notifications.assignedOs,
      dueSoon:
        typeof notifications.dueSoon === "boolean"
          ? notifications.dueSoon
          : DEFAULT_PROFILE_PREFERENCES.notifications.dueSoon,
      criticalAlerts:
        typeof notifications.criticalAlerts === "boolean"
          ? notifications.criticalAlerts
          : DEFAULT_PROFILE_PREFERENCES.notifications.criticalAlerts,
      weeklyReports:
        typeof notifications.weeklyReports === "boolean"
          ? notifications.weeklyReports
          : DEFAULT_PROFILE_PREFERENCES.notifications.weeklyReports,
    },
  };
}

function normalizeProfileSecurity(value) {
  const input = value && typeof value === "object" ? value : {};
  return {
    twoFactorEnabled: Boolean(input.twoFactorEnabled),
    blockUnknownDevices:
      typeof input.blockUnknownDevices === "boolean"
        ? input.blockUnknownDevices
        : DEFAULT_PROFILE_SECURITY.blockUnknownDevices,
  };
}

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
  console.log("[storage] DB_ENABLED=", DB_ENABLED);
  console.log("[storage] STORE_UPLOADS=", STORE_UPLOADS);
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

function getDatabaseInfo() {
  if (!DATABASE_URL) {
    return { configured: false, host: "", database: "" };
  }
  try {
    const url = new URL(DATABASE_URL);
    return { configured: true, host: url.hostname || "", database: url.pathname || "" };
  } catch (error) {
    return { configured: true, host: "", database: "" };
  }
}

function getStorageSnapshot() {
  const dbInfo = getDatabaseInfo();
  return {
    dbEnabled: DB_ENABLED,
    dbReady,
    dbHost: dbInfo.host,
    dbDatabase: dbInfo.database,
    storeUploads: STORE_UPLOADS,
    uploadsMaxBytes: STORE_UPLOADS_MAX_BYTES,
    uploadsBackfillLimit: STORE_UPLOADS_BACKFILL_LIMIT,
    storageDir: STORAGE_DIR,
    uploadsDir: UPLOADS_DIR,
  };
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
    if (!warnedUploadsDisabled && entry && buffer) {
      warnedUploadsDisabled = true;
      console.warn("[storage] Uploads nao serao persistidos no DB (DB indisponivel ou desativado).");
    }
    return;
  }
  if (!entry.id || buffer.length > STORE_UPLOADS_MAX_BYTES) {
    console.warn(
      "[storage] Upload ignorado (tamanho/ID invalido):",
      entry && entry.name ? entry.name : "(sem nome)",
      buffer ? buffer.length : 0
    );
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
    console.log("[storage] Upload salvo no DB:", entry.name, entry.id, buffer.length);
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

async function fetchUploadBlobByNameAnyType(name) {
  if (!shouldStoreUploads() || !name) {
    return null;
  }
  try {
    const result = await dbPool.query(
      `SELECT id, name, mime, data FROM ${DB_UPLOADS_TABLE}
       WHERE name = $1
       ORDER BY updated_at DESC
       LIMIT 1`,
      [String(name)]
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

function normalizeLookupFileName(value) {
  const raw = path.basename(String(value || "").trim());
  if (!raw) {
    return "";
  }
  const ext = path.extname(raw);
  const base = ext ? raw.slice(0, -ext.length) : raw;
  const sanitized = sanitizeFileName(base);
  if (!sanitized) {
    return "";
  }
  return `${sanitized}${ext}`;
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

async function getUploadsCount() {
  if (!shouldStoreUploads()) {
    return null;
  }
  try {
    const result = await dbPool.query(`SELECT COUNT(*) AS total FROM ${DB_UPLOADS_TABLE}`);
    const total = result && result.rows && result.rows[0] ? Number(result.rows[0].total) : 0;
    return Number.isFinite(total) ? total : 0;
  } catch (error) {
    console.warn("[db] Falha ao contar uploads:", error.message || error);
    return null;
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
    nomeTime: String(
      record && (record.nomeTime || record.timeName || record.time)
        ? record.nomeTime || record.timeName || record.time
        : ""
    ).trim(),
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

function normalizeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeTextList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[\n,;]+/g)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeAlmoxItem(record) {
  const now = new Date().toISOString();
  const typeRaw = String(record && (record.type || record.tipo) ? record.type || record.tipo : "")
    .trim()
    .toUpperCase();
  const unitRaw = String(
    record && (record.unit || record.unidade) ? record.unit || record.unidade : ""
  )
    .trim()
    .toUpperCase();
  const statusRaw = String(record && record.status ? record.status : "ATIVO")
    .trim()
    .toUpperCase();
  const type = ALMOX_ITEM_TYPES.has(typeRaw) ? typeRaw : "FERRAMENTA";
  const unit = ALMOX_ITEM_UNITS.has(unitRaw) ? unitRaw : "UN";
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    type,
    unit,
    name: String(record && (record.name || record.nome) ? record.name || record.nome : "").trim(),
    description: String(
      record && (record.description || record.descricao) ? record.description || record.descricao : ""
    ).trim(),
    brand: String(record && (record.brand || record.marca) ? record.brand || record.marca : "").trim(),
    model: String(record && (record.model || record.modelo) ? record.model || record.modelo : "").trim(),
    internalCode: String(
      record && (record.internalCode || record.codigoInterno || record.codigo)
        ? record.internalCode || record.codigoInterno || record.codigo
        : ""
    ).trim(),
    barcode: String(
      record && (record.barcode || record.codigoBarras) ? record.barcode || record.codigoBarras : ""
    ).trim(),
    status: statusRaw || "ATIVO",
    ca: String(record && (record.ca || record.CA) ? record.ca || record.CA : "").trim(),
    caValidUntil: String(
      record && (record.caValidUntil || record.validadeCA)
        ? record.caValidUntil || record.validadeCA
        : ""
    ).trim(),
    itemValidUntil: String(
      record && (record.itemValidUntil || record.validadeItem || record.validade)
        ? record.itemValidUntil || record.validadeItem || record.validade
        : ""
    ).trim(),
    sizes: normalizeTextList(record && (record.sizes || record.tamanhos) ? record.sizes || record.tamanhos : []),
    datasheet: record && record.datasheet ? record.datasheet : "",
    requiredRoles: normalizeTextList(record && record.requiredRoles ? record.requiredRoles : []),
    photos: Array.isArray(record && record.photos ? record.photos : []) ? record.photos : [],
    createdAt: record && record.createdAt ? record.createdAt : now,
    createdBy: record && record.createdBy ? record.createdBy : "",
    updatedAt: record && record.updatedAt ? record.updatedAt : now,
    updatedBy: record && record.updatedBy ? record.updatedBy : "",
    deletedAt: record && record.deletedAt ? record.deletedAt : "",
  };
}

function loadAlmoxItems() {
  const data = readJson(ALMOX_ITEMS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeAlmoxItem);
}

function saveAlmoxItems(list) {
  writeJson(ALMOX_ITEMS_FILE, list);
}

function normalizeAlmoxStockEntry(record) {
  const now = new Date().toISOString();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    itemId: String(record && record.itemId ? record.itemId : "").trim(),
    worksite: String(record && (record.worksite || record.local) ? record.worksite || record.local : "")
      .trim(),
    available: Math.max(0, normalizeNumber(record && (record.available ?? record.disponivel))),
    reserved: Math.max(0, normalizeNumber(record && (record.reserved ?? record.reservado))),
    min: Math.max(0, normalizeNumber(record && (record.min ?? record.minimo))),
    reorderPoint: Math.max(0, normalizeNumber(record && (record.reorderPoint ?? record.pontoReposicao))),
    updatedAt: record && record.updatedAt ? record.updatedAt : now,
  };
}

function loadAlmoxStock() {
  const data = readJson(ALMOX_STOCK_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeAlmoxStockEntry);
}

function saveAlmoxStock(list) {
  writeJson(ALMOX_STOCK_FILE, list);
}

function normalizeAlmoxMovement(record) {
  const now = new Date().toISOString();
  const typeRaw = String(record && (record.type || record.tipo) ? record.type || record.tipo : "")
    .trim()
    .toUpperCase();
  const type = ALMOX_MOVEMENT_TYPES.has(typeRaw) ? typeRaw : "ENTRADA";
  const quantity = Math.max(0, normalizeNumber(record && (record.quantity ?? record.quantidade)));
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    type,
    itemId: String(record && record.itemId ? record.itemId : "").trim(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    projectIdDestino: String(
      record && (record.projectIdDestino || record.projectDestinationId)
        ? record.projectIdDestino || record.projectDestinationId
        : ""
    ).trim(),
    worksite: String(record && (record.worksite || record.local) ? record.worksite || record.local : "")
      .trim(),
    worksiteDestino: String(
      record && (record.worksiteDestino || record.localDestino)
        ? record.worksiteDestino || record.localDestino
        : ""
    ).trim(),
    quantity,
    adjustment:
      record && record.adjustment !== undefined && record.adjustment !== null
        ? normalizeNumber(record.adjustment, 0)
        : null,
    reason: String(record && (record.reason || record.motivo) ? record.reason || record.motivo : "")
      .trim(),
    collaboratorId: String(
      record && (record.collaboratorId || record.colaboradorId)
        ? record.collaboratorId || record.colaboradorId
        : ""
    ).trim(),
    createdAt: record && record.createdAt ? record.createdAt : now,
    createdBy: record && record.createdBy ? record.createdBy : "",
    attachments: Array.isArray(record && record.attachments ? record.attachments : [])
      ? record.attachments
      : [],
  };
}

function loadAlmoxMovements() {
  const data = readJson(ALMOX_MOVEMENTS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeAlmoxMovement);
}

function saveAlmoxMovements(list) {
  writeJson(ALMOX_MOVEMENTS_FILE, list);
}

function normalizeAlmoxKit(record) {
  const now = new Date().toISOString();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    name: String(record && (record.name || record.nome) ? record.name || record.nome : "").trim(),
    description: String(
      record && (record.description || record.descricao) ? record.description || record.descricao : ""
    ).trim(),
    roles: normalizeTextList(record && (record.roles || record.funcoes) ? record.roles || record.funcoes : []),
    items: Array.isArray(record && record.items ? record.items : []) ? record.items : [],
    createdAt: record && record.createdAt ? record.createdAt : now,
    updatedAt: record && record.updatedAt ? record.updatedAt : now,
  };
}

function loadAlmoxKits() {
  const data = readJson(ALMOX_KITS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeAlmoxKit);
}

function saveAlmoxKits(list) {
  writeJson(ALMOX_KITS_FILE, list);
}

function normalizeSstTraining(record) {
  const now = new Date().toISOString();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    name: String(record && (record.name || record.nome) ? record.name || record.nome : "").trim(),
    nr: String(record && record.nr ? record.nr : "").trim(),
    hours: Math.max(0, normalizeNumber(record && (record.hours ?? record.cargaHoraria))),
    validityDays: Math.max(0, normalizeNumber(record && (record.validityDays ?? record.validade))),
    requiredRoles: normalizeTextList(record && record.requiredRoles ? record.requiredRoles : []),
    status: String(record && record.status ? record.status : "ATIVO").trim().toUpperCase() || "ATIVO",
    createdAt: record && record.createdAt ? record.createdAt : now,
    updatedAt: record && record.updatedAt ? record.updatedAt : now,
  };
}

function loadSstTrainings() {
  const data = readJson(SST_TRAININGS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeSstTraining);
}

function saveSstTrainings(list) {
  writeJson(SST_TRAININGS_FILE, list);
}

function normalizeSstTrainingRecord(record) {
  const now = new Date().toISOString();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    trainingId: String(record && record.trainingId ? record.trainingId : "").trim(),
    collaboratorId: String(record && record.collaboratorId ? record.collaboratorId : "").trim(),
    date: String(record && record.date ? record.date : "").trim(),
    validUntil: String(record && (record.validUntil || record.validade) ? record.validUntil || record.validade : "").trim(),
    status: String(record && record.status ? record.status : "ATIVO").trim().toUpperCase() || "ATIVO",
    attachment: record && record.attachment ? record.attachment : null,
    createdAt: record && record.createdAt ? record.createdAt : now,
  };
}

function loadSstTrainingRecords() {
  const data = readJson(SST_TRAINING_RECORDS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeSstTrainingRecord);
}

function saveSstTrainingRecords(list) {
  writeJson(SST_TRAINING_RECORDS_FILE, list);
}

function normalizeSstInspectionTemplate(record) {
  const now = new Date().toISOString();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    type: String(record && (record.type || record.tipo) ? record.type || record.tipo : "").trim(),
    questions: normalizeTextList(record && (record.questions || record.perguntas) ? record.questions || record.perguntas : []),
    periodicityDays: Math.max(0, normalizeNumber(record && (record.periodicityDays ?? record.periodicidade))),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    local: String(record && (record.local || record.worksite) ? record.local || record.worksite : "").trim(),
    createdAt: record && record.createdAt ? record.createdAt : now,
    updatedAt: record && record.updatedAt ? record.updatedAt : now,
  };
}

function loadSstInspectionTemplates() {
  const data = readJson(SST_INSPECTION_TEMPLATES_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeSstInspectionTemplate);
}

function saveSstInspectionTemplates(list) {
  writeJson(SST_INSPECTION_TEMPLATES_FILE, list);
}

function normalizeSstInspection(record) {
  const now = new Date().toISOString();
  const startedAt = record && record.startedAt ? record.startedAt : record && record.createdAt ? record.createdAt : now;
  const finishedAt = record && record.finishedAt ? record.finishedAt : "";
  const answers = Array.isArray(record && record.answers ? record.answers : [])
    ? record.answers
    : [];
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    templateId: String(record && record.templateId ? record.templateId : "").trim(),
    type: String(record && (record.type || record.tipo) ? record.type || record.tipo : "").trim(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    local: String(record && (record.local || record.worksite) ? record.local || record.worksite : "").trim(),
    worksiteId: String(record && record.worksiteId ? record.worksiteId : "").trim(),
    inspectorId: String(record && record.inspectorId ? record.inspectorId : "").trim(),
    safetyResponsibleId: String(record && record.safetyResponsibleId ? record.safetyResponsibleId : "").trim(),
    vehicleId: String(record && record.vehicleId ? record.vehicleId : "").trim(),
    vehicleSnapshot: record && record.vehicleSnapshot ? record.vehicleSnapshot : null,
    status: String(record && record.status ? record.status : "OK").trim().toUpperCase() || "OK",
    notes: String(record && (record.notes || record.observacoes) ? record.notes || record.observacoes : "").trim(),
    photos: Array.isArray(record && record.photos ? record.photos : []) ? record.photos : [],
    answers,
    score: Number.isFinite(Number(record && record.score)) ? Number(record.score) : 0,
    startedAt,
    finishedAt,
    createdAt: record && record.createdAt ? record.createdAt : now,
    createdBy: record && record.createdBy ? record.createdBy : "",
  };
}

function loadSstInspections() {
  const data = readJson(SST_INSPECTIONS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeSstInspection);
}

function saveSstInspections(list) {
  writeJson(SST_INSPECTIONS_FILE, list);
}

function normalizeVehiclePlate(rawPlate) {
  return String(rawPlate || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeVehicleStatusValue(status) {
  const normalized = String(status || "ATIVO").toUpperCase();
  if (normalized === "MANUTENCAO" || normalized === "MANUTEN\u00c7\u00c3O") {
    return "MANUTENCAO";
  }
  if (normalized === "INATIVO" || normalized === "INACTIVE") {
    return "INATIVO";
  }
  return "ATIVO";
}

function normalizeVehicleType(type) {
  const normalized = String(type || "OUTRO").toUpperCase();
  if (normalized === "CARRO") {
    return "Carro";
  }
  if (normalized === "CAMINHONETE") {
    return "Caminhonete";
  }
  if (normalized === "CAMINHAO" || normalized === "CAMINH\u00c3O") {
    return "Caminh\u00e3o";
  }
  if (normalized === "VAN") {
    return "Van";
  }
  if (normalized === "ONIBUS" || normalized === "\u00d4NIBUS") {
    return "\u00d4nibus";
  }
  if (normalized === "MOTO") {
    return "Moto";
  }
  return "Outro";
}

function normalizeSstVehicle(record) {
  if (!record || typeof record !== "object") {
    return null;
  }
  const projectId = String(record.projectId || "").trim();
  const plate = normalizeVehiclePlate(record.plate || record.placa || "");
  if (!projectId || !plate) {
    return null;
  }
  const now = new Date().toISOString();
  const createdAt = record.createdAt || now;
  return {
    id: record.id ? String(record.id) : crypto.randomUUID(),
    projectId,
    plate,
    plateNormalized: normalizeVehiclePlate(plate),
    model: record.model ? String(record.model) : "",
    type: normalizeVehicleType(record.type),
    status: normalizeVehicleStatusValue(record.status || "ATIVO"),
    notes: record.notes ? String(record.notes) : "",
    createdBy: record.createdBy || "",
    createdAt,
    updatedAt: record.updatedAt || createdAt,
  };
}

function loadSstVehicles() {
  const data = readJson(SST_VEHICLES_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(normalizeSstVehicle).filter(Boolean);
}

function saveSstVehicles(list) {
  writeJson(SST_VEHICLES_FILE, list);
}

function normalizeSstNonconformity(record) {
  const now = new Date().toISOString();
  const severityRaw = String(record && record.severity ? record.severity : "").trim().toUpperCase();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    origin: String(record && record.origin ? record.origin : "").trim(),
    severity: SST_SEVERITY_LEVELS.has(severityRaw) ? severityRaw : "MEDIA",
    description: String(record && (record.description || record.descricao) ? record.description || record.descricao : "").trim(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    dueDate: String(record && (record.dueDate || record.prazo) ? record.dueDate || record.prazo : "").trim(),
    status: String(record && record.status ? record.status : "ABERTA").trim().toUpperCase() || "ABERTA",
    responsibleId: String(record && (record.responsibleId || record.responsavelId) ? record.responsibleId || record.responsavelId : "").trim(),
    createdAt: record && record.createdAt ? record.createdAt : now,
    createdBy: record && record.createdBy ? record.createdBy : "",
  };
}

function loadSstNonconformities() {
  const data = readJson(SST_NONCONFORMITIES_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeSstNonconformity);
}

function saveSstNonconformities(list) {
  writeJson(SST_NONCONFORMITIES_FILE, list);
}

function normalizeSstIncident(record) {
  const now = new Date().toISOString();
  const severityRaw = String(record && record.severity ? record.severity : "").trim().toUpperCase();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    date: String(record && record.date ? record.date : "").trim(),
    severity: SST_SEVERITY_LEVELS.has(severityRaw) ? severityRaw : "MEDIA",
    category: String(record && record.category ? record.category : "").trim(),
    description: String(record && (record.description || record.descricao) ? record.description || record.descricao : "").trim(),
    status: String(record && record.status ? record.status : "ABERTO").trim().toUpperCase() || "ABERTO",
    createdAt: record && record.createdAt ? record.createdAt : now,
    createdBy: record && record.createdBy ? record.createdBy : "",
  };
}

function loadSstIncidents() {
  const data = readJson(SST_INCIDENTS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeSstIncident);
}

function saveSstIncidents(list) {
  writeJson(SST_INCIDENTS_FILE, list);
}

function normalizeSstApr(record) {
  const now = new Date().toISOString();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    projectId: String(record && record.projectId ? record.projectId : "").trim(),
    activity: String(record && (record.activity || record.atividade) ? record.activity || record.atividade : "").trim(),
    hazards: normalizeTextList(record && (record.hazards || record.perigos) ? record.hazards || record.perigos : []),
    risks: normalizeTextList(record && (record.risks || record.riscos) ? record.risks || record.riscos : []),
    controls: normalizeTextList(record && (record.controls || record.controles) ? record.controls || record.controles : []),
    status: String(record && record.status ? record.status : "ATIVA").trim().toUpperCase() || "ATIVA",
    createdAt: record && record.createdAt ? record.createdAt : now,
    createdBy: record && record.createdBy ? record.createdBy : "",
  };
}

function loadSstAprs() {
  const data = readJson(SST_APRS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeSstApr);
}

function saveSstAprs(list) {
  writeJson(SST_APRS_FILE, list);
}

function normalizeSstPermit(record) {
  const now = new Date().toISOString();
  return {
    id: record && record.id ? String(record.id) : crypto.randomUUID(),
    aprId: String(record && (record.aprId || record.apr_id) ? record.aprId || record.apr_id : "").trim(),
    type: String(record && (record.type || record.tipo) ? record.type || record.tipo : "").trim(),
    validFrom: String(record && (record.validFrom || record.inicio) ? record.validFrom || record.inicio : "").trim(),
    validTo: String(record && (record.validTo || record.fim) ? record.validTo || record.fim : "").trim(),
    requirements: normalizeTextList(record && (record.requirements || record.requisitos) ? record.requirements || record.requisitos : []),
    status: String(record && record.status ? record.status : "ATIVA").trim().toUpperCase() || "ATIVA",
    createdAt: record && record.createdAt ? record.createdAt : now,
    createdBy: record && record.createdBy ? record.createdBy : "",
  };
}

function loadSstPermits() {
  const data = readJson(SST_PERMITS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object").map(normalizeSstPermit);
}

function saveSstPermits(list) {
  writeJson(SST_PERMITS_FILE, list);
}

function getAlmoxStockKey(projectId, itemId, worksite) {
  return `${projectId || ""}::${itemId || ""}::${worksite || ""}`;
}

function findAlmoxStockEntry(projectId, itemId, worksite) {
  const key = getAlmoxStockKey(projectId, itemId, worksite);
  const index = almoxStock.findIndex(
    (entry) => getAlmoxStockKey(entry.projectId, entry.itemId, entry.worksite) === key
  );
  return { index, entry: index >= 0 ? almoxStock[index] : null };
}

function ensureAlmoxStockEntry(projectId, itemId, worksite) {
  const normalizedWorksite = String(worksite || "").trim();
  const existing = findAlmoxStockEntry(projectId, itemId, normalizedWorksite);
  if (existing.entry) {
    return { entry: existing.entry, index: existing.index, created: false };
  }
  const entry = normalizeAlmoxStockEntry({
    projectId,
    itemId,
    worksite: normalizedWorksite,
    available: 0,
    reserved: 0,
    min: 0,
    reorderPoint: 0,
  });
  almoxStock = almoxStock.concat(entry);
  return { entry, index: almoxStock.length - 1, created: true };
}

function applyAlmoxMovement(movement) {
  if (!movement) {
    return { error: "Movimentacao invalida." };
  }
  const type = String(movement.type || "").trim().toUpperCase();
  if (!ALMOX_MOVEMENT_TYPES.has(type)) {
    return { error: "Tipo de movimentacao invalido." };
  }
  const qty = Number(movement.quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    return { error: "Quantidade invalida." };
  }
  const projectId = String(movement.projectId || "").trim();
  const itemId = String(movement.itemId || "").trim();
  if (!projectId || !itemId) {
    return { error: "Projeto e item sao obrigatorios." };
  }
  const now = new Date().toISOString();
  const origin = ensureAlmoxStockEntry(projectId, itemId, movement.worksite || "");
  const rollbackEntry = (entryInfo) => {
    if (entryInfo && entryInfo.created && entryInfo.entry) {
      almoxStock = almoxStock.filter((entry) => entry.id !== entryInfo.entry.id);
    }
  };
  const updateEntry = (entry, deltaAvailable, deltaReserved) => {
    const nextAvailable = Number(entry.available || 0) + deltaAvailable;
    const nextReserved = Number(entry.reserved || 0) + deltaReserved;
    if (nextAvailable < 0) {
      return { error: "Estoque insuficiente para a movimentacao." };
    }
    if (nextReserved < 0) {
      return { error: "Reserva insuficiente para a movimentacao." };
    }
    entry.available = nextAvailable;
    entry.reserved = nextReserved;
    entry.updatedAt = now;
    return { ok: true };
  };

  if (type === "ENTRADA" || type === "DEVOLUCAO") {
    const result = updateEntry(origin.entry, qty, 0);
    if (result.error) {
      rollbackEntry(origin);
      return { error: result.error };
    }
    return { origin: origin.entry };
  }

  if (type === "AJUSTE") {
    let delta = qty;
    if (Number.isFinite(movement.adjustment)) {
      delta = Number(movement.adjustment);
    }
    if (!Number.isFinite(delta) || delta === 0) {
      rollbackEntry(origin);
      return { error: "Ajuste invalido." };
    }
    const result = updateEntry(origin.entry, delta, 0);
    if (result.error) {
      rollbackEntry(origin);
      return { error: result.error };
    }
    return { origin: origin.entry };
  }

  if (type === "SAIDA" || type === "PERDA_BAIXA") {
    const result = updateEntry(origin.entry, -qty, 0);
    if (result.error) {
      rollbackEntry(origin);
      return { error: result.error };
    }
    return { origin: origin.entry };
  }

  if (type === "RESERVA") {
    const result = updateEntry(origin.entry, -qty, qty);
    if (result.error) {
      rollbackEntry(origin);
      return { error: result.error };
    }
    return { origin: origin.entry };
  }

  if (type === "LIBERACAO_RESERVA") {
    const result = updateEntry(origin.entry, qty, -qty);
    if (result.error) {
      rollbackEntry(origin);
      return { error: result.error };
    }
    return { origin: origin.entry };
  }

  if (type === "TRANSFERENCIA") {
    const destProjectId = String(movement.projectIdDestino || "").trim();
    if (!destProjectId) {
      rollbackEntry(origin);
      return { error: "Projeto destino obrigatorio para transferencia." };
    }
    const dest = ensureAlmoxStockEntry(
      destProjectId,
      itemId,
      movement.worksiteDestino || ""
    );
    const result = updateEntry(origin.entry, -qty, 0);
    if (result.error) {
      rollbackEntry(origin);
      rollbackEntry(dest);
      return { error: result.error };
    }
    updateEntry(dest.entry, qty, 0);
    return { origin: origin.entry, dest: dest.entry };
  }

  return { error: "Tipo de movimentacao nao suportado." };
}

function buildEpiByUser(projectIds) {
  const allowed = new Set(projectIds || []);
  const epiItems = new Set(
    almoxItems
      .filter((item) => item && item.type === "EPI" && item.status !== "INATIVO")
      .map((item) => item.id)
  );
  const map = new Map();
  almoxMovements.forEach((mov) => {
    if (!mov || !epiItems.has(mov.itemId)) {
      return;
    }
    if (allowed.size && !allowed.has(mov.projectId)) {
      return;
    }
    if (!mov.collaboratorId) {
      return;
    }
    let delta = 0;
    if (mov.type === "SAIDA") {
      delta = Number(mov.quantity || 0);
    } else if (mov.type === "DEVOLUCAO") {
      delta = -Number(mov.quantity || 0);
    } else if (mov.type === "PERDA_BAIXA") {
      delta = -Number(mov.quantity || 0);
    }
    if (!delta) {
      return;
    }
    const key = `${mov.collaboratorId}::${mov.itemId}::${mov.projectId}`;
    const current = map.get(key) || {
      collaboratorId: mov.collaboratorId,
      itemId: mov.itemId,
      projectId: mov.projectId,
      quantity: 0,
      lastMovementAt: "",
    };
    current.quantity += delta;
    if (!current.lastMovementAt || mov.createdAt > current.lastMovementAt) {
      current.lastMovementAt = mov.createdAt;
    }
    map.set(key, current);
  });
  return Array.from(map.values()).filter((entry) => entry.quantity > 0);
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
      storage: {
        status: DB_ENABLED && dbReady ? "ok" : "warn",
        info: getStorageSnapshot(),
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

function normalizeSearchValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeMatricula(value) {
  return normalizeSearchValue(value).replace(/\s+/g, "");
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
      nomeTime: DEFAULT_PROJECT_TEAM,
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
    (!Array.isArray(defaultProject.locais) || defaultProject.locais.length === 0 || !defaultProject.nomeTime)
  ) {
    defaultProject = {
      ...defaultProject,
      locais: DEFAULT_PROJECT_LOCAIS.slice(),
      nomeTime: defaultProject.nomeTime || DEFAULT_PROJECT_TEAM,
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
  return hasPermission(user, "remove");
}

function canReopenMaintenance(user) {
  if (!user) {
    return false;
  }
  return (
    hasPermission(user, "edit") ||
    hasPermission(user, "complete") ||
    hasPermission(user, "remove")
  );
}

function canSyncMaintenance(user) {
  if (!user) {
    return false;
  }
  return (
    hasPermission(user, "create") ||
    hasPermission(user, "edit") ||
    hasPermission(user, "reschedule") ||
    hasPermission(user, "complete") ||
    hasPermission(user, "remove")
  );
}

function canManageMaintenanceTemplates(user) {
  if (!user) {
    return false;
  }
  return hasPermission(user, "create") || hasPermission(user, "edit");
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

  const announcementsMigration = migrateRecordsProjectId(announcements, defaultProject.id);
  if (announcementsMigration.changed) {
    announcements = announcementsMigration.list;
    saveAnnouncements(announcements);
  }

  const feedbacksMigration = migrateRecordsProjectId(feedbacks, defaultProject.id);
  if (feedbacksMigration.changed) {
    feedbacks = feedbacksMigration.list;
    saveFeedbacks(feedbacks);
  }

  const sstDocsMigration = migrateRecordsProjectId(sstDocs, defaultProject.id);
  if (sstDocsMigration.changed) {
    sstDocs = sstDocsMigration.list;
    saveSstDocs(sstDocs);
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

function getUserLabel(userId) {
  if (!userId) {
    return "-";
  }
  if (typeof userId === "object") {
    const nome = String(userId.name || userId.username || userId.matricula || "").trim();
    return nome || "-";
  }
  const id = String(userId || "").trim();
  if (!id) {
    return "-";
  }
  const user = users.find((item) => item && item.id === id);
  if (!user) {
    return id;
  }
  const nome = String(user.name || user.username || user.matricula || id).trim();
  const matricula = user.matricula ? ` (${user.matricula})` : "";
  return `${nome}${matricula}`.trim();
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

function shouldLogMaintenanceSync(item, projectId) {
  if (!MAINT_SYNC_DEBUG) {
    return false;
  }
  const flag = MAINT_SYNC_DEBUG.toLowerCase();
  if (flag === "1" || flag === "true" || flag === "all") {
    return true;
  }
  if (projectId && String(projectId) === MAINT_SYNC_DEBUG) {
    return true;
  }
  if (item && String(item.id || "") === MAINT_SYNC_DEBUG) {
    return true;
  }
  return false;
}

function logMaintenanceSync(label, payload) {
  if (!MAINT_SYNC_DEBUG) {
    return;
  }
  console.log(`[maintenance-sync] ${label}`, payload);
}

function summarizeMaintenanceSyncItem(item) {
  if (!item || typeof item !== "object") {
    return { id: "" };
  }
  const registro = item.registroExecucao || {};
  return {
    id: String(item.id || ""),
    status: normalizeStatus(item.status),
    updatedAt: item.updatedAt || "",
    doneAt: item.doneAt || "",
    executionFinishedAt: item.executionFinishedAt || "",
    executionStartedAt: item.executionStartedAt || "",
    registroAt:
      registro.registradoEm ||
      registro.registrado_em ||
      registro.executadoEm ||
      registro.executedAt ||
      "",
    conclusaoFim: item.conclusao ? item.conclusao.fim || "" : "",
  };
}

function getMaintenanceUpdatedAtValue(item) {
  if (!item || typeof item !== "object") {
    return 0;
  }
  const candidates = [
    item.updatedAt,
    item.doneAt,
    item.executionFinishedAt,
    item.executionStartedAt,
    item.concluidaEm,
    item.dataConclusao,
    item.createdAt,
  ];
  const times = candidates
    .map((value) => {
      if (!value) {
        return null;
      }
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
    })
    .filter((value) => Number.isFinite(value));
  return times.length ? Math.max(...times) : 0;
}

function isMeaningfulValue(value) {
  if (value === undefined || value === null) {
    return false;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return false;
    }
    const normalized = normalizeSearchValue(trimmed);
    const placeholders = new Set([
      "nao informado",
      "nao definido",
      "nao disponivel",
      "n/a",
      "na",
      "-",
      "--",
    ]);
    return !placeholders.has(normalized);
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}

function mergePreferMeaningful(primary, fallback) {
  if (!primary) {
    return fallback || null;
  }
  if (!fallback) {
    return primary || null;
  }
  if (Array.isArray(primary) || Array.isArray(fallback)) {
    return isMeaningfulValue(primary) ? primary : fallback;
  }
  if (typeof primary !== "object" || typeof fallback !== "object") {
    return isMeaningfulValue(primary) ? primary : fallback;
  }
  const merged = {};
  const keys = new Set([...Object.keys(primary), ...Object.keys(fallback)]);
  keys.forEach((key) => {
    const p = primary[key];
    const f = fallback[key];
    if (
      p &&
      f &&
      typeof p === "object" &&
      typeof f === "object" &&
      !Array.isArray(p) &&
      !Array.isArray(f)
    ) {
      merged[key] = mergePreferMeaningful(p, f);
      return;
    }
    if (isMeaningfulValue(p)) {
      merged[key] = p;
      return;
    }
    if (isMeaningfulValue(f)) {
      merged[key] = f;
      return;
    }
    merged[key] = p !== undefined ? p : f;
  });
  return merged;
}

function pickMaintenanceMerge(existing, incoming) {
  if (!existing && !incoming) {
    return null;
  }
  if (!existing) {
    return incoming;
  }
  if (!incoming) {
    return existing;
  }
  const existingStatus = normalizeStatus(existing.status);
  const incomingStatus = normalizeStatus(incoming.status);
  const existingTime = getMaintenanceUpdatedAtValue(existing);
  const incomingTime = getMaintenanceUpdatedAtValue(incoming);
  const mergedIncoming = mergePreferMeaningful(incoming, existing);
  const mergedExisting = mergePreferMeaningful(existing, incoming);
  if (existingStatus === "concluida" && incomingStatus !== "concluida") {
    const reopened = Boolean(incoming.reopenedAt || incoming.reopenedBy);
    if (!reopened) {
      return mergedExisting;
    }
    if (incomingTime && incomingTime > existingTime) {
      return mergedIncoming;
    }
    return mergedExisting;
  }
  if (incomingStatus === "concluida" && existingStatus !== "concluida") {
    const reopened = Boolean(existing.reopenedAt || existing.reopenedBy);
    if (reopened) {
      if (incomingTime && (!existingTime || incomingTime > existingTime)) {
        return mergedIncoming;
      }
      return mergedExisting;
    }
    return mergedIncoming;
  }
  if (incomingTime && (!existingTime || incomingTime > existingTime)) {
    return mergedIncoming;
  }
  if (existingTime && (!incomingTime || existingTime > incomingTime)) {
    return mergedExisting;
  }
  return mergedIncoming;
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

function hasExecucaoRegistrada(item) {
  if (!item) {
    return false;
  }
  const registro = item.registroExecucao || {};
  const registradoEm =
    registro.registradoEm ||
    registro.registrado_em ||
    registro.executadoEm ||
    registro.executedAt;
  const executadoPor = registro.executadoPor || registro.executedBy;
  const comentario = registro.comentario || registro.descricao || registro.resumo;
  const observacao = registro.observacaoExecucao || registro.observacao;
  const resultado = registro.resultado || registro.status;
  const evidencias = Array.isArray(registro.evidencias) && registro.evidencias.length > 0;
  const marcadorTopo =
    item.execucaoRegistradaEm || item.executionRegisteredAt || item.execucaoRegistradaAt;
  return Boolean(
    registradoEm || executadoPor || comentario || resultado || observacao || evidencias || marcadorTopo
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

function normalizeAnnouncementType(value) {
  const normalized = normalizeSearchValue(value);
  if (normalized.includes("alert")) {
    return "alerta";
  }
  if (normalized.includes("aviso")) {
    return "aviso";
  }
  return "info";
}

function normalizeAnnouncementSeverity(value) {
  const normalized = normalizeSearchValue(value);
  if (normalized.includes("crit")) {
    return "critica";
  }
  if (normalized.includes("alta")) {
    return "alta";
  }
  if (normalized.includes("med")) {
    return "media";
  }
  return "baixa";
}

function normalizeAnnouncementImage(entry) {
  if (!entry) {
    return null;
  }
  if (typeof entry === "string") {
    const src = entry.trim();
    return src ? { src, name: "" } : null;
  }
  if (typeof entry === "object") {
    const src = String(entry.src || entry.url || entry.dataUrl || entry.data || "").trim();
    if (!src) {
      return null;
    }
    return {
      src,
      name: String(entry.name || entry.filename || "").trim(),
    };
  }
  return null;
}

function normalizeAnnouncementRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }
  const title = String(record.title || record.titulo || "").trim();
  const message = String(record.message || record.mensagem || record.text || "").trim();
  if (!title && !message) {
    return null;
  }
  const scope = String(record.scope || "").trim() || (record.projectId || record.project ? "project" : "all");
  const projectId = String(record.projectId || record.project || "").trim();
  if (scope === "project" && !projectId) {
    return null;
  }
  const images = Array.isArray(record.images || record.fotos || record.photos || record.imagens)
    ? (record.images || record.fotos || record.photos || record.imagens)
        .map((item) => normalizeAnnouncementImage(item))
        .filter(Boolean)
    : [];
  const readByRaw = Array.isArray(record.readBy || record.reads || record.lidos)
    ? record.readBy || record.reads || record.lidos
    : [];
  const readBy = readByRaw
    .map((entry) => {
      if (!entry) {
        return null;
      }
      if (typeof entry === "string") {
        return { userId: entry };
      }
      if (typeof entry === "object") {
        return {
          userId: entry.userId || entry.id || entry.user || "",
          readAt: entry.readAt || entry.at || entry.date || "",
        };
      }
      return null;
    })
    .filter((entry) => entry && entry.userId);
  const createdAt = record.createdAt || record.created || new Date().toISOString();
  return {
    id: record.id ? String(record.id) : crypto.randomUUID(),
    title: title || "Anúncio",
    message,
    type: normalizeAnnouncementType(record.type || record.tipo || "info"),
    severity: normalizeAnnouncementSeverity(record.severity || record.criticidade || "baixa"),
    scope,
    projectId,
    projectLabel: String(record.projectLabel || record.projectName || "").trim(),
    images,
    readBy,
    createdAt,
    createdBy: record.createdBy || record.authorId || record.userId || "",
    createdByName: record.createdByName || record.authorName || record.userName || "",
    senderRank: Number.isFinite(record.senderRank) ? record.senderRank : undefined,
    senderRoleLabel: record.senderRoleLabel || record.senderRole || record.roleLabel || "",
  };
}

function getUserHierarchyRank(user) {
  if (!user) {
    return 99;
  }
  const role = String(user.rbacRole || user.role || "").trim().toLowerCase();
  const cargo = normalizeSearchValue(user.cargo || user.roleName || "");
  if (role === "admin" || role === "gestor" || cargo.includes("admin")) {
    return 0;
  }
  if (
    role === "diretor_om" ||
    role === "gerente_contrato" ||
    cargo.includes("diretor") ||
    cargo.includes("gerente") ||
    cargo.includes("coordenador")
  ) {
    return 1;
  }
  if (
    role === "supervisor" ||
    role === "supervisor_om" ||
    role === "pcm" ||
    cargo.includes("supervisor") ||
    cargo.includes("pcm")
  ) {
    return 2;
  }
  return 3;
}

function getAnnouncementSenderRank(record) {
  if (record && Number.isFinite(record.senderRank)) {
    return record.senderRank;
  }
  const roleLabel = normalizeSearchValue(record && record.senderRoleLabel);
  if (roleLabel.includes("admin")) {
    return 0;
  }
  if (roleLabel.includes("diretor") || roleLabel.includes("gerente") || roleLabel.includes("coordenador")) {
    return 1;
  }
  if (roleLabel.includes("supervisor") || roleLabel.includes("pcm")) {
    return 2;
  }
  return 3;
}

function canReceiveAnnouncement(record, user) {
  if (!record || !user) {
    return false;
  }
  if (record.scope === "project" && record.projectId) {
    if (!userHasProjectAccess(user, record.projectId)) {
      return false;
    }
  }
  if (record.createdBy && user.id && String(record.createdBy) === String(user.id)) {
    return true;
  }
  const senderRank = getAnnouncementSenderRank(record);
  const userRank = getUserHierarchyRank(user);
  return userRank >= senderRank;
}

function loadAnnouncements() {
  const data = readJson(ANNOUNCEMENTS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item) => normalizeAnnouncementRecord(item)).filter(Boolean);
}

function saveAnnouncements(list) {
  writeJson(ANNOUNCEMENTS_FILE, Array.isArray(list) ? list : []);
}

function normalizeFeedbackRecord(record) {
  if (!record || typeof record !== "object") {
    return null;
  }
  const projectId = String(record.projectId || "").trim();
  const from = String(record.from || record.fromId || record.senderId || "").trim();
  const to = String(record.to || record.toId || record.receiverId || "").trim();
  const message = String(record.message || record.text || "").trim();
  if (!projectId || !from || !to || !message) {
    return null;
  }
  const createdAt = record.createdAt || new Date().toISOString();
  return {
    id: record.id ? String(record.id) : crypto.randomUUID(),
    projectId,
    from,
    to,
    score: Number(record.score) || 0,
    message,
    createdAt,
    readAt: record.readAt || "",
    fromName: String(record.fromName || "").trim(),
    toName: String(record.toName || "").trim(),
  };
}

function loadFeedbacks() {
  const data = readJson(FEEDBACKS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item) => normalizeFeedbackRecord(item)).filter(Boolean);
}

function saveFeedbacks(list) {
  writeJson(FEEDBACKS_FILE, Array.isArray(list) ? list : []);
}

function getDefaultCompatState() {
  const datasets = {};
  COMPAT_DATASETS.forEach((key) => {
    datasets[key] = 0;
  });
  return {
    schemaVersion: COMPAT_SCHEMA_VERSION,
    datasets,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeCompatState(state) {
  const base = getDefaultCompatState();
  if (!state || typeof state !== "object") {
    return base;
  }
  const schemaVersion = Number(state.schemaVersion) || COMPAT_SCHEMA_VERSION;
  const datasets =
    state.datasets && typeof state.datasets === "object" ? state.datasets : {};
  COMPAT_DATASETS.forEach((key) => {
    if (!Number.isFinite(Number(datasets[key]))) {
      datasets[key] = 0;
    }
  });
  return {
    schemaVersion,
    datasets: { ...datasets },
    updatedAt: String(state.updatedAt || base.updatedAt || ""),
  };
}

function loadCompatState() {
  const data = readJson(COMPAT_FILE, null);
  return normalizeCompatState(data);
}

function saveCompatState(state) {
  writeJson(COMPAT_FILE, normalizeCompatState(state));
}

function touchCompat(dataset, projectId = "") {
  if (!dataset) {
    return;
  }
  const next = normalizeCompatState(compatState);
  next.datasets[dataset] = Number(next.datasets[dataset] || 0) + 1;
  next.updatedAt = new Date().toISOString();
  compatState = next;
  saveCompatState(next);
  broadcastSse("compat.updated", {
    dataset,
    version: next.datasets[dataset],
    projectId: projectId || "",
  });
}

function normalizeSstDoc(record) {
  if (!record || typeof record !== "object") {
    return null;
  }
  const createdAt = record.createdAt || new Date().toISOString();
  const status = record.status ? String(record.status).toUpperCase() : "PENDENTE";
  const projectId = String(record.projectId || "").trim();
  const activity = String(record.activity || record.activityName || "").trim();
  if (!projectId || !activity) {
    return null;
  }
  return {
    id: record.id ? String(record.id) : crypto.randomUUID(),
    activity,
    projectId,
    responsibleId: record.responsibleId || record.createdBy || "",
    aprCode: record.aprCode || "",
    aprDoc: record.aprDoc || record.apr || null,
    attachments: Array.isArray(record.attachments) ? record.attachments.filter(Boolean) : [],
    status,
    notes: record.notes || "",
    createdAt,
    createdBy: record.createdBy || record.responsibleId || "",
    reviewedAt: record.reviewedAt || "",
    reviewedBy: record.reviewedBy || "",
    reviewNotes: record.reviewNotes || "",
    correctionInstructions: record.correctionInstructions || "",
    notifiedAt: record.notifiedAt || "",
    source: record.source || "manual",
    relatedId: record.relatedId || "",
    updatedAt: record.updatedAt || createdAt,
  };
}

function loadSstDocs() {
  const data = readJson(SST_DOCS_FILE, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map((item) => normalizeSstDoc(item)).filter(Boolean);
}

function saveSstDocs(list) {
  writeJson(SST_DOCS_FILE, Array.isArray(list) ? list : []);
}

function getAutomationEmailKey(event, item) {
  const id = item && item.id ? String(item.id) : "";
  if (!id) {
    return "";
  }
  return `${event}:${id}`;
}

function shouldSkipAutomationEmail(key) {
  if (!key) {
    return false;
  }
  const now = Date.now();
  const last = automationEmailDedup.get(key);
  if (!last) {
    return false;
  }
  if (now - last < AUTOMATION_EMAIL_DEDUP_TTL_MS) {
    return true;
  }
  automationEmailDedup.delete(key);
  return false;
}

function markAutomationEmailSent(key) {
  if (!key) {
    return;
  }
  automationEmailDedup.set(key, Date.now());
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
  const emailSentInRun = new Set();
  for (const automation of automations) {
    if (!automation.enabled || automation.event !== event) {
      continue;
    }
    const actionType =
      automation && automation.action && automation.action.type ? automation.action.type : "";
    for (const item of items) {
      if (automation.projectId && item && item.projectId !== automation.projectId) {
        continue;
      }
      if (!matchesAutomationCondition(automation, item)) {
        continue;
      }
      if (actionType === "notify_email") {
        const dedupKey = getAutomationEmailKey(event, item);
        if (!dedupKey) {
          continue;
        }
        if (emailSentInRun.has(dedupKey) || shouldSkipAutomationEmail(dedupKey)) {
          continue;
        }
      }
      const result = await executeAutomationAction(automation, item, actor);
      if (actionType === "notify_email") {
        const dedupKey = getAutomationEmailKey(event, item);
        if (result && result.status === "ok") {
          emailSentInRun.add(dedupKey);
          markAutomationEmailSent(dedupKey);
        }
      }
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

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseTeamName(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (raw.startsWith("team:")) {
    return raw.slice(5).trim();
  }
  if (raw.startsWith("time:")) {
    return raw.slice(5).trim();
  }
  return raw;
}

function getMaintenanceTeamName(item) {
  if (!item || typeof item !== "object") {
    return "";
  }
  const direct = parseTeamName(
    item.equipeResponsavel || item.teamResponsavel || item.timeResponsavel || ""
  );
  if (direct) {
    return direct;
  }
  const fromLiberacao =
    item.liberacao && parseTeamName(item.liberacao.equipeResponsavel || "");
  if (fromLiberacao) {
    return fromLiberacao;
  }
  const candidates = [
    item.executadaPor,
    item.responsavel,
    item.responsavelManutencao,
    item.registroExecucao && item.registroExecucao.executadoPor,
  ];
  for (const candidate of candidates) {
    const raw = String(candidate || "").trim();
    if (!raw) {
      continue;
    }
    if (raw.startsWith("team:") || raw.startsWith("time:")) {
      return parseTeamName(raw);
    }
  }
  return "";
}

function shouldNotifyProjectTeam(item) {
  return Boolean(getMaintenanceTeamName(item));
}

function getProjectParticipantUsers(projectId) {
  if (!projectId) {
    return [];
  }
  const ids = new Set(
    projectUsers
      .filter((entry) => entry && entry.projectId === projectId && entry.userId)
      .map((entry) => String(entry.userId))
  );
  let list = users.filter((user) => {
    if (!user || !user.id) {
      return false;
    }
    if (ids.size) {
      return ids.has(String(user.id));
    }
    return String(user.projectId || "") === projectId;
  });
  if (!ids.size && !list.length) {
    list = users.filter((user) => user && userHasProjectAccess(user, projectId));
  }
  return list;
}

function hasAccessRoleConfig(user) {
  if (!user) {
    return false;
  }
  if (Array.isArray(user.accessPermissions) && user.accessPermissions.length) {
    return true;
  }
  if (Array.isArray(user.rolePermissions) && user.rolePermissions.length) {
    return true;
  }
  const role =
    (user.roleId && getAccessRoleById(user.roleId)) ||
    getAccessRoleByName(user.roleName || user.cargo || user.role);
  return Boolean(role);
}

function canUserReceiveMaintenanceEmail(user) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user) || isFullAccessRole(user.rbacRole || user.role)) {
    return true;
  }
  if (!hasAccessRoleConfig(user)) {
    return true;
  }
  const access = new Set(getAccessPermissionsForUser(user));
  if (access.has("ADMIN")) {
    return true;
  }
  return access.has(MAINTENANCE_TEAM_EMAIL_PERMISSION);
}

async function sendMaintenanceCreatedEmail({ to, subject, text, html, meta }) {
  if (!isValidEmail(to)) {
    return false;
  }
  const resendOk = await sendEmailViaResend({ to, subject, text, html });
  if (resendOk) {
    return true;
  }
  const smtpOk = await sendEmailViaSmtp({ to, subject, text, html });
  if (smtpOk) {
    return true;
  }
  console.warn("Aviso de nova manutencao sem envio de email.");
  console.log(`[maintenance-email] ${subject} -> ${to}`, meta || {});
  return false;
}

async function notifyProjectTeamMaintenanceCreated(items, actor, ip, projectId) {
  if (!Array.isArray(items) || !items.length) {
    return;
  }
  const recipientsCache = new Map();
  for (const item of items) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const itemProjectId = String(item.projectId || projectId || "").trim();
    if (!itemProjectId) {
      continue;
    }
    let recipients = recipientsCache.get(itemProjectId);
    if (!recipients) {
      recipients = getProjectParticipantUsers(itemProjectId);
      recipientsCache.set(itemProjectId, recipients);
    }
    if (!recipients.length) {
      continue;
    }
    const project = getProjectById(itemProjectId);
    const projectLabel = project ? getProjectLabel(project) : itemProjectId;
    const projectTeam = project
      ? String(project.nomeTime || project.timeName || project.time || "").trim()
      : "";
    const teamName = getMaintenanceTeamName(item) || projectTeam;
    if (!teamName) {
      continue;
    }
    const title = getItemTitle(item);
    const due = getDueDate(item);
    const dueLabel = due ? due.toLocaleDateString("pt-BR") : "-";
    const equipamento = getEquipmentLabel(item, itemProjectId);
    const osRef = String(item.osReferencia || item.osNumero || item.referencia || "").trim();
    const createdBy = item.createdBy
      ? getUserLabel(item.createdBy)
      : actor
        ? getUserLabel(actor.id)
        : "-";
    const subject = `OPSCOPE - Nova manutenção criada (${projectLabel})`;
    const text = `Uma nova manutenção foi criada no projeto ${projectLabel}.\n\nAtividade: ${title}\nPrazo: ${dueLabel}\nEquipe: ${teamName}\nEquipamento: ${equipamento}\nOS/Referência: ${
      osRef || "-"
    }\nCriada por: ${createdBy}\n\nAcesse o OPSCOPE para detalhes.`;
    const html = `
      <p>Uma nova manutenção foi criada no projeto <strong>${escapeHtml(projectLabel)}</strong>.</p>
      <p><strong>Atividade:</strong> ${escapeHtml(title)}</p>
      <p><strong>Prazo:</strong> ${escapeHtml(dueLabel)}</p>
      <p><strong>Equipe:</strong> ${escapeHtml(teamName)}</p>
      <p><strong>Equipamento:</strong> ${escapeHtml(equipamento)}</p>
      <p><strong>OS/Referência:</strong> ${escapeHtml(osRef || "-")}</p>
      <p><strong>Criada por:</strong> ${escapeHtml(createdBy)}</p>
      <p>Acesse o OPSCOPE para detalhes.</p>
    `;
    for (const recipient of recipients) {
      if (!recipient || getUserStatus(recipient) === "INATIVO") {
        continue;
      }
      if (!canUserReceiveMaintenanceEmail(recipient)) {
        continue;
      }
      const to = getUserEmail(recipient);
      if (!isValidEmail(to)) {
        continue;
      }
      const itemId = String(item.id || "").trim();
      const userId = String(recipient.id || "").trim();
      const dedupKey =
        itemId && userId
          ? `${MAINTENANCE_TEAM_EMAIL_DEDUP_PREFIX}:${itemId}:${userId}`
          : "";
      if (dedupKey && shouldSkipAutomationEmail(dedupKey)) {
        continue;
      }
      const sent = await sendMaintenanceCreatedEmail({
        to,
        subject,
        text,
        html,
        meta: { itemId, userId, projectId: itemProjectId },
      });
      if (sent && dedupKey) {
        markAutomationEmailSent(dedupKey);
        appendAudit(
          "maintenance_email_sent",
          actor ? actor.id : null,
          { manutencaoId: itemId, projectId: itemProjectId, to },
          ip || "unknown",
          itemProjectId
        );
      }
    }
  }
}

function loadMaintenanceData() {
  const data = readJson(MAINTENANCE_FILE, []);
  return Array.isArray(data) ? data : [];
}

function loadMaintenanceTemplates() {
  const data = readJson(MAINTENANCE_TEMPLATES_FILE, []);
  return Array.isArray(data) ? data : [];
}

function saveMaintenanceTemplates(list) {
  writeJson(MAINTENANCE_TEMPLATES_FILE, Array.isArray(list) ? list : []);
}

function normalizeMaintenanceTemplateRecord(record, projectId) {
  if (!record || typeof record !== "object") {
    return null;
  }
  const id = String(record.id || "").trim() || crypto.randomUUID();
  const nome = String(record.nome || record.name || "").trim();
  if (!nome) {
    return null;
  }
  const createdAt = record.createdAt || new Date().toISOString();
  const updatedAt = record.updatedAt || createdAt;
  return {
    ...record,
    id,
    nome,
    projectId,
    createdAt,
    updatedAt,
  };
}

function getMaintenanceRecurrenceKey(item) {
  if (!item || !item.templateId || !item.data) {
    return "";
  }
  const projectId = String(item.projectId || "").trim();
  const templateId = String(item.templateId || "").trim();
  const date = String(item.data || "").trim();
  if (!templateId || !date) {
    return "";
  }
  return `${projectId}::${templateId}::${date}`;
}

function dedupeMaintenanceRecords(list, projectId = "") {
  if (!Array.isArray(list) || list.length === 0) {
    return { list: Array.isArray(list) ? list : [], changed: false };
  }
  const output = [];
  const indexMap = new Map();
  let changed = false;
  list.forEach((item) => {
    if (!item || typeof item !== "object") {
      output.push(item);
      return;
    }
    if (projectId && String(item.projectId || "") !== String(projectId)) {
      output.push(item);
      return;
    }
    const key = getMaintenanceRecurrenceKey(item);
    if (!key) {
      output.push(item);
      return;
    }
    const existingIndex = indexMap.get(key);
    if (existingIndex === undefined) {
      indexMap.set(key, output.length);
      output.push(item);
      return;
    }
    const existing = output[existingIndex];
    const merged = pickMaintenanceMerge(existing, item);
    output[existingIndex] = merged;
    changed = true;
  });
  return { list: output, changed };
}

function loadMaintenanceTombstones() {
  const data = readJson(MAINTENANCE_TOMBSTONES_FILE, []);
  return Array.isArray(data) ? data : [];
}

function saveMaintenanceTombstones(list) {
  writeJson(MAINTENANCE_TOMBSTONES_FILE, Array.isArray(list) ? list : []);
}

function getMaintenanceTombstonesMap(projectId) {
  const map = new Map();
  loadMaintenanceTombstones().forEach((entry) => {
    if (!entry || !entry.id) {
      return;
    }
    if (projectId && entry.projectId && entry.projectId !== projectId) {
      return;
    }
    map.set(String(entry.id), entry);
  });
  return map;
}

function addMaintenanceTombstone(projectId, maintenanceId, userId) {
  if (!maintenanceId || !projectId) {
    return null;
  }
  const list = loadMaintenanceTombstones();
  const filtered = list.filter(
    (entry) =>
      !(
        entry &&
        String(entry.id || "") === maintenanceId &&
        String(entry.projectId || "") === projectId
      )
  );
  const entry = {
    id: maintenanceId,
    projectId,
    deletedAt: new Date().toISOString(),
    deletedBy: userId || null,
  };
  filtered.push(entry);
  saveMaintenanceTombstones(filtered);
  return entry;
}

const RDO_AI_SCHEMA = {
  name: "rdo_text",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      descricao_consolidada: { type: "string" },
      atividades_consolidado: {
        type: "object",
        additionalProperties: false,
        properties: {
          local: { type: "string" },
          subestacao: { type: "string" },
          atividade_do_dia: { type: "string" },
          status_geral: { type: "string" },
          equipamentos: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                nome: { type: "string" },
                tipo: { type: "string" },
                status: { type: "string" },
              },
              required: ["nome", "tipo", "status"],
            },
          },
        },
        required: ["local", "subestacao", "atividade_do_dia", "status_geral", "equipamentos"],
      },
    },
    required: ["descricao_consolidada", "atividades_consolidado"],
  },
};

const RDO_AI_PROMPT_VERSION = String(process.env.OPSCOPE_RDO_AI_PROMPT_VERSION || "v3");

const RDO_STATUS_LABELS = {
  concluida: "Concluída",
  em_execucao: "Em execução",
  encerramento: "Encerramento",
  backlog: "Backlog",
  liberada: "Liberada",
  agendada: "Planejada",
  cancelada: "Cancelada",
};

function formatDurationMin(totalMin) {
  if (!Number.isFinite(totalMin) || totalMin <= 0) {
    return "nao informado";
  }
  const horas = Math.floor(totalMin / 60);
  const minutos = Math.round(totalMin % 60);
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
}

function getRdoCacheKey(projectId, dateStr) {
  return `${RDO_AI_PROMPT_VERSION}:${projectId || ""}:${dateStr || ""}`;
}

function getRdoCache(projectId, dateStr) {
  const key = getRdoCacheKey(projectId, dateStr);
  const entry = rdoAiCache.get(key);
  if (!entry) {
    return null;
  }
  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    rdoAiCache.delete(key);
    return null;
  }
  return entry.data || null;
}

function setRdoCache(projectId, dateStr, data) {
  const key = getRdoCacheKey(projectId, dateStr);
  rdoAiCache.set(key, {
    data,
    expiresAt: Date.now() + RDO_AI_CACHE_TTL_MS,
  });
}

function normalizeStatusLabel(status) {
  const key = normalizeStatus(status);
  return RDO_STATUS_LABELS[key] || "nao informado";
}

function getEquipmentLabel(item, projectId) {
  if (!item || typeof item !== "object") {
    return "nao informado";
  }
  const equipmentObj = item.equipamento || null;
  if (equipmentObj && typeof equipmentObj === "object") {
    const tag = equipmentObj.tag || "";
    const nome = equipmentObj.nome || equipmentObj.name || "";
    if (tag || nome) {
      return `${tag ? `${tag} - ` : ""}${nome}`.trim() || "nao informado";
    }
    if (equipmentObj.id) {
      const match = equipamentos.find(
        (equip) => equip && equip.id === equipmentObj.id && equip.projectId === projectId
      );
      if (match) {
        return `${match.tag ? `${match.tag} - ` : ""}${match.nome || ""}`.trim() || "nao informado";
      }
      return equipmentObj.id;
    }
  }
  if (typeof item.equipamento === "string" && item.equipamento.trim()) {
    return item.equipamento.trim();
  }
  const equipamentoId =
    item.equipamentoId ||
    (item.conclusao && item.conclusao.equipamentoId) ||
    "";
  if (equipamentoId) {
    const match = equipamentos.find(
      (equip) => equip && equip.id === equipamentoId && equip.projectId === projectId
    );
    if (match) {
      return `${match.tag ? `${match.tag} - ` : ""}${match.nome || ""}`.trim() || equipamentoId;
    }
    return equipamentoId;
  }
  return "nao informado";
}

function getMaintenanceDateCandidates(item) {
  const candidates = [
    item.executionStartedAt,
    item.executionFinishedAt,
    item.doneAt,
    item.concluidaEm,
    item.dataConclusao,
    item.createdAt,
  ];
  if (item.conclusao) {
    candidates.push(item.conclusao.inicio, item.conclusao.fim);
  }
  return candidates
    .map((value) => parseDateTime(value))
    .filter((date) => date && !Number.isNaN(date.getTime()));
}

function isMaintenanceInRange(item, inicio, fim) {
  const candidates = getMaintenanceDateCandidates(item);
  return candidates.some((date) => date >= inicio && date < fim);
}

function normalizePersonLabel(label) {
  return String(label || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function dedupeLabels(list) {
  const seen = new Set();
  const output = [];
  list.forEach((label) => {
    const normalized = normalizePersonLabel(label);
    if (!normalized || seen.has(normalized)) {
      return;
    }
    seen.add(normalized);
    output.push(label);
  });
  return output;
}

function normalizeForMatch(texto) {
  if (!texto) {
    return "";
  }
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function classifyEquipmentGroup(name) {
  const base = normalizeForMatch(name);
  if (!base) {
    return "";
  }
  if (base.includes("SERVICOS AUXILIARES") || /\bTSA-\d+\b/.test(base)) {
    return "Transformadores de serviços auxiliares";
  }
  if (base.includes("POTENCIA") || /\bT-\d+\b/.test(base)) {
    return "Transformadores de potência";
  }
  if (base.includes("TRANSFORMADOR")) {
    return "Transformadores";
  }
  return "Equipamentos";
}

function extractEquipmentTag(name) {
  const base = normalizeForMatch(name);
  if (!base) {
    return "";
  }
  const match =
    base.match(/\bTSA-\d+\b/) ||
    base.match(/\bT-\d+\b/) ||
    base.match(/\bTR-\d+\b/) ||
    base.match(/\bTRA-\d+\b/);
  return match ? match[0] : "";
}

function buildEquipamentosResumo(atividades) {
  const equipamentos = Array.from(
    new Set(
      (atividades || [])
        .map((item) => (item && item.equipamento ? String(item.equipamento).trim() : ""))
        .filter(Boolean)
    )
  );
  const gruposMap = new Map();
  const tags = new Set();
  equipamentos.forEach((nome) => {
    const tipo = classifyEquipmentGroup(nome) || "Equipamentos";
    const tag = extractEquipmentTag(nome);
    if (tag) {
      tags.add(tag);
    }
    if (!gruposMap.has(tipo)) {
      gruposMap.set(tipo, { tipo, quantidade: 0, tags: new Set(), nomes: [] });
    }
    const grupo = gruposMap.get(tipo);
    grupo.quantidade += 1;
    if (tag) {
      grupo.tags.add(tag);
    }
    grupo.nomes.push(nome);
  });
  const grupos = Array.from(gruposMap.values()).map((grupo) => ({
    tipo: grupo.tipo,
    quantidade: grupo.quantidade,
    tags: Array.from(grupo.tags),
    nomes: grupo.nomes,
  }));
  return {
    total: equipamentos.length,
    tags: Array.from(tags),
    grupos,
  };
}

function getAcaoPrincipal(atividades) {
  const acoes = Array.from(
    new Set(
      (atividades || [])
        .map((item) => (item && item.acao ? String(item.acao).trim() : ""))
        .filter(Boolean)
    )
  );
  if (acoes.length === 1) {
    return acoes[0];
  }
  if (acoes.length > 1 && acoes.length <= 2) {
    return acoes.join(" / ");
  }
  return "Atividades de manutenção";
}

function buildRdoPayload(dateStr, projectId) {
  const base = parseDateOnly(dateStr) || startOfDay(new Date());
  const inicio = startOfDay(base);
  const fim = addDays(inicio, 1);
  const project = getProjectById(projectId);
  const local = project ? getProjectLabel(project) : "nao informado";
  const list = loadMaintenanceData().filter(
    (item) => item && item.projectId === projectId && isMaintenanceInRange(item, inicio, fim)
  );
  const atividades = list.map((item) => {
    const statusLabel = normalizeStatusLabel(item.status);
    const equipamento = getEquipmentLabel(item, projectId);
    const tipo =
      item.categoria ||
      item.tipo ||
      item.tipoManutencao ||
      item.tipo_atividade ||
      "nao informado";
    const descricaoBreve =
      (item.conclusao && item.conclusao.descricaoBreve) ||
      (item.registroExecucao && item.registroExecucao.descricaoBreve) ||
      "";
    const acao =
      item.titulo ||
      (item.registroExecucao && item.registroExecucao.comentario) ||
      (item.conclusao && item.conclusao.comentario) ||
      item.observacao ||
      "nao informado";
    return {
      equipamento: equipamento || "nao informado",
      tipo: tipo || "nao informado",
      acao: acao || "nao informado",
      descricao_breve: descricaoBreve || "",
      status: statusLabel || "nao informado",
    };
  });
  const statusKeys = list.map((item) => normalizeStatus(item.status));
  const concluidas = statusKeys.filter((status) => status === "concluida").length;
  const execucao = statusKeys.filter(
    (status) => status === "em_execucao" || status === "encerramento"
  ).length;
  const pendentes = statusKeys.filter(
    (status) => status !== "concluida" && status !== "em_execucao" && status !== "encerramento"
  ).length;
  const duracoes = list.map((item) => {
    if (item && item.conclusao && Number.isFinite(item.conclusao.duracaoMin)) {
      return item.conclusao.duracaoMin;
    }
    const start = parseDateTime(item.executionStartedAt);
    const end =
      parseDateTime(item.executionFinishedAt) || parseDateTime(item.doneAt);
    if (start && end) {
      return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
    }
    return 0;
  });
  const tempoTotalMin = duracoes.reduce((acc, val) => acc + (Number.isFinite(val) ? val : 0), 0);
  const responsaveis = dedupeLabels(
    list
      .map((item) => item && (item.doneBy || item.createdBy || item.executedBy || ""))
      .filter(Boolean)
      .map((id) => getUserLabel(id))
  );
  const participantes = dedupeLabels(
    list
      .flatMap((item) => {
        if (item && Array.isArray(item.participantes)) {
          return item.participantes;
        }
        if (item && item.conclusao && Array.isArray(item.conclusao.participantes)) {
          return item.conclusao.participantes;
        }
        return [];
      })
      .filter(Boolean)
      .map((id) => getUserLabel(id))
  );
  const subestacoes = list
    .map((item) => item.local || item.subestacao || item.substation || "")
    .filter(Boolean);
  const subestacao = local || (subestacoes[0] || "nao informado");
  const equipamentosResumo = buildEquipamentosResumo(atividades);
  const acaoPrincipal = getAcaoPrincipal(atividades);
  return {
    date: formatDateISO(inicio),
    local: local || "nao informado",
    subestacao,
    subestacoes_detalhe: Array.from(new Set(subestacoes)),
    kpis: {
      registradas: atividades.length,
      concluidas,
      execucao,
      pendentes,
      tempo_total: formatDurationMin(tempoTotalMin),
    },
    responsavel: responsaveis.length ? responsaveis.join("; ") : "nao informado",
    participantes: participantes.length ? participantes.join("; ") : "nao informado",
    acao_principal: acaoPrincipal,
    equipamentos_resumo: equipamentosResumo,
    atividades,
  };
}

function generateRdoTextDeterministic(payload) {
  const kpis = payload.kpis || {};
  const registradas = Number.isFinite(kpis.registradas) ? kpis.registradas : "nao informado";
  const concluidas = Number.isFinite(kpis.concluidas) ? kpis.concluidas : "nao informado";
  const execucao = Number.isFinite(kpis.execucao) ? kpis.execucao : "nao informado";
  const pendentes = Number.isFinite(kpis.pendentes) ? kpis.pendentes : "nao informado";
  const responsavel = payload.responsavel || "nao informado";
  const participantes = payload.participantes || "nao informado";
  const acaoPrincipal = payload.acao_principal || "Atividades de manutencao";
  const subestacao = payload.subestacao || payload.local || "nao informado";
  const equipamentosResumo = payload.equipamentos_resumo || {};
  const grupos = Array.isArray(equipamentosResumo.grupos) ? equipamentosResumo.grupos : [];
  const gruposLabel = grupos.length
    ? grupos.map((grupo) => grupo.tipo).join(" e ")
    : "equipamentos";
  const quantidade = Number.isFinite(equipamentosResumo.total)
    ? equipamentosResumo.total
    : registradas;
  const descricao =
    `Foram registradas ${registradas} atividades no periodo, com ${concluidas} concluidas, ` +
    `${execucao} em execucao e ${pendentes} pendentes. ` +
    `${acaoPrincipal} em ${subestacao}, atendendo ${quantidade} ${gruposLabel}. ` +
    `Responsavel: ${responsavel}. Participantes: ${participantes}.`;

  const atividades = Array.isArray(payload.atividades) ? payload.atividades : [];
  const atividadeDoDia =
    payload.acao_principal ||
    (atividades.length === 1 ? atividades[0].acao || "Atividade do dia" : "Atividades do dia");
  let statusGeral = "Em andamento";
  if (concluidas !== "nao informado" && registradas === concluidas) {
    statusGeral = "Concluida";
  } else if (execucao !== "nao informado" && Number(execucao) > 0) {
    statusGeral = "Em execucao";
  } else if (pendentes !== "nao informado" && Number(pendentes) > 0) {
    statusGeral = "Pendentes";
  }
  const equipamentos = atividades.map((item) => ({
    nome: item.equipamento || "nao informado",
    tipo: item.tipo || "nao informado",
    status: item.status || "nao informado",
  }));
  const equipamentosUnicos = Array.from(
    new Map(
      equipamentos.map((equip) => [
        `${equip.nome}|${equip.tipo}|${equip.status}`,
        equip,
      ])
    ).values()
  );
  return {
    descricao_consolidada: descricao,
    atividades_consolidado: {
      local: payload.local || "nao informado",
      subestacao: payload.subestacao || "nao informado",
      atividade_do_dia: atividadeDoDia || "nao informado",
      status_geral: statusGeral || "nao informado",
      equipamentos: equipamentosUnicos.length
        ? equipamentosUnicos
        : [{ nome: "nao informado", tipo: "nao informado", status: "nao informado" }],
    },
  };
}

function extractOpenAiOutputText(data) {
  if (!data) {
    return "";
  }
  if (typeof data.output_text === "string") {
    return data.output_text;
  }
  const output = Array.isArray(data.output) ? data.output : [];
  for (const item of output) {
    const content = Array.isArray(item && item.content) ? item.content : [];
    for (const part of content) {
      if (part && (part.type === "output_text" || part.type === "text") && part.text) {
        return part.text;
      }
    }
  }
  return "";
}

function isValidRdoAiResult(result) {
  if (!result || typeof result !== "object") {
    return false;
  }
  if (typeof result.descricao_consolidada !== "string") {
    return false;
  }
  const atividades = result.atividades_consolidado;
  if (!atividades || typeof atividades !== "object") {
    return false;
  }
  if (
    typeof atividades.local !== "string" ||
    typeof atividades.subestacao !== "string" ||
    typeof atividades.atividade_do_dia !== "string" ||
    typeof atividades.status_geral !== "string"
  ) {
    return false;
  }
  if (!Array.isArray(atividades.equipamentos)) {
    return false;
  }
  return true;
}

async function generateRdoTextWithAI(payload) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY nao configurada.");
  }
  if (typeof fetch !== "function") {
    throw new Error("Fetch indisponivel no ambiente.");
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
  const systemPrompt =
    "Voce e um redator tecnico de RDO (PT-BR). Escreva com tom formal, direto e com autoridade. " +
    "Use APENAS os dados do JSON informado. Nao invente numeros, locais, datas ou tempos. " +
    "Se algo faltar, escreva 'nao informado'. Evite repeticoes e frases genericas. " +
    "Nao inicie com 'Relatorio Diario' ou 'RDO'. Nao repita cabecalhos. " +
    "Use 'subestacao' como referencia de local. Ignore 'local' se estiver redundante. " +
    "Se houver grupos em 'equipamentos_resumo.grupos', cite todos os grupos presentes (ex: potencia e servicos auxiliares). " +
    "Se houver tags em 'equipamentos_resumo.tags', mencione os tags (T-01, T-02, TSA-01...) na descricao. " +
    "Se houver 'atividades[].descricao_breve', use como base principal para a descricao consolidada. " +
    "Nao mencione tempo total. " +
    "descricao_consolidada: 2 a 4 frases curtas, sem listar equipamentos um a um; foque na atividade principal, escopo e status. " +
    "atividades_consolidado.atividade_do_dia: frase objetiva (ate 16 palavras) baseada em 'acao_principal' e grupos. " +
    "status_geral: use Concluida / Em execucao / Pendentes / Em andamento. " +
    "Responda estritamente no formato do schema.";
  const userPrompt = `Dados do RDO (JSON): ${JSON.stringify(payload)}`;
  const body = {
    model: OPENAI_MODEL,
    input: [
      { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
      { role: "user", content: [{ type: "input_text", text: userPrompt }] },
    ],
    text: {
      format: {
        type: "json_schema",
        name: RDO_AI_SCHEMA.name,
        strict: RDO_AI_SCHEMA.strict,
        schema: RDO_AI_SCHEMA.schema,
      },
    },
    temperature: 0.2,
  };
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) {
      const message =
        data && data.error && data.error.message ? data.error.message : "Falha ao gerar RDO.";
      throw new Error(message);
    }
    const text = extractOpenAiOutputText(data);
    if (!text) {
      throw new Error("Resposta da IA vazia.");
    }
    const parsed = JSON.parse(text);
    if (!isValidRdoAiResult(parsed)) {
      throw new Error("Resposta da IA invalida.");
    }
    return parsed;
  } finally {
    clearTimeout(timeoutId);
  }
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
    gestor: "gestor",
    admin: "admin",
    almoxarife: "almoxarife",
    tecnico_sst: "tecnico_sst",
    tecnicosst: "tecnico_sst",
    tecnico_senior: "tecnico_senior",
    tecnicosenior: "tecnico_senior",
    tecnico_pleno: "tecnico_pleno",
    tecnicopleno: "tecnico_pleno",
    tecnico_junior: "tecnico_junior",
    tecnicojunior: "tecnico_junior",
    executor: "tecnico_junior",
    colaborador: "colaborador",
    leitura: "leitura",
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

function deriveSectionsFromAccessPermissions(accessPermissions) {
  const normalized = normalizeAccessPermissionList(accessPermissions);
  if (!normalized.length || normalized.includes("ADMIN")) {
    return null;
  }
  const hasSectionControl = ACCESS_SECTION_PERMISSIONS.some((key) => normalized.includes(key));
  if (!hasSectionControl) {
    return null;
  }
  const sections = {};
  ACCESS_SECTION_PERMISSIONS.forEach((key) => {
    sections[key] = normalized.includes(key);
  });
  return sections;
}

function buildSections(role, explicitSections, accessPermissions) {
  const config = { ...DEFAULT_SECTIONS };
  if (explicitSections && typeof explicitSections === "object") {
    Object.keys(DEFAULT_SECTIONS).forEach((key) => {
      if (key in explicitSections) {
        config[key] = Boolean(explicitSections[key]);
      }
    });
  }
  const derivedSections = deriveSectionsFromAccessPermissions(accessPermissions);
  if (derivedSections) {
    Object.keys(derivedSections).forEach((key) => {
      config[key] = derivedSections[key];
    });
  }
  const accessList = normalizeAccessPermissionList(accessPermissions);
  if (isFullAccessRole(role) || accessList.includes("ADMIN")) {
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
  const accessPermissions = getAccessPermissionsForUser(user);
  if (accessPermissions && accessPermissions.length) {
    const expanded = expandAccessPermissions(accessPermissions);
    const output = {};
    GRANULAR_PERMISSION_CATALOG.forEach((perm) => {
      output[perm.key] = expanded.has(perm.key);
    });
    return output;
  }
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
  if (!user) {
    return false;
  }
  if (isMasterUser(user) || isFullAccessRole(user.rbacRole || user.role)) {
    return true;
  }
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
  const status =
    String(user.status || (user.active === false ? "INATIVO" : "ATIVO")).toUpperCase() ===
    "INATIVO"
      ? "INATIVO"
      : "ATIVO";
  const roleRecord =
    (user.roleId && getAccessRoleById(user.roleId)) ||
    getAccessRoleByName(user.roleName || user.cargo || user.role);
  const roleId = user.roleId || (roleRecord ? roleRecord.id : "");
  const roleName = user.roleName || (roleRecord ? roleRecord.name : user.cargo || "");
  const rolePermissions = roleRecord
    ? normalizeAccessPermissionList(roleRecord.permissions)
    : normalizeAccessPermissionList(user.rolePermissions || user.accessPermissions || []);
  const accessPermissions = normalizeAccessPermissionList(
    user.accessPermissions || user.rolePermissions || rolePermissions || []
  );
  return {
    id: user.id,
    username: user.username,
    matricula: user.matricula,
    name: user.name,
    role,
    rbacRole,
    roleId,
    roleName,
    cargo: user.cargo || "",
    email,
    emailVerified,
    projeto: user.projeto || "",
    uen: user.uen || "",
    localizacao: user.localizacao || "",
    projectId: user.projectId || "",
    status,
    active: status !== "INATIVO",
    permissions: buildPermissions(rbacRole, user.permissions),
    rolePermissions,
    accessPermissions,
    granularPermissions: getGranularPermissionsForUser(user),
    sections: buildSections(rbacRole, user.sections, accessPermissions),
    avatarUrl: user.avatarUrl || "",
    avatarUpdatedAt: user.avatarUpdatedAt || "",
    preferences: normalizeProfilePreferences(user.preferences),
    security: normalizeProfileSecurity(user.security || user.securitySettings),
    createdAt: user.createdAt,
  };
}

function serializeAccessUser(user) {
  if (!user) {
    return null;
  }
  const normalized = normalizeUserRecord(user);
  const roleRecord =
    (normalized.roleId && getAccessRoleById(normalized.roleId)) ||
    getAccessRoleByName(normalized.roleName || normalized.cargo || normalized.role);
  const rolePermissions = roleRecord
    ? normalizeAccessPermissionList(roleRecord.permissions)
    : normalizeAccessPermissionList(
        normalized.rolePermissions || normalized.accessPermissions || []
      );
  const accessPermissions = normalizeAccessPermissionList(
    normalized.accessPermissions || normalized.rolePermissions || rolePermissions || []
  );
  return {
    id: normalized.id,
    name: normalized.name,
    matricula: normalized.matricula,
    matriculaNormalized: normalizeMatricula(normalized.matricula || ""),
    username: normalized.username || "",
    email: normalized.email || "",
    roleId: normalized.roleId || "",
    roleName: normalized.roleName || normalized.cargo || "",
    cargo: normalized.cargo || "",
    role: normalized.role,
    rbacRole: normalized.rbacRole,
    rolePermissions,
    accessPermissions,
    permissions: normalized.permissions,
    sections: normalized.sections,
    projectId:
      normalized.projectId === null || normalized.projectId === undefined
        ? null
        : String(normalized.projectId || ""),
    status: normalized.status || "ATIVO",
    active: normalized.active !== false,
    passwordHash: normalized.passwordHash || "",
    passwordUpdatedAt: normalized.passwordUpdatedAt || "",
    createdAt: normalized.createdAt || "",
    updatedAt: normalized.updatedAt || normalized.createdAt || "",
    uen: normalized.uen || "",
    atribuicoes: normalized.atribuicoes || "",
    avatarUrl: normalized.avatarUrl || "",
    avatarUpdatedAt: normalized.avatarUpdatedAt || "",
  };
}

function normalizeUserRecord(user) {
  const roleNameInput = String(user.roleName || user.cargo || user.role || "").trim();
  const roleRecord = user.roleId
    ? getAccessRoleById(user.roleId)
    : roleNameInput
      ? getAccessRoleByName(roleNameInput)
      : null;
  const roleName = roleRecord ? roleRecord.name : String(user.roleName || user.cargo || "").trim();
  const roleId = roleRecord ? roleRecord.id : user.roleId || "";
  const accessPermissions = normalizeAccessPermissionList(
    Array.isArray(user.accessPermissions)
      ? user.accessPermissions
      : Array.isArray(user.rolePermissions)
        ? user.rolePermissions
        : roleRecord
          ? roleRecord.permissions
          : []
  );
  const derivedRbacRole = normalizeRbacRole(
    user.rbacRole || user.role || deriveRbacRoleFromRoleName(roleName || roleNameInput)
  );
  const role = normalizeRole(user.role, derivedRbacRole);
  const status =
    String(user.status || (user.active === false ? "INATIVO" : "ATIVO")).toUpperCase() ===
    "INATIVO"
      ? "INATIVO"
      : "ATIVO";
  const email = getUserEmail(user);
  return {
    ...user,
    role,
    rbacRole: derivedRbacRole,
    roleId,
    roleName,
    accessPermissions,
    status,
    email,
    emailVerified: user.emailVerified !== false,
    active: status !== "INATIVO",
    permissions: buildPermissions(derivedRbacRole, user.permissions),
    sections: buildSections(derivedRbacRole, user.sections, accessPermissions),
  };
}

function normalizeUserStatus(value) {
  return String(value || "").toUpperCase() === "INATIVO" ? "INATIVO" : "ATIVO";
}

function getUserStatus(user) {
  if (!user) {
    return "ATIVO";
  }
  if (user.status) {
    return normalizeUserStatus(user.status);
  }
  if (user.active === false) {
    return "INATIVO";
  }
  return "ATIVO";
}

function findUserByMatriculaNormalized(value, excludeUserId = "") {
  const normalized = normalizeMatricula(value);
  if (!normalized) {
    return null;
  }
  return (
    users.find((user) => {
      if (!user || !user.matricula) {
        return false;
      }
      if (excludeUserId && String(user.id) === String(excludeUserId)) {
        return false;
      }
      return normalizeMatricula(user.matricula) === normalized;
    }) || null
  );
}

function ensureMasterAccount() {
  const username = MASTER_USERNAME.toLowerCase();
  const matricula = String(MASTER_MATRICULA || "").trim().toUpperCase();
  const rbacRole = normalizeRbacRole(MASTER_ROLE);
  const legacyRole = normalizeRole("admin", rbacRole);
  const accessRole =
    getAccessRoleByName("PCM") ||
    getAccessRoleByName(MASTER_ROLE) ||
    getAccessRoleByName(MASTER_CARGO);
  const accessRoleId = accessRole ? accessRole.id : "";
  const accessRoleName = accessRole ? accessRole.name : "PCM";
  const accessPermissions = accessRole ? accessRole.permissions : [];
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
      roleId: accessRoleId,
      roleName: accessRoleName,
      accessPermissions,
      cargo: MASTER_CARGO,
      status: "ATIVO",
      active: true,
      permissions: buildPermissions(rbacRole, current.permissions),
      sections: buildSections(rbacRole, current.sections, accessPermissions),
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
    roleId: accessRoleId,
    roleName: accessRoleName,
    accessPermissions,
    cargo: MASTER_CARGO,
    status: "ATIVO",
    active: true,
    passwordHash,
    permissions: buildPermissions(rbacRole),
    sections: buildSections(rbacRole, undefined, accessPermissions),
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
  const accessRole =
    getAccessRoleByName("Administrador") ||
    getAccessRoleByName("Admin") ||
    getAccessRoleByName("PCM");
  const accessRoleId = accessRole ? accessRole.id : "";
  const accessRoleName = accessRole ? accessRole.name : "Administrador";
  const accessPermissions = accessRole ? accessRole.permissions : [];
  const admin = normalizeUserRecord({
    id: crypto.randomUUID(),
    username: "admin",
    matricula: "ADMIN",
    name: "Administrador",
    role: "admin",
    rbacRole: "pcm",
    roleId: accessRoleId,
    roleName: accessRoleName,
    accessPermissions,
    active: true,
    status: "ATIVO",
    passwordHash,
    permissions: buildPermissions("pcm"),
    sections: buildSections("pcm", undefined, accessPermissions),
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

function generateRandomPassword(length = 12) {
  const safeLength = Math.max(8, Number(length) || 12);
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const symbols = "!@#$%*?-_";
  const all = `${lower}${upper}${digits}${symbols}`;
  const pick = (chars) => chars[crypto.randomInt(chars.length)];
  const result = [pick(lower), pick(upper), pick(digits), pick(symbols)];
  while (result.length < safeLength) {
    result.push(pick(all));
  }
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = crypto.randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.join("");
}

function hashPasswordSha256(password, saltHex = "") {
  const plain = String(password || "");
  if (!plain) {
    return "";
  }
  const salt = saltHex || crypto.randomBytes(16).toString("hex");
  const digest = crypto.createHash("sha256").update(`${salt}:${plain}`).digest("hex");
  return `sha256:${salt}:${digest}`;
}

function verifySha256Password(password, storedHash) {
  const raw = String(storedHash || "");
  if (!raw.startsWith("sha256:")) {
    return false;
  }
  const parts = raw.split(":");
  if (parts.length !== 3) {
    return false;
  }
  const recomputed = hashPasswordSha256(password, parts[1]);
  return recomputed === raw;
}

async function verifyPasswordAgainstHash(password, storedHash) {
  const raw = String(storedHash || "");
  if (!raw) {
    return false;
  }
  if (raw.startsWith("sha256:")) {
    return verifySha256Password(password, raw);
  }
  try {
    return await bcrypt.compare(password, raw);
  } catch (error) {
    return false;
  }
}

function isValidEmail(email) {
  const value = String(email || "").trim();
  if (!value) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeVerificationEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function createVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createVerificationCode() {
  const min = 10 ** (VERIFICATION_CODE_LENGTH - 1);
  const max = 10 ** VERIFICATION_CODE_LENGTH;
  return String(Math.floor(Math.random() * (max - min)) + min);
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function findVerificationIndexByEmail(email) {
  const normalized = normalizeVerificationEmail(email);
  if (!normalized) {
    return -1;
  }
  for (let i = verifications.length - 1; i >= 0; i -= 1) {
    const item = verifications[i];
    if (normalizeVerificationEmail(item && item.email) === normalized) {
      return i;
    }
  }
  return -1;
}

function findVerificationIndexByUserId(userId) {
  const normalized = String(userId || "").trim();
  if (!normalized) {
    return -1;
  }
  for (let i = verifications.length - 1; i >= 0; i -= 1) {
    const item = verifications[i];
    if (String((item && item.userId) || "").trim() === normalized) {
      return i;
    }
  }
  return -1;
}

function isVerificationExpired(record) {
  if (!record || !record.expiresAt) {
    return false;
  }
  return new Date(record.expiresAt).getTime() <= Date.now();
}

function activateUserByVerification(record) {
  if (!record || !record.userId) {
    return { error: 404, message: "Usuario nao encontrado." };
  }
  const userIndex = users.findIndex((item) => item.id === record.userId);
  if (userIndex === -1) {
    return { error: 404, message: "Usuario nao encontrado." };
  }
  const updated = normalizeUserRecord({
    ...users[userIndex],
    emailVerified: true,
  });
  users[userIndex] = updated;
  return { user: updated };
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

async function sendVerificationEmail(email, name, token, code) {
  const baseUrl = String(APP_BASE_URL || "").replace(/\/$/, "");
  const verifyUrl = `${baseUrl}/?verify=${encodeURIComponent(token)}`;
  const safeName = String(name || "").trim() || "colaborador";
  const safeCode = String(code || "").trim();
  const codeText = safeCode ? `Codigo de verificacao: ${safeCode}\n\n` : "";
  const codeHtml = safeCode
    ? `<p>Codigo de verificacao: <strong style="font-size: 20px; letter-spacing: 2px;">${safeCode}</strong></p>`
    : "";
  const subject = "Confirmacao de e-mail - OPSCOPE";
  const text = `Ola, ${safeName}!\n\n${codeText}Confirme seu e-mail para ativar sua conta OPSCOPE:\n${verifyUrl}\n\nSe voce nao solicitou o acesso, ignore este e-mail.`;
  const html = `
    <p>Ola, <strong>${safeName}</strong>!</p>
    ${codeHtml}
    <p>Confirme seu e-mail para ativar sua conta OPSCOPE:</p>
    <p><a href="${verifyUrl}">Confirmar e-mail</a></p>
    <p>Se voce nao solicitou o acesso, ignore este e-mail.</p>
  `;
  const resendOk = await sendEmailViaResend({ to: email, subject, text, html });
  if (resendOk) {
    return true;
  }
  return sendEmailViaSmtp({ to: email, subject, text, html });
}

async function sendPasswordResetEmail(email, name, code) {
  const safeName = String(name || "").trim() || "colaborador";
  const safeCode = String(code || "").trim();
  const subject = "Redefinicao de senha - OPSCOPE";
  const text = `Ola, ${safeName}!\n\nCodigo para redefinir sua senha: ${safeCode}\n\nSe voce nao solicitou, ignore este e-mail.`;
  const html = `
    <p>Ola, <strong>${safeName}</strong>!</p>
    <p>Codigo para redefinir sua senha: <strong style="font-size: 20px; letter-spacing: 2px;">${safeCode}</strong></p>
    <p>Se voce nao solicitou, ignore este e-mail.</p>
  `;
  const resendOk = await sendEmailViaResend({ to: email, subject, text, html });
  if (resendOk) {
    return true;
  }
  return sendEmailViaSmtp({ to: email, subject, text, html });
}

function findPasswordResetIndexByEmail(email) {
  const normalized = normalizeVerificationEmail(email);
  if (!normalized) {
    return -1;
  }
  for (let i = passwordResets.length - 1; i >= 0; i -= 1) {
    const item = passwordResets[i];
    if (normalizeVerificationEmail(item && item.email) === normalized) {
      return i;
    }
  }
  return -1;
}

function isPasswordResetExpired(record) {
  if (!record || !record.expiresAt) {
    return true;
  }
  return new Date(record.expiresAt).getTime() <= Date.now();
}

function cleanupPasswordResets() {
  const now = Date.now();
  passwordResets = passwordResets
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      ...item,
      email: normalizeVerificationEmail(item.email),
      attempts: Number(item.attempts || 0),
    }))
    .filter((item) => !item.expiresAt || new Date(item.expiresAt).getTime() > now);
  writeJson(PASSWORD_RESETS_FILE, passwordResets);
}

function cleanupVerifications() {
  const now = Date.now();
  verifications = verifications
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      ...item,
      email: normalizeVerificationEmail(item.email),
      attempts: Number(item.attempts || 0),
    }))
    .filter((item) => !item.expiresAt || new Date(item.expiresAt).getTime() > now);
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
  if (!user || user.active === false || String(user.status || "").toUpperCase() === "INATIVO") {
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
  const accessPermissions = getAccessPermissionsForUser(user);
  if (accessPermissions && accessPermissions.length) {
    const accessSet = new Set(accessPermissions);
    if (accessSet.has("ADMIN")) {
      return true;
    }
    if (accessSet.has(permissionKey)) {
      return true;
    }
    const mapped = ACCESS_MAINTENANCE_PERMISSION_MAP[permissionKey];
    if (mapped && accessSet.has(mapped)) {
      return true;
    }
    const legacy = buildPermissions(user.rbacRole || user.role, user.permissions);
    return Boolean(legacy && legacy[permissionKey]);
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

function requireAccessView(req, res, next) {
  const user = req.currentUser || getSessionUser(req);
  if (!user || !canViewAccessForUser(user)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  return next();
}

function requireAccessManage(req, res, next) {
  const user = req.currentUser || getSessionUser(req);
  if (!user || !canManageAccessForUser(user)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  return next();
}

function isStorageWriteBlocked() {
  return DB_ENABLED && !dbReady;
}

function requireStorageWritable(req, res, next) {
  if (!isStorageWriteBlocked()) {
    return next();
  }
  res.setHeader("Retry-After", "60");
  return res.status(503).json({ message: STORAGE_READONLY_MESSAGE });
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
    if (hasExecucaoRegistrada(item)) {
      return false;
    }
    const due = getDueDate(item);
    return due && isSameDay(due, today);
  }).length;

  const atrasadas = pendingItems.filter((item) => {
    if (hasExecucaoRegistrada(item)) {
      return false;
    }
    const status = normalizeStatus(item.status);
    if (status !== "backlog") {
      return false;
    }
    const due = getDueDate(item);
    return Boolean(due && due < today);
  }).length;

  const criticas = pendingItems.filter((item) => isCritical(item)).length;
  const aguardandoConclusao = pendingItems.filter((item) => {
    if (hasExecucaoRegistrada(item)) {
      return true;
    }
    const status = normalizeStatus(item.status);
    return status === "encerramento";
  }).length;

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
    if (hasExecucaoRegistrada(item)) {
      return false;
    }
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
    concluidasTotal += 1;
    const due = getDueDate(item);
    if (!due || completedDay <= due) {
      concluidasNoPrazo += 1;
    }
    concluidasPeriodo += 1;
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
  const recentDays = [];
  for (let i = 0; i < 7; i += 1) {
    const day = startOfDay(addDays(today, -6 + i));
    labels.push(formatShortLabel(day));
    recentDays.push(day);
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

  const miniSeries = {
    backlog: recentDays.map((day) => {
      return pendingItems.filter((item) => {
        if (hasExecucaoRegistrada(item)) {
          return false;
        }
        const status = normalizeStatus(item.status);
        if (status === "backlog") {
          return true;
        }
        if (status === "em_execucao" || status === "encerramento") {
          return false;
        }
        const due = getDueDate(item);
        return due && due < day;
      }).length;
    }),
    concluidas: recentDays.map((day) => {
      return completedItems.filter((item) => {
        const completedAt = getCompletedAt(item);
        if (!completedAt) {
          return false;
        }
        return isSameDay(completedAt, day);
      }).length;
    }),
  };

  return {
    kpis: {
      venceHoje,
      atrasadas,
      criticas,
      riscoImediato,
      aguardandoConclusao,
    },
    alertasOperacionais,
    saudeOperacional: {
      pontualidadePct,
      backlogTotal,
      concluidasPeriodo,
      atrasoMedioDias,
    },
    proximasAtividades,
    miniSeries,
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
let almoxItems = [];
let almoxStock = [];
let almoxMovements = [];
let almoxKits = [];
let announcements = [];
let feedbacks = [];
let sstTrainings = [];
let sstTrainingRecords = [];
let sstInspectionTemplates = [];
let sstInspections = [];
let sstNonconformities = [];
let sstIncidents = [];
let sstAprs = [];
let sstPermits = [];
let sstVehicles = [];
let sstDocs = [];
let compatState = getDefaultCompatState();
let accessRoles = [];
let users = [];
let invites = [];
let auditLog = [];
let verifications = [];
let passwordResets = [];
let apiLogs = [];
let healthTasks = [];
let automations = [];
let granularPermissions = null;
let filesMeta = [];
let warnedUploadsDisabled = false;

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
  passwordResets = readJson(PASSWORD_RESETS_FILE, []);
  apiLogs = readJson(API_LOG_FILE, []);
  healthTasks = normalizeHealthTasks(readJson(HEALTH_TASKS_FILE, []));
  saveHealthTasks(healthTasks);
  automations = normalizeAutomations(readJson(AUTOMATIONS_FILE, []));
  saveAutomations(automations);
  granularPermissions = normalizeGranularPermissions(readJson(PERMISSOES_FILE, null));
  if (!fs.existsSync(PERMISSOES_FILE)) {
    writeJson(PERMISSOES_FILE, granularPermissions);
  }
  accessRoles = loadAccessRoles();
  seedDefaultAccessRolesIfEmpty();
  accessRoles = applyAccessRolePermissionDefaults(accessRoles);
  filesMeta = readJson(FILES_META_FILE, []);
  if (!Array.isArray(filesMeta)) {
    filesMeta = [];
  }
  await backfillUploadsToDb();
  cleanupVerifications();
  cleanupPasswordResets();
  users = users.map(normalizeUserRecord);
  writeJson(USERS_FILE, users);
  ensureMasterAccount();
  seedAdmin();
  projects = loadProjects();
  projectUsers = loadProjectUsers();
  equipamentos = loadEquipamentos();
  almoxItems = loadAlmoxItems();
  if (!fs.existsSync(ALMOX_ITEMS_FILE)) {
    saveAlmoxItems(almoxItems);
  }
  almoxStock = loadAlmoxStock();
  if (!fs.existsSync(ALMOX_STOCK_FILE)) {
    saveAlmoxStock(almoxStock);
  }
  almoxMovements = loadAlmoxMovements();
  if (!fs.existsSync(ALMOX_MOVEMENTS_FILE)) {
    saveAlmoxMovements(almoxMovements);
  }
  almoxKits = loadAlmoxKits();
  if (!fs.existsSync(ALMOX_KITS_FILE)) {
    saveAlmoxKits(almoxKits);
  }
  sstTrainings = loadSstTrainings();
  if (!fs.existsSync(SST_TRAININGS_FILE)) {
    saveSstTrainings(sstTrainings);
  }
  sstTrainingRecords = loadSstTrainingRecords();
  if (!fs.existsSync(SST_TRAINING_RECORDS_FILE)) {
    saveSstTrainingRecords(sstTrainingRecords);
  }
  sstInspectionTemplates = loadSstInspectionTemplates();
  if (!fs.existsSync(SST_INSPECTION_TEMPLATES_FILE)) {
    saveSstInspectionTemplates(sstInspectionTemplates);
  }
  sstInspections = loadSstInspections();
  if (!fs.existsSync(SST_INSPECTIONS_FILE)) {
    saveSstInspections(sstInspections);
  }
  sstNonconformities = loadSstNonconformities();
  if (!fs.existsSync(SST_NONCONFORMITIES_FILE)) {
    saveSstNonconformities(sstNonconformities);
  }
  sstIncidents = loadSstIncidents();
  if (!fs.existsSync(SST_INCIDENTS_FILE)) {
    saveSstIncidents(sstIncidents);
  }
  sstAprs = loadSstAprs();
  if (!fs.existsSync(SST_APRS_FILE)) {
    saveSstAprs(sstAprs);
  }
  sstPermits = loadSstPermits();
  if (!fs.existsSync(SST_PERMITS_FILE)) {
    saveSstPermits(sstPermits);
  }
  sstVehicles = loadSstVehicles();
  if (!fs.existsSync(SST_VEHICLES_FILE)) {
    saveSstVehicles(sstVehicles);
  }
  sstDocs = loadSstDocs();
  if (!fs.existsSync(SST_DOCS_FILE)) {
    saveSstDocs(sstDocs);
  }
  announcements = loadAnnouncements();
  if (!fs.existsSync(ANNOUNCEMENTS_FILE)) {
    saveAnnouncements(announcements);
  }
  feedbacks = loadFeedbacks();
  if (!fs.existsSync(FEEDBACKS_FILE)) {
    saveFeedbacks(feedbacks);
  }
  compatState = loadCompatState();
  if (!fs.existsSync(COMPAT_FILE)) {
    saveCompatState(compatState);
  }
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
app.set("trust proxy", 1);
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
      secure: !IS_DEV,
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

app.use("/uploads", express.static(UPLOADS_DIR, { maxAge: "7d", immutable: true }));
app.use(
  express.static(__dirname, {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-store");
        return;
      }
      if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  return next();
});

app.get("/api/version", (req, res) => {
  return res.json({ buildId: BUILD_ID, serverTime: new Date().toISOString() });
});

app.get("/api/compat", requireAuth, (req, res) => {
  return res.json({
    schemaVersion: compatState.schemaVersion,
    datasets: compatState.datasets,
    updatedAt: compatState.updatedAt,
    buildId: BUILD_ID,
  });
});

app.get("/api/events", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId =
    String(req.query.projectId || "").trim() || String(getActiveProjectId(req, user) || "").trim();
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  if (res.flushHeaders) {
    res.flushHeaders();
  }
  const clientId = crypto.randomUUID();
  const client = {
    id: clientId,
    res,
    userId: user ? user.id : "",
    projectId,
  };
  sseClients.set(clientId, client);
  sendSse(res, "hello", {
    ok: true,
    buildId: BUILD_ID,
    projectId,
    serverTime: new Date().toISOString(),
  });
  const pingTimer = setInterval(() => {
    try {
      sendSse(res, "ping", { t: Date.now() });
    } catch (error) {
      clearInterval(pingTimer);
    }
  }, SSE_PING_INTERVAL_MS);
  req.on("close", () => {
    clearInterval(pingTimer);
    sseClients.delete(clientId);
  });
});

app.get("/uploads/files/:dir/:file", async (req, res) => {
  const dir = String(req.params.dir || "").trim();
  const fileName = path.basename(String(req.params.file || "").trim());
  if (!dir || !fileName) {
    return res.status(404).send("Arquivo nao encontrado.");
  }
  const typeEntry = Object.entries(FILE_TYPE_CONFIG).find(([, config]) => config.dir === dir);
  if (!typeEntry) {
    return res.status(404).send("Arquivo nao encontrado.");
  }
  const [typeKey, typeConfig] = typeEntry;
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
    ? filesMeta.find((item) => item && item.type === typeKey && item.name === fileName)
    : null;
  let blob = entry
    ? await fetchUploadBlobById(entry.id)
    : await fetchUploadBlobByName(typeKey, fileName);
  if ((!blob || !blob.buffer) && Array.isArray(filesMeta)) {
    const byOriginalName = filesMeta.find((item) => {
      if (!item || item.type !== typeKey) {
        return false;
      }
      const original = String(item.originalName || "").trim();
      return original && path.basename(original) === fileName;
    });
    if (byOriginalName) {
      blob = await fetchUploadBlobById(byOriginalName.id);
    }
  }
  if (!blob || !blob.buffer) {
    const normalizedName = normalizeLookupFileName(fileName);
    if (normalizedName && normalizedName !== fileName) {
      const normalizedEntry = Array.isArray(filesMeta)
        ? filesMeta.find(
            (item) => item && item.type === typeKey && item.name === normalizedName
          )
        : null;
      blob = normalizedEntry
        ? await fetchUploadBlobById(normalizedEntry.id)
        : await fetchUploadBlobByName(typeKey, normalizedName);
    }
  }
  if (!blob || !blob.buffer) {
    blob = await fetchUploadBlobByNameAnyType(fileName);
  }
  if (!blob || !blob.buffer) {
    const normalizedName = normalizeLookupFileName(fileName);
    if (normalizedName && normalizedName !== fileName) {
      blob = await fetchUploadBlobByNameAnyType(normalizedName);
    }
  }
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
  if (user.active === false || String(user.status || "").toUpperCase() === "INATIVO") {
    appendAudit("login_inactive", user.id, { login }, ip);
    return res.status(403).json({ message: "Conta inativa." });
  }
  const ok = await verifyPasswordAgainstHash(senha, user.passwordHash);
  if (!ok) {
    recordIpFailure(ip);
    recordUserFailure(login);
    appendAudit("login_fail", user.id, { login }, ip);
    return res.status(401).json({ message: "Credenciais inválidas." });
  }
  if (user.emailVerified === false) {
    appendAudit("login_unverified", user.id, { login }, ip);
    return res.status(403).json({
      message: "E-mail nao verificado. Digite o codigo enviado para o seu e-mail.",
      requiresEmailVerification: true,
      email: normalizeVerificationEmail(user.email || user.username || user.matricula),
    });
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
    nomeTime: payload.nomeTime || "",
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
  broadcastSse("projects.updated", { projectId: record.id, source: "create" });
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
  broadcastSse("projects.updated", { projectId: updated.id, source: "update" });
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
    broadcastSse("projects.updated", { projectId, source: "delete" });
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
    broadcastSse("project.team.updated", { projectId, count: created.length, source: "add" });
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
    broadcastSse("project.team.updated", { projectId, removedId: userId, source: "remove" });
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
    broadcastSse("project.equipamentos.updated", { projectId, equipamentoId: record.id, source: "create" });
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
    broadcastSse("project.equipamentos.updated", { projectId: updated.projectId, equipamentoId: updated.id, source: "update" });
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
    broadcastSse("project.equipamentos.updated", { projectId: equipamento.projectId, equipamentoId, source: "delete" });
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

app.get("/api/almox/items", requireAuth, requirePermission("verAlmoxarifado"), (req, res) => {
  const includeInactive = String(req.query.includeInactive || "").toLowerCase() === "true";
  const list = includeInactive
    ? almoxItems.slice()
    : almoxItems.filter((item) => item && item.status !== "INATIVO" && !item.deletedAt);
  return res.json({ items: list });
});

app.post(
  "/api/almox/items",
  requireAuth,
  requirePermission("gerenciarAlmoxarifado"),
  (req, res) => {
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const nome = String(payload.name || payload.nome || "").trim();
    if (!nome) {
      return res.status(400).json({ message: "Nome do item obrigatorio." });
    }
    const user = req.currentUser || getSessionUser(req);
    const record = normalizeAlmoxItem({
      ...payload,
      name: nome,
      createdBy: user ? user.id : "",
      updatedBy: user ? user.id : "",
      status: payload.status || "ATIVO",
    });
    almoxItems = almoxItems.concat(record);
    saveAlmoxItems(almoxItems);
    appendAudit("almox_item_create", user ? user.id : null, { itemId: record.id }, getClientIp(req));
    return res.json({ item: record });
  }
);

app.put(
  "/api/almox/items/:id",
  requireAuth,
  requirePermission("gerenciarAlmoxarifado"),
  (req, res) => {
    const itemId = String(req.params.id || "").trim();
    const index = almoxItems.findIndex((item) => item && item.id === itemId);
    if (index === -1) {
      return res.status(404).json({ message: "Item nao encontrado." });
    }
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const current = almoxItems[index];
    const updated = normalizeAlmoxItem({
      ...current,
      ...payload,
      id: current.id,
      createdAt: current.createdAt,
      createdBy: current.createdBy,
      updatedAt: new Date().toISOString(),
      updatedBy: (req.currentUser || getSessionUser(req))?.id || "",
    });
    almoxItems[index] = updated;
    saveAlmoxItems(almoxItems);
    appendAudit(
      "almox_item_update",
      (req.currentUser || getSessionUser(req))?.id || null,
      { itemId },
      getClientIp(req)
    );
    return res.json({ item: updated });
  }
);

app.delete(
  "/api/almox/items/:id",
  requireAuth,
  requirePermission("gerenciarAlmoxarifado"),
  (req, res) => {
    const itemId = String(req.params.id || "").trim();
    const index = almoxItems.findIndex((item) => item && item.id === itemId);
    if (index === -1) {
      return res.status(404).json({ message: "Item nao encontrado." });
    }
    const current = almoxItems[index];
    const updated = {
      ...current,
      status: "INATIVO",
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: (req.currentUser || getSessionUser(req))?.id || "",
    };
    almoxItems[index] = updated;
    saveAlmoxItems(almoxItems);
    appendAudit(
      "almox_item_delete",
      (req.currentUser || getSessionUser(req))?.id || null,
      { itemId },
      getClientIp(req)
    );
    return res.json({ item: updated });
  }
);

app.get(
  "/api/almox/items/:id/qrcode",
  requireAuth,
  requirePermission("verAlmoxarifado"),
  async (req, res) => {
    if (!QRCode) {
      return res.status(501).json({ message: "Dependencia qrcode nao instalada." });
    }
    const itemId = String(req.params.id || "").trim();
    const item = almoxItems.find((entry) => entry && entry.id === itemId);
    if (!item) {
      return res.status(404).json({ message: "Item nao encontrado." });
    }
    const value = item.barcode || item.internalCode || item.id;
    try {
      const buffer = await QRCode.toBuffer(String(value), { type: "png", width: 256, margin: 1 });
      res.setHeader("Content-Type", "image/png");
      return res.end(buffer);
    } catch (error) {
      return res.status(500).json({ message: "Falha ao gerar QR Code." });
    }
  }
);

app.get("/api/almox/stock", requireAuth, requirePermission("verAlmoxarifado"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim();
  const allowed = new Set(getUserProjectIds(user));
  if (projectId && !allowed.has(projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  let list = almoxStock.filter((entry) => entry && allowed.has(entry.projectId));
  if (projectId) {
    list = list.filter((entry) => entry.projectId === projectId);
  }
  return res.json({ stock: list });
});

app.put(
  "/api/almox/stock/:id",
  requireAuth,
  requirePermission("gerenciarAlmoxarifado"),
  (req, res) => {
    const stockId = String(req.params.id || "").trim();
    const index = almoxStock.findIndex((entry) => entry && entry.id === stockId);
    if (index === -1) {
      return res.status(404).json({ message: "Registro de estoque nao encontrado." });
    }
    const user = req.currentUser || getSessionUser(req);
    const entry = almoxStock[index];
    if (!userHasProjectAccess(user, entry.projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const updated = {
      ...entry,
      min:
        "min" in payload || "minimo" in payload
          ? Math.max(0, normalizeNumber(payload.min ?? payload.minimo))
          : entry.min,
      reorderPoint:
        "reorderPoint" in payload || "pontoReposicao" in payload
          ? Math.max(0, normalizeNumber(payload.reorderPoint ?? payload.pontoReposicao))
          : entry.reorderPoint,
      updatedAt: new Date().toISOString(),
    };
    almoxStock[index] = updated;
    saveAlmoxStock(almoxStock);
    appendAudit(
      "almox_stock_update",
      user ? user.id : null,
      { stockId },
      getClientIp(req),
      entry.projectId
    );
    return res.json({ stock: updated });
  }
);

app.get(
  "/api/almox/movements",
  requireAuth,
  requirePermission("verAlmoxarifado"),
  (req, res) => {
    const user = req.currentUser || getSessionUser(req);
    const projectId = String(req.query.projectId || "").trim();
    const allowed = new Set(getUserProjectIds(user));
    if (projectId && !allowed.has(projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    let list = almoxMovements.filter((entry) => entry && allowed.has(entry.projectId));
    if (projectId) {
      list = list.filter((entry) => entry.projectId === projectId);
    }
    list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ movements: list });
  }
);

app.post(
  "/api/almox/movements",
  requireAuth,
  requirePermission("gerenciarAlmoxarifado"),
  (req, res) => {
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const projectId = String(payload.projectId || "").trim();
    const itemId = String(payload.itemId || "").trim();
    const type = String(payload.type || payload.tipo || "").trim().toUpperCase();
    const quantity = Number(payload.quantity || payload.quantidade || 0);
    if (!projectId || !itemId) {
      return res.status(400).json({ message: "Projeto e item sao obrigatorios." });
    }
    const user = req.currentUser || getSessionUser(req);
    if (!userHasProjectAccess(user, projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    if (!ALMOX_MOVEMENT_TYPES.has(type)) {
      return res.status(400).json({ message: "Tipo de movimentacao invalido." });
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return res.status(400).json({ message: "Quantidade invalida." });
    }
    const item = almoxItems.find((entry) => entry && entry.id === itemId);
    if (!item || item.status === "INATIVO") {
      return res.status(400).json({ message: "Item invalido ou inativo." });
    }
    const projectIdDestino = String(payload.projectIdDestino || payload.projectDestinationId || "").trim();
    if (type === "TRANSFERENCIA") {
      if (!projectIdDestino) {
        return res.status(400).json({ message: "Projeto destino obrigatorio." });
      }
      if (!userHasProjectAccess(user, projectIdDestino)) {
        return res.status(403).json({ message: "Nao autorizado ao projeto destino." });
      }
    }
    const movement = normalizeAlmoxMovement({
      ...payload,
      type,
      projectId,
      projectIdDestino,
      quantity,
      createdBy: user ? user.id : "",
    });
    const applied = applyAlmoxMovement(movement);
    if (applied.error) {
      return res.status(400).json({ message: applied.error });
    }
    almoxMovements = almoxMovements.concat(movement);
    saveAlmoxMovements(almoxMovements);
    saveAlmoxStock(almoxStock);
    appendAudit(
      "almox_movement_create",
      user ? user.id : null,
      { movementId: movement.id, type, itemId, projectId },
      getClientIp(req),
      projectId
    );
    return res.json({
      movement,
      stockEntries: [applied.origin, applied.dest].filter(Boolean),
    });
  }
);

app.get("/api/almox/epi-by-user", requireAuth, requirePermission("verAlmoxarifado"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const allowed = new Set(getUserProjectIds(user));
  const list = buildEpiByUser(allowed);
  return res.json({ records: list });
});

app.get(
  "/api/almox/movements/:id/term",
  requireAuth,
  requirePermission("verAlmoxarifado"),
  async (req, res) => {
    if (!PDFDocument || !StandardFonts) {
      return res.status(501).json({ message: "Dependencia pdf-lib nao instalada." });
    }
    const movementId = String(req.params.id || "").trim();
    const movement = almoxMovements.find((entry) => entry && entry.id === movementId);
    if (!movement) {
      return res.status(404).json({ message: "Movimentacao nao encontrada." });
    }
    const item = almoxItems.find((entry) => entry && entry.id === movement.itemId);
    const project = getProjectById(movement.projectId);
    const collaborator = movement.collaboratorId ? users.find((u) => u.id === movement.collaboratorId) : null;
    const createdAt = movement.createdAt ? new Date(movement.createdAt) : new Date();
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const draw = (text, x, y, size = 12, bold = false) => {
      page.drawText(text, { x, y, size, font: bold ? fontBold : font, color: rgb(0.1, 0.1, 0.1) });
    };
    const formatLine = (label, value) => `${label}: ${value || "-"}`;
    draw("TERMO DE RESPONSABILIDADE - ALMOXARIFADO", 60, 780, 14, true);
    draw(formatLine("Data", createdAt.toLocaleString("pt-BR")), 60, 740);
    draw(formatLine("Item", item ? item.name : movement.itemId), 60, 720);
    draw(formatLine("Quantidade", String(movement.quantity || 0)), 60, 700);
    draw(formatLine("Projeto", project ? getProjectLabel(project) : movement.projectId), 60, 680);
    draw(
      formatLine(
        "Colaborador",
        collaborator ? `${collaborator.name} (${collaborator.matricula || "-"})` : movement.collaboratorId
      ),
      60,
      660
    );
    draw(formatLine("Responsavel", getUserLabel(movement.createdBy)), 60, 640);
    draw("Declaro que recebi os itens acima e me responsabilizo pelo uso adequado.", 60, 600, 11);
    draw("Assinatura: ____________________________________________", 60, 540, 11);
    const bytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="termo-responsabilidade-${movement.id}.pdf"`
    );
    return res.end(Buffer.from(bytes));
  }
);

app.get("/api/almox/kits", requireAuth, requirePermission("verAlmoxarifado"), (req, res) => {
  return res.json({ kits: almoxKits });
});

app.post(
  "/api/almox/kits",
  requireAuth,
  requirePermission("gerenciarAlmoxarifado"),
  (req, res) => {
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const nome = String(payload.name || payload.nome || "").trim();
    if (!nome) {
      return res.status(400).json({ message: "Nome do kit obrigatorio." });
    }
    const user = req.currentUser || getSessionUser(req);
    const record = normalizeAlmoxKit({ ...payload, name: nome });
    almoxKits = almoxKits.concat(record);
    saveAlmoxKits(almoxKits);
    appendAudit("almox_kit_create", user ? user.id : null, { kitId: record.id }, getClientIp(req));
    return res.json({ kit: record });
  }
);

app.get("/api/sst/trainings", requireAuth, requirePermission("verSST"), (req, res) => {
  return res.json({ trainings: sstTrainings.filter((item) => item && item.status !== "INATIVO") });
});

app.post("/api/sst/trainings", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const nome = String(payload.name || payload.nome || "").trim();
  if (!nome) {
    return res.status(400).json({ message: "Nome do treinamento obrigatorio." });
  }
  const user = req.currentUser || getSessionUser(req);
  const record = normalizeSstTraining({
    ...payload,
    name: nome,
    createdAt: new Date().toISOString(),
  });
  sstTrainings = sstTrainings.concat(record);
  saveSstTrainings(sstTrainings);
  appendAudit("sst_training_create", user ? user.id : null, { trainingId: record.id }, getClientIp(req));
  return res.json({ training: record });
});

app.put("/api/sst/trainings/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const trainingId = String(req.params.id || "").trim();
  const index = sstTrainings.findIndex((item) => item && item.id === trainingId);
  if (index === -1) {
    return res.status(404).json({ message: "Treinamento nao encontrado." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const current = sstTrainings[index];
  const updated = normalizeSstTraining({
    ...current,
    ...payload,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  });
  sstTrainings[index] = updated;
  saveSstTrainings(sstTrainings);
  appendAudit(
    "sst_training_update",
    (req.currentUser || getSessionUser(req))?.id || null,
    { trainingId },
    getClientIp(req)
  );
  return res.json({ training: updated });
});

app.delete("/api/sst/trainings/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const trainingId = String(req.params.id || "").trim();
  const index = sstTrainings.findIndex((item) => item && item.id === trainingId);
  if (index === -1) {
    return res.status(404).json({ message: "Treinamento nao encontrado." });
  }
  sstTrainings[index] = { ...sstTrainings[index], status: "INATIVO", updatedAt: new Date().toISOString() };
  saveSstTrainings(sstTrainings);
  appendAudit(
    "sst_training_delete",
    (req.currentUser || getSessionUser(req))?.id || null,
    { trainingId },
    getClientIp(req)
  );
  return res.json({ ok: true });
});

app.get(
  "/api/sst/training-records",
  requireAuth,
  requirePermission("verSST"),
  (req, res) => {
    return res.json({ records: sstTrainingRecords });
  }
);

app.post(
  "/api/sst/training-records",
  requireAuth,
  requirePermission("gerenciarSST"),
  (req, res) => {
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const trainingId = String(payload.trainingId || "").trim();
    const collaboratorId = String(payload.collaboratorId || "").trim();
    if (!trainingId || !collaboratorId) {
      return res.status(400).json({ message: "Treinamento e colaborador obrigatorios." });
    }
    const record = normalizeSstTrainingRecord(payload);
    sstTrainingRecords = sstTrainingRecords.concat(record);
    saveSstTrainingRecords(sstTrainingRecords);
    appendAudit(
      "sst_training_record_create",
      (req.currentUser || getSessionUser(req))?.id || null,
      { recordId: record.id },
      getClientIp(req)
    );
    return res.json({ record });
  }
);

app.put(
  "/api/sst/training-records/:id",
  requireAuth,
  requirePermission("gerenciarSST"),
  (req, res) => {
    const recordId = String(req.params.id || "").trim();
    const index = sstTrainingRecords.findIndex((item) => item && item.id === recordId);
    if (index === -1) {
      return res.status(404).json({ message: "Registro de treinamento nao encontrado." });
    }
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const current = sstTrainingRecords[index];
    const updated = normalizeSstTrainingRecord({
      ...current,
      ...payload,
      id: current.id,
      createdAt: current.createdAt,
    });
    sstTrainingRecords[index] = updated;
    saveSstTrainingRecords(sstTrainingRecords);
    appendAudit(
      "sst_training_record_update",
      (req.currentUser || getSessionUser(req))?.id || null,
      { recordId },
      getClientIp(req)
    );
    return res.json({ record: updated });
  }
);

app.delete(
  "/api/sst/training-records/:id",
  requireAuth,
  requirePermission("gerenciarSST"),
  (req, res) => {
    const recordId = String(req.params.id || "").trim();
    const index = sstTrainingRecords.findIndex((item) => item && item.id === recordId);
    if (index === -1) {
      return res.status(404).json({ message: "Registro de treinamento nao encontrado." });
    }
    sstTrainingRecords.splice(index, 1);
    saveSstTrainingRecords(sstTrainingRecords);
    appendAudit(
      "sst_training_record_delete",
      (req.currentUser || getSessionUser(req))?.id || null,
      { recordId },
      getClientIp(req)
    );
    return res.json({ ok: true });
  }
);

app.get(
  "/api/sst/inspection-templates",
  requireAuth,
  requirePermission("verSST"),
  (req, res) => {
    return res.json({ templates: sstInspectionTemplates });
  }
);

app.post(
  "/api/sst/inspection-templates",
  requireAuth,
  requirePermission("gerenciarSST"),
  (req, res) => {
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const tipo = String(payload.type || payload.tipo || "").trim();
    if (!tipo) {
      return res.status(400).json({ message: "Tipo de checklist obrigatorio." });
    }
    const record = normalizeSstInspectionTemplate({ ...payload, type: tipo });
    sstInspectionTemplates = sstInspectionTemplates.concat(record);
    saveSstInspectionTemplates(sstInspectionTemplates);
    appendAudit(
      "sst_inspection_template_create",
      (req.currentUser || getSessionUser(req))?.id || null,
      { templateId: record.id },
      getClientIp(req)
    );
    return res.json({ template: record });
  }
);

app.put(
  "/api/sst/inspection-templates/:id",
  requireAuth,
  requirePermission("gerenciarSST"),
  (req, res) => {
    const templateId = String(req.params.id || "").trim();
    const index = sstInspectionTemplates.findIndex((item) => item && item.id === templateId);
    if (index === -1) {
      return res.status(404).json({ message: "Checklist nao encontrado." });
    }
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const current = sstInspectionTemplates[index];
    const updated = normalizeSstInspectionTemplate({
      ...current,
      ...payload,
      id: current.id,
      createdAt: current.createdAt,
    });
    sstInspectionTemplates[index] = updated;
    saveSstInspectionTemplates(sstInspectionTemplates);
    appendAudit(
      "sst_inspection_template_update",
      (req.currentUser || getSessionUser(req))?.id || null,
      { templateId },
      getClientIp(req)
    );
    return res.json({ template: updated });
  }
);

app.delete(
  "/api/sst/inspection-templates/:id",
  requireAuth,
  requirePermission("gerenciarSST"),
  (req, res) => {
    const templateId = String(req.params.id || "").trim();
    const index = sstInspectionTemplates.findIndex((item) => item && item.id === templateId);
    if (index === -1) {
      return res.status(404).json({ message: "Checklist nao encontrado." });
    }
    sstInspectionTemplates.splice(index, 1);
    saveSstInspectionTemplates(sstInspectionTemplates);
    appendAudit(
      "sst_inspection_template_delete",
      (req.currentUser || getSessionUser(req))?.id || null,
      { templateId },
      getClientIp(req)
    );
    return res.json({ ok: true });
  }
);

app.get("/api/sst/inspections", requireAuth, requirePermission("verSST"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim();
  const allowed = new Set(getUserProjectIds(user));
  if (projectId && !allowed.has(projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  let list = sstInspections.filter((item) => !item.projectId || allowed.has(item.projectId));
  if (projectId) {
    list = list.filter((item) => item.projectId === projectId);
  }
  list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json({ inspections: list });
});

app.post("/api/sst/inspections", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId = String(payload.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatorio." });
  }
  const user = req.currentUser || getSessionUser(req);
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const record = normalizeSstInspection({
    ...payload,
    projectId,
    createdBy: user ? user.id : "",
  });
  sstInspections = sstInspections.concat(record);
  saveSstInspections(sstInspections);
  appendAudit(
    "sst_inspection_create",
    user ? user.id : null,
    { inspectionId: record.id, projectId },
    getClientIp(req),
    projectId
  );
  return res.json({ inspection: record });
});

app.put("/api/sst/inspections/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const inspectionId = String(req.params.id || "").trim();
  const index = sstInspections.findIndex((item) => item && item.id === inspectionId);
  if (index === -1) {
    return res.status(404).json({ message: "Inspecao nao encontrada." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const current = sstInspections[index];
  const user = req.currentUser || getSessionUser(req);
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const updated = normalizeSstInspection({
    ...current,
    ...payload,
    id: current.id,
    projectId: current.projectId,
    createdAt: current.createdAt,
    createdBy: current.createdBy,
  });
  sstInspections[index] = updated;
  saveSstInspections(sstInspections);
  appendAudit(
    "sst_inspection_update",
    user ? user.id : null,
    { inspectionId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ inspection: updated });
});

app.delete("/api/sst/inspections/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const inspectionId = String(req.params.id || "").trim();
  const index = sstInspections.findIndex((item) => item && item.id === inspectionId);
  if (index === -1) {
    return res.status(404).json({ message: "Inspecao nao encontrada." });
  }
  const user = req.currentUser || getSessionUser(req);
  const current = sstInspections[index];
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  sstInspections.splice(index, 1);
  saveSstInspections(sstInspections);
  appendAudit(
    "sst_inspection_delete",
    user ? user.id : null,
    { inspectionId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ ok: true });
});

app.get(
  "/api/sst/nonconformities",
  requireAuth,
  requirePermission("verSST"),
  (req, res) => {
    const user = req.currentUser || getSessionUser(req);
    const projectId = String(req.query.projectId || "").trim();
    const allowed = new Set(getUserProjectIds(user));
    if (projectId && !allowed.has(projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    let list = sstNonconformities.filter((item) => !item.projectId || allowed.has(item.projectId));
    if (projectId) {
      list = list.filter((item) => item.projectId === projectId);
    }
    list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ nonconformities: list });
  }
);

app.post("/api/sst/nonconformities", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId = String(payload.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatorio." });
  }
  const user = req.currentUser || getSessionUser(req);
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const record = normalizeSstNonconformity({
    ...payload,
    projectId,
    createdBy: user ? user.id : "",
  });
  sstNonconformities = sstNonconformities.concat(record);
  saveSstNonconformities(sstNonconformities);
  appendAudit(
    "sst_nc_create",
    user ? user.id : null,
    { ncId: record.id, projectId },
    getClientIp(req),
    projectId
  );
  return res.json({ nonconformity: record });
});

app.put("/api/sst/nonconformities/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const ncId = String(req.params.id || "").trim();
  const index = sstNonconformities.findIndex((item) => item && item.id === ncId);
  if (index === -1) {
    return res.status(404).json({ message: "Nao conformidade nao encontrada." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const current = sstNonconformities[index];
  const user = req.currentUser || getSessionUser(req);
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const updated = normalizeSstNonconformity({
    ...current,
    ...payload,
    id: current.id,
    projectId: current.projectId,
    createdAt: current.createdAt,
    createdBy: current.createdBy,
  });
  sstNonconformities[index] = updated;
  saveSstNonconformities(sstNonconformities);
  appendAudit(
    "sst_nc_update",
    user ? user.id : null,
    { ncId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ nonconformity: updated });
});

app.delete("/api/sst/nonconformities/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const ncId = String(req.params.id || "").trim();
  const index = sstNonconformities.findIndex((item) => item && item.id === ncId);
  if (index === -1) {
    return res.status(404).json({ message: "Nao conformidade nao encontrada." });
  }
  const user = req.currentUser || getSessionUser(req);
  const current = sstNonconformities[index];
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  sstNonconformities.splice(index, 1);
  saveSstNonconformities(sstNonconformities);
  appendAudit(
    "sst_nc_delete",
    user ? user.id : null,
    { ncId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ ok: true });
});

app.get("/api/sst/incidents", requireAuth, requirePermission("verSST"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim();
  const allowed = new Set(getUserProjectIds(user));
  if (projectId && !allowed.has(projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  let list = sstIncidents.filter((item) => !item.projectId || allowed.has(item.projectId));
  if (projectId) {
    list = list.filter((item) => item.projectId === projectId);
  }
  list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json({ incidents: list });
});

app.post("/api/sst/incidents", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId = String(payload.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatorio." });
  }
  const user = req.currentUser || getSessionUser(req);
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const record = normalizeSstIncident({
    ...payload,
    projectId,
    createdBy: user ? user.id : "",
  });
  sstIncidents = sstIncidents.concat(record);
  saveSstIncidents(sstIncidents);
  appendAudit(
    "sst_incident_create",
    user ? user.id : null,
    { incidentId: record.id, projectId },
    getClientIp(req),
    projectId
  );
  return res.json({ incident: record });
});

app.put("/api/sst/incidents/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const incidentId = String(req.params.id || "").trim();
  const index = sstIncidents.findIndex((item) => item && item.id === incidentId);
  if (index === -1) {
    return res.status(404).json({ message: "Incidente nao encontrado." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const current = sstIncidents[index];
  const user = req.currentUser || getSessionUser(req);
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const updated = normalizeSstIncident({
    ...current,
    ...payload,
    id: current.id,
    projectId: current.projectId,
    createdAt: current.createdAt,
    createdBy: current.createdBy,
  });
  sstIncidents[index] = updated;
  saveSstIncidents(sstIncidents);
  appendAudit(
    "sst_incident_update",
    user ? user.id : null,
    { incidentId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ incident: updated });
});

app.delete("/api/sst/incidents/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const incidentId = String(req.params.id || "").trim();
  const index = sstIncidents.findIndex((item) => item && item.id === incidentId);
  if (index === -1) {
    return res.status(404).json({ message: "Incidente nao encontrado." });
  }
  const user = req.currentUser || getSessionUser(req);
  const current = sstIncidents[index];
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  sstIncidents.splice(index, 1);
  saveSstIncidents(sstIncidents);
  appendAudit(
    "sst_incident_delete",
    user ? user.id : null,
    { incidentId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ ok: true });
});

app.get("/api/sst/aprs", requireAuth, requirePermission("verSST"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim();
  const allowed = new Set(getUserProjectIds(user));
  if (projectId && !allowed.has(projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  let list = sstAprs.filter((item) => !item.projectId || allowed.has(item.projectId));
  if (projectId) {
    list = list.filter((item) => item.projectId === projectId);
  }
  list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json({ aprs: list });
});

app.post("/api/sst/aprs", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId = String(payload.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatorio." });
  }
  const user = req.currentUser || getSessionUser(req);
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const record = normalizeSstApr({
    ...payload,
    projectId,
    createdBy: user ? user.id : "",
  });
  sstAprs = sstAprs.concat(record);
  saveSstAprs(sstAprs);
  appendAudit(
    "sst_apr_create",
    user ? user.id : null,
    { aprId: record.id, projectId },
    getClientIp(req),
    projectId
  );
  return res.json({ apr: record });
});

app.put("/api/sst/aprs/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const aprId = String(req.params.id || "").trim();
  const index = sstAprs.findIndex((item) => item && item.id === aprId);
  if (index === -1) {
    return res.status(404).json({ message: "APR nao encontrada." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const current = sstAprs[index];
  const user = req.currentUser || getSessionUser(req);
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const updated = normalizeSstApr({
    ...current,
    ...payload,
    id: current.id,
    projectId: current.projectId,
    createdAt: current.createdAt,
    createdBy: current.createdBy,
  });
  sstAprs[index] = updated;
  saveSstAprs(sstAprs);
  appendAudit(
    "sst_apr_update",
    user ? user.id : null,
    { aprId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ apr: updated });
});

app.delete("/api/sst/aprs/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const aprId = String(req.params.id || "").trim();
  const index = sstAprs.findIndex((item) => item && item.id === aprId);
  if (index === -1) {
    return res.status(404).json({ message: "APR nao encontrada." });
  }
  const user = req.currentUser || getSessionUser(req);
  const current = sstAprs[index];
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  sstAprs.splice(index, 1);
  saveSstAprs(sstAprs);
  appendAudit(
    "sst_apr_delete",
    user ? user.id : null,
    { aprId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ ok: true });
});

app.get("/api/sst/permits", requireAuth, requirePermission("verSST"), (req, res) => {
  return res.json({ permits: sstPermits });
});

app.post("/api/sst/permits", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const aprId = String(payload.aprId || "").trim();
  if (!aprId) {
    return res.status(400).json({ message: "APR obrigatoria." });
  }
  const record = normalizeSstPermit(payload);
  sstPermits = sstPermits.concat(record);
  saveSstPermits(sstPermits);
  appendAudit(
    "sst_permit_create",
    (req.currentUser || getSessionUser(req))?.id || null,
    { permitId: record.id },
    getClientIp(req)
  );
  return res.json({ permit: record });
});

app.put("/api/sst/permits/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const permitId = String(req.params.id || "").trim();
  const index = sstPermits.findIndex((item) => item && item.id === permitId);
  if (index === -1) {
    return res.status(404).json({ message: "PT nao encontrada." });
  }
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const current = sstPermits[index];
  const updated = normalizeSstPermit({
    ...current,
    ...payload,
    id: current.id,
    createdAt: current.createdAt,
    createdBy: current.createdBy,
  });
  sstPermits[index] = updated;
  saveSstPermits(sstPermits);
  appendAudit(
    "sst_permit_update",
    (req.currentUser || getSessionUser(req))?.id || null,
    { permitId },
    getClientIp(req)
  );
  return res.json({ permit: updated });
});

app.delete("/api/sst/permits/:id", requireAuth, requirePermission("gerenciarSST"), (req, res) => {
  const permitId = String(req.params.id || "").trim();
  const index = sstPermits.findIndex((item) => item && item.id === permitId);
  if (index === -1) {
    return res.status(404).json({ message: "PT nao encontrada." });
  }
  sstPermits.splice(index, 1);
  saveSstPermits(sstPermits);
  appendAudit(
    "sst_permit_delete",
    (req.currentUser || getSessionUser(req))?.id || null,
    { permitId },
    getClientIp(req)
  );
  return res.json({ ok: true });
});

app.get("/api/sst/vehicles", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim();
  let list = sstVehicles.slice();
  if (projectId) {
    if (!userHasProjectAccess(user, projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    list = list.filter((item) => String(item.projectId) === projectId);
  } else {
    const allowed = new Set(getUserProjectIds(user));
    list = list.filter((item) => allowed.has(String(item.projectId)));
  }
  if (req.query.status && req.query.status !== "ALL") {
    const status = normalizeVehicleStatusValue(req.query.status);
    list = list.filter(
      (item) => normalizeVehicleStatusValue(item.status || "") === status
    );
  }
  if (req.query.q) {
    const term = normalizeSearchValue(req.query.q);
    list = list.filter(
      (item) =>
        normalizeSearchValue(item.plate || "").includes(term) ||
        normalizeSearchValue(item.model || "").includes(term)
    );
  }
  return res.json({ vehicles: list });
});

app.get("/api/sst/vehicles/:id", requireAuth, (req, res) => {
  const vehicleId = String(req.params.id || "").trim();
  const vehicle = sstVehicles.find((item) => item && String(item.id) === vehicleId);
  if (!vehicle) {
    return res.status(404).json({ message: "Veiculo nao encontrado." });
  }
  const user = req.currentUser || getSessionUser(req);
  if (vehicle.projectId && !userHasProjectAccess(user, vehicle.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  return res.json({ vehicle });
});

app.post("/api/sst/vehicles", requireAuth, requirePermission("gerenciarProjetos"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId = String(payload.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatorio." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const plate = normalizeVehiclePlate(payload.plate || payload.placa || "");
  if (!plate) {
    return res.status(400).json({ message: "Placa obrigatoria." });
  }
  const duplicate = sstVehicles.find(
    (item) =>
      item &&
      String(item.projectId) === projectId &&
      normalizeVehiclePlate(item.plate || "") === plate
  );
  if (duplicate) {
    return res.status(409).json({ message: "Ja existe veiculo com essa placa neste projeto." });
  }
  const now = new Date().toISOString();
  const record = normalizeSstVehicle({
    ...payload,
    projectId,
    plate,
    createdAt: now,
    updatedAt: now,
    createdBy: user ? user.id : "",
  });
  if (!record) {
    return res.status(400).json({ message: "Veiculo invalido." });
  }
  sstVehicles = sstVehicles.concat(record);
  saveSstVehicles(sstVehicles);
  appendAudit(
    "sst_vehicle_create",
    user ? user.id : null,
    { vehicleId: record.id, projectId },
    getClientIp(req),
    projectId
  );
  return res.json({ vehicle: record });
});

app.put("/api/sst/vehicles/:id", requireAuth, requirePermission("gerenciarProjetos"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const vehicleId = String(req.params.id || "").trim();
  const index = sstVehicles.findIndex((item) => item && String(item.id) === vehicleId);
  if (index === -1) {
    return res.status(404).json({ message: "Veiculo nao encontrado." });
  }
  const current = sstVehicles[index];
  const payload = req.body && typeof req.body === "object" ? req.body : {};
  const projectId = String(payload.projectId || current.projectId || "").trim();
  if (!projectId) {
    return res.status(400).json({ message: "Projeto obrigatorio." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const plate = normalizeVehiclePlate(payload.plate || payload.placa || current.plate || "");
  if (!plate) {
    return res.status(400).json({ message: "Placa obrigatoria." });
  }
  const duplicate = sstVehicles.find(
    (item) =>
      item &&
      String(item.id) !== vehicleId &&
      String(item.projectId) === projectId &&
      normalizeVehiclePlate(item.plate || "") === plate
  );
  if (duplicate) {
    return res.status(409).json({ message: "Ja existe veiculo com essa placa neste projeto." });
  }
  const updated = normalizeSstVehicle({
    ...current,
    ...payload,
    id: current.id,
    projectId,
    plate,
    createdAt: current.createdAt,
    createdBy: current.createdBy,
    updatedAt: new Date().toISOString(),
  });
  sstVehicles[index] = updated;
  saveSstVehicles(sstVehicles);
  appendAudit(
    "sst_vehicle_update",
    user ? user.id : null,
    { vehicleId: updated.id, projectId },
    getClientIp(req),
    projectId
  );
  return res.json({ vehicle: updated });
});

app.delete("/api/sst/vehicles/:id", requireAuth, requirePermission("gerenciarProjetos"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const vehicleId = String(req.params.id || "").trim();
  const index = sstVehicles.findIndex((item) => item && String(item.id) === vehicleId);
  if (index === -1) {
    return res.status(404).json({ message: "Veiculo nao encontrado." });
  }
  const current = sstVehicles[index];
  if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const updated = normalizeSstVehicle({
    ...current,
    status: "INATIVO",
    updatedAt: new Date().toISOString(),
  });
  sstVehicles[index] = updated;
  saveSstVehicles(sstVehicles);
  appendAudit(
    "sst_vehicle_delete",
    user ? user.id : null,
    { vehicleId, projectId: current.projectId },
    getClientIp(req),
    current.projectId
  );
  return res.json({ ok: true, vehicle: updated });
});

app.get("/api/sst/docs", requireAuth, requirePermission("verSST"), (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim();
  const allowed = new Set(getUserProjectIds(user));
  if (projectId && !allowed.has(projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  let list = sstDocs.filter((item) => !item.projectId || allowed.has(item.projectId));
  if (projectId) {
    list = list.filter((item) => item.projectId === projectId);
  }
  if (req.query.status) {
    const status = String(req.query.status || "").toUpperCase();
    list = list.filter((item) => String(item.status || "").toUpperCase() === status);
  }
  if (req.query.relatedId) {
    const relatedId = String(req.query.relatedId || "").trim();
    if (relatedId) {
      list = list.filter((item) => String(item.relatedId || "") === relatedId);
    }
  }
  if (req.query.q) {
    const term = normalizeSearchValue(req.query.q);
    list = list.filter(
      (item) =>
        normalizeSearchValue(item.activity || "").includes(term) ||
        normalizeSearchValue(item.aprCode || "").includes(term)
    );
  }
  list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return res.json({ docs: list });
});

app.post(
  "/api/sst/docs",
  requireAuth,
  requirePermission("verSST"),
  requireStorageWritable,
  (req, res) => {
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const projectId = String(payload.projectId || "").trim();
    if (!projectId) {
      return res.status(400).json({ message: "Projeto obrigatorio." });
    }
    const user = req.currentUser || getSessionUser(req);
    if (!userHasProjectAccess(user, projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    const record = normalizeSstDoc({
      ...payload,
      projectId,
      createdBy: payload.createdBy || (user ? user.id : ""),
      createdAt: payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (!record) {
      return res.status(400).json({ message: "Documentacao invalida." });
    }
    sstDocs = sstDocs.concat(record);
    saveSstDocs(sstDocs);
    touchCompat("sstDocs", projectId);
    appendAudit(
      "sst_doc_create",
      user ? user.id : null,
      { docId: record.id, projectId },
      getClientIp(req),
      projectId
    );
    broadcastSse("sst.docs.updated", { projectId });
    return res.json({ doc: record });
  }
);

app.put(
  "/api/sst/docs/:id",
  requireAuth,
  requireStorageWritable,
  (req, res) => {
    const docId = String(req.params.id || "").trim();
    const index = sstDocs.findIndex((item) => item && String(item.id) === docId);
    if (index === -1) {
      return res.status(404).json({ message: "Documentacao nao encontrada." });
    }
    const payload = req.body && typeof req.body === "object" ? req.body : {};
    const current = sstDocs[index];
    const user = req.currentUser || getSessionUser(req);
    if (current.projectId && !userHasProjectAccess(user, current.projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    const canManage =
      isMasterUser(user) ||
      isFullAccessRole(user.rbacRole || user.role) ||
      hasGranularPermission(user, "gerenciarSST");
    if (!canManage) {
      const isLiberacao = String(payload.source || current.source || "").toLowerCase() === "liberacao";
      const status = payload.status ? String(payload.status).toUpperCase() : "";
      const hasReviewFields =
        payload.reviewedAt ||
        payload.reviewedBy ||
        payload.reviewNotes ||
        payload.correctionInstructions ||
        payload.notifiedAt;
      if (!isLiberacao || !canSyncMaintenance(user) || (status && status !== "PENDENTE") || hasReviewFields) {
        return res.status(403).json({ message: "Nao autorizado." });
      }
    }
    const updated = normalizeSstDoc({
      ...current,
      ...payload,
      id: current.id,
      projectId: current.projectId,
      createdAt: current.createdAt,
      createdBy: current.createdBy,
      updatedAt: new Date().toISOString(),
    });
    sstDocs[index] = updated;
    saveSstDocs(sstDocs);
    touchCompat("sstDocs", current.projectId);
    appendAudit(
      "sst_doc_update",
      user ? user.id : null,
      { docId },
      getClientIp(req),
      current.projectId
    );
    broadcastSse("sst.docs.updated", { projectId: current.projectId });
    return res.json({ doc: updated });
  }
);

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
  const isSelfProfile = actor.id === targetUser.id;
  const wantsSensitiveUpdate =
    "uen" in req.body ||
    "projectId" in req.body ||
    "projeto" in req.body ||
    "project" in req.body ||
    "atribuicoes" in req.body;
  const wantsSettingsUpdate =
    "preferences" in req.body || "security" in req.body || "securitySettings" in req.body;
  const canEdit = canEditProfile(actor, targetUser);
  if ((wantsSensitiveUpdate && !canEdit) || (wantsSettingsUpdate && !(isSelfProfile || canEdit))) {
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
  if ("atribuicoes" in req.body) {
    updates.atribuicoes = String(req.body.atribuicoes || "").trim();
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
  if ("preferences" in req.body) {
    updates.preferences = normalizeProfilePreferences(req.body.preferences);
  }
  if ("security" in req.body || "securitySettings" in req.body) {
    updates.security = normalizeProfileSecurity(req.body.security || req.body.securitySettings);
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

app.get("/api/admin/access/storage", requireAuth, requireAccessView, (req, res) => {
  return res.json({
    dbEnabled: DB_ENABLED,
    dbReady,
    writeBlocked: isStorageWriteBlocked(),
  });
});

app.get("/api/admin/access/roles", requireAuth, requireAccessView, (req, res) => {
  const term = normalizeSearchValue(req.query.q || "");
  let list = sortAccessRolesByOrder(accessRoles);
  if (term) {
    list = list.filter((role) => {
      const name = normalizeSearchValue(role.name || "");
      const normalized = role.nameNormalized || normalizeAccessRoleName(role.name || "");
      return name.includes(term) || normalized.includes(term);
    });
  }
  return res.json({ roles: list });
});

app.get("/api/admin/access/roles/:id", requireAuth, requireAccessView, (req, res) => {
  const role = getAccessRoleById(req.params.id);
  if (!role) {
    return res.status(404).json({ message: "Cargo nao encontrado." });
  }
  return res.json({ role });
});

app.post(
  "/api/admin/access/roles",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const name = String(req.body.name || "").trim();
    if (!name) {
      return res.status(400).json({ message: "Informe o nome do cargo." });
    }
    const normalizedName = normalizeAccessRoleName(name);
    const conflict = accessRoles.find((role) => role.nameNormalized === normalizedName);
    if (conflict) {
      return res.status(409).json({ message: "Ja existe um cargo com esse nome." });
    }
    const basePermissions = normalizeAccessPermissionList(req.body.permissions || []);
    const withDefaults = new Set(ensureSectionPermissions(basePermissions));
    ACCESS_ROLE_DEFAULT_PERMISSION_KEYS.forEach((key) => withDefaults.add(key));
    const now = new Date().toISOString();
    const maxOrder = accessRoles.reduce((acc, role) => {
      const value = Number(role && role.order);
      return Number.isFinite(value) ? Math.max(acc, value) : acc;
    }, -1);
    const role = normalizeAccessRoleRecord({
      id: crypto.randomUUID(),
      name,
      permissions: Array.from(withDefaults),
      isSystem: false,
      order: maxOrder + 1,
      permissionsVersion: ACCESS_ROLE_PERMISSION_VERSION,
      createdAt: now,
      updatedAt: now,
    });
    if (!role) {
      return res.status(400).json({ message: "Cargo invalido." });
    }
    accessRoles = accessRoles.concat(role);
    saveAccessRoles(accessRoles);
    appendAudit("access_role_create", req.session.userId, { roleId: role.id }, getClientIp(req));
    broadcastSse("access.updated", { scope: "roles" });
    return res.json({ role });
  }
);

app.put(
  "/api/admin/access/roles/:id",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const roleId = String(req.params.id || "").trim();
    const index = accessRoles.findIndex((role) => String(role.id) === roleId);
    if (index === -1) {
      return res.status(404).json({ message: "Cargo nao encontrado." });
    }
    const current = accessRoles[index];
    const name = req.body.name !== undefined ? String(req.body.name || "").trim() : current.name;
    if (!name) {
      return res.status(400).json({ message: "Informe o nome do cargo." });
    }
    const normalizedName = normalizeAccessRoleName(name);
    const conflict = accessRoles.find(
      (role) => role.id !== current.id && role.nameNormalized === normalizedName
    );
    if (conflict) {
      return res.status(409).json({ message: "Ja existe um cargo com esse nome." });
    }
    const permissions =
      req.body.permissions !== undefined
        ? normalizeAccessPermissionList(req.body.permissions || [])
        : current.permissions;
    const order =
      req.body.order !== undefined && Number.isFinite(Number(req.body.order))
        ? Number(req.body.order)
        : current.order;
    const updated = normalizeAccessRoleRecord({
      ...current,
      name,
      permissions,
      order,
      updatedAt: new Date().toISOString(),
    });
    accessRoles[index] = updated;
    saveAccessRoles(accessRoles);
    appendAudit("access_role_update", req.session.userId, { roleId: updated.id }, getClientIp(req));
    broadcastSse("access.updated", { scope: "roles" });
    return res.json({ role: updated });
  }
);

app.delete(
  "/api/admin/access/roles/:id",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const roleId = String(req.params.id || "").trim();
    const role = getAccessRoleById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Cargo nao encontrado." });
    }
    if (role.isSystem) {
      return res.status(403).json({ message: "Cargo de sistema nao pode ser excluido." });
    }
    const inUse = users.some((user) => {
      if (!user) {
        return false;
      }
      if (String(user.roleId || "") === String(role.id)) {
        return true;
      }
      const name = normalizeAccessRoleName(user.roleName || user.cargo || user.role || "");
      return name && name === role.nameNormalized;
    });
    if (inUse) {
      return res.status(409).json({ message: "Cargo em uso por usuarios." });
    }
    accessRoles = accessRoles.filter((item) => String(item.id) !== roleId);
    saveAccessRoles(accessRoles);
    appendAudit("access_role_delete", req.session.userId, { roleId }, getClientIp(req));
    broadcastSse("access.updated", { scope: "roles" });
    return res.json({ ok: true });
  }
);

app.post(
  "/api/admin/access/roles/seed",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const result = seedDefaultAccessRolesIfEmpty();
    broadcastSse("access.updated", { scope: "roles" });
    return res.json({ ...result, roles: accessRoles });
  }
);

app.get("/api/admin/access/users", requireAuth, requireAccessView, (req, res) => {
  const term = normalizeSearchValue(req.query.q || "");
  const roleId = String(req.query.roleId || "").trim();
  const statusFilter = normalizeUserStatus(req.query.status || "");
  const projectId = String(req.query.projectId || "").trim();
  let list = users.slice();
  if (term) {
    list = list.filter((user) => {
      const name = normalizeSearchValue(user.name || "");
      const matricula = normalizeSearchValue(user.matricula || "");
      const email = normalizeSearchValue(user.email || user.username || "");
      return name.includes(term) || matricula.includes(term) || email.includes(term);
    });
  }
  if (roleId) {
    list = list.filter((user) => String(user.roleId || "") === roleId);
  }
  if (req.query.status) {
    list = list.filter((user) => normalizeUserStatus(user.status || "") === statusFilter);
  }
  if (projectId) {
    list = list.filter((user) => String(user.projectId || "") === projectId);
  }
  list.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
  return res.json({ users: list.map((user) => serializeAccessUser(user)) });
});

app.get("/api/admin/access/users/:id", requireAuth, requireAccessView, (req, res) => {
  const user = users.find((item) => item && String(item.id) === String(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "Usuario nao encontrado." });
  }
  return res.json({ user: serializeAccessUser(user) });
});

app.post(
  "/api/admin/access/users",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const payload = req.body || {};
    const name = String(payload.name || "").trim();
    const matricula = String(payload.matricula || "").trim();
    const email = String(payload.email || "").trim().toLowerCase();
    if (!name) {
      return res.status(400).json({ message: "Informe o nome do usuario." });
    }
    if (!matricula) {
      return res.status(400).json({ message: "Informe a matricula." });
    }
    if (!email) {
      return res.status(400).json({ message: "Informe o email do usuario." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Informe um email valido." });
    }
    const existingByMatricula = findUserByMatriculaNormalized(matricula);
    const existingByEmail = users.find(
      (user) => normalizeVerificationEmail(user.email || user.username || "") === email
    );
    const matriculaStatus = getUserStatus(existingByMatricula);
    const emailStatus = getUserStatus(existingByEmail);
    if (existingByMatricula && matriculaStatus !== "INATIVO") {
      return res.status(409).json({ message: "Matricula ja cadastrada." });
    }
    if (existingByEmail && emailStatus !== "INATIVO") {
      return res.status(409).json({ message: "Email ja cadastrado." });
    }
    if (
      existingByMatricula &&
      existingByEmail &&
      String(existingByMatricula.id) !== String(existingByEmail.id)
    ) {
      return res
        .status(409)
        .json({ message: "Matricula e email pertencem a contas diferentes." });
    }
    const roleId = String(payload.roleId || "").trim();
    const role = roleId ? getAccessRoleById(roleId) : null;
    if (!role) {
      return res.status(400).json({ message: "Cargo invalido." });
    }
    const projectId = payload.projectId ? String(payload.projectId).trim() : "";
    if (projectId && !getProjectById(projectId)) {
      return res.status(400).json({ message: "Projeto invalido." });
    }
    const status = normalizeUserStatus(payload.status || "ATIVO");
    const mode = String(payload.passwordMode || "MANUAL").toUpperCase();
    let password = String(payload.password || "");
    let generatedPassword = "";
    if (mode === "GERADA") {
      generatedPassword = generateRandomPassword(12);
      password = generatedPassword;
    }
    if (!password) {
      return res.status(400).json({ message: "Informe a senha." });
    }
    const now = new Date().toISOString();
    const passwordHash = hashPasswordSha256(password);
    const reuseTarget = existingByMatricula || existingByEmail;
    if (reuseTarget) {
      const rbacRole = deriveRbacRoleFromRoleName(role.name);
      const legacyRole = normalizeRole(role.name, rbacRole);
      const updated = normalizeUserRecord({
        ...reuseTarget,
        username: email,
        matricula,
        name,
        email,
        roleId: role.id,
        roleName: role.name,
        cargo: role.name,
        accessPermissions: role.permissions,
        rolePermissions: role.permissions,
        rbacRole,
        role: legacyRole,
        projectId: projectId || null,
        status,
        active: status !== "INATIVO",
        passwordHash,
        passwordUpdatedAt: now,
        emailVerified: true,
        updatedAt: now,
      });
      const index = users.findIndex((item) => item && String(item.id) === String(updated.id));
      if (index >= 0) {
        users[index] = updated;
      } else {
        users.push(updated);
      }
      writeJson(USERS_FILE, users);
      setUserProjectAssignment(updated, updated.projectId || "");
      appendAudit(
        "access_user_reactivate",
        req.session.userId,
        { alvo: updated.id },
        getClientIp(req)
      );
      broadcastSse("access.updated", { scope: "users" });
      return res.json({
        user: serializeAccessUser(updated),
        generatedPassword: generatedPassword || undefined,
        reactivated: true,
      });
    }
    const username = email;
    const created = normalizeUserRecord({
      id: crypto.randomUUID(),
      username,
      matricula,
      name,
      email,
      roleId: role.id,
      roleName: role.name,
      cargo: role.name,
      accessPermissions: role.permissions,
      rolePermissions: role.permissions,
      rbacRole: deriveRbacRoleFromRoleName(role.name),
      role: normalizeRole(role.name, deriveRbacRoleFromRoleName(role.name)),
      projectId: projectId || null,
      status,
      active: status !== "INATIVO",
      passwordHash,
      passwordUpdatedAt: now,
      emailVerified: true,
      createdAt: now,
      updatedAt: now,
    });
    users.push(created);
    writeJson(USERS_FILE, users);
    if (created.projectId) {
      setUserProjectAssignment(created, created.projectId);
    }
    appendAudit("access_user_create", req.session.userId, { alvo: created.id }, getClientIp(req));
    broadcastSse("access.updated", { scope: "users" });
    return res.json({
      user: serializeAccessUser(created),
      generatedPassword: generatedPassword || undefined,
    });
  }
);

app.put(
  "/api/admin/access/users/:id",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const id = String(req.params.id || "").trim();
    const index = users.findIndex((item) => item && String(item.id) === id);
    if (index === -1) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }
    const current = users[index];
    const payload = req.body || {};
    if (payload.name !== undefined && !String(payload.name || "").trim()) {
      return res.status(400).json({ message: "Informe o nome do usuario." });
    }
    let nextEmail = null;
    if (payload.email !== undefined) {
      nextEmail = String(payload.email || "").trim().toLowerCase();
      if (!nextEmail) {
        return res.status(400).json({ message: "Informe o email do usuario." });
      }
      if (!isValidEmail(nextEmail)) {
        return res.status(400).json({ message: "Informe um email valido." });
      }
      const emailDuplicado = users.some(
        (user) =>
          String(user.id) !== String(id) &&
          normalizeVerificationEmail(user.email || user.username || "") === nextEmail
      );
      if (emailDuplicado) {
        return res.status(409).json({ message: "Email ja cadastrado." });
      }
    }
    let roleId = current.roleId || "";
    let roleName = current.roleName || current.cargo || "";
    let rolePermissions = current.accessPermissions || current.rolePermissions || [];
    if (payload.roleId !== undefined) {
      const nextRoleId = String(payload.roleId || "").trim();
      if (!nextRoleId) {
        return res.status(400).json({ message: "Cargo invalido." });
      }
      const role = getAccessRoleById(nextRoleId);
      if (!role) {
        return res.status(400).json({ message: "Cargo invalido." });
      }
      roleId = role.id;
      roleName = role.name;
      rolePermissions = role.permissions;
    }
    const projectId =
      payload.projectId !== undefined ? String(payload.projectId || "").trim() : null;
    if (projectId && !getProjectById(projectId)) {
      return res.status(400).json({ message: "Projeto invalido." });
    }
    const status =
      payload.status !== undefined
        ? normalizeUserStatus(payload.status)
        : normalizeUserStatus(current.status || "");
    const updated = normalizeUserRecord({
      ...current,
      name: payload.name !== undefined ? String(payload.name || "").trim() : current.name,
      email:
        payload.email !== undefined ? nextEmail : current.email || "",
      username: payload.email !== undefined ? nextEmail : current.username || "",
      roleId,
      roleName,
      cargo: roleName || current.cargo || "",
      accessPermissions: rolePermissions,
      rolePermissions,
      projectId: payload.projectId !== undefined ? (projectId || null) : current.projectId || null,
      status,
      active: status !== "INATIVO",
      updatedAt: new Date().toISOString(),
    });
    users[index] = updated;
    writeJson(USERS_FILE, users);
    if (payload.projectId !== undefined) {
      setUserProjectAssignment(updated, updated.projectId || "");
    }
    appendAudit("access_user_update", req.session.userId, { alvo: updated.id }, getClientIp(req));
    broadcastSse("access.updated", { scope: "users" });
    return res.json({ user: serializeAccessUser(updated) });
  }
);

app.post(
  "/api/admin/access/users/:id/reset-password",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const id = String(req.params.id || "").trim();
    const index = users.findIndex((item) => item && String(item.id) === id);
    if (index === -1) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }
    const mode = String(req.body.mode || "MANUAL").toUpperCase();
    let password = String(req.body.password || "");
    let generatedPassword = "";
    if (mode === "GERADA") {
      generatedPassword = generateRandomPassword(12);
      password = generatedPassword;
    }
    if (!password) {
      return res.status(400).json({ message: "Informe a senha." });
    }
    const now = new Date().toISOString();
    const current = users[index];
    const updated = normalizeUserRecord({
      ...current,
      passwordHash: hashPasswordSha256(password),
      passwordUpdatedAt: now,
      updatedAt: now,
    });
    users[index] = updated;
    writeJson(USERS_FILE, users);
    appendAudit("access_user_reset_password", req.session.userId, { alvo: updated.id }, getClientIp(req));
    broadcastSse("access.updated", { scope: "users" });
    return res.json({
      user: serializeAccessUser(updated),
      generatedPassword: generatedPassword || undefined,
    });
  }
);

app.patch(
  "/api/admin/access/users/:id/status",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const id = String(req.params.id || "").trim();
    const index = users.findIndex((item) => item && String(item.id) === id);
    if (index === -1) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }
    const status = normalizeUserStatus(req.body.status || "");
    const now = new Date().toISOString();
    const current = users[index];
    const updated = normalizeUserRecord({
      ...current,
      status,
      active: status !== "INATIVO",
      updatedAt: now,
    });
    users[index] = updated;
    writeJson(USERS_FILE, users);
    appendAudit(
      "access_user_status",
      req.session.userId,
      { alvo: updated.id, status },
      getClientIp(req)
    );
    broadcastSse("access.updated", { scope: "users" });
    return res.json({ user: serializeAccessUser(updated) });
  }
);

app.delete(
  "/api/admin/access/users/:id",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const id = String(req.params.id || "").trim();
    const index = users.findIndex((item) => item && String(item.id) === id);
    if (index === -1) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }
    const actor = req.currentUser || getSessionUser(req);
    const target = users[index];
    if (actor && String(actor.id) === String(target.id)) {
      return res.status(400).json({ message: "Nao e permitido excluir a propria conta." });
    }
    if (isMasterUser(target)) {
      return res.status(403).json({ message: "Nao e permitido excluir a conta master." });
    }
    if (normalizeUserStatus(target.status || "") !== "INATIVO") {
      return res.status(400).json({ message: "Apenas contas inativas podem ser excluidas." });
    }
    users = users.filter((item) => String(item.id) !== id);
    writeJson(USERS_FILE, users);
    projectUsers = projectUsers.filter((entry) => entry && String(entry.userId) !== id);
    saveProjectUsers(projectUsers);
    appendAudit("access_user_delete", req.session.userId, { alvo: id }, getClientIp(req));
    broadcastSse("access.updated", { scope: "users" });
    return res.json({ ok: true, removedId: id });
  }
);

app.post(
  "/api/admin/access/import",
  requireAuth,
  requireAccessManage,
  requireStorageWritable,
  (req, res) => {
    const payload = req.body || {};
    const rolesPayload = Array.isArray(payload.roles)
      ? payload.roles.map(normalizeAccessRoleRecord).filter(Boolean)
      : [];
    const usersPayload = Array.isArray(payload.users) ? payload.users : [];
    const projectsPayload = Array.isArray(payload.projects)
      ? payload.projects.map(normalizeProject).filter(Boolean)
      : [];
    if (!rolesPayload.length) {
      return res.status(400).json({ message: "Arquivo sem cargos validos." });
    }
    if (!usersPayload.length) {
      return res.status(400).json({ message: "Arquivo sem contas validas." });
    }

    const rolesById = new Map(accessRoles.map((role) => [String(role.id), role]));
    rolesPayload.forEach((role) => {
      const id = String(role.id);
      const existing = rolesById.get(id);
      if (existing) {
        rolesById.set(id, {
          ...existing,
          ...role,
          isSystem: existing.isSystem || role.isSystem,
        });
      } else {
        rolesById.set(id, role);
      }
    });
    accessRoles = Array.from(rolesById.values());
    saveAccessRoles(accessRoles);

    if (projectsPayload.length) {
      const projectById = new Map(projects.map((project) => [String(project.id), project]));
      projectsPayload.forEach((project) => {
        const id = String(project.id);
        const existing = projectById.get(id);
        projectById.set(id, existing ? { ...existing, ...project } : project);
      });
      projects = Array.from(projectById.values());
      saveProjects(projects);
    } else {
      ensureDefaultProject();
    }

    let createdCount = 0;
    let updatedCount = 0;
    const now = new Date().toISOString();
    usersPayload.forEach((entry) => {
      if (!entry || typeof entry !== "object") {
        return;
      }
      const name = String(entry.name || "").trim();
      const matricula = String(entry.matricula || "").trim();
      if (!name || !matricula) {
        return;
      }
      const incomingId = String(entry.id || "").trim() || crypto.randomUUID();
      const existing =
        users.find((user) => String(user.id) === incomingId) ||
        findUserByMatriculaNormalized(matricula);
      const base = existing ? { ...existing } : { id: incomingId, createdAt: now };
      const roleId = String(entry.roleId || "").trim();
      const roleName = String(entry.roleName || entry.cargo || entry.role || "").trim();
      const role = roleId ? getAccessRoleById(roleId) : getAccessRoleByName(roleName);
      const accessPermissions = Array.isArray(entry.accessPermissions)
        ? entry.accessPermissions
        : Array.isArray(entry.rolePermissions)
          ? entry.rolePermissions
          : role
            ? role.permissions
            : base.accessPermissions || [];
      const projectIdRaw = entry.projectId ? String(entry.projectId).trim() : "";
      const projectId = projectIdRaw && getProjectById(projectIdRaw) ? projectIdRaw : "";
      const status = normalizeUserStatus(entry.status || base.status || "ATIVO");
      const merged = normalizeUserRecord({
        ...base,
        id: existing ? base.id : incomingId,
        username:
          entry.username || entry.email || base.username || String(entry.matricula || "").trim(),
        name,
        matricula,
        email: String(entry.email || base.email || "").trim().toLowerCase(),
        roleId: role ? role.id : roleId || base.roleId || "",
        roleName: role ? role.name : roleName || base.roleName || "",
        cargo: entry.cargo || roleName || base.cargo || "",
        accessPermissions,
        rolePermissions: accessPermissions,
        projectId: projectId || null,
        status,
        active: status !== "INATIVO",
        passwordHash: String(entry.passwordHash || base.passwordHash || "").trim(),
        passwordUpdatedAt: entry.passwordUpdatedAt || base.passwordUpdatedAt || now,
        emailVerified: entry.emailVerified !== undefined ? entry.emailVerified : true,
        uen: entry.uen || base.uen || "",
        atribuicoes: entry.atribuicoes || base.atribuicoes || "",
        avatarUrl: entry.avatarUrl || base.avatarUrl || "",
        avatarUpdatedAt: entry.avatarUpdatedAt || base.avatarUpdatedAt || "",
        createdAt: base.createdAt || entry.createdAt || now,
        updatedAt: now,
      });
      if (existing) {
        const index = users.findIndex((user) => user && user.id === base.id);
        if (index >= 0) {
          users[index] = merged;
        } else {
          users.push(merged);
        }
        updatedCount += 1;
      } else {
        users.push(merged);
        createdCount += 1;
      }
      if (entry.projectId !== undefined) {
        setUserProjectAssignment(merged, merged.projectId || "");
      }
    });
    writeJson(USERS_FILE, users);
    appendAudit(
      "access_import",
      req.session.userId,
      {
        roles: rolesPayload.length,
        users: createdCount + updatedCount,
        created: createdCount,
        updated: updatedCount,
      },
      getClientIp(req)
    );
    return res.json({
      ok: true,
      counts: {
        roles: accessRoles.length,
        users: users.length,
        created: createdCount,
        updated: updatedCount,
        projects: projects.length,
      },
    });
  }
);

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

app.get("/api/admin/storage", requireAuth, requirePermission("verDiagnostico"), (req, res) => {
  return res.json(getStorageSnapshot());
});

app.get("/api/admin/storage/check", requireAuth, requirePermission("verDiagnostico"), async (req, res) => {
  const dbUploadsCount = await getUploadsCount();
  return res.json({
    ...getStorageSnapshot(),
    filesMetaCount: Array.isArray(filesMeta) ? filesMeta.length : 0,
    dbUploadsCount,
  });
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
  "/api/maintenance/liberacao-doc",
  requireAuth,
  requirePermission("complete"),
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
    const docType = String(parsed.fields.type || "").trim().toLowerCase();
    if (!LIBERACAO_DOC_TYPES.has(docType)) {
      return res.status(400).json({ message: "Tipo de documento inválido." });
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
    const baseName = sanitizeFileName(path.parse(parsed.file.originalName || "documento").name);
    const unique = crypto.randomUUID().slice(0, 8);
    const safeType = sanitizeFileName(docType || "doc");
    const fileName = `${Date.now()}-${unique}-${safeType}-${baseName || "documento"}.${ext}`;
    const typeConfig = FILE_TYPE_CONFIG.liberacao;
    const typeKey = "liberacao";
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
      type: typeKey,
      size: parsed.file.buffer.length,
      mime,
      url: `/uploads/files/${typeConfig.dir}/${fileName}`,
      createdAt: new Date().toISOString(),
      createdBy: actor ? actor.id : "",
      createdByName: actor ? actor.name : "",
      projectId,
    };
    await upsertUploadBlob(entry, parsed.file.buffer);
    appendAudit(
      "file_upload",
      actor ? actor.id : null,
      { fileId: entry.id, name: entry.originalName, type: entry.type, projectId },
      getClientIp(req),
      projectId
    );
    return res.json({
      ok: true,
      file: {
        id: entry.id,
        url: entry.url,
        name: entry.originalName,
        originalName: entry.originalName,
        mime: entry.mime,
        docType,
      },
    });
  }
);

app.post(
  "/api/maintenance/evidence",
  requireAuth,
  requirePermission("complete"),
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
    const mime = String(parsed.file.mime || "").toLowerCase();
    if (!mime || !mime.startsWith("image/") || !FILE_ALLOWED_MIME.has(mime)) {
      return res.status(415).json({ message: "Apenas imagens são permitidas." });
    }
    if (!parsed.file.buffer || parsed.file.buffer.length === 0) {
      return res.status(400).json({ message: "Arquivo inválido." });
    }
    if (parsed.file.buffer.length > FILE_MAX_BYTES) {
      return res.status(413).json({ message: "Arquivo acima de 10 MB." });
    }
    ensureUploadDirs();
    const ext = FILE_ALLOWED_MIME.get(mime);
    const baseName = sanitizeFileName(path.parse(parsed.file.originalName || "evidencia").name);
    const unique = crypto.randomUUID().slice(0, 8);
    const fileName = `${Date.now()}-${unique}-${baseName || "evidencia"}.${ext}`;
    const typeConfig = FILE_TYPE_CONFIG.evidence;
    const typeKey = "evidence";
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
      type: typeKey,
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
  if (!canSyncMaintenance(user)) {
    logMaintenanceSync("denied", {
      projectId,
      userId: user ? user.id : "",
      role: user ? user.role || user.cargo || "" : "",
      accessPermissions: user ? user.accessPermissions || [] : [],
    });
    return res.status(403).json({ message: "Sem permissão para editar manutenções." });
  }
  const incoming = Array.isArray(req.body.items) ? req.body.items : [];
  const sanitized = incoming
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      ...item,
      projectId,
    }));
  logMaintenanceSync("request", {
    projectId,
    userId: user ? user.id : "",
    count: sanitized.length,
  });
  const existing = loadMaintenanceData();
  const tombstones = getMaintenanceTombstonesMap(projectId);
  const existingProject = existing
    .filter((item) => item && item.projectId === projectId)
    .filter((item) => !tombstones.has(String(item.id || "")));
  const existingMap = new Map(
    existingProject.map((item) => [String(item.id || ""), item]).filter(([id]) => id)
  );
  const createdItems = [];
  const mergedMap = new Map(existingMap);
  sanitized.forEach((item) => {
    if (!item || !item.id) {
      return;
    }
    const key = String(item.id);
    if (tombstones.has(key)) {
      if (shouldLogMaintenanceSync(item, projectId)) {
        logMaintenanceSync("skip.tombstone", {
          projectId,
          userId: user ? user.id : "",
          id: key,
        });
      }
      return;
    }
    const current = mergedMap.get(key) || null;
    if (!current) {
      createdItems.push(item);
    }
    const mergedItem = pickMaintenanceMerge(current, item);
    if (shouldLogMaintenanceSync(item, projectId) || shouldLogMaintenanceSync(current, projectId)) {
      logMaintenanceSync("merge", {
        projectId,
        userId: user ? user.id : "",
        incoming: summarizeMaintenanceSyncItem(item),
        current: summarizeMaintenanceSyncItem(current),
        merged: summarizeMaintenanceSyncItem(mergedItem),
      });
    }
    mergedMap.set(key, mergedItem);
  });
  let mergedProject = Array.from(mergedMap.values()).filter(Boolean);
  const deduped = dedupeMaintenanceRecords(mergedProject, projectId);
  if (deduped.changed) {
    mergedProject = deduped.list;
  }
  const filtered = existing.filter((item) => !(item && item.projectId === projectId));
  const merged = [...filtered, ...mergedProject];
  writeJson(MAINTENANCE_FILE, merged);
  touchCompat("maintenance", projectId);
  DASHBOARD_CACHE.delete(projectId);
  if (createdItems.length) {
    const ip = getClientIp(req);
    runAutomationsForItems("maintenance_created", createdItems, user, ip).catch((error) => {
      console.warn(
        "Automacoes falharam.",
        error && error.message ? error.message : error
      );
    });
    notifyProjectTeamMaintenanceCreated(createdItems, user, ip, projectId).catch((error) => {
      console.warn(
        "Aviso de nova manutencao falhou.",
        error && error.message ? error.message : error
      );
    });
  }
  broadcastSse("maintenance.updated", {
    projectId,
    count: sanitized.length,
    source: "sync",
  });
  return res.json({ ok: true, count: sanitized.length, project: projectId });
});

app.get("/api/maintenance/templates", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const fromQuery = String(req.query.projectId || "").trim();
  const projectId = fromQuery || getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatorio." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const dataset = loadMaintenanceTemplates();
  const list = dataset.filter((item) => item && item.projectId === projectId);
  return res.json({ items: list, projectId });
});

app.post("/api/maintenance/templates/sync", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const fromQuery = String(req.query.projectId || "").trim();
  const fromBody = String(req.body.projectId || "").trim();
  const projectId = fromBody || fromQuery || getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatorio." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  if (!canManageMaintenanceTemplates(user)) {
    return res.status(403).json({ message: "Sem permissao para atualizar modelos." });
  }
  const incoming = Array.isArray(req.body.items) ? req.body.items : [];
  const sanitized = incoming
    .filter((item) => item && typeof item === "object")
    .map((item) => normalizeMaintenanceTemplateRecord(item, projectId))
    .filter(Boolean);
  const existing = loadMaintenanceTemplates();
  const filtered = existing.filter((item) => !(item && item.projectId === projectId));
  const merged = [...filtered, ...sanitized];
  saveMaintenanceTemplates(merged);
  touchCompat("templates", projectId);
  broadcastSse("templates.updated", {
    projectId,
    count: sanitized.length,
    source: "sync",
  });
  return res.json({ ok: true, count: sanitized.length, projectId });
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
  const tombstones = getMaintenanceTombstonesMap(projectId);
  const dataset = loadMaintenanceData();
  let list = dataset.filter((item) => {
    if (!item || item.projectId !== projectId) {
      return false;
    }
    return !tombstones.has(String(item.id || ""));
  });
  const deduped = dedupeMaintenanceRecords(list, projectId);
  if (deduped.changed) {
    list = deduped.list;
    const filtered = dataset.filter((item) => !(item && item.projectId === projectId));
    writeJson(MAINTENANCE_FILE, [...filtered, ...list]);
    touchCompat("maintenance", projectId);
  }
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
    return res.status(403).json({ message: "Sem permissão para remover manutenções." });
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
  touchCompat("maintenance", projectId);
  addMaintenanceTombstone(projectId, maintenanceId, user ? user.id : null);
  DASHBOARD_CACHE.delete(projectId);
  appendAudit(
    "maintenance_delete",
    user ? user.id : null,
    { manutencaoId: maintenanceId, projectId },
    getClientIp(req),
    projectId
  );
  broadcastSse("maintenance.updated", {
    projectId,
    removedId: maintenanceId,
    source: "delete",
  });
  return res.json({ ok: true, removedId: maintenanceId, projectId });
});

app.post("/api/maintenance/reopen", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  if (!canReopenMaintenance(user)) {
    return res.status(403).json({ message: "Sem permissão para reabrir manutenções." });
  }
  const maintenanceId = String(req.body.id || req.body.maintenanceId || "").trim();
  if (!maintenanceId) {
    return res.status(400).json({ message: "Manutenção inválida." });
  }
  const dataset = loadMaintenanceData();
  const index = dataset.findIndex(
    (item) => item && String(item.id || "") === maintenanceId && item.projectId === projectId
  );
  if (index === -1) {
    return res.status(404).json({ message: "Manutenção não encontrada." });
  }
  const item = dataset[index];
  if (normalizeStatus(item.status) !== "concluida") {
    return res.status(409).json({ message: "Manutenção não está concluída." });
  }
  const now = new Date().toISOString();
  const historico = Array.isArray(item.conclusoesAnteriores)
    ? item.conclusoesAnteriores.slice()
    : [];
  if (item.conclusao) {
    historico.push({
      ...item.conclusao,
      archivedAt: now,
      archivedBy: user ? user.id : null,
    });
  }
  const updated = {
    ...item,
    status: "em_execucao",
    executionFinishedAt: "",
    doneAt: "",
    doneBy: "",
    conclusao: null,
    conclusoesAnteriores: historico,
    reopenedAt: now,
    reopenedBy: user ? user.id : null,
    updatedAt: now,
    updatedBy: user ? user.id : null,
  };
  if (!updated.executionStartedAt) {
    updated.executionStartedAt = now;
  }
  dataset[index] = updated;
  writeJson(MAINTENANCE_FILE, dataset);
  touchCompat("maintenance", projectId);
  DASHBOARD_CACHE.delete(projectId);
  appendAudit(
    "maintenance_reopen",
    user ? user.id : null,
    { manutencaoId: maintenanceId, projectId },
    getClientIp(req),
    projectId
  );
  broadcastSse("maintenance.updated", {
    projectId,
    id: maintenanceId,
    source: "reopen",
  });
  return res.json({ ok: true, item: updated, projectId });
});

app.get("/api/announcements", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectFilter = String(req.query.projectId || "").trim();
  const list = Array.isArray(announcements) ? announcements.slice() : [];
  const filtered = list.filter((item) => {
    if (!item) {
      return false;
    }
    if (projectFilter && item.projectId && String(item.projectId) !== projectFilter) {
      return false;
    }
    return canReceiveAnnouncement(item, user);
  });
  return res.json({ items: filtered });
});

app.post(
  "/api/announcements",
  requireAuth,
  requirePermission("criarAnuncios"),
  requireStorageWritable,
  (req, res) => {
    const user = req.currentUser || getSessionUser(req);
    const payload = req.body || {};
    const senderRank = getUserHierarchyRank(user);
    const record = normalizeAnnouncementRecord({
      ...payload,
      createdBy: user ? user.id : "",
      createdByName: user ? getUserLabel(user) : "",
      senderRank,
      senderRoleLabel: user ? (user.cargo || user.roleName || user.role || "") : "",
    });
    if (!record) {
      return res.status(400).json({ message: "Anúncio inválido." });
    }
    if (record.scope === "project" && record.projectId) {
      if (!userHasProjectAccess(user, record.projectId)) {
        return res.status(403).json({ message: "Nao autorizado." });
      }
    }
    announcements = [record, ...announcements];
    saveAnnouncements(announcements);
    touchCompat("announcements", record.projectId || "");
    appendAudit(
      "announcement_create",
      user ? user.id : null,
      { announcementId: record.id, projectId: record.projectId || "" },
      getClientIp(req),
      record.projectId || null
    );
    broadcastSse("announcement.created", {
      projectId: record.scope === "project" ? record.projectId : "",
      announcementId: record.id,
    });
    return res.json({ item: record });
  }
);

app.post("/api/announcements/read", requireAuth, requireStorageWritable, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const ids = Array.isArray(req.body.ids)
    ? req.body.ids
    : req.body.id
      ? [req.body.id]
      : [];
  const normalized = ids.map((id) => String(id || "").trim()).filter(Boolean);
  if (!normalized.length) {
    return res.json({ ok: true, updated: 0 });
  }
  let changed = false;
  const now = new Date().toISOString();
  announcements = announcements.map((item) => {
    if (!item || !normalized.includes(String(item.id))) {
      return item;
    }
    if (!canReceiveAnnouncement(item, user)) {
      return item;
    }
    const readBy = Array.isArray(item.readBy) ? item.readBy.slice() : [];
    const existing = readBy.find(
      (entry) => entry && String(entry.userId || entry.id || entry.user || "") === String(user.id)
    );
    if (existing) {
      return item;
    }
    readBy.push({ userId: user.id, readAt: now });
    changed = true;
    return { ...item, readBy };
  });
  if (changed) {
    saveAnnouncements(announcements);
    touchCompat("announcements");
    broadcastSse("announcements.updated", { projectId: "" });
  }
  return res.json({ ok: true, updated: changed ? normalized.length : 0 });
});

app.get("/api/feedbacks", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.query.projectId || "").trim() || getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const list = Array.isArray(feedbacks) ? feedbacks : [];
  const visible = list.filter(
    (item) =>
      item &&
      item.projectId === projectId &&
      (String(item.to) === String(user.id) || String(item.from) === String(user.id))
  );
  return res.json({ items: visible });
});

app.post("/api/feedbacks", requireAuth, requireStorageWritable, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = String(req.body.projectId || "").trim() || getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  if (!userHasProjectAccess(user, projectId)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  const payload = {
    ...req.body,
    projectId,
    from: user ? user.id : "",
    fromName: user ? getUserLabel(user) : "",
  };
  const record = normalizeFeedbackRecord(payload);
  if (!record) {
    return res.status(400).json({ message: "Feedback inválido." });
  }
  const receiver = users.find((entry) => entry && String(entry.id) === String(record.to));
  if (receiver) {
    record.toName = record.toName || getUserLabel(receiver);
  }
  feedbacks = [record, ...feedbacks];
  saveFeedbacks(feedbacks);
  touchCompat("feedbacks", projectId);
  appendAudit(
    "feedback_create",
    user ? user.id : null,
    { feedbackId: record.id, projectId },
    getClientIp(req),
    projectId
  );
  broadcastSse("feedback.created", { projectId, feedbackId: record.id });
  return res.json({ item: record });
});

app.post("/api/feedbacks/read", requireAuth, requireStorageWritable, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const ids = Array.isArray(req.body.ids)
    ? req.body.ids
    : req.body.id
      ? [req.body.id]
      : [];
  const normalized = ids.map((id) => String(id || "").trim()).filter(Boolean);
  if (!normalized.length) {
    return res.json({ ok: true, updated: 0 });
  }
  let changed = false;
  const now = new Date().toISOString();
  feedbacks = feedbacks.map((item) => {
    if (!item || !normalized.includes(String(item.id))) {
      return item;
    }
    if (String(item.to) !== String(user.id)) {
      return item;
    }
    if (item.readAt) {
      return item;
    }
    changed = true;
    return { ...item, readAt: now };
  });
  if (changed) {
    saveFeedbacks(feedbacks);
    touchCompat("feedbacks");
    broadcastSse("feedbacks.updated", { projectId: "" });
  }
  return res.json({ ok: true, updated: changed ? normalized.length : 0 });
});

app.post(
  "/api/rdo/generate-text",
  requireAuth,
  requirePermission("gerarRDOs"),
  async (req, res) => {
    const user = req.currentUser || getSessionUser(req);
    const body = req.body || {};
    const debugEnabled = String(body.debug || req.query.debug || "").trim() === "1";
    const projectId =
      String(body.projectId || "").trim() || getActiveProjectId(req, user);
    if (!projectId) {
      return res.status(400).json({ message: "Projeto ativo obrigatório." });
    }
    if (!userHasProjectAccess(user, projectId)) {
      return res.status(403).json({ message: "Nao autorizado." });
    }
    const dateRaw = String(body.date || body.rdoDate || body.day || "").trim();
    const date = parseDateOnly(dateRaw) || startOfDay(new Date());
    const dateStr = formatDateISO(date);
    const force = String(body.force || req.query.force || "").trim() === "1";
    if (!force) {
      const cached = getRdoCache(projectId, dateStr);
      if (cached) {
        return res.json({
          ok: true,
          result: cached.result || cached,
          payload: cached.payload || null,
          source: cached.source || "cache",
          cached: true,
          debug: debugEnabled
            ? {
                model: OPENAI_MODEL,
                note: "Resposta servida do cache.",
              }
            : undefined,
        });
      }
    }

    const payload = buildRdoPayload(dateStr, projectId);
    let result = null;
    let source = "fallback";
    let aiError = null;
    try {
      result = await generateRdoTextWithAI(payload);
      source = "ai";
    } catch (error) {
      result = null;
      source = "fallback";
      aiError = error;
      console.warn(
        "[rdo-ai] falha ao gerar texto:",
        error && error.message ? error.message : error
      );
    }
    const finalResult = result || generateRdoTextDeterministic(payload);
    setRdoCache(projectId, dateStr, { result: finalResult, payload, source });
    return res.json({
      ok: true,
      result: finalResult,
      payload,
      source,
      cached: false,
      debug: debugEnabled
        ? {
            model: OPENAI_MODEL,
            error: aiError ? (aiError.message || String(aiError)) : null,
          }
        : undefined,
    });
  }
);

app.post("/api/maintenance/release", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  if (!projectId) {
    return res.status(400).json({ message: "Projeto ativo obrigatório." });
  }
  if (!canSyncMaintenance(user)) {
    return res.status(403).json({ message: "Sem permissão para editar manutenções." });
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
    "permissions" in req.body ||
    "atribuicoes" in req.body ||
    "preferences" in req.body ||
    "security" in req.body ||
    "securitySettings" in req.body;

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
  if ("atribuicoes" in req.body) {
    updates.atribuicoes = String(req.body.atribuicoes || "").trim();
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
  if ("preferences" in req.body) {
    updates.preferences = normalizeProfilePreferences(req.body.preferences);
  }
  if ("security" in req.body || "securitySettings" in req.body) {
    updates.security = normalizeProfileSecurity(req.body.security || req.body.securitySettings);
  }
  if (roleChanged) {
    updates.sections = buildSections(
      nextRbacRole,
      current.sections,
      current.accessPermissions || current.rolePermissions
    );
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
  const code = createVerificationCode();
  const tokenHash = hashToken(token);
  const codeHash = hashToken(code);
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + VERIFICATION_TTL_HOURS * 60 * 60 * 1000).toISOString();
  const verification = {
    tokenHash,
    codeHash,
    userId: user.id,
    email: normalizeVerificationEmail(email),
    createdAt,
    lastSentAt: createdAt,
    expiresAt,
    attempts: 0,
  };
  let emailSent = false;
  let verificationRequired = true;
  try {
    emailSent = await sendVerificationEmail(email, nome, token, code);
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
  return res.json({
    ok: true,
    verificationRequired,
    pendingEmail: normalizeVerificationEmail(email),
  });
});

app.post("/api/auth/verify-code", (req, res) => {
  cleanupVerifications();
  const email = normalizeVerificationEmail(req.body.email);
  const code = String(req.body.code || "").replace(/\D/g, "");
  if (!email || !code) {
    return res.status(400).json({ message: "Informe e-mail e codigo." });
  }
  const recordIndex = findVerificationIndexByEmail(email);
  if (recordIndex === -1) {
    return res.status(400).json({ message: "Codigo invalido ou expirado." });
  }
  const record = verifications[recordIndex];
  if (isVerificationExpired(record)) {
    verifications.splice(recordIndex, 1);
    writeJson(VERIFICATIONS_FILE, verifications);
    return res.status(410).json({ message: "Codigo expirado." });
  }
  if (!record.codeHash) {
    return res.status(400).json({ message: "Codigo indisponivel. Use o link de verificacao." });
  }
  const attempts = Number(record.attempts || 0);
  if (attempts >= VERIFICATION_MAX_ATTEMPTS) {
    return res.status(429).json({ message: "Tentativas esgotadas. Reenvie um novo codigo." });
  }
  if (hashToken(code) !== record.codeHash) {
    const nextAttempts = attempts + 1;
    verifications[recordIndex] = { ...record, attempts: nextAttempts };
    writeJson(VERIFICATIONS_FILE, verifications);
    const remaining = Math.max(0, VERIFICATION_MAX_ATTEMPTS - nextAttempts);
    const message = remaining
      ? `Codigo invalido. Tentativas restantes: ${remaining}.`
      : "Tentativas esgotadas. Reenvie um novo codigo.";
    return res.status(400).json({ message, remainingAttempts: remaining });
  }
  const activation = activateUserByVerification(record);
  if (activation.error) {
    verifications.splice(recordIndex, 1);
    writeJson(VERIFICATIONS_FILE, verifications);
    return res.status(activation.error).json({ message: activation.message });
  }
  const updated = activation.user;
  verifications.splice(recordIndex, 1);
  writeJson(USERS_FILE, users);
  writeJson(VERIFICATIONS_FILE, verifications);
  appendAudit(
    "email_verify",
    updated.id,
    { email: updated.email, method: "code" },
    getClientIp(req)
  );
  return res.json({ ok: true, user: sanitizeUser(updated) });
});

app.post("/api/auth/verify/resend", async (req, res) => {
  cleanupVerifications();
  const email = normalizeVerificationEmail(req.body.email);
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: "Informe um e-mail valido." });
  }
  const user = users.find(
    (item) => normalizeVerificationEmail(item.email || item.username || item.matricula) === email
  );
  if (!user || user.emailVerified !== false) {
    return res.json({ ok: true, verificationRequired: false });
  }
  const existingIndex = findVerificationIndexByUserId(user.id);
  const existingRecord = existingIndex >= 0 ? verifications[existingIndex] : null;
  if (existingRecord && existingRecord.lastSentAt) {
    const elapsed = Date.now() - new Date(existingRecord.lastSentAt).getTime();
    if (elapsed < VERIFICATION_RESEND_COOLDOWN_MS) {
      const retryAfter = Math.ceil((VERIFICATION_RESEND_COOLDOWN_MS - elapsed) / 1000);
      return res.status(429).json({
        message: `Aguarde ${retryAfter}s para reenviar o codigo.`,
        retryAfter,
      });
    }
  }
  const token = createVerificationToken();
  const code = createVerificationCode();
  let emailSent = false;
  try {
    emailSent = await sendVerificationEmail(email, user.name, token, code);
  } catch (error) {
    emailSent = false;
  }
  if (!emailSent) {
    return res.status(503).json({ message: "Envio de e-mail indisponivel." });
  }
  const now = new Date().toISOString();
  const nextRecord = {
    tokenHash: hashToken(token),
    codeHash: hashToken(code),
    userId: user.id,
    email,
    createdAt: now,
    lastSentAt: now,
    expiresAt: new Date(Date.now() + VERIFICATION_TTL_HOURS * 60 * 60 * 1000).toISOString(),
    attempts: 0,
  };
  if (existingIndex >= 0) {
    verifications[existingIndex] = nextRecord;
  } else {
    verifications.push(nextRecord);
  }
  writeJson(VERIFICATIONS_FILE, verifications);
  appendAudit("email_verify_resend", user.id, { email }, getClientIp(req));
  return res.json({ ok: true, verificationRequired: true, pendingEmail: email });
});

app.post("/api/auth/password-reset/request", async (req, res) => {
  const email = normalizeVerificationEmail(req.body.email);
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: "Informe um email valido." });
  }
  if (isStorageWriteBlocked()) {
    res.setHeader("Retry-After", "60");
    return res.status(503).json({ message: STORAGE_READONLY_MESSAGE });
  }
  cleanupPasswordResets();
  const user = users.find(
    (item) => normalizeVerificationEmail(item.email || item.username || "") === email
  );
  if (!user) {
    return res.json({ ok: true });
  }
  if (user.active === false || String(user.status || "").toUpperCase() === "INATIVO") {
    return res.json({ ok: true });
  }
  const existingIndex = findPasswordResetIndexByEmail(email);
  const existingRecord = existingIndex >= 0 ? passwordResets[existingIndex] : null;
  if (existingRecord && existingRecord.lastSentAt && !isPasswordResetExpired(existingRecord)) {
    const elapsed = Date.now() - new Date(existingRecord.lastSentAt).getTime();
    if (elapsed < PASSWORD_RESET_RESEND_COOLDOWN_MS) {
      return res.json({ ok: true });
    }
  }
  const code = createVerificationCode();
  let emailSent = false;
  try {
    emailSent = await sendPasswordResetEmail(email, user.name, code);
  } catch (error) {
    emailSent = false;
  }
  if (!emailSent) {
    return res.status(503).json({ message: "Envio de email indisponivel." });
  }
  const now = new Date().toISOString();
  const nextRecord = {
    email,
    userId: user.id,
    codeHash: hashToken(code),
    createdAt: now,
    lastSentAt: now,
    expiresAt: new Date(Date.now() + PASSWORD_RESET_TTL_MINUTES * 60 * 1000).toISOString(),
    attempts: 0,
  };
  if (existingIndex >= 0) {
    passwordResets[existingIndex] = nextRecord;
  } else {
    passwordResets.push(nextRecord);
  }
  writeJson(PASSWORD_RESETS_FILE, passwordResets);
  appendAudit("password_reset_request", user.id, { email }, getClientIp(req));
  return res.json({ ok: true });
});

app.post("/api/auth/password-reset/validate", (req, res) => {
  const email = normalizeVerificationEmail(req.body.email);
  const code = String(req.body.code || "").replace(/\D/g, "");
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: "Informe um email valido." });
  }
  if (!code) {
    return res.status(400).json({ message: "Informe o codigo." });
  }
  if (isStorageWriteBlocked()) {
    res.setHeader("Retry-After", "60");
    return res.status(503).json({ message: STORAGE_READONLY_MESSAGE });
  }
  cleanupPasswordResets();
  const recordIndex = findPasswordResetIndexByEmail(email);
  if (recordIndex === -1) {
    return res.status(400).json({ message: "Codigo invalido ou expirado." });
  }
  const record = passwordResets[recordIndex];
  if (isPasswordResetExpired(record)) {
    passwordResets.splice(recordIndex, 1);
    writeJson(PASSWORD_RESETS_FILE, passwordResets);
    return res.status(410).json({ message: "Codigo expirado." });
  }
  if (!record.codeHash) {
    return res.status(400).json({ message: "Codigo invalido ou expirado." });
  }
  const attempts = Number(record.attempts || 0);
  if (attempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
    return res.status(429).json({ message: "Tentativas esgotadas. Solicite novo codigo." });
  }
  if (hashToken(code) !== record.codeHash) {
    const nextAttempts = attempts + 1;
    passwordResets[recordIndex] = { ...record, attempts: nextAttempts };
    writeJson(PASSWORD_RESETS_FILE, passwordResets);
    const remaining = Math.max(0, PASSWORD_RESET_MAX_ATTEMPTS - nextAttempts);
    const message = remaining
      ? `Codigo invalido. Tentativas restantes: ${remaining}.`
      : "Tentativas esgotadas. Solicite novo codigo.";
    return res.status(400).json({ message, remainingAttempts: remaining });
  }
  passwordResets[recordIndex] = { ...record, validatedAt: new Date().toISOString() };
  writeJson(PASSWORD_RESETS_FILE, passwordResets);
  return res.json({ ok: true });
});

app.post("/api/auth/password-reset/confirm", async (req, res) => {
  const email = normalizeVerificationEmail(req.body.email);
  const code = String(req.body.code || "").replace(/\D/g, "");
  const password = String(req.body.password || req.body.senha || "").trim();
  const passwordConfirm = String(req.body.passwordConfirm || req.body.senhaConfirm || "").trim();
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ message: "Informe um email valido." });
  }
  if (!code) {
    return res.status(400).json({ message: "Informe o codigo." });
  }
  if (isStorageWriteBlocked()) {
    res.setHeader("Retry-After", "60");
    return res.status(503).json({ message: STORAGE_READONLY_MESSAGE });
  }
  const passwordCheck = validatePassword(password);
  if (!password || !passwordCheck.ok) {
    return res.status(400).json({ message: "Senha fora da politica.", rules: passwordCheck.rules });
  }
  if (!passwordConfirm || passwordConfirm !== password) {
    return res.status(400).json({ message: "As senhas nao conferem." });
  }
  cleanupPasswordResets();
  const recordIndex = findPasswordResetIndexByEmail(email);
  if (recordIndex === -1) {
    return res.status(400).json({ message: "Codigo invalido ou expirado." });
  }
  const record = passwordResets[recordIndex];
  if (isPasswordResetExpired(record)) {
    passwordResets.splice(recordIndex, 1);
    writeJson(PASSWORD_RESETS_FILE, passwordResets);
    return res.status(410).json({ message: "Codigo expirado." });
  }
  if (!record.codeHash) {
    return res.status(400).json({ message: "Codigo invalido ou expirado." });
  }
  const attempts = Number(record.attempts || 0);
  if (attempts >= PASSWORD_RESET_MAX_ATTEMPTS) {
    return res.status(429).json({ message: "Tentativas esgotadas. Solicite novo codigo." });
  }
  if (hashToken(code) !== record.codeHash) {
    const nextAttempts = attempts + 1;
    passwordResets[recordIndex] = { ...record, attempts: nextAttempts };
    writeJson(PASSWORD_RESETS_FILE, passwordResets);
    const remaining = Math.max(0, PASSWORD_RESET_MAX_ATTEMPTS - nextAttempts);
    const message = remaining
      ? `Codigo invalido. Tentativas restantes: ${remaining}.`
      : "Tentativas esgotadas. Solicite novo codigo.";
    return res.status(400).json({ message, remainingAttempts: remaining });
  }
  const byIdIndex =
    record.userId !== undefined && record.userId !== null
      ? users.findIndex((item) => item && String(item.id) === String(record.userId))
      : -1;
  const userIndex =
    byIdIndex >= 0
      ? byIdIndex
      : users.findIndex(
          (item) => normalizeVerificationEmail(item.email || item.username || "") === email
        );
  if (userIndex === -1) {
    passwordResets.splice(recordIndex, 1);
    writeJson(PASSWORD_RESETS_FILE, passwordResets);
    return res.status(404).json({ message: "Usuario nao encontrado." });
  }
  const user = users[userIndex];
  if (user.active === false || String(user.status || "").toUpperCase() === "INATIVO") {
    return res.status(403).json({ message: "Conta inativa." });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date().toISOString();
  const updated = {
    ...user,
    passwordHash,
    passwordUpdatedAt: now,
    updatedAt: now,
  };
  users[userIndex] = updated;
  passwordResets.splice(recordIndex, 1);
  writeJson(USERS_FILE, users);
  writeJson(PASSWORD_RESETS_FILE, passwordResets);
  appendAudit("password_reset", updated.id, { email }, getClientIp(req));
  return res.json({ ok: true });
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
  if (isVerificationExpired(record)) {
    verifications.splice(recordIndex, 1);
    writeJson(VERIFICATIONS_FILE, verifications);
    return res.status(410).json({ message: "Token expirado." });
  }
  const activation = activateUserByVerification(record);
  if (activation.error) {
    verifications.splice(recordIndex, 1);
    writeJson(VERIFICATIONS_FILE, verifications);
    return res.status(activation.error).json({ message: activation.message });
  }
  const updated = activation.user;
  verifications.splice(recordIndex, 1);
  writeJson(USERS_FILE, users);
  writeJson(VERIFICATIONS_FILE, verifications);
  appendAudit("email_verify", updated.id, { email: updated.email, method: "link" }, getClientIp(req));
  return res.json({ ok: true, user: sanitizeUser(updated) });
});

app.get("/api/dashboard/summary", requireAuth, (req, res) => {
  const user = req.currentUser || getSessionUser(req);
  const projectId = getActiveProjectId(req, user);
  const payload = getDashboardSummaryForProject(projectId);
  return res.json(payload);
});

app.get("*", (req, res) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return res.status(404).json({ message: "Rota nao encontrada." });
  }
  if (path.extname(req.path)) {
    return res.status(404).send("Rota nao encontrada.");
  }
  return res.sendFile(path.join(__dirname, "index.html"));
});

bootstrap()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`OPSCOPE auth server rodando em http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Falha ao iniciar OPSCOPE:", error);
    process.exit(1);
  });
