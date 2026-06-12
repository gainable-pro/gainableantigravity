import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { CITIES_100 } from '../src/data/cities-100';
import { CITIES_EXTENDED } from '../src/data/cities-extended';
import { CITIES_MEDIUM } from '../src/data/cities-medium';

const prisma = new PrismaClient();

// Aggregate all cities
const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED, ...CITIES_MEDIUM];

// Diagnostics keywords
const DPE_KEYWORDS = [
    { key: "diagnostic DPE", type: "DPE" },
    { key: "diagnostic de performance énergétique", type: "DPE_FULL" },
    { key: "diagnostiqueur immobilier certifié", type: "DIAG_CERTIFIED" },
    { key: "audit énergétique obligatoire", type: "AUDIT_OBLIGATORY" },
    { key: "diagnostics immobiliers obligatoires", type: "DIAG_OBLIGATORY" },
    { key: "tarif diagnostic DPE", type: "DPE_PRICE" },
    { key: "diagnostiqueur immobilier", type: "DIAGNOSTICIAN" }
];

// Bureau d'étude keywords
const BE_KEYWORDS = [
    { key: "bureau d'étude thermique", type: "BE" },
    { key: "étude thermique RE2020", type: "BE_RE2020" },
    { key: "dimensionnement climatisation gainable", type: "BE_DIMENSION" },
    { key: "calcul de déperdition thermique", type: "BE_CALCULATION" },
    { key: "audit thermique pour commerce", type: "BE_COMMERCE" },
    { key: "étude thermique réglementaire", type: "BE_REGULATORY" },
    { key: "bureau d'études thermiques", type: "BE_PLURAL" }
];

// Templates for DPE
const DPE_TEMPLATES = [
    {
        title: "{KEYWORD} à {CITY} : Tout comprendre sur les diagnostics immobiliers obligatoires",
        intro: "Dans le cadre d'une vente, d'une location ou d'un projet de rénovation énergétique globale à {CITY}, la réalisation d'un {KEYWORD} est une étape réglementaire cruciale. Ce document officiel permet d'évaluer avec précision la consommation d'énergie d'un logement et son impact environnemental en termes d'émissions de gaz à effet de serre.",
        h2_1: "Le rôle du diagnostic de performance énergétique (DPE) et les diagnostics obligatoires",
        content_1: "Le DPE classe les logements de A à G. Depuis les récentes réformes, il est opposable et sa méthode de calcul (3CL) s'appuie sur les caractéristiques physiques du bâti (isolation, vitrage, système de chauffage). À {CITY}, lors de toute transaction immobilière, d'autres diagnostics obligatoires doivent l'accompagner selon l'année de construction du bâtiment : le diagnostic amiante, le constat de risque d'exposition au plomb (CREP), l'état des installations intérieures d'électricité et de gaz, ou encore l'état des risques et pollutions (ERP). Notre plateforme référence uniquement des professionnels certifiés garantissant des examens sérieux et sans complaisance.",
        h2_2: "Faire le lien entre DPE et dimensionnement CVC (Climatisation & Chauffage)",
        content_2: "Un bon DPE ne sert pas uniquement à remplir une obligation légale pour la vente ou la location. C'est également un outil technique indispensable avant d'installer un système de chauffage ou de climatisation réversible gainable. En identifiant précisément les déperditions thermiques par la toiture, les murs ou les fenêtres, le rapport de diagnostic permet de calculer la puissance calorifique et frigorifique nécessaire. Un dimensionnement correct évite de surdimensionner la pompe à chaleur (ce qui augmenterait le coût d'achat et réduirait la durée de vie du matériel par des cycles courts) ou de la sous-dimensionner (ce qui entraînerait un inconfort lors des pics de température à {CITY}).",
        h2_3: "Trouver un diagnostiqueur certifié et vérifié à {CITY} sur Gainable.fr",
        content_3: "La plateforme Gainable.fr collabore uniquement avec des diagnostiqueurs immobiliers certifiés par des organismes accrédités (COFRAC) et disposant d'une assurance responsabilité civile professionnelle en cours de validité. Passer par un professionnel vérifié vous garantit une expertise impartiale, protégeant le vendeur de tout recours pour vice caché et offrant à l'acquéreur une vision transparente de sa future facture d'énergie.",
        faq: [
            { q: "Quelles économies réelles sur ma facture à {CITY} ?", r: "Jusqu'à 70% d'économies sur votre budget chauffage par rapport à des convecteurs." },
            { q: "Quel est le tarif d'un diagnostic immobilier à {CITY} ?", r: "Les tarifs varient de 100 € à 300 € selon la surface du logement et les diagnostics requis." }
        ]
    },
    {
        title: "L'importance d'un {KEYWORD} à {CITY} pour optimiser la performance énergétique",
        intro: "Avec le durcissement des normes environnementales et l'interdiction progressive de louer des passoires thermiques (classées F ou G), la réalisation d'un {KEYWORD} à {CITY} est devenue le point de départ incontournable de tout projet d'amélioration de l'habitat.",
        h2_1: "Comprendre l'audit énergétique obligatoire et ses enjeux",
        content_1: "Pour les maisons individuelles ou les bâtiments en monopropriété classés F ou G proposés à la vente, un audit énergétique réglementaire est désormais obligatoire en complément du DPE. Cet audit propose des scénarios de travaux par étapes pour atteindre une classe énergétique performante (classe B ou C). À {CITY}, face aux variations de températures saisonnières, l'audit permet de prioriser les investissements : isolation des combles, remplacement des huisseries, et installation d'équipements CVC à haute efficacité énergétique (comme la climatisation gainable réversible avec régulation Airzone).",
        h2_2: "Le DPE, socle du calcul de déperdition thermique",
        content_2: "La modélisation thermique d'un bâtiment s'appuie directement sur les données recueillies lors du DPE. Les calculs de déperditions de chaleur permettent de concevoir des systèmes de génie climatique sur mesure. Sans ce diagnostic préalable, l'installation d'une pompe à chaleur réversible risque d'être inadaptée au profil thermique de la maison, entraînant une surconsommation électrique importante pendant les périodes de grand froid ou de canicule à {CITY}.",
        h2_3: "Faire appel à un diagnostiqueur certifié par la plateforme",
        content_3: "Faire réaliser ses diagnostics immobiliers par un technicien sélectionné par Gainable.fr vous assure d'obtenir un rapport conforme aux dernières réglementations en vigueur. Nos diagnostiqueurs partenaires disposent de l'ensemble des certifications requises par le ministère de la Transition écologique, vous garantissant des rapports précis pour vos demandes d'aides de l'État (MaPrimeRénov', certificats d'économie d'énergie - CEE).",
        faq: [
            { q: "Quelle est la durée de validité du DPE ?", r: "Le DPE est valable 10 ans, sauf s'il a été réalisé entre 2013 et 2021 (validité réduite ou expirée)." },
            { q: "Quelles sont les aides de l'État pour améliorer mon DPE à {CITY} ?", r: "Vous pouvez bénéficier de MaPrimeRénov', des primes CEE, de l'éco-PTZ et de la TVA réduite à 5.5%." }
        ]
    }
];

// Templates for Bureau d'étude
const BE_TEMPLATES = [
    {
        title: "{KEYWORD} à {CITY} : Pourquoi faire réaliser une étude thermique pour vos projets",
        intro: "Que ce soit pour une construction neuve soumise à la RE2020 ou pour la rénovation d'un bâtiment tertiaire à {CITY}, solliciter un {KEYWORD} indépendant est la garantie d'une conception énergétique performante et d'un dimensionnement idéal des installations de chauffage et climatisation.",
        h2_1: "L'importance absolue du dimensionnement et du calcul de déperdition",
        content_1: "Le calcul précis des déperditions thermiques, pièce par pièce, est une étape obligatoire pour concevoir un système de climatisation gainable ou de pompe à chaleur efficace. Un bureau d'étude thermique indépendant utilise des outils de simulation thermique dynamique (STD) pour modéliser le comportement du bâtiment tout au long de l'année à {CITY}. Cette étude détermine les besoins de chauffage et de rafraîchissement réels, assurant un confort optimal tout en évitant les surcoûts liés à l'achat de machines surdimensionnées.",
        h2_2: "Projets B2B complexes : Commerces, bureaux et centres commerciaux",
        content_2: "Pour les chantiers complexes et de grande envergure, le recours à un bureau d'étude thermique est indispensable. Les locaux commerciaux, restaurants, supermarchés ou bureaux d'entreprises à {CITY} ont des contraintes thermiques spécifiques liées aux apports internes importants (éclairage, ordinateurs, présence humaine, machines) et au taux de renouvellement de l'air obligatoire. Le bureau d'étude conçoit des solutions CVC adaptées (systèmes VRV, gainables haute pression, centrales de traitement d'air) pour garantir un confort de travail optimal et le respect des réglementations de sécurité.",
        h2_3: "Conseil neutre et pré-sélection d'artisans qualifiés",
        content_3: "Un bureau d'étude thermique ne vend pas de matériel, ce qui garantit la neutralité absolue de ses recommandations. Il rédige le cahier des charges techniques et peut pré-sélectionner pour vous les meilleurs artisans qualifiés RGE du réseau Gainable.fr. Cette démarche vous assure que les travaux seront exécutés en parfaite conformité avec les calculs thermiques initiaux, sécurisant ainsi votre investissement commercial.",
        faq: [
            { q: "Pourquoi passer par un bureau d'étude thermique indépendant à {CITY} ?", r: "Pour obtenir des calculs neutres et impartiaux, sans conflit d'intérêt avec la vente du matériel." },
            { q: "Quelles sont les obligations d'étude pour les commerces ?", r: "Les commerces et ERP doivent valider leur conformité aux réglementations de ventilation, d'apport d'air neuf et de sécurité incendie." }
        ]
    },
    {
        title: "Le rôle du {KEYWORD} à {CITY} dans le respect des normes énergétiques RE2020",
        intro: "Depuis l'entrée en vigueur de la Réglementation Environnementale 2020 (RE2020), la conception thermique des bâtiments neufs à {CITY} impose des exigences strictes en matière de décarbonation de l'énergie et de confort d'été.",
        h2_1: "L'étude thermique réglementaire RE2020 pour le dépôt de permis",
        content_1: "Toute nouvelle construction résidentielle ou tertiaire doit faire l'objet d'une attestation de prise en compte de la RE2020 dès le dépôt du permis de construire. Le bureau d'étude thermique calcule les indicateurs clés : le besoin bioclimatique (Bbio), la consommation d'énergie primaire (Cep,nr), l'impact carbone des composants et de l'énergie (Ic), ainsi que le nombre de degrés-heures d'inconfort estival (DH). À {CITY}, avec des étés de plus en plus chauds, l'optimisation du confort d'été par des protections solaires mobiles et une isolation performante est un enjeu majeur validé par l'étude thermique.",
        h2_2: "Dimensionner au plus juste pour réduire les coûts d'exploitation",
        content_2: "Une étude thermique rigoureuse permet de rationaliser les choix constructifs et de dimensionner au plus juste les équipements de génie climatique. En éliminant les incertitudes sur les apports et déperditions de chaleur, le bureau d'études thermiques à {CITY} protège les maîtres d'ouvrages contre les factures d'exploitation excessives et assure un retour sur investissement rapide.",
        h2_3: "Sélectionner le bureau d'études partenaire de Gainable.fr",
        content_3: "En choisissant un bureau d'études thermiques via la plateforme Gainable.fr, vous collaborez avec des ingénieurs thermiciens certifiés et équipés des logiciels réglementaires agréés par le CSTB. Que ce soit pour une attestation de conformité, un audit thermique tertiaire ou la pré-sélection de poseurs qualifiés RGE, nos partenaires vous accompagnent tout au long de votre projet.",
        faq: [
            { q: "Quel est le coût d'une étude thermique RE2020 à {CITY} ?", r: "Le prix varie de 300 € pour une maison individuelle simple à plusieurs milliers d'euros pour du tertiaire complexe." },
            { q: "Le bureau d'études peut-il m'aider à choisir mon installateur RGE ?", r: "Oui, il peut analyser les devis reçus et pré-sélectionner les professionnels les plus qualifiés de notre réseau." }
        ]
    }
];

function getDpeImage(index: number) {
    const images = [
        "/blog/diagnostic-dpe.jpg",
        "/blog/diagnostic-immobilier.jpg",
        "/blog/diagnostic-electricite.jpg",
        "/blog/diagnostic-amiante.jpg"
    ];
    return images[index % images.length];
}

function getBeImage(index: number) {
    const images = [
        "/blog/bureau-etude-thermique.jpg",
        "/blog/etude-thermique-re2020.jpg",
        "/blog/plan-thermique.jpg",
        "/blog/simulation-thermique.jpg"
    ];
    return images[index % images.length];
}

async function main() {
    console.log("Starting massive DPE and Bureau d'étude article generation...");

    // Resolve the platform expert (gainable-fr)
    let expert = await prisma.expert.findFirst({
        where: { slug: "gainable-fr" }
    });

    if (!expert) {
        expert = await prisma.expert.findFirst({
            where: { slug: { contains: "gainable" } }
        }) || await prisma.expert.findFirst({
            where: { status: 'active' }
        });
    }

    if (!expert) {
        throw new Error("No active expert found in the database. Please run seed-local or seed-seo-massive first.");
    }

    console.log(`Using expert: ${expert.nom_entreprise} (ID: ${expert.id}, Slug: ${expert.slug})`);

    let dpeCount = 0;
    let beCount = 0;

    const TARGET_CITIES = ALL_CITIES;
    console.log(`Processing ${TARGET_CITIES.length} cities...`);

    for (let c = 0; c < TARGET_CITIES.length; c++) {
        const cityObj = TARGET_CITIES[c];
        const city = cityObj.name;

        // ==========================================
        // 1. GENERATE DPE ARTICLES
        // ==========================================
        for (let k = 0; k < DPE_KEYWORDS.length; k++) {
            const keywordObj = DPE_KEYWORDS[k];
            const tplIndex = (c + k) % DPE_TEMPLATES.length;
            const tpl = DPE_TEMPLATES[tplIndex];

            const title = tpl.title.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key);
            const intro = tpl.intro.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key);

            let slug = `${slugify(keywordObj.key, { lower: true, strict: true })}-${slugify(city, { lower: true, strict: true })}`;
            slug = slug.substring(0, 80).replace(/^-|-$/g, '');

            const content = `
                <p class="lead">${intro}</p>
                
                <h2>${tpl.h2_1.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_1.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>
                
                <div class="bg-amber-50 p-6 rounded-xl my-8 border-l-4 border-amber-600">
                    <p class="font-bold text-amber-900 mb-2">Conseil de la plateforme</p>
                    <p class="text-amber-800">
                        La réglementation exige des diagnostiqueurs certifiés et indépendants. Sur notre réseau, nous vous aidons à <a href="/trouver-diagnostiqueur?city=${encodeURIComponent(city)}" class="underline font-semibold hover:text-amber-600">entrer en contact avec un diagnostiqueur immobilier certifié de votre région</a>.
                    </p>
                </div>

                <h2>${tpl.h2_2.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_2.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>

                <h2>${tpl.h2_3.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_3.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>

                <h3>Questions Fréquentes sur le diagnostic à ${city}</h3>
                <div class="space-y-4">
                    ${tpl.faq.map((f: any) => `
                        <div class="border rounded-lg p-4 bg-slate-50">
                            <strong class="block text-lg mb-2">${f.q.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</strong>
                            <p class="text-slate-600">${f.r.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-12 p-8 bg-slate-900 text-white rounded-2xl text-center">
                    <h3 class="text-2xl font-bold mb-4">Besoin de Diagnostics Immobiliers à ${city} ?</h3>
                    <p class="mb-8 text-slate-300">Comparez rapidement les tarifs de diagnostiqueurs certifiés et de confiance intervenant dans votre secteur.</p>
                    <a href="/trouver-diagnostiqueur?city=${encodeURIComponent(city)}" class="inline-block bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105">
                        Demander mes Devis Diagnostics à ${city}
                    </a>
                </div>
            `;

            // Unique verify
            const exists = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug } }
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
                        metaDesc: intro.substring(0, 150) + "...",
                        mainImage: getDpeImage(tplIndex + k),
                        altText: `${title} - Diagnostics Obligatoires`,
                        faq: tpl.faq
                    }
                });
                dpeCount++;
            }
        }

        // ==========================================
        // 2. GENERATE BUREAU D'ETUDE ARTICLES
        // ==========================================
        for (let k = 0; k < BE_KEYWORDS.length; k++) {
            const keywordObj = BE_KEYWORDS[k];
            const tplIndex = (c + k) % BE_TEMPLATES.length;
            const tpl = BE_TEMPLATES[tplIndex];

            const title = tpl.title.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key);
            const intro = tpl.intro.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key);

            let slug = `${slugify(keywordObj.key, { lower: true, strict: true })}-${slugify(city, { lower: true, strict: true })}`;
            slug = slug.substring(0, 80).replace(/^-|-$/g, '');

            const content = `
                <p class="lead">${intro}</p>
                
                <h2>${tpl.h2_1.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_1.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>
                
                <div class="bg-blue-50 p-6 rounded-xl my-8 border-l-4 border-blue-600">
                    <p class="font-bold text-blue-900 mb-2">Le conseil de la rédaction</p>
                    <p class="text-blue-800">
                        Pour tout projet complexe ou réglementaire RE2020, nous vous recommandons de <a href="/trouver-bureau-etude?city=${encodeURIComponent(city)}" class="underline font-semibold hover:text-blue-600">faire réaliser une étude thermique neutre par un bureau d'étude qualifié</a> de notre réseau.
                    </p>
                </div>

                <h2>${tpl.h2_2.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_2.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>

                <h2>${tpl.h2_3.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</h2>
                <p>${tpl.content_3.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>

                <h3>Questions Fréquentes sur l'étude thermique à ${city}</h3>
                <div class="space-y-4">
                    ${tpl.faq.map((f: any) => `
                        <div class="border rounded-lg p-4 bg-slate-50">
                            <strong class="block text-lg mb-2">${f.q.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</strong>
                            <p class="text-slate-600">${f.r.replace(/{CITY}/g, city).replace(/{KEYWORD}/g, keywordObj.key)}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-12 p-8 bg-slate-900 text-white rounded-2xl text-center">
                    <h3 class="text-2xl font-bold mb-4">Un projet de construction ou de rénovation à ${city} ?</h3>
                    <p class="mb-8 text-slate-300">Optimisez vos coûts et garantissez le confort thermique de vos bâtiments avec une étude personnalisée.</p>
                    <a href="/trouver-bureau-etude?city=${encodeURIComponent(city)}" class="inline-block bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105">
                        Demander une Étude Thermique à ${city}
                    </a>
                </div>
            `;

            // Unique verify
            const exists = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug } }
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
                        metaDesc: intro.substring(0, 150) + "...",
                        mainImage: getBeImage(tplIndex + k),
                        altText: `${title} - Étude Thermique`,
                        faq: tpl.faq
                    }
                });
                beCount++;
            }
        }

        if (c % 100 === 0 && c > 0) {
            console.log(`Processed ${c} cities... (Generated: ${dpeCount} DPE articles, ${beCount} BE articles)`);
        }
    }

    console.log(`\n==========================================`);
    console.log(`MASSIVE GENERATION COMPLETED SUCCESSFULLY`);
    console.log(`Total DPE articles created: ${dpeCount}`);
    console.log(`Total Bureau d'étude articles created: ${beCount}`);
    console.log(`Total generated articles: ${dpeCount + beCount}`);
    console.log(`==========================================`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
