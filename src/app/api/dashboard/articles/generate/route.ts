import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";



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
    console.log("AI Generation: Received request");

    // Check key presence
    if (!process.env.OPENAI_API_KEY) {
        console.error("AI Generation: OPENAI_API_KEY is missing");
        return NextResponse.json({ error: 'Configuration serveur manquante (API Key)' }, { status: 500 });
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    try {
        const userId = await getUserIdFromToken();
        console.log("AI Generation: User ID:", userId);

        if (!userId) {
            console.log("AI Generation: Unauthorized (no user)");
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch Expert Context for Personalization
        const expert = await prisma.expert.findUnique({
            where: { user_id: userId },
            select: { id: true, nom_entreprise: true, ville: true, description: true, expert_type: true }
        });

        if (!expert) {
            return NextResponse.json({ error: 'Profil expert introuvable.' }, { status: 404 });
        }

        // --- LIMIT CHECK ---
        // Only "Air G Energie" is unlimited. Others = 3 articles/month.
        const isUnlimited = expert.nom_entreprise.toLowerCase().includes("air g energie");
        if (!isUnlimited) {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const count = await prisma.article.count({
                where: {
                    expertId: expert.id,
                    createdAt: { gte: startOfMonth }
                }
            });

            if (count >= 3) {
                return NextResponse.json({
                    error: "Limite mensuelle atteinte (3 articles ce mois-ci). Revenez le 1er du mois prochain !"
                }, { status: 403 });
            }
        }

        const expertContext = `
        CONTEXTE DE L'ENTREPRISE :
        - Nom : ${expert.nom_entreprise}
        - Ville : ${expert.ville}
        - Description : ${expert.description?.slice(0, 200) || "Installateur qualifié"}

        INSTRUCTION UNIQUE :
        Tu DOIS personnaliser l'article pour cette entreprise spécifique.
        Mentionne "${expert.nom_entreprise}" dans l'introduction et la conclusion.
        Adapte le ton en fonction de la description de l'entreprise si fournie.
        Cela permet d'éviter le contenu dupliqué avec d'autres artisans.
        ` ;

        const body = await req.json();
        console.log("AI Generation: Body parsed:", body);
        const { topic } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Le sujet est requis.' }, { status: 400 });
        }

        // DYNAMIC PERSONA
        let persona = `Tu es un expert SEO et rédacteur web spécialisé dans le domaine du CVC (Chauffage, Ventilation, Climatisation), spécifiquement pour la "climatisation gainable" et les "pompes à chaleur".`;

        if (expert.expert_type === 'diagnostics_dpe') {
            persona = `Tu es un expert certifié en Diagnostic Immobilier (DPE, Amiante, Plomb, etc.). Ta mission est d'informer les propriétaires et agences sur les obligations légales et l'importance des diagnostics pour la vente/location.`;
        } else if (expert.expert_type === 'bureau_detude') {
            persona = `Tu es un ingénieur thermicien en Bureau d'Étude (RE2020, Audit Énergétique). Ta mission est d'expliquer les réglementations thermiques, les audits énergétiques et l'optimisation de la performance du bâtiment.`;
        }

        const systemPrompt = `
        ${persona}
        Ta mission est de rédiger un article complet, optimisé pour le référencement (SEO), qui sera publié sur le site d'un installateur professionnel.
        
        ${expertContext}

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

        console.log("AI Generation: Sending request to OpenAI...");
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Génère l'article pour : ${topic}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });
        console.log("AI Generation: OpenAI response received");

        const content = completion.choices[0].message.content;

        if (!content) {
            console.error("AI Generation: No content in response");
            throw new Error("No content generated");
        }

        const parsedContent = JSON.parse(content);
        console.log("AI Generation: Content parsed successfully");

        return NextResponse.json(parsedContent);

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Erreur lors de la génération IA' }, { status: 500 });
    }
}
