"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Building2, Briefcase, FileText, CheckCircle2, Lock, ArrowRight, Star } from "lucide-react";
import {
    EXPERT_TECHNOLOGIES,
    EXPERT_INTERVENTIONS_CLIM,
    EXPERT_INTERVENTIONS_ETUDE,
    EXPERT_INTERVENTIONS_DIAG,
    EXPERT_BRANDS,
    EXPERT_BATIMENTS,
    EXPERT_CERTIFICATIONS
} from "@/lib/constants";

const VALID_APE_PREFIXES: Record<string, string[]> = {
    'bureau_etude': ['7112', '7490'],
    'diagnostiqueur': ['7120', '6831'],
    'societe': ['43', '412', '332'],
};

const ERROR_MESSAGES: Record<string, string> = {
    'bureau_etude': "Ce type de compte est réservé aux codes APE d'ingénierie (ex: 71.12...).",
    'diagnostiqueur': "Ce type de compte est réservé aux codes APE de diagnostic (ex: 71.20...).",
    'societe': "Ce type de compte est réservé aux codes APE du bâtiment (ex: 43.xx, 41.xx...).",
};

export function SignUpForm() {
    // STATE: Selection & Steps
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const formRef = useRef<HTMLDivElement>(null);

    // Common Data
    const [formData, setFormData] = useState({
        representativeName: "",
        email: "",
        telephone: "",
        password: "",
        confirmPassword: "",
        website: "",
        linkedin: "",
        description: "",
        showPassword: false,
        // Company Data
        nomEntreprise: "",
        adresse: "",
        codePostal: "",
        ville: "",
        codeApe: "",
        siret: "",
        tvaNumber: "",
        pays: "France"
    });

    // Multi-value States
    const [technologies, setTechnologies] = useState<string[]>([]);
    const [interventionsClim, setInterventionsClim] = useState<string[]>([]);
    const [interventionsEtude, setInterventionsEtude] = useState<string[]>([]);
    const [interventionsDiag, setInterventionsDiag] = useState<string[]>([]);
    const [batiments, setBatiments] = useState<string[]>([]);
    const [marques, setMarques] = useState<string[]>([]);
    const [certifications, setCertifications] = useState<string[]>([]);

    const [siretInput, setSiretInput] = useState("");
    const [isLoadingSiret, setIsLoadingSiret] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // CONSTANTS Imported
    const TECH_LIST = EXPERT_TECHNOLOGIES.map(t => ({ id: t, label: t }));
    const INTERVENTION_CLIM_LIST = EXPERT_INTERVENTIONS_CLIM.map(t => ({ id: t, label: t }));
    const INTERVENTION_ETUDE_LIST = EXPERT_INTERVENTIONS_ETUDE.map(t => ({ id: t, label: t }));
    const INTERVENTION_DIAG_LIST = EXPERT_INTERVENTIONS_DIAG.map(t => ({ id: t, label: t }));
    const BATIMENT_LIST = EXPERT_BATIMENTS.map(t => ({ id: t, label: t }));
    const MARQUE_LIST = EXPERT_BRANDS.map(t => ({ id: t, label: t }));
    const CERT_LIST = EXPERT_CERTIFICATIONS.map(t => ({ id: t, label: t }));

    // Scroll to form when plan selected
    useEffect(() => {
        if (selectedPlan && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedPlan]);

    const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const validateApe = (ape: string, type: string | null): boolean => {
        if (!type || !ape) return true;
        const allowed = VALID_APE_PREFIXES[type];
        if (!allowed) return true;
        const cleanApe = ape.replace(/\./g, '');
        return allowed.some(prefix => cleanApe.startsWith(prefix));
    };

    const checkSiret = async () => {
        if (siretInput.length !== 14) return;
        setIsLoadingSiret(true);
        try {
            const res = await fetch(`/api/siret?siret=${siretInput}`);
            const data = await res.json();
            if (res.ok) {
                if (selectedPlan && !validateApe(data.naf, selectedPlan)) {
                    alert(`Code APE (${data.naf}) incompatible avec le compte ${selectedPlan}.\n\n${ERROR_MESSAGES[selectedPlan]}`);
                }

                setFormData(prev => ({
                    ...prev,
                    nomEntreprise: data.nom,
                    adresse: data.adresse,
                    codePostal: data.code_postal,
                    ville: data.ville,
                    codeApe: data.naf,
                    siret: siretInput,
                }));
            } else {
                alert("SIRET non trouvé ou erreur API");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la vérification");
        } finally {
            setIsLoadingSiret(false);
        }
    };

    const handleCommonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async () => {
        if (!selectedPlan) return;

        // Validation APE only for France
        if (formData.pays === 'France' && !validateApe(formData.codeApe, selectedPlan)) {
            alert(`Inscription bloquée: Code APE ${formData.codeApe} incompatible avec le type de compte.`);
            return;
        }

        setIsSubmitting(true);
        const payload = {
            ...formData,
            expertType: selectedPlan,
            technologies: selectedPlan === 'societe' ? technologies : [],
            interventionsClim: selectedPlan === 'societe' ? interventionsClim : [],
            interventionsEtude: selectedPlan === 'bureau_etude' ? interventionsEtude : [],
            interventionsDiag: selectedPlan === 'diagnostiqueur' ? interventionsDiag : [],
            batiments,
            marques: selectedPlan === 'societe' ? marques : [],
            certifications: selectedPlan === 'societe' ? certifications : []
        };

        try {
            // 1. Register User & Expert (DB)
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Erreur lors de l'inscription");
                setIsSubmitting(false);
                return;
            }

            const { expertId } = data;

            // FREE PLAN -> Direct Success
            if (selectedPlan === 'bureau_etude') {
                setIsSuccess(true);
                setIsSubmitting(false);
                return;
            }



            // PAID PLANS -> Stripe Checkout
            let planMap = '';
            // Pass the selected interval. Backend should handle 'cvc' + 'monthly' mapping.
            if (selectedPlan === 'societe') planMap = 'cvc';
            if (selectedPlan === 'diagnostiqueur') planMap = 'diag';

            try {
                const checkoutRes = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        planId: planMap,
                        interval: billingInterval, // New param
                        expertId: expertId,
                        email: formData.email
                    })
                });

                const checkoutData = await checkoutRes.json();

                if (checkoutRes.ok && checkoutData.url) {
                    window.location.href = checkoutData.url;
                } else {
                    console.error("Stripe Error:", checkoutData);
                    alert("Erreur lors de la redirection vers le paiement. Votre compte est créé mais en attente de paiement.");
                    setIsSubmitting(false);
                }

            } catch (stripeError) {
                console.error("Stripe Fetch Error:", stripeError);
                alert("Erreur de connexion au service de paiement.");
                setIsSubmitting(false);
            }

        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue.");
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="p-12 text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">Inscription reçue !</h2>
                <p className="text-slate-600 mb-8 text-lg">
                    Votre demande d'inscription a bien été enregistrée. Notre équipe va étudier votre dossier.
                    Vous recevrez un email de confirmation d'ici 24h.
                </p>
                <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => window.location.href = '/'}>Retour à l'accueil</Button>
                    <Button className="bg-[#1F2D3D] text-white" onClick={() => window.location.href = '/'}>Accéder à mon espace</Button>
                </div>
            </div>
        );
    }

    const [billingInterval, setBillingInterval] = useState<'yearly' | 'monthly'>('yearly');

    // --- RENDER HELPERS ---
    const getPlanName = (p: string) => {
        if (p === 'societe') return "Offre Expert CVC";
        if (p === 'bureau_etude') return "Bureau d'étude";
        if (p === 'diagnostiqueur') return "Diagnostiqueur";
        return "";
    };

    const getPlanPrice = (p: string) => {
        if (p === 'societe') {
            return billingInterval === 'yearly' ? "520 € HT / an" : "39,90 € HT / mois";
        }
        if (p === 'bureau_etude') return "Gratuit";
        if (p === 'diagnostiqueur') return "200 € HT / an";
        return "";
    };

    return (
        <div className="w-full">

            {/* --- SECTION 1: CHOIX DE L'OFFRE (Grid 3 Cards) --- */}
            <div className="max-w-7xl mx-auto px-4 py-8 mb-12">
                <div className="text-center mb-10">
                    <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4" /> Plateforme vérifiée et sécurisée
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* CARD 1: BUREAU D'ÉTUDE */}
                    <div
                        onClick={() => setSelectedPlan('bureau_etude')}
                        className={`cursor-pointer rounded-2xl p-6 border transition-all relative flex flex-col h-full ${selectedPlan === 'bureau_etude' ? 'border-[#D59B2B] ring-2 ring-[#D59B2B] ring-opacity-50 bg-orange-50/10' : 'border-slate-200 hover:shadow-xl bg-white'}`}
                    >
                        <div className="mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1F2D3D]">Bureau d'étude</h3>
                            <div className="text-emerald-600 font-bold text-xl mt-1">Gratuit</div>
                        </div>
                        <ul className="space-y-2 mb-6 flex-1">
                            {[
                                "0% commission sur contact",
                                "0 vente de contact",
                                "Visibilité sur Gainable.fr",
                                "Page dédiée",
                                "Création 3 articles / mois (Optimisé SEO)",
                                "Assistant IA : Génération intégrale du contenu",
                                "SEO standard",
                                "Leads & contacts illimités",
                                "Accès codes APE dédiés BE"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <div className={`mt-auto w-full py-2 px-4 rounded-lg text-center font-bold text-sm border ${selectedPlan === 'bureau_etude' ? 'bg-[#D59B2B] text-white border-[#D59B2B]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {selectedPlan === 'bureau_etude' ? 'Sélectionné' : 'Choisir cette offre'}
                        </div>
                    </div>

                    {/* CARD 2: SOCIÉTÉ EXPERTE (Focus) */}
                    <div
                        onClick={() => setSelectedPlan('societe')}
                        className={`cursor-pointer rounded-2xl p-6 border-2 shadow-lg transition-all relative flex flex-col h-full transform md:-translate-y-4 ${selectedPlan === 'societe' ? 'border-[#D59B2B] ring-4 ring-[#D59B2B] ring-opacity-20 bg-[#fff8ed]' : 'border-[#D59B2B] bg-white hover:shadow-2xl'}`}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D59B2B] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                            Recommandé
                        </div>
                        <div className="mb-4 mt-2">
                            <div className="w-10 h-10 rounded-full bg-[#D59B2B] flex items-center justify-center text-white mb-4">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1F2D3D]">Société Expert CVC</h3>

                            {/* Toggle Switch Enhanced */}
                            <div className="flex items-center gap-1 mt-4 mb-3 bg-slate-100 p-1.5 rounded-lg w-full" onClick={(e) => e.stopPropagation()}>
                                <button
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all shadow-sm ${billingInterval === 'yearly' ? 'bg-white text-[#1F2D3D] ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                    onClick={() => setBillingInterval('yearly')}
                                >
                                    Annuel
                                </button>
                                <button
                                    className={`flex-1 py-2 text-sm font-bold rounded-md transition-all shadow-sm ${billingInterval === 'monthly' ? 'bg-[#1F2D3D] text-white ring-1 ring-[#1F2D3D]' : 'text-slate-500 hover:text-slate-700'}`}
                                    onClick={() => setBillingInterval('monthly')}
                                >
                                    Mensuel
                                </button>
                            </div>

                            <div className="mt-2">
                                <span className="text-[#D59B2B] font-bold text-3xl">
                                    {billingInterval === 'yearly' ? '520 €' : '39,90 €'}
                                </span>
                                <span className="text-sm text-slate-500 font-medium">
                                    {billingInterval === 'yearly' ? ' / an HT' : ' / mois HT'}
                                </span>
                            </div>

                            {/* Commitment Note */}
                            {billingInterval === 'monthly' && (
                                <div className="mt-3 text-[11px] leading-tight font-medium text-slate-500 bg-slate-50 p-2 rounded border border-slate-200 text-left">
                                    <span className="text-[#D59B2B] font-bold">Engagement 12 mois reconductible.</span>
                                    <br />
                                    Résiliation possible 1 mois avant la fin du contrat.
                                </div>
                            )}
                        </div>
                        <ul className="space-y-2 mb-6 flex-1">
                            {[
                                "0% commission sur contact",
                                "0 vente de contact",
                                "Priorité SEO réelle et mesurable",
                                "Mise en avant Premium (Site + Carte)",
                                "Badge Expert visible (Confiance)",
                                "Création 3 articles / mois (Optimisé SEO)",
                                "Assistant IA : Génération intégrale du contenu",
                                "Leads qualifiés orientés installation",
                                "Le client choisit lui-même",
                                "Toutes fonctionnalités incluses"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-bold">
                                    <Star className="w-4 h-4 text-[#D59B2B] shrink-0 mt-0.5 fill-[#D59B2B]" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <div className={`mt-auto w-full py-3 px-4 rounded-lg text-center font-bold text-sm transition-colors ${selectedPlan === 'societe' ? 'bg-[#D59B2B] text-white' : 'bg-[#1F2D3D] text-white hover:bg-slate-800'}`}>
                            {selectedPlan === 'societe' ? 'Sélectionné' : 'Choisir l\'offre Expert'}
                        </div>
                    </div>

                    {/* CARD 3: DIAGNOSTIQUEUR */}
                    <div
                        onClick={() => setSelectedPlan('diagnostiqueur')}
                        className={`cursor-pointer rounded-2xl p-6 border transition-all relative flex flex-col h-full ${selectedPlan === 'diagnostiqueur' ? 'border-[#D59B2B] ring-2 ring-[#D59B2B] ring-opacity-50 bg-purple-50/20' : 'border-slate-200 hover:shadow-xl bg-white'}`}
                    >
                        <div className="mb-4">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1F2D3D]">Diagnostiqueur</h3>
                            <div className="text-purple-600 font-bold text-xl mt-1">200 € <span className="text-xs text-slate-500 font-normal">/ an HT</span></div>
                        </div>
                        <ul className="space-y-2 mb-6 flex-1">
                            {[
                                "0% commission sur contact",
                                "0 vente de contact",
                                "Visibilité locale sur Gainable.fr",
                                "Page PRO dédiée",
                                "Création 3 articles / mois (Optimisé SEO)",
                                "Assistant IA : Génération intégrale du contenu",
                                "Carte interactive",
                                "Leads & contacts illimités",
                                "Missions de diagnostic",
                                "Le client choisit lui-même"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <div className={`mt-auto w-full py-2 px-4 rounded-lg text-center font-bold text-sm border ${selectedPlan === 'diagnostiqueur' ? 'bg-[#D59B2B] text-white border-[#D59B2B]' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {selectedPlan === 'diagnostiqueur' ? 'Sélectionné' : 'Choisir cette offre'}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: FORMULAIRE + RECAP (Visible ONLY if plan selected) --- */}
            {selectedPlan && (
                <div ref={formRef} className="max-w-7xl mx-auto px-4 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid lg:grid-cols-12 gap-12">

                        {/* LEFT COLUMN: THE FORM (8 cols) */}
                        <div className="lg:col-span-7 space-y-8">

                            {/* BLOCK A: IDENTITE */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center text-sm">1</span>
                                    Vos informations
                                </h2>
                                <div className="grid gap-5">
                                    <div className="space-y-2">
                                        <Label>Nom et Prénom du représentant <span className="text-red-500">*</span></Label>
                                        <Input name="representativeName" value={formData.representativeName} onChange={handleCommonChange} placeholder="Ex: Jean Dupont" />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Email professionnel <span className="text-red-500">*</span></Label>
                                            <Input name="email" type="email" value={formData.email} onChange={handleCommonChange} placeholder="contact@entreprise.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Téléphone <span className="text-red-500">*</span></Label>
                                            <Input name="telephone" type="tel" value={formData.telephone} onChange={handleCommonChange} placeholder="06 12 34 56 78" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Mot de passe <span className="text-red-500">*</span></Label>
                                            <div className="relative">
                                                <Input name="password" type={formData.showPassword ? "text" : "password"} value={formData.password} onChange={handleCommonChange} />
                                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                    {formData.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Confirmation <span className="text-red-500">*</span></Label>
                                            <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleCommonChange} />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* BLOCK B: ENTREPRISE */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center text-sm">2</span>
                                    Votre Entreprise
                                </h2>

                                <div className="space-y-6">
                                    {/* Country & SIRET */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Pays <span className="text-red-500">*</span></Label>
                                            <Select value={formData.pays} onValueChange={(val) => setFormData(prev => ({ ...prev, pays: val }))}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="France">France 🇫🇷</SelectItem>
                                                    <SelectItem value="Suisse">Suisse 🇨🇭</SelectItem>
                                                    <SelectItem value="Belgique">Belgique 🇧🇪</SelectItem>
                                                    <SelectItem value="Maroc">Maroc 🇲🇦</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>
                                                {formData.pays === 'France' ? 'SIRET (France)' : 'Identifiant (IDE/BCE/ICE)'} <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder={formData.pays === 'France' ? "14 chiffres" : "ID Officiel"}
                                                    value={siretInput}
                                                    onChange={(e) => {
                                                        setSiretInput(e.target.value);
                                                        if (formData.pays !== 'France') setFormData(prev => ({ ...prev, siret: e.target.value }));
                                                    }}
                                                />
                                                {formData.pays === 'France' && (
                                                    <Button type="button" variant="outline" onClick={checkSiret} disabled={isLoadingSiret}>
                                                        {isLoadingSiret ? "..." : "Vérifier"}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Auto-filled details */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Nom de l'entreprise</Label>
                                            <Input name="nomEntreprise" value={formData.nomEntreprise} onChange={handleCommonChange} disabled={formData.pays === 'France'} className={formData.pays === 'France' ? 'bg-slate-50' : ''} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Code APE</Label>
                                            <Input value={formData.codeApe} disabled className="bg-slate-50" placeholder="XXXXX" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Adresse</Label>
                                        <Input name="adresse" value={formData.adresse} onChange={handleCommonChange} disabled={formData.pays === 'France'} className={formData.pays === 'France' ? 'bg-slate-50' : ''} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input name="codePostal" placeholder="Code Postal" value={formData.codePostal} onChange={handleCommonChange} disabled={formData.pays === 'France'} className={formData.pays === 'France' ? 'bg-slate-50' : ''} />
                                        <Input name="ville" placeholder="Ville" value={formData.ville} onChange={handleCommonChange} disabled={formData.pays === 'France'} className={formData.pays === 'France' ? 'bg-slate-50' : ''} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Description de l'activité <span className="text-red-500">*</span></Label>
                                        <Textarea name="description" value={formData.description} onChange={handleCommonChange} placeholder="Présentez votre activité en quelques lignes..." className="h-24" />
                                    </div>
                                </div>
                            </div>

                            {/* BLOCK C: DETAILS TECHNIQUES */}
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-[#1F2D3D] text-white flex items-center justify-center text-sm">3</span>
                                    Expertise
                                </h2>
                                <div className="space-y-6">
                                    {/* Batiments (All) */}
                                    <div>
                                        <h3 className="font-semibold mb-3">Types de bâtiments (Interventions)</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {BATIMENT_LIST.map(item => (
                                                <div key={item.id} className="flex items-center space-x-2">
                                                    <Checkbox id={`bat-${item.id}`} checked={batiments.includes(item.id)} onCheckedChange={() => toggleSelection(batiments, setBatiments, item.id)} />
                                                    <label htmlFor={`bat-${item.id}`} className="text-sm">{item.label}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Specific fields based on ExpertType */}
                                    {selectedPlan === 'societe' && (
                                        <div className="space-y-6 pt-4 border-t border-slate-100">
                                            <div>
                                                <h3 className="font-semibold mb-3">Technologies maîtrisées</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {TECH_LIST.map(item => (
                                                        <div key={item.id} className="flex items-center space-x-2">
                                                            <Checkbox id={`tech-${item.id}`} checked={technologies.includes(item.id)} onCheckedChange={() => toggleSelection(technologies, setTechnologies, item.id)} />
                                                            <label htmlFor={`tech-${item.id}`} className="text-sm">{item.label}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-3">Marques installées</h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {MARQUE_LIST.map(item => (
                                                        <div key={item.id} className="flex items-center space-x-2">
                                                            <Checkbox id={`brand-${item.id}`} checked={marques.includes(item.id)} onCheckedChange={() => toggleSelection(marques, setMarques, item.id)} />
                                                            <label htmlFor={`brand-${item.id}`} className="text-sm">{item.label}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedPlan === 'diagnostiqueur' && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <h3 className="font-semibold mb-3">Certifications Diagnostics</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {INTERVENTION_DIAG_LIST.map(item => (
                                                    <div key={item.id} className="flex items-center space-x-2">
                                                        <Checkbox id={`diag-${item.id}`} checked={interventionsDiag.includes(item.id)} onCheckedChange={() => toggleSelection(interventionsDiag, setInterventionsDiag, item.id)} />
                                                        <label htmlFor={`diag-${item.id}`} className="text-sm">{item.label}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: STICKY SIDEBAR (5 cols) */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-24">
                                <div className="bg-[#1F2D3D] text-white rounded-2xl shadow-xl overflow-hidden">
                                    <div className="p-6 md:p-8">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <Lock className="w-5 h-5 text-[#D59B2B]" />
                                            Récapitulatif
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="flex justify-between items-start pb-6 border-b border-slate-700">
                                                <div>
                                                    <div className="text-slate-400 text-sm mb-1">Offre sélectionnée</div>
                                                    <div className="font-bold text-lg text-[#D59B2B]">{getPlanName(selectedPlan)}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-xl">{getPlanPrice(selectedPlan)}</div>
                                                </div>
                                            </div>

                                            <ul className="space-y-3">
                                                <li className="flex gap-3 text-sm text-slate-300">
                                                    <CheckCircle2 className="w-5 h-5 text-[#D59B2B] shrink-0" />
                                                    <span>Pas de reconduction tacite masquée</span>
                                                </li>
                                                <li className="flex gap-3 text-sm text-slate-300">
                                                    <CheckCircle2 className="w-5 h-5 text-[#D59B2B] shrink-0" />
                                                    <span>Visibilité immédiate dès validation</span>
                                                </li>
                                                <li className="flex gap-3 text-sm text-slate-300">
                                                    <CheckCircle2 className="w-5 h-5 text-[#D59B2B] shrink-0" />
                                                    <span>Support technique inclus</span>
                                                </li>
                                            </ul>

                                            <div className="pt-6">
                                                <Button
                                                    onClick={handleRegister}
                                                    disabled={isSubmitting || !formData.representativeName || !formData.email || !formData.telephone || !formData.password || !formData.siret}
                                                    className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white py-6 text-lg font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02]"
                                                >
                                                    {isSubmitting ? "Chargement..." : (
                                                        <span className="flex items-center gap-2">
                                                            {selectedPlan === 'bureau_etude' ? 'Valider l\'inscription' : 'Payer et Valider'}
                                                            <ArrowRight className="w-5 h-5" />
                                                        </span>
                                                    )}
                                                </Button>
                                                <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-2">
                                                    <Lock className="w-3 h-3" /> Paiement sécurisé via Stripe
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800 p-4 text-center text-xs text-slate-400">
                                        En cliquant sur valider, vous acceptez nos CGV et notre politique de confidentialité.
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
