import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPagination, handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { inspectionRunSchema } from "@/lib/validation";
import { writeAuditLog } from "@/lib/audit";
import { generateSimplePdf } from "@/lib/services/simplePdf";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const { page, pageSize, skip } = getPagination(req);
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || undefined;
    const status = searchParams.get("status") || undefined;
    const format = searchParams.get("format") || undefined;

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.inspectionRun.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { performedAt: "desc" },
        include: { template: true, project: true, worksite: true, nonConformity: true, performedBy: true }
      }),
      prisma.inspectionRun.count({ where })
    ]);

    if (format === "csv") {
      const header = "id,checklist,project,worksite,status,performedAt";
      const rows = items
        .map((item) =>
          [
            item.id,
            item.template?.title ?? "",
            item.project?.name ?? "",
            item.worksite?.name ?? "",
            item.status,
            item.performedAt.toISOString()
          ].join(",")
        )
        .join("\n");
      return new Response(`${header}\n${rows}`, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=inspecoes.csv"
        }
      });
    }

    if (format === "pdf") {
      const lines = items.map((item) => {
        return [
          item.template?.title ?? "-",
          item.project?.name ?? "-",
          item.status,
          new Date(item.performedAt).toLocaleDateString("pt-BR")
        ].join(" | ");
      });
      const pdfBytes = await generateSimplePdf("Relatorio de Inspecoes", lines);
      return new Response(pdfBytes, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "attachment; filename=inspecoes.pdf"
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
    const payload = inspectionRunSchema.parse(await req.json());

    const inspection = await prisma.inspectionRun.create({
      data: {
        templateId: payload.templateId,
        projectId: payload.projectId,
        worksiteId: payload.worksiteId ?? null,
        performedById: user.sub,
        performedAt: new Date(payload.performedAt),
        status: payload.status,
        answers: payload.answers,
        evidenceUrls: payload.evidenceUrls ?? undefined,
        geo: payload.geo ?? undefined
      }
    });

    let nonConformityId: string | null = null;

    if (payload.status === "NAO_CONFORME") {
      const nc = await prisma.nonConformity.create({
        data: {
          originType: "INSPECAO",
          inspectionId: inspection.id,
          projectId: payload.projectId,
          worksiteId: payload.worksiteId ?? null,
          severity: "MEDIA",
          title: "Nao conformidade gerada pela inspecao",
          description: "Nao conformidade gerada automaticamente",
          responsibleId: user.sub,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "ABERTA",
          createdById: user.sub
        }
      });
      nonConformityId = nc.id;
    }

    const meta = getRequestMeta(req);
    await writeAuditLog({
      userId: user.sub,
      action: "CREATE",
      entity: "InspectionRun",
      entityId: inspection.id,
      after: inspection as unknown as Record<string, unknown>,
      ip: meta.ip,
      userAgent: meta.userAgent
    });

    return jsonOk({ inspection, nonConformityId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
