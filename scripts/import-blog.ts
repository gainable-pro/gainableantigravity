
import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

const BLOG_URL = 'https://www.gainable.fr/blog';

async function main() {
    console.log('Starting migration...');

    // 1. Get Admin Expert ID
    const expert = await prisma.expert.findUnique({
        where: { slug: 'gainable-fr' },
    });

    if (!expert) {
        console.error('Expert "gainable-fr" not found. Please run scripts/create-admin-expert.ts first.');
        return;
    }
    console.log(`Expert found: ${expert.id}`);

    // 2. Fetch Blog List
    console.log(`Fetching ${BLOG_URL}...`);
    const listRes = await fetch(BLOG_URL);
    const listHtml = await listRes.text();
    const $ = cheerio.load(listHtml);

    // This selector depends on Wix structure. 
    // Usually links to posts are in <a> tags containing "/post/"
    const articleLinks = new Set<string>();

    $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('/post/') && !href.includes('#')) {
            // Ensure absolute URL
            const fullUrl = href.startsWith('http') ? href : `https://www.gainable.fr${href}`;
            articleLinks.add(fullUrl);
        }
    });

    console.log(`Found ${articleLinks.size} articles.`);

    for (const url of articleLinks) {
        await importArticle(url, expert.id);
        // Be nice to the server
        await new Promise(r => setTimeout(r, 1000));
    }
}

async function importArticle(url: string, expertId: string) {
    console.log(`Importing ${url}...`);
    try {
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);

        // Wix Blog Parsing Logic (Approximate, based on common structure)
        // Title is usually <h1 class="blog-post-title-font ...">
        const title = $('h1').first().text().trim();
        if (!title) {
            console.log('Skipping: No title found');
            return;
        }

        // Slug extraction
        const slug = url.split('/post/')[1].split('?')[0];

        // Content Extraction
        // Wix content is often in <div data-hook="post-description-wrapper"> or <article>
        // We will try to find the main content container.
        let contentHtml = '';
        let intro = '';
        const sections: any[] = [];

        // Strategy: Grab basic text structure
        // If we can't perfectly parse DOM, we'll strip tags or just grab generic layout
        const articleBody = $('article').first();
        if (articleBody.length === 0) {
            // Fallback for some templates
            // Trying generic content extraction from main area
        }

        // Simple extraction: Grab all paragraphs and headers in the main area
        // Wix often uses span for text inside weird divs.
        // Let's rely on standard semantic tags if possible, otherwise look for specific classes.
        // "post-content__body" is common in Wix.

        const contentContainer = $('div[data-hook="post-description-wrapper"]').first();
        const root = contentContainer.length ? contentContainer : $('article').first();

        // Extract Intro (First paragraph)
        intro = root.find('p').first().text().trim();

        // Extract Sections logic (simplified)
        let currentSection = { title: 'Introduction', content: '' };

        // This loop is tricky for arbitrary HTML. 
        // We'll just dump the processed HTML as content and make a dummy JSON structure for now.
        // Or cleaner: Iterate over children.

        // For simplicity and robustness:
        // 1. Get full HTML of content.
        // 2. Create one "Section" with full content.
        // 3. User can edit later.

        let cleanedHtml = root.html() || '';

        // Remove style attributes to be cleaner
        cleanedHtml = cleanedHtml.replace(/style="[^"]*"/g, '');
        cleanedHtml = cleanedHtml.replace(/class="[^"]*"/g, '');

        if (!cleanedHtml) {
            // Fallback: Read meta description
            intro = $('meta[property="og:description"]').attr('content') || '';
            cleanedHtml = `<p>${intro}</p><p><em>Contenu importé automatiquement. À vérifier.</em></p>`;
        }

        // Image extraction
        let mainImage = $('meta[property="og:image"]').attr('content');
        if (!mainImage) {
            // Try finding first image in body
            mainImage = root.find('img').first().attr('src');
        }

        // If still no image, use default
        if (!mainImage) {
            mainImage = 'https://www.gainable.fr/logo.png'; // Placeholder
        }

        // Check if exists
        const exists = await prisma.article.findUnique({
            where: { expertId_slug: { expertId, slug } }
        });

        if (exists) {
            console.log(`Article ${slug} already exists. Updating...`);
            await prisma.article.update({
                where: { id: exists.id },
                data: {
                    title,
                    introduction: intro.slice(0, 500),
                    content: cleanedHtml,
                    mainImage,
                    status: 'PUBLISHED',
                    publishedAt: new Date(), // Reset date or keep? Let's refresh.
                    jsonContent: {
                        sections: [{ title: title, content: cleanedHtml }],
                        faq: []
                    }
                }
            });
        } else {
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
                    jsonContent: {
                        sections: [{ title: title, content: cleanedHtml }],
                        faq: []
                    }
                }
            });
            console.log(`Created ${slug}`);
        }

    } catch (e) {
        console.error(`Error importing ${url}:`, e);
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
