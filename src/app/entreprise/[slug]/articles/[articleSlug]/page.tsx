import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, Phone, MapPin, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;


interface PageProps {
    params: Promise<{
        slug: string; // Expert slug
        articleSlug: string; // Article slug
    }>;
}

async function getArticleData(slug: string, articleSlug: string) {
    const expert = await prisma.expert.findUnique({
        where: { slug },
        select: {
            id: true,
            nom_entreprise: true,
            slug: true,
            ville: true,
            logo_url: true,
            user: { select: { email: true } }, // fetch email from user
            // Phone might be missing or in another relation? I'll skip phone for now or check if it exists later.
            expert_type: true
        }
    });

    if (!expert) return null;

    const article = await prisma.article.findUnique({
        where: {
            expertId_slug: {
                expertId: expert.id,
                slug: articleSlug
            }
        },
    });

    if (!article || article.status !== 'PUBLISHED') return null;

    return { expert, article };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, articleSlug } = await params;
    const data = await getArticleData(slug, articleSlug);
    if (!data) return {};

    const { article, expert } = data;

    return {
        title: `${article.title} - ${expert.nom_entreprise}`,
        description: article.metaDesc || article.introduction?.slice(0, 160) || "Article sur la climatisation gainable.",
        openGraph: {
            title: article.title,
            description: article.metaDesc || article.introduction?.slice(0, 160),
            images: article.mainImage ? [{ url: article.mainImage, alt: article.altText || article.title }] : [],
            type: 'article',
            authors: [expert.nom_entreprise],
            publishedTime: article.publishedAt?.toISOString(),
        }
    };
}

export default async function PublicArticlePage({ params }: PageProps) {
    const { slug, articleSlug } = await params;
    const data = await getArticleData(slug, articleSlug);

    if (!data) {
        notFound();
    }

    const { expert, article } = data;

    // Structured Data (Schema.org)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "image": article.mainImage ? [article.mainImage] : [],
        "datePublished": article.publishedAt?.toISOString(),
        "dateModified": article.updatedAt.toISOString(),
        "author": [{
            "@type": "Organization",
            "name": expert.nom_entreprise,
            "url": `https://gainable.fr/pro/${expert.slug}`
        }],
        "publisher": {
            "@type": "Organization",
            "name": "Gainable.fr",
            "logo": {
                "@type": "ImageObject",
                "url": "https://gainable.fr/logo.png" // Replace with real logo URL
            }
        },
        "description": article.metaDesc || article.introduction,
        "articleBody": article.content
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* HERO IMAGE */}
            <div className="relative w-full h-[300px] md:h-[400px]">
                {article.mainImage ? (
                    <Image
                        src={article.mainImage}
                        alt={article.altText || article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
                        Pas d'image
                    </div>
                )}
            </div>

            {/* HEADER CONTENT (Below Image) */}
            <div className="max-w-4xl mx-auto w-full px-6 -mt-12 relative z-10">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                            <span className="bg-[#D59B2B] text-white px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider">
                                Conseil Expert
                            </span>
                            {article.publishedAt && (
                                <time dateTime={article.publishedAt.toISOString()} className="text-slate-500 font-medium">
                                    {format(article.publishedAt, "d MMMM yyyy", { locale: fr })}
                                </time>
                            )}
                        </div>

                        {/* Social Share Buttons */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase hidden sm:block">Partager :</span>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=https://gainable.fr/entreprise/${expert.slug}/articles/${article.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all"
                                title="Partager sur Facebook"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://gainable.fr/entreprise/${expert.slug}/articles/${article.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-blue-50 hover:bg-[#0077b5] text-[#0077b5] hover:text-white flex items-center justify-center transition-all"
                                title="Partager sur LinkedIn"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                            </a>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight text-slate-800">
                        {article.title}
                    </h1>

                    {/* Author mini-block */}
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100 mt-4">
                        {expert.logo_url ? (
                            <Image
                                src={expert.logo_url}
                                alt={expert.nom_entreprise}
                                width={40}
                                height={40}
                                className="rounded-full border border-slate-200"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-500" />
                            </div>
                        )}
                        <div className="font-medium text-slate-600">
                            Par{' '}
                            <Link href={`/pro/${expert.slug}`} className="text-[#D59B2B] hover:underline underline-offset-4">
                                {expert.nom_entreprise}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_350px] gap-12 mt-12">

                {/* ARTICLE CONTENT */}
                <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1F2D3D] prose-a:text-[#D59B2B] prose-img:rounded-xl">
                    {/* Introduction */}
                    {article.introduction && (
                        <div className="lead text-xl md:text-2xl text-slate-600 font-serif mb-8 border-l-4 border-[#D59B2B] pl-6 italic">
                            {article.introduction}
                        </div>
                    )}

                    {/* HTML Content */}
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />

                    {/* FAQ Schema render if needed? Or just hidden schema handled above. */}
                    {/* If we had FAQ fields, we would render them here as Accordion. */}
                </article>

                {/* SIDEBAR : AUTHOR & CTA */}
                <aside className="space-y-8 sticky top-24 h-fit">

                    {/* Author Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
                        {expert.logo_url ? (
                            <Image
                                src={expert.logo_url}
                                alt={expert.nom_entreprise}
                                width={100}
                                height={100}
                                className="rounded-full border-4 border-slate-50"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                                <User className="w-10 h-10" />
                            </div>
                        )}

                        <div>
                            <h3 className="font-bold text-lg text-[#1F2D3D]">{expert.nom_entreprise}</h3>
                            <p className="text-sm text-slate-500 flex items-center justify-center gap-1 mt-1">
                                <MapPin className="w-3 h-3" /> {expert.ville}
                            </p>
                        </div>

                        <Link href={`/pro/${expert.slug}`} className="w-full">
                            <Button variant="outline" className="w-full">
                                Voir le profil
                            </Button>
                        </Link>
                    </div>

                    {/* CTA Contact */}
                    <div className="bg-[#1F2D3D] p-8 rounded-2xl shadow-lg text-white text-center space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D59B2B]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <h3 className="text-xl font-bold relative z-10">
                            Besoin d'un conseil ou d'un devis ?
                        </h3>
                        <p className="text-slate-300 text-sm relative z-10">
                            Contactez <strong>{expert.nom_entreprise}</strong> pour votre projet de climatisation gainable.
                        </p>

                        <Link href={`/pro/${expert.slug}#contact`} className="block relative z-10">
                            <Button size="lg" className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-12 text-base">
                                Contacter cet expert <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}
