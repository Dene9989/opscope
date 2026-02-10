import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { incidentSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = incidentSchema.partial();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.incident.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const incident = await prisma.incident.update({
      where: { id: params.id },
      data: {
        projectId: payload.projectId ?? undefined,
        worksiteId: payload.worksiteId ?? undefined,
        date: payload.date ? new Date(payload.date) : undefined,
        severity: payload.severity ?? undefined,
        description: payload.description ?? undefined,
        category: payload.category ?? undefined,
        photos: payload.photos ?? undefined,
        fiveWhys: payload.fiveWhys ?? undefined
      }
    });

    if (payload.involvedUserIds) {
      await prisma.incidentInvolved.deleteMany({ where: { incidentId: params.id } });
      await prisma.incidentInvolved.createMany({
        data: payload.involvedUserIds.map((userId) => ({ incidentId: params.id, userId }))
      });
    }

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "Incident",
      entityId: incident.id,
      before: before as unknown as Record<string, unknown>,
      after: incident as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(incident);
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
    const before = await prisma.incident.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.incidentInvolved.deleteMany({ where: { incidentId: params.id } });
    await prisma.incident.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "Incident",
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
