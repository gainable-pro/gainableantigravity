import { NextResponse } from "next/server";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return unauthorized();

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

    return NextResponse.json(users);
}
