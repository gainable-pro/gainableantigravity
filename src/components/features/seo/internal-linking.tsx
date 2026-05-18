import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowRight, FileText } from "lucide-react";

interface InternalLinkingProps {
    zipCode?: string | null;
    city?: string | null;
    currentExpertSlug?: string;
    currentArticleSlug?: string;
}

export async function InternalLinking({ zipCode, city, currentExpertSlug, currentArticleSlug }: InternalLinkingProps) {
    let relatedExperts: any[] = [];
    let relatedArticles: any[] = [];

    const currentYear = new Date().getFullYear();

    // 1. Fetch related experts in the same department
    if (zipCode && zipCode.length >= 2) {
        const departmentPrefix = zipCode.substring(0, 2);
        
        relatedExperts = await prisma.expert.findMany({
            where: {
                code_postal: {
                    startsWith: departmentPrefix
                },
                slug: {
                    not: currentExpertSlug || undefined
                },
                is_active: true
            },
            take: 4,
            select: {
                nom_entreprise: true,
                slug: true,
                ville: true,
                expert_type: true
            }
        });
    }

    // 2. Fetch some general recent SEO articles to spread link juice
    relatedArticles = await prisma.article.findMany({
        where: {
            status: "PUBLISHED",
            slug: {
                not: currentArticleSlug || undefined
            }
        },
        orderBy: {
            publishedAt: 'desc'
        },
        take: 4,
        select: {
            title: true,
            slug: true,
            targetCity: true,
            expert: {
                select: {
                    slug: true,
                    nom_entreprise: true
                }
            }
        }
    });

    if (relatedExperts.length === 0 && relatedArticles.length === 0) {
        return null; // Nothing to show
    }

    return (
        <section className="bg-slate-50 py-16 mt-16 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
                
                {/* Related Experts Section */}
                {relatedExperts.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-slate-800">
                            Trouvez d'autres installateurs de climatisation dans le {zipCode ? zipCode.substring(0,2) : ""}
                        </h3>
                        <p className="text-slate-600">
                            Découvrez les autres professionnels qualifiés pour votre projet de climatisation réversible ou gainable.
                        </p>
                        <div className="flex flex-col gap-4">
                            {relatedExperts.map((expert) => (
                                <Link key={expert.slug} href={`/pro/${expert.slug}`} className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#D59B2B] transition-all flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800 group-hover:text-[#D59B2B] transition-colors">
                                            {expert.nom_entreprise}
                                        </h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3" /> {expert.ville}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#D59B2B] transition-colors transform group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Articles Section */}
                {relatedArticles.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-slate-800">
                            Nos derniers guides & conseils {currentYear}
                        </h3>
                        <p className="text-slate-600">
                            Informez-vous avant d'installer votre climatisation grâce aux conseils de nos experts partenaires.
                        </p>
                        <div className="flex flex-col gap-4">
                            {relatedArticles.map((article) => (
                                <Link key={article.slug} href={`/entreprise/${article.expert.slug}/articles/${article.slug}`} className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#D59B2B] transition-all flex items-center justify-between">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-slate-800 group-hover:text-[#D59B2B] transition-colors line-clamp-2">
                                            {article.title}
                                        </h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                            <FileText className="w-3 h-3" /> Par {article.expert.nom_entreprise}
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#D59B2B] transition-colors transform group-hover:translate-x-1 shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
