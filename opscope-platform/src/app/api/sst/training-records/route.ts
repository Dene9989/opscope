import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { trainingRecordSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || undefined;

    const where: any = {};
    if (userId) where.userId = userId;
    if (user.role === "COLABORADOR") where.userId = user.sub;

    const [items, total] = await Promise.all([
      prisma.trainingRecord.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { training: true, user: true }
      }),
      prisma.trainingRecord.count({ where })
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
    const payload = trainingRecordSchema.parse(await req.json());
    const record = await prisma.trainingRecord.create({
      data: {
        trainingId: payload.trainingId,
        userId: payload.userId,
        date: new Date(payload.date),
        validUntil: new Date(payload.validUntil),
        status: payload.status,
        certificateUrl: payload.certificateUrl ?? null
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "TrainingRecord",
      entityId: record.id,
      after: record as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(record, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
