import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, TrendingUp } from "lucide-react";

// Ensure global prisma
let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}

export default async function InvoicesPage() {
    // ---------------------------------------------------------
    // TEMP: MOCK AUTH
    // ---------------------------------------------------------
    const demoExpert = await prisma.expert.findFirst({
        include: {
            subscription: true,
            invoices: { orderBy: { createdAt: 'desc' } }
        }
    });

    if (!demoExpert) {
        return <div className="p-8">Aucun expert trouvé en base pour la démo.</div>;
    }

    const subscription = demoExpert.subscription;
    const invoices = demoExpert.invoices;

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
                                {subscription ? (
                                    <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}
                                        className={subscription.status === 'active' ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                                        {subscription.status === 'active' ? 'Actif' : subscription.status}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-slate-500 border-slate-300">Inactif</Badge>
                                )}
                            </div>
                            {subscription && (
                                <p className="text-xs text-slate-400 mt-1">
                                    Renouvellement le {format(new Date(subscription.currentPeriodEnd), "d MMMM yyyy", { locale: fr })}
                                </p>
                            )}
                        </div>
                        {/* Manage Button (could link to Stripe Customer Portal later) */}
                        {/* <Button variant="outline" size="sm">Gérer</Button> */}
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
                    {invoices.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm">
                            Aucune facture disponible.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {invoices.map((inv) => (
                                <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-medium text-slate-700 text-sm">
                                            Facture du {format(new Date(inv.createdAt), "d MMMM yyyy", { locale: fr })}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Badge variant="outline" className="text-xs font-normal bg-white border-slate-200">
                                                {(inv.amount / 100).toFixed(2)} €
                                            </Badge>
                                            <span className={inv.status === 'paid' ? "text-green-600 font-medium" : "text-slate-500"}>
                                                {inv.status === 'paid' ? 'Payée' : inv.status}
                                            </span>
                                        </div>
                                    </div>
                                    {inv.pdfUrl && (
                                        <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-[#D59B2B] hover:bg-amber-50">
                                            <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                                <Download className="h-4 w-4" />
                                                <span className="hidden sm:inline">PDF</span>
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
