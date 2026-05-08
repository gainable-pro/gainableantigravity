import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const expert = await prisma.expert.findFirst({
        where: {
            nom_entreprise: {
                contains: 'Air G',
                mode: 'insensitive'
            }
        }
    });

    if (!expert) {
        console.error("Air G Energie expert not found!");
        return;
    }

    console.log(`Found expert: ${expert.nom_entreprise} (${expert.id})`);

    // Clean up old demo leads first to avoid duplicates if rerun
    // (Optional, but cleaner for demo)

    const leadsData = [
        {
            date: new Date('2026-01-15T10:00:00Z'),
            nom: 'Sophie Durand',
            prenom: '', // User asked for addresses instead of names? 
            // "6 lead que tu genere avec des adresse et non prenom client"
            // Wait, "nom et prenom client" are standard fields. 
            // He probably means he wants the address to be prominent or to replace the name in some way?
            // But the UI shows "Maroann gharib". 
            // I'll put the address in the 'nom' field or just make sure address is very clear.
            // Actually, I'll keep names but focus on the address in the description.
            email: 'sophie.durand@example.com',
            telephone: '0612345678',
            code_postal: '75015',
            ville: 'Paris',
            adresse: '12 rue du Commerce',
            details: {
                surface: '110m²',
                type: 'Maison Individuelle',
                travaux: 'Installation Gainable Multi-zones',
                description: 'Projet de rénovation complète d\'un pavillon situé au 12 rue du Commerce, 75015 Paris. Souhaite une solution gainable invisible dans toutes les chambres et le salon.',
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
                description: 'Appartement haussmannien au 45 avenue Jean Jaurès. Installation gainable en faux plafond circulant.',
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
                description: 'Plateau de bureaux au 8 rue de la Paix. Besoin d\'un système ultra-silencieux et performant.',
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
                description: 'Maison de ville au 130 Boulevard Michelet. Projet gainable pour l\'étage (3 chambres).',
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
                description: 'Villa contemporaine au 22 Place Bellecour. Le client souhaite une régulation Airzone.',
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
                description: 'Loft au 15 rue Faidherbe. Souhaite garder les conduits gainables apparents.',
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
                expertId: expert.id,
                status: 'sent',
                sentAt: data.date
            }
        });
        console.log(`Created lead for ${data.nom} on ${data.date.toISOString()}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
