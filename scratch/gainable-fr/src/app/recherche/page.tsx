import { Header } from "@/components/layout/header";
import { ProCard } from "@/components/features/pro-card";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter, RefreshCcw } from "lucide-react";


// --- MOCK DATA ---
const MOCK_PROS = [
    {
        id: 1,
        name: "Clim'Express 33",
        city: "Bordeaux",
        country: "France",
        expertTypes: ["Installateur climatisation", "Expert Gainable"],
        interventions: ["Installation", "Entretien", "Dépannage"],
        technologies: ["Gainable", "PAC Air-Air", "Split"],
        logoUrl: undefined
    },
    {
        id: 2,
        name: "Eco-Thermie S.A.",
        city: "Genève",
        country: "Suisse",
        expertTypes: ["Bureau d'étude", "Spécialiste VRV / DRV"],
        interventions: ["Dimensionnement", "Mise en service"],
        technologies: ["VRV", "DRV", "Pompe à chaleur Eau glacée"],
        logoUrl: undefined
    },
    {
        id: 3,
        name: "Atlantic Confort",
        city: "Mérignac",
        country: "France",
        expertTypes: ["Installateur climatisation", "Spécialiste PAC"],
        interventions: ["Remplacement", "Nettoyage gainable"],
        technologies: ["PAC Air-Eau", "Console", "Gainable"],
        logoUrl: undefined
    },
    {
        id: 4,
        name: "Expert Clim 75",
        city: "Paris",
        country: "France",
        expertTypes: ["Diagnostiqueur immobilier", "Installateur"],
        interventions: ["Installation", "Dépannage"],
        technologies: ["Split", "Multi-split"],
        logoUrl: undefined
    }
];

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Global Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT COLUMN: FILTERS --- */}
                    <aside className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-[#1F2D3D]">Filtres</h2>
                                <button className="text-xs text-slate-400 hover:text-[#D59B2B] flex items-center gap-1">
                                    <RefreshCcw className="w-3 h-3" /> Réinitialiser
                                </button>
                            </div>

                            {/* Filtre 1: Type d'expert */}
                            <div className="mb-6 space-y-3">
                                <h3 className="text-sm font-bold text-[#1F2D3D] uppercase tracking-wide">Type d'expert</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded accent-[#D59B2B] w-4 h-4" defaultChecked />
                                        <span className="text-sm text-slate-600 font-medium">Installateur climatisation</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded accent-[#D59B2B] w-4 h-4" />
                                        <span className="text-sm text-slate-600">Expert Gainable</span>
                                    </label>
                                    <div className="border-t border-slate-100 my-2"></div>
                                    <label className="flex items-center gap-2 cursor-pointer opacity-80">
                                        <input type="checkbox" className="rounded accent-[#D59B2B] w-4 h-4" />
                                        <span className="text-sm text-slate-600">Bureau d'étude</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer opacity-80">
                                        <input type="checkbox" className="rounded accent-[#D59B2B] w-4 h-4" />
                                        <span className="text-sm text-slate-600">Diagnostiqueur immobilier</span>
                                    </label>
                                </div>
                            </div>



                            {/* Filtre 3: Technologies */}
                            <div className="mb-6 space-y-3">
                                <h3 className="text-sm font-bold text-[#1F2D3D] uppercase tracking-wide">Technologies</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {["Gainable", "PAC Air-Air", "PAC Air-Eau", "CTA", "VRV", "DRV", "Console", "Cassette", "PAC CO2", "PAC Eau glacée", "Split", "Multi-split"].map((item) => (
                                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded accent-[#D59B2B] w-4 h-4" />
                                            <span className="text-sm text-slate-600">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filtre 4: Type de bâtiment */}
                            <div className="mb-6 space-y-3">
                                <h3 className="text-sm font-bold text-[#1F2D3D] uppercase tracking-wide">Type de bâtiment</h3>
                                <div className="space-y-2">
                                    {["Maison", "Appartement", "Immeuble", "Locaux pro", "Commerce", "Industrie", "Hôtel / Restaurant", "Santé"].map((item) => (
                                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded accent-[#D59B2B] w-4 h-4" />
                                            <span className="text-sm text-slate-600">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filtre 5: Localisation */}
                            <div className="mb-8 space-y-3">
                                <h3 className="text-sm font-bold text-[#1F2D3D] uppercase tracking-wide">Localisation</h3>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Ville ou Code postal"
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#D59B2B]"
                                    />
                                    <div className="flex item-center gap-4 mt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded accent-[#D59B2B] w-4 h-4" defaultChecked />
                                            <span className="text-sm text-slate-600">France</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="rounded accent-[#D59B2B] w-4 h-4" />
                                            <span className="text-sm text-slate-600">Suisse</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-6 text-lg tracking-wide uppercase">
                                Lancer la recherche
                            </Button>
                        </div>
                    </aside>

                    {/* --- RIGHT COLUMN: RESULTS & MAP --- */}
                    <main className="lg:col-span-9 space-y-6">

                        {/* Header Content */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1F2D3D] mb-2">Trouvez un expert en climatisation</h1>
                                <p className="text-slate-500">Affinez votre recherche grâce aux filtres à gauche.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-[#D59B2B]">12</span>
                                <span className="text-slate-600 font-medium ml-2">experts trouvés</span>
                            </div>
                        </div>

                        {/* Interactive Map Placeholder */}
                        <div className="w-full h-80 bg-slate-200 rounded-xl overflow-hidden relative border border-slate-300 shadow-inner group">
                            {/* Fake Map Image/Background */}
                            <div className="absolute inset-0 bg-[url('/map_placeholder.png')] bg-cover bg-center opacity-50"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-8 h-8 text-[#D59B2B] mx-auto mb-2 animate-bounce" />
                                    <p className="text-slate-600 font-semibold bg-white/80 px-4 py-1 rounded-full shadow-sm backdrop-blur-sm">Carte Interactive des Experts</p>
                                </div>
                            </div>
                            {/* Zoom Controls Mock */}
                            <div className="absolute bottom-4 right-4 flex flex-col gap-1">
                                <button className="w-8 h-8 bg-white rounded shadow text-slate-600 font-bold hover:bg-slate-50">+</button>
                                <button className="w-8 h-8 bg-white rounded shadow text-slate-600 font-bold hover:bg-slate-50">-</button>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="space-y-4">
                            {MOCK_PROS.map(pro => (
                                <ProCard key={pro.id} {...pro} />
                            ))}
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}
