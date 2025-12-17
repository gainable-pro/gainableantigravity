export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LeadsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-[#1F2D3D]">Demandes reçues</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">Boîte de réception Email</h2>

                    <p className="text-slate-600">
                        Pour faciliter la gestion initiale et sécuriser le déploiement, vos leads sont actuellement envoyés <strong>directement par email</strong>.
                    </p>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-4 text-left">
                        <p className="text-sm text-slate-500 mb-1">Email de réception :</p>
                        <p className="font-mono text-[#D59B2B] font-bold">contact@airgenergie.fr</p>
                    </div>

                    <p className="text-sm text-slate-400 pt-4">
                        (Bientôt : Historique complet et gestion CRM intégrée ici dans une prochaine mise à jour)
                    </p>
                </div>
            </div>
        </div>
    );
}
