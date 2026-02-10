import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { userSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR"]);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || undefined;
    const where = query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } }
          ]
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, active: true }
      }),
      prisma.user.count({ where })
    ]);

    return jsonOk({ items, total, page, pageSize });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN"]);
    const payload = userSchema.parse(await req.json());
    const passwordHash = await bcrypt.hash(payload.password, 10);
    const created = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        role: payload.role,
        passwordHash
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "User",
      entityId: created.id,
      after: { id: created.id, name: created.name, email: created.email, role: created.role },
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk({ id: created.id, name: created.name, email: created.email, role: created.role }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
