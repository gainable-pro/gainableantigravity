import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGES = [
    "/blog/gainable-salon.jpg",
    "/blog/installation-combles.jpg",
    "/blog/bouche-soufflage.jpg",
    "/blog/thermostat-mur.jpg",
    "/blog/groupe-exterieur.jpg",
    "/blog/clim-reversible.jpg",
    "/hero-hvac.png"
];

function getRandomImage() {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}

async function main() {
    console.log("Starting Article Reformatting (LINKEDIN ARTICLES B2B ACQUISITION FUNNEL)...");

    // Fetch the 12 LinkedIn articles we found
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
        let paragraphs: string[] = [];

        if (article.jsonContent && typeof article.jsonContent === 'object') {
            const blocks = (article.jsonContent as any).blocks || [];
            paragraphs = blocks.filter((b: any) => b.type === 'text').map((b: any) => b.value);
        } else {
            content = content.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, ""); 
            const pMatches = content.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
            if (pMatches && pMatches.length > 0) {
                paragraphs = pMatches.map(p => p.replace(/<\/?[^>]+(>|$)/g, "").trim()).filter(p => p.length > 20);
            } else {
                paragraphs = content.split('\n').filter(p => p.trim().length > 20);
            }
        }

        if (paragraphs.length < 2) {
            console.log(`Skipping ${article.slug}, not enough content to funnelize.`);
            continue;
        }

        const blocks: any[] = [];

        const introText = paragraphs.shift() || article.title;
        blocks.push({ type: "h2", value: "Une évolution incontournable du marché" });
        blocks.push({ type: "text", value: introText });
        blocks.push({ type: "image", value: getRandomImage(), alt: `Problématique CVC` });

        const half = Math.ceil(paragraphs.length / 2);
        const chunk1 = paragraphs.splice(0, half).join('\n\n');
        
        blocks.push({ type: "h2", value: "La réalité du terrain" });
        blocks.push({ type: "text", value: chunk1 });
        blocks.push({ type: "image", value: getRandomImage(), alt: `Options Stratégiques` });

        const chunk2 = paragraphs.length > 0 ? paragraphs.join('\n\n') : "C'est pourquoi nous avons créé Gainable.fr, pour vous redonner le pouvoir.";
        blocks.push({ type: "h2", value: "Notre analyse approfondie" });
        blocks.push({ type: "text", value: chunk2 });

        const inlineCTA = `
            <div class="mt-16 bg-slate-900 border border-slate-700 p-8 rounded-2xl text-center text-white shadow-2xl relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-[#D59B2B]/20 to-transparent pointer-events-none"></div>
                <div class="relative z-10">
                    <h3 class="text-2xl font-bold mb-4 font-sans text-white">Prêt à transformer votre entreprise ?</h3>
                    <p class="mb-8 text-slate-300 font-sans text-lg">Ne laissez plus vos concurrents monopoliser les meilleurs chantiers. Créez votre profil sur Gainable.fr et commencez à recevoir des contacts vérifiés sur votre secteur, sans commission sur vos travaux.</p>
                    <a href="/pourquoi-gainable" class="inline-block bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 shadow-xl text-lg font-sans">
                        Rejoindre la plateforme Gainable.fr
                    </a>
                </div>
            </div>
        `;
        blocks.push({ type: "html", value: inlineCTA });

        await prisma.article.update({
            where: { id: article.id },
            data: {
                content: "", 
                jsonContent: { blocks },
                introduction: introText.substring(0, 200) + "..."
            }
        });

        console.log(`Funnelized: ${article.slug}`);
        updatedCount++;
    }

    console.log(`\nDONE! ${updatedCount} LinkedIn articles converted into aggressive funnels.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
