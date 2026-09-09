"use client";

import { useState } from "react";
import { 
    CreditCard, 
    CheckCircle2, 
    Sparkles, 
    ShieldCheck, 
    Zap, 
    Loader2, 
    ArrowRight,
    Building2,
    FileSearch,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SubscribeViewProps {
    expertId: string;
    email: string;
    defaultPlanType?: string; // "cvc_climatisation" | "diagnostics_dpe" | "bureau_detude"
    isSuccess?: boolean;
}

export function SubscribeView({ expertId, email, defaultPlanType, isSuccess }: SubscribeViewProps) {
    const isDiagDefault = defaultPlanType === "diagnostics_dpe";
    const [selectedPlan, setSelectedPlan] = useState<'cvc' | 'diag'>(isDiagDefault ? 'diag' : 'cvc');
    const [interval, setInterval] = useState<'yearly' | 'monthly'>('yearly');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubscribe = async () => {
        setIsLoading(true);
        setErrorMsg(null);

        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: selectedPlan,
                    interval,
                    email,
                    expertId,
                    returnUrl: "/dashboard/factures"
                }),
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || "Impossible de démarrer la session de paiement.");
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("L'URL de paiement n'a pas été retournée.");
            }
        } catch (err: any) {
            console.error("Payment initiation error:", err);
            setErrorMsg(err.message || "Une erreur est survenue lors de l'initialisation du paiement.");
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
            {/* HEAD */}
            <header className="border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D59B2B] mb-1">
                    <ShieldCheck className="w-4 h-4" /> Espace Facturation & Activation
                </div>
                <h1 className="text-2xl font-bold text-[#1F2D3D]">Souscrire votre Abonnement Expert</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Choisissez la formule adaptée à votre activité pour activer pleinement votre profil et recevoir les leads qualifiés.
                </p>
            </header>

            {isSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                        <strong className="font-semibold">Paiement validé avec succès !</strong>
                        <p className="text-xs text-emerald-700 mt-0.5">Votre abonnement est maintenant actif. Votre facture apparaîtra ci-dessous.</p>
                    </div>
                </div>
            )}

            {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMsg}
                </div>
            )}

            {/* FREQUENCY TOGGLE */}
            <div className="flex justify-center my-6">
                <div className="bg-slate-100 p-1.5 rounded-full inline-flex items-center border border-slate-200 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setInterval('yearly')}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                            interval === 'yearly'
                                ? 'bg-white text-[#1F2D3D] shadow-sm font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Annuel (Engagement 12 mois)
                        <Badge className="ml-2 bg-[#D59B2B] text-white border-0 text-[10px] px-1.5 py-0">2 Mois Offerts</Badge>
                    </button>
                    <button
                        type="button"
                        onClick={() => setInterval('monthly')}
                        className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                            interval === 'monthly'
                                ? 'bg-white text-[#1F2D3D] shadow-sm font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        Mensuel
                    </button>
                </div>
            </div>

            {/* PLAN CARDS */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* CARD 1: CVC / CLIMATISATION */}
                <Card 
                    className={`relative cursor-pointer transition-all border-2 ${
                        selectedPlan === 'cvc' 
                            ? 'border-[#D59B2B] shadow-md bg-amber-50/10' 
                            : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedPlan('cvc')}
                >
                    {selectedPlan === 'cvc' && (
                        <div className="absolute -top-3 right-4 bg-[#D59B2B] text-white text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" /> Sélectionné
                        </div>
                    )}

                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2 text-[#D59B2B]">
                            <Building2 className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wide">Formule CVC & Climatisation</span>
                        </div>
                        <CardTitle className="text-xl font-bold text-[#1F2D3D]">Pro CVC & Pompe à Chaleur</CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                            Pour les installateurs, chauffagistes et frigoristes CVC.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="border-y border-slate-100 py-3 my-2">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-[#1F2D3D]">
                                    {interval === 'yearly' ? '850 €' : '85 €'}
                                </span>
                                <span className="text-slate-500 text-xs font-medium">
                                    HT / {interval === 'yearly' ? 'an' : 'mois'}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                {interval === 'yearly' ? 'Soit 1 020 € TTC / an' : 'Soit 102 € TTC / mois'}
                            </p>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-700">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Présence prioritaire Annuaire Pro CVC</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Attribution directe de Leads Climatisation / Gainable</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Fiche Entreprise optimisée SEO & Badge Vérifié</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Publication d'articles SEO d'entreprise illimités</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                {/* CARD 2: DIAGNOSTIC & DPE */}
                <Card 
                    className={`relative cursor-pointer transition-all border-2 ${
                        selectedPlan === 'diag' 
                            ? 'border-[#D59B2B] shadow-md bg-amber-50/10' 
                            : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setSelectedPlan('diag')}
                >
                    {selectedPlan === 'diag' && (
                        <div className="absolute -top-3 right-4 bg-[#D59B2B] text-white text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <Check className="w-3 h-3" /> Sélectionné
                        </div>
                    )}

                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                            <FileSearch className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wide">Formule Diagnostics</span>
                        </div>
                        <CardTitle className="text-xl font-bold text-[#1F2D3D]">Diagnostiqueur DPE & Audit</CardTitle>
                        <CardDescription className="text-xs text-slate-500">
                            Pour les cabinets d'audit énergétique et diagnostiqueurs immobiliers.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="border-y border-slate-100 py-3 my-2">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-[#1F2D3D]">
                                    {interval === 'yearly' ? '450 €' : '45 €'}
                                </span>
                                <span className="text-slate-500 text-xs font-medium">
                                    HT / {interval === 'yearly' ? 'an' : 'mois'}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                                {interval === 'yearly' ? 'Soit 540 € TTC / an' : 'Soit 54 € TTC / mois'}
                            </p>
                        </div>

                        <ul className="space-y-2 text-xs text-slate-700">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Référencement Annuaire Diagnostiqueurs DPE</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Demandes de devis & Audits Énergétiques</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Fiche Entreprise certifiée & contact direct</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Facturation et justificatifs en ligne</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

            </div>

            {/* ACTION FOOTER */}
            <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                <div>
                    <h3 className="font-bold text-base flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#D59B2B]" />
                        Formule sélectionnée : {selectedPlan === 'cvc' ? 'Pro CVC & Pompe à Chaleur' : 'Diagnostiqueur DPE'} ({interval === 'yearly' ? 'Annuel' : 'Mensuel'})
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                        Paiement sécurisé par Stripe. Reçu et facture téléchargeable immédiatement au format PDF.
                    </p>
                </div>
                <Button 
                    size="lg"
                    onClick={handleSubscribe} 
                    disabled={isLoading}
                    className="bg-[#D59B2B] hover:bg-[#b88322] text-white font-bold px-8 py-3 rounded-lg text-sm shrink-0 w-full md:w-auto flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirection Stripe...
                        </>
                    ) : (
                        <>
                            Payer & S'abonner
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
