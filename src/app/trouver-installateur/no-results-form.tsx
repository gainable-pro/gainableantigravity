"use client";

import { useState } from "react";
import { SimpleRequestForm } from "@/components/features/contact/forms/simple-form";
import { CvcRequestForm } from "@/components/features/contact/forms/cvc-form";
import { DiagRequestForm } from "@/components/features/contact/forms/diag-form";
import { CheckCircle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface NoResultsFormProps {
    location?: string;
}

type FormType = 'cvc' | 'diag' | 'bureau';

export function NoResultsForm({ location = "" }: NoResultsFormProps) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formType, setFormType] = useState<FormType>('cvc'); // Default to CVC

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        // Address parsing logic
        const address = data.address || "";
        const zipMatch = address.match(/\b\d{4,5}\b/) || location.match(/\b\d{4,5}\b/);
        const extractedZip = zipMatch ? zipMatch[0] : "00000";

        // Enrich payload
        const payload = {
            type: formType,
            nom: data.lastName,
            prenom: data.firstName,
            email: data.email,
            telephone: data.phone,
            code_postal: extractedZip,
            ville: data.ville || location || "Inconnue",
            adresse: address,

            // Map specific fields
            projet: data.propertyType || data.projet || "",
            surface: data.surface ? String(data.surface) : undefined,
            message: data.description,

            details: {
                ...data,
                origin: "no-results-search",
                search_location: location,
                form_type: formType
            }
        };

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsSuccess(true);
                window.location.href = `/confirmation-devis?source=fallback_${formType}`;
            } else {
                const err = await res.json();
                alert(err.error || "Une erreur est survenue.");
            }
        } catch (e) {
            console.error(e);
            alert("Erreur de connexion.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center py-16">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Demande envoyée avec succès</h3>
                <p className="text-slate-600 mt-2">L'équipe Gainable.fr traite votre demande en priorité.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-[#1F2D3D] mb-4">
                    Ne vous inquiétez pas !
                </h3>
                <p className="text-slate-600 max-w-2xl mx-auto mb-4">
                    <span className="font-bold text-[#D59B2B]">L'équipe Gainable.fr sélectionne les meilleurs experts</span> (vérifiés par notre système de modération) et les contacte sous 24h pour vous mettre en relation avec eux.
                </p>
                <p className="text-sm text-slate-500 italic">
                    Remplissez ce formulaire pour être recontacté rapidement.
                </p>
            </div>

            <div className="max-w-xl mx-auto bg-slate-50 p-6 rounded-xl border border-slate-200">
                {/* Form Type Selector */}
                <div className="mb-8">
                    <Label className="block mb-2 font-bold text-[#1F2D3D]">Quel est votre type de demande ?</Label>
                    <Select value={formType} onValueChange={(val) => setFormType(val as FormType)}>
                        <SelectTrigger className="w-full bg-white h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cvc">Climatisation & Chauffage</SelectItem>
                            <SelectItem value="diag">Diagnostics Immobiliers</SelectItem>
                            <SelectItem value="bureau">Bureau d'Étude Thermique</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Dynamic Form Render */}
                {formType === 'cvc' && <CvcRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
                {formType === 'diag' && <DiagRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
                {formType === 'bureau' && <SimpleRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
            </div>
        </div>
    );
}
