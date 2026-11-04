import { getDepartmentFromZip } from "./departments";

interface ExpertSEOData {
    nomEntreprise: string;
    ville: string;
    codePostal: string;
    description?: string | null;
}

export function generateExpertMetaTitle(data: ExpertSEOData): string {
    const dept = getDepartmentFromZip(data.codePostal);
    const zipOrDept = data.codePostal ? ` (${data.codePostal})` : dept ? ` (${dept})` : "";
    const company = data.nomEntreprise.replace(/(\([^)]+\))(\s*\1)+/gi, "$1").trim();
    const city = data.ville.trim();

    let title = `${company} – Climatisation Gainable & Pompe à Chaleur à ${city}${zipOrDept}`;

    if (title.length > 68) {
        title = `${company} – Climatisation & PAC Gainable à ${city}${zipOrDept}`;
    }

    if (title.length > 68) {
        title = `${company} — Climatisation & PAC à ${city}`;
    }

    return title;
}

export function generateExpertMetaDescription(data: ExpertSEOData): string {
    const company = data.nomEntreprise.replace(/(\([^)]+\))(\s*\1)+/gi, "$1").trim();
    const city = data.ville.trim();
    const zip = data.codePostal ? ` (${data.codePostal})` : "";

    let desc = `${company} à ${city}${zip} : artisan certifié en installation, entretien et dépannage de climatisation gainable et pompe à chaleur réversible. Devis gratuit.`;

    if (desc.length > 160) {
        desc = `${company} à ${city}${zip} : spécialiste climatisation réversible, gainable et pompe à chaleur. Demandez votre devis gratuit en ligne.`;
    }

    return desc.substring(0, 160);
}
