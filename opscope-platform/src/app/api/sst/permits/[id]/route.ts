import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { permitSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const updateSchema = permitSchema.partial();

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = updateSchema.parse(await req.json());
    const before = await prisma.permit.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    const permit = await prisma.permit.update({
      where: { id: params.id },
      data: {
        aprId: payload.aprId ?? undefined,
        type: payload.type ?? undefined,
        requirements: payload.requirements ?? undefined,
        approvedById: payload.approvedById ?? undefined,
        validFrom: payload.validFrom ? new Date(payload.validFrom) : undefined,
        validTo: payload.validTo ? new Date(payload.validTo) : undefined,
        status: payload.status ?? undefined
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "UPDATE",
      entity: "Permit",
      entityId: permit.id,
      before: before as unknown as Record<string, unknown>,
      after: permit as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(permit);
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
    const before = await prisma.permit.findUnique({ where: { id: params.id } });
    if (!before) throw new Error("NOT_FOUND");
    await prisma.permit.delete({ where: { id: params.id } });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "DELETE",
      entity: "Permit",
      entityId: params.id,
      before: before as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk({ id: params.id });
  } catch (error) {
    return handleApiError(error);
  }
}
