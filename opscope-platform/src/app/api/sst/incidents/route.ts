import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { incidentSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { generateSimplePdf } from "@/lib/services/simplePdf";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const severity = searchParams.get("severity") || undefined;
    const status = searchParams.get("status") || undefined;
    const format = searchParams.get("format") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { date: "desc" },
        include: { project: true, worksite: true, involved: { include: { user: true } }, investigation: true }
      }),
      prisma.incident.count({ where })
    ]);

    if (format === "csv") {
      const header = "id,category,severity,status,project,worksite,date";
      const rows = items
        .map((item) =>
          [
            item.id,
            item.category,
            item.severity,
            item.status,
            item.project?.name ?? "",
            item.worksite?.name ?? "",
            item.date.toISOString()
          ].join(",")
        )
        .join("\n");
      return new Response(`${header}\n${rows}`, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=incidentes.csv"
        }
      });
    }

    if (format === "pdf") {
      const lines = items.map((item) => {
        return [
          item.category,
          item.severity,
          item.status,
          new Date(item.date).toLocaleDateString("pt-BR")
        ].join(" | ");
      });
      const pdfBytes = await generateSimplePdf("Relatorio de Incidentes", lines);
      return new Response(pdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=incidentes.pdf"
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
    requireRoles(user, ["ADMIN", "GESTOR", "TECNICO_SST", "SUPERVISOR"]);
    const payload = incidentSchema.parse(await req.json());

    const incident = await prisma.incident.create({
      data: {
        projectId: payload.projectId,
        worksiteId: payload.worksiteId ?? null,
        date: new Date(payload.date),
        severity: payload.severity,
        status: "ABERTO",
        description: payload.description,
        category: payload.category,
        photos: payload.photos ?? undefined,
        createdById: user.sub,
        involved: payload.involvedUserIds?.length
          ? {
              create: payload.involvedUserIds.map((userId) => ({ userId }))
            }
          : undefined
      },
      include: { involved: true }
    });

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "Incident",
      entityId: incident.id,
      after: incident as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk(incident, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
