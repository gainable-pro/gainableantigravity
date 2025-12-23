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
                    status: 'new'
                }
            });
            console.log("Lead saved to DB:", savedLead.id);
        } catch (dbError) {
            console.error("Database Error (Lead Save):", dbError);
            // Continue to try sending email even if DB fails? Or fail?
            // Better to fail if DB is critical, but email is 'notification'.
        }

        // 4. Send Email via Resend
        const recipientEmail = process.env.LEADS_TO_EMAIL || 'contact@airgenergie.fr';
        // Using "Gainable <onboarding@resend.dev>" as sender if no custom domain verified yet
        const fromEmail = process.env.LEADS_FROM_EMAIL || 'Gainable <onboarding@resend.dev>';

        const sourceUrl = request.headers.get("referer") || "Non spécifié";
        const date = new Date().toLocaleString("fr-FR");
        const projetType = data.type;

        try {
            const { error } = await resend.emails.send({
                from: fromEmail,
                to: recipientEmail,
                subject: `Nouveau lead Gainable – ${data.prenom || ''} ${data.nom} – ${data.ville}`,
                html: `
<h2>Nouveau contact via Gainable</h2>

<p><strong>Nom :</strong> ${data.prenom || ''} ${data.nom}</p>
<p><strong>Email :</strong> ${data.email}</p>
<p><strong>Téléphone :</strong> ${data.telephone}</p>
<p><strong>Ville :</strong> ${data.ville} (${data.code_postal})</p>
<p><strong>Adresse :</strong> ${data.adresse || 'Non renseignée'}</p>

<hr />

<p><strong>Demande :</strong></p>
<p style="white-space:pre-wrap;">${messageContent}</p>
<p><strong>Projet :</strong> ${data.projet || data.logement || "N/A"}</p>
<p><strong>Surface :</strong> ${data.surface || data.details?.surface || "N/A"}</p>
<p><strong>Type :</strong> ${projetType}</p>

${attachedFiles.length > 0 ? `
<hr />
<p><strong>Fichiers joints :</strong></p>
<ul>
    ${attachedFiles.map((f: any) => `<li><a href="${f.url}">${f.name}</a></li>`).join('')}
</ul>
` : ''}

<hr />

<p><strong>Source :</strong> ${sourceUrl}</p>
<p><strong>Date :</strong> ${date}</p>
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
