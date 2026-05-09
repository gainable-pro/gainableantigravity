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

        const articles = await prisma.article.findMany({
            where: { 
                status: 'PUBLISHED',
                content: { contains: ' ' }, // basic check for content
            },
            take: 50, // sample 50
            include: { expert: { select: { nom_entreprise: true, slug: true, expert_type: true, ville: true } } }
        });

        if (articles.length === 0) return NextResponse.json({ error: "No suitable articles found" }, { status: 404 });
        
        // Pick one that is likely commercial (e.g. mentions the expert or has a city)
        const article = articles[Math.floor(Math.random() * articles.length)];

        if (!article) return NextResponse.json({ error: "Article selection failed" }, { status: 500 });

        // 2. Prepare OpenAI
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const prompt = `
        Tu es un Community Manager Expert pour Gainable.fr.
        
        ARTICLE SOURCE:
        Titre: ${article.title}
        Introduction: ${article.introduction || ""}
        Expert: ${article.expert?.nom_entreprise} (${article.expert?.expert_type})
        Ville: ${article.expert?.ville}
        
        TA MISSION:
        Génère 2 posts ultra-ciblés.
        
        1. LINKEDIN (Cible: Professionnels, Bureaux d'études, Partenaires):
        - Ton: Autorité, Expertise, B2B.
        - Angle: Parle de la digitalisation du bâtiment, de la qualité technique de ${article.expert?.nom_entreprise}, ou des économies d'énergie pour le tertiaire.
        - Structure: Hook > Valeur > CTA > Hashtags.
        
        2. FACEBOOK (Cible: Particuliers, Habitants de ${article.expert?.ville}):
        - Ton: Chaleureux, Proche, Rassurant.
        - Angle: Le confort à la maison, la sérénité avec un installateur local certifié. Mentionne bien la ville ${article.expert?.ville}.
        - Structure: Émotions/Bénéfices > CTA local > Emojis.

        3. PROMPT IMAGE: Génère un prompt descriptif pour une IA génératrice d'image (DALL-E) qui illustre parfaitement ce sujet pour un post social media (style photo pro, réaliste, premium).
        
        RETOURNE UNIQUEMENT UN OBJET JSON:
        {
          "linkedin": "...",
          "facebook": "...",
          "imagePrompt": "...",
          "analysis": "Pourquoi ce post va marcher ?"
        }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Tu es un Community Manager spécialisé dans le génie climatique et l'immobilier." },
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
                url: `https://www.gainable.fr/pro/${article.expert?.slug}`
            }
        });

    } catch (e) {
        console.error("Marketing generation error:", e);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
