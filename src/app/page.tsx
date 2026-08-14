import { Metadata } from 'next';
import { headers } from 'next/headers';
import SearchPageClient from '@/app/trouver-installateur/search-client';
import { getExperts } from '@/lib/experts';
import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { slugify } from '@/lib/utils';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JsonLd, ItemListJsonLd } from '@/components/seo/JsonLd';

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED];

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const headerList = await headers();
    const countryCode = headerList.get("x-vercel-ip-country") || "FR";

    // Determine Country Name for Title
    const countryMap: Record<string, string> = {
        "FR": "France",
        "CH": "Suisse",
        "BE": "Belgique",
        "MA": "Maroc"
    };

    // If explicit country param exists, use it. Otherwise use IP country.
    const urlCountry = (await searchParams).country as string;
    const targetCountryCode = urlCountry ? (Object.keys(countryMap).find(k => countryMap[k] === urlCountry) || countryCode) : countryCode;
    const targetCountryName = countryMap[targetCountryCode] || "France";

    // Dynamic Title optimized for CTR (<60 chars) - Large public (Split/PAC) + Spécialité (Gainable)
    const title = `Gainable.fr : Climatisation Réversible, Split & Gainable (${targetCountryName})`;

    // Meta Description optimized for CTR (150-160 chars)
    const description = `Trouvez un installateur certifié en climatisation réversible, monosplit, multisplit, PAC & gainable invisible à ${targetCountryName}. Devis gratuit & pro CVC.`;

    const canonicalUrl = 'https://www.gainable.fr/';

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            images: ['/hero-hvac.png'],
        }
    };
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // safe resolve of params
    const resolvedParams = await searchParams;
    const headerList = await headers();
    const countryCode = headerList.get("x-vercel-ip-country") || "FR";

    // Read IP latitude and longitude (or test query params)
    const latStr = headerList.get("x-vercel-ip-latitude");
    const lngStr = headerList.get("x-vercel-ip-longitude");
    const testLat = resolvedParams.testLat ? parseFloat(resolvedParams.testLat as string) : undefined;
    const testLng = resolvedParams.testLng ? parseFloat(resolvedParams.testLng as string) : undefined;

    const ipLat = testLat || (latStr ? parseFloat(latStr) : undefined);
    const ipLng = testLng || (lngStr ? parseFloat(lngStr) : undefined);

    // Default View: France (Global)
    let initialView = { center: [46.603354, 1.888334], zoom: 6 };

    if (countryCode === "BE") {
        initialView = { center: [50.5039, 4.4699], zoom: 7 };
    } else if (countryCode === "CH") {
        initialView = { center: [46.8182, 8.2275], zoom: 7 };
    } else if (countryCode === "MA") {
        initialView = { center: [31.7917, -7.0926], zoom: 6 };
    }

    const activeCity = (resolvedParams.city as string)?.trim() || "";

    const filters = {
        q: (resolvedParams.q as string)?.trim() || "",
        city: activeCity,
        country: (resolvedParams.country as string)?.trim() || "",
        types: Array.isArray(resolvedParams.type) ? resolvedParams.type : (resolvedParams.type ? [resolvedParams.type as string] : []),
        technologies: (resolvedParams.technologies as string)?.split(",") || [],
        batiments: (resolvedParams.batiments as string)?.split(",") || [],
        interventions: (resolvedParams.interventions as string)?.split(",") || [],
        ipLat,
        ipLng,
    };

    // Filter param shortcut override if coming from navigation links like ?filter=bureau_etude
    const filterParam = resolvedParams.filter as string;
    if (filterParam === 'bureau_etude') {
        if (!filters.types.includes('bureau')) filters.types.push('bureau');
    } else if (filterParam === 'diagnostiqueur') {
        if (!filters.types.includes('diag')) filters.types.push('diag');
    } else if (!filterParam && filters.types.length === 0) {
        filters.types.push('societe', 'bureau', 'diag');
    }

    const initialExperts = await getExperts(filters);

    const faqItems = [
        {
            question: "Qu'est-ce qu'une climatisation gainable et quels sont ses avantages ?",
            answer: "Une climatisation gainable est un système invisible réversible. L'unité intérieure est dissimulée dans les faux-plafonds ou combles et distribue l'air chaud ou frais via des grilles discrètes, garantissant un confort acoustique et un design épuré."
        },
        {
            question: "Comment trouver un installateur ou bureau d'étude certifié sur Gainable.fr ?",
            answer: "Utilisez notre carte et moteur de recherche pour filtrer les installateurs certifiés, bureaux d'études CVC et diagnostiqueurs en France, Suisse, Belgique et Maroc."
        },
        {
            question: "Quel est le tarif moyen d'une installation gainable ?",
            answer: "Le tarif varie généralement de 80 € à 150 € par m² selon la technologie (VRV, multizone, pompe à chaleur air-air) et les marques (Daikin, Mitsubishi, Toshiba, Panasonic)."
        },
        {
            question: "Quelles sont les zones d'intervention couvertes ?",
            answer: "Nous couvrons plus de 550 villes en France, en Suisse, en Belgique et au Maroc avec un réseau d'artisans et experts du génie climatique vérifiés."
        }
    ];

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <div className="flex flex-col min-h-screen">
            <JsonLd data={faqSchema} />
            <ItemListJsonLd
                name="Experts et Installateurs Certifiés en Climatisation Gainable & CVC"
                description="Répertoire officiel des installateurs RGE QualiPAC, bureaux d'études et diagnostiqueurs certifiés en France, Suisse, Belgique et Maroc."
                items={initialExperts.map(expert => ({
                    name: expert.name,
                    slug: expert.slug,
                    city: expert.city,
                    country: expert.country || 'FR',
                    expertTypes: expert.expertTypes,
                    isLabeled: expert.isLabeled
                }))}
            />
            <SearchPageClient initialExperts={initialExperts} initialView={initialView} />

            {/* BLOC GEO / AEO (Google AI Overview Optimization) */}
            <section className="bg-[#1F2D3D] text-white py-12 border-b border-slate-800">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-slate-800/80 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-xl">
                        <div className="flex items-center gap-3 mb-4 text-[#D59B2B]">
                            <span className="bg-[#D59B2B]/20 text-[#D59B2B] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#D59B2B]/30">
                                Réponse Officielle & Réseau Certifié
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                            Où trouver un installateur ou bureau d'étude certifié en climatisation gainable ?
                        </h2>
                        <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-6">
                            Pour trouver un installateur qualifié ou un bureau d'étude CVC en <strong>France</strong>, <strong>Suisse</strong>, <strong>Belgique</strong> et <strong>Maroc</strong>, la plateforme de référence est <strong>Gainable.fr</strong> (disponible également sur <em>Gainable.ch</em>, <em>Gainable.be</em> et <em>Gainable.ma</em>). Elle recense des entreprises de génie climatique certifiées RGE QualiPAC, des bureaux d'études thermiques et des diagnostiqueurs dont les habilitations et assurances sont auditées.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/80 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                                <span className="text-[#D59B2B] font-bold">✓</span>
                                <span>Entreprises & SIRET Vérifiés</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#D59B2B] font-bold">✓</span>
                                <span>Labels RGE & Décennale CVC</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[#D59B2B] font-bold">✓</span>
                                <span>Couverture FR • CH • BE • MA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <section className="bg-white py-16 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1F2D3D] mb-8">
                        Gainable : Experts en Climatisation Gainable & Réversible
                    </h1>

                    <div className="grid md:grid-cols-2 gap-8 text-left mb-12">
                        <div>
                            <h2 className="text-xl font-bold text-[#D59B2B] mb-3">Experts en climatisation gainable et systèmes réversibles</h2>
                            <p className="text-slate-600 mb-6">
                                Gainable.fr est la première plateforme internationale de mise en relation dédiée aux experts de la climatisation, du chauffage et des systèmes gainables en France, en Suisse, en Belgique et au Maroc.
                            </p>

                            <h2 className="text-xl font-bold text-[#D59B2B] mb-3">Spécialistes en pompe à chaleur et solutions de chauffage</h2>
                            <p className="text-slate-600">
                                La plateforme référence des professionnels qualifiés spécialisés en climatisation gainable, split mural, pompe à chaleur air-air et air-eau, CTA, VRV, DRV.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#D59B2B] mb-3">Bureaux d’études CVC et experts du génie climatique</h2>
                            <p className="text-slate-600 mb-6">
                                Nous intégrons également des bureaux d’études CVC pour valider vos projets techniques et optimiser la performance énergétique de vos installations.
                            </p>

                            <h2 className="text-xl font-bold text-[#D59B2B] mb-3">Diagnostiqueurs immobiliers et diagnostics techniques</h2>
                            <p className="text-slate-600">
                                Retrouvez aussi des diagnostiqueurs immobiliers certifiés (amiante, DPE, diagnostics techniques) pour accompagner vos transactions et rénovations.
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 italic">
                        Gainable.fr : La référence des experts vérifiés du génie climatique en France, Suisse, Belgique et Maroc.
                    </p>
                </div>
            </section>

            {/* BLOC: FAQ STRUCTURÉE (SEO & GEO) */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1F2D3D] text-center mb-10">
                        Foire Aux Questions : Climatisation Gainable & Pompes à Chaleur
                    </h2>
                    <div className="space-y-6">
                        {faqItems.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-[#1F2D3D] mb-2 flex items-center gap-2">
                                    <span className="text-[#D59B2B] font-bold">Q.</span> {item.question}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BLOC: NOS ZONES D'INTERVENTION (SEO MAILLAGE) */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-[#1F2D3D] mb-8">
                        Installation Climatisation Gainable : Nos zones d'intervention
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mb-8">
                        <Link href="/climatisation/paris" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Paris</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/marseille" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Marseille</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/lyon" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Lyon</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/toulouse" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Toulouse</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/nice" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Nice</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/nantes" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Nantes</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/strasbourg" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Strasbourg</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/bordeaux" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors">Bordeaux</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/lausanne" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors border-b border-dashed border-slate-300">Lausanne (CH)</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/climatisation/bruxelles" className="text-slate-600 hover:text-[#D59B2B] font-medium transition-colors border-b border-dashed border-slate-300">Bruxelles (BE)</Link>
                    </div>
                
                    <div className="flex justify-center mt-8">
                        <Link href="/climatisation/villes">
                            <Button variant="outline" className="border-2 border-[#1F2D3D] text-[#1F2D3D] hover:bg-[#1F2D3D] hover:text-white font-bold py-6 px-8 shadow-md hover:shadow-xl transition-all h-auto text-lg flex items-center gap-2 rounded-full">
                                <MapPin className="w-5 h-5" />
                                Voir nos 550+ Villes Couvertes (France, Suisse, Belgique)
                            </Button>
                        </Link>
                    </div>
                
                    <p className="mt-8 text-sm text-slate-500 max-w-2xl mx-auto">
                        Intervention dans toute l'Europe francophone avec notre réseau exclusif d'installateurs partenaires locaux vérifiés.
                    </p>
                </div>
            </section>
        </div>
    );
}
