import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, MapPin, ShieldCheck, Star } from "lucide-react";
import { ContactWizard } from "@/components/features/contact/contact-wizard";
import { prisma } from "@/lib/prisma";
import { InternationalLeadForm } from "@/components/features/contact/forms/international-form";
import fs from 'fs';
import path from 'path';

// Force SSG for these pages
export const dynamic = 'force-static';
export const revalidate = 3600;

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED];

interface PageProps {
    params: Promise<{
        city: string;
    }>;
}

// 1. Generate Static Params for SSG - ALL CITIES
export async function generateStaticParams() {
    return ALL_CITIES.map((city) => ({
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

    const titleChoices = [
        `Installation Climatisation Gainable à ${city.name} | Devis Gratuit`,
        `Climatisation Réversible à ${city.name} : Trouvez un Installateur RGE`,
        `Votre Expert en Pompe à Chaleur Gainable à ${city.name} (${city.zip})`,
        `Pose et Dépannage Climatisation à ${city.name} | Prix et Devis`
    ];

    return {
        title: pick(seed, titleChoices, 0),
        description: `Gainable.fr, 1ère plateforme dédiée à la climatisation gainable & VRV. Trouvez un installateur expert certifié et recommandé à ${city.name} (${city.zip}).`,
        alternates: {
            canonical: `https://www.gainable.fr/climatisation/${city.slug}`,
        },
        openGraph: {
            title: `Installateur Climatisation à ${city.name}`,
            description: `1ère plateforme internationale de climatisation. Trouvez les meilleurs experts à ${city.name}.`,
            url: `https://www.gainable.fr/climatisation/${city.slug}`,
            type: 'website',
            images: ['/hero-villa.png'],
        }
    };
}

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

    // ** SPINTAX ENGINE FOR UNIQUE TEXT **
    const heroH1 = pick(seed, [
        `Climatisation Gainable \n<span class="text-[#D59B2B]">à ${city.name} (${city.zip})</span>`,
        `Installation Climatisation \n<span class="text-[#D59B2B]">à ${city.name}</span>`,
        `Trouvez un Installateur \n<span class="text-[#D59B2B]">Gainable à ${city.name}</span>`,
        `Votre Pompe à Chaleur \n<span class="text-[#D59B2B]">Réversible à ${city.name}</span>`
    ], 1);

    const h2Expertise = pick(seed, [
        `Expertise Climatisation à ${city.name}`,
        `Le marché de la pompe à chaleur à ${city.name}`,
        `Pourquoi isoler et climatiser à ${city.name} ?`,
        `Les avantages du Gainable à ${city.name}`
    ], 2);

    const p1Choices = [
        `Adapter son logement aux variations thermiques est devenu primordial à ${city.name}. L'adoption d'un système gainable s'impose comme la solution la plus esthétique et efficace. En encastrant tout le réseau dans vos faux-plafonds, vous libérez l'espace de vos pièces à vivre tout en profitant d'un flux d'air parfaitement maîtrisé.`,
        `À ${city.name}, de nombreux propriétaires décident dorénavant de supprimer leurs vieux radiateurs électriques au profit de la pompe à chaleur gainable. Ce dispositif thermodynamique réversible offre la capacité de chauffer l'hiver avec un rendement record (SCOP > 4) et de rafraîchir l'été de manière totalement silencieuse.`,
        `Si vous vivez à ${city.name}, opter pour cette technologie c'est faire le choix du confort ultime. Terminés les splits blancs disgracieux accrochés aux murs : l'air circule via des canalisations dissimulées sous toiture et ne laisse apparaître que de fines réglettes design. Un avantage majeur pour la valorisation immobilière de votre bien.`
    ];

    const p2Choices = [
        `Côté santé, contrairement aux idées reçues, ce type d'équipement purifie l'air intérieur. L'encrassement des filtres est la seule cause d'inconfort. Toutefois, avec un entretien régulier exigé par la loi, vous respirez à ${city.name} un air assaini, dépourvu d'allergènes ou de bactéries.`,
        `Les systèmes premium que nos artisans installent à ${city.name} intègrent d'ailleurs des filtres nouvelle génération. Certains utilisent la technologie d'ionisation plasma capturant littéralement les particules fines, moisissures et pollens pour un environnement aseptisé, idéal pour les personnes fragiles ou asthmatiques.`,
        `Et avec les hivers rigoureux que l'on peut connaître, n'ayez crainte : les groupes extérieurs certifiés "Grand Froid" ou Hyper Heating garantissent un maintien de la pleine puissance de chauffage jusqu'à -15°C ou même -25°C. Un atout absolu pour votre sérénité hivernale.`
    ];

    const p3Choices = [
        `Mais l'essentiel pour un projet réussi à ${city.name} reste la qualité de la pose. Une étude de dimensionnement stricte (incluant déperditions et isolation) doit être menée par un professionnel RGE, afin d'assurer l'équilibrage des débits sur chaque bouche soufflante.`,
        `Ne laissez rien au hasard : confier votre installation à ${city.name} à un frigoriste vérifié garantit non seulement l'accès aux aides financières gouvernementales, mais vous assure surtout de ne pas subir de surconsommation involontaire liée à un réseau mal conçu.`,
        `Vous pouvez d'ores et déjà prévoir le couplage avec un système intelligent (type Airzone) pour pouvoir piloter la température de chaque chambre de votre habitation à ${city.name} indépendamment depuis votre smartphone, stoppant ainsi tout gaspillage.`
    ];

    const contentP1 = pick(seed, p1Choices, 3);
    const contentP2 = pick(seed, p2Choices, 4);
    const contentP3 = pick(seed, p3Choices, 5);

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
                    "priceCurrency": isMorocco ? "MAD" : "EUR",
                    "price": priceMin.toString(),
                    "priceValidUntil": "2025-12-31",
                    "availability": "https://schema.org/InStock"
                }
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": `Quel est le prix d'une climatisation gainable à ${city.name} ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `À ${city.name}, le prix moyen d'une installation complète varie généralement entre ${priceMinStr} ${currency} et ${priceMaxStr} ${currency}, selon la surface et la complexité du chantier.`
                        }
                    },
                    {
                        "@type": "Question",
                        "name": `Trouve-t-on des installateurs qualifiés à ${city.name} ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Oui, Gainable.fr référence des artisans vérifiés intervenant à ${city.name} et dans la région.`
                        }
                    }
                ]
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
                                    <div className="w-full max-w-lg text-left">
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

            {/* UNIQUE SEO CONTENU SPINTAXÉ */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">{h2Expertise}</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">{contentP1}</p>
                            <p className="text-slate-600 leading-relaxed text-lg">{contentP2}</p>
                            <p className="text-slate-600 leading-relaxed mt-4 text-lg">{contentP3}</p>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D59B2B]/5 rounded-bl-full"></div>
                            <h3 className="text-2xl font-bold text-[#1F2D3D] mb-8">Comment trouver le bon installateur à {city.name} ?</h3>
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

            <section className="py-16 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold text-[#1F2D3D] mb-10 text-center">Questions fréquentes à {city.name}</h2>
                    <div className="grid gap-6">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100"><h3 className="font-bold text-[#1F2D3D] text-lg mb-2">Quel budget prévoir pour une clim gainable à {city.name} ?</h3><p className="text-slate-600">Pour une installation complète à {city.name}, comptez entre {priceMin}€ et {priceMax}€ pour 100m².</p></div>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100"><h3 className="font-bold text-[#1F2D3D] text-lg mb-2">Faut-il de l'entretien ?</h3><p className="text-slate-600">Absolument. Un filtre encrassé est la cause n°1 de perte de performance et d'allergies. Un nettoyage par un pro certifié à {city.name} est indispensable annuellement.</p></div>
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

            <section className="py-20 bg-[#D59B2B] relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à climatiser votre logement à {city.name} ?</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Recevez jusqu'à 3 devis gratuits d'artisans locaux, rigoureusement sélectionnés.</p>
                    <div className="flex justify-center">
                        {isInternational ? (
                            <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-slate-800 text-left"><InternationalLeadForm city={city.name} /></div>
                        ) : (
                            <ContactWizard triggerButton={<Button size="lg" className="bg-white text-[#D59B2B] hover:bg-slate-100 font-bold h-16 px-12 text-xl rounded-full shadow-2xl">Demander mes devis gratuits</Button>} />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
