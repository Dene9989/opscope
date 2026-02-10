import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { inspectionTemplateSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const type = searchParams.get("type") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (type) where.type = type;

    const [items, total] = await Promise.all([
      prisma.inspectionTemplate.findMany({ where, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
      prisma.inspectionTemplate.count({ where })
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
    const payload = inspectionTemplateSchema.parse(await req.json());
    const template = await prisma.inspectionTemplate.create({
      data: {
        type: payload.type,
        title: payload.title,
        periodicityDays: payload.periodicityDays,
        projectId: payload.projectId ?? null,
        worksiteId: payload.worksiteId ?? null,
        questions: payload.questions
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "InspectionTemplate",
      entityId: template.id,
      after: template as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(template, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
