"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface Item {
  id: string;
  name: string;
  type: string;
  unit: string;
  status: string;
  internalCode?: string | null;
  caValidUntil?: string | null;
}

export default function ItensPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "EPI",
    name: "",
    unit: "UN",
    status: "ATIVO",
    internalCode: "",
    barcode: ""
  });

  const loadItems = () => {
    setLoading(true);
    apiFetch("/api/inventory/items?pageSize=50", token)
      .then((response) => {
        setItems(response.data.items);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, [token]);

  const handleCreate = async () => {
    try {
      await apiFetch("/api/inventory/items", token, {
        method: "POST",
        body: JSON.stringify(form)
      });
      push("Item criado com sucesso", "success");
      setOpen(false);
      setForm({ type: "EPI", name: "", unit: "UN", status: "ATIVO", internalCode: "", barcode: "" });
      loadItems();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Itens" subtitle="Cadastro de ferramentas, EPIs e EPCs" />

      {error ? <div className="card p-4 text-sm text-red-400">{error}</div> : null}

      <div className="flex justify-between">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
          Novo item
        </button>
        <a
          className="rounded-lg border border-border px-4 py-2 text-sm"
          href="/api/inventory/items?format=csv"
        >
          Exportar CSV
        </a>
      </div>

      <DataTable
        loading={loading}
        rows={items}
        emptyMessage="Nenhum item cadastrado"
        columns={[
          { key: "name", label: "Item" },
          { key: "type", label: "Tipo" },
          { key: "unit", label: "Unidade" },
          { key: "status", label: "Status" },
          {
            key: "internalCode",
            label: "Codigo",
            render: (row) => row.internalCode || "-"
          },
          {
            key: "qr",
            label: "QR",
            render: (row) => (
              <a className="text-primary underline" href={`/api/inventory/items/${row.id}/qrcode`}>
                Baixar
              </a>
            )
          }
        ]}
      />

      <ModalForm
        open={open}
        title="Novo item"
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
          <div>
            <label className="text-xs uppercase text-muted">Tipo</label>
            <select
              className="select mt-2"
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            >
              {"FERRAMENTA,EPI,EPC,CONSUMIVEL".split(",").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Unidade</label>
            <select
              className="select mt-2"
              value={form.unit}
              onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))}
            >
              {"UN,PAR,CX".split(",").map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Nome</label>
            <input
              className="input mt-2"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Codigo interno</label>
            <input
              className="input mt-2"
              value={form.internalCode}
              onChange={(event) => setForm((prev) => ({ ...prev, internalCode: event.target.value }))}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Codigo de barras</label>
            <input
              className="input mt-2"
              value={form.barcode}
              onChange={(event) => setForm((prev) => ({ ...prev, barcode: event.target.value }))}
            />
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
