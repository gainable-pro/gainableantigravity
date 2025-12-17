
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkExpert() {
    try {
        const experts = await prisma.expert.findMany({
            where: {
                nom_entreprise: {
                    contains: "Air G",
                    mode: 'insensitive' // if postgres, usually default for some configurations, but good to be safe or just use standard
                }
            }
        });
        console.log("Found experts:", experts);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkExpert();
