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

        // DYNAMIC PERSONA & CONTEXT
        const specialiteMap: Record<string, string> = {
            'installateur_clim': 'Installation et Maintenance de Climatisation (Gainable, VRV, PAC)',
            'bureau_detude': 'Études Thermiques et Audit Énergétique (RE2020)',
            'diagnostics_dpe': 'Diagnostics Immobiliers (DPE, Amiante, Plomb)',
            'architecte': 'Architecture et Rénovation Énergétique'
        };
        const specialite = specialiteMap[expert.expert_type] || 'Génie Climatique';
        const ville = expert.ville || "France";
        const zone = `${ville} et sa région`;

        const systemPrompt = `
        🧠 PROMPT SEO PREMIUM & ANTI-DUPLICATA
        
        Tu es un rédacteur SEO senior spécialisé dans le génie climatique. 
        Ta mission est de rédiger un article UNIQUE qui ne ressemble à aucun autre, même sur le même sujet.

        CONTEXTE EXPERT :
        - Entreprise : ${expert.nom_entreprise}
        - Siège social (BASE) : ${ville}
        - Spécialité : ${specialite}

        DÉTERMINATION DE LA LOCALISATION (CRITIQUE) :
        1. Analyse le sujet : "${topic}".
        2. Si une ville ou une zone est mentionnée dans "${topic}", c'est la VILLE CIBLE UNIQUE.
        3. Si la VILLE CIBLE est différente de la ville de BASE (${ville}), tu DOIS ignorer ${ville} et te concentrer EXCLUSIVEMENT sur la VILLE CIBLE pour tout l'article (climat local, références locales, interventions).
        4. Ne mentionne jamais la ville de BASE si une VILLE CIBLE différente est identifiée.

        CONSIGNES D'UNICITÉ & ANTI-CLONAGE :
        - Pour éviter le "Duplicate Content", choisis aléatoirement un angle d'attaque différent à chaque fois : (ex: technique, financier/économies, confort, environnemental, ou études de cas).
        - Structure Variable : Ne commence pas toujours par une introduction classique. Varie l'ordre des sections.
        - Style : Évite les structures de phrases répétitives ("Il est important de...", "De plus..."). Utilise un ton dynamique et expert.
        - Personnalisation : Utilise les détails de "${expert.description?.slice(0, 150)}" pour insuffler l'ADN de l'entreprise dans le texte.

        STRUCTURE DE L'ARTICLE :
        - H1 percutant incluant la VILLE CIBLE.
        - 4 à 6 sections H2 riches (minimum 300 mots par section pour une profondeur sémantique réelle).
        - Intégration naturelle de mots-clés LSI (sémantiquement proches).
        - FAQ de 3 questions expertes et non génériques.

        RETOURNE UNIQUEMENT UN OBJET JSON :
        {
            "title": "Titre H1",
            "slug": "slug-unique",
            "targetCity": "VILLE_CIBLE_EXTRAITE",
            "metaDesc": "Meta description (max 160 chars)",
            "introduction": "Intro puissante",
            "sections": [
                { "title": "H2 Unique", "content": "Corps de texte riche" }
            ],
            "faq": [
                { "question": "...", "response": "..." }
            ]
        }
        `;

        console.log("AI Generation: Sending request to OpenAI...");
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Rédige un article expert et unique sur le sujet : "${topic}". Assure-toi que le contenu est parfaitement adapté à la ville cible mentionnée.` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.9,
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
