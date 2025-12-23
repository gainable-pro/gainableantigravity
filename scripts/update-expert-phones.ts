
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Updating phone numbers...");

    // Update AIR G ENERGIE
    const ex1 = await prisma.expert.updateMany({
        where: { nom_entreprise: 'AIR G ENERGIE' },
        data: { telephone: '06 12 34 56 78' }
    });
    console.log(`Updated AIR G ENERGIE: ${ex1.count}`);

    // Update SMB 13
    const ex2 = await prisma.expert.updateMany({
        where: { nom_entreprise: 'SMB 13' },
        data: { telephone: '07 98 76 54 32' }
    });
    console.log(`Updated SMB 13: ${ex2.count}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
