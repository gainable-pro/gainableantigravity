"use client";

import { useEffect, useState } from "react";
import { 
    TrendingUp, 
    Users, 
    Calendar, 
    DollarSign,
    Target,
    AlertCircle
} from "lucide-react";

interface DashboardStats {
    dailyCount: number;
    dailyCA: number;
    dailyCommission: number;
    monthlyCount: number;
    monthlyCA: number;
    monthlyCommission: number;
    pendingProspects: number;
}

export default function CommercialDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/commercial/stats");
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
    }, []);

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
                    value={`${stats?.dailyCA || 0} €`} 
                    icon={<TrendingUp className="h-6 w-6 text-emerald-500" />}
                />
                <StatCard 
                    title="Commission (Jour)" 
                    value={`${stats?.dailyCommission || 0} €`} 
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
                    value={`${stats?.monthlyCA || 0} €`} 
                    icon={<TrendingUp className="h-6 w-6 text-teal-500" />}
                />
                <StatCard 
                    title="Commission Estimée (Mois)" 
                    value={`${stats?.monthlyCommission || 0} €`} 
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

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 shadow-sm text-white flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-blue-100">Besoin d'aide pour closer ?</h3>
                        <p className="mt-1 text-sm text-blue-50">Consultez nos ressources et argumentaires de vente.</p>
                    </div>
                    <a href="/commercial/resources" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                        Voir les astuces
                    </a>
                </div>
            </div>
            
            {/* Grille Rappel */}
            <div className="mt-12 bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Rappel de la grille de commissions journalière
                </h3>
                <div className="grid grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-white rounded shadow-sm border border-slate-100">
                        <div className="text-xs text-slate-500">1 Vente</div>
                        <div className="font-bold text-blue-600">10%</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded shadow-sm border border-slate-100">
                        <div className="text-xs text-slate-500">2 Ventes</div>
                        <div className="font-bold text-blue-600">12%</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded shadow-sm border border-slate-100">
                        <div className="text-xs text-slate-500">3 Ventes</div>
                        <div className="font-bold text-blue-600">13%</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded shadow-sm border border-slate-100">
                        <div className="text-xs text-slate-500">4 Ventes</div>
                        <div className="font-bold text-blue-600">15%</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded shadow-sm border border-blue-200">
                        <div className="text-xs text-slate-500">5+ Ventes</div>
                        <div className="font-bold text-blue-700">17%</div>
                    </div>
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
