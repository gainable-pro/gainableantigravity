// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing Author...");

    // 1. Create Dedicated Admin User for Redaction
    const email = "redaction-officielle@gainable.fr";
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                password_hash: "dummy",
                role: "ADMIN"
            }
        });
        console.log("Created User: " + user.email);
    }

    // 2. Create Expert Profile
    let expert = await prisma.expert.findFirst({ where: { nom_entreprise: "Rédaction Gainable.fr" } });
    if (!expert) {
        expert = await prisma.expert.create({
            data: {
                user_id: user.id,
                expert_type: 'bureau_detude',
                nom_entreprise: "Rédaction Gainable.fr",
                representant_nom: "Equipe",
                representant_prenom: "Rédaction",
                description: "Compte officiel pour les contenus éditoriaux.",
                pays: "France",
                adresse: "Siège",
                ville: "Paris",
                code_postal: "75000",
                slug: "redaction-gainable",
                status: "active"
            }
        });
        console.log("Created Expert: " + expert.nom_entreprise);
    } else {
        console.log("Found Expert: " + expert.nom_entreprise);
    }

    // 3. Move Articles
    // We want to move articles that look like our generated ones (or all of them if simpler, assuming only SEO articles exist)
    // We can filter by the title prefixes we used.
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

    console.log(`Updated ${count} articles to 'Rédaction Gainable.fr'.`);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
