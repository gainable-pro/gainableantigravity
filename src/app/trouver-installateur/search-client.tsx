"use client";

import { ProCard } from "@/components/features/pro-card";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCcw, ChevronDown, MapPin } from "lucide-react";
import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import {
    EXPERT_TECHNOLOGIES,
    EXPERT_BATIMENTS,
    EXPERT_INTERVENTIONS_DIAG
} from "@/lib/constants";
import { ContactWizard } from "@/components/features/contact/contact-wizard";

// Dynamically import Map to avoid SSR issues
const SearchMap = dynamic(() => import("@/components/features/search-map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
            Chargement de la carte...
        </div>
    )
});

function FilterDropdown({ label, children, active = false }: { label: string, children: React.ReactNode, active?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 h-10 rounded-md border text-sm font-medium transition-colors ${isOpen || active ? 'border-[#D59B2B] bg-[#FFF8ED] text-[#D59B2B]' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'}`}
            >
                {label}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-20 p-4 max-h-[80vh] overflow-y-auto">
                        {children}
                    </div>
                </>
            )}
        </div>
    );
}

function SearchPageContent({ initialExperts, initialView }: { initialExperts: any[], initialView: { center: number[], zoom: number } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // -- INIT STATE FROM URL PARAMS OR DEFAULTS --
    // Helper to get initial param value
    const getParam = (key: string) => searchParams?.get(key);
    const getListParam = (key: string) => searchParams?.get(key)?.split(',') || [];
    const getTypesParam = () => searchParams?.getAll('type');

    const filterParam = searchParams?.get('filter'); // Legacy support
    const typeParams = searchParams?.getAll('type') || [];

    // Determine initial filter state
    // Determine initial filter state
    const isDefault = typeParams.length === 0 && !filterParam;
    const initialSociete = isDefault || typeParams.includes('societe');
    const initialBureau = isDefault || typeParams.includes('bureau') || filterParam === 'bureau_etude';
    const initialDiag = isDefault || typeParams.includes('diag') || filterParam === 'diagnostiqueur';

    // Filters State
    const [expertFilters, setExpertFilters] = useState({
        societe: initialSociete,
        bureau: initialBureau,
        diag: initialDiag
    });

    const [locationFilter, setLocationFilter] = useState(getParam('city') || "");
    const [countryFilter, setCountryFilter] = useState(getParam('country') || "");
    const [selectedTechs, setSelectedTechs] = useState<string[]>(getListParam('technologies'));
    const [selectedDiags, setSelectedDiags] = useState<string[]>(getListParam('interventions'));
    const [selectedBatiments, setSelectedBatiments] = useState<string[]>(getListParam('batiments'));

    // Real Data State
    const [experts, setExperts] = useState<any[]>(initialExperts);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedExperts, setSelectedExperts] = useState<any[]>([]);

    const toggleExpertSelection = (expert: any) => {
        if (selectedExperts.find(e => e.id === expert.id)) {
            setSelectedExperts(prev => prev.filter(e => e.id !== expert.id));
        } else {
            if (selectedExperts.length >= 5) {
                alert("Vous pouvez sélectionner jusqu'à 5 professionnels maximum.");
                return;
            }
            setSelectedExperts(prev => [...prev, expert]);
        }
    };

    // Fetch Experts Logic
    const fetchExperts = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();

            // Map types
            if (expertFilters.societe) params.append('type', 'societe');
            if (expertFilters.bureau) params.append('type', 'bureau');
            if (expertFilters.diag) params.append('type', 'diag');

            if (locationFilter) {
                params.append('city', locationFilter);
                // GEOCODE ON SEARCH
                try {
                    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationFilter + ", France")}&limit=1`);
                    if (geoRes.ok) {
                        const geoData = await geoRes.json();
                        if (geoData && geoData.length > 0) {
                            params.append('lat', geoData[0].lat);
                            params.append('lng', geoData[0].lon);
                        }
                    }
                } catch (e) {
                    console.error("Geocoding failed for search:", e);
                }
            }
            if (countryFilter) params.append('country', countryFilter);
            if (selectedTechs.length) params.append('technologies', selectedTechs.join(','));

            if (selectedDiags.length) params.append('interventions', selectedDiags.join(','));
            if (selectedBatiments.length) params.append('batiments', selectedBatiments.join(','));

            // Update URL shallowly
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });

            const res = await fetch(`/api/experts/search?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setExperts(data);
            }
        } catch (error) {
            console.error("Error fetching experts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // -- URL SYNC & FETCH LOGIC --
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Debounce fetching
        const timer = setTimeout(() => {
            fetchExperts();
        }, 300);

        return () => clearTimeout(timer);

    }, [expertFilters, locationFilter, countryFilter, selectedTechs, selectedDiags, selectedBatiments, pathname, router]);


    const handleExpertChange = (key: keyof typeof expertFilters) => {
        setExpertFilters(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Explicit manual search trigger (acts as visual confirmation)
    const triggerSearch = () => {
        fetchExperts();
    };

    const [showMobileFilters, setShowMobileFilters] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">


            {/* --- TOP FILTER BAR --- */}
            <div className="bg-white border-b border-slate-100 shadow-sm sticky top-[96px] md:top-[112px] z-30 transition-all">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">

                        {/* Mobile Toggle & Label */}
                        <div className="flex items-center justify-between w-full lg:w-auto lg:hidden">
                            <span className="text-sm font-bold text-[#1F2D3D]">Filtres :</span>
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="flex items-center gap-2 text-sm font-medium text-[#D59B2B] border border-[#D59B2B] px-3 py-1.5 rounded-md"
                            >
                                <Filter className="w-4 h-4" />
                                {showMobileFilters ? "Masquer" : "Afficher"}
                            </button>
                        </div>

                        {/* Filters List - Hidden on Mobile unless toggled */}
                        <div className={`${showMobileFilters ? 'flex' : 'hidden'} lg:flex flex-wrap items-center gap-3 w-full lg:w-auto border-b lg:border-b-0 pb-4 lg:pb-0 border-slate-100 mb-2 lg:mb-0`}>
                            <span className="hidden lg:inline text-sm font-bold text-[#1F2D3D] mr-2">Filtres :</span>

                            {/* Filter 1: Type d'expert */}
                            <FilterDropdown label="Type d'expert" active={expertFilters.societe || expertFilters.bureau || expertFilters.diag}>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded accent-[#D59B2B] w-4 h-4"
                                            checked={expertFilters.societe}
                                            onChange={() => handleExpertChange('societe')}
                                        />
                                        <span className={`text-sm ${expertFilters.societe ? 'text-[#D59B2B] font-bold' : 'text-slate-600 font-medium'}`}>Société experte en climatisation</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded accent-[#D59B2B] w-4 h-4"
                                            checked={expertFilters.bureau}
                                            onChange={() => handleExpertChange('bureau')}
                                        />
                                        <span className={`text-sm ${expertFilters.bureau ? 'text-[#D59B2B] font-bold' : 'text-slate-600'}`}>Bureau d’étude</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded accent-[#D59B2B] w-4 h-4"
                                            checked={expertFilters.diag}
                                            onChange={() => handleExpertChange('diag')}
                                        />
                                        <span className={`text-sm ${expertFilters.diag ? 'text-[#D59B2B] font-bold' : 'text-slate-600'}`}>Diagnostiqueur immobilier</span>
                                    </label>
                                </div>
                            </FilterDropdown>

                            {/* Filter 3: Technologies (Only for Sociétés) */}
                            {expertFilters.societe && (
                                <FilterDropdown label="Technologies" active={selectedTechs.length > 0}>
                                    <div className="space-y-2">
                                        {EXPERT_TECHNOLOGIES.map((item) => (
                                            <label key={item} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="rounded accent-[#D59B2B] w-4 h-4"
                                                    checked={selectedTechs.includes(item)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedTechs([...selectedTechs, item]);
                                                        else setSelectedTechs(selectedTechs.filter(t => t !== item));
                                                    }}
                                                />
                                                <span className="text-sm text-slate-600">{item}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FilterDropdown>
                            )}

                            {/* Filter 3b: Diagnostics (Only for Diagnostiqueurs) */}
                            {expertFilters.diag && (
                                <FilterDropdown label="Types de diagnostic" active={selectedDiags.length > 0}>
                                    <div className="space-y-2">
                                        {EXPERT_INTERVENTIONS_DIAG.map((item) => (
                                            <label key={item} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="rounded accent-[#D59B2B] w-4 h-4"
                                                    checked={selectedDiags.includes(item)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setSelectedDiags([...selectedDiags, item]);
                                                        else setSelectedDiags(selectedDiags.filter(d => d !== item));
                                                    }}
                                                />
                                                <span className="text-sm text-slate-600">{item.replace(/_/g, ' ')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </FilterDropdown>
                            )}

                            {/* Filter 4: Bâtiment (For Everyone) */}
                            <FilterDropdown label="Type de bâtiment" active={selectedBatiments.length > 0}>
                                <div className="space-y-2">
                                    {EXPERT_BATIMENTS.map((item) => (
                                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded accent-[#D59B2B] w-4 h-4"
                                                checked={selectedBatiments.includes(item)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedBatiments([...selectedBatiments, item]);
                                                    else setSelectedBatiments(selectedBatiments.filter(b => b !== item));
                                                }}
                                            />
                                            <span className="text-sm text-slate-600">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterDropdown>

                            {/* Filter 5: Localisation */}
                            <div className="relative">
                                <div className={`flex items-center gap-2 px-3 h-10 rounded-md border text-sm font-medium transition-colors ${locationFilter ? 'border-[#D59B2B] bg-[#FFF8ED]' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Ville ou CP"
                                        className="bg-transparent border-none focus:outline-none w-28 text-slate-700 placeholder-slate-400"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Filter: Pays (Moved after Localisation) */}
                            <FilterDropdown label="Pays" active={!!countryFilter}>
                                <div className="space-y-2">
                                    {["France", "Suisse", "Belgique", "Maroc"].map((item) => (
                                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded accent-[#D59B2B] w-4 h-4"
                                                checked={countryFilter === item}
                                                onChange={() => setCountryFilter(countryFilter === item ? "" : item)}
                                            />
                                            <span className="text-sm text-slate-600">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </FilterDropdown>

                        </div>

                        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                            <button
                                onClick={() => {
                                    setLocationFilter("");
                                    setCountryFilter("");
                                    setSelectedTechs([]);
                                    setSelectedDiags([]);
                                    setSelectedBatiments([]);
                                }}
                                className="text-sm text-slate-400 hover:text-[#D59B2B] flex items-center gap-1 transition-colors"
                            >
                                <RefreshCcw className="w-4 h-4" /> <span className="hidden sm:inline">Réinitialiser</span>
                            </button>


                            <Button onClick={triggerSearch} className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-10 px-6">
                                Rechercher
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT (Split View) --- */}
            <div className="flex-1 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                    {/* --- LEFT: LISTING (Scrollable) --- */}
                    <main className="lg:col-span-7 space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#1F2D3D]">Experts à proximité</h2>
                            {/* Count hidden as requested */}
                        </div>

                        <div className="space-y-4">
                            {isLoading ? (
                                <p>Chargement des experts en cours...</p>
                            ) : experts.length > 0 ? (
                                experts.map(pro => (
                                    <ProCard
                                        key={pro.id}
                                        id={pro.id}
                                        slug={pro.slug}
                                        {...pro}
                                        selectable={true}
                                        priority={experts.indexOf(pro) < 4} // Preload first 4 items for UX/LCP
                                        isSelected={!!selectedExperts.find(e => e.id === pro.id)}
                                        onToggleSelect={() => toggleExpertSelection({
                                            id: pro.id,
                                            nom_entreprise: pro.nom_entreprise || pro.name,
                                            expert_type: pro.expertTypes?.[0] || 'cvc_climatisation',
                                            ville: pro.city
                                        })}
                                        // Pass specific Action Component for the 'Devis' button
                                        actionButton={
                                            <ContactWizard
                                                preSelectedExperts={[{
                                                    id: pro.id,
                                                    nom_entreprise: pro.nom_entreprise || pro.name,
                                                    expert_type: pro.expertTypes?.[0] || 'cvc_climatisation',
                                                    ville: pro.city
                                                }]}
                                                triggerButton={
                                                    <Button className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold">
                                                        Devis gratuit
                                                    </Button>
                                                }
                                            />
                                        }
                                    />
                                ))
                            ) : (
                                <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 text-center">
                                    <p className="text-slate-500">Aucun expert trouvé pour cette recherche.</p>
                                    <Button variant="link" onClick={() => {
                                        setLocationFilter("");
                                        setCountryFilter("");
                                    }}>Effacer les filtres</Button>
                                </div>
                            )}
                        </div>

                        {/* Pagination mockup */}
                        <div className="flex justify-center pt-8 pb-4">
                            <Button variant="outline" disabled>Précédent</Button>
                            <Button variant="outline" className="bg-sky-50 mx-2">1</Button>
                            <Button variant="outline">Suivant</Button>
                        </div>
                    </main>

                    {/* --- RIGHT: MAP (Sticky) --- */}
                    <aside className="hidden lg:block lg:col-span-5 h-[calc(100vh-200px)] sticky top-[180px]">
                        <div className="w-full h-full bg-slate-200 rounded-xl overflow-hidden relative border border-slate-300 shadow-md group">
                            {/* Real Interactive Map */}
                            <SearchMap experts={experts} hasLocationFilter={!!locationFilter || !!countryFilter} initialView={initialView} />
                        </div>
                    </aside>
                </div>
                {/* FLOATING ACTION BAR FOR SELECTION */}
                {selectedExperts.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[5000] w-[95%] max-w-lg">
                        <div className="bg-[#1F2D3D] text-white rounded-xl shadow-2xl p-4 flex items-center justify-between border border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="bg-[#D59B2B] text-white font-bold w-10 h-10 rounded-full flex items-center justify-center">
                                    {selectedExperts.length}
                                </div>
                                <div className="text-sm">
                                    <span className="font-bold block">Professionnels sélectionnés</span>
                                    <span className="text-slate-300 text-xs">Gratuit & Sans engagement</span>
                                </div>
                            </div>

                            <ContactWizard
                                preSelectedExperts={selectedExperts}
                                triggerButton={
                                    <Button className="bg-white text-[#1F2D3D] hover:bg-slate-100 font-bold px-6">
                                        Demander un devis
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPageClient({ initialExperts = [], initialView }: { initialExperts?: any[], initialView?: { center: number[], zoom: number } }) {
    // Default fallback if not provided
    const safeView = initialView || { center: [46.603354, 1.888334], zoom: 6 };
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <SearchPageContent initialExperts={initialExperts} initialView={safeView} />
        </Suspense>
    );
}
