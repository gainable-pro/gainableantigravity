import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Article Cleanup...");

    // Expert setup
    const expert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Rédaction Gainable.fr" }
    });

    if (!expert) {
        throw new Error("Expert 'Rédaction Gainable.fr' not found.");
    }

    // Delete articles created TODAY by this expert
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await prisma.article.deleteMany({
        where: {
            expertId: expert.id,
            createdAt: {
                gte: today
            }
        }
    });

    console.log(`Deleted ${result.count} articles created today.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
