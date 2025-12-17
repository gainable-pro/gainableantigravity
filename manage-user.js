
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'contact@airgenergie.fr';
    const newPassword = 'Gainable2025!';
    const hashedPassword = await hash(newPassword, 12);

    console.log(`Checking for user: ${email}...`);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log('User found. Resetting password...');
        await prisma.user.update({
            where: { email },
            data: { password_hash: hashedPassword },
        });
        console.log('Password reset successfully.');
    } else {
        console.log('User not found. Creating new user and expert profile...');
        await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                role: 'EXPERT',
                expert: {
                    create: {
                        nom_entreprise: 'Air G Energie',
                        representant_nom: 'Ghari',
                        representant_prenom: 'Admin',
                        pays: 'France',
                        adresse: '13140 MIRAMAS',
                        ville: 'MIRAMAS',
                        code_postal: '13140',
                        expert_type: 'cvc_climatisation', // using the enum value string if mapped, or direct literal
                        description: 'Compte généré automatiquement.',
                        siret: '90926625600010',
                        site_web: 'https://airgenergie.fr',
                        slug: 'air-g-energie-miramas',
                        status: 'active'
                    }
                }
            }
        });
        console.log('User created successfully.');
    }
}

main()
    .catch((e) => {
        console.error("FULL ERROR DETAILS:");
        console.error(JSON.stringify(e, null, 2));
        console.error(e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
