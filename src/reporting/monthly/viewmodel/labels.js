const STATUS_LABELS = {
  agendada: "Agendada",
  liberada: "Liberada",
  em_execucao: "Em execução",
  encerramento: "Encerramento",
  concluida: "Concluída",
  backlog: "Backlog",
  cancelada: "Cancelada",
  unknown: "Status pendente de atualização",
};

const PRIORITY_LABELS = {
  critica: "Crítica",
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
  normal: "Normal",
  prioridade_pendente: "Prioridade pendente de definição operacional",
  unknown: "Prioridade pendente de definição operacional",
};

const CATEGORY_LABELS = {
  programacao_futura: "Programação futura",
};

const TEAM_LABELS = {
  om_boa_sorte_ii: "O&M Boa Sorte II",
  "o&m_boa_sorte_ii": "O&M Boa Sorte II",
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
    return "Classificação pendente de execução";
  }
  if (context === "priority") {
    return "Prioridade pendente de definição operacional";
  }
  if (context === "location") {
    return "Local não informado";
  }
  if (context === "team") {
    return "Equipe não informada";
  }
  return "Informação pendente";
}

function formatLabel(raw, context = "") {
  const rawText = String(raw || "").trim();
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
  if (context === "category" && CATEGORY_LABELS[key]) {
    return CATEGORY_LABELS[key];
  }
  if (context === "team" && TEAM_LABELS[key]) {
    return TEAM_LABELS[key];
  }
  if (key === "unknown") {
    return formatUnknownLabel(context);
  }
  if (context === "location" && rawText) {
    return rawText;
  }
  if (context === "category" && rawText && /[A-Z0-9/()-]/.test(rawText)) {
    return rawText;
  }
  return titleCase(key.replace(/_/g, " "));
}

module.exports = {
  formatLabel,
};
