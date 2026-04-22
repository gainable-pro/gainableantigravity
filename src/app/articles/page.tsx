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

async function getArticlesData(page: number) {
    const take = 15;
    const skip = (page - 1) * take;

    const [articles, totalCount] = await Promise.all([
        prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { createdAt: 'desc' },
            take,
            skip,
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
        }),
        prisma.article.count({
            where: { status: 'PUBLISHED' }
        })
    ]);

    return { articles, totalCount, totalPages: Math.ceil(totalCount / take) };
}

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams;
    const currentPage = parseInt(params?.page || '1', 10);
    const { articles, totalCount, totalPages } = await getArticlesData(currentPage);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* HERO */}
            <div className="bg-[#1F2D3D] text-white py-20 px-6">
                <div className="max-w-7xl mx-auto text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold">Articles & Conseils</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-6">
                        L'expertise de nos professionnels à votre service. Découvrez tout ce qu'il faut savoir sur la climatisation gainable, l'isolation et les économies d'énergie.
                    </p>
                    <div className="inline-block bg-[#D59B2B]/20 border border-[#D59B2B]/30 rounded-full px-6 py-2 text-[#D59B2B] font-semibold tracking-wide">
                        Découvrez nos {totalCount.toLocaleString('fr-FR')} articles d'experts
                    </div>
                </div>
            </div>

            {/* LIST */}
            <div className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
                {articles.length > 0 ? (
                    <>
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
                                                            <span className="text-[#D59B2B] font-medium truncate max-w-[120px]">{article.targetCity}</span>
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
                                                            className="rounded-full flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                                            <User className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-xs font-bold text-[#1F2D3D] truncate">{article.expert.nom_entreprise}</span>
                                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                                            <span className="truncate">{article.expert.ville}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                )
                            })}
                        </div>
                        
                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-2 flex-wrap">
                                {currentPage > 1 && (
                                    <Link href={`/articles?page=${currentPage - 1}`} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#D59B2B] hover:text-[#D59B2B] transition-all">
                                        Précédent
                                    </Link>
                                )}
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    // Complex logic for centered pagination window (e.g. 1 2 3 4 5, or 10 11 12 13 14)
                                    let start = Math.max(1, currentPage - 2);
                                    let end = Math.min(totalPages, start + 4);
                                    if (end - start < 4) {
                                        start = Math.max(1, end - 4);
                                    }
                                    const pageNum = start + i;
                                    if (pageNum > totalPages) return null;
                                    
                                    return (
                                        <Link 
                                            key={pageNum} 
                                            href={`/articles?page=${pageNum}`}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${pageNum === currentPage ? 'bg-[#D59B2B] text-white border-[#D59B2B] font-bold shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-[#D59B2B] hover:text-[#D59B2B]'}`}
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                })}

                                {currentPage < totalPages && (
                                    <Link href={`/articles?page=${currentPage + 1}`} className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#D59B2B] hover:text-[#D59B2B] transition-all">
                                        Suivant
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                        <p className="text-slate-500 text-lg">Aucun article publié pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
