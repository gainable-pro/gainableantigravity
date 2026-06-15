const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Regex to detect email addresses
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Regex to detect common French phone formats
const PHONE_REGEX = /(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/g;

// List of common contact page patterns
const CONTACT_PATTERNS = [
    'contact', 'contact-us', 'contacts', 'a-propos', 'apropos', 'about', 
    'mentions-legales', 'mentions', 'legal', 'qui-sommes-nous'
];

// Read input websites from a file (one website per line)
const INPUT_FILE = path.join(__dirname, 'websites.txt');
const OUTPUT_FILE = path.join(__dirname, 'scraped_leads.csv');

// Helper to clean and format URLs
function formatUrl(url) {
    let clean = url.trim().toLowerCase();
    if (!clean) return null;
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
        clean = 'https://' + clean;
    }
    return clean;
}

// Fetch helper with timeout
async function fetchWithTimeout(url, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        clearTimeout(id);
        if (!response.ok) return null;
        return await response.text();
    } catch (e) {
        clearTimeout(id);
        return null;
    }
}

// Extract emails and phones from HTML text
function extractContactInfo(html, baseUrl) {
    const emails = html.match(EMAIL_REGEX) || [];
    const phones = html.match(PHONE_REGEX) || [];
    
    // Clean and deduplicate emails
    const uniqueEmails = [...new Set(emails.map(e => e.toLowerCase()))]
        // Filter out common image extensions caught by loose regexes
        .filter(e => !e.endsWith('.png') && !e.endsWith('.jpg') && !e.endsWith('.jpeg') && !e.endsWith('.gif') && !e.endsWith('.webp'));
        
    // Clean and deduplicate phones
    const uniquePhones = [...new Set(phones.map(p => p.replace(/[\s.-]/g, '')))];

    return { emails: uniqueEmails, phones: uniquePhones };
}

// Find link to contact page in HTML
function findContactLinks(html, baseUrl) {
    const $ = cheerio.load(html);
    const links = [];
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        
        const text = $(el).text().toLowerCase();
        const hrefLower = href.toLowerCase();
        
        const isContactLink = CONTACT_PATTERNS.some(pattern => 
            hrefLower.includes(pattern) || text.includes(pattern)
        );
        
        if (isContactLink) {
            try {
                const absoluteUrl = new URL(href, baseUrl).toString();
                links.push(absoluteUrl);
            } catch (e) {
                // Invalid URL format
            }
        }
    });
    return [...new Set(links)];
}

async function scrapeWebsite(rawUrl) {
    const targetUrl = formatUrl(rawUrl);
    if (!targetUrl) return null;

    console.log(`\n[SCRAPE] Début du crawl pour : ${targetUrl}`);
    const homepageHtml = await fetchWithTimeout(targetUrl);
    if (!homepageHtml) {
        console.log(`[ECHEC] Impossible d'accéder à la page d'accueil de : ${targetUrl}`);
        return { website: rawUrl, status: 'Inaccessible', emails: [], phones: [] };
    }

    // 1. Scrape homepage
    let { emails, phones } = extractContactInfo(homepageHtml, targetUrl);

    // 2. Search for contact page links and crawl them if no emails found
    if (emails.length === 0) {
        console.log(`[CONTACT] Pas d'email sur l'accueil, recherche d'une page de contact...`);
        const contactLinks = findContactLinks(homepageHtml, targetUrl);
        
        if (contactLinks.length > 0) {
            // Take the first 2 contact page candidates to avoid infinite loop
            const candidates = contactLinks.slice(0, 2);
            for (const contactUrl of candidates) {
                console.log(`[CRAWL] Visite de la page de contact : ${contactUrl}`);
                const contactHtml = await fetchWithTimeout(contactUrl);
                if (contactHtml) {
                    const extra = extractContactInfo(contactHtml, contactUrl);
                    emails = [...new Set([...emails, ...extra.emails])];
                    phones = [...new Set([...phones, ...extra.phones])];
                }
            }
        }
    }

    console.log(`[SUCCÈS] ${targetUrl} | Emails trouvés: [${emails.join(', ')}] | Tél: [${phones.join(', ')}]`);
    return {
        website: targetUrl,
        status: 'Succès',
        emails: emails.join('; '),
        phones: phones.join('; ')
    };
}

async function main() {
    // Ensure websites.txt exists
    if (!fs.existsSync(INPUT_FILE)) {
        fs.writeFileSync(INPUT_FILE, 'example-artisan-clim.fr\nhttps://autre-entreprise.fr');
        console.log(`[NOTICE] Fichier 'websites.txt' créé. Veuillez y lister vos sites web cibles (un par ligne).`);
        return;
    }

    const sites = fs.readFileSync(INPUT_FILE, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

    if (sites.length === 0 || (sites.length === 1 && sites[0].includes('example-artisan'))) {
        console.log(`[INFO] Ajoutez des URLs réelles dans le fichier 'websites.txt' pour lancer le scraping.`);
        return;
    }

    console.log(`[START] Lancement du scraping pour ${sites.length} sites...`);
    
    // Write CSV header
    fs.writeFileSync(OUTPUT_FILE, 'Site;Statut;Emails;Telephones\n', 'utf8');

    // Run scraping sequentially (or with limited concurrency) to avoid getting blocked
    for (const site of sites) {
        try {
            const result = await scrapeWebsite(site);
            if (result) {
                // Escape quotes for CSV
                const row = `"${result.website}";"${result.status}";"${result.emails}";"${result.phones}"\n`;
                fs.appendFileSync(OUTPUT_FILE, row, 'utf8');
            }
        } catch (err) {
            console.error(`Error scraping ${site}:`, err.message);
        }
    }

    console.log(`\n[FINISH] Scraping terminé. Les résultats sont enregistrés dans : ${OUTPUT_FILE}`);
}

main();
