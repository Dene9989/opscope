const { EVENT_RULES, AGGREGATE_RULES } = require("./rules.catalog");
const { compareSeverityDesc } = require("../contracts");

function dedupeInconsistencies(items) {
  const map = new Map();
  (Array.isArray(items) ? items : []).forEach((item) => {
    if (!item || !item.id) {
      return;
    }
    if (!map.has(item.id)) {
      map.set(item.id, item);
      return;
    }
    const current = map.get(item.id);
    const merged = {
      ...current,
      ...item,
      eventIds: Array.from(
        new Set([...(Array.isArray(current.eventIds) ? current.eventIds : []), ...(Array.isArray(item.eventIds) ? item.eventIds : [])])
      ),
      evidence: Array.from(
        new Set([...(Array.isArray(current.evidence) ? current.evidence : []), ...(Array.isArray(item.evidence) ? item.evidence : [])])
      ),
    };
    map.set(item.id, merged);
  });
  return Array.from(map.values());
}

function runRules({ events = [], context = {} } = {}) {
  const inconsistencies = [];
  const safeEvents = Array.isArray(events) ? events : [];

  EVENT_RULES.forEach((rule) => {
    safeEvents.forEach((event) => {
      try {
        if (rule.evaluate(event, context)) {
          const issue = rule.build(event, context);
          if (issue) {
            inconsistencies.push(issue);
          }
        }
      } catch (_) {
        // ignore malformed event/rule execution
      }
    });
  });

  AGGREGATE_RULES.forEach((rule) => {
    try {
      const result = rule.evaluate(safeEvents, context);
      if (Array.isArray(result)) {
        inconsistencies.push(...result.filter(Boolean));
      } else if (result) {
        inconsistencies.push(result);
      }
    } catch (_) {
      // ignore malformed aggregate rule execution
    }
  });

  const deduped = dedupeInconsistencies(inconsistencies);
  deduped.sort((a, b) => {
    const bySeverity = compareSeverityDesc(a.severity, b.severity);
    if (bySeverity !== 0) {
      return bySeverity;
    }
    const ad = new Date(a.detectedAt || 0).getTime();
    const bd = new Date(b.detectedAt || 0).getTime();
    return bd - ad;
  });
  return deduped;
}

module.exports = {
  runRules,
};

