import { config } from 'dotenv';
config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
import { CITIES_EXTENDED } from '../src/data/cities-extended';
import { CITIES_100 } from '../src/data/cities-100';

const prisma = new PrismaClient();

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

function randomChoice(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

function articleImage(index: number) {
    const images = [
        "/blog/gainable-salon.jpg",
        "/blog/installation-combles.jpg",
        "/blog/bouche-soufflage.jpg",
        "/blog/thermostat-mur.jpg",
        "/blog/groupe-exterieur.jpg",
        "/blog/clim-reversible.jpg",
        "/blog/clim-console.jpg"
    ];
    return images[index % images.length];
}

async function main() {
    console.log(`Starting SPINTAX MASSIVE Generation for ${ALL_CITIES.length} cities...`);

    let expert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Rédaction Gainable.fr" }
    });

    if (!expert) {
        throw new Error("Expert 'Rédaction Gainable.fr' not found. Seed it first.");
    }

    let count = 0;

    for (let c = 0; c < ALL_CITIES.length; c++) {
        const cityObj = ALL_CITIES[c];
        const city = cityObj.name;
        
        for (let k = 0; k < KEYWORDS.length; k++) {
            const keyword = KEYWORDS[k];

            let slug = `${keyword.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')}-${city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')}`;
            slug = slug.replace(/^-|-$/g, '');

            const exists = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug } }
            });

            if (!exists) {
                // Spintax Generation:
                // We use multiple arrays of phrases to construct unique structures.
                
                const title = randomChoice([
                    `Installation de ${keyword} à ${city} : Devis et Expertise`,
                    `${keyword} à ${city} : Votre projet d'installation agréé RGE`,
                    `Spécialiste en ${keyword} à ${city} : Entretien et Pose`,
                    `Tout savoir sur la ${keyword} à ${city} (Prix & Installation)`,
                    `Faire installer une ${keyword} à ${city} : Le guide complet`
                ]);

                const intro = randomChoice([
                    `Vous résidez à ${city} et souhaitez améliorer le confort de votre logement ? L'installation d'une ${keyword} s'impose aujourd'hui comme la référence absolue. Que ce soit pour traverser l'été au frais ou diviser vos factures de chauffage, cette solution thermique répond aux exigences modernes.`,
                    `La recherche d'un confort optimal à ${city} passe de plus en plus par l'adoption d'une ${keyword}. Face aux fluctuations récurrentes des coûts énergétiques, s'équiper d'un tel système permet à la fois de réaliser de substantielles économies et de garantir une température idéale 365 jours par an.`,
                    `S'adapter aux variations climatiques à ${city} est vital. S'équiper en ${keyword} est aujourd'hui une priorité pour de nombreux foyers. Cet article décortique pourquoi cette technologie de pointe s'avère extrêmement rentable et bénéfique pour votre qualité de vie au quotidien.`,
                    `Avez-vous pensé à investir dans une ${keyword} pour votre habitation située à ${city} ? Cette technologie thermodynamique réversible est la clé pour ne plus subir les vagues de froid hivernales ni les canicules estivales, tout en préservant votre portefeuille.`
                ]);

                const h2_sante = randomChoice([
                    `La vérité sur la ${keyword} et la santé`,
                    `Démystification : La clim ne rend pas malade !`,
                    `Qualité d'air et ${keyword} à ${city}`,
                    `Pourquoi la climatisation protège votre santé à ${city}`
                ]);

                const p_sante = randomChoice([
                    `Il est impératif de tordre le cou aux idées reçues : non, la climatisation ne rend absolument pas malade. Les désagréments de santé surviennent <strong>uniquement</strong> en cas de manque flagrant d'entretien. L'encrassement des filtres est le vrai coupable. C'est pourquoi un entretien régulier est aujourd'hui une obligation stricte, vous assurant un souffle d'air parfaitement sain à ${city}.`,
                    `Contrairement aux vieux mythes, une ${keyword} correctement installée ne vous rendra jamais malade. L'unique cause des maux de gorge liés à la climatisation vient du manque d'entretien annuel indispensable. Des filtres négligés deviennent des nids à poussière. Heureusement, avec une maintenance certifiée, votre intérieur à ${city} restera immaculé.`,
                    `Oubliez les légendes urbaines ! La climatisation est en réalité bonne pour votre santé, à condition d'être entretenue. Le fameux "coup de froid" ou les allergies proviennent d'un défaut manifeste de nettoyage des filtres, pas de la machine elle-même. Obligatoire et encadré, un passage annuel d'un professionnel à ${city} suffit à garantir votre tranquillité.`
                ]);

                const p_ioniseur = randomChoice([
                    `De nos jours, les modèles haut de gamme de ${keyword} vont bien plus loin. Ils embarquent des systèmes intégrés dignes des meilleurs purificateurs, comme la technologie à ioniseur plasma. Ce dispositif bombarde activement l'air ambiant et détruit jusqu'à 99% des microbes, virus et bactéries. L'air de votre salon à ${city} n'aura jamais été aussi pur.`,
                    `Il faut savoir que la majorité des ${keyword} premium intègrent aujourd'hui des générateurs d'ions plasma (technologies type nanoe™ X ou équivalent). Ces innovations de rupture ont un effet spectaculaire : la destruction avérée de près de 99% des virus, bactéries et mauvaises odeurs flottant dans l'air. Vous avez ainsi une véritable clinique à domicile à ${city}.`,
                    `En prime, investir dans une ${keyword} moderne vous offre un fabuleux bouclier sanitaire. Riches de solutions comme les filtres à ionisation plasma, ces générateurs détruisent littéralement 99% de la charge microbienne (virus, spores, bactéries). À ${city}, c'est une barrière infaillible pour protéger l'ensemble de votre foyer, notamment les personnes asthmatiques.`
                ]);

                const h2_eco = randomChoice([
                    `Performances et Économies garanties`,
                    `Face à la hausse de l'énergie : La solution thermodynamique`,
                    `Pourquoi investir dans ce système est hyper rentable`,
                    `Divisez par 3 votre facture énergétique à ${city}`
                ]);

                const p_eco = randomChoice([
                    `Avec la hausse interminable des prix de l'électricité et du gaz, opter pour la technologie thermodynamique est un acte de survie financière. Les machines actuelles affichent un SCOP souvent supérieur à 4, signifiant que pour 1 kW payé, l'appareil vous en restitue 4. C'est une rentabilité colossale pour affronter l'hiver à ${city}.`,
                    `Les tensions géopolitiques propulsant les factures à la hausse n'auront plus d'impact sur votre foyer. Le haut rendement énergétique d'une ${keyword} permet d'utiliser les calories gratuites dans l'air. Affichant un SCOP dépassant souvent 4.0, elle transforme 1 kilowattheure en 4 kilowattheures de chaleur, optimisant dramatiquement votre chauffage à ${city}.`
                ]);
                
                const p_airzone = randomChoice([
                    `Pour aller plus loin, nous conseillons massivement le couplage avec un système intelligent comme AirZone. Ce zonage pièce par pièce évite la surconsommation en ne chauffant que les espaces habités, avec une précision au demi-degré près.`,
                    `En couplant votre dispositif à des solutions domotiques de type AirZone, vous régulez chaque chambre ou salon de façon totalement indépendante. Le pilotage tarifaire de votre confort s'en trouve sublimé, stoppant immédiatement le gaspillage involontaire.`
                ]);

                const h2_froid = randomChoice([
                    `Prêt pour l'hiver : La révolution Hyper Heating`,
                    `Un confort absolu même lors des grands froids`,
                    `Performante jusqu'à -25°C sans aucune résistance électrique`,
                    `Technologie Grand Froid : Essentielle à ${city}`
                ]);

                const p_froid = randomChoice([
                    `Pour les hivers particulièrement rudes à ${city}, le type d'équipement est crucial. La révolution technologique actuelle est marquée par la gamme Hyper Heating (ou Grand Froid). Ces unités externes surpuissantes continuent de délivrer 100% de leur puissance calorifique même lorsque le mercure dégringole à -15°C ou -25°C. Les gouffres financiers des appoints électriques (résistances) sont de l'histoire ancienne.`,
                    `La peur de manquer de chaleur par -15°C est révolue. Assurez-vous d'adopter des séries labellisées Hyper Heating ou "Performance Hivernale" si votre zone gèle violemment. Ces compresseurs à injection flash contournent efficacement le froid nordique, conservant leur pleine puissance nominale sans requérir la moindre bougie d'appoint. Un gage de sécurité thermique absolu à ${city}.`
                ]);

                const htmlContent = `
                    <p class="lead">${intro}</p>
                    
                    <h2>${h2_eco}</h2>
                    <p>${p_eco}</p>
                    <p>${p_airzone}</p>
                    
                    <div class="bg-blue-50 p-6 rounded-xl my-8 border-l-4 border-blue-600">
                        <p class="font-bold text-blue-900 mb-2">Notre Recommandation</p>
                        <p class="text-blue-800">
                            Pour garantir de telles performances de votre ${keyword}, <strong>exigez un artisan habilité manipulation des fluides et labellisé RGE</strong>.
                        </p>
                    </div>

                    <h2>${h2_sante}</h2>
                    <p>${p_sante}</p>
                    <p><strong>Mais ce n'est pas tout !</strong> ${p_ioniseur}</p>

                    <h2>${h2_froid}</h2>
                    <p>${p_froid}</p>

                    <div class="mt-12 p-8 bg-slate-900 text-white rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all">
                        <h3 class="text-2xl font-bold mb-4">Besoin d'un chiffrage précis à ${city} ?</h3>
                        <p class="mb-8 text-slate-300">Qu'il s'agisse d'un premier équipement ou d'un remplacement, comparez facilement les frigoristes triés sur le volet dans votre région.</p>
                        <a href="/trouver-installateur?city=${encodeURIComponent(city)}" class="inline-block bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105">
                            Recevoir 3 Devis Gratuits pour ma ${keyword}
                        </a>
                    </div>
                `;

                const altText = `${keyword} à ${city} - La solution saine pour détruire les microbes - Installation Pro RGE`;

                // FAQ Spintaxed slightly
                const faq = [
                    { 
                        q: `Combien coûte l'entretien de ma ${keyword} à ${city} ?`, 
                        r: `L'entretien annuel obligatoire (fortement recommandé pour éviter toute problématique de santé liée aux filtres ou aux microbes) se facture en général entre 120€ et 200€ par un professionnel local.` 
                    },
                    { 
                        q: `Est-il vrai que la climatisation diffuse des maladies ?`, 
                        r: `Totalement faux ! Une machine bien entretenue purifie votre air. Les modèles premium détruisent 99% des virus grâce aux technologies ioniseur plasma.` 
                    },
                    { 
                        q: `La pompe à chaleur est-elle suffisante sans chauffage d'appoint l'hiver ?`, 
                        r: `Absolument. En privilégiant les modèles Hyper Heating (spécial grand froid), vous profitez de 100% de la puissance de chauffage de votre ${keyword} même par -15°C ou -25°C, garantissant économies et respect de l'environnement.` 
                    }
                ];

                await prisma.article.create({
                    data: {
                        title: title,
                        slug: slug,
                        introduction: intro,
                        content: htmlContent,
                        expertId: expert.id,
                        targetCity: city,
                        status: 'PUBLISHED',
                        metaDesc: intro.substring(0, 155) + "...",
                        mainImage: articleImage(count),
                        altText: altText,
                        faq: faq
                    }
                });
                
                process.stdout.write(".");
                count++;
            }
        }
    }
    console.log(`\nDONE. ${count} Articles SPINTAX générés.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
