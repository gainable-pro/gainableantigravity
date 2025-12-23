
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- CHECK IMAGE URLS ---");

    const articles = await prisma.article.findMany({
        where: { mainImage: { not: null } },
        select: { mainImage: true },
        take: 50
    });

    const domains = new Set();

    articles.forEach(a => {
        if (a.mainImage) {
            try {
                const url = new URL(a.mainImage);
                domains.add(url.hostname);
            } catch (e) {
                console.log("Invalid URL:", a.mainImage);
            }
        }
    });

    console.log("Found domains:");
    domains.forEach(d => console.log(d));

    // Also check Expert logos
    const experts = await prisma.expert.findMany({
        where: { logo_url: { not: null } },
        select: { logo_url: true },
        take: 50
    });

    experts.forEach(e => {
        if (e.logo_url) {
            try {
                const url = new URL(e.logo_url);
                domains.add(url.hostname);
            } catch (err) {
                // ignore
            }
        }
    });

    console.log("All Unique Domains:");
    domains.forEach(d => console.log("- " + d));
}

main().finally(() => prisma.$disconnect());
