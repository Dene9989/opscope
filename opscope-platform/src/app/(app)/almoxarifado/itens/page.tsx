"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { ModalForm } from "@/components/ui/ModalForm";
import { useAuth } from "@/components/auth/AuthContext";
import { apiFetch } from "@/lib/client";
import { useToast } from "@/components/ui/Toast";
import { RoleGate } from "@/components/auth/RoleGate";

interface Item {
  id: string;
  name: string;
  type: string;
  unit: string;
  status: string;
  internalCode?: string | null;
  caNumber?: string | null;
  caValidUntil?: string | null;
  itemValidUntil?: string | null;
  stockTotal: number;
  stockAvailable: number;
  stockReserved: number;
}

interface Option {
  id: string;
  name: string;
}

export default function ItensPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { push } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ q: "", type: "", status: "", projectId: "", validity: "" });
  const [form, setForm] = useState({
    type: "EPI",
    name: "",
    unit: "UN",
    status: "ATIVO",
    internalCode: "",
    barcode: "",
    brand: "",
    model: "",
    description: "",
    caNumber: "",
    caValidUntil: "",
    itemValidUntil: "",
    sizes: ""
  });

  const pageSize = 20;

  const loadItems = () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (filters.q) params.set("q", filters.q);
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    if (filters.projectId) params.set("projectId", filters.projectId);
    if (filters.validity) params.set("validity", filters.validity);

    apiFetch(`/api/inventory/items?${params.toString()}`, token)
      .then((response) => {
        setItems(response.data.items);
        setTotal(response.data.total);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadItems();
  }, [token, page, filters]);

  useEffect(() => {
    apiFetch("/api/core/projects?pageSize=200", token)
      .then((response) => setProjects(response.data.items))
      .catch(() => setProjects([]));
  }, [token]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  const handleCreate = async () => {
    try {
      const payload: any = {
        type: form.type,
        name: form.name,
        unit: form.unit,
        status: form.status,
        internalCode: form.internalCode || null,
        barcode: form.barcode || null,
        brand: form.brand || null,
        model: form.model || null,
        description: form.description || null,
        caNumber: form.caNumber || null,
        caValidUntil: form.caValidUntil || null,
        itemValidUntil: form.itemValidUntil || null,
        sizes: form.sizes ? form.sizes.split(",").map((value) => value.trim()) : null
      };

      await apiFetch("/api/inventory/items", token, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      push("Item criado com sucesso", "success");
      setOpen(false);
      setStep(1);
      setForm({
        type: "EPI",
        name: "",
        unit: "UN",
        status: "ATIVO",
        internalCode: "",
        barcode: "",
        brand: "",
        model: "",
        description: "",
        caNumber: "",
        caValidUntil: "",
        itemValidUntil: "",
        sizes: ""
      });
      loadItems();
    } catch (err) {
      push(err instanceof Error ? err.message : "Erro ao criar", "error");
    }
  };

  return (
    <RoleGate roles={["ADMIN", "GESTOR", "ALMOXARIFE", "SUPERVISOR"]}>
    <div className="space-y-6">
      <Header title="Itens" subtitle="Cadastro completo de ferramentas, EPIs e EPCs" />

      {error ? <div className="card p-4 text-sm text-red-400">{error}</div> : null}

      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div className="flex flex-wrap gap-2">
          <input
            className="input"
            placeholder="Buscar por nome, codigo ou barcode"
            value={filters.q}
            onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
          />
          <select
            className="select"
            value={filters.type}
            onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
          >
            <option value="">Tipo</option>
            {"FERRAMENTA,EPI,EPC,CONSUMIVEL".split(",").map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="">Status</option>
            {"ATIVO,INATIVO".split(",").map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={filters.validity}
            onChange={(event) => setFilters((prev) => ({ ...prev, validity: event.target.value }))}
          >
            <option value="">Validade</option>
            <option value="EXPIRING">Vencendo (30d)</option>
            <option value="EXPIRED">Vencido</option>
          </select>
          <select
            className="select"
            value={filters.projectId}
            onChange={(event) => setFilters((prev) => ({ ...prev, projectId: event.target.value }))}
          >
            <option value="">Projeto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setOpen(true)}>
            Novo item
          </button>
          <a className="rounded-lg border border-border px-4 py-2 text-sm" href="/api/inventory/items?format=csv">
            Exportar CSV
          </a>
        </div>
      </div>

      <DataTable
        loading={loading}
        rows={items}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/almoxarifado/itens/${row.id}`)}
        emptyMessage="Nenhum item cadastrado"
        columns={[
          { key: "name", label: "Item" },
          { key: "type", label: "Tipo" },
          { key: "unit", label: "Unidade" },
          {
            key: "ca",
            label: "CA",
            render: (row) => row.caNumber || "-"
          },
          {
            key: "validade",
            label: "Validade",
            render: (row) => (row.itemValidUntil ? new Date(row.itemValidUntil).toLocaleDateString("pt-BR") : "-")
          },
          {
            key: "estoque",
            label: "Estoque",
            render: (row) => row.stockTotal
          }
        ]}
        actions={(row) => (
          <a className="text-primary underline" href={`/api/inventory/items/${row.id}/qrcode`}>
            QR
          </a>
        )}
      />

      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          Pagina {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button className="rounded-lg border border-border px-3 py-2" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Anterior
          </button>
          <button className="rounded-lg border border-border px-3 py-2" disabled={page >= totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
            Proxima
          </button>
        </div>
      </div>

      <ModalForm
        open={open}
        title="Novo item"
        onClose={() => setOpen(false)}
        footer={
          <>
            {step > 1 ? (
              <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setStep((prev) => prev - 1)}>
                Voltar
              </button>
            ) : null}
            {step < 3 ? (
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={() => setStep((prev) => prev + 1)}>
                Continuar
              </button>
            ) : (
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black" onClick={handleCreate}>
                Salvar
              </button>
            )}
          </>
        }
      >
        {step === 1 ? (
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
              <label className="text-xs uppercase text-muted">Status</label>
              <select
                className="select mt-2"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
              >
                {"ATIVO,INATIVO".split(",").map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Descricao</label>
              <input
                className="input mt-2"
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4 md:grid-cols-2">
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
            <div>
              <label className="text-xs uppercase text-muted">Marca</label>
              <input
                className="input mt-2"
                value={form.brand}
                onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Modelo</label>
              <input
                className="input mt-2"
                value={form.model}
                onChange={(event) => setForm((prev) => ({ ...prev, model: event.target.value }))}
              />
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase text-muted">CA (EPI)</label>
              <input
                className="input mt-2"
                value={form.caNumber}
                onChange={(event) => setForm((prev) => ({ ...prev, caNumber: event.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Validade CA</label>
              <input
                className="input mt-2"
                type="date"
                value={form.caValidUntil}
                onChange={(event) => setForm((prev) => ({ ...prev, caValidUntil: event.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Validade item</label>
              <input
                className="input mt-2"
                type="date"
                value={form.itemValidUntil}
                onChange={(event) => setForm((prev) => ({ ...prev, itemValidUntil: event.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs uppercase text-muted">Tamanhos (separados por virgula)</label>
              <input
                className="input mt-2"
                value={form.sizes}
                onChange={(event) => setForm((prev) => ({ ...prev, sizes: event.target.value }))}
              />
            </div>
          </div>
        ) : null}
      </ModalForm>
    </div>
    </RoleGate>
  );
}

