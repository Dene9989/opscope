import { NextResponse, type NextRequest } from "next/server";

export function getPagination(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Math.min(Number(searchParams.get("pageSize") || 20), 100);
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}

export function jsonOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return jsonError("Nao autorizado", 401);
    }
    if (error.message === "FORBIDDEN") {
      return jsonError("Sem permissao", 403);
    }
    if (error.message === "NOT_FOUND") {
      return jsonError("Registro nao encontrado", 404);
    }
    return jsonError(error.message || "Erro interno", 400);
  }
  return jsonError("Erro interno", 500);
}
