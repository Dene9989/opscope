import { NextRequest } from "next/server";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req);
    const item = await prisma.inventoryItem.findFirst({ where: { id: params.id, deletedAt: null } });
    if (!item) throw new Error("NOT_FOUND");
    const payload = `OPSCOPE:ITEM:${item.id}`;
    const buffer = await QRCode.toBuffer(payload, { width: 300 });
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename=${item.id}.png`
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
