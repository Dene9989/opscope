"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface Training {
  id: string;
  name: string;
  nr?: string | null;
  hours: number;
  validityDays: number;
}

interface TrainingRecord {
  id: string;
  training: { name: string };
  user: { name: string };
  date: string;
  validUntil: string;
  status: string;
}

interface TrainingRequirement {
  id: string;
  role: string;
  training: { name: string };
  project?: { name: string } | null;
  mandatory: boolean;
}

interface UserOption {
  id: string;
  name: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

export default function TreinamentosPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [tab, setTab] = useState<"catalogo" | "registros">("catalogo");
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [requirements, setRequirements] = useState<TrainingRequirement[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [openTraining, setOpenTraining] = useState(false);
  const [openRecord, setOpenRecord] = useState(false);
  const [openRequirement, setOpenRequirement] = useState(false);

  const [trainingForm, setTrainingForm] = useState({ name: "", nr: "", hours: 8, validityDays: 365 });
  const [recordForm, setRecordForm] = useState({
    trainingId: "",
    userId: "",
    date: new Date().toISOString().slice(0, 10),
    validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
    status: "VALIDO",
    certificateUrl: "",
    projectId: ""
  });
  const [requirementForm, setRequirementForm] = useState({
    trainingId: "",
    role: "COLABORADOR",
    projectId: "",
    mandatory: true
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/sst/trainings?pageSize=200", token),
      apiFetch("/api/sst/training-records?pageSize=200", token),
      apiFetch("/api/sst/training-requirements?pageSize=200", token),
      apiFetch("/api/core/users?pageSize=200", token),
      apiFetch("/api/core/projects?pageSize=200", token)
    ])
      .then(([trainingResponse, recordResponse, requirementResponse, userResponse, projectResponse]) => {
        setTrainings(trainingResponse.data.items);
        setRecords(recordResponse.data.items);
        setRequirements(requirementResponse.data.items);
        setUsers(userResponse.data.items);
        setProjects(projectResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreateTraining = async () => {
    try {
      await apiFetch("/api/sst/trainings", token, {
        method: "POST",
        body: JSON.stringify({
          name: trainingForm.name,
          nr: trainingForm.nr || null,
          hours: Number(trainingForm.hours),
          validityDays: Number(trainingForm.validityDays)
        })
      });
      push("Treinamento criado", "success");
      setOpenTraining(false);
      setTrainingForm({ name: "", nr: "", hours: 8, validityDays: 365 });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  const handleCreateRecord = async () => {
    try {
      await apiFetch("/api/sst/training-records", token, {
        method: "POST",
        body: JSON.stringify({
          trainingId: recordForm.trainingId,
          userId: recordForm.userId,
          date: new Date(recordForm.date).toISOString(),
          validUntil: new Date(recordForm.validUntil).toISOString(),
          status: recordForm.status,
          certificateUrl: recordForm.certificateUrl || null,
          projectId: recordForm.projectId || null
        })
      });
      push("Registro criado", "success");
      setOpenRecord(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  const handleCreateRequirement = async () => {
    try {
      await apiFetch("/api/sst/training-requirements", token, {
        method: "POST",
        body: JSON.stringify({
          trainingId: requirementForm.trainingId,
          role: requirementForm.role,
          projectId: requirementForm.projectId || null,
          mandatory: requirementForm.mandatory
        })
      });
      push("Requisito criado", "success");
      setOpenRequirement(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Treinamentos" subtitle="Catalogo e registros por colaborador" />

      <div className="flex flex-wrap gap-3">
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            tab === "catalogo" ? "bg-primary text-black" : "border border-border text-muted"
          }`}
          onClick={() => setTab("catalogo")}
        >
          Catalogo
        </button>
        <button
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${
            tab === "registros" ? "bg-primary text-black" : "border border-border text-muted"
          }`}
          onClick={() => setTab("registros")}
        >
          Registros
        </button>
      </div>

      {tab === "catalogo" ? (
        <>
          <div className="flex justify-between">
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpenTraining(true)}>
              Novo treinamento
            </button>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenRequirement(true)}>
              Definir requisitos
            </button>
          </div>
          <DataTable
            loading={loading}
            rows={trainings}
            emptyMessage="Sem treinamentos"
            columns={[
              { key: "name", label: "Treinamento" },
              { key: "nr", label: "NR", render: (row) => row.nr || "-" },
              { key: "hours", label: "Carga" },
              { key: "validityDays", label: "Validade (dias)" }
            ]}
          />
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Requisitos por funcao</h3>
            <div className="mt-4">
              <DataTable
                loading={loading}
                rows={requirements}
                emptyMessage="Sem requisitos"
                columns={[
                  { key: "training", label: "Treinamento", render: (row) => row.training?.name ?? "-" },
                  { key: "role", label: "Funcao" },
                  { key: "project", label: "Projeto", render: (row) => row.project?.name ?? "Todos" },
                  { key: "mandatory", label: "Obrigatorio", render: (row) => (row.mandatory ? "Sim" : "Nao") }
                ]}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpenRecord(true)}>
              Registrar treinamento
            </button>
            <div className="flex gap-2">
              <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/sst/training-records?format=csv">
                Exportar CSV
              </a>
              <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/sst/training-records?format=pdf">
                Exportar PDF
              </a>
            </div>
          </div>
          <DataTable
            loading={loading}
            rows={records}
            emptyMessage="Sem registros"
            columns={[
              { key: "training", label: "Treinamento", render: (row) => row.training?.name ?? "-" },
              { key: "user", label: "Colaborador", render: (row) => row.user?.name ?? "-" },
              {
                key: "date",
                label: "Data",
                render: (row) => new Date(row.date).toLocaleDateString("pt-BR")
              },
              {
                key: "validUntil",
                label: "Validade",
                render: (row) => new Date(row.validUntil).toLocaleDateString("pt-BR")
              },
              { key: "status", label: "Status" }
            ]}
          />
        </>
      )}

      <ModalForm
        open={openTraining}
        title="Novo treinamento"
        onClose={() => setOpenTraining(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenTraining(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreateTraining}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Nome</label>
            <input className="input mt-2" value={trainingForm.name} onChange={(e) => setTrainingForm({ ...trainingForm, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">NR</label>
            <input className="input mt-2" value={trainingForm.nr} onChange={(e) => setTrainingForm({ ...trainingForm, nr: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Carga horaria</label>
            <input className="input mt-2" type="number" value={trainingForm.hours} onChange={(e) => setTrainingForm({ ...trainingForm, hours: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Validade (dias)</label>
            <input className="input mt-2" type="number" value={trainingForm.validityDays} onChange={(e) => setTrainingForm({ ...trainingForm, validityDays: Number(e.target.value) })} />
          </div>
        </div>
      </ModalForm>

      <ModalForm
        open={openRecord}
        title="Registrar treinamento"
        onClose={() => setOpenRecord(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenRecord(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreateRecord}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase text-muted">Treinamento</label>
            <select className="select mt-2" value={recordForm.trainingId} onChange={(e) => setRecordForm({ ...recordForm, trainingId: e.target.value })}>
              <option value="">Selecione</option>
              {trainings.map((training) => (
                <option key={training.id} value={training.id}>
                  {training.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Colaborador</label>
            <select className="select mt-2" value={recordForm.userId} onChange={(e) => setRecordForm({ ...recordForm, userId: e.target.value })}>
              <option value="">Selecione</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Data</label>
            <input className="input mt-2" type="date" value={recordForm.date} onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Valido ate</label>
            <input className="input mt-2" type="date" value={recordForm.validUntil} onChange={(e) => setRecordForm({ ...recordForm, validUntil: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Status</label>
            <select className="select mt-2" value={recordForm.status} onChange={(e) => setRecordForm({ ...recordForm, status: e.target.value })}>
              <option value="VALIDO">VALIDO</option>
              <option value="VENCIDO">VENCIDO</option>
              <option value="PENDENTE">PENDENTE</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select className="select mt-2" value={recordForm.projectId} onChange={(e) => setRecordForm({ ...recordForm, projectId: e.target.value })}>
              <option value="">Opcional</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Certificado (URL)</label>
            <input className="input mt-2" value={recordForm.certificateUrl} onChange={(e) => setRecordForm({ ...recordForm, certificateUrl: e.target.value })} />
          </div>
        </div>
      </ModalForm>

      <ModalForm
        open={openRequirement}
        title="Definir requisito por funcao"
        onClose={() => setOpenRequirement(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenRequirement(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreateRequirement}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Treinamento</label>
            <select className="select mt-2" value={requirementForm.trainingId} onChange={(e) => setRequirementForm({ ...requirementForm, trainingId: e.target.value })}>
              <option value="">Selecione</option>
              {trainings.map((training) => (
                <option key={training.id} value={training.id}>
                  {training.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Funcao</label>
            <select className="select mt-2" value={requirementForm.role} onChange={(e) => setRequirementForm({ ...requirementForm, role: e.target.value })}>
              <option value="COLABORADOR">COLABORADOR</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
              <option value="TECNICO_SST">TECNICO SST</option>
              <option value="GESTOR">GESTOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select className="select mt-2" value={requirementForm.projectId} onChange={(e) => setRequirementForm({ ...requirementForm, projectId: e.target.value })}>
              <option value="">Todos</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requirementForm.mandatory}
              onChange={(e) => setRequirementForm({ ...requirementForm, mandatory: e.target.checked })}
            />
            <span className="text-sm">Obrigatorio</span>
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
