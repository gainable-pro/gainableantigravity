import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie, ShieldCheck, Settings, Globe2, Building2 } from 'lucide-react';

export const metadata: Metadata = {
    title: "Politique de Cookies et Traceurs - Gainable.fr",
    description: "Politique de gestion des cookies et traceurs de Gainable.fr (EXCEED DIGITAL SAS) : finalités, consentement CNIL, paramétrage et inventaire technique.",
    alternates: {
        canonical: "https://www.gainable.fr/politique-cookies",
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function PolitiqueCookiesPage() {
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
                        <Link href="/politique-confidentialite" className="hover:underline">Confidentialité</Link>
                        <span>•</span>
                        <Link href="/cgu" className="hover:underline">CGU</Link>
                        <span>•</span>
                        <Link href="/cgv" className="hover:underline font-semibold text-amber-700">CGV Pro</Link>
                    </div>
                </div>

                {/* En-tête Principal */}
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 text-xs font-black uppercase tracking-wider mb-4">
                        <Cookie className="w-4 h-4 text-[#D59B2B]" /> Gestion des Cookies &amp; Traceurs
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-3 leading-tight">
                        POLITIQUE DE COOKIES ET AUTRES TRACEURS
                    </h1>
                    <p className="text-base md:text-lg font-bold text-[#D59B2B] mb-4">
                        GAINABLE.FR — EXCEED DIGITAL
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                        <span>Version du 8 novembre 2026</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-amber-800 font-bold">Projet à compléter après inventaire technique</span>
                    </div>
                </div>

                {/* Corps de la Politique */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">

                    {/* 1. OBJET */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            1. OBJET
                        </h2>
                        <p>
                            La présente politique explique l'utilisation des cookies et autres traceurs sur le site <strong>Gainable.fr</strong>, exploité par <strong>EXCEED DIGITAL</strong>.
                        </p>
                        <p>
                            Elle présente leurs finalités, les conditions dans lesquelles ils sont utilisés et les moyens permettant aux visiteurs de gérer leurs préférences.
                        </p>
                    </section>

                    {/* 2. QU'EST-CE QU'UN COOKIE ? */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            2. QU'EST-CE QU'UN COOKIE ?
                        </h2>
                        <p>
                            Un cookie est un petit fichier ou un identifiant susceptible d'être enregistré ou consulté sur le terminal d'un utilisateur lorsqu'il visite un site Internet.
                        </p>
                        <p>
                            D'autres technologies, telles que le stockage local (Local Storage, Session Storage), certains identifiants techniques ou les pixels, peuvent remplir des fonctions similaires.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            Les règles applicables dépendent de la finalité et du fonctionnement de ces technologies, et non uniquement de leur dénomination.
                        </p>
                    </section>

                    {/* 3. CATÉGORIES DE TRACEURS */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            3. CATÉGORIES DE TRACEURS
                        </h2>

                        {/* 3.1 */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                3.1. Traceurs strictement nécessaires
                            </h3>
                            <p className="text-sm">
                                Certains traceurs sont indispensables au fonctionnement du site ou à la fourniture d'un service expressément demandé par l'utilisateur.
                            </p>
                            <p className="text-sm font-semibold text-slate-800">Ils peuvent notamment servir à :</p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-xs md:text-sm text-slate-600">
                                <li>Maintenir une session de connexion sécurisée ;</li>
                                <li>Sécuriser l'accès à un espace professionnel ;</li>
                                <li>Mémoriser les préférences de confidentialité relatives aux traceurs ;</li>
                                <li>Assurer le fonctionnement et la protection d'un formulaire ;</li>
                                <li>Prévenir les usages frauduleux et protéger les systèmes ;</li>
                                <li>Maintenir les fonctions techniques nécessaires à une commande ou un abonnement.</li>
                            </ul>
                            <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                                Lorsqu'ils répondent aux conditions légales d'exemption, ces traceurs ne nécessitent pas de consentement préalable.
                            </p>
                        </div>

                        {/* 3.2 */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-900">3.2. Mesure d'audience</h3>
                            <p className="text-sm">
                                Des outils statistiques peuvent être utilisés pour comprendre la fréquentation des pages, détecter les difficultés de navigation et améliorer les performances du site.
                            </p>
                            <p className="text-sm">
                                Selon leur configuration, les traceurs de mesure d'audience peuvent être soumis au consentement ou bénéficier d'une exemption strictement encadrée par la CNIL.
                            </p>
                            <p className="text-xs text-slate-500 italic">Gainable vérifie cette qualification au regard des caractéristiques réelles de l'outil utilisé.</p>
                        </div>

                        {/* 3.3 */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-900">3.3. Personnalisation et fonctionnalités facultatives</h3>
                            <p className="text-sm">
                                Certains traceurs peuvent permettre de mémoriser des préférences non indispensables ou d'activer des fonctionnalités facultatives.
                            </p>
                            <p className="text-xs text-slate-500 italic">Ils sont soumis au consentement préalable lorsque la réglementation l'exige.</p>
                        </div>

                        {/* 3.4 */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-900">3.4. Publicité et mesure des campagnes</h3>
                            <p className="text-sm">
                                Si Gainable utilise des outils publicitaires ou de mesure des conversions reposant sur des traceurs non essentiels, ceux-ci sont soumis au consentement préalable requis.
                            </p>
                            <p className="text-sm font-semibold text-rose-800">
                                Aucun traceur publicitaire nécessitant un consentement ne doit être activé avant l'obtention de ce consentement.
                            </p>
                        </div>

                        {/* 3.5 */}
                        <div className="space-y-2">
                            <h3 className="font-bold text-slate-900">3.5. Services intégrés de tiers</h3>
                            <p className="text-sm">
                                Certaines pages peuvent intégrer des cartes interactives, vidéos ou autres services fournis par des tiers.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Lorsque ces intégrations entraînent l'utilisation de traceurs soumis au consentement, leur activation est conditionnée à l'accord préalable de l'utilisateur.
                            </p>
                        </div>
                    </section>

                    {/* 4. LISTE DES TRACEURS EFFECTIVEMENT UTILISÉS */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            4. LISTE DES TRACEURS EFFECTIVEMENT UTILISÉS
                        </h2>
                        <p>Gainable met à disposition une liste actualisée des traceurs identifiés sur le site, précisant pour chacun :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>Son nom ;</li>
                            <li>Son fournisseur ;</li>
                            <li>Sa finalité ;</li>
                            <li>Sa catégorie ;</li>
                            <li>Sa durée de conservation ou d'expiration ;</li>
                            <li>Son caractère nécessaire ou facultatif ;</li>
                            <li>Le cas échéant, les destinataires ou transferts associés.</li>
                        </ul>

                        <div className="overflow-x-auto pt-2">
                            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="p-3 border-b border-slate-200">Nom du traceur</th>
                                        <th className="p-3 border-b border-slate-200">Fournisseur</th>
                                        <th className="p-3 border-b border-slate-200">Finalité</th>
                                        <th className="p-3 border-b border-slate-200">Durée</th>
                                        <th className="p-3 border-b border-slate-200">Consentement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-slate-600">
                                    <tr className="bg-white">
                                        <td className="p-3 font-semibold text-slate-900">session_id / token</td>
                                        <td className="p-3">Gainable.fr</td>
                                        <td className="p-3">Maintien de la session utilisateur &amp; sécurité</td>
                                        <td className="p-3">Session</td>
                                        <td className="p-3 font-bold text-slate-500">Non (Strictement nécessaire)</td>
                                    </tr>
                                    <tr className="bg-slate-50/50">
                                        <td className="p-3 font-semibold text-slate-900">cookie_consent</td>
                                        <td className="p-3">Gainable.fr</td>
                                        <td className="p-3">Mémorisation des préférences de cookies</td>
                                        <td className="p-3">6 mois</td>
                                        <td className="p-3 font-bold text-slate-500">Non (Strictement nécessaire)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-slate-500 italic">
                            Ce tableau est complété au fur et à mesure des audits techniques réguliers de Gainable.fr.
                        </p>
                    </section>

                    {/* 5. RECUEIL DU CONSENTEMENT */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            5. RECUEIL DU CONSENTEMENT
                        </h2>
                        <p>
                            Lorsqu'un consentement est nécessaire, Gainable informe l'utilisateur des finalités concernées avant l'activation des traceurs correspondants.
                        </p>
                        <p className="font-semibold text-slate-900">Le dispositif de gestion des cookies permet notamment :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>D'accepter les traceurs facultatifs ;</li>
                            <li>De les refuser ;</li>
                            <li>De personnaliser les choix par finalité ;</li>
                            <li>De consulter les informations complémentaires.</li>
                        </ul>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                            <p className="font-bold text-slate-900">Le refus doit être aussi simple que l'acceptation.</p>
                            <p className="text-slate-600">
                                La poursuite de la navigation, le silence ou la fermeture du bandeau ne constituent pas une acceptation des traceurs soumis au consentement.
                            </p>
                            <p className="text-xs text-rose-800 font-semibold">
                                Aucun traceur non essentiel soumis au consentement n'est activé avant l'expression d'un choix positif de l'utilisateur.
                            </p>
                        </div>
                    </section>

                    {/* 6. GESTION ET PARAMÉTRAGE DU NAVIGATEUR */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Settings className="w-5 h-5 text-[#D59B2B]" />
                            6. PARAMÉTRAGE DE VOTRE NAVIGATEUR
                        </h2>
                        <p>
                            Vous pouvez à tout moment configurer votre logiciel de navigation afin qu'il accepte ou refuse les cookies, globalement ou au cas par cas :
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li><strong>Google Chrome :</strong> Paramètres &gt; Confidentialité et sécurité &gt; Cookies et autres données des sites</li>
                            <li><strong>Mozilla Firefox :</strong> Paramètres &gt; Vie privée et sécurité &gt; Cookies et données de sites</li>
                            <li><strong>Apple Safari :</strong> Préférences &gt; Confidentialité &gt; Bloquer tous les cookies</li>
                            <li><strong>Microsoft Edge :</strong> Paramètres &gt; Cookies et autorisations de site</li>
                        </ul>
                    </section>

                    {/* 7. CONTACT */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            7. CONTACT ET INFORMATIONS
                        </h2>
                        <p>
                            Pour toute question relative à l'utilisation des cookies et traceurs sur Gainable.fr, vous pouvez contacter :
                        </p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-sm space-y-1">
                            <p><strong>EXCEED DIGITAL SAS</strong></p>
                            <p>Email : <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] font-semibold underline">contact@exceeddigital.fr</a></p>
                            <p>Siège social : 13140 Miramas, France</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 mt-4">
                            Consultez également nos <Link href="/mentions-legales" className="text-[#D59B2B] underline">Mentions Légales</Link>, notre <Link href="/politique-confidentialite" className="text-[#D59B2B] underline">Politique de Confidentialité</Link>, nos <Link href="/cgu" className="text-[#D59B2B] underline">CGU</Link> et nos <Link href="/cgv" className="text-[#D59B2B] underline">CGV professionnelles</Link>.
                        </div>
                    </section>

                </div>

            </div>
        </main>
    );
}
