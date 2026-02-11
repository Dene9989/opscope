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

  let project = await prisma.project.findFirst({ where: { code: "PRJ-001" } });
  if (!project) {
    project = await prisma.project.create({
      data: {
        name: "Projeto Leste",
        code: "PRJ-001",
        description: "Projeto piloto",
        worksites: {
          create: [{ name: "Obra Central", address: "Rua A, 123" }]
        }
      }
    });
  }

  const worksite = await prisma.worksite.findFirstOrThrow({ where: { projectId: project.id } });

  let epiItem = await prisma.inventoryItem.findFirst({ where: { internalCode: "EPI-001" } });
  if (!epiItem) {
    epiItem = await prisma.inventoryItem.create({
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
  }

  const batch = await prisma.inventoryBatch.upsert({
    where: {
      itemId_projectId_worksiteId_batchCode: {
        itemId: epiItem.id,
        projectId: project.id,
        worksiteId: worksite.id,
        batchCode: "LOTE-0001"
      }
    },
    update: {},
    create: {
      itemId: epiItem.id,
      projectId: project.id,
      worksiteId: worksite.id,
      batchCode: "LOTE-0001",
      itemValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      caValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      unitCost: 35.5
    }
  });

  await prisma.stockBalance.upsert({
    where: {
      itemId_projectId_worksiteId_batchId: {
        itemId: epiItem.id,
        projectId: project.id,
        worksiteId: worksite.id,
        batchId: batch.id
      }
    },
    update: { qtyAvailable: 40, qtyReserved: 5 },
    create: {
      itemId: epiItem.id,
      projectId: project.id,
      worksiteId: worksite.id,
      batchId: batch.id,
      qtyAvailable: 40,
      qtyReserved: 5,
      minQuantity: 10,
      reorderPoint: 15
    }
  });

  let nr10 = await prisma.training.findFirst({ where: { name: "NR-10 Seguranca em Instalacoes Eletricas" } });
  if (!nr10) {
    nr10 = await prisma.training.create({
      data: {
        name: "NR-10 Seguranca em Instalacoes Eletricas",
        nr: "NR-10",
        hours: 40,
        validityDays: 365
      }
    });
  }

  let nr35 = await prisma.training.findFirst({ where: { name: "NR-35 Trabalho em Altura" } });
  if (!nr35) {
    nr35 = await prisma.training.create({
      data: {
        name: "NR-35 Trabalho em Altura",
        nr: "NR-35",
        hours: 8,
        validityDays: 365
      }
    });
  }

  await prisma.trainingRequirementByRole.createMany({
    data: [
      { trainingId: nr10.id, role: "SUPERVISOR", projectId: project.id, mandatory: true },
      { trainingId: nr35.id, role: "COLABORADOR", projectId: project.id, mandatory: true }
    ],
    skipDuplicates: true
  });

  const existingRecord = await prisma.trainingRecord.findFirst({
    where: { trainingId: nr35.id, userId: admin.id }
  });
  if (!existingRecord) {
    await prisma.trainingRecord.create({
      data: {
        trainingId: nr35.id,
        userId: admin.id,
        date: new Date(),
        validUntil: new Date(new Date().setMonth(new Date().getMonth() + 11)),
        status: "VALIDO",
        certificateUrl: "https://example.com/cert.pdf",
        projectId: project.id
      }
    });
  }

  const extintorTemplate = await prisma.checklistTemplate.create({
    data: {
      type: "EXTINTOR",
      title: "Checklist Extintor",
      periodicityDays: 30,
      projectId: project.id,
      worksiteId: worksite.id,
      questions: {
        create: [
          { order: 1, text: "Extintor sinalizado?", type: "BOOLEAN", required: true },
          { order: 2, text: "Validade do extintor OK?", type: "BOOLEAN", required: true, requiresPhotoOnFail: true }
        ]
      }
    }
  });

  await prisma.checklistTemplate.create({
    data: {
      type: "ANDAIME",
      title: "Checklist Andaime",
      periodicityDays: 7,
      projectId: project.id,
      worksiteId: worksite.id,
      questions: {
        create: [
          { order: 1, text: "Rodape instalado?", type: "BOOLEAN", required: true },
          { order: 2, text: "Linha de vida instalada?", type: "BOOLEAN", required: true, requiresPhotoOnFail: true }
        ]
      }
    }
  });

  await prisma.inspectionRun.create({
    data: {
      templateId: extintorTemplate.id,
      projectId: project.id,
      worksiteId: worksite.id,
      performedById: sst.id,
      performedAt: new Date(),
      status: "OK",
      answers: [{ questionId: "seed", answer: "OK", ok: true }]
    }
  });

  const incident = await prisma.incident.create({
    data: {
      projectId: project.id,
      worksiteId: worksite.id,
      date: new Date(),
      severity: "MEDIA",
      description: "Quase acidente com material",
      category: "Quase acidente",
      createdById: sst.id
    }
  });

  await prisma.nonConformity.create({
    data: {
      originType: "INCIDENTE",
      incidentId: incident.id,
      projectId: project.id,
      worksiteId: worksite.id,
      severity: "ALTA",
      title: "Falta de sinalizacao",
      description: "Area sem sinalizacao de risco",
      responsibleId: sst.id,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
      status: "ABERTA",
      createdById: admin.id
    }
  });

  const aprTemplate = await prisma.aprTemplate.create({
    data: {
      name: "APR Trabalho em Altura",
      activity: "Manutencao em altura",
      hazards: ["Queda"],
      risks: ["Lesao grave"],
      controls: ["Linha de vida", "Cinto"],
      requiredTrainings: [nr35.id],
      requiredEpis: [epiItem.id]
    }
  });

  const apr = await prisma.apr.create({
    data: {
      projectId: project.id,
      worksiteId: worksite.id,
      templateId: aprTemplate.id,
      activity: "Manutencao em altura",
      hazards: ["Queda"],
      risks: ["Lesao grave"],
      controls: ["Linha de vida", "Cinto"],
      status: "APROVADA"
    }
  });

  await prisma.permitToWork.create({
    data: {
      aprId: apr.id,
      projectId: project.id,
      worksiteId: worksite.id,
      type: "ALTURA",
      requirements: ["Checklist atualizado", "EPI valido"],
      validFrom: new Date(),
      validTo: new Date(new Date().setDate(new Date().getDate() + 1)),
      status: "ABERTA",
      approvals: { create: [{ userId: admin.id, status: "PENDENTE" }] },
      collaborators: { create: [{ userId: admin.id }] }
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
