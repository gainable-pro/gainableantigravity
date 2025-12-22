import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Award, AlertTriangle, Briefcase, User, FileText, Star, Shield } from "lucide-react";
import Link from "next/link";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Label Gainable.fr : La référence Qualité Climatisation & RGE",
    description: "Découvrez le Label Gainable.fr, garantissant des artisans certifiés, assurés et experts en climatisation gainable pour une installation en toute sérénité.",
    openGraph: {
        title: "Label Gainable.fr : La référence Qualité Climatisation & RGE",
        description: "Gage de qualité et de confiance. Optez pour des installateurs labellisés Gainable.fr pour votre confort.",
        images: ['/label-quality-business-bg.png'],
        type: 'website',
    },
};

export default function LabelsPage() {
    return (
        <div className="flex min-h-screen flex-col font-sans text-[#1F2D3D]">


            {/* HERO SECTION */}
            <section className="relative min-h-[400px] flex items-center justify-center py-20 px-4">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/label-quality-business-bg.png')" }}
                >
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                </div>

                <div className="container relative z-10 mx-auto text-center px-4 text-white">
                    <div className="inline-block p-3 px-6 rounded-full bg-[#D59B2B] text-white font-bold text-sm tracking-wider mb-6 uppercase shadow-lg">
                        Gage de Qualité
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal mb-8 tracking-wide leading-tight uppercase font-montserrat text-white">
                        Label Gainable.fr <br />
                        <span className="text-[#D59B2B] text-2xl md:text-4xl normal-case block mt-4 font-bold">La Référence des Artisans Spécialisés en Climatisation Gainable</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                        Le Label Gainable.fr met en avant les artisans et entreprises spécialisés dans l’installation de climatisation gainable. Il assure aux particuliers une sélection d’entreprises déclarées, compétentes et engagées dans la qualité.
                    </p>
                </div>
            </section>

            {/* BLOC: ARGUMENTAIRE */}
            <section className="py-20 bg-white">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold font-montserrat text-[#1F2D3D] mb-8">
                                <span className="text-[#D59B2B]">Transparence, Confiance</span> et Visibilité
                            </h2>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                Gainable.fr valorise les professionnels sérieux et garantit aux particuliers une recherche simple, rapide et fiable.
                            </p>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Chaque entreprise inscrite est présentée de manière transparente :
                            </p>

                            <ul className="space-y-4 mb-8">
                                {[
                                    "Informations administratives vérifiées",
                                    "Marques installées",
                                    "Zone d’intervention précise",
                                    "Photos et réalisations (selon disponibilités)"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#D59B2B]/10 flex items-center justify-center text-[#D59B2B]">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <span className="text-slate-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="p-6 bg-slate-50 border-l-4 border-[#D59B2B] rounded-r-xl">
                                <p className="text-[#1F2D3D] font-medium italic">
                                    "Ce label permet d’améliorer la confiance, la visibilité locale et le taux de conversion des demandes de devis."
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Illustration / Graphic for Trust */}
                            <div className="flex justify-center items-center">
                                <img
                                    src="/expert-verifie-logo-v3.jpg"
                                    alt="Logo Expert Vérifié Réseau Gainable.fr"
                                    className="w-full max-w-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOC: AVANTAGES (Particuliers vs Professionnels) */}
            <section className="py-20 bg-slate-50">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1F2D3D] mb-4">Avantages du Label Gainable<span className="text-[#D59B2B]">.fr</span></h2>
                        <p className="text-slate-500 text-lg">Une valeur ajoutée pour tous</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                        {/* POUR LES PARTICULIERS */}
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-t-8 border-[#D59B2B] transform transition-transform hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-[#D59B2B]/10 text-[#D59B2B]">
                                    <User className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1F2D3D]">Pour les Particuliers</h3>
                            </div>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#D59B2B] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Trouver un artisan spécialisé</span>
                                        <span className="text-slate-600">Proche de chez soi et expert en son domaine.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#D59B2B] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Accès transparent</span>
                                        <span className="text-slate-600">Un profil complet avec toutes les informations légales.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#D59B2B] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Sécurité renforcée</span>
                                        <span className="text-slate-600">Seuls les artisans conformes et assurés sont acceptés.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Shield className="w-6 h-6 text-[#D59B2B] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Conseil Sécurité</span>
                                        <span className="text-slate-600">Nous conseillons de toujours demander les attestations d'assurance.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#D59B2B] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Gain de temps et de confiance</span>
                                        <span className="text-slate-600">Une sélection déjà effectuée pour vous.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* POUR LES PROFESSIONNELS */}
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-t-8 border-[#1F2D3D] transform transition-transform hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-4 rounded-2xl bg-[#1F2D3D]/10 text-[#1F2D3D]">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1F2D3D]">Pour les Professionnels</h3>
                            </div>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#1F2D3D] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Visibilité supplémentaire</span>
                                        <span className="text-slate-600">Sans inconvénient pour votre activité.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#1F2D3D] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Page dédiée optimisée SEO</span>
                                        <span className="text-slate-600 text-sm bg-slate-100 p-1 px-2 rounded mt-1 inline-block font-mono text-[#D59B2B]">nomdedomaine.fr/ville/entreprise</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#1F2D3D] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Mise en avant du sérieux</span>
                                        <span className="text-slate-600">Valorisation de votre savoir-faire et certifications.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#1F2D3D] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Distinction claire</span>
                                        <span className="text-slate-600">Démarquez-vous face à la concurrence locale.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <Check className="w-6 h-6 text-[#1F2D3D] flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold block text-[#1F2D3D]">Meilleure conversion</span>
                                        <span className="text-slate-600">Possibilité d’ajouter badges, réalisations et marques.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* BLOC: EXIGENCES & ENGAGEMENTS */}
            <section className="py-20 bg-white">
                <div className="container max-w-5xl mx-auto px-4">
                    <div className="bg-slate-50 border-l-8 border-[#1F2D3D] rounded-lg p-8 md:p-12 shadow-sm">
                        <h2 className="text-2xl font-bold text-[#1F2D3D] mb-6 flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-[#D59B2B]" />
                            Exigences & Engagements
                        </h2>
                        <p className="text-lg text-slate-700 mb-6 font-medium">
                            Pour rester crédible et qualitatif, le label impose :
                        </p>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#1F2D3D]/10 flex items-center justify-center text-[#1F2D3D] font-bold shrink-0">!</div>
                                <div>
                                    <h4 className="font-bold text-[#1F2D3D] text-lg">Conformité Administrative Stricte</h4>
                                    <p className="text-slate-600">SIREN/SIRET valides, assurances à jour obligatoires.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#1F2D3D]/10 flex items-center justify-center text-[#1F2D3D] font-bold shrink-0">!</div>
                                <div>
                                    <h4 className="font-bold text-[#1F2D3D] text-lg">Engagement Qualité Durable</h4>
                                    <p className="text-slate-600">Respect des normes et satisfaction client.</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-8 text-sm text-slate-500 italic border-t border-slate-200 pt-4">
                            (Aucun autre inconvénient : le label reste une opportunité de visibilité majeure pour les pros sérieux.)
                        </p>
                    </div>
                </div>
            </section>

            {/* CONDITIONS D'OBTENTION */}
            <section className="py-20 bg-[#1F2D3D] text-white">
                <div className="container max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold font-montserrat mb-16">
                        Conditions d’obtention du Label <span className="text-[#D59B2B]">Gainable.fr</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        {/* DOCS */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 mb-8">
                                <FileText className="w-8 h-8 text-[#D59B2B]" />
                                <h3 className="text-2xl font-bold">Documents Obligatoires</h3>
                            </div>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>SIREN / SIRET valide</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Numéro de TVA intracommunautaire</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Assurance RC Pro</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Preuves de capacité / certifications métiers (si disponibles)</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Marques de clim gainable installées</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Zone d’intervention définie</li>
                            </ul>
                        </div>

                        {/* ENGAGEMENTS */}
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 mb-8">
                                <Award className="w-8 h-8 text-[#D59B2B]" />
                                <h3 className="text-2xl font-bold">Engagements Qualité</h3>
                            </div>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Installation conforme aux normes actuelles</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Conseils pertinents selon le projet du client</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Respect des délais annoncés</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Communication transparente</li>
                                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D59B2B]"></div>Garantie d’un suivi sérieux après installation</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16">
                        <Link href="/contact-pro">
                            <Button size="lg" className="bg-[#D59B2B] hover:bg-[#b88622] text-white px-10 py-6 text-lg rounded-full shadow-lg font-bold transition-all hover:scale-105">
                                Demander le Label pour mon entreprise
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer is global */}
        </div>
    );
}
