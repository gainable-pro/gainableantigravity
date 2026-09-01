"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Search, MapPin, Building2, User, Phone, Globe, Star, 
    Loader2, SearchCheck, Sparkles, PlusCircle, ExternalLink, 
    Layers, Compass, ExternalLinkIcon, PhoneCall, X,
    CheckCircle2, AlertCircle, Edit3, Monitor, Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import franceRegionsData from "@/data/france_svg_regions.json";

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
    { code: "ALL", name: "Toutes les régions (37 372)", count: "37 372" },
    { code: "PROVENCE ALPES COTE D'AZUR", name: "PACA (13, 06, 83, 84)", count: "5 420" },
    { code: "AUVERGNE RHONE ALPES", name: "Auvergne-Rhône-Alpes (69, 38, 74)", count: "5 180" },
    { code: "ILE-DE-FRANCE", name: "Île-de-France (75, 92, 93, 94)", count: "6 850" },
    { code: "OCCITANIE", name: "Occitanie (31, 34, 30, 66)", count: "4 310" },
    { code: "NOUVELLE AQUITAINE", name: "Nouvelle-Aquitaine (33, 64, 17)", count: "4 120" },
    { code: "HAUTS-DE-FRANCE", name: "Hauts-de-France (59, 62, 80)", count: "3 250" },
    { code: "GRAND EST", name: "Grand Est (67, 68, 54, 57)", count: "3 190" },
    { code: "BRETAGNE", name: "Bretagne (35, 29, 56, 22)", count: "2 140" },
    { code: "PAYS DE LA LOIRE", name: "Pays de la Loire (44, 49, 72)", count: "2 010" },
    { code: "BOURGOGNE FRANCHE COMTE", name: "Bourgogne-Franche-Comté (21, 25, 39)", count: "890" },
];

export default function ProspecterCvcPage() {
    const [companies, setCompanies] = useState<CvcCompany[]>([]);
    const [totalMatches, setTotalMatches] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [selectedRegion, setSelectedRegion] = useState("ALL");
    const [cityQuery, setCityQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Hover state for interactive map tooltip
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

    // Qualification & Transfer Modal States
    const [selectedCompany, setSelectedCompany] = useState<CvcCompany | null>(null);
    const [contactEmail, setContactEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editWebsite, setEditWebsite] = useState("");
    const [adding, setAdding] = useState(false);
    const [addSuccess, setAddSuccess] = useState("");
    const [addError, setAddError] = useState("");

    // Live Google Browser Modal State
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

    const handleOpenGoogleBrowser = (company: CvcCompany) => {
        setGoogleSearchCompany(company);
        setEditPhone(company.telephone || "");
        setEditWebsite(company.siteWeb || "");
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
                    telephone: editPhone || selectedCompany.telephone || "",
                    siret: selectedCompany.siret || "",
                    adresse: `${selectedCompany.adresse || ''} ${selectedCompany.codePostal || ''} ${selectedCompany.ville || ''}`.trim(),
                    siteWeb: editWebsite || selectedCompany.siteWeb || "",
                    status: "NON_CONTACTE",
                    commentaire: `Prospect qualifié Moteur CVC Google Live - Gérant: ${selectedCompany.nomGerant || 'Dirigeant'}`
                })
            });

            if (res.ok) {
                setAddSuccess("Entreprise qualifiée et enregistrée dans votre CRM prospect !");
                setTimeout(() => {
                    setSelectedCompany(null);
                    setGoogleSearchCompany(null);
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
                            <Sparkles className="h-4 w-4" /> Base Nationale CVC (37 372 Entreprises Certifiées)
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2D3D] flex items-center gap-3">
                            🗺️ Moteur de Prospection CVC & Google Live
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Cliquez sur n'importe quelle région de la carte de France ci-dessous pour filtrer les 37 372 entreprises CVC.
                        </p>
                    </div>

                    <Link href="/commercial/prospects">
                        <Button variant="outline" className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold gap-2">
                            ← Retour aux Prospects
                        </Button>
                    </Link>
                </div>

                {/* OFFICIAL REAL GEOGRAPHICAL FRANCE MAP */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                        
                        {/* 100% REAL Vector France Map SVG */}
                        <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-inner min-h-[300px]">
                            <div className="text-xs font-extrabold uppercase text-[#1F2D3D] tracking-wider mb-1 flex items-center gap-1.5">
                                <Compass className="h-4 w-4 text-[#D59B2B]" /> Carte Géographique Officielle de France
                            </div>
                            <div className="text-[11px] text-slate-500 mb-2">
                                Contour réel des 13 régions métropolitaines
                            </div>
                            
                            <svg viewBox="0 0 500 480" className="w-full h-64 drop-shadow-md">
                                <defs>
                                    <filter id="regionGlow" x="-10%" y="-10%" width="120%" height="120%">
                                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.12"/>
                                    </filter>
                                </defs>

                                <g filter="url(#regionGlow)">
                                    {franceRegionsData.map((reg: any) => {
                                        const isSelected = selectedRegion === reg.regionCode;
                                        const isHovered = hoveredRegion === reg.regionCode;

                                        return (
                                            <path
                                                key={reg.code}
                                                d={reg.path}
                                                fill={isSelected ? "#D59B2B" : isHovered ? "#3b82f6" : "#cbd5e1"}
                                                stroke="#ffffff"
                                                strokeWidth="1.5"
                                                strokeLinejoin="round"
                                                className="cursor-pointer transition-all duration-200 hover:opacity-90"
                                                onClick={() => setSelectedRegion(reg.regionCode)}
                                                onMouseEnter={() => setHoveredRegion(reg.regionCode)}
                                                onMouseLeave={() => setHoveredRegion(null)}
                                            >
                                                <title>{reg.nom}</title>
                                            </path>
                                        );
                                    })}
                                </g>
                            </svg>

                            <div className="text-xs font-bold text-slate-700 mt-2 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
                                <span className="w-2.5 h-2.5 bg-[#D59B2B] rounded-full inline-block"></span>
                                Région sélectionnée : <span className="text-[#2563EB] font-extrabold">{selectedRegion}</span>
                            </div>
                        </div>

                        {/* Region Buttons List */}
                        <div className="lg:col-span-2 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                                    Filtrer par Région (37 372 Entreprises) :
                                </label>
                                {selectedRegion !== "ALL" && (
                                    <button onClick={() => setSelectedRegion("ALL")} className="text-xs text-blue-600 hover:underline font-bold">
                                        Voir toutes les régions ↺
                                    </button>
                                )}
                            </div>

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
                                placeholder="Recherche par Ville (ex: Marseille, Miramas, Lyon...)"
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
                                    {/* Company Title & Clean Real Rating */}
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

                                        {comp.noteGoogle && comp.nombreAvis && comp.noteGoogle > 0 ? (
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
                                        {comp.telephone ? (
                                            <div className="flex items-center justify-between text-slate-900 font-bold pt-1">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                                    <span className="font-sans font-medium text-slate-600">Tél :</span> {comp.telephone}
                                                </div>
                                                <a href={`tel:${comp.telephone}`} className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-md hover:bg-emerald-100 transition-colors font-sans">
                                                    Appeler 📞
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 font-sans italic text-[11px]">
                                                📞 Téléphone non renseigné dans le fichier (Vérifiable sur Google Live)
                                            </div>
                                        )}
                                        {comp.siteWeb ? (
                                            <div className="flex items-center gap-2 text-blue-600 truncate font-sans pt-0.5">
                                                <Globe className="h-3.5 w-3.5 shrink-0" />
                                                <a href={`https://${comp.siteWeb.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate font-semibold">
                                                    {comp.siteWeb}
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="text-amber-800 bg-amber-50/80 px-2 py-1 rounded text-[11px] font-sans font-semibold border border-amber-200">
                                                ⚠️ Pas de site internet renseigné
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => handleOpenGoogleBrowser(comp)}
                                        className="w-full py-2.5 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <SearchCheck className="h-4 w-4 text-blue-600" />
                                        Vérification & Aperçu Google Live 🌐
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedCompany(comp);
                                            setContactEmail(comp.email || "");
                                            setEditPhone(comp.telephone || "");
                                            setEditWebsite(comp.siteWeb || "");
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

                {/* Google Live Search & Verification Window (4-BLOCK COMPLETE LAYOUT) */}
                {googleSearchCompany && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-white border border-slate-300 rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
                            
                            {/* Browser Window Header */}
                            <div className="bg-slate-200 border-b border-slate-300 p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span>
                                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                                    <span className="text-xs font-bold text-slate-700 ml-2 font-mono">Google Live Search & Real-Time Verification Browser</span>
                                </div>

                                <button onClick={() => setGoogleSearchCompany(null)} className="text-slate-500 hover:text-slate-800 p-1">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Browser Content - 4 BLOCKS LAYOUT */}
                            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50">
                                
                                {/* BLOC 1: Direct Google Search Link Action Header */}
                                <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm space-y-3">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
                                                <Globe className="h-4 w-4" /> Recherche Google Officielle en Direct
                                            </div>
                                            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                                                {googleSearchCompany.nomEntreprise} ({googleSearchCompany.ville})
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Consultez l'écran de recherche intégré ci-dessous ou ouvrez-le dans un nouvel onglet.
                                            </p>
                                        </div>

                                        <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || ''}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md shrink-0"
                                        >
                                            Ouvrir la recherche Google officielle pour {googleSearchCompany.nomEntreprise} <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>

                                {/* BLOC 2 & BLOC 3: Enterprise Details + Qualification Form */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* BLOC 2: Enterprise Details & Pitch */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                                        <div className="border-b border-slate-100 pb-3">
                                            <h4 className="font-extrabold text-slate-900 text-base">{googleSearchCompany.nomEntreprise}</h4>
                                            <div className="text-slate-500 font-medium">SIRET : {googleSearchCompany.siret || 'Non renseigné'}</div>
                                        </div>

                                        <div className="space-y-2 text-slate-700 font-medium">
                                            <div><strong>Gérant principal :</strong> {googleSearchCompany.nomGerant || 'Dirigeant'}</div>
                                            <div><strong>Adresse :</strong> {googleSearchCompany.adresse || 'Siège'} {googleSearchCompany.codePostal} {googleSearchCompany.ville}</div>
                                            <div><strong>Région :</strong> {googleSearchCompany.region || 'France'}</div>
                                        </div>

                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5 text-amber-900 text-xs">
                                            <div className="font-extrabold flex items-center gap-1.5 text-amber-800">
                                                <Sparkles className="h-4 w-4 text-[#D59B2B]" /> Argumentaire Commercial Détecté :
                                            </div>
                                            {editWebsite ? (
                                                <p>
                                                    Cette entreprise possède un site internet ({editWebsite}). Proposez-lui notre audit d'indexation locale pour démultiplier son trafic sur Gainable.fr.
                                                </p>
                                            ) : (
                                                <p className="font-semibold">
                                                    ⚠️ Cette entreprise n'a aucun site web référencé sur Google ! Prospect prioritaire pour notre offre de référencement.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* BLOC 3: Live Qualification Form */}
                                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
                                        <div className="border-b border-slate-100 pb-3">
                                            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                                                <Edit3 className="h-4 w-4 text-[#D59B2B]" /> Enregistrer / Compléter les Données Google
                                            </h4>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                                    E-mail du Contact / Gérant * :
                                                </label>
                                                <input
                                                    type="email"
                                                    placeholder="contact@entreprise.fr"
                                                    value={contactEmail}
                                                    onChange={(e) => setContactEmail(e.target.value)}
                                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                                    Téléphone direct (vu sur Google) :
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: 04 90 58 00 00 ou 06..."
                                                    value={editPhone}
                                                    onChange={(e) => setEditPhone(e.target.value)}
                                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                                                    Site Web officiel (vu sur Google) :
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="ex: www.entreprise.fr"
                                                    value={editWebsite}
                                                    onChange={(e) => setEditWebsite(e.target.value)}
                                                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        {addError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">{addError}</div>}
                                        {addSuccess && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl">{addSuccess}</div>}

                                        <Button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCompany(googleSearchCompany);
                                                handleConfirmAddProspect();
                                            }}
                                            disabled={adding || !contactEmail}
                                            className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold text-xs py-3 rounded-xl shadow-md transition-all"
                                        >
                                            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "⚡ Valider & Transférer au CRM Prospect"}
                                        </Button>
                                    </div>

                                </div>

                                {/* BLOC 4 (NOUVEAU): ÉCRAN INTEGRE VISUEL DU NAVIGATEUR GOOGLE LIVE */}
                                <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-lg space-y-0">
                                    
                                    {/* Embedded Browser Header */}
                                    <div className="bg-slate-200 border-b border-slate-300 px-4 py-2.5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Monitor className="h-4 w-4 text-blue-600" />
                                            <span className="text-xs font-bold text-slate-800 font-sans">
                                                Écran Intégré Google Live Search : {googleSearchCompany.nomEntreprise} {googleSearchCompany.ville}
                                            </span>
                                        </div>

                                        {/* Embedded Address Bar */}
                                        <div className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-[11px] text-slate-600 font-mono flex items-center gap-2 max-w-md w-full truncate shadow-inner">
                                            <Globe className="h-3 w-3 text-slate-400 shrink-0" />
                                            <span className="truncate">https://www.google.com/search?q={encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || ''}`)}</span>
                                        </div>

                                        <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || ''}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1 shrink-0"
                                        >
                                            Plein Écran <Maximize2 className="h-3.5 w-3.5" />
                                        </a>
                                    </div>

                                    {/* Embedded Live Google iFrame View */}
                                    <div className="relative w-full h-[450px] bg-slate-100 border-t border-slate-200">
                                        <iframe
                                            src={`https://www.google.com/search?igu=1&q=${encodeURIComponent(`${googleSearchCompany.nomEntreprise} ${googleSearchCompany.ville || ''}`)}`}
                                            className="w-full h-full border-0"
                                            title={`Google Live Search - ${googleSearchCompany.nomEntreprise}`}
                                            loading="lazy"
                                        />
                                    </div>

                                </div>

                                {/* Modal Footer Actions */}
                                <div className="flex justify-end pt-2 border-t border-slate-200">
                                    <Button type="button" variant="outline" onClick={() => setGoogleSearchCompany(null)} className="border-slate-300 text-slate-700 bg-white">
                                        Fermer la fenêtre
                                    </Button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Add to Prospect Modal */}
                {selectedCompany && !googleSearchCompany && (
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
                                {(editPhone || selectedCompany.telephone) && <div className="text-slate-600 font-bold">Tél : {editPhone || selectedCompany.telephone}</div>}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-700 block mb-1">
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
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-700 block mb-1">
                                        Téléphone direct :
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ex: 04 90..."
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
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
