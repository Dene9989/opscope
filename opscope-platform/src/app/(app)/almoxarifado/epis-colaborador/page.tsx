"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { openMovement } from "@/lib/movement";

interface EpiRow {
  id: string;
  collaborator: { id: string; name: string } | null;
  item: { id: string; name: string; caNumber?: string | null };
  batch?: { batchCode: string } | null;
  project?: { id: string; name: string } | null;
  qty: number;
  returnedQty: number;
  pendingQty: number;
  createdAt: string;
  validUntil?: string | null;
  caValidUntil?: string | null;
  status: string;
  termMovementId?: string | null;
}

interface Option {
  id: string;
  name: string;
}

export default function EpiColaboradorPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<EpiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Option[]>([]);
  const [collaborators, setCollaborators] = useState<Option[]>([]);
  const [filters, setFilters] = useState({ projectId: "", collaboratorId: "", status: "" });
  const router = useRouter();

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ pageSize: "50" });
    if (filters.projectId) params.set("projectId", filters.projectId);
    if (filters.collaboratorId) params.set("collaboratorId", filters.collaboratorId);
    if (filters.status) params.set("status", filters.status);

    apiFetch(`/api/inventory/epi-by-user?${params.toString()}`, token)
      .then((response) => setRows(response.data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      apiFetch("/api/core/projects?pageSize=200", token),
      apiFetch("/api/core/users?pageSize=200", token)
    ])
      .then(([projectsResponse, usersResponse]) => {
        setProjects(projectsResponse.data.items);
        setCollaborators(usersResponse.data.items);
      })
      .catch(() => {
        setProjects([]);
        setCollaborators([]);
      });
  }, [token]);

  useEffect(() => {
    load();
  }, [token, filters]);

  const total = useMemo(() => rows.length, [rows]);

  return (
    <div className="space-y-6">
      <Header title="EPIs por Colaborador" subtitle="Conformidade e pendencias" />

      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            className="select"
            value={filters.projectId}
            onChange={(event) => setFilters((prev) => ({ ...prev, projectId: event.target.value }))}
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
            value={filters.collaboratorId}
            onChange={(event) => setFilters((prev) => ({ ...prev, collaboratorId: event.target.value }))}
          >
            <option value="">Colaborador</option>
            {collaborators.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="">Status</option>
            {"ATIVO,DEVOLVIDO,VENCIDO".split(",").map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => row.id}
        emptyMessage="Sem registros de EPI"
        columns={[
          { key: "colaborador", label: "Colaborador", render: (row) => row.collaborator?.name || "-" },
          { key: "item", label: "Item", render: (row) => row.item.name },
          { key: "batch", label: "Lote", render: (row) => row.batch?.batchCode || "-" },
          { key: "qty", label: "Qtd" },
          { key: "pending", label: "Pendencia", render: (row) => row.pendingQty },
          { key: "project", label: "Projeto", render: (row) => row.project?.name || "-" },
          { key: "createdAt", label: "Entrega", render: (row) => new Date(row.createdAt).toLocaleDateString("pt-BR") },
          { key: "ca", label: "CA", render: (row) => row.item.caNumber || "-" },
          { key: "validUntil", label: "Validade", render: (row) => row.validUntil ? new Date(row.validUntil).toLocaleDateString("pt-BR") : "-" },
          { key: "caValidUntil", label: "Validade CA", render: (row) => row.caValidUntil ? new Date(row.caValidUntil).toLocaleDateString("pt-BR") : "-" },
          {
            key: "status",
            label: "Status",
            render: (row) => {
              const klass =
                row.status === "DEVOLVIDO" ? "badge-success" : row.status === "VENCIDO" ? "badge-danger" : "badge-warning";
              return <span className={`badge ${klass}`}>{row.status}</span>;
            }
          }
        ]}
        actions={(row) =>
          row.pendingQty > 0 ? (
            <button
              className="rounded-lg border border-border px-2 py-1 text-xs"
              onClick={() =>
                openMovement(router, {
                  type: "DEVOLUCAO",
                  itemId: row.item.id,
                  projectId: row.project?.id,
                  collaboratorId: row.collaborator?.id || undefined,
                  deliveryMovementId: row.id
                })
              }
            >
              Devolver
            </button>
          ) : row.termMovementId ? (
            <a className="text-primary underline" href={`/api/inventory/movements/${row.termMovementId}/term`}>
              Termo
            </a>
          ) : (
            "-"
          )
        }
      />

      <div className="text-xs text-muted">Total de registros: {total}</div>

    </div>
  );
}

