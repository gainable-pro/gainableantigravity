
import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            process.env[match[1].trim()] = match[2].trim();
        }
    });
}
const prisma = new PrismaClient();

async function main() {
    const email = "contact@fex-im13.fr";
    const user = await prisma.user.findUnique({
        where: { email },
        include: { expert: true }
    });

    if (user) {
        console.log("User found:", user.email);
        console.log("Password Hash:", user.password_hash ? "Present" : "Missing");
        console.log("Expert Profile:", user.expert ? "Found" : "Missing");
        if (user.expert) {
            console.log("Expert Type:", user.expert.expert_type);
        }
    } else {
        console.log("User NOT found.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
