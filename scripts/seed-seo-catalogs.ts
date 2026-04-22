import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'raw-products.json');

// Un spinner pour la beauté du log (optionnel, mais sympa)
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction utilitaire pour slugifier
function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Remplace les espaces par -
        .replace(/[^\w\-]+/g, '')       // Supprime tous les caractères non-mots
        .replace(/\-\-+/g, '-')         // Remplace les - multiples par un seul -
        .replace(/^-+/, '')             // Coupe les - au début
        .replace(/-+$/, '');            // Coupe les - à la fin
}

async function main() {
    console.log("Lecture du fichier raw-products.json...");
    let products = [];
    try {
        const rawData = fs.readFileSync(DATA_PATH, 'utf8');
        products = JSON.parse(rawData);
    } catch(e) {
        console.error("Impossible de lire raw-products.json. Avez-vous lancé parse-catalogs.ts ?");
        process.exit(1);
    }

    console.log(`✅ ${products.length} produits sourcés dans le fichier.`);

    console.log("\nRecherche de l'Expert technique...");
    // Trouver ou créer l'Expert Bureau d'Etude pour un ton plus neutre
    let expert = await prisma.expert.findFirst({
        where: { nom_entreprise: "Bureau d'Etude Gainable.fr" }
    });

    if (!expert) {
        console.log("Création de l'expert 'Bureau d'Etude Gainable.fr'...");
        expert = await prisma.expert.create({
            data: {
                expert_type: "bureau_detude",
                nom_entreprise: "Bureau d'Etude Gainable.fr",
                slug: "bureau-etude-gainable",
                representant_nom: "Technique",
                representant_prenom: "Expert",
                description: "Le bureau d'étude interne de Gainable.fr analyse et décortique les documentations techniques des grands fabricants de solutions CVC (Climatisation, Ventilation, Chauffage) pour vous livrer des avis objectifs et pointus sur les meilleurs modèles du marché.",
                pays: "FR",
                adresse: "Avenue des Champs-Élysées",
                ville: "Paris",
                code_postal: "75008",
                telephone: "0100000000",
                site_web: "https://www.gainable.fr",
                user: {
                    create: {
                        email: "bureau-etude@gainable.fr",
                        password_hash: "none",
                        role: "PRO"
                    }
                }
            }
        });
    }
    console.log(`✅ Expert prêt : ${expert.nom_entreprise}`);

    console.log("\nLancement de l'usine d'injection PostgreSQL...");

    let successCount = 0;
    
    // Pour ne pas exploser le pool, on insère un par un avec un petit délai
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        // On évite les modèles trop courts ou inintéressants
        if (!product.model || product.model.length < 4) continue;

        // On construit les éléments SEO
        const articleSlug = slugify(`avis-technique-${product.brand}-${product.model}`);
        const title = `Avis & Fiche Technique : ${product.type || "Climatisation"} ${product.brand} ${product.model}`;
        
        // Création de l'introduction
        const intro = `Le système **${product.model}** conçu par le fabricant de renommée mondiale **${product.brand}** fait partie des équipements très recherchés pour les projets d'optimisation thermique. Vous vous demandez si ce modèle de ${product.type?.toLowerCase()} correspond réellement à vos besoins en matière de confort, d'économies d'énergie et de design ? Notre bureau d'étude a décortiqué la documentation intégrale de ${product.brand} pour vous livrer un avis technique, neutre et précis sur le modèle ${product.model}.`;

        // Construction du contenu HTML avec la structure UX ultra-vendeuse
        let contenuHtml = `
            <h2>1. Explications & Caractéristiques du ${product.brand} ${product.model}</h2>
            <p>Lorsque l'on étudie la gamme ${product.brand}, le modèle ${product.model} se distingue rapidement par sa fiabilité et son positionnement technique. Conçu pour répondre aux nouvelles normes environnementales européennes, ce matériel de type ${product.type || "climatisation réversible"} concentre le savoir-faire technologique de la marque.</p>
            
            <div class="bg-blue-50/50 p-6 rounded-xl border border-blue-100 my-8">
                <h3 class="text-blue-900 mt-0">Fiche Technique Rapide</h3>
                <ul class="mb-0">
                    <li><strong>Marque :</strong> ${product.brand}</li>
                    <li><strong>Modèle :</strong> ${product.model}</li>
                    <li><strong>Typologie :</strong> ${product.type || "Climatisation"}</li>
                    ${product.features && product.features.length > 0 ? `<li><strong>Technologies détectées :</strong> ${product.features.join(', ')}</li>` : ''}
                </ul>
            </div>

            <h2>2. Quels sont les vrais avantages de ce système ?</h2>
            <p>Opter pour le ${product.model} n'est pas un choix anodin. Sa conception permet de résoudre plusieurs défis architecturaux ou énergétiques majeurs. Grâce à ses excellentes performances nominales, que ce soit en mode rafraîchissement ou chauffage, il assure un confort stable toute l'année. Les équipements ${product.brand} sont d'ailleurs reconnus par de nombreux installateurs RGE pour leur résilience face aux températures extrêmes.</p>
            
            ${product.features.includes("Ultra Silencieux") ? `<p><strong>Le gros point fort : l'acoustique.</strong> Ce modèle a été pensé pour réduire drastiquement la pression sonore, un critère fondamental si vous prévoyez une installation près d'une chambre à coucher ou dans un salon ouvert.</p>` : ''}
            
            <h2>3. À qui s'adresse ce modèle ? (Cas d'usage)</h2>
            <p>Le système ${product.model} est particulièrement recommandé si vous vous trouvez dans l'une de ces situations :</p>
            <ul>
                <li>Vous rénovez une maison de plein pied et cherchez à masquer l'équipement pour protéger votre décoration intérieure.</li>
                <li>Vos factures de chauffage actuelles s'envolent et vous cherchez une pompe à chaleur air-air au rendement énergétique optimisé.</li>
                <li>Vous faites construire et avez besoin d'une intégration parfaite (RT2012 / RE2020).</li>
            </ul>

            <hr class="my-10" />

            <h2>Combien coûte l'installation d'un ${product.brand} ${product.model} ?</h2>
            <p>Le prix du matériel brut ne reflète jamais le coût total d'une installation dans les règles de l'art. Il faut prendre en compte la complexité du réseau aéraulique, le dimensionnement thermique exact de votre logement, et la main d'œuvre de mise en service (obligatoire pour manipuler les fluides frigorigènes).</p>
            
            <p class="font-bold text-lg mb-8">Vous souhaitez obtenir un chiffrage précis et transparent pour l'installation d'un système ${product.brand} ${product.model} ?</p>
            
            <!-- Le bloc d'acquisition B2C Dynamique se chargera ici via React -->
        `;

        // Détermination d'une d'image générique selon la marque
        let mainImage = "https://images.unsplash.com/photo-1621259587440-27a1f59ad025?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"; // Default
        const brandL = product.brand.toLowerCase();
        if (brandL.includes('daikin')) mainImage = "https://images.unsplash.com/photo-1618218168350-6e7c81151b64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";
        else if (brandL.includes('mitsubishi')) mainImage = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";
        else if (brandL.includes('hitachi')) mainImage = "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80";

        // Upsert dans la base de données
        try {
            await prisma.article.upsert({
                where: {
                    expertId_slug: {
                        expertId: expert.id,
                        slug: articleSlug
                    }
                },
                update: {
                    title: title,
                    introduction: intro,
                    content: contenuHtml,
                    mainImage: mainImage,
                    altText: `Fiche technique ${product.brand} ${product.model}`
                },
                create: {
                    expertId: expert.id,
                    title: title,
                    slug: articleSlug,
                    introduction: intro,
                    content: contenuHtml,
                    mainImage: mainImage,
                    altText: `Fiche technique ${product.brand} ${product.model}`,
                    status: "PUBLISHED",
                    publishedAt: new Date(), 
                }
            });
            successCount++;
            if (i % 20 === 0) {
                console.log(`[${i}/${products.length}] Injection en cours...`);
            }
        } catch(e) {
            console.error(`❌ Erreur sur l'article ${articleSlug}:`, e.message);
        }

        await sleep(20); // Petite pause pour la BDD
    }

    console.log(`\n🎉 TERMINÉ ! ${successCount} articles techniques "Catalogues" ont été injectés dans la base de données avec succès.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
