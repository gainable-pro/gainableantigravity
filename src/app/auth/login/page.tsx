"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                // Login successful
                // We don't need to fetch user manually here, the cookie is set.
                // We can let the dashboard redirect or handle state.
                // But generally good to refresh to update Header state.
                router.refresh();
                // Check if there is a callback URL or default to dashboard
                // For now default to dashboard
                router.push("/dashboard");
            } else {
                const data = await res.json();
                setError(data.message || "Identifiants incorrects.");
            }
        } catch (err) {
            setError("Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-center">
                    <Link href="/">
                        <img src="/logo.png" alt="Gainable.fr" className="h-12 mx-auto mb-6 object-contain" />
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight text-[#1F2D3D]">
                        Connexion Espace Pro
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Accédez à votre tableau de bord et gérez votre activité.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Adresse Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1"
                                placeholder="nom@entreprise.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Mot de passe
                            </label>
                            <div className="relative mt-1">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Checkbox id="remember-me" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                Se souvenir de moi
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="/auth/reset-password" className="font-medium text-[#D59B2B] hover:text-[#b88622]">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1F2D3D] hover:bg-[#2c3e50] text-white font-bold py-3"
                        >
                            {isLoading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </div>

                    <div className="text-center text-sm text-slate-500">
                        Pas encore de compte ?{" "}
                        <Link href="/inscription" className="font-medium text-[#D59B2B] hover:text-[#b88622]">
                            Créer un compte gratuitement
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
