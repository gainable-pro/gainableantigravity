
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // 1. Search for user 'gmaroann'
    const users = await prisma.user.findMany({
        where: { email: { contains: 'maroann' } }
    });
    console.log("Users found matching 'maroann':", users);

    // 2. Check "Gainable Rédaction" details
    const redactionExpert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Gainable Rédaction" },
        include: { user: true }
    });
    console.log("Gainable Rédaction linked to user:", redactionExpert?.user?.email);

    // 3. Check Article Linkage Count
    const countRedaction = await prisma.article.count({
        where: { expertId: redactionExpert?.id }
    });
    console.log(`Articles linked to Gainable Rédaction: ${countRedaction}`);
}

main().finally(() => prisma.$disconnect());
