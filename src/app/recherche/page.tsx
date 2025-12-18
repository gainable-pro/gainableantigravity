import { Header } from "@/components/layout/header";
import { ProCard } from "@/components/features/pro-card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

async function getExperts() {
    try {
        const experts = await prisma.expert.findMany({
            where: {
                // status: 'active', // TODO: Uncomment when payment/activation flow is fully live and we want to hide pending. For now show all or verify active.
                // For now, let's fetch all to be sure we see the user's tests.
            },
            include: {
                technologies: true,
                interventions_clim: true,
                // Add other relations if needed for filters
            }
        });
        return experts;
    } catch (error) {
        console.error("Failed to fetch experts:", error);
        return [];
    }
}

export default async function SearchPage() {
    const experts = await getExperts();

    // Map DB experts to ProCard props
    const pros = experts.map(expert => ({
        id: expert.id,
        slug: expert.slug,
        name: expert.nom_entreprise,
        city: expert.ville,
        country: expert.pays === 'FR' ? 'France' : 'Suisse',
        expertTypes: [expert.expert_type.replace('_', ' ').replace('cvc', 'CVC').toUpperCase()], // Simplified mapping
        interventions: expert.interventions_clim.map(i => i.value),
        technologies: expert.technologies.map(t => t.value),
        logoUrl: expert.logo_url || undefined
    }));

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
                                <span className="text-2xl font-bold text-[#D59B2B]">{pros.length}</span>
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
                            {pros.length > 0 ? (
                                pros.map(pro => (
                                    <ProCard key={pro.id} {...pro} />
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                                    <p className="text-slate-500">Aucun expert trouvé pour le moment.</p>
                                </div>
                            )}
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
}

