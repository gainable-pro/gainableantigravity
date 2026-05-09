"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    Share2, 
    Facebook, 
    Linkedin, 
    Sparkles, 
    RefreshCw, 
    ExternalLink,
    Copy,
    Check,
    Image as ImageIcon,
    ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface MarketingPost {
    linkedin: string;
    facebook: string;
    imagePrompt: string;
    analysis: string;
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
    const [generatingImage, setGeneratingImage] = useState(false);
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
            toast.success("Nouveaux posts ciblés générés !");
        } catch (err) {
            toast.error("Erreur lors de la génération. Réessayez.");
        } finally {
            setLoading(false);
        }
    };

    const generateVisual = async () => {
        setGeneratingImage(true);
        toast.info("Génération du visuel personnalisé en cours...");
        // Simulation of image generation call
        setTimeout(() => {
            setGeneratingImage(false);
            toast.success("Visuel généré avec succès ! (Simulation)");
        }, 3000);
    };

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        toast.success("Copié dans le presse-papier");
        setTimeout(() => setCopied(null), 2000);
    };

    const handleShare = async (platform: string) => {
        const url = post?.articleInfo.url || "";
        if (platform === 'linkedin') {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        }
    };

    const handleSchedule = async (platform: string, content: string) => {
        const date = new Date();
        date.setDate(date.getDate() + 1); // Default to tomorrow
        date.setHours(9, 0, 0, 0); // 9 AM

        try {
            const res = await fetch("/api/admin/marketing/schedule", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    platform: platform.toUpperCase(),
                    content,
                    imageUrl: post?.articleInfo.mainImage,
                    scheduledAt: date.toISOString()
                })
            });

            if (!res.ok) throw new Error("Scheduling failed");
            toast.success(`Post ${platform} programmé pour demain à 9h !`);
        } catch (err) {
            toast.error("Erreur lors de la programmation.");
        }
    };

    return (
        <div className="container mx-auto py-10 space-y-8 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-slate-100">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        Community Manager IA
                    </h1>
                    <p className="text-slate-500 mt-1">L'IA qui gère vos réseaux comme un pro de l'acquisition.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline"
                        onClick={() => window.open('/admin/marketing/calendar', '_blank')}
                        className="rounded-full h-12 px-6"
                    >
                        Calendrier éditorial
                    </Button>
                    <Button 
                        onClick={generatePost} 
                        disabled={loading}
                        className="bg-slate-900 hover:bg-slate-800 text-white shadow-xl h-12 px-8 rounded-full group"
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <RefreshCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                        )}
                        Générer une nouvelle campagne
                    </Button>
                </div>
            </div>

            {!post && !loading && (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-6">
                    <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600">
                        <Share2 className="w-12 h-12" />
                    </div>
                    <div className="max-w-md space-y-2">
                        <h3 className="text-2xl font-bold text-slate-800">Prêt à dominer vos réseaux ?</h3>
                        <p className="text-slate-500">L'IA va sélectionner un article à fort potentiel commercial et rédiger des posts optimisés pour LinkedIn et Facebook.</p>
                    </div>
                    <Button onClick={generatePost} className="rounded-full h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100">
                        Lancer l'agent maintenant
                    </Button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-32 space-y-8 text-center">
                    <div className="relative">
                        <div className="w-32 h-32 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                        <Sparkles className="w-10 h-10 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-800 animate-pulse">L'IA analyse vos articles...</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">Filtrage des sujets vendeurs et rédaction stratégique en cours.</p>
                    </div>
                </div>
            )}

            {post && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {/* LEFT: STRATEGY & ARTICLE */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-2xl bg-slate-900 text-white rounded-3xl overflow-hidden">
                            <CardHeader className="p-6 pb-0">
                                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-2">
                                    <Sparkles className="w-4 h-4" /> Analyse Stratégique
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-4">
                                    "{post.analysis}"
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl bg-white overflow-hidden rounded-3xl ring-1 ring-slate-100">
                            <div className="aspect-video relative group">
                                <img 
                                    src={post.articleInfo.mainImage || "/assets/placeholder.jpg"} 
                                    alt={post.articleInfo.title}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                                    <div className="space-y-1">
                                        <Badge className="bg-blue-600 text-white border-none mb-2">Source : {post.articleInfo.expertName}</Badge>
                                        <CardTitle className="text-white text-lg leading-tight line-clamp-2">{post.articleInfo.title}</CardTitle>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                                <Button asChild variant="outline" className="w-full justify-between group rounded-2xl h-14 border-2 hover:bg-slate-50">
                                    <a href={post.articleInfo.url} target="_blank" rel="noopener noreferrer">
                                        Voir l'article source
                                        <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                                    </a>
                                </Button>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                        <ImageIcon className="w-4 h-4 text-blue-600" /> Visuel sur mesure
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-3 italic">
                                        Prompt : {post.imagePrompt}
                                    </p>
                                    <Button onClick={generateVisual} disabled={generatingImage} variant="secondary" className="w-full rounded-xl bg-white border shadow-sm">
                                        {generatingImage ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2 text-amber-500" />}
                                        Générer un visuel IA
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: PLATFORM ADAPTATIONS */}
                    <div className="lg:col-span-8">
                        <Tabs defaultValue="linkedin" className="w-full">
                            <div className="flex items-center justify-between mb-6 bg-white p-2 rounded-3xl shadow-sm border border-slate-100">
                                <TabsList className="bg-transparent border-none p-0 h-12">
                                    <TabsTrigger value="linkedin" className="rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-6 flex items-center gap-2 font-bold transition-all">
                                        <Linkedin className="w-5 h-5" />
                                        LinkedIn (B2B)
                                    </TabsTrigger>
                                    <TabsTrigger value="facebook" className="rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-6 flex items-center gap-2 font-bold transition-all">
                                        <Facebook className="w-5 h-5" />
                                        Facebook (B2C)
                                    </TabsTrigger>
                                </TabsList>
                                <Badge variant="outline" className="mr-4 border-slate-200 text-slate-400 font-mono">ADAPTÉ PAR IA</Badge>
                            </div>

                            <TabsContent value="linkedin" className="animate-in fade-in zoom-in-95 duration-500">
                                <SocialPostCard 
                                    platform="LinkedIn"
                                    icon={<Linkedin className="w-6 h-6 text-white" />}
                                    color="#0077b5"
                                    content={post.linkedin}
                                    onCopy={() => copyToClipboard(post.linkedin, 'li')}
                                    onShare={() => handleShare('linkedin')}
                                    onSchedule={() => handleSchedule('LinkedIn', post.linkedin)}
                                    isCopied={copied === 'li'}
                                />
                            </TabsContent>

                            <TabsContent value="facebook" className="animate-in fade-in zoom-in-95 duration-500">
                                <SocialPostCard 
                                    platform="Facebook"
                                    icon={<Facebook className="w-6 h-6 text-white" />}
                                    color="#1877f2"
                                    content={post.facebook}
                                    onCopy={() => copyToClipboard(post.facebook, 'fb')}
                                    onShare={() => handleShare('facebook')}
                                    onSchedule={() => handleSchedule('Facebook', post.facebook)}
                                    isCopied={copied === 'fb'}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            )}
        </div>
    );
}

function SocialPostCard({ platform, icon, color, content, onCopy, onShare, onSchedule, isCopied }: any) {
    return (
        <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white ring-1 ring-slate-100">
            <div style={{ backgroundColor: color }} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30">
                        {icon}
                    </div>
                    <div>
                        <span className="text-white font-bold text-xl block leading-none">Publication {platform}</span>
                        <span className="text-white/70 text-xs mt-1 uppercase tracking-widest font-medium">Stratégie d'acquisition active</span>
                    </div>
                </div>
                <Button onClick={onSchedule} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-none rounded-xl h-10 px-4 flex items-center gap-2 backdrop-blur-sm">
                    <RefreshCw className="w-4 h-4" />
                    Programmer
                </Button>
            </div>
            <CardContent className="p-10">
                <div className="bg-slate-50/80 rounded-[2rem] p-8 text-slate-800 whitespace-pre-wrap leading-relaxed font-sans text-lg min-h-[400px] border border-slate-100 shadow-inner">
                    {content}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                    <Button onClick={onCopy} variant="outline" className="h-16 rounded-2xl border-2 hover:bg-slate-50 text-slate-700 font-bold text-lg group">
                        {isCopied ? (
                            <Check className="w-6 h-6 mr-3 text-green-600" />
                        ) : (
                            <Copy className="w-6 h-6 mr-3 text-slate-400 group-hover:scale-110 group-hover:text-blue-600 transition-all" />
                        )}
                        {isCopied ? "Copié !" : "Copier le texte"}
                    </Button>
                    <Button onClick={onShare} style={{ backgroundColor: color }} className="h-16 rounded-2xl text-white hover:opacity-90 shadow-xl font-bold text-lg group">
                        <Share2 className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                        Partager maintenant
                        <ArrowRight className="w-5 h-5 ml-auto opacity-50" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
