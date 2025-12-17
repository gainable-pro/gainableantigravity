
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CvcRequestForm } from "./forms/cvc-form";
import { SimpleRequestForm } from "./forms/simple-form";
import { DiagRequestForm } from "./forms/diag-form";
import { X, CheckCircle } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

interface ExpertSummary {
    id: string;
    nom_entreprise: string;
    expert_type: string;
    ville: string;
}

interface ContactWizardProps {
    preSelectedExperts?: ExpertSummary[];
    triggerButton?: React.ReactNode;
}

type WizardStep = "select-type" | "form" | "success";

export const ContactWizard = ({ preSelectedExperts = [], triggerButton }: ContactWizardProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Determine initial experts
    const initialExperts = preSelectedExperts;

    // Determine initial step: if we have experts, go to form. If not (future feature), select type.
    const [step, setStep] = useState<WizardStep>(initialExperts.length > 0 ? "form" : "select-type");
    const [selectedExperts, setSelectedExperts] = useState<ExpertSummary[]>(initialExperts);

    // Sync state if props change (e.g. adding more experts in parent)
    useEffect(() => {
        if (preSelectedExperts.length > 0) {
            setSelectedExperts(preSelectedExperts);
            setStep("form");
        }
    }, [preSelectedExperts]);

    // Lock type to the first expert's type if available, otherwise default to CVC for now
    // TODO: Handle mixed types if necessary, though UI should prevent it
    const expertType = selectedExperts.length > 0 ? selectedExperts[0].expert_type : "cvc_climatisation";

    const handleSubmitCVC = async (data: any) => {
        // Prepare Payload
        const payload = {
            type: expertType === 'cvc_climatisation' ? 'cvc' : (expertType === 'diagnostics_dpe' ? 'diag' : 'simple'),
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            telephone: data.telephone,
            code_postal: data.code_postal,
            ville: data.ville || "",
            adresse: data.adresse || "",
            details: data, // Send full data as details for now, simpler
            expertIds: selectedExperts.map(e => e.id)
        };

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Error submitting lead:", err);
                alert("Une erreur est survenue. Veuillez réessayer.");
                return;
            }

            setStep("success");
            // Clear or handle success logic (e.g. notify parent?)
        } catch (e) {
            console.error("Network error:", e);
            alert("Erreur de connexion. Veuillez vérifier votre connexion internet.");
        }
    };

    const handleRemoveExpert = (id: string) => {
        // Prevent removing the last expert if it's the main context one? 
        // Or allow it but then what? For now, allow removing if list > 1
        if (selectedExperts.length > 1) {
            setSelectedExperts(prev => prev.filter(e => e.id !== id));
        }
    };

    const resetWizard = () => {
        setIsOpen(false);
        // Reset state after transition
        setTimeout(() => {
            setStep(preSelectedExperts.length > 0 ? "form" : "select-type");
        }, 300);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {triggerButton || (
                    <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-12 px-8 shadow-md">
                        Demander un devis
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:p-0 bg-slate-50">

                {/* HEADER WIZARD */}
                <div className="bg-[#1F2D3D] text-white p-6 sticky top-0 z-50 shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-xl font-bold">
                                {step === 'success' ? "Demande envoyée !" :
                                    expertType === 'cvc_climatisation' ? "Demande de devis – Climatisation & Chauffage" :
                                        "Contacter un professionnel"}
                            </DialogTitle>
                            {step !== 'success' && (
                                <p className="text-slate-300 text-sm mt-1">
                                    {selectedExperts.length > 0
                                        ? `Votre demande sera envoyée à ${selectedExperts.length} professionnel(s)`
                                        : "Sélectionnez un professionnel"}
                                </p>
                            )}
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* RECIPIENTS LIST (Only in Form Step) */}
                    {step === 'form' && selectedExperts.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedExperts.map(expert => (
                                <div key={expert.id} className="bg-white/10 text-white text-xs px-2 py-1 rounded flex items-center gap-2">
                                    <span>{expert.nom_entreprise}</span>
                                    {/* Only show remove if we have more than 1, or allow clearing all? */}
                                    {selectedExperts.length > 1 && (
                                        <button onClick={() => handleRemoveExpert(expert.id)} className="hover:text-red-300">
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {/* Placeholder for "Add more" feature later */}
                            {selectedExperts.length < 5 && (
                                <div className="text-xs text-slate-400 italic flex items-center px-2">
                                    (Max 5 destinataires)
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <div className="p-6 md:p-8">

                    {step === 'select-type' && (
                        <div className="text-center py-12">
                            <p>Sélecteur de type à venir...</p>
                        </div>
                    )}

                    {step === 'form' && expertType === 'cvc_climatisation' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <CvcRequestForm onSubmit={handleSubmitCVC} isSubmitting={false} />
                        </div>
                    )}

                    {step === 'form' && expertType === 'diagnostics_dpe' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <DiagRequestForm onSubmit={handleSubmitCVC} isSubmitting={false} />
                        </div>
                    )}

                    {step === 'form' && expertType !== 'cvc_climatisation' && expertType !== 'diagnostics_dpe' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <SimpleRequestForm onSubmit={handleSubmitCVC} isSubmitting={false} />
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-12 space-y-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#1F2D3D]">Merci pour votre demande !</h3>
                                <p className="text-slate-600 mt-2">
                                    Votre dossier a bien été transmis aux professionnels sélectionnés.
                                    <br />Ils vous contacteront prochainement par téléphone ou email.
                                </p>
                            </div>

                            {/* Safety Tips */}
                            <div className="bg-blue-50 text-blue-800 text-left p-6 rounded-xl text-sm space-y-2 mt-8 max-w-lg mx-auto">
                                <p className="font-bold flex items-center gap-2">
                                    🛡️ Conseils avant de vous engager :
                                </p>
                                <ul className="list-disc pl-5 space-y-1 opacity-90">
                                    <li>Vérifiez l'assurance décennale et les certifications.</li>
                                    <li>Comparez plusieurs propositions si possible.</li>
                                    <li>Consultez les avis Google récents de l'entreprise.</li>
                                </ul>
                            </div>

                            <Button onClick={resetWizard} className="bg-slate-900 text-white font-bold px-8 mt-4">
                                Fermer
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
