import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    let url = process.env.DATABASE_URL;
    
    // Force connection limitation for Vercel Serverless & Build workflows (increased to 5 to prevent pool starvation)
    if (url && !url.includes("connection_limit")) {
        url = url.includes("?") ? `${url}&connection_limit=5` : `${url}?connection_limit=5`;
    }

    return new PrismaClient(url ? { datasources: { db: { url } } } : undefined);
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
