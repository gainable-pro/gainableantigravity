const fs = require('fs');
const path = require('path');

const companies = [
  { domain: "gainable.fr", name: "Gainable.fr (Votre site)", sitemapSize: 23450, seoScore: 94, reviewScore: 4.9, reviewCount: 124, aiCitations: 52, isSelf: true },
  { domain: "maclem.fr", name: "Maclem", sitemapSize: 12500, seoScore: 86, reviewScore: 4.8, reviewCount: 450, aiCitations: 22, isSelf: false },
  { domain: "izi-by-edf.fr", name: "IZI by EDF", sitemapSize: 8400, seoScore: 91, reviewScore: 4.6, reviewCount: 1850, aiCitations: 45, isSelf: false },
  { domain: "engie-homeservices.fr", name: "ENGIE Home Services", sitemapSize: 14500, seoScore: 88, reviewScore: 4.4, reviewCount: 2200, aiCitations: 38, isSelf: false },
  { domain: "garanka.fr", name: "Garanka", sitemapSize: 6800, seoScore: 83, reviewScore: 4.5, reviewCount: 950, aiCitations: 18, isSelf: false },
  { domain: "cham.fr", name: "CHAM", sitemapSize: 5200, seoScore: 80, reviewScore: 4.3, reviewCount: 650, aiCitations: 12, isSelf: false }
];

const cities = [
  "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille",
  "Rennes", "Reims", "Saint-Etienne", "Le Havre", "Toulon", "Grenoble", "Dijon", "Angers", "Nimes", "Villeurbanne",
  "Saint-Denis", "Le Mans", "Aix-en-Provence", "Clermont-Ferrand", "Brest", "Limoges", "Tours", "Amiens", "Perpignan",
  "Metz", "Boulogne-Billancourt", "Besancon", "Orleans", "Rouen", "Mulhouse", "Caen", "Nancy", "Saint-Paul",
  "Argenteuil", "Montreuil", "Roubaix", "Dunkerque", "Tourcoing", "Creteil", "Avignon", "Nanterre", "Poitiers",
  "Courbevoie", "Versailles", "Vitry-sur-Seine"
];

const prefixes = ["clim", "climatisation", "pac", "clim-energie", "eco-clim", "sud-clim", "nord-pac"];
const suffixes = ["service", "installateur", "confort", "concept", "pro", "artisan", "france"];

let count = companies.length;
const domainsSet = new Set(companies.map(c => c.domain));

// Helper to generate a random domain and name
function generateCompany(index) {
  const city = cities[index % cities.length];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  
  const cleanCity = city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
  
  // Format domain: e.g. climatisation-marseille-service.fr or clim-lyon-confort.fr
  const domain = `${prefix}-${cleanCity}-${suffix}.fr`;
  
  if (domainsSet.has(domain)) {
    return null;
  }
  domainsSet.add(domain);
  
  const formattedCity = city;
  const capitalizedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  const capitalizedSuffix = suffix.charAt(0).toUpperCase() + suffix.slice(1);
  const name = `${capitalizedPrefix} ${formattedCity} ${capitalizedSuffix}`;
  
  const sitemapSize = Math.floor(Math.random() * 4500) + 150;
  const seoScore = Math.floor(Math.random() * 35) + 60; // 60 to 95
  const reviewScore = parseFloat((Math.random() * 1.2 + 3.8).toFixed(1)); // 3.8 to 5.0
  const reviewCount = Math.floor(Math.random() * 250) + 5;
  const aiCitations = Math.floor(Math.random() * 18) + 1;
  
  return {
    domain,
    name,
    sitemapSize,
    seoScore,
    reviewScore,
    reviewCount,
    aiCitations,
    isSelf: false
  };
}

let attempt = 0;
while (companies.length < 150 && attempt < 1000) {
  attempt++;
  const comp = generateCompany(companies.length);
  if (comp) {
    companies.push(comp);
  }
}

// Write file
const filePath = path.join(__dirname, '..', 'src', 'data', 'seo-competitors.json');
fs.writeFileSync(filePath, JSON.stringify(companies, null, 2), 'utf-8');
console.log(`Successfully generated ${companies.length} competitors in ${filePath}`);
