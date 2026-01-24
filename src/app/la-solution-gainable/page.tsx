"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Thermometer, Wind, Smartphone, Cpu, Activity, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SolutionGainablePage() {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1F2D3D]">

            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 z-0 opacity-20">
                    {/* Abstract background or a nice gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-[#1F2D3D]" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-block mb-6 px-4 py-1.5 bg-[#D59B2B]/20 text-[#D59B2B] font-bold rounded-full text-sm uppercase tracking-wider border border-[#D59B2B]/30">
                        La Climatisation Invisible
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                        La Solution Gainable :<br />
                        <span className="text-[#D59B2B]">Le Confort Absolu</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                        Esthétique, silence et performance. Découvrez pourquoi le gainable est devenu le standard du confort pour les maisons modernes et la rénovation haut de gamme.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild className="bg-[#D59B2B] hover:bg-[#b88622] text-white text-lg px-8 py-6 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
                            <Link href="/trouver-installateur">Trouver un expert Gainable</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 2. ZIG-ZAG CONTENT BLOCKS */}
            <div className="flex flex-col">

                {/* BLOCK A: FONCTIONNEMENT */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-slate-100 group">
                            <Image src="/assets/images/solution/gainable_unit_attic.png" alt="Unité intérieure gainable installée dans les combles" fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-6">
                                Comment ça marche ?
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Le principe du gainable est simple : <strong>tout est caché</strong>. Une unité centrale puissante est installée dans les combles ou un faux-plafond. Elle est reliée à un réseau de gaines isolées qui distribuent l'air chaud ou froid dans chaque pièce.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-[#D59B2B] shrink-0" />
                                    <span><strong>Invisible :</strong> Seules des grilles de diffusion discrètes sont visibles.</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-[#D59B2B] shrink-0" />
                                    <span><strong>Silencieux :</strong> Le moteur est éloigné des pièces de vie.</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <CheckCircle2 className="w-6 h-6 text-[#D59B2B] shrink-0" />
                                    <span><strong>Uniforme :</strong> La chaleur ou la fraicheur est répartie de manière homogène.</span>
                                </li>
                            </ul>
                            <Button asChild variant="outline" className="border-[#1F2D3D] text-[#1F2D3D] hover:bg-slate-50">
                                <Link href="/trouver-installateur">Demander une étude →</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* BLOCK B: ETUDE & DIMENSIONNEMENT - Keeping Existing Image */}
                <section className="py-20 px-6 bg-slate-50">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-1">
                            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-6">
                                L'importance du dimensionnement
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Un système gainable ne s'installe pas au hasard. Une <strong>étude technique</strong> est indispensable pour calculer les débits d'air et les charges thermiques pièce par pièce.
                            </p>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                                <h4 className="font-bold text-[#1F2D3D] mb-2 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-red-500" /> Les risques d'un mauvais calcul :
                                </h4>
                                <ul className="space-y-2 text-slate-600 text-sm">
                                    <li>• Bruit de souffle désagréable (vitesse d'air trop élevée).</li>
                                    <li>• Inconfort (zones trop chaudes ou trop froides).</li>
                                    <li>• Surconsommation électrique.</li>
                                </ul>
                            </div>
                            <p className="text-slate-600 mb-6">
                                C'est pourquoi Gainable.fr ne référencie que des experts capables de réaliser ces études ou de travailler avec des bureaux d'études.
                            </p>
                            <Button asChild className="bg-[#1F2D3D] text-white hover:bg-[#2c3e50]">
                                <Link href="/trouver-installateur">Trouver un expert qualifié</Link>
                            </Button>
                        </div>
                        <div className="order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
                            <Image src="/block-hvac-engineer-v2.png" alt="Ingénieur CVC réalisant une étude" fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </section>

                {/* BLOCK C: MATERIEL & HYPER HEATING */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-slate-100 group">
                            <Image src="/assets/images/solution/heat_pump_outdoor.png" alt="Pompe à chaleur extérieure premium" fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-6">
                                Les meilleures marques & technologies
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Nous recommandons l'installation de marques reconnues pour leur fiabilité et leur disponibilité de pièces détachées (Daikin, Mitsubishi Electric, Hitachi, Atlantic...).
                            </p>

                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-4 flex items-center gap-2">
                                <Thermometer className="w-6 h-6 text-[#D59B2B]" /> Technologie "Hyper Heating"
                            </h3>
                            <p className="text-slate-600 mb-8">
                                Pour les régions froides, nous privilégions les technologies type <strong>Hyper Heating</strong> ou <strong>Grand Froid</strong>. Ces systèmes garantissent un chauffage performant même par -15°C ou -25°C extérieur, sans perte de puissance majeure.
                            </p>

                            <Button asChild variant="outline" className="border-[#1F2D3D] text-[#1F2D3D] hover:bg-slate-50">
                                <Link href="/trouver-installateur">Recevoir des devis comparatifs</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* BLOCK D: REGULATION (AIRZONE / KOOLNOVA) */}
                <section className="py-20 px-6 bg-slate-50">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-1">
                            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-6">
                                Le pilotage pièce par pièce (Zonification)
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Fini le thermostat unique dans le couloir ! Avec les systèmes de régulation modernes (type <strong>Airzone</strong> ou <strong>Koolnova</strong>), vous contrôlez la température de chaque chambre indépendamment.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex gap-3 text-slate-700">
                                    <Smartphone className="w-6 h-6 text-[#D59B2B] shrink-0" />
                                    <span><strong>Connecté :</strong> Pilotez votre chauffage à distance depuis votre smartphone.</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <Cpu className="w-6 h-6 text-[#D59B2B] shrink-0" />
                                    <span><strong>Intelligent :</strong> Le système adapte la puissance de la machine en fonction du nombre de zones à chauffer, réalisant de vraies économies.</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <Wind className="w-6 h-6 text-[#D59B2B] shrink-0" />
                                    <span><strong>VMC & CTA :</strong> Peut être couplé à votre ventilation double flux pour une gestion totale de l'air.</span>
                                </li>
                            </ul>

                            <Button asChild className="bg-[#1F2D3D] text-white hover:bg-[#2c3e50]">
                                <Link href="/trouver-installateur">Je veux un système connecté</Link>
                            </Button>
                        </div>
                        <div className="order-2 relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-white group">
                            <Image src="/assets/images/solution/smart_thermostat_airzone.png" alt="Thermostat intelligent et application smartphone" fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </section>

                {/* BLOCK E: QUALITE DE L'AIR */}
                <section className="py-20 px-6 bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative h-[300px] rounded-2xl overflow-hidden shadow-lg bg-slate-50 group">
                            <Image src="/assets/images/solution/air_quality_sensor.png" alt="Capteur qualité d'air intérieur" fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="inline-block mb-4 px-3 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-full text-xs uppercase tracking-wider">
                                Santé & Bien-être
                            </div>
                            <h2 className="text-3xl font-bold text-[#1F2D3D] mb-6">
                                Qualité de l'air intérieur
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Votre système de climatisation peut aussi veiller sur votre santé. Des solutions comme le <strong>AirQ Sensor</strong> analysent en temps réel la qualité de l'air que vous respirez.
                            </p>
                            <p className="text-slate-600 mb-8">
                                En cas de détection de polluants ou d'air vicié, le système peut activer la purification par ionisation pour neutraliser bactéries et allergènes.
                            </p>

                        </div>
                    </div>
                </section>

            </div>

            {/* 3. FINAL CTA */}
            <section className="py-24 px-6 bg-[#D59B2B]">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        Prêt à passer au confort supérieur ?
                    </h2>
                    <p className="text-xl text-white/90 mb-10 font-medium">
                        Ne confiez pas votre projet à n'importe qui. Gainable.fr sélectionne pour vous les meilleurs experts CVC.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button asChild className="bg-white text-[#D59B2B] hover:bg-slate-100 text-xl px-10 py-8 rounded-full font-bold shadow-xl">
                            <Link href="/trouver-installateur">Trouver mon installateur</Link>
                        </Button>
                        <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 text-xl px-10 py-8 rounded-full font-bold">
                            <Link href="/pourquoi-gainable">Pourquoi Gainable.fr ?</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
