/**
 * Script pour télécharger les images des nouveaux produits Airzone, Heiwa, Daikin, Mitsubishi (cassette/plafonnier)
 * depuis Sonepar Climate et mettre à jour le catalog JSON avec les chemins locaux.
 * 
 * Usage: node scripts/download-new-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.join(__dirname, '..', 'src', 'data', 'sonepar_catalog.json');
const imgDir = path.join(__dirname, '..', 'public', 'downloads', 'images');

// Make sure output directory exists
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Real image URLs from Sonepar Climate for each manufacturer SKU
// These are the actual CDN paths found in the HTML product pages
const IMAGE_MAP = {
  // ── AIRZONE Pack Plénum Zoning ─────────────────────────────────────────
  // All Airzone webserver packs share the same visual (box + webserver unit)
  // Source: https://climate.sonepar.fr/ppc25daibs07l4-...
  'PPC25DAIBS07L4': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25DAIBS07L5': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25DAIBS07M3': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25DAIBS07M4': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25DAIBS07M5': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25DAIBS07M6': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25DAIBS07S2': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25DAIBS07S3': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25DAIBS07S4': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01L4': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01L5': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01L6': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01M3': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01M4': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01M5': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01M6': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01S2': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01S3': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01S4': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PPC25MELBS01S5': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',
  'PP25MELST01XL6': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/p/ppc25_pack_airzone.jpg',

  // ── MITSUBISHI ELECTRIC Plafonnier (PCA-M series) ───────────────────────
  'PCA-M50KA3':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/c/pca-m_125ka3.jpg',
  'PCA-M71KA3':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/c/pca-m_125ka3.jpg',
  'PCA-M100KA3': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/c/pca-m_125ka3.jpg',
  'PCA-M125KA3': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/c/pca-m_125ka3.jpg',
  'PCA-M140KA3': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/c/pca-m_125ka3.jpg',

  // ── MITSUBISHI ELECTRIC Cassette 4 Voies (PLA-M / SLZ-M series) ─────────
  'PLA-M100EA3':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/l/pla-m140ea3.jpg',
  'PLA-M140EA3':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/p/l/pla-m140ea3.jpg',
  'SLZ-M25FA3.TH':'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/s/l/slz-m50fa3.jpg',
  'SLZ-M35FA3.TH':'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/s/l/slz-m50fa3.jpg',
  'SLP-2FAL':     'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/s/l/slp-2fal.jpg',
  'SLP-2FALE':    'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/s/l/slp-2fale.jpg',

  // ── HEIWA Plafonnier (HP2PIS series) ────────────────────────────────────
  'HP2PIS-50-V1':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2pis-50-v1.jpg',
  'HP2PIS-71-V1':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2pis-50-v1.jpg',
  'HP2PIS-100-V1': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2pis-100-v1.jpg',
  'HP2PIS-160-V1': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2pis-100-v1.jpg',

  // ── HEIWA Cassette (HP2KIS series) ───────────────────────────────────────
  'HP2KIS-35-V1':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2kis-50-v1.jpg',
  'HP2KIS-50-V1':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2kis-50-v1.jpg',
  'HP2KIS-71-V1':  'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2kis-50-v1.jpg',
  'HP2KIS-100-V1': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2kis-100-v1.jpg',
  'HP2KIS-160-V1': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hp2kis-100-v1.jpg',

  // ── HEIWA Façades ────────────────────────────────────────────────────────
  'HPOFAC1-V1': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hpofac1-v1.jpg',
  'HPOFAC2-V1': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/h/p/hpofac2-v1.jpg',

  // ── DAIKIN Cassette (FFA series) ──────────────────────────────────────────
  'FFA25A9': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/f/f/ffa25a9.jpg',
  'FFA35A9': 'https://climate.sonepar.fr/media/catalog/product/cache/a024f423e7cf424b9a9b8f526f63d1b7/f/f/ffa25a9.jpg',
};

/**
 * Download a file from a URL to a local path
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://climate.sonepar.fr/',
      }
    }, response => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        file.close();
        fs.unlinkSync(destPath);
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        // Check file size - if < 1KB, it's probably an error response
        const stat = fs.statSync(destPath);
        if (stat.size < 1000) {
          fs.unlinkSync(destPath);
          reject(new Error(`File too small (${stat.size} bytes) - probably not a real image`));
        } else {
          resolve(stat.size);
        }
      });
    }).on('error', err => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  let updatedCount = 0;
  let downloadedCount = 0;
  let errorCount = 0;

  // Get the list of SKUs to process
  const skusToProcess = new Set(Object.keys(IMAGE_MAP));
  
  for (const product of catalog) {
    if (!skusToProcess.has(product.manufacturerSku)) continue;
    
    const imageUrl = IMAGE_MAP[product.manufacturerSku];
    if (!imageUrl) continue;

    // Build local filename from soneparSku (same pattern as existing products)
    const localFilename = `${product.soneparSku}.jpg`;
    const localDest = path.join(imgDir, localFilename);
    const localPath = `downloads/images/${localFilename}`;
    
    // Update imageUrl in catalog always
    product.imageUrl = imageUrl;

    // Download if not already exists
    if (!fs.existsSync(localDest) || fs.statSync(localDest).size < 1000) {
      process.stdout.write(`  Downloading ${product.manufacturerSku}... `);
      try {
        const size = await downloadFile(imageUrl, localDest);
        product.localImage = localPath;
        downloadedCount++;
        console.log(`✅ ${Math.round(size/1024)}KB → ${localFilename}`);
      } catch (err) {
        errorCount++;
        console.log(`❌ ${err.message}`);
        // Use a fallback brand-specific placeholder
        product.localImage = '';
      }
    } else {
      product.localImage = localPath;
      console.log(`  ⏭️  Already exists: ${localFilename}`);
    }
    
    updatedCount++;
  }

  // Save updated catalog
  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
  
  console.log(`\n✅ Updated ${updatedCount} products`);
  console.log(`📥 Downloaded ${downloadedCount} new images`);
  console.log(`❌ ${errorCount} errors`);
  console.log(`💾 Saved catalog to ${catalogPath}`);
}

main().catch(console.error);
