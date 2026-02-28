const { IntelligenceFileRepo } = require("./intelligenceRepo.file");
const { IntelligenceDbRepo } = require("./intelligenceRepo.db");

class IntelligenceStore {
  constructor(options = {}) {
    this.fileRepo = new IntelligenceFileRepo({
      baseDataDir: options.baseDataDir,
      eventsFile: options.eventsFile,
      inconsistenciesFile: options.inconsistenciesFile,
      scenariosFile: options.scenariosFile,
      snapshotsFile: options.snapshotsFile,
    });
    this.dbRepo = new IntelligenceDbRepo({
      databaseUrl: options.databaseUrl,
      dbStoreTable: options.dbStoreTable,
    });
  }

  async getScope(scopeKey) {
    const local = this.fileRepo.getScope(scopeKey);
    if (local) {
      return local;
    }
    const remote = await this.dbRepo.loadScope(scopeKey);
    if (!remote || typeof remote !== "object") {
      return null;
    }
    try {
      this.fileRepo.saveScope(scopeKey, remote);
    } catch (_) {
      // noop
    }
    return this.fileRepo.getScope(scopeKey);
  }

  async saveScope(scopeKey, payload = {}) {
    this.fileRepo.saveScope(scopeKey, payload);
    this.dbRepo
      .saveScope(scopeKey, payload)
      .catch(() => null);
  }

  getHealth() {
    return this.fileRepo.getHealth();
  }
}

function createIntelligenceStore(options = {}) {
  return new IntelligenceStore(options);
}

module.exports = {
  IntelligenceStore,
  createIntelligenceStore,
};

