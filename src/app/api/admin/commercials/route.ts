import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET(req: Request) {
    const admin = await verifyAdmin();
    if (!admin) {
        return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    try {
        const commercials = await prisma.user.findMany({
            where: { role: 'commercial' },
            select: {
                id: true,
                email: true,
                created_at: true,
                commercialProspects: {
                    select: { id: true, status: true }
                },
                commercialSales: {
                    select: { id: true, montant: true, dateVente: true }
                }
            }
        });

        // Calcul des métriques pour chaque commercial
        const data = commercials.map(c => {
            const totalCA = c.commercialSales.reduce((acc, sale) => acc + sale.montant, 0);
            const totalSalesCount = c.commercialSales.length;
            const prospectsCount = c.commercialProspects.length;
            const pendingProspects = c.commercialProspects.filter(p => !["VENTE_EFFECTUEE", "REFUSE", "NE_PLUS_DEMARCHER"].includes(p.status)).length;
            const doNotContactCount = c.commercialProspects.filter(p => p.status === "NE_PLUS_DEMARCHER").length;

            return {
                id: c.id,
                email: c.email,
                created_at: c.created_at,
                metrics: {
                    totalCA,
                    totalSalesCount,
                    prospectsCount,
                    pendingProspects,
                    doNotContactCount
                }
            };
        });

        return NextResponse.json({ commercials: data });
    } catch (error) {
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
