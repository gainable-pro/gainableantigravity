"use client";

import { useState, useRef, useEffect } from "react";
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
    value: string; // Content text or URL
    alt?: string; // For images
}

interface FAQItem {
    id: string;
    question: string;
    response: string;
}

export default function NewArticlePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- STATE ---
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [altText, setAltText] = useState("");
    // Video Main (Top) - Optional, users might prefer blocks now, but keeping for compatibility
    const [videoUrl, setVideoUrl] = useState("");
    const [targetCity, setTargetCity] = useState("");

    // BLOCKS (Flexible Content)
    const [blocks, setBlocks] = useState<ContentBlock[]>([
        { id: '1', type: 'h2', value: '' },
        { id: '2', type: 'text', value: '' },
    ]);

    // FAQ (Min 2)
    const [faq, setFaq] = useState<FAQItem[]>([
        { id: '1', question: '', response: '' },
        { id: '2', question: '', response: '' },
    ]);

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
        if (!slug || slug === slugify(title)) {
            setSlug(slugify(val));
        }
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

    // --- BLOCK ACTIONS ---
    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { id: Date.now().toString(), type, value: '' }]);
    };

    const removeBlock = (index: number) => {
        const newBlocks = [...blocks];
        newBlocks.splice(index, 1);
        setBlocks(newBlocks);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
        setBlocks(newBlocks);
    };

    const updateBlock = (index: number, field: keyof ContentBlock, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[index] = { ...newBlocks[index], [field]: value };
        setBlocks(newBlocks);
    };

    // Generic Upload for Blocks
    const handleBlockUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>, isVideo: boolean = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (isVideo && !['video/mp4', 'video/webm'].includes(file.type)) {
            alert("Format vidéo non supporté (MP4, WebM)");
            return;
        }

        setIsUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("folder", "articles");

        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            if (!res.ok) throw new Error("Upload failed");
            const json = await res.json();
            updateBlock(index, 'value', json.url);
        } catch (err) {
            alert("Erreur upload");
        } finally {
            setIsUploading(false);
        }
    };

    // --- MAIN IMAGE UPLOAD ---
    const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("folder", "articles");
        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            if (!res.ok) throw new Error("Erreur upload");
            const json = await res.json();
            setMainImage(json.url);
        } catch (err) {
            setError("Impossible d'uploader l'image.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Keep existing logic for top video if user wants it there
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        if (!['video/mp4', 'video/webm'].includes(file.type)) {
            alert("Format vidéo non supporté");
            setIsUploading(false);
            return;
        }
        const data = new FormData();
        data.append("file", file);
        data.append("folder", "articles");
        try {
            const res = await fetch("/api/upload", { method: "POST", body: data });
            if (!res.ok) throw new Error("Err");
            const json = await res.json();
            setVideoUrl(json.url);
        } catch (err) { setError("Erreur upload vidéo"); }
        finally { setIsUploading(false); }
    };

    // --- FAQ ACTIONS ---
    const updateFaq = (index: number, field: keyof FAQItem, value: string) => {
        const newFaq = [...faq];
        newFaq[index] = { ...newFaq[index], [field]: value };
        setFaq(newFaq);
    };

    const addFaq = () => {
        setFaq([...faq, { id: Date.now().toString(), question: '', response: '' }]);
    };

    const removeFaq = (index: number) => {
        if (faq.length <= 2) return;
        const newFaq = [...faq];
        newFaq.splice(index, 1);
        setFaq(newFaq);
    };

    // --- SUBMIT ---
    const handleSubmit = async (status: string) => {
        setIsLoading(true);
        setError(null);

        // Generate HTML Content for SEO/Legacy
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

        // Add FAQ to content if needed by SEO? Usually FAQ is Schema.
        // We leave FAQ separate in DB json but maybe append to content? No, strictly structured.

        const payload = {
            title,
            slug,
            introduction,
            mainImage,
            altText,
            videoUrl,
            targetCity,
            blocks, // Save Blocks!
            sections: [], // Deprecated
            faq,
            status,
            content: generatedContent, // Fallback HTML
            jsonContent: { blocks, faq } // Unified JSON
        };

        try {
            const res = await fetch("/api/dashboard/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                if (Array.isArray(data.error)) {
                    setError(data.error.map((err: any) => err.message).join(", "));
                } else {
                    setError(data.error || "Une erreur est survenue.");
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            if (status === 'PUBLISHED') alert("✅ Article publié !");
            router.push("/dashboard/articles");
            router.refresh();

        } catch (err) {
            setError("Erreur serveur.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsLoading(false);
        }
    };

    const wordCount = getTotalWordCount();
    const nbH2 = blocks.filter(b => b.type === 'h2').length;
    const hasImage = mainImage && altText.length > 5;

    // Simple Score
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
                    <h1 className="text-2xl font-bold text-slate-800">Rédiger un article</h1>
                    <p className="text-slate-500">Créez un contenu riche avec des blocs flexibles.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>{error}</div>
                </div>
            )}

            <div className="grid lg:grid-cols-[1fr_300px] gap-8">

                {/* --- MAIN COLUMN --- */}
                <div className="space-y-8">

                    {/* 1. INFO GENERALES */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">1</span>
                                Informations Générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Titre Principal (H1)</Label>
                                <Input placeholder="Ex: Comment choisir sa climatisation..." value={title} onChange={handleTitleChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Slug (URL)</Label>
                                    <div className="flex">
                                        <span className="bg-slate-50 border border-r-0 rounded-l-md px-3 py-2 text-slate-500 text-sm flex items-center">/articles/</span>
                                        <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} className="rounded-l-none font-mono" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ville Ciblée (SEO Local)</Label>
                                    <Input placeholder="Ex: Marseille" value={targetCity} onChange={(e) => setTargetCity(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. ILLUSTRATION */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2</span>
                                Illustration Principale
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Image de couverture</Label>
                                    <input type="file" ref={fileInputRef} onChange={handleMainImageChange} className="hidden" accept="image/*" />
                                    {!mainImage ? (
                                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                            {isUploading ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" /> : <UploadCloud className="w-8 h-8 mx-auto text-slate-400" />}
                                            <span className="text-xs text-slate-500 mt-2 block">Importer (JPG, WebP)</span>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200">
                                            <img src={mainImage} alt="Preview" className="w-full h-32 object-cover" />
                                            <button onClick={() => setMainImage("")} className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500 shadow-sm"><X className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Texte Alternatif</Label>
                                    <Input placeholder="Description de l'image" value={altText} onChange={(e) => setAltText(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. INTRODUCTION */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">3</span>
                                Introduction (Chapeau)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Textarea
                                placeholder="Résumez l'article en 3-4 lignes..."
                                className="min-h-[100px]"
                                value={introduction}
                                onChange={(e) => setIntroduction(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* 4. BLOCKS BUILDER */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-slate-800">Contenu de l'article</h2>
                            <p className="text-sm text-slate-500">Ajoutez des blocs pour construire votre article</p>
                        </div>

                        <div className="space-y-4">
                            {blocks.map((block, index) => (
                                <div key={block.id} className="relative group">
                                    <Card className={`border-l-4 shadow-sm transition-all hover:shadow-md ${block.type === 'h2' ? 'border-l-blue-600' : block.type === 'h3' ? 'border-l-blue-400' : block.type === 'image' ? 'border-l-purple-500' : 'border-l-slate-300'}`}>
                                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => moveBlock(index, 'up')} disabled={index === 0} title="Monter">
                                                <MoveUp className="w-4 h-4 text-slate-400" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} title="Descendre">
                                                <MoveDown className="w-4 h-4 text-slate-400" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => removeBlock(index)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <CardContent className="p-4 pt-4">
                                            {/* Block Header */}
                                            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                {block.type === 'h2' && <><Heading className="w-3 h-3" /> Section (H2)</>}
                                                {block.type === 'h3' && <><Heading className="w-3 h-3" /> Sous-section (H3)</>}
                                                {block.type === 'text' && <><AlignLeft className="w-3 h-3" /> Paragraphe</>}
                                                {block.type === 'image' && <><ImageIcon className="w-3 h-3" /> Image</>}
                                                {block.type === 'video' && <><Video className="w-3 h-3" /> Vidéo</>}
                                            </div>

                                            {/* BLOCK CONTENT INPUTS */}
                                            {block.type === 'h2' && (
                                                <Input
                                                    value={block.value}
                                                    onChange={(e) => updateBlock(index, 'value', e.target.value)}
                                                    placeholder="Titre de la section..."
                                                    className="font-bold text-lg border-x-0 border-t-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-500"
                                                />
                                            )}
                                            {block.type === 'h3' && (
                                                <Input
                                                    value={block.value}
                                                    onChange={(e) => updateBlock(index, 'value', e.target.value)}
                                                    placeholder="Titre de la sous-section..."
                                                    className="font-semibold text-md border-x-0 border-t-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-400"
                                                />
                                            )}
                                            {block.type === 'text' && (
                                                <Textarea
                                                    value={block.value}
                                                    onChange={(e) => updateBlock(index, 'value', e.target.value)}
                                                    placeholder="Rédigez votre paragraphe..."
                                                    className="min-h-[120px] bg-slate-50 border-0 focus-visible:ring-1 ring-inset"
                                                />
                                            )}
                                            {block.type === 'image' && (
                                                <div className="flex gap-4 items-start">
                                                    <div className="flex-1 space-y-2">
                                                        {!block.value ? (
                                                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                                                                <Label htmlFor={`file-${block.id}`} className="cursor-pointer flex flex-col items-center gap-2 text-slate-500 hover:text-blue-600">
                                                                    <UploadCloud className="w-6 h-6" />
                                                                    <span>Choisir une image</span>
                                                                    <Input id={`file-${block.id}`} type="file" className="hidden" accept="image/*" onChange={(e) => handleBlockUpload(index, e)} />
                                                                </Label>
                                                            </div>
                                                        ) : (
                                                            <div className="relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                                                <img src={block.value} alt={block.alt} className="w-full h-48 object-cover" />
                                                                <Button variant="secondary" size="sm" className="absolute top-2 right-2 h-8 w-8 p-0" onClick={() => updateBlock(index, 'value', '')}>
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="w-1/3 space-y-2">
                                                        <Label className="text-xs">Légende / Alt</Label>
                                                        <Input
                                                            value={block.alt || ''}
                                                            onChange={(e) => {
                                                                const newBlocks = [...blocks];
                                                                newBlocks[index] = { ...newBlocks[index], alt: e.target.value };
                                                                setBlocks(newBlocks);
                                                            }}
                                                            placeholder="Description SEO..."
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {block.type === 'video' && (
                                                <div className="space-y-4">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="URL YouTube ou..."
                                                            value={block.value.startsWith('http') ? block.value : ''}
                                                            onChange={(e) => updateBlock(index, 'value', e.target.value)}
                                                        />
                                                        <div className="relative">
                                                            <Button variant="outline" className="whitespace-nowrap">Upload</Button>
                                                            <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="video/mp4" onChange={(e) => handleBlockUpload(index, e, true)} />
                                                        </div>
                                                    </div>
                                                    {block.value && (
                                                        <div className="bg-slate-100 p-2 rounded text-xs truncate">
                                                            Source: {block.value}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        </CardContent>
                                    </Card>

                                    {/* Quick Insert Between Blocks (Hover) */}
                                    <div className="h-4 -my-2 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity z-10 relative">
                                        <div className="bg-blue-500 rounded-full p-1 shadow-sm cursor-pointer hover:scale-110 transition-transform" onClick={() => {
                                            const newBlocks = [...blocks];
                                            newBlocks.splice(index + 1, 0, { id: Date.now().toString(), type: 'text', value: '' });
                                            setBlocks(newBlocks);
                                        }} title="Insérer texte">
                                            <Plus className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TOOLBOX */}
                        <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
                            <CardContent className="p-4 flex flex-wrap gap-2 justify-center">
                                <span className="w-full text-center text-xs text-slate-400 uppercase tracking-widest mb-2">Ajouter un bloc</span>
                                <Button variant="outline" onClick={() => addBlock('h2')} className="gap-2">
                                    <Heading className="w-4 h-4" /> Titre (H2)
                                </Button>
                                <Button variant="outline" onClick={() => addBlock('text')} className="gap-2">
                                    <AlignLeft className="w-4 h-4" /> Texte
                                </Button>
                                <Button variant="outline" onClick={() => addBlock('image')} className="gap-2">
                                    <ImageIcon className="w-4 h-4" /> Image
                                </Button>
                                <Button variant="outline" onClick={() => addBlock('h3')} className="gap-2 text-slate-500">
                                    <Type className="w-4 h-4" /> Sous-titre (H3)
                                </Button>
                                <Button variant="outline" onClick={() => addBlock('video')} className="gap-2 text-slate-500">
                                    <Video className="w-4 h-4" /> Vidéo
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 5. FAQ */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-slate-800">FAQ</h2>
                        </div>
                        {faq.map((item, index) => (
                            <Card key={item.id} className="border-l-4 border-l-green-500">
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <Label className="uppercase text-xs text-slate-400 mb-1 block">Question {index + 1}</Label>
                                        <Button variant="ghost" size="sm" onClick={() => removeFaq(index)} className="text-red-500 h-6 w-6 p-0">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder="Question..."
                                        value={item.question}
                                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                    />
                                    <Textarea
                                        placeholder="Réponse..."
                                        value={item.response}
                                        onChange={(e) => updateFaq(index, 'response', e.target.value)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                        <Button variant="outline" onClick={addFaq} className="w-full py-2 border-dashed border-2 text-slate-500">
                            <Plus className="w-5 h-5 mr-2" /> Ajouter Question
                        </Button>
                    </div>

                    {/* SUBMIT */}
                    <Card className="border-t-4 border-t-blue-500 shadow-md">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800">Validation</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={() => handleSubmit('PUBLISHED')}
                                    className="flex-1 bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-6"
                                    disabled={isLoading || score < 100}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                    <Save className="mr-2 h-5 w-5" /> Publier
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleSubmit('DRAFT')}
                                    disabled={isLoading}
                                    className="flex-1 py-6"
                                >
                                    Brouillon
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* --- SIDEBAR --- */}
                <div className="space-y-6 sticky top-6 self-start">
                    <Card>
                        <CardHeader className="bg-slate-50 pb-4"><CardTitle className="text-sm">Score SEO</CardTitle></CardHeader>
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="text-4xl font-bold text-[#D59B2B]">{score}%</div>
                            <div className="text-xs text-slate-500">{scoreMessage}</div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#D59B2B]" style={{ width: `${score}%` }}></div>
                            </div>
                            <ul className="text-left text-xs space-y-2 text-slate-500">
                                <li>• {wordCount} mots (obj. 800)</li>
                                <li>• {nbH2} titres H2 (obj. 3)</li>
                                <li>• {faq.length} questions FAQ</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-50 border-purple-100">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-purple-700">
                                <HelpCircle className="w-4 h-4" /> Prompt IA
                            </div>
                            <p className="text-xs text-slate-600">Copiez ce prompt pour générer votre article.</p>
                            <Button variant="secondary" className="w-full text-xs" onClick={() => {
                                navigator.clipboard.writeText(`Rédige un article sur : ${title}... (Format JSON Blocks)`);
                                alert("Copié !");
                            }}>Copier Prompt</Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
