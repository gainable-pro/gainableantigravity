const { verify } = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

// MOCK verify
const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

// MOCK Cookie with OLD User ID
// I need to generate a token for a NON-EXISTENT user
const { sign } = require("jsonwebtoken");
const oldToken = sign(
    { userId: "deleted-user-id", email: "deleted@test.com", role: "admin" },
    JWT_SECRET,
    { expiresIn: "7d" }
);

const prisma = new PrismaClient();

async function simulateAdminAuth() {
    console.log("Simulating Admin Auth with Stale Token...");

    try {
        const decoded = verify(oldToken, JWT_SECRET);
        console.log("Token decoded:", decoded);

        // This is what verifyAdmin does:
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { role: true }
        });

        console.log("User result:", user);

        if (user && user.role === 'admin') {
            console.log("Authorized");
        } else {
            console.log("Unauthorized (Graceful fail)");
        }
    } catch (e) {
        console.log("Caught Error:", e);
    }
}

simulateAdminAuth()
    .finally(() => prisma.$disconnect());
