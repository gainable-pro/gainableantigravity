
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, MapPin, Phone, Mail, User } from "lucide-react";

const formSchema = z.object({
    nom: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    telephone: z.string().min(10, "Numéro de téléphone invalide"),
    adresse: z.string().min(5, "L'adresse est requise"),
    message: z.string().optional(),
    ville: z.string().optional(),
    source: z.string().optional(),
});

interface InternationalLeadFormProps {
    city: string;
    onSuccess?: () => void;
}

export function InternationalLeadForm({ city, onSuccess }: InternationalLeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nom: "",
            email: "",
            telephone: "",
            adresse: "",
            message: "",
            ville: city,
            source: `Landing Page ${city} (International)`,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Simulate API call - In production this would hit an API route
            // For now, we simulate success to unblock the UI flow
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Form submitted:", values);

            // Verification logic: Call actual API if available
            /*
            const response = await fetch("/api/contact/international", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Erreur");
            */

            setIsSuccess(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submission error", error);
            alert("Une erreur est survenue, veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Demande reçue !</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                    Merci, nous avons bien reçu votre demande pour {city}. Un de nos experts locaux vous recontactera sous 24h.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                    Envoyer une autre demande
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nom complet</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input {...register("nom")} placeholder="Votre nom" className={`pl-10 ${errors.nom ? "border-red-500" : ""}`} />
                    </div>
                    {errors.nom && <p className="text-xs text-red-500">{errors.nom.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input {...register("telephone")} placeholder="06 12 34 56 78" className={`pl-10 ${errors.telephone ? "border-red-500" : ""}`} />
                    </div>
                    {errors.telephone && <p className="text-xs text-red-500">{errors.telephone.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input {...register("email")} placeholder="votre@email.com" className={`pl-10 ${errors.email ? "border-red-500" : ""}`} />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Adresse du chantier</Label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input {...register("adresse")} placeholder="Adresse, Quartier..." className={`pl-10 ${errors.adresse ? "border-red-500" : ""}`} />
                </div>
                {errors.adresse && <p className="text-xs text-red-500">{errors.adresse.message}</p>}
            </div>

            <div className="space-y-2">
                <Label>Message (Optionnel)</Label>
                <Textarea {...register("message")} placeholder="Précisez votre besoin (surface, type de bien...)" className="min-h-[100px]" />
            </div>

            <Button type="submit" className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...
                    </>
                ) : (
                    `Recevoir mes devis pour ${city}`
                )}
            </Button>
        </form>
    );
}
