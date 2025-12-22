const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'gmaroann@gmail.com';
    const password = 'Password123!';
    const hashedPassword = await hash(password, 10);

    console.log(`Recreating admin user: ${email}...`);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                role: 'admin' // Ensure role is admin
            }
        });
        console.log(`User created successfully with ID: ${user.id}`);
    } catch (e) {
        console.error("Error creating user:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
