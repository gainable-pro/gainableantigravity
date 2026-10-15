import { Metadata } from "next";
import { Suspense } from "react";
import { DemoConfirmerContent } from "./DemoConfirmerContent";
import { MetaPixel } from "@/components/analytics/MetaPixel";

export const metadata: Metadata = {
    title: "Créneau Confirmé | Démonstration Gainable.fr",
    description: "Votre créneau de démonstration Gainable.fr a été enregistré avec succès.",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: "https://www.gainable.fr/demo-confirmer",
    },
};

export default function DemoConfirmerPage() {
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Meta Pixel strictly for /demo-confirmer (PageView + Lead) */}
            <MetaPixel trackLead={true} />

            <Suspense
                fallback={
                    <div className="w-full max-w-xl bg-white rounded-3xl p-10 shadow-xl border border-slate-200 text-center text-slate-500">
                        Chargement de votre confirmation...
                    </div>
                }
            >
                <DemoConfirmerContent />
            </Suspense>
        </div>
    );
}
