import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";

// GET: Liste des ventes
export async function GET(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        let whereClause: any = {};
        if (user.role !== 'admin') {
            whereClause.commercialId = user.id;
        }

        const sales = await prisma.commercialSale.findMany({
            where: whereClause,
            include: { prospect: true },
            orderBy: { dateVente: 'desc' }
        });

        return NextResponse.json({ sales });
    } catch (error) {
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

// POST: Ajouter une nouvelle vente
export async function POST(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const body = await req.json();

        if (!body.prospectId || !body.paiementType || !body.dateVente || !body.montant) {
            return NextResponse.json({ message: "Données incomplètes" }, { status: 400 });
        }

        const prospect = await prisma.commercialProspect.findUnique({
            where: { id: body.prospectId }
        });

        if (!prospect || (user.role !== 'admin' && prospect.commercialId !== user.id)) {
            return NextResponse.json({ message: "Prospect non trouvé ou non autorisé" }, { status: 403 });
        }

        // Créer la vente
        const sale = await prisma.commercialSale.create({
            data: {
                commercialId: user.id,
                prospectId: prospect.id,
                paiementType: body.paiementType, // "COMPTANT" | "MENSUALISE"
                dateVente: new Date(body.dateVente),
                montant: parseFloat(body.montant)
            }
        });

        // Mettre à jour le statut du prospect
        await prisma.commercialProspect.update({
            where: { id: prospect.id },
            data: { status: "VENTE_EFFECTUEE" }
        });

        return NextResponse.json({ sale }, { status: 201 });
    } catch (error) {
        console.error("Error creating sale:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
