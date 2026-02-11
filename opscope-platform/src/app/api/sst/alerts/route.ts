import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { computeSstAlerts, syncSstAlerts } from "@/lib/services/sstAlerts";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const alerts = await computeSstAlerts(prisma);
    const synced = await syncSstAlerts(prisma, alerts);
    return jsonOk({ items: synced });
  } catch (error) {
    return handleApiError(error);
  }
}
