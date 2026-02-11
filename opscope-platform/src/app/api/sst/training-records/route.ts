import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { trainingRecordSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { generateSimplePdf } from "@/lib/services/simplePdf";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const status = searchParams.get("status") || undefined;
    const format = searchParams.get("format") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.trainingRecord.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: "desc" },
        include: { training: true, user: true, project: true }
      }),
      prisma.trainingRecord.count({ where })
    ]);

    if (format === "csv") {
      const header = "id,training,user,date,validUntil,status,project";
      const rows = items
        .map((record) =>
          [
            record.id,
            record.training?.name ?? "",
            record.user?.name ?? "",
            record.date.toISOString(),
            record.validUntil.toISOString(),
            record.status,
            record.project?.name ?? ""
          ].join(",")
        )
        .join("\n");
      return new Response(`${header}\n${rows}`, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=treinamentos.csv"
        }
      });
    }

    if (format === "pdf") {
      const lines = items.map((record) => {
        return [
          record.training?.name ?? "-",
          record.user?.name ?? "-",
          new Date(record.validUntil).toLocaleDateString("pt-BR"),
          record.status
        ].join(" | ");
      });
      const pdfBytes = await generateSimplePdf("Relatorio de Treinamentos", lines);
      return new Response(pdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=treinamentos.pdf"
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
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST"]);
    const payload = trainingRecordSchema.parse(await req.json());
    const record = await prisma.trainingRecord.create({
      data: {
        trainingId: payload.trainingId,
        userId: payload.userId,
        date: new Date(payload.date),
        validUntil: new Date(payload.validUntil),
        status: payload.status,
        certificateUrl: payload.certificateUrl ?? null,
        projectId: payload.projectId ?? null
      }
    });
    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "TrainingRecord",
      entityId: record.id,
      after: record as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });
    return jsonOk(record, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
