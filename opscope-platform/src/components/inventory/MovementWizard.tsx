"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ModalForm } from "@/components/ui/ModalForm";
import { apiFetch } from "@/lib/client";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";

const movementTypes = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "ENTREGA", label: "Entrega" },
  { value: "DEVOLUCAO", label: "Devolucao" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
  { value: "AJUSTE", label: "Ajuste" },
  { value: "BAIXA", label: "Baixa/Perda" }
] as const;

type MovementType = (typeof movementTypes)[number]["value"];

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

interface ReservationOption {
  id: string;
  qty: number;
  status: string;
}

interface MovementOption {
  id: string;
  qty: number;
  createdAt: string;
}

interface MovementWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultType?: MovementType;
  defaultItemId?: string;
  defaultProjectId?: string;
  defaultWorksiteId?: string;
  startOnForm?: boolean;
}

export function MovementWizard({
  open,
  onClose,
  onSuccess,
  defaultType = "ENTRADA",
  defaultItemId,
  defaultProjectId,
  defaultWorksiteId,
  startOnForm = false
}: MovementWizardProps) {
  const { token } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const [step, setStep] = useState<"type" | "form">("type");
  const [type, setType] = useState<MovementType>(defaultType);

  const [items, setItems] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);
  const [collaborators, setCollaborators] = useState<Option[]>([]);

  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [reservations, setReservations] = useState<ReservationOption[]>([]);
  const [deliveries, setDeliveries] = useState<MovementOption[]>([]);

  const [form, setForm] = useState({
    itemId: defaultItemId || "",
    projectId: defaultProjectId || "",
    worksiteId: defaultWorksiteId || "",
    qty: 1,
    batchId: "",
    batchCode: "",
    itemValidUntil: "",
    caValidUntil: "",
    unitCost: "",
    invoiceNumber: "",
    collaboratorId: "",
    reservationId: "",
    relatedMovementId: "",
    projectOriginId: "",
    worksiteOriginId: "",
    projectDestinationId: "",
    worksiteDestinationId: "",
    direction: "IN",
    reason: "",
    notes: "",
    termAccepted: false,
    termName: "",
    termCpf: "",
    attachmentName: "",
    attachmentUrl: "",
    attachments: [] as Array<{ name: string; url: string }>
  });

  useEffect(() => {
    if (!open) return;
    setType(defaultType);
    setStep(startOnForm ? "form" : "type");
    setForm({
      itemId: defaultItemId || "",
      projectId: defaultProjectId || "",
      worksiteId: defaultWorksiteId || "",
      qty: 1,
      batchId: "",
      batchCode: "",
      itemValidUntil: "",
      caValidUntil: "",
      unitCost: "",
      invoiceNumber: "",
      collaboratorId: "",
      reservationId: "",
      relatedMovementId: "",
      projectOriginId: defaultProjectId || "",
      worksiteOriginId: defaultWorksiteId || "",
      projectDestinationId: "",
      worksiteDestinationId: "",
      direction: "IN",
      reason: "",
      notes: "",
      termAccepted: false,
      termName: "",
      termCpf: "",
      attachmentName: "",
      attachmentUrl: "",
      attachments: []
    });

    Promise.all([
      apiFetch("/api/inventory/items?pageSize=200", token),
      apiFetch("/api/core/projects?pageSize=200", token),
      apiFetch("/api/core/worksites?pageSize=200", token),
      apiFetch("/api/core/users?pageSize=200", token)
    ])
      .then(([itemsResponse, projectsResponse, worksitesResponse, usersResponse]) => {
        setItems(itemsResponse.data.items);
        setProjects(projectsResponse.data.items);
        setWorksites(worksitesResponse.data.items);
        setCollaborators(usersResponse.data.items);
      })
      .catch(() => push("Erro ao carregar dados base", "error"));
  }, [
    open,
    token,
    push,
    defaultType,
    defaultItemId,
    defaultProjectId,
    defaultWorksiteId,
    startOnForm
  ]);

  const filteredWorksites = useMemo(() => {
    if (!form.projectId) return worksites;
    return worksites.filter((worksite) => worksite.projectId === form.projectId);
  }, [worksites, form.projectId]);

  const originWorksites = useMemo(() => {
    if (!form.projectOriginId) return worksites;
    return worksites.filter((worksite) => worksite.projectId === form.projectOriginId);
  }, [worksites, form.projectOriginId]);

  const destinationWorksites = useMemo(() => {
    if (!form.projectDestinationId) return worksites;
    return worksites.filter((worksite) => worksite.projectId === form.projectDestinationId);
  }, [worksites, form.projectDestinationId]);

  useEffect(() => {
    const batchProjectId = type === "TRANSFERENCIA" ? form.projectOriginId : form.projectId;
    if (!open || !form.itemId || !batchProjectId) {
      setBatches([]);
      return;
    }

    apiFetch(
      `/api/inventory/batches?itemId=${form.itemId}&projectId=${batchProjectId}`,
      token
    )
      .then((response) => setBatches(response.data.items))
      .catch(() => setBatches([]));
  }, [open, form.itemId, form.projectId, form.projectOriginId, token, type]);

  useEffect(() => {
    if (!open || !form.itemId || !form.projectId) {
      setReservations([]);
      return;
    }

    apiFetch(
      `/api/inventory/reservations?itemId=${form.itemId}&projectId=${form.projectId}`,
      token
    )
      .then((response) =>
        setReservations(
          response.data.items.filter(
            (reservation: ReservationOption) =>
              reservation.status !== "CANCELADO" && reservation.status !== "CONSUMIDO"
          )
        )
      )
      .catch(() => setReservations([]));
  }, [open, form.itemId, form.projectId, token]);

  useEffect(() => {
    if (!open || type !== "DEVOLUCAO" || !form.itemId || !form.projectId) {
      setDeliveries([]);
      return;
    }

    const collaboratorFilter = form.collaboratorId ? `&collaboratorId=${form.collaboratorId}` : "";
    apiFetch(
      `/api/inventory/movements?type=ENTREGA&itemId=${form.itemId}&projectId=${form.projectId}${collaboratorFilter}`,
      token
    )
      .then((response) => setDeliveries(response.data.items))
      .catch(() => setDeliveries([]));
  }, [open, type, form.itemId, form.projectId, form.collaboratorId, token]);

  const handleSubmit = async () => {
    try {
      const payload: any = { type };
      const attachments = form.attachments.length ? form.attachments : undefined;

      if (type === "ENTRADA") {
        payload.itemId = form.itemId;
        payload.projectId = form.projectId;
        payload.worksiteId = form.worksiteId || null;
        payload.qty = Number(form.qty);
        payload.batchId = form.batchId || null;
        payload.batchCode = form.batchCode || null;
        payload.itemValidUntil = form.itemValidUntil || null;
        payload.caValidUntil = form.caValidUntil || null;
        payload.unitCost = form.unitCost ? Number(form.unitCost) : null;
        payload.invoiceNumber = form.invoiceNumber || null;
        payload.reason = form.reason || null;
        payload.notes = form.notes || null;
        payload.attachments = attachments;
      }

      if (type === "ENTREGA") {
        payload.itemId = form.itemId;
        payload.projectId = form.projectId;
        payload.worksiteId = form.worksiteId || null;
        payload.qty = Number(form.qty);
        payload.batchId = form.batchId || null;
        payload.collaboratorId = form.collaboratorId;
        payload.reservationId = form.reservationId || null;
        payload.reason = form.reason || null;
        payload.notes = form.notes || null;
        payload.attachments = attachments;
        payload.term = {
          accepted: form.termAccepted,
          name: form.termName || undefined,
          cpf: form.termCpf || undefined
        };
      }

      if (type === "DEVOLUCAO") {
        payload.itemId = form.itemId;
        payload.projectId = form.projectId;
        payload.worksiteId = form.worksiteId || null;
        payload.qty = Number(form.qty);
        payload.relatedMovementId = form.relatedMovementId;
        payload.reason = form.reason || null;
        payload.notes = form.notes || null;
        payload.attachments = attachments;
      }

      if (type === "TRANSFERENCIA") {
        payload.itemId = form.itemId;
        payload.qty = Number(form.qty);
        payload.projectOriginId = form.projectOriginId;
        payload.worksiteOriginId = form.worksiteOriginId || null;
        payload.projectDestinationId = form.projectDestinationId;
        payload.worksiteDestinationId = form.worksiteDestinationId || null;
        payload.batchId = form.batchId || null;
        payload.reason = form.reason || null;
        payload.notes = form.notes || null;
        payload.attachments = attachments;
      }

      if (type === "AJUSTE") {
        payload.itemId = form.itemId;
        payload.projectId = form.projectId;
        payload.worksiteId = form.worksiteId || null;
        payload.qty = Number(form.qty);
        payload.direction = form.direction;
        payload.reason = form.reason || null;
        payload.notes = form.notes || null;
        payload.attachments = attachments;
      }

      if (type === "BAIXA") {
        payload.itemId = form.itemId;
        payload.projectId = form.projectId;
        payload.worksiteId = form.worksiteId || null;
        payload.qty = Number(form.qty);
        payload.reason = form.reason || null;
        payload.notes = form.notes || null;
        payload.batchId = form.batchId || null;
        payload.attachments = attachments;
      }

      await apiFetch("/api/inventory/movements", token, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      push("Movimentacao registrada", "success");
      onSuccess?.();
      onClose();
      router.refresh();
    } catch (error) {
      push(error instanceof Error ? error.message : "Erro ao salvar", "error");
    }
  };

  const renderTypeStep = () => (
    <div className="grid gap-4">
      <label className="text-xs uppercase text-muted">Tipo de movimentacao</label>
      <div className="grid gap-2 md:grid-cols-2">
        {movementTypes.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`rounded-lg border px-3 py-3 text-sm text-left ${
              type === option.value ? "border-primary text-primary" : "border-border"
            }`}
            onClick={() => setType(option.value)}
          >
            <div className="font-semibold">{option.label}</div>
            <div className="text-xs text-muted">Fluxo guiado</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCommonFields = () => (
    <>
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
    </>
  );

  const renderProjectFields = () => (
    <>
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
    </>
  );

  const renderEntryFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {renderCommonFields()}
      {renderProjectFields()}
      <div>
        <label className="text-xs uppercase text-muted">Lote (codigo)</label>
        <input
          className="input mt-2"
          value={form.batchCode}
          onChange={(event) => setForm((prev) => ({ ...prev, batchCode: event.target.value }))}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Validade do item</label>
        <input
          className="input mt-2"
          type="date"
          value={form.itemValidUntil}
          onChange={(event) => setForm((prev) => ({ ...prev, itemValidUntil: event.target.value }))}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Validade do CA</label>
        <input
          className="input mt-2"
          type="date"
          value={form.caValidUntil}
          onChange={(event) => setForm((prev) => ({ ...prev, caValidUntil: event.target.value }))}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Custo unitario</label>
        <input
          className="input mt-2"
          type="number"
          min={0}
          value={form.unitCost}
          onChange={(event) => setForm((prev) => ({ ...prev, unitCost: event.target.value }))}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-muted">NF / Documento</label>
        <input
          className="input mt-2"
          value={form.invoiceNumber}
          onChange={(event) => setForm((prev) => ({ ...prev, invoiceNumber: event.target.value }))}
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
  );

  const renderDeliveryFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {renderCommonFields()}
      {renderProjectFields()}
      <div>
        <label className="text-xs uppercase text-muted">Lote (opcional)</label>
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
        <label className="text-xs uppercase text-muted">Colaborador</label>
        <select
          className="select mt-2"
          value={form.collaboratorId}
          onChange={(event) => setForm((prev) => ({ ...prev, collaboratorId: event.target.value }))}
        >
          <option value="">Selecione</option>
          {collaborators.map((collaborator) => (
            <option key={collaborator.id} value={collaborator.id}>
              {collaborator.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Reserva (opcional)</label>
        <select
          className="select mt-2"
          value={form.reservationId}
          onChange={(event) => setForm((prev) => ({ ...prev, reservationId: event.target.value }))}
        >
          <option value="">Nenhuma</option>
          {reservations.map((reservation) => (
            <option key={reservation.id} value={reservation.id}>
              {reservation.id.slice(0, 6)} - {reservation.qty} un ({reservation.status})
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="text-xs uppercase text-muted">Aceite do termo</label>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          <input
            className="input"
            placeholder="Nome"
            value={form.termName}
            onChange={(event) => setForm((prev) => ({ ...prev, termName: event.target.value }))}
          />
          <input
            className="input"
            placeholder="CPF"
            value={form.termCpf}
            onChange={(event) => setForm((prev) => ({ ...prev, termCpf: event.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.termAccepted}
              onChange={(event) => setForm((prev) => ({ ...prev, termAccepted: event.target.checked }))}
            />
            Aceite confirmado
          </label>
        </div>
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
  );

  const renderReturnFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {renderCommonFields()}
      {renderProjectFields()}
      <div>
        <label className="text-xs uppercase text-muted">Entrega de referencia</label>
        <select
          className="select mt-2"
          value={form.relatedMovementId}
          onChange={(event) => setForm((prev) => ({ ...prev, relatedMovementId: event.target.value }))}
        >
          <option value="">Selecione</option>
          {deliveries.map((delivery) => (
            <option key={delivery.id} value={delivery.id}>
              {delivery.id.slice(0, 6)} - {delivery.qty} un ({new Date(delivery.createdAt).toLocaleDateString("pt-BR")})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Colaborador (filtro)</label>
        <select
          className="select mt-2"
          value={form.collaboratorId}
          onChange={(event) => setForm((prev) => ({ ...prev, collaboratorId: event.target.value }))}
        >
          <option value="">Opcional</option>
          {collaborators.map((collaborator) => (
            <option key={collaborator.id} value={collaborator.id}>
              {collaborator.name}
            </option>
          ))}
        </select>
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
  );

  const renderTransferFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {renderCommonFields()}
      <div>
        <label className="text-xs uppercase text-muted">Projeto origem</label>
        <select
          className="select mt-2"
          value={form.projectOriginId}
          onChange={(event) => setForm((prev) => ({ ...prev, projectOriginId: event.target.value }))}
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
        <label className="text-xs uppercase text-muted">Local origem</label>
        <select
          className="select mt-2"
          value={form.worksiteOriginId}
          onChange={(event) => setForm((prev) => ({ ...prev, worksiteOriginId: event.target.value }))}
        >
          <option value="">Opcional</option>
          {originWorksites.map((worksite) => (
            <option key={worksite.id} value={worksite.id}>
              {worksite.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Projeto destino</label>
        <select
          className="select mt-2"
          value={form.projectDestinationId}
          onChange={(event) => setForm((prev) => ({ ...prev, projectDestinationId: event.target.value }))}
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
        <label className="text-xs uppercase text-muted">Local destino</label>
        <select
          className="select mt-2"
          value={form.worksiteDestinationId}
          onChange={(event) => setForm((prev) => ({ ...prev, worksiteDestinationId: event.target.value }))}
        >
          <option value="">Opcional</option>
          {destinationWorksites.map((worksite) => (
            <option key={worksite.id} value={worksite.id}>
              {worksite.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Lote (opcional)</label>
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
      <div className="md:col-span-2">
        <label className="text-xs uppercase text-muted">Observacoes</label>
        <textarea
          className="input mt-2 min-h-[80px]"
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
        />
      </div>
    </div>
  );

  const renderAdjustmentFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {renderCommonFields()}
      {renderProjectFields()}
      <div>
        <label className="text-xs uppercase text-muted">Direcao</label>
        <select
          className="select mt-2"
          value={form.direction}
          onChange={(event) => setForm((prev) => ({ ...prev, direction: event.target.value }))}
        >
          <option value="IN">Aumentar</option>
          <option value="OUT">Diminuir</option>
        </select>
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Motivo</label>
        <input
          className="input mt-2"
          value={form.reason}
          onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
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
  );

  const renderWriteOffFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {renderCommonFields()}
      {renderProjectFields()}
      <div>
        <label className="text-xs uppercase text-muted">Motivo</label>
        <input
          className="input mt-2"
          value={form.reason}
          onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
        />
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Lote (opcional)</label>
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
      <div className="md:col-span-2">
        <label className="text-xs uppercase text-muted">Observacoes</label>
        <textarea
          className="input mt-2 min-h-[80px]"
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
        />
      </div>
    </div>
  );

  const renderFormStep = () => {
    if (type === "ENTRADA") return renderEntryFields();
    if (type === "ENTREGA") return renderDeliveryFields();
    if (type === "DEVOLUCAO") return renderReturnFields();
    if (type === "TRANSFERENCIA") return renderTransferFields();
    if (type === "AJUSTE") return renderAdjustmentFields();
    return renderWriteOffFields();
  };

  const renderAttachments = () => (
    <div className="card p-4 bg-surface border border-border">
      <div className="text-sm font-semibold">Anexos</div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <input
          className="input"
          placeholder="Nome do arquivo"
          value={form.attachmentName}
          onChange={(event) => setForm((prev) => ({ ...prev, attachmentName: event.target.value }))}
        />
        <input
          className="input"
          placeholder="URL do arquivo"
          value={form.attachmentUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, attachmentUrl: event.target.value }))}
        />
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2 text-sm"
          onClick={() => {
            if (!form.attachmentName || !form.attachmentUrl) return;
            setForm((prev) => ({
              ...prev,
              attachments: [...prev.attachments, { name: prev.attachmentName, url: prev.attachmentUrl }],
              attachmentName: "",
              attachmentUrl: ""
            }));
          }}
        >
          Adicionar
        </button>
      </div>
      {form.attachments.length ? (
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {form.attachments.map((attachment, index) => (
            <li key={`${attachment.name}-${index}`} className="flex items-center justify-between gap-2">
              <span>{attachment.name}</span>
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    attachments: prev.attachments.filter((_, idx) => idx !== index)
                  }))
                }
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-muted">Sem anexos adicionados.</p>
      )}
    </div>
  );

  return (
    <ModalForm
      open={open}
      title={step === "type" ? "Nova movimentacao" : `Nova ${movementTypes.find((item) => item.value === type)?.label}`}
      onClose={onClose}
      footer={
        <>
          {step === "form" ? (
            <button className="rounded-lg border border-border px-4 py-2 text-sm" onClick={() => setStep("type")}>
              Voltar
            </button>
          ) : null}
          {step === "type" ? (
            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
              onClick={() => setStep("form")}
            >
              Continuar
            </button>
          ) : (
            <button
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-black"
              onClick={handleSubmit}
            >
              Salvar
            </button>
          )}
        </>
      }
    >
      {step === "type" ? renderTypeStep() : (
        <div className="space-y-4">
          {renderFormStep()}
          {renderAttachments()}
        </div>
      )}
    </ModalForm>
  );
}

