"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Users, TrendingUp, DollarSign, Calendar, Clock, LogIn,
    CheckCircle2, XCircle, AlertCircle, RefreshCw, Search,
    Eye, BarChart3, Filter, Award, Activity, Phone, Shield, ArrowUpRight
} from "lucide-react";

interface CommercialSalesItem {
    id: string;
    montant: number;
    dateVente: string;
    status: string;
    paiementType: string;
    prospectName: string;
}

interface CommercialProspectItem {
    id: string;
    nomEntreprise: string;
    contact: string;
    status: string;
    updatedAt: string;
}

interface CommercialItem {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
    statutLegal?: string | null;
    siren?: string | null;
    createdAt: string;
    lastLoginAt?: string | null;
    lastActiveAt?: string | null;
    activeStatus: "connected_today" | "connected_this_week" | "inactive";
    isActiveToday: boolean;
    hasVerifiedProspectsToday: boolean;
    prospectsCount: number;
    salesAmount: number;
    salesCount: number;
    conversionRate: number;
    prospectsByStatus: {
        NON_CONTACTE: number;
        CONTACTE: number;
        INTERESSE: number;
        VENTE_EFFECTUEE: number;
        REFUSE: number;
        NE_PLUS_DEMARCHER: number;
    };
    sales: CommercialSalesItem[];
    recentProspects: CommercialProspectItem[];
}

interface DashboardSummary {
    totalCommercials: number;
    activeTodayCount: number;
    totalSalesAmount: number;
    totalSalesCount: number;
    totalProspectsAssigned: number;
    globalConversionRate: number;
}

export default function CommercialDashboard() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [commercials, setCommercials] = useState<CommercialItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedCommercial, setSelectedCommercial] = useState<CommercialItem | null>(null);
    const [impersonatingId, setImpersonatingId] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/commercial-activity");
            if (res.ok) {
                const data = await res.json();
                setSummary(data.summary);
                setCommercials(data.commercials);
            }
        } catch (e) {
            console.error("Error fetching commercial activity data:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImpersonate = async (userId: string) => {
        setImpersonatingId(userId);
        try {
            const res = await fetch("/api/admin/impersonate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (res.ok) {
                window.location.href = data.redirectUrl || "/commercial";
            } else {
                alert("Erreur de connexion : " + (data.message || "Erreur inconnue"));
            }
        } catch (e) {
            alert("Erreur technique");
        } finally {
            setImpersonatingId(null);
        }
    };

    const filteredCommercials = commercials.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch) return false;

        if (statusFilter === "active_today") return c.activeStatus === "connected_today";
        if (statusFilter === "active_week") return c.activeStatus === "connected_this_week";
        if (statusFilter === "inactive") return c.activeStatus === "inactive";

        return true;
    });

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "Aucune connexion enregistrée";
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    // Calculate chart data for maximum revenue per commercial
    const maxSales = Math.max(...commercials.map(c => c.salesAmount), 1000);

    return (
        <div className="space-y-6">
            {/* Upper Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        Suivi Commerciaux & Performance
                        <Badge className="bg-blue-600 text-white font-bold text-xs select-none">CRM Live</Badge>
                    </h2>
                    <p className="text-sm text-slate-500">
                        Vue d'ensemble sur l'activité des commerciaux, ventes réalisées, attribution des contacts et assiduité de connexion.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={fetchData}
                        disabled={loading}
                        variant="outline"
                        className="flex items-center gap-2 text-xs font-semibold"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Rafraîchir les données
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                {/* CA Total */}
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase text-slate-300 tracking-wider">
                            Chiffre d'Affaires Réalisé
                        </CardTitle>
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-400">
                            {formatCurrency(summary?.totalSalesAmount || 0)}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                            <Badge variant="outline" className="border-emerald-500 text-emerald-400 bg-emerald-950/40">
                                {summary?.totalSalesCount || 0} ventes validées
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Effectif & Connexions aujourd'hui */}
                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                            Commerciaux Connectés
                        </CardTitle>
                        <Users className="w-5 h-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {summary?.activeTodayCount || 0} <span className="text-sm font-normal text-slate-500">/ {summary?.totalCommercials || 0}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-light">
                            {summary?.totalCommercials ? Math.round(((summary.activeTodayCount || 0) / summary.totalCommercials) * 100) : 0}% de l'équipe active aujourd'hui
                        </p>
                    </CardContent>
                </Card>

                {/* Contacts Attribués */}
                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                            Contacts Attribués
                        </CardTitle>
                        <Award className="w-5 h-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {summary?.totalProspectsAssigned || 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-light">
                            Taux de conversion global : <span className="font-bold text-amber-600">{summary?.globalConversionRate || 0}%</span>
                        </p>
                    </CardContent>
                </Card>

                {/* Taux d'assiduité */}
                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                            Assiduité & Suivi CRM
                        </CardTitle>
                        <Activity className="w-5 h-5 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">
                            {commercials.filter(c => c.hasVerifiedProspectsToday).length}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-light">
                            Commerciaux ayant mis à jour leurs dossiers aujourd'hui
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Visual Charts & Performance Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Sales distribution per commercial */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-600" />
                            Palmarès des Ventes par Commercial (€)
                        </CardTitle>
                        <CardDescription>Comparatif du chiffre d'affaires généré</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {commercials.length === 0 ? (
                            <p className="text-sm text-slate-400 italic py-4">Aucun commercial trouvé.</p>
                        ) : (
                            commercials.map((c) => {
                                const percent = Math.min(100, Math.round((c.salesAmount / maxSales) * 100));
                                return (
                                    <div key={c.id} className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className="text-slate-800 font-semibold">{c.name}</span>
                                            <span className="text-slate-900 font-bold">{formatCurrency(c.salesAmount)} ({c.salesCount} ventes)</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${c.salesAmount > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* Connection Activity Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            Répartition de l'Activité & Connexions
                        </CardTitle>
                        <CardDescription>Assiduité de présence sur l'espace commercial</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                                <div className="text-xl font-bold text-emerald-700">
                                    {commercials.filter(c => c.activeStatus === "connected_today").length}
                                </div>
                                <div className="text-xs text-emerald-800 font-medium mt-1">Connectés Aujourd'hui</div>
                            </div>
                            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="text-xl font-bold text-amber-700">
                                    {commercials.filter(c => c.activeStatus === "connected_this_week").length}
                                </div>
                                <div className="text-xs text-amber-800 font-medium mt-1">Vu cette semaine</div>
                            </div>
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                                <div className="text-xl font-bold text-rose-700">
                                    {commercials.filter(c => c.activeStatus === "inactive").length}
                                </div>
                                <div className="text-xs text-rose-800 font-medium mt-1">Inactifs (&gt; 7j)</div>
                            </div>
                        </div>

                        {/* Recent Activity Highlight */}
                        <div className="border-t pt-3 space-y-2">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut des consultations</h4>
                            {commercials.map(c => (
                                <div key={c.id} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${c.activeStatus === 'connected_today' ? 'bg-emerald-500 animate-pulse' : c.activeStatus === 'connected_this_week' ? 'bg-amber-500' : 'bg-rose-400'}`} />
                                        <span className="font-medium text-slate-700">{c.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={c.hasVerifiedProspectsToday ? "bg-emerald-50 text-emerald-700 border-emerald-300" : "bg-slate-50 text-slate-500 border-slate-200"}>
                                            {c.hasVerifiedProspectsToday ? "✓ Dossiers vérifiés aujourd'hui" : "Pas d'action aujourd'hui"}
                                        </Badge>
                                        <span className="text-slate-400 text-[11px] font-mono">{formatDate(c.lastActiveAt)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Commercial Table */}
            <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-900">Tableau d'Assiduité et de Performance Commerciale</CardTitle>
                        <CardDescription>Suivi détaillé par agent commercial avec métriques de connexion et conversion</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <Input
                                placeholder="Rechercher un commercial..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-[220px] text-xs"
                            />
                        </div>
                        <div className="flex border rounded-md overflow-hidden bg-slate-50 text-xs">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`px-3 py-1.5 font-medium transition-all ${statusFilter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"}`}
                            >
                                Tous ({commercials.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter("active_today")}
                                className={`px-3 py-1.5 font-medium transition-all ${statusFilter === "active_today" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-slate-900"}`}
                            >
                                Connectés Aujourd'hui
                            </button>
                            <button
                                onClick={() => setStatusFilter("inactive")}
                                className={`px-3 py-1.5 font-medium transition-all ${statusFilter === "inactive" ? "bg-rose-600 text-white" : "text-slate-600 hover:text-slate-900"}`}
                            >
                                Inactifs
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-600">Commercial</th>
                                    <th className="p-4 font-semibold text-slate-600">Statut Connexion & Assiduité</th>
                                    <th className="p-4 font-semibold text-slate-600 text-center">Contacts Attribués</th>
                                    <th className="p-4 font-semibold text-slate-600 text-center">Ventes Validées</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">CA Réalisé</th>
                                    <th className="p-4 font-semibold text-slate-600 text-center">Taux Conv.</th>
                                    <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-500">
                                            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                                            Chargement des métriques commerciales...
                                        </td>
                                    </tr>
                                ) : filteredCommercials.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                                            Aucun commercial ne correspond au filtre sélectionné.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCommercials.map((c) => (
                                        <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50/70 transition-colors">
                                            {/* Name & Info */}
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900 flex items-center gap-2">
                                                    {c.name}
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono">{c.email}</div>
                                                {c.phone && (
                                                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <Phone className="w-3 h-3" /> {c.phone}
                                                    </div>
                                                )}
                                                <div className="text-[11px] text-amber-700 font-medium mt-1">
                                                    {c.statutLegal || "Commercial"}
                                                </div>
                                            </td>

                                            {/* Connection Status & Daily Check-in */}
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    {c.activeStatus === "connected_today" ? (
                                                        <Badge className="bg-emerald-600 text-white font-bold flex items-center gap-1.5 w-max">
                                                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                                            Connecté Aujourd'hui
                                                        </Badge>
                                                    ) : c.activeStatus === "connected_this_week" ? (
                                                        <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-800 font-semibold w-max">
                                                            Actif cette semaine
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="border-rose-300 bg-rose-50 text-rose-700 font-semibold w-max">
                                                            Inactif (&gt; 7 jours)
                                                        </Badge>
                                                    )}
                                                    <div className="text-xs text-slate-500 font-mono">
                                                        Dernière activité : <span className="font-semibold text-slate-700">{formatDate(c.lastActiveAt)}</span>
                                                    </div>
                                                    <div className="text-[11px]">
                                                        {c.hasVerifiedProspectsToday ? (
                                                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Consultation journalière validée
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400 flex items-center gap-1">
                                                                <XCircle className="w-3.5 h-3.5 text-slate-300" /> Pas de modif aujourd'hui
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contacts Assigned */}
                                            <td className="p-4 text-center">
                                                <div className="text-base font-bold text-slate-900">{c.prospectsCount}</div>
                                                <div className="text-xs text-slate-500 mt-0.5">
                                                    {c.prospectsByStatus.NON_CONTACTE} non contactés • {c.prospectsByStatus.CONTACTE + c.prospectsByStatus.INTERESSE} en cours
                                                </div>
                                            </td>

                                            {/* Sales Count */}
                                            <td className="p-4 text-center">
                                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-1">
                                                    {c.salesCount} vente{c.salesCount > 1 ? 's' : ''}
                                                </Badge>
                                            </td>

                                            {/* Sales Revenue */}
                                            <td className="p-4 text-right">
                                                <div className="text-base font-extrabold text-emerald-600 font-mono">
                                                    {formatCurrency(c.salesAmount)}
                                                </div>
                                            </td>

                                            {/* Conversion Rate */}
                                            <td className="p-4 text-center">
                                                <Badge className={`font-mono text-xs ${c.conversionRate > 20 ? 'bg-emerald-600' : c.conversionRate > 0 ? 'bg-blue-600' : 'bg-slate-400'}`}>
                                                    {c.conversionRate}%
                                                </Badge>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setSelectedCommercial(c)}
                                                    className="border-slate-300 hover:bg-slate-100 text-xs font-semibold"
                                                    title="Voir l'historique et les dossiers"
                                                >
                                                    <Eye className="w-3.5 h-3.5 mr-1" /> Détail
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
                                                    onClick={() => handleImpersonate(c.id)}
                                                    disabled={impersonatingId === c.id}
                                                    title="Se connecter à son espace commercial CRM"
                                                >
                                                    <LogIn className="w-3.5 h-3.5 mr-1" /> Espace
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Commercial Modal View */}
            {selectedCommercial && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-900">
                                    Fiche d'Activité : {selectedCommercial.name}
                                </CardTitle>
                                <CardDescription className="font-mono text-xs text-slate-500">
                                    {selectedCommercial.email} • Inscrit le {new Date(selectedCommercial.createdAt).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCommercial(null)}
                                className="text-slate-400 hover:text-slate-700 font-bold"
                            >
                                ✕ Fermer
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            {/* Summary Cards inside Modal */}
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-slate-50 border rounded-lg">
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Chiffre d'Affaires</div>
                                    <div className="text-xl font-extrabold text-emerald-600 font-mono mt-1">
                                        {formatCurrency(selectedCommercial.salesAmount)}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">{selectedCommercial.salesCount} ventes</div>
                                </div>

                                <div className="p-3 bg-slate-50 border rounded-lg">
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Dossiers Attribués</div>
                                    <div className="text-xl font-extrabold text-slate-900 mt-1">
                                        {selectedCommercial.prospectsCount}
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5">Taux conv: {selectedCommercial.conversionRate}%</div>
                                </div>

                                <div className="p-3 bg-slate-50 border rounded-lg">
                                    <div className="text-xs text-slate-500 uppercase font-semibold">Dernière Activité</div>
                                    <div className="text-xs font-bold text-slate-800 mt-2 font-mono">
                                        {formatDate(selectedCommercial.lastActiveAt)}
                                    </div>
                                    <div className="text-xs mt-1">
                                        {selectedCommercial.hasVerifiedProspectsToday ? (
                                            <Badge className="bg-emerald-600 text-white text-[10px]">Présence Aujourd'hui</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-[10px]">Inactif aujourd'hui</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Prospects Breakdown */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-2">Statut des Contacts en Portefeuille</h4>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="p-2 border rounded bg-slate-50 flex justify-between">
                                        <span>Non contactés :</span>
                                        <span className="font-bold text-slate-700">{selectedCommercial.prospectsByStatus.NON_CONTACTE}</span>
                                    </div>
                                    <div className="p-2 border rounded bg-blue-50 border-blue-200 flex justify-between">
                                        <span>Contactés :</span>
                                        <span className="font-bold text-blue-700">{selectedCommercial.prospectsByStatus.CONTACTE}</span>
                                    </div>
                                    <div className="p-2 border rounded bg-amber-50 border-amber-200 flex justify-between">
                                        <span>Intéressés :</span>
                                        <span className="font-bold text-amber-700">{selectedCommercial.prospectsByStatus.INTERESSE}</span>
                                    </div>
                                    <div className="p-2 border rounded bg-emerald-50 border-emerald-200 flex justify-between">
                                        <span>Ventes effectuées :</span>
                                        <span className="font-bold text-emerald-700">{selectedCommercial.prospectsByStatus.VENTE_EFFECTUEE}</span>
                                    </div>
                                    <div className="p-2 border rounded bg-rose-50 border-rose-200 flex justify-between">
                                        <span>Refusés :</span>
                                        <span className="font-bold text-rose-700">{selectedCommercial.prospectsByStatus.REFUSE}</span>
                                    </div>
                                    <div className="p-2 border rounded bg-slate-100 flex justify-between">
                                        <span>Ne plus démarcher :</span>
                                        <span className="font-bold text-slate-600">{selectedCommercial.prospectsByStatus.NE_PLUS_DEMARCHER}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sales History List */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-2">Historique des Ventes</h4>
                                {selectedCommercial.sales.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic border rounded p-3 text-center">Aucune vente enregistrée pour le moment.</p>
                                ) : (
                                    <div className="border rounded overflow-hidden text-xs">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b">
                                                <tr>
                                                    <th className="p-2 font-semibold">Prospect</th>
                                                    <th className="p-2 font-semibold">Date</th>
                                                    <th className="p-2 font-semibold">Paiement</th>
                                                    <th className="p-2 font-semibold text-right">Montant</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedCommercial.sales.map(s => (
                                                    <tr key={s.id} className="border-b last:border-0">
                                                        <td className="p-2 font-medium">{s.prospectName}</td>
                                                        <td className="p-2 text-slate-500 font-mono">{new Date(s.dateVente).toLocaleDateString()}</td>
                                                        <td className="p-2 text-slate-600">{s.paiementType}</td>
                                                        <td className="p-2 text-right font-bold text-emerald-600 font-mono">{formatCurrency(s.montant)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Action Bar */}
                            <div className="border-t pt-4 flex justify-end gap-3">
                                <Button variant="outline" size="sm" onClick={() => setSelectedCommercial(null)}>
                                    Fermer
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                    onClick={() => handleImpersonate(selectedCommercial.id)}
                                >
                                    <LogIn className="w-4 h-4 mr-1.5" /> Se connecter à son Espace Commercial
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
