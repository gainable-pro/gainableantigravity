import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                    <CheckCircle2 className="w-12 h-12" />
                </div>

                <h1 className="text-3xl font-bold text-[#1F2D3D] mb-4">Paiement Validé !</h1>

                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                    Merci ! Votre abonnement est activé.<br />
                    Votre compte expert est désormais <span className="font-bold text-green-600">opérationnel</span>.
                </p>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-8 text-sm text-slate-500">
                    Une facture a été envoyée par email et est disponible dans votre espace pro.
                </div>

                <div className="space-y-4">
                    <Button asChild className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                        <Link href="/dashboard">
                            Accéder à mon Espace Pro
                        </Link>
                    </Button>
                    <Link href="/" className="block text-slate-400 hover:text-slate-600 text-sm">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}
