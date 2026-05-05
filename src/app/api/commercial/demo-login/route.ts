import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

export async function POST(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const body = await req.json();
        const { targetCompanyName } = body;

        if (targetCompanyName !== "Air G Énergie" && targetCompanyName !== "SMB13") {
            return NextResponse.json({ message: "Non autorisé à se connecter à ce compte pour la démonstration." }, { status: 403 });
        }

        let dbSearchName = targetCompanyName;
        if (targetCompanyName === "Air G Énergie") dbSearchName = "AIR G ENERGIE";
        if (targetCompanyName === "SMB13") dbSearchName = "SMB 13";

        const expert = await prisma.expert.findFirst({
            where: {
                nom_entreprise: {
                    equals: dbSearchName,
                    mode: 'insensitive'
                }
            },
            include: { user: true }
        });

        if (!expert || !expert.user) {
            return NextResponse.json({ message: "Compte de démonstration introuvable." }, { status: 404 });
        }

        // Generate JWT for the target expert user, while keeping track of the commercial impersonator
        const token = sign(
            { 
                userId: expert.user.id, 
                email: expert.user.email, 
                role: expert.user.role,
                impersonatorId: user.id 
            },
            JWT_SECRET,
            { expiresIn: "1h" } // Session courte pour la démo
        );

        const serialized = serialize("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60, // 1 heure
            path: "/",
        });

        return NextResponse.json(
            { message: "Connexion démo réussie" },
            {
                status: 200,
                headers: { "Set-Cookie": serialized },
            }
        );
    } catch (error) {
        console.error("Demo login error:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
