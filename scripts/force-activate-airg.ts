
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Forcing activation for AIR G ENERGIE...");

    const result = await prisma.expert.updateMany({
        where: {
            nom_entreprise: { contains: "AIR G", mode: 'insensitive' }
        },
        data: {
            status: 'active'
        }
    });

    console.log(`Updated ${result.count} profiles to 'active'.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
