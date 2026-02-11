"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface AprTemplate {
  id: string;
  name: string;
  activity: string;
}

interface Apr {
  id: string;
  activity: string;
  status: string;
  project?: { name: string };
}

interface Permit {
  id: string;
  type: string;
  status: string;
  validTo: string;
  apr?: { activity: string };
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

interface TrainingOption {
  id: string;
  name: string;
}

interface ItemOption {
  id: string;
  name: string;
}

export default function AprPtPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [templates, setTemplates] = useState<AprTemplate[]>([]);
  const [aprs, setAprs] = useState<Apr[]>([]);
  const [permits, setPermits] = useState<Permit[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [trainings, setTrainings] = useState<TrainingOption[]>([]);
  const [epis, setEpis] = useState<ItemOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [openTemplate, setOpenTemplate] = useState(false);
  const [openApr, setOpenApr] = useState(false);
  const [openPermit, setOpenPermit] = useState(false);

  const [templateForm, setTemplateForm] = useState({
    name: "",
    activity: "",
    hazards: "",
    risks: "",
    controls: "",
    requiredTrainings: [] as string[],
    requiredEpis: [] as string[]
  });

  const [aprForm, setAprForm] = useState({
    projectId: "",
    worksiteId: "",
    templateId: "",
    activity: "",
    hazards: "",
    risks: "",
    controls: "",
    status: "RASCUNHO"
  });

  const [permitForm, setPermitForm] = useState({
    aprId: "",
    type: "ALTURA",
    requirements: "",
    validFrom: new Date().toISOString().slice(0, 10),
    validTo: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10),
    collaboratorIds: [] as string[],
    approverIds: [] as string[]
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/sst/apr-templates?pageSize=200", token),
      apiFetch("/api/sst/aprs?pageSize=200", token),
      apiFetch("/api/sst/permits?pageSize=200", token),
      apiFetch("/api/core/projects?pageSize=100", token),
      apiFetch("/api/core/worksites?pageSize=200", token),
      apiFetch("/api/core/users?pageSize=200", token),
      apiFetch("/api/sst/trainings?pageSize=200", token),
      apiFetch("/api/inventory/items?pageSize=200&type=EPI", token)
    ])
      .then((responses) => {
        setTemplates(responses[0].data.items);
        setAprs(responses[1].data.items);
        setPermits(responses[2].data.items);
        setProjects(responses[3].data.items);
        setWorksites(responses[4].data.items);
        setUsers(responses[5].data.items);
        setTrainings(responses[6].data.items);
        setEpis(responses[7].data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreateTemplate = async () => {
    try {
      await apiFetch("/api/sst/apr-templates", token, {
        method: "POST",
        body: JSON.stringify({
          name: templateForm.name,
          activity: templateForm.activity,
          hazards: templateForm.hazards.split(",").map((item) => item.trim()).filter(Boolean),
          risks: templateForm.risks.split(",").map((item) => item.trim()).filter(Boolean),
          controls: templateForm.controls.split(",").map((item) => item.trim()).filter(Boolean),
          requiredTrainings: templateForm.requiredTrainings,
          requiredEpis: templateForm.requiredEpis
        })
      });
      push("Template criado", "success");
      setOpenTemplate(false);
      setTemplateForm({ name: "", activity: "", hazards: "", risks: "", controls: "", requiredTrainings: [], requiredEpis: [] });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  const handleCreateApr = async () => {
    try {
      await apiFetch("/api/sst/aprs", token, {
        method: "POST",
        body: JSON.stringify({
          projectId: aprForm.projectId,
          worksiteId: aprForm.worksiteId || null,
          templateId: aprForm.templateId || null,
          activity: aprForm.activity,
          hazards: aprForm.hazards.split(",").map((item) => item.trim()).filter(Boolean),
          risks: aprForm.risks.split(",").map((item) => item.trim()).filter(Boolean),
          controls: aprForm.controls.split(",").map((item) => item.trim()).filter(Boolean),
          status: aprForm.status
        })
      });
      push("APR criada", "success");
      setOpenApr(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  const handleCreatePermit = async () => {
    try {
      await apiFetch("/api/sst/permits", token, {
        method: "POST",
        body: JSON.stringify({
          aprId: permitForm.aprId,
          type: permitForm.type,
          requirements: permitForm.requirements.split(",").map((item) => item.trim()).filter(Boolean),
          validFrom: new Date(permitForm.validFrom).toISOString(),
          validTo: new Date(permitForm.validTo).toISOString(),
          status: "ABERTA",
          collaboratorIds: permitForm.collaboratorIds,
          approverIds: permitForm.approverIds
        })
      });
      push("PT criada", "success");
      setOpenPermit(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  const filteredWorksites = useMemo(
    () => worksites.filter((worksite) => !aprForm.projectId || worksite.projectId === aprForm.projectId),
    [worksites, aprForm.projectId]
  );

  return (
    <div className="space-y-6">
      <Header title="APR / PT" subtitle="Templates, analise de risco e permissao de trabalho" />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Templates APR</h3>
            <button className="text-xs text-primary" onClick={() => setOpenTemplate(true)}>
              Novo
            </button>
          </div>
          <div className="mt-4">
            <DataTable
              loading={loading}
              rows={templates}
              emptyMessage="Sem templates"
              columns={[
                { key: "name", label: "Template" },
                { key: "activity", label: "Atividade" }
              ]}
            />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">APRs</h3>
            <button className="text-xs text-primary" onClick={() => setOpenApr(true)}>
              Nova APR
            </button>
          </div>
          <div className="mt-4">
            <DataTable
              loading={loading}
              rows={aprs}
              emptyMessage="Sem APRs"
              columns={[
                { key: "activity", label: "Atividade" },
                { key: "status", label: "Status" },
                { key: "project", label: "Projeto", render: (row) => row.project?.name ?? "-" }
              ]}
            />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Permissoes de Trabalho</h3>
            <button className="text-xs text-primary" onClick={() => setOpenPermit(true)}>
              Nova PT
            </button>
          </div>
          <div className="mt-4">
            <DataTable
              loading={loading}
              rows={permits}
              emptyMessage="Sem PTs"
              columns={[
                { key: "type", label: "Tipo" },
                { key: "status", label: "Status" },
                {
                  key: "validTo",
                  label: "Validade",
                  render: (row) => new Date(row.validTo).toLocaleDateString("pt-BR")
                }
              ]}
            />
          </div>
        </div>
      </div>

      <ModalForm
        open={openTemplate}
        title="Novo template APR"
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
            <label className="text-xs uppercase text-muted">Nome</label>
            <input className="input mt-2" value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Atividade</label>
            <input className="input mt-2" value={templateForm.activity} onChange={(e) => setTemplateForm({ ...templateForm, activity: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Perigos (CSV)</label>
            <input className="input mt-2" value={templateForm.hazards} onChange={(e) => setTemplateForm({ ...templateForm, hazards: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Riscos (CSV)</label>
            <input className="input mt-2" value={templateForm.risks} onChange={(e) => setTemplateForm({ ...templateForm, risks: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Controles (CSV)</label>
            <input className="input mt-2" value={templateForm.controls} onChange={(e) => setTemplateForm({ ...templateForm, controls: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Treinamentos obrigatorios</label>
            <select
              multiple
              className="select mt-2 h-28"
              value={templateForm.requiredTrainings}
              onChange={(e) =>
                setTemplateForm({
                  ...templateForm,
                  requiredTrainings: Array.from(e.target.selectedOptions).map((option) => option.value)
                })
              }
            >
              {trainings.map((training) => (
                <option key={training.id} value={training.id}>
                  {training.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">EPIs obrigatorios</label>
            <select
              multiple
              className="select mt-2 h-28"
              value={templateForm.requiredEpis}
              onChange={(e) =>
                setTemplateForm({
                  ...templateForm,
                  requiredEpis: Array.from(e.target.selectedOptions).map((option) => option.value)
                })
              }
            >
              {epis.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModalForm>

      <ModalForm
        open={openApr}
        title="Nova APR"
        onClose={() => setOpenApr(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenApr(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreateApr}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select className="select mt-2" value={aprForm.projectId} onChange={(e) => setAprForm({ ...aprForm, projectId: e.target.value })}>
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
            <select className="select mt-2" value={aprForm.worksiteId} onChange={(e) => setAprForm({ ...aprForm, worksiteId: e.target.value })}>
              <option value="">Opcional</option>
              {filteredWorksites.map((worksite) => (
                <option key={worksite.id} value={worksite.id}>
                  {worksite.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Template (opcional)</label>
            <select className="select mt-2" value={aprForm.templateId} onChange={(e) => setAprForm({ ...aprForm, templateId: e.target.value })}>
              <option value="">Manual</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Atividade</label>
            <input className="input mt-2" value={aprForm.activity} onChange={(e) => setAprForm({ ...aprForm, activity: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Perigos (CSV)</label>
            <input className="input mt-2" value={aprForm.hazards} onChange={(e) => setAprForm({ ...aprForm, hazards: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Riscos (CSV)</label>
            <input className="input mt-2" value={aprForm.risks} onChange={(e) => setAprForm({ ...aprForm, risks: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Controles (CSV)</label>
            <input className="input mt-2" value={aprForm.controls} onChange={(e) => setAprForm({ ...aprForm, controls: e.target.value })} />
          </div>
        </div>
      </ModalForm>

      <ModalForm
        open={openPermit}
        title="Nova PT"
        onClose={() => setOpenPermit(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenPermit(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreatePermit}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">APR</label>
            <select className="select mt-2" value={permitForm.aprId} onChange={(e) => setPermitForm({ ...permitForm, aprId: e.target.value })}>
              <option value="">Selecione</option>
              {aprs.map((apr) => (
                <option key={apr.id} value={apr.id}>
                  {apr.activity}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Tipo</label>
            <select className="select mt-2" value={permitForm.type} onChange={(e) => setPermitForm({ ...permitForm, type: e.target.value })}>
              <option value="ALTURA">ALTURA</option>
              <option value="QUENTE">QUENTE</option>
              <option value="ESPACO_CONFINADO">ESPACO CONFINADO</option>
              <option value="ELETRICA">ELETRICA</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Valido de</label>
            <input className="input mt-2" type="date" value={permitForm.validFrom} onChange={(e) => setPermitForm({ ...permitForm, validFrom: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Valido ate</label>
            <input className="input mt-2" type="date" value={permitForm.validTo} onChange={(e) => setPermitForm({ ...permitForm, validTo: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Requisitos (CSV)</label>
            <input className="input mt-2" value={permitForm.requirements} onChange={(e) => setPermitForm({ ...permitForm, requirements: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Colaboradores</label>
            <select
              multiple
              className="select mt-2 h-28"
              value={permitForm.collaboratorIds}
              onChange={(e) =>
                setPermitForm({
                  ...permitForm,
                  collaboratorIds: Array.from(e.target.selectedOptions).map((option) => option.value)
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
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Aprovadores</label>
            <select
              multiple
              className="select mt-2 h-28"
              value={permitForm.approverIds}
              onChange={(e) =>
                setPermitForm({
                  ...permitForm,
                  approverIds: Array.from(e.target.selectedOptions).map((option) => option.value)
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
        </div>
      </ModalForm>
    </div>
  );
}
