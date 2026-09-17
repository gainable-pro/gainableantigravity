import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prospectId, email, nomEntreprise } = body;

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({ error: "Adresse email invalide" }, { status: 400 });
        }

        // Read the bulletproof HTML template
        let htmlContent = "";
        try {
            const templatePath = path.join(process.cwd(), "emails_marketing", "email_master_gainable.html");
            if (fs.existsSync(templatePath)) {
                htmlContent = fs.readFileSync(templatePath, "utf-8");
            }
        } catch (e) {
            console.warn("[SEND_PRESENTATION] Could not read template file directly, using fallback HTML");
        }

        if (!htmlContent) {
            return NextResponse.json({ error: "Gabarit HTML introuvable" }, { status: 500 });
        }

        const entrepriseName = nomEntreprise || 'votre entreprise';
        const subject = `Gainable.fr - Présentation officielle pour ${entrepriseName}`;

        const plainText = `Bonjour cher expert,\n\nQue vous soyez expert en climatisation (gainable, split, VRV), diagnostiqueur immobilier (DPE, audits) ou bureau d'études thermiques, votre expertise mérite une visibilité directe à la hauteur de votre savoir-faire.\n\nGainable.fr est la première plateforme dédiée exclusivement aux professionnels du génie climatique et de l'efficacité énergétique en France, en Suisse et en Belgique.\n\nDécouvrez la plateforme et son fonctionnement en vidéo : https://www.gainable.fr/pourquoi-gainable\n\nCordialement,\nL'Équipe Gainable.fr\nwww.gainable.fr`;

        const result = await sendEmail({
            to: email,
            subject: subject,
            html: htmlContent,
            text: plainText
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Échec de l'envoi de l'email" }, { status: 500 });
        }

        // Log action in prospect note if prospectId is provided
        if (prospectId) {
            try {
                const prospect = await prisma.commercialProspect.findUnique({
                    where: { id: prospectId }
                });

                if (prospect) {
                    const timeStr = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
                    const newNote = prospect.commentaire 
                        ? `${prospect.commentaire}\n[${timeStr}] Email de présentation envoyé à ${email}`
                        : `[${timeStr}] Email de présentation envoyé à ${email}`;

                    await prisma.commercialProspect.update({
                        where: { id: prospectId },
                        data: { commentaire: newNote }
                    });
                }
            } catch (dbErr) {
                console.warn("[SEND_PRESENTATION] Could not update prospect note:", dbErr);
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Email de présentation envoyé avec succès à ${email}` 
        });
    } catch (error: any) {
        console.error("Error sending presentation email:", error);
        return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
    }
}
