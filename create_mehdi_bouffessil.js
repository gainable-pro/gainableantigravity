require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "mehdi.bouffessil@gmail.com";
  const password = "Gainable2027**";
  const firstName = "Mehdi";
  const lastName = "Bouffessil";

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { commercialProfile: true }
    });

    if (existingUser) {
      console.log(`Utilisateur avec l'email ${email} existe déjà.`);
      // Update password and role if needed
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password_hash: hashedPassword,
          role: "commercial",
          commercialProfile: existingUser.commercialProfile 
            ? { update: { nom: lastName, prenom: firstName } }
            : { create: { nom: lastName, prenom: firstName, statutLegal: "Micro-entreprise" } }
        },
        include: { commercialProfile: true }
      });
      console.log("Utilisateur mis à jour avec succès :", {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.commercialProfile
      });
      return;
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User & CommercialProfile in a transaction
    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        role: "commercial",
        commercialProfile: {
          create: {
            nom: lastName,
            prenom: firstName,
            statutLegal: "Micro-entreprise"
          }
        }
      },
      include: {
        commercialProfile: true
      }
    });

    console.log("Compte commercial créé avec succès !");
    console.log({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      profile: newUser.commercialProfile
    });

  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur commercial :", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
