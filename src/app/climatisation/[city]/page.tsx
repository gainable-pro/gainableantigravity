import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { CITIES_MEDIUM } from "@/data/cities-medium";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, MapPin, ShieldCheck, Star, Wrench, HelpCircle, Info, Timer, Euro } from "lucide-react";
import { ContactWizard } from "@/components/features/contact/contact-wizard";
import { prisma } from "@/lib/prisma";
import { InternationalLeadForm } from "@/components/features/contact/forms/international-form";
import fs from 'fs';
import path from 'path';
import { InternalLinking } from "@/components/features/seo/internal-linking";

// Force SSG for these pages
export const dynamic = 'force-static';
export const revalidate = 3600;

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED, ...CITIES_MEDIUM];

interface PageProps {
    params: Promise<{
        city: string;
    }>;
}

// 1. Generate Static Params for SSG - We only pre-build the top 100 cities to avoid Prisma pool timeouts during Vercel build.
// The other 2,000+ cities will be generated lazily on-demand (ISR) upon first visit.
export async function generateStaticParams() {
    return CITIES_100.map((city) => ({
        city: city.slug,
    }));
}

// Deterministic Pseudo-Random Generator based on Slug
function simpleHash(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function pick<T>(seed: number, arr: T[], offset = 0): T {
    return arr[(seed + offset) % arr.length];
}

// 2. SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = ALL_CITIES.find(c => c.slug === citySlug);

    if (!city) return {};

    const seed = simpleHash(citySlug);

    // Optimized CTR Titles (Using brackets and strong action words)
    const titleChoices = [
        `【Devis Gratuit】 Climatisation à ${city.name} | Prix & Artisans RGE`,
        `Climatisation Réversible & Clim à ${city.name} (${city.zip}) ⚡`,
        `Installation Climatisation Gainable à ${city.name} | [Tarifs 2026]`,
        `Pose Pompe à Chaleur & Climatisation à ${city.name} | Devis`
    ];

    const descChoices = [
        `▶ Besoin d'une climatisation à ${city.name} (${city.zip}) ? Gainable.fr est le réseau n°1. Contactez un installateur expert RGE local et obtenez un devis gratuit !`,
        `▶ Installation de climatisation à ${city.name} (${city.zip}) : Devis gratuit en 48h. Comparez les tarifs de nos installateurs et frigoristes certifiés RGE.`,
        `▶ Trouvez le meilleur installateur de climatisation à ${city.name} (${city.zip}). Comparez les prix de pose pour climatiseur gainable et pompe à chaleur réversible.`
    ];

    return {
        title: pick(seed, titleChoices, 0),
        description: pick(seed, descChoices, 0),
        alternates: {
            canonical: `https://www.gainable.fr/climatisation/${city.slug}`,
        },
        openGraph: {
            title: `Installateur Climatisation à ${city.name}`,
            description: `Le réseau national des experts du froid. Trouvez les meilleurs artisans locaux à ${city.name}.`,
            url: `https://www.gainable.fr/climatisation/${city.slug}`,
            type: 'website',
            images: ['/hero-villa.png'],
        }
    };
}

import { B2bCaptureBanner } from "@/components/features/b2b-capture-banner";

function getNearbyCities(currentCity: typeof ALL_CITIES[0]) {
    return ALL_CITIES
        .filter(c => c.slug !== currentCity.slug && (c.department === currentCity.department || c.region === currentCity.region))
        .slice(0, 6);
}

// 4. Page Component
export default async function CityPage({ params }: PageProps) {
    const { city: citySlug } = await params;
    const city = ALL_CITIES.find(c => c.slug === citySlug);

    if (!city) {
        notFound();
    }

    const seed = simpleHash(city.slug);

    const isInternational = city.country && city.country !== 'FR';
    const isMorocco = city.country === 'MA';
    const isSwitzerland = city.country === 'CH';

    let currency = '€';
    let priceMultiplier = 1;

    if (isMorocco) {
        currency = 'MAD';
        priceMultiplier = 10 * 0.7;
    } else if (isSwitzerland) {
        currency = 'CHF';
        priceMultiplier = 1.6;
    }

    const priceMinRaw = 12000 * city.priceIndex * priceMultiplier;
    const priceMaxRaw = 18000 * city.priceIndex * priceMultiplier;

    const roundTo = isMorocco ? 1000 : 100;
    const priceMin = Math.round(priceMinRaw / roundTo) * roundTo;
    const priceMax = Math.round(priceMaxRaw / roundTo) * roundTo;

    const priceMinStr = priceMin.toLocaleString('fr-FR');
    const priceMaxStr = priceMax.toLocaleString('fr-FR');

    // Pricing table estimates based on local price index
    const priceMonoMin = Math.round((1500 * city.priceIndex * priceMultiplier) / 100) * 100;
    const priceMonoMax = Math.round((3000 * city.priceIndex * priceMultiplier) / 100) * 100;
    const priceMultiMin = Math.round((3500 * city.priceIndex * priceMultiplier) / 100) * 100;
    const priceMultiMax = Math.round((6500 * city.priceIndex * priceMultiplier) / 100) * 100;
    const priceGainableMin = priceMin;
    const priceGainableMax = priceMax;
    const priceAirzoneMin = Math.round((priceMin * 1.25) / 100) * 100;
    const priceAirzoneMax = Math.round((priceMax * 1.25) / 100) * 100;

    // ** SPINTAX ENGINE FOR UNIQUE TEXT **
    const heroH1 = pick(seed, [
        `Climatisation & Clim Réversible \n<span class="text-[#D59B2B]">à ${city.name} (${city.zip})</span>`,
        `Installation de Climatisation \n<span class="text-[#D59B2B]">à ${city.name}</span>`,
        `Spécialistes Climatisation Gainable \n<span class="text-[#D59B2B]">à ${city.name}</span>`,
        `Votre Pompe à Chaleur Réversible \n<span class="text-[#D59B2B]">à ${city.name}</span>`
    ], 1);

    // Block 1: Installateur de climatisation Choices
    const installerChoices = [
        `Trouver le bon <strong>installateur de climatisation à ${city.name}</strong> est essentiel pour garantir la durabilité de votre équipement. Notre réseau d'artisans locaux certifiés RGE QualiPAC ou qualifiés CVC à ${city.name} assure une étude de dimensionnement thermique rigoureuse avant toute pose. Que vous soyez dans le centre historique ou dans les secteurs résidentiels, faire appel à un <strong>technicien frigoriste qualifié à ${city.name}</strong> vous garantit une installation conforme aux normes environnementales et éligible aux aides de l'État.`,
        `La pose d'une <strong>climatisation à ${city.name}</strong> nécessite une habilitation à la manipulation des fluides frigorigènes. C'est pourquoi nous sélectionnons uniquement des entreprises locales disposant d'assurances décennales solides et de certifications officielles. Un <strong>installateur qualifié à ${city.name}</strong> saura évaluer l'isolation de votre maison ou appartement afin de vous proposer l'équipement idéal sans surdimensionnement inutile.`,
        `Faire appel à un <strong>professionnel RGE à ${city.name}</strong> pour vos travaux de génie climatique est le gage d'un travail soigné. De l'emplacement de l'unité extérieure pour limiter les nuisances sonores jusqu'à la mise en service réglementaire, nos partenaires locaux spécialisés en <strong>climatisation réversible à ${city.name}</strong> gèrent l'intégralité du chantier de manière sereine et transparente.`
    ];

    // Block 2: Prix / Budget Choices
    const pricingChoices = [
        `Le <strong>prix d'une climatisation à ${city.name}</strong> dépend principalement de la puissance nécessaire (exprimée en BTU ou kW) et du type de diffuseurs. Pour une pièce unique (mono-split), comptez généralement entre 1 500 € et 3 000 € matériel et pose inclus. Pour équiper une maison complète à ${city.name}, les tarifs varient selon le nombre de pièces (multi-split ou gainable centralisé). Le coût de la main d'œuvre locale fluctue en fonction de la complexité du réseau électrique et du passage des liaisons frigorifiques.`,
        `Budgétiser son projet de confort thermique à ${city.name} passe par une comparaison objective des tarifs. Un <strong>système gainable réversible à ${city.name}</strong> représente un investissement initial plus important qu'un split mural classique, mais valorise fortement votre patrimoine immobilier. L'indice de prix local et le coût moyen des fournitures influencent le montant final de votre <strong>devis climatisation à ${city.name}</strong>, qu'il s'agisse de rénovation ou de neuf.`,
        `Quel budget prévoir pour climatiser ou chauffer son logement à ${city.name} ? Outre le matériel, les coûts d'installation par un professionnel habilité intègrent l'équilibrage des réseaux de ventilation et la pose des supports antivibratiles. Obtenir un <strong>devis gratuit à ${city.name}</strong> permet de comparer sereinement les prix des marques leaders comme Daikin, Mitsubishi Electric et Heiwa.`
    ];

    // Block 3: PAC Choices
    const pacChoices = [
        `Une <strong>pompe à chaleur réversible à ${city.name}</strong> (PAC air-air ou air-eau) est la solution thermodynamique par excellence pour faire des économies d'énergie. En captant les calories gratuites de l'air extérieur, elle restitue jusqu'à 4 fois plus d'énergie qu'elle n'en consomme (rendement SCOP > 4). C'est un excellent moyen de remplacer vos anciens radiateurs énergivores à ${city.name} tout en profitant d'un confort optimal en été comme en hiver.`,
        `À ${city.name}, la transition vers des systèmes de chauffage plus durables est encouragée. La <strong>pompe à chaleur réversible à ${city.name}</strong> s'adapte parfaitement aux variations climatiques de la région de ${city.region}. En mode chauffage, elle garantit un apport thermique régulier même par grand froid, tandis que son mode climatisation rafraîchit agréablement votre intérieur pendant les fortes chaleurs estivales à ${city.name}.`,
        `Investir dans une <strong>PAC réversible à ${city.name}</strong> permet de diviser ses factures de chauffage par trois. Ce système écologique réduit considérablement l'empreinte carbone de votre habitation. Nos installateurs certifiés à ${city.name} vous accompagnent dans le choix de la technologie (inverter, bi-bloc) et l'optimisation des réglages pour un confort constant.`
    ];

    // Block 4: Gainable Choices
    const gainableChoices = [
        `La <strong>climatisation gainable à ${city.name}</strong> est le choix premium pour les villas et appartements recherchant un confort invisible. Intégrée dans les combles ou les faux-plafonds, elle diffuse l'air par de fines grilles linéaires ultra-discrètes. Couplée à un <strong>système intelligent (type Airzone) à ${city.name}</strong>, elle permet de piloter la température de chaque pièce de votre logement de manière indépendante, maximisant ainsi le confort et les économies.`,
        `Vous souhaitez éviter les unités intérieures disgracieuses sur vos murs à {city.name} ? Le <strong>gainable réversible à ${city.name}</strong> est la réponse idéale. Son fonctionnement est d'un silence absolu puisque l'unité intérieure principale est déportée dans des espaces non habités. Nos frigoristes certifiés à ${city.name} réalisent le réseau de gaines isolées sur-mesure pour un débit d'air doux et sans aucun courant d'air direct.`,
        `Le <strong>gainable à ${city.name}</strong> s'impose dans les projets de construction et de rénovation haut de gamme. Sa conception technique requiert un véritable savoir-faire pour équilibrer les débits d'air soufflé et repris. Confier son projet de climatisation invisible à un expert qualifié à ${city.name} garantit un système silencieux, performant et parfaitement intégré.`
    ];

    const contentInstaller = pick(seed, installerChoices, 3);
    const contentPricing = pick(seed, pricingChoices, 4);
    const contentPac = pick(seed, pacChoices, 5);
    const contentGainable = pick(seed, gainableChoices, 6);

    // Schema.org
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": `Installation Climatisation Gainable à ${city.name}`,
                "provider": {
                    "@type": "Organization",
                    "name": "Gainable.fr",
                    "url": "https://www.gainable.fr"
                },
                "areaServed": {
                    "@type": "City",
                    "name": city.name
                },
                "description": `Installation, entretien et dépannage de climatisation réversible gainable à ${city.name}.`,
                "offers": {
                    "@type": "Offer",
                    "priceCurrency": "EUR",
                    "price": priceMin.toString(),
                    "priceValidUntil": "2026-12-31",
                    "availability": "https://schema.org/InStock"
                }
            }
        ]
    };

    const [localExperts, totalDeptExperts, globalExpertsCount] = await Promise.all([
        prisma.expert.findMany({
            where: {
                status: 'active',
                OR: [
                    { ville: { contains: city.name, mode: 'insensitive' } },
                    { code_postal: { startsWith: city.department } }
                ]
            },
            take: 3,
            select: { id: true, nom_entreprise: true, ville: true, logo_url: true, slug: true, expert_type: true, certifications: { select: { value: true } } }
        }),
        prisma.expert.count({
            where: { status: 'active', code_postal: { startsWith: city.department } }
        }),
        prisma.expert.count({
            where: { status: 'active' }
        })
    ]);

    const relatedArticles = await prisma.article.findMany({
        where: { status: 'PUBLISHED', title: { contains: city.name, mode: 'insensitive' } },
        take: 3,
        select: { id: true, title: true, slug: true, mainImage: true, introduction: true, expert: { select: { slug: true } } }
    });

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://www.gainable.fr" },
            { "@type": "ListItem", "position": 2, "name": "Climatisation", "item": "https://www.gainable.fr/climatisation" },
            { "@type": "ListItem", "position": 3, "name": `Climatisation ${city.name}`, "item": `https://www.gainable.fr/climatisation/${city.slug}` }
        ]
    };

    const nearbyCities = getNearbyCities(city);
    const cityImagePath = path.join(process.cwd(), 'public', 'city-images', `${city.slug}.jpg`);
    const hasCityImage = fs.existsSync(cityImagePath);

    const heroImage = hasCityImage ? `/city-images/${city.slug}.jpg` : (
        city.housingType === 'urbain-dense' ? '/city-images/template-urban.jpg' :
            city.climateZone === 'mediterranean' ? '/city-images/template-villa.jpg' :
                city.housingType === 'historique' ? '/city-images/template-historic.jpg' :
                    city.climateZone === 'mountain' ? '/city-images/template-mountain.jpg' :
                        '/hero-villa.png'
    );

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }} />

            <section className="relative h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image src={heroImage} alt={`Climatisation à ${city.name}`} fill className="object-cover" priority sizes="100vw" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-white font-medium text-sm mb-6 border border-white/30">
                        {city.department} • {city.region}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 font-montserrat tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: heroH1 }}></h1>
                    <p className="text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        {pick(seed, [
                            "Dites adieu aux unités apparentes.",
                            "Le confort thermique intégral 4 saisons.",
                            "Technologie d'avenir pour votre bien.",
                            "La solution invisible et silencieuse."
                        ], 6)} {city.catchphrase}.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-14 px-10 text-lg rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform animate-in fade-in zoom-in duration-500">
                            <Link href="/">
                                Trouver un expert à {city.name}
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-200 font-medium">
                        <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#D59B2B]" /> Devis Gratuits</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#D59B2B]" /> Experts Vérifiés</span>
                    </div>
                </div>
            </section>

            <div className="border-b border-slate-200 bg-white shadow-sm relative z-20">
                <div className="container mx-auto px-6 py-4">
                    <nav className="flex text-sm text-slate-500">
                        <Link href="/" className="hover:text-[#D59B2B] transition-colors">Accueil</Link>
                        <span className="mx-2">/</span>
                        <Link href="/climatisation" className="hover:text-[#D59B2B] transition-colors">Climatisation</Link>
                        <span className="mx-2">/</span>
                        <span className="text-slate-800 font-semibold text-[#D59B2B]">{city.name}</span>
                    </nav>
                </div>
            </div>

            {localExperts.length > 0 ? (
                <section className="py-16 bg-white border-b border-slate-100">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">Installateurs recommandés à {city.name}</h2>
                            <p className="text-slate-500">Sélectionnés pour leur expertise et leur proximité.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {localExperts.map(expert => (
                                <Link key={expert.id} href={`/pro/${expert.slug}`} className="group h-full">
                                    <div className="border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-[#D59B2B]/30 transition-all bg-white h-full flex flex-col items-center text-center group-hover:-translate-y-1">
                                        <div className="w-24 h-24 relative mb-6 p-2 border border-slate-100 rounded-full bg-slate-50">
                                            {expert.logo_url ? (
                                                <img src={expert.logo_url} alt={expert.nom_entreprise} className="object-contain w-full h-full rounded-full" />
                                            ) : (
                                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center"><ShieldCheck className="w-10 h-10 text-slate-300" /></div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-[#1F2D3D] text-xl mb-2 group-hover:text-[#D59B2B] transition-colors">{expert.nom_entreprise}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mb-4 bg-slate-50 px-3 py-1 rounded-full"><MapPin className="w-3 h-3 text-[#D59B2B]" /> {expert.ville}</p>
                                        <div className="mt-auto w-full"><Button variant="outline" className="w-full rounded-xl group-hover:bg-[#1F2D3D] group-hover:text-white transition-colors">Voir le profil</Button></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                <section className="py-20 bg-white border-b border-slate-100">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden text-center">
                            <div className="relative z-10">
                                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D59B2B]/10 text-[#D59B2B] mb-6">
                                    <Star className="w-8 h-8 fill-current" />
                                </span>
                                <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">Trouvez les meilleurs installateurs à {city.name}</h2>
                                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    Nous avons sélectionné des installateurs de climatisation confirmés intervenant dans le secteur de {city.department}. Comparez leurs offres gratuitement.
                                </p>
                                <div className="flex justify-center mt-8">
                                    <div className="w-full max-w-2xl text-left">
                                        <InternationalLeadForm city={city.name} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                        <div className="p-4 md:p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="text-3xl md:text-4xl font-extrabold text-[#D59B2B] mb-2">{totalDeptExperts > 0 ? totalDeptExperts : (globalExpertsCount > 50 ? "50+" : globalExpertsCount)}</div>
                            <div className="text-[10px] md:text-sm text-slate-300 font-medium uppercase tracking-wider">{totalDeptExperts > 0 ? "Installateurs Locaux" : "Experts Partenaires"}</div>
                        </div>
                        <div className="p-4 md:p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="text-3xl md:text-4xl font-extrabold text-[#D59B2B] mb-2">{priceMinStr} {currency}</div>
                            <div className="text-[10px] md:text-sm text-slate-300 font-medium uppercase tracking-wider">Prix estimé (Min)</div>
                        </div>
                        <div className="p-4 md:p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="text-3xl md:text-4xl font-extrabold text-[#D59B2B] mb-2">48h</div>
                            <div className="text-[10px] md:text-sm text-slate-300 font-medium uppercase tracking-wider">Délai moyen</div>
                        </div>
                        <div className="p-4 md:p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <div className="text-3xl md:text-4xl font-extrabold text-[#D59B2B] mb-2">{city.priceIndex > 1.1 ? 'Forte' : 'Stable'}</div>
                            <div className="text-[10px] md:text-sm text-slate-300 font-medium uppercase tracking-wider">Demande Locale</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* UNIQUE SEO CONTENU SPINTAXÉ ET ENRICHI */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-3 gap-12 items-start">
                        <div className="md:col-span-2 space-y-12">
                            {/* SECTION 1: INSTALLATEUR */}
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4 flex items-center gap-2 font-montserrat">
                                    <Wrench className="w-8 h-8 text-[#D59B2B]" />
                                    Installateur de climatisation à {city.name} : Trouver un pro qualifié
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: contentInstaller }} />
                            </div>

                            {/* SECTION 2: PRIX COMPARATIF */}
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4 flex items-center gap-2 font-montserrat">
                                    <Euro className="w-8 h-8 text-[#D59B2B]" />
                                    Tarif & Prix climatisation à {city.name} : Grille comparative
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: contentPricing }} />
                                
                                {/* HTML Pricing Table */}
                                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white mt-6">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
                                                <th className="p-4">Type de climatiseur</th>
                                                <th className="p-4">Surface conseillée</th>
                                                <th className="p-4 text-right">Budget estimé (Pose incluse)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-600 text-sm">
                                            <tr>
                                                <td className="p-4 font-bold text-slate-800">Climatiseur Mono-split</td>
                                                <td className="p-4">20m² - 50m² (chambre, salon)</td>
                                                <td className="p-4 text-right font-semibold text-[#D59B2B]">{priceMonoMin.toLocaleString('fr-FR')} {currency} - {priceMonoMax.toLocaleString('fr-FR')} {currency}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 font-bold text-slate-800">Climatiseur Multi-split</td>
                                                <td className="p-4">60m² - 90m² (2 à 4 pièces)</td>
                                                <td className="p-4 text-right font-semibold text-[#D59B2B]">{priceMultiMin.toLocaleString('fr-FR')} {currency} - {priceMultiMax.toLocaleString('fr-FR')} {currency}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 font-bold text-slate-800">Clim Gainable Standard</td>
                                                <td className="p-4">80m² - 120m² (invisible)</td>
                                                <td className="p-4 text-right font-semibold text-[#D59B2B]">{priceGainableMin.toLocaleString('fr-FR')} {currency} - {priceGainableMax.toLocaleString('fr-FR')} {currency}</td>
                                            </tr>
                                            <tr>
                                                <td className="p-4 font-bold text-slate-800">Clim Gainable Premium (Régulation Airzone)</td>
                                                <td className="p-4">100m² - 150m² (pièce par pièce)</td>
                                                <td className="p-4 text-right font-semibold text-[#D59B2B]">{priceAirzoneMin.toLocaleString('fr-FR')} {currency} - {priceAirzoneMax.toLocaleString('fr-FR')} {currency}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* SECTION 3: POMPE A CHALEUR */}
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4 flex items-center gap-2 font-montserrat">
                                    <Timer className="w-8 h-8 text-[#D59B2B]" />
                                    Pompe à chaleur réversible à {city.name} : Confort & Économies d'énergie
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: contentPac }} />
                            </div>

                            {/* SECTION 4: GAINABLE */}
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4 flex items-center gap-2 font-montserrat">
                                    <ShieldCheck className="w-8 h-8 text-[#D59B2B]" />
                                    Climatisation gainable à {city.name} : La solution intégrée invisible
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: contentGainable }} />
                            </div>
                        </div>

                        {/* SIDEBAR */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden sticky top-24">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D59B2B]/5 rounded-bl-full"></div>
                            <h3 className="text-2xl font-bold text-[#1F2D3D] mb-8 font-montserrat">Comment trouver le bon installateur à {city.name} ?</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                                    <div><h4 className="font-bold text-[#1F2D3D]">Décrivez votre projet</h4><p className="text-sm text-slate-500">Remplissez notre formulaire en 1 minute.</p></div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                                    <div><h4 className="font-bold text-[#1F2D3D]">Comparaison locale</h4><p className="text-sm text-slate-500">Nous cherchons les experts intervenant à {city.name}.</p></div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                                    <div><h4 className="font-bold text-[#1F2D3D]">Recevez vos devis</h4><p className="text-sm text-slate-500">Gratuitement. Comparez et choisissez.</p></div>
                                </li>
                            </ul>
                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <Link href="/trouver-installateur">
                                    <Button className="w-full bg-[#1F2D3D] hover:bg-[#2c3e50] text-white font-bold h-12 rounded-xl">Voir les experts disponibles</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {relatedArticles.length > 0 && (
                <section className="py-16 bg-white border-t border-slate-100">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <h2 className="text-2xl font-bold text-[#1F2D3D] mb-8">Guides et conseils récents à {city.name}</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedArticles.map((article) => (
                                <Link key={article.id} href={`/entreprise/${article.expert.slug}/articles/${article.slug}`} className="group">
                                    <div className="bg-slate-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                                        <div className="h-48 bg-slate-200 relative">
                                            {article.mainImage && <img src={article.mainImage} alt={article.title} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-[#1F2D3D] mb-2 line-clamp-2 group-hover:text-[#D59B2B] transition-colors">{article.title}</h3>
                                            {article.introduction && <p className="text-sm text-slate-500 line-clamp-2 mb-4">{article.introduction}</p>}
                                            <span className="text-xs font-bold text-[#D59B2B] mt-auto">Lire l'article &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="container mx-auto px-6 max-w-5xl">
                <B2bCaptureBanner 
                    cityName={city.name} 
                    department={city.department} 
                    countryCode={city.country} 
                />
            </div>

            <section className="py-16 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold text-[#1F2D3D] mb-10 text-center font-montserrat">Questions fréquentes à {city.name}</h2>
                    <div className="grid gap-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-[#1F2D3D] text-lg mb-2">Quel budget prévoir pour une clim gainable à {city.name} ?</h3>
                            <p className="text-slate-600">Pour une installation complète à {city.name}, comptez entre {priceMin.toLocaleString('fr-FR')}€ et {priceMax.toLocaleString('fr-FR')}€ pour 100m², selon la complexité et les technologies de régulation thermique.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-[#1F2D3D] text-lg mb-2">Faut-il de l'entretien ?</h3>
                            <p className="text-slate-600">Absolument. Un filtre encrassé est la cause n°1 de perte de performance et d'allergies. Un entretien périodique par un technicien agréé à {city.name} est indispensable pour préserver la garantie décennale.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-[#1F2D3D] text-lg mb-2">Quelle est la durée des travaux d'installation à {city.name} ?</h3>
                            <p className="text-slate-600">En moyenne, comptez 1 à 2 jours de travaux pour un split mural classique, et 3 à 5 jours pour un système gainable complet avec passage dans les faux-plafonds dans votre logement à {city.name}.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-[#1F2D3D] text-lg mb-2">Quelles aides financières sont disponibles pour installer une PAC à {city.name} ?</h3>
                            <p className="text-slate-600">Selon vos ressources, vous pouvez prétendre à MaPrimeRénov', aux Certificats d'Économie d'Énergie (CEE), à la TVA réduite et à l'éco-PTZ à {city.name}, à condition que la pose soit effectuée par un installateur certifié RGE.</p>
                        </div>
                    </div>
                </div>
            </section>

            {nearbyCities.length > 0 && (
                <section className="py-16 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-2xl font-bold text-[#1F2D3D] mb-8">Trouver un installateur près de {city.name}</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {nearbyCities.map((c) => (
                                <Link key={c.slug} href={`/climatisation/${c.slug}`}>
                                    <span className="inline-block bg-white px-5 py-3 rounded-full text-slate-600 font-medium border border-slate-200 hover:border-[#D59B2B] hover:text-[#D59B2B] transition-colors shadow-sm">
                                        Climatisation {c.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <InternalLinking
                zipCode={city.zip}
                city={city.name}
            />

            <section className="py-20 bg-[#D59B2B] relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à climatiser votre logement à {city.name} ?</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Recevez jusqu'à 3 devis gratuits d'artisans locaux, rigoureusement sélectionnés.</p>
                    <div className="flex justify-center">
                        {isInternational ? (
                            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-slate-800 text-left"><InternationalLeadForm city={city.name} /></div>
                        ) : (
                            <ContactWizard triggerButton={<Button size="lg" className="bg-white text-[#D59B2B] hover:bg-slate-100 font-bold h-16 px-12 text-xl rounded-full shadow-2xl">Demander mes devis gratuits</Button>} />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
