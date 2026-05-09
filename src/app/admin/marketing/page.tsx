"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
    Share2, 
    Facebook, 
    Linkedin, 
    Instagram, 
    Sparkles, 
    RefreshCw, 
    ExternalLink,
    Copy,
    Check,
    Image as ImageIcon,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface MarketingPost {
    linkedin: string;
    facebook: string;
    instagram: string;
    articleInfo: {
        id: string;
        title: string;
        slug: string;
        mainImage: string;
        expertName: string;
        url: string;
    };
}

export default function MarketingPage() {
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<MarketingPost | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const generatePost = async () => {
        setLoading(true);
        setPost(null);
        try {
            const res = await fetch("/api/admin/marketing/generate");
            if (!res.ok) throw new Error("Failed to generate");
            const data = await res.json();
            setPost(data);
            toast.success("Nouveaux posts générés avec succès !");
        } catch (err) {
            toast.error("Erreur lors de la génération. Réessayez.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        toast.success("Copié dans le presse-papier");
        setTimeout(() => setCopied(null), 2000);
    };

    const handleShare = async (platform: string, content: string) => {
        const url = post?.articleInfo.url || "";
        const title = post?.articleInfo.title || "";

        if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        } else if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: content,
                    url: url,
                });
            } catch (err) {
                console.error("Sharing failed", err);
            }
        }
    };

    return (
        <div className="container mx-auto py-10 space-y-8 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-100">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-amber-500 fill-amber-500" />
                        AI Social Media Manager
                    </h1>
                    <p className="text-slate-500 mt-1">Transformez vos 21 000+ articles en opportunités marketing quotidiennes.</p>
                </div>
                <Button 
                    onClick={generatePost} 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 h-12 px-6 rounded-full group"
                >
                    {loading ? (
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    )}
                    {post ? "Générer un autre post" : "Lancer l'agent marketing"}
                </Button>
            </div>

            {!post && !loading && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-4">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                        <Share2 className="w-10 h-10" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-xl font-semibold text-slate-800">Prêt à booster votre visibilité ?</h3>
                        <p className="text-slate-500 mt-2">Cliquez sur le bouton ci-dessus pour que l'IA choisisse un article et prépare vos publications réseaux sociaux.</p>
                    </div>
                    <Button variant="outline" onClick={generatePost} className="rounded-full">
                        Démarrer maintenant
                    </Button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <Sparkles className="w-8 h-8 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-medium text-slate-800 animate-pulse">L'IA parcourt vos 21 404 articles...</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Sélection du meilleur sujet et rédaction de posts optimisés pour chaque plateforme.</p>
                    </div>
                </div>
            )}

            {post && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* LEFT: ARTICLE INFO */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl">
                            <div className="aspect-video relative group">
                                <img 
                                    src={post.articleInfo.mainImage} 
                                    alt={post.articleInfo.title}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <Badge className="bg-white/20 backdrop-blur-md text-white border-none">Article Source</Badge>
                                </div>
                            </div>
                            <CardHeader className="p-6">
                                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{post.articleInfo.expertName}</div>
                                <CardTitle className="text-xl leading-tight">{post.articleInfo.title}</CardTitle>
                                <CardDescription className="line-clamp-3">Article selectionné automatiquement pour son potentiel viral.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 border-t border-slate-50 mt-auto">
                                <Button asChild variant="outline" className="w-full justify-between group rounded-xl h-12">
                                    <a href={post.articleInfo.url} target="_blank" rel="noopener noreferrer">
                                        Voir l'article complet
                                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0 text-amber-600">
                                <ImageIcon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-amber-900">Astuce Visuelle</p>
                                <p className="text-xs text-amber-800 leading-relaxed">Utilisez l'image de l'article ou téléchargez un visuel complémentaire pour augmenter le taux de clic de 40%.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SOCIAL POSTS */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="linkedin" className="w-full">
                            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6 p-1 bg-slate-100/80 rounded-2xl h-14">
                                <TabsTrigger value="linkedin" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 font-medium">
                                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                    LinkedIn
                                </TabsTrigger>
                                <TabsTrigger value="facebook" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 font-medium">
                                    <Facebook className="w-4 h-4 text-[#1877f2]" />
                                    Facebook
                                </TabsTrigger>
                                <TabsTrigger value="instagram" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 font-medium">
                                    <Instagram className="w-4 h-4 text-[#e4405f]" />
                                    Instagram
                                </TabsTrigger>
                            </TabsList>

                            {/* LINKEDIN TAB */}
                            <TabsContent value="linkedin" className="animate-in fade-in duration-500">
                                <SocialPostCard 
                                    platform="LinkedIn"
                                    icon={<Linkedin className="w-5 h-5 text-white" />}
                                    color="#0077b5"
                                    content={post.linkedin}
                                    onCopy={() => copyToClipboard(post.linkedin, 'li')}
                                    onShare={() => handleShare('linkedin', post.linkedin)}
                                    isCopied={copied === 'li'}
                                />
                            </TabsContent>

                            {/* FACEBOOK TAB */}
                            <TabsContent value="facebook" className="animate-in fade-in duration-500">
                                <SocialPostCard 
                                    platform="Facebook"
                                    icon={<Facebook className="w-5 h-5 text-white" />}
                                    color="#1877f2"
                                    content={post.facebook}
                                    onCopy={() => copyToClipboard(post.facebook, 'fb')}
                                    onShare={() => handleShare('facebook', post.facebook)}
                                    isCopied={copied === 'fb'}
                                />
                            </TabsContent>

                            {/* INSTAGRAM TAB */}
                            <TabsContent value="instagram" className="animate-in fade-in duration-500">
                                <SocialPostCard 
                                    platform="Instagram"
                                    icon={<Instagram className="w-5 h-5 text-white" />}
                                    color="#e4405f"
                                    content={post.instagram}
                                    onCopy={() => copyToClipboard(post.instagram, 'ig')}
                                    onShare={() => handleShare('instagram', post.instagram)}
                                    isCopied={copied === 'ig'}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            )}
        </div>
    );
}

function SocialPostCard({ platform, icon, color, content, onCopy, onShare, isCopied }: any) {
    return (
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white ring-1 ring-slate-100">
            <div style={{ backgroundColor: color }} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                        {icon}
                    </div>
                    <span className="text-white font-bold tracking-wide">Aperçu {platform}</span>
                </div>
                <Badge className="bg-white/10 text-white border-none hover:bg-white/20 transition-colors">
                    Format Optimisé
                </Badge>
            </div>
            <CardContent className="p-8">
                <div className="bg-slate-50/50 rounded-2xl p-6 text-slate-700 whitespace-pre-wrap leading-relaxed font-sans min-h-[300px] border border-slate-100">
                    {content}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button onClick={onCopy} variant="outline" className="flex-1 h-14 rounded-2xl border-2 hover:bg-slate-50 group">
                        {isCopied ? (
                            <Check className="w-5 h-5 mr-2 text-green-600" />
                        ) : (
                            <Copy className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        )}
                        {isCopied ? "Copié !" : "Copier le texte"}
                    </Button>
                    <Button onClick={onShare} style={{ backgroundColor: color }} className="flex-1 h-14 rounded-2xl text-white hover:opacity-90 shadow-lg group">
                        <Share2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Partager sur {platform}
                        <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
