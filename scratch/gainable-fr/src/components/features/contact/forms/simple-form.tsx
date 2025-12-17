
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    User,
    Phone,
    Mail,
    FileText,
    MapPin
} from "lucide-react";

// Schema Validation
const simpleFormSchema = z.object({
    // Coordonnées
    lastName: z.string().min(2, "Le nom est requis"),
    firstName: z.string().min(2, "Le prénom est requis"),
    phone: z.string().min(10, "Numéro de téléphone valide requis (10 chiffres)"),
    email: z.string().email("Email invalide"),
    address: z.string().optional(),

    // Détails
    description: z.string().min(10, "Veuillez décrire brièvement votre besoin."),
});

type SimpleFormValues = z.infer<typeof simpleFormSchema>;

interface SimpleRequestFormProps {
    onSubmit: (data: SimpleFormValues) => void;
    isSubmitting?: boolean;
}

export const SimpleRequestForm = ({ onSubmit, isSubmitting = false }: SimpleRequestFormProps) => {
    const form = useForm<SimpleFormValues>({
        resolver: zodResolver(simpleFormSchema),
        defaultValues: {
            description: ""
        }
    });

    const { register, handleSubmit, formState: { errors } } = form;

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
                    <Label>Ville / Code Postal (Optionnel)</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <Input {...register("address")} placeholder="Ex: Lyon, 69002" />
                    </div>
                </div>
            </section>

            {/* 2. Détails */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-[#1F2D3D] flex items-center gap-2 border-b pb-2">
                    <FileText className="w-5 h-5 text-[#D59B2B]" /> Votre demande
                </h3>

                <div className="space-y-2">
                    <Label>Message *</Label>
                    <Textarea
                        {...register("description")}
                        placeholder="Bonjour, je souhaiterais un devis pour..."
                        className="h-32 resize-none"
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
