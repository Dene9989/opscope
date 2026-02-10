"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { MovementWizard } from "@/components/inventory/MovementWizard";
import { RoleGate } from "@/components/auth/RoleGate";
import { openMovement } from "@/lib/movement";

interface MovementRow {
  id: string;
  type: string;
  qty: number;
  createdAt: string;
  item: { name: string };
  projectOrigin?: { name: string } | null;
  projectDestination?: { name: string } | null;
  collaborator?: { name: string } | null;
  responsibilityTerm?: { id: string } | null;
}

interface Option {
  id: string;
  name: string;
}

export default function MovimentacoesPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<MovementRow[]>([]);
  const [items, setItems] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "", projectId: "", itemId: "" });
  const router = useRouter();

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ pageSize: "50" });
    if (filters.type) params.set("type", filters.type);
    if (filters.projectId) params.set("projectId", filters.projectId);
    if (filters.itemId) params.set("itemId", filters.itemId);

    Promise.all([
      apiFetch(`/api/inventory/movements?${params.toString()}`, token),
      apiFetch("/api/inventory/items?pageSize=200", token),
      apiFetch("/api/core/projects?pageSize=200", token)
    ])
      .then(([movementResponse, itemResponse, projectResponse]) => {
        setRows(movementResponse.data.items);
        setItems(itemResponse.data.items);
        setProjects(projectResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token, filters]);

  const total = useMemo(() => rows.length, [rows]);

  return (
    <RoleGate roles={["ADMIN", "GESTOR", "ALMOXARIFE", "SUPERVISOR"]}>
    <div className="space-y-6">
      <Header title="Movimentacoes" subtitle="Fluxos guiados de entrada, entrega e ajustes" />

      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            className="select"
            value={filters.type}
            onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
          >
            <option value="">Tipo</option>
            {"ENTRADA,ENTREGA,DEVOLUCAO,TRANSFERENCIA,AJUSTE,BAIXA".split(",").map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
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
            value={filters.itemId}
            onChange={(event) => setFilters((prev) => ({ ...prev, itemId: event.target.value }))}
          >
            <option value="">Item</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
          onClick={() => openMovement(router)}
        >
          Nova movimentacao
        </button>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => row.id}
        emptyMessage="Sem movimentacoes"
        columns={[
          { key: "type", label: "Tipo" },
          { key: "item", label: "Item", render: (row) => row.item.name },
          { key: "qty", label: "Qtd" },
          { key: "origem", label: "Origem", render: (row) => row.projectOrigin?.name || "-" },
          { key: "destino", label: "Destino", render: (row) => row.projectDestination?.name || "-" },
          { key: "colaborador", label: "Colaborador", render: (row) => row.collaborator?.name || "-" },
          { key: "createdAt", label: "Data", render: (row) => new Date(row.createdAt).toLocaleDateString("pt-BR") }
        ]}
        actions={(row) =>
          row.responsibilityTerm ? (
            <a className="text-primary underline" href={`/api/inventory/movements/${row.id}/term`}>
              Termo
            </a>
          ) : (
            "-"
          )
        }
      />

      <div className="text-xs text-muted">Total de registros: {total}</div>

      <MovementWizard onSuccess={load} />
    </div>
    </RoleGate>
  );
}

