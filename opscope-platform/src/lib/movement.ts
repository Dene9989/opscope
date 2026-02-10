import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const movementTypes = [
  "ENTRADA",
  "ENTREGA",
  "DEVOLUCAO",
  "TRANSFERENCIA",
  "AJUSTE",
  "BAIXA"
] as const;

export type MovementType = (typeof movementTypes)[number];

export const returnConditions = ["OK", "AVARIADO"] as const;
export type ReturnCondition = (typeof returnConditions)[number];

export interface MovementPrefill {
  type?: MovementType;
  itemId?: string;
  projectId?: string;
  collaboratorId?: string;
  deliveryMovementId?: string;
}

export interface InitGuardResult {
  shouldInit: boolean;
  nextDidInit: boolean;
}

const normalizeId = (value: string | null | undefined) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const normalizeType = (value: string | null | undefined) => {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  if (movementTypes.includes(normalized as MovementType)) {
    return normalized as MovementType;
  }
  return undefined;
};

export function parseMovementSearchParams(params: URLSearchParams): MovementPrefill {
  return {
    type: normalizeType(params.get("type")),
    itemId: normalizeId(params.get("itemId")),
    projectId: normalizeId(params.get("projectId")),
    collaboratorId: normalizeId(params.get("collaboratorId")),
    deliveryMovementId: normalizeId(params.get("deliveryMovementId"))
  };
}

export function shouldOpenMovement(params: URLSearchParams): boolean {
  if (params.get("open") === "1") return true;
  const prefill = parseMovementSearchParams(params);
  return Boolean(
    prefill.type ||
      prefill.itemId ||
      prefill.projectId ||
      prefill.collaboratorId ||
      prefill.deliveryMovementId
  );
}

export function buildMovementUrl(
  prefill: MovementPrefill & { pathname?: string; open?: boolean } = {}
) {
  const pathname = prefill.pathname || "/almoxarifado/movimentacoes";
  const params = new URLSearchParams();

  if (prefill.open !== false) {
    params.set("open", "1");
  }
  if (prefill.type) params.set("type", prefill.type);
  if (prefill.itemId) params.set("itemId", prefill.itemId);
  if (prefill.projectId) params.set("projectId", prefill.projectId);
  if (prefill.collaboratorId) params.set("collaboratorId", prefill.collaboratorId);
  if (prefill.deliveryMovementId) params.set("deliveryMovementId", prefill.deliveryMovementId);

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function openMovement(
  router: AppRouterInstance,
  prefill: MovementPrefill & { pathname?: string; open?: boolean } = {}
) {
  router.push(buildMovementUrl(prefill));
}

export function shouldInitMovement(input: { isOpen: boolean; didInit: boolean }): InitGuardResult {
  if (!input.isOpen) {
    return { shouldInit: false, nextDidInit: false };
  }
  if (input.didInit) {
    return { shouldInit: false, nextDidInit: true };
  }
  return { shouldInit: true, nextDidInit: true };
}
