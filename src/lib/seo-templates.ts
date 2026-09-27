
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
    const company = data.nomEntreprise.trim();
    const city = data.ville.trim();

    // Priority 1: "Installateur Climatisation [Ville] - [Nom] | Gainable"
    let title = `Installateur Climatisation ${city}${deptSuffix} — ${company} | Gainable`;

    // If title exceeds 65 chars, compact title
    if (title.length > 65) {
        title = `Climatisation ${city} — ${company} | Gainable.fr`;
    }

    if (title.length > 65) {
        title = `${company} — Climatisation ${city}`;
    }

    return title;
}

export function generateExpertMetaDescription(data: ExpertSEOData): string {
    const company = data.nomEntreprise.trim();
    const city = data.ville.trim();

    let desc = `Fiche officielle de ${company} à ${city}. Expert qualifié en installation et entretien de climatisation réversible et pompe à chaleur gainable. Devis gratuit.`;

    if (desc.length > 160) {
        desc = `${company} à ${city} : spécialiste climatisation réversible et gainable. Demandez votre devis gratuit en ligne.`;
    }

    return desc.substring(0, 160);
}

