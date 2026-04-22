import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Article Reformatting (PRESERVING HTML TO ZIGZAG + B2B FUNNEL)...");

    const articles = await prisma.article.findMany({
        where: { 
            targetCity: null, 
            slug: { not: { startsWith: 'b2b-conseil-' } }
        }
    });

    console.log(`Found ${articles.length} LinkedIn B2B articles to reconstruct into funnels.`);

    let updatedCount = 0;

    for (const article of articles) {
        let content = article.content || "";
        
        // Strip everything that isn't h2, p, or img to simplify
        // In this specific DB, content is very clean: <h2>...</h2> \n <p>...</p> \n <img ... />
        const blocks: any[] = [];
        
        // Let's use regex to find all h2, p, and img in order
        const elementRegex = /<(h2|p|img)[^>]*>([\s\S]*?)<\/\1>|<img([^>]+)>/gi;
        let match;
        
        // Also missing an intro before the first H2! We will use the article title as intro if no early P.
        let introAdded = false;

        while ((match = elementRegex.exec(content)) !== null) {
            const tag = match[1] ? match[1].toLowerCase() : (match[3] ? 'img' : null);
            
            if (tag === 'p') {
                const textVal = match[2].trim();
                if (textVal) {
                    if (!introAdded && blocks.length === 0) {
                        blocks.push({ type: 'text', value: textVal });
                        introAdded = true;
                    } else {
                        blocks.push({ type: 'text', value: textVal });
                    }
                }
            } else if (tag === 'h2') {
                if (!introAdded) {
                    // Push the title as intro text before the first H2
                    blocks.push({ type: 'text', value: article.title });
                    introAdded = true;
                }
                const textVal = match[2].trim();
                blocks.push({ type: 'h2', value: textVal });
            } else if (tag === 'img') {
                const imgStr = match[0];
                const srcMatch = imgStr.match(/src="([^"]+)"/i);
                const altMatch = imgStr.match(/alt="([^"]+)"/i);
                if (srcMatch) {
                    blocks.push({ type: 'image', value: srcMatch[1], alt: altMatch ? altMatch[1] : '' });
                }
            }
        }
        
        // Merge consecutive `text` blocks into a single block to form a nice chunk of paragraphs for the zigzag
        const mergedBlocks: any[] = [];
        let currentText = "";
        
        for (const b of blocks) {
            if (b.type === 'text') {
                currentText += (currentText ? "\n\n" : "") + b.value;
            } else {
                if (currentText) {
                    mergedBlocks.push({ type: 'text', value: currentText });
                    currentText = "";
                }
                mergedBlocks.push(b);
            }
        }
        if (currentText) {
            mergedBlocks.push({ type: 'text', value: currentText });
        }

        // Inline Massive CTA at the end
        const inlineCTA = `
            <div class="mt-16 bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center text-white shadow-2xl relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-[#D59B2B]/20 to-transparent pointer-events-none"></div>
                <div class="relative z-10">
                    <h3 class="text-2xl font-bold mb-4 font-sans text-white">Prêt à transformer votre entreprise ?</h3>
                    <p class="mb-8 text-slate-300 font-sans text-lg">Ne laissez plus vos concurrents monopoliser les meilleurs chantiers. Créez votre profil sur Gainable.fr et venez tester la méthode d'acquisition qui rapporte vraiment de l'argent.</p>
                    <a href="/pourquoi-gainable" class="inline-block bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-xl text-lg font-sans">
                        Rejoindre la plateforme Gainable.fr
                    </a>
                </div>
            </div>
        `;
        mergedBlocks.push({ type: "html", value: inlineCTA });

        await prisma.article.update({
            where: { id: article.id },
            data: {
                content: "", 
                jsonContent: { blocks: mergedBlocks }
            }
        });

        console.log(`Smart Funnelized: ${article.slug}`);
        updatedCount++;
    }

    console.log(`\nDONE! ${updatedCount} LinkedIn articles converted into aggressive funnels!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
