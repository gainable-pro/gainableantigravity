import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowRight, FileText, Wrench, ShieldCheck, Zap, Sparkles } from "lucide-react";

interface InternalLinkingProps {
    zipCode?: string | null;
    city?: string | null;
    currentExpertSlug?: string;
    currentArticleSlug?: string;
    brand?: string;
    productType?: string;
    productSku?: string;
}

// High-value strategic SEO cities in France
const TOP_SEO_CITIES = [
    { name: "Paris", slug: "paris", zip: "75000" },
    { name: "Marseille", slug: "marseille", zip: "13000" },
    { name: "Lyon", slug: "lyon", zip: "69000" },
    { name: "Toulouse", slug: "toulouse", zip: "31000" },
    { name: "Nice", slug: "nice", zip: "06000" },
    { name: "Bordeaux", slug: "bordeaux", zip: "33000" },
    { name: "Nantes", slug: "nantes", zip: "44000" },
    { name: "Lille", slug: "lille", zip: "59000" },
    { name: "Reims", slug: "reims", zip: "51100" },
    { name: "Orléans", slug: "orleans", zip: "45000" },
    { name: "Montpellier", slug: "montpellier", zip: "34000" },
    { name: "Strasbourg", slug: "strasbourg", zip: "67000" },
];

// Top equipment references for cross-linking
const TOP_EQUIPMENT_REFS = [
    { title: "Mitsubishi PUZ-M100VKA3-TH", slug: "puz-m100vka3-th", brand: "Mitsubishi Electric", type: "Gainable" },
    { title: "Daikin RXM35A9 (Perfera)", slug: "rxm35a9", brand: "Daikin", type: "Mural" },
    { title: "Mitsubishi PUZ-M100YKA3-THG 3-Ph", slug: "puz-m100yka3-thg", brand: "Mitsubishi Electric", type: "Gainable" },
    { title: "Mitsubishi SUZ-M71VA2-TH", slug: "suz-m71va2-th", brand: "Mitsubishi Electric", type: "Groupe Extérieur" },
    { title: "Kit Régulation CVC Airzone", slug: "022309-240102", brand: "Airzone", type: "Pack Plénum Zoning" },
    { title: "Ecran Tactile Airzone HMIS2", slug: "hmis2-15p-v1", brand: "Airzone", type: "Régulation" },
];

export async function InternalLinking({
    zipCode,
    city,
    currentExpertSlug,
    currentArticleSlug,
    brand,
    productType,
    productSku,
}: InternalLinkingProps) {
    let relatedExperts: any[] = [];
    let relatedArticles: any[] = [];

    const currentYear = new Date().getFullYear();

    // 1. Fetch related experts
    if (zipCode && zipCode.length >= 2) {
        const departmentPrefix = zipCode.substring(0, 2);
        relatedExperts = await prisma.expert.findMany({
            where: {
                code_postal: { startsWith: departmentPrefix },
                slug: { not: currentExpertSlug || undefined },
                status: "active",
            },
            take: 4,
            select: {
                nom_entreprise: true,
                slug: true,
                ville: true,
                expert_type: true,
                is_labeled: true,
            },
        });
    }

    // Fallback: if no department experts found (or on a product page), fetch top active experts
    if (relatedExperts.length < 3) {
        const topExperts = await prisma.expert.findMany({
            where: {
                status: "active",
                slug: { not: currentExpertSlug || undefined },
            },
            take: 4 - relatedExperts.length,
            select: {
                nom_entreprise: true,
                slug: true,
                ville: true,
                expert_type: true,
                is_labeled: true,
            },
        });
        relatedExperts = [...relatedExperts, ...topExperts];
    }

    // 2. Fetch general recent SEO articles
    relatedArticles = await prisma.article.findMany({
        where: {
            status: "PUBLISHED",
            slug: { not: currentArticleSlug || undefined },
        },
        orderBy: { publishedAt: "desc" },
        take: 4,
        select: {
            title: true,
            slug: true,
            targetCity: true,
            expert: {
                select: {
                    slug: true,
                    nom_entreprise: true,
                },
            },
        },
    });

    const isProductPage = Boolean(brand || productSku);

    return (
        <section className="bg-slate-900 text-white py-16 mt-16 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 space-y-12">
                
                {/* Header Tagline */}
                <div className="text-center max-w-3xl mx-auto space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D59B2B]/20 text-[#D59B2B] border border-[#D59B2B]/30">
                        <Sparkles className="w-3.5 h-3.5" /> Réseau National Gainable.fr {currentYear}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold font-outfit">
                        {isProductPage
                            ? `Installateurs agréés & Guides techniques ${brand ? `— ${brand}` : ""}`
                            : city
                            ? `Maillage & Conseils Climatisation pour ${city}`
                            : "Trouvez votre installateur RGE & Matériel Climatisation"}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Mise en relation directe avec les artisans certifiés CVC et grossistes agréés en France.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* Column 1: Experts Partenaires */}
                    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 space-y-5">
                        <div className="flex items-center gap-2 text-[#D59B2B]">
                            <ShieldCheck className="w-5 h-5" />
                            <h3 className="font-bold text-lg text-white">
                                {zipCode ? `Installateurs dans le ${zipCode.substring(0, 2)}` : "Installateurs RGE recommandés"}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400">
                            Artisans qualifiés pour la pose, l&apos;entretien et la mise en service.
                        </p>
                        <div className="space-y-3">
                            {relatedExperts.map((expert) => (
                                <Link
                                    key={expert.slug}
                                    href={`/pro/${expert.slug}`}
                                    className="group bg-slate-800 p-3.5 rounded-xl border border-slate-700 hover:border-[#D59B2B] transition-all flex items-center justify-between"
                                >
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-[#D59B2B] transition-colors">
                                            {expert.nom_entreprise}
                                        </h4>
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3 text-[#D59B2B]" /> {expert.ville}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#D59B2B] transition-colors transform group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Villes & Villes Stratégiques */}
                    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 space-y-5">
                        <div className="flex items-center gap-2 text-[#D59B2B]">
                            <MapPin className="w-5 h-5" />
                            <h3 className="font-bold text-lg text-white">Villes & Régions Couvertes</h3>
                        </div>
                        <p className="text-xs text-slate-400">
                            Consultez les devis et installateurs disponibles par métropole :
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {TOP_SEO_CITIES.map((c) => (
                                <Link
                                    key={c.slug}
                                    href={`/climatisation/${c.slug}`}
                                    className="px-3 py-2 bg-slate-800 rounded-lg border border-slate-700/80 hover:border-[#D59B2B] hover:text-[#D59B2B] text-slate-300 transition-colors flex items-center justify-between"
                                >
                                    <span>Clim {c.name}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">({c.zip.slice(0, 2)})</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Matériels Phares ou Guides SEO */}
                    <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/60 space-y-5 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 text-[#D59B2B]">
                            {isProductPage ? <FileText className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                            <h3 className="font-bold text-lg text-white">
                                {isProductPage ? "Derniers Guides & Conseils" : "Matériels Climatisation Phares"}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-400">
                            {isProductPage
                                ? "Articles rédigés par nos frigoristes et bureaux d'étude."
                                : "Fiches techniques & tarifs indicatifs par référence constructeur."}
                        </p>
                        <div className="space-y-3">
                            {isProductPage && relatedArticles.length > 0
                                ? relatedArticles.map((article) => (
                                      <Link
                                          key={article.slug}
                                          href={`/entreprise/${article.expert.slug}/articles/${article.slug}`}
                                          className="group bg-slate-800 p-3.5 rounded-xl border border-slate-700 hover:border-[#D59B2B] transition-all flex items-center justify-between"
                                      >
                                          <div className="flex-1 pr-3">
                                              <h4 className="font-semibold text-xs text-slate-200 group-hover:text-[#D59B2B] transition-colors line-clamp-2">
                                                  {article.title}
                                              </h4>
                                              <span className="text-[10px] text-slate-400 mt-1 block">
                                                  Par {article.expert.nom_entreprise}
                                              </span>
                                          </div>
                                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#D59B2B] transition-colors transform group-hover:translate-x-1 shrink-0" />
                                      </Link>
                                  ))
                                : TOP_EQUIPMENT_REFS.map((eq) => (
                                      <Link
                                          key={eq.slug}
                                          href={`/materiel/${eq.slug}`}
                                          className="group bg-slate-800 p-3.5 rounded-xl border border-slate-700 hover:border-[#D59B2B] transition-all flex items-center justify-between"
                                      >
                                          <div>
                                              <h4 className="font-semibold text-xs text-slate-200 group-hover:text-[#D59B2B] transition-colors">
                                                  {eq.title}
                                              </h4>
                                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                                  {eq.brand} · {eq.type}
                                              </span>
                                          </div>
                                          <Zap className="w-3.5 h-3.5 text-[#D59B2B] group-hover:scale-110 transition-transform" />
                                      </Link>
                                  ))}
                        </div>
                    </div>

                </div>

                {/* Bottom Anchor Link to Home */}
                <div className="pt-8 border-t border-slate-800/80 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                    <p>
                        © {currentYear} Gainable.fr — Le réseau n°1 de mise en relation climatisation, PAC & génie climatique en France, Suisse et Belgique.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-[#D59B2B] hover:underline font-semibold"
                    >
                        Accéder au moteur de recherche d&apos;installateurs RGE &rarr;
                    </Link>
                </div>

            </div>
        </section>
    );
}

