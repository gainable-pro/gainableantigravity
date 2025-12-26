
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./dashboard-client";

// Force dynamic because we check auth and DB
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    try {
        const admin = await verifyAdmin();

        // Redirect if not admin
        if (!admin) {
            redirect("/auth/login");
        }

        // Fetch initial data server-side
        const users = await prisma.user.findMany({
            include: {
                expert: {
                    select: {
                        id: true,
                        nom_entreprise: true,
                        status: true,
                        ville: true,
                        slug: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        // Serialize dates for Client Component
        const serializedUsers = users.map(u => ({
            ...u,
            created_at: u.created_at.toISOString(),
            password_hash: undefined // Do not send hash
        }));

        return (
            <div className="container mx-auto py-10">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
                <AdminDashboardClient initialUsers={serializedUsers as any} />
            </div>
        );
    } catch (error) {
        console.error("Admin Page Error:", error);
        // Rethrow redirect errors (Next.js mechanism)
        if ((error as any)?.digest?.startsWith?.('NEXT_REDIRECT')) {
            throw error;
        }
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur système</h1>
                <p className="text-slate-600">Une erreur est survenue lors du chargement du dashboard.</p>
                <code className="block mt-4 p-4 bg-slate-100 rounded text-xs text-left overflow-auto max-w-2xl mx-auto">
                    {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
                </code>
            </div>
        );
    }
}
