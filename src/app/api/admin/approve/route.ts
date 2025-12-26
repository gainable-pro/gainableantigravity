import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        const isAdmin = user?.email === 'gmaroann@gmail.com' || user?.role === 'ADMIN';

        if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const { expertId } = await req.json();

        await prisma.expert.update({
            where: { id: expertId },
            data: { status: 'active' } // Activate!
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
