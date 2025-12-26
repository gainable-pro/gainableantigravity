
import { prisma } from "@/lib/prisma";
import fs from 'fs';
import path from 'path';

async function main() {
    console.log("--- STARTING SEO & CONTENT VERIFICATION ---");

    const articles = await prisma.article.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            metaDesc: true,
            altText: true,
            mainImage: true,
            targetCity: true,
            status: true,
        }
    });

    console.log(`Found ${articles.length} articles to check.`);

    let errors = 0;
    const errorLog: string[] = [];

    for (const article of articles) {
        const issues: string[] = [];

        // 1. Check Title
        if (!article.title || article.title.length < 5) {
            issues.push(`Short or missing Title: "${article.title}"`);
        }

        // 2. Check Meta Description
        if (!article.metaDesc || article.metaDesc.length < 10) {
            issues.push(`Missing or invalid Meta Description`);
        }

        // 3. Check Alt Text
        if (!article.altText) {
            issues.push(`Missing Alt Text`);
        }

        // 4. Check Target City
        if (!article.targetCity) {
            issues.push(`Missing Target City`);
        }

        // 5. Check Image Path
        if (!article.mainImage) {
            issues.push(`Missing Main Image`);
        } else if (!article.mainImage.startsWith('/assets/images/')) {
            issues.push(`Invalid Image Path format: ${article.mainImage}`);
        } else {
            // Verify file exists locally (optional, but good for local check)
            // Note: production paths might differ if we are running this locally against prod DB but local files.
            // We'll trust the path format for now as 'content display check'
        }

        if (issues.length > 0) {
            errors++;
            errorLog.push(`[Article ID: ${article.id}] ${article.title}: ${issues.join(', ')} (MetaLen: ${article.metaDesc?.length}, Alt: ${article.altText}, City: ${article.targetCity})`);
        }
    }

    if (errors === 0) {
        console.log("✅ All articles passed SEO & Content structure checks.");
    } else {
        console.error(`❌ Found ${errors} articles with issues:`);
        errorLog.slice(0, 20).forEach(log => console.log(log));
        if (errors > 20) console.log(`... and ${errors - 20} more.`);
    }

    console.log("--- VERIFICATION COMPLETE ---");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
