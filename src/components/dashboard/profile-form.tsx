"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
    Building2,
    CheckCircle2,
    Loader2
} from "lucide-react";
import {
    EXPERT_TECHNOLOGIES,
    EXPERT_INTERVENTIONS_CLIM,
    EXPERT_INTERVENTIONS_ETUDE,
    EXPERT_INTERVENTIONS_DIAG,
    EXPERT_BRANDS,
    EXPERT_BATIMENTS
} from "@/lib/constants";

// Map constants to ID/Label format
const TECH_LIST = EXPERT_TECHNOLOGIES.map(t => ({ id: t, label: t }));
const INTERVENTION_CLIM_LIST = EXPERT_INTERVENTIONS_CLIM.map(t => ({ id: t, label: t }));
const INTERVENTION_ETUDE_LIST = EXPERT_INTERVENTIONS_ETUDE.map(t => ({ id: t, label: t }));
const INTERVENTION_DIAG_LIST = EXPERT_INTERVENTIONS_DIAG.map(t => ({ id: t, label: t }));
const BATIMENT_LIST = EXPERT_BATIMENTS.map(t => ({ id: t, label: t }));
const MARQUE_LIST = EXPERT_BRANDS.map(t => ({ id: t, label: t }));

import dynamicModule from "next/dynamic";
const EditMap = dynamicModule(() => import("./edit-map"), { ssr: false });

export default function ProfileForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form State
    const [expertType, setExpertType] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nom_entreprise: "",
        representant_nom: "",
        representant_prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        ville: "",
        code_postal: "",
        pays: "fr",
        description: "",
        site_web: "",
        linkedin: "",
        facebook: "",
        youtube: "",
        siret: "",
        lat: 0,
        lng: 0,
        intervention_radius: 50
    });

    // Multi-value States
    const [technologies, setTechnologies] = useState<string[]>([]);
    const [interventionsClim, setInterventionsClim] = useState<string[]>([]);
    const [interventionsEtude, setInterventionsEtude] = useState<string[]>([]);
    const [interventionsDiag, setInterventionsDiag] = useState<string[]>([]);
    const [batiments, setBatiments] = useState<string[]>([]);
    const [marques, setMarques] = useState<string[]>([]);

    // FETCH DATA
    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/dashboard/profile');
                if (!res.ok) {
                    const errPayload = await res.json().catch(() => ({}));
                    throw new Error(errPayload.message || "Impossible de charger le profil (Erreur Serveur)");
                }
                const data = await res.json();

                if (!data) throw new Error("Données vides reçues");

                setExpertType(data.expert_type);

                setFormData({
                    nom_entreprise: data.nom_entreprise || "",
                    representant_nom: data.representant_nom || "",
                    representant_prenom: data.representant_prenom || "",
                    email: data.user?.email || "", // Email usually comes from User relation or is readonly
                    telephone: data.telephone || "",
                    adresse: data.adresse || "",
                    ville: data.ville || "",
                    code_postal: data.code_postal || "",
                    pays: data.pays || "France",
                    description: data.description || "",
                    site_web: data.site_web || "",
                    linkedin: data.linkedin || "",
                    facebook: data.facebook || "",
                    youtube: data.youtube || "",
                    siret: data.siret || "",
                    lat: data.lat || 0,
                    lng: data.lng || 0,
                    intervention_radius: data.intervention_radius || 50
                });

                // Populate Checkboxes (API returns objects {value: "foo"}, we need strings ["foo"])
                if (data.technologies) setTechnologies(data.technologies.map((t: any) => t.value));
                if (data.interventions_clim) setInterventionsClim(data.interventions_clim.map((t: any) => t.value));
                if (data.interventions_etude) setInterventionsEtude(data.interventions_etude.map((t: any) => t.value));
                if (data.interventions_diag) setInterventionsDiag(data.interventions_diag.map((t: any) => t.value));
                if (data.batiments) setBatiments(data.batiments.map((t: any) => t.value));
                if (data.marques) setMarques(data.marques.map((t: any) => t.value));
            } catch (error: any) {
                console.error(error);
                setMessage({ type: 'error', text: error.message || "Impossible de charger le profil." });
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const payload = {
                ...formData,
                technologies,
                interventions_clim: interventionsClim,
                interventions_etude: interventionsEtude,
                interventions_diag: interventionsDiag,
                batiments,
                marques
            };

            const res = await fetch('/api/dashboard/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Update failed");
            setMessage({ type: 'success', text: "Profil mis à jour avec succès !" });

            // Scroll to top to see message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: "Erreur lors de la sauvegarde." });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;

    return (
        <div className="space-y-8">
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#1F2D3D]">Informations Générales</h2>
                <Button onClick={handleSave} disabled={isSaving} className="bg-[#D59B2B] hover:bg-[#b88622] text-white">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Enregistrer les modifications
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nom de l'entreprise</Label>
                            <Input name="nom_entreprise" value={formData.nom_entreprise} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>SIRET</Label>
                            <Input disabled value={formData.siret} className="bg-slate-50" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nom Représentant</Label>
                            <Input name="representant_nom" value={formData.representant_nom} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Prénom Représentant</Label>
                            <Input name="representant_prenom" value={formData.representant_prenom} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email (Non modifiable)</Label>
                            <Input disabled value={formData.email} className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="06 12 34 56 78" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6 space-y-4">
                    <h3 className="font-semibold text-lg text-[#1F2D3D]">Coordonnées & Présentation</h3>
                    <div className="space-y-2">
                        <Label>Adresse</Label>
                        <Input name="adresse" value={formData.adresse} onChange={handleChange} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Code Postal</Label>
                            <Input name="code_postal" value={formData.code_postal} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label>Ville</Label>
                            <Input name="ville" value={formData.ville} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea name="description" value={formData.description} onChange={handleChange} className="h-32" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Site Web</Label>
                            <Input name="site_web" value={formData.site_web} onChange={handleChange} placeholder="https://www.exemple.com" />
                        </div>
                        <div className="space-y-2">
                            <Label>LinkedIn</Label>
                            <Input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="URL Profil LinkedIn" />
                        </div>
                        <div className="space-y-2">
                            <Label>Facebook</Label>
                            <Input name="facebook" value={formData.facebook} onChange={handleChange} placeholder="URL Page Facebook" />
                        </div>
                        <div className="space-y-2">
                            <Label>YouTube</Label>
                            <Input name="youtube" value={formData.youtube} onChange={handleChange} placeholder="URL Chaîne YouTube" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* GEO LOCALISATION & RAYON */}
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Localisation & Zone d'Intervention</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg">
                            <div>
                                <Label className="block mb-1 font-bold text-base">Rayon d'intervention</Label>
                                <p className="text-sm text-slate-500">Jusqu'à quelle distance intervenez-vous ?</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-2xl text-[#D59B2B]">{formData.intervention_radius} km</span>
                            </div>
                        </div>
                        <div className="px-2">
                            <input
                                type="range"
                                min="10"
                                max="200"
                                step="10"
                                value={formData.intervention_radius}
                                onChange={(e) => setFormData(prev => ({ ...prev, intervention_radius: parseInt(e.target.value) }))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D59B2B]"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>10 km</span>
                                <span>200 km</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full rounded-xl border border-slate-200 overflow-hidden relative z-0">
                        {formData.ville ? (
                            <EditMap
                                address={formData.adresse}
                                city={formData.ville}
                                initialLat={formData.lat}
                                initialLng={formData.lng}
                                radius={formData.intervention_radius}
                                onLocationChange={(lat, lng) => setFormData(prev => ({ ...prev, lat, lng }))}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                Renseignez votre ville pour afficher la carte
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* DYNAMIC FIELDS based on expertType */}

            {/* COMMON: BATIMENTS */}
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Types de bâtiments</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {BATIMENT_LIST.map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`bat-${item.id}`}
                                    checked={batiments.includes(item.id)}
                                    onCheckedChange={() => toggleSelection(batiments, setBatiments, item.id)}
                                />
                                <label htmlFor={`bat-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* CVC SPECIFIC */}
            {(expertType === 'societe' || expertType === 'cvc_climatisation' || expertType === 'Société') && (
                <>
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Technologies</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {TECH_LIST.map(item => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`tech-${item.id}`}
                                            checked={technologies.includes(item.id)}
                                            onCheckedChange={() => toggleSelection(technologies, setTechnologies, item.id)}
                                        />
                                        <label htmlFor={`tech-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Interventions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {INTERVENTION_CLIM_LIST.map(item => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`int-${item.id}`}
                                            checked={interventionsClim.includes(item.id)}
                                            onCheckedChange={() => toggleSelection(interventionsClim, setInterventionsClim, item.id)}
                                        />
                                        <label htmlFor={`int-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Marques</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {MARQUE_LIST.map(item => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`brand-${item.id}`}
                                            checked={marques.includes(item.id)}
                                            onCheckedChange={() => toggleSelection(marques, setMarques, item.id)}
                                        />
                                        <label htmlFor={`brand-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* BUREAU ETUDE SPECIFIC */}
            {(expertType === 'bureau_etude' || expertType === "Bureau d'étude") && (
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Compétences Étude</h3>
                        <div className="grid gap-3">
                            {INTERVENTION_ETUDE_LIST.map(item => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`etude-${item.id}`}
                                        checked={interventionsEtude.includes(item.id)}
                                        onCheckedChange={() => toggleSelection(interventionsEtude, setInterventionsEtude, item.id)}
                                    />
                                    <label htmlFor={`etude-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* DIAGNOSTIQUEUR SPECIFIC */}
            {(expertType === 'diagnostiqueur' || expertType === 'Diagnostiqueur' || expertType === 'diagnostics_dpe') && (
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Diagnostics Réalisés</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {INTERVENTION_DIAG_LIST.map(item => (
                                <div key={item.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`diag-${item.id}`}
                                        checked={interventionsDiag.includes(item.id)}
                                        onCheckedChange={() => toggleSelection(interventionsDiag, setInterventionsDiag, item.id)}
                                    />
                                    <label htmlFor={`diag-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="flex justify-end pt-6">
                <Button onClick={handleSave} disabled={isSaving} className="bg-[#D59B2B] hover:bg-[#b88622] text-white size-lg text-lg px-8">
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Enregistrer les modifications
                </Button>
            </div>
        </div>
    );
}
