import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { computeSstAlerts, syncSstAlerts } from "@/lib/services/sstAlerts";

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const now = new Date();
    const startWindow = new Date(now);
    startWindow.setDate(now.getDate() - 13);

    const [
      trainingsTotal,
      inspectionsTotal,
      ncsTotal,
      incidentsTotal,
      inspectionsRecent,
      incidentsRecent,
      ncsRecent,
      inspectionsTimeline,
      incidentsTimeline
    ] = await Promise.all([
      prisma.training.count(),
      prisma.inspectionRun.count(),
      prisma.nonConformity.count(),
      prisma.incident.count(),
      prisma.inspectionRun.findMany({
        where: { performedAt: { gte: startWindow } },
        select: { performedAt: true }
      }),
      prisma.incident.findMany({
        where: { date: { gte: startWindow } },
        select: { date: true, severity: true }
      }),
      prisma.nonConformity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { project: true }
      }),
      prisma.inspectionRun.findMany({
        take: 5,
        orderBy: { performedAt: "desc" },
        include: { template: true, project: true }
      }),
      prisma.incident.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: { project: true }
      })
    ]);

    const alerts = await computeSstAlerts(prisma);
    const syncedAlerts = await syncSstAlerts(prisma, alerts);

    const inspectionsSeriesMap = new Map<string, number>();
    inspectionsRecent.forEach((item) => {
      const key = formatDateKey(item.performedAt);
      inspectionsSeriesMap.set(key, (inspectionsSeriesMap.get(key) || 0) + 1);
    });

    const incidentSeriesMap = new Map<string, number>();
    incidentsRecent.forEach((item) => {
      const key = formatDateKey(item.date);
      incidentSeriesMap.set(key, (incidentSeriesMap.get(key) || 0) + 1);
    });

    const inspectionsSeries = Array.from(inspectionsSeriesMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => ({ date, total }));

    const incidentsSeries = Array.from(incidentSeriesMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, total]) => ({ date, total }));

    const severityMap = new Map<string, number>();
    incidentsRecent.forEach((item) => {
      severityMap.set(item.severity, (severityMap.get(item.severity) || 0) + 1);
    });

    const incidentsBySeverity = Array.from(severityMap.entries()).map(([severity, total]) => ({
      severity,
      total
    }));

    const timeline = [
      ...ncsRecent.map((nc) => ({
        id: nc.id,
        type: "NC",
        title: nc.title ?? "Nao conformidade",
        project: nc.project?.name ?? "-",
        date: nc.createdAt
      })),
      ...inspectionsTimeline.map((inspection) => ({
        id: inspection.id,
        type: "INSPECAO",
        title: inspection.template?.title ?? "Inspecao",
        project: inspection.project?.name ?? "-",
        date: inspection.performedAt
      })),
      ...incidentsTimeline.map((incident) => ({
        id: incident.id,
        type: "INCIDENTE",
        title: incident.category,
        project: incident.project?.name ?? "-",
        date: incident.date
      }))
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    return jsonOk({
      totals: {
        trainings: trainingsTotal,
        inspections: inspectionsTotal,
        ncs: ncsTotal,
        incidents: incidentsTotal
      },
      alerts: syncedAlerts,
      charts: {
        inspectionsSeries,
        incidentsSeries,
        incidentsBySeverity
      },
      timeline
    });
  } catch (error) {
    return handleApiError(error);
  }
}
