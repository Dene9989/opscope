import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { trainingRequirementSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const trainingId = searchParams.get("trainingId") || undefined;
    const role = searchParams.get("role") || undefined;
    const projectId = searchParams.get("projectId") || undefined;

    const where: any = {};
    if (trainingId) where.trainingId = trainingId;
    if (role) where.role = role;
    if (projectId) where.projectId = projectId;

    const [items, total] = await Promise.all([
      prisma.trainingRequirementByRole.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { training: true, project: true }
      }),
      prisma.trainingRequirementByRole.count({ where })
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
    const payload = trainingRequirementSchema.parse(await req.json());
    const requirement = await prisma.trainingRequirementByRole.create({
      data: {
        trainingId: payload.trainingId,
        role: payload.role,
        projectId: payload.projectId ?? null,
        mandatory: payload.mandatory ?? true
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "TrainingRequirementByRole",
      entityId: requirement.id,
      after: requirement as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(requirement, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
