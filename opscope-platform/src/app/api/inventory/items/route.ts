import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { itemSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;
    const query = searchParams.get("q") || undefined;
    const format = searchParams.get("format") || undefined;

    const where: any = {
      deletedAt: null
    };
    if (type) where.type = type;
    if (status) where.status = status;
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { internalCode: { contains: query, mode: "insensitive" } },
        { barcode: { contains: query, mode: "insensitive" } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.inventoryItem.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" }
      }),
      prisma.inventoryItem.count({ where })
    ]);

    if (format === "csv") {
      const header = "id,name,type,unit,status,internalCode,barcode";
      const rows = items
        .map((item) =>
          [item.id, item.name, item.type, item.unit, item.status, item.internalCode ?? "", item.barcode ?? ""].join(",")
        )
        .join("\n");
      return new Response(`${header}\n${rows}`, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=itens.csv"
        }
      });
    }

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "ALMOXARIFE"]);
    const payload = itemSchema.parse(await req.json());
    const item = await prisma.inventoryItem.create({
      data: {
        ...payload,
        caValidUntil: payload.caValidUntil ? new Date(payload.caValidUntil) : null,
        itemValidUntil: payload.itemValidUntil ? new Date(payload.itemValidUntil) : null,
        sizes: payload.sizes ?? undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "InventoryItem",
      entityId: item.id,
      after: item as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
