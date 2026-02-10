"use client";

import { useEffect, useMemo, useState } from "react";
import { ModalForm } from "@/components/ui/ModalForm";
import { apiFetch } from "@/lib/client";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";

interface Option {
  id: string;
  name: string;
}

interface WorksiteOption {
  id: string;
  name: string;
  projectId: string;
}

interface BatchOption {
  id: string;
  batchCode: string;
}

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultItemId?: string;
  defaultProjectId?: string;
  defaultWorksiteId?: string;
}

export function ReservationModal({
  open,
  onClose,
  onSuccess,
  defaultItemId,
  defaultProjectId,
  defaultWorksiteId
}: ReservationModalProps) {
  const { token } = useAuth();
  const { push } = useToast();
  const [items, setItems] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);
  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [form, setForm] = useState({
    itemId: defaultItemId || "",
    projectId: defaultProjectId || "",
    worksiteId: defaultWorksiteId || "",
    batchId: "",
    qty: 1,
    referenceType: "MANUAL",
    referenceId: "",
    notes: ""
  });

  useEffect(() => {
    if (!open) return;
    Promise.all([
      apiFetch("/api/inventory/items?pageSize=200", token),
      apiFetch("/api/core/projects?pageSize=200", token),
      apiFetch("/api/core/worksites?pageSize=200", token)
    ])
      .then(([itemsResponse, projectsResponse, worksitesResponse]) => {
        setItems(itemsResponse.data.items);
        setProjects(projectsResponse.data.items);
        setWorksites(worksitesResponse.data.items);
      })
      .catch(() => push("Erro ao carregar dados", "error"));
  }, [open, token, push]);

  useEffect(() => {
    if (!open || !form.itemId || !form.projectId) {
      setBatches([]);
      return;
    }

    apiFetch(
      `/api/inventory/batches?itemId=${form.itemId}&projectId=${form.projectId}`,
      token
    )
      .then((response) => setBatches(response.data.items))
      .catch(() => setBatches([]));
  }, [open, form.itemId, form.projectId, token]);

  const filteredWorksites = useMemo(() => {
    if (!form.projectId) return worksites;
    return worksites.filter((worksite) => worksite.projectId === form.projectId);
  }, [worksites, form.projectId]);

  const handleSubmit = async () => {
    try {
      await apiFetch("/api/inventory/reservations", token, {
        method: "POST",
        body: JSON.stringify({
          itemId: form.itemId,
          projectId: form.projectId,
          worksiteId: form.worksiteId || null,
          batchId: form.batchId || null,
          qty: Number(form.qty),
          referenceType: form.referenceType || null,
          referenceId: form.referenceId || null,
          notes: form.notes || null
        })
      });
      push("Reserva criada", "success");
      onSuccess?.();
      onClose();
    } catch (error) {
      push(error instanceof Error ? error.message : "Erro ao reservar", "error");
    }
  };

  return (
    <ModalForm
      open={open}
      title="Criar reserva"
      onClose={onClose}
      footer={
        <>
          <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
            onClick={handleSubmit}
          >
            Reservar
          </button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
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
          <label className="text-xs uppercase text-muted">Quantidade</label>
          <input
            className="input mt-2"
            type="number"
            min={1}
            value={form.qty}
            onChange={(event) => setForm((prev) => ({ ...prev, qty: Number(event.target.value) }))}
          />
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
        <div>
          <label className="text-xs uppercase text-muted">Local</label>
          <select
            className="select mt-2"
            value={form.worksiteId}
            onChange={(event) => setForm((prev) => ({ ...prev, worksiteId: event.target.value }))}
          >
            <option value="">Opcional</option>
            {filteredWorksites.map((worksite) => (
              <option key={worksite.id} value={worksite.id}>
                {worksite.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-muted">Lote</label>
          <select
            className="select mt-2"
            value={form.batchId}
            onChange={(event) => setForm((prev) => ({ ...prev, batchId: event.target.value }))}
          >
            <option value="">Automatico</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batchCode}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-muted">Referencia</label>
          <select
            className="select mt-2"
            value={form.referenceType}
            onChange={(event) => setForm((prev) => ({ ...prev, referenceType: event.target.value }))}
          >
            {"MANUAL,ATIVIDADE_EXECUCAO,OS".split(",").map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs uppercase text-muted">ID Referencia</label>
          <input
            className="input mt-2"
            value={form.referenceId}
            onChange={(event) => setForm((prev) => ({ ...prev, referenceId: event.target.value }))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs uppercase text-muted">Observacoes</label>
          <textarea
            className="input mt-2 min-h-[80px]"
            value={form.notes}
            onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          />
        </div>
      </div>
    </ModalForm>
  );
}

