import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Initialize Prisma Client
// In a real app, use a singleton pattern for the client

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            email, password, expertType,
            representativeName, nomEntreprise, description,
            website, linkedin, telephone,
            adresse, ville, codePostal, pays, siret, tvaNumber, codeApe,
            technologies, interventionsClim, interventionsEtude,
            interventionsDiag, batiments, marques
        } = body;

        // --- SERVER-SIDE VALIDATION ---
        const VALID_APE_PREFIXES: Record<string, string[]> = {
            'bureau_etude': ['71.12', '74.90'],
            'diagnostiqueur': ['71.20', '68.31'],
            'societe': ['43.', '41.2', '33.2'],
        };

        // Only validate APE if strict France context or provided
        // We relax this for International as APE is French-specific
        const isFrance = !pays || pays === 'France';

        if (isFrance && expertType && VALID_APE_PREFIXES[expertType]) {
            const allowed = VALID_APE_PREFIXES[expertType];
            // Normalize APE: remove dots and spaces
            const cleanApe = codeApe ? codeApe.replace(/[\.\s]/g, '') : '';
            const isValid = allowed.some(prefix => cleanApe.startsWith(prefix.replace(/\./g, '')));

            console.log(`[DEBUG_APE] Type=${expertType} Raw=${codeApe} Clean=${cleanApe} Allowed=${allowed} IsValid=${isValid}`);

            if (!isValid) {
                return NextResponse.json(
                    { message: `CODE APE INVALIDE: Le code ${codeApe} ne commence pas par ${allowed.join(' ou ')} (requis pour ${expertType}).` },
                    { status: 400 }
                );
            }
        }
        // ------------------------------

        // Map frontend expert types to schema enum
        let mappedExpertType = expertType;
        if (expertType === 'societe') mappedExpertType = 'cvc_climatisation';
        else if (expertType === 'bureau_etude') mappedExpertType = 'bureau_detude';
        else if (expertType === 'diagnostiqueur') mappedExpertType = 'diagnostics_dpe';

        // 1. Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Cet email est déjà utilisé." },
                { status: 400 }
            );
        }

        // 2. Hash password
        const hashedPassword = await hash(password, 10);

        // 3. Create User and Expert in a transaction
        // We use a transaction to ensure both records are created or neither
        const result = await prisma.$transaction(async (tx) => {
            // Create User
            const user = await tx.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    role: "PRO", // Assuming PRO role for experts
                },
            });

            // Split representative name if needed or store as is. 
            // Schema has representant_nom and representant_prenom.
            // We'll naively split by first space, or put full name in 'nom' if no space.
            const nameParts = representativeName.trim().split(" ");
            const nomRep = nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0];
            const prenomRep = nameParts.length > 1 ? nameParts[0] : "";

            // Smart Slug Generation: [activite]-[ville]-[nom]
            // 1. Determine Activity Keyword
            let activityKey = 'expert';
            if (expertType === 'societe') activityKey = 'climatisation-pompe-a-chaleur';
            else if (expertType === 'bureau_etude') activityKey = 'bureau-etude-thermique';
            else if (expertType === 'diagnostiqueur') activityKey = 'diagnostic-immobilier-dpe';

            // 2. Normalize Helper
            const sluggify = (s: string) => s.toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9]+/g, '-') // non-alphanum to dash
                .replace(/^-|-$/g, ''); // trim dashes

            // 3. Construct Slug
            const baseSlug = `${activityKey}-${sluggify(ville || 'france')}${pays !== 'France' && pays ? '-' + sluggify(pays === 'Suisse' ? 'ch' : pays === 'Belgique' ? 'be' : pays === 'Maroc' ? 'ma' : pays) : ''}-${sluggify(nomEntreprise)}`;
            const randomSuffix = Math.floor(Math.random() * 10000); // collision avoidance
            const finalSlug = `${baseSlug}-${randomSuffix}`;

            // Create Expert
            const expert = await tx.expert.create({
                data: {
                    user_id: user.id,
                    expert_type: mappedExpertType, // Mapped to schema enum
                    nom_entreprise: nomEntreprise,
                    representant_nom: nomRep,
                    representant_prenom: prenomRep,
                    description: description,
                    site_web: website,
                    linkedin: linkedin,
                    telephone: telephone,
                    adresse: adresse,
                    ville: ville,
                    code_postal: codePostal,
                    pays: pays,
                    siret: siret, // Used for generic ID storage (SIRET/IDE/ICE)
                    tva_number: tvaNumber, // New Field
                    ape_code: codeApe,
                    // Default values
                    slug: finalSlug,
                    status: 'pending_validation', // Forced for manual validation (Stripe Bypass)
                },
            });

            // 4. Create Related Records based on Type

            // Common: Batiments
            if (batiments && batiments.length > 0) {
                await tx.expertBatiment.createMany({
                    data: batiments.map((b: string) => ({
                        expert_id: expert.id,
                        value: b
                    }))
                });
            }

            if (expertType === 'societe') {
                if (technologies?.length) {
                    await tx.expertTechnology.createMany({
                        data: technologies.map((t: string) => ({ expert_id: expert.id, value: t }))
                    });
                }
                if (interventionsClim?.length) {
                    await tx.expertInterventionClim.createMany({
                        data: interventionsClim.map((i: string) => ({ expert_id: expert.id, value: i }))
                    });
                }
                if (marques?.length) {
                    await tx.expertMarque.createMany({
                        data: marques.map((m: string) => ({ expert_id: expert.id, value: m }))
                    });
                }
            }

            if (expertType === 'bureau_etude') {
                if (interventionsEtude?.length) {
                    await tx.expertInterventionEtude.createMany({
                        data: interventionsEtude.map((i: string) => ({ expert_id: expert.id, value: i }))
                    });
                }
            }

            if (interventionsDiag?.length) {
                await tx.expertInterventionDiag.createMany({
                    data: interventionsDiag.map((i: string) => ({ expert_id: expert.id, value: i }))
                });
            }

            // Certifications (Societe only typically)
            if (expertType === 'societe' && body.certifications?.length > 0) {
                await tx.expertCertification.createMany({
                    data: body.certifications.map((c: string) => ({ expert_id: expert.id, value: c }))
                });
            }

            return { user, expert };
        });

        return NextResponse.json(
            { message: "Compte créé avec succès", userId: result.user.id, expertId: result.expert.id },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { message: "Erreur technique: " + (error.message || error) },
            { status: 500 }
        );
    }
}
