"use client";

import { useEffect, useState } from "react";
import { 
    TrendingUp, 
    Users, 
    Calendar, 
    DollarSign,
    Target,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface DashboardStats {
    dailyCount: number;
    dailyCA: number;
    dailyCommission: number;
    monthlyCount: number;
    monthlyCA: number;
    monthlyCommission: number;
    yearlyCount: number;
    yearlyCA: number;
    pendingProspects: number;
    pendingSalesCount: number;
    history: {
        date: string;
        count: number;
        level: number;
        rate: number;
        ca: number;
        commission: number;
    }[];
    isFixedRate?: boolean;
    fixedRateValue?: number;
}

export default function CommercialDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const month = selectedDate.getMonth();
                const year = selectedDate.getFullYear();
                const res = await fetch(`/api/commercial/stats?month=${month}&year=${year}`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [selectedDate]);

    const handlePrevMonth = () => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const isCurrentMonth = selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear();

    if (loading) {
        return <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 bg-slate-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
            </div>
        </div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
                <p className="text-slate-500 mt-1">Suivez vos performances et commissions en temps réel.</p>
            </div>

            {/* Daily Stats */}
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Performances du jour</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Ventes du jour" 
                    value={stats?.dailyCount || 0} 
                    icon={<Target className="h-6 w-6 text-blue-500" />}
                    trend={`${stats?.dailyCount || 0} / 5 objectifs`}
                />
                <StatCard 
                    title="CA Généré (Jour)" 
                    value={`${stats?.dailyCA || 0} € HT`} 
                    icon={<TrendingUp className="h-6 w-6 text-emerald-500" />}
                />
                <StatCard 
                    title="Commission (Jour)" 
                    value={`${stats?.dailyCommission || 0} € HT`} 
                    icon={<DollarSign className="h-6 w-6 text-amber-500" />}
                    highlight
                />
            </div>

            {/* Monthly Stats */}
            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2 mt-8">Performances du mois</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Ventes du mois" 
                    value={stats?.monthlyCount || 0} 
                    icon={<Calendar className="h-6 w-6 text-indigo-500" />}
                />
                <StatCard 
                    title="CA Généré (Mois)" 
                    value={`${stats?.monthlyCA || 0} € HT`} 
                    icon={<TrendingUp className="h-6 w-6 text-teal-500" />}
                />
                <StatCard 
                    title="Commission Estimée (Mois)" 
                    value={`${stats?.monthlyCommission || 0} € HT`} 
                    icon={<DollarSign className="h-6 w-6 text-orange-500" />}
                    highlight
                />
            </div>

            {/* Prospects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-slate-500">Prospects en attente</h3>
                        <p className="text-2xl font-bold text-slate-900 mt-2">{stats?.pendingProspects || 0}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-slate-500">Ventes en attente de validation</h3>
                        <p className="text-2xl font-bold text-orange-600 mt-2">{stats?.pendingSalesCount || 0}</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                </div>

                <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-sm text-white flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-blue-100">Besoin d'aide pour closer ?</h3>
                        <p className="mt-1 text-sm text-blue-50">Consultez nos ressources et argumentaires de vente.</p>
                    </div>
                    <a href="/commercial/resources" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                        Voir les astuces
                    </a>
                </div>
            </div>

            {/* Projection Annuelle */}
            <div className="mt-8 bg-slate-900 rounded-xl p-6 shadow-sm text-white flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">Projection & CA Annuel</h3>
                    <p className="text-slate-400 text-sm mt-1">Total généré sur l'année en cours :</p>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                    <div className="text-3xl font-black text-emerald-400">{stats?.yearlyCA || 0} € HT</div>
                    <div className="text-sm font-medium text-slate-300 mt-1">{stats?.yearlyCount || 0} ventes réalisées au total</div>
                </div>
            </div>

            {/* Historique du mois (Agenda) */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="font-semibold text-slate-800">Agenda des ventes</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded text-slate-500 transition-colors">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium w-32 text-center text-slate-700 capitalize">
                                {selectedDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                            </span>
                            <button 
                                onClick={handleNextMonth} 
                                disabled={isCurrentMonth}
                                className={`p-1 rounded transition-colors ${isCurrentMonth ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                        <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-1.5 rounded hidden md:block">Basé sur 650€ HT / vente</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Date</th>
                                <th className="px-6 py-3 font-semibold">Ventes jour</th>
                                <th className="px-6 py-3 font-semibold">Palier atteint</th>
                                <th className="px-6 py-3 font-semibold">CA Généré HT</th>
                                <th className="px-6 py-3 font-semibold text-right text-orange-600">Commission gagnée HT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {!stats?.history || stats.history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Aucune vente ce mois-ci.</td>
                                </tr>
                            ) : (
                                stats.history.map((h, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {new Date(h.date).toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 h-6 w-6 rounded-full font-bold text-xs">
                                                {h.count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            Niveau {h.level} ({h.rate}%)
                                        </td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">
                                            {h.ca} €
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-orange-600">
                                            {h.commission} €
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Grille Rappel Premium */}
            <div className="mt-12 bg-slate-900 rounded-3xl p-8 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Objectifs & Grille de Commissions</h3>
                    </div>

                    {stats?.isFixedRate ? (
                        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-4 text-center">
                            <p className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-2">Mode de calcul personnalisé</p>
                            <p className="text-3xl font-black text-white">Taux fixe à {stats.fixedRateValue}%</p>
                            <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto">
                                Votre compte bénéficie d'un taux de commission fixe personnalisé à {stats.fixedRateValue}% de la valeur de la vente (soit {650 * (stats.fixedRateValue || 17) / 100} € HT de commission par vente), indépendamment du nombre de ventes journalières.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                                {[
                                    { level: "Niveau 1", count: "1 vente/jour", rate: "10%", color: "bg-slate-800" },
                                    { level: "Niveau 2", count: "2 ventes/jour", rate: "12%", color: "bg-slate-800" },
                                    { level: "Niveau 3", count: "3 ventes/jour", rate: "13%", color: "bg-slate-800" },
                                    { level: "Niveau 4", count: "4 ventes/jour", rate: "15%", color: "bg-slate-800 border border-blue-500/30" },
                                    { level: "Niveau 5", count: "5+ ventes/jour", rate: "17%", color: "bg-blue-600", highlight: true },
                                ].map((lvl, i) => (
                                    <div key={i} className={`${lvl.color} rounded-2xl p-4 text-center transition-transform hover:scale-105`}>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{lvl.level}</p>
                                        <p className="text-xl font-black text-white">{lvl.rate}</p>
                                        <p className="text-[9px] text-slate-500 font-medium mt-1">{lvl.count}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/10 text-slate-400">
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider">Ventes / jour</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-blue-400">Commission / jour</th>
                                            <th className="px-6 py-4 font-bold uppercase tracking-wider text-emerald-400">Mensuel (20j)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white divide-y divide-white/5">
                                        {[
                                            { count: "1 vente", comm: "65 €", monthly: "1 300 €" },
                                            { count: "2 ventes", comm: "156 €", monthly: "3 120 €" },
                                            { count: "3 ventes", comm: "253,50 €", monthly: "5 070 €" },
                                            { count: "4 ventes", comm: "390 €", monthly: "7 800 €" },
                                            { count: "5 ventes", comm: "552,50 €", monthly: "11 050 €" },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-black">{row.count}</td>
                                                <td className="px-6 py-4 text-lg font-black text-blue-400">{row.comm}</td>
                                                <td className="px-6 py-4 font-black text-emerald-400">{row.monthly}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-4 italic text-center">
                                * Commissions calculées sur une base de 650€ HT / vente. Chaque journée est indépendante.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, highlight }: any) {
    return (
        <div className={`rounded-xl p-6 shadow-sm border ${highlight ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-sm font-medium ${highlight ? 'text-orange-800' : 'text-slate-500'}`}>{title}</h3>
                    <p className={`text-3xl font-bold mt-2 ${highlight ? 'text-orange-600' : 'text-slate-900'}`}>{value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${highlight ? 'bg-orange-100' : 'bg-slate-50'}`}>
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-4 text-sm font-medium text-slate-500">
                    {trend}
                </div>
            )}
        </div>
    );
}
