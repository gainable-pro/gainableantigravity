import { Button } from "@/components/ui/button";
import { 
    Check, 
    ShieldCheck, 
    Award, 
    AlertTriangle, 
    Briefcase, 
    User, 
    FileText, 
    Star, 
    Shield, 
    Sparkles, 
    HelpCircle, 
    CheckCircle2, 
    XCircle, 
    ArrowRight, 
    Clock, 
    PhoneCall, 
    Building2,
    AlertOctagon,
    HeartHandshake,
    Flame,
    Droplets,
    PhoneOff,
    Building,
    CheckCircle,
    UserCheck,
    Lock,
    Scale,
    Wrench,
    BadgeAlert,
    FileCheck2,
    Home,
    ThumbsUp
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { VerifiedExpertBadge } from "@/components/ui/verified-expert-badge";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
    description: "Découvrez le label Expert Vérifié Gainable.fr : la protection officielle des particuliers contre les faux artisans, les fausses décennales et les abandons de SAV.",
    openGraph: {
        title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
        description: "Découvrez le label Expert Vérifié Gainable.fr : la protection officielle des particuliers contre les faux artisans, les fausses décennales et les abandons de SAV.",
        images: ['/gainable-fr-label-qualite-climatisation-rge.png'],
        type: 'website',
    },
    twitter: {
        card: "summary_large_image",
        title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
        description: "Découvrez le label Expert Vérifié Gainable.fr : la protection officielle des particuliers contre les faux artisans, les fausses décennales et les abandons de SAV.",
    },
    alternates: {
        canonical: "https://www.gainable.fr/labels",
    }
};

export default function LabelsPage() {
    return (
        <div className="flex min-h-screen flex-col font-sans text-[#1F2D3D] bg-white">

            {/* HERO SECTION */}
            <section className="relative min-h-[500px] flex items-center justify-center py-20 px-4 overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/gainable-fr-label-qualite-climatisation-rge.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-[#1F2D3D]/95"></div>
                </div>

                <div className="container relative z-10 mx-auto text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 p-2.5 px-6 rounded-full bg-[#D59B2B] text-white font-black text-xs md:text-sm tracking-wider mb-6 uppercase shadow-xl">
                        <ShieldCheck className="w-4 h-4 text-white" />
                        Gage Officiel de Confiance • Protection Client • Distinction Artisan
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight uppercase font-montserrat text-white">
                        Installer une climatisation ne devrait jamais être <br />
                        <span className="text-[#D59B2B] normal-case block mt-3 font-extrabold text-2xl md:text-4xl">
                            un coup de poker avec votre maison
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-normal leading-relaxed">
                        Un système gainable s’encastre au cœur de vos plafonds et de vos combles pour les 15 prochaines années. 
                        Ce n'est pas un simple appareil électroménager : c'est un investissement lourd entre <strong>8 000 € et 25 000 €</strong>. 
                        Le Label <strong>Expert Vérifié Réseau Gainable®</strong> sélectionne sur pièces justificatives les installateurs sérieux, 
                        protège les particuliers contre les malfaçons et valorise les artisans d'excellence.
                    </p>

                    {/* 3 Reassurance Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
                        {[
                            { 
                                title: "Attestation Décennale Vérifiée", 
                                desc: "Attestation CVC vérifiée sur pièces justificatives" 
                            },
                            { 
                                title: "Entreprise Solide & Active", 
                                desc: "SIRET actif à l'INSEE, pièces vérifiées, zéro société éphémère" 
                            },
                            { 
                                title: "Mise en Relation 100 % Gratuite", 
                                desc: "Contact direct avec l'artisan • Zéro commission ni surcoût sur votre devis" 
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-white shadow-sm flex items-start gap-3">
                                <div className="w-8 h-8 rounded-xl bg-[#D59B2B] text-white flex items-center justify-center font-bold shrink-0 shadow-sm mt-0.5">
                                    ✓
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{item.title}</p>
                                    <p className="text-xs text-slate-300 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/trouver-installateur">
                            <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white px-8 py-6 rounded-2xl font-black text-base shadow-xl transition-all hover:scale-105">
                                Trouver un installateur vérifié près de chez moi
                            </Button>
                        </Link>
                        <Link href="/inscription">
                            <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 rounded-2xl font-bold text-base transition-all">
                                Vous êtes installateur ? Rejoindre le Réseau
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 1: LE BADGE OFFICIEL MIS EN AVANT EN PREMIER (DEMANDE UTILISATEUR) */}
            <section className="py-16 bg-gradient-to-b from-slate-100 via-white to-slate-50 border-b border-slate-200">
                <div className="container max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                        <Sparkles className="w-4 h-4 text-[#D59B2B]" /> Signature Visuelle de Confiance
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black font-montserrat text-[#1F2D3D] mb-4">
                        Le Badge Officiel « Expert Vérifié »
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Repérez ce macaron officiel sur les fiches des professionnels et sur leurs véhicules d'intervention. 
                        Le battement de cœur régulier du badge signale une entreprise active, dont les pièces justificatives et assurances ont fait l'objet d'une modération et d'une vérification documentaire.
                    </p>

                    <div className="bg-white rounded-3xl p-8 md:p-12 border-2 border-slate-200/90 shadow-2xl max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6">
                        <VerifiedExpertBadge size="lg" />
                        <div className="pt-5 border-t border-slate-100 text-xs md:text-sm text-slate-500 max-w-md leading-relaxed">
                            Ce badge est une marque déposée propriété exclusive de Gainable.fr. Toute reproduction ou affichage frauduleux 
                            par une entreprise non vérifiée fait l’objet de poursuites judiciaires immédiates.
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2 : LE CONSTAT SANS FILTRE (LE MIX PARFAIT ENTRE CONTENU CHOC & LISIBILITÉ CLAIRE) */}
            <section className="py-20 bg-white border-b border-slate-200">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                            <AlertTriangle className="w-4 h-4 text-rose-600" /> La réalité du marché • Ce que personne ne vous dit
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black font-montserrat text-[#1F2D3D] mb-6 leading-tight">
                            Les 4 Pièges Cachés de la Climatisation <br />
                            <span className="text-[#D59B2B]">(et comment notre label vous en protège)</span>
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
                            La climatisation gainable est un métier d’ingénierie et de précision frigorifique. 
                            Pourtant, le secteur a attiré des démarcheurs sans scrupules et des poseurs improvisés. 
                            Voici les 4 réalités brutales auxquelles des centaines de propriétaires se heurtent chaque mois, et la réponse ferme de Gainable.fr :
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-14">
                        {/* PIÈGE 1 : LE GHOSTING SAV */}
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-8 space-y-4 hover:border-[#D59B2B]/60 transition-all shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                                    <PhoneOff className="w-6 h-6 text-rose-600" />
                                </div>
                                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                                    Piège N°1
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2D3D]">
                                1. Le syndrome de l'artisan « fantôme » dès la facture soldée
                            </h3>
                            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                                <p>
                                    <strong className="text-rose-700">Le cauchemar vécu :</strong> Tant qu’il faut faire signer le devis et encaisser l’acompte, 
                                    le commercial répond dans les 5 minutes. Mais quand les premiers froids arrivent en décembre et que l’appareil se bloque avec un code erreur, 
                                    le téléphone sonne dans le vide, les messages vocaux restent sans réponse et votre numéro finit bloqué. 
                                    Vous avez versé 12 000 € et vous vous retrouvez seul, en plein hiver, avec une maison glacée.
                                </p>
                                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium flex items-start gap-2 text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>L'engagement du réseau :</strong> Des entreprises locales établies qui signent notre charte de déontologie : devis transparent sans surprise, mise en service soignée et proposition d'un contrat d'entretien régulier.</span>
                                </div>
                            </div>
                        </div>

                        {/* PIÈGE 2 : SOCIÉTÉS ÉPHÉMÈRES ET LIQUIDATIONS */}
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-8 space-y-4 hover:border-[#D59B2B]/60 transition-all shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                                    <Building className="w-6 h-6 text-rose-600" />
                                </div>
                                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                                    Piège N°2
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2D3D]">
                                2. Les sociétés éphémères et les liquidations opportunistes
                            </h3>
                            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                                <p>
                                    <strong className="text-rose-700">Le cauchemar vécu :</strong> Des structures commerciales montées en hâte qui sous-traitent des poses à bas coût à la chaîne. 
                                    Dès que les premières malfaçons éclatent ou que les mises en demeure pleuvent, la société est mise en <strong>liquidation judiciaire express</strong>. 
                                    Le dirigeant rouvre une nouvelle entité 3 mois plus tard sous un autre nom. Résultat : zéro recours, des créances irrécouvrables et personne pour réparer vos combles.
                                </p>
                                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium flex items-start gap-2 text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>La garantie Expert Vérifié :</strong> Vérification d'existence légale auprès de l'INSEE, de l'ancienneté, de la solvabilité et absence de redressement judiciaire.</span>
                                </div>
                            </div>
                        </div>

                        {/* PIÈGE 3 : FAUSSE DÉCENNALE SANS CVC */}
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-8 space-y-4 hover:border-[#D59B2B]/60 transition-all shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                                    <Droplets className="w-6 h-6 text-rose-600" />
                                </div>
                                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                                    Piège N°3
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2D3D]">
                                3. L'illusion d'être assuré (la fausse décennale sans CVC)
                            </h3>
                            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                                <p>
                                    <strong className="text-rose-700">Le cauchemar vécu :</strong> L'artisan vous tend une feuille d'assurance. Mais en réalité, il n'est assuré que pour de la <em>« peinture »</em> ou de la <em>« plomberie générale »</em> 
                                    pour payer une prime dérisoire. Le jour où un raccord de condensats déborde dans les combles et fait effondrer votre plafond, l'expert d'assurance découvre le pot aux roses et <strong>refuse catégoriquement d'indemniser</strong>.
                                </p>
                                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium flex items-start gap-2 text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>La garantie Expert Vérifié :</strong> Attestation originale vérifiée avec mention obligatoire « Génie Climatique / Réseaux Aérauliques » et attestation de prime payée à jour.</span>
                                </div>
                            </div>
                        </div>

                        {/* PIÈGE 4 : FAUX AVIS & BRICOLEURS NON AGRÉÉS FLUIDES */}
                        <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-8 space-y-4 hover:border-[#D59B2B]/60 transition-all shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                                    <AlertOctagon className="w-6 h-6 text-rose-600" />
                                </div>
                                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                                    Piège N°4
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2D3D]">
                                4. Les faux avis et poseurs sans habilitation fluides (gaz R32)
                            </h3>
                            <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                                <p>
                                    <strong className="text-rose-700">Le cauchemar vécu :</strong> Vous confiez votre installation à un poseur qui n'a pas l'attestation légale de manipulation des fluides frigorigènes. 
                                    Sans tirage au vide soigné, l'humidité résiduelle acidifie l'huile du circuit : le compresseur grille en 4 mois et le fabricant (Daikin, Atlantic) refuse la garantie pièces.
                                </p>
                                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium flex items-start gap-2 text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>La garantie Expert Vérifié :</strong> Attestation de capacité Catégorie I officielle délivrée par Dekra, Veritas ou Cemafroid exigée et vérifiée.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ENCADRÉ VISUEL DESIGN : LE RÉSULTAT QUAND ON CHOISIT UN EXPERT VÉRIFIÉ */}
                    <div className="bg-gradient-to-r from-slate-900 to-[#1F2D3D] text-white p-6 md:p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-5/12 shrink-0 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                            <Image
                                src="/gainable-fr-climatisation-maison-design.png"
                                alt="Intérieur contemporain d'exception avec climatisation gainable invisible installée par un Expert Vérifié"
                                width={550}
                                height={360}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D59B2B]/20 text-[#D59B2B] border border-[#D59B2B]/30 text-xs font-bold">
                                <Home className="w-4 h-4" /> La Sérénité au Quotidien
                            </div>
                            <h4 className="text-xl md:text-3xl font-black font-montserrat text-white leading-snug">
                                Voilà ce que mérite votre maison : <br />
                                <span className="text-[#D59B2B]">Un confort invisible, silencieux et pérenne.</span>
                            </h4>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal">
                                En faisant appel à un <strong>Expert Vérifié Réseau Gainable®</strong>, vous transformez un projet source d'angoisse en une expérience fluide et rassurante. 
                                Vous profitez d'une diffusion d'air ultra-douce, d'une acoustique imperceptible et de la certitude que votre investissement est protégé pour les 15 prochaines années.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3: LES 4 ÉTAPES DE MODÉRATION DOCUMENTAIRE */}
            <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
                <div className="container max-w-6xl mx-auto px-4">
                    
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Modération &amp; Vérification Gainable.fr
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black font-montserrat text-[#1F2D3D] mb-5 tracking-tight">
                            Les 4 Étapes de Modération &amp; Vérification Gainable.fr
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                            Nous ne distribuons pas de macarons de complaisance. Chaque installateur partenaire fait l'objet d'une modération et d'une vérification attentive de ses pièces déclaratives :
                        </p>
                    </div>

                    {/* The 4 Grand Verrous Grid */}
                    <div className="space-y-6">

                        {/* VERROU 01: DÉCENNALE CVC */}
                        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500/60 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                                        01
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase mb-1">
                                            <Shield className="w-3.5 h-3.5" /> Étape 1 • Assurance Chantier
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-[#1F2D3D]">
                                            Assurance Décennale CVC Spécifique & Validée
                                        </h3>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 font-bold text-xs uppercase tracking-wider shrink-0 self-start lg:self-auto border border-emerald-500/20">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Attestation Originale Vérifiée
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Attestation d'assurance de l'année en cours avec vérification des lignes d'activité déclarées : 
                                        mention expresse <strong>« Génie Climatique / Climatisation Réversible / Aéraulique »</strong>. 
                                        La prime doit être à jour pour garantir une couverture active.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Rôle de l'assureur professionnel :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        L'assurance décennale souscrite par l'installateur auprès de sa propre compagnie couvre ses travaux pendant 10 ans selon les conditions de sa police. Gainable.fr n'est pas assureur mais effectue une modération documentaire de l'attestation déclarée.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* VERROU 02: IDENTITÉ & SOLVABILITÉ */}
                        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500/60 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                                        02
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold uppercase mb-1">
                                            <Building2 className="w-3.5 h-3.5" /> Étape 2 • Existence Juridique
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-[#1F2D3D]">
                                            SIRET Actif, Ancienneté & Solvabilité Vérifiée
                                        </h3>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-700 font-bold text-xs uppercase tracking-wider shrink-0 self-start lg:self-auto border border-blue-500/20">
                                    <CheckCircle2 className="w-4 h-4 text-blue-600" /> Registre INSEE & Infogreffe en Direct
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Vérification du numéro SIRET/SIREN, code NAF/APE compatible (4322B Installation de climatisation), 
                                        siège social réel en France, absence de procédure collective ou de radiation, compte bancaire professionnel officiel.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-blue-800 tracking-wider flex items-center gap-1.5">
                                        <Building className="w-4 h-4 text-blue-600" /> Entreprise en direct :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        Vous contractualisez avec une entreprise établie et pérenne. L'ensemble des prestations et devis relèvent de la responsabilité exclusive de l'artisan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* VERROU 03: CAPACITÉ FLUIDES */}
                        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-500/60 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                                        03
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase mb-1">
                                            <Wrench className="w-3.5 h-3.5" /> Étape 3 • Compétence Frigoriste
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-[#1F2D3D]">
                                            Attestation de Capacité Fluides Frigorigènes
                                        </h3>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-700 font-bold text-xs uppercase tracking-wider shrink-0 self-start lg:self-auto border border-amber-500/20">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600" /> Agrément Déposé (Dekra / Veritas / Cemafroid)
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Certificat officiel de manipulation des fluides frigorigènes (Catégorie I). 
                                        Seuls les frigoristes agréés sont autorisés par la réglementation à manipuler les gaz sous pression (R32 / R410A) et raccorder les circuits thermodynamiques.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                                        <Wrench className="w-4 h-4 text-[#D59B2B]" /> Rôle du frigoriste :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        L'artisan engage sa responsabilité professionnelle sur la mise en œuvre technique et le raccordement étanche de votre circuit sous pression, conformément à son habilitation légale.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* VERROU 04: GRANDES MARQUES ET MATÉRIEL OFFICIEL */}
                        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-purple-500/60 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                                        04
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold uppercase mb-1">
                                            <Award className="w-3.5 h-3.5" /> Étape 4 • Matériel Constructeur
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-[#1F2D3D]">
                                            Filière Grandes Marques & Airzone
                                        </h3>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-700 font-bold text-xs uppercase tracking-wider shrink-0 self-start lg:self-auto border border-purple-500/20">
                                    <CheckCircle2 className="w-4 h-4 text-purple-600" /> Daikin, Mitsubishi, Atlantic, Toshiba
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Approvisionnement via les réseaux distributeurs officiels français. 
                                        Maîtrise technique reconnue pour l'intégration des systèmes de zonage Airzone et le calcul acoustique des bouches de soufflage.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-purple-800 tracking-wider flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-purple-600" /> Rôle de l'installateur :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        L'installateur gère en direct avec ses distributeurs l'approvisionnement et l'application des garanties constructeur. Gainable.fr n'étant ni fabricant ni revendeur, le choix du matériel et ses garanties relèvent de la relation contractuelle directe entre le client, l'artisan et le fabricant.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* SECTION 4: LA RELATION DE CONFIANCE (Avec photo Business Handshake) */}
            <section className="py-20 bg-white border-b border-slate-100">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        
                        {/* Text Col */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-50 text-[#D59B2B] text-xs font-bold uppercase tracking-wider">
                                <HeartHandshake className="w-4 h-4" /> Un Vrai Contrat Moral et Technique
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] leading-snug">
                                Retrouvez le plaisir d'échanger avec <br />
                                <span className="text-[#D59B2B]">un véritable artisan de confiance</span>
                            </h2>

                            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
                                Lorsque vous confiez votre projet à un <strong>Expert Vérifié Gainable.fr</strong>, 
                                vous ne parlez pas à une plateforme de télémarketing délocalisée qui cherche à revendre votre numéro de téléphone à 5 démarcheurs en concurrence féroce.
                            </p>

                            <p className="text-slate-600 text-base leading-relaxed">
                                Vous échangez avec une entreprise locale, fière de son travail, qui connaît les contraintes de votre région, 
                                monte dans vos combles pour mesurer la hauteur réelle sous toiture, calcule précisément les pertes de charge aérauliques 
                                et dimensionne chaque grille pour que votre salon soit à 21°C sans le moindre bruit de souffle.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                                    <p className="font-bold text-[#1F2D3D] text-sm mb-1 flex items-center gap-1.5">
                                        <CheckCircle className="w-4 h-4 text-[#D59B2B]" /> Présent avant, pendant ET après
                                    </p>
                                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                        L'artisan vous livre une installation finie, vous forme à l'utilisation du thermostat Airzone et reste joignable pour l'entretien annuel.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                                    <p className="font-bold text-[#1F2D3D] text-sm mb-1 flex items-center gap-1.5">
                                        <Lock className="w-4 h-4 text-emerald-600" /> Décennale authentifiée sur pièces
                                    </p>
                                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                                        Votre réseau de gaines, votre groupe thermodynamique et vos liaisons frigorifiques sont couverts par une police d'assurance active et certifiée.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Image Col (Handshake Business) */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                                <Image
                                    src="/blog/b2b-handshake.png"
                                    alt="Serrage de main et partenariat de confiance pour climatisation gainable"
                                    width={600}
                                    height={450}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/20">
                                    <p className="font-bold text-sm flex items-center gap-2 text-amber-300">
                                        <ShieldCheck className="w-4 h-4 text-amber-300" /> Le respect de la parole donnée
                                    </p>
                                    <p className="text-xs text-slate-200 mt-1">
                                        Un engagement réciproque : un devis clair sans surprise, un travail soigné et un client protégé.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 5: COMPARATIF SERENITE (Avec photo Relation Pro-Client) */}
            <section className="py-20 bg-slate-50/60 border-b border-slate-200">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        
                        {/* Image Col (Client & Pro Handshake / Meeting) */}
                        <div className="lg:col-span-5 order-2 lg:order-1 relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                                <Image
                                    src="/images/relation-pro-client.png"
                                    alt="Client et artisan en climatisation vérifié échangeant en toute confiance"
                                    width={600}
                                    height={450}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/20">
                                    <p className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tranquillité d'esprit absolue
                                    </p>
                                    <p className="text-xs text-slate-200 mt-1">
                                        Vous savez qui entre chez vous, qui pose vos gaines et qui répondra présent si vous avez besoin d'aide.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table Col */}
                        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4" /> La Différence Gainable.fr
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] leading-snug">
                                Pourquoi choisir un artisan <br />
                                <span className="text-[#D59B2B]">labellisé Expert Vérifié ?</span>
                            </h2>

                            <div className="space-y-4 pt-2">
                                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                                        <span>Avec un Expert Vérifié Gainable.fr</span>
                                    </div>
                                    <ul className="text-xs md:text-sm text-slate-700 space-y-2 pl-7 list-disc">
                                        <li><strong>Modération &amp; vérification documentaire sur pièces</strong> : Siret en règle, assurance décennale CVC valide et capacité gaz vérifiée.</li>
                                        <li><strong>Contact direct et transparent</strong> : Aucun intermédiaire commercial, devis au tarif réel de l'artisan sans marge de plateforme.</li>
                                        <li><strong>Étude thermique et acoustique</strong> : Dimensionnement sur-mesure pour éviter les sifflements d'air et la surconsommation électrique.</li>
                                        <li><strong>Grandes marques et mise en service soignée</strong> : Matériel réputé posé par l'artisan dans le respect des règles de l'art.</li>
                                    </ul>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold text-base">
                                        <XCircle className="w-5 h-5 text-slate-400 shrink-0" />
                                        <span>Sur les plateformes de devis généralistes</span>
                                    </div>
                                    <ul className="text-xs md:text-sm text-slate-600 space-y-2 pl-7 list-disc">
                                        <li>Vos coordonnées sont revendues à 3 à 5 entreprises qui vous harcèlent jour et nuit pour vous faire signer d'urgence.</li>
                                        <li>Aucune vérification réelle des polices d'assurance décennale : risque de pose par des sous-traitants non déclarés.</li>
                                        <li>Devis artificiellement bas pour décrocher le chantier, suivis d'avenants exorbitants une fois vos plafonds ouverts.</li>
                                        <li>Entreprises volatiles : au premier problème d'eau ou de bruit, l'interlocuteur ne répond plus ou a liquidé son affaire.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 6: DÉDIÉE AUX PROFESSIONNELS : POURQUOI AVOIR LE BADGE CHANGE TOUT */}
            <section className="py-20 bg-white border-b border-slate-200">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                <Award className="w-4 h-4 text-blue-600" /> Espace Installateurs & Bureaux d'Études
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] leading-tight">
                                Vous êtes un installateur sérieux ? <br />
                                <span className="text-[#D59B2B]">Ne laissez plus les poseurs sauvages voler vos chantiers.</span>
                            </h2>

                            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
                                Vous payez vos assurances décennales au prix fort. Vous formez vos techniciens, vous prenez le temps de soigner vos plenums, 
                                vous équilibrez vos débits d'air et vous répondez au téléphone même deux ans après la fin du chantier.
                            </p>

                            <p className="text-slate-600 text-base leading-relaxed">
                                Et pourtant, face à des clients méfiants échaudés par les scandales du bâtiment, vous devez sans cesse vous justifier face à des concurrents 
                                qui cassent les prix de 30% parce qu’ils n'ont ni assurance, ni charges, ni SAV. 
                                <strong> Le Badge Expert Vérifié est votre arme de différenciation massive :</strong>
                            </p>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                                    <p className="text-sm text-slate-700">
                                        <strong>Crédibilité immédiate auprès du particulier :</strong> Le client voit le badge indépendant et sait instantanément que vous n'êtes pas un arnaqueur éphémère.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                                    <p className="text-sm text-slate-700">
                                        <strong>Défendez votre juste valeur :</strong> Expliquez simplement pourquoi votre devis est sérieux et pérenne comparé aux poseurs sans garantie.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
                                    <p className="text-sm text-slate-700">
                                        <strong>0 % de commission sur vos affaires :</strong> Vous restez 100% maître de vos tarifs, de votre relation client et de votre marge.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link href="/inscription">
                                    <Button size="lg" className="bg-[#1F2D3D] hover:bg-slate-800 text-white px-8 py-6 rounded-2xl font-black text-base shadow-xl transition-all hover:scale-105">
                                        Candidater pour obtenir le Badge Expert Vérifié
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
                                <Image
                                    src="/blog/gainable-fr-climatisation-artisan-client-partenaire.png"
                                    alt="Installateur sérieux valorisé par le label Expert Vérifié Gainable.fr"
                                    width={600}
                                    height={450}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/20">
                                    <p className="font-bold text-sm flex items-center gap-2 text-amber-300">
                                        <Award className="w-4 h-4 text-amber-300" /> Valorisez votre savoir-faire
                                    </p>
                                    <p className="text-xs text-slate-200 mt-1">
                                        Rejoignez le réseau des installateurs CVC les plus recommandés de France.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 7: CONDITIONS D'OBTENTION (CONTRASTES ÉCLATANTS & LISIBILITÉ PARFAITE) */}
            <section className="py-20 bg-[#1F2D3D] text-white">
                <div className="container max-w-5xl mx-auto px-4 text-center">
                    
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D59B2B]/20 text-[#D59B2B] text-xs font-bold uppercase tracking-wider mb-4 border border-[#D59B2B]/30">
                        <ShieldCheck className="w-4 h-4" /> Critères d'Excellence & Transparence
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black font-montserrat text-white mb-4">
                        Conditions d'obtention du Label <span className="text-[#D59B2B]">Gainable.fr</span>
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-14 font-normal">
                        Nous ne transigeons pas avec la sécurité des foyers. Voici la liste des prérequis administratifs 
                        et qualitatifs exigés sur pièces justificatives pour tout installateur ou bureau d'études partenaire.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {/* DOCS OBLIGATOIRES */}
                        <div className="bg-slate-800/95 border-2 border-slate-700/80 p-8 rounded-3xl shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                                <div className="w-12 h-12 rounded-2xl bg-[#D59B2B]/20 text-[#D59B2B] flex items-center justify-center font-bold">
                                    <FileText className="w-6 h-6 text-[#D59B2B]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Documents Obligatoires</h3>
                                    <p className="text-xs text-slate-400 font-normal">Fournis et vérifiés lors de la modération</p>
                                </div>
                            </div>
                            
                            <ul className="space-y-4 text-slate-100 text-sm font-medium">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">SIREN / SIRET actif auprès de l'INSEE sans antécédent de faillite suspecte</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Numéro de TVA intracommunautaire officiel et compte bancaire professionnel</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Attestation d'Assurance Décennale & RC Pro couvrant expressément le Génie Climatique</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Attestation de capacité fluides frigorigènes (Catégorie I manipulation gaz)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Fourniture de matériel certifié grandes marques (Daikin, Mitsubishi, Atlantic, etc.)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Périmètre d'intervention géographique clairement délimité pour garantir le SAV local</span>
                                </li>
                            </ul>
                        </div>

                        {/* ENGAGEMENTS QUALITÉ */}
                        <div className="bg-slate-800/95 border-2 border-slate-700/80 p-8 rounded-3xl shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                    <Award className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Engagements Déontologiques</h3>
                                    <p className="text-xs text-slate-400 font-normal">Charte de confiance signée par le dirigeant</p>
                                </div>
                            </div>

                            <ul className="space-y-4 text-slate-100 text-sm font-medium">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Respect scrupuleux des DTU aérauliques et des règles de sécurité électrique</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Bilan thermique réel pour éviter le sous-dimensionnement ou les sifflements de gaines</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Transparence totale des devis : distinction claire équipement / main-d'œuvre</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Respect strict des délais d'exécution et propreté irréprochable du chantier</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Charte d'écoute client et proposition systématique d'un contrat d'entretien</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Interdiction formelle de sous-traitance clandestine sans l'accord écrit du client</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/trouver-installateur">
                            <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white px-9 py-6 text-base rounded-full shadow-xl font-black transition-all hover:scale-105">
                                Consulter les Experts Vérifiés de ma région
                            </Button>
                        </Link>
                        <Link href="/inscription">
                            <Button size="lg" variant="outline" className="border-slate-500 bg-slate-800 text-white hover:bg-slate-700 px-8 py-6 text-base rounded-full font-bold transition-all">
                                Postuler au Label (Espace Installateurs)
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 8: FAQ RASSURANCE SANS LANGUE DE BOIS */}
            <section className="py-20 bg-white">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <HelpCircle className="w-4 h-4" /> Réponses Sans Détours
                        </div>
                        <h2 className="text-3xl font-black font-montserrat text-[#1F2D3D]">
                            Questions Fréquentes sur l'Expert Vérifié
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Que risque un propriétaire si l'installateur n'a pas la bonne décennale ?",
                                a: "Si l'artisan n'a qu'une assurance générale (ex: plomberie simple ou peinture) et non génie climatique, en cas de sinistre majeur (fuite d'eau destructrice au plafond, incendie électrique lié à un compresseur mal raccordé), la compagnie d'assurance refusera d'indemniser. Vous devrez payer l'intégralité des réparations de votre poche et engager des années de procédure judiciaire contre un artisan souvent insolvable."
                            },
                            {
                                q: "Pourquoi les devis sur Gainable.fr ne subissent-ils aucune commission cachée ?",
                                a: "Contrairement aux plateformes de courtage qui prélèvent entre 8 % et 15 % de commission sur les travaux (ce qui gonfle artificiellement la facture du client), Gainable.fr fonctionne comme un réseau de confiance indépendant. Vous traitez directement avec le gérant de l'entreprise locale sans aucun intermédiaire ni surtaxe."
                            },
                            {
                                q: "Quel est le rôle exact de Gainable.fr ?",
                                a: "Gainable.fr est une plateforme indépendante de mise en relation directe. Gainable.fr n'est ni fabricant de matériel, ni installateur, ni assureur. Nous n'intervenons pas dans les relations contractuelles, devis, exécution des travaux, garanties matérielles, pannes ou éventuels litiges entre le client et l'artisan. Chaque entreprise reste seule responsable de ses prestations et de ses garanties."
                            },
                            {
                                q: "Que se passe-t-il si un professionnel ne respecte plus les critères du label ?",
                                a: "Le label 'Expert Vérifié' est basé sur la modération et la vérification attentive des pièces justificatives fournies (SIRET actif, attestation décennale CVC valide, capacité fluides). En cas de document caduc ou de manquement constaté, le badge est suspendu et la fiche désactivée."
                            },
                            {
                                q: "Je suis installateur : quel est l'intérêt concret pour moi d'obtenir le badge ?",
                                a: "Le badge 'Expert Vérifié' lève immédiatement le premier frein de vos prospects : la peur de se tromper d'artisan. Il prouve votre sérieux, valorise vos assurances et vous permet de signer vos devis à votre juste prix sans avoir à brader vos marges face à des poseurs sauvages non déclarés."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                                <h4 className="font-bold text-[#1F2D3D] text-base flex items-start gap-3">
                                    <span className="text-[#D59B2B] font-bold">Q.</span>
                                    <span>{item.q}</span>
                                </h4>
                                <p className="text-slate-600 text-sm leading-relaxed pl-7 font-normal">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
