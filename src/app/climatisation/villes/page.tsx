import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { CITIES_MEDIUM } from "@/data/cities-medium";
import { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: "Toutes nos régions et villes d'intervention | Gainable.fr",
    description: "Découvrez l'ensemble de nos zones d'intervention en France, Suisse et Belgique pour l'installation de votre climatisation gainable ou pompe à chaleur.",
    alternates: {
        canonical: "https://www.gainable.fr/climatisation/villes",
    }
};

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED, ...CITIES_MEDIUM];

export default function VillesIndexPage() {
    // Grouping logic by country and region
    const countries = {
        FR: { name: "France", regions: {} as Record<string, number>, flag: "🇫🇷" },
        CH: { name: "Suisse", regions: {} as Record<string, number>, flag: "🇨🇭" },
        BE: { name: "Belgique", regions: {} as Record<string, number>, flag: "🇧🇪" },
        MA: { name: "Maroc", regions: {} as Record<string, number>, flag: "🇲🇦" },
    };

    ALL_CITIES.forEach(city => {
        const countryCode = city.country || 'FR';
        if (countries[countryCode as keyof typeof countries]) {
            const region = city.region || "Autres";
            countries[countryCode as keyof typeof countries].regions[region] = (countries[countryCode as keyof typeof countries].regions[region] || 0) + 1;
        }
    });

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
                        Trouvez un installateur certifié près de chez vous parmi nos <strong>{ALL_CITIES.length} villes desservies</strong>. Choisissez votre région pour découvrir les artisans locaux.
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
                        <span className="text-slate-800 font-semibold text-[#D59B2B]">Toutes les régions</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl">
                {Object.entries(countries).map(([code, country]) => {
                    const regionNames = Object.keys(country.regions).sort();
                    if (regionNames.length === 0) return null;

                    return (
                        <div key={code} className="mb-20">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-4xl text-2xl">{country.flag}</span>
                                <h2 className="text-3xl font-bold text-[#1F2D3D] font-montserrat tracking-tight">{country.name}</h2>
                                <div className="h-px bg-slate-200 flex-1 ml-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regionNames.map(regionName => (
                                    <Link key={regionName} href={`/trouver-installateur/${slugify(regionName)}`} className="group">
                                        <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#D59B2B] hover:shadow-lg transition-all flex justify-between items-center group-hover:-translate-y-1 h-full">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#D59B2B] transition-colors mb-1">
                                                    {regionName}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {country.regions[regionName]} villes couvertes
                                                </p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#D59B2B]/10 transition-colors">
                                                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#D59B2B]" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
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
