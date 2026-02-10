"use client";

import { Header } from "@/components/layout/Header";

export default function AdministracaoPage() {
  return (
    <div className="space-y-6">
      <Header title="Administracao" subtitle="Configuracoes e permissao" />
      <div className="card p-6 text-sm text-muted">Area reservada para ajustes de roles, projetos e integracoes.</div>
    </div>
  );
}
