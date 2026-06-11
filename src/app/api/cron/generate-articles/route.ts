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

const CORE_TOPICS = [
  "climatisation réversible",
  "climatisation gainable",
  "installation de climatisation",
  "pompe à chaleur réversible",
  "clim gainable invisible",
  "prix climatisation gainable",
  "installateur de climatisation"
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

    // 2. Parse optional 'count' parameter (Min: 1, Max: 3)
    const countParam = searchParams.get("count");
    const articlesCount = Math.min(Math.max(parseInt(countParam || "1", 10), 1), 3);

    console.log(`[Cron Generate Articles] Starting daily automated article pipeline for ${articlesCount} article(s)...`);

    // 3. Query existing article targeted cities to find untargeted ones
    const existingArticles = await prisma.article.findMany({
      select: { targetCity: true }
    });

    const targetedCities = new Set(
      existingArticles.map(a => a.targetCity).filter(Boolean) as string[]
    );

    let currentUntargetedCities = ALL_CITIES.filter(
      city => !targetedCities.has(city.name)
    );

    const generatedArticles = [];
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 4. Generate articles in a loop
    for (let i = 0; i < articlesCount; i++) {
      const city = currentUntargetedCities.length > 0
        ? currentUntargetedCities[0]
        : ALL_CITIES[Math.floor(Math.random() * ALL_CITIES.length)];

      if (!city) {
        console.warn("[Cron Generate Articles] No city found to target, skipping loop step.");
        continue;
      }

      // Remove the selected city from local tracking to avoid picking it again in this run
      currentUntargetedCities = currentUntargetedCities.filter(c => c.name !== city.name);

      console.log(`[Cron Generate Articles] [${i + 1}/${articlesCount}] Selected city: ${city.name} (${city.zip})`);

      // Select SEO Topic & Keyword
      const citySeed = city.name.length + city.slug.length + i;
      const topic = CORE_TOPICS[citySeed % CORE_TOPICS.length];
      const keyword = `${topic} à ${city.name}`;

      // Resolve local expert or fallback
      let expert = await prisma.expert.findFirst({
        where: {
          status: 'active',
          OR: [
            { ville: { contains: city.name, mode: 'insensitive' } },
            { code_postal: { startsWith: city.department } }
          ]
        }
      });

      if (!expert) {
        expert = await prisma.expert.findFirst({
          where: { status: 'active' }
        });
      }

      if (!expert) {
        console.error("[Cron Generate Articles] No active experts found, skipping step.");
        continue;
      }

      // OpenAI call to write the article
      const prompt = `
      Tu es un rédacteur SEO expert en génie climatique pour Gainable.fr.
      Rédige un article de blog SEO haut de gamme et ultra complet optimisé pour le mot-clé principal : "${keyword}".
      
      L'expert associé à cet article est : "${expert.nom_entreprise}" situé à "${expert.ville}".
      Ville cible : "${city.name}" (Code postal: "${city.zip}", Département: "${city.department}", Région: "${city.region}").
      
      Consignes de rédaction :
      - Ton : Professionnel, instructif, rassurant et expert.
      - Cible : Propriétaires de maisons individuelles ou de locaux tertiaires dans le secteur de ${city.name}.
      - Structure l'article avec des balises HTML (<h2>, <h3>, <p>, <ul>, <li>, <strong>). Ne mets pas de balise <html> ou <body> ou de titre h1 dans le corps.
      - Le squelette de l'article doit comprendre exactement :
        - Une introduction accrocheuse (externe au content HTML).
        - Une section H2 d'état des lieux ou présentation de la solution.
        - Une section H3 de détails techniques (SCOP, marques comme Daikin, Mitsubishi, gaines de soufflage, régulation par zone Airzone).
        - Une section H2 des avantages locaux (aides RGE, confort d'été face aux vagues de chaleur à ${city.name}, silence).
        - Une section H3 expliquant comment choisir l'installateur (qualifications RGE QualiPac, décennale).
      - Incorpore subtilement des mentions locales de la commune de "${city.name}" pour renforcer la proximité géolocalisée.
      - Fais un article complet de minimum 700 mots.
      
      Format de retour obligatoire (JSON pur) :
      {
        "title": "Titre optimisé de l'article avec le mot-clé",
        "introduction": "Introduction engageante de 2-3 phrases avec le mot-clé principal.",
        "content": "Le corps de l'article au format HTML sans <h1>",
        "metaDesc": "Meta description optimisée SEO (< 155 caractères)",
        "imagePrompt": "A highly detailed, professional photorealistic prompt for DALL-E 3 showing a premium ducted AC (climatisation gainable) installation in a luxury modern home, minimalist air diffusion grills on the ceiling, high-end architecture, warm natural light, commercial photography style, 1024x1024.",
        "faq": [
          {
            "question": "Question sur la clim à ${city.name} ?",
            "response": "Réponse précise"
          },
          {
            "question": "Pourquoi choisir un pro RGE à ${city.name} ?",
            "response": "Réponse sur les aides et la sécurité"
          }
        ]
      }
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Tu es un rédacteur SEO expert spécialisé dans le B2C/B2B de la climatisation réversible et du gainable." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");

      if (!result.title || !result.content) {
        console.warn(`[Cron Generate Articles] Skipping city ${city.name} due to invalid response schema from OpenAI.`);
        continue;
      }

      // Generate Image via DALL-E 3
      let publicImageUrl = null;
      try {
        const dallEResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: result.imagePrompt || `A premium photograph of a modern, luxury home interior in ${city.name}, showing a sleek, invisible ducted air conditioning (climatisation gainable) ceiling vent. Clean lines, minimalist architecture, professional lighting, photorealistic, high-end HVAC installation.`,
          size: "1024x1024",
          quality: "standard"
        });

        const dallEUrl = dallEResponse.data?.[0]?.url;

        if (dallEUrl) {
          const imageRes = await fetch(dallEUrl);
          if (imageRes.ok) {
            const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
            const cleanCityName = slugify(city.name, { lower: true, strict: true });
            const filePath = `articles/seo_${cleanCityName}_${Date.now()}.png`;

            const { error: uploadError } = await supabase
              .storage
              .from('gainable-assets')
              .upload(filePath, imageBuffer, {
                contentType: 'image/png',
                upsert: false
              });

            if (!uploadError) {
              const { data: publicUrlData } = supabase
                .storage
                .from('gainable-assets')
                .getPublicUrl(filePath);

              publicImageUrl = publicUrlData.publicUrl;
            }
          }
        }
      } catch (imgError) {
        console.error("[Cron Generate Articles] Image generation or upload failed:", imgError);
      }

      // Slugify Title & Verify uniqueness
      const baseSlug = slugify(`${result.title}-${city.name}`, { lower: true, strict: true });
      let finalSlug = baseSlug;
      let slugCounter = 1;
      while (await prisma.article.findFirst({
        where: { expertId: expert.id, slug: finalSlug }
      })) {
        finalSlug = `${baseSlug}-${slugCounter}`;
        slugCounter++;
      }

      // Create Article in Postgres
      const newArticle = await prisma.article.create({
        data: {
          title: result.title,
          slug: finalSlug,
          introduction: result.introduction,
          content: result.content,
          mainImage: publicImageUrl,
          altText: `Installation ${keyword}`,
          targetCity: city.name,
          metaDesc: result.metaDesc,
          status: "PUBLISHED",
          expertId: expert.id,
          faq: result.faq,
          publishedAt: new Date()
        }
      });

      console.log(`[Cron Generate Articles] Article published! Slug: ${newArticle.slug}`);

      // Send Email via Resend
      const articleLink = `https://www.gainable.fr/entreprise/${expert.slug}/articles/${finalSlug}`;
      try {
        await resend.emails.send({
          from: "Gainable IA <onboarding@resend.dev>",
          to: "contact@gainable.fr",
          subject: `✍️ Nouvel Article SEO Publié : ${result.title} (${city.name})`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px;">
              <h2 style="color: #D59B2B; margin-top: 0;">✍️ Nouvel article SEO publié !</h2>
              <p><strong>Ville ciblée :</strong> ${city.name} (${city.zip})</p>
              <p><strong>Mot-clé ciblé :</strong> "${keyword}"</p>
              <p><strong>Artisan associé :</strong> ${expert.nom_entreprise}</p>
              <p><strong>URL de publication :</strong> <a href="${articleLink}" style="color: #D59B2B; font-weight: bold; text-decoration: none;">${articleLink}</a></p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
              
              <h3 style="font-size: 20px; margin-bottom: 10px; color: #1e293b;">${result.title}</h3>
              <p style="font-style: italic; color: #475569; font-size: 16px; margin-bottom: 20px;">${result.introduction}</p>
              
              ${publicImageUrl ? `<div style="margin: 20px 0;"><img src="${publicImageUrl}" alt="Illustration article" style="max-width: 100%; border-radius: 12px; height: auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"/></div>` : ''}
              
              <div style="line-height: 1.6; color: #334155;">
                ${result.content}
              </div>
              
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
              <p style="font-size: 12px; color: #64748b; text-align: center; margin-bottom: 0;">
                Cet e-mail a été généré automatiquement par l'agent SEO de Gainable.fr.
              </p>
            </div>
          `
        });
      } catch (emailError) {
        console.error("[Cron Generate Articles] Failed to send email confirmation:", emailError);
      }

      generatedArticles.push({
        id: newArticle.id,
        title: newArticle.title,
        slug: newArticle.slug,
        city: city.name,
        expert: expert.nom_entreprise,
        imageUrl: publicImageUrl
      });
    }

    return NextResponse.json({
      success: true,
      message: `Automated articles pipeline finished. ${generatedArticles.length} article(s) successfully generated and published.`,
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
