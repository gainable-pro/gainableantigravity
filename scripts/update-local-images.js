/**
 * Update catalog with correct local image paths from generated images
 */

const fs = require('fs');
const path = require('path');

const catalogPath = path.join(__dirname, '..', 'src', 'data', 'sonepar_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// Map SKU -> local image path (generated assets)
const LOCAL_IMAGE_MAP = {
  // AIRZONE - all packs use the same webserver kit image
  'PPC25DAIBS07L4': 'assets/airzone-pack-webserver.png',
  'PPC25DAIBS07L5': 'assets/airzone-pack-webserver.png',
  'PPC25DAIBS07M3': 'assets/airzone-pack-webserver.png',
  'PPC25DAIBS07M4': 'assets/airzone-pack-webserver.png',
  'PPC25DAIBS07M5': 'assets/airzone-pack-webserver.png',
  'PPC25DAIBS07M6': 'assets/airzone-pack-webserver.png',
  'PPC25DAIBS07S2': 'assets/airzone-pack-webserver.png',
  'PPC25DAIBS07S3': 'assets/airzone-pack-webserver.png',
  'PPC25DAIBS07S4': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01L4': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01L5': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01L6': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01M3': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01M4': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01M5': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01M6': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01S2': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01S3': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01S4': 'assets/airzone-pack-webserver.png',
  'PPC25MELBS01S5': 'assets/airzone-pack-webserver.png',
  'PP25MELST01XL6': 'assets/airzone-pack-webserver.png',

  // MITSUBISHI - Plafonnier (PCA-M series)
  'PCA-M50KA3':  'assets/mitsubishi-pca-plafonnier.png',
  'PCA-M71KA3':  'assets/mitsubishi-pca-plafonnier.png',
  'PCA-M100KA3': 'assets/mitsubishi-pca-plafonnier.png',
  'PCA-M125KA3': 'assets/mitsubishi-pca-plafonnier.png',
  'PCA-M140KA3': 'assets/mitsubishi-pca-plafonnier.png',

  // MITSUBISHI - Cassette 4V (PLA-M + SLZ-M)
  'PLA-M100EA3':   'assets/mitsubishi-pla-slz-cassette.png',
  'PLA-M140EA3':   'assets/mitsubishi-pla-slz-cassette.png',
  'SLZ-M25FA3.TH': 'assets/mitsubishi-pla-slz-cassette.png',
  'SLZ-M35FA3.TH': 'assets/mitsubishi-pla-slz-cassette.png',

  // MITSUBISHI - Façades
  'SLP-2FAL':  'assets/mitsubishi-pla-slz-cassette.png',
  'SLP-2FALE': 'assets/mitsubishi-pla-slz-cassette.png',

  // HEIWA - Plafonnier (HP2PIS)
  'HP2PIS-50-V1':  'assets/heiwa-plafonnier-cassette.png',
  'HP2PIS-71-V1':  'assets/heiwa-plafonnier-cassette.png',
  'HP2PIS-100-V1': 'assets/heiwa-plafonnier-cassette.png',
  'HP2PIS-160-V1': 'assets/heiwa-plafonnier-cassette.png',

  // HEIWA - Cassette (HP2KIS)
  'HP2KIS-35-V1':  'assets/heiwa-plafonnier-cassette.png',
  'HP2KIS-50-V1':  'assets/heiwa-plafonnier-cassette.png',
  'HP2KIS-71-V1':  'assets/heiwa-plafonnier-cassette.png',
  'HP2KIS-100-V1': 'assets/heiwa-plafonnier-cassette.png',
  'HP2KIS-160-V1': 'assets/heiwa-plafonnier-cassette.png',

  // HEIWA - Façades
  'HPOFAC1-V1': 'assets/heiwa-plafonnier-cassette.png',
  'HPOFAC2-V1': 'assets/heiwa-plafonnier-cassette.png',

  // DAIKIN - Cassette (FFA)
  'FFA25A9': 'assets/daikin-ffa-cassette.png',
  'FFA35A9': 'assets/daikin-ffa-cassette.png',
};

// Also update imageUrl to a sensible value per family
const IMAGE_URL_MAP = {
  AIRZONE: 'https://www.airzone.es/en/wp-content/uploads/2023/01/sistema-airzone-nativa-1.jpg',
  'MITSUBISHI_PLAFONNIER': 'https://www.mitsubishielectric.fr/img/products/pac-m-series-plafonnier.jpg',
  'MITSUBISHI_CASSETTE': 'https://www.mitsubishielectric.fr/img/products/slz-m-cassette.jpg',
  'HEIWA': 'https://www.heiwa-clim.fr/img/hp2pis-plafonnier.jpg',
  'DAIKIN_CASSETTE': 'https://www.daikin.fr/content/dam/document-library/ffa-cassette.jpg',
};

let updated = 0;
for (const product of catalog) {
  const localImg = LOCAL_IMAGE_MAP[product.manufacturerSku];
  if (localImg) {
    product.localImage = localImg;
    // Remove the fake Sonepar CDN URL (placeholder) and set a clean empty imageUrl
    // (the localImage is what the UI uses first)
    if (product.imageUrl && product.imageUrl.includes('ppc25_pack_airzone')) {
      product.imageUrl = '';
    }
    updated++;
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`✅ Updated localImage for ${updated} products`);
console.log('Images assigned:');
console.log('  - 21 Airzone packs → assets/airzone-pack-webserver.png');
console.log('  - 5 Mitsubishi Plafonnier → assets/mitsubishi-pca-plafonnier.png');
console.log('  - 6 Mitsubishi Cassette → assets/mitsubishi-pla-slz-cassette.png');
console.log('  - 11 Heiwa cassette/plafonnier → assets/heiwa-plafonnier-cassette.png');
console.log('  - 2 Daikin Cassette → assets/daikin-ffa-cassette.png');
