
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.expert.update({
        where: { slug: 'gainable-fr' },
        data: { logo_url: '/logo.png' },
    });
    console.log('Logo updated for gainable-fr');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
