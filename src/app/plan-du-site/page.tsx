
import { CITIES_100, CityData } from "@/data/cities-100";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Plan du site & Zones d'intervention | Gainable.fr",
    description: "Retrouvez l'ensemble de nos zones d'intervention pour l'installation de climatisation gainable en France, Belgique, Suisse et au Maroc.",
    alternates: {
        canonical: "https://www.gainable.fr/plan-du-site",
    },
};

export const dynamic = 'force-static';

export default function SitemapPage() {
    // 1. Group by Country
    const countries = {
        FR: { name: "France", cities: [] as CityData[] },
        BE: { name: "Belgique", cities: [] as CityData[] },
        CH: { name: "Suisse", cities: [] as CityData[] },
        MA: { name: "Maroc", cities: [] as CityData[] },
    };

    CITIES_100.forEach(city => {
        const countryCode = city.country || 'FR';
        if (countries[countryCode]) {
            countries[countryCode].cities.push(city);
        }
    });

    // 2. Helper to group by Region/Department
    const groupByRegion = (cities: CityData[]) => {
        const regions: Record<string, CityData[]> = {};
        cities.forEach(city => {
            const key = city.region || "Autres";
            if (!regions[key]) regions[key] = [];
            regions[key].push(city);
        });
        return regions;
    };

    return (
        <div className="bg-slate-50 min-h-screen py-20 font-sans">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-4xl md:text-5xl font-bold text-[#1F2D3D] mb-6 font-montserrat">
                    Plan du site & <span className="text-[#D59B2B]">Zones d'intervention</span>
                </h1>
                <p className="text-lg text-slate-600 mb-16 max-w-2xl">
                    Retrouvez ici l'ensemble des villes où nos experts vérifiés Gainable.fr interviennent pour vos projets de climatisation et chauffage.
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
                        <Link href="/articles" className="text-slate-600 hover:text-[#D59B2B] font-medium">Articles & Conseils</Link>
                        <Link href="/contact" className="text-slate-600 hover:text-[#D59B2B] font-medium">Contact</Link>
                        <Link href="/espace-pro" className="text-slate-600 hover:text-[#D59B2B] font-medium">Espace Pro</Link>
                        <Link href="/faq-visibilite-referencement" className="text-slate-600 hover:text-[#D59B2B] font-medium">FAQ Visibilité</Link>
                    </div>
                </section>

                {/* CITY DIRECTORY */}
                <div className="space-y-20">
                    {Object.entries(countries).map(([code, country]) => {
                        if (country.cities.length === 0) return null;

                        const regions = groupByRegion(country.cities);

                        return (
                            <section key={code}>
                                <div className="flex items-center gap-4 mb-10">
                                    <h2 className="text-3xl font-bold text-[#1F2D3D]">{country.name}</h2>
                                    <span className="bg-[#D59B2B]/10 text-[#D59B2B] px-3 py-1 rounded-full text-sm font-bold">
                                        {country.cities.length} villes
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {Object.entries(regions).sort((a, b) => a[0].localeCompare(b[0])).map(([regionName, cities]) => (
                                        <div key={regionName} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 break-inside-avoid">
                                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-4 pb-2 border-b border-slate-100">
                                                {regionName}
                                            </h3>
                                            <ul className="space-y-2">
                                                {cities.sort((a, b) => a.name.localeCompare(b.name)).map(city => (
                                                    <li key={city.slug}>
                                                        <Link
                                                            href={`/climatisation/${city.slug}`}
                                                            className="text-slate-500 hover:text-[#D59B2B] transition-colors block py-0.5 text-sm"
                                                        >
                                                            Climatisation {city.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
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
