
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGES = [
    "/assets/images/hvac_modern_living_1766450690116.png",
    "/assets/images/hvac_office_space_1766450703836.png",
    "/assets/images/hvac_installation_tech_1766450716735.png",
    "/assets/images/hvac_thermostat_control_1766450728060.png"
];

async function main() {
    console.log("Starting update of articles...");

    // 1. Find or Create Admin Expert
    // We need a User to attach the expert to. Let's find the first user (usually admin).
    const adminUser = await prisma.user.findFirst();
    if (!adminUser) {
        console.error("No user found locally.");
        return;
    }

    let adminExpert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Gainable Rédaction" }
    });

    if (!adminExpert) {
        console.log("Creating 'Gainable Rédaction' expert profile...");
        // Check if user already has an expert? Only one expert per user usually?
        // If the admin user already has an expert (e.g. "Air G Energie"), we can't easily create a second one 
        // IF the schema enforces 1:1. 
        // Let's check schema for User-Expert relation.
        // Usually it is 1:1. 
        // If so, we might have to hijack the existing expert OR create a NEW USER "admin@gainable.fr" for this purpose.

        // Strategy: Create a specific user for the blog if needed, but for now, let's try to create a standalone expert 
        // if the relation allows (expert.user_id unique?).
        // If I can't check unique constraint now, I'll try to create a new user "redaction@gainable.fr".

        const blogUser = await prisma.user.upsert({
            where: { email: "redaction@gainable.fr" },
            update: {},
            create: {
                email: "redaction@gainable.fr",
                password_hash: "$2b$10$EpI...", // Placeholder hash
                role: "expert"
            }
        });

        adminExpert = await prisma.expert.create({
            data: {
                user_id: blogUser.id,
                nom_entreprise: "Gainable Rédaction",
                representant_nom: "Equipe",
                representant_prenom: "Redaction",
                description: "L'équipe éditoriale de Gainable.fr",
                adresse: "1 Avenue des Champs-Élysées",
                ville: "Paris",
                code_postal: "75000",
                pays: "FR",
                slug: "gainable-redaction",
                telephone: "0100000000",
                expert_type: "cvc_climatisation", // Valid enum value
            }
        });
    }

    console.log(`Using Expert: ${adminExpert.nom_entreprise} (${adminExpert.id})`);

    // 2. Fetch all articles
    const articles = await prisma.article.findMany();
    console.log(`Found ${articles.length} articles to update.`);

    // 3. Update them
    let updatedCount = 0;
    for (const article of articles) {
        const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];

        await prisma.article.update({
            where: { id: article.id },
            data: {
                expertId: adminExpert.id,
                mainImage: randomImage
            }
        });
        updatedCount++;
        if (updatedCount % 20 === 0) process.stdout.write('.');
    }

    console.log(`\nSuccessfully updated ${updatedCount} articles.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
