"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface NonConformity {
  id: string;
  severity: string;
  status: string;
  description: string;
  dueDate: string;
}

export default function NaoConformidadesPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<NonConformity[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    originType: "OBSERVACAO",
    severity: "MEDIA",
    description: "",
    responsibleId: "",
    dueDate: new Date().toISOString().slice(0, 10)
  });

  const load = () => {
    setLoading(true);
    apiFetch("/api/sst/nonconformities?pageSize=50", token)
      .then((response) => setRows(response.data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async () => {
    try {
      await apiFetch("/api/sst/nonconformities", token, {
        method: "POST",
        body: JSON.stringify({
          originType: form.originType,
          severity: form.severity,
          description: form.description,
          responsibleId: form.responsibleId,
          dueDate: form.dueDate,
          status: "ABERTA"
        })
      });
      push("NC registrada", "success");
      setOpen(false);
      setForm({ originType: "OBSERVACAO", severity: "MEDIA", description: "", responsibleId: "", dueDate: form.dueDate });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Nao Conformidades" subtitle="Gestao de desvios" />
      <div className="flex justify-between">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
          Nova NC
        </button>
      </div>
      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem nao conformidades"
        columns={[
          { key: "description", label: "Descricao" },
          { key: "severity", label: "Severidade" },
          { key: "status", label: "Status" },
          {
            key: "dueDate",
            label: "Prazo",
            render: (row) => new Date(row.dueDate).toLocaleDateString("pt-BR")
          }
        ]}
      />

      <ModalForm
        open={open}
        title="Nova NC"
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
        <div className="grid gap-4">
          <div>
            <label className="text-xs uppercase text-muted">Descricao</label>
            <textarea
              className="input mt-2 h-24"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase text-muted">Origem</label>
              <select
                className="select mt-2"
                value={form.originType}
                onChange={(e) => setForm({ ...form, originType: e.target.value })}
              >
                <option value="INSPECAO">INSPECAO</option>
                <option value="OBSERVACAO">OBSERVACAO</option>
                <option value="INCIDENTE">INCIDENTE</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Severidade</label>
              <select
                className="select mt-2"
                value={form.severity}
                onChange={(e) => setForm({ ...form, severity: e.target.value })}
              >
                <option value="BAIXA">BAIXA</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
                <option value="CRITICA">CRITICA</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Responsavel (UserId)</label>
              <input
                className="input mt-2"
                value={form.responsibleId}
                onChange={(e) => setForm({ ...form, responsibleId: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Prazo</label>
              <input
                className="input mt-2"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
