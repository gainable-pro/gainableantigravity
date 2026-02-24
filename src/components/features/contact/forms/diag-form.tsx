
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
import Link from "next/link";
import { Controller } from "react-hook-form";

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

    // GDPR
    acceptTerms: z.boolean().refine(v => v === true, {
        message: "Vous devez accepter la politique de confidentialité.",
    }),
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
            diagnosticTypes: [],
            acceptTerms: false,
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
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                            id="lastName"
                            {...register("lastName")}
                            placeholder="Votre nom"
                            className={errors.lastName ? "border-red-500" : ""}
                            aria-required="true"
                            aria-invalid={errors.lastName ? "true" : "false"}
                            aria-describedby={errors.lastName ? "lastName-error" : undefined}
                        />
                        {errors.lastName && <p id="lastName-error" className="text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                            id="firstName"
                            {...register("firstName")}
                            placeholder="Votre prénom"
                            className={errors.firstName ? "border-red-500" : ""}
                            aria-required="true"
                            aria-invalid={errors.firstName ? "true" : "false"}
                            aria-describedby={errors.firstName ? "firstName-error" : undefined}
                        />
                        {errors.firstName && <p id="firstName-error" className="text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone *</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" aria-hidden="true" />
                            <Input
                                id="phone"
                                {...register("phone")}
                                placeholder="06 12 34 56 78"
                                className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                                aria-required="true"
                                aria-invalid={errors.phone ? "true" : "false"}
                                aria-describedby={errors.phone ? "phone-error" : undefined}
                            />
                        </div>
                        {errors.phone && <p id="phone-error" className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" aria-hidden="true" />
                            <Input
                                id="email"
                                {...register("email")}
                                placeholder="votre@email.com"
                                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                                aria-required="true"
                                aria-invalid={errors.email ? "true" : "false"}
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                        </div>
                        {errors.email && <p id="email-error" className="text-xs text-red-500">{errors.email.message}</p>}
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
                        <Label htmlFor="propertyType">Type d'habitation *</Label>
                        <Select onValueChange={(val) => setValue("propertyType", val, { shouldValidate: true })}>
                            <SelectTrigger id="propertyType" className={errors.propertyType ? "border-red-500" : ""} aria-required="true" aria-invalid={errors.propertyType ? "true" : "false"} aria-describedby={errors.propertyType ? "propertyType-error" : undefined}>
                                <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {EXPERT_BATIMENTS.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.propertyType && <p id="propertyType-error" className="text-xs text-red-500">{errors.propertyType.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="mb-2 block">Diagnostics souhaités *</Label>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Diagnostics souhaités">
                        {EXPERT_INTERVENTIONS_DIAG.map((diag) => {
                            const isSelected = selectedDiags.includes(diag);
                            return (
                                <button
                                    key={diag}
                                    type="button"
                                    onClick={() => handleDiagToggle(diag)}
                                    role="checkbox"
                                    aria-checked={isSelected}
                                    className={`
                                         cursor-pointer px-3 py-2 rounded-md border text-sm flex items-center gap-2 transition-all select-none
                                         ${isSelected ? "bg-[#FFF8ED] border-[#D59B2B] text-[#D59B2B] font-bold" : "bg-white border-slate-200 text-slate-600 hover:border-[#D59B2B]"}
                                     `}
                                >
                                    {isSelected ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-sm border border-slate-300" aria-hidden="true" />}
                                    {diag}
                                </button>
                            )
                        })}
                    </div>
                    {errors.diagnosticTypes && <p id="diagnosticTypes-error" className="text-xs text-red-500">{errors.diagnosticTypes.message}</p>}
                </div>
            </section>

            {/* 3. Détails */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2 border-b pb-2">
                    <FileText className="w-5 h-5 text-[#D59B2B]" /> Votre demande
                </h3>

                <div className="space-y-2">
                    <Label htmlFor="description">Message *</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Bonjour, je souhaiterais réaliser les diagnostics pour la vente de ma maison..."
                        className="h-24 resize-none"
                        aria-required="true"
                        aria-invalid={errors.description ? "true" : "false"}
                        aria-describedby={errors.description ? "description-error" : undefined}
                    />
                    {errors.description && <p id="description-error" className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
            </section>

            {/* GDPR Consent */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <Controller
                    name="acceptTerms"
                    control={form.control}
                    render={({ field }) => (
                        <Checkbox
                            id="acceptTerms_diag"
                            checked={field.value || false}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                        />
                    )}
                />
                <div className="space-y-1">
                    <Label
                        htmlFor="acceptTerms_diag"
                        className="text-sm font-medium leading-relaxed text-slate-600 cursor-pointer"
                    >
                        J'accepte que mes données soient traitées pour répondre à ma demande et j'ai lu la{" "}
                        <Link href="/politique-confidentialite" className="text-[#D59B2B] hover:underline font-semibold">
                            politique de confidentialité
                        </Link>.
                    </Label>
                    {errors.acceptTerms && (
                        <p className="text-xs text-red-500 font-medium">
                            {errors.acceptTerms.message}
                        </p>
                    )}
                </div>
            </div>

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
