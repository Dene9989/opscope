"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { MovementWizard } from "@/components/inventory/MovementWizard";
import { RoleGate } from "@/components/auth/RoleGate";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

interface DashboardResponse {
  totals: {
    items: number;
    lowStock: number;
    expiringEpi: number;
    movementsToday: number;
    activeReservations: number;
  };
  alerts: {
    lowStock: Array<{ id: string; itemId: string; projectId: string; item: string; project: string; total: number }>;
    expiring: Array<{ id: string; item: string; project: string; itemValidUntil?: string; caValidUntil?: string }>;
  };
  charts: {
    consumptionByDay: Array<{ date: string; qty: number }>;
    topOutItems: Array<{ name: string; qty: number }>;
    losses: Array<{ name: string; qty: number }>;
  };
}

export default function AlmoxarifadoDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wizard, setWizard] = useState<{ open: boolean; itemId?: string; projectId?: string }>(
    { open: false }
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiFetch("/api/inventory/dashboard", token)
      .then((response) => {
        if (!active) return;
        setDashboard(response.data);
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

  const totals = dashboard?.totals;

  return (
    <RoleGate roles={["ADMIN", "GESTOR", "ALMOXARIFE", "SUPERVISOR"]}>
      <div className="space-y-6">
      <Header title="Almoxarifado" subtitle="Operacao e alertas do estoque" />

      {error ? <div className="card p-4 text-sm text-red-400">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Itens cadastrados</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : totals?.items ?? 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Itens em baixa</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : totals?.lowStock ?? 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">EPIs vencendo (30d)</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : totals?.expiringEpi ?? 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Movimentacoes hoje</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : totals?.movementsToday ?? 0}</p>
          <p className="text-xs text-muted mt-2">Reservas ativas: {totals?.activeReservations ?? 0}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Alertas acionaveis</h3>
          <div className="mt-4 space-y-3 text-sm">
            {(dashboard?.alerts.lowStock || []).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{alert.item}</div>
                  <div className="text-xs text-muted">{alert.project} - {alert.total} un</div>
                </div>
                <button
                  className="rounded-lg border border-border px-3 py-2 text-xs"
                  onClick={() => setWizard({ open: true, itemId: alert.itemId, projectId: alert.projectId })}
                >
                  Registrar entrada
                </button>
              </div>
            ))}
            {dashboard?.alerts.lowStock?.length ? null : (
              <p className="text-muted">Nenhum item em baixa.</p>
            )}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">EPIs vencendo</h3>
          <div className="mt-4 space-y-3 text-sm">
            {(dashboard?.alerts.expiring || []).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{alert.item}</div>
                  <div className="text-xs text-muted">{alert.project}</div>
                </div>
                <span className="badge badge-warning">Vencendo</span>
              </div>
            ))}
            {dashboard?.alerts.expiring?.length ? null : (
              <p className="text-muted">Nenhum vencimento proximo.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold">Consumo por dia</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboard?.charts.consumptionByDay || []}>
                <XAxis dataKey="date" stroke="#8b98a9" />
                <YAxis stroke="#8b98a9" />
                <Tooltip />
                <Line type="monotone" dataKey="qty" stroke="#1fb26b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Top itens por saida</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard?.charts.topOutItems || []}>
                <XAxis dataKey="name" stroke="#8b98a9" hide />
                <YAxis stroke="#8b98a9" />
                <Tooltip />
                <Bar dataKey="qty" fill="#1fb26b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold">Perdas recentes</h3>
        <div className="mt-4 grid gap-2 text-sm text-muted">
          {(dashboard?.charts.losses || []).length ? (
            dashboard?.charts.losses.map((loss) => (
              <div key={loss.name} className="flex items-center justify-between">
                <span>{loss.name}</span>
                <span className="text-warning">{loss.qty}</span>
              </div>
            ))
          ) : (
            <p>Sem perdas registradas.</p>
          )}
        </div>
      </div>

      <MovementWizard
        open={wizard.open}
        onClose={() => setWizard({ open: false })}
        defaultType="ENTRADA"
        defaultItemId={wizard.itemId}
        defaultProjectId={wizard.projectId}
        startOnForm
      />
    </div>
    </RoleGate>
  );
}

