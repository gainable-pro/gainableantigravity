export default function LoadingExpertProfile() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-[#D59B2B] rounded-full animate-spin mx-auto mb-6"></div>
                <h1 className="text-2xl font-bold text-[#1F2D3D] mb-2">Chargement du profil expert...</h1>
                <p className="text-slate-500">Nous préparons les informations de ce professionnel.</p>
            </div>
        </div>
    );
}
