import {
  ChecklistTemplate,
  ChecklistType,
  Severity
} from "../data/sstInspectionsProvider";

type SeedQuestion = {
  text: string;
  severity: Severity;
  requiresPhotoOnFail: boolean;
  helpText?: string | null;
};

type SeedTemplate = {
  name: string;
  type: ChecklistType;
  periodicityDays: number | null;
  questions: SeedQuestion[];
};

const defaultHelp = "Se FAIL, descreva e fotografe a evidencia.";

const seedTemplates: SeedTemplate[] = [
  {
    name: "NR-35 — Trabalho em Altura (pre-check)",
    type: ChecklistType.WORK_AT_HEIGHT,
    periodicityDays: 1,
    questions: [
      { text: "Ancoragem/linha de vida certificada e inspecionada?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Cinto paraquedista + talabarte (com absorvedor) em bom estado?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Conexoes/travas funcionando e sem deformacoes?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Plano de resgate disponivel e equipe ciente?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Area isolada e sinalizada abaixo do trabalho?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Condicoes climaticas seguras (vento/chuva)?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Ferramentas com retencao/amarracao quando necessario?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Checklist NR-35 do colaborador preenchido?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Andaimes — Montagem e Condicao",
    type: ChecklistType.SCAFFOLDING,
    periodicityDays: 7,
    questions: [
      { text: "Guarda-corpo completo (superior/intermediario/rodape)?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Piso completo, fixo e sem vaos?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Acesso seguro (escada) fixado?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Travamentos/contraventamentos integros?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Base/sapatas niveladas?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Sinalizacao de carga maxima visivel?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Rodizios travados (se movel)?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Inspecao diaria registrada?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Escadas Portateis",
    type: ChecklistType.LADDERS,
    periodicityDays: 7,
    questions: [
      { text: "Escada sem trincas/deformacoes e com sapatas integras?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Angulo correto e base estavel?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Escada fixada no topo quando necessario?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Proibido usar ultimos degraus (quando aplicavel)?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Sem improvisos (caixas/tambores)?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Area isolada em caso de circulacao?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "EPI — Uso e Conformidade (campo)",
    type: ChecklistType.PPE_COMPLIANCE,
    periodicityDays: 1,
    questions: [
      { text: "Capacete com jugular quando exigido e sem avarias?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Oculos/face shield quando risco de projecao?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Luvas corretas para a atividade?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Botina adequada (biqueira/solado)?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Protetor auricular quando ruido elevado?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Vestimenta adequada e em boas condicoes?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "EPI limpo e armazenado adequadamente?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "EPC — Sinalizacao e Isolamento de Area",
    type: ChecklistType.EPC_ISOLATION,
    periodicityDays: 1,
    questions: [
      { text: "Area de risco isolada com barreira fisica (nao so fita)?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Sinalizacao visivel e coerente com o risco?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Rotas de fuga desobstruidas?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Iluminacao adequada na area?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Placas de obrigatoriedade de EPI instaladas?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Extintores — Inspecao Mensal",
    type: ChecklistType.FIRE_EXTINGUISHERS,
    periodicityDays: 30,
    questions: [
      { text: "Extintor acessivel e desobstruido?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Lacre e pino intactos?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Manometro na faixa verde (se aplicavel)?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Sinalizacao e suporte adequados?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Validade da carga/manutencao em dia?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Identificacao do tipo correta para o risco do local?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Prevencao de Incendio — Housekeeping",
    type: ChecklistType.FIRE_PREVENTION,
    periodicityDays: 7,
    questions: [
      { text: "Combustiveis armazenados corretamente?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Sem acumulo de residuos/embalagens?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Proibido fumar sinalizado e respeitado?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Extintores presentes nos pontos criticos?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Rotas de fuga marcadas?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Eletricidade — NR-10 (campo)",
    type: ChecklistType.NR10_ELECTRICAL,
    periodicityDays: 7,
    questions: [
      { text: "Quadros energizados fechados e identificados?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "LOTO aplicado quando intervencao?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Cabos/plugues sem emendas improvisadas?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Aterramento/DR onde exigido?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Ferramentas isoladas quando aplicavel?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Organizacao de cabos evitando tropeço?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Ferramentas Eletricas Portateis",
    type: ChecklistType.POWER_TOOLS,
    periodicityDays: 7,
    questions: [
      { text: "Carcaca integra, sem fios expostos?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Protecoes/carenagens instaladas?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Disco/acessorio correto e sem trincas?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "EPI adequado no uso?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Check de funcionamento antes do uso?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Maquinas — Protecoes e Emergencia",
    type: ChecklistType.MACHINERY_GUARDS,
    periodicityDays: 7,
    questions: [
      { text: "Protecoes fisicas instaladas?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Botao de emergencia funcional e acessivel?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Operador autorizado/treinado?", severity: Severity.HIGH, requiresPhotoOnFail: false },
      { text: "Area sinalizada e sem terceiros?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Manutencao preventiva registrada?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Içamento — Pre-operacao",
    type: ChecklistType.LIFTING_OPERATIONS,
    periodicityDays: null,
    questions: [
      { text: "Plano de rigging e capacidade compativel?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Cintas/manilhas/ganchos inspecionados?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Area isolada e sinalizada?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Sinaleiro designado e comunicacao definida?", severity: Severity.HIGH, requiresPhotoOnFail: false },
      { text: "Solo/apoios estabilizados?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Condicoes climaticas avaliadas?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Talhas/Guinchos/Correntes",
    type: ChecklistType.HOISTS_CHAINS,
    periodicityDays: 30,
    questions: [
      { text: "Correntes/cabos sem deformacao/trinca?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Trava de seguranca do gancho ok?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Capacidade visivel?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Registro de inspecao periodico?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Veiculos — Checklist Diario",
    type: ChecklistType.VEHICLES_DAILY,
    periodicityDays: 1,
    questions: [
      { text: "Freios/iluminacao/setas ok?", severity: Severity.HIGH, requiresPhotoOnFail: false },
      { text: "Pneus ok?", severity: Severity.HIGH, requiresPhotoOnFail: false },
      { text: "Cinto funciona?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Extintor/triangulo presentes?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Documentacao/habilitacao ok?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Empilhadeira — Operacao",
    type: ChecklistType.FORKLIFT,
    periodicityDays: 1,
    questions: [
      { text: "Operador habilitado/autorizado?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Buzina/alarme de re funcionando?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Garfos/correntes sem trincas?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Rotas segregadas de pedestres?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Checklist preenchido?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Espaco Confinado — Pre-Entrada",
    type: ChecklistType.CONFINED_SPACE,
    periodicityDays: null,
    questions: [
      { text: "PT emitida e valida?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Monitoramento atmosferico (O2/LEL/H2S/CO)?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Vigia presente e comunicacao definida?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Ventilacao/exaustao instalada?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Plano de resgate e equipamentos?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "EPIs especificos disponiveis?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Isolamento e sinalizacao do acesso?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Solda/Trabalho a Quente — PTQ",
    type: ChecklistType.HOT_WORK,
    periodicityDays: null,
    questions: [
      { text: "PTQ emitida e valida?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Area limpa de combustiveis?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Cortina/protecao de faiscas instalada?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Extintor adequado proximo?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Aterramento e cabos ok?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Vigilancia pos-trabalho realizada?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Quimicos — Armazenamento/Manuseio",
    type: ChecklistType.CHEMICALS,
    periodicityDays: 30,
    questions: [
      { text: "FISPQ disponivel?", severity: Severity.CRITICAL, requiresPhotoOnFail: true },
      { text: "Embalagens identificadas e integras?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Armazenamento segregado e ventilado?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Kit de contencao disponivel?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "EPI quimico disponivel/uso?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Registro de controle ok?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Ergonomia — Movimentacao Manual",
    type: ChecklistType.ERGONOMICS,
    periodicityDays: 30,
    questions: [
      { text: "Tecnica correta de levantamento?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Peso compativel ou auxilio mecanico?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Pausas/rodizio quando repetitivo?", severity: Severity.LOW, requiresPhotoOnFail: false },
      { text: "Posto ajustado quando aplicavel?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Ordem e Limpeza — 5S",
    type: ChecklistType.HOUSEKEEPING,
    periodicityDays: 1,
    questions: [
      { text: "Rotas livres de obstaculos?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Materiais organizados/empilhamento seguro?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Residuos segregados e coletores disponiveis?", severity: Severity.MED, requiresPhotoOnFail: true },
      { text: "Ferramentas guardadas apos uso?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Iluminacao/sinalizacao ok?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  },
  {
    name: "Primeiros Socorros — Prontidao",
    type: ChecklistType.FIRST_AID,
    periodicityDays: 30,
    questions: [
      { text: "Kit completo e dentro da validade?", severity: Severity.HIGH, requiresPhotoOnFail: true },
      { text: "Pessoas treinadas identificadas?", severity: Severity.HIGH, requiresPhotoOnFail: false },
      { text: "Contatos/rota de emergencia disponiveis?", severity: Severity.MED, requiresPhotoOnFail: false },
      { text: "Registro de inspecao do kit em dia?", severity: Severity.LOW, requiresPhotoOnFail: false }
    ]
  }
];

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sst_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function buildSeedTemplates(): ChecklistTemplate[] {
  const now = new Date().toISOString();
  return seedTemplates.map((template) => {
    const templateId = createId();
    return {
      id: templateId,
      name: template.name,
      type: template.type,
      periodicityDays: template.periodicityDays,
      isActive: true,
      projectId: null,
      createdAt: now,
      updatedAt: now,
      questions: template.questions.map((question, index) => ({
        id: createId(),
        templateId,
        order: index + 1,
        text: question.text,
        helpText: question.helpText ?? (question.requiresPhotoOnFail ? defaultHelp : null),
        severity: question.severity,
        requiresPhotoOnFail: question.requiresPhotoOnFail,
        autoCreateNc: true
      }))
    };
  });
}

export const seedTemplatesCount = seedTemplates.length;
