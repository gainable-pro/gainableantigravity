import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'jean.dupont@gainable.fr';
    const password = 'Maroc2027';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        console.log(`User ${email} already exists.`);
        // Update password just in case
        await prisma.user.update({
            where: { email },
            data: { password_hash: hashedPassword }
        });
        console.log('Password updated.');
    } else {
        const user = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                role: 'commercial',
                commercialProfile: {
                    create: {
                        nom: 'Dupont',
                        prenom: 'Jean',
                        telephone: '0612345678'
                    }
                }
            }
        });
        console.log(`Created commercial user: ${user.email}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
