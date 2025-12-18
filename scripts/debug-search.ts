
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const experts = await prisma.expert.findMany({
        where: {
            nom_entreprise: { contains: "AIR G", mode: 'insensitive' }
        },
        select: {
            id: true,
            nom_entreprise: true,
            expert_type: true,
            status: true,
            ville: true,
            adresse: true // Added for debugging
        }
    });

    console.log("DB Experts Dump:", JSON.stringify(experts, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
