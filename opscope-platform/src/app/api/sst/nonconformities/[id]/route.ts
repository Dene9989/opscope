import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { nonConformitySchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = nonConformitySchema.partial().extend({
  closedAt: z.string().optional().nullable(),
  verifiedById: z.string().uuid().optional().nullable(),
  verifiedAt: z.string().optional().nullable()
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.nonConformity.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const nc = await prisma.nonConformity.update({
      where: { id: params.id },
      data: {
        originType: payload.originType ?? undefined,
        inspectionId: payload.inspectionId ?? undefined,
        incidentId: payload.incidentId ?? undefined,
        projectId: payload.projectId ?? undefined,
        worksiteId: payload.worksiteId ?? undefined,
        severity: payload.severity ?? undefined,
        title: payload.title ?? undefined,
        description: payload.description ?? undefined,
        evidenceUrls: payload.evidenceUrls ?? undefined,
        responsibleId: payload.responsibleId ?? undefined,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
        status: payload.status ?? undefined,
        closedAt: payload.closedAt ? new Date(payload.closedAt) : undefined,
        verifiedById: payload.verifiedById ?? undefined,
        verifiedAt: payload.verifiedAt ? new Date(payload.verifiedAt) : undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "NonConformity",
      entityId: nc.id,
      before: before as unknown as Record<string, unknown>,
      after: nc as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(nc);
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
    const before = await prisma.nonConformity.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.nonConformity.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "NonConformity",
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
