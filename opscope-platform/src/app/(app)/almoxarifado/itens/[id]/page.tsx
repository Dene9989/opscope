"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { apiFetch } from "@/lib/client";
import { useAuth } from "@/components/auth/AuthContext";
import { RoleGate } from "@/components/auth/RoleGate";
import { openMovement } from "@/lib/movement";

interface Item {
  id: string;
  name: string;
  type: string;
  unit: string;
  status: string;
  internalCode?: string | null;
  barcode?: string | null;
  caNumber?: string | null;
  caValidUntil?: string | null;
  itemValidUntil?: string | null;
  description?: string | null;
  brand?: string | null;
  model?: string | null;
}

interface BalanceRow {
  id: string;
  qtyAvailable: number;
  qtyReserved: number;
  minQuantity: number;
  reorderPoint: number;
  project: { name: string };
  worksite?: { name: string } | null;
  batch?: { batchCode: string } | null;
}

interface MovementRow {
  id: string;
  type: string;
  qty: number;
  createdAt: string;
  projectOrigin?: { name: string } | null;
  projectDestination?: { name: string } | null;
  collaborator?: { name: string } | null;
  responsibilityTerm?: { id: string } | null;
}

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = String(params.id);
  const { token } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [balances, setBalances] = useState<BalanceRow[]>([]);
  const [movements, setMovements] = useState<MovementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("detalhes");
  const router = useRouter();

  const loadDetails = () => {
    if (!itemId) return;
    setLoading(true);
    apiFetch(`/api/inventory/items/${itemId}/details`, token)
      .then((response) => {
        setItem(response.data.item);
        setBalances(response.data.balances);
        setMovements(response.data.movements);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDetails();
  }, [itemId, token]);

  const totalAvailable = useMemo(
    () => balances.reduce((acc, balance) => acc + balance.qtyAvailable, 0),
    [balances]
  );

  return (
    <RoleGate roles={["ADMIN", "GESTOR", "ALMOXARIFE", "SUPERVISOR"]}>
    <div className="space-y-6">
      <Header title={item?.name || "Item"} subtitle="Detalhes completos do item" />

      <div className="flex flex-wrap gap-2">
        {[
          { id: "detalhes", label: "Detalhes" },
          { id: "estoque", label: "Estoque" },
          { id: "movimentos", label: "Movimentacoes" },
          { id: "anexos", label: "Anexos" },
          { id: "qr", label: "QR" }
        ].map((option) => (
          <button
            key={option.id}
            className={`rounded-lg px-3 py-2 text-sm ${tab === option.id ? "bg-primary/20 text-primary" : "border border-border"}`}
            onClick={() => setTab(option.id)}
          >
            {option.label}
          </button>
        ))}
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            className="rounded-lg border border-border px-3 py-2 text-sm"
            onClick={() => openMovement(router, { type: "ENTRADA", itemId })}
          >
            Entrada
          </button>
          <button
            className="rounded-lg border border-border px-3 py-2 text-sm"
            onClick={() => openMovement(router, { type: "ENTREGA", itemId })}
          >
            Entregar
          </button>
          <button
            className="rounded-lg border border-border px-3 py-2 text-sm"
            onClick={() => openMovement(router, { type: "TRANSFERENCIA", itemId })}
          >
            Transferir
          </button>
          <button
            className="rounded-lg border border-border px-3 py-2 text-sm"
            onClick={() => openMovement(router, { type: "DEVOLUCAO", itemId })}
          >
            Devolver
          </button>
        </div>
      </div>

      {loading ? <div className="card p-6 text-sm text-muted">Carregando...</div> : null}

      {!loading && tab === "detalhes" && item ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Resumo</h3>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <div>Tipo: {item.type}</div>
              <div>Status: {item.status}</div>
              <div>Unidade: {item.unit}</div>
              <div>Codigo interno: {item.internalCode || "-"}</div>
              <div>Barcode: {item.barcode || "-"}</div>
              <div>Estoque disponivel: {totalAvailable}</div>
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold">Documentacao EPI</h3>
            <div className="mt-4 space-y-2 text-sm text-muted">
              <div>CA: {item.caNumber || "-"}</div>
              <div>Validade CA: {item.caValidUntil ? new Date(item.caValidUntil).toLocaleDateString("pt-BR") : "-"}</div>
              <div>Validade item: {item.itemValidUntil ? new Date(item.itemValidUntil).toLocaleDateString("pt-BR") : "-"}</div>
              <div>Marca: {item.brand || "-"}</div>
              <div>Modelo: {item.model || "-"}</div>
            </div>
          </div>
          <div className="card p-6 md:col-span-2">
            <h3 className="text-lg font-semibold">Descricao</h3>
            <p className="mt-3 text-sm text-muted">{item.description || "Sem descricao."}</p>
          </div>
        </div>
      ) : null}

      {!loading && tab === "estoque" ? (
        <DataTable
          rows={balances}
          rowKey={(row) => row.id}
          emptyMessage="Sem estoque"
          columns={[
            { key: "project", label: "Projeto", render: (row) => row.project.name },
            { key: "worksite", label: "Local", render: (row) => row.worksite?.name || "-" },
            { key: "batch", label: "Lote", render: (row) => row.batch?.batchCode || "-" },
            { key: "qtyAvailable", label: "Disponivel" },
            { key: "qtyReserved", label: "Reservado" },
            { key: "minQuantity", label: "Min" }
          ]}
        />
      ) : null}

      {!loading && tab === "movimentos" ? (
        <DataTable
          rows={movements}
          rowKey={(row) => row.id}
          emptyMessage="Sem movimentacoes"
          columns={[
            { key: "type", label: "Tipo" },
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
      ) : null}

      {!loading && tab === "anexos" ? (
        <div className="card p-6 text-sm text-muted">Sem anexos cadastrados.</div>
      ) : null}

      {!loading && tab === "qr" ? (
        <div className="card p-6 space-y-4">
          <div className="text-sm text-muted">QR Code para identificacao rapida.</div>
          <img className="h-48 w-48 border border-border rounded-lg" src={`/api/inventory/items/${itemId}/qrcode`} />
          <a className="text-primary underline" href={`/api/inventory/items/${itemId}/qrcode`}>
            Baixar QR
          </a>
        </div>
      ) : null}

    </div>
    </RoleGate>
  );
}
