"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface Training {
  id: string;
  name: string;
  nr?: string | null;
  hours: number;
  validityDays: number;
}

export default function TreinamentosPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", nr: "", hours: 8, validityDays: 365 });

  const load = () => {
    setLoading(true);
    apiFetch("/api/sst/trainings?pageSize=50", token)
      .then((response) => setRows(response.data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async () => {
    try {
      await apiFetch("/api/sst/trainings", token, {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          nr: form.nr || null,
          hours: Number(form.hours),
          validityDays: Number(form.validityDays)
        })
      });
      push("Treinamento criado", "success");
      setOpen(false);
      setForm({ name: "", nr: "", hours: 8, validityDays: 365 });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Treinamentos" subtitle="Cadastros e validade" />

      <div className="flex justify-between">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
          Novo treinamento
        </button>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem treinamentos"
        columns={[
          { key: "name", label: "Treinamento" },
          { key: "nr", label: "NR", render: (row) => row.nr || "-" },
          { key: "hours", label: "Carga" },
          { key: "validityDays", label: "Validade (dias)" }
        ]}
      />

      <ModalForm
        open={open}
        title="Novo treinamento"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreate}>
              Salvar
            </button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Nome</label>
            <input className="input mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">NR</label>
            <input className="input mt-2" value={form.nr} onChange={(e) => setForm({ ...form, nr: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Carga horaria</label>
            <input
              className="input mt-2"
              type="number"
              value={form.hours}
              onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Validade (dias)</label>
            <input
              className="input mt-2"
              type="number"
              value={form.validityDays}
              onChange={(e) => setForm({ ...form, validityDays: Number(e.target.value) })}
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
