import ProfileForm from "@/components/dashboard/profile-form";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#1F2D3D]">Mon Profil Public</h2>
                <p className="text-slate-500">Gérez les informations affichées sur votre page dédiée.</p>
            </div>

            <ProfileForm />
        </div>
    );
}
