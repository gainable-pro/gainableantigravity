
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// This script expects DATABASE_URL to be set in the environment
const prisma = new PrismaClient();

async function main() {
    const email = "contact@airgenergie.fr";
    const password = "Gainable2025!";

    console.log(`🔌 Connecting to database...`);
    console.log(`🎯 Target Email: ${email}`);

    // 1. Hash password
    const passwordHash = await hash(password, 12);

    // 2. Upsert User
    console.log(`👤 Upserting user...`);
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password_hash: passwordHash,
            role: 'EXPERT',
        },
        create: {
            email,
            password_hash: passwordHash,
            role: 'EXPERT',
        },
    });

    console.log(`✅ User ensured with ID: ${user.id}`);

    // 3. Upsert Expert Profile (Link to user)
    console.log(`🛠 Upserting Expert Profile...`);

    // FIXED: used user_id instead of userId
    const existingExpert = await prisma.expert.findFirst({
        where: { user_id: user.id }
    });

    if (existingExpert) {
        await prisma.expert.update({
            where: { id: existingExpert.id },
            data: {
                status: 'active',
                nom_entreprise: 'Air G Energie (Updated)',
            }
        });
        console.log(`✅ Existing Expert Profile updated.`);
    } else {
        await prisma.expert.create({
            data: {
                user_id: user.id, // FIXED
                nom_entreprise: 'Air G Energie',
                representant_nom: 'Ghari',
                representant_prenom: 'Rabah',

                telephone: '0600000000',
                adresse: '13140 MIRAMAS',
                ville: 'MIRAMAS',
                code_postal: '13140',
                pays: 'France',
                expert_type: 'cvc_climatisation',
                slug: 'air-g-energie',
                status: 'active',
                description: 'Expert en climatisation gainable.',
                siret: '90926625600010',
            }
        });
        console.log(`✅ New Expert Profile created.`);
    }

    console.log(`\n🎉 SUCCÈS !`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
}

main()
    .catch(e => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
