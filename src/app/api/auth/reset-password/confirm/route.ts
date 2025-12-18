import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
        }

        // Find user with valid token
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() } // Not expired
            } as any
        });

        if (!user) {
            return NextResponse.json({ message: "Ce lien est invalide ou a expiré." }, { status: 400 });
        }

        // Hash new password
        const passwordHash = await hash(newPassword, 12);

        // Update User & Clear Token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password_hash: passwordHash,
                resetToken: null,
                resetTokenExpires: null
            } as any
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Reset Confirm Error:", error);
        return NextResponse.json(
            { message: "Une erreur est survenue." },
            { status: 500 }
        );
    }
}
