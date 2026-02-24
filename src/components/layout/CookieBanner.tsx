"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Delay showing to not overwhelm the user immediately
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[100] animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 z-0" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                            <Cookie className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Gestion des Cookies</h3>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="ml-auto text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label="Fermer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic.
                        En cliquant sur "Tout accepter", vous consentez à notre utilisation des cookies conformément à notre{" "}
                        <Link href="/politique-confidentialite" className="text-amber-600 hover:underline font-medium">
                            politique de confidentialité
                        </Link>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={handleAccept}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold flex-1"
                        >
                            Tout accepter
                        </Button>
                        <Button
                            onClick={handleDecline}
                            variant="outline"
                            className="border-slate-200 text-slate-600 hover:bg-slate-50 flex-1"
                        >
                            Refuser
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
