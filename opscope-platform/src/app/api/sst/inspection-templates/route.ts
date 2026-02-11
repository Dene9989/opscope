import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { checklistTemplateSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const worksiteId = searchParams.get("worksiteId") || undefined;
    const active = searchParams.get("active");

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (worksiteId) where.worksiteId = worksiteId;
    if (active !== null && active !== undefined) where.active = active === "true";

    const [items, total] = await Promise.all([
      prisma.checklistTemplate.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { questions: true, project: true, worksite: true }
      }),
      prisma.checklistTemplate.count({ where })
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
    const payload = checklistTemplateSchema.parse(await req.json());
    const template = await prisma.checklistTemplate.create({
      data: {
        type: payload.type,
        title: payload.title,
        periodicityDays: payload.periodicityDays,
        projectId: payload.projectId ?? null,
        worksiteId: payload.worksiteId ?? null,
        active: payload.active ?? true,
        questions: {
          create: payload.questions.map((question, index) => ({
            order: index + 1,
            text: question.text,
            type: question.type,
            required: question.required ?? true,
            options: question.options ?? undefined,
            weight: question.weight ?? undefined,
            requiresPhotoOnFail: question.requiresPhotoOnFail ?? false
          }))
        }
      },
      include: { questions: true }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "ChecklistTemplate",
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
