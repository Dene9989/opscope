const path = require("path");
const { readJsonSafe, recordsFromPayload } = require("../ingestion/loaders");
const {
  TIMESTAMP_KEYS,
  DUE_DATE_KEYS,
  DONE_DATE_KEYS,
  ID_KEYS,
  TITLE_KEYS,
  TYPE_KEYS,
  STATUS_KEYS,
  SEVERITY_KEYS,
  USER_KEYS,
  PROJECT_KEYS,
  ASSET_KEYS,
  safeText,
  inferFirstValue,
  inferDate,
  toIso,
  toDateKey,
  stableHash,
  flattenForSearch,
} = require("./keyResolver");
const { normalizeSeverity } = require("../contracts");

function buildUserIndex(usersFile) {
  const payload = readJsonSafe(usersFile, []);
  const rows = recordsFromPayload(payload, "users");
  const userByToken = new Map();
  const userDim = new Map();

  rows.forEach(({ record }) => {
    if (!record || typeof record !== "object") {
      return;
    }
    const userId =
      safeText(record.id) ||
      safeText(record.userId) ||
      safeText(record.matricula) ||
      safeText(record.username) ||
      safeText(record.email);
    if (!userId) {
      return;
    }
    const normalized = {
      user_id: userId,
      name: safeText(record.name || record.nome || record.fullName || record.username),
      email: safeText(record.email),
      role: safeText(record.role || record.rbacRole || record.cargo),
    };
    userDim.set(userId, normalized);
    [userId, record.email, record.username, record.matricula, record.name, record.nome]
      .map((value) => safeText(value).toLowerCase())
      .filter(Boolean)
      .forEach((token) => userByToken.set(token, userId));
  });

  return {
    dim: Array.from(userDim.values()),
    resolveUserId(token) {
      const key = safeText(token).toLowerCase();
      if (!key) {
        return "";
      }
      return userByToken.get(key) || safeText(token);
    },
  };
}

function normalizeRecordEvent(row, options = {}) {
  if (!row || !row.record || typeof row.record !== "object") {
    return null;
  }
  const record = row.record;
  const source = safeText(row.source || options.source || "all") || "all";
  const fileName = safeText(row.fileName || path.basename(row.filePath || ""));

  const createdAt =
    inferDate(record, TIMESTAMP_KEYS) ||
    inferDate(record, DONE_DATE_KEYS) ||
    inferDate(record, DUE_DATE_KEYS) ||
    null;
  const dueAt = inferDate(record, DUE_DATE_KEYS);
  const doneAt = inferDate(record, DONE_DATE_KEYS);

  const userToken = inferFirstValue(record, USER_KEYS);
  const resolvedUserId =
    options.userIndex && typeof options.userIndex.resolveUserId === "function"
      ? options.userIndex.resolveUserId(userToken)
      : userToken;
  const title = inferFirstValue(record, TITLE_KEYS) || `${source}:${fileName}`;
  const eventType = inferFirstValue(record, TYPE_KEYS) || source;
  const status = inferFirstValue(record, STATUS_KEYS);
  const severity = normalizeSeverity(inferFirstValue(record, SEVERITY_KEYS));
  const projectId = inferFirstValue(record, PROJECT_KEYS);
  const asset = inferFirstValue(record, ASSET_KEYS);

  const existingId = inferFirstValue(record, ID_KEYS);
  const eventTs = toIso(createdAt || dueAt || doneAt || null);
  const eventId =
    existingId ||
    stableHash([
      source,
      fileName,
      row.recordPath || "",
      eventTs,
      title,
      resolvedUserId,
      asset,
      projectId,
    ]);

  return {
    id: eventId,
    eventId,
    source,
    fileName,
    filePath: safeText(row.filePath),
    recordPath: safeText(row.recordPath),
    eventType: safeText(eventType) || source,
    eventTs,
    dateKey: toDateKey(createdAt || dueAt || doneAt || null),
    dueTs: toIso(dueAt),
    doneTs: toIso(doneAt),
    projectId: safeText(projectId),
    userId: safeText(resolvedUserId),
    severity,
    status: safeText(status),
    title: safeText(title),
    asset: safeText(asset),
    details: record,
    detailsJson: JSON.stringify(record),
    searchText: flattenForSearch(record),
    signals: {},
    tags: [],
  };
}

module.exports = {
  buildUserIndex,
  normalizeRecordEvent,
};

