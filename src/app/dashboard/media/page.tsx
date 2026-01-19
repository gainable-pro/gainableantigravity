"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Video, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function MediaPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [logoUrl, setLogoUrl] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);

    // Helper to extract ID
    function getYoutubeId(url: string) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    useEffect(() => {
        async function fetchMedia() {
            try {
                const res = await fetch('/api/dashboard/media');
                if (res.ok) {
                    const data = await res.json();
                    setLogoUrl(data.logo_url || "");
                    setVideoUrl(data.video_url || "");
                    setYoutubeUrl(data.video_youtube || "");
                    setPhotos(data.photos || []);
                }
            } catch (error) {
                console.error(error);
                setMessage({ type: 'error', text: "Erreur de chargement des données." });
            } finally {
                setIsLoading(false);
            }
        }
        fetchMedia();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'video' | 'photo') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsLoading(true);
        setMessage(null);

        // Import supabase client dynamically or use the one from lib (but lib one is generic)
        // We'll use the one from lib since it uses public keys
        const { supabase } = await import("@/lib/supabase");

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${sanitizedName}`;
                const filePath = `uploads/${filename}`;

                const { data, error } = await supabase.storage
                    .from('gainable-assets')
                    .upload(filePath, file, { upsert: false });

                if (error) throw error;

                const { data: publicUrlData } = supabase.storage
                    .from('gainable-assets')
                    .getPublicUrl(filePath);

                return publicUrlData.publicUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            if (type === 'logo') setLogoUrl(uploadedUrls[0]);
            if (type === 'video') setVideoUrl(uploadedUrls[0]);
            if (type === 'photo') {
                setPhotos(prev => [...prev, ...uploadedUrls]);
            }

        } catch (error: any) {
            console.error(error);
            setMessage({ type: 'error', text: `Erreur lors de l'upload: ${error.message || "Erreur inconnue"}` });
        } finally {
            setIsLoading(false);
            // Reset input value to allow re-uploading same file if needed
            e.target.value = '';
        }
    };

    const removePhoto = (indexToRemove: number) => {
        setPhotos(photos.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/dashboard/media', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    logo_url: logoUrl,
                    video_url: videoUrl,
                    video_youtube: youtubeUrl,
                    photos: photos
                })
            });

            if (!res.ok) throw new Error("Failed");
            setMessage({ type: 'success', text: "Vos médias ont été sauvegardés !" });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: "Erreur lors de la sauvegarde." });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-12 text-center"><Loader2 className="animate-spin w-8 h-8 mx-auto text-slate-400" /></div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#1F2D3D]">Mes Médias</h2>
                    <p className="text-slate-500">Gérez vos fichiers (Logo, Vidéo, Galerie) visibles sur votre profil.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="bg-[#D59B2B] hover:bg-[#b88622] text-white px-6">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    {isSaving ? "Sauvegarde..." : "Enregistrer tout"}
                </Button>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : null}
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">

                {/* LOGO SECTION */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-[#D59B2B]" /> Logo de l'entreprise
                        </h3>

                        <div className="space-y-2">
                            <Label>Importer mon logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'logo')}
                            />
                            <p className="text-xs text-slate-400">JPG, PNG, WEBP.</p>
                        </div>

                        {logoUrl ? (
                            <div className="mt-4 p-4 border rounded-lg bg-slate-50 flex flex-col items-center relative group">
                                <img src={logoUrl} alt="Logo" className="max-h-32 object-contain mb-2" />
                            </div>
                        ) : (
                            <div className="mt-4 h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-slate-300">
                                Pas de logo
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* VIDEO SECTION */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Video className="w-5 h-5 text-[#D59B2B]" /> Vidéo de présentation
                        </h3>

                        <div className="space-y-4">
                            {/* Option 1: File Upload */}
                            <div className="space-y-2">
                                <Label>Importer une vidéo (MP4)</Label>
                                <Input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => handleFileUpload(e, 'video')}
                                />
                                <p className="text-xs text-slate-400">Fichier local (MP4, WEBM).</p>
                            </div>

                            <div className="text-center text-sm text-slate-400">- OU -</div>

                            {/* Option 2: YouTube URL */}
                            <div className="space-y-2">
                                <Label>Lien YouTube</Label>
                                <Input
                                    type="text"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                />
                                <p className="text-xs text-slate-400">Copiez le lien de votre vidéo YouTube.</p>
                            </div>
                        </div>

                        {/* Preview Section */}
                        {(videoUrl || youtubeUrl) ? (
                            <div className="mt-4 bg-black rounded-lg overflow-hidden relative group">
                                {videoUrl ? (
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="w-full h-auto"
                                        style={{ maxHeight: '200px' }}
                                    />
                                ) : getYoutubeId(youtubeUrl) ? (
                                    <iframe
                                        width="100%"
                                        height="200"
                                        src={`https://www.youtube.com/embed/${getYoutubeId(youtubeUrl)}`}
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="h-[200px] flex items-center justify-center text-white">Lien YouTube invalide</div>
                                )}

                                <button
                                    onClick={() => { setVideoUrl(""); setYoutubeUrl(""); }}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-sm"
                                    title="Supprimer la vidéo"
                                    type="button"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4 h-[200px] border-2 border-dashed rounded-lg flex items-center justify-center text-slate-300">
                                Pas de vidéo
                            </div>
                        )}

                        {/* DISTIA PROMO BLOCK */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col md:flex-row items-center gap-4">
                                <div className="bg-black p-2 rounded-lg flex-shrink-0">
                                    <img src="/distia-logo.png" alt="DISTIA" className="w-16 h-auto" />
                                </div>
                                <div className="flex-1 text-center md:text-left space-y-1">
                                    <h4 className="font-bold text-[#1F2D3D]">Besoin d'une vidéo professionnelle ?</h4>
                                    <p className="text-sm text-slate-600">
                                        Faites appel à notre partenaire <strong>DISTIA</strong>, expert en communication visuelle & storytelling.
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-xs font-medium text-slate-500">
                                        <span>📞 06 74 07 25 00</span>
                                        <span className="hidden md:inline">•</span>
                                        <a href="mailto:mathias.delcistia@distia.fr" className="hover:text-[#D59B2B] transition-colors">mathias.delcistia@distia.fr</a>
                                    </div>
                                </div>
                                <a
                                    href="https://distia.fr/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="whitespace-nowrap bg-[#1F2D3D] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Voir leur site
                                </a>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* --- GALLERY SECTION --- */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-[#D59B2B]" /> Galerie Photos
                        </h3>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="gallery-upload" className="cursor-pointer bg-slate-100 peer-hover:bg-slate-200 px-3 py-2 rounded text-sm font-medium hover:bg-slate-200 transition-colors">
                                + Ajouter une photo
                            </Label>
                            <Input
                                id="gallery-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                multiple
                                onChange={(e) => handleFileUpload(e, 'photo')}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500">Ajoutez des photos de vos réalisations, chantiers, ou équipements pour rassurer vos futurs clients.</p>

                    {photos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                            {photos.map((url, idx) => (
                                <div key={idx} className="relative group aspect-square bg-slate-100 rounded-lg overflow-hidden border">
                                    <img src={url} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removePhoto(idx)}
                                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Supprimer"
                                    >
                                        <div className="w-4 h-4 flex items-center justify-center font-bold">×</div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 border-2 border-dashed rounded-lg text-center text-slate-400">
                            Votre galerie est vide. Ajoutez des photos pour mettre en valeur votre travail.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
