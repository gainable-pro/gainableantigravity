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

// POST: Ajouter un nouveau prospect avec vérification d'exclusivité anti-doublon et RDV
export async function POST(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const body = await req.json();
        
        // Validation basique
        if (!body.nomEntreprise || !body.nomContact) {
            return NextResponse.json({ message: "Le nom de l'entreprise et le contact sont requis." }, { status: 400 });
        }

        // 1. Anti-Duplicate Exclusivity Check (Vérification d'exclusivité par SIRET ou Nom + Adresse)
        if (body.siret && body.siret.length >= 9) {
            const existingProspect = await prisma.commercialProspect.findFirst({
                where: { siret: body.siret },
                include: { commercial: { include: { commercialProfile: true } } }
            });

            if (existingProspect && existingProspect.commercialId !== user.id) {
                const ownerName = existingProspect.commercial.commercialProfile?.nom || existingProspect.commercial.email;
                return NextResponse.json({ 
                    message: `Exclusivité Commerciale : Cette entreprise (${body.nomEntreprise}) est déjà attribuée à ${ownerName}. Pour éviter tout doublon d'appel, vous ne pouvez pas la réattribuer.`,
                    isLocked: true,
                    assignedTo: ownerName
                }, { status: 409 });
            }
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
                commentaire: body.commentaire || null,
                dateRdv: body.dateRdv ? new Date(body.dateRdv) : null,
                heureRdv: body.heureRdv || null,
                noteRdv: body.noteRdv || null
            }
        });

        return NextResponse.json({ prospect: newProspect }, { status: 201 });
    } catch (error) {
        console.error("Error creating prospect:", error);
        return NextResponse.json({ message: "Erreur lors de la création du prospect" }, { status: 500 });
    }
}
