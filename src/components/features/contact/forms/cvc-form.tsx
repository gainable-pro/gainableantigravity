
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    User,
    ThermometerSnowflake,
    FileText,
    Paperclip,
    Check
} from "lucide-react";
import { EXPERT_BATIMENTS, EXPERT_TECHNOLOGIES } from "@/lib/constants";

// Schema Validation
const cvcFormSchema = z.object({
    // Coordonnées
    lastName: z.string().min(2, "Le nom est requis"),
    firstName: z.string().min(2, "Le prénom est requis"),
    phone: z.string().min(10, "Numéro de téléphone valide requis (10 chiffres)"),
    email: z.string().email("Email invalide"),

    // Bien
    propertyType: z.string().min(1, "Type de bien requis"),
    surface: z.string().min(1, "Surface requise"),
    address: z.string().min(5, "Adresse complète requise"),

    // Projet
    technologies: z.array(z.string()).min(1, "Sélectionnez au moins une technologie"),

    // Détails
    description: z.string().optional(),

    // Files (Mockup for now)
    files: z.any().optional()
});

type CvcFormValues = z.infer<typeof cvcFormSchema>;

interface CvcRequestFormProps {
    onSubmit: (data: CvcFormValues) => void;
    isSubmitting?: boolean;
}

export const CvcRequestForm = ({ onSubmit, isSubmitting = false }: CvcRequestFormProps) => {
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState<{ url: string, name: string }[]>([]);

    const form = useForm<CvcFormValues>({
        resolver: zodResolver(cvcFormSchema),
        defaultValues: {
            technologies: [],
            propertyType: "",
            surface: "",
            description: ""
        }
    });

    const { register, handleSubmit, setValue, formState: { errors } } = form;

    const handleTechToggle = (tech: string) => {
        const current = selectedTechs;
        const updated = current.includes(tech)
            ? current.filter(t => t !== tech)
            : [...current, tech];

        setSelectedTechs(updated);
        setValue("technologies", updated, { shouldValidate: true });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            // Assuming API returns { url: string }
            const newFile = { url: data.url, name: file.name };
            const updatedFiles = [...files, newFile];
            setFiles(updatedFiles);
            setValue("files", updatedFiles); // Update form state
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'upload du fichier.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* 1. Coordonnées */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2 border-b pb-2">
                    <User className="w-5 h-5 text-[#D59B2B]" /> Vos coordonnées
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nom *</Label>
                        <Input {...register("lastName")} placeholder="Votre nom" className={errors.lastName ? "border-red-500" : ""} />
                        {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Prénom *</Label>
                        <Input {...register("firstName")} placeholder="Votre prénom" className={errors.firstName ? "border-red-500" : ""} />
                        {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Téléphone *</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <Input {...register("phone")} placeholder="06 12 34 56 78" className={`pl-10 ${errors.phone ? "border-red-500" : ""}`} />
                        </div>
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                        <p className="text-xs text-slate-500">Obligatoire pour un contact rapide.</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <Input {...register("email")} placeholder="votre@email.com" className={`pl-10 ${errors.email ? "border-red-500" : ""}`} />
                        </div>
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                </div>
            </section>

            {/* 2. Informations sur le bien */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2 border-b pb-2">
                    <Building2 className="w-5 h-5 text-[#D59B2B]" /> Informations sur le bien
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type de bien *</Label>
                        <Select onValueChange={(val) => setValue("propertyType", val, { shouldValidate: true })}>
                            <SelectTrigger className={errors.propertyType ? "border-red-500" : ""}>
                                <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                                {EXPERT_BATIMENTS.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.propertyType && <p className="text-xs text-red-500">{errors.propertyType.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Surface à traiter (m²) *</Label>
                        <Input type="number" {...register("surface")} placeholder="Ex: 120" className={errors.surface ? "border-red-500" : ""} />
                        {errors.surface && <p className="text-xs text-red-500">{errors.surface.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Adresse complète du bien *</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input {...register("address")} placeholder="Adresse, Code Postal, Ville" className={`pl-10 ${errors.address ? "border-red-500" : ""}`} />
                    </div>
                    {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                </div>
            </section>

            {/* 3. Type de projet */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2 border-b pb-2">
                    <ThermometerSnowflake className="w-5 h-5 text-[#D59B2B]" /> Type d'installation
                </h3>

                <div className="space-y-2">
                    <Label className="mb-2 block">Technologies envisagées *</Label>
                    <div className="flex flex-wrap gap-2">
                        {EXPERT_TECHNOLOGIES.map((tech) => {
                            const isSelected = selectedTechs.includes(tech);
                            return (
                                <div
                                    key={tech}
                                    onClick={() => handleTechToggle(tech)}
                                    className={`
                                cursor-pointer px-3 py-2 rounded-md border text-sm flex items-center gap-2 transition-all
                                ${isSelected ? "bg-[#FFF8ED] border-[#D59B2B] text-[#D59B2B] font-bold" : "bg-white border-slate-200 text-slate-600 hover:border-[#D59B2B]"}
                            `}
                                >
                                    {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-sm border border-slate-300" />}
                                    {tech}
                                </div>
                            )
                        })}
                    </div>
                    {errors.technologies && <p className="text-xs text-red-500">{errors.technologies.message}</p>}
                </div>
            </section>

            {/* 4. Détails */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2 border-b pb-2">
                    <FileText className="w-5 h-5 text-[#D59B2B]" /> Détails & Fichiers
                </h3>

                <div className="space-y-2">
                    <Label>Décrivez votre projet (Optionnel)</Label>
                    <Textarea
                        {...register("description")}
                        placeholder="Précisez votre besoin, vos contraintes..."
                        className="h-24 resize-none"
                    />
                    <p className="text-xs text-slate-500">Plus votre demande est précise, plus le devis sera adapté.</p>
                </div>

                <div className="space-y-2">
                    <Label>Plans ou photos (Optionnel)</Label>
                    <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
                        {files.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {files.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                                        <Paperclip className="w-4 h-4" />
                                        <span className="truncate max-w-[200px]">{f.name}</span>
                                        <Check className="w-4 h-4 ml-auto" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept="image/*,application/pdf"
                                disabled={uploading}
                            />
                            <label
                                htmlFor="file-upload"
                                className={`
                                    flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                    ${uploading ? "bg-slate-100 border-slate-300" : "border-slate-300 hover:bg-slate-100"}
                                `}
                            >
                                <Paperclip className={`w-8 h-8 mb-2 ${uploading ? "text-slate-300" : "text-slate-400"}`} />
                                <span className="text-sm text-slate-600">
                                    {uploading ? "Chargement en cours..." : "Cliquez pour ajouter des fichiers"}
                                </span>
                                <span className="text-xs text-slate-400 mt-1">(JPG, PNG, PDF)</span>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Actions */}
            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-14 text-lg shadow-md"
                    disabled={isSubmitting || uploading}
                >
                    {isSubmitting || uploading ? "Envoi en cours..." : "📨 Envoyer ma demande de devis"}
                </Button>
                <p className="text-xs text-center text-slate-400 mt-4">
                    En envoyant ce formulaire, vous acceptez que vos informations soient transmises aux sociétés sélectionnées.
                </p>
            </div>

        </form>
    );
};
