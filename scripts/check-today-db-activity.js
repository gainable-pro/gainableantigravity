const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const envFiles = ['.env.development.local', '.env.local', '.env.development', '.env'];
envFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        dotenv.config({ path: filePath });
    }
});

const prisma = new PrismaClient();

async function main() {
    console.log("Checking DB activity for today (September 17, 2026)...");

    const todayStart = new Date('2026-09-17T00:00:00.000Z');

    try {
        const users = await prisma.user.findMany({
            where: {
                created_at: { gte: todayStart }
            }
        });
        console.log(`New users registered today: ${users.length}`);

        const leads = await prisma.lead.findMany({
            where: {
                createdAt: { gte: todayStart }
            }
        });
        console.log(`New leads generated today: ${leads.length}`);

        const prospects = await prisma.commercialProspect.findMany({
            where: {
                updatedAt: { gte: todayStart }
            }
        });
        console.log(`Prospects updated today: ${prospects.length}`);

        const experts = await prisma.expert.findMany({
            where: {
                created_at: { gte: todayStart }
            }
        });
        console.log(`New experts registered today: ${experts.length}`);

    } catch (err) {
        console.error("DB Query error:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
