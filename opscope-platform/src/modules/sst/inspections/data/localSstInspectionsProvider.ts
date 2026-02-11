import {
  AnswerValue,
  ChecklistTemplate,
  Evidence,
  EvidenceOwnerType,
  InspectionAnswer,
  InspectionRun,
  InspectionRunDetails,
  InspectionRunSummary,
  InspectionStatus,
  NonConformity,
  Severity,
  SstInspectionsProvider,
  UpsertTemplateInput
} from "./sstInspectionsProvider";
import { buildSeedTemplates, seedTemplatesCount } from "../seed/sstChecklists.seed";
import { buildFailStats, buildNonConformitiesForRun, calculateScore, calculateStatus } from "../rules/sstInspectionRules";

const DB_NAME = "opscope_sst_inspections";
const DB_VERSION = 1;
const STORE_TEMPLATES = "templates";
const STORE_RUNS = "runs";
const STORE_ANSWERS = "answers";
const STORE_EVIDENCES = "evidences";
const STORE_NCS = "ncs";
const LS_PREFIX = "opscope_sst_inspections_";

const storeNames = [STORE_TEMPLATES, STORE_RUNS, STORE_ANSWERS, STORE_EVIDENCES, STORE_NCS] as const;

type StoreName = (typeof storeNames)[number];

type StoredEvidence = Omit<Evidence, "blob"> & { blob?: Blob; dataUrl?: string };

const hasIndexedDb = () => typeof indexedDB !== "undefined";
const isBrowser = () => typeof window !== "undefined";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sst_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_TEMPLATES)) {
        db.createObjectStore(STORE_TEMPLATES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_RUNS)) {
        db.createObjectStore(STORE_RUNS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_ANSWERS)) {
        db.createObjectStore(STORE_ANSWERS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_EVIDENCES)) {
        db.createObjectStore(STORE_EVIDENCES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_NCS)) {
        db.createObjectStore(STORE_NCS, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function idbGetAll<T>(storeName: StoreName): Promise<T[]> {
  const db = await openDb();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  const result = await requestToPromise(store.getAll());
  return result as T[];
}

async function idbGet<T>(storeName: StoreName, key: string): Promise<T | undefined> {
  const db = await openDb();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  const result = await requestToPromise(store.get(key));
  return result as T | undefined;
}

async function idbPut(storeName: StoreName, value: any) {
  const db = await openDb();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);
  await requestToPromise(store.put(value));
}

function readLocalStore<T>(storeName: StoreName): T[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(`${LS_PREFIX}${storeName}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeLocalStore<T>(storeName: StoreName, items: T[]) {
  if (!isBrowser()) return;
  localStorage.setItem(`${LS_PREFIX}${storeName}`, JSON.stringify(items));
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function listStore<T>(storeName: StoreName): Promise<T[]> {
  if (hasIndexedDb()) {
    return idbGetAll<T>(storeName);
  }
  return readLocalStore<T>(storeName);
}

async function putStore<T extends { id: string }>(storeName: StoreName, item: T): Promise<void> {
  if (hasIndexedDb()) {
    await idbPut(storeName, item);
    return;
  }
  const current = readLocalStore<T>(storeName);
  const idx = current.findIndex((value) => value.id === item.id);
  if (idx >= 0) current[idx] = item;
  else current.push(item);
  writeLocalStore(storeName, current);
}

async function getStore<T>(storeName: StoreName, key: string): Promise<T | undefined> {
  if (hasIndexedDb()) {
    return idbGet<T>(storeName, key);
  }
  return readLocalStore<T>(storeName).find((item: any) => item.id === key);
}

async function normalizeEvidence(evidence: StoredEvidence): Promise<Evidence> {
  if (evidence.blob) {
    return evidence as Evidence;
  }
  if (evidence.dataUrl) {
    const blob = await dataUrlToBlob(evidence.dataUrl);
    return { ...evidence, blob } as Evidence;
  }
  return { ...evidence, blob: new Blob() } as Evidence;
}

export function createLocalSstInspectionsProvider(): SstInspectionsProvider {
  return {
    async listTemplates(filters) {
      const templates = await listStore<ChecklistTemplate>(STORE_TEMPLATES);
      return templates.filter((template) => {
        if (filters?.projectId && template.projectId !== filters.projectId) return false;
        if (filters?.type && template.type !== filters.type) return false;
        if (typeof filters?.active === "boolean" && template.isActive !== filters.active) return false;
        if (filters?.q) {
          const query = filters.q.toLowerCase();
          if (!template.name.toLowerCase().includes(query)) return false;
        }
        return true;
      });
    },

    async getTemplate(id) {
      const template = await getStore<ChecklistTemplate>(STORE_TEMPLATES, id);
      return template ?? null;
    },

    async upsertTemplate(input: UpsertTemplateInput) {
      const now = nowIso();
      const id = input.id ?? createId();
      const existing = input.id ? await getStore<ChecklistTemplate>(STORE_TEMPLATES, id) : undefined;
      const questions = input.questions.map((question, index) => ({
        id: question.id ?? createId(),
        templateId: id,
        order: question.order ?? index + 1,
        text: question.text,
        helpText: question.helpText ?? null,
        severity: question.severity,
        requiresPhotoOnFail: question.requiresPhotoOnFail,
        autoCreateNc: question.autoCreateNc
      }));
      const template: ChecklistTemplate = {
        id,
        name: input.name,
        type: input.type,
        periodicityDays: input.periodicityDays ?? null,
        isActive: input.isActive ?? true,
        projectId: input.projectId ?? null,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        questions
      };
      await putStore(STORE_TEMPLATES, template);
      return template;
    },

    async deleteTemplate(id) {
      const template = await getStore<ChecklistTemplate>(STORE_TEMPLATES, id);
      if (!template) return;
      const updated = { ...template, isActive: false, updatedAt: nowIso() };
      await putStore(STORE_TEMPLATES, updated);
    },

    async seedTemplatesIfEmpty() {
      const current = await listStore<ChecklistTemplate>(STORE_TEMPLATES);
      if (current.length > 0) {
        return { seeded: false, count: 0 };
      }
      const seeds = buildSeedTemplates();
      for (const template of seeds) {
        await putStore(STORE_TEMPLATES, template);
      }
      return { seeded: true, count: seedTemplatesCount };
    },

    async startRun(input) {
      const template = await getStore<ChecklistTemplate>(STORE_TEMPLATES, input.templateId);
      if (!template) {
        throw new Error("Template nao encontrado");
      }
      const run: InspectionRun = {
        id: createId(),
        templateId: input.templateId,
        projectId: input.projectId,
        worksiteId: input.worksiteId ?? null,
        inspectorId: input.inspectorId,
        startedAt: nowIso(),
        finishedAt: null,
        score: 0,
        status: InspectionStatus.OK,
        notes: null
      };
      await putStore(STORE_RUNS, run);
      return run;
    },

    async saveAnswer(input) {
      const run = await getStore<InspectionRun>(STORE_RUNS, input.runId);
      if (!run) throw new Error("Inspecao nao encontrada");
      const template = await getStore<ChecklistTemplate>(STORE_TEMPLATES, run.templateId);
      const question = template?.questions.find((item) => item.id === input.questionId);
      if (!question) throw new Error("Pergunta nao encontrada");
      const allAnswers = await listStore<InspectionAnswer>(STORE_ANSWERS);
      const existing = allAnswers.find(
        (answer) => answer.runId === input.runId && answer.questionId === input.questionId
      );
      const answer: InspectionAnswer = {
        id: existing?.id ?? createId(),
        runId: input.runId,
        questionId: input.questionId,
        answer: input.answer,
        notes: input.notes ?? existing?.notes ?? null,
        severitySnapshot: question.severity,
        createdAt: existing?.createdAt ?? nowIso()
      };
      await putStore(STORE_ANSWERS, answer);
      return answer;
    },

    async attachEvidence(input) {
      const base: StoredEvidence = {
        id: createId(),
        ownerType: input.ownerType,
        ownerId: input.ownerId,
        fileName: input.file.name,
        fileType: input.file.type || "application/octet-stream",
        caption: input.caption ?? null,
        metadata: input.metadata ?? null,
        createdBy: "local",
        createdAt: nowIso()
      };

      if (hasIndexedDb()) {
        const evidence: StoredEvidence = { ...base, blob: input.file };
        await putStore(STORE_EVIDENCES, evidence);
        return normalizeEvidence(evidence);
      }

      const dataUrl = await fileToDataUrl(input.file);
      const evidence: StoredEvidence = { ...base, dataUrl };
      await putStore(STORE_EVIDENCES, evidence);
      return normalizeEvidence(evidence);
    },

    async listEvidences(input) {
      const evidences = await listStore<StoredEvidence>(STORE_EVIDENCES);
      const filtered = evidences.filter(
        (evidence) => evidence.ownerType === input.ownerType && evidence.ownerId === input.ownerId
      );
      const resolved = await Promise.all(filtered.map((evidence) => normalizeEvidence(evidence)));
      return resolved;
    },

    async finishRun(input) {
      const run = await getStore<InspectionRun>(STORE_RUNS, input.runId);
      if (!run) throw new Error("Inspecao nao encontrada");
      const answers = await listStore<InspectionAnswer>(STORE_ANSWERS);
      const runAnswers = answers.filter((answer) => answer.runId === input.runId);
      const score = calculateScore(runAnswers);
      const status = calculateStatus(runAnswers);
      const updated: InspectionRun = {
        ...run,
        score,
        status,
        notes: input.notes ?? run.notes ?? null,
        finishedAt: nowIso()
      };
      await putStore(STORE_RUNS, updated);
      return updated;
    },

    async generateNcsFromRun(input) {
      const run = await getStore<InspectionRun>(STORE_RUNS, input.runId);
      if (!run) throw new Error("Inspecao nao encontrada");
      const template = await getStore<ChecklistTemplate>(STORE_TEMPLATES, run.templateId);
      if (!template) throw new Error("Template nao encontrado");
      const answers = await listStore<InspectionAnswer>(STORE_ANSWERS);
      const runAnswers = answers.filter((answer) => answer.runId === input.runId);
      const newNcs = buildNonConformitiesForRun({
        run,
        template,
        answers: runAnswers,
        includeSeverities: input.includeSeverities,
        mode: input.mode
      }).map((nc) => ({ ...nc, id: createId() }));

      for (const nc of newNcs) {
        await putStore(STORE_NCS, nc);
      }
      return newNcs;
    },

    async listNcs(filters) {
      const ncs = await listStore<NonConformity>(STORE_NCS);
      return ncs.filter((nc) => {
        if (filters?.projectId && nc.projectId !== filters.projectId) return false;
        if (filters?.status && nc.status !== filters.status) return false;
        if (filters?.severity && nc.severity !== filters.severity) return false;
        if (filters?.q) {
          const query = filters.q.toLowerCase();
          if (!nc.title.toLowerCase().includes(query) && !nc.description.toLowerCase().includes(query)) {
            return false;
          }
        }
        return true;
      });
    },

    async listRuns(filters) {
      const runs = await listStore<InspectionRun>(STORE_RUNS);
      const templates = await listStore<ChecklistTemplate>(STORE_TEMPLATES);
      const answers = await listStore<InspectionAnswer>(STORE_ANSWERS);

      const fromDate = filters?.from ? new Date(filters.from) : null;
      const toDate = filters?.to ? new Date(filters.to) : null;

      const filteredRuns = runs.filter((run) => {
        if (filters?.projectId && run.projectId !== filters.projectId) return false;
        if (filters?.templateId && run.templateId !== filters.templateId) return false;
        if (filters?.status && run.status !== filters.status) return false;
        if (fromDate && new Date(run.startedAt) < fromDate) return false;
        if (toDate && new Date(run.startedAt) > toDate) return false;
        return true;
      });

      const summaries = filteredRuns.map((run) => {
        const template = templates.find((item) => item.id === run.templateId);
        const runAnswers = answers.filter((answer) => answer.runId === run.id);
        const failCount = runAnswers.filter((answer) => answer.answer === AnswerValue.FAIL).length;
        const criticalFailCount = runAnswers.filter(
          (answer) => answer.answer === AnswerValue.FAIL && answer.severitySnapshot === Severity.CRITICAL
        ).length;
        const summary: InspectionRunSummary = {
          id: run.id,
          startedAt: run.startedAt,
          finishedAt: run.finishedAt ?? null,
          projectId: run.projectId,
          worksiteId: run.worksiteId ?? null,
          templateId: run.templateId,
          templateName: template?.name ?? "Template",
          inspectorId: run.inspectorId,
          score: run.score,
          status: run.status,
          failCount,
          criticalFailCount
        };
        return summary;
      });

      if (filters?.q) {
        const query = filters.q.toLowerCase();
        return summaries.filter((summary) => summary.templateName.toLowerCase().includes(query));
      }

      return summaries;
    },

    async getRunDetails(runId) {
      const run = await getStore<InspectionRun>(STORE_RUNS, runId);
      if (!run) return null;
      const template = await getStore<ChecklistTemplate>(STORE_TEMPLATES, run.templateId);
      if (!template) return null;
      const answers = await listStore<InspectionAnswer>(STORE_ANSWERS);
      const runAnswers = answers.filter((answer) => answer.runId === run.id);
      const evidences = await listStore<StoredEvidence>(STORE_EVIDENCES);
      const runEvidencesRaw = evidences.filter(
        (evidence) => evidence.ownerType === EvidenceOwnerType.INSPECTION_RUN && evidence.ownerId === run.id
      );
      const answersEvidencesRaw = evidences.filter(
        (evidence) => evidence.ownerType === EvidenceOwnerType.INSPECTION_ANSWER
      );
      const evidencesByAnswerId: Record<string, Evidence[]> = {};
      for (const evidence of answersEvidencesRaw) {
        if (!runAnswers.some((answer) => answer.id === evidence.ownerId)) continue;
        const resolved = await normalizeEvidence(evidence);
        evidencesByAnswerId[evidence.ownerId] = evidencesByAnswerId[evidence.ownerId] || [];
        evidencesByAnswerId[evidence.ownerId].push(resolved);
      }
      const runEvidences = await Promise.all(runEvidencesRaw.map((item) => normalizeEvidence(item)));
      const ncs = await listStore<NonConformity>(STORE_NCS);
      const runNcs = ncs.filter((nc) => nc.sourceId === run.id);

      const details: InspectionRunDetails = {
        ...run,
        template,
        answers: runAnswers,
        evidencesByAnswerId,
        runEvidences,
        failStats: buildFailStats(runAnswers),
        ncs: runNcs
      };
      return details;
    }
  };
}

export const sstInspectionsProvider = createLocalSstInspectionsProvider();
