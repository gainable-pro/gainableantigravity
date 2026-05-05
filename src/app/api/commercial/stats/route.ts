import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";

function getCommissionRate(salesCount: number): number {
    if (salesCount >= 5) return 0.17;
    if (salesCount === 4) return 0.15;
    if (salesCount === 3) return 0.13;
    if (salesCount === 2) return 0.12;
    if (salesCount === 1) return 0.10;
    return 0;
}

export async function GET(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const url = new URL(req.url);
        const targetCommercialId = user.role === 'admin' ? (url.searchParams.get("commercialId") || user.id) : user.id;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Fetch sales for today
        const dailySales = await prisma.commercialSale.findMany({
            where: {
                commercialId: targetCommercialId,
                dateVente: { gte: startOfDay }
            }
        });

        // Fetch sales for this month
        const monthlySales = await prisma.commercialSale.findMany({
            where: {
                commercialId: targetCommercialId,
                dateVente: { gte: startOfMonth }
            }
        });

        // Calculate commissions
        const BASE_AMOUNT = 650; // Base d'abonnement 650 € HT

        // Group monthly sales by day to calculate commission properly
        const salesByDay: Record<string, number> = {};
        for (const sale of monthlySales) {
            const dayKey = sale.dateVente.toISOString().split('T')[0];
            salesByDay[dayKey] = (salesByDay[dayKey] || 0) + 1;
        }

        let totalMonthlyCommission = 0;
        for (const [day, count] of Object.entries(salesByDay)) {
            const rate = getCommissionRate(count);
            totalMonthlyCommission += count * BASE_AMOUNT * rate;
        }

        const dailyCount = dailySales.length;
        const dailyRate = getCommissionRate(dailyCount);
        const dailyCommission = dailyCount * BASE_AMOUNT * dailyRate;

        // Count pending prospects
        const pendingProspects = await prisma.commercialProspect.count({
            where: {
                commercialId: targetCommercialId,
                status: { notIn: ["VENTE_EFFECTUEE", "REFUSE", "NE_PLUS_DEMARCHER"] }
            }
        });

        return NextResponse.json({
            dailyCount,
            dailyCA: dailyCount * BASE_AMOUNT,
            dailyCommission,
            monthlyCount: monthlySales.length,
            monthlyCA: monthlySales.length * BASE_AMOUNT,
            monthlyCommission: totalMonthlyCommission,
            pendingProspects
        });

    } catch (error) {
        console.error("Error calculating stats:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
