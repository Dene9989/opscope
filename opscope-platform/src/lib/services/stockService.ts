import type { Prisma } from "@prisma/client";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import type { AuthPayload } from "@/lib/auth";
import {
  entrySchema,
  deliverySchema,
  returnSchema,
  transferSchema,
  adjustmentSchema,
  writeOffSchema,
  reservationSchema
} from "@/lib/validation";

type EntryInput = z.infer<typeof entrySchema>;
type DeliveryInput = z.infer<typeof deliverySchema>;
type ReturnInput = z.infer<typeof returnSchema>;
type TransferInput = z.infer<typeof transferSchema>;
type AdjustmentInput = z.infer<typeof adjustmentSchema>;
type WriteOffInput = z.infer<typeof writeOffSchema>;
type ReservationInput = z.infer<typeof reservationSchema>;

interface RequestMeta {
  ip?: string | null;
  userAgent?: string | null;
}

const SERIALIZABLE = { isolationLevel: "Serializable" as const };

const toDate = (value?: string | null) => (value ? new Date(value) : null);

async function getOrCreateBalance(
  tx: Prisma.TransactionClient,
  input: { itemId: string; projectId: string; worksiteId?: string | null; batchId?: string | null }
) {
  return tx.stockBalance.upsert({
    where: {
      itemId_projectId_worksiteId_batchId: {
        itemId: input.itemId,
        projectId: input.projectId,
        worksiteId: input.worksiteId ?? null,
        batchId: input.batchId ?? null
      }
    },
    update: {},
    create: {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId ?? null,
      batchId: input.batchId ?? null,
      qtyAvailable: 0,
      qtyReserved: 0,
      minQuantity: 0,
      reorderPoint: 0
    }
  });
}

async function resolveBalanceForWithdrawal(
  tx: Prisma.TransactionClient,
  input: { itemId: string; projectId: string; worksiteId?: string | null; batchId?: string | null; qty: number }
) {
  if (input.batchId) {
    const balance = await getOrCreateBalance(tx, input);
    return balance;
  }

  const balance = await tx.stockBalance.findFirst({
    where: {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId ?? null,
      qtyAvailable: { gte: input.qty }
    },
    orderBy: [
      { batch: { itemValidUntil: "asc" } },
      { batch: { createdAt: "asc" } }
    ]
  });

  if (!balance) {
    throw new Error("Estoque insuficiente");
  }

  return balance;
}

async function createOrUpdateBatch(
  tx: Prisma.TransactionClient,
  input: EntryInput,
  userId: string
) {
  if (input.batchId) {
    const existing = await tx.inventoryBatch.findUnique({ where: { id: input.batchId } });
    if (!existing) throw new Error("Lote nao encontrado");
    return existing;
  }

  const code = input.batchCode?.trim() || `LOTE-${Date.now()}`;

  const existing = await tx.inventoryBatch.findFirst({
    where: {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId ?? null,
      batchCode: code
    }
  });

  if (existing) {
    return existing;
  }

  return tx.inventoryBatch.create({
    data: {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId ?? null,
      batchCode: code,
      itemValidUntil: toDate(input.itemValidUntil),
      caValidUntil: toDate(input.caValidUntil),
      unitCost: input.unitCost ?? null
    }
  });
}

async function applyAvailableDelta(tx: Prisma.TransactionClient, balanceId: string, delta: number) {
  const current = await tx.stockBalance.findUniqueOrThrow({ where: { id: balanceId } });
  const next = current.qtyAvailable + delta;
  if (next < 0) throw new Error("Estoque insuficiente");
  return tx.stockBalance.update({
    where: { id: balanceId },
    data: { qtyAvailable: next }
  });
}

async function applyReservedDelta(tx: Prisma.TransactionClient, balanceId: string, delta: number) {
  const current = await tx.stockBalance.findUniqueOrThrow({ where: { id: balanceId } });
  const next = current.qtyReserved + delta;
  if (next < 0) throw new Error("Reserva insuficiente");
  return tx.stockBalance.update({
    where: { id: balanceId },
    data: { qtyReserved: next }
  });
}

async function createMovementWithAttachments(
  tx: Prisma.TransactionClient,
  data: Prisma.MovementCreateInput,
  attachments?: Array<{ name: string; url: string; type?: string | null }>
) {
  return tx.movement.create({
    data: {
      ...data,
      attachments: attachments?.length
        ? {
            create: attachments.map((attachment) => ({
              name: attachment.name,
              url: attachment.url,
              type: attachment.type ?? null
            }))
          }
        : undefined
    }
  });
}

async function buildResponsibilityTermPdf(input: {
  movementId: string;
  collaboratorName: string;
  collaboratorEmail: string;
  itemName: string;
  qty: number;
  projectName: string;
  worksiteName?: string | null;
  createdByName: string;
  acceptedByName?: string | null;
  acceptedByCpf?: string | null;
  acceptedAt?: Date | null;
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText("Termo de Responsabilidade - Entrega de EPI/Material", {
    x: 50,
    y: 790,
    size: 16,
    font,
    color: rgb(0, 0, 0)
  });

  const lines = [
    `Movimento: ${input.movementId}`,
    `Colaborador: ${input.collaboratorName} (${input.collaboratorEmail})`,
    `Item: ${input.itemName}`,
    `Quantidade: ${input.qty}`,
    `Projeto: ${input.projectName}`,
    `Local: ${input.worksiteName || "-"}`,
    `Responsavel pela entrega: ${input.createdByName}`,
    `Data: ${new Date().toISOString().slice(0, 10)}`
  ];

  let y = 750;
  for (const line of lines) {
    page.drawText(line, { x: 50, y, size: 11, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 18;
  }

  y -= 10;
  page.drawText("Declaro que recebi os itens acima e me responsabilizo pelo uso adequado.", {
    x: 50,
    y,
    size: 10,
    font
  });

  y -= 50;
  page.drawText("Assinatura/aceite do colaborador:", { x: 50, y, size: 11, font });
  page.drawLine({ start: { x: 50, y: y - 10 }, end: { x: 400, y: y - 10 }, thickness: 1 });

  if (input.acceptedByName) {
    page.drawText(`Nome: ${input.acceptedByName}`, { x: 50, y: y - 30, size: 10, font });
  }
  if (input.acceptedByCpf) {
    page.drawText(`CPF: ${input.acceptedByCpf}`, { x: 50, y: y - 45, size: 10, font });
  }
  if (input.acceptedAt) {
    page.drawText(`Aceite em: ${input.acceptedAt.toISOString().slice(0, 10)}`, {
      x: 50,
      y: y - 60,
      size: 10,
      font
    });
  }

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

export async function registerEntry(input: EntryInput, user: AuthPayload, meta?: RequestMeta) {
  return prisma.$transaction(async (tx) => {
    const batch = await createOrUpdateBatch(tx, input, user.sub);
    const balance = await getOrCreateBalance(tx, {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId,
      batchId: batch.id
    });

    await applyAvailableDelta(tx, balance.id, input.qty);

    const movement = await createMovementWithAttachments(
      tx,
      {
        type: "ENTRADA",
        item: { connect: { id: input.itemId } },
        batch: { connect: { id: batch.id } },
        qty: input.qty,
        projectDestination: { connect: { id: input.projectId } },
        worksiteDestination: input.worksiteId ? { connect: { id: input.worksiteId } } : undefined,
        invoiceNumber: input.invoiceNumber ?? null,
        reason: input.reason ?? null,
        notes: input.notes ?? null,
        createdBy: { connect: { id: user.sub } }
      },
      input.attachments ?? undefined
    );

    await writeAuditLog(
      {
        userId: user.sub,
        action: "MOVEMENT",
        entity: "Movement",
        entityId: movement.id,
        after: movement as unknown as Record<string, unknown>,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      },
      tx
    );

    return movement;
  }, SERIALIZABLE);
}

export async function registerDelivery(input: DeliveryInput, user: AuthPayload, meta?: RequestMeta) {
  return prisma.$transaction(async (tx) => {
    let balance: Awaited<ReturnType<typeof getOrCreateBalance>>;

    if (input.reservationId) {
      const reservation = await tx.reservation.findUnique({ where: { id: input.reservationId } });
      if (!reservation) throw new Error("Reserva nao encontrada");
      if (reservation.status === "CANCELADO" || reservation.status === "CONSUMIDO") {
        throw new Error("Reserva indisponivel");
      }
      if (reservation.itemId !== input.itemId || reservation.projectId !== input.projectId) {
        throw new Error("Reserva nao corresponde ao item/projeto");
      }
      if (reservation.qty < input.qty) {
        throw new Error("Quantidade reservada insuficiente");
      }
      balance = await getOrCreateBalance(tx, {
        itemId: reservation.itemId,
        projectId: reservation.projectId,
        worksiteId: reservation.worksiteId,
        batchId: reservation.batchId
      });
      await applyReservedDelta(tx, balance.id, -input.qty);
      const remaining = reservation.qty - input.qty;
      await tx.reservation.update({
        where: { id: reservation.id },
        data: {
          qty: remaining,
          status: remaining === 0 ? "CONSUMIDO" : "SEPARADO"
        }
      });
    } else {
      balance = await resolveBalanceForWithdrawal(tx, {
        itemId: input.itemId,
        projectId: input.projectId,
        worksiteId: input.worksiteId,
        batchId: input.batchId ?? null,
        qty: input.qty
      });
      await applyAvailableDelta(tx, balance.id, -input.qty);
    }

    const movement = await createMovementWithAttachments(
      tx,
      {
        type: "ENTREGA",
        item: { connect: { id: input.itemId } },
        batch: balance.batchId ? { connect: { id: balance.batchId } } : undefined,
        qty: input.qty,
        projectOrigin: { connect: { id: input.projectId } },
        worksiteOrigin: input.worksiteId ? { connect: { id: input.worksiteId } } : undefined,
        collaborator: { connect: { id: input.collaboratorId } },
        reservation: input.reservationId ? { connect: { id: input.reservationId } } : undefined,
        reason: input.reason ?? null,
        notes: input.notes ?? null,
        createdBy: { connect: { id: user.sub } }
      },
      input.attachments ?? undefined
    );

    const [collaborator, item, project, worksite, createdBy] = await Promise.all([
      tx.user.findUnique({ where: { id: input.collaboratorId } }),
      tx.inventoryItem.findUnique({ where: { id: input.itemId } }),
      tx.project.findUnique({ where: { id: input.projectId } }),
      input.worksiteId ? tx.worksite.findUnique({ where: { id: input.worksiteId } }) : Promise.resolve(null),
      tx.user.findUnique({ where: { id: user.sub } })
    ]);

    if (!collaborator || !item || !project || !createdBy) {
      throw new Error("Dados insuficientes para termo");
    }

    const acceptedAt = input.term?.accepted ? new Date() : null;
    const pdfData = await buildResponsibilityTermPdf({
      movementId: movement.id,
      collaboratorName: collaborator.name,
      collaboratorEmail: collaborator.email,
      itemName: item.name,
      qty: input.qty,
      projectName: project.name,
      worksiteName: worksite?.name || null,
      createdByName: createdBy.name,
      acceptedByName: input.term?.name ?? null,
      acceptedByCpf: input.term?.cpf ?? null,
      acceptedAt
    });

    await tx.responsibilityTerm.create({
      data: {
        movement: { connect: { id: movement.id } },
        collaborator: { connect: { id: collaborator.id } },
        pdfData,
        fileName: `termo-${movement.id}.pdf`,
        acceptedAt,
        acceptedByName: input.term?.name ?? null,
        acceptedByCpf: input.term?.cpf ?? null,
        signatureData: input.term
          ? {
              accepted: input.term.accepted ?? false,
              name: input.term.name ?? null,
              cpf: input.term.cpf ?? null
            }
          : undefined
      }
    });

    await writeAuditLog(
      {
        userId: user.sub,
        action: "MOVEMENT",
        entity: "Movement",
        entityId: movement.id,
        after: movement as unknown as Record<string, unknown>,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      },
      tx
    );

    return movement;
  }, SERIALIZABLE);
}

export async function registerReturn(input: ReturnInput, user: AuthPayload, meta?: RequestMeta) {
  return prisma.$transaction(async (tx) => {
    const original = await tx.movement.findUnique({ where: { id: input.relatedMovementId } });
    if (!original || original.type !== "ENTREGA") {
      throw new Error("Entrega de referencia invalida");
    }
    if (original.itemId !== input.itemId) {
      throw new Error("Item divergente da entrega");
    }

    const returnedSum = await tx.movement.aggregate({
      where: { relatedMovementId: original.id, type: "DEVOLUCAO" },
      _sum: { qty: true }
    });
    const alreadyReturned = returnedSum._sum.qty ?? 0;
    if (alreadyReturned + input.qty > original.qty) {
      throw new Error("Quantidade devolvida excede a entrega");
    }

    const balance = await getOrCreateBalance(tx, {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId,
      batchId: original.batchId ?? null
    });

    await applyAvailableDelta(tx, balance.id, input.qty);

    const movement = await createMovementWithAttachments(
      tx,
      {
        type: "DEVOLUCAO",
        item: { connect: { id: input.itemId } },
        batch: original.batchId ? { connect: { id: original.batchId } } : undefined,
        qty: input.qty,
        projectDestination: { connect: { id: input.projectId } },
        worksiteDestination: input.worksiteId ? { connect: { id: input.worksiteId } } : undefined,
        collaborator: original.collaboratorId ? { connect: { id: original.collaboratorId } } : undefined,
        relatedMovement: { connect: { id: original.id } },
        reason: input.reason ?? null,
        notes: input.notes ?? null,
        createdBy: { connect: { id: user.sub } }
      },
      input.attachments ?? undefined
    );

    await writeAuditLog(
      {
        userId: user.sub,
        action: "MOVEMENT",
        entity: "Movement",
        entityId: movement.id,
        after: movement as unknown as Record<string, unknown>,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      },
      tx
    );

    return movement;
  }, SERIALIZABLE);
}

export async function registerTransfer(input: TransferInput, user: AuthPayload, meta?: RequestMeta) {
  return prisma.$transaction(async (tx) => {
    if (input.projectOriginId === input.projectDestinationId && input.worksiteOriginId === input.worksiteDestinationId) {
      throw new Error("Origem e destino nao podem ser iguais");
    }

    const originBalance = await resolveBalanceForWithdrawal(tx, {
      itemId: input.itemId,
      projectId: input.projectOriginId,
      worksiteId: input.worksiteOriginId,
      batchId: input.batchId ?? null,
      qty: input.qty
    });

    await applyAvailableDelta(tx, originBalance.id, -input.qty);

    const destinationBalance = await getOrCreateBalance(tx, {
      itemId: input.itemId,
      projectId: input.projectDestinationId,
      worksiteId: input.worksiteDestinationId,
      batchId: originBalance.batchId ?? input.batchId ?? null
    });

    await applyAvailableDelta(tx, destinationBalance.id, input.qty);

    const movement = await createMovementWithAttachments(
      tx,
      {
        type: "TRANSFERENCIA",
        item: { connect: { id: input.itemId } },
        batch: originBalance.batchId ? { connect: { id: originBalance.batchId } } : undefined,
        qty: input.qty,
        projectOrigin: { connect: { id: input.projectOriginId } },
        worksiteOrigin: input.worksiteOriginId ? { connect: { id: input.worksiteOriginId } } : undefined,
        projectDestination: { connect: { id: input.projectDestinationId } },
        worksiteDestination: input.worksiteDestinationId
          ? { connect: { id: input.worksiteDestinationId } }
          : undefined,
        reason: input.reason ?? null,
        notes: input.notes ?? null,
        createdBy: { connect: { id: user.sub } }
      },
      input.attachments ?? undefined
    );

    await writeAuditLog(
      {
        userId: user.sub,
        action: "MOVEMENT",
        entity: "Movement",
        entityId: movement.id,
        after: movement as unknown as Record<string, unknown>,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      },
      tx
    );

    return movement;
  }, SERIALIZABLE);
}

export async function registerAdjustment(input: AdjustmentInput, user: AuthPayload, meta?: RequestMeta) {
  return prisma.$transaction(async (tx) => {
    const balance = await getOrCreateBalance(tx, {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId,
      batchId: input.batchId ?? null
    });

    const delta = input.direction === "IN" ? input.qty : -input.qty;
    await applyAvailableDelta(tx, balance.id, delta);

    const movement = await createMovementWithAttachments(
      tx,
      {
        type: "AJUSTE",
        item: { connect: { id: input.itemId } },
        batch: balance.batchId ? { connect: { id: balance.batchId } } : undefined,
        qty: input.qty,
        projectOrigin: { connect: { id: input.projectId } },
        worksiteOrigin: input.worksiteId ? { connect: { id: input.worksiteId } } : undefined,
        reason: input.reason ?? null,
        notes: input.notes ?? null,
        createdBy: { connect: { id: user.sub } },
        approvedBy: { connect: { id: user.sub } }
      },
      input.attachments ?? undefined
    );

    await writeAuditLog(
      {
        userId: user.sub,
        action: "MOVEMENT",
        entity: "Movement",
        entityId: movement.id,
        after: movement as unknown as Record<string, unknown>,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      },
      tx
    );

    return movement;
  }, SERIALIZABLE);
}

export async function registerWriteOff(input: WriteOffInput, user: AuthPayload, meta?: RequestMeta) {
  return prisma.$transaction(async (tx) => {
    const balance = await resolveBalanceForWithdrawal(tx, {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId,
      batchId: input.batchId ?? null,
      qty: input.qty
    });

    await applyAvailableDelta(tx, balance.id, -input.qty);

    const movement = await createMovementWithAttachments(
      tx,
      {
        type: "BAIXA",
        item: { connect: { id: input.itemId } },
        batch: balance.batchId ? { connect: { id: balance.batchId } } : undefined,
        qty: input.qty,
        projectOrigin: { connect: { id: input.projectId } },
        worksiteOrigin: input.worksiteId ? { connect: { id: input.worksiteId } } : undefined,
        reason: input.reason ?? null,
        notes: input.notes ?? null,
        createdBy: { connect: { id: user.sub } },
        approvedBy: { connect: { id: user.sub } }
      },
      input.attachments ?? undefined
    );

    await writeAuditLog(
      {
        userId: user.sub,
        action: "MOVEMENT",
        entity: "Movement",
        entityId: movement.id,
        after: movement as unknown as Record<string, unknown>,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      },
      tx
    );

    return movement;
  }, SERIALIZABLE);
}

export async function createReservation(input: ReservationInput, user: AuthPayload, meta?: RequestMeta) {
  return prisma.$transaction(async (tx) => {
    const balance = await resolveBalanceForWithdrawal(tx, {
      itemId: input.itemId,
      projectId: input.projectId,
      worksiteId: input.worksiteId,
      batchId: input.batchId ?? null,
      qty: input.qty
    });

    await applyAvailableDelta(tx, balance.id, -input.qty);
    await applyReservedDelta(tx, balance.id, input.qty);

    const reservation = await tx.reservation.create({
      data: {
        itemId: input.itemId,
        projectId: input.projectId,
        worksiteId: input.worksiteId ?? null,
        batchId: balance.batchId ?? input.batchId ?? null,
        qty: input.qty,
        status: input.status ?? "RESERVADO",
        referenceType: input.referenceType ?? null,
        referenceId: input.referenceId ?? null,
        notes: input.notes ?? null,
        createdById: user.sub
      }
    });

    await writeAuditLog(
      {
        userId: user.sub,
        action: "RESERVATION",
        entity: "Reservation",
        entityId: reservation.id,
        after: reservation as unknown as Record<string, unknown>,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      },
      tx
    );

    return reservation;
  }, SERIALIZABLE);
}

export async function updateReservationStatus(
  reservationId: string,
  status: "SEPARADO" | "CANCELADO",
  user: AuthPayload,
  meta?: RequestMeta
) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({ where: { id: reservationId } });
    if (!reservation) throw new Error("Reserva nao encontrada");

    if (status === "CANCELADO" && reservation.status !== "CANCELADO") {
      const balance = await getOrCreateBalance(tx, {
        itemId: reservation.itemId,
        projectId: reservation.projectId,
        worksiteId: reservation.worksiteId,
        batchId: reservation.batchId
      });
      await applyReservedDelta(tx, balance.id, -reservation.qty);
      await applyAvailableDelta(tx, balance.id, reservation.qty);
    }

    const updated = await tx.reservation.update({
      where: { id: reservationId },
      data: { status }
    });

    await writeAuditLog(
      {
        userId: user.sub,
        action: "RESERVATION",
        entity: "Reservation",
        entityId: updated.id,
        before: reservation as unknown as Record<string, unknown>,
        after: updated as unknown as Record<string, unknown>,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null
      },
      tx
    );

    return updated;
  }, SERIALIZABLE);
}

export const StockService = {
  registerEntry,
  registerDelivery,
  registerReturn,
  registerTransfer,
  registerAdjustment,
  registerWriteOff,
  createReservation,
  updateReservationStatus
};
