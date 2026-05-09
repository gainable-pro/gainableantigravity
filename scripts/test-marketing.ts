import { prisma } from "../src/lib/prisma";
import OpenAI from "openai";
import themes from "../src/lib/marketing-themes.json";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function test() {
    console.log("--- TEST GÉNÉRATION MARKETING AI ---");
    
    try {
        const articles = await prisma.article.findMany({
            where: { status: 'PUBLISHED', content: { contains: ' ' } },
            take: 5
        });

        if (articles.length === 0) {
            console.log("Aucun article trouvé.");
            return;
        }

        const article = articles[0];
        const theme = themes[Math.floor(Math.random() * themes.length)];

        console.log(`Thème choisi: ${theme.theme}`);
        console.log(`Article source: ${article.title}`);

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
        `;

        const userPrompt = `
        CONTEXTE TECHNIQUE : "${article.title}"
        Génère un post LinkedIn et un post Facebook.
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
        console.log("\n--- RÉSULTAT ---");
        console.log(JSON.stringify(result, null, 2));

    } catch (e) {
        console.error("Erreur:", e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
