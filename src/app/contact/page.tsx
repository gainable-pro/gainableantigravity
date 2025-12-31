"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Send, Upload, User, Briefcase, Users, CheckCircle, MapPin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
    const [step, setStep] = useState<"type" | "form" | "success">("type");
    const [userType, setUserType] = useState<string>(""); // particulier, professionnel, partenaire
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    // Form Stats
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleTypeSelect = (type: string) => {
        setUserType(type);
        setStep("form");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.append("type", userType);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Erreur d'envoi");

            setStep("success");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            alert("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            {/* HERO SECTION */}
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-[#1F2D3D] overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url('/contact-bg.png')` }} // Assuming image matches path
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#1F2D3D]/80 to-[#1F2D3D]/95"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Contactez-nous
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Une question, un devis ou une proposition de partenariat ?
                        <br />Notre équipe est à votre écoute.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-20">
                <div className="max-w-4xl mx-auto">

                    {/* SUCCESS STATE */}
                    {step === "success" && (
                        <Card className="shadow-xl border-t-4 border-t-green-500 bg-white">
                            <CardContent className="pt-12 pb-12 text-center space-y-6">
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                                    <CheckCircle className="w-12 h-12 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800">Message envoyé !</h2>
                                    <p className="text-slate-500 mt-2 text-lg">
                                        Merci de nous avoir contactés. Nous reviendrons vers vous sous 48h.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => { setStep("type"); setUserType(""); }}
                                    className="mt-8" variant="outline"
                                >
                                    Envoyer un autre message
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* SELECT TYPE STATE */}
                    {step === "type" && (
                        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button onClick={() => handleTypeSelect("particulier")} className="group bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-[#D59B2B] hover:shadow-2xl transition-all text-left">
                                <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                                    <User className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Je suis un Particulier</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Vous avez un projet de climatisation ou de diagnostic ? Posez vos questions ici.
                                </p>
                            </button>

                            <button onClick={() => handleTypeSelect("professionnel")} className="group bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-[#D59B2B] hover:shadow-2xl transition-all text-left">
                                <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-[#D59B2B] group-hover:scale-110 transition-transform">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Je suis un Professionnel</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Bureau d'étude, diagnostiqueur ou installateur. Rejoignez le réseau Gainable.fr.
                                </p>
                            </button>

                            <button onClick={() => handleTypeSelect("partenaire")} className="group bg-white p-8 rounded-xl shadow-lg border border-transparent hover:border-[#D59B2B] hover:shadow-2xl transition-all text-left">
                                <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                                    <Users className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Partenariat / Autre</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Une proposition commerciale ou un partenariat média ? C'est par ici.
                                </p>
                            </button>
                        </div>
                    )}

                    {/* FORM STATE */}
                    {step === "form" && (
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">

                            {/* FORM HEADER */}
                            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-[#D59B2B] uppercase tracking-wider mb-1">
                                        Formulaire de contact
                                    </p>
                                    <h2 className="text-2xl font-bold text-slate-800 capitalize">
                                        {userType}
                                    </h2>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setStep("type")} className="text-slate-400 hover:text-slate-600">
                                    Changer
                                </Button>
                            </div>

                            <div className="p-8 md:p-10">
                                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                                    {/* DYNAMIC FIELDS FOR PRO */}
                                    {userType === "professionnel" && (
                                        <div className="bg-amber-50/50 p-6 rounded-xl border border-amber-100 mb-8">
                                            <Label className="mb-2 block text-amber-900 font-semibold">Votre domaine d'activité *</Label>
                                            <Select name="specificType" required>
                                                <SelectTrigger className="bg-white border-amber-200">
                                                    <SelectValue placeholder="Sélectionnez votre métier" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bureau_etude">Bureau d'étude thermique</SelectItem>
                                                    <SelectItem value="diagnostiqueur">Diagnostiqueur Immobilier (DPE/Audit)</SelectItem>
                                                    <SelectItem value="installateur">Installateur CVC / Plombier</SelectItem>
                                                    <SelectItem value="architecte">Architecte / Maître d'œuvre</SelectItem>
                                                    <SelectItem value="autre_pro">Autre professionnel du bâtiment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* GENERAL FIELDS */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Civilité</Label>
                                            <Select name="civility" defaultValue="M.">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="-" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="M.">Monsieur</SelectItem>
                                                    <SelectItem value="Mme">Madame</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="hidden md:block"></div> {/* Spacer */}

                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Nom *</Label>
                                            <Input name="lastName" placeholder="Votre nom" required className="h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Prénom</Label>
                                            <Input name="firstName" placeholder="Votre prénom" className="h-11" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Email professionnel/perso *</Label>
                                            <Input name="email" type="email" placeholder="contact@exemple.com" required className="h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Téléphone</Label>
                                            <Input name="phone" type="tel" placeholder="06 12 34 56 78" className="h-11" />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Code Postal</Label>
                                            <Input name="zip" placeholder="75000" className="h-11" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-600">Ville</Label>
                                            <Input name="city" placeholder="Paris" className="h-11" />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-4">
                                        <Label className="text-slate-600">Votre Message *</Label>
                                        <Textarea
                                            name="message"
                                            placeholder="Détaillez votre demande ici..."
                                            className="min-h-[150px] resize-y text-base"
                                            required
                                        />
                                    </div>

                                    {/* ATTACHMENT */}
                                    <div className="space-y-3 pt-2">
                                        <Label className="text-slate-600">Pièce jointe (Optionnel)</Label>
                                        <input
                                            type="file"
                                            name="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors group"
                                        >
                                            <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-blue-50 transition-colors">
                                                <Upload className="w-6 h-6 text-slate-500 group-hover:text-blue-500" />
                                            </div>
                                            {fileName ? (
                                                <p className="text-sm font-medium text-blue-600">{fileName}</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-medium text-slate-700">Cliquez pour importer un fichier</p>
                                                    <p className="text-xs text-slate-400 mt-1">PDF, DOC, JPG, PNG (Max 4 Mo)</p>
                                                </>
                                            )}
                                        </div>
                                        {fileName && (
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setFileName(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Supprimer le fichier
                                            </button>
                                        )}
                                    </div>

                                    <div className="pt-6">
                                        <Button
                                            type="submit"
                                            className="w-full h-12 text-lg font-bold bg-[#D59B2B] hover:bg-[#b88622] text-white shadow-lg hover:shadow-xl transition-all"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-5 w-5" /> Envoyer ma demande
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-center text-xs text-slate-400 mt-4">
                                            En soumettant ce formulaire, vous acceptez que vos données soient traitées pour répondre à votre demande.
                                        </p>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* INFO BOTTOM */}
                <div className="mt-20 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto border-t border-slate-200 pt-12">

                    <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full shadow-sm text-[#D59B2B] border border-slate-100">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Email</h4>
                            <p className="text-slate-500 text-sm mt-1">
                                contact@gainable.fr<br />
                                <span className="text-xs text-slate-400">Réponse sous 24-48h</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full shadow-sm text-[#D59B2B] border border-slate-100">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">Support</h4>
                            <p className="text-slate-500 text-sm mt-1">
                                Via formulaire uniquement<br />
                                <span className="text-xs text-slate-400">Pour assurer un meilleur suivi</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
