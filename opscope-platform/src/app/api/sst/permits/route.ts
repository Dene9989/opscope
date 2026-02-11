import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { permitSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

async function getActiveEpiCount(
  tx: typeof prisma,
  collaboratorId: string,
  requiredItemIds?: string[]
) {
  const deliveries = await tx.movement.findMany({
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
  const returns = await tx.movement.findMany({
    where: { type: "DEVOLUCAO", relatedMovementId: { in: deliveryIds } },
    select: { qty: true }
  });

  const deliveredQty = deliveries.reduce((acc, item) => acc + item.qty, 0);
  const returnedQty = returns.reduce((acc, item) => acc + item.qty, 0);
  return deliveredQty - returnedQty;
}

async function ensureCompliance(
  tx: typeof prisma,
  collaboratorIds: string[],
  requiredTrainings: string[],
  requiredEpis: string[]
) {
  if (!collaboratorIds.length) return;
  const now = new Date();

  if (requiredTrainings.length) {
    const records = await tx.trainingRecord.findMany({
      where: {
        userId: { in: collaboratorIds },
        trainingId: { in: requiredTrainings },
        status: "VALIDO",
        validUntil: { gte: now }
      },
      select: { userId: true, trainingId: true }
    });

    const covered = new Set(records.map((record) => `${record.userId}:${record.trainingId}`));
    const missing = collaboratorIds.some((userId) =>
      requiredTrainings.some((trainingId) => !covered.has(`${userId}:${trainingId}`))
    );
    if (missing) {
      throw new Error("Treinamento obrigatorio pendente para colaboradores");
    }
  }

  const epiRequired = requiredEpis.length ? requiredEpis : [];
  for (const collaboratorId of collaboratorIds) {
    const active = await getActiveEpiCount(tx, collaboratorId, epiRequired.length ? epiRequired : undefined);
    if (active <= 0) {
      throw new Error("EPI pendente para colaboradores da PT");
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.permitToWork.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          apr: { include: { template: true } },
          project: true,
          worksite: true,
          approvals: { include: { user: true } },
          collaborators: { include: { user: true } }
        }
      }),
      prisma.permitToWork.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = permitSchema.parse(await req.json());

    const apr = await prisma.apr.findUnique({
      where: { id: payload.aprId },
      include: { template: true }
    });
    if (!apr) throw new Error("NOT_FOUND");

    const requiredTrainings = (apr.template?.requiredTrainings as string[]) || [];
    const requiredEpis = (apr.template?.requiredEpis as string[]) || [];

    if (payload.status === "APROVADA" && payload.collaboratorIds?.length) {
      await ensureCompliance(prisma, payload.collaboratorIds, requiredTrainings, requiredEpis);
    }

    const permit = await prisma.permitToWork.create({
      data: {
        aprId: payload.aprId,
        projectId: payload.projectId ?? apr.projectId ?? null,
        worksiteId: payload.worksiteId ?? apr.worksiteId ?? null,
        type: payload.type,
        requirements: payload.requirements,
        validFrom: new Date(payload.validFrom),
        validTo: new Date(payload.validTo),
        status: payload.status,
        approvals: payload.approverIds?.length
          ? { create: payload.approverIds.map((userId) => ({ userId, status: "PENDENTE" })) }
          : undefined,
        collaborators: payload.collaboratorIds?.length
          ? { create: payload.collaboratorIds.map((userId) => ({ userId })) }
          : undefined
      }
    });

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "PermitToWork",
      entityId: permit.id,
      after: permit as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk(permit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
