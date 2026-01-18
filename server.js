const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

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

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const INVITES_FILE = path.join(DATA_DIR, "invites.json");
const AUDIT_FILE = path.join(DATA_DIR, "audit.json");

const PERMISSION_KEYS = ["create", "edit", "remove", "reschedule", "complete"];
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

const DEFAULT_SECTIONS = {
  inicio: true,
  programacao: true,
  nova: true,
  modelos: true,
  execucao: true,
  backlog: true,
  desempenho: true,
  tendencias: true,
  relatorios: true,
  perfil: true,
};

const ADMIN_SECTIONS = ["solicitacoes", "rastreabilidade", "gerencial", "contas"];

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

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function appendAudit(action, userId, details, ip) {
  const timestamp = new Date().toISOString();
  const prevHash = auditLog.length ? auditLog[auditLog.length - 1].hash : "";
  const payload = JSON.stringify({ action, userId, details, ip, timestamp, prevHash });
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

function sanitizeUser(user) {
  if (!user) {
    return null;
  }
  const rbacRole = normalizeRbacRole(user.rbacRole || user.role);
  const role = normalizeRole(user.role, rbacRole);
  return {
    id: user.id,
    username: user.username,
    matricula: user.matricula,
    name: user.name,
    role,
    rbacRole,
    cargo: user.cargo || "",
    projeto: user.projeto || "",
    localizacao: user.localizacao || "",
    active: user.active !== false,
    permissions: buildPermissions(rbacRole, user.permissions),
    sections: buildSections(rbacRole, user.sections),
    createdAt: user.createdAt,
  };
}

function normalizeUserRecord(user) {
  const rbacRole = normalizeRbacRole(user.rbacRole || user.role);
  const role = normalizeRole(user.role, rbacRole);
  return {
    ...user,
    role,
    rbacRole,
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
  console.log("Admin master criado: usuario", MASTER_USERNAME);
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
  console.log("Admin criado: usuario admin / senha", ADMIN_PASSWORD);
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

function requireAuth(req, res, next) {
  const user = getSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: "Nao autorizado." });
  }
  req.currentUser = user;
  return next();
}

function requireAdmin(req, res, next) {
  const user = req.currentUser || getSessionUser(req);
  if (!user || !isFullAccessRole(user.rbacRole || user.role)) {
    return res.status(403).json({ message: "Nao autorizado." });
  }
  return next();
}

ensureDataDir();
let users = readJson(USERS_FILE, []);
let invites = readJson(INVITES_FILE, []);
let auditLog = readJson(AUDIT_FILE, []);
users = users.map(normalizeUserRecord);
writeJson(USERS_FILE, users);
ensureMasterAccount();
seedAdmin();

app.use(express.json({ limit: "2mb" }));
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

app.use(express.static(__dirname));

app.post("/api/auth/login", async (req, res) => {
  const ip = getClientIp(req);
  if (isIpBlocked(ip)) {
    return res.status(429).json({ message: "Credenciais invalidas." });
  }
  const login = String(req.body.login || "").trim().toLowerCase();
  const senha = String(req.body.senha || "").trim();
  if (!login || !senha) {
    recordIpFailure(ip);
    return res.status(401).json({ message: "Credenciais invalidas." });
  }
  if (isUserLocked(login)) {
    recordIpFailure(ip);
    return res.status(429).json({ message: "Credenciais invalidas." });
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
    return res.status(401).json({ message: "Credenciais invalidas." });
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
    return res.status(401).json({ message: "Credenciais invalidas." });
  }
  clearFailures(ip, login);
  req.session.userId = user.id;
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
  return res.json({ user: sanitizeUser(user) });
});

app.get("/api/auth/users", requireAuth, (req, res) => {
  const list = users.map((user) => sanitizeUser(user));
  return res.json({ users: list });
});

app.get("/api/admin/users", requireAuth, requireAdmin, (req, res) => {
  const list = users.map((user) => sanitizeUser(user));
  return res.json({ users: list });
});

app.patch("/api/admin/users/:id", requireAuth, requireAdmin, (req, res) => {
  const userIndex = users.findIndex((item) => item.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario nao encontrado." });
  }
  const current = users[userIndex];
  const updates = {};
  if ("name" in req.body) {
    updates.name = String(req.body.name || "").trim();
  }
  if ("cargo" in req.body) {
    updates.cargo = String(req.body.cargo || "").trim();
  } else if ("jobTitle" in req.body) {
    updates.cargo = String(req.body.jobTitle || "").trim();
  }
  if ("projeto" in req.body) {
    updates.projeto = String(req.body.projeto || "").trim();
  } else if ("project" in req.body) {
    updates.projeto = String(req.body.project || "").trim();
  }
  if ("localizacao" in req.body) {
    updates.localizacao = String(req.body.localizacao || "").trim();
  } else if ("location" in req.body) {
    updates.localizacao = String(req.body.location || "").trim();
  }
  if ("active" in req.body) {
    updates.active = Boolean(req.body.active);
  }
  if ("permissions" in req.body) {
    updates.permissions = mergePermissions(
      current.rbacRole || current.role,
      current.permissions,
      req.body.permissions
    );
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: "Nenhuma alteracao valida." });
  }

  const updated = normalizeUserRecord({ ...current, ...updates });
  users[userIndex] = updated;
  writeJson(USERS_FILE, users);
  appendAudit(
    "admin_user_update",
    req.session.userId,
    { alvo: updated.id, campos: Object.keys(updates) },
    getClientIp(req)
  );
  return res.json({ user: sanitizeUser(updated) });
});

app.post("/api/auth/invite", requireAuth, requireAdmin, (req, res) => {
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
  const matricula = String(req.body.matricula || "").trim().toUpperCase();
  const nome = String(req.body.nome || "").trim();
  const senha = String(req.body.senha || "").trim();
  const senhaConfirm = String(req.body.senhaConfirm || "").trim();
  const convite = String(req.body.convite || "").trim().toUpperCase();

  const passwordCheck = validatePassword(senha);
  const errors = {};
  if (!matricula) {
    errors.matricula = "Informe a matricula.";
  }
  if (!nome) {
    errors.nome = "Informe o nome completo.";
  }
  if (!senha || !passwordCheck.ok) {
    errors.senha = "Senha fora da politica.";
  }
  if (!senhaConfirm || senhaConfirm !== senha) {
    errors.senhaConfirm = "As senhas nao conferem.";
  }
  if (!convite) {
    errors.convite = "Informe o codigo de convite.";
  }
  const invite = invites.find((item) => item.code === convite);
  const inviteValido = invite && new Date(invite.expiresAt).getTime() > Date.now();
  if (!inviteValido) {
    errors.convite = "Convite invalido ou expirado.";
  }
  const jaExiste = users.some(
    (user) =>
      String(user.matricula || "").toUpperCase() === matricula ||
      String(user.username || "").toLowerCase() === matricula.toLowerCase()
  );
  if (jaExiste) {
    errors.matricula = "Dados invalidos.";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Dados invalidos.", errors, rules: passwordCheck.rules });
  }

  const role = normalizeRbacRole(invite.role || "tecnico_junior");
  const legacyRole = normalizeRole(role, role);
  const passwordHash = await bcrypt.hash(senha, 12);
  const user = {
    id: crypto.randomUUID(),
    username: matricula.toLowerCase(),
    matricula,
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
  users.push(user);
  invites = invites.filter((item) => item.code !== convite);
  writeJson(USERS_FILE, users);
  writeJson(INVITES_FILE, invites);
  appendAudit("register", user.id, { matricula, role }, getClientIp(req));
  return res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`OPSCOPE auth server rodando em http://localhost:${PORT}`);
});
