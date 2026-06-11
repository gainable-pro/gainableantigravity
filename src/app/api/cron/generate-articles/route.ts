import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import slugify from "slugify";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { CITIES_MEDIUM } from "@/data/cities-medium";

export const dynamic = "force-dynamic";

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED, ...CITIES_MEDIUM];

const B2C_TOPICS = [
  "climatisation réversible",
  "climatisation gainable",
  "installation de climatisation",
  "pompe à chaleur réversible",
  "clim gainable invisible",
  "prix climatisation gainable",
  "installateur de climatisation"
];

const B2B_TOPICS = [
  "comment trouver des chantiers de climatisation",
  "augmenter le chiffre d'affaires d'une entreprise CVC",
  "les meilleurs outils pour installateur de pompe à chaleur",
  "comment obtenir des leads climatisation qualifiés RGE",
  "développer son activité de pose de clim réversible et gainable",
  "rentabilité d'une entreprise de génie climatique en 2026",
  "trouver des chantiers d'installation gainable sans sous-traitance"
];

export async function GET(req: Request) {
  try {
    // 1. Authorization checks (Vercel Cron Secret, custom x-api-key, or development mode)
    const { searchParams } = new URL(req.url);
    const secretParam = searchParams.get("secret") || searchParams.get("key");
    const headerKey = req.headers.get("x-api-key");
    const authHeader = req.headers.get("authorization");

    const cronSecret = process.env.CRON_SECRET || "gainable_marketing_secret_2024";

    const isAuthorized =
      (process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`) ||
      (secretParam === cronSecret) ||
      (headerKey === cronSecret) ||
      (process.env.NODE_ENV === "development");

    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("[Cron Generate Articles] Starting daily B2C & B2B automated article pipeline...");

    const generatedArticles = [];
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resend = new Resend(process.env.RESEND_API_KEY);

    // ==========================================
    // PIPELINE 1 : ARTICLE B2C (Client Acquisition)
    // ==========================================
    console.log("[Cron Generate Articles] Generating B2C Client Article...");
    
    // Find next untargeted city
    const existingB2CArticles = await prisma.article.findMany({
      where: { targetCity: { not: null } },
      select: { targetCity: true }
    });
    const targetedCities = new Set(
      existingB2CArticles.map(a => a.targetCity).filter(Boolean) as string[]
    );
    const untargetedCities = ALL_CITIES.filter(city => !targetedCities.has(city.name));
    
    const b2cCity = untargetedCities.length > 0
      ? untargetedCities[0]
      : ALL_CITIES[Math.floor(Math.random() * ALL_CITIES.length)];

    if (b2cCity) {
      const citySeed = b2cCity.name.length + b2cCity.slug.length;
      const b2cTopic = B2C_TOPICS[citySeed % B2C_TOPICS.length];
      const b2cKeyword = `${b2cTopic} à ${b2cCity.name}`;

      // Resolve local expert or fallback
      let b2cExpert = await prisma.expert.findFirst({
        where: {
          status: 'active',
          OR: [
            { ville: { contains: b2cCity.name, mode: 'insensitive' } },
            { code_postal: { startsWith: b2cCity.department } }
          ]
        }
      });
      if (!b2cExpert) {
        b2cExpert = await prisma.expert.findFirst({ where: { status: 'active' } });
      }

      if (b2cExpert) {
        const b2cPrompt = `
        Tu es un rédacteur SEO expert en génie climatique pour Gainable.fr.
        Rédige un article de blog SEO B2C haut de gamme et complet ciblant les propriétaires de maisons.
        Mot-clé principal : "${b2cKeyword}".
        
        L'expert associé à cet article est : "${b2cExpert.nom_entreprise}" situé à "${b2cExpert.ville}".
        Ville cible : "${b2cCity.name}" (Code postal: "${b2cCity.zip}", Département: "${b2cCity.department}", Région: "${b2cCity.region}").
        
        Consignes de rédaction :
        - Ton : Professionnel, rassurant et expert.
        - Cible : Propriétaires immobiliers cherchant à installer ou remplacer un climatiseur.
        - Structure l'article avec des balises HTML (<h2>, <h3>, <p>, <ul>, <li>, <strong>). Ne mets pas de balise <html> ou <body> ou de titre h1 dans le corps.
        - Squelette de l'article :
          - Une introduction accrocheuse (externe au content HTML).
          - Une section H2 d'état des lieux ou présentation de la solution à ${b2cCity.name}.
          - Une section H3 de détails techniques (SCOP, marques comme Daikin, Mitsubishi, gaines de soufflage, régulation par zone Airzone).
          - Une section H2 des avantages locaux (aides RGE, confort d'été face aux vagues de chaleur à ${b2cCity.name}, silence).
          - Une section H3 expliquant comment choisir l'installateur (qualifications RGE QualiPac, décennale).
        - Fais un article complet de minimum 700 mots.
        
        Format de retour obligatoire (JSON pur) :
        {
          "title": "Titre optimisé de l'article B2C",
          "introduction": "Introduction engageante de 2-3 phrases avec le mot-clé principal.",
          "content": "Le corps de l'article au format HTML sans <h1>",
          "metaDesc": "Meta description optimisée SEO (< 155 caractères)",
          "imagePrompt": "A highly detailed, professional photorealistic prompt for DALL-E 3 showing a premium ducted AC (climatisation gainable) installation in a luxury modern home, minimalist air diffusion grills on the ceiling, high-end architecture, warm natural light, commercial photography style, 1024x1024.",
          "faq": [
            {
              "question": "Question sur la clim à ${b2cCity.name} ?",
              "response": "Réponse précise"
            },
            {
              "question": "Pourquoi choisir un pro RGE à ${b2cCity.name} ?",
              "response": "Réponse sur les aides et la sécurité"
            }
          ]
        }
        `;

        try {
          const b2cCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: "system", content: "Tu es un rédacteur SEO expert spécialisé dans le B2C de la climatisation réversible." },
              { role: "user", content: b2cPrompt }
            ],
            response_format: { type: "json_object" }
          });

          const b2cResult = JSON.parse(b2cCompletion.choices[0].message.content || "{}");

          if (b2cResult.title && b2cResult.content) {
            // Generate B2C Image via DALL-E 3
            let b2cImageUrl = null;
            try {
              const b2cImageResponse = await openai.images.generate({
                model: "dall-e-3",
                prompt: b2cResult.imagePrompt || `A premium photograph of a modern, luxury home interior in ${b2cCity.name}, showing a ducted air conditioning (climatisation gainable) ceiling vent, 1024x1024.`,
                size: "1024x1024",
                quality: "standard"
              });
              const dallEUrl = b2cImageResponse.data?.[0]?.url;
              if (dallEUrl) {
                const imageRes = await fetch(dallEUrl);
                if (imageRes.ok) {
                  const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
                  const cleanCityName = slugify(b2cCity.name, { lower: true, strict: true });
                  const filePath = `articles/b2c_${cleanCityName}_${Date.now()}.png`;

                  const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(filePath, imageBuffer, {
                    contentType: 'image/png',
                    upsert: false
                  });

                  if (!uploadError) {
                    const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(filePath);
                    b2cImageUrl = publicUrlData.publicUrl;
                  }
                }
              }
            } catch (imgErr) {
              console.error("[Cron B2C Image] DALL-E failed:", imgErr);
            }

            // Slugify & Unique verify
            const baseB2CSlug = slugify(`${b2cResult.title}-${b2cCity.name}`, { lower: true, strict: true });
            let finalB2CSlug = baseB2CSlug;
            let counter = 1;
            while (await prisma.article.findFirst({ where: { expertId: b2cExpert.id, slug: finalB2CSlug } })) {
              finalB2CSlug = `${baseB2CSlug}-${counter}`;
              counter++;
            }

            const b2cArticle = await prisma.article.create({
              data: {
                title: b2cResult.title,
                slug: finalB2CSlug,
                introduction: b2cResult.introduction,
                content: b2cResult.content,
                mainImage: b2cImageUrl,
                altText: `Installation ${b2cKeyword}`,
                targetCity: b2cCity.name,
                metaDesc: b2cResult.metaDesc,
                status: "PUBLISHED",
                expertId: b2cExpert.id,
                faq: b2cResult.faq,
                publishedAt: new Date()
              }
            });

            // Send B2C email
            const b2cLink = `https://www.gainable.fr/entreprise/${b2cExpert.slug}/articles/${finalB2CSlug}`;
            try {
              await resend.emails.send({
                from: "Gainable IA <onboarding@resend.dev>",
                to: "contact@gainable.fr",
                subject: `✍️ [B2C CLIENT] Nouvel Article SEO Publié : ${b2cResult.title} (${b2cCity.name})`,
                html: `
                  <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px;">
                    <h2 style="color: #D59B2B; margin-top: 0;">✍️ Nouvel article B2C client publié !</h2>
                    <p><strong>Cible :</strong> Particuliers / Clients à ${b2cCity.name}</p>
                    <p><strong>Mot-clé ciblé :</strong> "${b2cKeyword}"</p>
                    <p><strong>Artisan local associé :</strong> ${b2cExpert.nom_entreprise}</p>
                    <p><strong>URL de publication :</strong> <a href="${b2cLink}" style="color: #D59B2B; font-weight: bold; text-decoration: none;">${b2cLink}</a></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                    
                    <h3 style="font-size: 20px; margin-bottom: 10px; color: #1e293b;">${b2cResult.title}</h3>
                    <p style="font-style: italic; color: #475569; font-size: 16px; margin-bottom: 20px;">${b2cResult.introduction}</p>
                    
                    ${b2cImageUrl ? `<div style="margin: 20px 0;"><img src="${b2cImageUrl}" alt="Illustration" style="max-width: 100%; border-radius: 12px; height: auto;"/></div>` : ''}
                    
                    <div style="line-height: 1.6; color: #334155;">
                      ${b2cResult.content}
                    </div>
                  </div>
                `
              });
            } catch (emailErr) {
              console.error("[Cron B2C Email] Failed:", emailErr);
            }

            generatedArticles.push({
              type: "B2C",
              title: b2cArticle.title,
              slug: b2cArticle.slug,
              city: b2cCity.name
            });
          }
        } catch (gptErr) {
          console.error("[Cron B2C GPT] Generation failed:", gptErr);
        }
      }
    }

    // ==========================================
    // PIPELINE 2 : ARTICLE B2B (Artisan Acquisition)
    // ==========================================
    console.log("[Cron Generate Articles] Generating B2B Pro/Artisan Article...");

    // Resolve the platform expert (gainable-fr)
    let b2bExpert = await prisma.expert.findFirst({
      where: { slug: "gainable-fr" }
    });
    if (!b2bExpert) {
      b2bExpert = await prisma.expert.findFirst({
        where: { slug: { contains: "gainable" } }
      }) || await prisma.expert.findFirst({
        where: { status: 'active' }
      });
    }

    if (b2bExpert) {
      // Pick next B2B topic based on active count
      const existingB2BArticlesCount = await prisma.article.count({
        where: { expertId: b2bExpert.id }
      });
      const b2bTopic = B2B_TOPICS[existingB2BArticlesCount % B2B_TOPICS.length];
      const b2bKeyword = b2bTopic;

      const b2bPrompt = `
      Tu es un conseiller en développement commercial expert du bâtiment pour Gainable.fr.
      Rédige un article de blog SEO B2B haut de gamme, technique et ultra convaincant destiné aux artisans, chauffagistes et installateurs de climatisation.
      Mot-clé principal : "${b2bKeyword}".
      
      Consignes de rédaction :
      - Ton : Professionnel, motivant, pragmatique (orienté business, chantiers, rentabilité).
      - Cible : Installateurs CVC, plombiers RGE et frigoristes indépendants.
      - Présente le modèle de Gainable.fr comme le meilleur partenaire d'acquisition (leads qualifiés, pas de commissions abusives, autonomie tarifaire).
      - Structure l'article avec des balises HTML (<h2>, <h3>, <p>, <ul>, <li>, <strong>). Ne mets pas de balise <html> ou <body> ou de titre h1 dans le corps.
      - Squelette de l'article :
        - Une introduction accrocheuse (externe au content HTML).
        - Une section H2 analysant le problème actuel des artisans (concurrence, prix des leads, marges serrées).
        - Une section H3 de conseils opérationnels (optimisation des devis, réactivité, relances).
        - Une section H2 présentant la solution Gainable.fr (abonnements fixes, chantiers ciblés géographiquement).
        - Une section H3 expliquant comment rejoindre le réseau en quelques clics.
      - Fais un article complet de minimum 700 mots.
      
      Format de retour obligatoire (JSON pur) :
      {
        "title": "Titre optimisé de l'article B2B",
        "introduction": "Introduction engageante de 2-3 phrases avec le mot-clé principal.",
        "content": "Le corps de l'article au format HTML sans <h1>",
        "metaDesc": "Meta description optimisée SEO pro (< 155 caractères)",
        "imagePrompt": "A highly detailed, professional photorealistic prompt for DALL-E 3 showing a professional heating and cooling engineer working with blueprints on a tablet inside a modern commercial building, business growth concept, high-end HVAC professional style, warm natural lighting, 1024x1024.",
        "faq": [
          {
            "question": "Comment s'assurer de la qualité des chantiers de clim ?",
            "response": "Réponse axée sur le ciblage géographique et la pré-qualification des clients."
          },
          {
            "question": "Quel budget investir pour obtenir des leads CVC ?",
            "response": "Réponse comparant le coût d'acquisition classique avec l'abonnement Gainable.fr."
          }
        ]
      }
      `;

      try {
        const b2bCompletion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "Tu es un rédacteur SEO B2B spécialisé dans l'acquisition d'artisans du bâtiment." },
            { role: "user", content: b2bPrompt }
          ],
          response_format: { type: "json_object" }
        });

        const b2bResult = JSON.parse(b2bCompletion.choices[0].message.content || "{}");

        if (b2bResult.title && b2bResult.content) {
          // Generate B2B Image via DALL-E 3
          let b2bImageUrl = null;
          try {
            const b2bImageResponse = await openai.images.generate({
              model: "dall-e-3",
              prompt: b2bResult.imagePrompt || `A professional heating engineer working inside a modern commercial office building, tech HVAC style, 1024x1024.`,
              size: "1024x1024",
              quality: "standard"
            });
            const dallEUrl = b2bImageResponse.data?.[0]?.url;
            if (dallEUrl) {
              const imageRes = await fetch(dallEUrl);
              if (imageRes.ok) {
                const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
                const cleanKeyword = slugify(b2bKeyword, { lower: true, strict: true }).slice(0, 30);
                const filePath = `articles/b2b_${cleanKeyword}_${Date.now()}.png`;

                const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(filePath, imageBuffer, {
                  contentType: 'image/png',
                  upsert: false
                });

                if (!uploadError) {
                  const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(filePath);
                  b2bImageUrl = publicUrlData.publicUrl;
                }
              }
            }
          } catch (imgErr) {
            console.error("[Cron B2B Image] DALL-E failed:", imgErr);
          }

          // Slugify & Unique verify
          const baseB2BSlug = slugify(b2bResult.title, { lower: true, strict: true });
          let finalB2BSlug = baseB2BSlug;
          let counter = 1;
          while (await prisma.article.findFirst({ where: { expertId: b2bExpert.id, slug: finalB2BSlug } })) {
            finalB2BSlug = `${baseB2BSlug}-${counter}`;
            counter++;
          }

          const b2bArticle = await prisma.article.create({
            data: {
              title: b2bResult.title,
              slug: finalB2BSlug,
              introduction: b2bResult.introduction,
              content: b2bResult.content,
              mainImage: b2bImageUrl,
              altText: b2bKeyword,
              metaDesc: b2bResult.metaDesc,
              status: "PUBLISHED",
              expertId: b2bExpert.id,
              faq: b2bResult.faq,
              publishedAt: new Date()
            }
          });

          // Send B2B email
          const b2bLink = `https://www.gainable.fr/entreprise/${b2bExpert.slug}/articles/${finalB2BSlug}`;
          try {
            await resend.emails.send({
              from: "Gainable IA <onboarding@resend.dev>",
              to: "contact@gainable.fr",
              subject: `💼 [B2B ARTISAN] Nouvel Article SEO Publié : ${b2bResult.title}`,
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px;">
                  <h2 style="color: #D59B2B; margin-top: 0;">💼 Nouvel article B2B pro/artisan publié !</h2>
                  <p><strong>Cible :</strong> Artisans CVC / Installateurs RGE</p>
                  <p><strong>Sujet ciblé :</strong> "${b2bKeyword}"</p>
                  <p><strong>Artisan associé (Auteur) :</strong> ${b2bExpert.nom_entreprise}</p>
                  <p><strong>URL de publication :</strong> <a href="${b2bLink}" style="color: #D59B2B; font-weight: bold; text-decoration: none;">${b2bLink}</a></p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
                  
                  <h3 style="font-size: 20px; margin-bottom: 10px; color: #1e293b;">${b2bResult.title}</h3>
                  <p style="font-style: italic; color: #475569; font-size: 16px; margin-bottom: 20px;">${b2bResult.introduction}</p>
                  
                  ${b2bImageUrl ? `<div style="margin: 20px 0;"><img src="${b2bImageUrl}" alt="Illustration" style="max-width: 100%; border-radius: 12px; height: auto;"/></div>` : ''}
                  
                  <div style="line-height: 1.6; color: #334155;">
                    ${b2bResult.content}
                  </div>
                </div>
              `
            });
          } catch (emailErr) {
            console.error("[Cron B2B Email] Failed:", emailErr);
          }

          generatedArticles.push({
            type: "B2B",
            title: b2bArticle.title,
            slug: b2bArticle.slug,
            expert: b2bExpert.nom_entreprise
          });
        }
      } catch (gptErr) {
        console.error("[Cron B2B GPT] Generation failed:", gptErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Automated dual SEO articles pipeline completed successfully.`,
      generatedCount: generatedArticles.length,
      articles: generatedArticles
    });

  } catch (error: any) {
    console.error("[Cron Generate Articles] Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
