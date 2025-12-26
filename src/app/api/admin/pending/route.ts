import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

export async function GET() {
    // 1. Auth & Admin Check (Simple email check for now)
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string };

        // Hardcoded Admin Check for robustness/simplicity as requested
        // Using strict email or role check from DB
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        const isAdmin = user?.email === 'gmaroann@gmail.com' || user?.role === 'ADMIN';

        if (!isAdmin) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // 2. Fetch Pending
        const pendingExperts = await prisma.expert.findMany({
            where: {
                OR: [
                    { status: 'pending_validation' },
                    { status: 'pending_payment' }
                ]
            },
            include: { user: { select: { email: true } } },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(pendingExperts);

    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
