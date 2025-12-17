const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Attempting to connect with URL:", process.env.DATABASE_URL);
    try {
        await prisma.$connect();
        console.log("SUCCESS: Connected to database!");
        const userCount = await prisma.user.count();
        console.log("User count:", userCount);
    } catch (e) {
        console.error("FAILURE: Connection breakdown:");
        console.error(e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
