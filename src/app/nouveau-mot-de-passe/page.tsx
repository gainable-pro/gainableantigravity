"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

function NewPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (password.length < 8) {
            setError("Le mot de passe doit faire au moins 8 caractères.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password })
            });

            if (res.ok) {
                setIsSuccess(true);
                // Redirect after 3s
                setTimeout(() => {
                    router.push("/?login=true");
                }, 3000);
            } else {
                const data = await res.json();
                setError(data.message || "Une erreur est survenue.");
            }
        } catch (err) {
            setError("Erreur de connexion.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl">
                <AlertCircle className="w-10 h-10 mx-auto mb-4" />
                <h1 className="font-bold text-lg">Lien invalide</h1>
                <p>Le lien de réinitialisation est manquant ou incorrect.</p>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/auth/reset-password">Renvoyer un lien</Link>
                </Button>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="text-center p-8 bg-green-50 text-green-700 rounded-xl animate-in fade-in zoom-in">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h1 className="font-bold text-2xl mb-2">Mot de passe modifié !</h1>
                <p>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
                <div className="mt-6">
                    <Button asChild className="bg-[#1F2D3D] text-white hover:bg-[#2c3e50]">
                        <Link href="/">Se connecter</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-[#1F2D3D]">Nouveau mot de passe</h1>
                <p className="text-slate-500 mt-2">
                    Choisissez un mot de passe sécurisé.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Confirmer le mot de passe</label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-11"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#1F2D3D] hover:bg-[#2c3e50] h-11 text-base"
                    disabled={isLoading}
                >
                    {isLoading ? "Enregistrement..." : "Modifier mon mot de passe"}
                </Button>
            </form>
        </div>
    );
}

export default function NewPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <Suspense fallback={<div>Chargement...</div>}>
                    <NewPasswordForm />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
