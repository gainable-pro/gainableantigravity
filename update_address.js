
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAddress() {
    try {
        const updated = await prisma.expert.updateMany({
            where: {
                nom_entreprise: {
                    contains: "Air G",
                    mode: 'insensitive'
                }
            },
            data: {
                adresse: "3 rue du Pourra"
            }
        });
        console.log("Updated experts:", updated);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

updateAddress();
