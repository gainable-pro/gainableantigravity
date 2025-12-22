const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'gmaroann@gmail.com';
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        console.log(`User ${email} exists. Role: ${user.role}`);
    } else {
        console.log(`User ${email} DOES NOT EXIST.`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
