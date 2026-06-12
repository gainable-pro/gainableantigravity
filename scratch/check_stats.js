const path = require("path");
const fs = require("fs");

if (fs.existsSync(path.join(__dirname, "../.env.local"))) {
    require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
} else if (fs.existsSync(path.join(__dirname, "../.env"))) {
    require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function getCommissionRate(salesCount) {
    if (salesCount >= 5) return 0.17;
    if (salesCount === 4) return 0.15;
    if (salesCount === 3) return 0.13;
    if (salesCount === 2) return 0.12;
    if (salesCount === 1) return 0.10;
    return 0;
}

async function main() {
    const targetCommercialId = '4bac8e8b-bcb5-4324-99b5-bf22bf31eacf'; // top.informatique13@gmail.com
    
    const targetCommercial = await prisma.user.findUnique({
        where: { id: targetCommercialId },
        select: { email: true }
    });
    
    console.log("Target Commercial:", targetCommercial);
    const isCustom17 = targetCommercial?.email === "top.informatique13@gmail.com";
    console.log("isCustom17:", isCustom17);

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTargetMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfTargetMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const dailySales = await prisma.commercialSale.findMany({
        where: {
            commercialId: targetCommercialId,
            status: "VALIDEE",
            dateVente: { gte: startOfDay }
        }
    });
    console.log("dailySales count:", dailySales.length);

    const monthlySales = await prisma.commercialSale.findMany({
        where: {
            commercialId: targetCommercialId,
            status: "VALIDEE",
            dateVente: { gte: startOfTargetMonth, lte: endOfTargetMonth }
        }
    });
    console.log("monthlySales count:", monthlySales.length);

    const BASE_AMOUNT = 650;
    const salesByDay = {};
    for (const sale of monthlySales) {
        const dayKey = sale.dateVente.toISOString().split('T')[0];
        salesByDay[dayKey] = (salesByDay[dayKey] || 0) + 1;
    }
    console.log("salesByDay:", salesByDay);

    let totalMonthlyCommission = 0;
    const historyDetails = [];

    for (const [day, count] of Object.entries(salesByDay)) {
        const rate = isCustom17 ? 0.17 : getCommissionRate(count);
        const dailyComm = count * BASE_AMOUNT * rate;
        totalMonthlyCommission += dailyComm;
        
        historyDetails.push({
            date: day,
            count: count,
            level: isCustom17 ? 5 : (count >= 5 ? 5 : count),
            rate: rate * 100,
            ca: count * BASE_AMOUNT,
            commission: dailyComm
        });
    }

    const dailyCount = dailySales.length;
    const dailyRate = isCustom17 ? 0.17 : getCommissionRate(dailyCount);
    const dailyCommission = dailyCount * BASE_AMOUNT * dailyRate;

    console.log("dailyCommission:", dailyCommission);
    console.log("totalMonthlyCommission:", totalMonthlyCommission);
    console.log("historyDetails:", historyDetails);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
