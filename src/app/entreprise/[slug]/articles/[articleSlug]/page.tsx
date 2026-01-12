import { notFound } from "next/navigation";
import Image from "next/image";
import { ShareButtons } from "@/components/features/articles/share-buttons";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            user: { select: { email: true } },
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

    // Resolve Content Blocks (New System)
    const blocks = (article.jsonContent as any)?.blocks as any[];
    const hasBlocks = Array.isArray(blocks) && blocks.length > 0;

    console.log("--- DEBUG ARTICLE RENDER ---");
    console.log("Title:", article.title);
    console.log("Has Blocks:", hasBlocks);
    console.log("Blocks Count:", blocks?.length);
    console.log("Raw JSON:", JSON.stringify(article.jsonContent));
    console.log("----------------------------");

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
                "url": "https://gainable.fr/logo.png"
            }
        },
        "description": article.metaDesc || article.introduction,
        "articleBody": hasBlocks ? blocks.map(b => b.value).join(' ') : article.content
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Article Image - Optimized */}
            {article.mainImage ? (
                <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-xl">
                    <Image
                        src={article.mainImage.startsWith('http') || article.mainImage.startsWith('/') ? article.mainImage : `/${article.mainImage}`}
                        alt={article.altText || article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            ) : (
                <div className="relative w-full h-[300px] md:h-[400px] bg-slate-300 flex items-center justify-center text-slate-500">
                    Pas d'image
                </div>
            )}

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
                        <ShareButtons
                            url={`https://gainable.fr/entreprise/${slug}/articles/${articleSlug}`}
                            title={article.title}
                        />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight text-slate-800">
                        {article.title}
                    </h1>

                    {/* Author mini-block */}
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100 mt-4">
                        {expert.logo_url ? (
                            <div className="relative w-24 h-10">
                                <Image
                                    src={expert.logo_url}
                                    alt={expert.nom_entreprise}
                                    fill
                                    className="object-contain"
                                />
                            </div>
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
                {/* ARTICLE CONTENT */}
                <article className="max-w-none">
                    {/* Introduction */}
                    {article.introduction && (
                        <div className="lead text-xl md:text-2xl text-slate-700 font-serif mb-12 border-l-[6px] border-[#D59B2B] pl-8 italic leading-relaxed bg-[#D59B2B]/5 py-6 pr-4 rounded-r-lg">
                            {article.introduction}
                        </div>
                    )}

                    {/* Dynamic Block Rendering OR Fallback HTML */}
                    {hasBlocks ? (
                        <div className="space-y-10 text-lg text-slate-700 leading-relaxed font-sans">
                            {blocks.map((block: any) => (
                                <div key={block.id} className="article-block">
                                    {block.type === 'h2' && (
                                        <h2 className="text-3xl font-bold mt-16 mb-6 text-[#1F2D3D] relative inline-block border-b-4 border-[#D59B2B]/20 pb-2">
                                            {block.value}
                                        </h2>
                                    )}
                                    {block.type === 'h3' && (
                                        <h3 className="text-2xl font-bold mt-10 mb-4 text-[#1F2D3D]">
                                            {block.value}
                                        </h3>
                                    )}
                                    {block.type === 'text' && (
                                        <div className="space-y-6">
                                            {block.value.split('\n').map((line: string, i: number) => {
                                                if (!line.trim()) return null;
                                                return <p key={i} className="min-h-[1em]">{line}</p>
                                            })}
                                        </div>
                                    )}
                                    {block.type === 'image' && block.value && (
                                        <figure className="my-12">
                                            <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                                                <Image
                                                    src={block.value}
                                                    alt={block.alt || "Illustration"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            {block.alt && (
                                                <figcaption className="text-center text-sm text-slate-500 mt-3 italic bg-slate-50 py-2 px-4 rounded-full inline-block mx-auto">
                                                    {block.alt}
                                                </figcaption>
                                            )}
                                        </figure>
                                    )}
                                    {block.type === 'video' && block.value && (
                                        <figure className="my-12">
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border-4 border-slate-800">
                                                <video controls src={block.value} className="w-full h-full" />
                                            </div>
                                        </figure>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1F2D3D] prose-a:text-[#D59B2B] prose-img:rounded-xl prose-p:leading-relaxed prose-p:mb-6"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    )}

                </article>

                {/* SIDEBAR : AUTHOR & CTA */}
                <aside className="space-y-8 sticky top-24 h-fit">

                    {/* Author Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
                        {expert.logo_url ? (
                            <div className="relative w-48 h-24">
                                <Image
                                    src={expert.logo_url}
                                    alt={expert.nom_entreprise}
                                    fill
                                    className="object-contain"
                                />
                            </div>
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

                        {expert.slug !== 'gainable-fr' && (
                            <Link href={`/pro/${expert.slug}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                    Voir le profil
                                </Button>
                            </Link>
                        )}
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

                        <Link
                            href={expert.slug === 'gainable-fr' ? '/trouver-installateur' : `/pro/${expert.slug}#contact`}
                            className="block relative z-10"
                        >
                            <Button size="lg" className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-12 text-base">
                                {expert.slug === 'gainable-fr' ? "Contacter un expert" : "Contacter cet expert"}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}
