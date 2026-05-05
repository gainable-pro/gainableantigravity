import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";

export async function GET(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        let profile = await prisma.commercialProfile.findUnique({
            where: { userId: user.id }
        });

        // Si le profil n'existe pas, on retourne un objet vide
        if (!profile) {
            return NextResponse.json({ profile: {} });
        }

        return NextResponse.json({ profile });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const body = await req.json();

        const profile = await prisma.commercialProfile.upsert({
            where: { userId: user.id },
            update: {
                nom: body.nom !== undefined ? body.nom : undefined,
                prenom: body.prenom !== undefined ? body.prenom : undefined,
                siren: body.siren !== undefined ? body.siren : undefined,
                statutLegal: body.statutLegal !== undefined ? body.statutLegal : undefined,
                telephone: body.telephone !== undefined ? body.telephone : undefined,
                adresse: body.adresse !== undefined ? body.adresse : undefined,
            },
            create: {
                userId: user.id,
                nom: body.nom || null,
                prenom: body.prenom || null,
                siren: body.siren || null,
                statutLegal: body.statutLegal || null,
                telephone: body.telephone || null,
                adresse: body.adresse || null,
            }
        });

        return NextResponse.json({ profile });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
