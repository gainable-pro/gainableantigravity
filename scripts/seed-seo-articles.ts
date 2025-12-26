// @ts-nocheck
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CITIES_FR = [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille",
    "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Aix-en-Provence",
    "Clermont-Ferrand", "Tours", "Amiens", "Metz", "Besançon", "Orléans", "Mulhouse", "Perpignan", "Avignon", "Poitiers",
    "La Rochelle", "Annecy", "Chambéry", "Valence", "Béziers", "Narbonne", "Montauban", "Albi", "Tarbes", "Bayonne"
];

const CITIES_BE = [
    "Bruxelles", "Anvers", "Gand", "Charleroi", "Liège", "Namur", "Mons", "Louvain", "Malines", "Courtrai"
];

const CITIES_CH = [
    "Zurich", "Genève", "Bâle", "Lausanne", "Berne", "Lucerne", "Saint-Gall", "Lugano", "Winterthour", "Fribourg"
];

const CITIES_MA = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Kenitra", "Tétouan"
];

const ALL_CITIES = [
    ...CITIES_FR.map(c => ({ name: c, country: 'France' })),
    ...CITIES_BE.map(c => ({ name: c, country: 'Belgique' })),
    ...CITIES_CH.map(c => ({ name: c, country: 'Suisse' })),
    ...CITIES_MA.map(c => ({ name: c, country: 'Maroc' }))
];

const TEMPLATES = [
    {
        type: "PRICE",
        titleTemplate: "Prix d’une climatisation gainable à {CITY}",
        introTemplate: "Vous envisagez d'installer une climatisation gainable à {CITY} ? Ce système, réputé pour sa discrétion et son confort, représente un investissement important. Comprendre les coûts d'installation, le prix du matériel et les tarifs de main d'œuvre spécifiques à {CITY} est essentiel pour budgétiser votre projet.",
        h2_1: "Quel budget prévoir pour une installation gainable à {CITY} ?",
        content_1: "À {CITY}, le prix d'une installation gainable varie généralement entre 100 et 150 euros par mètre carré chauffé/climatisé. Pour une maison de 100m² typique de la région, comptez entre 10 000 et 15 000 euros tout compris. Ce tarif inclut l'unité extérieure, l'unité intérieure (souvent installée dans les combles ou faux-plafond), le réseau de gaines, les bouches de soufflage, et la main d'œuvre d'un installateur certifié.",
        h2_2: "Les facteurs qui influencent le devis",
        content_2: "Plusieurs critères font varier la facture : la marque du matériel (Daikin, Mitsubishi, Atlantic...), la complexité du réseau de gaines (combles accessibles ou création de faux-plafond), et les options de régulation (Zone Control). À {CITY}, les contraintes d'accès ou de stationnement en centre-ville peuvent aussi impacter légèrement le coût de la main d'œuvre.",
        h2_3: "Pourquoi demander plusieurs devis ?",
        content_3: "Les tarifs des artisans à {CITY} sont libres. Il est crucial de comparer non seulement le prix final, mais aussi la qualité du matériel proposé et les garanties (SAV, entretien).",
        faq: [
            { q: "Quel est le coût d'entretien annuel à {CITY} ?", r: "Comptez entre 150€ et 250€ par an pour un contrat de maintenance complet." },
            { q: "Y a-t-il des aides financières ?", r: "Oui, les certificats d'économies d'énergie (CEE) peuvent financer une partie de l'installation si elle est réalisée par un pro RGE." },
            { q: "Quelle est la durée des travaux ?", r: "Pour une maison standard, l'installation dure entre 3 et 5 jours." }
        ]
    },
    {
        type: "APPARTEMENT",
        titleTemplate: "Climatisation gainable en appartement à {CITY}",
        introTemplate: "Installer une climatisation gainable en appartement à {CITY} est le summum du confort et de l'esthétisme. Cependant, en copropriété, les contraintes techniques et administratives sont nombreuses. Voici tout ce qu'il faut savoir avant de se lancer.",
        h2_1: "Est-ce possible d'installer un gainable en appartement ?",
        content_1: "Oui, mais cela demande de la hauteur sous plafond (environ 20 à 30 cm) pour créer le faux-plafond où passeront l'unité intérieure et les gaines. Dans les immeubles anciens de {CITY}, c'est souvent possible dans les couloirs ou l'entrée pour desservir les chambres et le salon sans perdre de hauteur dans les pièces de vie.",
        h2_2: "L'unité extérieure en copropriété",
        content_2: "C'est souvent le point bloquant à {CITY}. L'unité extérieure doit être posée sur un balcon, une terrasse, ou en façade (plus rare). Vous devez impérativement obtenir l'accord de la copropriété lors d'une Assemblée Générale avant de commencer les travaux. Attention aussi au bruit pour les voisins : choisissez des modèles silencieux.",
        h2_3: "Les avantages du gainable en appartement",
        content_3: "Outre le silence quasi total, le gainable libère vos murs. Plus de split disgracieux au milieu du salon ! C'est une plus-value immobilière certaine pour votre appartement à {CITY}.",
        faq: [
            { q: "Faut-il l'accord du syndic ?", r: "Oui, toujours, dès lors que vous touchez à l'aspect extérieur ou aux parties communes." },
            { q: "Le gainable est-il bruyant ?", r: "Bien installé, c'est le système le plus silencieux du marché (souvent inaudible)." },
            { q: "Peut-on climatiser une seule pièce ?", r: "C'est possible mais le gainable est conçu pour traiter l'ensemble du logement. Pour une pièce, un split est plus rentable." }
        ]
    },
    {
        type: "MAINTENANCE",
        titleTemplate: "Entretien d’une climatisation gainable à {CITY}",
        introTemplate: "Pour garantir la longévité et la performance de votre système gainable à {CITY}, un entretien régulier est indispensable. Un système mal entretenu consomme plus d'électricité et peut dégrader la qualité de l'air intérieur.",
        h2_1: "En quoi consiste l'entretien ?",
        content_1: "L'entretien annuel par un professionnel à {CITY} comprend : le nettoyage et la désinfection de l'unité intérieure (échangeur, bac à condensats), le nettoyage des filtres, la vérification de l'étanchéité du circuit frigorifique (obligatoire pour les systèmes contenant plus de 2kg de fluide), et le contrôle des connexions électriques.",
        h2_2: "Ce que vous pouvez faire vous-même",
        content_2: "Tous les 2 à 3 mois, vous devez nettoyer les filtres de reprise (souvent situés dans le couloir). Aspirez la poussière accumulée. Cela permet de maintenir un bon débit d'air et d'éviter que le moteur ne force. Les bouches de soufflage peuvent aussi être dépoussiérées avec un chiffon humide.",
        h2_3: "Trouver un contrat de maintenance à {CITY}",
        content_3: "La plupart des installateurs proposent des contrats annuels. C'est l'assurance d'être dépanné en priorité en cas de panne en plein été. Vérifiez que l'entreprise possède bien l'attestation de capacité pour manipuler les fluides frigorigènes.",
        faq: [
            { q: "L'entretien est-il obligatoire ?", r: "Le contrôle d'étanchéité est obligatoire pour certaines puissances. L'entretien global est fortement recommandé." },
            { q: "Combien coûte un contrat ?", r: "Entre 150 et 250 euros par an selon les prestations incluses." },
            { q: "Que faire si mon gainable sent mauvais ?", r: "C'est souvent signe de bactéries dans le bac à condensats. Faites intervenir un pro pour une désinfection." }
        ]
    }
];

function articleImage(index) {
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
    console.log("Starting Article Generation (CJS)...");

    // 1. Find ANY user to attach the expert
    const user = await prisma.user.findFirst();
    let targetUserId = user ? user.id : null;

    if (!targetUserId) {
        console.log("Creating new user...");
        const newUser = await prisma.user.create({
            data: {
                email: "redaction@gainable.fr",
                password_hash: "$2b$10$EpRnTzVlqHNP0.fKbX99j.jF0b7X.y0.h0.z0.w0", // dummy
                role: "ADMIN"
            }
        });
        targetUserId = newUser.id;
    }

    // 2. Find/Create Expert
    let expert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Rédaction Gainable.fr" }
    });

    if (!expert) {
        console.log("Creating Admin Expert...");
        // Check if user has expert already
        const existingExpert = await prisma.expert.findUnique({ where: { user_id: targetUserId } });
        if (existingExpert) {
            console.log("User already has expert, reusing it: " + existingExpert.nom_entreprise);
            expert = existingExpert;
        } else {
            expert = await prisma.expert.create({
                data: {
                    user_id: targetUserId,
                    expert_type: 'bureau_detude',
                    nom_entreprise: "Rédaction Gainable.fr",
                    representant_nom: "Admin",
                    representant_prenom: "Rédacteur",
                    description: "Compte officiel.",
                    pays: "France",
                    adresse: "1 Rue de la Paix",
                    ville: "Paris",
                    code_postal: "75000",
                    slug: "redaction-gainable-fr",
                    status: "active"
                }
            });
        }
    }

    console.log(`Expert ID: ${expert.id}`);

    let count = 0;
    for (let i = 0; i < ALL_CITIES.length; i++) {
        const cityObj = ALL_CITIES[i];
        const city = cityObj.name;
        const tplIndex = i % TEMPLATES.length;
        const tpl = TEMPLATES[tplIndex];

        const title = tpl.titleTemplate.replace(/{CITY}/g, city);
        const intro = tpl.introTemplate.replace(/{CITY}/g, city);

        let slug = title.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Ensure uniqueness if slug collision
        const slugSuffix = Math.floor(Math.random() * 1000);
        slug = slug + "-" + slugSuffix;

        const content = `
            <p class="lead">${intro}</p>
            
            <h2>${tpl.h2_1.replace(/{CITY}/g, city)}</h2>
            <p>${tpl.content_1.replace(/{CITY}/g, city)}</p>
            
            <div class="bg-blue-50 p-6 rounded-xl my-8 border-l-4 border-blue-600">
                <p class="font-bold text-blue-900 mb-2">Le conseil de la rédaction</p>
                <p class="text-blue-800">
                    Pour obtenir le meilleur tarif et une installation de qualité, il est recommandé de <a href="/trouver-installateur" class="underline font-semibold hover:text-blue-600">faire appel à un professionnel certifié</a> via notre plateforme.
                </p>
            </div>

            <h2>${tpl.h2_2.replace(/{CITY}/g, city)}</h2>
            <p>${tpl.content_2.replace(/{CITY}/g, city)}</p>

            <h2>${tpl.h2_3.replace(/{CITY}/g, city)}</h2>
            <p>${tpl.content_3.replace(/{CITY}/g, city)}</p>

            <h3>Questions Fréquentes à ${city}</h3>
            <div class="space-y-4">
                ${tpl.faq.map(f => `
                    <div class="border rounded-lg p-4">
                        <strong class="block text-lg mb-2">${f.q.replace(/{CITY}/g, city)}</strong>
                        <p class="text-slate-600">${f.r.replace(/{CITY}/g, city)}</p>
                    </div>
                `).join('')}
            </div>

            <div class="mt-12 p-8 bg-slate-900 text-white rounded-2xl text-center">
                <h3 className="text-2xl font-bold mb-4">Vous cherchez un installateur à ${city} ?</h3>
                <p className="mb-8 text-slate-300">Recevez jusqu'à 3 devis gratuits de professionnels vérifiés dans votre secteur.</p>
                <a href="/trouver-installateur?city=${encodeURIComponent(city)}" class="inline-block bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105">
                    Trouver un installateur à ${city}
                </a>
            </div>
        `;

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
                mainImage: articleImage(tplIndex),
                altText: `${title} - Illustration`,
                faq: tpl.faq
            }
        });
        process.stdout.write(".");
        count++;
    }

    console.log(`\nDONE. ${count} Articles generated.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
