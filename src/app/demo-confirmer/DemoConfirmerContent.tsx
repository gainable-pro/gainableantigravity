"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    CheckCircle2,
    Calendar as CalendarIcon,
    PhoneCall,
    Mail,
    ShieldCheck,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackMetaEvent } from "@/lib/meta-pixel";

export function DemoConfirmerContent() {
    const searchParams = useSearchParams();

    const name = searchParams?.get("name") || "";
    const date = searchParams?.get("date") || "";
    const slot = searchParams?.get("slot") || "";
    const phone = searchParams?.get("phone") || "";
    const email = searchParams?.get("email") || "";

    useEffect(() => {
        // Track confirmation on Meta Pixel when landing on this confirmation URL
        trackMetaEvent("Lead", {
            content_name: "Confirmation Démo Gainable",
            status: "confirmed",
        });
        if (date && slot) {
            trackMetaEvent("Schedule", {
                date,
                slot,
            });
        }
    }, [date, slot]);

    return (
        <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/90 relative overflow-hidden text-center space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#D59B2B] via-amber-400 to-[#1F2D3D]" />

            {/* Checkmark Icon */}
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 className="w-12 h-12" />
            </div>

            {/* Header / Thank You */}
            <div className="space-y-2">
                <span className="inline-block px-3.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    CRÉNEAU CONFIRMÉ
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2D3D]">
                    Merci {name || "!"}
                </h1>
                <p className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto font-medium">
                    Votre demande de démo a bien été enregistrée pour le :
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-[#1F2D3D] font-bold text-lg shadow-sm">
                    <CalendarIcon className="w-5 h-5 text-[#D59B2B]" />
                    <span className="capitalize">{date || "Prochainement"}</span>
                    {slot && <span className="text-[#D59B2B]">à {slot}</span>}
                </div>
            </div>

            {/* Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3">
                <div className="flex items-start gap-3">
                    <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-slate-700 text-sm leading-relaxed">
                        <strong>
                            Un de nos experts dédiés va vous contacter {phone ? <>au <span className="text-[#1F2D3D] font-bold">{phone}</span></> : "par téléphone"}
                        </strong>{" "}
                        afin de vous accompagner et vous faire découvrir la plateforme en direct.
                    </p>
                </div>
                {email && (
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-slate-700 text-sm leading-relaxed">
                            Une confirmation récapitulative a été envoyée à <strong>{email}</strong>.
                        </p>
                    </div>
                )}
                <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#D59B2B] shrink-0 mt-0.5" />
                    <p className="text-slate-600 text-xs">
                        Démonstration personnalisée de 15 min • 100% sans engagement • Réseau sélectif de confiance.
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                    asChild
                    variant="outline"
                    className="w-full sm:w-auto text-slate-600 hover:text-slate-900 border-slate-200 rounded-xl px-6 py-5 font-semibold"
                >
                    <Link href="/demo">
                        Programmer un autre créneau
                    </Link>
                </Button>
                <Button
                    asChild
                    className="w-full sm:w-auto bg-[#1F2D3D] hover:bg-slate-800 text-white rounded-xl px-6 py-5 font-semibold shadow-md"
                >
                    <Link href="/">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour au site
                    </Link>
                </Button>
            </div>
        </div>
    );
}
