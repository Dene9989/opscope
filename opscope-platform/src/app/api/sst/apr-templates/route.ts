import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { aprTemplateSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;

    const where: any = {};
    if (query) where.name = { contains: query, mode: "insensitive" };

    const [items, total] = await Promise.all([
      prisma.aprTemplate.findMany({ where, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
      prisma.aprTemplate.count({ where })
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
    const payload = aprTemplateSchema.parse(await req.json());
    const template = await prisma.aprTemplate.create({
      data: {
        name: payload.name,
        activity: payload.activity,
        hazards: payload.hazards,
        risks: payload.risks,
        controls: payload.controls,
        requiredTrainings: payload.requiredTrainings ?? undefined,
        requiredEpis: payload.requiredEpis ?? undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "AprTemplate",
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
