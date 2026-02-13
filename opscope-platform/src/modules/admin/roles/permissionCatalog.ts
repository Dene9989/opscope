export type PermissionLevel = "READ" | "WRITE" | "ADMIN";

export type PermissionDef = {
  key: string;
  module: string;
  group: string;
  label: string;
  description?: string;
  level: PermissionLevel;
  dangerous?: boolean;
  legacy?: boolean;
  hidden?: boolean;
};

export const ADMIN_PERMISSION_KEY = "ADMIN";

export const PERMISSION_CATALOG: PermissionDef[] = [
  {
    key: ADMIN_PERMISSION_KEY,
    module: "Administracao",
    group: "Admin total",
    label: "Admin total",
    description: "Acesso total ao sistema.",
    level: "ADMIN",
    dangerous: true,
    hidden: true
  },
  {
    key: "gerenciarAcessos",
    module: "Administracao",
    group: "Acesso",
    label: "Gerenciar acessos",
    description: "Criar e editar cargos e permissoes.",
    level: "ADMIN",
    dangerous: true
  },
  {
    key: "editarPerfil",
    module: "Administracao",
    group: "Perfis",
    label: "Editar perfil (UEN/Projeto)",
    description: "Permite editar UEN e projeto do proprio perfil.",
    level: "WRITE"
  },
  {
    key: "editarPerfilOutros",
    module: "Administracao",
    group: "Perfis",
    label: "Editar perfil de outros",
    description: "Permite alterar dados de outros colaboradores.",
    level: "ADMIN",
    dangerous: true
  },
  {
    key: "verUsuarios",
    module: "Contas e equipe",
    group: "Acesso",
    label: "Ver usuarios",
    description: "Visualizar lista de usuarios e perfis.",
    level: "READ"
  },
  {
    key: "convidarUsuarios",
    module: "Contas e equipe",
    group: "Acoes",
    label: "Convidar usuarios",
    description: "Criar novas contas e enviar convites.",
    level: "WRITE"
  },
  {
    key: "desativarUsuarios",
    module: "Contas e equipe",
    group: "Acoes",
    label: "Desativar usuarios",
    description: "Ativar ou inativar contas existentes.",
    level: "ADMIN",
    dangerous: true
  },
  {
    key: "ROLE_READ",
    module: "Cargos",
    group: "Acesso",
    label: "Visualizar cargos",
    description: "Acesso de leitura aos cargos.",
    level: "READ"
  },
  {
    key: "ROLE_WRITE",
    module: "Cargos",
    group: "Acoes",
    label: "Gerenciar cargos",
    description: "Criar, editar e remover cargos.",
    level: "ADMIN",
    dangerous: true
  },
  {
    key: "inicio",
    module: "Navegacao",
    group: "Secoes",
    label: "Inicio",
    description: "Acesso ao painel inicial.",
    level: "READ"
  },
  {
    key: "programacao",
    module: "Navegacao",
    group: "Secoes",
    label: "Programacao",
    description: "Acesso a programacao de manutencoes.",
    level: "READ"
  },
  {
    key: "nova",
    module: "Navegacao",
    group: "Secoes",
    label: "Nova manutencao",
    description: "Acesso ao formulario de manutencao.",
    level: "READ"
  },
  {
    key: "modelos",
    module: "Navegacao",
    group: "Secoes",
    label: "Modelos e recorrencias",
    description: "Acesso a modelos e recorrencias.",
    level: "READ"
  },
  {
    key: "execucao",
    module: "Navegacao",
    group: "Secoes",
    label: "Execucao do dia",
    description: "Acesso ao painel de execucao.",
    level: "READ"
  },
  {
    key: "backlog",
    module: "Navegacao",
    group: "Secoes",
    label: "Backlog",
    description: "Acesso a manutencoes em backlog.",
    level: "READ"
  },
  {
    key: "feedbacks",
    module: "Navegacao",
    group: "Secoes",
    label: "Feedbacks",
    description: "Acesso a feedbacks e comunicados.",
    level: "READ"
  },
  {
    key: "perfil",
    module: "Navegacao",
    group: "Secoes",
    label: "Meu perfil",
    description: "Acesso a tela de perfil.",
    level: "READ"
  },
  {
    key: "MAINT_CREATE",
    module: "Manutencao",
    group: "Acoes",
    label: "Manutencao - criar",
    description: "Criar novas manutencoes.",
    level: "WRITE"
  },
  {
    key: "MAINT_EDIT",
    module: "Manutencao",
    group: "Acoes",
    label: "Manutencao - editar",
    description: "Editar manutencoes existentes.",
    level: "WRITE"
  },
  {
    key: "MAINT_REMOVE",
    module: "Manutencao",
    group: "Acoes",
    label: "Manutencao - excluir",
    description: "Excluir manutencoes do sistema.",
    level: "ADMIN",
    dangerous: true
  },
  {
    key: "MAINT_RESCHEDULE",
    module: "Manutencao",
    group: "Acoes",
    label: "Manutencao - reagendar",
    description: "Reagendar manutencoes.",
    level: "WRITE"
  },
  {
    key: "MAINT_COMPLETE",
    module: "Manutencao",
    group: "Acoes",
    label: "Manutencao - executar",
    description: "Registrar execucao e conclusao.",
    level: "WRITE"
  },
  {
    key: "verProjetos",
    module: "Projetos",
    group: "Acesso",
    label: "Ver projetos",
    description: "Visualizar projetos e dados associados.",
    level: "READ"
  },
  {
    key: "gerenciarProjetos",
    module: "Projetos",
    group: "Acoes",
    label: "Gerenciar projetos",
    description: "Criar e editar projetos.",
    level: "WRITE"
  },
  {
    key: "gerenciarEquipamentos",
    module: "Projetos",
    group: "Acoes",
    label: "Gerenciar equipamentos",
    description: "Cadastrar e ajustar equipamentos.",
    level: "WRITE"
  },
  {
    key: "gerenciarEquipeProjeto",
    module: "Projetos",
    group: "Acoes",
    label: "Gerenciar equipe do projeto",
    description: "Adicionar ou remover membros do projeto.",
    level: "WRITE"
  },
  {
    key: "gerenciarPMP",
    module: "PMP / Cronograma",
    group: "Acoes",
    label: "Gerenciar PMP/Cronograma",
    description: "Editar planos e cronogramas de manutencao.",
    level: "WRITE"
  },
  {
    key: "verSST",
    module: "SST",
    group: "Acesso",
    label: "Ver SST",
    description: "Visualizar modulos de SST.",
    level: "READ"
  },
  {
    key: "gerenciarSST",
    module: "SST",
    group: "Acoes",
    label: "Gerenciar SST",
    description: "Criar e editar dados de SST.",
    level: "WRITE"
  },
  {
    key: "verAlmoxarifado",
    module: "Almoxarifado",
    group: "Acesso",
    label: "Ver almoxarifado",
    description: "Visualizar itens e estoque.",
    level: "READ"
  },
  {
    key: "gerenciarAlmoxarifado",
    module: "Almoxarifado",
    group: "Acoes",
    label: "Gerenciar almoxarifado",
    description: "Criar e editar registros do almoxarifado.",
    level: "WRITE"
  },
  {
    key: "verArquivos",
    module: "Arquivos",
    group: "Acesso",
    label: "Ver arquivos",
    description: "Visualizar arquivos enviados.",
    level: "READ"
  },
  {
    key: "uploadArquivos",
    module: "Arquivos",
    group: "Acoes",
    label: "Enviar arquivos",
    description: "Enviar novos arquivos para o sistema.",
    level: "WRITE"
  },
  {
    key: "excluirArquivos",
    module: "Arquivos",
    group: "Acoes",
    label: "Excluir arquivos",
    description: "Remover arquivos do sistema.",
    level: "ADMIN",
    dangerous: true
  },
  {
    key: "vincularArquivo",
    module: "Arquivos",
    group: "Acoes",
    label: "Vincular arquivo",
    description: "Relacionar arquivos a registros.",
    level: "WRITE"
  },
  {
    key: "verRDOs",
    module: "RDOs",
    group: "Acesso",
    label: "Ver RDOs",
    description: "Visualizar RDOs existentes.",
    level: "READ"
  },
  {
    key: "gerarRDOs",
    module: "RDOs",
    group: "Acoes",
    label: "Gerar RDOs",
    description: "Gerar novos RDOs.",
    level: "WRITE"
  },
  {
    key: "excluirRDOs",
    module: "RDOs",
    group: "Acoes",
    label: "Excluir RDOs",
    description: "Remover RDOs do sistema.",
    level: "ADMIN",
    dangerous: true
  },
  {
    key: "verRelatorios",
    module: "Relatorios & KPIs",
    group: "Acesso",
    label: "Ver relatorios",
    description: "Visualizar relatorios e KPIs.",
    level: "READ"
  },
  {
    key: "exportarRelatorios",
    module: "Relatorios & KPIs",
    group: "Acoes",
    label: "Exportar relatorios",
    description: "Exportar relatorios e indicadores.",
    level: "WRITE"
  },
  {
    key: "verAutomacoes",
    module: "Automacoes",
    group: "Acesso",
    label: "Ver automacoes",
    description: "Visualizar automacoes configuradas.",
    level: "READ"
  },
  {
    key: "gerenciarAutomacoes",
    module: "Automacoes",
    group: "Acoes",
    label: "Gerenciar automacoes",
    description: "Criar e ajustar automacoes.",
    level: "ADMIN"
  },
  {
    key: "verDiagnostico",
    module: "Diagnostico",
    group: "Acesso",
    label: "Ver diagnostico",
    description: "Visualizar status do sistema.",
    level: "READ"
  },
  {
    key: "reexecutarTarefas",
    module: "Diagnostico",
    group: "Acoes",
    label: "Reexecutar tarefas",
    description: "Executar tarefas de diagnostico.",
    level: "ADMIN"
  },
  {
    key: "verLogsAPI",
    module: "Logs & Rastreabilidade",
    group: "Acesso",
    label: "Ver logs de API",
    description: "Visualizar registros de integracao.",
    level: "READ"
  },
  {
    key: "limparLogsAPI",
    module: "Logs & Rastreabilidade",
    group: "Acoes",
    label: "Limpar logs de API",
    description: "Remover registros de log.",
    level: "ADMIN",
    dangerous: true
  },
  {
    key: "verPainelGerencial",
    module: "Painel gerencial",
    group: "Acesso",
    label: "Ver painel gerencial",
    description: "Acesso ao painel gerencial.",
    level: "READ"
  },
  {
    key: "USER_READ",
    module: "Contas e equipe",
    group: "Compatibilidade (legado)",
    label: "Visualizar usuarios (legado)",
    description: "Permissao antiga de leitura de usuarios.",
    level: "READ",
    legacy: true
  },
  {
    key: "USER_WRITE",
    module: "Contas e equipe",
    group: "Compatibilidade (legado)",
    label: "Gerenciar usuarios (legado)",
    description: "Permissao antiga de escrita de usuarios.",
    level: "ADMIN",
    dangerous: true,
    legacy: true
  },
  {
    key: "PROJECT_READ",
    module: "Projetos",
    group: "Compatibilidade (legado)",
    label: "Projetos - leitura (legado)",
    description: "Permissao antiga de leitura de projetos.",
    level: "READ",
    legacy: true
  },
  {
    key: "PROJECT_WRITE",
    module: "Projetos",
    group: "Compatibilidade (legado)",
    label: "Projetos - escrita (legado)",
    description: "Permissao antiga de escrita de projetos.",
    level: "WRITE",
    legacy: true
  },
  {
    key: "SST_READ",
    module: "SST",
    group: "Compatibilidade (legado)",
    label: "SST - leitura (legado)",
    description: "Permissao antiga de leitura de SST.",
    level: "READ",
    legacy: true
  },
  {
    key: "SST_WRITE",
    module: "SST",
    group: "Compatibilidade (legado)",
    label: "SST - escrita (legado)",
    description: "Permissao antiga de escrita de SST.",
    level: "WRITE",
    legacy: true
  },
  {
    key: "ALMOX_READ",
    module: "Almoxarifado",
    group: "Compatibilidade (legado)",
    label: "Almoxarifado - leitura (legado)",
    description: "Permissao antiga de leitura de almoxarifado.",
    level: "READ",
    legacy: true
  },
  {
    key: "ALMOX_WRITE",
    module: "Almoxarifado",
    group: "Compatibilidade (legado)",
    label: "Almoxarifado - escrita (legado)",
    description: "Permissao antiga de escrita de almoxarifado.",
    level: "WRITE",
    legacy: true
  },
  {
    key: "REPORTS_READ",
    module: "Relatorios & KPIs",
    group: "Compatibilidade (legado)",
    label: "Relatorios - leitura (legado)",
    description: "Permissao antiga de leitura de relatorios.",
    level: "READ",
    legacy: true
  },
  {
    key: "KPIS_READ",
    module: "Relatorios & KPIs",
    group: "Compatibilidade (legado)",
    label: "KPIs - leitura (legado)",
    description: "Permissao antiga de leitura de KPIs.",
    level: "READ",
    legacy: true
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

export type CatalogModule = {
  name: string;
  groups: Record<string, PermissionDef[]>;
  permissions: PermissionDef[];
};

export function buildCatalogModules(catalog: PermissionDef[] = PERMISSION_CATALOG) {
  const byModule = new Map<string, CatalogModule>();
  catalog.forEach((permission) => {
    const moduleName = permission.module || "Outros";
    if (!byModule.has(moduleName)) {
      byModule.set(moduleName, { name: moduleName, groups: {}, permissions: [] });
    }
    const entry = byModule.get(moduleName)!;
    entry.permissions.push(permission);
    const groupName = permission.group || "Geral";
    if (!entry.groups[groupName]) {
      entry.groups[groupName] = [];
    }
    entry.groups[groupName].push(permission);
  });
  const ordered = PERMISSION_MODULE_ORDER.filter((name) => byModule.has(name)).map((name) => byModule.get(name)!);
  const extras = Array.from(byModule.values()).filter((mod) => !PERMISSION_MODULE_ORDER.includes(mod.name));
  return [...ordered, ...extras];
}

export function getAllPermissionKeys(
  catalog: PermissionDef[] = PERMISSION_CATALOG,
  options: { includeHidden?: boolean; includeAdmin?: boolean } = {}
) {
  const includeHidden = options.includeHidden ?? false;
  const includeAdmin = options.includeAdmin ?? true;
  return catalog
    .filter((permission) => {
      if (!includeHidden && permission.hidden && permission.key !== ADMIN_PERMISSION_KEY) {
        return false;
      }
      if (!includeAdmin && permission.key === ADMIN_PERMISSION_KEY) {
        return false;
      }
      return true;
    })
    .map((permission) => permission.key);
}

export function getReadPermissionKeys(
  catalog: PermissionDef[] = PERMISSION_CATALOG,
  moduleName?: string
) {
  return catalog
    .filter((permission) => {
      if (permission.hidden) {
        return false;
      }
      if (permission.level !== "READ") {
        return false;
      }
      if (moduleName && permission.module !== moduleName) {
        return false;
      }
      return true;
    })
    .map((permission) => permission.key);
}

export function getPermissionSearchText(permission: PermissionDef) {
  return [permission.key, permission.label, permission.description, permission.group, permission.module]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
