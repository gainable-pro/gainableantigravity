import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "FAQ Visibilité & Référencement | Gainable.fr",
    description: "Tout comprendre sur le fonctionnement de la visibilité et du référencement des professionnels sur Gainable.fr.",
    alternates: {
        canonical: "https://www.gainable.fr/faq-visibilite-referencement",
    },
};

export default function FAQVisibilityPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-[#1F2D3D] py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-6 text-[#D59B2B]">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#1F2D3D] mb-4">
                        FAQ – Visibilité & Référencement
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Cette page a pour objectif d’expliquer de manière claire et transparente comment fonctionne la visibilité des professionnels sur Gainable.fr.
                    </p>
                </div>

                <div className="space-y-8">

                    {/* Q1 */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-[#D59B2B]">Q.</span>
                            Gainable.fr garantit-il des clients ou des chantiers ?
                        </h2>
                        <div className="pl-8">
                            <p className="font-bold text-[#1F2D3D] mb-2">Non.</p>
                            <p className="text-slate-600 mb-4">
                                Gainable.fr ne garantit pas de clients, de contacts ou de chiffre d’affaires.<br />
                                Nous garantissons un cadre de visibilité clair, équitable et durable, destiné à valoriser les professionnels sérieux.
                            </p>
                        </div>
                    </section>

                    {/* Q2 */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-[#D59B2B]">Q.</span>
                            Quelle visibilité ai-je en tant que professionnel référencé ?
                        </h2>
                        <div className="pl-8">
                            <p className="text-slate-600 mb-4">Chaque professionnel dispose :</p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex gap-2 items-center text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> d’une page entreprise dédiée</li>
                                <li className="flex gap-2 items-center text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> indexée par les moteurs de recherche</li>
                                <li className="flex gap-2 items-center text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> intégrée dans l’écosystème Gainable.fr</li>
                                <li className="flex gap-2 items-center text-slate-700"><CheckCircle2 className="w-4 h-4 text-green-500" /> accessible aux particuliers et aux professionnels</li>
                            </ul>
                            <p className="text-slate-600 italic">Cette visibilité est réelle, mesurable et non diluée.</p>
                        </div>
                    </section>

                    {/* Q3 */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-[#D59B2B]">Q.</span>
                            En quoi la visibilité Gainable.fr est différente des plateformes de leads ?
                        </h2>
                        <div className="pl-8">
                            <p className="text-slate-600 mb-4">Contrairement aux plateformes de revente de contacts :</p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex gap-2 items-center text-slate-700"><XCircle className="w-4 h-4 text-red-400" /> vos coordonnées ne sont jamais revendues</li>
                                <li className="flex gap-2 items-center text-slate-700"><XCircle className="w-4 h-4 text-red-400" /> votre visibilité n’est pas partagée entre plusieurs entreprises</li>
                                <li className="flex gap-2 items-center text-slate-700"><XCircle className="w-4 h-4 text-red-400" /> vous n’êtes pas mis en concurrence artificielle sur le prix</li>
                            </ul>
                            <div className="bg-emerald-50 text-emerald-800 px-4 py-2 rounded-lg inline-block font-medium text-sm">
                                👉 Le client vous contacte directement, en connaissance de cause.
                            </div>
                        </div>
                    </section>

                    {/* Q4 */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-[#D59B2B]">Q.</span>
                            La visibilité dépend-elle du prix payé ?
                        </h2>
                        <div className="pl-8">
                            <p className="font-bold text-[#1F2D3D] mb-2">Non.</p>
                            <p className="text-slate-600 mb-4">
                                Sur Gainable.fr, la visibilité ne s’achète pas. Elle repose sur :
                            </p>
                            <ul className="grid sm:grid-cols-2 gap-2 mb-4">
                                <li className="bg-slate-50 px-3 py-2 rounded border border-slate-100 text-sm">La conformité administrative</li>
                                <li className="bg-slate-50 px-3 py-2 rounded border border-slate-100 text-sm">Le sérieux professionnel</li>
                                <li className="bg-slate-50 px-3 py-2 rounded border border-slate-100 text-sm">Le respect des critères</li>
                                <li className="bg-slate-50 px-3 py-2 rounded border border-slate-100 text-sm">L’implication du pro</li>
                            </ul>
                            <p className="text-slate-600 font-medium">👉 Le budget ne détermine pas la mise en avant.</p>
                        </div>
                    </section>

                    {/* Q5 */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-[#D59B2B]">Q.</span>
                            Combien de professionnels sont référencés par zone ?
                        </h2>
                        <div className="pl-8">
                            <p className="text-slate-600 mb-4">Le nombre de professionnels par zone est volontairement limité.</p>
                            <p className="text-slate-600 mb-2">Cela permet :</p>
                            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4 pl-2">
                                <li>d’éviter la saturation</li>
                                <li>de garantir une visibilité réelle à chaque expert</li>
                                <li>de préserver la qualité globale de la plateforme</li>
                            </ul>
                            <p className="text-slate-600 font-medium">👉 Moins de profils, plus de visibilité pour chacun.</p>
                        </div>
                    </section>

                    {/* Q6 */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 flex items-start gap-3">
                            <span className="text-[#D59B2B]">Q.</span>
                            Ma fiche Gainable.fr améliore-t-elle mon référencement Google ?
                        </h2>
                        <div className="pl-8">
                            <p className="font-bold text-[#1F2D3D] mb-2">Oui.</p>
                            <p className="text-slate-600 mb-4">Votre page entreprise :</p>
                            <ul className="list-disc list-inside text-slate-600 space-y-1 mb-4 pl-2">
                                <li>est indexable par Google</li>
                                <li>bénéficie du maillage interne de Gainable.fr</li>
                                <li>peut être partagée sur votre site, vos réseaux et vos supports</li>
                            </ul>
                            <p className="text-slate-600 font-medium">👉 C’est une visibilité complémentaire à votre site internet et à votre fiche Google.</p>
                        </div>
                    </section>

                    {/* Q7, Q8, Q9, Q10 Combined/Sequential for brevity in code but display fully as requested */}
                    <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-8 divide-y divide-slate-100">

                        {/* Temps */}
                        <div className="pt-4 first:pt-0">
                            <h2 className="text-lg font-bold mb-3">En combien de temps voit-on des résultats ?</h2>
                            <p className="text-slate-600 text-sm mb-2">Le référencement naturel est un travail progressif.</p>
                            <p className="text-slate-600 text-sm mb-2">Selon la zone, la concurrence et l’activité, certaines fiches sont visibles rapidement, d’autres sur plusieurs semaines ou mois.</p>
                            <p className="text-slate-600 font-medium text-sm">👉 Gainable.fr s’inscrit dans une logique long terme, pas dans une promesse immédiate.</p>
                        </div>

                        {/* Evolution */}
                        <div className="pt-8">
                            <h2 className="text-lg font-bold mb-3">Puis-je améliorer ma visibilité avec le temps ?</h2>
                            <p className="font-bold text-[#1F2D3D] text-sm mb-2">Oui.</p>
                            <p className="text-slate-600 text-sm mb-2">La visibilité évolue positivement lorsque votre fiche est complète, vos infos à jour, et que vous êtes actif sur la plateforme.</p>
                            <p className="text-slate-600 font-medium text-sm">👉 Le sérieux est récompensé dans la durée.</p>
                        </div>

                        {/* Refus */}
                        <div className="pt-8">
                            <h2 className="text-lg font-bold mb-3">Pourquoi certaines entreprises ne sont pas acceptées ?</h2>
                            <p className="text-slate-600 text-sm mb-2">Être présent sur Gainable.fr n’est pas un droit, c’est une reconnaissance.</p>
                            <p className="text-slate-600 text-sm mb-2">Les inscriptions peuvent être refusées si les critères ne sont pas respectés ou si les documents ne sont pas conformes.</p>
                            <p className="text-slate-600 font-medium text-sm">👉 Cette sélection protège la visibilité des professionnels référencés.</p>
                        </div>

                        {/* Compatible */}
                        <div className="pt-8">
                            <h2 className="text-lg font-bold mb-3">Gainable.fr est-il compatible avec mon site web ?</h2>
                            <p className="font-bold text-[#1F2D3D] text-sm mb-2">Oui, totalement.</p>
                            <p className="text-slate-600 text-sm mb-2">Il ne remplace pas votre site, il le renforce (support complémentaire, levier de crédibilité).</p>
                        </div>

                    </section>

                    {/* SUMMARY BOX */}
                    <section className="bg-[#1F2D3D] text-white rounded-2xl p-8 md:p-12 text-center shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-[#D59B2B]">En résumé</h2>
                        <div className="grid md:grid-cols-3 gap-6 mb-8 text-left md:text-center">
                            <div>
                                <div className="font-bold mb-2">Ne promet pas de leads</div>
                                <div className="text-slate-400 text-sm">Pas de fausses promesses commerciales.</div>
                            </div>
                            <div>
                                <div className="font-bold mb-2">Ne revend pas de contacts</div>
                                <div className="text-slate-400 text-sm">Votre exclusivité est respectée.</div>
                            </div>
                            <div>
                                <div className="font-bold mb-2">Ne favorise pas le plus offrant</div>
                                <div className="text-slate-400 text-sm">Seul le sérieux compte.</div>
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                            <p className="text-lg font-medium">
                                "Gainable.fr ne garantit pas des résultats commerciaux.<br />
                                Il garantit des conditions de visibilité claires et équitables."
                            </p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
