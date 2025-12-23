
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- DEBUG OWNERSHIP ---");

    // 1. Find User
    const email = "gmaroann@gmail.com";
    const user = await prisma.user.findUnique({
        where: { email },
        include: { expert: true }
    });

    if (user) {
        console.log(`User [${email}] found. ID: ${user.id}`);
        console.log(`Linked Expert: ${user.expert ? `${user.expert.nom_entreprise} (${user.expert.id})` : "NONE"}`);
    } else {
        console.log(`User [${email}] NOT FOUND.`);
    }

    // 2. Find Gainable Rédaction
    const admin = await prisma.expert.findFirst({ where: { nom_entreprise: "Gainable Rédaction" } });
    if (admin) {
        console.log(`Expert [Gainable Rédaction] found. ID: ${admin.id}`);
    } else {
        console.log(`Expert [Gainable Rédaction] NOT FOUND.`);
    }

    // 3. Count Articles by Expert
    console.log("\n--- ARTICLE COUNTS ---");
    const grouped = await prisma.article.groupBy({
        by: ['expertId'],
        _count: { id: true }
    });

    for (const group of grouped) {
        // Fetch expert name for context if possible (optional, but helpful)
        // We'll just print ID for now to be safe on connections
        let name = "Unknown";
        if (user?.expert?.id === group.expertId) name = "USER (gmaroann)";
        if (admin?.id === group.expertId) name = "ADMIN (Gainable Rédaction)";

        console.log(`ExpertID: ${group.expertId} | Count: ${group._count.id} | Name: ${name}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
