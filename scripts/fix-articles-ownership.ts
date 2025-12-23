
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- FIX OWNERSHIP START ---");

    // 1. Find Target User
    const email = "gmaroann@gmail.com";
    const user = await prisma.user.findUnique({
        where: { email },
        include: { expert: true }
    });

    if (!user) {
        console.error(`CRITICAL: User ${email} does not exist via Prisma search.`);
        // Fallback: try to create if really needed, but risky without password.
        return;
    }

    let targetExpertId = user.expert?.id;
    console.log(`User Found. ExpertID: ${targetExpertId || "NULL"}`);

    if (!targetExpertId) {
        console.log("User has no Expert profile. Creating one...");
        const newExpert = await prisma.expert.create({
            data: {
                user_id: user.id,
                nom_entreprise: "Gmaroann Expert",
                representant_nom: "Maroann",
                representant_prenom: "G",
                description: "Expert CVC",
                adresse: "1 rue de la Paix",
                ville: "Paris",
                code_postal: "75000",
                pays: "FR",
                slug: "gmaroann-expert",
                telephone: "0600000000",
                expert_type: "cvc_climatisation"
            }
        });
        targetExpertId = newExpert.id;
        console.log(`Created Expert profile: ${targetExpertId}`);
    }

    // 2. Find Source Articles (Gainable Rédaction OR just all orphan articles?)
    // We specifically want to move articles from "Gainable Rédaction".
    const sourceExpert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Gainable Rédaction" }
    });

    if (!sourceExpert) {
        console.error("Gainable Rédaction not found (unexpected).");
    } else {
        console.log(`Source Expert (Redaction): ${sourceExpert.id}`);

        // 3. Move Articles
        const result = await prisma.article.updateMany({
            where: { expertId: sourceExpert.id },
            data: { expertId: targetExpertId }
        });
        console.log(`MOVED ${result.count} articles from Redaction to ${email}.`);
    }
}

main()
    .catch(e => console.error("SCRIPT ERROR:", e))
    .finally(async () => {
        await prisma.$disconnect();
        console.log("--- FIX OWNERSHIP END ---");
    });
