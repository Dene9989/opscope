import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { reservationSchema } from "@/lib/validation";
import { createReservation } from "@/lib/services/stockService";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const itemId = searchParams.get("itemId") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (itemId) where.itemId = itemId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { item: true, batch: true, project: true, worksite: true, createdBy: true }
      }),
      prisma.reservation.count({ where })
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
    const payload = reservationSchema.parse(await req.json());
    const meta = getRequestMeta(req);
    const reservation = await createReservation(payload, user, meta);
    return jsonOk(reservation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}

