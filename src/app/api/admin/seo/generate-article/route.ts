import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import OpenAI from "openai";
import slugify from "slugify";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { keyword, city, expertId } = await req.json();

    if (!keyword || !city || !expertId) {
      return NextResponse.json({ message: "Paramètres manquants (keyword, city, expertId)" }, { status: 400 });
    }

    // Fetch the platform expert to link the article (always publish under gainable-fr)
    let expert = await prisma.expert.findFirst({
      where: { slug: "gainable-fr" }
    });

    if (!expert) {
      // Fallback to other platform profiles or explicitly passed expertId
      expert = await prisma.expert.findFirst({
        where: { slug: { in: ["gainable-redaction", "redaction-gainable"] } }
      }) || await prisma.expert.findUnique({
        where: { id: expertId },
      }) || await prisma.expert.findFirst();
    }

    if (!expert) {
      return NextResponse.json({ message: "Expert introuvable" }, { status: 404 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resend = new Resend(process.env.RESEND_API_KEY);

    const prompt = `
    Tu es un rédacteur SEO expert en génie climatique pour Gainable.fr.
    Rédige un article de blog SEO haut de gamme optimisé pour le mot-clé : "${keyword}" dans la ville de "${city}".
    
    L'expert associé à cet article est : "${expert.nom_entreprise}" situé à "${expert.ville}".
    
    Consignes de rédaction :
    - Ton : Professionnel, instructif, rassurant et expert.
    - Cible : Propriétaires de maisons individuelles ou de locaux tertiaires.
    - Le contenu doit démontrer de l'expertise (E-E-A-T) sur la climatisation gainable (ex: confort acoustique, régulation par zone/Airzone, économies d'énergie, choix des marques comme Daikin ou Mitsubishi).
    - Incorpore subtilement des mentions locales de la ville de "${city}" et présente "${expert.nom_entreprise}" comme l'installateur local recommandé par la plateforme.
    - Structure l'article avec des balises HTML (<h2>, <h3>, <p>, <ul>, <li>, <strong>). Ne mets pas de balise <html> ou <body>.
    
    Format de l'objet JSON à retourner :
    {
      "title": "Un titre accrocheur et optimisé SEO pour le mot-clé",
      "introduction": "Une introduction engageante de 2-3 phrases contenant le mot-clé principal.",
      "content": "Le corps de l'article complet en HTML (minimum 600 mots, structuré en sections <h2> et <h3>)",
      "metaDesc": "Une meta description optimisée SEO pour Google de moins de 155 caractères",
      "imagePrompt": "A highly detailed, professional photorealistic prompt for DALL-E 3 showing a premium ducted AC (climatisation gainable) installation in a luxury modern home, minimalist air diffusion grills on the ceiling, high-end architecture, warm natural light, commercial photography style, 1024x1024.",
      "faq": [
        {
          "question": "Question fréquente liée au mot-clé",
          "response": "Réponse précise et utile"
        },
        {
          "question": "Autre question sur le prix ou l'installation à ${city}",
          "response": "Réponse"
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

    // Generate Image via DALL-E 3
    let imageUrl = null;
    try {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: result.imagePrompt || `A highly detailed, professional photorealistic photograph of a modern ducted air conditioning (climatisation gainable) installation in a luxury house in ${city}, ceiling diffusion vents, 1024x1024.`,
        size: "1024x1024",
        quality: "standard"
      });
      const dallEUrl = imageResponse.data?.[0]?.url;
      if (dallEUrl) {
        const imageRes = await fetch(dallEUrl);
        if (imageRes.ok) {
          const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
          const cleanCityName = slugify(city, { lower: true, strict: true });
          const filePath = `articles/manual_${cleanCityName}_${Date.now()}.png`;

          const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(filePath, imageBuffer, {
            contentType: 'image/png',
            upsert: false
          });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(filePath);
            imageUrl = publicUrlData.publicUrl;
          }
        }
      }
    } catch (imgErr) {
      console.error("[Manual Image] DALL-E failed:", imgErr);
    }

    // Generate a unique slug
    const baseSlug = slugify(`${result.title}-${city}`, { lower: true, strict: true });
    // Verify uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Save article in database as PUBLISHED
    const article = await prisma.article.create({
      data: {
        title: result.title,
        slug,
        introduction: result.introduction,
        content: result.content,
        mainImage: imageUrl,
        altText: `Installation ${keyword}`,
        targetCity: city,
        metaDesc: result.metaDesc,
        status: "PUBLISHED",
        expertId: expert.id,
        faq: result.faq,
        publishedAt: new Date()
      }
    });

    // Send Resend email notification
    const articleLink = `https://www.gainable.fr/entreprise/${expert.slug}/articles/${slug}`;
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Gainable IA <noreply@gainable.ch>",
        to: "contact@gainable.fr",
        subject: `✍️ [MANUEL] Nouvel Article SEO Publié : ${result.title} (${city})`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #D59B2B; margin-top: 0;">✍️ Nouvel article SEO généré manuellement et publié !</h2>
            <p><strong>Ville cible :</strong> ${city}</p>
            <p><strong>Mot-clé ciblé :</strong> "${keyword}"</p>
            <p><strong>Auteur / Expert associé :</strong> ${expert.nom_entreprise}</p>
            <p><strong>URL de publication :</strong> <a href="${articleLink}" style="color: #D59B2B; font-weight: bold; text-decoration: none;">${articleLink}</a></p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
            
            <h3 style="font-size: 20px; margin-bottom: 10px; color: #1e293b;">${result.title}</h3>
            <p style="font-style: italic; color: #475569; font-size: 16px; margin-bottom: 20px;">${result.introduction}</p>
            
            ${imageUrl ? `<div style="margin: 20px 0;"><img src="${imageUrl}" alt="Illustration" style="max-width: 100%; border-radius: 12px; height: auto;"/></div>` : ''}
            
            <div style="line-height: 1.6; color: #334155;">
              ${result.content}
            </div>
          </div>
        `
      });
    } catch (emailErr) {
      console.error("[Manual Article Email] Failed:", emailErr);
    }

    return NextResponse.json({
      message: "Article généré et publié avec succès !",
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status,
        targetCity: article.targetCity,
        expertName: expert.nom_entreprise,
        expertSlug: expert.slug
      }
    });
  } catch (error: any) {
    console.error("Error generating SEO article:", error);
    return NextResponse.json({ message: "Erreur serveur lors de la génération", error: error.message }, { status: 500 });
  }
}
