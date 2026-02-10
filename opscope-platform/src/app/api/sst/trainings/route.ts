import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { trainingSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const query = searchParams.get("q") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (query) where.name = { contains: query, mode: "insensitive" };

    const [items, total] = await Promise.all([
      prisma.training.findMany({ where, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
      prisma.training.count({ where })
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
    const payload = trainingSchema.parse(await req.json());
    const training = await prisma.training.create({
      data: {
        name: payload.name,
        nr: payload.nr ?? null,
        hours: payload.hours,
        validityDays: payload.validityDays,
        mandatoryRoles: payload.mandatoryRoles ?? undefined,
        projectId: payload.projectId ?? null
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "Training",
      entityId: training.id,
      after: training as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(training, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
