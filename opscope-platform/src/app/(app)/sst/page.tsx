"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";

export default function SstDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ trainings: 0, inspections: 0, ncs: 0, incidents: 0 });

  useEffect(() => {
    Promise.all([
      apiFetch("/api/sst/trainings?pageSize=1", token),
      apiFetch("/api/sst/inspections?pageSize=1", token),
      apiFetch("/api/sst/nonconformities?pageSize=1", token),
      apiFetch("/api/sst/incidents?pageSize=1", token)
    ])
      .then(([trainings, inspections, ncs, incidents]) => {
        setSummary({
          trainings: trainings.data.total,
          inspections: inspections.data.total,
          ncs: ncs.data.total,
          incidents: incidents.data.total
        });
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <Header title="Seguranca do Trabalho" subtitle="Conformidade e eventos SST" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Treinamentos</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : summary.trainings}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Inspecoes</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : summary.inspections}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Nao conformidades</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : summary.ncs}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs uppercase text-muted">Incidentes</p>
          <p className="mt-4 text-2xl font-semibold">{loading ? "..." : summary.incidents}</p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Alertas SST</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Treinamentos vencendo: configure filtros no modulo Treinamentos.</li>
            <li>Inspecoes atrasadas: valide periodicidade dos checklists.</li>
            <li>NCs pendentes: acompanhe prazos no modulo NC.</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Score SST</h3>
          <p className="mt-4 text-sm text-muted">Score calculado a partir de incidentes, NCs e treinamentos.</p>
        </div>
      </div>
    </div>
  );
}
