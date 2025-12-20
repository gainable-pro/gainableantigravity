"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Building2, Briefcase, FileText, CheckCircle2 } from "lucide-react";
import {
    EXPERT_TECHNOLOGIES,
    EXPERT_INTERVENTIONS_CLIM,
    EXPERT_INTERVENTIONS_ETUDE,
    EXPERT_INTERVENTIONS_DIAG,
    EXPERT_BRANDS,
    EXPERT_BATIMENTS
} from "@/lib/constants";

const VALID_APE_PREFIXES: Record<string, string[]> = {
    'bureau_etude': ['7112', '7490'], // 74.90 sometimes used for consulting
    'diagnostiqueur': ['7120', '6831'], // 68.31 sometimes for real estate agencies doing diag
    'societe': ['43', '412', '332'], // 43 (specialised construction), 41.2 (building), 33.2 (install industrial machinery)
};

const ERROR_MESSAGES: Record<string, string> = {
    'bureau_etude': "Ce type de compte est réservé aux codes APE d'ingénierie (ex: 71.12...).",
    'diagnostiqueur': "Ce type de compte est réservé aux codes APE de diagnostic (ex: 71.20...).",
    'societe': "Ce type de compte est réservé aux codes APE du bâtiment (ex: 43.xx, 41.xx...).",
};

export function SignUpForm() {
    const [step, setStep] = useState(1);
    const [expertType, setExpertType] = useState<string | null>(null);

    // Common Data
    const [formData, setFormData] = useState({
        representativeName: "",
        email: "",
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
                // Validate APE before setting data
                if (expertType && !validateApe(data.naf, expertType)) {
                    alert(`Code APE (${data.naf}) incompatible avec le compte ${expertType}.\n\n${ERROR_MESSAGES[expertType]}`);
                    // Optionally clear or don't set data, or just warn. 
                    // User requested "bloquer". So we should strictly block.
                    // But we can let them see the company found, just block proceeding?
                    // Let's set it but add an error state, or just alert and return.
                    // Let's alert and NOT fill the form to force them to stop? 
                    // Or fill it but disable the "Next" button?
                    // "Block registration if APE doesn't match" -> Allow seeing it but maybe reset siretInput?
                    // Let's just alert for now and preventing populating might be too harsh if they picked wrong type.
                    // Better: Fill it, but prevent registration?
                }

                setFormData(prev => ({
                    ...prev,
                    nomEntreprise: data.nom,
                    adresse: data.adresse,
                    codePostal: data.code_postal,
                    ville: data.ville,
                    codeApe: data.naf,
                    siret: siretInput,
                    // pays: "France" // Don't force override if user selected something else, but API is France only so implicitly France.
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

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleRegister = async () => {
        // Validation APE only for France
        if (formData.pays === 'France' && !validateApe(formData.codeApe, expertType)) {
            alert(`Inscription bloquée: Code APE ${formData.codeApe} incompatible avec le type de compte.`);
            return;
        }

        setIsSubmitting(true);
        // Prepare Data Payload aligned with Schema
        const payload = {
            ...formData,
            expertType,
            technologies: expertType === 'societe' ? technologies : [],
            interventionsClim: expertType === 'societe' ? interventionsClim : [],
            interventionsEtude: expertType === 'bureau_etude' ? interventionsEtude : [],
            interventionsDiag: expertType === 'diagnostiqueur' ? interventionsDiag : [],
            batiments,
            marques: expertType === 'societe' ? marques : []
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

            // 2. Handle Payment or Success
            const { expertId } = data; // userId is also available if needed

            // FREE PLAN -> Direct Success
            if (expertType === 'bureau_etude') {
                setIsSuccess(true);
                setIsSubmitting(false);
                return;
            }

            // PAID PLANS -> Stripe Checkout
            let planMap = '';
            if (expertType === 'societe') planMap = 'cvc';
            if (expertType === 'diagnostiqueur') planMap = 'diag';

            try {
                const checkoutRes = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        planId: planMap,
                        expertId: expertId,
                        email: formData.email
                    })
                });

                const checkoutData = await checkoutRes.json();

                if (checkoutRes.ok && checkoutData.url) {
                    // Redirect to Stripe
                    window.location.href = checkoutData.url;
                } else {
                    console.error("Stripe Error:", checkoutData);
                    alert("Erreur lors de la redirection vers le paiement. Votre compte est créé mais en attente de paiement. Vous pourrez payer plus tard depuis votre espace.");
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

    // --- STEP 1: EXPERT TYPE & PRICING GRID ---
    if (step === 1) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#1F2D3D] mb-4">Rejoignez le réseau Gainable.fr</h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Des offres claires et transparentes, adaptées à votre métier.<br />
                        <span className="font-medium text-[#1F2D3D]">Aucune revente de contacts • Aucun intermédiaire • Le client choisit directement son expert</span>
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Plateforme qualitative et contrôlée (SIRET + Activité)
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {/* CARD 1: BUREAU D'ÉTUDE (Left) */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all relative flex flex-col h-full">
                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-2">Bureau d'étude</h3>
                            <div className="text-emerald-600 font-bold text-2xl mb-4">Gratuit</div>
                            <div className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-slate-200">
                                Inscription contrôlée – réservée aux bureaux d’étude
                            </div>
                            <p className="text-slate-500 text-sm">
                                Solution de visibilité et de prescription pour les bureaux d'études. Pas d'intervention terrain.
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {[
                                "Visibilité sur Gainable.fr",
                                "Page dédiée",
                                "Création 2 articles / mois (Optimisé SEO)",
                                "SEO standard",
                                "Leads & contacts illimités",
                                "Accès codes APE dédiés BE",
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            <Button
                                onClick={() => { setExpertType("bureau_etude"); nextStep(); }}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-6 font-semibold"
                            >
                                S'inscrire gratuitement
                            </Button>
                        </div>
                    </div>

                    {/* CARD 2: SOCIÉTÉ EXPERTE CVC (Center - Highlighted) */}
                    <div className="bg-white rounded-2xl p-8 border-2 border-[#D59B2B] shadow-2xl relative flex flex-col h-full transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D59B2B] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                            Recommandé - Offre Premium
                        </div>

                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-full bg-[#D59B2B] flex items-center justify-center text-white mb-4">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-2">Société experte CVC</h3>
                            <div className="mb-4">
                                <span className="text-[#D59B2B] font-bold text-3xl">520 €</span> <span className="text-sm text-slate-500 font-normal">/ an TTC</span>
                            </div>
                            <div className="text-sm font-bold text-white mb-4 bg-[#D59B2B] inline-block px-3 py-1 rounded-sm shadow-sm">
                                🟨 Expert Gainable certifié Gainable.fr
                            </div>
                            <p className="text-slate-500 text-sm">
                                L'offre de référence pour les installateurs clim/gainable. Visibilité maximale et gage de confiance.
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {[
                                "Priorité SEO réelle et mesurable",
                                "Mise en avant Premium (Site + Carte)",
                                "Création 2 articles / mois (Optimisé SEO)",
                                "Badge Expert visible (Confiance)",
                                "Leads qualifiés orientés installation",
                                "Aucun intermédiaire, aucune revente",
                                "Le client choisit lui-même",
                                "Toutes fonctionnalités incluses"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-bold">
                                    <CheckCircle2 className="w-5 h-5 text-[#D59B2B] shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            <Button
                                onClick={() => { setExpertType("societe"); nextStep(); }}
                                className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white rounded-xl py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                Choisir l'offre Expert
                            </Button>
                        </div>
                    </div>

                    {/* CARD 3: DIAGNOSTIQUEUR (Right) */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all relative flex flex-col h-full">
                        <div className="mb-6">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-2">Diagnostiqueur</h3>
                            <div className="text-purple-600 font-bold text-2xl mb-4">199 € <span className="text-sm text-slate-500 font-normal">/ an TTC</span></div>
                            <p className="text-slate-500 text-sm">
                                Pour les diagnostiqueurs CVC / Audit / Conseil (sans pose). Visibilité locale et missions de diagnostic.
                            </p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            {[
                                "Visibilité locale sur Gainable.fr",
                                "Page PRO dédiée",
                                "Création 2 articles / mois (Optimisé SEO)",
                                "Carte interactive",
                                "Leads & contacts illimités",
                                "Missions de diagnostic",
                                "Aucune revente de contact",
                                "Le client choisit lui-même"
                            ].map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto p-3 bg-slate-50 rounded-lg text-xs text-slate-500 text-center mb-4">
                            Pas de badge Expert • Pas de priorité SEO face aux installateurs
                        </div>

                        <div className="mt-auto">
                            <Button
                                onClick={() => { setExpertType("diagnostiqueur"); nextStep(); }}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-6 font-semibold"
                            >
                                Choisir l'offre Diagnostiqueur
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: COMMON INFO ---
    if (step === 2) {
        return (
            <div className="p-8">
                <div className="mb-8">
                    <button onClick={prevStep} className="text-sm text-slate-400 hover:text-[#1F2D3D] mb-2">← Retour</button>
                    <h2 className="text-2xl font-bold text-[#1F2D3D]">Informations de connexion</h2>
                    <p className="text-slate-500">Ces informations vous permettront d'accéder à votre espace pro.</p>
                </div>

                <div className="grid gap-6 max-w-2xl mx-auto">
                    <div className="space-y-2">
                        <Label htmlFor="representativeName">Nom et Prénom du représentant <span className="text-red-500">*</span></Label>
                        <Input
                            id="representativeName"
                            name="representativeName"
                            value={formData.representativeName}
                            onChange={handleCommonChange}
                            placeholder="Ex: Jean Dupont"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email professionnel <span className="text-red-500">*</span></Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleCommonChange}
                            placeholder="contact@entreprise.com"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={formData.showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleCommonChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {formData.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmation <span className="text-red-500">*</span></Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleCommonChange}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="website">Site web (Optionnel)</Label>
                            <Input
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleCommonChange}
                                placeholder="https://www.monsite.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="linkedin">Page LinkedIn (Optionnel)</Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleCommonChange}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description / Présentation <span className="text-red-500">*</span></Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleCommonChange}
                            placeholder="Présentez votre entreprise, votre expérience et vos spécialités..."
                            className="h-32"
                        />
                    </div>

                    <div className="flex justify-between pt-6">
                        <Button variant="outline" onClick={prevStep}>Retour</Button>
                        <Button
                            onClick={nextStep}
                            className="bg-[#D59B2B] hover:bg-[#b88622] text-white"
                            disabled={!formData.representativeName || !formData.email || !formData.password}
                        >
                            Étape suivante
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 3: SPECIFIC INFO ---
    if (step === 3) {
        return (
            <div className="p-8">
                <div className="mb-8">
                    <button onClick={prevStep} className="text-sm text-slate-400 hover:text-[#1F2D3D] mb-2">← Retour</button>
                    <h2 className="text-2xl font-bold text-[#1F2D3D]">
                        {expertType === 'societe' && "Informations Société"}
                        {expertType === 'bureau_etude' && "Détails Bureau d'étude"}
                        {expertType === 'diagnostiqueur' && "Détails Diagnostiqueur"}
                    </h2>
                    <p className="text-slate-500">Finalisez votre inscription avec les détails de votre activité.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-8">

                    {/* SIRET BLOCK (Applies to all mostly, but logic varies) */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-[#D59B2B]" /> Identification
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Pays <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.pays}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, pays: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner le pays" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="France">France 🇫🇷</SelectItem>
                                            <SelectItem value="Suisse">Suisse 🇨🇭</SelectItem>
                                            <SelectItem value="Belgique">Belgique 🇧🇪</SelectItem>
                                            <SelectItem value="Maroc">Maroc 🇲🇦</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Nom de l'entreprise <span className="text-red-500">*</span></Label>
                                    <Input
                                        name="nomEntreprise"
                                        placeholder="Raison sociale"
                                        value={formData.nomEntreprise}
                                        onChange={handleCommonChange}
                                        disabled={formData.pays === 'France'}
                                        className={formData.pays === 'France' ? "bg-slate-50 cursor-not-allowed" : ""}
                                    />
                                </div>
                            </div>

                            {/* TVA Field */}
                            <div className="space-y-2">
                                <Label>Numéro de TVA {formData.pays !== 'France' && '(Intracommunautaire ou local)'}</Label>
                                <Input
                                    name="tvaNumber"
                                    placeholder={formData.pays === 'France' ? "FRXX..." : "Numéro de TVA"}
                                    value={formData.tvaNumber}
                                    onChange={handleCommonChange}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>
                                        {formData.pays === 'France' && 'SIRET (France)'}
                                        {formData.pays === 'Suisse' && 'IDE / UID (CHE-xxx.xxx.xxx)'}
                                        {formData.pays === 'Belgique' && 'BCE / KBO (0xxx.xxx.xxx)'}
                                        {formData.pays === 'Maroc' && 'ICE (Identifiant Commun de l\'Entreprise)'}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder={formData.pays === 'France' ? "14 chiffres" : "Identifiant officiel"}
                                            value={siretInput}
                                            onChange={(e) => {
                                                setSiretInput(e.target.value);
                                                // For non-France, direct update to formData
                                                if (formData.pays !== 'France') {
                                                    setFormData(prev => ({ ...prev, siret: e.target.value }));
                                                }
                                            }}
                                        />
                                        {formData.pays === 'France' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="shrink-0"
                                                onClick={checkSiret}
                                                disabled={isLoadingSiret}
                                            >
                                                {isLoadingSiret ? "..." : "Vérifier"}
                                            </Button>
                                        )}
                                    </div>
                                    {formData.pays === 'France' && <p className="text-xs text-slate-500">API INSEE : Vérification automatique</p>}
                                    {formData.pays !== 'France' && <p className="text-xs text-orange-600 font-medium">Validation manuelle de votre dossier sous 24h.</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Code APE (Lecture seule)</Label>
                                    <Input disabled className="bg-slate-50" value={formData.codeApe} placeholder="XXXXX" />
                                </div>
                            </div>


                            {/* Address Auto-fill Logic */}
                            <div className="space-y-2">
                                <Label>Adresse du siège {formData.pays === 'France' && <span className="text-xs text-orange-600">(Vérifiée via SIRET)</span>}</Label>
                                <Input
                                    name="adresse"
                                    placeholder="Adresse complète"
                                    value={formData.adresse}
                                    onChange={handleCommonChange}
                                    disabled={formData.pays === 'France'}
                                    className={formData.pays === 'France' ? "bg-slate-50 cursor-not-allowed" : ""}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    name="codePostal"
                                    placeholder="Code Postal"
                                    value={formData.codePostal}
                                    onChange={handleCommonChange}
                                    disabled={formData.pays === 'France'}
                                    className={formData.pays === 'France' ? "bg-slate-50 cursor-not-allowed" : ""}
                                />
                                <Input
                                    name="ville"
                                    placeholder="Ville"
                                    value={formData.ville}
                                    onChange={handleCommonChange}
                                    disabled={formData.pays === 'France'}
                                    className={formData.pays === 'France' ? "bg-slate-50 cursor-not-allowed" : ""}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* --- COMMON: TYPES DE BATIMENTS (Applies to all expert types) --- */}
                    <Card>
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Types de bâtiments (Interventions)</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {BATIMENT_LIST.map(item => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`bat-${item.id}`}
                                            checked={batiments.includes(item.id)}
                                            onCheckedChange={() => toggleSelection(batiments, setBatiments, item.id)}
                                        />
                                        <label htmlFor={`bat-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* DYNAMIC BLOCKS BASED ON EXPERT TYPE */}

                    {/* CASE 1: SOCIETE */}
                    {expertType === 'societe' && (
                        <>
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Technologies maîtrisées</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {TECH_LIST.map(item => (
                                            <div key={item.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`tech-${item.id}`}
                                                    checked={technologies.includes(item.id)}
                                                    onCheckedChange={() => toggleSelection(technologies, setTechnologies, item.id)}
                                                />
                                                <label htmlFor={`tech-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Interventions CVC</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {INTERVENTION_CLIM_LIST.map(item => (
                                            <div key={item.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`int-${item.id}`}
                                                    checked={interventionsClim.includes(item.id)}
                                                    onCheckedChange={() => toggleSelection(interventionsClim, setInterventionsClim, item.id)}
                                                />
                                                <label htmlFor={`int-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Marques installées</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {MARQUE_LIST.map(item => (
                                            <div key={item.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`brand-${item.id}`}
                                                    checked={marques.includes(item.id)}
                                                    onCheckedChange={() => toggleSelection(marques, setMarques, item.id)}
                                                />
                                                <label htmlFor={`brand-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    {/* CASE 2: BUREAU D'ETUDE */}
                    {expertType === 'bureau_etude' && (
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Expertise Bureau d'Étude</h3>
                                <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm mb-4">
                                    <strong>Note:</strong> Votre code APE doit correspondre à l'ingénierie (ex: 7112B) pour validation automatique.
                                </div>
                                <div className="grid gap-3">
                                    {INTERVENTION_ETUDE_LIST.map(item => (
                                        <div key={item.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`etude-${item.id}`}
                                                checked={interventionsEtude.includes(item.id)}
                                                onCheckedChange={() => toggleSelection(interventionsEtude, setInterventionsEtude, item.id)}
                                            />
                                            <label htmlFor={`etude-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* CASE 3: DIAGNOSTIQUEUR */}
                    {expertType === 'diagnostiqueur' && (
                        <>
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h3 className="font-semibold text-lg text-[#1F2D3D] mb-4">Certifications Diagnostics</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {INTERVENTION_DIAG_LIST.map(item => (
                                            <div key={item.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`diag-${item.id}`}
                                                    checked={interventionsDiag.includes(item.id)}
                                                    onCheckedChange={() => toggleSelection(interventionsDiag, setInterventionsDiag, item.id)}
                                                />
                                                <label htmlFor={`diag-${item.id}`} className="text-sm font-medium leading-none cursor-pointer">{item.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-[#1F2D3D] text-white p-6 rounded-xl shadow-lg">
                                <h3 className="font-bold text-xl mb-4 text-[#D59B2B]">Avantages Membre Diagnostiqueur</h3>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#D59B2B]" /> Référencement prioritaire</li>
                                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#D59B2B]" /> Page dédiée optimisée SEO</li>
                                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#D59B2B]" /> Mise en relation directe (0% com)</li>
                                </ul>
                                <div className="flex items-center justify-between border-t border-white/20 pt-4">
                                    <div>
                                        <span className="text-sm text-slate-300">Frais d'inscription unique</span>
                                        <div className="text-3xl font-bold">199 €</div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            onClick={handleRegister}
                                            disabled={isSubmitting}
                                            className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold"
                                        >
                                            {isSubmitting ? "Traitement..." : "Procéder au paiement"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-800">
                        <strong>Important :</strong> Toute usurpation d'identité ou fausse déclaration entraînera la suppression immédiate du compte conformément à nos conditions générales.
                        {formData.pays !== 'France' && (
                            <span className="block mt-1">Pour les entreprises hors France, un justificatif (Kbis, Registre Commerce...) pourra vous être demandé ultérieurement.</span>
                        )}
                    </div>



                    <div className="flex justify-between pt-6 pb-12">
                        <Button variant="outline" onClick={prevStep}>Retour</Button>
                        {expertType !== 'diagnostiqueur' && (
                            <Button
                                onClick={handleRegister}
                                disabled={isSubmitting}
                                className="bg-[#1F2D3D] text-white hover:bg-[#2c3e50] px-8"
                            >
                                {isSubmitting ? "Validation..." : "Valider l'inscription"}
                            </Button>
                        )}
                    </div>
                </div>
            </div >
        );
    }

    return null;
}
