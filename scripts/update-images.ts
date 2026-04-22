import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ALL_IMAGES = [
    "/blog/b2b-growth.png",
    "/blog/b2b-strategy.png",
    "/blog/b2b-success.png",
    "/blog/b2b-dashboard.png",
    "/blog/b2b-handshake.png",
    "/blog/b2b-planning.png",
    "/blog/b2b-revenue.png",
    "/blog/b2b-team.png",
    "/blog/b2b-tablet.png"
];

// Fisher-Yates shuffle algorithm
function shuffle(array: string[]) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

async function updateArticles(articles: any[]) {
    let updatedCount = 0;
    
    for (const article of articles) {
        
        let paragraphs: string[] = [];

        if (article.jsonContent && typeof article.jsonContent === 'object') {
            const blocks = (article.jsonContent as any).blocks || [];
            paragraphs = blocks.filter((b: any) => b.type === 'text').map((b: any) => b.value);
        }

        if (paragraphs.length < 2) {
            console.log(`Skipping ${article.slug}, not enough text content.`);
            continue;
        }
        
        // Pick 2 random unique images
        const shuffledImages = shuffle([...ALL_IMAGES]);
        const img1 = shuffledImages.pop();
        const img2 = shuffledImages.pop();

        const blocks: any[] = [];
        
        // Determine whether it's an email format or LinkedIn format depending on length
        if (paragraphs.length >= 4) {
            // LinkedIn format (longer)
            const introText = paragraphs.shift() || article.title;
            blocks.push({ type: "h2", value: "Le marché évolue, avec ou sans vous" });
            blocks.push({ type: "text", value: introText });
            blocks.push({ type: "image", value: img1, alt: `Stratégie B2B et Acquisition` });

            const half = Math.ceil(paragraphs.length / 2);
            const chunk1 = paragraphs.splice(0, half).join('\n\n');
            blocks.push({ type: "h2", value: "La réalité du marché aujourd'hui" });
            blocks.push({ type: "text", value: chunk1 });
            blocks.push({ type: "image", value: img2, alt: `Vision stratégique du marché` });

            const chunk2 = paragraphs.length > 0 ? paragraphs.join('\n\n') : "C'est pourquoi nous avons créé Gainable.fr.";
            blocks.push({ type: "h2", value: "Notre analyse approfondie" });
            blocks.push({ type: "text", value: chunk2 });
        } else {
            // Email format
            const introText = paragraphs.shift() || article.title;
            blocks.push({ type: "h2", value: "Le marché évolue, avec ou sans vous" });
            blocks.push({ type: "text", value: introText });
            blocks.push({ type: "image", value: img1, alt: `Stratégie B2B et Acquisition` });

            const chunk1 = paragraphs.splice(0, 2).join('\n\n'); 
            blocks.push({ type: "h2", value: "La réalité du marché aujourd'hui" });
            blocks.push({ type: "text", value: chunk1 });
            blocks.push({ type: "image", value: img2, alt: `Vision stratégique du marché` });

            const chunk2 = paragraphs.length > 0 ? paragraphs.join('\n\n') : "C'est pourquoi nous avons créé Gainable.fr.";
            blocks.push({ type: "h2", value: "Notre analyse approfondie" });
            blocks.push({ type: "text", value: chunk2 });
        }


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
            }
        });

        console.log(`Updated random distinct images for: ${article.slug}`);
        updatedCount++;
    }
    
    return updatedCount;
}

async function main() {
    console.log("Starting Image Diversity Update...");

    const expert = await prisma.expert.findUnique({
        where: { slug: "redaction-gainable" }
    });

    if (!expert) return;

    const emails = await prisma.article.findMany({
        where: { expertId: expert.id, slug: { startsWith: 'b2b-conseil-' } }
    });
    
    const linkedins = await prisma.article.findMany({
        where: { expertId: expert.id, targetCity: null, slug: { not: { startsWith: 'b2b-conseil-' } } }
    });

    console.log(`Updating ${emails.length} Emails and ${linkedins.length} LinkedIns...`);

    const c1 = await updateArticles(emails);
    const c2 = await updateArticles(linkedins);

    console.log(`\nDONE! ${c1 + c2} articles completely diversified without local duplication.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
