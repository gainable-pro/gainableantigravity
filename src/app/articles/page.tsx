import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowRight, Calendar, User, MapPin } from "lucide-react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";


export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Outils & Conseils en Climatisation Gainable | Gainable.fr",
    description: "Retrouvez tous nos guides, conseils d'experts et articles sur la climatisation gainable. Isolation, prix, installation, fonctionnement.",
};

async function getArticles() {
    return await prisma.article.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' }, // Sort by creation date (most recent first)
        include: {
            expert: {
                select: {
                    slug: true,
                    nom_entreprise: true,
                    ville: true,
                    logo_url: true,
                    expert_type: true
                }
            }
        }
    });
}

export default async function ArticlesPage() {
    const articles = await getArticles();

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* HERO */}
            <div className="bg-[#1F2D3D] text-white py-20 px-6">
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold">Articles & Conseils</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        L'expertise de nos professionnels à votre service. Découvrez tout ce qu'il faut savoir sur la climatisation gainable, l'isolation et les économies d'énergie.
                    </p>
                </div>
            </div>

            {/* LIST */}
            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => {
                            const displayDate = article.publishedAt || article.createdAt;
                            return (
                                <Link
                                    key={article.id}
                                    href={`/entreprise/${article.expert.slug}/articles/${article.slug}`}
                                    className="group"
                                >
                                    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 h-full flex flex-col">
                                        {/* Image */}
                                        <div className="relative h-56 bg-slate-200 overflow-hidden">
                                            {article.mainImage ? (
                                                <Image
                                                    src={article.mainImage.startsWith('http') || article.mainImage.startsWith('/') ? article.mainImage : `/${article.mainImage}`}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <span className="text-4xl">📝</span>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-white/95 backdrop-blur-sm text-[#D59B2B] font-bold px-3 py-1 rounded text-xs uppercase tracking-wider shadow-sm">
                                                    Conseil
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                                <Calendar className="w-3 h-3" />
                                                <time dateTime={displayDate.toISOString()}>
                                                    {format(displayDate, "d MMMM yyyy", { locale: fr })}
                                                </time>
                                                {article.targetCity && (
                                                    <>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span className="text-[#D59B2B] font-medium">{article.targetCity}</span>
                                                    </>
                                                )}
                                            </div>

                                            <h2 className="text-xl font-bold text-[#1F2D3D] mb-3 line-clamp-2 group-hover:text-[#D59B2B] transition-colors">
                                                {article.title}
                                            </h2>

                                            {article.introduction && (
                                                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                                                    {article.introduction}
                                                </p>
                                            )}

                                            {/* Author Footer */}
                                            <div className="pt-4 mt-auto border-t border-slate-50 flex items-center gap-3">
                                                {article.expert.logo_url ? (
                                                    <Image
                                                        src={article.expert.logo_url}
                                                        alt={article.expert.nom_entreprise}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-[#1F2D3D]">{article.expert.nom_entreprise}</span>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                        <MapPin className="w-3 h-3" /> {article.expert.ville}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <p className="text-slate-500 text-lg">Aucun article publié pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
