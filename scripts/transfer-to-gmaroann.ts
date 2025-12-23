
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Article Transfer...");

    // 1. Find Target User (gmaroann@gmail.com)
    const targetEmail = "gmaroann@gmail.com";
    const targetUser = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { expert: true }
    });

    if (!targetUser || !targetUser.expert) {
        console.error(`ERROR: User or Expert profile not found for ${targetEmail}`);
        // Attempt to find user broadly if strict match fails? No, screenshot showed exact email.
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

    // 4. Verify
    const count = await prisma.article.count({ where: { expertId: targetExpertId } });
    console.log(`Total articles now owned by ${targetEmail}: ${count}`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
