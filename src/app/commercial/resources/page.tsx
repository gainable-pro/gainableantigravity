"use client";

import { BookOpen, Search, Star, Users, Smartphone, ShieldAlert, CheckCircle, Target } from "lucide-react";

export default function CommercialResources() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Ressources & Argumentaires</h1>
                <p className="text-slate-500">Les données clés et arguments pour convaincre vos prospects.</p>
            </div>

            {/* Introduction du marché */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        Comment les clients trouvent un installateur de clim (Classement Réel)
                    </h2>
                </div>
                
                <div className="p-6 space-y-6">
                    {/* 1. Google */}
                    <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                Google & Internet <span className="text-sm font-normal text-slate-500">(Très largement n°1)</span>
                            </h3>
                            <ul className="mt-2 space-y-2 text-slate-600">
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> <strong>87% des Français</strong> cherchent un artisan sur Google avant de signer.</li>
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> <strong>97% des clients</strong> recherchent une entreprise locale sur Internet.</li>
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> <strong>80% se renseignent</strong> en ligne avant même de contacter l'artisan.</li>
                            </ul>
                            <div className="mt-3 bg-blue-50 border border-blue-100 p-3 rounded-lg text-blue-800 font-medium text-sm flex gap-2">
                                👉 Conclusion : Google (SEO + Avis) est le canal d'acquisition dominant et ultra-majoritaire.
                            </div>
                        </div>
                    </div>

                    {/* 2. Avis */}
                    <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Avis en ligne (Google, Plateformes)</h3>
                            <ul className="mt-2 space-y-2 text-slate-600">
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> <strong>88% des gens</strong> consultent les avis avant de choisir.</li>
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> Ils font autant confiance aux avis en ligne qu’à une recommandation personnelle.</li>
                            </ul>
                            <div className="mt-3 bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-700 font-medium text-sm flex gap-2">
                                👉 En vrai : C’est du bouche-à-oreille digitalisé.
                            </div>
                        </div>
                    </div>

                    {/* 3. Bouche à oreille */}
                    <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Bouche-à-oreille classique</h3>
                            <ul className="mt-2 space-y-2 text-slate-600">
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> Ne représente plus que <strong>10 à 20% réel</strong> aujourd’hui (selon les études terrain).</li>
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> Seulement 63% recommandent un artisan connu.</li>
                            </ul>
                            <div className="mt-3 bg-orange-50 border border-orange-100 p-3 rounded-lg text-orange-800 font-medium text-sm flex gap-2">
                                👉 Important : Ça marche encore, mais c'est souvent vérifié sur Google derrière ! L'artisan DOIT être visible.
                            </div>
                        </div>
                    </div>

                    {/* 4. Réseaux Sociaux */}
                    <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg">4</div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Réseaux sociaux (Facebook, Insta, TikTok)</h3>
                            <ul className="mt-2 space-y-2 text-slate-600">
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> <strong>Pas dominant</strong> pour la recherche d'un artisan.</li>
                                <li className="flex gap-2"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" /> Utilisé surtout pour voir des réalisations et demander dans des groupes locaux.</li>
                            </ul>
                            <div className="mt-3 bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-700 font-medium text-sm flex gap-2">
                                👉 Estimation : 5 à 10% max en acquisition directe. L'impact est indirect.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Différenciation & Argumentaire Fort */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                        Argumentaire Principal : Pourquoi Gainable.fr ?
                    </h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="bg-red-50 border border-red-100 p-5 rounded-xl">
                            <h3 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                                <ShieldAlert className="h-5 w-5" />
                                Le Problème du Prospect
                            </h3>
                            <ul className="space-y-3 text-red-900 text-sm">
                                <li><strong>Fin du démarchage téléphonique (B2C) :</strong> La prospection sauvage est très encadrée voire interdite (loi d'août sur le démarchage).</li>
                                <li><strong>Les plateformes (Travaux.com, Batiweb, HelloArtisan, etc.) :</strong> Elles vendent juste des coordonnées (Leads). Le prospect est mis en concurrence avec 5 autres artisans, il faut payer chaque lead très cher (entre 40€ et 45€) sans aucune garantie de signature.</li>
                            </ul>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
                            <h3 className="font-bold text-emerald-800 flex items-center gap-2 mb-3">
                                <Star className="h-5 w-5" />
                                La Solution Gainable.fr
                            </h3>
                            <ul className="space-y-3 text-emerald-900 text-sm">
                                <li><strong>Nous ne vendons pas des contacts, nous vendons un OUTIL SEO.</strong></li>
                                <li><strong>Visibilité Long Terme :</strong> Avec Gainable.fr, l'artisan crée son empreinte SEO locale. C'est le client qui vient à l'artisan grâce aux mots clés.</li>
                                <li><strong>Exclusivité :</strong> Sur sa page profil, le client ne voit que LUI. Pas de mise en concurrence directe sur son profil expert.</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* La Force du SEO Massif */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Search className="h-5 w-5 text-amber-600" />
                        L'Effet "Boule de Neige" du SEO Local
                    </h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="space-y-4 text-slate-700">
                        <p>
                            <strong>Le problème d'un site web classique :</strong> Un site web normal est indexé de manière générale sur Google (en moyenne, une dizaine de pages maximum). Il stagne.
                        </p>
                        <p>
                            <strong>La puissance de Gainable.fr :</strong> Notre force, c'est la <strong>nouveauté et le volume</strong>. En publiant régulièrement ses chantiers (ex: une installation à Marseille, une autre à Aix), l'artisan crée des articles de blog hyper-optimisés.
                        </p>
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                            <ul className="space-y-2 text-sm text-amber-900">
                                <li>📈 <strong>Calcul simple :</strong> 5 articles par mois = 60 nouvelles pages indexées par Google sur l'année. En 2 ans, plus de 100 pages positionnées sur sa zone géographique !</li>
                                <li>🔗 <strong>Boost du site principal :</strong> Chaque article redirige vers son site principal. Cela crée des "backlinks" de qualité qui améliorent le classement de son propre site web.</li>
                                <li>🛡️ <strong>L'Omniprésence (Réassurance ultime) :</strong> Quand un client cherche le nom de l'entreprise avant de signer, il verra : Le site de l'artisan, Societe.com, Facebook, les Avis Google... <strong>ET Gainable.fr</strong>. Cette présence multi-canale rassure immédiatement le client sur le fait qu'il a affaire à une entreprise sérieuse, implantée et experte.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Traitement des Objections Courantes */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        Traitement des Objections Courantes
                    </h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-2">
                            💬 « J'ai déjà un site web et des avis Google, je n'ai pas besoin de vous. »
                        </h3>
                        <div className="space-y-3 text-sm text-slate-600 mt-4">
                            <p>
                                <strong>La réponse :</strong> C'est très bien ! Avoir un site web, des avis Google et une page Facebook est indispensable aujourd'hui. Mais notre objectif chez Gainable.fr n'est pas de remplacer votre site, c'est de <strong>faciliter la conversion et d'augmenter votre taux de transformation</strong> sur des chantiers à forte valeur ajoutée (VRV, Gainable, grosses installations).
                            </p>
                            <p>
                                <strong>L'explication :</strong> Pour un petit dépannage, le client prendra le premier sur Google. Mais pour un projet à 10 000€ ou 15 000€, il va comparer. Gainable.fr agit comme un <strong>tiers de confiance ultra-spécialisé</strong>. Un profil premium chez nous rassure le client sur votre expertise technique. Même si vous êtes légèrement plus cher qu'un concurrent, la qualité et la réassurance qu'apporte votre présence sur Gainable.fr vont faire basculer la vente en votre faveur.
                            </p>
                            <p className="font-medium text-purple-700 bg-purple-50 p-2 rounded">
                                👉 Le but : Ne plus se battre sur les prix (le low-cost), mais gagner les devis grâce à la réassurance et la qualité de votre image d'expert.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
