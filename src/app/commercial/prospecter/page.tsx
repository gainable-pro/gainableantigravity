"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
    Search, MapPin, Building2, User, Phone, Globe, Star, 
    Loader2, SearchCheck, Sparkles, PlusCircle, ExternalLink, 
    Layers, Compass, ExternalLinkIcon, PhoneCall
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

const REGIONS_FRANCE = [
    { code: "ALL", label: "Toutes les régions (14 602)" },
    { code: "PROVENCE ALPES COTE D'AZUR", label: "PACA (13, 06, 83, 84)" },
    { code: "AUVERGNE RHONE ALPES", label: "Auvergne-Rhône-Alpes (69, 38, 74)" },
    { code: "ILE-DE-FRANCE", label: "Île-de-France (75, 92, 93, 94)" },
    { code: "OCCITANIE", label: "Occitanie (31, 34, 30, 66)" },
    { code: "NOUVELLE AQUITAINE", label: "Nouvelle-Aquitaine (33, 64, 17)" },
    { code: "HAUTS-DE-FRANCE", label: "Hauts-de-France (59, 62, 80)" },
    { code: "GRAND EST", label: "Grand Est (67, 68, 54, 57)" },
    { code: "BRETAGNE", label: "Bretagne (35, 29, 56, 22)" },
    { code: "PAYS DE LA LOIRE", label: "Pays de la Loire (44, 49, 72)" },
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

    // Google Live Search Panel State
    const [googleSearchCompany, setGoogleSearchCompany] = useState<CvcCompany | null>(null);
    const [googleQuery, setGoogleQuery] = useState("");

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

    const handleOpenGoogleLive = (company: CvcCompany) => {
        setGoogleSearchCompany(company);
        setGoogleQuery(`${company.nomEntreprise} ${company.ville || ''}`);
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
                    commentaire: `Prospect qualifié issu du Moteur CVC - Gérant: ${selectedCompany.nomGerant || 'Dirigeant'}`
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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
                            <Sparkles className="h-4 w-4" /> Base Nationale CVC & Climatisation (14 602 Entreprises)
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            🗺️ Moteur de Prospection CVC & Google Live
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Prospectez par Région ou par Ville, vérifiez les avis réels sur Google en direct et qualifiez vos prospects.
                        </p>
                    </div>

                    <Link href="/commercial/prospects">
                        <Button variant="outline" className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-white gap-2">
                            ← Retour aux Prospects
                        </Button>
                    </Link>
                </div>

                {/* France SVG Interactive Map & Filter Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                    
                    {/* Visual Interactive Regions Selection */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-xs font-bold uppercase text-amber-400 tracking-wider flex items-center gap-2">
                                <Compass className="h-4 w-4" /> Sélectionner une Région sur la Carte ou par filtre :
                            </label>
                            {selectedRegion !== "ALL" && (
                                <button
                                    onClick={() => setSelectedRegion("ALL")}
                                    className="text-xs text-blue-400 hover:underline font-bold"
                                >
                                    Afficher toutes les régions ↺
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {REGIONS_FRANCE.map((reg) => (
                                <button
                                    key={reg.code}
                                    onClick={() => setSelectedRegion(reg.code)}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                        selectedRegion === reg.code
                                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105"
                                            : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                                    }`}
                                >
                                    {reg.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dual Search Input Bar (City + Keyword) */}
                    <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        {/* City Filter */}
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
                            <input
                                type="text"
                                placeholder="Filtrer par Ville (ex: Marseille, Lyon, Nice...)"
                                value={cityQuery}
                                onChange={(e) => setCityQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>

                        {/* Keyword / SIRET Filter */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
                            <input
                                type="text"
                                placeholder="Recherche Entreprise, Gérant ou SIRET..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm rounded-xl py-3 shadow-md">
                            🔍 Lancer la Prospection CVC
                        </Button>
                    </form>
                </div>

                {/* Results Count Header */}
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>
                        Résultats trouvés : <strong className="text-amber-400 font-mono text-sm">{totalMatches || companies.length}</strong> entreprise(s) CVC qualifiée(s)
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                        <Layers className="h-3.5 w-3.5 text-blue-400" /> Données 100% Vérifiées (Societe.com & Google Local)
                    </span>
                </div>

                {/* Companies Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    </div>
                ) : companies.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
                        <Building2 className="h-12 w-12 mx-auto text-slate-600" />
                        <h3 className="text-lg font-bold text-white">Aucune entreprise trouvée dans cette zone</h3>
                        <p className="text-xs">Modifiez la région ou le nom de la ville.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((comp) => (
                            <div key={comp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-4 shadow-md group">
                                <div className="space-y-3">
                                    {/* Company Title & REAL Ratings (No fake fallback) */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-extrabold text-white text-base group-hover:text-amber-400 transition-colors">
                                                {comp.nomEntreprise}
                                            </h3>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                                <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                                <span>{comp.ville} ({comp.departement || comp.codePostal?.slice(0, 2)})</span>
                                            </div>
                                        </div>

                                        {/* Display rating ONLY if real rating exists in dataset */}
                                        {comp.noteGoogle && comp.nombreAvis && comp.noteGoogle > 0 && comp.nombreAvis > 0 ? (
                                            <div className="bg-amber-950/70 border border-amber-800/60 text-amber-300 text-[11px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shrink-0">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                {comp.noteGoogle} ({comp.nombreAvis})
                                            </div>
                                        ) : null}
                                    </div>

                                    {/* Enriched Info */}
                                    <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 space-y-1.5 text-xs text-slate-300 font-mono">
                                        {comp.nomGerant && (
                                            <div className="flex items-center gap-2 text-slate-200">
                                                <User className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                                <span className="font-sans font-semibold text-slate-300">Gérant :</span> {comp.nomGerant}
                                            </div>
                                        )}
                                        {comp.siret && (
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Building2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                                                <span className="font-sans">SIRET :</span> {comp.siret}
                                            </div>
                                        )}
                                        {comp.telephone && (
                                            <div className="flex items-center justify-between text-slate-200 font-bold">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                                    <span className="font-sans">Tél :</span> {comp.telephone}
                                                </div>
                                                <a href={`tel:${comp.telephone}`} className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md hover:bg-emerald-900 transition-colors">
                                                    Appeler 📞
                                                </a>
                                            </div>
                                        )}
                                        {comp.siteWeb && (
                                            <div className="flex items-center gap-2 text-blue-400 truncate">
                                                <Globe className="h-3.5 w-3.5 shrink-0" />
                                                <a href={`https://${comp.siteWeb.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                                    {comp.siteWeb}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                                    <button
                                        onClick={() => handleOpenGoogleLive(comp)}
                                        className="w-full py-2 px-3 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/60 text-blue-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <SearchCheck className="h-4 w-4 text-blue-400" />
                                        Aperçu Google Live & Local Search 🌐
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedCompany(comp);
                                            setContactEmail(comp.email || "");
                                        }}
                                        className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-amber-500/10"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        Qualifier & Ajouter à mes prospects CRM
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Google Live Search Split-View Side Panel / Modal */}
                {googleSearchCompany && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-slate-900 border border-blue-500/50 rounded-2xl p-6 max-w-3xl w-full space-y-5 shadow-2xl max-h-[90vh] flex flex-col">
                            
                            {/* Panel Header */}
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <div>
                                    <div className="text-xs font-bold uppercase text-blue-400 tracking-wider flex items-center gap-1.5">
                                        <SearchCheck className="h-4 w-4" /> Google Live Search & Local Business Card
                                    </div>
                                    <h3 className="font-extrabold text-white text-lg mt-0.5">
                                        {googleSearchCompany.nomEntreprise} ({googleSearchCompany.ville})
                                    </h3>
                                </div>
                                <button onClick={() => setGoogleSearchCompany(null)} className="text-slate-400 hover:text-white font-bold text-2xl">×</button>
                            </div>

                            {/* Direct Google Actions Bar */}
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                    <div className="space-y-1">
                                        <div className="font-bold text-slate-200">Recherche Google pré-configurée :</div>
                                        <div className="text-slate-400 font-mono text-[11px] truncate max-w-md">
                                            {googleQuery}
                                        </div>
                                    </div>
                                    <a
                                        href={`https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-xs transition-colors shrink-0 shadow-md"
                                    >
                                        <ExternalLinkIcon className="h-4 w-4" /> Ouvrir sur Google.com dans un nouvel onglet ➜
                                    </a>
                                </div>
                            </div>

                            {/* Live Search & Local Details Summary */}
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 overflow-y-auto max-h-[50vh]">
                                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                                    <span className="font-bold text-amber-400">Informations Réelles Identifiées :</span>
                                    {googleSearchCompany.siteWeb ? (
                                        <span className="text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                                            ✓ Présence Web Détectée ({googleSearchCompany.siteWeb})
                                        </span>
                                    ) : (
                                        <span className="text-amber-300 font-bold bg-amber-950 border border-amber-800 px-2 py-0.5 rounded">
                                            ⚠️ Pas de site officiel trouvé (Prospect à fort potentiel !)
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1.5 font-mono">
                                        <div className="text-slate-400 font-sans font-bold text-xs">Établissement :</div>
                                        <div className="text-white font-bold">{googleSearchCompany.nomEntreprise}</div>
                                        {googleSearchCompany.nomGerant && <div className="text-slate-300 font-sans">Dirigeant : {googleSearchCompany.nomGerant}</div>}
                                        {googleSearchCompany.siret && <div className="text-slate-400">SIRET : {googleSearchCompany.siret}</div>}
                                        {googleSearchCompany.adresse && <div className="text-slate-300 font-sans">{googleSearchCompany.adresse} {googleSearchCompany.codePostal} {googleSearchCompany.ville}</div>}
                                    </div>

                                    <div className="space-y-3 flex flex-col justify-between bg-slate-900 p-3 rounded-lg border border-slate-800">
                                        <div>
                                            <div className="text-slate-400 font-bold mb-1">Contact Rapide :</div>
                                            {googleSearchCompany.telephone ? (
                                                <div className="text-emerald-400 font-bold font-mono text-sm">
                                                    📞 {googleSearchCompany.telephone}
                                                </div>
                                            ) : (
                                                <div className="text-slate-500 italic">Téléphone non disponible</div>
                                            )}
                                        </div>

                                        {googleSearchCompany.telephone && (
                                            <a
                                                href={`tel:${googleSearchCompany.telephone}`}
                                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                                            >
                                                <PhoneCall className="h-3.5 w-3.5" /> Appeler l'entreprise immédiatement
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sync to CRM Action */}
                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setGoogleSearchCompany(null)} className="w-1/3 border-slate-800 bg-slate-950 text-slate-300">
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
                                    className="w-2/3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs"
                                >
                                    <PlusCircle className="h-4 w-4 mr-1.5" /> Synchroniser cette fiche & Ajouter au CRM Prospect
                                </Button>
                            </div>

                        </div>
                    </div>
                )}

                {/* Add to Prospect Modal */}
                {selectedCompany && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                                    <PlusCircle className="h-5 w-5 text-amber-400" /> Qualifier & Transférer dans le CRM
                                </h3>
                                <button onClick={() => setSelectedCompany(null)} className="text-slate-400 hover:text-white font-bold text-lg">×</button>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                                <div className="font-bold text-white text-sm">{selectedCompany.nomEntreprise}</div>
                                {selectedCompany.nomGerant && <div className="text-slate-300">Gérant : {selectedCompany.nomGerant}</div>}
                                {selectedCompany.siret && <div className="text-slate-400">SIRET : {selectedCompany.siret}</div>}
                                {selectedCompany.telephone && <div className="text-slate-400">Tél : {selectedCompany.telephone}</div>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-300 block">
                                    Saisir l'e-mail qualifié du contact * :
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ex: contact@entreprise.fr"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                                />
                                <p className="text-[11px] text-slate-400">
                                    Cet e-mail permettra l'envoi immédiat de la demande de paiement Stripe et des offres Gainable.fr.
                                </p>
                            </div>

                            {addError && <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl">{addError}</div>}
                            {addSuccess && <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl">{addSuccess}</div>}

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="outline" onClick={() => setSelectedCompany(null)} className="w-1/2 border-slate-800 bg-slate-950 text-slate-300">
                                    Annuler
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmAddProspect}
                                    disabled={adding || !contactEmail}
                                    className="w-1/2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
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
