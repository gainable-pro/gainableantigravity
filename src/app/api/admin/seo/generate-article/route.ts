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

    const { keyword, city, expertId, theme = "cvc", orientedAcquisition } = await req.json();

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
    Tu es un rédacteur et ingénieur thermicien senior rédigeant pour le portail Gainable.fr.
    Rédige un article de blog SEO de qualité éditoriale exceptionnelle, haut de gamme et extrêmement complet, optimisé pour le mot-clé : "${keyword}" dans la ville de "${city}".
    
    L'expert associé à cet article est : "${expert.nom_entreprise}" situé à "${expert.ville}".
    
    CONSIGNES ÉDITORIALES DE HAUTE QUALITÉ :
    - Ton : Professionnel, pragmatique, hautement technique mais accessible, pédagogue et digne d'un expert du domaine.
    - Cible : Propriétaires de maisons individuelles ou de locaux professionnels/tertiaires.
    - Évite les clichés IA et tics de langage : Interdiction stricte d'utiliser des expressions de transition banales comme "En conclusion", "Tout d'abord", "De plus", "En somme", "Il est important de noter", "Dans cet article, nous allons voir", etc. Entre directement dans le vif du sujet avec des phrases concrètes.
    - Style d'écriture : Phrases de longueurs variées, vocabulaire riche et précis, structure fluide. Raconte une véritable histoire technique pour capter l'intérêt du lecteur.
    
    ${theme === "dpe" ? `
    - THÉMATIQUE DIAGNOSTICS IMMOBILIERS & DPE :
      - Explique le rôle critique des diagnostics immobiliers réglementaires (DPE - Diagnostic de Performance Énergétique, amiante, électricité, gaz, plomb, etc.) et leurs durées de validité respectives.
      - Mets en avant que la plateforme Gainable.fr référence des diagnostiqueurs certifiés, vérifiés et fiables, garantissant des examens sérieux et sans complaisance.
      - Fais le lien direct entre les résultats du DPE (déperditions thermiques, ponts thermiques, isolation déficiente) et les calculs/études nécessaires pour dimensionner correctement une future climatisation réversible ou pompe à chaleur.
      - Explique comment les rapports de diagnostic aident à prioriser les travaux d'efficacité énergétique globale.
    ` : theme === "bureau_etude" ? `
    - THÉMATIQUE BUREAU D'ÉTUDE THERMIQUE & DIMENSIONNEMENT :
      - Explique l'importance absolue de passer par un bureau d'étude thermique indépendant pour faire réaliser des calculs précis de déperditions de chaleur et dimensionner idéalement les équipements CVC.
      - Souligne le rôle indispensable des études thermiques pour les chantiers complexes et de grande envergure, comme les locaux commerciaux, magasins, bureaux, et centres commerciaux.
      - Précise que les bureaux d'études thermiques jouent également un rôle de conseil neutre et peuvent pré-sélectionner les meilleurs artisans qualifiés RGE du réseau Gainable.fr pour proposer des solutions parfaitement exécutées sur ces chantiers tertiaires ou résidentiels complexes.
      - Explique les normes thermiques actuelles (RE2020) et l'impact sur le dépôt des permis de construire.
    ` : `
    - THÉMATIQUE CLIMATISATION & GAINABLE (CVC) :
      - Explique des concepts thermiques clés : les coefficients de performance (SCOP et SEER) et leur impact concret sur la facture d'électricité.
      - Mentionne des technologies spécifiques : la régulation par zone (comme le système Airzone avec registres motorisés et thermostats individuels), la discrétion sonore (niveaux de pression acoustique inférieurs à 20-22 dB(A) pour les unités intérieures), et l'intégration esthétique (plénums de soufflage, grilles de diffusion linéaires ou à double déflexion intégrées dans les faux-plafonds).
      - Fais référence à des constructeurs reconnus (Daikin, Mitsubishi Electric, Toshiba) et à leurs gammes adaptées aux combles ou faux-plafonds.
      - Mentionne les garanties indispensables : l'assurance décennale, la certification RGE QualiPAC, l'attestation de capacité de manipulation des fluides frigorigènes.
      - CONVICTION TARIFATION RÉELLE (CRITIQUE) : Pour tout chiffrage ou mention de tarif d'une climatisation gainable (système réversible encastré), le coût d'une installation complète de qualité (matériel, gaines, plénums, grilles, régulation multizone type Airzone et main d'œuvre) se situe obligatoirement dans une fourchette de 10 000 € à 20 000 € minimum selon la puissance et le nombre de zones. Interdiction absolue de citer des prix bas erronés comme 3 000 €, 5 000 € ou 8 000 € pour du gainable complet (ces petits budgets correspondent à des mono-splits muraux simples). Rappelle que le gainable de qualité exige un budget de départ de 10 000 € minimum.
    `}
    
    ${orientedAcquisition ? `
    - ORIENTATION ACQUISITION & CONVERSION (CRITIQUE) : Cet article doit être fortement orienté vers la conversion et l'acquisition de prospects qualifiés. Intègre de manière naturelle et convaincante dans le texte des appels à l'action (CTA) clairs (par exemple : demander une étude thermique gratuite, faire une simulation d'aides CEE/MaPrimeRénov', faire estimer son DPE ou solliciter un diagnostic immobilier complet auprès des partenaires agréés de la plateforme). Insiste sur les bénéfices financiers (jusqu'à 70% d'économies d'énergie) et de confort pour inciter le lecteur à passer à l'action.
    ` : ''}
    - Contexte local : Adapte les arguments aux particularités climatiques de la région de "${city}" (ex: canicules estivales, hivers rigoureux, spécificités du bâti local). Présente "${expert.nom_entreprise}" comme le professionnel local de référence, sans paraître agressif sur le plan commercial.
    - Formatage : Structure rich    Format de l'objet JSON à retourner :
    {
      "title": "Titre éditorial accrocheur, unique et optimisé SEO",
      "introduction": "Une introduction percutante de 3-4 phrases posant la problématique et contenant le mot-clé.",
      "content": "Le corps de l'article complet en HTML (minimum 850 mots, structuré avec plusieurs <h2> et des sous-parties <h3> détaillée. Chaque paragraphe doit faire au moins 4-5 lignes d'analyse réelle. Insère obligatoirement au milieu de l'article la balise d'image secondaire sous cette forme exacte : <img src=\"[SECONDARY_IMAGE_URL]\" alt=\"Description optimisée SEO\" class=\"my-6 w-full rounded-xl border border-slate-200 shadow-sm max-h-[400px] object-cover\" />)",
      "metaDesc": "Une meta description optimisée SEO pour Google de moins de 155 caractères, incitative au clic.",
      "imagePrompt": "A highly detailed, professional photorealistic prompt showing the corresponding thematic scene (ex: for DPE: a modern home blueprint or certified inspector, for bureau d'etude: thermal study office workspace with blueprints, for CVC: premium ceiling grills in a luxury home), commercial photography style, 1024x1024.",
      "secondaryImagePrompt": "A highly detailed, professional photorealistic prompt for another different scene matching the article topic (ex: close-up of a thermostat, heat pump components, thermal calculation graphs, or technician using a digital level/tool) to be used as inline content image, commercial photography style, 1024x1024.",
      "faq": [
        {
          "question": "Question technique ou pratique pertinente liée au sujet ou à la région de ${city}",
          "response": "Réponse d'expert détaillée, chiffrée et précise (3-4 phrases)."
        },
        {
          "question": "Question sur le coût, les aides de l'État (CEE, MaPrimeRénov') ou le choix de l'installateur RGE ou diagnostiqueur certifié",
          "response": "Réponse claire et rassurante, respectant strictement les tarifs de marché (si gainable complet: 10 000 € à 20 000 €, si diagnostic/étude thermique: tarifs réglementés ou habituels de ces prestations)."
        },
        {
          "question": "Question sur l'entretien, l'accompagnement ou la durée de validité",
          "response": "Conseils pratiques précis."
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

    // Generate Image 1 (Cover) via GPT-Image-2
    let imageUrl = "/blog/gainable-salon.jpg"; // Default fallback cover
    try {
      const imageResponse = await openai.images.generate({
        model: "gpt-image-2",
        prompt: result.imagePrompt || `A highly detailed, professional photorealistic photograph of a modern ducted air conditioning (climatisation gainable) installation in a luxury house in ${city}, ceiling diffusion vents, 1024x1024.`,
        size: "1024x1024"
      });
      const b64Data = imageResponse.data?.[0]?.b64_json;
      if (b64Data) {
        const imageBuffer = Buffer.from(b64Data, 'base64');
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
    } catch (imgErr) {
      console.error("[Manual Image] Cover generation failed:", imgErr);
    }

    // Generate Image 2 (Secondary inline) via GPT-Image-2
    let secondaryImageUrl = "/blog/gainable-installation-vent.jpg"; // Default fallback secondary
    try {
      const secondaryResponse = await openai.images.generate({
        model: "gpt-image-2",
        prompt: result.secondaryImagePrompt || `A highly detailed, professional photorealistic photograph of local architecture or technical renovation tools, 1024x1024.`,
        size: "1024x1024"
      });
      const b64DataSec = secondaryResponse.data?.[0]?.b64_json;
      if (b64DataSec) {
        const imageBuffer = Buffer.from(b64DataSec, 'base64');
        const cleanCityName = slugify(city, { lower: true, strict: true });
        const filePath = `articles/manual_sec_${cleanCityName}_${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(filePath, imageBuffer, {
          contentType: 'image/png',
          upsert: false
        });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(filePath);
          secondaryImageUrl = publicUrlData.publicUrl;
        }
      }
    } catch (imgErr) {
      console.error("[Manual Image] Secondary generation failed:", imgErr);
    }

    // Replace image placeholder in the HTML content
    let finalContent = result.content || "";
    if (finalContent.includes("[SECONDARY_IMAGE_URL]")) {
      finalContent = finalContent.replace("[SECONDARY_IMAGE_URL]", secondaryImageUrl);
    } else {
      // Append secondary image to the end of the text if it's not present
      finalContent += `<div style="margin: 20px 0;"><img src="${secondaryImageUrl}" alt="Détails techniques" class="my-6 w-full rounded-xl border border-slate-200 shadow-sm max-h-[400px] object-cover" /></div>`;
    }

    // Generate a unique slug
    const titleSlugified = slugify(result.title, { lower: true, strict: true });
    const citySlugified = slugify(city, { lower: true, strict: true });
    const baseSlug = titleSlugified.includes(citySlugified)
      ? titleSlugified
      : `${titleSlugified}-${citySlugified}`;
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
        content: finalContent,
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
