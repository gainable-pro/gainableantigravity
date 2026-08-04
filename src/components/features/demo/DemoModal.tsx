"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneCall, CheckCircle2, Loader2, Sparkles, Building2, User, Mail, Phone } from "lucide-react";

interface DemoModalProps {
    buttonText?: string;
    buttonClassName?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
    showIcon?: boolean;
}

export function DemoModal({
    buttonText = "Demander une démo",
    buttonClassName = "",
    variant = "outline",
    size = "lg",
    showIcon = true,
}: DemoModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phone: "",
        acceptCallback: true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        if (!formData.acceptCallback) {
            setErrorMessage("Veuillez accepter d'être rappelé par un expert pour envoyer la demande.");
            setLoading(false);
            return;
        }

        try {
            const payload = new FormData();
            payload.append("type", "professionnel");
            payload.append("specificType", "Demande de démo platforme");
            payload.append("firstName", formData.firstName);
            payload.append("lastName", formData.lastName);
            payload.append("company", formData.company);
            payload.append("email", formData.email);
            payload.append("phone", formData.phone);
            payload.append(
                "message",
                `DEMANDE DE DÉMO GAINABLE.FR
---------------------------------
Nom : ${formData.lastName}
Prénom : ${formData.firstName}
Entreprise : ${formData.company}
Téléphone : ${formData.phone}
Email : ${formData.email}
Accord rappel : Oui`
            );

            const res = await fetch("/api/contact", {
                method: "POST",
                body: payload,
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json();
                setErrorMessage(data.error || "Une erreur est survenue lors de l'envoi.");
            }
        } catch (err) {
            console.error("Erreur demande de démo :", err);
            setErrorMessage("Erreur de connexion réseau. Veuillez réespayer.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSuccess(false);
        setErrorMessage("");
        setFormData({
            firstName: "",
            lastName: "",
            company: "",
            email: "",
            phone: "",
            acceptCallback: true,
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) handleReset(); }}>
            <DialogTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className={buttonClassName}
                >
                    {showIcon && <PhoneCall className="w-5 h-5 mr-2 text-[#D59B2B]" />}
                    {buttonText}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-2xl">
                {success ? (
                    <div className="py-8 text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-extrabold text-[#1F2D3D]">
                            Demande envoyée avec succès !
                        </h3>
                        <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                            Merci <strong>{formData.firstName}</strong> ! Notre équipe a bien reçu votre demande de démonstration. Un expert Gainable.fr vous rappellera très rapidement au <strong>{formData.phone}</strong>.
                        </p>
                        <div className="pt-4">
                            <Button
                                onClick={handleReset}
                                className="bg-[#1F2D3D] text-white hover:bg-slate-800 rounded-xl px-6 py-3 font-bold"
                            >
                                Fermer la fenêtre
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-left mb-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-[#D59B2B] text-xs font-bold w-fit mb-2">
                                <Sparkles className="w-3.5 h-3.5" /> Démonstration Personnalisée
                            </div>
                            <DialogTitle className="text-2xl font-extrabold text-[#1F2D3D]">
                                Demander une démo Gainable.fr
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 text-sm mt-1">
                                Remplissez vos coordonnées ci-dessous pour être rappelé par un expert et découvrir toutes les fonctionnalités du réseau.
                            </DialogDescription>
                        </DialogHeader>

                        {errorMessage && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="firstName" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-slate-400" /> Prénom
                                    </Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Ex: Marc"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="rounded-xl border-slate-200 focus:border-[#D59B2B] focus:ring-[#D59B2B]"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="lastName" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-slate-400" /> Nom
                                    </Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Ex: Dupont"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="rounded-xl border-slate-200 focus:border-[#D59B2B] focus:ring-[#D59B2B]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="company" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> Nom de l'entreprise
                                </Label>
                                <Input
                                    id="company"
                                    name="company"
                                    placeholder="Ex: CVC Sud Climatisation SARL"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="rounded-xl border-slate-200 focus:border-[#D59B2B] focus:ring-[#D59B2B]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Adresse email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Ex: m.dupont@cvcsud.fr"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="rounded-xl border-slate-200 focus:border-[#D59B2B] focus:ring-[#D59B2B]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="phone" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Numéro de téléphone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Ex: 06 12 34 56 78"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="rounded-xl border-slate-200 focus:border-[#D59B2B] focus:ring-[#D59B2B]"
                                />
                            </div>

                            <div className="flex items-start space-x-3 pt-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                <Checkbox
                                    id="acceptCallback"
                                    checked={formData.acceptCallback}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({ ...prev, acceptCallback: checked === true }))
                                    }
                                    className="mt-0.5 border-slate-300 data-[state=checked]:bg-[#D59B2B] data-[state=checked]:border-[#D59B2B]"
                                />
                                <Label
                                    htmlFor="acceptCallback"
                                    className="text-xs text-slate-600 font-medium leading-tight cursor-pointer"
                                >
                                    J'accepte d'être rappelé par un expert Gainable.fr pour effectuer ma démonstration.
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-[#100%] w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-6 text-base rounded-xl shadow-lg shadow-[#D59B2B]/25 transition-all mt-4"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Envoi en cours...
                                    </>
                                ) : (
                                    "Être rappelé par un expert →"
                                )}
                            </Button>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
