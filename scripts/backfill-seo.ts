
import { PrismaClient } from '@prisma/client';
import { generateExpertMetaTitle, generateExpertMetaDescription } from '../src/lib/seo-templates';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting SEO backfill...');

    const experts = await prisma.expert.findMany({
        where: {
            OR: [
                { metaTitle: null },
                { metaTitle: '' },
                { metaDesc: null },
                { metaDesc: '' },
            ]
        }
    });

    console.log(`Found ${experts.length} experts to update.`);

    for (const expert of experts) {
        const seoData = {
            nomEntreprise: expert.nom_entreprise,
            ville: expert.ville,
            codePostal: expert.code_postal,
            description: expert.description
        };

        const metaTitle = generateExpertMetaTitle(seoData);
        const metaDesc = generateExpertMetaDescription(seoData);

        await prisma.expert.update({
            where: { id: expert.id },
            data: {
                metaTitle: expert.metaTitle || metaTitle, // Only update if missing
                metaDesc: expert.metaDesc || metaDesc // Only update if missing
            }
        });

        console.log(`Updated expert: ${expert.nom_entreprise}`);
    }

    console.log('SEO backfill complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
