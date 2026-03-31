import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import { CITIES_EXTENDED } from '../src/data/cities-extended';
import { CITIES_100 } from '../src/data/cities-100';

const prisma = new PrismaClient();

// Aggregate all cities
const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED];

// Mots-clés définis par l'utilisateur
const KEYWORDS = [
    { key: "climatisation réversible", type: "GENERAL" },
    { key: "climatisation gainable", type: "GAINABLE" }, // Le classique
    { key: "console murale", type: "CONSOLE" },
    { key: "climatisation split", type: "SPLIT" },
    { key: "climatisation cassette", type: "CASSETTE" },
    { key: "VRV", type: "VRV" },
    { key: "gainable à eau glacée", type: "EAU_GLACEE" },
    { key: "pompe à chaleur air/air", type: "PAC" }
];

// Thèmes (Templates) définis par l'utilisateur pour varier les articles
const THEMATIC_TEMPLATES = [
    {
        id: "ECONOMIES",
        title: "{KEYWORD} à {CITY} : La solution face à la hausse des prix de l'énergie",
        intro: "Face à l'instabilité géopolitique et à la flambée continue des coûts de l'électricité et du gaz, investir dans une {KEYWORD} à {CITY} n'est plus un luxe mais une nécessité économique. Découvrez comment cet équipement allie confort thermique et réduction draconienne de vos factures.",
        h2_1: "Pourquoi la {KEYWORD} est ultra-rentable aujourd'hui ?",
        content_1: "Les systèmes modernes de {KEYWORD} bénéficient de performances exceptionnelles. Avec un SCOP (Coefficient de Performance Saisonnier) dépassant souvent 4, le système restitue 4 kW de chaleur pour 1 kW d'électricité consommé. À {CITY}, cela se traduit par une division par 3 de votre facture de chauffage hivernal.",
        h2_2: "Le bon investissement pour votre logement à {CITY}",
        content_2: "Oubliez les radiateurs électriques énergivores. La {KEYWORD} capte les calories gratuites dans l'air extérieur. C'est le bouclier énergétique parfait contre les hausses tarifaires annoncées.",
        h2_3: "Régulation AirZone : Le contrôle pièce par pièce",
        content_3: "Pour maximiser vos économies, l'intégration d'un système de zonage comme AirZone est idéale. Vous ne chauffez ou climatisez que les pièces occupées, à la température exacte souhaitée.",
        faq: [
            { q: "Quelles économies réelles sur ma facture à {CITY} ?", r: "Jusqu'à 70% d'économies sur votre budget chauffage par rapport à des convecteurs." },
            { q: "Quel est le retour sur investissement ?", r: "Généralement amorti en 4 à 6 ans selon l'usage." }
        ]
    },
    {
        id: "CONFORT_SANTE",
        title: "{KEYWORD} à {CITY} : Confort absolu et air pur purifié",
        intro: "L'installation d'une {KEYWORD} à {CITY} transforme votre intérieur en un véritable havre de paix. Au-delà d'une température idéale maintenue toute l'année, ces systèmes intègrent désormais des technologies de pointe pour protéger la santé de votre foyer.",
        h2_1: "Est-ce que la climatisation rend malade ?",
        content_1: "C'est une idée reçue ! Une {KEYWORD} bien entretenue ne rend pas malade. Au contraire, elle assainit l'air environnant. Les modèles actuels filtrent les pollens, les poussières et régulent le taux d'humidité, ce qui est extrêmement bénéfique pour les personnes asthmatiques ou allergiques à {CITY}.",
        h2_2: "Technologies Ioniseur, Filtres Plasma et Purificateur d'air",
        content_2: "Les équipements premium de {KEYWORD} intègrent des ioniseurs hautement efficaces (comme le système nanoe™ X). Ces filtres plasma détruisent activement les virus, bactéries et mauvaises odeurs, purifiant l'air ambiant 24h/24.",
        h2_3: "Le silence et le bien-être",
        content_3: "Les nuits caniculaires à {CITY} seront de l'histoire ancienne. Le mode 'Nuit' des unités assure un brassage d'air inaudible, propice à un sommeil réparateur.",
        faq: [
            { q: "À quelle fréquence nettoyer les filtres ?", r: "Il est conseillé de dépoussiérer les filtres de votre {KEYWORD} tous les mois." },
            { q: "Le système protège-t-il des virus saisonniers à {CITY} ?", r: "Oui, les filtres purificateurs d'air avancés capturent jusqu'à 99% des pathogènes." }
        ]
    },
    {
        id: "GRAND_FROID",
        title: "Installation de {KEYWORD} à {CITY} : Prêt pour le froid extrême (Hyper Heating)",
        intro: "Si vous habitez à {CITY} ou dans ses alentours et que les hivers sont rigoureux, votre mode de chauffage doit être infaillible. La {KEYWORD} équipée de la technologie Hyper Heating est la réponse incontournable pour les climats exigeants.",
        h2_1: "Qu'est-ce que la technologie Hyper Heating / Grand Froid ?",
        content_1: "Il s'agit de pompes à chaleur air/air surpuissantes capables de maintenir leur puissance nominale de chauffage même lorsque la température extérieure chute à -15°C, voire -25°C. Un atout majeur pour affronter les hivers à {CITY} sans compromis sur le confort.",
        h2_2: "Fini les appoints électriques",
        content_2: "Contrairement aux systèmes classiques qui perdent en efficacité sous 0°C, une {KEYWORD} taillée pour le grand froid garantit une chaleur douillette et constante, sans dérapage de votre consommation électrique.",
        h2_3: "L'importance de l'installation par un expert",
        content_3: "Le dimensionnement d'une {KEYWORD} 'Grand Froid' nécessite une étude thermique précise. Un installateur qualifié RGE à {CITY} évaluera vos déperditions thermiques pour garantir le bon calibrage de la machine.",
        faq: [
            { q: "Une {KEYWORD} fonctionne-t-elle par -15°C ?", r: "Absolument. La technologie Hyper Heating garantit 100% de la puissance de chauffe à ces températures." },
            { q: "Est-ce bruyant le dégivrage ?", r: "Les cycles de dégivrage sont optimisés et très discrets." }
        ]
    }
];

function articleImage(index: number) {
    const images = [
        "/blog/gainable-salon.jpg",
        "/blog/installation-combles.jpg",
        "/blog/bouche-soufflage.jpg",
        "/blog/thermostat-mur.jpg",
        "/blog/groupe-exterieur.jpg"
    ];
    return images[index % images.length];
}

async function main() {
    console.log("Starting MASSIVE Article Generation...");

    // Expert setup
    let expert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Rédaction Gainable.fr" }
    });

    if (!expert) {
        throw new Error("Expert 'Rédaction Gainable.fr' not found. Run previous seed first.");
    }

    let count = 0;
    
    const TARGET_CITIES = ALL_CITIES; // Toutes réunies

    for (let c = 0; c < TARGET_CITIES.length; c++) {
        const cityObj = TARGET_CITIES[c];
        const city = cityObj.name;
        
        for (let k = 0; k < KEYWORDS.length; k++) {
            const keywordObj = KEYWORDS[k];
            
            // Choose a template deterministically based on city+keyword combo
            const tplIndex = (c + k) % THEMATIC_TEMPLATES.length;
            const tpl = THEMATIC_TEMPLATES[tplIndex];

            const title = tpl.title.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key);
            const intro = tpl.intro.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key);

            let slug = `${keywordObj.key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')}-${city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')}`;
            slug = slug.replace(/^-|-$/g, '');

            const content = `
                <p class="lead">${intro}</p>
                
                <h2>${tpl.h2_1.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_1.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>
                
                <div class="bg-blue-50 p-6 rounded-xl my-8 border-l-4 border-blue-600">
                    <p class="font-bold text-blue-900 mb-2">Le conseil de la rédaction</p>
                    <p class="text-blue-800">
                        Pour l'installation de votre ${keywordObj.key}, nous vous recommandons de <a href="/trouver-installateur" class="underline font-semibold hover:text-blue-600">faire appel à un frigoriste certifié capacitaire</a> sur notre réseau.
                    </p>
                </div>

                <h2>${tpl.h2_2.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_2.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>

                <h2>${tpl.h2_3.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_3.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>

                <h3>Questions Fréquentes</h3>
                <div class="space-y-4">
                    ${tpl.faq.map((f: any) => `
                        <div class="border rounded-lg p-4">
                            <strong class="block text-lg mb-2">${f.q.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</strong>
                            <p class="text-slate-600">${f.r.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-12 p-8 bg-slate-900 text-white rounded-2xl text-center">
                    <h3 className="text-2xl font-bold mb-4">Un projet de ${keywordObj.key} à ${city} ?</h3>
                    <p className="mb-8 text-slate-300">Recevez jusqu'à 3 devis gratuits et comparez les installateurs RGE de votre région.</p>
                    <a href="/trouver-installateur?city=${encodeURIComponent(city)}" class="inline-block bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105">
                        Devis Gratuit ${keywordObj.key}
                    </a>
                </div>
            `;

            // Check if article with same slug exists
            const exists = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug: slug } }
            });

            if (!exists) {
                await prisma.article.create({
                    data: {
                        title,
                        slug,
                        introduction: intro,
                        content,
                        expertId: expert.id,
                        targetCity: city,
                        status: 'PUBLISHED',
                        metaDesc: intro.substring(0, 155) + "...",
                        mainImage: articleImage(tplIndex + k),
                        altText: `${title} - Installation`,
                        faq: tpl.faq
                    }
                });
                process.stdout.write(".");
                count++;
            }
        }
    }

    console.log(`\nDONE. ${count} New Articles generated.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
