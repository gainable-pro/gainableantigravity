import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
    Check, AlertTriangle, ShieldCheck, Search, Users,
    Smartphone, MapPin, Globe, Star, TrendingUp,
    Calendar, MousePointerClick, Lock, FileText,
    LayoutDashboard, Phone, CheckCircle2, Briefcase, Building2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EspaceProPage() {
    return (
        <div className="flex min-h-screen flex-col font-sans text-[#1F2D3D]">


            {/* BLOCK 1: VISION (Hero) */}
            <section className="relative py-20 bg-[#1F2D3D] text-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <Image
                        src="/espace_pro_vision_1765140841780.png"
                        alt="Artisan expert gainable"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <div className="container relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light font-montserrat mb-6 uppercase leading-tight">
                            NOTRE VISION
                        </h1>
                        <p className="text-lg text-slate-200 mb-6 leading-relaxed">
                            Le marché du bâtiment a profondément évolué. Entre les publicités coûteuses, les avis en ligne, les campagnes Google, les aides gouvernementales détournées et les entreprises éphémères, il devient difficile pour les artisans sérieux de se démarquer.
                        </p>
                        <p className="text-lg text-slate-200 mb-6 leading-relaxed">
                            À cela s’ajoutent les plateformes traditionnelles de mise en relation qui revendent souvent les mêmes leads à plusieurs prestataires, générant une concurrence centrée uniquement sur le prix, au détriment de la qualité.
                        </p>
                        <div className="bg-white/10 p-8 rounded-xl border-l-4 border-[#D59B2B] mb-8 shadow-md">
                            <p className="font-bold text-white text-xl mb-4">Gainable.fr est né pour répondre à un besoin simple :</p>
                            <ul className="space-y-3 text-lg text-slate-100 list-disc pl-6 leading-relaxed">
                                <li>valoriser les vrais professionnels,</li>
                                <li>apporter des contacts réellement qualifiés,</li>
                                <li>rétablir la confiance entre artisans et clients,</li>
                                <li>donner aux TPE/PME les outils pour rivaliser avec les grands acteurs du web.</li>
                            </ul>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/pro/inscription">
                                <Button className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold py-6 px-8 rounded-full text-lg shadow-lg">
                                    Devenir Expert Gainable
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 2: TARIFS (Previously Block 6) */}
            <section className="py-24 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2D3D] mb-4">
                            Des formules simples et <span className="text-[#D59B2B]">transparentes</span>
                        </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Choisissez la formule adaptée à vos besoins. Aucun frais caché, aucun engagement de durée pour l'offre mensuelle.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* CARD 1: BUREAU D'ÉTUDE (Left) */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all relative flex flex-col h-full">
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1F2D3D] mb-2">Bureau d'étude</h3>
                                <div className="text-emerald-600 font-bold text-2xl mb-4">Gratuit</div>
                                <div className="inline-block bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full mb-4 border border-slate-200">
                                    Inscription contrôlée – réservée aux BE
                                </div>
                                <p className="text-slate-500 text-sm">
                                    Solution de visibilité et de prescription pour les bureaux d'études.
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {[
                                    "Visibilité sur Gainable.fr",
                                    "Page dédiée",
                                    "Création 10 articles / mois (Optimisé SEO)",
                                    "Zone d'intervention possible élargie sur toute la France",
                                    "SEO standard",
                                    "Leads & contacts illimités",
                                    "Accès codes APE dédiés BE",
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link href="/inscription" className="w-full">
                                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-6 font-semibold">
                                        S'inscrire gratuitement
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* CARD 2: SOCIÉTÉ EXPERTE CVC (Center - Highlighted) */}
                        <div className="bg-white rounded-2xl p-8 border-2 border-[#D59B2B] shadow-2xl relative flex flex-col h-full transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#D59B2B] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md whitespace-nowrap">
                                Recommandé - Offre Premium
                            </div>

                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#D59B2B] flex items-center justify-center text-white mb-4">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1F2D3D] mb-2">Société experte CVC</h3>
                                <div className="mb-4">
                                    <span className="text-[#D59B2B] font-bold text-3xl">650 €</span> <span className="text-sm text-slate-500 font-normal">/ an HT</span>
                                    <div className="text-xs text-slate-500 mt-2 font-medium">
                                        Abonnement annuel reconductible.<br/>
                                        Résiliation 1 mois avant la date d'anniversaire.
                                    </div>
                                </div>
                                <div className="text-sm font-bold text-white mb-4 bg-[#D59B2B] inline-block px-3 py-1 rounded-sm shadow-sm">
                                    🟨 Expert Gainable certifié
                                </div>
                                <p className="text-slate-500 text-sm">
                                    L'offre de référence pour les installateurs clim/gainable. Visibilité maximale.
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {[
                                    "Priorité SEO réelle et mesurable",
                                    "Mise en avant Premium",
                                    "Création 10 articles / mois (Optimisé SEO)",
                                    "Badge Expert visible",
                                    "Leads qualifiés",
                                    "Aucun intermédiaire",
                                    "Le client choisit lui-même",
                                    "Toutes fonctionnalités incluses"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-bold">
                                        <CheckCircle2 className="w-5 h-5 text-[#D59B2B] shrink-0" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link href="/inscription" className="w-full">
                                    <Button className="w-full bg-[#D59B2B] hover:bg-[#b88622] text-white rounded-xl py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all">
                                        Choisir l'offre Expert
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* CARD 3: DIAGNOSTIQUEUR (Right) */}
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all relative flex flex-col h-full">
                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mb-4">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1F2D3D] mb-2">Diagnostiqueur</h3>
                                <div className="text-4xl font-bold text-gray-900 mb-2">380 € <span className="text-lg font-normal text-gray-500">/ an HT</span></div>
                                <div className="text-xs text-slate-500 mt-2 font-medium mb-4">
                                    Abonnement annuel reconductible.<br/>
                                    Résiliation 1 mois avant la date d'anniversaire.
                                </div>
                                <p className="text-slate-500 text-sm">
                                    Pour les diagnostiqueurs CVC / Audit / Conseil.
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {[
                                    "Visibilité locale sur Gainable.fr",
                                    "Page PRO dédiée",
                                    "Création 10 articles / mois (Optimisé SEO)",
                                    "Carte interactive",
                                    "Leads & contacts illimités",
                                    "Missions de diagnostic",
                                    "Aucune revente de contact",
                                    "Le client choisit lui-même"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link href="/inscription" className="w-full">
                                    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-6 font-semibold">
                                        Choisir l'offre Diagnostiqueur
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* BLOCK 4: LE PROBLÈME (Alert style - Moved Down) */}
            <section className="py-16 bg-amber-50 border-b border-amber-100">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="bg-[#D59B2B]/10 p-6 rounded-full shrink-0">
                            <AlertTriangle className="w-12 h-12 text-[#D59B2B]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[#1F2D3D] mb-4">Le problème des plateformes traditionnelles</h2>
                            <p className="text-lg text-slate-700 mb-2">
                                Le modèle classique génère souvent des leads transmis à plusieurs artisans, ce qui :
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-700 mb-4 font-medium">
                                <li>dévalorise le travail,</li>
                                <li>concentre la concurrence sur le prix,</li>
                                <li>fait perdre du temps,</li>
                                <li>ne garantit pas des contacts sérieux.</li>
                            </ul>
                            <p className="font-bold text-[#1F2D3D] text-lg">
                                Avec Gainable.fr, ce fonctionnement change totalement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 5: L'ALTERNATIVE (Features - Moved Down) */}
            <section className="py-24 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1F2D3D] mb-4">
                            L’alternative <span className="text-[#D59B2B]">Gainable.fr</span>
                        </h2>
                        <p className="text-xl text-slate-500">Simple, transparente, efficace.</p>
                    </div>

                    <div className="space-y-12">
                        {/* Feature 1: Pas de leads revendus */}
                        <div className="bg-[#F0F9FF] p-8 rounded-2xl border border-blue-100 flex flex-col md:flex-row gap-8 items-center shadow-sm">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shrink-0 text-blue-500 shadow-sm border border-blue-100">
                                <Lock className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#1F2D3D] mb-3 flex items-center gap-2">
                                    <Check className="w-6 h-6 text-[#D59B2B]" /> Pas de leads revendus
                                </h3>
                                <p className="text-slate-600 leading-relaxed italic">
                                    « Contrairement aux plateformes traditionnelles, nous ne revendons pas de leads. Sur Gainable.fr, c’est le client qui choisit librement à quel(s) artisan(s) envoyer sa demande. Il peut contacter un seul professionnel ou plusieurs, selon ses besoins. Aucun système d’enchère, aucune revente, aucune redistribution : la mise en relation reste simple, directe et totalement transparente. »
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Feature 2: Transparence */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold text-[#1F2D3D] mb-3 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#D59B2B]" /> Transparence totale
                                </h3>
                                <p className="text-slate-600 mb-4">Les informations du client ne sont jamais cachées. Il peut :</p>
                                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                                    <li>appeler directement un artisan par téléphone,</li>
                                    <li>ou formuler une demande via le site.</li>
                                </ul>
                            </div>

                            {/* Feature 3: Demandes qualifiées */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold text-[#1F2D3D] mb-3 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#D59B2B]" /> Des demandes mieux qualifiées
                                </h3>
                                <p className="text-slate-600 mb-2">Pour éviter les contacts curieux, le client renseigne la surface, le nombre de pièces, l’adresse, l’email, le numéro de téléphone.</p>
                                <p className="font-medium text-[#1F2D3D] text-sm mt-2">👉 Objectif : réduire les demandes non sérieuses et fournir aux artisans des clients réellement motivés.</p>
                            </div>

                            {/* Feature 4: Professionnels valorisés */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold text-[#1F2D3D] mb-3 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#D59B2B]" /> Des professionnels valorisés
                                </h3>
                                <p className="text-slate-600">
                                    Les artisans qualifiés, déclarés et assurés obtiennent le badge Expert Gainable, gage de confiance pour le client.
                                </p>
                            </div>

                            {/* Feature 5: Visibilité */}
                            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold text-[#1F2D3D] mb-3 flex items-center gap-2">
                                    <Check className="w-5 h-5 text-[#D59B2B]" /> Une visibilité supplémentaire
                                </h3>
                                <p className="text-slate-600 mb-2">Gainable.fr devient un complément essentiel à votre présence :</p>
                                <p className="text-sm font-medium text-slate-700 bg-slate-50 p-2 rounded">Google • Réseaux sociaux • Avis clients • Bouche-à-oreille <br />+ Votre page dédiée optimisée.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-[#1F2D3D] text-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold font-montserrat text-center mb-16 text-white">
                        Avantages de nos experts
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Globe, title: "Page professionnelle dédiée" },
                            { icon: Star, title: "Optimisée pour le SEO" }, // Split for layout balance
                            { icon: ShieldCheck, title: "Badge « Expert Gainable »" },
                            { icon: Users, title: "Leads illimités & 100 % gratuits" },
                            { icon: Phone, title: "Mise en relation directe" },
                            { icon: MapPin, title: "Présence carte interactive" },
                            { icon: TrendingUp, title: "Aucun pourcentage, aucune commission" },
                            { icon: Lock, title: "Plus de crédibilité et de confiance / Support inclus" } // Combined to fit 8 slots or similar
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 duration-300">
                                <item.icon className="w-10 h-10 text-[#D59B2B] mb-4" />
                                <h4 className="font-bold text-lg leading-tight text-[#1F2D3D]">{item.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BLOCK 7: CONCLUSION */}
            <section className="py-24 bg-slate-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <img src="/espace_pro_conclusion_1765140856043.png" alt="Rejoignez les experts gainable" className="w-full h-auto rounded-2xl shadow-xl" />
                            {/* Decorative badge */}
                            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-slate-100 hidden md:block">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1F2D3D]">Boostez votre activité</p>
                                        <p className="text-xs text-slate-500">Dès aujourd'hui</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1F2D3D] mb-6">
                                Plus qu'une plateforme, <span className="text-[#D59B2B]">un partenaire</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Gainable.fr n’est pas une plateforme de leads comme les autres. C’est un outil de visibilité, un générateur de confiance, et un accélérateur d’activité pour les professionnels qualifiés.
                            </p>
                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#D59B2B] rounded-full"></div>
                                    <span className="font-medium text-[#1F2D3D]">Pas de leads vendus</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#D59B2B] rounded-full"></div>
                                    <span className="font-medium text-[#1F2D3D]">Des clients vraiment motivés</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#D59B2B] rounded-full"></div>
                                    <span className="font-medium text-[#1F2D3D]">Une visibilité renforcée</span>
                                </div>
                            </div>
                            <Link href="/pro/inscription">
                                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg">
                                    Devenir Expert Gainable
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer is global */}
        </div>
    );
}
