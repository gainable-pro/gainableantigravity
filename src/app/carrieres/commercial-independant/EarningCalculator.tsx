"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, DollarSign, Target } from "lucide-react";

export default function EarningCalculator() {
  const [salesPerDay, setSalesPerDay] = useState(2);
  const [basketSize, setBasketSize] = useState(650);
  const daysWorked = 20;

  // Determine commission rate based on daily sales
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

  return (
    <Card className="bg-[#1F2D3D]/90 border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl text-white backdrop-blur-xl">
      <CardContent className="p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D59B2B]" /> Simulateur de Commissions
            </h3>
            <p className="text-xs text-slate-400">Estimez vos revenus en temps réel</p>
          </div>
          <Badge className="bg-[#D59B2B] hover:bg-[#D59B2B]/90 text-white font-bold px-3 py-1 text-sm border-none">
            {Math.round(rate * 100)}% de com'
          </Badge>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Sales per day */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Ventes par jour</span>
              <span className="text-[#D59B2B] font-bold text-lg">{salesPerDay} {salesPerDay > 1 ? 'ventes' : 'vente'} / jour</span>
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
            <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
              <span>1 vente (10%)</span>
              <span>2 ventes (12%)</span>
              <span>3 ventes (13%)</span>
              <span>4 ventes (15%)</span>
              <span>5+ ventes (17%)</span>
            </div>
          </div>

          {/* Average Basket */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">Panier moyen (Abonnement HT)</span>
              <span className="text-[#D59B2B] font-bold text-lg">{basketSize} € HT</span>
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
            <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
              <span>300 €</span>
              <span>650 € (Moyen)</span>
              <span>800 € (Premium)</span>
            </div>
          </div>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-700/60">
          <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CA Généré par mois</p>
            <p className="text-2xl font-black text-slate-200">{monthlyCA.toLocaleString("fr-FR")} € HT</p>
            <p className="text-[10px] text-slate-500 font-medium">soit {dailyCA.toLocaleString("fr-FR")} € HT / jour</p>
          </div>

          <div className="bg-[#D59B2B]/10 border border-[#D59B2B]/20 rounded-2xl p-4 space-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#D59B2B]/20 w-16 h-16 rounded-full -mr-8 -mt-8 blur-md transition-all group-hover:scale-150" />
            <p className="text-[10px] font-bold text-[#D59B2B] uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Votre Commission Mensuelle
            </p>
            <p className="text-3xl font-black text-emerald-400">{monthlyCommission.toLocaleString("fr-FR")} € HT</p>
            <p className="text-[10px] text-slate-400 font-medium">soit {dailyCommission.toLocaleString("fr-FR")} € HT / jour</p>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-4 text-[11px] text-slate-400 space-y-2 border border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#D59B2B] shrink-0" />
            <p className="leading-tight font-medium">
              Simulation basée sur <strong>{daysWorked} jours travaillés</strong> par mois.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="leading-tight">
              Les commissions augmentent automatiquement sur l'intégralité des ventes de la journée dès le palier franchi.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
