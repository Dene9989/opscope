const SCENARIO_CATALOG = [
  {
    id: "sla_window_extension_24h",
    name: "Extensão de janela em 24h",
    description:
      "Projeta impacto caso os eventos abertos atuais permaneçam sem tratamento por mais 24 horas.",
    defaults: {
      durationHours: 24,
      conversionFactor: 0.25,
    },
    simulate({ summary, overrides }) {
      const durationHours = Number(overrides.durationHours || 24) || 24;
      const conversionFactor = Number(overrides.conversionFactor || 0.25) || 0.25;
      const openEvents = Number(summary.openEvents || 0);
      const overdueEvents = Number(summary.overdueEvents || 0);
      const criticalOpen = Number(summary.criticalOpen || 0);
      const projectedOverdue = Math.round(openEvents * conversionFactor) + overdueEvents;
      return {
        durationHours,
        openEvents,
        overdueEvents: projectedOverdue,
        criticalOpen,
        recurringFailures: Number(summary.recurringFailures || 0),
        headline: `${projectedOverdue} eventos podem ultrapassar a janela de execução.`,
      };
    },
  },
  {
    id: "asset_failure_recurrence",
    name: "Reincidência no mesmo ativo",
    description:
      "Simula a continuidade de falhas em ativos já recorrentes para antecipar criticidade operacional.",
    defaults: {
      recurrenceMultiplier: 1.5,
      durationHours: 12,
    },
    simulate({ summary, overrides }) {
      const recurrenceMultiplier = Number(overrides.recurrenceMultiplier || 1.5) || 1.5;
      const recurringFailures = Math.max(
        1,
        Math.round(Number(summary.recurringFailures || 0) * recurrenceMultiplier)
      );
      const criticalOpen = Number(summary.criticalOpen || 0) + Math.ceil(recurringFailures / 2);
      const openEvents = Number(summary.openEvents || 0) + recurringFailures;
      return {
        durationHours: Number(overrides.durationHours || 12) || 12,
        openEvents,
        overdueEvents: Number(summary.overdueEvents || 0) + Math.max(1, Math.floor(recurringFailures / 2)),
        criticalOpen,
        recurringFailures,
        headline: `Reincidência projetada em ${recurringFailures} eventos de falha no ativo.`,
      };
    },
  },
  {
    id: "critical_alert_burst",
    name: "Pico de alertas críticos",
    description:
      "Projeta aumento súbito de criticidade por acúmulo de alertas em execução e contingência.",
    defaults: {
      spikePercent: 40,
      durationHours: 8,
    },
    simulate({ summary, overrides }) {
      const spikePercent = Number(overrides.spikePercent || 40) || 40;
      const criticalOpen = Number(summary.criticalOpen || 0);
      const projectedCritical = criticalOpen + Math.max(1, Math.round((criticalOpen * spikePercent) / 100));
      return {
        durationHours: Number(overrides.durationHours || 8) || 8,
        openEvents: Number(summary.openEvents || 0) + Math.max(1, Math.floor(projectedCritical / 2)),
        overdueEvents: Number(summary.overdueEvents || 0),
        criticalOpen: projectedCritical,
        recurringFailures: Number(summary.recurringFailures || 0),
        headline: `Cenário projeta ${projectedCritical} alertas críticos simultâneos.`,
      };
    },
  },
];

function getScenarioById(id) {
  const target = String(id || "").trim().toLowerCase();
  return SCENARIO_CATALOG.find((scenario) => scenario.id.toLowerCase() === target) || null;
}

module.exports = {
  SCENARIO_CATALOG,
  getScenarioById,
};

