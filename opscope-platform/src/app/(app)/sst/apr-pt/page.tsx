"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface Documentation {
  id: string;
  activityName: string;
  status: "PENDENTE" | "APROVADO" | "REPROVADO";
  project?: { name: string } | null;
  worksite?: { name: string } | null;
  responsible?: { name: string } | null;
  reviewer?: { name: string } | null;
  aprReference?: string | null;
  aprFileUrl?: string | null;
  reviewNotes?: string | null;
  correctionInstructions?: string | null;
  createdAt: string;
  attachments: Array<{ id: string; name: string; url: string; type?: string | null }>;
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

export default function AprPtPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<Documentation[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [selected, setSelected] = useState<Documentation | null>(null);

  const [createForm, setCreateForm] = useState({
    activityName: "",
    projectId: "",
    worksiteId: "",
    responsibleId: "",
    aprReference: "",
    aprFileUrl: "",
    attachments: [{ name: "", url: "" }]
  });

  const [reviewForm, setReviewForm] = useState({
    reviewNotes: "",
    correctionInstructions: ""
  });

  const load = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (statusFilter) query.set("status", statusFilter);
    if (projectFilter) query.set("projectId", projectFilter);

    Promise.all([
      apiFetch(`/api/sst/documentacoes?pageSize=200&${query.toString()}`, token),
      apiFetch("/api/core/projects?pageSize=200", token),
      apiFetch("/api/core/worksites?pageSize=200", token),
      apiFetch("/api/core/users?pageSize=200", token)
    ])
      .then(([docResponse, projectResponse, worksiteResponse, userResponse]) => {
        setRows(docResponse.data.items);
        setProjects(projectResponse.data.items);
        setWorksites(worksiteResponse.data.items);
        setUsers(userResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token, statusFilter, projectFilter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((row) => row.status === "PENDENTE").length;
    const approved = rows.filter((row) => row.status === "APROVADO").length;
    const rejected = rows.filter((row) => row.status === "REPROVADO").length;
    return { total, pending, approved, rejected };
  }, [rows]);

  const filteredWorksites = useMemo(
    () => worksites.filter((worksite) => !createForm.projectId || worksite.projectId === createForm.projectId),
    [worksites, createForm.projectId]
  );

  const handleCreate = async () => {
    try {
      await apiFetch("/api/sst/documentacoes", token, {
        method: "POST",
        body: JSON.stringify({
          activityName: createForm.activityName,
          projectId: createForm.projectId,
          worksiteId: createForm.worksiteId || null,
          responsibleId: createForm.responsibleId,
          aprReference: createForm.aprReference || null,
          aprFileUrl: createForm.aprFileUrl || null,
          attachments: createForm.attachments
            .filter((attachment) => attachment.name && attachment.url)
            .map((attachment) => ({ name: attachment.name, url: attachment.url }))
        })
      });
      push("Documentacao enviada", "success");
      setOpenCreate(false);
      setCreateForm({
        activityName: "",
        projectId: "",
        worksiteId: "",
        responsibleId: "",
        aprReference: "",
        aprFileUrl: "",
        attachments: [{ name: "", url: "" }]
      });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao enviar", "error");
    }
  };

  const openReviewModal = (doc: Documentation) => {
    setSelected(doc);
    setReviewForm({
      reviewNotes: doc.reviewNotes ?? "",
      correctionInstructions: doc.correctionInstructions ?? ""
    });
    setOpenReview(true);
  };

  const handleReview = async (status: "APROVADO" | "REPROVADO") => {
    if (!selected) return;
    if (status === "REPROVADO" && !reviewForm.correctionInstructions.trim()) {
      push("Informe as instrucoes para correção", "error");
      return;
    }
    try {
      await apiFetch(`/api/sst/documentacoes/${selected.id}`, token, {
        method: "PUT",
        body: JSON.stringify({
          status,
          reviewNotes: reviewForm.reviewNotes || null,
          correctionInstructions: reviewForm.correctionInstructions || null
        })
      });
      push(`Documentacao ${status === "APROVADO" ? "aprovada" : "reprovada"}`, "success");
      setOpenReview(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao revisar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Documentacoes de Execucao" subtitle="Revisao de APR manual e documentos de inicio da atividade" />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Total</p>
          <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Pendentes</p>
          <p className="mt-2 text-2xl font-semibold text-amber-400">{stats.pending}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Aprovadas</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-400">{stats.approved}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Reprovadas</p>
          <p className="mt-2 text-2xl font-semibold text-rose-400">{stats.rejected}</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select className="select mt-2" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
              <option value="">Todos</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Status</label>
            <select className="select mt-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Todos</option>
              <option value="PENDENTE">Pendente</option>
              <option value="APROVADO">Aprovado</option>
              <option value="REPROVADO">Reprovado</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpenCreate(true)}>
              Enviar documentacao
            </button>
          </div>
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => row.id}
        emptyMessage="Sem documentacoes"
        columns={[
          { key: "activityName", label: "Atividade" },
          { key: "project", label: "Projeto", render: (row) => row.project?.name ?? "-" },
          { key: "responsible", label: "Responsavel", render: (row) => row.responsible?.name ?? "-" },
          { key: "aprReference", label: "APR", render: (row) => row.aprReference ?? "-" },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span
                className={
                  row.status === "APROVADO"
                    ? "text-emerald-400"
                    : row.status === "REPROVADO"
                    ? "text-rose-400"
                    : "text-amber-400"
                }
              >
                {row.status}
              </span>
            )
          },
          {
            key: "createdAt",
            label: "Envio",
            render: (row) => new Date(row.createdAt).toLocaleDateString("pt-BR")
          }
        ]}
        actions={(row) => (
          <button className="text-xs text-primary" onClick={() => openReviewModal(row)}>
            Revisar
          </button>
        )}
      />

      <ModalForm
        open={openCreate}
        title="Enviar documentacao"
        onClose={() => setOpenCreate(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenCreate(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreate}>
              Enviar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Atividade</label>
            <input className="input mt-2" value={createForm.activityName} onChange={(e) => setCreateForm({ ...createForm, activityName: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select className="select mt-2" value={createForm.projectId} onChange={(e) => setCreateForm({ ...createForm, projectId: e.target.value })}>
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
            <select className="select mt-2" value={createForm.worksiteId} onChange={(e) => setCreateForm({ ...createForm, worksiteId: e.target.value })}>
              <option value="">Opcional</option>
              {filteredWorksites.map((worksite) => (
                <option key={worksite.id} value={worksite.id}>
                  {worksite.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Tecnico responsavel</label>
            <select className="select mt-2" value={createForm.responsibleId} onChange={(e) => setCreateForm({ ...createForm, responsibleId: e.target.value })}>
              <option value="">Selecione</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">APR (codigo)</label>
            <input className="input mt-2" value={createForm.aprReference} onChange={(e) => setCreateForm({ ...createForm, aprReference: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">APR digitalizada (URL)</label>
            <input className="input mt-2" value={createForm.aprFileUrl} onChange={(e) => setCreateForm({ ...createForm, aprFileUrl: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold">Documentos anexos</p>
          {createForm.attachments.map((attachment, index) => (
            <div key={`doc-${index}`} className="grid gap-2 md:grid-cols-2">
              <input
                className="input"
                placeholder="Nome do documento"
                value={attachment.name}
                onChange={(e) => {
                  const updated = [...createForm.attachments];
                  updated[index].name = e.target.value;
                  setCreateForm({ ...createForm, attachments: updated });
                }}
              />
              <input
                className="input"
                placeholder="URL do documento"
                value={attachment.url}
                onChange={(e) => {
                  const updated = [...createForm.attachments];
                  updated[index].url = e.target.value;
                  setCreateForm({ ...createForm, attachments: updated });
                }}
              />
            </div>
          ))}
          <button
            className="rounded-lg border border-border px-3 py-2 text-xs"
            onClick={() => setCreateForm({ ...createForm, attachments: [...createForm.attachments, { name: "", url: "" }] })}
          >
            Adicionar documento
          </button>
        </div>
      </ModalForm>

      <ModalForm
        open={openReview}
        title="Revisao da documentacao"
        onClose={() => setOpenReview(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpenReview(false)}>
              Fechar
            </button>
            <button className="rounded-lg border border-rose-500 px-4 py-2 text-sm text-rose-400" onClick={() => handleReview("REPROVADO")}>
              Reprovar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => handleReview("APROVADO")}>
              Aprovar
            </button>
          </>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">{selected.activityName}</p>
              <p className="text-xs text-muted">
                {selected.project?.name ?? "-"} · {selected.worksite?.name ?? ""}
              </p>
            </div>
            <div className="grid gap-2 text-xs text-muted md:grid-cols-2">
              <span>Responsavel: {selected.responsible?.name ?? "-"}</span>
              <span>APR: {selected.aprReference ?? "-"}</span>
              <span>Status atual: {selected.status}</span>
              <span>Enviado em: {new Date(selected.createdAt).toLocaleDateString("pt-BR")}</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Documentos</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted">
                {selected.aprFileUrl ? (
                  <li>
                    APR: <a className="text-primary" href={selected.aprFileUrl} target="_blank" rel="noreferrer">Ver documento</a>
                  </li>
                ) : null}
                {selected.attachments.length ? (
                  selected.attachments.map((doc) => (
                    <li key={doc.id}>
                      {doc.name}: <a className="text-primary" href={doc.url} target="_blank" rel="noreferrer">Abrir</a>
                    </li>
                  ))
                ) : (
                  <li>Nenhum anexo informado.</li>
                )}
              </ul>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Observacoes do SST</label>
              <textarea className="input mt-2 h-20" value={reviewForm.reviewNotes} onChange={(e) => setReviewForm({ ...reviewForm, reviewNotes: e.target.value })} />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Instrucoes para correcao</label>
              <textarea className="input mt-2 h-24" value={reviewForm.correctionInstructions} onChange={(e) => setReviewForm({ ...reviewForm, correctionInstructions: e.target.value })} />
            </div>
          </div>
        ) : null}
      </ModalForm>
    </div>
  );
}
