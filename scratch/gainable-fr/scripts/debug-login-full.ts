
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

async function main() {
    const email = "contact@airgenergie.fr";
    const password = "Gainable2025!";

    console.log("🔍 1. Testing Database Connection...");
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error("❌ User not found!");
        return;
    }
    console.log(`✅ User found: ${user.id}`);
    console.log(`   Hash: ${user.password_hash.substring(0, 10)}...`);

    console.log("🔍 2. Testing Password Compare...");
    try {
        const isValid = await compare(password, user.password_hash);
        if (isValid) {
            console.log("✅ Password matches!");
        } else {
            console.error("❌ Password does NOT match.");
            return;
        }
    } catch (e) {
        console.error("❌ Bcrypt error:", e);
        return;
    }

    console.log("🔍 3. Testing JWT Generation...");
    try {
        const token = sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        console.log("✅ JWT Generated successfully.");
        console.log("   Token sample:", token.substring(0, 20) + "...");
    } catch (e) {
        console.error("❌ JWT error:", e);
        return;
    }

    console.log("\n🎉 FULL LOGIN FLOW PASSED LOCALLY.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
