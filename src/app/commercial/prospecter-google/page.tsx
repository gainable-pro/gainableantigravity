"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
    Search, MapPin, Building2, User, Phone, Globe, Star, 
    Loader2, SearchCheck, Sparkles, PlusCircle, ExternalLink, 
    Layers, Compass, ExternalLinkIcon, PhoneCall, X,
    CheckCircle2, AlertCircle, Edit3, Monitor, Maximize2, Calendar,
    ArrowUpRight, ArrowRight, Filter, ArrowLeft
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
    // DEFAULT TO REAL GOOGLE BROWSER VIEW
    const [activeTab, setActiveTab] = useState<"MAP" | "GOOGLE">("GOOGLE");
    
    // Express Form Fields
    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [secondaryEmail, setSecondaryEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [dateRdv, setDateRdv] = useState("");
    const [heureRdv, setHeureRdv] = useState("");
    const [noteRdv, setNoteRdv] = useState("");
    const [callOutcome, setCallOutcome] = useState<"VOICEMAIL" | "ABSENT" | "CALLBACK" | "INTERESTED" | "REFUSED" | "">("");
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [selectedCompanyObj, setSelectedCompanyObj] = useState<any | null>(null);
    
    // Live Google Browser Custom Search Query & Navigation Reset Keys
    const [customGoogleQuery, setCustomGoogleQuery] = useState("");
    const [mainIframeResetKey, setMainIframeResetKey] = useState(0);
    const [modalIframeResetKey, setModalIframeResetKey] = useState(0);

    // Live Google Browser Modal State
    const [googleSearchCompany, setGoogleSearchCompany] = useState<any | null>(null);

    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");
    const [addError, setAddError] = useState("");

    const googleSearchQuery = customGoogleQuery || (companyName ? `${companyName} ${city}` : `${activity} ${city}`).trim();
    const googleLocalOfficialUrl = `https://www.google.com/search?tbm=lcl&q=${encodeURIComponent(googleSearchQuery)}`;
    const googleLocalEmbedUrl = `https://www.google.com/search?tbm=lcl&q=${encodeURIComponent(googleSearchQuery)}&igu=1`;

    useEffect(() => {
        fetchCityCompanies(city);
        setCustomGoogleQuery("");
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
        setCustomGoogleQuery(`${activity} ${city}`);
        fetchCityCompanies(city);
    };

    const handleSelectCompanyToForm = (comp: any) => {
        setSelectedCompanyId(comp.id);
        setSelectedCompanyObj(comp);
        setCompanyName(comp.nomEntreprise);
        setPhone(comp.telephone || "");
        setWebsite(comp.siteWeb || "");
        setContactEmail(comp.email || "");
        setSecondaryEmail("");
        setCustomGoogleQuery(`${comp.nomEntreprise} ${city}`);
        setAddSuccess("");
        setAddError("");

        // Scroll smoothly to form
        const formElement = document.getElementById("express-crm-form");
        if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleOpenGoogleBrowser = (comp: any) => {
        setSelectedCompanyId(comp.id);
        setSelectedCompanyObj(comp);
        setGoogleSearchCompany(comp);
        setCompanyName(comp.nomEntreprise || "");
        setPhone(comp.telephone || "");
        setWebsite(comp.siteWeb || "");
        setContactEmail(comp.email || "");
        setSecondaryEmail("");
        setCustomGoogleQuery(`${comp.nomEntreprise} ${city}`);
        setAddSuccess("");
        setAddError("");
    };

    const handleConfirmAddProspect = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        const compObj = googleSearchCompany || selectedCompanyObj;
        const targetCompany = compObj?.nomEntreprise || companyName;
        if (!targetCompany) {
            setAddError("Veuillez remplir au moins le nom de l'entreprise.");
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

        const notesParts = [
            `Prospect qualifié issu du Moteur Google LOCAL (${city})${outcomeNote}`,
            contactEmail ? `Email principal: ${contactEmail}` : null,
            secondaryEmail ? `Email secondaire / alternative: ${secondaryEmail}` : null,
            compObj?.chiffreAffaires ? `CA: ${compObj.chiffreAffaires}` : null,
            compObj?.nomGerant ? `Gérant: ${compObj.nomGerant}` : null,
            compObj?.siret ? `SIRET: ${compObj.siret}` : null,
            compObj?.accroche ? `Effectif: ${compObj.accroche}` : null
        ].filter(Boolean).join(" | ");

        const chosenEmail = contactEmail || secondaryEmail;

        try {
            const res = await fetch("/api/commercial/prospects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomEntreprise: targetCompany,
                    nomContact: compObj?.nomGerant?.split(" ")[1] || "Dirigeant",
                    prenomContact: compObj?.nomGerant?.split(" ")[0] || "Contact",
                    email: chosenEmail,
                    telephone: phone,
                    siret: compObj?.siret || "",
                    adresse: compObj?.adresse ? `${compObj.adresse}, ${compObj.codePostal || ''} ${compObj.ville || city}` : city,
                    siteWeb: website,
                    status: computedStatus,
                    commentaire: notesParts,
                    dateRdv: dateRdv || null,
                    heureRdv: heureRdv || null,
                    noteRdv: noteRdv || null
                })
            });

            if (res.ok) {
                setAddSuccess(`L'entreprise "${targetCompany}" a été ajoutée avec succès à vos prospects CRM !`);
                setTimeout(() => {
                    setCompanyName("");
                    setContactEmail("");
                    setPhone("");
                    setWebsite("");
                    setDateRdv("");
                    setHeureRdv("");
                    setNoteRdv("");
                    setCallOutcome("");
                    setSelectedCompanyId(null);
                    setGoogleSearchCompany(null);
                }, 1500);
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
                const scoreA = (a.noteGoogle || 0) * 1000 + (a.nombreAvis || 0);
                const scoreB = (b.noteGoogle || 0) * 1000 + (b.nombreAvis || 0);
                return scoreB - scoreA;
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
                            Affiche les véritables résultats de recherche Google Local (Lieux & Fiches d'entreprises) en direct.
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

                {/* Split Screen Layout: Left = Live Embedded Google Local Browser + Real Ratings Listing, Right = CRM Prospect Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT SIDE: LIVE GOOGLE LOCAL SEARCH BROWSER & LISTING (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Map Container Header */}
                        <div className="bg-white border border-slate-300 rounded-2xl shadow-xl overflow-hidden flex flex-col space-y-0">
                            
                            {/* Window Header & Map Switcher */}
                            <div className="bg-slate-200 border-b border-slate-300 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                                    <span className="text-xs font-bold text-slate-700 ml-2 font-mono">Navigateur Live Google Local ({city})</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("GOOGLE")}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all border ${
                                            activeTab === "GOOGLE" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        🌐 Navigateur Google Local
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("MAP")}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all border ${
                                            activeTab === "MAP" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        📍 Vue Carte Pins
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

                            {/* View Content */}
                            {activeTab === "GOOGLE" ? (
                                <div className="w-full h-[520px] bg-slate-100 relative flex flex-col">
                                    {/* Real Interactive Google Address Bar */}
                                    <div className="bg-slate-200 border-b border-slate-300 px-3 py-2 flex items-center gap-2 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setMainIframeResetKey(prev => prev + 1)}
                                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1 shrink-0 shadow-sm cursor-pointer"
                                            title="Précédent / Revenir à la recherche Google initiale"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5 text-blue-600" />
                                            <span>Précédent</span>
                                        </button>

                                        <Globe className="h-4 w-4 text-blue-600 shrink-0" />
                                        <form 
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                            }}
                                            className="flex-1 flex items-center gap-2"
                                        >
                                            <input
                                                type="text"
                                                value={customGoogleQuery || (companyName ? `${companyName} ${city}` : `${activity} ${city}`)}
                                                onChange={(e) => setCustomGoogleQuery(e.target.value)}
                                                placeholder="Rechercher sur Google Local..."
                                                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                                            />
                                        </form>
                                        <a
                                            href={googleLocalOfficialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] bg-white border border-slate-300 text-blue-600 font-bold px-2.5 py-1 rounded-lg hover:bg-slate-50 shrink-0 flex items-center gap-1"
                                        >
                                            Ouvrir Google ↗
                                        </a>
                                    </div>
                                    <iframe
                                        key={`${googleSearchQuery}-${mainIframeResetKey}`}
                                        src={googleLocalEmbedUrl}
                                        className="w-full flex-1 border-0"
                                        title={`Google Local Search Results - ${googleSearchQuery}`}
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                <CityInteractiveMap
                                    cityName={city}
                                    companies={displayedCompanies}
                                    onSelectCompany={handleOpenGoogleBrowser}
                                    selectedCompanyId={selectedCompanyId}
                                />
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
                                        Cliquez sur n'importe quelle entreprise pour afficher sa fiche Google Local en direct ci-dessus 👆
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
                                    Aucune entreprise trouvée pour "{filterQuery || city}". Vous pouvez renseigner n'importe quel nom dans le navigateur ci-dessus !
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

                                                {/* Action Buttons */}
                                                <div className="shrink-0 flex flex-wrap items-center gap-2">
                                                    {c.isLocked ? (
                                                        <span className="text-xs bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-bold">
                                                            🔒 Attribué à {c.assignedTo || 'autre commercial'}
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleOpenGoogleBrowser(c);
                                                                }}
                                                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                                                            >
                                                                <Globe className="h-3.5 w-3.5 text-blue-600" />
                                                                Vérification & Aperçu Google Live 🌐
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectCompanyToForm(c);
                                                                }}
                                                                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm ${
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
                                                                        <PlusCircle className="h-4 w-4" /> Qualifier & Ajouter
                                                                    </>
                                                                )}
                                                            </button>
                                                        </>
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
                                Cliquez sur une entreprise ci-contre pour pré-remplir les données de la base.
                            </p>
                        </div>

                        {/* RICH DATABASE DETAILS CARD */}
                        {selectedCompanyObj && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-extrabold text-slate-900 text-sm">{selectedCompanyObj.nomEntreprise}</h4>
                                        {selectedCompanyObj.nomGerant && (
                                            <div className="text-xs text-slate-700 font-semibold mt-0.5">
                                                👤 Gérant / Dirigeant : <span className="text-slate-900 font-bold">{selectedCompanyObj.nomGerant}</span>
                                            </div>
                                        )}
                                    </div>
                                    {selectedCompanyObj.noteGoogle && (
                                        <div className="bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md text-amber-900 text-[11px] font-bold flex items-center gap-1 shrink-0">
                                            ⭐ {selectedCompanyObj.noteGoogle} ({selectedCompanyObj.nombreAvis || 0} avis)
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                                    <div>
                                        <span className="font-bold text-slate-800">SIRET / SIREN :</span> {selectedCompanyObj.siret || selectedCompanyObj.siren || 'Non renseigné'}
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-800">Chiffre d'Affaires :</span> {selectedCompanyObj.chiffreAffaires || 'Non communiqué'}
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-800">Localisation :</span> {selectedCompanyObj.codePostal || ''} {selectedCompanyObj.ville || city}
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-800">Effectifs :</span> {selectedCompanyObj.accroche || 'Spécialiste CVC'}
                                    </div>
                                </div>
                            </div>
                        )}

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

                            {/* Dual Email Fields: Principal (BDD) & Secondaire / Alternative */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">
                                        E-mail principal (Base BDD) :
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="ex: contact@entreprise.fr"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 block mb-1">
                                        E-mail sec. / Adresse à jour :
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="ex: direction@entreprise.fr"
                                        value={secondaryEmail}
                                        onChange={(e) => setSecondaryEmail(e.target.value)}
                                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                    />
                                </div>
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
                                        onClick={() => {
                                            const newOutcome = callOutcome === "VOICEMAIL" ? "" : "VOICEMAIL";
                                            setCallOutcome(newOutcome);
                                            setDateRdv("");
                                            setHeureRdv("");
                                            setNoteRdv("");
                                        }}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            callOutcome === "VOICEMAIL" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        🎙️ Message vocal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newOutcome = callOutcome === "ABSENT" ? "" : "ABSENT";
                                            setCallOutcome(newOutcome);
                                            setDateRdv("");
                                            setHeureRdv("");
                                            setNoteRdv("");
                                        }}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            callOutcome === "ABSENT" ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        断 Absent / Pas de rep.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newOutcome = callOutcome === "CALLBACK" ? "" : "CALLBACK";
                                            setCallOutcome(newOutcome);
                                            if (newOutcome && !dateRdv) {
                                                const tom = new Date(); tom.setDate(tom.getDate() + 1);
                                                setDateRdv(tom.toISOString().split('T')[0]);
                                                if (!heureRdv) setHeureRdv("10:00");
                                            }
                                        }}
                                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                                            callOutcome === "CALLBACK" ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        📞 Rappel tel.
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newOutcome = callOutcome === "INTERESTED" ? "" : "INTERESTED";
                                            setCallOutcome(newOutcome);
                                            if (newOutcome && !dateRdv) {
                                                const tom = new Date(); tom.setDate(tom.getDate() + 1);
                                                setDateRdv(tom.toISOString().split('T')[0]);
                                                if (!heureRdv) setHeureRdv("14:00");
                                            }
                                        }}
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
                                disabled={adding || !companyName}
                                className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold text-sm py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                            >
                                {adding ? <Loader2 className="h-5 w-5 animate-spin" /> : "⚡ Enregistrer & Transférer au CRM Prospect"}
                            </Button>
                        </form>
                    </div>

                </div>

            </div>

            {/* Google Live Search & Verification Window Modal (WINDOW MATCHING USER SCREENSHOT) */}
            {googleSearchCompany && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white border border-slate-300 rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden flex flex-col h-[90vh]">
                        
                        {/* Browser Top Window Header */}
                        <div className="bg-slate-200 border-b border-slate-300 p-3 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                                </div>

                                {/* Back Navigation Button */}
                                <button
                                    type="button"
                                    onClick={() => setModalIframeResetKey(prev => prev + 1)}
                                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                                    title="Précédent / Revenir à la recherche Google initiale"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5 text-blue-600" />
                                    <span>Précédent</span>
                                </button>

                                <span className="text-xs font-bold text-slate-700 font-mono hidden sm:inline-block">Google Search Live Verification Window</span>
                            </div>

                            <a
                                href={`https://www.google.com/search?tbm=lcl&q=${encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || city || ''}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                            >
                                Ouvrir sur Google.com (Nouvel Onglet) <ExternalLink className="h-3.5 w-3.5" />
                            </a>

                            <button onClick={() => setGoogleSearchCompany(null)} className="text-slate-500 hover:text-slate-800 p-1">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* 2-COLUMN SPLIT VIEW: LEFT = LIVE GOOGLE SEARCH SCREEN, RIGHT = DETAILS & FORM */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-hidden">
                            
                            {/* LEFT SIDE (7 COLS): LIVE EMBEDDED GOOGLE SEARCH BROWSER SCREEN */}
                            <div className="lg:col-span-7 bg-slate-100 border-r border-slate-200 flex flex-col h-full overflow-hidden">
                                <div className="bg-slate-200 border-b border-slate-300 px-3 py-2 flex items-center justify-between text-xs font-mono text-slate-700 shrink-0">
                                    <div className="flex items-center gap-2 truncate flex-1">
                                        <button
                                            type="button"
                                            onClick={() => setModalIframeResetKey(prev => prev + 1)}
                                            className="px-2 py-0.5 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-800 font-sans text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                                            title="Revenir en arrière"
                                        >
                                            <ArrowLeft className="h-3 w-3 text-blue-600" /> Précédent
                                        </button>
                                        <Globe className="h-3.5 w-3.5 text-blue-600 shrink-0 ml-1" />
                                        <span className="truncate">
                                            https://www.google.com/search?tbm=lcl&q={encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || city || ''}`)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 w-full relative bg-white">
                                    <iframe
                                        key={`${googleSearchCompany.id}-${modalIframeResetKey}`}
                                        src={`https://www.google.com/search?tbm=lcl&q=${encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || city || ''}`)}&igu=1`}
                                        className="w-full h-full border-0"
                                        title={`Google Search Results - ${googleSearchCompany.nomEntreprise}`}
                                    />
                                </div>
                            </div>

                            {/* RIGHT SIDE (5 COLS): DETAILS & QUALIFICATION FORM */}
                            <div className="lg:col-span-5 bg-white p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
                                <div className="space-y-4">
                                    {/* RICH DATABASE COMPANY CARD */}
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-extrabold text-slate-900">{googleSearchCompany.nomEntreprise}</h3>
                                                {googleSearchCompany.nomGerant && (
                                                    <div className="text-xs text-slate-700 font-semibold mt-0.5">
                                                        👤 Gérant / Dirigeant : <span className="text-slate-900 font-bold">{googleSearchCompany.nomGerant}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {googleSearchCompany.noteGoogle && (
                                                <div className="bg-amber-100 border border-amber-300 px-2 py-1 rounded-lg text-amber-900 text-xs font-bold flex items-center gap-1 shrink-0">
                                                    ⭐ {googleSearchCompany.noteGoogle} ({googleSearchCompany.nombreAvis || 0} avis)
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                                            <div>
                                                <span className="font-bold text-slate-800">SIRET / SIREN :</span> {googleSearchCompany.siret || googleSearchCompany.siren || 'Non renseigné'}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800">Chiffre d'Affaires (CA) :</span> {googleSearchCompany.chiffreAffaires || 'Non communiqué'}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800">Adresse :</span> {googleSearchCompany.adresse || ''} {googleSearchCompany.codePostal || ''} {googleSearchCompany.ville || city} ({googleSearchCompany.region || 'France'})
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800">Effectifs :</span> {googleSearchCompany.accroche || 'Professionnel CVC'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEO Argument Alert */}
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-1 text-amber-900 text-xs">
                                        <div className="font-extrabold flex items-center gap-1.5 text-amber-800">
                                            <Sparkles className="h-4 w-4 text-[#D59B2B]" /> Diagnostic Visibilité Web :
                                        </div>
                                        {website ? (
                                            <p>
                                                Cette entreprise possède un site ({website}). Proposez notre audit d'indexation Gainable.fr.
                                            </p>
                                        ) : (
                                            <p className="font-semibold">
                                                ⚠️ Aucun site internet officiel trouvé sur Google ! Prospect prioritaire pour notre offre référencement.
                                            </p>
                                        )}
                                    </div>

                                    {/* Real-Time Qualification Form */}
                                    <div className="space-y-3 pt-2">
                                        {/* Dual Email Fields: Principal (BDD) & Secondaire / Alternative */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                                    E-mail principal (Base BDD) :
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="ex: contact@entreprise.fr"
                                                    value={contactEmail}
                                                    onChange={(e) => setContactEmail(e.target.value)}
                                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                                    E-mail sec. / Adresse à jour :
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="ex: direction@entreprise.fr"
                                                    value={secondaryEmail}
                                                    onChange={(e) => setSecondaryEmail(e.target.value)}
                                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                                Téléphone direct (vu sur Google) :
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="ex: 04 90... ou 06..."
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                                Site Web officiel (vu sur Google) :
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="ex: www.entreprise.fr"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                            />
                                        </div>

                                        {/* Call Result Quick Selector */}
                                        <div className="space-y-1.5 pt-1 border-t border-slate-100">
                                            <label className="text-[11px] font-extrabold text-slate-800 block">
                                                Résultat de l'Appel Commercial (Cocher une option) :
                                            </label>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOutcome = callOutcome === "VOICEMAIL" ? "" : "VOICEMAIL";
                                                        setCallOutcome(newOutcome);
                                                        setDateRdv("");
                                                        setHeureRdv("");
                                                        setNoteRdv("");
                                                    }}
                                                    className={`p-2 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
                                                        callOutcome === "VOICEMAIL" ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    🎙️ Message vocal
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOutcome = callOutcome === "ABSENT" ? "" : "ABSENT";
                                                        setCallOutcome(newOutcome);
                                                        setDateRdv("");
                                                        setHeureRdv("");
                                                        setNoteRdv("");
                                                    }}
                                                    className={`p-2 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
                                                        callOutcome === "ABSENT" ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    📵 Absent / Pas de rep.
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOutcome = callOutcome === "CALLBACK" ? "" : "CALLBACK";
                                                        setCallOutcome(newOutcome);
                                                        if (newOutcome && !dateRdv) {
                                                            const tom = new Date(); tom.setDate(tom.getDate() + 1);
                                                            setDateRdv(tom.toISOString().split('T')[0]);
                                                            if (!heureRdv) setHeureRdv("10:00");
                                                        }
                                                    }}
                                                    className={`p-2 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
                                                        callOutcome === "CALLBACK" ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    📞 Rappel tel.
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newOutcome = callOutcome === "INTERESTED" ? "" : "INTERESTED";
                                                        setCallOutcome(newOutcome);
                                                        if (newOutcome && !dateRdv) {
                                                            const tom = new Date(); tom.setDate(tom.getDate() + 1);
                                                            setDateRdv(tom.toISOString().split('T')[0]);
                                                            if (!heureRdv) setHeureRdv("14:00");
                                                        }
                                                    }}
                                                    className={`p-2 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
                                                        callOutcome === "INTERESTED" ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                                    }`}
                                                >
                                                    🤝 RDV / Intéressé
                                                </button>
                                            </div>
                                        </div>

                                        {/* RDV & Reminder Fields */}
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5 text-blue-600" /> Planifier un RDV / Rappel (Optionnel)
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
                                                placeholder="Objet / Note du RDV..."
                                                value={noteRdv}
                                                onChange={(e) => setNoteRdv(e.target.value)}
                                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-3">
                                    {addError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{addError}</div>}
                                    {addSuccess && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold">{addSuccess}</div>}

                                    <Button
                                        type="button"
                                        onClick={(e) => {
                                            handleConfirmAddProspect(e);
                                        }}
                                        disabled={adding}
                                        className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                                    >
                                        {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "⚡ Valider & Transférer au CRM Prospect"}
                                    </Button>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
