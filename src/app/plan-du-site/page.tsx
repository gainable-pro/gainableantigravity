import { CITIES_100, CityData } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { CITIES_MEDIUM } from "@/data/cities-medium";
import Link from "next/link";
import { Metadata } from "next";
import { slugify } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Plan du site & Zones d'intervention | Gainable.fr",
    description: "Retrouvez l'ensemble de nos zones d'intervention pour l'installation de climatisation gainable en France, Belgique, Suisse et au Maroc.",
    alternates: {
        canonical: "https://www.gainable.fr/plan-du-site",
    },
};

export const dynamic = 'force-static';

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED, ...CITIES_MEDIUM];

export default function SitemapPage() {
    // 1. Group by Country and Region
    const countries = {
        FR: { name: "France", regions: {} as Record<string, number> },
        BE: { name: "Belgique", regions: {} as Record<string, number> },
        CH: { name: "Suisse", regions: {} as Record<string, number> },
        MA: { name: "Maroc", regions: {} as Record<string, number> },
    };

    ALL_CITIES.forEach(city => {
        const countryCode = city.country || 'FR';
        if (countries[countryCode as keyof typeof countries]) {
            const region = city.region || "Autres";
            countries[countryCode as keyof typeof countries].regions[region] = (countries[countryCode as keyof typeof countries].regions[region] || 0) + 1;
        }
    });

    return (
        <div className="bg-slate-50 min-h-screen py-20 font-sans">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1F2D3D] mb-6 font-montserrat">
                    Plan du site & <span className="text-[#D59B2B]">Zones d'intervention</span>
                </h1>
                <p className="text-lg text-slate-600 mb-16 max-w-2xl">
                    Retrouvez ici l'ensemble de nos pages et des régions où nos experts vérifiés Gainable.fr interviennent.
                </p>

                {/* MAIN PAGES LINKS */}
                <section className="mb-20 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold text-[#1F2D3D] mb-6 border-b border-slate-100 pb-4">
                        Pages Principales
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/" className="text-slate-600 hover:text-[#D59B2B] font-medium">Accueil</Link>
                        <Link href="/trouver-installateur" className="text-slate-600 hover:text-[#D59B2B] font-medium">Trouver un expert</Link>
                        <Link href="/la-solution-gainable" className="text-slate-600 hover:text-[#D59B2B] font-medium">La Solution Gainable</Link>
                        <Link href="/climatisation" className="text-slate-600 hover:text-[#D59B2B] font-medium">Climatisation & PAC</Link>
                        <Link href="/articles" className="text-slate-600 hover:text-[#D59B2B] font-medium">Articles & Conseils</Link>
                        <Link href="/contact" className="text-slate-600 hover:text-[#D59B2B] font-medium">Contact</Link>
                        <Link href="/espace-pro" className="text-slate-600 hover:text-[#D59B2B] font-medium">Espace Pro</Link>
                        <Link href="/faq-visibilite-referencement" className="text-slate-600 hover:text-[#D59B2B] font-medium">FAQ Visibilité</Link>
                    </div>
                </section>

                {/* REGION DIRECTORY */}
                <div className="space-y-20">
                    {Object.entries(countries).map(([code, country]) => {
                        const regionNames = Object.keys(country.regions).sort();
                        if (regionNames.length === 0) return null;

                        return (
                            <section key={code}>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-3xl font-bold text-[#1F2D3D]">{country.name}</h2>
                                    <div className="h-px bg-slate-200 flex-1 ml-4"></div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {regionNames.map(regionName => (
                                        <div key={regionName} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-4 pb-2 border-b border-slate-100">
                                                {regionName}
                                            </h3>
                                            <Link
                                                href={`/trouver-installateur/${slugify(regionName)}`}
                                                className="text-slate-500 hover:text-[#D59B2B] transition-colors block text-sm font-medium"
                                            >
                                                Voir les {country.regions[regionName]} villes & artisans &rarr;
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
