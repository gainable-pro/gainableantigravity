import fs from 'fs';
import path from 'path';
import { CITIES_100 } from '../src/data/cities-100';
import { CITIES_EXTENDED } from '../src/data/cities-extended';

// Helper to stringify back to the TS file format
function stringifyCity(city: any) {
    let base = `{ name: "${city.name}", slug: "${city.slug}", zip: "${city.zip}", department: "${city.department}", region: "${city.region}", `;
    if (city.country) base += `country: "${city.country}", `;
    base += `climateZone: "${city.climateZone}", housingType: "${city.housingType}", priceIndex: ${city.priceIndex}, catchphrase: "${city.catchphrase.replace(/"/g, '\\"')}" }`;
    return base;
}

const seenSlugs = new Set(CITIES_100.map(c => c.slug));
const uniqueExtended = [];

for (const city of CITIES_EXTENDED) {
    if (!seenSlugs.has(city.slug)) {
        seenSlugs.add(city.slug);
        uniqueExtended.push(city);
    } else {
        console.log("DELETED DUPLICATE:", city.name);
    }
}

const fileContent = `import { CityData } from './cities-100';\n\nexport const CITIES_EXTENDED: CityData[] = [\n${uniqueExtended.map(c => '    ' + stringifyCity(c)).join(',\n')}\n];\n`;

const extendedPath = path.join(process.cwd(), 'src', 'data', 'cities-extended.ts');
fs.writeFileSync(extendedPath, fileContent, 'utf-8');

console.log(`Deduplication finished. CITIES_EXTENDED now has ${uniqueExtended.length} unique cities.`);
