"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Calendar as CalendarIcon,
    Clock,
    CheckCircle2,
    Loader2,
    ShieldCheck,
    PhoneCall,
    Sparkles,
    User,
    Building2,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Check
} from "lucide-react";
import { trackMetaEvent } from "@/lib/meta-pixel";

interface DemoBookingWidgetProps {
    className?: string;
    id?: string;
}

// Generate the next 6 business days (skipping Sunday)
function getAvailableDays() {
    const days = [];
    const now = new Date();
    let current = new Date(now);

    // If it's already late afternoon (after 18h), start offering from tomorrow
    if (now.getHours() >= 18) {
        current.setDate(current.getDate() + 1);
    }

    const formatter = new Intl.DateTimeFormat("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });

    while (days.length < 5) {
        const dayOfWeek = current.getDay(); // 0 is Sunday
        if (dayOfWeek !== 0) { // Skip Sundays
            const isToday = current.toDateString() === now.toDateString();
            const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === current.toDateString();

            let label = formatter.format(current);
            label = label.charAt(0).toUpperCase() + label.slice(1);

            let badge = "";
            if (isToday) badge = "Aujourd'hui";
            else if (isTomorrow) badge = "Demain";

            days.push({
                dateString: current.toISOString().split("T")[0],
                label: label,
                badge: badge,
                fullDate: current.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
            });
        }
        current.setDate(current.getDate() + 1);
    }
    return days;
}

const TIME_SLOTS = [
    { time: "09:00", period: "Matin" },
    { time: "10:00", period: "Matin" },
    { time: "11:00", period: "Matin" },
    { time: "11:30", period: "Matin" },
    { time: "14:00", period: "Après-midi" },
    { time: "15:00", period: "Après-midi" },
    { time: "16:30", period: "Après-midi" },
    { time: "17:30", period: "Après-midi" },
    { time: "18:30", period: "Fin de journée" },
];

const METIERS = [
    "Installateur Climatisation / CVC / PAC",
    "Bureau d'études thermiques",
    "Diagnostiqueur immobilier",
    "Autre professionnel du bâtiment"
];

export function DemoBookingWidget({ className = "", id = "reserver-creneau" }: DemoBookingWidgetProps) {
    const availableDays = useMemo(() => getAvailableDays(), []);

    const [selectedDate, setSelectedDate] = useState<string>(availableDays[0]?.dateString || "");
    const [selectedDateLabel, setSelectedDateLabel] = useState<string>(availableDays[0]?.fullDate || "");
    const [selectedSlot, setSelectedSlot] = useState<string>("10:00");

    const [step, setStep] = useState<1 | 2>(1); // 1 = Slot Selection, 2 = Contact info

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        metier: METIERS[0],
        email: "",
        phone: "",
        postalCode: "",
    });

    const handleDateSelect = (dateStr: string, fullDate: string) => {
        setSelectedDate(dateStr);
        setSelectedDateLabel(fullDate);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleContinueToStep2 = () => {
        if (!selectedDate || !selectedSlot) {
            setErrorMessage("Veuillez choisir une date et un créneau.");
            return;
        }
        setErrorMessage("");
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        // Basic validation
        if (!formData.lastName || !formData.phone || !formData.email) {
            setErrorMessage("Merci de renseigner votre nom, téléphone et email professionnel.");
            setLoading(false);
            return;
        }

        try {
            const payload = new FormData();
            payload.append("type", "professionnel");
            payload.append("specificType", "Demande de démo Meta Ads (créneau choisi)");
            payload.append("firstName", formData.firstName);
            payload.append("lastName", formData.lastName);
            payload.append("company", formData.company);
            payload.append("email", formData.email);
            payload.append("phone", formData.phone);
            payload.append("city", formData.postalCode);
            payload.append(
                "message",
                `DEMANDE DE DÉMO (CRÉNEAU CHOISI) - META ADS
------------------------------------------------
Créneau retenu : ${selectedDateLabel} à ${selectedSlot}
Activité : ${formData.metier}
Entreprise : ${formData.company || "Non renseignée"}
Code Postal : ${formData.postalCode || "Non renseigné"}
Nom & Prénom : ${formData.lastName} ${formData.firstName}
Téléphone : ${formData.phone}
Email : ${formData.email}
Source : Landing Page Meta Ads /demo`
            );

            const res = await fetch("/api/contact", {
                method: "POST",
                body: payload,
            });

            if (res.ok) {
                setSuccess(true);
                // Trigger Meta Pixel Conversion Events
                trackMetaEvent("Lead", {
                    content_name: "Demande Démo Gainable",
                    content_category: formData.metier,
                    value: 0,
                    currency: "EUR",
                });
                trackMetaEvent("Schedule", {
                    date: selectedDate,
                    slot: selectedSlot,
                    company: formData.company,
                });
            } else {
                const data = await res.json().catch(() => ({}));
                setErrorMessage(data.error || "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.");
            }
        } catch (err) {
            console.error("Erreur enregistrement démo :", err);
            setErrorMessage("Problème de connexion. Merci de vérifier votre réseau et de réespayer.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSuccess(false);
        setStep(1);
        setErrorMessage("");
        setFormData({
            firstName: "",
            lastName: "",
            company: "",
            metier: METIERS[0],
            email: "",
            phone: "",
            postalCode: "",
        });
    };

    return (
        <div
            id={id}
            className={`bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-200/90 relative overflow-hidden ${className}`}
        >
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D59B2B] via-amber-400 to-[#1F2D3D]" />

            {/* SUCCESS STATE */}
            {success ? (
                <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>

                    <div className="space-y-2">
                        <span className="inline-block px-3.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                            Créneau Confirmé
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F2D3D]">
                            Merci {formData.firstName || formData.lastName} !
                        </h3>
                        <p className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto font-medium">
                            Votre demande de démo a bien été enregistrée pour le :
                        </p>
                        <div className="inline-flex items-center gap-2 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-[#1F2D3D] font-bold text-lg shadow-sm">
                            <CalendarIcon className="w-5 h-5 text-[#D59B2B]" />
                            <span className="capitalize">{selectedDateLabel}</span>
                            <span className="text-[#D59B2B]">à {selectedSlot}</span>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3">
                        <div className="flex items-start gap-3">
                            <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-slate-700 text-sm leading-relaxed">
                                <strong>Un de nos experts dédiés va vous contacter au <span className="text-[#1F2D3D] font-bold">{formData.phone}</span></strong> afin de vous accompagner et vous faire découvrir la plateforme en direct.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-slate-700 text-sm leading-relaxed">
                                Une confirmation récapitulative a été envoyée à <strong>{formData.email}</strong>.
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#D59B2B] shrink-0 mt-0.5" />
                            <p className="text-slate-600 text-xs">
                                Démonstration personnalisée de 15 min • 100% sans engagement • Réseau sélectif de confiance.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="button"
                            onClick={handleReset}
                            variant="outline"
                            className="text-slate-600 hover:text-slate-900 border-slate-200 rounded-xl"
                        >
                            Programmer un autre créneau
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    {/* Header Widget */}
                    <div className="mb-6 sm:mb-8 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-[#D59B2B] text-xs font-bold mb-3 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>15 Minutes en Direct • 100% Gratuit & Sans Engagement</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2D3D] tracking-tight">
                            Réservez votre démonstration en direct
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base mt-1">
                            Découvrez concrètement comment obtenir des chantiers qualifiés sans intermédiaire ni commission.
                        </p>
                    </div>

                    {/* Direct Subscription Callout */}
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                        <div className="text-xs sm:text-sm text-slate-800">
                            <span className="font-bold text-[#1F2D3D]">Vous souhaitez adhérer immédiatement ?</span>
                            <div className="text-slate-600 text-xs mt-0.5">Vous pouvez créer votre profil pro et choisir votre offre dès maintenant sans attendre d'appel.</div>
                        </div>
                        <a
                            href="/inscription#offres"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-[#1F2D3D] hover:bg-slate-800 shrink-0 px-4 py-2.5 rounded-xl shadow-sm transition-transform hover:scale-102"
                        >
                            <span>Souscrire directement</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                        <div className={`flex items-center gap-2 text-sm font-bold ${step === 1 ? "text-[#D59B2B]" : "text-emerald-600"}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step === 1 ? "bg-[#D59B2B]" : "bg-emerald-600"}`}>
                                {step === 1 ? "1" : <Check className="w-3.5 h-3.5" />}
                            </span>
                            <span>Choix du créneau</span>
                        </div>
                        <div className="h-0.5 w-12 bg-slate-200" />
                        <div className={`flex items-center gap-2 text-sm font-bold ${step === 2 ? "text-[#D59B2B]" : "text-slate-400"}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step === 2 ? "bg-[#D59B2B]" : "bg-slate-300"}`}>
                                2
                            </span>
                            <span>Vos coordonnées</span>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                            {errorMessage}
                        </div>
                    )}

                    {/* STEP 1: DATE & SLOT PICKER */}
                    {step === 1 && (
                        <div className="space-y-6">
                            {/* Days selector */}
                            <div>
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                                    <CalendarIcon className="w-4 h-4 text-[#D59B2B]" />
                                    1. Choisissez le jour
                                </Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                                    {availableDays.map((day) => {
                                        const isSelected = selectedDate === day.dateString;
                                        return (
                                            <button
                                                key={day.dateString}
                                                type="button"
                                                onClick={() => handleDateSelect(day.dateString, day.fullDate)}
                                                className={`p-3 rounded-2xl border text-center transition-all relative ${
                                                    isSelected
                                                        ? "border-[#D59B2B] bg-amber-50/70 shadow-md ring-2 ring-[#D59B2B]/30"
                                                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50"
                                                }`}
                                            >
                                                {day.badge && (
                                                    <span className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        isSelected ? "bg-[#D59B2B] text-white" : "bg-slate-100 text-slate-600"
                                                    }`}>
                                                        {day.badge}
                                                    </span>
                                                )}
                                                <div className={`text-sm font-bold mt-1 ${isSelected ? "text-[#1F2D3D]" : "text-slate-700"}`}>
                                                    {day.label}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Slot selector */}
                            <div>
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-[#D59B2B]" />
                                    2. Choisissez l'heure souhaitée (15 min)
                                </Label>
                                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                    {TIME_SLOTS.map((slot) => {
                                        const isSelected = selectedSlot === slot.time;
                                        return (
                                            <button
                                                key={slot.time}
                                                type="button"
                                                onClick={() => setSelectedSlot(slot.time)}
                                                className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${
                                                    isSelected
                                                        ? "bg-[#1F2D3D] text-white border-[#1F2D3D] shadow-md ring-2 ring-slate-400"
                                                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                                                }`}
                                            >
                                                {slot.time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Summary banner & continue */}
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <div className="text-xs text-slate-500 font-medium">Créneau sélectionné :</div>
                                    <div className="text-sm sm:text-base font-bold text-[#1F2D3D] capitalize">
                                        {selectedDateLabel} à {selectedSlot}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleContinueToStep2}
                                    className="w-full sm:w-auto bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-6 py-6 rounded-xl shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
                                >
                                    <span>Valider ce créneau</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CONTACT FORM */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
                            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm">
                                <div>
                                    <span className="text-slate-600 font-medium">Rendez-vous retenu : </span>
                                    <strong className="text-[#1F2D3D] capitalize">{selectedDateLabel} à {selectedSlot}</strong>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-[#D59B2B] font-bold hover:underline shrink-0 ml-2"
                                >
                                    Modifier
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700 mb-1 block">
                                        Prénom
                                    </Label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            placeholder="Ex: Thomas"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700 mb-1 block">
                                        Nom <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Ex: Bernard"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="company" className="text-xs font-semibold text-slate-700 mb-1 block">
                                        Nom de l'entreprise
                                    </Label>
                                    <div className="relative">
                                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                        <Input
                                            id="company"
                                            name="company"
                                            placeholder="Ex: Azur Génie Climatique"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="metier" className="text-xs font-semibold text-slate-700 mb-1 block">
                                        Votre activité principale
                                    </Label>
                                    <select
                                        id="metier"
                                        name="metier"
                                        value={formData.metier}
                                        onChange={handleChange}
                                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D59B2B]"
                                    >
                                        {METIERS.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700 mb-1 block">
                                        Numéro de portable <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="06 12 34 56 78"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                        />
                                    </div>
                                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                                        Pour que notre expert vous joigne à l'heure convenue.
                                    </span>
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700 mb-1 block">
                                        Email professionnel <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="contact@votre-societe.fr"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="postalCode" className="text-xs font-semibold text-slate-700 mb-1 block">
                                    Département / Code postal d'intervention
                                </Label>
                                <div className="relative">
                                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                    <Input
                                        id="postalCode"
                                        name="postalCode"
                                        placeholder="Ex: 13, 69, 75, 33..."
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="pl-9 h-11 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    className="w-full sm:w-auto rounded-xl h-12 text-slate-600 border-slate-200"
                                >
                                    Retour
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex-1 bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold h-12 rounded-xl text-base shadow-lg transition-transform hover:scale-101 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Validation en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <PhoneCall className="w-5 h-5" />
                                            <span>Confirmer ma demande de démo</span>
                                        </>
                                    )}
                                </Button>
                            </div>

                            <p className="text-[11px] text-center text-slate-500 pt-2 leading-relaxed">
                                En validant, vous acceptez qu'un expert Gainable.fr vous rappelle au créneau choisi. Vos données ne sont jamais revendues ni partagées à des tiers.
                            </p>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
