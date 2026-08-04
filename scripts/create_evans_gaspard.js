const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  const email = "evansgaspard@gmail.com";
  const password = "Gainable2026*";
  const firstName = "Evans";
  const lastName = "Gaspard";

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { commercialProfile: true }
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      console.log(`Utilisateur avec l'email ${email} existe déjà. Mise à jour en rôle commercial...`);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          password_hash: hashedPassword,
          role: "commercial",
          commercialProfile: existingUser.commercialProfile ? {
            update: {
              nom: lastName,
              prenom: firstName,
              statutLegal: "Consultant Commercial & SEO"
            }
          } : {
            create: {
              nom: lastName,
              prenom: firstName,
              statutLegal: "Consultant Commercial & SEO"
            }
          }
        },
        include: { commercialProfile: true }
      });
      console.log("✅ Compte commercial mis à jour avec succès !");
      console.log({
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        profile: updatedUser.commercialProfile
      });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        role: "commercial",
        commercialProfile: {
          create: {
            nom: lastName,
            prenom: firstName,
            statutLegal: "Consultant Commercial & SEO"
          }
        }
      },
      include: {
        commercialProfile: true
      }
    });

    console.log("✅ Compte commercial Evans Gaspard créé avec succès !");
    console.log({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      profile: newUser.commercialProfile
    });

  } catch (error) {
    console.error("❌ Erreur lors de la création du compte commercial :", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
