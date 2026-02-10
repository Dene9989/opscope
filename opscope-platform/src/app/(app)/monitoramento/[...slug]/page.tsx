"use client";

import { Header } from "@/components/layout/Header";

export default function MonitoramentoPlaceholder() {
  return (
    <div className="space-y-6">
      <Header title="Monitoramento" subtitle="Area em integracao com modulos existentes" />
      <div className="card p-6 text-sm text-muted">
        Placeholder para paginas de monitoramento. Conecte com seus modulos atuais conforme necessario.
      </div>
    </div>
  );
}
