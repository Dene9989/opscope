import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { actionPlanItemSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const nonConformityId = searchParams.get("nonConformityId") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: any = {};
    if (nonConformityId) where.nonConformityId = nonConformityId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.actionPlanItem.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { nonConformity: true, responsible: true }
      }),
      prisma.actionPlanItem.count({ where })
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
    const payload = actionPlanItemSchema.parse(await req.json());
    const item = await prisma.actionPlanItem.create({
      data: {
        nonConformityId: payload.nonConformityId,
        title: payload.title,
        description: payload.description ?? null,
        responsibleId: payload.responsibleId,
        dueDate: new Date(payload.dueDate),
        status: payload.status,
        evidenceUrls: payload.evidenceUrls ?? undefined,
        notes: payload.notes ?? null
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "ActionPlanItem",
      entityId: item.id,
      after: item as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
