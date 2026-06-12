const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const article = await prisma.article.findFirst({
    where: { slug: "climatisation-a-aix-en-provence-pourquoi-opter-pour-une-installation-gainable-avec-smb-13-aix-en-provence" }
  });
  console.log(JSON.stringify(article, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
