const fs = require("fs");
const path = require("path");
const INTELLIGENCE_JSON_MAX_BYTES = Math.min(
  64 * 1024 * 1024,
  Math.max(512 * 1024, Number(process.env.OPSCOPE_INTELLIGENCE_JSON_MAX_FILE_BYTES) || 16 * 1024 * 1024)
);
const oversizedWarned = new Set();

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const stats = fs.statSync(filePath);
    if (stats && Number.isFinite(Number(stats.size)) && Number(stats.size) > INTELLIGENCE_JSON_MAX_BYTES) {
      const key = path.resolve(filePath);
      if (!oversizedWarned.has(key)) {
        oversizedWarned.add(key);
        console.warn("[intelligence] JSON local ignorado por tamanho excessivo.", {
          file: filePath,
          bytes: stats.size,
          maxBytes: INTELLIGENCE_JSON_MAX_BYTES,
        });
      }
      return fallback;
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (_) {
    return fallback;
  }
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
}

function createScopedDoc() {
  return {
    version: 1,
    updatedAt: "",
    scopes: {},
  };
}

function sanitizeScopeData(data) {
  const input = data && typeof data === "object" ? data : {};
  return {
    source: String(input.source || "all"),
    projectId: String(input.projectId || ""),
    from: String(input.from || ""),
    to: String(input.to || ""),
    updatedAt: String(input.updatedAt || new Date().toISOString()),
    items: Array.isArray(input.items) ? input.items : [],
  };
}

class IntelligenceFileRepo {
  constructor(options = {}) {
    const baseDataDir = options.baseDataDir ? path.resolve(options.baseDataDir) : process.cwd();
    this.baseDataDir = baseDataDir;
    this.eventsFile =
      options.eventsFile || path.join(this.baseDataDir, "intelligence_events.json");
    this.inconsistenciesFile =
      options.inconsistenciesFile ||
      path.join(this.baseDataDir, "intelligence_inconsistencies.json");
    this.scenariosFile =
      options.scenariosFile || path.join(this.baseDataDir, "intelligence_scenarios.json");
    this.snapshotsFile =
      options.snapshotsFile || path.join(this.baseDataDir, "intelligence_snapshots.json");
    this.ensureFiles();
  }

  ensureFiles() {
    ensureDir(this.baseDataDir);
    if (!fs.existsSync(this.eventsFile)) {
      writeJson(this.eventsFile, createScopedDoc());
    }
    if (!fs.existsSync(this.inconsistenciesFile)) {
      writeJson(this.inconsistenciesFile, createScopedDoc());
    }
    if (!fs.existsSync(this.scenariosFile)) {
      writeJson(this.scenariosFile, createScopedDoc());
    }
    if (!fs.existsSync(this.snapshotsFile)) {
      writeJson(this.snapshotsFile, {
        version: 1,
        updatedAt: "",
        latestByScope: {},
        items: [],
      });
    }
  }

  readScoped(filePath) {
    const doc = readJson(filePath, null);
    if (!doc || typeof doc !== "object") {
      return createScopedDoc();
    }
    return {
      version: Number(doc.version) || 1,
      updatedAt: String(doc.updatedAt || ""),
      scopes: doc.scopes && typeof doc.scopes === "object" ? { ...doc.scopes } : {},
    };
  }

  writeScoped(filePath, doc) {
    writeJson(filePath, {
      version: Number(doc.version) || 1,
      updatedAt: String(doc.updatedAt || new Date().toISOString()),
      scopes: doc.scopes && typeof doc.scopes === "object" ? doc.scopes : {},
    });
  }

  readSnapshots() {
    const doc = readJson(this.snapshotsFile, null);
    if (!doc || typeof doc !== "object") {
      return {
        version: 1,
        updatedAt: "",
        latestByScope: {},
        items: [],
      };
    }
    return {
      version: Number(doc.version) || 1,
      updatedAt: String(doc.updatedAt || ""),
      latestByScope:
        doc.latestByScope && typeof doc.latestByScope === "object"
          ? { ...doc.latestByScope }
          : {},
      items: Array.isArray(doc.items) ? doc.items : [],
    };
  }

  writeSnapshots(doc) {
    writeJson(this.snapshotsFile, {
      version: Number(doc.version) || 1,
      updatedAt: String(doc.updatedAt || new Date().toISOString()),
      latestByScope:
        doc.latestByScope && typeof doc.latestByScope === "object" ? doc.latestByScope : {},
      items: Array.isArray(doc.items) ? doc.items : [],
    });
  }

  getScope(scopeKey) {
    const key = String(scopeKey || "").trim();
    if (!key) {
      return null;
    }
    const eventsDoc = this.readScoped(this.eventsFile);
    const inconsistenciesDoc = this.readScoped(this.inconsistenciesFile);
    const scenariosDoc = this.readScoped(this.scenariosFile);
    const snapshots = this.readSnapshots();

    const eventsScope = eventsDoc.scopes[key];
    const inconsistenciesScope = inconsistenciesDoc.scopes[key];
    const scenariosScope = scenariosDoc.scopes[key];
    const latestSnapshotId = String(snapshots.latestByScope[key] || "");
    const snapshot =
      latestSnapshotId &&
      snapshots.items.find((item) => String(item && item.id) === latestSnapshotId);

    if (!eventsScope && !inconsistenciesScope && !snapshot) {
      return null;
    }

    return {
      scopeKey: key,
      updatedAt: String(
        (snapshot && snapshot.generatedAt) ||
          (eventsScope && eventsScope.updatedAt) ||
          (inconsistenciesScope && inconsistenciesScope.updatedAt) ||
          ""
      ),
      source: String(
        (snapshot && snapshot.source) ||
          (eventsScope && eventsScope.source) ||
          (inconsistenciesScope && inconsistenciesScope.source) ||
          "all"
      ),
      projectId: String(
        (snapshot && snapshot.projectId) ||
          (eventsScope && eventsScope.projectId) ||
          (inconsistenciesScope && inconsistenciesScope.projectId) ||
          ""
      ),
      from: String((eventsScope && eventsScope.from) || ""),
      to: String((eventsScope && eventsScope.to) || ""),
      events: Array.isArray(eventsScope && eventsScope.items) ? eventsScope.items : [],
      inconsistencies: Array.isArray(inconsistenciesScope && inconsistenciesScope.items)
        ? inconsistenciesScope.items
        : [],
      scenarios: Array.isArray(scenariosScope && scenariosScope.items) ? scenariosScope.items : [],
      summary:
        snapshot && snapshot.summary && typeof snapshot.summary === "object"
          ? snapshot.summary
          : null,
      snapshot: snapshot || null,
    };
  }

  saveScope(scopeKey, payload = {}) {
    const key = String(scopeKey || "").trim();
    if (!key) {
      throw new Error("Escopo de inteligência inválido.");
    }
    const generatedAt = String(payload.generatedAt || new Date().toISOString());
    const source = String(payload.source || "all");
    const projectId = String(payload.projectId || "");
    const from = String(payload.from || "");
    const to = String(payload.to || "");
    const snapshotId = String(payload.snapshotId || "");

    const eventsDoc = this.readScoped(this.eventsFile);
    eventsDoc.updatedAt = generatedAt;
    eventsDoc.scopes[key] = sanitizeScopeData({
      source,
      projectId,
      from,
      to,
      updatedAt: generatedAt,
      items: Array.isArray(payload.events) ? payload.events : [],
    });
    this.writeScoped(this.eventsFile, eventsDoc);

    const inconsistenciesDoc = this.readScoped(this.inconsistenciesFile);
    inconsistenciesDoc.updatedAt = generatedAt;
    inconsistenciesDoc.scopes[key] = sanitizeScopeData({
      source,
      projectId,
      from,
      to,
      updatedAt: generatedAt,
      items: Array.isArray(payload.inconsistencies) ? payload.inconsistencies : [],
    });
    this.writeScoped(this.inconsistenciesFile, inconsistenciesDoc);

    const scenariosDoc = this.readScoped(this.scenariosFile);
    scenariosDoc.updatedAt = generatedAt;
    scenariosDoc.scopes[key] = sanitizeScopeData({
      source,
      projectId,
      from,
      to,
      updatedAt: generatedAt,
      items: Array.isArray(payload.scenarios) ? payload.scenarios : [],
    });
    this.writeScoped(this.scenariosFile, scenariosDoc);

    const snapshots = this.readSnapshots();
    snapshots.updatedAt = generatedAt;
    const nextSnapshotId = snapshotId || `${key}:${generatedAt}`;
    snapshots.latestByScope[key] = nextSnapshotId;
    snapshots.items = (Array.isArray(snapshots.items) ? snapshots.items : [])
      .filter((item) => String(item && item.id) !== nextSnapshotId)
      .concat({
        id: nextSnapshotId,
        scopeKey: key,
        source,
        projectId,
        from,
        to,
        generatedAt,
        counts: payload.counts && typeof payload.counts === "object" ? payload.counts : {},
        summary: payload.summary && typeof payload.summary === "object" ? payload.summary : {},
      })
      .slice(-120);
    this.writeSnapshots(snapshots);
  }

  getHealth() {
    const eventsDoc = this.readScoped(this.eventsFile);
    const inconsistenciesDoc = this.readScoped(this.inconsistenciesFile);
    const scenariosDoc = this.readScoped(this.scenariosFile);
    const snapshots = this.readSnapshots();
    return {
      baseDataDir: this.baseDataDir,
      files: {
        events: this.eventsFile,
        inconsistencies: this.inconsistenciesFile,
        scenarios: this.scenariosFile,
        snapshots: this.snapshotsFile,
      },
      scopes: {
        events: Object.keys(eventsDoc.scopes || {}).length,
        inconsistencies: Object.keys(inconsistenciesDoc.scopes || {}).length,
        scenarios: Object.keys(scenariosDoc.scopes || {}).length,
      },
      snapshots: Array.isArray(snapshots.items) ? snapshots.items.length : 0,
      updatedAt: snapshots.updatedAt || eventsDoc.updatedAt || "",
    };
  }
}

module.exports = {
  IntelligenceFileRepo,
};
