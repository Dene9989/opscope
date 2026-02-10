import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  stockId: z.string().uuid(),
  minQuantity: z.number().min(0).optional(),
  reorderPoint: z.number().min(0).optional()
});

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const worksiteId = searchParams.get("worksiteId") || undefined;
    const itemId = searchParams.get("itemId") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (worksiteId) where.worksiteId = worksiteId;
    if (itemId) where.itemId = itemId;

    const [items, total] = await Promise.all([
      prisma.stock.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: "desc" },
        include: { item: true, project: true, worksite: true }
      }),
      prisma.stock.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "ALMOXARIFE"]);
    const payload = updateSchema.parse(await req.json());
    const updated = await prisma.stock.update({
      where: { id: payload.stockId },
      data: {
        minQuantity: payload.minQuantity ?? undefined,
        reorderPoint: payload.reorderPoint ?? undefined
      }
    });
    return jsonOk(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
