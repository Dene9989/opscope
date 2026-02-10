import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { nonConformitySchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const severity = searchParams.get("severity") || undefined;

    const where: any = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const [items, total] = await Promise.all([
      prisma.nonConformity.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { inspection: true, incident: true }
      }),
      prisma.nonConformity.count({ where })
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
    const payload = nonConformitySchema.parse(await req.json());
    const nc = await prisma.nonConformity.create({
      data: {
        originType: payload.originType,
        inspectionId: payload.inspectionId ?? null,
        incidentId: payload.incidentId ?? null,
        severity: payload.severity,
        description: payload.description,
        evidenceUrls: payload.evidenceUrls ?? undefined,
        responsibleId: payload.responsibleId,
        dueDate: new Date(payload.dueDate),
        status: payload.status,
        createdById: user.sub
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "NonConformity",
      entityId: nc.id,
      after: nc as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(nc, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
