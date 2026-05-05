"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, TrendingUp, AlertCircle, Search } from "lucide-react";

export default function AdminCommercialsDashboard() {
    const [commercials, setCommercials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/commercials");
                if (res.ok) {
                    const data = await res.json();
                    setCommercials(data.commercials);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Suivi des Commerciaux</h1>
                    <p className="text-slate-500">Supervisez les performances et les prospects de vos équipes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Total Commerciaux</div>
                    <div className="text-3xl font-bold mt-2 text-blue-600">{commercials.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Total Ventes Globales</div>
                    <div className="text-3xl font-bold mt-2 text-emerald-600">
                        {commercials.reduce((acc, c) => acc + c.metrics.totalSalesCount, 0)}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">CA Global Généré</div>
                    <div className="text-3xl font-bold mt-2 text-indigo-600">
                        {commercials.reduce((acc, c) => acc + c.metrics.totalCA, 0)} €
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Total Prospects</div>
                    <div className="text-3xl font-bold mt-2 text-slate-900">
                        {commercials.reduce((acc, c) => acc + c.metrics.prospectsCount, 0)}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-semibold text-slate-800">Détail par Commercial</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Identifiant</th>
                                <th className="px-6 py-3 font-semibold">CA Généré</th>
                                <th className="px-6 py-3 font-semibold">Ventes</th>
                                <th className="px-6 py-3 font-semibold">Prospects Actifs</th>
                                <th className="px-6 py-3 font-semibold text-red-600">Ne Plus Contacter</th>
                                <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">Chargement des données...</td>
                                </tr>
                            ) : commercials.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Aucun commercial trouvé.</td>
                                </tr>
                            ) : commercials.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {c.email}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        {c.metrics.totalCA} €
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {c.metrics.totalSalesCount}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {c.metrics.pendingProspects} / {c.metrics.prospectsCount}
                                    </td>
                                    <td className="px-6 py-4">
                                        {c.metrics.doNotContactCount > 0 ? (
                                            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                                                <AlertCircle className="h-4 w-4" /> {c.metrics.doNotContactCount}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">0</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* In a real app, we could link to their specific prospects list or a detailed view */}
                                        <button className="text-blue-600 hover:underline text-sm font-medium">
                                            Détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
