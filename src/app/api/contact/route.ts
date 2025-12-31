
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Helper to sanitize
const sanitize = (str: string) => str.replace(/[<>]/g, "");

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        // Extract fields
        const type = formData.get('type') as string; // 'particulier' | 'professionnel' | 'partenaire'
        const specificType = formData.get('specificType') as string; // 'bureau_etude' | 'installateur' etc.
        const civility = formData.get('civility') as string;
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const city = formData.get('city') as string;
        const zip = formData.get('zip') as string;
        const message = formData.get('message') as string;

        // File handling
        const file = formData.get('file') as File | null;

        // Validation simple
        if (!email || !lastName || !message) {
            return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.warn("⚠️ RESEND_API_KEY missing");
            return NextResponse.json({ success: true, simulated: true });
        }

        const resend = new Resend(resendApiKey);

        // Prepare Attachments
        const attachments = [];
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            attachments.push({
                filename: file.name,
                content: buffer,
            });
        }

        // Email Content Construction
        let subject = `[Nouveau Contact] ${type.toUpperCase()}`;
        if (specificType) subject += ` - ${specificType}`;
        subject += ` - ${lastName} ${firstName}`;

        const htmlContent = `
            <h2>Nouvelle demande de contact via Gainable.fr</h2>
            <p><strong>Type de profil :</strong> ${type} ${specificType ? `(${specificType})` : ''}</p>
            
            <h3>Coordonnées</h3>
            <ul>
                <li><strong>Nom :</strong> ${civility} ${lastName} ${firstName}</li>
                <li><strong>Email :</strong> ${email}</li>
                <li><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</li>
                <li><strong>Localisation :</strong> ${zip} ${city}</li>
            </ul>

            <h3>Message</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #D59B2B; white-space: pre-wrap;">
                ${sanitize(message)}
            </div>

            <p style="font-size: 12px; color: #888;">Cet email a été envoyé depuis le formulaire de contact de gainable.fr</p>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Gainable Contact <contact@gainable.fr>', // Ensure domain is verified in Resend dashboard, otherwise use onboarding@resend.dev for testing if needed
            to: ['contact@gainable.fr'],
            replyTo: email, // Allow direct reply to user
            subject: subject,
            html: htmlContent,
            attachments: attachments
        });

        if (error) {
            console.error("Resend API Error:", error);
            return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("Contact API Critical Error:", error);
        return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
    }
}
