"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    User, 
    Lock, 
    ArrowRight, 
    Loader2, 
    TrendingUp, 
    Zap, 
    ShieldCheck, 
    Globe,
    ChevronLeft,
    DollarSign,
    Heart
} from "lucide-react";

export default function CommercialLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            if (res.ok) {
                router.push("/commercial");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.message || "Identifiants incorrects");
            }
        } catch (err) {
            setError("Erreur de connexion serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left Side: Visual & Marketing (60%) */}
            <div className="hidden md:flex md:w-[60%] relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1600" 
                        alt="Business Opportunity" 
                        className="w-full h-full object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/60 to-transparent" />
                </div>

                <div className="relative z-10 p-16 flex flex-col justify-between w-full">
                    <div>
                        <Link href="/" className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter mb-12">
                            <span className="text-[#D59B2B]">G</span>AINABLE.FR
                        </Link>
                        
                        <div className="max-w-xl">
                            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                                Votre Liberté, <br />
                                <span className="text-[#D59B2B]">Votre Réussite.</span>
                            </h2>
                            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                                Rejoignez le réseau national de consultants indépendants Gainable.fr et développez un business sans limites.
                            </p>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="w-10 h-10 bg-[#D59B2B]/20 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="text-[#D59B2B] w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-white uppercase text-xs tracking-widest">CA Non Plafonné</h4>
                                    <p className="text-slate-400 text-sm">Gagnez jusqu'à 11 000 € / mois selon vos performances.</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-10 h-10 bg-[#D59B2B]/20 rounded-xl flex items-center justify-center">
                                        <Heart className="text-[#D59B2B] w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-white uppercase text-xs tracking-widest">Liberté Totale</h4>
                                    <p className="text-slate-400 text-sm">Zéro hiérarchie. Vous êtes le maître de votre emploi du temps.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Consultant" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                            Déjà plus de <span className="text-white font-bold">25 consultants</span> actifs sur le territoire.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form (40%) */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 bg-white relative">
                {/* Mobile Header */}
                <div className="md:hidden mb-12">
                    <Link href="/" className="text-2xl font-black tracking-tighter">
                        <span className="text-[#D59B2B]">G</span>AINABLE.FR
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <div className="mb-10">
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Espace Commercial</h1>
                        <p className="text-slate-500 font-medium">Connectez-vous pour gérer vos prospects.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold border border-red-100 flex items-center gap-3">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Email Professionnel</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-300 group-focus-within:text-[#D59B2B] transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#D59B2B] outline-none transition-all text-slate-900 font-medium"
                                    placeholder="jean.dupont@gainable.fr"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Mot de passe</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-[#D59B2B] transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#D59B2B] outline-none transition-all text-slate-900 font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-5 w-5 rounded-lg border-2 border-slate-200 text-[#D59B2B] focus:ring-0 transition-all"
                                />
                                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Rester connecté</span>
                            </label>
                            <Link href="/contact" className="text-sm font-bold text-[#D59B2B] hover:underline">
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-3 py-5 px-6 rounded-2xl shadow-2xl text-lg font-black text-white bg-[#1F2D3D] hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ArrowRight className="h-6 w-6" />}
                            {loading ? "CONNEXION..." : "SE CONNECTER"}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <p className="text-center text-slate-500 font-medium">
                            Pas encore consultant ?{" "}
                            <Link href="/carrieres" className="text-[#D59B2B] font-black hover:underline ml-1">
                                Rejoignez le groupe &rarr;
                            </Link>
                        </p>
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/" className="text-slate-400 hover:text-slate-900 transition-colors inline-flex items-center gap-2 text-sm font-bold">
                            <ChevronLeft className="w-4 h-4" /> Retour au site public
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
