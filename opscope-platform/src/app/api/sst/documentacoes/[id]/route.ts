import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { documentationReviewSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = documentationReviewSchema.parse(await req.json());

    if (payload.status === "REPROVADO" && !payload.correctionInstructions) {
      throw new Error("Informe as instrucoes de correção");
    }

    const before = await prisma.activityDocumentation.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");

    const updated = await prisma.activityDocumentation.update({
      where: { id: params.id },
      data: {
        status: payload.status,
        reviewNotes: payload.reviewNotes ?? null,
        correctionInstructions: payload.correctionInstructions ?? null,
        reviewerId: user.sub,
        reviewedAt: new Date()
      }
    });

    if (payload.status === "REPROVADO") {
      await prisma.userNotification.create({
        data: {
          userId: updated.responsibleId,
          title: "Documentacao reprovada",
          message: payload.correctionInstructions ?? "Ajustar documentacao conforme orientacoes do SST.",
          entityType: "ActivityDocumentation",
          entityId: updated.id
        }
      });
    }

    if (payload.status === "APROVADO") {
      await prisma.userNotification.create({
        data: {
          userId: updated.responsibleId,
          title: "Documentacao aprovada",
          message: "Documentacao aprovada pelo SST. Execucao liberada.",
          entityType: "ActivityDocumentation",
          entityId: updated.id
        }
      });
    }

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "ActivityDocumentation",
      entityId: updated.id,
      before: before as unknown as Record<string, unknown>,
      after: updated as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
