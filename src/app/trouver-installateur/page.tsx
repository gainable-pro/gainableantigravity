import { Metadata } from 'next';
import SearchPageClient from './search-client';
import { getExperts } from '@/lib/experts';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
    const params = await searchParams;
    const city = (params.city as string)?.trim();
    const type = params.filter as string; // 'societe', 'bureau_etude', 'diagnostiqueur'

    let title = "Trouver un Installateur de Climatisation Gainable | Gainable.fr";
    let description = "Annuaire des experts certifiés en climatisation gainable. Recevez des devis gratuits pour votre installation.";

    if (city) {
        title = `Installateur Climatisation Gainable à ${city} | Gainable.fr`;
        description = `Trouvez un expert en climatisation gainable à ${city}. Comparatif, devis gratuit et installation par des professionnels certifiés RGE.`;
    }

    // Canonical Strategy:
    // 1. If City is present -> Canonical = /trouver-installateur?city=... (Index city pages)
    // 2. If NO City -> Canonical = /trouver-installateur (Consolidate all other filters like type, tags to root)
    const canonicalUrl = city
        ? `/trouver-installateur?city=${encodeURIComponent(city)}`
        : '/trouver-installateur';

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
        <SearchPageClient initialExperts={initialExperts} />
    );
}
