"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, DollarSign, Target, Clock, Award, CheckCircle2 } from "lucide-react";

type CommissionTier = "debutant" | "confirme" | "expert";

export default function EarningCalculator() {
  const [tier, setTier] = useState<CommissionTier>("expert");
  const [salesPerDay, setSalesPerDay] = useState(2);
  const [basketSize, setBasketSize] = useState(1200); // 1200€ HT default (Formule Premium)
  const daysWorked = 20;

  const tierRates: Record<CommissionTier, { rate: number; label: string; badgeColor: string }> = {
    debutant: { rate: 0.10, label: "Débutant", badgeColor: "bg-emerald-600" },
    confirme: { rate: 0.13, label: "Confirmé", badgeColor: "bg-blue-600" },
    expert: { rate: 0.17, label: "Expert", badgeColor: "bg-[#D59B2B]" },
  };

  const currentTierInfo = tierRates[tier];
  const rate = currentTierInfo.rate;
  const ratePercent = Math.round(rate * 100);

  const unitCommission = basketSize * rate;
  const dailyCA = salesPerDay * basketSize;
  const dailyCommission = dailyCA * rate;
  const monthlyCA = dailyCA * daysWorked;
  const monthlyCommission = dailyCommission * daysWorked;

  return (
    <Card className="bg-[#1F2D3D]/95 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl text-white backdrop-blur-xl">
      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D59B2B]" /> Simulateur de Rémunération
            </h3>
            <p className="text-xs text-slate-400">Paliers Débutant (10%), Confirmé (13%) & Expert (17%)</p>
          </div>
          <Badge className={`${currentTierInfo.badgeColor} text-white font-black px-3.5 py-1 text-sm border-none shadow-md transition-colors`}>
            {ratePercent}% HT ({currentTierInfo.label})
          </Badge>
        </div>

        {/* 1. Palier Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Choisissez votre Palier de Commission
            </label>
            <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Réévaluation au bout de 1 mois
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setTier("debutant")}
              className={`p-3 rounded-2xl border text-center transition-all ${
                tier === "debutant"
                  ? "bg-emerald-600 text-white border-emerald-500 font-black shadow-lg scale-[1.02]"
                  : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 font-semibold"
              }`}
            >
              <span className="block text-base md:text-lg font-black">10% HT</span>
              <span className="text-[10px] opacity-90 block font-normal">Débutant</span>
            </button>

            <button
              type="button"
              onClick={() => setTier("confirme")}
              className={`p-3 rounded-2xl border text-center transition-all ${
                tier === "confirme"
                  ? "bg-blue-600 text-white border-blue-500 font-black shadow-lg scale-[1.02]"
                  : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 font-semibold"
              }`}
            >
              <span className="block text-base md:text-lg font-black">13% HT</span>
              <span className="text-[10px] opacity-90 block font-normal">Confirmé</span>
            </button>

            <button
              type="button"
              onClick={() => setTier("expert")}
              className={`p-3 rounded-2xl border text-center transition-all ${
                tier === "expert"
                  ? "bg-[#D59B2B] text-white border-[#D59B2B] font-black shadow-lg scale-[1.02]"
                  : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 font-semibold"
              }`}
            >
              <span className="block text-base md:text-lg font-black">17% HT</span>
              <span className="text-[10px] opacity-90 block font-normal">Expert</span>
            </button>
          </div>
        </div>

        {/* 2. Formule selector & Sales per day */}
        <div className="space-y-5">
          {/* Abonnement Tier Selection: 750 € HT vs 1 200 € HT */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Formule Abonnement (Panier HT)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBasketSize(750)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  basketSize === 750
                    ? "bg-[#D59B2B] text-white border-[#D59B2B] font-black shadow-lg scale-[1.02]"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 font-semibold"
                }`}
              >
                <span className="block text-lg">750 € HT</span>
                <span className="text-[10px] opacity-80 block font-normal">Formule Standard (Diag Immo)</span>
              </button>

              <button
                type="button"
                onClick={() => setBasketSize(1200)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  basketSize === 1200
                    ? "bg-[#D59B2B] text-white border-[#D59B2B] font-black shadow-lg scale-[1.02]"
                    : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500 font-semibold"
                }`}
              >
                <span className="block text-lg">1 200 € HT</span>
                <span className="text-[10px] opacity-80 block font-normal">Formule Premium (Expert CVC)</span>
              </button>
            </div>
          </div>

          {/* Sales per day slider */}
          <div className="space-y-2.5 pt-1">
            <div className="flex justify-between text-sm font-semibold">
              <span className="text-slate-300">3. Ventes réalisées par jour</span>
              <span className="text-[#D59B2B] font-bold text-base">{salesPerDay} {salesPerDay > 1 ? "ventes" : "vente"} / jour</span>
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
              <p className="text-[10px] text-slate-400 font-medium">soit {dailyCA.toLocaleString("fr-FR")} € HT / jour ({salesPerDay * daysWorked} ventes/mois)</p>
            </div>

            <div className="bg-[#D59B2B]/10 border border-[#D59B2B]/30 rounded-2xl p-4 space-y-1 relative overflow-hidden group">
              <p className="text-[10px] font-bold text-[#D59B2B] uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Commission Directe ({ratePercent}% {currentTierInfo.label})
              </p>
              <p className="text-2xl font-black text-emerald-400">{monthlyCommission.toLocaleString("fr-FR")} € HT</p>
              <p className="text-[10px] text-slate-300 font-medium">
                soit {dailyCommission.toLocaleString("fr-FR")} € HT / jour ({unitCommission.toLocaleString("fr-FR")} € HT / vente)
              </p>
            </div>
          </div>
        </div>

        {/* Explanation Card (Profile, Experience & 1-month revaluation) */}
        <div className="bg-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 space-y-2.5 border border-slate-700/80">
          <div className="flex items-start gap-2.5">
            <Award className="w-4 h-4 text-[#D59B2B] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Taux selon profil & expérience :</strong> Le pourcentage initial (<strong>10% Débutant</strong>, <strong>13% Confirmé</strong> ou <strong>17% Expert</strong>) est attribué lors de votre intégration selon votre expérience commerciale préalable.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Réévaluation au bout de 1 mois :</strong> Votre palier de commission fait l'objet d'un point d'étape systématique après 30 jours d'activité. Vos résultats et votre assiduité CRM vous permettent de passer rapidement au palier supérieur (Confirmé à 13% puis Expert à 17%).
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <DollarSign className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Simulation calculée sur une base de <strong>{daysWorked} jours travaillés / mois</strong> sur la formule de {basketSize} € HT.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
