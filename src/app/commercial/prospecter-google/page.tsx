"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Search, MapPin, Building2, User, Phone, Globe, Star, 
    Loader2, SearchCheck, Sparkles, PlusCircle, ExternalLink, 
    Layers, Compass, ExternalLinkIcon, PhoneCall, X,
    CheckCircle2, AlertCircle, Edit3, Monitor, Maximize2, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

const POPULAR_CITIES = ["Lyon", "Marseille", "Miramas", "Nice", "Toulouse", "Bordeaux", "Paris", "Nantes", "Lille", "Strasbourg", "Montpellier"];

export default function ProspecterGoogleLocalPage() {
    const [city, setCity] = useState("Lyon");
    const [activity, setActivity] = useState("installation climatisation");
    const [cityCompanies, setCityCompanies] = useState<any[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    
    // Express Form Fields
    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [dateRdv, setDateRdv] = useState("");
    const [heureRdv, setHeureRdv] = useState("");
    const [noteRdv, setNoteRdv] = useState("");
    
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");
    const [addError, setAddError] = useState("");

    const googleSearchQuery = `${activity} ${city}`.trim();
    const googleLocalOfficialUrl = `https://www.google.com/search?tbm=lcl&q=${encodeURIComponent(googleSearchQuery)}`;
    const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(googleSearchQuery)}&output=embed`;

    useEffect(() => {
        fetchCityCompanies(city);
    }, [city]);

    const fetchCityCompanies = async (cityName: string) => {
        setLoadingCompanies(true);
        try {
            const res = await fetch(`/api/commercial/prospecting-database?ville=${encodeURIComponent(cityName)}`);
            if (res.ok) {
                const data = await res.json();
                setCityCompanies(data.companies || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingCompanies(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setAddSuccess("");
        setAddError("");
        fetchCityCompanies(city);
    };

    const handleAutoFillFromCard = (comp: any) => {
        setCompanyName(comp.nomEntreprise);
        setPhone(comp.telephone || "");
        setWebsite(comp.siteWeb || "");
        setContactEmail(comp.email || "");
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
                    commentaire: `Prospect qualifié issu du Moteur Google LOCAL (${city})`,
                    dateRdv: dateRdv || null,
                    heureRdv: heureRdv || null,
                    noteRdv: noteRdv || null
                })
            });

            if (res.ok) {
                setAddSuccess(`L'entreprise "${companyName}" a été ajoutée avec succès à vos prospects CRM !`);
                setCompanyName("");
                setContactEmail("");
                setPhone("");
                setWebsite("");
                setDateRdv("");
                setHeureRdv("");
                setNoteRdv("");
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
                            Consultez les entreprises CVC et le plan Google Local de votre ville, puis qualifiez-les en 1 clic dans votre CRM.
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

                {/* Split Screen Layout: Left = Google Maps Local Places Embed, Right = CRM Prospect Entry Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT SIDE: GOOGLE MAPS LOCAL PLACES BROWSER (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Google Maps Browser Frame */}
                        <div className="bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden flex flex-col space-y-0">
                            
                            {/* Window Header */}
                            <div className="bg-slate-200 border-b border-slate-300 p-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                                    <span className="text-xs font-bold text-slate-700 ml-2 font-mono">Google Local Business Map ({city})</span>
                                </div>

                                <a
                                    href={googleLocalOfficialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                                >
                                    Ouvrir Google Local Lieux (Nouvel Onglet) <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            </div>

                            {/* Embedded Google Maps Embed (No Consent Block) */}
                            <div className="w-full h-[450px] bg-slate-100 relative">
                                <iframe
                                    key={googleMapsEmbedUrl}
                                    src={googleMapsEmbedUrl}
                                    className="w-full h-full border-0"
                                    title={`Google Maps Local - ${city}`}
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Local Companies List for City */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                    🏢 Entreprises CVC référencées sur {city} ({cityCompanies.length})
                                </h3>
                                <span className="text-xs text-slate-500">Cliquez pour pré-remplir la fiche</span>
                            </div>

                            {loadingCompanies ? (
                                <div className="py-8 text-center text-slate-400">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
                                </div>
                            ) : cityCompanies.length === 0 ? (
                                <div className="py-6 text-center text-slate-400 text-xs italic">
                                    Aucune entreprise enregistrée dans la base locale pour {city}. Vous pouvez saisir n'importe quelle entreprise aperçue sur le plan Google ci-dessus !
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                                    {cityCompanies.map((c: any) => (
                                        <div
                                            key={c.id}
                                            className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all"
                                        >
                                            <div>
                                                <div className="font-extrabold text-slate-900 text-xs">{c.nomEntreprise}</div>
                                                <div className="text-[11px] text-slate-500 mt-0.5">
                                                    {c.nomGerant ? `Gérant : ${c.nomGerant} • ` : ''}Tél : {c.telephone || 'Non renseigné'}
                                                </div>
                                            </div>

                                            {c.isLocked ? (
                                                <span className="text-[11px] bg-slate-200 text-slate-600 px-2.5 py-1 rounded-md font-bold shrink-0">
                                                    🔒 Attribué
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAutoFillFromCard(c)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg transition-all shrink-0 flex items-center gap-1 shadow-sm"
                                                >
                                                    <PlusCircle className="h-3.5 w-3.5" /> Pré-remplir
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT SIDE: EXPRESS CRM PROSPECT QUALIFIER FORM (5 cols) */}
                    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5 sticky top-8">
                        <div className="border-b border-slate-100 pb-3">
                            <div className="text-xs font-bold text-[#D59B2B] uppercase tracking-wider flex items-center gap-1.5">
                                <PlusCircle className="h-4 w-4" /> Qualifier un Prospect Google Local
                            </div>
                            <h3 className="text-lg font-extrabold text-[#1F2D3D] mt-0.5">
                                Enregistrer dans le CRM
                            </h3>
                        </div>

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

                            {/* RDV & Reminder Fields */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                                <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-blue-600" /> Planifier un RDV / Relance (Optionnel)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="date"
                                        value={dateRdv}
                                        onChange={(e) => setDateRdv(e.target.value)}
                                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                                    />
                                    <input
                                        type="time"
                                        value={heureRdv}
                                        onChange={(e) => setHeureRdv(e.target.value)}
                                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Objet / Note de relance..."
                                    value={noteRdv}
                                    onChange={(e) => setNoteRdv(e.target.value)}
                                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
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
