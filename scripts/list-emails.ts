import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        where: { slug: { startsWith: 'b2b-conseil-' } },
        select: { slug: true }
    });
    
    const urls = articles.map(a => `https://gainable.fr/entreprise/redaction-gainable-fr/articles/${a.slug}`);
    fs.writeFileSync('b2b-urls.txt', urls.join('\n'));
    console.log(`Wrote ${urls.length} URLs to b2b-urls.txt`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
