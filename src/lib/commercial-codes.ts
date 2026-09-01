import { prisma } from "@/lib/prisma";

export function generateCommercialCode(user: { email: string; commercialProfile?: { prenom?: string | null; nom?: string | null } | null }): string {
    if (user.commercialProfile?.prenom) {
        const clean = user.commercialProfile.prenom.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (clean.length >= 3) return clean;
    }
    
    const emailPrefix = user.email.split('@')[0].split('.')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
    return emailPrefix.length >= 3 ? emailPrefix : "COMMERCIAL";
}

export async function findCommercialByCode(code: string) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleanCode) return null;

    // Search users with role 'commercial' or commercialProfile
    const commercials = await prisma.user.findMany({
        where: {
            OR: [
                { role: "commercial" },
                { commercialProfile: { isNot: null } }
            ]
        },
        include: { commercialProfile: true }
    });

    for (const c of commercials) {
        const generated = generateCommercialCode(c);
        if (generated === cleanCode) {
            return c;
        }
        // Check email prefix or names
        const emailPrefix = c.email.split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (emailPrefix === cleanCode || emailPrefix.startsWith(cleanCode)) {
            return c;
        }
        if (c.commercialProfile?.nom) {
            const nomClean = c.commercialProfile.nom.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
            if (nomClean === cleanCode) return c;
        }
    }

    return null;
}
