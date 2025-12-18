import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

// Initialize Prisma & Resend
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Fallback for build

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email requis" }, { status: 400 });
        }

        // 1. Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Security: Always return success even if user not found to prevent enumeration
        if (!user) {
            // Fake success delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return NextResponse.json({ success: true });
        }

        // 2. Generate Reset Token (simplified logic for now)
        // Ideally: Save token to DB logic here (User.resetToken, User.resetTokenExpires)
        // For MVP: We will simulate the email sending. 
        // Note: You need a dedicated field in User model for reset tokens to make this functional securely.

        // MVP: Send email saying "Contact admin" or implement full token logic if requested.
        // Let's implement a basic email notification to the user.

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password-confirm?email=${encodeURIComponent(email)}`; // Placeholder

        await resend.emails.send({
            from: "Gainable Support <support@resend.dev>",
            to: email,
            subject: "Réinitialisation de mot de passe",
            html: `
                <h1>Mot de passe oublié</h1>
                <p>Une demande de réinitialisation a été effectuée pour votre compte.</p>
                <p>Pour le moment, veuillez contacter le support pour changer votre mot de passe manuellement : contact@airgenergie.fr</p>
                <!-- <a href="${resetLink}">Réinitialiser mon mot de passe</a> -->
            `
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue." },
            { status: 500 }
        );
    }
}
