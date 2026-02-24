export default function PolitiqueConfidentialite() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>

            <section className="space-y-8 text-slate-700 leading-relaxed">
                <div>
                    <h2 className="text-xl font-semibold mb-3">1. Collecte des données</h2>
                    <p>Nous collectons les informations que vous nous fournissez via nos formulaires de contact : Nom, Adresse Email, Numéro de téléphone, Code Postal et Ville.</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">2. Finalité du traitement</h2>
                    <p>Vos données sont utilisées exclusivement pour :</p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>Vous mettre en relation avec des installateurs ou experts qualifiés.</li>
                        <li>Répondre à vos demandes de devis ou d'information.</li>
                        <li>Assurer le suivi de votre dossier par notre service client.</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">3. Base légale et Consentement</h2>
                    <p>Le traitement de vos données est fondé sur votre consentement explicite, recueilli au moment de la soumission de nos formulaires.</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">4. Destinataires des données</h2>
                    <p>Vos données sont transmises uniquement aux professionnels (artisans, bureaux d'études) sélectionnés pour répondre à votre besoin. Elles ne sont jamais vendues à des tiers à des fins publicitaires.</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">5. Vos Droits</h2>
                    <p>Conformément au <strong>RGPD</strong> (Union Européenne), à la <strong>nLPD</strong> (Suisse) et à la <strong>Loi 09-08</strong> (Maroc), vous disposez des droits suivants :</p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>Droit d'accès et de rectification.</li>
                        <li>Droit à l'effacement (droit à l'oubli).</li>
                        <li>Droit d'opposition à tout moment.</li>
                    </ul>
                    <p className="mt-4">Pour exercer ces droits, contactez-nous à : <strong>contact@gainable.fr</strong></p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">6. Sécurité</h2>
                    <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès non autorisé.</p>
                </div>
            </section>
        </div>
    );
}
