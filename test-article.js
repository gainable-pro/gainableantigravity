require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    const expert = await prisma.expert.findUnique({where:{slug:'redaction-gainable'}});
    console.log('Expert:', !!expert);
    if (!expert) return;
    const article = await prisma.article.findUnique({where:{expertId_slug:{expertId:expert.id, slug:'gainable-a-eau-glacee-saint-galmier'}}});
    console.log('Article:', !!article);
    if(article) {
        console.log('Status:', article.status);
        console.log('updatedAt:', article.updatedAt);
        console.log('content snippet:', article.content?.substring(0, 50));
        console.log('jsonContent:', typeof article.jsonContent);
    }
}
run().catch(console.error).finally(() => prisma.$disconnect());
