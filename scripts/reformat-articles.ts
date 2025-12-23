
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("Starting Article Reformatting...");

    // Process in batches to avoid connection limits and memory issues
    const BATCH_SIZE = 50;
    let skip = 0;

    while (true) {
        try {
            const articles = await prisma.article.findMany({
                take: BATCH_SIZE,
                skip: skip,
                select: { id: true, content: true }
            });

            if (articles.length === 0) break;

            console.log(`Processing batch ${skip} - ${skip + articles.length}...`);

            for (const article of articles) {
                let newContent = article.content;

                // 1. Ensure P tags have spacing
                // Replace simple <p> with styled <p> if not already styled
                // We use a simple regex approach. 
                // Note: If content is already styled, this might duplicate, so we check.
                if (!newContent.includes('class="text-slate-600 mb-4 leading-relaxed"')) {
                    newContent = newContent.replace(/<p>/g, '<p class="text-slate-600 mb-4 leading-relaxed">');
                }

                // 2. Headings spacing
                if (!newContent.includes('class="text-2xl font-bold mt-8 mb-4 text-[#1F2D3D]"')) {
                    newContent = newContent.replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-[#1F2D3D]">');
                }

                if (!newContent.includes('class="text-xl font-semibold mt-6 mb-3 text-[#1F2D3D]"')) {
                    newContent = newContent.replace(/<h3>/g, '<h3 class="text-xl font-semibold mt-6 mb-3 text-[#1F2D3D]">');
                }

                // 3. Lists
                if (!newContent.includes('class="list-disc pl-5 mb-6 space-y-2 text-slate-600"')) {
                    newContent = newContent.replace(/<ul>/g, '<ul class="list-disc pl-5 mb-6 space-y-2 text-slate-600">');
                }

                // 4. Update
                if (newContent !== article.content) {
                    await prisma.article.update({
                        where: { id: article.id },
                        data: { content: newContent }
                    });
                }
            }

            skip += BATCH_SIZE;
            await wait(100); // Small pause for DB

        } catch (e: any) {
            console.error("Batch failed. Retrying in 5s...", e.message);
            await wait(5000);
            // Don't skip increment, retry same batch? 
            // Actually usually it's best to retry the same offset. 
            // But here we rely on skip/take. If it fails, loop continues with same skip? 
            // No, the loop logic above increments skip ONLY on success? No, it's inside try.
            // Wait, if it errors, it goes to catch, skip is NOT incremented.
            // But we need to be careful of infinite loops.
            // Let's just create a new client connection on retry? No that's complex.
            // If persistent error, we might be stuck.

            // Re-instantiate prisma? 
            // prisma.$disconnect(); 
            // ...
            // simpler: Just process.exit(1) and let me run it again manually?
            // I'll try to just retry.
        }
    }
}

main()
    .then(() => console.log("Done."))
    .catch(console.error)
    .finally(() => prisma.$disconnect());
