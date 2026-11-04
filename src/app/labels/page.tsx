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
    Lock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { VerifiedExpertBadge } from "@/components/ui/verified-expert-badge";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
    description: "Découvrez le label Expert Vérifié Gainable.fr : comment notre contrôle documentaire rigoureux protège les particuliers contre les entreprises éphémères, les fausses décennales et les abandons de SAV.",
    openGraph: {
        title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
        description: "Découvrez le label Expert Vérifié Gainable.fr : comment notre contrôle documentaire rigoureux protège les particuliers contre les entreprises éphémères, les fausses décennales et les abandons de SAV.",
        images: ['/gainable-fr-label-qualite-climatisation-rge.png'],
        type: 'website',
    },
    twitter: {
        card: "summary_large_image",
        title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
        description: "Découvrez le label Expert Vérifié Gainable.fr : comment notre contrôle documentaire rigoureux protège les particuliers contre les entreprises éphémères, les fausses décennales et les abandons de SAV.",
    },
    alternates: {
        canonical: "https://www.gainable.fr/labels",
    }
};

export default function LabelsPage() {
    return (
        <div className="flex min-h-screen flex-col font-sans text-[#1F2D3D] bg-white">

            {/* HERO SECTION */}
            <section className="relative min-h-[520px] flex items-center justify-center py-20 px-4 overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/gainable-fr-label-qualite-climatisation-rge.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-[#1F2D3D]/95"></div>
                </div>

                <div className="container relative z-10 mx-auto text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 p-2.5 px-6 rounded-full bg-[#D59B2B] text-white font-black text-xs md:text-sm tracking-wider mb-6 uppercase shadow-xl">
                        <ShieldCheck className="w-4 h-4 text-white" />
                        Gage de Confiance • Protection Client • Distinction Artisan
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
                        Le Label <strong>Expert Vérifié Réseau Gainable®</strong> a été conçu pour filtrer sur pièces justificatives les entreprises sérieuses, 
                        protéger les familles contre les poseurs fantômes et valoriser les artisans qui ont le courage d’être irréprochables.
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

            {/* SECTION CHOC : LA RÉALITÉ DU MARCHÉ (LE CONSTAT SANS FILTRE) */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="container max-w-6xl mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider mb-4">
                            <AlertTriangle className="w-4 h-4 text-rose-400" /> Ce que personne n'ose vous dire sur le secteur
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black font-montserrat text-white mb-6 leading-tight">
                            Pourquoi tant de particuliers <br />
                            <span className="text-rose-400">vivent un cauchemar avec leur climatisation ?</span>
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
                            La climatisation gainable est un métier d’ingénierie et de précision frigorifique. 
                            Pourtant, le marché a attiré des démarcheurs sans scrupules et des poseurs improvisés. 
                            Voici les 4 réalités brutales auxquelles des centaines de clients se heurtent chaque mois :
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-14">
                        {/* PIÈGE 1 : L'ARTISAN FANTÔME DÈS LA FACTURE PAYÉE */}
                        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-rose-500/50 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                                <PhoneOff className="w-6 h-6 text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>1. Le syndrome de l'artisan « fantôme » dès le solde encaissé</span>
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Tant qu’il faut faire signer le bon de commande et encaisser l’acompte, il vous répond dans les 5 minutes, 
                                se montre disponible et chaleureux. 
                                Mais quand le premier coup de froid arrive en décembre et que l’appareil se bloque avec un code erreur <strong>U4</strong> ou <strong>E3</strong>... 
                                le téléphone sonne dans le vide. 
                                Les messages vocaux restent sans réponse, les emails reviennent en échec, et votre numéro finit par être bloqué. 
                                Vous avez versé 12 000 € et vous vous retrouvez seul, en plein hiver, avec une maison glacée.
                            </p>
                        </div>

                        {/* PIÈGE 2 : LES LIQUIDATIONS ORGANISÉES ET SOCIÉTÉS ÉPHÉMÈRES */}
                        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-rose-500/50 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                                <Building className="w-6 h-6 text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>2. Les sociétés éphémères et les liquidations opportunistes</span>
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                C'est la plaie numéro un du bâtiment : des structures commerciales montées de toutes pièces, 
                                qui sous-traitent à la chaîne des installations à bas coût sans respecter les DTU. 
                                Dès que les premières malfaçons éclatent, que les clients mécontents s’organisent ou que les mises en demeure pleuvent, 
                                la société est mise en <strong>liquidation judiciaire express</strong>. 
                                Le dirigeant rouvre une nouvelle entité 3 mois plus tard sous un autre nom. 
                                Résultat pour vous ? Zéro recours juridique, des créances irrécouvrables et personne pour réparer vos combles.
                            </p>
                        </div>

                        {/* PIÈGE 3 : LE PIÈGE DE LA FAUSSE DÉCENNALE OU NON COUVERTE */}
                        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-rose-500/50 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                                <Droplets className="w-6 h-6 text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>3. L'illusion d'être assuré (la décennale inapplicable)</span>
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                L'artisan vous a remis une attestation d'assurance ? Mais avez-vous vérifié ses lignes d'activités déclarées ? 
                                Beaucoup d’entreprises souscrivent une assurance minimale pour de la <em>« peinture »</em> ou de la <em>« plomberie sanitaire générale »</em> 
                                pour payer une prime réduite, mais ne déclarent jamais l’activité <strong>Génie Climatique / Fluides sous pression</strong>. 
                                Le jour où un bac à condensats déborde dans les combles, inonde le faux-plafond du salon et détruit votre mobilier, 
                                l’expert d’assurance découvre la supercherie et <strong>refuse catégoriquement d’indemniser</strong>. Vous payez l'intégralité des dégâts.
                            </p>
                        </div>

                        {/* PIÈGE 4 : L'ABSENCE D'AVIS OU LES FAUX COMMENTAIRES FABRIQUÉS */}
                        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-rose-500/50 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
                                <AlertOctagon className="w-6 h-6 text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>4. Les avis fantômes et le danger des faux frigoristes</span>
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Des fiches créées il y a trois semaines avec 5 avis complaisants d’amis, ou au contraire une absence totale d’antécédents vérifiables. 
                                Vous devenez le cobaye d’un installateur qui n'a ni diplôme thermique ni l'<strong>Attestation d'aptitude aux fluides frigorigènes</strong> 
                                obligatoire par la loi (manipulation de gaz R32 sous 30 bars de pression). 
                                Un raccord dudgeon mal serré, une liaison mal isolée qui crée de la moisissure toxique dans vos gaines : les conséquences sur votre santé et votre portefeuille sont dramatiques.
                            </p>
                        </div>
                    </div>

                    {/* ENCADRÉ CONSTAT PHOTO */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-850 p-6 md:p-8 rounded-3xl border border-slate-700 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                        <div className="w-full md:w-1/3 shrink-0 rounded-2xl overflow-hidden border-2 border-slate-600 shadow-lg">
                            <Image
                                src="/blog/gainable-fr-climatisation-dangers-installation.png"
                                alt="Dangers et malfaçons des installations de climatisation non vérifiées"
                                width={450}
                                height={300}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-amber-400" /> C’est pour briser ce cercle vicieux que le Réseau Gainable existe
                            </h4>
                            <p className="text-slate-200 text-sm md:text-base leading-relaxed font-normal">
                                Nous refusons que le confort thermique de votre foyer dépende de la chance. 
                                Le label <strong>Expert Vérifié</strong> sépare le bon grain de l’ivraie : seules les entreprises ayant fourni 
                                des justificatifs conformes de pérennité, d'assurance décennale spécifique et signé notre charte d'engagement client obtiennent le macaron officiel.
                            </p>
                        </div>
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

            {/* SECTION 2: LE PROTOCOLE DE CONTRÔLE SUR PIÈCES EN 5 ÉTAPES */}
            <section className="py-20 bg-slate-50 border-b border-slate-200/60">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <Shield className="w-4 h-4" /> Filtre d'admission rigoureux
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-4">
                            Le Protocole de Contrôle Documentaire Gainable.fr
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg">
                            Nous ne distribuons pas de labels de complaisance. Chaque installateur partenaire est vérifié sur pièces en 5 étapes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                step: "01",
                                title: "Existence Juridique & Solvabilité",
                                desc: "Contrôle en direct des registres légaux (INSEE / Infogreffe). Nous écartons toute entreprise en redressement, radiée ou créée il y a moins de quelques mois sans garanties solides.",
                                icon: <Building2 className="w-6 h-6 text-[#D59B2B]" />
                            },
                            {
                                step: "02",
                                title: "Assurance Décennale CVC Vérifiée",
                                desc: "Attestation originale exigée avec contrôle des lignes de garantie spécifiques au génie climatique, aux pompes à chaleur et aux réseaux aérauliques.",
                                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            },
                            {
                                step: "03",
                                title: "Capacité Fluides Frigorigènes",
                                desc: "Vérification de l'attestation de capacité (gaz R32 / R410A) délivrée par un organisme agréé (Bureau Veritas, Dekra, Cemafroid), indispensable pour poser légalement.",
                                icon: <FileText className="w-6 h-6 text-blue-600" />
                            },
                            {
                                step: "04",
                                title: "Grandes Marques & Régulation",
                                desc: "Expérience éprouvée sur les fabricants majeurs (Daikin, Mitsubishi Electric, Atlantic, Toshiba, Panasonic) et maîtrise des systèmes de zonage Airzone.",
                                icon: <Award className="w-6 h-6 text-amber-500" />
                            },
                            {
                                step: "05",
                                title: "Charte de Déontologie & SAV",
                                desc: "Signature d'un engagement moral strict : devis détaillé transparent, interdiction de la sous-traitance opaque, écoute et obligation de suivi post-livraison.",
                                icon: <CheckCircle2 className="w-6 h-6 text-purple-600" />
                            },
                            {
                                step: "★",
                                title: "Mise à Jour Régulière",
                                desc: "En cas de litige client avéré non résolu ou de caducité d'assurance décennale, le badge de l'installateur est immédiatement désactivé de notre répertoire.",
                                icon: <Clock className="w-6 h-6 text-rose-500" />
                            }
                        ].map((card, idx) => (
                            <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        {card.icon}
                                    </div>
                                    <span className="text-xl font-black text-slate-300 font-mono">{card.step}</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#1F2D3D] pt-2">{card.title}</h3>
                                <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-normal">{card.desc}</p>
                            </div>
                        ))}
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

                                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                                    <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
                                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
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
