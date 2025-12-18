export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LeadsPage() {
    return (
        <div className="p-10 text-center">
            <h1 className="text-xl font-bold mb-4">Demandes reçues</h1>
            <p className="text-slate-600">
                Les leads sont envoyés par email.<br />
                L’historique sera ajouté ultérieurement.
            </p>
        </div>
    );
}
