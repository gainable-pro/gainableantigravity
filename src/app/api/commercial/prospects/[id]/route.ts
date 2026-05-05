import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const { id } = await params;
        const prospect = await prisma.commercialProspect.findUnique({
            where: { id },
            include: { sales: true }
        });

        if (!prospect) {
            return NextResponse.json({ message: "Prospect non trouvé" }, { status: 404 });
        }

        if (user.role !== 'admin' && prospect.commercialId !== user.id) {
            return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
        }

        return NextResponse.json({ prospect });
    } catch (error) {
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        const { id } = await params;
        const prospect = await prisma.commercialProspect.findUnique({
            where: { id }
        });

        if (!prospect) {
            return NextResponse.json({ message: "Prospect non trouvé" }, { status: 404 });
        }

        if (user.role !== 'admin' && prospect.commercialId !== user.id) {
            return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
        }

        const body = await req.json();

        // Vérification Anti-Fraude si le SIRET est modifié
        if (body.siret && body.siret !== prospect.siret) {
            const existingExpert = await prisma.expert.findFirst({
                where: { siret: body.siret }
            });
            if (existingExpert) {
                return NextResponse.json({ message: "Ce SIRET est déjà inscrit sur notre plateforme en tant que client." }, { status: 403 });
            }
        }

        const updatedProspect = await prisma.commercialProspect.update({
            where: { id },
            data: {
                nomEntreprise: body.nomEntreprise !== undefined ? body.nomEntreprise : prospect.nomEntreprise,
                nomContact: body.nomContact !== undefined ? body.nomContact : prospect.nomContact,
                prenomContact: body.prenomContact !== undefined ? body.prenomContact : prospect.prenomContact,
                email: body.email !== undefined ? body.email : prospect.email,
                telephone: body.telephone !== undefined ? body.telephone : prospect.telephone,
                siret: body.siret !== undefined ? body.siret : prospect.siret,
                adresse: body.adresse !== undefined ? body.adresse : prospect.adresse,
                siteWeb: body.siteWeb !== undefined ? body.siteWeb : prospect.siteWeb,
                status: body.status !== undefined ? body.status : prospect.status,
                commentaire: body.commentaire !== undefined ? body.commentaire : prospect.commentaire
            }
        });

        return NextResponse.json({ prospect: updatedProspect });
    } catch (error) {
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

// Optionally, DELETE if allowed (request said "ne supprime rien", but typically they can't delete accounts, though they might want to delete a prospect they created by mistake. For safety, let's only allow them to update status to "REFUSE" instead of deleting, as requested: "le commercial ne peut pas supprimer un compte")
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    return NextResponse.json({ message: "La suppression est désactivée pour des raisons de suivi." }, { status: 403 });
}
