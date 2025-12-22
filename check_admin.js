const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const admins = await prisma.user.findMany({
        where: { role: 'admin' },
        select: { email: true }
    });

    if (admins.length > 0) {
        console.log('Admins found:', admins);
    } else {
        // If no admin, find the first user to promote
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
            console.log('No admin found. Promoting:', firstUser.email);
            await prisma.user.update({
                where: { id: firstUser.id },
                data: { role: 'admin' }
            });
        } else {
            console.log('No users found in database.');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
