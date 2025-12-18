
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'contact@airgenergie.fr';
    console.log(`Inspecting user: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            expert: {
                include: {
                    technologies: true,
                    interventions_clim: true
                }
            }
        }
    });

    if (!user) {
        console.log("User NOT FOUND");
    } else {
        console.log("User Found:", user.id);
        console.log("Expert Profile:", user.expert);
        if (user.expert) {
            console.log("Expert Type:", user.expert.expert_type);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
