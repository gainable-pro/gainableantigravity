"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronLeft, Loader2, Save, Image as ImageIcon, X, UploadCloud, Plus, Trash2, HelpCircle, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Switch removed

interface Section {
    id: string;
    title: string;
    content: string;
    subtitle?: string;
    list?: string[]; // Simplified as array of strings
    showSubtitle?: boolean;
    showList?: boolean;
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
    const [videoUrl, setVideoUrl] = useState(""); // YouTube or Uploaded
    const [targetCity, setTargetCity] = useState("");

    // Sections (Min 3)
    const [sections, setSections] = useState<Section[]>([
        { id: '1', title: '', content: '', showSubtitle: false, showList: false },
        { id: '2', title: '', content: '', showSubtitle: false, showList: false },
        { id: '3', title: '', content: '', showSubtitle: false, showList: false },
    ]);

    // FAO (Min 2)
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
        sections.forEach(s => {
            count += countWords(s.title);
            count += countWords(s.content);
            if (s.subtitle) count += countWords(s.subtitle);
            if (s.list) // list logic if simplified or complex
                s.list.forEach(l => count += countWords(l));
        });
        faq.forEach(f => {
            count += countWords(f.question) + countWords(f.response);
        });
        return count;
    };

    // --- UPDATERS ---
    const updateSection = (index: number, field: keyof Section, value: any) => {
        const newSections = [...sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setSections(newSections);
    };

    const addSection = () => {
        setSections([...sections, { id: Date.now().toString(), title: '', content: '' }]);
    };

    const removeSection = (index: number) => {
        if (sections.length <= 3) return; // Prevent deleting below min
        const newSections = [...sections];
        newSections.splice(index, 1);
        setSections(newSections);
    };

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setError(null);
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
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        // Only allow mp4, webm
        if (!['video/mp4', 'video/webm'].includes(file.type)) {
            alert("Format vidéo non supporté (MP4, WebM uniquement)");
            return;
        }

        const data = new FormData();
        data.append("file", file);
        data.append("folder", "articles");
        try {
            // Re-use upload endpoint (generic)
            const res = await fetch("/api/upload", { method: "POST", body: data });
            if (!res.ok) throw new Error("Erreur upload");
            const json = await res.json();
            setVideoUrl(json.url);
        } catch (err) {
            setError("Impossible d'uploader la vidéo.");
        } finally {
            setIsUploading(false);
        }
    };

    // --- SUBMIT ---
    const handleSubmit = async (status: string) => {
        setIsLoading(true);
        setError(null);

        const payload = {
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

            if (status === 'PUBLISHED') {
                alert("✅ Article publié avec succès !");
            }

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

    // Scoring Logic
    const points = {
        words: Math.min(40, (wordCount / 800) * 40),
        sections: sections.length >= 3 ? 20 : (sections.length / 3) * 20,
        faq: faq.length >= 2 ? 20 : (faq.length / 2) * 20,
        image: (mainImage && altText.length > 5) ? 20 : 0
    };

    const score = Math.min(100, Math.round(points.words + points.sections + points.faq + points.image));

    let scoreMessage = "Commencez à rédiger...";
    if (score > 10) scoreMessage = "Bon début 👍";
    if (score > 40) scoreMessage = "Continuez comme ça ! 📝";
    if (score > 70) scoreMessage = "Article bien structuré 🏗️";
    if (score > 90) scoreMessage = "Presque prêt à publier 🚀";
    if (score >= 100) scoreMessage = "Article optimisé ✅";

    return (
        <div className="max-w-5xl mx-auto pb-24">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Rédiger un article (Assistant SEO)</h1>
                    <p className="text-slate-500">Laissez-vous guider pour créer un contenu parfaitement optimisé.</p>
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
                                Illustration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Image Principale</Label>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                    {!mainImage ? (
                                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                                            {isUploading ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" /> : <UploadCloud className="w-8 h-8 mx-auto text-slate-400" />}
                                            <span className="text-xs text-slate-500 mt-2 block">Cliquer pour importer (WebP recommandé)</span>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-200">
                                            <img src={mainImage} alt="Preview" className="w-full h-32 object-cover" />
                                            <button onClick={() => setMainImage("")} className="absolute top-2 right-2 bg-white p-1 rounded-full text-red-500 shadow-sm"><X className="w-4 h-4" /></button>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Texte Alternatif (Alt) *Obligatoire</Label>
                                    <Input placeholder="Description de l'image" value={altText} onChange={(e) => setAltText(e.target.value)} />
                                    <p className="text-xs text-slate-400">Décrivez l'image pour Google (ex: "Installation clim gainable dans un salon")</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2.5 VIDEO (Optional) */}
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base text-slate-800 flex items-center gap-2">
                                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">2b</span>
                                Vidéo (Optionnel)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-4">
                                <div className="flex gap-4 border-b border-slate-100 pb-2">
                                    <Button variant={videoUrl && !videoUrl.startsWith('http') ? 'outline' : 'default'} onClick={() => { }} className="pointer-events-none">Lien YouTube / Upload</Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Lien YouTube</Label>
                                        <Input
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={videoUrl.startsWith('http') ? videoUrl : ''}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            disabled={!!(videoUrl && !videoUrl.startsWith('http'))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ou fichier vidéo (MP4/WebM)</Label>
                                        <Input
                                            type="file"
                                            accept="video/mp4,video/webm"
                                            onChange={handleVideoUpload}
                                            disabled={!!(videoUrl && videoUrl.startsWith('http')) && videoUrl.length > 5}
                                        />
                                        {videoUrl && !videoUrl.startsWith('http') && (
                                            <div className="text-xs text-green-600 flex items-center gap-2">
                                                Fichier ajouté ✅
                                                <button onClick={() => setVideoUrl("")} className="text-red-500 hover:underline">Supprimer</button>
                                            </div>
                                        )}
                                    </div>
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
                            <p className="text-xs text-slate-400 mt-2">Sera utilisé comme Meta-description sur Google.</p>
                        </CardContent>
                    </Card>

                    {/* 4. CORPS (SECTIONS) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-slate-800">Corps de l'article</h2>
                            <p className="text-sm text-slate-500">Minimum 3 sections obligatoires</p>
                        </div>

                        {sections.map((section, index) => (
                            <Card key={section.id} className="border-l-4 border-l-blue-500">
                                <CardHeader className="bg-slate-50/50 py-3 px-4 flex flex-row items-center justify-between">
                                    <span className="uppercase text-xs font-bold text-slate-500 tracking-wider">Section {index + 1} (H2)</span>
                                    {sections.length > 3 && (
                                        <Button variant="ghost" size="sm" onClick={() => removeSection(index)} className="text-red-500 hover:text-red-700 h-8 w-8 p-0">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    <div>
                                        <Input
                                            placeholder="Titre de la section (ex: Les avantages du gainable)"
                                            value={section.title}
                                            onChange={(e) => updateSection(index, 'title', e.target.value)}
                                            className="font-bold text-lg border-x-0 border-t-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <Label className="sr-only">Contenu</Label>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">≈ 200–300 mots recommandés</span>
                                        </div>
                                        <Textarea
                                            placeholder="Contenu de cette section..."
                                            value={section.content}
                                            onChange={(e) => updateSection(index, 'content', e.target.value)}
                                            className="min-h-[150px] bg-slate-50 border-0 focus-visible:ring-1 ring-inset"
                                        />
                                        {/* SECTION PROGRESS BAR */}
                                        <div className="mt-2">
                                            <div className="flex justify-between text-[10px] text-slate-400 mb-1 px-1">
                                                <span>{countWords(section.content)} mots</span>
                                                <span>300 mots max recommandés</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${countWords(section.content) >= 200 ? 'bg-green-500' : 'bg-orange-300'}`}
                                                    style={{ width: `${Math.min(100, (countWords(section.content) / 300) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sub-options toggle */}
                                    <div className="flex gap-4 pt-2">
                                        {!section.showSubtitle && (
                                            <Button variant="outline" size="sm" onClick={() => updateSection(index, 'showSubtitle', true)} className="text-xs">
                                                + Sous-titre (H3)
                                            </Button>
                                        )}
                                        {/* List support can be added later if needed, simple text is priority */}
                                    </div>

                                    {section.showSubtitle && (
                                        <div className="pl-4 border-l-2 border-slate-200 space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Input
                                                placeholder="Sous-titre (H3)"
                                                value={section.subtitle || ''}
                                                onChange={(e) => updateSection(index, 'subtitle', e.target.value)}
                                                className="text-sm font-semibold"
                                            />
                                            <Button variant="ghost" size="sm" onClick={() => updateSection(index, 'showSubtitle', false)} className="text-xs text-red-500 h-6">
                                                Supprimer sous-titre
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}

                        <Button variant="outline" onClick={addSection} className="w-full py-6 border-dashed border-2 text-slate-500 hover:text-blue-600 hover:border-blue-300">
                            <Plus className="w-5 h-5 mr-2" /> Ajouter une section
                        </Button>
                    </div>

                    {/* 5. FAQ */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-slate-800">FAQ (Foire Aux Questions)</h2>
                            <p className="text-sm text-slate-500">Minimum 2 questions</p>
                        </div>

                        {faq.map((item, index) => (
                            <Card key={item.id} className="border-l-4 border-l-green-500">
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <Label className="uppercase text-xs text-slate-400 mb-1 block">Question {index + 1}</Label>
                                        {faq.length > 2 && (
                                            <Button variant="ghost" size="sm" onClick={() => removeFaq(index)} className="text-red-500 hover:text-red-700 h-6 w-6 p-0">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <Input
                                        placeholder="Ex: Quel est le prix moyen ?"
                                        value={item.question}
                                        onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                    />
                                    <Textarea
                                        placeholder="Réponse courte..."
                                        value={item.response}
                                        onChange={(e) => updateFaq(index, 'response', e.target.value)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                        <Button variant="outline" onClick={addFaq} className="w-full py-4 border-dashed border-2 text-slate-500 hover:text-green-600 hover:border-green-300">
                            <Plus className="w-5 h-5 mr-2" /> Ajouter une question
                        </Button>
                    </div>
                </div>

                {/* --- SIDEBAR --- */}
                <div className="space-y-6">
                    <div className="sticky top-6">
                        <Card className="shadow-lg border-blue-100 bg-white">
                            <CardHeader className="bg-slate-50 pb-4">
                                <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Score SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">

                                {/* SCORE GAUGE */}
                                <div className="space-y-2 text-center">
                                    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                                        {/* Simple Circle using CSS conic-gradient */}
                                        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(${score === 100 ? '#22c55e' : '#D59B2B'} ${score}%, #f1f5f9 0)` }}></div>
                                        <div className="absolute inset-1 bg-white rounded-full flex flex-col items-center justify-center">
                                            <span className={`text-2xl font-bold ${score === 100 ? 'text-green-600' : 'text-[#D59B2B]'}`}>{Math.round(score)}%</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 animate-pulse">
                                        {scoreMessage}
                                    </p>
                                </div>

                                {/* Word Count Meter */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className={wordCount >= 800 ? "text-green-600 font-bold" : "text-slate-600"}>
                                            {wordCount} / 800 mots
                                        </span>
                                        <span>
                                            {Math.min(100, Math.round((wordCount / 800) * 100))}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                                        <div
                                            className={`h-full transition-all duration-500 ${wordCount >= 800 ? 'bg-green-500' : 'bg-orange-400'}`}
                                            style={{ width: `${Math.min(100, (wordCount / 800) * 100)}%` }}
                                        />
                                    </div>
                                    {wordCount < 800 && (
                                        <div className="text-xs text-slate-500 space-y-1">
                                            <p className="flex items-center gap-1">
                                                💡 Ajoutez du contenu dans les sections (H2) ci-dessous.
                                            </p>
                                            <p className="font-medium text-orange-600">
                                                ✍️ Encore ~{800 - wordCount} mots à rédiger
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <ul className="space-y-3 text-sm border-t border-slate-100 pt-4">
                                    <li className={`flex items-center justify-between ${points.words >= 40 ? "text-green-600" : "text-slate-400"}`}>
                                        <div className="flex items-center gap-2">
                                            {points.words >= 40 ? <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</div> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1.5" />}
                                            <span>800 mots min (Corps article)</span>
                                        </div>
                                        <span className="text-xs font-mono">{wordCount}/800</span>
                                    </li>
                                    <li className={`flex items-center justify-between ${points.sections >= 20 ? "text-green-600" : "text-slate-400"}`}>
                                        <div className="flex items-center gap-2">
                                            {points.sections >= 20 ? <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</div> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1.5" />}
                                            <span>3 Sections (H2)</span>
                                        </div>
                                        <span className="text-xs font-mono">{sections.length}/3</span>
                                    </li>
                                    <li className={`flex items-center justify-between ${points.faq >= 20 ? "text-green-600" : "text-slate-400"}`}>
                                        <div className="flex items-center gap-2">
                                            {points.faq >= 20 ? <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</div> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1.5" />}
                                            <span>2 Questions FAQ</span>
                                        </div>
                                        <span className="text-xs font-mono">{faq.length}/2</span>
                                    </li>
                                    <li className={`flex items-center justify-between ${points.image >= 20 ? "text-green-600" : "text-slate-400"}`}>
                                        <div className="flex items-center gap-2">
                                            {points.image >= 20 ? <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</div> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1.5" />}
                                            <span>Image + Alt</span>
                                        </div>
                                        <span className="text-xs font-mono">{mainImage && altText ? "OK" : "-"}</span>
                                    </li>
                                </ul>

                                <div className="pt-2 flex flex-col gap-3">
                                    <Button
                                        onClick={() => handleSubmit('PUBLISHED')}
                                        className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold transition-all"
                                        disabled={isLoading || score < 100}
                                        title={score < 100 ? "Complétez l'article pour publier" : "Publier l'article"}
                                    >
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="mr-2 h-4 w-4" /> Publier l'article
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleSubmit('DRAFT')}
                                        disabled={isLoading}
                                    >
                                        Enregistrer brouillon
                                    </Button>
                                </div>

                                <div className="text-xs text-slate-400 italic text-center">
                                    {score < 100 ? "L'article doit être optimisé à 100% pour être publié." : "Votre article est prêt !"}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* AI HELPER */}
                    <div className="sticky top-[380px]">
                        <Card className="shadow-lg border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                            <CardHeader className="bg-purple-100/50 pb-4">
                                <CardTitle className="text-sm uppercase tracking-wider text-purple-700 flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4" /> Aide IA
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <p className="text-sm text-slate-600">
                                    En panne d'inspiration ? Ce prompt aide à générer le H1, les sections H2 et le contenu optimisé. Copiez-le et utilisez ChatGPT ou Claude.
                                </p>
                                <div className="bg-slate-100 p-3 rounded-md text-xs font-mono text-slate-600 max-h-32 overflow-y-auto border border-slate-200">
                                    Aide-moi à préparer le contenu d’un article informatif destiné à un particulier...
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-800"
                                    onClick={() => {
                                        const prompt = `Aide-moi à préparer le contenu d’un article informatif destiné à un particulier.
Sujet de l’article : ${title || "[TITRE DE L’ARTICLE]"}

Merci de fournir :
1) Un TITRE PRINCIPAL (H1) clair et pédagogique.
2) Une INTRODUCTION (Chapeau) de 80 à 120 mots.
3) 3 à 4 SECTIONS (H2), avec pour chacune :
   - Un titre de section.
   - Un contenu détaillé de 200 à 300 mots (Important pour le SEO).
4) Une CONCLUSION courte.
5) 2 à 3 QUESTIONS / RÉPONSES pour une FAQ.

Contraintes :
- Ton professionnel, neutre et pédagogique.
- Aucun discours commercial.
- Aucune promesse de prix, de garantie ou d’offre.
- Aucune comparaison ou mention de plateforme.
- Pas de HTML, pas de mise en forme, pas de couleur.
- Le contenu sera structuré automatiquement par l’éditeur Gainable.fr.`;
                                        navigator.clipboard.writeText(prompt);
                                        alert("Prompt copié !");
                                    }}
                                >
                                    <Copy className="w-4 h-4 mr-2" /> Copier le Prompt
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* EDITORIAL RULES */}
                    <div className="text-xs text-slate-400 space-y-2 px-2 mt-8">
                        <p className="font-bold uppercase tracking-wider text-slate-500">Charte Éditoriale</p>
                        <p>Contenu informatif uniquement.</p>
                        <p>Interdiction de : promesses commerciales, dénigrement, attaques.</p>
                        <p>Gainable.fr se réserve le droit de dépublier un article ou suspendre un compte en cas d'abus.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
