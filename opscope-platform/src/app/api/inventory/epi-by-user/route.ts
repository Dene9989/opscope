import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const collaboratorId = searchParams.get("collaboratorId") || undefined;
    const projectId = searchParams.get("projectId") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: any = {
      type: "ENTREGA",
      item: { type: "EPI" }
    };

    if (collaboratorId) {
      where.collaboratorId = collaboratorId;
    }

    if (projectId) {
      where.projectOriginId = projectId;
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
          collaborator: true,
          responsibilityTerm: true
        }
      }),
      prisma.movement.count({ where })
    ]);

    const deliveryIds = items.map((delivery) => delivery.id);

    const returns = deliveryIds.length
      ? await prisma.movement.groupBy({
          by: ["relatedMovementId"],
          where: { relatedMovementId: { in: deliveryIds }, type: "DEVOLUCAO" },
          _sum: { qty: true }
        })
      : [];

    const returnMap = new Map(
      returns.map((row) => [row.relatedMovementId, row._sum.qty ?? 0])
    );

    const now = new Date();

    const mapped = items
      .map((delivery) => {
        const returnedQty = returnMap.get(delivery.id) || 0;
        const pendingQty = Math.max(0, delivery.qty - returnedQty);
        const validUntil = delivery.batch?.itemValidUntil || delivery.item.itemValidUntil || null;
        const caValidUntil = delivery.batch?.caValidUntil || delivery.item.caValidUntil || null;
        const isExpired = Boolean(
          (validUntil && validUntil < now) || (caValidUntil && caValidUntil < now)
        );
        const statusLabel = pendingQty === 0 ? "DEVOLVIDO" : isExpired ? "VENCIDO" : "ATIVO";

        return {
          id: delivery.id,
          collaborator: delivery.collaborator,
          item: delivery.item,
          batch: delivery.batch,
          project: delivery.projectOrigin,
          qty: delivery.qty,
          returnedQty,
          pendingQty,
          createdAt: delivery.createdAt,
          validUntil,
          caValidUntil,
          status: statusLabel,
          termId: delivery.responsibilityTerm?.id || null,
          termMovementId: delivery.id
        };
      })
      .filter((row) => (status ? row.status === status : true));

    return jsonOk({ items: mapped, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

