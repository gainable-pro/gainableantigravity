import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const articles = await prisma.article.findMany({
        where: { slug: { startsWith: 'b2b-conseil-' } }
    });
    
    let out = "Voici les liens pour les 25 articles (Campagne Email) :\n\n";
    articles.forEach(a => {
        out += `https://gainable.fr/entreprise/redaction-gainable/articles/${a.slug}\n`;
    });
    
    fs.writeFileSync('b2b-urls.txt', out);
    console.log(`Saved urls to b2b-urls.txt`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
