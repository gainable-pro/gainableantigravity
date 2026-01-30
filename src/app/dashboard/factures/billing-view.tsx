"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Download,
    AlertCircle,
    CheckCircle2,
    CreditCard,
    Calendar,
    Ban,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { cancelSubscriptionAction } from "./actions";

interface BillingViewProps {
    invoices: any[];
    subscription: any; // Stripe Subscription Object
}

export function BillingView({ invoices, subscription }: BillingViewProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // --- LOGIC: ENGAGEMENT & CANCELLATION ---
    // 1. Calculate Dates
    const startDate = new Date(subscription.created * 1000);
    const anniversaryDate = new Date(startDate);
    anniversaryDate.setFullYear(startDate.getFullYear() + 1);

    const cancellationOpenDate = new Date(anniversaryDate);
    cancellationOpenDate.setMonth(anniversaryDate.getMonth() - 1);

    const now = new Date();
    const canCancel = now >= cancellationOpenDate;
    const isCanceled = subscription.cancel_at_period_end;

    // --- ACTION HANDLE ---
    const handleCancel = async () => {
        if (!confirm("Êtes-vous sûr de vouloir demander la résiliation à la date anniversaire ?")) return;

        setIsLoading(true);
        setMsg(null);

        const res = await cancelSubscriptionAction(subscription.id);

        if (res.success) {
            setMsg({ type: 'success', text: res.message || "Résiliation prise en compte." });
            window.location.reload(); // Refresh to update status
        } else {
            setMsg({ type: 'error', text: res.error || "Une erreur est survenue." });
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
            {/* HEAD */}
            <header>
                <h1 className="text-2xl font-bold text-[#1F2D3D]">Mes Factures & Abonnement</h1>
                <p className="text-slate-500 text-sm">
                    Gérez votre abonnement et retrouvez l'historique de vos paiements.
                </p>
            </header>

            {/* FEEDBACK MSG */}
            {msg && (
                <div className={`p-4 rounded-lg flex items-center gap-2 text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {msg.text}
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-8">

                {/* --- 1. SUBSCRIPTION CARD --- */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <div className="h-2 bg-[#D59B2B] w-full"></div>
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-[#D59B2B]" />
                                    Mon Abonnement Expert
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Engagement 12 mois
                                </CardDescription>
                            </div>
                            <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}
                                className={subscription.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : ''}>
                                {subscription.status === 'active' ? 'Actif' : subscription.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* DATES GRID */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Début d'engagement</div>
                                <div className="font-medium text-slate-700">
                                    {format(startDate, 'd MMMM yyyy', { locale: fr })}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Date Anniversaire</div>
                                <div className="font-medium text-[#D59B2B]">
                                    {format(anniversaryDate, 'd MMMM yyyy', { locale: fr })}
                                </div>
                            </div>
                        </div>

                        {/* CANCELLATION LOGIC UI */}
                        <div className="pt-2">
                            {isCanceled ? (
                                <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex gap-3 text-sm text-orange-800">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <div>
                                        <strong>Résiliation programmée.</strong><br />
                                        Votre abonnement prendra fin le {format(new Date(subscription.current_period_end * 1000), 'd MMMM yyyy')}.
                                    </div>
                                </div>
                            ) : (
                                <div className="inline-block w-full">
                                    <Button
                                        variant="outline"
                                        className={`w-full justify-start gap-2 ${!canCancel ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200' : 'text-red-600 border-red-200 hover:bg-red-50'}`}
                                        disabled={!canCancel || isLoading}
                                        onClick={handleCancel}
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                                        {canCancel ? "Demander la résiliation (Fin de contrat)" : "Résilier l'abonnement"}
                                    </Button>

                                    {!canCancel && (
                                        <div className="mt-3 text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
                                            <p className="font-semibold mb-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3 text-[#D59B2B]" /> Option verrouillée (Engagement 12 mois)
                                            </p>
                                            La résiliation sera possible à partir du <strong>{format(cancellationOpenDate, 'd MMMM yyyy', { locale: fr })}</strong> (1 mois avant la date anniversaire).
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>

                {/* --- 2. INVOICE HISTORY TABLE --- */}
                <Card className="border-slate-200 shadow-sm h-full flex flex-col">
                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-slate-500" />
                            Historique des Factures
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-auto">
                        {invoices.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm">
                                <CreditCard className="w-8 h-8 mb-2 opacity-20" />
                                Aucune facture disponible pour le moment.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Montant</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((inv) => (
                                        <TableRow key={inv.id}>
                                            <TableCell className="font-medium text-slate-700">
                                                {format(new Date(inv.created * 1000), 'd MMM yyyy', { locale: fr })}
                                            </TableCell>
                                            <TableCell>
                                                {(inv.total / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                                <span className="text-xs text-slate-400 ml-1">TTC</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {inv.hosted_invoice_url && (
                                                    <a
                                                        href={inv.hosted_invoice_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#D59B2B] hover:underline"
                                                    >
                                                        <Download className="w-3 h-3" />
                                                        PDF
                                                    </a>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
