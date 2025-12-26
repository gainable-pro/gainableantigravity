import ProfileForm from "@/components/dashboard/profile-form";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

async function getUserSlug() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const expert = await prisma.expert.findUnique({
            where: { user_id: decoded.userId },
            select: { slug: true }
        });
        return expert?.slug;
    } catch (e) {
        return null;
    }
}

import AdminPendingList from "@/components/dashboard/admin-pending-list";

export default async function DashboardPage() {
    const slug = await getUserSlug();

    return (
        <div className="space-y-6">
            {/* ADMIN ONLY: PENDING VALIDATIONS */}
            <AdminPendingList />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[#1F2D3D]">Mon Profil Public</h2>
                    <p className="text-slate-500">Gérez les informations affichées sur votre page dédiée.</p>
                </div>
                {slug && (
                    <Link href={`/pro/${slug}`} target="_blank">
                        <Button variant="outline" className="gap-2 text-[#D59B2B] border-[#D59B2B] hover:bg-[#D59B2B]/10">
                            <ExternalLink className="w-4 h-4" />
                            Voir ma fiche en ligne
                        </Button>
                    </Link>
                )}
            </div>

            <ProfileForm />
        </div>
    );
}
