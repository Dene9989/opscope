import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(req);
    const term = await prisma.responsibilityTerm.findUnique({
      where: { movementId: params.id }
    });
    if (!term) throw new Error("NOT_FOUND");

    return new Response(term.pdfData, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${term.fileName || `termo-${params.id}.pdf`}`
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
