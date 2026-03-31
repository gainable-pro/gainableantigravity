import fs from 'fs';
import path from 'path';

// Load current files as raw strings (so we can just regex string manipulation to append cleanly)
const extendedPath = path.join(process.cwd(), 'src', 'data', 'cities-extended.ts');
let content = fs.readFileSync(extendedPath, 'utf8');

const TOURIST_CITIES = [
    // Alpes / Ski (FR)
    { name: "Chamonix-Mont-Blanc", slug: "chamonix-mont-blanc", zip: "74400", department: "74", region: "Auvergne-Rhône-Alpes", country: "FR", climateZone: "mountain", housingType: "historique", priceIndex: 1.3, catchphrase: "Le confort été comme hiver face au Mont-Blanc" },
    { name: "Annecy", slug: "annecy", zip: "74000", department: "74", region: "Auvergne-Rhône-Alpes", country: "FR", climateZone: "mountain", housingType: "urbain-dense", priceIndex: 1.25, catchphrase: "Premium pour votre logement sur le bassin annécien" },
    { name: "Megève", slug: "megeve", zip: "74120", department: "74", region: "Auvergne-Rhône-Alpes", country: "FR", climateZone: "mountain", housingType: "historique", priceIndex: 1.4, catchphrase: "Une installation discrète pour votre chalet haut de gamme" },
    { name: "Courchevel", slug: "courchevel", zip: "73120", department: "73", region: "Auvergne-Rhône-Alpes", country: "FR", climateZone: "mountain", housingType: "historique", priceIndex: 1.4, catchphrase: "Technologie Grand Froid pour votre chalet premium" },
    { name: "Val-d'Isère", slug: "val-d-isere", zip: "73150", department: "73", region: "Auvergne-Rhône-Alpes", country: "FR", climateZone: "mountain", housingType: "historique", priceIndex: 1.35, catchphrase: "Un chauffage thermodynamique idéal en station d'altitude" },
    { name: "Morzine", slug: "morzine", zip: "74110", department: "74", region: "Auvergne-Rhône-Alpes", country: "FR", climateZone: "mountain", housingType: "historique", priceIndex: 1.25, catchphrase: "Une température maîtrisée aux portes du soleil" },

    // Côte d'Azur (FR)
    { name: "Saint-Tropez", slug: "saint-tropez", zip: "83990", department: "83", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "historique", priceIndex: 1.4, catchphrase: "Climatisation invisible pour villas de luxe" },
    { name: "Cassis", slug: "cassis", zip: "13260", department: "13", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "historique", priceIndex: 1.3, catchphrase: "Le frais discret au cœur du parc national des Calanques" },
    { name: "Sainte-Maxime", slug: "sainte-maxime", zip: "83120", department: "83", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "recent", priceIndex: 1.2, catchphrase: "Profitez de votre été sur le front de mer au frais" },
    { name: "Bandol", slug: "bandol", zip: "83150", department: "83", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "recent", priceIndex: 1.2, catchphrase: "Régulation thermique parfaite sur la côte varoise" },
    { name: "Menton", slug: "menton", zip: "06500", department: "06", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "historique", priceIndex: 1.25, catchphrase: "Le système gainable idéal de la Perle de la France" },
    { name: "Antibes", slug: "antibes", zip: "06600", department: "06", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "urbain-dense", priceIndex: 1.2, catchphrase: "L’air frais silencieux près du Cap d'Antibes" },
    { name: "Grasse", slug: "grasse", zip: "06130", department: "06", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "historique", priceIndex: 1.15, catchphrase: "Améliorez la qualité de l'air de votre belle bastide" },
    { name: "Saint-Jean-Cap-Ferrat", slug: "saint-jean-cap-ferrat", zip: "06230", department: "06", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "historique", priceIndex: 1.5, catchphrase: "Excellence et discrétion dans votre résidence" },

    // Atlantique / Ouest (FR)
    { name: "Biarritz", slug: "biarritz", zip: "64200", department: "64", region: "Nouvelle-Aquitaine", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.3, catchphrase: "Confort premium face à l'océan Atlantique" },
    { name: "Saint-Jean-de-Luz", slug: "saint-jean-de-luz", zip: "64500", department: "64", region: "Nouvelle-Aquitaine", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.25, catchphrase: "Un ajustement thermique discret au Pays Basque" },
    { name: "Arcachon", slug: "arcachon", zip: "33120", department: "33", region: "Nouvelle-Aquitaine", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.3, catchphrase: "Chauffe et refroidit idéalement votre villa arcachonnaise" },
    { name: "Cap-Ferret", slug: "cap-ferret", zip: "33970", department: "33", region: "Nouvelle-Aquitaine", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.4, catchphrase: "Élégance et pompe à chaleur réversible sur la presqu'île" },
    { name: "Lège-Cap-Ferret", slug: "lege-cap-ferret", zip: "33950", department: "33", region: "Nouvelle-Aquitaine", country: "FR", climateZone: "oceanic", housingType: "recent", priceIndex: 1.35, catchphrase: "Une installation discrète au milieu des pins" },
    { name: "Île de Ré", slug: "ile-de-re", zip: "17410", department: "17", region: "Nouvelle-Aquitaine", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.35, catchphrase: "Contrôlez l'humidité et la chaleur dans votre maison rhétaise" },
    { name: "Les Sables-d'Olonne", slug: "les-sables-dolonne", zip: "85100", department: "85", region: "Pays de la Loire", country: "FR", climateZone: "oceanic", housingType: "recent", priceIndex: 1.15, catchphrase: "Fini les chaudes nuits sans clim sur la côte vendéenne" },
    { name: "La Baule-Escoublac", slug: "la-baule-escoublac", zip: "44500", department: "44", region: "Pays de la Loire", country: "FR", climateZone: "oceanic", housingType: "recent", priceIndex: 1.25, catchphrase: "Votre appartement de la magnifique baie climatisé" },
    { name: "Saint-Malo", slug: "saint-malo", zip: "35400", department: "35", region: "Bretagne", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.2, catchphrase: "Le système discret pour votre malouinière corsaire" },
    { name: "Dinard", slug: "dinard", zip: "35800", department: "35", region: "Bretagne", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.25, catchphrase: "Faites respirer les hauts plafonds de vos villas" },

    // Normandie / Nord
    { name: "Deauville", slug: "deauville", zip: "14800", department: "14", region: "Normandie", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.35, catchphrase: "Performance et élégance cachée sur les planches" },
    { name: "Honfleur", slug: "honfleur", zip: "14600", department: "14", region: "Normandie", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.2, catchphrase: "La modernité thermodynamique au cœur du vieux bassin" },
    { name: "Cabourg", slug: "cabourg", zip: "14390", department: "14", region: "Normandie", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.2, catchphrase: "Un rafraîchissement d'appoint sur la côte fleurie" },
    { name: "Le Touquet-Paris-Plage", slug: "le-touquet-paris-plage", zip: "62520", department: "62", region: "Hauts-de-France", country: "FR", climateZone: "oceanic", housingType: "historique", priceIndex: 1.3, catchphrase: "Pour votre belle maison touquettoise" },

    // Terres / Histoire (FR)
    { name: "Sarlat-la-Canéda", slug: "sarlat-la-caneda", zip: "24200", department: "24", region: "Nouvelle-Aquitaine", country: "FR", climateZone: "temperate", housingType: "historique", priceIndex: 1.15, catchphrase: "Restez au frais lors d'un lourd été en Dordogne" },
    { name: "Rocamadour", slug: "rocamadour", zip: "46500", department: "46", region: "Occitanie", country: "FR", climateZone: "temperate", housingType: "historique", priceIndex: 1.1, catchphrase: "L'équipement thermique furtif pour votre gîte lotois" },
    { name: "Colmar", slug: "colmar", zip: "68000", department: "68", region: "Grand Est", country: "FR", climateZone: "continental", housingType: "historique", priceIndex: 1.15, catchphrase: "Chaleur l'hiver purifiant l'air l'été" },
    { name: "Riquewihr", slug: "riquewihr", zip: "68340", department: "68", region: "Grand Est", country: "FR", climateZone: "continental", housingType: "historique", priceIndex: 1.1, catchphrase: "Un confort gainé au coeur de l'histoire alsacienne" },
    { name: "Gordes", slug: "gordes", zip: "84220", department: "84", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "historique", priceIndex: 1.3, catchphrase: "Le système luxueux pour ce joyau perché en Luberon" },
    { name: "Avignon", slug: "avignon", zip: "84000", department: "84", region: "Provence-Alpes-Côte d'Azur", country: "FR", climateZone: "mediterranean", housingType: "historique", priceIndex: 1.1, catchphrase: "Profitez d'un air frais intra-muros et extra-muros" },
    { name: "Carcassonne", slug: "carcassonne", zip: "11000", department: "11", region: "Occitanie", country: "FR", climateZone: "mediterranean", housingType: "historique", priceIndex: 1.05, catchphrase: "Régulation optimale de la Bastide jusqu'à la Cité" },
    { name: "Lourdes", slug: "lourdes", zip: "65100", department: "65", region: "Occitanie", country: "FR", climateZone: "mountain", housingType: "historique", priceIndex: 1.0, catchphrase: "Mettez vos pèlerins et visiteurs à l'aise aux heures chaudes" },
    
    // Suisse 
    { name: "Zermatt", slug: "zermatt", zip: "3920", department: "VS", region: "Valais", country: "CH", climateZone: "mountain", housingType: "historique", priceIndex: 1.5, catchphrase: "Le choix Hyper Heating face au mythique Cervin" },
    { name: "Interlaken", slug: "interlaken", zip: "3800", department: "BE", region: "Berne", country: "CH", climateZone: "mountain", housingType: "historique", priceIndex: 1.4, catchphrase: "Parfaite tempérance entre les magnifiques lacs suisses" },
    { name: "Montreux", slug: "montreux", zip: "1820", department: "VD", region: "Vaud", country: "CH", climateZone: "mountain", housingType: "historique", priceIndex: 1.45, catchphrase: "Vivez le confort premium sur la riviera vaudoise" },
    { name: "Gstaad", slug: "gstaad", zip: "3780", department: "BE", region: "Berne", country: "CH", climateZone: "mountain", housingType: "historique", priceIndex: 1.6, catchphrase: "Expertise de pointe pour vos propriétés d'exception" },
    { name: "Lucerne", slug: "lucerne", zip: "6000", department: "LU", region: "Lucerne", country: "CH", climateZone: "temperate", housingType: "turbos-dense", priceIndex: 1.35, catchphrase: "La pompe à chaleur qui valorise votre patrimoine" },
    { name: "Lugano", slug: "lugano", zip: "6900", department: "TI", region: "Tessin", country: "CH", climateZone: "mediterranean", housingType: "recent", priceIndex: 1.4, catchphrase: "Discrétion et rafraîchissement au sud des Alpes" },
    { name: "St. Moritz", slug: "st-moritz", zip: "7500", department: "GR", region: "Grisons", country: "CH", climateZone: "mountain", housingType: "historique", priceIndex: 1.6, catchphrase: "Le système thermodynamique le plus exigeant testé sous zéro" },
    { name: "Verbier", slug: "verbier", zip: "1936", department: "VS", region: "Valais", country: "CH", climateZone: "mountain", housingType: "historique", priceIndex: 1.5, catchphrase: "Contrôlez l'ambiance de votre luxueux chalet 4 Vallées" },
    
    // Belgique
    { name: "Bruges", slug: "bruges", zip: "8000", department: "VWV", region: "Flandre", country: "BE", climateZone: "oceanic", housingType: "historique", priceIndex: 1.2, catchphrase: "Air réversible invisible pour ne pas altérer les canaux de Brugge" },
    { name: "Gand", slug: "gand", zip: "9000", department: "VOV", region: "Flandre", country: "BE", climateZone: "temperate", housingType: "urbain-dense", priceIndex: 1.15, catchphrase: "L'équipement de climatisation le plus prisé à Gent" },
    { name: "Ostende", slug: "ostende", zip: "8400", department: "VWV", region: "Flandre", country: "BE", climateZone: "oceanic", housingType: "recent", priceIndex: 1.15, catchphrase: "La solution saline de PAC adaptée à la reine des plages" },
    { name: "Knokke-Heist", slug: "knokke-heist", zip: "8300", department: "VWV", region: "Flandre", country: "BE", climateZone: "oceanic", housingType: "recent", priceIndex: 1.3, catchphrase: "Confort 5 étoiles caché pour les villas du littoral belge" },
    { name: "Durbuy", slug: "durbuy", zip: "6940", department: "WLX", region: "Wallonie", country: "BE", climateZone: "temperate", housingType: "historique", priceIndex: 1.15, catchphrase: "Un chauffage en douceur pour la plus petite ville ardennaise" },
    { name: "Dinant", slug: "dinant", zip: "5500", department: "WNA", region: "Wallonie", country: "BE", climateZone: "temperate", housingType: "historique", priceIndex: 1.05, catchphrase: "Une solution silencieuse pour votre nid aux abords de la Meuse" },
    { name: "Spa", slug: "spa", zip: "4900", department: "WLG", region: "Wallonie", country: "BE", climateZone: "temperate", housingType: "historique", priceIndex: 1.1, catchphrase: "La discrétion et la performance dans des lieux thermaux majestueux" },
    { name: "Bastogne", slug: "bastogne", zip: "6600", department: "WLX", region: "Wallonie", country: "BE", climateZone: "temperate", housingType: "historique", priceIndex: 1.0, catchphrase: "La modernité thermodynamique au cœur des Ardennes" }
];

function stringifyCity(city: any) {
    return `{ name: "${city.name}", slug: "${city.slug}", zip: "${city.zip}", department: "${city.department}", region: "${city.region}", country: "${city.country}", climateZone: "${city.climateZone}", housingType: "${city.housingType}", priceIndex: ${city.priceIndex}, catchphrase: "${city.catchphrase.replace(/"/g, '\\"')}" }`;
}

// Find the position before the final export array closes
const lines = content.split('\n');
const insertIndex = lines.findLastIndex(l => l.includes('];'));

const chunksToInsert = TOURIST_CITIES.map(c => '    ' + stringifyCity(c) + ',');
lines.splice(insertIndex, 0, ...chunksToInsert);

fs.writeFileSync(extendedPath, lines.join('\n'), 'utf8');

console.log(`Successfully injected ${TOURIST_CITIES.length} high-value tourist cities!`);
