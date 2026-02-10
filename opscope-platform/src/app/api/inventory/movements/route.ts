import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { movementSchema } from "@/lib/validation";
import { createMovement } from "@/lib/services/inventoryService";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const type = searchParams.get("type") || undefined;
    const itemId = searchParams.get("itemId") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (type) where.type = type;
    if (itemId) where.itemId = itemId;

    if (user.role === "COLABORADOR") {
      where.collaboratorId = user.sub;
    }

    const [items, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          item: true,
          project: true,
          worksite: true,
          attachments: true
        }
      }),
      prisma.stockMovement.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "ALMOXARIFE"]);
    const payload = movementSchema.parse(await req.json());
    const meta = getRequestMeta(req);
    const movement = await createMovement(payload, user, meta);
    return jsonOk(movement, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
