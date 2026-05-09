import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import * as jose from 'jose';
import OpenAI from "openai";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );
        
        const user = await prisma.user.findUnique({ where: { id: payload.userId as string } });
        const isAdmin = user?.email === 'gmaroann@gmail.com' || user?.role === 'ADMIN';
        if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        // 1. Pick a random article (Published)
        const count = await prisma.article.count({ where: { status: 'PUBLISHED' } });
        if (count === 0) return NextResponse.json({ error: "No published articles found" }, { status: 404 });
        
        const skip = Math.floor(Math.random() * count);
        const article = await prisma.article.findFirst({
            where: { status: 'PUBLISHED' },
            skip: skip,
            include: { expert: { select: { nom_entreprise: true, slug: true } } }
        });

        if (!article) return NextResponse.json({ error: "Article selection failed" }, { status: 500 });

        // 2. Prepare OpenAI
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `
        Tu es un expert en Social Media Marketing pour le site Gainable.fr. 
        Gainable.fr est une plateforme qui met en relation des clients avec des experts en climatisation gainable et pompes à chaleur.
        
        ARTICLE SOURCE:
        Titre: ${article.title}
        Introduction: ${article.introduction || ""}
        Slug: ${article.slug}
        Entreprise: ${article.expert?.nom_entreprise || "Gainable.fr"}
        
        TA MISSION:
        Génère 3 posts pour les réseaux sociaux basés sur cet article.
        
        1. LINKEDIN (Ton professionnel, expertise, B2B, valorisation de l'artisanat):
        - Accroche forte (Hook)
        - Corps du texte (Valeur ajoutée)
        - Call to Action
        - 3-5 Hashtags pertinents
        
        2. FACEBOOK (Ton communautaire, confiance, proximité, bénéfices clients):
        - Ton chaleureux
        - Bénéfices concrets
        - Emojis
        - 2-3 Hashtags
        
        3. INSTAGRAM (Ton inspirant, court, visuel):
        - Texte court et percutant
        - Beaucoup d'emojis
        - Blocs de hashtags
        
        RETOURNE UNIQUEMENT UN OBJET JSON avec les clés suivantes:
        {
          "linkedin": "...",
          "facebook": "...",
          "instagram": "...",
          "article": {
            "title": "...",
            "url": "..."
          }
        }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-3.5-turbo
            messages: [
                { role: "system", content: "Tu es un agent marketing spécialisé dans le bâtiment et le SEO." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        return NextResponse.json({
            ...result,
            articleInfo: {
                id: article.id,
                title: article.title,
                slug: article.slug,
                mainImage: article.mainImage,
                expertName: article.expert?.nom_entreprise,
                url: `https://www.gainable.fr/entreprise/${article.expert?.slug}/articles/${article.slug}`
            }
        });

    } catch (e) {
        console.error("Marketing generation error:", e);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
