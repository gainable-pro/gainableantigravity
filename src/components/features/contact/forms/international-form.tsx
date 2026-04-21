"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CvcRequestForm } from "./cvc-form";

interface InternationalLeadFormProps {
    city: string;
    onSuccess?: () => void;
}

export function InternationalLeadForm({ city, onSuccess }: InternationalLeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmitCVC = async (data: any) => {
        setIsSubmitting(true);
        try {
            const address = data.address || "";
            const zipMatch = address.match(/\b\d{4,5}\b/);
            const extractedZip = zipMatch ? zipMatch[0] : "00000";

            const payload = {
                type: 'cvc',
                nom: data.lastName,
                prenom: data.firstName,
                email: data.email,
                telephone: data.phone,
                code_postal: extractedZip,
                ville: address.replace(extractedZip, "").replace(/,/g, "").trim() || city,
                adresse: address,
                message: data.description || "",
                projet: data.propertyType || "Non spécifié",
                surface: data.surface ? String(data.surface) : undefined,
                source: `Landing Page ${city}`,
                details: {
                    technologies: data.technologies,
                    files: data.files
                }
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
    };

    if (isSuccess) {
        return (
            <div className="text-center py-12 space-y-6 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-[#1F2D3D]">Merci pour votre demande !</h3>
                    <p className="text-slate-600 mt-2">
                        Votre dossier pour {city} a bien été transmis à nos experts locaux.
                        <br />Ils vous contacteront prochainement par téléphone ou email pour votre devis.
                    </p>
                </div>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-4">
                    Nouvelle demande
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-100">
            <div className="mb-8 text-center border-b pb-6 border-slate-100">
                <h3 className="text-2xl font-extrabold text-[#1F2D3D] flex items-center justify-center gap-2 mb-2">
                    Obtenez votre devis à {city}
                </h3>
                <p className="text-slate-500">Renseignez les détails de votre projet pour être contacté par nos artisans qualifiés.</p>
            </div>
            
            <CvcRequestForm 
                onSubmit={handleSubmitCVC} 
                isSubmitting={isSubmitting} 
                defaultCity={city} 
            />
        </div>
    );
}
