
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ModalForm } from "@/components/ui/ModalForm";
import { apiFetch } from "@/lib/client";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  movementTypes,
  returnConditions,
  parseMovementSearchParams,
  shouldOpenMovement,
  shouldInitMovement,
  type MovementPrefill,
  type MovementType,
  type ReturnCondition
} from "@/lib/movement";

const movementTypeLabels: Record<MovementType, string> = {
  ENTRADA: "Entrada",
  ENTREGA: "Entrega",
  DEVOLUCAO: "Devolucao",
  TRANSFERENCIA: "Transferencia",
  AJUSTE: "Ajuste",
  BAIXA: "Baixa/Perda"
};

const movementOptions = movementTypes.map((value) => ({
  value,
  label: movementTypeLabels[value]
}));

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

interface DeliveryOption {
  id: string;
  qty: number;
  createdAt: string;
  item?: { name: string } | null;
  collaborator?: { name: string } | null;
  projectOrigin?: { name: string } | null;
}

interface DeliveryInfo {
  id: string;
  qty: number;
  createdAt: string;
  itemId: string;
  projectOriginId?: string | null;
  worksiteOriginId?: string | null;
  collaboratorId?: string | null;
  item?: { name: string } | null;
  collaborator?: { name: string } | null;
  projectOrigin?: { name: string } | null;
  worksiteOrigin?: { name: string } | null;
}

interface FormState {
  itemId: string;
  projectId: string;
  worksiteId: string;
  qty: number;
  batchId: string;
  batchCode: string;
  itemValidUntil: string;
  caValidUntil: string;
  unitCost: string;
  invoiceNumber: string;
  collaboratorId: string;
  reservationId: string;
  deliveryMovementId: string;
  projectOriginId: string;
  worksiteOriginId: string;
  projectDestinationId: string;
  worksiteDestinationId: string;
  direction: "IN" | "OUT";
  returnCondition: ReturnCondition;
  reason: string;
  notes: string;
  termAccepted: boolean;
  termName: string;
  termCpf: string;
  attachmentName: string;
  attachmentUrl: string;
  attachments: Array<{ name: string; url: string }>;
}

const createEmptyForm = (prefill?: MovementPrefill): FormState => ({
  itemId: prefill?.itemId || "",
  projectId: prefill?.projectId || "",
  worksiteId: "",
  qty: 1,
  batchId: "",
  batchCode: "",
  itemValidUntil: "",
  caValidUntil: "",
  unitCost: "",
  invoiceNumber: "",
  collaboratorId: prefill?.collaboratorId || "",
  reservationId: "",
  deliveryMovementId: prefill?.deliveryMovementId || "",
  projectOriginId: prefill?.projectId || "",
  worksiteOriginId: "",
  projectDestinationId: "",
  worksiteDestinationId: "",
  direction: "IN",
  returnCondition: "OK",
  reason: "",
  notes: "",
  termAccepted: false,
  termName: "",
  termCpf: "",
  attachmentName: "",
  attachmentUrl: "",
  attachments: []
});

const ensureOption = (options: Option[], selectedId: string, label: string) => {
  if (!selectedId) return options;
  if (options.some((option) => option.id === selectedId)) return options;
  return [{ id: selectedId, name: label }, ...options];
};

const ensureDeliveryOption = (options: DeliveryOption[], selectedId: string) => {
  if (!selectedId) return options;
  if (options.some((option) => option.id === selectedId)) return options;
  return [{ id: selectedId, qty: 0, createdAt: new Date().toISOString() }, ...options];
};

const renderSelectSkeleton = () => (
  <div className="mt-2 h-10 w-full animate-pulse rounded-lg border border-border bg-surface/60" />
);

interface MovementWizardProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}
export function MovementWizard({ open, onClose, onSuccess }: MovementWizardProps) {
  const { token } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open : shouldOpenMovement(searchParams);

  const didInitRef = useRef(false);
  const typeLockedRef = useRef(false);

  const [step, setStep] = useState<"type" | "form">("type");
  const [type, setType] = useState<MovementType>("ENTRADA");

  const [items, setItems] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [worksites, setWorksites] = useState<WorksiteOption[]>([]);
  const [collaborators, setCollaborators] = useState<Option[]>([]);

  const [batches, setBatches] = useState<BatchOption[]>([]);
  const [reservations, setReservations] = useState<ReservationOption[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryOption[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);

  const [loadingBase, setLoadingBase] = useState(false);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [loadingDelivery, setLoadingDelivery] = useState(false);

  const [form, setForm] = useState<FormState>(() => createEmptyForm());

  const parsedParams = useMemo(() => parseMovementSearchParams(searchParams), [searchParams]);

  useEffect(() => {
    if (!isOpen) {
      didInitRef.current = false;
      typeLockedRef.current = false;
      setDeliveryInfo(null);
      return;
    }

    const initState = shouldInitMovement({ isOpen, didInit: didInitRef.current });
    if (!initState.shouldInit) return;

    didInitRef.current = initState.nextDidInit;

    const initialType = parsedParams.type || "ENTRADA";
    typeLockedRef.current = Boolean(parsedParams.type);

    setType(initialType);
    setStep(parsedParams.type ? "form" : "type");
    setForm(createEmptyForm(parsedParams));
  }, [isOpen, parsedParams]);

  useEffect(() => {
    if (!isOpen) return;
    setLoadingBase(true);
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
      .catch(() => push("Erro ao carregar dados base", "error"))
      .finally(() => setLoadingBase(false));
  }, [isOpen, token, push]);
  const itemsWithFallback = useMemo(
    () => ensureOption(items, form.itemId, "Item selecionado"),
    [items, form.itemId]
  );

  const projectsWithFallback = useMemo(
    () => ensureOption(projects, form.projectId, "Projeto selecionado"),
    [projects, form.projectId]
  );

  const collaboratorsWithFallback = useMemo(
    () => ensureOption(collaborators, form.collaboratorId, "Colaborador selecionado"),
    [collaborators, form.collaboratorId]
  );
  const originProjectsWithFallback = useMemo(
    () => ensureOption(projects, form.projectOriginId, "Projeto selecionado"),
    [projects, form.projectOriginId]
  );

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
    if (!isOpen || !form.itemId || !batchProjectId) {
      setBatches([]);
      return;
    }

    apiFetch(`/api/inventory/batches?itemId=${form.itemId}&projectId=${batchProjectId}`, token)
      .then((response) => setBatches(response.data.items))
      .catch(() => setBatches([]));
  }, [isOpen, form.itemId, form.projectId, form.projectOriginId, token, type]);

  useEffect(() => {
    if (!isOpen || !form.itemId || !form.projectId) {
      setReservations([]);
      return;
    }

    apiFetch(`/api/inventory/reservations?itemId=${form.itemId}&projectId=${form.projectId}`, token)
      .then((response) =>
        setReservations(
          response.data.items.filter(
            (reservation: ReservationOption) =>
              reservation.status !== "CANCELADO" && reservation.status !== "CONSUMIDO"
          )
        )
      )
      .catch(() => setReservations([]));
  }, [isOpen, form.itemId, form.projectId, token]);

  useEffect(() => {
    if (!isOpen || type !== "DEVOLUCAO") {
      setDeliveries([]);
      return;
    }

    const params = new URLSearchParams({ type: "ENTREGA", pageSize: "50" });
    if (form.itemId) params.set("itemId", form.itemId);
    if (form.projectId) params.set("projectId", form.projectId);
    if (form.collaboratorId) params.set("collaboratorId", form.collaboratorId);

    setLoadingDeliveries(true);
    apiFetch(`/api/inventory/movements?${params.toString()}`, token)
      .then((response) => setDeliveries(response.data.items))
      .catch(() => setDeliveries([]))
      .finally(() => setLoadingDeliveries(false));
  }, [isOpen, type, form.itemId, form.projectId, form.collaboratorId, token]);

  useEffect(() => {
    if (!isOpen || type !== "DEVOLUCAO" || !form.deliveryMovementId) {
      setDeliveryInfo(null);
      return;
    }

    setLoadingDelivery(true);
    apiFetch(`/api/inventory/movements?type=ENTREGA&id=${form.deliveryMovementId}`, token)
      .then((response) => {
        const movement = response.data.items?.[0];
        if (!movement) throw new Error("Entrega nao encontrada");

        const info: DeliveryInfo = {
          id: movement.id,
          qty: movement.qty,
          createdAt: movement.createdAt,
          itemId: movement.itemId,
          projectOriginId: movement.projectOriginId ?? null,
          worksiteOriginId: movement.worksiteOriginId ?? null,
          collaboratorId: movement.collaboratorId ?? null,
          item: movement.item ?? null,
          collaborator: movement.collaborator ?? null,
          projectOrigin: movement.projectOrigin ?? null,
          worksiteOrigin: movement.worksiteOrigin ?? null
        };

        setDeliveryInfo(info);
        setForm((prev) => ({
          ...prev,
          itemId: movement.itemId,
          projectId: movement.projectOriginId ?? "",
          worksiteId: movement.worksiteOriginId ?? "",
          collaboratorId: movement.collaboratorId ?? ""
        }));
      })
      .catch((error) => {
        setDeliveryInfo(null);
        setForm((prev) => ({ ...prev, deliveryMovementId: "" }));
        push(error instanceof Error ? error.message : "Entrega nao encontrada", "error");
      })
      .finally(() => setLoadingDelivery(false));
  }, [isOpen, type, form.deliveryMovementId, token, push]);
  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      router.replace(pathname);
    }
  };

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
        if (!form.deliveryMovementId) {
          push("Selecione a entrega de referencia", "error");
          return;
        }
        payload.itemId = form.itemId;
        payload.projectId = form.projectId;
        payload.worksiteId = form.worksiteId || null;
        payload.qty = Number(form.qty);
        payload.relatedMovementId = form.deliveryMovementId;
        payload.reason = form.returnCondition || null;
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
      handleClose();
      router.refresh();
    } catch (error) {
      push(error instanceof Error ? error.message : "Erro ao salvar", "error");
    }
  };

  const showItemSelect = !loadingBase || items.length > 0 || form.itemId;
  const showProjectSelect = !loadingBase || projects.length > 0 || form.projectId;
  const showCollaboratorSelect = !loadingBase || collaborators.length > 0 || form.collaboratorId;
  const showWorksiteSelect = !loadingBase || worksites.length > 0 || form.worksiteId;
  const showOriginProjectSelect = !loadingBase || projects.length > 0 || form.projectOriginId;

  const returnLocked = type === "DEVOLUCAO" && Boolean(form.deliveryMovementId);

  const renderTypeStep = () => (
    <div className="grid gap-4">
      <label className="text-xs uppercase text-muted">Tipo de movimentacao</label>
      <div className="grid gap-2 md:grid-cols-2">
        {movementOptions.map((option) => (
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
        {showItemSelect ? (
          <select
            className="select mt-2"
            value={form.itemId}
            disabled={returnLocked}
            onChange={(event) => setForm((prev) => ({ ...prev, itemId: event.target.value }))}
          >
            <option value="">Selecione</option>
            {itemsWithFallback.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        ) : (
          renderSelectSkeleton()
        )}
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
        {showProjectSelect ? (
          <select
            className="select mt-2"
            value={form.projectId}
            disabled={returnLocked}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, projectId: event.target.value, worksiteId: "" }))
            }
          >
            <option value="">Selecione</option>
            {projectsWithFallback.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        ) : (
          renderSelectSkeleton()
        )}
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Local</label>
        {showWorksiteSelect ? (
          <select
            className="select mt-2"
            value={form.worksiteId}
            disabled={returnLocked}
            onChange={(event) => setForm((prev) => ({ ...prev, worksiteId: event.target.value }))}
          >
            <option value="">Opcional</option>
            {filteredWorksites.map((worksite) => (
              <option key={worksite.id} value={worksite.id}>
                {worksite.name}
              </option>
            ))}
          </select>
        ) : (
          renderSelectSkeleton()
        )}
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
        {showCollaboratorSelect ? (
          <select
            className="select mt-2"
            value={form.collaboratorId}
            onChange={(event) => setForm((prev) => ({ ...prev, collaboratorId: event.target.value }))}
          >
            <option value="">Selecione</option>
            {collaboratorsWithFallback.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name}
              </option>
            ))}
          </select>
        ) : (
          renderSelectSkeleton()
        )}
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
  const deliveryOptions = useMemo(
    () => ensureDeliveryOption(deliveries, form.deliveryMovementId),
    [deliveries, form.deliveryMovementId]
  );

  const renderDeliveryLabel = (delivery: DeliveryOption) => {
    const date = delivery.createdAt
      ? new Date(delivery.createdAt).toLocaleDateString("pt-BR")
      : "-";
    const itemLabel = delivery.item?.name ? ` - ${delivery.item.name}` : "";
    const collaboratorLabel = delivery.collaborator?.name
      ? ` / ${delivery.collaborator.name}`
      : "";
    return `${delivery.id.slice(0, 6)}${itemLabel}${collaboratorLabel} - ${delivery.qty} un (${date})`;
  };

  const renderReturnFields = () => (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="text-xs uppercase text-muted">Entrega de referencia</label>
        {loadingDeliveries && !deliveryOptions.length && !form.deliveryMovementId ? (
          renderSelectSkeleton()
        ) : (
          <select
            className="select mt-2"
            value={form.deliveryMovementId}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, deliveryMovementId: event.target.value }))
            }
          >
            <option value="">Selecione</option>
            {deliveryOptions.map((delivery) => (
              <option key={delivery.id} value={delivery.id}>
                {renderDeliveryLabel(delivery)}
              </option>
            ))}
          </select>
        )}
      </div>

      {loadingDelivery ? (
        <div className="md:col-span-2">{renderSelectSkeleton()}</div>
      ) : deliveryInfo ? (
        <div className="md:col-span-2 rounded-lg border border-border bg-surface/60 p-4 text-sm">
          <div className="font-semibold">Entrega original</div>
          <div className="mt-2 grid gap-1 text-muted">
            <div>Item: {deliveryInfo.item?.name || deliveryInfo.itemId}</div>
            <div>Projeto: {deliveryInfo.projectOrigin?.name || "-"}</div>
            <div>Colaborador: {deliveryInfo.collaborator?.name || "-"}</div>
            <div>Quantidade entregue: {deliveryInfo.qty}</div>
          </div>
        </div>
      ) : null}

      {renderCommonFields()}
      {renderProjectFields()}
      <div>
        <label className="text-xs uppercase text-muted">
          {returnLocked ? "Colaborador" : "Colaborador (filtro)"}
        </label>
        {showCollaboratorSelect ? (
          <select
            className="select mt-2"
            value={form.collaboratorId}
            disabled={returnLocked}
            onChange={(event) => setForm((prev) => ({ ...prev, collaboratorId: event.target.value }))}
          >
            <option value="">{returnLocked ? "-" : "Opcional"}</option>
            {collaboratorsWithFallback.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name}
              </option>
            ))}
          </select>
        ) : (
          renderSelectSkeleton()
        )}
      </div>
      <div>
        <label className="text-xs uppercase text-muted">Condicao da devolucao</label>
        <select
          className="select mt-2"
          value={form.returnCondition}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, returnCondition: event.target.value as ReturnCondition }))
          }
        >
          {returnConditions.map((condition) => (
            <option key={condition} value={condition}>
              {condition}
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
        {showOriginProjectSelect ? (
          <select
            className="select mt-2"
            value={form.projectOriginId}
            onChange={(event) => setForm((prev) => ({ ...prev, projectOriginId: event.target.value }))}
          >
            <option value="">Selecione</option>
            {originProjectsWithFallback.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        ) : (
          renderSelectSkeleton()
        )}
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
          onChange={(event) =>
            setForm((prev) => ({ ...prev, direction: event.target.value as "IN" | "OUT" }))
          }
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

  const showTypeStep = step === "type";
  const lockType = typeLockedRef.current;

  return (
    <ModalForm
      open={isOpen}
      title={
        showTypeStep
          ? "Nova movimentacao"
          : `Nova ${movementTypeLabels[type] || "movimentacao"}`
      }
      onClose={handleClose}
      footer={
        <>
          {!showTypeStep && !lockType ? (
            <button
              className="rounded-lg border border-border px-4 py-2 text-sm"
              onClick={() => setStep("type")}
            >
              Voltar
            </button>
          ) : null}
          {showTypeStep ? (
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
      {showTypeStep ? (
        renderTypeStep()
      ) : (
        <div className="space-y-4">
          {renderFormStep()}
          {renderAttachments()}
        </div>
      )}
    </ModalForm>
  );
}
