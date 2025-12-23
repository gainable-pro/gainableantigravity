
import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

// Increase default timeout
const TIMEOUT_MS = 30000;

const prisma = new PrismaClient();

const SITEMAP_URL = 'https://www.gainable.fr/blog-posts-sitemap.xml';

async function main() {
    console.log('Starting SITEMAP sync...');

    // 1. Get Admin Expert ID
    const expert = await prisma.expert.findUnique({
        where: { slug: 'gainable-fr' },
    });

    if (!expert) {
        console.error('Expert "gainable-fr" not found.');
        return;
    }

    // 2. Fetch Sitemap
    console.log(`Fetching ${SITEMAP_URL}...`);
    const sitemapRes = await fetch(SITEMAP_URL);
    const sitemapText = await sitemapRes.text();

    // Simple regex parse for <loc>...</loc>
    const urlMatches = sitemapText.match(/<loc>(.*?)<\/loc>/g);
    const urls = urlMatches ? urlMatches.map(tag => tag.replace(/<\/?loc>/g, '')) : [];

    console.log(`Found ${urls.length} articles in sitemap.`);

    // 3. Process each URL
    let count = 0;
    for (const url of urls) {
        count++;
        // Skip non-post URLs just in case (though blog-posts-sitemap should be clean)
        if (!url.includes('/post/')) continue;

        console.log(`[${count}/${urls.length}] Importing ${url}...`);
        await importArticle(url, expert.id);

        // Small pause
        await new Promise(r => setTimeout(r, 500));
    }
}

async function importArticle(url: string, expertId: string) {
    try {
        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) {
            console.error(`Failed to fetch ${url}: ${res.status}`);
            return;
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        // Title
        const title = $('h1').first().text().trim();
        if (!title) {
            console.log('Skipping: No title found');
            return;
        }

        const slug = url.split('/post/')[1].split('?')[0];

        // Content
        // Try multiple selectors
        let contentContainer = $('div[data-hook="post-description-wrapper"]').first();
        if (!contentContainer.length) contentContainer = $('article').first();

        // 1. REMOVE UNWANTED ELEMENTS
        // Common Wix Blog garbage
        contentContainer.find('[data-hook="user-compact-post-layout-author-name"]').remove(); // Author Name
        contentContainer.find('[data-hook="time-to-read"]').remove(); // Read time
        contentContainer.find('div:contains("Mots-clés")').remove(); // Keywords block
        contentContainer.find('ul:has(li > a[href*="/blog/tags/"])').remove(); // Tag lists
        contentContainer.find('span:contains("min de lecture")').remove();

        // Remove empty paragraphs
        contentContainer.find('p').each((_, el) => {
            if ($(el).text().trim().length === 0 && $(el).find('img').length === 0) {
                $(el).remove();
            }
        });

        // 2. CLEAN HTML & FIX IMAGES
        // Remove style and class attributes
        contentContainer.find('*').removeAttr('style').removeAttr('class').removeAttr('data-hook');

        // Fix Images
        contentContainer.find('img').each((_, el) => {
            let src = $(el).attr('src');
            if (src) {
                // Convert Wix static images to clean URLs if possible, or just Ensure absolute
                if (src.startsWith('//')) src = 'https:' + src;
                if (src.startsWith('/')) src = 'https://www.gainable.fr' + src;

                // If image is tiny (likely an icon), remove it
                const w = $(el).attr('width');
                if (w && parseInt(w) < 50) {
                    $(el).remove();
                } else {
                    $(el).attr('src', src);
                }
            }
        });

        let intro = contentContainer.find('p').first().text().trim();
        let cleanedHtml = contentContainer.html() || '';

        if (!cleanedHtml) {
            const metaDesc = $('meta[property="og:description"]').attr('content') || '';
            intro = metaDesc;
            cleanedHtml = `<p>${metaDesc}</p><p><em>Article restauré.</em></p>`;
        }

        // 3. IMAGE
        let mainImage = $('meta[property="og:image"]').attr('content');
        if (!mainImage) mainImage = 'https://www.gainable.fr/logo.png'; // Fallback if no meta image

        // Creation or Update
        const exists = await prisma.article.findUnique({
            where: { expertId_slug: { expertId, slug } }
        });

        if (exists) {
            console.log(`> Updating existing article...`);
            await prisma.article.update({
                where: { id: exists.id },
                data: {
                    title,
                    introduction: intro.slice(0, 500),
                    content: cleanedHtml,
                    mainImage,
                    status: 'PUBLISHED',
                    jsonContent: { sections: [{ title, content: cleanedHtml }], faq: [] }
                }
            });
        } else {
            console.log(`> Creating new...`);
            await prisma.article.create({
                data: {
                    title,
                    slug,
                    expertId,
                    introduction: intro.slice(0, 500),
                    content: cleanedHtml,
                    mainImage,
                    altText: title,
                    status: 'PUBLISHED',
                    publishedAt: new Date(),
                    jsonContent: { sections: [{ title, content: cleanedHtml }], faq: [] }
                }
            });
        }

    } catch (e) {
        console.error(`Error processing ${url}:`, e);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
