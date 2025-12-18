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
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        async function fetchMedia() {
            try {
                const res = await fetch('/api/dashboard/media');
                if (res.ok) {
                    const data = await res.json();
                    setLogoUrl(data.logo_url || "");
                    setVideoUrl(data.video_url || "");
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

        // For gallery (photo), we allow multiple, but let's upload one by one for simplicity or first one if simple input
        const file = files[0];

        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();

            if (type === 'logo') setLogoUrl(data.url);
            if (type === 'video') setVideoUrl(data.url);
            if (type === 'photo') {
                setPhotos(prev => [...prev, data.url]);
            }

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: "Erreur lors de l'upload." });
        } finally {
            setIsLoading(false);
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

                        <div className="space-y-2">
                            <Label>Importer une vidéo</Label>
                            <Input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleFileUpload(e, 'video')}
                            />
                            <p className="text-xs text-slate-400">MP4, WEBM (Fichier local).</p>
                        </div>

                        {videoUrl ? (
                            <div className="mt-4 bg-black rounded-lg overflow-hidden relative">
                                <video
                                    src={videoUrl}
                                    controls
                                    className="w-full h-auto"
                                    style={{ maxHeight: '200px' }}
                                />
                            </div>
                        ) : (
                            <div className="mt-4 h-[200px] border-2 border-dashed rounded-lg flex items-center justify-center text-slate-300">
                                Pas de vidéo
                            </div>
                        )}
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
