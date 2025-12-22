import { PrismaClient, Prisma, ExpertType } from "@prisma/client";

// Ensure global prisma client usage if not already centralized
// Assuming standard Next.js singleton pattern might be needed, but sticking to local instantiation or import if existing
// For now, importing from @prisma/client is standard. 
// Ideally we should use a singleton 'db' or 'prisma' export from lib/prisma.ts if it exists.
// Checking if lib/prisma.ts exists would be good, but standard new PrismaClient() works for now in server methods.

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

export type ExpertFilters = {
    q?: string;
    city?: string;
    country?: string;
    types?: string[];
    technologies?: string[];
    batiments?: string[];
    interventions?: string[];
};

export async function getExperts(filters: ExpertFilters) {
    try {
        // Build Prisma where clause
        const where: Prisma.ExpertWhereInput = {
            // Base filter: must be verified/active
            status: { equals: 'active', mode: 'insensitive' }
        };




        // 1. Text Search (Name or City)
        if (filters.q) {
            where.OR = [
                { nom_entreprise: { contains: filters.q, mode: 'insensitive' } },
                { ville: { contains: filters.q, mode: 'insensitive' } },
                { code_postal: { contains: filters.q } }
            ];
        }

        // 2. Exact City Filter (from location input)
        if (filters.city) {
            where.ville = { contains: filters.city, mode: 'insensitive' };
        }

        // 3. Country Filter
        if (filters.country) {
            where.pays = { contains: filters.country, mode: 'insensitive' };
        }

        // 4. Expert Type Filter
        if (filters.types && filters.types.length > 0) {
            const mappedTypes: ExpertType[] = [];
            if (filters.types.includes('societe')) mappedTypes.push(ExpertType.cvc_climatisation);
            if (filters.types.includes('bureau')) mappedTypes.push(ExpertType.bureau_detude);
            if (filters.types.includes('diag')) mappedTypes.push(ExpertType.diagnostics_dpe);

            if (mappedTypes.length > 0) {
                where.expert_type = { in: mappedTypes };
            }
        }

        // 5. Technologies Filter (Relation)
        if (filters.technologies && filters.technologies.length > 0) {
            where.technologies = {
                some: {
                    value: { in: filters.technologies }
                }
            };
        }

        // 6. Batiments Filter (Relation)
        if (filters.batiments && filters.batiments.length > 0) {
            where.batiments = {
                some: {
                    value: { in: filters.batiments }
                }
            };
        }

        // 7. Interventions Filter (Relation)
        if (filters.interventions && filters.interventions.length > 0) {
            where.OR = [
                ...(where.OR ? (Array.isArray(where.OR) ? where.OR : [where.OR]) : []),
                { interventions_clim: { some: { value: { in: filters.interventions } } } },
                { interventions_etude: { some: { value: { in: filters.interventions } } } },
                { interventions_diag: { some: { value: { in: filters.interventions } } } }
            ];
        }

        // Query DB
        const experts = await prisma.expert.findMany({
            where,
            include: {
                technologies: true,
                interventions_clim: true,
                interventions_etude: true,
                interventions_diag: true,
                batiments: true,
                marques: true,
                photos: {
                    take: 1
                }
            }
        });

        // Format for frontend
        return experts.map(expert => ({
            id: expert.id,
            slug: expert.slug,
            name: expert.nom_entreprise,
            city: expert.ville,
            country: expert.pays,
            description: expert.description,
            // Collect all tags
            expertTypes: [expert.expert_type],
            interventions: [
                ...expert.interventions_clim.map(i => i.value),
                ...expert.interventions_etude.map(i => i.value),
                ...expert.interventions_diag.map(i => i.value)
            ],
            technologies: expert.technologies.map(t => t.value),
            marques: expert.marques.map(m => m.value),
            logoUrl: expert.logo_url || undefined,
            coverPhoto: expert.photos[0]?.photo_url || undefined,
            // Mock Lat/Lng for now if missing
            lat: 46.2276,
            lng: 2.2137
        }));

    } catch (error) {
        console.error("Error getting experts:", error);
        return [];
    }
}
