const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const TURN_PLAN_FEEDBACK_MAX_BYTES = Math.min(
  64 * 1024 * 1024,
  Math.max(256 * 1024, Number(process.env.OPSCOPE_TURN_PLAN_FEEDBACK_MAX_BYTES) || 8 * 1024 * 1024)
);
const TURN_PLAN_FEEDBACK_MAX_ITEMS = Math.max(
  200,
  Math.min(20000, Number(process.env.OPSCOPE_TURN_PLAN_FEEDBACK_MAX_ITEMS) || 5000)
);

function safeText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJson(filePath, fallback) {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      return fallback;
    }
    const stats = fs.statSync(filePath);
    if (stats && Number.isFinite(Number(stats.size)) && Number(stats.size) > TURN_PLAN_FEEDBACK_MAX_BYTES) {
      console.warn("[turn-plan] Feedback file ignored due to size limit.", {
        file: filePath,
        bytes: stats.size,
        maxBytes: TURN_PLAN_FEEDBACK_MAX_BYTES,
      });
      return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function normalizeOutcome(value) {
  const raw = safeText(value).toLowerCase();
  if (raw === "success") {
    return "success";
  }
  if (raw === "partial") {
    return "partial";
  }
  if (raw === "fail") {
    return "fail";
  }
  return "unknown";
}

function classifyCause(notes, actionType) {
  const text = safeText(notes).toLowerCase();
  if (!text) {
    return safeText(actionType) || "sem_causa";
  }
  if (text.includes("peca") || text.includes("peça") || text.includes("material")) {
    return "material_indisponivel";
  }
  if (text.includes("janela") || text.includes("operacao") || text.includes("operação")) {
    return "janela_operacional";
  }
  if (text.includes("permiss") || text.includes("autoriz")) {
    return "permissao_pendente";
  }
  if (text.includes("acesso") || text.includes("clima") || text.includes("chuva")) {
    return "restricao_externa";
  }
  return safeText(actionType) || "sem_causa";
}

function toBoundedNumber(value, fallback = null, min = 0, max = 100000) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  const rounded = Math.round(numeric);
  if (rounded < min) {
    return min;
  }
  if (rounded > max) {
    return max;
  }
  return rounded;
}

class TurnPlanFeedbackStore {
  constructor(options = {}) {
    this.filePath = options.filePath ? path.resolve(options.filePath) : "";
    if (!this.filePath) {
      throw new Error("TurnPlanFeedbackStore requires filePath.");
    }
    this.ensureFile();
  }

  ensureFile() {
    ensureDir(path.dirname(this.filePath));
    if (!fs.existsSync(this.filePath)) {
      writeJson(this.filePath, {
        version: 1,
        updatedAt: "",
        items: [],
      });
    }
  }

  readDoc() {
    const doc = readJson(this.filePath, null);
    if (!doc || typeof doc !== "object") {
      return {
        version: 1,
        updatedAt: "",
        items: [],
      };
    }
    return {
      version: Number(doc.version) || 1,
      updatedAt: safeText(doc.updatedAt),
      items: Array.isArray(doc.items) ? doc.items : [],
    };
  }

  writeDoc(doc) {
    const safeDoc = {
      version: Number(doc.version) || 1,
      updatedAt: safeText(doc.updatedAt || new Date().toISOString()),
      items: Array.isArray(doc.items) ? doc.items : [],
    };
    safeDoc.items = safeDoc.items.slice(-TURN_PLAN_FEEDBACK_MAX_ITEMS);
    let serialized = JSON.stringify(safeDoc);
    if (Buffer.byteLength(serialized, "utf8") > TURN_PLAN_FEEDBACK_MAX_BYTES) {
      const minItems = Math.max(100, Math.floor(TURN_PLAN_FEEDBACK_MAX_ITEMS / 5));
      while (
        safeDoc.items.length > minItems &&
        Buffer.byteLength(serialized, "utf8") > TURN_PLAN_FEEDBACK_MAX_BYTES
      ) {
        safeDoc.items = safeDoc.items.slice(Math.ceil(safeDoc.items.length * 0.1));
        serialized = JSON.stringify(safeDoc);
      }
    }
    writeJson(this.filePath, safeDoc);
  }

  addFeedback(entry = {}) {
    const createdAt = new Date().toISOString();
    const notes = safeText(entry.notes).slice(0, 1200);
    const record = {
      id: safeText(entry.id) || crypto.randomUUID(),
      planId: safeText(entry.planId),
      actionId: safeText(entry.actionId),
      projectId: safeText(entry.projectId),
      actionType: safeText(entry.actionType) || "other",
      outcome: normalizeOutcome(entry.outcome),
      notes,
      timeSpentMin: toBoundedNumber(entry.timeSpentMin, null, 0, 7 * 24 * 60),
      preventedDowntimeMin: toBoundedNumber(entry.preventedDowntimeMin, null, 0, 30 * 24 * 60),
      causeCategory: classifyCause(notes, entry.actionType),
      createdAt,
    };
    const doc = this.readDoc();
    doc.updatedAt = createdAt;
    doc.items = (Array.isArray(doc.items) ? doc.items : []).concat(record).slice(-TURN_PLAN_FEEDBACK_MAX_ITEMS);
    this.writeDoc(doc);
    return record;
  }

  listFeedback({ projectId = "", since = null } = {}) {
    const targetProjectId = safeText(projectId);
    const sinceDate = since instanceof Date && !Number.isNaN(since.getTime()) ? since : null;
    return (this.readDoc().items || []).filter((item) => {
      if (targetProjectId && safeText(item.projectId) !== targetProjectId) {
        return false;
      }
      if (sinceDate) {
        const createdAt = new Date(item.createdAt || "");
        if (Number.isNaN(createdAt.getTime()) || createdAt < sinceDate) {
          return false;
        }
      }
      return true;
    });
  }
}

module.exports = {
  TurnPlanFeedbackStore,
  normalizeOutcome,
  classifyCause,
};
