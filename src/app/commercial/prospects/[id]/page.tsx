"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Loader2, DollarSign, CheckCircle, Trash2 } from "lucide-react";

export default function EditProspect() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string | undefined;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [formData, setFormData] = useState({
        nomEntreprise: "",
        nomContact: "",
        prenomContact: "",
        email: "",
        telephone: "",
        siret: "",
        adresse: "",
        siteWeb: "",
        status: "",
        commentaire: ""
    });

    const [saleData, setSaleData] = useState({
        dateVente: new Date().toISOString().split("T")[0]
    });

    const [sales, setSales] = useState<any[]>([]);

    useEffect(() => {
        const fetchProspect = async () => {
            try {
                const res = await fetch(`/api/commercial/prospects/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        nomEntreprise: data.prospect.nomEntreprise || "",
                        nomContact: data.prospect.nomContact || "",
                        prenomContact: data.prospect.prenomContact || "",
                        email: data.prospect.email || "",
                        telephone: data.prospect.telephone || "",
                        siret: data.prospect.siret || "",
                        adresse: data.prospect.adresse || "",
                        siteWeb: data.prospect.siteWeb || "",
                        status: data.prospect.status || "",
                        commentaire: data.prospect.commentaire || ""
                    });
                    setSales(data.prospect.sales || []);
                } else {
                    setError("Prospect introuvable ou accès refusé.");
                }
            } catch (err) {
                setError("Erreur de chargement.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProspect();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`/api/commercial/prospects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSuccess("Prospect mis à jour avec succès.");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || "Erreur lors de la mise à jour");
            }
        } catch (err) {
            setError("Erreur serveur");
        } finally {
            setSaving(false);
        }
    };

    const handleLogSale = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`/api/commercial/sales`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prospectId: id,
                    paiementType: "EN_LIGNE",
                    dateVente: saleData.dateVente,
                    montant: 650
                })
            });

            if (res.ok) {
                setSuccess("Vente enregistrée avec succès !");
                setFormData(prev => ({ ...prev, status: "VENTE_EFFECTUEE" }));
                const data = await res.json();
                setSales([...sales, data.sale]);
            } else {
                const data = await res.json();
                setError(data.message || "Erreur lors de l'enregistrement de la vente");
            }
        } catch (err) {
            setError("Erreur serveur");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSale = async (saleId: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cette vente ?")) return;

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`/api/commercial/sales/${saleId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setSuccess("Vente supprimée avec succès.");
                setSales(sales.filter(s => s.id !== saleId));
            } else {
                const data = await res.json();
                setError(data.message || "Erreur lors de la suppression");
            }
        } catch (err) {
            setError("Erreur serveur");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="animate-pulse space-y-6 max-w-3xl mx-auto"><div className="h-8 bg-slate-200 rounded w-1/3"></div><div className="h-64 bg-slate-200 rounded-xl"></div></div>;
    }

    if (error && !formData.nomEntreprise) {
        return <div className="max-w-3xl mx-auto p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/commercial/prospects" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{formData.nomEntreprise}</h1>
                    <p className="text-slate-500">Gérez ce prospect ou déclarez une vente.</p>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
            {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-2"><CheckCircle className="h-5 w-5" /> {success}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Infos Entreprise */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Entreprise</h2>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise *</label>
                                    <input required type="text" value={formData.nomEntreprise} onChange={e => setFormData({...formData, nomEntreprise: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">SIRET *</label>
                                    <input required type="text" value={formData.siret} onChange={e => setFormData({...formData, siret: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                                    <input type="text" value={formData.adresse} onChange={e => setFormData({...formData, adresse: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Site Web</label>
                                    <input type="text" value={formData.siteWeb} onChange={e => setFormData({...formData, siteWeb: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" placeholder="ex: www.gainable.fr" />
                                </div>
                            </div>

                            {/* Infos Contact */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Contact</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
                                        <input required type="text" value={formData.nomContact} onChange={e => setFormData({...formData, nomContact: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                                        <input type="text" value={formData.prenomContact} onChange={e => setFormData({...formData, prenomContact: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                                    <input type="text" value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6 space-y-4">
                            <h2 className="text-lg font-semibold text-slate-800">Suivi</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                                    <select 
                                        value={formData.status} 
                                        onChange={e => setFormData({...formData, status: e.target.value})} 
                                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${formData.status === 'NE_PLUS_DEMARCHER' ? 'bg-red-50 text-red-700 border-red-300 font-bold' : 'border-slate-300'}`}
                                        disabled={formData.status === "VENTE_EFFECTUEE"} // Empêcher le changement si vente actée
                                    >
                                        <option value="NON_CONTACTE">Non contacté</option>
                                        <option value="CONTACTE">Contacté</option>
                                        <option value="INTERESSE">Intéressé</option>
                                        <option value="REFUSE">Refusé</option>
                                        <option value="VENTE_EFFECTUEE" disabled>Vente effectuée</option>
                                        <option value="NE_PLUS_DEMARCHER">Ne plus démarcher</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Commentaire libre</label>
                                    <textarea 
                                        rows={3} 
                                        value={formData.commentaire} 
                                        onChange={e => setFormData({...formData, commentaire: e.target.value})} 
                                        className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-lg hover:bg-slate-900 transition-colors font-medium disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                Enregistrer les modifications
                            </button>
                        </div>
                    </form>
                </div>

                {/* Section Vente */}
                <div className="space-y-6">
                    <div className="bg-emerald-50 rounded-xl shadow-sm border border-emerald-100 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <h2 className="text-lg font-bold text-emerald-800">Déclarer une vente</h2>
                        </div>
                        
                        <form onSubmit={handleLogSale} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-emerald-900 mb-1">Date de la vente</label>
                                <input 
                                    type="date" 
                                    required
                                    value={saleData.dateVente}
                                    onChange={e => setSaleData({...saleData, dateVente: e.target.value})}
                                    className="w-full p-2 border border-emerald-200 rounded focus:ring-2 focus:ring-emerald-500 bg-white" 
                                />
                            </div>
                            <div className="bg-white/50 rounded p-3 text-sm text-emerald-900 border border-emerald-200/50">
                                <div className="flex justify-between mb-1">
                                    <span>Montant de l'abonnement :</span>
                                    <span className="font-bold">650 € HT</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Méthode de paiement :</span>
                                    <span className="font-bold">Via le site internet</span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={saving || sales.length > 0}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-bold mt-2 ${
                                    sales.length > 0 
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                                }`}
                            >
                                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                                {sales.length > 0 ? "Vente déjà enregistrée" : "Valider la vente"}
                            </button>
                        </form>
                    </div>

                    {sales.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Ventes réalisées ({sales.length})</h3>
                            <div className="space-y-3">
                                {sales.map((sale: any, idx: number) => (
                                    <div key={sale.id || idx} className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm relative group">
                                        <div className="flex justify-between font-medium text-slate-900 pr-10">
                                            <span>{sale.montant} € HT</span>
                                            <span>{new Date(sale.dateVente).toLocaleDateString("fr-FR")}</span>
                                        </div>
                                        <div className="text-slate-500 mt-1">
                                            Paiement en ligne via le site
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteSale(sale.id)}
                                            className="absolute top-1/2 -translate-y-1/2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Supprimer la vente"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
