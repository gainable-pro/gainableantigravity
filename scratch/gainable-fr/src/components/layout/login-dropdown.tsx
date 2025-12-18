"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LogOut, LayoutDashboard, ExternalLink, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function LoginDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userSlug, setUserSlug] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                // Fetch user data immediately after login to get slug
                const meRes = await fetch("/api/auth/me");
                if (meRes.ok) {
                    const data = await meRes.json();
                    if (data.user) {
                        setIsLoggedIn(true);
                        setUserSlug(data.user.expert?.slug || null);
                    }
                }
                setIsOpen(false);
                router.push("/dashboard");
                router.refresh();
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

    const handleLogout = async () => {
        setIsLoggedIn(false);
        setUserSlug(null);
        setIsOpen(false);
        router.push("/");
    };

    // Check session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setIsLoggedIn(true);
                        setEmail(data.user.email);
                        setUserSlug(data.user.expert?.slug || null);
                    }
                }
            } catch (error) {
                console.error("Session check failed", error);
            }
        };
        checkSession();
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant={isLoggedIn ? "outline" : "default"}
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={isLoggedIn ? "gap-2 border-[#1F2D3D] text-[#1F2D3D]" : ""}
            >
                {isLoggedIn ? (
                    <>
                        <UserCircle className="w-4 h-4" />
                        Mon espace
                    </>
                ) : (
                    "Espace Pro"
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 top-[120%] w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-6 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* LOGGED IN STATE */}
                    {isLoggedIn ? (
                        <div className="space-y-4">
                            <div className="pb-4 border-b border-slate-100">
                                <p className="font-medium text-[#1F2D3D]">Bonjour Expert</p>
                                <p className="text-xs text-slate-500">{email}</p>
                            </div>
                            <div className="space-y-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 h-auto py-2 px-3 hover:bg-slate-50 text-slate-700"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    <LayoutDashboard className="w-4 h-4 text-[#D59B2B]" />
                                    Accéder à mon Dashboard
                                </Button>
                                {userSlug && (
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-2 h-auto py-2 px-3 hover:bg-slate-50 text-slate-700"
                                        onClick={() => router.push(`/pro/${userSlug}`)}
                                    >
                                        <ExternalLink className="w-4 h-4 text-[#D59B2B]" />
                                        Voir ma page publique
                                    </Button>
                                )}
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Me déconnecter
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* LOGGED OUT STATE - LOGIN FORM */
                        <form onSubmit={handleLogin} className="space-y-4">
                            <h3 className="font-bold text-[#1F2D3D] text-lg mb-4">Connexion Pro</h3>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-md">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <Input
                                    type="email"
                                    placeholder="nom@entreprise.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-9"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-9 pr-8"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember-me" />
                                <label
                                    htmlFor="remember-me"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600"
                                >
                                    Rester connecté
                                </label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#1F2D3D] hover:bg-[#2c3e50] text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? "Connexion..." : "Se connecter"}
                            </Button>

                            <div className="space-y-2 text-center pt-2">
                                <div>
                                    <Link href="/auth/reset-password" className="text-xs text-[#D59B2B] hover:underline">
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
                                <div className="text-xs text-slate-600">
                                    Pas encore de compte ?{" "}
                                    <Link href="/inscription" className="text-[#D59B2B] font-medium hover:underline">
                                        Créer un compte
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
