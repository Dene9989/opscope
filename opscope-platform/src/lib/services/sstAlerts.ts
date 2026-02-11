import type { PrismaClient } from "@prisma/client";

type DbClient = PrismaClient | import("@prisma/client").Prisma.TransactionClient;

export interface AlertInput {
  projectId?: string | null;
  type:
    | "TREINAMENTO_VENCER"
    | "TREINAMENTO_VENCIDO"
    | "INSPECAO_ATRASADA"
    | "NC_VENCENDO"
    | "NC_VENCIDA"
    | "PT_VENCER"
    | "PT_VENCIDA";
  severity: "INFO" | "ATENCAO" | "CRITICA";
  title: string;
  message: string;
  dueDate?: Date | null;
  entityType?: string | null;
  entityId?: string | null;
}

function severityByDays(days: number) {
  if (days <= 7) return "CRITICA";
  if (days <= 15) return "ATENCAO";
  return "INFO";
}

export async function computeSstAlerts(client: DbClient) {
  const now = new Date();
  const windowEnd = new Date(now);
  windowEnd.setDate(now.getDate() + 30);
  const alerts: AlertInput[] = [];

  const trainingRecords = await client.trainingRecord.findMany({
    where: { validUntil: { lte: windowEnd } },
    include: { training: true, user: true }
  });

  trainingRecords.forEach((record) => {
    const diffDays = Math.ceil((record.validUntil.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (record.validUntil < now) {
      alerts.push({
        type: "TREINAMENTO_VENCIDO",
        severity: "CRITICA",
        title: `Treinamento vencido: ${record.training.name}`,
        message: `${record.user.name} com treinamento vencido`,
        dueDate: record.validUntil,
        entityType: "TrainingRecord",
        entityId: record.id
      });
      return;
    }
    alerts.push({
      type: "TREINAMENTO_VENCER",
      severity: severityByDays(diffDays),
      title: `Treinamento vence em ${diffDays}d`,
      message: `${record.training.name} - ${record.user.name}`,
      dueDate: record.validUntil,
      entityType: "TrainingRecord",
      entityId: record.id
    });
  });

  const templates = await client.checklistTemplate.findMany({
    include: {
      project: true,
      worksite: true,
      runs: { orderBy: { performedAt: "desc" }, take: 1 }
    }
  });

  templates.forEach((template) => {
    if (!template.periodicityDays) return;
    const lastRun = template.runs[0]?.performedAt ?? template.createdAt;
    const due = new Date(lastRun);
    due.setDate(due.getDate() + template.periodicityDays);
    if (due < now) {
      alerts.push({
        type: "INSPECAO_ATRASADA",
        severity: "ATENCAO",
        title: "Inspecao atrasada",
        message: `${template.title} (${template.worksite?.name ?? "Projeto"})`,
        dueDate: due,
        entityType: "ChecklistTemplate",
        entityId: template.id,
        projectId: template.projectId ?? null
      });
    }
  });

  const openNcs = await client.nonConformity.findMany({
    where: { status: { in: ["ABERTA", "EM_ANDAMENTO"] }, dueDate: { lte: windowEnd } },
    include: { project: true }
  });

  openNcs.forEach((nc) => {
    const diffDays = Math.ceil((nc.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (nc.dueDate < now) {
      alerts.push({
        type: "NC_VENCIDA",
        severity: "CRITICA",
        title: "NC vencida",
        message: `${nc.title ?? "Nao conformidade"} - ${nc.project?.name ?? "Projeto"}`,
        dueDate: nc.dueDate,
        entityType: "NonConformity",
        entityId: nc.id,
        projectId: nc.projectId ?? null
      });
      return;
    }
    alerts.push({
      type: "NC_VENCENDO",
      severity: severityByDays(diffDays),
      title: `NC vence em ${diffDays}d`,
      message: `${nc.title ?? "Nao conformidade"} - ${nc.project?.name ?? "Projeto"}`,
      dueDate: nc.dueDate,
      entityType: "NonConformity",
      entityId: nc.id,
      projectId: nc.projectId ?? null
    });
  });

  const permits = await client.permitToWork.findMany({
    where: { status: "APROVADA", validTo: { lte: windowEnd } },
    include: { project: true }
  });

  permits.forEach((permit) => {
    const diffDays = Math.ceil((permit.validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (permit.validTo < now) {
      alerts.push({
        type: "PT_VENCIDA",
        severity: "CRITICA",
        title: "PT vencida",
        message: `PT ${permit.type} - ${permit.project?.name ?? \"Projeto\"}`,
        dueDate: permit.validTo,
        entityType: "PermitToWork",
        entityId: permit.id,
        projectId: permit.projectId ?? null
      });
      return;
    }
    alerts.push({
      type: "PT_VENCER",
      severity: severityByDays(diffDays),
      title: `PT vence em ${diffDays}d`,
      message: `PT ${permit.type} - ${permit.project?.name ?? \"Projeto\"}`,
      dueDate: permit.validTo,
      entityType: "PermitToWork",
      entityId: permit.id,
      projectId: permit.projectId ?? null
    });
  });

  return alerts;
}

export async function syncSstAlerts(client: DbClient, alerts: AlertInput[]) {
  const synced = [];
  for (const alert of alerts) {
    if (!alert.entityId || !alert.entityType) {
      const created = await client.sstAlert.create({
        data: {
          projectId: alert.projectId ?? null,
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          message: alert.message,
          dueDate: alert.dueDate ?? null,
          entityType: alert.entityType ?? null,
          entityId: alert.entityId ?? null
        }
      });
      synced.push(created);
      continue;
    }

    const existing = await client.sstAlert.findFirst({
      where: { type: alert.type, entityType: alert.entityType, entityId: alert.entityId, status: "ABERTO" }
    });

    if (existing) {
      const updated = await client.sstAlert.update({
        where: { id: existing.id },
        data: {
          severity: alert.severity,
          title: alert.title,
          message: alert.message,
          dueDate: alert.dueDate ?? null,
          projectId: alert.projectId ?? null
        }
      });
      synced.push(updated);
    } else {
      const created = await client.sstAlert.create({
        data: {
          projectId: alert.projectId ?? null,
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          message: alert.message,
          dueDate: alert.dueDate ?? null,
          entityType: alert.entityType,
          entityId: alert.entityId
        }
      });
      synced.push(created);
    }
  }

  return synced;
}
