import { NextResponse } from 'next/server';

// GET: Verify SIRET via Government Open API
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const siret = searchParams.get('siret');

    if (!siret || siret.length < 9) {
        return NextResponse.json({ error: 'SIRET/SIREN invalide' }, { status: 400 });
    }

    try {
        // Use the official, free, open French Government API
        const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${siret}&limit=1`);

        if (!response.ok) {
            return NextResponse.json({ error: 'Erreur API Gouvernementale' }, { status: response.status });
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const company = data.results[0];
            const siege = company.siege;

            return NextResponse.json({
                nom: company.nom_complet || company.nom_raison_sociale,
                adresse: `${siege.numero_voie || ''} ${siege.type_voie || ''} ${siege.libelle_voie || ''}`.trim(),
                code_postal: siege.code_postal,
                ville: siege.libelle_commune,
                naf: company.activite_principale, // e.g., "43.22B"
                activite: company.libelle_activite_principale
            });
        } else {
            return NextResponse.json({ error: 'Entreprise non trouvée' }, { status: 404 });
        }

    } catch (error) {
        console.error("SIRET API Error:", error);
        return NextResponse.json({ error: 'Erreur serveur lors de la vérification' }, { status: 500 });
    }
}
