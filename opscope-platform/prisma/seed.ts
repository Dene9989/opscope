import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Opscope@123", 10);

  const [admin, almox, sst] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@opscope.local" },
      update: {},
      create: {
        name: "Admin OPSCOPE",
        email: "admin@opscope.local",
        passwordHash,
        role: "ADMIN"
      }
    }),
    prisma.user.upsert({
      where: { email: "almox@opscope.local" },
      update: {},
      create: {
        name: "Almoxarife",
        email: "almox@opscope.local",
        passwordHash,
        role: "ALMOXARIFE"
      }
    }),
    prisma.user.upsert({
      where: { email: "sst@opscope.local" },
      update: {},
      create: {
        name: "Tecnico SST",
        email: "sst@opscope.local",
        passwordHash,
        role: "TECNICO_SST"
      }
    })
  ]);

  const project = await prisma.project.create({
    data: {
      name: "Projeto Leste",
      code: "PRJ-001",
      description: "Projeto piloto",
      worksites: {
        create: [{ name: "Obra Central", address: "Rua A, 123" }]
      }
    }
  });

  const worksite = await prisma.worksite.findFirstOrThrow({ where: { projectId: project.id } });

  const item = await prisma.inventoryItem.create({
    data: {
      type: "EPI",
      name: "Capacete Classe B",
      description: "Capacete com jugular",
      brand: "SafePro",
      model: "SP-900",
      unit: "UN",
      internalCode: "EPI-001",
      barcode: "1234567890",
      caNumber: "12345",
      caValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      itemValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 2))
    }
  });

  await prisma.stock.create({
    data: {
      itemId: item.id,
      projectId: project.id,
      worksiteId: worksite.id,
      quantity: 40,
      reserved: 5,
      minQuantity: 10,
      reorderPoint: 15
    }
  });

  const training = await prisma.training.create({
    data: {
      name: "NR-35 Trabalho em Altura",
      nr: "NR-35",
      hours: 8,
      validityDays: 365,
      mandatoryRoles: ["COLABORADOR", "SUPERVISOR"],
      projectId: project.id
    }
  });

  await prisma.trainingRecord.create({
    data: {
      trainingId: training.id,
      userId: admin.id,
      date: new Date(),
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 11)),
      status: "VALIDO",
      certificateUrl: "https://example.com/cert.pdf"
    }
  });

  await prisma.inspectionTemplate.create({
    data: {
      type: "EPI",
      title: "Checklist EPI Basico",
      periodicityDays: 7,
      projectId: project.id,
      worksiteId: worksite.id,
      questions: [
        { id: "q1", text: "EPI completo?", required: true },
        { id: "q2", text: "Capacete em boas condicoes?", required: true }
      ]
    }
  });

  console.log("Seed concluido");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
