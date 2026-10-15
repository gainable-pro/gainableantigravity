import { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import {
    CheckCircle2,
    ShieldCheck,
    Star,
    Users,
    AlertTriangle,
    TrendingUp,
    Award,
    MapPin,
    XCircle,
    Check,
    PhoneCall,
    Sparkles,
    Calendar,
    Clock,
    Lock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PourquoiGainableVideoPlayer } from "@/components/features/video/PourquoiGainableVideoPlayer";
import { DemoBookingWidget } from "@/components/features/demo/DemoBookingWidget";
import { StickyMobileCta } from "@/components/features/demo/StickyMobileCta";
import { MetaPixel } from "@/components/analytics/MetaPixel";

export const metadata: Metadata = {
    title: "Démonstration Pro Gainable.fr | Réservez votre créneau en direct",
    description: "Découvrez en 15 minutes comment rejoindre le réseau de référence en climatisation gainable et génie climatique. Zéro commission, contacts directs et qualifiés.",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: "https://www.gainable.fr/demo",
    },
};

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1F2D3D] pb-16 md:pb-0">
            {/* Meta Pixel strictly for /demo */}
            <MetaPixel />

            {/* Sticky Mobile Conversion Bar */}
            <StickyMobileCta />

            {/* 1. HERO SECTION (Laser-focused for Meta Ads Conversion) */}
            <section className="relative pt-10 md:pt-14 pb-16 px-4 sm:px-6 bg-gradient-to-b from-slate-50 via-amber-50/20 to-white overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    {/* Top Trust Badge */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-amber-300/80 rounded-full text-[#1F2D3D] text-xs sm:text-sm font-bold shadow-sm">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D59B2B] animate-ping" />
                            <span>RÉSEAU SÉLECTIF D’EXPERTS DU GÉNIE CLIMATIQUE & PAC</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1F2D3D] mt-4 mb-4 tracking-tight leading-tight max-w-4xl mx-auto">
                            Rejoignez le 1<sup>er</sup> réseau qui valorise les vrais pros de la climatisation
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
                            Fini les plateformes de devis qui revendent le même lead à 5 concurrents.
                            Découvrez lors d'une <strong className="text-[#1F2D3D]">démonstration de 15 minutes</strong> comment Gainable.fr rétablit une relation directe et saine avec des clients qualifiés.
                        </p>
                    </div>

                    {/* VIDEO EN AVANT (Grand format vertical sur mobile, 16:9 sur desktop) */}
                    <div className="my-6 sm:my-8 max-w-4xl mx-auto">
                        <PourquoiGainableVideoPlayer />
                    </div>

                    {/* FORMULAIRE DE DEMANDE DE DÉMO DIRECTEMENT SOUS LA VIDÉO */}
                    <div className="mt-10 max-w-3xl mx-auto">
                        <DemoBookingWidget id="reserver-creneau" />
                    </div>
                </div>
            </section>

            {/* 2. ORIGINE & CONSTAT TERRAIN */}
            <section className="py-20 px-6 bg-white border-t border-slate-100">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                        <div>
                            <span className="text-[#D59B2B] text-sm font-bold uppercase tracking-wider block mb-2">
                                Une rupture avec les pratiques actuelles
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1F2D3D] mb-6 leading-tight">
                                Gainable.fr est né d’un constat terrain que vous vivez tous les jours
                            </h2>
                            <div className="text-base sm:text-lg text-slate-600 leading-relaxed space-y-4 font-medium">
                                <p>
                                    Gainable.fr n’a pas été créé par des algorithmes ou une agence marketing.
                                    Il est né de la réalité des chantiers, partagée chaque jour par les installateurs de climatisation,
                                    les bureaux d’études et les professionnels qualifiés.
                                </p>
                                <p>
                                    Le modèle des courtiers en leads à 40 € revendus à la chaîne a détruit la confiance des clients et dévalorisé votre métier. Nous avons fait exactement l'inverse.
                                </p>
                            </div>
                        </div>

                        <div className="relative h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                            <Image
                                src="/images/constat-terrain.png"
                                alt="Professionnel du génie climatique en intervention"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* The Two Realities */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* The Bad Reality */}
                        <div className="bg-orange-50/40 p-8 rounded-3xl border border-orange-100">
                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-2">
                                <MapPin className="text-orange-500 w-5 h-5" /> Ce que nous avons refusé de cautionner :
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700 text-sm sm:text-base">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des clients perdus face à des devis incompréhensibles et bâclés</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 text-sm sm:text-base">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des installations gainables sans dimensionnement ni étude acoustique</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 text-sm sm:text-base">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des coordonnées de clients revendues simultanément à 5 installateurs</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 text-sm sm:text-base">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des pros qualifiés tirés vers le bas par une guerre des prix déloyale</span>
                                </li>
                            </ul>
                        </div>

                        {/* The Good Reality */}
                        <div className="bg-blue-50/40 p-8 rounded-3xl border border-blue-100">
                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-2">
                                <Users className="text-blue-500 w-5 h-5" /> Ce que nous mettons en valeur :
                            </h3>
                            <div className="mb-4 font-semibold text-slate-800 text-sm sm:text-base">
                                Des entreprises sérieuses, fiables et engagées :
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700 text-sm sm:text-base">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Correctement assurées avec décennale vérifiée</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 text-sm sm:text-base">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Respectant scrupuleusement les règles de l'art du CVC</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 text-sm sm:text-base">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>Bénéficiant d'une exclusivité et visibilité renforcée sur leur secteur</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 text-sm sm:text-base">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>En contact direct avec le propriétaire, sans commission intermédiaire</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. CLARTE: CE QUE NOUS SOMMES VS CE QUE NOUS NE SOMMES PAS */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-[#D59B2B] text-sm font-bold uppercase tracking-wider block mb-2">
                            Transparence Totale
                        </span>
                        <h2 className="text-3xl font-extrabold text-[#1F2D3D]">
                            Remettons de la clarté dans notre collaboration
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
                        {/* LEFT: CE QUE NOUS NE SOMMES PAS */}
                        <div className="bg-white p-8 sm:p-10 border-b md:border-b-0 md:border-r border-slate-200">
                            <h3 className="text-xl font-bold text-red-600 mb-8 flex items-center gap-3">
                                <XCircle className="w-6 h-6" /> Ce que Gainable.fr N'EST PAS
                            </h3>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-slate-900">Un vendeur de leads partagés</div>
                                        <div className="text-sm text-slate-500">Pas de lead vendu à la découpe à 5 installateurs qui s'appellent en même temps.</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-slate-900">Un comparateur de prix discount</div>
                                        <div className="text-sm text-slate-500">Nous ne valorisons pas le moins cher, mais le travail bien fait et conforme.</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-slate-900">Un annuaire automatique ouvert à tous</div>
                                        <div className="text-sm text-slate-500">Chaque dossier fait l'objet d'un contrôle rigoureux par notre équipe.</div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* RIGHT: CE QUE NOUS SOMMES */}
                        <div className="bg-[#1F2D3D] p-8 sm:p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D59B2B] rounded-full blur-[100px] opacity-15 pointer-events-none" />

                            <h3 className="text-xl font-bold text-[#D59B2B] mb-8 flex items-center gap-3 relative z-10">
                                <CheckCircle2 className="w-6 h-6" /> Ce que Gainable.fr EST
                            </h3>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex items-start gap-4">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-white">Une mise en relation directe & exclusive</div>
                                        <div className="text-sm text-slate-300">Le client trouve votre profil et vous contacte directement. Vos marges restent les vôtres.</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-white">Un label de confiance vérifié</div>
                                        <div className="text-sm text-slate-300">SIRET, assurance décennale et qualifications vérifiées pour rassurer le client final.</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-white">Un écosystème SEO puissant</div>
                                        <div className="text-sm text-slate-300">Une page dédiée sur votre zone pour capter les propriétaires en recherche active de climatisation.</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. COMMENT SE PASSE LA DÉMO (Reassurance Section) */}
            <section className="py-20 px-6 bg-white border-t border-slate-100">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-[#D59B2B] text-sm font-bold uppercase tracking-wider block mb-2">
                            Simplicité & Rapidité
                        </span>
                        <h2 className="text-3xl font-extrabold text-[#1F2D3D]">
                            Comment se déroule votre démonstration ?
                        </h2>
                        <p className="text-slate-600 mt-2 max-w-xl mx-auto">
                            15 minutes au téléphone ou en visio avec un expert dédié à votre secteur géographique.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center relative">
                            <div className="w-12 h-12 bg-[#D59B2B] text-white font-extrabold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                1
                            </div>
                            <h4 className="font-bold text-[#1F2D3D] text-lg mb-2">Choix de votre créneau</h4>
                            <p className="text-sm text-slate-600">
                                Vous choisissez l'heure et le jour qui collent à votre planning d'artisan, sans contrainte.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center relative">
                            <div className="w-12 h-12 bg-[#1F2D3D] text-white font-extrabold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                2
                            </div>
                            <h4 className="font-bold text-[#1F2D3D] text-lg mb-2">Appel de votre expert</h4>
                            <p className="text-sm text-slate-600">
                                Un expert Gainable.fr vous appelle pour vous présenter la plateforme, le fonctionnement et vos opportunités locales.
                            </p>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/80 text-center relative">
                            <div className="w-12 h-12 bg-emerald-600 text-white font-extrabold text-lg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                                3
                            </div>
                            <h4 className="font-bold text-[#1F2D3D] text-lg mb-2">Activation sans risque</h4>
                            <p className="text-sm text-slate-600">
                                Si notre approche vous convient, vous activez votre profil. Zéro engagement obligatoire, vous gardez la main.
                            </p>
                        </div>
                    </div>

                    {/* RELATION PRO CLIENT VISUAL */}
                    <div className="mt-16 grid md:grid-cols-2 gap-10 items-center bg-amber-50/40 p-8 md:p-12 rounded-3xl border border-amber-200/80">
                        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
                            <Image
                                src="/images/relation-pro-client.png"
                                alt="Échange de confiance entre pro et client"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-[#1F2D3D]">
                                "Nous préférons moins de profils, mais uniquement des professionnels exemplaires."
                            </h3>
                            <p className="text-slate-600 text-base leading-relaxed">
                                Les particuliers qui visitent Gainable.fr sont des personnes qui préparent un vrai projet de gainable ou pompe à chaleur. Ils cherchent la sérénité technique, pas un bricoleur. C’est pour cela que nos taux de transformation sont largement supérieurs à la moyenne.
                            </p>
                            <div className="pt-2">
                                <Button
                                    asChild
                                    className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-6 py-6 rounded-xl shadow-md"
                                >
                                    <a href="#reserver-creneau">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Choisir mon créneau de démo
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. BOTTOM BOOKING CTA ANCHOR */}
            <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50 border-t border-slate-100">
                <div className="max-w-3xl mx-auto text-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
                    <span className="inline-block px-4 py-1.5 bg-amber-100 text-[#D59B2B] text-xs font-bold rounded-full uppercase tracking-wider">
                        Places limitées par département
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2D3D]">
                        Prêt à valoriser votre expertise CVC ?
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
                        Sélectionnez un créneau de 15 minutes dès maintenant. Nos conseillers techniques se tiennent à votre disposition pour vous présenter la plateforme en direct.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            asChild
                            className="w-full sm:w-auto bg-[#D59B2B] hover:bg-[#b88622] text-white font-extrabold text-base sm:text-lg px-8 py-7 rounded-2xl shadow-xl transition-transform hover:scale-102"
                        >
                            <a href="#reserver-creneau">
                                <Calendar className="w-5 h-5 mr-2" />
                                Choisir mon créneau de démo (15 min)
                            </a>
                        </Button>
                    </div>
                    <p className="text-xs text-slate-500">
                        ⚡ Démonstration personnalisée de 15 minutes • 100% sans engagement • Échange direct avec un conseiller
                    </p>
                </div>
            </section>
        </div>
    );
}
