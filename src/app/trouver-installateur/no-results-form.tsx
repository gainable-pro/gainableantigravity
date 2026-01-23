"use client";

import { useState } from "react";
import { SimpleRequestForm } from "@/components/features/contact/forms/simple-form";
import { CheckCircle } from "lucide-react";

interface NoResultsFormProps {
    location?: string;
}

export function NoResultsForm({ location = "" }: NoResultsFormProps) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsSubmitting(true);
        // Address parsing logic reused or simplified
        const address = data.address || "";
        const zipMatch = address.match(/\b\d{4,5}\b/) || location.match(/\b\d{4,5}\b/);
        const extractedZip = zipMatch ? zipMatch[0] : "00000";

        const payload = {
            type: 'simple', // Generic type
            nom: data.lastName,
            prenom: data.firstName,
            email: data.email,
            telephone: data.phone,
            code_postal: extractedZip,
            ville: data.ville || location || "Inconnue",
            adresse: address,
            message: data.description,
            // Custom message indicating origin
            details: {
                ...data,
                origin: "no-results-search",
                search_location: location
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
                // Redirect to confirmation is standard
                window.location.href = `/confirmation-devis?source=auto_fallback`;
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
                    Aucun expert trouvé pour cette recherche ?
                </h3>
                <p className="text-slate-600 max-w-2xl mx-auto mb-4">
                    Ne vous inquiétez pas ! <br />
                    <span className="font-bold text-[#D59B2B]">L'équipe Gainable.fr fera en sorte de contacter sous 24h des experts sur cette région</span> (les plus proches de votre bien) pour qu'on puisse vous proposer d'autres artisans qualifiés.
                </p>
                <p className="text-sm text-slate-500 italic">
                    Remplissez ce formulaire pour être recontacté rapidement.
                </p>
            </div>

            <div className="max-w-xl mx-auto bg-slate-50 p-6 rounded-xl border border-slate-200">
                <SimpleRequestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
