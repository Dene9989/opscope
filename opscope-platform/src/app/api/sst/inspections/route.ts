import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { inspectionExecutionSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.inspectionExecution.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { performedAt: "desc" },
        include: { template: true, project: true, worksite: true, nonConformity: true }
      }),
      prisma.inspectionExecution.count({ where })
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
    const payload = inspectionExecutionSchema.parse(await req.json());

    const inspection = await prisma.inspectionExecution.create({
      data: {
        templateId: payload.templateId,
        projectId: payload.projectId,
        worksiteId: payload.worksiteId ?? null,
        performedById: user.sub,
        performedAt: new Date(payload.performedAt),
        status: payload.status,
        answers: payload.answers,
        photos: payload.photos ?? undefined,
        geo: payload.geo ?? undefined
      }
    });

    let nonConformityId: string | null = null;

    if (payload.status === "NAO_CONFORME") {
      const nc = await prisma.nonConformity.create({
        data: {
          originType: "INSPECAO",
          inspectionId: inspection.id,
          severity: "MEDIA",
          description: "Nao conformidade gerada automaticamente",
          responsibleId: user.sub,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "ABERTA",
          createdById: user.sub
        }
      });
      nonConformityId = nc.id;
    }

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "InspectionExecution",
      entityId: inspection.id,
      after: inspection as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk({ inspection, nonConformityId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
