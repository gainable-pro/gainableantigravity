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
        🧠 PROMPT SEO PREMIUM

        Tu es un rédacteur SEO senior spécialisé dans le domaine du CVC (Chauffage, Ventilation, Climatisation) et le référencement local.
        Tu dois rédiger un article unique, expert et localisé, destiné à être indexé par Google.

        CONTEXTE
        Entreprise : ${expert.nom_entreprise}
        Ville principale : ${ville}
        Zone d’intervention : ${zone}
        Spécialité : ${specialite}
        Sujet de l'article : "${topic}"

        CONSIGNES STRICTES
        1. Génère UN SEUL H1, optimisé SEO, intégrant naturellement la ville et la thématique.
        2. Génère 4 à 6 H2, avec un ordre variable (ne jamais suivre toujours le même plan).
        3. Ne jamais utiliser systématiquement : Introduction → Avantages → Prix → FAQ.
        4. Le contenu doit être réellement différencié d’un article similaire dans une autre ville.

        CONTENU À PRODUIRE
        - Adapter le discours au contexte local (climat, type d’habitat, usages courants).
        - Mettre en avant la méthode de travail de l'entreprise : "${expert.description?.slice(0, 150) || 'Service de qualité, expert qualifié'}".
        - Varier les angles possibles : confort thermique, contraintes techniques locales, rénovation vs neuf, choix des marques, attentes des clients.

        INTERDICTIONS
        - Pas de phrases génériques type “dans un monde en constante évolution”.
        - Pas de structure répétitive.
        - Pas de paragraphes trop courts ou vides.

        FORMAT DE RÉPONSE ATTENDU (JSON STRICT)
        Tu dois ABSOLUMENT répondre avec ce format JSON pour que l'affichage fonctionne (Zig-Zag).

        {
            "title": "Titre H1 (Optimisé)",
            "slug": "slug-url-friendly",
            "targetCity": "${ville}",
            "metaDesc": "Meta description unique (max 160 chars) incitant au clic.",
            "introduction": "Introduction engageante (pas de H2 ici)...",
            "sections": [
                {
                    "title": "Titre H2 (Variable)",
                    "content": "Contenu riche et détaillé (300 mots min)..."
                },
                {
                    "title": "Autre H2 (Variable)",
                    "content": "..."
                }
            ],
            "faq": [
                {
                    "question": "Question pertinente ?",
                    "response": "Réponse experte..."
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
