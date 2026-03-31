import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: "Toutes nos villes d'intervention | Gainable.fr",
    description: "Découvrez l'ensemble de nos 550+ zones d'intervention en France, Suisse et Belgique pour l'installation de votre climatisation gainable ou pompe à chaleur.",
    alternates: {
        canonical: "https://www.gainable.fr/climatisation/villes",
    }
};

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED];

export default function VillesIndexPage() {
    // Grouping logic
    const citiesFR = ALL_CITIES.filter(c => !c.country || c.country === 'FR').sort((a, b) => a.name.localeCompare(b.name));
    const citiesCH = ALL_CITIES.filter(c => c.country === 'CH').sort((a, b) => a.name.localeCompare(b.name));
    const citiesBE = ALL_CITIES.filter(c => c.country === 'BE').sort((a, b) => a.name.localeCompare(b.name));
    const citiesMA = ALL_CITIES.filter(c => c.country === 'MA').sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="bg-slate-50 min-h-screen font-sans pb-20">
            
            {/* HERO SECTION */}
            <section className="bg-[#1F2D3D] text-white pt-32 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-[#D59B2B]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="container mx-auto text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 text-[#D59B2B] mb-6 border border-[#D59B2B]/30">
                        <MapPin className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 font-montserrat">
                        Toutes nos zones d'intervention
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Trouvez un installateur certifié près de chez vous parmi nos <strong>{ALL_CITIES.length} villes desservies</strong> en France, Suisse et Belgique.
                    </p>
                </div>
            </section>

            {/* BREADCRUMB */}
            <div className="bg-white border-b border-slate-200 py-4 px-6 mb-12 shadow-sm relative z-20">
                <div className="container mx-auto">
                    <nav className="flex text-sm text-slate-500">
                        <Link href="/" className="hover:text-[#D59B2B] transition-colors">Accueil</Link>
                        <span className="mx-2">/</span>
                        <Link href="/climatisation" className="hover:text-[#D59B2B] transition-colors">Climatisation</Link>
                        <span className="mx-2">/</span>
                        <span className="text-slate-800 font-semibold text-[#D59B2B]">Tous les secteurs</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* FRANCE */}
                <div className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl text-2xl">🇫🇷</span>
                        <h2 className="text-3xl font-bold text-[#1F2D3D] font-montserrat tracking-tight">France ({citiesFR.length} villes)</h2>
                        <div className="h-px bg-slate-200 flex-1 ml-4"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {citiesFR.map(city => (
                            <Link key={city.slug} href={`/climatisation/${city.slug}`} className="group">
                                <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 hover:border-[#D59B2B] hover:shadow-md transition-all flex justify-between items-center group-hover:-translate-y-1">
                                    <span className="text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2 group-hover:text-[#D59B2B] transition-colors">
                                        {city.name}
                                    </span>
                                    {city.department && <span className="text-xs text-slate-400">({city.department})</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* SUISSE */}
                {citiesCH.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl text-2xl">🇨🇭</span>
                            <h2 className="text-3xl font-bold text-[#1F2D3D] font-montserrat tracking-tight">Suisse ({citiesCH.length} villes)</h2>
                            <div className="h-px bg-slate-200 flex-1 ml-4"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {citiesCH.map(city => (
                                <Link key={city.slug} href={`/climatisation/${city.slug}`} className="group">
                                    <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 hover:border-red-500 hover:shadow-md transition-all flex justify-between items-center group-hover:-translate-y-1">
                                        <span className="text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2 group-hover:text-red-500 transition-colors">
                                            {city.name}
                                        </span>
                                        {city.department && <span className="text-xs text-slate-400">({city.department})</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* BELGIQUE */}
                {citiesBE.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl text-2xl">🇧🇪</span>
                            <h2 className="text-3xl font-bold text-[#1F2D3D] font-montserrat tracking-tight">Belgique ({citiesBE.length} villes)</h2>
                            <div className="h-px bg-slate-200 flex-1 ml-4"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {citiesBE.map(city => (
                                <Link key={city.slug} href={`/climatisation/${city.slug}`} className="group">
                                    <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition-all flex justify-between items-center group-hover:-translate-y-1">
                                        <span className="text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2 group-hover:text-amber-500 transition-colors">
                                            {city.name}
                                        </span>
                                        {city.department && <span className="text-xs text-slate-400">({city.department})</span>}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* MAROC */}
                {citiesMA.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-4xl text-2xl">🇲🇦</span>
                            <h2 className="text-3xl font-bold text-[#1F2D3D] font-montserrat tracking-tight">Maroc ({citiesMA.length} villes)</h2>
                            <div className="h-px bg-slate-200 flex-1 ml-4"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {citiesMA.map(city => (
                                <Link key={city.slug} href={`/climatisation/${city.slug}`} className="group">
                                    <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 hover:border-green-600 hover:shadow-md transition-all flex justify-between items-center group-hover:-translate-y-1">
                                        <span className="text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2 group-hover:text-green-600 transition-colors">
                                            {city.name}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* CALL TO ACTION */}
            <section className="bg-[#1F2D3D] py-16 mt-12 text-center text-white">
                <div className="container mx-auto px-6">
                    <h3 className="text-3xl font-bold mb-6">Ne laissez pas vos projets de confort au hasard</h3>
                    <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                        Même si votre ville n'apparaît pas dans cette liste, notre réseau d'artisans certifiés RGE s'étend sur l'ensemble du territoire européen francophone.
                    </p>
                    <Link href="/trouver-installateur">
                        <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-14 px-10 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                            Décrire mon projet en 1 minute
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
