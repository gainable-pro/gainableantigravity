import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { CITIES_EXTENDED } from '../src/data/cities-extended';
import { CITIES_100 } from '../src/data/cities-100';

// Initialize Prisma & OpenAI
const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED];

const KEYWORDS = [
    "climatisation réversible",
    "climatisation gainable",
    "console murale",
    "climatisation split",
    "climatisation cassette",
    "VRV",
    "gainable à eau glacée",
    "pompe à chaleur air/air"
];

// Helper for SEO Images
function articleImage(keyword: string, city: string) {
    const images = [
        "/blog/gainable-salon.jpg",
        "/blog/installation-combles.jpg",
        "/blog/bouche-soufflage.jpg",
        "/blog/thermostat-mur.jpg",
        "/blog/groupe-exterieur.jpg",
        "/blog/clim-reversible.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
}

async function generateArticleContent(keyword: string, city: string): Promise<{ intro: string, content: string, faq: any[] }> {
    const systemPrompt = `
Tu es un expert mondial en SEO et un ingénieur spécialisé en génie climatique (CVC).
Tu es chargé de rédiger une page pilier optimisée pour le référencement (SEO) local.

RÈGLES ABSOLUES À RESPECTER À LA LETTRE (TRÈS IMPORTANT) :
1. LE CONTENU DOIT ÊTRE 100% UNIQUE. Varie au maximum le vocabulaire et les tournures de phrases pour éviter toute pénalité Google (Google Sandbox / Duplicate Content). N'utilise jamais les mêmes modèles de phrases d'un article à l'autre.
2. SANTÉ ET CONFORT : Démystifie absolument l'idée reçue que "la climatisation rend malade". Explique clairement que c'est le MANQUE D'ENTRETIEN (filtres encrassés) qui cause des maladies.
   - Mentionne que l'entretien annuel est obligatoire.
   - Mets en avant que les modèles premium aujourd'hui disposent de systèmes d'ioniseurs plasma (ex: nanoe™ X) et de purificateurs qui tuent jusqu'à 99% des microbes, virus, et polluants.
3. ÉCONOMIES : Parle de la géopolitique actuelle, de la hausse du coût de l'énergie. Explique qu'investir dans une pompe à chaleur (PAC) ou climatisation est ultra-rentable avec des SCOP souvent supérieurs à 4 (4 kW de chaleur pour 1 kW consommé). Mentionne la régulation AirZone pour économiser pièce par pièce.
4. GRAND FROID : Mentionne, en particulier pour les villes concernées, la technologie "Hyper Heating" permettant aux équipements de fonctionner sans broncher jusqu'à -15°C ou -25°C, supprimant le besoin d'appoints électriques gourmands.
5. FORMAT DE SORTIE STRICT :
Retourne UNIQUEMENT une chaîne de caractères au format JSON strict avec la structure suivante :
{
    "intro": "Une introduction accrocheuse d'environ 40 mots de présentation (sans balises HTML).",
    "html_content": "Le contenu principal structuré avec des balises <h2>, <h3>, <p>, <ul>... Il doit inclure les instructions SEO et sémantiques. Ne remets pas le H1 ni l'introduction ici. Insère naturellement le nom de la ville et le mot clé.",
    "faq": [
        { "q": "Question fréquente 1 optimisée SEO", "r": "Réponse 1 claire et professionnelle" },
        { "q": "Question fréquente 2 optimisée SEO", "r": "Réponse 2..." },
        { "q": "Question fréquente 3 optimisée SEO", "r": "Réponse 3..." }
    ]
}
`;

    const userPrompt = `Rédige un contenu longue traîne, très riche sémantiquement et parfaitement formaté pour le mot-clé "${keyword}" dans la ville de "${city}".\nAssure-toi d'appliquer les consignes sur la santé (entretien indispensable, purificateurs), les économies (SCOP de 4), et l'hyper heating tout en restant particulièrement pertinent pour la région de ${city}. Sois original !`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Very cheap and fast for huge tasks
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9, // High temperature for high uniqueness
    });

    const jsonString = response.choices[0].message.content;
    if (!jsonString) {
        throw new Error("No response from OpenAI");
    }

    const data = JSON.parse(jsonString);
    return {
        intro: data.intro,
        content: data.html_content,
        faq: data.faq
    };
}

async function main() {
    console.log("Starting AI-DRIVEN MASSIVE Article Generation...");

    if (!process.env.OPENAI_API_KEY) {
        console.error("ERREUR FATALE: OPENAI_API_KEY est introuvable dans .env.local");
        process.exit(1);
    }

    let expert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Rédaction Gainable.fr" }
    });

    if (!expert) {
        console.error("Expert 'Rédaction Gainable.fr' not found. Please manually seed the expert first.");
        process.exit(1);
    }

    let count = 0;
    
    for (const cityObj of ALL_CITIES) {
        const city = cityObj.name;
        
        for (const keyword of KEYWORDS) {
            let slug = `${keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')}-${city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')}`;
            slug = slug.replace(/^-|-$/g, '');

            const exists = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug } }
            });

            if (!exists) {
                console.log(`Generating unique article with OpenAI for: [${keyword}] à [${city}]...`);
                try {
                    const aiData = await generateArticleContent(keyword, city);
                    
                    // Assembly with hardcoded "Trouver un installateur" CTA block for maximum conversion
                    const fullHtmlContent = `
                        <div class="article-body">
                            ${aiData.content}

                            <h3>Questions Fréquentes à ${city}</h3>
                            <div class="space-y-4 my-8">
                                ${aiData.faq.map((f: any) => `
                                    <div class="border rounded-lg p-4 bg-white shadow-sm">
                                        <strong class="block text-lg mb-2 text-slate-800">${f.q}</strong>
                                        <p class="text-slate-600">${f.r}</p>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="mt-12 p-8 bg-slate-900 text-white rounded-2xl text-center shadow-xl">
                                <h3 class="text-2xl font-bold mb-4">Un projet de ${keyword} à ${city} ?</h3>
                                <p class="mb-8 text-slate-300">Ne laissez rien au hasard. L'installation doit être réalisée par un frigoriste qualifié RGE pour garantir vos économies et votre santé. Recevez jusqu'à 3 devis gratuits et comparez.</p>
                                <a href="/trouver-installateur?city=${encodeURIComponent(city)}" class="inline-block bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105">
                                    Demander mon Devits Gratuit à ${city}
                                </a>
                            </div>
                        </div>
                    `;

                    // Generate a well optimized title
                    const title = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} à ${city} : Installation, Entretien et Devis`;

                    // Generate dynamic SEO Alt-text
                    const altText = `${keyword} à ${city} - Installation par un professionnel agréé RGE`;

                    await prisma.article.create({
                        data: {
                            title,
                            slug,
                            introduction: aiData.intro,
                            content: fullHtmlContent,
                            expertId: expert.id,
                            targetCity: city,
                            status: 'PUBLISHED',
                            metaDesc: aiData.intro.substring(0, 155) + "...",
                            mainImage: articleImage(keyword, city),
                            altText: altText,
                            faq: aiData.faq
                        }
                    });

                    console.log(`>> Success: [${slug}]`);
                    count++;
                } catch (error) {
                    console.error(`>> Failed to generate or insert [${slug}]:`, error);
                }
            } else {
                console.log(`Skipping [${slug}], already exists.`);
            }
        }
    }

    console.log(`\nDONE. ${count} New Unique Articles generated via OpenAI.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
