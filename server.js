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
const INVITE_TTL_HOURS = 24;

const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const INVITES_FILE = path.join(DATA_DIR, "invites.json");
const AUDIT_FILE = path.join(DATA_DIR, "audit.json");

const ROLE_PERMISSIONS = {
  admin: { create: true, edit: true, remove: true, reschedule: true, complete: true },
  supervisor: { create: true, edit: true, remove: false, reschedule: true, complete: true },
  executor: { create: false, edit: false, remove: false, reschedule: false, complete: true },
  leitura: { create: false, edit: false, remove: false, reschedule: false, complete: false },
};

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

const ROLE_SECTIONS = {
  admin: ADMIN_SECTIONS.reduce(
    (acc, key) => {
      acc[key] = true;
      return acc;
    },
    { ...DEFAULT_SECTIONS }
  ),
  supervisor: { ...DEFAULT_SECTIONS },
  executor: { ...DEFAULT_SECTIONS },
  leitura: { ...DEFAULT_SECTIONS },
};

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

function normalizeRole(role) {
  const val = String(role || "").toLowerCase();
  if (ROLE_PERMISSIONS[val]) {
    return val;
  }
  return "executor";
}

function buildPermissions(role) {
  const normalized = normalizeRole(role);
  return ROLE_PERMISSIONS[normalized];
}

function buildSections(role) {
  const normalized = normalizeRole(role);
  return ROLE_SECTIONS[normalized] || { ...DEFAULT_SECTIONS };
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }
  const role = normalizeRole(user.role);
  return {
    id: user.id,
    username: user.username,
    matricula: user.matricula,
    name: user.name,
    role,
    permissions: user.permissions || buildPermissions(role),
    sections: user.sections || buildSections(role),
    createdAt: user.createdAt,
  };
}

function normalizeUserRecord(user) {
  const role = normalizeRole(user.role);
  return {
    ...user,
    role,
    permissions: user.permissions || buildPermissions(role),
    sections: user.sections || buildSections(role),
  };
}

function seedAdmin() {
  if (users.length) {
    return;
  }
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
  const admin = {
    id: crypto.randomUUID(),
    username: "admin",
    matricula: "ADMIN",
    name: "Administrador",
    role: "admin",
    passwordHash,
    permissions: buildPermissions("admin"),
    sections: buildSections("admin"),
    createdAt: new Date().toISOString(),
  };
  users = [admin];
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

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Nao autorizado." });
  }
  return next();
}

function requireAdmin(req, res, next) {
  const user = users.find((u) => u.id === req.session.userId);
  if (!user || normalizeRole(user.role) !== "admin") {
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
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: "Nao autenticado." });
  }
  const user = users.find((u) => u.id === req.session.userId);
  if (!user) {
    return res.status(401).json({ message: "Nao autenticado." });
  }
  return res.json({ user: sanitizeUser(user) });
});

app.get("/api/auth/users", requireAuth, (req, res) => {
  const list = users.map((user) => sanitizeUser(user));
  return res.json({ users: list });
});

app.post("/api/auth/invite", requireAuth, requireAdmin, (req, res) => {
  cleanupInvites();
  const role = normalizeRole(req.body.role || "executor");
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

  const role = normalizeRole(invite.role || "executor");
  const passwordHash = await bcrypt.hash(senha, 12);
  const user = {
    id: crypto.randomUUID(),
    username: matricula.toLowerCase(),
    matricula,
    name: nome,
    role,
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
