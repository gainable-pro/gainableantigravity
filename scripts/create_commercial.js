const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    const email = "anthony.gonalons@yahoo.com";
    const password = "Gainable2026*";

    const hash = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        // Mettre à jour le rôle
        await prisma.user.update({
            where: { email },
            data: { role: "commercial", password_hash: hash }
        });
        console.log("Utilisateur mis à jour en commercial.");
    } else {
        await prisma.user.create({
            data: {
                email,
                password_hash: hash,
                role: "commercial"
            }
        });
        console.log("Utilisateur commercial créé avec succès.");
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
