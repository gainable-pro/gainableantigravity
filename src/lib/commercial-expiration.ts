import { prisma } from "@/lib/prisma";

export const PROSPECT_EXCLUSIVITY_DAYS = 40;

export interface ProspectExpiryInfo {
    assignedAt: Date;
    expiryDate: Date;
    daysElapsed: number;
    daysRemaining: number;
    isExpired: boolean;
    isSold: boolean;
    percentElapsed: number;
}

export function computeProspectExpiry(prospect: { 
    assignedAt?: Date | string | null; 
    createdAt?: Date | string | null; 
    status?: string;
    sales?: any[];
}): ProspectExpiryInfo {
    const isSold = prospect.status === "VENTE_EFFECTUEE" || (Array.isArray(prospect.sales) && prospect.sales.some(s => s.status === "VALIDEE" || s.status === "EN_LIGNE"));
    
    const rawAssigned = prospect.assignedAt || prospect.createdAt || new Date();
    const assignedAt = new Date(rawAssigned);
    const expiryDate = new Date(assignedAt.getTime() + PROSPECT_EXCLUSIVITY_DAYS * 24 * 60 * 60 * 1000);
    
    if (isSold) {
        return {
            assignedAt,
            expiryDate,
            daysElapsed: 0,
            daysRemaining: PROSPECT_EXCLUSIVITY_DAYS,
            isExpired: false,
            isSold: true,
            percentElapsed: 100
        };
    }

    const now = new Date();
    const msElapsed = now.getTime() - assignedAt.getTime();
    const daysElapsed = Math.max(0, Math.floor(msElapsed / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, PROSPECT_EXCLUSIVITY_DAYS - daysElapsed);
    const isExpired = daysElapsed >= PROSPECT_EXCLUSIVITY_DAYS;
    const percentElapsed = Math.min(100, Math.round((daysElapsed / PROSPECT_EXCLUSIVITY_DAYS) * 100));

    return {
        assignedAt,
        expiryDate,
        daysElapsed,
        daysRemaining,
        isExpired,
        isSold,
        percentElapsed
    };
}

/**
 * Libère automatiquement les fiches de prospects non conclues ayant dépassé 40 jours d'attribution.
 * La fiche est retirée de l'attribution commerciale et réintègre ainsi la base commune (CVC 37k / Google Local).
 */
export async function releaseExpiredProspects() {
    try {
        const fortyDaysAgo = new Date(Date.now() - PROSPECT_EXCLUSIVITY_DAYS * 24 * 60 * 60 * 1000);

        const expiredProspects = await prisma.commercialProspect.findMany({
            where: {
                status: { not: "VENTE_EFFECTUEE" },
                OR: [
                    { assignedAt: { lt: fortyDaysAgo } },
                    { assignedAt: null, createdAt: { lt: fortyDaysAgo } }
                ],
                sales: {
                    none: {}
                }
            },
            select: { id: true, nomEntreprise: true, commercialId: true }
        });

        if (expiredProspects.length > 0) {
            const idsToDelete = expiredProspects.map(p => p.id);
            await prisma.commercialProspect.deleteMany({
                where: { id: { in: idsToDelete } }
            });
            console.log(`[Auto-Release 40J] ${idsToDelete.length} prospect(s) expirés sans vente ont été remis dans la base commune.`);
            return idsToDelete.length;
        }

        return 0;
    } catch (error) {
        console.error("Erreur lors de la libération automatique des prospects expirés (40j):", error);
        return 0;
    }
}
