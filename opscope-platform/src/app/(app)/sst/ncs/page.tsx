"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface NonConformity {
  id: string;
  title?: string | null;
  description: string;
  severity: string;
  status: string;
  dueDate: string;
  project?: { name: string } | null;
  responsible?: { name: string } | null;
}

interface ActionPlanItem {
  id: string;
  title: string;
  status: string;
  dueDate: string;
  responsible?: { name: string } | null;
}

interface UserOption {
  id: string;
  name: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

export default function NcsPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<NonConformity[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<NonConformity | null>(null);
  const [actionItems, setActionItems] = useState<ActionPlanItem[]>([]);

  const [form, setForm] = useState({
    projectId: "",
    severity: "MEDIA",
    title: "",
    description: "",
    responsibleId: "",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10)
  });

  const [actionForm, setActionForm] = useState({
    title: "",
    responsibleId: "",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10)
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/sst/nonconformities?pageSize=200", token),
      apiFetch("/api/core/users?pageSize=200", token),
      apiFetch("/api/core/projects?pageSize=200", token)
    ])
      .then(([ncResponse, userResponse, projectResponse]) => {
        setRows(ncResponse.data.items);
        setUsers(userResponse.data.items);
        setProjects(projectResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const loadActionItems = async (ncId: string) => {
    const response = await apiFetch(`/api/sst/action-plan-items?nonConformityId=${ncId}&pageSize=200`, token);
    setActionItems(response.data.items);
  };

  const handleCreate = async () => {
    try {
      await apiFetch("/api/sst/nonconformities", token, {
        method: "POST",
        body: JSON.stringify({
          originType: "OBSERVACAO",
          projectId: form.projectId || null,
          severity: form.severity,
          title: form.title || null,
          description: form.description,
          responsibleId: form.responsibleId,
          dueDate: new Date(form.dueDate).toISOString(),
          status: "ABERTA"
        })
      });
      push("NC criada", "success");
      setOpen(false);
      setForm({ ...form, title: "", description: "" });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  const handleOpenDetail = async (nc: NonConformity) => {
    setSelected(nc);
    setDetailOpen(true);
    await loadActionItems(nc.id);
  };

  const handleCreateAction = async () => {
    if (!selected) return;
    try {
      await apiFetch("/api/sst/action-plan-items", token, {
        method: "POST",
        body: JSON.stringify({
          nonConformityId: selected.id,
          title: actionForm.title,
          responsibleId: actionForm.responsibleId,
          dueDate: new Date(actionForm.dueDate).toISOString(),
          status: "PENDENTE"
        })
      });
      push("Acao adicionada", "success");
      setActionForm({ ...actionForm, title: "" });
      loadActionItems(selected.id);
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao adicionar", "error");
    }
  };

  const selectedActionItems = useMemo(() => actionItems, [actionItems]);

  return (
    <div className="space-y-6">
      <Header title="Nao conformidades" subtitle="Plano de acao e verificacao" />
      <div className="flex justify-between">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
          Nova NC
        </button>
        <div className="flex gap-2">
          <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/sst/nonconformities?format=csv">
            Exportar CSV
          </a>
          <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/sst/nonconformities?format=pdf">
            Exportar PDF
          </a>
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => row.id}
        emptyMessage="Sem NCs"
        columns={[
          { key: "title", label: "Titulo", render: (row) => row.title || "NC" },
          { key: "severity", label: "Severidade" },
          { key: "status", label: "Status" },
          { key: "project", label: "Projeto", render: (row) => row.project?.name ?? "-" },
          {
            key: "dueDate",
            label: "Prazo",
            render: (row) => new Date(row.dueDate).toLocaleDateString("pt-BR")
          }
        ]}
        onRowClick={handleOpenDetail}
      />

      <ModalForm
        open={open}
        title="Nova NC"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreate}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select className="select mt-2" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              <option value="">Opcional</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
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
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Titulo</label>
            <input className="input mt-2" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Descricao</label>
            <textarea className="input mt-2 h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Responsavel</label>
            <select className="select mt-2" value={form.responsibleId} onChange={(e) => setForm({ ...form, responsibleId: e.target.value })}>
              <option value="">Selecione</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Prazo</label>
            <input className="input mt-2" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
        </div>
      </ModalForm>

      <ModalForm
        open={detailOpen}
        title="Detalhes da NC"
        onClose={() => setDetailOpen(false)}
        footer={
          <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setDetailOpen(false)}>
            Fechar
          </button>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">{selected.title ?? "NC"}</p>
              <p className="text-xs text-muted">{selected.description}</p>
            </div>
            <div className="grid gap-2 md:grid-cols-3 text-xs text-muted">
              <span>Severidade: {selected.severity}</span>
              <span>Status: {selected.status}</span>
              <span>Prazo: {new Date(selected.dueDate).toLocaleDateString("pt-BR")}</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Plano de acao</h4>
              <DataTable
                loading={false}
                rows={selectedActionItems}
                emptyMessage="Sem acoes"
                columns={[
                  { key: "title", label: "Acao" },
                  { key: "status", label: "Status" },
                  { key: "responsible", label: "Responsavel", render: (row) => row.responsible?.name ?? "-" },
                  {
                    key: "dueDate",
                    label: "Prazo",
                    render: (row) => new Date(row.dueDate).toLocaleDateString("pt-BR")
                  }
                ]}
              />
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <input className="input" placeholder="Titulo da acao" value={actionForm.title} onChange={(e) => setActionForm({ ...actionForm, title: e.target.value })} />
                <select className="select" value={actionForm.responsibleId} onChange={(e) => setActionForm({ ...actionForm, responsibleId: e.target.value })}>
                  <option value="">Responsavel</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <input className="input" type="date" value={actionForm.dueDate} onChange={(e) => setActionForm({ ...actionForm, dueDate: e.target.value })} />
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreateAction}>
                  Adicionar acao
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </ModalForm>
    </div>
  );
}
