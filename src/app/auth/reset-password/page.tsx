"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";



export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                const data = await res.json();
                setError(data.message || "Une erreur est survenue.");
            }
        } catch (err) {
            setError("Erreur de connexion. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">


            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                    <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-[#D59B2B] mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à l'accueil
                    </Link>

                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-[#1F2D3D]">Réinitialisation du mot de passe</h1>
                        <p className="text-slate-500 mt-2">
                            Entrez votre email pour recevoir un lien de réinitialisation.
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm font-medium text-left">
                                    Si un compte existe avec cet email, un lien vous a été envoyé.
                                </p>
                            </div>
                            <Button asChild className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200" variant="secondary">
                                <Link href="/">Retour à l'accueil</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email professionnel</label>
                                <Input
                                    type="email"
                                    required
                                    placeholder="nom@entreprise.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#1F2D3D] hover:bg-[#2c3e50] h-11 text-base"
                                disabled={isLoading}
                            >
                                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
                            </Button>
                        </form>
                    )}
                </div>
            </main>


        </div>
    );
}
