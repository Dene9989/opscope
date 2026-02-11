import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { documentationSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const projectId = searchParams.get("projectId") || undefined;
    const responsibleId = searchParams.get("responsibleId") || undefined;
    const query = searchParams.get("q") || undefined;

    const where: any = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;
    if (responsibleId) where.responsibleId = responsibleId;
    if (query) {
      where.activityName = { contains: query, mode: "insensitive" };
    }

    const [items, total] = await Promise.all([
      prisma.activityDocumentation.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          project: true,
          worksite: true,
          responsible: true,
          reviewer: true,
          attachments: true
        }
      }),
      prisma.activityDocumentation.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "SUPERVISOR", "TECNICO_SST"]);
    const payload = documentationSchema.parse(await req.json());

    const doc = await prisma.activityDocumentation.create({
      data: {
        activityId: payload.activityId ?? null,
        activityName: payload.activityName,
        projectId: payload.projectId,
        worksiteId: payload.worksiteId ?? null,
        responsibleId: payload.responsibleId,
        aprReference: payload.aprReference ?? null,
        aprFileUrl: payload.aprFileUrl ?? null,
        attachments: payload.attachments?.length
          ? {
              create: payload.attachments.map((attachment) => ({
                name: attachment.name,
                url: attachment.url,
                type: attachment.type ?? null
              }))
            }
          : undefined
      },
      include: { attachments: true }
    });

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "ActivityDocumentation",
      entityId: doc.id,
      after: doc as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk(doc, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
