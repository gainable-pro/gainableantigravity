import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function main() {
    const article = await prisma.article.findFirst({
        where: { slug: 'fin-age-or-achat-leads-esclavage-systeme' }
    });
    fs.writeFileSync('debug-article.txt', JSON.stringify({
        content: article?.content,
        jsonContent: article?.jsonContent
    }, null, 2));
}

main().finally(() => prisma.$disconnect());
