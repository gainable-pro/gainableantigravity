"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, ShieldAlert, Loader2, CheckCircle } from "lucide-react";

export default function DemoAccess() {
    const router = useRouter();
    const [loading, setLoading] = useState("");
    const [error, setError] = useState("");

    const handleDemoLogin = async (companyName: string) => {
        setLoading(companyName);
        setError("");

        try {
            const res = await fetch("/api/commercial/demo-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetCompanyName: companyName })
            });

            if (res.ok) {
                // Ouvrir l'espace expert dans un nouvel onglet
                window.open("/dashboard", "_blank");
            } else {
                const data = await res.json();
                setError(data.message || "Erreur d'accès");
            }
        } catch (err) {
            setError("Erreur serveur");
        } finally {
            setLoading("");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Espace Démonstration</h1>
                <p className="text-slate-500">Accédez aux comptes vitrines pour faire vos démos en partage d'écran.</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
                <ShieldAlert className="h-6 w-6 shrink-0" />
                <div>
                    <h3 className="font-bold">Avertissement de sécurité</h3>
                    <p className="text-sm mt-1">Vous ne pouvez vous connecter qu'au compte "Air G Énergie". Il est strictement interdit de modifier des informations ou de supprimer des éléments dans cet espace. Utilisez ce compte uniquement pour de la consultation visuelle avec vos prospects.</p>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
                {/* Air G Energie */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">
                                AG
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Air G Énergie</h2>
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium mt-1">
                                    <CheckCircle className="h-3 w-3" /> Compte validé complet
                                </span>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-6">Utilisez ce compte pour montrer un profil expert complet, avec des articles SEO optimisés, des photos de chantiers et des labels.</p>
                    </div>

                    <button 
                        onClick={() => handleDemoLogin("Air G Énergie")}
                        disabled={loading !== ""}
                        className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg font-medium text-white bg-slate-900 hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {loading === "Air G Énergie" ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlayCircle className="h-5 w-5" />}
                        Se connecter (Démo)
                    </button>
                </div>

                </div>
            </div>
        </div>
    );
}
