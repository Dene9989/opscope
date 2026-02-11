import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["ABERTA", "APROVADA", "ENCERRADA"]).optional(),
  validFrom: z.string().optional(),
  validTo: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  collaboratorIds: z.array(z.string().uuid()).optional().nullable(),
  approvals: z
    .array(
      z.object({
        userId: z.string().uuid(),
        status: z.enum(["PENDENTE", "APROVADO", "REPROVADO"]),
        notes: z.string().optional().nullable()
      })
    )
    .optional()
});

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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.permitToWork.findUnique({
      where: { id: params.id },
      include: { apr: { include: { template: true } }, collaborators: true }
    });
    if (!before) throw new Error("NOT_FOUND");

    const collaboratorIds = payload.collaboratorIds ?? before.collaborators.map((collab) => collab.userId);
    const requiredTrainings = (before.apr.template?.requiredTrainings as string[]) || [];
    const requiredEpis = (before.apr.template?.requiredEpis as string[]) || [];

    if (payload.status === "APROVADA") {
      await ensureCompliance(prisma, collaboratorIds, requiredTrainings, requiredEpis);
    }

    const permit = await prisma.permitToWork.update({
      where: { id: params.id },
      data: {
        status: payload.status ?? undefined,
        validFrom: payload.validFrom ? new Date(payload.validFrom) : undefined,
        validTo: payload.validTo ? new Date(payload.validTo) : undefined,
        requirements: payload.requirements ?? undefined,
        collaborators: payload.collaboratorIds
          ? {
              deleteMany: {},
              create: payload.collaboratorIds.map((userId) => ({ userId }))
            }
          : undefined,
        approvals: payload.approvals
          ? {
              deleteMany: {},
              create: payload.approvals.map((approval) => ({
                userId: approval.userId,
                status: approval.status,
                notes: approval.notes ?? undefined
              }))
            }
          : undefined
      }
    });

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "PermitToWork",
      entityId: permit.id,
      before: before as unknown as Record<string, unknown>,
      after: permit as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk(permit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR"]);
    const before = await prisma.permitToWork.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.permitToWork.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "PermitToWork",
      entityId: params.id,
      before: before as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk({ id: params.id });
  } catch (error) {
    return handleApiError(error);
  }
}
