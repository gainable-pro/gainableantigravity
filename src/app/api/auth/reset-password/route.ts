import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email requis" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Fake success delay to prevent enumeration
            await new Promise(resolve => setTimeout(resolve, 500));
            return NextResponse.json({ success: true });
        }

        // Generate Token
        const token = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 3600000); // 1 hour

        // Save to DB
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpires: expires
            } as any
        });

        // Send Email
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/nouveau-mot-de-passe?token=${token}`;

        // Console Log for Dev/Debug (crucial if email fails)
        console.log("----------------------------------------");
        console.log("🔑 PASSWORD RESET LINK (DEV ONLY):");
        console.log(resetLink);
        console.log("----------------------------------------");

        await resend.emails.send({
            from: "Gainable <no-reply@gainable.ch>",
            to: email,
            subject: "Réinitialisation de votre mot de passe",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #1F2D3D;">Réinitialisation du mot de passe</h1>
                    <p>Vous avez demandé à réinitialiser votre mot de passe sur Gainable.fr.</p>
                    <p>Cliquez sur le bouton ci-dessous pour en créer un nouveau (valable 1h) :</p>
                    <a href="${resetLink}" style="display: inline-block; background-color: #D59B2B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Choisir un nouveau mot de passe</a>
                    <p style="margin-top: 24px; font-size: 12px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
                </div>
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
