import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { itemSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = itemSchema.partial();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req);
    const item = await prisma.inventoryItem.findFirst({
      where: { id: params.id, deletedAt: null }
    });
    if (!item) throw new Error("NOT_FOUND");
    return jsonOk(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "ALMOXARIFE"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.inventoryItem.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const item = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        ...payload,
        caValidUntil: payload.caValidUntil ? new Date(payload.caValidUntil) : undefined,
        itemValidUntil: payload.itemValidUntil ? new Date(payload.itemValidUntil) : undefined,
        sizes: payload.sizes ?? undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "InventoryItem",
      entityId: item.id,
      before: before as unknown as Record<string, unknown>,
      after: item as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR"]);
    const before = await prisma.inventoryItem.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const item = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: { deletedAt: new Date(), status: "INATIVO" }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "InventoryItem",
      entityId: item.id,
      before: before as unknown as Record<string, unknown>,
      after: item as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk({ id: item.id });
  } catch (error) {
    return handleApiError(error);
  }
}
