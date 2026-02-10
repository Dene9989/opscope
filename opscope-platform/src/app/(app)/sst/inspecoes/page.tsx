"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface Inspection {
  id: string;
  status: string;
  performedAt: string;
  template: { title: string };
  project: { name: string };
}

interface TemplateOption {
  id: string;
  title: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

export default function InspecoesPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<Inspection[]>([]);
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    templateId: "",
    projectId: "",
    status: "OK",
    performedAt: new Date().toISOString().slice(0, 10),
    answers: "[{\"id\":\"q1\",\"answer\":\"OK\"}]"
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/sst/inspections?pageSize=50", token),
      apiFetch("/api/sst/inspection-templates?pageSize=50", token),
      apiFetch("/api/core/projects?pageSize=50", token)
    ])
      .then(([inspectionResponse, templateResponse, projectResponse]) => {
        setRows(inspectionResponse.data.items);
        setTemplates(templateResponse.data.items);
        setProjects(projectResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async () => {
    try {
      const answers = JSON.parse(form.answers);
      await apiFetch("/api/sst/inspections", token, {
        method: "POST",
        body: JSON.stringify({
          templateId: form.templateId,
          projectId: form.projectId,
          performedAt: new Date(form.performedAt).toISOString(),
          status: form.status,
          answers
        })
      });
      push("Inspecao registrada", "success");
      setOpen(false);
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao registrar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Inspecoes" subtitle="Execucao de checklists" />
      <div className="flex justify-between">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
          Nova inspecao
        </button>
      </div>
      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem inspecoes"
        columns={[
          { key: "template", label: "Checklist", render: (row) => row.template.title },
          { key: "project", label: "Projeto", render: (row) => row.project.name },
          { key: "status", label: "Status" },
          {
            key: "performedAt",
            label: "Data",
            render: (row) => new Date(row.performedAt).toLocaleDateString("pt-BR")
          }
        ]}
      />

      <ModalForm
        open={open}
        title="Nova inspecao"
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
            <label className="text-xs uppercase text-muted">Checklist</label>
            <select
              className="select mt-2"
              value={form.templateId}
              onChange={(e) => setForm({ ...form, templateId: e.target.value })}
            >
              <option value="">Selecione</option>
              {templates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select
              className="select mt-2"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Selecione</option>
              {projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Status</label>
            <select
              className="select mt-2"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="OK">OK</option>
              <option value="NAO_CONFORME">NAO_CONFORME</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Data</label>
            <input
              className="input mt-2"
              type="date"
              value={form.performedAt}
              onChange={(e) => setForm({ ...form, performedAt: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Respostas (JSON)</label>
            <textarea
              className="input mt-2 h-28"
              value={form.answers}
              onChange={(e) => setForm({ ...form, answers: e.target.value })}
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
