"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    AlertCircle, ChevronLeft, Loader2, Save, Image as ImageIcon, X, UploadCloud, Plus,
    Trash2, HelpCircle, Copy, AlignLeft, Heading, Video, MoveUp, MoveDown, Type
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- TYPES ---
export type BlockType = 'h2' | 'h3' | 'text' | 'image' | 'video';

export interface ContentBlock {
    id: string;
    type: BlockType;
    value: string;
    alt?: string;
}

interface FAQItem {
    id: string;
    question: string;
    response: string;
}

export default function EditArticlePage({ params }: { params: Promise<{ articleId: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const articleId = resolvedParams.articleId;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- STATE ---
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [altText, setAltText] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [targetCity, setTargetCity] = useState("");
    const [currentStatus, setCurrentStatus] = useState<string>("DRAFT");

    // BLOCKS
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [faq, setFaq] = useState<FAQItem[]>([]);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`/api/dashboard/articles/${articleId}`);
                if (!res.ok) throw new Error("Article introuvable");
                const data = await res.json();

                setTitle(data.title);
                setSlug(data.slug);
                setIntroduction(data.introduction || "");
                setMainImage(data.mainImage || "");
                setAltText(data.altText || "");
                setTargetCity(data.targetCity || "");
                setVideoUrl(data.videoUrl || "");
                setCurrentStatus(data.status || "DRAFT");

                // HYDRATION LOGIC
                if (data.jsonContent && (data.jsonContent as any).blocks) {
                    // New Format
                    setBlocks((data.jsonContent as any).blocks);
                    if ((data.jsonContent as any).faq) setFaq((data.jsonContent as any).faq);
                } else if (data.jsonContent && (data.jsonContent as any).sections) {
                    // OLD Format -> Convert to Blocks
                    const oldSections = (data.jsonContent as any).sections;
                    const convertedBlocks: ContentBlock[] = [];

                    oldSections.forEach((s: any) => {
                        convertedBlocks.push({ id: Date.now().toString() + Math.random(), type: 'h2', value: s.title });
                        convertedBlocks.push({ id: Date.now().toString() + Math.random(), type: 'text', value: s.content });
                        if (s.showSubtitle && s.subtitle) {
                            convertedBlocks.push({ id: Date.now().toString() + Math.random(), type: 'h3', value: s.subtitle });
                        }
                    });
                    setBlocks(convertedBlocks);
                    if ((data.jsonContent as any).faq) setFaq((data.jsonContent as any).faq);
                } else {
                    // Fallback / Corrupted
                    setBlocks([
                        { id: '1', type: 'h2', value: 'Nouvelle Section' },
                        { id: '2', type: 'text', value: 'Contenu...' }
                    ]);
                }

                if (!data.jsonContent?.faq && !data.faq) {
                    setFaq([{ id: '1', question: '', response: '' }, { id: '2', question: '', response: '' }]);
                } else if (data.faq && !data.jsonContent?.faq) {
                    // If FAQ stored in column (unlikely given schema, likely jsonContent)
                    setFaq(data.faq as any);
                }

            } catch (err) {
                setError("Impossible de charger l'article.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchArticle();
    }, [articleId]);

    // --- HELPERS ---
    const slugify = (text: string) => {
        return text.toString().toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "")
            .replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTitle(val);
        if (!slug) setSlug(slugify(val));
    };

    const countWords = (str: string) => str.trim().split(/\s+/).filter(w => w.length > 0).length;

    const getTotalWordCount = () => {
        let count = countWords(title) + countWords(introduction);
        blocks.forEach(b => {
            if (b.type === 'text' || b.type === 'h2' || b.type === 'h3') {
                count += countWords(b.value);
            }
        });
        faq.forEach(f => {
            count += countWords(f.question) + countWords(f.response);
        });
        return count;
    };

    // --- ACTIONS ---
    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { id: Date.now().toString(), type, value: '' }]);
    };
    const removeBlock = (index: number) => {
        const newB = [...blocks]; newB.splice(index, 1); setBlocks(newB);
    };
    const moveBlock = (index: number, dir: 'up' | 'down') => {
        if ((dir === 'up' && index === 0) || (dir === 'down' && index === blocks.length - 1)) return;
        const newB = [...blocks];
        const sw = dir === 'up' ? index - 1 : index + 1;
        [newB[index], newB[sw]] = [newB[sw], newB[index]];
        setBlocks(newB);
    };
    const updateBlock = (index: number, field: keyof ContentBlock, val: string) => {
        const newB = [...blocks]; newB[index] = { ...newB[index], [field]: val }; setBlocks(newB);
    };

    const handleBlockUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>, isVideo: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (isVideo && !['video/mp4', 'video/webm'].includes(file.type)) return alert("Format vidéo incorrect");

        setIsUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("folder", "articles");
        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            if (!res.ok) throw new Error();
            const json = await res.json();
            updateBlock(index, 'value', json.url);
        } catch { alert("Erreur upload"); }
        finally { setIsUploading(false); }
    };

    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("folder", "articles");
        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            if (!res.ok) throw new Error();
            const json = await res.json();
            setMainImage(json.url);
        } catch { setError("Erreur upload image"); }
        finally { setIsUploading(false); }
    };

    const updateFaq = (i: number, f: keyof FAQItem, v: string) => {
        const n = [...faq]; n[i] = { ...n[i], [f]: v }; setFaq(n);
    };
    const addFaq = () => setFaq([...faq, { id: Date.now().toString(), question: '', response: '' }]);
    const removeFaq = (i: number) => { if (faq.length <= 2) return; const n = [...faq]; n.splice(i, 1); setFaq(n); };

    // --- SUBMIT ---
    const handleSubmit = async (status: string) => {
        setIsSaving(true);
        setError(null);

        let generatedContent = "";
        blocks.forEach(b => {
            if (!b.value) return;
            if (b.type === 'h2') generatedContent += `<h2>${b.value}</h2>`;
            if (b.type === 'h3') generatedContent += `<h3>${b.value}</h3>`;
            if (b.type === 'image') generatedContent += `<div class="article-image"><img src="${b.value}" alt="${b.alt || ''}" /></div>`;
            if (b.type === 'video') generatedContent += `<div class="article-video"><video controls src="${b.value}"></video></div>`;
            if (b.type === 'text') {
                generatedContent += b.value.split('\n').filter(line => line.trim() !== '').map(line => `<p>${line}</p>`).join('');
            }
        });

        const payload = {
            title,
            slug,
            introduction,
            mainImage,
            altText,
            videoUrl,
            targetCity,
            blocks,
            sections: [],
            faq,
            status,
            content: generatedContent,
            jsonContent: { blocks, faq }
        };

        try {
            const res = await fetch(`/api/dashboard/articles/${articleId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                if (Array.isArray(data.error)) setError(data.error.map((err: any) => err.message).join(", "));
                else setError(data.error || "Erreur");
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            alert("✅ Article mis à jour !");
            router.push("/dashboard/articles");
            router.refresh();

        } catch (err) {
            setError("Erreur serveur.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-center py-20 flex justify-center"><Loader2 className="animate-spin" /></div>;

    const wordCount = getTotalWordCount();
    const nbH2 = blocks.filter(b => b.type === 'h2').length;
    const hasImage = mainImage && altText.length > 5;
    const points = {
        words: Math.min(40, (wordCount / 800) * 40),
        structure: Math.min(20, nbH2 * 5),
        faq: Math.min(20, faq.length * 5),
        image: hasImage ? 20 : 0
    };
    const score = Math.min(100, Math.round(points.words + points.structure + points.faq + points.image));

    let scoreMessage = "Commencez à rédiger...";
    if (score > 40) scoreMessage = "Continuez comme ça ! 📝";
    if (score > 90) scoreMessage = "Presque prêt à publier 🚀";

    return (
        <div className="max-w-5xl mx-auto pb-24">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Modifier l'article</h1>
                    <p className="text-slate-500">Mettez à jour votre contenu (Blocs flexibles).</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>{error}</div>
                </div>
            )}

            <div className="grid lg:grid-cols-[1fr_300px] gap-8">
                <div className="space-y-8">
                    {/* INFO */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800">1. Informations Générales</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Titre Principal (H1)</Label>
                                <Input value={title} onChange={handleTitleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Slug</Label>
                                    <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ville Ciblée</Label>
                                    <Input value={targetCity} onChange={(e) => setTargetCity(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* IMAGE */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800">2. Illustration</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Image de couverture</Label>
                                    <input type="file" ref={fileInputRef} onChange={handleMainImageChange} className="hidden" accept="image/*" />
                                    {!mainImage ? (
                                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50">
                                            <UploadCloud className="w-8 h-8 mx-auto text-slate-400" />
                                            <span className="text-xs text-slate-500 mt-2 block">Importer image</span>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200">
                                            <img src={mainImage} alt="Preview" className="w-full h-32 object-cover" />
                                            <button onClick={() => setMainImage("")} className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500 shadow-sm"><X className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Texte Alt</Label>
                                    <Input value={altText} onChange={(e) => setAltText(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* INTRO */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800">3. Introduction</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Textarea value={introduction} onChange={(e) => setIntroduction(e.target.value)} className="min-h-[100px]" />
                        </CardContent>
                    </Card>

                    {/* BLOCKS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-slate-800">Contenu (Blocs)</h2>
                            <p className="text-sm text-slate-500">Ajoutez titre, texte, image, vidéo...</p>
                        </div>
                        <div className="space-y-4">
                            {blocks.map((block, index) => (
                                <div key={block.id} className="relative group">
                                    <Card className={`border-l-4 shadow-sm hover:shadow-md transition-all ${block.type === 'h2' ? 'border-l-blue-600' : block.type === 'h3' ? 'border-l-blue-400' : 'border-l-slate-300'}`}>
                                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => moveBlock(index, 'up')} disabled={index === 0}><MoveUp className="w-4 h-4 text-slate-400" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1}><MoveDown className="w-4 h-4 text-slate-400" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => removeBlock(index)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                        <CardContent className="p-4 pt-4">
                                            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                {block.type}
                                            </div>
                                            {block.type === 'h2' && <Input value={block.value} onChange={(e) => updateBlock(index, 'value', e.target.value)} className="font-bold text-lg border-x-0 border-t-0 border-b-2" placeholder="Titre..." />}
                                            {block.type === 'h3' && <Input value={block.value} onChange={(e) => updateBlock(index, 'value', e.target.value)} className="font-semibold text-md border-x-0 border-t-0 border-b-2" placeholder="Sous-titre..." />}
                                            {block.type === 'text' && <Textarea value={block.value} onChange={(e) => updateBlock(index, 'value', e.target.value)} className="min-h-[120px]" placeholder="Texte..." />}
                                            {/* Simplified Image/Video inputs for brevity in this replace call, similar logic to new page */}
                                            {(block.type === 'image' || block.type === 'video') && (
                                                <div className="flex gap-2">
                                                    <Input value={block.value} onChange={(e) => updateBlock(index, 'value', e.target.value)} placeholder="URL..." />
                                                    <Input type="file" className="w-20" onChange={(e) => handleBlockUpload(index, e, block.type === 'video')} />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                    <div className="h-4 -my-2 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10 relative">
                                        <div className="bg-blue-500 rounded-full p-1 cursor-pointer hover:scale-110" onClick={() => {
                                            const n = [...blocks]; n.splice(index + 1, 0, { id: Date.now().toString(), type: 'text', value: '' }); setBlocks(n);
                                        }}><Plus className="w-3 h-3 text-white" /></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TOOLBOX */}
                        <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
                            <CardContent className="p-4 flex flex-wrap gap-2 justify-center">
                                <Button variant="outline" onClick={() => addBlock('h2')} className="gap-2"><Heading className="w-4 h-4" /> H2</Button>
                                <Button variant="outline" onClick={() => addBlock('text')} className="gap-2"><AlignLeft className="w-4 h-4" /> Texte</Button>
                                <Button variant="outline" onClick={() => addBlock('image')} className="gap-2"><ImageIcon className="w-4 h-4" /> Image</Button>
                                <Button variant="outline" onClick={() => addBlock('h3')} className="gap-2"><Type className="w-4 h-4" /> H3</Button>
                                <Button variant="outline" onClick={() => addBlock('video')} className="gap-2"><Video className="w-4 h-4" /> Vidéo</Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* FAQ */}
                    <div className="space-y-4">
                        <h2 className="font-bold text-lg text-slate-800">FAQ</h2>
                        {faq.map((item, index) => (
                            <Card key={item.id} className="border-l-4 border-l-green-500">
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between"><Label>Q{index + 1}</Label><Button variant="ghost" size="sm" onClick={() => removeFaq(index)}><X className="w-4 h-4 text-red-500" /></Button></div>
                                    <Input value={item.question} onChange={(e) => updateFaq(index, 'question', e.target.value)} />
                                    <Textarea value={item.response} onChange={(e) => updateFaq(index, 'response', e.target.value)} />
                                </CardContent>
                            </Card>
                        ))}
                        <Button variant="outline" onClick={addFaq} className="w-full"><Plus className="w-5 h-5 mr-2" /> Ajouter Question</Button>
                    </div>

                    {/* VALIDATION */}
                    <Card className="border-t-4 border-t-blue-500 shadow-md">
                        <CardContent className="pt-6 flex gap-4">
                            <Button onClick={() => handleSubmit('PUBLISHED')} className="flex-1 bg-[#D59B2B] font-bold py-6 text-white" disabled={isSaving || score < 100}>
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save className="mr-2 w-5 h-5" />} Mettre à jour
                            </Button>
                            <Button variant="outline" onClick={() => handleSubmit('DRAFT')} className="flex-1 py-6" disabled={isSaving}>Brouillon</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 sticky top-6 self-start">
                    <Card>
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="text-4xl font-bold text-[#D59B2B]">{score}%</div>
                            <div className="text-xs text-slate-500">{scoreMessage}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
