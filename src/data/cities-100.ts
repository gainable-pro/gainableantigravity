
export interface CityData {
    name: string;
    slug: string;
    zip: string;
    department: string; // e.g., "33 - Gironde"
    region: string; // e.g., "Nouvelle-Aquitaine"
    climateZone: 'oceanic' | 'mediterranean' | 'continental' | 'mountain' | 'semi-continental';
    housingType: 'mixte' | 'urbain-dense' | 'pavillonnaire' | 'historique';
    priceIndex: number; // 1.0 = Average, 1.2 = expensive (Paris), 0.9 = cheaper
    catchphrase: string;
}

export const CITIES_100: CityData[] = [
    // TOP 10
    { name: "Paris", slug: "paris", zip: "75000", department: "75", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.3, catchphrase: "climatisation discrète pour appartements haussmanniens" },
    { name: "Marseille", slug: "marseille", zip: "13000", department: "13", region: "Provence-Alpes-Côte d'Azur", climateZone: "mediterranean", housingType: "mixte", priceIndex: 1.0, catchphrase: "fraîcheur essentielle face aux étés caniculaires" },
    { name: "Lyon", slug: "lyon", zip: "69000", department: "69", region: "Auvergne-Rhône-Alpes", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.1, catchphrase: "confort thermique été comme hiver" },
    { name: "Toulouse", slug: "toulouse", zip: "31000", department: "31", region: "Occitanie", climateZone: "semi-continental", housingType: "mixte", priceIndex: 1.0, catchphrase: "solutions gainables pour la ville rose" },
    { name: "Nice", slug: "nice", zip: "06000", department: "06", region: "Provence-Alpes-Côte d'Azur", climateZone: "mediterranean", housingType: "urbain-dense", priceIndex: 1.2, catchphrase: "climatisation silencieuse pour le bord de mer" },
    { name: "Nantes", slug: "nantes", zip: "44000", department: "44", region: "Pays de la Loire", climateZone: "oceanic", housingType: "mixte", priceIndex: 1.0, catchphrase: "confort moderne pour le climat océanique" },
    { name: "Montpellier", slug: "montpellier", zip: "34000", department: "34", region: "Occitanie", climateZone: "mediterranean", housingType: "mixte", priceIndex: 1.0, catchphrase: "fraîcheur optimale sous le soleil du sud" },
    { name: "Strasbourg", slug: "strasbourg", zip: "67000", department: "67", region: "Grand Est", climateZone: "continental", housingType: "historique", priceIndex: 1.0, catchphrase: "chauffage et clim pour les variations alsaciennes" },
    { name: "Bordeaux", slug: "bordeaux", zip: "33000", department: "33", region: "Nouvelle-Aquitaine", climateZone: "oceanic", housingType: "historique", priceIndex: 1.1, catchphrase: "climatisation invisible pour échoppes et appartements" },
    { name: "Lille", slug: "lille", zip: "59000", department: "59", region: "Hauts-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 0.95, catchphrase: "confort thermique adapté au Nord" },

    // 11-20
    { name: "Rennes", slug: "rennes", zip: "35000", department: "35", region: "Bretagne", climateZone: "oceanic", housingType: "mixte", priceIndex: 1.0, catchphrase: "solutions éco-responsables en Bretagne" },
    { name: "Reims", slug: "reims", zip: "51100", department: "51", region: "Grand Est", climateZone: "semi-continental", housingType: "historique", priceIndex: 0.95, catchphrase: "confort toute saison en Champagne" },
    { name: "Toulon", slug: "toulon", zip: "83000", department: "83", region: "Provence-Alpes-Côte d'Azur", climateZone: "mediterranean", housingType: "urbain-dense", priceIndex: 1.0, catchphrase: "fraîcheur indispensable sur la côte" },
    { name: "Saint-Étienne", slug: "saint-etienne", zip: "42000", department: "42", region: "Auvergne-Rhône-Alpes", climateZone: "semi-continental", housingType: "mixte", priceIndex: 0.9, catchphrase: "chauffage performant pour les hivers rigoureux" },
    { name: "Le Havre", slug: "le-havre", zip: "76600", department: "76", region: "Normandie", climateZone: "oceanic", housingType: "urbain-dense", priceIndex: 0.9, catchphrase: "confort thermique en Normandie" },
    { name: "Grenoble", slug: "grenoble", zip: "38000", department: "38", region: "Auvergne-Rhône-Alpes", climateZone: "mountain", housingType: "mixte", priceIndex: 1.0, catchphrase: "solutions adaptées au climat alpin" },
    { name: "Dijon", slug: "dijon", zip: "21000", department: "21", region: "Bourgogne-Franche-Comté", climateZone: "semi-continental", housingType: "historique", priceIndex: 0.95, catchphrase: "confort et patrimoine en Bourgogne" },
    { name: "Angers", slug: "angers", zip: "49000", department: "49", region: "Pays de la Loire", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.95, catchphrase: "douceur angevine et confort moderne" },
    { name: "Nîmes", slug: "nimes", zip: "30000", department: "30", region: "Occitanie", climateZone: "mediterranean", housingType: "historique", priceIndex: 0.95, catchphrase: "fraîcheur essentielle face au climat gardois" },
    { name: "Villeurbanne", slug: "villeurbanne", zip: "69100", department: "69", region: "Auvergne-Rhône-Alpes", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.0, catchphrase: "solutions gainables pour l'agglomération lyonnaise" },

    // Representative mix of others for 100 coverage (shortened list for dev, but structure allows 100)
    { name: "Aix-en-Provence", slug: "aix-en-provence", zip: "13100", department: "13", region: "Provence-Alpes-Côte d'Azur", climateZone: "mediterranean", housingType: "pavillonnaire", priceIndex: 1.2, catchphrase: "confort premium en Provence" },
    { name: "Clermont-Ferrand", slug: "clermont-ferrand", zip: "63000", department: "63", region: "Auvergne-Rhône-Alpes", climateZone: "semi-continental", housingType: "mixte", priceIndex: 0.9, catchphrase: "chauffage et clim au pied des volcans" },
    { name: "Le Mans", slug: "le-mans", zip: "72000", department: "72", region: "Pays de la Loire", climateZone: "oceanic", housingType: "pavillonnaire", priceIndex: 0.9, catchphrase: "confort thermique accessible" },
    { name: "Brest", slug: "brest", zip: "29200", department: "29", region: "Bretagne", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.9, catchphrase: "gestion de l'humidité et chauffage efficace" },
    { name: "Tours", slug: "tours", zip: "37000", department: "37", region: "Centre-Val de Loire", climateZone: "oceanic", housingType: "historique", priceIndex: 0.95, catchphrase: "confort moderne au cœur de la Loire" },
    { name: "Amiens", slug: "amiens", zip: "80000", department: "80", region: "Hauts-de-France", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.9, catchphrase: "chauffage performant pour la Picardie" },
    { name: "Limoges", slug: "limoges", zip: "87000", department: "87", region: "Nouvelle-Aquitaine", climateZone: "semi-continental", housingType: "mixte", priceIndex: 0.9, catchphrase: "confort abordable en Limousin" },
    { name: "Annecy", slug: "annecy", zip: "74000", department: "74", region: "Auvergne-Rhône-Alpes", climateZone: "mountain", housingType: "mixte", priceIndex: 1.2, catchphrase: "confort haut de gamme entre lac et montagnes" },
    { name: "Perpignan", slug: "perpignan", zip: "66000", department: "66", region: "Occitanie", climateZone: "mediterranean", housingType: "mixte", priceIndex: 0.9, catchphrase: "clim indispensable en Roussillon" },
    { name: "Boulogne-Billancourt", slug: "boulogne-billancourt", zip: "92100", department: "92", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.3, catchphrase: "solutions discrètes pour appartements" },
    { name: "Metz", slug: "metz", zip: "57000", department: "57", region: "Grand Est", climateZone: "semi-continental", housingType: "historique", priceIndex: 0.95, catchphrase: "chauffage efficace en Lorraine" },
    { name: "Besançon", slug: "besancon", zip: "25000", department: "25", region: "Bourgogne-Franche-Comté", climateZone: "semi-continental", housingType: "historique", priceIndex: 0.9, catchphrase: "confort thermique en Franche-Comté" },
    { name: "Orléans", slug: "orleans", zip: "45000", department: "45", region: "Centre-Val de Loire", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.95, catchphrase: "solutions modernes en bord de Loire" },
    { name: "Saint-Denis", slug: "saint-denis", zip: "93200", department: "93", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.1, catchphrase: "confort urbain en plein essor" },
    { name: "Argenteuil", slug: "argenteuil", zip: "95100", department: "95", region: "Île-de-France", climateZone: "semi-continental", housingType: "pavillonnaire", priceIndex: 1.0, catchphrase: "confort pavillonnaire en Île-de-France" },
    { name: "Rouen", slug: "rouen", zip: "76000", department: "76", region: "Normandie", climateZone: "oceanic", housingType: "historique", priceIndex: 0.95, catchphrase: "chauffage et confort en Normandie" },
    { name: "Montreuil", slug: "montreuil", zip: "93100", department: "93", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.1, catchphrase: "solutions modernes pour lofts et maisons" },
    { name: "Mulhouse", slug: "mulhouse", zip: "68100", department: "68", region: "Grand Est", climateZone: "continental", housingType: "mixte", priceIndex: 0.9, catchphrase: "chauffage performant en Alsace" },
    { name: "Caen", slug: "caen", zip: "14000", department: "14", region: "Normandie", climateZone: "oceanic", housingType: "historique", priceIndex: 0.95, catchphrase: "douceur et confort en Normandie" },
    { name: "Nancy", slug: "nancy", zip: "54000", department: "54", region: "Grand Est", climateZone: "semi-continental", housingType: "historique", priceIndex: 0.95, catchphrase: "élégance et confort place Stanislas" },
    { name: "Saint-Paul", slug: "saint-paul", zip: "97460", department: "974", region: "La Réunion", climateZone: "mediterranean", housingType: "pavillonnaire", priceIndex: 1.1, catchphrase: "fraîcheur tropicale indispensable" },
    { name: "Roubaix", slug: "roubaix", zip: "59100", department: "59", region: "Hauts-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 0.85, catchphrase: "rénovation thermique accessible" },
    { name: "Tourcoing", slug: "tourcoing", zip: "59200", department: "59", region: "Hauts-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 0.85, catchphrase: "confort thermique pour le Nord" },
    { name: "Nanterre", slug: "nanterre", zip: "92000", department: "92", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.2, catchphrase: "solutions modernes proche La Défense" },
    { name: "Avignon", slug: "avignon", zip: "84000", department: "84", region: "Provence-Alpes-Côte d'Azur", climateZone: "mediterranean", housingType: "historique", priceIndex: 0.95, catchphrase: "fraîcheur intra-muros et alentours" },
    { name: "Vitry-sur-Seine", slug: "vitry-sur-seine", zip: "94400", department: "94", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.0, catchphrase: "confort urbain en développement" },
    { name: "Créteil", slug: "creteil", zip: "94000", department: "94", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.0, catchphrase: "solutions gainables en Val-de-Marne" },
    { name: "Dunkerque", slug: "dunkerque", zip: "59140", department: "59", region: "Hauts-de-France", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.9, catchphrase: "confort thermique sur le littoral" },
    { name: "Poitiers", slug: "poitiers", zip: "86000", department: "86", region: "Nouvelle-Aquitaine", climateZone: "oceanic", housingType: "historique", priceIndex: 0.9, catchphrase: "confort moderne en Poitou" },
    { name: "Asnières-sur-Seine", slug: "asnieres-sur-seine", zip: "92600", department: "92", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.2, catchphrase: "élégance et confort en bord de Seine" },
    { name: "Versailles", slug: "versailles", zip: "78000", department: "78", region: "Île-de-France", climateZone: "semi-continental", housingType: "historique", priceIndex: 1.3, catchphrase: "confort royal et discret" },
    { name: "Colombes", slug: "colombes", zip: "92700", department: "92", region: "Île-de-France", climateZone: "semi-continental", housingType: "pavillonnaire", priceIndex: 1.1, catchphrase: "confort familial en banlieue ouest" },
    { name: "Aubervilliers", slug: "aubervilliers", zip: "93300", department: "93", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.0, catchphrase: "solutions thermiques en pleine mutation" },
    { name: "Aulnay-sous-Bois", slug: "aulnay-sous-bois", zip: "93600", department: "93", region: "Île-de-France", climateZone: "semi-continental", housingType: "pavillonnaire", priceIndex: 1.0, catchphrase: "confort pavillonnaire et urbain" },
    { name: "Courbevoie", slug: "courbevoie", zip: "92400", department: "92", region: "Île-de-France", climateZone: "semi-continental", housingType: "urbain-dense", priceIndex: 1.2, catchphrase: "climatisation moderne à La Défense" },
    { name: "Cherbourg-en-Cotentin", slug: "cherbourg-en-cotentin", zip: "50100", department: "50", region: "Normandie", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.9, catchphrase: "confort thermique en Cotentin" },
    { name: "Rueil-Malmaison", slug: "rueil-malmaison", zip: "92500", department: "92", region: "Île-de-France", climateZone: "semi-continental", housingType: "pavillonnaire", priceIndex: 1.2, catchphrase: "confort résidentiel haut de gamme" },
    { name: "Pau", slug: "pau", zip: "64000", department: "64", region: "Nouvelle-Aquitaine", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.95, catchphrase: "confort vue Pyrénées" },
    { name: "Champigny-sur-Marne", slug: "champigny-sur-marne", zip: "94500", department: "94", region: "Île-de-France", climateZone: "semi-continental", housingType: "pavillonnaire", priceIndex: 1.0, catchphrase: "confort en bord de Marne" },
    { name: "La Rochelle", slug: "la-rochelle", zip: "17000", department: "17", region: "Nouvelle-Aquitaine", climateZone: "oceanic", housingType: "historique", priceIndex: 1.1, catchphrase: "fraîcheur atlantique et confort" },
    { name: "Calais", slug: "calais", zip: "62100", department: "62", region: "Hauts-de-France", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.85, catchphrase: "isolation et chauffage sur la côte" },
    { name: "Antibes", slug: "antibes", zip: "06600", department: "06", region: "Provence-Alpes-Côte d'Azur", climateZone: "mediterranean", housingType: "pavillonnaire", priceIndex: 1.25, catchphrase: "luxe et fraîcheur sur la Riviera" },
    { name: "Saint-Maur-des-Fossés", slug: "saint-maur-des-fosses", zip: "94100", department: "94", region: "Île-de-France", climateZone: "semi-continental", housingType: "pavillonnaire", priceIndex: 1.2, catchphrase: "quiétude et confort résidentiel" },
    { name: "Mérignac", slug: "merignac", zip: "33700", department: "33", region: "Nouvelle-Aquitaine", climateZone: "oceanic", housingType: "pavillonnaire", priceIndex: 1.05, catchphrase: "climatisation moderne en Gironde" },
    { name: "Béziers", slug: "beziers", zip: "34500", department: "34", region: "Occitanie", climateZone: "mediterranean", housingType: "historique", priceIndex: 0.9, catchphrase: "fraîcheur indispensable en été" },
    { name: "Colmar", slug: "colmar", zip: "68000", department: "68", region: "Grand Est", climateZone: "continental", housingType: "historique", priceIndex: 1.0, catchphrase: "confort au cœur de l'Alsace" },
    { name: "Saint-Nazaire", slug: "saint-nazaire", zip: "44600", department: "44", region: "Pays de la Loire", climateZone: "oceanic", housingType: "mixte", priceIndex: 0.95, catchphrase: "confort moderne face à l'océan" }
];
