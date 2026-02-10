import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { jsonError } from "@/lib/api";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) {
      return jsonError("Credenciais invalidas", 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return jsonError("Credenciais invalidas", 401);
    }

    const token = signToken({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return Response.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("Dados invalidos", 422);
    }
    return jsonError("Erro ao autenticar", 400);
  }
}
