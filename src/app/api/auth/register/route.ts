import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

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

        // 5. Send Welcome Email (Async - don't block response too long, or await if critical)
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const showLabelSection = expertType === 'societe'; // Only for Installer companies

            const subject = showLabelSection
                ? "Bienvenue sur Gainable.fr – démarche de labellisation"
                : "Bienvenue sur Gainable.fr – Confirmation d'inscription";

            // Conditional Label HTML
            const labelSectionHtml = showLabelSection ? `
            <div style="background-color: #fff8ed; border-left: 4px solid #D59B2B; padding: 20px; margin: 30px 0;">
                <h3 style="color: #D59B2B; margin-top: 0;">Le Label Gainable.fr</h3>
                <p style="color: #1F2D3D;">Le Label Gainable.fr s’inscrit dans une démarche volontaire de qualité et d’alignement professionnel.</p>
                <p style="color: #1F2D3D;">Un membre de notre équipe prendra contact avec vous afin d’échanger et de valider que nous partageons la même vision du métier, les mêmes standards d’installation et la même exigence de satisfaction client.</p>
                <p style="font-weight: bold; color: #1F2D3D;">Ce label est attribué aux professionnels qui incarnent pleinement les valeurs du réseau.</p>
            </div>
            ` : "";

            await resend.emails.send({
                from: "Gainable.fr <conseil@gainable.ch>",
                to: email,
                subject: subject,
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${subject}</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #D59B2B;">
            <img src="https://www.gainable.fr/logo.png" alt="Gainable.fr" style="height: 40px;">
        </div>

        <!-- Body -->
        <div style="padding: 40px 30px; color: #1F2D3D; line-height: 1.6;">
            <h1 style="font-size: 22px; font-weight: bold; margin-bottom: 24px; color: #1F2D3D;">Bonjour,</h1>

            <p>Nous vous souhaitons la bienvenue au sein du réseau <strong>Gainable.fr</strong>.<br>
            Votre inscription a bien été enregistrée.</p>

            <h2 style="color: #D59B2B; font-size: 18px; margin-top: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Votre espace professionnel</h2>
            
            <p>Vous bénéficiez désormais d’un accès dédié vous permettant de construire une présence qualitative et cohérente sur la plateforme.</p>
            <p>À ce titre, vous pouvez :</p>
            
            <ul style="padding-left: 20px; color: #444;">
                <li style="margin-bottom: 8px;">Intégrer des <strong>photos et vidéos</strong> de chantiers et de réalisations,</li>
                <li style="margin-bottom: 8px;">Configurer votre profil en sélectionnant les <strong>technologies réellement installées</strong>,</li>
                <li style="margin-bottom: 8px;">Publier des <strong>articles SEO pré-optimisés</strong>, conçus pour renforcer durablement votre visibilité locale,</li>
                <li style="margin-bottom: 8px;">Mettre en avant votre savoir-faire, votre expérience et votre exigence métier auprès des particuliers.</li>
            </ul>

            <p>Chaque élément contribue à valoriser votre expertise et à renforcer la crédibilité du réseau.</p>

            ${labelSectionHtml}

            <p style="margin-top: 40px;">Nous sommes ravis de vous compter parmi les entreprises référencées sur Gainable.fr et nous réjouissons de cette future collaboration.</p>
            
            <div style="margin-top: 40px; text-align: center;">
                <a href="https://www.gainable.fr" style="background-color: #1F2D3D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Accéder à mon espace pro</a>
            </div>

            <p style="margin-top: 40px; font-size: 14px; color: #666;">
                Cordialement,<br>
                <strong>L’équipe Gainable.fr</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; margin-bottom: 10px;">Ceci est un email automatique, merci de ne pas y répondre directement.<br>
            Pour toute demande, veuillez utiliser le formulaire de contact ou nous écrire à <a href="mailto:contact@gainable.fr" style="color: #94a3b8; text-decoration: underline;">contact@gainable.fr</a></p>
            <p style="margin: 0;">Gainable.fr - La plateforme des experts</p>
        </div>
    </div>
</body>
</html>
                `
            });
            console.log(`[Register] Welcome email sent to ${email}`);
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
        }

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
