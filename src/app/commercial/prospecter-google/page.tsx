"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
    Search, MapPin, Building2, User, Phone, Globe, Star, 
    Loader2, SearchCheck, Sparkles, PlusCircle, ExternalLink, 
    Layers, Compass, ExternalLinkIcon, PhoneCall, X,
    CheckCircle2, AlertCircle, Edit3, Monitor, Maximize2, Calendar,
    ArrowUpRight, ArrowRight, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CityInteractiveMap = dynamic(
    () => import("@/components/CityInteractiveMap"),
    { 
        ssr: false, 
        loading: () => (
            <div className="h-[450px] bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" /> Chargement de la carte interactive...
            </div>
        ) 
    }
);

const POPULAR_CITIES = ["Lyon", "Marseille", "Miramas", "Nice", "Toulouse", "Bordeaux", "Paris", "Nantes", "Lille", "Strasbourg", "Montpellier"];

export default function ProspecterGoogleLocalPage() {
    const [city, setCity] = useState("Lyon");
    const [activity, setActivity] = useState("installation climatisation");
    const [cityCompanies, setCityCompanies] = useState<any[]>([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortBy, setSortBy] = useState<"RATING" | "REVIEWS" | "NAME">("RATING");
    const [activeTab, setActiveTab] = useState<"MAP" | "GOOGLE">("MAP");
    
    // Express Form Fields
    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [dateRdv, setDateRdv] = useState("");
    const [heureRdv, setHeureRdv] = useState("");
    const [noteRdv, setNoteRdv] = useState("");
    const [callOutcome, setCallOutcome] = useState<"VOICEMAIL" | "ABSENT" | "CALLBACK" | "INTERESTED" | "REFUSED" | "">("");
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    
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

    const handleSelectCompanyToForm = (comp: any) => {
        setSelectedCompanyId(comp.id);
        setCompanyName(comp.nomEntreprise);
        setPhone(comp.telephone || "");
        setWebsite(comp.siteWeb || "");
        setContactEmail(comp.email || "");
        setAddSuccess("");
        setAddError("");

        // Scroll smoothly to form
        const formElement = document.getElementById("express-crm-form");
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" });
        }
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

        let computedStatus = "NON_CONTACTE";
        let outcomeNote = "";
        if (callOutcome === "VOICEMAIL") {
            computedStatus = "CONTACTE";
            outcomeNote = " [🎙️ Message vocal laissé]";
        } else if (callOutcome === "ABSENT") {
            computedStatus = "NON_CONTACTE";
            outcomeNote = " [📵 Prospect absent / Pas de réponse]";
        } else if (callOutcome === "CALLBACK") {
            computedStatus = "INTERESSE";
            outcomeNote = " [📞 Rappel téléphonique à prévoir]";
        } else if (callOutcome === "INTERESTED") {
            computedStatus = "INTERESSE";
            outcomeNote = " [🤝 RDV fixé / Prospect très intéressé]";
        } else if (callOutcome === "REFUSED") {
            computedStatus = "REFUSE";
            outcomeNote = " [❌ Non intéressé / Refus]";
        }

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
                    status: computedStatus,
                    commentaire: `Prospect qualifié issu du Moteur Google LOCAL (${city})${outcomeNote}`,
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
                setCallOutcome("");
                setSelectedCompanyId(null);
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

    // Filter and Sort city companies
    const displayedCompanies = cityCompanies
        .filter((c: any) => {
            if (!filterQuery) return true;
            const q = filterQuery.toLowerCase();
            return (
                (c.nomEntreprise && c.nomEntreprise.toLowerCase().includes(q)) ||
                (c.nomGerant && c.nomGerant.toLowerCase().includes(q)) ||
                (c.telephone && c.telephone.includes(q)) ||
                (c.adresse && c.adresse.toLowerCase().includes(q))
            );
        })
        .sort((a: any, b: any) => {
            if (sortBy === "RATING") {
                return (b.noteGoogle || 0) - (a.noteGoogle || 0);
            }
            if (sortBy === "REVIEWS") {
                return (b.nombreAvis || 0) - (a.nombreAvis || 0);
            }
            return (a.nomEntreprise || "").localeCompare(b.nomEntreprise || "");
        });

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
                            Cliquez sur n'importe quel marqueur sur la carte ou dans la liste pour pré-remplir le formulaire et enregistrer en 1 clic.
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

                {/* Split Screen Layout: Left = Interactive Map + Listing with Ratings, Right = CRM Prospect Entry Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT SIDE: INTERACTIVE MAP & REAL RATINGS LISTING (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Map Container Header */}
                        <div className="bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden flex flex-col space-y-0">
                            
                            {/* Window Header & Map Switcher */}
                            <div className="bg-slate-200 border-b border-slate-300 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                                    <span className="text-xs font-bold text-slate-700 ml-2 font-mono">Carte Interactive CVC ({city})</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("MAP")}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all border ${
                                            activeTab === "MAP" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        📍 Carte Interactive Pins
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("GOOGLE")}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all border ${
                                            activeTab === "GOOGLE" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        🌐 Vue Google Maps
                                    </button>
                                    <a
                                        href={googleLocalOfficialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                                    >
                                        Google.com ➜
                                    </a>
                                </div>
                            </div>

                            {/* Map View */}
                            {activeTab === "MAP" ? (
                                <CityInteractiveMap
                                    cityName={city}
                                    companies={displayedCompanies}
                                    onSelectCompany={handleSelectCompanyToForm}
                                    selectedCompanyId={selectedCompanyId}
                                />
                            ) : (
                                <div className="w-full h-[450px] bg-slate-100 relative">
                                    <iframe
                                        key={googleMapsEmbedUrl}
                                        src={googleMapsEmbedUrl}
                                        className="w-full h-full border-0"
                                        title={`Google Maps Local - ${city}`}
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Local Companies Listing with Real Ratings & Review Count */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                            
                            {/* Header & Filter Controls */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                        🏢 Entreprises CVC de {city} avec Avis Réels ({displayedCompanies.length})
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Cliquez sur une entreprise pour la reporter instantanément dans le formulaire à droite 👉
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                                    >
                                        <option value="RATING">⭐ Trier par Meilleurs Avis</option>
                                        <option value="REVIEWS">💬 Trier par Nombre d'Avis</option>
                                        <option value="NAME">🔤 Trier par Nom (A-Z)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Filter Search Input inside Listing */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Filtrer les entreprises par nom, téléphone, gérant..."
                                    value={filterQuery}
                                    onChange={(e) => setFilterQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {loadingCompanies ? (
                                <div className="py-12 text-center text-slate-400">
                                    <Loader2 className="h-7 w-7 animate-spin mx-auto text-blue-600 mb-2" />
                                    <span className="text-xs font-bold">Chargement des fiches réelles...</span>
                                </div>
                            ) : displayedCompanies.length === 0 ? (
                                <div className="py-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    Aucune entreprise trouvée pour "{filterQuery || city}". Vous pouvez renseigner manuellement n'importe quelle entreprise aperçue sur la carte ci-dessus !
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                                    {displayedCompanies.map((c: any) => {
                                        const isSelected = selectedCompanyId === c.id;

                                        return (
                                            <div
                                                key={c.id}
                                                onClick={() => !c.isLocked && handleSelectCompanyToForm(c)}
                                                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                                                    isSelected
                                                        ? "bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                                                        : c.isLocked
                                                        ? "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                                                        : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md"
                                                }`}
                                            >
                                                <div className="space-y-1.5 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h4 className="font-extrabold text-slate-900 text-sm">{c.nomEntreprise}</h4>
                                                        
                                                        {/* Real Rating & Review Count Badge */}
                                                        {c.noteGoogle && c.noteGoogle > 0 ? (
                                                            <span className="bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                                {c.noteGoogle} ⭐ ({c.nombreAvis || 0} avis réels)
                                                            </span>
                                                        ) : (
                                                            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-md font-medium">
                                                                Pas encore d'avis Google
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                                                        {c.nomGerant && (
                                                            <span className="flex items-center gap-1 text-slate-800">
                                                                <User className="h-3 w-3 text-[#D59B2B]" /> {c.nomGerant}
                                                            </span>
                                                        )}
                                                        {c.telephone && (
                                                            <span className="flex items-center gap-1 font-mono font-bold text-slate-900">
                                                                <Phone className="h-3 w-3 text-emerald-600" /> {c.telephone}
                                                            </span>
                                                        )}
                                                        {c.adresse && (
                                                            <span className="flex items-center gap-1 text-slate-500">
                                                                <MapPin className="h-3 w-3 text-slate-400" /> {c.adresse}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {c.siteWeb ? (
                                                        <div className="text-[11px] text-blue-600 font-semibold truncate flex items-center gap-1">
                                                            <Globe className="h-3 w-3 shrink-0" />
                                                            <span>{c.siteWeb}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-[10px] text-amber-800 font-semibold">
                                                            ⚠️ Pas de site internet référencé
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Action Button */}
                                                <div className="shrink-0 flex items-center gap-2">
                                                    {c.isLocked ? (
                                                        <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold">
                                                            🔒 Attribué à {c.assignedTo || 'autre commercial'}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelectCompanyToForm(c);
                                                            }}
                                                            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm ${
                                                                isSelected
                                                                    ? "bg-blue-600 text-white shadow-md"
                                                                    : "bg-[#D59B2B] hover:bg-[#b88622] text-white"
                                                            }`}
                                                        >
                                                            {isSelected ? (
                                                                <>
                                                                    <CheckCircle2 className="h-4 w-4 text-white" /> Sélectionné
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <PlusCircle className="h-4 w-4" /> Reporter sur le Formulaire 👉
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* RIGHT SIDE: EXPRESS CRM PROSPECT QUALIFIER FORM (5 cols) */}
                    <div id="express-crm-form" className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-5 sticky top-8">
                        <div className="border-b border-slate-100 pb-3">
                            <div className="text-xs font-bold text-[#D59B2B] uppercase tracking-wider flex items-center gap-1.5">
                                <PlusCircle className="h-4 w-4" /> Formulaire de Qualification Express CRM
                            </div>
                            <h3 className="text-lg font-extrabold text-[#1F2D3D] mt-0.5">
                                {companyName ? `Enregistrer "${companyName}"` : "Enregistrer l'entreprise au CRM"}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Cliquez sur une entreprise sur la carte ou dans la liste pour pré-remplir automatiquement.
                            </p>
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

                            {/* Call Result Quick Selector */}
                            <div className="space-y-2 pt-1 border-t border-slate-100">
                                <label className="text-xs font-extrabold text-slate-800 block">
                                    Résultat de l'Appel Commercial (Cocher une option) :
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCallOutcome(callOutcome === "VOICEMAIL" ? "" : "VOICEMAIL")}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            callOutcome === "VOICEMAIL" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        🎙️ Message vocal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCallOutcome(callOutcome === "ABSENT" ? "" : "ABSENT")}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            callOutcome === "ABSENT" ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        断 Absent / Pas de rep.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCallOutcome(callOutcome === "CALLBACK" ? "" : "CALLBACK")}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            callOutcome === "CALLBACK" ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        📞 Rappel tel.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCallOutcome(callOutcome === "INTERESTED" ? "" : "INTERESTED")}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            callOutcome === "INTERESTED" ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        🤝 RDV / Intéressé
                                    </button>
                                </div>
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
