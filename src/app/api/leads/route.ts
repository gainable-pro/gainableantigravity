
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

// Ensure global prisma client usage
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

// Validation Schema
const leadSchema = z.object({
    type: z.string(),
    // Contact
    nom: z.string().min(2),
    prenom: z.string().optional(),
    email: z.string().email(),
    telephone: z.string().min(10),
    code_postal: z.string().min(5),
    ville: z.string().optional(),
    adresse: z.string().optional(),

    // Honeypot (must be empty)
    _robot: z.string().optional(),

    // Details
    details: z.any().optional(),

    // Assignments
    expertIds: z.array(z.string()).min(1).max(5)
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validate Data
        const validatedData = leadSchema.parse(body);

        // Honeypot Check
        if (validatedData._robot) {
            console.warn("Spam attempt detected (honeypot filled).");
            // Fake success to fool bot
            return NextResponse.json({ success: true });
        }

        // Anti-Spam: Rate Limit by IP (Basic)
        // In Next.js App Router, headers() or request.headers
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        // Check if recent leads from this IP (if we stored IP, but we don't in Schema yet).
        // Check by Email frequency?
        const recentLeads = await prisma.lead.count({
            where: {
                email: validatedData.email,
                createdAt: { gt: new Date(Date.now() - 15 * 60 * 1000) } // 15 min
            }
        });

        if (recentLeads > 2) {
            return NextResponse.json({ success: false, message: "Trop de demandes envoyées. Veuillez patienter." }, { status: 429 });
        }

        // 2. Create Lead in DB
        const lead = await prisma.lead.create({
            data: {
                type: validatedData.type,
                nom: validatedData.nom,
                prenom: validatedData.prenom || "",
                email: validatedData.email,
                telephone: validatedData.telephone,
                code_postal: validatedData.code_postal,
                ville: validatedData.ville,
                adresse: validatedData.adresse,
                details: validatedData.details || {},
                assignments: {
                    create: validatedData.expertIds.map((expertId: string) => ({
                        expertId: expertId
                    }))
                }
            },
            include: {
                assignments: {
                    include: {
                        expert: true
                    }
                }
            }
        });

        // 3. Send Emails
        // Check Mode
        const emailMode = process.env.LEADS_EMAIL_MODE || 'simulation';
        const isSimulation = emailMode === 'simulation';

        if (isSimulation) {
            console.log(`[SIMULATION] Not sending real emails. Mode=${emailMode}`);
        }

        // A. Notify Client (Summary)
        // Only send if NOT simulation OR if we want to log it? 
        // We use sendEmail wrapper which usually checks API KEY. 
        // But here we want to enforce Simulation = Logs only.

        const expertsListHtml = lead.assignments.map((a: any) =>
            `<li><strong>${a.expert.nom_entreprise}</strong> (${a.expert.code_postal} ${a.expert.ville})</li>`
        ).join('');

        const clientEmailHtml = `
            <div style="font-family: sans-serif; color: #1F2D3D; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #D59B2B;">Merci pour votre demande !</h1>
                <p>Bonjour ${validatedData.prenom || validatedData.nom},</p>
                <p>Nous avons bien reçu votre projet de type <strong>${validatedData.type}</strong>.</p>
                <p>Votre dossier a été transmis aux professionnels suivants, qui vous recontacteront sous 48h :</p>
                <ul>
                    ${expertsListHtml}
                </ul>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">
                    Gainable.fr - L'annuaire des experts du gainable.
                </p>
            </div>
        `;

        if (!isSimulation) {
            await sendEmail({
                to: validatedData.email,
                subject: "Confirmation de votre demande - Gainable.fr",
                html: clientEmailHtml
            });
        } else {
            console.log("--- SIMULATED EMAIL TO CLIENT ---");
            console.log("To:", validatedData.email);
            console.log("Subject: Confirmation de votre demande - Gainable.fr");
        }

        // B. Notify Experts (Individual Emails)
        // We fetch experts with emails
        const expertsWithEmails = await prisma.expert.findMany({
            where: { id: { in: validatedData.expertIds } },
            include: { user: true }
        });

        const expertNotifications = expertsWithEmails.map((expert: any) => {
            const expertEmailHtml = `
                <div style="font-family: sans-serif; color: #1F2D3D; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D59B2B;">🚀 Nouveau Lead reçu !</h2>
                    <p>Bonjour <strong>${expert.nom_entreprise}</strong>,</p>
                    <p>Une nouvelle demande de devis correspond à votre secteur.</p>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p><strong>Client :</strong> ${validatedData.nom} ${validatedData.prenom || ''}</p>
                        <p><strong>Lieu :</strong> ${validatedData.code_postal} ${validatedData.ville || ''}</p>
                        <p><strong>Téléphone :</strong> <a href="tel:${validatedData.telephone}">${validatedData.telephone}</a></p>
                        <p><strong>Email :</strong> <a href="mailto:${validatedData.email}">${validatedData.email}</a></p>
                        <p><strong>Type :</strong> ${validatedData.type}</p>
                    </div>

                    <p>Connectez-vous à votre espace pro pour traiter la demande.</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/leads" style="background: #1F2D3D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Accéder à mes leads</a>
                </div>
            `;

            if (!isSimulation) {
                return sendEmail({
                    to: expert.user.email,
                    subject: `📍 Nouvelle demande : ${validatedData.ville} (${validatedData.code_postal})`,
                    html: expertEmailHtml
                });
            } else {
                console.log(`--- SIMULATED EMAIL TO EXPERT (${expert.nom_entreprise}) ---`);
                console.log("To:", expert.user.email);
                console.log("Subject:", `📍 Nouvelle demande : ${validatedData.ville} (${validatedData.code_postal})`);
                return Promise.resolve({ success: true, simulated: true });
            }
        });

        await Promise.all(expertNotifications);

        return NextResponse.json({ success: true, leadId: lead.id, mode: emailMode });

    } catch (error) {
        console.error("API Lead Error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}
