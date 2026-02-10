import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import type { AuthPayload } from "@/lib/auth";

interface MovementInput {
  type:
    | "ENTRADA"
    | "SAIDA"
    | "TRANSFERENCIA"
    | "AJUSTE"
    | "DEVOLUCAO"
    | "PERDA_BAIXA"
    | "RESERVA"
    | "LIBERACAO_RESERVA";
  itemId: string;
  quantity: number;
  projectId: string;
  worksiteId?: string | null;
  sourceProjectId?: string | null;
  sourceWorksiteId?: string | null;
  destinationProjectId?: string | null;
  destinationWorksiteId?: string | null;
  collaboratorId?: string | null;
  activityId?: string | null;
  reason?: string | null;
  notes?: string | null;
  invoiceNumber?: string | null;
  batchCode?: string | null;
  attachments?: Array<{ name: string; url: string; type?: string | null }> | null;
}

interface RequestMeta {
  ip?: string | null;
  userAgent?: string | null;
}

async function getOrCreateStock(tx: Prisma.TransactionClient, input: {
  itemId: string;
  projectId: string;
  worksiteId?: string | null;
}) {
  return tx.stock.upsert({
    where: {
      itemId_projectId_worksiteId: {
        itemId: input.itemId,
        projectId: input.projectId,
        worksiteId: input.worksiteId ?? null
      }
    },
    update: {},
    create: {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId ?? null,
      quantity: 0,
      reserved: 0,
      minQuantity: 0,
      reorderPoint: 0
    }
  });
}

export async function createMovement(input: MovementInput, user: AuthPayload, meta?: RequestMeta) {
  if (input.quantity <= 0) {
    throw new Error("Quantidade invalida");
  }

  return prisma.$transaction(
    async (tx) => {
      const movement = await tx.stockMovement.create({
        data: {
          type: input.type,
          itemId: input.itemId,
          quantity: input.quantity,
          projectId: input.projectId,
          worksiteId: input.worksiteId ?? null,
          sourceProjectId: input.sourceProjectId ?? null,
          sourceWorksiteId: input.sourceWorksiteId ?? null,
          destinationProjectId: input.destinationProjectId ?? null,
          destinationWorksiteId: input.destinationWorksiteId ?? null,
          collaboratorId: input.collaboratorId ?? null,
          activityId: input.activityId ?? null,
          reason: input.reason ?? null,
          notes: input.notes ?? null,
          invoiceNumber: input.invoiceNumber ?? null,
          batchCode: input.batchCode ?? null,
          createdById: user.sub,
          attachments: input.attachments
            ? {
                create: input.attachments.map((attachment) => ({
                  name: attachment.name,
                  url: attachment.url,
                  type: attachment.type ?? null
                }))
              }
            : undefined
        }
      });

      const applyDecrease = async (projectId: string, worksiteId?: string | null) => {
        const stock = await getOrCreateStock(tx, { itemId: input.itemId, projectId, worksiteId });
        const available = stock.quantity - stock.reserved;
        if (available < input.quantity) {
          throw new Error("Estoque insuficiente");
        }
        await tx.stock.update({
          where: { id: stock.id },
          data: { quantity: { decrement: input.quantity } }
        });
      };

      const applyIncrease = async (projectId: string, worksiteId?: string | null) => {
        const stock = await getOrCreateStock(tx, { itemId: input.itemId, projectId, worksiteId });
        await tx.stock.update({
          where: { id: stock.id },
          data: { quantity: { increment: input.quantity } }
        });
      };

      const applyReserve = async (projectId: string, worksiteId?: string | null) => {
        const stock = await getOrCreateStock(tx, { itemId: input.itemId, projectId, worksiteId });
        const available = stock.quantity - stock.reserved;
        if (available < input.quantity) {
          throw new Error("Estoque insuficiente para reserva");
        }
        await tx.stock.update({
          where: { id: stock.id },
          data: { reserved: { increment: input.quantity } }
        });
      };

      const applyRelease = async (projectId: string, worksiteId?: string | null) => {
        const stock = await getOrCreateStock(tx, { itemId: input.itemId, projectId, worksiteId });
        if (stock.reserved < input.quantity) {
          throw new Error("Reserva insuficiente");
        }
        await tx.stock.update({
          where: { id: stock.id },
          data: { reserved: { decrement: input.quantity } }
        });
      };

      if (["ENTRADA", "DEVOLUCAO", "AJUSTE"].includes(input.type)) {
        await applyIncrease(input.projectId, input.worksiteId);
      }

      if (["SAIDA", "PERDA_BAIXA"].includes(input.type)) {
        await applyDecrease(input.projectId, input.worksiteId);
      }

      if (input.type === "TRANSFERENCIA") {
        const sourceProjectId = input.sourceProjectId ?? input.projectId;
        const destinationProjectId = input.destinationProjectId;
        if (!destinationProjectId) {
          throw new Error("Destino obrigatorio para transferencia");
        }
        await applyDecrease(sourceProjectId, input.sourceWorksiteId ?? input.worksiteId ?? null);
        await applyIncrease(destinationProjectId, input.destinationWorksiteId ?? null);
      }

      if (input.type === "RESERVA") {
        await applyReserve(input.projectId, input.worksiteId);
      }

      if (input.type === "LIBERACAO_RESERVA") {
        await applyRelease(input.projectId, input.worksiteId);
      }

      await writeAuditLog(
        {
          userId: user.sub,
          action: "MOVEMENT",
          entity: "StockMovement",
          entityId: movement.id,
          after: movement as unknown as Record<string, unknown>,
          ip: meta?.ip ?? null,
          userAgent: meta?.userAgent ?? null
        },
        tx
      );

      return movement;
    },
    { isolationLevel: "Serializable" }
  );
}
