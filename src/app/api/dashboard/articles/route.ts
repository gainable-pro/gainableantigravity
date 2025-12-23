import { NextResponse } from "next/server";
import { z } from "zod";
import * as jose from 'jose';
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

// Schema validation for creating an article
const articleSchema = z.object({
    title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
    slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug invalide (lettres minuscules, chiffres, tirets)"),
    introduction: z.string().optional(),
    content: z.string().min(50, "Le contenu est trop court"),
    mainImage: z.string().min(1, "URL d'image obligatoire"),
    altText: z.string().min(5, "Texte alternatif obligatoire"),
    targetCity: z.string().optional(),
    metaDesc: z.string().optional(),
    status: z.enum(["DRAFT", "PENDING"]).default("DRAFT"), // Expert can only set DRAFT or PENDING
    faq: z.array(z.object({
        question: z.string(),
        response: z.string()
    })).optional()
});

async function getExpertFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) return null;

    try {
        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );

        // Get Expert ID from User ID
        const expert = await prisma.expert.findUnique({
            where: { user_id: payload.userId as string },
            select: { id: true, expert_type: true, slug: true }
        });

        return expert;
    } catch (err) {
        return null;
    }
}

export async function GET() {
    const expert = await getExpertFromToken();
    if (!expert) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const articles = await prisma.article.findMany({
            where: { expertId: expert.id },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate quota usage for current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const publishedCount = await prisma.article.count({
            where: {
                expertId: expert.id,
                status: 'PUBLISHED',
                publishedAt: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            }
        });

        return NextResponse.json({
            articles,
            expertSlug: expert.slug,
            quota: {
                used: publishedCount,
                limit: expert.slug === 'gainable-fr' ? 999 : 2,
                remaining: expert.slug === 'gainable-fr' ? 999 : Math.max(0, 2 - publishedCount)
            }
        });

    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// Forbidden words list
const FORBIDDEN_WORDS = [
    "moins cher", "le moins cher", "prix imbattable", "promo", "promotion",
    "garanti", "garantie", "résultats garantis", "n°1", "leader",
    "meilleur de", "100%", "devis gratuit garanti", "offre limitée",
    "urgent", "cliquez ici"
];

// Helper to count words in text
function countWordsText(text: string) {
    return text.trim().split(/\s+/).length;
}

function checkForbiddenWords(text: string) {
    const lowerText = text.toLowerCase();
    const found = [];
    for (const word of FORBIDDEN_WORDS) {
        if (lowerText.includes(word)) {
            found.push(word);
        }
    }
    return found;
}

export async function POST(req: Request) {
    const expert = await getExpertFromToken();
    if (!expert) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // 1. Validate Basic Info
        // 1. Validate Basic Info
        if (!body.title || body.title.length < 5) return NextResponse.json({ error: "Le titre est trop court." }, { status: 400 });
        if (!body.slug || body.slug.length < 3) return NextResponse.json({ error: "Le slug est invalide." }, { status: 400 });

        // Validation stricte uniquement pour la publication
        if (body.status === 'PUBLISHED') {
            if (!body.mainImage) return NextResponse.json({ error: "L'image principale est obligatoire pour la publication." }, { status: 400 });
            if (!body.altText || body.altText.length < 5) return NextResponse.json({ error: "Le texte alternatif (Alt) est obligatoire pour la publication." }, { status: 400 });
        }

        // 2. Validate Structure (Sections)
        const sections = Array.isArray(body.sections) ? body.sections : [];
        const faqs = Array.isArray(body.faq) ? body.faq : [];
        const status = body.status === 'PUBLISHED' ? 'PUBLISHED' : (body.status === 'PENDING' ? 'PENDING' : 'DRAFT');

        if (status === 'PUBLISHED') {
            // Rule: Min 3 Sections
            if (sections.length < 3) {
                return NextResponse.json({ error: "Publication refusée : L'article doit contenir au moins 3 sections." }, { status: 400 });
            }

            // Rule: Min 2 FAQs
            if (faqs.length < 2) {
                return NextResponse.json({ error: "Publication refusée : L'article doit contenir au moins 2 questions FAQ." }, { status: 400 });
            }

            // Rule: Min 600 words (Title + Intro + Sections Content)
            let totalWordCount = countWordsText(body.title) + countWordsText(body.introduction || "");
            sections.forEach((sec: any) => {
                totalWordCount += countWordsText(sec.content || "");
            });

            if (totalWordCount < 600) {
                return NextResponse.json({ error: `Publication refusée : Contenu trop court (${totalWordCount} mots). Minimum 600 mots requis.` }, { status: 400 });
            }

            // Rule: Forbidden Words
            const allText = [
                body.title,
                body.introduction,
                ...sections.map((s: any) => s.title + " " + s.content),
                ...faqs.map((f: any) => f.question + " " + f.response)
            ].join(" ").toLowerCase();

            const forbiddenFound = checkForbiddenWords(allText);
            if (forbiddenFound.length > 0) {
                return NextResponse.json({ error: `Publication refusée : Mots interdits détectés ('${forbiddenFound[0]}').` }, { status: 400 });
            }

            // Rule: Quota
            // 1. Quota Check (Max 2 published per month)
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const publishedCount = await prisma.article.count({
                where: {
                    expertId: expert.id,
                    status: 'PUBLISHED',
                    publishedAt: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            });

            if (publishedCount >= 2 && expert.slug !== 'gainable-fr') {
                return NextResponse.json({ error: `Limite atteinte : ${publishedCount}/2 articles publiés ce mois-ci.` }, { status: 403 });
            }
        }

        // 3. Generate HTML Content from Sections
        // 3. Generate HTML Content from Sections
        let generatedHtml = "";

        // Video Embed (if present)
        if (body.videoUrl) {
            const vUrl = body.videoUrl;
            if (vUrl.includes("youtube.com") || vUrl.includes("youtu.be")) {
                // Simple YouTube ID extraction
                const videoId = vUrl.split('v=')[1]?.split('&')[0] || vUrl.split('/').pop();
                if (videoId) {
                    generatedHtml += `<div class="video-container" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin-bottom:2rem;border-radius:0.75rem;">
                        <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/${videoId}" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>\n`;
                }
            } else {
                // Local/Uploaded Video
                generatedHtml += `<div class="video-container" style="margin-bottom:2rem;">
                    <video controls style="width:100%;border-radius:0.75rem;">
                        <source src="${vUrl}" type="video/mp4">
                        Votre navigateur ne supporte pas la balise vidéo.
                    </video>
                </div>\n`;
            }
        }

        sections.forEach((sec: any) => {
            generatedHtml += `<h2>${sec.title}</h2>\n`;
            // Transform newlines to <br> or paragraphs if needed, but assuming simple text for now or basic formatting
            // If user input is textarea, we should wrap in <p>.
            const paragraphs = sec.content.split('\n').filter((p: string) => p.trim() !== '');
            paragraphs.forEach((p: string) => {
                generatedHtml += `<p>${p}</p>\n`;
            });

            if (sec.subtitle) {
                generatedHtml += `<h3>${sec.subtitle}</h3>\n`;
            }

            if (sec.list && Array.isArray(sec.list) && sec.list.length > 0) {
                generatedHtml += `<ul>\n`;
                sec.list.forEach((item: string) => {
                    if (item.trim()) generatedHtml += `<li>${item}</li>\n`;
                });
                generatedHtml += `</ul>\n`;
            }
        });

        // 4. Save
        // Check slug uniqueness
        const existingSlug = await prisma.article.findUnique({
            where: {
                expertId_slug: {
                    expertId: expert.id,
                    slug: body.slug // We trust frontend or simplified slug
                }
            }
        });

        if (existingSlug) {
            return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 400 });
        }

        const newArticle = await prisma.article.create({
            data: {
                title: body.title,
                slug: body.slug,
                introduction: body.introduction,
                content: generatedHtml, // Auto-generated HTML
                jsonContent: { sections, faq: faqs },
                mainImage: body.mainImage,
                altText: body.altText,
                videoUrl: body.videoUrl,
                targetCity: body.targetCity,
                metaDesc: body.introduction ? body.introduction.slice(0, 160) : "",
                status: status as any,
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                expertId: expert.id,
                faq: faqs
            }
        });

        return NextResponse.json({ success: true, article: newArticle });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur lors de la sauvegarde." }, { status: 500 });
    }
}
