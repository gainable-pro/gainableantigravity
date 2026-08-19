import { CITIES_100, CityData } from '@/data/cities-100';
import { CITIES_EXTENDED } from '@/data/cities-extended';
import { CITIES_MEDIUM } from '@/data/cities-medium';

export interface LocalContextData {
    cityName: string;
    department: string;
    region: string;
    climateZone: string;
    re2020Zone: string;
    summerPeakTemp: string;
    winterMinTemp: string;
    copEst: string;
    seerEst: string;
    estimatedSavingsPct: string;
    catchphrase: string;
    housingTip: string;
    priceEstimates: {
        t1t2: string;
        t3t4: string;
        villa: string;
    };
    dpeImpact: string;
    re2020Compliance: string;
    keyPoints: string[];
    localFaqs: { question: string; response: string }[];
}

// Build O(1) unified lookup map for all cities in FR, BE, CH
const ALL_CITIES: CityData[] = [...CITIES_100, ...CITIES_EXTENDED, ...CITIES_MEDIUM];
const cityLookupMap = new Map<string, CityData>();

ALL_CITIES.forEach(c => {
    if (c.name) cityLookupMap.set(c.name.trim().toLowerCase(), c);
    if (c.slug) cityLookupMap.set(c.slug.trim().toLowerCase(), c);
});

// Deterministic hash helper for consistent unique variation per city name
function stringHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function getLocalSEOContext(cityName?: string | null): LocalContextData | null {
    if (!cityName) return null;

    const normalizedName = cityName.trim();
    const lookupKey = normalizedName.toLowerCase();
    const hash = stringHash(normalizedName);

    // Try to find exact match in cities database
    const matchedCity = cityLookupMap.get(lookupKey);

    const region = matchedCity?.region || (hash % 2 === 0 ? 'Auvergne-Rhône-Alpes' : 'Nouvelle-Aquitaine');
    const department = matchedCity?.department || (hash % 3 === 0 ? 'Département local' : 'Zone métropolitaine');
    const climateZoneType = matchedCity?.climateZone || (hash % 4 === 0 ? 'mediterranean' : hash % 4 === 1 ? 'oceanic' : hash % 4 === 2 ? 'continental' : 'mountain');

    let climateZone = "Océanique";
    let re2020Zone = "H2a";
    let summerPeakTemp = "36°C";
    let winterMinTemp = "-3°C";
    let copEst = "4.6";
    let seerEst = "7.8";
    let estimatedSavingsPct = "65%";
    let housingTip = "Installation idéale dans les combles perdus ou sous faux-plafond acoustique.";

    if (climateZoneType === 'mediterranean') {
        climateZone = "Méditerranéen (Étés très chauds & secs)";
        re2020Zone = "H3 (Zone Littoral & Sud)";
        summerPeakTemp = "39°C";
        winterMinTemp = "2°C";
        copEst = "4.8";
        seerEst = "8.2";
        estimatedSavingsPct = "70%";
        housingTip = "Priorité au rafraîchissement performant et à l'isolation renforcée des liaisons frigorifiques sous toiture.";
    } else if (climateZoneType === 'mountain') {
        climateZone = "Montagnard (Amplitudes thermiques fortes)";
        re2020Zone = "H1c (Zone Altitude)";
        summerPeakTemp = "32°C";
        winterMinTemp = "-10°C";
        copEst = "4.4";
        seerEst = "7.2";
        estimatedSavingsPct = "60%";
        housingTip = "Pompe à chaleur réversible grand froid avec technologie Inverter et maintien de puissance calorifique jusqu'à -15°C.";
    } else if (climateZoneType === 'continental') {
        climateZone = "Semi-Continental / Est";
        re2020Zone = "H1b (Zone Nord-Est)";
        summerPeakTemp = "37°C";
        winterMinTemp = "-7°C";
        copEst = "4.5";
        seerEst = "7.5";
        estimatedSavingsPct = "62%";
        housingTip = "Combinaison gainable réversible avec régulation programmable multizone Airzone ou Delta Dore.";
    }

    const priceIndex = matchedCity?.priceIndex || 1.0;
    const baseT1 = Math.round(4800 * priceIndex);
    const baseT3 = Math.round(8200 * priceIndex);
    const baseVilla = Math.round(11500 * priceIndex);

    const priceEstimates = {
        t1t2: `${baseT1.toLocaleString('fr-FR')} € à ${(baseT1 + 1500).toLocaleString('fr-FR')} € TTC`,
        t3t4: `${baseT3.toLocaleString('fr-FR')} € à ${(baseT3 + 2800).toLocaleString('fr-FR')} € TTC`,
        villa: `${baseVilla.toLocaleString('fr-FR')} € à ${(baseVilla + 4000).toLocaleString('fr-FR')} € TTC`,
    };

    const dpeImpact = `Amélioration du Diagnostic de Performance Énergétique (DPE) d'au moins 1 à 2 classes (ex: passage de D à B) à ${normalizedName}.`;
    const re2020Compliance = `Respect strict du seuil de confort d'été Degrés-Heures (DH < 350 DH) exigé par la réglementation RE2020 pour le secteur de ${department}.`;

    const catchphrase = matchedCity?.catchphrase || `Solution de climatisation réversible gainable sur-mesure à ${normalizedName}`;

    const keyPoints = [
        `Étude de dimensionnement thermique spécifique au climat et au relief de ${normalizedName} (${region}).`,
        `Conformité garantie avec l'indice de confort d'été (DH) et les exigences environnementales RE2020.`,
        `Système réversible gainable invisible avec diffuseurs ultra-silencieux (< 21 dB) et régulation pièce par pièce.`,
        `Éligibilité aux aides financières (Primes CEE, MaPrimeRénov') avec les artisans RGE qualifiés à ${normalizedName}.`
    ];

    const localFaqs = [
        {
            question: `Combien coûte l'installation d'une climatisation gainable à ${normalizedName} ?`,
            response: `À ${normalizedName} (${department}), l'installation d'un système gainable réversible varie entre ${priceEstimates.t3t4} pour un logement T3/T4 de 80 m² et ${priceEstimates.villa} pour une villa individuelle de 120 m², incluant le matériel de marque (Daikin, Mitsubishi, Atlantic), la pose et la régulation multizone.`
        },
        {
            question: `Quels sont les délais d'intervention d'un installateur RGE à ${normalizedName} ?`,
            response: `Les entreprises qualifiées RGE basées à ${normalizedName} ou dans la région ${region} interviennent généralement sous 2 à 3 semaines pour effectuer la visite technique préalable et établir une étude de déperdition thermique gratuite.`
        },
        {
            question: `Pourquoi installer un gainable réversible plutôt que des splits muraux à ${normalizedName} ?`,
            response: `Le gainable est 100% invisible (seuls de discrets grilles de soufflage sont visibles au plafond), évite les flux d'air directs désagréables, garantit un silence absolu et valorise la valeur vénale immobilière de votre bien à ${normalizedName}.`
        },
        {
            question: `Quelle économie d'énergie réaliser avec une PAC gainable à ${normalizedName} ?`,
            response: `Grâce au coefficient de performance (COP de ${copEst}), une pompe à chaleur air-air gainable restitue jusqu'à ${estimatedSavingsPct} d'énergie gratuite prélevée dans l'air extérieur, permettant de diviser par 3 vos factures de chauffage à ${normalizedName}.`
        }
    ];

    return {
        cityName: normalizedName,
        department,
        region,
        climateZone,
        re2020Zone,
        summerPeakTemp,
        winterMinTemp,
        copEst,
        seerEst,
        estimatedSavingsPct,
        catchphrase,
        housingTip,
        priceEstimates,
        dpeImpact,
        re2020Compliance,
        keyPoints,
        localFaqs
    };
}
