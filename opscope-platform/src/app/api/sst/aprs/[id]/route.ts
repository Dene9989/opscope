import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { aprSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = aprSchema.partial();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.apr.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");

    const template = payload.templateId
      ? await prisma.aprTemplate.findUnique({ where: { id: payload.templateId } })
      : null;

    const apr = await prisma.apr.update({
      where: { id: params.id },
      data: {
        projectId: payload.projectId ?? undefined,
        worksiteId: payload.worksiteId ?? undefined,
        templateId: payload.templateId ?? undefined,
        activity: payload.activity ?? template?.activity ?? undefined,
        hazards: payload.hazards ?? template?.hazards ?? undefined,
        risks: payload.risks ?? template?.risks ?? undefined,
        controls: payload.controls ?? template?.controls ?? undefined,
        approvedById: payload.approvedById ?? undefined,
        status: payload.status ?? undefined
      }
    });

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "Apr",
      entityId: apr.id,
      before: before as unknown as Record<string, unknown>,
      after: apr as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk(apr);
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
    const before = await prisma.apr.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.apr.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "Apr",
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
