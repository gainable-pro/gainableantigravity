"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Search, MapPin, Building2, User, Phone, Globe, Star, 
    Loader2, SearchCheck, Sparkles, PlusCircle, ExternalLink, 
    Layers, Compass, ExternalLinkIcon, PhoneCall, RefreshCw, X,
    CheckCircle2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CvcCompany {
    id: string;
    nomEntreprise: string;
    nomGerant?: string;
    siren?: string;
    siret?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    departement?: string;
    region?: string;
    telephone?: string;
    email?: string;
    siteWeb?: string;
    noteGoogle?: number;
    nombreAvis?: number;
    chiffreAffaires?: string;
    accroche?: string;
}

const REGIONS_LIST = [
    { code: "ALL", name: "Toutes les régions", count: "14 602", color: "bg-slate-100 border-slate-300 text-slate-800" },
    { code: "PROVENCE ALPES COTE D'AZUR", name: "PACA", dept: "13, 06, 83, 84, 04, 05", path: "M 320 220 L 360 210 L 390 250 L 340 270 Z" },
    { code: "AUVERGNE RHONE ALPES", name: "Auvergne-Rhône-Alpes", dept: "69, 38, 74, 42, 63", path: "M 270 160 L 340 150 L 350 210 L 280 210 Z" },
    { code: "ILE-DE-FRANCE", name: "Île-de-France", dept: "75, 92, 93, 94, 77, 78", path: "M 210 90 L 240 85 L 245 110 L 210 115 Z" },
    { code: "OCCITANIE", name: "Occitanie", dept: "31, 34, 30, 66, 11", path: "M 200 230 L 280 220 L 290 275 L 210 280 Z" },
    { code: "NOUVELLE AQUITAINE", name: "Nouvelle-Aquitaine", dept: "33, 64, 17, 86, 24", path: "M 130 160 L 200 150 L 210 240 L 120 230 Z" },
    { code: "HAUTS-DE-FRANCE", name: "Hauts-de-France", dept: "59, 62, 80, 60", path: "M 200 30 L 260 30 L 250 80 L 190 70 Z" },
    { code: "GRAND EST", name: "Grand Est", dept: "67, 68, 54, 57, 51", path: "M 260 60 L 340 50 L 350 110 L 260 110 Z" },
    { code: "BRETAGNE", name: "Bretagne", dept: "35, 29, 56, 22", path: "M 60 100 L 120 95 L 125 130 L 55 125 Z" },
    { code: "PAYS DE LA LOIRE", name: "Pays de la Loire", dept: "44, 49, 72, 85", path: "M 120 120 L 180 115 L 175 160 L 115 155 Z" },
];

export default function ProspecterCvcPage() {
    const [companies, setCompanies] = useState<CvcCompany[]>([]);
    const [totalMatches, setTotalMatches] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [selectedRegion, setSelectedRegion] = useState("ALL");
    const [cityQuery, setCityQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal & Side-panel States
    const [selectedCompany, setSelectedCompany] = useState<CvcCompany | null>(null);
    const [contactEmail, setContactEmail] = useState("");
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");
    const [addError, setAddError] = useState("");

    // Visual Google Browser Modal State
    const [googleSearchCompany, setGoogleSearchCompany] = useState<CvcCompany | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, [selectedRegion]);

    const fetchCompanies = async (query = searchQuery, city = cityQuery) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedRegion !== "ALL") params.append("region", selectedRegion);
            if (query) params.append("search", query);
            if (city) params.append("ville", city);

            const res = await fetch(`/api/commercial/prospecting-database?${params.toString()}`);
            const data = await res.json();
            if (res.ok) {
                setCompanies(data.companies || []);
                setTotalMatches(data.totalMatches || data.companies?.length || 0);
            }
        } catch (e) {
            console.error("Erreur lors de la récupération de la base CVC", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCompanies(searchQuery, cityQuery);
    };

    const handleConfirmAddProspect = async () => {
        if (!selectedCompany) return;
        setAdding(true);
        setAddError("");
        setAddSuccess("");

        try {
            const res = await fetch("/api/commercial/prospects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nomEntreprise: selectedCompany.nomEntreprise,
                    nomContact: selectedCompany.nomGerant?.split(" ")[1] || "Contact",
                    prenomContact: selectedCompany.nomGerant?.split(" ")[0] || "Dirigeant",
                    email: contactEmail,
                    telephone: selectedCompany.telephone || "",
                    siret: selectedCompany.siret || "",
                    adresse: `${selectedCompany.adresse || ''} ${selectedCompany.codePostal || ''} ${selectedCompany.ville || ''}`.trim(),
                    siteWeb: selectedCompany.siteWeb || "",
                    status: "NON_CONTACTE",
                    commentaire: `Prospect qualifié Moteur CVC - Gérant: ${selectedCompany.nomGerant || 'Dirigeant'}`
                })
            });

            if (res.ok) {
                setAddSuccess("Entreprise ajoutée à votre CRM prospect avec succès !");
                setTimeout(() => {
                    setSelectedCompany(null);
                    setContactEmail("");
                    setAddSuccess("");
                }, 1800);
            } else {
                const d = await res.json();
                setAddError(d.message || "Erreur lors de l'ajout");
            }
        } catch (e) {
            setAddError("Erreur technique lors de l'ajout");
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
                        <div className="flex items-center gap-2 text-[#D59B2B] font-extrabold text-xs uppercase tracking-widest mb-1">
                            <Sparkles className="h-4 w-4" /> Base Nationale CVC (14 602 Entreprises Certifiées)
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2D3D] flex items-center gap-3">
                            🗺️ Moteur de Prospection CVC & Carte de France
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Sélectionnez une région sur la carte ou recherchez par ville, consultez la fiche officielle et qualifiez vos prospects.
                        </p>
                    </div>

                    <Link href="/commercial/prospects">
                        <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold gap-2">
                            ← Retour aux Prospects
                        </Button>
                    </Link>
                </div>

                {/* Interactive France Map & Filters Card (Light Theme) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                        
                        {/* Interactive France Map Widget */}
                        <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="text-xs font-bold uppercase text-[#1F2D3D] tracking-wider mb-2 flex items-center gap-1.5">
                                <Compass className="h-4 w-4 text-[#D59B2B]" /> Carte de France Interactive
                            </div>
                            
                            <svg viewBox="0 0 400 300" className="w-full h-48 drop-shadow">
                                {/* Base France outline & regions */}
                                <rect width="400" height="300" fill="#f8fafc" rx="12" />

                                {/* Interactive Region Clusters */}
                                <g>
                                    <path
                                        d="M 180 20 L 260 20 L 250 75 L 180 65 Z"
                                        fill={selectedRegion === "HAUTS-DE-FRANCE" ? "#D59B2B" : "#cbd5e1"}
                                        className="cursor-pointer hover:fill-amber-400 transition-colors"
                                        onClick={() => setSelectedRegion("HAUTS-DE-FRANCE")}
                                    />
                                    <path
                                        d="M 265 40 L 350 40 L 340 105 L 255 100 Z"
                                        fill={selectedRegion === "GRAND EST" ? "#D59B2B" : "#94a3b8"}
                                        className="cursor-pointer hover:fill-amber-400 transition-colors"
                                        onClick={() => setSelectedRegion("GRAND EST")}
                                    />
                                    <path
                                        d="M 195 85 L 245 80 L 250 115 L 195 120 Z"
                                        fill={selectedRegion === "ILE-DE-FRANCE" ? "#D59B2B" : "#2563eb"}
                                        className="cursor-pointer hover:fill-amber-400 transition-colors"
                                        onClick={() => setSelectedRegion("ILE-DE-FRANCE")}
                                    />
                                    <path
                                        d="M 270 140 L 350 130 L 360 200 L 275 200 Z"
                                        fill={selectedRegion === "AUVERGNE RHONE ALPES" ? "#D59B2B" : "#cbd5e1"}
                                        className="cursor-pointer hover:fill-amber-400 transition-colors"
                                        onClick={() => setSelectedRegion("AUVERGNE RHONE ALPES")}
                                    />
                                    <path
                                        d="M 300 205 L 375 195 L 385 260 L 310 265 Z"
                                        fill={selectedRegion === "PROVENCE ALPES COTE D'AZUR" ? "#D59B2B" : "#fbbf24"}
                                        className="cursor-pointer hover:fill-amber-300 transition-colors"
                                        onClick={() => setSelectedRegion("PROVENCE ALPES COTE D'AZUR")}
                                    />
                                    <path
                                        d="M 190 210 L 295 200 L 300 270 L 195 275 Z"
                                        fill={selectedRegion === "OCCITANIE" ? "#D59B2B" : "#94a3b8"}
                                        className="cursor-pointer hover:fill-amber-400 transition-colors"
                                        onClick={() => setSelectedRegion("OCCITANIE")}
                                    />
                                    <path
                                        d="M 110 150 L 185 140 L 195 240 L 105 235 Z"
                                        fill={selectedRegion === "NOUVELLE AQUITAINE" ? "#D59B2B" : "#cbd5e1"}
                                        className="cursor-pointer hover:fill-amber-400 transition-colors"
                                        onClick={() => setSelectedRegion("NOUVELLE AQUITAINE")}
                                    />
                                    <path
                                        d="M 45 90 L 115 85 L 120 130 L 40 125 Z"
                                        fill={selectedRegion === "BRETAGNE" ? "#D59B2B" : "#94a3b8"}
                                        className="cursor-pointer hover:fill-amber-400 transition-colors"
                                        onClick={() => setSelectedRegion("BRETAGNE")}
                                    />
                                </g>

                                <text x="200" y="290" textAnchor="middle" className="text-[10px] font-extrabold fill-slate-500">
                                    Cliquez sur une région pour filtrer
                                </text>
                            </svg>

                            <div className="text-[11px] font-bold text-slate-600 mt-2">
                                Région sélectionnée : <span className="text-[#2563EB] font-extrabold">{selectedRegion}</span>
                            </div>
                        </div>

                        {/* Region Buttons List */}
                        <div className="lg:col-span-2 space-y-3">
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider block">
                                Choisir par Région d'activité :
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {REGIONS_LIST.map((reg) => (
                                    <button
                                        key={reg.code}
                                        onClick={() => setSelectedRegion(reg.code)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                            selectedRegion === reg.code
                                                ? "bg-[#1F2D3D] text-white border-[#1F2D3D] shadow-md scale-105"
                                                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        {reg.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Dual Search Input Bar (City + Keyword) */}
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                        {/* City Filter */}
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D59B2B]" />
                            <input
                                type="text"
                                placeholder="Recherche par Ville (ex: Marseille, Lyon, Nice...)"
                                value={cityQuery}
                                onChange={(e) => setCityQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                            />
                        </div>

                        {/* Keyword / SIRET Filter */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" />
                            <input
                                type="text"
                                placeholder="Recherche Entreprise, Gérant ou SIRET..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <Button type="submit" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold text-sm rounded-xl py-3 shadow-md">
                            🔍 Lancer la Prospection CVC
                        </Button>
                    </form>
                </div>

                {/* Results Count Header */}
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span>
                        Résultats qualifiés : <strong className="text-[#1F2D3D] font-mono text-sm">{totalMatches || companies.length}</strong> entreprise(s) CVC trouvée(s)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <Layers className="h-3.5 w-3.5 text-blue-600" /> Fiches Blanches Vérifiées (Societe.com & INSEE)
                    </span>
                </div>

                {/* White Cards Companies Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-[#D59B2B]" />
                    </div>
                ) : companies.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3 shadow-sm">
                        <Building2 className="h-12 w-12 mx-auto text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-800">Aucune entreprise trouvée</h3>
                        <p className="text-xs">Essayez de modifier votre ville ou votre recherche.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((comp) => (
                            <div key={comp.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-[#D59B2B]/60 transition-all flex flex-col justify-between space-y-4 shadow-sm group">
                                <div className="space-y-3">
                                    {/* Company Title & Clean Real Rating (Only if explicitly present) */}
                                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                                        <div>
                                            <h3 className="font-extrabold text-[#1F2D3D] text-base group-hover:text-[#D59B2B] transition-colors leading-snug">
                                                {comp.nomEntreprise}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                                                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                <span>{comp.ville} ({comp.departement || comp.codePostal?.slice(0, 2)})</span>
                                            </div>
                                        </div>

                                        {/* Display rating ONLY if real rating exists */}
                                        {comp.noteGoogle && comp.nombreAvis && comp.noteGoogle > 0 && comp.nombreAvis > 0 ? (
                                            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
                                                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                                {comp.noteGoogle} ({comp.nombreAvis})
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Enriched Info Box */}
                                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs text-slate-700 font-mono">
                                        {comp.nomGerant && (
                                            <div className="flex items-center gap-2 text-slate-900 font-sans">
                                                <User className="h-3.5 w-3.5 text-[#D59B2B] shrink-0" />
                                                <span className="font-bold text-slate-600">Gérant :</span> {comp.nomGerant}
                                            </div>
                                        )}
                                        {comp.siret && (
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Building2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                                <span className="font-sans font-medium">SIRET :</span> {comp.siret}
                                            </div>
                                        )}
                                        {comp.telephone && (
                                            <div className="flex items-center justify-between text-slate-900 font-bold pt-1">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                                    <span className="font-sans font-medium text-slate-600">Tél :</span> {comp.telephone}
                                                </div>
                                                <a href={`tel:${comp.telephone}`} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors font-sans">
                                                    Appeler 📞
                                                </a>
                                            </div>
                                        )}
                                        {comp.siteWeb && (
                                            <div className="flex items-center gap-2 text-blue-600 truncate font-sans pt-0.5">
                                                <Globe className="h-3.5 w-3.5 shrink-0" />
                                                <a href={`https://${comp.siteWeb.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate font-semibold">
                                                    {comp.siteWeb}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => setGoogleSearchCompany(comp)}
                                        className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <SearchCheck className="h-4 w-4 text-blue-600" />
                                        Aperçu Navigateur Google Live 🌐
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedCompany(comp);
                                            setContactEmail(comp.email || "");
                                        }}
                                        className="w-full py-2.5 px-3 bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Qualifier & Ajouter à mes prospects CRM
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Visual Google Search Browser Modal (Simulated Web Browser Panel) */}
                {googleSearchCompany && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-white border border-slate-300 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            
                            {/* Browser Top Bar Window Header */}
                            <div className="bg-slate-200 border-b border-slate-300 p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                                    <span className="text-xs font-bold text-slate-600 ml-2 font-mono">Google Search Browser</span>
                                </div>

                                {/* Address Bar */}
                                <div className="bg-white border border-slate-300 rounded-lg px-4 py-1 text-xs text-slate-600 font-mono flex items-center gap-2 flex-1 max-w-lg mx-4 truncate shadow-inner">
                                    <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">https://www.google.com/search?q={encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || ''}`)}</span>
                                </div>

                                <button onClick={() => setGoogleSearchCompany(null)} className="text-slate-500 hover:text-slate-800 p-1">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Browser Content */}
                            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50">
                                
                                {/* Simulated Google Search Header */}
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4 bg-white p-4 rounded-xl border">
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-extrabold font-serif text-blue-600 tracking-tight">G<span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-600">g</span><span className="text-green-600">l</span><span className="text-red-500">e</span></span>
                                        <div className="bg-slate-100 border border-slate-300 rounded-full px-4 py-2 text-sm text-slate-800 font-medium font-sans flex items-center gap-2 w-72 md:w-96 shadow-sm">
                                            <Search className="h-4 w-4 text-slate-400" />
                                            <span className="truncate">{googleSearchCompany.nomEntreprise} {googleSearchCompany.ville}</span>
                                        </div>
                                    </div>

                                    <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || ''}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                                    >
                                        Ouvrir sur Google.com <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>

                                {/* Visual Google Local Knowledge Panel Card */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    
                                    {/* Left: Search Result Snippets */}
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                                            <div className="text-xs text-slate-500 font-mono truncate">
                                                {googleSearchCompany.siteWeb ? `https://${googleSearchCompany.siteWeb}` : `https://annuaire-entreprises.data.gouv.fr/entreprise/${googleSearchCompany.siret || ''}`}
                                            </div>
                                            <h4 className="text-base font-bold text-blue-700 hover:underline cursor-pointer">
                                                {googleSearchCompany.nomEntreprise} à {googleSearchCompany.ville} ({googleSearchCompany.codePostal})
                                            </h4>
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                {googleSearchCompany.nomGerant ? `Présentation de l'entreprise dirigée par ${googleSearchCompany.nomGerant}. ` : ''}
                                                Spécialiste travaux d'installation d'équipements thermiques, chauffage et climatisation réversible. SIRET : {googleSearchCompany.siret || 'N/C'}.
                                            </p>
                                        </div>

                                        {/* SEO Audit Warning Box */}
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2 text-xs text-amber-900">
                                            <div className="font-extrabold flex items-center gap-1.5 text-amber-800">
                                                <Sparkles className="h-4 w-4 text-[#D59B2B]" /> Diagnostic Visibilité Web pour le Commercial :
                                            </div>
                                            {googleSearchCompany.siteWeb ? (
                                                <p>
                                                    Cette entreprise possède un site web ({googleSearchCompany.siteWeb}). Vérifiez avec l'outil d'indexation `site:` si son référencement est suffisant.
                                                </p>
                                            ) : (
                                                <p className="font-semibold text-amber-900">
                                                    ⚠️ Cette entreprise n'a pas de site internet officiel référencé ! Prospect idéal pour l'offre référencement Gainable.fr.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Google Business Knowledge Panel */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
                                        <div className="border-b border-slate-100 pb-3">
                                            <h4 className="font-extrabold text-slate-900 text-base">{googleSearchCompany.nomEntreprise}</h4>
                                            <div className="text-slate-500 text-xs">Chauffagiste & Climatisation</div>
                                        </div>

                                        <div className="space-y-2 text-slate-700">
                                            <div><strong>Adresse :</strong> {googleSearchCompany.adresse || 'Siège'} {googleSearchCompany.codePostal} {googleSearchCompany.ville}</div>
                                            {googleSearchCompany.telephone && (
                                                <div className="font-mono text-emerald-700 font-bold">
                                                    <strong>Téléphone :</strong> {googleSearchCompany.telephone}
                                                </div>
                                            )}
                                            {googleSearchCompany.nomGerant && <div><strong>Dirigeant :</strong> {googleSearchCompany.nomGerant}</div>}
                                        </div>

                                        {googleSearchCompany.telephone && (
                                            <a
                                                href={`tel:${googleSearchCompany.telephone}`}
                                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs shadow-sm transition-colors"
                                            >
                                                <PhoneCall className="h-4 w-4" /> Appeler directement
                                            </a>
                                        )}
                                    </div>

                                </div>

                                {/* Modal Actions */}
                                <div className="flex gap-3 pt-4 border-t border-slate-200">
                                    <Button type="button" variant="outline" onClick={() => setGoogleSearchCompany(null)} className="w-1/3 border-slate-300 text-slate-700 bg-white">
                                        Fermer
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const comp = googleSearchCompany;
                                            setGoogleSearchCompany(null);
                                            setSelectedCompany(comp);
                                            setContactEmail(comp.email || "");
                                        }}
                                        className="w-2/3 bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold text-xs shadow-md"
                                    >
                                        <PlusCircle className="h-4 w-4 mr-2" /> Synchroniser cette fiche & Ajouter au CRM Prospect
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Add to Prospect Modal (Light Theme) */}
                {selectedCompany && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <h3 className="font-extrabold text-[#1F2D3D] text-lg flex items-center gap-2">
                                    <PlusCircle className="h-5 w-5 text-[#D59B2B]" /> Qualifier & Transférer dans le CRM
                                </h3>
                                <button onClick={() => setSelectedCompany(null)} className="text-slate-400 hover:text-slate-700 font-bold text-xl">×</button>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                                <div className="font-extrabold text-slate-900 text-sm">{selectedCompany.nomEntreprise}</div>
                                {selectedCompany.nomGerant && <div className="text-slate-700">Gérant : {selectedCompany.nomGerant}</div>}
                                {selectedCompany.siret && <div className="text-slate-500">SIRET : {selectedCompany.siret}</div>}
                                {selectedCompany.telephone && <div className="text-slate-600 font-bold">Tél : {selectedCompany.telephone}</div>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-700 block">
                                    Saisir l'e-mail qualifié du contact * :
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ex: contact@entreprise.fr"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                />
                                <p className="text-[11px] text-slate-500">
                                    Cet e-mail permettra l'envoi immédiat de la demande de paiement Stripe et des offres Gainable.fr.
                                </p>
                            </div>

                            {addError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{addError}</div>}
                            {addSuccess && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">{addSuccess}</div>}

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setSelectedCompany(null)} className="w-1/2 border-slate-300 bg-white text-slate-700">
                                    Annuler
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmAddProspect}
                                    disabled={adding || !contactEmail}
                                    className="w-1/2 bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold"
                                >
                                    {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Valider & Enregistrer"}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
