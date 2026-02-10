import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import type { Role } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "dev-opscope-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "12h";

export interface AuthPayload {
  sub: string;
  name: string;
  email: string;
  role: Role;
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }

  const cookie = req.cookies.get("opscope_token");
  return cookie?.value ?? null;
}

export function requireAuth(req: NextRequest): AuthPayload {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  return verifyToken(token);
}

export function requireRoles(user: AuthPayload, roles: Role[]) {
  if (!roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
}

export function getRequestMeta(req: NextRequest) {
  return {
    ip: req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown"
  };
}
