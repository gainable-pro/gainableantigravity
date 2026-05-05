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
        const queryMonth = url.searchParams.get("month");
        const queryYear = url.searchParams.get("year");

        const targetMonth = queryMonth !== null ? parseInt(queryMonth, 10) : now.getMonth();
        const targetYear = queryYear !== null ? parseInt(queryYear, 10) : now.getFullYear();

        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const startOfTargetMonth = new Date(targetYear, targetMonth, 1);
        const endOfTargetMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Fetch sales for today (VALIDATED ONLY)
        const dailySales = await prisma.commercialSale.findMany({
            where: {
                commercialId: targetCommercialId,
                status: "VALIDEE",
                dateVente: { gte: startOfDay }
            }
        });

        // Fetch sales for the selected month (VALIDATED ONLY)
        const monthlySales = await prisma.commercialSale.findMany({
            where: {
                commercialId: targetCommercialId,
                status: "VALIDEE",
                dateVente: { gte: startOfTargetMonth, lte: endOfTargetMonth }
            }
        });

        // Fetch sales for this year (VALIDATED ONLY)
        const yearlySales = await prisma.commercialSale.findMany({
            where: {
                commercialId: targetCommercialId,
                status: "VALIDEE",
                dateVente: { gte: startOfYear }
            }
        });

        // Fetch pending sales count (for UI notification)
        const pendingSalesCount = await prisma.commercialSale.count({
            where: {
                commercialId: targetCommercialId,
                status: "EN_ATTENTE"
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
        const historyDetails = [];

        for (const [day, count] of Object.entries(salesByDay)) {
            const rate = getCommissionRate(count);
            const dailyComm = count * BASE_AMOUNT * rate;
            totalMonthlyCommission += dailyComm;
            
            historyDetails.push({
                date: day,
                count: count,
                level: count >= 5 ? 5 : count,
                rate: rate * 100,
                ca: count * BASE_AMOUNT,
                commission: dailyComm
            });
        }
        
        // Sort history by date descending
        historyDetails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            yearlyCount: yearlySales.length,
            yearlyCA: yearlySales.length * BASE_AMOUNT,
            pendingProspects,
            pendingSalesCount,
            history: historyDetails
        });

    } catch (error) {
        console.error("Error calculating stats:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
