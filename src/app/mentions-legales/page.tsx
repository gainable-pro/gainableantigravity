export default function MentionsLegales() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>

            <section className="space-y-6 text-slate-700 leading-relaxed">
                <div>
                    <h2 className="text-xl font-semibold mb-3">1. Éditeur du site</h2>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-4 text-amber-800 text-sm">
                        <strong>IMPORTANT :</strong> Veuillez remplir les informations ci-dessous avec les détails officiels de votre entreprise.
                    </div>
                    <p>
                        Le site <strong>gainable.fr</strong> est édité par :<br />
                        <strong>Raison sociale :</strong> [NOM DE VOTRE ENTREPRISE]<br />
                        <strong>Forme juridique :</strong> [EX: SAS, SARL]<br />
                        <strong>Capital social :</strong> [MONTANT] €<br />
                        <strong>Siège social :</strong> [ADRESSE DU SIÈGE]<br />
                        <strong>SIRET :</strong> [NUMÉRO SIRET]<br />
                        <strong>Directeur de la publication :</strong> [NOM DU RESPONSABLE]
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">2. Hébergement</h2>
                    <p>
                        Le site est hébergé par :<br />
                        <strong>Vercel Inc.</strong><br />
                        Adresse : 440 N Barranca Ave #4133 Covina, CA 91723<br />
                        Site web : https://vercel.com
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">3. Propriété intellectuelle</h2>
                    <p>
                        L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">4. Limitation de responsabilité</h2>
                    <p>
                        Gainable.fr s'efforce d'assurer au mieux de ses possibilités, l'exactitude et la mise à jour des informations diffusées sur ce site. Gainable.fr ne peut être tenu responsable de l'interprétation des informations contenues dans ce site, ni des conséquences de leur utilisation.
                    </p>
                </div>
            </section>
        </div>
    );
}
