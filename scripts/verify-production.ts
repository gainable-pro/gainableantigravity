const BASE_URL = 'http://localhost:3000';
const TARGET_CITY = 'bordeaux';
const TARGET_URL = `${BASE_URL}/climatisation/${TARGET_CITY}`;

async function verify() {
    console.log('Starting verification...');

    // 1. Sitemap Check
    console.log('--- Checking Sitemap ---');
    try {
        const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
        if (sitemapRes.status !== 200) {
            console.error(`FAILED: Sitemap returned status ${sitemapRes.status}`);
            process.exit(1);
        }
        const sitemapText = await sitemapRes.text();
        if (sitemapText.includes(`climatisation/${TARGET_CITY}`)) {
            console.log('SUCCESS: Sitemap contains city URL');
        } else {
            console.error('FAILED: Sitemap does not contain city URL');
        }
        // Check for rough count
        const matchCount = (sitemapText.match(/<loc>/g) || []).length;
        console.log(`INFO: Sitemap contains ${matchCount} URLs`);
        if (matchCount < 100) {
            console.warn('WARNING: Sitemap seems to have fewer URLs than expected');
        }

    } catch (error) {
        console.error('FAILED: Error fetching sitemap', error);
    }

    // 2. City Page Check
    console.log(`--- Checking City Page: ${TARGET_URL} ---`);
    try {
        const pageRes = await fetch(TARGET_URL);
        if (pageRes.status !== 200) {
            console.error(`FAILED: City page returned status ${pageRes.status}`);
            process.exit(1);
        }
        const html = await pageRes.text();

        // Canonical check (Regex)
        const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/);
        if (canonicalMatch && canonicalMatch[1] === `https://www.gainable.fr/climatisation/${TARGET_CITY}`) {
            console.log('SUCCESS: Canonical URL is correct');
        } else {
            console.error(`FAILED: Canonical URL is incorrect. Found: ${canonicalMatch ? canonicalMatch[1] : 'None'}`);
        }

        // Title / H1 check (Simple includes)
        if (html.includes('Bordeaux')) {
            console.log('SUCCESS: Page content contains city name');
        } else {
            console.error('FAILED: Page content does not contain city name');
        }

        // Breadcrumbs (Schema check)
        if (html.includes('BreadcrumbList')) {
            console.log('SUCCESS: Breadcrumb Schema found');
        } else {
            console.error('FAILED: Breadcrumb Schema NOT found');
        }

    } catch (error) {
        console.error('FAILED: Error fetching city page', error);
    }
}

verify();
