import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Building2, Server, Scale, ShieldCheck, Globe2 } from 'lucide-react';

export const metadata: Metadata = {
    title: "Mentions Légales - Gainable.fr",
    description: "Mentions légales officielles de la plateforme Gainable.fr éditée par EXCEED DIGITAL SAS (SIREN 101 447 944, RCS Salon-de-Provence).",
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
                        <Scale className="w-4 h-4 text-[#D59B2B]" /> Informations Réglementaires
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black font-montserrat text-[#1F2D3D] mb-3 leading-tight">
                        MENTIONS LÉGALES
                    </h1>
                    <p className="text-[#D59B2B] font-bold uppercase tracking-wider text-sm md:text-base">
                        GAINABLE.FR — EXCEED DIGITAL
                    </p>
                </div>

                {/* Corps des Mentions Légales */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">

                    {/* 1. ÉDITEUR DU SITE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Building2 className="w-5 h-5 text-[#D59B2B]" />
                            1. Éditeur du site
                        </h2>
                        <p>Le site <strong>gainable.fr</strong> est édité par :</p>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 text-sm space-y-1.5">
                            <p><strong>Raison sociale :</strong> GAINABLE.FR by EXCEED DIGITAL</p>
                            <p><strong>Forme juridique :</strong> SAS (Société par Actions Simplifiée)</p>
                            <p><strong>Siège social :</strong> 13140 Miramas, France</p>
                            <p><strong>SIREN :</strong> 101 447 944</p>
                            <p><strong>RCS :</strong> Salon-de-Provence</p>
                            <p><strong>Adresse électronique :</strong> <a href="mailto:contact@exceeddigital.fr" className="text-[#D59B2B] font-semibold underline">contact@exceeddigital.fr</a></p>
                            <p><strong>Directeur de la publication :</strong> Direction EXCEED DIGITAL</p>
                        </div>
                    </section>

                    {/* 2. HÉBERGEMENT */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Server className="w-5 h-5 text-[#D59B2B]" />
                            2. Hébergement
                        </h2>
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-slate-800 text-sm space-y-1">
                            <p>Le site est hébergé par :</p>
                            <p className="font-bold text-slate-900">Vercel Inc.</p>
                            <p>Adresse : 440 N Barranca Ave #4133 Covina, CA 91723, USA</p>
                            <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#D59B2B] underline">https://vercel.com</a></p>
                        </div>
                    </section>

                    {/* 3. PROPRIÉTÉ INTELLECTUELLE GÉNÉRALE */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            3. Propriété intellectuelle
                        </h2>
                        <p>
                            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                        </p>
                    </section>

                    {/* 4. LIMITATION DE RESPONSABILITÉ */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3">
                            4. Limitation de responsabilité
                        </h2>
                        <p>
                            Gainable.fr s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des informations diffusées sur ce site. Gainable.fr ne peut être tenu responsable de l'interprétation des informations contenues dans ce site, ni des conséquences de leur utilisation.
                        </p>
                    </section>

                    {/* ARTICLE 5 — PROPRIÉTÉ INTELLECTUELLE ET PROTECTION DU RÉSEAU MULTIDOMAINE GAINABLE */}
                    <section className="space-y-6 pt-4 border-t-2 border-slate-100">
                        <h2 className="text-xl font-black font-montserrat text-[#1F2D3D] border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Globe2 className="w-5 h-5 text-[#D59B2B]" />
                            ARTICLE 5 — PROPRIÉTÉ INTELLECTUELLE ET PROTECTION DU RÉSEAU MULTIDOMAINE GAINABLE
                        </h2>

                        {/* 5.1 */}
                        <div className="space-y-2 text-sm">
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

                        {/* 5.2 */}
                        <div className="space-y-2 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.2 — Réseau multidomaine</h3>
                            <p>
                                L'écosystème numérique Gainable comprend notamment les noms de domaine suivants, lorsqu'ils sont effectivement exploités par EXCEED DIGITAL :
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 font-semibold text-[#D59B2B]">
                                <div>• www.gainable.fr</div>
                                <div>• www.gainable.ch</div>
                                <div>• www.gainable.ma</div>
                                <div>• www.gainable.be</div>
                                <div>• www.gainable.org</div>
                                <div>• www.gainable.eu</div>
                            </div>
                            <p>
                                Les protections légales applicables aux éléments de Gainable s'exercent indépendamment du nom de domaine utilisé pour accéder aux services.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                La détention ou l'exploitation de ces noms de domaine ne confère toutefois pas, à elle seule, un droit exclusif sur le principe d'une plateforme multidomaine.
                            </p>
                        </div>

                        {/* 5.3 */}
                        <div className="space-y-2 text-sm">
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

                        {/* 5.4 */}
                        <div className="space-y-2 text-sm">
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

                        {/* 5.5 */}
                        <div className="space-y-2 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.5 — Protection du savoir-faire et des informations confidentielles</h3>
                            <p>
                                Les informations techniques, commerciales ou organisationnelles non publiques relatives à Gainable, notamment certains paramètres internes, procédés de développement et méthodes de déploiement, peuvent bénéficier de la protection du secret des affaires lorsque les conditions légales sont réunies.
                            </p>
                            <p>
                                Cette protection concerne les informations présentant une valeur commerciale du fait de leur caractère secret et faisant l'objet de mesures raisonnables destinées à préserver leur confidentialité.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Elle ne s'étend pas aux idées générales, aux fonctionnalités usuelles ou aux informations librement accessibles.
                            </p>
                        </div>

                        {/* 5.6 */}
                        <div className="space-y-2 text-sm">
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

                        {/* 5.7 */}
                        <div className="space-y-2 text-sm">
                            <h3 className="font-bold text-slate-900 text-base">5.7 — Défense des droits</h3>
                            <p>
                                En cas de contrefaçon, d'extraction illicite, d'atteinte à un secret d'affaires ou d'actes de concurrence déloyale, EXCEED DIGITAL se réserve le droit d'exercer toute action légalement ouverte afin de faire cesser les agissements et d'obtenir réparation du préjudice subi.
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                Ces dispositions s'appliquent sous réserve des droits des utilisateurs et des législations impératives applicables.
                            </p>
                        </div>
                    </section>

                    {/* LIENS DE NAVIGATION LÉGALE */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 mt-6">
                        Consultez également nos <Link href="/cgu" className="text-[#D59B2B] underline">Conditions Générales d'Utilisation (CGU)</Link>, nos <Link href="/cgv" className="text-[#D59B2B] underline">CGV professionnelles</Link>, notre <Link href="/politique-confidentialite" className="text-[#D59B2B] underline">Politique de Confidentialité</Link> et notre <Link href="/politique-cookies" className="text-[#D59B2B] underline">Politique de Cookies</Link>.
                    </div>

                </div>

            </div>
        </main>
    );
}
