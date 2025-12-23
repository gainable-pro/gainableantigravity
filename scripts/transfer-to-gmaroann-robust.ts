
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("Starting Article Transfer with Retries...");
    let retries = 5;

    while (retries > 0) {
        try {
            // 1. Find Target User (gmaroann@gmail.com)
            const targetEmail = "gmaroann@gmail.com";
            const targetUser = await prisma.user.findUnique({
                where: { email: targetEmail },
                include: { expert: true }
            });

            if (!targetUser || !targetUser.expert) {
                console.error(`ERROR: User or Expert profile not found for ${targetEmail}`);
                return;
            }

            const targetExpertId = targetUser.expert.id;
            console.log(`Found Target Expert: ${targetUser.expert.nom_entreprise} (${targetExpertId})`);

            // 2. Find Source Expert (Gainable Rédaction)
            const sourceExpert = await prisma.expert.findFirst({
                where: { nom_entreprise: "Gainable Rédaction" }
            });

            if (!sourceExpert) {
                console.error("Source expert 'Gainable Rédaction' not found.");
                return;
            }

            const sourceExpertId = sourceExpert.id;
            console.log(`Found Source Expert: ${sourceExpert.nom_entreprise} (${sourceExpertId})`);

            // 3. Transfer Articles
            const updateResult = await prisma.article.updateMany({
                where: { expertId: sourceExpertId },
                data: { expertId: targetExpertId }
            });

            console.log(`Successfully transferred ${updateResult.count} articles to ${targetEmail}.`);
            return; // Success

        } catch (e: any) {
            console.error(`Attempt failed. Retries left: ${retries}. Error: ${e.message}`);
            retries--;
            await wait(2000);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
