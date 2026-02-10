import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type DbClient = PrismaClient | import("@prisma/client").Prisma.TransactionClient;

interface AuditInput {
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  ip?: string | null;
  userAgent?: string | null;
}

export async function writeAuditLog(input: AuditInput, client: DbClient = prisma) {
  return client.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      before: input.before ?? undefined,
      after: input.after ?? undefined,
      ip: input.ip ?? undefined,
      userAgent: input.userAgent ?? undefined
    }
  });
}
