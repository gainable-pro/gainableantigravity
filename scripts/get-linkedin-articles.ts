import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        where: { targetCity: null, slug: { not: { startsWith: 'b2b-conseil-' } } }
    });
    
    let out = `Found: ${articles.length}\n`;
    articles.forEach(a => {
        out += `${a.title} -> ${a.slug} (ExpertID: ${a.expertId})\n`;
    });
    
    fs.writeFileSync('debug-articles.txt', out);
    console.log(`Saved debug output.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
