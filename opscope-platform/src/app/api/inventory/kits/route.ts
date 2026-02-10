import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { kitSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const roleName = searchParams.get("role") || undefined;

    const where = roleName ? { roleName } : {};

    const [items, total] = await Promise.all([
      prisma.kit.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { item: true } } }
      }),
      prisma.kit.count({ where })
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
    const payload = kitSchema.parse(await req.json());
    const kit = await prisma.kit.create({
      data: {
        name: payload.name,
        description: payload.description ?? null,
        roleName: payload.roleName ?? null,
        items: {
          create: payload.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            required: item.required
          }))
        }
      },
      include: { items: true }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "Kit",
      entityId: kit.id,
      after: kit as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(kit, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
