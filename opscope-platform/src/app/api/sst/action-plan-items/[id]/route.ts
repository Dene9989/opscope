import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { actionPlanItemSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = actionPlanItemSchema.partial().extend({
  completedAt: z.string().optional().nullable(),
  verifiedAt: z.string().optional().nullable()
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.actionPlanItem.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const item = await prisma.actionPlanItem.update({
      where: { id: params.id },
      data: {
        nonConformityId: payload.nonConformityId ?? undefined,
        title: payload.title ?? undefined,
        description: payload.description ?? undefined,
        responsibleId: payload.responsibleId ?? undefined,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
        status: payload.status ?? undefined,
        evidenceUrls: payload.evidenceUrls ?? undefined,
        notes: payload.notes ?? undefined,
        completedAt: payload.completedAt ? new Date(payload.completedAt) : undefined,
        verifiedAt: payload.verifiedAt ? new Date(payload.verifiedAt) : undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "ActionPlanItem",
      entityId: item.id,
      before: before as unknown as Record<string, unknown>,
      after: item as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(item);
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
    const before = await prisma.actionPlanItem.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.actionPlanItem.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "ActionPlanItem",
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
