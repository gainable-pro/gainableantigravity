import fs from 'fs';
import path from 'path';

// Using relative paths if run via npx tsx in root
import { CITIES_100 } from '../src/data/cities-100.ts';
import { CITIES_EXTENDED } from '../src/data/cities-extended.ts';

function slugify(text: string): string {
    return text.toString().toLowerCase()
        .normalize('NFD') 
        .replace(/[\u0300-\u036f]/g, '') 
        .replace(/[^a-z0-9]+/g, '-') 
        .replace(/(^-|-$)+/g, '');
}

function determineClimate(dpt: string): string {
    const med = ['13', '83', '06', '84', '04', '30', '34', '11', '66', '2A', '2B'];
    const mountain = ['73', '74', '38', '05', '65', '09'];
    const oceanic = ['29', '22', '56', '35', '50', '14', '76', '80', '62', '59', '44', '85', '17', '33', '40', '64'];
    
    if (med.includes(dpt)) return "mediterranean";
    if (mountain.includes(dpt)) return "mountain";
    if (oceanic.includes(dpt)) return "oceanic";
    return "semi-continental";
}

async function buildMediumCities() {
    console.log("=== Extraction API Geo Gouv ===");
    const existingSlugs = new Set([
        ...CITIES_100.map(c => slugify(c.name)),
        ...CITIES_EXTENDED.map(c => slugify(c.name))
    ]);

    console.log(`- Loaded ${existingSlugs.size} existing cities.`);

    console.log("- Fetching from API...");
    const req = await fetch("https://geo.api.gouv.fr/communes?fields=nom,codesPostaux,population,departement,region");
    const communes = await req.json();

    const filtered = communes.filter((c: any) => c.population >= 5000 && c.codesPostaux && c.codesPostaux.length > 0 && c.departement);
    console.log(`- Found ${filtered.length} towns with population > 5000.`);

    const newCities: any[] = [];

    // Add API cities
    for (const c of filtered) {
        const slug = slugify(c.nom);
        if (!existingSlugs.has(slug)) {
            newCities.push({
                name: c.nom,
                slug: slug,
                zip: c.codesPostaux[0],
                department: c.departement,
                region: c.region ? c.region.nom : 'France',
                country: 'FR',
                climateZone: determineClimate(c.departement),
                housingType: c.population < 15000 ? "pavillonnaire" : "mixte",
                priceIndex: 1.0,
                catchphrase: `confort thermique optimisé pour ${c.nom}`
            });
            existingSlugs.add(slug); // prevent internal API dupes
        }
    }

    console.log(`- Extracted ${newCities.length} purely new API communes.`);

    // Add Arrondissements
    const addArrondissements = (baseName: string, max: number, zipPrefix: string, dpt: string, region: string, housingType: string, catchphrase: string) => {
        let count = 0;
        for (let i = 1; i <= max; i++) {
            const arrName = `${baseName} ${i}e Arrondissement`;
            const slug = slugify(arrName);
            if (!existingSlugs.has(slug)) {
                // Formatting zip: e.g. '75' + '001' = 75001 (keep string logic)
                const suffix = i < 10 ? `0${i}` : `${i}`;
                const zip = `${zipPrefix}${suffix}`;
                newCities.push({
                    name: arrName,
                    slug: slug,
                    zip: zip,
                    department: dpt,
                    region: region,
                    country: 'FR',
                    climateZone: determineClimate(dpt),
                    housingType: housingType,
                    priceIndex: 1.3,
                    catchphrase: catchphrase
                });
                count++;
            }
        }
        console.log(`- Added ${count} arrondissements for ${baseName}.`);
    };

    addArrondissements("Paris", 20, "750", "75", "Île-de-France", "historique", "dépannage urgent hyper-centre au propre");
    addArrondissements("Marseille", 16, "130", "13", "Provence-Alpes-Côte d'Azur", "mixte", "votre intérieur au frais face au sud");
    addArrondissements("Lyon", 9, "690", "69", "Auvergne-Rhône-Alpes", "urbain-dense", "clim réversible pour appartement lyonnais");

    console.log(`Total NEW cities to insert: ${newCities.length}`);

    // Generate TypeScript string
    const tsCode = `import { CityData } from './cities-100';\n\nexport const CITIES_MEDIUM: CityData[] = ${JSON.stringify(newCities, null, 4)};\n`;

    const outPath = path.join(__dirname, '../src/data/cities-medium.ts');
    fs.writeFileSync(outPath, tsCode, 'utf8');

    console.log(`-> File effectively written to ${outPath}`);
}

buildMediumCities().catch(console.error);
