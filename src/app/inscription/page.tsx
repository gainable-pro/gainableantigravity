import { SignUpForm } from "@/components/auth/signup-form";
import { Metadata } from 'next';
import { VisionSection } from "@/components/features/inscription/vision-section";

export const metadata: Metadata = {
    title: "Inscription Pro - Rejoignez le réseau Gainable.fr | Climatisation & RGE",
    description: "Devenez partenaire Gainable.fr. Développez votre activité d'installateur CVC, bureau d'étude ou diagnostiqueur avec des clients qualifiés et une visibilité premium.",
    openGraph: {
        title: "Inscription Pro - Rejoignez le réseau Gainable.fr",
        description: "Rejoignez le premier réseau dédié à la climatisation gainable. Pas de commissions, juste des clients qualifiés.",
        type: 'website',
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function InscriptionPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

            {/* NEW: Vision Section (Full Width) */}
            <VisionSection />

            <main className="flex-1 container mx-auto px-4 py-8" id="offres">
                <SignUpForm />
            </main>
        </div>
    );
}
