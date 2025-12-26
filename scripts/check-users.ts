import { prisma } from "../src/lib/prisma";

async function main() {
    const users = await prisma.user.findMany({ include: { expert: true } });
    console.log(JSON.stringify(users, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
