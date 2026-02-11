export enum Severity {
  LOW = "LOW",
  MED = "MED",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export enum AnswerValue {
  OK = "OK",
  FAIL = "FAIL",
  NA = "NA"
}

export enum InspectionStatus {
  OK = "OK",
  ATTENTION = "ATTENTION",
  NON_CONFORMING = "NON_CONFORMING"
}

export enum EvidenceOwnerType {
  INSPECTION_RUN = "INSPECTION_RUN",
  INSPECTION_ANSWER = "INSPECTION_ANSWER",
  NON_CONFORMITY = "NON_CONFORMITY"
}

export enum ChecklistType {
  WORK_AT_HEIGHT = "WORK_AT_HEIGHT",
  SCAFFOLDING = "SCAFFOLDING",
  LADDERS = "LADDERS",
  PPE_COMPLIANCE = "PPE_COMPLIANCE",
  EPC_ISOLATION = "EPC_ISOLATION",
  FIRE_EXTINGUISHERS = "FIRE_EXTINGUISHERS",
  FIRE_PREVENTION = "FIRE_PREVENTION",
  NR10_ELECTRICAL = "NR10_ELECTRICAL",
  POWER_TOOLS = "POWER_TOOLS",
  MACHINERY_GUARDS = "MACHINERY_GUARDS",
  LIFTING_OPERATIONS = "LIFTING_OPERATIONS",
  HOISTS_CHAINS = "HOISTS_CHAINS",
  VEHICLES_DAILY = "VEHICLES_DAILY",
  FORKLIFT = "FORKLIFT",
  CONFINED_SPACE = "CONFINED_SPACE",
  HOT_WORK = "HOT_WORK",
  CHEMICALS = "CHEMICALS",
  ERGONOMICS = "ERGONOMICS",
  HOUSEKEEPING = "HOUSEKEEPING",
  FIRST_AID = "FIRST_AID"
}

export type ChecklistQuestion = {
  id: string;
  templateId: string;
  order: number;
  text: string;
  helpText?: string | null;
  severity: Severity;
  requiresPhotoOnFail: boolean;
  autoCreateNc: boolean;
};

export type ChecklistTemplate = {
  id: string;
  name: string;
  type: ChecklistType;
  periodicityDays?: number | null;
  isActive: boolean;
  projectId?: string | null;
  createdAt: string;
  updatedAt: string;
  questions: ChecklistQuestion[];
};

export type TemplateQuestionInput = {
  id?: string;
  order?: number;
  text: string;
  helpText?: string | null;
  severity: Severity;
  requiresPhotoOnFail: boolean;
  autoCreateNc: boolean;
};

export type UpsertTemplateInput = {
  id?: string;
  name: string;
  type: ChecklistType;
  periodicityDays?: number | null;
  isActive?: boolean;
  projectId?: string | null;
  questions: TemplateQuestionInput[];
};

export type InspectionRun = {
  id: string;
  templateId: string;
  projectId: string;
  worksiteId?: string | null;
  inspectorId: string;
  startedAt: string;
  finishedAt?: string | null;
  score: number;
  status: InspectionStatus;
  notes?: string | null;
};

export type InspectionAnswer = {
  id: string;
  runId: string;
  questionId: string;
  answer: AnswerValue;
  notes?: string | null;
  severitySnapshot: Severity;
  createdAt: string;
};

export type Evidence = {
  id: string;
  ownerType: EvidenceOwnerType;
  ownerId: string;
  fileName: string;
  fileType: string;
  blob: Blob;
  caption?: string | null;
  metadata?: any;
  createdBy: string;
  createdAt: string;
};

export type NonConformityStatus = "OPEN" | "IN_PROGRESS" | "VERIFY" | "DONE";

export type NonConformity = {
  id: string;
  projectId: string;
  worksiteId?: string | null;
  sourceType: "INSPECTION";
  sourceId: string;
  severity: Severity;
  title: string;
  description: string;
  status: NonConformityStatus;
  dueDate?: string | null;
  createdBy: string;
  createdAt: string;
};

export type FailStats = {
  totalFails: number;
  bySeverity: Record<Severity, number>;
};

export type InspectionRunSummary = {
  id: string;
  startedAt: string;
  finishedAt?: string | null;
  projectId: string;
  worksiteId?: string | null;
  templateId: string;
  templateName: string;
  inspectorId: string;
  score: number;
  status: InspectionStatus;
  failCount: number;
  criticalFailCount: number;
};

export type InspectionRunDetails = InspectionRun & {
  template: ChecklistTemplate;
  answers: InspectionAnswer[];
  evidencesByAnswerId: Record<string, Evidence[]>;
  runEvidences: Evidence[];
  failStats: FailStats;
  ncs?: NonConformity[];
};

export interface SstInspectionsProvider {
  listTemplates(filters?: {
    projectId?: string;
    type?: ChecklistType;
    active?: boolean;
    q?: string;
  }): Promise<ChecklistTemplate[]>;
  getTemplate(id: string): Promise<ChecklistTemplate | null>;
  upsertTemplate(input: UpsertTemplateInput): Promise<ChecklistTemplate>;
  deleteTemplate(id: string): Promise<void>;
  seedTemplatesIfEmpty(): Promise<{ seeded: boolean; count: number }>;

  startRun(input: {
    templateId: string;
    projectId: string;
    worksiteId?: string;
    inspectorId: string;
  }): Promise<InspectionRun>;
  saveAnswer(input: {
    runId: string;
    questionId: string;
    answer: AnswerValue;
    notes?: string;
  }): Promise<InspectionAnswer>;
  attachEvidence(input: {
    ownerType: EvidenceOwnerType;
    ownerId: string;
    file: File;
    caption?: string;
    metadata?: any;
  }): Promise<Evidence>;
  listEvidences(input: { ownerType: EvidenceOwnerType; ownerId: string }): Promise<Evidence[]>;
  finishRun(input: { runId: string; notes?: string }): Promise<InspectionRun>;

  generateNcsFromRun(input: {
    runId: string;
    includeSeverities?: Severity[];
    mode?: "PER_ANSWER" | "GROUPED";
  }): Promise<NonConformity[]>;
  listNcs(filters?: {
    projectId?: string;
    status?: NonConformityStatus;
    severity?: Severity;
    q?: string;
  }): Promise<NonConformity[]>;

  listRuns(filters?: {
    projectId?: string;
    templateId?: string;
    status?: InspectionStatus;
    from?: string;
    to?: string;
    q?: string;
  }): Promise<InspectionRunSummary[]>;
  getRunDetails(runId: string): Promise<InspectionRunDetails | null>;
}
