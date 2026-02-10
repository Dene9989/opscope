import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/prisma";
import { registerEntry, registerDelivery } from "../src/lib/services/stockService";

const user = {
  sub: "00000000-0000-0000-0000-000000000001",
  name: "Tester",
  email: "test@opscope.local",
  role: "ADMIN"
} as const;

describe("inventoryService", () => {
  beforeAll(async () => {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.sub,
        name: user.name,
        email: user.email,
        role: "ADMIN",
        passwordHash: "hash"
      }
    });
  });

  beforeEach(async () => {
    await prisma.movementAttachment.deleteMany();
    await prisma.responsibilityTerm.deleteMany();
    await prisma.movement.deleteMany();
    await prisma.reservation.deleteMany();
    await prisma.stockBalance.deleteMany();
    await prisma.inventoryBatch.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.worksite.deleteMany();
    await prisma.project.deleteMany();

    const project = await prisma.project.create({
      data: { name: "Projeto Teste" }
    });

    const item = await prisma.inventoryItem.create({
      data: { name: "Item Teste", type: "FERRAMENTA", unit: "UN" }
    });

    await registerEntry(
      {
        type: "ENTRADA",
        itemId: item.id,
        projectId: project.id,
        qty: 1,
        batchCode: "LOTE-TESTE"
      },
      user
    );
  });

  it("impede estoque negativo", async () => {
    const project = await prisma.project.findFirstOrThrow();
    const item = await prisma.inventoryItem.findFirstOrThrow();

    await expect(
      registerDelivery(
        {
          type: "ENTREGA",
          itemId: item.id,
          qty: 2,
          projectId: project.id,
          collaboratorId: user.sub
        },
        user
      )
    ).rejects.toThrow("Estoque insuficiente");
  });

  it("registra entrada e atualiza estoque", async () => {
    const project = await prisma.project.findFirstOrThrow();
    const item = await prisma.inventoryItem.findFirstOrThrow();

    await registerEntry(
      {
        type: "ENTRADA",
        itemId: item.id,
        qty: 5,
        projectId: project.id,
        batchCode: "LOTE-02"
      },
      user
    );

    const stock = await prisma.stockBalance.findFirstOrThrow({
      where: { itemId: item.id, projectId: project.id }
    });

    expect(stock.qtyAvailable).toBe(6);
  });
});
