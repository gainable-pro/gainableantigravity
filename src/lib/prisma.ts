import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    let url = process.env.DATABASE_URL;
    
    // Force connection limitation for Vercel Serverless & Build workflows
    if (url && !url.includes("connection_limit")) {
        url = url.includes("?") ? `${url}&connection_limit=1` : `${url}?connection_limit=1`;
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
