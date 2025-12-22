const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'gmaroann@gmail.com';
    const newPassword = 'Password123!';

    console.log(`Resetting password for ${email}...`);

    const hashedPassword = await hash(newPassword, 10);

    try {
        await prisma.user.update({
            where: { email },
            data: { password_hash: hashedPassword }
        });
        console.log(`Success! Password for ${email} is now: ${newPassword}`);
    } catch (e) {
        console.error("Error updating password:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
