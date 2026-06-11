import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import OpenAI from "openai";
import slugify from "slugify";

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

    // Generate a unique slug
    const baseSlug = slugify(`${result.title}-${city}`, { lower: true, strict: true });
    // Verify uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Save article in database as DRAFT
    const article = await prisma.article.create({
      data: {
        title: result.title,
        slug,
        introduction: result.introduction,
        content: result.content,
        metaDesc: result.metaDesc,
        status: "DRAFT",
        targetCity: city,
        expertId: expert.id,
        faq: result.faq
      }
    });

    return NextResponse.json({
      message: "Article généré avec succès en mode DRAFT",
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
