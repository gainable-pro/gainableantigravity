import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Email to Article Import...");

    // Find the Admin User and Gainable Expert
    const user = await prisma.user.findFirst({
        where: { email: { contains: "redaction" } }
    });
    
    if (!user) {
        console.error("Admin user not found. Please run seed-seo-articles.ts first or create an admin.");
        return;
    }

    let expert = await prisma.expert.findUnique({
        where: { slug: "redaction-gainable-fr" }
    });

    if (!expert) {
        expert = await prisma.expert.findFirst({
            where: { nom_entreprise: "Rédaction Gainable.fr" }
        });
    }

    if (!expert) {
        console.error("Expert 'Rédaction Gainable.fr' not found.");
        return;
    }

    console.log(`Using Expert ID: ${expert.id} (${expert.nom_entreprise})`);

    const emailsDir = path.join(process.cwd(), 'emails_marketing');
    if (!fs.existsSync(emailsDir)) {
        console.error("No emails_marketing directory found.");
        return;
    }

    const files = fs.readdirSync(emailsDir).filter(f => f.endsWith('.html'));
    console.log(`Found ${files.length} HTML emails to process.`);

    let count = 0;

    for (const file of files) {
        const filePath = path.join(emailsDir, file);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');

        // Extract Title
        let title = "Article Sans Titre";
        const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) {
            title = titleMatch[1].trim();
        } else {
            // Try extracting h1
            const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
            if (h1Match) title = h1Match[1].trim();
        }

        // Clean slug
        let slug = title.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/['’]/g, '-')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        // Make slug unique based on file
        slug = `b2b-conseil-${slug}`;

        // Check if article already exists
        const exists = await prisma.article.findFirst({ where: { slug } });
        if (exists) {
            console.log(`Article already exists for ${file} -> ${slug}. Skipping.`);
            continue;
        }

        // Extract Content
        // The raw email contains a big table layout. We want to extract only the <h1...> and <p...> inside the padding cell, and IGNORE the CTA/Footer because we will dynamically inject the generic B2B banner.
        
        let cleanContent = "";
        
        // Find the main content cell: <td style="padding: 40px 30px;">
        const mainCellMatch = htmlContent.match(/<td[^>]*padding:\s*40px\s+30px;?[^>]*>([\s\S]*?)<table[^>]*margin-top:\s*30px;?/i);
        
        if (mainCellMatch) {
            let innerContent = mainCellMatch[1];
            
            // Just wrap it nicely
            cleanContent = `<div class="email-article-content">\n${innerContent}\n</div>`;
            
            // Clean inline styles that conflict with Tailwind
            cleanContent = cleanContent.replace(/style="[^"]*"/g, "");
            
            // Ensure no CTA remains (the regex stops at the <table margin-top:30px which is the CTA)
            
            // Let's add the dynamic React marker or we just let Next.js render it.
            // On the frontend, we can check if it's assigned to 'redaction-gainable-fr' to show the B2B capture under the article.
            
            const introMatch = innerContent.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
            const introText = introMatch ? introMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim() : "Stratégie de croissance pour les installateurs clim.";

            await prisma.article.create({
                data: {
                    title: title,
                    slug: slug,
                    introduction: introText,
                    content: cleanContent,
                    expertId: expert.id,
                    status: 'PUBLISHED',
                    metaDesc: introText.substring(0, 155) + "...",
                    mainImage: '/hero-hvac.png',
                    altText: title,
                    targetCity: null // National level
                }
            });

            console.log(`Created: ${title} (${slug})`);
            count++;
        } else {
            console.log(`Could not parse content properly for ${file}. Trying fallback.`);
            // Fallback: extract all p tags
            const pMatches = htmlContent.match(/<p[^>]*>[\s\S]*?<\/p>/gi);
            if (pMatches) {
                const combinedP = pMatches.map(p => p.replace(/style="[^"]*"/g, "")).join("\n");
                await prisma.article.create({
                    data: {
                        title: title,
                        slug: slug,
                        introduction: title,
                        content: `<div class="email-fallback">${combinedP}</div>`,
                        expertId: expert.id,
                        status: 'PUBLISHED',
                        metaDesc: title.substring(0, 155),
                        mainImage: '/hero-hvac.png',
                        targetCity: null
                    }
                });
                console.log(`Created (fallback): ${title} (${slug})`);
                count++;
            } else {
                console.log(`FAILED extracting ${file}`);
            }
        }
    }

    console.log(`\nImport complete! Added ${count} new expert/B2B articles.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
