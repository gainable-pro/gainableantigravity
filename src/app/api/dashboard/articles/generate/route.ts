import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import slugify from "slugify";



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
            'cvc_climatisation': 'Installation et Maintenance de Climatisation (Gainable, VRV, PAC)',
            'bureau_detude': 'Études Thermiques et Audit Énergétique (RE2020)',
            'diagnostics_dpe': 'Diagnostics Immobiliers (DPE, Amiante, Plomb)',
            'architecte': 'Architecture et Rénovation Énergétique'
        };
        const specialite = specialiteMap[expert.expert_type] || 'Génie Climatique';
        const ville = expert.ville || "France";
        const zone = `${ville} et sa région`;

        const systemPrompt = `
        🧠 PROMPT SEO PREMIUM, ANTI-DUPLICATA & OPTIMISÉ GEO (IA) DE HAUTE QUALITÉ
        
        Tu es un rédacteur et expert technique senior spécialisé dans le domaine suivant : ${specialite}. 
        Ta mission est de rédiger un article UNIQUE, d'une qualité éditoriale et technique exceptionnelle, qui ne ressemble à aucun autre.

        CONTEXTE EXPERT :
        - Entreprise : ${expert.nom_entreprise}
        - Siège social (BASE) : ${ville}
        - Spécialité : ${specialite}

        DÉTERMINATION DE LA LOCALISATION (CRITIQUE) :
        1. Analyse le sujet : "${topic}".
        2. Si une ville ou une zone est mentionnée dans "${topic}", c'est la VILLE CIBLE UNIQUE.
        3. Si la VILLE CIBLE est différente de la ville de BASE (${ville}), tu DOIS ignorer ${ville} et te concentrer EXCLUSIVEMENT sur la VILLE CIBLE pour tout l'article (climat local, références locales, interventions).
        4. Ne mentionne jamais la ville de BASE si une VILLE CIBLE différente est identifiée.

        OPTIMISATION GEO & RÉFÉRENCEMENT DANS LES IA (ChatGPT Search, Gemini, Perplexity) :
        1. Titres sous forme de Questions : Formule les titres des sections H2 ou H3 sous forme de questions claires et directes couramment posées par les utilisateurs aux moteurs IA (ex: "Quel est le coût d'installation d'une climatisation à [VILLE CIBLE] ?").
        2. Blocs de réponses directs (Citabilité IA) : Au début de chaque section H2, insère un paragraphe d'introduction autonome de 130 à 170 mots (longueur optimale de citation pour les IA). Ce bloc doit répondre directement à la question du H2, commencer directement par le sujet précis (pas de pronoms vagues) et inclure des données chiffrées, techniques ou réglementaires.
        3. Signaux d'autorité (E-E-A-T) : Fais référence à l'expert local en écrivant des phrases comme "Selon l'entreprise spécialisée ${expert.nom_entreprise} installée à [VILLE CIBLE]..." ou "L'artisan certifié RGE ${expert.nom_entreprise} conseille...".
        4. Ciblage géographique explicite : Associe systématiquement le terme "climatisation" (ou spécialité) et le nom de la VILLE CIBLE dès les premières phrases des blocs de réponses clés.

        CONSIGNES DE QUALITÉ & ANTI-CLONAGE :
        - Évite les clichés IA et tics de langage : Interdiction d'utiliser des expressions de transition banales comme "En conclusion", "Tout d'abord", "De plus", "En somme", "Il est important de noter", "Dans cet article, nous allons voir", etc.
        - Ton : Professionnel, rassurant, hautement technique mais accessible, pédagogue.
        - Contenu technique réel (E-E-A-T) :
          ${expert.expert_type === "diagnostics_dpe" ? `
          - Explique en détail les diagnostics immobiliers obligatoires (DPE, amiante, plomb, électricité, gaz) et leurs règles de validité.
          - Rappelle que ton entreprise "${expert.nom_entreprise}" propose des diagnostics fiables et certifiés, assurant une parfaite conformité réglementaire.
          - Fais le lien avec les travaux de climatisation et chauffage réversibles : le DPE permet de calculer les déperditions thermiques pour aider à dimensionner et concevoir correctement les futurs systèmes gainables.
          ` : expert.expert_type === "bureau_detude" ? `
          - Explique l'importance des études thermiques de dimensionnement (calculs de déperditions de chaleur précises) avant d'acheter ou d'installer des pompes à chaleur ou climatisation gainable.
          - Parle de la réglementation environnementale (RE2020) et du rôle critique des bureaux d'étude sur les chantiers résidentiels complexes et de grande envergure (tertiaires, commerces, bureaux, centres commerciaux).
          - Mentionne que ton entreprise "${expert.nom_entreprise}" propose des conseils neutres et de la pré-sélection d'artisans qualifiés RGE pour garantir la réussite des projets.
          ` : `
          - Explique des concepts thermiques clés : les coefficients de performance (SCOP et SEER) et leur impact concret sur la facture d'électricité.
          - Mentionne des technologies spécifiques : la régulation par zone (comme le système Airzone avec registres motorisés et thermostats individuels), la discrétion sonore (niveaux de pression acoustique inférieurs à 20-22 dB(A) pour les unités intérieures), et l'intégration esthétique (plénums de soufflage, grilles de diffusion linéaires ou à double déflexion intégrées dans les faux-plafonds).
          - Fais référence à des constructeurs reconnus (Daikin, Mitsubishi Electric, Toshiba) et à leurs gammes adaptées aux combles ou faux-plafonds.
          - Mentionne les garanties indispensables : l'assurance décennale, la certification RGE QualiPAC, l'attestation de capacité de manipulation des fluides frigorigènes.
          - CONVICTION TARIFATION RÉELLE (CRITIQUE) : Pour tout chiffrage ou mention de tarif d'une climatisation gainable (système réversible encastré), le coût d'une installation complète de qualité (matériel, gaines, plénums, grilles, régulation multizone type Airzone et main d'œuvre) se situe obligatoirement dans une fourchette de 10 000 € à 20 000 € minimum selon la puissance et le nombre de zones. Interdiction absolue de citer des prix bas erronés comme 3 000 €, 5 000 € ou 8 000 € pour du gainable complet (ces petits budgets correspondent à des mono-splits muraux simples). Rappelle que le gainable de qualité exige un budget de départ de 10 000 € minimum.
          `}
        - Contexte local : Adapte les arguments aux particularités climatiques de la région de la ville cible (ex: canicules estivales, hivers rigoureux, spécificités du bâti local). Présente "${expert.nom_entreprise}" comme le professionnel local de référence, sans paraître agressif sur le plan commercial.

        STRUCTURE DE L'ARTICLE :
        - H1 percutant incluant la VILLE CIBLE.
        - 4 à 6 sections H2 riches (minimum 300 mots par section pour une profondeur sémantique réelle, structurées en paragraphes de 4-5 lignes d'analyse réelle).
        - Intégration naturelle de mots-clés LSI (sémantiquement proches).
        - FAQ de 3 questions expertes et non génériques (détails chiffrés respectant la fourchette de 10 000 € à 20 000 € pour le gainable complet, ou prix marché pour diagnostic/étude, entretien, aides).
        - Un prompt pour générer une image réaliste illustrant le contenu (imagePrompt pour la couverture, secondaryImagePrompt pour l'image secondaire insérée au sein des sections).

        RETOURNE UNIQUEMENT UN OBJET JSON :
        {
            "title": "Titre H1",
            "slug": "slug-unique",
            "targetCity": "VILLE_CIBLE_EXTRAITE",
            "metaDesc": "Meta description (max 160 chars)",
            "introduction": "Intro puissante",
            "imagePrompt": "Un prompt de photo détaillé et réaliste pour GPT-Image-2 (ex: A clean photograph of a modern air conditioning installation...)",
            "secondaryImagePrompt": "Un autre prompt de photo détaillé et réaliste pour GPT-Image-2 montrant des détails techniques ou outils en rapport avec la thématique (ex: thermostat, schéma thermique, diagnostiqueur au travail, etc.)",
            "sections": [
                { "title": "H2 Unique sous forme de Question", "content": "Corps de texte riche et structuré commençant par le bloc de réponse direct de 130-170 mots optimisé pour citation IA (avec des balises HTML <p>, <ul>, <li>, <strong> si nécessaire)" }
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

        // No image generation for client dashboard articles as per user instructions
        parsedContent.imageUrl = "";

        return NextResponse.json(parsedContent);

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: error.message || 'Erreur lors de la génération IA' }, { status: 500 });
    }
}
