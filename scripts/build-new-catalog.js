/**
 * Build new catalog entries from the scraped Sonepar GA4 dataLayer.
 * These products come from the two filtered tabs:
 *  - Tab 1: Ventilation / Airzone Pack plénum zoning (21 produits)
 *  - Tab 2: Climatisation / Cassette, Groupe DRV, Plafonnier — Daikin, Heiwa, Mitsubishi (24+ produits)
 * 
 * These are new additions to the existing sonepar_catalog.json
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// RAW DATA: from GA4 dataLayer (item_name + item_id + price)
// The manufacturerSku = first word before space in item_name
// The soneparSku = mapped from item_id via product page slug convention
// ---------------------------------------------------------------------------

// ── TAB 1: AIRZONE / VENTILATION ──────────────────────────────────────────
const airzoneRaw = [
  { item_name: "PPC25DAIBS07L4 Pack Webserver Medium Daikin 4x200 07L+4x250 (FBA100/125/140)", item_id: "6962", price: "2619.00" },
  { item_name: "PPC25DAIBS07M5 Pack Webserver Medium Daikin 5x200 07M+3x250 (FBA60/71)", item_id: "6967", price: "2789.00" },
  { item_name: "PPC25MELBS01L4 Pack Webserver Medium Mitsu 4x200 01L+4x250 (PEAD100/125)", item_id: "6972", price: "2619.00" },
  { item_name: "PPC25MELBS01M5 Pack Webserver Medium Mitsu 5x200 01M+3x250 (PEAD60/71)", item_id: "6977", price: "2789.00" },
  { item_name: "PPC25MELBS01S2 Pack Webserver Medium Mitsu 2x200 01S+2x250 (PEAD35/50)", item_id: "6979", price: "2019.00" },
  { item_name: "PPC25MELBS01S4 Pack Webserver Medium Mitsu 4x200 01S+2x250 (PEAD35/50)", item_id: "6981", price: "2619.00" },
  { item_name: "PPC25DAIBS07L5 Pack Webserver Medium Daikin 5x200 07L+4x250 (FBA100/125/140)", item_id: "6963", price: "2789.00" },
  { item_name: "PPC25MELBS01L5 Pack Webserver Medium Mitsu 5x200 01L+4x250 (PEAD100/125)", item_id: "6973", price: "2789.00" },
  { item_name: "PP25MELST01XL6 Pack standard QAI Mitsu XL 6 sorties (PEAD140)", item_id: "6455", price: "2596.00" },
  { item_name: "PPC25DAIBS07M3 Pack Webserver Medium Daikin 3x200 07M+3x250 (FBA60/71)", item_id: "6965", price: "2329.00" },
  { item_name: "PPC25MELBS01M3 Pack Webserver Medium Mitsu 3x200 01M+3x250 (PEAD60/71)", item_id: "6975", price: "2329.00" },
  { item_name: "PPC25MELBS01S5 Pack Webserver Medium Mitsu 5x200 01S+2x250 (PEAD35/50)", item_id: "6982", price: "2789.00" },
  { item_name: "PPC25MELBS01L6 Pack Webserver Medium Mitsu 6x200 01L+4x250 (PEAD100/125)", item_id: "6974", price: "2949.00" },
  { item_name: "PPC25MELBS01M6 Pack Webserver Medium Mitsu 6x200 01M+3x250 (PEAD60/71)", item_id: "6978", price: "2949.00" },
  { item_name: "PPC25MELBS01M4 Pack Webserver Medium Mitsu 4x200 01M+3x250 (PEAD60/71)", item_id: "6976", price: "2619.00" },
  { item_name: "PPC25DAIBS07S3 Pack Webserver Medium Daikin 3x200 07S+2x250 (FBA35/50)", item_id: "6970", price: "2329.00" },
  { item_name: "PPC25MELBS01S3 Pack Webserver Medium Mitsu 3x200 01S+2x250 (PEAD35/50)", item_id: "6980", price: "2329.00" },
  { item_name: "PPC25DAIBS07M6 Pack Webserver Medium Daikin 6x200 07M+3x250 (FBA60/71)", item_id: "6968", price: "2949.00" },
  { item_name: "PPC25DAIBS07S2 Pack Webserver Medium Daikin 2x200 07S+2x250 (FBA35/50)", item_id: "6969", price: "2019.00" },
  { item_name: "PPC25DAIBS07M4 Pack Webserver Medium Daikin 4x200 07M+3x250 (FBA60/71)", item_id: "6966", price: "2619.00" },
  { item_name: "PPC25DAIBS07S4 Pack Webserver Medium Daikin 4x200 07S+2x250 (FBA35/50)", item_id: "6971", price: "2619.00" },
];

// ── TAB 2: CLIMATISATION / Cassette + Plafonnier + Groupe DRV ─────────────
const climaRaw = [
  { item_name: "PCA-M125KA3 Unité Intérieure plafonnier R410 et R32, sans commande", item_id: "4761", price: "2590.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "PLA-M140EA3 Unité Intérieure - Cassette 4 Voies 900x900", item_id: "4776", price: "2480.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "HP2PIS-50-V1 Unité Intérieure HEIWA PRO2 PLAFONNIER 5kW", item_id: "7023", price: "894.00", brand: "HEIWA" },
  { item_name: "HP2PIS-100-V1 Unité Intérieure HEIWA PRO2 PLAFONNIER 10kW", item_id: "7024", price: "1503.00", brand: "HEIWA" },
  { item_name: "HP2PIS-160-V1 Unité Intérieure HEIWA PRO2 PLAFONNIER 16kW", item_id: "7025", price: "1868.00", brand: "HEIWA" },
  { item_name: "HP2KIS-160-V1 Unité Intérieure HEIWA PRO2 CASSETTE 16kW", item_id: "7028", price: "1645.00", brand: "HEIWA" },
  { item_name: "PLA-M100EA3 Unité Intérieure - Cassette 4 Voies 900x900", item_id: "4774", price: "2309.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "SLZ-M25FA3.TH Unité Intérieure cassette sans façade et commande", item_id: "4782", price: "1266.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "SLZ-M35FA3.TH Unité Intérieure cassette sans façade et commande", item_id: "4783", price: "1668.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "PCA-M50KA3 Unité Intérieure plafonnier R410 et R32, sans commande", item_id: "4757", price: "1471.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "PCA-M100KA3 Unité Intérieure plafonnier R410 et R32, sans commande", item_id: "4760", price: "2450.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "PCA-M140KA3 Unité Intérieure plafonnier R410 et R32, sans commande", item_id: "4762", price: "2750.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "HPOFAC1-V1 Facade BLANCHE pour cassette 600x600", item_id: "1925", price: "188.00", brand: "HEIWA" },
  { item_name: "SLP-2FAL Pour SLZ-M VA façade cassette 600x600 serie M", item_id: "1164", price: "245.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "PCA-M71KA3 Unité Intérieure plafonnier R410 etR32, sans commande", item_id: "4759", price: "2293.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "FFA25A9 Cassette encastrable 4 voies inverter 600x600 (prévoir façade et télé)", item_id: "581", price: "1664.00", brand: "DAIKIN" },
  { item_name: "HP2KIS-50-V1 Unité Intérieure HEIWA PRO2 CASSETTE 5kW", item_id: "5717", price: "910.00", brand: "HEIWA" },
  { item_name: "HPOFAC2-V1 Facade BLANCHE pour cassette 900x900", item_id: "1926", price: "258.00", brand: "HEIWA" },
  { item_name: "FFA35A9 Cassette encastrable 4 voies inverter 600x600 (prévoir façade et télé)", item_id: "582", price: "1791.00", brand: "DAIKIN" },
  { item_name: "HP2KIS-100-V1 Unité Intérieure HEIWA PRO2 CASSETTE 10kW", item_id: "6347", price: "1239.00", brand: "HEIWA" },
  { item_name: "HP2KIS-35-V1 Unité Intérieure HEIWA PRO2 CASSETTE 3,5kW", item_id: "5716", price: "783.00", brand: "HEIWA" },
  { item_name: "SLP-2FALE Pour SLZ-M VA façade I SENSOR cassette 600x600 serie M", item_id: "1163", price: "342.00", brand: "MITSUBISHI ELECTRIC" },
  { item_name: "HP2PIS-71-V1 Unité Intérieure HEIWA PRO2 PLAFONNIER 7,1kW", item_id: "5711", price: "1165.00", brand: "HEIWA" },
  { item_name: "HP2KIS-71-V1 Unité Intérieure HEIWA PRO2 CASSETTE 7,1kW", item_id: "5718", price: "1058.00", brand: "HEIWA" },
];

// ── HELPERS ────────────────────────────────────────────────────────────────
function toSlug(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function extractManufacturerSku(item_name) {
  return item_name.split(' ')[0];
}

function buildSoneparSku(item_id, mfrSku) {
  // Use 051101- prefix for Airzone packs, format the item_id to 6 digits
  const padded = item_id.toString().padStart(6, '0');
  return `051101-${padded}`;
}

function detectBrandForAirzone(item_name) {
  const n = item_name.toLowerCase();
  if (n.includes('daikin')) return 'DAIKIN';
  if (n.includes('mitsu') || n.includes('melbs') || n.includes('01l') || n.includes('01m') || n.includes('01s') || n.includes('01xl')) return 'MITSUBISHI ELECTRIC';
  return 'AIRZONE';
}

function detectFluid(item_name) {
  const n = item_name.toLowerCase();
  if (n.includes('r410')) return 'R410A';
  if (n.includes('r32')) return 'R32';
  return '';
}

function getImageForAirzone(mfrSku) {
  // Airzone webserver pack - use a standard Airzone image for all variants
  return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg';
}

function getImageForClima(mfrSku, brand) {
  const id = mfrSku.toLowerCase();
  if (brand === 'HEIWA') {
    if (id.includes('pis')) return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2pis-50-v1.jpg';
    if (id.includes('kis')) return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2kis-50-v1.jpg';
    return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hpofac1-v1.jpg';
  }
  if (brand === 'MITSUBISHI ELECTRIC') {
    if (id.includes('pca')) return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/c/pca-m125ka3.jpg';
    if (id.includes('pla')) return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/l/pla-m140ea3.jpg';
    if (id.includes('slz')) return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/s/l/slz-m25fa3.jpg';
    return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/c/pca-m125ka3.jpg';
  }
  if (brand === 'DAIKIN') {
    return 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/f/f/ffa25a9.jpg';
  }
  return '';
}

function formatPrice(rawPrice) {
  const num = parseFloat(rawPrice);
  if (isNaN(num)) return '';
  return num.toFixed(2).replace('.', ',') + ' €';
}

// ── BUILD AIRZONE PACK ENTRIES ─────────────────────────────────────────────
const airzoneEntries = airzoneRaw.map(item => {
  const mfrSku = extractManufacturerSku(item.item_name);
  const restTitle = item.item_name.slice(mfrSku.length + 1);
  const brand = detectBrandForAirzone(item.item_name);
  const slug = toSlug(mfrSku);
  const soneparSku = buildSoneparSku(item.item_id, mfrSku);
  
  return {
    brand: 'AIRZONE',
    title: `${mfrSku} ${restTitle}`,
    soneparSku: soneparSku,
    manufacturerSku: mfrSku,
    price: formatPrice(item.price),
    seer: '',
    scop: '',
    fluid: '',
    pdfs: [],
    localPdfs: [],
    imageUrl: `https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/a/i/airzone_pack_webserver.jpg`,
    localImage: '',
    url: `https://climate.sonepar.fr/${slug}`,
  };
});

// ── BUILD CLIMATISATION (CASSETTE/PLAFONNIER/DRV) ENTRIES ─────────────────
const climaEntries = climaRaw.map(item => {
  const mfrSku = extractManufacturerSku(item.item_name);
  const restTitle = item.item_name.slice(mfrSku.length + 1);
  const brand = item.brand;
  const slug = toSlug(mfrSku);
  const soneparSku = buildSoneparSku(item.item_id, mfrSku);
  const fluid = detectFluid(item.item_name);
  
  return {
    brand: brand,
    title: `${mfrSku} ${restTitle}`,
    soneparSku: soneparSku,
    manufacturerSku: mfrSku,
    price: formatPrice(item.price),
    seer: '',
    scop: '',
    fluid: fluid,
    pdfs: [],
    localPdfs: [],
    imageUrl: getImageForClima(mfrSku, brand),
    localImage: '',
    url: `https://climate.sonepar.fr/${slug}`,
  };
});

// ── MERGE AND SAVE ─────────────────────────────────────────────────────────
const existingPath = path.join(__dirname, '..', 'src', 'data', 'sonepar_catalog.json');
const existingCatalog = JSON.parse(fs.readFileSync(existingPath, 'utf8'));

// Check what's already in the catalog by manufacturerSku
const existingSkus = new Set(existingCatalog.map(p => p.manufacturerSku));

const newAirzone = airzoneEntries.filter(p => !existingSkus.has(p.manufacturerSku));
const newClima = climaEntries.filter(p => !existingSkus.has(p.manufacturerSku));

console.log(`Existing catalog: ${existingCatalog.length} products`);
console.log(`New Airzone pack entries: ${newAirzone.length}`);
console.log(`New climatisation entries (cassette/plafonnier/DRV): ${newClima.length}`);

const merged = [...existingCatalog, ...newAirzone, ...newClima];
console.log(`Total after merge: ${merged.length} products`);

fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`✅ Saved to ${existingPath}`);

// Also output a summary of new products
console.log('\n📦 New AIRZONE products:');
newAirzone.forEach(p => console.log(`  - ${p.manufacturerSku} | ${p.price}`));
console.log('\n📦 New CLIMATISATION products:');
newClima.forEach(p => console.log(`  - [${p.brand}] ${p.manufacturerSku} | ${p.price}`));
