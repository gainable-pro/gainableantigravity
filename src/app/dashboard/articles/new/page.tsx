"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronLeft, Loader2, Save, UploadCloud, X, Plus, Trash2, HelpCircle, Copy, GripVertical, Sparkles, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ArticleSection {
    id: string;
    title: string;
    subtitle: string;
    content: string;
    showSubtitle: boolean;
    list: string[];
    imageUrl?: string;
    imageAlt?: string;
}

interface FAQItem {
    id: string;
    question: string;
    response: string;
}

export default function NewArticlePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [topic, setTopic] = useState("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [altText, setAltText] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [targetCity, setTargetCity] = useState("");

    const [sections, setSections] = useState<ArticleSection[]>([
        { id: '1', title: '', subtitle: '', content: '', showSubtitle: false, list: [], imageUrl: '', imageAlt: '' }
    ]);

    // AI Generation Handler
    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError("Veuillez entrer un sujet pour générer l'article.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const res = await fetch("/api/dashboard/articles/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erreur lors de la génération");
            }

            const data = await res.json();

            // Populate form
            setTitle(data.title || "");
            setSlug(data.slug || slugify(data.title || ""));
            setTargetCity(data.targetCity || "");
            setIntroduction(data.introduction || "");

            // Map sections
            if (data.sections && Array.isArray(data.sections)) {
                const newSections = data.sections.map((s: any, idx: number) => ({
                    id: Date.now().toString() + idx,
                    title: s.title || "",
                    subtitle: s.title || "", // Using title as subtitle for compatibility
                    content: s.content || "",
                    showSubtitle: true,
                    list: [],
                    imageUrl: "",
                    imageAlt: ""
                }));
                setSections(newSections);
            }

            // Map FAQ
            if (data.faq && Array.isArray(data.faq)) {
                const newFaq = data.faq.map((f: any, idx: number) => ({
                    id: Date.now().toString() + idx,
                    question: f.question || "",
                    response: f.response || ""
                }));
                setFaq(newFaq);
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erreur de génération IA");
        } finally {
            setIsGenerating(false);
        }
    };





    // Voice Input Handler
    const handleVoiceInput = () => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'fr-FR';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = (event: any) => {
                console.error("Speech Error:", event.error);
                setIsListening(false);
                setError("Erreur lors de la reconnaissance vocale.");
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setTopic((prev) => (prev ? prev + " " + transcript : transcript));
            };

            recognition.start();
        } else {
            setError("Votre navigateur ne supporte pas la saisie vocale (Essayez Chrome).");
        }
    };

    const [faq, setFaq] = useState<FAQItem[]>([
        { id: '1', question: '', response: '' },
        { id: '2', question: '', response: '' }
    ]);

    // Helpers
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "articles");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Erreur upload");
            const data = await res.json();
            setMainImage(data.url);
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'upload de l'image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "articles");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Erreur upload");
            const data = await res.json();

            const newSections = [...sections];
            newSections[index].imageUrl = data.url;
            setSections(newSections);

        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'upload de l'image de section");
        } finally {
            setIsUploading(false);
        }
    };

    // Sections Management
    const addSection = () => {
        setSections([...sections, {
            id: Date.now().toString(),
            title: '',
            subtitle: '',
            content: '',
            showSubtitle: false,
            list: [],
            imageUrl: '',
            imageAlt: ''
        }]);
    };

    const updateSection = (index: number, field: keyof ArticleSection, value: any) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setSections(newSections);
    };

    const removeSection = (index: number) => {
        if (sections.length <= 1) return;
        const newSections = [...sections];
        newSections.splice(index, 1);
        setSections(newSections);
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
        const newSections = [...sections];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
        setSections(newSections);
    };

    // FAQ Management
    const addFaq = () => {
        setFaq([...faq, { id: Date.now().toString(), question: '', response: '' }]);
    };

    const updateFaq = (index: number, field: keyof FAQItem, value: string) => {
        const newFaq = [...faq];
        newFaq[index] = { ...newFaq[index], [field]: value };
        setFaq(newFaq);
    };

    const removeFaq = (index: number) => {
        if (faq.length <= 1) return;
        const newFaq = [...faq];
        newFaq.splice(index, 1);
        setFaq(newFaq);
    };

    // Submit
    const handleSubmit = async (status: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/dashboard/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    slug,
                    introduction,
                    mainImage,
                    altText,
                    videoUrl,
                    targetCity,
                    sections,
                    faq,
                    status
                })
            });

            const data = await res.json();

            if (!res.ok) {
                if (Array.isArray(data.error)) {
                    setError(data.error.map((e: any) => e.message).join(", "));
                } else {
                    setError(data.error || "Une erreur est survenue");
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            router.push("/dashboard/articles");
            router.refresh();

        } catch (err) {
            setError("Erreur de connexion au serveur");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsLoading(false);
        }
    };

    // SEO Score Calc (Simplified)
    const wordCount = (title + introduction + sections.map(s => s.title + s.content).join("") + faq.map(f => f.question + f.response).join("")).split(/\s+/).length;
    let score = 0;
    if (wordCount > 500) score += 40; else score += Math.round((wordCount / 500) * 40);
    if (sections.length >= 3) score += 30; else score += sections.length * 10;
    if (faq.length >= 2) score += 20;
    if (mainImage) score += 10;
    if (score > 100) score = 100;

    let scoreMessage = "Commencez à rédiger...";
    if (score > 50) scoreMessage = "Bon début !";
    if (score > 80) scoreMessage = "Excellent !";

    return (
        <div className="max-w-5xl mx-auto pb-24">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Rédiger un article</h1>
                    <p className="text-slate-500">Créez un contenu riche et optimisé SEO.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>{error}</div>
                </div>
            )}


            {/* AI GENERATION CARD */}
            <Card className="bg-slate-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        Assistant de Rédaction IA
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="ai-topic">Sujet de l'article</Label>
                            <div className="relative">
                                <Input
                                    id="ai-topic"
                                    placeholder="ex: Les avantages de la climatisation gainable dans une maison ancienne"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="bg-white pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-slate-600'}`}
                                    onClick={handleVoiceInput}
                                    title="Dicter le sujet"
                                >
                                    <Mic className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                            type="button"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Rédaction en cours...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Générer l'article
                                </>
                            )}
                        </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        L'IA va générer automatiquement le titre, l'introduction, le plan détaillé et la FAQ optimisés pour le SEO.
                    </p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* 1. INFO */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Informations Générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label>Titre Principal (H1) <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Ex: Les avantages de la climatisation gainable..."
                                    value={title}
                                    onChange={handleTitleChange}
                                    className="font-bold text-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Slug (URL) <span className="text-red-500">*</span></Label>
                                    <div className="flex items-center">
                                        <div className="bg-slate-100 border border-r-0 border-slate-200 px-3 py-2 text-sm text-slate-500 rounded-l-md">/articles/</div>
                                        <Input
                                            value={slug}
                                            onChange={(e) => setSlug(slugify(e.target.value))}
                                            className="rounded-l-none font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Ville Ciblée (SEO Local)</Label>
                                    <Input
                                        placeholder="Ex: Bordeaux"
                                        value={targetCity}
                                        onChange={(e) => setTargetCity(e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. IMAGE */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                Illustration Principale
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Image de couverture <span className="text-red-500">*</span></Label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    {!mainImage ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">Cliquez pour importer</span>
                                            <span className="text-xs text-slate-400 block mt-1">JPG, PNG, WEBP (Max 2MB)</span>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                                            <img src={mainImage} alt="Preview" className="w-full h-40 object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>Changer</Button>
                                                <Button size="sm" variant="destructive" onClick={() => setMainImage("")}><X className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Texte Alternatif (Alt) <span className="text-red-500">*</span></Label>
                                        <Input
                                            placeholder="Description de l'image pour le SEO"
                                            value={altText}
                                            onChange={(e) => setAltText(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Lien Vidéo (YouTube)</Label>
                                        <Input
                                            placeholder="https://youtube.com/watch?v=..."
                                            value={videoUrl}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. INTRO */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                Introduction (Chapeau)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <Textarea
                                placeholder="Une introduction captivante qui résume l'article et contient les mots-clés principaux..."
                                className="min-h-[100px] text-lg leading-relaxed"
                                value={introduction}
                                onChange={(e) => setIntroduction(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* 4. SECTIONS */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-slate-800">Corps de l'article</h2>
                            <span className="text-sm text-slate-500">{sections.length} sections</span>
                        </div>

                        {sections.map((section, index) => (
                            <Card key={section.id} className="relative group overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-blue-500 transition-colors"></div>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-4 flex-1">
                                            <Input
                                                placeholder={`Titre de la section ${index + 1} (H2)`}
                                                className="font-bold text-lg border-x-0 border-t-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-500"
                                                value={section.title}
                                                onChange={(e) => updateSection(index, 'title', e.target.value)}
                                            />

                                            {section.showSubtitle && (
                                                <Input
                                                    placeholder="Sous-titre (H3) - Optionnel"
                                                    className="font-semibold text-slate-600 border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-500 h-9 text-sm"
                                                    value={section.subtitle}
                                                    onChange={(e) => updateSection(index, 'subtitle', e.target.value)}
                                                />
                                            )}

                                            <Textarea
                                                placeholder="Contenu de la section..."
                                                className="min-h-[150px] resize-y"
                                                value={section.content}
                                                onChange={(e) => updateSection(index, 'content', e.target.value)}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" onClick={() => moveSection(index, 'up')} disabled={index === 0}>
                                                <ChevronLeft className="w-4 h-4 rotate-90" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeSection(index)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}>
                                                <ChevronLeft className="w-4 h-4 -rotate-90" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}>
                                                <ChevronLeft className="w-4 h-4 -rotate-90" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Secondary Image Upload */}
                                    <div className="pt-4 border-t border-slate-100 grid md:grid-cols-[120px_1fr] gap-4 items-start">
                                        <div className="relative group">
                                            {section.imageUrl ? (
                                                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                                    <img src={section.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => updateSection(index, 'imageUrl', '')}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 hover:border-blue-300 transition-all">
                                                    <div className="bg-blue-50 text-blue-500 p-2 rounded-full mb-1">
                                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 text-center leading-tight px-1">Ajouter<br />Image</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleSectionImageUpload(e, index)}
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs text-slate-500">Légende / Texte Alternatif (SEO) - Optionnel mais recommandé</Label>
                                            <Input
                                                placeholder="Description de l'image..."
                                                value={section.imageAlt || ''}
                                                onChange={(e) => updateSection(index, 'imageAlt', e.target.value)}
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs text-slate-500 h-8"
                                            onClick={() => updateSection(index, 'showSubtitle', !section.showSubtitle)}
                                        >
                                            {section.showSubtitle ? "Masquer sous-titre" : "+ Ajouter sous-titre"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <Button onClick={addSection} variant="outline" className="w-full py-8 border-dashed border-2 hover:border-blue-500 hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all group">
                            <Plus className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform" />
                            Ajouter une nouvelle section
                        </Button>
                    </div>

                    {/* 5. FAQ */}
                    <div className="space-y-4">
                        <h2 className="font-bold text-lg text-slate-800">FAQ (Questions Fréquentes)</h2>
                        {faq.map((item, index) => (
                            <Card key={item.id} className="border-l-4 border-l-green-500 bg-green-50/30">
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <Label className="text-green-700 font-bold">Question {index + 1}</Label>
                                        <Button variant="ghost" size="sm" onClick={() => removeFaq(index)} className="h-6 w-6 p-0 text-green-700 hover:text-green-900"><X className="w-4 h-4" /></Button>
                                    </div>
                                    <Input
                                        placeholder="Question ?"
                                        className="bg-white"
                                        value={item.question}
                                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                    />
                                    <Textarea
                                        placeholder="Réponse courte et précise..."
                                        className="bg-white min-h-[80px]"
                                        value={item.response}
                                        onChange={(e) => updateFaq(index, 'response', e.target.value)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                        <Button variant="outline" onClick={addFaq} className="w-full text-green-700 border-green-200 hover:bg-green-50">
                            <Plus className="w-4 h-4 mr-2" /> Ajouter une question
                        </Button>
                    </div>

                    {/* ACTIONS */}
                    <div className="sticky bottom-6 pt-4">
                        <div className="bg-white p-4 rounded-xl shadow-2xl border border-slate-200 flex items-center justify-between gap-4 max-w-5xl mx-auto">
                            <div className="text-sm text-slate-500 hidden md:block">
                                {isLoading ? "Sauvegarde en cours..." : "Modifications non enregistrées"}
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <Button variant="outline" className="flex-1 md:flex-none" onClick={() => handleSubmit('DRAFT')} disabled={isLoading}>
                                    Enregistrer Brouillon
                                </Button>
                                <Button className="flex-1 md:flex-none bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold" onClick={() => handleSubmit('PUBLISHED')} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                    Publier l'article
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* SIDEBAR */}
                <div className="space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader className="bg-slate-50 pb-4">
                            <CardTitle className="text-sm text-slate-700 font-bold uppercase tracking-wider">Score SEO</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-center space-y-4">
                            <div className="text-4xl font-bold text-[#D59B2B]">{score}%</div>
                            <div className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-full inline-block">
                                {scoreMessage}
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-full">
                                <div className="h-full bg-[#D59B2B] transition-all duration-500 ease-out" style={{ width: `${score}%` }}></div>
                            </div>
                            <div className="text-left text-xs space-y-2 text-slate-500 pt-2 border-t border-slate-100">
                                <div className="flex justify-between"><span>Mots ({wordCount})</span> <span>{wordCount >= 500 ? '✅' : '⚠️ 500+'}</span></div>
                                <div className="flex justify-between"><span>Sections ({sections.length})</span> <span>{sections.length >= 3 ? '✅' : '⚠️ 3+'}</span></div>
                                <div className="flex justify-between"><span>FAQ ({faq.length})</span> <span>{faq.length >= 2 ? '✅' : '⚠️ 2+'}</span></div>
                                <div className="flex justify-between"><span>Image</span> <span>{mainImage ? '✅' : '⚠️'}</span></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-50 border-purple-100">
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-purple-700">
                                <HelpCircle className="w-4 h-4" /> Prompt IA
                            </div>
                            <p className="text-xs text-slate-600">Copiez ce prompt pour générer l'article complet.</p>
                            <Button variant="secondary" className="w-full text-xs bg-white hover:bg-purple-100 text-purple-700 border border-purple-200" onClick={() => {
                                const prompt = `Tu es un expert en CVC. Rédige un article complet sur : "${title}".
Ville : ${targetCity || "Général"}
FORMAT JSON STRICT (Section[]):
{
  "introduction": "...",
  "sections": [
    { "title": "Titre H2", "content": "Paragraphe détaillé..." },
    { "title": "Titre H2", "content": "..." }
  ],
  "faq": [
    { "question": "...", "response": "..." }
  ]
}`;
                                navigator.clipboard.writeText(prompt);
                                alert("Prompt copié !");
                            }}>
                                <Copy className="w-3 h-3 mr-2" /> Copier Prompt
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
