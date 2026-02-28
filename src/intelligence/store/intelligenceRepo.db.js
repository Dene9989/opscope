let PgClient = null;
try {
  ({ Client: PgClient } = require("pg"));
} catch (_) {
  PgClient = null;
}
const INTELLIGENCE_DB_PAYLOAD_MAX_BYTES = Math.min(
  64 * 1024 * 1024,
  Math.max(512 * 1024, Number(process.env.OPSCOPE_INTELLIGENCE_DB_PAYLOAD_MAX_BYTES) || 16 * 1024 * 1024)
);

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
    const serialized = JSON.stringify(payload || {});
    const payloadBytes = Buffer.byteLength(serialized, "utf8");
    if (payloadBytes > INTELLIGENCE_DB_PAYLOAD_MAX_BYTES) {
      console.warn("[intelligence] Escopo nao salvo no DB por tamanho excessivo.", {
        key,
        bytes: payloadBytes,
        maxBytes: INTELLIGENCE_DB_PAYLOAD_MAX_BYTES,
      });
      return false;
    }
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
        [key, serialized]
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
        `SELECT
           CASE
             WHEN octet_length(payload) <= $2 THEN payload
             ELSE NULL
           END AS payload,
           octet_length(payload) AS payload_bytes
         FROM ${this.dbStoreTable}
         WHERE key = $1
         LIMIT 1`,
        [key, INTELLIGENCE_DB_PAYLOAD_MAX_BYTES]
      );
      if (!response || !response.rowCount) {
        return null;
      }
      const row = response.rows[0] || {};
      const payloadBytes = Number(row.payload_bytes || 0);
      if (payloadBytes > INTELLIGENCE_DB_PAYLOAD_MAX_BYTES) {
        console.warn("[intelligence] Escopo remoto ignorado por tamanho excessivo.", {
          key,
          bytes: payloadBytes,
          maxBytes: INTELLIGENCE_DB_PAYLOAD_MAX_BYTES,
        });
        return null;
      }
      const raw = row.payload;
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
