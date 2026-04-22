import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const expert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Rédaction Gainable.fr" }
    });
    const log = `Real Expert Slug: ${expert?.slug}`;
    console.log(log);
    fs.writeFileSync('debug-slug.txt', log);
}

main().finally(() => prisma.$disconnect());
