import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import * as jose from 'jose';
import OpenAI from "openai";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { targetCVC } = await req.json();

        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );
        
        const user = await prisma.user.findUnique({ where: { id: payload.userId as string } });
        const isAdmin = user?.email === 'gmaroann@gmail.com' || user?.role === 'ADMIN' || user?.role === 'admin';
        if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const articles = await prisma.article.findMany({
            where: { 
                status: 'PUBLISHED',
                content: { contains: ' ' }, 
            },
            take: 50,
            include: { expert: { select: { nom_entreprise: true, slug: true, expert_type: true, ville: true } } }
        });

        if (articles.length === 0) return NextResponse.json({ error: "No suitable articles found" }, { status: 404 });
        const article = articles[Math.floor(Math.random() * articles.length)];
        if (!article) return NextResponse.json({ error: "Article selection failed" }, { status: 500 });

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const partnerAcquisitionInstructions = targetCVC ? `
        OBJECTIF CRITIQUE : ACQUISITION DE PARTENAIRES (B2B PRO)
        - Cible : Entreprises CVC, Artisans, Bureaux d'études.
        - Discours : Orienté business, augmentation du Chiffre d'Affaire, acquisition de nouveaux chantiers qualifiés.
        - Pourquoi Gainable ? Explique que Gainable est LA plateforme qui apporte des projets concrets aux experts du génie climatique.
        - Stratégie : Transformation du savoir-faire technique en réussite commerciale.
        ` : `
        Cible: Professionnels, Bureaux d'études, Partenaires existants.
        Angle: Parle de la digitalisation du bâtiment, de la qualité technique de ${article.expert?.nom_entreprise}, ou des économies d'énergie pour le tertiaire.
        `;

        const prompt = `
        Tu es un Community Manager Expert pour Gainable.fr.
        
        ARTICLE SOURCE (Utilise-le comme base de contexte ou exemple de réalisation) :
        Titre: ${article.title}
        Expert: ${article.expert?.nom_entreprise}
        
        TA MISSION:
        Génère 2 posts ultra-ciblés.
        
        1. LINKEDIN :
        ${partnerAcquisitionInstructions}
        - Ton: Autorité, Expertise, B2B, Partenariat.
        - Structure: Hook percutant > Valeur ajoutée/Bénéfice CA > CTA clair pour rejoindre le réseau > Hashtags.
        
        2. FACEBOOK (Cible: Particuliers, Habitants de ${article.expert?.ville}):
        - Ton: Chaleureux, Proche, Rassurant.
        - Angle: Le confort à la maison, la sérénité avec un installateur local certifié. Mentionne la ville ${article.expert?.ville}.
        - Structure: Émotions/Bénéfices > CTA local > Emojis.

        3. PROMPT IMAGE: Un prompt pour DALL-E (style pro, premium, illustrant soit un chantier réussi, soit la croissance d'un artisan expert).
        
        RETOURNE UNIQUEMENT UN OBJET JSON:
        {
          "linkedin": "...",
          "facebook": "...",
          "imagePrompt": "...",
          "analysis": "Pourquoi ce post va marcher pour ${targetCVC ? 'acquérir des partenaires' : 'engager la communauté'} ?"
        }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Tu es un Community Manager spécialisé dans le B2B génie climatique et l'acquisition de partenaires professionnels." },
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
