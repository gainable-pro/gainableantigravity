
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Updating profiles...');

    // 1. Update SMB13
    // Find SMB13 first (by name or mostly matching name)
    const smb13 = await prisma.expert.findFirst({
        where: { nom_entreprise: { contains: 'SMB 13', mode: 'insensitive' } },
    });

    if (smb13) {
        console.log(`Found SMB13: ${smb13.id}`);

        // Update Logo
        await prisma.expert.update({
            where: { id: smb13.id },
            data: { logo_url: '/assets/logos/smb13.png' },
        });
        console.log('Updated SMB13 Logo');

        // Update Brands (Mitsubishi, Daikin, Atlantic)
        // First delete existing brands to avoid duplicates/confusion
        await prisma.expertMarque.deleteMany({
            where: { expert_id: smb13.id },
        });

        const brands = ['Mitsubishi', 'Daikin', 'Atlantic'];
        for (const brand of brands) {
            await prisma.expertMarque.create({
                data: {
                    expert_id: smb13.id,
                    value: brand, // 'value' is the field name for the brand string
                },
            });
        }
        console.log(`Updated SMB13 Brands to: ${brands.join(', ')}`);
    } else {
        console.error('SMB13 NOT FOUND');
    }

    // 2. Update FEXIM 13
    const fexim = await prisma.expert.findFirst({
        where: { nom_entreprise: { contains: 'FEXIM', mode: 'insensitive' } },
    });

    if (fexim) {
        console.log(`Found FEXIM: ${fexim.id}`);
        await prisma.expert.update({
            where: { id: fexim.id },
            data: { logo_url: '/assets/logos/fexim13.png' },
        });
        console.log('Updated FEXIM 13 Logo');
    } else {
        console.error('FEXIM 13 NOT FOUND');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
