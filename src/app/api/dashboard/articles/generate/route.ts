import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";



const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

async function getUserIdFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) return null;

    try {
        const decoded = jwt.verify(token.value, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

export async function POST(req: Request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    try {
        const userId = await getUserIdFromToken();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Le sujet est requis.' }, { status: 400 });
        }

        const systemPrompt = `
        Tu es un expert SEO et rédacteur web spécialisé dans le domaine du CVC (Chauffage, Ventilation, Climatisation), spécifiquement pour la "climatisation gainable" et les "pompes à chaleur".
        Ta mission est de rédiger un article complet, optimisé pour le référencement (SEO), qui sera publié sur le site d'un installateur professionnel.

        Sujet de l'article : "${topic}"

        Consignes de rédaction :
        1.  **Ton :** Professionnel, rassurant, expert mais accessible (pas trop de jargon sans explication). Encourage la demande de devis.
        2.  **SEO :** Utilise des mots-clés pertinents (installation, prix, devis, avantages, confort, économies d'énergie).
        3.  **Structure :**
            -   **Titre (H1) :** Accrocheur, contient le mot-clé principal.
            -   **Slug :** URL-friendly, court, mots-clés séparés par des tirets.
            -   **Ville cible :** Choisis une grande ville française pertinente (ex: Bordeaux, Toulouse, Montpellier, Lyon) ou "France" si le sujet est général.
            -   **Introduction :** Présente le problème et la solution, donne envie de lire.
            -   **Sections (H2) :** 3 à 5 sections détaillées. Chaque section doit avoir un titre (subtitle) et un contenu riche (content).
            -   **FAQ :** 3 questions/réponses pertinentes que les clients se posent souvent (prix, bruit, installation, consommation).

        Format de réponse attendu (JSON uniquement) :
        {
            "title": "Titre H1",
            "slug": "mon-super-article",
            "targetCity": "Ville",
            "introduction": "Intro...",
            "sections": [
                {
                    "title": "Titre H2",
                    "content": "Paragraphe complet expliquant ce point..."
                }
            ],
            "faq": [
                {
                    "question": "Question ?",
                    "response": "Réponse..."
                }
            ]
        }
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Génère l'article pour : ${topic}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error("No content generated");
        }

        const parsedContent = JSON.parse(content);

        return NextResponse.json(parsedContent);

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Erreur lors de la génération IA' }, { status: 500 });
    }
}
