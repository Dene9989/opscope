import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { trainingSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = trainingSchema.partial();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.training.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const training = await prisma.training.update({
      where: { id: params.id },
      data: {
        name: payload.name ?? undefined,
        nr: payload.nr ?? undefined,
        hours: payload.hours ?? undefined,
        validityDays: payload.validityDays ?? undefined,
        mandatoryRoles: payload.mandatoryRoles ?? undefined,
        projectId: payload.projectId ?? undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "Training",
      entityId: training.id,
      before: before as unknown as Record<string, unknown>,
      after: training as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(training);
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
    const before = await prisma.training.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.training.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "Training",
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
