"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, DollarSign, Target, RefreshCw } from "lucide-react";

export default function EarningCalculator() {
  const [salesPerDay, setSalesPerDay] = useState(2);
  const [basketSize, setBasketSize] = useState(750); // 750€ HT or 850€ HT
  const daysWorked = 20;

  // Fixed 17% HT direct commission
  const rate = 0.17;
  
  const dailyCA = salesPerDay * basketSize;
  const dailyCommission = dailyCA * rate;
  const monthlyCommission = dailyCommission * daysWorked;
  const monthlyCA = dailyCA * daysWorked;

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
            <p className="text-xs text-slate-400">Taux Fixe 17% HT + 12% Récurrent Annuel</p>
          </div>
          <Badge className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-bold px-3.5 py-1 text-sm border-none shadow-md">
            17% HT Fixe
          </Badge>
        </div>

        {/* Formule selector & Sales per day */}
        <div className="space-y-5">
          {/* Abonnement Tier Selection: 750 € HT vs 850 € HT */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Formule Abonnement (Panier HT)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBasketSize(750)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  basketSize === 750
                    ? 'bg-[#D59B2B] text-white border-[#D59B2B] font-black shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 font-semibold'
                }`}
              >
                <span className="block text-lg">750 € HT</span>
                <span className="text-[10px] opacity-80 block font-normal">Formule Standard</span>
              </button>

              <button
                type="button"
                onClick={() => setBasketSize(850)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  basketSize === 850
                    ? 'bg-[#D59B2B] text-white border-[#D59B2B] font-black shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 font-semibold'
                }`}
              >
                <span className="block text-lg">850 € HT</span>
                <span className="text-[10px] opacity-80 block font-normal">Formule Premium</span>
              </button>
            </div>
          </div>

          {/* Sales per day slider */}
          <div className="space-y-2.5 pt-1">
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
              <span>1 vente / j</span>
              <span>2 ventes / j</span>
              <span>3 ventes / j</span>
              <span>4 ventes / j</span>
              <span>5+ ventes / j</span>
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
                <TrendingUp className="w-3.5 h-3.5" /> Commission Directe (17% Fixe)
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
              Chaque abonnement renouvelé en année 2 vous génère {(basketSize * renewalRate).toLocaleString("fr-FR")} € HT de commission récurrente.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/70 rounded-2xl p-3.5 text-[11px] text-slate-300 space-y-1.5 border border-slate-700/60">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#D59B2B] shrink-0" />
            <p className="leading-tight font-medium">
              Taux fixe de <strong>17% HT dès la 1ère vente</strong> (soit {(basketSize * rate).toLocaleString("fr-FR")} € HT / vente).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-tight">
              Simulation basée sur <strong>{daysWorked} jours travaillés / mois</strong> sur la formule {basketSize} € HT.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
