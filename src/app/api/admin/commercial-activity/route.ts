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
            where: {
                OR: [
                    { role: 'commercial' },
                    { commercialProfile: { isNot: null } }
                ]
            },
            include: {
                commercialProfile: true,
                commercialProspects: {
                    orderBy: { updatedAt: 'desc' },
                    select: {
                        id: true,
                        nomEntreprise: true,
                        nomContact: true,
                        prenomContact: true,
                        status: true,
                        updatedAt: true,
                        createdAt: true
                    }
                },
                commercialSales: {
                    orderBy: { dateVente: 'desc' },
                    select: {
                        id: true,
                        montant: true,
                        dateVente: true,
                        status: true,
                        paiementType: true,
                        prospect: {
                            select: { nomEntreprise: true, nomContact: true }
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        let globalTotalSalesAmount = 0;
        let globalTotalSalesCount = 0;
        let globalTotalProspects = 0;
        let globalActiveTodayCount = 0;

        const commercialsData = commercials.map(c => {
            const profileName = c.commercialProfile
                ? `${c.commercialProfile.prenom || ''} ${c.commercialProfile.nom || ''}`.trim() || c.email
                : c.email;

            const salesAmount = c.commercialSales
                .filter(s => s.status === 'VALIDEE' || s.status === 'EN_ATTENTE' || !s.status)
                .reduce((acc, sale) => acc + (sale.montant || 0), 0);

            const salesCount = c.commercialSales.length;
            const prospectsCount = c.commercialProspects.length;

            globalTotalSalesAmount += salesAmount;
            globalTotalSalesCount += salesCount;
            globalTotalProspects += prospectsCount;

            // Find last prospect activity timestamp
            const lastProspectUpdate = c.commercialProspects.length > 0
                ? new Date(c.commercialProspects[0].updatedAt)
                : null;

            // Find last sale date
            const lastSaleDate = c.commercialSales.length > 0
                ? new Date(c.commercialSales[0].dateVente)
                : null;

            // Effective last active timestamp
            const rawLastActive = c.lastActiveAt || c.lastLoginAt;
            let lastActiveDate: Date | null = rawLastActive ? new Date(rawLastActive) : null;

            if (lastProspectUpdate && (!lastActiveDate || lastProspectUpdate > lastActiveDate)) {
                lastActiveDate = lastProspectUpdate;
            }
            if (lastSaleDate && (!lastActiveDate || lastSaleDate > lastActiveDate)) {
                lastActiveDate = lastSaleDate;
            }

            // Connection & Check-in statuses
            const isActiveToday = lastActiveDate ? lastActiveDate >= startOfToday : false;
            const isActiveThisWeek = lastActiveDate ? lastActiveDate >= sevenDaysAgo : false;

            if (isActiveToday) globalActiveTodayCount++;

            // Status label
            let activeStatus: "connected_today" | "connected_this_week" | "inactive" = "inactive";
            if (isActiveToday) activeStatus = "connected_today";
            else if (isActiveThisWeek) activeStatus = "connected_this_week";

            // Verified prospects today check
            const hasVerifiedProspectsToday = c.commercialProspects.some(p => new Date(p.updatedAt) >= startOfToday);

            // Prospects status breakdown
            const prospectsByStatus = {
                NON_CONTACTE: c.commercialProspects.filter(p => p.status === 'NON_CONTACTE').length,
                CONTACTE: c.commercialProspects.filter(p => p.status === 'CONTACTE').length,
                INTERESSE: c.commercialProspects.filter(p => p.status === 'INTERESSE').length,
                VENTE_EFFECTUEE: c.commercialProspects.filter(p => p.status === 'VENTE_EFFECTUEE').length,
                REFUSE: c.commercialProspects.filter(p => p.status === 'REFUSE').length,
                NE_PLUS_DEMARCHER: c.commercialProspects.filter(p => p.status === 'NE_PLUS_DEMARCHER').length,
            };

            const conversionRate = prospectsCount > 0
                ? parseFloat(((salesCount / prospectsCount) * 100).toFixed(1))
                : 0;

            return {
                id: c.id,
                email: c.email,
                name: profileName,
                phone: c.commercialProfile?.telephone || null,
                statutLegal: c.commercialProfile?.statutLegal || 'Commercial',
                siren: c.commercialProfile?.siren || null,
                createdAt: c.created_at,
                lastLoginAt: c.lastLoginAt ? c.lastLoginAt.toISOString() : null,
                lastActiveAt: lastActiveDate ? lastActiveDate.toISOString() : null,
                activeStatus,
                isActiveToday,
                hasVerifiedProspectsToday,
                prospectsCount,
                salesAmount,
                salesCount,
                conversionRate,
                prospectsByStatus,
                sales: c.commercialSales.map(s => ({
                    id: s.id,
                    montant: s.montant,
                    dateVente: s.dateVente.toISOString(),
                    status: s.status,
                    paiementType: s.paiementType,
                    prospectName: s.prospect?.nomEntreprise || s.prospect?.nomContact || "Prospect"
                })),
                recentProspects: c.commercialProspects.slice(0, 5).map(p => ({
                    id: p.id,
                    nomEntreprise: p.nomEntreprise,
                    contact: `${p.prenomContact || ''} ${p.nomContact || ''}`.trim(),
                    status: p.status,
                    updatedAt: p.updatedAt.toISOString()
                }))
            };
        });

        // Overview summary
        const summary = {
            totalCommercials: commercials.length,
            activeTodayCount: globalActiveTodayCount,
            totalSalesAmount: globalTotalSalesAmount,
            totalSalesCount: globalTotalSalesCount,
            totalProspectsAssigned: globalTotalProspects,
            globalConversionRate: globalTotalProspects > 0
                ? parseFloat(((globalTotalSalesCount / globalTotalProspects) * 100).toFixed(1))
                : 0
        };

        return NextResponse.json({ summary, commercials: commercialsData });
    } catch (error: any) {
        console.error("Commercial activity API error:", error);
        return NextResponse.json({ message: "Erreur lors du chargement des données commerciales" }, { status: 500 });
    }
}
