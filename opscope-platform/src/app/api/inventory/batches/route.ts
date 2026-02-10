import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId") || undefined;
    const projectId = searchParams.get("projectId") || undefined;
    const worksiteId = searchParams.get("worksiteId") || undefined;

    const where: any = {};
    if (itemId) where.itemId = itemId;
    if (projectId) where.projectId = projectId;
    if (worksiteId) where.worksiteId = worksiteId;

    const [items, total] = await Promise.all([
      prisma.inventoryBatch.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.inventoryBatch.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

