"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Mail, Phone, Building } from "lucide-react";

export default function ProspectsList() {
    const [prospects, setProspects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchProspects = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/commercial/prospects?search=${search}`);
            if (res.ok) {
                const data = await res.json();
                setProspects(data.prospects);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProspects();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProspects();
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "NON_CONTACTE": return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">Non contacté</span>;
            case "CONTACTE": return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">Contacté</span>;
            case "INTERESSE": return <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs font-medium">Intéressé</span>;
            case "VENTE_EFFECTUEE": return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">Vente effectuée</span>;
            case "REFUSE": return <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs font-medium">Refusé</span>;
            case "NE_PLUS_DEMARCHER": return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold border border-red-200">Ne plus démarcher</span>;
            default: return <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mes Prospects</h1>
                    <p className="text-slate-500">Gérez votre pipeline de prospection.</p>
                </div>
                <Link 
                    href="/commercial/prospects/new"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Ajouter
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Rechercher une entreprise, un contact..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors">
                            Chercher
                        </button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Entreprise</th>
                                <th className="px-6 py-3 font-semibold">Contact</th>
                                <th className="px-6 py-3 font-semibold">Statut</th>
                                <th className="px-6 py-3 font-semibold">Date d'ajout</th>
                                <th className="px-6 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Chargement...</td>
                                </tr>
                            ) : prospects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Aucun prospect trouvé. <Link href="/commercial/prospects/new" className="text-blue-600 underline">Ajoutez-en un</Link>.
                                    </td>
                                </tr>
                            ) : prospects.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 flex items-center gap-2">
                                            <Building className="h-4 w-4 text-slate-400" />
                                            {p.nomEntreprise}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-900 font-medium">{p.nomContact} {p.prenomContact}</div>
                                        <div className="flex flex-col text-slate-500 text-xs mt-1 gap-1">
                                            {p.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {p.email}</span>}
                                            {p.telephone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {p.telephone}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(p.status)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            href={`/commercial/prospects/${p.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            Gérer &rarr;
                                        </Link>
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
