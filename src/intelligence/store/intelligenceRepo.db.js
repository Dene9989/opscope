let PgClient = null;
try {
  ({ Client: PgClient } = require("pg"));
} catch (_) {
  PgClient = null;
}

class IntelligenceDbRepo {
  constructor(options = {}) {
    this.databaseUrl = String(options.databaseUrl || "").trim();
    this.dbStoreTable = String(options.dbStoreTable || "opscope_store").trim() || "opscope_store";
    this.enabled = Boolean(this.databaseUrl && PgClient);
  }

  async saveScope(scopeKey, payload) {
    if (!this.enabled || !scopeKey) {
      return false;
    }
    const key = `data/intelligence_scope_${String(scopeKey).trim()}.json`;
    const client = new PgClient({
      connectionString: this.databaseUrl,
      ssl: this.databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 2500,
    });
    try {
      await client.connect();
      await client.query(
        `INSERT INTO ${this.dbStoreTable} (key, payload, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (key)
         DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
        [key, JSON.stringify(payload || {})]
      );
      return true;
    } catch (_) {
      return false;
    } finally {
      try {
        await client.end();
      } catch (_) {
        // noop
      }
    }
  }

  async loadScope(scopeKey) {
    if (!this.enabled || !scopeKey) {
      return null;
    }
    const key = `data/intelligence_scope_${String(scopeKey).trim()}.json`;
    const client = new PgClient({
      connectionString: this.databaseUrl,
      ssl: this.databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
      connectionTimeoutMillis: 2500,
    });
    try {
      await client.connect();
      const response = await client.query(
        `SELECT payload FROM ${this.dbStoreTable} WHERE key = $1 LIMIT 1`,
        [key]
      );
      if (!response || !response.rowCount) {
        return null;
      }
      const raw = response.rows[0].payload;
      if (!raw) {
        return null;
      }
      if (typeof raw === "object") {
        return raw;
      }
      return JSON.parse(String(raw));
    } catch (_) {
      return null;
    } finally {
      try {
        await client.end();
      } catch (_) {
        // noop
      }
    }
  }
}

module.exports = {
  IntelligenceDbRepo,
};

