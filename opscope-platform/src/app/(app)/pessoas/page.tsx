"use client";

import { Header } from "@/components/layout/Header";

export default function PessoasPage() {
  return (
    <div className="space-y-6">
      <Header title="Pessoas e Equipes" subtitle="Usuarios, equipes e funcoes" />
      <div className="card p-6 text-sm text-muted">Integre com seus cadastros atuais de colaboradores.</div>
    </div>
  );
}
