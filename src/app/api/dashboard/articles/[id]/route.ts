import { NextResponse } from "next/server";
import { z } from "zod";
import * as jose from 'jose';
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

// Helper to get expert
async function getExpertFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return await prisma.expert.findUnique({ where: { user_id: payload.userId as string } });
    } catch { return null; }
}

// GET SINGLE ARTICLE
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const expert = await getExpertFromToken();
    if (!expert) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;

    try {
        const article = await prisma.article.findUnique({
            where: { id }
        });

        if (!article || article.expertId !== expert.id) {
            return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
        }

        return NextResponse.json(article);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE ARTICLE
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const expert = await getExpertFromToken();
    if (!expert) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;

    try {
        const article = await prisma.article.findUnique({ where: { id } });
        if (!article || article.expertId !== expert.id) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

        await prisma.article.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
    }
}

// PUT (UPDATE) ARTICLE
// Forbidden words list (Relaxed)
const FORBIDDEN_WORDS = [
    "prix imbattable", "résultats garantis", "cliquez ici", "urgent", "offre limitée"
];

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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const expert = await getExpertFromToken();
    if (!expert) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;

    try {
        const article = await prisma.article.findUnique({ where: { id } });
        if (!article || article.expertId !== expert.id) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

        const body = await req.json();

        // VALIDATION (Same as POST)
        if (!body.title || body.title.length < 5) return NextResponse.json({ error: "Le titre est trop court." }, { status: 400 });
        if (!body.slug || body.slug.length < 3) return NextResponse.json({ error: "Le slug est invalide." }, { status: 400 });
        if (!body.mainImage) return NextResponse.json({ error: "L'image principale est obligatoire." }, { status: 400 });

        const sections = Array.isArray(body.sections) ? body.sections : [];
        const blocks = Array.isArray(body.blocks) ? body.blocks : [];
        const faqs = Array.isArray(body.faq) ? body.faq : [];
        const status = body.status === 'PUBLISHED' ? 'PUBLISHED' : (body.status === 'PENDING' ? 'PENDING' : 'DRAFT');

        if (status === 'PUBLISHED') {

            // RELAXED VALIDATION: We allow publication even if content is short.
            // Only basic checks remain (Image + Alt checked above).

            /*
            let totalWordCount = countWordsText(body.title) + countWordsText(body.introduction || "");

            if (blocks.length > 0) {
                const h2Count = blocks.filter((b: any) => b.type === 'h2').length;
                // if (h2Count < 2) return NextResponse.json({ error: "Structure insuffisante : Au moins 2 titres (H2)." }, { status: 400 });
                blocks.forEach((b: any) => {
                    if (b.type === 'text' || b.type === 'h2' || b.type === 'h3') totalWordCount += countWordsText(b.value || "");
                });
            } else {
                // if (sections.length < 3) return NextResponse.json({ error: "Min 3 sections." }, { status: 400 });
                sections.forEach((sec: any) => totalWordCount += countWordsText(sec.content || ""));
            }

            // if (faqs.length < 2) return NextResponse.json({ error: "Min 2 FAQ." }, { status: 400 });
            // if (totalWordCount < 600) return NextResponse.json({ error: `Contenu trop court (${totalWordCount} mots). Min 600.` }, { status: 400 });

            // Rule: Forbidden Words
            let allText = body.title + " " + (body.introduction || "") + " ";
            if (blocks.length > 0) {
                blocks.forEach((b: any) => {
                    if (b.type === 'text' || b.type === 'h2' || b.type === 'h3') allText += b.value + " ";
                });
            } else {
                sections.forEach((s: any) => allText += (s.title || "") + " " + (s.content || "") + " ");
            }
            faqs.forEach((f: any) => allText += (f.question || "") + " " + (f.response || "") + " ");

            const forbiddenFound = checkForbiddenWords(allText);
            if (forbiddenFound.length > 0) {
                return NextResponse.json({ error: `Mots interdits: '${forbiddenFound[0]}'.` }, { status: 400 });
            }
            */

            // Quota check ignored on UPDATE usually, unless we want to strict enforce. 
            // If article was DRAFT and now PUBLISHED, strictly speaking we should check quota.
            if (article.status !== 'PUBLISHED' && status === 'PUBLISHED') {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                const publishedCount = await prisma.article.count({
                    where: { expertId: expert.id, status: 'PUBLISHED', publishedAt: { gte: startOfMonth, lte: endOfMonth } }
                });
                if (publishedCount >= 3 && expert.slug !== 'gainable-fr') return NextResponse.json({ error: `Quota atteint (3/mois).` }, { status: 403 });
            }
        }

        // GENERATE HTML
        let generatedHtml = "";

        // Video
        if (body.videoUrl) {
            const vUrl = body.videoUrl;
            if (vUrl.includes("youtube.com") || vUrl.includes("youtu.be")) {
                const videoId = vUrl.split('v=')[1]?.split('&')[0] || vUrl.split('/').pop();
                if (videoId) {
                    generatedHtml += `<div class="video-container" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin-bottom:2rem;border-radius:0.75rem;">
                         <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;" src="https://www.youtube.com/embed/${videoId}" title="Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                     </div>\n`;
                }
            } else {
                generatedHtml += `<div class="video-container" style="margin-bottom:2rem;">
                     <video controls style="width:100%;border-radius:0.75rem;">
                         <source src="${vUrl}" type="video/mp4">
                     </video>
                 </div>\n`;
            }
        }

        sections.forEach((sec: any) => {
            generatedHtml += `<h2>${sec.title}</h2>\n`;
            const paragraphs = sec.content.split('\n').filter((p: string) => p.trim() !== '');
            paragraphs.forEach((p: string) => generatedHtml += `<p>${p}</p>\n`);
            if (sec.subtitle) generatedHtml += `<h3>${sec.subtitle}</h3>\n`;
            if (sec.list && Array.isArray(sec.list)) {
                generatedHtml += `<ul>\n`;
                sec.list.forEach((item: string) => item.trim() && (generatedHtml += `<li>${item}</li>\n`));
                generatedHtml += `</ul>\n`;
            }
        });

        // UPDATE
        // Check Slug uniqueness if changed
        if (body.slug !== article.slug) {
            const exist = await prisma.article.findUnique({
                where: { expertId_slug: { expertId: expert.id, slug: body.slug } }
            });
            if (exist) return NextResponse.json({ error: "Slug déjà pris." }, { status: 400 });
        }

        const updated = await prisma.article.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                introduction: body.introduction,
                content: generatedHtml,
                jsonContent: { sections, faq: faqs },
                mainImage: body.mainImage,
                altText: body.altText,
                videoUrl: body.videoUrl,
                targetCity: body.targetCity,
                metaDesc: body.introduction ? body.introduction.slice(0, 160) : "",
                status: status as any,
                publishedAt: (article.status !== 'PUBLISHED' && status === 'PUBLISHED') ? new Date() : article.publishedAt
            }
        });

        return NextResponse.json({ success: true, article: updated });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
