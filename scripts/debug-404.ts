import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    let log = "";
    const addLog = (msg: string) => { log += msg + "\n"; console.log(msg); };

    try {
        const expert = await prisma.expert.findFirst({
            where: { slug: 'redaction-gainable-fr' }
        });
        addLog(`Expert: ${expert?.slug} | ID: ${expert?.id}`);

        const article = await prisma.article.findFirst({
            where: { slug: { startsWith: 'b2b-conseil-' } }
        });
        addLog(`Article: ${article?.slug}`);
        addLog(`Article Status: ${article?.status}`);
        addLog(`Article Expert ID: ${article?.expertId}`);
        addLog(`Matches Expert ? ${article?.expertId === expert?.id}`);
        addLog(`Article title : ${article?.title}`);
        
        if (expert && article) {
            const fetched = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug: article.slug } }
            });
            addLog(`findUnique by expertId_slug works (frontend check) ? ${fetched !== null}`);
        }
    } catch (e: any) {
        addLog(`Error: ${e.message}`);
    }

    fs.writeFileSync('debug-out.txt', log, 'utf-8');
}

main().finally(() => prisma.$disconnect());
