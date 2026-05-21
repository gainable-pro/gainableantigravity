import { PrismaClient, Prisma, ExpertType } from "@prisma/client";
import { prisma } from "./prisma";

// Ensure global prisma client usage if not already centralized

export type ExpertFilters = {
    q?: string;
    city?: string;
    country?: string;
    types?: string[];
    technologies?: string[];
    batiments?: string[];
    interventions?: string[];
    lat?: number;
    lng?: number;
    ipLat?: number;
    ipLng?: number;
};

// Haversine Distance Helper
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export async function getExperts(filters: ExpertFilters) {
    try {
        // Build Prisma where clause
        const where: Prisma.ExpertWhereInput = {
            // Base filter: must be verified/active
            status: { equals: 'active', mode: 'insensitive' },
            slug: { not: 'gainable-fr' } // Hide Admin Profile
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
        // 2. Exact City Filter (from location input)
        // Only ignore strict city match if we have Radial Coordinates (lat/lng)
        // Otherwise, fallback to text match.
        if (filters.city && (!filters.lat || !filters.lng)) {
            where.AND = [
                ...(where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : []),
                {
                    OR: [
                        { ville: { contains: filters.city, mode: 'insensitive' } },
                        { national_coverage: true }
                    ]
                }
            ];
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
        let experts = await prisma.expert.findMany({
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

        // 8. RADIAL SEARCH & DISTANCE SORTING (In Memory)
        const hasSearchCoords = filters.lat !== undefined && filters.lng !== undefined;
        const hasIpCoords = filters.ipLat !== undefined && filters.ipLng !== undefined;

        if (hasSearchCoords) {
            const searchLat = filters.lat!;
            const searchLng = filters.lng!;

            // 8a. Filter by radial distance from search coordinates (if not national coverage)
            experts = experts.filter(expert => {
                if ((expert as any).national_coverage) return true;

                let expLat = expert.lat || 0;
                let expLng = expert.lng || 0;

                if (expLat === 0 && expLng === 0) return false;

                const distKm = getDistance(searchLat, searchLng, expLat, expLng);
                const radius = expert.intervention_radius || 50;

                return distKm <= radius;
            });

            // 8b. Sort by distance from search coordinates
            experts.sort((a, b) => {
                const aLat = a.lat || 0;
                const aLng = a.lng || 0;
                const bLat = b.lat || 0;
                const bLng = b.lng || 0;

                const aHasCoords = aLat !== 0 && aLng !== 0;
                const bHasCoords = bLat !== 0 && bLng !== 0;

                if (!aHasCoords && !bHasCoords) return 0;
                if (!aHasCoords) return 1; // Put a at the end
                if (!bHasCoords) return -1; // Put b at the end

                const distA = getDistance(searchLat, searchLng, aLat, aLng);
                const distB = getDistance(searchLat, searchLng, bLat, bLng);

                return distA - distB;
            });
        } else if (hasIpCoords) {
            const ipLat = filters.ipLat!;
            const ipLng = filters.ipLng!;

            // 8c. Sort by distance from IP coordinates (without radial filtering)
            experts.sort((a, b) => {
                const aLat = a.lat || 0;
                const aLng = a.lng || 0;
                const bLat = b.lat || 0;
                const bLng = b.lng || 0;

                const aHasCoords = aLat !== 0 && aLng !== 0;
                const bHasCoords = bLat !== 0 && bLng !== 0;

                if (!aHasCoords && !bHasCoords) return 0;
                if (!aHasCoords) return 1;
                if (!bHasCoords) return -1;

                const distA = getDistance(ipLat, ipLng, aLat, aLng);
                const distB = getDistance(ipLat, ipLng, bLat, bLng);

                return distA - distB;
            });
        }

        // Format for frontend
        return experts.map(expert => ({
            id: expert.id,
            slug: expert.slug,
            name: expert.nom_entreprise,
            city: ((expert as any).adresse_indep && (expert as any).ville_inter) ? (expert as any).ville_inter : expert.ville,
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
            telephone: expert.telephone, // Added telephone
            // Mock Lat/Lng for now if missing
            lat: expert.lat || 0,
            lng: expert.lng || 0,
            isLabeled: expert.is_labeled // Map DB field to frontend prop
        }));

    } catch (error) {
        console.error("Error getting experts:", error);
        return [];
    }
}
