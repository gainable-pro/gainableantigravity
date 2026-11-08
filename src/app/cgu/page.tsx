import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, Globe2, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation (CGU) - Gainable.fr",
    description: "Conditions Générales d'Utilisation régissant l'accès et l'utilisation de la plateforme Gainable.fr et de ses fonctionnalités numériques (EXCEED DIGITAL SAS).",
    alternates: {
        canonical: "https://www.gainable.fr/cgu",
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function ConditionsGeneralesUtilisation() {
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
                        <Link href="/cgv" className="hover:underline font-semibold text-amber-700">CGV Pro</Link>
                        <span>•</span>
                        <Link href="/politique-confidentialite" className="hover:underline">Confidentialité</Link>
                    </div>
                </div>

                {/* En-tête Principal */}
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-900 border border-blue-500/20 text-xs font-black uppercase tracking-wider mb-4">
                        <Scale className="w-4 h-4 text-blue-600" /> Cadre Juridique Utilisateur
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-3 leading-tight">
                        CONDITIONS GÉNÉRALES D’UTILISATION
                    </h1>
                    <p className="text-[#D59B2B] font-bold uppercase tracking-wider text-sm md:text-base mb-6">
                        GAINABLE.FR — EXCEED DIGITAL
                    </p>

                    {/* Affichage des sites / domaines */}
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

                {/* Corps des 27 Articles CGU */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">

                    {/* ARTICLE 1 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Building2 className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 1 — IDENTIFICATION DE L'ÉDITEUR
                        </h2>
                        <p>
                            La plateforme Gainable.fr est exploitée par <strong>EXCEED DIGITAL</strong>, société par actions simplifiée (SAS), immatriculée au Registre du commerce et des sociétés de Salon-de-Provence sous le numéro <strong>SIREN 101 447 944</strong>.
                        </p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 text-sm space-y-1.5">
                            <p><strong>Siège social :</strong> 13140 Miramas, France.</p>
                            <p><strong>Adresse électronique :</strong> <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] font-semibold underline">contact@exceeddigital.fr</a>.</p>
                        </div>
                        <p>
                            Les présentes Conditions Générales d'Utilisation, ci-après « CGU », régissent l'accès et l'utilisation de la plateforme Gainable.fr.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Les domaines gainable.ch, gainable.ma, gainable.be, gainable.org et gainable.eu sont également concernés lorsqu'ils redirigent vers le service Gainable.fr. Les dispositions impératives des législations territoriales applicables demeurent réservées.
                        </p>
                    </section>

                    {/* ARTICLE 2 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 2 — DÉFINITIONS
                        </h2>
                        <ul className="space-y-2.5 text-sm pl-2">
                            <li><strong>Plateforme :</strong> le site Gainable.fr et ses fonctionnalités numériques.</li>
                            <li><strong>Utilisateur :</strong> toute personne consultant ou utilisant la plateforme.</li>
                            <li><strong>Particulier :</strong> personne physique recherchant un professionnel pour un projet personnel.</li>
                            <li><strong>Professionnel :</strong> entreprise, artisan, bureau d'études, diagnostiqueur ou travailleur indépendant présentant ses activités sur Gainable.</li>
                            <li><strong>Fiche professionnelle :</strong> espace public présentant les coordonnées, activités, spécialités, réalisations et autres informations d'un professionnel.</li>
                            <li><strong>Mise en relation :</strong> possibilité de contacter un professionnel directement ou par l'intermédiaire d'un formulaire.</li>
                            <li><strong>Demande générale :</strong> demande adressée à Gainable afin de rechercher des professionnels susceptibles de répondre à un projet.</li>
                        </ul>
                    </section>

                    {/* ARTICLE 3 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 3 — OBJET DE LA PLATEFORME
                        </h2>
                        <p>Gainable est une plateforme de référencement professionnel, de visibilité numérique et de mise en relation.</p>
                        <p className="font-semibold text-slate-900">Elle permet notamment :</p>
                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm">
                            <li>De rechercher des professionnels par région, zone d'intervention ou technologie ;</li>
                            <li>De consulter leurs fiches et réalisations ;</li>
                            <li>D'accéder à leurs coordonnées professionnelles ;</li>
                            <li>De les contacter directement par téléphone ou formulaire ;</li>
                            <li>De transmettre une demande générale de recherche de professionnels ;</li>
                            <li>De consulter des informations et contenus relatifs aux activités référencées.</li>
                        </ul>
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 font-medium text-sm">
                            Gainable fournit un service numérique d'annuaire et d'intermédiation. Elle ne réalise pas elle-même les travaux, installations, études, diagnostics ou prestations présentés par les professionnels.
                        </div>
                    </section>

                    {/* ARTICLE 4 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 4 — ACCÈS À LA PLATEFORME
                        </h2>
                        <p>La consultation publique de l'annuaire est libre et gratuite pour les particuliers.</p>
                        <p>Certaines fonctionnalités peuvent nécessiter la communication d'informations personnelles ou la création d'un compte.</p>
                        <p>L'utilisation de la plateforme suppose le respect des présentes CGU.</p>
                        <p className="text-sm font-semibold text-slate-800">
                            L'accès aux prestations payantes destinées aux professionnels est également régi par les Conditions Générales de Vente professionnelles applicables.
                        </p>
                    </section>

                    {/* ARTICLE 5 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 5 — INDÉPENDANCE DES PROFESSIONNELS
                        </h2>
                        <p>Les professionnels référencés sur Gainable exercent leurs activités de manière indépendante.</p>
                        <p>Ils demeurent seuls responsables de leurs propositions commerciales, devis, contrats, prix, assurances, qualifications, garanties et prestations.</p>
                        <p>Gainable ne fixe pas les prix, ne négocie pas les devis, ne signe pas les contrats et n'encaisse aucun paiement relatif aux travaux conclus entre les parties.</p>
                        <p>Gainable ne devient pas partie au contrat conclu entre le particulier et le professionnel du seul fait de leur mise en relation.</p>
                        <p className="text-sm font-medium text-slate-800">Chaque particulier demeure libre de sélectionner, comparer, contacter ou refuser les professionnels présentés.</p>
                    </section>

                    {/* ARTICLE 6 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 6 — RÉFÉRENCEMENT ET CLASSEMENT
                        </h2>
                        <p>L'annuaire Gainable référence des professionnels selon les catégories d'activités proposées sur la plateforme.</p>
                        <p className="font-semibold text-slate-900">Le classement des professionnels repose principalement sur des critères de pertinence géographique et technique, notamment :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>La région et la localisation du projet ;</li>
                            <li>Les zones d'intervention déclarées ;</li>
                            <li>Les technologies et spécialités professionnelles ;</li>
                            <li>La correspondance entre la recherche et les informations disponibles.</li>
                        </ul>
                        <p>Les professionnels peuvent souscrire des prestations payantes de visibilité numérique et de publication de contenus.</p>
                        <p>Le montant payé ne constitue pas, dans le fonctionnement actuel du classement ordinaire, un critère de priorité entre les professionnels.</p>
                        <p>Certaines offres peuvent toutefois comprendre des éléments distinctifs de présentation, tels que des badges ou des fiches enrichies, conformément aux caractéristiques commerciales annoncées.</p>
                        <p className="text-xs text-slate-500 italic">Gainable ne garantit pas une position permanente ou déterminée dans les résultats de recherche internes. Les modalités de référencement, de classement et de déréférencement sont expliquées dans une rubrique d'information accessible aux utilisateurs.</p>
                    </section>

                    {/* ARTICLE 7 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 7 — INFORMATIONS DES FICHES PROFESSIONNELLES
                        </h2>
                        <p>Les fiches peuvent contenir notamment :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>La dénomination commerciale ;</li>
                            <li>Les coordonnées ;</li>
                            <li>Les zones d'intervention ;</li>
                            <li>Les spécialités ;</li>
                            <li>Les qualifications déclarées ;</li>
                            <li>Les réalisations et photographies ;</li>
                            <li>Les liens vers les sites Internet et supports numériques.</li>
                        </ul>
                        <p>Les professionnels sont tenus de fournir des informations exactes, loyales et régulièrement mises à jour.</p>
                        <p>Gainable peut effectuer certaines vérifications, sans que la publication d'une fiche constitue une certification générale de compétence ou de qualité.</p>
                        <p className="font-semibold text-slate-900 text-sm">
                            L'utilisateur est invité à vérifier directement auprès du professionnel les assurances, qualifications, habilitations et garanties nécessaires à son projet.
                        </p>
                    </section>

                    {/* ARTICLE 8 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 8 — CONTACT DIRECT
                        </h2>
                        <p>L'utilisateur peut contacter directement un professionnel au moyen des coordonnées publiées sur sa fiche.</p>
                        <p>Les appels téléphoniques et échanges réalisés en dehors de la plateforme relèvent des relations entre les parties.</p>
                        <p className="text-xs text-slate-500 italic">Gainable ne contrôle pas systématiquement ces communications et ne garantit pas qu'un professionnel répondra à chaque sollicitation.</p>
                    </section>

                    {/* ARTICLE 9 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 9 — FORMULAIRE DE CONTACT D'UN PROFESSIONNEL
                        </h2>
                        <p>Lorsqu'un utilisateur remplit le formulaire associé à une fiche professionnelle, sa demande est destinée au professionnel qu'il a choisi.</p>
                        <p>Les informations communiquées peuvent comprendre son identité, ses coordonnées, la localisation de son projet et la description de sa demande.</p>
                        <p>La transmission intervient dans les conditions annoncées au moment de l'envoi du formulaire et conformément à la politique de confidentialité.</p>
                        <p className="font-semibold text-slate-900">L'envoi d'une demande ne constitue ni une commande de travaux ni une acceptation de devis.</p>
                        <p className="text-xs text-slate-500 italic">Le professionnel reste libre de répondre ou non à la sollicitation.</p>
                    </section>

                    {/* ARTICLE 10 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 10 — DEMANDE GÉNÉRALE ADRESSÉE À GAINABLE
                        </h2>
                        <p>Lorsqu'un utilisateur ne trouve pas de professionnel correspondant à son projet ou à sa zone géographique, il peut adresser une demande générale à Gainable.</p>
                        <p>Gainable peut alors rechercher des professionnels susceptibles de répondre aux caractéristiques du projet.</p>
                        <p>Cette recherche peut concerner des entreprises qui ne sont pas encore référencées sur la plateforme.</p>
                        <p>Gainable peut contacter ces entreprises afin d'évaluer leur intérêt, leur zone d'intervention et leurs compétences déclarées.</p>
                        <p>Le particulier conserve l'entière liberté de choisir ou de refuser les professionnels identifiés.</p>
                        <p>Gainable ne garantit ni la disponibilité d'un professionnel, ni l'obtention d'un devis, ni la réalisation du projet.</p>
                        <p className="text-xs text-slate-500 italic">Les données personnelles de l'utilisateur ne sont communiquées aux entreprises que conformément aux informations fournies lors du dépôt de la demande et à la réglementation applicable.</p>
                    </section>

                    {/* ARTICLE 11 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 11 — ABSENCE DE GARANTIE SUR LES DEVIS ET TRAVAUX
                        </h2>
                        <p className="font-bold text-slate-900">Gainable ne garantit pas :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>Le montant ou la compétitivité des devis ;</li>
                            <li>Les délais de réponse des professionnels ;</li>
                            <li>L'acceptation d'un chantier ;</li>
                            <li>Les délais de réalisation ;</li>
                            <li>La qualité d'exécution des travaux ;</li>
                            <li>La solvabilité des parties ;</li>
                            <li>Le respect par un professionnel de ses obligations contractuelles.</li>
                        </ul>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            Les éventuels différends relatifs à un devis, à un paiement ou à des travaux doivent être traités directement entre les parties concernées, sans préjudice des obligations propres de Gainable.
                        </p>
                    </section>

                    {/* ARTICLE 12 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 12 — VÉRIFICATION ET BADGES
                        </h2>
                        <p>Gainable peut proposer des badges ou mentions permettant d'identifier certaines caractéristiques des professionnels.</p>
                        <p>La signification de chaque badge doit correspondre aux vérifications effectivement réalisées.</p>
                        <p>La présence d'un badge ne constitue pas une garantie de résultat, une assurance des travaux ou une certification officielle, sauf indication expresse et justifiée.</p>
                        <p className="text-xs text-slate-500 italic">Gainable peut retirer un badge lorsque les conditions justifiant son attribution ne sont plus réunies.</p>
                    </section>

                    {/* ARTICLE 13 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 13 — CONTENUS ET PUBLICATIONS
                        </h2>
                        <p>Les professionnels peuvent publier des informations, photographies, réalisations et articles présentant leurs activités.</p>
                        <p>Certains contenus peuvent être préparés avec l'assistance d'outils d'intelligence artificielle.</p>
                        <p>Le professionnel doit veiller à l'exactitude des informations qu'il communique et à la légalité des contenus qu'il fournit ou approuve.</p>
                        <p>Gainable peut appliquer des contrôles de conformité, des corrections techniques ou des mesures de modération dans les conditions prévues par ses documents contractuels et la réglementation applicable.</p>
                        <p className="text-xs text-slate-500 italic">Les contenus publiés ne constituent pas des recommandations techniques personnalisées adressées à l'utilisateur.</p>
                    </section>

                    {/* ARTICLE 14 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 14 — RÉFÉRENCEMENT SUR LES MOTEURS DE RECHERCHE
                        </h2>
                        <p>Gainable met en œuvre des fonctionnalités destinées à faciliter la présentation et la visibilité des contenus sur Internet.</p>
                        <p>L'indexation et le classement des pages sur les moteurs de recherche tiers, notamment Google, dépendent de mécanismes indépendants de Gainable.</p>
                        <p>Aucun positionnement, volume de trafic ou résultat commercial déterminé n'est garanti.</p>
                        <p className="text-xs text-slate-500 italic">Les informations techniques ou commerciales relatives au référencement ne constituent pas une promesse de performance individuelle.</p>
                    </section>

                    {/* ARTICLE 15 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 15 — OBLIGATIONS DES UTILISATEURS
                        </h2>
                        <p className="font-semibold text-slate-900">Les utilisateurs s'engagent à :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>Communiquer des informations exactes lors de leurs demandes ;</li>
                            <li>Utiliser les formulaires pour des demandes légitimes ;</li>
                            <li>Respecter les droits des autres utilisateurs ;</li>
                            <li>Ne pas publier de contenus illicites ;</li>
                            <li>Ne pas usurper l'identité d'un tiers ;</li>
                            <li>Ne pas détourner les coordonnées publiées à des fins abusives ;</li>
                            <li>Ne pas perturber le fonctionnement de la plateforme.</li>
                        </ul>
                        <p className="text-sm font-bold text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                            Les demandes fictives, frauduleuses ou destinées à nuire à un professionnel sont interdites.
                        </p>
                    </section>

                    {/* ARTICLE 16 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 16 — UTILISATIONS INTERDITES
                        </h2>
                        <p>Sont interdits, sauf autorisation ou exception légale applicable :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>L'accès frauduleux aux systèmes ;</li>
                            <li>L'extraction illicite des bases de données ;</li>
                            <li>La collecte automatisée abusive des coordonnées ;</li>
                            <li>La reproduction non autorisée de contenus protégés ;</li>
                            <li>L'utilisation de la plateforme pour diffuser des logiciels malveillants ;</li>
                            <li>Les tentatives de contournement des dispositifs de sécurité ;</li>
                            <li>L'utilisation des informations personnelles à des fins incompatibles avec leur collecte.</li>
                        </ul>
                        <p className="text-xs text-slate-500 italic">Gainable peut prendre les mesures nécessaires pour protéger ses systèmes et ses utilisateurs, dans le respect de la réglementation.</p>
                    </section>

                    {/* ARTICLE 17 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 17 — SIGNALEMENT DES CONTENUS ET COMPORTEMENTS
                        </h2>
                        <p>Tout utilisateur peut signaler un contenu potentiellement illicite, une information trompeuse, une usurpation d'identité ou un comportement abusif.</p>
                        <p>Les signalements peuvent être adressés à <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] underline font-semibold">contact@exceeddigital.fr</a>, sans préjudice de la mise en place d'un dispositif de notification spécifique sur la plateforme lorsque celui-ci est légalement requis.</p>
                        <p>Le signalement doit permettre d'identifier suffisamment le contenu concerné et les motifs de la contestation.</p>
                        <p>Gainable examine les signalements conformément à ses obligations légales et peut, selon les circonstances, demander des précisions, limiter l'accès au contenu ou procéder à son retrait.</p>
                        <p className="text-xs text-slate-500 italic">Les personnes concernées disposent des voies de contestation légalement applicables.</p>
                    </section>

                    {/* ARTICLE 18 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 18 — SUSPENSION ET DÉRÉFÉRENCEMENT
                        </h2>
                        <p>Gainable peut prendre des mesures proportionnées en cas de manquement aux présentes CGU, de fraude, de risque de sécurité ou de publication illicite.</p>
                        <p>Ces mesures peuvent comprendre la restriction d'une fonctionnalité, le retrait d'un contenu, la suspension d'une fiche ou le déréférencement d'un professionnel.</p>
                        <p>Les obligations de motivation, de notification, de préavis et de recours prévues par les réglementations applicables sont respectées.</p>
                        <p className="text-xs text-slate-500 italic">Les conséquences commerciales des mesures concernant un abonnement payant sont régies par les CGV professionnelles et les dispositions légales impératives.</p>
                    </section>

                    {/* ARTICLE 19 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 19 — RESPONSABILITÉ DE GAINABLE
                        </h2>
                        <p>Gainable est responsable de l'exécution de ses propres obligations conformément au droit applicable.</p>
                        <p>La plateforme n'est pas responsable du seul fait qu'un professionnel ne répond pas à une demande, qu'un devis est refusé ou qu'un chantier donne lieu à un différend entre les parties.</p>
                        <p>Gainable ne peut toutefois exclure les responsabilités qui lui incombent légalement, notamment concernant ses propres fautes, ses obligations d'information et les obligations applicables aux services numériques.</p>
                        <p className="text-xs text-slate-500 italic">Les limitations prévues aux présentes CGU ne privent pas les consommateurs des droits impératifs qui leur sont reconnus.</p>
                    </section>

                    {/* ARTICLE 20 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 20 — DISPONIBILITÉ TECHNIQUE
                        </h2>
                        <p>Gainable s'efforce de maintenir l'accès à ses services dans des conditions raisonnables de disponibilité et de sécurité.</p>
                        <p>Des interruptions peuvent intervenir pour maintenance, mise à jour, incident technique ou événement extérieur.</p>
                        <p>Gainable prend les mesures appropriées pour remédier aux dysfonctionnements relevant de sa responsabilité.</p>
                        <p className="text-xs text-slate-500 italic">Aucune disposition du présent article ne limite les recours légalement ouverts aux utilisateurs.</p>
                    </section>

                    {/* ARTICLE 21 */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 21 — PROPRIÉTÉ INTELLECTUELLE ET PROTECTION DU RÉSEAU MULTIDOMAINE GAINABLE
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

                    {/* ARTICLE 22 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 22 — DONNÉES PERSONNELLES
                        </h2>
                        <p>Gainable traite les données personnelles nécessaires au fonctionnement de ses services dans les conditions décrites dans sa politique de confidentialité.</p>
                        <p>Les utilisateurs disposent des droits prévus par la réglementation applicable, notamment les droits d'accès, de rectification, d'effacement et d'opposition dans les conditions légales.</p>
                        <p>Les modalités de communication des données aux professionnels et les durées de conservation sont précisées dans la politique de confidentialité.</p>
                        <p className="text-sm font-semibold">Contact DPO / Données : <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] underline">contact@exceeddigital.fr</a>.</p>
                    </section>

                    {/* ARTICLE 23 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 23 — COOKIES ET TRACEURS
                        </h2>
                        <p>La plateforme peut utiliser des cookies ou technologies similaires nécessaires à son fonctionnement, ainsi que d'autres traceurs selon les outils effectivement déployés.</p>
                        <p>Lorsque la réglementation l'exige, les traceurs non essentiels sont soumis au consentement préalable de l'utilisateur.</p>
                        <p className="text-xs text-slate-500 italic">Les modalités de gestion des préférences sont détaillées dans la politique de cookies.</p>
                    </section>

                    {/* ARTICLE 24 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 24 — MODIFICATION DES CGU
                        </h2>
                        <p>Gainable peut modifier les présentes CGU pour tenir compte d'évolutions légales, réglementaires, techniques ou fonctionnelles.</p>
                        <p>Les modifications substantielles sont portées à la connaissance des utilisateurs concernés dans des conditions appropriées.</p>
                        <p>Les modifications affectant les droits contractuels des professionnels abonnés sont également soumises aux CGV et aux règles légales applicables.</p>
                        <p className="text-xs text-slate-500 italic">Aucune modification ne peut priver rétroactivement un utilisateur d'un droit impératif.</p>
                    </section>

                    {/* ARTICLE 25 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 25 — RÉCLAMATIONS
                        </h2>
                        <p>Toute réclamation relative au fonctionnement de Gainable peut être adressée à <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] underline font-semibold">contact@exceeddigital.fr</a>.</p>
                        <p>Les litiges relatifs à la réalisation de travaux ou aux devis conclus directement avec un professionnel doivent être adressés en priorité au professionnel concerné.</p>
                        <p className="text-xs text-slate-500 italic">Cette orientation ne limite pas le droit d'agir contre Gainable lorsqu'un manquement lui est directement imputable.</p>
                    </section>

                    {/* ARTICLE 26 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 26 — DROIT APPLICABLE ET LITIGES
                        </h2>
                        <p>Les présentes CGU sont régies par le droit français, sous réserve des dispositions impératives applicables, notamment en matière de protection des consommateurs.</p>
                        <p>Les litiges sont soumis aux juridictions légalement compétentes.</p>
                        <p className="text-xs text-slate-500 italic">Aucune clause attributive de compétence territoriale ne peut être opposée à un consommateur en méconnaissance des règles protectrices applicables.</p>
                    </section>

                    {/* ARTICLE 27 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 27 — DISPOSITIONS FINALES
                        </h2>
                        <p>Si une stipulation des présentes CGU est déclarée invalide, les autres dispositions demeurent applicables dans la mesure permise par la loi.</p>
                        <p>La version applicable est identifiée par sa date de mise à jour.</p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-800">
                            Les présentes CGU doivent être lues conjointement avec les <Link href="/mentions-legales" className="text-[#D59B2B] underline">mentions légales</Link>, la <Link href="/politique-confidentialite" className="text-[#D59B2B] underline">politique de confidentialité</Link> et, pour les abonnés professionnels, les <Link href="/cgv" className="text-[#D59B2B] underline">CGV professionnelles</Link>.
                        </div>
                    </section>

                </div>

            </div>
        </main>
    );
}
