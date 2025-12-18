
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Checking all experts in database...");

    const experts = await prisma.expert.findMany({
        include: {
            user: {
                select: {
                    email: true
                }
            }
        }
    });

    console.log(`\n📋 Found ${experts.length} experts:`);
    console.log("---------------------------------------------------");

    experts.forEach(exp => {
        console.log(`🏢 Name: ${exp.nom_entreprise}`);
        console.log(`   ID:   ${exp.id}`);
        console.log(`   Slug: ${exp.slug}`);
        console.log(`   City: ${exp.ville} (${exp.code_postal})`);
        console.log(`   Status: ${exp.status}`);
        console.log(`   Email: ${exp.user?.email}`);
        console.log("---------------------------------------------------");
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
