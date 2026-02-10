import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req);
    const movement = await prisma.stockMovement.findUnique({
      where: { id: params.id },
      include: { item: true, project: true, worksite: true }
    });
    if (!movement) throw new Error("NOT_FOUND");

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const title = "Termo de Responsabilidade - Entrega de EPI";
    page.drawText(title, { x: 50, y: 790, size: 18, font, color: rgb(0, 0, 0) });

    const lines = [
      `Movimento: ${movement.id}`,
      `Tipo: ${movement.type}`,
      `Item: ${movement.item.name}`,
      `Quantidade: ${movement.quantity}`,
      `Projeto: ${movement.project.name}`,
      `Local: ${movement.worksite?.name || "-"}`,
      `Data: ${movement.createdAt.toISOString().slice(0, 10)}`,
      `Responsavel: ${movement.createdById}`
    ];

    let y = 750;
    for (const line of lines) {
      page.drawText(line, { x: 50, y, size: 12, font, color: rgb(0.1, 0.1, 0.1) });
      y -= 20;
    }

    page.drawText("Assinatura do colaborador:", { x: 50, y: 560, size: 12, font });
    page.drawLine({ start: { x: 50, y: 540 }, end: { x: 400, y: 540 }, thickness: 1 });

    const bytes = await pdfDoc.save();
    return new Response(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=termo-${movement.id}.pdf`
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
