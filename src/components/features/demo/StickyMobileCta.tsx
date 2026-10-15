"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

export function StickyMobileCta() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 350px
            if (window.scrollY > 350) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToForm = () => {
        const el = document.getElementById("reserver-creneau");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl md:hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
                <div className="text-left">
                    <div className="text-xs font-bold text-[#1F2D3D] leading-tight">Démo 15 min gratuite</div>
                    <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                        100% sans engagement
                    </span>
                </div>
                <Button
                    onClick={scrollToForm}
                    className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
                >
                    <Calendar className="w-4 h-4" />
                    <span>Réserver</span>
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
