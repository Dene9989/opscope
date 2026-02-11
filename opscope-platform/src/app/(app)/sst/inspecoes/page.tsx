"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface TemplateQuestion {
  id: string;
  text: string;
  type: string;
  required: boolean;
  options?: string[];
  requiresPhotoOnFail?: boolean;
}

interface ChecklistTemplate {
  id: string;
  type: string;
  title: string;
  periodicityDays: number;
  questions: TemplateQuestion[];
}

interface InspectionRun {
  id: string;
  status: string;
  performedAt: string;
  template: ChecklistTemplate;
  project?: { name: string };
  worksite?: { name: string };
}

interface ProjectOption {
  id: string;
  name: string;
}

interface WorksiteOption {
  id: string;
  name: string;
  projectId: string;
}

interface AnswerState {
  questionId: string;
  answer?: string | number | boolean;
  ok?: boolean;
  photoUrls?: string[];
  notes?: string;
}

export default function InspecoesPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [runs, setRuns] = useState<InspectionRun[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [openRun, setOpenRun] = useState(false);
  const [runStep, setRunStep] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [runProjectId, setRunProjectId] = useState("");
  const [runWorksiteId, setRunWorksiteId] = useState("");
  const [answers, setAnswers] = useState<AnswerState[]>([]);

  const [templateForm, setTemplateForm] = useState({
    type: "EPI",
    title: "",
    periodicityDays: 7,
    projectId: "",
    worksiteId: "",
    questions: [{ text: "", type: "BOOLEAN", required: true, options: "", requiresPhotoOnFail: false }]
  });

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/sst/inspection-templates?pageSize=100", token),
      apiFetch("/api/sst/inspections?pageSize=100", token),
      apiFetch("/api/core/projects?pageSize=100", token),
      apiFetch("/api/core/worksites?pageSize=200", token)
    ])
      .then(([templateResponse, runResponse, projectResponse, worksiteResponse]) => {
        setTemplates(templateResponse.data.items);
        setRuns(runResponse.data.items);
        setProjects(projectResponse.data.items);
        setWorksites(worksiteResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreateTemplate = async () => {
    try {
      await apiFetch("/api/sst/inspection-templates", token, {
        method: "POST",
        body: JSON.stringify({
          type: templateForm.type,
          title: templateForm.title,
          periodicityDays: Number(templateForm.periodicityDays),
          projectId: templateForm.projectId || null,
          worksiteId: templateForm.worksiteId || null,
          questions: templateForm.questions.map((q) => ({
            text: q.text,
            type: q.type,
            required: q.required,
            options: q.options ? q.options.split(",").map((item) => item.trim()) : null,
            requiresPhotoOnFail: q.requiresPhotoOnFail
          }))
        })
      });
      push("Checklist criado", "success");
      setOpenTemplate(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  const openRunWizard = (templateId?: string) => {
    setSelectedTemplateId(templateId || "");
    setRunProjectId("");
    setRunWorksiteId("");
    setAnswers([]);
    setRunStep(templateId ? 2 : 1);
    setOpenRun(true);
  };

  const handleAnswerChange = (questionId: string, payload: Partial<AnswerState>) => {
    setAnswers((current) => {
      const existing = current.find((item) => item.questionId === questionId);
      if (!existing) {
        return [...current, { questionId, ...payload }];
      }
      return current.map((item) => (item.questionId === questionId ? { ...item, ...payload } : item));
    });
  };

  const handleSubmitRun = async () => {
    if (!selectedTemplate) {
      push("Selecione um checklist", "error");
      return;
    }
    if (!runProjectId) {
      push("Selecione um projeto", "error");
      return;
    }

    const questionMap = new Map(selectedTemplate.questions.map((q) => [q.id, q]));
    const resolvedAnswers = selectedTemplate.questions.map((question) => {
      const answer = answers.find((item) => item.questionId === question.id);
      return {
        questionId: question.id,
        answer: answer?.answer ?? null,
        ok: answer?.ok ?? null,
        notes: answer?.notes ?? null,
        photoUrls: answer?.photoUrls ?? []
      };
    });

    const anyFail = resolvedAnswers.some((answer) => answer.ok === false);
    const missingPhoto = resolvedAnswers.some((answer) => {
      const question = questionMap.get(answer.questionId);
      if (!question?.requiresPhotoOnFail) return false;
      return answer.ok === false && (!answer.photoUrls || answer.photoUrls.length === 0);
    });

    if (missingPhoto) {
      push("Foto obrigatoria para nao conformes", "error");
      return;
    }

    try {
      await apiFetch("/api/sst/inspections", token, {
        method: "POST",
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          projectId: runProjectId,
          worksiteId: runWorksiteId || null,
          performedAt: new Date().toISOString(),
          status: anyFail ? "NAO_CONFORME" : "OK",
          answers: resolvedAnswers,
          evidenceUrls: resolvedAnswers.flatMap((answer) => answer.photoUrls || [])
        })
      });
      push("Inspecao registrada", "success");
      setOpenRun(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao registrar", "error");
    }
  };

  const filteredWorksites = worksites.filter((worksite) => !runProjectId || worksite.projectId === runProjectId);

  return (
    <div className="space-y-6">
      <Header title="Inspecoes" subtitle="Checklists e execucao" />
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpenTemplate(true)}>
          Novo checklist
        </button>
        <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => openRunWizard()}>
          Executar inspecao
        </button>
        <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/sst/inspections?format=csv">
          Exportar CSV
        </a>
        <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/sst/inspections?format=pdf">
          Exportar PDF
        </a>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Checklists</h3>
          <div className="mt-4">
            <DataTable
              loading={loading}
              rows={templates}
              emptyMessage="Sem checklists"
              columns={[
                { key: "title", label: "Titulo" },
                { key: "type", label: "Tipo" },
                { key: "periodicityDays", label: "Periodicidade" }
              ]}
              actions={(row) => (
                <button className="text-xs text-primary" onClick={() => openRunWizard(row.id)}>
                  Executar
                </button>
              )}
            />
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Inspecoes recentes</h3>
          <div className="mt-4">
            <DataTable
              loading={loading}
              rows={runs}
              emptyMessage="Sem inspecoes"
              columns={[
                { key: "template", label: "Checklist", render: (row) => row.template?.title ?? "-" },
                { key: "status", label: "Status" },
                { key: "project", label: "Projeto", render: (row) => row.project?.name ?? "-" },
                {
                  key: "performedAt",
                  label: "Data",
                  render: (row) => new Date(row.performedAt).toLocaleDateString("pt-BR")
                }
              ]}
            />
          </div>
        </div>
      </div>

      <ModalForm
        open={openTemplate}
        title="Novo checklist"
        onClose={() => setOpenTemplate(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenTemplate(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreateTemplate}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase text-muted">Tipo</label>
            <input className="input mt-2" value={templateForm.type} onChange={(e) => setTemplateForm({ ...templateForm, type: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Periodicidade (dias)</label>
            <input className="input mt-2" type="number" value={templateForm.periodicityDays} onChange={(e) => setTemplateForm({ ...templateForm, periodicityDays: Number(e.target.value) })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Titulo</label>
            <input className="input mt-2" value={templateForm.title} onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select className="select mt-2" value={templateForm.projectId} onChange={(e) => setTemplateForm({ ...templateForm, projectId: e.target.value })}>
              <option value="">Opcional</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Local</label>
            <select className="select mt-2" value={templateForm.worksiteId} onChange={(e) => setTemplateForm({ ...templateForm, worksiteId: e.target.value })}>
              <option value="">Opcional</option>
              {worksites.map((worksite) => (
                <option key={worksite.id} value={worksite.id}>
                  {worksite.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold">Perguntas</p>
          {templateForm.questions.map((question, index) => (
            <div key={`q-${index}`} className="rounded-lg border border-border p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-xs uppercase text-muted">Pergunta</label>
                  <input
                    className="input mt-2"
                    value={question.text}
                    onChange={(e) => {
                      const updated = [...templateForm.questions];
                      updated[index].text = e.target.value;
                      setTemplateForm({ ...templateForm, questions: updated });
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase text-muted">Tipo</label>
                  <select
                    className="select mt-2"
                    value={question.type}
                    onChange={(e) => {
                      const updated = [...templateForm.questions];
                      updated[index].type = e.target.value;
                      setTemplateForm({ ...templateForm, questions: updated });
                    }}
                  >
                    <option value="BOOLEAN">SIM/NAO</option>
                    <option value="TEXT">Texto</option>
                    <option value="SCORE">Score</option>
                    <option value="SELECT">Lista</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase text-muted">Opcoes (CSV)</label>
                  <input
                    className="input mt-2"
                    value={question.options}
                    onChange={(e) => {
                      const updated = [...templateForm.questions];
                      updated[index].options = e.target.value;
                      setTemplateForm({ ...templateForm, questions: updated });
                    }}
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => {
                      const updated = [...templateForm.questions];
                      updated[index].required = e.target.checked;
                      setTemplateForm({ ...templateForm, questions: updated });
                    }}
                  />
                  Obrigatorio
                </label>
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={question.requiresPhotoOnFail}
                    onChange={(e) => {
                      const updated = [...templateForm.questions];
                      updated[index].requiresPhotoOnFail = e.target.checked;
                      setTemplateForm({ ...templateForm, questions: updated });
                    }}
                  />
                  Foto obrigatoria se nao conforme
                </label>
              </div>
            </div>
          ))}
          <button
            className="rounded-lg border border-border px-3 py-2 text-xs"
            onClick={() =>
              setTemplateForm({
                ...templateForm,
                questions: [...templateForm.questions, { text: "", type: "BOOLEAN", required: true, options: "", requiresPhotoOnFail: false }]
              })
            }
          >
            Adicionar pergunta
          </button>
        </div>
      </ModalForm>

      <ModalForm
        open={openRun}
        title="Executar inspecao"
        onClose={() => setOpenRun(false)}
        footer={
          <>
            {runStep > 1 ? (
              <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setRunStep(runStep - 1)}>
                Voltar
              </button>
            ) : null}
            {runStep < 2 ? (
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setRunStep(2)}>
                Proximo
              </button>
            ) : (
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleSubmitRun}>
                Concluir
              </button>
            )}
          </>
        }
      >
        {runStep === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs uppercase text-muted">Checklist</label>
              <select className="select mt-2" value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
                <option value="">Selecione</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Projeto</label>
              <select className="select mt-2" value={runProjectId} onChange={(e) => setRunProjectId(e.target.value)}>
                <option value="">Selecione</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Local</label>
              <select className="select mt-2" value={runWorksiteId} onChange={(e) => setRunWorksiteId(e.target.value)}>
                <option value="">Opcional</option>
                {filteredWorksites.map((worksite) => (
                  <option key={worksite.id} value={worksite.id}>
                    {worksite.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {!selectedTemplate ? (
              <p className="text-sm text-muted">Selecione um checklist.</p>
            ) : (
              selectedTemplate.questions.map((question) => {
                const current = answers.find((item) => item.questionId === question.id);
                return (
                  <div key={question.id} className="rounded-lg border border-border p-3">
                    <p className="text-sm font-semibold">{question.text}</p>
                    {question.type === "BOOLEAN" ? (
                      <select
                        className="select mt-2"
                        value={String(current?.ok ?? "")}
                        onChange={(e) => handleAnswerChange(question.id, { ok: e.target.value === "true" })}
                      >
                        <option value="">Selecione</option>
                        <option value="true">Conforme</option>
                        <option value="false">Nao conforme</option>
                      </select>
                    ) : null}
                    {question.type === "TEXT" ? (
                      <textarea
                        className="input mt-2 h-20"
                        value={String(current?.answer ?? "")}
                        onChange={(e) => handleAnswerChange(question.id, { answer: e.target.value })}
                      />
                    ) : null}
                    {question.type === "SCORE" ? (
                      <input
                        className="input mt-2"
                        type="number"
                        value={String(current?.score ?? "")}
                        onChange={(e) => handleAnswerChange(question.id, { score: Number(e.target.value) })}
                      />
                    ) : null}
                    {question.type === "SELECT" ? (
                      <select
                        className="select mt-2"
                        value={String(current?.answer ?? "")}
                        onChange={(e) => handleAnswerChange(question.id, { answer: e.target.value })}
                      >
                        <option value="">Selecione</option>
                        {(question.options || []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : null}
                    {question.requiresPhotoOnFail && current?.ok === false ? (
                      <div className="mt-2">
                        <label className="text-xs uppercase text-muted">Foto (URL)</label>
                        <input
                          className="input mt-2"
                          value={(current.photoUrls && current.photoUrls[0]) || ""}
                          onChange={(e) => handleAnswerChange(question.id, { photoUrls: [e.target.value] })}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        )}
      </ModalForm>
    </div>
  );
}
