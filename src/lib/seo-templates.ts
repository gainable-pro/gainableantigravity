
import { getDepartmentFromZip } from "./departments";

interface ExpertSEOData {
    nomEntreprise: string;
    ville: string;
    codePostal: string;
    description?: string | null;
}

export function generateExpertMetaTitle(data: ExpertSEOData): string {
    const currentYear = new Date().getFullYear();
    const dept = getDepartmentFromZip(data.codePostal);
    const deptSuffix = dept ? ` (${dept})` : "";

    // Format: "[Nom Entreprise] - Installateur Climatisation Réversible & Gainable à [Ville] ([Département]) | Devis [Year]"
    // Max 60 chars preference, but we prioritize strong CTR keywords.

    const base = `${data.nomEntreprise} - Installateur Climatisation Réversible & Gainable à ${data.ville}${deptSuffix} | Devis ${currentYear}`;

    return base;
}

export function generateExpertMetaDescription(data: ExpertSEOData): string {
    // Format: "Vous cherchez à installer une climatisation réversible ou gainable à [Ville] ? Découvrez [Nom], installateur de confiance. Demandez votre devis gratuit !"
    // Max 160 chars.

    let desc = `Vous cherchez à installer une climatisation réversible ou gainable à ${data.ville} ? Découvrez ${data.nomEntreprise}, installateur de confiance. Demandez votre devis gratuit !`;

    if (desc.length > 160) {
        // Fallback to shorter version if company name is super long
        desc = `Installation climatisation réversible & gainable à ${data.ville} par ${data.nomEntreprise}. Obtenez un devis gratuit et rapide.`;
    }

    return desc.substring(0, 160);
}
