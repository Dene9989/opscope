"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { TemplatesTable } from "./components/TemplatesTable";
import { TemplateEditorModal } from "./components/TemplateEditorModal";
import { InspectionWizard } from "./components/InspectionWizard";
import { InspectionsHistoryTable } from "./components/InspectionsHistoryTable";
import { InspectionDetailsDrawer } from "./components/InspectionDetailsDrawer";
import {
  ChecklistTemplate,
  InspectionRunDetails,
  InspectionRunSummary,
  InspectionStatus,
  Severity,
  UpsertTemplateInput
} from "./data/sstInspectionsProvider";
import { sstInspectionsProvider } from "./data/localSstInspectionsProvider";

interface ProjectOption {
  id: string;
  name: string;
}

interface WorksiteOption {
  id: string;
  name: string;
  projectId: string;
}

const LOCAL_PROJECTS_KEY = "opscope_local_projects";
const LOCAL_WORKSITES_KEY = "opscope_local_worksites";

const defaultProjects: ProjectOption[] = [
  { id: "proj-001", name: "834 - PARACATU/SOLAI" },
  { id: "proj-002", name: "Projeto Sudeste" },
  { id: "proj-003", name: "Parque Solar Norte" }
];

const defaultWorksites: WorksiteOption[] = [
  { id: "ws-001", name: "Frente A", projectId: "proj-001" },
  { id: "ws-002", name: "Frente B", projectId: "proj-001" },
  { id: "ws-003", name: "Galpao", projectId: "proj-002" }
];

function loadCatalog<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(raw) as T[];
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
}

export default function SstInspecoesPage() {
  const { user } = useAuth();
  const { push } = useToast();
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [runs, setRuns] = useState<InspectionRunSummary[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);

  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ChecklistTemplate | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedWorksiteId, setSelectedWorksiteId] = useState("");

  const [historyFilters, setHistoryFilters] = useState({
    projectId: "",
    templateId: "",
    status: "",
    from: "",
    to: "",
    q: ""
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [runDetails, setRunDetails] = useState<InspectionRunDetails | null>(null);

  const projectMap = useMemo(
    () => Object.fromEntries(projects.map((project) => [project.id, project.name])),
    [projects]
  );
  const worksiteMap = useMemo(
    () => Object.fromEntries(worksites.map((worksite) => [worksite.id, worksite.name])),
    [worksites]
  );

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId]
  );

  const filteredWorksites = worksites.filter(
    (worksite) => !selectedProjectId || worksite.projectId === selectedProjectId
  );

  const loadTemplates = async () => {
    setLoadingTemplates(true);
    const data = await sstInspectionsProvider.listTemplates();
    setTemplates(data);
    setLoadingTemplates(false);
  };

  const loadRuns = async () => {
    setLoadingRuns(true);
    const from = historyFilters.from ? new Date(historyFilters.from).toISOString() : undefined;
    const to = historyFilters.to ? new Date(`${historyFilters.to}T23:59:59`).toISOString() : undefined;
    const data = await sstInspectionsProvider.listRuns({
      projectId: historyFilters.projectId || undefined,
      templateId: historyFilters.templateId || undefined,
      status: (historyFilters.status as InspectionStatus) || undefined,
      from,
      to,
      q: historyFilters.q || undefined
    });
    setRuns(data.sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)));
    setLoadingRuns(false);
  };

  useEffect(() => {
    setProjects(loadCatalog<ProjectOption>(LOCAL_PROJECTS_KEY, defaultProjects));
    setWorksites(loadCatalog<WorksiteOption>(LOCAL_WORKSITES_KEY, defaultWorksites));
  }, []);

  useEffect(() => {
    sstInspectionsProvider.seedTemplatesIfEmpty().then((result) => {
      if (result.seeded) {
        push(`Templates iniciais carregados (${result.count})`, "success");
      }
      loadTemplates();
      loadRuns();
    });
  }, []);

  useEffect(() => {
    loadRuns();
  }, [historyFilters]);

  const handleSaveTemplate = async (input: UpsertTemplateInput) => {
    await sstInspectionsProvider.upsertTemplate(input);
    setTemplateModalOpen(false);
    setEditingTemplate(null);
    await loadTemplates();
  };

  const handleDuplicate = async (template: ChecklistTemplate) => {
    await sstInspectionsProvider.upsertTemplate({
      name: `${template.name} (copia)`,
      type: template.type,
      periodicityDays: template.periodicityDays,
      isActive: true,
      projectId: template.projectId ?? null,
      questions: template.questions.map((question) => ({
        text: question.text,
        helpText: question.helpText ?? "",
        severity: question.severity,
        requiresPhotoOnFail: question.requiresPhotoOnFail,
        autoCreateNc: question.autoCreateNc
      }))
    });
    await loadTemplates();
  };

  const handleToggleActive = async (template: ChecklistTemplate) => {
    await sstInspectionsProvider.upsertTemplate({
      id: template.id,
      name: template.name,
      type: template.type,
      periodicityDays: template.periodicityDays,
      isActive: !template.isActive,
      projectId: template.projectId ?? null,
      questions: template.questions.map((question) => ({
        id: question.id,
        order: question.order,
        text: question.text,
        helpText: question.helpText ?? "",
        severity: question.severity,
        requiresPhotoOnFail: question.requiresPhotoOnFail,
        autoCreateNc: question.autoCreateNc
      }))
    });
    await loadTemplates();
  };

  const handleStartWizard = () => {
    if (!selectedProjectId) {
      push("Selecione um projeto", "error");
      return;
    }
    if (!selectedTemplateId) {
      push("Selecione um template", "error");
      return;
    }
    setWizardOpen(true);
  };

  const handleOpenDetails = async (run: InspectionRunSummary) => {
    const details = await sstInspectionsProvider.getRunDetails(run.id);
    setRunDetails(details);
    setDetailsOpen(true);
  };

  const handleGenerateNcs = async () => {
    if (!runDetails) return;
    await sstInspectionsProvider.generateNcsFromRun({
      runId: runDetails.id,
      includeSeverities: [Severity.HIGH, Severity.CRITICAL],
      mode: "PER_ANSWER"
    });
    const updated = await sstInspectionsProvider.getRunDetails(runDetails.id);
    setRunDetails(updated);
    push("NCs geradas", "success");
  };

  return (
    <div className="space-y-6">
      <Header title="Inspecoes" subtitle="Checklists, execucoes e rastreabilidade" />

      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Executar inspecao</h3>
            <p className="text-sm text-muted">Selecione projeto, local e template.</p>
          </div>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
            onClick={handleStartWizard}
          >
            Iniciar inspecao
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            {projects.length ? (
              <select
                className="select mt-2"
                value={selectedProjectId}
                onChange={(event) => {
                  setSelectedProjectId(event.target.value);
                  setSelectedWorksiteId("");
                }}
              >
                <option value="">Selecione</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="mt-2 h-10 animate-pulse rounded-lg bg-surface" />
            )}
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Local</label>
            {worksites.length ? (
              <select
                className="select mt-2"
                value={selectedWorksiteId}
                onChange={(event) => setSelectedWorksiteId(event.target.value)}
              >
                <option value="">Opcional</option>
                {filteredWorksites.map((worksite) => (
                  <option key={worksite.id} value={worksite.id}>
                    {worksite.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="mt-2 h-10 animate-pulse rounded-lg bg-surface" />
            )}
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Template</label>
            {loadingTemplates ? (
              <div className="mt-2 h-10 animate-pulse rounded-lg bg-surface" />
            ) : (
              <select
                className="select mt-2"
                value={selectedTemplateId}
                onChange={(event) => setSelectedTemplateId(event.target.value)}
              >
                <option value="">Selecione</option>
                {templates.filter((template) => template.isActive).map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Templates de checklist</h3>
            <p className="text-sm text-muted">Crie, edite e ative templates.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-border px-4 py-2 text-sm"
              onClick={async () => {
                const result = await sstInspectionsProvider.seedTemplatesIfEmpty();
                if (result.seeded) push(`Templates iniciais carregados (${result.count})`, "success");
                await loadTemplates();
              }}
            >
              Carregar templates iniciais
            </button>
            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
              onClick={() => {
                setEditingTemplate(null);
                setTemplateModalOpen(true);
              }}
            >
              Novo template
            </button>
          </div>
        </div>

        <TemplatesTable
          templates={templates}
          loading={loadingTemplates}
          onEdit={(template) => {
            setEditingTemplate(template);
            setTemplateModalOpen(true);
          }}
          onDuplicate={handleDuplicate}
          onToggleActive={handleToggleActive}
          onExecute={(template) => {
            setSelectedTemplateId(template.id);
            if (!selectedProjectId) {
              push("Selecione um projeto antes de executar", "error");
              return;
            }
            setWizardOpen(true);
          }}
        />
      </section>

      <section className="card p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Historico de inspecoes</h3>
          <p className="text-sm text-muted">Filtre por projeto, template e periodo.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-6">
          <select
            className="select"
            value={historyFilters.projectId}
            onChange={(event) => setHistoryFilters({ ...historyFilters, projectId: event.target.value })}
          >
            <option value="">Projeto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={historyFilters.templateId}
            onChange={(event) => setHistoryFilters({ ...historyFilters, templateId: event.target.value })}
          >
            <option value="">Template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={historyFilters.status}
            onChange={(event) => setHistoryFilters({ ...historyFilters, status: event.target.value })}
          >
            <option value="">Status</option>
            {Object.values(InspectionStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            className="input"
            type="date"
            value={historyFilters.from}
            onChange={(event) => setHistoryFilters({ ...historyFilters, from: event.target.value })}
          />
          <input
            className="input"
            type="date"
            value={historyFilters.to}
            onChange={(event) => setHistoryFilters({ ...historyFilters, to: event.target.value })}
          />
          <input
            className="input"
            placeholder="Buscar"
            value={historyFilters.q}
            onChange={(event) => setHistoryFilters({ ...historyFilters, q: event.target.value })}
          />
        </div>

        <InspectionsHistoryTable
          runs={runs}
          loading={loadingRuns}
          onDetails={handleOpenDetails}
          projectMap={projectMap}
          worksiteMap={worksiteMap}
        />
      </section>

      <TemplateEditorModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
        initial={editingTemplate}
        projects={projects}
      />

      <InspectionWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        template={selectedTemplate}
        projectId={selectedProjectId}
        worksiteId={selectedWorksiteId}
        inspectorId={user?.id ?? "local-user"}
        provider={sstInspectionsProvider}
        onFinished={() => {
          loadRuns();
        }}
      />

      <InspectionDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        details={runDetails}
        projectMap={projectMap}
        worksiteMap={worksiteMap}
        onGenerateNcs={handleGenerateNcs}
        allowGenerateNcs={!(runDetails?.ncs && runDetails.ncs.length)}
      />
    </div>
  );
}
