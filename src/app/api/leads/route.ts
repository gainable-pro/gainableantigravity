// Force rebuild: Fix syntax error check
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { prisma } from "@/lib/prisma";

// Initialize Resend (Use fallback to prevent build crash if env is missing)
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// Validation Schema
const leadSchema = z.object({
    type: z.enum(['PARTICULIER', 'PRO', 'cvc', 'simple', 'diag']).or(z.string()), // Flexible type
    nom: z.string().min(2, "Le nom est requis"),
    prenom: z.string().optional(),
    email: z.string().email("L'email est invalide"),
    telephone: z.string().min(10, "Le téléphone est invalide"),
    code_postal: z.string().regex(/^[0-9]{5}$/, "Le code postal est invalide"),
    ville: z.string().min(2, "La ville est requise"),
    adresse: z.string().optional(),
    projet: z.string().optional(),
    surface: z.string().optional(),
    message: z.string().optional(),
    logement: z.string().optional(),
    details: z.any().optional(), // For extra fields
    expertIds: z.array(z.string()).optional(), // Not used for email logic but might be passed
    expert_id: z.string().optional(),
    honeypot: z.string().optional(), // Anti-spam
});

export async function POST(request: Request) {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error("CRITICAL: RESEND_API_KEY is missing in environment variables.");
        }

        const body = await request.json();

        // 1. Anti-spam Honeypot Check
        if (body.honeypot || body._robot) {
            console.warn("Spam attempt blocked (honeypot):", body.email);
            return NextResponse.json({ success: true }); // Fake success for bots
        }

        // 2. Validate Data
        // Allow flexible validation for existing frontend calls
        const result = leadSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: result.error.issues },
                { status: 400 }
            );
        }

        const data = result.data;
        const messageContent = data.message || data.details?.message || "Aucun message";
        const attachedFiles = data.details?.files || [];

        // 3. Save to Database (Reliability)
        let savedLead;
        try {
            savedLead = await prisma.lead.create({
                data: {
                    type: data.type,
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.email,
                    telephone: data.telephone,
                    code_postal: data.code_postal,
                    ville: data.ville,
                    adresse: data.adresse,
                    details: {
                        message: messageContent,
                        surface: data.surface,
                        projet: data.projet,
                        logement: data.logement,
                        files: attachedFiles,
                        ...data.details
                    },
                    status: 'new',
                    assignments: {
                        create: data.expert_id ? [{ expertId: data.expert_id }] :
                            (data.expertIds && data.expertIds.length > 0) ? data.expertIds.map((id: string) => ({ expertId: id })) : []
                    }
                }
            });
            console.log("Lead saved to DB:", savedLead.id);
        } catch (dbError) {
            console.error("Database Error (Lead Save):", dbError);
            // Continue to try sending email even if DB fails? Or fail?
            // Better to fail if DB is critical, but email is 'notification'.
        }

        // 4. Send Email via Resend
        const adminEmail = process.env.LEADS_TO_EMAIL || 'contact@airgenergie.fr';
        // Changed to production domain
        const fromEmail = process.env.LEADS_FROM_EMAIL || 'Gainable <leads@gainable.ch>';

        let recipientEmail = adminEmail;
        let bccEmail = undefined;

        // Dynamic Routing: If expert_id provided, fetch expert email
        if (data.expert_id) {
            try {
                const expert = await prisma.expert.findUnique({
                    where: { id: data.expert_id },
                    include: { user: true }
                });

                if (expert && expert.user && expert.user.email) {
                    recipientEmail = expert.user.email;
                    bccEmail = adminEmail; // Admin always gets a copy for control
                    console.log(`Routing Lead to Expert: ${recipientEmail} (expert_id: ${expert.id})`);
                }
            } catch (err) {
                console.error("Error fetching expert for lead routing:", err);
                // Fallback to admin only
            }
        }

        const sourceUrl = request.headers.get("referer") || "Non spécifié";
        const date = new Date().toLocaleString("fr-FR");
        const projetType = data.type;

        try {
            const { error } = await resend.emails.send({
                from: fromEmail,
                to: recipientEmail,
                bcc: bccEmail,
                subject: `Nouveau lead Gainable – ${data.prenom || ''} ${data.nom} – ${data.ville}`,
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouveau Lead Gainable</title>
</head>
<body style="margin:0; padding:0; background-color:#F4F4F4; font-family:sans-serif;">
    <div style="max-width:600px; margin:0 auto; background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #E5E5E5; margin-top: 20px;">
        
        <!-- HEADER -->
        <div style="background-color:#ffffff; padding:20px; text-align:center; border-bottom:1px solid #E5E5E5;">
            <img src="https://www.gainable.fr/logo.png" alt="Gainable" style="height:40px; border:0;">
        </div>

        <!-- BANNER -->
        <div style="background-color:#D59B2B; color:white; padding:15px 24px; font-weight:bold; font-size:18px;">
            📢 Nouvelle demande de projet
        </div>

        <!-- CONTENT -->
        <div style="padding:24px;">
            <p style="color:#666; margin-top:0;">Bonjour,</p>
            <p style="color:#333; font-size:16px;">Vous avez reçu une nouvelle demande de devis via <strong>Gainable.fr</strong>.</p>
            
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">

            <h3 style="color:#D59B2B; margin-bottom:12px;">👤 Coordonnées</h3>
            <p><strong>Nom :</strong> ${data.prenom || ''} ${data.nom}</p>
            <p><strong>Email :</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Téléphone :</strong> <a href="tel:${data.telephone}">${data.telephone}</a></p>
            <p><strong>Ville :</strong> ${data.ville} (${data.code_postal})</p>
            <p><strong>Adresse :</strong> ${data.adresse || 'Non renseignée'}</p>

            <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">

            <h3 style="color:#D59B2B; margin-bottom:12px;">🏠 Projet</h3>
            <p><strong>Type :</strong> ${projetType}</p>
            <p><strong>Bien :</strong> ${data.logement || data.projet || 'Non renseigné'}</p>
            <p><strong>Surface :</strong> ${data.surface || (data.details && data.details.surface) || 'Non renseignée'}</p>
            
            <div style="background-color:#f9f9f9; padding:10px; border-radius:4px; margin-top:10px;">
                <strong>Message :</strong><br/>
                <span style="white-space:pre-wrap;">${messageContent}</span>
            </div>

            ${attachedFiles && attachedFiles.length > 0 ? `
            <div style="margin-top:20px; background-color:#EFF6FF; padding:15px; border-radius:6px;">
                <p style="margin:0 0 10px 0; font-weight:bold; color:#1F2D3D;">📎 Fichiers joints :</p>
                <ul style="margin:0; padding-left:20px;">
                    ${attachedFiles.map((f: any) => `<li><a href="${f.url}" style="color:#2563EB;">${f.name}</a></li>`).join('')}
                </ul>
            </div>
            ` : ''}

        </div>

        <!-- FOOTER -->
        <div style="background-color:#F9FAFB; padding:20px; text-align:center; font-size:12px; color:#9CA3AF; border-top:1px solid #E5E5E5;">
            <p style="margin:0;">Source : Gainable.fr &bull; Lead reçu le ${date}</p>
        </div>
    </div>
</body>
</html>
                `,
                text: `
Nouveau contact via Gainable

Nom : ${data.prenom || ''} ${data.nom}
Email : ${data.email}
Téléphone : ${data.telephone}
Ville : ${data.ville} (${data.code_postal})

Demande :
${messageContent}
Projet : ${data.projet || "N/A"}
Surface : ${data.surface || "N/A"}
Type : ${projetType}

${attachedFiles.length > 0 ? `
Fichiers joints :
${attachedFiles.map((f: any) => `- ${f.name}: ${f.url}`).join('\n')}
` : ''}

Source : ${sourceUrl}
Date : ${date}
                `
            });

            if (error) {
                console.error("Resend API Error:", error);
                // We previously failed here. Now we verify if DB worked.
                if (!savedLead) {
                    return NextResponse.json({ error: "Failed to save lead and send email" }, { status: 500 });
                }
                // If saved to DB but email failed, we return SUCCESS but log warning
                // The client will see "Success", data is safe in DB.
            }
        } catch (emailExc) {
            console.error("Email Exception:", emailExc);
        }

        // 5. Return Success
        return NextResponse.json({ success: true, id: savedLead?.id });

    } catch (error) {
        console.error("API Error (Leads):", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
