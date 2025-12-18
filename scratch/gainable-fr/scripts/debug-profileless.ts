
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = 'contact@airgenergie.fr';
    console.log(`🔍 1. Finding User by email: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error("❌ User not found!");
        return;
    }
    console.log(`✅ User found. ID: ${user.id}`);

    console.log(`🔍 2. Finding Expert by user_id: ${user.id}`);
    try {
        const expert = await prisma.expert.findUnique({
            where: { user_id: user.id },
            include: {
                technologies: true,
                interventions_clim: true,
                interventions_etude: true,
                interventions_diag: true,
                batiments: true,
                marques: true
            }
        });

        if (expert) {
            console.log("✅ Expert loaded successfully!");
            console.log("Expert Data:", JSON.stringify(expert, null, 2));
        } else {
            console.error("❌ Expert NOT found for this user ID.");
        }

    } catch (e) {
        console.error("❌ Crashed while fetching expert:");
        console.error(e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
