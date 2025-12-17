
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    User,
    Phone,
    Mail,
    FileText,
    MapPin,
    Home,
    ClipboardList,
    Check
} from "lucide-react";
import { EXPERT_BATIMENTS, EXPERT_INTERVENTIONS_DIAG } from "@/lib/constants";
import { useState } from "react";

// Schema Validation
const diagFormSchema = z.object({
    // Coordonnées
    lastName: z.string().min(2, "Le nom est requis"),
    firstName: z.string().min(2, "Le prénom est requis"),
    phone: z.string().min(10, "Numéro de téléphone valide requis (10 chiffres)"),
    email: z.string().email("Email invalide"),
    address: z.string().optional(),

    // Données techniques
    propertyType: z.string().min(1, "Type de bien requis"),
    diagnosticTypes: z.array(z.string()).min(1, "Au moins un diagnostic requis"),

    // Détails
    description: z.string().min(10, "Veuillez décrire brièvement votre besoin."),
});

type DiagFormValues = z.infer<typeof diagFormSchema>;

interface DiagRequestFormProps {
    onSubmit: (data: DiagFormValues) => void;
    isSubmitting?: boolean;
}

export const DiagRequestForm = ({ onSubmit, isSubmitting = false }: DiagRequestFormProps) => {
    const [selectedDiags, setSelectedDiags] = useState<string[]>([]);

    const form = useForm<DiagFormValues>({
        resolver: zodResolver(diagFormSchema),
        defaultValues: {
            description: "",
            diagnosticTypes: []
        }
    });

    const { register, handleSubmit, setValue, formState: { errors } } = form;

    const handleDiagToggle = (diag: string) => {
        const current = selectedDiags;
        const updated = current.includes(diag)
            ? current.filter(d => d !== diag)
            : [...current, diag];

        setSelectedDiags(updated);
        setValue("diagnosticTypes", updated, { shouldValidate: true });
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

                <div className="space-y-2">
                    <Label>Ville / Code Postal concernée (Optionnel)</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input {...register("address")} placeholder="Ex: Lyon, 69002" />
                    </div>
                </div>
            </section>

            {/* 2. Données Techniques */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2 border-b pb-2">
                    <Home className="w-5 h-5 text-[#D59B2B]" /> Le Bien Immobilier
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label>Type d'habitation *</Label>
                        <Select onValueChange={(val) => setValue("propertyType", val, { shouldValidate: true })}>
                            <SelectTrigger className={errors.propertyType ? "border-red-500" : ""}>
                                <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {EXPERT_BATIMENTS.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.propertyType && <p className="text-xs text-red-500">{errors.propertyType.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="mb-2 block">Diagnostics souhaités *</Label>
                    <div className="flex flex-wrap gap-2">
                        {EXPERT_INTERVENTIONS_DIAG.map((diag) => {
                            const isSelected = selectedDiags.includes(diag);
                            return (
                                <div
                                    key={diag}
                                    onClick={() => handleDiagToggle(diag)}
                                    className={`
                                         cursor-pointer px-3 py-2 rounded-md border text-sm flex items-center gap-2 transition-all select-none
                                         ${isSelected ? "bg-[#FFF8ED] border-[#D59B2B] text-[#D59B2B] font-bold" : "bg-white border-slate-200 text-slate-600 hover:border-[#D59B2B]"}
                                     `}
                                >
                                    {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-sm border border-slate-300" />}
                                    {diag}
                                </div>
                            )
                        })}
                    </div>
                    {errors.diagnosticTypes && <p className="text-xs text-red-500">{errors.diagnosticTypes.message}</p>}
                </div>
            </section>

            {/* 3. Détails */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2 border-b pb-2">
                    <FileText className="w-5 h-5 text-[#D59B2B]" /> Votre demande
                </h3>

                <div className="space-y-2">
                    <Label>Message *</Label>
                    <Textarea
                        {...register("description")}
                        placeholder="Bonjour, je souhaiterais réaliser les diagnostics pour la vente de ma maison..."
                        className="h-24 resize-none"
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
            </section>

            {/* Actions */}
            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-14 text-lg shadow-md"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Envoi en cours..." : "📨 Envoyer ma demande"}
                </Button>
            </div>

        </form>
    );
};
