
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const companies = ["SMB13", "CORETEC", "FRANCK EXPERTISE", "AIR G ENERGIE"];

    console.log("Activating profiles for:", companies);

    const result = await prisma.expert.updateMany({
        where: {}, // Update ALL for dev testing
        data: {
            status: 'active'
        }
    });

    console.log(`Updated ${result.count} profiles to 'active'.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
