import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

async function getActiveEpiCount(collaboratorId: string, requiredItemIds?: string[]) {
  const deliveries = await prisma.movement.findMany({
    where: {
      type: "ENTREGA",
      collaboratorId,
      item: { type: "EPI" },
      ...(requiredItemIds?.length ? { itemId: { in: requiredItemIds } } : {})
    },
    select: { id: true, qty: true }
  });

  if (!deliveries.length) return 0;

  const deliveryIds = deliveries.map((delivery) => delivery.id);
  const returns = await prisma.movement.findMany({
    where: { type: "DEVOLUCAO", relatedMovementId: { in: deliveryIds } },
    select: { qty: true }
  });

  const deliveredQty = deliveries.reduce((acc, item) => acc + item.qty, 0);
  const returnedQty = returns.reduce((acc, item) => acc + item.qty, 0);
  return deliveredQty - returnedQty;
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;

    const [users, requirements, records, permits] = await Promise.all([
      prisma.user.findMany({ where: { active: true } }),
      prisma.trainingRequirementByRole.findMany({
        where: projectId ? { OR: [{ projectId }, { projectId: null }] } : { projectId: null },
        include: { training: true }
      }),
      prisma.trainingRecord.findMany({
        where: projectId ? { projectId } : {},
        include: { training: true }
      }),
      prisma.permitToWork.findMany({
        where: { status: "APROVADA", validTo: { gte: new Date() } },
        include: { collaborators: true }
      })
    ]);

    const recordsByUser = new Map<string, typeof records>();
    records.forEach((record) => {
      const list = recordsByUser.get(record.userId) || [];
      list.push(record);
      recordsByUser.set(record.userId, list);
    });

    const permitsByUser = new Map<string, Date>();
    permits.forEach((permit) => {
      permit.collaborators.forEach((collab) => {
        const current = permitsByUser.get(collab.userId);
        if (!current || current < permit.validTo) {
          permitsByUser.set(collab.userId, permit.validTo);
        }
      });
    });

    const items = await Promise.all(
      users.map(async (user) => {
        const required = requirements.filter((req) => req.role === user.role);
        const requiredIds = required.map((req) => req.trainingId);
        const userRecords = recordsByUser.get(user.id) || [];
        const now = new Date();
        const validIds = new Set(
          userRecords
            .filter((record) => record.status === "VALIDO" && record.validUntil >= now)
            .map((record) => record.trainingId)
        );
        const pending = requiredIds.filter((id) => !validIds.has(id));
        const trainingCompliance = requiredIds.length
          ? Math.round(((requiredIds.length - pending.length) / requiredIds.length) * 100)
          : 100;

        const epiActive = await getActiveEpiCount(user.id);
        const ptValidTo = permitsByUser.get(user.id) ?? null;

        return {
          userId: user.id,
          name: user.name,
          role: user.role,
          training: {
            required: requiredIds.length,
            pending: pending.length,
            compliance: trainingCompliance,
            pendingIds: pending
          },
          epi: {
            ok: epiActive > 0,
            activeQty: epiActive
          },
          pt: {
            ok: !!ptValidTo,
            validTo: ptValidTo
          }
        };
      })
    );

    return jsonOk({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
