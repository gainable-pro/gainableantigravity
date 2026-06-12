const path = require("path");
const fs = require("fs");

if (fs.existsSync(path.join(__dirname, "../.env.local"))) {
    require("dotenv").config({ path: path.join(__dirname, "../.env.local") });
} else if (fs.existsSync(path.join(__dirname, "../.env"))) {
    require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const commercials = await prisma.user.findMany({
        where: { role: 'commercial' }
    });
    console.log("All Commercials in DB:", commercials);

    const sales = await prisma.commercialSale.findMany({
        include: {
            commercial: { select: { email: true } }
        }
    });
    console.log("All Sales in DB:", sales);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
