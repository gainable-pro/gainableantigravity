
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "contact@airgenergie.fr";
    const newPassword = "password123";

    console.log(`Searching for user with email: ${email}...`);

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        console.error("❌ User not found!");
        // Try searching by expert name just in case
        console.log("Searching by Expert name 'Air G'...");
        const expert = await prisma.expert.findFirst({
            where: { nom_entreprise: { contains: "Air G", mode: 'insensitive' } },
            include: { user: true }
        });

        if (expert && expert.user) {
            console.log(`Found expert '${expert.nom_entreprise}' linked to user email '${expert.user.email}'.`);
            await updatePassword(expert.user.id, newPassword);
        } else {
            console.error("❌ No expert found for 'Air G' either.");
        }
    } else {
        console.log("✅ User found.");
        await updatePassword(user.id, newPassword);
    }
}

async function updatePassword(userId: string, pass: string) {
    const hashedPassword = await hash(pass, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { password_hash: hashedPassword }
    });
    console.log(`✅ Password has been reset to: ${pass}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
