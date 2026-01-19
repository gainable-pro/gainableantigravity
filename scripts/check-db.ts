
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Attempting to connect to DB...");
        const count = await prisma.expert.count();
        console.log(`Connection successful. Found ${count} experts.`);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
