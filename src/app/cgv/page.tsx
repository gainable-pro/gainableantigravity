import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldAlert, CheckCircle2, ArrowLeft, Mail, Building2, Scale } from 'lucide-react';

export const metadata: Metadata = {
    title: "Conditions Générales de Vente Professionnelles (CGV) - Gainable.fr",
    description: "Conditions Générales de Vente professionnelles régissant les abonnements et prestations de visibilité numérique Gainable.fr (EXCEED DIGITAL SAS).",
    alternates: {
        canonical: "https://www.gainable.fr/cgv",
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function ConditionsGeneralesVentePage() {
    return (
        <main className="min-h-screen bg-slate-50/50 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                
                {/* Fil d'Ariane & Bouton Retour */}
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
                        <Link href="/politique-confidentialite" className="hover:underline">Confidentialité</Link>
                    </div>
                </div>

                {/* En-tête Principal */}
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm mb-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-500/20 text-xs font-black uppercase tracking-wider mb-4">
                        <Scale className="w-4 h-4 text-[#D59B2B]" /> Cadre Contractuel Professionnel
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-3 leading-tight">
                        CONDITIONS GÉNÉRALES DE VENTE PROFESSIONNELLES
                    </h1>
                    <p className="text-base md:text-lg font-bold text-[#D59B2B] mb-4">
                        GAINABLE.FR — EXCEED DIGITAL
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                        <span>Version du 8 novembre 2026</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-amber-800 font-bold">Projet soumis à validation juridique</span>
                    </div>
                </div>

                {/* Corps des CGV */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm space-y-12 text-slate-700 leading-relaxed text-sm md:text-base">

                    {/* ARTICLE 1 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Building2 className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 1 — IDENTIFICATION DU PRESTATAIRE
                        </h2>
                        <p>Les présentes Conditions Générales de Vente, ci-après « CGV », sont proposées par :</p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 text-sm space-y-1.5">
                            <p><strong>EXCEED DIGITAL</strong>, société par actions simplifiée (SAS), immatriculée au Registre du commerce et des sociétés de Salon-de-Provence sous le numéro <strong>SIREN 101 447 944</strong>.</p>
                            <p><strong>Siège social :</strong> 13140 Miramas, France.</p>
                            <p><strong>Adresses électroniques :</strong> <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] font-semibold underline">contact@exceeddigital.fr</a> ou <a href="mailto:contact@gainable.fr" className="text-[#D59B2B] font-semibold underline">contact@gainable.fr</a></p>
                        </div>
                        <p>
                            EXCEED DIGITAL exploite la plateforme numérique Gainable.fr, spécialisée dans le référencement professionnel, la visibilité numérique, la publication de contenus et la mise en relation entre particuliers et professionnels.
                        </p>
                        <p className="text-slate-600 italic">
                            Dans les présentes CGV, EXCEED DIGITAL est désignée « Gainable » ou « le Prestataire ».
                        </p>
                    </section>

                    {/* ARTICLE 2 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 2 — OBJET ET CHAMP D'APPLICATION
                        </h2>
                        <p>
                            Les présentes CGV définissent les conditions de commercialisation, de souscription, de paiement, d'exécution, de renouvellement et de résiliation des services professionnels proposés par Gainable.
                        </p>
                        <p>
                            Elles s'appliquent aux entreprises, artisans, travailleurs indépendants, bureaux d'études, diagnostiqueurs et autres professionnels souscrivant un service dans le cadre de leur activité économique.
                        </p>
                        <p>
                            Elles s'appliquent aux offres payantes et, pour les dispositions pertinentes, aux offres professionnelles gratuites, sans préjudice des conditions particulières de ces dernières.
                        </p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                            <p className="font-bold text-slate-800">Le contrat est constitué, par ordre de priorité décroissant :</p>
                            <ol className="list-decimal list-inside space-y-1 pl-2 text-sm text-slate-700">
                                <li>Des conditions particulières ou du bon de commande accepté par les parties ;</li>
                                <li>Du récapitulatif de souscription précisant l'offre, les prix, la durée et les éventuelles remises ;</li>
                                <li>Des présentes CGV ;</li>
                                <li>Des Conditions Générales d'Utilisation de la plateforme, pour les dispositions compatibles avec les présentes CGV.</li>
                            </ol>
                        </div>
                        <p className="text-xs text-slate-500 italic">
                            Toute dérogation nécessite un accord écrit émanant d'un représentant habilité de Gainable.
                        </p>
                    </section>

                    {/* ARTICLE 3 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 3 — DESCRIPTION DES SERVICES
                        </h2>
                        <p>Gainable commercialise des prestations de visibilité et de communication numérique pouvant comprendre, selon l'offre souscrite :</p>
                        <ul className="list-disc list-inside space-y-1.5 pl-2 text-sm">
                            <li>La création et la diffusion d'une fiche professionnelle ;</li>
                            <li>La publication des coordonnées, spécialités et zones d'intervention ;</li>
                            <li>L'accès à un espace professionnel personnel ;</li>
                            <li>La présentation des réalisations, photographies et actualités ;</li>
                            <li>L'accès à un agent d'intelligence artificielle d'assistance rédactionnelle ;</li>
                            <li>La publication d'articles structurés pour le référencement naturel ;</li>
                            <li>L'accès à des outils d'audit SEO et d'analyse concurrentielle, lorsque prévus ;</li>
                            <li>La présence sur des pages locales et, selon l'offre, sur une carte interactive ;</li>
                            <li>La possibilité de recevoir des appels ou des demandes de contact provenant des utilisateurs.</li>
                        </ul>
                        <p>
                            Les prestations effectivement incluses sont celles expressément indiquées dans l'offre acceptée lors de la souscription.
                        </p>
                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 font-medium text-sm">
                            Gainable fournit des services numériques de visibilité et de mise en relation. Elle ne vend pas les coordonnées des particuliers à l'unité et ne prélève aucune commission sur les contrats de travaux conclus.
                        </div>
                    </section>

                    {/* ARTICLE 4 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 4 — INDÉPENDANCE DES PROFESSIONNELS
                        </h2>
                        <p>Les professionnels référencés exercent leur activité en toute indépendance.</p>
                        <p>Gainable ne réalise pas les travaux, diagnostics, études, installations ou prestations proposés par les professionnels.</p>
                        <p>Gainable ne fixe pas les prix des prestations, ne négocie pas les devis, ne les signe pas et n'encaisse pas les paiements relatifs aux travaux.</p>
                        <p>Les relations commerciales, les devis, les commandes et les contrats sont conclus directement entre le professionnel et son client.</p>
                        <p>Le professionnel demeure responsable de ses prestations, obligations légales, assurances, qualifications, garanties et engagements contractuels.</p>
                        <p>Gainable n'est pas partie aux contrats conclus entre le professionnel et ses clients.</p>
                        <p className="text-xs text-slate-500 italic">Cette indépendance ne limite pas les responsabilités propres de Gainable dans la fourniture de ses services numériques.</p>
                    </section>

                    {/* ARTICLE 5 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 5 — INSCRIPTION ET VÉRIFICATION DES PROFESSIONNELS
                        </h2>
                        <p>La souscription est réservée aux professionnels disposant de la capacité juridique nécessaire pour contracter.</p>
                        <p>Le professionnel s'engage à communiquer des informations exactes, complètes et régulièrement mises à jour, notamment concernant :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>Son identité et sa dénomination commerciale ;</li>
                            <li>Son numéro SIREN ou tout identifiant professionnel équivalent ;</li>
                            <li>Ses coordonnées ;</li>
                            <li>Ses activités et zones d'intervention ;</li>
                            <li>Ses qualifications, certifications et assurances lorsqu'elles sont requises ;</li>
                            <li>Les informations nécessaires à la facturation.</li>
                        </ul>
                        <p>Gainable peut demander des justificatifs permettant de vérifier les informations déclarées.</p>
                        <p>
                            Toute présentation trompeuse, usurpation d'identité, utilisation de faux documents ou déclaration de qualification inexistante peut justifier le refus de l'inscription ou la suspension du compte, selon les procédures prévues aux présentes CGV.
                        </p>
                        <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            Les badges de vérification éventuellement affichés correspondent exclusivement aux vérifications déclaratives effectivement réalisées par Gainable et ne constituent pas une garantie générale de qualité des travaux.
                        </p>
                    </section>

                    {/* ARTICLE 6 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 6 — FORMATION DU CONTRAT ET ACTIVATION
                        </h2>
                        <p>
                            Le contrat est conclu après présentation des informations essentielles de l'offre, acceptation des CGV et validation de la souscription par le professionnel, sous réserve de l'acceptation de la commande par Gainable.
                        </p>
                        <p>
                            Le professionnel reçoit une confirmation de sa commande sur un support durable, précisant notamment la formule choisie, la durée d'engagement, le prix et les modalités de paiement.
                        </p>
                        <p>
                            Gainable peut activer les fonctionnalités du service dès la confirmation de la souscription, sous réserve des vérifications nécessaires.
                        </p>
                        <p className="text-xs text-slate-500 italic">
                            L'activation anticipée pendant le délai de rétractation commerciale fait l'objet d'une demande expresse distincte, conformément à l'article 11.
                        </p>
                    </section>

                    {/* ARTICLE 7 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 7 — DURÉE D'ENGAGEMENT
                        </h2>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                            <p className="font-bold text-slate-900">
                                Les abonnements professionnels payants sont conclus pour une durée ferme de douze (12) mois.
                            </p>
                            <p className="text-sm">Cette durée s'applique quelle que soit la modalité de paiement choisie :</p>
                            <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                                <li>Paiement annuel en une seule fois ;</li>
                                <li>Paiement mensuel en douze échéances.</li>
                            </ul>
                            <p className="text-sm font-semibold text-amber-900 pt-2 border-t border-slate-200">
                                Le paiement mensuel constitue une modalité d'échelonnement du prix annuel et non un abonnement sans engagement.
                            </p>
                        </div>
                        <p>Le contrat prend effet à la date d'activation contractuelle indiquée dans la confirmation de souscription.</p>
                        <p className="text-xs text-slate-500 italic">
                            Toute résiliation anticipée demeure soumise aux dispositions légales applicables et aux cas expressément prévus par les présentes CGV.
                        </p>
                    </section>

                    {/* ARTICLE 8 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 8 — TARIFS ET MODALITÉS DE PAIEMENT
                        </h2>
                        <p>Les prix sont exprimés en euros hors taxes, sauf mention contraire.</p>
                        <p>Les tarifs applicables sont ceux figurant dans le récapitulatif de commande accepté par le professionnel.</p>
                        <p>Les abonnements peuvent être réglés en une seule échéance annuelle ou en douze échéances mensuelles, selon l'offre sélectionnée.</p>
                        <p>Le coût total de l'engagement de douze mois est communiqué avant la validation de la commande.</p>
                        <p>Les échéances mensuelles sont dues aux dates prévues dans le récapitulatif contractuel.</p>
                        <p>Le professionnel autorise les paiements récurrents correspondant aux échéances contractuellement convenues et s'engage à maintenir un moyen de paiement valide.</p>
                        <p>Les factures sont mises à disposition sur un support durable ou dans l'espace professionnel, dans des conditions permettant leur conservation.</p>
                        <p className="font-medium text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-sm">
                            Aucun paiement supplémentaire n'est dû à Gainable du seul fait de la réception d'un appel, d'une demande de contact, d'un devis ou de la conclusion d'un chantier.
                        </p>
                    </section>

                    {/* ARTICLE 9 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 9 — GARANTIE DU TARIF DE SOUSCRIPTION
                        </h2>
                        <p>Le professionnel bénéficie d'un tarif de souscription garanti, expressément indiqué dans son récapitulatif contractuel.</p>
                        <p>Sous réserve du maintien ininterrompu de son abonnement, ce tarif est conservé lors des renouvellements successifs, indépendamment des augmentations ultérieures des tarifs publics.</p>
                        <p>Cette garantie porte sur le tarif contractuel de référence, hors remises commerciales temporaires.</p>
                        <p>Elle n'interdit pas à Gainable de créer de nouvelles offres, de proposer des tarifs différents aux nouveaux clients ou de modifier sa gamme commerciale.</p>
                        <p>En cas de cessation effective de l'abonnement, la garantie tarifaire prend fin. Toute nouvelle souscription est soumise aux conditions tarifaires alors applicables, sauf accord écrit contraire.</p>
                        <p className="text-xs text-slate-500 italic">Les conséquences d'une modification substantielle des prestations contractuellement promises demeurent régies par l'article 22.</p>
                    </section>

                    {/* ARTICLE 10 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 10 — REMISES COMMERCIALES
                        </h2>
                        <p>Gainable peut accorder des remises commerciales exceptionnelles lors de la souscription.</p>
                        <p>Sauf accord écrit contraire, ces remises s'appliquent exclusivement à la première période contractuelle de douze mois. Elles ne sont pas reconduites automatiquement.</p>
                        <p>Le professionnel est informé avant la souscription du tarif initial, du montant de la remise, de sa durée et du tarif applicable lors du premier renouvellement.</p>
                        <p>À l'expiration de la période promotionnelle, le tarif contractuel garanti hors remise temporaire devient applicable.</p>
                        <p className="text-xs text-slate-500 italic">Les remises ne sont cumulables que lorsque les conditions de l'offre le prévoient expressément.</p>
                    </section>

                    {/* ARTICLE 11 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 11 — RÉTRACTATION COMMERCIALE DE QUATORZE JOURS
                        </h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h3 className="font-bold text-slate-900">11.1 — Droit volontaire</h3>
                                <p>Gainable accorde volontairement à tous ses abonnés professionnels un délai de rétractation commerciale de quatorze (14) jours calendaires à compter du lendemain de la conclusion du contrat. Ce droit s'ajoute aux éventuels droits légaux de rétractation, sans les limiter.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">11.2 — Modalités d'exercice</h3>
                                <p>Le professionnel peut exercer ce droit par une déclaration claire et non équivoque, adressée à <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] underline">contact@exceeddigital.fr</a> ou par tout autre moyen de rétractation prévu dans son espace professionnel. La notification doit être envoyée avant l'expiration du délai.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">11.3 — Démarrage immédiat</h3>
                                <p>Le professionnel peut demander expressément l'exécution immédiate des prestations avant l'expiration du délai de rétractation. Cette demande est recueillie séparément de l'acceptation des CGV et fait l'objet d'une preuve conservée par Gainable.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">11.4 — Remboursement</h3>
                                <p>Lorsque le service n'a pas commencé, les sommes versées sont intégralement remboursées.</p>
                                <p className="mt-1">Lorsque l'exécution immédiate a été expressément demandée, Gainable peut retenir, dans les limites légalement permises et conformément aux conditions acceptées avant la commande, une somme proportionnée aux prestations effectivement fournies jusqu'à la notification de la rétractation.</p>
                                <p className="mt-1">La méthode de calcul applicable au droit commercial volontaire est détaillée dans le récapitulatif de souscription ou ses conditions particulières. Aucune pénalité forfaitaire de rétractation n'est appliquée.</p>
                                <p className="mt-1 font-medium text-slate-800">La simple génération d'un article par l'agent IA n'entraîne pas automatiquement la perte intégrale du droit au remboursement.</p>
                                <p className="mt-1">Le remboursement du solde intervient dans un délai maximal de quatorze jours après réception de la demande, sauf règle impérative différente.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">11.5 — Conséquences</h3>
                                <p>La rétractation valable met fin au contrat et aux échéances futures. La fiche et les contenus sont mis hors ligne. Le traitement des données et contenus est effectué conformément aux articles relatifs à la conservation et à la suppression.</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">11.6 — Droits légaux</h3>
                                <p>Lorsque le professionnel bénéficie d'un droit légal de rétractation, notamment dans certaines hypothèses de contrats conclus hors établissement, les dispositions légales impératives prévalent sur les règles commerciales ci-dessus.</p>
                            </div>
                        </div>
                    </section>

                    {/* ARTICLE 12 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 12 — RECONDUCTION AUTOMATIQUE
                        </h2>
                        <p>À l'expiration de chaque période de douze mois, l'abonnement est automatiquement reconduit pour une nouvelle période de douze mois, sauf résiliation régulièrement notifiée.</p>
                        <p>Le professionnel peut demander le non-renouvellement au plus tard un mois avant l'échéance contractuelle, sous réserve des dispositions légales impératives plus favorables.</p>
                        <p>Gainable communique les informations relatives à la reconduction et à la résiliation dans les conditions requises par la réglementation applicable.</p>
                        <p>La reconduction s'effectue au tarif de souscription garanti, hors remises commerciales temporaires expirées.</p>
                        <p className="text-xs text-slate-500 italic">Le professionnel peut consulter, lorsque la fonctionnalité est disponible, la date de sa prochaine échéance dans son espace personnel.</p>
                    </section>

                    {/* ARTICLE 13 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 13 — RÉSILIATION ORDINAIRE
                        </h2>
                        <p>Le professionnel peut notifier sa décision de ne pas renouveler son abonnement depuis son espace professionnel ou par courrier électronique à l'adresse contractuelle de Gainable.</p>
                        <p>Gainable accuse réception de la demande sur un support durable.</p>
                        <p>La résiliation ordinaire prend effet à l'échéance de la période contractuelle en cours, sous réserve des droits légaux applicables.</p>
                        <p>Le professionnel conserve jusqu'à cette échéance l'accès aux prestations prévues par son abonnement, sauf suspension justifiée ou accord particulier.</p>
                        <p>Le non-renouvellement n'entraîne pas automatiquement le remboursement des sommes correspondant à la période contractuelle déjà engagée.</p>
                        <p className="font-semibold text-rose-800 bg-rose-50 p-4 rounded-xl border border-rose-200 text-sm">
                            La suppression d'un compte ou d'un moyen de paiement ne constitue pas, à elle seule, une résiliation régulière du contrat.
                        </p>
                    </section>

                    {/* ARTICLE 14 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 14 — RETARDS ET DÉFAUTS DE PAIEMENT
                        </h2>
                        <p>Toute somme exigible non réglée à son échéance constitue un retard de paiement.</p>
                        <p>Entre professionnels, les pénalités de retard sont calculées au taux de refinancement de la Banque centrale européenne majoré de dix points de pourcentage, sauf taux contractuel différent légalement autorisé.</p>
                        <p>L'indemnité forfaitaire légale pour frais de recouvrement de quarante (40) euros est due lorsque les conditions légales sont réunies, sans préjudice de l'indemnisation complémentaire justifiée prévue par la loi.</p>
                        <p>En cas d'impayé, Gainable peut adresser une notification demandant la régularisation de la situation.</p>
                        <p>À défaut de régularisation dans un délai de quinze (15) jours calendaires suivant une mise en demeure restée sans effet, Gainable peut suspendre l'accès aux fonctionnalités payantes, sans préjudice des autres recours contractuels ou légaux.</p>
                        <p>En cas de manquement grave ou persistant, Gainable peut prononcer la résiliation du contrat dans les conditions prévues à l'article 15.</p>
                        <p className="text-xs text-slate-500 italic">Les sommes exigibles demeurent dues, sous réserve des contestations fondées et des dispositions légales applicables.</p>
                    </section>

                    {/* ARTICLE 15 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 15 — SUSPENSION ET RÉSILIATION POUR MANQUEMENT
                        </h2>
                        <p>Gainable peut suspendre un compte professionnel en cas de motif légitime, notamment :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>Informations professionnelles manifestement frauduleuses ;</li>
                            <li>Usurpation d'identité ;</li>
                            <li>Publications illicites ou trompeuses ;</li>
                            <li>Utilisation abusive de la plateforme ;</li>
                            <li>Atteinte à la sécurité des systèmes ;</li>
                            <li>Non-paiement persistant ;</li>
                            <li>Violation grave des obligations contractuelles.</li>
                        </ul>
                        <p>Sauf urgence, fraude grave, obligation légale ou risque immédiat, le professionnel est informé des motifs de la mesure et dispose d'un délai raisonnable pour présenter ses observations ou régulariser la situation.</p>
                        <p>La suspension est proportionnée à la gravité des faits constatés.</p>
                        <p>La résiliation pour manquement est prononcée dans le respect des procédures contractuelles et légales applicables.</p>
                        <p className="text-xs text-slate-500 italic">Les droits de contestation et de recours du professionnel sont préservés.</p>
                    </section>

                    {/* ARTICLE 16 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 16 — ESPACE PROFESSIONNEL ET SÉCURITÉ
                        </h2>
                        <p>Le professionnel dispose d'un accès personnel à son espace Gainable.</p>
                        <p>Il s'engage à préserver la confidentialité de ses identifiants, à ne pas permettre d'utilisation non autorisée de son compte et à signaler rapidement toute suspicion d'accès frauduleux.</p>
                        <p>Le professionnel demeure responsable des opérations effectuées sous son compte lorsqu'elles lui sont imputables.</p>
                        <p className="text-xs text-slate-500 italic">Gainable met en œuvre des mesures techniques et organisationnelles adaptées pour protéger ses services, sans garantir une absence absolue d'incident de sécurité.</p>
                    </section>

                    {/* ARTICLE 17 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 17 — AGENT D'INTELLIGENCE ARTIFICIELLE
                        </h2>
                        <p>Chaque abonnement incluant cette fonctionnalité permet au professionnel d'utiliser un agent IA destiné à faciliter la création de contenus rédactionnels.</p>
                        <p>L'outil peut notamment générer des textes, proposer une structure éditoriale, organiser les titres et sous-titres H1, H2 et suivants, et contribuer à la préparation d'articles orientés vers le référencement naturel.</p>
                        <p>Le professionnel renseigne les informations nécessaires, notamment les slugs, les noms des photographies et les éléments décrivant ses activités ou réalisations.</p>
                        <p>Les résultats de l'IA peuvent contenir des erreurs, omissions, approximations ou formulations inadaptées.</p>
                        <p className="font-semibold text-slate-900">
                            Le professionnel doit vérifier les informations relatives à ses activités, qualifications, prestations et réalisations et utiliser les mécanismes de correction mis à sa disposition.
                        </p>
                        <p>Gainable demeure responsable de ses propres obligations en qualité de fournisseur de l'outil et ne peut exclure les responsabilités qui lui incombent légalement.</p>
                        <p className="text-xs text-slate-500 italic">L'utilisation de l'IA ne garantit aucun résultat commercial ni aucun positionnement dans les moteurs de recherche.</p>
                    </section>

                    {/* ARTICLE 18 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 18 — QUOTA MENSUEL DE PUBLICATION
                        </h2>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                            <p className="font-bold text-slate-900 text-base">
                                Chaque abonnement comprenant l'agent IA permet la création et la publication de dix (10) articles au maximum par période mensuelle.
                            </p>
                            <p>Le quota est renouvelé à chaque période mensuelle d'abonnement.</p>
                            <p className="text-rose-800 font-semibold">Les articles non utilisés ne sont ni cumulables, ni reportables sur une période ultérieure.</p>
                            <p>Le quota non consommé ne donne droit à aucun remboursement, avoir ou compensation, sous réserve des cas de mauvaise exécution imputables à Gainable et des droits légaux applicables.</p>
                            <p>Gainable n'est pas tenue de produire elle-même dix articles chaque mois pour le professionnel.</p>
                        </div>
                        <p className="text-xs text-slate-500 italic">
                            Les modalités techniques de décompte des articles, notamment en cas de brouillon, de modification ou d'échec de publication, sont précisées dans la documentation du service et doivent être appliquées de manière transparente.
                        </p>
                    </section>

                    {/* ARTICLE 19 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 19 — CONTENUS, PHOTOGRAPHIES ET DROITS D'UTILISATION
                        </h2>
                        <p>Le professionnel garantit disposer des droits et autorisations nécessaires sur les photographies, marques, logos, textes et informations qu'il transmet.</p>
                        <p>Il s'interdit de publier des contenus illicites, diffamatoires, trompeurs, contrefaisants ou portant atteinte aux droits de tiers.</p>
                        <p>Le professionnel conserve les droits qu'il détient sur ses contenus.</p>
                        <p>
                            Il accorde à Gainable, pour la durée nécessaire à l'exécution du contrat et aux opérations d'archivage autorisées, une licence non exclusive permettant l'hébergement, la reproduction technique, l'adaptation de format, l'affichage et la diffusion des contenus sur la plateforme et ses supports associés.
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                            Cette licence n'autorise pas Gainable à commercialiser séparément les photographies ou réalisations du professionnel sans autorisation spécifique.
                        </p>
                        <p>Les droits sur les contenus générés par intelligence artificielle sont appréciés selon la réglementation applicable et les droits éventuels des tiers.</p>
                        <p className="text-xs text-slate-500 italic">Gainable peut retirer les contenus illicites ou manifestement non conformes, selon une procédure proportionnée.</p>
                    </section>

                    {/* ARTICLE 20 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 20 — RÉFÉRENCEMENT ET CLASSEMENT DES PROFESSIONNELS
                        </h2>
                        <p>Le référencement dans l'annuaire Gainable repose sur des critères de pertinence, notamment :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>La localisation géographique ;</li>
                            <li>Les zones d'intervention déclarées ;</li>
                            <li>Les technologies et spécialités professionnelles ;</li>
                            <li>La correspondance entre les critères de recherche et les informations des fiches.</li>
                        </ul>
                        <p>Les modalités de présentation particulières prévues par certaines offres, telles que les badges, cartes ou fiches enrichies, sont décrites dans les conditions commerciales applicables.</p>
                        <p>Gainable ne garantit pas une position permanente ou déterminée dans l'annuaire.</p>
                        <p>Les critères de classement et leur importance relative sont communiqués conformément aux obligations de transparence applicables.</p>
                        <p className="text-xs text-slate-500 italic">Toute évolution significative des paramètres de classement fait l'objet d'une information appropriée.</p>
                    </section>

                    {/* ARTICLE 21 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 21 — RÉFÉRENCEMENT NATUREL ET ABSENCE DE GARANTIE SEO
                        </h2>
                        <p>Gainable propose des outils et fonctionnalités destinés à contribuer à la présence numérique des professionnels.</p>
                        <p>Ces services peuvent notamment comprendre des pages professionnelles, des articles structurés, des liens vers les sites des professionnels et des outils d'analyse SEO.</p>
                        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 font-medium text-sm space-y-2">
                            <p className="font-bold">Gainable ne contrôle pas les algorithmes des moteurs de recherche tiers.</p>
                            <p>En conséquence, Gainable ne garantit aucun positionnement, aucune indexation systématique, aucun volume de trafic ni aucune amélioration déterminée du référencement naturel.</p>
                            <p className="text-xs text-amber-900">Les résultats dépendent de facteurs multiples, notamment de la qualité des contenus, de la concurrence, des évolutions algorithmiques et de la présence numérique globale du professionnel.</p>
                        </div>
                        <p className="text-xs text-slate-500 italic">Cette absence de garantie de performance ne dispense pas Gainable de fournir les fonctionnalités expressément promises dans l'abonnement.</p>
                    </section>

                    {/* ARTICLE 22 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 22 — ÉVOLUTION DES SERVICES
                        </h2>
                        <p>Gainable peut procéder à des mises à jour techniques, corrections de sécurité et améliorations fonctionnelles nécessaires au fonctionnement de la plateforme.</p>
                        <p>Elle peut également développer de nouvelles offres ou fonctionnalités.</p>
                        <p>Ces évolutions ne permettent pas de supprimer arbitrairement une prestation essentielle contractuellement promise.</p>
                        <p>En cas de modification substantielle défavorable des services souscrits, Gainable informe préalablement le professionnel, expose la nature des changements et respecte les droits contractuels et légaux applicables, notamment les possibilités de contestation ou de résiliation lorsqu'elles sont requises.</p>
                        <p className="text-xs text-slate-500 italic">Les nouvelles formules commerciales ne s'appliquent pas automatiquement aux abonnements existants.</p>
                    </section>

                    {/* ARTICLE 23 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 23 — MISE EN RELATION ET ABSENCE DE GARANTIE COMMERCIALE
                        </h2>
                        <p>Les particuliers peuvent rechercher librement un professionnel, consulter ses coordonnées, l'appeler ou lui adresser une demande de contact.</p>
                        <p>Le choix du professionnel appartient au particulier.</p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2 text-sm">
                            <p className="font-bold text-slate-900">Gainable ne garantit aucun nombre minimal de contacts, appels, demandes de devis, contrats, chantiers ou chiffre d'affaires.</p>
                            <p>L'expression « contacts illimités », lorsqu'elle est utilisée dans la présentation commerciale, signifie qu'aucun plafond contractuel de réception des sollicitations n'est fixé, et non qu'un volume déterminé de demandes est garanti.</p>
                            <p className="text-slate-600">Gainable ne garantit ni la solvabilité des particuliers, ni leur volonté effective de conclure un contrat, ni l'exactitude de toutes les informations communiquées dans leurs demandes.</p>
                        </div>
                    </section>

                    {/* ARTICLE 24 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 24 — RECHERCHE COMPLÉMENTAIRE DE PROFESSIONNELS
                        </h2>
                        <p>Lorsqu'un particulier adresse une demande générale à Gainable et qu'aucun professionnel adapté ne semble disponible dans la zone concernée, Gainable peut entreprendre une recherche complémentaire d'entreprises susceptibles de répondre au projet.</p>
                        <p>Cette recherche peut porter sur des professionnels non encore référencés.</p>
                        <p>Gainable peut prendre contact avec ces entreprises afin de vérifier leur intérêt et leur capacité déclarée à répondre à la demande.</p>
                        <p>Le particulier demeure libre d'accepter ou de refuser les professionnels proposés.</p>
                        <p>Gainable ne négocie pas les devis et ne choisit pas contractuellement le prestataire à la place du particulier.</p>
                        <p>La communication des données personnelles du particulier intervient conformément aux informations qui lui ont été fournies et à la réglementation applicable.</p>
                        <p className="text-xs text-slate-500 italic">Cette recherche complémentaire constitue une obligation de moyens et ne garantit pas qu'un professionnel sera trouvé ou qu'un contrat sera conclu.</p>
                    </section>

                    {/* ARTICLE 25 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 25 — MISE HORS LIGNE APRÈS EXPIRATION
                        </h2>
                        <p>À l'expiration effective d'un abonnement non renouvelé, la fiche professionnelle et les articles associés sont mis hors ligne.</p>
                        <p>Les pages désactivées ne sont plus proposées à la consultation publique sur Gainable.</p>
                        <p>Les liens de redirection vers le site Internet ou les autres pages du professionnel cessent d'être accessibles depuis les contenus désactivés.</p>
                        <p className="text-xs text-slate-500 italic">La mise hors ligne n'entraîne pas nécessairement une disparition immédiate des résultats des moteurs de recherche tiers, dont les délais de mise à jour échappent au contrôle de Gainable.</p>
                    </section>

                    {/* ARTICLE 26 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 26 — ARCHIVAGE DES CONTENUS PENDANT TROIS ANS
                        </h2>
                        <p>Après l'expiration effective de l'abonnement, Gainable conserve les articles et contenus professionnels archivables pendant une durée maximale de trois (3) ans, afin de faciliter leur éventuelle réactivation.</p>
                        <p>Durant cette période, les contenus sont conservés hors ligne et ne sont plus accessibles au public.</p>
                        <p>La conservation des données personnelles associées demeure soumise aux principes de nécessité, de proportionnalité et de limitation de durée prévus par la réglementation applicable.</p>
                        <p>En cas de nouvelle souscription avant l'expiration du délai d'archivage, le professionnel peut demander la réactivation des contenus conservés, sous réserve de leur disponibilité et de leur conformité.</p>
                        <p>Cette réactivation ne garantit pas la récupération de leur référencement antérieur.</p>
                        <p className="text-xs text-slate-500 italic">À l'issue du délai de trois ans, les contenus archivés sont supprimés selon les procédures techniques applicables, sous réserve des obligations légales de conservation et des cycles de sauvegarde.</p>
                    </section>

                    {/* ARTICLE 27 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 27 — SUPPRESSION DU COMPTE
                        </h2>
                        <p>Le professionnel peut demander la suppression de son compte et des contenus qui lui sont associés.</p>
                        <p>Cette demande est distincte de la résiliation de l'abonnement.</p>
                        <p>Gainable examine la demande, vérifie l'identité ou l'habilitation de son auteur et procède aux opérations de suppression légalement requises.</p>
                        <p>Certaines données peuvent être conservées lorsque la loi l'impose ou lorsqu'un motif légitime reconnu par la réglementation le justifie, notamment en matière comptable ou contentieuse.</p>
                        <p className="font-semibold text-rose-800 bg-rose-50 p-4 rounded-xl border border-rose-200 text-sm">
                            La suppression du compte ne met pas automatiquement fin aux obligations de paiement contractuellement exigibles. Lorsque le professionnel souhaite également mettre fin à son abonnement, les règles de résiliation applicables lui sont communiquées.
                        </p>
                    </section>

                    {/* ARTICLE 28 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 28 — DISPONIBILITÉ ET MAINTENANCE
                        </h2>
                        <p>Gainable met en œuvre des moyens raisonnables pour assurer la disponibilité et le fonctionnement de ses services.</p>
                        <p>Des interruptions peuvent survenir notamment pour des opérations de maintenance, des mises à jour, des incidents techniques ou des circonstances indépendantes de sa volonté.</p>
                        <p>Les opérations de maintenance planifiées sont, dans la mesure du possible, organisées afin de limiter leurs conséquences.</p>
                        <p>En cas d'indisponibilité significative imputable à Gainable, les parties recherchent une solution proportionnée à la nature et à la durée du dysfonctionnement.</p>
                        <p className="text-xs text-slate-500 italic">Aucune disposition du présent article ne prive le professionnel des recours prévus par la loi en cas de mauvaise exécution contractuelle.</p>
                    </section>

                    {/* ARTICLE 29 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 29 — RESPONSABILITÉS
                        </h2>
                        <p>Chaque partie répond des manquements qui lui sont imputables conformément au droit applicable.</p>
                        <p>Le professionnel demeure responsable de l'exactitude de ses déclarations, de ses obligations professionnelles, de ses devis, de ses prestations et des contrats qu'il conclut directement avec ses clients.</p>
                        <p>Gainable demeure responsable de la fourniture de ses propres prestations numériques conformément au contrat.</p>
                        <p>Gainable n'est pas responsable du seul fait qu'un particulier refuse un devis, qu'un chantier ne soit pas conclu ou qu'un moteur de recherche modifie son algorithme.</p>
                        <p>Les parties s'engagent à signaler dans un délai raisonnable tout incident susceptible d'aggraver un préjudice et à prendre les mesures appropriées pour en limiter les conséquences.</p>
                        <p className="text-xs text-slate-500 italic">Aucune limitation contractuelle ne s'applique aux responsabilités dont l'exclusion ou la limitation est interdite par la loi, notamment en cas de dol ou de faute lourde.</p>
                    </section>

                    {/* ARTICLE 30 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 30 — PROTECTION DE LA PLATEFORME
                        </h2>
                        <p>Les bases de données, éléments graphiques, logiciels, signes distinctifs et contenus propres à Gainable sont protégés dans les conditions prévues par les droits de propriété intellectuelle applicables.</p>
                        <p>Sont notamment interdits, sauf autorisation ou exception légale :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2 text-sm">
                            <li>L'extraction ou la réutilisation illicite de parties protégées des bases de données ;</li>
                            <li>L'accès frauduleux aux systèmes ;</li>
                            <li>Le contournement des dispositifs de sécurité ;</li>
                            <li>L'utilisation de robots ou scripts provoquant une charge abusive ;</li>
                            <li>La reproduction non autorisée de contenus protégés ;</li>
                            <li>L'utilisation de la plateforme à des fins frauduleuses.</li>
                        </ul>
                        <p>Gainable peut engager les actions nécessaires pour faire cesser ces pratiques et demander réparation des préjudices démontrés.</p>
                        <p className="text-xs text-slate-500 italic">Toute indemnité contractuelle forfaitaire supplémentaire devra faire l'objet d'une stipulation spécifique, précise et juridiquement proportionnée.</p>
                    </section>

                    {/* ARTICLE 31 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 31 — DONNÉES PERSONNELLES ET CONFIDENTIALITÉ
                        </h2>
                        <p>Les traitements de données personnelles réalisés dans le cadre des services Gainable sont décrits dans la politique de confidentialité de la plateforme.</p>
                        <p>Les professionnels s'engagent à utiliser les coordonnées reçues uniquement pour les finalités légitimes et annoncées aux personnes concernées.</p>
                        <p>Ils s'interdisent de revendre les données personnelles des particuliers ou de les utiliser à des fins incompatibles avec la demande initiale, sauf base légale appropriée.</p>
                        <p>Les rôles respectifs de Gainable et des professionnels en matière de protection des données sont déterminés selon les traitements effectivement réalisés.</p>
                        <p className="text-xs text-slate-500 italic">Les données de contact, les contenus professionnels, les informations de facturation et les données des particuliers peuvent relever de durées de conservation différentes.</p>
                    </section>

                    {/* ARTICLE 32 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 32 — FORCE MAJEURE
                        </h2>
                        <p>Aucune partie ne peut être tenue responsable d'un manquement résultant d'un événement présentant les caractéristiques de la force majeure au sens de l'article 1218 du Code civil.</p>
                        <p>La partie concernée informe l'autre partie dans les meilleurs délais raisonnablement possibles.</p>
                        <p className="text-xs text-slate-500 italic">Les conséquences de l'empêchement temporaire ou définitif sont régies par les dispositions légales applicables.</p>
                    </section>

                    {/* ARTICLE 33 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 33 — RÉCLAMATIONS ET RÈGLEMENT AMIABLE
                        </h2>
                        <p>Toute réclamation relative à un abonnement, à une facture ou à une prestation peut être adressée à <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] underline font-semibold">contact@exceeddigital.fr</a>.</p>
                        <p>Les parties s'efforcent de rechercher une solution amiable avant toute procédure judiciaire, sans que cette démarche prive l'une d'elles de son droit de saisir une juridiction compétente ou de prendre une mesure urgente.</p>
                        <p className="text-xs text-slate-500 italic">Les procédures de réclamation et de contestation des décisions de suspension sont mises à disposition des professionnels dans les conditions légalement applicables.</p>
                    </section>

                    {/* ARTICLE 34 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 34 — DROIT APPLICABLE ET JURIDICTION
                        </h2>
                        <p>Les présentes CGV sont régies par le droit français, sous réserve des dispositions impératives éventuellement applicables.</p>
                        <p>
                            Pour les litiges entre parties ayant toutes contracté en qualité de commerçants, une clause attributive de compétence territoriale pourra désigner les juridictions compétentes du ressort de Salon-de-Provence, sous réserve du respect des conditions de validité prévues notamment par l'article 48 du Code de procédure civile.
                        </p>
                        <p className="text-xs text-slate-500 italic">Dans les autres situations, les règles légales de compétence s'appliquent.</p>
                    </section>

                    {/* ARTICLE 35 */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            ARTICLE 35 — DISPOSITIONS FINALES
                        </h2>
                        <p>Si une stipulation des présentes CGV est déclarée nulle ou inapplicable, les autres dispositions demeurent applicables dans la mesure où l'équilibre général du contrat peut être préservé.</p>
                        <p>Le fait pour une partie de ne pas se prévaloir immédiatement d'un droit ne constitue pas une renonciation définitive à celui-ci.</p>
                        <p>La version des CGV acceptée lors de la souscription est conservée afin de pouvoir établir les engagements contractuels applicables.</p>
                        <p className="text-xs text-slate-500 italic">Les modifications ultérieures sont mises en œuvre dans les conditions prévues par les présentes CGV et par la réglementation applicable.</p>
                    </section>

                    {/* FOOTER NOTICE DE VALIDATION */}
                    <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
                        <p className="font-bold text-slate-700">FIN DU PROJET DE CONDITIONS GÉNÉRALES DE VENTE PROFESSIONNELLES — GAINABLE.FR</p>
                        <p className="italic">Document de travail destiné à validation juridique avant mise en production.</p>
                    </div>

                </div>

            </div>
        </main>
    );
}

