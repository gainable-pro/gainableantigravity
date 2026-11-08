import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Building2, Globe2, Lock, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
    title: "Politique de Confidentialité & Protection des Données - Gainable.fr",
    description: "Politique de confidentialité et de protection des données personnelles de Gainable.fr exploitée par EXCEED DIGITAL SAS (RGPD, droits d'accès, conservation, sécurité).",
    alternates: {
        canonical: "https://www.gainable.fr/politique-confidentialite",
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function PolitiqueConfidentialite() {
    return (
        <main className="min-h-screen bg-slate-50/50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">

                {/* Fil d'Ariane & Navigation */}
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#D59B2B] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour à l'accueil
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <Link href="/mentions-legales" className="hover:underline">Mentions Légales</Link>
                        <span>•</span>
                        <Link href="/cgu" className="hover:underline">CGU</Link>
                        <span>•</span>
                        <Link href="/cgv" className="hover:underline font-semibold text-amber-700">CGV Pro</Link>
                    </div>
                </div>

                {/* En-tête Principal */}
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-900 border border-emerald-500/20 text-xs font-black uppercase tracking-wider mb-4">
                        <Lock className="w-4 h-4 text-emerald-600" /> Protection des Données &amp; RGPD
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-3 leading-tight">
                        POLITIQUE DE CONFIDENTIALITÉ
                    </h1>
                    <p className="text-[#D59B2B] font-bold uppercase tracking-wider text-sm md:text-base mb-6">
                        GAINABLE.FR — EXCEED DIGITAL
                    </p>

                    {/* Affichage des domaines associés */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                        <p className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2 mb-3">
                            <Globe2 className="w-4 h-4 text-[#D59B2B]" /> Plateforme &amp; Domaines Internationaux Associés :
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-sm font-semibold text-slate-800">
                            <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                www.gainable.fr
                            </div>
                            <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                www.gainable.ch
                            </div>
                            <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                www.gainable.ma
                            </div>
                            <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                www.gainable.be
                            </div>
                            <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                www.gainable.org
                            </div>
                            <div className="px-3 py-2 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                www.gainable.eu
                            </div>
                        </div>
                    </div>
                </div>

                {/* Corps de la Politique */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">

                    {/* 1. OBJET DE LA POLITIQUE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            1. OBJET DE LA POLITIQUE
                        </h2>
                        <p>
                            La présente politique explique comment <strong>EXCEED DIGITAL</strong> collecte, utilise, communique, conserve et protège les données personnelles traitées dans le cadre de l'exploitation de <strong>Gainable.fr</strong>.
                        </p>
                        <p className="font-semibold text-slate-900">Elle concerne notamment :</p>
                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm">
                            <li>Les visiteurs du site ;</li>
                            <li>Les particuliers recherchant un professionnel ;</li>
                            <li>Les professionnels inscrits ou abonnés ;</li>
                            <li>Les représentants et collaborateurs des entreprises ;</li>
                            <li>Les professionnels contactés dans le cadre d'une recherche complémentaire ou d'une démarche commerciale.</li>
                        </ul>
                        <p className="text-xs text-slate-500 italic">
                            Cette politique complète les Conditions Générales d'Utilisation (CGU) et les Conditions Générales de Vente (CGV) professionnelles.
                        </p>
                    </section>

                    {/* 2. RESPONSABLE DU TRAITEMENT */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Building2 className="w-5 h-5 text-[#D59B2B]" />
                            2. RESPONSABLE DU TRAITEMENT
                        </h2>
                        <p>Le responsable des traitements décrits dans la présente politique, lorsqu'il en détermine les finalités et les moyens, est :</p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 text-sm space-y-1.5">
                            <p><strong>Raison sociale :</strong> EXCEED DIGITAL</p>
                            <p><strong>Forme juridique :</strong> Société par actions simplifiée (SAS)</p>
                            <p><strong>SIREN :</strong> 101 447 944 (RCS Salon-de-Provence)</p>
                            <p><strong>Siège social :</strong> 13140 Miramas, France</p>
                            <p><strong>Adresse de contact :</strong> <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] font-semibold underline">contact@exceeddigital.fr</a></p>
                            <p><strong>Contact dédié aux données personnelles :</strong> <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] font-semibold underline">contact@exceeddigital.fr</a></p>
                        </div>
                    </section>

                    {/* 3. DONNÉES COLLECTÉES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            3. DONNÉES COLLECTÉES
                        </h2>
                        <p>Selon l'utilisation des services, Gainable peut traiter les catégories de données suivantes :</p>
                        
                        <div className="grid md:grid-cols-3 gap-6 pt-2">
                            {/* Particuliers */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                                <h3 className="font-bold text-[#D59B2B] text-xs uppercase tracking-wider">Données des particuliers</h3>
                                <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-700">
                                    <li>Nom et prénom</li>
                                    <li>Adresse électronique</li>
                                    <li>Numéro de téléphone</li>
                                    <li>Commune, code postal ou localisation du projet</li>
                                    <li>Description du projet et informations transmises volontairement</li>
                                    <li>Identité du professionnel contacté</li>
                                    <li>Date et état de traitement de la demande</li>
                                </ul>
                            </div>

                            {/* Professionnels */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                                <h3 className="font-bold text-[#D59B2B] text-xs uppercase tracking-wider">Données des professionnels</h3>
                                <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-700">
                                    <li>Identité et coordonnées des représentants</li>
                                    <li>Dénomination commerciale et identification de l'entreprise</li>
                                    <li>Numéro SIREN et informations professionnelles</li>
                                    <li>Zones d'intervention, spécialités et technologies</li>
                                    <li>Qualifications et attestations déclarées</li>
                                    <li>Informations de facturation, d'abonnement et de paiement</li>
                                    <li>Contenus, photographies et articles</li>
                                </ul>
                            </div>

                            {/* Données techniques */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                                <h3 className="font-bold text-[#D59B2B] text-xs uppercase tracking-wider">Données techniques</h3>
                                <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-700">
                                    <li>Adresse IP</li>
                                    <li>Journaux de connexion et de sécurité</li>
                                    <li>Navigateur et appareil utilisé</li>
                                    <li>Données de session du compte</li>
                                    <li>Préférences relatives aux cookies</li>
                                    <li>Données de mesure d'audience anonymisées</li>
                                </ul>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                            Gainable demande aux utilisateurs de ne pas communiquer de données sensibles ou d'informations excessives dans les formulaires de description de projet.
                        </div>
                    </section>

                    {/* 4. FINALITÉS ET BASES JURIDIQUES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            4. FINALITÉS ET BASES JURIDIQUES
                        </h2>
                        <p>Les données sont traitées pour des finalités déterminées et sur une base juridique appropriée :</p>
                        
                        <div className="space-y-3 text-sm">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">4.1. Fonctionnement des comptes professionnels</p>
                                <p className="text-slate-600 mt-1"><strong>Finalités :</strong> création et gestion des comptes, exécution des abonnements, accès aux outils, assistance, facturation et suivi contractuel.</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Bases juridiques :</strong> exécution du contrat lorsque la personne concernée est elle-même partie au contrat ; intérêt légitime de gestion de la relation professionnelle pour les représentants des personnes morales ; obligations légales pour certaines opérations comptables et fiscales.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">4.2. Publication des fiches professionnelles</p>
                                <p className="text-slate-600 mt-1"><strong>Finalités :</strong> afficher les informations professionnelles, les coordonnées de contact, les spécialités et les contenus sur Gainable.</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Bases juridiques :</strong> exécution du contrat lorsque applicable et/ou intérêt légitime à assurer le service de référencement. Les informations rendues publiques sont limitées à celles nécessaires à la présentation professionnelle.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">4.3. Formulaire adressé à un professionnel déterminé</p>
                                <p className="text-slate-600 mt-1"><strong>Finalité :</strong> transmettre au professionnel choisi la demande du particulier et permettre sa prise de contact.</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Base juridique :</strong> mesures précontractuelles prises à la demande de la personne concernée, ou intérêt légitime à assurer le service sollicité. Le professionnel destinataire est identifié avant l'envoi.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">4.4. Demande générale de recherche de professionnels</p>
                                <p className="text-slate-600 mt-1"><strong>Finalité :</strong> analyser le projet, identifier des entreprises susceptibles d'y répondre, prendre contact avec celles-ci et transmettre la demande selon les modalités annoncées au particulier.</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Base juridique :</strong> mesures précontractuelles prises à la demande de la personne concernée ou intérêt légitime. Si le partage excède l'attente raisonnable de la demande initiale, le consentement préalable requis est recueilli.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">4.5. Prospection de professionnels</p>
                                <p className="text-slate-600 mt-1"><strong>Finalité :</strong> contacter des entreprises susceptibles d'être intéressées par le référencement sur Gainable ou par une demande de projet.</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Base juridique :</strong> intérêt légitime dans les conditions légales ou consentement lorsque requis. Chaque professionnel dispose d'un moyen simple d'opposition.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">4.6. Gestion des réclamations et litiges</p>
                                <p className="text-slate-600 mt-1"><strong>Finalité :</strong> traiter les demandes d'assistance, contestations, incidents et réclamations, et défendre les droits de Gainable ou des personnes concernées.</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Base juridique :</strong> intérêt légitime ou obligation légale selon le traitement.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">4.7. Sécurité et prévention des abus</p>
                                <p className="text-slate-600 mt-1"><strong>Finalité :</strong> protéger les comptes, détecter les usages frauduleux et assurer la sécurité de la plateforme.</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Base juridique :</strong> intérêt légitime et, le cas échéant, obligations légales.</p>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">4.8. Cookies et mesure d'audience</p>
                                <p className="text-slate-600 mt-1"><strong>Finalité :</strong> fonctionnement technique, mesure d'audience et autres usages décrits dans la politique de cookies.</p>
                                <p className="text-xs text-slate-500 mt-1"><strong>Base juridique :</strong> nécessité technique ou consentement préalable lorsque légalement requis.</p>
                            </div>
                        </div>
                    </section>

                    {/* 5. DESTINATAIRES DES DONNÉES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            5. DESTINATAIRES DES DONNÉES
                        </h2>
                        <p>Les données personnelles sont accessibles, dans la limite de leurs attributions, aux personnes habilitées d'EXCEED DIGITAL.</p>
                        <p className="font-semibold text-slate-900">Elles peuvent également être transmises :</p>
                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm">
                            <li>Au professionnel expressément choisi par un particulier ;</li>
                            <li>Aux professionnels identifiés dans le cadre d'une demande générale, selon les informations données au particulier ;</li>
                            <li>Aux prestataires techniques nécessaires à l'hébergement, à la maintenance, à la messagerie, à la facturation ou à la sécurité ;</li>
                            <li>Aux prestataires de paiement, dans les limites nécessaires ;</li>
                            <li>Aux autorités légalement habilitées, lorsque la loi l'exige.</li>
                        </ul>
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium text-sm">
                            Gainable ne commercialise pas les coordonnées des particuliers sous la forme de fichiers ou de contacts vendus à l'unité. Cette absence de vente n'exclut pas la transmission des coordonnées strictement nécessaire au service de mise en relation demandé.
                        </div>
                        <p className="text-xs text-slate-500 italic">
                            Les prestataires traitant des données pour le compte de Gainable sont encadrés par les engagements contractuels requis par le RGPD.
                        </p>
                    </section>

                    {/* 6. TRANSMISSION DES DEMANDES AUX PROFESSIONNELS */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            6. TRANSMISSION DES DEMANDES AUX PROFESSIONNELS
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <h3 className="font-bold text-slate-900">6.1. Contact direct</h3>
                                <p>Lorsqu'un particulier choisit un professionnel déterminé et lui adresse une demande, ses coordonnées et les informations utiles à son projet sont transmises à ce professionnel. Le professionnel utilise ces informations pour répondre à la demande et gérer la relation qui en découle.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">6.2. Demande générale</h3>
                                <p>Lorsqu'un particulier sollicite Gainable pour identifier des entreprises, Gainable peut analyser sa demande et rechercher des professionnels adaptés. Les informations nécessaires sont utilisées pour apprécier la compatibilité entre le projet et les compétences déclarées des entreprises. Gainable ne diffuse pas automatiquement une demande à un nombre indéterminé d'entreprises sans information appropriée.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">6.3. Responsabilités des professionnels destinataires</h3>
                                <p>Après réception d'une demande, un professionnel agit en qualité de responsable indépendant des traitements qu'il réalise pour répondre au particulier, établir un devis ou gérer une relation commerciale. Il lui appartient alors de respecter ses propres obligations d'information, de sécurité, de conservation et de traitement des demandes d'exercice des droits.</p>
                            </div>
                        </div>
                    </section>

                    {/* 7. UTILISATION DE L'INTELLIGENCE ARTIFICIELLE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            7. UTILISATION DE L'INTELLIGENCE ARTIFICIELLE
                        </h2>
                        <p>Gainable propose aux professionnels abonnés un outil d'assistance à la rédaction d'articles et de contenus.</p>
                        <p>Les informations saisies dans cet outil peuvent être traitées par les systèmes techniques nécessaires à la génération des contenus.</p>
                        <p className="font-semibold text-slate-900">
                            Les professionnels sont invités à ne pas saisir de données personnelles de clients, de coordonnées privées ou d'informations confidentielles non nécessaires à la rédaction.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Les catégories de données transmises au fournisseur du modèle d'intelligence artificielle, son identité, les lieux de traitement, les conditions de conservation et l'éventuelle utilisation des données font l'objet d'un suivi contractuel et technique conforme à la réglementation applicable.
                        </p>
                    </section>

                    {/* 8. DURÉES DE CONSERVATION */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            8. DURÉES DE CONSERVATION
                        </h2>
                        <p>Les données sont conservées uniquement pendant la durée nécessaire aux finalités poursuivies, puis supprimées ou archivées :</p>
                        
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">8.1. Comptes professionnels actifs</p>
                                <p className="text-xs text-slate-600 mt-1">Conservées pendant la durée de la relation contractuelle, puis archivage pour satisfaire aux obligations légales ou réclamations.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">8.2. Articles et contenus professionnels</p>
                                <p className="text-xs text-slate-600 mt-1">Hors ligne dès expiration de l'abonnement. Archivage possible jusqu'à 3 ans pour réactivation éventuelle.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">8.3. Demandes de particuliers</p>
                                <p className="text-xs text-slate-600 mt-1">Conservées pendant la durée nécessaire à leur traitement et au suivi raisonnable de la mise en relation.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">8.4. Prospection commerciale</p>
                                <p className="text-xs text-slate-600 mt-1">Conservées selon les recommandations applicables (3 ans max après le dernier contact actif), listes d'exclusion conservées pour respecter l'opposition.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">8.5. Factures &amp; comptabilité</p>
                                <p className="text-xs text-slate-600 mt-1">Conservées pendant 10 ans conformément aux obligations du Code de commerce et de la réglementation fiscale.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="font-bold text-slate-900">8.6 &amp; 8.7. Journaux &amp; Sauvegardes</p>
                                <p className="text-xs text-slate-600 mt-1">Journaux de sécurité conservés pour une durée proportionnée (1 an). Sauvegardes selon des cycles de rotation sécurisés.</p>
                            </div>
                        </div>
                    </section>

                    {/* 9. HÉBERGEMENT ET TRANSFERTS INTERNATIONAUX */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            9. HÉBERGEMENT ET TRANSFERTS INTERNATIONAUX
                        </h2>
                        <p>Les données sont hébergées et traitées par Gainable et ses prestataires techniques qualifiés.</p>
                        <p>
                            Lorsque des données sont transférées en dehors de l'Espace économique européen, Gainable veille à l'existence d'un mécanisme juridique approprié, tel qu'une décision d'adéquation ou des clauses contractuelles types de la Commission européenne, assorti des mesures de protection complémentaires nécessaires.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Les informations sur les transferts effectivement réalisés peuvent être obtenues sur simple demande auprès d'EXCEED DIGITAL.
                        </p>
                    </section>

                    {/* 10. SÉCURITÉ DES DONNÉES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            10. SÉCURITÉ DES DONNÉES
                        </h2>
                        <p>
                            Gainable met en œuvre des mesures techniques et organisationnelles adaptées aux risques, notamment en matière de contrôle des accès, de chiffrement, de gestion des habilitations, de protection des comptes, de sauvegarde et de surveillance continue des incidents.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            En cas de violation de données personnelles, Gainable applique les obligations de documentation, de notification à l'autorité de contrôle (CNIL) et d'information des personnes concernées lorsque les conditions légales sont réunies.
                        </p>
                    </section>

                    {/* 11. DROITS DES PERSONNES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <UserCheck className="w-5 h-5 text-emerald-600" />
                            11. DROITS DES PERSONNES
                        </h2>
                        <p>Sous réserve des conditions prévues par la réglementation, chaque personne concernée peut exercer :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>Son droit d'accès ;</li>
                            <li>Son droit de rectification ;</li>
                            <li>Son droit à l'effacement ;</li>
                            <li>Son droit à la limitation du traitement ;</li>
                            <li>Son droit d'opposition, notamment à la prospection ;</li>
                            <li>Son droit à la portabilité lorsque les conditions sont réunies ;</li>
                            <li>Son droit de retirer son consentement à tout moment pour les traitements qui reposent sur celui-ci ;</li>
                            <li>Ses droits relatifs aux décisions individuelles automatisées lorsque ces dispositions sont applicables.</li>
                        </ul>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 mt-4 text-sm">
                            <p className="font-bold text-slate-900">Pour exercer vos droits :</p>
                            <p>Adressez votre demande par courrier électronique à : <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] font-bold underline">contact@exceeddigital.fr</a></p>
                            <p className="text-xs text-slate-500">Gainable peut demander les informations strictement nécessaires pour vérifier l'identité du demandeur en cas de doute raisonnable. Une réponse est apportée dans le délai légal d'un mois.</p>
                        </div>

                        <p className="text-xs text-slate-600 pt-2">
                            La personne concernée peut également introduire une réclamation auprès de la Commission nationale de l'informatique et des libertés (CNIL) sur son site officiel : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#D59B2B] underline font-semibold">www.cnil.fr</a>.
                        </p>
                    </section>

                    {/* 12. DONNÉES DES MINEURS */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            12. DONNÉES DES MINEURS
                        </h2>
                        <p>Les services professionnels de Gainable ne sont pas destinés aux mineurs.</p>
                        <p className="text-xs text-slate-500 italic">
                            Lorsqu'une demande de mise en relation implique un mineur, Gainable applique les règles légales pertinentes et peut demander l'intervention d'un représentant légal lorsque cela est nécessaire.
                        </p>
                    </section>

                    {/* 13. LIENS EXTERNES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            13. LIENS EXTERNES
                        </h2>
                        <p>Les fiches professionnelles peuvent contenir des liens vers des sites Internet exploités par des tiers.</p>
                        <p className="text-xs text-slate-500 italic">
                            Ces sites disposent de leurs propres règles de confidentialité. Gainable n'est pas responsable du seul fait des traitements indépendants réalisés par ces sites, sans préjudice de ses obligations légales propres.
                        </p>
                    </section>

                    {/* 13 BIS — PROPRIÉTÉ INTELLECTUELLE ET PROTECTION DU RÉSEAU MULTIDOMAINE GAINABLE */}
                    <section className="space-y-6 pt-2">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Globe2 className="w-5 h-5 text-[#D59B2B]" />
                            13 BIS — PROPRIÉTÉ INTELLECTUELLE ET PROTECTION DU RÉSEAU MULTIDOMAINE GAINABLE
                        </h2>

                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.1 — Titularité des droits</h3>
                            <p>La plateforme GAINABLE est éditée et exploitée par <strong>EXCEED DIGITAL</strong>.</p>
                            <p>
                                Sous réserve des droits appartenant à des tiers, EXCEED DIGITAL est titulaire ou bénéficiaire des droits d'exploitation nécessaires sur les éléments protégés de la plateforme, notamment :
                            </p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                                <li>Les logiciels, développements informatiques et codes sources originaux ;</li>
                                <li>Les interfaces, créations graphiques et éléments visuels originaux ;</li>
                                <li>Les textes, contenus éditoriaux et documents propres à Gainable ;</li>
                                <li>Les marques, logos, noms commerciaux et autres signes distinctifs ;</li>
                                <li>Les bases de données protégées et leur contenu, dans les limites prévues par la loi ;</li>
                                <li>Les développements spécifiques des outils d'intelligence artificielle et de référencement, lorsqu'ils remplissent les conditions de protection.</li>
                            </ul>
                            <p className="font-semibold text-slate-900">
                                L'accès à la plateforme n'emporte aucun transfert de propriété intellectuelle au profit des utilisateurs.
                            </p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.2 — Réseau multidomaine</h3>
                            <p>
                                L'écosystème numérique Gainable comprend notamment les noms de domaine suivants, lorsqu'ils sont effectivement exploités par EXCEED DIGITAL :
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 py-1 text-sm font-semibold text-[#D59B2B]">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.fr</div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.ch</div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.ma</div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.be</div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.org</div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.eu</div>
                            </div>
                            <p>
                                Les protections légales applicables aux éléments de Gainable s'exercent indépendamment du nom de domaine utilisé pour accéder aux services.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                La détention ou l'exploitation de ces noms de domaine ne confère toutefois pas, à elle seule, un droit exclusif sur le principe d'une plateforme multidomaine.
                            </p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.3 — Protection des bases de données</h3>
                            <p>
                                Les bases de données de Gainable peuvent bénéficier de la protection du droit d'auteur et/ou du droit spécifique du producteur de bases de données lorsque les conditions légales sont réunies.
                            </p>
                            <p>
                                Conformément aux articles L.341-1 et suivants du Code de la propriété intellectuelle, EXCEED DIGITAL se réserve les droits qui lui sont reconnus sur ces bases.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Sous réserve des exceptions légales, sont notamment interdites les extractions et réutilisations de données portant atteinte à ces droits, y compris lorsqu'elles sont réalisées au moyen de robots, scripts ou autres procédés automatisés.
                            </p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.4 — Reproduction et exploitation non autorisées</h3>
                            <p>
                                Toute reproduction, représentation, adaptation, diffusion ou exploitation d'éléments protégés de Gainable sans autorisation du titulaire des droits est interdite, sauf exception prévue par la loi.
                            </p>
                            <p className="font-semibold text-rose-800">Il est notamment interdit :</p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                                <li>De reproduire illicitement les codes sources ou logiciels protégés ;</li>
                                <li>De copier ou d'exploiter sans autorisation des créations originales de Gainable ;</li>
                                <li>D'extraire ou de réutiliser illicitement les bases de données protégées ;</li>
                                <li>D'utiliser les signes distinctifs Gainable d'une manière portant atteinte aux droits de leurs titulaires ;</li>
                                <li>De contourner frauduleusement les dispositifs de sécurité de la plateforme.</li>
                            </ul>
                        </div>

                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.5 — Protection du savoir-faire et des informations confidentielles</h3>
                            <p>
                                Les informations techniques, commerciales ou organisationnelles non publiques relatives à Gainable, notamment certains paramètres internes, procédés de développement et méthodes de déploiement, peuvent bénéficier de la protection du secret des affaires lorsque les conditions légales sont réunies.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Cette protection concerne les informations présentant une valeur commerciale du fait de leur caractère secret et faisant l'objet de mesures raisonnables destinées à préserver leur confidentialité. Elle ne s'étend pas aux idées générales, aux fonctionnalités usuelles ou aux informations librement accessibles.
                            </p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.6 — Contenus des professionnels</h3>
                            <p>
                                Les photographies, marques, logos, réalisations et autres contenus fournis par les professionnels restent soumis aux droits de leurs titulaires respectifs.
                            </p>
                            <p>
                                Leur publication sur Gainable s'effectue conformément aux autorisations et conditions contractuelles applicables.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                EXCEED DIGITAL ne revendique pas la propriété exclusive des contenus appartenant légitimement aux professionnels ou à des tiers.
                            </p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.7 — Défense des droits</h3>
                            <p>
                                En cas de contrefaçon, d'extraction illicite, d'atteinte à un secret d'affaires ou d'actes de concurrence déloyale, EXCEED DIGITAL se réserve le droit d'exercer toute action légalement ouverte afin de faire cesser les agissements et d'obtenir réparation du préjudice subi.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Ces dispositions s'appliquent sous réserve des droits des utilisateurs et des législations impératives applicables.
                            </p>
                        </div>
                    </section>

                    {/* 14. MODIFICATION DE LA POLITIQUE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            14. MODIFICATION DE LA POLITIQUE
                        </h2>
                        <p>La présente politique peut être mise à jour pour tenir compte des évolutions du service, des traitements ou de la réglementation.</p>
                        <p className="text-xs text-slate-500 italic">
                            Les modifications importantes sont portées à la connaissance des personnes concernées lorsque cela est requis. La date de mise à jour est indiquée en tête du document.
                        </p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 mt-4">
                            Consultez également nos <Link href="/mentions-legales" className="text-[#D59B2B] underline">Mentions Légales</Link>, nos <Link href="/cgu" className="text-[#D59B2B] underline">CGU</Link> et nos <Link href="/cgv" className="text-[#D59B2B] underline">CGV professionnelles</Link>.
                        </div>
                    </section>

                </div>

            </div>
        </main>
    );
}
