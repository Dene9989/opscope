import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { trainingRecordSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = trainingRecordSchema.partial();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.trainingRecord.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const record = await prisma.trainingRecord.update({
      where: { id: params.id },
      data: {
        trainingId: payload.trainingId ?? undefined,
        userId: payload.userId ?? undefined,
        date: payload.date ? new Date(payload.date) : undefined,
        validUntil: payload.validUntil ? new Date(payload.validUntil) : undefined,
        status: payload.status ?? undefined,
        certificateUrl: payload.certificateUrl ?? undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "TrainingRecord",
      entityId: record.id,
      before: before as unknown as Record<string, unknown>,
      after: record as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(record);
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
    const before = await prisma.trainingRecord.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.trainingRecord.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "TrainingRecord",
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
