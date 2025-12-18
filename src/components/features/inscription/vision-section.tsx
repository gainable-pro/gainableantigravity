import Link from "next/link";
import { Check } from "lucide-react";

export function VisionSection() {
    return (
        <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/images/relation-pro-client.png")',
                    backgroundPosition: 'center 40%' // Ajustement pour centrer sur les mains
                }}
            />

            {/* Overlay Gradient/Dark */}
            <div className="absolute inset-0 z-10 bg-slate-900/80" />

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-4 flex justify-center">
                <div className="max-w-4xl w-full text-center space-y-8">

                    {/* Main Title */}
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-thin text-white uppercase tracking-wider">
                            NOTRE VISION
                        </h2>
                    </div>

                    {/* Description Text */}
                    <div className="text-slate-300 space-y-4 text-justify md:text-center leading-relaxed max-w-3xl mx-auto">
                        <p>
                            Le marché du bâtiment a profondément évolué. Entre les publicités coûteuses,
                            les avis en ligne, les campagnes Google, les aides gouvernementales détournées
                            et les entreprises éphémères, il devient difficile pour les artisans sérieux de se démarquer.
                        </p>
                        <p>
                            À cela s'ajoutent les plateformes traditionnelles de mise en relation qui revendent
                            souvent les mêmes leads à plusieurs prestataires, générant une concurrence centrée
                            uniquement sur le prix, au détriment de la qualité.
                        </p>
                    </div>

                    {/* Highlights Box */}
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 text-left max-w-2xl mx-auto shadow-2xl relative overflow-hidden group">
                        {/* Decorative side bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D59B2B]" />

                        <p className="font-bold text-white mb-4">
                            Gainable.fr est né pour répondre à un besoin simple :
                        </p>
                        <ul className="space-y-2 text-slate-200 text-sm md:text-base">
                            <li className="flex items-start gap-3">
                                <span className="text-[#D59B2B] mt-1">👉</span>
                                <span>valoriser les vrais professionnels,</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#D59B2B] mt-1">👉</span>
                                <span>apporter des contacts réellement qualifiés,</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#D59B2B] mt-1">👉</span>
                                <span>rétablir la confiance entre artisans et clients,</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#D59B2B] mt-1">👉</span>
                                <span>donner aux TPE/PME les outils pour rivaliser avec les grands acteurs du web.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
