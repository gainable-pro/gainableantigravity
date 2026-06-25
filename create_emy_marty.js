const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = "emymarty.pro@gmail.com";
  const password = "gainable2026**";
  const firstName = "Emy";
  const lastName = "Marty";

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
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

    console.log("Commercial user successfully created!");
    console.log({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      profile: newUser.commercialProfile
    });

  } catch (error) {
    console.error("Error creating commercial user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
