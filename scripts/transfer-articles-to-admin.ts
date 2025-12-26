// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const targetEmail = "gmaroann@gmail.com";
    console.log(`Transferring articles to ${targetEmail}...`);

    // 1. Find User
    const user = await prisma.user.findUnique({ where: { email: targetEmail } });
    if (!user) {
        console.error(`ERROR: User ${targetEmail} not found! Please create the account first.`);
        return;
    }

    // 2. Find or Create Expert Profile for this User
    let expert = await prisma.expert.findUnique({ where: { user_id: user.id } });

    if (!expert) {
        console.log("No expert profile found for this user. Creating 'Admin Gainable' profile...");
        expert = await prisma.expert.create({
            data: {
                user_id: user.id,
                expert_type: 'bureau_detude',
                nom_entreprise: "Admin Gainable",
                representant_nom: "Maroann",
                representant_prenom: "G",
                description: "Administrateur de la plateforme Gainable.fr",
                pays: "France",
                adresse: "Siège",
                ville: "Paris",
                code_postal: "75000",
                slug: "admin-gainable-fr", // ensuring uniqueness might need care if exists, but slug logic usually unique
                status: "active"
            }
        });
    }

    console.log(`Target Expert ID: ${expert.id} (${expert.nom_entreprise})`);

    // 3. Update Articles
    // Targeting the SEO templates we just generated
    const prefixes = [
        "Prix d’une climatisation gainable à",
        "Climatisation gainable en appartement à",
        "Entretien d’une climatisation gainable à"
    ];

    const { count } = await prisma.article.updateMany({
        where: {
            OR: prefixes.map(p => ({ title: { startsWith: p } }))
        },
        data: {
            expertId: expert.id
        }
    });

    console.log(`SUCCESS: Transferred ${count} articles to ${targetEmail}.`);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
