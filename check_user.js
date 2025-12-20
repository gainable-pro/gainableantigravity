
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    const email = 'contact@airgenergie.fr'; // The user mentioned
    const user = await prisma.user.findUnique({
        where: { email },
        include: { expert: true }
    });

    if (!user) {
        console.log("User not found: " + email);
        return;
    }

    console.log("USER FOUND:", user.email);
    console.log("EXPERT DATA:", JSON.stringify(user.expert, null, 2));
}

checkUser()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
