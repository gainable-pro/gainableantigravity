import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, Star, Users, AlertTriangle, Lightbulb, TrendingUp, Award, MapPin, XCircle, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Pourquoi rejoindre Gainable.fr | Visibilité & chantiers pour experts CVC",
    description: "Gainable.fr est un réseau d’experts vérifiés en climatisation, CVC et génie climatique. Augmentez votre visibilité, obtenez des contacts qualifiés et valorisez votre savoir-faire.",
    openGraph: {
        title: "Pourquoi rejoindre Gainable.fr | Visibilité & chantiers pour experts CVC",
        description: "Gainable.fr est un réseau d’experts vérifiés en climatisation, CVC et génie climatique. Augmentez votre visibilité, obtenez des contacts qualifiés et valorisez votre savoir-faire.",
        images: ['/images/relation-pro-client.png'],
        type: 'website',
    },
    twitter: {
        card: "summary_large_image",
        title: "Pourquoi rejoindre Gainable.fr | Visibilité & chantiers pour experts CVC",
        description: "Gainable.fr est un réseau d’experts vérifiés en climatisation, CVC et génie climatique. Augmentez votre visibilité, obtenez des contacts qualifiés et valorisez votre savoir-faire.",
    }
};

export default function PourquoiGainablePage() {
    // JSON-LD for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Gainable.fr",
        "url": "https://gainable.fr",
        "logo": "https://gainable.fr/logo.png",
        "description": "La plateforme de confiance pour la climatisation gainable et le génie climatique.",
        "missionCoveragePrioritiesPolicy": "https://gainable.fr/pourquoi-gainable",
        "foundingDate": "2024",
        "sameAs": [
            "https://www.linkedin.com/company/gainable-fr"
        ]
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#1F2D3D]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header is now in global layout */}

            {/* 1. HERO SECTION */}
            <section className="relative pt-24 pb-20 px-6 overflow-hidden bg-slate-50">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-block mb-4 px-3 py-1 bg-[#D59B2B]/10 text-[#D59B2B] font-bold rounded-full text-sm">
                        NOTRE VISION
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#1F2D3D] mb-6 leading-tight">
                        Pourquoi Gainable.fr existe
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto font-medium">
                        Le problème n’est pas le manque de professionnels.<br />
                        Le problème, c’est le manque de clarté et de fiabilité.
                    </p>
                    <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
                        Nous avons créé Gainable.fr pour reconnecter la confiance entre les particuliers exigeants
                        et les véritables experts de la climatisation, sans intermédiaires cachés.
                    </p>
                    <div className="flex justify-center">
                        <Button asChild className="bg-[#D59B2B] hover:bg-[#b88622] text-white text-lg px-8 py-6 rounded-xl font-bold shadow-lg transition-transform hover:scale-105">
                            <Link href="/inscription">Rejoindre le réseau Gainable.fr</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* 2. ORIGINE / LEGITIMITE */}
            <section className="py-24 px-6 bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto">

                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1F2D3D] mb-8 leading-tight">
                                Gainable.fr est né d’un constat terrain
                            </h2>
                            <div className="text-lg text-slate-600 leading-relaxed space-y-4 font-medium">
                                <p>
                                    Gainable.fr n’a pas été imaginé dans un bureau ou par une plateforme de marketing.
                                </p>
                                <p>
                                    Il est né d’un constat terrain, partagé chaque jour par des professionnels de la climatisation,
                                    du diagnostic immobilier et des bureaux d’études.
                                </p>
                            </div>
                        </div>
                        {/* IMAGE 1: CONSTAT TERRAIN */}
                        <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/constat-terrain.png"
                                alt="Professionnel CVC sur le terrain"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* The Two Realities */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {/* Bad Reality */}
                        <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-100">
                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-2">
                                <MapPin className="text-orange-500" /> Sur le terrain, nous avons vu :
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des clients perdus face à des devis incomparables</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des installations réalisées sans respect des normes</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des qualifications difficiles à vérifier</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des sous-traitances non annoncées</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                                    <span>Des professionnels sérieux mis au même niveau que des structures non conformes</span>
                                </li>
                            </ul>
                        </div>

                        {/* Good Reality (Penalized) */}
                        <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
                            <h3 className="text-xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-2">
                                <Users className="text-blue-500" /> Dans le même temps, nous avons vu :
                            </h3>
                            <div className="mb-4 font-medium text-slate-700">Des PME, TPE et experts qualifiés :</div>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <span>Correctement assurés</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <span>Respectant les règles du métier</span>
                                </li>
                                <li className="flex gap-3 text-slate-700">
                                    <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <span>Investissant dans leurs compétences</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 font-semibold bg-white p-2 rounded-lg border border-blue-100 shadow-sm mt-2">
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                    <span>...Pénalisés par des plateformes qui privilégient le volume au détriment de la qualité.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="text-center mb-20">
                        <div className="inline-block bg-[#1F2D3D] text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg">
                            Ce décalage n'était plus acceptable.
                        </div>
                    </div>

                    {/* The Solution with Image */}
                    <div className="grid md:grid-cols-2 gap-12 items-start bg-slate-50 p-8 md:p-12 rounded-3xl">
                        {/* LEFT: Solution Text */}
                        <div>
                            <h3 className="text-2xl font-bold text-[#1F2D3D] mb-6">
                                Une réponse simple à un problème complexe
                            </h3>
                            <p className="text-slate-600 mb-6 text-lg">
                                Plutôt que de créer une plateforme de devis supplémentaire, nous avons fait un autre choix :
                            </p>
                            <ul className="space-y-3 mb-8">
                                {[
                                    "Sélectionner les professionnels",
                                    "Valoriser les bonnes pratiques",
                                    "Expliquer les enjeux aux clients",
                                    "Rétablir une relation saine et directe"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-center text-slate-700 font-medium">
                                        <div className="w-2 h-2 bg-[#D59B2B] rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* IMAGE 2 (Mobile only) */}
                            <div className="relative h-64 rounded-xl overflow-hidden shadow-lg mb-6 md:hidden">
                                <Image
                                    src="/images/relation-pro-client.png"
                                    alt="Relation client expert"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <p className="text-slate-600 mb-6 text-lg">
                                <strong>Pourquoi cette approche est différente ?</strong><br />
                                Parce que sur Gainable.fr :
                            </p>
                            <ul className="space-y-3">
                                <li className="flex gap-3 items-center text-slate-700">
                                    <Check className="w-5 h-5 text-emerald-500" /> La visibilité se mérite
                                </li>
                                <li className="flex gap-3 items-center text-slate-700">
                                    <Check className="w-5 h-5 text-emerald-500" /> Les professionnels sont identifiés
                                </li>
                                <li className="flex gap-3 items-center text-slate-700">
                                    <Check className="w-5 h-5 text-emerald-500" /> La qualité passe avant le volume
                                </li>
                                <li className="flex gap-3 items-center text-slate-700">
                                    <Check className="w-5 h-5 text-emerald-500" /> La relation client est directe
                                </li>
                            </ul>
                        </div>

                        {/* RIGHT: Image and Quote (Desktop) */}
                        <div className="hidden md:block">
                            {/* IMAGE 2: RELATION PRO CLIENT */}
                            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg mb-8">
                                <Image
                                    src="/images/relation-pro-client.png"
                                    alt="Relation client expert de confiance"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-6 bg-white rounded-xl border-l-4 border-[#D59B2B] shadow-sm">
                                <p className="text-slate-700 italic text-lg leading-relaxed">
                                    "Gainable.fr a été conçu comme un tiers de confiance, au service des clients comme des experts.<br />
                                    Ce n’est pas le plus offrant qui est mis en avant, mais le plus sérieux."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PROBLEMES TERRAIN (Intermediate CTA) */}
            <section className="py-12 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-6xl mx-auto text-center">
                    <Button asChild variant="outline" className="border-[#D59B2B] text-[#D59B2B] hover:bg-orange-50 font-bold px-8 py-6 rounded-xl text-lg">
                        <Link href="/inscription">Rejoindre le réseau de confiance →</Link>
                    </Button>
                </div>
            </section>

            {/* 4. COMPARATIF: CE QUE NOUS NE SOMMES PAS */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-[#1F2D3D] mb-16">
                        Remettons de la clarté
                    </h2>

                    <div className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-slate-200 shadow-xl">
                        {/* LEFT: NOT */}
                        <div className="bg-slate-50 p-10 border-b md:border-b-0 md:border-r border-slate-200">
                            <h3 className="text-xl font-bold text-red-600 mb-8 flex items-center gap-3">
                                <XCircle className="w-6 h-6" /> Ce que Gainable.fr N'EST PAS
                            </h3>
                            <ul className="space-y-6">
                                <li className="flex items-start gap-4 opacity-70">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-slate-800">Un comparateur de prix</div>
                                        <div className="text-sm text-slate-500">Nous ne cherchons pas le moins cher, mais le plus compétent.</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 opacity-70">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-slate-800">Un vendeur de coordonnées</div>
                                        <div className="text-sm text-slate-500">Vos données ne sont jamais revendues en masse.</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4 opacity-70">
                                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-slate-800">Un annuaire automatique</div>
                                        <div className="text-sm text-slate-500">Pas d'inscription sans vérification humaine.</div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* RIGHT: IS */}
                        <div className="bg-[#1F2D3D] p-10 text-white relative overflow-hidden">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D59B2B] rounded-full blur-[100px] opacity-10 pointer-events-none" />

                            <h3 className="text-xl font-bold text-[#D59B2B] mb-8 flex items-center gap-3 relative z-10">
                                <CheckCircle2 className="w-6 h-6" /> Ce que Gainable.fr EST
                            </h3>
                            <ul className="space-y-6 relative z-10">
                                <li className="flex items-start gap-4">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-white">Une sélection rigoureuse</div>
                                        <div className="text-sm text-slate-400">SIRET, Décennale et Qualifications vérifiées.</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-white">Une mise en relation directe</div>
                                        <div className="text-sm text-slate-400">Le client contacte l'expert de son choix, sans filtre.</div>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                                    <div>
                                        <div className="font-semibold text-white">Un tiers de confiance</div>
                                        <div className="text-sm text-slate-400">Nous garantissons la visibilité des vrais experts.</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. POUR QUI */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold text-[#1F2D3D] mb-4">Pour les Professionnels</h3>
                        <p className="text-slate-600 mb-6">
                            Arrêtez de payer pour des leads de mauvaise qualité. Adhérez à un réseau qui valorise votre technicité et vous apporte des chantiers intéressants.
                        </p>
                        <Link href="/inscription" className="text-[#D59B2B] font-bold hover:underline">
                            Voir les conditions d'adhésion →
                        </Link>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-[#1F2D3D] mb-4">Pour les Particuliers</h3>
                        <p className="text-slate-600 mb-6">
                            Votre projet mérite mieux qu'un devis standardisé. Trouvez l'artisan qui saura étudier votre besoin spécifique (bruit, esthétique, performance).
                        </p>
                        <Link href="/trouver-installateur" className="text-[#1F2D3D] font-bold hover:underline">
                            Chercher un expert →
                        </Link>
                    </div>
                </div>
            </section>

            {/* 6. LABEL / SELECTION (Reverted to Centered Layout) */}
            <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge Icon Top */}
                    <div className="mb-8 inline-flex items-center justify-center p-4 bg-[#D59B2B] rounded-full shadow-lg">
                        <Award className="w-8 h-8 text-white" />
                    </div>

                    <h2 className="text-3xl font-bold text-[#1F2D3D] mb-6">La Sélection Gainable.fr</h2>
                    <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                        Être présent sur Gainable.fr n'est pas un droit, c'est une reconnaissance.
                        Nous refusons régulièrement des inscriptions qui ne répondent pas à nos critères de sérieux.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-700 mb-12">
                        <span className="px-6 py-3 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm"><CheckCircle2 className="w-4 h-4 text-[#D59B2B]" /> SIRET Vérifié</span>
                        <span className="px-6 py-3 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm"><CheckCircle2 className="w-4 h-4 text-[#D59B2B]" /> Assurance Décennale</span>
                        <span className="px-6 py-3 bg-white border border-slate-200 rounded-full flex items-center gap-2 shadow-sm"><CheckCircle2 className="w-4 h-4 text-[#D59B2B]" /> Avis Clients</span>
                    </div>

                    {/* 'TIERS DE CONFIANCE' BLOCK (Centered) */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
                        <h3 className="font-bold text-xl text-[#1F2D3D] mb-4">Un tiers de confiance qui garantit la visibilité des vrais experts</h3>
                        <p className="text-slate-500 mb-10 max-w-2xl mx-auto">
                            Gainable.fr ne garantit pas des leads ou des résultats commerciaux.<br />
                            Nous garantissons des conditions de visibilité réelles, équitables et durables, pensées pour valoriser les professionnels sérieux.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 text-left">
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3 font-bold text-[#1F2D3D] mb-2">
                                    <ShieldCheck className="w-5 h-5 text-[#D59B2B]" /> Sélection rigoureuse
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Chaque entreprise référencée est identifiée et vérifiée (SIRET, assurances, qualifications), afin d'éviter toute dilution de la qualité.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3 font-bold text-[#1F2D3D] mb-2">
                                    <Users className="w-5 h-5 text-[#D59B2B]" /> Visibilité non diluée
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Contrairement aux plateformes de revente de contacts, la visibilité sur Gainable.fr n’est jamais partagée artificiellement entre plusieurs entreprises.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3 font-bold text-[#1F2D3D] mb-2">
                                    <Award className="w-5 h-5 text-[#D59B2B]" /> Basée sur le sérieux
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    La visibilité ne s'achète pas. Elle dépend du respect des critères, de la conformité et de l'implication du professionnel.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3 font-bold text-[#1F2D3D] mb-2">
                                    <TrendingUp className="w-5 h-5 text-[#D59B2B]" /> Visibilité durable (SEO)
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Chaque expert bénéficie d'une page dédiée, indexée et optimisée, intégrée dans un écosystème SEO conçu pour renforcer sa présence locale.
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 inline-block px-6 py-3 bg-[#D59B2B]/10 text-[#D59B2B] text-base font-bold rounded-lg">
                            Moins de profils, plus de visibilité pour chacun.
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. VISION */}
            <section className="py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-[#1F2D3D] mb-4">Notre ambition</h2>
                    <p className="text-slate-600">
                        Devenir le standard de qualité pour la climatisation et le génie climatique en France et en Suisse.
                        Ni plus, ni moins.
                    </p>
                </div>
            </section>

            {/* 8. CTA FINAL */}
            <section className="py-24 px-6 bg-[#D59B2B]">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        Rejoignez le mouvement
                    </h2>
                    <Button asChild className="bg-white text-[#D59B2B] hover:bg-slate-100 text-xl px-10 py-8 rounded-full font-bold shadow-xl">
                        <Link href="/inscription">Inscrire mon entreprise</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
