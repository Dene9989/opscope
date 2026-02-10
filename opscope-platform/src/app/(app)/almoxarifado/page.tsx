"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";

interface StockItem {
  id: string;
  quantity: number;
  reserved: number;
  minQuantity: number;
  reorderPoint: number;
  item: { name: string };
}

interface Movement {
  id: string;
  type: string;
  quantity: number;
  item: { name: string };
  createdAt: string;
}

export default function AlmoxarifadoDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [itemsTotal, setItemsTotal] = useState(0);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      apiFetch("/api/inventory/items?pageSize=1", token),
      apiFetch("/api/inventory/stock?pageSize=20", token),
      apiFetch("/api/inventory/movements?pageSize=5", token)
    ])
      .then(([itemsResponse, stockResponse, movementResponse]) => {
        if (!active) return;
        setItemsTotal(itemsResponse.data.total);
        setStockItems(stockResponse.data.items);
        setMovements(movementResponse.data.items);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const lowStock = useMemo(
    () => stockItems.filter((item) => item.quantity <= item.minQuantity || item.quantity <= item.reorderPoint),
    [stockItems]
  );

  return (
    <div className="space-y-6">
      <Header title="Almoxarifado" subtitle="Inventario por projeto" />

      {error ? <div className="card p-4 text-sm text-red-400">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Itens cadastrados</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : itemsTotal}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Itens em baixa</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : lowStock.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Movimentacoes recentes</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : movements.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Reservas ativas</p>
          <p className="mt-4 text-2xl font-semibold">
            {loading ? "..." : stockItems.filter((item) => item.reserved > 0).length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Itens em baixa</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {loading ? (
              <li>Carregando...</li>
            ) : lowStock.length ? (
              lowStock.map((item) => (
                <li key={item.id}>
                  {item.item.name} - {item.quantity} un
                </li>
              ))
            ) : (
              <li>Nenhum item abaixo do minimo.</li>
            )}
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Ultimas movimentacoes</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {loading ? (
              <li>Carregando...</li>
            ) : movements.length ? (
              movements.map((movement) => (
                <li key={movement.id}>
                  {movement.type} - {movement.item.name} ({movement.quantity})
                </li>
              ))
            ) : (
              <li>Sem movimentacoes recentes.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
