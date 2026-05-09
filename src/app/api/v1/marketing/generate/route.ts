import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import themes from "@/lib/marketing-themes.json";

const API_KEY = process.env.MARKETING_API_KEY || "gainable_marketing_secret_2024";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const key = req.headers.get("x-api-key") || searchParams.get("key");

    if (key !== API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 1. On prend un article au hasard pour le contexte technique
        const articles = await prisma.article.findMany({
            where: { 
                status: 'PUBLISHED',
                content: { contains: ' ' }, 
            },
            take: 50
        });

        if (articles.length === 0) return NextResponse.json({ error: "No articles" }, { status: 404 });
        const article = articles[Math.floor(Math.random() * articles.length)];
        
        // On choisit un thème marketing parmi les 23 mails (résumés en 5 piliers)
        const theme = themes[Math.floor(Math.random() * themes.length)];

        // 2. OpenAI avec l'ADN des emails HTML
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        
        const systemPrompt = `
        Tu es l'Agent Marketing de Gainable.fr. 
        Ton ton doit être percutant, empathique vis-à-vis des problèmes des artisans, et orienté "Business Réel".
        
        THÉMATIQUE DU JOUR : "${theme.theme}"
        PROBLÈME À SOULIGNER : "${theme.problem}"
        SOLUTION GAINABLE : "${theme.solution}"
        
        CONSIGNE IMPORTANTE (PAS DE FAVORITISME) : 
        - Ne cite PAS de nom de société spécifique d'expert dans le corps du post. 
        - Parle au nom de Gainable.fr ou du "Réseau des Experts".
        - L'objectif est d'attirer de nouveaux artisans et de rassurer les clients sur le modèle de la plateforme.
        `;

        const userPrompt = `
        CONTEXTE TECHNIQUE (Utilise-le pour illustrer le post) :
        "${article.title}"
        
        MISSION :
        Génère un post LinkedIn (B2B - Recrutement/Expertise) et un post Facebook (B2C - Confiance/Local).
        
        Structure LinkedIn : Hook sur le problème des leads partagés/commissions > La vision Gainable > Appel à l'action pour les pros.
        Structure Facebook : Le problème des artisans qu'on ne trouve pas > Comment Gainable sélectionne les meilleurs pour vous > Appel à l'action pour un devis.

        RETOURNE DU JSON : { "linkedin": "...", "facebook": "...", "imagePrompt": "...", "analysis": "..." }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // 3. Génération d'image avec DALL-E 3
        let imageUrl = "";
        try {
            const imageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: result.imagePrompt || "A professional HVAC installation in a modern luxury home, high quality, photorealistic",
                n: 1,
                size: "1024x1024",
            });
            imageUrl = imageResponse.data[0].url || "";
        } catch (imgError) {
            console.error("DALL-E Error:", imgError);
        }

        return NextResponse.json({
            ...result,
            imageUrl,
            articleUrl: "https://www.gainable.fr/espace-pro", // URL générique B2B
            theme: theme.theme
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
