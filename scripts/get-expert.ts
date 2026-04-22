import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const article = await prisma.article.findFirst({
        where: { slug: 'fin-age-or-achat-leads-esclavage-systeme' },
        include: { expert: true }
    });
    
    fs.writeFileSync('debug-expert.txt', article?.expert?.slug || 'NO_EXPERT');
    console.log("Done");
}

main().catch(console.error).finally(() => prisma.$disconnect());
