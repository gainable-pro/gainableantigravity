import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const expertId = 'b6fce27f-cff9-4db6-8348-b7e1052b1291'; // Air G Energie

    // Delete existing demo leads assigned to this expert to avoid clutter
    const oldAssignments = await prisma.leadAssignment.findMany({
        where: { expertId },
        include: { lead: true }
    });
    
    // We only delete leads that match our demo names to be safe
    const demoNames = ['Sophie Durand', 'Thomas Lefebvre', 'Jean-Luc Moreau', 'Aurélie Petit', 'Antonio Garcia', 'Nicolas Dubois'];
    
    for (const assignment of oldAssignments) {
        if (demoNames.includes(assignment.lead.nom)) {
            await prisma.lead.delete({ where: { id: assignment.leadId } });
        }
    }

    console.log(`Cleaned up old demo leads for Air G Energie.`);

    const leadsData = [
        {
            date: new Date('2026-01-15T10:00:00Z'),
            nom: 'Sophie Durand',
            email: 'sophie.durand@example.com',
            telephone: '0612345678',
            code_postal: '75015',
            ville: 'Paris',
            adresse: '12 rue du Commerce',
            details: {
                surface: '110m²',
                type: 'Maison Individuelle',
                travaux: 'Installation Gainable Multi-zones',
                description: 'Bonjour, nous avons pour projet la rénovation complète de notre pavillon situé au 12 rue du Commerce, 75015 Paris. La maison fait 110m² avec un séjour de 45m² et 3 chambres à l'étage. Nous souhaitons une solution gainable invisible et silencieuse pour l\'ensemble des pièces. Merci de nous recontacter.',
                attachment: '/demo/plan1.png'
            }
        },
        {
            date: new Date('2026-01-28T14:30:00Z'),
            nom: 'Thomas Lefebvre',
            email: 't.lefebvre@example.com',
            telephone: '0687654321',
            code_postal: '92100',
            ville: 'Boulogne-Billancourt',
            adresse: '45 avenue Jean Jaurès',
            details: {
                surface: '145m²',
                type: 'Appartement Haussmannien',
                travaux: 'Remplacement système existant',
                description: 'Bonjour, nous souhaitons installer une climatisation gainable dans notre appartement haussmannien de 145m² au 45 avenue Jean Jaurès, 92100 Boulogne-Billancourt. Il y a un grand salon de 55m² et 4 chambres. Nous prévoyons de créer un faux plafond dans le couloir pour distribuer l\'air. Cordialement.',
                attachment: '/demo/plan2.png'
            }
        },
        {
            date: new Date('2026-02-05T09:15:00Z'),
            nom: 'Jean-Luc Moreau',
            email: 'jl.moreau@bureau-etude.fr',
            telephone: '0144556677',
            code_postal: '75008',
            ville: 'Paris',
            adresse: '8 rue de la Paix',
            details: {
                surface: '320m²',
                type: 'Bureaux',
                travaux: 'Étude & Installation PAC Air-Air',
                description: 'Bonjour, pour le compte d\'un client situé au 8 rue de la Paix, 75008 Paris, nous étudions l\'installation d\'un système PAC Air-Air gainable pour un plateau de bureaux de 320m². Espace ouvert de 200m² et 6 bureaux individuels. Nous recherchons une solution haute performance avec régulation centralisée.',
                attachment: '/demo/plan3.png'
            }
        },
        {
            date: new Date('2026-02-22T16:00:00Z'),
            nom: 'Aurélie Petit',
            email: 'aurelie.petit@gmail.com',
            telephone: '0700112233',
            code_postal: '13008',
            ville: 'Marseille',
            adresse: '130 Boulevard Michelet',
            details: {
                surface: '85m²',
                type: 'Maison de Ville',
                travaux: 'Climatisation Gainable Compacte',
                description: 'Bonjour, nous habitons au 130 Boulevard Michelet, 13008 Marseille. Nous souhaitons équiper l\'étage de notre maison (85m²) d\'une climatisation gainable. Il y a 3 chambres et un palier. L\'unité intérieure pourrait être placée dans les combles. Merci pour votre devis.',
                attachment: '/demo/plan1.png'
            }
        },
        {
            date: new Date('2026-03-12T11:45:00Z'),
            nom: 'Antonio Garcia',
            email: 'garcia.immo@example.com',
            telephone: '0655443322',
            code_postal: '69002',
            ville: 'Lyon',
            adresse: '22 Place Bellecour',
            details: {
                surface: '210m²',
                type: 'Villa Contemporaine',
                travaux: 'Gainable Airzone Intégré',
                description: 'Bonjour, nous faisons construire une villa contemporaine de 210m² au 22 Place Bellecour, 69002 Lyon (en cours de second œuvre). Séjour cathédrale de 70m² et 5 chambres. Nous voulons impérativement un système Airzone pour un contrôle pièce par pièce. Merci.',
                attachment: '/demo/plan2.png'
            }
        },
        {
            date: new Date('2026-04-05T10:20:00Z'),
            nom: 'Nicolas Dubois',
            email: 'n.dubois@archi-lille.fr',
            telephone: '0320112233',
            code_postal: '59000',
            ville: 'Lille',
            adresse: '15 rue Faidherbe',
            details: {
                surface: '180m²',
                type: 'Loft Industriel',
                travaux: 'Gainable apparent style industriel',
                description: 'Bonjour, nous transformons un ancien entrepôt en loft de 180m² au 15 rue Faidherbe, 59000 Lille. Très grand volume avec séjour de 90m² et 2 grandes suites. Nous souhaitons une installation gainable avec conduits apparents en acier pour garder le style industriel. Bien à vous.',
                attachment: '/demo/plan3.png'
            }
        }
    ];

    for (const data of leadsData) {
        const lead = await prisma.lead.create({
            data: {
                type: 'cvc',
                nom: data.nom,
                prenom: '',
                email: data.email,
                telephone: data.telephone,
                code_postal: data.code_postal,
                ville: data.ville,
                adresse: data.adresse,
                details: data.details,
                createdAt: data.date,
                status: 'new'
            }
        });

        await prisma.leadAssignment.create({
            data: {
                leadId: lead.id,
                expertId: expertId,
                status: 'sent',
                sentAt: data.date
            }
        });
        console.log(`Created refined lead for ${data.nom}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
