"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";

interface ProjectOption {
  id: string;
  name: string;
}

interface ComplianceRow {
  userId: string;
  name: string;
  role: string;
  training: { required: number; pending: number; compliance: number };
  epi: { ok: boolean; activeQty: number };
  pt: { ok: boolean; validTo: string | null };
}

export default function ConformidadePage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [rows, setRows] = useState<ComplianceRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/core/projects?pageSize=100", token),
      apiFetch(`/api/sst/conformidade${projectId ? `?projectId=${projectId}` : ""}`, token)
    ])
      .then(([projectResponse, complianceResponse]) => {
        setProjects(projectResponse.data.items);
        setRows(complianceResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token, projectId]);

  return (
    <div className="space-y-6">
      <Header title="Centro de Conformidade" subtitle="Matriz por colaborador" />

      <div className="card p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select className="select mt-2" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">Todos</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-muted">Verde = conforme | Amarelo = pendente | Vermelho = critico</p>
          </div>
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => row.userId}
        columns={[
          { key: "name", label: "Colaborador" },
          { key: "role", label: "Funcao" },
          {
            key: "training",
            label: "Treinamentos",
            render: (row) => (
              <span className={row.training.pending ? "text-amber-400" : "text-emerald-400"}>
                {row.training.compliance}% ({row.training.required - row.training.pending}/{row.training.required})
              </span>
            )
          },
          {
            key: "epi",
            label: "EPI",
            render: (row) => (
              <span className={row.epi.ok ? "text-emerald-400" : "text-rose-400"}>
                {row.epi.ok ? `OK (${row.epi.activeQty})` : "Pendente"}
              </span>
            )
          },
          {
            key: "pt",
            label: "PT",
            render: (row) => (
              <span className={row.pt.ok ? "text-emerald-400" : "text-amber-400"}>
                {row.pt.ok && row.pt.validTo
                  ? `Valida ate ${new Date(row.pt.validTo).toLocaleDateString("pt-BR")}`
                  : "Sem PT"}
              </span>
            )
          }
        ]}
      />
    </div>
  );
}
