"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    Search, MapPin, Building2, User, Phone, Globe, Star, 
    Loader2, SearchCheck, Sparkles, PlusCircle, ExternalLink, 
    Layers, Compass, ExternalLinkIcon, PhoneCall, X,
    CheckCircle2, AlertCircle, Edit3, Monitor, Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const POPULAR_CITIES = ["Lyon", "Marseille", "Miramas", "Nice", "Toulouse", "Bordeaux", "Paris", "Nantes", "Lille", "Strasbourg", "Montpellier"];

export default function ProspecterGoogleLocalPage() {
    const [city, setCity] = useState("Lyon");
    const [activity, setActivity] = useState("installation climatisation");
    
    // Express Form Fields
    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");
    const [addError, setAddError] = useState("");

    const googleSearchQuery = `${activity} ${city}`.trim();
    const googleLocalUrl = `https://www.google.com/search?tbm=lcl&q=${encodeURIComponent(googleSearchQuery)}`;

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAddSuccess("");
        setAddError("");
    };

    const handleConfirmAddProspect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyName || !contactEmail) {
            setAddError("Veuillez remplir au moins le nom de l'entreprise et l'e-mail du contact.");
            return;
        }

        setAdding(true);
        setAddError("");
        setAddSuccess("");

        try {
            const res = await fetch("/api/commercial/prospects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomEntreprise: companyName,
                    nomContact: "Dirigeant",
                    prenomContact: "Contact",
                    email: contactEmail,
                    telephone: phone,
                    siret: "",
                    adresse: city,
                    siteWeb: website,
                    status: "NON_CONTACTE",
                    commentaire: `Prospect qualifié issu du Moteur Google LOCAL (${city})`
                })
            });

            if (res.ok) {
                setAddSuccess(`L'entreprise "${companyName}" a été ajoutée avec succès à vos prospects CRM !`);
                setCompanyName("");
                setContactEmail("");
                setPhone("");
                setWebsite("");
            } else {
                const d = await res.json();
                setAddError(d.message || "Erreur lors de l'ajout du prospect");
            }
        } catch (e) {
            setAddError("Erreur technique lors de l'enregistrement");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Lumineux */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-extrabold text-xs uppercase tracking-widest mb-1">
                            <MapPin className="h-4 w-4" /> Moteur de Prospection Google LOCAL par Ville
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2D3D] flex items-center gap-3">
                            📍 Prospection Google Local (Lieux) par Ville
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Entrez une ville pour consulter en direct les installateurs CVC sur Google Local et ajoutez-les en 1 clic dans votre CRM.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/commercial/prospecter">
                            <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold gap-2 text-xs">
                                🗺️ Base Nationale (37k)
                            </Button>
                        </Link>
                        <Link href="/commercial/prospects">
                            <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold gap-2 text-xs">
                                ← Mes Prospects CRM
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* City Search Bar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                            <input
                                type="text"
                                required
                                placeholder="Saisir la Ville (ex: Lyon, Marseille, Miramas...)"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D59B2B]" />
                            <input
                                type="text"
                                placeholder="Activité (ex: installation climatisation)"
                                value={activity}
                                onChange={(e) => setActivity(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                            />
                        </div>

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl py-3 shadow-md">
                            🔍 Afficher Google Local ({city})
                        </Button>
                    </form>

                    {/* Quick City Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-500 mr-1">Villes populaires :</span>
                        {POPULAR_CITIES.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setCity(c)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                                    city.toLowerCase() === c.toLowerCase()
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                📍 {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Split Screen Layout: Left = Google Local Browser, Right = CRM Prospect Entry Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT SIDE: GOOGLE LOCAL SEARCH BROWSER FRAME (8 cols) */}
                    <div className="lg:col-span-7 bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden flex flex-col space-y-0">
                        
                        {/* Chrome Window Header */}
                        <div className="bg-slate-200 border-b border-slate-300 p-3.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                                <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
                                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                                <span className="text-xs font-bold text-slate-700 ml-2 font-mono">Google Local Business Browser ({city})</span>
                            </div>

                            {/* Address Bar */}
                            <div className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-[11px] text-slate-600 font-mono flex items-center gap-2 max-w-xs truncate shadow-inner">
                                <Globe className="h-3 w-3 text-slate-400 shrink-0" />
                                <span className="truncate">{googleLocalUrl}</span>
                            </div>
                        </div>

                        {/* Top Direct Link Banner */}
                        <div className="bg-blue-50 border-b border-blue-200 p-4 flex items-center justify-between gap-3">
                            <div className="text-xs text-blue-900 font-bold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
                                <span>Recherche Google Local Lieux pour <strong>{city}</strong></span>
                            </div>

                            <a
                                href={googleLocalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm shrink-0"
                            >
                                Ouvrir dans un nouvel onglet Google <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        </div>

                        {/* Embedded iFrame View of Google Local Lieux */}
                        <div className="w-full h-[580px] bg-slate-100 relative">
                            <iframe
                                key={googleLocalUrl}
                                src={`https://www.google.com/search?igu=1&tbm=lcl&q=${encodeURIComponent(googleSearchQuery)}`}
                                className="w-full h-full border-0"
                                title={`Google Local - ${city}`}
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE: EXPRESS CRM PROSPECT QUALIFIER FORM (5 cols) */}
                    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5 sticky top-8">
                        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                            <div>
                                <div className="text-xs font-bold text-[#D59B2B] uppercase tracking-wider flex items-center gap-1.5">
                                    <PlusCircle className="h-4 w-4" /> Qualifier un Prospect Google Local
                                </div>
                                <h3 className="text-lg font-extrabold text-[#1F2D3D] mt-0.5">
                                    Ajouter l'entreprise vue sur Google
                                </h3>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed">
                            Repérez une entreprise sur le panneau Google Local à gauche, puis renseignez son nom et ses coordonnées ci-dessous pour l'ajouter immédiatement à vos prospects CRM.
                        </p>

                        <form onSubmit={handleConfirmAddProspect} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    Nom de l'entreprise (vu sur Google) * :
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: GINER CLIMATIQUE, CLIMA CONCEPT..."
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    E-mail du Contact / Gérant * :
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ex: contact@entreprise.fr"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Permettra l'envoi direct de la demande de paiement Stripe et des devis.
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    Téléphone direct (vu sur Google) :
                                </label>
                                <input
                                    type="text"
                                    placeholder="ex: 04 28 29 68 41 ou 06..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    Site Web officiel (vu sur Google) :
                                </label>
                                <input
                                    type="text"
                                    placeholder="ex: www.entreprise.fr"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>

                            {addError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{addError}</div>}
                            {addSuccess && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold">{addSuccess}</div>}

                            <Button
                                type="submit"
                                disabled={adding || !companyName || !contactEmail}
                                className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-all"
                            >
                                {adding ? <Loader2 className="h-5 w-5 animate-spin" /> : "⚡ Enregistrer & Transférer au CRM Prospect"}
                            </Button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}
