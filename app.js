const btnAdicionarManutencao = document.getElementById("btnAdicionarManutencao");
const tipoManutencao = document.getElementById("tipoManutencao");
const customTipoField = document.getElementById("customTipoField");
const tituloManutencao = document.getElementById("tituloManutencao");
const subestacaoManutencao = document.getElementById("subestacaoManutencao");
const manutencaoProjeto = document.getElementById("manutencaoProjeto");
const equipamentoManutencao = document.getElementById("equipamentoManutencao");
const dataManutencao = document.getElementById("dataManutencao");
const futuraManutencao = document.getElementById("futuraManutencao");
const obsManutencao = document.getElementById("obsManutencao");
const obsManutencaoEditor = document.getElementById("obsManutencaoEditor");
const obsManutencaoHtml = document.getElementById("obsManutencaoHtml");
const obsManutencaoToolbar = document.querySelector(
  "[data-rich-toolbar='obsManutencao']"
);
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
const relatorioPeriodoFiltro = document.getElementById("relatorioPeriodo");
const relatorioStatusFiltro = document.getElementById("relatorioStatus");
const relatorioResponsavelFiltro = document.getElementById("relatorioResponsavel");
const relatorioTipoFiltro = document.getElementById("relatorioTipoFiltro");
const btnRelatoriosExportar = document.getElementById("btnRelatoriosExportar");
const btnRelatoriosResumo = document.getElementById("btnRelatoriosResumo");
const relatorioResumoTotal = document.getElementById("relatorioResumoTotal");
const relatorioResumoConcluidas = document.getElementById("relatorioResumoConcluidas");
const relatorioResumoCriticos = document.getElementById("relatorioResumoCriticos");
const relatorioResumoAlertas = document.getElementById("relatorioResumoAlertas");
const relatorioResumoEvidencias = document.getElementById("relatorioResumoEvidencias");
const relatorioResumoEvidenciasLabel = document.getElementById("relatorioResumoEvidenciasLabel");
const relatorioResumoSla = document.getElementById("relatorioResumoSla");
const relatorioResumoSlaLabel = document.getElementById("relatorioResumoSlaLabel");
const relatorioMes = document.getElementById("relatorioMes");
const relatorioInicioMensal = document.getElementById("relatorioInicioMensal");
const relatorioFimMensal = document.getElementById("relatorioFimMensal");
const relatorioCliente = document.getElementById("relatorioCliente");
const btnRelatorioMensalPreview = document.getElementById("btnRelatorioMensalPreview");
const btnRelatorioMensalExportar = document.getElementById("btnRelatorioMensalExportar");
const btnRelatorioMensalRdo = document.getElementById("btnRelatorioMensalRdo");
const rdoMensalPreviewModal = document.getElementById("modalRdoMensalPreview");
const rdoMensalPreviewBody = document.getElementById("rdoMensalPreviewBody");
const rdoMensalPreviewClose = document.querySelector("[data-rdo-mensal-close]");
const perfProjetoPeriodo = document.getElementById("perfProjetoPeriodo");
const perfProjetoFiltro = document.getElementById("perfProjetoFiltro");
const perfProjetoCards = document.getElementById("perfProjetoCards");
const perfProjetoInsights = document.getElementById("perfProjetoInsights");
const perfProjetoTabela = document.getElementById("perfProjetoTabela");
const perfProjetoTotalConcluidas = document.getElementById("perfProjetoTotalConcluidas");
const perfProjetoTotalPrazo = document.getElementById("perfProjetoTotalPrazo");
const perfProjetoTotalSla = document.getElementById("perfProjetoTotalSla");
const perfProjetoTotalBacklog = document.getElementById("perfProjetoTotalBacklog");
const perfProjetoTotalCriticas = document.getElementById("perfProjetoTotalCriticas");
const perfProjetoTotalApr = document.getElementById("perfProjetoTotalApr");
const perfProjetoTotalOs = document.getElementById("perfProjetoTotalOs");
const perfProjetoTotalPte = document.getElementById("perfProjetoTotalPte");
const perfProjetoTotalPt = document.getElementById("perfProjetoTotalPt");
const perfPessoaPeriodo = document.getElementById("perfPessoaPeriodo");
const perfPessoaFiltro = document.getElementById("perfPessoaFiltro");
const perfPessoaCards = document.getElementById("perfPessoaCards");
const perfPessoaInsights = document.getElementById("perfPessoaInsights");
const perfPessoaTabela = document.getElementById("perfPessoaTabela");
const perfPessoaTotalAbertas = document.getElementById("perfPessoaTotalAbertas");
const perfPessoaTotalConcluidas = document.getElementById("perfPessoaTotalConcluidas");
const perfPessoaTotalPrazo = document.getElementById("perfPessoaTotalPrazo");
const perfPessoaTotalSla = document.getElementById("perfPessoaTotalSla");
const perfPessoaTotalBacklog = document.getElementById("perfPessoaTotalBacklog");
const perfPessoaTotalCriticas = document.getElementById("perfPessoaTotalCriticas");
const perfPessoaTotalApr = document.getElementById("perfPessoaTotalApr");
const perfPessoaTotalOs = document.getElementById("perfPessoaTotalOs");
const perfPessoaTotalPte = document.getElementById("perfPessoaTotalPte");
const perfPessoaTotalPt = document.getElementById("perfPessoaTotalPt");
const feedbackTo = document.getElementById("feedbackTo");
const feedbackScore = document.getElementById("feedbackScore");
const feedbackMessage = document.getElementById("feedbackMessage");
const btnEnviarFeedback = document.getElementById("btnEnviarFeedback");
const feedbackSendMsg = document.getElementById("feedbackSendMsg");
const feedbackList = document.getElementById("feedbackList");
const feedbackEmpty = document.getElementById("feedbackEmpty");
const feedbackStatReceived = document.getElementById("feedbackStatReceived");
const feedbackStatSent = document.getElementById("feedbackStatSent");
const feedbackStatAvg = document.getElementById("feedbackStatAvg");
const feedbackStatUnread = document.getElementById("feedbackStatUnread");
const feedbackSearch = document.getElementById("feedbackSearch");
const feedbackSort = document.getElementById("feedbackSort");
const feedbackTemplateButtons = Array.from(
  document.querySelectorAll("[data-feedback-template]")
);
const feedbackBadge = document.getElementById("feedbackBadge");
const feedbackTabButtons = Array.from(document.querySelectorAll("[data-feedback-tab]"));
const btnFeedbackInbox = document.getElementById("btnFeedbackInbox");
const feedbackInboxDot = document.getElementById("feedbackInboxDot");
const feedbackInboxPanel = document.getElementById("feedbackInboxPanel");
const feedbackInboxList = document.getElementById("feedbackInboxList");
const feedbackInboxEmpty = document.getElementById("feedbackInboxEmpty");
const feedbackInboxLink = document.getElementById("feedbackInboxLink");
const countAgendadas = document.getElementById("countAgendadas");
const countLiberadas = document.getElementById("countLiberadas");
const countBacklog = document.getElementById("countBacklog");
const badgeBacklog = document.getElementById("badgeBacklog");
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
const perfExecBadge = document.getElementById("perfExecBadge");
const perfExecProgress = document.getElementById("perfExecProgress");
const perfExecProgressValue = document.getElementById("perfExecProgressValue");
const perfExecTempoMedio = document.getElementById("perfExecTempoMedio");
const perfExecSemana = document.getElementById("perfExecSemana");
const perfSlaBadge = document.getElementById("perfSlaBadge");
const perfSlaProgress = document.getElementById("perfSlaProgress");
const perfSlaProgressValue = document.getElementById("perfSlaProgressValue");
const perfSlaNoPrazo = document.getElementById("perfSlaNoPrazo");
const perfSlaForaPrazo = document.getElementById("perfSlaForaPrazo");
const perfReopenBadge = document.getElementById("perfReopenBadge");
const perfReopenProgress = document.getElementById("perfReopenProgress");
const perfReopenProgressValue = document.getElementById("perfReopenProgressValue");
const perfReopenUltimos = document.getElementById("perfReopenUltimos");
const perfReopenImpacto = document.getElementById("perfReopenImpacto");
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
const projectSelect = document.getElementById("projectSelect");
const projectSelectLabel = document.getElementById("projectSelectLabel");
const projectManageBtn = document.getElementById("projectManageBtn");
const crumbs = document.getElementById("crumbs");
const btnDashboard = document.getElementById("btnDashboard");
const btnHelp = document.getElementById("btnHelp");
const modalHelp = document.getElementById("modalHelp");
const helpTitle = document.getElementById("helpTitle");
const helpMeta = document.getElementById("helpMeta");
const helpContent = document.getElementById("helpContent");
const btnHelpClose = document.getElementById("btnHelpClose");
const projectTabs = Array.from(document.querySelectorAll("[data-project-tab]"));
const projectPanels = Array.from(document.querySelectorAll("[data-project-panel]"));
const projectForm = document.getElementById("projectForm");
const projectFormSelect = document.getElementById("projectFormSelect");
const projectFormId = document.getElementById("projectFormId");
const projectFormCodigo = document.getElementById("projectFormCodigo");
const projectFormNome = document.getElementById("projectFormNome");
const projectFormCliente = document.getElementById("projectFormCliente");
const projectFormDescricao = document.getElementById("projectFormDescricao");
const projectFormLocais = document.getElementById("projectFormLocais");
const projectFormCancel = document.getElementById("projectFormCancel");
const projectTable = document.getElementById("projectTable");
const projectTableBody = document.querySelector("#projectTable tbody");
const equipamentoForm = document.getElementById("equipamentoForm");
const equipamentoFormId = document.getElementById("equipamentoFormId");
const equipamentoFormProject = document.getElementById("equipamentoFormProject");
const equipamentoFormTag = document.getElementById("equipamentoFormTag");
const equipamentoFormNome = document.getElementById("equipamentoFormNome");
const equipamentoFormCategoria = document.getElementById("equipamentoFormCategoria");
const equipamentoFormDescricao = document.getElementById("equipamentoFormDescricao");
const equipamentoFormCancel = document.getElementById("equipamentoFormCancel");
const equipamentoTable = document.getElementById("equipamentoTable");
const equipamentoTableBody = document.querySelector("#equipamentoTable tbody");
const equipeForm = document.getElementById("equipeForm");
const equipeFormUser = document.getElementById("equipeFormUser");
const equipeSearch = document.getElementById("equipeSearch");
const equipeTable = document.getElementById("equipeTable");
const equipeTableBody = document.querySelector("#equipeTable tbody");
const pmpAno = document.getElementById("pmpAno");
const pmpView = document.getElementById("pmpView");
const pmpMes = document.getElementById("pmpMes");
const pmpMesField = document.getElementById("pmpMesField");
const pmpFiltroProjeto = document.getElementById("pmpFiltroProjeto");
const pmpFiltroFrequencia = document.getElementById("pmpFiltroFrequencia");
const pmpFiltroEquipamento = document.getElementById("pmpFiltroEquipamento");
const pmpFiltroResponsavel = document.getElementById("pmpFiltroResponsavel");
const pmpFiltroOrigem = document.getElementById("pmpFiltroOrigem");
const pmpFiltroStatus = document.getElementById("pmpFiltroStatus");
const pmpHorasDisponiveis = document.getElementById("pmpHorasDisponiveis");
const pmpBusca = document.getElementById("pmpBusca");
const pmpTotalPrevistas = document.getElementById("pmpTotalPrevistas");
const pmpTotalConforme = document.getElementById("pmpTotalConforme");
const pmpTotalAtraso = document.getElementById("pmpTotalAtraso");
const pmpTotalNaoExecutadas = document.getElementById("pmpTotalNaoExecutadas");
const pmpHorasPlanejadas = document.getElementById("pmpHorasPlanejadas");
const pmpHorasExecutadas = document.getElementById("pmpHorasExecutadas");
const pmpCargaSemanal = document.getElementById("pmpCargaSemanal");
const pmpCargaBar = document.getElementById("pmpCargaBar");
const pmpCargaBarHint = document.getElementById("pmpCargaBarHint");
const pmpForm = document.getElementById("pmpForm");
const pmpFormId = document.getElementById("pmpFormId");
const pmpFormTitle = document.getElementById("pmpFormTitle");
const pmpFormMensagem = document.getElementById("pmpFormMensagem");
const pmpFormCancel = document.getElementById("pmpFormCancel");
const pmpNome = document.getElementById("pmpNome");
const pmpCodigo = document.getElementById("pmpCodigo");
const pmpTipo = document.getElementById("pmpTipo");
const pmpProjeto = document.getElementById("pmpProjeto");
const pmpEquipamento = document.getElementById("pmpEquipamento");
const pmpFrequencia = document.getElementById("pmpFrequencia");
const pmpInicio = document.getElementById("pmpInicio");
const pmpOnlyWeekdays = document.getElementById("pmpOnlyWeekdays");
const pmpMesesWrap = document.getElementById("pmpMeses");
const pmpTecnicos = document.getElementById("pmpTecnicos");
const pmpDuracao = document.getElementById("pmpDuracao");
const pmpResponsavel = document.getElementById("pmpResponsavel");
const pmpDescricao = document.getElementById("pmpDescricao");
const pmpObservacoes = document.getElementById("pmpObservacoes");
const pmpProcedimentos = document.getElementById("pmpProcedimentos");
const pmpProcedimentoFile = document.getElementById("pmpProcedimentoFile");
const pmpProcedimentoUpload = document.getElementById("pmpProcedimentoUpload");
const pmpProcedimentoView = document.getElementById("pmpProcedimentoView");
const pmpProcedimentoRemove = document.getElementById("pmpProcedimentoRemove");
const pmpProcedimentoName = document.getElementById("pmpProcedimentoName");
const pmpChecklistList = document.getElementById("pmpChecklistList");
const pmpChecklistItem = document.getElementById("pmpChecklistItem");
const pmpChecklistLink = document.getElementById("pmpChecklistLink");
const pmpChecklistAdd = document.getElementById("pmpChecklistAdd");
const pmpGrid = document.getElementById("pmpGrid");
const pmpGridHead = document.getElementById("pmpGridHead");
const pmpGridBody = document.getElementById("pmpGridBody");
const pmpGridVazio = document.getElementById("pmpGridVazio");
const pmpImportBtn = document.getElementById("pmpImportBtn");
const pmpDuplicarPlano = document.getElementById("pmpDuplicarPlano");
const pmpExportPdf = document.getElementById("pmpExportPdf");
const pmpExportExcel = document.getElementById("pmpExportExcel");
const modalPmpImport = document.getElementById("modalPmpImport");
const pmpImportSearch = document.getElementById("pmpImportSearch");
const pmpImportList = document.getElementById("pmpImportList");
const pmpImportEmpty = document.getElementById("pmpImportEmpty");
const pmpImportCancel = document.getElementById("pmpImportCancel");
const pmpImportConfirm = document.getElementById("pmpImportConfirm");
const pmpImportClose = document.querySelector("[data-pmp-import-close]");
const modalPmpCell = document.getElementById("modalPmpCell");
const pmpCellTitle = document.getElementById("pmpCellTitle");
const pmpCellMeta = document.getElementById("pmpCellMeta");
const pmpCellExecList = document.getElementById("pmpCellExecList");
const pmpCellEvidencias = document.getElementById("pmpCellEvidencias");
const pmpCellChecklist = document.getElementById("pmpCellChecklist");
const pmpCellObservacoes = document.getElementById("pmpCellObservacoes");
const pmpCellProcedimentos = document.getElementById("pmpCellProcedimentos");
const pmpCellScheduledInput = document.getElementById("pmpCellScheduled");
const pmpCellExecutedInput = document.getElementById("pmpCellExecuted");
const pmpCellExecutorInput = document.getElementById("pmpCellExecutor");
const pmpCellObsInput = document.getElementById("pmpCellObsInput");
const pmpCellEvidenciasInput = document.getElementById("pmpCellEvidenciasInput");
const pmpCellChecklistInput = document.getElementById("pmpCellChecklistInput");
const pmpCellSave = document.getElementById("pmpCellSave");
const pmpCellRemove = document.getElementById("pmpCellRemove");
const pmpCellUnset = document.getElementById("pmpCellUnset");
const pmpCellMarkCancel = document.getElementById("pmpCellMarkCancel");
const pmpCellClose = document.getElementById("pmpCellClose");
const pmpCellCloseBtn = document.querySelector("[data-pmp-cell-close]");
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
const perfilUen = document.getElementById("perfilUen");
const perfilRole = document.getElementById("perfilRole");
const perfilAtribuicoes = document.getElementById("perfilAtribuicoes");
const perfilPermissoes = document.getElementById("perfilPermissoes");
const perfilSecoes = document.getElementById("perfilSecoes");
const perfilCard = document.getElementById("perfilCard");
const perfilTitle = document.getElementById("perfilTitle");
const perfilModeBadge = document.getElementById("perfilModeBadge");
const perfilView = document.getElementById("perfilView");
const perfilViewActions = document.getElementById("perfilViewActions");
const perfilEditActions = document.getElementById("perfilEditActions");
const perfilEditMount = document.getElementById("perfilEditMount");
const perfilAvatarActionsMount = document.getElementById("perfilAvatarActionsMount");
const perfilAvatarTemplate = document.getElementById("perfilAvatarTemplate");
const perfilEditTemplate = document.getElementById("perfilEditTemplate");
const btnPerfilEditar = document.getElementById("btnPerfilEditar");
const btnPerfilCancelar = document.getElementById("btnPerfilCancelar");

const usuarioAtual = document.getElementById("userChip") || document.getElementById("usuarioAtual");
const userAvatar = document.getElementById("userAvatar");
const userMenu = document.getElementById("userMenu");
const btnUserMenu = document.getElementById("btnUserMenu");
const userMenuPanel = document.getElementById("userMenuPanel");
const userMenuAvatar = document.getElementById("userMenuAvatar");
const userMenuName = document.getElementById("userMenuName");
const userMenuRole = document.getElementById("userMenuRole");
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
const perfilAvatarActions = document.getElementById("perfilAvatarActions");
const btnFecharPerfil = document.getElementById("btnFecharPerfil");
const perfilUenInput = document.getElementById("perfilUenInput");
const perfilProjetoInput = document.getElementById("perfilProjetoInput");
const btnPerfilSalvar = document.getElementById("btnPerfilSalvar");
const perfilSaveMsg = document.getElementById("perfilSaveMsg");
const perfilEdit = document.getElementById("perfilEdit");
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
const healthSummary = document.getElementById("healthSummary");
const healthTasks = document.getElementById("healthTasks");
const healthIntegrity = document.getElementById("healthIntegrity");
const healthMessage = document.getElementById("healthMessage");
const btnRefreshHealth = document.getElementById("btnRefreshHealth");
const apiLogsTable = document.getElementById("apiLogsTable");
const apiLogsEmpty = document.getElementById("apiLogsEmpty");
const apiLogsCount = document.getElementById("apiLogsCount");
const apiLogsMessage = document.getElementById("apiLogsMessage");
const btnLogsRefresh = document.getElementById("btnLogsRefresh");
const btnLogsLoadMore = document.getElementById("btnLogsLoadMore");
const automationList = document.getElementById("automationList");
const automationMessage = document.getElementById("automationMessage");
const btnAutomationRefresh = document.getElementById("btnAutomationRefresh");
const gerencialHealth = document.getElementById("gerencialHealth");
const gerencialLogs = document.getElementById("gerencialLogs");
const gerencialAutomations = document.getElementById("gerencialAutomations");
const gerencialFiles = document.getElementById("gerencialFiles");
const gerencialTabs = Array.from(document.querySelectorAll(".gerencial-tab"));
const gerencialPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));
const gerencialIndicators = Array.from(
  document.querySelectorAll(".indicator-card[data-tab-target]")
);
const gerencialIndicatorsWrap = document.querySelector(".gerencial-indicators");
const indicatorHealthCard = document.querySelector("[data-indicator='diagnostico']");
const indicatorHealthCount = document.getElementById("indicatorHealthCount");
const indicatorHealthBadge = document.getElementById("indicatorHealthBadge");
const indicatorHealthMeta = document.getElementById("indicatorHealthMeta");
const indicatorLogsCard = document.querySelector("[data-indicator='logs']");
const indicatorLogsCount = document.getElementById("indicatorLogsCount");
const indicatorLogsBadge = document.getElementById("indicatorLogsBadge");
const indicatorLogsMeta = document.getElementById("indicatorLogsMeta");
const indicatorFilesCard = document.querySelector("[data-indicator='arquivos']");
const indicatorFilesCount = document.getElementById("indicatorFilesCount");
const indicatorFilesBadge = document.getElementById("indicatorFilesBadge");
const indicatorFilesMeta = document.getElementById("indicatorFilesMeta");
const indicatorAutomationsCard = document.querySelector("[data-indicator='automacoes']");
const indicatorAutomationsCount = document.getElementById("indicatorAutomationsCount");
const indicatorAutomationsBadge = document.getElementById("indicatorAutomationsBadge");
const indicatorAutomationsMeta = document.getElementById("indicatorAutomationsMeta");
const permissoesSearch = document.getElementById("permissoesSearch");
const permissoesSummary = document.getElementById("permissoesSummary");
const gerencialUpdateMessage = document.getElementById("gerencialUpdateMessage");
const gerencialLastUpdate = document.getElementById("gerencialLastUpdate");
const gerencialPalette = document.getElementById("gerencialPalette");
const gerencialPaletteInput = document.getElementById("gerencialPaletteInput");
const gerencialPaletteList = document.getElementById("gerencialPaletteList");
const gerencialPaletteTrigger = document.getElementById("gerencialPaletteTrigger");
const btnGerencialPalette = document.getElementById("btnGerencialPalette");
const btnGerencialRefreshAll = document.getElementById("btnGerencialRefreshAll");
const btnGerencialGoLogs = document.getElementById("btnGerencialGoLogs");
const btnGerencialGoPermissoes = document.getElementById("btnGerencialGoPermissoes");
const btnHealthRunAll = document.getElementById("btnHealthRunAll");
const btnLogsExport = document.getElementById("btnLogsExport");
const filesFilterType = document.getElementById("filesFilterType");
const filesSearch = document.getElementById("filesSearch");
const filesUploadType = document.getElementById("filesUploadType");
const filesUploadInput = document.getElementById("filesUploadInput");
const btnFilesUpload = document.getElementById("btnFilesUpload");
const btnFilesRefresh = document.getElementById("btnFilesRefresh");
const filesList = document.getElementById("filesList");
const filesEmpty = document.getElementById("filesEmpty");
const filesMessage = document.getElementById("filesMessage");
const gerencialPermissoes = document.getElementById("gerencialPermissoes");
const permissoesList = document.getElementById("permissoesList");
const btnPermissoesSalvar = document.getElementById("btnPermissoesSalvar");
const permissoesMessage = document.getElementById("permissoesMessage");
const btnLogsApply = document.getElementById("btnLogsApply");
const btnLogsClear = document.getElementById("btnLogsClear");
const logsFilterEndpoint = document.getElementById("logsFilterEndpoint");
const logsFilterUser = document.getElementById("logsFilterUser");
const logsFilterStatus = document.getElementById("logsFilterStatus");
const logsFilterFrom = document.getElementById("logsFilterFrom");
const logsFilterTo = document.getElementById("logsFilterTo");
const templateForm = document.getElementById("templateForm");
const templateNome = document.getElementById("templateNome");
const templateProjeto = document.getElementById("templateProjeto");
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
const modalBacklogMotivo = document.getElementById("modalBacklogMotivo");
const formBacklogMotivo = document.getElementById("formBacklogMotivo");
const backlogMotivoId = document.getElementById("backlogMotivoId");
const backlogMotivoSelect = document.getElementById("backlogMotivoSelect");
const backlogMotivoObs = document.getElementById("backlogMotivoObs");
const mensagemBacklogMotivo = document.getElementById("mensagemBacklogMotivo");
const btnFecharBacklogMotivo = document.getElementById("btnFecharBacklogMotivo");
const btnCancelarBacklogMotivo = document.getElementById("btnCancelarBacklogMotivo");
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
const FEEDBACK_KEY = "opscope.feedbacks";
const SESSION_KEY = "denemanu.session";
const ACTIVE_PROJECT_KEY = "opscope.activeProjectId";
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
const RDO_PROJETO = "834 - PARACATU/SOLARIG (Boa Sorte II)";
const SYSTEM_USER_ID = "system";
const CUSTOM_TIPO_OPTION = "__custom";
const DEFAULT_PROJECT_CODE = "834";
const DEFAULT_PROJECT_LABEL = "834 - PARACATU/SOLARIG (Boa Sorte II)";
const SUBESTACOES = [];
const DEFAULT_TEMPLATE_NAMES = new Set([
  "Inspeção diária da subestação",
  "Inspeção mensal da subestação",
  "Inspeção semanal do GMG BSO2",
  "Inspeção semanal dos GMG PCT4",
  "Inspeção mensal do GMG BSO2",
  "Inspeção mensal dos GMG PCT4",
]);
const WEEKDAYS = ["Domingo", "Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"];
const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const DEFAULT_DAILY_DAYS = [1, 2, 3, 4, 5];
const PMP_TOLERANCE_DAYS = 3;
const PMP_MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const PMP_FREQUENCIES = [
  { value: "diaria", label: "Diária", unit: "day", interval: 1 },
  { value: "semanal", label: "Semanal", unit: "week", interval: 1 },
  { value: "mensal", label: "Mensal", unit: "month", interval: 1 },
  { value: "bimestral", label: "Bimestral", unit: "month", interval: 2 },
  { value: "trimestral", label: "Trimestral", unit: "month", interval: 3 },
  { value: "semestral", label: "Semestral", unit: "month", interval: 6 },
  { value: "anual", label: "Anual", unit: "year", interval: 1 },
  { value: "bienal", label: "Bienal", unit: "year", interval: 2 },
  { value: "trienal", label: "Trienal", unit: "year", interval: 3 },
];
const PMP_STATUS_LABELS = {
  on_time: "Conforme",
  late: "Fora da janela",
  missed: "Atrasada",
  scheduled: "Planejada",
  cancelled: "Cancelada",
  empty: "Não prevista",
};
const PMP_STATUS_FILTER_MAP = {
  conforme: "on_time",
  planejada: "scheduled",
  atrasada: "missed",
  fora_janela: "late",
  cancelada: "cancelled",
};
const PMP_TIPOS = [
  { value: "preventiva", label: "Preventiva", short: "PREV" },
  { value: "corretiva", label: "Corretiva", short: "COR" },
  { value: "preditiva", label: "Preditiva", short: "PRED" },
  { value: "inspecao", label: "Inspeção", short: "INSP" },
  { value: "outra", label: "Outra", short: "OUT" },
];
const SECTION_LABELS = {
  inicio: "Início",
  programacao: "Programação",
  nova: "Nova manutenção",
  modelos: "Modelos e recorrências",
  pmp: "PMP / Cronograma",
  execucao: "Execução do dia",
  backlog: "Backlog",
  projetos: "Locais de trabalho",
  desempenho: "Desempenho",
  "performance-projects": "Desempenho por projeto",
  "performance-people": "Desempenho por colaborador",
  tendencias: "KPIs e tendências",
  relatorios: "Relatórios",
  feedbacks: "Feedbacks",
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
  em_execucao: "Em execução",
  encerramento: "Encerramento",
  concluida: "Concluída",
};

const PERMISSIONS = {
  create: "Criar",
  edit: "Editar",
  remove: "Remover",
  reschedule: "Reagendar",
  complete: "Executar",
};

const GRANULAR_PERMISSION_LABELS = {
  editarPerfil: "Editar perfil (UEN/Projeto)",
  editarPerfilOutros: "Editar perfil de outros",
  verUsuarios: "Ver usuários",
  convidarUsuarios: "Convidar usuários",
  desativarUsuarios: "Desativar usuários",
  verArquivos: "Ver arquivos",
  uploadArquivos: "Enviar arquivos",
  excluirArquivos: "Excluir arquivos",
  vincularArquivo: "Vincular arquivo",
  verRDOs: "Ver RDOs",
  gerarRDOs: "Gerar RDOs",
  excluirRDOs: "Excluir RDOs",
  verRelatorios: "Ver relatórios",
  exportarRelatorios: "Exportar relatórios",
  reexecutarTarefas: "Reexecutar tarefas",
  verLogsAPI: "Ver logs de API",
  limparLogsAPI: "Limpar logs de API",
  gerenciarAutomacoes: "Gerenciar automações",
  verAutomacoes: "Ver automações",
  verDiagnostico: "Ver diagnóstico",
  verPainelGerencial: "Ver painel gerencial",
  gerenciarProjetos: "Gerenciar projetos",
  gerenciarEquipamentos: "Gerenciar equipamentos",
  gerenciarEquipeProjeto: "Gerenciar equipe do projeto",
  gerenciarPMP: "Gerenciar PMP/Cronograma",
};
const PERMISSION_GROUPS = [
  {
    key: "perfil",
    label: "Perfis e usuários",
    items: ["editarPerfil", "editarPerfilOutros", "verUsuarios", "convidarUsuarios", "desativarUsuarios"],
  },
  {
    key: "projetos",
    label: "Projetos corporativos",
    items: ["gerenciarProjetos", "gerenciarEquipamentos", "gerenciarEquipeProjeto"],
  },
  {
    key: "pmp",
    label: "PMP / Cronograma",
    items: ["gerenciarPMP"],
  },
  {
    key: "arquivos",
    label: "Arquivos",
    items: ["verArquivos", "uploadArquivos", "excluirArquivos", "vincularArquivo"],
  },
  {
    key: "rdo",
    label: "RDOs",
    items: ["verRDOs", "gerarRDOs", "excluirRDOs"],
  },
  {
    key: "relatorios",
    label: "Relatórios",
    items: ["verRelatorios", "exportarRelatorios"],
  },
  {
    key: "diagnostico",
    label: "Diagnóstico",
    items: ["verDiagnostico", "reexecutarTarefas"],
  },
  {
    key: "logs",
    label: "Logs de API",
    items: ["verLogsAPI", "limparLogsAPI"],
  },
  {
    key: "automacoes",
    label: "Automações",
    items: ["verAutomacoes", "gerenciarAutomacoes"],
  },
  {
    key: "gerencial",
    label: "Painel gerencial",
    items: ["verPainelGerencial"],
  },
];
const GRANULAR_PROFILE_ORDER = [
  "pcm",
  "diretor_om",
  "gerente_contrato",
  "supervisor_om",
  "tecnico_senior",
  "tecnico_pleno",
  "tecnico_junior",
  "leitura",
];

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
const MASTER_MATRICULA = "35269";
const MASTER_USERNAME = "denisson.alves";
const DEFAULT_PROJECT_LOCAIS = ["LZC-BOS2", "LZC-PCT4", "LZC-LT", "LZC-BSO2/LZC-PCT4"];
const PERFORMANCE_TABS = new Set(["performance-projects", "performance-people"]);
const TAB_PERMISSION_MAP = {
  desempenho: "verRelatorios",
  "performance-projects": "verRelatorios",
  "performance-people": "verRelatorios",
  tendencias: "verRelatorios",
  relatorios: ["verRelatorios", "verRDOs"],
  projetos: ["gerenciarProjetos", "gerenciarEquipamentos", "gerenciarEquipeProjeto"],
  pmp: "gerenciarPMP",
  solicitacoes: "verUsuarios",
  contas: "verUsuarios",
  gerencial: "verPainelGerencial",
  rastreabilidade: "verLogsAPI",
};
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

function normalizeCargo(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getCargoLevel(cargo) {
  const normalized = normalizeCargo(cargo);
  if (!normalized) {
    return 0;
  }
  if (normalized.includes("diretor o m")) {
    return 6;
  }
  if (normalized.includes("gerente de contrato")) {
    return 5;
  }
  if (normalized.includes("supervisor o m")) {
    return 4;
  }
  if (normalized.includes("tecnico senior")) {
    return 3;
  }
  if (normalized.includes("tecnico pleno")) {
    return 2;
  }
  if (normalized.includes("tecnico junior")) {
    return 1;
  }
  return 0;
}

function getProfileKeyForUser(user) {
  if (!user) {
    return "leitura";
  }
  const rbacRole = String(user.rbacRole || "").trim().toLowerCase();
  if (rbacRole && GRANULAR_PROFILE_ORDER.includes(rbacRole)) {
    return rbacRole;
  }
  const cargo = normalizeCargo(user.cargo);
  if (cargo.includes("supervisor o m")) {
    return "supervisor_om";
  }
  if (cargo.includes("tecnico senior")) {
    return "tecnico_senior";
  }
  if (cargo.includes("tecnico pleno")) {
    return "tecnico_pleno";
  }
  if (cargo.includes("tecnico junior")) {
    return "tecnico_junior";
  }
  return "leitura";
}

function hasGranularPermission(user, permissionKey) {
  return Boolean(user && user.granularPermissions && user.granularPermissions[permissionKey]);
}

function canEditProfile(actor, target) {
  if (!actor || !target) {
    return false;
  }
  if (isFullAccessUser(actor)) {
    return true;
  }
  if (actor.id === target.id) {
    return hasGranularPermission(actor, "editarPerfil");
  }
  if (!hasGranularPermission(actor, "editarPerfilOutros")) {
    return false;
  }
  const actorLevel = getCargoLevel(actor.cargo);
  const targetLevel = getCargoLevel(target.cargo);
  return actorLevel > targetLevel;
}

function isMasterUser(user) {
  if (!user) {
    return false;
  }
  const matricula = String(user.matricula || "").trim();
  const username = String(user.username || "").trim().toLowerCase();
  return (
    (MASTER_MATRICULA && matricula === MASTER_MATRICULA) ||
    (MASTER_USERNAME && username === MASTER_USERNAME.toLowerCase())
  );
}

function isFullAccessUser(user) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user)) {
    return true;
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

function canDeleteMaintenance(user) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user)) {
    return true;
  }
  const rbacRole = String(user.rbacRole || "").trim().toLowerCase();
  return rbacRole === "pcm";
}

function canUploadPmpProcedimento(user) {
  if (!user) {
    return false;
  }
  if (isMasterUser(user)) {
    return true;
  }
  if (user.role === "admin") {
    return true;
  }
  const rbacRole = String(user.rbacRole || "").trim().toLowerCase();
  return rbacRole === "pcm";
}

function canManagePmpActivities(user) {
  return canUploadPmpProcedimento(user);
}

function canExecutePmp(user) {
  return Boolean(user);
}

function canAdminUsersRead() {
  if (!currentUser) {
    return false;
  }
  if (isFullAccessUser(currentUser)) {
    return true;
  }
  return canViewUsuarios(currentUser);
}

function canAdminUsersWrite() {
  if (!currentUser) {
    return false;
  }
  if (isFullAccessUser(currentUser)) {
    return true;
  }
  return (
    hasGranularPermission(currentUser, "editarPerfilOutros") ||
    hasGranularPermission(currentUser, "desativarUsuarios") ||
    hasGranularPermission(currentUser, "convidarUsuarios")
  );
}

function canManageFilesClient(user) {
  if (!user) {
    return false;
  }
  if (isFullAccessUser(user)) {
    return true;
  }
  return hasGranularPermission(user, "verArquivos");
}

function canUploadFilesClient(user) {
  if (!user) {
    return false;
  }
  if (isFullAccessUser(user)) {
    return true;
  }
  return hasGranularPermission(user, "uploadArquivos");
}

function canDeleteFilesClient(user) {
  if (!user) {
    return false;
  }
  if (isFullAccessUser(user)) {
    return true;
  }
  return hasGranularPermission(user, "excluirArquivos");
}

function canViewRdo(user) {
  return hasGranularPermission(user, "verRDOs");
}

function canGerarRelatorio(user) {
  return hasGranularPermission(user, "gerarRDOs");
}

function canExcluirRdo(user) {
  return hasGranularPermission(user, "excluirRDOs");
}

function canViewRelatorios(user) {
  return hasGranularPermission(user, "verRelatorios");
}

function canExportRelatorios(user) {
  return hasGranularPermission(user, "exportarRelatorios");
}

function canViewGerencial(user) {
  return hasGranularPermission(user, "verPainelGerencial");
}

function canManageProjetos(user) {
  return hasGranularPermission(user, "gerenciarProjetos");
}

function canManageEquipamentos(user) {
  return hasGranularPermission(user, "gerenciarEquipamentos");
}

function canManageEquipeProjeto(user) {
  return hasGranularPermission(user, "gerenciarEquipeProjeto");
}

function canAccessGerencialTab(tabId, user) {
  if (!user || !canViewGerencial(user)) {
    return false;
  }
  switch (tabId) {
    case "geral":
      return true;
    case "diagnostico":
      return hasGranularPermission(user, "verDiagnostico");
    case "logs":
      return hasGranularPermission(user, "verLogsAPI");
    case "permissoes":
      return true;
    case "arquivos":
      return canManageFilesClient(user);
    case "automacoes":
      return hasGranularPermission(user, "verAutomacoes");
    case "operacoes":
      return isAdmin();
    default:
      return false;
  }
}

const gerencialLoadedTabs = new Set();

function getIndicatorStatusLabel(status, count) {
  if (status === "error") {
    return `${count} críticos`;
  }
  if (status === "warn") {
    return `${count} alertas`;
  }
  return "OK";
}

function applyIndicatorStatus(card, badge, status) {
  if (card) {
    card.classList.remove("indicator-card--ok", "indicator-card--warn", "indicator-card--error");
    card.classList.add(`indicator-card--${status}`);
  }
  if (badge) {
    badge.classList.remove(
      "indicator-card__badge--warn",
      "indicator-card__badge--danger",
      "indicator-card__badge--neutral"
    );
    if (status === "error") {
      badge.classList.add("indicator-card__badge--danger");
    } else if (status === "warn") {
      badge.classList.add("indicator-card__badge--warn");
    } else {
      badge.classList.add("indicator-card__badge--neutral");
    }
  }
}

function summarizeHealthIndicators(snapshot) {
  if (!snapshot || !snapshot.modules) {
    return {
      status: "warn",
      alerts: 0,
      meta: "Diagnóstico indisponível",
    };
  }
  const modules = snapshot.modules;
  const moduleStatuses = [
    modules.database && modules.database.status,
    modules.backups && modules.backups.status,
    modules.queue && modules.queue.status,
    modules.integrity && modules.integrity.status,
  ].filter(Boolean);
  const moduleAlerts = moduleStatuses.filter((status) => status !== "ok").length;
  const tasks = modules.queue && modules.queue.tasks ? modules.queue.tasks : [];
  const taskAlerts = tasks.filter((task) => task.status && task.status !== "ok").length;
  const issues = modules.integrity && modules.integrity.issues ? modules.integrity.issues : [];
  const issueAlerts = issues.length;
  const alerts = moduleAlerts + taskAlerts + issueAlerts;
  const hasError = moduleStatuses.includes("error") || issues.some((item) => item.level === "error");
  const status = hasError ? "error" : alerts > 0 ? "warn" : "ok";
  const meta = snapshot.generatedAt ? `Atualizado em ${formatHealthDate(snapshot.generatedAt)}` : "Diagnóstico ativo";
  return { status, alerts, meta };
}

function updateGerencialIndicators() {
  if (!indicatorHealthCount && !indicatorLogsCount && !indicatorFilesCount && !indicatorAutomationsCount) {
    return;
  }
  const health = summarizeHealthIndicators(healthSnapshot);
  if (indicatorHealthCount) {
    indicatorHealthCount.textContent = String(health.alerts);
  }
  if (indicatorHealthBadge) {
    indicatorHealthBadge.textContent = getIndicatorStatusLabel(health.status, health.alerts);
  }
  if (indicatorHealthMeta) {
    indicatorHealthMeta.textContent = health.meta;
  }
  applyIndicatorStatus(indicatorHealthCard, indicatorHealthBadge, health.status);

  const logErrors = apiLogsState.items.filter((item) => Number(item.status) >= 400).length;
  const logStatus = logErrors > 0 ? "error" : "ok";
  if (indicatorLogsCount) {
    indicatorLogsCount.textContent = String(logErrors);
  }
  if (indicatorLogsBadge) {
    indicatorLogsBadge.textContent = getIndicatorStatusLabel(logStatus, logErrors);
  }
  if (indicatorLogsMeta) {
    indicatorLogsMeta.textContent = apiLogsState.items.length ? "Últimas requisições" : "Sem logs carregados";
  }
  applyIndicatorStatus(indicatorLogsCard, indicatorLogsBadge, logStatus);

  const filesCount = filesState.items.length;
  const filesStatus = filesCount ? "ok" : "warn";
  if (indicatorFilesCount) {
    indicatorFilesCount.textContent = String(filesCount);
  }
  if (indicatorFilesBadge) {
    indicatorFilesBadge.textContent = filesCount ? `${filesCount} itens` : "Sem arquivos";
  }
  if (indicatorFilesMeta) {
    indicatorFilesMeta.textContent = filesCount ? "Arquivos monitorados" : "Nenhum arquivo carregado";
  }
  applyIndicatorStatus(indicatorFilesCard, indicatorFilesBadge, filesStatus);

  const automationCount = automationsState.items.length;
  const activeCount = automationsState.items.filter((item) => item.enabled).length;
  const automationStatus = activeCount ? "ok" : automationCount ? "warn" : "warn";
  if (indicatorAutomationsCount) {
    indicatorAutomationsCount.textContent = String(activeCount);
  }
  if (indicatorAutomationsBadge) {
    indicatorAutomationsBadge.textContent = activeCount ? `${activeCount} ativas` : "Sem rotinas";
  }
  if (indicatorAutomationsMeta) {
    indicatorAutomationsMeta.textContent = automationCount
      ? `${automationCount} regras`
      : "Nenhuma automação carregada";
  }
  applyIndicatorStatus(indicatorAutomationsCard, indicatorAutomationsBadge, automationStatus);
}

function setGerencialUpdateMessage(text, isError = false) {
  if (!gerencialUpdateMessage) {
    return;
  }
  gerencialUpdateMessage.textContent = text || "";
  gerencialUpdateMessage.classList.toggle("mensagem--erro", isError);
}

function setGerencialLastUpdate() {
  if (!gerencialLastUpdate) {
    return;
  }
  const now = new Date();
  const name = currentUser ? getDisplayName(currentUser) : "Sistema";
  gerencialLastUpdate.textContent = `Atualizado em ${formatDateTime(now)} por ${name}`;
}

async function refreshGerencialAll() {
  if (!currentUser || !canViewGerencial(currentUser)) {
    return;
  }
  setGerencialUpdateMessage("Atualizando painel...");
  const results = await Promise.allSettled([
    carregarHealth(true),
    carregarApiLogs(true),
    carregarAutomacoes(true),
    carregarArquivos(true),
    carregarPermissoes(true),
  ]);
  const failed = results.some((item) => item.status === "rejected");
  if (failed) {
    setGerencialUpdateMessage("Atualização parcial. Verifique os módulos.", true);
    return;
  }
  setGerencialUpdateMessage("Atualizado com sucesso.");
  setGerencialLastUpdate();
}

function loadGerencialTab(tabId, force = false) {
  if (!tabId) {
    return;
  }
  if (force) {
    gerencialLoadedTabs.delete(tabId);
  }
  if (gerencialLoadedTabs.has(tabId)) {
    return;
  }
  switch (tabId) {
    case "diagnostico":
      carregarHealth(true);
      break;
    case "logs":
      carregarApiLogs(true);
      break;
    case "permissoes":
      carregarPermissoes(true);
      break;
    case "arquivos":
      carregarArquivos(true);
      break;
    case "automacoes":
      carregarAutomacoes(true);
      break;
    case "geral":
      updateGerencialIndicators();
      break;
    default:
      break;
  }
  gerencialLoadedTabs.add(tabId);
}

function setGerencialTabActive(tabId) {
  gerencialTabs.forEach((tab) => {
    const isActive = tab.dataset.tabTarget === tabId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", isActive ? "true" : "false");
    tab.setAttribute("tabindex", isActive ? "0" : "-1");
  });
  gerencialPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.tabPanel === tabId);
  });
  loadGerencialTab(tabId);
}

function updateGerencialTabVisibility() {
  if (!gerencialTabs.length) {
    return;
  }
  const canView = Boolean(currentUser && canViewGerencial(currentUser));
  gerencialTabs.forEach((tab) => {
    const tabId = tab.dataset.tabTarget;
    const allow = canView && canAccessGerencialTab(tabId, currentUser);
    tab.hidden = !allow;
  });
  gerencialIndicators.forEach((card) => {
    const tabId = card.dataset.tabTarget;
    const allow = canView && canAccessGerencialTab(tabId, currentUser);
    card.hidden = !allow;
    const action = card.querySelector(".indicator-card__action");
    if (action) {
      action.disabled = !allow;
    }
  });
  gerencialPanels.forEach((panel) => {
    const tabId = panel.dataset.tabPanel;
    panel.hidden = !canView || !canAccessGerencialTab(tabId, currentUser);
  });
  if (btnGerencialRefreshAll) {
    btnGerencialRefreshAll.disabled = !canView;
  }
  if (gerencialPaletteTrigger) {
    gerencialPaletteTrigger.disabled = !canView;
  }
  if (btnGerencialPalette) {
    btnGerencialPalette.disabled = !canView;
  }
  if (btnGerencialGoLogs) {
    btnGerencialGoLogs.disabled = !canAccessGerencialTab("logs", currentUser);
  }
  if (btnGerencialGoPermissoes) {
    btnGerencialGoPermissoes.disabled = !canAccessGerencialTab("permissoes", currentUser);
  }
  if (btnHealthRunAll) {
    btnHealthRunAll.disabled = !currentUser || !hasGranularPermission(currentUser, "reexecutarTarefas");
  }
  if (btnLogsExport) {
    btnLogsExport.disabled = !currentUser || !hasGranularPermission(currentUser, "verLogsAPI");
  }
  updateGerencialIndicators();
  const activeTab = gerencialTabs.find((tab) => tab.classList.contains("is-active") && !tab.hidden);
  if (activeTab) {
    setGerencialTabActive(activeTab.dataset.tabTarget);
    return;
  }
  const firstVisible = gerencialTabs.find((tab) => !tab.hidden);
  if (firstVisible) {
    setGerencialTabActive(firstVisible.dataset.tabTarget);
  }
}

function getGerencialPaletteItems() {
  const items = [];
  gerencialTabs.forEach((tab) => {
    if (tab.hidden) {
      return;
    }
    const label = tab.textContent.trim();
    items.push({
      type: "tab",
      label,
      tab: tab.dataset.tabTarget,
      hint: "Abrir modulo",
    });
  });
  const actionItems = [
    {
      label: "Ver status de backup",
      tab: "diagnostico",
      scrollTarget: "gerencialHealth",
      permission: "verDiagnostico",
    },
    {
      label: "Atualizar painel",
      tab: "geral",
      selector: "#btnGerencialRefreshAll",
    },
    {
      label: "Reexecutar tudo (diagnóstico)",
      tab: "diagnostico",
      selector: "#btnHealthRunAll",
      permission: "reexecutarTarefas",
    },
    {
      label: "Atualizar diagnóstico",
      tab: "diagnostico",
      selector: "#btnRefreshHealth",
      permission: "verDiagnostico",
    },
    {
      label: "Exportar logs de API",
      tab: "logs",
      selector: "#btnLogsExport",
      permission: "verLogsAPI",
    },
    {
      label: "Atualizar logs",
      tab: "logs",
      selector: "#btnLogsRefresh",
      permission: "verLogsAPI",
    },
    {
      label: "Salvar permissões",
      tab: "permissoes",
      selector: "#btnPermissoesSalvar",
    },
    {
      label: "Atualizar automacoes",
      tab: "automacoes",
      selector: "#btnAutomationRefresh",
      permission: "verAutomacoes",
    },
    {
      label: "Atualizar arquivos",
      tab: "arquivos",
      selector: "#btnFilesRefresh",
      permission: "verArquivos",
    },
  ];
  actionItems.forEach((item) => {
    if (!currentUser || !canAccessGerencialTab(item.tab, currentUser)) {
      return;
    }
    if (item.permission && !hasGranularPermission(currentUser, item.permission)) {
      return;
    }
    items.push({ ...item, type: "action", hint: "Executar ação" });
  });
  return items;
}

function renderGerencialPalette(query = "") {
  if (!gerencialPaletteList) {
    return;
  }
  const normalized = query.trim().toLowerCase();
  gerencialPaletteList.innerHTML = "";
  const items = getGerencialPaletteItems().filter((item) => {
    const text = `${item.label} ${item.hint || ""}`.toLowerCase();
    return !normalized || text.includes(normalized);
  });
  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "Nenhum resultado encontrado.";
    gerencialPaletteList.append(empty);
    return;
  }
  items.forEach((item) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "command-palette__item";
    row.dataset.paletteType = item.type;
    row.dataset.paletteTab = item.tab || "";
    row.dataset.paletteSelector = item.selector || "";
    row.dataset.paletteScroll = item.scrollTarget || "";
    row.innerHTML = `<strong>${item.label}</strong><span>${item.hint || ""}</span>`;
    gerencialPaletteList.append(row);
  });
}

function openGerencialPalette() {
  if (!gerencialPalette) {
    return false;
  }
  const gerencialPanel = document.getElementById("gerencial");
  if (!currentUser || !canViewGerencial(currentUser) || (gerencialPanel && gerencialPanel.hidden)) {
    return false;
  }
  gerencialPalette.hidden = false;
  renderGerencialPalette("");
  if (gerencialPaletteInput) {
    gerencialPaletteInput.value = "";
    gerencialPaletteInput.focus();
  }
  return true;
}

function closeGerencialPalette() {
  if (!gerencialPalette) {
    return;
  }
  gerencialPalette.hidden = true;
}

function canViewUsuarios(user) {
  return hasGranularPermission(user, "verUsuarios");
}

function canInviteUsuarios(user) {
  return hasGranularPermission(user, "convidarUsuarios");
}

function canDesativarUsuarios(user) {
  return hasGranularPermission(user, "desativarUsuarios");
}

function canViewPerformanceTab(user) {
  if (!user) {
    return false;
  }
  if (user.role === "admin" || user.role === "supervisor") {
    return true;
  }
  if (isFullAccessUser(user)) {
    return true;
  }
  return getCargoLevel(user.cargo) >= getCargoLevel("SUPERVISOR O&M");
}

function canViewTab(tab, user, secConfig) {
  if (!tab) {
    return false;
  }
  const permissionKey = TAB_PERMISSION_MAP[tab];
  if (permissionKey) {
    if (!user) {
      return false;
    }
    const keys = Array.isArray(permissionKey) ? permissionKey : [permissionKey];
    const hasPermission = keys.some((key) => hasGranularPermission(user, key));
    if (!hasPermission) {
      return false;
    }
    if (PERFORMANCE_TABS.has(tab)) {
      return canViewPerformanceTab(user);
    }
    return true;
  }
  if (PERFORMANCE_TABS.has(tab)) {
    return canViewPerformanceTab(user);
  }
  return Boolean(secConfig && secConfig[tab]);
}

const ACTION_LABELS = {
  create: "Criar",
  edit: "Editar",
  remove: "Remover",
  reschedule: "Reagendar",
  release: "Liberação registrada",
  execute: "Execução iniciada",
  cancel_start: "Início cancelado",
  execute_register: "Registro de execução",
  complete: "Concluir",
  note: "Observação",
  backlog_auto: "Backlog automático",
  backlog_reason: "Motivo não executada",
  rdo_delete: "RDO excluído",
};

const MAINTENANCE_STATE_LABELS = {
  overdue: "ATRASADA",
  released: "LIBERADA",
  planned: "PLANEJADA",
};

const RESULTADO_LABELS = {
  concluida: "Concluída",
  ressalva: "Concluída com ressalva",
  nao_executada: "Não executada",
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
let activeProjectId = "";
let availableProjects = [];
let projectEquipamentos = [];
let projectEquipe = [];
let pmpActivities = [];
let pmpExecutions = [];
const pmpEquipamentosCache = new Map();
const pmpMaintenanceCache = new Map();
let pmpChecklistItems = [];
let pmpFormOrigem = "manual";
let pmpProcedimentoDoc = null;
let pmpImportItems = [];
let pmpImportSelection = new Set();
let pmpLastSnapshot = null;
let pmpCellContext = null;
let adminPermissionCatalog = [];
let reminderDays = DEFAULT_REMINDER_DAYS;
let loadingTimeout = null;
let historicoAtualId = null;
let historicoLimite = HISTORY_PAGE_SIZE;
let manutencaoEmLiberacao = null;
let pendingLiberacaoOverride = null;
let manutencaoEmBacklogMotivo = null;
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
let feedbacks = [];
let dashboardSummary = null;
let dashboardError = "";
let dashboardLastFetch = 0;
let dashboardRequest = null;
let maintenanceSyncTimer = null;
let maintenanceSyncPromise = null;
let maintenanceLastSync = 0;
let maintenanceLastUserId = null;
const maintenanceLoadedProjects = new Set();
let healthSnapshot = null;
let healthLoading = false;
let apiLogsState = {
  items: [],
  total: 0,
  filtered: 0,
  offset: 0,
  limit: 20,
  loading: false,
  filters: {
    endpoint: "",
    user: "",
    status: "",
    from: "",
    to: "",
  },
};
let automationsState = {
  items: [],
  loading: false,
};
let filesState = {
  items: [],
  loading: false,
};
let permissoesState = {
  values: {},
  profiles: [],
  permissions: [],
  loading: false,
  loaded: false,
};
let filesSearchTimer = null;
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
let homeTipsTimer = null;
let homeTipIndex = 0;

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

function getProjectStorageKey(baseKey) {
  if (!activeProjectId) {
    return baseKey;
  }
  return `${baseKey}.${activeProjectId}`;
}

function isProjectStorageKey(eventKey, baseKey) {
  if (!eventKey) {
    return false;
  }
  return eventKey === baseKey || eventKey.startsWith(`${baseKey}.`);
}

const API_BASE = "";
const API_TIMEOUT_MS = 15000;
const AVATAR_MAX_BYTES = 10 * 1024 * 1024;
const AVATAR_ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const FILE_MAX_BYTES = 10 * 1024 * 1024;
const FILE_ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
let pendingAvatarDataUrl = "";
let avatarUploadBound = false;
let lastFocusMaintenanceId = "";

async function apiRequest(path, options = {}) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  let timeoutId = null;
  if (controller) {
    timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  }
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      signal: controller ? controller.signal : undefined,
      ...options,
    });
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (error && error.name === "AbortError") {
      throw new Error("Tempo limite da requisicao.");
    }
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data && data.message ? data.message : "Falha na autenticação.";
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

function getUserMenuRoleText(user) {
  if (!user) {
    return "Perfil";
  }
  const roleLabel = getRoleLabel(user);
  const cargo = String(user.cargo || "").trim();
  if (cargo && roleLabel) {
    return `${cargo} | ${roleLabel}`;
  }
  return cargo || roleLabel || "Perfil";
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

function setPerfilSaveMessage(message, error = false) {
  const saveMsg = document.getElementById("perfilSaveMsg");
  if (!saveMsg) {
    return;
  }
  saveMsg.textContent = message || "";
  saveMsg.hidden = !message;
  saveMsg.classList.toggle("mensagem--erro", error);
}

function isProfileEditMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("edit") === "1";
}

function setProfileEditParam(isEdit) {
  const url = new URL(window.location.href);
  if (isEdit) {
    url.searchParams.set("edit", "1");
  } else {
    url.searchParams.delete("edit");
  }
  window.history.replaceState(null, "", url.toString());
}

function mountProfileTemplate(template, mount) {
  if (!template || !mount || mount.childElementCount) {
    return;
  }
  mount.innerHTML = "";
  mount.appendChild(template.content.cloneNode(true));
}

function unmountProfileTemplate(mount) {
  if (!mount) {
    return;
  }
  mount.textContent = "";
}

function mountProfileEdit() {
  mountProfileTemplate(perfilEditTemplate, perfilEditMount);
}

function unmountProfileEdit() {
  unmountProfileTemplate(perfilEditMount);
}

function mountProfileAvatarActions() {
  mountProfileTemplate(perfilAvatarTemplate, perfilAvatarActionsMount);
}

function unmountProfileAvatarActions() {
  unmountProfileTemplate(perfilAvatarActionsMount);
}

function formatProfileValue(value) {
  const texto = String(value || "").trim();
  return texto ? texto : "Não informado";
}

function ativarModoEdicaoPerfil() {
  if (!currentUser) {
    return;
  }
  if (
    !isFullAccessUser(currentUser) &&
    getCargoLevel(currentUser.cargo) < getCargoLevel("SUPERVISOR O&M")
  ) {
    setPerfilSaveMessage("Sem permissão para editar este perfil.", true);
    return;
  }
  setProfileEditParam(true);
  renderPerfil();
  if (perfilModeBadge) {
    perfilModeBadge.hidden = false;
  }
  if (perfilViewActions) {
    perfilViewActions.hidden = true;
  }
  if (perfilEditActions) {
    perfilEditActions.hidden = false;
  }
  const input = document.getElementById("perfilUenInput");
  if (input) {
    input.focus();
  }
}

function cancelarModoEdicaoPerfil() {
  setProfileEditParam(false);
  pendingAvatarDataUrl = "";
  setAvatarError("");
  renderPerfil();
  if (perfilModeBadge) {
    perfilModeBadge.hidden = true;
  }
  if (perfilViewActions) {
    perfilViewActions.hidden = false;
  }
  if (perfilEditActions) {
    perfilEditActions.hidden = true;
  }
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
  target.classList.remove("focus-pulse", "focus-state-pulse");
  void target.offsetWidth;
  target.classList.add("focus-pulse", "focus-state-pulse");
  const cleanup = () => {
    target.classList.remove("focus-pulse", "focus-state-pulse");
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

async function handleEmailVerification() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("verify");
  if (!token) {
    return false;
  }
  try {
    await apiVerifyEmail(token);
    mostrarMensagemConta("Email confirmado. Faca login.", false);
  } catch (error) {
    const message = error && error.message ? error.message : "Falha ao confirmar email.";
    mostrarMensagemConta(message, true);
  } finally {
    params.delete("verify");
    const url = new URL(window.location.href);
    url.searchParams.delete("verify");
    window.history.replaceState(null, "", url.toString());
    mostrarAuthPanel("login");
  }
  return true;
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

function mostrarMensagemHealth(texto, erro = false) {
  if (!healthMessage) {
    return;
  }
  healthMessage.textContent = texto;
  healthMessage.classList.toggle("mensagem--erro", erro);
}

function getHealthLabel(status) {
  if (status === "ok") {
    return "OK";
  }
  if (status === "warn") {
    return "Atenção";
  }
  if (status === "error") {
    return "Falha";
  }
  return "Indef.";
}

function buildHealthBadge(status) {
  const badge = document.createElement("span");
  badge.className = `health-badge health-badge--${status || "warn"}`;
  badge.textContent = getHealthLabel(status);
  return badge;
}

function formatHealthDate(value) {
  const parsed = parseTimestamp(value);
  return parsed ? formatDateTime(parsed) : "-";
}

function renderHealthSummary(snapshot) {
  if (!healthSummary) {
    return;
  }
  healthSummary.innerHTML = "";
  if (!snapshot || !snapshot.modules) {
    const vazio = document.createElement("p");
    vazio.className = "empty-state";
    vazio.textContent = "Diagnóstico indisponível.";
    healthSummary.append(vazio);
    return;
  }
  const { modules } = snapshot;
  const dbFiles = modules.database && modules.database.files ? modules.database.files : [];
  const dbResumo = dbFiles.length
    ? dbFiles
        .map((file) =>
          file.ok
            ? `${file.label}: ${file.count} registros`
            : `${file.label}: erro`
        )
        .join(" | ")
    : "Sem arquivos monitorados.";
  const tarefas = modules.queue && modules.queue.tasks ? modules.queue.tasks : [];
  const tarefasEmAtraso = tarefas.filter((task) => task.status !== "ok").length;
  const cards = [
    {
      titulo: "Banco de dados",
      status: modules.database ? modules.database.status : "warn",
      resumo: dbResumo,
    },
    {
      titulo: "Backup",
      status: modules.backups ? modules.backups.status : "warn",
      resumo: `Última execução: ${formatHealthDate(modules.backups && modules.backups.lastRun)}`,
    },
    {
      titulo: "Fila de tarefas",
      status: modules.queue ? modules.queue.status : "warn",
      resumo: `Tarefas: ${tarefas.length} | Alertas: ${tarefasEmAtraso}`,
    },
    {
      titulo: "Integridade",
      status: modules.integrity ? modules.integrity.status : "warn",
      resumo: (() => {
        const issues = modules.integrity && modules.integrity.issues
          ? modules.integrity.issues
          : [];
        const count = issues.length;
        if (!count) {
          return "Sem inconsistências.";
        }
        const detail = issues
          .slice(0, 2)
          .map((issue) => issue.message || "Inconsistência")
          .join(" | ");
        return `Inconsistências: ${count}${detail ? ` | ${detail}` : ""}`;
      })(),
    },
  ];
  cards.forEach((cardData) => {
    const card = document.createElement("div");
    card.className = "health-card";
    const title = document.createElement("h4");
    title.textContent = cardData.titulo;
    const badge = buildHealthBadge(cardData.status);
    const resumo = document.createElement("p");
    resumo.textContent = cardData.resumo;
    card.append(title, badge, resumo);
    healthSummary.append(card);
  });
  updateGerencialIndicators();
}

function renderHealthTasks(snapshot) {
  if (!healthTasks) {
    return;
  }
  healthTasks.innerHTML = "";
  const tasks = snapshot && snapshot.modules && snapshot.modules.queue
    ? snapshot.modules.queue.tasks || []
    : [];
  if (!tasks.length) {
    const vazio = document.createElement("p");
    vazio.className = "empty-state";
    vazio.textContent = "Nenhuma tarefa registrada.";
    healthTasks.append(vazio);
    return;
  }
  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = "health-task";
    card.dataset.taskId = task.id;

    const meta = document.createElement("div");
    meta.className = "health-task__meta";
    const title = document.createElement("div");
    title.className = "health-task__title";
    title.textContent = task.label || task.id;
    const details = document.createElement("div");
    details.className = "health-task__details";
    details.textContent = `Última execução: ${formatHealthDate(task.lastRun)} | Intervalo: ${task.intervalMinutes} min`;
    meta.append(title, details);
    if (task.lastError) {
      const error = document.createElement("div");
      error.className = "health-task__details";
      error.textContent = `Erro: ${task.lastError}`;
      meta.append(error);
    }

    const actions = document.createElement("div");
    actions.className = "health-task__actions";
    actions.append(buildHealthBadge(task.status));
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost btn--small";
    btn.dataset.action = "run-task";
    btn.dataset.taskId = task.id;
    btn.textContent = "Reexecutar";
    if (!currentUser || !hasGranularPermission(currentUser, "reexecutarTarefas")) {
      btn.disabled = true;
    }
    actions.append(btn);

    card.append(meta, actions);
    healthTasks.append(card);
  });
}

function renderHealthIntegrity(snapshot) {
  if (!healthIntegrity) {
    return;
  }
  healthIntegrity.innerHTML = "";
  const issues = snapshot && snapshot.modules && snapshot.modules.integrity
    ? snapshot.modules.integrity.issues || []
    : [];
  if (!issues.length) {
    const ok = document.createElement("p");
    ok.className = "empty-state";
    ok.textContent = "Sem inconsistências detectadas.";
    healthIntegrity.append(ok);
    return;
  }
  issues.forEach((issue) => {
    const item = document.createElement("div");
    const level = issue.level === "error" ? "error" : "warn";
    item.className = `health-issue health-issue--${level}`;
    item.textContent = issue.message || "Inconsistência detectada.";
    healthIntegrity.append(item);
  });
}

async function carregarHealth(forcar = false) {
  if (!currentUser || !canViewGerencial(currentUser) || !hasGranularPermission(currentUser, "verDiagnostico") || healthLoading) {
    return;
  }
  if (!forcar && healthSnapshot) {
    renderHealthSummary(healthSnapshot);
    renderHealthTasks(healthSnapshot);
    renderHealthIntegrity(healthSnapshot);
    return;
  }
  healthLoading = true;
  mostrarMensagemHealth("Carregando diagnóstico...");
  try {
    const data = await apiAdminHealth();
    healthSnapshot = data;
    renderHealthSummary(data);
    renderHealthTasks(data);
    renderHealthIntegrity(data);
    mostrarMensagemHealth(`Atualizado em ${formatHealthDate(data.generatedAt)}.`);
  } catch (error) {
    mostrarMensagemHealth(error.message || "Falha ao carregar diagnóstico.", true);
  } finally {
    healthLoading = false;
  }
}

async function runAllHealthTasks() {
  if (!currentUser || !hasGranularPermission(currentUser, "reexecutarTarefas")) {
    return;
  }
  const tasks = healthSnapshot && healthSnapshot.modules && healthSnapshot.modules.queue
    ? healthSnapshot.modules.queue.tasks || []
    : [];
  if (!tasks.length) {
    mostrarMensagemHealth("Nenhuma tarefa para reexecutar.");
    return;
  }
  mostrarMensagemHealth("Reexecutando tarefas...");
  for (const task of tasks) {
    try {
      await apiRunHealthTask(task.id);
    } catch (error) {
      mostrarMensagemHealth(error.message || "Falha ao reexecutar tarefas.", true);
      break;
    }
  }
  await carregarHealth(true);
  mostrarMensagemHealth("Tarefas reexecutadas.");
}

function exportarApiLogs() {
  if (!apiLogsState.items.length) {
    if (apiLogsMessage) {
      apiLogsMessage.textContent = "Sem logs para exportar.";
      apiLogsMessage.classList.add("mensagem--erro");
    }
    return;
  }
  const payload = {
    generatedAt: new Date().toISOString(),
    filters: apiLogsState.filters,
    logs: apiLogsState.items,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `logs-api-${stamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildLogStatusClass(status) {
  if (status >= 500) {
    return "log-status--error";
  }
  if (status >= 400) {
    return "log-status--error";
  }
  if (status >= 300) {
    return "log-status--warn";
  }
  return "log-status--ok";
}

function renderApiLogs() {
  if (!apiLogsTable) {
    return;
  }
  apiLogsTable.innerHTML = "";
  const items = apiLogsState.items || [];
  if (!items.length) {
    if (apiLogsEmpty) {
      apiLogsEmpty.hidden = false;
    }
    if (btnLogsLoadMore) {
      btnLogsLoadMore.hidden = true;
    }
    if (apiLogsCount) {
      apiLogsCount.textContent = "";
    }
    return;
  }
  if (apiLogsEmpty) {
    apiLogsEmpty.hidden = true;
  }
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Data</th>
        <th>Endpoint</th>
        <th>Usuário</th>
        <th>Status</th>
        <th>Duração</th>
        <th>Ações</th>
      </tr>
    </thead>
  `;
  const tbody = document.createElement("tbody");
  items.forEach((entry) => {
    const row = document.createElement("tr");
    const data = parseTimestamp(entry.timestamp);
    const userLabel = entry.userName || entry.userId || "Anônimo";
    const status = Number(entry.status) || 0;
    const statusClass = buildLogStatusClass(status);
    row.innerHTML = `
      <td>${escapeHtml(data ? formatDateTime(data) : "-")}</td>
      <td>${escapeHtml(entry.method || "")} ${escapeHtml(entry.endpoint || "")}</td>
      <td>${escapeHtml(userLabel)}</td>
      <td><span class="log-status ${statusClass}">${status || "-"}</span></td>
      <td>${escapeHtml(entry.durationMs ? `${entry.durationMs}ms` : "-")}</td>
      <td>
        <button class="btn btn--ghost btn--small" data-action="toggle-log" data-log-id="${escapeHtml(entry.id)}">
          Ver JSON
        </button>
      </td>
    `;
    tbody.append(row);

    const detailRow = document.createElement("tr");
    detailRow.className = "log-details";
    detailRow.dataset.logDetails = entry.id;
    detailRow.hidden = true;
    const detailCell = document.createElement("td");
    detailCell.colSpan = 6;
    const pre = document.createElement("pre");
    pre.textContent = JSON.stringify(entry, null, 2);
    detailCell.append(pre);
    detailRow.append(detailCell);
    tbody.append(detailRow);
  });
  table.append(tbody);
  apiLogsTable.append(table);
  if (apiLogsCount) {
    apiLogsCount.textContent = `Mostrando ${apiLogsState.items.length} de ${apiLogsState.filtered}`;
  }
  if (btnLogsLoadMore) {
    btnLogsLoadMore.hidden = apiLogsState.items.length >= apiLogsState.filtered;
  }
  updateGerencialIndicators();
}

function getApiLogsFilters() {
  return {
    endpoint: logsFilterEndpoint ? logsFilterEndpoint.value.trim() : "",
    user: logsFilterUser ? logsFilterUser.value.trim() : "",
    status: logsFilterStatus ? logsFilterStatus.value : "",
    from: logsFilterFrom ? logsFilterFrom.value : "",
    to: logsFilterTo ? logsFilterTo.value : "",
  };
}

async function carregarApiLogs(reset = false) {
  if (!currentUser || !canViewGerencial(currentUser) || !hasGranularPermission(currentUser, "verLogsAPI") || apiLogsState.loading) {
    return;
  }
  if (!apiLogsTable) {
    return;
  }
  if (reset) {
    apiLogsState.offset = 0;
    apiLogsState.items = [];
  }
  apiLogsState.loading = true;
  const filtros = getApiLogsFilters();
  apiLogsState.filters = filtros;
  if (apiLogsMessage) {
    apiLogsMessage.textContent = "Carregando logs...";
    apiLogsMessage.classList.remove("mensagem--erro");
  }
  try {
    const params = {
      limit: apiLogsState.limit,
      offset: apiLogsState.offset,
      endpoint: filtros.endpoint,
      userId: filtros.user,
      status: filtros.status,
      from: filtros.from,
      to: filtros.to,
    };
    const data = await apiAdminLogs(params);
    apiLogsState.total = data.total || 0;
    apiLogsState.filtered = data.filteredTotal || 0;
    const novos = Array.isArray(data.logs) ? data.logs : [];
    apiLogsState.items = reset ? novos : apiLogsState.items.concat(novos);
    apiLogsState.offset = apiLogsState.items.length;
    renderApiLogs();
    if (apiLogsMessage) {
      apiLogsMessage.textContent = "";
    }
  } catch (error) {
    if (apiLogsMessage) {
      apiLogsMessage.textContent = error.message || "Falha ao carregar logs.";
      apiLogsMessage.classList.add("mensagem--erro");
    }
  } finally {
    apiLogsState.loading = false;
  }
}

function carregarPainelGerencial(forcar = false) {
  if (!currentUser || !canViewGerencial(currentUser)) {
    return;
  }
  updateGerencialTabVisibility();
  if (forcar) {
    gerencialLoadedTabs.clear();
    gerencialTabs.forEach((tab) => {
      if (!tab.hidden) {
        loadGerencialTab(tab.dataset.tabTarget, true);
      }
    });
    return;
  }
  const activeTab = gerencialTabs.find((tab) => tab.classList.contains("is-active") && !tab.hidden);
  if (activeTab) {
    loadGerencialTab(activeTab.dataset.tabTarget);
  }
}

function mostrarMensagemAutomacoes(texto, erro = false) {
  if (!automationMessage) {
    return;
  }
  automationMessage.textContent = texto;
  automationMessage.classList.toggle("mensagem--erro", erro);
}

function mostrarMensagemPermissoes(texto, erro = false) {
  if (!permissoesMessage) {
    return;
  }
  permissoesMessage.textContent = texto;
  permissoesMessage.classList.toggle("mensagem--erro", erro);
}

function getPermissoesProfiles() {
  if (Array.isArray(permissoesState.profiles) && permissoesState.profiles.length) {
    return permissoesState.profiles;
  }
  return GRANULAR_PROFILE_ORDER.map((key) => ({
    key,
    label: RBAC_ROLE_LABELS[key] || key.toUpperCase(),
  }));
}

function getPermissoesCatalog() {
  if (Array.isArray(permissoesState.permissions) && permissoesState.permissions.length) {
    return permissoesState.permissions;
  }
  return Object.keys(GRANULAR_PERMISSION_LABELS).map((key) => ({
    key,
    label: GRANULAR_PERMISSION_LABELS[key],
  }));
}

function buildPermissoesGroups(permissions) {
  const permMap = new Map(permissions.map((perm) => [perm.key, perm]));
  const used = new Set();
  const groups = PERMISSION_GROUPS.map((group) => {
    const items = group.items
      .map((key) => permMap.get(key))
      .filter(Boolean);
    items.forEach((item) => used.add(item.key));
    return { key: group.key, label: group.label, items };
  });
  const extras = permissions.filter((perm) => !used.has(perm.key));
  if (extras.length) {
    groups.push({ key: "outros", label: "Outros", items: extras });
  }
  return groups;
}

function renderPermissoesGerenciais() {
  if (!permissoesList) {
    return;
  }
  const profiles = getPermissoesProfiles();
  const permissions = getPermissoesCatalog();
  const groups = buildPermissoesGroups(permissions);
  const podeEditar = Boolean(currentUser && isAdmin() && canViewGerencial(currentUser));
  const query = permissoesSearch ? normalizeSearchValue(permissoesSearch.value) : "";
  const allowedPermissions = query
    ? new Set(
        permissions
          .filter((perm) => normalizeSearchValue(perm.label || perm.key).includes(query))
          .map((perm) => perm.key)
      )
    : null;

  permissoesList.innerHTML = "";
  if (!profiles.length || !permissions.length) {
    return;
  }

  let totalEnabled = 0;
  let visibleProfiles = 0;

  profiles.forEach((profile) => {
    const card = document.createElement("div");
    card.className = "permissions-card";
    card.dataset.profile = profile.key;

    const title = document.createElement("div");
    title.className = "permissions-title";
    const values = (permissoesState.values && permissoesState.values[profile.key]) || {};
    title.textContent = profile.label || profile.key;

    const groupsWrap = document.createElement("div");
    groupsWrap.className = "permissions-groups";
    let profileEnabled = 0;
    let hasVisibleGroup = false;

    groups.forEach((group) => {
      const visiblePerms = group.items.filter(
        (perm) => !allowedPermissions || allowedPermissions.has(perm.key)
      );
      if (!visiblePerms.length) {
        return;
      }
      hasVisibleGroup = true;
      const groupEl = document.createElement("div");
      groupEl.className = "permissions-group";
      const groupTitle = document.createElement("div");
      groupTitle.className = "permissions-group__title";
      groupTitle.textContent = group.label;

      const list = document.createElement("div");
      list.className = "permissions-list";
      visiblePerms.forEach((perm) => {
        const label = document.createElement("label");
        label.className = "permissions-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.profile = profile.key;
        checkbox.dataset.permission = perm.key;
        checkbox.checked = Boolean(values[perm.key]);
        checkbox.disabled = !podeEditar;
        if (checkbox.checked) {
          profileEnabled += 1;
        }
        const text = document.createElement("span");
        text.textContent = perm.label || perm.key;
        label.append(checkbox, text);
        list.append(label);
      });

      groupEl.append(groupTitle, list);
      groupsWrap.append(groupEl);
    });

    if (!hasVisibleGroup) {
      return;
    }

    const count = document.createElement("span");
    count.className = "permissions-count";
    const totalVisible = allowedPermissions ? allowedPermissions.size : permissions.length;
    count.textContent = `${profileEnabled}/${totalVisible} ativos`;
    title.append(count);

    card.append(title, groupsWrap);
    permissoesList.append(card);
    totalEnabled += profileEnabled;
    visibleProfiles += 1;
  });

  if (!permissoesList.childElementCount) {
    const vazio = document.createElement("p");
    vazio.className = "empty-state";
    vazio.textContent = "Nenhuma permissão encontrada com esse filtro.";
    permissoesList.append(vazio);
  }

  if (permissoesSummary) {
    const totalVisible = allowedPermissions ? allowedPermissions.size : permissions.length;
    permissoesSummary.innerHTML = "";
    const pills = [
      `Perfis: ${visibleProfiles}`,
      `Permissões: ${totalVisible}`,
      `Ativas: ${totalEnabled}`,
    ];
    pills.forEach((text) => {
      const pill = document.createElement("span");
      pill.className = "permissions-pill";
      pill.textContent = text;
      permissoesSummary.append(pill);
    });
  }
  if (btnPermissoesSalvar) {
    btnPermissoesSalvar.disabled = !podeEditar;
  }
}

function coletarPermissoesGerenciais() {
  const payload = {};
  if (!permissoesList) {
    return payload;
  }
  permissoesList.querySelectorAll(".permissions-card").forEach((card) => {
    const profileKey = card.dataset.profile;
    if (!profileKey) {
      return;
    }
    const profilePermissions = {};
    card.querySelectorAll("input[data-permission]").forEach((input) => {
      profilePermissions[input.dataset.permission] = input.checked;
    });
    payload[profileKey] = profilePermissions;
  });
  return payload;
}

async function carregarPermissoes(forcar = false) {
  if (!currentUser || !canViewGerencial(currentUser)) {
    return;
  }
  if (permissoesState.loading) {
    return;
  }
  if (!forcar && permissoesState.loaded) {
    renderPermissoesGerenciais();
    return;
  }
  permissoesState.loading = true;
  mostrarMensagemPermissoes("Carregando permissões...");
  try {
    const data = await apiAdminPermissoes();
    permissoesState.values = data.values || {};
    permissoesState.profiles = Array.isArray(data.profiles) ? data.profiles : [];
    permissoesState.permissions = Array.isArray(data.permissions) ? data.permissions : [];
    permissoesState.loaded = true;
    renderPermissoesGerenciais();
    mostrarMensagemPermissoes("");
  } catch (error) {
    mostrarMensagemPermissoes(error.message || "Falha ao carregar permissões.", true);
  } finally {
    permissoesState.loading = false;
  }
}

function getAutomationEventLabel(evento) {
  if (evento === "maintenance_created") {
    return "Manutenção criada";
  }
  return "Evento";
}

function getAutomationConditionLabel(condition) {
  if (condition && condition.type === "critical") {
    return "Tag crítica";
  }
  return "Sem condição";
}

function getAutomationActionLabel(action) {
  if (action && action.type === "notify_email") {
    return "Notificar e-mail";
  }
  return "Ação";
}

function formatAutomationDate(value) {
  const parsed = parseTimestamp(value);
  return parsed ? formatDateTime(parsed) : "Nunca";
}

function renderAutomacoes() {
  if (!automationList) {
    return;
  }
  automationList.innerHTML = "";
  const items = automationsState.items || [];
  if (!items.length) {
    const vazio = document.createElement("p");
    vazio.className = "empty-state";
    vazio.textContent = "Nenhuma automação configurada.";
    automationList.append(vazio);
    return;
  }
  items.forEach((automation) => {
    const row = document.createElement("div");
    row.className = "automation-item";
    row.dataset.automationId = automation.id;

    const main = document.createElement("div");
    main.className = "automation-main";
    const title = document.createElement("div");
    title.className = "automation-title";
    title.textContent = automation.name || "Automação";
    const meta = document.createElement("div");
    meta.className = "automation-meta";
    meta.textContent = `Evento: ${getAutomationEventLabel(automation.event)} | Condição: ${getAutomationConditionLabel(
      automation.condition
    )} | Ação: ${getAutomationActionLabel(automation.action)}`;
    const status = document.createElement("div");
    status.className = "automation-status";
    const lastLabel = formatAutomationDate(automation.lastRunAt);
    const statusLabel = automation.lastStatus
      ? automation.lastStatus.toUpperCase()
      : "PENDENTE";
    status.textContent = `Última execução: ${lastLabel} | ${statusLabel}`;
    main.append(title, meta, status);

    const actions = document.createElement("div");
    actions.className = "automation-actions";
    const toggle = document.createElement("label");
    toggle.className = "automation-toggle";
    toggle.innerHTML = `
      <input type="checkbox" data-action="toggle-automation" data-automation-id="${escapeHtml(
        automation.id
      )}">
      <span>Ativa</span>
    `;
    const input = toggle.querySelector("input");
    if (input) {
      input.checked = Boolean(automation.enabled);
      input.disabled = !hasGranularPermission(currentUser, "gerenciarAutomacoes");
    }
    const note = document.createElement("div");
    note.className = "automation-note";
    note.textContent = "Destino: e-mail do admin logado.";
    actions.append(toggle, note);

    row.append(main, actions);
    automationList.append(row);
  });
  updateGerencialIndicators();
}

async function carregarAutomacoes(forcar = false) {
  if (!currentUser || !canViewGerencial(currentUser) || !hasGranularPermission(currentUser, "verAutomacoes") || automationsState.loading) {
    return;
  }
  if (!forcar && automationsState.items.length) {
    renderAutomacoes();
    return;
  }
  automationsState.loading = true;
  mostrarMensagemAutomacoes("Carregando automações...");
  try {
    const data = await apiAdminAutomations();
    automationsState.items = Array.isArray(data.automations) ? data.automations : [];
    renderAutomacoes();
    mostrarMensagemAutomacoes("");
  } catch (error) {
    mostrarMensagemAutomacoes(error.message || "Falha ao carregar automações.", true);
  } finally {
    automationsState.loading = false;
  }
}

function mostrarMensagemArquivos(texto, erro = false) {
  if (!filesMessage) {
    return;
  }
  filesMessage.textContent = texto;
  filesMessage.classList.toggle("mensagem--erro", erro);
}

function getFileTypeLabel(tipo) {
  if (tipo === "evidence") {
    return "Evidências";
  }
  if (tipo === "rdo") {
    return "Anexos de RDO";
  }
  if (tipo === "audit") {
    return "Documentos de auditoria";
  }
  return "Arquivo";
}

function formatFileSize(bytes) {
  const value = Number(bytes) || 0;
  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (value >= 1024) {
    return `${Math.round(value / 1024)} KB`;
  }
  return `${value} B`;
}

function renderFilesList() {
  if (!filesList) {
    return;
  }
  filesList.innerHTML = "";
  const items = filesState.items || [];
  if (!items.length) {
    if (filesEmpty) {
      filesEmpty.hidden = false;
    }
    return;
  }
  if (filesEmpty) {
    filesEmpty.hidden = true;
  }
  items.forEach((file) => {
    const row = document.createElement("div");
    row.className = "file-item";
    row.dataset.fileId = file.id;

    const preview = document.createElement("div");
    preview.className = "file-preview";
    if (String(file.mime || "").startsWith("image/")) {
      const img = document.createElement("img");
      img.src = resolvePublicUrl(file.url);
      img.alt = file.originalName || file.name;
      preview.append(img);
    } else {
      const tag = document.createElement("span");
      tag.textContent = (file.name || "").split(".").pop()?.toUpperCase() || "ARQ";
      preview.append(tag);
    }

    const info = document.createElement("div");
    info.className = "file-info";
    const title = document.createElement("div");
    title.className = "file-title";
    title.textContent = file.originalName || file.name;
    const meta = document.createElement("div");
    meta.className = "file-meta";
    const data = parseTimestamp(file.createdAt);
    meta.textContent = `${getFileTypeLabel(file.type)} | ${formatFileSize(file.size)} | ${
      data ? formatDateTime(data) : "-"
    }`;
    info.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "file-actions";
    const open = document.createElement("a");
    open.href = resolvePublicUrl(file.url);
    open.target = "_blank";
    open.rel = "noopener";
    open.className = "btn btn--ghost btn--small";
    open.textContent = "Ver";
    actions.append(open);
    const podeExcluir = currentUser && canDeleteFilesClient(currentUser);
    if (podeExcluir) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "btn btn--ghost btn--small";
      remove.dataset.action = "delete-file";
      remove.dataset.fileId = file.id;
      remove.textContent = "Excluir";
      actions.append(remove);
    }

    row.append(preview, info, actions);
    filesList.append(row);
  });
  updateGerencialIndicators();
}

async function carregarArquivos(forcar = false) {
  if (!currentUser || !canManageFilesClient(currentUser) || !canViewGerencial(currentUser) || filesState.loading) {
    return;
  }
  if (!forcar && filesState.items.length) {
    renderFilesList();
    return;
  }
  filesState.loading = true;
  mostrarMensagemArquivos("Carregando arquivos...");
  try {
    const params = {
      type: filesFilterType ? filesFilterType.value : "",
      search: filesSearch ? filesSearch.value.trim() : "",
    };
    const data = await apiAdminFiles(params);
    filesState.items = Array.isArray(data.files) ? data.files : [];
    renderFilesList();
    mostrarMensagemArquivos("");
  } catch (error) {
    mostrarMensagemArquivos(error.message || "Falha ao carregar arquivos.", true);
  } finally {
    filesState.loading = false;
  }
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

function mostrarMensagemBacklogMotivo(texto, erro = false) {
  if (!mensagemBacklogMotivo) {
    return;
  }
  mensagemBacklogMotivo.textContent = texto;
  mensagemBacklogMotivo.classList.toggle("mensagem--erro", erro);
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

function syncObsEditor(forceSanitize = false) {
  if (!obsManutencaoEditor || !obsManutencaoHtml || !obsManutencao) {
    return;
  }
  const raw = obsManutencaoEditor.innerHTML || "";
  const sanitized = forceSanitize ? sanitizeRichText(raw) : raw;
  if (forceSanitize && raw !== sanitized) {
    obsManutencaoEditor.innerHTML = sanitized;
  }
  obsManutencaoHtml.value = sanitized;
  obsManutencao.value = stripHtml(sanitized).trim();
}

function setObsEditorContent({ html = "", text = "" } = {}) {
  if (!obsManutencaoEditor || !obsManutencaoHtml || !obsManutencao) {
    return;
  }
  const sanitized = html ? sanitizeRichText(html) : "";
  obsManutencaoEditor.innerHTML = sanitized || "";
  if (!sanitized && text) {
    obsManutencaoEditor.textContent = text;
  }
  obsManutencaoHtml.value = sanitized;
  obsManutencao.value = (text || stripHtml(sanitized)).trim();
}

function initRichEditors() {
  if (!obsManutencaoEditor || !obsManutencaoToolbar || !obsManutencao) {
    return;
  }
  try {
    document.execCommand("defaultParagraphSeparator", false, "p");
  } catch (error) {
    // ignore
  }
  obsManutencaoEditor.addEventListener("input", () => {
    syncObsEditor(false);
  });
  obsManutencaoEditor.addEventListener("blur", () => {
    syncObsEditor(true);
  });
  obsManutencaoEditor.addEventListener("paste", (event) => {
    if (!event.clipboardData) {
      return;
    }
    const html = event.clipboardData.getData("text/html");
    const text = event.clipboardData.getData("text/plain");
    if (!html && !text) {
      return;
    }
    event.preventDefault();
    if (html) {
      const sanitized = sanitizeRichText(html);
      document.execCommand("insertHTML", false, sanitized);
      syncObsEditor(false);
      return;
    }
    document.execCommand("insertText", false, text);
    syncObsEditor(false);
  });
  obsManutencaoToolbar.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-cmd]");
    if (!btn) {
      return;
    }
    event.preventDefault();
    const cmd = btn.dataset.cmd;
    let value = btn.dataset.value || null;
    if (cmd === "formatBlock" && value && !value.startsWith("<")) {
      value = `<${value}>`;
    }
    document.execCommand(cmd, false, value);
    obsManutencaoEditor.focus();
    syncObsEditor(false);
  });
  obsManutencaoToolbar.addEventListener("change", (event) => {
    const select = event.target.closest("select[data-cmd]");
    if (!select) {
      return;
    }
    const cmd = select.dataset.cmd;
    const value = select.value;
    if (value) {
      document.execCommand(cmd, false, value);
      select.value = "";
      obsManutencaoEditor.focus();
      syncObsEditor(false);
    }
  });
  syncObsEditor(true);
}

function initFontGroups() {
  const textareas = Array.from(document.querySelectorAll("textarea"));
  if (!textareas.length) {
    return;
  }
  const fonts = ["Segoe UI", "Arial", "Georgia", "Courier New"];
  const sizes = [12, 14, 16, 18, 20];
  let counter = 0;

  textareas.forEach((textarea) => {
    if (!textarea) {
      return;
    }
    if (textarea.hidden || textarea.classList.contains("visually-hidden")) {
      return;
    }
    if (textarea.dataset && textarea.dataset.fontGroup === "false") {
      return;
    }
    if (textarea.closest && textarea.closest(".rich-editor")) {
      return;
    }
    if (textarea.closest && textarea.closest(".auth-layout")) {
      return;
    }
    const parent = textarea.parentElement;
    if (!parent) {
      return;
    }
    if (!textarea.id) {
      counter += 1;
      textarea.id = `textarea-font-${counter}`;
    }
    if (parent.querySelector(`.font-toolbar[data-font-toolbar-for="${textarea.id}"]`)) {
      return;
    }

    const toolbar = document.createElement("div");
    toolbar.className = "font-toolbar";
    toolbar.dataset.fontToolbarFor = textarea.id;

    const group = document.createElement("div");
    group.className = "font-toolbar__group";

    const fontSelect = document.createElement("select");
    fontSelect.className = "font-select";
    fontSelect.setAttribute("aria-label", "Fonte");
    const fontDefault = document.createElement("option");
    fontDefault.value = "";
    fontDefault.textContent = "Fonte";
    fontSelect.append(fontDefault);
    fonts.forEach((font) => {
      const option = document.createElement("option");
      option.value = font;
      option.textContent = font;
      fontSelect.append(option);
    });

    const sizeSelect = document.createElement("select");
    sizeSelect.className = "font-select";
    sizeSelect.setAttribute("aria-label", "Tamanho da fonte");
    const sizeDefault = document.createElement("option");
    sizeDefault.value = "";
    sizeDefault.textContent = "Tamanho";
    sizeSelect.append(sizeDefault);
    sizes.forEach((size) => {
      const option = document.createElement("option");
      option.value = String(size);
      option.textContent = `${size} px`;
      sizeSelect.append(option);
    });

    group.append(fontSelect, sizeSelect);
    toolbar.append(group);
    parent.insertBefore(toolbar, textarea);

    const applyFont = () => {
      if (fontSelect.value) {
        textarea.style.fontFamily = fontSelect.value;
      } else {
        textarea.style.removeProperty("font-family");
      }
      if (sizeSelect.value) {
        textarea.style.fontSize = `${sizeSelect.value}px`;
      } else {
        textarea.style.removeProperty("font-size");
      }
    };

    fontSelect.addEventListener("change", applyFont);
    sizeSelect.addEventListener("change", applyFont);

    try {
      const computed = window.getComputedStyle(textarea);
      const computedFont = (computed.fontFamily || "")
        .split(",")[0]
        .replace(/['"]/g, "")
        .trim();
      if (fonts.includes(computedFont)) {
        fontSelect.value = computedFont;
      }
      const computedSize = parseInt(computed.fontSize || "", 10);
      if (sizes.includes(computedSize)) {
        sizeSelect.value = String(computedSize);
      }
    } catch (error) {
      // ignore
    }
  });
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

function fecharUserMenu() {
  if (!userMenuPanel || !btnUserMenu) {
    return;
  }
  userMenuPanel.hidden = true;
  btnUserMenu.setAttribute("aria-expanded", "false");
}

function alternarPainelLembretes() {
  if (!painelLembretes || !btnLembretes) {
    return;
  }
  const abrir = painelLembretes.hidden;
  if (abrir) {
    fecharUserMenu();
    painelLembretes.hidden = false;
    btnLembretes.setAttribute("aria-expanded", "true");
    return;
  }
  fecharPainelLembretes();
}

function alternarUserMenu() {
  if (!userMenuPanel || !btnUserMenu) {
    return;
  }
  const abrir = userMenuPanel.hidden;
  if (abrir) {
    fecharPainelLembretes();
    userMenuPanel.hidden = false;
    btnUserMenu.setAttribute("aria-expanded", "true");
    return;
  }
  fecharUserMenu();
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
    if (tab === "gerencial") {
      carregarPainelGerencial(false);
    }
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

function fecharPainelPerfil() {
  setProfileEditParam(false);
  abrirPainelComCarregamento("inicio");
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
mostrarMensagemGerencial("Configuração atualizada.");
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
  const subestacoes = getSubestacoesBase();
  selects.forEach((select) => {
    const atual = select.value;
    select.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Selecione";
    select.append(placeholder);
    subestacoes.forEach((nome) => {
      const option = document.createElement("option");
      option.value = nome;
      option.textContent = nome;
      select.append(option);
    });
    if (atual && subestacoes.includes(atual)) {
      select.value = atual;
    } else if (!atual && subestacoes.length) {
      select.value = subestacoes[0];
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
    if (
      template &&
      obsManutencao &&
      !obsManutencao.value &&
      (!obsManutencaoHtml || !obsManutencaoHtml.value) &&
      (template.observacao || template.observacaoHtml)
    ) {
      setObsEditorContent({
        html: template.observacaoHtml || "",
        text: template.observacao || "",
      });
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
  const data = readJson(getProjectStorageKey(STORAGE_KEY), []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarManutencoes(lista) {
  const sanitized = Array.isArray(lista)
    ? lista.map((item) =>
        item && typeof item === "object" && activeProjectId
          ? { ...item, projectId: item.projectId || activeProjectId }
          : item
      )
    : [];
  writeJson(getProjectStorageKey(STORAGE_KEY), sanitized);
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
  const data = readJson(getProjectStorageKey(REQUEST_KEY), []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarSolicitacoes(lista) {
  writeJson(getProjectStorageKey(REQUEST_KEY), lista);
}

function carregarAuditoria() {
  const data = readJson(getProjectStorageKey(AUDIT_KEY), []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarAuditoria(lista) {
  writeJson(getProjectStorageKey(AUDIT_KEY), lista);
}

function carregarTemplates() {
  const data = readJson(getProjectStorageKey(TEMPLATE_KEY), []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarTemplates(lista) {
  writeJson(getProjectStorageKey(TEMPLATE_KEY), lista);
}

function carregarRdoSnapshots() {
  const data = readJson(getProjectStorageKey(RDO_KEY), []);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.filter((item) => item && typeof item === "object");
}

function salvarRdoSnapshots(lista) {
  writeJson(getProjectStorageKey(RDO_KEY), lista);
}

function garantirTemplatesPadrao() {
  if (templates.length > 0) {
    return;
  }
  if (!isDefaultProjectActive()) {
    return;
  }
  const hoje = formatDateISO(new Date());
  const subestacao = getSubestacoesBase()[0] || DEFAULT_PROJECT_LABEL;
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
    criarPadrao("Inspeção diária da subestação", { frequencia: "daily" }),
    criarPadrao("Inspeção mensal da subestação", { frequencia: "monthly", monthlyDay: 10 }),
    criarPadrao("Inspeção semanal do GMG BSO2", { frequencia: "weekly", weeklyDay: 3, weeklyInterval: 1 }),
    criarPadrao("Inspeção semanal dos GMG PCT4", { frequencia: "weekly", weeklyDay: 4, weeklyInterval: 1 }),
    criarPadrao("Inspeção mensal do GMG BSO2", { frequencia: "monthly", monthlyDay: 25 }),
    criarPadrao("Inspeção mensal dos GMG PCT4", { frequencia: "monthly", monthlyDay: 25 }),
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

function isDailySubstationInspection(item) {
  if (!item) {
    return false;
  }
  const template = item.templateId ? getTemplateById(item.templateId) : null;
  const nome = template && template.nome ? template.nome : item.titulo || "";
  const nomeNormalizado = normalizeSearchValue(nome);
  const tituloNormalizado = normalizeSearchValue(item.titulo || "");
  const isDaily =
    nomeNormalizado.includes("inspecao diaria") ||
    tituloNormalizado.includes("inspecao diaria");
  const isSubestacao =
    nomeNormalizado.includes("subestacao") ||
    tituloNormalizado.includes("subestacao");
  if (!isDaily || !isSubestacao) {
    return false;
  }
  const frequencia = template && template.frequencia ? String(template.frequencia).toLowerCase() : "";
  if (frequencia) {
    return frequencia === "daily";
  }
  return true;
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

function persistActiveProjectId(projectId) {
  if (!projectId) {
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
    return;
  }
  localStorage.setItem(ACTIVE_PROJECT_KEY, projectId);
}

function reloadProjectState() {
  templates = carregarTemplates();
  if (!isDefaultProjectActive() && shouldClearDefaultTemplates(templates)) {
    templates = [];
    salvarTemplates(templates);
  }
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
  gerarManutencoesRecorrentes();
  const resultado = normalizarManutencoes(manutencoes);
  manutencoes = resultado.normalizadas;
  salvarManutencoes(manutencoes);
  rdoSnapshots = carregarRdoSnapshots();
  carregarFeedbacks();
  montarRdoUI();
  renderRdoLocaisOptions();
  updateRdoShiftLabels();
  renderTudo();
}

async function setActiveProjectId(nextId, options = {}) {
  const trimmed = String(nextId || "").trim();
  if (!trimmed) {
    activeProjectId = "";
    persistActiveProjectId("");
    return;
  }
  if (activeProjectId === trimmed && !options.force) {
    return;
  }
  activeProjectId = trimmed;
  persistActiveProjectId(trimmed);
  if (options.sync !== false) {
    try {
      await apiProjetosSetActive(trimmed);
    } catch (error) {
      // noop: fallback local
    }
  }
  reloadProjectState();
  loadDashboardSummary(true);
  renderProjectSelector();
  renderProjectPanel();
  renderPmpModule();
  await carregarEquipeProjeto();
  await carregarEquipamentosProjeto();
  await carregarManutencoesServidor(true);
  await carregarPmpDados();
}

async function carregarSessaoServidor() {
  try {
    const data = await apiRequest("/api/auth/me");
    currentUser = data.user || null;
    availableProjects = Array.isArray(data.projects) ? data.projects : [];
    const storedProjectId = localStorage.getItem(ACTIVE_PROJECT_KEY) || "";
    const validStored = availableProjects.some((item) => item.id === storedProjectId);
    const resolvedProjectId =
      data.activeProjectId ||
      (validStored ? storedProjectId : availableProjects[0]?.id || "");
    if (resolvedProjectId) {
      await setActiveProjectId(resolvedProjectId, { sync: false, force: true });
    }
  } catch (error) {
    currentUser = null;
    availableProjects = [];
    activeProjectId = "";
  }
  await carregarUsuariosServidor();
  renderAuthUI();
  await refreshProjects();
  await carregarPmpDados();
  if (!currentUser) {
    renderProjectSelector();
    renderProjectPanel();
  }
  await handleEmailVerification();
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
  renderEquipeSelectOptions();
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
    return String(id);
  }
  return `${user.name} (${user.matricula})`;
}

function getProjectLabel(project) {
  if (!project) {
    return "";
  }
  return `${project.codigo || "-"} - ${project.nome || "-"}`;
}

const TAB_LABELS = {
  inicio: "In\u00edcio",
  programacao: "Programa\u00e7\u00e3o",
  nova: "Nova Manuten\u00e7\u00e3o",
  modelos: "Modelos e Recorr\u00eancias",
  pmp: "PMP / Cronograma",
  execucao: "Execu\u00e7\u00e3o do Dia",
  backlog: "Backlog",
  solicitacoes: "Solicita\u00e7\u00f5es Pendentes",
  projetos: "Locais de Trabalho",
  desempenho: "Desempenho Geral",
  "performance-projects": "Desempenho por Projeto",
  "performance-people": "Desempenho por Colaborador",
  tendencias: "KPIs e Tend\u00eancias",
  relatorios: "Relat\u00f3rios Gerenciais",
  feedbacks: "Feedbacks",
  rastreabilidade: "Hist\u00f3rico de Execu\u00e7\u00e3o",
  gerencial: "Configura\u00e7\u00f5es Gerais",
  contas: "Equipe / Usu\u00e1rios",
  perfil: "Meu Perfil",
};

function getActiveTabKey() {
  const activeBtn = Array.from(tabButtons || []).find(
    (botao) => botao.classList.contains("is-active") || botao.classList.contains("active")
  );
  if (activeBtn && activeBtn.dataset.tab) {
    return activeBtn.dataset.tab;
  }
  const activePanel = Array.from(panels || []).find((panel) =>
    panel.classList.contains("is-active")
  );
  return activePanel ? activePanel.dataset.panel : "inicio";
}

function getActiveTabLabel() {
  const activeBtn = Array.from(tabButtons || []).find(
    (botao) => botao.classList.contains("is-active") || botao.classList.contains("active")
  );
  if (activeBtn) {
    const labelEl = activeBtn.querySelector(".nav-item__label");
    const label = labelEl ? labelEl.textContent.trim() : "";
    if (label) {
      return label;
    }
    const tab = activeBtn.dataset.tab || "";
    return TAB_LABELS[tab] || tab || "In\u00edcio";
  }
  const tabKey = getActiveTabKey();
  return TAB_LABELS[tabKey] || "In\u00edcio";
}

function renderBreadcrumb() {
  if (!crumbs) {
    return;
  }
  const activeProject = getActiveProject();
  const projectLabel = activeProject ? getProjectLabel(activeProject) : "Projeto n\u00e3o definido";
  const moduleLabel = getActiveTabLabel();
  crumbs.innerHTML = `<span class=\"crumbs__label\">Projeto:</span> <span class=\"crumbs__project\">${escapeHtml(
    projectLabel
  )}</span> <span class=\"crumbs__sep\">&#8250;</span> <span class=\"crumbs__module\">${escapeHtml(
    moduleLabel
  )}</span>`;
}

const HELP_OVERVIEW = [
  "A OPSCOPE \u00e9 uma plataforma de gest\u00e3o operacional e manuten\u00e7\u00e3o que centraliza processos, evid\u00eancias e indicadores.",
  "Ela organiza a rotina entre planejamento, execu\u00e7\u00e3o, controle e relat\u00f3rios em um fluxo \u00fanico, com rastreabilidade e padroniza\u00e7\u00e3o.",
  "Fluxo principal: Planejamento -> Execu\u00e7\u00e3o -> Controle -> Relat\u00f3rios.",
];

const HELP_NAVIGATION = [
  "Use o menu lateral (sidebar) para alternar entre m\u00f3dulos.",
  "Troque o projeto ativo no seletor de projetos antes de iniciar qualquer a\u00e7\u00e3o.",
  "O breadcrumb mostra Projeto e M\u00f3dulo atuais; utilize-o para se orientar.",
  "Notifica\u00e7\u00f5es destacam prazos e pend\u00eancias; mensagens concentram feedbacks.",
  "Filtros e buscas refinam listas por status, per\u00edodo, prioridade e equipe.",
];

const HELP_BEST_PRACTICES = [
  "Padronize nomes, descri\u00e7\u00f5es e categorias para facilitar auditoria.",
  "Registre evid\u00eancias completas antes de concluir uma execu\u00e7\u00e3o.",
  "Mantenha os status atualizados para refletir a realidade operacional.",
  "Revise o projeto ativo antes de salvar altera\u00e7\u00f5es.",
  "Utilize checklists para garantir conformidade e seguran\u00e7a.",
];

const HELP_GLOSSARY = [
  { term: "OS", desc: "Ordem de Servi\u00e7o vinculada \u00e0 execu\u00e7\u00e3o." },
  { term: "RDO", desc: "Relat\u00f3rio Di\u00e1rio de Opera\u00e7\u00e3o." },
  { term: "PMP", desc: "Plano de Manuten\u00e7\u00e3o Preventiva." },
  { term: "SLA", desc: "N\u00edvel de servi\u00e7o acordado." },
  { term: "Backlog", desc: "Fila de atividades pendentes." },
  { term: "KPI", desc: "Indicador-chave de desempenho." },
  { term: "Conforme", desc: "Atividade executada dentro do padr\u00e3o esperado." },
  { term: "N\u00e3o conforme", desc: "Atividade com desvios ou pend\u00eancias relevantes." },
];

const HELP_EXAMPLES = [
  "Execu\u00e7\u00e3o de manuten\u00e7\u00e3o com checklist e evid\u00eancias anexadas.",
  "Preenchimento do RDO di\u00e1rio com jornada, clima e ocorr\u00eancias.",
  "Uso do PMP para programar atividades preventivas ao longo do ano.",
  "Gera\u00e7\u00e3o de relat\u00f3rios com exporta\u00e7\u00e3o em PDF ou Excel.",
];

const HELP_SUPPORT = [
  "Consulte a base interna de conhecimento da opera\u00e7\u00e3o.",
  "Acione o PCM/O&M respons\u00e1vel pelo projeto para d\u00favidas operacionais.",
  "Registre chamados na Central de Suporte OPSCOPE quando necess\u00e1rio.",
];

const HELP_MODULES = {
  inicio: {
    purpose: "Centraliza indicadores, alertas e atalhos do projeto ativo.",
    when: "Use no in\u00edcio do dia para revisar prioridades e pend\u00eancias.",
    examples: [
      "Abrir Execu\u00e7\u00e3o do Dia a partir dos alertas.",
      "Identificar pend\u00eancias cr\u00edticas antes de iniciar a rotina.",
    ],
  },
  programacao: {
    purpose: "Organiza a agenda de manuten\u00e7\u00f5es e libera\u00e7\u00f5es.",
    when: "Use para planejar datas, recursos e acompanhar status.",
    examples: [
      "Reprogramar uma atividade atrasada com novo prazo.",
      "Registrar observa\u00e7\u00e3o operacional antes da execu\u00e7\u00e3o.",
    ],
  },
  nova: {
    purpose: "Registra novas manuten\u00e7\u00f5es e tarefas operacionais.",
    when: "Use sempre que uma nova OS precisar ser criada.",
    examples: [
      "Criar uma nova OS com prioridade e categoria.",
      "Vincular equipamentos e participantes antes de salvar.",
    ],
  },
  modelos: {
    purpose: "Padroniza modelos e recorr\u00eancias de manuten\u00e7\u00e3o.",
    when: "Use para manter modelos consistentes e repet\u00edveis.",
    examples: [
      "Criar um modelo mensal para inspe\u00e7\u00f5es preventivas.",
      "Ativar ou revisar recorr\u00eancias vigentes.",
    ],
  },
  pmp: {
    purpose: "Organiza o Plano de Manuten\u00e7\u00e3o Preventiva (PMP).",
    when: "Use para programar atividades preventivas no calend\u00e1rio.",
    examples: [
      "Importar manuten\u00e7\u00f5es existentes para o PMP.",
      "Ajustar frequ\u00eancia e respons\u00e1veis.",
    ],
  },
  execucao: {
    purpose: "Registra e acompanha execu\u00e7\u00f5es do dia.",
    when: "Use durante a opera\u00e7\u00e3o para registrar in\u00edcio, fim e evid\u00eancias.",
    examples: [
      "Iniciar uma execu\u00e7\u00e3o e anexar evid\u00eancias.",
      "Encerrar atividade com OS e descri\u00e7\u00e3o t\u00e9cnica.",
    ],
  },
  backlog: {
    purpose: "Controla atividades pendentes e atrasadas.",
    when: "Use para justificar pend\u00eancias e reprogramar prazos.",
    examples: [
      "Registrar motivo de backlog por indisponibilidade.",
      "Priorizar atividades cr\u00edticas para a pr\u00f3xima semana.",
    ],
  },
  solicitacoes: {
    purpose: "Gerencia solicita\u00e7\u00f5es de acesso e aprova\u00e7\u00f5es.",
    when: "Use para aprovar ou recusar solicita\u00e7\u00f5es pendentes.",
    examples: [
      "Aprovar solicita\u00e7\u00e3o com justificativa registrada.",
      "Recusar solicita\u00e7\u00e3o com motivo claro.",
    ],
  },
};

Object.assign(HELP_MODULES, {
  projetos: {
    purpose: "Administra projetos, locais, equipes e equipamentos.",
    when: "Use quando for necess\u00e1rio ajustar dados do projeto.",
    examples: [
      "Cadastrar novos locais de trabalho.",
      "Atualizar informa\u00e7\u00f5es de equipamentos.",
    ],
  },
  desempenho: {
    purpose: "Apresenta indicadores de desempenho consolidados.",
    when: "Use para acompanhar resultados do projeto.",
    examples: [
      "Comparar KPI do m\u00eas atual com per\u00edodo anterior.",
      "Identificar aumento de backlog.",
    ],
  },
  "performance-projects": {
    purpose: "Compara desempenho entre projetos.",
    when: "Use para analisar SLA e criticidade por contrato.",
    examples: ["Comparar dois projetos e identificar desvios."],
  },
  "performance-people": {
    purpose: "Analisa desempenho por colaborador.",
    when: "Use para balancear carga e identificar gargalos.",
    examples: ["Revisar ranking de colaboradores por execu\u00e7\u00e3o."],
  },
  tendencias: {
    purpose: "Exibe KPIs e tend\u00eancias de longo prazo.",
    when: "Use para avaliar padr\u00f5es e riscos operacionais.",
    examples: ["Avaliar tend\u00eancia trimestral de SLA."],
  },
  relatorios: {
    purpose: "Gera relat\u00f3rios operacionais e gerenciais.",
    when: "Use para consolidar resultados e exportar dados.",
    examples: [
      "Gerar relat\u00f3rio mensal e exportar PDF.",
      "Emitir RDO mensal para o cliente.",
    ],
  },
  feedbacks: {
    purpose: "Centraliza feedbacks operacionais.",
    when: "Use para registrar feedbacks e acompanhar retornos.",
    examples: ["Enviar feedback ap\u00f3s execu\u00e7\u00e3o conclu\u00edda."],
  },
  rastreabilidade: {
    purpose: "Permite auditar hist\u00f3rico de execu\u00e7\u00f5es.",
    when: "Use para consultar registros e evid\u00eancias.",
    examples: ["Buscar uma OS e verificar status e evid\u00eancias."],
  },
  gerencial: {
    purpose: "Re\u00fane configura\u00e7\u00f5es e diagn\u00f3sticos do sistema.",
    when: "Use para governan\u00e7a e ajustes globais.",
    examples: ["Revisar logs e permiss\u00f5es quando autorizado."],
  },
  contas: {
    purpose: "Gerencia contas, equipes e permiss\u00f5es.",
    when: "Use para administrar usu\u00e1rios e perfis.",
    examples: ["Inativar usu\u00e1rio e ajustar cargo."],
  },
  perfil: {
    purpose: "Exibe e permite ajustar informa\u00e7\u00f5es do perfil.",
    when: "Use para atualizar dados pessoais quando permitido.",
    examples: ["Atualizar telefone e confirmar altera\u00e7\u00f5es."],
  },
});

const HELP_MODULE_ACTIONS = {
  inicio: [
    { label: "Visualizar indicadores e alertas do projeto ativo.", allow: () => true },
    { label: "Acessar atalhos para m\u00f3dulos operacionais.", allow: () => true },
  ],
  programacao: [
    { label: "Visualizar agenda e filtros operacionais.", allow: () => true },
    { label: "Reprogramar prazos e janelas de execu\u00e7\u00e3o.", allow: () => can("reschedule") },
    { label: "Editar observa\u00e7\u00f5es e dados de manuten\u00e7\u00e3o.", allow: () => can("edit") },
    { label: "Liberar ou registrar execu\u00e7\u00f5es.", allow: () => can("complete") },
    { label: "Remover registros quando autorizado.", allow: () => can("remove") },
  ],
  nova: [
    { label: "Criar manuten\u00e7\u00f5es e definir prioridades.", allow: () => can("create") },
    { label: "Anexar evid\u00eancias, documentos e checklists.", allow: () => can("create") },
    { label: "Visualizar par\u00e2metros do projeto ativo.", allow: () => true },
  ],
  modelos: [
    { label: "Visualizar modelos e recorr\u00eancias.", allow: () => true },
    { label: "Criar ou editar modelos conforme permiss\u00e3o.", allow: () => can("create") || can("edit") },
    { label: "Ativar ou desativar modelos.", allow: () => can("edit") },
  ],
  pmp: [
    { label: "Visualizar o cronograma PMP.", allow: () => true },
    { label: "Cadastrar e editar atividades PMP.", allow: () => canManagePmpActivities(currentUser) },
    { label: "Anexar procedimentos e documentos PMP.", allow: () => canUploadPmpProcedimento(currentUser) },
    { label: "Exportar o plano PMP quando permitido.", allow: () => canManagePmpActivities(currentUser) },
  ],
  execucao: [
    { label: "Registrar in\u00edcio e t\u00e9rmino das execu\u00e7\u00f5es.", allow: () => can("complete") },
    { label: "Anexar evid\u00eancias e concluir atividades.", allow: () => can("complete") },
    { label: "Visualizar pend\u00eancias do dia.", allow: () => true },
  ],
  backlog: [
    { label: "Visualizar atividades pendentes e prioriza\u00e7\u00f5es.", allow: () => true },
    { label: "Registrar motivo de backlog.", allow: () => can("edit") },
    { label: "Reprogramar datas e recursos.", allow: () => can("reschedule") },
  ],
  solicitacoes: [
    { label: "Visualizar solicita\u00e7\u00f5es pendentes.", allow: () => true },
    { label: "Aprovar ou recusar solicita\u00e7\u00f5es.", allow: () => can("edit") || isAdmin() },
  ],
};

Object.assign(HELP_MODULE_ACTIONS, {
  projetos: [
    { label: "Visualizar dados do projeto ativo.", allow: () => true },
    { label: "Gerenciar projetos e contratos.", allow: () => canManageProjetos(currentUser) },
    { label: "Gerenciar equipamentos e tags.", allow: () => canManageEquipamentos(currentUser) },
    { label: "Gerenciar equipe do projeto.", allow: () => canManageEquipeProjeto(currentUser) },
  ],
  desempenho: [{ label: "Visualizar indicadores consolidados.", allow: () => true }],
  "performance-projects": [{ label: "Comparar desempenho entre projetos.", allow: () => true }],
  "performance-people": [{ label: "Comparar desempenho por colaborador.", allow: () => true }],
  tendencias: [{ label: "Analisar tend\u00eancias e KPIs.", allow: () => true }],
  relatorios: [
    { label: "Visualizar relat\u00f3rios gerenciais.", allow: () => canViewRelatorios(currentUser) },
    { label: "Exportar relat\u00f3rios em PDF ou Excel.", allow: () => canExportRelatorios(currentUser) },
  ],
  feedbacks: [{ label: "Enviar e acompanhar feedbacks.", allow: () => true }],
  rastreabilidade: [
    { label: "Consultar hist\u00f3rico e auditoria de execu\u00e7\u00f5es.", allow: () => true },
  ],
  gerencial: [
    { label: "Acessar configura\u00e7\u00f5es gerais do sistema.", allow: () => canViewGerencial(currentUser) },
    { label: "Revisar diagn\u00f3sticos e logs (quando permitido).", allow: () =>
        canAccessGerencialTab("diagnostico", currentUser) || canAccessGerencialTab("logs", currentUser) },
    { label: "Gerenciar permiss\u00f5es e perfis.", allow: () => canAccessGerencialTab("permissoes", currentUser) },
    { label: "Administrar arquivos e automa\u00e7\u00f5es.", allow: () =>
        canAccessGerencialTab("arquivos", currentUser) || canAccessGerencialTab("automacoes", currentUser) },
  ],
  contas: [
    { label: "Visualizar contas e equipes.", allow: () => true },
    { label: "Cadastrar e editar usu\u00e1rios.", allow: () => canViewUsuarios(currentUser) && isAdmin() },
  ],
  perfil: [
    { label: "Visualizar dados do perfil.", allow: () => true },
    { label: "Editar informa\u00e7\u00f5es pessoais quando permitido.", allow: () =>
        Boolean(currentUser && canEditProfile(currentUser, currentUser)) },
  ],
});

function getHelpRoleKey(user) {
  if (!user) {
    return "tecnico";
  }
  const cargo = normalizeCargo(user.cargo);
  const role = String(user.role || user.rbacRole || "").trim().toLowerCase();
  if (cargo.includes("admin") || role === "admin" || role === "administrator") {
    return "administrador";
  }
  if (cargo.includes("gerente") || cargo.includes("coordenador") || cargo.includes("diretor") || role.includes("gerente")) {
    return "gerente";
  }
  if (cargo.includes("supervisor") || role.includes("supervisor")) {
    return "supervisor";
  }
  if (cargo.includes("tecnico") || role.includes("tecnico") || role.includes("executor")) {
    return "tecnico";
  }
  return "tecnico";
}

function getHelpRoleLabel(roleKey) {
  const labels = {
    tecnico: "T\u00e9cnico",
    supervisor: "Supervisor",
    gerente: "Gerente / Coordenador",
    administrador: "Administrador",
  };
  return labels[roleKey] || "T\u00e9cnico";
}

function getRoleHelpData(roleKey, user) {
  const canRdoGenerate = Boolean(user && canGerarRelatorio(user));
  const canRel = Boolean(user && canViewRelatorios(user));
  const canExport = Boolean(user && canExportRelatorios(user));
  const baseTechCan = [
    "Executar e registrar manuten\u00e7\u00f5es do projeto ativo.",
    "Preencher checklists e registrar evid\u00eancias (fotos e documentos).",
    "Atualizar status das atividades (Agendada, Executada, Conforme, Atrasada).",
    "Finalizar atividades com OS e descri\u00e7\u00e3o t\u00e9cnica.",
  ];
  if (canRdoGenerate) {
    baseTechCan.push("Preencher o RDO di\u00e1rio com registros da opera\u00e7\u00e3o.");
  }

  const baseTechHow = [
    "Siga os procedimentos aprovados antes de iniciar a execu\u00e7\u00e3o.",
    "Registre in\u00edcio e fim das atividades conforme o padr\u00e3o.",
    "Anexe evid\u00eancias obrigat\u00f3rias e confirme o checklist.",
  ];
  if (canRdoGenerate) {
    baseTechHow.push("Preencha o RDO di\u00e1rio com jornada, clima e ocorr\u00eancias.");
  }

  const baseTechRestrictions = [
    "Configura\u00e7\u00f5es de usu\u00e1rios, permiss\u00f5es e par\u00e2metros globais.",
    "Edi\u00e7\u00e3o de projetos, equipes e templates (restrito \u00e0 gest\u00e3o).",
  ];

  const baseTechPractices = [
    "Mantenha evid\u00eancias organizadas e completas.",
    "Registre observa\u00e7\u00f5es t\u00e9cnicas em caso de exce\u00e7\u00f5es.",
    "N\u00e3o finalize atividades sem OS e valida\u00e7\u00e3o.",
  ];

  if (roleKey === "supervisor") {
    const supervisorExtras = [
      "Revisar execu\u00e7\u00f5es e validar evid\u00eancias da equipe.",
      "Controlar backlog e priorizar atividades cr\u00edticas.",
      "Acompanhar equipe e distribuir carga de trabalho.",
      "Garantir cumprimento do PMP e prazos contratuais.",
    ];
    const atrasoActions = [
      "Registrar motivo do atraso e reprogramar prazo.",
      "Comunicar riscos ao gestor e ajustar recursos.",
      "Priorizar atividades com impacto em SLA.",
    ];
    return {
      title: "Supervisor",
      intro: "Perfil respons\u00e1vel por execu\u00e7\u00e3o e valida\u00e7\u00e3o da equipe.",
      sections: [
        { title: "O que voc\u00ea pode fazer", items: baseTechCan.concat(supervisorExtras) },
        { title: "Como atuar no dia a dia", items: baseTechHow },
        { title: "A\u00e7\u00f5es em atraso ou n\u00e3o conformidade", items: atrasoActions },
        { title: "Boas pr\u00e1ticas operacionais", items: baseTechPractices },
      ],
    };
  }

  if (roleKey === "gerente") {
    const managerIndicators = [
      "Interpretar KPIs, tend\u00eancias e SLA do projeto.",
      "Comparar desempenho entre projetos e colaboradores.",
      "Identificar desvios e definir planos de a\u00e7\u00e3o.",
    ];
    const managerReports = [
      "Gerar relat\u00f3rios gerenciais para tomada de decis\u00e3o.",
      "Emitir RDO di\u00e1rio e RDO mensal quando permitido.",
      "Exportar dados para auditoria e contratos.",
    ].filter((item) => {
      if (item.includes("RDO") && !canRdoGenerate) {
        return false;
      }
      if (item.includes("Exportar") && !canExport) {
        return false;
      }
      if (item.includes("relat\u00f3rios") && !canRel) {
        return false;
      }
      return true;
    });
    return {
      title: "Gerente / Coordenador",
      intro: "Perfil focado em gest\u00e3o, an\u00e1lise de desempenho e relat\u00f3rios.",
      sections: [
        { title: "Indicadores e an\u00e1lise", items: managerIndicators },
        { title: "Relat\u00f3rios e consolida\u00e7\u00e3o", items: managerReports },
        { title: "Boas pr\u00e1ticas de gest\u00e3o", items: [
          "Defina metas claras e acompanhe desvios semanalmente.",
          "Garanta alinhamento entre planejamento e execu\u00e7\u00e3o.",
          "Use dados para orientar ajustes de equipe e contrato.",
        ] },
      ],
    };
  }

  if (roleKey === "administrador") {
    return {
      title: "Administrador",
      intro: "Perfil respons\u00e1vel por configura\u00e7\u00e3o, governan\u00e7a e seguran\u00e7a da OPSCOPE.",
      sections: [
        { title: "Configura\u00e7\u00f5es do sistema", items: [
          "Cadastrar e gerenciar usu\u00e1rios e perfis.",
          "Definir permiss\u00f5es e acessos por cargo.",
          "Administrar projetos, equipes e equipamentos.",
          "Configurar templates, padr\u00f5es e PMP.",
        ] },
        { title: "Boas pr\u00e1ticas de governan\u00e7a", items: [
          "Revisar permiss\u00f5es periodicamente.",
          "Padronizar cadastros para evitar inconsist\u00eancias.",
          "Auditar logs e registros sens\u00edveis.",
        ] },
      ],
    };
  }

  return {
    title: "T\u00e9cnico",
    intro: "Perfil focado na execu\u00e7\u00e3o das atividades de manuten\u00e7\u00e3o.",
    sections: [
      { title: "O que voc\u00ea pode fazer", items: baseTechCan },
      { title: "Como executar as atividades", items: baseTechHow },
      { title: "O que n\u00e3o pode acessar", items: baseTechRestrictions },
      { title: "Boas pr\u00e1ticas operacionais", items: baseTechPractices },
    ],
  };
}

function buildHelpList(items = []) {
  if (!items.length) {
    return "<p class=\"help-empty\">Conte\u00fado indispon\u00edvel para este perfil.</p>";
  }
  return `<ul class=\"help-list\">${items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("")}</ul>`;
}

function buildHelpGlossary(items = []) {
  if (!items.length) {
    return "";
  }
  return `<dl class=\"help-glossary\">${items
    .map(
      (item) =>
        `<div class=\"help-glossary__item\"><dt>${escapeHtml(
          item.term
        )}</dt><dd>${escapeHtml(item.desc)}</dd></div>`
    )
    .join("")}</dl>`;
}

function buildHelpParagraphs(paragraphs = []) {
  return paragraphs
    .map((item) => `<p class=\"help-section__text\">${escapeHtml(item)}</p>`)
    .join("");
}

function buildHelpSubsections(sections = []) {
  return sections
    .map(
      (section) => `
        <div class="help-subsection">
          <h5>${escapeHtml(section.title)}</h5>
          ${buildHelpList(section.items)}
        </div>
      `
    )
    .join("");
}

function getModuleHelpData(moduleKey, moduleLabel) {
  const fallback = {
    purpose: `Conte\u00fado de apoio para o m\u00f3dulo ${moduleLabel || "atual"}.`,
    when: "Utilize conforme a rotina operacional do projeto.",
    examples: ["Revise filtros e indicadores antes de confirmar a\u00e7\u00f5es."],
  };
  return HELP_MODULES[moduleKey] || fallback;
}

function getModuleActions(moduleKey) {
  const entries = HELP_MODULE_ACTIONS[moduleKey] || [];
  const allowed = entries.filter((item) => {
    try {
      return item.allow();
    } catch (error) {
      return false;
    }
  });
  if (!allowed.length) {
    return ["Somente visualiza\u00e7\u00e3o conforme permiss\u00e3o."];
  }
  return allowed.map((item) => item.label);
}

function renderHelpModal() {
  if (!modalHelp || !helpContent || !helpTitle || !helpMeta) {
    return;
  }
  const activeProject = getActiveProject();
  const projectLabel = activeProject ? getProjectLabel(activeProject) : "Projeto n\u00e3o definido";
  const moduleKey = getActiveTabKey();
  const moduleLabel = getActiveTabLabel();
  const roleKey = getHelpRoleKey(currentUser);
  const roleData = getRoleHelpData(roleKey, currentUser);
  const cargoLabel = currentUser && String(currentUser.cargo || "").trim();
  const profileLabel = cargoLabel || getHelpRoleLabel(roleKey);
  const moduleHelp = getModuleHelpData(moduleKey, moduleLabel);
  const moduleActions = getModuleActions(moduleKey);

  helpTitle.textContent = "Ajuda / Como usar a OPSCOPE";
  helpMeta.textContent = `M\u00f3dulo: ${moduleLabel} \u00b7 Projeto: ${projectLabel} \u00b7 Perfil: ${profileLabel}`;

  helpContent.innerHTML = `
    <div class="help-intro">
      <strong>Ajuda / Como usar a OPSCOPE</strong>
      <p>Documenta\u00e7\u00e3o operacional contextual ao m\u00f3dulo, projeto e perfil.</p>
    </div>
    <section class="help-section">
      <h4 class="help-section__title">Vis\u00e3o Geral da OPSCOPE</h4>
      ${buildHelpParagraphs(HELP_OVERVIEW)}
    </section>
    <section class="help-section">
      <h4 class="help-section__title">Navega\u00e7\u00e3o na Plataforma</h4>
      ${buildHelpList(HELP_NAVIGATION)}
    </section>
    <section class="help-section">
      <h4 class="help-section__title">Como usar o M\u00f3dulo Atual</h4>
      <div class="help-subsection">
        <h5>Para que serve</h5>
        <p class="help-section__text">${escapeHtml(moduleHelp.purpose)}</p>
      </div>
      <div class="help-subsection">
        <h5>Quando usar</h5>
        <p class="help-section__text">${escapeHtml(moduleHelp.when)}</p>
        <p class="help-section__text">As a\u00e7\u00f5es abaixo aplicam-se ao projeto ativo: ${escapeHtml(
          projectLabel
        )}.</p>
      </div>
      <div class="help-subsection">
        <h5>O que voc\u00ea pode fazer</h5>
        ${buildHelpList(moduleActions)}
      </div>
      <div class="help-subsection">
        <h5>Exemplos pr\u00e1ticos no m\u00f3dulo</h5>
        ${buildHelpList(moduleHelp.examples)}
      </div>
    </section>
    <section class="help-section">
      <h4 class="help-section__title">Se\u00e7\u00e3o por Cargo: ${escapeHtml(roleData.title)}</h4>
      <p class="help-section__text">${escapeHtml(roleData.intro)}</p>
      ${buildHelpSubsections(roleData.sections)}
    </section>
    <section class="help-section">
      <h4 class="help-section__title">Boas Pr\u00e1ticas Gerais</h4>
      ${buildHelpList(HELP_BEST_PRACTICES)}
    </section>
    <section class="help-section">
      <h4 class="help-section__title">Gloss\u00e1rio de Termos</h4>
      ${buildHelpGlossary(HELP_GLOSSARY)}
    </section>
    <section class="help-section">
      <h4 class="help-section__title">Exemplos Pr\u00e1ticos</h4>
      ${buildHelpList(HELP_EXAMPLES)}
    </section>
    <section class="help-section">
      <h4 class="help-section__title">Suporte</h4>
      ${buildHelpList(HELP_SUPPORT)}
    </section>
  `;
}

function openHelpModal() {
  if (!modalHelp) {
    return;
  }
  renderHelpModal();
  modalHelp.hidden = false;
}

function closeHelpModal() {
  if (!modalHelp) {
    return;
  }
  modalHelp.hidden = true;
}

function getActiveProjectClient() {
  const project = getActiveProject();
  const cliente = project && project.cliente ? String(project.cliente).trim() : "";
  return cliente || RDO_CLIENTE;
}

function isDefaultProjectActive() {
  const project = getActiveProject();
  return project && String(project.codigo || "").trim() === DEFAULT_PROJECT_CODE;
}

function normalizeLocaisList(value) {
  if (!value) {
    return [];
  }
  let items = [];
  if (Array.isArray(value)) {
    items = value;
  } else if (typeof value === "string") {
    items = value.split(/[\n,;]+/g);
  } else {
    return [];
  }
  const normalized = items
    .map((item) => String(item || "").trim())
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

function parseProjectLocaisInput(value) {
  return normalizeLocaisList(value);
}

function getActiveProjectLocais() {
  const project = getActiveProject();
  const locais = project && Array.isArray(project.locais) ? project.locais : [];
  if (!locais.length && isDefaultProjectActive()) {
    return DEFAULT_PROJECT_LOCAIS.slice();
  }
  return normalizeLocaisList(locais);
}

function getDefaultRdoLocal() {
  const locais = getActiveProjectLocais();
  return locais.length ? locais[0] : "";
}

function getActiveProjectShortLabel() {
  const project = getActiveProject();
  if (!project) {
    return "projeto";
  }
  const codigo = String(project.codigo || "").trim();
  const nome = String(project.nome || "").trim();
  if (codigo) {
    return `projeto ${codigo}`;
  }
  if (nome) {
    return `projeto ${nome}`;
  }
  return "projeto";
}

function getSubestacoesBase() {
  const project = getActiveProject();
  return project ? [getProjectLabel(project)] : [];
}

function isDefaultSeedTemplate(template) {
  if (!template || typeof template !== "object") {
    return false;
  }
  return template.createdBy === SYSTEM_USER_ID && DEFAULT_TEMPLATE_NAMES.has(template.nome);
}

function shouldClearDefaultTemplates(list) {
  return Array.isArray(list) && list.length > 0 && list.every(isDefaultSeedTemplate);
}

function getUserProjectLabel(user) {
  if (!user) {
    return "-";
  }
  const projectId = user.projectId || "";
  if (projectId && Array.isArray(availableProjects)) {
    const project = availableProjects.find((item) => item.id === projectId);
    if (project) {
      return getProjectLabel(project);
    }
  }
  return user.projeto || user.localizacao || "-";
}

function renderProjectSelectOptions(select, selectedId) {
  if (!select) {
    return;
  }
  const baseOption = document.createElement("option");
  baseOption.value = "";
  baseOption.textContent = "Selecione";
  select.innerHTML = "";
  select.append(baseOption);
  if (Array.isArray(availableProjects)) {
    availableProjects.forEach((project) => {
      const opt = document.createElement("option");
      opt.value = project.id;
      opt.textContent = getProjectLabel(project);
      select.append(opt);
    });
  }
  select.disabled = !availableProjects.length;
  if (selectedId) {
    select.value = selectedId;
  }
}

function isAdmin() {
  return Boolean(currentUser && isFullAccessUser(currentUser));
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
    mostrarMensagemManutencao("Faça login para executar esta ação.", true);
    return false;
  }
  if (!can(action)) {
    mostrarMensagemManutencao("Você não tem permissão para esta ação.", true);
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
    const projectId = activeProjectId || item.projectId || "";
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
        projectId: item.projectId || projectId,
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
      projectId: item.projectId || projectId,
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
  const critico = isCriticoValor(liberacao.critico);
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
  if (critico && participantes.length < 2) {
    return false;
  }
  const documentos = liberacao.documentos || {};
  if (!documentos.apr || !documentos.os || !documentos.pte) {
    return false;
  }
  if (critico && !documentos.pt) {
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

async function uploadLiberacaoDoc(file, docType) {
  if (!file) {
    return null;
  }
  const formData = new FormData();
  formData.append("type", docType || "");
  formData.append("file", file);
  const data = await apiUploadLiberacaoDoc(formData);
  const info = data && data.file ? data.file : null;
  if (!info || !info.url) {
    throw new Error("Falha ao enviar o documento.");
  }
  const name = info.originalName || info.name || file.name || "Documento";
  return {
    id: info.id || "",
    url: info.url,
    name,
    nome: name,
    mime: info.mime || file.type || "",
    docType: info.docType || docType || "",
  };
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

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url || "");
}

function resolvePublicUrl(url) {
  if (!url) {
    return "";
  }
  if (isAbsoluteUrl(url) || url.startsWith("data:")) {
    return url;
  }
  const base = API_BASE ? API_BASE.replace(/\/$/, "") : window.location.origin;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
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
  if (dataUrl && dataUrl.startsWith("data:")) {
    openInNewTab(dataUrl);
    return;
  }
  if (doc.docId) {
    const registro = await getDocById(doc.docId);
    if (registro && registro.blob) {
      const blobUrl = URL.createObjectURL(registro.blob);
      openInNewTab(blobUrl);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      return;
    }
    window.alert("Documento não encontrado.");
    return;
  }
  const url = resolvePublicUrl(doc.url || "");
  if (!url) {
    window.alert("Documento não encontrado.");
    return;
  }
  openInNewTab(url);
}

function renderDocList(container, documentos, critico = false) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  const docs = documentos || {};
  const criticoAtual = isCriticoValor(critico);
  let exibiu = false;
  DOC_KEYS.forEach((key) => {
    if (key === "pt" && !criticoAtual) {
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
      `Alerta: motivo Outros usado ${count}x neste mês. Revisar governança.`;
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
  if (badgeBacklog) {
    badgeBacklog.textContent = contagem.backlog;
  }
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

function getMaintenanceState(item, data, hoje) {
  if (!item) {
    return "planned";
  }
  const status = String(item.status || "").trim().toLowerCase();
  if (status === "concluida" || status === "cancelada") {
    return "planned";
  }
  if (data && data.getTime() === hoje.getTime()) {
    return "released";
  }
  if (data && data < hoje) {
    return "overdue";
  }
  return "planned";
}

function renderHome() {
  loadDashboardSummary();
  renderDashboardHome();
}

function renderDashboardHome() {
  if (!dashboardHome) {
    return;
  }
  if (currentUser && !activeProjectId) {
    dashboardHome.innerHTML = `<p class="dashboard-message">Selecione um projeto ativo.</p>`;
    return;
  }
  if (!dashboardSummary) {
    const mensagem = dashboardError || "Carregando indicadores...";
    dashboardHome.innerHTML = `<p class="dashboard-message">${mensagem}</p>`;
    return;
  }
  const { kpis, saudeOperacional, graficoEficiencia, proximasAtividades } =
    dashboardSummary;

  const renderKpiCard = (label, value) =>
    `<article class="kpi-card"><span>${label}</span><strong>${value}</strong></article>`;

  const atrasoMedioPct = Math.round((Number(saudeOperacional.atrasoMedioDias) || 0) * 100);
  const pieValues = [
    Number(saudeOperacional.pontualidadePct) || 0,
    Number(saudeOperacional.backlogTotal) || 0,
    Number(saudeOperacional.concluidasPeriodo) || 0,
    atrasoMedioPct,
  ];
  const pieLabels = ["Pontualidade", "Backlog", "Concluídas", "Atraso médio"];
  const pieDisplay = [
    `${saudeOperacional.pontualidadePct}%`,
    String(saudeOperacional.backlogTotal),
    String(saudeOperacional.concluidasPeriodo),
    `${atrasoMedioPct}%`,
  ];
  const chart = buildNeonPieChart(pieValues, pieLabels, pieDisplay);

  const today = startOfDay(new Date());
  const sortedAtividades = Array.isArray(proximasAtividades)
    ? proximasAtividades
        .map((item) => {
          const parsed = parseTimestamp(item.prazo);
          const date = parsed ? startOfDay(parsed) : null;
          let bucket = 1;
          if (date && date.getTime() === today.getTime()) {
            bucket = 0;
          } else if (date && date < today) {
            bucket = 2;
          }
          return { ...item, _bucket: bucket, _date: date };
        })
        .sort((a, b) => {
          if (a._bucket !== b._bucket) {
            return a._bucket - b._bucket;
          }
          const at = a._date ? a._date.getTime() : Number.MAX_SAFE_INTEGER;
          const bt = b._date ? b._date.getTime() : Number.MAX_SAFE_INTEGER;
          return at - bt;
        })
    : [];

  const rows = sortedAtividades
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
  const updatedAt = dashboardSummary.generatedAt
    ? formatDateTime(parseTimestamp(dashboardSummary.generatedAt) || new Date())
    : formatDateTime(new Date());

  dashboardHome.innerHTML = `
    <div class="home-shell">
      <div class="home-header">
        <div class="home-header__title">
          <h2>Centro de controle operacional</h2>
          <p class="hint">Visão tático-operacional com indicadores críticos e foco no dia.</p>
        </div>
        <div class="home-header__meta">
          <span class="hint">${updatedAt}</span>
        </div>
      </div>

      <section class="home-section">
        <h3 class="home-section__title">Indicadores do dia</h3>
        <div class="kpi-grid">
          ${renderKpiCard("VENCE HOJE", kpis.venceHoje)}
          ${renderKpiCard("ATRASADAS", kpis.atrasadas)}
          ${renderKpiCard("CRÍTICAS", kpis.criticas)}
          ${renderKpiCard("RISCO IMEDIATO", kpis.riscoImediato)}
        </div>
      </section>

      <section class="home-section">
        <h3 class="home-section__title">Suporte e saúde</h3>
        <div class="dashboard-row">
          <article class="card panel-card">
            <div class="panel-head">
              <h3>DICAS OPSCOPE</h3>
            </div>
            <div class="opscope-tips" id="opscopeTips">
              <p class="opscope-tip" data-tip></p>
            </div>
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
                <span>Concluídas</span>
                <strong>${saudeOperacional.concluidasPeriodo}</strong>
              </div>
              <div class="health-item">
                <span>Atraso médio</span>
                <strong>${saudeOperacional.atrasoMedioDias}d</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="home-section">
        <h3 class="home-section__title">Performance e previsão</h3>
        <div class="dashboard-row">
          <article class="card panel-card">
            <div class="panel-head">
              <h3>EFICIÊNCIA OPERACIONAL</h3>
              <span class="trend-tag">+8%</span>
            </div>
            <div class="mini-chart neon-pie" data-tooltip="Distribuição operacional em pizza: Pontualidade mostra o percentual de entregas no prazo; Backlog indica tarefas pendentes; Concluídas mostra o volume finalizado no período; Atraso médio reflete o desvio médio em dias. Passe o mouse para revisar estes indicadores.">
              <div class="neon-tooltip">
                Distribuição operacional em pizza: Pontualidade mostra o percentual de entregas no prazo; Backlog indica tarefas pendentes; Concluídas mostra o volume finalizado no período; Atraso médio reflete o desvio médio em dias.
              </div>
              ${chart}
              <div class="pie-legend">
                <div class="pie-legend__item">
                  <span class="pie-legend__dot pie-legend__dot--green"></span>
                  <div>
                    <strong>Pontualidade</strong>
                    <span>Percentual de entregas no prazo.</span>
                  </div>
                </div>
                <div class="pie-legend__item">
                  <span class="pie-legend__dot pie-legend__dot--blue"></span>
                  <div>
                    <strong>Backlog</strong>
                    <span>Tarefas pendentes e não executadas.</span>
                  </div>
                </div>
                <div class="pie-legend__item">
                  <span class="pie-legend__dot pie-legend__dot--yellow"></span>
                  <div>
                    <strong>Concluídas</strong>
                    <span>Volume finalizado no período atual.</span>
                  </div>
                </div>
                <div class="pie-legend__item">
                  <span class="pie-legend__dot pie-legend__dot--red"></span>
                  <div>
                    <strong>Atraso médio</strong>
                    <span>Percentual médio de atraso das atividades.</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article class="card panel-card">
            <div class="panel-head">
              <h3>PRÓXIMAS ATIVIDADES</h3>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Atividade</th>
                    <th>Responsável</th>
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
      </section>
    </div>
  `;
  startHomeTipsRotation();
}

function buildNeonPieChart(series, labels, displayValues = []) {
  const base = Array.isArray(series) ? series : [];
  const safeValues = base.length
    ? base.map((value) => {
        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric <= 0) {
          return 0;
        }
        return numeric;
      })
    : [1, 1, 1, 1];
  const chartValues = safeValues.map((value) => (value === 0 ? 0.1 : value));
  const total = chartValues.reduce((sum, value) => sum + value, 0) || 1;
  const colors = ["#22c55e", "#3b82f6", "#facc15", "#ef4444"];
  const radius = 38;
  const center = 50;
  let startAngle = -Math.PI / 2;
  const slices = chartValues
    .map((value, index) => {
      const angle = (value / total) * Math.PI * 2;
      const endAngle = startAngle + angle;
      const largeArc = angle > Math.PI ? 1 : 0;
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      const path = `M ${center} ${center} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
      const label = labels && labels[index] ? labels[index] : `Indicador ${index + 1}`;
      const display = displayValues[index] ? displayValues[index] : safeValues[index];
      const title = `${label}: ${display}`;
      startAngle = endAngle;
      return `<path class="pie-slice" d="${path}" fill="${colors[index % colors.length]}"><title>${escapeHtml(title)}</title></path>`;
    })
    .join("");
  const title = labels && labels.length ? labels.join(", ") : "Distribuição";
  return `
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" role="img">
      <title>${escapeHtml(title)}</title>
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="rgba(88, 210, 255, 0.7)" />
          <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="rgba(246, 208, 138, 0.5)" />
        </filter>
      </defs>
      <g filter="url(#neonGlow)">
        ${slices}
      </g>
      <circle cx="${center}" cy="${center}" r="20" fill="rgba(12, 26, 40, 0.85)" />
    </svg>
  `;
}

function startHomeTipsRotation() {
  const tipBox = document.querySelector("#opscopeTips [data-tip]");
  if (!tipBox) {
    return;
  }
  const tips = [
    "Antes de iniciar a atividade, confirme subestação, OS e referência no OPSCOPE; isso evita retrabalho e garante que a equipe execute o procedimento correto.",
    "Use o painel para registrar evidências completas (fotos, observações técnicas e resultados); um registro detalhado acelera liberações futuras e evita dúvidas em campo.",
    "Ao identificar falha recorrente, registre a causa provável e a ação corretiva; isso ajuda outros técnicos a repetir o diagnóstico com mais rapidez.",
    "Revise os documentos obrigatórios (APR, OS, PTE, PT) diretamente no sistema; manter anexos consistentes reduz bloqueios e atrasos na execução.",
    "Atualize o status assim que finalizar a intervenção; o OPSCOPE sincroniza a equipe e evita que duas frentes atuem no mesmo ponto.",
    "Em atividades críticas, confirme participantes e horários no registro; isso facilita auditoria técnica e garante rastreabilidade total da operação.",
    "Use o histórico de manutenção para comparar sintomas anteriores; padrões repetidos indicam ajustes na causa raiz e economizam tempo.",
    "Quando houver atraso, registre o motivo tecnico com clareza; isso protege a equipe e evita retrabalho no fechamento da OS.",
    "Acompanhe as automações para tarefas recorrentes; elas ajudam a lembrar prazos e liberações sem depender de controles manuais.",
    "Se encontrar divergência entre campo e sistema, registre a observação no OPSCOPE imediatamente; isso evita falhas de comunicação entre turnos.",
  ];
  if (homeTipsTimer) {
    window.clearInterval(homeTipsTimer);
  }
  homeTipIndex = homeTipIndex % tips.length;
  tipBox.textContent = tips[homeTipIndex];
  homeTipsTimer = window.setInterval(() => {
    homeTipIndex = (homeTipIndex + 1) % tips.length;
    tipBox.textContent = tips[homeTipIndex];
    tipBox.classList.remove("tip-fade");
    void tipBox.offsetWidth;
    tipBox.classList.add("tip-fade");
  }, 6000);
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
  const scopedManutencoes = activeProjectId
    ? manutencoes.filter(
        (item) => item && (!item.projectId || item.projectId === activeProjectId)
      )
    : [];

  const proximos = scopedManutencoes
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
    const total = proximos.length;
    const unreadTotal = proximos.filter(({ item }) => !readSet.has(String(item.id))).length;
    if (lembretesCount.id === "bellDot") {
      lembretesCount.textContent = "";
      lembretesCount.hidden = total === 0;
      lembretesCount.classList.toggle("is-zero", total === 0);
    } else {
      lembretesCount.textContent = unreadTotal;
      lembretesCount.hidden = unreadTotal === 0;
      lembretesCount.classList.toggle("is-zero", unreadTotal === 0);
    }
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
  const state = getMaintenanceState(item, data, hoje);

  const card = document.createElement("article");
  card.className = `manutencao-item status-${item.status} state-${state}`;
  card.dataset.id = item.id;
  card.dataset.maintenanceId = item.id;
  card.id = `maintenance-${item.id}`;

  const rail = document.createElement("div");
  rail.className = "status-rail";
  rail.setAttribute("aria-hidden", "true");

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
      ? `Em execução desde ${formatDateTime(inicio)}`
      : "Em execução";
  } else if (item.status === "encerramento") {
    statusInfo.textContent = "Encerramento em preenchimento";
  } else if (item.status === "concluida" && item.doneAt) {
    const feitoEm = parseTimestamp(item.doneAt);
    if (feitoEm) {
      statusInfo.textContent = `concluída em ${formatDate(startOfDay(feitoEm))}`;
    }
  }

  const autoria = document.createElement("p");
  autoria.className = "submeta";
  const ultimaAcao = getUltimaAcao(item);
  if (ultimaAcao) {
    const label = ACTION_LABELS[ultimaAcao.action] || ultimaAcao.action;
    const dataAcao = parseTimestamp(ultimaAcao.timestamp);
    autoria.textContent = `Última ação: ${label} em ${
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

  if (item.status === "backlog" && item.backlogMotivo && item.backlogMotivo.motivo) {
    const motivo = document.createElement("p");
    motivo.className = "submeta";
    const motivoData = parseTimestamp(item.backlogMotivo.registradoEm);
    const dataTexto = motivoData ? ` em ${formatDateTime(motivoData)}` : "";
    motivo.textContent = `Motivo não executada: ${item.backlogMotivo.motivo}${dataTexto}`;
    info.append(motivo);
  }
  if (item.status === "backlog" && item.backlogMotivo && item.backlogMotivo.observacao) {
    const obs = document.createElement("p");
    obs.className = "submeta";
    obs.textContent = `Obs.: ${item.backlogMotivo.observacao}`;
    info.append(obs);
  }

  const ultimoReagendamento = getUltimoReagendamento(item);
  if (ultimoReagendamento && ultimoReagendamento.detalhes && ultimoReagendamento.detalhes.motivo) {
    const motivo = document.createElement("p");
    motivo.className = "submeta";
    motivo.textContent = `Motivo do último reagendamento: ${ultimoReagendamento.detalhes.motivo}`;
    info.append(motivo);
  }
  const rescheduleCount = getRescheduleCount(item);
  if (rescheduleCount >= MAX_REAGENDAMENTOS) {
    const alerta = document.createElement("p");
    alerta.className = "submeta submeta--alert";
    alerta.textContent = `Reagendada ${rescheduleCount}x`;
    info.append(alerta);
  }

  if (item.observacao || item.observacaoHtml) {
    const obs = document.createElement("div");
    if (item.observacaoHtml) {
      obs.className = "obs obs--rich";
      obs.innerHTML = sanitizeRichText(item.observacaoHtml);
    } else {
      obs.className = "obs";
      obs.textContent = item.observacao;
    }
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
        ? "BACKLOG"
      : statusBase === "liberada"
        ? STATUS_LABELS.liberada
      : statusBase === "hoje"
        ? "Vence hoje"
      : statusBase === "amanha"
        ? "Vence amanhã"
        : STATUS_LABELS.agendada;
  badge.className = `status status--${statusBase}`;
  badge.textContent = label;

  const stateBadge = document.createElement("span");
  stateBadge.className = `status-flag status-flag--${state}`;
  stateBadge.textContent = MAINTENANCE_STATE_LABELS[state] || "PLANEJADA";

  const statusGroup = document.createElement("div");
  statusGroup.className = "status-group";
  statusGroup.append(badge, stateBadge);

  header.append(info, statusGroup);

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
    actions.append(criarBotaoAcao("Observação", "note"));
  }

  if (item.status === "agendada" || item.status === "liberada") {
    if (permite("execute")) {
      const action = liberacaoOk ? "execute" : "release";
      const actionLabel = liberacaoOk ? "Iniciar execução" : "Liberar execução";
      const botao = criarBotaoAcao(actionLabel, action);
      if (action === "release" && lockInfo && !lockInfo.canOverride) {
        botao.disabled = true;
        botao.classList.add("is-disabled");
        botao.title = `Trancada - libera em ${formatDate(lockInfo.date)}`;
      }
      actions.append(botao);
    }
    if (permite("reschedule") && !isDailySubstationInspection(item)) {
      actions.append(criarBotaoAcao("Reagendar", "reschedule"));
    }
  } else if (item.status === "backlog") {
    if (permite("backlog_reason")) {
      actions.append(criarBotaoAcao("Motivo não executada", "backlog_reason"));
    }
    if (permite("reschedule") && !isDailySubstationInspection(item)) {
      actions.append(criarBotaoAcao("Reagendar", "reschedule"));
    }
  } else if (item.status === "em_execucao") {
    if (permite("execute")) {
      actions.append(criarBotaoAcao("Registrar execução", "register"));
    }
    if (permite("execute") && !item.registroExecucao) {
      actions.append(criarBotaoAcao("Cancelar início", "cancel_start"));
    }
    if (permite("execute") && item.registroExecucao) {
      actions.append(criarBotaoAcao("Concluir manutenção", "finish"));
    }
  } else if (item.status === "encerramento") {
    if (permite("execute")) {
      actions.append(criarBotaoAcao("Registrar execução", "register"));
      actions.append(criarBotaoAcao("Concluir manutenção", "finish"));
    }
  }

  if (permite("history")) {
    actions.append(criarBotaoAcao("Histórico", "history"));
  }

  const podeExcluir = canDeleteMaintenance(currentUser);
  if (
    podeExcluir &&
    item.status !== "concluida" &&
    item.status !== "em_execucao" &&
    item.status !== "encerramento"
  ) {
    actions.append(criarBotaoAcao("Excluir", "remove", true));
  }

  card.append(rail, header);
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
    backlog_reason: can("edit"),
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
      new Set([...getSubestacoesBase(), ...existentes.map((item) => item.local).filter(Boolean)])
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
    listaAgendadasVazia.textContent = "Nenhuma manutenção encontrada.";
    listaAgendadasVazia.hidden = false;
    return;
  }

  const getRank = (state) => {
    if (state === "released") {
      return 0;
    }
    if (state === "overdue") {
      return 1;
    }
    return 2;
  };

  const ordenados = filtrados.sort((a, b) => {
    const dataA = parseDate(a.data);
    const dataB = parseDate(b.data);
    const stateA = getMaintenanceState(a, dataA, hoje);
    const stateB = getMaintenanceState(b, dataB, hoje);
    const rankA = getRank(stateA);
    const rankB = getRank(stateB);
    if (rankA !== rankB) {
      return rankA - rankB;
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
    const createdA = getTimeValue(a.createdAt) || 0;
    const createdB = getTimeValue(b.createdAt) || 0;
    if (createdA !== createdB) {
      return createdA - createdB;
    }
    return String(a.id || "").localeCompare(String(b.id || ""), "pt-BR", {
      numeric: true,
      sensitivity: "base",
    });
  });

  const permissoes = {
    edit: can("edit"),
    note: can("edit"),
    remove: can("remove"),
    reschedule: can("reschedule"),
    execute: can("complete"),
    backlog_reason: can("edit"),
    history: true,
  };

  ordenados.forEach((item) => {
    listaAgendadas.append(
      criarCardManutencao(item, permissoes, {
        allowedActions: [
          "release",
          "execute",
          "cancel_start",
          "reschedule",
          "register",
          "finish",
          "history",
          "backlog_reason",
        ],
      })
    );
  });

  listaAgendadasVazia.textContent = "Nenhuma manutenção agendada.";
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
    backlog_reason: can("edit"),
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
    "backlog_reason",
  ]);
  renderListaCustom(vencidas, listaExecucaoVencidas, listaExecucaoVencidasVazia, [
    "note",
    "release",
    "execute",
    "reschedule",
    "history",
    "backlog_reason",
  ]);
  renderListaCustom(criticas, listaExecucaoCriticas, listaExecucaoCriticasVazia, [
    "note",
    "release",
    "execute",
    "reschedule",
    "history",
    "backlog_reason",
  ]);
}

function getRelatorioItemDate(item) {
  return (
    parseAnyDate(item && item.doneAt) ||
    parseAnyDate(item && item.data) ||
    parseAnyDate(item && item.createdAt) ||
    null
  );
}

function getRelatorioResponsavel(item) {
  const id =
    getExecutadoPorId(item) ||
    item.doneBy ||
    item.responsavel ||
    item.createdBy ||
    item.updatedBy ||
    "";
  if (item.responsavel && typeof item.responsavel === "string") {
    return item.responsavel;
  }
  return getUserLabel(id);
}

function mapRelatorioStatusFiltro(valor) {
  if (!valor) {
    return null;
  }
  if (valor === "concluido") {
    return ["concluida"];
  }
  if (valor === "em-andamento") {
    return ["em_execucao", "executando"];
  }
  if (valor === "pendente") {
    return ["agendada", "backlog", "liberada", "planejada"];
  }
  return null;
}

function filtrarRelatorioLista(lista, filtros) {
  return lista.filter((item) => {
    const baseDate = getRelatorioItemDate(item);
    if (filtros.start && filtros.end && baseDate) {
      const dia = startOfDay(baseDate);
      if (!inRange(dia, filtros.start, filtros.end)) {
        return false;
      }
    }
    if (filtros.status) {
      if (!filtros.status.includes(item.status)) {
        return false;
      }
    }
    if (filtros.tipo) {
      const categoria = (item.categoria || "").toLowerCase();
      if (categoria !== filtros.tipo) {
        return false;
      }
    }
    if (filtros.responsavel) {
      const responsavel = getRelatorioResponsavel(item);
      if (responsavel !== filtros.responsavel) {
        return false;
      }
    }
    return true;
  });
}

function contarEvidencias(item) {
  let total = 0;
  const grupos = [];
  if (Array.isArray(item.evidencias)) {
    grupos.push(item.evidencias);
  }
  if (item.registroExecucao && Array.isArray(item.registroExecucao.evidencias)) {
    grupos.push(item.registroExecucao.evidencias);
  }
  if (item.conclusao && Array.isArray(item.conclusao.evidencias)) {
    grupos.push(item.conclusao.evidencias);
  }
  if (Array.isArray(item.anexos)) {
    grupos.push(item.anexos);
  }
  grupos.forEach((grupo) => {
    total += grupo.length;
  });
  return total;
}

function atualizarResumoRelatorios(lista) {
  if (!relatorioResumoTotal || !relatorioResumoConcluidas) {
    return;
  }
  const concluidas = lista.filter((item) => item.status === "concluida");
  const criticos = lista.filter(
    (item) => item.critico || (item.prioridade || "").toLowerCase() === "critica"
  );
  const evidencias = lista.reduce((acc, item) => acc + contarEvidencias(item), 0);
  const pontuais = concluidas.filter((item) => {
    const data = parseDate(item.data);
    const doneAt = parseTimestamp(item.doneAt);
    if (!data || !doneAt) {
      return false;
    }
    return startOfDay(doneAt) <= startOfDay(data);
  });
  const sla = concluidas.length ? Math.round((pontuais.length / concluidas.length) * 100) : 0;

  relatorioResumoTotal.textContent = String(lista.length);
  relatorioResumoConcluidas.textContent = `${concluidas.length} concluídas`;
  if (relatorioResumoCriticos) {
    relatorioResumoCriticos.textContent = String(criticos.length);
  }
  if (relatorioResumoAlertas) {
    relatorioResumoAlertas.textContent = criticos.length ? "Alertas priorizados" : "Sem alertas";
  }
  if (relatorioResumoEvidencias) {
    relatorioResumoEvidencias.textContent = String(evidencias);
  }
  if (relatorioResumoEvidenciasLabel) {
    relatorioResumoEvidenciasLabel.textContent = "Fotos, PDFs e registros";
  }
  if (relatorioResumoSla) {
    relatorioResumoSla.textContent = `${sla}%`;
  }
  if (relatorioResumoSlaLabel) {
    relatorioResumoSlaLabel.textContent = "Conformidade no prazo";
  }
}

function atualizarFiltroResponsavel() {
  if (!relatorioResponsavelFiltro) {
    return;
  }
  const atual = relatorioResponsavelFiltro.value;
  const valores = new Set();
  manutencoes.forEach((item) => {
    const responsavel = getRelatorioResponsavel(item);
    if (responsavel && responsavel !== "-") {
      valores.add(responsavel);
    }
  });
  relatorioResponsavelFiltro.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "";
  optAll.textContent = "Todas as equipes";
  relatorioResponsavelFiltro.append(optAll);
  Array.from(valores)
    .sort()
    .forEach((responsavel) => {
      const opt = document.createElement("option");
      opt.value = responsavel;
      opt.textContent = responsavel;
      relatorioResponsavelFiltro.append(opt);
    });
  if (atual && Array.from(relatorioResponsavelFiltro.options).some((opt) => opt.value === atual)) {
    relatorioResponsavelFiltro.value = atual;
  }
}

function getRelatorioFiltros() {
  const dias = relatorioPeriodoFiltro ? Number(relatorioPeriodoFiltro.value) : 30;
  const hoje = startOfDay(new Date());
  const inicio = addDays(hoje, -(Math.max(dias, 1) - 1));
  const statusValores = mapRelatorioStatusFiltro(
    relatorioStatusFiltro ? relatorioStatusFiltro.value : ""
  );
  return {
    start: inicio,
    end: hoje,
    status: statusValores,
    responsavel: relatorioResponsavelFiltro ? relatorioResponsavelFiltro.value : "",
    tipo: relatorioTipoFiltro ? relatorioTipoFiltro.value : "",
  };
}

function renderRelatorios() {
  if (!listaRelatorios || !listaRelatoriosVazia) {
    return;
  }
  atualizarFiltroResponsavel();
  const filtros = getRelatorioFiltros();
  const filtrados = filtrarRelatorioLista(manutencoes, filtros);
  atualizarResumoRelatorios(filtrados);
  listaRelatorios.innerHTML = "";
  const concluidas = filtrados
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
    btnVer.textContent = "Ver relatório";
    actions.append(btnVer);

    card.append(info, actions);
    listaRelatorios.append(card);
  });
}

function getPeriodoFiltro(value) {
  const dias = Number(value) || 30;
  const fim = startOfDay(new Date());
  const inicio = addDays(fim, -(Math.max(dias, 1) - 1));
  return { inicio, fim };
}

function getProjetoLabel(item) {
  return item.local || item.projeto || item.projectKey || "Sem projeto";
}

function getResponsavelLabel(item) {
  const id = getExecutadoPorId(item) || item.doneBy || item.createdBy || "";
  return getUserLabel(id) || "Sistema";
}

function contarDocsItem(item) {
  const docs = getItemDocs(item) || {};
  const critico = isItemCritico(item);
  return {
    apr: docs.apr ? 1 : 0,
    os: docs.os ? 1 : 0,
    pte: docs.pte ? 1 : 0,
    pt: docs.pt && critico ? 1 : 0,
  };
}

function calcPercent(value, total) {
  if (!total) {
    return 0;
  }
  return Math.round((value / total) * 100);
}

function getPerfSlaClass(value) {
  if (value >= 90) {
    return "perf-badge--ok";
  }
  if (value >= 75) {
    return "perf-badge--warn";
  }
  return "perf-badge--danger";
}

function getPerfBacklogClass(value) {
  if (value <= 10) {
    return "perf-badge--ok";
  }
  if (value <= 25) {
    return "perf-badge--warn";
  }
  return "perf-badge--danger";
}

function getPerfCriticalClass(value) {
  if (!value) {
    return "perf-badge--ok";
  }
  if (value <= 2) {
    return "perf-badge--warn";
  }
  return "perf-badge--danger";
}

function clampPercent(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}

function setBadgeState(badge, className, label) {
  if (!badge) {
    return;
  }
  badge.classList.remove("badge--ok", "badge--warn", "badge--danger");
  if (className) {
    badge.classList.add(className);
  }
  if (label) {
    badge.textContent = label;
  }
}

function setProgressVariant(progress, variant) {
  if (!progress) {
    return;
  }
  progress.classList.remove("progress--warn", "progress--cool");
  if (variant) {
    progress.classList.add(variant);
  }
}

function getExecucaoDuracaoMin(item) {
  if (item && item.conclusao && Number.isFinite(item.conclusao.duracaoMin)) {
    return item.conclusao.duracaoMin;
  }
  const inicio = getItemInicioExecucaoDate(item);
  const fim = getItemFimExecucaoDate(item);
  if (!inicio || !fim) {
    return null;
  }
  const diff = Math.round((fim - inicio) / 60000);
  if (!Number.isFinite(diff) || diff < 0) {
    return null;
  }
  return diff;
}

function calcularMediaDuracao(items) {
  const duracoes = items
    .map((item) => getExecucaoDuracaoMin(item))
    .filter((value) => Number.isFinite(value));
  if (!duracoes.length) {
    return { media: null, duracoes };
  }
  const total = duracoes.reduce((acc, value) => acc + value, 0);
  return { media: total / duracoes.length, duracoes };
}

function getReopenEvents() {
  if (!auditLog || !auditLog.length) {
    return [];
  }
  const grouped = new Map();
  auditLog.forEach((entry) => {
    if (!entry || !entry.manutencaoId) {
      return;
    }
    const time = parseTimestamp(entry.timestamp);
    if (!time) {
      return;
    }
    if (!grouped.has(entry.manutencaoId)) {
      grouped.set(entry.manutencaoId, []);
    }
    grouped.get(entry.manutencaoId).push({ action: entry.action, time });
  });
  const events = [];
  grouped.forEach((entries) => {
    entries.sort((a, b) => a.time - b.time);
    let lastComplete = null;
    entries.forEach((entry) => {
      if (entry.action === "complete") {
        lastComplete = entry.time;
        return;
      }
      if (entry.action === "execute" && lastComplete && entry.time > lastComplete) {
        events.push(entry.time);
        lastComplete = null;
      }
    });
  });
  return events;
}

function renderDesempenho() {
  if (
    !perfExecProgressValue &&
    !perfSlaProgressValue &&
    !perfReopenProgressValue
  ) {
    return;
  }
  const periodo = getPeriodoFiltro("30");
  const semana = getPeriodoFiltro("7");
  const concluidasPeriodo = manutencoes.filter((item) => {
    if (item.status !== "concluida") {
      return false;
    }
    const concluidaEm = getItemConclusaoDate(item);
    if (!concluidaEm) {
      return false;
    }
    return inRange(startOfDay(concluidaEm), periodo.inicio, periodo.fim);
  });
  const concluidasSemana = manutencoes.filter((item) => {
    if (item.status !== "concluida") {
      return false;
    }
    const concluidaEm = getItemConclusaoDate(item);
    if (!concluidaEm) {
      return false;
    }
    return inRange(startOfDay(concluidaEm), semana.inicio, semana.fim);
  });

  const metaMin = 24 * 60;
  const mediaPeriodo = calcularMediaDuracao(concluidasPeriodo);
  const mediaSemana = calcularMediaDuracao(concluidasSemana);
  const dentroMeta = mediaPeriodo.duracoes.filter((value) => value <= metaMin).length;
  const velocidadePct = clampPercent(calcPercent(dentroMeta, mediaPeriodo.duracoes.length));

  if (perfExecProgressValue) {
    perfExecProgressValue.textContent = `${velocidadePct}%`;
    perfExecProgressValue.style.width = `${velocidadePct}%`;
  }
  if (perfExecTempoMedio) {
    perfExecTempoMedio.textContent = `Tempo médio: ${
      mediaPeriodo.media === null ? "-" : formatDuracaoMin(mediaPeriodo.media)
    }`;
  }
  if (perfExecSemana) {
    perfExecSemana.textContent = `Última semana: ${
      mediaSemana.media === null ? "-" : formatDuracaoMin(mediaSemana.media)
    }`;
  }
  if (perfExecBadge) {
    const badgeClass = velocidadePct >= 90 ? "badge--ok" : velocidadePct >= 75 ? "badge--warn" : "badge--danger";
    setBadgeState(perfExecBadge, badgeClass, "Meta 24h");
  }

  const slaStats = concluidasPeriodo.reduce(
    (acc, item) => {
      const sla = isSlaCompliant(item);
      if (sla === true) {
        acc.noPrazo += 1;
      } else if (sla === false) {
        acc.foraPrazo += 1;
      }
      return acc;
    },
    { noPrazo: 0, foraPrazo: 0 }
  );
  const slaPct = clampPercent(calcPercent(slaStats.noPrazo, slaStats.noPrazo + slaStats.foraPrazo));

  if (perfSlaProgressValue) {
    perfSlaProgressValue.textContent = `${slaPct}%`;
    perfSlaProgressValue.style.width = `${slaPct}%`;
  }
  if (perfSlaNoPrazo) {
    perfSlaNoPrazo.textContent = `No prazo: ${slaStats.noPrazo}`;
  }
  if (perfSlaForaPrazo) {
    perfSlaForaPrazo.textContent = `Fora do prazo: ${slaStats.foraPrazo}`;
  }
  if (perfSlaBadge) {
    const label = slaPct >= 90 ? "No prazo" : slaPct >= 75 ? "Atenção" : "Crítico";
    const badgeClass = slaPct >= 90 ? "badge--ok" : slaPct >= 75 ? "badge--warn" : "badge--danger";
    setBadgeState(perfSlaBadge, badgeClass, label);
  }
  if (perfSlaProgress) {
    const variant = slaPct >= 90 ? "" : "progress--warn";
    setProgressVariant(perfSlaProgress, variant);
  }

  const reopenEvents = getReopenEvents();
  const reopensPeriodo = reopenEvents.filter((time) =>
    inRange(startOfDay(time), periodo.inicio, periodo.fim)
  ).length;
  const reopensSemana = reopenEvents.filter((time) =>
    inRange(startOfDay(time), semana.inicio, semana.fim)
  ).length;
  const reopensBase = concluidasPeriodo.length || reopensPeriodo;
  const reopensPct = clampPercent(calcPercent(reopensPeriodo, reopensBase));

  if (perfReopenProgressValue) {
    perfReopenProgressValue.textContent = `${reopensPct}%`;
    perfReopenProgressValue.style.width = `${reopensPct}%`;
  }
  if (perfReopenUltimos) {
    perfReopenUltimos.textContent = `Últimos 7 dias: ${reopensSemana}`;
  }
  if (perfReopenImpacto) {
    const impacto = reopensPct <= 10 ? "baixo" : reopensPct <= 20 ? "moderado" : "alto";
    perfReopenImpacto.textContent = `Impacto: ${impacto}`;
  }
  if (perfReopenBadge) {
    const badgeClass = reopensPct <= 10 ? "badge--ok" : reopensPct <= 20 ? "badge--warn" : "badge--danger";
    const label = reopensPct <= 10 ? "Controlado" : reopensPct <= 20 ? "Atenção" : "Crítico";
    setBadgeState(perfReopenBadge, badgeClass, label);
  }
  if (perfReopenProgress) {
    const variant = reopensPct <= 10 ? "progress--cool" : "progress--warn";
    setProgressVariant(perfReopenProgress, variant);
  }
}

function parseTimeToMinutes(value) {
  if (!value) {
    return null;
  }
  const [hora, minuto] = String(value).split(":").map((item) => Number.parseInt(item, 10));
  if (!Number.isFinite(hora) || !Number.isFinite(minuto)) {
    return null;
  }
  return hora * 60 + minuto;
}

function calcDurationMinutes(inicio, fim) {
  const inicioMin = parseTimeToMinutes(inicio);
  const fimMin = parseTimeToMinutes(fim);
  if (inicioMin === null || fimMin === null) {
    return 0;
  }
  let diff = fimMin - inicioMin;
  if (diff < 0) {
    diff += 24 * 60;
  }
  return diff;
}

function getRdoScheduleFromDate(date) {
  const day = date ? date.getDay() : null;
  const isFriday = day === 5;
  const inicio = 7 * 60;
  const fim = isFriday ? 16 * 60 : 17 * 60;
  const label = isFriday ? "07:00 - 16:00 (sexta)" : "07:00 - 17:00 (seg-qui)";
  return { inicio, fim, label };
}

function calcOverlapMinutes(startA, endA, startB, endB) {
  const inicio = Math.max(startA, startB);
  const fim = Math.min(endA, endB);
  return Math.max(0, fim - inicio);
}

function renderPerformanceProjetos() {
  if (!perfProjetoCards || !perfProjetoTabela) {
    return;
  }
  const periodo = getPeriodoFiltro(perfProjetoPeriodo ? perfProjetoPeriodo.value : "30");
  const filtroProjeto = perfProjetoFiltro ? perfProjetoFiltro.value : "";
  const lista = manutencoes.filter((item) => {
    const dataRef = getRelatorioItemDate(item);
    if (!dataRef) {
      return false;
    }
    const dia = startOfDay(dataRef);
    if (!inRange(dia, periodo.inicio, periodo.fim)) {
      return false;
    }
    if (filtroProjeto && getProjetoLabel(item) !== filtroProjeto) {
      return false;
    }
    return true;
  });

  const projetos = {};
  lista.forEach((item) => {
    const projeto = getProjetoLabel(item);
    if (!projetos[projeto]) {
      projetos[projeto] = {
        concluida: 0,
        noPrazo: 0,
        backlog: 0,
        criticas: 0,
        apr: 0,
        os: 0,
        pte: 0,
        pt: 0,
      };
    }
    const stats = projetos[projeto];
    if (item.status === "concluida") {
      stats.concluida += 1;
      const data = parseDate(item.data);
      const doneAt = parseTimestamp(item.doneAt);
      if (data && doneAt && startOfDay(doneAt) <= startOfDay(data)) {
        stats.noPrazo += 1;
      }
    }
    if (item.status === "backlog") {
      stats.backlog += 1;
    }
    if (isItemCritico(item)) {
      stats.criticas += 1;
    }
    const docs = contarDocsItem(item);
    stats.apr += docs.apr;
    stats.os += docs.os;
    stats.pte += docs.pte;
    stats.pt += docs.pt;
  });

  const projetosOrdenados = Object.keys(projetos).sort((a, b) => {
    const diff = projetos[b].concluida - projetos[a].concluida;
    if (diff !== 0) {
      return diff;
    }
    return a.localeCompare(b);
  });
  const total = projetosOrdenados.reduce(
    (acc, key) => {
      const stats = projetos[key];
      acc.concluida += stats.concluida;
      acc.noPrazo += stats.noPrazo;
      acc.backlog += stats.backlog;
      acc.criticas += stats.criticas;
      acc.apr += stats.apr;
      acc.os += stats.os;
      acc.pte += stats.pte;
      acc.pt += stats.pt;
      return acc;
    },
    { concluida: 0, noPrazo: 0, backlog: 0, criticas: 0, apr: 0, os: 0, pte: 0, pt: 0 }
  );
  const totalAtividades = total.concluida + total.backlog;
  const totalSla = calcPercent(total.noPrazo, total.concluida);
  const totalBacklogRate = calcPercent(total.backlog, totalAtividades);
  const totalDocs = total.apr + total.os + total.pte + total.pt;

  perfProjetoCards.innerHTML = `
    <div class="perf-card">
      <span>Projetos ativos</span>
      <strong>${projetosOrdenados.length}</strong>
      <small>Período selecionado</small>
    </div>
    <div class="perf-card">
      <span>Concluídas</span>
      <strong>${total.concluida}</strong>
      <small>${total.noPrazo} no prazo</small>
    </div>
    <div class="perf-card">
      <span>SLA no prazo</span>
      <strong>${totalSla}%</strong>
      <small>Índice mensal</small>
    </div>
    <div class="perf-card">
      <span>Backlog</span>
      <strong>${total.backlog}</strong>
      <small>${totalBacklogRate}% do volume</small>
    </div>
    <div class="perf-card">
      <span>Críticas</span>
      <strong>${total.criticas}</strong>
      <small>Riscos no período</small>
    </div>
    <div class="perf-card">
      <span>Docs de segurança</span>
      <strong>${totalDocs}</strong>
      <small>APR, OS, PTE, PT</small>
    </div>
  `;

  const tbody = perfProjetoTabela.querySelector("tbody");
  tbody.innerHTML = "";
  projetosOrdenados.forEach((key) => {
    const stats = projetos[key];
    const totalItem = stats.concluida + stats.backlog;
    const sla = calcPercent(stats.noPrazo, stats.concluida);
    const backlogRate = calcPercent(stats.backlog, totalItem);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(key)}</td>
      <td>${stats.concluida}</td>
      <td>${stats.noPrazo}</td>
      <td><span class="perf-badge ${getPerfSlaClass(sla)}">${sla}%</span></td>
      <td><span class="perf-badge ${getPerfBacklogClass(backlogRate)}">${stats.backlog}</span></td>
      <td><span class="perf-badge ${getPerfCriticalClass(stats.criticas)}">${stats.criticas}</span></td>
      <td>${stats.apr}</td>
      <td>${stats.os}</td>
      <td>${stats.pte}</td>
      <td>${stats.pt}</td>
    `;
    tbody.append(tr);
  });
  if (perfProjetoTotalConcluidas) perfProjetoTotalConcluidas.textContent = String(total.concluida);
  if (perfProjetoTotalPrazo) perfProjetoTotalPrazo.textContent = String(total.noPrazo);
  if (perfProjetoTotalSla) perfProjetoTotalSla.textContent = `${totalSla}%`;
  if (perfProjetoTotalBacklog) perfProjetoTotalBacklog.textContent = String(total.backlog);
  if (perfProjetoTotalCriticas) perfProjetoTotalCriticas.textContent = String(total.criticas);
  if (perfProjetoTotalApr) perfProjetoTotalApr.textContent = String(total.apr);
  if (perfProjetoTotalOs) perfProjetoTotalOs.textContent = String(total.os);
  if (perfProjetoTotalPte) perfProjetoTotalPte.textContent = String(total.pte);
  if (perfProjetoTotalPt) perfProjetoTotalPt.textContent = String(total.pt);

  if (perfProjetoInsights) {
    const rankingSla = projetosOrdenados
      .map((key) => {
        const stats = projetos[key];
        return { key, sla: calcPercent(stats.noPrazo, stats.concluida) };
      })
      .sort((a, b) => b.sla - a.sla)
      .slice(0, 3);
    const rankingBacklog = projetosOrdenados
      .map((key) => {
        const stats = projetos[key];
        const totalItem = stats.concluida + stats.backlog;
        return {
          key,
          backlogRate: calcPercent(stats.backlog, totalItem),
          backlog: stats.backlog,
        };
      })
      .sort((a, b) => b.backlogRate - a.backlogRate)
      .slice(0, 3);
    perfProjetoInsights.innerHTML = `
      <div class="performance-insight">
        <h3>Destaques de SLA</h3>
        <ul>
          ${rankingSla
            .map(
              (item) =>
                `<li><strong>${escapeHtml(item.key)}</strong><span>${item.sla}% no prazo</span></li>`
            )
            .join("")}
        </ul>
      </div>
      <div class="performance-insight">
        <h3>Risco de backlog</h3>
        <ul>
          ${rankingBacklog
            .map(
              (item) =>
                `<li><strong>${escapeHtml(item.key)}</strong><span>${item.backlog} pendências</span></li>`
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  if (perfProjetoFiltro) {
    const atual = perfProjetoFiltro.value;
    perfProjetoFiltro.innerHTML = `<option value="">Todos os projetos</option>`;
    projetosOrdenados.forEach((key) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = key;
      perfProjetoFiltro.append(opt);
    });
    if (atual && projetosOrdenados.includes(atual)) {
      perfProjetoFiltro.value = atual;
    }
  }
}

function renderPerformancePessoas() {
  if (!perfPessoaCards || !perfPessoaTabela) {
    return;
  }
  const periodo = getPeriodoFiltro(perfPessoaPeriodo ? perfPessoaPeriodo.value : "30");
  const filtroPessoa = perfPessoaFiltro ? perfPessoaFiltro.value : "";
  const lista = manutencoes.filter((item) => {
    const dataRef = getRelatorioItemDate(item);
    if (!dataRef) {
      return false;
    }
    const dia = startOfDay(dataRef);
    if (!inRange(dia, periodo.inicio, periodo.fim)) {
      return false;
    }
    if (filtroPessoa && getResponsavelLabel(item) !== filtroPessoa) {
      return false;
    }
    return true;
  });

  const pessoas = {};
  const usuariosBase = filtroPessoa
    ? [filtroPessoa]
    : users
        .filter((user) => user && (user.name || user.username))
        .map((user) => getUserLabel(user.id))
        .filter(Boolean);
  usuariosBase.forEach((label) => {
    if (!pessoas[label]) {
      pessoas[label] = {
        abertas: 0,
        concluida: 0,
        noPrazo: 0,
        backlog: 0,
        criticas: 0,
        apr: 0,
        os: 0,
        pte: 0,
        pt: 0,
      };
    }
  });
  lista.forEach((item) => {
    const responsavel = getResponsavelLabel(item);
    if (!pessoas[responsavel]) {
      pessoas[responsavel] = {
        abertas: 0,
        concluida: 0,
        noPrazo: 0,
        backlog: 0,
        criticas: 0,
        apr: 0,
        os: 0,
        pte: 0,
        pt: 0,
      };
    }
    const stats = pessoas[responsavel];
    if (item.createdBy && getUserLabel(item.createdBy) === responsavel) {
      stats.abertas += 1;
    }
    if (item.status === "concluida") {
      stats.concluida += 1;
      const data = parseDate(item.data);
      const doneAt = parseTimestamp(item.doneAt);
      if (data && doneAt && startOfDay(doneAt) <= startOfDay(data)) {
        stats.noPrazo += 1;
      }
    }
    if (item.status === "backlog") {
      stats.backlog += 1;
    }
    if (isItemCritico(item)) {
      stats.criticas += 1;
    }
    const docs = contarDocsItem(item);
    stats.apr += docs.apr;
    stats.os += docs.os;
    stats.pte += docs.pte;
    stats.pt += docs.pt;
  });

  const pessoasOrdenadas = Object.keys(pessoas).sort((a, b) => {
    const diff = pessoas[b].concluida - pessoas[a].concluida;
    if (diff !== 0) {
      return diff;
    }
    return a.localeCompare(b);
  });
  const total = pessoasOrdenadas.reduce(
    (acc, key) => {
      const stats = pessoas[key];
      acc.abertas += stats.abertas;
      acc.concluida += stats.concluida;
      acc.noPrazo += stats.noPrazo;
      acc.backlog += stats.backlog;
      acc.criticas += stats.criticas;
      acc.apr += stats.apr;
      acc.os += stats.os;
      acc.pte += stats.pte;
      acc.pt += stats.pt;
      return acc;
    },
    { abertas: 0, concluida: 0, noPrazo: 0, backlog: 0, criticas: 0, apr: 0, os: 0, pte: 0, pt: 0 }
  );
  const totalAtividades = total.concluida + total.backlog;
  const totalSla = calcPercent(total.noPrazo, total.concluida);
  const totalBacklogRate = calcPercent(total.backlog, totalAtividades);
  const totalDocs = total.apr + total.os + total.pte + total.pt;
  const mediaConcluida = pessoasOrdenadas.length
    ? Math.round(total.concluida / pessoasOrdenadas.length)
    : 0;

  perfPessoaCards.innerHTML = `
    <div class="perf-card">
      <span>Colaboradores ativos</span>
      <strong>${pessoasOrdenadas.length}</strong>
      <small>Período selecionado</small>
    </div>
    <div class="perf-card">
      <span>Concluídas</span>
      <strong>${total.concluida}</strong>
      <small>${total.noPrazo} no prazo</small>
    </div>
    <div class="perf-card">
      <span>SLA no prazo</span>
      <strong>${totalSla}%</strong>
      <small>Índice mensal</small>
    </div>
    <div class="perf-card">
      <span>Backlog</span>
      <strong>${total.backlog}</strong>
      <small>${totalBacklogRate}% do volume</small>
    </div>
    <div class="perf-card">
      <span>Críticas</span>
      <strong>${total.criticas}</strong>
      <small>Riscos no período</small>
    </div>
    <div class="perf-card">
      <span>Docs de segurança</span>
      <strong>${totalDocs}</strong>
      <small>APR, OS, PTE, PT</small>
    </div>
    <div class="perf-card">
      <span>Média concluída</span>
      <strong>${mediaConcluida}</strong>
      <small>Por colaborador</small>
    </div>
  `;

  const tbody = perfPessoaTabela.querySelector("tbody");
  tbody.innerHTML = "";
  pessoasOrdenadas.forEach((key) => {
    const stats = pessoas[key];
    const totalItem = stats.concluida + stats.backlog;
    const sla = calcPercent(stats.noPrazo, stats.concluida);
    const backlogRate = calcPercent(stats.backlog, totalItem);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(key)}</td>
      <td>${stats.abertas}</td>
      <td>${stats.concluida}</td>
      <td>${stats.noPrazo}</td>
      <td><span class="perf-badge ${getPerfSlaClass(sla)}">${sla}%</span></td>
      <td><span class="perf-badge ${getPerfBacklogClass(backlogRate)}">${stats.backlog}</span></td>
      <td><span class="perf-badge ${getPerfCriticalClass(stats.criticas)}">${stats.criticas}</span></td>
      <td>${stats.apr}</td>
      <td>${stats.os}</td>
      <td>${stats.pte}</td>
      <td>${stats.pt}</td>
    `;
    tbody.append(tr);
  });
  if (perfPessoaTotalAbertas) perfPessoaTotalAbertas.textContent = String(total.abertas);
  if (perfPessoaTotalConcluidas) perfPessoaTotalConcluidas.textContent = String(total.concluida);
  if (perfPessoaTotalPrazo) perfPessoaTotalPrazo.textContent = String(total.noPrazo);
  if (perfPessoaTotalSla) perfPessoaTotalSla.textContent = `${totalSla}%`;
  if (perfPessoaTotalBacklog) perfPessoaTotalBacklog.textContent = String(total.backlog);
  if (perfPessoaTotalCriticas) perfPessoaTotalCriticas.textContent = String(total.criticas);
  if (perfPessoaTotalApr) perfPessoaTotalApr.textContent = String(total.apr);
  if (perfPessoaTotalOs) perfPessoaTotalOs.textContent = String(total.os);
  if (perfPessoaTotalPte) perfPessoaTotalPte.textContent = String(total.pte);
  if (perfPessoaTotalPt) perfPessoaTotalPt.textContent = String(total.pt);

  if (perfPessoaInsights) {
    const rankingEntrega = pessoasOrdenadas
      .map((key) => ({ key, concluida: pessoas[key].concluida }))
      .sort((a, b) => b.concluida - a.concluida)
      .slice(0, 3);
    const rankingBacklog = pessoasOrdenadas
      .map((key) => ({ key, backlog: pessoas[key].backlog }))
      .sort((a, b) => b.backlog - a.backlog)
      .slice(0, 3);
    perfPessoaInsights.innerHTML = `
      <div class="performance-insight">
        <h3>Top entregas</h3>
        <ul>
          ${rankingEntrega
            .map(
              (item) =>
                `<li><strong>${escapeHtml(item.key)}</strong><span>${item.concluida} concluídas</span></li>`
            )
            .join("")}
        </ul>
      </div>
      <div class="performance-insight">
        <h3>Maior backlog</h3>
        <ul>
          ${rankingBacklog
            .map(
              (item) =>
                `<li><strong>${escapeHtml(item.key)}</strong><span>${item.backlog} pendências</span></li>`
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  if (perfPessoaFiltro) {
    const atual = perfPessoaFiltro.value;
    perfPessoaFiltro.innerHTML = `<option value="">Todos os colaboradores</option>`;
    pessoasOrdenadas.forEach((key) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = key;
      perfPessoaFiltro.append(opt);
    });
    if (atual && pessoasOrdenadas.includes(atual)) {
      perfPessoaFiltro.value = atual;
    }
  }
}

function carregarFeedbacks() {
  feedbacks = readJson(getProjectStorageKey(FEEDBACK_KEY), []);
}

function salvarFeedbacks(lista) {
  writeJson(getProjectStorageKey(FEEDBACK_KEY), lista);
  feedbacks = lista;
}

function getFeedbacksRecebidos(userId) {
  return feedbacks.filter((item) => item.to === userId);
}

function getFeedbacksEnviados(userId) {
  return feedbacks.filter((item) => item.from === userId);
}

function renderFeedbackStats() {
  if (!currentUser) {
    return;
  }
  const userId = currentUser.id;
  const recebidos = getFeedbacksRecebidos(userId);
  const enviados = getFeedbacksEnviados(userId);
  const unread = recebidos.filter((item) => !item.readAt).length;
  const media =
    recebidos.length > 0
      ? (
          recebidos.reduce((acc, item) => acc + (Number(item.score) || 0), 0) /
          recebidos.length
        ).toFixed(1)
      : "-";

  if (feedbackStatReceived) feedbackStatReceived.textContent = String(recebidos.length);
  if (feedbackStatSent) feedbackStatSent.textContent = String(enviados.length);
  if (feedbackStatAvg) feedbackStatAvg.textContent = media === "-" ? "-" : media;
  if (feedbackStatUnread) feedbackStatUnread.textContent = String(unread);
}

function renderFeedbackList() {
  if (!feedbackList || !feedbackEmpty) {
    return;
  }
  renderFeedbackStats();
  const activeTab = feedbackTabButtons.find((btn) => btn.classList.contains("is-active"));
  const mode = activeTab ? activeTab.dataset.feedbackTab : "recebidos";
  const userId = currentUser ? currentUser.id : "";
  const searchQuery = feedbackSearch ? normalizeSearchValue(feedbackSearch.value) : "";
  const sortMode = feedbackSort ? feedbackSort.value : "recent";
  const listaBase = mode === "enviados" ? getFeedbacksEnviados(userId) : getFeedbacksRecebidos(userId);
  const lista = listaBase.filter((item) => {
    if (!searchQuery) {
      return true;
    }
    const peer = mode === "enviados" ? getUserLabel(item.to) : getUserLabel(item.from);
    const content = normalizeSearchValue(`${peer} ${item.message || ""}`);
    return content.includes(searchQuery);
  });
  feedbackList.innerHTML = "";

  if (!lista.length) {
    feedbackEmpty.hidden = false;
    return;
  }
  feedbackEmpty.hidden = true;

  lista
    .slice()
    .sort((a, b) => {
      if (sortMode === "score") {
        return (Number(b.score) || 0) - (Number(a.score) || 0);
      }
      return (
        (getTimeValue(parseTimestamp(b.createdAt)) || 0) -
        (getTimeValue(parseTimestamp(a.createdAt)) || 0)
      );
    })
    .forEach((item) => {
      const card = document.createElement("div");
      card.className = `feedback-item ${item.readAt ? "" : "is-unread"}`;
      const createdAt = item.createdAt ? formatDateTime(parseTimestamp(item.createdAt)) : "-";
      const peer = mode === "enviados" ? getUserLabel(item.to) : getUserLabel(item.from);
      card.innerHTML = `
        <div class="feedback-item__head">
          <strong>${escapeHtml(peer || "-")}</strong>
          <span class="feedback-score">Nota ${item.score}</span>
        </div>
        <p>${escapeHtml(item.message || "")}</p>
        <small>${escapeHtml(createdAt)}</small>
      `;
      feedbackList.append(card);
    });

  if (mode === "recebidos") {
    marcarFeedbacksComoLidos(userId);
  }
}

function marcarFeedbacksComoLidos(userId) {
  let mudou = false;
  const atualizados = feedbacks.map((item) => {
    if (item.to === userId && !item.readAt) {
      mudou = true;
      return { ...item, readAt: toIsoUtc(new Date()) };
    }
    return item;
  });
  if (mudou) {
    salvarFeedbacks(atualizados);
  }
  atualizarFeedbackBadge();
  renderFeedbackInbox();
  renderFeedbackStats();
}

function atualizarFeedbackBadge() {
  const userId = currentUser ? currentUser.id : "";
  const unread = feedbacks.filter((item) => item.to === userId && !item.readAt).length;
  const total = feedbacks.filter((item) => item.to === userId).length;
  if (feedbackBadge) {
    feedbackBadge.textContent = String(unread);
    feedbackBadge.hidden = unread === 0;
  }
  if (feedbackInboxDot) {
    feedbackInboxDot.hidden = total === 0;
  }
}

function renderFeedbackInbox() {
  if (!feedbackInboxList || !feedbackInboxEmpty) {
    return;
  }
  const userId = currentUser ? currentUser.id : "";
  const recebidos = getFeedbacksRecebidos(userId)
    .slice()
    .sort((a, b) => (getTimeValue(parseTimestamp(b.createdAt)) || 0) - (getTimeValue(parseTimestamp(a.createdAt)) || 0))
    .slice(0, 4);
  feedbackInboxList.innerHTML = "";
  if (!recebidos.length) {
    feedbackInboxEmpty.hidden = false;
    return;
  }
  feedbackInboxEmpty.hidden = true;
  recebidos.forEach((item) => {
    const row = document.createElement("div");
    row.className = `feedback-inbox-item${item.readAt ? "" : " is-unread"}`;
    const createdAt = item.createdAt ? formatDateTime(parseTimestamp(item.createdAt)) : "-";
    row.innerHTML = `
      <strong>${escapeHtml(getUserLabel(item.from) || "-")}</strong>
      <span>${escapeHtml(item.message || "").slice(0, 60)}${item.message && item.message.length > 60 ? "..." : ""}</span>
      <small>${escapeHtml(createdAt)}</small>
    `;
    feedbackInboxList.append(row);
  });
  renderFeedbackStats();
}

function enviarFeedback() {
  if (!currentUser) {
    return;
  }
  const to = feedbackTo ? feedbackTo.value : "";
  const score = feedbackScore ? Number(feedbackScore.value) : 0;
  const message = feedbackMessage ? feedbackMessage.value.trim() : "";
  if (!to || !message || !score) {
    if (feedbackSendMsg) {
      feedbackSendMsg.textContent = "Preencha destinatário, avaliação e mensagem.";
      feedbackSendMsg.classList.add("mensagem--erro");
    }
    return;
  }
  const novo = {
    id: criarId(),
    from: currentUser.id,
    to,
    score,
    message,
    createdAt: toIsoUtc(new Date()),
    readAt: null,
  };
  const atualizados = [novo, ...feedbacks];
  salvarFeedbacks(atualizados);
  if (feedbackMessage) {
    feedbackMessage.value = "";
  }
  if (feedbackSendMsg) {
    feedbackSendMsg.textContent = "Feedback enviado com sucesso.";
    feedbackSendMsg.classList.remove("mensagem--erro");
  }
  atualizarFeedbackBadge();
  renderFeedbackInbox();
  renderFeedbackList();
  renderFeedbackStats();
}

function renderFeedbackRecipients() {
  if (!feedbackTo) {
    return;
  }
  feedbackTo.innerHTML = `<option value="">Selecione um colaborador</option>`;
  users.forEach((user) => {
    if (currentUser && user.id === currentUser.id) {
      return;
    }
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = getUserLabel(user.id) || user.nome || user.email || user.id;
    feedbackTo.append(option);
  });
}

function buildRelatorioResumoHtml(titulo, periodoLabel, lista) {
  const concluidas = lista.filter((item) => item.status === "concluida");
  const criticos = lista.filter(
    (item) => item.critico || (item.prioridade || "").toLowerCase() === "critica"
  );
  const evidencias = lista.reduce((acc, item) => acc + contarEvidencias(item), 0);
  const pontuais = concluidas.filter((item) => {
    const data = parseDate(item.data);
    const doneAt = parseTimestamp(item.doneAt);
    if (!data || !doneAt) {
      return false;
    }
    return startOfDay(doneAt) <= startOfDay(data);
  });
  const sla = concluidas.length ? Math.round((pontuais.length / concluidas.length) * 100) : 0;
  const linhas = lista
    .map((item) => {
      const data = parseDate(item.data);
      const doneAt = parseTimestamp(item.doneAt);
      const referencia = doneAt ? formatDate(doneAt) : data ? formatDate(data) : "-";
      const responsavel = getRelatorioResponsavel(item);
      return `<tr>
        <td>${escapeHtml(item.titulo || "-")}</td>
        <td>${escapeHtml(item.local || "-")}</td>
        <td>${escapeHtml(referencia)}</td>
        <td>${escapeHtml(item.status || "-")}</td>
        <td>${escapeHtml(responsavel || "-")}</td>
      </tr>`;
    })
    .join("");

  return `
    <div class="report">
      <header class="report__header">
        <div class="report__brand">
          <strong>OPSCOPE</strong>
          <span>${escapeHtml(titulo)}</span>
        </div>
        <div class="report__meta">
          <div>Período: ${escapeHtml(periodoLabel)}</div>
          <div>Gerado em: ${escapeHtml(formatDateTime(new Date()))}</div>
        </div>
      </header>
      <section class="report__grid">
        <div><span>Manutenções</span><strong>${lista.length}</strong></div>
        <div><span>Concluídas</span><strong>${concluidas.length}</strong></div>
        <div><span>Críticos</span><strong>${criticos.length}</strong></div>
        <div><span>Evidências</span><strong>${evidencias}</strong></div>
        <div><span>SLA no prazo</span><strong>${sla}%</strong></div>
      </section>
      <section class="report__body">
        <h4>Resumo do período</h4>
        <table class="report__table">
          <thead>
            <tr>
              <th>Manutenção</th>
              <th>Local</th>
              <th>Data</th>
              <th>Status</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            ${linhas || `<tr><td colspan="5">Nenhum registro no período.</td></tr>`}
          </tbody>
        </table>
      </section>
    </div>
  `;
}

function abrirJanelaRelatorio(html, titulo, imprimir) {
  const nova = window.open("", "_blank");
  if (!nova) {
    return false;
  }
  nova.document.write(`
    <html>
      <head>
        <title>${escapeHtml(titulo)}</title>
        <style>
          body { font-family: "Segoe UI", sans-serif; margin: 24px; color: #16202a; }
          .report__header { display: flex; justify-content: space-between; gap: 16px; border-bottom: 2px solid #d9d4c8; padding-bottom: 12px; }
          .report__brand strong { font-size: 1.1rem; letter-spacing: 0.2em; display: block; }
          .report__brand span { font-size: 0.9rem; color: #5c6772; }
          .report__meta { font-size: 0.85rem; color: #5c6772; display: grid; gap: 6px; text-align: right; }
          .report__grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin: 18px 0; }
          .report__grid div { border: 1px solid #d9d4c8; border-radius: 10px; padding: 10px; }
          .report__grid span { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: #5c6772; }
          .report__grid strong { font-size: 1rem; }
          .report__table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
          .report__table th, .report__table td { border-bottom: 1px solid #e2ddd2; padding: 8px; text-align: left; }
          .report__table th { text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.65rem; background: #f6f2ea; }
          .rdo-doc { display: grid; gap: 18px; }
          .rdo-header { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 10px; border-bottom: 2px solid #d9d4c8; }
          .rdo-brand { display: grid; gap: 4px; }
          .rdo-brand__row { display: flex; align-items: center; gap: 12px; }
          .rdo-logo { width: 72px; height: auto; object-fit: contain; }
          .rdo-eyebrow { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #5c6772; }
          .rdo-title { font-size: 1.5rem; letter-spacing: 0.08em; text-transform: uppercase; margin: 0; }
          .rdo-subtitle { font-size: 0.9rem; color: #5c6772; margin: 0; }
          .rdo-meta { font-size: 0.8rem; display: grid; gap: 4px; color: #5c6772; text-align: right; }
          .rdo-header-info { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; font-size: 0.72rem; color: #425363; }
          .rdo-header-info span { display: block; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.55rem; }
          .rdo-header-info strong { font-size: 0.78rem; color: #1f2a33; }
          .rdo-section { display: grid; gap: 10px; }
          .rdo-summary { background: #f8f6f1; border: 1px solid #d9d4c8; padding: 12px 14px; border-radius: 12px; }
          .rdo-block { border: 1px solid #d9d4c8; border-radius: 12px; padding: 10px 12px; background: #fff; }
          .rdo-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; margin-top: 8px; }
          .rdo-summary-item { border: 1px solid #d9d4c8; border-radius: 10px; padding: 6px 8px; display: grid; gap: 2px; background: #fff; }
          .rdo-summary-item span { font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: #425363; }
          .rdo-summary-item strong { font-size: 0.9rem; }
          .rdo-summary-grid--cards .rdo-summary-item { background: #fff; box-shadow: 0 6px 10px rgba(0,0,0,0.06); }
          .rdo-kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; }
          .rdo-kpi-card { border: 1px solid #d9d4c8; border-radius: 12px; padding: 10px 10px 10px 30px; background: #fff; display: grid; gap: 6px; position: relative; }
          .rdo-kpi-card span { font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: #5c6772; }
          .rdo-kpi-card strong { font-size: 1rem; }
          .rdo-kpi-card--ok { border-left: 4px solid #4bd28f; }
          .rdo-kpi-card--warn { border-left: 4px solid #f6c453; }
          .rdo-kpi-card--danger { border-left: 4px solid #e2595c; }
          .rdo-kpi-card--info { border-left: 4px solid #5b8def; }
          .rdo-kpi-card--neutral { border-left: 4px solid #9aa4af; }
          .rdo-kpi-card::before { content: ""; width: 10px; height: 10px; border-radius: 50%; background: #9aa4af; position: absolute; left: 10px; top: 12px; }
          .rdo-kpi-card--ok::before { background: #4bd28f; }
          .rdo-kpi-card--warn::before { background: #f6c453; }
          .rdo-kpi-card--danger::before { background: #e2595c; }
          .rdo-kpi-card--info::before { background: #5b8def; }
          .rdo-kpi-card--neutral::before { background: #9aa4af; }
          .rdo-month__sla { display: grid; gap: 6px; }
          .rdo-month__sla-bar { height: 16px; background: #e5e1d6; border-radius: 999px; overflow: hidden; }
          .rdo-month__sla-bar span { display: block; height: 100%; background: linear-gradient(90deg, #4bd28f, #9bf7c7); color: #1f2a33; font-size: 0.7rem; text-align: right; padding-right: 8px; line-height: 16px; }
          .rdo-month__sla small { font-size: 0.75rem; color: #5c6772; }
          .rdo-note { border: 1px dashed #d9d4c8; border-radius: 12px; padding: 12px 14px; background: #fff; }
          .rdo-note h3 { margin: 0 0 6px; font-size: 0.95rem; }
          .report-table__wrap { border: 1px solid #e2ddd2; border-radius: 10px; overflow: hidden; }
          .report__table tbody tr:nth-child(even) { background: #fbf9f4; }
          .report__table tfoot td { font-weight: 600; background: #f6f2ea; }
          .status-badge { display: inline-flex; align-items: center; justify-content: center; padding: 3px 6px; border-radius: 999px; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; }
          .status-badge--concluida { background: rgba(43, 122, 120, 0.18); color: #1f5759; }
          .status-badge--em_execucao { background: rgba(91, 141, 239, 0.18); color: #2b4e7a; }
          .status-badge--backlog { background: rgba(226, 89, 92, 0.18); color: #7a2b1e; }
          .status-badge--agendada { background: rgba(246, 196, 83, 0.18); color: #7a5b1e; }
          .status-badge--liberada { background: rgba(91, 141, 239, 0.16); color: #2b4e7a; }
          .priority-badge { display: inline-flex; align-items: center; justify-content: center; padding: 3px 6px; border-radius: 999px; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid #d9d4c8; }
          .priority-badge--baixa { background: rgba(91, 141, 239, 0.12); color: #2b4e7a; }
          .priority-badge--media { background: rgba(246, 196, 83, 0.18); color: #7a5b1e; }
          .priority-badge--alta { background: rgba(226, 89, 92, 0.18); color: #7a2b1e; }
          .priority-badge--critica { background: rgba(226, 89, 92, 0.28); color: #7a2b1e; }
          .rdo-month__day summary { cursor: pointer; list-style: none; }
          .rdo-month__day summary::-webkit-details-marker { display: none; }
          @media screen {
            .report-table__wrap { max-height: 260px; overflow: auto; }
            .report__table thead th { position: sticky; top: 0; z-index: 1; }
          }
          @media print {
            body { margin: 16mm; }
            .rdo-month__charts { grid-template-columns: 1fr; }
            .rdo-month__charts > div { break-inside: avoid; page-break-inside: avoid; }
            .rdo-month__donut { grid-template-columns: 1fr; justify-items: center; }
            .rdo-legend { margin-top: 6px; }
            .rdo-chart, .rdo-donut { max-width: 100%; height: auto; }
            h3, h4 { break-after: avoid; page-break-after: avoid; }
            .report-table__wrap { max-height: none; overflow: visible; }
            table { page-break-inside: avoid; }
          }
          .rdo-items { display: grid; gap: 10px; }
          .rdo-item { border: 1px solid #d9d4c8; border-radius: 12px; padding: 10px 12px; display: grid; gap: 8px; }
          .rdo-item__head { display: flex; justify-content: space-between; gap: 12px; font-size: 0.8rem; color: #425363; }
          .rdo-month__day { border: 1px solid #d9d4c8; border-radius: 12px; padding: 12px; display: grid; gap: 12px; }
          .rdo-month__day-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
          .rdo-month__day-head span { font-size: 0.8rem; color: #5c6772; }
          .rdo-badge { border: 1px solid #d9d4c8; border-radius: 999px; padding: 6px 10px; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.12em; background: #f6f2ea; color: #5c6772; }
          .rdo-month__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; }
          .rdo-month__grid div { border: 1px solid #e2ddd2; border-radius: 10px; padding: 8px; }
          .rdo-month__grid span { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: #5c6772; }
          .rdo-month__grid strong { font-size: 0.85rem; }
          .rdo-month__notes { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
          .rdo-month__notes h4 { margin: 0 0 6px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.12em; color: #5c6772; }
          .rdo-month__notes p { margin: 0; font-size: 0.85rem; color: #1f2a33; }
          .rdo-month { display: grid; gap: 18px; }
          .rdo-month__charts { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
          .rdo-month__charts h4 { margin: 0 0 8px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.12em; color: #5c6772; }
          .rdo-chart { width: 100%; height: auto; display: block; }
          .rdo-month__donut { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: center; }
          .rdo-donut { width: 120px; height: 120px; display: block; }
          .rdo-legend { display: grid; gap: 6px; font-size: 0.75rem; color: #425363; }
          .legend-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; }
          .legend-dot--ok { background: #4bd28f; }
          .legend-dot--info { background: #5b8def; }
          .legend-dot--warn { background: #f6c453; }
          .legend-dot--danger { background: #e2595c; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `);
  nova.document.close();
  if (imprimir) {
    nova.focus();
    nova.print();
  }
  return true;
}

function updateMonthlyRangeFromMonth() {
  if (!relatorioMes || !relatorioInicioMensal || !relatorioFimMensal) {
    return;
  }
  if (!relatorioMes.value) {
    return;
  }
  const [anoStr, mesStr] = relatorioMes.value.split("-");
  const ano = Number(anoStr);
  const mes = Number(mesStr);
  if (!ano || !mes) {
    return;
  }
  const inicio = new Date(ano, mes - 1, 1);
  const fim = new Date(ano, mes, 0);
  relatorioInicioMensal.value = formatDateISO(inicio);
  relatorioFimMensal.value = formatDateISO(fim);
}

function getMonthlyRange() {
  if (relatorioInicioMensal && relatorioFimMensal && relatorioInicioMensal.value && relatorioFimMensal.value) {
    const inicio = parseDate(relatorioInicioMensal.value);
    const fim = parseDate(relatorioFimMensal.value);
    if (inicio && fim) {
      return { start: startOfDay(inicio), end: startOfDay(fim) };
    }
  }
  if (relatorioMes && relatorioMes.value) {
    updateMonthlyRangeFromMonth();
    const inicio = parseDate(relatorioInicioMensal ? relatorioInicioMensal.value : "");
    const fim = parseDate(relatorioFimMensal ? relatorioFimMensal.value : "");
    if (inicio && fim) {
      return { start: startOfDay(inicio), end: startOfDay(fim) };
    }
  }
  const hoje = startOfDay(new Date());
  return { start: hoje, end: hoje };
}

function gerarRelatorioMensalHtml(range) {
  const periodoLabel = `${formatDate(range.start)} - ${formatDate(range.end)}`;
  const filtrados = filtrarRelatorioLista(manutencoes, { start: range.start, end: range.end });
  const clienteProjeto = getActiveProjectClient();
  const titulo = `Relatório mensal (${relatorioCliente ? relatorioCliente.value || clienteProjeto : clienteProjeto})`;
  return buildRelatorioResumoHtml(titulo, periodoLabel, filtrados);
}

function exportarRelatoriosPdf() {
  const filtros = getRelatorioFiltros();
  const filtrados = filtrarRelatorioLista(manutencoes, filtros);
  const periodoLabel = `${formatDate(filtros.start)} - ${formatDate(filtros.end)}`;
  const html = buildRelatorioResumoHtml("Central de relatórios", periodoLabel, filtrados);
  return abrirJanelaRelatorio(html, "Relatório - OPSCOPE", true);
}

function gerarResumoMensal() {
  const range = getMonthlyRange();
  const filtrados = filtrarRelatorioLista(manutencoes, { start: range.start, end: range.end });
  atualizarResumoRelatorios(filtrados);
  const periodoLabel = `${formatDate(range.start)} - ${formatDate(range.end)}`;
  const html = buildRelatorioResumoHtml("Resumo mensal", periodoLabel, filtrados);
  return abrirJanelaRelatorio(html, "Resumo mensal - OPSCOPE", false);
}

function previewRelatorioMensal() {
  const range = getMonthlyRange();
  const html = gerarRelatorioMensalHtml(range);
  return abrirJanelaRelatorio(html, "Relatório mensal - OPSCOPE", false);
}

function exportarRelatorioMensal() {
  const range = getMonthlyRange();
  const html = gerarRelatorioMensalHtml(range);
  return abrirJanelaRelatorio(html, "Relatório mensal - OPSCOPE", true);
}

function gerarRdoMensal(imprimir = false, returnHtml = false) {
  const range = getMonthlyRange();
  const periodoLabel = `${formatDate(range.start)} - ${formatDate(range.end)}`;
  const rdos = rdoSnapshots
    .filter((item) => {
      const data = item.rdoDate ? parseDate(item.rdoDate) : null;
      return data ? inRange(startOfDay(data), range.start, range.end) : false;
    })
    .sort((a, b) => (getTimeValue(parseDate(b.rdoDate)) || 0) - (getTimeValue(parseDate(a.rdoDate)) || 0));

  const manutencoesPeriodo = filtrarRelatorioLista(manutencoes, {
    start: range.start,
    end: range.end,
  });
  const acumulado = rdos.reduce(
    (acc, item) => {
      const metricas = item.metricas || {};
      acc.totalRdos += 1;
      acc.atividades += metricas.total || 0;
      acc.concluidas += metricas.concluidas || 0;
      acc.emExecucao += metricas.emExecucao || 0;
      acc.criticas += metricas.criticas || 0;
      acc.overdue += metricas.overdue || 0;
      acc.docsOk += metricas.docsOk || 0;
      acc.docsTotal += metricas.docsTotal || 0;
      acc.tempoTotal += metricas.tempoTotalMin || 0;
      acc.evidencias += item.evidenciasTotal || (Array.isArray(item.evidencias) ? item.evidencias.length : 0);
      return acc;
    },
    {
      totalRdos: 0,
      atividades: 0,
      concluidas: 0,
      emExecucao: 0,
      criticas: 0,
      overdue: 0,
      abertas: 0,
      docsOk: 0,
      docsTotal: 0,
      tempoTotal: 0,
      evidencias: 0,
    }
  );
  acumulado.abertas = rdos.reduce((acc, item) => acc + ((item.metricas && item.metricas.abertas) || 0), 0);

  const docsPercent = acumulado.docsTotal
    ? Math.round((acumulado.docsOk / acumulado.docsTotal) * 100)
    : 0;
  const slaPercent = acumulado.atividades
    ? Math.round(((acumulado.atividades - acumulado.overdue) / acumulado.atividades) * 100)
    : 0;
  const tempoTotalLabel = acumulado.tempoTotal
    ? formatDuracaoMin(acumulado.tempoTotal)
    : "-";
  const cliente = relatorioCliente ? relatorioCliente.value || clienteProjeto : clienteProjeto;
  const projetoAtivo = getActiveProject();
  const projetoLabel = projetoAtivo ? getProjectLabel(projetoAtivo) : RDO_PROJETO;
  const hashMensal = hashString(`${periodoLabel}|${acumulado.totalRdos}|${cliente}`).slice(0, 8).toUpperCase();
  const emissor = currentUser ? getUserLabel(currentUser.id) : "Sistema";
  const topSubestacoes = rdos.reduce((acc, item) => {
    const sub = item.filtros && item.filtros.subestacao ? item.filtros.subestacao : "";
    if (!sub) {
      return acc;
    }
    acc[sub] = (acc[sub] || 0) + ((item.metricas && item.metricas.total) || 0);
    return acc;
  }, {});
  const topSubResumo = Object.keys(topSubestacoes)
    .map((key) => ({ key, total: topSubestacoes[key] }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 3)
    .map((item) => `${item.key} (${item.total})`)
    .join(", ");
  const resumoExec = acumulado.totalRdos
    ? `No período foram consolidados ${acumulado.totalRdos} RDOs, com ${acumulado.atividades} atividades, ${acumulado.concluidas} concluídas e ${acumulado.overdue} overdue. ${
        topSubResumo ? `Subestacoes com maior volume: ${topSubResumo}.` : ""
      }`
    : "Nenhum RDO encontrado no período selecionado.";

  const segurancaResumo = rdos.reduce(
    (acc, item) => {
      const manual = item.manual || {};
      const incidente = String(manual.incidente || "").toUpperCase();
      const bloqueio = String(manual.bloqueio || "").toUpperCase();
      if (incidente && incidente !== "NAO" && incidente !== "N/A") {
        acc.incidentes += 1;
      }
      if (bloqueio && bloqueio !== "N/A" && bloqueio !== "NAO") {
        acc.bloqueios += 1;
      }
      const clima = (manual.clima || "").trim();
      if (clima) {
        acc.climas[clima] = (acc.climas[clima] || 0) + 1;
      }
      const kmInicial = Number.parseFloat(manual.kmInicial || "");
      const kmFinal = Number.parseFloat(manual.kmFinal || "");
      if (Number.isFinite(kmInicial) && Number.isFinite(kmFinal) && kmFinal >= kmInicial) {
        acc.kmTotal += kmFinal - kmInicial;
      }
      const qtPessoas = Number.parseFloat(manual.qtPessoas || "");
      if (Number.isFinite(qtPessoas) && qtPessoas > 0) {
        acc.qtPessoasTotal += qtPessoas;
        acc.qtPessoasCount += 1;
      }
      const condutor = manual.condutor ? String(manual.condutor).trim() : "";
      if (condutor) {
        acc.condutores.add(condutor);
      }
      return acc;
    },
    {
      incidentes: 0,
      bloqueios: 0,
      climas: {},
      kmTotal: 0,
      qtPessoasTotal: 0,
      qtPessoasCount: 0,
      condutores: new Set(),
    }
  );
  const climaTop = Object.keys(segurancaResumo.climas)
    .map((key) => ({ key, total: segurancaResumo.climas[key] }))
    .sort((a, b) => b.total - a.total)[0];
  const pessoasMedia = segurancaResumo.qtPessoasCount
    ? Math.round(segurancaResumo.qtPessoasTotal / segurancaResumo.qtPessoasCount)
    : 0;

  const docsMensais = manutencoesPeriodo.reduce(
    (acc, item) => {
      const docs = getItemDocs(item) || {};
      DOC_KEYS.forEach((key) => {
        if (key === "pt" && !isItemCritico(item)) {
          return;
        }
        if (docs[key]) {
          acc[key] += 1;
        }
      });
      return acc;
    },
    { apr: 0, os: 0, pte: 0, pt: 0 }
  );
  const equipesAtivas = new Set(
    manutencoesPeriodo.map((item) => getRelatorioResponsavel(item)).filter(Boolean)
  );
  const concluidasPeriodo = manutencoesPeriodo.filter((item) => item.status === "concluida");
  const pontuaisPeriodo = concluidasPeriodo.filter((item) => {
    const data = parseDate(item.data);
    const doneAt = parseTimestamp(item.doneAt);
    if (!data || !doneAt) {
      return false;
    }
    return startOfDay(doneAt) <= startOfDay(data);
  });
  const pontualidadeEquipe = concluidasPeriodo.length
    ? Math.round((pontuaisPeriodo.length / concluidasPeriodo.length) * 100)
    : 0;
  const criticasCount = manutencoesPeriodo.filter(
    (item) => item.critico || (item.prioridade || "").toLowerCase() === "critica"
  ).length;

  const daysTotal = Math.max(1, diffInDays(range.start, range.end) + 1);
  const dailySeries = Array.from({ length: daysTotal }, (_, index) => {
    const dia = addDays(range.start, index);
    return {
      date: dia,
      label: formatDate(dia),
      total: 0,
      backlog: 0,
      concluidas: 0,
      overdue: 0,
    };
  });
  manutencoesPeriodo.forEach((item) => {
    const dataRef = getRelatorioItemDate(item);
    if (!dataRef) {
      return;
    }
    const dia = startOfDay(dataRef);
    const diff = diffInDays(range.start, dia);
    if (diff < 0 || diff >= dailySeries.length) {
      return;
    }
    dailySeries[diff].total += 1;
    if (item.status === "concluida") {
      dailySeries[diff].concluidas += 1;
    }
    if (item.status === "backlog") {
      dailySeries[diff].backlog += 1;
    }
    if (isItemOverdue(item, range.end)) {
      dailySeries[diff].overdue += 1;
    }
  });
  const maxDaily = dailySeries.reduce((max, item) => Math.max(max, item.total), 1);
  const chartWidth = 560;
  const chartHeight = 140;
  const barWidth = dailySeries.length ? Math.max(12, Math.floor(chartWidth / dailySeries.length) - 6) : 12;
  const barGap = 6;
  const bars = dailySeries
    .map((item, index) => {
      const height = Math.round((item.total / maxDaily) * (chartHeight - 40));
      const x = index * (barWidth + barGap);
      const y = chartHeight - height - 20;
      return `<g>
        <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="#5b8def" rx="4" />
      </g>`;
    })
    .join("");
  const chartSvg = `
    <svg class="rdo-chart" viewBox="0 0 ${chartWidth} ${chartHeight}" role="img" aria-label="Volume diário">
      <rect x="0" y="0" width="${chartWidth}" height="${chartHeight}" fill="#f8f6f1" rx="12" />
      <line x1="0" y1="${chartHeight - 20}" x2="${chartWidth}" y2="${chartHeight - 20}" stroke="#d9d4c8" />
      ${bars}
    </svg>
  `;
  const statusTotals = manutencoesPeriodo.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );
  const totalDistribuicao = Math.max(1, manutencoesPeriodo.length);
  const statusConcluidas = statusTotals.concluida || 0;
  const statusExecucao = statusTotals.em_execucao || 0;
  const statusAbertas = (statusTotals.agendada || 0) + (statusTotals.liberada || 0);
  const statusBacklog = statusTotals.backlog || 0;
  const percConclusao = Math.round((statusConcluidas / totalDistribuicao) * 100);
  const percExecucao = Math.round((statusExecucao / totalDistribuicao) * 100);
  const percAbertas = Math.round((statusAbertas / totalDistribuicao) * 100);
  const percOverdue = Math.round((statusBacklog / totalDistribuicao) * 100);
  const donutSvg = `
    <svg class="rdo-donut" viewBox="0 0 120 120" role="img" aria-label="Distribuição de status">
      <circle cx="60" cy="60" r="46" fill="none" stroke="#e5e1d6" stroke-width="16" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#4bd28f" stroke-width="16"
        stroke-dasharray="${percConclusao} ${100 - percConclusao}" stroke-dashoffset="25" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#5b8def" stroke-width="16"
        stroke-dasharray="${percExecucao} ${100 - percExecucao}" stroke-dashoffset="${25 - percConclusao}" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#f6c453" stroke-width="16"
        stroke-dasharray="${percAbertas} ${100 - percAbertas}" stroke-dashoffset="${25 - percConclusao - percExecucao}" />
      <circle cx="60" cy="60" r="46" fill="none" stroke="#e2595c" stroke-width="16"
        stroke-dasharray="${percOverdue} ${100 - percOverdue}" stroke-dashoffset="${25 - percConclusao - percExecucao - percAbertas}" />
    </svg>
  `;

  const statusItems = [
    { key: "concluida", label: "Concluídas", color: "#4bd28f" },
    { key: "em_execucao", label: "Em execução", color: "#5b8def" },
    { key: "liberada", label: "Liberadas", color: "#9aa4af" },
    { key: "agendada", label: "Agendadas", color: "#f6c453" },
    { key: "backlog", label: "Backlog", color: "#e2595c" },
  ];
  const statusMax = statusItems.reduce((max, item) => Math.max(max, statusTotals[item.key] || 0), 1);
  const statusBars = statusItems
    .map((item, index) => {
      const height = Math.round(((statusTotals[item.key] || 0) / statusMax) * 90);
      const x = index * 52;
      const y = 110 - height;
      return `<g>
        <rect x="${x}" y="${y}" width="40" height="${height}" fill="${item.color}" rx="6" />
        <text x="${x + 20}" y="125" text-anchor="middle" font-size="9" fill="#5c6772">${escapeHtml(
          String(statusTotals[item.key] || 0)
        )}</text>
      </g>`;
    })
    .join("");
  const statusChart = `
    <svg class="rdo-chart" viewBox="0 0 260 140" role="img" aria-label="Manutenções por status">
      <rect x="0" y="0" width="260" height="140" fill="#f8f6f1" rx="12" />
      ${statusBars}
    </svg>
  `;

  const backlogLineMax = dailySeries.reduce((max, item) => Math.max(max, item.backlog), 1);
  const linePoints = dailySeries
    .map((item, index) => {
      const x = (index / Math.max(1, dailySeries.length - 1)) * 520 + 20;
      const y = 120 - Math.round((item.backlog / backlogLineMax) * 80);
      return `${x},${y}`;
    })
    .join(" ");
  const backlogChart = `
    <svg class="rdo-chart" viewBox="0 0 560 140" role="img" aria-label="Evolução diária do backlog">
      <rect x="0" y="0" width="560" height="140" fill="#f8f6f1" rx="12" />
      <polyline fill="none" stroke="#e2595c" stroke-width="3" points="${linePoints}" />
    </svg>
  `;

  const tipoDistribuicao = manutencoesPeriodo.reduce((acc, item) => {
    const tipo = (item.categoria || "Não informado").toLowerCase();
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});
  const tiposOrdenados = Object.keys(tipoDistribuicao)
    .map((key, index) => ({
      key,
      total: tipoDistribuicao[key],
      color: ["#4bd28f", "#5b8def", "#f6c453", "#e2595c", "#9a6bff"][index % 5],
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  const totalTipos = tiposOrdenados.reduce((acc, item) => acc + item.total, 0) || 1;
  let offset = 25;
  const pieSlices = tiposOrdenados
    .map((item) => {
      const percent = Math.round((item.total / totalTipos) * 100);
      const slice = `
        <circle cx="60" cy="60" r="46" fill="none" stroke="${item.color}" stroke-width="16"
          stroke-dasharray="${percent} ${100 - percent}" stroke-dashoffset="${offset}" />
      `;
      offset -= percent;
      return slice;
    })
    .join("");
  const pieChart = `
    <svg class="rdo-donut" viewBox="0 0 120 120" role="img" aria-label="Distribuição por tipo">
      <circle cx="60" cy="60" r="46" fill="none" stroke="#e5e1d6" stroke-width="16" />
      ${pieSlices}
    </svg>
  `;
  const pieLegend = tiposOrdenados
    .map(
      (item) =>
        `<span><i class="legend-dot" style="background:${item.color}"></i>${escapeHtml(
          item.key
        )} (${item.total})</span>`
    )
    .join("");

  const slaMensal = manutencoesPeriodo.filter((item) => item.status === "concluida");
  const slaNoPrazo = slaMensal.filter((item) => {
    const data = parseDate(item.data);
    const doneAt = parseTimestamp(item.doneAt);
    if (!data || !doneAt) {
      return false;
    }
    return startOfDay(doneAt) <= startOfDay(data);
  });
  const slaMensalPercent = slaMensal.length
    ? Math.round((slaNoPrazo.length / slaMensal.length) * 100)
    : 0;
  const slaChart = `
    <div class="rdo-month__sla">
      <div class="rdo-month__sla-bar">
        <span style="width:${slaMensalPercent}%">${slaMensalPercent}% no prazo</span>
      </div>
      <small>${100 - slaMensalPercent}% fora do SLA</small>
    </div>
  `;

  const backlogRate = manutencoesPeriodo.length
    ? Math.round(((statusTotals.backlog || 0) / manutencoesPeriodo.length) * 100)
    : 0;
  const criticasRate = manutencoesPeriodo.length
    ? Math.round(
        manutencoesPeriodo.filter(
          (item) => item.critico || (item.prioridade || "").toLowerCase() === "critica"
        ).length /
          manutencoesPeriodo.length *
          100
      )
    : 0;
  const tempoMedioExec = slaMensal.length
    ? formatDuracaoMin(
        Math.round(
          manutencoesPeriodo.reduce((acc, item) => {
            const duracao = item.conclusao && Number.isFinite(item.conclusao.duracaoMin)
              ? item.conclusao.duracaoMin
              : 0;
            return acc + duracao;
          }, 0) / Math.max(1, slaMensal.length)
        )
      )
    : "-";
  const prevMonthStart = new Date(range.start.getFullYear(), range.start.getMonth() - 1, 1);
  const prevMonthEnd = new Date(range.start.getFullYear(), range.start.getMonth(), 0);
  const prevRdos = rdoSnapshots.filter((item) => {
    const data = item.rdoDate ? parseDate(item.rdoDate) : null;
    return data ? inRange(startOfDay(data), startOfDay(prevMonthStart), startOfDay(prevMonthEnd)) : false;
  });
  const prevTotal = prevRdos.reduce((acc, item) => acc + ((item.metricas && item.metricas.total) || 0), 0);
  const tendencia = prevTotal
    ? manutencoesPeriodo.length > prevTotal
      ? "↑"
      : manutencoesPeriodo.length < prevTotal
        ? "↓"
        : "→"
    : "→";

  const linhas = rdos
    .map((item) => {
      const dataLabel = item.rdoDate ? formatDate(parseDate(item.rdoDate)) : "-";
      const filtros = item.filtros || {};
      const metricas = item.metricas || {};
      return `<tr>
        <td>${escapeHtml(dataLabel)}</td>
        <td>${escapeHtml(filtros.subestacao || "-")}</td>
        <td>${escapeHtml(filtros.categoria || "-")}</td>
        <td>${escapeHtml(filtros.prioridade || "-")}</td>
        <td>${escapeHtml(filtros.usuario || "-")}</td>
        <td>${escapeHtml(String(metricas.total || 0))}</td>
        <td>${escapeHtml(String(metricas.concluidas || 0))}</td>
        <td>${escapeHtml(String(metricas.criticas || 0))}</td>
      </tr>`;
    })
    .join("");
  const resumoDiaTotals = rdos.reduce(
    (acc, item) => {
      const metricas = item.metricas || {};
      acc.total += metricas.total || 0;
      acc.concluidas += metricas.concluidas || 0;
      acc.criticas += metricas.criticas || 0;
      return acc;
    },
    { total: 0, concluidas: 0, criticas: 0 }
  );

  const blocos = rdos
    .map((item) => {
      const dataLabel = item.rdoDate ? formatDate(parseDate(item.rdoDate)) : "-";
      const emitidoEm = item.createdAt ? formatDateTime(parseTimestamp(item.createdAt)) : "-";
      const emitidoPor = item.createdBy ? getUserLabel(item.createdBy) : "Sistema";
      const filtros = item.filtros || {};
      const manual = item.manual || {};
      const metricas = item.metricas || {};
      const resumo = item.resumoDia || "-";
      const narrativa = item.narrativaDia || "-";
      const docsPercentDia =
        metricas.docsTotal && metricas.docsPercent !== null
          ? `${metricas.docsPercent}%`
          : metricas.docsTotal
            ? `${Math.round((metricas.docsOk / metricas.docsTotal) * 100)}%`
            : "-";
      const isEmpty = !metricas.total;
      return `
        <details class="rdo-month__day" ${isEmpty ? "" : "open"}>
          <summary class="rdo-month__day-head">
            <div>
              <strong>RDO ${escapeHtml(dataLabel)}</strong>
              <span>Emitido em ${escapeHtml(emitidoEm)} por ${escapeHtml(emitidoPor)}</span>
            </div>
            <span class="rdo-badge">Atividades: ${escapeHtml(String(metricas.total || 0))}</span>
          </summary>
          ${isEmpty ? "<p>Sem atividades registradas neste dia.</p>" : ""}
          <div class="rdo-month__grid">
            <div>
              <span>Subestação</span>
              <strong>${escapeHtml(filtros.subestacao || "-")}</strong>
            </div>
            <div>
              <span>Categoria</span>
              <strong>${escapeHtml(filtros.categoria || "-")}</strong>
            </div>
            <div>
              <span>Prioridade</span>
              <strong>${escapeHtml(filtros.prioridade || "-")}</strong>
            </div>
            <div>
              <span>Usuário</span>
              <strong>${escapeHtml(filtros.usuario || "-")}</strong>
            </div>
            <div>
              <span>Local</span>
              <strong>${escapeHtml(manual.local || "-")}</strong>
            </div>
            <div>
              <span>Condutor</span>
              <strong>${escapeHtml(manual.condutor || "-")}</strong>
            </div>
            <div>
              <span>KM inicial/final</span>
              <strong>${escapeHtml(manual.kmInicial || "-")} / ${escapeHtml(manual.kmFinal || "-")}</strong>
            </div>
            <div>
              <span>Qt. pessoas</span>
              <strong>${escapeHtml(manual.qtPessoas || "-")}</strong>
            </div>
            <div>
              <span>Clima</span>
              <strong>${escapeHtml(
                manual.clima === "OUTRO" && manual.climaOutro ? `OUTRO - ${manual.climaOutro}` : manual.clima || "-"
              )}</strong>
            </div>
            <div>
              <span>Incidente</span>
              <strong>${escapeHtml(manual.incidente || "-")}</strong>
            </div>
            <div>
              <span>Bloqueio elétrico</span>
              <strong>${escapeHtml(manual.bloqueio || "-")}</strong>
            </div>
            <div>
              <span>SI / SGI</span>
              <strong>${escapeHtml(manual.numeroSi || "-")} / ${escapeHtml(manual.numeroSgi || "-")}</strong>
            </div>
            <div>
              <span>Concluídas</span>
              <strong>${escapeHtml(String(metricas.concluidas || 0))}</strong>
            </div>
            <div>
              <span>Em execução</span>
              <strong>${escapeHtml(String(metricas.emExecucao || 0))}</strong>
            </div>
            <div>
              <span>Críticas</span>
              <strong>${escapeHtml(String(metricas.criticas || 0))}</strong>
            </div>
            <div>
              <span>Overdue</span>
              <strong>${escapeHtml(String(metricas.overdue || 0))}</strong>
            </div>
            <div>
              <span>Docs</span>
              <strong>${escapeHtml(docsPercentDia)}</strong>
            </div>
            <div>
              <span>Tempo total</span>
              <strong>${escapeHtml(
                metricas.tempoTotalMin && metricas.tempoTotalMin > 0
                  ? formatDuracaoMin(metricas.tempoTotalMin)
                  : "-"
              )}</strong>
            </div>
          </div>
          <div class="rdo-month__notes">
            <div>
              <h4>Resumo do dia</h4>
              <p>${escapeHtml(resumo)}</p>
            </div>
            <div>
              <h4>Narrativa técnica</h4>
              <p>${escapeHtml(narrativa)}</p>
            </div>
          </div>
        </details>
      `;
    })
    .join("");

  const html = `
    <div class="rdo-month rdo-doc">
      <header class="rdo-header">
          <div class="rdo-brand">
            <div class="rdo-brand__row">
              <img class="rdo-logo" src="./assets/engelmig-logo.png" alt="ENGELMIG" width="110" height="40" />
              <div>
                <span class="rdo-eyebrow">OPSCOPE</span>
                <h2 class="rdo-title">RELATÓRIO MENSAL DE OPERAÇÃO</h2>
                <p class="rdo-subtitle">Consolidado executivo do período</p>
              </div>
            </div>
          </div>
        <div class="rdo-meta">
          <span>RDO-M: ${escapeHtml(hashMensal)}</span>
          <span>Período: ${escapeHtml(periodoLabel)}</span>
          <span>Cliente: ${escapeHtml(cliente)}</span>
          <span>Emitido por: ${escapeHtml(emissor)}</span>
          <span>Emitido em: ${escapeHtml(formatDateTime(new Date()))}</span>
        </div>
      </header>
      <div class="rdo-header-info">
        <div>
          <span>Projeto/Planta</span>
          <strong>${escapeHtml(projetoLabel)}</strong>
        </div>
        <div>
          <span>Cliente</span>
          <strong>${escapeHtml(cliente)}</strong>
        </div>
        <div>
          <span>Setor</span>
          <strong>${escapeHtml(RDO_SETOR)}</strong>
        </div>
        <div>
          <span>Local</span>
          <strong>Consolidado</strong>
        </div>
      </div>
      <section class="rdo-section rdo-summary">
        <h3>Resumo Executivo</h3>
        <p>${escapeHtml(resumoExec)}</p>
        <div class="rdo-summary-grid rdo-summary-grid--cards">
          <div class="rdo-summary-item"><span>RDOs</span><strong>${acumulado.totalRdos}</strong></div>
          <div class="rdo-summary-item"><span>Atividades</span><strong>${manutencoesPeriodo.length}</strong></div>
          <div class="rdo-summary-item"><span>Concluídas</span><strong>${statusConcluidas}</strong></div>
          <div class="rdo-summary-item"><span>Em execução</span><strong>${statusExecucao}</strong></div>
          <div class="rdo-summary-item"><span>Críticas</span><strong>${criticasCount}</strong></div>
          <div class="rdo-summary-item"><span>Backlog</span><strong>${statusBacklog}</strong></div>
          <div class="rdo-summary-item"><span>Docs OK</span><strong>${docsPercent}%</strong></div>
          <div class="rdo-summary-item"><span>SLA no prazo</span><strong>${slaPercent}%</strong></div>
          <div class="rdo-summary-item"><span>Evidências</span><strong>${acumulado.evidencias}</strong></div>
          <div class="rdo-summary-item"><span>Tempo total</span><strong>${tempoTotalLabel}</strong></div>
        </div>
      </section>
      <section class="rdo-section rdo-block">
        <h3>KPIs Gerenciais</h3>
        <div class="rdo-kpi-grid">
          <div class="rdo-kpi-card rdo-kpi-card--ok"><span>SLA mensal</span><strong>${slaPercent}%</strong></div>
          <div class="rdo-kpi-card rdo-kpi-card--warn"><span>Taxa de backlog</span><strong>${backlogRate}%</strong></div>
          <div class="rdo-kpi-card rdo-kpi-card--danger"><span>Taxa de críticas</span><strong>${criticasRate}%</strong></div>
          <div class="rdo-kpi-card rdo-kpi-card--info"><span>Tempo médio de execução</span><strong>${tempoMedioExec}</strong></div>
          <div class="rdo-kpi-card rdo-kpi-card--neutral"><span>Tendência</span><strong>${tendencia}</strong></div>
        </div>
      </section>
      <section class="rdo-section rdo-block rdo-month__charts">
        <div>
          <h4>Volume diário de atividades</h4>
          ${chartSvg}
          <small>Conta de manutenções registradas por dia no período.</small>
        </div>
        <div>
          <h4>Manutenções por status</h4>
          ${statusChart}
          <small>Distribuição de status (concluídas, backlog, agendadas).</small>
        </div>
        <div>
          <h4>Distribuição de status</h4>
          <div class="rdo-month__donut">
            ${donutSvg}
            <div class="rdo-legend">
              <span><i class="legend-dot legend-dot--ok"></i>Concluídas (${percConclusao}%)</span>
              <span><i class="legend-dot legend-dot--info"></i>Em execução (${percExecucao}%)</span>
              <span><i class="legend-dot legend-dot--warn"></i>Abertas (${percAbertas}%)</span>
              <span><i class="legend-dot legend-dot--danger"></i>Backlog (${percOverdue}%)</span>
            </div>
          </div>
          <small>Percentual consolidado do mês por status operacional.</small>
        </div>
        <div>
          <h4>Evolução diária do backlog</h4>
          ${backlogChart}
          <small>Backlog diário com base nas OS atrasadas.</small>
        </div>
        <div>
          <h4>Distribuição por tipo</h4>
          <div class="rdo-month__donut">
            ${pieChart}
            <div class="rdo-legend">
              ${pieLegend}
            </div>
          </div>
          <small>Tipos de manutenção predominantes no período.</small>
        </div>
        <div>
          <h4>SLA mensal</h4>
          ${slaChart}
          <small>Percentual de concluída no prazo vs fora do SLA.</small>
        </div>
      </section>
      <section class="rdo-section rdo-block">
        <h3>Segurança e logística</h3>
        <div class="rdo-month__grid">
          <div><span>Incidentes</span><strong>${segurancaResumo.incidentes}</strong></div>
          <div><span>Bloqueios elétricos</span><strong>${segurancaResumo.bloqueios}</strong></div>
          <div><span>Clima dominante</span><strong>${escapeHtml(climaTop ? climaTop.key : "-")}</strong></div>
          <div><span>KM total</span><strong>${segurancaResumo.kmTotal.toFixed(1)}</strong></div>
          <div><span>Qt. pessoas (média)</span><strong>${pessoasMedia}</strong></div>
          <div><span>Condutores</span><strong>${segurancaResumo.condutores.size}</strong></div>
          <div><span>APR abertas</span><strong>${docsMensais.apr}</strong></div>
          <div><span>OS abertas</span><strong>${docsMensais.os}</strong></div>
          <div><span>PTE abertas</span><strong>${docsMensais.pte}</strong></div>
          <div><span>PT abertas</span><strong>${docsMensais.pt}</strong></div>
        </div>
      </section>
      <section class="rdo-section rdo-block">
        <h3>Desenvolvimento da equipe ENGELMIG</h3>
        <div class="rdo-month__grid">
          <div><span>Projeto</span><strong>${escapeHtml(projetoLabel)}</strong></div>
          <div><span>Equipes ativas</span><strong>${equipesAtivas.size}</strong></div>
          <div><span>Execuções concluídas</span><strong>${concluidasPeriodo.length}</strong></div>
          <div><span>Pontualidade</span><strong>${pontualidadeEquipe}%</strong></div>
          <div><span>Backlog</span><strong>${backlogRate}%</strong></div>
          <div><span>Evolução mensal</span><strong>${tendencia}</strong></div>
        </div>
        <p>
          Evolução técnica do time com foco em disciplina operacional, entrega no prazo e maturidade de processos.
        </p>
      </section>
      <section class="rdo-section rdo-block">
        <h3>Resumo operacional por dia</h3>
        <div class="report-table__wrap">
          <table class="report__table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Subestação</th>
              <th>Categoria</th>
              <th>Prioridade</th>
              <th>Usuário</th>
              <th>Atividades</th>
              <th>Concluídas</th>
              <th>Críticas</th>
            </tr>
          </thead>
          <tbody>
            ${linhas || `<tr><td colspan="8">Nenhum RDO no período.</td></tr>`}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">Total do período</td>
              <td>${resumoDiaTotals.total}</td>
              <td>${resumoDiaTotals.concluidas}</td>
              <td>${resumoDiaTotals.criticas}</td>
            </tr>
          </tfoot>
          </table>
        </div>
      </section>
      <section class="rdo-section rdo-block">
        <h3>Tabela consolidada</h3>
        <div class="report-table__wrap">
          <table class="report__table">
          <thead>
            <tr>
              <th>Manutenção</th>
              <th>Local</th>
              <th>Data</th>
              <th>Status</th>
              <th>Responsável</th>
              <th>Prioridade</th>
            </tr>
          </thead>
          <tbody>
            ${
              manutencoesPeriodo.length
                ? manutencoesPeriodo
                    .slice(0, 200)
                    .map((item) => {
                      const data = getRelatorioItemDate(item);
                      const label = data ? formatDate(data) : "-";
                      const responsavel = getRelatorioResponsavel(item) || "-";
                      const status = item.status || "-";
                      const statusKey = String(status).toLowerCase();
                      const prioridade = item.prioridade || "-";
                      const prioridadeKey = String(prioridade).toLowerCase();
                      return `<tr>
                        <td>${escapeHtml(item.titulo || "-")}</td>
                        <td>${escapeHtml(item.local || "-")}</td>
                        <td>${escapeHtml(label)}</td>
                        <td><span class="status-badge status-badge--${escapeHtml(
                          statusKey
                        )}">${escapeHtml(status)}</span></td>
                        <td>${escapeHtml(responsavel)}</td>
                        <td><span class="priority-badge priority-badge--${escapeHtml(
                          prioridadeKey
                        )}">${escapeHtml(prioridade)}</span></td>
                      </tr>`;
                    })
                    .join("")
                : `<tr><td colspan="6">Nenhuma manutenção no período.</td></tr>`
            }
          </tbody>
          <tfoot>
            <tr>
              <td colspan="5">Total de manutenções</td>
              <td>${manutencoesPeriodo.length}</td>
            </tr>
          </tfoot>
          </table>
        </div>
      </section>
      <section class="rdo-section rdo-note">
        <h3>Análise técnica do período</h3>
        <p>
          ${escapeHtml(
            acumulado.overdue
              ? `Foram identificadas ${acumulado.overdue} atividades overdue, indicando gargalos no fluxo de execução e necessidade de ajustes na programação.`
              : "Não foram identificadas atividades overdue no período."
          )}
        </p>
        <p>
          ${escapeHtml(
            acumulado.criticas
              ? `Houve ${acumulado.criticas} manutenções críticas; recomenda-se priorizar recursos e revisar planos de contingência.`
              : "Sem manutenções críticas registradas."
          )}
        </p>
        <p>
          ${escapeHtml(
            docsPercent < 90
              ? "O compliance documental ficou abaixo da meta; reforçar captura de evidências e checklists operacionais."
              : "Compliance documental dentro do esperado."
          )}
        </p>
      </section>
      <section class="rdo-section rdo-note">
        <h3>Conclusão gerencial</h3>
        <p>
          ${escapeHtml(
            acumulado.totalRdos
              ? `O período apresentou ${slaPercent}% de SLA no prazo, com ${acumulado.concluidas} concluídas e ${backlogRate}% de backlog. Recomenda-se manter o foco nas frentes críticas e sustentar a disciplina operacional.`
              : "Não houve movimentação operacional no período. Sem impactos registrados."
          )}
        </p>
      </section>
      <section class="rdo-section">
        <h3>Detalhamento diário</h3>
        <div class="rdo-items">
          ${blocos || `<div class="rdo-item">Nenhum RDO no período.</div>`}
        </div>
      </section>
    </div>
  `;
  if (returnHtml) {
    return html;
  }
  return abrirJanelaRelatorio(html, "RDO mensal - OPSCOPE", imprimir);
}

function abrirRdoMensalPreview() {
  if (!rdoMensalPreviewModal || !rdoMensalPreviewBody) {
    return false;
  }
  const html = gerarRdoMensal(false, true);
  rdoMensalPreviewBody.innerHTML = html;
  rdoMensalPreviewModal.hidden = false;
  return true;
}

function fecharRdoMensalPreview() {
  if (!rdoMensalPreviewModal) {
    return;
  }
  rdoMensalPreviewModal.hidden = true;
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
        <h2>Relatórios Diários (RDO)</h2>
        <p class="hint">Consolide a operação do dia com texto técnico e evidências.</p>
      </div>
      <button id="btnGerarRdo" class="btn btn--primary" type="button">Gerar RDO do dia</button>
    </div>
    <div class="rdo-actions">
      <label class="rdo-toggle">
        <input id="rdoShowDeleted" type="checkbox" />
        <span>Exibir excluídos</span>
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
          <h3>Relatório Diário de Operação</h3>
          <p class="hint">Geração automática baseada na execução do dia.</p>
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
            <label for="rdoSubestacao">Subestação</label>
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
            <label for="rdoUsuario">Usuário</label>
            <select id="rdoUsuario">
              <option value="">Todos</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoLimite">Limite de evidências no PDF</label>
            <select id="rdoLimite">
              <option value="8">8</option>
              <option value="16" selected>16</option>
              <option value="32">32</option>
            </select>
          </div>
          <div class="field">
            <label for="rdoCondutor">Condutor do veículo</label>
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
              <option value="">Sem locais</option>
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
            <label for="rdoBloqueio">Bloqueio elétrico</label>
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
        <div class="field rdo-shift-block" data-full>
          <label id="rdoShiftLabel">Horas e acionamentos</label>
          <div class="rdo-shift-toggles">
            <label class="checkbox-field">
              <input id="rdoAcionamentoToggle" type="checkbox" />
              <span>Acionamento</span>
            </label>
            <div class="rdo-shift-time">
              <input id="rdoAcionamentoInicio" type="time" disabled />
              <input id="rdoAcionamentoFim" type="time" disabled />
            </div>
            <label class="checkbox-field">
              <input id="rdoHoraExtraToggle" type="checkbox" />
              <span>Hora extra</span>
            </label>
            <div class="rdo-shift-time">
              <input id="rdoHoraExtraInicio" type="time" disabled />
              <input id="rdoHoraExtraFim" type="time" disabled />
            </div>
          </div>
          <div class="rdo-shift-list" id="rdoJornadaList"></div>
          <small class="hint" id="rdoShiftHint">
            Informe entrada e saida dos colaboradores do projeto. Expediente: 07:00-17:00
            (seg-qui) e 07:00-16:00 (sex).
          </small>
        </div>
        <div class="field" data-full>
          <label for="rdoRegistro">Registro gerencial do dia</label>
          <textarea id="rdoRegistro" rows="2" placeholder="Opcional"></textarea>
        </div>
        <p id="rdoMensagem" class="mensagem" aria-live="polite"></p>
        <div class="modal__actions">
          <button id="btnRdoPreview" class="btn btn--ghost btn--small" type="button">Preview</button>
          <button id="btnRdoExportar" class="btn btn--primary btn--small" type="button">Exportar PDF</button>
          <button id="btnRdoExportarCliente" class="btn btn--ghost btn--small" type="button">
            Exportar PDF cliente
          </button>
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
  rdoUI.acionamentoToggle = modal.querySelector("#rdoAcionamentoToggle");
  rdoUI.acionamentoInicio = modal.querySelector("#rdoAcionamentoInicio");
  rdoUI.acionamentoFim = modal.querySelector("#rdoAcionamentoFim");
  rdoUI.horaExtraToggle = modal.querySelector("#rdoHoraExtraToggle");
  rdoUI.horaExtraInicio = modal.querySelector("#rdoHoraExtraInicio");
  rdoUI.horaExtraFim = modal.querySelector("#rdoHoraExtraFim");
  rdoUI.jornadaList = modal.querySelector("#rdoJornadaList");
  rdoUI.clima = modal.querySelector("#rdoClima");
  rdoUI.climaOutroField = modal.querySelector("#rdoClimaOutroField");
  rdoUI.climaOutro = modal.querySelector("#rdoClimaOutro");
  rdoUI.incidente = modal.querySelector("#rdoIncidente");
  rdoUI.bloqueio = modal.querySelector("#rdoBloqueio");
  rdoUI.local = modal.querySelector("#rdoLocal");
  rdoUI.numeroSi = modal.querySelector("#rdoSi");
  rdoUI.numeroSgi = modal.querySelector("#rdoSgi");
  rdoUI.shiftLabel = modal.querySelector("#rdoShiftLabel");
  rdoUI.shiftHint = modal.querySelector("#rdoShiftHint");
  rdoUI.preview = modal.querySelector("#rdoPreview");
  rdoUI.previewBody = modal.querySelector("#rdoPreviewBody");
  rdoUI.mensagem = modal.querySelector("#rdoMensagem");
  rdoUI.btnPreview = modal.querySelector("#btnRdoPreview");
  rdoUI.btnExportar = modal.querySelector("#btnRdoExportar");
  rdoUI.btnExportarCliente = modal.querySelector("#btnRdoExportarCliente");
  rdoUI.btnFechar = modal.querySelector("[data-rdo-close]");
  rdoUI.btnVoltar = modal.querySelector("#btnRdoVoltar");
  rdoUI.deleteModal = modalDelete;
  rdoUI.deleteReason = modalDelete.querySelector("#rdoDeleteReason");
  rdoUI.deleteMensagem = modalDelete.querySelector("#rdoDeleteMensagem");
  rdoUI.btnDeleteConfirm = modalDelete.querySelector("#btnRdoDeleteConfirm");
  rdoUI.btnDeleteCancel = modalDelete.querySelector("#btnRdoDeleteCancel");

  renderRdoLocaisOptions();
  updateRdoShiftLabels();

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
  if (rdoUI.btnExportarCliente) {
    rdoUI.btnExportarCliente.addEventListener("click", async () => {
      const isReadOnly = rdoUI.modal && rdoUI.modal.dataset.readonly === "true";
      const snapshot = isReadOnly ? rdoPreviewSnapshot : await gerarSnapshotRdo(true);
      if (snapshot) {
        await exportarRdoPdf(snapshot, { cliente: true });
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
  if (rdoUI.acionamentoToggle) {
    rdoUI.acionamentoToggle.addEventListener("change", () => {
      toggleRdoHorarioFields(
        rdoUI.acionamentoToggle,
        rdoUI.acionamentoInicio,
        rdoUI.acionamentoFim
      );
    });
  }
  if (rdoUI.horaExtraToggle) {
    rdoUI.horaExtraToggle.addEventListener("change", () => {
      toggleRdoHorarioFields(
        rdoUI.horaExtraToggle,
        rdoUI.horaExtraInicio,
        rdoUI.horaExtraFim
      );
    });
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
      if (botao.dataset.action === "rdo-pdf-cliente") {
        await exportarRdoPdf(snapshot, { cliente: true });
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

  aplicarPermissoesRdo();
}

function aplicarPermissoesRdo() {
  if (!rdoUI.card) {
    return;
  }
  const podeVer = Boolean(currentUser && canViewRdo(currentUser));
  const podeGerar = Boolean(currentUser && canGerarRelatorio(currentUser));
  const podeExcluir = Boolean(currentUser && canExcluirRdo(currentUser));
  rdoUI.card.hidden = !podeVer;
  if (!podeVer) {
    return;
  }
  if (rdoUI.btnGerar) {
    rdoUI.btnGerar.disabled = !podeGerar;
    rdoUI.btnGerar.classList.toggle("is-disabled", !podeGerar);
  }
  if (rdoUI.btnExcluir) {
    rdoUI.btnExcluir.disabled = !podeExcluir;
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
    const btnPdfCliente = document.createElement("button");
    btnPdfCliente.type = "button";
    btnPdfCliente.className = "btn btn--ghost btn--small";
    btnPdfCliente.dataset.action = "rdo-pdf-cliente";
    btnPdfCliente.textContent = "PDF cliente";
    if (snapshot.deletedAt) {
      btnPdf.disabled = true;
      btnPdfCliente.disabled = true;
    }
    actions.append(btnAbrir, btnPdf, btnPdfCliente);

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
  if (!currentUser || !canExcluirRdo(currentUser)) {
    mostrarMensagemRdo("Sem permissão para excluir RDO.", true);
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
  if (!currentUser || !canViewRdo(currentUser)) {
    mostrarMensagemRdo("Sem permissão para acessar RDO.", true);
    return;
  }
  if (!snapshot && !canGerarRelatorio(currentUser)) {
    mostrarMensagemRdo("Sem permissão para gerar RDO.", true);
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
  if (rdoUI.acionamentoToggle) {
    rdoUI.acionamentoToggle.checked = Boolean(manual.acionamento && manual.acionamento.ativo);
  }
  if (rdoUI.acionamentoInicio) {
    rdoUI.acionamentoInicio.value =
      manual.acionamento && manual.acionamento.inicio ? manual.acionamento.inicio : "";
  }
  if (rdoUI.acionamentoFim) {
    rdoUI.acionamentoFim.value =
      manual.acionamento && manual.acionamento.fim ? manual.acionamento.fim : "";
  }
  if (rdoUI.horaExtraToggle) {
    rdoUI.horaExtraToggle.checked = Boolean(manual.horaExtra && manual.horaExtra.ativo);
  }
  if (rdoUI.horaExtraInicio) {
    rdoUI.horaExtraInicio.value =
      manual.horaExtra && manual.horaExtra.inicio ? manual.horaExtra.inicio : "";
  }
  if (rdoUI.horaExtraFim) {
    rdoUI.horaExtraFim.value =
      manual.horaExtra && manual.horaExtra.fim ? manual.horaExtra.fim : "";
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
    renderRdoLocaisOptions(manual.local || "");
  }
  if (rdoUI.numeroSi) {
    rdoUI.numeroSi.value = manual.numeroSi || "";
  }
  if (rdoUI.numeroSgi) {
    rdoUI.numeroSgi.value = manual.numeroSgi || "";
  }
  renderRdoJornadas(manual);
  toggleRdoHorarioFields(rdoUI.acionamentoToggle, rdoUI.acionamentoInicio, rdoUI.acionamentoFim);
  toggleRdoHorarioFields(rdoUI.horaExtraToggle, rdoUI.horaExtraInicio, rdoUI.horaExtraFim);
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
  if (rdoUI.btnExportarCliente) {
    rdoUI.btnExportarCliente.disabled = Boolean(snapshot && snapshot.deletedAt);
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
    rdoUI.acionamentoToggle,
    rdoUI.acionamentoInicio,
    rdoUI.acionamentoFim,
    rdoUI.horaExtraToggle,
    rdoUI.horaExtraInicio,
    rdoUI.horaExtraFim,
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
  setRdoJornadaReadOnly(readOnly);
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

function renderRdoLocaisOptions(selected) {
  if (!rdoUI.local) {
    return;
  }
  const locais = getActiveProjectLocais();
  rdoUI.local.innerHTML = "";
  const selectedValue = selected ? String(selected).trim() : "";
  if (selectedValue && !locais.includes(selectedValue)) {
    const opt = document.createElement("option");
    opt.value = selectedValue;
    opt.textContent = selectedValue;
    rdoUI.local.append(opt);
  }
  if (!locais.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Sem locais";
    rdoUI.local.append(opt);
    rdoUI.local.disabled = true;
    return;
  }
  rdoUI.local.disabled = false;
  locais.forEach((local) => {
    const opt = document.createElement("option");
    opt.value = local;
    opt.textContent = local;
    rdoUI.local.append(opt);
  });
  const safeSelected = selectedValue && locais.includes(selectedValue) ? selectedValue : locais[0];
  if (safeSelected) {
    rdoUI.local.value = safeSelected;
  }
}

function updateRdoShiftLabels() {
  const label = getActiveProjectShortLabel();
  if (rdoUI.shiftLabel) {
    rdoUI.shiftLabel.textContent = `Horas e acionamentos (${label})`;
  }
  if (rdoUI.shiftHint) {
    rdoUI.shiftHint.textContent = `Informe entrada e saida dos colaboradores do ${label}. Expediente: 07:00-17:00 (seg-qui) e 07:00-16:00 (sex).`;
  }
}

function getActiveProjectEquipeIds() {
  const ids = Array.isArray(projectEquipe)
    ? projectEquipe.map((entry) => entry && entry.userId).filter(Boolean)
    : [];
  return new Set(ids);
}

function isUserFromActiveProject(user) {
  if (!user) {
    return false;
  }
  if (activeProjectId && user.projectId && user.projectId === activeProjectId) {
    return true;
  }
  const equipeIds = getActiveProjectEquipeIds();
  if (equipeIds.size && equipeIds.has(user.id)) {
    return true;
  }
  const targetLabel = normalizeSearchValue(getProjectLabel(getActiveProject()));
  const userLabel = normalizeSearchValue(getUserProjectLabel(user));
  if (targetLabel && userLabel && userLabel.includes(targetLabel)) {
    return true;
  }
  return false;
}

function renderRdoJornadas(manual = {}) {
  if (!rdoUI.jornadaList) {
    return;
  }
  const dataStr = rdoUI.data ? rdoUI.data.value : "";
  const dataBase = dataStr ? parseDate(dataStr) : null;
  const schedule = getRdoScheduleFromDate(dataBase || new Date());
  const jornadas = Array.isArray(manual.jornadas) ? manual.jornadas : [];
  const jornadasMap = new Map(
    jornadas.map((item) => [String(item.userId || item.nome || item.label || ""), item])
  );
  const colaboradores = users
    .filter((user) => user && (user.name || user.username))
    .filter(isUserFromActiveProject)
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));

  if (!colaboradores.length && !jornadas.length) {
    const label = getActiveProjectShortLabel();
    rdoUI.jornadaList.innerHTML = `<p class="empty-state">Nenhum colaborador do ${escapeHtml(label)} cadastrado.</p>`;
    return;
  }

  if (!colaboradores.length && jornadas.length) {
    rdoUI.jornadaList.innerHTML = jornadas
      .map((item) => {
        const label = item.nome || item.label || "Colaborador";
        return `
          <div class="rdo-shift-row" data-user-id="${escapeHtml(item.userId || "")}">
            <div class="rdo-shift-name">${escapeHtml(label)}</div>
            <div class="rdo-shift-inputs">
              <label>Entrada</label>
              <input type="time" data-shift="entrada" value="${escapeHtml(item.entrada || "")}" />
              <label>Saida</label>
              <input type="time" data-shift="saida" value="${escapeHtml(item.saida || "")}" />
            </div>
          </div>
        `;
      })
      .join("");
    return;
  }

  rdoUI.jornadaList.innerHTML = colaboradores
    .map((user) => {
      const label = getUserLabel(user.id);
      const ref = jornadasMap.get(String(user.id)) || jornadasMap.get(label) || {};
      return `
        <div class="rdo-shift-row" data-user-id="${escapeHtml(user.id)}">
          <div class="rdo-shift-name">${escapeHtml(label)}</div>
          <div class="rdo-shift-inputs">
            <label>Entrada</label>
            <input type="time" data-shift="entrada" value="${escapeHtml(
              ref.entrada || ""
            )}" placeholder="07:00" />
            <label>Saida</label>
            <input type="time" data-shift="saida" value="${escapeHtml(
              ref.saida || ""
            )}" placeholder="${schedule.fim === 16 * 60 ? "16:00" : "17:00"}" />
          </div>
        </div>
      `;
    })
    .join("");
}

function toggleRdoHorarioFields(toggle, inicio, fim) {
  if (!toggle || !inicio || !fim) {
    return;
  }
  const ativo = toggle.checked;
  inicio.disabled = !ativo;
  fim.disabled = !ativo;
  if (!ativo) {
    inicio.value = "";
    fim.value = "";
  }
}

function setRdoJornadaReadOnly(readOnly) {
  if (!rdoUI.jornadaList) {
    return;
  }
  rdoUI.jornadaList
    .querySelectorAll("input")
    .forEach((input) => (input.disabled = readOnly));
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
  const jornadas = rdoUI.jornadaList
    ? Array.from(rdoUI.jornadaList.querySelectorAll(".rdo-shift-row"))
        .map((row) => {
          const entradaInput = row.querySelector("input[data-shift='entrada']");
          const saidaInput = row.querySelector("input[data-shift='saida']");
          return {
            userId: row.dataset.userId || "",
            nome: row.querySelector(".rdo-shift-name")
              ? row.querySelector(".rdo-shift-name").textContent.trim()
              : "",
            entrada: entradaInput ? entradaInput.value : "",
            saida: saidaInput ? saidaInput.value : "",
          };
        })
        .filter((item) => item.entrada || item.saida)
    : [];
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
    acionamento: {
      ativo: rdoUI.acionamentoToggle ? rdoUI.acionamentoToggle.checked : false,
      inicio: rdoUI.acionamentoInicio ? rdoUI.acionamentoInicio.value : "",
      fim: rdoUI.acionamentoFim ? rdoUI.acionamentoFim.value : "",
    },
    horaExtra: {
      ativo: rdoUI.horaExtraToggle ? rdoUI.horaExtraToggle.checked : false,
      inicio: rdoUI.horaExtraInicio ? rdoUI.horaExtraInicio.value : "",
      fim: rdoUI.horaExtraFim ? rdoUI.horaExtraFim.value : "",
    },
    jornadas,
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
        .concat(getSubestacoesBase())
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
    return `A execução ocorreu entre ${inicio} e ${fim}.`;
  }
  if (inicio) {
    return `Início registrado em ${inicio}. Fim sem registro no período.`;
  }
  if (fim) {
    return `Fim registrado em ${fim}. Início sem registro no período.`;
  }
  return "Sem registro de início e fim no período.";
}

function gerarTextoItemRdo(item) {
  const tipo = (item.categoria || "").trim().toLowerCase();
  const tipoLabel = tipo ? `manutenção ${tipo}` : "manutenção";
  const chave = item.id || item.titulo || "";
  const variante = Number.parseInt(hashString(chave).slice(0, 2), 16) % 3;
  const titulo = item.titulo || "atividade";
  const subestacao = item.subestacao || "subestação não informada";
  let abertura = `Durante o período, foi executada ${tipoLabel} em ${subestacao}.`;
  if (variante === 1) {
    abertura = `No período, a equipe realizou ${tipoLabel} em ${subestacao}, vinculada a ${titulo}.`;
  }
  if (variante === 2) {
    abertura = `Foi registrada ${tipoLabel} em ${subestacao} durante o período, referente a ${titulo}.`;
  }
  const descricao = item.descricao
    ? `Descrição técnica: ${item.descricao}.`
    : "Sem registro de descrição técnica no período.";
  const diagnostico = item.descricao
    ? `Diagnóstico: ${item.descricao}.`
    : "Sem registro de diagnóstico no período.";
  const acao = item.observacaoExecucao
    ? `Ação executada: ${item.observacaoExecucao}.`
    : "Sem registro de ação detalhada no período.";
  const janela = formatJanelaExecucaoRdo(item.inicio, item.fim);
  const responsavel = item.responsavel
    ? `Responsável: ${item.responsavel}.`
    : "Sem registro de responsável no período.";
  const participantes =
    item.participantes && item.participantes !== "-"
      ? `Participantes: ${item.participantes}.`
      : "Sem registro de participantes no período.";
  const evidencias = item.evidenciasCount
    ? `Foram registradas ${item.evidenciasCount} evidências fotográficas.`
    : "Sem evidências fotográficas registradas no período.";
  const docs = item.docsResumo
    ? `Documentação registrada no sistema: ${item.docsResumo}.`
    : "Sem registro de documentação no período.";
  const resultado = item.resultadoLabel ? `Resultado: ${item.resultadoLabel}.` : "";
  const status = item.statusLabel ? `Status final: ${item.statusLabel}.` : "Status final: -.";
  const criticidade = item.critico ? "Classificação: crítica." : "";
  const duracao =
    Number.isFinite(item.duracaoMin) && item.duracaoMin > 0
      ? `Tempo total de execução: ${formatDuracaoMin(item.duracaoMin)}.`
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
    ? `Observação de execução: ${item.observacaoExecucao}.`
    : "Sem registro de observações adicionais no período.";
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
    return "Sem registro de atividades no período.";
  }
  const parts = [];
  parts.push(
    `Foram registradas ${metricas.total} atividades no período, com ${metricas.concluidas} concluídas e ${metricas.abertas} em andamento.`
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
      `Subestações com maior volume: ${topSubs
        .map((item) => `${item.key} (${item.total})`)
        .join(", ")}.`
    );
  }
  const corretivas = itensRdo.filter(
    (item) => (item.categoria || "").toLowerCase() === "corretiva"
  ).length;
  if (corretivas || metricas.criticas) {
    parts.push(
      `Destaques: ${corretivas} corretivas e ${metricas.criticas} críticas no período.`
    );
  }
  const docsPendentes = metricas.docsTotal - metricas.docsOk;
  if (metricas.overdue || docsPendentes > 0) {
    parts.push(
      `Pendências: ${metricas.overdue} overdue e ${docsPendentes} atividades com documentação pendente.`
    );
  } else {
    parts.push("Sem pendências críticas no período.");
  }
  return parts.join(" ");
}

function gerarNarrativaDiaRdo(itensRdo, metricas) {
  if (!itensRdo.length) {
    return "Sem registro de execuções no período.";
  }
  const parts = [];
  const tempoTotal =
    metricas.tempoTotalMin && metricas.tempoTotalMin > 0
      ? formatDuracaoMin(metricas.tempoTotalMin)
      : "sem registro";
  parts.push(`Tempo total de execução no período: ${tempoTotal}.`);
  const corretivas = itensRdo.filter(
    (item) => (item.categoria || "").toLowerCase() === "corretiva"
  ).length;
  const preditivas = itensRdo.filter(
    (item) => (item.categoria || "").toLowerCase() === "preditiva"
  ).length;
  if (corretivas || preditivas || metricas.criticas) {
    parts.push(
      `Atividades críticas: ${metricas.criticas}. Corretivas: ${corretivas}. Preditivas: ${preditivas}.`
    );
  }
  if (metricas.docsTotal) {
    parts.push(
      `Compliance documental: ${metricas.docsPercent}% (${metricas.docsOk}/${metricas.docsTotal}).`
    );
  } else {
    parts.push("Sem base documental consolidada no período.");
  }
  const ocorrencias = itensRdo.filter(
    (item) => item.descricao || item.observacaoExecucao
  );
  if (ocorrencias.length) {
    const destaques = ocorrencias.slice(0, 2).map((item) => item.titulo).join(", ");
    parts.push(
      `Observações técnicas registradas em ${ocorrencias.length} atividades${destaques ? `, destaque para: ${destaques}` : ""}.`
    );
  }
  if (metricas.overdue) {
    parts.push(`Permanecem ${metricas.overdue} itens overdue com necessidade de tratativa.`);
  } else {
    parts.push("Sem itens overdue registrados no período.");
  }
  return parts.join(" ");
}

function gerarDescricaoConsolidadaRdo(itensRdo, metricas) {
  if (!itensRdo.length) {
    return {
      resumo: "Sem registro de execuções no período.",
      pontos: [],
    };
  }
  const resumo = `Foram registradas ${metricas.total} atividades no período, com ${metricas.concluidas} concluídas, ${metricas.emExecucao} em execução e ${metricas.overdue} pendentes.`;
  const pontos = [];
  if (metricas.criticas) {
    pontos.push(`Atividades críticas: ${metricas.criticas}.`);
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
    pontos.push(`Documentação pendente em ${docsPendentes} atividade(s).`);
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
    pontos.push("Sem apontamentos adicionais no período.");
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

function stripHtml(html) {
  const container = document.createElement("div");
  container.innerHTML = html || "";
  return container.textContent || "";
}

function sanitizeRichText(html) {
  const allowedTags = new Set([
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "P",
    "BR",
    "UL",
    "OL",
    "LI",
    "BLOCKQUOTE",
    "H3",
    "DIV",
    "SPAN",
    "FONT",
  ]);
  const allowedFonts = new Set(["Segoe UI", "Arial", "Georgia", "Courier New"]);
  const allowedSizes = new Set(["2", "3", "4", "5", "6"]);
  const allowedStyleProps = new Set([
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "text-decoration",
  ]);

  const root = document.createElement("div");
  root.innerHTML = html || "";

  const cleanNode = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.COMMENT_NODE) {
        child.remove();
        return;
      }
      if (child.nodeType === Node.TEXT_NODE) {
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) {
        child.remove();
        return;
      }
      const tag = child.tagName.toUpperCase();
      if (!allowedTags.has(tag)) {
        const fragment = document.createDocumentFragment();
        while (child.firstChild) {
          fragment.append(child.firstChild);
        }
        child.replaceWith(fragment);
        return;
      }

      if (tag === "FONT") {
        const face = child.getAttribute("face") || "";
        const size = child.getAttribute("size") || "";
        Array.from(child.attributes).forEach((attr) => {
          if (!["face", "size"].includes(attr.name)) {
            child.removeAttribute(attr.name);
          }
        });
        if (face && !allowedFonts.has(face)) {
          child.removeAttribute("face");
        }
        if (size && !allowedSizes.has(size)) {
          child.removeAttribute("size");
        }
      } else if (tag === "SPAN") {
        const style = child.getAttribute("style") || "";
        if (style) {
          const safeStyles = [];
          style.split(";").forEach((rule) => {
            const [rawProp, rawValue] = rule.split(":");
            if (!rawProp || !rawValue) {
              return;
            }
            const prop = rawProp.trim().toLowerCase();
            const value = rawValue.trim();
            if (!allowedStyleProps.has(prop)) {
              return;
            }
            if (prop === "font-family") {
              const font = value.replace(/['\"]/g, "");
              if (!allowedFonts.has(font)) {
                return;
              }
              safeStyles.push(`font-family:${font}`);
              return;
            }
            if (prop === "font-size") {
              const px = value.replace("px", "");
              const pxVal = Number(px);
              if (!Number.isFinite(pxVal) || pxVal < 10 || pxVal > 22) {
                return;
              }
              safeStyles.push(`font-size:${pxVal}px`);
              return;
            }
            if (prop === "text-decoration") {
              if (value.toLowerCase().includes("underline")) {
                safeStyles.push("text-decoration: underline");
              }
              return;
            }
            safeStyles.push(`${prop}:${value}`);
          });
          if (safeStyles.length) {
            child.setAttribute("style", safeStyles.join("; "));
          } else {
            child.removeAttribute("style");
          }
        }
        Array.from(child.attributes).forEach((attr) => {
          if (attr.name !== "style") {
            child.removeAttribute(attr.name);
          }
        });
      } else {
        Array.from(child.attributes).forEach((attr) => child.removeAttribute(attr.name));
      }

      cleanNode(child);
    });
  };

  cleanNode(root);
  return root.innerHTML;
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
    mostrarMensagemRdo("Data inválida.", true);
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
    projectId: activeProjectId,
    projectLabel: getActiveProject() ? getActiveProject().nome : "",
    projectCode: getActiveProject() ? getActiveProject().codigo : "",
    projectClient: getActiveProject() ? getActiveProject().cliente : "",
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
  try {
    rdoUI.previewBody.innerHTML = buildRdoHtml(snapshot);
    rdoUI.preview.hidden = false;
    rdoUI.preview.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    mostrarMensagemRdo("Não foi possível montar o preview do RDO.", true);
    rdoUI.preview.hidden = false;
    rdoUI.previewBody.innerHTML = `<p class="empty-state">Preview indisponível.</p>`;
  }
}

function buildRdoHtml(snapshot, options = {}) {
  const isCliente = Boolean(options.cliente);
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
      ? `Evidências limitadas a ${snapshot.limiteEvidencias} no PDF.`
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
  const projeto =
    snapshot.projectLabel ||
    snapshot.projectCode ||
    (snapshot.filtros && snapshot.filtros.subestacao ? snapshot.filtros.subestacao : RDO_PROJETO);
  const cliente = snapshot.projectClient || getActiveProjectClient();
  const local = manual.local || getDefaultRdoLocal();
  const climaValor = manual.clima === "OUTRO" && manual.climaOutro
    ? `OUTRO - ${manual.climaOutro}`
    : manual.clima || "-";
  const jornadas = Array.isArray(manual.jornadas) ? manual.jornadas : [];
  const schedule = getRdoScheduleFromDate(dataParsed || new Date());
  const jornadasRows = jornadas.map((item) => {
    const entrada = item.entrada || "";
    const saida = item.saida || "";
    const duracaoMin = calcDurationMinutes(entrada, saida);
    const entradaMin = parseTimeToMinutes(entrada);
    const saidaMin = parseTimeToMinutes(saida);
    const expedienteMin =
      entradaMin === null || saidaMin === null || saidaMin < entradaMin
        ? 0
        : calcOverlapMinutes(entradaMin, saidaMin, schedule.inicio, schedule.fim);
    const extraMin = Math.max(0, duracaoMin - expedienteMin);
    return {
      nome: item.nome || item.label || item.userLabel || "Colaborador",
      entrada: entrada || "-",
      saida: saida || "-",
      duracaoMin,
      expedienteMin,
      extraMin,
    };
  });
  const totalJornadaMin = jornadasRows.reduce((acc, row) => acc + (row.duracaoMin || 0), 0);
  const totalExpedienteMin = jornadasRows.reduce((acc, row) => acc + (row.expedienteMin || 0), 0);
  const totalExtraCalcMin = jornadasRows.reduce((acc, row) => acc + (row.extraMin || 0), 0);
  const acionamentoMin =
    manual.acionamento && manual.acionamento.ativo
      ? calcDurationMinutes(manual.acionamento.inicio, manual.acionamento.fim)
      : 0;
  const horaExtraMin =
    manual.horaExtra && manual.horaExtra.ativo
      ? calcDurationMinutes(manual.horaExtra.inicio, manual.horaExtra.fim)
      : 0;
  const descricaoConsolidada = gerarDescricaoConsolidadaRdo(snapshot.itens || [], snapshot.metricas);
  const rdoNumero = snapshot.id ? snapshot.id.slice(0, 6).toUpperCase() : "-";
  const resumoItens = [
    { label: "Atividades", value: snapshot.metricas.total },
    { label: "Concluídas", value: snapshot.metricas.concluidas },
    { label: "Em execução", value: snapshot.metricas.emExecucao },
    { label: "Críticas", value: snapshot.metricas.criticas },
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
  const jornadaRowsHtml = jornadasRows.length
    ? `
      <table class="rdo-table rdo-table--compact">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Entrada</th>
            <th>Saída</th>
            <th>Horas</th>
            <th>Expediente</th>
            <th>Extra calc</th>
          </tr>
        </thead>
        <tbody>
          ${jornadasRows
            .map(
              (row) => `
              <tr>
                <td>${escapeHtml(row.nome)}</td>
                <td>${escapeHtml(row.entrada)}</td>
                <td>${escapeHtml(row.saida)}</td>
                <td>${row.duracaoMin ? escapeHtml(formatDuracaoMin(row.duracaoMin)) : "-"}</td>
                <td>${row.expedienteMin ? escapeHtml(formatDuracaoMin(row.expedienteMin)) : "-"}</td>
                <td>${row.extraMin ? escapeHtml(formatDuracaoMin(row.extraMin)) : "-"}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `
    : `<p class="empty-state">Sem apontamentos de jornada no período.</p>`;
  const acionamentoLabel =
    manual.acionamento && manual.acionamento.ativo
      ? `${manual.acionamento.inicio || "-"} - ${manual.acionamento.fim || "-"}`
      : "Não informado";
  const horaExtraLabel =
    manual.horaExtra && manual.horaExtra.ativo
      ? `${manual.horaExtra.inicio || "-"} - ${manual.horaExtra.fim || "-"}`
      : "Não informado";
  const jornadaResumoHtml = `
    <div class="rdo-summary-grid rdo-summary-grid--cards rdo-summary-grid--tight">
      <div class="rdo-summary-item">
        <span>Jornada total</span>
        <strong>${totalJornadaMin ? formatDuracaoMin(totalJornadaMin) : "-"}</strong>
        <small>${jornadasRows.length} colaboradores</small>
      </div>
      <div class="rdo-summary-item">
        <span>Expediente</span>
        <strong>${totalExpedienteMin ? formatDuracaoMin(totalExpedienteMin) : "-"}</strong>
        <small>Base ${schedule.label}</small>
      </div>
      <div class="rdo-summary-item">
        <span>Extra calculada</span>
        <strong>${totalExtraCalcMin ? formatDuracaoMin(totalExtraCalcMin) : "-"}</strong>
        <small>Acima do expediente</small>
      </div>
      <div class="rdo-summary-item">
        <span>Hora extra</span>
        <strong>${horaExtraMin ? formatDuracaoMin(horaExtraMin) : "-"}</strong>
        <small>${escapeHtml(horaExtraLabel)}</small>
      </div>
      <div class="rdo-summary-item">
        <span>Acionamento</span>
        <strong>${acionamentoMin ? formatDuracaoMin(acionamentoMin) : "-"}</strong>
        <small>${escapeHtml(acionamentoLabel)}</small>
      </div>
    </div>
  `;

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
        `Início: ${inicio}`,
        `Fim: ${fim}`,
        `Duração: ${duracao}`,
        item.responsavel ? `Responsável: ${item.responsavel}` : "Responsável: -",
        item.participantes && item.participantes !== "-"
          ? `Participantes: ${item.participantes}`
          : "Participantes: -",
        `Evidências: ${item.evidenciasCount}`,
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
          <p class="rdo-docs-note">Documentação registrada no sistema: ${escapeHtml(
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
    : `<p class="empty-state">Sem evidências fotográficas no período.</p>`;

  const naoImagemHtml = snapshot.evidenciasNaoImagem.length
    ? `
      <div class="rdo-naoimagem">
        <strong>Evidências não-imagem</strong>
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
            <h2 class="rdo-title">${
              isCliente
                ? "RELATÓRIO DE OPERAÇÃO DIÁRIA - HV (CLIENTE)"
                : "RELATÓRIO DE OPERAÇÃO DIÁRIA - HV"
            }</h2>
            <p class="rdo-subtitle">Relatório Diário de Operação</p>
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
          <strong>${escapeHtml(cliente)}</strong>
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

      <section class="rdo-section rdo-block rdo-header-shifts">
        <h3>Controle de jornada</h3>
        ${jornadaResumoHtml}
        ${jornadaRowsHtml}
      </section>

      <section class="rdo-section rdo-summary">
        <h3>Resumo Executivo</h3>
        <p>${escapeHtml(snapshot.resumoDia || "")}</p>
        <div class="rdo-summary-grid">
          ${resumoOperacional}
        </div>
      </section>

      <section class="rdo-section rdo-block">
        <h3>Segurança</h3>
        <div class="rdo-info-grid">
          <div>
            <span>Incidente/Acidente</span>
            <strong>${escapeHtml(manual.incidente || "-")}</strong>
          </div>
          <div>
            <span>Bloqueio Elétrico</span>
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
          ${
            isCliente
              ? ""
              : `
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
          `
          }
          <div>
            <span>Qt. pessoas</span>
            <strong>${escapeHtml(manual.qtPessoas || "-")}</strong>
          </div>
          <div>
            <span>Nº de SI</span>
            <strong>${escapeHtml(manual.numeroSi || "-")}</strong>
          </div>
          <div>
            <span>Nº de SGI</span>
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
              <th>Subestação</th>
              <th>Status</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="6">Sem itens no período.</td></tr>`}
          </tbody>
        </table>
      </section>

      <section class="rdo-section">
        <h3>Descrição Consolidada do Dia</h3>
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
          ${detalhes || `<p class="empty-state">Sem itens no período.</p>`}
        </div>
      </section>

      <section class="rdo-section">
        <h3>Evidências</h3>
        ${evidenciasLimitadas ? `<p class="hint">${escapeHtml(evidenciasLimitadas)}</p>` : ""}
        <div class="rdo-evidencias-grid">
          ${evidenciasHtml}
        </div>
        ${naoImagemHtml}
      </section>
    </div>
  `;
}

function buildRdoPrintHtml(snapshot, logoDataUrl = "", options = {}) {
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
    .rdo-summary-grid--tight { grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); }
    .rdo-summary-item { border: 1px solid #d6d1c6; border-radius: 10px; padding: 6px 8px; display: grid; gap: 2px; background: #fff; }
    .rdo-summary-grid--cards .rdo-summary-item { background: #fff; box-shadow: 0 6px 10px rgba(0,0,0,0.06); }
    .rdo-summary-item span { font-size: 0.6rem; letter-spacing: 0.12em; text-transform: uppercase; color: #425363; }
    .rdo-summary-item strong { font-size: 0.9rem; }
    .rdo-summary-item small { font-size: 0.65rem; color: #425363; }
    .rdo-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; table-layout: fixed; }
    .rdo-table th, .rdo-table td { border-bottom: 1px solid #d6d1c6; padding: 6px 8px; }
    .rdo-table th { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; background: #f8f6f1; color: #425363; }
    .rdo-table td { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .rdo-table--compact th, .rdo-table--compact td { font-size: 0.7rem; }
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
  let body = buildRdoHtml(snapshot, options);
  if (logoDataUrl) {
    body = body.replace('src="./assets/engelmig-logo.png"', `src="${logoDataUrl}"`);
  }
  const titleLabel = options.cliente ? "RDO cliente" : "RDO";
  return `
    <!doctype html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <title>${titleLabel} ${escapeHtml(snapshot.rdoDate || "")}</title>
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

async function exportarRdoPdf(snapshot, options = {}) {
  if (!snapshot) {
    return;
  }
  const logoDataUrl = await carregarLogoRdoDataUrl();
  const html = buildRdoPrintHtml(snapshot, logoDataUrl, options);
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
  kpiConcluidas.textContent = `${concluidas.length} concluídas`;
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
  return `O que é: ${titulo}\nComo calcula: ${formula}\nPeríodo: ${periodo}`;
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
    return isCriticoValor(item.liberacao.critico);
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
        .concat(getSubestacoesBase())
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
  const periodoLabel = `últimos ${filtros.periodo} dias`;
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
        "Manutenções com status backlog.",
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
        "Manutenções abertas com data programada menor que hoje.",
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
        "Concluídas no prazo / concluídas no período.",
        periodoLabel
      ),
    },
    {
      key: "lead_time",
      label: "Lead time médio",
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
        "Conclusão - criação (dias).",
        periodoLabel
      ),
    },
    {
      key: "mttr",
      label: "MTTR médio",
      valor: atual.mttrMedio,
      delta: formatKpiDelta(atual.mttrMedio, anterior.mttrMedio, "duration", filtros.periodo),
      formato: "duration",
      tooltip: buildKpiTooltip(
        "MTTR médio",
        "Fim da execução - início da execução.",
        periodoLabel
      ),
    },
    {
      key: "criticos_abertos",
      label: "Críticos em aberto",
      valor: atual.criticosAbertos,
      delta: formatKpiDelta(
        atual.criticosAbertos,
        anterior.criticosAbertos,
        "count",
        filtros.periodo
      ),
      formato: "count",
      tooltip: buildKpiTooltip(
        "Críticos em aberto",
        "Manutenções críticas não concluídas.",
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
  const trendPeriodo = `últimas ${semanasCount} semanas`;
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
          "Manutenções concluídas por semana.",
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
          "Manutenções em backlog por semana.",
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
    "Concluídas no prazo / concluídas na semana.",
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
      label: "Usuário",
      tooltip: buildKpiTooltip(
        "Usuário",
        "Responsável pela execução.",
        "Filtro atual"
      ),
    },
    {
      label: "Concluídas",
      sortKey: "concluidas",
      tooltip: buildKpiTooltip(
        "Concluídas",
        "Total de manutenções concluídas.",
        `últimos ${filtros.periodo} dias`
      ),
    },
    {
      label: "Overdue aberto",
      sortKey: "overdue",
      tooltip: buildKpiTooltip(
        "Overdue aberto",
        "Manutenções em aberto com data atrasada.",
        `últimos ${filtros.periodo} dias`
      ),
    },
    {
      label: "Lead time médio",
      sortKey: "lead",
      tooltip: buildKpiTooltip(
        "Lead time médio",
        "Conclusão - criação (dias).",
        `últimos ${filtros.periodo} dias`
      ),
    },
    {
      label: "MTTR médio",
      sortKey: "mttr",
      tooltip: buildKpiTooltip(
        "MTTR médio",
        "Fim - início da execução.",
        `últimos ${filtros.periodo} dias`
      ),
    },
    {
      label: "% docs OK",
      sortKey: "docs",
      tooltip: buildKpiTooltip(
        "Compliance docs",
        "APR/OS/PTE e PT quando crítico.",
        `últimos ${filtros.periodo} dias`
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
    // formatação valores ranking
    const cols = [
      { value: getUserLabel(linha.userId) },
      { value: linha.concluidas },
      { value: linha.overdue },
      {
        value: lead === null ? "\u2014" : `${lead.toFixed(1)}d`,
        tooltip: lead === null ? "Sem base de cálculo" : "",
      },
      {
        value: mttr === null ? "\u2014" : formatDuracaoKpi(mttr),
        tooltip: mttr === null ? "Sem base de cálculo" : "",
      },
      {
        value: docsPercent === null ? "\u2014" : `${docsPercent}%`,
        tooltip: docsPercent === null ? "Sem documentos no período" : "",
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
    kpiDrilldownTitulo.textContent = "Clique em um KPI ou gráfico para listar.";
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
  kpiDrilldownTitulo.textContent = `Métrica: ${kpiDrilldown.titulo} | Itens: ${itensVisiveis.length} | Período: ${periodoLabel} | Subestação: ${subestacaoLabel} | Categoria: ${categoriaLabel} | Prioridade: ${prioridadeLabel} | Usuário: ${usuarioLabel}`;

  const table = document.createElement("table");
  table.className = "kpi-table kpi-table--compact";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const colunas = [
    { label: "Manutenção", className: "is-wide" },
    { label: "Subestação" },
    { label: "Status", className: "is-center" },
    { label: "Programada", className: "is-date" },
    { label: "Início", className: "is-date" },
    { label: "Fim", className: "is-date" },
    { label: "Responsável" },
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
    titulo = "Lead time médio";
  } else if (tipo === "mttr") {
    filtrados = itens.filter(
      (item) => item.status === "concluida" && getItemInicioExecucaoDate(item) && getItemFimExecucaoDate(item)
    );
    titulo = "MTTR médio";
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
      titulo = `Usuário ${getUserLabel(userId)}`;
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
  const subestacaoLabel = subestacao || "Subestação não definida";
  const tipo = templateFrequencia ? templateFrequencia.value : "none";
  const inicioStr = templateInicio ? templateInicio.value : "";
  const inicioDate = parseDate(inicioStr);
  const inicioLabel = inicioDate ? formatDate(inicioDate) : "-";

  const linhas = [];
  const linhaTitulo = `${nome || "Nome do modelo"} - ${subestacaoLabel}`;
  linhas.push(linhaTitulo);

  if (tipo === "none") {
    linhas.push(
      `Este modelo NÃO possui recorrência automática. Uso apenas como modelo manual. Início: ${inicioLabel}.`
    );
  } else if (tipo === "daily") {
    const dias = getDailyDaysFromForm();
    const lista = dias.length ? dias.map(getWeekdayShort).filter(Boolean).join(", ") : "a definir";
    linhas.push(
      `Este modelo irá gerar manutenções DIÁRIAS nos dias: [${lista}], a partir de ${inicioLabel}, para: ${subestacaoLabel}.`
    );
  } else if (tipo === "weekly") {
    const diaSemana = templateWeeklyDay ? getWeekdayLabel(templateWeeklyDay.value) : "";
    const intervaloRaw = templateWeeklyInterval ? Number(templateWeeklyInterval.value) : 1;
    const intervalo = Math.max(1, Math.round(intervaloRaw || 1));
    const diaLabel = diaSemana || "Dia não definido";
    linhas.push(
      `Este modelo irá gerar manutenções SEMANAIS toda(o) ${diaLabel}, a cada ${intervalo} semana(s), a partir de ${inicioLabel}, para: ${subestacaoLabel}.`
    );
  } else if (tipo === "monthly") {
    const modo = templateMonthlyMulti && templateMonthlyMulti.checked ? "multi" : "fixed";
    if (modo === "multi") {
      const dias = parseMonthlyDaysInputValue(templateMonthlyDaysInput ? templateMonthlyDaysInput.value : "");
      const lista = dias.length ? dias.join(", ") : "a definir";
      linhas.push(
        `Este modelo irá gerar manutenções MENSAIS nos dias ${lista} de cada mês, a partir de ${inicioLabel}, para: ${subestacaoLabel}.`
      );
    } else {
      const dia = templateMonthlyDay ? templateMonthlyDay.value : "";
      const diaLabel = dia || "-";
      linhas.push(
        `Este modelo irá gerar manutenções MENSAIS no dia ${diaLabel} de cada mês, a partir de ${inicioLabel}, para: ${subestacaoLabel}.`
      );
    }
    linhas.push(
      "Obs.: quando o mês não possuir o dia configurado, a ocorrência será IGNORADA."
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
        "Informe dias válidos entre 1 e 31 (ex.: 10, 25)."
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
    return "Sem recorrência";
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

  return "Sem recorrência";
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
  renderProjectSelectOptions(templateProjeto, activeProjectId);
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
  if (!activeProjectId) {
    mostrarMensagemTemplate("Selecione um projeto ativo antes de salvar.", true);
    return;
  }
  if (templateProjeto && templateProjeto.value && templateProjeto.value !== activeProjectId) {
    mostrarMensagemTemplate("O projeto selecionado e diferente do ativo. Troque o projeto e tente novamente.", true);
    return;
  }
  clearTemplateErrors();
  mostrarMensagemTemplate("");
  const nome = templateNome ? templateNome.value.trim() : "";
  if (!nome) {
    setFieldError(templateNomeErro, "Informe o nome do modelo.");
    return;
  }
  const subestacao =
    (templateSubestacao ? templateSubestacao.value.trim() : "") ||
    getSubestacoesBase()[0] ||
    "";
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
    setFieldError(templateInicioErro, "Data de início inválida.");
    return;
  }
  if (frequencia === "daily" && !dailyDays.length) {
    setFieldError(templateDailyErro, "Selecione ao menos um dia.");
    return;
  }
  if (frequencia === "weekly" && (!Number.isFinite(weeklyDay) || !weeklyIntervalValid)) {
    setFieldError(templateWeeklyIntervalErro, "Informe um intervalo semanal válido (>= 1).");
    return;
  }
  if (frequencia === "monthly") {
    if (monthlyMode === "fixed" && !monthlyDayValid) {
      setFieldError(templateMonthlyDayErro, "Informe um dia do mês válido (1 a 31).");
      return;
    }
    if (monthlyMode === "multi") {
      if (!monthlyValidation.valid) {
        setFieldError(
          templateMonthlyDaysErro,
          "Informe dias válidos entre 1 e 31 (ex.: 10, 25)."
        );
        return;
      }
      if (!monthlyDays.length) {
        setFieldError(
          templateMonthlyDaysErro,
          "Informe ao menos um dia do mês para a recorrência."
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
      new Set([...getSubestacoesBase(), ...existentes.map((item) => item.subestacao).filter(Boolean)])
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
        ? "Sem recorrência"
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

function getPmpFrequency(value) {
  const normalized = normalizeSearchValue(value).replace(/\s+/g, "");
  return PMP_FREQUENCIES.find((item) => item.value === normalized) || null;
}

function getPmpTipoInfo(value) {
  const normalized = normalizeSearchValue(value).replace(/\s+/g, "");
  return PMP_TIPOS.find((item) => item.value === normalized) || null;
}

function isWeekend(date) {
  if (!date) {
    return false;
  }
  const day = date.getDay();
  return day === 0 || day === 6;
}

function shouldSkipWeekend(activity, date) {
  return Boolean(activity && activity.onlyWeekdays) && isWeekend(date);
}

function parseDurationToMinutes(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.round(value));
  }
  const text = String(value || "").trim();
  if (!text) {
    return 0;
  }
  if (text.includes(":")) {
    const [h, m] = text.split(":");
    const horas = Number(h);
    const minutos = Number(m);
    if (Number.isFinite(horas) && Number.isFinite(minutos)) {
      return Math.max(0, Math.round(horas * 60 + minutos));
    }
  }
  const numeric = Number(text);
  if (Number.isFinite(numeric)) {
    return Math.max(0, Math.round(numeric));
  }
  return 0;
}

function normalizePmpChecklistItems(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .map((item) => {
      if (!item) {
        return null;
      }
      if (typeof item === "string") {
        const text = item.trim();
        return text ? { descricao: text, link: "" } : null;
      }
      const descricao = String(item.descricao || item.label || "").trim();
      const link = String(item.link || item.url || "").trim();
      if (!descricao && !link) {
        return null;
      }
      return { descricao, link };
    })
    .filter(Boolean);
}

function renderPmpChecklist() {
  if (!pmpChecklistList) {
    return;
  }
  pmpChecklistList.innerHTML = "";
  if (!pmpChecklistItems.length) {
    const vazio = document.createElement("li");
    vazio.textContent = "Nenhum item adicionado.";
    pmpChecklistList.append(vazio);
    return;
  }
  pmpChecklistItems.forEach((item, index) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = item.descricao || "Item";
    li.append(label);
    if (item.link) {
      const link = document.createElement("a");
      link.href = item.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Abrir";
      li.append(link);
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost btn--small";
    btn.dataset.pmpChecklistRemove = String(index);
    btn.textContent = "Remover";
    li.append(btn);
    pmpChecklistList.append(li);
  });
}

function addPmpChecklistItem() {
  const descricao = pmpChecklistItem ? pmpChecklistItem.value.trim() : "";
  const link = pmpChecklistLink ? pmpChecklistLink.value.trim() : "";
  if (!descricao && !link) {
    return;
  }
  pmpChecklistItems = [...pmpChecklistItems, { descricao, link }];
  if (pmpChecklistItem) {
    pmpChecklistItem.value = "";
  }
  if (pmpChecklistLink) {
    pmpChecklistLink.value = "";
  }
  renderPmpChecklist();
}

async function uploadPmpProcedimento(file) {
  if (!file) {
    return;
  }
  if (!currentUser || !canUploadPmpProcedimento(currentUser)) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Somente PCM pode anexar procedimentos.";
    }
    return;
  }
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Envie um arquivo PDF.";
    }
    return;
  }
  if (file.size > FILE_MAX_BYTES) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Arquivo acima de 10 MB.";
    }
    return;
  }
  if (pmpProcedimentoUpload) {
    pmpProcedimentoUpload.disabled = true;
  }
  if (pmpFormMensagem) {
    pmpFormMensagem.textContent = "Enviando procedimento...";
  }
  try {
    const formData = new FormData();
    formData.append("type", "procedure");
    formData.append("file", file);
    const data = await apiUploadFile(formData);
    if (data && data.file) {
      setPmpProcedimentoDoc(data.file);
      if (pmpFormMensagem) {
        pmpFormMensagem.textContent = "Procedimento anexado. Salve a atividade para vincular.";
      }
    }
  } catch (error) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = error.message || "Falha ao enviar procedimento.";
    }
  } finally {
    if (pmpProcedimentoUpload) {
      pmpProcedimentoUpload.disabled = false;
    }
    if (pmpProcedimentoFile) {
      pmpProcedimentoFile.value = "";
    }
  }
}

function resolvePmpExecutionDate(value) {
  if (value instanceof Date) {
    return value;
  }
  return parseAnyDate(value);
}

function getPmpYearValue() {
  const current = new Date().getFullYear();
  const valor = pmpAno ? Number(pmpAno.value) : current;
  return Number.isFinite(valor) && valor > 0 ? valor : current;
}

function getPmpMonthValue() {
  const current = new Date().getMonth();
  const valor = pmpMes ? Number(pmpMes.value) : current;
  return Number.isFinite(valor) && valor >= 0 && valor <= 11 ? valor : current;
}

function getPmpViewMode() {
  if (pmpView && pmpView.value === "day") {
    return "day";
  }
  return pmpView && pmpView.value === "week" ? "week" : "month";
}

function buildWeeksInYear(year) {
  const weeks = [];
  const startYear = new Date(year, 0, 1);
  let current = startOfWeek(startYear);
  let index = 1;
  const endYear = new Date(year, 11, 31);
  while (current <= endYear || (current.getFullYear() === year && current <= endYear)) {
    const start = new Date(current);
    const end = addDays(start, 6);
    if (end.getFullYear() < year) {
      current = addDays(current, 7);
      continue;
    }
    weeks.push({
      index,
      label: `W${String(index).padStart(2, "0")}`,
      start,
      end,
      key: `W${String(index).padStart(2, "0")}`,
    });
    current = addDays(current, 7);
    index += 1;
    if (index > 54) {
      break;
    }
  }
  return weeks;
}

function getWeekNumber(date) {
  const base = startOfDay(date);
  const start = new Date(base.getFullYear(), 0, 1);
  const diff = Math.floor((base - start) / 86400000);
  const startOffset = (start.getDay() + 6) % 7;
  return Math.floor((diff + startOffset) / 7) + 1;
}

function getPmpPeriods(viewMode, year, monthIndex) {
  if (viewMode === "week") {
    return buildWeeksInYear(year);
  }
  if (viewMode === "day") {
    const month = Number.isFinite(monthIndex) ? monthIndex : new Date().getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, idx) => {
      const day = idx + 1;
      const start = new Date(year, month, day);
      return {
        index: idx,
        label: String(day).padStart(2, "0"),
        start,
        end: start,
        key: `D${String(day).padStart(2, "0")}`,
      };
    });
  }
  return PMP_MONTH_LABELS.map((label, idx) => {
    const start = new Date(year, idx, 1);
    const end = new Date(year, idx + 1, 0);
    return {
      index: idx,
      label,
      start,
      end,
      key: `M${String(idx + 1).padStart(2, "0")}`,
    };
  });
}

function getActivityStartDate(activity, year) {
  const byDate = activity && activity.inicio ? parseDate(activity.inicio) : null;
  const byDateTime = activity && activity.inicio ? parseTimestamp(activity.inicio) : null;
  if (byDate) {
    return byDate;
  }
  if (byDateTime) {
    return byDateTime;
  }
  return new Date(year, 0, 1);
}

function getScheduledDateForMonth(activity, year, monthIndex) {
  const start = getActivityStartDate(activity, year);
  const day = start ? start.getDate() : 1;
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return new Date(year, monthIndex, Math.min(day, lastDay));
}

function getScheduledMonths(activity, year) {
  const freq = getPmpFrequency(activity && activity.frequencia);
  if (!freq) {
    return new Set();
  }
  const allowed = getActivityAllowedMonths(activity);
  const start = getActivityStartDate(activity, year);
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  if (year < startYear) {
    return new Set();
  }
  if (freq.unit === "year") {
    if ((year - startYear) % freq.interval !== 0) {
      return new Set();
    }
    const result = new Set([startMonth]);
    if (shouldSkipWeekend(activity, getScheduledDateForMonth(activity, year, startMonth))) {
      return new Set();
    }
    if (allowed) {
      return new Set(Array.from(result).filter((month) => allowed.has(month)));
    }
    return result;
  }
  if (freq.unit === "month") {
    const months = new Set();
    let current = year === startYear ? startMonth : 0;
    for (let m = current; m < 12; m += freq.interval) {
      if (year === startYear && m < startMonth) {
        continue;
      }
      const date = getScheduledDateForMonth(activity, year, m);
      if (shouldSkipWeekend(activity, date)) {
        continue;
      }
      months.add(m);
    }
    if (allowed) {
      return new Set(Array.from(months).filter((month) => allowed.has(month)));
    }
    return months;
  }
  const months = new Set();
  const first = year === startYear ? startMonth : 0;
  for (let m = first; m < 12; m += 1) {
    const date = getScheduledDateForMonth(activity, year, m);
    if (shouldSkipWeekend(activity, date)) {
      continue;
    }
    months.add(m);
  }
  if (allowed) {
    return new Set(Array.from(months).filter((month) => allowed.has(month)));
  }
  return months;
}

function getScheduledDays(activity, year, monthIndex) {
  const freq = getPmpFrequency(activity && activity.frequencia);
  if (!freq || !Number.isFinite(monthIndex)) {
    return new Set();
  }
  if (!isMonthAllowed(activity, monthIndex)) {
    return new Set();
  }
  const start = getActivityStartDate(activity, year);
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  if (year < startYear) {
    return new Set();
  }
  if (year === startYear && monthIndex < startMonth) {
    return new Set();
  }
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const days = new Set();
  const startDay = start.getDate();
  if (freq.unit === "day") {
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, monthIndex, day);
      if (date < start) {
        continue;
      }
      if (shouldSkipWeekend(activity, date)) {
        continue;
      }
      days.add(day);
    }
    return days;
  }
  if (freq.unit === "week") {
    const startDow = start.getDay();
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, monthIndex, day);
      if (date < start || date.getDay() !== startDow) {
        continue;
      }
      if (shouldSkipWeekend(activity, date)) {
        continue;
      }
      if (freq.interval > 1) {
        const diffDays = Math.round((startOfDay(date) - startOfDay(start)) / DAY_MS);
        const diffWeeks = Math.floor(diffDays / 7);
        if (diffWeeks < 0 || diffWeeks % freq.interval !== 0) {
          continue;
        }
      }
      days.add(day);
    }
    return days;
  }
  if (freq.unit === "month") {
    const monthDiff = (year - startYear) * 12 + (monthIndex - startMonth);
    if (monthDiff < 0 || monthDiff % freq.interval !== 0) {
      return new Set();
    }
    const day = Math.min(startDay, daysInMonth);
    const date = new Date(year, monthIndex, day);
    if (date < start) {
      return new Set();
    }
    if (shouldSkipWeekend(activity, date)) {
      return new Set();
    }
    days.add(day);
    return days;
  }
  if (freq.unit === "year") {
    const yearDiff = year - startYear;
    if (yearDiff < 0 || yearDiff % freq.interval !== 0) {
      return new Set();
    }
    if (monthIndex !== startMonth) {
      return new Set();
    }
    const day = Math.min(startDay, daysInMonth);
    const date = new Date(year, monthIndex, day);
    if (date < start) {
      return new Set();
    }
    if (shouldSkipWeekend(activity, date)) {
      return new Set();
    }
    days.add(day);
  }
  return days;
}

function getScheduledWeeks(activity, year, weeks) {
  const freq = getPmpFrequency(activity && activity.frequencia);
  if (!freq) {
    return new Set();
  }
  const start = getActivityStartDate(activity, year);
  const startYear = start.getFullYear();
  if (year < startYear) {
    return new Set();
  }
  const allowed = getActivityAllowedMonths(activity);
  const weeksSet = new Set();
  if (freq.unit === "week" || freq.unit === "day") {
    const startWeek = getWeekNumber(start);
    weeks.forEach((week) => {
      if (year === startYear && week.index < startWeek) {
        return;
      }
      if (freq.unit === "week" && freq.interval > 1) {
        const diff = week.index - startWeek;
        if (diff < 0 || diff % freq.interval !== 0) {
          return;
        }
      }
      const startDow = start.getDay();
      const offset = (startDow + 6) % 7;
      const scheduledDate = addDays(week.start, offset);
      if (shouldSkipWeekend(activity, scheduledDate)) {
        return;
      }
      if (allowed && !allowed.has(scheduledDate.getMonth())) {
        return;
      }
      weeksSet.add(week.index);
    });
    return weeksSet;
  }
  if (freq.unit === "month") {
    const months = getScheduledMonths(activity, year);
    months.forEach((monthIndex) => {
      const date = getScheduledDateForMonth(activity, year, monthIndex);
      if (allowed && !allowed.has(date.getMonth())) {
        return;
      }
      weeksSet.add(getWeekNumber(date));
    });
    return weeksSet;
  }
  if (freq.unit === "year") {
    if ((year - startYear) % freq.interval !== 0) {
      return weeksSet;
    }
    const date = getScheduledDateForMonth(activity, year, start.getMonth());
    if (shouldSkipWeekend(activity, date)) {
      return weeksSet;
    }
    if (allowed && !allowed.has(date.getMonth())) {
      return weeksSet;
    }
    weeksSet.add(getWeekNumber(date));
  }
  return weeksSet;
}

function getScheduledPeriodKeys(activity, year, viewMode, periods, monthIndex) {
  if (viewMode === "day") {
    const daysSet = getScheduledDays(activity, year, monthIndex);
    return new Set(Array.from(daysSet).map((value) => `D${String(value).padStart(2, "0")}`));
  }
  if (viewMode === "week") {
    const weeksSet = getScheduledWeeks(activity, year, periods);
    return new Set(Array.from(weeksSet).map((value) => `W${String(value).padStart(2, "0")}`));
  }
  const months = getScheduledMonths(activity, year);
  return new Set(Array.from(months).map((value) => `M${String(value + 1).padStart(2, "0")}`));
}

function getPeriodKeyForDate(viewMode, date, year, monthIndex) {
  if (!date || date.getFullYear() !== year) {
    return "";
  }
  if (viewMode === "day") {
    if (!Number.isFinite(monthIndex) || date.getMonth() !== monthIndex) {
      return "";
    }
    return `D${String(date.getDate()).padStart(2, "0")}`;
  }
  if (viewMode === "week") {
    const week = getWeekNumber(date);
    return `W${String(week).padStart(2, "0")}`;
  }
  return `M${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getPmpDiffDays(a, b) {
  if (!a || !b) {
    return null;
  }
  const startA = startOfDay(a);
  const startB = startOfDay(b);
  return Math.round((startA - startB) / DAY_MS);
}

function setExecutionMap(map, activityId, periodKey, payload) {
  if (!activityId || !periodKey) {
    return;
  }
  if (!map.has(activityId)) {
    map.set(activityId, new Map());
  }
  map.get(activityId).set(periodKey, payload);
}

function getPmpStatusForPeriod(
  activity,
  period,
  periodKey,
  viewMode,
  manualMap,
  autoMap,
  today,
  isScheduled = true
) {
  const manual = manualMap.get(activity.id) ? manualMap.get(activity.id).get(periodKey) : null;
  const auto = autoMap.get(activity.id) ? autoMap.get(activity.id).get(periodKey) : null;
  const exec = manual || auto;
  const scheduledDate = exec && exec.scheduledFor ? parseAnyDate(exec.scheduledFor) : null;
  const dueDate = scheduledDate || getDueDateForPeriod(activity, period, viewMode);
  if (exec && exec.status === "removida") {
    return { status: "empty", exec, executedAt: null, dueDate };
  }
  if (exec && exec.status === "cancelada") {
    return { status: "cancelled", exec, executedAt: null, dueDate };
  }
  const executedAt = exec ? resolvePmpExecutionDate(exec.executedAt) : null;
  if (executedAt) {
    const diff = dueDate ? getPmpDiffDays(executedAt, dueDate) : 0;
    if (dueDate && diff !== null && Math.abs(diff) > PMP_TOLERANCE_DAYS) {
      return { status: "late", exec, executedAt, dueDate };
    }
    return { status: "on_time", exec, executedAt, dueDate };
  }
  if (!isScheduled && !exec) {
    return { status: "empty", exec: null, executedAt: null, dueDate };
  }
  if (period.end < today) {
    return { status: "missed", exec: null, executedAt: null, dueDate };
  }
  return { status: "scheduled", exec: null, executedAt: null, dueDate };
}

function getExecutionsByActivity() {
  const manual = new Map();
  const year = getPmpYearValue();
  const view = getPmpViewMode();
  const monthIndex = getPmpMonthValue();
  pmpExecutions.forEach((exec) => {
    if (!exec || !exec.activityId) {
      return;
    }
    let periodKey = exec.periodKey;
    if (!periodKey && exec.scheduledFor) {
      const date = parseAnyDate(exec.scheduledFor);
      periodKey = getPeriodKeyForDate(view, date, year, monthIndex);
    }
    if (!periodKey && exec.executedAt) {
      const date = parseAnyDate(exec.executedAt);
      periodKey = getPeriodKeyForDate(view, date, year, monthIndex);
    }
    setExecutionMap(manual, exec.activityId, periodKey, exec);
  });
  return manual;
}

function mapTemplateFrequencyToPmp(template) {
  if (!template || !template.frequencia) {
    return "";
  }
  const freq = String(template.frequencia).toLowerCase();
  if (freq === "daily") {
    return "diaria";
  }
  if (freq === "weekly") {
    return "semanal";
  }
  if (freq === "monthly") {
    return "mensal";
  }
  return "";
}

function getMaintenanceCodigo(item) {
  return String(item && (item.codigo || item.tag || item.subestacao) ? item.codigo || item.tag || item.subestacao : "")
    .trim();
}

function getMaintenanceOsReferencia(item) {
  if (!item) {
    return "";
  }
  if (item.osReferencia) {
    return String(item.osReferencia || "").trim();
  }
  const liberacao = getLiberacao(item);
  if (liberacao && liberacao.osNumero) {
    return String(liberacao.osNumero || "").trim();
  }
  return "";
}

function getMaintenanceParticipantsCount(item) {
  if (!item) {
    return 0;
  }
  const liberacao = getLiberacao(item) || {};
  const participantes = Array.isArray(liberacao.participantes) ? liberacao.participantes : [];
  if (participantes.length) {
    return participantes.length;
  }
  if (Array.isArray(item.participantes)) {
    return item.participantes.length;
  }
  if (typeof item.participantes === "string") {
    return item.participantes.split(/[;,]/).map((p) => p.trim()).filter(Boolean).length;
  }
  if (item.conclusao && Array.isArray(item.conclusao.participantes)) {
    return item.conclusao.participantes.length;
  }
  return 0;
}

function getMaintenanceDurationMinutes(item) {
  if (!item) {
    return 0;
  }
  if (item.conclusao && Number.isFinite(item.conclusao.duracaoMin)) {
    return Math.max(0, Math.round(item.conclusao.duracaoMin));
  }
  if (Number.isFinite(item.duracaoMin)) {
    return Math.max(0, Math.round(item.duracaoMin));
  }
  const inicio = getItemInicioExecucaoDate(item);
  const fim = getItemFimExecucaoDate(item) || getItemConclusaoDate(item);
  if (inicio && fim) {
    return Math.max(0, Math.round((fim - inicio) / 60000));
  }
  return 0;
}

function getMaintenanceEvidencias(item) {
  const evidencias = [];
  if (!item) {
    return evidencias;
  }
  if (Array.isArray(item.evidencias)) {
    evidencias.push(...item.evidencias);
  }
  if (item.registroExecucao && Array.isArray(item.registroExecucao.evidencias)) {
    evidencias.push(...item.registroExecucao.evidencias);
  }
  if (item.conclusao && Array.isArray(item.conclusao.evidencias)) {
    evidencias.push(...item.conclusao.evidencias);
  }
  if (Array.isArray(item.anexos)) {
    evidencias.push(...item.anexos);
  }
  return evidencias;
}

function getPmpMaintenanceList(projectId) {
  if (!projectId) {
    return [];
  }
  if (pmpMaintenanceCache.has(projectId)) {
    return pmpMaintenanceCache.get(projectId);
  }
  if (projectId === activeProjectId && Array.isArray(manutencoes)) {
    return manutencoes;
  }
  return [];
}

async function ensurePmpMaintenanceCache(projectId) {
  if (!projectId) {
    return [];
  }
  if (pmpMaintenanceCache.has(projectId)) {
    return pmpMaintenanceCache.get(projectId);
  }
  try {
    const data = await apiMaintenanceList(projectId);
    if (data && Array.isArray(data.items)) {
      const normalized = normalizarManutencoes(data.items);
      const list = normalized.normalizadas;
      pmpMaintenanceCache.set(projectId, list);
      return list;
    }
  } catch (error) {
    // noop
  }
  pmpMaintenanceCache.set(projectId, []);
  return [];
}

function buildPmpImportItems(projectId, items) {
  const groups = new Map();
  items.forEach((item) => {
    if (!item || item.projectId !== projectId) {
      return;
    }
    const template = item.templateId ? getTemplateById(item.templateId) : null;
    const nomeBase = template && template.nome
      ? template.nome
      : item.titulo || item.nome || item.descricao || "-";
    const key = item.templateId || `${normalizeSearchValue(nomeBase)}|${item.equipamentoId || ""}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        projectId,
        templateId: item.templateId || "",
        nome: nomeBase,
        codigo: getMaintenanceCodigo(item),
        equipamentoId: item.equipamentoId || "",
        frequencia: mapTemplateFrequencyToPmp(template),
        status: template && template.ativo === false ? "Inativo" : "Ativo",
        totalDuracao: 0,
        duracaoCount: 0,
        totalTecnicos: 0,
        tecnicosCount: 0,
        ultimaExecucao: null,
      });
    }
    const entry = groups.get(key);
    const duracao = getMaintenanceDurationMinutes(item);
    if (duracao > 0) {
      entry.totalDuracao += duracao;
      entry.duracaoCount += 1;
    }
    const tecnicos = getMaintenanceParticipantsCount(item);
    if (tecnicos > 0) {
      entry.totalTecnicos += tecnicos;
      entry.tecnicosCount += 1;
    }
    const execDate = getItemConclusaoDate(item) || getItemFimExecucaoDate(item);
    if (execDate && (!entry.ultimaExecucao || execDate > entry.ultimaExecucao)) {
      entry.ultimaExecucao = execDate;
    }
  });
  return Array.from(groups.values())
    .map((entry) => ({
      id: entry.id,
      projectId: entry.projectId,
      templateId: entry.templateId,
      nome: entry.nome,
      codigo: entry.codigo,
      equipamentoId: entry.equipamentoId,
      frequencia: entry.frequencia,
      tecnicosEstimados: entry.tecnicosCount
        ? Math.round(entry.totalTecnicos / entry.tecnicosCount)
        : 0,
      duracaoMinutos: entry.duracaoCount
        ? Math.round(entry.totalDuracao / entry.duracaoCount)
        : 0,
      ultimaExecucao: entry.ultimaExecucao,
      status: entry.status,
    }))
    .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
}

function buildAutoExecutionMap(activities, periods, viewMode, year, monthIndex) {
  const auto = new Map();
  if (!activities.length) {
    return auto;
  }
  const periodMap = new Map(periods.map((period) => [period.key, period]));
  const byProject = new Map();
  activities.forEach((activity) => {
    if (!activity) {
      return;
    }
    const list = byProject.get(activity.projectId) || [];
    list.push(activity);
    byProject.set(activity.projectId, list);
  });
  byProject.forEach((projectActivities, projectId) => {
    const items = getPmpMaintenanceList(projectId);
    if (!items.length) {
      return;
    }
    const scheduleMeta = new Map();
    projectActivities.forEach((activity) => {
      const scheduledKeys = getScheduledPeriodKeys(activity, year, viewMode, periods, monthIndex);
      const dueDates = new Map();
      scheduledKeys.forEach((key) => {
        const period = periodMap.get(key);
        if (period) {
          dueDates.set(key, getDueDateForPeriod(activity, period, viewMode));
        }
      });
      scheduleMeta.set(activity.id, { scheduledKeys, dueDates });
    });
    items.forEach((item) => {
      if (!item || item.status !== "concluida") {
        return;
      }
      const execDate = getItemConclusaoDate(item) || getItemFimExecucaoDate(item);
      if (!execDate || execDate.getFullYear() !== year) {
        return;
      }
      projectActivities.forEach((activity) => {
        if (!activity || activity.projectId !== projectId) {
          return;
        }
        const equipMatch =
          activity.equipamentoId &&
          item.equipamentoId &&
          activity.equipamentoId === item.equipamentoId;
        const tituloBase = normalizeSearchValue(
          item.titulo || item.nome || item.descricao || ""
        );
        const nomeMatch = activity.nome
          ? tituloBase.includes(normalizeSearchValue(activity.nome))
          : false;
        const codigoMatch = activity.codigo
          ? tituloBase.includes(normalizeSearchValue(activity.codigo))
          : false;
        if (!equipMatch && !nomeMatch && !codigoMatch) {
          return;
        }
        const meta = scheduleMeta.get(activity.id);
        if (!meta) {
          return;
        }
        let bestKey = "";
        let bestDiff = Infinity;
        meta.scheduledKeys.forEach((key) => {
          const dueDate = meta.dueDates.get(key);
          const diff = dueDate ? getPmpDiffDays(execDate, dueDate) : null;
          if (diff === null) {
            return;
          }
          const diffAbs = Math.abs(diff);
          if (diffAbs <= PMP_TOLERANCE_DAYS && diffAbs < bestDiff) {
            bestDiff = diffAbs;
            bestKey = key;
          }
        });
        if (!bestKey) {
          const periodKey = getPeriodKeyForDate(viewMode, execDate, year, monthIndex);
          if (periodKey && meta.scheduledKeys.has(periodKey)) {
            bestKey = periodKey;
          }
        }
        if (!bestKey) {
          return;
        }
        if (auto.get(activity.id)?.get(bestKey)) {
          return;
        }
        const executorId = getExecutadoPorId(item) || item.executadaPor || item.doneBy || "";
        setExecutionMap(auto, activity.id, bestKey, {
          executedAt: execDate,
          executorId,
          source: "auto",
          status: "concluida",
          manutencaoId: item.id,
          osReferencia: getMaintenanceOsReferencia(item),
        });
      });
    });
  });
  return auto;
}

function getDueDateForPeriod(activity, period, viewMode) {
  if (viewMode === "day") {
    return period.start;
  }
  if (viewMode === "month") {
    return getScheduledDateForMonth(activity, period.start.getFullYear(), period.start.getMonth());
  }
  const startDate = getActivityStartDate(activity, period.start.getFullYear());
  const startDow = startDate.getDay();
  const offset = (startDow + 6) % 7;
  return addDays(period.start, offset);
}

function getEquipamentoNomeById(projectId, equipamentoId) {
  if (!equipamentoId) {
    return "-";
  }
  const cached = pmpEquipamentosCache.get(projectId) || [];
  const match = cached.find((item) => item.id === equipamentoId);
  if (match) {
    return `${match.tag ? `${match.tag} - ` : ""}${match.nome || ""}`.trim();
  }
  if (projectId === activeProjectId && Array.isArray(projectEquipamentos)) {
    const local = projectEquipamentos.find((item) => item.id === equipamentoId);
    if (local) {
      return `${local.tag ? `${local.tag} - ` : ""}${local.nome || ""}`.trim();
    }
  }
  return equipamentoId;
}

async function ensurePmpEquipamentos(projectId) {
  if (!projectId) {
    return [];
  }
  if (pmpEquipamentosCache.has(projectId)) {
    return pmpEquipamentosCache.get(projectId);
  }
  try {
    const data = await apiProjetosEquipamentosList(projectId);
    const list = Array.isArray(data.equipamentos) ? data.equipamentos : [];
    pmpEquipamentosCache.set(projectId, list);
    return list;
  } catch (error) {
    pmpEquipamentosCache.set(projectId, []);
    return [];
  }
}

function renderPmpYearOptions() {
  if (!pmpAno) {
    return;
  }
  const current = new Date().getFullYear();
  const years = new Set([current, current + 1, current - 1]);
  pmpActivities.forEach((activity) => {
    if (activity && Number.isFinite(Number(activity.ano))) {
      years.add(Number(activity.ano));
    }
  });
  const sorted = Array.from(years).sort((a, b) => a - b);
  const selected = Number(pmpAno.value) || current;
  pmpAno.innerHTML = "";
  sorted.forEach((year) => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    pmpAno.append(option);
  });
  pmpAno.value = sorted.includes(selected) ? String(selected) : String(current);
}

function renderPmpMonthOptions() {
  if (!pmpMes) {
    return;
  }
  const current = new Date().getMonth();
  const selected = Number(pmpMes.value);
  pmpMes.innerHTML = "";
  PMP_MONTH_LABELS.forEach((label, idx) => {
    const option = document.createElement("option");
    option.value = String(idx);
    option.textContent = label;
    pmpMes.append(option);
  });
  const fallback = Number.isFinite(selected) ? selected : current;
  pmpMes.value = PMP_MONTH_LABELS[fallback] ? String(fallback) : String(current);
}

function renderPmpMesesOptions() {
  if (!pmpMesesWrap) {
    return;
  }
  if (pmpMesesWrap.childElementCount) {
    return;
  }
  pmpMesesWrap.innerHTML = "";
  PMP_MONTH_LABELS.forEach((label, idx) => {
    const id = `pmpMes-${idx}`;
    const wrapper = document.createElement("label");
    wrapper.className = "pmp-month";
    wrapper.setAttribute("for", id);
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.value = String(idx);
    input.dataset.pmpMonth = String(idx);
    input.checked = true;
    const span = document.createElement("span");
    span.textContent = label;
    wrapper.append(input, span);
    pmpMesesWrap.append(wrapper);
  });
}

function getPmpSelectedMeses() {
  if (!pmpMesesWrap) {
    return [];
  }
  const inputs = Array.from(pmpMesesWrap.querySelectorAll("input[data-pmp-month]"));
  const selecionados = inputs
    .filter((input) => input.checked)
    .map((input) => Number(input.value))
    .filter((value) => Number.isFinite(value));
  return selecionados;
}

function setPmpSelectedMeses(meses) {
  if (!pmpMesesWrap) {
    return;
  }
  const isArray = Array.isArray(meses);
  const normalized = isArray
    ? meses.map((value) => Number(value)).filter((value) => value >= 0 && value <= 11)
    : null;
  const inputs = Array.from(pmpMesesWrap.querySelectorAll("input[data-pmp-month]"));
  if (!inputs.length) {
    return;
  }
  const allowAll = normalized === null;
  inputs.forEach((input) => {
    const value = Number(input.value);
    if (allowAll) {
      input.checked = true;
    } else {
      input.checked = normalized.includes(value);
    }
  });
}

function getActivityAllowedMonths(activity) {
  const mesesRaw = Array.isArray(activity && activity.meses)
    ? activity.meses
    : null;
  if (!mesesRaw) {
    return null;
  }
  const meses = mesesRaw
    ? activity.meses.map((value) => Number(value)).filter((value) => value >= 0 && value <= 11)
    : [];
  if (!meses.length) {
    return new Set();
  }
  return new Set(meses);
}

function isMonthAllowed(activity, monthIndex) {
  const allowed = getActivityAllowedMonths(activity);
  if (!allowed) {
    return true;
  }
  if (!allowed.size) {
    return false;
  }
  return allowed.has(monthIndex);
}

function renderPmpProjetoOptions() {
  if (!pmpProjeto || !pmpFiltroProjeto) {
    return;
  }
  const activeValue = activeProjectId || "";
  const formValue = pmpProjeto.value || "";
  const filtroValue = pmpFiltroProjeto.value || "";
  pmpProjeto.innerHTML = "";
  const optBlank = document.createElement("option");
  optBlank.value = "";
  optBlank.textContent = "Selecione";
  pmpProjeto.append(optBlank);
  pmpFiltroProjeto.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "";
  optAll.textContent = "Todos";
  pmpFiltroProjeto.append(optAll);
  availableProjects.forEach((project) => {
    const label = getProjectLabel(project);
    const optionForm = document.createElement("option");
    optionForm.value = project.id;
    optionForm.textContent = label;
    pmpProjeto.append(optionForm);
    const optionFilter = document.createElement("option");
    optionFilter.value = project.id;
    optionFilter.textContent = label;
    pmpFiltroProjeto.append(optionFilter);
  });
  pmpProjeto.value = formValue || activeValue || "";
  pmpFiltroProjeto.value = activeValue || filtroValue || "";
}

async function renderPmpEquipamentoOptions(targetProjectId) {
  if (!pmpEquipamento || !pmpFiltroEquipamento) {
    return;
  }
  const projectId = targetProjectId || activeProjectId || "";
  const equipamentos = projectId ? await ensurePmpEquipamentos(projectId) : [];
  const formValue = pmpEquipamento.value || "";
  pmpEquipamento.innerHTML = "";
  const optBlank = document.createElement("option");
  optBlank.value = "";
  optBlank.textContent = "Selecione";
  pmpEquipamento.append(optBlank);
  equipamentos.forEach((equip) => {
    const option = document.createElement("option");
    option.value = equip.id;
    option.textContent = `${equip.tag ? `${equip.tag} - ` : ""}${equip.nome || ""}`.trim();
    pmpEquipamento.append(option);
  });
  pmpEquipamento.value = equipamentos.some((item) => item.id === formValue) ? formValue : "";

  const filtroValue = pmpFiltroEquipamento.value || "";
  pmpFiltroEquipamento.innerHTML = "";
  const filtroAll = document.createElement("option");
  filtroAll.value = "";
  filtroAll.textContent = "Todos";
  pmpFiltroEquipamento.append(filtroAll);
  equipamentos.forEach((equip) => {
    const option = document.createElement("option");
    option.value = equip.id;
    option.textContent = `${equip.tag ? `${equip.tag} - ` : ""}${equip.nome || ""}`.trim();
    pmpFiltroEquipamento.append(option);
  });
  pmpFiltroEquipamento.value = equipamentos.some((item) => item.id === filtroValue) ? filtroValue : "";
}

function renderPmpResponsavelOptions(targetProjectId) {
  if (!pmpResponsavel || !pmpFiltroResponsavel) {
    return;
  }
  let lista = Array.isArray(users) ? users.slice() : [];
  if (targetProjectId && targetProjectId === activeProjectId) {
    const equipeIds = getActiveProjectEquipeIds();
    if (equipeIds.size) {
      lista = lista.filter((user) => equipeIds.has(user.id));
    }
  }
  const formValue = pmpResponsavel.value || "";
  const filtroValue = pmpFiltroResponsavel.value || "";
  pmpResponsavel.innerHTML = "";
  const optBlank = document.createElement("option");
  optBlank.value = "";
  optBlank.textContent = "Selecione";
  pmpResponsavel.append(optBlank);
  pmpFiltroResponsavel.innerHTML = "";
  const optAll = document.createElement("option");
  optAll.value = "";
  optAll.textContent = "Todos";
  pmpFiltroResponsavel.append(optAll);
  lista.forEach((user) => {
    const label = user.name || user.username || user.matricula || "-";
    const optionForm = document.createElement("option");
    optionForm.value = user.id;
    optionForm.textContent = label;
    pmpResponsavel.append(optionForm);
    const optionFilter = document.createElement("option");
    optionFilter.value = user.id;
    optionFilter.textContent = label;
    pmpFiltroResponsavel.append(optionFilter);
  });
  pmpResponsavel.value = lista.some((item) => item.id === formValue) ? formValue : "";
  pmpFiltroResponsavel.value = lista.some((item) => item.id === filtroValue) ? filtroValue : "";
}

function getPmpProjectHorasDisponiveis(projectId) {
  if (!projectId) {
    return 0;
  }
  const project = availableProjects.find((item) => item.id === projectId);
  const value = project && Number.isFinite(Number(project.pmpHorasDisponiveis))
    ? Number(project.pmpHorasDisponiveis)
    : 40;
  return Math.max(0, value);
}

function syncPmpHorasDisponiveisInput(projectId) {
  if (!pmpHorasDisponiveis) {
    return;
  }
  if (document.activeElement === pmpHorasDisponiveis) {
    return;
  }
  const resolved = projectId || activeProjectId || "";
  if (!resolved) {
    return;
  }
  const value = getPmpProjectHorasDisponiveis(resolved);
  pmpHorasDisponiveis.value = String(value);
}

let pmpHorasSaveTimer = null;
function schedulePmpHorasDisponiveisSave() {
  if (!pmpHorasDisponiveis) {
    return;
  }
  if (!currentUser || !canManageProjetos(currentUser)) {
    return;
  }
  const projectId = (pmpFiltroProjeto && pmpFiltroProjeto.value) || activeProjectId || "";
  if (!projectId) {
    return;
  }
  if (pmpHorasSaveTimer) {
    clearTimeout(pmpHorasSaveTimer);
  }
  pmpHorasSaveTimer = setTimeout(async () => {
    const valor = Number(pmpHorasDisponiveis.value || 0);
    if (!Number.isFinite(valor)) {
      return;
    }
    try {
      const data = await apiProjetosUpdate(projectId, { pmpHorasDisponiveis: Math.max(0, valor) });
      if (data && data.project) {
        availableProjects = availableProjects.map((item) =>
          item.id === data.project.id ? data.project : item
        );
      }
    } catch (error) {
      if (pmpFormMensagem) {
        pmpFormMensagem.textContent = "Erro ao salvar horas disponiveis do PMP.";
      }
    }
  }, 500);
}

function updatePmpImportButton() {
  if (!pmpImportBtn) {
    return;
  }
  const projectId = (pmpFiltroProjeto && pmpFiltroProjeto.value) || activeProjectId || "";
  const canManage = Boolean(currentUser && canManagePmpActivities(currentUser));
  pmpImportBtn.disabled = !canManage || !projectId;
  pmpImportBtn.hidden = !canManage;
}

function getPmpFilteredActivities() {
  const year = getPmpYearValue();
  const viewMode = getPmpViewMode();
  const monthIndex = getPmpMonthValue();
  const periods = getPmpPeriods(viewMode, year, monthIndex);
  const today = startOfDay(new Date());
  const termo = normalizeSearchValue(pmpBusca ? pmpBusca.value : "");
  const filtroProjeto = (pmpFiltroProjeto && pmpFiltroProjeto.value) || activeProjectId || "";
  const filtroFrequencia = pmpFiltroFrequencia ? pmpFiltroFrequencia.value : "";
  const filtroEquipamento = pmpFiltroEquipamento ? pmpFiltroEquipamento.value : "";
  const filtroResponsavel = pmpFiltroResponsavel ? pmpFiltroResponsavel.value : "";
  const filtroOrigem = pmpFiltroOrigem ? pmpFiltroOrigem.value : "";
  const filtroStatus = pmpFiltroStatus ? pmpFiltroStatus.value : "";
  const manualMap = getExecutionsByActivity();
  const autoMap = buildAutoExecutionMap(pmpActivities, periods, viewMode, year, monthIndex);
  return pmpActivities.filter((activity) => {
    if (filtroProjeto && activity.projectId !== filtroProjeto) {
      return false;
    }
    if (filtroFrequencia && activity.frequencia !== filtroFrequencia) {
      return false;
    }
    if (filtroEquipamento && activity.equipamentoId !== filtroEquipamento) {
      return false;
    }
    if (filtroResponsavel && activity.responsavelId !== filtroResponsavel) {
      return false;
    }
    if (filtroOrigem && (activity.origem || "manual") !== filtroOrigem) {
      return false;
    }
    const activityYear = activity.ano ? Number(activity.ano) : year;
    if (activityYear !== year) {
      return false;
    }
    if (termo) {
      const texto = normalizeSearchValue(
        `${activity.nome} ${activity.codigo} ${activity.descricao}`
      );
      if (!texto.includes(termo)) {
        return false;
      }
    }
    if (filtroStatus) {
      const targetStatus = PMP_STATUS_FILTER_MAP[filtroStatus] || "";
      const scheduledKeys = getScheduledPeriodKeys(activity, year, viewMode, periods, monthIndex);
      const anyMatch = periods.some((period) => {
        const periodKey = period.key;
        const manualEntry = manualMap.get(activity.id)
          ? manualMap.get(activity.id).get(periodKey)
          : null;
        const isScheduled = scheduledKeys.has(periodKey) || Boolean(manualEntry);
        if (!isScheduled) {
          return false;
        }
        const statusInfo = getPmpStatusForPeriod(
          activity,
          period,
          periodKey,
          viewMode,
          manualMap,
          autoMap,
          today,
          isScheduled
        );
        return statusInfo.status === targetStatus;
      });
      if (!anyMatch) {
        return false;
      }
    }
    return true;
  });
}

function resetPmpForm() {
  renderPmpMesesOptions();
  if (pmpFormId) {
    pmpFormId.value = "";
  }
  if (pmpFormTitle) {
    pmpFormTitle.textContent = "Cadastrar atividade PMP";
  }
  if (pmpNome) {
    pmpNome.value = "";
  }
  if (pmpCodigo) {
    pmpCodigo.value = "";
  }
  if (pmpTipo) {
    pmpTipo.value = "";
  }
  if (pmpFrequencia) {
    pmpFrequencia.value = "";
  }
  if (pmpInicio) {
    pmpInicio.value = "";
  }
  if (pmpOnlyWeekdays) {
    pmpOnlyWeekdays.checked = false;
  }
  if (pmpTecnicos) {
    pmpTecnicos.value = "0";
  }
  if (pmpDuracao) {
    pmpDuracao.value = "";
  }
  if (pmpResponsavel) {
    pmpResponsavel.value = "";
  }
  if (pmpDescricao) {
    pmpDescricao.value = "";
  }
  if (pmpObservacoes) {
    pmpObservacoes.value = "";
  }
  if (pmpProcedimentos) {
    pmpProcedimentos.value = "";
  }
  if (pmpChecklistItem) {
    pmpChecklistItem.value = "";
  }
  if (pmpChecklistLink) {
    pmpChecklistLink.value = "";
  }
  if (pmpFormMensagem) {
    pmpFormMensagem.textContent = "";
  }
  pmpChecklistItems = [];
  pmpFormOrigem = "manual";
  setPmpProcedimentoDoc(null);
  setPmpSelectedMeses(null);
  renderPmpChecklist();
}

function preencherPmpForm(activity) {
  if (!activity) {
    return;
  }
  renderPmpMesesOptions();
  if (pmpFormId) {
    pmpFormId.value = activity.id || "";
  }
  if (pmpFormTitle) {
    pmpFormTitle.textContent = "Editar atividade PMP";
  }
  if (pmpNome) {
    pmpNome.value = activity.nome || "";
  }
  if (pmpCodigo) {
    pmpCodigo.value = activity.codigo || "";
  }
  if (pmpTipo) {
    pmpTipo.value = activity.tipoManutencao || activity.tipo || "";
  }
  if (pmpProjeto) {
    pmpProjeto.value = activity.projectId || "";
  }
  if (pmpFrequencia) {
    pmpFrequencia.value = activity.frequencia || "";
  }
  if (pmpInicio) {
    pmpInicio.value = activity.inicio || "";
  }
  if (pmpOnlyWeekdays) {
    pmpOnlyWeekdays.checked = Boolean(activity.onlyWeekdays);
  }
  if (pmpTecnicos) {
    pmpTecnicos.value = Number(activity.tecnicosEstimados || 0);
  }
  if (pmpDuracao) {
    pmpDuracao.value = activity.duracaoMinutos ? formatDuracaoMin(activity.duracaoMinutos) : "";
  }
  if (pmpResponsavel) {
    pmpResponsavel.value = activity.responsavelId || "";
  }
  if (pmpDescricao) {
    pmpDescricao.value = activity.descricao || "";
  }
  if (pmpObservacoes) {
    pmpObservacoes.value = activity.observacoes || "";
  }
  if (pmpProcedimentos) {
    pmpProcedimentos.value = activity.procedimentos || "";
  }
  setPmpProcedimentoDoc(activity.procedimentoDoc || null);
  pmpChecklistItems = normalizePmpChecklistItems(activity.checklist || []);
  pmpFormOrigem = activity.origem || "manual";
  if (activity && Object.prototype.hasOwnProperty.call(activity, "meses")) {
    setPmpSelectedMeses(activity.meses);
  } else {
    setPmpSelectedMeses(null);
  }
  renderPmpChecklist();
  renderPmpEquipamentoOptions(activity.projectId);
  if (pmpEquipamento) {
    pmpEquipamento.value = activity.equipamentoId || "";
  }
}

async function salvarPmpActivity(event) {
  if (event) {
    event.preventDefault();
  }
  if (!currentUser || !canManagePmpActivities(currentUser)) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Sem permissão para gerenciar PMP.";
    }
    return;
  }
  const nome = pmpNome ? pmpNome.value.trim() : "";
  const projectId = pmpProjeto ? pmpProjeto.value : "";
  const frequencia = pmpFrequencia ? pmpFrequencia.value : "";
  if (!nome || !projectId || !frequencia) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Preencha nome, projeto e frequencia.";
    }
    return;
  }
  const payload = {
    nome,
    codigo: pmpCodigo ? pmpCodigo.value.trim() : "",
    tipoManutencao: pmpTipo ? pmpTipo.value : "",
    projectId,
    equipamentoId: pmpEquipamento ? pmpEquipamento.value : "",
    frequencia,
    inicio: pmpInicio ? pmpInicio.value : "",
    onlyWeekdays: pmpOnlyWeekdays ? Boolean(pmpOnlyWeekdays.checked) : false,
    meses: getPmpSelectedMeses(),
    tecnicosEstimados: pmpTecnicos ? Number(pmpTecnicos.value || 0) : 0,
    duracaoMinutos: parseDurationToMinutes(pmpDuracao ? pmpDuracao.value : ""),
    responsavelId: pmpResponsavel ? pmpResponsavel.value : "",
    descricao: pmpDescricao ? pmpDescricao.value.trim() : "",
    observacoes: pmpObservacoes ? pmpObservacoes.value.trim() : "",
    procedimentos: pmpProcedimentos ? pmpProcedimentos.value.trim() : "",
    procedimentoDoc: pmpProcedimentoDoc || null,
    checklist: pmpChecklistItems.slice(),
    origem: pmpFormOrigem || "manual",
    ano: getPmpYearValue(),
  };
  const id = pmpFormId ? pmpFormId.value : "";
  try {
    if (id) {
      const data = await apiPmpActivitiesUpdate(id, payload);
      if (data && data.activity) {
        pmpActivities = pmpActivities.map((item) => (item.id === id ? data.activity : item));
      }
      if (pmpFormMensagem) {
        pmpFormMensagem.textContent = "Atividade atualizada.";
      }
    } else {
      const data = await apiPmpActivitiesCreate(payload);
      if (data && data.activity) {
        pmpActivities = pmpActivities.concat(data.activity);
      }
      if (pmpFormMensagem) {
        pmpFormMensagem.textContent = "Atividade cadastrada.";
      }
    }
    resetPmpForm();
    renderTudo();
  } catch (error) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Erro ao salvar atividade.";
    }
  }
}

async function removerPmpActivity(activityId) {
  if (!activityId) {
    return;
  }
  if (!currentUser || !hasGranularPermission(currentUser, "gerenciarPMP")) {
    return;
  }
  const target = pmpActivities.find((item) => item.id === activityId);
  const confirmacao = window.confirm(
    `Excluir atividade PMP \"${target ? target.nome : activityId}\"?`
  );
  if (!confirmacao) {
    return;
  }
  try {
    await apiPmpActivitiesDelete(activityId);
    pmpActivities = pmpActivities.filter((item) => item.id !== activityId);
    pmpExecutions = pmpExecutions.filter((exec) => exec.activityId !== activityId);
    renderTudo();
  } catch (error) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Erro ao remover atividade.";
    }
  }
}

function renderPmpModule() {
  if (!pmpGridBody || !pmpGridHead) {
    return;
  }
  const canManagePmp = Boolean(currentUser && canManagePmpActivities(currentUser));
  const canUploadProcedimento = Boolean(currentUser && canUploadPmpProcedimento(currentUser));
  if (pmpForm) {
    setFormDisabled(pmpForm, !canManagePmp);
    pmpForm.hidden = !canManagePmp;
  }
  if (pmpProcedimentoUpload) {
    pmpProcedimentoUpload.hidden = !canUploadProcedimento;
    pmpProcedimentoUpload.disabled = !canUploadProcedimento;
  }
  if (pmpProcedimentoFile) {
    pmpProcedimentoFile.disabled = !canUploadProcedimento;
  }
  if (pmpProcedimentoRemove) {
    pmpProcedimentoRemove.hidden = !canUploadProcedimento || !pmpProcedimentoDoc;
    pmpProcedimentoRemove.disabled = !canUploadProcedimento || !pmpProcedimentoDoc;
  }
  if (pmpDuplicarPlano) {
    pmpDuplicarPlano.disabled = !canManagePmp;
    pmpDuplicarPlano.hidden = !canManagePmp;
  }
  if (pmpExportPdf) {
    pmpExportPdf.disabled = !canManagePmp;
  }
  if (pmpExportExcel) {
    pmpExportExcel.disabled = !canManagePmp;
  }
  if (pmpHorasDisponiveis) {
    pmpHorasDisponiveis.disabled = !(currentUser && canManageProjetos(currentUser));
  }
  updatePmpImportButton();
  renderPmpYearOptions();
  renderPmpProjetoOptions();
  renderPmpMonthOptions();
  renderPmpMesesOptions();
  const year = getPmpYearValue();
  const viewMode = getPmpViewMode();
  const monthIndex = getPmpMonthValue();
  if (pmpMesField) {
    pmpMesField.hidden = viewMode !== "day";
  }
  const filtroProjeto = (pmpFiltroProjeto && pmpFiltroProjeto.value) || activeProjectId || "";
  syncPmpHorasDisponiveisInput(filtroProjeto || activeProjectId);
  renderPmpEquipamentoOptions(filtroProjeto || activeProjectId);
  renderPmpResponsavelOptions(filtroProjeto || activeProjectId);
  const filtrados = getPmpFilteredActivities();

  const pendingMaintenance = new Set();
  filtrados.forEach((activity) => {
    if (activity && activity.projectId) {
      pendingMaintenance.add(activity.projectId);
    }
  });
  const pendingLoads = [];
  pendingMaintenance.forEach((projectId) => {
    if (!pmpMaintenanceCache.has(projectId)) {
      pendingLoads.push(ensurePmpMaintenanceCache(projectId));
    }
  });
  if (pendingLoads.length) {
    Promise.all(pendingLoads).then(() => {
      renderPmpModule();
    });
  }

  const periods = getPmpPeriods(viewMode, year, monthIndex);
  const scheduledKeysMap = new Map();
  const manualMap = getExecutionsByActivity();
  const autoMap = buildAutoExecutionMap(filtrados, periods, viewMode, year, monthIndex);
  const today = startOfDay(new Date());
  pmpLastSnapshot = {
    year,
    viewMode,
    monthIndex,
    periods,
    manualMap,
    autoMap,
    activities: filtrados,
  };

  pmpGridHead.innerHTML = "";
  const headers = [
    { label: "Atividade", className: "pmp-col-name" },
    { label: "Codigo", className: "pmp-col-code" },
    { label: "Equipamento", className: "pmp-col-equip" },
    { label: "Freq." },
    { label: "HH" },
    { label: "Tec." },
  ];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header.label;
    if (header.className) {
      th.className = header.className;
    }
    pmpGridHead.append(th);
  });
  periods.forEach((period) => {
    const th = document.createElement("th");
    th.textContent = period.label;
    pmpGridHead.append(th);
  });

  pmpGridBody.innerHTML = "";
  let totalCells = 0;
  let onTimeCells = 0;
  let lateCells = 0;
  let missedCells = 0;
  let scheduledCells = 0;
  let cancelledCells = 0;
  let totalPlannedMinutes = 0;
  let totalPlannedCapacityMinutes = 0;
  let totalExecutedMinutes = 0;
  const statusIconMap = {
    on_time: "&#x2705;",
    scheduled: "&#x1F535;",
    missed: "&#x1F534;",
    late: "&#x26A0;&#xFE0F;",
    cancelled: "&#x1F6AB;",
    empty: "&#x2B1C;",
  };

  if (!filtrados.length) {
    if (pmpGridVazio) {
      pmpGridVazio.hidden = false;
    }
  } else if (pmpGridVazio) {
    pmpGridVazio.hidden = true;
  }

  filtrados.forEach((activity) => {
    const row = document.createElement("tr");
    const projectId = activity.projectId;
    const equipLabel = getEquipamentoNomeById(projectId, activity.equipamentoId);
    const freqLabel = getPmpFrequency(activity.frequencia)
      ? getPmpFrequency(activity.frequencia).label
      : activity.frequencia || "-";
    const duracaoLabel = activity.duracaoMinutos
      ? formatDuracaoMin(activity.duracaoMinutos)
      : "-";
    const scheduledKeys = getScheduledPeriodKeys(activity, year, viewMode, periods, monthIndex);
    scheduledKeysMap.set(activity.id, scheduledKeys);

    const nameCell = document.createElement("td");
    nameCell.className = "pmp-col-name";
    const nameWrap = document.createElement("div");
    nameWrap.className = "pmp-name";
    const nameText = document.createElement("div");
    nameText.textContent = activity.nome || "-";
    const tipoInfo = getPmpTipoInfo(activity.tipoManutencao || activity.tipo || "");
    if (tipoInfo) {
      const badge = document.createElement("span");
      badge.className = `pmp-type pmp-type--${tipoInfo.value}`;
      badge.textContent = tipoInfo.short;
      badge.title = tipoInfo.label;
      nameWrap.append(badge);
    }
    nameWrap.append(nameText);
    if (canManagePmp) {
      const actions = document.createElement("div");
      actions.className = "pmp-actions";
      const btnEdit = document.createElement("button");
      btnEdit.type = "button";
      btnEdit.className = "btn btn--ghost btn--small";
      btnEdit.dataset.pmpAction = "edit";
      btnEdit.dataset.pmpId = activity.id;
      btnEdit.textContent = "Editar";
      const btnDelete = document.createElement("button");
      btnDelete.type = "button";
      btnDelete.className = "btn btn--ghost btn--small btn--danger";
      btnDelete.dataset.pmpAction = "delete";
      btnDelete.dataset.pmpId = activity.id;
      btnDelete.textContent = "Excluir";
      actions.append(btnEdit, btnDelete);
      nameCell.append(nameWrap, actions);
    } else {
      nameCell.append(nameWrap);
    }
    if (activity.procedimentoDoc && activity.procedimentoDoc.url) {
      const procedureWrap = document.createElement("div");
      procedureWrap.className = "pmp-procedure";
      const procedureBtn = document.createElement("button");
      procedureBtn.type = "button";
      procedureBtn.className = "btn btn--ghost btn--small pmp-procedure-btn";
      procedureBtn.dataset.pmpAction = "view-procedure";
      procedureBtn.dataset.pmpId = activity.id;
      procedureBtn.textContent = "Visualizar procedimento";
      procedureBtn.title = activity.procedimentoDoc.originalName || activity.procedimentoDoc.name || "";
      procedureWrap.append(procedureBtn);
      nameCell.append(procedureWrap);
    }
    row.append(nameCell);

    const codeCell = document.createElement("td");
    codeCell.className = "pmp-col-code";
    codeCell.textContent = activity.codigo || "-";
    row.append(codeCell);

    const equipCell = document.createElement("td");
    equipCell.className = "pmp-col-equip";
    equipCell.textContent = equipLabel || "-";
    row.append(equipCell);

    const freqCell = document.createElement("td");
    freqCell.textContent = freqLabel;
    row.append(freqCell);

    const durCell = document.createElement("td");
    durCell.textContent = duracaoLabel;
    row.append(durCell);

    const techCell = document.createElement("td");
    techCell.textContent = activity.tecnicosEstimados ? String(activity.tecnicosEstimados) : "-";
    row.append(techCell);

    periods.forEach((period) => {
      const periodKey = period.key;
      const cell = document.createElement("td");
      const manualEntry = manualMap.get(activity.id)
        ? manualMap.get(activity.id).get(periodKey)
        : null;
      const isScheduled = scheduledKeys.has(periodKey) || Boolean(manualEntry);
      const duracaoBase = Number(activity.duracaoMinutos || 0);
      const tecnicosBase = Number(activity.tecnicosEstimados || 1);
      const statusInfo = getPmpStatusForPeriod(
        activity,
        period,
        periodKey,
        viewMode,
        manualMap,
        autoMap,
        today,
        isScheduled
      );
      const status = statusInfo.status;
      if (status !== "empty") {
        totalCells += 1;
        if (status === "on_time") {
          onTimeCells += 1;
        } else if (status === "late") {
          lateCells += 1;
        } else if (status === "cancelled") {
          cancelledCells += 1;
          missedCells += 1;
        } else if (status === "missed") {
          missedCells += 1;
        } else {
          scheduledCells += 1;
        }
        if (statusInfo.executedAt) {
          totalExecutedMinutes += Number(activity.duracaoMinutos || 0);
        }
        totalPlannedMinutes += duracaoBase;
        totalPlannedCapacityMinutes +=
          duracaoBase * (Number.isFinite(tecnicosBase) ? tecnicosBase : 1);
      }
      cell.className = `pmp-cell pmp-cell--${status === "empty" ? "empty" : status}`;
      const tooltipLines = [];
      if (viewMode === "day") {
        tooltipLines.push(`Data: ${formatDate(period.start)}`);
      } else {
        tooltipLines.push(`Período: ${formatDate(period.start)} - ${formatDate(period.end)}`);
      }
      if (statusInfo.dueDate && viewMode !== "day") {
        tooltipLines.push(`Data prevista: ${formatDate(statusInfo.dueDate)}`);
      }
      if (statusInfo.executedAt) {
        tooltipLines.push(`Executado em: ${formatDate(statusInfo.executedAt)}`);
        const executorId =
          statusInfo.exec && statusInfo.exec.executorId ? statusInfo.exec.executorId : "";
        if (executorId) {
          tooltipLines.push(`Executor: ${getUserLabel(executorId)}`);
        }
        if (statusInfo.exec && statusInfo.exec.osReferencia) {
          tooltipLines.push(`OS/RDO: ${statusInfo.exec.osReferencia}`);
        } else if (statusInfo.exec && statusInfo.exec.manutencaoId) {
          tooltipLines.push(`OS/RDO: ${statusInfo.exec.manutencaoId}`);
        }
      }
      tooltipLines.push(`Status: ${PMP_STATUS_LABELS[status] || status}`);
      cell.title = tooltipLines.join("\\n");
      cell.dataset.pmpCell = "true";
      cell.dataset.activityId = activity.id;
      cell.dataset.periodKey = periodKey;
      cell.dataset.status = status;
      cell.innerHTML = statusIconMap[status] || statusIconMap.scheduled;
      row.append(cell);
    });

    pmpGridBody.append(row);
  });

  const totalPercent = totalCells || 1;
  if (pmpTotalPrevistas) {
    pmpTotalPrevistas.textContent = String(totalCells);
  }
  if (pmpTotalConforme) {
    pmpTotalConforme.textContent = `${Math.round((onTimeCells / totalPercent) * 100)}%`;
  }
  if (pmpTotalAtraso) {
    pmpTotalAtraso.textContent = `${Math.round((lateCells / totalPercent) * 100)}%`;
  }
  if (pmpTotalNaoExecutadas) {
    pmpTotalNaoExecutadas.textContent = `${Math.round((missedCells / totalPercent) * 100)}%`;
  }
  if (pmpHorasPlanejadas) {
    pmpHorasPlanejadas.textContent = totalPlannedMinutes
      ? formatDuracaoMin(totalPlannedMinutes)
      : "00:00";
  }
  if (pmpHorasExecutadas) {
    pmpHorasExecutadas.textContent = totalExecutedMinutes
      ? formatDuracaoMin(totalExecutedMinutes)
      : "00:00";
  }
  if (pmpCargaSemanal) {
    const equipeCount = projectEquipe.length || 0;
    const horasPorTecnico = pmpHorasDisponiveis ? Number(pmpHorasDisponiveis.value || 0) : 0;
    const disponivel = equipeCount * horasPorTecnico;
    const totalWeeks = viewMode === "week" ? periods.length : 52;
    const previstoHoras = totalWeeks
      ? Math.round((totalPlannedCapacityMinutes / totalWeeks) / 60)
      : 0;
    pmpCargaSemanal.textContent = `${previstoHoras}h / ${disponivel}h`;
    const ratio = disponivel > 0 ? previstoHoras / disponivel : 0;
    if (pmpCargaBar) {
      const percent = Math.min(160, Math.round(ratio * 100));
      pmpCargaBar.style.width = `${percent}%`;
      pmpCargaBar.classList.toggle("is-warning", ratio > 1);
    }
    if (pmpCargaBarHint) {
      pmpCargaBarHint.textContent = `${Math.round(ratio * 100)}% utilizado`;
    }
  }
}

function closePmpImportModal() {
  if (modalPmpImport) {
    modalPmpImport.hidden = true;
  }
}

function updatePmpImportConfirmState() {
  if (pmpImportConfirm) {
    pmpImportConfirm.disabled = pmpImportSelection.size === 0;
    pmpImportConfirm.textContent =
      pmpImportSelection.size > 0
        ? `Importar (${pmpImportSelection.size})`
        : "Importar selecionadas";
  }
}

function renderPmpImportList() {
  if (!pmpImportList) {
    return;
  }
  const term = normalizeSearchValue(pmpImportSearch ? pmpImportSearch.value : "");
  pmpImportList.innerHTML = "";
  const items = pmpImportItems.filter((item) => {
    if (!term) {
      return true;
    }
    const equipamento = getEquipamentoNomeById(item.projectId, item.equipamentoId);
    const text = normalizeSearchValue(
      `${item.nome || ""} ${item.codigo || ""} ${equipamento || ""}`
    );
    return text.includes(term);
  });
  items.forEach((item) => {
    const tr = document.createElement("tr");
    const tdCheck = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = pmpImportSelection.has(item.id);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        pmpImportSelection.add(item.id);
      } else {
        pmpImportSelection.delete(item.id);
      }
      updatePmpImportConfirmState();
    });
    tdCheck.append(checkbox);
    tr.append(tdCheck);

    const tdNome = document.createElement("td");
    tdNome.textContent = item.nome || "-";
    tr.append(tdNome);

    const tdCodigo = document.createElement("td");
    tdCodigo.textContent = item.codigo || "-";
    tr.append(tdCodigo);

    const tdEquip = document.createElement("td");
    tdEquip.textContent = getEquipamentoNomeById(item.projectId, item.equipamentoId) || "-";
    tr.append(tdEquip);

    const tdFreq = document.createElement("td");
    tdFreq.textContent = item.frequencia
      ? (getPmpFrequency(item.frequencia) || { label: item.frequencia }).label
      : "-";
    tr.append(tdFreq);

    const tdTec = document.createElement("td");
    tdTec.textContent = item.tecnicosEstimados ? String(item.tecnicosEstimados) : "-";
    tr.append(tdTec);

    const tdDur = document.createElement("td");
    tdDur.textContent = item.duracaoMinutos ? formatDuracaoMin(item.duracaoMinutos) : "-";
    tr.append(tdDur);

    const tdUltima = document.createElement("td");
    tdUltima.textContent = item.ultimaExecucao ? formatDate(item.ultimaExecucao) : "-";
    tr.append(tdUltima);

    const tdStatus = document.createElement("td");
    tdStatus.textContent = item.status || "-";
    tr.append(tdStatus);

    pmpImportList.append(tr);
  });
  if (pmpImportEmpty) {
    pmpImportEmpty.hidden = items.length > 0;
  }
  updatePmpImportConfirmState();
}

async function openPmpImportModal() {
  if (!modalPmpImport || !pmpFiltroProjeto) {
    return;
  }
  const projectId = pmpFiltroProjeto.value;
  if (!projectId) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Selecione um projeto para importar manutenções.";
    }
    return;
  }
  if (!currentUser || !hasGranularPermission(currentUser, "gerenciarPMP")) {
    return;
  }
  if (pmpImportSearch) {
    pmpImportSearch.value = "";
  }
  pmpImportSelection = new Set();
  modalPmpImport.hidden = false;
  await ensurePmpEquipamentos(projectId);
  const items = await ensurePmpMaintenanceCache(projectId);
  pmpImportItems = buildPmpImportItems(projectId, items);
  renderPmpImportList();
}

async function confirmPmpImport() {
  if (!pmpFiltroProjeto) {
    return;
  }
  const projectId = pmpFiltroProjeto.value;
  if (!projectId) {
    return;
  }
  const selecionados = pmpImportItems.filter((item) => pmpImportSelection.has(item.id));
  if (!selecionados.length) {
    return;
  }
  if (pmpImportConfirm) {
    pmpImportConfirm.disabled = true;
  }
  const ano = getPmpYearValue();
  const inicioPadrao = formatDateISO(new Date());
  let fallbackFreq = false;
  const created = [];
  for (const item of selecionados) {
    const frequencia = item.frequencia || "mensal";
    if (!item.frequencia) {
      fallbackFreq = true;
    }
    try {
      const payload = {
        nome: item.nome || "Atividade importada",
        codigo: item.codigo || "",
        projectId,
        equipamentoId: item.equipamentoId || "",
        frequencia,
        inicio: inicioPadrao,
        meses: [],
        tecnicosEstimados: item.tecnicosEstimados || 0,
        duracaoMinutos: item.duracaoMinutos || 0,
        responsavelId: "",
        descricao: "",
        observacoes: "Importado do OS/RDO",
        procedimentos: "",
        checklist: [],
        tipoManutencao: "",
        origem: "importado",
        ano,
      };
      const data = await apiPmpActivitiesCreate(payload);
      if (data && data.activity) {
        created.push(data.activity);
      }
    } catch (error) {
      // ignore to continue others
    }
  }
  if (created.length) {
    pmpActivities = pmpActivities.concat(created);
    preencherPmpForm(created[created.length - 1]);
    renderTudo();
  }
  if (pmpFormMensagem) {
    pmpFormMensagem.textContent = fallbackFreq
      ? "Importação concluída. Revise a frequência das atividades importadas."
      : "Importação concluída.";
  }
  closePmpImportModal();
}

function closePmpCellModal() {
  if (modalPmpCell) {
    modalPmpCell.hidden = true;
  }
  pmpCellContext = null;
}

function renderPmpCellList(target, items, emptyLabel) {
  if (!target) {
    return;
  }
  target.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = emptyLabel || "-";
    target.append(li);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.append(li);
  });
}

function formatPmpTextList(list) {
  if (!Array.isArray(list) || !list.length) {
    return "";
  }
  return list.map((item) => String(item || "").trim()).filter(Boolean).join("\n");
}

function parsePmpTextList(text) {
  return String(text || "")
    .split(/\n+/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePmpProcedimentoDoc(doc) {
  if (!doc || typeof doc !== "object") {
    return null;
  }
  const url = resolvePublicUrl(String(doc.url || doc.dataUrl || "").trim());
  if (!url) {
    return null;
  }
  const name = String(doc.originalName || doc.name || "Procedimento.pdf").trim();
  return {
    id: doc.id ? String(doc.id) : "",
    url,
    name,
    originalName: name,
    mime: doc.mime ? String(doc.mime) : "application/pdf",
  };
}

function setPmpProcedimentoDoc(doc) {
  pmpProcedimentoDoc = normalizePmpProcedimentoDoc(doc);
  if (pmpProcedimentoName) {
    pmpProcedimentoName.textContent = pmpProcedimentoDoc ? pmpProcedimentoDoc.name : "Nenhum arquivo";
  }
  if (pmpProcedimentoView) {
    pmpProcedimentoView.hidden = !(pmpProcedimentoDoc && pmpProcedimentoDoc.url);
  }
  if (pmpProcedimentoRemove) {
    pmpProcedimentoRemove.hidden = !pmpProcedimentoDoc;
  }
  if (pmpProcedimentoUpload) {
    pmpProcedimentoUpload.textContent = pmpProcedimentoDoc ? "Alterar PDF" : "Anexar PDF";
  }
}

function openPmpProcedimento(doc) {
  const safeDoc = normalizePmpProcedimentoDoc(doc);
  if (!safeDoc || !safeDoc.url) {
    window.alert("Procedimento não encontrado.");
    return;
  }
  abrirPreview(safeDoc.url);
}

function renderPmpCellExecutorOptions(projectId, selectedId) {
  if (!pmpCellExecutorInput) {
    return;
  }
  const list = [];
  if (Array.isArray(projectEquipe) && projectEquipe.length) {
    projectEquipe.forEach((entry) => {
      const user = entry.user;
      if (user && (!entry.projectId || entry.projectId === projectId)) {
        list.push({ id: user.id, label: `${user.name} (${user.matricula})` });
      }
    });
  }
  if (!list.length && Array.isArray(users)) {
    users.forEach((user) => {
      if (user && user.id) {
        list.push({ id: user.id, label: `${user.name || user.username || "-"} (${user.matricula || "-"})` });
      }
    });
  }
  pmpCellExecutorInput.innerHTML = "";
  const optBlank = document.createElement("option");
  optBlank.value = "";
  optBlank.textContent = "Selecione";
  pmpCellExecutorInput.append(optBlank);
  const unique = new Map();
  list.forEach((entry) => {
    if (!entry.id || unique.has(entry.id)) {
      return;
    }
    unique.set(entry.id, entry);
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = entry.label;
    pmpCellExecutorInput.append(option);
  });
  pmpCellExecutorInput.value = selectedId && unique.has(selectedId) ? selectedId : "";
}

function openPmpCellModal(activityId, periodKey) {
  if (!modalPmpCell || !pmpLastSnapshot) {
    return;
  }
  const activity =
    pmpLastSnapshot.activities.find((item) => item.id === activityId) ||
    pmpActivities.find((item) => item.id === activityId);
  const period = pmpLastSnapshot.periods.find((item) => item.key === periodKey);
  if (!activity || !period) {
    return;
  }
  const scheduledKeys = getScheduledPeriodKeys(
    activity,
    pmpLastSnapshot.year,
    pmpLastSnapshot.viewMode,
    pmpLastSnapshot.periods,
    pmpLastSnapshot.monthIndex
  );
  const manualEntry = pmpLastSnapshot.manualMap.get(activity.id)
    ? pmpLastSnapshot.manualMap.get(activity.id).get(periodKey)
    : null;
  const isScheduled = scheduledKeys.has(periodKey) || Boolean(manualEntry);
  const statusInfo = getPmpStatusForPeriod(
    activity,
    period,
    periodKey,
    pmpLastSnapshot.viewMode,
    pmpLastSnapshot.manualMap,
    pmpLastSnapshot.autoMap,
    startOfDay(new Date()),
    isScheduled
  );
  const project = availableProjects.find((item) => item.id === activity.projectId);
  if (pmpCellTitle) {
    pmpCellTitle.textContent = activity.nome || "Atividade PMP";
  }
  if (pmpCellMeta) {
    const projectLabel = project ? getProjectLabel(project) : "-";
    const periodoTexto =
      pmpLastSnapshot.viewMode === "day"
        ? `Data: ${formatDate(period.start)}`
        : `Período: ${period.label} (${formatDate(period.start)} - ${formatDate(period.end)})`;
    pmpCellMeta.textContent = `Projeto: ${projectLabel} | ${periodoTexto} | Status: ${
      PMP_STATUS_LABELS[statusInfo.status] || "-"
    }`;
  }
  const execEntries = [];
  if (statusInfo.exec) {
    const tipo = statusInfo.exec.source === "auto" ? "Automático" : "Manual";
    const data = statusInfo.executedAt ? formatDate(statusInfo.executedAt) : "-";
    const executor = statusInfo.exec.executorId ? getUserLabel(statusInfo.exec.executorId) : "-";
    const os = statusInfo.exec.osReferencia || statusInfo.exec.manutencaoId || "-";
    execEntries.push(`${tipo}: ${data} | ${executor} | OS ${os}`);
    if (statusInfo.exec.observacao) {
      execEntries.push(`Obs: ${statusInfo.exec.observacao}`);
    }
  }
  renderPmpCellList(pmpCellExecList, execEntries, "Sem execução registrada.");

  const execRecord = manualEntry || statusInfo.exec;
  let evidencias = [];
  if (execRecord && Array.isArray(execRecord.evidencias) && execRecord.evidencias.length) {
    evidencias = execRecord.evidencias;
  } else if (statusInfo.exec && statusInfo.exec.manutencaoId) {
    const list = getPmpMaintenanceList(activity.projectId);
    const encontrado = list.find((item) => item && item.id === statusInfo.exec.manutencaoId);
    evidencias = getMaintenanceEvidencias(encontrado).map((evidencia) => {
      if (typeof evidencia === "string") {
        return evidencia;
      }
      return evidencia.nome || evidencia.name || evidencia.url || "Arquivo";
    });
  }
  renderPmpCellList(pmpCellEvidencias, evidencias, "Sem evidências registradas.");

  const checklistExec = execRecord && Array.isArray(execRecord.checklist) ? execRecord.checklist : [];
  const checklist = checklistExec.length
    ? normalizePmpChecklistItems(checklistExec)
    : normalizePmpChecklistItems(activity.checklist || []);
  renderPmpCellList(
    pmpCellChecklist,
    checklist.map((item) => `${item.descricao || "Item"}${item.link ? ` (${item.link})` : ""}`),
    "Sem checklist."
  );

  if (pmpCellObservacoes) {
    pmpCellObservacoes.textContent = activity.observacoes || "-";
  }
  if (pmpCellProcedimentos) {
    pmpCellProcedimentos.textContent = activity.procedimentos || "-";
  }

  const scheduledValue = execRecord && execRecord.scheduledFor
    ? parseAnyDate(execRecord.scheduledFor)
    : statusInfo.dueDate || period.start;
  const executedValue = execRecord && execRecord.executedAt
    ? parseAnyDate(execRecord.executedAt)
    : null;
  if (pmpCellScheduledInput) {
    pmpCellScheduledInput.value = scheduledValue ? formatDateISO(scheduledValue) : "";
  }
  if (pmpCellExecutedInput) {
    pmpCellExecutedInput.value = executedValue ? formatDateISO(executedValue) : "";
  }
  if (pmpCellObsInput) {
    pmpCellObsInput.value = execRecord && execRecord.observacao ? execRecord.observacao : "";
  }
  if (pmpCellEvidenciasInput) {
    pmpCellEvidenciasInput.value = formatPmpTextList(
      execRecord && Array.isArray(execRecord.evidencias) ? execRecord.evidencias : []
    );
  }
  if (pmpCellChecklistInput) {
    pmpCellChecklistInput.value = formatPmpTextList(
      execRecord && Array.isArray(execRecord.checklist) ? execRecord.checklist : []
    );
  }
  renderPmpCellExecutorOptions(
    activity.projectId,
    execRecord && execRecord.executorId ? execRecord.executorId : ""
  );

  const canManage = Boolean(currentUser && canManagePmpActivities(currentUser));
  const canExecute = Boolean(currentUser && canExecutePmp(currentUser));
  if (pmpCellMarkCancel) {
    pmpCellMarkCancel.hidden = !canManage;
    pmpCellMarkCancel.disabled = statusInfo.status === "cancelled";
  }
  if (pmpCellSave) {
    pmpCellSave.disabled = !canExecute;
  }
  if (pmpCellUnset) {
    pmpCellUnset.disabled = !canManage || statusInfo.status === "empty";
  }
  if (pmpCellRemove) {
    pmpCellRemove.hidden = !canManage || !(execRecord && execRecord.id);
    pmpCellRemove.disabled = !canManage || !(execRecord && execRecord.id);
  }
  const cellInputs = [
    pmpCellScheduledInput,
    pmpCellExecutedInput,
    pmpCellExecutorInput,
    pmpCellObsInput,
    pmpCellEvidenciasInput,
    pmpCellChecklistInput,
  ];
  cellInputs.forEach((input) => {
    if (input) {
      input.disabled = !canExecute;
    }
  });
  pmpCellContext = {
    activityId: activity.id,
    periodKey,
    scheduledFor: scheduledValue ? formatDateISO(scheduledValue) : "",
    executionId: execRecord && execRecord.id ? execRecord.id : "",
    projectId: activity.projectId,
  };
  modalPmpCell.hidden = false;
}

function upsertPmpExecution(execution) {
  if (!execution) {
    return;
  }
  const idx = pmpExecutions.findIndex((item) => item.id === execution.id);
  if (idx >= 0) {
    pmpExecutions[idx] = execution;
    return;
  }
  const byKey = pmpExecutions.findIndex(
    (item) =>
      item.activityId === execution.activityId &&
      item.periodKey === execution.periodKey &&
      item.projectId === execution.projectId
  );
  if (byKey >= 0) {
    pmpExecutions[byKey] = execution;
    return;
  }
  pmpExecutions = pmpExecutions.concat(execution);
}

async function marcarPmpCancelada() {
  if (!pmpCellContext || !pmpCellContext.activityId) {
    return;
  }
  if (!currentUser || !canManagePmpActivities(currentUser)) {
    return;
  }
  const confirmacao = window.confirm("Marcar atividade como cancelada neste período?");
  if (!confirmacao) {
    return;
  }
  try {
    const scheduledFor = pmpCellScheduledInput && pmpCellScheduledInput.value
      ? pmpCellScheduledInput.value
      : pmpCellContext.scheduledFor;
    const data = await apiPmpExecutionSave({
      activityId: pmpCellContext.activityId,
      periodKey: pmpCellContext.periodKey,
      scheduledFor,
      status: "cancelada",
    });
    if (data && data.execution) {
      upsertPmpExecution(data.execution);
      renderTudo();
    }
  } catch (error) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Erro ao marcar atividade cancelada.";
    }
  }
  closePmpCellModal();
}

async function salvarPmpExecucaoManual() {
  if (!pmpCellContext || !pmpCellContext.activityId) {
    return;
  }
  if (!currentUser || !canExecutePmp(currentUser)) {
    return;
  }
  const scheduledFor = pmpCellScheduledInput && pmpCellScheduledInput.value
    ? pmpCellScheduledInput.value
    : pmpCellContext.scheduledFor;
  const executedAt = pmpCellExecutedInput && pmpCellExecutedInput.value
    ? pmpCellExecutedInput.value
    : "";
  const executorId = pmpCellExecutorInput ? pmpCellExecutorInput.value : "";
  const observacao = pmpCellObsInput ? pmpCellObsInput.value.trim() : "";
  const evidencias = parsePmpTextList(pmpCellEvidenciasInput ? pmpCellEvidenciasInput.value : "");
  const checklist = parsePmpTextList(pmpCellChecklistInput ? pmpCellChecklistInput.value : "");
  const status = executedAt ? "concluida" : "agendada";
  try {
    const data = await apiPmpExecutionSave({
      activityId: pmpCellContext.activityId,
      periodKey: pmpCellContext.periodKey,
      scheduledFor,
      executedAt,
      executorId,
      observacao,
      evidencias,
      checklist,
      status,
      source: "manual",
    });
    if (data && data.execution) {
      upsertPmpExecution(data.execution);
      renderTudo();
    }
  } catch (error) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Erro ao salvar execução PMP.";
    }
  }
  closePmpCellModal();
}

async function removerPmpExecucaoManual() {
  if (!pmpCellContext || !pmpCellContext.executionId) {
    return;
  }
  if (!currentUser || !canManagePmpActivities(currentUser)) {
    return;
  }
  const confirmacao = window.confirm("Remover execução manual deste período?");
  if (!confirmacao) {
    return;
  }
  try {
    await apiPmpExecutionDelete(pmpCellContext.executionId);
    pmpExecutions = pmpExecutions.filter((item) => item.id !== pmpCellContext.executionId);
    renderTudo();
  } catch (error) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Erro ao remover execução.";
    }
  }
  closePmpCellModal();
}

async function marcarPmpNaoPrevista() {
  if (!pmpCellContext || !pmpCellContext.activityId) {
    return;
  }
  if (!currentUser || !canManagePmpActivities(currentUser)) {
    return;
  }
  const confirmacao = window.confirm("Marcar este período como não previsto?");
  if (!confirmacao) {
    return;
  }
  try {
    const scheduledFor = pmpCellScheduledInput && pmpCellScheduledInput.value
      ? pmpCellScheduledInput.value
      : pmpCellContext.scheduledFor;
    const data = await apiPmpExecutionSave({
      activityId: pmpCellContext.activityId,
      periodKey: pmpCellContext.periodKey,
      scheduledFor,
      status: "removida",
      source: "manual",
    });
    if (data && data.execution) {
      upsertPmpExecution(data.execution);
      renderTudo();
    }
  } catch (error) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Erro ao marcar como não prevista.";
    }
  }
  closePmpCellModal();
}

async function carregarPmpDados() {
  if (!currentUser) {
    pmpActivities = [];
    pmpExecutions = [];
    return;
  }
  const projectId = activeProjectId || "";
  try {
    const data = await apiPmpActivitiesList(projectId ? { projectId } : {});
    pmpActivities = Array.isArray(data.activities) ? data.activities : [];
  } catch (error) {
    pmpActivities = [];
  }
  try {
    const data = await apiPmpExecutionsList(projectId ? { projectId } : {});
    pmpExecutions = Array.isArray(data.executions) ? data.executions : [];
  } catch (error) {
    pmpExecutions = [];
  }
  renderTudo();
}

function buildPmpSnapshot() {
  const year = getPmpYearValue();
  const viewMode = getPmpViewMode();
  const monthIndex = getPmpMonthValue();
  const activities = getPmpFilteredActivities();
  const periods = getPmpPeriods(viewMode, year, monthIndex);
  const manualMap = getExecutionsByActivity();
  const autoMap = buildAutoExecutionMap(activities, periods, viewMode, year, monthIndex);
  const today = startOfDay(new Date());
  const monthLabel = PMP_MONTH_LABELS[monthIndex] || String(monthIndex + 1).padStart(2, "0");
  return { year, viewMode, monthIndex, monthLabel, activities, periods, manualMap, autoMap, today };
}

function exportarPmpExcel() {
  if (!pmpGrid) {
    return;
  }
  const snapshot = buildPmpSnapshot();
  const header = [
    "projeto",
    "equipamento",
    "codigo",
    "atividade",
    "tipo",
    "frequencia",
    "duracao",
    "tecnicos",
    ...snapshot.periods.map((period) => period.label),
  ];
  const linhas = snapshot.activities.map((activity) => {
    const project = availableProjects.find((item) => item.id === activity.projectId);
    const freqLabel = getPmpFrequency(activity.frequencia)
      ? getPmpFrequency(activity.frequencia).label
      : activity.frequencia || "";
    const tipoInfo = getPmpTipoInfo(activity.tipoManutencao || activity.tipo || "");
    const scheduledKeys = getScheduledPeriodKeys(
      activity,
      snapshot.year,
      snapshot.viewMode,
      snapshot.periods,
      snapshot.monthIndex
    );
    const values = [
      project ? getProjectLabel(project) : "",
      getEquipamentoNomeById(activity.projectId, activity.equipamentoId),
      activity.codigo || "",
      activity.nome || "",
      tipoInfo ? tipoInfo.label : activity.tipoManutencao || activity.tipo || "",
      freqLabel,
      activity.duracaoMinutos ? formatDuracaoMin(activity.duracaoMinutos) : "",
      activity.tecnicosEstimados ? String(activity.tecnicosEstimados) : "",
    ];
    snapshot.periods.forEach((period) => {
      const periodKey = period.key;
      const manualEntry = snapshot.manualMap.get(activity.id)
        ? snapshot.manualMap.get(activity.id).get(periodKey)
        : null;
      const isScheduled = scheduledKeys.has(periodKey) || Boolean(manualEntry);
      if (!isScheduled) {
        values.push(snapshot.viewMode === "day" ? (PMP_STATUS_LABELS.empty || "Não prevista") : "");
        return;
      }
      const statusInfo = getPmpStatusForPeriod(
        activity,
        period,
        periodKey,
        snapshot.viewMode,
        snapshot.manualMap,
        snapshot.autoMap,
        snapshot.today,
        isScheduled
      );
      values.push(
        statusInfo.status === "empty"
          ? PMP_STATUS_LABELS.empty || "Não prevista"
          : PMP_STATUS_LABELS[statusInfo.status] || "Planejada"
      );
    });
    return values.map(escapeCsv).join(",");
  });
  const csv = [header.map(escapeCsv).join(","), ...linhas].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const monthSuffix = snapshot.viewMode === "day" ? `-${snapshot.monthLabel}` : "";
  link.download = `pmp-${snapshot.year}-${snapshot.viewMode}${monthSuffix}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportarPmpPdf() {
  const snapshot = buildPmpSnapshot();
  const popup = window.open("", "_blank");
  if (!popup) {
    return;
  }
  let totalCells = 0;
  let onTimeCells = 0;
  let lateCells = 0;
  let missedCells = 0;
  let cancelledCells = 0;
  let totalPlannedMinutes = 0;
  let totalExecutedMinutes = 0;
  const statusClassMap = {
    on_time: "on-time",
    late: "late",
    missed: "missed",
    scheduled: "scheduled",
    cancelled: "cancelled",
  };
  const rows = snapshot.activities
    .map((activity) => {
      const project = availableProjects.find((item) => item.id === activity.projectId);
      const projectLabel = project ? getProjectLabel(project) : "-";
      const equipLabel = getEquipamentoNomeById(activity.projectId, activity.equipamentoId);
      const tipoInfo = getPmpTipoInfo(activity.tipoManutencao || activity.tipo || "");
      const tipoLabel = tipoInfo ? tipoInfo.label : activity.tipoManutencao || activity.tipo || "-";
      const freqLabel = getPmpFrequency(activity.frequencia)
        ? getPmpFrequency(activity.frequencia).label
        : activity.frequencia || "-";
      const scheduledKeys = getScheduledPeriodKeys(
        activity,
        snapshot.year,
        snapshot.viewMode,
        snapshot.periods,
        snapshot.monthIndex
      );
      const cells = snapshot.periods
        .map((period) => {
          const periodKey = period.key;
          const manualEntry = snapshot.manualMap.get(activity.id)
            ? snapshot.manualMap.get(activity.id).get(periodKey)
            : null;
          const isScheduled = scheduledKeys.has(periodKey) || Boolean(manualEntry);
          if (!isScheduled) {
            const emptyLabel =
              snapshot.viewMode === "day"
                ? PMP_STATUS_LABELS.empty || "Não prevista"
                : "-";
            return `<td class="pmp-cell empty">${escapeHtml(emptyLabel)}</td>`;
          }
          const statusInfo = getPmpStatusForPeriod(
            activity,
            period,
            periodKey,
            snapshot.viewMode,
            snapshot.manualMap,
            snapshot.autoMap,
            snapshot.today,
            isScheduled
          );
          const status = statusInfo.status;
          if (status === "empty") {
            const emptyLabel = PMP_STATUS_LABELS.empty || "Não prevista";
            return `<td class="pmp-cell empty">${escapeHtml(emptyLabel)}</td>`;
          }
          totalCells += 1;
          totalPlannedMinutes += Number(activity.duracaoMinutos || 0);
          if (status === "on_time") {
            onTimeCells += 1;
          } else if (status === "late") {
            lateCells += 1;
          } else if (status === "cancelled") {
            cancelledCells += 1;
            missedCells += 1;
          } else if (status === "missed") {
            missedCells += 1;
          }
          if (statusInfo.executedAt) {
            totalExecutedMinutes += Number(activity.duracaoMinutos || 0);
          }
          const statusClass = statusClassMap[status] || "scheduled";
          const label = PMP_STATUS_LABELS[status] || "Planejada";
          return `<td class="pmp-cell ${statusClass}">${label}</td>`;
        })
        .join("");
      return `
        <tr>
          <td>${escapeHtml(projectLabel)}</td>
          <td>${escapeHtml(equipLabel)}</td>
          <td>${escapeHtml(activity.codigo || "-")}</td>
          <td>${escapeHtml(activity.nome || "-")}</td>
          <td>${escapeHtml(tipoLabel)}</td>
          <td>${escapeHtml(freqLabel)}</td>
          ${cells}
        </tr>
      `;
    })
    .join("");
  const headerCols = snapshot.periods.map((period) => `<th>${period.label}</th>`).join("");
  const percentBase = totalCells || 1;
  const scheduledCells = totalCells - onTimeCells - lateCells - missedCells - cancelledCells;
  const percentOnTime = Math.round((onTimeCells / percentBase) * 100);
  const percentLate = Math.round((lateCells / percentBase) * 100);
  const percentMissed = Math.round((missedCells / percentBase) * 100);
  const percentScheduled = Math.max(0, 100 - percentOnTime - percentLate - percentMissed);
  const projectFilter = (pmpFiltroProjeto && pmpFiltroProjeto.value) || activeProjectId || "";
  const selectedProject = projectFilter
    ? availableProjects.find((item) => item.id === projectFilter)
    : null;
  const projectLabel = selectedProject ? getProjectLabel(selectedProject) : "Todos os projetos";
  const kpiHtml = `
    <div class="pmp-kpi">
      <span>Total previstas: ${totalCells}</span>
      <span>Conforme: ${Math.round((onTimeCells / percentBase) * 100)}%</span>
      <span>Fora da janela: ${Math.round((lateCells / percentBase) * 100)}%</span>
      <span>Atrasadas: ${Math.round((missedCells / percentBase) * 100)}%</span>
      <span>Canceladas: ${cancelledCells}</span>
      <span>Horas planejadas: ${
        totalPlannedMinutes ? formatDuracaoMin(totalPlannedMinutes) : "00:00"
      }</span>
      <span>Horas executadas: ${
        totalExecutedMinutes ? formatDuracaoMin(totalExecutedMinutes) : "00:00"
      }</span>
    </div>
  `;
  const legendHtml = `
    <div class="pmp-legend">
      <span class="legend-item on-time">Conforme</span>
      <span class="legend-item missed">Atrasada</span>
      <span class="legend-item scheduled">Planejada</span>
      <span class="legend-item late">Fora da janela</span>
      <span class="legend-item empty">Não prevista</span>
      <span class="legend-item cancelled">Cancelada</span>
    </div>
  `;
  const chartHtml = `
    <div class="pmp-chart">
      <span class="chart-on-time" style="width: ${percentOnTime}%"></span>
      <span class="chart-scheduled" style="width: ${percentScheduled}%"></span>
      <span class="chart-late" style="width: ${percentLate}%"></span>
      <span class="chart-missed" style="width: ${percentMissed}%"></span>
    </div>
  `;
  const html = `
    <html>
      <head>
        <title>PMP ${snapshot.year}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1f2a33; margin: 24px; }
          h1 { margin: 0 0 8px; font-size: 20px; }
          p { margin: 0 0 16px; color: #425363; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #d7d7d7; padding: 6px; text-align: left; }
          th { background: #f0f2f4; text-transform: uppercase; letter-spacing: 0.08em; font-size: 10px; }
          .pmp-cell { text-align: center; font-weight: 600; }
          .pmp-cell.on-time { background: #d1fae5; }
          .pmp-cell.late { background: #fef3c7; }
          .pmp-cell.missed { background: #fee2e2; }
          .pmp-cell.scheduled { background: #dbeafe; }
          .pmp-cell.cancelled { background: #e2e8f0; }
          .pmp-cell.empty { color: #9aa6b2; }
          .pmp-kpi { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 16px; font-size: 10px; color: #425363; }
          .pmp-legend { margin-top: 10px; display: flex; gap: 12px; flex-wrap: wrap; font-size: 10px; color: #425363; }
          .legend-item { display: inline-flex; align-items: center; gap: 6px; }
          .legend-item::before { content: ""; width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
          .legend-item.on-time::before { background: #22c55e; }
          .legend-item.late::before { background: #f59e0b; }
          .legend-item.missed::before { background: #ef4444; }
          .legend-item.scheduled::before { background: #3b82f6; }
          .legend-item.empty::before { background: #94a3b8; }
          .legend-item.cancelled::before { background: #94a3b8; }
          .pmp-chart { margin: 10px 0 4px; height: 10px; background: #e5e7eb; border-radius: 999px; overflow: hidden; display: flex; }
          .pmp-chart span { height: 100%; display: block; }
          .chart-on-time { background: #22c55e; }
          .chart-scheduled { background: #3b82f6; }
          .chart-late { background: #f59e0b; }
          .chart-missed { background: #ef4444; }
          @page { size: A4 landscape; margin: 16mm; }
        </style>
      </head>
      <body>
        <h1>PMP / Cronograma ${snapshot.year}</h1>
        <p>Projeto: ${escapeHtml(projectLabel)} | Visualização: ${
          snapshot.viewMode === "day"
            ? `Diario (${snapshot.monthLabel})`
            : snapshot.viewMode === "week"
              ? "Semanal"
              : "Mensal"
        }</p>
        ${legendHtml}
        ${chartHtml}
        <table>
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Equipamento</th>
              <th>Codigo</th>
              <th>Atividade</th>
              <th>Tipo</th>
              <th>Freq.</th>
              ${headerCols}
            </tr>
          </thead>
          <tbody>
            ${rows || ""}
          </tbody>
        </table>
        ${kpiHtml}
      </body>
    </html>
  `;
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
  popup.focus();
  popup.print();
}

async function duplicarPmpPlano() {
  if (!currentUser || !hasGranularPermission(currentUser, "gerenciarPMP")) {
    return;
  }
  const projectId = pmpFiltroProjeto ? pmpFiltroProjeto.value : activeProjectId;
  if (!projectId) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Selecione um projeto para duplicar.";
    }
    return;
  }
  const anoAtual = getPmpYearValue();
  const targetYear = anoAtual + 1;
  const confirmacao = window.confirm(
    `Duplicar o plano ${anoAtual} para ${targetYear}?`
  );
  if (!confirmacao) {
    return;
  }
  try {
    await apiPmpDuplicate({ projectId, sourceYear: anoAtual, targetYear });
    await carregarPmpDados();
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Plano duplicado.";
    }
  } catch (error) {
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Erro ao duplicar plano.";
    }
  }
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
          resumo: "Manutenção criada automaticamente pela recorrência.",
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
  if (!currentUser || !canViewUsuarios(currentUser)) {
    solicitacoesVazio.textContent = "Acesso restrito.";
    solicitacoesVazio.hidden = false;
    return;
  }
  if (requests.length === 0) {
    solicitacoesVazio.textContent = "Nenhuma solicitação pendente.";
    solicitacoesVazio.hidden = false;
    return;
  }
  solicitacoesVazio.hidden = true;
  const podeAprovar = Boolean(currentUser && canInviteUsuarios(currentUser));

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
    roleInput.disabled = !podeAprovar;
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
      checkbox.disabled = !podeAprovar;
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
      checkbox.disabled = !podeAprovar;
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
    btnAprovar.disabled = !podeAprovar;
    btnAprovar.classList.toggle("is-disabled", !podeAprovar);
    const btnRecusar = document.createElement("button");
    btnRecusar.type = "button";
    btnRecusar.className = "btn btn--ghost btn--small btn--danger";
    btnRecusar.dataset.action = "reject";
    btnRecusar.textContent = "Recusar";
    btnRecusar.disabled = !podeAprovar;
    btnRecusar.classList.toggle("is-disabled", !podeAprovar);
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
    const projeto = normalizeSearchValue(getUserProjectLabel(user));
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
    usuariosVazio.textContent = "Nenhum usuário encontrado.";
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
    titulo.textContent = user.name || user.matricula || "Usuário";
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
    detalhes.textContent = `Cargo: ${user.cargo || "-"} | Projeto: ${getUserProjectLabel(user)}`;
    item.append(header, meta, detalhes);
    listaUsuarios.append(item);
  });
}

function getActiveProject() {
  return availableProjects.find((project) => project.id === activeProjectId) || null;
}

function renderProjectSelector() {
  if (!projectSelect) {
    return;
  }
  projectSelect.innerHTML = "";
  if (!availableProjects.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Sem projetos";
    projectSelect.append(opt);
    projectSelect.disabled = true;
  } else {
    availableProjects.forEach((project) => {
      const opt = document.createElement("option");
      const label = `${project.codigo || "-"} - ${project.nome || "-"}`;
      opt.value = project.id;
      opt.textContent = label;
      projectSelect.append(opt);
    });
    projectSelect.disabled = false;
    if (activeProjectId) {
      projectSelect.value = activeProjectId;
    }
  }
  if (projectSelectLabel) {
    projectSelectLabel.textContent = "Projeto ativo";
  }
  if (projectManageBtn) {
    const canManage =
      currentUser &&
      (canManageProjetos(currentUser) ||
        canManageEquipamentos(currentUser) ||
        canManageEquipeProjeto(currentUser));
    projectManageBtn.hidden = !canManage;
  }
  if (crumbs) {
    renderBreadcrumb();
  }
  renderProjectSelectOptions(manutencaoProjeto, activeProjectId);
  renderProjectSelectOptions(templateProjeto, activeProjectId);
  renderRelatorioClienteSelect();
}

function renderRelatorioClienteSelect() {
  if (!relatorioCliente) {
    return;
  }
  const activeProject = getActiveProject();
  const cliente = activeProject && activeProject.cliente ? String(activeProject.cliente).trim() : "";
  const value = cliente || RDO_CLIENTE;
  relatorioCliente.innerHTML = "";
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = value;
  relatorioCliente.append(opt);
  relatorioCliente.value = value;
}

function setProjectTab(tab) {
  if (!projectTabs.length || !projectPanels.length) {
    return;
  }
  projectTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.projectTab === tab);
  });
  projectPanels.forEach((panel) => {
    panel.hidden = panel.dataset.projectPanel !== tab;
  });
}

function renderProjetosTable() {
  if (!projectTableBody) {
    return;
  }
  projectTableBody.innerHTML = "";
  if (!availableProjects.length) {
    return;
  }
  availableProjects.forEach((project) => {
    const tr = document.createElement("tr");
    const actions = [];
    actions.push(`<button type="button" class="btn btn--ghost btn--small" data-action="set-active">Ativar</button>`);
    if (currentUser && canManageProjetos(currentUser)) {
      actions.push(`<button type="button" class="btn btn--ghost btn--small" data-action="edit-project">Editar</button>`);
      actions.push(`<button type="button" class="btn btn--ghost btn--small btn--danger" data-action="delete-project">Excluir</button>`);
    }
    tr.dataset.projectId = project.id;
    tr.innerHTML = `
      <td>${escapeHtml(project.codigo || "-")}</td>
      <td>${escapeHtml(project.nome || "-")}</td>
      <td>${escapeHtml(project.cliente || "-")}</td>
      <td class="table-actions">${actions.join(" ")}</td>
    `;
    projectTableBody.append(tr);
  });
}

function renderProjectFormSelect() {
  if (!projectFormSelect) {
    return;
  }
  projectFormSelect.innerHTML = "";
  const optNew = document.createElement("option");
  optNew.value = "";
  optNew.textContent = "Novo projeto";
  projectFormSelect.append(optNew);
  availableProjects.forEach((project) => {
    const opt = document.createElement("option");
    opt.value = project.id;
    opt.textContent = getProjectLabel(project);
    projectFormSelect.append(opt);
  });
  if (projectFormId && projectFormId.value) {
    projectFormSelect.value = projectFormId.value;
  }
}

function renderEquipamentosTable() {
  if (!equipamentoTableBody) {
    return;
  }
  equipamentoTableBody.innerHTML = "";
  if (!projectEquipamentos.length) {
    return;
  }
  projectEquipamentos.forEach((equip) => {
    const tr = document.createElement("tr");
    const actions = [];
    if (currentUser && canManageEquipamentos(currentUser)) {
      actions.push(`<button type="button" class="btn btn--ghost btn--small" data-action="edit-equipment">Editar</button>`);
      actions.push(`<button type="button" class="btn btn--ghost btn--small btn--danger" data-action="delete-equipment">Excluir</button>`);
    }
    tr.dataset.equipmentId = equip.id;
    tr.innerHTML = `
      <td>${escapeHtml(equip.tag || "-")}</td>
      <td>${escapeHtml(equip.nome || "-")}</td>
      <td>${escapeHtml(equip.categoria || "-")}</td>
      <td>${escapeHtml(equip.descricao || "-")}</td>
      <td class="table-actions">${actions.join(" ")}</td>
    `;
    equipamentoTableBody.append(tr);
  });
}

function renderEquipamentoOptions() {
  if (!equipamentoManutencao) {
    return;
  }
  equipamentoManutencao.innerHTML = `<option value="">Selecione um equipamento</option>`;
  projectEquipamentos.forEach((equip) => {
    const option = document.createElement("option");
    option.value = equip.id;
    option.textContent = `${equip.tag || "-"} - ${equip.nome || "-"}`;
    equipamentoManutencao.append(option);
  });
}

function renderEquipeSelectOptions() {
  if (!equipeFormUser) {
    return;
  }
  const selecionados = new Set(
    Array.from(equipeFormUser.selectedOptions || []).map((option) => option.value)
  );
  equipeFormUser.innerHTML = "";
  const termo = equipeSearch ? normalizeSearchValue(equipeSearch.value || "") : "";
  const vinculados = new Set(projectEquipe.map((entry) => entry.userId));
  users.forEach((user) => {
    if (vinculados.has(user.id)) {
      return;
    }
    const label = `${user.name || user.matricula || user.username || "-"} (${getRoleLabel(user)})`;
    if (termo && !normalizeSearchValue(label).includes(termo)) {
      return;
    }
    const opt = document.createElement("option");
    opt.value = user.id;
    opt.textContent = label;
    if (selecionados.has(user.id)) {
      opt.selected = true;
    }
    equipeFormUser.append(opt);
  });
}

function renderEquipeTable() {
  if (!equipeTableBody) {
    return;
  }
  equipeTableBody.innerHTML = "";
  if (!projectEquipe.length) {
    return;
  }
  projectEquipe.forEach((entry) => {
    const user = entry.user || {};
    const tr = document.createElement("tr");
    const actions = [];
    if (currentUser && canManageEquipeProjeto(currentUser)) {
      actions.push(`<button type="button" class="btn btn--ghost btn--small btn--danger" data-action="remove-team">Remover</button>`);
    }
    tr.dataset.userId = entry.userId;
    tr.innerHTML = `
      <td>${escapeHtml(user.name || user.matricula || "-")}</td>
      <td>${escapeHtml(user.cargo || "-")}</td>
      <td>${escapeHtml(entry.papel || "-")}</td>
      <td class="table-actions">${actions.join(" ")}</td>
    `;
    equipeTableBody.append(tr);
  });
}

function renderProjectPanel() {
  renderProjetosTable();
  renderProjectFormSelect();
  renderEquipamentosTable();
  renderEquipamentoOptions();
  renderEquipeTable();
  renderEquipeSelectOptions();
  renderProjectSelectOptions(equipamentoFormProject, activeProjectId);
  setFormDisabled(projectForm, !(currentUser && canManageProjetos(currentUser)));
  setFormDisabled(equipamentoForm, !(currentUser && canManageEquipamentos(currentUser)));
  setFormDisabled(equipeForm, !(currentUser && canManageEquipeProjeto(currentUser)));
  if (projectPanels.length && !projectPanels.some((panel) => !panel.hidden)) {
    setProjectTab("lista");
  }
}

function resetProjectForm() {
  if (projectForm) {
    projectForm.reset();
  }
  if (projectFormId) {
    projectFormId.value = "";
  }
  if (projectFormSelect) {
    projectFormSelect.value = "";
  }
  if (projectFormLocais) {
    projectFormLocais.value = "";
  }
}

function setProjectFormValues(project) {
  if (!project) {
    resetProjectForm();
    return;
  }
  if (projectFormId) projectFormId.value = project.id || "";
  if (projectFormCodigo) projectFormCodigo.value = project.codigo || "";
  if (projectFormNome) projectFormNome.value = project.nome || "";
  if (projectFormCliente) projectFormCliente.value = project.cliente || "";
  if (projectFormDescricao) projectFormDescricao.value = project.descricao || "";
  if (projectFormLocais) {
    const locais = Array.isArray(project.locais) ? project.locais : [];
    projectFormLocais.value = locais.join("\n");
  }
  if (projectFormSelect) projectFormSelect.value = project.id || "";
}

function resetEquipamentoForm() {
  if (equipamentoForm) {
    equipamentoForm.reset();
  }
  if (equipamentoFormId) {
    equipamentoFormId.value = "";
  }
  if (equipamentoFormProject) {
    equipamentoFormProject.value = activeProjectId || "";
  }
}

function setFormDisabled(form, disabled) {
  if (!form) {
    return;
  }
  const fields = Array.from(form.querySelectorAll("input, select, textarea, button"));
  fields.forEach((field) => {
    field.disabled = disabled;
  });
}

async function refreshProjects() {
  if (!currentUser) {
    return;
  }
  try {
    const data = await apiProjetosList();
    if (Array.isArray(data.projects)) {
      availableProjects = data.projects;
    }
  } catch (error) {
    // Mantem o que ja carregou de /api/auth/me caso a rota de projetos falhe.
  }
  if (!availableProjects.length) {
    renderProjectSelector();
    renderProjectPanel();
    return;
  }
  const activeStillValid = activeProjectId
    ? availableProjects.some((item) => item.id === activeProjectId)
    : false;
  if (!activeStillValid) {
    const fallback = availableProjects[0]?.id || "";
    if (fallback) {
      await setActiveProjectId(fallback, { sync: true, force: true });
      return;
    }
  }
  renderProjectSelector();
  renderProjectPanel();
}

async function carregarEquipamentosProjeto() {
  if (!currentUser || !activeProjectId) {
    projectEquipamentos = [];
    renderEquipamentosTable();
    return;
  }
  try {
    const data = await apiProjetosEquipamentosList(activeProjectId);
    projectEquipamentos = Array.isArray(data.equipamentos) ? data.equipamentos : [];
  } catch (error) {
    projectEquipamentos = [];
  }
  renderEquipamentosTable();
  renderEquipamentoOptions();
}

async function carregarManutencoesServidor(force = false) {
  if (!currentUser || !activeProjectId) {
    return;
  }
  if (!force && maintenanceLoadedProjects.has(activeProjectId)) {
    return;
  }
  try {
    const data = await apiMaintenanceList(activeProjectId);
    if (data && Array.isArray(data.items)) {
      manutencoes = data.items;
      const resultado = normalizarManutencoes(manutencoes);
      manutencoes = resultado.normalizadas;
      salvarManutencoes(manutencoes);
      pmpMaintenanceCache.set(activeProjectId, manutencoes);
      maintenanceLoadedProjects.add(activeProjectId);
      renderTudo();
    }
  } catch (error) {
    // fallback silencioso
  }
}

async function carregarEquipeProjeto() {
  if (!currentUser || !activeProjectId) {
    projectEquipe = [];
    renderEquipeTable();
    return;
  }
  try {
    const data = await apiProjetosEquipeList(activeProjectId);
    projectEquipe = Array.isArray(data.equipe) ? data.equipe : [];
  } catch (error) {
    projectEquipe = [];
  }
  renderEquipeTable();
}

function renderPerfil() {
  if (!perfilNome) {
    return;
  }

  const editRequested = isProfileEditMode();
  const podeEditarPerfil = currentUser ? canEditProfile(currentUser, currentUser) : false;
  const isEdit = Boolean(editRequested && podeEditarPerfil);
  const perfilUsuario = currentUser;
  const isSelfProfile = Boolean(
    currentUser && perfilUsuario && String(currentUser.id) === String(perfilUsuario.id)
  );

  if (editRequested && !podeEditarPerfil) {
    setProfileEditParam(false);
  }

  if (perfilCard) {
    perfilCard.classList.toggle("is-editing", isEdit);
  }
  if (perfilView) {
    perfilView.hidden = isEdit;
  }
  if (perfilViewActions) {
    perfilViewActions.hidden = isEdit;
  }
  if (perfilEditActions) {
    perfilEditActions.hidden = !isEdit;
  }
  if (perfilModeBadge) {
    perfilModeBadge.hidden = !isEdit;
  }
  if (perfilTitle) {
    perfilTitle.textContent = isEdit ? "Editar perfil" : "Meu perfil";
  }
  if (btnPerfilEditar) {
    btnPerfilEditar.hidden = !podeEditarPerfil;
  }

  if (isEdit) {
    if (isSelfProfile) {
      mountProfileAvatarActions();
    } else {
      unmountProfileAvatarActions();
    }
    mountProfileEdit();
  } else {
    unmountProfileAvatarActions();
    unmountProfileEdit();
    setPerfilSaveMessage("");
    pendingAvatarDataUrl = "";
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
    if (perfilUen) {
      perfilUen.textContent = "-";
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
    if (perfilViewActions) {
      perfilViewActions.hidden = true;
    }
    if (perfilEditActions) {
      perfilEditActions.hidden = true;
    }
    if (btnPerfilEditar) {
      btnPerfilEditar.hidden = true;
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

  perfilNome.textContent = formatProfileValue(currentUser.name);
  if (perfilMatricula) {
    perfilMatricula.textContent = formatProfileValue(
      currentUser.matricula || currentUser.username || ""
    );
  }
  if (perfilCargo) {
    perfilCargo.textContent = formatProfileValue(currentUser.cargo);
  }
  if (perfilProjeto) {
    perfilProjeto.textContent = formatProfileValue(getUserProjectLabel(currentUser));
  }
  if (perfilUen) {
    perfilUen.textContent = formatProfileValue(currentUser.uen);
  }
  if (perfilRole) {
    perfilRole.textContent = formatProfileValue(getRoleLabel(currentUser));
  }
  if (perfilAtribuicoes) {
    perfilAtribuicoes.textContent = currentUser.atribuicoes || "Não informado.";
  }
  if (perfilPermissoes) {
    perfilPermissoes.textContent = isAdminUser
      ? "Total"
      : permissoesAtivas.length
        ? permissoesAtivas.join(", ")
        : "Sem permissões.";
  }
  if (perfilSecoes) {
    perfilSecoes.textContent = isAdminUser
      ? "Todas (inclui governança)"
      : secoesAtivas.length
        ? secoesAtivas.join(", ")
        : "Nenhuma.";
  }
  const perfilUenInputAtual = document.getElementById("perfilUenInput");
  if (perfilUenInputAtual) {
    perfilUenInputAtual.value = currentUser.uen || "";
  }
  const perfilProjetoInputAtual = document.getElementById("perfilProjetoInput");
  if (perfilProjetoInputAtual) {
    renderProjectSelectOptions(perfilProjetoInputAtual, currentUser.projectId || "");
  }
  const btnSalvarAtual = document.getElementById("btnPerfilSalvar");
  if (btnSalvarAtual) {
    btnSalvarAtual.disabled = !podeEditarPerfil;
  }
  const btnAvatarSaveAtual = document.getElementById("btnAvatarSave");
  if (btnAvatarSaveAtual) {
    btnAvatarSaveAtual.disabled = !pendingAvatarDataUrl;
  }
  const btnAvatarRemoveAtual = document.getElementById("btnAvatarRemove");
  if (btnAvatarRemoveAtual) {
    btnAvatarRemoveAtual.disabled = !currentUser.avatarUrl && !pendingAvatarDataUrl;
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
    fecharUserMenu();
    esconderCarregando();
    dashboardSummary = null;
    dashboardError = "";
    dashboardLastFetch = 0;
    maintenanceLastSync = 0;
    maintenanceLastUserId = null;
    filesState.items = [];
    permissoesState.values = {};
    permissoesState.profiles = [];
    permissoesState.permissions = [];
    permissoesState.loaded = false;
    if (maintenanceSyncTimer) {
      clearTimeout(maintenanceSyncTimer);
      maintenanceSyncTimer = null;
    }
  }

  if (autenticado) {
    const displayName = getDisplayName(currentUser);
    usuarioAtual.textContent = displayName;
    usuarioAtual.hidden = false;
    if (userMenuName) {
      userMenuName.textContent = displayName;
    }
    if (userMenuRole) {
      userMenuRole.textContent = getUserMenuRoleText(currentUser);
    }
    applyAvatarToElement(userAvatar, getAvatarUrl(currentUser));
    applyAvatarToElement(userMenuAvatar, getAvatarUrl(currentUser));
    btnTabLogin.hidden = true;
    btnTabRegistro.hidden = true;
    btnSair.hidden = false;
    esconderAuthPanels();
    if (maintenanceLastUserId !== currentUser.id) {
      if (maintenanceLoadedProjects.has(activeProjectId)) {
        scheduleMaintenanceSync(manutencoes, true);
      }
    }
  } else {
    usuarioAtual.textContent = "Visitante";
    usuarioAtual.hidden = true;
    btnTabLogin.hidden = false;
    btnTabRegistro.hidden = false;
    btnSair.hidden = true;
    pendingAvatarDataUrl = "";
    const btnAvatarSaveAtual = document.getElementById("btnAvatarSave");
    if (btnAvatarSaveAtual) {
      btnAvatarSaveAtual.disabled = true;
    }
    setAvatarError("");
    applyAvatarToElement(perfilAvatarPreview, "");
    applyAvatarToElement(userAvatar, "");
    applyAvatarToElement(userMenuAvatar, "");
  }

  const secConfig = getSectionConfig(currentUser);

  tabButtons.forEach((botao) => {
    const tab = botao.dataset.tab;
    const podeVer = autenticado && canViewTab(tab, currentUser, secConfig);
    botao.hidden = !podeVer;
  });

  panels.forEach((panel) => {
    const nome = panel.dataset.panel;
    const podeVer = autenticado && canViewTab(nome, currentUser, secConfig);
    panel.hidden = !podeVer;
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
    const tab = section.dataset.tab || section.dataset.panel;
    if (tab) {
      section.hidden = !autenticado || !canViewTab(tab, currentUser, secConfig);
      return;
    }
    section.hidden = !autenticado || !canViewGerencial(currentUser);
  });

  document.querySelectorAll(".nav-group").forEach((grupo) => {
    const itens = Array.from(grupo.querySelectorAll("[data-tab]"));
    const algumVisivel = itens.some((item) => !item.hidden);
    grupo.hidden = !algumVisivel;
  });

  if (gerencialHealth) {
    gerencialHealth.hidden =
      !currentUser ||
      !canViewGerencial(currentUser) ||
      !hasGranularPermission(currentUser, "verDiagnostico");
  }
  if (gerencialLogs) {
    gerencialLogs.hidden =
      !currentUser ||
      !canViewGerencial(currentUser) ||
      !hasGranularPermission(currentUser, "verLogsAPI");
  }
  if (gerencialAutomations) {
    gerencialAutomations.hidden =
      !currentUser ||
      !canViewGerencial(currentUser) ||
      !hasGranularPermission(currentUser, "verAutomacoes");
  }
  if (gerencialFiles) {
    gerencialFiles.hidden =
      !currentUser ||
      !canViewGerencial(currentUser) ||
      !canManageFilesClient(currentUser);
  }
  if (gerencialPermissoes) {
    const podeVerGerencial = Boolean(currentUser && canViewGerencial(currentUser));
    gerencialPermissoes.hidden = !podeVerGerencial;
  }
  updateGerencialTabVisibility();
  const podeUploadArquivos = currentUser && canUploadFilesClient(currentUser);
  if (filesUploadInput) {
    filesUploadInput.disabled = !podeUploadArquivos;
  }
  if (btnFilesUpload) {
    btnFilesUpload.disabled = !podeUploadArquivos;
  }

  if (btnAdicionarManutencao) {
    const podeCriar = can("create") && secConfig.nova !== false;
    btnAdicionarManutencao.disabled = !podeCriar;
    btnAdicionarManutencao.classList.toggle("is-disabled", !podeCriar);
  }

  if (btnGerarRelatorio) {
    const podeExportar = currentUser && canExportRelatorios(currentUser);
    btnGerarRelatorio.disabled = !podeExportar;
    btnGerarRelatorio.classList.toggle("is-disabled", !podeExportar);
  }

  const podeConvidarUsuarios = Boolean(currentUser && canInviteUsuarios(currentUser));
  if (btnGerarConvite) {
    btnGerarConvite.disabled = !podeConvidarUsuarios;
    btnGerarConvite.classList.toggle("is-disabled", !podeConvidarUsuarios);
  }
  if (inviteRole) {
    inviteRole.disabled = !podeConvidarUsuarios;
  }

  aplicarPermissoesRdo();

  if (diasLembrete) {
    diasLembrete.textContent = reminderDays;
  }

  if (configDiasLembrete && configDiasLembrete.value !== String(reminderDays)) {
    configDiasLembrete.value = reminderDays;
  }

  renderFeedbackRecipients();
  atualizarFeedbackBadge();
  renderFeedbackInbox();
}

function initAvatarUpload() {
  if (avatarUploadBound) {
    return;
  }
  avatarUploadBound = true;

  document.addEventListener("click", (event) => {
    const changeBtn = event.target.closest("#btnAvatarChange");
    if (changeBtn) {
      const input = document.getElementById("perfilAvatarInput");
      if (input) {
        input.click();
      }
      return;
    }

    const removeBtn = event.target.closest("#btnAvatarRemove");
    if (removeBtn) {
      if (!currentUser) {
        return;
      }
      removeBtn.disabled = true;
      setAvatarError("");
      apiDeleteAvatar()
        .then((data) => {
          if (data && data.user) {
            currentUser = data.user;
          } else if (currentUser) {
            currentUser.avatarUrl = "";
            currentUser.avatarUpdatedAt = "";
          }
          pendingAvatarDataUrl = "";
          applyAvatarToElement(perfilAvatarPreview, "");
          renderAuthUI();
          renderPerfil();
        })
        .catch((error) => {
          const message = error && error.message ? error.message : "Falha ao remover foto.";
          setAvatarError(message);
          removeBtn.disabled = false;
        });
      return;
    }

    const saveBtn = event.target.closest("#btnAvatarSave");
    if (!saveBtn) {
      return;
    }
    if (!pendingAvatarDataUrl) {
      return;
    }
    saveBtn.disabled = true;
    setAvatarError("");
    apiUploadAvatar(pendingAvatarDataUrl)
      .then((data) => {
        if (data && data.user) {
          currentUser = data.user;
        } else if (currentUser && data && data.avatarUrl) {
          currentUser.avatarUrl = data.avatarUrl;
          currentUser.avatarUpdatedAt = data.avatarUpdatedAt || new Date().toISOString();
        }
        const input = document.getElementById("perfilAvatarInput");
        if (input) {
          input.value = "";
        }
        pendingAvatarDataUrl = "";
        renderAuthUI();
        renderPerfil();
      })
      .catch((error) => {
        const message = error && error.message ? error.message : "Falha ao salvar foto.";
        setAvatarError(message);
        saveBtn.disabled = false;
      });
  });

  document.addEventListener("change", (event) => {
    const input = event.target;
    if (!input || input.id !== "perfilAvatarInput") {
      return;
    }
    pendingAvatarDataUrl = "";
    setAvatarError("");
    const saveBtn = document.getElementById("btnAvatarSave");
    if (saveBtn) {
      saveBtn.disabled = true;
    }

    const file = input.files && input.files[0];
    if (!file) {
      applyAvatarToElement(perfilAvatarPreview, getAvatarUrl(currentUser));
      return;
    }
    if (!AVATAR_ALLOWED_TYPES.includes(file.type)) {
      setAvatarError("Formato de imagem não suportado.");
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
      if (saveBtn) {
        saveBtn.disabled = false;
      }
    };
    reader.onerror = () => {
      setAvatarError("Falha ao ler a imagem.");
    };
    reader.readAsDataURL(file);
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
      mostrarMensagemGerencial("Arquivo inválido ou corrompido.", true);
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
  if (!currentUser || !canExportRelatorios(currentUser)) {
    mostrarMensagemGerencial("Sem permissão para gerar relatório.", true);
    return;
  }
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
      entry && entry.detalhes && entry.detalhes.motivo ? entry.detalhes.motivo : "Não informado";
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
  const backlogMotivos = manutencoes
    .filter((item) => item.status === "backlog" && item.backlogMotivo && item.backlogMotivo.motivo)
    .map((item) => item.backlogMotivo.motivo.trim())
    .filter(Boolean);
  const backlogMotivosTotal = backlogMotivos.length;
  const backlogMotivosResumo = backlogMotivosTotal
    ? Object.entries(
        backlogMotivos.reduce((acc, motivo) => {
          acc[motivo] = (acc[motivo] || 0) + 1;
          return acc;
        }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .map(([motivo, totalMotivo]) => `${motivo}: ${totalMotivo}`)
        .join(" | ")
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
      entry && entry.detalhes && entry.detalhes.motivo ? entry.detalhes.motivo : "Não informado";
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
      `Concluídas: ${concluidas.length}\n` +
      `Conclusão: ${taxaConclusao}%\n` +
      `Percentual no prazo: ${taxaPontual}%\n` +
      `Reagendamentos: ${reagendamentosTotal}\n` +
      `Motivos de reagendamento: ${motivosTexto}\n` +
      `Reagendamentos por modelo (top 5):\n${reagPorModeloTexto}\n` +
      `Outros (total): ${outrosTotal}\n` +
      `Observações de Outros (top 10):\n${outrosTexto}\n` +
      `Backlog (entradas): ${backlogEntradas}\n` +
      `Backlog (manutenções afetadas): ${backlogUnicos}\n` +
      `Backlog médio (dias): ${backlogMedio}\n` +
      `Top 5 atrasadas:\n${backlogTopTexto}\n` +
      `Motivos não executada (backlog): ${backlogMotivosTotal}\n` +
      `Detalhes motivos backlog: ${backlogMotivosResumo}\n` +
      `Tempo médio entre programada e execução (dias): ${tempoMedioExecucao}\n` +
      `Tempo médio de execução (HH:MM): ${mediaDuracaoExecucao}\n` +
      `Tempo médio de atraso (dias): ${mediaAtrasoExec}\n` +
        `Execuções: ${execPontuais} no prazo, ${execAdiantadas} adiantadas, ${execAtrasadas} atrasadas\n` +
        `Execuções com ressalva: ${execComRessalva}\n` +
        `Execuções não executadas: ${execNaoExecutada}\n` +
        `Execuções iniciadas: ${execucoesIniciadas}\n` +
        `Inícios cancelados: ${execucoesCanceladas}\n` +
        `Motivos de cancelamento: ${cancelMotivosTexto}\n` +
        `Compliance documental: ${complianceDocs}/${concluidas.length} (${compliancePercent}%)\n` +
        `Evidências médias por manutenção: ${evidenciasMedia}`;
  }
  mostrarMensagemGerencial("Relatório atualizado.");
}

function renderTudo() {
  atualizarResumo();
  renderLembretes();
  renderProgramacao();
  renderListaStatus("backlog", listaBacklog, listaBacklogVazia, {
    allowedActions: ["reschedule", "history", "backlog_reason"],
  });
  renderListaStatus("concluida", listaConcluidas, listaConcluidasVazia, {
    limit: 6,
    allowedActions: ["history"],
  });
  renderExecucao();
  renderKPIs();
  renderDesempenho();
  renderGrafico();
  renderAuditoria();
  renderRelatorios();
  renderPerformanceProjetos();
  renderPerformancePessoas();
  renderFeedbackList();
  renderFeedbackInbox();
  renderRdoList();
  renderModelos();
  renderPmpModule();
  renderSolicitacoes();
  renderUsuarios();
  renderProjectPanel();
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
              resumo: "Manutenção movida para backlog por não conclusão até a data programada.",
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
  if (manutencaoProjeto && manutencaoProjeto.value && manutencaoProjeto.value !== activeProjectId) {
    await setActiveProjectId(manutencaoProjeto.value);
    mostrarMensagemManutencao("Projeto ativo alterado. Revise os dados e clique em salvar novamente.", true);
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

  const local =
    (subestacaoManutencao ? subestacaoManutencao.value.trim() : "") ||
    getSubestacoesBase()[0] ||
    "";
  const equipamentoId = equipamentoManutencao ? equipamentoManutencao.value.trim() : "";
  const data = dataManutencao
    ? dataManutencao.value || formatDateISO(new Date())
    : "";
  if (dataManutencao && !dataManutencao.value) {
    dataManutencao.value = data;
  }
  if (obsManutencaoEditor) {
    syncObsEditor(true);
  }
  const observacaoHtmlRaw = obsManutencaoHtml ? obsManutencaoHtml.value.trim() : "";
  const observacaoHtml = observacaoHtmlRaw ? sanitizeRichText(observacaoHtmlRaw) : "";
  const observacao = observacaoHtml
    ? stripHtml(observacaoHtml).trim()
    : obsManutencao
      ? obsManutencao.value.trim()
      : "";
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

  if (!activeProjectId) {
    mostrarMensagemManutencao("Selecione um projeto ativo antes de criar.", true);
    return;
  }
  if (!titulo || !local || !data || !categoria || !prioridade) {
    mostrarMensagemManutencao(
      "Preencha tipo, subestação, início da execução, categoria e prioridade.",
      true
    );
    return;
  }
  if (!equipamentoId) {
    mostrarMensagemManutencao("Informe o equipamento da manutenção.", true);
    return;
  }
  if (!observacao) {
    mostrarMensagemManutencao("Descreva a demanda técnica.", true);
    return;
  }
  if (!osReferencia) {
    mostrarMensagemManutencao("Informe a OS / referência.", true);
    return;
  }
  setFieldError(participantesManutencaoErro, "");
  if (participantes.length < 2) {
    setFieldError(participantesManutencaoErro, "Informe ao menos 2 participantes.");
    mostrarMensagemManutencao("Informe ao menos 2 participantes.", true);
    return;
  }

  const documentos = {};
  for (const chave of DOC_KEYS) {
    const input = novaDocInputs.find((itemInput) => itemInput.dataset.novaDocInput === chave);
    const file = input && input.files && input.files[0] ? input.files[0] : null;
    if (file) {
      try {
        documentos[chave] = await uploadLiberacaoDoc(file, chave);
      } catch (error) {
        mostrarMensagemManutencao(
          error && error.message ? error.message : "Não foi possível enviar o documento.",
          true
        );
        return;
      }
    }
  }
  if (!documentos.apr || !documentos.os || !documentos.pte) {
    mostrarMensagemManutencao("Anexe APR, OS e PTE para iniciar.", true);
    return;
  }
  if (critico && !documentos.pt) {
    mostrarMensagemManutencao("PT obrigatória para trabalho crítico.", true);
    return;
  }

  const agora = new Date();
  const agoraIso = toIsoUtc(agora);
  const usuarioLabel = getUserLabel(currentUser.id);
  const ultimaAcao = `Execução iniciada em ${formatDateTime(agora)} por ${usuarioLabel}`;
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
    projectId: activeProjectId,
    equipamentoId,
    observacao,
    observacaoHtml,
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
    resumo: "Manutenção criada e iniciada.",
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
    resumo: "Execução iniciada.",
  });
  renderTudo();

  if (tituloManutencao) {
    tituloManutencao.value = "";
  }
  if (tipoManutencao) {
    tipoManutencao.value = templates.length === 0 ? CUSTOM_TIPO_OPTION : "";
    atualizarTipoSelecionado();
  }
  const baseSubestacoes = getSubestacoesBase();
  if (subestacaoManutencao && baseSubestacoes.length > 0) {
    subestacaoManutencao.value = baseSubestacoes[0];
  }
  if (equipamentoManutencao) {
    equipamentoManutencao.value = "";
  }
  if (futuraManutencao) {
    futuraManutencao.checked = false;
  }
  if (dataManutencao) {
    atualizarDataManutencaoState();
  }
  if (obsManutencao) {
    obsManutencao.value = "";
  }
  if (obsManutencaoHtml) {
    obsManutencaoHtml.value = "";
  }
  if (obsManutencaoEditor) {
    obsManutencaoEditor.innerHTML = "";
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
  mostrarMensagemManutencao("Execução iniciada.");
}

let manutencaoEmConclusao = null;
let manutencaoEmRegistro = null;

function editarManutencao(index) {
  if (!requirePermission("edit")) {
    return;
  }
  const item = manutencoes[index];
  const novoTitulo = window.prompt("Novo título:", item.titulo);
  if (novoTitulo === null) {
    return;
  }
  const tituloLimpo = novoTitulo.trim();
  if (!tituloLimpo) {
    mostrarMensagemManutencao("Título inválido.", true);
    return;
  }
  const novoLocal = window.prompt("Novo local:", item.local);
  if (novoLocal === null) {
    return;
  }
  const localLimpo = novoLocal.trim();
  if (!localLimpo) {
    mostrarMensagemManutencao("Local inválido.", true);
    return;
  }
  const novaObs = window.prompt("Observações:", item.observacao || "");
  if (novaObs === null) {
    return;
  }

  const atualizado = {
    ...item,
    titulo: tituloLimpo,
    local: localLimpo,
    observacao: novaObs.trim(),
    observacaoHtml: "",
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
  };

  manutencoes[index] = atualizado;
  const resultado = normalizarManutencoes(manutencoes);
  manutencoes = resultado.normalizadas;
  salvarManutencoes(manutencoes);
  logAction("edit", atualizado, { resumo: "Edição manual" });
  renderTudo();
  mostrarMensagemManutencao("Manutenção atualizada.");
}

function registrarObservacao(index) {
  if (!requirePermission("edit")) {
    return;
  }
  const item = manutencoes[index];
  const novaObs = window.prompt("Observação técnica:", item.observacao || "");
  if (novaObs === null) {
    return;
  }
  const obsLimpa = novaObs.trim();
  if (!obsLimpa) {
    mostrarMensagemManutencao("Observação vazia.", true);
    return;
  }

  const atualizado = {
    ...item,
    observacao: obsLimpa,
    observacaoHtml: "",
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser.id,
  };

  manutencoes[index] = atualizado;
  const resultado = normalizarManutencoes(manutencoes);
  manutencoes = resultado.normalizadas;
  salvarManutencoes(manutencoes);
  logAction("note", atualizado, { resumo: "Observação registrada" });
  renderTudo();
  mostrarMensagemManutencao("Observação registrada.");
}

function registrarMotivoBacklog(index) {
  if (!requirePermission("edit")) {
    return;
  }
  const item = manutencoes[index];
  if (!item || item.status !== "backlog") {
    mostrarMensagemManutencao("Somente itens em backlog aceitam motivo.", true);
    return;
  }
  abrirBacklogMotivo(item);
}

function abrirBacklogMotivo(item) {
  if (!modalBacklogMotivo || !formBacklogMotivo) {
    return;
  }
  manutencaoEmBacklogMotivo = item.id;
  mostrarMensagemBacklogMotivo("");
  if (backlogMotivoId) {
    backlogMotivoId.value = item.id;
  }
  if (backlogMotivoSelect) {
    backlogMotivoSelect.value =
      item.backlogMotivo && item.backlogMotivo.motivo ? item.backlogMotivo.motivo : "";
  }
  if (backlogMotivoObs) {
    backlogMotivoObs.value =
      item.backlogMotivo && item.backlogMotivo.observacao ? item.backlogMotivo.observacao : "";
  }
  modalBacklogMotivo.hidden = false;
}

function fecharBacklogMotivo() {
  if (!modalBacklogMotivo) {
    return;
  }
  modalBacklogMotivo.hidden = true;
  manutencaoEmBacklogMotivo = null;
  mostrarMensagemBacklogMotivo("");
}

function salvarBacklogMotivo(event) {
  event.preventDefault();
  if (!requirePermission("edit")) {
    return;
  }
  if (!manutencaoEmBacklogMotivo || !backlogMotivoSelect) {
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmBacklogMotivo);
  if (index < 0) {
    mostrarMensagemBacklogMotivo("Manutenção não encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status !== "backlog") {
    mostrarMensagemBacklogMotivo("Somente itens em backlog aceitam motivo.", true);
    return;
  }
  const motivo = backlogMotivoSelect.value.trim();
  if (!motivo) {
    mostrarMensagemBacklogMotivo("Selecione o motivo.", true);
    return;
  }
  const observacao = backlogMotivoObs ? backlogMotivoObs.value.trim() : "";
  if (motivo === "Outros" && !observacao) {
    mostrarMensagemBacklogMotivo("Informe a observação para o motivo Outros.", true);
    return;
  }

  const registro = {
    motivo,
    observacao,
    registradoEm: toIsoUtc(new Date()),
    registradoPor: currentUser ? currentUser.id : SYSTEM_USER_ID,
  };
  const atualizado = {
    ...item,
    backlogMotivo: registro,
    updatedAt: toIsoUtc(new Date()),
    updatedBy: currentUser ? currentUser.id : SYSTEM_USER_ID,
  };

  manutencoes[index] = atualizado;
  const resultado = normalizarManutencoes(manutencoes);
  manutencoes = resultado.normalizadas;
  salvarManutencoes(manutencoes);
  logAction("backlog_reason", atualizado, {
    motivo,
    observacao,
    resumo: "Motivo registrado.",
  });
  renderTudo();
  fecharBacklogMotivo();
  mostrarMensagemManutencao("Motivo registrado.");
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
    aviso.textContent = "Catálogo de permissões indisponível.";
    drawerPermissions.append(aviso);
    return;
  }
  const roleValue = drawerRole ? drawerRole.value : "";
  const resolvedRole =
    roleValue ||
    user.rbacRole ||
    (user.role === "admin" ? "pcm" : user.role === "supervisor" ? "supervisor_om" : "");
  const isFullAccess = FULL_ACCESS_RBAC.has(String(resolvedRole || "").toLowerCase());
  const permissaoEdicao = Boolean(currentUser && canEditProfile(currentUser, user));
  const basePermissions = overridePermissions || user.permissions || {};

  adminPermissionCatalog.forEach((grupo) => {
    const bloco = document.createElement("div");
    bloco.className = "perm-group";
    const titulo = document.createElement("strong");
    titulo.textContent = grupo.label || "Módulo";
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
    mostrarMensagemGerencial("Sem permissão para visualizar usuários.", true);
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
    renderProjectSelectOptions(drawerProjeto, user.projectId || "");
  }
  if (drawerActive) {
    drawerActive.checked = user.active !== false;
  }
  const podeEditarPerfil = Boolean(currentUser && canEditProfile(currentUser, user));
  const podeDesativar = Boolean(currentUser && canDesativarUsuarios(currentUser));
  const podeSalvar = podeEditarPerfil || podeDesativar;

  [drawerNome, drawerCargo, drawerRole, drawerProjeto].forEach((campo) => {
    if (campo) {
      campo.disabled = !podeEditarPerfil;
    }
  });
  if (drawerActive) {
    drawerActive.disabled = !podeDesativar;
  }
  if (drawerSubtitle) {
    const perfil = getRoleLabel(user);
    drawerSubtitle.textContent = `Matrícula: ${user.matricula || "-"} | Perfil: ${perfil}`;
  }
  if (btnSalvarUserDrawer) {
    btnSalvarUserDrawer.disabled = !podeSalvar;
  }
  renderDrawerPermissions(user);
  if (!podeSalvar) {
    mostrarMensagemDrawer("Sem permissão para alterar este perfil.", true);
  } else if (!podeEditarPerfil && podeDesativar) {
    mostrarMensagemDrawer("Edição bloqueada. Apenas ativação/desativação disponível.", true);
  } else {
    mostrarMensagemDrawer("");
  }
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
  const userId = drawerUserId ? drawerUserId.value : "";
  const user = users.find((item) => item.id === userId);
  if (!user) {
    mostrarMensagemDrawer("Usuário não encontrado.", true);
    return;
  }
  const podeEditarPerfil = Boolean(currentUser && canEditProfile(currentUser, user));
  const podeDesativar = Boolean(currentUser && canDesativarUsuarios(currentUser));
  if (!podeEditarPerfil && !podeDesativar) {
    mostrarMensagemDrawer("Sem permissão para salvar alterações.", true);
    return;
  }
  const payload = {};
  if (podeEditarPerfil) {
    const nome = drawerNome ? drawerNome.value.trim() : "";
    if (!nome) {
      mostrarMensagemDrawer("Informe o nome do colaborador.", true);
      return;
    }
    const cargo = drawerCargo ? drawerCargo.value.trim() : "";
    const rbacRole = drawerRole ? drawerRole.value : user.rbacRole;
    const projetoId = drawerProjeto ? drawerProjeto.value.trim() : "";
    const permissions = collectDrawerPermissions();
    payload.name = nome;
    payload.cargo = cargo;
    payload.rbacRole = rbacRole;
    payload.projectId = projetoId;
    payload.permissions = permissions;
  }
  if (podeDesativar) {
    payload.active = drawerActive ? drawerActive.checked : true;
  }
  if (!Object.keys(payload).length) {
    mostrarMensagemDrawer("Nenhuma alteração permitida.", true);
    return;
  }
  try {
    const data = await apiAdminUpdateUser(userId, payload);
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
    mostrarMensagemDrawer("Não foi possível salvar. Tente novamente.", true);
  }
}
function executarManutencao(index) {
  if (!requirePermission("complete")) {
    return;
  }
  const item = manutencoes[index];
  if (item.status === "backlog") {
    mostrarMensagemManutencao("Manutenção em backlog. Registre o motivo.", true);
    return;
  }
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
    mostrarMensagemManutencao("Manutenção concluída. Apenas leitura.", true);
    return;
  }
  if (item.status === "backlog") {
    mostrarMensagemManutencao("Manutenção em backlog. Registre o motivo.", true);
    return;
  }
  if (item.status === "em_execucao") {
    mostrarMensagemManutencao("Manutenção já está em execução.", true);
    return;
  }
  if (item.status === "encerramento") {
    mostrarMensagemManutencao("Encerramento em andamento. Apenas leitura.", true);
    return;
  }
  if (!isLiberacaoOk(item)) {
    mostrarMensagemManutencao("Liberação incompleta. Preencha os requisitos.", true);
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
    mostrarMensagemInicioExecucao("Selecione uma manutenção.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === inicioExecucaoId.value);
  if (index < 0) {
    mostrarMensagemInicioExecucao("Manutenção não encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status === "concluida") {
    mostrarMensagemInicioExecucao("Manutenção concluída. Apenas leitura.", true);
    return;
  }
  if (item.status === "em_execucao") {
    mostrarMensagemInicioExecucao("Manutenção já está em execução.", true);
    return;
  }
  if (item.status === "encerramento") {
    mostrarMensagemInicioExecucao("Encerramento em andamento. Apenas leitura.", true);
    return;
  }
  if (!isLiberacaoOk(item)) {
    mostrarMensagemInicioExecucao("Liberação incompleta. Preencha os requisitos.", true);
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
    resumo: "Execução iniciada.",
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
    mostrarMensagemManutencao("Inicie a execução antes de registrar.", true);
    return;
  }
  const inicio = parseTimestamp(item.executionStartedAt);
  if (!inicio) {
    mostrarMensagemManutencao("Início da execução não encontrado.", true);
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
    mostrarMensagemRegistroExecucao("Selecione uma manutenção.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmRegistro);
  if (index < 0) {
    mostrarMensagemRegistroExecucao("Manutenção não encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status !== "em_execucao") {
    mostrarMensagemRegistroExecucao("A manutenção precisa estar em execução.", true);
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
    mostrarMensagemCancelarExecucao("Selecione uma manutenção.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmRegistro);
  if (index < 0) {
    mostrarMensagemCancelarExecucao("Manutenção não encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status !== "em_execucao") {
    mostrarMensagemCancelarExecucao("A manutenção precisa estar em execução.", true);
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
  mostrarMensagemManutencao("Execução cancelada.");
}

function salvarRegistroExecucao(event) {
  event.preventDefault();
  if (!requirePermission("complete")) {
    return;
  }
  if (!manutencaoEmRegistro) {
    mostrarMensagemRegistroExecucao("Selecione uma manutenção.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmRegistro);
  if (index < 0) {
    mostrarMensagemRegistroExecucao("Manutenção não encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (item.status !== "em_execucao" && item.status !== "encerramento") {
    mostrarMensagemRegistroExecucao("Inicie a execução antes de registrar.", true);
    return;
  }
  if (!item.executionStartedAt) {
    mostrarMensagemRegistroExecucao("Início da execução não encontrado.", true);
    return;
  }
  const executadoPor = registroExecutadaPor ? registroExecutadaPor.value : "";
  if (!executadoPor) {
    mostrarMensagemRegistroExecucao("Selecione quem executou.", true);
    return;
  }
  const resultado = registroResultado ? registroResultado.value : "";
  if (!resultado) {
    mostrarMensagemRegistroExecucao("Informe o resultado da execução.", true);
    return;
  }
  const comentario = registroComentario ? registroComentario.value.trim() : "";
  if (!comentario) {
    mostrarMensagemRegistroExecucao("Descrição técnica obrigatória.", true);
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
    resumo: "Registro de execução salvo.",
  });
  renderTudo();
  fecharRegistroExecucao();
  mostrarMensagemManutencao("Registro de execução salvo.");
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
    novaDocPt.style.display = critico ? "" : "none";
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
  atualizarDataManutencaoState();
}

function atualizarDataManutencaoState() {
  if (!dataManutencao) {
    return;
  }
  const permitirEdicao = futuraManutencao && futuraManutencao.checked;
  dataManutencao.readOnly = !permitirEdicao;
  if (!permitirEdicao || !dataManutencao.value) {
    dataManutencao.value = formatDateISO(new Date());
  }
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
    { label: "Trabalho crítico definido", ok: Boolean(criticoSelecionado) },
    { label: "OS / referência", ok: Boolean(osNumero) },
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
        "Para trabalho crítico, informe ao menos 2 participantes."
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
    liberacaoDocPt.style.display = critico ? "" : "none";
  }
  const ptInput = liberacaoDocInputs.find(
    (input) => input && input.dataset.docInput === "pt"
  );
  if (ptInput) {
    ptInput.required = critico;
    ptInput.disabled = !critico;
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
    mostrarMensagemManutencao("Manutenção concluída. Apenas leitura.", true);
    return;
  }
  if (item.status === "em_execucao" || item.status === "encerramento") {
    mostrarMensagemManutencao("Execução em andamento. Não é possível liberar.", true);
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
    const criticoValor = liberacao.critico;
    if (criticoValor === undefined || criticoValor === null || criticoValor === "") {
      liberacaoCritico.value = "";
    } else {
      liberacaoCritico.value = isCriticoValor(criticoValor) ? "sim" : "nao";
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
    overrideInfo.textContent = `Liberação antes da data prevista (${dataLabel}).`;
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
    resumo: overrideJustificativa ? "Liberação antecipada registrada." : "Liberação registrada.",
  });
  renderTudo();
  fecharLiberacao();
  mostrarMensagemManutencao("Liberação registrada.");
}

async function confirmarOverrideLiberacao(event) {
  event.preventDefault();
  if (!pendingLiberacaoOverride) {
    mostrarMensagemOverride("Nenhuma liberação pendente.", true);
    return;
  }
  const motivo = overrideMotivo ? overrideMotivo.value.trim() : "";
  if (!motivo) {
    mostrarMensagemOverride("Justificativa obrigatória.", true);
    return;
  }
  const index = manutencoes.findIndex(
    (registro) => registro.id === pendingLiberacaoOverride.id
  );
  if (index < 0) {
    mostrarMensagemOverride("Manutenção não encontrada.", true);
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
    mostrarMensagemOverride(error.message || "Não foi possível liberar.", true);
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
    mostrarMensagemLiberacao("Selecione uma manutenção.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmLiberacao);
  if (index < 0) {
    mostrarMensagemLiberacao("Manutenção não encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  const osNumero = liberacaoOs ? liberacaoOs.value.trim() : "";
  if (!osNumero) {
    mostrarMensagemLiberacao("Informe o Nº OS / referência.", true);
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
    mostrarMensagemLiberacao("Informe se o trabalho é crítico.", true);
    return;
  }
  const critico = criticoValor === "sim";
  if (critico && participantes.length < 2) {
    setFieldError(
      liberacaoParticipantesErro,
      "Para trabalho crítico, informe ao menos 2 participantes."
    );
    mostrarMensagemLiberacao(
      "Para trabalho crítico, informe ao menos 2 participantes.",
      true
    );
    return;
  }
  const documentos = { ...liberacaoDocsBase };
  for (const chave of DOC_KEYS) {
    const input = liberacaoDocInputs.find((itemInput) => itemInput.dataset.docInput === chave);
    if (input && input.files && input.files[0]) {
      try {
        documentos[chave] = await uploadLiberacaoDoc(input.files[0], chave);
      } catch (error) {
        mostrarMensagemLiberacao(
          error && error.message ? error.message : "Não foi possível enviar o documento.",
          true
        );
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
    mostrarMensagemLiberacao("PT obrigatória para trabalho crítico.", true);
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
    mostrarMensagemLiberacao(error.message || "Não foi possível liberar.", true);
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
  if (item.status === "backlog") {
    mostrarMensagemManutencao("Manutenção em backlog. Não é possível liberar.", true);
    return;
  }
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
    mostrarMensagemManutencao("A manutenção precisa estar em execução.", true);
    return;
  }
  if (item.registroExecucao) {
    mostrarMensagemManutencao("Registro já iniciado. Não é possível cancelar.", true);
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
    mostrarMensagemCancelarInicio("Selecione uma manutenção.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmCancelamento);
  if (index < 0) {
    mostrarMensagemCancelarInicio("Manutenção não encontrada.", true);
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
    mostrarMensagemCancelarInicio("Informe a observação para o motivo Outros.", true);
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
    resumo: "Início cancelado.",
  });
  renderTudo();
  fecharCancelarInicio();
  mostrarMensagemManutencao("Início cancelado.");
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
  if (isDailySubstationInspection(item)) {
    mostrarMensagemManutencao(
      "Inspeção diária de subestação não pode ser reagendada.",
      true
    );
    return;
  }
  if (item.status === "em_execucao" || item.status === "encerramento") {
    mostrarMensagemManutencao("Não é possível reagendar durante a execução.", true);
    return;
  }
  if (item.status === "concluida") {
    mostrarMensagemManutencao("Manutenção concluída. Apenas leitura.", true);
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
    mostrarMensagemReagendar("Manutenção não encontrada.", true);
    return;
  }
  const item = manutencoes[index];
  if (isDailySubstationInspection(item)) {
    mostrarMensagemReagendar(
      "Inspeção diária de subestação não pode ser reagendada.",
      true
    );
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
    mostrarMensagemReagendar("Data inválida. Use AAAA-MM-DD.", true);
    return;
  }
  if (item.status === "em_execucao" || item.status === "encerramento") {
    mostrarMensagemReagendar("Não é possível reagendar durante a execução.", true);
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
      "A nova data está no passado e a manutenção ficará em backlog. Deseja continuar?"
    );
    if (!confirmar) {
      return;
    }
  }
  const observacao = reagendarObs ? reagendarObs.value.trim() : "";
  if (motivo === "Outros" && !observacao) {
    mostrarMensagemReagendar("Informe a observação para o motivo Outros.", true);
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
  mostrarMensagemManutencao("Manutenção reagendada.");
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
        linhas.push(`Crítico: ${detalhes.critico ? "Sim" : "Não"}`);
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
      linhas.push(`Referência: ${detalhes.referencia}`);
    }
    if (detalhes.observacaoExecucao) {
      linhas.push(`Obs. execução: ${detalhes.observacaoExecucao}`);
    }
    if (detalhes.evidenciasCount !== undefined) {
      linhas.push(`Evidências: ${detalhes.evidenciasCount}`);
    }
    if (detalhes.inicioExecucao) {
      linhas.push(`Início execução: ${formatHistoricoData(detalhes.inicioExecucao)}`);
    }
    if (detalhes.fimExecucao) {
      linhas.push(`Fim execução: ${formatHistoricoData(detalhes.fimExecucao)}`);
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
        detalhes.critico === undefined ? "" : detalhes.critico ? "Sim" : "Não",
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
    <h1>Histórico da manutenção</h1>
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
          linhas.push(`Crítico: ${entry.detalhes.critico ? "Sim" : "Não"}`);
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
        linhas.push(`Referência: ${entry.detalhes.referencia}`);
      }
      if (entry.detalhes && entry.detalhes.observacaoExecucao) {
        linhas.push(`Obs. execução: ${entry.detalhes.observacaoExecucao}`);
      }
      if (entry.detalhes && entry.detalhes.evidenciasCount !== undefined) {
        linhas.push(`Evidências: ${entry.detalhes.evidenciasCount}`);
      }
      if (entry.detalhes && entry.detalhes.inicioExecucao) {
        linhas.push(`Início execução: ${formatHistoricoData(entry.detalhes.inicioExecucao)}`);
      }
      if (entry.detalhes && entry.detalhes.fimExecucao) {
        linhas.push(`Fim execução: ${formatHistoricoData(entry.detalhes.fimExecucao)}`);
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
        <title>Histórico ${item.titulo}</title>
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
    mostrarMensagemManutencao("Inicie a execução antes de concluir.", true);
    return;
  }
  if (!item.executionStartedAt) {
    mostrarMensagemManutencao("Início da execução não encontrado.", true);
    return;
  }
  const registro = item.registroExecucao;
  if (
    !registro ||
    !registro.executadoPor ||
    !registro.resultado ||
    !registro.comentario
  ) {
    mostrarMensagemManutencao("Registre a execução antes de concluir.", true);
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
    mostrarMensagemConclusao("Selecione uma manutenção.", true);
    return;
  }
  const index = manutencoes.findIndex((item) => item.id === manutencaoEmConclusao);
  if (index < 0) {
    mostrarMensagemConclusao("Manutenção não encontrada.", true);
    return;
  }

  const item = manutencoes[index];
  if (item.status !== "em_execucao" && item.status !== "encerramento") {
    mostrarMensagemConclusao("Inicie a execução antes de concluir.", true);
    return;
  }
  const registro = item.registroExecucao;
  if (
    !registro ||
    !registro.executadoPor ||
    !registro.resultado ||
    !registro.comentario
  ) {
    mostrarMensagemConclusao("Registre a execução antes de concluir.", true);
    return;
  }
  const liberacao = getLiberacao(item);
  if (!isLiberacaoOk(item)) {
    mostrarMensagemConclusao("Documentação de liberação pendente.", true);
    return;
  }
  const executadoPor = registro.executadoPor;
  const resultado = registro.resultado;
  const comentario = registro.comentario;
  const observacaoExecucao = registro.observacaoExecucao || "";
  const referenciaInformada = conclusaoReferencia ? conclusaoReferencia.value.trim() : "";
  const referencia = referenciaInformada || (liberacao ? liberacao.osNumero || "" : "");
  if (!referencia) {
    mostrarMensagemConclusao("Informe o Nº OS / referência.", true);
    return;
  }
  const inicioDate = parseTimestamp(item.executionStartedAt);
  if (!inicioDate) {
    mostrarMensagemConclusao("Início da execução não encontrado.", true);
    return;
  }
  const fimValor = conclusaoFim ? conclusaoFim.value : "";
  const fimDate = parseDateTimeInput(fimValor);
  if (!fimDate) {
    mostrarMensagemConclusao("Informe o horário de fim da execução.", true);
    return;
  }
  if (fimDate < inicioDate) {
    mostrarMensagemConclusao("Fim deve ser maior ou igual ao início.", true);
    return;
  }
  const duracaoHoras = (fimDate.getTime() - inicioDate.getTime()) / 3600000;
  if (duracaoHoras > MAX_EXECUCAO_HORAS) {
    const confirmar = window.confirm(
      `Execução com ${Math.round(duracaoHoras)}h. Deseja continuar?`
    );
    if (!confirmar) {
      return;
    }
  }
  const arquivos = getEvidenciaFiles();
  const arquivosValidos = arquivos.filter(Boolean);
  if (arquivosValidos.length < MIN_EVIDENCIAS) {
    mostrarMensagemConclusao(`Adicione as ${MIN_EVIDENCIAS} fotos obrigatórias.`, true);
    return;
  }
  const arquivosInvalidos = arquivosValidos.filter(
    (file) => !file.type || !file.type.startsWith("image/")
  );
  if (arquivosInvalidos.length) {
    mostrarMensagemConclusao("Apenas fotos são permitidas.", true);
    return;
  }
  mostrarMensagemConclusao("Processando evidências...");
  const evidencias = await lerEvidencias(arquivosValidos);
  if (evidencias.length < MIN_EVIDENCIAS) {
    mostrarMensagemConclusao("Não foi possível ler as evidências.", true);
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
  mostrarMensagemManutencao("Manutenção concluída.");
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
      vazio.textContent = "Sem evidências.";
      relatorioEvidencias.append(vazio);
    } else {
      evidencias.forEach((evidencia) => {
        if (evidencia.type && evidencia.type.startsWith("image/")) {
          const img = document.createElement("img");
          img.src = evidencia.dataUrl || evidencia.url || "";
          img.alt = evidencia.nome || "Evidência";
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
  if (!canDeleteMaintenance(currentUser)) {
    mostrarMensagemManutencao("Apenas PCM pode excluir manutenções.", true);
    return;
  }
  const item = manutencoes[index];
  const confirmar = window.confirm("Excluir esta manutenção?");
  if (!confirmar) {
    return;
  }
  apiMaintenanceDelete(item.id, activeProjectId)
    .then(() => {
      manutencoes = manutencoes.filter((entry) => entry && entry.id !== item.id);
      salvarManutencoes(manutencoes);
      logAction("remove", item, { resumo: "Excluída" });
      renderTudo();
      mostrarMensagemManutencao("Manutenção excluída.");
    })
    .catch((error) => {
      const message = error && error.message ? error.message : "Falha ao excluir manutenção.";
      mostrarMensagemManutencao(message, true);
    });
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
  if (acao === "backlog_reason") {
    registrarMotivoBacklog(index);
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
  if (crumbs) {
    renderBreadcrumb();
  }
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

async function apiVerifyEmail(token) {
  const safeToken = encodeURIComponent(String(token || ""));
  return apiRequest(`/api/auth/verify?token=${safeToken}`, { method: "GET" });
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

async function apiAdminAutomations() {
  return apiRequest("/api/admin/automations");
}

async function apiUpdateAutomation(automationId, payload) {
  const safeId = encodeURIComponent(String(automationId || ""));
  return apiRequest(`/api/admin/automations/${safeId}`, {
    method: "PATCH",
    body: JSON.stringify(payload || {}),
  });
}

async function apiAdminFiles(params = {}) {
  const query = new URLSearchParams(params);
  const suffix = query.toString();
  return apiRequest(`/api/admin/files${suffix ? `?${suffix}` : ""}`);
}

async function apiUploadFile(formData) {
  const response = await fetch(`${API_BASE}/api/admin/files`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data && data.message ? data.message : "Falha no upload.";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function apiUploadLiberacaoDoc(formData) {
  const response = await fetch(`${API_BASE}/api/maintenance/liberacao-doc`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data && data.message ? data.message : "Falha no envio do documento.";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function apiDeleteFile(fileId) {
  const safeId = encodeURIComponent(String(fileId || ""));
  return apiRequest(`/api/admin/files/${safeId}`, {
    method: "DELETE",
    body: "{}",
  });
}

async function apiAdminHealth() {
  return apiRequest("/api/admin/health");
}

async function apiAdminLogs(params = {}) {
  const query = new URLSearchParams(params);
  const suffix = query.toString();
  return apiRequest(`/api/admin/logs${suffix ? `?${suffix}` : ""}`);
}

async function apiRunHealthTask(taskId) {
  const safeId = encodeURIComponent(String(taskId || ""));
  return apiRequest(`/api/admin/health/tasks/${safeId}/run`, {
    method: "POST",
    body: "{}",
  });
}

async function apiAdminPermissions() {
  return apiRequest("/api/admin/permissions");
}

async function apiAdminPermissoes() {
  return apiRequest("/api/admin/permissoes");
}

async function apiSalvarPermissoes(payload) {
  return apiRequest("/api/admin/permissoes", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

async function apiAdminUpdateUser(userId, payload) {
  return apiRequest(`/api/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

async function apiUpdateProfile(payload) {
  return apiRequest("/api/profile", {
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

async function apiDeleteAvatar() {
  return apiRequest("/api/profile/avatar", {
    method: "DELETE",
    body: "{}",
  });
}

async function apiMaintenanceSync(items) {
  return apiRequest("/api/maintenance/sync", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

async function apiMaintenanceList(projectId) {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  return apiRequest(`/api/maintenance${query}`);
}

async function apiMaintenanceDelete(maintenanceId, projectId) {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  return apiRequest(`/api/maintenance/${encodeURIComponent(maintenanceId)}${query}`, {
    method: "DELETE",
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

async function apiProjetosList() {
  return apiRequest("/api/projetos");
}

async function apiProjetosCreate(payload) {
  return apiRequest("/api/projetos", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

async function apiProjetosUpdate(projectId, payload) {
  return apiRequest(`/api/projetos/${encodeURIComponent(projectId)}`, {
    method: "PUT",
    body: JSON.stringify(payload || {}),
  });
}

async function apiProjetosDelete(projectId) {
  return apiRequest(`/api/projetos/${encodeURIComponent(projectId)}`, {
    method: "DELETE",
  });
}

async function apiProjetosEquipeList(projectId) {
  return apiRequest(`/api/projetos/${encodeURIComponent(projectId)}/equipe`);
}

async function apiProjetosEquipeAdd(projectId, payload) {
  return apiRequest(`/api/projetos/${encodeURIComponent(projectId)}/equipe`, {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

async function apiProjetosEquipeRemove(projectId, userId) {
  return apiRequest(
    `/api/projetos/${encodeURIComponent(projectId)}/equipe/${encodeURIComponent(userId)}`,
    { method: "DELETE" }
  );
}

async function apiProjetosEquipamentosList(projectId) {
  return apiRequest(`/api/projetos/${encodeURIComponent(projectId)}/equipamentos`);
}

async function apiProjetosEquipamentosCreate(projectId, payload) {
  return apiRequest(`/api/projetos/${encodeURIComponent(projectId)}/equipamentos`, {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

async function apiEquipamentosUpdate(equipamentoId, payload) {
  return apiRequest(`/api/equipamentos/${encodeURIComponent(equipamentoId)}`, {
    method: "PUT",
    body: JSON.stringify(payload || {}),
  });
}

async function apiEquipamentosDelete(equipamentoId) {
  return apiRequest(`/api/equipamentos/${encodeURIComponent(equipamentoId)}`, {
    method: "DELETE",
  });
}

async function apiProjetosGetActive() {
  return apiRequest("/api/projetos/active");
}

async function apiProjetosSetActive(projectId) {
  return apiRequest("/api/projetos/active", {
    method: "POST",
    body: JSON.stringify({ projectId }),
  });
}

async function apiPmpActivitiesList(params = {}) {
  const search = new URLSearchParams();
  if (params.projectId) {
    search.set("projectId", params.projectId);
  }
  if (params.year) {
    search.set("year", params.year);
  }
  const suffix = search.toString();
  return apiRequest(`/api/pmp/activities${suffix ? `?${suffix}` : ""}`);
}

async function apiPmpActivitiesCreate(payload) {
  return apiRequest("/api/pmp/activities", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

async function apiPmpActivitiesUpdate(activityId, payload) {
  return apiRequest(`/api/pmp/activities/${encodeURIComponent(activityId)}`, {
    method: "PUT",
    body: JSON.stringify(payload || {}),
  });
}

async function apiPmpActivitiesDelete(activityId) {
  return apiRequest(`/api/pmp/activities/${encodeURIComponent(activityId)}`, {
    method: "DELETE",
  });
}

async function apiPmpExecutionsList(params = {}) {
  const search = new URLSearchParams();
  if (params.projectId) {
    search.set("projectId", params.projectId);
  }
  if (params.year) {
    search.set("year", params.year);
  }
  const suffix = search.toString();
  return apiRequest(`/api/pmp/executions${suffix ? `?${suffix}` : ""}`);
}

async function apiPmpExecutionSave(payload) {
  return apiRequest("/api/pmp/executions", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

async function apiPmpExecutionDelete(executionId) {
  return apiRequest(`/api/pmp/executions/${encodeURIComponent(executionId)}`, {
    method: "DELETE",
  });
}

async function apiPmpDuplicate(payload) {
  return apiRequest("/api/pmp/duplicate", {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
}

async function syncMaintenanceNow(items, force) {
  if (!currentUser) {
    return;
  }
  if (!activeProjectId) {
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
  if (!activeProjectId) {
    return;
  }
  if (!maintenanceLoadedProjects.has(activeProjectId)) {
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
  if (!activeProjectId) {
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
  if (!currentUser || !canInviteUsuarios(currentUser)) {
    mostrarMensagemGerencial("Sem permissão para aprovar solicitações.", true);
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
  if (!currentUser || !canInviteUsuarios(currentUser)) {
    mostrarMensagemGerencial("Sem permissão para recusar solicitações.", true);
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
    mostrarMensagemGerencial("Não é possível alterar o próprio cargo.", true);
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
  const userId = item.dataset.userId;
  const user = users.find((usuario) => usuario.id === userId);
  if (!user) {
    return;
  }
  if (!currentUser || !canEditProfile(currentUser, user)) {
    mostrarMensagemGerencial("Sem permissão para editar este perfil.", true);
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
  if (!currentUser || !canDesativarUsuarios(currentUser)) {
    mostrarMensagemGerencial("Sem permissão para remover usuários.", true);
    return;
  }
  const userId = item.dataset.userId;
  const user = users.find((usuario) => usuario.id === userId);
  if (!user) {
    return;
  }
  if (currentUser && user.id === currentUser.id) {
    mostrarMensagemGerencial("Não é possível remover a conta logada.", true);
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

if (btnRefreshHealth) {
  btnRefreshHealth.addEventListener("click", () => {
    carregarHealth(true);
  });
}

if (btnHealthRunAll) {
  btnHealthRunAll.addEventListener("click", async () => {
    btnHealthRunAll.disabled = true;
    try {
      await runAllHealthTasks();
    } finally {
      btnHealthRunAll.disabled = false;
    }
  });
}

if (healthTasks) {
  healthTasks.addEventListener("click", async (event) => {
    const btn = event.target.closest("[data-action=\"run-task\"]");
    if (!btn || !currentUser || !hasGranularPermission(currentUser, "reexecutarTarefas")) {
      return;
    }
    const taskId = btn.dataset.taskId;
    if (!taskId) {
      return;
    }
    btn.disabled = true;
    mostrarMensagemHealth("Reexecutando tarefa...");
    try {
      const data = await apiRunHealthTask(taskId);
      if (data && data.snapshot) {
        healthSnapshot = data.snapshot;
        renderHealthSummary(healthSnapshot);
        renderHealthTasks(healthSnapshot);
        renderHealthIntegrity(healthSnapshot);
      }
      mostrarMensagemHealth("Tarefa reexecutada.");
    } catch (error) {
      mostrarMensagemHealth(error.message || "Falha ao reexecutar tarefa.", true);
    } finally {
      btn.disabled = false;
    }
  });
}

if (btnLogsApply) {
  btnLogsApply.addEventListener("click", () => {
    carregarApiLogs(true);
  });
}

if (btnLogsExport) {
  btnLogsExport.addEventListener("click", () => {
    exportarApiLogs();
  });
}

if (btnLogsClear) {
  btnLogsClear.addEventListener("click", () => {
    if (logsFilterEndpoint) {
      logsFilterEndpoint.value = "";
    }
    if (logsFilterUser) {
      logsFilterUser.value = "";
    }
    if (logsFilterStatus) {
      logsFilterStatus.value = "";
    }
    if (logsFilterFrom) {
      logsFilterFrom.value = "";
    }
    if (logsFilterTo) {
      logsFilterTo.value = "";
    }
    carregarApiLogs(true);
  });
}

if (btnLogsRefresh) {
  btnLogsRefresh.addEventListener("click", () => {
    carregarApiLogs(true);
  });
}

if (btnLogsLoadMore) {
  btnLogsLoadMore.addEventListener("click", () => {
    carregarApiLogs(false);
  });
}

if (apiLogsTable) {
  apiLogsTable.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action=\"toggle-log\"]");
    if (!btn) {
      return;
    }
    const logId = btn.dataset.logId;
    if (!logId) {
      return;
    }
    const detailRow = apiLogsTable.querySelector(
      `tr[data-log-details=\"${logId}\"]`
    );
    if (!detailRow) {
      return;
    }
    detailRow.hidden = !detailRow.hidden;
    btn.textContent = detailRow.hidden ? "Ver JSON" : "Ocultar";
  });
}

if (btnAutomationRefresh) {
  btnAutomationRefresh.addEventListener("click", () => {
    carregarAutomacoes(true);
  });
}

if (automationList) {
  automationList.addEventListener("change", async (event) => {
    const toggle = event.target.closest("[data-action=\"toggle-automation\"]");
    if (!toggle || !currentUser || !hasGranularPermission(currentUser, "gerenciarAutomacoes")) {
      return;
    }
    const automationId = toggle.dataset.automationId;
    if (!automationId) {
      return;
    }
    const enabled = toggle.checked;
    toggle.disabled = true;
    mostrarMensagemAutomacoes("Salvando automação...");
    try {
      const data = await apiUpdateAutomation(automationId, { enabled });
      automationsState.items = Array.isArray(data.automations) ? data.automations : [];
      renderAutomacoes();
      mostrarMensagemAutomacoes("Automação atualizada.");
    } catch (error) {
      toggle.checked = !enabled;
      mostrarMensagemAutomacoes(error.message || "Falha ao atualizar automação.", true);
    } finally {
      toggle.disabled = false;
    }
  });
}

if (btnFilesRefresh) {
  btnFilesRefresh.addEventListener("click", () => {
    carregarArquivos(true);
  });
}

if (filesFilterType) {
  filesFilterType.addEventListener("change", () => {
    carregarArquivos(true);
  });
}

if (filesSearch) {
  filesSearch.addEventListener("input", () => {
    if (filesSearchTimer) {
      clearTimeout(filesSearchTimer);
    }
    filesSearchTimer = setTimeout(() => {
      carregarArquivos(true);
    }, 300);
  });
}

if (btnFilesUpload) {
  btnFilesUpload.addEventListener("click", async () => {
    if (!filesUploadInput || !filesUploadType) {
      return;
    }
    if (!currentUser || !canUploadFilesClient(currentUser)) {
      mostrarMensagemArquivos("Sem permissão para enviar arquivos.", true);
      return;
    }
    const type = filesUploadType.value;
    const file = filesUploadInput.files && filesUploadInput.files[0];
    if (!type) {
      mostrarMensagemArquivos("Selecione o tipo do arquivo.", true);
      return;
    }
    if (!file) {
      mostrarMensagemArquivos("Selecione um arquivo.", true);
      return;
    }
    if (!FILE_ALLOWED_TYPES.includes(file.type)) {
      mostrarMensagemArquivos("Tipo de arquivo não suportado.", true);
      return;
    }
    if (file.size > FILE_MAX_BYTES) {
      mostrarMensagemArquivos("Arquivo acima de 10 MB.", true);
      return;
    }
    btnFilesUpload.disabled = true;
    mostrarMensagemArquivos("Enviando arquivo...");
    try {
      const formData = new FormData();
      formData.append("type", type);
      formData.append("file", file);
      await apiUploadFile(formData);
      filesUploadInput.value = "";
      carregarArquivos(true);
      mostrarMensagemArquivos("Arquivo enviado com sucesso.");
    } catch (error) {
      mostrarMensagemArquivos(error.message || "Falha ao enviar arquivo.", true);
    } finally {
      btnFilesUpload.disabled = false;
    }
  });
}

if (filesList) {
  filesList.addEventListener("click", async (event) => {
    const removeBtn = event.target.closest("[data-action=\"delete-file\"]");
    if (!removeBtn) {
      return;
    }
    if (!currentUser || !canDeleteFilesClient(currentUser)) {
      mostrarMensagemArquivos("Sem permissão para remover arquivos.", true);
      return;
    }
    const fileId = removeBtn.dataset.fileId;
    if (!fileId) {
      return;
    }
    const confirmar = window.confirm("Excluir este arquivo?");
    if (!confirmar) {
      return;
    }
    removeBtn.disabled = true;
    mostrarMensagemArquivos("Removendo arquivo...");
    try {
      await apiDeleteFile(fileId);
      carregarArquivos(true);
      mostrarMensagemArquivos("Arquivo removido.");
    } catch (error) {
      mostrarMensagemArquivos(error.message || "Falha ao remover arquivo.", true);
    } finally {
      removeBtn.disabled = false;
    }
  });
}

if (btnPermissoesSalvar) {
  btnPermissoesSalvar.addEventListener("click", async () => {
    if (!currentUser || !isAdmin() || !canViewGerencial(currentUser)) {
      mostrarMensagemPermissoes("Sem permissão para editar permissões.", true);
      return;
    }
    const payload = { values: coletarPermissoesGerenciais() };
    btnPermissoesSalvar.disabled = true;
    mostrarMensagemPermissoes("Salvando permissões...");
    try {
      const data = await apiSalvarPermissoes(payload);
      permissoesState.values = data.values || payload.values;
      permissoesState.profiles = Array.isArray(data.profiles) ? data.profiles : permissoesState.profiles;
      permissoesState.permissions = Array.isArray(data.permissions)
        ? data.permissions
        : permissoesState.permissions;
      permissoesState.loaded = true;
      if (currentUser) {
        const profileKey = getProfileKeyForUser(currentUser);
        if (permissoesState.values && permissoesState.values[profileKey]) {
          currentUser.granularPermissions = permissoesState.values[profileKey];
        }
      }
      renderPermissoesGerenciais();
      renderAuthUI();
      renderPerfil();
      mostrarMensagemPermissoes("Permissões atualizadas.");
    } catch (error) {
      mostrarMensagemPermissoes(error.message || "Falha ao salvar permissões.", true);
    } finally {
      btnPermissoesSalvar.disabled = false;
    }
  });
}

if (permissoesSearch) {
  permissoesSearch.addEventListener("input", () => {
    renderPermissoesGerenciais();
  });
}


if (btnLembretes) {
  btnLembretes.addEventListener("click", (event) => {
    event.stopPropagation();
    alternarPainelLembretes();
  });
}

if (btnDashboard) {
  btnDashboard.addEventListener("click", () => {
    abrirPainelComCarregamento("inicio");
  });
}

if (btnHelp) {
  btnHelp.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!currentUser) {
      return;
    }
    openHelpModal();
  });
}

if (btnHelpClose) {
  btnHelpClose.addEventListener("click", () => {
    closeHelpModal();
  });
}

if (modalHelp) {
  modalHelp.addEventListener("click", (event) => {
    if (event.target === modalHelp) {
      closeHelpModal();
    }
  });
}

if (btnUserMenu) {
  btnUserMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!currentUser) {
      return;
    }
    alternarUserMenu();
  });
}

if (userMenuPanel) {
  userMenuPanel.addEventListener("click", (event) => {
    const item = event.target.closest(".user-menu__item");
    if (!item) {
      return;
    }
    const action = item.dataset.action;
    fecharUserMenu();
    if (!action) {
      return;
    }
    if (action === "view-profile") {
      abrirPainelComCarregamento("perfil");
      cancelarModoEdicaoPerfil();
      return;
    }
    if (action === "edit-profile") {
      abrirPainelComCarregamento("perfil");
      window.setTimeout(() => {
        ativarModoEdicaoPerfil();
      }, 0);
    }
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
  if (userMenuPanel && !userMenuPanel.hidden && btnUserMenu) {
    const dentro =
      userMenuPanel.contains(event.target) || btnUserMenu.contains(event.target);
    if (!dentro) {
      fecharUserMenu();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fecharPainelLembretes();
    fecharUserMenu();
    closeHelpModal();
  }
});

if (btnFecharPerfil) {
  btnFecharPerfil.addEventListener("click", () => {
    fecharPainelPerfil();
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

document.addEventListener("click", (event) => {
  const editar = event.target.closest("#btnPerfilEditar");
  if (editar) {
    ativarModoEdicaoPerfil();
    return;
  }

  const cancelar = event.target.closest("#btnPerfilCancelar");
  if (cancelar) {
    cancelarModoEdicaoPerfil();
    return;
  }

  const salvar = event.target.closest("#btnPerfilSalvar");
  if (!salvar) {
    return;
  }
  if (!currentUser) {
    return;
  }
  if (!canEditProfile(currentUser, currentUser)) {
    setPerfilSaveMessage("Sem permissão para editar este perfil.", true);
    return;
  }
  const uenInput = document.getElementById("perfilUenInput");
  const projetoInput = document.getElementById("perfilProjetoInput");
  const payload = {};
  const uenValue = uenInput ? uenInput.value.trim() : "";
  const projetoValue = projetoInput ? projetoInput.value.trim() : "";
  if (uenInput && uenValue !== (currentUser.uen || "")) {
    payload.uen = uenValue;
  }
  if (projetoInput && projetoValue !== (currentUser.projectId || "")) {
    payload.projectId = projetoValue;
  }
  if (!Object.keys(payload).length) {
    setPerfilSaveMessage("Nenhuma alteração para salvar.");
    return;
  }
  salvar.disabled = true;
  setPerfilSaveMessage("");
  apiUpdateProfile(payload)
    .then((data) => {
      if (data && data.user) {
        currentUser = data.user;
        users = users.map((usuario) => (usuario.id === currentUser.id ? data.user : usuario));
      }
      setProfileEditParam(false);
      renderPerfil();
      renderUsuarios();
      renderAuthUI();
      setPerfilSaveMessage("Perfil atualizado.");
    })
    .catch((error) => {
      const message = error && error.message ? error.message : "Não foi possível salvar.";
      setPerfilSaveMessage(message, true);
    })
    .finally(() => {
      salvar.disabled = false;
    });
});

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
    if (!currentUser || !canInviteUsuarios(currentUser)) {
      if (inviteResultado) {
        inviteResultado.textContent = "Sem permissão para gerar convite.";
      }
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
        inviteResultado.textContent = "Não foi possível gerar o convite.";
      }
    }
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const login = loginUsuario.value.trim();
  const senha = loginSenha.value.trim();
  if (!login || !senha) {
    mostrarMensagemConta("Informe usuário e senha.", true);
    return;
  }
  if (btnLoginSubmit) {
    btnLoginSubmit.disabled = true;
    btnLoginSubmit.textContent = "Entrando...";
  }
  try {
    const data = await apiLogin(login, senha);
    currentUser = data.user;
    mostrarMensagemConta(`Bem-vindo, ${currentUser.name}.`);
    loginSenha.value = "";
    esconderAuthPanels();
    await carregarSessaoServidor();
  } catch (error) {
    const message = error && error.message ? error.message : "Usuário ou senha inválidos.";
    mostrarMensagemConta(message, true);
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
  const matricula = reqMatricula.value.trim();
  const email = matricula;
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
      setFieldError(reqSenhaConfirmErro, "As senhas não conferem.");
    }
    return;
  }
  if (!rulesOk) {
    setFieldError(reqSenhaErro, "Senha fora da politica.");
    return;
  }
  if (senha !== senhaConfirm) {
    setFieldError(reqSenhaConfirmErro, "As senhas não conferem.");
    return;
  }
  if (btnRegistroSubmit) {
    btnRegistroSubmit.disabled = true;
    btnRegistroSubmit.textContent = "Solicitando...";
  }
  try {
    const data = await apiRegister({ matricula, email, nome, senha, senhaConfirm, convite });
    const needsVerification = !data || data.verificationRequired !== false;
    const successMessage = needsVerification
      ? "Conta criada. Confirme o email para ativar."
      : "Conta criada. Voce ja pode entrar.";
    mostrarMensagemConta(successMessage, false);
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
    const message = error && error.message ? error.message : "Não foi possível criar a conta.";
    mostrarMensagemConta(message, true);
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
if (perfProjetoPeriodo) {
  perfProjetoPeriodo.addEventListener("change", renderPerformanceProjetos);
}
if (perfProjetoFiltro) {
  perfProjetoFiltro.addEventListener("change", renderPerformanceProjetos);
}
if (perfPessoaPeriodo) {
  perfPessoaPeriodo.addEventListener("change", renderPerformancePessoas);
}
if (perfPessoaFiltro) {
  perfPessoaFiltro.addEventListener("change", renderPerformancePessoas);
}

if (projectSelect) {
  projectSelect.addEventListener("change", (event) => {
    const nextId = event.target.value;
    if (!nextId) {
      return;
    }
    setActiveProjectId(nextId);
  });
}

if (projectFormSelect) {
  projectFormSelect.addEventListener("change", () => {
    const projectId = projectFormSelect.value;
    if (!projectId) {
      resetProjectForm();
      return;
    }
    const project = availableProjects.find((item) => item.id === projectId);
    if (project) {
      setProjectFormValues(project);
    }
  });
}

if (manutencaoProjeto) {
  manutencaoProjeto.addEventListener("change", (event) => {
    const nextId = event.target.value;
    if (!nextId) {
      return;
    }
    setActiveProjectId(nextId);
  });
}

if (templateProjeto) {
  templateProjeto.addEventListener("change", (event) => {
    const nextId = event.target.value;
    if (!nextId) {
      return;
    }
    setActiveProjectId(nextId);
  });
}

if (equipamentoFormProject) {
  equipamentoFormProject.addEventListener("change", (event) => {
    const nextId = event.target.value;
    if (!nextId) {
      return;
    }
    setActiveProjectId(nextId);
  });
}

if (projectManageBtn && !projectManageBtn.dataset.tab) {
  projectManageBtn.addEventListener("click", () => {
    abrirPainelComCarregamento("projetos");
  });
}

if (projectTabs.length) {
  projectTabs.forEach((button) => {
    button.addEventListener("click", () => {
      setProjectTab(button.dataset.projectTab);
    });
  });
}

  if (projectForm) {
    projectForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!currentUser || !canManageProjetos(currentUser)) {
        return;
      }
      const payload = {
        codigo: projectFormCodigo ? projectFormCodigo.value.trim() : "",
        nome: projectFormNome ? projectFormNome.value.trim() : "",
        cliente: projectFormCliente ? projectFormCliente.value.trim() : "",
        descricao: projectFormDescricao ? projectFormDescricao.value.trim() : "",
        locais: parseProjectLocaisInput(projectFormLocais ? projectFormLocais.value : ""),
      };
    const projectId = projectFormId ? projectFormId.value.trim() : "";
    try {
      if (projectId) {
        await apiProjetosUpdate(projectId, payload);
      } else {
        await apiProjetosCreate(payload);
      }
      resetProjectForm();
      await refreshProjects();
    } catch (error) {
      alert(error && error.message ? error.message : "Falha ao salvar projeto.");
    }
  });
}

if (projectFormCancel) {
  projectFormCancel.addEventListener("click", () => {
    resetProjectForm();
  });
}

if (projectTable) {
  projectTable.addEventListener("click", async (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) {
      return;
    }
    const row = event.target.closest("tr");
    if (!row) {
      return;
    }
    const projectId = row.dataset.projectId;
    if (!projectId) {
      return;
    }
    if (action.dataset.action === "set-active") {
      await setActiveProjectId(projectId);
      return;
    }
    if (!currentUser || !canManageProjetos(currentUser)) {
      return;
    }
    if (action.dataset.action === "edit-project") {
      const project = availableProjects.find((item) => item.id === projectId);
      if (!project) {
        return;
      }
      setProjectFormValues(project);
      return;
    }
    if (action.dataset.action === "delete-project") {
      const ok = confirm("Excluir projeto? Essa ação não pode ser desfeita.");
      if (!ok) {
        return;
      }
      try {
        await apiProjetosDelete(projectId);
        await refreshProjects();
      } catch (error) {
        alert(error && error.message ? error.message : "Falha ao excluir projeto.");
      }
    }
  });
}

if (equipamentoForm) {
  equipamentoForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser || !canManageEquipamentos(currentUser)) {
      return;
    }
    const payload = {
      tag: equipamentoFormTag ? equipamentoFormTag.value.trim() : "",
      nome: equipamentoFormNome ? equipamentoFormNome.value.trim() : "",
      categoria: equipamentoFormCategoria ? equipamentoFormCategoria.value.trim() : "",
      descricao: equipamentoFormDescricao ? equipamentoFormDescricao.value.trim() : "",
    };
    const targetProjectId = equipamentoFormProject
      ? equipamentoFormProject.value.trim()
      : activeProjectId;
    const equipamentoId = equipamentoFormId ? equipamentoFormId.value.trim() : "";
    try {
      if (equipamentoId) {
        if (targetProjectId && targetProjectId !== activeProjectId) {
          await setActiveProjectId(targetProjectId);
        }
        await apiEquipamentosUpdate(equipamentoId, payload);
      } else if (targetProjectId) {
        await apiProjetosEquipamentosCreate(targetProjectId, payload);
        if (targetProjectId !== activeProjectId) {
          await setActiveProjectId(targetProjectId);
        }
      } else {
        alert("Selecione um projeto para o equipamento.");
        return;
      }
      resetEquipamentoForm();
      await carregarEquipamentosProjeto();
    } catch (error) {
      alert(error && error.message ? error.message : "Falha ao salvar equipamento.");
    }
  });
}

if (equipamentoFormCancel) {
  equipamentoFormCancel.addEventListener("click", () => {
    resetEquipamentoForm();
  });
}

if (equipamentoTable) {
  equipamentoTable.addEventListener("click", async (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) {
      return;
    }
    const row = event.target.closest("tr");
    if (!row) {
      return;
    }
    const equipamentoId = row.dataset.equipmentId;
    if (!equipamentoId) {
      return;
    }
    if (!currentUser || !canManageEquipamentos(currentUser)) {
      return;
    }
    const equipamento = projectEquipamentos.find((item) => item.id === equipamentoId);
    if (!equipamento) {
      return;
    }
    if (action.dataset.action === "edit-equipment") {
      if (equipamentoFormId) equipamentoFormId.value = equipamento.id;
      if (equipamentoFormProject) {
        equipamentoFormProject.value = equipamento.projectId || activeProjectId || "";
      }
      if (equipamentoFormTag) equipamentoFormTag.value = equipamento.tag || "";
      if (equipamentoFormNome) equipamentoFormNome.value = equipamento.nome || "";
      if (equipamentoFormCategoria) equipamentoFormCategoria.value = equipamento.categoria || "";
      if (equipamentoFormDescricao) equipamentoFormDescricao.value = equipamento.descricao || "";
      return;
    }
    if (action.dataset.action === "delete-equipment") {
      const ok = confirm("Excluir equipamento?");
      if (!ok) {
        return;
      }
      try {
        await apiEquipamentosDelete(equipamentoId);
        await carregarEquipamentosProjeto();
      } catch (error) {
        alert(error && error.message ? error.message : "Falha ao excluir equipamento.");
      }
    }
  });
}

if (equipeForm) {
  equipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser || !canManageEquipeProjeto(currentUser)) {
      return;
    }
    const selected = equipeFormUser
      ? Array.from(equipeFormUser.selectedOptions)
          .map((option) => option.value)
          .filter(Boolean)
      : [];
    if (!selected.length || !activeProjectId) {
      return;
    }
    try {
      await apiProjetosEquipeAdd(activeProjectId, { userIds: selected });
      if (equipeForm) {
        equipeForm.reset();
      }
      if (equipeSearch) {
        equipeSearch.value = "";
      }
      await carregarEquipeProjeto();
    } catch (error) {
      alert(error && error.message ? error.message : "Falha ao adicionar equipe.");
    }
  });
}

if (equipeSearch) {
  equipeSearch.addEventListener("input", () => {
    renderEquipeSelectOptions();
  });
}

if (equipeTable) {
  equipeTable.addEventListener("click", async (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) {
      return;
    }
    const row = event.target.closest("tr");
    if (!row) {
      return;
    }
    const userId = row.dataset.userId;
    if (!userId) {
      return;
    }
    if (!currentUser || !canManageEquipeProjeto(currentUser)) {
      return;
    }
    if (action.dataset.action === "remove-team") {
      const ok = confirm("Remover usuário do projeto?");
      if (!ok || !activeProjectId) {
        return;
      }
      try {
        await apiProjetosEquipeRemove(activeProjectId, userId);
        await carregarEquipeProjeto();
      } catch (error) {
        alert(error && error.message ? error.message : "Falha ao remover usuário.");
      }
    }
  });
}
if (btnEnviarFeedback) {
  btnEnviarFeedback.addEventListener("click", enviarFeedback);
}
if (feedbackTemplateButtons.length && feedbackMessage) {
  const templates = {
    bom: "Excelente atuação no atendimento e registro das atividades. Sua organização ajudou a equipe a manter o ritmo.",
    melhora:
      "Observei pontos que podem melhorar: alinhar o status no OPSCOPE logo após a execução e detalhar melhor o impacto.",
    apoio:
      "Obrigado pelo apoio em campo. Sua prontidão e comunicação clara facilitaram o fechamento das tarefas.",
  };
  feedbackTemplateButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.feedbackTemplate || "";
      if (templates[key]) {
        feedbackMessage.value = templates[key];
        feedbackMessage.focus();
      }
    });
  });
}
if (feedbackTabButtons.length) {
  feedbackTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      feedbackTabButtons.forEach((other) => other.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderFeedbackList();
    });
  });
}
if (feedbackSearch) {
  feedbackSearch.addEventListener("input", renderFeedbackList);
}
if (feedbackSort) {
  feedbackSort.addEventListener("change", renderFeedbackList);
}
if (btnFeedbackInbox) {
  btnFeedbackInbox.addEventListener("click", () => {
    if (!feedbackInboxPanel) {
      return;
    }
    const isOpen = !feedbackInboxPanel.hidden;
    feedbackInboxPanel.hidden = isOpen;
    btnFeedbackInbox.setAttribute("aria-expanded", String(!isOpen));
  });
}
if (feedbackInboxLink) {
  feedbackInboxLink.addEventListener("click", () => {
    ativarTab("feedbacks");
    if (feedbackInboxPanel) {
      feedbackInboxPanel.hidden = true;
    }
  });
}
if (relatorioPeriodoFiltro) {
  relatorioPeriodoFiltro.addEventListener("change", renderRelatorios);
}
if (relatorioStatusFiltro) {
  relatorioStatusFiltro.addEventListener("change", renderRelatorios);
}
if (relatorioResponsavelFiltro) {
  relatorioResponsavelFiltro.addEventListener("change", renderRelatorios);
}
if (relatorioTipoFiltro) {
  relatorioTipoFiltro.addEventListener("change", renderRelatorios);
}
if (btnRelatoriosExportar) {
  btnRelatoriosExportar.addEventListener("click", () => {
    const ok = exportarRelatoriosPdf();
    if (!ok) {
      alert("Popup bloqueado. Permita a abertura para exportar o PDF.");
    }
  });
}
if (btnRelatoriosResumo) {
  btnRelatoriosResumo.addEventListener("click", () => {
    const ok = gerarResumoMensal();
    if (!ok) {
      alert("Popup bloqueado. Permita a abertura para visualizar o resumo.");
    }
  });
}
if (relatorioMes) {
  if (!relatorioMes.value) {
    relatorioMes.value = formatDateISO(new Date()).slice(0, 7);
  }
  updateMonthlyRangeFromMonth();
  relatorioMes.addEventListener("change", () => {
    updateMonthlyRangeFromMonth();
  });
}
if (btnRelatorioMensalPreview) {
  btnRelatorioMensalPreview.addEventListener("click", () => {
    const ok = abrirRdoMensalPreview();
    if (!ok) {
      alert("Não foi possível abrir o preview do RDO mensal.");
    }
  });
}
if (btnRelatorioMensalExportar) {
  btnRelatorioMensalExportar.addEventListener("click", () => {
    const ok = gerarRdoMensal(true);
    if (!ok) {
      alert("Popup bloqueado. Permita a abertura para exportar o PDF.");
    }
  });
}
if (btnRelatorioMensalRdo) {
  btnRelatorioMensalRdo.addEventListener("click", () => {
    const ok = abrirRdoMensalPreview();
    if (!ok) {
      alert("Não foi possível abrir o preview do RDO mensal.");
    }
  });
}
if (rdoMensalPreviewClose) {
  rdoMensalPreviewClose.addEventListener("click", fecharRdoMensalPreview);
}
if (rdoMensalPreviewModal) {
  rdoMensalPreviewModal.addEventListener("click", (event) => {
    if (event.target === rdoMensalPreviewModal) {
      fecharRdoMensalPreview();
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
if (formBacklogMotivo) {
  formBacklogMotivo.addEventListener("submit", salvarBacklogMotivo);
}
if (btnFecharBacklogMotivo) {
  btnFecharBacklogMotivo.addEventListener("click", fecharBacklogMotivo);
}
if (btnCancelarBacklogMotivo) {
  btnCancelarBacklogMotivo.addEventListener("click", fecharBacklogMotivo);
}
if (backlogMotivoSelect) {
  backlogMotivoSelect.addEventListener("change", () => {
    mostrarMensagemBacklogMotivo("");
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
if (futuraManutencao) {
  futuraManutencao.addEventListener("change", atualizarDataManutencaoState);
  atualizarDataManutencaoState();
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

if (gerencialTabs.length) {
  gerencialTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.hidden) {
        return;
      }
      const tabId = tab.dataset.tabTarget;
      if (canAccessGerencialTab(tabId, currentUser)) {
        setGerencialTabActive(tabId);
      }
    });
  });
}

if (gerencialIndicatorsWrap) {
  gerencialIndicatorsWrap.addEventListener("click", (event) => {
    const actionBtn = event.target.closest(".indicator-card__action");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      if (action === "open-diagnostico") {
        setGerencialTabActive("diagnostico");
        carregarHealth(true);
      }
      if (action === "open-logs") {
        setGerencialTabActive("logs");
        carregarApiLogs(true);
      }
      if (action === "open-arquivos") {
        setGerencialTabActive("arquivos");
        carregarArquivos(true);
      }
      if (action === "open-automacoes") {
        setGerencialTabActive("automacoes");
        carregarAutomacoes(true);
      }
      return;
    }
    const card = event.target.closest(".indicator-card[data-tab-target]");
    if (!card || card.hidden) {
      return;
    }
    const tabId = card.dataset.tabTarget;
    if (canAccessGerencialTab(tabId, currentUser)) {
      setGerencialTabActive(tabId);
    }
  });
  gerencialIndicatorsWrap.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    const card = event.target.closest(".indicator-card[data-tab-target]");
    if (!card || card.hidden) {
      return;
    }
    event.preventDefault();
    const tabId = card.dataset.tabTarget;
    if (canAccessGerencialTab(tabId, currentUser)) {
      setGerencialTabActive(tabId);
    }
  });
}

if (btnGerencialPalette) {
  btnGerencialPalette.addEventListener("click", openGerencialPalette);
}

if (gerencialPaletteTrigger) {
  gerencialPaletteTrigger.addEventListener("focus", openGerencialPalette);
  gerencialPaletteTrigger.addEventListener("click", openGerencialPalette);
}

if (gerencialPaletteInput) {
  gerencialPaletteInput.addEventListener("input", (event) => {
    renderGerencialPalette(event.target.value);
  });
  gerencialPaletteInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    const first = gerencialPaletteList
      ? gerencialPaletteList.querySelector(".command-palette__item")
      : null;
    if (first) {
      first.click();
    }
  });
}

if (gerencialPalette) {
  gerencialPalette.addEventListener("click", (event) => {
    const close = event.target.closest("[data-palette-close]");
    if (close || event.target.classList.contains("command-palette__overlay")) {
      closeGerencialPalette();
      return;
    }
    const item = event.target.closest(".command-palette__item");
    if (!item) {
      return;
    }
    const tabId = item.dataset.paletteTab;
    if (tabId && canAccessGerencialTab(tabId, currentUser)) {
      setGerencialTabActive(tabId);
    }
    const selector = item.dataset.paletteSelector;
    if (selector) {
      const target = document.querySelector(selector);
      if (target && typeof target.click === "function" && !target.disabled) {
        target.click();
      }
    }
    const scrollTarget = item.dataset.paletteScroll;
    if (scrollTarget) {
      const target = document.getElementById(scrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    closeGerencialPalette();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (gerencialPalette && !gerencialPalette.hidden) {
      closeGerencialPalette();
      return;
    }
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    const opened = openGerencialPalette();
    if (opened) {
      event.preventDefault();
    }
  }
});

if (btnGerencialRefreshAll) {
  btnGerencialRefreshAll.addEventListener("click", () => {
    refreshGerencialAll();
  });
}

if (btnGerencialGoLogs) {
  btnGerencialGoLogs.addEventListener("click", () => {
    if (canAccessGerencialTab("logs", currentUser)) {
      setGerencialTabActive("logs");
    }
  });
}

if (btnGerencialGoPermissoes) {
  btnGerencialGoPermissoes.addEventListener("click", () => {
    if (canAccessGerencialTab("permissoes", currentUser)) {
      setGerencialTabActive("permissoes");
    }
  });
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

if (pmpForm) {
  pmpForm.addEventListener("submit", salvarPmpActivity);
}
if (pmpFormCancel) {
  pmpFormCancel.addEventListener("click", resetPmpForm);
}
if (pmpAno) {
  pmpAno.addEventListener("change", renderPmpModule);
}
if (pmpView) {
  pmpView.addEventListener("change", renderPmpModule);
}
if (pmpMes) {
  pmpMes.addEventListener("change", renderPmpModule);
}
if (pmpFiltroProjeto) {
  pmpFiltroProjeto.addEventListener("change", () => {
    renderPmpEquipamentoOptions(pmpFiltroProjeto.value);
    renderPmpResponsavelOptions(pmpFiltroProjeto.value);
    syncPmpHorasDisponiveisInput(pmpFiltroProjeto.value);
    updatePmpImportButton();
    renderPmpModule();
  });
}
if (pmpFiltroFrequencia) {
  pmpFiltroFrequencia.addEventListener("change", renderPmpModule);
}
if (pmpFiltroEquipamento) {
  pmpFiltroEquipamento.addEventListener("change", renderPmpModule);
}
if (pmpFiltroResponsavel) {
  pmpFiltroResponsavel.addEventListener("change", renderPmpModule);
}
if (pmpFiltroOrigem) {
  pmpFiltroOrigem.addEventListener("change", renderPmpModule);
}
if (pmpFiltroStatus) {
  pmpFiltroStatus.addEventListener("change", renderPmpModule);
}
if (pmpHorasDisponiveis) {
  pmpHorasDisponiveis.addEventListener("input", () => {
    renderPmpModule();
    schedulePmpHorasDisponiveisSave();
  });
}
if (pmpBusca) {
  pmpBusca.addEventListener("input", renderPmpModule);
}
if (pmpProjeto) {
  pmpProjeto.addEventListener("change", () => {
    renderPmpEquipamentoOptions(pmpProjeto.value);
    renderPmpResponsavelOptions(pmpProjeto.value);
  });
}
if (pmpProcedimentoUpload && pmpProcedimentoFile) {
  pmpProcedimentoUpload.addEventListener("click", () => {
    if (!currentUser || !canUploadPmpProcedimento(currentUser)) {
      if (pmpFormMensagem) {
        pmpFormMensagem.textContent = "Somente PCM pode anexar procedimentos.";
      }
      return;
    }
    pmpProcedimentoFile.click();
  });
}
if (pmpProcedimentoFile) {
  pmpProcedimentoFile.addEventListener("change", () => {
    const file = pmpProcedimentoFile.files && pmpProcedimentoFile.files[0];
    uploadPmpProcedimento(file);
  });
}
if (pmpProcedimentoView) {
  pmpProcedimentoView.addEventListener("click", () => {
    openPmpProcedimento(pmpProcedimentoDoc);
  });
}
if (pmpProcedimentoRemove) {
  pmpProcedimentoRemove.addEventListener("click", () => {
    if (!currentUser || !canUploadPmpProcedimento(currentUser)) {
      if (pmpFormMensagem) {
        pmpFormMensagem.textContent = "Somente PCM pode remover procedimentos.";
      }
      return;
    }
    if (!pmpProcedimentoDoc) {
      return;
    }
    const confirmar = window.confirm("Remover o procedimento anexado?");
    if (!confirmar) {
      return;
    }
    setPmpProcedimentoDoc(null);
    if (pmpFormMensagem) {
      pmpFormMensagem.textContent = "Procedimento removido. Salve a atividade para aplicar.";
    }
  });
}
if (pmpGridBody) {
  pmpGridBody.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-pmp-action]");
    if (botao) {
      const activityId = botao.dataset.pmpId;
      if (!activityId) {
        return;
      }
      if (botao.dataset.pmpAction === "edit") {
        const activity = pmpActivities.find((item) => item.id === activityId);
        if (activity) {
          preencherPmpForm(activity);
        }
      }
      if (botao.dataset.pmpAction === "delete") {
        removerPmpActivity(activityId);
      }
      if (botao.dataset.pmpAction === "view-procedure") {
        const activity = pmpActivities.find((item) => item.id === activityId);
        if (activity) {
          openPmpProcedimento(activity.procedimentoDoc || null);
        }
      }
      return;
    }
    const cell = event.target.closest("td[data-pmp-cell]");
    if (cell && cell.dataset.activityId && cell.dataset.periodKey) {
      openPmpCellModal(cell.dataset.activityId, cell.dataset.periodKey);
    }
  });
}
if (pmpChecklistAdd) {
  pmpChecklistAdd.addEventListener("click", addPmpChecklistItem);
}
if (pmpChecklistList) {
  pmpChecklistList.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-pmp-checklist-remove]");
    if (!botao) {
      return;
    }
    const index = Number(botao.dataset.pmpChecklistRemove);
    if (!Number.isFinite(index)) {
      return;
    }
    pmpChecklistItems = pmpChecklistItems.filter((_, idx) => idx !== index);
    renderPmpChecklist();
  });
}
if (pmpImportBtn) {
  pmpImportBtn.addEventListener("click", openPmpImportModal);
}
if (pmpImportCancel) {
  pmpImportCancel.addEventListener("click", closePmpImportModal);
}
if (pmpImportClose) {
  pmpImportClose.addEventListener("click", closePmpImportModal);
}
if (pmpImportSearch) {
  pmpImportSearch.addEventListener("input", renderPmpImportList);
}
if (pmpImportConfirm) {
  pmpImportConfirm.addEventListener("click", confirmPmpImport);
}
if (pmpCellClose) {
  pmpCellClose.addEventListener("click", closePmpCellModal);
}
if (pmpCellCloseBtn) {
  pmpCellCloseBtn.addEventListener("click", closePmpCellModal);
}
if (pmpCellSave) {
  pmpCellSave.addEventListener("click", salvarPmpExecucaoManual);
}
if (pmpCellRemove) {
  pmpCellRemove.addEventListener("click", removerPmpExecucaoManual);
}
if (pmpCellUnset) {
  pmpCellUnset.addEventListener("click", marcarPmpNaoPrevista);
}
if (pmpCellMarkCancel) {
  pmpCellMarkCancel.addEventListener("click", marcarPmpCancelada);
}
if (pmpDuplicarPlano) {
  pmpDuplicarPlano.addEventListener("click", duplicarPmpPlano);
}
if (pmpExportPdf) {
  pmpExportPdf.addEventListener("click", exportarPmpPdf);
}
if (pmpExportExcel) {
  pmpExportExcel.addEventListener("click", exportarPmpExcel);
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

renderSubestacoes();
renderTipoOptions();
limparTemplateForm();
initSidebarToggle();
initAvatarUpload();
initRichEditors();
initFontGroups();
carregarSessaoServidor();
preencherInicioExecucaoNova();

window.addEventListener("focus", atualizarSeNecessario);
window.addEventListener("storage", (event) => {
  const keysBase = [
    STORAGE_KEY,
    REQUEST_KEY,
    AUDIT_KEY,
    RDO_KEY,
    FEEDBACK_KEY,
    REMINDER_KEY,
    TEMPLATE_KEY,
  ];
  const isRelevant =
    event.key === USER_KEY ||
    keysBase.some((base) => isProjectStorageKey(event.key, base));
  if (isRelevant) {
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
    carregarFeedbacks();
    montarRdoUI();
    carregarSessaoServidor();
  }
});
