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

const DPE_B2C_TOPICS = [
  "diagnostic DPE",
  "diagnostic de performance énergétique",
  "diagnostiqueur immobilier certifié",
  "audit énergétique obligatoire",
  "diagnostics immobiliers obligatoires",
  "tarif diagnostic DPE",
  "diagnostiqueur immobilier"
];

const BE_B2C_TOPICS = [
  "bureau d'étude thermique",
  "étude thermique RE2020",
  "dimensionnement climatisation gainable",
  "calcul de déperdition thermique",
  "audit thermique pour commerce",
  "étude thermique réglementaire",
  "bureau d'études thermiques"
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

    const typeParam = searchParams.get("type"); // null, "b2c", or "b2b"
    const shouldRunB2C = !typeParam || typeParam === "b2c";
    const shouldRunB2B = !typeParam || typeParam === "b2b";

    console.log("[Cron Generate Articles] Starting daily B2C & B2B automated article pipeline...");

    const generatedArticles = [];
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (shouldRunB2C) {
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
      const themeIndex = citySeed % 3; // 0 = CVC, 1 = DPE, 2 = Bureau d'étude
      const theme = themeIndex === 1 ? "dpe" : themeIndex === 2 ? "bureau_etude" : "cvc";

      let b2cTopic = "";
      if (theme === "dpe") {
        b2cTopic = DPE_B2C_TOPICS[citySeed % DPE_B2C_TOPICS.length];
      } else if (theme === "bureau_etude") {
        b2cTopic = BE_B2C_TOPICS[citySeed % BE_B2C_TOPICS.length];
      } else {
        b2cTopic = B2C_TOPICS[citySeed % B2C_TOPICS.length];
      }
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
        Tu es un rédacteur et ingénieur thermicien senior rédigeant pour le portail Gainable.fr.
        Rédige un article de blog SEO B2C de qualité éditoriale exceptionnelle, complet et haut de gamme, ciblant les propriétaires de maisons.
        Mot-clé principal : "${b2cKeyword}".
        
        L'expert associé à cet article est : "${b2cExpert.nom_entreprise}" situé à "${b2cExpert.ville}".
        Ville cible : "${b2cCity.name}" (Code postal: "${b2cCity.zip}", Département: "${b2cCity.department}", Région: "${b2cCity.region}").
        
        CONSIGNES ÉDITORIALES DE HAUTE QUALITÉ :
        - Ton : Professionnel, rassurant, hautement technique mais accessible, pédagogue et digne d'un expert du domaine.
        - Cible : Propriétaires immobiliers cherchant à optimiser le confort et la performance de leur logement.
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
        
        - ORIENTATION ACQUISITION & CONVERSION (CRITIQUE) : Cet article doit être fortement orienté vers la conversion et l'acquisition de prospects qualifiés. Intègre de manière naturelle et convaincante dans le texte des appels à l'action (CTA) clairs (par exemple : demander une étude thermique gratuite, faire une simulation d'aides CEE/MaPrimeRénov', faire estimer son DPE ou solliciter un diagnostic immobilier complet auprès des partenaires agréés de la plateforme). Insiste sur les bénéfices financiers et de confort pour inciter le lecteur à utiliser le service de mise en relation de Gainable.fr.
        - Contexte local : Adapte les arguments aux particularités climatiques de la région de "${b2cCity.name}" (ex: canicules estivales, hivers rigoureux, spécificités du bâti local). Présente "${b2cExpert.nom_entreprise}" comme le professionnel local de référence, sans paraître agressif sur le plan commercial.
        - Formatage :        Format de retour obligatoire (JSON pur) :
        {
          "title": "Titre optimisé et accrocheur de l'article B2C",
          "introduction": "Introduction engageante de 3-4 phrases avec le mot-clé principal.",
          "content": "Le corps de l'article au format HTML sans <h1> (minimum 850 mots, structuré en sections <h2> et <h3>. Chaque paragraphe doit faire au moins 4-5 lignes d'analyse réelle. Insère obligatoirement au milieu de l'article la balise d'image secondaire sous cette forme exacte : <img src=\"[SECONDARY_IMAGE_URL]\" alt=\"Description optimisée SEO\" class=\"my-6 w-full rounded-xl border border-slate-200 shadow-sm max-h-[400px] object-cover\" />)",
          "metaDesc": "Meta description optimisée SEO (< 155 caractères)",
          "imagePrompt": "A highly detailed, professional photorealistic prompt showing the corresponding thematic scene (ex: for DPE: a modern home blueprint or certified inspector, for bureau d'etude: thermal study office workspace with blueprints, for CVC: premium ceiling grills in a luxury home), commercial photography style, 1024x1024.",
          "secondaryImagePrompt": "A highly detailed, professional photorealistic prompt for another different scene matching the article topic (ex: close-up of a thermostat, heat pump components, thermal calculation graphs, or technician using a digital level/tool) to be used as inline content image, commercial photography style, 1024x1024.",
          "faq": [
            {
              "question": "Question technique ou pratique pertinent liée au sujet ou à la région de ${b2cCity.name}",
              "response": "Réponse d'expert détaillée, chiffrée et précise (3-4 phrases)."
            },
            {
              "question": "Question sur le coût, les aides de l'État ou le choix du prestataire certifié à ${b2cCity.name}",
              "response": "Réponse claire et rassurante, respectant strictement les tarifs de marché (si gainable complet: 10 000 € à 20 000 €, si diagnostic/étude thermique: tarifs réglementés ou habituels)."
            },
            {
              "question": "Question sur l'entretien, l'accompagnement ou la durée de validité",
              "response": "Explications claires."
            }
          ]
        }`;

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
            // Generate B2C Image 1 (Cover) via GPT-Image-2
            let b2cImageUrl = "/blog/gainable-salon.jpg"; // Default fallback
            try {
              const b2cImageResponse = await openai.images.generate({
                model: "gpt-image-2",
                prompt: b2cResult.imagePrompt || `A premium photograph of a modern, luxury home interior in ${b2cCity.name}, showing a ducted air conditioning (climatisation gainable) ceiling vent, 1024x1024.`,
                size: "1024x1024"
              });
              const b64Data = b2cImageResponse.data?.[0]?.b64_json;
              if (b64Data) {
                const imageBuffer = Buffer.from(b64Data, 'base64');
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
            } catch (imgErr) {
              console.error("[Cron B2C Image] Cover generation failed:", imgErr);
            }

            // Generate B2C Image 2 (Secondary inline) via GPT-Image-2
            let b2cSecondaryImageUrl = "/blog/gainable-installation-vent.jpg"; // Default fallback secondary
            try {
              const b2cSecondaryResponse = await openai.images.generate({
                model: "gpt-image-2",
                prompt: b2cResult.secondaryImagePrompt || `A highly detailed, professional photorealistic photograph of local architecture or technical renovation tools, 1024x1024.`,
                size: "1024x1024"
              });
              const b64DataSec = b2cSecondaryResponse.data?.[0]?.b64_json;
              if (b64DataSec) {
                const imageBuffer = Buffer.from(b64DataSec, 'base64');
                const cleanCityName = slugify(b2cCity.name, { lower: true, strict: true });
                const filePath = `articles/b2c_sec_${cleanCityName}_${Date.now()}.png`;

                const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(filePath, imageBuffer, {
                  contentType: 'image/png',
                  upsert: false
                });

                if (!uploadError) {
                  const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(filePath);
                  b2cSecondaryImageUrl = publicUrlData.publicUrl;
                }
              }
            } catch (imgErr) {
              console.error("[Cron B2C Image] Secondary generation failed:", imgErr);
            }

            // Replace image placeholder in the HTML content
            let finalB2CContent = b2cResult.content || "";
            if (finalB2CContent.includes("[SECONDARY_IMAGE_URL]")) {
              finalB2CContent = finalB2CContent.replace("[SECONDARY_IMAGE_URL]", b2cSecondaryImageUrl);
            } else {
              finalB2CContent += `<div style="margin: 20px 0;"><img src="${b2cSecondaryImageUrl}" alt="Détails techniques" class="my-6 w-full rounded-xl border border-slate-200 shadow-sm max-h-[400px] object-cover" /></div>`;
            }

            // Slugify & Unique verify
            const titleSlugified = slugify(b2cResult.title, { lower: true, strict: true });
            const citySlugified = slugify(b2cCity.name, { lower: true, strict: true });
            const baseB2CSlug = titleSlugified.includes(citySlugified)
              ? titleSlugified
              : `${titleSlugified}-${citySlugified}`;
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
                content: finalB2CContent,
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
                from: process.env.RESEND_FROM_EMAIL || "Gainable IA <noreply@gainable.ch>",
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
    }

    if (shouldRunB2B) {
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
      Tu es un conseiller senior en développement commercial et expert de la transition énergétique pour Gainable.fr.
      Rédige un article de blog SEO B2B haut de gamme, pragmatique, technique et ultra convaincant destiné aux artisans, chauffagistes, plombiers et installateurs de climatisation.
      Mot-clé principal : "${b2bKeyword}".
      
      CONSIGNES ÉDITORIALES DE HAUTE QUALITÉ :
      - Ton : Professionnel, dynamique, motivant, axé sur les résultats (business, rentabilité, conversion, croissance du chiffre d'affaires).
      - Cible : Entreprises de génie climatique (CVC), installateurs de pompes à chaleur RGE et frigoristes indépendants.
      - Évite les clichés IA et tics de langage : Interdiction stricte d'utiliser des expressions de transition banales comme "En conclusion", "Tout d'abord", "De plus", "En somme", "Il est important de noter", "Dans cet article, nous allons voir", etc.
      - Style d'écriture : Direct, axé sur le quotidien des chantiers et la réalité des artisans, vocabulaire métier précis (devis, taux de conversion, coût d'acquisition de leads, marge brute, etc.).
      - Valeur ajoutée de Gainable.fr : Explique comment le modèle d'abonnement fixe sans commission de Gainable.fr s'oppose aux plateformes d'achat de leads traditionnelles et abusives. Souligne la qualité des contacts pré-qualifiés et la liberté tarifaire préservée pour l'artisan.
      - Formatage : Structure riche en paragraphes clairs, listes à puces (<ul>, <li>) pour aérer la lecture, et mise en gras des termes importants (<strong>). Pas de titre H1 dans le corps.
      
      Squelette de l'article :
      - Une section H2 analysant les défis du marché CVC actuel (concurrence féroce, coût d'acquisition en hausse, marges sous pression).
      - Une section H3 de conseils opérationnels (structuration des offres commerciales, réactivité dans la prise de contact, relance méthodique des devis).
      - Une section H2 présentant la solution Gainable.fr (abonnements fixes, fiches profils locales avec forte autorité SEO, mise en relation directe).
      - Une section H3 expliquant comment rejoindre le réseau de manière fluide et activer son quota mensuel de leads.
      
      Format de retour obligatoire (JSON pur) :
      {
        "title": "Titre optimisé, percutant et engageant pour les professionnels CVC",
        "introduction": "Introduction de 3-4 phrases captant l'intérêt commercial et introduisant le mot-clé.",
        "content": "Le corps de l'article complet au format HTML sans <h1> (minimum 850 mots, structuré en sections <h2> et <h3>. Chaque paragraphe doit faire au moins 4-5 lignes d'analyse réelle. Insère obligatoirement au milieu de l'article la balise d'image secondaire sous cette forme exacte : <img src=\"[SECONDARY_IMAGE_URL]\" alt=\"Description optimisée SEO\" class=\"my-6 w-full rounded-xl border border-slate-200 shadow-sm max-h-[400px] object-cover\" />)",
        "metaDesc": "Meta description optimisée pour cibler les professionnels CVC (< 155 caractères)",
        "imagePrompt": "A highly detailed, professional photorealistic prompt showing a professional CVC expert on site or inside a commercial office building, business growth concept, 1024x1024.",
        "secondaryImagePrompt": "A highly detailed, professional photorealistic prompt for a different professional scene matching the B2B HVAC or business topic (ex: digital dashboard showing sales graphs, close-up of CVC blueprints on a desk, or technicians planning a project) to be used as inline content image, commercial photography style, 1024x1024.",
        "faq": [
          {
            "question": "Comment Gainable.fr pré-qualifie les demandes de chantiers ?",
            "response": "Explication sur la vérification des besoins réels (maison individuelle, budget, type de projet gainable) avant mise en relation."
          },
          {
            "question": "Quel est l'avantage du modèle d'abonnement fixe sans commission ?",
            "response": "Explication sur la rentabilité accrue pour l'artisan, qui conserve 100% de sa marge commerciale sur les travaux."
          },
          {
            "question": "Comment optimiser son profil expert sur Gainable.fr pour capter plus de leads ?",
            "response": "Conseils pratiques sur la rédaction de la description, l'ajout de photos de chantiers et la mise en avant des qualifications RGE."
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
          // Generate B2B Image 1 (Cover) via GPT-Image-2
          let b2bImageUrl = "/blog/b2b-planning.png"; // Default fallback
          try {
            const b2bImageResponse = await openai.images.generate({
              model: "gpt-image-2",
              prompt: b2bResult.imagePrompt || `A professional heating engineer working inside a modern commercial office building, tech HVAC style, 1024x1024.`,
              size: "1024x1024"
            });
            const b64Data = b2bImageResponse.data?.[0]?.b64_json;
            if (b64Data) {
              const imageBuffer = Buffer.from(b64Data, 'base64');
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
          } catch (imgErr) {
            console.error("[Cron B2B Image] Cover generation failed:", imgErr);
          }

          // Generate B2B Image 2 (Secondary inline) via GPT-Image-2
          let b2bSecondaryImageUrl = "/blog/b2b-planning.png"; // Default fallback secondary
          try {
            const b2bSecondaryResponse = await openai.images.generate({
              model: "gpt-image-2",
              prompt: b2bResult.secondaryImagePrompt || `A professional heating engineer working with blueprints, business HVAC style, 1024x1024.`,
              size: "1024x1024"
            });
            const b64DataSec = b2bSecondaryResponse.data?.[0]?.b64_json;
            if (b64DataSec) {
              const imageBuffer = Buffer.from(b64DataSec, 'base64');
              const cleanKeyword = slugify(b2bKeyword, { lower: true, strict: true }).slice(0, 30);
              const filePath = `articles/b2b_sec_${cleanKeyword}_${Date.now()}.png`;

              const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(filePath, imageBuffer, {
                contentType: 'image/png',
                upsert: false
              });

              if (!uploadError) {
                const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(filePath);
                b2bSecondaryImageUrl = publicUrlData.publicUrl;
              }
            }
          } catch (imgErr) {
            console.error("[Cron B2B Image] Secondary generation failed:", imgErr);
          }

          // Replace image placeholder in the HTML content
          let finalB2BContent = b2bResult.content || "";
          if (finalB2BContent.includes("[SECONDARY_IMAGE_URL]")) {
            finalB2BContent = finalB2BContent.replace("[SECONDARY_IMAGE_URL]", b2bSecondaryImageUrl);
          } else {
            finalB2BContent += `<div style="margin: 20px 0;"><img src="${b2bSecondaryImageUrl}" alt="Détails professionnels" class="my-6 w-full rounded-xl border border-slate-200 shadow-sm max-h-[400px] object-cover" /></div>`;
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
              content: finalB2BContent,
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
              from: process.env.RESEND_FROM_EMAIL || "Gainable IA <noreply@gainable.ch>",
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
