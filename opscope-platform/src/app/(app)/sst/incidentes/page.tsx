"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface Incident {
  id: string;
  severity: string;
  status: string;
  description: string;
  date: string;
  category: string;
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

interface UserOption {
  id: string;
  name: string;
}

export default function IncidentesPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<Incident[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [investigationOpen, setInvestigationOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    projectId: "",
    worksiteId: "",
    date: new Date().toISOString().slice(0, 10),
    severity: "MEDIA",
    description: "",
    category: "Quase acidente",
    involvedUserIds: [] as string[],
    photos: ""
  });

  const [investigation, setInvestigation] = useState({
    fiveWhys: ["", "", "", "", ""],
    rootCause: "",
    immediateActions: "",
    correctiveActions: "",
    preventiveActions: "",
    effectivenessCheck: ""
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/sst/incidents?pageSize=100", token),
      apiFetch("/api/core/projects?pageSize=100", token),
      apiFetch("/api/core/worksites?pageSize=200", token),
      apiFetch("/api/core/users?pageSize=200", token)
    ])
      .then(([incidentResponse, projectResponse, worksiteResponse, userResponse]) => {
        setRows(incidentResponse.data.items);
        setProjects(projectResponse.data.items);
        setWorksites(worksiteResponse.data.items);
        setUsers(userResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async () => {
    try {
      await apiFetch("/api/sst/incidents", token, {
        method: "POST",
        body: JSON.stringify({
          projectId: form.projectId,
          worksiteId: form.worksiteId || null,
          date: new Date(form.date).toISOString(),
          severity: form.severity,
          description: form.description,
          category: form.category,
          involvedUserIds: form.involvedUserIds,
          photos: form.photos ? form.photos.split(",").map((item) => item.trim()) : null
        })
      });
      push("Incidente registrado", "success");
      setOpen(false);
      setStep(1);
      setForm({
        projectId: "",
        worksiteId: "",
        date: form.date,
        severity: "MEDIA",
        description: "",
        category: "Quase acidente",
        involvedUserIds: [],
        photos: ""
      });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao registrar", "error");
    }
  };

  const openInvestigation = (incident: Incident) => {
    setSelectedIncident(incident);
    setInvestigationOpen(true);
  };

  const handleInvestigation = async () => {
    if (!selectedIncident) return;
    try {
      await apiFetch(`/api/sst/incidents/${selectedIncident.id}`, token, {
        method: "PUT",
        body: JSON.stringify({
          status: "INVESTIGACAO",
          investigation: {
            fiveWhys: investigation.fiveWhys,
            rootCause: investigation.rootCause,
            immediateActions: investigation.immediateActions.split(";").map((item) => item.trim()).filter(Boolean),
            correctiveActions: investigation.correctiveActions.split(";").map((item) => item.trim()).filter(Boolean),
            preventiveActions: investigation.preventiveActions.split(";").map((item) => item.trim()).filter(Boolean),
            effectivenessCheck: investigation.effectivenessCheck
          }
        })
      });
      push("Investigacao registrada", "success");
      setInvestigationOpen(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao atualizar", "error");
    }
  };

  const filteredWorksites = worksites.filter((worksite) => !form.projectId || worksite.projectId === form.projectId);

  return (
    <div className="space-y-6">
      <Header title="Incidentes" subtitle="Registro, investigacao e acoes" />
      <div className="flex justify-between">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
          Novo incidente
        </button>
        <div className="flex gap-2">
          <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/sst/incidents?format=csv">
            Exportar CSV
          </a>
          <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/sst/incidents?format=pdf">
            Exportar PDF
          </a>
        </div>
      </div>
      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem incidentes"
        columns={[
          { key: "category", label: "Categoria" },
          { key: "severity", label: "Severidade" },
          { key: "status", label: "Status" },
          { key: "project", label: "Projeto", render: (row) => row.project?.name ?? "-" },
          {
            key: "date",
            label: "Data",
            render: (row) => new Date(row.date).toLocaleDateString("pt-BR")
          }
        ]}
        actions={(row) => (
          <button className="text-xs text-primary" onClick={() => openInvestigation(row)}>
            Investigar
          </button>
        )}
      />

      <ModalForm
        open={open}
        title="Registrar incidente"
        onClose={() => setOpen(false)}
        footer={
          <>
            {step > 1 ? (
              <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setStep(step - 1)}>
                Voltar
              </button>
            ) : null}
            {step < 2 ? (
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setStep(step + 1)}>
                Proximo
              </button>
            ) : (
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreate}>
                Salvar
              </button>
            )}
          </>
        }
      >
        {step === 1 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase text-muted">Projeto</label>
              <select className="select mt-2" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
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
              <select className="select mt-2" value={form.worksiteId} onChange={(e) => setForm({ ...form, worksiteId: e.target.value })}>
                <option value="">Opcional</option>
                {filteredWorksites.map((worksite) => (
                  <option key={worksite.id} value={worksite.id}>
                    {worksite.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Data</label>
              <input className="input mt-2" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Severidade</label>
              <select className="select mt-2" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                <option value="BAIXA">BAIXA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
                <option value="CRITICA">CRITICA</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Categoria</label>
              <input className="input mt-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase text-muted">Descricao</label>
              <textarea className="input mt-2 h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase text-muted">Envolvidos</label>
              <select
                multiple
                className="select mt-2 h-32"
                value={form.involvedUserIds}
                onChange={(e) =>
                  setForm({
                    ...form,
                    involvedUserIds: Array.from(e.target.selectedOptions).map((option) => option.value)
                  })
                }
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Fotos (URLs separadas por virgula)</label>
              <input className="input mt-2" value={form.photos} onChange={(e) => setForm({ ...form, photos: e.target.value })} />
            </div>
          </div>
        )}
      </ModalForm>

      <ModalForm
        open={investigationOpen}
        title="Investigacao (5 porques)"
        onClose={() => setInvestigationOpen(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setInvestigationOpen(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleInvestigation}>
              Salvar investigacao
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {investigation.fiveWhys.map((value, index) => (
            <div key={`why-${index}`}>
              <label className="text-xs uppercase text-muted">Por que {index + 1}</label>
              <input
                className="input mt-2"
                value={value}
                onChange={(e) => {
                  const updated = [...investigation.fiveWhys];
                  updated[index] = e.target.value;
                  setInvestigation({ ...investigation, fiveWhys: updated });
                }}
              />
            </div>
          ))}
          <div>
            <label className="text-xs uppercase text-muted">Causa raiz</label>
            <input className="input mt-2" value={investigation.rootCause} onChange={(e) => setInvestigation({ ...investigation, rootCause: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Acoes imediatas (sep. por ;)</label>
            <input className="input mt-2" value={investigation.immediateActions} onChange={(e) => setInvestigation({ ...investigation, immediateActions: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Acoes corretivas (sep. por ;)</label>
            <input className="input mt-2" value={investigation.correctiveActions} onChange={(e) => setInvestigation({ ...investigation, correctiveActions: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Acoes preventivas (sep. por ;)</label>
            <input className="input mt-2" value={investigation.preventiveActions} onChange={(e) => setInvestigation({ ...investigation, preventiveActions: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Verificacao de eficacia</label>
            <input className="input mt-2" value={investigation.effectivenessCheck} onChange={(e) => setInvestigation({ ...investigation, effectivenessCheck: e.target.value })} />
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
