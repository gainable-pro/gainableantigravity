import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEO_PREFIXES = [
    "Trouver des chantiers CVC",
    "Achat leads qualifiés artisan",
    "Développer son chiffre d'affaires",
    "Acquisition de clients en pompe à chaleur",
    "Générer des devis exclusifs CVC",
    "Visibilité Google pour artisans",
    "Arrêter l'achat de leads partagés",
    "Stratégie digitale installateur frigoriste",
    "Réseau partenaire pose PAC",
    "Développement entreprise bâtiment"
];

function getPrefix(index: number) {
    return SEO_PREFIXES[index % SEO_PREFIXES.length];
}

async function main() {
    console.log("Starting Aggressive B2B SEO Upgrade...");

    const expert = await prisma.expert.findUnique({
        where: { slug: "redaction-gainable" }
    });

    if (!expert) return;

    // Fetch ALL B2B Articles (Emails + LinkedIn)
    const articles = await prisma.article.findMany({
        where: { expertId: expert.id }
    });
    
    // Some mass SEO articles might have gotten here if things broke, but we filtered them by targetCity before. 
    // To be perfectly safe, only take those with targetCity: null
    const b2bArticles = articles.filter(a => a.targetCity === null);

    console.log(`Processing ${b2bArticles.length} B2B articles for SEO Meta Upgrades...`);

    let count = 0;
    for (const article of b2bArticles) {
        
        let newTitle = article.title;
        // Check if we already prefixed it to avoid double prefixing
        const isAlreadyPrefixed = SEO_PREFIXES.some(p => newTitle.includes(p));
        
        if (!isAlreadyPrefixed) {
             const prefix = getPrefix(count);
             newTitle = `${prefix} : ${newTitle}`;
        }

        // Generate strong metaDesc
        // We take the existing meta or intro, but prepend a strong Call to Action sequence
        let newMeta = article.metaDesc || article.introduction || "";
        newMeta = `[Artisan & Installateur] Découvrez comment ${newTitle.toLowerCase()}. ${newMeta}`.substring(0, 155) + "...";

        // Upgrade Alt Text for all blocks if jsonContent exists
        let jsonContent = article.jsonContent as any;
        if (jsonContent && jsonContent.blocks) {
            for (let b of jsonContent.blocks) {
                if (b.type === 'image') {
                    b.alt = `${getPrefix(count + 1)} - Gainable.fr Plateforme Artisan`;
                }
            }
        }

        await prisma.article.update({
            where: { id: article.id },
            data: {
                title: newTitle,
                metaDesc: newMeta,
                altText: `${getPrefix(count)} - Plateforme d'apport d'affaires`,
                jsonContent: jsonContent
            }
        });

        count++;
    }

    console.log(`\nDONE! ${count} Meta/HT SEO titles injected into the B2B hub.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
