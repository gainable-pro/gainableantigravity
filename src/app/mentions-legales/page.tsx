import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, Server, Globe2, ShieldAlert, Award, FileText, Lock, Cookie, HelpCircle, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: "Mentions Légales - Gainable.fr",
    description: "Mentions légales officielles de la plateforme Gainable.fr éditée par EXCEED DIGITAL SAS (SIREN 101 447 944, RCS Salon-de-Provence). Marque déposée INPI.",
    alternates: {
        canonical: "https://www.gainable.fr/mentions-legales",
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function MentionsLegales() {
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
                        <Link href="/cgu" className="hover:underline">CGU</Link>
                        <span>•</span>
                        <Link href="/cgv" className="hover:underline font-semibold text-amber-700">CGV Pro</Link>
                        <span>•</span>
                        <Link href="/politique-confidentialite" className="hover:underline">Confidentialité</Link>
                        <span>•</span>
                        <Link href="/politique-cookies" className="hover:underline">Cookies</Link>
                    </div>
                </div>

                {/* En-tête Principal */}
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black uppercase tracking-wider mb-4">
                        <Scale className="w-4 h-4 text-[#D59B2B]" /> Informations Réglementaires Officielles
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-3 leading-tight">
                        MENTIONS LÉGALES
                    </h1>
                    <p className="text-[#D59B2B] font-bold uppercase tracking-wider text-sm md:text-base mb-3">
                        GAINABLE.FR — EXCEED DIGITAL
                    </p>
                    <p className="text-xs text-slate-500">Dernière mise à jour : 8 novembre 2026</p>
                </div>

                {/* Corps des Mentions Légales */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">

                    {/* ARTICLE 1 — ÉDITEUR DU SITE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Building2 className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 1 — ÉDITEUR DU SITE
                        </h2>
                        <p>Le site <strong>gainable.fr</strong> est édité par :</p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 text-sm space-y-1.5">
                            <p><strong>Raison sociale :</strong> GAINABLE.FR by EXCEED DIGITAL</p>
                            <p><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
                            <p><strong>Siège social :</strong> 13140 Miramas, France</p>
                            <p><strong>SIREN :</strong> 101 447 944</p>
                            <p><strong>RCS :</strong> Salon-de-Provence</p>
                            <p><strong>Directeur de la publication :</strong> Direction EXCEED DIGITAL</p>
                        </div>
                    </section>

                    {/* ARTICLE 2 — HÉBERGEMENT */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Server className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 2 — HÉBERGEMENT
                        </h2>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 text-sm space-y-1">
                            <p>Le site est hébergé par :</p>
                            <p className="font-bold text-slate-900">Vercel Inc.</p>
                            <p>Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                            <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#D59B2B] underline">https://vercel.com</a></p>
                        </div>
                    </section>

                    {/* ARTICLE 3 — PRÉSENTATION DE LA PLATEFORME GAINABLE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 3 — PRÉSENTATION DE LA PLATEFORME GAINABLE
                        </h2>
                        
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-900 text-base">3.1 — Nature de l'activité</h3>
                            <p>
                                <strong>GAINABLE.FR</strong> est une plateforme numérique de référencement professionnel, de visibilité en ligne et de mise en relation entre particuliers et professionnels.
                            </p>
                            <p className="font-semibold text-slate-800 text-sm">La plateforme permet notamment :</p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-slate-600">
                                <li>La recherche de professionnels selon leur localisation, leurs zones d'intervention et leurs spécialités ;</li>
                                <li>La consultation de fiches professionnelles ;</li>
                                <li>L'accès aux coordonnées des entreprises référencées ;</li>
                                <li>La prise de contact directe par téléphone ou formulaire ;</li>
                                <li>La présentation de réalisations, photographies et contenus professionnels ;</li>
                                <li>La publication d'articles et de contenus liés aux activités des professionnels ;</li>
                                <li>L'accès, selon les offres souscrites, à des fonctionnalités numériques d'assistance rédactionnelle par intelligence artificielle.</li>
                            </ul>
                        </div>

                        <div className="space-y-2 pt-2">
                            <h3 className="font-bold text-slate-900 text-base">3.2 — Indépendance des professionnels</h3>
                            <p>Les professionnels référencés sur Gainable exercent leurs activités de manière indépendante.</p>
                            <p>EXCEED DIGITAL ne réalise pas les travaux, diagnostics, études, installations ou autres prestations proposés par ces professionnels.</p>
                            <p>Gainable ne fixe pas les prix des prestations, ne négocie pas les devis, ne signe pas les contrats de travaux et n'encaisse pas les paiements correspondants.</p>
                            <p>Les devis, commandes, contrats et prestations sont établis directement entre les particuliers et les professionnels concernés.</p>
                            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-950 font-medium text-sm">
                                Gainable ne prélève aucune commission sur les contrats de travaux conclus entre ces parties.
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <h3 className="font-bold text-slate-900 text-base">3.3 — Recherche complémentaire de professionnels</h3>
                            <p>
                                Lorsqu'aucun professionnel référencé ne correspond à une demande, Gainable peut rechercher d'autres entreprises susceptibles d'y répondre, y compris des entreprises non encore présentes dans l'annuaire.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Cette démarche ne garantit pas qu'un professionnel sera identifié, disponible ou retenu.
                            </p>
                        </div>

                        <div className="space-y-2 pt-2">
                            <h3 className="font-bold text-slate-900 text-base">3.4 — Classement et visibilité</h3>
                            <p>
                                Le classement ordinaire des professionnels repose principalement sur des critères de pertinence géographique et technique, notamment la localisation, les zones d'intervention, les spécialités et les technologies déclarées.
                            </p>
                            <p>
                                Certaines offres peuvent inclure des fonctionnalités de présentation supplémentaires, notamment des badges, des fiches enrichies ou des éléments de visibilité particuliers.
                            </p>
                            <p>
                                Les modalités de classement, de présentation et de déréférencement sont détaillées dans les <Link href="/cgu" className="text-[#D59B2B] underline">Conditions Générales d'Utilisation</Link> et les informations consacrées au fonctionnement de la plateforme.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Gainable ne garantit aucun positionnement déterminé dans les résultats des moteurs de recherche tiers, ni aucun volume de contacts, de contrats ou de chiffre d'affaires.
                            </p>
                        </div>
                    </section>

                    {/* ARTICLE 4 — RÉSEAU MULTIDOMAINE GAINABLE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Globe2 className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 4 — RÉSEAU MULTIDOMAINE GAINABLE
                        </h2>
                        <p>
                            L'écosystème numérique Gainable comprend notamment les noms de domaine suivants, lorsqu'ils sont effectivement exploités par EXCEED DIGITAL :
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 py-1 text-sm font-semibold text-[#D59B2B]">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.fr</div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.ch</div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.ma</div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.be</div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.org</div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.eu</div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">• www.gainable.ca</div>
                        </div>
                        <p>
                            Ces domaines peuvent proposer des contenus, des fonctionnalités ou des redirections vers une plateforme commune, selon leur configuration technique.
                        </p>
                        <p>
                            Les droits de propriété intellectuelle portant sur les éléments protégés de Gainable s'appliquent indépendamment du domaine utilisé, dans les limites des territoires et réglementations concernés.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            L'exploitation de plusieurs noms de domaine ne confère pas, à elle seule, un droit exclusif sur le principe d'un réseau multidomaine.
                        </p>
                    </section>

                    {/* ARTICLE 5 — MARQUE GAINABLE.FR, PROPRIÉTÉ INTELLECTUELLE ET PROTECTION CONTRE L'IMITATION */}
                    <section className="space-y-6 pt-2">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Award className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 5 — MARQUE GAINABLE.FR, PROPRIÉTÉ INTELLECTUELLE ET PROTECTION CONTRE L'IMITATION
                        </h2>

                        {/* 5.1 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.1 — Titularité de la marque GAINABLE.FR</h3>
                            <p>
                                La dénomination <strong>GAINABLE.FR</strong> a fait l'objet d'un dépôt de marque verbale auprès de l'Institut national de la propriété industrielle (INPI).
                            </p>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 space-y-1">
                                <p className="font-bold text-slate-900">Les références officielles du dépôt :</p>
                                <p><strong>Marque verbale :</strong> GAINABLE.FR</p>
                                <p><strong>Numéro national :</strong> 24 5050824</p>
                                <p><strong>Date de dépôt :</strong> 28 avril 2024</p>
                                <p><strong>Titulaire initial et actuel déclaré :</strong> Monsieur Maroann GHARIB</p>
                                <p><strong>Classes mentionnées au dépôt :</strong> 1, 11, 37 et 38</p>
                                <p><strong>Territoire du dépôt :</strong> France</p>
                            </div>
                            <p>
                                La société <strong>EXCEED DIGITAL</strong> exploite la dénomination GAINABLE.FR dans le cadre de ses activités de référencement professionnel, de visibilité numérique et de mise en relation.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Les droits attachés à cette marque sont réservés à son titulaire, dans les limites de son statut au registre, de sa validité, des produits et services protégés et des dispositions légales applicables.
                            </p>
                        </div>

                        {/* 5.2 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.2 — Protection contre les noms de domaine similaires</h3>
                            <p>
                                Conformément notamment à l'article L.713-2 du Code de la propriété intellectuelle, l'utilisation non autorisée, dans la vie des affaires, d'un signe identique ou similaire à une marque protégée peut constituer une atteinte aux droits de son titulaire lorsque les conditions légales sont réunies.
                            </p>
                            <p>
                                Cette protection peut notamment concerner les marques, dénominations commerciales, enseignes et noms de domaine créant un risque de confusion ou d'association avec <strong>GAINABLE.FR</strong>.
                            </p>
                            <p className="font-semibold text-slate-800">Sont notamment susceptibles de faire l'objet d'une contestation les variantes obtenues par :</p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                                <li>L'ajout d'une ou plusieurs lettres ;</li>
                                <li>La suppression de caractères ;</li>
                                <li>L'inversion de lettres ;</li>
                                <li>La substitution de caractères ;</li>
                                <li>L'utilisation d'une extension de domaine différente ;</li>
                                <li>La reprise d'éléments distinctifs créant une confusion sur l'origine commerciale du service.</li>
                            </ul>
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-medium text-sm space-y-1">
                                <p className="font-bold">Illustration jurisprudentielle &amp; protection :</p>
                                <p>
                                    À titre d'illustration, l'utilisation d'un nom de domaine tel que <em>gainables.fr</em> pour proposer des services similaires peut être contestée lorsqu'elle porte atteinte aux droits antérieurs concernés. La modification d'une seule lettre ne suffit pas nécessairement à écarter un risque de confusion.
                                </p>
                            </div>
                            <p className="text-xs text-slate-500 italic">
                                L'appréciation dépend notamment de la similitude des signes, des produits ou services concernés, du territoire protégé et des circonstances d'utilisation.
                            </p>
                        </div>

                        {/* 5.3 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.3 — Protection contre l'usurpation de l'identité commerciale</h3>
                            <p>
                                Toute utilisation de signes, présentations ou communications créant une confusion trompeuse avec Gainable peut faire l'objet d'une contestation dans les conditions prévues par la loi.
                            </p>
                            <p className="font-semibold text-slate-800">Sont notamment susceptibles d'être concernés :</p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                                <li>Les sites se présentant faussement comme officiels ou affiliés à Gainable ;</li>
                                <li>Les utilisations non autorisées de signes protégés ;</li>
                                <li>Les communications trompeuses sur l'existence d'un partenariat ;</li>
                                <li>Les imitations commerciales constitutives de concurrence déloyale ;</li>
                                <li>Les pratiques de parasitisme engageant la responsabilité de leur auteur.</li>
                            </ul>
                        </div>

                        {/* 5.4 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.4 — Protection des logiciels, codes sources et contenus</h3>
                            <p>
                                Sous réserve des droits de tiers, EXCEED DIGITAL détient ou exploite les droits nécessaires sur les éléments protégés de la plateforme, notamment :
                            </p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                                <li>Les logiciels et codes sources originaux ;</li>
                                <li>Les développements informatiques spécifiques ;</li>
                                <li>Les interfaces et créations graphiques originales ;</li>
                                <li>Les textes et contenus éditoriaux propres à Gainable ;</li>
                                <li>Les logos et autres signes distinctifs protégés ;</li>
                                <li>Les éléments originaux de présentation du site ;</li>
                                <li>Les développements spécifiques liés aux outils numériques et d'intelligence artificielle.</li>
                            </ul>
                            <p className="text-xs text-slate-500 italic">
                                Toute reproduction, représentation, adaptation, diffusion ou exploitation non autorisée de ces éléments est interdite lorsqu'elle porte atteinte aux droits de leurs titulaires, sous réserve des exceptions prévues par la loi.
                            </p>
                        </div>

                        {/* 5.5 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.5 — Protection contre la reproduction du site</h3>
                            <p>La reproduction non autorisée d'éléments protégés de Gainable peut constituer une contrefaçon.</p>
                            <p>
                                L'imitation de l'identité visuelle, de la présentation commerciale ou d'éléments distinctifs de la plateforme peut également être contestée lorsqu'elle constitue un acte de concurrence déloyale ou de parasitisme.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                La protection ne s'étend pas automatiquement aux idées générales, aux fonctionnalités usuelles ou au principe d'un annuaire professionnel.
                            </p>
                        </div>

                        {/* 5.6 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.6 — Protection des bases de données</h3>
                            <p>
                                Les bases de données Gainable peuvent bénéficier de la protection du droit d'auteur et/ou du droit spécifique du producteur de bases de données lorsque les conditions légales sont réunies.
                            </p>
                            <p>
                                Conformément aux articles L.341-1 et suivants du Code de la propriété intellectuelle, les titulaires concernés se réservent les droits légalement reconnus sur ces bases.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Sous réserve des exceptions légales, les extractions et réutilisations portant atteinte à ces droits sont interdites, y compris lorsqu'elles sont effectuées au moyen de robots, scripts ou autres outils automatisés.
                            </p>
                        </div>

                        {/* 5.7 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.7 — Protection du savoir-faire et des informations confidentielles</h3>
                            <p>
                                Les informations techniques, commerciales ou organisationnelles non publiques relatives à Gainable peuvent bénéficier de la protection du secret des affaires lorsque les conditions légales sont réunies.
                            </p>
                            <p className="font-semibold text-slate-800">Ces informations peuvent notamment concerner :</p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                                <li>Certains développements techniques internes ;</li>
                                <li>Les paramètres confidentiels de fonctionnement ;</li>
                                <li>Les méthodes internes de gestion des données ;</li>
                                <li>Les informations stratégiques non publiques ;</li>
                                <li>Les éléments confidentiels de l'architecture technique et multidomaine.</li>
                            </ul>
                            <p className="text-xs text-slate-500 italic">
                                Cette protection ne s'applique pas aux informations librement accessibles ou aux idées générales non protégées.
                            </p>
                        </div>

                        {/* 5.8 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.8 — Protection des contenus appartenant aux professionnels</h3>
                            <p>
                                Les photographies, logos, marques, réalisations, textes et autres contenus fournis par les professionnels restent soumis aux droits de leurs titulaires respectifs.
                            </p>
                            <p>
                                Leur publication sur Gainable intervient conformément aux autorisations et conditions contractuelles applicables.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                EXCEED DIGITAL ne revendique pas la propriété exclusive des contenus appartenant légitimement aux professionnels ou à des tiers.
                            </p>
                        </div>

                        {/* 5.9 */}
                        <div className="space-y-3 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.9 — Actions en défense des droits</h3>
                            <p>
                                Les titulaires des droits concernés se réservent la possibilité d'engager toute démarche légalement appropriée en cas de contrefaçon, d'usurpation de signes distinctifs, d'extraction illicite de données, de violation d'un secret d'affaires ou d'actes de concurrence déloyale.
                            </p>
                            <p className="font-semibold text-slate-800">Ces démarches peuvent notamment comprendre :</p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                                <li>Une mise en demeure ;</li>
                                <li>Un signalement auprès d'un hébergeur ou d'un bureau d'enregistrement ;</li>
                                <li>Une procédure de résolution de litige concernant un nom de domaine ;</li>
                                <li>Une action en contrefaçon de marque ;</li>
                                <li>Une action en concurrence déloyale ou en parasitisme ;</li>
                                <li>Une demande de cessation des agissements ;</li>
                                <li>Une demande de réparation du préjudice subi.</li>
                            </ul>
                            <p className="text-xs text-slate-500 italic">
                                Ces dispositions s'appliquent sous réserve des droits des utilisateurs et des réglementations impératives applicables.
                            </p>
                        </div>
                    </section>

                    {/* ARTICLE 6 — INFORMATIONS PUBLIÉES PAR LES PROFESSIONNELS */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 6 — INFORMATIONS PUBLIÉES PAR LES PROFESSIONNELS
                        </h2>
                        <p>
                            Les professionnels référencés sont responsables de l'exactitude et de la mise à jour des informations qu'ils communiquent concernant leurs activités, qualifications, coordonnées, assurances et réalisations.
                        </p>
                        <p>
                            Gainable peut demander des justificatifs ou procéder à certaines vérifications.
                        </p>
                        <p>
                            La publication d'une fiche professionnelle ne constitue pas, à elle seule, une certification générale de compétence, une garantie de qualité des prestations ou une assurance de leur bonne exécution.
                        </p>
                        <p>
                            Les badges éventuellement affichés doivent correspondre aux caractéristiques ou vérifications effectivement réalisées.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Les professionnels restent responsables de leurs devis, contrats, prestations et obligations légales.
                        </p>
                    </section>

                    {/* ARTICLE 7 — SIGNALEMENT DES CONTENUS ILLICITES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <ShieldAlert className="w-5 h-5 text-rose-600" />
                            ARTICLE 7 — SIGNALEMENT DES CONTENUS ILLICITES
                        </h2>
                        <p>Tout utilisateur peut signaler notamment :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-slate-600">
                            <li>Un contenu potentiellement illicite ;</li>
                            <li>Une usurpation d'identité ;</li>
                            <li>Une information professionnelle trompeuse ;</li>
                            <li>Une atteinte à un droit de propriété intellectuelle ;</li>
                            <li>Un comportement frauduleux ;</li>
                            <li>Une utilisation abusive de la plateforme.</li>
                        </ul>
                        <p>
                            Les signalements peuvent être adressés à l'éditeur au moyen des coordonnées de contact mises à disposition sur le site (<a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] underline">contact@exceeddigital.fr</a>).
                        </p>
                        <p>
                            Le signalement doit permettre d'identifier le contenu concerné, son emplacement et les motifs de la contestation.
                        </p>
                        <p>
                            Gainable examine les signalements conformément aux obligations légales applicables et peut, selon les circonstances, demander des informations complémentaires, restreindre l'accès à un contenu ou procéder à son retrait.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Lorsque la réglementation applicable l'exige, un mécanisme de notification et de recours adapté est mis à disposition.
                        </p>
                    </section>

                    {/* ARTICLE 8 — PROTECTION DES DONNÉES PERSONNELLES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Lock className="w-5 h-5 text-emerald-600" />
                            ARTICLE 8 — PROTECTION DES DONNÉES PERSONNELLES
                        </h2>
                        <p>
                            EXCEED DIGITAL traite des données personnelles dans le cadre de l'exploitation de Gainable.fr.
                        </p>
                        <p className="font-semibold text-slate-800">Ces traitements peuvent notamment concerner :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm text-slate-600">
                            <li>Les visiteurs ;</li>
                            <li>Les particuliers recherchant un professionnel ;</li>
                            <li>Les professionnels inscrits ou abonnés ;</li>
                            <li>Les représentants d'entreprises ;</li>
                            <li>Les professionnels contactés dans le cadre de recherches complémentaires.</li>
                        </ul>
                        <p>
                            Les finalités, bases juridiques, destinataires, durées de conservation et droits des personnes concernées sont détaillés dans la <Link href="/politique-confidentialite" className="text-[#D59B2B] font-bold underline">Politique de confidentialité</Link>.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Les personnes concernées peuvent exercer leurs droits selon les modalités indiquées dans cette politique et introduire une réclamation auprès de la Commission nationale de l'informatique et des libertés (CNIL).
                        </p>
                    </section>

                    {/* ARTICLE 9 — COOKIES ET TRACEURS */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Cookie className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 9 — COOKIES ET TRACEURS
                        </h2>
                        <p>
                            Gainable peut utiliser des cookies et technologies similaires nécessaires au fonctionnement du site, à la sécurité des comptes et, selon les outils déployés, à la mesure d'audience ou à d'autres fonctionnalités.
                        </p>
                        <p>
                            Les traceurs soumis à consentement ne doivent être activés qu'après l'obtention d'un consentement valable.
                        </p>
                        <p>
                            Les utilisateurs peuvent consulter la <Link href="/politique-cookies" className="text-[#D59B2B] font-bold underline">Politique de cookies</Link> disponible sur le site pour connaître les finalités des traceurs et les modalités de gestion de leurs préférences.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Un mécanisme permettant de modifier ou retirer le consentement est mis à disposition lorsque celui-ci est requis.
                        </p>
                    </section>

                    {/* ARTICLE 10 — LIENS HYPERTEXTES ET SITES TIERS */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 10 — LIENS HYPERTEXTES ET SITES TIERS
                        </h2>
                        <p>
                            Gainable.fr peut contenir des liens vers des sites Internet exploités par des professionnels référencés ou d'autres tiers.
                        </p>
                        <p>Ces sites sont placés sous la responsabilité de leurs éditeurs respectifs.</p>
                        <p>EXCEED DIGITAL ne contrôle pas systématiquement les contenus de ces sites.</p>
                        <p className="text-xs text-slate-500 italic">
                            EXCEED DIGITAL n'est pas responsable du seul fait de l'existence de liens vers des sites tiers, sans préjudice des obligations légales qui lui incombent.
                        </p>
                    </section>

                    {/* ARTICLE 11 — DISPONIBILITÉ ET SÉCURITÉ DU SITE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 11 — DISPONIBILITÉ ET SÉCURITÉ DU SITE
                        </h2>
                        <p>
                            EXCEED DIGITAL met en œuvre des moyens raisonnables pour assurer la disponibilité, le fonctionnement et la sécurité de Gainable.fr.
                        </p>
                        <p>Des interruptions peuvent intervenir notamment pour maintenance, mise à jour ou incident technique.</p>
                        <p>Gainable prend les mesures appropriées pour remédier aux dysfonctionnements relevant de sa responsabilité.</p>
                        <p className="text-xs text-slate-500 italic">
                            Aucune disposition du présent article n'a pour objet d'exclure une responsabilité qui ne pourrait légalement l'être.
                        </p>
                    </section>

                    {/* ARTICLE 12 — DOCUMENTS CONTRACTUELS APPLICABLES */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <FileText className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 12 — DOCUMENTS CONTRACTUELS APPLICABLES
                        </h2>
                        <p>
                            L'utilisation de Gainable.fr et la souscription de prestations professionnelles sont régies, selon les situations, par les documents suivants :
                        </p>
                        <ul className="space-y-2 text-sm pl-2">
                            <li>
                                <strong>Conditions Générales d'Utilisation :</strong> <Link href="/cgu" className="text-[#D59B2B] underline">https://www.gainable.fr/cgu</Link>
                            </li>
                            <li>
                                <strong>Conditions Générales de Vente professionnelles :</strong> <Link href="/cgv" className="text-[#D59B2B] underline">https://www.gainable.fr/cgv</Link>
                            </li>
                            <li>
                                <strong>Politique de confidentialité :</strong> <Link href="/politique-confidentialite" className="text-[#D59B2B] underline">https://www.gainable.fr/politique-confidentialite</Link>
                            </li>
                            <li>
                                <strong>Politique de cookies :</strong> <Link href="/politique-cookies" className="text-[#D59B2B] underline">https://www.gainable.fr/politique-cookies</Link>
                            </li>
                            <li>
                                <strong>Informations sur le référencement et la visibilité :</strong> <Link href="/faq-visibilite-referencement" className="text-[#D59B2B] underline">https://www.gainable.fr/faq-visibilite-referencement</Link>
                            </li>
                        </ul>
                        <p className="text-xs text-slate-500 italic pt-1">
                            Les documents contractuels applicables aux abonnements professionnels sont communiqués au moment de la souscription.
                        </p>
                    </section>

                    {/* ARTICLE 13 — DROIT APPLICABLE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 13 — DROIT APPLICABLE
                        </h2>
                        <p>
                            Les présentes mentions légales sont établies conformément au droit français, sous réserve des dispositions impératives éventuellement applicables.
                        </p>
                        <p>
                            L'exploitation de services sur plusieurs noms de domaine ou à destination de différents territoires peut nécessiter le respect de réglementations locales complémentaires.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Les litiges sont soumis aux règles de compétence juridictionnelle légalement applicables.
                        </p>
                    </section>

                    {/* ARTICLE 14 — CONTACT */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <HelpCircle className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 14 — CONTACT
                        </h2>
                        <p>
                            Pour toute question relative au site, à ses services, à un signalement ou à ses informations légales, les utilisateurs peuvent contacter l'éditeur par les moyens de communication mis à disposition sur Gainable.fr.
                        </p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm space-y-1">
                            <p><strong>Éditeur :</strong> GAINABLE.FR by EXCEED DIGITAL</p>
                            <p><strong>Siège social :</strong> 13140 Miramas, France</p>
                            <p><strong>Email :</strong> <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] font-semibold underline">contact@exceeddigital.fr</a></p>
                            <p><strong>Site Internet :</strong> <a href="https://www.gainable.fr" className="text-[#D59B2B] underline font-semibold">https://www.gainable.fr</a></p>
                        </div>
                    </section>

                    {/* FOOTER NOTICE */}
                    <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
                        <p className="font-bold text-slate-700">FIN DES MENTIONS LÉGALES — GAINABLE.FR</p>
                    </div>

                </div>

            </div>
        </main>
    );
}
