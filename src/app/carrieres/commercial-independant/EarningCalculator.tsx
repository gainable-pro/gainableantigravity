"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, DollarSign, Target, RefreshCw } from "lucide-react";

export default function EarningCalculator() {
  const [salesPerDay, setSalesPerDay] = useState(2);
  const [basketSize, setBasketSize] = useState(650);
  const daysWorked = 20;

  // Determine direct commission rate based on daily sales
  const getCommissionRate = (sales: number) => {
    if (sales >= 5) return 0.17;
    if (sales === 4) return 0.15;
    if (sales === 3) return 0.13;
    if (sales === 2) return 0.12;
    return 0.10;
  };

  const rate = getCommissionRate(salesPerDay);
  const dailyCA = salesPerDay * basketSize;
  const dailyCommission = dailyCA * rate;
  const monthlyCommission = dailyCommission * daysWorked;
  const monthlyCA = dailyCA * daysWorked;
  const annualCommission = monthlyCommission * 12;

  // 12% renewal recurring commission on 2nd year
  const renewalRate = 0.12;
  const annualRenewalRecurring = (monthlyCA * 12) * renewalRate;

  return (
    <Card className="bg-[#1F2D3D]/95 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl text-white backdrop-blur-xl">
      <CardContent className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D59B2B]" /> Simulateur de Rémunération
            </h3>
            <p className="text-xs text-slate-400">Commissions Directes + Récurrent Annuel 12%</p>
          </div>
          <Badge className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-bold px-3 py-1 text-sm border-none shadow-md">
            Jusqu'à {Math.round(rate * 100)}% HT
          </Badge>
        </div>

        {/* Sliders */}
        <div className="space-y-5">
          {/* Sales per day */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Ventes par jour</span>
              <span className="text-[#D59B2B] font-bold text-base">{salesPerDay} {salesPerDay > 1 ? 'ventes' : 'vente'} / jour</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={salesPerDay}
              onChange={(e) => setSalesPerDay(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D59B2B]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
              <span>1v (10%)</span>
              <span>2v (12%)</span>
              <span>3v (13%)</span>
              <span>4v (15%)</span>
              <span className="text-[#D59B2B]">5+v (17%)</span>
            </div>
          </div>

          {/* Average Basket */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Panier moyen (Abonnement HT)</span>
              <span className="text-[#D59B2B] font-bold text-base">{basketSize} € HT</span>
            </div>
            <input
              type="range"
              min="300"
              max="800"
              step="50"
              value={basketSize}
              onChange={(e) => setBasketSize(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D59B2B]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
              <span>300 €</span>
              <span>650 € (Standard)</span>
              <span>800 € (Premium)</span>
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CA Généré par mois</p>
              <p className="text-xl font-black text-slate-200">{monthlyCA.toLocaleString("fr-FR")} € HT</p>
              <p className="text-[10px] text-slate-400 font-medium">soit {dailyCA.toLocaleString("fr-FR")} € HT / jour</p>
            </div>

            <div className="bg-[#D59B2B]/10 border border-[#D59B2B]/30 rounded-2xl p-4 space-y-1 relative overflow-hidden group">
              <p className="text-[10px] font-bold text-[#D59B2B] uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Commission Directe Mensuelle
              </p>
              <p className="text-2xl font-black text-emerald-400">{monthlyCommission.toLocaleString("fr-FR")} € HT</p>
              <p className="text-[10px] text-slate-300 font-medium">soit {dailyCommission.toLocaleString("fr-FR")} € HT / jour</p>
            </div>
          </div>

          {/* Recurring Renewal Highlight */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin-slow" /> Rente Récurrente de Renouvellement (12%)
              </p>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 text-[10px] font-bold px-2 py-0.5">
                Année 2+
              </Badge>
            </div>
            <p className="text-2xl font-black text-white">
              + {annualRenewalRecurring.toLocaleString("fr-FR")} € HT <span className="text-xs text-emerald-300 font-normal">/ an de récurrent automatique</span>
            </p>
            <p className="text-[11px] text-slate-300 leading-tight">
              Vos abonnements renouvelés en année 2 vous génèrent ~{(annualRenewalRecurring / 12).toLocaleString("fr-FR")} € HT / mois passifs complémentaires.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/70 rounded-2xl p-3.5 text-[11px] text-slate-300 space-y-1.5 border border-slate-700/60">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#D59B2B] shrink-0" />
            <p className="leading-tight font-medium">
              Simulation basée sur <strong>{daysWorked} jours travaillés / mois</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-tight">
              Commission de 10% à 17% HT sur chaque vente + 12% HT sur le renouvellement annuel.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
