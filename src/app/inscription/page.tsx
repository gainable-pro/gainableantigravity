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
};

export default function InscriptionPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

            {/* NEW: Vision Section (Full Width) */}
            <VisionSection />

            <main className="flex-1 container mx-auto px-4 py-12" id="offres">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1F2D3D] mb-4 font-montserrat">
                            Rejoignez le réseau <span className="text-[#D59B2B]">Gainable.fr</span>
                        </h1>
                        <p className="text-lg text-slate-600">
                            Créez votre compte professionnel pour développer votre activité.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                        <SignUpForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
