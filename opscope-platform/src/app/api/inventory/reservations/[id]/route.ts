import { NextRequest } from "next/server";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth, requireRoles, getRequestMeta } from "@/lib/auth";
import { updateReservationStatus } from "@/lib/services/stockService";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["SEPARADO", "CANCELADO"])
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(req);
    requireRoles(user, ["ADMIN", "GESTOR", "ALMOXARIFE"]);
    const payload = updateSchema.parse(await req.json());
    const meta = getRequestMeta(req);
    const updated = await updateReservationStatus(params.id, payload.status, user, meta);
    return jsonOk(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new Error("Dados invalidos"));
    }
    return handleApiError(error);
  }
}
