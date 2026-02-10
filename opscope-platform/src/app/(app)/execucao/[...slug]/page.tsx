"use client";

import { Header } from "@/components/layout/Header";

export default function ExecucaoPlaceholder() {
  return (
    <div className="space-y-6">
      <Header title="Execucao" subtitle="Area em integracao com modulos existentes" />
      <div className="card p-6 text-sm text-muted">
        Placeholder para paginas de execucao. Conecte com seus modulos atuais conforme necessario.
      </div>
    </div>
  );
}
