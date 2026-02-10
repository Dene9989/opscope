import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    const user = await prisma.user.findUnique({ where: { id: auth.sub } });
    if (!user) {
      throw new Error("UNAUTHORIZED");
    }

    return jsonOk({
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
