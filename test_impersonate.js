const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

async function test() {
  console.log("Looking for admin user...");
  const admin = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (!admin) {
    console.log("No admin user found!");
    return;
  }
  console.log("Found admin:", admin.email);

  console.log("Looking for target user to impersonate...");
  const target = await prisma.user.findFirst({
    where: {
      NOT: { id: admin.id }
    }
  });

  if (!target) {
    console.log("No other user found!");
    return;
  }
  console.log("Found target:", target.email);

  // Generate an admin token to simulate being logged in as admin
  const adminToken = jwt.sign(
    { userId: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  console.log("Simulating verification logic...");
  const decodedAdmin = jwt.verify(adminToken, JWT_SECRET);
  console.log("Decoded admin token:", decodedAdmin);

  const verifiedUser = await prisma.user.findUnique({
    where: { id: decodedAdmin.userId },
    select: { role: true }
  });
  console.log("Verified user role in DB:", verifiedUser?.role);

  if (verifiedUser && verifiedUser.role === 'admin') {
    console.log("Admin verification: SUCCESS");
  } else {
    console.log("Admin verification: FAILED");
  }
}

test()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
