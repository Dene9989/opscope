import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = z.object({
  date: z.string().optional(),
  severity: z.enum(["BAIXA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  photos: z.array(z.string().url()).optional().nullable(),
  status: z.enum(["ABERTO", "INVESTIGACAO", "ENCERRADO"]).optional(),
  involvedUserIds: z.array(z.string().uuid()).optional().nullable(),
  investigation: z
    .object({
      fiveWhys: z.array(z.string().min(2)).length(5).optional(),
      rootCause: z.string().optional().nullable(),
      immediateActions: z.array(z.string()).optional().nullable(),
      correctiveActions: z.array(z.string()).optional().nullable(),
      preventiveActions: z.array(z.string()).optional().nullable(),
      effectivenessCheck: z.string().optional().nullable(),
      verifiedById: z.string().uuid().optional().nullable()
    })
    .optional()
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST", "SUPERVISOR"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.incident.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");

    const incident = await prisma.$transaction(async (tx) => {
      const updated = await tx.incident.update({
        where: { id: params.id },
        data: {
          date: payload.date ? new Date(payload.date) : undefined,
          severity: payload.severity ?? undefined,
          description: payload.description ?? undefined,
          category: payload.category ?? undefined,
          photos: payload.photos ?? undefined,
          status: payload.status ?? undefined,
          involved: payload.involvedUserIds
            ? {
                deleteMany: {},
                create: payload.involvedUserIds.map((userId) => ({ userId }))
              }
            : undefined
        }
      });

      if (payload.investigation) {
        await tx.incidentInvestigation.upsert({
          where: { incidentId: params.id },
          update: {
            fiveWhys: payload.investigation.fiveWhys ?? undefined,
            rootCause: payload.investigation.rootCause ?? undefined,
            immediateActions: payload.investigation.immediateActions ?? undefined,
            correctiveActions: payload.investigation.correctiveActions ?? undefined,
            preventiveActions: payload.investigation.preventiveActions ?? undefined,
            effectivenessCheck: payload.investigation.effectivenessCheck ?? undefined,
            verifiedById: payload.investigation.verifiedById ?? undefined,
            verifiedAt: payload.investigation.verifiedById ? new Date() : undefined
          },
          create: {
            incidentId: params.id,
            fiveWhys: payload.investigation.fiveWhys ?? ["", "", "", "", ""],
            rootCause: payload.investigation.rootCause ?? null,
            immediateActions: payload.investigation.immediateActions ?? undefined,
            correctiveActions: payload.investigation.correctiveActions ?? undefined,
            preventiveActions: payload.investigation.preventiveActions ?? undefined,
            effectivenessCheck: payload.investigation.effectivenessCheck ?? null,
            verifiedById: payload.investigation.verifiedById ?? null,
            verifiedAt: payload.investigation.verifiedById ? new Date() : undefined
          }
        });
      }

      return updated;
    });

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "Incident",
      entityId: incident.id,
      before: before as unknown as Record<string, unknown>,
      after: incident as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk(incident);
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
    const before = await prisma.incident.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.incident.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "Incident",
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
