"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { ReservationModal } from "@/components/inventory/ReservationModal";
import { RoleGate } from "@/components/auth/RoleGate";
import { openMovement } from "@/lib/movement";

interface StockRow {
  id: string;
  qtyAvailable: number;
  qtyReserved: number;
  minQuantity: number;
  reorderPoint: number;
  item: { id: string; name: string; type: string };
  project: { id: string; name: string };
  worksite?: { id: string; name: string } | null;
  batch?: { id: string; batchCode: string } | null;
}

interface ReservationRow {
  id: string;
  qty: number;
  status: string;
  createdAt: string;
  item: { name: string };
  project: { name: string };
  worksite?: { name: string } | null;
  referenceType?: string | null;
  referenceId?: string | null;
}

interface Option {
  id: string;
  name: string;
}

interface WorksiteOption {
  id: string;
  name: string;
  projectId: string;
}

export default function EstoquePage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<StockRow[]>([]);
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Option[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);
  const [filters, setFilters] = useState({ projectId: "", worksiteId: "", q: "" });
  const [reservation, setReservation] = useState<{ open: boolean; row?: StockRow }>({ open: false });
  const router = useRouter();

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ pageSize: "50" });
    if (filters.projectId) params.set("projectId", filters.projectId);
    if (filters.worksiteId) params.set("worksiteId", filters.worksiteId);
    if (filters.q) params.set("q", filters.q);

    const reservationParams = new URLSearchParams({ pageSize: "20" });
    if (filters.projectId) reservationParams.set("projectId", filters.projectId);

    Promise.all([
      apiFetch(`/api/inventory/stock?${params.toString()}`, token),
      apiFetch(`/api/inventory/reservations?${reservationParams.toString()}`, token)
    ])
      .then(([stockResponse, reservationResponse]) => {
        setRows(stockResponse.data.items);
        setReservations(
          reservationResponse.data.items.filter(
            (reservation: ReservationRow) =>
              reservation.status !== "CANCELADO" && reservation.status !== "CONSUMIDO"
          )
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    Promise.all([
      apiFetch("/api/core/projects?pageSize=200", token),
      apiFetch("/api/core/worksites?pageSize=200", token)
    ])
      .then(([projectsResponse, worksitesResponse]) => {
        setProjects(projectsResponse.data.items);
        setWorksites(worksitesResponse.data.items);
      })
      .catch(() => {
        setProjects([]);
        setWorksites([]);
      });
  }, [token]);

  useEffect(() => {
    load();
  }, [token, filters]);

  const filteredWorksites = useMemo(() => {
    if (!filters.projectId) return worksites;
    return worksites.filter((worksite) => worksite.projectId === filters.projectId);
  }, [worksites, filters.projectId]);

  return (
    <RoleGate roles={["ADMIN", "GESTOR", "ALMOXARIFE", "SUPERVISOR"]}>
    <div className="space-y-6">
      <Header title="Estoque por Projeto" subtitle="Visao matriz projeto x item x lote" />

      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            className="input"
            placeholder="Buscar item"
            value={filters.q}
            onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
          />
          <select
            className="select"
            value={filters.projectId}
            onChange={(event) => setFilters((prev) => ({ ...prev, projectId: event.target.value, worksiteId: "" }))}
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
            value={filters.worksiteId}
            onChange={(event) => setFilters((prev) => ({ ...prev, worksiteId: event.target.value }))}
          >
            <option value="">Local</option>
            {filteredWorksites.map((worksite) => (
              <option key={worksite.id} value={worksite.id}>
                {worksite.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        rowKey={(row) => row.id}
        emptyMessage="Sem estoque registrado"
        columns={[
          { key: "item", label: "Item", render: (row) => row.item.name },
          { key: "project", label: "Projeto", render: (row) => row.project.name },
          { key: "worksite", label: "Local", render: (row) => row.worksite?.name || "-" },
          { key: "batch", label: "Lote", render: (row) => row.batch?.batchCode || "-" },
          { key: "qtyAvailable", label: "Disponivel" },
          { key: "qtyReserved", label: "Reservado" },
          {
            key: "health",
            label: "Saude",
            render: (row) => {
              const total = row.qtyAvailable + row.qtyReserved;
              if (total <= row.minQuantity) return <span className="badge badge-danger">Baixo</span>;
              if (total <= row.reorderPoint) return <span className="badge badge-warning">Reposicao</span>;
              return <span className="badge badge-success">Ok</span>;
            }
          }
        ]}
        actions={(row) => (
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-lg border border-border px-2 py-1 text-xs"
              onClick={() => setReservation({ open: true, row })}
            >
              Reservar
            </button>
            <button
              className="rounded-lg border border-border px-2 py-1 text-xs"
              onClick={() =>
                openMovement(router, {
                  type: "ENTRADA",
                  itemId: row.item.id,
                  projectId: row.project.id
                })
              }
            >
              Entrada
            </button>
          </div>
        )}
      />

      <div className="card p-6">
        <h3 className="text-lg font-semibold">Reservas em aberto</h3>
        <div className="mt-4">
          <DataTable
            rows={reservations}
            rowKey={(row) => row.id}
            emptyMessage="Sem reservas"
            columns={[
              { key: "item", label: "Item", render: (row) => row.item.name },
              { key: "project", label: "Projeto", render: (row) => row.project.name },
              { key: "worksite", label: "Local", render: (row) => row.worksite?.name || "-" },
              { key: "qty", label: "Qtd" },
              { key: "referenceType", label: "Referencia", render: (row) => row.referenceType || "-" }
            ]}
            actions={(row) => (
              <div className="flex flex-wrap gap-2">
                <button
                  className="rounded-lg border border-border px-2 py-1 text-xs"
                  onClick={async () => {
                    await apiFetch(`/api/inventory/reservations/${row.id}`, token, {
                      method: "PATCH",
                      body: JSON.stringify({ status: "SEPARADO" })
                    });
                    load();
                  }}
                >
                  Separar
                </button>
                <button
                  className="rounded-lg border border-border px-2 py-1 text-xs text-red-400"
                  onClick={async () => {
                    await apiFetch(`/api/inventory/reservations/${row.id}`, token, {
                      method: "PATCH",
                      body: JSON.stringify({ status: "CANCELADO" })
                    });
                    load();
                  }}
                >
                  Cancelar
                </button>
              </div>
            )}
          />
        </div>
      </div>

      <ReservationModal
        open={reservation.open}
        onClose={() => setReservation({ open: false })}
        onSuccess={load}
        defaultItemId={reservation.row?.item.id}
        defaultProjectId={reservation.row?.project.id}
        defaultWorksiteId={reservation.row?.worksite?.id}
      />

    </div>
    </RoleGate>
  );
}

