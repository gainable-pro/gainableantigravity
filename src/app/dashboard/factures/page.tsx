import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, Download } from "lucide-react";

// Force dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function InvoicesPage() {
    // Static placeholder data
    const subscription = { status: 'active', currentPeriodEnd: new Date("2024-12-31") };
    const invoices: any[] = [];

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-[#1F2D3D]">Mes Factures & Abonnement</h1>
                <p className="text-slate-500 text-sm">
                    Gérez votre abonnement et retrouvez l'historique de vos paiements.
                </p>
            </header>

            {/* Subscription Status Card */}
            <Card className="border-slate-200 shadow-sm bg-gradient-to-r from-slate-50 to-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#D59B2B]" />
                        Mon Abonnement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500">Statut actuel:</span>
                                <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200">
                                    Actif
                                </Badge>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                (Mode Démarrage - Pas de facturation réelle pour l'instant)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Invoices List */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-slate-500" />
                        Historique des factures
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="text-center py-10 text-slate-500 text-sm">
                        Aucune facture disponible pour le moment.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
