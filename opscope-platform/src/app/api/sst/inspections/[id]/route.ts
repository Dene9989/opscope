import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { inspectionRunSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = inspectionRunSchema.partial();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.inspectionRun.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const inspection = await prisma.inspectionRun.update({
      where: { id: params.id },
      data: {
        templateId: payload.templateId ?? undefined,
        projectId: payload.projectId ?? undefined,
        worksiteId: payload.worksiteId ?? undefined,
        performedAt: payload.performedAt ? new Date(payload.performedAt) : undefined,
        status: payload.status ?? undefined,
        answers: payload.answers ?? undefined,
        evidenceUrls: payload.evidenceUrls ?? undefined,
        geo: payload.geo ?? undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "InspectionRun",
      entityId: inspection.id,
      before: before as unknown as Record<string, unknown>,
      after: inspection as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(inspection);
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
    const before = await prisma.inspectionRun.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.inspectionRun.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "InspectionRun",
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
