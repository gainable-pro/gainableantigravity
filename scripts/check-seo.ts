import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        where: { slug: { startsWith: 'b2b-' } },
        take: 5
    });

    let output = '';
    for (const a of articles) {
        output += `Title: ${a.title}\n`;
        output += `Meta : ${a.metaDesc}\n`;
        output += `Alt  : ${a.altText}\n\n`;
    }
    
    fs.writeFileSync('debug-seo.txt', output);
    console.log("SEO debug exported.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
