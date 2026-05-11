
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    const { id } = await params;

    try {
        const sale = await prisma.commercialSale.findUnique({
            where: { id }
        });

        if (!sale) {
            return NextResponse.json({ message: "Vente introuvable" }, { status: 404 });
        }

        // Vérifier que le commercial est propriétaire de la vente ou admin
        if (user.role !== 'admin' && sale.commercialId !== user.id) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
        }

        await prisma.commercialSale.delete({
            where: { id }
        });

        // Si c'était la seule vente, on pourrait remettre le statut du prospect à CONTACTE ?
        // Mais restons simples : on supprime juste la vente.
        
        return NextResponse.json({ message: "Vente supprimée avec succès" });
    } catch (error) {
        console.error("Error deleting sale:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
