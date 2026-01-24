
import { getDepartmentFromZip } from "./departments";

interface ExpertSEOData {
    nomEntreprise: string;
    ville: string;
    codePostal: string;
    description?: string | null;
}

export function generateExpertMetaTitle(data: ExpertSEOData): string {
    const dept = getDepartmentFromZip(data.codePostal);
    const deptSuffix = dept ? ` (${dept})` : "";

    // Format: "[Nom Entreprise] – Climatisation Réversible & Gainable à [Ville] ([Département])"
    // Max 60 chars preference.
    // If name is too long, we might truncate or prioritize keywords.

    const base = `${data.nomEntreprise} – Climatisation Réversible & Gainable à ${data.ville}${deptSuffix}`;

    // Simple truncation if strictly needed, but user format implies we keep the structure.
    return base;
}

export function generateExpertMetaDescription(data: ExpertSEOData): string {
    // Format: "[Nom Entreprise], spécialiste en climatisation gainable à [Ville]. Installation, entretien et dépannage. Devis rapide."
    // Max 160 chars.

    let desc = `${data.nomEntreprise}, spécialiste en climatisation gainable à ${data.ville}. Installation, entretien et dépannage. Devis rapide.`;

    if (desc.length > 160) {
        // Fallback to shorter version if company name is super long
        desc = `${data.nomEntreprise} : Clim gainable à ${data.ville}. Installation, entretien. Devis rapide.`;
    }

    return desc.substring(0, 160);
}
