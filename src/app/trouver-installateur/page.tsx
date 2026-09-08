import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CITIES_100 } from "@/data/cities-100";
import { CITIES_EXTENDED } from "@/data/cities-extended";
import { slugify } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { ItemListJsonLd } from '@/components/seo/JsonLd';

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Annuaire Installateurs Climatisation Gainable RGE | Gainable.fr",
    description: "Trouvez un installateur de climatisation réversible & pompe à chaleur gainable qualifié RGE près de chez vous. Annuaire vérifié par région.",
    alternates: {
        canonical: 'https://www.gainable.fr/trouver-installateur',
    },
};

export default async function DirectoryPage() {
    const ALL_CITIES = [...CITIES_100, ...CITIES_EXTENDED];
    
    // Group cities by region
    const regionsMap = new Map<string, typeof ALL_CITIES>();
    ALL_CITIES.forEach(city => {
        const region = city.region || 'Autres';
        if (!regionsMap.has(region)) {
            regionsMap.set(region, []);
        }
        regionsMap.get(region)!.push(city);
    });

    const activeExperts = await prisma.expert.findMany({
        where: { status: 'active' },
        take: 12,
        select: {
            slug: true,
            nom_entreprise: true,
            ville: true,
            expert_type: true,
            is_labeled: true
        }
    });

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <ItemListJsonLd
                name="Annuaire Installateurs Climatisation Gainable RGE"
                description="Liste des installateurs certifiés RGE répertoriés sur Gainable.fr"
                items={activeExperts.map(e => ({
                    name: e.nom_entreprise,
                    slug: e.slug,
                    city: e.ville,
                    isLabeled: e.is_labeled
                }))}
            />

            {/* HERO DIRECTORY */}
            <div className="bg-[#1F2D3D] text-white py-16 px-6">
                <div className="max-w-6xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-[#D59B2B]/20 text-[#D59B2B] px-4 py-1.5 rounded-full text-sm font-semibold border border-[#D59B2B]/30">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Réseau National Vérifié RGE QualiPAC</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                        Annuaire des Installateurs de Climatisation Gainable
                    </h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Sélectionnez votre région ou votre ville pour contacter un artisan frigoriste certifié ou un bureau d'étude thermique qualifié.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-6 mt-12 space-y-16">
                {/* ACTIVE EXPERTS HIGHLIGHT */}
                {activeExperts.length > 0 && (
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-[#D59B2B]" />
                            <span>Installateurs RGE à la Une</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeExperts.map((exp) => (
                                <Link
                                    key={exp.slug}
                                    href={`/pro/${exp.slug}`}
                                    className="p-5 rounded-xl border border-slate-100 hover:border-[#D59B2B] hover:shadow-md transition-all bg-slate-50 hover:bg-white group"
                                >
                                    <h3 className="font-bold text-[#1F2D3D] group-hover:text-[#D59B2B] transition-colors">
                                        {exp.nom_entreprise}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                        <MapPin className="w-3.5 h-3.5 text-[#D59B2B]" />
                                        <span>{exp.ville}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* REGIONS & CITIES DIRECTORY GRID */}
                <section className="space-y-8">
                    <h2 className="text-2xl font-bold text-[#1F2D3D] text-center">
                        Trouver un Installateur par Région & Département
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from(regionsMap.entries()).map(([region, cities]) => (
                            <div key={region} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                                <h3 className="text-xl font-bold text-[#1F2D3D] border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                                    <span>{region}</span>
                                    <Link 
                                        href={`/trouver-installateur/${slugify(region)}`}
                                        className="text-xs text-[#D59B2B] font-semibold hover:underline"
                                    >
                                        Voir la région →
                                    </Link>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {cities.slice(0, 10).map((c) => (
                                        <Link
                                            key={c.slug}
                                            href={`/climatisation/${c.slug}`}
                                            className="text-xs bg-slate-50 hover:bg-[#FFF8ED] text-slate-700 hover:text-[#D59B2B] px-3 py-1.5 rounded-lg border border-slate-100 transition-colors"
                                        >
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
