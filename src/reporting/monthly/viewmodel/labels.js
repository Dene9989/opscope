const STATUS_LABELS = {
  agendada: "Agendada",
  liberada: "Liberada",
  em_execucao: "Em execução",
  encerramento: "Encerramento",
  concluida: "Concluída",
  backlog: "Backlog",
  cancelada: "Cancelada",
  unknown: "Não classificado",
};

const PRIORITY_LABELS = {
  critica: "Crítica",
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
  normal: "Normal",
  unknown: "Não classificado",
};

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_");
}

function titleCase(text) {
  return String(text || "")
    .split(" ")
    .map((word) => {
      if (!word) {
        return "";
      }
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatUnknownLabel(context) {
  if (context === "category") {
    return "Categoria não definida";
  }
  if (context === "priority") {
    return "Prioridade não definida";
  }
  return "Não informado";
}

function formatLabel(raw, context = "") {
  const key = normalizeKey(raw);
  if (!key || key === "nao_informado" || key === "desconhecida") {
    return formatUnknownLabel(context);
  }
  if (context === "status" && STATUS_LABELS[key]) {
    return STATUS_LABELS[key];
  }
  if (context === "priority" && PRIORITY_LABELS[key]) {
    return PRIORITY_LABELS[key];
  }
  if (key === "unknown") {
    return "Não classificado";
  }
  return titleCase(key.replace(/_/g, " "));
}

module.exports = {
  formatLabel,
};
