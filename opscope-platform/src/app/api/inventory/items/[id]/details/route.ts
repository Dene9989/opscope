import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req);
    const item = await prisma.inventoryItem.findFirst({
      where: { id: params.id, deletedAt: null }
    });
    if (!item) throw new Error("NOT_FOUND");

    const [balances, movements] = await Promise.all([
      prisma.stockBalance.findMany({
        where: { itemId: params.id },
        orderBy: { updatedAt: "desc" },
        include: { project: true, worksite: true, batch: true }
      }),
      prisma.movement.findMany({
        where: { itemId: params.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          batch: true,
          projectOrigin: true,
          projectDestination: true,
          worksiteOrigin: true,
          worksiteDestination: true,
          collaborator: true,
          responsibilityTerm: true
        }
      })
    ]);

    return jsonOk({ item, balances, movements });
  } catch (error) {
    return handleApiError(error);
  }
}
