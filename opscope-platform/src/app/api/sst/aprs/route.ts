import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { aprSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;

    const [items, total] = await Promise.all([
      prisma.apr.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { permits: true, project: true, worksite: true }
      }),
      prisma.apr.count({ where })
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
    const payload = aprSchema.parse(await req.json());
    const apr = await prisma.apr.create({
      data: {
        projectId: payload.projectId,
        worksiteId: payload.worksiteId ?? null,
        activity: payload.activity,
        hazards: payload.hazards,
        risks: payload.risks,
        controls: payload.controls,
        approvedById: payload.approvedById ?? null,
        status: payload.status
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "Apr",
      entityId: apr.id,
      after: apr as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(apr, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
