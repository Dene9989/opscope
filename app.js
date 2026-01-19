const btnAdicionarManutencao = document.getElementById("btnAdicionarManutencao");
const tipoManutencao = document.getElementById("tipoManutencao");
const customTipoField = document.getElementById("customTipoField");
const tituloManutencao = document.getElementById("tituloManutencao");
const subestacaoManutencao = document.getElementById("subestacaoManutencao");
const dataManutencao = document.getElementById("dataManutencao");
const obsManutencao = document.getElementById("obsManutencao");
const categoriaManutencao = document.getElementById("categoriaManutencao");
const prioridadeManutencao = document.getElementById("prioridadeManutencao");
const osReferenciaManutencao = document.getElementById("osReferenciaManutencao");
const participantesManutencao = document.getElementById("participantesManutencao");
const participantesManutencaoErro = document.getElementById("participantesManutencaoErro");
const criticoManutencao = document.getElementById("criticoManutencao");
const novaDocPt = document.getElementById("novaDocPt");
const novaPtLabel = document.getElementById("novaPtLabel");
const novaDocInputs = Array.from(document.querySelectorAll("[data-nova-doc-input]"));
const novaDocButtons = Array.from(document.querySelectorAll("[data-nova-doc-btn]"));
const novaDocViews = Array.from(document.querySelectorAll("[data-nova-doc-view]"));
const novaDocNames = Array.from(document.querySelectorAll("[data-nova-doc-name]"));
const mensagemManutencao = document.getElementById("mensagemManutencao");
const listaLembretes = document.getElementById("listaLembretes");
const lembretesVazio = document.getElementById("lembretesVazio");
const listaAgendadas = document.getElementById("listaAgendadas");
const listaAgendadasVazia = document.getElementById("listaAgendadasVazia");
const alertaProgramacao = document.getElementById("alertaProgramacao");
const filtroProgramacaoSubestacao = document.getElementById("filtroProgramacaoSubestacao");
const filtroProgramacaoStatus = document.getElementById("filtroProgramacaoStatus");
const filtroProgramacaoPeriodo = document.getElementById("filtroProgramacaoPeriodo");
const listaBacklog = document.getElementById("listaBacklog");
const listaBacklogVazia = document.getElementById("listaBacklogVazia");
const listaConcluidas = document.getElementById("listaConcluidas");
const listaConcluidasVazia = document.getElementById("listaConcluidasVazia");
const listaAuditoria = document.getElementById("listaAuditoria");
const auditVazio = document.getElementById("auditVazio");
const listaExecucaoHoje = document.getElementById("listaExecucaoHoje");
const listaExecucaoHojeVazia = document.getElementById("listaExecucaoHojeVazia");
const listaExecucaoVencidas = document.getElementById("listaExecucaoVencidas");
const listaExecucaoVencidasVazia = document.getElementById("listaExecucaoVencidasVazia");
const listaExecucaoCriticas = document.getElementById("listaExecucaoCriticas");
const listaExecucaoCriticasVazia = document.getElementById("listaExecucaoCriticasVazia");
const listaRelatorios = document.getElementById("listaRelatorios");
const listaRelatoriosVazia = document.getElementById("listaRelatoriosVazia");
const countAgendadas = document.getElementById("countAgendadas");
const countLiberadas = document.getElementById("countLiberadas");
const countBacklog = document.getElementById("countBacklog");
const countEmExecucao = document.getElementById("countEmExecucao");
const countEncerramento = document.getElementById("countEncerramento");
const countConcluidas = document.getElementById("countConcluidas");
const diasLembrete = document.getElementById("diasLembrete");
const graficoKpi = document.getElementById("graficoKpi");
const kpiTotal = document.getElementById("kpiTotal");
const kpiConclusao = document.getElementById("kpiConclusao");
const kpiConcluidas = document.getElementById("kpiConcluidas");
const kpiBacklog = document.getElementById("kpiBacklog");
const kpiPontual = document.getElementById("kpiPontual");
const kpiAtraso = document.getElementById("kpiAtraso");
const kpiPeriodo = document.getElementById("kpiPeriodo");
const kpiSubestacao = document.getElementById("kpiSubestacao");
const kpiCategoria = document.getElementById("kpiCategoria");
const kpiPrioridade = document.getElementById("kpiPrioridade");
const kpiUsuarioFiltro = document.getElementById("kpiUsuarioFiltro");
const kpiCards = document.getElementById("kpiCards");
const kpiTrendChart = document.getElementById("kpiTrendChart");
const kpiAgingChart = document.getElementById("kpiAgingChart");
const kpiSlaChart = document.getElementById("kpiSlaChart");
const kpiRanking = document.getElementById("kpiRanking");
const kpiRankingVazio = document.getElementById("kpiRankingVazio");
const kpiDrilldownTitulo = document.getElementById("kpiDrilldownTitulo");
const kpiDrilldownTabela = document.getElementById("kpiDrilldownTabela");
const kpiDrilldownVazio = document.getElementById("kpiDrilldownVazio");
const kpiDrilldownLimite = document.getElementById("kpiDrilldownLimite");
const homeHoje = document.getElementById("homeHoje");
const homeAtrasadas = document.getElementById("homeAtrasadas");
const homeCriticas = document.getElementById("homeCriticas");
const homeRisco = document.getElementById("homeRisco");
const homeAlertas = document.getElementById("homeAlertas");
const homeAlertasVazio = document.getElementById("homeAlertasVazio");
const homePontual = document.getElementById("homePontual");
const homeBacklog = document.getElementById("homeBacklog");
const homeConcluidas = document.getElementById("homeConcluidas");
const homeAtrasoMedio = document.getElementById("homeAtrasoMedio");
const btnLembretes = document.getElementById("btnBell") || document.getElementById("btnLembretes");
const lembretesCount = document.getElementById("bellDot") || document.getElementById("lembretesCount");
const painelLembretes = document.getElementById("painelLembretes");
const loadingOverlay = document.getElementById("loadingOverlay");
const sidebar = document.getElementById("sidebar");
const btnToggleSidebar = document.querySelectorAll(
  "#btnSidebar, #btnSidebarToggle, #btnToggleSidebar, #btnMenu, #topbarMenuToggle, .header-toggle"
);
const appShell = document.querySelector(".app") || document.querySelector(".app-shell");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const dashboardHome = document.getElementById("dashboardHome");
const perfilNome = document.getElementById("perfilNome");
const perfilMatricula = document.getElementById("perfilMatricula");
const perfilCargo = document.getElementById("perfilCargo");
const perfilProjeto = document.getElementById("perfilProjeto");
const perfilRole = document.getElementById("perfilRole");
const perfilAtribuicoes = document.getElementById("perfilAtribuicoes");
const perfilPermissoes = document.getElementById("perfilPermissoes");
const perfilSecoes = document.getElementById("perfilSecoes");

const usuarioAtual = document.getElementById("userChip") || document.getElementById("usuarioAtual");
const userAvatar = document.getElementById("userAvatar");
const btnTabLogin = document.getElementById("btnTabLogin");
const btnTabRegistro = document.getElementById("btnTabRegistro");
const btnSair = document.getElementById("btnLogout") || document.getElementById("btnSair");
const authPanels = document.getElementById("authPanels");
const authPanelLogin = document.querySelector("[data-auth-panel='login']");
const authPanelRegistro = document.querySelector("[data-auth-panel='registro']");
const loginForm = document.getElementById("loginForm");
const loginUsuario = document.getElementById("loginUsuario");
const loginSenha = document.getElementById("loginSenha");
const btnLoginSubmit = document.getElementById("btnLoginSubmit");
const btnToggleLoginSenha = document.getElementById("btnToggleLoginSenha");
const capsLockLogin = document.getElementById("capsLockLogin");
const reqForm = document.getElementById("reqForm");
const reqMatricula = document.getElementById("reqMatricula");
const reqNome = document.getElementById("reqNome");
const reqSenha = document.getElementById("reqSenha");
const reqSenhaConfirm = document.getElementById("reqSenhaConfirm");
const reqCodigoConvite = document.getElementById("reqCodigoConvite");
const btnRegistroSubmit = document.getElementById("btnRegistroSubmit");
const btnToggleReqSenha = document.getElementById("btnToggleReqSenha");
const btnToggleReqSenhaConfirm = document.getElementById("btnToggleReqSenhaConfirm");
const capsLockRegistro = document.getElementById("capsLockRegistro");
const reqSenhaRules = document.getElementById("reqSenhaRules");
const reqSenhaErro = document.getElementById("reqSenhaErro");
const reqSenhaConfirmErro = document.getElementById("reqSenhaConfirmErro");
const reqCodigoErro = document.getElementById("reqCodigoErro");
const mensagemConta = document.getElementById("mensagemConta");
const perfilAvatarPreview = document.getElementById("perfilAvatarPreview");
const perfilAvatarInput = document.getElementById("perfilAvatarInput");
const btnAvatarChange = document.getElementById("btnAvatarChange");
const btnAvatarSave = document.getElementById("btnAvatarSave");
const perfilAvatarErro = document.getElementById("perfilAvatarErro");
const configDiasLembrete = document.getElementById("configDiasLembrete");
const btnSalvarConfig = document.getElementById("btnSalvarConfig");
const btnExportarDados = document.getElementById("btnExportarDados");
const inputImportarDados = document.getElementById("inputImportarDados");
const btnImportarDados = document.getElementById("btnImportarDados");
const inputDiasLimpeza = document.getElementById("inputDiasLimpeza");
const btnLimparConcluidas = document.getElementById("btnLimparConcluidas");
const btnLimparAuditoria = document.getElementById("btnLimparAuditoria");
const btnRecalcularBacklog = document.getElementById("btnRecalcularBacklog");
const btnGerarRelatorio = document.getElementById("btnGerarRelatorio");
const relatorioGerencial = document.getElementById("relatorioGerencial");
const mensagemGerencial = document.getElementById("mensagemGerencial");
const templateForm = document.getElementById("templateForm");
const templateNome = document.getElementById("templateNome");
const templateSubestacao = document.getElementById("templateSubestacao");
const templateFrequencia = document.getElementById("templateFrequencia");
const templateNomeErro = document.getElementById("templateNomeErro");
const templateInicioErro = document.getElementById("templateInicioErro");
const templateDailyErro = document.getElementById("templateDailyErro");
const templateWeeklyIntervalErro = document.getElementById("templateWeeklyIntervalErro");
const templateMonthlyDayErro = document.getElementById("templateMonthlyDayErro");
const templateMonthlyDaysErro = document.getElementById("templateMonthlyDaysErro");
const templateDailyField = document.getElementById("templateDailyField");
const templateDailyDays = document.querySelectorAll("[data-template-daily-day]");
const btnPresetDiasUteis = document.getElementById("btnPresetDiasUteis");
const templateWeeklyDayField = document.getElementById("templateWeeklyDayField");
const templateWeeklyDay = document.getElementById("templateWeeklyDay");
const templateWeeklyIntervalField = document.getElementById("templateWeeklyIntervalField");
const templateWeeklyInterval = document.getElementById("templateWeeklyInterval");
const templateMonthlyModeField = document.getElementById("templateMonthlyModeField");
const templateMonthlyFixed = document.getElementById("templateMonthlyFixed");
const templateMonthlyMulti = document.getElementById("templateMonthlyMulti");
const templateMonthlyDayField = document.getElementById("templateMonthlyDayField");
const templateMonthlyDay = document.getElementById("templateMonthlyDay");
const templateMonthlyDaysField = document.getElementById("templateMonthlyDaysField");
const templateMonthlyDaysInput = document.getElementById("templateMonthlyDaysInput");
const templateMonthlyDaysChips = document.getElementById("templateMonthlyDaysChips");
const templateResumo = document.getElementById("templateResumo");
const templateResumoLinhas = document.getElementById("templateResumoLinhas");
const templateInicioField = document.getElementById("templateInicioField");
const templateInicio = document.getElementById("templateInicio");
const templateObs = document.getElementById("templateObs");
const templateAtivo = document.getElementById("templateAtivo");
const templateMensagem = document.getElementById("templateMensagem");
const templatePresets = document.getElementById("templatePresets");
const btnCancelarModelo = document.getElementById("btnCancelarModelo");
const listaModelos = document.getElementById("listaModelos");
const modelosVazio = document.getElementById("modelosVazio");
const templateSearch = document.getElementById("templateSearch");
const templateFilterSubestacao = document.getElementById("templateFilterSubestacao");
const templateSort = document.getElementById("templateSort");
const listaSolicitacoes = document.getElementById("listaSolicitacoes");
const solicitacoesVazio = document.getElementById("solicitacoesVazio");
const listaUsuarios = document.getElementById("listaUsuarios");
const usuariosVazio = document.getElementById("usuariosVazio");
const inviteRole = document.getElementById("inviteRole");
const userFiltroNome = document.getElementById("userFiltroNome");
const userFiltroCargo = document.getElementById("userFiltroCargo");
const userFiltroProjeto = document.getElementById("userFiltroProjeto");
const userFiltroStatus = document.getElementById("userFiltroStatus");
const btnLimparFiltroUsuarios = document.getElementById("btnLimparFiltroUsuarios");
const userDrawer = document.getElementById("userDrawer");
const userDrawerForm = document.getElementById("userDrawerForm");
const drawerUserId = document.getElementById("drawerUserId");
const drawerNome = document.getElementById("drawerNome");
const drawerCargo = document.getElementById("drawerCargo");
const drawerRole = document.getElementById("drawerRole");
const drawerProjeto = document.getElementById("drawerProjeto");
const drawerActive = document.getElementById("drawerActive");
const drawerPermissions = document.getElementById("drawerPermissions");
const drawerMessage = document.getElementById("drawerMessage");
const drawerSubtitle = document.getElementById("drawerSubtitle");
const btnFecharUserDrawer = document.getElementById("btnFecharUserDrawer");
const btnCancelarUserDrawer = document.getElementById("btnCancelarUserDrawer");
const btnSalvarUserDrawer = document.getElementById("btnSalvarUserDrawer");
const btnGerarConvite = document.getElementById("btnGerarConvite");
const inviteResultado = document.getElementById("inviteResultado");
const modalInicioExecucao = document.getElementById("modalInicioExecucao");
const inicioExecucaoId = document.getElementById("inicioExecucaoId");
const btnConfirmarInicioExecucao = document.getElementById("btnConfirmarInicioExecucao");
const btnCancelarInicioExecucao = document.getElementById("btnCancelarInicioExecucao");
const btnFecharInicioExecucao = document.getElementById("btnFecharInicioExecucao");
const mensagemInicioExecucao = document.getElementById("mensagemInicioExecucao");
const modalCancelarInicio = document.getElementById("modalCancelarInicio");
const formCancelarInicio = document.getElementById("formCancelarInicio");
const cancelarInicioId = document.getElementById("cancelarInicioId");
const cancelarInicioMotivo = document.getElementById("cancelarInicioMotivo");
const cancelarInicioObs = document.getElementById("cancelarInicioObs");
const btnFecharCancelarInicio = document.getElementById("btnFecharCancelarInicio");
const btnCancelarCancelarInicio = document.getElementById("btnCancelarCancelarInicio");
const mensagemCancelarInicio = document.getElementById("mensagemCancelarInicio");
const modalRegistroExecucao = document.getElementById("modalRegistroExecucao");
const formRegistroExecucao = document.getElementById("formRegistroExecucao");
const registroId = document.getElementById("registroId");
const registroTipo = document.getElementById("registroTipo");
const registroSubestacao = document.getElementById("registroSubestacao");
const registroCodigo = document.getElementById("registroCodigo");
const registroAbertaPor = document.getElementById("registroAbertaPor");
const registroAbertaEm = document.getElementById("registroAbertaEm");
const registroExecutadaPor = document.getElementById("registroExecutadaPor");
const registroInicio = document.getElementById("registroInicio");
const registroOsNumero = document.getElementById("registroOsNumero");
const registroParticipantes = document.getElementById("registroParticipantes");
const registroDocs = document.getElementById("registroDocs");
const registroResultado = document.getElementById("registroResultado");
const registroComentario = document.getElementById("registroComentario");
const registroObsExecucao = document.getElementById("registroObsExecucao");
const btnFecharRegistroExecucao = document.getElementById("btnFecharRegistroExecucao");
const btnCancelarRegistroExecucao = document.getElementById("btnCancelarRegistroExecucao");
const btnCancelarExecucao = document.getElementById("btnCancelarExecucao");
const formCancelarExecucao = document.getElementById("formCancelarExecucao");
const cancelarExecucaoMotivo = document.getElementById("cancelarExecucaoMotivo");
const btnVoltarCancelarExecucao = document.getElementById("btnVoltarCancelarExecucao");
const mensagemCancelarExecucao = document.getElementById("mensagemCancelarExecucao");
const mensagemRegistroExecucao = document.getElementById("mensagemRegistroExecucao");
const modalConclusao = document.getElementById("modalConclusao");
const modalReagendar = document.getElementById("modalReagendar");
const formReagendar = document.getElementById("formReagendar");
const reagendarId = document.getElementById("reagendarId");
const reagendarData = document.getElementById("reagendarData");
const reagendarMotivo = document.getElementById("reagendarMotivo");
const reagendarObs = document.getElementById("reagendarObs");
const mensagemReagendar = document.getElementById("mensagemReagendar");
const btnFecharReagendar = document.getElementById("btnFecharReagendar");
const btnCancelarReagendar = document.getElementById("btnCancelarReagendar");
const modalLiberacao = document.getElementById("modalLiberacao");
const formLiberacao = document.getElementById("formLiberacao");
const liberacaoId = document.getElementById("liberacaoId");
const liberacaoOs = document.getElementById("liberacaoOs");
const liberacaoCritico = document.getElementById("liberacaoCritico");
const liberacaoParticipantes = document.getElementById("liberacaoParticipantes");
const liberacaoParticipantesErro = document.getElementById("liberacaoParticipantesErro");
const liberacaoChecklist = document.getElementById("liberacaoChecklist");
const mensagemLiberacao = document.getElementById("mensagemLiberacao");
const liberacaoDocPt = document.getElementById("liberacaoDocPt");
const liberacaoDocInputs = Array.from(document.querySelectorAll("[data-doc-input]"));
const liberacaoDocButtons = Array.from(document.querySelectorAll("[data-doc-btn]"));
const liberacaoDocViews = Array.from(document.querySelectorAll("[data-doc-view]"));
const liberacaoDocNames = Array.from(document.querySelectorAll("[data-doc-name]"));
const btnFecharLiberacao = document.getElementById("btnFecharLiberacao");
const btnCancelarLiberacao = document.getElementById("btnCancelarLiberacao");
const modalOverride = document.getElementById("modalOverride");
const formOverride = document.getElementById("formOverride");
const overrideInfo = document.getElementById("overrideInfo");
const overrideMotivo = document.getElementById("overrideMotivo");
const overrideMensagem = document.getElementById("overrideMensagem");
const btnFecharOverride = document.getElementById("btnFecharOverride");
const btnCancelarOverride = document.getElementById("btnCancelarOverride");
const modalHistorico = document.getElementById("modalHistorico");
const listaHistorico = document.getElementById("listaHistorico");
const historicoVazio = document.getElementById("historicoVazio");
const historicoResumo = document.getElementById("historicoResumo");
const btnFecharHistorico = document.getElementById("btnFecharHistorico");
const btnHistoricoMais = document.getElementById("btnHistoricoMais");
const btnHistoricoExportar = document.getElementById("btnHistoricoExportar");
const btnHistoricoExportarPdf = document.getElementById("btnHistoricoExportarPdf");
const modalPreview = document.getElementById("modalPreview");
const previewFrame = document.getElementById("previewFrame");
const btnFecharPreview = document.getElementById("btnFecharPreview");
const formConclusao = document.getElementById("formConclusao");
const mensagemConclusao = document.getElementById("mensagemConclusao");
const conclusaoId = document.getElementById("conclusaoId");
const conclusaoTipo = document.getElementById("conclusaoTipo");
const conclusaoSubestacao = document.getElementById("conclusaoSubestacao");
const conclusaoCodigo = document.getElementById("conclusaoCodigo");
const conclusaoAbertaPor = document.getElementById("conclusaoAbertaPor");
const conclusaoAbertaEm = document.getElementById("conclusaoAbertaEm");
const conclusaoExecutadaPor = document.getElementById("conclusaoExecutadaPor");
const conclusaoEncerradaPor = document.getElementById("conclusaoEncerradaPor");
const conclusaoInicio = document.getElementById("conclusaoInicio");
const conclusaoFim = document.getElementById("conclusaoFim");
const conclusaoDuracao = document.getElementById("conclusaoDuracao");
const conclusaoResultado = document.getElementById("conclusaoResultado");
const conclusaoComentario = document.getElementById("conclusaoComentario");
const conclusaoObsExecucao = document.getElementById("conclusaoObsExecucao");
const conclusaoParticipantes = document.getElementById("conclusaoParticipantes");
const conclusaoDocs = document.getElementById("conclusaoDocs");
const conclusaoReferencia = document.getElementById("conclusaoReferencia");
const conclusaoEvidenciasLista = document.getElementById("conclusaoEvidenciasLista");
const evidenciaInputs = Array.from(document.querySelectorAll("[data-evidencia-input]"));
const evidenciaButtons = Array.from(document.querySelectorAll("[data-evidencia-btn]"));
const fotoSlots = Array.from(document.querySelectorAll("[data-photo-slot]"));
const btnFecharConclusao = document.getElementById("btnFecharConclusao");
const btnCancelarConclusao = document.getElementById("btnCancelarConclusao");
const modalRelatorio = document.getElementById("modalRelatorio");
const relatorioLogo = document.getElementById("relatorioLogo");
const relatorioTipo = document.getElementById("relatorioTipo");
const relatorioSubestacao = document.getElementById("relatorioSubestacao");
const relatorioCodigo = document.getElementById("relatorioCodigo");
const relatorioAbertaEm = document.getElementById("relatorioAbertaEm");
const relatorioInicio = document.getElementById("relatorioInicio");
const relatorioFim = document.getElementById("relatorioFim");
const relatorioDuracao = document.getElementById("relatorioDuracao");
const relatorioAbertaPor = document.getElementById("relatorioAbertaPor");
const relatorioExecutadaPor = document.getElementById("relatorioExecutadaPor");
const relatorioEncerradaPor = document.getElementById("relatorioEncerradaPor");
const relatorioResultado = document.getElementById("relatorioResultado");
const relatorioReferencia = document.getElementById("relatorioReferencia");
const relatorioEmitidoEm = document.getElementById("relatorioEmitidoEm");
const relatorioDescricao = document.getElementById("relatorioDescricao");
const relatorioObsExecucao = document.getElementById("relatorioObsExecucao");
const relatorioEvidencias = document.getElementById("relatorioEvidencias");
const btnImprimirRelatorio = document.getElementById("btnImprimirRelatorio");
const btnExportarPDF = document.getElementById("btnExportarPDF");
const btnFecharRelatorio = document.getElementById("btnFecharRelatorio");
const tabButtons = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll("[data-panel]");
const adminElements = document.querySelectorAll("[data-admin-only]");

const DEFAULT_REMINDER_DAYS = 7;
const LOADING_DELAY_MS = 450;
const HISTORY_PAGE_SIZE = 12;
const REMINDER_KEY = "denemanu.reminderDays";
const SIDEBAR_KEY = "opscope.sidebarCollapsed";
const SIDEBAR_STATE_KEY = "sb_state";
const NOTIFICATION_READ_KEY = "opscope.notifications.read";
const STORAGE_KEY = "denemanu.manutencoes";
const TEMPLATE_KEY = "denemanu.templates";
const USER_KEY = "denemanu.users";
const REQUEST_KEY = "denemanu.requests";
const AUDIT_KEY = "denemanu.audit";
const RDO_KEY = "denemanu.rdo";
const SESSION_KEY = "denemanu.session";
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_REAGENDAMENTOS = 3;
const OUTROS_ALERT_THRESHOLD = 3;
const MIN_EVIDENCIAS = 4;
const MAX_EXECUCAO_HORAS = 12;
const DOC_KEYS = ["apr", "os", "pte", "pt"];
const DOC_LABELS = {
  apr: "APR",
  os: "OS",
  pte: "PTE",
  pt: "PT",
};
const RDO_CLIENTE = "SOLARIG";
const RDO_SETOR = "O&M - ENGELMIG";
const RDO_PROJETO = "LZC-BOS-SUB1";
const SYSTEM_USER_ID = "system";
const CUSTOM_TIPO_OPTION = "__custom";
const SUBESTACOES = ["SE Boa Sorte II"];
const WEEKDAYS = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];
const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const DEFAULT_DAILY_DAYS = [1, 2, 3, 4, 5];
const SECTION_LABELS = {
  inicio: "Inicio",
  programacao: "Programacao",
  nova: "Nova manutencao",
  modelos: "Modelos e recorrencias",
  execucao: "Execucao do dia",
  backlog: "Backlog",
  desempenho: "Desempenho",
  tendencias: "KPIs e tendencias",
  relatorios: "Relatorios",
  perfil: "Meu perfil",
};
const ADMIN_SECTIONS = ["solicitacoes", "rastreabilidade", "gerencial", "contas"];
const DEFAULT_SECTIONS = Object.keys(SECTION_LABELS).reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {});
const DASHBOARD_CLIENT_TTL_MS = 30 * 1000;

const STATUS_LABELS = {
  agendada: "Agendada",
  liberada: "Liberada",
  backlog: "Backlog",
  em_execucao: "Em execucao",
  encerramento: "Encerramento",
  concluida: "Concluida",
};

const PERMISSIONS = {
  create: "Criar",
  edit: "Editar",
  remove: "Remover",
  reschedule: "Reagendar",
  complete: "Executar",
};

const ADMIN_USERS_READ = "admin:users:read";
const ADMIN_USERS_WRITE = "admin:users:write";

const RBAC_ROLE_LABELS = {
  pcm: "PCM",
  diretor_om: "DIRETOR O&M",
  gerente_contrato: "GERENTE DE CONTRATO",
  supervisor_om: "SUPERVISOR O&M",
  tecnico_senior: "T\u00c9CNICO S\u00caNIOR",
  tecnico_pleno: "T\u00c9CNICO PLENO",
  tecnico_junior: "T\u00c9CNICO J\u00daNIOR",
  leitura: "LEITURA",
};

const LEGACY_ROLE_LABELS = {
  admin: "ADMIN",
  supervisor: "SUPERVISOR",
  executor: "EXECUTOR",
  leitura: "LEITURA",
};

const FULL_ACCESS_RBAC = new Set(["pcm", "diretor_om", "gerente_contrato"]);
const RELEASE_OVERRIDE_RBAC = new Set(["pcm", "diretor_om", "gerente_contrato", "supervisor_om"]);
const LOCK_ICON_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 10V7a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2 0h6V7a3 3 0 0 0-6 0v3Z" fill="currentColor"/></svg>';

function getRoleLabel(user) {
  if (!user) {
    return "EXECUTOR";
  }
  const rbacRole = String(user.rbacRole || "").trim().toLowerCase();
  if (rbacRole && RBAC_ROLE_LABELS[rbacRole]) {
    return RBAC_ROLE_LABELS[rbacRole];
  }
  const legacyRole = String(user.role || "").trim().toLowerCase();
  if (legacyRole && LEGACY_ROLE_LABELS[legacyRole]) {
    return LEGACY_ROLE_LABELS[legacyRole];
  }
  return (user.role || user.rbacRole || "EXECUTOR").toString().toUpperCase();
}

function normalizeSearchValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isFullAccessUser(user) {
  if (!user) {
    return false;
  }
  const rbacRole = String(user.rbacRole || "").trim().toLowerCase();
  return user.role === "admin" || FULL_ACCESS_RBAC.has(rbacRole);
}

function canOverrideRelease(user) {
  if (!user) {
    return false;
  }
  if (user.role === "admin" || user.role === "supervisor") {
    return true;
  }
  const rbacRole = String(user.rbacRole || "").trim().toLowerCase();
  return RELEASE_OVERRIDE_RBAC.has(rbacRole);
}

function canAdminUsersRead() {
  if (!currentUser) {
    return false;
  }
  if (isFullAccessUser(currentUser)) {
    return true;
  }
  return Boolean(currentUser.permissions && currentUser.permissions[ADMIN_USERS_READ]);
}

function canAdminUsersWrite() {
  if (!currentUser) {
    return false;
  }
  if (isFullAccessUser(currentUser)) {
    return true;
  }
  return Boolean(currentUser.permissions && currentUser.permissions[ADMIN_USERS_WRITE]);
}

const ACTION_LABELS = {
  create: "Criar",
  edit: "Editar",
  remove: "Remover",
  reschedule: "Reagendar",
  release: "Liberacao registrada",
  execute: "Execucao iniciada",
  cancel_start: "Inicio cancelado",
  execute_register: "Registro de execucao",
  complete: "Concluir",
  note: "Observacao",
  backlog_auto: "Backlog automatico",
  rdo_delete: "RDO excluido",
};

const RESULTADO_LABELS = {
  concluida: "Concluida",
  ressalva: "Concluida com ressalva",
  nao_executada: "Nao executada",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR");
const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});
const weekLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

let manutencoes = [];
let templates = [];
let users = [];
let requests = [];
let auditLog = [];
let currentUser = null;
let adminPermissionCatalog = [];
let reminderDays = DEFAULT_REMINDER_DAYS;
let loadingTimeout = null;
let historicoAtualId = null;
let historicoLimite = HISTORY_PAGE_SIZE;
let manutencaoEmLiberacao = null;
let pendingLiberacaoOverride = null;
let manutencaoEmCancelamento = null;
let liberacaoDocsBase = {};
let liberacaoDocsPreview = {};
let previewBlobUrl = "";
let auditHashChain = Promise.resolve("");
let kpiDrilldown = null;
let kpiSnapshot = null;
let rdoSnapshots = [];
let rdoPreviewSnapshot = null;
let rdoSelection = new Set();
let dashboardSummary = null;
let dashboardError = "";
let dashboardLastFetch = 0;
let dashboardRequest = null;
let maintenanceSyncTimer = null;
let maintenanceSyncPromise = null;
let maintenanceLastSync = 0;
let maintenanceLastUserId = null;
let rdoUI = {
  card: null,
  list: null,
  empty: null,
  showDeleted: null,
  btnExcluir: null,
  modal: null,
  data: null,
  subestacao: null,
  categoria: null,
  prioridade: null,
  usuario: null,
  registro: null,
  limite: null,
  condutor: null,
  kmInicial: null,
  kmFinal: null,
  clima: null,
  climaOutroField: null,
  climaOutro: null,
  incidente: null,
  bloqueio: null,
  qtPessoas: null,
  local: null,
  numeroSi: null,
  numeroSgi: null,
  preview: null,
  previewBody: null,
  mensagem: null,
  btnGerar: null,
  btnPreview: null,
  btnExportar: null,
  btnFechar: null,
  btnVoltar: null,
  deleteModal: null,
  deleteReason: null,
  deleteMensagem: null,
  btnDeleteConfirm: null,
  btnDeleteCancel: null,
};
let kpiRankingSort = { key: "concluidas", dir: "desc" };

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Falha ao salvar ${key} no storage.`, error);
    return false;
  }
}

const API_BASE = "";
const AVATAR_MAX_BYTES = 10 * 1024 * 1024;
const AVATAR_ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
let pendingAvatarDataUrl = "";
let lastFocusMaintenanceId = "";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data && data.message ? data.message : "Falha na autenticacao.";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function getDisplayName(user) {
  const raw = user && user.name ? String(user.name).trim() : "";
  if (!raw) {
    return user && user.username ? user.username : "-";
  }
  return raw.replace(/\s*\([^)]*\)\s*$/, "").trim() || raw;
}

function applyAvatarToElement(element, url) {
  if (!element) {
    return;
  }
  if (url) {
    element.style.backgroundImage = `url("${url}")`;
    element.classList.add("has-photo");
    return;
  }
  element.style.backgroundImage = "";
  element.classList.remove("has-photo");
}

function getAvatarUrl(user) {
  if (!user || !user.avatarUrl) {
    return "";
  }
  if (user.avatarUpdatedAt) {
    const stamp = new Date(user.avatarUpdatedAt).getTime();
    return `${user.avatarUrl}?v=${Number.isFinite(stamp) ? stamp : Date.now()}`;
  }
  return user.avatarUrl;
}

function setAvatarError(message) {
  if (!perfilAvatarErro) {
    return;
  }
  perfilAvatarErro.textContent = message || "";
  perfilAvatarErro.hidden = !message;
}

function getReadNotificationIds() {
  const stored = readJson(NOTIFICATION_READ_KEY, []);
  return new Set(stored.map((id) => String(id)));
}

function saveReadNotificationIds(readSet) {
  writeJson(NOTIFICATION_READ_KEY, Array.from(readSet));
}

function markNotificationRead(id) {
  if (!id) {
    return;
  }
  const readSet = getReadNotificationIds();
  const key = String(id);
  if (!readSet.has(key)) {
    readSet.add(key);
    saveReadNotificationIds(readSet);
  }
}

function setFocusParam(id) {
  const url = new URL(window.location.href);
  url.searchParams.set("focus", id);
  window.history.replaceState(null, "", url.toString());
}

function focusMaintenanceById(id, attempt = 0) {
  if (!id) {
    return;
  }
  const rawId = String(id);
  const safeId =
    window.CSS && CSS.escape ? CSS.escape(rawId) : rawId.replace(/["\\]/g, "\\$&");
  const selector = `[data-maintenance-id="${safeId}"]`;
  const target =
    document.querySelector(selector) || document.getElementById(`maintenance-${rawId}`);
  if (!target) {
    if (attempt < 8) {
      window.setTimeout(() => focusMaintenanceById(id, attempt + 1), 180);
    }
    return;
  }
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: prefersReduced ? "auto" : "smooth",
    block: "center",
  });
  target.classList.remove("focus-pulse");
  void target.offsetWidth;
  target.classList.add("focus-pulse");
  const cleanup = () => {
    target.classList.remove("focus-pulse");
    target.removeEventListener("animationend", cleanup);
  };
  if (prefersReduced) {
    window.setTimeout(cleanup, 2000);
    return;
  }
  target.addEventListener("animationend", cleanup);
  window.setTimeout(cleanup, 4000);
}

function openMaintenanceFromNotification(id) {
  if (!id) {
    return;
  }
  lastFocusMaintenanceId = String(id);
  setFocusParam(id);
  abrirPainelComCarregamento("programacao");
  window.setTimeout(() => focusMaintenanceById(id), 200);
}

function handleFocusFromUrl() {
  if (!currentUser) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const focusId = params.get("focus");
  if (!focusId || focusId === lastFocusMaintenanceId) {
    return;
  }
  lastFocusMaintenanceId = focusId;
  abrirPainelComCarregamento("programacao");
  window.setTimeout(() => focusMaintenanceById(focusId), 200);
}

function togglePassword(button) {
  if (!button) {
    return;
  }
  const wrapper = button.closest(".input-wrap");
  const input = wrapper ? wrapper.querySelector("input") : null;
  if (!input) {
    return;
  }
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  button.setAttribute("aria-pressed", isPassword ? "true" : "false");
  button.setAttribute("aria-label", isPassword ? "Ocultar senha" : "Mostrar senha");
}

function bindCapsLockIndicator(input, hint) {
  if (!input || !hint) {
    return;
  }
  input.addEventListener("keyup", (event) => {
    const ativo = event.getModifierState && event.getModifierState("CapsLock");
    hint.hidden = !ativo;
  });
  input.addEventListener("blur", () => {
    hint.hidden = true;
  });
}

function checkPasswordPolicy(value) {
  const senha = String(value || "");
  return {
    length: senha.length >= 12,
    upper: /[A-Z]/.test(senha),
    lower: /[a-z]/.test(senha),
    number: /[0-9]/.test(senha),
    symbol: /[^A-Za-z0-9]/.test(senha),
  };
}

function atualizarSenhaRules() {
  if (!reqSenhaRules || !reqSenha) {
    return true;
  }
  const rules = checkPasswordPolicy(reqSenha.value);
  let ok = true;
  reqSenhaRules.querySelectorAll("[data-rule]").forEach((item) => {
    const key = item.dataset.rule;
    const valido = Boolean(rules[key]);
    item.classList.toggle("is-valid", valido);
    if (!valido) {
      ok = false;
    }
  });
  return ok;
}

function mostrarMensagemManutencao(texto, erro = false) {
  if (!mensagemManutencao) {
    return;
  }
  mensagemManutencao.textContent = texto;
  mensagemManutencao.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemConta(texto, erro = false) {
  if (!mensagemConta) {
    return;
  }
  mensagemConta.textContent = texto;
  mensagemConta.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemGerencial(texto, erro = false) {
  if (!mensagemGerencial) {
    return;
  }
  mensagemGerencial.textContent = texto;
  mensagemGerencial.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemTemplate(texto, erro = false) {
  if (!templateMensagem) {
    return;
  }
  templateMensagem.textContent = texto;
  templateMensagem.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemConclusao(texto, erro = false) {
  if (!mensagemConclusao) {
    return;
  }
  mensagemConclusao.textContent = texto;
  mensagemConclusao.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemReagendar(texto, erro = false) {
  if (!mensagemReagendar) {
    return;
  }
  mensagemReagendar.textContent = texto;
  mensagemReagendar.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemInicioExecucao(texto, erro = false) {
  if (!mensagemInicioExecucao) {
    return;
  }
  mensagemInicioExecucao.textContent = texto;
  mensagemInicioExecucao.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemRegistroExecucao(texto, erro = false) {
  if (!mensagemRegistroExecucao) {
    return;
  }
  mensagemRegistroExecucao.textContent = texto;
  mensagemRegistroExecucao.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemCancelarExecucao(texto, erro = false) {
  if (!mensagemCancelarExecucao) {
    return;
  }
  mensagemCancelarExecucao.textContent = texto;
  mensagemCancelarExecucao.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemLiberacao(texto, erro = false) {
  if (!mensagemLiberacao) {
    return;
  }
  mensagemLiberacao.textContent = texto;
  mensagemLiberacao.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemOverride(texto, erro = false) {
  if (!overrideMensagem) {
    return;
  }
  overrideMensagem.textContent = texto;
  overrideMensagem.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemCancelarInicio(texto, erro = false) {
  if (!mensagemCancelarInicio) {
    return;
  }
  mensagemCancelarInicio.textContent = texto;
  mensagemCancelarInicio.classList.toggle("mensagem--erro", erro);
}

function setFieldError(element, mensagem) {
  if (!element) {
    return;
  }
  if (mensagem) {
    element.textContent = mensagem;
    element.hidden = false;
    return;
  }
  element.textContent = "";
  element.hidden = true;
}

function clearTemplateErrors() {
  setFieldError(templateNomeErro, "");
  setFieldError(templateInicioErro, "");
  setFieldError(templateDailyErro, "");
  setFieldError(templateWeeklyIntervalErro, "");
  setFieldError(templateMonthlyDayErro, "");
  setFieldError(templateMonthlyDaysErro, "");
}

function clearTemplateFieldError(target) {
  if (!target) {
    return;
  }
  if (target === templateNome) {
    setFieldError(templateNomeErro, "");
  } else if (target === templateInicio) {
    setFieldError(templateInicioErro, "");
  } else if (target === templateWeeklyInterval) {
    setFieldError(templateWeeklyIntervalErro, "");
  } else if (target === templateMonthlyDay) {
    setFieldError(templateMonthlyDayErro, "");
  } else if (target === templateMonthlyDaysInput) {
    setFieldError(templateMonthlyDaysErro, "");
  } else if (target.matches && target.matches("[data-template-daily-day]")) {
    setFieldError(templateDailyErro, "");
  }
}

function mostrarAuthPanel(nome) {
  if (!authPanels || currentUser) {
    return;
  }
  authPanels.hidden = false;
  if (authPanels.classList.contains("auth-panels--dual")) {
    authPanelLogin.hidden = false;
    authPanelRegistro.hidden = false;
    return;
  }
  authPanelLogin.hidden = nome !== "login";
  authPanelRegistro.hidden = nome !== "registro";
  btnTabLogin.classList.toggle("is-active", nome === "login");
  btnTabRegistro.classList.toggle("is-active", nome === "registro");
}

function esconderAuthPanels() {
  if (!authPanels) {
    return;
  }
  authPanels.hidden = true;
  authPanelLogin.hidden = true;
  authPanelRegistro.hidden = true;
  btnTabLogin.classList.remove("is-active");
  btnTabRegistro.classList.remove("is-active");
}



function fecharPainelLembretes() {
  if (!painelLembretes || !btnLembretes) {
    return;
  }
  painelLembretes.hidden = true;
  btnLembretes.setAttribute("aria-expanded", "false");
}

function alternarPainelLembretes() {
  if (!painelLembretes || !btnLembretes) {
    return;
  }
  const abrir = painelLembretes.hidden;
  if (abrir) {
    painelLembretes.hidden = false;
    btnLembretes.setAttribute("aria-expanded", "true");
    return;
  }
  fecharPainelLembretes();
}

function mostrarCarregando() {
  if (!loadingOverlay) {
    return;
  }
  loadingOverlay.hidden = false;
  document.body.classList.add("is-loading");
}

function esconderCarregando() {
  if (!loadingOverlay) {
    return;
  }
  loadingOverlay.hidden = true;
  document.body.classList.remove("is-loading");
  if (loadingTimeout) {
    window.clearTimeout(loadingTimeout);
    loadingTimeout = null;
  }
}

function abrirPainelComCarregamento(tab, scrollTarget = null) {
  if (!tab) {
    return;
  }
  fecharPainelLembretes();

  const abrir = () => {
    ativarTab(tab);
    if (scrollTarget) {
      const alvo = document.getElementById(scrollTarget);
      if (alvo) {
        alvo.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  if (!loadingOverlay) {
    abrir();
    return;
  }

  if (loadingTimeout) {
    window.clearTimeout(loadingTimeout);
  }

  mostrarCarregando();
  loadingTimeout = window.setTimeout(() => {
    abrir();
    esconderCarregando();
    loadingTimeout = null;
  }, LOADING_DELAY_MS);
}

function readSidebarState() {
  const state = localStorage.getItem(SIDEBAR_STATE_KEY);
  if (state === "collapsed") {
    return true;
  }
  if (state === "expanded") {
    return false;
  }
  const stored = localStorage.getItem(SIDEBAR_KEY);
  if (stored === "1") {
    return true;
  }
  if (stored === "0") {
    return false;
  }
  return null;
}

function setSidebarState(collapsed) {
  localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
  localStorage.setItem(SIDEBAR_STATE_KEY, collapsed ? "collapsed" : "expanded");
}

function hasSidebarToggle() {
  return Boolean(btnToggleSidebar && btnToggleSidebar.length);
}

function applyCollapsedState(collapsed) {
  if (!appShell) {
    return;
  }
  let resolved = collapsed;
  if (typeof resolved !== "boolean") {
    const stored = readSidebarState();
    resolved = stored === null ? false : stored;
  } else {
    setSidebarState(resolved);
  }
  if (!hasSidebarToggle()) {
    resolved = false;
    setSidebarState(false);
  }
  appShell.classList.toggle("is-collapsed", resolved);
  if (sidebar) {
    sidebar.dataset.state = resolved ? "collapsed" : "expanded";
  }
}

function initSidebarAccordions() {
  const groups = document.querySelectorAll(".nav-group");
  groups.forEach((group) => {
    const header = group.querySelector(".nav-group__header");
    if (!header) {
      return;
    }
    const groupName = group.dataset.group;
    const storageKey = groupName ? `sb_group_${groupName}` : "";
    const stored = storageKey ? localStorage.getItem(storageKey) : null;
    const collapsed = stored === "collapsed";
    group.dataset.collapsed = collapsed ? "true" : "false";
    header.setAttribute("aria-expanded", collapsed ? "false" : "true");
    header.addEventListener("click", () => {
      const isCollapsed = group.dataset.collapsed !== "true";
      group.dataset.collapsed = isCollapsed ? "true" : "false";
      header.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
      if (storageKey) {
        localStorage.setItem(storageKey, isCollapsed ? "collapsed" : "expanded");
      }
    });
  });
}

function isMobileView() {
  return window.matchMedia("(max-width: 1023px)").matches;
}

function openSidebarDrawer() {
  if (!appShell) {
    return;
  }
  appShell.classList.add("is-drawer-open");
  if (sidebarBackdrop) {
    sidebarBackdrop.hidden = false;
  }
  if (sidebar) {
    sidebar.classList.add("is-open");
  }
  document.body.classList.add("sidebar-open");
}

function closeSidebarDrawer() {
  if (!appShell) {
    return;
  }
  appShell.classList.remove("is-drawer-open");
  if (sidebarBackdrop) {
    sidebarBackdrop.hidden = true;
  }
  if (sidebar) {
    sidebar.classList.remove("is-open");
  }
  document.body.classList.remove("sidebar-open");
}

function toggleSidebar() {
  if (!appShell) {
    return;
  }
  if (isMobileView()) {
    if (appShell.classList.contains("is-drawer-open")) {
      closeSidebarDrawer();
    } else {
      openSidebarDrawer();
    }
    return;
  }
  const novoEstado = !appShell.classList.contains("is-collapsed");
  applyCollapsedState(novoEstado);
}

function syncSidebarLayout() {
  if (!appShell) {
    return;
  }
  if (isMobileView()) {
    if (sidebar) {
      sidebar.removeAttribute("data-state");
    }
    appShell.classList.remove("is-collapsed");
    closeSidebarDrawer();
    return;
  }
  closeSidebarDrawer();
  applyCollapsedState();
}

function initSidebarToggle() {
  if (!appShell) {
    return;
  }
  syncSidebarLayout();
  if (btnToggleSidebar && btnToggleSidebar.length) {
    btnToggleSidebar.forEach((btn) => btn.addEventListener("click", toggleSidebar));
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", closeSidebarDrawer);
  }
  if (tabButtons && tabButtons.length) {
    tabButtons.forEach((botao) => {
      botao.addEventListener("click", () => {
        if (isMobileView()) {
          closeSidebarDrawer();
        }
      });
    });
  }
  let estavaMobile = isMobileView();
  window.addEventListener("resize", () => {
    const agoraMobile = isMobileView();
    if (agoraMobile !== estavaMobile) {
      syncSidebarLayout();
      estavaMobile = agoraMobile;
      return;
    }
    if (!agoraMobile) {
      closeSidebarDrawer();
    }
  });
  initSidebarAccordions();
}

function carregarConfiguracoes() {
  const valor = Number(readJson(REMINDER_KEY, DEFAULT_REMINDER_DAYS));
  reminderDays = Number.isFinite(valor) && valor > 0 ? valor : DEFAULT_REMINDER_DAYS;
  if (configDiasLembrete) {
    configDiasLembrete.value = reminderDays;
  }
}

function salvarConfiguracoes() {
  if (!isAdmin()) {
    mostrarMensagemGerencial("Apenas administradores podem alterar configuracoes.", true);
    return;
  }
  const valor = Number(configDiasLembrete.value);
  if (!Number.isFinite(valor) || valor < 1 || valor > 60) {
    mostrarMensagemGerencial("Informe um numero entre 1 e 60.", true);
    return;
  }
  reminderDays = Math.round(valor);
  writeJson(REMINDER_KEY, reminderDays);
  gerarManutencoesRecorrentes();
  renderTudo();
  mostrarMensagemGerencial("Configuracao atualizada.");
}

function startOfDay(date) {
  const copia = new Date(date);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

function parseDate(value) {
  if (!value) {
    return null;
  }
  const partes = value.split("-");
  if (partes.length !== 3) {
    return null;
  }
  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);
  if (!ano || !mes || !dia) {
    return null;
  }
  const data = new Date(ano, mes - 1, dia);
  if (Number.isNaN(data.getTime())) {
    return null;
  }
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return null;
  }
  return data;
}

function diffInDays(from, to) {
  return Math.round((to - from) / DAY_MS);
}

function formatDate(date) {
  return dateFormatter.format(date);
}

function formatDateTime(date) {
  return dateTimeFormatter.format(date);
}

function toIsoUtc(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "number") {
    return new Date(value).toISOString();
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return "";
}

function parseTimestamp(value) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function getTimeValue(value) {
  const parsed = parseTimestamp(value);
  return parsed ? parsed.getTime() : null;
}

function stableStringify(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  if (typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${key}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return String(value);
}

async function hashSha256(text) {
  if (typeof crypto !== "undefined" && crypto.subtle && typeof TextEncoder !== "undefined") {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function buildAuditPayload(entry, prevHash) {
  const payload = {
    timestamp: entry.timestamp,
    userId: entry.userId,
    action: entry.action,
    manutencaoId: entry.manutencaoId,
    source: entry.source,
    detalhes: entry.detalhes || {},
    prevHash: prevHash || "",
  };
  return stableStringify(payload);
}

async function recomputeAuditChain() {
  let prevHash = "";
  for (let i = 0; i < auditLog.length; i += 1) {
    const entry = auditLog[i];
    const timestampIso = normalizeIso(entry.timestamp);
    if (timestampIso && timestampIso !== entry.timestamp) {
      entry.timestamp = timestampIso;
    }
    if (!entry.source) {
      entry.source = entry.userId === SYSTEM_USER_ID ? "Sistema" : "UI";
    }
    const payload = buildAuditPayload(entry, prevHash);
    const hash = await hashSha256(payload);
    entry.prevHash = prevHash;
    entry.hash = hash;
    prevHash = hash;
  }
  salvarAuditoria(auditLog);
  return prevHash;
}

function iniciarAuditChain() {
  if (!auditLog.length) {
    auditHashChain = Promise.resolve("");
    return;
  }
  const precisa = auditLog.some(
    (entry) =>
      !entry.hash ||
      entry.prevHash === undefined ||
      !entry.source ||
      typeof entry.timestamp === "number"
  );
  if (precisa) {
    auditHashChain = recomputeAuditChain();
    return;
  }
  const last = auditLog[auditLog.length - 1];
  auditHashChain = Promise.resolve(last.hash || "");
}

function formatUpcoming(diff) {
  if (diff === null) {
    return "";
  }
  if (diff === 0) {
    return "Vence hoje";
  }
  if (diff === 1) {
    return "Vence amanha";
  }
  if (diff > 1) {
    return `Vence em ${diff} dias`;
  }
  return "data passou";
}

function formatReminder(diff) {
  if (diff === 0) {
    return "hoje";
  }
  if (diff === 1) {
    return "amanha";
  }
  return `em ${diff} dias`;
}

function formatOverdue(diff) {
  if (diff === null) {
    return "";
  }
  const dias = Math.abs(diff);
  if (dias === 0) {
    return "Atrasada desde hoje";
  }
  if (dias === 1) {
    return "Atrasada ha 1 dia";
  }
  return `atrasada ha ${dias} dias`;
}

function renderSubestacoes() {
  const selects = [subestacaoManutencao, templateSubestacao].filter(Boolean);
  selects.forEach((select) => {
    const atual = select.value;
    select.innerHTML = "";
    SUBESTACOES.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      select.append(option);
    });
    if (atual && SUBESTACOES.includes(atual)) {
      select.value = atual;
    }
  });
}

function renderTipoOptions() {
  if (!tipoManutencao) {
    return;
  }
  const atual = tipoManutencao.value;
  tipoManutencao.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Selecione um tipo";
  tipoManutencao.append(placeholder);

  const ordenados = [...templates]
    .filter((item) => item && item.nome && item.ativo !== false)
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  ordenados.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.nome;
    tipoManutencao.append(option);
  });

  const custom = document.createElement("option");
  custom.value = CUSTOM_TIPO_OPTION;
  custom.textContent = "Personalizada";
  tipoManutencao.append(custom);

  const valores = new Set(ordenados.map((item) => item.id));
  if (valores.has(atual)) {
    tipoManutencao.value = atual;
  } else if (atual === CUSTOM_TIPO_OPTION) {
    tipoManutencao.value = CUSTOM_TIPO_OPTION;
  } else if (ordenados.length === 0) {
    tipoManutencao.value = CUSTOM_TIPO_OPTION;
  } else {
    tipoManutencao.value = "";
  }
  atualizarTipoSelecionado();
}

function atualizarTipoSelecionado() {
  if (!tipoManutencao) {
    return;
  }
  const valor = tipoManutencao.value;
  const custom = valor === CUSTOM_TIPO_OPTION;
  if (customTipoField) {
    customTipoField.hidden = !custom;
  }
  if (tituloManutencao) {
    tituloManutencao.required = custom;
    tituloManutencao.disabled = !custom;
    if (!custom) {
      tituloManutencao.value = "";
    }
  }

  if (valor && !custom) {
    const template = getTemplateById(valor);
    if (template && subestacaoManutencao) {
      subestacaoManutencao.value = template.subestacao || subestacaoManutencao.value;
    }
    if (template && obsManutencao && !obsManutencao.value && template.observacao) {
      obsManutencao.value = template.observacao;
    }
  }
}

function criarId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `manu-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

function carregarManutencoes() {
  const data = readJson(STORAGE_KEY, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarManutencoes(lista) {
  writeJson(STORAGE_KEY, lista);
  scheduleMaintenanceSync(lista);
}

function carregarUsuarios() {
  const data = readJson(USER_KEY, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarUsuarios(lista) {
  const sanitized = Array.isArray(lista)
    ? lista.map((user) => {
        const { password, passwordHash, ...rest } = user || {};
        return rest;
      })
    : [];
  writeJson(USER_KEY, sanitized);
}

function carregarSolicitacoes() {
  const data = readJson(REQUEST_KEY, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarSolicitacoes(lista) {
  writeJson(REQUEST_KEY, lista);
}

function carregarAuditoria() {
  const data = readJson(AUDIT_KEY, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarAuditoria(lista) {
  writeJson(AUDIT_KEY, lista);
}

function carregarTemplates() {
  const data = readJson(TEMPLATE_KEY, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarTemplates(lista) {
  writeJson(TEMPLATE_KEY, lista);
}

function carregarRdoSnapshots() {
  const data = readJson(RDO_KEY, []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarRdoSnapshots(lista) {
  writeJson(RDO_KEY, lista);
}

function garantirTemplatesPadrao() {
  if (templates.length > 0) {
    return;
  }
  const hoje = formatDateISO(new Date());
  const subestacao = SUBESTACOES[0] || "SE Boa Sorte II";
  const criarPadrao = (nome, config) => {
    const agoraIso = toIsoUtc(new Date());
    const modelo = {
      id: criarId(),
      nome,
      subestacao,
      frequencia: config.frequencia,
      inicio: hoje,
      observacao: "",
      ativo: true,
      createdAt: agoraIso,
      createdBy: SYSTEM_USER_ID,
      updatedAt: agoraIso,
      updatedBy: SYSTEM_USER_ID,
    };

    if (config.frequencia === "daily") {
      modelo.dailyDays = [...DEFAULT_DAILY_DAYS];
    }
    if (config.frequencia === "weekly") {
      modelo.weeklyDay = Number.isFinite(config.weeklyDay) ? config.weeklyDay : 1;
      modelo.weeklyInterval = Number.isFinite(config.weeklyInterval)
        ? config.weeklyInterval
        : 1;
    }
    if (config.frequencia === "monthly") {
      modelo.monthlyMode = "fixed";
      modelo.monthlyDay = Number.isFinite(config.monthlyDay) ? config.monthlyDay : 10;
      modelo.monthlyDays = [];
    }

    modelo.proximaData = calcularProximaData(modelo);
    return modelo;
  };

  templates = [
    criarPadrao("Inspecao diaria da subestacao", { frequencia: "daily" }),
    criarPadrao("Inspecao mensal da subestacao", { frequencia: "monthly", monthlyDay: 10 }),
    criarPadrao("Inspecao semanal do GMG BSO2", { frequencia: "weekly", weeklyDay: 3, weeklyInterval: 1 }),
    criarPadrao("Inspecao semanal dos GMG PCT4", { frequencia: "weekly", weeklyDay: 4, weeklyInterval: 1 }),
    criarPadrao("Inspecao mensal do GMG BSO2", { frequencia: "monthly", monthlyDay: 25 }),
    criarPadrao("Inspecao mensal dos GMG PCT4", { frequencia: "monthly", monthlyDay: 25 }),
  ];

  salvarTemplates(templates);
}

function formatDateISO(date) {
  if (!date) {
    return "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getSectionConfig(user) {
  if (!user) {
    return {};
  }
  if (user.role === "admin") {
    const config = { ...DEFAULT_SECTIONS };
    ADMIN_SECTIONS.forEach((key) => {
      config[key] = true;
    });
    return config;
  }
  const config = { ...DEFAULT_SECTIONS };
  if (user.sections) {
    Object.keys(DEFAULT_SECTIONS).forEach((key) => {
      if (key in user.sections) {
        config[key] = Boolean(user.sections[key]);
      }
    });
  }
  return config;
}

function getTemplateById(id) {
  return templates.find((item) => item.id === id);
}

function getDefaultPermissions() {
  return Object.keys(PERMISSIONS).reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
}

function garantirAdmin() {
  const existeAdmin = users.some(
    (user) => (user.username || "").toLowerCase() === "admin"
  );
  if (existeAdmin) {
    return;
  }
  const admin = {
    id: criarId(),
    username: "Admin",
    matricula: "ADMIN",
    name: "Administrador",
    role: "admin",
    password: "12345",
    permissions: getDefaultPermissions(),
    sections: { ...DEFAULT_SECTIONS },
    createdAt: toIsoUtc(new Date()),
  };
  users = [admin];
  salvarUsuarios(users);
}

function carregarSessao() {
  return null;
}

function salvarSessao() {
  return;
}

async function carregarSessaoServidor() {
  try {
    const data = await apiRequest("/api/auth/me");
    currentUser = data.user || null;
  } catch (error) {
    currentUser = null;
  }
  await carregarUsuariosServidor();
  renderAuthUI();
  renderTudo();
  handleFocusFromUrl();
  if (!currentUser) {
    mostrarAuthPanel("login");
  }
}

async function carregarUsuariosServidor() {
  if (!currentUser) {
    users = [];
    return;
  }
  try {
    const data = canAdminUsersRead() ? await apiAdminUsers() : await apiRequest("/api/auth/users");
    users = Array.isArray(data.users) ? data.users : [];
  } catch (error) {
    users = currentUser ? [currentUser] : [];
  }
  await carregarPermissoesAdmin();
  renderUsuarios();
}

async function carregarPermissoesAdmin() {
  if (!canAdminUsersRead()) {
    adminPermissionCatalog = [];
    return;
  }
  try {
    const data = await apiAdminPermissions();
    adminPermissionCatalog = Array.isArray(data.permissions) ? data.permissions : [];
  } catch (error) {
    adminPermissionCatalog = [];
  }
}

function getUserById(id) {
  if (currentUser && currentUser.id === id) {
    return currentUser;
  }
  return users.find((user) => user.id === id);
}

function getUserLabel(id) {
  if (!id) {
    return "Desconhecido";
  }
  if (id === SYSTEM_USER_ID) {
    return "Sistema";
  }
  const user = getUserById(id);
  if (!user) {
    return "Desconhecido";
  }
  return `${user.name} (${user.matricula})`;
}

function isAdmin() {
  return currentUser && currentUser.role === "admin";
}

function can(action) {
  if (!currentUser) {
    return false;
  }
  if (currentUser.role === "admin") {
    return true;
  }
  return Boolean(currentUser.permissions && currentUser.permissions[action]);
}

function requirePermission(action) {
  if (!currentUser) {
    mostrarMensagemManutencao("Faca login para executar esta acao.", true);
    return false;
  }
  if (!can(action)) {
    mostrarMensagemManutencao("Voce nao tem permissao para esta acao.", true);
    return false;
  }
  return true;
}

function statusValido(status) {
  return Boolean(STATUS_LABELS[status]);
}

function normalizeIso(value) {
  if (!value) {
    return value;
  }
  const iso = toIsoUtc(value);
  return iso || value;
}

function normalizarManutencoes(lista) {
  const hoje = startOfDay(new Date());
  const changes = [];
  let mudouTempo = false;
  const normalizadas = lista.map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }
    const createdAt = normalizeIso(item.createdAt);
    const updatedAt = normalizeIso(item.updatedAt);
    const doneAt = normalizeIso(item.doneAt);
    const executionStartedAt = normalizeIso(item.executionStartedAt);
    const executionFinishedAt = normalizeIso(item.executionFinishedAt);
    let conclusao = item.conclusao;
    if (conclusao && typeof conclusao === "object") {
      const inicio = normalizeIso(conclusao.inicio);
      const fim = normalizeIso(conclusao.fim);
      if (inicio !== conclusao.inicio || fim !== conclusao.fim) {
        conclusao = { ...conclusao, inicio, fim };
      }
    }
    if (
      createdAt !== item.createdAt ||
      updatedAt !== item.updatedAt ||
      doneAt !== item.doneAt ||
      executionStartedAt !== item.executionStartedAt ||
      executionFinishedAt !== item.executionFinishedAt ||
      conclusao !== item.conclusao
    ) {
      mudouTempo = true;
    }
    const statusOriginal = statusValido(item.status) ? item.status : "agendada";
    if (
      statusOriginal === "concluida" ||
      statusOriginal === "em_execucao" ||
      statusOriginal === "encerramento"
    ) {
      return {
        ...item,
        status: statusOriginal,
        createdAt,
        updatedAt,
        doneAt,
        executionStartedAt,
        executionFinishedAt,
        conclusao,
      };
    }
    const data = parseDate(item.data);
    const atrasada = Boolean(data && data < hoje);
    let novoStatus = statusOriginal;
    if (atrasada) {
      novoStatus = "backlog";
    } else if (isLiberacaoOk(item)) {
      novoStatus = "liberada";
    } else {
      novoStatus = "agendada";
    }
    if (novoStatus !== statusOriginal) {
      changes.push({ id: item.id, from: statusOriginal, to: novoStatus });
      return {
        ...item,
        status: novoStatus,
        updatedAt: toIsoUtc(new Date()),
        updatedBy: SYSTEM_USER_ID,
        createdAt,
        doneAt,
        executionStartedAt,
        executionFinishedAt,
        conclusao,
      };
    }
    return {
      ...item,
      status: statusOriginal,
      createdAt,
      updatedAt,
      doneAt,
      executionStartedAt,
      executionFinishedAt,
      conclusao,
    };
  });
  return { normalizadas, mudou: changes.length > 0 || mudouTempo, changes };
}

function logAction(action, item, detalhes = {}, userId = null) {
  const resolvedUserId = userId || (currentUser ? currentUser.id : SYSTEM_USER_ID);
  const source = detalhes.origem || (resolvedUserId === SYSTEM_USER_ID ? "Sistema" : "UI");
  const entry = {
    id: criarId(),
    action,
    manutencaoId: item ? item.id : null,
    title: item ? item.titulo : null,
    userId: resolvedUserId,
    source,
    timestamp: toIsoUtc(new Date()),
    detalhes,
    prevHash: "",
    hash: "",
  };
  auditLog = [...auditLog, entry];
  salvarAuditoria(auditLog);
  auditHashChain = auditHashChain.then(async (prevHash) => {
    if (entry.hash) {
      return entry.hash;
    }
    const payload = buildAuditPayload(entry, prevHash);
    const hash = await hashSha256(payload);
    entry.prevHash = prevHash || "";
    entry.hash = hash;
    salvarAuditoria(auditLog);
    return hash;
  });
  return auditLog;
}

function getHistoricoManutencao(manutencaoId) {
  return auditLog
    .filter((entry) => entry && entry.manutencaoId === manutencaoId)
    .sort((a, b) => (getTimeValue(b.timestamp) || 0) - (getTimeValue(a.timestamp) || 0));
}

function getUltimaAcao(item) {
  if (!item) {
    return null;
  }
  const historico = getHistoricoManutencao(item.id);
  return historico.length ? historico[0] : null;
}

function getOrigemLabel(entry) {
  if (!entry) {
    return "UI";
  }
  if (entry.source) {
    return entry.source;
  }
  if (entry.detalhes && entry.detalhes.origem) {
    return entry.detalhes.origem;
  }
  if (entry.userId === SYSTEM_USER_ID) {
    return "Sistema";
  }
  return "UI";
}

function getUltimoReagendamento(item) {
  if (!item) {
    return null;
  }
  const historico = getHistoricoManutencao(item.id);
  return historico.find((entry) => entry.action === "reschedule") || null;
}

function getLiberacao(item) {
  if (!item || !item.liberacao || typeof item.liberacao !== "object") {
    return null;
  }
  return item.liberacao;
}

function isLiberacaoOk(item) {
  const liberacao = getLiberacao(item);
  if (!liberacao) {
    return false;
  }
  const osNumero = (liberacao.osNumero || "").trim();
  if (!osNumero) {
    return false;
  }
  const participantes = Array.isArray(liberacao.participantes)
    ? liberacao.participantes.filter(Boolean)
    : [];
  if (!participantes.length) {
    return false;
  }
  if (liberacao.critico && participantes.length < 2) {
    return false;
  }
  const documentos = liberacao.documentos || {};
  if (!documentos.apr || !documentos.os || !documentos.pte) {
    return false;
  }
  if (liberacao.critico && !documentos.pt) {
    return false;
  }
  return true;
}

function getParticipantesLabel(participantes) {
  if (!Array.isArray(participantes) || !participantes.length) {
    return "-";
  }
  return participantes
    .map((id) => (getUserById(id) ? getUserLabel(id) : id))
    .filter(Boolean)
    .join(", ");
}

function openDocsDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB indisponivel"));
      return;
    }
    const request = indexedDB.open("opscope", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("docs")) {
        db.createObjectStore("docs", { keyPath: "docId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getDocById(docId) {
  if (!docId) {
    return Promise.resolve(null);
  }
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }
  return openDocsDB()
    .then(
      (db) =>
        new Promise((resolve) => {
          const tx = db.transaction("docs", "readonly");
          const store = tx.objectStore("docs");
          const request = store.get(docId);
          request.onsuccess = () => resolve(request.result || null);
          request.onerror = () => resolve(null);
        })
    )
    .catch(() => null);
}

function base64ToBlob(base64, mimeType) {
  const byteChars = atob(base64 || "");
  const sliceSize = 1024;
  const slices = [];
  for (let offset = 0; offset < byteChars.length; offset += sliceSize) {
    const slice = byteChars.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    slices.push(new Uint8Array(byteNumbers));
  }
  return new Blob(slices, { type: mimeType || "application/octet-stream" });
}

function openInNewTab(url) {
  if (!url) {
    return;
  }
  const janela = window.open(url, "_blank", "noopener");
  if (!janela) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    document.body.append(link);
    link.click();
    link.remove();
  }
}

function abrirPreview(url, blobUrl = "") {
  if (!modalPreview || !previewFrame) {
    return;
  }
  if (previewBlobUrl) {
    URL.revokeObjectURL(previewBlobUrl);
    previewBlobUrl = "";
  }
  if (blobUrl) {
    previewBlobUrl = blobUrl;
  }
  previewFrame.src = url;
  modalPreview.hidden = false;
}

function fecharPreview() {
  if (!modalPreview || !previewFrame) {
    return;
  }
  modalPreview.hidden = true;
  previewFrame.src = "";
  if (previewBlobUrl) {
    URL.revokeObjectURL(previewBlobUrl);
    previewBlobUrl = "";
  }
}

async function abrirDocumento(doc) {
  if (!doc) {
    return;
  }
  const dataUrl = doc.dataUrl || "";
  if (dataUrl.startsWith("data:application/pdf")) {
    abrirPreview(dataUrl);
    return;
  }
  if (doc.docId) {
    const registro = await getDocById(doc.docId);
    if (registro && registro.blob) {
      const blobUrl = URL.createObjectURL(registro.blob);
      abrirPreview(blobUrl, blobUrl);
      return;
    }
    window.alert("Documento nao encontrado.");
    return;
  }
  const url = dataUrl || doc.url;
  if (!url) {
    window.alert("Documento nao encontrado.");
    return;
  }
  abrirPreview(url);
}

function renderDocList(container, documentos, critico = false) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  const docs = documentos || {};
  let exibiu = false;
  DOC_KEYS.forEach((key) => {
    if (key === "pt" && !critico) {
      return;
    }
    exibiu = true;
    const row = document.createElement("div");
    row.className = "doc-row";
    const label = document.createElement("span");
    label.textContent = DOC_LABELS[key] || key;
    const action = document.createElement("div");
    const doc = docs[key];
    if (doc && (doc.dataUrl || doc.url || doc.docId)) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn--ghost btn--small";
      btn.textContent = "Visualizar";
      btn.addEventListener("click", () => abrirDocumento(doc));
      action.append(btn);
    } else {
      row.classList.add("is-pending");
      const pending = document.createElement("small");
      pending.textContent = "Pendente";
      action.append(pending);
    }
    row.append(label, action);
    container.append(row);
  });
  if (!exibiu) {
    const vazio = document.createElement("p");
    vazio.className = "empty-state";
    vazio.textContent = "Sem documentos.";
    container.append(vazio);
  }
}

function getRescheduleCount(item) {
  if (!item) {
    return 0;
  }
  return auditLog.filter(
    (entry) => entry.action === "reschedule" && entry.manutencaoId === item.id
  ).length;
}

function getOutrosMensalCount() {
  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);
  const inicioMs = inicioMes.getTime();
  const fimMs = fimMes.getTime();
  return auditLog.filter((entry) => {
    if (entry.action !== "reschedule") {
      return false;
    }
    if (!entry.detalhes || entry.detalhes.motivo !== "Outros") {
      return false;
    }
    const stamp = getTimeValue(entry.timestamp);
    return stamp !== null && stamp >= inicioMs && stamp <= fimMs;
  }).length;
}

function renderAlertaProgramacao() {
  if (!alertaProgramacao) {
    return;
  }
  const count = getOutrosMensalCount();
  if (count > OUTROS_ALERT_THRESHOLD) {
    alertaProgramacao.textContent =
      `Alerta: motivo Outros usado ${count}x neste mes. Revisar governanca.`;
    alertaProgramacao.hidden = false;
    return;
  }
  alertaProgramacao.hidden = true;
}
function atualizarResumo() {
  const contagem = {
    agendada: 0,
    liberada: 0,
    backlog: 0,
    em_execucao: 0,
    encerramento: 0,
    concluida: 0,
  };

  manutencoes.forEach((item) => {
    const status = statusValido(item.status) ? item.status : "agendada";
    contagem[status] += 1;
  });

  countAgendadas.textContent = contagem.agendada;
  if (countLiberadas) {
    countLiberadas.textContent = contagem.liberada;
  }
  countBacklog.textContent = contagem.backlog;
  if (countEmExecucao) {
    countEmExecucao.textContent = contagem.em_execucao;
  }
  if (countEncerramento) {
    countEncerramento.textContent = contagem.encerramento;
  }
  countConcluidas.textContent = contagem.concluida;
  renderHome();
}

function getDateInfo(item, hoje) {
  const data = parseDate(item.data);
  if (!data) {
    return null;
  }
  const diff = diffInDays(hoje, data);
  return { data, diff };
}

function getReleaseLockInfo(item, data, hoje) {
  if (!item || !data) {
    return null;
  }
  if (item.status !== "agendada") {
    return null;
  }
  if (data <= hoje) {
    return null;
  }
  return { date: data, canOverride: canOverrideRelease(currentUser) };
}

function renderHome() {
  loadDashboardSummary();
  renderDashboardHome();
}

function renderDashboardHome() {
  if (!dashboardHome) {
    return;
  }
  if (!dashboardSummary) {
    const mensagem = dashboardError || "Carregando indicadores...";
    dashboardHome.innerHTML = `<p class="dashboard-message">${mensagem}</p>`;
    return;
  }
  const { kpis, alertasOperacionais, saudeOperacional, graficoEficiencia, proximasAtividades } =
    dashboardSummary;

  const renderKpiCard = (label, value) =>
    `<article class="kpi-card"><span>${label}</span><strong>${value}</strong></article>`;

  const alertHtml = alertasOperacionais.length
    ? `<div class="alert-list">${alertasOperacionais
        .map((alerta) => {
          const badgeClass = alerta.tipo === "critico" ? "badge--crit" : "badge--warn";
          const badgeLabel = alerta.tipo === "critico" ? "Critico" : "Aviso";
          return `<div class="alert-item">
            <span>${escapeHtml(alerta.msg)}</span>
            <span class="badge ${badgeClass}">${badgeLabel}</span>
          </div>`;
        })
        .join("")}</div>`
    : `<p class="empty-state">Nenhum alerta critico.</p>`;

  const series = Array.isArray(graficoEficiencia.serie) ? graficoEficiencia.serie : [];
  const labels = Array.isArray(graficoEficiencia.labels) ? graficoEficiencia.labels : [];
  const chart = buildMiniChart(series, labels);
  const labelRow = labels.length
    ? `<div class="chart-labels">${labels
        .map((label) => `<span>${escapeHtml(label)}</span>`)
        .join("")}</div>`
    : "";

  const rows = proximasAtividades
    .map((item) => {
      const badge = getStatusBadge(item.status);
      return `<tr>
        <td>${escapeHtml(item.atividade)}</td>
        <td>${escapeHtml(item.responsavel)}</td>
        <td>${escapeHtml(item.prazo)}</td>
        <td>${badge}</td>
      </tr>`;
    })
    .join("");

  dashboardHome.innerHTML = `
    <div class="kpi-grid">
      ${renderKpiCard("VENCE HOJE", kpis.venceHoje)}
      ${renderKpiCard("ATRASADAS", kpis.atrasadas)}
      ${renderKpiCard("CRITICAS", kpis.criticas)}
      ${renderKpiCard("RISCO IMEDIATO", kpis.riscoImediato)}
    </div>
    <div class="dashboard-row">
      <article class="card panel-card">
        <div class="panel-head">
          <h3>ALERTAS OPERACIONAIS</h3>
        </div>
        ${alertHtml}
      </article>
      <article class="card panel-card">
        <div class="panel-head">
          <h3>SAUDE OPERACIONAL</h3>
        </div>
        <div class="health-grid">
          <div class="health-item">
            <span>Pontualidade</span>
            <strong>${saudeOperacional.pontualidadePct}%</strong>
          </div>
          <div class="health-item">
            <span>Backlog</span>
            <strong>${saudeOperacional.backlogTotal}</strong>
          </div>
          <div class="health-item">
            <span>Concluidas</span>
            <strong>${saudeOperacional.concluidasPeriodo}</strong>
          </div>
          <div class="health-item">
            <span>Atraso medio</span>
            <strong>${saudeOperacional.atrasoMedioDias}d</strong>
          </div>
        </div>
      </article>
    </div>
    <div class="dashboard-row">
      <article class="card panel-card">
        <div class="panel-head">
          <h3>EFICIENCIA OPERACIONAL</h3>
          <span class="trend-tag">+8%</span>
        </div>
        <div class="mini-chart">
          ${chart}
          ${labelRow}
        </div>
      </article>
      <article class="card panel-card">
        <div class="panel-head">
          <h3>PROXIMAS ATIVIDADES</h3>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Atividade</th>
                <th>Responsavel</th>
                <th>Prazo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="4" class="empty-state">Sem registros.</td></tr>`}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  `;
}

function buildMiniChart(series, labels) {
  const safeSeries = Array.isArray(series) && series.length ? series : [0];
  const width = 240;
  const height = 90;
  const pad = 10;
  const values = safeSeries.filter((value) => typeof value === "number");
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 100;
  const range = max - min || 1;
  const count = safeSeries.length;
  const points = safeSeries.map((value, index) => {
    const x = count === 1 ? width / 2 : pad + (index / (count - 1)) * (width - pad * 2);
    if (typeof value !== "number") {
      return { x, y: null };
    }
    const y = height - pad - ((value - min) / range) * (height - pad * 2);
    return { x, y };
  });
  const paths = [];
  let current = [];
  points.forEach((point) => {
    if (point.y === null) {
      if (current.length > 0) {
        paths.push(current);
        current = [];
      }
      return;
    }
    current.push(point);
  });
  if (current.length > 0) {
    paths.push(current);
  }
  const pathMarkup = paths
    .map((segment) => {
      const d = segment
        .map((point, idx) => `${idx === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
        .join(" ");
      return `<path class="chart-line" d="${d}" />`;
    })
    .join("");
  const circles = points
    .map((point) => {
      if (point.y === null) {
        return "";
      }
      return `<circle class="chart-point" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="2.2" />`;
    })
    .join("");
  const gridLines = [0, 1, 2, 3]
    .map((step) => {
      const y = pad + (step / 3) * (height - pad * 2);
      return `<line x1="${pad}" y1="${y}" x2="${width - pad}" y2="${y}" />`;
    })
    .join("");
  const labelText = labels && labels.length ? labels.join(", ") : "";

  return `
    <svg viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false" role="img">
      ${labelText ? `<title>${escapeHtml(labelText)}</title>` : ""}
      <g class="chart-grid">${gridLines}</g>
      ${pathMarkup}
      ${circles}
    </svg>
  `;
}

function getStatusBadge(status) {
  const texto = status || "";
  const normalizado = texto.toLowerCase();
  let classe = "badge";
  if (normalizado.includes("crit")) {
    classe += " badge--crit";
  } else if (
    normalizado.includes("atras") ||
    normalizado.includes("risco") ||
    normalizado.includes("hoje")
  ) {
    classe += " badge--warn";
  } else {
    classe += " badge--ok";
  }
  return `<span class="${classe}">${escapeHtml(texto || "OK")}</span>`;
}

function renderLembretes() {
  if (!listaLembretes || !lembretesVazio) {
    return;
  }
  listaLembretes.innerHTML = "";
  const hoje = startOfDay(new Date());
  const readSet = getReadNotificationIds();

  const proximos = manutencoes
    .filter((item) => item.status === "agendada" || item.status === "liberada")
    .map((item) => {
      const data = parseDate(item.data);
      return { item, data };
    })
    .filter((entrada) => entrada.data)
    .map((entrada) => {
      const diff = diffInDays(hoje, entrada.data);
      return { ...entrada, diff };
    })
    .filter((entrada) => entrada.diff >= 0 && entrada.diff <= reminderDays)
    .sort((a, b) => a.data - b.data);

  if (lembretesCount) {
    const ids = new Set(proximos.map(({ item }) => String(item.id)));
    let changed = false;
    readSet.forEach((id) => {
      if (!ids.has(id)) {
        readSet.delete(id);
        changed = true;
      }
    });
    if (changed) {
      saveReadNotificationIds(readSet);
    }
    const total = proximos.filter(({ item }) => !readSet.has(String(item.id))).length;
    lembretesCount.textContent = lembretesCount.id === "bellDot" ? "" : total;
    lembretesCount.hidden = total === 0;
    lembretesCount.classList.toggle("is-zero", total === 0);
  }

  if (proximos.length === 0) {
    lembretesVazio.hidden = false;
    return;
  }

  lembretesVazio.hidden = true;
  proximos.forEach(({ item, data, diff }) => {
    const card = document.createElement("div");
    card.className = "lembrete-item";
    card.dataset.maintenanceId = item.id;

    const titulo = document.createElement("strong");
    titulo.textContent = item.titulo;

    const detalhe = document.createElement("span");
    detalhe.textContent = `${item.local} - ${formatDate(data)} (${formatReminder(diff)})`;

    card.append(titulo, detalhe);
    listaLembretes.append(card);
  });
}

function criarBotaoAcao(texto, acao, perigo = false) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  botao.dataset.action = acao;
  botao.className = `btn btn--ghost btn--small${perigo ? " btn--danger" : ""}`;
  return botao;
}

function criarCardManutencao(item, permissoes, options = {}) {
  const data = parseDate(item.data);
  const hoje = startOfDay(new Date());
  const diff = data ? diffInDays(hoje, data) : null;
  const liberacao = getLiberacao(item);
  const lockInfo = getReleaseLockInfo(item, data, hoje);

  const card = document.createElement("article");
  card.className = `manutencao-item status-${item.status}`;
  card.dataset.id = item.id;
  card.dataset.maintenanceId = item.id;
  card.id = `maintenance-${item.id}`;

  const header = document.createElement("div");
  header.className = "manutencao-header";

  const info = document.createElement("div");
  info.className = "manutencao-info";

  const titulo = document.createElement("h3");
  titulo.textContent = item.titulo;

  const meta = document.createElement("p");
  meta.className = "meta";
  const dataTexto = data ? formatDate(data) : "data indefinida";
  meta.textContent = `${item.local} - ${dataTexto}`;

  const statusInfo = document.createElement("p");
  statusInfo.className = "submeta";
  if (item.status === "agendada" || item.status === "liberada") {
    statusInfo.textContent = formatUpcoming(diff);
  } else if (item.status === "backlog") {
    statusInfo.textContent = formatOverdue(diff);
  } else if (item.status === "em_execucao") {
    const inicio = parseTimestamp(item.executionStartedAt);
    statusInfo.textContent = inicio
      ? `Em execucao desde ${formatDateTime(inicio)}`
      : "Em execucao";
  } else if (item.status === "encerramento") {
    statusInfo.textContent = "Encerramento em preenchimento";
  } else if (item.status === "concluida" && item.doneAt) {
    const feitoEm = parseTimestamp(item.doneAt);
    if (feitoEm) {
      statusInfo.textContent = `concluida em ${formatDate(startOfDay(feitoEm))}`;
    }
  }

  const autoria = document.createElement("p");
  autoria.className = "submeta";
  const ultimaAcao = getUltimaAcao(item);
  if (ultimaAcao) {
    const label = ACTION_LABELS[ultimaAcao.action] || ultimaAcao.action;
    const dataAcao = parseTimestamp(ultimaAcao.timestamp);
    autoria.textContent = `Ultima acao: ${label} em ${
      dataAcao ? formatDateTime(dataAcao) : "-"
    } por ${getUserLabel(ultimaAcao.userId)}`;
  } else {
    autoria.textContent = `Criada por ${getUserLabel(item.createdBy)}`;
  }

  info.append(titulo, meta);
  if (statusInfo.textContent) {
    info.append(statusInfo);
  }
  if (lockInfo) {
    const lockLine = document.createElement("p");
    lockLine.className = "submeta submeta--lock";
    const lockIcon = document.createElement("span");
    lockIcon.className = "lock-icon";
    lockIcon.innerHTML = LOCK_ICON_SVG;
    const lockText = document.createElement("span");
    lockText.textContent = `Trancada - libera em ${formatDate(lockInfo.date)}`;
    lockLine.append(lockIcon, lockText);
    info.append(lockLine);
  }
  if (item.status === "liberada") {
    const liberadaInfo = document.createElement("p");
    liberadaInfo.className = "submeta";
    liberadaInfo.textContent = "Liberada para iniciar";
    info.append(liberadaInfo);
  }
  if (
    (item.status === "em_execucao" || item.status === "encerramento") &&
    liberacao
  ) {
    const osLinha = document.createElement("p");
    osLinha.className = "submeta";
    osLinha.textContent = `OS: ${liberacao.osNumero || "-"}`;
    info.append(osLinha);
    const participantesLinha = document.createElement("p");
    participantesLinha.className = "submeta";
    participantesLinha.textContent = `Participantes: ${getParticipantesLabel(
      liberacao.participantes
    )}`;
    info.append(participantesLinha);
  }
  info.append(autoria);

  const ultimoReagendamento = getUltimoReagendamento(item);
  if (ultimoReagendamento && ultimoReagendamento.detalhes && ultimoReagendamento.detalhes.motivo) {
    const motivo = document.createElement("p");
    motivo.className = "submeta";
    motivo.textContent = `Motivo do ultimo reagendamento: ${ultimoReagendamento.detalhes.motivo}`;
    info.append(motivo);
  }
  const rescheduleCount = getRescheduleCount(item);
  if (rescheduleCount >= MAX_REAGENDAMENTOS) {
    const alerta = document.createElement("p");
    alerta.className = "submeta submeta--alert";
    alerta.textContent = `Reagendada ${rescheduleCount}x`;
    info.append(alerta);
  }

  if (item.observacao) {
    const obs = document.createElement("p");
    obs.className = "obs";
    obs.textContent = item.observacao;
    info.append(obs);
  }

  const badge = document.createElement("span");
  const statusBase =
    item.status === "concluida"
      ? "concluida"
      : item.status === "em_execucao"
        ? "em_execucao"
      : item.status === "encerramento"
        ? "encerramento"
      : item.status === "backlog" || (diff !== null && diff < 0)
        ? "backlog"
      : item.status === "liberada"
        ? "liberada"
      : diff === 0
        ? "hoje"
        : diff === 1
          ? "amanha"
          : "agendada";
  const label =
    statusBase === "concluida"
      ? STATUS_LABELS.concluida
      : statusBase === "em_execucao"
        ? STATUS_LABELS.em_execucao
      : statusBase === "encerramento"
        ? STATUS_LABELS.encerramento
      : statusBase === "backlog"
        ? "Atrasada"
      : statusBase === "liberada"
        ? STATUS_LABELS.liberada
      : statusBase === "hoje"
        ? "Vence hoje"
        : statusBase === "amanha"
          ? "Vence amanha"
          : STATUS_LABELS.agendada;
  badge.className = `status status--${statusBase}`;
  badge.textContent = label;

  header.append(info, badge);

  const actions = document.createElement("div");
  actions.className = "manutencao-actions";
  const allowed = options.allowedActions || null;
  const permite = (key) => {
    const base =
      key === "register" || key === "finish" || key === "release" || key === "cancel_start"
        ? permissoes.execute
        : permissoes[key];
    return (allowed ? allowed.includes(key) : true) && base;
  };

  const liberacaoOk = isLiberacaoOk(item);
  const podeEditar =
    item.status === "agendada" || item.status === "backlog" || item.status === "liberada";
  if (permite("edit") && podeEditar) {
    actions.append(criarBotaoAcao("Editar", "edit"));
  }

  if (permite("note") && podeEditar) {
    actions.append(criarBotaoAcao("Observacao", "note"));
  }

  if (item.status === "agendada" || item.status === "backlog" || item.status === "liberada") {
    if (permite("execute")) {
      const action = liberacaoOk ? "execute" : "release";
      const actionLabel = liberacaoOk ? "Iniciar execucao" : "Liberar execucao";
      const botao = criarBotaoAcao(actionLabel, action);
      if (action === "release" && lockInfo && !lockInfo.canOverride) {
        botao.disabled = true;
        botao.classList.add("is-disabled");
        botao.title = `Trancada - libera em ${formatDate(lockInfo.date)}`;
      }
      actions.append(botao);
    }
    if (permite("reschedule")) {
      actions.append(criarBotaoAcao("Reagendar", "reschedule"));
    }
  } else if (item.status === "em_execucao") {
    if (permite("execute")) {
      actions.append(criarBotaoAcao("Registrar execucao", "register"));
    }
    if (permite("execute") && !item.registroExecucao) {
      actions.append(criarBotaoAcao("Cancelar inicio", "cancel_start"));
    }
    if (permite("execute") && item.registroExecucao) {
      actions.append(criarBotaoAcao("Concluir manutencao", "finish"));
    }
  } else if (item.status === "encerramento") {
    if (permite("execute")) {
      actions.append(criarBotaoAcao("Registrar execucao", "register"));
      actions.append(criarBotaoAcao("Concluir manutencao", "finish"));
    }
  }

  if (permite("history")) {
    actions.append(criarBotaoAcao("Historico", "history"));
  }

  if (
    permite("remove") &&
    item.status !== "concluida" &&
    item.status !== "em_execucao" &&
    item.status !== "encerramento"
  ) {
    actions.append(criarBotaoAcao("Remover", "remove", true));
  }

  card.append(header);
  if (actions.childElementCount > 0) {
    card.append(actions);
  }
  return card;
}

function renderListaStatus(status, container, emptyEl, options = {}) {
  if (!container || !emptyEl) {
    return;
  }
  container.innerHTML = "";
  const permissoes = {
    edit: can("edit"),
    note: can("edit"),
    remove: can("remove"),
    reschedule: can("reschedule"),
    execute: can("complete"),
    history: true,
  };
  const items = manutencoes
    .filter((item) => item.status === status)
    .sort((a, b) => {
      const dataA = parseDate(a.data);
      const dataB = parseDate(b.data);
      if (status === "concluida") {
        return (getTimeValue(b.doneAt) || 0) - (getTimeValue(a.doneAt) || 0);
      }
      if (dataA && dataB) {
        return dataA - dataB;
      }
      if (dataA) {
        return -1;
      }
      if (dataB) {
        return 1;
      }
      return 0;
    });

  const limit = options.limit || items.length;
  const allowedActions = options.allowedActions || null;
  items.slice(0, limit).forEach((item) => {
    container.append(criarCardManutencao(item, permissoes, { allowedActions }));
  });

  emptyEl.hidden = items.length > 0;
}

function renderProgramacao() {
  if (!listaAgendadas || !listaAgendadasVazia) {
    return;
  }
  listaAgendadas.innerHTML = "";
  renderAlertaProgramacao();

  const hoje = startOfDay(new Date());
  const existentes = manutencoes.filter(
    (item) =>
      item &&
      (item.status === "agendada" ||
        item.status === "liberada" ||
        item.status === "backlog" ||
        item.status === "em_execucao" ||
        item.status === "encerramento")
  );

  if (filtroProgramacaoSubestacao) {
    const atual = filtroProgramacaoSubestacao.value;
    const subestacoes = Array.from(
      new Set([...SUBESTACOES, ...existentes.map((item) => item.local).filter(Boolean)])
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
    filtroProgramacaoSubestacao.innerHTML = "";
    const optionAll = document.createElement("option");
    optionAll.value = "";
    optionAll.textContent = "Todas";
    filtroProgramacaoSubestacao.append(optionAll);
    subestacoes.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      filtroProgramacaoSubestacao.append(option);
    });
    if (atual && subestacoes.includes(atual)) {
      filtroProgramacaoSubestacao.value = atual;
    }
  }

  const filtroSubestacao = filtroProgramacaoSubestacao ? filtroProgramacaoSubestacao.value : "";
  const filtroStatus = filtroProgramacaoStatus ? filtroProgramacaoStatus.value : "";
  const filtroPeriodo = filtroProgramacaoPeriodo ? filtroProgramacaoPeriodo.value : "";

  const filtrados = existentes.filter((item) => {
    if (filtroSubestacao && item.local !== filtroSubestacao) {
      return false;
    }
    const info = getDateInfo(item, hoje);
    const diff = info ? info.diff : null;

    if (filtroStatus === "backlog") {
      if (
        !(
          item.status === "backlog" ||
          (item.status !== "em_execucao" && item.status !== "encerramento" && diff !== null && diff < 0)
        )
      ) {
        return false;
      }
    } else if (filtroStatus === "liberada") {
      if (item.status !== "liberada") {
        return false;
      }
    } else if (filtroStatus === "em_execucao") {
      if (item.status !== "em_execucao") {
        return false;
      }
    } else if (filtroStatus === "encerramento") {
      if (item.status !== "encerramento") {
        return false;
      }
    } else if (filtroStatus === "hoje") {
      if (diff !== 0) {
        return false;
      }
    } else if (filtroStatus === "agendada") {
      if (
        (item.status !== "agendada" && item.status !== "liberada") ||
        diff === null ||
        diff < 1
      ) {
        return false;
      }
    }

    if (filtroPeriodo) {
      const data = info ? info.data : null;
      if (!data) {
        return false;
      }
      if (filtroPeriodo === "hoje") {
        if (diff !== 0) {
          return false;
        }
      } else if (filtroPeriodo === "semana") {
        if (diff === null || diff < 0 || diff > 6) {
          return false;
        }
      } else if (filtroPeriodo === "mes") {
        const base = startOfDay(data);
        if (base.getMonth() !== hoje.getMonth() || base.getFullYear() !== hoje.getFullYear()) {
          return false;
        }
      }
    }

    return true;
  });

  if (!filtrados.length) {
    listaAgendadasVazia.textContent = "Nenhuma manutencao encontrada.";
    listaAgendadasVazia.hidden = false;
    return;
  }

  const getGrupo = (item) => {
    const info = getDateInfo(item, hoje);
    const diff = info ? info.diff : null;
    if (
      item.status === "backlog" ||
      (item.status !== "em_execucao" && item.status !== "encerramento" && diff !== null && diff < 0)
    ) {
      return 0;
    }
    if (item.status === "em_execucao" || item.status === "encerramento") {
      return 1;
    }
    if (diff === 0) {
      return 2;
    }
    if (diff === 1) {
      return 3;
    }
    return 4;
  };

  const ordenados = filtrados.sort((a, b) => {
    const grupoA = getGrupo(a);
    const grupoB = getGrupo(b);
    if (grupoA !== grupoB) {
      return grupoA - grupoB;
    }
    const dataA = parseDate(a.data);
    const dataB = parseDate(b.data);
    if (dataA && dataB) {
      return dataA - dataB;
    }
    if (dataA) {
      return -1;
    }
    if (dataB) {
      return 1;
    }
    return 0;
  });

  const permissoes = {
    edit: can("edit"),
    note: can("edit"),
    remove: can("remove"),
    reschedule: can("reschedule"),
    execute: can("complete"),
    history: true,
  };

  ordenados.forEach((item) => {
    listaAgendadas.append(
      criarCardManutencao(item, permissoes, {
        allowedActions: ["release", "execute", "cancel_start", "reschedule", "register", "finish", "history"],
      })
    );
  });

  listaAgendadasVazia.textContent = "Nenhuma manutencao agendada.";
  listaAgendadasVazia.hidden = true;
}

function renderListaCustom(items, container, emptyEl, allowedActions) {
  if (!container || !emptyEl) {
    return;
  }
  container.innerHTML = "";
  const permissoes = {
    edit: can("edit"),
    note: can("edit"),
    remove: can("remove"),
    reschedule: can("reschedule"),
    execute: can("complete"),
    history: true,
  };
  items.forEach((item) => {
    container.append(criarCardManutencao(item, permissoes, { allowedActions }));
  });
  emptyEl.hidden = items.length > 0;
}

function renderExecucao() {
  if (!listaExecucaoHoje || !listaExecucaoVencidas || !listaExecucaoCriticas) {
    return;
  }
  const hoje = startOfDay(new Date());

  const agendadasHoje = manutencoes
    .filter((item) => item.status === "agendada" || item.status === "liberada")
    .map((item) => {
      const info = getDateInfo(item, hoje);
      return info ? { item, ...info } : null;
    })
    .filter((entry) => entry && entry.diff === 0)
    .map((entry) => entry.item);

  const vencidasInfo = manutencoes
    .filter((item) => item.status === "backlog")
    .map((item) => {
      const info = getDateInfo(item, hoje);
      return info ? { item, ...info } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.diff - b.diff);

  const vencidas = vencidasInfo.map((entry) => entry.item);
  const criticas = vencidasInfo.filter((entry) => entry.diff <= -3).map((entry) => entry.item);

  renderListaCustom(agendadasHoje, listaExecucaoHoje, listaExecucaoHojeVazia, [
    "note",
    "release",
    "execute",
    "reschedule",
    "history",
  ]);
  renderListaCustom(vencidas, listaExecucaoVencidas, listaExecucaoVencidasVazia, [
    "note",
    "release",
    "execute",
    "reschedule",
    "history",
  ]);
  renderListaCustom(criticas, listaExecucaoCriticas, listaExecucaoCriticasVazia, [
    "note",
    "release",
    "execute",
    "reschedule",
    "history",
  ]);
}

function renderRelatorios() {
  if (!listaRelatorios || !listaRelatoriosVazia) {
    return;
  }
  listaRelatorios.innerHTML = "";
  const concluidas = [...manutencoes]
    .filter((item) => item.status === "concluida")
    .sort((a, b) => (getTimeValue(b.doneAt) || 0) - (getTimeValue(a.doneAt) || 0));

  if (concluidas.length === 0) {
    listaRelatoriosVazia.hidden = false;
    return;
  }
  listaRelatoriosVazia.hidden = true;

  concluidas.forEach((item) => {
    const card = document.createElement("div");
    card.className = "report-item";
    card.dataset.id = item.id;

    const info = document.createElement("div");
    const titulo = document.createElement("strong");
    titulo.textContent = item.titulo;
    const meta = document.createElement("p");
    meta.className = "meta";
    const data = parseDate(item.data);
    const doneAt = parseTimestamp(item.doneAt);
    const dataReferencia = doneAt
      ? formatDate(doneAt)
      : data
        ? formatDate(data)
        : "data indefinida";
    meta.textContent = `${item.local} - ${dataReferencia}`;
    info.append(titulo, meta);

    const actions = document.createElement("div");
    actions.className = "report-actions";
    const btnVer = document.createElement("button");
    btnVer.type = "button";
    btnVer.className = "btn btn--ghost btn--small";
    btnVer.dataset.action = "open-report";
    btnVer.textContent = "Ver relatorio";
    actions.append(btnVer);

    card.append(info, actions);
    listaRelatorios.append(card);
  });
}

function montarRdoUI() {
  const painel = document.getElementById("relatorios");
  if (!painel || document.getElementById("rdoCard")) {
    return;
  }
  const card = document.createElement("section");
  card.className = "card rdo-card";
  card.id = "rdoCard";
  card.innerHTML = `
    <div class="rdo-head">
      <div>
        <h2>Relatorios Diarios (RDO)</h2>
        <p class="hint">Consolide a operacao do dia com texto tecnico e evidencias.</p>
      </div>
      <button id="btnGerarRdo" class="btn btn--primary" type="button">Gerar RDO do dia</button>
    </div>
    <div class="rdo-actions">
      <label class="rdo-toggle">
        <input id="rdoShowDeleted" type="checkbox" />
        <span>Exibir excluidos</span>
      </label>
      <button id="btnRdoExcluir" class="btn btn--danger btn--small" type="button" disabled>
        Excluir selecionados
      </button>
    </div>
    <div id="rdoList" class="rdo-list"></div>
    <p id="rdoEmpty" class="empty-state">Nenhum RDO gerado.</p>
  `;
  painel.append(card);

  const modal = document.createElement("div");
  modal.id = "modalRdo";
  modal.className = "modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="modal__content modal__content--wide">
      <div class="modal__header">
        <div>
          <h3>Relatorio Diario de Operacao</h3>
          <p class="hint">Geracao automatica baseada na execucao do dia.</p>
        </div>
        <button class="btn btn--ghost btn--small" type="button" data-rdo-close>Fechar</button>
      </div>
      <form class="modal__form">
        <div class="form-grid">
          <div class="field">
            <label for="rdoData">Data do RDO</label>
            <input id="rdoData" type="date" />
          </div>
          <div class="field">
            <label for="rdoSubestacao">Subestacao</label>
            <select id="rdoSubestacao">
              <option value="">Todas</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoCategoria">Categoria</label>
            <select id="rdoCategoria">
              <option value="">Todas</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoPrioridade">Prioridade</label>
            <select id="rdoPrioridade">
              <option value="">Todas</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoUsuario">Usuario</label>
            <select id="rdoUsuario">
              <option value="">Todos</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoLimite">Limite de evidencias no PDF</label>
            <select id="rdoLimite">
              <option value="8">8</option>
              <option value="16" selected>16</option>
              <option value="32">32</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoCondutor">Condutor do veiculo</label>
            <input id="rdoCondutor" type="text" />
          </div>
          <div class="field">
            <label for="rdoKmInicial">KM inicial do dia</label>
            <input id="rdoKmInicial" type="number" min="0" step="0.1" />
          </div>
          <div class="field">
            <label for="rdoKmFinal">KM final do dia</label>
            <input id="rdoKmFinal" type="number" min="0" step="0.1" />
          </div>
          <div class="field">
            <label for="rdoQtPessoas">Qt. pessoas na atividade</label>
            <input id="rdoQtPessoas" type="number" min="0" step="1" />
          </div>
          <div class="field">
            <label for="rdoClima">Clima</label>
            <select id="rdoClima">
              <option value="SOL">SOL</option>
              <option value="NUBLADO">NUBLADO</option>
              <option value="CHUVA">CHUVA</option>
              <option value="VENTO FORTE">VENTO FORTE</option>
              <option value="NEBLINA">NEBLINA</option>
              <option value="OUTRO">OUTRO</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoLocal">Local</label>
            <select id="rdoLocal">
              <option value="LZC-BOS2">LZC-BOS2</option>
              <option value="LZC-PCT4">LZC-PCT4</option>
              <option value="LZC-LT">LZC-LT</option>
              <option value="LZC-BSO2/LZC-PCT4">LZC-BSO2/LZC-PCT4</option>
            </select>
          </div>
          <div class="field" id="rdoClimaOutroField" hidden>
            <label for="rdoClimaOutro">Clima (outro)</label>
            <input id="rdoClimaOutro" type="text" />
          </div>
          <div class="field">
            <label for="rdoIncidente">Incidente/Acidente</label>
            <select id="rdoIncidente">
              <option value="NAO">NAO</option>
              <option value="SIM">SIM</option>
              <option value="N/A">N/A</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoBloqueio">Bloqueio eletrico</label>
            <select id="rdoBloqueio">
              <option value="NAO">NAO</option>
              <option value="SIM">SIM</option>
              <option value="N/A">N/A</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoSi">N de SI</label>
            <input id="rdoSi" type="text" />
          </div>
          <div class="field">
            <label for="rdoSgi">N de SGI</label>
            <input id="rdoSgi" type="text" />
          </div>
        </div>
        <div class="field" data-full>
          <label for="rdoRegistro">Registro gerencial do dia</label>
          <textarea id="rdoRegistro" rows="2" placeholder="Opcional"></textarea>
        </div>
        <p id="rdoMensagem" class="mensagem" aria-live="polite"></p>
        <div class="modal__actions">
          <button id="btnRdoPreview" class="btn btn--ghost btn--small" type="button">Preview</button>
          <button id="btnRdoExportar" class="btn btn--primary btn--small" type="button">Exportar PDF</button>
          <button id="btnRdoVoltar" class="btn btn--ghost btn--small" type="button">Voltar</button>
        </div>
        <div id="rdoPreview" class="rdo-preview" hidden>
          <div class="rdo-preview__head">
            <strong>Preview do RDO</strong>
            <small class="hint">Somente leitura.</small>
          </div>
          <div id="rdoPreviewBody"></div>
        </div>
      </form>
    </div>
  `;
  document.body.append(modal);

  const modalDelete = document.createElement("div");
  modalDelete.id = "modalRdoDelete";
  modalDelete.className = "modal";
  modalDelete.hidden = true;
  modalDelete.innerHTML = `
    <div class="modal__content">
      <div class="modal__header">
        <div>
          <h3>Excluir RDOs selecionados</h3>
          <p class="hint">Informe o motivo da exclusao.</p>
        </div>
        <button class="btn btn--ghost btn--small" type="button" data-rdo-delete-close>Fechar</button>
      </div>
      <form class="modal__form">
        <div class="field">
          <label for="rdoDeleteReason">Justificativa (obrigatoria)</label>
          <textarea id="rdoDeleteReason" rows="3" placeholder="Descreva o motivo"></textarea>
        </div>
        <p id="rdoDeleteMensagem" class="mensagem" aria-live="polite"></p>
        <div class="modal__actions">
          <button id="btnRdoDeleteConfirm" class="btn btn--danger btn--small" type="button">
            Confirmar exclusao
          </button>
          <button id="btnRdoDeleteCancel" class="btn btn--ghost btn--small" type="button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `;
  document.body.append(modalDelete);

  rdoUI.card = card;
  rdoUI.list = card.querySelector("#rdoList");
  rdoUI.empty = card.querySelector("#rdoEmpty");
  rdoUI.showDeleted = card.querySelector("#rdoShowDeleted");
  rdoUI.btnExcluir = card.querySelector("#btnRdoExcluir");
  rdoUI.btnGerar = card.querySelector("#btnGerarRdo");
  rdoUI.modal = modal;
  rdoUI.data = modal.querySelector("#rdoData");
  rdoUI.subestacao = modal.querySelector("#rdoSubestacao");
  rdoUI.categoria = modal.querySelector("#rdoCategoria");
  rdoUI.prioridade = modal.querySelector("#rdoPrioridade");
  rdoUI.usuario = modal.querySelector("#rdoUsuario");
  rdoUI.registro = modal.querySelector("#rdoRegistro");
  rdoUI.limite = modal.querySelector("#rdoLimite");
  rdoUI.condutor = modal.querySelector("#rdoCondutor");
  rdoUI.kmInicial = modal.querySelector("#rdoKmInicial");
  rdoUI.kmFinal = modal.querySelector("#rdoKmFinal");
  rdoUI.qtPessoas = modal.querySelector("#rdoQtPessoas");
  rdoUI.clima = modal.querySelector("#rdoClima");
  rdoUI.climaOutroField = modal.querySelector("#rdoClimaOutroField");
  rdoUI.climaOutro = modal.querySelector("#rdoClimaOutro");
  rdoUI.incidente = modal.querySelector("#rdoIncidente");
  rdoUI.bloqueio = modal.querySelector("#rdoBloqueio");
  rdoUI.local = modal.querySelector("#rdoLocal");
  rdoUI.numeroSi = modal.querySelector("#rdoSi");
  rdoUI.numeroSgi = modal.querySelector("#rdoSgi");
  rdoUI.preview = modal.querySelector("#rdoPreview");
  rdoUI.previewBody = modal.querySelector("#rdoPreviewBody");
  rdoUI.mensagem = modal.querySelector("#rdoMensagem");
  rdoUI.btnPreview = modal.querySelector("#btnRdoPreview");
  rdoUI.btnExportar = modal.querySelector("#btnRdoExportar");
  rdoUI.btnFechar = modal.querySelector("[data-rdo-close]");
  rdoUI.btnVoltar = modal.querySelector("#btnRdoVoltar");
  rdoUI.deleteModal = modalDelete;
  rdoUI.deleteReason = modalDelete.querySelector("#rdoDeleteReason");
  rdoUI.deleteMensagem = modalDelete.querySelector("#rdoDeleteMensagem");
  rdoUI.btnDeleteConfirm = modalDelete.querySelector("#btnRdoDeleteConfirm");
  rdoUI.btnDeleteCancel = modalDelete.querySelector("#btnRdoDeleteCancel");

  if (rdoUI.btnGerar) {
    rdoUI.btnGerar.addEventListener("click", () => abrirRdoModal());
  }
  if (rdoUI.btnFechar) {
    rdoUI.btnFechar.addEventListener("click", fecharRdoModal);
  }
  if (rdoUI.btnVoltar) {
    rdoUI.btnVoltar.addEventListener("click", fecharRdoModal);
  }
  if (rdoUI.btnPreview) {
    rdoUI.btnPreview.addEventListener("click", async () => {
      const snapshot = await gerarSnapshotRdo(false);
      if (snapshot) {
        renderRdoPreview(snapshot);
      }
    });
  }
  if (rdoUI.btnExportar) {
    rdoUI.btnExportar.addEventListener("click", async () => {
      const isReadOnly = rdoUI.modal && rdoUI.modal.dataset.readonly === "true";
      const snapshot = isReadOnly ? rdoPreviewSnapshot : await gerarSnapshotRdo(true);
      if (snapshot) {
        await exportarRdoPdf(snapshot);
      }
    });
  }
  if (rdoUI.showDeleted) {
    rdoUI.showDeleted.addEventListener("change", renderRdoList);
  }
  if (rdoUI.btnExcluir) {
    rdoUI.btnExcluir.addEventListener("click", abrirRdoDeleteModal);
  }
  if (rdoUI.btnDeleteCancel) {
    rdoUI.btnDeleteCancel.addEventListener("click", fecharRdoDeleteModal);
  }
  if (rdoUI.btnDeleteConfirm) {
    rdoUI.btnDeleteConfirm.addEventListener("click", confirmarDeleteRdo);
  }
  if (rdoUI.deleteModal) {
    const btnClose = rdoUI.deleteModal.querySelector("[data-rdo-delete-close]");
    if (btnClose) {
      btnClose.addEventListener("click", fecharRdoDeleteModal);
    }
  }
  if (rdoUI.clima) {
    rdoUI.clima.addEventListener("change", atualizarClimaOutroRdo);
  }
  if (rdoUI.qtPessoas) {
    rdoUI.qtPessoas.addEventListener("input", () => {
      rdoUI.qtPessoas.dataset.auto = "manual";
    });
  }
  const atualizarSugestao = () => atualizarSugestaoQtPessoas();
  if (rdoUI.data) {
    rdoUI.data.addEventListener("change", atualizarSugestao);
  }
  if (rdoUI.subestacao) {
    rdoUI.subestacao.addEventListener("change", atualizarSugestao);
  }
  if (rdoUI.categoria) {
    rdoUI.categoria.addEventListener("change", atualizarSugestao);
  }
  if (rdoUI.prioridade) {
    rdoUI.prioridade.addEventListener("change", atualizarSugestao);
  }
  if (rdoUI.usuario) {
    rdoUI.usuario.addEventListener("change", atualizarSugestao);
  }
  if (rdoUI.list) {
    rdoUI.list.addEventListener("click", async (event) => {
      const botao = event.target.closest("button[data-action]");
      if (!botao) {
        return;
      }
      const item = botao.closest("[data-rdo-id]");
      if (!item) {
        return;
      }
      const snapshot = rdoSnapshots.find((registro) => registro.id === item.dataset.rdoId);
      if (!snapshot) {
        return;
      }
      if (botao.dataset.action === "rdo-open") {
        abrirRdoModal(snapshot);
      }
      if (botao.dataset.action === "rdo-pdf") {
        await exportarRdoPdf(snapshot);
      }
    });
    rdoUI.list.addEventListener("change", (event) => {
      const checkbox = event.target.closest("input[data-rdo-select]");
      if (!checkbox) {
        return;
      }
      const id = checkbox.dataset.rdoSelect;
      if (!id) {
        return;
      }
      if (checkbox.checked) {
        rdoSelection.add(id);
      } else {
        rdoSelection.delete(id);
      }
      atualizarRdoExcluirState();
    });
  }
}

function renderRdoList() {
  if (!rdoUI.list || !rdoUI.empty) {
    return;
  }
  rdoUI.list.innerHTML = "";
  const showDeleted = rdoUI.showDeleted ? rdoUI.showDeleted.checked : false;
  const lista = Array.isArray(rdoSnapshots)
    ? rdoSnapshots.filter((item) => showDeleted || !item.deletedAt)
    : [];
  lista.sort((a, b) => (getTimeValue(b.createdAt) || 0) - (getTimeValue(a.createdAt) || 0));
  rdoSelection.forEach((id) => {
    if (!lista.some((item) => item.id === id)) {
      rdoSelection.delete(id);
    }
  });
  if (!lista.length) {
    rdoUI.empty.hidden = false;
    atualizarRdoExcluirState();
    return;
  }
  rdoUI.empty.hidden = true;
  lista.forEach((snapshot) => {
    const card = document.createElement("div");
    card.className = "report-item rdo-item";
    card.dataset.rdoId = snapshot.id;
    if (snapshot.deletedAt) {
      card.classList.add("rdo-item--deleted");
    }

    const selectWrap = document.createElement("div");
    selectWrap.className = "rdo-select";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.rdoSelect = snapshot.id;
    checkbox.checked = rdoSelection.has(snapshot.id);
    checkbox.disabled = Boolean(snapshot.deletedAt);
    selectWrap.append(checkbox);

    const info = document.createElement("div");
    const titulo = document.createElement("strong");
    const dataParsed = snapshot.rdoDate ? parseDate(snapshot.rdoDate) : null;
    const dataLabel = dataParsed ? formatDate(dataParsed) : "-";
    titulo.textContent = `RDO ${dataLabel}`;
    const meta = document.createElement("p");
    meta.className = "meta";
    const emitidoDate = snapshot.createdAt ? parseTimestamp(snapshot.createdAt) : null;
    const emitidoEm = emitidoDate ? formatDateTime(emitidoDate) : "-";
    const emitidoPor = snapshot.createdBy ? getUserLabel(snapshot.createdBy) : "Sistema";
    const itensCount = snapshot.itens ? snapshot.itens.length : 0;
    const deletedInfo = snapshot.deletedAt
      ? " | Excluido"
      : "";
    meta.textContent = `Emitido por ${emitidoPor} em ${emitidoEm} | Itens: ${itensCount}${deletedInfo}`;
    info.append(titulo, meta);

    const actions = document.createElement("div");
    actions.className = "report-actions";
    const btnAbrir = document.createElement("button");
    btnAbrir.type = "button";
    btnAbrir.className = "btn btn--ghost btn--small";
    btnAbrir.dataset.action = "rdo-open";
    btnAbrir.textContent = "Abrir";
    const btnPdf = document.createElement("button");
    btnPdf.type = "button";
    btnPdf.className = "btn btn--primary btn--small";
    btnPdf.dataset.action = "rdo-pdf";
    btnPdf.textContent = "Exportar PDF";
    if (snapshot.deletedAt) {
      btnPdf.disabled = true;
    }
    actions.append(btnAbrir, btnPdf);

    card.append(selectWrap, info, actions);
    rdoUI.list.append(card);
  });
  atualizarRdoExcluirState();
}

function atualizarRdoExcluirState() {
  if (!rdoUI.btnExcluir) {
    return;
  }
  rdoUI.btnExcluir.disabled = rdoSelection.size === 0;
}

function abrirRdoDeleteModal() {
  if (!rdoUI.deleteModal) {
    return;
  }
  if (rdoSelection.size === 0) {
    return;
  }
  if (rdoUI.deleteReason) {
    rdoUI.deleteReason.value = "";
  }
  if (rdoUI.deleteMensagem) {
    rdoUI.deleteMensagem.textContent = "";
    rdoUI.deleteMensagem.classList.remove("mensagem--erro");
  }
  rdoUI.deleteModal.hidden = false;
}

function fecharRdoDeleteModal() {
  if (!rdoUI.deleteModal) {
    return;
  }
  rdoUI.deleteModal.hidden = true;
}

function confirmarDeleteRdo() {
  if (!rdoUI.deleteReason) {
    return;
  }
  const motivo = rdoUI.deleteReason.value.trim();
  if (!motivo) {
    if (rdoUI.deleteMensagem) {
      rdoUI.deleteMensagem.textContent = "Informe a justificativa.";
      rdoUI.deleteMensagem.classList.add("mensagem--erro");
    }
    return;
  }
  const agoraIso = toIsoUtc(new Date());
  const userId = currentUser ? currentUser.id : SYSTEM_USER_ID;
  const selecionados = new Set(rdoSelection);
  rdoSnapshots = rdoSnapshots.map((snapshot) => {
    if (!selecionados.has(snapshot.id)) {
      return snapshot;
    }
    const atualizado = {
      ...snapshot,
      deletedAt: agoraIso,
      deletedBy: userId,
      deleteReason: motivo,
    };
    logAction(
      "rdo_delete",
      { id: `rdo:${snapshot.id}`, titulo: `RDO ${snapshot.rdoDate || ""}` },
      {
        rdoId: snapshot.id,
        rdoDate: snapshot.rdoDate || "",
        motivo,
        resumo: "RDO excluido.",
      },
      userId
    );
    return atualizado;
  });
  salvarRdoSnapshots(rdoSnapshots);
  rdoSelection.clear();
  fecharRdoDeleteModal();
  renderRdoList();
}

function abrirRdoModal(snapshot) {
  if (!rdoUI.modal) {
    return;
  }
  atualizarFiltrosRdo(manutencoes);
  const hoje = formatDateISO(new Date());
  const isReadOnly = Boolean(snapshot);
  rdoUI.modal.dataset.readonly = isReadOnly ? "true" : "false";
  rdoPreviewSnapshot = snapshot || null;
  if (rdoUI.data) {
    rdoUI.data.value = snapshot && snapshot.rdoDate ? snapshot.rdoDate : hoje;
  }
  if (rdoUI.subestacao) {
    rdoUI.subestacao.value = snapshot && snapshot.filtros ? snapshot.filtros.subestacao || "" : "";
  }
  if (rdoUI.categoria) {
    rdoUI.categoria.value = snapshot && snapshot.filtros ? snapshot.filtros.categoria || "" : "";
  }
  if (rdoUI.prioridade) {
    rdoUI.prioridade.value = snapshot && snapshot.filtros ? snapshot.filtros.prioridade || "" : "";
  }
  if (rdoUI.usuario) {
    rdoUI.usuario.value = snapshot && snapshot.filtros ? snapshot.filtros.usuario || "" : "";
  }
  if (rdoUI.registro) {
    rdoUI.registro.value = snapshot && snapshot.registroGerencial ? snapshot.registroGerencial : "";
  }
  if (rdoUI.limite) {
    rdoUI.limite.value =
      snapshot && snapshot.limiteEvidencias ? String(snapshot.limiteEvidencias) : "16";
  }
  const manual = snapshot && snapshot.manual ? snapshot.manual : {};
  if (rdoUI.condutor) {
    rdoUI.condutor.value = manual.condutor || "";
  }
  if (rdoUI.kmInicial) {
    rdoUI.kmInicial.value = manual.kmInicial || "";
  }
  if (rdoUI.kmFinal) {
    rdoUI.kmFinal.value = manual.kmFinal || "";
  }
  if (rdoUI.qtPessoas) {
    rdoUI.qtPessoas.value = manual.qtPessoas || "";
    rdoUI.qtPessoas.dataset.auto = manual.qtPessoas ? "manual" : "auto";
  }
  if (rdoUI.clima) {
    rdoUI.clima.value = manual.clima || "SOL";
  }
  if (rdoUI.climaOutro) {
    rdoUI.climaOutro.value = manual.climaOutro || "";
  }
  if (rdoUI.incidente) {
    rdoUI.incidente.value = manual.incidente || "NAO";
  }
  if (rdoUI.bloqueio) {
    rdoUI.bloqueio.value = manual.bloqueio || "N/A";
  }
  if (rdoUI.local) {
    rdoUI.local.value = manual.local || "LZC-BOS2";
  }
  if (rdoUI.numeroSi) {
    rdoUI.numeroSi.value = manual.numeroSi || "";
  }
  if (rdoUI.numeroSgi) {
    rdoUI.numeroSgi.value = manual.numeroSgi || "";
  }
  atualizarClimaOutroRdo();
  atualizarSugestaoQtPessoas();
  setRdoReadOnly(isReadOnly);
  if (rdoUI.previewBody) {
    rdoUI.previewBody.innerHTML = "";
  }
  if (snapshot) {
    renderRdoPreview(snapshot);
  } else if (rdoUI.preview) {
    rdoUI.preview.hidden = true;
  }
  if (rdoUI.btnExportar) {
    rdoUI.btnExportar.disabled = Boolean(snapshot && snapshot.deletedAt);
  }
  mostrarMensagemRdo(isReadOnly ? "Snapshot somente leitura." : "");
  rdoUI.modal.hidden = false;
}

function fecharRdoModal() {
  if (!rdoUI.modal) {
    return;
  }
  rdoUI.modal.hidden = true;
  rdoPreviewSnapshot = null;
}

function mostrarMensagemRdo(texto, erro = false) {
  if (!rdoUI.mensagem) {
    return;
  }
  rdoUI.mensagem.textContent = texto;
  rdoUI.mensagem.classList.toggle("mensagem--erro", erro);
}

function setRdoReadOnly(readOnly) {
  const campos = [
    rdoUI.data,
    rdoUI.subestacao,
    rdoUI.categoria,
    rdoUI.prioridade,
    rdoUI.usuario,
    rdoUI.registro,
    rdoUI.limite,
    rdoUI.condutor,
    rdoUI.kmInicial,
    rdoUI.kmFinal,
    rdoUI.qtPessoas,
    rdoUI.clima,
    rdoUI.climaOutro,
    rdoUI.incidente,
    rdoUI.bloqueio,
    rdoUI.local,
    rdoUI.numeroSi,
    rdoUI.numeroSgi,
  ];
  campos.forEach((campo) => {
    if (campo) {
      campo.disabled = readOnly;
    }
  });
  if (rdoUI.btnPreview) {
    rdoUI.btnPreview.hidden = readOnly;
  }
}

function atualizarClimaOutroRdo() {
  if (!rdoUI.clima || !rdoUI.climaOutroField) {
    return;
  }
  const isOutro = rdoUI.clima.value === "OUTRO";
  rdoUI.climaOutroField.hidden = !isOutro;
  if (!isOutro && rdoUI.climaOutro) {
    rdoUI.climaOutro.value = "";
  }
}

function coletarFiltrosRdo() {
  return {
    subestacao: rdoUI.subestacao ? rdoUI.subestacao.value : "",
    categoria: rdoUI.categoria ? rdoUI.categoria.value : "",
    prioridade: rdoUI.prioridade ? rdoUI.prioridade.value : "",
    usuario: rdoUI.usuario ? rdoUI.usuario.value : "",
  };
}

function coletarManualRdo() {
  const clima = rdoUI.clima ? rdoUI.clima.value : "";
  return {
    condutor: rdoUI.condutor ? rdoUI.condutor.value.trim() : "",
    kmInicial: rdoUI.kmInicial ? rdoUI.kmInicial.value.trim() : "",
    kmFinal: rdoUI.kmFinal ? rdoUI.kmFinal.value.trim() : "",
    qtPessoas: rdoUI.qtPessoas ? rdoUI.qtPessoas.value.trim() : "",
    clima,
    climaOutro: rdoUI.climaOutro ? rdoUI.climaOutro.value.trim() : "",
    incidente: rdoUI.incidente ? rdoUI.incidente.value : "",
    bloqueio: rdoUI.bloqueio ? rdoUI.bloqueio.value : "",
    local: rdoUI.local ? rdoUI.local.value : "",
    numeroSi: rdoUI.numeroSi ? rdoUI.numeroSi.value.trim() : "",
    numeroSgi: rdoUI.numeroSgi ? rdoUI.numeroSgi.value.trim() : "",
  };
}

function calcularSugestaoQtPessoas(itens) {
  const participantes = new Set();
  itens.forEach((item) => {
    const liberacao = getLiberacao(item) || {};
    const ids = Array.isArray(liberacao.participantes) ? liberacao.participantes : [];
    ids.forEach((id) => {
      const label = getUserLabel(id) || id;
      if (label) {
        participantes.add(label);
      }
    });
    if (!ids.length && item.participantes) {
      if (Array.isArray(item.participantes)) {
        item.participantes.forEach((p) => participantes.add(p));
      } else if (typeof item.participantes === "string") {
        item.participantes
          .split(/[;,]/)
          .map((p) => p.trim())
          .filter(Boolean)
          .forEach((p) => participantes.add(p));
      }
    }
  });
  return participantes.size;
}

function atualizarSugestaoQtPessoas() {
  if (!rdoUI.qtPessoas || !rdoUI.data) {
    return;
  }
  const dataStr = rdoUI.data.value || formatDateISO(new Date());
  const filtros = coletarFiltrosRdo();
  const itensBase = filtrarItensRdo(dataStr, filtros);
  const sugestao = calcularSugestaoQtPessoas(itensBase);
  const auto = rdoUI.qtPessoas.dataset.auto !== "manual";
  if (!rdoUI.qtPessoas.value || auto) {
    rdoUI.qtPessoas.value = sugestao ? String(sugestao) : "";
    rdoUI.qtPessoas.dataset.auto = "auto";
  }
}

function atualizarFiltrosRdo(baseItems) {
  if (!rdoUI.subestacao && !rdoUI.categoria && !rdoUI.prioridade && !rdoUI.usuario) {
    return;
  }
  const subestacoes = Array.from(
    new Set(
      baseItems
        .map((item) => getItemSubestacao(item))
        .filter(Boolean)
        .concat(SUBESTACOES)
    )
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const categorias = Array.from(
    new Set(baseItems.map((item) => getItemCategoria(item)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const prioridades = Array.from(
    new Set(baseItems.map((item) => getItemPrioridade(item)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  atualizarSelectKpi(rdoUI.subestacao, subestacoes, "Todas");
  atualizarSelectKpi(rdoUI.categoria, categorias, "Todas");
  atualizarSelectKpi(rdoUI.prioridade, prioridades, "Todas");

  if (rdoUI.usuario) {
    const atual = rdoUI.usuario.value;
    const usuariosBase = baseItems
      .map((item) => getExecutadoPorId(item))
      .filter(Boolean)
      .concat(users.map((user) => user.id));
    const usuarios = Array.from(new Set(usuariosBase)).sort((a, b) =>
      getUserLabel(a).localeCompare(getUserLabel(b), "pt-BR")
    );
    rdoUI.usuario.innerHTML = "";
    const optionAll = document.createElement("option");
    optionAll.value = "";
    optionAll.textContent = "Todos";
    rdoUI.usuario.append(optionAll);
    usuarios.forEach((id) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = getUserLabel(id) || id;
      rdoUI.usuario.append(option);
    });
    if (atual && Array.from(rdoUI.usuario.options).some((opt) => opt.value === atual)) {
      rdoUI.usuario.value = atual;
    }
  }
}

function getRdoDateRange(dataStr) {
  const base = dataStr ? parseDate(dataStr) : null;
  const inicio = startOfDay(base || new Date());
  const fim = addDays(inicio, 1);
  return { inicio, fim };
}

function isDateInRange(date, inicio, fim) {
  if (!date) {
    return false;
  }
  const time = date.getTime();
  return time >= inicio.getTime() && time < fim.getTime();
}

function filtrarItensRdo(dataStr, filtros) {
  const range = getRdoDateRange(dataStr);
  return manutencoes.filter((item) => {
    const inicio = getItemInicioExecucaoDate(item);
    const fim = getItemFimExecucaoDate(item);
    const conclusao = getItemConclusaoDate(item);
    const entrou =
      isDateInRange(inicio, range.inicio, range.fim) ||
      isDateInRange(fim, range.inicio, range.fim) ||
      isDateInRange(conclusao, range.inicio, range.fim);
    if (!entrou) {
      return false;
    }
    if (filtros.subestacao && getItemSubestacao(item) !== filtros.subestacao) {
      return false;
    }
    if (filtros.categoria && getItemCategoria(item) !== filtros.categoria) {
      return false;
    }
    if (filtros.prioridade && getItemPrioridade(item) !== filtros.prioridade) {
      return false;
    }
    if (filtros.usuario && getExecutadoPorId(item) !== filtros.usuario) {
      return false;
    }
    return true;
  });
}

function normalizarStatusRdo(valor) {
  if (!valor) {
    return { key: "indefinido", label: "-" };
  }
  const key = String(valor).toLowerCase();
  const label = STATUS_LABELS[key] || (key === "cancelada" ? "Cancelada" : String(valor));
  return { key, label };
}

function getItemDescricaoRdo(item) {
  const registro = item && item.registroExecucao ? item.registroExecucao.comentario : "";
  const conclusao = item && item.conclusao ? item.conclusao.comentario : "";
  return registro || conclusao || item.observacao || "";
}

function getItemObsExecucaoRdo(item) {
  const registro = item && item.registroExecucao ? item.registroExecucao.observacaoExecucao : "";
  const conclusao = item && item.conclusao ? item.conclusao.observacaoExecucao : "";
  return registro || conclusao || "";
}

function getResultadoLabelRdo(item) {
  const registro = item && item.registroExecucao ? item.registroExecucao.resultado : "";
  const conclusao = item && item.conclusao ? item.conclusao.resultado : "";
  const resultado = conclusao || registro;
  return resultado ? RESULTADO_LABELS[resultado] || resultado : "";
}

function getResponsavelRdo(item) {
  const id = getExecutadoPorId(item) || item.doneBy || item.createdBy || "";
  return id ? getUserLabel(id) : "";
}

function getDocsStatusRdo(item) {
  const docs = getItemDocs(item);
  const critico = isItemCritico(item);
  const status = {};
  DOC_KEYS.forEach((key) => {
    if (key === "pt" && !critico) {
      status[key] = "N/A";
      return;
    }
    status[key] = docs && docs[key] ? "OK" : "Pendente";
  });
  return status;
}

function buildDocsResumoRdo(status) {
  return DOC_KEYS.map((key) => {
    const label = DOC_LABELS[key] || key.toUpperCase();
    const valor = status[key] || "Pendente";
    return `${label} ${valor}`;
  }).join(" | ");
}

function buildDocsChipsHtml(status) {
  if (!status) {
    return `<span class="doc-chip doc-chip--na">Docs N/A</span>`;
  }
  return DOC_KEYS.map((key) => {
    const label = DOC_LABELS[key] || key.toUpperCase();
    const valor = status[key] || "Pendente";
    const classe =
      valor === "OK" ? "doc-chip--ok" : valor === "N/A" ? "doc-chip--na" : "doc-chip--pendente";
    return `<span class="doc-chip ${classe}">${escapeHtml(`${label} ${valor}`)}</span>`;
  }).join("");
}

function isImageEvidence(evidencia) {
  if (!evidencia) {
    return false;
  }
  const type = evidencia.type || evidencia.mime || "";
  if (type && type.startsWith("image/")) {
    return true;
  }
  const dataUrl = evidencia.dataUrl || evidencia.url || "";
  return dataUrl.startsWith("data:image/");
}

function blobToDataUrl(blob) {
  return new Promise((resolve) => {
    if (!blob) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = () => resolve("");
    reader.readAsDataURL(blob);
  });
}

async function getEvidenceDataUrl(evidencia) {
  if (!evidencia) {
    return "";
  }
  const dataUrl = evidencia.dataUrl || evidencia.url || "";
  if (dataUrl.startsWith("data:")) {
    return dataUrl;
  }
  if (!dataUrl) {
    return "";
  }
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch (error) {
    return "";
  }
}

async function montarEvidenciasRdo(itens, limite) {
  const lista = [];
  const naoImagem = [];
  let total = 0;
  for (const item of itens) {
    const evidencias =
      item && item.conclusao && Array.isArray(item.conclusao.evidencias)
        ? item.conclusao.evidencias
        : [];
    const dataRef =
      getItemFimExecucaoDate(item) ||
      getItemInicioExecucaoDate(item) ||
      getItemConclusaoDate(item);
    const dataHora = dataRef ? formatDateTime(dataRef) : "-";
    const responsavel = getResponsavelRdo(item) || "-";
    for (const evidencia of evidencias) {
      const nome = evidencia.nome || evidencia.name || "Arquivo";
      if (!isImageEvidence(evidencia)) {
        naoImagem.push({
          nome,
          itemTitulo: item.titulo || "-",
        });
        continue;
      }
      total += 1;
      if (lista.length >= limite) {
        continue;
      }
      const dataUrl = await getEvidenceDataUrl(evidencia);
      if (!dataUrl) {
        continue;
      }
      lista.push({
        dataUrl,
        nome,
        itemId: item.id,
        itemTitulo: item.titulo || "-",
        dataHora,
        responsavel,
      });
    }
  }
  return { lista, total, naoImagem };
}

async function buscarLogoRdo(itens) {
  const regex = /ENGELMIG|LOGO/i;
  for (const item of itens) {
    const evidencias =
      item && item.conclusao && Array.isArray(item.conclusao.evidencias)
        ? item.conclusao.evidencias
        : [];
    for (const evidencia of evidencias) {
      const nome = evidencia.nome || evidencia.name || "";
      if (!regex.test(nome)) {
        continue;
      }
      const dataUrl = await getEvidenceDataUrl(evidencia);
      if (dataUrl) {
        return dataUrl;
      }
    }
  }
  return "";
}

function mapItemRdo(item) {
  const statusInfo = normalizarStatusRdo(item.status);
  const inicio = getItemInicioExecucaoDate(item);
  const fim = getItemFimExecucaoDate(item) || getItemConclusaoDate(item);
  const liberacao = getLiberacao(item) || {};
  const participantes = Array.isArray(liberacao.participantes)
    ? liberacao.participantes
    : Array.isArray(item.participantes)
      ? item.participantes
      : [];
  const docsStatus = getDocsStatusRdo(item);
  const duracaoMin = Number.isFinite(item.conclusao && item.conclusao.duracaoMin)
    ? item.conclusao.duracaoMin
    : inicio && fim
      ? Math.max(0, Math.round((fim - inicio) / 60000))
      : null;
  const evidencias =
    item && item.conclusao && Array.isArray(item.conclusao.evidencias)
      ? item.conclusao.evidencias
      : [];
  const evidenciasCount = evidencias.filter((evidencia) => isImageEvidence(evidencia)).length;
  const evidenciasNaoImagem = evidencias
    .filter((evidencia) => !isImageEvidence(evidencia))
    .map((evidencia) => evidencia.nome || evidencia.name || "Arquivo");
  return {
    id: item.id,
    titulo: item.titulo || "-",
    subestacao: getItemSubestacao(item) || "-",
    categoria: getItemCategoria(item) || "",
    prioridade: getItemPrioridade(item) || "",
    statusKey: statusInfo.key,
    statusLabel: statusInfo.label,
    inicio: inicio ? toIsoUtc(inicio) : "",
    fim: fim ? toIsoUtc(fim) : "",
    duracaoMin,
    responsavel: getResponsavelRdo(item),
    participantes: getParticipantesLabel(participantes),
    descricao: getItemDescricaoRdo(item),
    observacaoExecucao: getItemObsExecucaoRdo(item),
    evidenciasCount,
    evidenciasNaoImagem,
    docsStatus,
    docsResumo: buildDocsResumoRdo(docsStatus),
    docsCompliance: getDocCompliance(item),
    resultadoLabel: getResultadoLabelRdo(item),
    critico: isItemCritico(item),
  };
}

function calcularMetricasRdo(itensBase, itensRdo, dataStr) {
  const baseDate = dataStr ? parseDate(dataStr) : null;
  const referencia = startOfDay(baseDate || new Date());
  const concluidas = itensRdo.filter((item) => item.statusKey === "concluida").length;
  const abertas = itensRdo.filter(
    (item) => item.statusKey !== "concluida" && item.statusKey !== "cancelada"
  ).length;
  const emExecucao = itensRdo.filter((item) =>
    ["em_execucao", "encerramento"].includes(item.statusKey)
  ).length;
  const overdue = itensBase.filter((item) => isItemOverdue(item, referencia)).length;
  const criticas = itensRdo.filter((item) => item.critico).length;
  const docsOk = itensRdo.filter((item) => item.docsCompliance === true).length;
  const docsTotal = itensRdo.filter((item) => item.docsCompliance !== null).length;
  const docsPercent = docsTotal ? Math.round((docsOk / docsTotal) * 100) : null;
  const tempoTotalMin = itensRdo.reduce(
    (acc, item) => acc + (Number.isFinite(item.duracaoMin) ? item.duracaoMin : 0),
    0
  );
  return {
    total: itensRdo.length,
    concluidas,
    abertas,
    emExecucao,
    overdue,
    criticas,
    docsOk,
    docsTotal,
    docsPercent,
    tempoTotalMin,
  };
}

function formatJanelaExecucaoRdo(inicioIso, fimIso) {
  const inicioDate = inicioIso ? parseTimestamp(inicioIso) : null;
  const fimDate = fimIso ? parseTimestamp(fimIso) : null;
  const inicio = inicioDate ? formatDateTime(inicioDate) : "";
  const fim = fimDate ? formatDateTime(fimDate) : "";
  if (inicio && fim) {
    return `A execucao ocorreu entre ${inicio} e ${fim}.`;
  }
  if (inicio) {
    return `Inicio registrado em ${inicio}. Fim sem registro no periodo.`;
  }
  if (fim) {
    return `Fim registrado em ${fim}. Inicio sem registro no periodo.`;
  }
  return "Sem registro de inicio e fim no periodo.";
}

function gerarTextoItemRdo(item) {
  const tipo = (item.categoria || "").trim().toLowerCase();
  const tipoLabel = tipo ? `manutencao ${tipo}` : "manutencao";
  const chave = item.id || item.titulo || "";
  const variante = Number.parseInt(hashString(chave).slice(0, 2), 16) % 3;
  const titulo = item.titulo || "atividade";
  const subestacao = item.subestacao || "subestacao nao informada";
  let abertura = `Durante o periodo, foi executada ${tipoLabel} em ${subestacao}.`;
  if (variante === 1) {
    abertura = `No periodo, a equipe realizou ${tipoLabel} em ${subestacao}, vinculada a ${titulo}.`;
  }
  if (variante === 2) {
    abertura = `Foi registrada ${tipoLabel} em ${subestacao} durante o periodo, referente a ${titulo}.`;
  }
  const descricao = item.descricao
    ? `Descricao tecnica: ${item.descricao}.`
    : "Sem registro de descricao tecnica no periodo.";
  const diagnostico = item.descricao
    ? `Diagnostico: ${item.descricao}.`
    : "Sem registro de diagnostico no periodo.";
  const acao = item.observacaoExecucao
    ? `Acao executada: ${item.observacaoExecucao}.`
    : "Sem registro de acao detalhada no periodo.";
  const janela = formatJanelaExecucaoRdo(item.inicio, item.fim);
  const responsavel = item.responsavel
    ? `Responsavel: ${item.responsavel}.`
    : "Sem registro de responsavel no periodo.";
  const participantes =
    item.participantes && item.participantes !== "-"
      ? `Participantes: ${item.participantes}.`
      : "Sem registro de participantes no periodo.";
  const evidencias = item.evidenciasCount
    ? `Foram registradas ${item.evidenciasCount} evidencias fotograficas.`
    : "Sem evidencias fotograficas registradas no periodo.";
  const docs = item.docsResumo
    ? `Documentacao registrada no sistema: ${item.docsResumo}.`
    : "Sem registro de documentacao no periodo.";
  const resultado = item.resultadoLabel ? `Resultado: ${item.resultadoLabel}.` : "";
  const status = item.statusLabel ? `Status final: ${item.statusLabel}.` : "Status final: -.";
  const criticidade = item.critico ? "Classificacao: critica." : "";
  const duracao =
    Number.isFinite(item.duracaoMin) && item.duracaoMin > 0
      ? `Tempo total de execucao: ${formatDuracaoMin(item.duracaoMin)}.`
      : "";

  if (["corretiva", "preditiva"].includes(tipo)) {
    return [
      abertura,
      diagnostico,
      acao,
      janela,
      responsavel,
      participantes,
      duracao,
      evidencias,
      docs,
      resultado,
      status,
      criticidade,
    ]
      .filter(Boolean)
      .join(" ");
  }

  const observacao = item.observacaoExecucao
    ? `Observacao de execucao: ${item.observacaoExecucao}.`
    : "Sem registro de observacoes adicionais no periodo.";
  return [
    abertura,
    descricao,
    janela,
    responsavel,
    participantes,
    duracao,
    evidencias,
    docs,
    resultado,
    status,
    criticidade,
    observacao,
  ]
    .filter(Boolean)
    .join(" ");
}

function gerarResumoDiaRdo(itensRdo, metricas) {
  if (!itensRdo.length) {
    return "Sem registro de atividades no periodo.";
  }
  const parts = [];
  parts.push(
    `Foram registradas ${metricas.total} atividades no periodo, com ${metricas.concluidas} concluidas e ${metricas.abertas} em andamento.`
  );
  const subestacoes = itensRdo.reduce((acc, item) => {
    const chave = item.subestacao || "";
    if (!chave || chave === "-") {
      return acc;
    }
    acc[chave] = (acc[chave] || 0) + 1;
    return acc;
  }, {});
  const topSubs = Object.keys(subestacoes)
    .map((key) => ({ key, total: subestacoes[key] }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 2);
  if (topSubs.length) {
    parts.push(
      `Subestacoes com maior volume: ${topSubs
        .map((item) => `${item.key} (${item.total})`)
        .join(", ")}.`
    );
  }
  const corretivas = itensRdo.filter(
    (item) => (item.categoria || "").toLowerCase() === "corretiva"
  ).length;
  if (corretivas || metricas.criticas) {
    parts.push(
      `Destaques: ${corretivas} corretivas e ${metricas.criticas} criticas no periodo.`
    );
  }
  const docsPendentes = metricas.docsTotal - metricas.docsOk;
  if (metricas.overdue || docsPendentes > 0) {
    parts.push(
      `Pendencias: ${metricas.overdue} overdue e ${docsPendentes} atividades com documentacao pendente.`
    );
  } else {
    parts.push("Sem pendencias criticas no periodo.");
  }
  return parts.join(" ");
}

function gerarNarrativaDiaRdo(itensRdo, metricas) {
  if (!itensRdo.length) {
    return "Sem registro de execucoes no periodo.";
  }
  const parts = [];
  const tempoTotal =
    metricas.tempoTotalMin && metricas.tempoTotalMin > 0
      ? formatDuracaoMin(metricas.tempoTotalMin)
      : "sem registro";
  parts.push(`Tempo total de execucao no periodo: ${tempoTotal}.`);
  const corretivas = itensRdo.filter(
    (item) => (item.categoria || "").toLowerCase() === "corretiva"
  ).length;
  const preditivas = itensRdo.filter(
    (item) => (item.categoria || "").toLowerCase() === "preditiva"
  ).length;
  if (corretivas || preditivas || metricas.criticas) {
    parts.push(
      `Atividades criticas: ${metricas.criticas}. Corretivas: ${corretivas}. Preditivas: ${preditivas}.`
    );
  }
  if (metricas.docsTotal) {
    parts.push(
      `Compliance documental: ${metricas.docsPercent}% (${metricas.docsOk}/${metricas.docsTotal}).`
    );
  } else {
    parts.push("Sem base documental consolidada no periodo.");
  }
  const ocorrencias = itensRdo.filter(
    (item) => item.descricao || item.observacaoExecucao
  );
  if (ocorrencias.length) {
    const destaques = ocorrencias.slice(0, 2).map((item) => item.titulo).join(", ");
    parts.push(
      `Observacoes tecnicas registradas em ${ocorrencias.length} atividades${destaques ? `, destaque para: ${destaques}` : ""}.`
    );
  }
  if (metricas.overdue) {
    parts.push(`Permanecem ${metricas.overdue} itens overdue com necessidade de tratativa.`);
  } else {
    parts.push("Sem itens overdue registrados no periodo.");
  }
  return parts.join(" ");
}

function gerarDescricaoConsolidadaRdo(itensRdo, metricas) {
  if (!itensRdo.length) {
    return {
      resumo: "Sem registro de execucoes no periodo.",
      pontos: [],
    };
  }
  const resumo = `Foram registradas ${metricas.total} atividades no periodo, com ${metricas.concluidas} concluidas, ${metricas.emExecucao} em execucao e ${metricas.overdue} pendentes.`;
  const pontos = [];
  if (metricas.criticas) {
    pontos.push(`Atividades criticas: ${metricas.criticas}.`);
  }
  const corretivas = itensRdo.filter(
    (item) => (item.categoria || "").toLowerCase() === "corretiva"
  ).length;
  const preditivas = itensRdo.filter(
    (item) => (item.categoria || "").toLowerCase() === "preditiva"
  ).length;
  if (corretivas || preditivas) {
    pontos.push(`Corretivas: ${corretivas} | Preditivas: ${preditivas}.`);
  }
  const docsPendentes = itensRdo.filter((item) => item.docsCompliance === false).length;
  if (docsPendentes) {
    pontos.push(`Documentacao pendente em ${docsPendentes} atividade(s).`);
  }
  const observacoes = itensRdo
    .map((item) => {
      const texto = item.observacaoExecucao || item.descricao || "";
      if (!texto) {
        return null;
      }
      return `${item.titulo}: ${texto}`;
    })
    .filter(Boolean)
    .slice(0, 3);
  observacoes.forEach((texto) => {
    pontos.push(truncarTexto(texto, 140));
  });
  if (!pontos.length) {
    pontos.push("Sem apontamentos adicionais no periodo.");
  }
  return { resumo, pontos };
}

function truncarTexto(texto, limite) {
  if (!texto || texto.length <= limite) {
    return texto || "";
  }
  return `${texto.slice(0, limite - 1)}...`;
}

function escapeHtml(valor) {
  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hashString(valor) {
  const texto = String(valor || "");
  let hash = 0;
  for (let i = 0; i < texto.length; i += 1) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function salvarSnapshotRdo(snapshot) {
  if (!snapshot) {
    return;
  }
  const index = rdoSnapshots.findIndex((item) => item.id === snapshot.id);
  if (index >= 0) {
    rdoSnapshots[index] = snapshot;
  } else {
    rdoSnapshots = [snapshot, ...rdoSnapshots];
  }
  salvarRdoSnapshots(rdoSnapshots);
  renderRdoList();
}

async function gerarSnapshotRdo(persistir = false) {
  if (!rdoUI.data) {
    return null;
  }
  const dataStr = rdoUI.data.value || formatDateISO(new Date());
  const dataBase = parseDate(dataStr);
  if (!dataBase) {
    mostrarMensagemRdo("Data invalida.", true);
    return null;
  }
  const filtros = coletarFiltrosRdo();
  const manual = coletarManualRdo();
  const limite = rdoUI.limite ? Number(rdoUI.limite.value) || 8 : 8;
  const registroGerencial = rdoUI.registro ? rdoUI.registro.value.trim() : "";
  mostrarMensagemRdo("Gerando RDO...");
  const itensBase = filtrarItensRdo(dataStr, filtros);
  const itensOrdenados = itensBase.slice().sort((a, b) => {
    const dataA = getItemInicioExecucaoDate(a) || getItemConclusaoDate(a) || parseAnyDate(a.data);
    const dataB = getItemInicioExecucaoDate(b) || getItemConclusaoDate(b) || parseAnyDate(b.data);
    return (getTimeValue(dataB) || 0) - (getTimeValue(dataA) || 0);
  });
  const itensRdo = itensOrdenados.map((item) => mapItemRdo(item));
  itensRdo.forEach((item) => {
    item.texto = gerarTextoItemRdo(item);
  });
  const evidenciasInfo = await montarEvidenciasRdo(itensOrdenados, limite);
  const logoDataUrl = await buscarLogoRdo(itensOrdenados);
  const metricas = calcularMetricasRdo(itensOrdenados, itensRdo, dataStr);
  const resumoDia = gerarResumoDiaRdo(itensRdo, metricas);
  const narrativaDia = gerarNarrativaDiaRdo(itensRdo, metricas);
  const agora = new Date();
  const snapshot = {
    id: criarId(),
    hash: "",
    rdoDate: dataStr,
    filtros,
    manual,
    registroGerencial,
    limiteEvidencias: limite,
    createdAt: toIsoUtc(agora),
    createdBy: currentUser ? currentUser.id : "",
    itens: itensRdo,
    metricas,
    evidencias: evidenciasInfo.lista,
    evidenciasTotal: evidenciasInfo.total,
    evidenciasNaoImagem: evidenciasInfo.naoImagem,
    logoDataUrl,
    resumoDia,
    narrativaDia,
  };
  snapshot.hash = hashString(
    `${snapshot.id}|${snapshot.rdoDate}|${snapshot.itens.length}|${snapshot.createdAt}`
  );
  if (persistir) {
    salvarSnapshotRdo(snapshot);
  }
  mostrarMensagemRdo("");
  rdoPreviewSnapshot = snapshot;
  return snapshot;
}

function renderRdoPreview(snapshot) {
  if (!rdoUI.preview || !rdoUI.previewBody) {
    return;
  }
  rdoUI.previewBody.innerHTML = buildRdoHtml(snapshot);
  rdoUI.preview.hidden = false;
}

function buildRdoHtml(snapshot) {
  const dataParsed = snapshot.rdoDate ? parseDate(snapshot.rdoDate) : null;
  const dataLabel = dataParsed ? formatDate(dataParsed) : "-";
  const emitidoDate = snapshot.createdAt ? parseTimestamp(snapshot.createdAt) : null;
  const emitidoEm = emitidoDate ? formatDateTime(emitidoDate) : "-";
  const emitidoPor = snapshot.createdBy ? getUserLabel(snapshot.createdBy) : "Sistema";
  const hashShort = snapshot.hash ? snapshot.hash.slice(0, 8).toUpperCase() : "-";
  const tempoTotal =
    snapshot.metricas.tempoTotalMin && snapshot.metricas.tempoTotalMin > 0
      ? formatDuracaoMin(snapshot.metricas.tempoTotalMin)
      : "-";
  const docsPercent =
    snapshot.metricas.docsTotal && snapshot.metricas.docsPercent !== null
      ? `${snapshot.metricas.docsPercent}%`
      : "\u2014";
  const docsMeta = snapshot.metricas.docsTotal
    ? `${snapshot.metricas.docsOk}/${snapshot.metricas.docsTotal}`
    : "Sem base";
  const evidenciasLimitadas =
    snapshot.evidenciasTotal > snapshot.evidencias.length
      ? `Evidencias limitadas a ${snapshot.limiteEvidencias} no PDF.`
      : "";
  const logoHtml = `
    <img
      id="rdoEngelmigLogo"
      class="rdo-logo"
      src="./assets/engelmig-logo.png"
      alt="ENGELMIG"
      width="110"
      height="40"
      loading="eager"
    />
    <span id="rdoEngelmigFallback" class="rdo-logo-fallback">ENGELMIG</span>
  `;
  const manual = snapshot.manual || {};
  const projeto = snapshot.filtros && snapshot.filtros.subestacao ? snapshot.filtros.subestacao : RDO_PROJETO;
  const local = manual.local || "LZC-BOS2";
  const climaValor = manual.clima === "OUTRO" && manual.climaOutro
    ? `OUTRO - ${manual.climaOutro}`
    : manual.clima || "-";
  const descricaoConsolidada = gerarDescricaoConsolidadaRdo(snapshot.itens || [], snapshot.metricas);
  const rdoNumero = snapshot.id ? snapshot.id.slice(0, 6).toUpperCase() : "-";
  const resumoItens = [
    { label: "Atividades", value: snapshot.metricas.total },
    { label: "Concluidas", value: snapshot.metricas.concluidas },
    { label: "Em execucao", value: snapshot.metricas.emExecucao },
    { label: "Criticas", value: snapshot.metricas.criticas },
    { label: "Overdue", value: snapshot.metricas.overdue },
    { label: "Docs", value: docsPercent, meta: docsMeta },
    { label: "Tempo total", value: tempoTotal },
  ];
  const resumoOperacional = resumoItens
    .map((item) => {
      return `
        <div class="rdo-summary-item">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
          ${item.meta ? `<small>${escapeHtml(item.meta)}</small>` : ""}
        </div>
      `;
    })
    .join("");

  const rows = snapshot.itens
    .map((item) => {
      const statusClass = item.statusKey
        ? item.statusKey.replace(/[^a-z0-9]+/g, "_")
        : "default";
      const inicioDate = item.inicio ? parseTimestamp(item.inicio) : null;
      const fimDate = item.fim ? parseTimestamp(item.fim) : null;
      const inicio = inicioDate ? formatDateTime(inicioDate) : "-";
      const fim = fimDate ? formatDateTime(fimDate) : "-";
      return `
        <tr>
          <td title="${escapeHtml(item.titulo)}">${escapeHtml(item.titulo)}</td>
          <td>${escapeHtml(item.subestacao)}</td>
          <td class="rdo-table__status">
            <span class="status-badge status-badge--${statusClass}">${escapeHtml(item.statusLabel)}</span>
          </td>
          <td>${escapeHtml(inicio)}</td>
          <td>${escapeHtml(fim)}</td>
          <td>${escapeHtml(item.responsavel || "-")}</td>
        </tr>
      `;
    })
    .join("");

  const detalhes = snapshot.itens
    .map((item) => {
      const inicioDate = item.inicio ? parseTimestamp(item.inicio) : null;
      const fimDate = item.fim ? parseTimestamp(item.fim) : null;
      const inicio = inicioDate ? formatDateTime(inicioDate) : "-";
      const fim = fimDate ? formatDateTime(fimDate) : "-";
      const duracao = Number.isFinite(item.duracaoMin) ? formatDuracaoMin(item.duracaoMin) : "-";
      const minis = [
        `Inicio: ${inicio}`,
        `Fim: ${fim}`,
        `Duracao: ${duracao}`,
        item.responsavel ? `Responsavel: ${item.responsavel}` : "Responsavel: -",
        item.participantes && item.participantes !== "-"
          ? `Participantes: ${item.participantes}`
          : "Participantes: -",
        `Evidencias: ${item.evidenciasCount}`,
      ];
      return `
        <article class="rdo-item">
          <div class="rdo-item__head">
            <strong>${escapeHtml(item.titulo)}</strong>
            <span class="rdo-item__status">${escapeHtml(item.statusLabel)}</span>
          </div>
          <p>${escapeHtml(item.texto || "")}</p>
          <div class="rdo-mini">
            ${minis.map((val) => `<span>${escapeHtml(val)}</span>`).join("")}
          </div>
          <div class="rdo-docs">
            ${buildDocsChipsHtml(item.docsStatus)}
          </div>
          <p class="rdo-docs-note">Documentacao registrada no sistema: ${escapeHtml(
            item.docsResumo || "Sem registro"
          )}</p>
        </article>
      `;
    })
    .join("");

  const evidenciasHtml = snapshot.evidencias.length
    ? snapshot.evidencias
        .map((evidencia) => {
          const dataHora = evidencia.dataHora || "-";
          const responsavel = evidencia.responsavel || "-";
          const legenda = `${evidencia.itemTitulo} | ${dataHora} | ${responsavel}`;
          return `
            <figure class="rdo-evidencia">
              <img src="${evidencia.dataUrl}" alt="${escapeHtml(legenda)}" />
              <figcaption>${escapeHtml(legenda)}</figcaption>
            </figure>
          `;
        })
        .join("")
    : `<p class="empty-state">Sem evidencias fotograficas no periodo.</p>`;

  const naoImagemHtml = snapshot.evidenciasNaoImagem.length
    ? `
      <div class="rdo-naoimagem">
        <strong>Evidencias nao-imagem</strong>
        <ul>
          ${snapshot.evidenciasNaoImagem
            .map(
              (item) =>
                `<li>${escapeHtml(item.itemTitulo)} - ${escapeHtml(item.nome)}</li>`
            )
            .join("")}
        </ul>
      </div>
    `
    : "";

  return `
    <div class="rdo-doc">
      <header class="rdo-header">
        <div class="rdo-brand">
          ${logoHtml}
          <div>
            <span class="rdo-eyebrow">OPSCOPE</span>
            <h2 class="rdo-title">RELATORIO DE OPERACAO DIARIA - HV</h2>
            <p class="rdo-subtitle">Relatorio Diario de Operacao</p>
          </div>
        </div>
        <div class="rdo-meta">
          <span>RDO: ${escapeHtml(rdoNumero)} | Hash: ${escapeHtml(hashShort)}</span>
          <span>Data: ${escapeHtml(dataLabel)}</span>
          <span>Emitido por: ${escapeHtml(emitidoPor)}</span>
          <span>Emitido em: ${escapeHtml(emitidoEm)}</span>
        </div>
      </header>
      <div class="rdo-header-info">
        <div>
          <span>Projeto/Planta</span>
          <strong>${escapeHtml(projeto)}</strong>
        </div>
        <div>
          <span>Cliente</span>
          <strong>${escapeHtml(RDO_CLIENTE)}</strong>
        </div>
        <div>
          <span>Setor</span>
          <strong>${escapeHtml(RDO_SETOR)}</strong>
        </div>
        <div>
          <span>Local</span>
          <strong>${escapeHtml(local)}</strong>
        </div>
      </div>

      <section class="rdo-section rdo-summary">
        <h3>Resumo Executivo</h3>
        <p>${escapeHtml(snapshot.resumoDia || "")}</p>
        <div class="rdo-summary-grid">
          ${resumoOperacional}
        </div>
      </section>

      <section class="rdo-section rdo-block">
        <h3>Seguranca</h3>
        <div class="rdo-info-grid">
          <div>
            <span>Incidente/Acidente</span>
            <strong>${escapeHtml(manual.incidente || "-")}</strong>
          </div>
          <div>
            <span>Bloqueio Eletrico</span>
            <strong>${escapeHtml(manual.bloqueio || "-")}</strong>
          </div>
          <div>
            <span>Clima</span>
            <strong>${escapeHtml(climaValor)}</strong>
          </div>
        </div>
      </section>

      <section class="rdo-section rdo-block">
        <h3>Dados Operacionais</h3>
        <div class="rdo-info-grid">
          <div>
            <span>Condutor</span>
            <strong>${escapeHtml(manual.condutor || "-")}</strong>
          </div>
          <div>
            <span>KM inicial</span>
            <strong>${escapeHtml(manual.kmInicial || "-")}</strong>
          </div>
          <div>
            <span>KM final</span>
            <strong>${escapeHtml(manual.kmFinal || "-")}</strong>
          </div>
          <div>
            <span>Qt. pessoas</span>
            <strong>${escapeHtml(manual.qtPessoas || "-")}</strong>
          </div>
          <div>
            <span>N de SI</span>
            <strong>${escapeHtml(manual.numeroSi || "-")}</strong>
          </div>
          <div>
            <span>N de SGI</span>
            <strong>${escapeHtml(manual.numeroSgi || "-")}</strong>
          </div>
        </div>
      </section>

      <section class="rdo-section">
        <h3>Atividades do Dia</h3>
        <table class="rdo-table">
          <thead>
            <tr>
              <th>Atividade</th>
              <th>Subestacao</th>
              <th>Status</th>
              <th>Inicio</th>
              <th>Fim</th>
              <th>Responsavel</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="6">Sem itens no periodo.</td></tr>`}
          </tbody>
        </table>
      </section>

      <section class="rdo-section">
        <h3>Descricao Consolidada do Dia</h3>
        <p>${escapeHtml(descricaoConsolidada.resumo || "")}</p>
        <ul class="rdo-lista">
          ${descricaoConsolidada.pontos
            .map((ponto) => `<li>${escapeHtml(ponto)}</li>`)
            .join("")}
        </ul>
      </section>

      ${
        snapshot.registroGerencial
          ? `
        <section class="rdo-section rdo-note">
          <h3>Registro Gerencial do Dia</h3>
          <p>${escapeHtml(snapshot.registroGerencial)}</p>
        </section>
      `
          : ""
      }

      <section class="rdo-section">
        <h3>Detalhamento por Atividade</h3>
        <div class="rdo-items">
          ${detalhes || `<p class="empty-state">Sem itens no periodo.</p>`}
        </div>
      </section>

      <section class="rdo-section">
        <h3>Evidencias</h3>
        ${evidenciasLimitadas ? `<p class="hint">${escapeHtml(evidenciasLimitadas)}</p>` : ""}
        <div class="rdo-evidencias-grid">
          ${evidenciasHtml}
        </div>
        ${naoImagemHtml}
      </section>
    </div>
  `;
}

function buildRdoPrintHtml(snapshot, logoDataUrl = "") {
  const baseHref = window.location.href.split("#")[0];
  const estilos = `
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    body { font-family: "Trebuchet MS", Arial, sans-serif; color: #1f2a33; margin: 0; }
    h2, h3 { font-family: "Trebuchet MS", Arial, sans-serif; margin: 0 0 8px; }
    .rdo-doc { display: grid; gap: 18px; }
    .rdo-header { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 10px; border-bottom: 2px solid #d6d1c6; }
    .rdo-brand { display: flex; align-items: center; gap: 12px; }
    .rdo-logo { width: 72px; height: auto; object-fit: contain; }
    .rdo-logo-fallback { font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; display: none; }
    .rdo-header-info { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; font-size: 0.72rem; color: #425363; }
    .rdo-header-info span { display: block; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.55rem; }
    .rdo-header-info strong { font-size: 0.78rem; color: #1f2a33; }
    .rdo-eyebrow { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; }
    .rdo-title { font-size: 1.5rem; letter-spacing: 0.08em; text-transform: uppercase; }
    .rdo-subtitle { font-size: 0.9rem; color: #425363; margin-top: 4px; }
    .rdo-meta { font-size: 0.8rem; display: grid; gap: 4px; color: #425363; }
    .rdo-section { display: grid; gap: 10px; break-inside: avoid; page-break-inside: avoid; }
    .rdo-summary { background: #f8f6f1; border: 1px solid #d6d1c6; padding: 12px 14px; border-radius: 12px; }
    .rdo-block { border: 1px solid #d6d1c6; border-radius: 12px; padding: 10px 12px; background: #fff; }
    .rdo-summary-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 8px; }
    .rdo-summary-item { border: 1px solid #d6d1c6; border-radius: 10px; padding: 6px 8px; display: grid; gap: 2px; background: #fff; }
    .rdo-summary-item span { font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: #425363; }
    .rdo-summary-item strong { font-size: 0.9rem; }
    .rdo-summary-item small { font-size: 0.65rem; color: #425363; }
    .rdo-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; table-layout: fixed; }
    .rdo-table th, .rdo-table td { border-bottom: 1px solid #d6d1c6; padding: 6px 8px; }
    .rdo-table th { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; background: #f8f6f1; color: #425363; }
    .rdo-table td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .rdo-items { display: grid; gap: 10px; }
    .rdo-item { border: 1px solid #d6d1c6; border-radius: 12px; padding: 10px 12px; display: grid; gap: 8px; break-inside: avoid; }
    .rdo-item__head { display: flex; justify-content: space-between; gap: 12px; font-size: 0.8rem; color: #425363; }
    .rdo-mini { display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.72rem; color: #425363; }
    .rdo-docs { display: flex; flex-wrap: wrap; gap: 6px; }
    .rdo-docs-note { font-size: 0.72rem; color: #425363; }
    .rdo-note { border: 1px dashed #d6d1c6; border-radius: 12px; padding: 10px 12px; background: #fff; }
    .rdo-info-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 0.75rem; color: #425363; }
    .rdo-info-grid span { display: block; text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.55rem; }
    .rdo-info-grid strong { font-size: 0.8rem; color: #1f2a33; }
    .rdo-lista { margin: 0; padding-left: 18px; font-size: 0.8rem; color: #425363; }
    .doc-chip { border-radius: 999px; padding: 3px 8px; font-size: 0.6rem; border: 1px solid #d6d1c6; text-transform: uppercase; letter-spacing: 0.1em; }
    .doc-chip--ok { background: rgba(43, 122, 120, 0.18); color: #1f5759; border-color: rgba(43, 122, 120, 0.35); }
    .doc-chip--pendente { background: rgba(192, 84, 47, 0.18); color: #7a2b1e; border-color: rgba(192, 84, 47, 0.35); }
    .doc-chip--na { background: rgba(118, 130, 145, 0.2); color: #4b5966; border-color: rgba(118, 130, 145, 0.35); }
    .status-badge { display: inline-flex; align-items: center; justify-content: center; padding: 3px 6px; border-radius: 999px; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; }
    .status-badge--concluida { background: rgba(43, 122, 120, 0.18); color: #1f5759; }
    .status-badge--em_execucao { background: rgba(212, 106, 47, 0.18); color: #9f4b22; }
    .status-badge--backlog { background: rgba(176, 74, 38, 0.18); color: #7a2b1e; }
    .status-badge--cancelada { background: rgba(118, 130, 145, 0.2); color: #4b5966; }
    .rdo-evidencias-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .rdo-evidencia { border: 1px solid #d6d1c6; border-radius: 10px; overflow: hidden; }
    .rdo-evidencia img { width: 100%; height: auto; display: block; }
    .rdo-evidencia figcaption { padding: 6px 8px; font-size: 0.7rem; color: #425363; background: #f8f6f1; }
    .rdo-naoimagem ul { margin: 6px 0 0 18px; padding: 0; font-size: 0.75rem; color: #425363; }
  `;
  let body = buildRdoHtml(snapshot);
  if (logoDataUrl) {
    body = body.replace('src="./assets/engelmig-logo.png"', `src="${logoDataUrl}"`);
  }
  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>RDO ${escapeHtml(snapshot.rdoDate || "")}</title>
        <base href="${baseHref}" />
        <style>${estilos}</style>
      </head>
      <body>${body}</body>
    </html>
  `;
}

function waitForImages(doc) {
  const imagens = Array.from(doc.images || []);
  const pendentes = imagens.filter((img) => !img.complete);
  if (!pendentes.length) {
    return Promise.resolve();
  }
  return Promise.all(
    pendentes.map(
      (img) =>
        new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        })
    )
  );
}

function waitForRdoLogo(doc) {
  const img = doc.getElementById("rdoEngelmigLogo");
  const fallback = doc.getElementById("rdoEngelmigFallback");
  if (!img) {
    if (fallback) {
      fallback.style.display = "block";
    }
    return Promise.resolve(false);
  }
  if (img.complete && img.naturalWidth > 0) {
    if (fallback) {
      fallback.style.display = "none";
    }
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    let done = false;
    const finalizar = (ok) => {
      if (done) {
        return;
      }
      done = true;
      img.onload = null;
      img.onerror = null;
      clearTimeout(timer);
      if (!ok && fallback) {
        fallback.style.display = "block";
      }
      resolve(ok);
    };
    const timer = setTimeout(() => finalizar(false), 1500);
    img.onload = () => finalizar(true);
    img.onerror = () => finalizar(false);
  });
}

async function carregarLogoRdoDataUrl() {
  const logoPath = "./assets/engelmig-logo.png";
  const timeoutMs = 1500;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(logoPath, { cache: "no-cache", signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) {
      return "";
    }
    const blob = await response.blob();
    return await blobToDataUrl(blob);
  } catch (error) {
    return "";
  }
}

async function exportarRdoPdf(snapshot) {
  if (!snapshot) {
    return;
  }
  const logoDataUrl = await carregarLogoRdoDataUrl();
  const html = buildRdoPrintHtml(snapshot, logoDataUrl);
  const popup = window.open("", "_blank");
  if (!popup) {
    mostrarMensagemRdo("Popup bloqueado. Permita a abertura para exportar o PDF.", true);
    return;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  let printed = false;
  const tentarImprimir = async () => {
    if (printed) {
      return;
    }
    printed = true;
    await waitForRdoLogo(popup.document);
    await waitForImages(popup.document);
    popup.focus();
    popup.print();
  };
  popup.addEventListener("load", () => {
    tentarImprimir();
  });
  setTimeout(() => {
    tentarImprimir();
  }, 600);
}

function renderAuditoria() {
  if (!listaAuditoria || !auditVazio) {
    return;
  }
  listaAuditoria.innerHTML = "";
  const ordenadas = [...auditLog]
    .sort((a, b) => (getTimeValue(b.timestamp) || 0) - (getTimeValue(a.timestamp) || 0))
    .slice(0, 20);
  if (ordenadas.length === 0) {
    auditVazio.hidden = false;
    return;
  }
  auditVazio.hidden = true;
  ordenadas.forEach((entry) => {
    const item = document.createElement("div");
    item.className = "audit-item";

    const titulo = document.createElement("strong");
    const label = ACTION_LABELS[entry.action] || entry.action;
    const detalhe = entry.title ? ` - ${entry.title}` : "";
    titulo.textContent = `${label}${detalhe}`;

    const meta = document.createElement("small");
    const autor = getUserLabel(entry.userId);
    const dataEvento = parseTimestamp(entry.timestamp);
    meta.textContent = `${autor} - ${dataEvento ? formatDateTime(dataEvento) : "-"}`;

    item.append(titulo, meta);
    if (entry.detalhes && entry.detalhes.resumo) {
      const extra = document.createElement("small");
      extra.textContent = entry.detalhes.resumo;
      item.append(extra);
    }
    listaAuditoria.append(item);
  });
}

function renderKPIs() {
  if (!kpiTotal || !kpiConclusao || !kpiConcluidas || !kpiBacklog || !kpiPontual || !kpiAtraso) {
    return;
  }
  const total = manutencoes.length;
  const concluidas = manutencoes.filter((item) => item.status === "concluida");
  const backlog = manutencoes.filter((item) => item.status === "backlog");
  const hoje = startOfDay(new Date());

  const taxaConclusao = total ? Math.round((concluidas.length / total) * 100) : 0;
  const pontuais = concluidas.filter((item) => {
    const data = parseDate(item.data);
    const doneAt = parseTimestamp(item.doneAt);
    if (!data || !doneAt) {
      return false;
    }
    return startOfDay(doneAt) <= startOfDay(data);
  });
  const taxaPontual = concluidas.length
    ? Math.round((pontuais.length / concluidas.length) * 100)
    : 0;

  const atrasos = [];
  manutencoes.forEach((item) => {
    const data = parseDate(item.data);
    if (!data) {
      return;
    }
    if (item.status === "backlog") {
      const diff = diffInDays(data, hoje);
      if (diff > 0) {
        atrasos.push(diff);
      }
    }
    if (item.status === "concluida" && item.doneAt) {
      const doneAt = parseTimestamp(item.doneAt);
      const diff = doneAt ? diffInDays(data, startOfDay(doneAt)) : null;
      if (diff > 0) {
        atrasos.push(diff);
      }
    }
  });
  const mediaAtraso = atrasos.length
    ? Math.round(atrasos.reduce((acc, val) => acc + val, 0) / atrasos.length)
    : 0;

  kpiTotal.textContent = total;
  kpiConclusao.textContent = `${taxaConclusao}%`;
  kpiConcluidas.textContent = `${concluidas.length} concluidas`;
  kpiBacklog.textContent = backlog.length;
  kpiPontual.textContent = `${taxaPontual}%`;
  kpiAtraso.textContent = mediaAtraso;
}

function startOfWeek(date) {
  const inicio = startOfDay(date);
  const day = inicio.getDay();
  const diff = (day + 6) % 7;
  inicio.setDate(inicio.getDate() - diff);
  return inicio;
}

function addDays(date, days) {
  const copia = new Date(date);
  copia.setDate(copia.getDate() + days);
  return copia;
}

function inRange(date, start, end) {
  return date >= start && date <= end;
}

// KPI: tooltips
function buildKpiTooltip(titulo, formula, periodo) {
  return `O que e: ${titulo}\nComo calcula: ${formula}\nPeriodo: ${periodo}`;
}

function parseAnyDate(value) {
  if (!value && value !== 0) {
    return null;
  }
  const parsed = parseTimestamp(value);
  if (parsed) {
    return parsed;
  }
  if (typeof value === "string") {
    const byDate = parseDate(value);
    if (byDate) {
      return byDate;
    }
    const byDateTime = parseDateTimeInput(value);
    if (byDateTime) {
      return byDateTime;
    }
  }
  return null;
}

function pickItemValue(item, keys) {
  if (!item) {
    return null;
  }
  for (const key of keys) {
    const value = item[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return null;
}

function getItemCriacaoDate(item) {
  return parseAnyDate(pickItemValue(item, ["createdAt", "abertaEm", "criadaEm"]));
}

function getItemInicioExecucaoDate(item) {
  const direto = pickItemValue(item, ["executionStartedAt", "inicioExecucao", "inicio"]);
  const registro = item && item.registroExecucao ? item.registroExecucao.inicio : null;
  const conclusao = item && item.conclusao ? item.conclusao.inicio : null;
  return parseAnyDate(direto || registro || conclusao);
}

function getItemFimExecucaoDate(item) {
  const direto = pickItemValue(item, ["executionFinishedAt", "fimExecucao", "fim"]);
  const conclusao = item && item.conclusao ? item.conclusao.fim : null;
  return parseAnyDate(direto || conclusao);
}

function getItemConclusaoDate(item) {
  const direto = pickItemValue(item, ["doneAt", "concluidaEm", "executionFinishedAt"]);
  const conclusao = item && item.conclusao ? item.conclusao.fim : null;
  return parseAnyDate(direto || conclusao);
}

function getExecutadoPorId(item) {
  const direto = pickItemValue(item, ["executadaPor", "executionStartedBy", "doneBy"]);
  const registro = item && item.registroExecucao ? item.registroExecucao.executadoPor : null;
  const conclusao = item && item.conclusao ? item.conclusao.executadoPor : null;
  return direto || registro || conclusao || "";
}

function getItemSubestacao(item) {
  return pickItemValue(item, ["local", "subestacao"]) || "";
}

function getItemCategoria(item) {
  return pickItemValue(item, ["categoria"]) || "";
}

function getItemPrioridade(item) {
  return pickItemValue(item, ["prioridade"]) || "";
}

function isCriticoValor(valor) {
  if (valor === true) {
    return true;
  }
  if (valor === false || valor === null || valor === undefined) {
    return false;
  }
  if (typeof valor === "string") {
    const normalizado = valor.trim().toLowerCase();
    return ["sim", "s", "true", "critico"].includes(normalizado);
  }
  return false;
}

function isItemCritico(item) {
  if (item && item.liberacao && item.liberacao.critico !== undefined) {
    return Boolean(item.liberacao.critico);
  }
  const valor = pickItemValue(item, ["criticidade", "trabalhoCritico", "critico"]);
  return isCriticoValor(valor);
}

function getItemDocs(item) {
  if (!item) {
    return null;
  }
  if (item.liberacao && item.liberacao.documentos) {
    return item.liberacao.documentos;
  }
  return item.documentos || item.docs || null;
}

function getDocCompliance(item) {
  const docs = getItemDocs(item);
  if (!docs) {
    return null;
  }
  const obrigatorios = ["apr", "os", "pte"];
  if (isItemCritico(item)) {
    obrigatorios.push("pt");
  }
  return obrigatorios.every((key) => docs[key]);
}

function getItemReferenciaDate(item) {
  return (
    getItemConclusaoDate(item) ||
    getItemCriacaoDate(item) ||
    parseAnyDate(item ? item.data : null)
  );
}

function buildPeriodoJanela(periodoDias) {
  const hoje = startOfDay(new Date());
  const inicio = addDays(hoje, -(periodoDias - 1));
  const anteriorFim = addDays(inicio, -1);
  const anteriorInicio = addDays(anteriorFim, -(periodoDias - 1));
  return { inicio, fim: hoje, anteriorInicio, anteriorFim };
}

function aplicarFiltrosBase(items, filtros) {
  return items.filter((item) => {
    if (filtros.subestacao && getItemSubestacao(item) !== filtros.subestacao) {
      return false;
    }
    if (filtros.categoria && getItemCategoria(item) !== filtros.categoria) {
      return false;
    }
    if (filtros.prioridade && getItemPrioridade(item) !== filtros.prioridade) {
      return false;
    }
    return true;
  });
}

function aplicarFiltroPeriodo(items, janela) {
  return items.filter((item) => {
    const referencia = getItemReferenciaDate(item);
    if (!referencia) {
      return false;
    }
    const dia = startOfDay(referencia);
    return inRange(dia, janela.inicio, janela.fim);
  });
}

function isItemOverdue(item, hoje) {
  if (!item || item.status === "concluida") {
    return false;
  }
  const data = parseDate(item.data);
  if (!data) {
    return false;
  }
  return startOfDay(data) < hoje;
}

function isSlaCompliant(item) {
  const data = parseDate(item.data);
  const concluidaEm = getItemConclusaoDate(item);
  if (!data || !concluidaEm) {
    return null;
  }
  return startOfDay(concluidaEm) <= startOfDay(data);
}

// KPI: filtros globais
function getKpiFiltros() {
  const periodo = kpiPeriodo ? Number(kpiPeriodo.value) || 30 : 30;
  return {
    periodo,
    subestacao: kpiSubestacao ? kpiSubestacao.value : "",
    categoria: kpiCategoria ? kpiCategoria.value : "",
    prioridade: kpiPrioridade ? kpiPrioridade.value : "",
    usuario: kpiUsuarioFiltro ? kpiUsuarioFiltro.value : "",
  };
}

function atualizarSelectKpi(select, valores, labelPadrao) {
  if (!select) {
    return;
  }
  const atual = select.value;
  select.innerHTML = "";
  const optionAll = document.createElement("option");
  optionAll.value = "";
  optionAll.textContent = labelPadrao;
  select.append(optionAll);
  valores.forEach((valor) => {
    const option = document.createElement("option");
    option.value = valor;
    option.textContent = valor;
    select.append(option);
  });
  if (atual && Array.from(select.options).some((opt) => opt.value === atual)) {
    select.value = atual;
  }
}

function atualizarFiltrosKpi(baseItems) {
  const subestacoes = Array.from(
    new Set(
      baseItems
        .map((item) => getItemSubestacao(item))
        .filter(Boolean)
        .concat(SUBESTACOES)
    )
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const categorias = Array.from(
    new Set(baseItems.map((item) => getItemCategoria(item)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));
  const prioridades = Array.from(
    new Set(baseItems.map((item) => getItemPrioridade(item)).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "pt-BR"));

  atualizarSelectKpi(kpiSubestacao, subestacoes, "Todas");
  atualizarSelectKpi(kpiCategoria, categorias, "Todas");
  atualizarSelectKpi(kpiPrioridade, prioridades, "Todas");

  if (kpiUsuarioFiltro) {
    const atual = kpiUsuarioFiltro.value;
    const usuarios = Array.from(
      new Set(
        baseItems
          .map((item) => getExecutadoPorId(item))
          .filter(Boolean)
          .concat(users.map((user) => user.id))
      )
    )
      .map((id) => ({ id, label: getUserLabel(id) }))
      .sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
    kpiUsuarioFiltro.innerHTML = "";
    const optionAll = document.createElement("option");
    optionAll.value = "";
    optionAll.textContent = "Todos";
    kpiUsuarioFiltro.append(optionAll);
    usuarios.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = user.label;
      kpiUsuarioFiltro.append(option);
    });
    if (atual && Array.from(kpiUsuarioFiltro.options).some((opt) => opt.value === atual)) {
      kpiUsuarioFiltro.value = atual;
    }
  }
}

// KPI: calculo base
function calcularKpisBase(items) {
  const hoje = startOfDay(new Date());
  const concluidas = items.filter((item) => item.status === "concluida");
  const backlog = items.filter((item) => item.status === "backlog");
  const overdue = items.filter((item) => isItemOverdue(item, hoje));
  const criticosAbertos = items.filter(
    (item) => item.status !== "concluida" && isItemCritico(item)
  );

  const slaResultados = [];
  concluidas.forEach((item) => {
    const ok = isSlaCompliant(item);
    if (ok === null) {
      return;
    }
    slaResultados.push(ok);
  });
  const slaCompliance = slaResultados.length
    ? Math.round((slaResultados.filter(Boolean).length / slaResultados.length) * 100)
    : null;

  const leadTimes = concluidas
    .map((item) => {
      const criadoEm = getItemCriacaoDate(item);
      const concluidoEm = getItemConclusaoDate(item);
      if (!criadoEm || !concluidoEm) {
        return null;
      }
      return (concluidoEm - criadoEm) / DAY_MS;
    })
    .filter((valor) => Number.isFinite(valor));
  const leadTimeMedio = leadTimes.length
    ? leadTimes.reduce((acc, val) => acc + val, 0) / leadTimes.length
    : null;

  const mttrMinutos = concluidas
    .map((item) => {
      const inicio = getItemInicioExecucaoDate(item);
      const fim = getItemFimExecucaoDate(item);
      if (!inicio || !fim) {
        return null;
      }
      return (fim - inicio) / 60000;
    })
    .filter((valor) => Number.isFinite(valor));
  const mttrMedio = mttrMinutos.length
    ? mttrMinutos.reduce((acc, val) => acc + val, 0) / mttrMinutos.length
    : null;

  return {
    backlogTotal: backlog.length,
    overdueTotal: overdue.length,
    slaCompliance,
    leadTimeMedio,
    mttrMedio,
    criticosAbertos: criticosAbertos.length,
  };
}

function formatDuracaoKpi(minutos) {
  if (minutos === null || minutos === undefined || Number.isNaN(minutos)) {
    return "N/A";
  }
  const total = Math.max(0, Math.round(minutos));
  const horas = Math.floor(total / 60);
  const mins = total % 60;
  return `${horas}h ${mins}m`;
}

function formatKpiValor(valor, tipo) {
  if (valor === null || valor === undefined || Number.isNaN(valor)) {
    return "N/A";
  }
  if (tipo === "percent") {
    return `${Math.round(valor)}%`;
  }
  if (tipo === "days") {
    return `${valor.toFixed(1)} dias`;
  }
  if (tipo === "duration") {
    return formatDuracaoKpi(valor);
  }
  return String(Math.round(valor));
}

function formatKpiDelta(atual, anterior, tipo, periodoDias) {
  if (atual === null || anterior === null) {
    return "\u2014";
  }
  const diff = atual - anterior;
  if (tipo === "duration") {
    const texto = formatDuracaoKpi(Math.abs(diff));
    const sinal = diff > 0 ? "+" : diff < 0 ? "-" : "";
    return `${sinal}${texto} vs ${periodoDias}d`;
  }
  const textoBase = diff > 0 ? `+${diff}` : `${diff}`;
  if (tipo === "percent") {
    const texto = diff > 0 ? `+${Math.round(diff)}` : `${Math.round(diff)}`;
    return `${texto}pp vs ${periodoDias}d`;
  }
  if (tipo === "days") {
    const texto = diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
    return `${texto}d vs ${periodoDias}d`;
  }
  return `${textoBase} vs ${periodoDias}d`;
}

// KPI: renderizacao cards
function renderKpiCards(itens, itensAnterior, filtros) {
  if (!kpiCards) {
    return;
  }
  kpiCards.innerHTML = "";
  const atual = calcularKpisBase(itens);
  const anterior = calcularKpisBase(itensAnterior);
  const periodoLabel = `ultimos ${filtros.periodo} dias`;
  const cards = [
    {
      key: "backlog_total",
      label: "Backlog total",
      valor: atual.backlogTotal,
      delta: formatKpiDelta(
        atual.backlogTotal,
        anterior.backlogTotal,
        "count",
        filtros.periodo
      ),
      formato: "count",
      tooltip: buildKpiTooltip(
        "Backlog total",
        "Manutencoes com status backlog.",
        periodoLabel
      ),
    },
    {
      key: "overdue_total",
      label: "Overdue / Vencidas",
      valor: atual.overdueTotal,
      delta: formatKpiDelta(
        atual.overdueTotal,
        anterior.overdueTotal,
        "count",
        filtros.periodo
      ),
      formato: "count",
      tooltip: buildKpiTooltip(
        "Overdue",
        "Manutencoes abertas com data programada menor que hoje.",
        periodoLabel
      ),
    },
    {
      key: "sla_compliance",
      label: "SLA compliance",
      valor: atual.slaCompliance,
      delta: formatKpiDelta(
        atual.slaCompliance,
        anterior.slaCompliance,
        "percent",
        filtros.periodo
      ),
      formato: "percent",
      tooltip: buildKpiTooltip(
        "SLA compliance",
        "Concluidas no prazo / concluidas no periodo.",
        periodoLabel
      ),
    },
    {
      key: "lead_time",
      label: "Lead time medio",
      valor: atual.leadTimeMedio,
      delta: formatKpiDelta(
        atual.leadTimeMedio,
        anterior.leadTimeMedio,
        "days",
        filtros.periodo
      ),
      formato: "days",
      tooltip: buildKpiTooltip(
        "Lead time",
        "Conclusao - criacao (dias).",
        periodoLabel
      ),
    },
    {
      key: "mttr",
      label: "MTTR medio",
      valor: atual.mttrMedio,
      delta: formatKpiDelta(atual.mttrMedio, anterior.mttrMedio, "duration", filtros.periodo),
      formato: "duration",
      tooltip: buildKpiTooltip(
        "MTTR medio",
        "Fim da execucao - inicio da execucao.",
        periodoLabel
      ),
    },
    {
      key: "criticos_abertos",
      label: "Criticos em aberto",
      valor: atual.criticosAbertos,
      delta: formatKpiDelta(
        atual.criticosAbertos,
        anterior.criticosAbertos,
        "count",
        filtros.periodo
      ),
      formato: "count",
      tooltip: buildKpiTooltip(
        "Criticos em aberto",
        "Manutencoes criticas nao concluidas.",
        periodoLabel
      ),
    },
  ];

  cards.forEach((card) => {
    const item = document.createElement("div");
    item.className = "kpi-card kpi-card--metric";
    item.dataset.drilldown = card.key;
    item.style.cursor = "pointer";
    const head = document.createElement("div");
    head.className = "kpi-card__head";
    const label = document.createElement("span");
    label.className = "kpi-card__label";
    label.textContent = card.label;
    const info = document.createElement("span");
    info.className = "kpi-info";
    info.textContent = "\u24D8";
    info.setAttribute("aria-label", "Detalhes do KPI");
    info.dataset.tooltip = card.tooltip;
    head.append(label, info);
    const valor = document.createElement("strong");
    valor.className = "kpi-card__value";
    valor.textContent = formatKpiValor(card.valor, card.formato);
    const delta = document.createElement("small");
    delta.className = "kpi-card__delta";
    delta.textContent = card.delta;
    item.append(head, valor, delta);
    kpiCards.append(item);
  });
}

function buildLineChart(container, labels, series, maxValor, tooltipLabels) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  const width = 600;
  const height = 160;
  const padX = 24;
  const padY = 18;
  const plotWidth = width - padX * 2;
  const plotHeight = height - padY * 2;
  const baseline = padY + plotHeight;
  const step = labels.length > 1 ? plotWidth / (labels.length - 1) : plotWidth;
  const pulse = Math.max(6, step * 0.14);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.classList.add("chart__svg");

  const baselineLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  baselineLine.setAttribute("x1", padX);
  baselineLine.setAttribute("x2", width - padX);
  baselineLine.setAttribute("y1", baseline);
  baselineLine.setAttribute("y2", baseline);
  baselineLine.classList.add("chart__baseline");
  svg.append(baselineLine);

  const max = Math.max(1, maxValor || 1);

  series.forEach((serie) => {
    const points = serie.values.map((valor, index) => {
      const safeValor = Number.isFinite(valor) ? valor : 0;
      const x = padX + index * step;
      const y = padY + plotHeight - (safeValor / max) * plotHeight;
      return { x, y, valor: safeValor };
    });
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
    path.setAttribute("d", d);
    path.classList.add("chart__line");
    if (serie.lineClass) {
      path.classList.add(serie.lineClass);
    }
    if (serie.stroke) {
      path.setAttribute("stroke", serie.stroke);
    }
    svg.append(path);

    points.forEach((point, index) => {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", point.x);
      dot.setAttribute("cy", point.y);
      dot.setAttribute("r", pulse * 0.35);
      dot.classList.add("chart__dot");
      if (serie.dotClass) {
        dot.classList.add(serie.dotClass);
      }
      if (serie.drilldown) {
        dot.dataset.drilldown = serie.drilldown;
        dot.dataset.week = serie.weekKeys[index];
        dot.style.cursor = "pointer";
      }
      if (tooltipLabels && tooltipLabels[index]) {
        dot.setAttribute("title", tooltipLabels[index]);
      }
      svg.append(dot);
    });
  });

  const legend = document.createElement("div");
  legend.className = "chart__legend";
  series.forEach((serie) => {
    const item = document.createElement("span");
    item.className = "chart__legend-item";
    if (serie.legendClass) {
      item.classList.add(serie.legendClass);
    }
    item.textContent = serie.label;
    if (serie.tooltip) {
      item.title = serie.tooltip;
    }
    legend.append(item);
  });

  const labelsRow = document.createElement("div");
  labelsRow.className = "chart__labels";
  labels.forEach((label) => {
    const span = document.createElement("span");
    span.textContent = label;
    labelsRow.append(span);
  });

  container.append(svg, legend, labelsRow);
}

// KPI: graficos
function renderKpiGraficos(itens, filtros) {
  if (!kpiTrendChart || !kpiAgingChart || !kpiSlaChart) {
    return;
  }
  const semanasCount = 6;
  const ultimaSemana = startOfWeek(new Date());
  const semanas = [];
  for (let i = semanasCount - 1; i >= 0; i -= 1) {
    const inicio = addDays(ultimaSemana, -7 * i);
    const fim = addDays(inicio, 6);
    semanas.push({ inicio, fim });
  }

  const weekLabels = semanas.map((semana) => weekLabelFormatter.format(semana.inicio));
  const weekKeys = semanas.map((semana) => formatDateISO(semana.inicio));

  const concluidasSeries = semanas.map((semana) => {
    return itens.filter((item) => {
      if (item.status !== "concluida") {
        return false;
      }
      const feito = getItemConclusaoDate(item);
      if (!feito) {
        return false;
      }
      return inRange(startOfDay(feito), semana.inicio, semana.fim);
    }).length;
  });

  const backlogSeries = semanas.map((semana) => {
    return itens.filter((item) => {
      if (item.status !== "backlog") {
        return false;
      }
      const data = parseDate(item.data);
      if (!data) {
        return false;
      }
      return inRange(startOfDay(data), semana.inicio, semana.fim);
    }).length;
  });

  const maxTrend = Math.max(1, ...concluidasSeries, ...backlogSeries);
  const trendPeriodo = `ultimas ${semanasCount} semanas`;
  buildLineChart(
    kpiTrendChart,
    weekLabels,
    [
      {
        label: "Concluidas",
        values: concluidasSeries,
        lineClass: "chart__line--done",
        dotClass: "chart__dot--done",
        legendClass: "chart__legend-item--done",
        drilldown: "trend_concluidas",
        weekKeys,
        tooltip: buildKpiTooltip(
          "Concluidas",
          "Manutencoes concluidas por semana.",
          trendPeriodo
        ),
      },
      {
        label: "Backlog",
        values: backlogSeries,
        lineClass: "chart__line--backlog",
        dotClass: "chart__dot--backlog",
        legendClass: "chart__legend-item--backlog",
        drilldown: "trend_backlog",
        weekKeys,
        tooltip: buildKpiTooltip(
          "Backlog",
          "Manutencoes em backlog por semana.",
          trendPeriodo
        ),
      },
    ],
    maxTrend
  );

  const agingBuckets = [
    { label: "0-2d", min: 0, max: 2 },
    { label: "3-7d", min: 3, max: 7 },
    { label: "8-14d", min: 8, max: 14 },
    { label: "15-30d", min: 15, max: 30 },
    { label: ">30d", min: 31, max: null },
  ];
  const hoje = startOfDay(new Date());
  const agingCounts = agingBuckets.map((bucket) => {
    return itens.filter((item) => {
      if (item.status !== "backlog") {
        return false;
      }
      const data = parseDate(item.data);
      if (!data) {
        return false;
      }
      const atraso = diffInDays(startOfDay(data), hoje);
      if (bucket.max === null) {
        return atraso >= bucket.min;
      }
      return atraso >= bucket.min && atraso <= bucket.max;
    }).length;
  });
  const maxAging = Math.max(1, ...agingCounts);
  kpiAgingChart.innerHTML = "";
  const agingContainer = document.createElement("div");
  agingContainer.style.display = "grid";
  agingContainer.style.gap = "10px";
  agingBuckets.forEach((bucket, index) => {
    const linha = document.createElement("div");
    linha.style.display = "grid";
    linha.style.gridTemplateColumns = "80px 1fr 40px";
    linha.style.alignItems = "center";
    linha.dataset.drilldown = "aging";
    linha.dataset.range = bucket.label;
    linha.style.cursor = "pointer";
    linha.title = buildKpiTooltip(
      `Backlog aging ${bucket.label}`,
      "Dias em atraso desde a data programada.",
      "Status backlog atual"
    );
    const label = document.createElement("span");
    label.textContent = bucket.label;
    const bar = document.createElement("div");
    bar.style.height = "10px";
    bar.style.borderRadius = "999px";
    bar.style.background = "rgba(192, 84, 47, 0.7)";
    bar.style.width = `${Math.round((agingCounts[index] / maxAging) * 100)}%`;
    const valor = document.createElement("strong");
    valor.textContent = agingCounts[index];
    linha.append(label, bar, valor);
    agingContainer.append(linha);
  });
  kpiAgingChart.append(agingContainer);

  const slaSeries = semanas.map((semana) => {
    const concluidasSemana = itens.filter((item) => {
      if (item.status !== "concluida") {
        return false;
      }
      const feito = getItemConclusaoDate(item);
      if (!feito) {
        return false;
      }
      return inRange(startOfDay(feito), semana.inicio, semana.fim);
    });
    const resultados = concluidasSemana
      .map((item) => isSlaCompliant(item))
      .filter((valor) => valor !== null);
    if (!resultados.length) {
      return null;
    }
    return Math.round(
      (resultados.filter(Boolean).length / resultados.length) * 100
    );
  });
  const slaTooltip = buildKpiTooltip(
    "SLA compliance",
    "Concluidas no prazo / concluidas na semana.",
    trendPeriodo
  );
  const slaLabels = slaSeries.map((valor) =>
    valor === null ? "Sem dados" : `${valor}%`
  );
  buildLineChart(
    kpiSlaChart,
    weekLabels,
    [
      {
        label: "SLA",
        values: slaSeries.map((valor) => (valor === null ? 0 : valor)),
        lineClass: "chart__line--done",
        dotClass: "chart__dot--done",
        legendClass: "chart__legend-item--done",
        drilldown: "sla_semana",
        weekKeys,
        tooltip: slaTooltip,
      },
    ],
    100,
    slaLabels
  );
}

// KPI: ranking por usuario
function renderKpiRanking(itens, filtros) {
  if (!kpiRanking || !kpiRankingVazio) {
    return;
  }
  kpiRanking.innerHTML = "";
  const agrupado = new Map();
  itens.forEach((item) => {
    const userId = getExecutadoPorId(item) || "sem_responsavel";
    if (!agrupado.has(userId)) {
      agrupado.set(userId, {
        userId,
        concluidas: 0,
        overdue: 0,
        leadTimes: [],
        mttr: [],
        docsOk: 0,
        docsTotal: 0,
      });
    }
    const registro = agrupado.get(userId);
    if (item.status === "concluida") {
      registro.concluidas += 1;
      const criadoEm = getItemCriacaoDate(item);
      const concluidoEm = getItemConclusaoDate(item);
      if (criadoEm && concluidoEm) {
        registro.leadTimes.push((concluidoEm - criadoEm) / DAY_MS);
      }
      const inicio = getItemInicioExecucaoDate(item);
      const fim = getItemFimExecucaoDate(item);
      if (inicio && fim) {
        registro.mttr.push((fim - inicio) / 60000);
      }
    } else if (isItemOverdue(item, startOfDay(new Date()))) {
      registro.overdue += 1;
    }
    const compliance = getDocCompliance(item);
    if (compliance !== null) {
      registro.docsTotal += 1;
      if (compliance) {
        registro.docsOk += 1;
      }
    }
  });

  let linhas = Array.from(agrupado.values());
  if (filtros.usuario) {
    linhas = linhas.filter((linha) => linha.userId === filtros.usuario);
  }
  const linhasCalculadas = linhas.map((linha) => {
    const leadMedio = linha.leadTimes.length
      ? linha.leadTimes.reduce((acc, val) => acc + val, 0) / linha.leadTimes.length
      : null;
    const mttrMedio = linha.mttr.length
      ? linha.mttr.reduce((acc, val) => acc + val, 0) / linha.mttr.length
      : null;
    const docsPercent =
      linha.docsTotal > 0 ? Math.round((linha.docsOk / linha.docsTotal) * 100) : null;
    return { ...linha, leadMedio, mttrMedio, docsPercent };
  });
  // ordenacao ranking usuario
  const sortKey = kpiRankingSort ? kpiRankingSort.key : "concluidas";
  const sortDir = kpiRankingSort ? kpiRankingSort.dir : "desc";
  const sortDirFactor = sortDir === "asc" ? 1 : -1;
  const getSortValue = (linha) => {
    if (sortKey === "overdue") {
      return linha.overdue;
    }
    if (sortKey === "lead") {
      return linha.leadMedio;
    }
    if (sortKey === "mttr") {
      return linha.mttrMedio;
    }
    if (sortKey === "docs") {
      return linha.docsPercent;
    }
    return linha.concluidas;
  };
  linhasCalculadas.sort((a, b) => {
    const aVal = getSortValue(a);
    const bVal = getSortValue(b);
    const aEmpty = aVal === null || aVal === undefined || Number.isNaN(aVal);
    const bEmpty = bVal === null || bVal === undefined || Number.isNaN(bVal);
    if (aEmpty && bEmpty) {
      return 0;
    }
    if (aEmpty) {
      return 1;
    }
    if (bEmpty) {
      return -1;
    }
    return (aVal - bVal) * sortDirFactor;
  });

  if (!linhasCalculadas.length) {
    kpiRankingVazio.hidden = false;
    return;
  }
  kpiRankingVazio.hidden = true;

  const table = document.createElement("table");
  table.className = "kpi-table";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const headers = [
    {
      label: "Usuario",
      tooltip: buildKpiTooltip(
        "Usuario",
        "Responsavel pela execucao.",
        "Filtro atual"
      ),
    },
    {
      label: "Concluidas",
      sortKey: "concluidas",
      tooltip: buildKpiTooltip(
        "Concluidas",
        "Total de manutencoes concluidas.",
        `ultimos ${filtros.periodo} dias`
      ),
    },
    {
      label: "Overdue aberto",
      sortKey: "overdue",
      tooltip: buildKpiTooltip(
        "Overdue aberto",
        "Manutencoes em aberto com data atrasada.",
        `ultimos ${filtros.periodo} dias`
      ),
    },
    {
      label: "Lead time medio",
      sortKey: "lead",
      tooltip: buildKpiTooltip(
        "Lead time medio",
        "Conclusao - criacao (dias).",
        `ultimos ${filtros.periodo} dias`
      ),
    },
    {
      label: "MTTR medio",
      sortKey: "mttr",
      tooltip: buildKpiTooltip(
        "MTTR medio",
        "Fim - inicio da execucao.",
        `ultimos ${filtros.periodo} dias`
      ),
    },
    {
      label: "% docs OK",
      sortKey: "docs",
      tooltip: buildKpiTooltip(
        "Compliance docs",
        "APR/OS/PTE e PT quando critico.",
        `ultimos ${filtros.periodo} dias`
      ),
    },
  ];
  headers.forEach((header, index) => {
    const th = document.createElement("th");
    th.textContent = header.label;
    th.title = header.tooltip;
    if (header.sortKey) {
      th.dataset.sortKey = header.sortKey;
      th.classList.add("is-sortable");
    }
    if (index > 0) {
      th.classList.add("is-num");
    }
    headRow.append(th);
  });
  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement("tbody");
  linhasCalculadas.forEach((linha) => {
    const lead = linha.leadMedio;
    const mttr = linha.mttrMedio;
    const docsPercent = linha.docsPercent;
    const tr = document.createElement("tr");
    tr.dataset.drilldown = "user";
    tr.dataset.userId = linha.userId;
    if (filtros.usuario && linha.userId === filtros.usuario) {
      tr.classList.add("is-selected");
    }
    tr.style.cursor = "pointer";
    // formatacao valores ranking
    const cols = [
      { value: getUserLabel(linha.userId) },
      { value: linha.concluidas },
      { value: linha.overdue },
      {
        value: lead === null ? "\u2014" : `${lead.toFixed(1)}d`,
        tooltip: lead === null ? "Sem base de calculo" : "",
      },
      {
        value: mttr === null ? "\u2014" : formatDuracaoKpi(mttr),
        tooltip: mttr === null ? "Sem base de calculo" : "",
      },
      {
        value: docsPercent === null ? "\u2014" : `${docsPercent}%`,
        tooltip: docsPercent === null ? "Sem documentos no periodo" : "",
      },
    ];
    cols.forEach((col, index) => {
      const td = document.createElement("td");
      const valor = col && Object.prototype.hasOwnProperty.call(col, "value") ? col.value : col;
      td.textContent = valor;
      if (col && col.tooltip) {
        td.title = col.tooltip;
        td.classList.add("is-empty");
      }
      if (index > 0) {
        td.classList.add("is-num");
      }
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  kpiRanking.append(table);
}

// KPI: drilldown
function renderKpiDrilldown() {
  if (!kpiDrilldownTabela || !kpiDrilldownVazio || !kpiDrilldownTitulo) {
    return;
  }
  kpiDrilldownTabela.innerHTML = "";
  if (!kpiDrilldown || !kpiDrilldown.items.length) {
    kpiDrilldownTitulo.textContent = "Clique em um KPI ou grafico para listar.";
    kpiDrilldownVazio.hidden = false;
    return;
  }
  kpiDrilldownVazio.hidden = true;
  const filtros = kpiSnapshot ? kpiSnapshot.filtros || {} : {};
  const periodoLabel = filtros.periodo ? `${filtros.periodo}d` : "-";
  const subestacaoLabel = filtros.subestacao || "Todas";
  const categoriaLabel = filtros.categoria || "Todas";
  const prioridadeLabel = filtros.prioridade || "Todas";
  const usuarioLabel = filtros.usuario ? getUserLabel(filtros.usuario) : "Todos";
  const limite = kpiDrilldownLimite ? Number(kpiDrilldownLimite.value) || 25 : 25;
  const itensVisiveis = kpiDrilldown.items.slice(0, limite);
  // header drill-down
  kpiDrilldownTitulo.textContent = `Metrica: ${kpiDrilldown.titulo} | Itens: ${itensVisiveis.length} | Periodo: ${periodoLabel} | Subestacao: ${subestacaoLabel} | Categoria: ${categoriaLabel} | Prioridade: ${prioridadeLabel} | Usuario: ${usuarioLabel}`;

  const table = document.createElement("table");
  table.className = "kpi-table kpi-table--compact";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const colunas = [
    { label: "Manutencao", className: "is-wide" },
    { label: "Subestacao" },
    { label: "Status", className: "is-center" },
    { label: "Programada", className: "is-date" },
    { label: "Inicio", className: "is-date" },
    { label: "Fim", className: "is-date" },
    { label: "Responsavel" },
  ];
  colunas.forEach((coluna) => {
    const th = document.createElement("th");
    th.textContent = coluna.label;
    if (coluna.className) {
      th.classList.add(coluna.className);
    }
    headRow.append(th);
  });
  thead.append(headRow);
  table.append(thead);
  const tbody = document.createElement("tbody");
  itensVisiveis.forEach((item) => {
    const tr = document.createElement("tr");
    const programadaDate = item.data ? parseDate(item.data) : null;
    const programada = programadaDate ? formatDate(programadaDate) : "-";
    const inicio = getItemInicioExecucaoDate(item);
    const fim = getItemFimExecucaoDate(item) || getItemConclusaoDate(item);
    const statusKeyRaw = item.status ? String(item.status).toLowerCase() : "";
    const statusLabel =
      STATUS_LABELS[statusKeyRaw] || (statusKeyRaw === "cancelada" ? "Cancelada" : item.status) || "-";
    const statusClass = statusKeyRaw ? statusKeyRaw.replace(/[^a-z0-9]+/g, "_") : "default";
    const statusBadge = document.createElement("span");
    statusBadge.className = `status-badge status-badge--${statusClass}`;
    statusBadge.textContent = statusLabel;
    const cols = [
      { value: item.titulo || "-", title: item.titulo || "" },
      { value: getItemSubestacao(item) || "-" },
      { node: statusBadge },
      { value: programada || "-" },
      { value: inicio ? formatDateTime(inicio) : "-" },
      { value: fim ? formatDateTime(fim) : "-" },
      { value: getUserLabel(getExecutadoPorId(item)) },
    ];
    cols.forEach((col, index) => {
      const td = document.createElement("td");
      if (col && col.node) {
        td.append(col.node);
      } else {
        const valor = col && Object.prototype.hasOwnProperty.call(col, "value") ? col.value : col;
        td.textContent = valor;
      }
      if (col && col.title) {
        td.title = col.title;
      }
      const coluna = colunas[index];
      if (coluna && coluna.className) {
        td.classList.add(coluna.className);
      }
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  kpiDrilldownTabela.append(table);
}

function atualizarKpiDrilldown(tipo, itens, titulo) {
  kpiDrilldown = { tipo, items: itens, titulo };
  renderKpiDrilldown();
}

function handleKpiRankingSort(event) {
  const th = event.target.closest("th[data-sort-key]");
  if (!th || !kpiSnapshot) {
    return;
  }
  const key = th.dataset.sortKey;
  if (kpiRankingSort.key === key) {
    kpiRankingSort.dir = kpiRankingSort.dir === "asc" ? "desc" : "asc";
  } else {
    kpiRankingSort.key = key;
    kpiRankingSort.dir = key === "lead" || key === "mttr" ? "asc" : "desc";
  }
  renderKpiRanking(kpiSnapshot.itensPeriodo || [], kpiSnapshot.filtros || {});
}

// KPI: renderizacao principal
function renderPainelKpiGerencial() {
  if (!kpiCards || !kpiTrendChart || !kpiAgingChart || !kpiSlaChart) {
    return;
  }
  const filtros = getKpiFiltros();
  const base = aplicarFiltrosBase(manutencoes, filtros);
  atualizarFiltrosKpi(base);
  const janela = buildPeriodoJanela(filtros.periodo);
  const itensPeriodo = aplicarFiltroPeriodo(base, janela);
  const itensAnterior = aplicarFiltroPeriodo(base, {
    inicio: janela.anteriorInicio,
    fim: janela.anteriorFim,
  });
  kpiSnapshot = { itensPeriodo, filtros };
  renderKpiCards(itensPeriodo, itensAnterior, filtros);
  renderKpiGraficos(itensPeriodo, filtros);
  renderKpiRanking(itensPeriodo, filtros);
  renderKpiDrilldown();
}

function handleKpiDrilldownClick(event) {
  const alvo = event.target.closest("[data-drilldown]");
  if (!alvo || !kpiSnapshot) {
    return;
  }
  const itens = kpiSnapshot.itensPeriodo || [];
  const hoje = startOfDay(new Date());
  const tipo = alvo.dataset.drilldown;
  let filtrados = [];
  let titulo = "";

  if (tipo === "backlog_total") {
    filtrados = itens.filter((item) => item.status === "backlog");
    titulo = "Backlog total";
  } else if (tipo === "overdue_total") {
    filtrados = itens.filter((item) => isItemOverdue(item, hoje));
    titulo = "Overdue / Vencidas";
  } else if (tipo === "sla_compliance") {
    filtrados = itens.filter((item) => item.status === "concluida");
    titulo = "SLA compliance";
  } else if (tipo === "lead_time") {
    filtrados = itens.filter(
      (item) => item.status === "concluida" && getItemCriacaoDate(item) && getItemConclusaoDate(item)
    );
    titulo = "Lead time medio";
  } else if (tipo === "mttr") {
    filtrados = itens.filter(
      (item) => item.status === "concluida" && getItemInicioExecucaoDate(item) && getItemFimExecucaoDate(item)
    );
    titulo = "MTTR medio";
  } else if (tipo === "criticos_abertos") {
    filtrados = itens.filter((item) => item.status !== "concluida" && isItemCritico(item));
    titulo = "Criticos em aberto";
  } else if (tipo === "trend_concluidas" || tipo === "trend_backlog" || tipo === "sla_semana") {
    const weekStart = parseDate(alvo.dataset.week);
    if (weekStart) {
      const weekEnd = addDays(weekStart, 6);
      if (tipo === "trend_concluidas") {
        filtrados = itens.filter((item) => {
          if (item.status !== "concluida") {
            return false;
          }
          const feito = getItemConclusaoDate(item);
          return feito ? inRange(startOfDay(feito), weekStart, weekEnd) : false;
        });
        titulo = `Concluidas - semana ${formatDate(weekStart)}`;
      } else if (tipo === "trend_backlog") {
        filtrados = itens.filter((item) => {
          if (item.status !== "backlog") {
            return false;
          }
          const data = parseDate(item.data);
          return data ? inRange(startOfDay(data), weekStart, weekEnd) : false;
        });
        titulo = `Backlog - semana ${formatDate(weekStart)}`;
      } else {
        filtrados = itens.filter((item) => {
          if (item.status !== "concluida") {
            return false;
          }
          const feito = getItemConclusaoDate(item);
          return feito ? inRange(startOfDay(feito), weekStart, weekEnd) : false;
        });
        titulo = `SLA compliance - semana ${formatDate(weekStart)}`;
      }
    }
  } else if (tipo === "aging") {
    const range = alvo.dataset.range || "";
    const ranges = {
      "0-2d": { min: 0, max: 2 },
      "3-7d": { min: 3, max: 7 },
      "8-14d": { min: 8, max: 14 },
      "15-30d": { min: 15, max: 30 },
      ">30d": { min: 31, max: null },
    };
    const bucket = ranges[range];
    if (bucket) {
      filtrados = itens.filter((item) => {
        if (item.status !== "backlog") {
          return false;
        }
        const data = parseDate(item.data);
        if (!data) {
          return false;
        }
        const atraso = diffInDays(startOfDay(data), hoje);
        if (bucket.max === null) {
          return atraso >= bucket.min;
        }
        return atraso >= bucket.min && atraso <= bucket.max;
      });
      titulo = `Backlog aging ${range}`;
    }
  } else if (tipo === "user") {
    const userId = alvo.dataset.userId;
    if (userId) {
      filtrados = itens.filter((item) => getExecutadoPorId(item) === userId);
      titulo = `Usuario ${getUserLabel(userId)}`;
    }
  }

  const ordenados = filtrados.slice().sort((a, b) => {
    const dataA = getItemConclusaoDate(a) || parseAnyDate(a.data) || getItemCriacaoDate(a);
    const dataB = getItemConclusaoDate(b) || parseAnyDate(b.data) || getItemCriacaoDate(b);
    return (getTimeValue(dataB) || 0) - (getTimeValue(dataA) || 0);
  });
  atualizarKpiDrilldown(tipo, ordenados, titulo || "Detalhamento");
}

function renderGrafico() {
  if (kpiCards || kpiTrendChart || kpiAgingChart || kpiSlaChart) {
    renderPainelKpiGerencial();
    return;
  }
  if (!graficoKpi) {
    return;
  }
  graficoKpi.innerHTML = "";
  const hoje = new Date();
  const ultimaSemana = startOfWeek(hoje);
  const semanas = [];
  for (let i = 5; i >= 0; i -= 1) {
    const inicio = addDays(ultimaSemana, -7 * i);
    const fim = addDays(inicio, 6);
    semanas.push({ inicio, fim });
  }

  const dados = semanas.map((semana) => {
    const concluidas = manutencoes.filter((item) => {
      if (item.status !== "concluida" || !item.doneAt) {
        return false;
      }
      const feito = parseTimestamp(item.doneAt);
      if (!feito) {
        return false;
      }
      const feitoDia = startOfDay(feito);
      return inRange(feitoDia, semana.inicio, semana.fim);
    }).length;

    const backlog = manutencoes.filter((item) => {
      if (item.status !== "backlog") {
        return false;
      }
      const data = parseDate(item.data);
      if (!data) {
        return false;
      }
      return inRange(data, semana.inicio, semana.fim);
    }).length;

    return { concluidas, backlog, inicio: semana.inicio };
  });

  const labels = dados.map((item) => weekLabelFormatter.format(item.inicio));
  const concluidasSeries = dados.map((item) => item.concluidas);
  const backlogSeries = dados.map((item) => item.backlog);
  const maxValor = Math.max(1, ...concluidasSeries, ...backlogSeries);

  const width = 600;
  const height = 160;
  const padX = 24;
  const padY = 18;
  const plotWidth = width - padX * 2;
  const plotHeight = height - padY * 2;
  const baseline = padY + plotHeight;
  const step = concluidasSeries.length > 1 ? plotWidth / (concluidasSeries.length - 1) : plotWidth;
  const pulse = Math.max(6, step * 0.14);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("chart__svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Grafico de desempenho");

  const baselineLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  baselineLine.setAttribute("x1", padX);
  baselineLine.setAttribute("y1", baseline);
  baselineLine.setAttribute("x2", padX + plotWidth);
  baselineLine.setAttribute("y2", baseline);
  baselineLine.setAttribute("class", "chart__baseline");
  svg.append(baselineLine);

  const buildPulsePath = (values) => {
    let d = `M ${padX} ${baseline}`;
    values.forEach((value, index) => {
      const x = padX + step * index;
      const y = baseline - (value / maxValor) * plotHeight;
      const left = Math.max(padX, x - pulse);
      const right = Math.min(padX + plotWidth, x + pulse);
      d += ` L ${left} ${baseline} L ${x} ${y} L ${right} ${baseline}`;
    });
    d += ` L ${padX + plotWidth} ${baseline}`;
    return d;
  };

  const backlogPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  backlogPath.setAttribute("d", buildPulsePath(backlogSeries));
  backlogPath.setAttribute("class", "chart__line chart__line--backlog");
  svg.append(backlogPath);

  const donePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  donePath.setAttribute("d", buildPulsePath(concluidasSeries));
  donePath.setAttribute("class", "chart__line chart__line--done");
  svg.append(donePath);

  const addDots = (values, className) => {
    values.forEach((value, index) => {
      const x = padX + step * index;
      const y = baseline - (value / maxValor) * plotHeight;
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 3.4);
      dot.setAttribute("class", className);
      svg.append(dot);
    });
  };

  addDots(backlogSeries, "chart__dot chart__dot--backlog");
  addDots(concluidasSeries, "chart__dot chart__dot--done");

  const legend = document.createElement("div");
  legend.className = "chart__legend";
  const legendDone = document.createElement("span");
  legendDone.className = "chart__legend-item chart__legend-item--done";
  legendDone.textContent = "Concluidas";
  const legendBacklog = document.createElement("span");
  legendBacklog.className = "chart__legend-item chart__legend-item--backlog";
  legendBacklog.textContent = "Backlog";
  legend.append(legendDone, legendBacklog);

  const labelsRow = document.createElement("div");
  labelsRow.className = "chart__labels";
  labels.forEach((label) => {
    const span = document.createElement("span");
    span.textContent = label;
    labelsRow.append(span);
  });

  graficoKpi.append(svg, legend, labelsRow);
}

function normalizeNumberList(list, min, max) {
  const values = Array.isArray(list) ? list : [];
  const limpos = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value >= min && value <= max);
  return Array.from(new Set(limpos)).sort((a, b) => a - b);
}

function normalizeDailyDays(list) {
  const dias = normalizeNumberList(list, 0, 6);
  return dias.length ? dias : [...DEFAULT_DAILY_DAYS];
}

function normalizeMonthlyDays(list) {
  return normalizeNumberList(list, 1, 31);
}

function validateMonthlyDaysInput(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return { valid: true, dias: [] };
  }
  if (!/^[0-9\s,]+$/.test(raw)) {
    return { valid: false, dias: [] };
  }
  const parts = raw.split(/[\s,]+/).filter(Boolean);
  const numbers = parts.map((item) => Number(item));
  const invalid = numbers.some((num) => !Number.isFinite(num) || num < 1 || num > 31);
  if (invalid) {
    return { valid: false, dias: [] };
  }
  return { valid: true, dias: normalizeMonthlyDays(numbers) };
}

function parseMonthlyDaysInputValue(value) {
  const result = validateMonthlyDaysInput(value);
  return result.valid ? result.dias : [];
}

function updateMonthlyDaysChips() {
  if (!templateMonthlyDaysChips || !templateMonthlyDaysInput) {
    return;
  }
  const dias = parseMonthlyDaysInputValue(templateMonthlyDaysInput.value);
  templateMonthlyDaysChips.innerHTML = "";
  if (!dias.length) {
    const empty = document.createElement("span");
    empty.className = "chip-pill chip-pill--muted";
    empty.textContent = "Nenhum dia selecionado";
    templateMonthlyDaysChips.append(empty);
    return;
  }
  dias.forEach((dia) => {
    const chip = document.createElement("span");
    chip.className = "chip-pill";
    chip.textContent = String(dia);
    templateMonthlyDaysChips.append(chip);
  });
}

function getDailyDaysFromForm() {
  const dias = Array.from(templateDailyDays || [])
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => Number(checkbox.value));
  return normalizeNumberList(dias, 0, 6);
}

function updateTemplateResumo() {
  if (!templateResumoLinhas) {
    return;
  }
  const nome = templateNome ? templateNome.value.trim() : "";
  const subestacao = templateSubestacao ? templateSubestacao.value : "";
  const subestacaoLabel = subestacao || "Subestacao nao definida";
  const tipo = templateFrequencia ? templateFrequencia.value : "none";
  const inicioStr = templateInicio ? templateInicio.value : "";
  const inicioDate = parseDate(inicioStr);
  const inicioLabel = inicioDate ? formatDate(inicioDate) : "-";

  const linhas = [];
  const linhaTitulo = `${nome || "Nome do modelo"} - ${subestacaoLabel}`;
  linhas.push(linhaTitulo);

  if (tipo === "none") {
    linhas.push(
      `Este modelo NAO possui recorrencia automatica. Uso apenas como modelo manual. Inicio: ${inicioLabel}.`
    );
  } else if (tipo === "daily") {
    const dias = getDailyDaysFromForm();
    const lista = dias.length ? dias.map(getWeekdayShort).filter(Boolean).join(", ") : "a definir";
    linhas.push(
      `Este modelo ira gerar manutencoes DIARIAS nos dias: [${lista}], a partir de ${inicioLabel}, para: ${subestacaoLabel}.`
    );
  } else if (tipo === "weekly") {
    const diaSemana = templateWeeklyDay ? getWeekdayLabel(templateWeeklyDay.value) : "";
    const intervaloRaw = templateWeeklyInterval ? Number(templateWeeklyInterval.value) : 1;
    const intervalo = Math.max(1, Math.round(intervaloRaw || 1));
    const diaLabel = diaSemana || "Dia nao definido";
    linhas.push(
      `Este modelo ira gerar manutencoes SEMANAIS toda(o) ${diaLabel}, a cada ${intervalo} semana(s), a partir de ${inicioLabel}, para: ${subestacaoLabel}.`
    );
  } else if (tipo === "monthly") {
    const modo = templateMonthlyMulti && templateMonthlyMulti.checked ? "multi" : "fixed";
    if (modo === "multi") {
      const dias = parseMonthlyDaysInputValue(templateMonthlyDaysInput ? templateMonthlyDaysInput.value : "");
      const lista = dias.length ? dias.join(", ") : "a definir";
      linhas.push(
        `Este modelo ira gerar manutencoes MENSAIS nos dias ${lista} de cada mes, a partir de ${inicioLabel}, para: ${subestacaoLabel}.`
      );
    } else {
      const dia = templateMonthlyDay ? templateMonthlyDay.value : "";
      const diaLabel = dia || "-";
      linhas.push(
        `Este modelo ira gerar manutencoes MENSAIS no dia ${diaLabel} de cada mes, a partir de ${inicioLabel}, para: ${subestacaoLabel}.`
      );
    }
    linhas.push(
      "Obs.: quando o mes nao possuir o dia configurado, a ocorrencia sera IGNORADA."
    );
  }

  templateResumoLinhas.innerHTML = "";
  linhas.forEach((linha) => {
    const span = document.createElement("span");
    span.textContent = linha;
    templateResumoLinhas.append(span);
  });
}

function handleTemplateFormChange(event) {
  if (event) {
    clearTemplateFieldError(event.target);
    mostrarMensagemTemplate("");
  }
  if (event && event.target === templateMonthlyDaysInput) {
    const validacao = validateMonthlyDaysInput(templateMonthlyDaysInput.value);
    if (
      templateFrequencia &&
      templateFrequencia.value === "monthly" &&
      templateMonthlyMulti &&
      templateMonthlyMulti.checked &&
      !validacao.valid
    ) {
      setFieldError(
        templateMonthlyDaysErro,
        "Informe dias validos entre 1 e 31 (ex.: 10, 25)."
      );
    } else {
      setFieldError(templateMonthlyDaysErro, "");
    }
    if (event.type === "change" && validacao.valid) {
      templateMonthlyDaysInput.value = validacao.dias.length ? validacao.dias.join(", ") : "";
    }
  }
  updateMonthlyDaysChips();
  updateTemplateResumo();
}

function normalizarTemplate(template) {
  if (!template || typeof template !== "object") {
    return { template, mudou: false };
  }
  let mudou = false;
  const resultado = { ...template };

  if (!resultado.frequencia) {
    resultado.frequencia = "none";
    mudou = true;
  }

  if (resultado.frequencia === "biweekly") {
    resultado.frequencia = "weekly";
    if (!Number.isFinite(Number(resultado.weeklyInterval))) {
      resultado.weeklyInterval = 2;
    }
    mudou = true;
  }

  if (resultado.frequencia === "custom") {
    const intervalo = Number(resultado.intervaloDias || 0);
    if (intervalo >= 7 && intervalo % 7 === 0) {
      resultado.frequencia = "weekly";
      resultado.weeklyInterval = Math.max(1, Math.round(intervalo / 7));
    } else if (intervalo >= 28) {
      resultado.frequencia = "monthly";
    } else if (intervalo === 1) {
      resultado.frequencia = "daily";
    } else {
      resultado.frequencia = "none";
    }
    mudou = true;
  }

  if (!resultado.inicio || !parseDate(resultado.inicio)) {
    resultado.inicio = formatDateISO(new Date());
    mudou = true;
  }

  if (resultado.frequencia === "daily") {
    const dias = normalizeNumberList(resultado.dailyDays || resultado.diasSemana, 0, 6);
    resultado.dailyDays = dias.length ? dias : [...DEFAULT_DAILY_DAYS];
    if (!dias.length) {
      mudou = true;
    }
  } else {
    resultado.dailyDays = normalizeNumberList(resultado.dailyDays, 0, 6);
  }

  if (resultado.frequencia === "weekly") {
    const inicio = parseDate(resultado.inicio);
    const fallbackDay = Number.isFinite(Number(resultado.weekday))
      ? Number(resultado.weekday)
      : inicio
        ? inicio.getDay()
        : 1;
    const weeklyDayValue = Number(resultado.weeklyDay);
    const weeklyDay =
      Number.isFinite(weeklyDayValue) && weeklyDayValue >= 0 && weeklyDayValue <= 6
        ? weeklyDayValue
        : fallbackDay;
    let weeklyInterval = Number(resultado.weeklyInterval || 0);
    if (!Number.isFinite(weeklyInterval) || weeklyInterval < 1) {
      const dias = Number(resultado.intervaloDias || 0);
      if (Number.isFinite(dias) && dias >= 7 && dias % 7 === 0) {
        weeklyInterval = Math.max(1, Math.round(dias / 7));
      } else {
        weeklyInterval = 1;
      }
    }
    resultado.weeklyDay = weeklyDay;
    resultado.weeklyInterval = weeklyInterval;
  }

  if (resultado.frequencia === "monthly") {
    const diasMes = normalizeMonthlyDays(resultado.monthlyDays);
    let mode = resultado.monthlyMode;
    if (mode !== "multi" && mode !== "fixed") {
      mode = diasMes.length ? "multi" : "fixed";
    }
    resultado.monthlyMode = mode;

    if (mode === "multi") {
      let diasSelecionados = diasMes;
      if (diasSelecionados.length === 0) {
        const inicio = parseDate(resultado.inicio);
        const fallbackDay = Number(resultado.monthlyDay) || (inicio ? inicio.getDate() : 1);
        diasSelecionados = normalizeMonthlyDays([fallbackDay]);
        mudou = true;
      }
      resultado.monthlyDays = diasSelecionados;
    } else {
      let dia = Number(resultado.monthlyDay);
      if (!Number.isFinite(dia) || dia < 1 || dia > 31) {
        const inicio = parseDate(resultado.inicio);
        dia = inicio ? inicio.getDate() : 1;
        mudou = true;
      }
      resultado.monthlyDay = dia;
      resultado.monthlyDays = diasMes;
    }
  } else {
    resultado.monthlyDays = normalizeMonthlyDays(resultado.monthlyDays);
    resultado.monthlyMode = resultado.monthlyMode || "fixed";
  }

  return { template: resultado, mudou };
}

function normalizarTemplates(lista) {
  let mudou = false;
  const normalizadas = lista.map((template) => {
    const resultado = normalizarTemplate(template);
    if (resultado.mudou) {
      mudou = true;
    }
    return resultado.template;
  });
  return { normalizadas, mudou };
}

function getWeekdayLabel(weekday) {
  const value = Number(weekday);
  if (!Number.isFinite(value)) {
    return "";
  }
  return WEEKDAYS[value] || "";
}

function getWeekdayShort(weekday) {
  const value = Number(weekday);
  if (!Number.isFinite(value)) {
    return "";
  }
  return WEEKDAYS_SHORT[value] || "";
}

function ajustarParaDiaSemana(base, weekday) {
  const data = startOfDay(base);
  const diff = (weekday - data.getDay() + 7) % 7;
  data.setDate(data.getDate() + diff);
  return data;
}

function formatIntervalo(template) {
  if (!template || !template.frequencia || template.frequencia === "none") {
    return "Sem recorrencia";
  }

  if (template.frequencia === "daily") {
    const dias = normalizeDailyDays(template.dailyDays);
    const lista = dias.map(getWeekdayLabel).filter(Boolean).join(", ");
    return lista ? `Diaria (${lista})` : "Diaria";
  }

  if (template.frequencia === "weekly") {
    const dia = getWeekdayLabel(template.weeklyDay);
    const intervalo = Number(template.weeklyInterval || 1);
    if (intervalo > 1) {
      return dia ? `Semanal (${dia}, a cada ${intervalo} semanas)` : `Semanal (a cada ${intervalo} semanas)`;
    }
    return dia ? `Semanal (${dia})` : "Semanal";
  }

  if (template.frequencia === "monthly") {
    if (template.monthlyMode === "multi") {
      const dias = normalizeMonthlyDays(template.monthlyDays);
      return dias.length ? `Mensal (dias ${dias.join(", ")})` : "Mensal (dias)";
    }
    const dia = Number(template.monthlyDay);
    return Number.isFinite(dia) ? `Mensal (dia ${dia})` : "Mensal";
  }

  return "Sem recorrencia";
}

function matchesRecorrencia(template, data) {
  if (!template || template.frequencia === "none") {
    return false;
  }

  const dia = startOfDay(data);
  const inicio = parseDate(template.inicio);
  const base = inicio ? startOfDay(inicio) : null;
  if (base && dia < base) {
    return false;
  }

  if (template.frequencia === "daily") {
    const dias = normalizeDailyDays(template.dailyDays);
    return dias.includes(dia.getDay());
  }

  if (template.frequencia === "weekly") {
    const day = Number.isFinite(Number(template.weeklyDay)) ? Number(template.weeklyDay) : 1;
    if (dia.getDay() !== day) {
      return false;
    }
    const intervalo = Math.max(1, Math.round(Number(template.weeklyInterval || 1)));
    const baseWeek = startOfWeek(base || dia);
    const currentWeek = startOfWeek(dia);
    const diffWeeks = Math.floor((currentWeek - baseWeek) / (7 * DAY_MS));
    return diffWeeks % intervalo === 0;
  }

  if (template.frequencia === "monthly") {
    const day = dia.getDate();
    if (template.monthlyMode === "multi") {
      const dias = normalizeMonthlyDays(template.monthlyDays);
      return dias.includes(day);
    }
    const fixo = Number(template.monthlyDay);
    return Number.isFinite(fixo) ? day === fixo : false;
  }

  return false;
}

function getNextOccurrenceDate(template, fromDate = new Date()) {
  if (!template || template.frequencia === "none") {
    return null;
  }
  const normalizado = normalizarTemplate(template).template;
  const inicio = parseDate(normalizado.inicio);
  let base = startOfDay(fromDate);
  if (inicio && inicio > base) {
    base = startOfDay(inicio);
  }
  const limite = addDays(base, 370);
  for (let atual = base; atual <= limite; atual = addDays(atual, 1)) {
    if (matchesRecorrencia(normalizado, atual)) {
      return atual;
    }
  }
  return null;
}

function calcularProximaData(template) {
  const proxima = getNextOccurrenceDate(template, new Date());
  return proxima ? formatDateISO(proxima) : "";
}

function resetTemplateFieldsForTipo(tipo) {
  if (templateDailyDays.length) {
    templateDailyDays.forEach((checkbox) => {
      const valor = Number(checkbox.value);
      checkbox.checked = tipo === "daily" && DEFAULT_DAILY_DAYS.includes(valor);
    });
  }

  if (templateWeeklyDay) {
    templateWeeklyDay.value = "1";
  }
  if (templateWeeklyInterval) {
    templateWeeklyInterval.value = "1";
  }

  if (templateMonthlyFixed) {
    templateMonthlyFixed.checked = true;
  }
  if (templateMonthlyMulti) {
    templateMonthlyMulti.checked = false;
  }
  if (templateMonthlyDay) {
    templateMonthlyDay.value = "10";
  }
  if (templateMonthlyDaysInput) {
    templateMonthlyDaysInput.value = "";
  }
}

function resetTemplateMonthlyModeFields(mode) {
  if (mode === "fixed") {
    if (templateMonthlyDaysInput) {
      templateMonthlyDaysInput.value = "";
    }
    if (templateMonthlyDay && (!templateMonthlyDay.value || Number(templateMonthlyDay.value) < 1)) {
      templateMonthlyDay.value = "10";
    }
  } else {
    if (templateMonthlyDay) {
      templateMonthlyDay.value = "";
    }
  }
}

function aplicarPresetDiasUteis() {
  if (!templateDailyDays.length) {
    return;
  }
  templateDailyDays.forEach((checkbox) => {
    const valor = Number(checkbox.value);
    checkbox.checked = DEFAULT_DAILY_DAYS.includes(valor);
  });
  setFieldError(templateDailyErro, "");
  updateTemplateResumo();
}

function aplicarPresetModelo(tipo) {
  if (!templateFrequencia) {
    return;
  }
  if (templateInicio && !templateInicio.value) {
    templateInicio.value = formatDateISO(new Date());
  }
  if (tipo === "hv-daily") {
    templateFrequencia.value = "daily";
    atualizarTemplateFrequenciaUI(true);
    aplicarPresetDiasUteis();
    return;
  }
  if (tipo === "weekly") {
    templateFrequencia.value = "weekly";
    atualizarTemplateFrequenciaUI(true);
    if (templateWeeklyDay) {
      templateWeeklyDay.value = "1";
    }
    if (templateWeeklyInterval) {
      templateWeeklyInterval.value = "1";
    }
    updateTemplateResumo();
    return;
  }
  if (tipo === "monthly") {
    templateFrequencia.value = "monthly";
    atualizarTemplateFrequenciaUI(true);
    if (templateMonthlyFixed) {
      templateMonthlyFixed.checked = true;
    }
    if (templateMonthlyMulti) {
      templateMonthlyMulti.checked = false;
    }
    if (templateMonthlyDay) {
      templateMonthlyDay.value = "10";
    }
    if (templateMonthlyDaysInput) {
      templateMonthlyDaysInput.value = "";
    }
    atualizarTemplateMonthlyUI(true);
  }
}

function atualizarTemplateMonthlyUI(limparCampos = false) {
  if (!templateMonthlyModeField) {
    return;
  }
  const isMonthly = templateFrequencia && templateFrequencia.value === "monthly";
  const isFixed = templateMonthlyFixed ? templateMonthlyFixed.checked : true;
  if (limparCampos && isMonthly) {
    resetTemplateMonthlyModeFields(isFixed ? "fixed" : "multi");
    clearTemplateErrors();
    mostrarMensagemTemplate("");
  }
  templateMonthlyModeField.hidden = !isMonthly;
  if (templateMonthlyDayField) {
    templateMonthlyDayField.hidden = !isMonthly || !isFixed;
  }
  if (templateMonthlyDaysField) {
    templateMonthlyDaysField.hidden = !isMonthly || isFixed;
  }
  updateMonthlyDaysChips();
  updateTemplateResumo();
}

function atualizarTemplateFrequenciaUI(limparCampos = false) {
  if (!templateFrequencia) {
    return;
  }
  const tipo = templateFrequencia.value;
  if (limparCampos) {
    resetTemplateFieldsForTipo(tipo);
    clearTemplateErrors();
    mostrarMensagemTemplate("");
  }
  if (templateDailyField) {
    templateDailyField.hidden = tipo !== "daily";
  }
  if (templateWeeklyDayField) {
    templateWeeklyDayField.hidden = tipo !== "weekly";
  }
  if (templateWeeklyIntervalField) {
    templateWeeklyIntervalField.hidden = tipo !== "weekly";
  }
  if (templateInicioField) {
    templateInicioField.hidden = false;
  }
  atualizarTemplateMonthlyUI();
  updateTemplateResumo();
}

function limparTemplateForm() {
  if (!templateForm) {
    return;
  }
  templateForm.reset();
  templateForm.dataset.templateId = "";
  clearTemplateErrors();
  mostrarMensagemTemplate("");
  if (templateInicio) {
    templateInicio.value = formatDateISO(new Date());
  }
  if (templateDailyDays.length) {
    templateDailyDays.forEach((checkbox) => {
      const valor = Number(checkbox.value);
      checkbox.checked = DEFAULT_DAILY_DAYS.includes(valor);
    });
  }
  if (templateWeeklyDay) {
    templateWeeklyDay.value = "1";
  }
  if (templateWeeklyInterval) {
    templateWeeklyInterval.value = "1";
  }
  if (templateMonthlyFixed) {
    templateMonthlyFixed.checked = true;
  }
  if (templateMonthlyMulti) {
    templateMonthlyMulti.checked = false;
  }
  if (templateMonthlyDay) {
    templateMonthlyDay.value = "10";
  }
  if (templateMonthlyDaysInput) {
    templateMonthlyDaysInput.value = "";
  }
  updateMonthlyDaysChips();
  atualizarTemplateFrequenciaUI();
  updateTemplateResumo();
}

function preencherTemplateForm(template) {
  if (!templateForm || !template) {
    return;
  }
  templateForm.dataset.templateId = template.id;
  clearTemplateErrors();
  mostrarMensagemTemplate("");
  if (templateNome) {
    templateNome.value = template.nome || "";
  }
  if (templateSubestacao && template.subestacao) {
    templateSubestacao.value = template.subestacao;
  }
  if (templateFrequencia) {
    templateFrequencia.value = template.frequencia || "none";
  }
  if (templateDailyDays.length) {
    const dias = normalizeDailyDays(template.dailyDays);
    templateDailyDays.forEach((checkbox) => {
      const valor = Number(checkbox.value);
      checkbox.checked = dias.includes(valor);
    });
  }
  if (templateWeeklyDay) {
    const weekdayValue = Number(template.weeklyDay);
    templateWeeklyDay.value =
      Number.isFinite(weekdayValue) && weekdayValue >= 0 ? String(weekdayValue) : "1";
  }
  if (templateWeeklyInterval) {
    templateWeeklyInterval.value = template.weeklyInterval || 1;
  }
  if (templateMonthlyFixed && templateMonthlyMulti) {
    const modo = template.monthlyMode === "multi" ? "multi" : "fixed";
    templateMonthlyFixed.checked = modo === "fixed";
    templateMonthlyMulti.checked = modo === "multi";
  }
  if (templateMonthlyDay) {
    templateMonthlyDay.value = template.monthlyDay || 10;
  }
  if (templateMonthlyDaysInput) {
    const diasMes = normalizeMonthlyDays(template.monthlyDays);
    templateMonthlyDaysInput.value = diasMes.length ? diasMes.join(", ") : "";
  }
  if (templateInicio) {
    templateInicio.value = template.inicio || formatDateISO(new Date());
  }
  if (templateObs) {
    templateObs.value = template.observacao || "";
  }
  if (templateAtivo) {
    templateAtivo.checked = template.ativo !== false;
  }
  updateMonthlyDaysChips();
  atualizarTemplateFrequenciaUI();
  updateTemplateResumo();
}

function salvarModelo(event) {
  event.preventDefault();
  if (!isAdmin()) {
    mostrarMensagemTemplate("Apenas administradores podem criar modelos.", true);
    return;
  }
  clearTemplateErrors();
  mostrarMensagemTemplate("");
  const nome = templateNome ? templateNome.value.trim() : "";
  if (!nome) {
    setFieldError(templateNomeErro, "Informe o nome do modelo.");
    return;
  }
  const subestacao = templateSubestacao ? templateSubestacao.value.trim() : "";
  const frequencia = templateFrequencia ? templateFrequencia.value : "none";
  const inicio = templateInicio ? templateInicio.value : formatDateISO(new Date());

  const dailyDays = getDailyDaysFromForm();
  const weeklyDayValue = templateWeeklyDay ? Number(templateWeeklyDay.value) : NaN;
  const weeklyDay = Number.isFinite(weeklyDayValue) ? weeklyDayValue : 1;
  const weeklyIntervalValue = templateWeeklyInterval ? Number(templateWeeklyInterval.value) : 1;
  const weeklyIntervalValid =
    Number.isFinite(weeklyIntervalValue) && weeklyIntervalValue >= 1 && Number.isInteger(weeklyIntervalValue);
  const weeklyInterval = weeklyIntervalValid ? weeklyIntervalValue : 1;

  const monthlyMode =
    templateMonthlyMulti && templateMonthlyMulti.checked ? "multi" : "fixed";
  const monthlyDayValue = templateMonthlyDay ? Number(templateMonthlyDay.value) : NaN;
  const monthlyDayValid =
    Number.isFinite(monthlyDayValue) &&
    Number.isInteger(monthlyDayValue) &&
    monthlyDayValue >= 1 &&
    monthlyDayValue <= 31;
  const monthlyDay = monthlyDayValid ? monthlyDayValue : 1;
  const monthlyValidation = validateMonthlyDaysInput(
    templateMonthlyDaysInput ? templateMonthlyDaysInput.value : ""
  );
  const monthlyDays = monthlyValidation.valid ? monthlyValidation.dias : [];

  if (!parseDate(inicio)) {
    setFieldError(templateInicioErro, "Data de inicio invalida.");
    return;
  }
  if (frequencia === "daily" && !dailyDays.length) {
    setFieldError(templateDailyErro, "Selecione ao menos um dia.");
    return;
  }
  if (frequencia === "weekly" && (!Number.isFinite(weeklyDay) || !weeklyIntervalValid)) {
    setFieldError(templateWeeklyIntervalErro, "Informe um intervalo semanal valido (>= 1).");
    return;
  }
  if (frequencia === "monthly") {
    if (monthlyMode === "fixed" && !monthlyDayValid) {
      setFieldError(templateMonthlyDayErro, "Informe um dia do mes valido (1 a 31).");
      return;
    }
    if (monthlyMode === "multi") {
      if (!monthlyValidation.valid) {
        setFieldError(
          templateMonthlyDaysErro,
          "Informe dias validos entre 1 e 31 (ex.: 10, 25)."
        );
        return;
      }
      if (!monthlyDays.length) {
        setFieldError(
          templateMonthlyDaysErro,
          "Informe ao menos um dia do mes para a recorrencia."
        );
        return;
      }
      if (templateMonthlyDaysInput) {
        templateMonthlyDaysInput.value = monthlyDays.join(", ");
      }
    }
  }

  const ativo = Boolean(templateAtivo.checked);
  const templateId = templateForm.dataset.templateId || criarId();
  const existente = templates.find((item) => item.id === templateId);

  const modelo = {
    id: templateId,
    nome,
    subestacao,
    frequencia,
    dailyDays: frequencia === "daily" ? dailyDays : [],
    weeklyDay: frequencia === "weekly" ? weeklyDay : null,
    weeklyInterval: frequencia === "weekly" ? weeklyInterval : 1,
    monthlyMode: frequencia === "monthly" ? monthlyMode : "fixed",
    monthlyDay: frequencia === "monthly" ? monthlyDay : null,
    monthlyDays: frequencia === "monthly" && monthlyMode === "multi" ? monthlyDays : [],
    inicio,
    proximaData: "",
    observacao: templateObs ? templateObs.value.trim() : "",
    ativo,
    createdAt: existente ? existente.createdAt : toIsoUtc(new Date()),
    createdBy: existente ? existente.createdBy : (currentUser ? currentUser.id : SYSTEM_USER_ID),
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser ? currentUser.id : SYSTEM_USER_ID,
  };
  modelo.proximaData = calcularProximaData(modelo);

  if (existente) {
    templates = templates.map((item) => (item.id === templateId ? modelo : item));
  } else {
    templates = [...templates, modelo];
  }
  salvarTemplates(templates);
  gerarManutencoesRecorrentes();
  renderTudo();
  limparTemplateForm();
  mostrarMensagemTemplate("Modelo salvo.");
}

function removerModelo(item) {
  if (!isAdmin()) {
    return;
  }
  const templateId = item.dataset.templateId;
  const template = templates.find((registro) => registro.id === templateId);
  if (!template) {
    return;
  }
  const confirmar = window.confirm(
    `Remover o modelo \"${template.nome}\"? As ocorrencias ja geradas permanecem.`
  );
  if (!confirmar) {
    return;
  }
  templates = templates.filter((registro) => registro.id !== templateId);
  salvarTemplates(templates);
  renderTudo();
  mostrarMensagemTemplate("Modelo removido.");
}

function alternarModelo(item) {
  if (!isAdmin()) {
    return;
  }
  const templateId = item.dataset.templateId;
  const template = templates.find((registro) => registro.id === templateId);
  if (!template) {
    return;
  }
  template.ativo = !template.ativo;
  salvarTemplates(templates);
  gerarManutencoesRecorrentes();
  renderTudo();
}

function renderModelos() {
  if (!listaModelos) {
    return;
  }
  listaModelos.innerHTML = "";
  const existentes = templates.filter((item) => item && item.nome);
  if (existentes.length === 0) {
    if (modelosVazio) {
      modelosVazio.textContent = "Nenhum modelo cadastrado.";
      modelosVazio.hidden = false;
    }
    return;
  }

  if (templateFilterSubestacao) {
    const atual = templateFilterSubestacao.value;
    const subestacoes = Array.from(
      new Set([...SUBESTACOES, ...existentes.map((item) => item.subestacao).filter(Boolean)])
    ).sort((a, b) => a.localeCompare(b, "pt-BR"));
    templateFilterSubestacao.innerHTML = "";
    const optionAll = document.createElement("option");
    optionAll.value = "";
    optionAll.textContent = "Todas";
    templateFilterSubestacao.append(optionAll);
    subestacoes.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      templateFilterSubestacao.append(option);
    });
    if (atual && subestacoes.includes(atual)) {
      templateFilterSubestacao.value = atual;
    }
  }

  const termo = templateSearch ? templateSearch.value.trim().toLowerCase() : "";
  const filtroSubestacao = templateFilterSubestacao ? templateFilterSubestacao.value : "";
  const ordenacao = templateSort ? templateSort.value : "next";

  const filtrados = existentes.filter((template) => {
    if (filtroSubestacao && template.subestacao !== filtroSubestacao) {
      return false;
    }
    if (!termo) {
      return true;
    }
    const subestacaoLabel = template.subestacao || "";
    const alvo = `${template.nome} ${subestacaoLabel} ${formatIntervalo(template)}`
      .toLowerCase()
      .trim();
    return alvo.includes(termo);
  });

  if (!filtrados.length) {
    if (modelosVazio) {
      modelosVazio.textContent = "Nenhum modelo encontrado.";
      modelosVazio.hidden = false;
    }
    return;
  }
  if (modelosVazio) {
    modelosVazio.textContent = "Nenhum modelo cadastrado.";
    modelosVazio.hidden = true;
  }

  const agora = new Date();
  const ordenados = filtrados
    .map((template) => {
      const proximaDate =
        template.ativo && template.frequencia !== "none"
          ? getNextOccurrenceDate(template, agora)
          : null;
      return { template, proximaDate };
    })
    .sort((a, b) => {
      if (ordenacao === "next") {
        const aTime = a.proximaDate ? a.proximaDate.getTime() : Number.POSITIVE_INFINITY;
        const bTime = b.proximaDate ? b.proximaDate.getTime() : Number.POSITIVE_INFINITY;
        if (aTime !== bTime) {
          return aTime - bTime;
        }
      }
      return a.template.nome.localeCompare(b.template.nome, "pt-BR");
    });

  ordenados.forEach(({ template, proximaDate }) => {
    const item = document.createElement("div");
    item.className = "template-item";
    item.dataset.templateId = template.id;

    const titulo = document.createElement("strong");
    titulo.textContent = template.nome;

    const metaTop = document.createElement("p");
    metaTop.className = "template-meta";
    const subestacaoLabel = template.subestacao || "-";
    metaTop.textContent = `${subestacaoLabel} | ${formatIntervalo(template)}`;

    const proximaLabel = template.ativo
      ? template.frequencia === "none"
        ? "Sem recorrencia"
        : proximaDate
          ? formatDate(proximaDate)
          : "Sem proxima"
      : "Desativado";

    const metaBottom = document.createElement("p");
    metaBottom.className = "template-meta";
    metaBottom.textContent = `Proxima: ${proximaLabel}`;

    const status = document.createElement("span");
    status.className = "account-label";
    status.textContent = template.ativo ? "Ativo" : "Desativado";

    const actions = document.createElement("div");
    actions.className = "template-actions";
    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn btn--ghost btn--small";
    btnEditar.dataset.action = "edit-template";
    btnEditar.textContent = "Editar";
    const btnToggle = document.createElement("button");
    btnToggle.type = "button";
    btnToggle.className = "btn btn--ghost btn--small";
    btnToggle.dataset.action = "toggle-template";
    btnToggle.textContent = template.ativo ? "Desativar" : "Ativar";
    const btnRemover = document.createElement("button");
    btnRemover.type = "button";
    btnRemover.className = "btn btn--ghost btn--small btn--danger";
    btnRemover.dataset.action = "delete-template";
    btnRemover.textContent = "Remover";
    actions.append(btnEditar, btnToggle, btnRemover);

    item.append(titulo, metaTop, metaBottom, status, actions);
    listaModelos.append(item);
  });
}

function gerarManutencoesRecorrentes() {
  if (!templates.length) {
    return false;
  }
  const hoje = startOfDay(new Date());
  const limite = addDays(hoje, Math.max(reminderDays, 1));
  const existentes = new Set(
    manutencoes
      .filter((item) => item.templateId && item.data)
      .map((item) => `${item.templateId}|${item.data}`)
  );

  let mudou = false;
  let mudouTemplates = false;

  templates = templates.map((template) => {
    if (!template) {
      return template;
    }

    const normalizado = normalizarTemplate(template);
    let modelo = normalizado.template;
    if (normalizado.mudou) {
      mudouTemplates = true;
    }

    if (!modelo.ativo || modelo.frequencia === "none") {
      return modelo;
    }

    const inicio = parseDate(modelo.inicio);
    let base = hoje;
    if (inicio && inicio > base) {
      base = inicio;
    }

    for (let atual = base; atual <= limite; atual = addDays(atual, 1)) {
      if (!matchesRecorrencia(modelo, atual)) {
        continue;
      }
      const dataStr = formatDateISO(atual);
      const key = `${modelo.id}|${dataStr}`;
      if (existentes.has(key)) {
        continue;
      }
      const agoraIso = toIsoUtc(new Date());
      const nova = {
        id: criarId(),
        titulo: modelo.nome,
        local: modelo.subestacao,
        data: dataStr,
        observacao: modelo.observacao || "",
        templateId: modelo.id,
        status: "agendada",
        createdAt: agoraIso,
        createdBy: SYSTEM_USER_ID,
        updatedAt: agoraIso,
        updatedBy: SYSTEM_USER_ID,
      };
      manutencoes = [...manutencoes, nova];
      existentes.add(key);
      logAction(
        "create",
        nova,
        {
          source: "recorrente",
          templateId: modelo.id,
          dataProgramada: dataStr,
          resumo: "Manutencao criada automaticamente pela recorrencia.",
        },
        SYSTEM_USER_ID
      );
      mudou = true;
    }

    const proxima = getNextOccurrenceDate(modelo, hoje);
    const proximaStr = proxima ? formatDateISO(proxima) : "";
    if (proximaStr !== modelo.proximaData) {
      modelo = { ...modelo, proximaData: proximaStr };
      mudouTemplates = true;
    }
    return modelo;
  });

  if (mudou) {
    salvarManutencoes(manutencoes);
  }
  if (mudou || mudouTemplates) {
    salvarTemplates(templates);
  }
  return mudou || mudouTemplates;
}

function renderSolicitacoes() {
  if (!listaSolicitacoes || !solicitacoesVazio) {
    return;
  }
  listaSolicitacoes.innerHTML = "";
  if (requests.length === 0) {
    solicitacoesVazio.hidden = false;
    return;
  }
  solicitacoesVazio.hidden = true;

  requests.forEach((request) => {
    const item = document.createElement("div");
    item.className = "account-item";
    item.dataset.requestId = request.id;

    const header = document.createElement("div");
    header.className = "account-header";

    const info = document.createElement("div");
    const titulo = document.createElement("strong");
    titulo.textContent = request.nome;
    const meta = document.createElement("p");
    meta.className = "account-meta";
    meta.textContent = `Matricula: ${request.matricula}`;
    info.append(titulo, meta);

    const role = document.createElement("div");
    role.className = "perm-item";
    const roleInput = document.createElement("input");
    roleInput.type = "checkbox";
    roleInput.dataset.role = "admin";
    const roleLabel = document.createElement("label");
    roleLabel.textContent = "Administrador";
    role.append(roleInput, roleLabel);

    header.append(info, role);

    const perms = document.createElement("div");
    perms.className = "perm-grid";
    Object.keys(PERMISSIONS).forEach((key) => {
      const permItem = document.createElement("label");
      permItem.className = "perm-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.dataset.permission = key;
      const text = document.createElement("span");
      text.textContent = PERMISSIONS[key];
      permItem.append(checkbox, text);
      perms.append(permItem);
    });

    const sectionsLabel = document.createElement("span");
    sectionsLabel.className = "account-label";
    sectionsLabel.textContent = "Secoes";

    const sections = document.createElement("div");
    sections.className = "perm-grid";
    Object.keys(SECTION_LABELS).forEach((key) => {
      const sectionItem = document.createElement("label");
      sectionItem.className = "perm-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.dataset.section = key;
      const text = document.createElement("span");
      text.textContent = SECTION_LABELS[key];
      sectionItem.append(checkbox, text);
      sections.append(sectionItem);
    });

    const actions = document.createElement("div");
    actions.className = "manutencao-actions";
    const btnAprovar = document.createElement("button");
    btnAprovar.type = "button";
    btnAprovar.className = "btn btn--primary btn--small";
    btnAprovar.dataset.action = "approve";
    btnAprovar.textContent = "Aprovar";
    const btnRecusar = document.createElement("button");
    btnRecusar.type = "button";
    btnRecusar.className = "btn btn--ghost btn--small btn--danger";
    btnRecusar.dataset.action = "reject";
    btnRecusar.textContent = "Recusar";
    actions.append(btnAprovar, btnRecusar);

    item.append(header, perms, sectionsLabel, sections, actions);
    listaSolicitacoes.append(item);
  });
}

function renderUsuarios() {
  if (!listaUsuarios || !usuariosVazio) {
    return;
  }
  listaUsuarios.innerHTML = "";
  if (!currentUser || !canAdminUsersRead()) {
    usuariosVazio.hidden = false;
    usuariosVazio.textContent = "Acesso restrito.";
    return;
  }
  if (users.length === 0) {
    usuariosVazio.hidden = false;
    usuariosVazio.textContent = "Nenhuma conta cadastrada.";
    return;
  }

  const filtroNome = normalizeSearchValue(userFiltroNome ? userFiltroNome.value : "");
  const filtroCargo = normalizeSearchValue(userFiltroCargo ? userFiltroCargo.value : "");
  const filtroProjeto = normalizeSearchValue(userFiltroProjeto ? userFiltroProjeto.value : "");
  const filtroStatus = userFiltroStatus ? userFiltroStatus.value : "";

  const filtrados = users.filter((user) => {
    const nome = normalizeSearchValue(user.name || "");
    const cargo = normalizeSearchValue(user.cargo || "");
    const projeto = normalizeSearchValue(user.projeto || user.localizacao || "");
    const matricula = normalizeSearchValue(user.matricula || user.username || "");
    const ativo = user.active !== false;

    if (filtroNome && !nome.includes(filtroNome) && !matricula.includes(filtroNome)) {
      return false;
    }
    if (filtroCargo && !cargo.includes(filtroCargo)) {
      return false;
    }
    if (filtroProjeto && !projeto.includes(filtroProjeto)) {
      return false;
    }
    if (filtroStatus === "active" && !ativo) {
      return false;
    }
    if (filtroStatus === "inactive" && ativo) {
      return false;
    }
    return true;
  });

  if (filtrados.length === 0) {
    usuariosVazio.hidden = false;
    usuariosVazio.textContent = "Nenhum usuario encontrado.";
    return;
  }

  usuariosVazio.hidden = true;
  filtrados.forEach((user) => {
    const item = document.createElement("div");
    item.className = "account-item is-clickable";
    item.dataset.userId = user.id;
    item.tabIndex = 0;
    const header = document.createElement("div");
    header.className = "account-header";
    const titulo = document.createElement("strong");
    titulo.textContent = user.name || user.matricula || "Usuario";
    const status = document.createElement("span");
    status.className = `status-pill ${user.active === false ? "status-pill--inactive" : "status-pill--active"}`;
    status.textContent = user.active === false ? "Inativo" : "Ativo";
    header.append(titulo, status);
    const meta = document.createElement("p");
    meta.className = "account-meta";
    const roleLabel = getRoleLabel(user);
    meta.textContent = `Matricula: ${user.matricula || "-"} | Perfil: ${roleLabel}`;
    const detalhes = document.createElement("p");
    detalhes.className = "account-meta";
    detalhes.textContent = `Cargo: ${user.cargo || "-"} | Projeto: ${user.projeto || user.localizacao || "-"}`;
    item.append(header, meta, detalhes);
    listaUsuarios.append(item);
  });
}

function renderPerfil() {
  if (!perfilNome) {
    return;
  }

  if (!currentUser) {
    perfilNome.textContent = "-";
    if (perfilMatricula) {
      perfilMatricula.textContent = "-";
    }
    if (perfilCargo) {
      perfilCargo.textContent = "-";
    }
    if (perfilProjeto) {
      perfilProjeto.textContent = "-";
    }
    if (perfilRole) {
      perfilRole.textContent = "-";
    }
    if (perfilAtribuicoes) {
      perfilAtribuicoes.textContent = "-";
    }
    if (perfilPermissoes) {
      perfilPermissoes.textContent = "-";
    }
    if (perfilSecoes) {
      perfilSecoes.textContent = "-";
    }
    pendingAvatarDataUrl = "";
    if (btnAvatarSave) {
      btnAvatarSave.disabled = true;
    }
    setAvatarError("");
    applyAvatarToElement(perfilAvatarPreview, "");
    applyAvatarToElement(userAvatar, "");
    return;
  }

  const isAdminUser = currentUser.role === "admin";
  const secConfig = getSectionConfig(currentUser);
  const permissoesAtivas = Object.keys(PERMISSIONS)
    .filter((key) => !isAdminUser && currentUser.permissions && currentUser.permissions[key])
    .map((key) => PERMISSIONS[key]);
  const secoesAtivas = Object.keys(SECTION_LABELS)
    .filter((key) => secConfig[key])
    .map((key) => SECTION_LABELS[key]);

  perfilNome.textContent = currentUser.name || "-";
  if (perfilMatricula) {
    perfilMatricula.textContent = currentUser.matricula || currentUser.username || "-";
  }
  if (perfilCargo) {
    perfilCargo.textContent = currentUser.cargo || "-";
  }
  if (perfilProjeto) {
    perfilProjeto.textContent = currentUser.projeto || "-";
  }
  if (perfilRole) {
    perfilRole.textContent = getRoleLabel(currentUser);
  }
  if (perfilAtribuicoes) {
    perfilAtribuicoes.textContent = currentUser.atribuicoes || "Nao informado.";
  }
  if (perfilPermissoes) {
    perfilPermissoes.textContent = isAdminUser
      ? "Total"
      : permissoesAtivas.length
        ? permissoesAtivas.join(", ")
        : "Sem permissoes.";
  }
  if (perfilSecoes) {
    perfilSecoes.textContent = isAdminUser
      ? "Todas (inclui governanca)"
      : secoesAtivas.length
        ? secoesAtivas.join(", ")
        : "Nenhuma.";
  }

  const avatarUrl = pendingAvatarDataUrl || getAvatarUrl(currentUser);
  applyAvatarToElement(perfilAvatarPreview, avatarUrl);
  applyAvatarToElement(userAvatar, getAvatarUrl(currentUser));
}

function renderAuthUI() {
  const autenticado = Boolean(currentUser);
  document.body.classList.toggle("is-authenticated", autenticado);
  document.body.classList.toggle("is-admin", isAdmin());
  document.body.classList.toggle("is-visitor", !autenticado);

  if (!autenticado) {
    fecharPainelLembretes();
    esconderCarregando();
    dashboardSummary = null;
    dashboardError = "";
    dashboardLastFetch = 0;
    maintenanceLastSync = 0;
    maintenanceLastUserId = null;
    if (maintenanceSyncTimer) {
      clearTimeout(maintenanceSyncTimer);
      maintenanceSyncTimer = null;
    }
  }

  if (autenticado) {
    usuarioAtual.textContent = getDisplayName(currentUser);
    usuarioAtual.hidden = false;
    btnTabLogin.hidden = true;
    btnTabRegistro.hidden = true;
    btnSair.hidden = false;
    esconderAuthPanels();
    if (maintenanceLastUserId !== currentUser.id) {
      scheduleMaintenanceSync(manutencoes, true);
    }
  } else {
    usuarioAtual.textContent = "Visitante";
    usuarioAtual.hidden = true;
    btnTabLogin.hidden = false;
    btnTabRegistro.hidden = false;
    btnSair.hidden = true;
    pendingAvatarDataUrl = "";
    if (btnAvatarSave) {
      btnAvatarSave.disabled = true;
    }
    setAvatarError("");
    applyAvatarToElement(perfilAvatarPreview, "");
    applyAvatarToElement(userAvatar, "");
  }

  const secConfig = getSectionConfig(currentUser);

  tabButtons.forEach((botao) => {
    const tab = botao.dataset.tab;
    if (ADMIN_SECTIONS.includes(tab)) {
      botao.hidden = !isAdmin();
      return;
    }
    botao.hidden = !autenticado || !secConfig[tab];
  });

  panels.forEach((panel) => {
    const nome = panel.dataset.panel;
    if (ADMIN_SECTIONS.includes(nome)) {
      panel.hidden = !isAdmin();
      return;
    }
    panel.hidden = !autenticado || !secConfig[nome];
  });

  const tabAtiva = Array.from(tabButtons).find(
    (botao) => botao.classList.contains("is-active") || botao.classList.contains("active")
  );
  if (!tabAtiva || tabAtiva.hidden) {
    const primeira = Array.from(tabButtons).find((botao) => !botao.hidden);
    if (primeira) {
      ativarTab(primeira.dataset.tab);
    }
  }

  adminElements.forEach((section) => {
    section.hidden = !isAdmin();
  });

  if (btnAdicionarManutencao) {
    const podeCriar = can("create") && secConfig.nova !== false;
    btnAdicionarManutencao.disabled = !podeCriar;
    btnAdicionarManutencao.classList.toggle("is-disabled", !podeCriar);
  }

  if (diasLembrete) {
    diasLembrete.textContent = reminderDays;
  }

  if (configDiasLembrete && configDiasLembrete.value !== String(reminderDays)) {
    configDiasLembrete.value = reminderDays;
  }
}

function initAvatarUpload() {
  if (!perfilAvatarInput || !btnAvatarChange || !btnAvatarSave) {
    return;
  }

  btnAvatarChange.addEventListener("click", () => {
    perfilAvatarInput.click();
  });

  perfilAvatarInput.addEventListener("change", () => {
    pendingAvatarDataUrl = "";
    btnAvatarSave.disabled = true;
    setAvatarError("");

    const file = perfilAvatarInput.files && perfilAvatarInput.files[0];
    if (!file) {
      applyAvatarToElement(perfilAvatarPreview, getAvatarUrl(currentUser));
      return;
    }
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      setAvatarError("Formato de imagem nao suportado.");
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError("Imagem acima de 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      pendingAvatarDataUrl = String(reader.result || "");
      if (!pendingAvatarDataUrl) {
        setAvatarError("Falha ao ler a imagem.");
        return;
      }
      applyAvatarToElement(perfilAvatarPreview, pendingAvatarDataUrl);
      btnAvatarSave.disabled = false;
    };
    reader.onerror = () => {
      setAvatarError("Falha ao ler a imagem.");
    };
    reader.readAsDataURL(file);
  });

  btnAvatarSave.addEventListener("click", async () => {
    if (!pendingAvatarDataUrl) {
      return;
    }
    btnAvatarSave.disabled = true;
    setAvatarError("");
    try {
      const data = await apiUploadAvatar(pendingAvatarDataUrl);
      if (data && data.user) {
        currentUser = data.user;
      } else if (currentUser && data && data.avatarUrl) {
        currentUser.avatarUrl = data.avatarUrl;
        currentUser.avatarUpdatedAt = data.avatarUpdatedAt || new Date().toISOString();
      }
      pendingAvatarDataUrl = "";
      perfilAvatarInput.value = "";
      renderAuthUI();
      renderPerfil();
    } catch (error) {
      const message = error && error.message ? error.message : "Falha ao salvar foto.";
      setAvatarError(message);
      btnAvatarSave.disabled = false;
    }
  });
}

function exportarDados() {
  if (!isAdmin()) {
    mostrarMensagemGerencial("Apenas administradores podem exportar dados.", true);
    return;
  }
  const payload = {
    manutencoes,
    templates,
    users,
    requests,
    auditLog,
    config: { reminderDays },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dataAtual = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `denemanu-backup-${dataAtual}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  mostrarMensagemGerencial("Backup exportado.");
}

function importarDados() {
  if (!isAdmin()) {
    mostrarMensagemGerencial("Apenas administradores podem importar dados.", true);
    return;
  }
  const arquivo =
    inputImportarDados && inputImportarDados.files ? inputImportarDados.files[0] : null;
  if (!arquivo) {
    mostrarMensagemGerencial("Selecione um arquivo JSON.", true);
    return;
  }
  const confirmar = window.confirm("Importar dados vai substituir as informacoes locais. Continuar?");
  if (!confirmar) {
    return;
  }
  const leitor = new FileReader();
  leitor.onload = () => {
    try {
      const data = JSON.parse(leitor.result);
      if (data.manutencoes && Array.isArray(data.manutencoes)) {
        manutencoes = data.manutencoes;
      }
      if (data.templates && Array.isArray(data.templates)) {
        templates = data.templates;
      }
      garantirTemplatesPadrao();
      const normalizados = normalizarTemplates(templates);
      templates = normalizados.normalizadas;
      if (data.users && Array.isArray(data.users)) {
        users = data.users;
      }
      if (data.requests && Array.isArray(data.requests)) {
        requests = data.requests;
      }
      if (data.auditLog && Array.isArray(data.auditLog)) {
        auditLog = data.auditLog;
      }
      iniciarAuditChain();
      if (data.config && Number.isFinite(Number(data.config.reminderDays))) {
        reminderDays = Number(data.config.reminderDays);
      }
      salvarManutencoes(manutencoes);
      salvarTemplates(templates);
      salvarUsuarios(users);
      salvarSolicitacoes(requests);
      salvarAuditoria(auditLog);
      writeJson(REMINDER_KEY, reminderDays);
      gerarManutencoesRecorrentes();
      renderTudo();
      mostrarMensagemGerencial("Dados importados com sucesso.");
    } catch (error) {
      mostrarMensagemGerencial("Arquivo invalido ou corrompido.", true);
    }
  };
  leitor.readAsText(arquivo);
}

function limparConcluidas() {
  if (!isAdmin()) {
    mostrarMensagemGerencial("Apenas administradores podem limpar dados.", true);
    return;
  }
  const dias = Number(inputDiasLimpeza.value) || 30;
  const limite = Date.now() - dias * DAY_MS;
  const antes = manutencoes.length;
  manutencoes = manutencoes.filter((item) => {
    if (item.status !== "concluida") {
      return true;
    }
    if (!item.doneAt) {
      return false;
    }
    const doneAt = getTimeValue(item.doneAt);
    return doneAt !== null && doneAt >= limite;
  });
  const removidas = antes - manutencoes.length;
  salvarManutencoes(manutencoes);
  renderTudo();
  mostrarMensagemGerencial(`Concluidas removidas: ${removidas}.`);
}

function limparAuditoria() {
  if (!isAdmin()) {
    mostrarMensagemGerencial("Apenas administradores podem limpar auditoria.", true);
    return;
  }
  const confirmar = window.confirm("Limpar toda a auditoria?");
  if (!confirmar) {
    return;
  }
  auditLog = [];
  salvarAuditoria(auditLog);
  iniciarAuditChain();
  renderTudo();
  mostrarMensagemGerencial("Auditoria limpa.");
}

function recalcularBacklog() {
  atualizarSeNecessario();
  mostrarMensagemGerencial("Backlog recalculado.");
}

function gerarRelatorio() {
  const total = manutencoes.length;
  const agendadas = manutencoes.filter(
    (item) => item.status === "agendada" || item.status === "liberada"
  ).length;
  const backlog = manutencoes.filter((item) => item.status === "backlog").length;
  const concluidas = manutencoes.filter((item) => item.status === "concluida");
  const taxaConclusao = total ? Math.round((concluidas.length / total) * 100) : 0;
  const pontuais = concluidas.filter((item) => {
    const data = parseDate(item.data);
    const doneAt = parseTimestamp(item.doneAt);
    if (!data || !doneAt) {
      return false;
    }
    return startOfDay(doneAt) <= startOfDay(data);
  });
  const taxaPontual = concluidas.length
    ? Math.round((pontuais.length / concluidas.length) * 100)
    : 0;

  const reagendamentos = auditLog.filter((entry) => entry.action === "reschedule");
  const reagendamentosTotal = reagendamentos.length;
  const motivosReagendamento = reagendamentos.reduce((acc, entry) => {
    const motivo =
      entry && entry.detalhes && entry.detalhes.motivo ? entry.detalhes.motivo : "Nao informado";
    acc[motivo] = (acc[motivo] || 0) + 1;
    return acc;
  }, {});
  const motivosTexto = Object.keys(motivosReagendamento).length
    ? Object.entries(motivosReagendamento)
        .sort((a, b) => b[1] - a[1])
        .map(([motivo, totalMotivo]) => `${motivo}: ${totalMotivo}`)
        .join(" | ")
    : "-";

  const backlogEventos = auditLog.filter((entry) => entry.action === "backlog_auto");
  const backlogEntradas = backlogEventos.length;
  const backlogUnicos = new Set(backlogEventos.map((entry) => entry.manutencaoId)).size;

  const hoje = startOfDay(new Date());
  const backlogItens = manutencoes
    .filter((item) => item.status === "backlog")
    .map((item) => {
      const data = parseDate(item.data);
      if (!data) {
        return null;
      }
      const atraso = diffInDays(startOfDay(data), hoje);
      return { item, atraso: Math.max(0, atraso) };
    })
    .filter(Boolean);
  const backlogSoma = backlogItens.reduce((acc, entry) => acc + entry.atraso, 0);
  const backlogMedio = backlogItens.length ? (backlogSoma / backlogItens.length).toFixed(1) : "-";
  const backlogTop = [...backlogItens].sort((a, b) => b.atraso - a.atraso).slice(0, 5);
  const backlogTopTexto = backlogTop.length
    ? backlogTop
        .map((entry) => `- ${entry.item.titulo} | ${entry.item.local} | ${entry.atraso}d`)
        .join("\n")
    : "-";

  const outrosObservacoes = reagendamentos
    .filter((entry) => entry.detalhes && entry.detalhes.motivo === "Outros")
    .map((entry) => (entry.detalhes.observacao || "").trim())
    .filter(Boolean);
  const outrosTotal = outrosObservacoes.length;
  const outrosContagem = outrosObservacoes.reduce((acc, obs) => {
    acc[obs] = (acc[obs] || 0) + 1;
    return acc;
  }, {});
  const outrosLista = Object.entries(outrosContagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const outrosTexto = outrosLista.length
    ? outrosLista.map(([obs, count]) => `- ${obs} (${count})`).join("\n")
    : "-";

  const manutencaoMap = new Map(manutencoes.map((item) => [item.id, item]));
  const templateMap = new Map(templates.map((item) => [item.id, item.nome]));
  const reagPorModelo = reagendamentos.reduce((acc, entry) => {
    const detalhe = entry.detalhes || {};
    const manutencao = manutencaoMap.get(entry.manutencaoId);
    const templateId = detalhe.templateId || (manutencao ? manutencao.templateId : "");
    const label = templateId ? templateMap.get(templateId) || "Modelo removido" : "Sem modelo";
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const reagPorModeloTexto = Object.keys(reagPorModelo).length
    ? Object.entries(reagPorModelo)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, count]) => `- ${label}: ${count}`)
        .join("\n")
    : "-";

  const execucaoDiffs = concluidas
    .map((item) => {
      const data = parseDate(item.data);
      const doneAt = parseTimestamp(item.doneAt);
      if (!data || !doneAt) {
        return null;
      }
      return diffInDays(startOfDay(data), startOfDay(doneAt));
    })
    .filter((value) => Number.isFinite(value));
  const somaExecucao = execucaoDiffs.reduce((acc, val) => acc + val, 0);
  const tempoMedioExecucao = execucaoDiffs.length ? (somaExecucao / execucaoDiffs.length).toFixed(1) : "-";
  const execAtrasos = execucaoDiffs.filter((diff) => diff > 0);
  const mediaAtrasoExec = execAtrasos.length
    ? (execAtrasos.reduce((acc, val) => acc + val, 0) / execAtrasos.length).toFixed(1)
    : "-";
  const execPontuais = execucaoDiffs.filter((diff) => diff === 0).length;
  const execAdiantadas = execucaoDiffs.filter((diff) => diff < 0).length;
  const execAtrasadas = execucaoDiffs.filter((diff) => diff > 0).length;
  const duracoesExecucao = concluidas
    .map((item) => (item.conclusao ? item.conclusao.duracaoMin : null))
    .filter((valor) => Number.isFinite(valor));
  const mediaDuracaoExecucao = duracoesExecucao.length
    ? formatDuracaoMin(
        duracoesExecucao.reduce((acc, val) => acc + val, 0) / duracoesExecucao.length
      )
    : "-";
  const execComRessalva = concluidas.filter(
    (item) => item.conclusao && item.conclusao.resultado === "ressalva"
  ).length;
  const execNaoExecutada = concluidas.filter(
    (item) => item.conclusao && item.conclusao.resultado === "nao_executada"
  ).length;
  const execucoesIniciadas = auditLog.filter((entry) => entry.action === "execute").length;
  const cancelamentosInicio = auditLog.filter((entry) => entry.action === "cancel_start");
  const execucoesCanceladas = cancelamentosInicio.length;
  const cancelMotivos = cancelamentosInicio.reduce((acc, entry) => {
    const motivo =
      entry && entry.detalhes && entry.detalhes.motivo ? entry.detalhes.motivo : "Nao informado";
    acc[motivo] = (acc[motivo] || 0) + 1;
    return acc;
  }, {});
  const cancelMotivosTexto = Object.keys(cancelMotivos).length
    ? Object.entries(cancelMotivos)
        .sort((a, b) => b[1] - a[1])
        .map(([motivo, totalMotivo]) => `${motivo}: ${totalMotivo}`)
        .join(" | ")
    : "-";
  const complianceDocs = concluidas.filter((item) => isLiberacaoOk(item)).length;
  const compliancePercent = concluidas.length
    ? Math.round((complianceDocs / concluidas.length) * 100)
    : 0;
  const evidenciasMedia = concluidas.length
    ? (
        concluidas.reduce((acc, item) => {
          const evidencias = item.conclusao && item.conclusao.evidencias;
          return acc + (Array.isArray(evidencias) ? evidencias.length : 0);
        }, 0) / concluidas.length
      ).toFixed(1)
    : "-";

  if (relatorioGerencial) {
    relatorioGerencial.textContent =
      `Total: ${total}\n` +
      `Agendadas: ${agendadas}\n` +
      `Backlog: ${backlog}\n` +
      `Concluidas: ${concluidas.length}\n` +
      `Conclusao: ${taxaConclusao}%\n` +
      `Percentual no prazo: ${taxaPontual}%\n` +
      `Reagendamentos: ${reagendamentosTotal}\n` +
      `Motivos de reagendamento: ${motivosTexto}\n` +
      `Reagendamentos por modelo (top 5):\n${reagPorModeloTexto}\n` +
      `Outros (total): ${outrosTotal}\n` +
      `Observacoes de Outros (top 10):\n${outrosTexto}\n` +
      `Backlog (entradas): ${backlogEntradas}\n` +
      `Backlog (manutencoes afetadas): ${backlogUnicos}\n` +
      `Backlog medio (dias): ${backlogMedio}\n` +
      `Top 5 atrasadas:\n${backlogTopTexto}\n` +
      `Tempo medio entre programada e execucao (dias): ${tempoMedioExecucao}\n` +
      `Tempo medio de execucao (HH:MM): ${mediaDuracaoExecucao}\n` +
      `Tempo medio de atraso (dias): ${mediaAtrasoExec}\n` +
        `Execucoes: ${execPontuais} no prazo, ${execAdiantadas} adiantadas, ${execAtrasadas} atrasadas\n` +
        `Execucoes com ressalva: ${execComRessalva}\n` +
        `Execucoes nao executadas: ${execNaoExecutada}\n` +
        `Execucoes iniciadas: ${execucoesIniciadas}\n` +
        `Inicios cancelados: ${execucoesCanceladas}\n` +
        `Motivos de cancelamento: ${cancelMotivosTexto}\n` +
        `Compliance documental: ${complianceDocs}/${concluidas.length} (${compliancePercent}%)\n` +
        `Evidencias medias por manutencao: ${evidenciasMedia}`;
  }
  mostrarMensagemGerencial("Relatorio atualizado.");
}

function renderTudo() {
  atualizarResumo();
  renderLembretes();
  renderProgramacao();
  renderListaStatus("backlog", listaBacklog, listaBacklogVazia, {
    allowedActions: ["release", "execute", "reschedule", "history"],
  });
  renderListaStatus("concluida", listaConcluidas, listaConcluidasVazia, {
    limit: 6,
    allowedActions: ["history"],
  });
  renderExecucao();
  renderKPIs();
  renderGrafico();
  renderAuditoria();
  renderRelatorios();
  renderRdoList();
  renderModelos();
  renderSolicitacoes();
  renderUsuarios();
  renderPerfil();
  renderSubestacoes();
  renderTipoOptions();
  renderAuthUI();
}
function atualizarSeNecessario() {
  const gerou = gerarManutencoesRecorrentes();
  const resultado = normalizarManutencoes(manutencoes);
  if (resultado.mudou) {
    manutencoes = resultado.normalizadas;
    salvarManutencoes(manutencoes);
    resultado.changes.forEach((change) => {
      if (change.to === "backlog") {
        const item = manutencoes.find((registro) => registro.id === change.id);
        if (item) {
          const dataProgramada = parseDate(item.data);
          const atrasoDias = dataProgramada
            ? Math.max(0, diffInDays(startOfDay(dataProgramada), startOfDay(new Date())))
            : null;
          logAction(
            "backlog_auto",
            item,
            {
              from: change.from,
              to: change.to,
              dataProgramada: item.data || "",
              atrasoDias,
              resumo: "Manutencao movida para backlog por nao conclusao ate a data programada.",
            },
            SYSTEM_USER_ID
          );
        }
      }
    });
    renderTudo();
    return;
  }
  if (gerou) {
    renderTudo();
  }
}

async function adicionarManutencao() {
  if (!requirePermission("create")) {
    return;
  }
  if (!requirePermission("complete")) {
    return;
  }
  const tipoSelecionado = tipoManutencao ? tipoManutencao.value : "";
  let titulo = "";
  let templateId = null;

  if (tipoSelecionado && tipoSelecionado !== CUSTOM_TIPO_OPTION) {
    const template = getTemplateById(tipoSelecionado);
    if (template) {
      titulo = template.nome;
      templateId = template.id;
    } else {
      titulo = tipoSelecionado.trim();
    }
  } else {
    titulo = tituloManutencao ? tituloManutencao.value.trim() : "";
  }

  const local = subestacaoManutencao ? subestacaoManutencao.value.trim() : "";
  const data = dataManutencao
    ? dataManutencao.value || formatDateISO(new Date())
    : "";
  if (dataManutencao && !dataManutencao.value) {
    dataManutencao.value = data;
  }
  const observacao = obsManutencao ? obsManutencao.value.trim() : "";
  const categoria = categoriaManutencao ? categoriaManutencao.value.trim() : "";
  const prioridade = prioridadeManutencao ? prioridadeManutencao.value.trim() : "";
  const osReferencia = osReferenciaManutencao ? osReferenciaManutencao.value.trim() : "";
  const participantesTexto = participantesManutencao ? participantesManutencao.value : "";
  const participantes = participantesTexto
    ? participantesTexto
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const criticoValor = criticoManutencao ? criticoManutencao.value : "nao";
  const critico = criticoValor === "sim";

  if (!titulo || !local || !data || !categoria || !prioridade) {
    mostrarMensagemManutencao(
      "Preencha tipo, subestacao, inicio da execucao, categoria e prioridade.",
      true
    );
    return;
  }
  if (!observacao) {
    mostrarMensagemManutencao("Descreva a demanda tecnica.", true);
    return;
  }
  if (!osReferencia) {
    mostrarMensagemManutencao("Informe a OS / referencia.", true);
    return;
  }
  setFieldError(participantesManutencaoErro, "");
  if (participantes.length < 2) {
    setFieldError(participantesManutencaoErro, "Informe ao menos 2 participantes.");
    mostrarMensagemManutencao("Informe ao menos 2 participantes.", true);
    return;
  }

  const documentos = {};
  let docsDb = null;
  const salvarDocumentoDb = async (file) => {
    if (!docsDb) {
      docsDb = await openDocsDB();
    }
    const docId = crypto.randomUUID();
    const registro = {
      docId,
      name: file.name,
      type: file.type || "",
      blob: file,
      createdAt: toIsoUtc(new Date()),
    };
    await new Promise((resolve, reject) => {
      const tx = docsDb.transaction("docs", "readwrite");
      const store = tx.objectStore("docs");
      const request = store.put(registro);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    return { docId, name: file.name, nome: file.name, type: file.type || "" };
  };
  for (const chave of DOC_KEYS) {
    const input = novaDocInputs.find((itemInput) => itemInput.dataset.novaDocInput === chave);
    const file = input && input.files && input.files[0] ? input.files[0] : null;
    if (file) {
      try {
        documentos[chave] = await salvarDocumentoDb(file);
      } catch (error) {
        mostrarMensagemManutencao("Nao foi possivel salvar o documento.", true);
        return;
      }
    }
  }
  if (!documentos.apr || !documentos.os || !documentos.pte) {
    mostrarMensagemManutencao("Anexe APR, OS e PTE para iniciar.", true);
    return;
  }
  if (critico && !documentos.pt) {
    mostrarMensagemManutencao("PT obrigatoria para trabalho critico.", true);
    return;
  }

  const agora = new Date();
  const agoraIso = toIsoUtc(agora);
  const usuarioLabel = getUserLabel(currentUser.id);
  const ultimaAcao = `Execucao iniciada em ${formatDateTime(agora)} por ${usuarioLabel}`;
  const liberacao = {
    osNumero: osReferencia,
    participantes,
    critico,
    documentos,
    liberadoEm: agoraIso,
    liberadoPor: currentUser.id,
  };
  const nova = {
    id: criarId(),
    titulo,
    local,
    data,
    observacao,
    templateId,
    status: "em_execucao",
    categoria,
    prioridade,
    criticidade: critico ? "sim" : "nao",
    osReferencia,
    participantes,
    documentos,
    abertaEm: agoraIso,
    inicioExecucao: agoraIso,
    abertaPor: currentUser.id,
    executadaPor: currentUser.id,
    ultimaAcao,
    executionStartedAt: agoraIso,
    executionStartedBy: currentUser.id,
    registroExecucao: { executadoPor: currentUser.id },
    liberacao,
    createdAt: agoraIso,
    createdBy: currentUser.id,
    updatedAt: agoraIso,
    updatedBy: currentUser.id,
  };

  manutencoes = [...manutencoes, nova];
  const resultado = normalizarManutencoes(manutencoes);
  manutencoes = resultado.normalizadas;
  salvarManutencoes(manutencoes);
  logAction("create", nova, {
    source: "manual",
    dataProgramada: data,
    resumo: "Manutencao criada e iniciada.",
  });
  const documentosLista = DOC_KEYS.filter((key) => documentos[key]).map(
    (key) => DOC_LABELS[key] || key
  );
  logAction("execute", nova, {
    dataProgramada: data,
    inicioExecucao: agoraIso,
    osNumero: osReferencia,
    participantes,
    critico,
    documentos: documentosLista,
    resumo: "Execucao iniciada.",
  });
  renderTudo();

  if (tituloManutencao) {
    tituloManutencao.value = "";
  }
  if (tipoManutencao) {
    tipoManutencao.value = templates.length === 0 ? CUSTOM_TIPO_OPTION : "";
    atualizarTipoSelecionado();
  }
  if (subestacaoManutencao && SUBESTACOES.length > 0) {
    subestacaoManutencao.value = SUBESTACOES[0];
  }
  if (dataManutencao) {
    dataManutencao.value = formatDateISO(new Date());
  }
  if (obsManutencao) {
    obsManutencao.value = "";
  }
  if (categoriaManutencao) {
    categoriaManutencao.value = "";
  }
  if (prioridadeManutencao) {
    prioridadeManutencao.value = "";
  }
  if (osReferenciaManutencao) {
    osReferenciaManutencao.value = "";
  }
  if (participantesManutencao) {
    participantesManutencao.value = "";
  }
  if (criticoManutencao) {
    criticoManutencao.value = "nao";
  }
  novaDocInputs.forEach((input) => {
    if (input) {
      input.value = "";
    }
  });
  atualizarNovaDocsUI();
  atualizarNovaCriticoUI();
  setFieldError(participantesManutencaoErro, "");
  if (customTipoField && !customTipoField.hidden && tituloManutencao) {
    tituloManutencao.focus();
  } else if (tipoManutencao) {
    tipoManutencao.focus();
  }

  const criada = manutencoes.find((item) => item.id === nova.id);
  if (criada) {
    abrirRegistroExecucao(criada);
  }
  mostrarMensagemManutencao("Execucao iniciada.");
}

let manutencaoEmConclusao = null;
let manutencaoEmRegistro = null;

function editarManutencao(index) {
  if (!requirePermission("edit")) {
    return;
  }
  const item = manutencoes[index];
  const novoTitulo = window.prompt("Novo titulo:", item.titulo);
  if (novoTitulo === null) {
    return;
  }
  const tituloLimpo = novoTitulo.trim();
  if (!tituloLimpo) {
    mostrarMensagemManutencao("Titulo invalido.", true);
    return;
  }
  const novoLocal = window.prompt("Novo local:", item.local);
  if (novoLocal === null) {
    return;
  }
  const localLimpo = novoLocal.trim();
  if (!localLimpo) {
    mostrarMensagemManutencao("Local invalido.", true);
    return;
  }
  const novaObs = window.prompt("Observacoes:", item.observacao || "");
  if (novaObs === null) {
    return;
  }

  const atualizado = {
    ...item,
    titulo: tituloLimpo,
    local: localLimpo,
    observacao: novaObs.trim(),
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
  };

  manutencoes[index] = atualizado;
  const resultado = normalizarManutencoes(manutencoes);
  manutencoes = resultado.normalizadas;
  salvarManutencoes(manutencoes);
  logAction("edit", atualizado, { resumo: "Edicao manual" });
  renderTudo();
  mostrarMensagemManutencao("Manutencao atualizada.");
}

function registrarObservacao(index) {
  if (!requirePermission("edit")) {
    return;
  }
  const item = manutencoes[index];
  const novaObs = window.prompt("Observacao tecnica:", item.observacao || "");
  if (novaObs === null) {
    return;
  }
  const obsLimpa = novaObs.trim();
  if (!obsLimpa) {
    mostrarMensagemManutencao("Observacao vazia.", true);
    return;
  }

  const atualizado = {
    ...item,
    observacao: obsLimpa,
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
  };

  manutencoes[index] = atualizado;
  const resultado = normalizarManutencoes(manutencoes);
  manutencoes = resultado.normalizadas;
  salvarManutencoes(manutencoes);
  logAction("note", atualizado, { resumo: "Observacao registrada" });
  renderTudo();
  mostrarMensagemManutencao("Observacao registrada.");
}

function collectDrawerPermissions() {
  const permissions = {};
  if (!drawerPermissions) {
    return permissions;
  }
  drawerPermissions.querySelectorAll("input[data-permission-key]").forEach((input) => {
    permissions[input.dataset.permissionKey] = input.checked;
  });
  return permissions;
}

function renderDrawerPermissions(user, overridePermissions = null) {
  if (!drawerPermissions) {
    return;
  }
  drawerPermissions.innerHTML = "";
  if (!adminPermissionCatalog.length) {
    const aviso = document.createElement("p");
    aviso.className = "hint";
    aviso.textContent = "Catalogo de permissoes indisponivel.";
    drawerPermissions.append(aviso);
    return;
  }
  const roleValue = drawerRole ? drawerRole.value : "";
  const resolvedRole =
    roleValue ||
    user.rbacRole ||
    (user.role === "admin" ? "pcm" : user.role === "supervisor" ? "supervisor_om" : "");
  const isFullAccess = FULL_ACCESS_RBAC.has(String(resolvedRole || "").toLowerCase());
  const permissaoEdicao = canAdminUsersWrite();
  const basePermissions = overridePermissions || user.permissions || {};

  adminPermissionCatalog.forEach((grupo) => {
    const bloco = document.createElement("div");
    bloco.className = "perm-group";
    const titulo = document.createElement("strong");
    titulo.textContent = grupo.label || "Modulo";
    const grid = document.createElement("div");
    grid.className = "perm-grid";

    (grupo.permissions || []).forEach((perm) => {
      const item = document.createElement("label");
      item.className = "perm-item";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.permissionKey = perm.key;
      checkbox.checked = isFullAccess ? true : Boolean(basePermissions[perm.key]);
      checkbox.disabled = !permissaoEdicao || isFullAccess;
      const texto = document.createElement("span");
      texto.textContent = perm.label || perm.key;
      item.append(checkbox, texto);
      grid.append(item);
    });

    bloco.append(titulo, grid);
    drawerPermissions.append(bloco);
  });
}

function mostrarMensagemDrawer(texto, erro = false) {
  if (!drawerMessage) {
    return;
  }
  drawerMessage.textContent = texto;
  drawerMessage.classList.toggle("mensagem--erro", erro);
}

function abrirUserDrawer(userId) {
  if (!canAdminUsersRead()) {
    mostrarMensagemGerencial("Sem permissao para visualizar usuarios.", true);
    return;
  }
  const user = users.find((item) => item.id === userId);
  if (!user || !userDrawer) {
    return;
  }
  const legacyToRbac = {
    admin: "pcm",
    supervisor: "supervisor_om",
    executor: "tecnico_junior",
    leitura: "leitura",
  };
  const rbacRole = user.rbacRole || legacyToRbac[user.role] || "tecnico_junior";

  if (drawerUserId) {
    drawerUserId.value = user.id;
  }
  if (drawerNome) {
    drawerNome.value = user.name || "";
  }
  if (drawerCargo) {
    const cargoAtual = user.cargo || "";
    const temCargo = Array.from(drawerCargo.options).some((opt) => opt.value === cargoAtual);
    if (cargoAtual && !temCargo) {
      const extra = document.createElement("option");
      extra.value = cargoAtual;
      extra.textContent = cargoAtual;
      drawerCargo.append(extra);
    }
    drawerCargo.value = cargoAtual;
  }
  if (drawerRole) {
    drawerRole.value = rbacRole;
  }
  if (drawerProjeto) {
    drawerProjeto.value = user.projeto || user.localizacao || "";
  }
  if (drawerActive) {
    drawerActive.checked = user.active !== false;
  }
  const podeEditar = canAdminUsersWrite();
  [drawerNome, drawerCargo, drawerRole, drawerProjeto, drawerActive].forEach((campo) => {
    if (campo) {
      campo.disabled = !podeEditar;
    }
  });
  if (drawerSubtitle) {
    const perfil = getRoleLabel(user);
    drawerSubtitle.textContent = `Matricula: ${user.matricula || "-"} | Perfil: ${perfil}`;
  }
  if (btnSalvarUserDrawer) {
    btnSalvarUserDrawer.disabled = !canAdminUsersWrite();
  }
  renderDrawerPermissions(user);
  mostrarMensagemDrawer("");
  userDrawer.hidden = false;
}

function fecharUserDrawer() {
  if (!userDrawer) {
    return;
  }
  userDrawer.hidden = true;
  mostrarMensagemDrawer("");
}

async function salvarUserDrawer(event) {
  event.preventDefault();
  if (!canAdminUsersWrite()) {
    mostrarMensagemDrawer("Sem permissao para salvar alteracoes.", true);
    return;
  }
  const userId = drawerUserId ? drawerUserId.value : "";
  const user = users.find((item) => item.id === userId);
  if (!user) {
    mostrarMensagemDrawer("Usuario nao encontrado.", true);
    return;
  }
  const nome = drawerNome ? drawerNome.value.trim() : "";
  if (!nome) {
    mostrarMensagemDrawer("Informe o nome do colaborador.", true);
    return;
  }
  const cargo = drawerCargo ? drawerCargo.value.trim() : "";
  const rbacRole = drawerRole ? drawerRole.value : user.rbacRole;
  const projeto = drawerProjeto ? drawerProjeto.value.trim() : "";
  const active = drawerActive ? drawerActive.checked : true;
  const permissions = collectDrawerPermissions();

  try {
    const data = await apiAdminUpdateUser(userId, {
      name: nome,
      cargo,
      rbacRole,
      projeto,
      localizacao: projeto,
      active,
      permissions,
    });
    const atualizado = data.user || null;
    if (atualizado) {
      users = users.map((item) => (item.id === atualizado.id ? atualizado : item));
      if (currentUser && currentUser.id === atualizado.id) {
        currentUser = atualizado;
        renderAuthUI();
      }
      renderUsuarios();
    }
    mostrarMensagemDrawer("Perfil atualizado.");
  } catch (error) {
    mostrarMensagemDrawer("Nao foi possivel salvar. Tente novamente.", true);
  }
}
function executarManutencao(index) {
  if (!requirePermission("complete")) {
    return;
  }
  const item = manutencoes[index];
  if (!isLiberacaoOk(item)) {
    abrirLiberacao(item);
    return;
  }
  abrirInicioExecucao(item);
}

function abrirInicioExecucao(item) {
  if (!modalInicioExecucao || !inicioExecucaoId) {
    return;
  }
  if (!item) {
    return;
  }
  if (item.status === "concluida") {
    mostrarMensagemManutencao("Manutencao concluida. Apenas leitura.", true);
    return;
  }
  if (item.status === "em_execucao") {
    mostrarMensagemManutencao("Manutencao ja esta em execucao.", true);
    return;
  }
  if (item.status === "encerramento") {
    mostrarMensagemManutencao("Encerramento em andamento. Apenas leitura.", true);
    return;
  }
  if (!isLiberacaoOk(item)) {
    mostrarMensagemManutencao("Liberacao incompleta. Preencha os requisitos.", true);
    return;
  }
  inicioExecucaoId.value = item.id;
  mostrarMensagemInicioExecucao("");
  modalInicioExecucao.hidden = false;
}

function fecharInicioExecucao() {
  if (!modalInicioExecucao) {
    return;
  }
  modalInicioExecucao.hidden = true;
  if (inicioExecucaoId) {
    inicioExecucaoId.value = "";
  }
}

function confirmarInicioExecucao() {
  if (!requirePermission("complete")) {
    return;
  }
  if (!inicioExecucaoId || !inicioExecucaoId.value) {
    mostrarMensagemInicioExecucao("Selecione uma manutencao.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === inicioExecucaoId.value);
  if (index < 0) {
    mostrarMensagemInicioExecucao("Manutencao nao encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status === "concluida") {
    mostrarMensagemInicioExecucao("Manutencao concluida. Apenas leitura.", true);
    return;
  }
  if (item.status === "em_execucao") {
    mostrarMensagemInicioExecucao("Manutencao ja esta em execucao.", true);
    return;
  }
  if (item.status === "encerramento") {
    mostrarMensagemInicioExecucao("Encerramento em andamento. Apenas leitura.", true);
    return;
  }
  if (!isLiberacaoOk(item)) {
    mostrarMensagemInicioExecucao("Liberacao incompleta. Preencha os requisitos.", true);
    return;
  }
  const inicioIso = toIsoUtc(new Date());
  const atualizado = {
    ...item,
    status: "em_execucao",
    executionStartedAt: inicioIso,
    executionStartedBy: currentUser.id,
    updatedAt: inicioIso,
    updatedBy: currentUser.id,
  };
  manutencoes[index] = atualizado;
  salvarManutencoes(manutencoes);
  const liberacao = getLiberacao(item) || {};
  const documentosLista = DOC_KEYS.filter((key) => liberacao.documentos && liberacao.documentos[key]).map(
    (key) => DOC_LABELS[key] || key
  );
  logAction("execute", atualizado, {
    dataProgramada: item.data || "",
    inicioExecucao: inicioIso,
    osNumero: liberacao.osNumero || "",
    participantes: liberacao.participantes || [],
    critico: liberacao.critico,
    documentos: documentosLista,
    resumo: "Execucao iniciada.",
  });
  renderTudo();
  fecharInicioExecucao();
  abrirRegistroExecucao(atualizado);
}

function abrirRegistroExecucao(item) {
  if (!requirePermission("complete")) {
    return;
  }
  if (!modalRegistroExecucao || !formRegistroExecucao) {
    return;
  }
  if (!item || (item.status !== "em_execucao" && item.status !== "encerramento")) {
    mostrarMensagemManutencao("Inicie a execucao antes de registrar.", true);
    return;
  }
  const inicio = parseTimestamp(item.executionStartedAt);
  if (!inicio) {
    mostrarMensagemManutencao("Inicio da execucao nao encontrado.", true);
    return;
  }
  manutencaoEmRegistro = item.id;
  mostrarMensagemRegistroExecucao("");
  mostrarMensagemCancelarExecucao("");
  if (formRegistroExecucao) {
    formRegistroExecucao.hidden = false;
  }
  if (formCancelarExecucao) {
    formCancelarExecucao.hidden = true;
  }
  if (cancelarExecucaoMotivo) {
    cancelarExecucaoMotivo.value = "";
  }
  if (btnCancelarExecucao) {
    btnCancelarExecucao.hidden = item.status !== "em_execucao";
  }
  if (registroId) {
    registroId.value = item.id;
  }
  if (registroTipo) {
    registroTipo.value = item.titulo || "";
  }
  if (registroSubestacao) {
    registroSubestacao.value = item.local || "";
  }
  if (registroCodigo) {
    registroCodigo.value = item.id;
  }
  if (registroAbertaPor) {
    registroAbertaPor.value = getUserLabel(item.createdBy);
  }
  if (registroAbertaEm) {
    const createdAt = parseTimestamp(item.createdAt);
    registroAbertaEm.value = createdAt ? formatDateTime(createdAt) : "-";
  }
  if (registroInicio) {
    registroInicio.value = formatDateTime(inicio);
  }
  const liberacao = getLiberacao(item) || {};
  if (registroOsNumero) {
    registroOsNumero.value = liberacao.osNumero || "-";
  }
  if (registroParticipantes) {
    registroParticipantes.value = getParticipantesLabel(liberacao.participantes);
  }
  if (registroDocs) {
    renderDocList(registroDocs, liberacao.documentos, liberacao.critico);
  }
  const registroSalvo = item.registroExecucao || {};
  if (registroExecutadaPor) {
    registroExecutadaPor.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecione";
    registroExecutadaPor.append(placeholder);
    users
      .filter((user) => user && user.id)
      .sort((a, b) => (a.name || "").localeCompare(b.name || "", "pt-BR"))
      .forEach((user) => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name || user.matricula;
        registroExecutadaPor.append(option);
      });
    const defaultId = registroSalvo.executadoPor || (currentUser ? currentUser.id : "");
    if (defaultId) {
      registroExecutadaPor.value = defaultId;
    }
  }
  if (registroResultado) {
    registroResultado.value = registroSalvo.resultado || "";
  }
  if (registroComentario) {
    registroComentario.value = registroSalvo.comentario || "";
  }
  if (registroObsExecucao) {
    registroObsExecucao.value = registroSalvo.observacaoExecucao || "";
  }
  modalRegistroExecucao.hidden = false;
}

function fecharRegistroExecucao() {
  if (!modalRegistroExecucao) {
    return;
  }
  modalRegistroExecucao.hidden = true;
  manutencaoEmRegistro = null;
  if (formRegistroExecucao) {
    formRegistroExecucao.hidden = false;
  }
  if (formCancelarExecucao) {
    formCancelarExecucao.hidden = true;
  }
  if (cancelarExecucaoMotivo) {
    cancelarExecucaoMotivo.value = "";
  }
  mostrarMensagemCancelarExecucao("");
}

function abrirCancelarExecucao() {
  if (!formRegistroExecucao || !formCancelarExecucao) {
    return;
  }
  if (!manutencaoEmRegistro) {
    mostrarMensagemRegistroExecucao("Selecione uma manutencao.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmRegistro);
  if (index < 0) {
    mostrarMensagemRegistroExecucao("Manutencao nao encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status !== "em_execucao") {
    mostrarMensagemRegistroExecucao("A manutencao precisa estar em execucao.", true);
    return;
  }
  formRegistroExecucao.hidden = true;
  formCancelarExecucao.hidden = false;
  if (cancelarExecucaoMotivo) {
    cancelarExecucaoMotivo.value = "";
  }
  mostrarMensagemCancelarExecucao("");
}

function fecharCancelarExecucao() {
  if (!formRegistroExecucao || !formCancelarExecucao) {
    return;
  }
  formCancelarExecucao.hidden = true;
  formRegistroExecucao.hidden = false;
  if (cancelarExecucaoMotivo) {
    cancelarExecucaoMotivo.value = "";
  }
  mostrarMensagemCancelarExecucao("");
}

function salvarCancelamentoExecucao(event) {
  event.preventDefault();
  if (!requirePermission("complete")) {
    return;
  }
  if (!manutencaoEmRegistro) {
    mostrarMensagemCancelarExecucao("Selecione uma manutencao.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmRegistro);
  if (index < 0) {
    mostrarMensagemCancelarExecucao("Manutencao nao encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status !== "em_execucao") {
    mostrarMensagemCancelarExecucao("A manutencao precisa estar em execucao.", true);
    return;
  }
  const motivo = cancelarExecucaoMotivo ? cancelarExecucaoMotivo.value.trim() : "";
  if (!motivo) {
    mostrarMensagemCancelarExecucao("Informe o motivo do cancelamento.", true);
    return;
  }
  const registroExecucao = {
    ...(item.registroExecucao || {}),
    motivoCancelamento: motivo,
    canceladoPor: currentUser.id,
    canceladoEm: Date.now(),
  };
  const atualizado = {
    ...item,
    registroExecucao,
    status: "CANCELADA",
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
  };
  manutencoes[index] = atualizado;
  salvarManutencoes(manutencoes);
  renderTudo();
  fecharRegistroExecucao();
  mostrarMensagemManutencao("Execucao cancelada.");
}

function salvarRegistroExecucao(event) {
  event.preventDefault();
  if (!requirePermission("complete")) {
    return;
  }
  if (!manutencaoEmRegistro) {
    mostrarMensagemRegistroExecucao("Selecione uma manutencao.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmRegistro);
  if (index < 0) {
    mostrarMensagemRegistroExecucao("Manutencao nao encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status !== "em_execucao" && item.status !== "encerramento") {
    mostrarMensagemRegistroExecucao("Inicie a execucao antes de registrar.", true);
    return;
  }
  if (!item.executionStartedAt) {
    mostrarMensagemRegistroExecucao("Inicio da execucao nao encontrado.", true);
    return;
  }
  const executadoPor = registroExecutadaPor ? registroExecutadaPor.value : "";
  if (!executadoPor) {
    mostrarMensagemRegistroExecucao("Selecione quem executou.", true);
    return;
  }
  const resultado = registroResultado ? registroResultado.value : "";
  if (!resultado) {
    mostrarMensagemRegistroExecucao("Informe o resultado da execucao.", true);
    return;
  }
  const comentario = registroComentario ? registroComentario.value.trim() : "";
  if (!comentario) {
    mostrarMensagemRegistroExecucao("Descricao tecnica obrigatoria.", true);
    return;
  }
  const observacaoExecucao = registroObsExecucao ? registroObsExecucao.value.trim() : "";
  const registroExecucao = {
    executadoPor,
    resultado,
    comentario,
    observacaoExecucao,
    registradoEm: toIsoUtc(new Date()),
  };
  const atualizado = {
    ...item,
    registroExecucao,
    status: "encerramento",
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
  };
  manutencoes[index] = atualizado;
  salvarManutencoes(manutencoes);
  const liberacao = getLiberacao(item) || {};
  const documentosLista = DOC_KEYS.filter((key) => liberacao.documentos && liberacao.documentos[key]).map(
    (key) => DOC_LABELS[key] || key
  );
  logAction("execute_register", atualizado, {
    executadoPor,
    resultado,
    observacaoExecucao,
    inicioExecucao: item.executionStartedAt || "",
    osNumero: liberacao.osNumero || "",
    participantes: liberacao.participantes || [],
    critico: liberacao.critico,
    documentos: documentosLista,
    resumo: "Registro de execucao salvo.",
  });
  renderTudo();
  fecharRegistroExecucao();
  mostrarMensagemManutencao("Registro de execucao salvo.");
}

function preencherParticipantesSelect(select, selecionados = []) {
  if (!select) {
    return;
  }
  const selecionadosSet = new Set(selecionados);
  select.innerHTML = "";
  const lista = users
    .filter((user) => user && user.id)
    .sort((a, b) => (a.name || "").localeCompare(b.name || "", "pt-BR"));
  if (!lista.length && currentUser) {
    const option = document.createElement("option");
    option.value = currentUser.id;
    option.textContent = currentUser.name || currentUser.matricula;
    option.selected = true;
    select.append(option);
    return;
  }
  lista.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name || user.matricula;
    option.selected = selecionadosSet.has(user.id);
    select.append(option);
  });
  if (!selecionadosSet.size && currentUser) {
    const option = Array.from(select.options).find((item) => item.value === currentUser.id);
    if (option) {
      option.selected = true;
    }
  }
}

function getLiberacaoDocAtual(chave) {
  return liberacaoDocsPreview[chave] || liberacaoDocsBase[chave] || null;
}

function atualizarLiberacaoDocsUI() {
  DOC_KEYS.forEach((chave) => {
    const nomeEl = liberacaoDocNames.find((item) => item.dataset.docName === chave);
    const viewBtn = liberacaoDocViews.find((item) => item.dataset.docView === chave);
    const doc = getLiberacaoDocAtual(chave);
    if (nomeEl) {
      nomeEl.textContent = doc ? doc.nome || doc.name || "Arquivo" : "Nenhum arquivo";
    }
    if (viewBtn) {
      viewBtn.disabled = !doc;
    }
  });
}

function atualizarNovaDocsUI() {
  if (!novaDocInputs.length) {
    return;
  }
  DOC_KEYS.forEach((chave) => {
    const nomeEl = novaDocNames.find((item) => item.dataset.novaDocName === chave);
    const viewBtn = novaDocViews.find((item) => item.dataset.novaDocView === chave);
    const input = novaDocInputs.find((item) => item.dataset.novaDocInput === chave);
    const file = input && input.files && input.files[0] ? input.files[0] : null;
    if (nomeEl) {
      nomeEl.textContent = file ? file.name : "Nenhum arquivo";
    }
    if (viewBtn) {
      viewBtn.disabled = !file;
    }
  });
}

function atualizarNovaCriticoUI() {
  const critico = criticoManutencao && criticoManutencao.value === "sim";
  if (novaDocPt) {
    novaDocPt.hidden = !critico;
  }
  if (novaPtLabel) {
    novaPtLabel.textContent = critico ? "PT*" : "PT";
  }
  const ptInput = novaDocInputs.find(
    (input) => input && input.dataset.novaDocInput === "pt"
  );
  if (ptInput) {
    ptInput.required = critico;
    ptInput.disabled = !critico;
    if (!critico) {
      ptInput.value = "";
      atualizarNovaDocsUI();
    }
  }
}

function preencherInicioExecucaoNova() {
  if (!dataManutencao) {
    return;
  }
  dataManutencao.value = formatDateISO(new Date());
}

function atualizarLiberacaoChecklist() {
  if (!liberacaoChecklist) {
    return;
  }
  const osNumero = liberacaoOs ? liberacaoOs.value.trim() : "";
  const participantesTexto = liberacaoParticipantes ? liberacaoParticipantes.value : "";
  const participantes = participantesTexto
    ? participantesTexto
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const criticoSelecionado = liberacaoCritico ? liberacaoCritico.value : "";
  const critico = criticoSelecionado === "sim";
  const docApr = getLiberacaoDocAtual("apr");
  const docOs = getLiberacaoDocAtual("os");
  const docPte = getLiberacaoDocAtual("pte");
  const docPt = getLiberacaoDocAtual("pt");
  const itens = [
    { label: "Trabalho critico definido", ok: Boolean(criticoSelecionado) },
    { label: "OS / referencia", ok: Boolean(osNumero) },
    { label: "Participantes", ok: participantes.length > 0 },
    { label: "APR anexada", ok: Boolean(docApr) },
    { label: "OS anexada", ok: Boolean(docOs) },
    { label: "PTE anexada", ok: Boolean(docPte) },
  ];
  if (critico) {
    itens.push({ label: "PT anexada", ok: Boolean(docPt) });
  }
  liberacaoChecklist.innerHTML = "";
  itens.forEach((item) => {
    const li = document.createElement("li");
    const status = document.createElement("span");
    status.className = item.ok ? "is-ok" : "is-pending";
    status.textContent = item.ok ? "OK" : "Pendente";
    const texto = document.createElement("span");
    texto.textContent = item.label;
    li.append(status, texto);
    liberacaoChecklist.append(li);
  });
  if (liberacaoParticipantesErro) {
    if (!participantes.length) {
      setFieldError(liberacaoParticipantesErro, "Informe ao menos 1 participante.");
    } else if (critico && participantes.length < 2) {
      setFieldError(
        liberacaoParticipantesErro,
        "Para trabalho critico, informe ao menos 2 participantes."
      );
    } else {
      setFieldError(liberacaoParticipantesErro, "");
    }
  }
}

function atualizarLiberacaoCriticoUI() {
  const critico = liberacaoCritico && liberacaoCritico.value === "sim";
  if (liberacaoDocPt) {
    liberacaoDocPt.hidden = !critico;
  }
  const ptInput = liberacaoDocInputs.find(
    (input) => input && input.dataset.docInput === "pt"
  );
  if (ptInput) {
    ptInput.required = critico;
    if (!critico) {
      ptInput.value = "";
      delete liberacaoDocsPreview.pt;
      atualizarLiberacaoDocsUI();
    }
  }
  atualizarLiberacaoChecklist();
}

function abrirLiberacao(item) {
  if (!modalLiberacao || !formLiberacao) {
    return;
  }
  if (!item) {
    return;
  }
  if (item.status === "concluida") {
    mostrarMensagemManutencao("Manutencao concluida. Apenas leitura.", true);
    return;
  }
  if (item.status === "em_execucao" || item.status === "encerramento") {
    mostrarMensagemManutencao("Execucao em andamento. Nao e possivel liberar.", true);
    return;
  }
  manutencaoEmLiberacao = item.id;
  mostrarMensagemLiberacao("");
  const liberacao = getLiberacao(item) || {};
  liberacaoDocsBase = liberacao.documentos ? { ...liberacao.documentos } : {};
  liberacaoDocsPreview = {};
  if (liberacaoId) {
    liberacaoId.value = item.id;
  }
  if (liberacaoOs) {
    liberacaoOs.value = liberacao.osNumero || "";
  }
  if (liberacaoCritico) {
    if (liberacao.critico === true) {
      liberacaoCritico.value = "sim";
    } else if (liberacao.critico === false) {
      liberacaoCritico.value = "nao";
    } else {
      liberacaoCritico.value = "";
    }
  }
  if (liberacaoParticipantes) {
    if (Array.isArray(liberacao.participantes)) {
      liberacaoParticipantes.value = liberacao.participantes.join("; ");
    } else if (typeof liberacao.participantes === "string") {
      liberacaoParticipantes.value = liberacao.participantes;
    } else {
      liberacaoParticipantes.value = "";
    }
  }
  liberacaoDocInputs.forEach((input) => {
    if (input) {
      input.value = "";
    }
  });
  atualizarLiberacaoDocsUI();
  atualizarLiberacaoCriticoUI();
  modalLiberacao.hidden = false;
}

function fecharLiberacao() {
  if (!modalLiberacao) {
    return;
  }
  modalLiberacao.hidden = true;
  manutencaoEmLiberacao = null;
  liberacaoDocsBase = {};
  liberacaoDocsPreview = {};
}

function abrirOverrideLiberacao(dataProgramada) {
  if (!modalOverride || !formOverride) {
    return;
  }
  if (overrideInfo) {
    const dataLabel = dataProgramada ? formatDate(dataProgramada) : "-";
    overrideInfo.textContent = `Liberacao antes da data prevista (${dataLabel}).`;
  }
  if (overrideMotivo) {
    overrideMotivo.value = "";
  }
  mostrarMensagemOverride("");
  modalOverride.hidden = false;
}

function fecharOverrideLiberacao() {
  if (!modalOverride) {
    return;
  }
  modalOverride.hidden = true;
  mostrarMensagemOverride("");
  pendingLiberacaoOverride = null;
}

function finalizarLiberacao(index, item, liberacaoBase, overrideJustificativa = "") {
  const dataProgramada = parseDate(item.data);
  const atrasada = dataProgramada && dataProgramada < startOfDay(new Date());
  const agoraIso = toIsoUtc(new Date());
  const liberacao = {
    ...liberacaoBase,
    liberadoEm: agoraIso,
    liberadoPor: currentUser.id,
  };
  if (overrideJustificativa) {
    liberacao.overrideJustificativa = overrideJustificativa;
    liberacao.overrideRole = getRoleLabel(currentUser);
    liberacao.overrideAt = agoraIso;
  }
  const atualizado = {
    ...item,
    liberacao,
    status: atrasada ? "backlog" : "liberada",
    updatedAt: agoraIso,
    updatedBy: currentUser.id,
  };
  manutencoes[index] = atualizado;
  salvarManutencoes(manutencoes);
  const documentosLista = DOC_KEYS.filter(
    (key) => liberacao.documentos && liberacao.documentos[key]
  ).map((key) => DOC_LABELS[key] || key);
  logAction("release", atualizado, {
    osNumero: liberacao.osNumero,
    participantes: liberacao.participantes,
    critico: liberacao.critico,
    documentos: documentosLista,
    justificativa: overrideJustificativa || undefined,
    resumo: overrideJustificativa ? "Liberacao antecipada registrada." : "Liberacao registrada.",
  });
  renderTudo();
  fecharLiberacao();
  mostrarMensagemManutencao("Liberacao registrada.");
}

async function confirmarOverrideLiberacao(event) {
  event.preventDefault();
  if (!pendingLiberacaoOverride) {
    mostrarMensagemOverride("Nenhuma liberacao pendente.", true);
    return;
  }
  const motivo = overrideMotivo ? overrideMotivo.value.trim() : "";
  if (!motivo) {
    mostrarMensagemOverride("Justificativa obrigatoria.", true);
    return;
  }
  const index = manutencoes.findIndex(
    (registro) => registro.id === pendingLiberacaoOverride.id
  );
  if (index < 0) {
    mostrarMensagemOverride("Manutencao nao encontrada.", true);
    pendingLiberacaoOverride = null;
    return;
  }
  const item = manutencoes[index];
  try {
    await apiMaintenanceRelease({
      id: pendingLiberacaoOverride.id,
      dataProgramada: item.data,
      justificativa: motivo,
    });
  } catch (error) {
    mostrarMensagemOverride(error.message || "Nao foi possivel liberar.", true);
    return;
  }
  const liberacaoBase = pendingLiberacaoOverride.liberacaoBase;
  pendingLiberacaoOverride = null;
  fecharOverrideLiberacao();
  finalizarLiberacao(index, item, liberacaoBase, motivo);
}

async function salvarLiberacao(event) {
  event.preventDefault();
  if (!requirePermission("complete")) {
    return;
  }
  if (!manutencaoEmLiberacao) {
    mostrarMensagemLiberacao("Selecione uma manutencao.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmLiberacao);
  if (index < 0) {
    mostrarMensagemLiberacao("Manutencao nao encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  const osNumero = liberacaoOs ? liberacaoOs.value.trim() : "";
  if (!osNumero) {
    mostrarMensagemLiberacao("Informe o No OS / referencia.", true);
    return;
  }
  const participantesTexto = liberacaoParticipantes ? liberacaoParticipantes.value : "";
  const participantes = participantesTexto
    ? participantesTexto
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  setFieldError(liberacaoParticipantesErro, "");
  if (!participantes.length) {
    setFieldError(liberacaoParticipantesErro, "Informe ao menos 1 participante.");
    mostrarMensagemLiberacao("Informe ao menos 1 participante.", true);
    return;
  }
  const criticoValor = liberacaoCritico ? liberacaoCritico.value : "";
  if (!criticoValor) {
    mostrarMensagemLiberacao("Informe se o trabalho e critico.", true);
    return;
  }
  const critico = criticoValor === "sim";
  if (critico && participantes.length < 2) {
    setFieldError(
      liberacaoParticipantesErro,
      "Para trabalho critico, informe ao menos 2 participantes."
    );
    mostrarMensagemLiberacao(
      "Para trabalho critico, informe ao menos 2 participantes.",
      true
    );
    return;
  }
  const documentos = { ...liberacaoDocsBase };
  let docsDb = null;
  const salvarDocumentoDb = async (file) => {
    if (!docsDb) {
      docsDb = await openDocsDB();
    }
    const docId = crypto.randomUUID();
    const registro = {
      docId,
      name: file.name,
      type: file.type || "",
      blob: file,
      createdAt: toIsoUtc(new Date()),
    };
    await new Promise((resolve, reject) => {
      const tx = docsDb.transaction("docs", "readwrite");
      const store = tx.objectStore("docs");
      const request = store.put(registro);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    return { docId, name: file.name, nome: file.name, type: file.type || "" };
  };
  for (const chave of DOC_KEYS) {
    const input = liberacaoDocInputs.find((itemInput) => itemInput.dataset.docInput === chave);
    if (input && input.files && input.files[0]) {
      try {
        documentos[chave] = await salvarDocumentoDb(input.files[0]);
      } catch (error) {
        mostrarMensagemLiberacao("Nao foi possivel salvar o documento.", true);
        return;
      }
      continue;
    }
    const docAtual = getLiberacaoDocAtual(chave);
    if (docAtual) {
      documentos[chave] = docAtual;
    }
  }
  if (!documentos.apr || !documentos.os || !documentos.pte) {
    mostrarMensagemLiberacao("Anexe APR, OS e PTE para liberar.", true);
    return;
  }
  if (critico && !documentos.pt) {
    mostrarMensagemLiberacao("PT obrigatoria para trabalho critico.", true);
    return;
  }
  const dataProgramada = parseDate(item.data);
  const hoje = startOfDay(new Date());
  const liberacaoAntecipada = dataProgramada && dataProgramada > hoje;
  if (liberacaoAntecipada && !canOverrideRelease(currentUser)) {
    mostrarMensagemLiberacao(
      `Trancada - libera em ${dataProgramada ? formatDate(dataProgramada) : "-"}.`,
      true
    );
    return;
  }
  const liberacaoBase = {
    osNumero,
    participantes,
    critico,
    documentos,
  };
  if (liberacaoAntecipada) {
    pendingLiberacaoOverride = { id: item.id, liberacaoBase };
    abrirOverrideLiberacao(dataProgramada);
    return;
  }
  try {
    await apiMaintenanceRelease({ id: item.id, dataProgramada: item.data });
  } catch (error) {
    mostrarMensagemLiberacao(error.message || "Nao foi possivel liberar.", true);
    return;
  }
  finalizarLiberacao(index, item, liberacaoBase);
}

function handleLiberacaoDocChange(input) {
  if (!input) {
    return;
  }
  const chave = input.dataset.docInput;
  if (!chave) {
    return;
  }
  const file = input.files && input.files[0] ? input.files[0] : null;
  if (!file) {
    delete liberacaoDocsPreview[chave];
    atualizarLiberacaoDocsUI();
    atualizarLiberacaoChecklist();
    return;
  }
  lerDocumentoFile(file).then((doc) => {
    if (doc) {
      liberacaoDocsPreview[chave] = doc;
    }
    atualizarLiberacaoDocsUI();
    atualizarLiberacaoChecklist();
  });
}

function liberarManutencao(index) {
  if (!requirePermission("complete")) {
    return;
  }
  const item = manutencoes[index];
  const dataProgramada = parseDate(item.data);
  const hoje = startOfDay(new Date());
  const lockInfo = getReleaseLockInfo(item, dataProgramada, hoje);
  if (lockInfo && !lockInfo.canOverride) {
    mostrarMensagemManutencao(
      `Trancada - libera em ${formatDate(lockInfo.date)}.`,
      true
    );
    return;
  }
  abrirLiberacao(item);
}

function abrirCancelarInicio(item) {
  if (!modalCancelarInicio || !formCancelarInicio) {
    return;
  }
  if (!item) {
    return;
  }
  if (item.status !== "em_execucao") {
    mostrarMensagemManutencao("A manutencao precisa estar em execucao.", true);
    return;
  }
  if (item.registroExecucao) {
    mostrarMensagemManutencao("Registro ja iniciado. Nao e possivel cancelar.", true);
    return;
  }
  manutencaoEmCancelamento = item.id;
  mostrarMensagemCancelarInicio("");
  if (cancelarInicioId) {
    cancelarInicioId.value = item.id;
  }
  if (cancelarInicioMotivo) {
    cancelarInicioMotivo.value = "";
  }
  if (cancelarInicioObs) {
    cancelarInicioObs.value = "";
  }
  modalCancelarInicio.hidden = false;
}

function fecharCancelarInicio() {
  if (!modalCancelarInicio) {
    return;
  }
  modalCancelarInicio.hidden = true;
  manutencaoEmCancelamento = null;
}

function salvarCancelarInicio(event) {
  event.preventDefault();
  if (!requirePermission("complete")) {
    return;
  }
  if (!manutencaoEmCancelamento) {
    mostrarMensagemCancelarInicio("Selecione uma manutencao.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmCancelamento);
  if (index < 0) {
    mostrarMensagemCancelarInicio("Manutencao nao encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  const motivo = cancelarInicioMotivo ? cancelarInicioMotivo.value.trim() : "";
  if (!motivo) {
    mostrarMensagemCancelarInicio("Selecione o motivo do cancelamento.", true);
    return;
  }
  const observacao = cancelarInicioObs ? cancelarInicioObs.value.trim() : "";
  if (motivo === "Outros" && !observacao) {
    mostrarMensagemCancelarInicio("Informe a observacao para o motivo Outros.", true);
    return;
  }
  const inicioAnterior = item.executionStartedAt || "";
  const atualizado = {
    ...item,
    status: isLiberacaoOk(item) ? "liberada" : "agendada",
    executionStartedAt: null,
    executionStartedBy: null,
    executionFinishedAt: null,
    registroExecucao: null,
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
  };
  manutencoes[index] = atualizado;
  salvarManutencoes(manutencoes);
  const liberacao = getLiberacao(item) || {};
  const documentosLista = DOC_KEYS.filter(
    (key) => liberacao.documentos && liberacao.documentos[key]
  ).map((key) => DOC_LABELS[key] || key);
  logAction("cancel_start", atualizado, {
    motivo,
    observacao,
    osNumero: liberacao.osNumero || "",
    participantes: liberacao.participantes || [],
    critico: liberacao.critico,
    documentos: documentosLista,
    inicioExecucao: inicioAnterior,
    resumo: "Inicio cancelado.",
  });
  renderTudo();
  fecharCancelarInicio();
  mostrarMensagemManutencao("Inicio cancelado.");
}

function abrirReagendamento(item) {
  if (!modalReagendar || !formReagendar) {
    return;
  }
  mostrarMensagemReagendar("");
  if (reagendarId) {
    reagendarId.value = item.id;
  }
  if (reagendarData) {
    reagendarData.value = item.data || formatDateISO(new Date());
  }
  if (reagendarMotivo) {
    reagendarMotivo.value = "";
  }
  if (reagendarObs) {
    reagendarObs.value = "";
  }
  modalReagendar.hidden = false;
}

function fecharReagendamento() {
  if (!modalReagendar) {
    return;
  }
  modalReagendar.hidden = true;
}

function reagendarManutencao(index) {
  if (!requirePermission("reschedule")) {
    return;
  }
  const item = manutencoes[index];
  if (item.status === "em_execucao" || item.status === "encerramento") {
    mostrarMensagemManutencao("Nao e possivel reagendar durante a execucao.", true);
    return;
  }
  if (item.status === "concluida") {
    mostrarMensagemManutencao("Manutencao concluida. Apenas leitura.", true);
    return;
  }
  abrirReagendamento(item);
}

function salvarReagendamento(event) {
  event.preventDefault();
  if (!requirePermission("reschedule")) {
    return;
  }
  if (!reagendarId || !reagendarData || !reagendarMotivo) {
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === reagendarId.value);
  if (index < 0) {
    mostrarMensagemReagendar("Manutencao nao encontrada.", true);
    return;
  }
  const motivo = reagendarMotivo.value.trim();
  if (!motivo) {
    mostrarMensagemReagendar("Selecione o motivo do reagendamento.", true);
    return;
  }
  const dataLimpa = reagendarData.value.trim();
  const novaData = parseDate(dataLimpa);
  if (!novaData) {
    mostrarMensagemReagendar("Data invalida. Use AAAA-MM-DD.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status === "em_execucao" || item.status === "encerramento") {
    mostrarMensagemReagendar("Nao e possivel reagendar durante a execucao.", true);
    return;
  }
  const dataAnterior = item.data || "";
  if (dataAnterior && dataAnterior === dataLimpa) {
    mostrarMensagemReagendar("Nova data deve ser diferente da data atual.", true);
    return;
  }
  const hoje = startOfDay(new Date());
  if (novaData < hoje) {
    const confirmar = window.confirm(
      "A nova data esta no passado e a manutencao ficara em backlog. Deseja continuar?"
    );
    if (!confirmar) {
      return;
    }
  }
  const observacao = reagendarObs ? reagendarObs.value.trim() : "";
  if (motivo === "Outros" && !observacao) {
    mostrarMensagemReagendar("Informe a observacao para o motivo Outros.", true);
    return;
  }

  const atualizado = {
    ...item,
    data: dataLimpa,
    status: isLiberacaoOk(item) ? "liberada" : "agendada",
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
  };

  manutencoes[index] = atualizado;
  const resultado = normalizarManutencoes(manutencoes);
  manutencoes = resultado.normalizadas;
  salvarManutencoes(manutencoes);
  logAction("reschedule", atualizado, {
    dataAnterior,
    dataNova: dataLimpa,
    motivo,
    observacao,
    templateId: item.templateId || "",
    resumo: `Reagendada de ${dataAnterior || "-"} para ${dataLimpa} (${motivo})`,
  });
  renderTudo();
  fecharReagendamento();
  mostrarMensagemManutencao("Manutencao reagendada.");
}

function formatDateTimeInput(date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function parseDateTimeInput(valor) {
  if (!valor) {
    return null;
  }
  const [dataParte, horaParte] = valor.split("T");
  if (!dataParte || !horaParte) {
    return null;
  }
  const [ano, mes, dia] = dataParte.split("-").map((item) => Number.parseInt(item, 10));
  const [hora, minuto] = horaParte.split(":").map((item) => Number.parseInt(item, 10));
  if (![ano, mes, dia, hora, minuto].every(Number.isFinite)) {
    return null;
  }
  return new Date(ano, mes - 1, dia, hora, minuto);
}

function formatDuracaoMin(minutos) {
  const total = Math.max(0, Math.round(minutos));
  const horas = Math.floor(total / 60);
  const mins = total % 60;
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function formatHistoricoData(valor) {
  if (!valor && valor !== 0) {
    return "";
  }
  const parsed = parseTimestamp(valor);
  if (parsed) {
    return formatDateTime(parsed);
  }
  return String(valor);
}

function formatDataCurta(valor) {
  if (!valor) {
    return "-";
  }
  const parsed = parseDate(valor);
  return parsed ? formatDate(parsed) : String(valor);
}

function renderHistorico(item) {
  if (!listaHistorico || !historicoVazio) {
    return;
  }
  listaHistorico.innerHTML = "";
  const historico = getHistoricoManutencao(item.id);
  if (historicoResumo) {
    const data = item.data ? formatDate(parseDate(item.data)) : "data indefinida";
    historicoResumo.textContent = `${item.titulo} | ${item.local} | ${data}`;
  }

  if (!historico.length) {
    historicoVazio.hidden = false;
    if (btnHistoricoMais) {
      btnHistoricoMais.hidden = true;
    }
    if (btnHistoricoExportar) {
      btnHistoricoExportar.hidden = true;
    }
    if (btnHistoricoExportarPdf) {
      btnHistoricoExportarPdf.hidden = true;
    }
    return;
  }
  historicoVazio.hidden = true;

  const limite = Math.min(historicoLimite, historico.length);
  historico.slice(0, limite).forEach((entry) => {
    const card = document.createElement("div");
    card.className = "history-item";

    const titulo = document.createElement("strong");
    const label = ACTION_LABELS[entry.action] || entry.action;
    titulo.textContent = label;

    const meta = document.createElement("div");
    meta.className = "history-meta";
    const dataEvento = parseTimestamp(entry.timestamp);
    meta.textContent = `${dataEvento ? formatDateTime(dataEvento) : "-"} - ${getUserLabel(
      entry.userId
    )} | ${getOrigemLabel(entry)}`;

    card.append(titulo, meta);

    const detalhes = entry.detalhes || {};
    const linhas = [];
    if (detalhes.dataAnterior || detalhes.dataNova) {
      const de = detalhes.dataAnterior ? formatDataCurta(detalhes.dataAnterior) : "-";
      const para = detalhes.dataNova ? formatDataCurta(detalhes.dataNova) : "-";
      linhas.push(`De: ${de} -> Para: ${para}`);
    }
      if (detalhes.motivo) {
        linhas.push(`Motivo: ${detalhes.motivo}`);
      }
      if (detalhes.observacao) {
        linhas.push(`Obs.: ${detalhes.observacao}`);
      }
      if (detalhes.osNumero) {
        linhas.push(`OS: ${detalhes.osNumero}`);
      }
      if (detalhes.participantes) {
        const participantesTexto = Array.isArray(detalhes.participantes)
          ? getParticipantesLabel(detalhes.participantes)
          : detalhes.participantes;
        linhas.push(`Participantes: ${participantesTexto}`);
      }
      if (detalhes.critico !== undefined) {
        linhas.push(`Critico: ${detalhes.critico ? "Sim" : "Nao"}`);
      }
      if (detalhes.documentos) {
        const docsTexto = Array.isArray(detalhes.documentos)
          ? detalhes.documentos.join(", ")
          : Object.keys(detalhes.documentos).join(", ");
        if (docsTexto) {
          linhas.push(`Documentos: ${docsTexto}`);
        }
      }
      if (detalhes.resultado) {
        linhas.push(`Resultado: ${RESULTADO_LABELS[detalhes.resultado] || detalhes.resultado}`);
      }
    if (detalhes.referencia) {
      linhas.push(`Referencia: ${detalhes.referencia}`);
    }
    if (detalhes.observacaoExecucao) {
      linhas.push(`Obs. execucao: ${detalhes.observacaoExecucao}`);
    }
    if (detalhes.evidenciasCount !== undefined) {
      linhas.push(`Evidencias: ${detalhes.evidenciasCount}`);
    }
    if (detalhes.inicioExecucao) {
      linhas.push(`Inicio execucao: ${formatHistoricoData(detalhes.inicioExecucao)}`);
    }
    if (detalhes.fimExecucao) {
      linhas.push(`Fim execucao: ${formatHistoricoData(detalhes.fimExecucao)}`);
    }
    if (detalhes.atrasoDias !== undefined) {
      linhas.push(`Atraso (dias): ${detalhes.atrasoDias}`);
    }
    if (detalhes.resumo) {
      linhas.push(detalhes.resumo);
    }
    if (linhas.length) {
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "btn btn--ghost btn--small history-toggle";
      toggle.textContent = "Expandir detalhes";

      const details = document.createElement("div");
      details.className = "history-details";
      details.hidden = true;

      linhas.forEach((texto) => {
        const linha = document.createElement("div");
        linha.className = "history-meta";
        linha.textContent = texto;
        details.append(linha);
      });

      toggle.addEventListener("click", () => {
        const expandir = details.hidden;
        details.hidden = !expandir;
        toggle.textContent = expandir ? "Ocultar detalhes" : "Expandir detalhes";
      });

      card.append(toggle, details);
    }

    listaHistorico.append(card);
  });

  if (btnHistoricoMais) {
    btnHistoricoMais.hidden = limite >= historico.length;
  }
  if (btnHistoricoExportar) {
    btnHistoricoExportar.hidden = false;
  }
  if (btnHistoricoExportarPdf) {
    btnHistoricoExportarPdf.hidden = false;
  }
}

function abrirHistorico(item) {
  if (!modalHistorico || !listaHistorico || !historicoVazio) {
    return;
  }
  historicoAtualId = item.id;
  historicoLimite = HISTORY_PAGE_SIZE;
  renderHistorico(item);
  modalHistorico.hidden = false;
}

function fecharHistorico() {
  if (!modalHistorico) {
    return;
  }
  modalHistorico.hidden = true;
  historicoAtualId = null;
  historicoLimite = HISTORY_PAGE_SIZE;
}

function escapeCsv(valor) {
  const texto = valor === null || valor === undefined ? "" : String(valor);
  return `"${texto.replace(/"/g, '""')}"`;
}

function exportarHistorico(item) {
  const historico = getHistoricoManutencao(item.id);
  if (!historico.length) {
    return;
  }
    const header = [
      "acao",
      "data_hora",
      "usuario",
      "origem",
      "data_anterior",
      "data_nova",
      "motivo",
      "observacao",
      "os_numero",
      "participantes",
      "critico",
      "documentos",
      "inicio_execucao",
      "fim_execucao",
      "resumo",
      "resultado",
      "referencia",
      "obs_execucao",
      "evidencias_count",
    "prev_hash",
    "hash",
  ];
  const linhas = historico.map((entry) => {
      const detalhes = entry.detalhes || {};
      const dataEvento = parseTimestamp(entry.timestamp);
      const participantesTexto = Array.isArray(detalhes.participantes)
        ? detalhes.participantes.map((id) => getUserLabel(id)).join(" | ")
        : detalhes.participantes || "";
      const documentosTexto = Array.isArray(detalhes.documentos)
        ? detalhes.documentos.join(" | ")
        : detalhes.documentos
          ? Object.keys(detalhes.documentos).join(" | ")
          : "";
      return [
        ACTION_LABELS[entry.action] || entry.action,
        dataEvento ? formatDateTime(dataEvento) : "",
        getUserLabel(entry.userId),
        getOrigemLabel(entry),
        detalhes.dataAnterior || "",
        detalhes.dataNova || "",
        detalhes.motivo || "",
        detalhes.observacao || "",
        detalhes.osNumero || "",
        participantesTexto,
        detalhes.critico === undefined ? "" : detalhes.critico ? "Sim" : "Nao",
        documentosTexto,
        detalhes.inicioExecucao || "",
        detalhes.fimExecucao || "",
        detalhes.resumo || "",
        detalhes.resultado || "",
        detalhes.referencia || "",
        detalhes.observacaoExecucao || "",
        detalhes.evidenciasCount !== undefined ? detalhes.evidenciasCount : "",
      entry.prevHash || "",
      entry.hash || "",
    ]
      .map(escapeCsv)
      .join(",");
  });
  const csv = [header.map(escapeCsv).join(","), ...linhas].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dataAtual = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `historico-${item.id}-${dataAtual}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportarHistoricoPdf(item) {
  const historico = getHistoricoManutencao(item.id);
  if (!historico.length) {
    return;
  }
  const popup = window.open("", "_blank");
  if (!popup) {
    return;
  }
  const dataBase = item.data ? formatDate(parseDate(item.data)) : "data indefinida";
  const header = `
    <h1>Historico da manutencao</h1>
    <p><strong>${item.titulo}</strong> | ${item.local} | ${dataBase}</p>
  `;
  const itens = historico
    .map((entry) => {
      const dataEvento = parseTimestamp(entry.timestamp);
      const linhas = [];
      if (entry.detalhes && (entry.detalhes.dataAnterior || entry.detalhes.dataNova)) {
        const de = entry.detalhes.dataAnterior
          ? formatDataCurta(entry.detalhes.dataAnterior)
          : "-";
        const para = entry.detalhes.dataNova ? formatDataCurta(entry.detalhes.dataNova) : "-";
        linhas.push(
          `De: ${de} -> Para: ${para}`
        );
      }
      if (entry.detalhes && entry.detalhes.motivo) {
        linhas.push(`Motivo: ${entry.detalhes.motivo}`);
      }
        if (entry.detalhes && entry.detalhes.observacao) {
          linhas.push(`Obs.: ${entry.detalhes.observacao}`);
        }
        if (entry.detalhes && entry.detalhes.osNumero) {
          linhas.push(`OS: ${entry.detalhes.osNumero}`);
        }
        if (entry.detalhes && entry.detalhes.participantes) {
          const participantesTexto = Array.isArray(entry.detalhes.participantes)
            ? getParticipantesLabel(entry.detalhes.participantes)
            : entry.detalhes.participantes;
          linhas.push(`Participantes: ${participantesTexto}`);
        }
        if (entry.detalhes && entry.detalhes.critico !== undefined) {
          linhas.push(`Critico: ${entry.detalhes.critico ? "Sim" : "Nao"}`);
        }
        if (entry.detalhes && entry.detalhes.documentos) {
          const docsTexto = Array.isArray(entry.detalhes.documentos)
            ? entry.detalhes.documentos.join(", ")
            : Object.keys(entry.detalhes.documentos).join(", ");
          if (docsTexto) {
            linhas.push(`Documentos: ${docsTexto}`);
          }
        }
        if (entry.detalhes && entry.detalhes.resultado) {
          linhas.push(
            `Resultado: ${
            RESULTADO_LABELS[entry.detalhes.resultado] || entry.detalhes.resultado
          }`
        );
      }
      if (entry.detalhes && entry.detalhes.referencia) {
        linhas.push(`Referencia: ${entry.detalhes.referencia}`);
      }
      if (entry.detalhes && entry.detalhes.observacaoExecucao) {
        linhas.push(`Obs. execucao: ${entry.detalhes.observacaoExecucao}`);
      }
      if (entry.detalhes && entry.detalhes.evidenciasCount !== undefined) {
        linhas.push(`Evidencias: ${entry.detalhes.evidenciasCount}`);
      }
      if (entry.detalhes && entry.detalhes.inicioExecucao) {
        linhas.push(`Inicio execucao: ${formatHistoricoData(entry.detalhes.inicioExecucao)}`);
      }
      if (entry.detalhes && entry.detalhes.fimExecucao) {
        linhas.push(`Fim execucao: ${formatHistoricoData(entry.detalhes.fimExecucao)}`);
      }
      if (entry.detalhes && entry.detalhes.atrasoDias !== undefined) {
        linhas.push(`Atraso (dias): ${entry.detalhes.atrasoDias}`);
      }
      if (entry.detalhes && entry.detalhes.resumo) {
        linhas.push(entry.detalhes.resumo);
      }
      const detalhesHtml = linhas.length
        ? `<ul>${linhas.map((linha) => `<li>${linha}</li>`).join("")}</ul>`
        : "";
      const label = ACTION_LABELS[entry.action] || entry.action;
      return `
        <div class="item">
          <div class="item-head">
            <strong>${label}</strong>
            <span>${dataEvento ? formatDateTime(dataEvento) : "-"} | ${getUserLabel(
              entry.userId
            )} | ${getOrigemLabel(entry)}</span>
          </div>
          ${detalhesHtml}
        </div>
      `;
    })
    .join("");
  popup.document.write(`
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>Historico ${item.titulo}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1c1c1c; }
          h1 { margin: 0 0 8px; font-size: 20px; }
          p { margin: 0 0 16px; color: #4a4a4a; }
          .item { border: 1px solid #d9d9d9; border-radius: 10px; padding: 12px; margin-bottom: 10px; }
          .item-head { display: flex; flex-direction: column; gap: 4px; }
          .item-head span { font-size: 12px; color: #555; }
          ul { margin: 8px 0 0 16px; padding: 0; }
          li { font-size: 13px; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        ${header}
        ${itens}
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
}

function atualizarDuracaoConclusao() {
  if (!conclusaoInicio || !conclusaoFim || !conclusaoDuracao) {
    return;
  }
  const inicioIso = conclusaoInicio.dataset.iso || "";
  if (!inicioIso || !conclusaoFim.value) {
    conclusaoDuracao.value = "";
    return;
  }
  const inicio = parseTimestamp(inicioIso);
  const fim = parseDateTimeInput(conclusaoFim.value);
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || fim < inicio) {
    conclusaoDuracao.value = "00:00";
    return;
  }
  const minutos = (fim.getTime() - inicio.getTime()) / 60000;
  conclusaoDuracao.value = formatDuracaoMin(minutos);
}

function getEvidenciaFiles() {
  if (!evidenciaInputs.length) {
    return [];
  }
  const files = [];
  evidenciaInputs.forEach((input, index) => {
    if (!input) {
      return;
    }
    const slotValue = Number.parseInt(input.dataset.evidenciaInput, 10);
    const slotIndex = Number.isFinite(slotValue) && slotValue > 0 ? slotValue - 1 : index;
    files[slotIndex] = input.files && input.files[0] ? input.files[0] : null;
  });
  return files;
}

function atualizarSlotsFoto(arquivos) {
  if (!fotoSlots.length) {
    return;
  }
  fotoSlots.forEach((slot, index) => {
    const slotValue = Number.parseInt(slot.dataset.photoSlot, 10);
    const labelIndex = Number.isFinite(slotValue) && slotValue > 0 ? slotValue : index + 1;
    const fileIndex = Number.isFinite(slotValue) && slotValue > 0 ? slotValue - 1 : index;
    const baseLabel = `Foto ${labelIndex}*`;
    const file = arquivos[fileIndex];
    if (file) {
      const nome = file.name ? ` - ${file.name}` : "";
      slot.textContent = `${baseLabel}${nome}`;
      slot.classList.add("is-filled");
      const invalido = !(file.type && file.type.startsWith("image/"));
      slot.classList.toggle("is-invalid", invalido);
      return;
    }
    slot.textContent = baseLabel;
    slot.classList.remove("is-filled");
    slot.classList.remove("is-invalid");
  });
}

function atualizarListaEvidencias() {
  const arquivos = getEvidenciaFiles();
  atualizarSlotsFoto(arquivos);
  if (!conclusaoEvidenciasLista) {
    return;
  }
  conclusaoEvidenciasLista.innerHTML = "";
  arquivos.forEach((file, index) => {
    if (!file) {
      return;
    }
    const item = document.createElement("span");
    item.className = "file-chip";
    item.textContent = `Foto ${index + 1}: ${file.name}`;
    if (!file.type || !file.type.startsWith("image/")) {
      item.classList.add("file-chip--invalid");
    }
    conclusaoEvidenciasLista.append(item);
  });
}

function lerDocumentoFile(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      resolve({ nome: file.name, type: file.type || "", dataUrl: reader.result });
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

function lerEvidencias(files) {
  const lista = Array.from(files || []);
  return Promise.all(
    lista.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({ nome: file.name, type: file.type || "", dataUrl: reader.result });
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(file);
        })
    )
  ).then((itens) => itens.filter(Boolean));
}

function abrirConclusao(item) {
  if (!requirePermission("complete")) {
    return;
  }
  if (!modalConclusao || !formConclusao) {
    return;
  }
  if (!item || (item.status !== "em_execucao" && item.status !== "encerramento")) {
    mostrarMensagemManutencao("Inicie a execucao antes de concluir.", true);
    return;
  }
  if (!item.executionStartedAt) {
    mostrarMensagemManutencao("Inicio da execucao nao encontrado.", true);
    return;
  }
  const registro = item.registroExecucao;
  if (
    !registro ||
    !registro.executadoPor ||
    !registro.resultado ||
    !registro.comentario
  ) {
    mostrarMensagemManutencao("Registre a execucao antes de concluir.", true);
    return;
  }
  manutencaoEmConclusao = item.id;
  mostrarMensagemConclusao("");

  if (conclusaoId) {
    conclusaoId.value = item.id;
  }
  if (conclusaoTipo) {
    conclusaoTipo.value = item.titulo || "";
  }
  if (conclusaoSubestacao) {
    conclusaoSubestacao.value = item.local || "";
  }
  if (conclusaoCodigo) {
    conclusaoCodigo.value = item.id;
  }
  if (conclusaoAbertaPor) {
    conclusaoAbertaPor.value = getUserLabel(item.createdBy);
  }
  if (conclusaoAbertaEm) {
    const createdAt = parseTimestamp(item.createdAt);
    conclusaoAbertaEm.value = createdAt ? formatDateTime(createdAt) : "-";
  }
  if (conclusaoEncerradaPor) {
    conclusaoEncerradaPor.value = currentUser ? getUserLabel(currentUser.id) : "-";
  }

  if (conclusaoExecutadaPor) {
    conclusaoExecutadaPor.value = getUserLabel(registro.executadoPor);
  }
  if (conclusaoComentario) {
    conclusaoComentario.value = registro.comentario || "";
  }
  if (conclusaoResultado) {
    conclusaoResultado.value = RESULTADO_LABELS[registro.resultado] || registro.resultado;
  }
  if (conclusaoObsExecucao) {
    conclusaoObsExecucao.value = registro.observacaoExecucao || "";
  }
  const liberacao = getLiberacao(item) || {};
  if (conclusaoReferencia) {
    const osNumero = liberacao.osNumero || "";
    conclusaoReferencia.value = osNumero;
    conclusaoReferencia.readOnly = Boolean(osNumero);
  }
  evidenciaInputs.forEach((input) => {
    if (input) {
      input.value = "";
    }
  });
  if (conclusaoEvidenciasLista) {
    conclusaoEvidenciasLista.innerHTML = "";
  }
  atualizarListaEvidencias();

  const inicio = parseTimestamp(item.executionStartedAt);
  if (conclusaoInicio) {
    conclusaoInicio.value = inicio ? formatDateTime(inicio) : "-";
    conclusaoInicio.dataset.iso = item.executionStartedAt || "";
  }
  if (conclusaoFim) {
    const agora = new Date();
    conclusaoFim.value = formatDateTimeInput(agora);
    conclusaoFim.min = inicio ? formatDateTimeInput(inicio) : "";
  }
  if (conclusaoDuracao) {
    const agora = new Date();
    const minutos =
      inicio && !Number.isNaN(agora.getTime())
        ? Math.max(0, Math.round((agora.getTime() - inicio.getTime()) / 60000))
        : 0;
    conclusaoDuracao.value = minutos ? formatDuracaoMin(minutos) : "-";
  }
  if (conclusaoParticipantes) {
    conclusaoParticipantes.value = getParticipantesLabel(liberacao.participantes);
  }
  if (conclusaoDocs) {
    renderDocList(conclusaoDocs, liberacao.documentos, liberacao.critico);
  }
  atualizarDuracaoConclusao();

  modalConclusao.hidden = false;
}

function fecharConclusao() {
  if (!modalConclusao) {
    return;
  }
  modalConclusao.hidden = true;
  manutencaoEmConclusao = null;
}

async function salvarConclusao(event) {
  event.preventDefault();
  if (!requirePermission("complete")) {
    return;
  }
  if (!manutencaoEmConclusao) {
    mostrarMensagemConclusao("Selecione uma manutencao.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmConclusao);
  if (index < 0) {
    mostrarMensagemConclusao("Manutencao nao encontrada.", true);
    return;
  }

  const item = manutencoes[index];
  if (item.status !== "em_execucao" && item.status !== "encerramento") {
    mostrarMensagemConclusao("Inicie a execucao antes de concluir.", true);
    return;
  }
  const registro = item.registroExecucao;
  if (
    !registro ||
    !registro.executadoPor ||
    !registro.resultado ||
    !registro.comentario
  ) {
    mostrarMensagemConclusao("Registre a execucao antes de concluir.", true);
    return;
  }
  const liberacao = getLiberacao(item);
  if (!isLiberacaoOk(item)) {
    mostrarMensagemConclusao("Documentacao de liberacao pendente.", true);
    return;
  }
  const executadoPor = registro.executadoPor;
  const resultado = registro.resultado;
  const comentario = registro.comentario;
  const observacaoExecucao = registro.observacaoExecucao || "";
  const referenciaInformada = conclusaoReferencia ? conclusaoReferencia.value.trim() : "";
  const referencia = referenciaInformada || (liberacao ? liberacao.osNumero || "" : "");
  if (!referencia) {
    mostrarMensagemConclusao("Informe o No OS / referencia.", true);
    return;
  }
  const inicioDate = parseTimestamp(item.executionStartedAt);
  if (!inicioDate) {
    mostrarMensagemConclusao("Inicio da execucao nao encontrado.", true);
    return;
  }
  const fimValor = conclusaoFim ? conclusaoFim.value : "";
  const fimDate = parseDateTimeInput(fimValor);
  if (!fimDate) {
    mostrarMensagemConclusao("Informe o horario de fim da execucao.", true);
    return;
  }
  if (fimDate < inicioDate) {
    mostrarMensagemConclusao("Fim deve ser maior ou igual ao inicio.", true);
    return;
  }
  const duracaoHoras = (fimDate.getTime() - inicioDate.getTime()) / 3600000;
  if (duracaoHoras > MAX_EXECUCAO_HORAS) {
    const confirmar = window.confirm(
      `Execucao com ${Math.round(duracaoHoras)}h. Deseja continuar?`
    );
    if (!confirmar) {
      return;
    }
  }
  const arquivos = getEvidenciaFiles();
  const arquivosValidos = arquivos.filter(Boolean);
  if (arquivosValidos.length < MIN_EVIDENCIAS) {
    mostrarMensagemConclusao(`Adicione as ${MIN_EVIDENCIAS} fotos obrigatorias.`, true);
    return;
  }
  const arquivosInvalidos = arquivosValidos.filter(
    (file) => !file.type || !file.type.startsWith("image/")
  );
  if (arquivosInvalidos.length) {
    mostrarMensagemConclusao("Apenas fotos sao permitidas.", true);
    return;
  }
  mostrarMensagemConclusao("Processando evidencias...");
  const evidencias = await lerEvidencias(arquivosValidos);
  if (evidencias.length < MIN_EVIDENCIAS) {
    mostrarMensagemConclusao("Nao foi possivel ler as evidencias.", true);
    return;
  }

  const minutos = (fimDate.getTime() - inicioDate.getTime()) / 60000;
  const inicioIso = toIsoUtc(inicioDate);
  const fimIso = toIsoUtc(fimDate);
  const conclusao = {
    executadoPor,
    encerradoPor: currentUser.id,
    inicio: inicioIso,
    fim: fimIso,
    duracaoMin: Math.round(minutos),
    comentario,
    resultado,
    referencia,
    observacaoExecucao,
    evidencias,
  };

  const atualizado = {
    ...item,
    executionStartedAt: inicioIso,
    executionFinishedAt: fimIso,
    status: "concluida",
    doneAt: fimIso,
    doneBy: currentUser.id,
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
    conclusao,
  };

  manutencoes[index] = atualizado;
  salvarManutencoes(manutencoes);
  const dataProgramada = item.data ? parseDate(item.data) : null;
  const atrasoDias =
    dataProgramada && fimDate
      ? diffInDays(startOfDay(dataProgramada), startOfDay(fimDate))
      : null;
  const documentosLista = DOC_KEYS.filter(
    (key) => liberacao && liberacao.documentos && liberacao.documentos[key]
  ).map((key) => DOC_LABELS[key] || key);
  logAction("complete", atualizado, {
    dataProgramada: item.data || "",
    dataConclusao: formatDateISO(startOfDay(fimDate)),
    atrasoDias,
    executadoPor,
    resultado,
    referencia,
    osNumero: liberacao ? liberacao.osNumero || "" : "",
    participantes: liberacao ? liberacao.participantes || [] : [],
    critico: liberacao ? liberacao.critico : undefined,
    documentos: documentosLista,
    observacaoExecucao,
    evidenciasCount: evidencias.length,
    inicioExecucao: inicioIso,
    fimExecucao: fimIso,
    resumo: `Executada por ${getUserLabel(executadoPor)} | ${formatDuracaoMin(minutos)}`,
  });
  renderTudo();
  fecharConclusao();
  mostrarMensagemManutencao("Manutencao concluida.");
}

function abrirRelatorio(item) {
  if (!modalRelatorio) {
    return;
  }
  const conclusao = item.conclusao || {};
  const liberacao = getLiberacao(item) || {};
  const inicio = conclusao.inicio ? parseTimestamp(conclusao.inicio) : null;
  const fim = conclusao.fim ? parseTimestamp(conclusao.fim) : null;

  if (relatorioTipo) {
    relatorioTipo.textContent = item.titulo || "-";
  }
  if (relatorioSubestacao) {
    relatorioSubestacao.textContent = item.local || "-";
  }
  if (relatorioCodigo) {
    relatorioCodigo.textContent = item.id || "-";
  }
  if (relatorioAbertaEm) {
    const createdAt = parseTimestamp(item.createdAt);
    relatorioAbertaEm.textContent = createdAt ? formatDateTime(createdAt) : "-";
  }
  if (relatorioInicio) {
    relatorioInicio.textContent = inicio ? formatDateTime(inicio) : "-";
  }
  if (relatorioFim) {
    relatorioFim.textContent = fim ? formatDateTime(fim) : "-";
  }
  if (relatorioDuracao) {
    const duracaoMin = Number.isFinite(conclusao.duracaoMin) ? conclusao.duracaoMin : null;
    relatorioDuracao.textContent = duracaoMin !== null ? formatDuracaoMin(duracaoMin) : "-";
  }
  if (relatorioAbertaPor) {
    relatorioAbertaPor.textContent = getUserLabel(item.createdBy);
  }
  if (relatorioExecutadaPor) {
    relatorioExecutadaPor.textContent = getUserLabel(conclusao.executadoPor || item.doneBy);
  }
  if (relatorioEncerradaPor) {
    relatorioEncerradaPor.textContent = getUserLabel(conclusao.encerradoPor || item.doneBy);
  }
  if (relatorioResultado) {
    const label = RESULTADO_LABELS[conclusao.resultado] || "-";
    relatorioResultado.textContent = label;
  }
  if (relatorioReferencia) {
    relatorioReferencia.textContent = conclusao.referencia || liberacao.osNumero || "-";
  }
  if (relatorioEmitidoEm) {
    relatorioEmitidoEm.textContent = formatDateTime(new Date());
  }
  if (relatorioDescricao) {
    relatorioDescricao.textContent = conclusao.comentario || item.observacao || "-";
  }
  if (relatorioObsExecucao) {
    relatorioObsExecucao.textContent = conclusao.observacaoExecucao || "-";
  }

  if (relatorioEvidencias) {
    relatorioEvidencias.innerHTML = "";
    const evidencias = Array.isArray(conclusao.evidencias) ? conclusao.evidencias : [];
    if (evidencias.length === 0) {
      const vazio = document.createElement("p");
      vazio.className = "empty-state";
      vazio.textContent = "Sem evidencias.";
      relatorioEvidencias.append(vazio);
    } else {
      evidencias.forEach((evidencia) => {
        if (evidencia.type && evidencia.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = evidencia.dataUrl || evidencia.url || "";
          img.alt = evidencia.nome || "Evidencia";
          relatorioEvidencias.append(img);
          return;
        }
        const link = document.createElement("a");
        link.href = evidencia.dataUrl || evidencia.url || "#";
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = evidencia.nome || "Arquivo";
        relatorioEvidencias.append(link);
      });
    }
  }

  modalRelatorio.hidden = false;
}

function fecharRelatorio() {
  if (!modalRelatorio) {
    return;
  }
  modalRelatorio.hidden = true;
}

function imprimirRelatorio() {
  if (!modalRelatorio || modalRelatorio.hidden) {
    return;
  }
  window.print();
}

function removerManutencao(index) {
  if (!requirePermission("remove")) {
    return;
  }
  const item = manutencoes[index];
  const confirmar = window.confirm("Remover esta manutencao?");
  if (!confirmar) {
    return;
  }
  manutencoes.splice(index, 1);
  salvarManutencoes(manutencoes);
  logAction("remove", item, { resumo: "Removida" });
  renderTudo();
  mostrarMensagemManutencao("Manutencao removida.");
}

function agirNaManutencao(event) {
  const botao = event.target.closest("button[data-action]");
  if (!botao) {
    return;
  }

  const card = botao.closest("[data-id]");
  if (!card) {
    return;
  }

  const id = card.dataset.id;
  const index = manutencoes.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const acao = botao.dataset.action;
  if (acao === "edit") {
    editarManutencao(index);
  }
  if (acao === "note") {
    registrarObservacao(index);
  }
  if (acao === "reschedule") {
    reagendarManutencao(index);
  }
  if (acao === "release") {
    liberarManutencao(index);
  }
  if (acao === "execute") {
    executarManutencao(index);
  }
  if (acao === "register") {
    abrirRegistroExecucao(manutencoes[index]);
  }
  if (acao === "cancel_start") {
    abrirCancelarInicio(manutencoes[index]);
  }
  if (acao === "finish") {
    abrirConclusao(manutencoes[index]);
  }
  if (acao === "history") {
    abrirHistorico(manutencoes[index]);
  }
  if (acao === "remove") {
    removerManutencao(index);
  }
}

function ativarTab(nome) {
  tabButtons.forEach((botao) => {
    const ativo = botao.dataset.tab === nome;
    botao.classList.toggle("is-active", ativo);
    botao.classList.toggle("active", ativo);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === nome);
  });
}

async function apiLogin(login, senha) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ login, senha }),
  });
}

async function apiLogout() {
  return apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
}

async function apiRegister(payload) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function apiInvite(role) {
  return apiRequest("/api/auth/invite", {
    method: "POST",
    body: JSON.stringify({ role }),
  });
}

async function apiAdminUsers() {
  return apiRequest("/api/admin/users");
}

async function apiAdminPermissions() {
  return apiRequest("/api/admin/permissions");
}

async function apiAdminUpdateUser(userId, payload) {
  return apiRequest(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

async function apiUploadAvatar(dataUrl) {
  return apiRequest("/api/profile/avatar", {
    method: "POST",
    body: JSON.stringify({ dataUrl }),
  });
}

async function apiMaintenanceSync(items) {
  return apiRequest("/api/maintenance/sync", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

async function apiMaintenanceRelease(payload) {
  return apiRequest("/api/maintenance/release", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

async function apiDashboardSummary() {
  return apiRequest("/api/dashboard/summary");
}

async function syncMaintenanceNow(items, force) {
  if (!currentUser) {
    return;
  }
  if (maintenanceSyncPromise) {
    return maintenanceSyncPromise;
  }
  if (!force && Date.now() - maintenanceLastSync < 10 * 1000) {
    return;
  }
  maintenanceSyncPromise = apiMaintenanceSync(items);
  try {
    await maintenanceSyncPromise;
    maintenanceLastSync = Date.now();
    maintenanceLastUserId = currentUser.id;
  } catch (error) {
    // Falha silenciosa; dashboard trata fallback.
  } finally {
    maintenanceSyncPromise = null;
  }
}

function scheduleMaintenanceSync(items, force) {
  if (!currentUser) {
    return;
  }
  if (force) {
    if (maintenanceSyncTimer) {
      clearTimeout(maintenanceSyncTimer);
      maintenanceSyncTimer = null;
    }
    syncMaintenanceNow(items, true).then(() => {
      loadDashboardSummary(true);
    });
    return;
  }
  if (maintenanceSyncTimer) {
    return;
  }
  maintenanceSyncTimer = setTimeout(() => {
    maintenanceSyncTimer = null;
    syncMaintenanceNow(items, false).then(() => {
      loadDashboardSummary(true);
    });
  }, 600);
}

async function loadDashboardSummary(force) {
  if (!currentUser) {
    return;
  }
  const agora = Date.now();
  if (!force && dashboardRequest) {
    return;
  }
  if (!force && dashboardSummary && agora - dashboardLastFetch < DASHBOARD_CLIENT_TTL_MS) {
    return;
  }
  dashboardError = "";
  dashboardRequest = (async () => {
    await syncMaintenanceNow(manutencoes, force || !dashboardSummary);
    return apiDashboardSummary();
  })();
  try {
    const data = await dashboardRequest;
    dashboardSummary = data;
    dashboardLastFetch = Date.now();
  } catch (error) {
    dashboardSummary = null;
    dashboardError = "Falha ao carregar indicadores. Recarregue.";
  } finally {
    dashboardRequest = null;
    renderDashboardHome();
  }
}

function aprovarSolicitacao(item) {
  if (!isAdmin()) {
    return;
  }
  const requestId = item.dataset.requestId;
  const solicitacao = requests.find((req) => req.id === requestId);
  if (!solicitacao) {
    return;
  }

  const permissions = {};
  Object.keys(PERMISSIONS).forEach((key) => {
    const checkbox = item.querySelector(`input[data-permission="${key}"]`);
    permissions[key] = checkbox ? checkbox.checked : false;
  });

  const sections = {};
  Object.keys(SECTION_LABELS).forEach((key) => {
    const checkbox = item.querySelector(`input[data-section="${key}"]`);
    sections[key] = checkbox ? checkbox.checked : true;
  });

  const roleCheckbox = item.querySelector("input[data-role='admin']");
  const isAdminChecked = Boolean(roleCheckbox && roleCheckbox.checked);

  const novoUsuario = {
    id: criarId(),
    username: solicitacao.matricula,
    matricula: solicitacao.matricula,
    name: solicitacao.nome,
    role: isAdminChecked ? "admin" : "colaborador",
    password: solicitacao.senha,
    permissions: isAdminChecked ? getDefaultPermissions() : permissions,
    sections: isAdminChecked ? { ...DEFAULT_SECTIONS } : sections,
    createdAt: toIsoUtc(new Date()),
  };

  users = [...users, novoUsuario];
  requests = requests.filter((req) => req.id !== requestId);
  salvarUsuarios(users);
  salvarSolicitacoes(requests);
  renderSolicitacoes();
  renderUsuarios();
}

function recusarSolicitacao(item) {
  if (!isAdmin()) {
    return;
  }
  const requestId = item.dataset.requestId;
  requests = requests.filter((req) => req.id !== requestId);
  salvarSolicitacoes(requests);
  renderSolicitacoes();
}

function atualizarPermissoesUsuario(checkbox) {
  const userId = checkbox.dataset.userId;
  const permission = checkbox.dataset.permission;
  const user = users.find((usuario) => usuario.id === userId);
  if (!user || user.role === "admin") {
    return;
  }
  user.permissions = user.permissions || {};
  user.permissions[permission] = checkbox.checked;
  salvarUsuarios(users);
  if (currentUser && currentUser.id === userId) {
    currentUser = user;
    renderAuthUI();
  }
}

function contarAdmins() {
  return users.filter((user) => user.role === "admin").length;
}

function atualizarSecoesUsuario(checkbox) {
  const userId = checkbox.dataset.userId;
  const section = checkbox.dataset.section;
  const user = users.find((usuario) => usuario.id === userId);
  if (!user || user.role === "admin") {
    return;
  }
  user.sections = user.sections || { ...DEFAULT_SECTIONS };
  user.sections[section] = checkbox.checked;
  salvarUsuarios(users);
  if (currentUser && currentUser.id === userId) {
    currentUser = user;
  }
  renderAuthUI();
}

function atualizarRoleUsuario(checkbox) {
  if (!isAdmin()) {
    return;
  }
  const userId = checkbox.dataset.userId;
  const user = users.find((usuario) => usuario.id === userId);
  if (!user) {
    return;
  }
  if (currentUser && user.id === currentUser.id) {
    checkbox.checked = true;
    mostrarMensagemGerencial("Nao e possivel alterar o proprio cargo.", true);
    return;
  }
  if (!checkbox.checked && user.role === "admin" && contarAdmins() <= 1) {
    checkbox.checked = true;
    mostrarMensagemGerencial("Deve existir pelo menos um administrador.", true);
    return;
  }
  user.role = checkbox.checked ? "admin" : "colaborador";
  if (user.role === "admin") {
    user.permissions = getDefaultPermissions();
    user.sections = { ...DEFAULT_SECTIONS };
  } else {
    user.permissions = user.permissions || getDefaultPermissions();
    user.sections = user.sections || { ...DEFAULT_SECTIONS };
  }
  salvarUsuarios(users);
  renderTudo();
}

function salvarDadosUsuario(item) {
  if (!isAdmin()) {
    return;
  }
  const userId = item.dataset.userId;
  const user = users.find((usuario) => usuario.id === userId);
  if (!user) {
    return;
  }
  const cargoInput = item.querySelector("[data-user-field='cargo']");
  const projetoInput = item.querySelector("[data-user-field='projeto']");
  const atribuicoesInput = item.querySelector("[data-user-field='atribuicoes']");
  user.cargo = cargoInput ? cargoInput.value.trim() : "";
  user.projeto = projetoInput ? projetoInput.value.trim() : "";
  user.atribuicoes = atribuicoesInput ? atribuicoesInput.value.trim() : "";
  salvarUsuarios(users);
  renderUsuarios();
  if (currentUser && currentUser.id === userId) {
    currentUser = user;
    renderAuthUI();
  }
  mostrarMensagemGerencial("Dados da conta atualizados.");
}

function removerUsuario(item) {
  if (!isAdmin()) {
    return;
  }
  const userId = item.dataset.userId;
  const user = users.find((usuario) => usuario.id === userId);
  if (!user) {
    return;
  }
  if (currentUser && user.id === currentUser.id) {
    mostrarMensagemGerencial("Nao e possivel remover a conta logada.", true);
    return;
  }
  if (user.role === "admin" && contarAdmins() <= 1) {
    mostrarMensagemGerencial("Deve existir pelo menos um administrador.", true);
    return;
  }
  const confirmar = window.confirm(`Remover a conta de ${user.name}?`);
  if (!confirmar) {
    return;
  }
  users = users.filter((usuario) => usuario.id !== userId);
  salvarUsuarios(users);
  renderUsuarios();
  mostrarMensagemGerencial("Conta removida.");
}

tabButtons.forEach((botao) => {
  botao.addEventListener("click", () => {
    const tab = botao.dataset.tab;
    const scrollTarget = botao.dataset.scrollTarget;
    abrirPainelComCarregamento(tab, scrollTarget);
  });
});

document.querySelectorAll("[data-open-tab]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const tab = link.dataset.openTab;
    if (tab) {
      const href = link.getAttribute("href");
      const scrollTarget = href && href.startsWith("#") ? href.slice(1) : null;
      abrirPainelComCarregamento(tab, scrollTarget);
    }
  });
});


if (btnLembretes) {
  btnLembretes.addEventListener("click", (event) => {
    event.stopPropagation();
    alternarPainelLembretes();
  });
}

if (listaLembretes) {
  listaLembretes.addEventListener("click", (event) => {
    const item = event.target.closest(".lembrete-item");
    if (!item) {
      return;
    }
    const id = item.dataset.maintenanceId;
    if (!id) {
      return;
    }
    markNotificationRead(id);
    renderLembretes();
    fecharPainelLembretes();
    openMaintenanceFromNotification(id);
  });
}

document.addEventListener("click", (event) => {
  if (painelLembretes && !painelLembretes.hidden && btnLembretes) {
    const dentro =
      painelLembretes.contains(event.target) || btnLembretes.contains(event.target);
    if (!dentro) {
      fecharPainelLembretes();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharPainelLembretes();
  }
});

if (usuarioAtual) {
  usuarioAtual.addEventListener("click", () => {
    if (!currentUser) {
      return;
    }
    abrirPainelComCarregamento("perfil");
  });
}


if (btnTabLogin) {
  btnTabLogin.addEventListener("click", () => {
    if (authPanels && !authPanels.hidden && authPanelLogin && !authPanelLogin.hidden) {
      esconderAuthPanels();
      return;
    }
    mostrarAuthPanel("login");
    if (loginUsuario) {
      loginUsuario.focus();
    }
  });
}

if (btnTabRegistro) {
  btnTabRegistro.addEventListener("click", () => {
    if (authPanels && !authPanels.hidden && authPanelRegistro && !authPanelRegistro.hidden) {
      esconderAuthPanels();
      return;
    }
    mostrarAuthPanel("registro");
    if (reqMatricula) {
      reqMatricula.focus();
    }
  });
}

if (btnSair) {
  btnSair.addEventListener("click", async () => {
    try {
      await apiLogout();
    } catch (error) {
      // noop
    }
    currentUser = null;
    renderTudo();
    mostrarAuthPanel("login");
  });
}

if (btnSalvarConfig) {
  btnSalvarConfig.addEventListener("click", salvarConfiguracoes);
}

if (btnExportarDados) {
  btnExportarDados.addEventListener("click", exportarDados);
}

if (btnImportarDados) {
  btnImportarDados.addEventListener("click", importarDados);
}

if (btnLimparConcluidas) {
  btnLimparConcluidas.addEventListener("click", limparConcluidas);
}

if (btnLimparAuditoria) {
  btnLimparAuditoria.addEventListener("click", limparAuditoria);
}

if (btnRecalcularBacklog) {
  btnRecalcularBacklog.addEventListener("click", recalcularBacklog);
}

if (btnGerarRelatorio) {
  btnGerarRelatorio.addEventListener("click", gerarRelatorio);
}
if (btnGerarConvite) {
  btnGerarConvite.addEventListener("click", async () => {
    if (!isAdmin()) {
      return;
    }
    if (inviteResultado) {
      inviteResultado.textContent = "Gerando convite...";
    }
    try {
      const role = inviteRole ? inviteRole.value : "EXECUTOR";
      const data = await apiInvite(role);
      const expira = data.expiresAt ? formatDateTime(new Date(data.expiresAt)) : "-";
      if (inviteResultado) {
        inviteResultado.textContent = `Convite: ${data.code} | Perfil: ${role} | Expira: ${expira}`;
      }
    } catch (error) {
      if (inviteResultado) {
        inviteResultado.textContent = "Nao foi possivel gerar o convite.";
      }
    }
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const login = loginUsuario.value.trim();
  const senha = loginSenha.value.trim();
  if (!login || !senha) {
    mostrarMensagemConta("Informe usuario e senha.", true);
    return;
  }
  if (btnLoginSubmit) {
    btnLoginSubmit.disabled = true;
    btnLoginSubmit.textContent = "Entrando...";
  }
  try {
    const data = await apiLogin(login, senha);
    currentUser = data.user;
    await carregarUsuariosServidor();
    mostrarMensagemConta(`Bem-vindo, ${currentUser.name}.`);
    loginSenha.value = "";
    esconderAuthPanels();
    renderTudo();
  } catch (error) {
    mostrarMensagemConta("Usuario ou senha invalidos.", true);
  } finally {
    if (btnLoginSubmit) {
      btnLoginSubmit.disabled = false;
      btnLoginSubmit.textContent = "Entrar";
    }
  }
});

reqForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setFieldError(reqSenhaErro, "");
  setFieldError(reqSenhaConfirmErro, "");
  setFieldError(reqCodigoErro, "");
  const matricula = reqMatricula.value.trim().toUpperCase();
  const nome = reqNome.value.trim();
  const senha = reqSenha.value.trim();
  const senhaConfirm = reqSenhaConfirm ? reqSenhaConfirm.value.trim() : "";
  const convite = reqCodigoConvite ? reqCodigoConvite.value.trim().toUpperCase() : "";
  const rulesOk = atualizarSenhaRules();
  if (!matricula || !nome || !senha || !senhaConfirm || !convite) {
    mostrarMensagemConta("Preencha os campos obrigatorios.", true);
    if (!convite) {
      setFieldError(reqCodigoErro, "Codigo de convite obrigatorio.");
    }
    if (!rulesOk) {
      setFieldError(reqSenhaErro, "Senha fora da politica.");
    }
    if (senha !== senhaConfirm) {
      setFieldError(reqSenhaConfirmErro, "As senhas nao conferem.");
    }
    return;
  }
  if (!rulesOk) {
    setFieldError(reqSenhaErro, "Senha fora da politica.");
    return;
  }
  if (senha !== senhaConfirm) {
    setFieldError(reqSenhaConfirmErro, "As senhas nao conferem.");
    return;
  }
  if (btnRegistroSubmit) {
    btnRegistroSubmit.disabled = true;
    btnRegistroSubmit.textContent = "Solicitando...";
  }
  try {
    await apiRegister({ matricula, nome, senha, senhaConfirm, convite });
    mostrarMensagemConta("Conta criada. Faca login.", false);
    reqMatricula.value = "";
    reqNome.value = "";
    reqSenha.value = "";
    if (reqSenhaConfirm) {
      reqSenhaConfirm.value = "";
    }
    if (reqCodigoConvite) {
      reqCodigoConvite.value = "";
    }
    mostrarAuthPanel("login");
  } catch (error) {
    const errors = error.data && error.data.errors ? error.data.errors : {};
    if (errors.senha) {
      setFieldError(reqSenhaErro, errors.senha);
    }
    if (errors.senhaConfirm) {
      setFieldError(reqSenhaConfirmErro, errors.senhaConfirm);
    }
    if (errors.convite) {
      setFieldError(reqCodigoErro, errors.convite);
    }
    mostrarMensagemConta("Nao foi possivel criar a conta.", true);
  } finally {
    if (btnRegistroSubmit) {
      btnRegistroSubmit.disabled = false;
      btnRegistroSubmit.textContent = "Solicitar acesso";
    }
  }
});

if (tipoManutencao) {
  tipoManutencao.addEventListener("change", atualizarTipoSelecionado);
}

if (templateForm) {
  templateForm.addEventListener("submit", salvarModelo);
  templateForm.addEventListener("input", handleTemplateFormChange);
  templateForm.addEventListener("change", handleTemplateFormChange);
}

document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => togglePassword(button));
});
bindCapsLockIndicator(loginSenha, capsLockLogin);
bindCapsLockIndicator(reqSenha, capsLockRegistro);

if (reqSenha) {
  reqSenha.addEventListener("input", atualizarSenhaRules);
}
if (reqSenhaRules) {
  atualizarSenhaRules();
}

if (btnPresetDiasUteis) {
  btnPresetDiasUteis.addEventListener("click", aplicarPresetDiasUteis);
}

if (templatePresets) {
  templatePresets.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-template-preset]");
    if (!botao) {
      return;
    }
    aplicarPresetModelo(botao.dataset.templatePreset);
  });
}

if (btnCancelarModelo) {
  btnCancelarModelo.addEventListener("click", () => {
    limparTemplateForm();
  });
}

if (templateFrequencia) {
  templateFrequencia.addEventListener("change", () => atualizarTemplateFrequenciaUI(true));
}
if (templateMonthlyFixed) {
  templateMonthlyFixed.addEventListener("change", () => atualizarTemplateMonthlyUI(true));
}
if (templateMonthlyMulti) {
  templateMonthlyMulti.addEventListener("change", () => atualizarTemplateMonthlyUI(true));
}
if (templateSearch) {
  templateSearch.addEventListener("input", renderModelos);
}
if (templateFilterSubestacao) {
  templateFilterSubestacao.addEventListener("change", renderModelos);
}
if (templateSort) {
  templateSort.addEventListener("change", renderModelos);
}
if (filtroProgramacaoSubestacao) {
  filtroProgramacaoSubestacao.addEventListener("change", renderProgramacao);
}
if (filtroProgramacaoStatus) {
  filtroProgramacaoStatus.addEventListener("change", renderProgramacao);
}
if (filtroProgramacaoPeriodo) {
  filtroProgramacaoPeriodo.addEventListener("change", renderProgramacao);
}
if (kpiPeriodo) {
  kpiPeriodo.addEventListener("change", () => {
    kpiDrilldown = null;
    renderGrafico();
  });
}
if (kpiSubestacao) {
  kpiSubestacao.addEventListener("change", () => {
    kpiDrilldown = null;
    renderGrafico();
  });
}
if (kpiCategoria) {
  kpiCategoria.addEventListener("change", () => {
    kpiDrilldown = null;
    renderGrafico();
  });
}
if (kpiPrioridade) {
  kpiPrioridade.addEventListener("change", () => {
    kpiDrilldown = null;
    renderGrafico();
  });
}
if (kpiUsuarioFiltro) {
  kpiUsuarioFiltro.addEventListener("change", () => {
    kpiDrilldown = null;
    renderGrafico();
  });
}
if (kpiDrilldownLimite) {
  kpiDrilldownLimite.addEventListener("change", renderKpiDrilldown);
}
if (kpiCards) {
  kpiCards.addEventListener("click", handleKpiDrilldownClick);
}
if (kpiTrendChart) {
  kpiTrendChart.addEventListener("click", handleKpiDrilldownClick);
}
if (kpiAgingChart) {
  kpiAgingChart.addEventListener("click", handleKpiDrilldownClick);
}
if (kpiSlaChart) {
  kpiSlaChart.addEventListener("click", handleKpiDrilldownClick);
}
if (kpiRanking) {
  kpiRanking.addEventListener("click", handleKpiDrilldownClick);
  kpiRanking.addEventListener("click", handleKpiRankingSort);
}

if (btnAdicionarManutencao) {
  btnAdicionarManutencao.addEventListener("click", adicionarManutencao);
}
if (listaAgendadas) {
  listaAgendadas.addEventListener("click", agirNaManutencao);
}
if (listaBacklog) {
  listaBacklog.addEventListener("click", agirNaManutencao);
}
if (listaConcluidas) {
  listaConcluidas.addEventListener("click", agirNaManutencao);
}
if (listaExecucaoHoje) {
  listaExecucaoHoje.addEventListener("click", agirNaManutencao);
}
if (listaExecucaoVencidas) {
  listaExecucaoVencidas.addEventListener("click", agirNaManutencao);
}
if (listaExecucaoCriticas) {
  listaExecucaoCriticas.addEventListener("click", agirNaManutencao);
}
if (listaRelatorios) {
  listaRelatorios.addEventListener("click", (event) => {
    const botao = event.target.closest("button[data-action='open-report']");
    if (!botao) {
      return;
    }
    const card = botao.closest("[data-id]");
    if (!card) {
      return;
    }
    const item = manutencoes.find((registro) => registro.id === card.dataset.id);
    if (item) {
      abrirRelatorio(item);
    }
  });
}
if (formConclusao) {
  formConclusao.addEventListener("submit", salvarConclusao);
}
if (conclusaoFim) {
  conclusaoFim.addEventListener("input", atualizarDuracaoConclusao);
}
if (formRegistroExecucao) {
  formRegistroExecucao.addEventListener("submit", salvarRegistroExecucao);
}
if (formCancelarExecucao) {
  formCancelarExecucao.addEventListener("submit", salvarCancelamentoExecucao);
}
if (formLiberacao) {
  formLiberacao.addEventListener("submit", salvarLiberacao);
}
if (formOverride) {
  formOverride.addEventListener("submit", confirmarOverrideLiberacao);
}
if (btnFecharConclusao) {
  btnFecharConclusao.addEventListener("click", fecharConclusao);
}
if (btnCancelarConclusao) {
  btnCancelarConclusao.addEventListener("click", fecharConclusao);
}
if (btnFecharLiberacao) {
  btnFecharLiberacao.addEventListener("click", fecharLiberacao);
}
if (btnCancelarLiberacao) {
  btnCancelarLiberacao.addEventListener("click", fecharLiberacao);
}
if (btnFecharOverride) {
  btnFecharOverride.addEventListener("click", fecharOverrideLiberacao);
}
if (btnCancelarOverride) {
  btnCancelarOverride.addEventListener("click", fecharOverrideLiberacao);
}
if (btnFecharRegistroExecucao) {
  btnFecharRegistroExecucao.addEventListener("click", fecharRegistroExecucao);
}
if (btnCancelarRegistroExecucao) {
  btnCancelarRegistroExecucao.addEventListener("click", fecharRegistroExecucao);
}
if (btnCancelarExecucao) {
  btnCancelarExecucao.addEventListener("click", abrirCancelarExecucao);
}
if (btnVoltarCancelarExecucao) {
  btnVoltarCancelarExecucao.addEventListener("click", fecharCancelarExecucao);
}
if (formCancelarInicio) {
  formCancelarInicio.addEventListener("submit", salvarCancelarInicio);
}
if (btnFecharCancelarInicio) {
  btnFecharCancelarInicio.addEventListener("click", fecharCancelarInicio);
}
if (btnCancelarCancelarInicio) {
  btnCancelarCancelarInicio.addEventListener("click", fecharCancelarInicio);
}
if (formReagendar) {
  formReagendar.addEventListener("submit", salvarReagendamento);
}
if (btnFecharReagendar) {
  btnFecharReagendar.addEventListener("click", fecharReagendamento);
}
if (btnCancelarReagendar) {
  btnCancelarReagendar.addEventListener("click", fecharReagendamento);
}
if (reagendarMotivo) {
  reagendarMotivo.addEventListener("change", () => {
    mostrarMensagemReagendar("");
  });
}
if (cancelarInicioMotivo) {
  cancelarInicioMotivo.addEventListener("change", () => {
    mostrarMensagemCancelarInicio("");
  });
}
if (liberacaoOs) {
  liberacaoOs.addEventListener("input", atualizarLiberacaoChecklist);
}
if (liberacaoParticipantes) {
  liberacaoParticipantes.addEventListener("change", atualizarLiberacaoChecklist);
}
if (liberacaoCritico) {
  liberacaoCritico.addEventListener("change", atualizarLiberacaoCriticoUI);
}
if (overrideMotivo) {
  overrideMotivo.addEventListener("input", () => {
    mostrarMensagemOverride("");
  });
}
if (criticoManutencao) {
  criticoManutencao.addEventListener("change", atualizarNovaCriticoUI);
  atualizarNovaCriticoUI();
}
if (participantesManutencao) {
  participantesManutencao.addEventListener("input", () => {
    setFieldError(participantesManutencaoErro, "");
  });
}
if (btnFecharHistorico) {
  btnFecharHistorico.addEventListener("click", fecharHistorico);
}
if (btnFecharPreview) {
  btnFecharPreview.addEventListener("click", fecharPreview);
}
if (btnConfirmarInicioExecucao) {
  btnConfirmarInicioExecucao.addEventListener("click", confirmarInicioExecucao);
}
if (btnCancelarInicioExecucao) {
  btnCancelarInicioExecucao.addEventListener("click", fecharInicioExecucao);
}
if (btnFecharInicioExecucao) {
  btnFecharInicioExecucao.addEventListener("click", fecharInicioExecucao);
}
if (btnHistoricoMais) {
  btnHistoricoMais.addEventListener("click", () => {
    if (!historicoAtualId) {
      return;
    }
    const item = manutencoes.find((registro) => registro.id === historicoAtualId);
    if (!item) {
      return;
    }
    historicoLimite += HISTORY_PAGE_SIZE;
    renderHistorico(item);
  });
}
if (btnHistoricoExportar) {
  btnHistoricoExportar.addEventListener("click", () => {
    if (!historicoAtualId) {
      return;
    }
    const item = manutencoes.find((registro) => registro.id === historicoAtualId);
    if (!item) {
      return;
    }
    exportarHistorico(item);
  });
}
if (btnHistoricoExportarPdf) {
  btnHistoricoExportarPdf.addEventListener("click", () => {
    if (!historicoAtualId) {
      return;
    }
    const item = manutencoes.find((registro) => registro.id === historicoAtualId);
    if (!item) {
      return;
    }
    exportarHistoricoPdf(item);
  });
}
if (evidenciaButtons.length) {
  evidenciaButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const alvo = button.dataset.evidenciaBtn;
      const input = evidenciaInputs.find(
        (item) => item.dataset.evidenciaInput === alvo
      );
      if (input) {
        input.click();
      }
    });
  });
}
if (evidenciaInputs.length) {
  evidenciaInputs.forEach((input) => {
    input.addEventListener("change", atualizarListaEvidencias);
  });
}
if (novaDocButtons.length) {
  novaDocButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const alvo = button.dataset.novaDocBtn;
      const input = novaDocInputs.find((item) => item.dataset.novaDocInput === alvo);
      if (input) {
        input.click();
      }
    });
  });
}
if (novaDocInputs.length) {
  novaDocInputs.forEach((input) => {
    input.addEventListener("change", atualizarNovaDocsUI);
  });
  atualizarNovaDocsUI();
}
if (novaDocViews.length) {
  novaDocViews.forEach((button) => {
    button.addEventListener("click", () => {
      const alvo = button.dataset.novaDocView;
      const input = novaDocInputs.find((item) => item.dataset.novaDocInput === alvo);
      const file = input && input.files && input.files[0] ? input.files[0] : null;
      if (file) {
        const blobUrl = URL.createObjectURL(file);
        abrirPreview(blobUrl, blobUrl);
      }
    });
  });
}
if (liberacaoDocButtons.length) {
  liberacaoDocButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const alvo = button.dataset.docBtn;
      const input = liberacaoDocInputs.find((item) => item.dataset.docInput === alvo);
      if (input) {
        input.click();
      }
    });
  });
}
if (liberacaoDocInputs.length) {
  liberacaoDocInputs.forEach((input) => {
    input.addEventListener("change", () => handleLiberacaoDocChange(input));
  });
}
if (liberacaoDocViews.length) {
  liberacaoDocViews.forEach((button) => {
    button.addEventListener("click", () => {
      const alvo = button.dataset.docView;
      const doc = getLiberacaoDocAtual(alvo);
      if (doc) {
        abrirDocumento(doc);
      }
    });
  });
}
if (btnImprimirRelatorio) {
  btnImprimirRelatorio.addEventListener("click", imprimirRelatorio);
}
if (btnExportarPDF) {
  btnExportarPDF.addEventListener("click", imprimirRelatorio);
}
if (btnFecharRelatorio) {
  btnFecharRelatorio.addEventListener("click", fecharRelatorio);
}

if (listaSolicitacoes) {
  listaSolicitacoes.addEventListener("click", (event) => {
    const botao = event.target.closest("button[data-action]");
    if (!botao) {
      return;
    }
    const item = botao.closest("[data-request-id]");
    if (!item) {
      return;
    }
    if (botao.dataset.action === "approve") {
      aprovarSolicitacao(item);
    }
    if (botao.dataset.action === "reject") {
      recusarSolicitacao(item);
    }
  });
}

if (listaUsuarios) {
  listaUsuarios.addEventListener("click", (event) => {
    const item = event.target.closest(".account-item");
    if (!item || !item.dataset.userId) {
      return;
    }
    abrirUserDrawer(item.dataset.userId);
  });

  listaUsuarios.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    const item = event.target.closest(".account-item");
    if (!item || !item.dataset.userId) {
      return;
    }
    event.preventDefault();
    abrirUserDrawer(item.dataset.userId);
  });
}

if (userFiltroNome) {
  userFiltroNome.addEventListener("input", renderUsuarios);
}
if (userFiltroCargo) {
  userFiltroCargo.addEventListener("input", renderUsuarios);
}
if (userFiltroProjeto) {
  userFiltroProjeto.addEventListener("input", renderUsuarios);
}
if (userFiltroStatus) {
  userFiltroStatus.addEventListener("change", renderUsuarios);
}
if (btnLimparFiltroUsuarios) {
  btnLimparFiltroUsuarios.addEventListener("click", () => {
    if (userFiltroNome) {
      userFiltroNome.value = "";
    }
    if (userFiltroCargo) {
      userFiltroCargo.value = "";
    }
    if (userFiltroProjeto) {
      userFiltroProjeto.value = "";
    }
    if (userFiltroStatus) {
      userFiltroStatus.value = "";
    }
    renderUsuarios();
  });
}

if (userDrawer) {
  userDrawer.addEventListener("click", (event) => {
    const alvo = event.target.closest("[data-drawer-close]");
    if (alvo) {
      fecharUserDrawer();
    }
  });
}
if (btnFecharUserDrawer) {
  btnFecharUserDrawer.addEventListener("click", fecharUserDrawer);
}
if (btnCancelarUserDrawer) {
  btnCancelarUserDrawer.addEventListener("click", fecharUserDrawer);
}
if (userDrawerForm) {
  userDrawerForm.addEventListener("submit", salvarUserDrawer);
}
if (drawerRole) {
  drawerRole.addEventListener("change", () => {
    const userId = drawerUserId ? drawerUserId.value : "";
    const user = users.find((item) => item.id === userId);
    renderDrawerPermissions(user || {}, collectDrawerPermissions());
  });
}

if (listaModelos) {
  listaModelos.addEventListener("click", (event) => {
    const botao = event.target.closest("button[data-action]");
    if (!botao) {
      return;
    }
    const item = botao.closest("[data-template-id]");
    if (!item) {
      return;
    }
    if (botao.dataset.action === "edit-template") {
      const template = templates.find((registro) => registro.id === item.dataset.templateId);
      if (template) {
        preencherTemplateForm(template);
      }
    }
    if (botao.dataset.action === "toggle-template") {
      alternarModelo(item);
    }
    if (botao.dataset.action === "delete-template") {
      removerModelo(item);
    }
  });
}

users = [];
templates = carregarTemplates();
garantirTemplatesPadrao();
const resultadoTemplates = normalizarTemplates(templates);
templates = resultadoTemplates.normalizadas;
if (resultadoTemplates.mudou) {
  salvarTemplates(templates);
}
requests = carregarSolicitacoes();
auditLog = carregarAuditoria();
iniciarAuditChain();
currentUser = null;
carregarConfiguracoes();

manutencoes = carregarManutencoes();
gerarManutencoesRecorrentes();
const resultadoInicial = normalizarManutencoes(manutencoes);
manutencoes = resultadoInicial.normalizadas;
salvarManutencoes(manutencoes);
renderSubestacoes();
renderTipoOptions();
limparTemplateForm();
initSidebarToggle();
initAvatarUpload();
rdoSnapshots = carregarRdoSnapshots();
montarRdoUI();
carregarSessaoServidor();
preencherInicioExecucaoNova();

window.addEventListener("focus", atualizarSeNecessario);
window.addEventListener("storage", (event) => {
  if (
    [
      STORAGE_KEY,
      USER_KEY,
      REQUEST_KEY,
      AUDIT_KEY,
      RDO_KEY,
      REMINDER_KEY,
      TEMPLATE_KEY,
    ].includes(event.key)
  ) {
    users = carregarUsuarios();
    templates = carregarTemplates();
    garantirTemplatesPadrao();
    const normalizados = normalizarTemplates(templates);
    templates = normalizados.normalizadas;
    if (normalizados.mudou) {
      salvarTemplates(templates);
    }
    requests = carregarSolicitacoes();
    auditLog = carregarAuditoria();
    iniciarAuditChain();
    carregarConfiguracoes();
    manutencoes = carregarManutencoes();
    const resultado = normalizarManutencoes(manutencoes);
    manutencoes = resultado.normalizadas;
    salvarManutencoes(manutencoes);
    rdoSnapshots = carregarRdoSnapshots();
    montarRdoUI();
    carregarSessaoServidor();
  }
});




