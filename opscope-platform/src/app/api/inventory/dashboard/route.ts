import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonOk } from "@/lib/api";
import { requireAuth } from "@/lib/auth";

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  try {
    requireAuth(req);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startConsumption = new Date(now);
    startConsumption.setDate(now.getDate() - 13);
    const expiringWindow = new Date(now);
    expiringWindow.setDate(now.getDate() + 30);

    const [itemsTotal, balances, reservationsCount, movementsToday, recentMovements, expiringBatches] =
      await Promise.all([
        prisma.inventoryItem.count({ where: { deletedAt: null } }),
        prisma.stockBalance.findMany({
          include: { item: true, project: true, worksite: true }
        }),
        prisma.reservation.count({
          where: { status: { in: ["RESERVADO", "SEPARADO"] } }
        }),
        prisma.movement.count({ where: { createdAt: { gte: startOfDay } } }),
        prisma.movement.findMany({
          where: {
            createdAt: { gte: startConsumption },
            type: { in: ["ENTREGA", "BAIXA"] }
          },
          include: { item: true }
        }),
        prisma.inventoryBatch.findMany({
          where: {
            item: { type: "EPI" },
            OR: [
              { itemValidUntil: { lte: expiringWindow } },
              { caValidUntil: { lte: expiringWindow } }
            ]
          },
          include: { item: true, project: true },
          take: 12,
          orderBy: { createdAt: "desc" }
        })
      ]);

    const lowStock = balances.filter((balance) => {
      const total = balance.qtyAvailable + balance.qtyReserved;
      return total <= Math.max(balance.minQuantity, balance.reorderPoint);
    });

    const lowStockAlerts = lowStock.slice(0, 6).map((balance) => ({
      id: balance.id,
      itemId: balance.itemId,
      projectId: balance.projectId,
      item: balance.item.name,
      project: balance.project.name,
      total: balance.qtyAvailable + balance.qtyReserved,
      min: balance.minQuantity,
      reorderPoint: balance.reorderPoint
    }));

    const expiringAlerts = expiringBatches.slice(0, 6).map((batch) => ({
      id: batch.id,
      item: batch.item.name,
      project: batch.project.name,
      itemValidUntil: batch.itemValidUntil,
      caValidUntil: batch.caValidUntil
    }));

    const consumptionByDay = new Map<string, number>();
    recentMovements.forEach((movement) => {
      const key = formatDateKey(movement.createdAt);
      consumptionByDay.set(key, (consumptionByDay.get(key) || 0) + movement.qty);
    });

    const consumptionSeries = Array.from(consumptionByDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, qty]) => ({ date, qty }));

    const topItemsMap = new Map<string, { name: string; qty: number }>();
    recentMovements.forEach((movement) => {
      const current = topItemsMap.get(movement.itemId) || { name: movement.item.name, qty: 0 };
      current.qty += movement.qty;
      topItemsMap.set(movement.itemId, current);
    });

    const topOutItems = Array.from(topItemsMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);

    const lossesMap = new Map<string, { name: string; qty: number }>();
    recentMovements
      .filter((movement) => movement.type === "BAIXA")
      .forEach((movement) => {
        const current = lossesMap.get(movement.itemId) || { name: movement.item.name, qty: 0 };
        current.qty += movement.qty;
        lossesMap.set(movement.itemId, current);
      });

    const lossItems = Array.from(lossesMap.values());

    return jsonOk({
      totals: {
        items: itemsTotal,
        lowStock: lowStock.length,
        expiringEpi: expiringBatches.length,
        movementsToday,
        activeReservations: reservationsCount
      },
      alerts: {
        lowStock: lowStockAlerts,
        expiring: expiringAlerts
      },
      charts: {
        consumptionByDay: consumptionSeries,
        topOutItems,
        losses: lossItems
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
