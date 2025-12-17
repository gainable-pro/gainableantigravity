const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function reset() {
    try {
        const hashedPassword = await bcrypt.hash("password123", 10);
        
        // Find the user linked to Air G Energie (or by email directly)
        // First find expert
        const expert = await prisma.expert.findFirst({
            where: { nom_entreprise: { contains: "Air G", mode: "insensitive" } }
        });

        if (!expert) {
            console.log("Air G Energie not found");
            return;
        }

        console.log("Found Expert:", expert.nom_entreprise, "User ID:", expert.user_id);

        // Update User password
        await prisma.user.update({
            where: { id: expert.user_id },
            data: { password_hash: hashedPassword }
        });

        console.log("Password reset to 'password123' for user linked to", expert.nom_entreprise);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

reset();
