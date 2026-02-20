import { CITIES_100, CityData } from "@/data/cities-100";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, MapPin, ShieldCheck, Star } from "lucide-react";
import { ContactWizard } from "@/components/features/contact/contact-wizard"; // Ensure this path is correct
import { prisma } from "@/lib/prisma";

// Force SSG for these pages
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour (ISR) or false for pure SSG

interface PageProps {
    params: Promise<{
        city: string;
    }>;
}

// 1. Generate Static Params for SSG
export async function generateStaticParams() {
    return CITIES_100.map((city) => ({
        city: city.slug,
    }));
}

// 2. SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { city: citySlug } = await params;
    const city = CITIES_100.find(c => c.slug === citySlug);

    if (!city) return {};

    return {
        title: `Installation Climatisation Gainable à ${city.name} | Devis Gratuit`,
        description: `Gainable.fr, 1ère plateforme internationale dédiée à la climatisation gainable & VRV. Trouvez un installateur de climatisation expert vérifié à ${city.name} (${city.zip}).`,
        alternates: {
            canonical: `https://www.gainable.fr/climatisation/${city.slug}`,
        },
        openGraph: {
            title: `Installateur Climatisation Gainable à ${city.name}`,
            description: `1ère plateforme internationale dédiée à la climatisation gainable. Trouvez les meilleurs installateurs à ${city.name}.`,
            url: `https://www.gainable.fr/climatisation/${city.slug}`,
            type: 'website',
            images: ['/hero-villa.png'], // Default or dynamic image
        }
    };
}

// 3. Helper to get nearby cities
function getNearbyCities(currentCity: CityData) {
    return CITIES_100
        .filter(c => c.slug !== currentCity.slug && (c.department === currentCity.department || c.region === currentCity.region))
        .slice(0, 6);
}

// 4. Page Component
import { InternationalLeadForm } from "@/components/features/contact/forms/international-form";

// ... existing imports

// 4. Page Component
export default async function CityPage({ params }: PageProps) {
    const { city: citySlug } = await params;
    const city = CITIES_100.find(c => c.slug === citySlug);

    if (!city) {
        notFound();
    }

    // Pricing Logic (MAD for Morocco, CHF for Switzerland, EUR for others)
    const isInternational = city.country && city.country !== 'FR';
    const isMorocco = city.country === 'MA';
    const isSwitzerland = city.country === 'CH';

    let currency = '€';
    let priceMultiplier = 1;

    if (isMorocco) {
        currency = 'MAD';
        priceMultiplier = 10 * 0.7; // ~10 MAD/EUR, -30% cost
    } else if (isSwitzerland) {
        currency = 'CHF';
        priceMultiplier = 1.6; // Higher cost of living
    }

    const priceMinRaw = 12000 * city.priceIndex * priceMultiplier;
    const priceMaxRaw = 18000 * city.priceIndex * priceMultiplier;

    // Rounding logic: nearest 1000 for MAD, 100 for others
    const roundTo = isMorocco ? 1000 : 100;
    const priceMin = Math.round(priceMinRaw / roundTo) * roundTo;
    const priceMax = Math.round(priceMaxRaw / roundTo) * roundTo;

    const priceMinStr = priceMin.toLocaleString('fr-FR');
    const priceMaxStr = priceMax.toLocaleString('fr-FR');

    const climateText = city.climateZone === 'mediterranean'
        ? "Avec les étés de plus en plus chauds de la zone méditerranéenne, la climatisation est devenue indispensable pour le confort de vie."
        : city.climateZone === 'oceanic'
            ? "Le climat océanique apporte de l'humidité : le mode déshumidification du gainable est un véritable atout pour votre confort."
            : "Pour affronter les écarts de température de votre région, le gainable réversible est la solution idéale (chauffage + clim).";

    const housingText = city.housingType === 'urbain-dense'
        ? `À ${city.name}, dans les appartements ou les zones denses, le gainable est plébiscité car l'unité extérieure peut souvent être installée discrètement sur un balcon ou une toiture.`
        : city.housingType === 'historique'
            ? `Le patrimoine architectural de ${city.name} demande des solutions invisibles. Le gainable est parfait car il respecte les façades et les intérieurs anciens.`
            : `Idéal pour les pavillons et villas autour de ${city.name}, le gainable permet de traiter de grands volumes sans dénaturer la décoration.`;


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
                    "price": "0",
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
                    },
                    {
                        "@type": "Question",
                        "name": `Quels sont les délais d'intervention à ${city.name} ?`,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": `Les délais varient selon la saison. À ${city.name}, il est recommandé de demander vos devis au printemps pour une installation avant l'été.`
                        }
                    }
                ]
            }
        ]
    };

    // 5. Fetch Local Experts & Articles (Expanded to Department)
    const localExperts = await prisma.expert.findMany({
        where: {
            status: 'active',
            OR: [
                { ville: { contains: city.name, mode: 'insensitive' } },
                { code_postal: { startsWith: city.department } }
            ]
        },
        take: 3,
        select: { id: true, nom_entreprise: true, ville: true, logo_url: true, slug: true, expert_type: true }
    });

    const relatedArticles = await prisma.article.findMany({
        where: {
            status: 'PUBLISHED',
            title: { contains: city.name, mode: 'insensitive' }
        },
        take: 3,
        select: { id: true, title: true, slug: true, mainImage: true, introduction: true, expert: { select: { slug: true } } }
    });

    // Schema.org - Breadcrumbs
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://www.gainable.fr"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Climatisation",
                "item": "https://www.gainable.fr/climatisation"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": `Climatisation ${city.name}`,
                "item": `https://www.gainable.fr/climatisation/${city.slug}`
            }
        ]
    };

    const nearbyCities = getNearbyCities(city);

    // Dynamic Background Selection
    // Priority: 1. Specific City Image, 2. Generic Housing Type Image
    const cityImageSlug = `/city-images/${city.slug}.jpg`;
    // We can't easily check file existence in client component without server action or fs (which works in SSG)
    // For SSG, we can assume the image exists if we generated it, or we handle onError in the img tag (but that complicates SSG/CLS).
    // Better: use fs.existsSync here since we are in a Server Component (mostly).

    // Note: fs is node-only. Next.js supports it in getStaticProps/Server Components.
    const fs = require('fs');
    const path = require('path');
    const cityImagePath = path.join(process.cwd(), 'public', 'city-images', `${city.slug}.jpg`);
    const hasCityImage = fs.existsSync(cityImagePath);

    const heroImage = hasCityImage ? cityImageSlug : (city.housingType === 'urbain-dense' ? '/hero-skyscraper.png' : '/hero-villa.png');

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbJsonLd]) }}
            />

            {/* HERO SECTION */}
            <section className="relative h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroImage}
                        alt={`Climatisation gainable à ${city.name}`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/40"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center text-white">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-white font-medium text-sm mb-6 border border-white/30">
                        {city.department} • {city.region}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 font-montserrat tracking-tight leading-tight">
                        Climatisation Gainable <br />
                        <span className="text-[#D59B2B]">à {city.name}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-100 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        {city.catchphrase.charAt(0).toUpperCase() + city.catchphrase.slice(1)}.
                        <br className="hidden md:block" />
                        Obtenez des devis d'experts vérifiés Gainable.fr.
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
                        <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#D59B2B]" /> Artisans Locaux</span>
                        <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-[#D59B2B]" /> Experts Vérifiés</span>
                    </div>
                </div>
            </section>

            {/* BREADCRUMBS */}
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

            {/* LOCAL EXPERTS SECTION */}
            {localExperts.length > 0 ? (
                <section className="py-16 bg-white border-b border-slate-100">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">
                                Installateurs recommandés à {city.name}
                            </h2>
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
                                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                                    <ShieldCheck className="w-10 h-10 text-slate-300" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-[#1F2D3D] text-xl mb-2 group-hover:text-[#D59B2B] transition-colors">
                                            {expert.nom_entreprise}
                                        </h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mb-6 bg-slate-50 px-3 py-1 rounded-full">
                                            <MapPin className="w-3 h-3 text-[#D59B2B]" /> {expert.ville}
                                        </p>
                                        <div className="mt-auto w-full">
                                            <Button variant="outline" className="w-full rounded-xl group-hover:bg-[#1F2D3D] group-hover:text-white transition-colors">Voir le profil</Button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                /* FALLBACK SECTION ("POSITIVE") */
                <section className="py-20 bg-white border-b border-slate-100">
                    <div className="container mx-auto px-6">
                        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden text-center">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D59B2B]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D59B2B]/10 text-[#D59B2B] mb-6">
                                    <Star className="w-8 h-8 fill-current" />
                                </span>

                                <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">
                                    Trouvez les meilleurs installateurs à {city.name}
                                </h2>

                                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    Nous avons sélectionné des <strong>installateurs de climatisation Expert Vérifié Gainable.fr</strong> intervenant dans le secteur de <strong>{city.department}</strong>.
                                    Comparez leurs offres gratuitement.
                                </p>

                                <div className="flex justify-center mt-8">
                                    <div className="w-full max-w-lg text-left">
                                        <InternationalLeadForm city={city.name} />
                                    </div>
                                </div>

                                <p className="mt-6 text-sm text-slate-400">
                                    Gratuit • Sans engagement • Réponse sous 24h
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CONTEXTE LOCAL & PRIX */}
            <section className="py-16">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-start">

                        {/* Left: Content */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">
                                    Pourquoi installer une climatisation gainable à {city.name} ?
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    {climateText}
                                </p>
                                <p className="text-slate-600 leading-relaxed mt-4 text-lg">
                                    {housingText}
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="text-xl font-bold text-[#1F2D3D] mb-4 flex items-center gap-2">
                                    <span className="bg-[#D59B2B]/10 p-2 rounded-lg text-[#D59B2B]">€</span>
                                    Prix moyen constaté à {city.name}
                                </h3>
                                <p className="text-slate-600 mb-4">Pour une maison standard de 100m² :</p>
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-3xl font-bold text-[#1F2D3D]">{priceMin} €</span>
                                    <span className="text-slate-400 mb-1">à</span>
                                    <span className="text-3xl font-bold text-[#1F2D3D]">{priceMax} €</span>
                                </div>
                                <p className="text-xs text-slate-400 italic">
                                    *Estimation incluant fourniture et pose. Le prix varie selon la complexité et la marque (Daikin, Mitsubishi, Atlantic...).
                                </p>
                            </div>
                        </div>

                        {/* Right: Steps / Trust */}
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D59B2B]/5 rounded-bl-full"></div>

                            <h3 className="text-2xl font-bold text-[#1F2D3D] mb-8">
                                Comment trouver le bon installateur à {city.name} ?
                            </h3>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-[#1F2D3D]">Décrivez votre projet</h4>
                                        <p className="text-sm text-slate-500">Remplissez notre formulaire en 1 minute.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-[#1F2D3D]">Comparaison locale</h4>
                                        <p className="text-sm text-slate-500">Nous sélectionnons jusqu'à 3 experts vérifiés intervenant à {city.name}.</p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold text-[#1F2D3D]">Recevez vos devis</h4>
                                        <p className="text-sm text-slate-500">Gratuitement et sans engagement. Comparez et choisissez.</p>
                                    </div>
                                </li>
                            </ul>

                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <Link href="/trouver-installateur">
                                    <Button className="w-full bg-[#1F2D3D] hover:bg-[#2c3e50] text-white font-bold h-12 rounded-xl">
                                        Voir les experts disponibles
                                    </Button>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* RELATED ARTICLES SECTION */}
            {relatedArticles.length > 0 && (
                <section className="py-16 bg-white border-t border-slate-100">
                    <div className="container mx-auto px-6 max-w-6xl">
                        <h2 className="text-2xl font-bold text-[#1F2D3D] mb-8">
                            Guides et conseils récents à {city.name}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedArticles.map((article) => (
                                <Link key={article.id} href={`/entreprise/${article.expert.slug}/articles/${article.slug}`} className="group">
                                    <div className="bg-slate-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                                        <div className="h-48 bg-slate-200 relative">
                                            {article.mainImage && (
                                                <img src={article.mainImage} alt={article.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-[#1F2D3D] mb-2 line-clamp-2 group-hover:text-[#D59B2B] transition-colors">
                                                {article.title}
                                            </h3>
                                            {article.introduction && (
                                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                                                    {article.introduction}
                                                </p>
                                            )}
                                            <span className="text-xs font-bold text-[#D59B2B] mt-auto">Lire l'article &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ LOCAL */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 max-w-4xl">
                    <h2 className="text-3xl font-bold text-[#1F2D3D] mb-10 text-center">
                        Questions fréquentes à {city.name}
                    </h2>

                    <div className="grid gap-6">
                        {[
                            { q: `Quel budget prévoir pour une clim gainable à ${city.name} ?`, a: `Pour une installation complète à ${city.name}, comptez entre ${priceMin}€ et ${priceMax}€ pour une maison de 100m². Ce prix inclut le matériel et la pose par un expert vérifié.` },
                            { q: `Quelles sont les aides disponibles à ${city.name} ?`, a: `Les habitants de ${city.name} peuvent bénéficier de MaPrimeRénov', des CEE (Certificats d'Économies d'Énergie) et parfois d'aides locales de la région ${city.region}. Nos installateurs partenaires peuvent vous guider.` },
                            { q: `Faut-il une autorisation d'urbanisme à ${city.name} ?`, a: `Oui, la pose d'une unité extérieure modifie l'aspect de la façade. Vous devez déposer une déclaration préalable de travaux (DP) auprès de la mairie de ${city.name}.` }
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-bold text-[#1F2D3D] text-lg mb-2">{item.q}</h3>
                                <p className="text-slate-600">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MAILLAGE INTERNE - VILLES VOISINES */}
            {nearbyCities.length > 0 && (
                <section className="py-16 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-2xl font-bold text-[#1F2D3D] mb-8">
                            Trouver un installateur près de {city.name}
                        </h2>
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

            {/* FINAL CTA */}
            <section className="py-20 bg-[#D59B2B] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto px-6 text-center relative z-10 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à climatiser votre logement à {city.name} ?</h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Recevez jusqu'à 3 devis gratuits d'artisans locaux, sélectionnés pour leur sérieux.
                    </p>
                    <div className="flex justify-center">
                        {isInternational ? (
                            <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-slate-800 text-left">
                                <InternationalLeadForm city={city.name} />
                            </div>
                        ) : (
                            <ContactWizard
                                triggerButton={
                                    <Button size="lg" className="bg-white text-[#D59B2B] hover:bg-slate-100 font-bold h-16 px-12 text-xl rounded-full shadow-2xl">
                                        Demander mes devis gratuits
                                    </Button>
                                }
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
