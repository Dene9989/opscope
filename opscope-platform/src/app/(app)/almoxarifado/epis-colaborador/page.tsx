"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";

interface EpiMovement {
  id: string;
  type: string;
  quantity: number;
  createdAt: string;
  item: { name: string };
  project: { name: string };
}

export default function EpiColaboradorPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<EpiMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/inventory/epi-by-user?pageSize=50", token)
      .then((response) => setRows(response.data.items))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <Header title="EPIs por Colaborador" subtitle="Historico de entrega e devolucao" />
      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem registros de EPI"
        columns={[
          { key: "item", label: "EPI", render: (row) => row.item.name },
          { key: "type", label: "Tipo" },
          { key: "quantity", label: "Qtd" },
          { key: "project", label: "Projeto", render: (row) => row.project.name },
          {
            key: "createdAt",
            label: "Data",
            render: (row) => new Date(row.createdAt).toLocaleDateString("pt-BR")
          }
        ]}
      />
    </div>
  );
}
