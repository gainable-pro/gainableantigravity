import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import themes from "@/lib/marketing-themes.json";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

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
        Génère un post LinkedIn (B2B - Recrutement/Expertise), un post Facebook (B2C - Confiance/Local) et une légende Instagram (Visuel/Hashtags).
        
        Structure LinkedIn : Hook sur le problème des leads partagés/commissions > La vision Gainable > Appel à l'action pour les pros.
        Structure Facebook : Le problème des artisans qu'on ne trouve pas > Comment Gainable sélectionne les meilleurs pour vous > Appel à l'action pour un devis.
        Structure Instagram : Phrase d'accroche courte > 3 points clés > Espace de hashtags pertinents.

        RETOURNE DU JSON : { "linkedin": "...", "facebook": "...", "instagram": "...", "imagePrompt": "...", "analysis": "..." }
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

        // 3. Génération d'image avec GPT-Image-2
        let imageUrl = "";
        try {
            const imageResponse = await openai.images.generate({
                model: "gpt-image-2",
                prompt: result.imagePrompt || "A professional HVAC installation in a modern luxury home, high quality, photorealistic",
                n: 1,
                size: "1024x1024",
            });
            const b64Data = imageResponse.data?.[0]?.b64_json;
            if (b64Data) {
                const imageBuffer = Buffer.from(b64Data, 'base64');
                const filePath = `marketing/visual_${Date.now()}.png`;

                const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(filePath, imageBuffer, {
                    contentType: 'image/png',
                    upsert: false
                });

                if (!uploadError) {
                    const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(filePath);
                    imageUrl = publicUrlData.publicUrl;
                } else {
                    console.error("Supabase upload error:", uploadError);
                }
            }
        } catch (imgError) {
            console.error("GPT-Image-2 Error:", imgError);
        }

        // 4. Envoi de l'aperçu par Email (Resend)
        try {
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "Gainable IA <noreply@gainable.ch>",
                to: "contact@gainable.fr",
                subject: `🚀 Aperçu Marketing IA : ${theme.theme}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Votre contenu du jour est prêt !</h2>
                        <p><strong>Thème :</strong> ${theme.theme}</p>
                        
                        <hr/>
                        <h3>📝 LinkedIn (Cible Pros)</h3>
                        <p style="white-space: pre-wrap; background: #f0f2f5; padding: 15px; border-radius: 8px;">${result.linkedin}</p>
                        
                        <h3>📝 Facebook (Cible Clients)</h3>
                        <p style="white-space: pre-wrap; background: #f0f2f5; padding: 15px; border-radius: 8px;">${result.facebook}</p>
                        
                        <h3>📸 Instagram (Visuel)</h3>
                        <p style="white-space: pre-wrap; background: #f0f2f5; padding: 15px; border-radius: 8px;">${result.instagram}</p>

                        <hr/>
                        <h3>🖼️ Image générée (DALL-E 3)</h3>
                        <img src="${imageUrl}" style="max-width: 100%; border-radius: 12px;" />
                        
                        <p style="margin-top: 20px;">
                            🔗 <strong>Lien article :</strong> <a href="https://www.gainable.fr/espace-pro">Consulter l'Espace Pro</a>
                        </p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Email Preview Error:", emailError);
        }

        return NextResponse.json({
            ...result,
            imageUrl,
            facebookLink: "https://www.gainable.fr", // Pour les clients
            linkedinLink: "https://www.gainable.fr/espace-pro", // Pour les artisans
            instagramLink: "https://www.gainable.fr",
            metaTitle: "Gainable.fr - La plateforme des Experts",
            theme: theme.theme
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
