
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

    // Priority 1: "[Nom] - Climatisation & Gainable à [Ville]"
    let title = `${company} — Climatisation & Gainable à ${city}${deptSuffix}`;

    // If title exceeds 60 chars, shorten subtitle
    if (title.length > 60) {
        title = `${company} — Climatisation à ${city}${deptSuffix}`;
    }

    // If still > 65 chars (e.g. very long company name), compact title
    if (title.length > 65) {
        title = `${company} — Installateur Climatisation ${city}`;
    }

    // Hard fallback cap at 65 chars
    if (title.length > 65) {
        title = title.substring(0, 62) + "...";
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

