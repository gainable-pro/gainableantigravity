export default function PolitiqueConfidentialite() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-bold mb-4 text-[#1F2D3D]">POLITIQUE DE CONFIDENTIALITÉ</h1>
            <p className="text-[#D59B2B] font-bold mb-8 uppercase tracking-widest text-sm">
                GAINABLE.FR – GAINABLE.CH – GAINABLE.MA – GAINABLE.BE
            </p>

            <section className="space-y-10 text-slate-700 leading-relaxed">
                {/* Introduction / Header Card */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 italic shadow-sm">
                    <p>
                        La société EXCEED DIGITAL, société par actions simplifiée (SAS), immatriculée au Registre du Commerce et des Sociétés de Salon-de-Provence sous le numéro 101 447 944, exerçant sous la dénomination commerciale GAINABLE.FR, attache une importance particulière à la protection des données personnelles.
                    </p>
                    <p className="mt-4">
                        La présente politique de confidentialité s’applique à l’ensemble des utilisateurs des sites :
                    </p>
                    <ul className="list-disc ml-6 mt-2 space-y-1 font-semibold text-[#D59B2B]">
                        <li>www.gainable.fr</li>
                        <li>www.gainable.ch</li>
                        <li>www.gainable.ma</li>
                        <li>www.gainable.be</li>
                    </ul>
                </div>

                {/* Regulation Context */}
                <div className="border-l-4 border-slate-200 pl-6">
                    <p className="font-medium text-slate-500 mb-3 uppercase text-xs tracking-wider">Conformité réglementaire</p>
                    <p>Les traitements de données sont réalisés conformément :</p>
                    <ul className="list-disc ml-6 mt-3 space-y-2">
                        <li>au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD), applicable au sein de l’Union européenne, y compris la Belgique ;</li>
                        <li>à la Loi fédérale suisse sur la protection des données (nLPD) ;</li>
                        <li>à la Loi marocaine n° 09-08 relative à la protection des personnes physiques à l’égard du traitement des données à caractère personnel ;</li>
                        <li>ainsi qu’à toute réglementation nationale applicable en matière de protection des données.</li>
                    </ul>
                </div>

                {/* 1 & 2 Identity and Redirects */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-[#1F2D3D] mb-4 border-b pb-2 border-slate-100">1. Identité du responsable</h2>
                        <div className="space-y-2 text-sm">
                            <p><strong>Raison sociale :</strong> EXCEED DIGITAL</p>
                            <p><strong>Dénomination commerciale :</strong> GAINABLE.FR</p>
                            <p><strong>Forme juridique :</strong> SAS, société par actions simplifiée</p>
                            <p><strong>SIREN :</strong> 101 447 944</p>
                            <p><strong>SIRET (siège) :</strong> 101 447 944 00014</p>
                            <p><strong>TVA :</strong> FR39 101447944</p>
                            <p><strong>RCS :</strong> Salon-de-Provence</p>
                            <p><strong>Code APE :</strong> 6201Z</p>
                            <p><strong>Immatriculation :</strong> 19/02/2026</p>
                            <p><strong>Siège :</strong> Miramas (13), France</p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold text-[#1F2D3D] mb-4 border-b pb-2 border-slate-100">2. Extensions territoriales</h2>
                        <p className="text-sm">
                            Les noms de domaine .fr, .ch, .ma et .be sont exploités par EXCEED DIGITAL.
                            Ces extensions ne constituent pas des entités distinctes. Elles redirigent vers <strong>www.gainable.fr</strong>, l’unique plateforme administrée.
                        </p>
                        <p className="text-sm mt-4 italic text-slate-500">
                            L'ensemble des traitements est effectué exclusivement par EXCEED DIGITAL, quel que soit le domaine utilisé.
                        </p>
                    </div>
                </div>

                {/* 3. Données collectées */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-[#1F2D3D]">3. Données personnelles collectées</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-[#D59B2B] mb-3 uppercase text-xs tracking-wider">3.1 Particuliers</h3>
                            <ul className="text-xs space-y-2 list-disc ml-4 font-medium">
                                <li>Nom et prénom</li>
                                <li>Email & Téléphone</li>
                                <li>Ville/Adresse du projet</li>
                                <li>Description du projet</li>
                                <li>Budget estimatif</li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-[#D59B2B] mb-3 uppercase text-xs tracking-wider">3.2 Professionnels</h3>
                            <ul className="text-xs space-y-2 list-disc ml-4 font-medium">
                                <li>Raison sociale & SIREN</li>
                                <li>Représentant légal</li>
                                <li>TVA & Adresse pro</li>
                                <li>Zone d'intervention</li>
                                <li>Réalisations & Avis</li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-[#D59B2B] mb-3 uppercase text-xs tracking-wider">3.3 Automatique</h3>
                            <ul className="text-xs space-y-2 list-disc ml-4 font-medium">
                                <li>Adresse IP</li>
                                <li>Données de connexion</li>
                                <li>Terminal & Naviguateur</li>
                                <li>Cookies & Statistiques</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4 & 5 Finalités and Transmission */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-bold text-[#1F2D3D] mb-3">4. Finalités et bases légales</h2>
                        <p className="text-sm">Fournir le service de mise en relation, gérer les comptes, publier les fiches entreprises, gérer la facturation, prévenir les fraudes et respecter les obligations légales (contrat, loi, intérêt légitime).</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#1F2D3D] mb-3">5. Transmission des données</h2>
                        <p className="text-sm">Les données clients sont transmises exclusivement aux pros sélectionnés. La transmission intervient uniquement après une action volontaire du client. Les pros deviennent responsables de traitement indépendants.</p>
                    </div>
                </div>

                {/* 6 to 10 - Combined for readability */}
                <div className="space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-[#1F2D3D] mb-2">6. Publication des coordonnées professionnelles</h2>
                        <p className="text-sm">Les coordonnées pros (Tel, Email, Siège) peuvent être publiées pour faciliter le contact direct, sur la base de l'exécution du contrat.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-lg font-bold text-[#1F2D3D] mb-2">7. Partage avec des tiers</h2>
                            <p className="text-sm">Transmises aux prestataires techniques (hébergement, paiement, analyse). Aucune donnée n'est vendue.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1F2D3D] mb-2">8. Transferts internationaux</h2>
                            <p className="text-sm">Garanties appropriées mises en place hors UE/Suisse/Maroc conformément aux réglementations (RGPD, nLPD, Loi 09-08).</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-lg font-bold text-[#1F2D3D] mb-2">9. Durée de conservation</h2>
                            <p className="text-sm">Conservées pendant la durée nécessaire à l'exécution des services et aux obligations légales.</p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#1F2D3D] mb-2">10. Sécurité des données</h2>
                            <p className="text-sm">Mesures techniques et organisationnelles appropriées pour garantir la sécurité et la confidentialité.</p>
                        </div>
                    </div>
                </div>

                {/* 11. Droits */}
                <div className="bg-blue-600 p-8 rounded-2xl text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">11. Droits des utilisateurs</h2>
                    <p className="mb-6 opacity-90">
                        Conformément au RGPD, à la nLPD (Suisse) et à la Loi 09-08 (Maroc), vous disposez des droits d'accès, rectification, effacement, opposition, limitation et portabilité.
                    </p>
                    <div className="bg-white/10 p-4 rounded-xl border border-white/20 inline-block">
                        <p className="text-sm">Contactez-nous pour toute demande :</p>
                        <p className="text-xl font-bold">contact@exceeddigital.fr</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
