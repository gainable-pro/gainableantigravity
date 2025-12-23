
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const targetEmail = "gmaroann@gmail.com";
    const user = await prisma.user.findUnique({ where: { email: targetEmail }, include: { expert: true } });
    if (!user?.expert) { console.log("User not found"); return; }

    const count = await prisma.article.count({ where: { expertId: user.expert.id } });
    console.log(`Articles owned by ${targetEmail}: ${count}`);
}
main().finally(() => prisma.$disconnect());
