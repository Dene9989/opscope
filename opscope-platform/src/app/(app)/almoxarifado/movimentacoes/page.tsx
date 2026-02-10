"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";

interface Movement {
  id: string;
  type: string;
  quantity: number;
  createdAt: string;
  item: { name: string };
  project: { name: string };
}

interface ItemOption {
  id: string;
  name: string;
}

interface ProjectOption {
  id: string;
  name: string;
}

export default function MovimentacoesPage() {
  const { token } = useAuth();
  const { push } = useToast();
  const [rows, setRows] = useState<Movement[]>([]);
  const [items, setItems] = useState<ItemOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [scan, setScan] = useState("");
  const [form, setForm] = useState({
    type: "ENTRADA",
    itemId: "",
    quantity: 1,
    projectId: ""
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/inventory/movements?pageSize=50", token),
      apiFetch("/api/inventory/items?pageSize=100", token),
      apiFetch("/api/core/projects?pageSize=50", token)
    ])
      .then(([movementResponse, itemResponse, projectResponse]) => {
        setRows(movementResponse.data.items);
        setItems(itemResponse.data.items);
        setProjects(projectResponse.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async () => {
    try {
      await apiFetch("/api/inventory/movements", token, {
        method: "POST",
        body: JSON.stringify(form)
      });
      push("Movimentacao registrada", "success");
      setOpen(false);
      setForm({ type: "ENTRADA", itemId: "", quantity: 1, projectId: "" });
      load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao registrar", "error");
    }
  };

  const handleScan = () => {
    const match = scan.match(/OPSCOPE:ITEM:(.+)$/i);
    if (match && match[1]) {
      setForm((prev) => ({ ...prev, itemId: match[1] }));
      push("Item identificado pelo QR", "success");
    } else if (scan.trim()) {
      push("QR invalido. Use OPSCOPE:ITEM:<id>", "error");
    }
  };

  return (
    <div className="space-y-6">
      <Header title="Movimentacoes" subtitle="Entrada, saida, transferencia e ajustes" />

      <div className="flex justify-between">
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
          Nova movimentacao
        </button>
      </div>

      <DataTable
        loading={loading}
        rows={rows}
        emptyMessage="Sem movimentacoes"
        columns={[
          { key: "type", label: "Tipo" },
          { key: "item", label: "Item", render: (row) => row.item.name },
          { key: "project", label: "Projeto", render: (row) => row.project.name },
          { key: "quantity", label: "Qtd" },
          {
            key: "createdAt",
            label: "Data",
            render: (row) => new Date(row.createdAt).toLocaleDateString("pt-BR")
          },
          {
            key: "term",
            label: "Termo",
            render: (row) => (
              <a className="text-primary underline" href={`/api/inventory/movements/${row.id}/term`}>
                PDF
              </a>
            )
          }
        ]}
      />

      <ModalForm
        open={open}
        title="Nova movimentacao"
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
              {"ENTRADA,SAIDA,TRANSFERENCIA,AJUSTE,DEVOLUCAO,PERDA_BAIXA,RESERVA,LIBERACAO_RESERVA"
                .split(",")
                .map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Quantidade</label>
            <input
              className="input mt-2"
              type="number"
              min={1}
              value={form.quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, quantity: Number(event.target.value) }))}
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Item</label>
            <select
              className="select mt-2"
              value={form.itemId}
              onChange={(event) => setForm((prev) => ({ ...prev, itemId: event.target.value }))}
            >
              <option value="">Selecione</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase text-muted">Projeto</label>
            <select
              className="select mt-2"
              value={form.projectId}
              onChange={(event) => setForm((prev) => ({ ...prev, projectId: event.target.value }))}
            >
              <option value="">Selecione</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase text-muted">Leitura QR (cole ou escaneie)</label>
            <div className="flex gap-2 mt-2">
              <input
                className="input"
                value={scan}
                onChange={(event) => setScan(event.target.value)}
                placeholder="OPSCOPE:ITEM:uuid"
              />
              <button className="rounded-lg border border-border px-4 py-2 text-sm" type="button" onClick={handleScan}>
                Ler QR
              </button>
            </div>
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
