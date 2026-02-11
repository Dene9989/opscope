"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

interface DashboardData {
  totals: {
    trainings: number;
    inspections: number;
    ncs: number;
    incidents: number;
  };
  alerts: Array<{
    id: string;
    title: string;
    message: string;
    severity: string;
    dueDate: string | null;
  }>;
  charts: {
    inspectionsSeries: Array<{ date: string; total: number }>;
    incidentsSeries: Array<{ date: string; total: number }>;
    incidentsBySeverity: Array<{ severity: string; total: number }>;
  };
  timeline: Array<{ id: string; type: string; title: string; project: string; date: string }>;
}

export default function SstDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    setLoading(true);
    apiFetch("/api/sst/dashboard", token)
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <Header title="Seguranca do Trabalho" subtitle="KPIs, alertas e eventos da obra" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Treinamentos", value: data?.totals.trainings ?? 0 },
          { label: "Inspecoes", value: data?.totals.inspections ?? 0 },
          { label: "NCs", value: data?.totals.ncs ?? 0 },
          { label: "Incidentes", value: data?.totals.incidents ?? 0 }
        ].map((card) => (
          <div key={card.label} className="card p-4">
            <p className="text-xs uppercase text-muted">{card.label}</p>
            <p className="mt-4 text-2xl font-semibold">{loading ? "..." : card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Alertas acionaveis</h3>
            <Link className="text-xs text-primary" href="/sst/inspecoes">
              Ver inspecoes
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {loading && <p className="text-sm text-muted">Carregando alertas...</p>}
            {!loading && (!data?.alerts.length ? <p className="text-sm text-muted">Sem alertas no momento.</p> : null)}
            {data?.alerts.slice(0, 6).map((alert) => (
              <div key={alert.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-xs text-muted">{alert.message}</p>
                  </div>
                  <span className="text-xs uppercase text-muted">{alert.severity}</span>
                </div>
                {alert.dueDate ? (
                  <p className="mt-2 text-xs text-muted">
                    Vence em {new Date(alert.dueDate).toLocaleDateString("pt-BR")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Acoes rapidas</h3>
          </div>
          <div className="mt-4 grid gap-3">
            <Link className="rounded-lg border border-border p-3 text-sm hover:bg-border/40" href="/sst/treinamentos">
              Registrar treinamento
            </Link>
            <Link className="rounded-lg border border-border p-3 text-sm hover:bg-border/40" href="/sst/inspecoes">
              Executar inspecao
            </Link>
            <Link className="rounded-lg border border-border p-3 text-sm hover:bg-border/40" href="/sst/ncs">
              Abrir NC
            </Link>
            <Link className="rounded-lg border border-border p-3 text-sm hover:bg-border/40" href="/sst/incidentes">
              Reportar incidente
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Inspecoes (ultimos 14 dias)</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.charts.inspectionsSeries ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
                <XAxis dataKey="date" stroke="#9aa6bf" fontSize={10} />
                <YAxis stroke="#9aa6bf" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#36cfc9" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Incidentes por severidade</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts.incidentsBySeverity ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
                <XAxis dataKey="severity" stroke="#9aa6bf" fontSize={10} />
                <YAxis stroke="#9aa6bf" fontSize={10} />
                <Tooltip />
                <Bar dataKey="total" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold">Timeline do projeto</h3>
        <div className="mt-4 space-y-3">
          {loading && <p className="text-sm text-muted">Carregando...</p>}
          {!loading && (!data?.timeline.length ? <p className="text-sm text-muted">Sem eventos recentes.</p> : null)}
          {data?.timeline.map((event) => (
            <div key={event.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold">[{event.type}] {event.title}</p>
                <p className="text-xs text-muted">{event.project}</p>
              </div>
              <span className="text-xs text-muted">
                {new Date(event.date).toLocaleDateString("pt-BR")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
