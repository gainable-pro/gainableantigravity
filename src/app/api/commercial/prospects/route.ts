import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";

// GET: Liste des prospects du commercial connecté (ou tous si admin)
export async function GET(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const url = new URL(req.url);
        const search = url.searchParams.get("search") || "";

        let whereClause: any = {};
        if (user.role !== 'admin') {
            whereClause.commercialId = user.id;
        }

        if (search) {
            whereClause.OR = [
                { nomEntreprise: { contains: search, mode: "insensitive" } },
                { nomContact: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } }
            ];
        }

        const prospects = await prisma.commercialProspect.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ prospects });
    } catch (error) {
        console.error("Error fetching prospects:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

// POST: Ajouter un nouveau prospect
export async function POST(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const body = await req.json();
        
        // Validation basique
        if (!body.nomEntreprise || !body.nomContact || !body.siret) {
            return NextResponse.json({ message: "Le nom de l'entreprise, le contact et le SIRET sont requis." }, { status: 400 });
        }

        // Note : Nous permettons désormais au commercial d'ajouter un prospect même si le SIRET
        // existe déjà dans la base Expert (car le client a pu s'inscrire avant que le commercial
        // ne déclare le prospect). La vraie validation de la vente se fera côté Admin.

        const newProspect = await prisma.commercialProspect.create({
            data: {
                commercialId: user.id,
                nomEntreprise: body.nomEntreprise,
                nomContact: body.nomContact,
                prenomContact: body.prenomContact || null,
                email: body.email || null,
                telephone: body.telephone || null,
                siret: body.siret || null,
                adresse: body.adresse || null,
                siteWeb: body.siteWeb || null,
                status: body.status || "NON_CONTACTE",
                commentaire: body.commentaire || null
            }
        });

        return NextResponse.json({ prospect: newProspect }, { status: 201 });
    } catch (error) {
        console.error("Error creating prospect:", error);
        return NextResponse.json({ message: "Erreur lors de la création du prospect" }, { status: 500 });
    }
}
