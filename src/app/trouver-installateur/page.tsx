import { Metadata } from 'next';
import SearchPageClient from './search-client';
import { getExperts } from '@/lib/experts';

export const metadata: Metadata = {
    title: 'Trouver un Installateur de Climatisation Gainable | Gainable.fr',
    description: 'Annuaire des experts certifiés en climatisation gainable, bureaux d\'études et diagnostiqueurs. Recevez des devis gratuits pour votre installation.',
    openGraph: {
        title: 'Trouver un Installateur de Climatisation Gainable | Gainable.fr',
        description: 'Trouvez l\'expert qu\'il vous faut pour votre projet de climatisation gainable. Annuaire complet et gratuit.',
        images: ['/hero-hvac.png'],
        type: 'website',
    },
};

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
