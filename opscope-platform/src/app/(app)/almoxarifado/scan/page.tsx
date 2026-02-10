"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { apiFetch } from "@/lib/client";
import { useAuth } from "@/components/auth/AuthContext";
import { MovementWizard } from "@/components/inventory/MovementWizard";
import { RoleGate } from "@/components/auth/RoleGate";

interface Item {
  id: string;
  name: string;
  type: string;
  unit: string;
  status: string;
}

type MovementType = "ENTRADA" | "ENTREGA" | "DEVOLUCAO" | "TRANSFERENCIA" | "AJUSTE" | "BAIXA";

export default function ScanPage() {
  const { token } = useAuth();
  const [code, setCode] = useState("");
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wizard, setWizard] = useState<{ open: boolean; type: MovementType }>({ open: false, type: "ENTRADA" });

  const handleScan = async () => {
    setError(null);
    const match = code.match(/OPSCOPE:ITEM:(.+)$/i);
    if (!match || !match[1]) {
      setError("QR invalido. Use OPSCOPE:ITEM:<id>");
      return;
    }

    try {
      const response = await apiFetch(`/api/inventory/items/${match[1]}`, token);
      setItem(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Item nao encontrado");
    }
  };

  return (
    <RoleGate roles={["ADMIN", "GESTOR", "ALMOXARIFE", "SUPERVISOR"]}>
      <div className="space-y-6">
        <Header title="Scan QR" subtitle="Identifique itens e acione fluxos rapidos" />

        <div className="card p-6 space-y-3">
          <label className="text-xs uppercase text-muted">Cole o codigo do QR</label>
          <div className="flex flex-wrap gap-2">
            <input
              className="input flex-1"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="OPSCOPE:ITEM:uuid"
            />
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleScan}>
              Identificar
            </button>
          </div>
          {error ? <div className="text-sm text-red-400">{error}</div> : null}
        </div>

        {item ? (
          <div className="card p-6 space-y-3">
            <div className="text-lg font-semibold">{item.name}</div>
            <div className="text-sm text-muted">{item.type} · {item.unit} · {item.status}</div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setWizard({ open: true, type: "ENTRADA" })}>
                Entrada
              </button>
              <button className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setWizard({ open: true, type: "ENTREGA" })}>
                Entrega
              </button>
              <button className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setWizard({ open: true, type: "TRANSFERENCIA" })}>
                Transferencia
              </button>
            </div>
          </div>
        ) : null}

        <MovementWizard
          open={wizard.open}
          onClose={() => setWizard({ open: false, type: "ENTRADA" })}
          defaultType={wizard.type}
          defaultItemId={item?.id}
          startOnForm
        />
      </div>
    </RoleGate>
  );
}
