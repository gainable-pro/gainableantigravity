import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { slugify } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";

const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED];

interface PageProps {
    params: Promise<{ regionSlug: string }>;
}

export async function generateStaticParams() {
    const allRegions = Array.from(new Set(ALL_CITIES.map(c => slugify(c.region))));
    return allRegions.map(regionSlug => ({
        regionSlug
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { regionSlug } = await params;
    const citiesInRegion = ALL_CITIES.filter(c => slugify(c.region) === regionSlug);

    if (!citiesInRegion.length) return {};

    const regionName = citiesInRegion[0].region;

    return {
        title: `Trouvez votre Installateur Climatisation & Pompe à Chaleur en ${regionName}`,
        description: `Comparez les meilleurs artisans et installateurs RGE certifiés Gainable pour votre projet de climatisation ou de chauffage en ${regionName}. Obtenez un devis local gratuit.`,
        alternates: {
            canonical: `https://www.gainable.fr/trouver-installateur/${regionSlug}`,
        }
    };
}

export default async function RegionPage({ params }: PageProps) {
    const { regionSlug } = await params;
    const citiesInRegion = ALL_CITIES.filter(c => slugify(c.region) === regionSlug);

    if (!citiesInRegion.length) notFound();

    const regionName = citiesInRegion[0].region;
    
    // Group by department
    const byDepartment = citiesInRegion.reduce((acc, city) => {
        const dep = city.department;
        if (!acc[dep]) acc[dep] = [];
        acc[dep].push(city);
        return acc;
    }, {} as Record<string, typeof ALL_CITIES>);

    // Sort departments alphabetically
    const sortedDepartments = Object.keys(byDepartment).sort();

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-6 text-sm text-slate-500 flex items-center gap-2">
                    <Link href="/trouver-installateur" className="hover:text-[#D59B2B] transition-colors">Annuaire</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-medium">{regionName}</span>
                </div>

                <div className="bg-white rounded-[2rem] p-8 md:p-14 shadow-sm border border-slate-100 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D59B2B]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    
                    <div className="relative z-10 w-full max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1F2D3D] mb-6 tracking-tight tight-leading">
                            Artisans Climatisation & PAC en <span className="text-[#D59B2B]">{regionName}</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed">
                            Vous avez un projet d'installation ou de rénovation énergétique ? Découvrez la liste de nos <strong className="text-slate-800">artisans certifiés RGE Gainable</strong> intervenant en {regionName} pour réaliser votre devis gratuit.
                        </p>
                    </div>
                </div>

                <div className="space-y-12">
                    {sortedDepartments.map(dep => (
                        <div key={dep} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D59B2B]/20 group-hover:bg-[#D59B2B] transition-colors"></div>
                            
                            <h2 className="text-2xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-[#D59B2B]" />
                                Secteur : {dep}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {byDepartment[dep].sort((a,b) => a.name.localeCompare(b.name)).map(city => (
                                    <Link 
                                        key={city.slug} 
                                        href={`/climatisation/${city.slug}`}
                                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#D59B2B] hover:shadow-md hover:bg-slate-50 transition-all group/item"
                                    >
                                        <span className="font-semibold text-slate-700 group-hover/item:text-[#D59B2B]">
                                            {city.name}
                                        </span>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-[#D59B2B] group-hover/item:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
