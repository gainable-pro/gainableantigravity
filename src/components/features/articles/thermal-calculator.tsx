'use client';

import { useState, useEffect } from 'react';
import { Calculator, Zap, ShieldCheck, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThermalCalculatorProps {
    cityName?: string;
    climateZone?: string;
}

export function ThermalCalculator({ cityName = "votre ville", climateZone = "Océanique" }: ThermalCalculatorProps) {
    const [surface, setSurface] = useState<number>(100);
    const [insulation, setInsulation] = useState<'re2020' | 'renove' | 'ancien'>('renove');

    // Calculation logic
    const coef = insulation === 're2020' ? 70 : insulation === 'renove' ? 90 : 110;
    const powerKw = (surface * coef / 1000).toFixed(1);
    const estimatedCostMin = Math.round(surface * 90 + (insulation === 're2020' ? 1000 : 2000));
    const estimatedCostMax = Math.round(estimatedCostMin * 1.25);
    const annualSavingsEuro = Math.round(surface * (insulation === 'ancien' ? 12.5 : 9.5));

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash === '#devis') {
            const timer = setTimeout(() => {
                const devisEl = document.getElementById('devis');
                if (devisEl) {
                    devisEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 600);
            return () => clearTimeout(timer);
        }
    }, []);

    const scrollToDevisForm = () => {
        const devisEl = document.getElementById('devis');
        if (devisEl) {
            devisEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Automatically transfer simulation surface into devis form input
            const surfaceInput = document.getElementById('surface') as HTMLInputElement | null;
            if (surfaceInput) {
                surfaceInput.value = String(surface);
                surfaceInput.dispatchEvent(new Event('input', { bubbles: true }));
                surfaceInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Pre-fill project description with simulation notes if empty
            const descInput = document.getElementById('description') as HTMLTextAreaElement | null;
            if (descInput && !descInput.value) {
                const insulationLabel = insulation === 're2020' ? 'Neuf RE2020' : insulation === 'renove' ? 'Rénové RT2012' : 'Ancien (> 15 ans)';
                descInput.value = `Simulation thermique réalisée sur l'article : Surface de ${surface} m², isolation ${insulationLabel}, puissance estimée à ${powerKw} kW.`;
                descInput.dispatchEvent(new Event('input', { bubbles: true }));
                descInput.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Visual highlight ring effect on the form container
            devisEl.classList.remove('ring-4', 'ring-[#D59B2B]', 'shadow-2xl');
            void devisEl.offsetWidth; // Trigger reflow
            devisEl.classList.add('ring-4', 'ring-[#D59B2B]', 'shadow-2xl', 'transition-all', 'duration-500');
            setTimeout(() => {
                devisEl.classList.remove('ring-4', 'ring-[#D59B2B]', 'shadow-2xl');
            }, 3000);

            // Focus on first input
            setTimeout(() => {
                const firstInput = (document.getElementById('lastName') || document.getElementById('phone')) as HTMLInputElement | null;
                if (firstInput) {
                    firstInput.focus();
                }
            }, 500);

            if (typeof window !== 'undefined' && window.history && window.history.pushState) {
                window.history.pushState(null, '', '#devis');
            }
        } else {
            // Fallback: jump to #devis
            window.location.hash = 'devis';
        }
    };

    const handleScrollToDevis = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        scrollToDevisForm();
    };

    return (
        <div className="my-12 bg-gradient-to-br from-slate-900 via-slate-800 to-[#1F2D3D] text-white p-8 md:p-10 rounded-3xl shadow-2xl border border-slate-700/60 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D59B2B]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D59B2B]/20 border border-[#D59B2B]/30 rounded-full text-[#D59B2B] text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles className="w-3.5 h-3.5" /> Simulateur Gainable • {cityName}
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                            Estimation Thermique & Budget <span className="text-[#D59B2B]">{cityName}</span>
                        </h3>
                    </div>
                    <div className="text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shrink-0">
                        Zone : <strong className="text-white">{climateZone}</strong>
                    </div>
                </div>

                {/* Controls */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Surface Slider */}
                    <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-200">Surface à équiper (m²)</label>
                            <span className="text-2xl font-extrabold text-[#D59B2B]">{surface} m²</span>
                        </div>
                        <input
                            type="range"
                            min="40"
                            max="250"
                            step="5"
                            value={surface}
                            onChange={(e) => setSurface(Number(e.target.value))}
                            className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#D59B2B]"
                        />
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>40 m² (T2/T3)</span>
                            <span>120 m² (Maison)</span>
                            <span>250 m² (Grande Villa)</span>
                        </div>
                    </div>

                    {/* Insulation Buttons */}
                    <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                        <label className="text-sm font-bold text-slate-200">Niveau d'isolation du logement</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setInsulation('re2020')}
                                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${insulation === 're2020' ? 'bg-[#D59B2B] text-white border-[#D59B2B] shadow-lg' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                            >
                                Neuf RE2020
                            </button>
                            <button
                                type="button"
                                onClick={() => setInsulation('renove')}
                                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${insulation === 'renove' ? 'bg-[#D59B2B] text-white border-[#D59B2B] shadow-lg' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                            >
                                Rénové RT2012
                            </button>
                            <button
                                type="button"
                                onClick={() => setInsulation('ancien')}
                                className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${insulation === 'ancien' ? 'bg-[#D59B2B] text-white border-[#D59B2B] shadow-lg' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'}`}
                            >
                                Ancien (&gt; 15 ans)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-700/60">
                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase">
                            <Zap className="w-4 h-4 text-[#D59B2B]" /> Puissance Conseillée
                        </div>
                        <div className="text-2xl font-black text-white">{powerKw} kW</div>
                        <p className="text-[11px] text-slate-400">Dimensionnement Inverter optimal</p>
                    </div>

                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase">
                            <Calculator className="w-4 h-4 text-[#D59B2B]" /> Budget Pose Estimé
                        </div>
                        <div className="text-2xl font-black text-[#D59B2B]">{estimatedCostMin.toLocaleString('fr-FR')} € - {estimatedCostMax.toLocaleString('fr-FR')} €</div>
                        <p className="text-[11px] text-slate-400">Matériel + Pose par artisan RGE</p>
                    </div>

                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase">
                            <TrendingDown className="w-4 h-4 text-emerald-400" /> Économies Annuelles
                        </div>
                        <div className="text-2xl font-black text-emerald-400">~{annualSavingsEuro.toLocaleString('fr-FR')} € / an</div>
                        <p className="text-[11px] text-slate-400">Par rapport au chauffage électrique</p>
                    </div>
                </div>

                {/* CTA inside Simulator */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-8 h-8 text-[#D59B2B] shrink-0" />
                        <div>
                            <div className="text-sm font-bold text-white">Obtenez une étude thermique personnalisée à {cityName}</div>
                            <div className="text-xs text-slate-400">Mise en relation directe avec les professionnels certifiés RGE du secteur</div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleScrollToDevis}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D59B2B] hover:bg-[#b88622] active:scale-95 text-white font-bold h-12 px-7 text-sm rounded-xl shadow-lg shadow-[#D59B2B]/20 transition-all cursor-pointer select-none group"
                    >
                        <span>Demander mes devis gratuits</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </div>
    );
}
