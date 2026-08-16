import { CITIES_100, CityData } from '@/data/cities-100';

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
    keyPoints: string[];
    localFaqs: { question: string; response: string }[];
}

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
    const hash = stringHash(normalizedName);

    // Try to find exact match in cities database
    const matchedCity = CITIES_100.find(c => c.name.toLowerCase() === normalizedName.toLowerCase() || c.slug === normalizedName.toLowerCase());

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
        climateZone = "Méditerranéen (Étés très chauds)";
        re2020Zone = "H3 (Zone Sud & Littoral)";
        summerPeakTemp = "39°C";
        winterMinTemp = "2°C";
        copEst = "4.8";
        seerEst = "8.2";
        estimatedSavingsPct = "70%";
        housingTip = "Priorité au rafraîchissement performant et à l'isolation des réseaux sous toiture.";
    } else if (climateZoneType === 'mountain') {
        climateZone = "Montagnard (Amplitudes thermiques fortes)";
        re2020Zone = "H1c (Zone Altitude)";
        summerPeakTemp = "32°C";
        winterMinTemp = "-10°C";
        copEst = "4.4";
        seerEst = "7.2";
        estimatedSavingsPct = "60%";
        housingTip = "Pompe à chaleur réversible certifiée grand froid avec maintien de puissance jusqu'à -15°C.";
    } else if (climateZoneType === 'continental') {
        climateZone = "Semi-Continental / Est";
        re2020Zone = "H1b (Nord-Est)";
        summerPeakTemp = "37°C";
        winterMinTemp = "-7°C";
        copEst = "4.5";
        seerEst = "7.5";
        estimatedSavingsPct = "62%";
        housingTip = "Combinaison gainable réversible avec régulation programmable multizone.";
    }

    const catchphrase = matchedCity?.catchphrase || `Solution de climatisation réversible gainable sur-mesure à ${normalizedName}`;

    const keyPoints = [
        `Étude de dimensionnement thermique adaptée au climat de ${normalizedName} (${region}).`,
        `Conformité totale avec les indices de confort d'été (DH) de la Réglementation Environnementale RE2020.`,
        `Système gainable ultra-silencieux (< 21 dB) invisible avec régulation multizone indépendante.`,
        `Éligibilité aux primes CEE et MaPrimeRénov' avec les installateurs RGE partenaires à ${normalizedName}.`
    ];

    const localFaqs = [
        {
            question: `Combien coûte l'installation d'une climatisation gainable à ${normalizedName} ?`,
            response: `À ${normalizedName}, le tarif moyen pour une maison de 100 m² varie entre 8 500 € et 13 000 € TTC pose comprise, selon la marque (Daikin, Mitsubishi, Atlantic) et le système de régulation multizone sélectionné.`
        },
        {
            question: `Quels sont les délais d'intervention d'un installateur certifié à ${normalizedName} ?`,
            response: `Les artisans certifiés RGE basés à ${normalizedName} et dans le secteur de ${department} interviennent généralement sous 2 à 4 semaines pour une étude thermique préalable et la pose complète.`
        },
        {
            question: `Pourquoi privilégier le système gainable réversible plutôt que des splits muraux à ${normalizedName} ?`,
            response: `Le gainable est 100% invisible (dissimulé dans les combles), répartit l'air chaud ou froid sans courant d'air direct et offre une valeur patrimoniale supérieure à votre logement à ${normalizedName}.`
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
        keyPoints,
        localFaqs
    };
}
