import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCommercial, unauthorizedCommercial } from "@/lib/commercial-auth";
import { releaseExpiredProspects, computeProspectExpiry } from "@/lib/commercial-expiration";

// GET: Liste des prospects du commercial connecté (ou tous si admin) avec calcul du chrono 40j
export async function GET(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        // Libération automatique de toutes les fiches expirées (> 40 jours sans vente)
        await releaseExpiredProspects();

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

        const rawProspects = await prisma.commercialProspect.findMany({
            where: whereClause,
            include: {
                sales: {
                    select: {
                        id: true,
                        status: true,
                        montant: true,
                        dateVente: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Enrichir chaque prospect avec son chrono 40 jours
        const prospects = rawProspects.map(p => {
            const expiry = computeProspectExpiry(p);
            return {
                ...p,
                assignedAt: p.assignedAt || p.createdAt,
                daysRemaining: expiry.daysRemaining,
                daysElapsed: expiry.daysElapsed,
                percentElapsed: expiry.percentElapsed,
                isExpired: expiry.isExpired,
                isSold: expiry.isSold,
                expiryDate: expiry.expiryDate.toISOString()
            };
        });

        return NextResponse.json({ prospects });
    } catch (error) {
        console.error("Error fetching prospects:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

// POST: Ajouter ou mettre à jour un prospect avec vérification de contact téléphonique obligatoire et chrono 40j
export async function POST(req: Request) {
    const user = await verifyCommercial();
    if (!user) return unauthorizedCommercial();

    try {
        // Nettoyer les expirations préalables
        await releaseExpiredProspects();

        const body = await req.json();
        
        // Validation basique
        if (!body.nomEntreprise || !body.nomContact) {
            return NextResponse.json({ message: "Le nom de l'entreprise et le contact sont requis." }, { status: 400 });
        }

        // RÈGLE ANTI-RÉSERVATION : Obligation d'avoir réellement contacté l'entreprise par téléphone
        // Un commercial ne peut pas s'attribuer massivement des fiches en statut "NON_CONTACTE"
        if (user.role !== 'admin' && (!body.status || body.status === "NON_CONTACTE")) {
            return NextResponse.json({ 
                message: "Règle anti-réservation : Pour préserver la base commune et éviter le blocage abusif des entreprises, vous devez impérativement joindre l'entreprise par téléphone (message vocal, échange ou refus) avant de pouvoir vous attribuer la fiche dans votre CRM.",
                requiresPhoneContact: true
            }, { status: 400 });
        }

        const now = new Date();

        // 1. Anti-Duplicate Exclusivity Check (Vérification d'exclusivité par SIRET)
        if (body.siret && body.siret.length >= 9) {
            const existingProspect = await prisma.commercialProspect.findFirst({
                where: { siret: body.siret },
                include: { 
                    commercial: { include: { commercialProfile: true } },
                    sales: true
                }
            });

            if (existingProspect) {
                const expiry = computeProspectExpiry(existingProspect);

                // Si la fiche a dépassé les 40 jours sans vente conclue, l'exclusivité est annulée !
                // La fiche se remet dans la base et peut être réattribuée au nouveau commercial qui appelle.
                if (expiry.isExpired && !expiry.isSold) {
                    await prisma.commercialProspect.delete({
                        where: { id: existingProspect.id }
                    });
                    console.log(`[Re-attribution] Fiche SIRET ${body.siret} expirée (> 40j sans vente de ${existingProspect.commercial.email}), réattribuée à ${user.email}`);
                } else if (existingProspect.commercialId !== user.id) {
                    const ownerName = existingProspect.commercial.commercialProfile?.nom || existingProspect.commercial.email;
                    return NextResponse.json({ 
                        message: `Exclusivité Commerciale : Cette entreprise (${body.nomEntreprise}) est actuellement attribuée à ${ownerName}. Il lui reste ${expiry.daysRemaining} jour(s) pour conclure la vente (chrono 40j). Au-delà, la fiche sera automatiquement libérée.`,
                        isLocked: true,
                        assignedTo: ownerName,
                        daysRemaining: expiry.daysRemaining
                    }, { status: 409 });
                } else {
                    // Si le prospect appartient déjà à ce commercial, on met à jour sa fiche
                    const updatedProspect = await prisma.commercialProspect.update({
                        where: { id: existingProspect.id },
                        data: {
                            email: body.email || existingProspect.email,
                            telephone: body.telephone || existingProspect.telephone,
                            siteWeb: body.siteWeb || existingProspect.siteWeb,
                            status: body.status || existingProspect.status,
                            commentaire: body.commentaire || existingProspect.commentaire,
                            dateRdv: body.dateRdv ? new Date(body.dateRdv) : existingProspect.dateRdv,
                            heureRdv: body.heureRdv !== undefined ? body.heureRdv : existingProspect.heureRdv,
                            noteRdv: body.noteRdv !== undefined ? body.noteRdv : existingProspect.noteRdv
                        }
                    });
                    return NextResponse.json({ prospect: updatedProspect, updated: true }, { status: 200 });
                }
            }
        }

        // Nouvelle attribution avec date d'attribution et chrono 40 jours
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
                status: body.status || "CONTACTE",
                commentaire: body.commentaire || null,
                dateRdv: body.dateRdv ? new Date(body.dateRdv) : null,
                heureRdv: body.heureRdv || null,
                noteRdv: body.noteRdv || null,
                assignedAt: now
            }
        });

        const expiry = computeProspectExpiry(newProspect);

        return NextResponse.json({ 
            prospect: {
                ...newProspect,
                daysRemaining: expiry.daysRemaining,
                daysElapsed: expiry.daysElapsed,
                percentElapsed: expiry.percentElapsed,
                expiryDate: expiry.expiryDate.toISOString()
            } 
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating prospect:", error);
        return NextResponse.json({ message: "Erreur lors de la création du prospect" }, { status: 500 });
    }
}
