import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Check, ClipboardList, Thermometer, Users, FileText, Lightbulb, Phone } from "lucide-react";
import Link from "next/link";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Bureau d'Étude Thermique & Fluides - Climatisation | Gainable.fr",
    description: "Faites appel à un bureau d'étude spécialisé en CVC et thermique pour dimensionner votre installation de climatisation gainable (RE 2020, Rénovation).",
    openGraph: {
        title: "Bureau d'Étude Thermique & Fluides - Climatisation | Gainable.fr",
        description: "Dimensionnement, étude thermique RE2020, audit énergétique : trouvez le bureau d'étude adapté à votre projet.",
        images: ['/bureau-etude-hero.png'],
        type: 'website',
    },
};

export default function BureauEtudePage() {
    return (
        <div className="flex min-h-screen flex-col font-sans text-[#1F2D3D]">


            {/* BLOCK 1: HERO SECTION */}
            <section className="relative min-h-[600px] flex items-center justify-center py-20 px-4 bg-[#1F2D3D] text-white">
                <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal mb-8 tracking-wide leading-tight uppercase font-montserrat">
                            <span className="text-white">BUREAU D'ÉTUDES</span> <br />
                            <span className="text-[#D59B2B]">THERMIQUE & FLUIDES</span>
                        </h1>
                        <p className="text-xl text-slate-200 mb-6 font-medium">
                            Optimiser le confort, réduire les consommations, sécuriser vos installations : notre bureau d’étude vous accompagne du projet neuf à la rénovation.
                        </p>
                        <p className="text-base text-slate-400 mb-10 leading-relaxed max-w-lg">
                            Études thermiques, dimensionnement des systèmes de chauffage / climatisation, ventilation, réseaux hydrauliques et plomberie : nous concevons des solutions sur mesure, adaptées à votre bâtiment et à votre budget.
                        </p>
                        <div className="flex flex-col gap-4">
                            <Link href="/trouver-installateur?filter=bureau_etude">
                                <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg w-full sm:w-auto">
                                    Trouvez votre bureau d'étude
                                </Button>
                            </Link>
                            <Link href="/inscription">
                                <Button size="lg" className="bg-white hover:bg-slate-100 text-[#1F2D3D] font-bold px-10 py-6 rounded-full text-lg shadow-lg w-full sm:w-auto">
                                    Devenir membre Bureau d'étude
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#D59B2B]/20 blur-3xl rounded-full"></div>
                        <img src="/bureau-etude-hero.png" alt="Ingénieur Bureau d'étude CVC au travail" className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border-4 border-[#D59B2B]/20 object-cover" />
                    </div>
                </div>
            </section>

            {/* BLOCK 2: ROLE DU BUREAU D'ETUDE (Image Left, Text Right) */}
            <section className="py-24 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Image Left */}
                        <div className="order-2 md:order-1 relative">
                            <img src="/bureau-etude-intro.png" alt="Modélisation 3D CVC sur écran" className="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        </div>

                        {/* Text Right */}
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8">
                                À quoi sert un <span className="text-[#D59B2B]">bureau d’étude</span> thermique & fluides ?
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Le bureau d’étude thermique & fluides a pour rôle d’analyser votre bâtiment, de dimensionner correctement les équipements (chauffage, climatisation, ventilation, plomberie) et de vérifier la conformité réglementaire (RE 2020, rénovation énergétique, confort d’été, performances énergétiques…).
                            </p>
                            <div className="p-6 bg-slate-50 border-l-4 border-[#D59B2B] rounded-r-xl">
                                <p className="text-[#1F2D3D] font-bold text-lg">
                                    "L’objectif : un maximum de confort avec un minimum de consommation et des installations fiables et durables."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 3: QUELLES ETUDES ? (Text Left, Image Right) */}
            <section className="py-24 bg-slate-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Text Left */}
                        <div>
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8">
                                Quelles études pouvons-nous <span className="text-[#D59B2B]">réaliser</span> ?
                            </h2>
                            <div className="grid gap-6">
                                {[
                                    { title: "Études thermiques réglementaires", desc: "RE 2020 / rénovation, calcul des besoins." },
                                    { title: "Dimensionnement CVC", desc: "Calcul des puissances, choix des équipements, optimisation." },
                                    { title: "Études de ventilation", desc: "VMC simple/double flux, qualité de l'air intérieur." },
                                    { title: "Plomberie & ECS", desc: "Dimensionnement réseaux, ballons, circulation." },
                                    { title: "Bilans de déperditions", desc: "Simulation confort hiver/été, préconisations." },
                                    { title: "Audits énergétiques", desc: "Analyse existant, scénarios d'amélioration." }
                                ].map((service, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 items-start">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-[#D59B2B] shrink-0"></div>
                                        <div>
                                            <h4 className="font-bold text-[#1F2D3D]">{service.title}</h4>
                                            <p className="text-sm text-slate-500">{service.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Right */}
                        <div className="relative">
                            <img src="/bureau-etude-services.png" alt="Équipe ingénieurs CVC collaboration" className="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 4: POUR QUI ? (Image Left, Text Right) */}
            <section className="py-24 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Image Left */}
                        <div className="order-2 md:order-1 relative">
                            <img src="/bureau-etude-audience.png" alt="Architecte et clients sur chantier" className="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        </div>

                        {/* Text Right */}
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8">
                                À qui s’adressent <span className="text-[#D59B2B]">nos études</span> ?
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { target: "Particuliers", desc: "Construction neuve, extension, rénovation, projet PAC." },
                                    { target: "Architectes & Maîtres d’œuvre", desc: "Accompagnement technique dès la conception." },
                                    { target: "Artisans & Installateurs", desc: "Dimensionnement précis pour des chantiers sans surprises." },
                                    { target: "Promoteurs & Bailleurs", desc: "Optimisation énergétique de programmes neufs ou réhab." },
                                    { target: "Syndics & Copropriétés", desc: "Diagnostic et amélioration des installations collectives." }
                                ].map((audience, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="p-2 bg-[#D59B2B]/10 rounded-lg text-[#D59B2B]">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1F2D3D] text-lg">{audience.target}</h4>
                                            <p className="text-slate-600">{audience.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 5: TIMELINE PROCESS (Text Left, Image Right) */}
            <section className="py-24 bg-[#1F2D3D] text-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Text Left */}
                        <div>
                            <h2 className="text-3xl font-bold font-montserrat text-white mb-8">
                                Comment se déroule <span className="text-[#D59B2B]">une étude</span> ?
                            </h2>
                            <div className="space-y-8 relative">
                                {/* Line */}
                                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[#D59B2B]/30"></div>

                                {[
                                    { step: "Prise de contact", desc: "Plans, contraintes, budget, objectifs." },
                                    { step: "Collecte des données", desc: "Surfaces, matériaux, systèmes existants." },
                                    { step: "Calculs & Modélisation", desc: "Étude thermique, dimensionnement, choix équipements." },
                                    { step: "Proposition de solutions", desc: "Scénarios comparés (performances, coûts)." },
                                    { step: "Remise du rapport", desc: "Synthèse claire, plans, préconisations." },
                                    { step: "Accompagnement (Option)", desc: "Assistance et suivi technique." }
                                ].map((step, i) => (
                                    <div key={i} className="relative pl-12">
                                        <div className="absolute left-0 top-1 w-10 h-10 bg-[#D59B2B] rounded-full flex items-center justify-center text-[#1F2D3D] font-bold z-10 border-4 border-[#1F2D3D]">
                                            {i + 1}
                                        </div>
                                        <h4 className="font-bold text-lg text-white">{step.step}</h4>
                                        <p className="text-slate-400">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Image Right */}
                        <div className="relative">
                            <img src="/bureau-etude-timeline.png" alt="Installation CVC technique chantier" className="w-full h-auto rounded-2xl shadow-2xl border border-white/10 object-cover" />
                        </div>

                    </div>
                </div>
            </section>

            {/* BLOCK 6: EXEMPLES (Image Left, Text Right) */}
            <section className="py-24 bg-slate-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Image Left */}
                        <div className="order-2 md:order-1 relative">
                            <img src="/bureau-etude-examples.png" alt="Villa moderne exemple projet" className="w-full h-auto rounded-2xl shadow-xl object-cover" />
                        </div>

                        {/* Text Right */}
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8">
                                Quelques exemples <span className="text-[#D59B2B]">d'études réalisées</span>
                            </h2>
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <h4 className="font-bold text-[#1F2D3D] mb-2">Maison individuelle – 120 m² – Neuf</h4>
                                    <p className="text-slate-600 text-sm">Étude RE 2020, dimensionnement PAC air/eau + plancher chauffant.</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <h4 className="font-bold text-[#1F2D3D] mb-2">Appartement en rénovation</h4>
                                    <p className="text-slate-600 text-sm">Bilan déperdition, remplacement radiateurs, PAC air/air gainable.</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <h4 className="font-bold text-[#1F2D3D] mb-2">Local professionnel / Commerce</h4>
                                    <p className="text-slate-600 text-sm">Climatisation et renouvellement d’air pour confort clients/staff.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 7: CTA FINAL (Text Left, Image Right) */}
            <section className="py-24 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">

                        {/* Text Left */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1F2D3D] mb-6">
                                Un projet ? Besoin d’une <span className="text-[#D59B2B]">étude thermique</span> ?
                            </h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed font-light">
                                Parlez-nous de votre projet (neuf ou rénovation) et nous vous proposerons une étude personnalisée pour optimiser votre confort et vos consommations.
                            </p>
                            <div className="flex flex-col gap-4">
                                <Link href="/trouver-installateur?filter=bureau_etude">
                                    <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg w-full sm:w-auto">
                                        Trouvez votre bureau d'étude
                                    </Button>
                                </Link>
                                <Link href="/inscription">
                                    <Button size="lg" className="bg-[#1F2D3D] hover:bg-[#2c3e50] text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg w-full sm:w-auto">
                                        Devenir membre Bureau d'étude
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Image Right */}
                        <div className="relative">
                            <img src="/bureau-etude-contact.png" alt="Ingénieur contact smartphone" className="w-full h-auto rounded-3xl shadow-2xl object-cover" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer is global */}
        </div>
    );
}
