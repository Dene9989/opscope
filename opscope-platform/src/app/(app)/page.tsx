"use client";

import { Header } from "@/components/layout/Header";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Header title="Dashboard" subtitle="Visao geral da operacao" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["Projetos ativos", "Itens em baixa", "Inspecoes atrasadas", "NCs abertas"].map((label) => (
          <div key={label} className="card p-4">
            <p className="text-xs uppercase text-muted">{label}</p>
            <p className="mt-4 text-2xl font-semibold">-</p>
            <p className="text-xs text-muted mt-2">Dados carregados via API</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Alertas prioritarios</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Estoque minimo: aguarde dados reais do inventario.</li>
            <li>Treinamentos vencendo: aguarde dados reais do SST.</li>
            <li>Inspecoes atrasadas: aguarde dados reais do SST.</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold">Ultimas movimentacoes</h3>
          <p className="mt-4 text-sm text-muted">Integra em /api/inventory/movements.</p>
        </div>
      </div>
    </div>
  );
}
