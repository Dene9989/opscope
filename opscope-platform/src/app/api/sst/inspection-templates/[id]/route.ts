import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { checklistTemplateSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = checklistTemplateSchema.partial();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.checklistTemplate.findUnique({
      where: { id: params.id },
      include: { questions: true }
    });
    if (!before) throw new Error("NOT_FOUND");

    const template = await prisma.checklistTemplate.update({
      where: { id: params.id },
      data: {
        type: payload.type ?? undefined,
        title: payload.title ?? undefined,
        periodicityDays: payload.periodicityDays ?? undefined,
        projectId: payload.projectId ?? undefined,
        worksiteId: payload.worksiteId ?? undefined,
        active: payload.active ?? undefined,
        questions: payload.questions
          ? {
              deleteMany: {},
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
          : undefined
      },
      include: { questions: true }
    });

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "ChecklistTemplate",
      entityId: template.id,
      before: before as unknown as Record<string, unknown>,
      after: template as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(template);
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
    const before = await prisma.checklistTemplate.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.checklistTemplate.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "ChecklistTemplate",
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
