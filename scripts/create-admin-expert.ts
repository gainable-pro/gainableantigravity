
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'gmaroann@gmail.com'; // The admin user

    const user = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!user) {
        console.error(`User ${adminEmail} not found!`);
        return;
    }

    console.log(`Found Admin User: ${user.id}`);

    // Upsert 'Gainable.fr' expert profile
    const expert = await prisma.expert.upsert({
        where: { user_id: user.id },
        update: {
            nom_entreprise: 'Gainable.fr',
            slug: 'gainable-fr',
            expert_type: 'cvc_climatisation', // Default, doesn't matter much for admin
            status: 'active',
        },
        create: {
            user_id: user.id,
            nom_entreprise: 'Gainable.fr',
            representant_nom: 'Admin',
            representant_prenom: 'Gainable',
            description: 'Le spécialiste de la climatisation gainable et de la rénovation énergétique.',
            slug: 'gainable-fr',
            expert_type: 'cvc_climatisation',
            pays: 'FR',
            adresse: 'Siège Social',
            ville: 'Paris',
            code_postal: '75000',
            status: 'active',
            logo_url: 'https://gainable.ch/logo.png', // Placeholder, user can update via dashboard
        },
    });

    console.log('Gainable Admin Expert Profile upserted:', expert);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
