import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { FileText, Check, ShieldCheck, Zap, Home, Search, Thermometer, AlertTriangle, Calendar, Users, MapPin } from "lucide-react";
import Link from "next/link";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Diagnostiqueur immobilier DPE & audit énergétique | Gainable.fr",
    description: "Trouvez un diagnostiqueur immobilier pour votre DPE, audit énergétique ou diagnostic vente/location. Experts vérifiés disponibles sur Gainable.fr.",
    openGraph: {
        title: "Diagnostiqueur immobilier DPE & audit énergétique | Gainable.fr",
        description: "Trouvez un diagnostiqueur immobilier pour votre DPE, audit énergétique ou diagnostic vente/location. Experts vérifiés disponibles sur Gainable.fr.",
        images: ['/diag-hero.png'],
        type: 'website',
    },
    twitter: {
        card: "summary_large_image",
        title: "Diagnostiqueur immobilier DPE & audit énergétique | Gainable.fr",
        description: "Trouvez un diagnostiqueur immobilier pour votre DPE, audit énergétique ou diagnostic vente/location. Experts vérifiés disponibles sur Gainable.fr.",
    }
};

export default function DiagnosticImmobilierPage() {
    // JSON-LD for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Service de Diagnostic Immobilier Gainable.fr",
        "description": "Réseau de diagnostiqueurs immobiliers certifiés pour DPE, amiante, plomb et audit énergétique.",
        "url": "https://gainable.fr/diagnostic-immobilier",
        "logo": "https://gainable.fr/logo.png",
        "areaServed": "FR",
        "knowsAbout": ["DPE", "Audit Énergétique", "Diagnostic Vente", "Diagnostic Location"]
    };

    return (
        <div className="flex min-h-screen flex-col font-sans text-[#1F2D3D]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />


            {/* BLOCK 1: HERO / ACCROCHE PRINCIPALE */}
            <section className="relative min-h-[600px] flex items-center justify-center py-20 px-4 bg-[#1F2D3D] text-white">
                <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal mb-8 tracking-wide leading-tight uppercase font-montserrat">
                            <span className="text-white">DIAGNOSTIQUEUR</span> <br />
                            <span className="text-[#D59B2B]">IMMOBILIER</span>
                        </h1>
                        <p className="text-xl text-slate-200 mb-6 font-medium">
                            Trouvez un diagnostiqueur certifié près de chez vous. Avant toute vente, location ou projet énergétique (climatisation gainable, rénovation…), un diagnostic fiable et complet est indispensable.
                        </p>
                        <p className="text-base text-slate-400 mb-10 leading-relaxed max-w-lg">
                            Nos diagnostiqueurs certifiés vous accompagnent pour sécuriser votre bien, évaluer sa performance énergétique et vous guider dans les obligations réglementaires.
                        </p>
                        <p className="text-lg text-[#D59B2B] font-bold mb-8">
                            👉 Votre patrimoine mérite une expertise professionnelle.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Link href="/trouver-installateur?filter=diagnostiqueur">
                                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg w-full sm:w-auto">
                                    ▸ Trouvez votre diagnostiqueur
                                </Button>
                            </Link>
                            <Link href="/inscription">
                                <Button size="lg" className="bg-white hover:bg-slate-100 text-[#1F2D3D] font-bold px-10 py-6 rounded-full text-lg shadow-lg w-full sm:w-auto text-center h-auto sm:h-auto min-h-[60px] whitespace-normal">
                                    Devenez membre premium diagnostiqueur immobilier
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#D59B2B]/20 blur-3xl rounded-full"></div>
                        <img src="/diag-hero.png" alt="Diagnostiqueur immobilier avec tablette" className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border-4 border-[#D59B2B]/20 object-cover" />
                    </div>
                </div>
            </section>

            {/* BLOCK 2: POURQUOI FAIRE APPEL À UN DIAGNOSTIQUEUR ? (Image Left, Text Right) */}
            <section className="py-24 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Image Left */}
                        <div className="order-2 md:order-1 relative">
                            <img src="/diag-inspector.png" alt="Expertise technique diagnostic" className="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        </div>

                        {/* Text Right */}
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8 uppercase tracking-wide">
                                Une expertise essentielle pour <span className="text-[#D59B2B]">sécuriser votre logement</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Le diagnostic immobilier permet d’évaluer l'état technique et énergétique d’un bien : performance énergétique, sécurité électrique, gaz, présence d’amiante, termites, mesure des surfaces…
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                C’est une étape clé pour protéger propriétaires, locataires et acheteurs, tout en garantissant la conformité légale du logement.
                            </p>
                            <p className="text-lg text-[#1F2D3D] font-bold mb-8 border-l-4 border-[#D59B2B] pl-4">
                                👉 Un diagnostic clair, c’est une décision éclairée.
                            </p>
                            <Link href="/trouver-installateur?filter=diagnostiqueur">
                                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg">
                                    ▸ Trouvez votre diagnostiqueur
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 3: CLIM GAINABLE (Text Left, Image Right) */}
            <section className="py-24 bg-slate-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Text Left */}
                        <div>
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8 uppercase tracking-wide">
                                Le diagnostic : la base d’un <span className="text-[#D59B2B]">calcul de puissance fiable</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Pour installer une climatisation gainable performante, il est essentiel d’obtenir des données précises : déperditions thermiques, qualité d’isolation, structure du bâtiment, zones sensibles…
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Les diagnostiqueurs fournissent ces informations essentielles, permettant aux installateurs de dimensionner parfaitement la puissance de votre système.
                            </p>
                            <p className="text-lg text-[#1F2D3D] font-bold mb-8 border-l-4 border-[#D59B2B] pl-4">
                                👉 Une installation optimisée commence toujours par un diagnostic maîtrisé.
                            </p>
                            <Link href="/trouver-installateur?filter=diagnostiqueur">
                                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg">
                                    ▸ Trouvez votre diagnostiqueur
                                </Button>
                            </Link>
                        </div>

                        {/* Image Right */}
                        <div className="relative">
                            <img src="/diag-thermal.png" alt="Expert thermique caméra infrarouge" className="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 4: PASSOIRES ÉNERGÉTIQUES (Image Left, Text Right) */}
            <section className="py-24 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Image Left */}
                        <div className="order-2 md:order-1 relative">
                            {/* Placeholder reused since generation failed */}
                            <img src="/diag-inspector.png" alt="Passoires énergétiques DPE G" className="w-full h-auto rounded-2xl shadow-xl object-cover grayscale opacity-90" />
                        </div>

                        {/* Text Right */}
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8 uppercase tracking-wide">
                                La réglementation évolue : <span className="text-[#D59B2B]">soyez en conformité</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Depuis 2024, la location des logements classés F et G est progressivement interdite. Un bien mal noté entraîne :
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <AlertTriangle className="text-[#D59B2B]" /> perte de valeur immobilière
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <AlertTriangle className="text-[#D59B2B]" /> factures énergétiques élevées
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <AlertTriangle className="text-[#D59B2B]" /> difficultés de revente ou location
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 font-medium">
                                    <AlertTriangle className="text-[#D59B2B]" /> obligation de travaux parfois coûteux
                                </li>
                            </ul>
                            <p className="text-lg text-[#1F2D3D] font-bold mb-8 border-l-4 border-[#D59B2B] pl-4">
                                👉 Anticipez les changements, faites diagnostiquer votre logement avant qu’il ne soit trop tard.
                            </p>
                            <Link href="/trouver-installateur?filter=diagnostiqueur">
                                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg">
                                    ▸ Trouvez votre diagnostiqueur
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 5: DURÉE DE VALIDITÉ (Text Left, Image Right) */}
            <section className="py-24 bg-[#1F2D3D] text-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Text Left */}
                        <div>
                            <h2 className="text-3xl font-bold font-montserrat text-white mb-8 uppercase tracking-wide">
                                Vérifiez si vos diagnostics sont <span className="text-[#D59B2B]">toujours valides</span>
                            </h2>
                            <p className="text-slate-300 mb-8">
                                Chaque diagnostic possède sa propre durée de validité. Si elle est dépassée, vous devez refaire le diagnostic avant toute transaction. Un rapport à jour vaut sécurité, transparence et conformité.
                            </p>

                            <div className="grid gap-4 mb-8">
                                <div className="flex justify-between border-b border-slate-700 pb-2"><span>DPE</span> <span className="font-bold text-[#D59B2B]">10 ans</span></div>
                                <div className="flex justify-between border-b border-slate-700 pb-2"><span>Amiante</span> <span className="text-slate-400">illimité (si abs.) / 3 ans (si prés.)</span></div>
                                <div className="flex justify-between border-b border-slate-700 pb-2"><span>Plomb</span> <span className="text-slate-400">illimité (si abs.) / 1-6 ans (si prés.)</span></div>
                                <div className="flex justify-between border-b border-slate-700 pb-2"><span>Électricité / Gaz</span> <span className="text-slate-400">3 ans (vente) / 6 ans (loc.)</span></div>
                                <div className="flex justify-between border-b border-slate-700 pb-2"><span>Termites / ERP</span> <span className="font-bold text-[#D59B2B]">6 mois</span></div>
                            </div>

                            <p className="text-lg text-white font-bold mb-8 border-l-4 border-[#D59B2B] pl-4">
                                👉 Vérifiez vos diagnostics et évitez les mauvaises surprises.
                            </p>
                            <Link href="/trouver-installateur?filter=diagnostiqueur">
                                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg">
                                    ▸ Trouvez votre diagnostiqueur
                                </Button>
                            </Link>
                        </div>

                        {/* Image Right */}
                        <div className="relative">
                            {/* Placeholder reused since generation failed */}
                            <img src="/diag-hero.png" alt="Checklist diagnostics immobiliers" className="w-full h-auto rounded-2xl shadow-2xl border border-white/10 object-cover opacity-80" />
                        </div>

                    </div>
                </div>
            </section>

            {/* BLOCK 6: MISE EN RELATION (Image Left, Text Right) */}
            <section className="py-24 bg-slate-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Image Left */}
                        <div className="order-2 md:order-1 relative">
                            {/* Placeholder reused since generation failed */}
                            <img src="/bureau-etude-audience.png" alt="Poignée de main propriétaire diagnostiqueur" className="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        </div>

                        {/* Text Right */}
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8 uppercase tracking-wide">
                                Des diagnostiqueurs certifiés, <span className="text-[#D59B2B]">partout en France</span>
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Gainable.fr sélectionne des professionnels :
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-700 font-bold text-lg"><Check className="text-[#D59B2B]" /> certifiés et assurés</li>
                                <li className="flex items-center gap-3 text-slate-700 font-bold text-lg"><Check className="text-[#D59B2B]" /> disponibles rapidement</li>
                                <li className="flex items-center gap-3 text-slate-700 font-bold text-lg"><Check className="text-[#D59B2B]" /> transparents sur leurs tarifs</li>
                                <li className="flex items-center gap-3 text-slate-700 font-bold text-lg"><Check className="text-[#D59B2B]" /> experts des obligations légales</li>
                            </ul>
                            <p className="text-lg text-[#1F2D3D] font-bold mb-8 border-l-4 border-[#D59B2B] pl-4">
                                👉 Gagnez du temps : nous vous trouvons le bon diagnostiqueur près de chez vous.
                            </p>
                            <Link href="/trouver-installateur?filter=diagnostiqueur">
                                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg">
                                    ▸ Trouvez votre diagnostiqueur
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 7: CTA FINAL (Center) */}
            <section className="py-24 bg-white">
                <div className="container max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold font-montserrat text-[#1F2D3D] mb-6 uppercase tracking-wide">
                        Votre diagnostic immobilier <span className="text-[#D59B2B]">commence ici</span>
                    </h2>
                    <p className="text-xl text-slate-600 mb-10 leading-relaxed font-light">
                        Que ce soit pour une vente, une location, une mise en conformité ou une étude thermique pour climatisation gainable, nos diagnostiqueurs partenaires sont disponibles immédiatement.
                    </p>
                    <div className="flex justify-center gap-8 mb-12">
                        <span className="flex items-center gap-2 font-bold text-[#1F2D3D]"><Zap className="text-[#D59B2B]" /> Rapide</span>
                        <span className="flex items-center gap-2 font-bold text-[#1F2D3D]"><ShieldCheck className="text-[#D59B2B]" /> Certifié</span>
                        <span className="flex items-center gap-2 font-bold text-[#1F2D3D]"><Check className="text-[#D59B2B]" /> Fiable</span>
                    </div>

                    <div className="flex flex-col gap-4 justify-center items-center">
                        <Link href="/trouver-installateur?filter=diagnostiqueur">
                            <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-12 py-8 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-transform w-full sm:w-auto">
                                ▸ Trouvez votre diagnostiqueur
                            </Button>
                        </Link>
                        <Link href="/inscription">
                            <Button size="lg" className="bg-[#1F2D3D] hover:bg-[#2c3e50] text-white font-bold px-12 py-8 rounded-full text-lg shadow-2xl transform hover:scale-105 transition-transform w-full sm:w-auto h-auto min-h-[80px] whitespace-normal max-w-sm">
                                Devenez membre premium diagnostiqueur immobilier
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer is global */}
        </div>
    );
}
