"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";

interface StockRow {
  id: string;
  quantity: number;
  reserved: number;
  minQuantity: number;
  reorderPoint: number;
  item: { name: string; type: string };
  project: { name: string };
  worksite?: { name: string } | null;
}

export default function EstoquePage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/inventory/stock?pageSize=50", token)
      .then((response) => setRows(response.data.items))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <Header title="Estoque por Projeto" subtitle="Visao matriz projeto x item" />
      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem estoque registrado"
        columns={[
          { key: "item", label: "Item", render: (row) => row.item.name },
          { key: "project", label: "Projeto", render: (row) => row.project.name },
          { key: "worksite", label: "Local", render: (row) => row.worksite?.name || "-" },
          { key: "quantity", label: "Disponivel" },
          { key: "reserved", label: "Reservado" },
          { key: "minQuantity", label: "Min" }
        ]}
      />
    </div>
  );
}
