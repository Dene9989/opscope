import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { incidentSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const severity = searchParams.get("severity") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (severity) where.severity = severity;

    const [items, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: "desc" },
        include: { involved: { include: { user: true } }, worksite: true, project: true }
      }),
      prisma.incident.count({ where })
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
    const payload = incidentSchema.parse(await req.json());
    const incident = await prisma.incident.create({
      data: {
        projectId: payload.projectId,
        worksiteId: payload.worksiteId ?? null,
        date: new Date(payload.date),
        severity: payload.severity,
        description: payload.description,
        category: payload.category,
        photos: payload.photos ?? undefined,
        fiveWhys: payload.fiveWhys ?? undefined,
        involved: payload.involvedUserIds
          ? {
              create: payload.involvedUserIds.map((userId) => ({ userId }))
            }
          : undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "Incident",
      entityId: incident.id,
      after: incident as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(incident, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
