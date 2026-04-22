const https = require('https');

async function fetchSitemap() {
    return new Promise((resolve, reject) => {
        https.get('https://www.gainable.fr/sitemap.xml', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function checkUrl(url) {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
            resolve({ url, status: res.statusCode });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({ url, status: 'TIMEOUT' });
        });
        
        req.on('error', (e) => {
            resolve({ url, status: 'ERROR' });
        });
        
        req.end();
    });
}

async function run() {
    console.log("Downloading sitemap.xml from Production...");
    const sitemapContent = await fetchSitemap();
    
    // Extract everything between <loc> and </loc>
    const urlMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)];
    const urls = urlMatches.map(m => m[1]);
    
    console.log(`Found ${urls.length} URLs in the sitemap.`);
    
    // We only scan a large random sample of 200 URLs to avoid DDOSing Vercel/Supabase
    const sampleSize = 200;
    
    // Shuffle the array
    for (let i = urls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [urls[i], urls[j]] = [urls[j], urls[i]];
    }
    const sampleToTest = urls.slice(0, sampleSize);
    
    console.log(`Scanning a randomized massive sample of ${sampleSize} URLs across all categories...`);

    let count200 = 0;
    let errors = [];

    // Run parallel batches
    const batchSize = 25;
    for (let i = 0; i < sampleToTest.length; i += batchSize) {
        const batch = sampleToTest.slice(i, i + batchSize);
        process.stdout.write(`Scanning batch ${i}... `);
        const results = await Promise.all(batch.map(url => checkUrl(url)));
        
        for (const r of results) {
            if (r.status === 200) count200++;
            else errors.push(r);
        }
        console.log(`OK`);
    }

    console.log("\n--- REPORT ---");
    console.log(`Total Scanned: ${sampleSize}`);
    console.log(`Success (200 OK): ${count200}`);
    if (errors.length > 0) {
        console.log(`ERRORS (${errors.length}):`, errors);
    } else {
        console.log("PERFECT! ZERO ERRORS FOUND IN SAMPLE.");
    }
}

run();
