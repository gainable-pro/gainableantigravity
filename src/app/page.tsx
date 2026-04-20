import { Metadata } from 'next';
import { headers } from 'next/headers';
import SearchPageClient from '@/app/trouver-installateur/search-client';
import { getExperts } from '@/lib/experts';
import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { slugify } from '@/lib/utils';
import Link from 'next/link';

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
    const targetCountryName = countryMap[targetCountryCode] || "France, Suisse, Belgique, Maroc";

    // Dynamic Title
    const title = `Gainable : Climatisation Gainable & Réversible – ${targetCountryName} | Gainable.fr`;

    const description = `Besoin d'une climatisation gainable ou réversible ? Trouvez un installateur expert à ${targetCountryName}. Devis gratuit, pompes à chaleur, CVC et diagnostics techniques.`;

    const canonicalUrl = (await searchParams).city
        ? `/trouver-installateur?city=${encodeURIComponent((await searchParams).city as string)}`
        : '/';

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

    // Default View: France (Global)
    let initialView = { center: [46.603354, 1.888334], zoom: 6 };

    if (countryCode === "BE") {
        initialView = { center: [50.5039, 4.4699], zoom: 7 };
    } else if (countryCode === "CH") {
        initialView = { center: [46.8182, 8.2275], zoom: 7 };
    } else if (countryCode === "MA") {
        initialView = { center: [31.7917, -7.0926], zoom: 6 };
    }

    const filters = {
        q: (resolvedParams.q as string)?.trim() || "",
        city: (resolvedParams.city as string)?.trim() || "",
        country: (resolvedParams.country as string)?.trim() || "",
        types: Array.isArray(resolvedParams.type) ? resolvedParams.type : (resolvedParams.type ? [resolvedParams.type as string] : []),
        technologies: (resolvedParams.technologies as string)?.split(",") || [],
        batiments: (resolvedParams.batiments as string)?.split(",") || [],
        interventions: (resolvedParams.interventions as string)?.split(",") || [],
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

    return (
        <div className="flex flex-col min-h-screen">
            <SearchPageClient initialExperts={initialExperts} initialView={initialView} />

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
                                Gainable.fr est la première plateforme de mise en relation dédiée aux experts de la climatisation, du chauffage et des systèmes gainables en France, en Suisse, en Belgique et au Maroc.
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
                        Gainable.fr : La référence des experts vérifiés du génie climatique.
                    </p>
                </div>
            </section>

            {/* Regions Directory Hub */}
            <section className="bg-slate-50 py-16 border-t border-slate-200">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1F2D3D] mb-10 text-center">Nos zones d'intervention par région</h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {['FR', 'CH', 'BE', 'MA'].map((countryKey) => {
                            const regions = Array.from(new Set(
                                ALL_CITIES.filter(c => (c.country || 'FR') === countryKey).map(c => c.region)
                            )).sort();

                            if (regions.length === 0) return null;

                            const flagMap: Record<string, string> = { 'FR': '🇫🇷', 'CH': '🇨🇭', 'BE': '🇧🇪', 'MA': '🇲🇦' };
                            const nameMap: Record<string, string> = { 'FR': 'France', 'CH': 'Suisse', 'BE': 'Belgique', 'MA': 'Maroc' };

                            return (
                                <div key={countryKey} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-lg text-[#1F2D3D] mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                                        <span className="text-xl">{flagMap[countryKey]}</span> {nameMap[countryKey]}
                                    </h3>
                                    <ul className="space-y-3">
                                        {regions.map(region => (
                                            <li key={region}>
                                                <Link 
                                                    href={`/trouver-installateur/${slugify(region)}`}
                                                    className="text-slate-600 hover:text-[#D59B2B] hover:translate-x-1 transition-transform inline-block text-sm font-medium"
                                                >
                                                    {region}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
