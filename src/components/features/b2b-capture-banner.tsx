import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase } from "lucide-react";

interface B2bCaptureBannerProps {
    cityName: string;
    department?: string;
    countryCode?: string; // 'FR', 'CH', 'BE', 'MA'
}

export function B2bCaptureBanner({ cityName, department, countryCode }: B2bCaptureBannerProps) {
    // Customize text based on country if necessary
    const isMorocco = countryCode === 'MA';
    const isSwitzerland = countryCode === 'CH';
    
    let locationText = cityName;
    if (department && !isMorocco && !isSwitzerland) {
        locationText += ` (${department})`;
    }

    return (
        <div className="bg-[#1F2D3D] rounded-2xl p-8 md:p-12 shadow-2xl my-16 relative overflow-hidden group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D59B2B]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-[#D59B2B] text-white p-2 rounded-lg">
                            <Briefcase className="w-5 h-5" />
                        </span>
                        <span className="text-[#D59B2B] font-bold tracking-wider uppercase text-sm">
                            Espace Professionnels CVC
                        </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                        Vous êtes installateur climatisation à <span className="text-[#D59B2B] underline decoration-[#D59B2B]/30 underline-offset-4">{cityName}</span> ?
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                        Des particuliers recherchent actuellement un expert pour leur projet sur le secteur de {locationText}. 
                        Récupérez ces chantiers qualifiés sans commission et devenez l'artisan exclusif certifié Gainable de votre secteur.
                    </p>
                </div>

                <div className="w-full md:w-auto shrink-0 flex flex-col gap-3">
                    <Link href="/pourquoi-gainable" className="inline-block w-full">
                        <Button size="lg" className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold h-14 px-8 text-lg rounded-xl transition-transform hover:scale-105 shadow-xl">
                            Voir les avantages pros
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <p className="text-xs text-slate-400 text-center uppercase tracking-wider font-semibold">
                        Zéro abonnement caché
                    </p>
                </div>
            </div>
        </div>
    );
}
