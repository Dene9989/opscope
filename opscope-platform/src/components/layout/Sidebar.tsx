"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "Execucao",
    items: [
      { label: "Execucao do Dia", href: "/execucao/dia" },
      { label: "Backlog", href: "/execucao/backlog" },
      { label: "Solicitacoes Pendentes", href: "/execucao/solicitacoes" },
      { label: "Locais de Trabalho", href: "/execucao/locais" }
    ]
  },
  {
    title: "Monitoramento e Metricas",
    items: [
      { label: "Desempenho Geral", href: "/monitoramento/geral" },
      { label: "Por Projeto", href: "/monitoramento/projeto" },
      { label: "Por Colaborador", href: "/monitoramento/colaborador" },
      { label: "KPIs e Tendencias", href: "/monitoramento/kpis" }
    ]
  },
  {
    title: "Relatorios",
    items: [{ label: "Relatorios", href: "/relatorios" }]
  },
  {
    title: "Pessoas e Equipes",
    items: [{ label: "Pessoas e Equipes", href: "/pessoas" }]
  },
  {
    title: "Administracao",
    items: [{ label: "Administracao", href: "/administracao" }]
  },
  {
    title: "Almoxarifado",
    items: [
      { label: "Dashboard", href: "/almoxarifado" },
      { label: "Itens", href: "/almoxarifado/itens" },
      { label: "Estoque por Projeto", href: "/almoxarifado/estoque" },
      { label: "Movimentacoes", href: "/almoxarifado/movimentacoes" },
      { label: "EPIs por Colaborador", href: "/almoxarifado/epis-colaborador" },
      { label: "Scan QR", href: "/almoxarifado/scan" }
    ]
  },
  {
    title: "Seguranca do Trabalho (SST)",
    items: [
      { label: "Dashboard", href: "/sst" },
      { label: "Treinamentos", href: "/sst/treinamentos" },
      { label: "Inspecoes", href: "/sst/inspecoes" },
      { label: "Nao Conformidades", href: "/sst/nao-conformidades" },
      { label: "Incidentes", href: "/sst/incidentes" },
      { label: "APR / PT", href: "/sst/apr-pt" }
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col w-72 bg-surface border-r border-border px-5 py-6">
      <div className="text-lg font-semibold">OPSCOPE</div>
      <nav className="mt-6 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs uppercase text-muted tracking-widest">{section.title}</p>
            <div className="mt-3 space-y-2">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      active ? "bg-primary/20 text-primary" : "text-slate-200 hover:bg-border"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
