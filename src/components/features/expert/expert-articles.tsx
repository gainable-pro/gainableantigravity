import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface Article {
    slug: string;
    title: string;
    introduction: string | null;
    mainImage: string | null;
    publishedAt: Date | null;
}

interface ExpertArticlesProps {
    articles: Article[];
    expertSlug: string;
    expertName: string;
}

export function ExpertArticles({ articles, expertSlug, expertName }: ExpertArticlesProps) {
    if (!articles || articles.length === 0) return null;

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1F2D3D]">Nos conseils & réalisations</h2>
                {articles.length > 3 && (
                    <div className="hidden md:flex text-sm text-slate-500 italic">
                        Faites défiler pour voir plus &rarr;
                    </div>
                )}
            </div>

            <div className="relative group">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 -mx-4 px-4 scrollbar-hide">
                    {articles.map((article) => (
                        <div key={article.slug} className="snap-start flex-shrink-0 w-full sm:w-[300px] md:w-[350px]">
                            <Link href={`/entreprise/${expertSlug}/articles/${article.slug}`} className="block h-full">
                                <article className="h-full bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                                    {/* Image */}
                                    <div className="relative h-48 w-full bg-slate-100">
                                        {article.mainImage ? (
                                            <Image
                                                src={article.mainImage}
                                                alt={article.title}
                                                fill
                                                className="object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <span className="text-2xl">📝</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded text-[#1F2D3D]">
                                                Article
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        {article.publishedAt && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                                <Calendar className="w-3 h-3" />
                                                <time dateTime={article.publishedAt.toISOString()}>
                                                    {format(new Date(article.publishedAt), "d MMM yyyy", { locale: fr })}
                                                </time>
                                            </div>
                                        )}

                                        <h3 className="font-bold text-[#1F2D3D] line-clamp-2 mb-2 group-hover:text-[#D59B2B] transition-colors">
                                            {article.title}
                                        </h3>

                                        {article.introduction && (
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                                                {article.introduction}
                                            </p>
                                        )}

                                        <div className="mt-auto">
                                            <span className="text-[#D59B2B] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                                Lire la suite <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Gradient fade on right indicates scrollability */}
                <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-slate-50/100 to-transparent pointer-events-none md:hidden" />
            </div>
        </section>
    );
}
