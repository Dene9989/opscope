export type AccessLevel = "NONE" | "VIEW" | "EDIT";

export type PermissionItemDef = {
  key: string;
  module: string;
  label: string;
  description?: string;
  dangerous?: boolean;
  viewKeys: string[];
  editKeys: string[];
};

export const ADMIN_PERMISSION_KEY = "ADMIN";
export const ADMIN_PERMISSION_ALIASES = ["ADMIN_TOTAL"];

export const PERMISSION_ITEMS: PermissionItemDef[] = [
  {
    key: "admin_access",
    module: "Administracao",
    label: "Gerenciar acessos",
    description: "Criar e editar cargos e permissoes.",
    dangerous: true,
    viewKeys: ["gerenciarAcessos"],
    editKeys: []
  },
  {
    key: "profile_edit_own",
    module: "Administracao",
    label: "Editar perfil (UEN/Projeto)",
    description: "Permite editar UEN e projeto do proprio perfil.",
    viewKeys: ["editarPerfil"],
    editKeys: []
  },
  {
    key: "profile_edit_others",
    module: "Administracao",
    label: "Editar perfil de outros",
    description: "Permite alterar dados de outros colaboradores.",
    dangerous: true,
    viewKeys: ["editarPerfilOutros"],
    editKeys: []
  },
  {
    key: "role_access",
    module: "Cargos",
    label: "Cargos e permissoes",
    description: "Gerenciar cargos e permissoes dos usuarios.",
    dangerous: true,
    viewKeys: ["ROLE_READ"],
    editKeys: ["ROLE_WRITE"]
  },
  {
    key: "users",
    module: "Contas e equipe",
    label: "Usuarios",
    description: "Visualizar, criar e desativar contas.",
    dangerous: true,
    viewKeys: ["verUsuarios", "USER_READ"],
    editKeys: ["convidarUsuarios", "desativarUsuarios", "USER_WRITE"]
  },
  {
    key: "nav_inicio",
    module: "Navegacao",
    label: "Inicio",
    description: "Acesso ao painel inicial.",
    viewKeys: ["inicio"],
    editKeys: []
  },
  {
    key: "nav_programacao",
    module: "Navegacao",
    label: "Programacao",
    description: "Acesso a programacao de manutencoes.",
    viewKeys: ["programacao"],
    editKeys: []
  },
  {
    key: "nav_nova",
    module: "Navegacao",
    label: "Nova manutencao",
    description: "Acesso ao formulario de manutencao.",
    viewKeys: ["nova"],
    editKeys: []
  },
  {
    key: "nav_modelos",
    module: "Navegacao",
    label: "Modelos e recorrencias",
    description: "Acesso a modelos e recorrencias.",
    viewKeys: ["modelos"],
    editKeys: []
  },
  {
    key: "nav_execucao",
    module: "Navegacao",
    label: "Execucao do dia",
    description: "Acesso ao painel de execucao.",
    viewKeys: ["execucao"],
    editKeys: []
  },
  {
    key: "nav_backlog",
    module: "Navegacao",
    label: "Backlog",
    description: "Acesso a manutencoes em backlog.",
    viewKeys: ["backlog"],
    editKeys: []
  },
  {
    key: "nav_feedbacks",
    module: "Navegacao",
    label: "Feedbacks",
    description: "Acesso a feedbacks e comunicados.",
    viewKeys: ["feedbacks"],
    editKeys: []
  },
  {
    key: "nav_perfil",
    module: "Navegacao",
    label: "Meu perfil",
    description: "Acesso a tela de perfil.",
    viewKeys: ["perfil"],
    editKeys: []
  },
  {
    key: "maintenance_create",
    module: "Manutencao",
    label: "Criar manutencoes",
    description: "Criar novas manutencoes.",
    viewKeys: ["MAINT_CREATE"],
    editKeys: []
  },
  {
    key: "maintenance_edit",
    module: "Manutencao",
    label: "Editar manutencoes",
    description: "Editar manutencoes existentes.",
    viewKeys: ["MAINT_EDIT"],
    editKeys: []
  },
  {
    key: "maintenance_reschedule",
    module: "Manutencao",
    label: "Reagendar manutencoes",
    description: "Reagendar manutencoes.",
    viewKeys: ["MAINT_RESCHEDULE"],
    editKeys: []
  },
  {
    key: "maintenance_complete",
    module: "Manutencao",
    label: "Executar manutencoes",
    description: "Registrar execucao e conclusao.",
    viewKeys: ["MAINT_COMPLETE"],
    editKeys: []
  },
  {
    key: "maintenance_remove",
    module: "Manutencao",
    label: "Excluir manutencoes",
    description: "Excluir manutencoes do sistema.",
    dangerous: true,
    viewKeys: ["MAINT_REMOVE"],
    editKeys: []
  },
  {
    key: "projects",
    module: "Projetos",
    label: "Projetos",
    description: "Visualizar e gerenciar projetos.",
    viewKeys: ["verProjetos", "PROJECT_READ"],
    editKeys: ["gerenciarProjetos", "gerenciarEquipamentos", "gerenciarEquipeProjeto", "PROJECT_WRITE"]
  },
  {
    key: "pmp",
    module: "PMP / Cronograma",
    label: "PMP/Cronograma",
    description: "Editar planos e cronogramas de manutencao.",
    viewKeys: ["gerenciarPMP"],
    editKeys: []
  },
  {
    key: "sst",
    module: "SST",
    label: "SST",
    description: "Visualizar e gerenciar SST.",
    viewKeys: ["verSST", "SST_READ"],
    editKeys: ["gerenciarSST", "SST_WRITE"]
  },
  {
    key: "almox",
    module: "Almoxarifado",
    label: "Almoxarifado",
    description: "Visualizar e gerenciar almoxarifado.",
    viewKeys: ["verAlmoxarifado", "ALMOX_READ"],
    editKeys: ["gerenciarAlmoxarifado", "ALMOX_WRITE"]
  },
  {
    key: "files",
    module: "Arquivos",
    label: "Arquivos",
    description: "Visualizar, enviar e excluir arquivos.",
    dangerous: true,
    viewKeys: ["verArquivos"],
    editKeys: ["uploadArquivos", "vincularArquivo", "excluirArquivos"]
  },
  {
    key: "rdos",
    module: "RDOs",
    label: "RDOs",
    description: "Visualizar e gerenciar RDOs.",
    dangerous: true,
    viewKeys: ["verRDOs"],
    editKeys: ["gerarRDOs", "excluirRDOs"]
  },
  {
    key: "reports",
    module: "Relatorios & KPIs",
    label: "Relatorios e KPIs",
    description: "Visualizar e exportar relatorios e KPIs.",
    viewKeys: ["verRelatorios", "REPORTS_READ", "KPIS_READ"],
    editKeys: ["exportarRelatorios"]
  },
  {
    key: "automations",
    module: "Automacoes",
    label: "Automacoes",
    description: "Visualizar e gerenciar automacoes.",
    viewKeys: ["verAutomacoes"],
    editKeys: ["gerenciarAutomacoes"]
  },
  {
    key: "diagnostics",
    module: "Diagnostico",
    label: "Diagnostico",
    description: "Monitorar status e reexecutar tarefas.",
    dangerous: true,
    viewKeys: ["verDiagnostico"],
    editKeys: ["reexecutarTarefas"]
  },
  {
    key: "logs",
    module: "Logs & Rastreabilidade",
    label: "Logs de API",
    description: "Visualizar e limpar logs de integracao.",
    dangerous: true,
    viewKeys: ["verLogsAPI"],
    editKeys: ["limparLogsAPI"]
  },
  {
    key: "gerencial",
    module: "Painel gerencial",
    label: "Painel gerencial",
    description: "Acesso ao painel gerencial.",
    viewKeys: ["verPainelGerencial"],
    editKeys: []
  }
];

export const PERMISSION_MODULE_ORDER = [
  "Administracao",
  "Navegacao",
  "Manutencao",
  "Contas e equipe",
  "Cargos",
  "Projetos",
  "PMP / Cronograma",
  "SST",
  "Almoxarifado",
  "Arquivos",
  "RDOs",
  "Relatorios & KPIs",
  "Automacoes",
  "Diagnostico",
  "Logs & Rastreabilidade",
  "Painel gerencial"
];

export type PermissionModule = {
  name: string;
  items: PermissionItemDef[];
};

export function buildPermissionModules(items: PermissionItemDef[] = PERMISSION_ITEMS) {
  const byModule = new Map<string, PermissionModule>();
  items.forEach((item) => {
    const moduleName = item.module || "Outros";
    if (!byModule.has(moduleName)) {
      byModule.set(moduleName, { name: moduleName, items: [] });
    }
    byModule.get(moduleName)!.items.push(item);
  });
  const ordered = PERMISSION_MODULE_ORDER.filter((name) => byModule.has(name)).map((name) => byModule.get(name)!);
  const extras = Array.from(byModule.values()).filter((module) => !PERMISSION_MODULE_ORDER.includes(module.name));
  return [...ordered, ...extras];
}

export function getPermissionSearchText(item: PermissionItemDef) {
  return [item.key, item.label, item.description, item.module].filter(Boolean).join(" ").toLowerCase();
}

export function getKnownPermissionKeys(items: PermissionItemDef[] = PERMISSION_ITEMS) {
  const keys = new Set<string>();
  items.forEach((item) => {
    item.viewKeys.forEach((key) => keys.add(key));
    item.editKeys.forEach((key) => keys.add(key));
  });
  return keys;
}
