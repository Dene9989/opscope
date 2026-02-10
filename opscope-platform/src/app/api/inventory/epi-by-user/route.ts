import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const collaboratorId = searchParams.get("collaboratorId") || undefined;

    const where: any = {
      type: { in: ["SAIDA", "DEVOLUCAO"] },
      item: { type: "EPI" }
    };

    if (collaboratorId) {
      where.collaboratorId = collaboratorId;
    }

    if (user.role === "COLABORADOR") {
      where.collaboratorId = user.sub;
    }

    const [items, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { item: true, project: true, worksite: true }
      }),
      prisma.stockMovement.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}
