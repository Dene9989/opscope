import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/prisma";
import { createMovement } from "../src/lib/services/inventoryService";

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
    await prisma.stockMovementAttachment.deleteMany();
    await prisma.stockMovement.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.worksite.deleteMany();
    await prisma.project.deleteMany();

    const project = await prisma.project.create({
      data: { name: "Projeto Teste" }
    });

    const item = await prisma.inventoryItem.create({
      data: { name: "Item Teste", type: "FERRAMENTA", unit: "UN" }
    });

    await prisma.stock.create({
      data: {
        itemId: item.id,
        projectId: project.id,
        quantity: 1,
        reserved: 0,
        minQuantity: 0,
        reorderPoint: 0
      }
    });
  });

  it("impede estoque negativo", async () => {
    const project = await prisma.project.findFirstOrThrow();
    const item = await prisma.inventoryItem.findFirstOrThrow();

    await expect(
      createMovement(
        {
          type: "SAIDA",
          itemId: item.id,
          quantity: 2,
          projectId: project.id
        },
        user
      )
    ).rejects.toThrow("Estoque insuficiente");
  });

  it("registra entrada e atualiza estoque", async () => {
    const project = await prisma.project.findFirstOrThrow();
    const item = await prisma.inventoryItem.findFirstOrThrow();

    await createMovement(
      {
        type: "ENTRADA",
        itemId: item.id,
        quantity: 5,
        projectId: project.id
      },
      user
    );

    const stock = await prisma.stock.findFirstOrThrow({
      where: { itemId: item.id, projectId: project.id }
    });

    expect(stock.quantity).toBe(6);
  });
});
