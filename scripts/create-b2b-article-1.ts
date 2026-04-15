import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting B2B Article 1 Creation...');

    // Get Admin Expert ID for the blog post
    const expert = await prisma.expert.findUnique({
        where: { slug: 'gainable-fr' },
    });

    if (!expert) {
        console.error('Expert "gainable-fr" not found. Please ensure it exists.');
        return;
    }

    const title = "La Fin de l'Âge d'Or de l'Achat de Leads : Pourquoi vous êtes esclave du système.";
    const slug = "fin-age-or-achat-leads-esclavage-systeme";
    const intro = "Acheter un contact à 40€ pour s'apercevoir qu'il a été revendu à 5 autres entreprises... Vous connaissez cette sensation ? C'est le quotidien de milliers d'artisans. Il est temps de briser les chaînes et de reprendre le contrôle de vos marges.";
    
    const contentHtml = `
        <h2>Le Piège de la Non-Exclusivité</h2>
        <p>Aujourd'hui, quand un particulier cherche un artisan pour installer une climatisation réversible ou une pompe à chaleur, il atterrit souvent sur de grandes plateformes de devis. Il remplit un formulaire, et ses coordonnées sont vendues à prix d'or à plusieurs entreprises simultanément.</p>
        <p>Le résultat ? Vous payez entre 30€ et 60€ pour un "lead", mais vous devez ensuite engager une véritable <strong>bataille téléphonique et commerciale</strong> avec 5 de vos confrères locaux.</p>
        
        <h2>La Guerre des Prix : Une Course Vers le Bas</h2>
        <p>Quand 5 entreprises appellent le même client dans l'heure, le client se retrouve en position de force absolue. Son seul critère de choix devient bien souvent <strong>le prix le plus bas</strong>.</p>
        <p>Pour remporter le chantier, vous êtes contraint de rogner sur votre marge. Vous travaillez plus, vous vous battez plus, pour gagner moins. Finalement, qui s'enrichit vraiment dans cette histoire ? La plateforme qui vous a revendu le contact.</p>

        <h2>La Solution : Le "Marathon" du Maillage Local</h2>
        <p>La solution n'est plus d'acheter du poisson, mais d'<strong>apprendre à pêcher</strong>. En 2024, le particulier méfiant a besoin d'être rassuré par votre expertise, vos vidéos, et vos avis avant même de demander un devis. Il faut qu'il vous trouve directement sur Google, organiquement.</p>

        <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #D59B2B; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #D59B2B;">Rejoignez Gainable.fr : 0 Commission, 100% Exclusif</h3>
            <p>C'est exactement pour lutter contre ce système que <strong>Gainable.fr</strong> a été conçu. Contrairement aux vendeurs de leads :</p>
            <ul>
                <li><strong>Contacts 100% exclusifs :</strong> Le client parcours votre profil (vos vidéos, vos réalisations) et <em>décide</em> de vous contacter VOUS.</li>
                <li><strong>Zéro commission :</strong> Vous gardez l'intégralité de la marge de votre chantier.</li>
                <li><strong>Rédacteur IA intégré :</strong> L'excuse du "je n'ai pas le temps d'écrire pour le SEO" est finie. Notre IA génère vos articles de réalisation optimisés en 3 petits clics.</li>
            </ul>
        </div>
        
        <p>L'obligation de digitalisation est devenue vitale. Ne soyez plus l'esclave d'un système qui vous étouffe. Créez votre profil sur Gainable.fr dès aujourd'hui et commencez à construire un réseau de prospection qui n'appartient qu'à vous.</p>
    `;

    // Check if it already exists
    const existing = await prisma.article.findUnique({
        where: { expertId_slug: { expertId: expert.id, slug } }
    });

    if (existing) {
        console.log('Article already exists, updating...');
        await prisma.article.update({
            where: { id: existing.id },
            data: {
                title,
                introduction: intro,
                content: contentHtml,
                status: 'PUBLISHED',
                publishedAt: new Date(),
                mainImage: 'https://www.gainable.fr/logo.png', // Or a relevant cover image
                jsonContent: {
                    sections: [{ title, content: contentHtml }],
                    faq: []
                }
            }
        });
    } else {
        console.log('Creating new article...');
        await prisma.article.create({
            data: {
                title,
                slug,
                expertId: expert.id,
                introduction: intro,
                content: contentHtml,
                status: 'PUBLISHED',
                publishedAt: new Date(),
                mainImage: 'https://www.gainable.fr/logo.png',
                jsonContent: {
                    sections: [{ title, content: contentHtml }],
                    faq: []
                }
            }
        });
    }

    console.log('Done! Article is now imported/updated in the database.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
