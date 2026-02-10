import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { movementSchema } from "@/lib/validation";
import {
  registerEntry,
  registerDelivery,
  registerReturn,
  registerTransfer,
  registerAdjustment,
  registerWriteOff
} from "@/lib/services/stockService";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const movementId = searchParams.get("id") || undefined;
    const projectId = searchParams.get("projectId") || undefined;
    const originProjectId = searchParams.get("originProjectId") || undefined;
    const destinationProjectId = searchParams.get("destinationProjectId") || undefined;
    const type = searchParams.get("type") || undefined;
    const itemId = searchParams.get("itemId") || undefined;
    const collaboratorId = searchParams.get("collaboratorId") || undefined;
    const batchId = searchParams.get("batchId") || undefined;
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;

    const where: any = {};

    if (movementId) where.id = movementId;
    if (projectId) {
      where.OR = [{ projectOriginId: projectId }, { projectDestinationId: projectId }];
    }
    if (originProjectId) where.projectOriginId = originProjectId;
    if (destinationProjectId) where.projectDestinationId = destinationProjectId;
    if (type) where.type = type;
    if (itemId) where.itemId = itemId;
    if (batchId) where.batchId = batchId;
    if (collaboratorId) where.collaboratorId = collaboratorId;

    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {})
      };
    }

    if (user.role === "COLABORADOR") {
      where.collaboratorId = user.sub;
    }

    const [items, total] = await Promise.all([
      prisma.movement.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          item: true,
          batch: true,
          projectOrigin: true,
          projectDestination: true,
          worksiteOrigin: true,
          worksiteDestination: true,
          collaborator: true,
          responsibilityTerm: true,
          attachments: true
        }
      }),
      prisma.movement.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "ALMOXARIFE"]);

    const payload = movementSchema.parse(await req.json());
    const meta = getRequestMeta(req);

    let movement;

    switch (payload.type) {
      case "ENTRADA":
        movement = await registerEntry(payload, user, meta);
        break;
      case "ENTREGA":
        movement = await registerDelivery(payload, user, meta);
        break;
      case "DEVOLUCAO":
        movement = await registerReturn(payload, user, meta);
        break;
      case "TRANSFERENCIA":
        movement = await registerTransfer(payload, user, meta);
        break;
      case "AJUSTE":
        requireRoles(user, ["ADMIN", "GESTOR"]);
        movement = await registerAdjustment(payload, user, meta);
        break;
      case "BAIXA":
        requireRoles(user, ["ADMIN", "GESTOR"]);
        movement = await registerWriteOff(payload, user, meta);
        break;
      default:
        throw new Error("Tipo invalido");
    }

    return jsonOk(movement, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}

