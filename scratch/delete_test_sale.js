const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Recherche des prospects de test...");
    const testProspects = await prisma.commercialProspect.findMany({
        where: { nomEntreprise: "test" }
    });

    console.log(`Trouvé ${testProspects.length} prospects de test.`);
    for (const p of testProspects) {
        console.log(`Suppression du prospect ${p.nomEntreprise} (ID: ${p.id})...`);
        await prisma.commercialProspect.delete({
            where: { id: p.id }
        });
        console.log("Supprimé avec succès (avec suppression en cascade des ventes liées).");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
