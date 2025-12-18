// Force rebuild: Fix syntax error check
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

// Initialize Resend
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
        const recipientEmail = process.env.LEADS_TO_EMAIL || 'contact@airgenergie.fr';

        // Use referer as sourceUrl if available
        const sourceUrl = request.headers.get("referer") || "Non spécifié";
        const date = new Date().toLocaleString("fr-FR");

        // 3. Send Email via Resend
        // Using "Gainable <onboarding@resend.dev>" as sender if no custom domain verified yet
        const fromEmail = process.env.LEADS_FROM_EMAIL || 'Gainable <onboarding@resend.dev>';

        // Format message content
        const messageContent = data.message || data.details?.message || "Aucun message";
        const projetType = data.type;

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

Source : ${sourceUrl}
Date : ${date}
            `
        });

        if (error) {
            console.error("Resend API Error:", error);
            // Don't leak error details to client, but return 500
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        // 4. Return Success
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("API Error (Leads):", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
