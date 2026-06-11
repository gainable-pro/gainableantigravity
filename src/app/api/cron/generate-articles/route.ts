import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import slugify from "slugify";
import { supabase } from "@/lib/supabase";
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

    console.log("[Cron Generate Articles] Starting daily automated article pipeline...");

    // 2. Query existing article targeted cities to find untargeted ones
    const existingArticles = await prisma.article.findMany({
      select: { targetCity: true }
    });

    const targetedCities = new Set(
      existingArticles.map(a => a.targetCity).filter(Boolean) as string[]
    );

    const untargetedCities = ALL_CITIES.filter(
      city => !targetedCities.has(city.name)
    );

    // Pick the first untargeted city (order respects CITIES_100 importance first)
    const city = untargetedCities.length > 0
      ? untargetedCities[0]
      : ALL_CITIES[Math.floor(Math.random() * ALL_CITIES.length)];

    if (!city) {
      return NextResponse.json({ error: "No target city available." }, { status: 500 });
    }

    console.log(`[Cron Generate Articles] Target city selected: ${city.name} (${city.zip})`);

    // 3. Select SEO Topic & Keyword
    const citySeed = city.name.length + city.slug.length;
    const topic = CORE_TOPICS[citySeed % CORE_TOPICS.length];
    const keyword = `${topic} à ${city.name}`;

    console.log(`[Cron Generate Articles] Keyword selected: "${keyword}"`);

    // 4. Resolve local expert or fallback
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
      // Fallback to first active expert in the DB
      expert = await prisma.expert.findFirst({
        where: { status: 'active' }
      });
    }

    if (!expert) {
      return NextResponse.json(
        { error: "No active experts found. Please register at least one active expert." },
        { status: 400 }
      );
    }

    console.log(`[Cron Generate Articles] Linked expert: "${expert.nom_entreprise}" (ID: ${expert.id})`);

    // 5. OpenAI call to write the article
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
      throw new Error("Invalid response schema from OpenAI");
    }

    console.log(`[Cron Generate Articles] Article written. Title: "${result.title}"`);

    // 6. Generate Image via DALL-E 3
    console.log("[Cron Generate Articles] Triggering DALL-E 3 visual generation...");
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
        console.log("[Cron Generate Articles] Image generated. Downloading from OpenAI...");
        
        const imageRes = await fetch(dallEUrl);
        if (!imageRes.ok) throw new Error("Failed to download image from DALL-E");
        
        const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
        
        // Sanitize and construct file name
        const cleanCityName = slugify(city.name, { lower: true, strict: true });
        const filePath = `articles/seo_${cleanCityName}_${Date.now()}.png`;

        console.log(`[Cron Generate Articles] Uploading to Supabase Storage at: ${filePath}`);

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('gainable-assets')
          .upload(filePath, imageBuffer, {
            contentType: 'image/png',
            upsert: false
          });

        if (uploadError) {
          console.error("[Cron Generate Articles] Supabase upload failed:", uploadError);
        } else {
          const { data: publicUrlData } = supabase
            .storage
            .from('gainable-assets')
            .getPublicUrl(filePath);

          publicImageUrl = publicUrlData.publicUrl;
          console.log(`[Cron Generate Articles] Permanent public image URL: ${publicImageUrl}`);
        }
      }
    } catch (imgError) {
      console.error("[Cron Generate Articles] Image generation or upload failed, continuing without main image:", imgError);
    }

    // 7. Slugify Title & Verify uniqueness
    const baseSlug = slugify(`${result.title}-${city.name}`, { lower: true, strict: true });
    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.article.findFirst({
      where: {
        expertId: expert.id,
        slug: finalSlug
      }
    })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 8. Create Article in Postgres Database under status PUBLISHED
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

    console.log(`[Cron Generate Articles] Article successfully published! ID: ${newArticle.id}, Slug: ${newArticle.slug}`);

    return NextResponse.json({
      success: true,
      message: "Automated article successfully generated and published.",
      article: {
        id: newArticle.id,
        title: newArticle.title,
        slug: newArticle.slug,
        city: city.name,
        expert: expert.nom_entreprise,
        imageUrl: publicImageUrl
      }
    });

  } catch (error: any) {
    console.error("[Cron Generate Articles] Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
