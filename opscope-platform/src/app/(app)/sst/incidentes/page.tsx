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
  description: string;
  date: string;
  category: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

export default function IncidentesPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<Incident[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    projectId: "",
    date: new Date().toISOString().slice(0, 10),
    severity: "MEDIA",
    description: "",
    category: "Quase acidente"
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/sst/incidents?pageSize=50", token),
      apiFetch("/api/core/projects?pageSize=50", token)
    ])
      .then(([incidentResponse, projectResponse]) => {
        setRows(incidentResponse.data.items);
        setProjects(projectResponse.data.items);
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
          date: new Date(form.date).toISOString(),
          severity: form.severity,
          description: form.description,
          category: form.category
        })
      });
      push("Incidente registrado", "success");
      setOpen(false);
      setForm({ projectId: "", date: form.date, severity: "MEDIA", description: "", category: "Quase acidente" });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao registrar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Incidentes" subtitle="Registro e investigacao" />
      <div className="flex justify-between">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
          Novo incidente
        </button>
      </div>
      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem incidentes"
        columns={[
          { key: "category", label: "Categoria" },
          { key: "severity", label: "Severidade" },
          { key: "description", label: "Descricao" },
          {
            key: "date",
            label: "Data",
            render: (row) => new Date(row.date).toLocaleDateString("pt-BR")
          }
        ]}
      />

      <ModalForm
        open={open}
        title="Registrar incidente"
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
            <select
              className="select mt-2"
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            >
              <option value="">Selecione</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Data</label>
            <input
              className="input mt-2"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Severidade</label>
            <select
              className="select mt-2"
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
            >
              <option value="BAIXA">BAIXA</option>
              <option value="MEDIA">MEDIA</option>
              <option value="ALTA">ALTA</option>
              <option value="CRITICA">CRITICA</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Categoria</label>
            <input
              className="input mt-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Descricao</label>
            <textarea
              className="input mt-2 h-24"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
