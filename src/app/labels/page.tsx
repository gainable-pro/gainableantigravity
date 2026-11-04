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
    description: "Découvrez le label Expert Vérifié Gainable.fr : notre protocole de contrôle sur pièces pour protéger les particuliers et valoriser les meilleurs installateurs CVC.",
    openGraph: {
        title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
        description: "Découvrez le label Expert Vérifié Gainable.fr : notre protocole de contrôle sur pièces pour protéger les particuliers et valoriser les meilleurs installateurs CVC.",
        images: ['/gainable-fr-label-qualite-climatisation-rge.png'],
        type: 'website',
    },
    twitter: {
        card: "summary_large_image",
        title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
        description: "Découvrez le label Expert Vérifié Gainable.fr : notre protocole de contrôle sur pièces pour protéger les particuliers et valoriser les meilleurs installateurs CVC.",
    },
    alternates: {
        canonical: "https://www.gainable.fr/labels",
    }
};

export default function LabelsPage() {
    return (
        <div className="flex min-h-screen flex-col font-sans text-[#1F2D3D] bg-white">

            {/* HERO SECTION */}
            <section className="relative min-h-[540px] flex items-center justify-center py-20 px-4 overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/gainable-fr-label-qualite-climatisation-rge.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-[#1F2D3D]/95"></div>
                </div>

                <div className="container relative z-10 mx-auto text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 p-2.5 px-6 rounded-full bg-[#D59B2B] text-white font-black text-xs md:text-sm tracking-wider mb-6 uppercase shadow-xl">
                        <ShieldCheck className="w-4 h-4 text-white" />
                        Gage de Confiance • Sérénité Client • Distinction Artisan
                    </div>

                    {/* Premier affichage officiel du Badge en haut de page */}
                    <div className="flex justify-center mb-8">
                        <div className="p-2.5 sm:p-3.5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                            <VerifiedExpertBadge size="md" />
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight uppercase font-montserrat text-white">
                        Installer une climatisation gainable en toute <br />
                        <span className="text-[#D59B2B] normal-case block mt-3 font-extrabold text-2xl md:text-4xl">
                            sérénité, transparence et confiance
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-normal leading-relaxed">
                        Un système gainable s’intègre discrètement dans vos plafonds et vos combles pour vous offrir un confort thermique absolu pendant plus de 15 ans. 
                        Le Label <strong>Expert Vérifié Réseau Gainable®</strong> sélectionne sur pièces justificatives des entreprises solides, 
                        assurées et engagées pour vous garantir un chantier impeccable sans mauvaise surprise.
                    </p>

                    {/* 3 Reassurance Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
                        {[
                            { 
                                title: "Garantie Décennale Contrôlée", 
                                desc: "Attestation CVC en cours de validité vérifiée sur pièces justificatives" 
                            },
                            { 
                                title: "Entreprise Solide & Active", 
                                desc: "SIRET actif à l'INSEE, antécédents contrôlés, zéro société éphémère" 
                            },
                            { 
                                title: "Interlocuteur Dédié & SAV", 
                                desc: "L'artisan répond après la facture, 0 % commission intermédiaire" 
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

            {/* SECTION CLAIRE & POSITIVE : LES 4 POINTS DE VIGILANCE ESSENTIELS */}
            <section className="py-20 bg-slate-50/60 border-b border-slate-250">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                            <Star className="w-4 h-4 text-[#D59B2B] fill-current" /> Choisir en toute lucidité
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black font-montserrat text-[#1F2D3D] mb-5 leading-tight">
                            Les 4 points clés pour réussir <br />
                            <span className="text-[#D59B2B]">votre installation de climatisation</span>
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">
                            Une climatisation gainable est un investissement valorisant pour votre patrimoine. 
                            Voici les 4 critères indispensables que nous vérifions systématiquement pour vous épargner les déconvenues courantes du marché :
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {/* POINT 1 : CONTINUITÉ DU SAV */}
                        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 space-y-3 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-[#D59B2B] flex items-center justify-center font-black">
                                    <PhoneCall className="w-6 h-6 text-[#D59B2B]" />
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ✓ Suivi Assuré
                                </span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-[#1F2D3D] pt-2">
                                1. Un véritable service après-vente dans la durée
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Un installateur digne de confiance ne disparaît pas une fois la facture soldée. 
                                Nos membres s'engagent à assurer la mise en service, le réglage fin de vos télécommandes de zones 
                                et à répondre présent lors des visites de maintenance saisonnière.
                            </p>
                        </div>

                        {/* POINT 2 : SOLIDITÉ ET PÉRENNITÉ DE L'ENTREPRISE */}
                        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 space-y-3 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ✓ Entreprise Établie
                                </span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-[#1F2D3D] pt-2">
                                2. Des sociétés pérennes avec pignon sur rue
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Nous écartons les structures éphémères créées il y a quelques mois sans historique. 
                                Chaque artisan du réseau dispose d'un numéro SIRET actif vérifié à l'INSEE, 
                                d'un ancrage local solide et d'une réputation reconnue dans son département.
                            </p>
                        </div>

                        {/* POINT 3 : ASSURANCE DÉCENNALE SPÉCIFIQUE */}
                        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 space-y-3 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ✓ Couverture 10 ans
                                </span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-[#1F2D3D] pt-2">
                                3. Une garantie décennale couvrant expressément le CVC
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Pas de demi-mesure : nous contrôlons l'attestation décennale originale pour certifier qu'elle couvre bien 
                                le génie climatique et les réseaux aérauliques. Votre maison et vos faux-plafonds sont protégés à 100 %.
                            </p>
                        </div>

                        {/* POINT 4 : QUALIFICATION FRIGORISTE */}
                        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 space-y-3 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black">
                                    <Wrench className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ✓ Habilitation Fluides
                                </span>
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-[#1F2D3D] pt-2">
                                4. Des techniciens habilités à manipuler les fluides
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                La pose d'une pompe à chaleur nécessite un tirage au vide soigné et des liaisons parfaitement étanches. 
                                Les entreprises vérifiées possèdent l'attestation de capacité officielle délivrée par un organisme agréé d'État.
                            </p>
                        </div>
                    </div>

                    {/* ENCADRÉ VISUEL POSITIF & VALORISANT (Intérieur Design Lumineux) */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-slate-200 flex flex-col md:flex-row items-center gap-8 shadow-xl">
                        <div className="w-full md:w-5/12 shrink-0 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                            <Image
                                src="/gainable-fr-climatisation-maison-design.png"
                                alt="Intérieur moderne et lumineux avec climatisation gainable parfaitement intégrée"
                                width={550}
                                height={360}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                                <Home className="w-4 h-4 text-emerald-600" /> L'Excellence du Confort Invisible
                            </div>
                            <h4 className="text-xl md:text-2xl font-black font-montserrat text-[#1F2D3D]">
                                Le plaisir d'un intérieur sublimé, silencieux et tempéré toute l'année
                            </h4>
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                                En choisissant un <strong>Expert Vérifié Gainable.fr</strong>, vous faites le choix de l’artisanat d'excellence : 
                                des diffuseurs d'air esthétiques intégrés au plafond, une température régulée pièce par pièce, 
                                et la certitude d’avoir un professionnel fiable pour prendre soin de votre maison.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: LE BOUCLIER DE SÉCURITÉ EN 5 VERROUS (VERSION HAUT DE GAMME & ULTRA-DÉTAILLÉE) */}
            <section className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-200">
                <div className="container max-w-6xl mx-auto px-4">
                    
                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-black uppercase tracking-wider mb-4 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Le Protocole Gainable.fr
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black font-montserrat text-[#1F2D3D] mb-5 tracking-tight">
                            5 Verrous de Contrôle sur Pièces Justificatives
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                            Chaque installateur candidat au label fait l'objet d'une vérification documentaire rigoureuse avant publication. 
                            Voici exactement ce que nous examinons, et la garantie concrète que cela vous apporte :
                        </p>
                    </div>

                    {/* The 5 Grand Verrous Grid */}
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
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Attestation Originale Contrôlée
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <p className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                                        <FileCheck2 className="w-4 h-4 text-emerald-600" /> Ce que nous vérifions sur pièces :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Attestation d'assurance de l'année en cours avec contrôle des lignes d'activité déclarées : 
                                        mention expresse <strong>« Génie Climatique / Climatisation Réversible / Aéraulique »</strong>. 
                                        La prime doit être à jour pour garantir une couverture active.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> Votre garantie sérénité :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        En cas de sinistre imprévu (fuite au bac de condensats dans les combles, incident électrique), 
                                        la compagnie d'assurance prend en charge les réparations sans contestation. Votre investissement est protégé pendant 10 ans.
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
                                    <p className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                                        <FileCheck2 className="w-4 h-4 text-blue-600" /> Ce que nous vérifions sur pièces :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Vérification du numéro SIRET/SIREN, code NAF/APE compatible (4322B Installation de climatisation), 
                                        siège social réel en France, absence de procédure collective ou de radiation, compte bancaire professionnel officiel.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-blue-800 tracking-wider flex items-center gap-1.5">
                                        <Building className="w-4 h-4 text-blue-600" /> Votre garantie sérénité :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        Vous contractualisez avec une véritable entreprise établie et pérenne. Vos acomptes sont sécurisés 
                                        et votre interlocuteur sera toujours là pour vous accompagner dans la durée.
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
                                    <p className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                                        <FileCheck2 className="w-4 h-4 text-amber-600" /> Ce que nous vérifions sur pièces :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Certificat officiel de manipulation des fluides frigorigènes (Catégorie I). 
                                        Seuls les frigoristes agréés sont autorisés par la réglementation à manipuler les gaz sous pression (R32 / R410A) et raccorder les circuits thermodynamiques.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-amber-800 tracking-wider flex items-center gap-1.5">
                                        <Wrench className="w-4 h-4 text-[#D59B2B]" /> Votre garantie sérénité :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        Le tirage au vide, les raccords dudgeon et la mise en service sont exécutés dans les règles de l'art. 
                                        Le compresseur fonctionne à son rendement optimal sans surconsommation d'énergie.
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
                                            Filière Officielle Grandes Marques & Airzone
                                        </h3>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 text-purple-700 font-bold text-xs uppercase tracking-wider shrink-0 self-start lg:self-auto border border-purple-500/20">
                                    <CheckCircle2 className="w-4 h-4 text-purple-600" /> Daikin, Mitsubishi, Atlantic, Toshiba
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <p className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                                        <FileCheck2 className="w-4 h-4 text-purple-600" /> Ce que nous vérifions sur pièces :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Approvisionnement exclusif via les réseaux distributeurs officiels français. 
                                        Maîtrise technique reconnue pour l'intégration des systèmes de zonage Airzone et le calcul acoustique des bouches de soufflage.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-purple-800 tracking-wider flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-purple-600" /> Votre garantie sérénité :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        Vous bénéficiez des garanties officielles constructeur (jusqu'à 5 ans sur le compresseur) et de la disponibilité immédiate 
                                        de toutes les pièces détachées d'origine en cas de besoin.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* VERROU 05: CHARTE DÉONTOLOGIQUE ET ENGAGEMENT SAV */}
                        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-500/60 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                                <div className="flex items-start sm:items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-[#D59B2B] text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                                        05
                                    </div>
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold uppercase mb-1">
                                            <HeartHandshake className="w-3.5 h-3.5" /> Étape 5 • Éthique & SAV
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black text-[#1F2D3D]">
                                            Charte Déontologique : Écoute & Suivi Client
                                        </h3>
                                    </div>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-[#D59B2B] font-bold text-xs uppercase tracking-wider shrink-0 self-start lg:self-auto border border-amber-500/20">
                                    <CheckCircle2 className="w-4 h-4 text-[#D59B2B]" /> Engagement de Réactivité Signé
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-6">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                    <p className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                                        <FileCheck2 className="w-4 h-4 text-[#D59B2B]" /> Ce que nous vérifions sur pièces :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        Signature d'une charte de qualité : devis transparent et détaillé, interdiction formelle de sous-traitance clandestine, 
                                        formation du client lors de la réception des travaux et engagement d'intervention sous 48h en cas de dysfonctionnement.
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                                    <p className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                                        <ThumbsUp className="w-4 h-4 text-[#D59B2B]" /> Votre garantie sérénité :
                                    </p>
                                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                                        Un interlocuteur respectueux de votre logement, joignable et engagé. En cas de manquement répété à la charte, 
                                        le badge du professionnel est suspendu sans délai.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Trust Banner Callout */}
                    <div className="mt-12 bg-gradient-to-r from-slate-900 to-[#1F2D3D] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center md:text-left">
                            <p className="text-amber-400 font-bold text-sm flex items-center justify-center md:justify-start gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" /> Une Sélection Réelle & Documentée
                            </p>
                            <h4 className="text-xl md:text-2xl font-black font-montserrat">
                                Plus de 35 % des dossiers de candidature sont refusés
                            </h4>
                            <p className="text-slate-300 text-sm max-w-2xl font-normal">
                                Nous refusons systématiquement toute entreprise qui ne peut fournir ses attestations décennales à jour ou dont l'activité CVC n'est pas formellement couverte.
                            </p>
                        </div>
                        <Link href="/trouver-installateur" className="shrink-0">
                            <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white font-black px-8 py-6 rounded-2xl shadow-lg transition-all hover:scale-105">
                                Voir les installateurs validés
                            </Button>
                        </Link>
                    </div>

                </div>
            </section>

            {/* SECTION 1: LA RELATION DE CONFIANCE (Avec 1ère photo Business Handshake) */}
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

            {/* SECTION 3: COMPARATIF SERENITE (Avec 2ème photo Relation Pro-Client) */}
            <section className="py-20 bg-white border-b border-slate-100">
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
                                        <li><strong>Contrôle documentaire sur pièces</strong> : Siret en règle, assurance décennale CVC valide et capacité gaz vérifiée.</li>
                                        <li><strong>Contact direct et transparent</strong> : Aucun intermédiaire commercial, devis au tarif réel de l'artisan sans marge de plateforme.</li>
                                        <li><strong>Étude thermique et acoustique</strong> : Dimensionnement sur-mesure pour éviter les sifflements d'air et la surconsommation électrique.</li>
                                        <li><strong>Garantie constructeur et SAV durable</strong> : Matériel officiel, mise en service conforme et présence assurée au fil des années.</li>
                                    </ul>
                                </div>

                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                                    <div className="flex items-center gap-2 text-slate-700 font-bold text-base">
                                        <XCircle className="w-5 h-5 text-slate-400 shrink-0" />
                                        <span>Sur les plateformes de devis généralistes</span>
                                    </div>
                                    <ul className="text-xs md:text-sm text-slate-600 space-y-2 pl-7 list-disc">
                                        <li>Vos coordonnées sont revendues à 3 à 5 entreprises qui vous harcèlent jour et nuit pour vous faire signer d'urgence.</li>
                                        <li>Aucun contrôle réel des polices d'assurance décennale : risque de pose par des sous-traitants non déclarés.</li>
                                        <li>Devis artificiellement bas pour décrocher le chantier, suivis d'avenants exorbitants une fois vos plafonds ouverts.</li>
                                        <li>Entreprises volatiles : au premier problème d'eau ou de bruit, l'interlocuteur ne répond plus ou a liquidé son affaire.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 4: LE BADGE EN ACTION AVEC BATTEMENT DE COEUR */}
            <section className="py-20 bg-slate-50 border-b border-slate-200/60">
                <div className="container max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-4 h-4 text-[#D59B2B]" /> Signature Visuelle de Confiance
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-4">
                        Le Badge Officiel « Expert Vérifié »
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mb-10">
                        Repérez ce macaron officiel sur les fiches des professionnels et sur leurs véhicules d'intervention. 
                        Le battement de cœur régulier du badge signale une entreprise active, dont les pièces justificatives et assurances ont été contrôlées.
                    </p>

                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xl max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6">
                        <VerifiedExpertBadge size="lg" />
                        <div className="pt-4 border-t border-slate-100 text-xs md:text-sm text-slate-500 max-w-md">
                            Ce badge est une marque déposée propriété exclusive de Gainable.fr. Toute reproduction ou affichage frauduleux 
                            par une entreprise non vérifiée fait l’objet de poursuites judiciaires immédiates.
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION DÉDIÉE AUX PROFESSIONNELS : POURQUOI AVOIR LE BADGE CHANGE TOUT */}
            <section className="py-20 bg-white border-b border-slate-200/70">
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

            {/* SECTION 5: CONDITIONS D'OBTENTION (CONTRASTES ÉCLATANTS & LISIBILITÉ PARFAITE) */}
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
                                    <p className="text-xs text-slate-400 font-normal">Fournis et contrôlés avant validation</p>
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
                                    <span className="text-white">Engagement formel de réponse au SAV sous 48h en cas de dysfonctionnement</span>
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

            {/* SECTION 6: FAQ RASSURANCE SANS LANGUE DE BOIS */}
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
                                q: "Comment réagissez-vous si un artisan labellisé fait le mort après le paiement ?",
                                a: "La charte Gainable.fr est formelle : tout refus injustifié d'assurer le service après-vente ou comportement fantôme entraîne la suspension immédiate du badge 'Expert Vérifié' et la radiation de la plateforme. La réputation de notre réseau passe avant tout."
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
