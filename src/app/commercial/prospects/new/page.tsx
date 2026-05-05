"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Loader2 } from "lucide-react";

export default function NewProspect() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        nomEntreprise: "",
        nomContact: "",
        prenomContact: "",
        email: "",
        telephone: "",
        siret: "",
        adresse: "",
        siteWeb: "",
        status: "NON_CONTACTE",
        commentaire: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/commercial/prospects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push("/commercial/prospects");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || "Erreur lors de la création");
            }
        } catch (err) {
            setError("Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/commercial/prospects" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ajouter un Prospect</h1>
                    <p className="text-slate-500">Renseignez les informations de l'entreprise cible.</p>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Infos Entreprise */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Entreprise</h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nom de l'entreprise *</label>
                                <input required type="text" value={formData.nomEntreprise} onChange={e => setFormData({...formData, nomEntreprise: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">SIRET</label>
                                <input type="text" value={formData.siret} onChange={e => setFormData({...formData, siret: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500" />
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
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="NON_CONTACTE">Non contacté</option>
                                    <option value="CONTACTE">Contacté</option>
                                    <option value="INTERESSE">Intéressé</option>
                                    <option value="REFUSE">Refusé</option>
                                    <option value="NE_PLUS_DEMARCHER">Ne plus démarcher</option>
                                    {/* Vente effectuée is managed separately via the sales logic */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Commentaire libre</label>
                                <textarea 
                                    rows={3} 
                                    value={formData.commentaire} 
                                    onChange={e => setFormData({...formData, commentaire: e.target.value})} 
                                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: blocage secrétaire, à rappeler plus tard..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            Ajouter le prospect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
