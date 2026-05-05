"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, CheckCircle, User } from "lucide-react";

export default function CommercialProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        siren: "",
        statutLegal: "",
        telephone: "",
        adresse: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/commercial/profile");
                if (res.ok) {
                    const data = await res.json();
                    if (data.profile) {
                        setFormData({
                            nom: data.profile.nom || "",
                            prenom: data.profile.prenom || "",
                            siren: data.profile.siren || "",
                            statutLegal: data.profile.statutLegal || "",
                            telephone: data.profile.telephone || "",
                            adresse: data.profile.adresse || ""
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                setError("Erreur lors du chargement du profil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/commercial/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setSuccess("Profil mis à jour avec succès.");
            } else {
                setError("Erreur lors de la mise à jour.");
            }
        } catch (err) {
            setError("Erreur serveur.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="animate-pulse space-y-6 max-w-3xl"><div className="h-8 bg-slate-200 rounded w-1/3"></div><div className="h-64 bg-slate-200 rounded-xl"></div></div>;
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Mon Profil Indépendant</h1>
                <p className="text-slate-500">Renseignez vos informations légales pour la facturation de vos commissions.</p>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
            {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg flex items-center gap-2"><CheckCircle className="h-5 w-5" /> {success}</div>}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                    <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">Informations Personnelles</h2>
                        <p className="text-sm text-slate-500">Vos informations de contact de base.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                        <input 
                            type="text" 
                            value={formData.prenom} 
                            onChange={e => setFormData({...formData, prenom: e.target.value})} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                        <input 
                            type="text" 
                            value={formData.nom} 
                            onChange={e => setFormData({...formData, nom: e.target.value})} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                        <input 
                            type="text" 
                            value={formData.telephone} 
                            onChange={e => setFormData({...formData, telephone: e.target.value})} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Adresse Postale</label>
                        <input 
                            type="text" 
                            value={formData.adresse} 
                            onChange={e => setFormData({...formData, adresse: e.target.value})} 
                            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Informations Légales</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Statut Juridique</label>
                            <select 
                                value={formData.statutLegal} 
                                onChange={e => setFormData({...formData, statutLegal: e.target.value})} 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="">Sélectionnez un statut</option>
                                <option value="Micro-entreprise">Micro-entreprise (Auto-entrepreneur)</option>
                                <option value="Entreprise Individuelle (EI)">Entreprise Individuelle (EI)</option>
                                <option value="EIRL">EIRL</option>
                                <option value="EURL">EURL</option>
                                <option value="SARL">SARL</option>
                                <option value="SASU">SASU</option>
                                <option value="SAS">SAS</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Numéro SIREN *</label>
                            <input 
                                type="text" 
                                required
                                placeholder="ex: 123 456 789"
                                value={formData.siren} 
                                onChange={e => setFormData({...formData, siren: e.target.value})} 
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                            />
                            <p className="text-xs text-slate-500 mt-1">Nécessaire pour le paiement de vos commissions.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        Enregistrer mon profil
                    </button>
                </div>
            </form>
        </div>
    );
}
