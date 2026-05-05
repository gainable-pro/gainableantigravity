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

        // Vérification Anti-Fraude : le SIRET ne doit pas déjà exister dans la base des experts clients
        const existingExpert = await prisma.expert.findFirst({
            where: { siret: body.siret }
        });

        if (existingExpert) {
            return NextResponse.json({ message: "Ce SIRET est déjà inscrit sur notre plateforme en tant que client." }, { status: 403 });
        }

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
