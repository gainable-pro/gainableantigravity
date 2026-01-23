import { Metadata } from 'next';
import SearchPageClient from '@/app/trouver-installateur/search-client';
import { getExperts } from '@/lib/experts';

export const dynamic = 'force-dynamic';

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
const title = `Experts climatisation & gainable – ${targetCountryName} | Gainable.fr`;

const description = "Plateforme de mise en relation avec des experts qualifiés en climatisation, gainable, pompe à chaleur, chauffage, bureaux d’études et diagnostics immobiliers en France, Suisse, Belgique et Maroc.";

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

import { headers } from 'next/headers';

// ... (existing imports)

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
        filters.types.push('societe');
    }

    const initialExperts = await getExperts(filters);

    return (
        <div className="flex flex-col min-h-screen">
            <SearchPageClient initialExperts={initialExperts} initialView={initialView} />

            {/* SEO Content Section */}
            <section className="bg-white py-16 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1F2D3D] mb-8">
                        Trouver un expert en climatisation, gainable et génie climatique
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
        </div>
    );
}
