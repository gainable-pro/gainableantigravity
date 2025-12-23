"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, CheckCircle2, Clock, AlertCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Article {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";
    createdAt: string;
    publishedAt?: string;
    rejectionReason?: string;
}

interface Quota {
    used: number;
    limit: number;
    remaining: number;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [quota, setQuota] = useState<Quota | null>(null);
    const [expertSlug, setExpertSlug] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const res = await fetch("/api/dashboard/articles");
            if (res.ok) {
                const data = await res.json();
                setArticles(data.articles);
                setQuota(data.quota);
                setExpertSlug(data.expertSlug);
            }
        } catch (error) {
            console.error("Failed to fetch articles", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">En ligne</Badge>;
            case "PENDING":
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">En attente</Badge>;
            case "REJECTED":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Refusé</Badge>;
            default:
                return <Badge variant="secondary">Brouillon</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Articles SEO</h1>
                    <p className="text-slate-500">Améliorez votre visibilité locale en publiant des articles d'expert.</p>
                </div>
                {/* QUOTA CARD */}
                {quota && (
                    <div className={`flex items-center gap-4 p-4 rounded-xl border ${quota.remaining === 0 ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                        <div className="text-right">
                            <div className="text-sm font-medium text-slate-500">Quota mensuel (publiés)</div>
                            <div className={`text-xl font-bold ${quota.remaining === 0 ? 'text-orange-600' : 'text-slate-800'}`}>
                                {quota.limit >= 999 ? <span className="text-green-600">Illimité</span> : `${quota.used} / ${quota.limit}`}
                            </div>
                        </div>
                        <Button asChild disabled={quota.remaining === 0} className={quota.remaining === 0 ? "opacity-50" : ""}>
                            <Link href="/dashboard/articles/new">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Rédiger
                            </Link>
                        </Button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="text-center py-20 text-slate-400">Chargement...</div>
            ) : articles.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-700">Aucun article pour le moment</h3>
                    <p className="text-slate-500 mb-6">Commencez à rédiger pour booster votre SEO local.</p>
                    <Button asChild>
                        <Link href="/dashboard/articles/new">Créer mon premier article</Link>
                    </Button>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-medium">Titre</th>
                                <th className="p-4 font-medium">Statut</th>
                                <th className="p-4 font-medium">Date de création</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {articles.map((article) => (
                                <tr key={article.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-slate-800">{article.title}</div>
                                        <div className="text-xs text-slate-400">/{article.slug}</div>
                                        {article.status === 'REJECTED' && article.rejectionReason && (
                                            <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Motif : {article.rejectionReason}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {getStatusBadge(article.status)}
                                    </td>
                                    <td className="p-4 text-slate-500">
                                        {format(new Date(article.createdAt), "d MMMM yyyy", { locale: fr })}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {article.status === 'PUBLISHED' && expertSlug && (
                                            <Button asChild variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                <Link href={`/entreprise/${expertSlug}/articles/${article.slug}`} target="_blank">
                                                    Voir
                                                </Link>
                                            </Button>
                                        )}
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/dashboard/articles/${article.id}`}>
                                                Modifier
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm("Supprimer cet article ?")) {
                                                    fetch(`/api/dashboard/articles/${article.id}`, { method: "DELETE" })
                                                        .then(res => {
                                                            if (res.ok) fetchArticles();
                                                            else alert("Erreur suppression");
                                                        });
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Supprimer
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
