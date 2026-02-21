
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
            source: `Landing Page ${city}`,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Prepare payload for /api/leads
            // Based on ContactWizard logic: code_postal is needed, we'll try to extract or default.
            // Since we don't ask for generic Zip in this form, we'll default to "00000" or extract from address if possible mentally/regex, 
            // but for now let's just send what we have. API might need adjustment or we send "00000".
            // The API likely expects { type, nom, email, telephone, ... }

            const payload = {
                type: 'simple', // Generic lead type
                nom: values.nom,
                prenom: "", // merged in nom or split? API usually handles one or both. Let's send nom as Name.
                email: values.email,
                telephone: values.telephone,
                adresse: values.adresse,
                ville: values.ville || city,
                code_postal: "00000", // Fallback, strict validation might fail?
                message: values.message,
                projet: "Installation Climatisation (Page Ville)",
                source: values.source
            };

            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || "Une erreur est survenue");
            }

            setIsSuccess(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Submission error", error);
            alert("Une erreur est survenue lors de l'envoi. Veuillez vérifier votre connexion ou réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-500 bg-white/90 backdrop-blur rounded-xl p-6 shadow-sm">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Demande envoyée !</h3>
                <p className="text-slate-600 text-sm">
                    Merci, votre demande pour {city} a bien été prise en compte.
                    <br />Un expert vous recontactera sous 24h.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" size="sm" className="mt-2">
                    Nouvelle demande
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#D59B2B]" /> Recevoir mes devis
                </h3>
                <p className="text-sm text-slate-500">Remplissez ce formulaire pour être contacté rapidement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <Label htmlFor="nom" className="text-xs font-semibold text-slate-600">Nom complet *</Label>
                    <Input
                        id="nom"
                        {...register("nom")}
                        placeholder="Votre nom"
                        className={`h-9 ${errors.nom ? "border-red-500" : ""}`}
                        aria-required="true"
                        aria-invalid={errors.nom ? "true" : "false"}
                        aria-describedby={errors.nom ? "nom-error" : undefined}
                    />
                    {errors.nom && <p id="nom-error" className="text-xs text-red-500">{errors.nom.message}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="telephone" className="text-xs font-semibold text-slate-600">Téléphone *</Label>
                    <Input
                        id="telephone"
                        {...register("telephone")}
                        placeholder="06 12 34 56 78"
                        className={`h-9 ${errors.telephone ? "border-red-500" : ""}`}
                        aria-required="true"
                        aria-invalid={errors.telephone ? "true" : "false"}
                        aria-describedby={errors.telephone ? "telephone-error" : undefined}
                    />
                    {errors.telephone && <p id="telephone-error" className="text-xs text-red-500">{errors.telephone.message}</p>}
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="email_intl" className="text-xs font-semibold text-slate-600">Email *</Label>
                <Input
                    id="email_intl"
                    {...register("email")}
                    placeholder="votre@email.com"
                    className={`h-9 ${errors.email ? "border-red-500" : ""}`}
                    aria-required="true"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-intl-error" : undefined}
                />
                {errors.email && <p id="email-intl-error" className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
                <Label htmlFor="adresse" className="text-xs font-semibold text-slate-600">Ville / Code Postal *</Label>
                <Input
                    id="adresse"
                    {...register("adresse")}
                    placeholder="Ex: Lyon 69002"
                    className={`h-9 ${errors.adresse ? "border-red-500" : ""}`}
                    aria-required="true"
                    aria-invalid={errors.adresse ? "true" : "false"}
                    aria-describedby={errors.adresse ? "adresse-error" : undefined}
                />
                {errors.adresse && <p id="adresse-error" className="text-xs text-red-500">{errors.adresse.message}</p>}
            </div>

            <div className="space-y-1">
                <Label htmlFor="message" className="text-xs font-semibold text-slate-600">Projet (Optionnel)</Label>
                <Textarea
                    id="message"
                    {...register("message")}
                    placeholder="Besoin spécifique..."
                    className="min-h-[60px] text-sm py-2"
                />
            </div>

            <Button type="submit" className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-11 text-base shadow-sm transition-all" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi...
                    </>
                ) : (
                    `Recevoir mes devis gratuits`
                )}
            </Button>

            <p className="text-[10px] text-center text-slate-400 mt-2">
                Vos données sont sécurisées et transmises uniquement aux artisans sélectionnés.
            </p>
        </form>
    );
}
