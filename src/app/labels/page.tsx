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
    Building2 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { VerifiedExpertBadge } from "@/components/ui/verified-expert-badge";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
    description: "Découvrez le label Expert Vérifié Gainable.fr : des installateurs CVC rigoureusement audités pour la qualité, la conformité légale, l'assurance décennale et l'expertise en climatisation gainable.",
    openGraph: {
        title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
        description: "Découvrez le label Expert Vérifié Gainable.fr : des installateurs CVC rigoureusement audités pour la qualité, la conformité légale, l'assurance décennale et l'expertise en climatisation gainable.",
        images: ['/gainable-fr-label-qualite-climatisation-rge.png'],
        type: 'website',
    },
    twitter: {
        card: "summary_large_image",
        title: "Label Expert Vérifié Gainable.fr : La Référence Qualité en Climatisation",
        description: "Découvrez le label Expert Vérifié Gainable.fr : des installateurs CVC rigoureusement audités pour la qualité, la conformité légale, l'assurance décennale et l'expertise en climatisation gainable.",
    },
    alternates: {
        canonical: "https://www.gainable.fr/labels",
    }
};

export default function LabelsPage() {
    return (
        <div className="flex min-h-screen flex-col font-sans text-[#1F2D3D] bg-white">

            {/* HERO SECTION */}
            <section className="relative min-h-[460px] flex items-center justify-center py-20 px-4 overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/gainable-fr-label-qualite-climatisation-rge.png')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/80 to-[#1F2D3D]/95"></div>
                </div>

                <div className="container relative z-10 mx-auto text-center px-4 max-w-5xl">
                    <div className="inline-flex items-center gap-2 p-2.5 px-6 rounded-full bg-[#D59B2B] text-white font-black text-xs md:text-sm tracking-wider mb-6 uppercase shadow-xl">
                        <ShieldCheck className="w-4 h-4 text-white" />
                        Gage Officiel de Qualité & de Conformité
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight uppercase font-montserrat text-white">
                        Label Expert Vérifié <br />
                        <span className="text-[#D59B2B] normal-case block mt-3 font-extrabold text-2xl md:text-4xl">
                            La Référence de Confiance pour la Climatisation Gainable
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-normal leading-relaxed">
                        Installer une climatisation gainable ou une pompe à chaleur est un investissement durable. 
                        Le Label <strong>Expert Vérifié Réseau Gainable®</strong> protège les particuliers et valorise les entreprises 
                        audités sur leurs compétences, leurs assurances décennales et leur conformité administrative.
                    </p>

                    {/* 3 Reassurance Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left">
                        {[
                            { title: "Audit Administratif", desc: "SIRET actif & solvabilité contrôlée" },
                            { title: "Garantie Décennale", desc: "Assurance RC Pro & travaux vérifiée" },
                            { title: "Zéro Surcoût", desc: "0 % commission • Contact direct artisan" }
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
                                Trouver un Expert Vérifié près de chez moi
                            </Button>
                        </Link>
                        <Link href="/inscription">
                            <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 rounded-2xl font-bold text-base transition-all">
                                Demander l'audit pour mon entreprise
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
                                <Star className="w-4 h-4 fill-current" /> Pourquoi ce label a été créé ?
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] leading-snug">
                                En finir avec les doutes : <br />
                                <span className="text-[#D59B2B]">un véritable contrat de confiance</span>
                            </h2>

                            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
                                Le marché de la pompe à chaleur et de la climatisation est souvent terni par des plateformes 
                                opaques qui revendent vos coordonnées à 4 ou 5 démarcheurs simultanés, ou par des sous-traitants non assurés.
                            </p>

                            <p className="text-slate-600 text-base leading-relaxed">
                                Chez <strong>Gainable.fr</strong>, nous avons pris le contrepied total : nous auditons minutieusement 
                                les installateurs et bureaux d'études. Lorsque vous voyez le macaron <strong>Expert Vérifié</strong>, 
                                vous avez la certitude de vous adresser à une entreprise déclarée, assurée pour la décennale et experte des systèmes gainables.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                                    <p className="font-bold text-[#1F2D3D] text-sm mb-1">🤝 Aucun intermédiaire commercial</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Vous échangez directement avec le gérant ou son technicien qualifié. Aucune commission n'est prélevée sur votre devis.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                                    <p className="font-bold text-[#1F2D3D] text-sm mb-1">🛡️ Couverture décennale 10 ans</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Votre réseau de gaines, votre groupe thermodynamique et vos plenums sont couverts par une assurance professionnelle valide.
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
                                <div className="absolute bottom-4 left-4 right-4 text-white p-3 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/20">
                                    <p className="font-bold text-sm flex items-center gap-2 text-amber-300">
                                        <ShieldCheck className="w-4 h-4 text-amber-300" /> Accord & Respect du Client
                                    </p>
                                    <p className="text-xs text-slate-200 mt-0.5">
                                        Un partenariat clair entre l'artisan local, le particulier et les exigences de qualité Gainable.fr.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 2: LE PROTOCOLE D'AUDIT EN 5 POINTS */}
            <section className="py-20 bg-slate-50 border-b border-slate-200/60">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <Shield className="w-4 h-4" /> Rigueur & Transparence
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-4">
                            Le Protocole d'Audit Gainable.fr
                        </h2>
                        <p className="text-slate-600 text-base md:text-lg">
                            Chaque entreprise candidate au label passe par un contrôle strict en 5 points avant d'apparaître sur la plateforme.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                step: "01",
                                title: "Vérification Juridique & SIRET",
                                desc: "Contrôle en temps réel auprès de l'INSEE et du registre du commerce. Entreprise en activité réelle, code APE CVC compatible, non radiée.",
                                icon: <Building2 className="w-6 h-6 text-[#D59B2B]" />
                            },
                            {
                                step: "02",
                                title: "Assurance Décennale CVC",
                                desc: "Exigence d'une attestation d'assurance Responsabilité Civile et Décennale en cours de validité pour couvrir tous les travaux de climatisation.",
                                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            },
                            {
                                step: "03",
                                title: "Attestation Fluides Frigorigènes",
                                desc: "Obligation légale pour la manipulation des fluides frigorigènes (R32 / R410A) afin de garantir une installation étanche et sans danger.",
                                icon: <FileText className="w-6 h-6 text-blue-600" />
                            },
                            {
                                step: "04",
                                title: "Maîtrise des Grandes Marques",
                                desc: "Connaissance pointue des gammes leaders (Daikin, Mitsubishi Electric, Atlantic, Toshiba, Airzone) pour un dimensionnement parfait.",
                                icon: <Award className="w-6 h-6 text-amber-500" />
                            },
                            {
                                step: "05",
                                title: "Charte de Déontologie & Avis",
                                desc: "Engagement sur l'écoute client, les délais de livraison, la propreté des chantiers et la réactivité du service après-vente.",
                                icon: <CheckCircle2 className="w-6 h-6 text-purple-600" />
                            },
                            {
                                step: "★",
                                title: "Contrôle Régulier Continu",
                                desc: "Le statut d'expert vérifié est réévalué chaque année lors du renouvellement des attestations et de l'analyse des retours clients.",
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
                                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{card.desc}</p>
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
                                <div className="absolute bottom-4 left-4 right-4 text-white p-3 bg-slate-900/70 backdrop-blur-md rounded-2xl border border-white/20">
                                    <p className="font-bold text-sm flex items-center gap-2 text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sérénité Garantie
                                    </p>
                                    <p className="text-xs text-slate-200 mt-0.5">
                                        Un interlocuteur dédié qui s'engage sur votre confort thermique et acoustique.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comparison Table Col */}
                        <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4" /> Comparatif Sans Concession
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] leading-snug">
                                Pourquoi choisir un artisan <br />
                                <span className="text-[#D59B2B]">labellisé Gainable.fr ?</span>
                            </h2>

                            <div className="space-y-4 pt-2">
                                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                                        <span>Avec un Expert Vérifié Gainable.fr</span>
                                    </div>
                                    <ul className="text-xs md:text-sm text-slate-700 space-y-1.5 pl-7 list-disc">
                                        <li><strong>Audit préalable complet</strong> : Siret, assurance décennale et capacité frigorifique validés.</li>
                                        <li><strong>Devis direct et gratuit</strong> sans intermédiaire commercial ni marge cachée.</li>
                                        <li><strong>Dimensionnement précis</strong> des débits d'air et de l'acoustique pour un confort optimal.</li>
                                        <li><strong>Accompagnement post-chantier</strong> avec garantie constructeur préservée.</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                                    <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                        <span>Sur les plateformes de devis généralistes</span>
                                    </div>
                                    <ul className="text-xs md:text-sm text-slate-600 space-y-1.5 pl-7 list-disc">
                                        <li>Vos coordonnées sont revendues à 3 à 5 artisans qui vous harcèlent au téléphone.</li>
                                        <li>Risque de sous-traitance non déclarée sans assurance décennale spécifique gainable.</li>
                                        <li>Tarifs sous-évalués puis avenants surprises au milieu des travaux.</li>
                                        <li>Interlocuteurs injoignables en cas de fuite de fluide ou de nuisance sonore.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 4: LE BADGE EN ACTION */}
            <section className="py-20 bg-slate-50 border-b border-slate-200/60">
                <div className="container max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-4 h-4 text-[#D59B2B]" /> Signature Visuelle
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-4">
                        Le Badge Officiel « Expert Vérifié »
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto mb-10">
                        Repérez ce macaron sur les fiches des professionnels pour être certain de leur accréditation. 
                        Le texte s'anime d'un léger battement de cœur pour signaler un profil vivant et certifié.
                    </p>

                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xl max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6">
                        <VerifiedExpertBadge size="lg" />
                        <div className="pt-4 border-t border-slate-100 text-xs md:text-sm text-slate-500 max-w-md">
                            Ce badge est la propriété exclusive de Gainable.fr. Toute utilisation frauduleuse 
                            par une entreprise non auditée est formellement interdite et poursuivie.
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5: CONDITIONS D'OBTENTION (CONTRASTES ÉCLATANTS & LISIBILITÉ PARFAITE) */}
            <section className="py-20 bg-[#1F2D3D] text-white">
                <div className="container max-w-5xl mx-auto px-4 text-center">
                    
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D59B2B]/20 text-[#D59B2B] text-xs font-bold uppercase tracking-wider mb-4 border border-[#D59B2B]/30">
                        <ShieldCheck className="w-4 h-4" /> Critères d'Excellence
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black font-montserrat text-white mb-4">
                        Conditions d'obtention du Label <span className="text-[#D59B2B]">Gainable.fr</span>
                    </h2>
                    <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-14 font-normal">
                        Nous ne transigeons pas sur la sécurité. Voici la liste exhaustive des prérequis administratifs 
                        et qualitatifs exigés pour tout installateur ou bureau d'études partenaire.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {/* DOCS OBLIGATOIRES */}
                        <div className="bg-slate-800/90 border-2 border-slate-700/80 p-8 rounded-3xl shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                                <div className="w-12 h-12 rounded-2xl bg-[#D59B2B]/20 text-[#D59B2B] flex items-center justify-center font-bold">
                                    <FileText className="w-6 h-6 text-[#D59B2B]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Documents Obligatoires</h3>
                                    <p className="text-xs text-slate-400 font-normal">Fournis et vérifiés avant publication</p>
                                </div>
                            </div>
                            
                            <ul className="space-y-4 text-slate-100 text-sm font-medium">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">SIREN / SIRET actif auprès de l'INSEE</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Numéro de TVA intracommunautaire officiel</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Attestation d'Assurance RC Pro & Décennale CVC</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Attestation de capacité fluides frigorigènes (manipulation gaz)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Marques reconnues posées (Daikin, Mitsubishi, etc.)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#D59B2B] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Périmètre géographique d'intervention clairement défini</span>
                                </li>
                            </ul>
                        </div>

                        {/* ENGAGEMENTS QUALITÉ */}
                        <div className="bg-slate-800/90 border-2 border-slate-700/80 p-8 rounded-3xl shadow-xl">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                    <Award className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Engagements Qualité</h3>
                                    <p className="text-xs text-slate-400 font-normal">Charte éthique signée par l'artisan</p>
                                </div>
                            </div>

                            <ul className="space-y-4 text-slate-100 text-sm font-medium">
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Installation dans le respect des DTU et normes thermiques</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Étude de charge thermique adaptée aux pièces de vie</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Transparence des devis : matériel et main d'œuvre détaillés</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Respect des délais annoncés et ponctualité</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Suivi après installation et contrat d'entretien disponible</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">✓</div>
                                    <span className="text-white">Communication réactive en cas de question ou réglage Airzone</span>
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
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="border-slate-500 bg-slate-800 text-white hover:bg-slate-700 px-8 py-6 text-base rounded-full font-bold transition-all">
                                Postuler au Label (Espace Pro)
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 6: FAQ RASSURANCE */}
            <section className="py-20 bg-white">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
                            <HelpCircle className="w-4 h-4" /> Réponses Claires
                        </div>
                        <h2 className="text-3xl font-black font-montserrat text-[#1F2D3D]">
                            Questions Fréquentes sur l'Expert Vérifié
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Est-ce que Gainable.fr prend une commission sur le devis de mon chantier ?",
                                a: "Non, absolument 0 % de commission. Vous êtes en relation directe avec l'entreprise. Le devis est établi au tarif juste par l'artisan sans aucune surtaxe de plateforme."
                            },
                            {
                                q: "Comment puis-je vérifier l'assurance décennale de l'artisan ?",
                                a: "Chaque professionnel audité est tenu de présenter son attestation d'assurance décennale en cours de validité. Vous pouvez également lui demander un exemplaire officiel avant la signature du devis."
                            },
                            {
                                q: "Que se passe-t-il si une entreprise ne respecte plus les critères de qualité ?",
                                a: "Le label Expert Vérifié est suspendu ou retiré immédiatement en cas de défaut d'assurance, de radiation du registre du commerce ou de manquements répétés à la charte de qualité."
                            },
                            {
                                q: "L'artisan peut-il m'aider à obtenir les aides de l'État (CEE / MaPrimeRénov') ?",
                                a: "Oui, la majorité de nos experts vérifiés disposent des qualifications RGE (Reconnu Garant de l'Environnement) indispensables pour mobiliser les primes à la rénovation énergétique."
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
