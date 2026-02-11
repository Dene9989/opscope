import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const unread = searchParams.get("unread");

    const where: any = { userId: user.sub };
    if (unread === "true") {
      where.readAt = null;
    }

    const [items, total] = await Promise.all([
      prisma.userNotification.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.userNotification.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}
