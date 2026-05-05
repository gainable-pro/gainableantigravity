import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

export async function verifyCommercial() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token");

        if (!token) return null;

        const decoded = verify(token.value, JWT_SECRET) as any;

        // Verify in DB specifically for ROLE
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true }
        });

        // Allow both commercial and admin to access commercial routes
        if (user && (user.role === 'commercial' || user.role === 'admin')) {
            return user;
        }

        return null;
    } catch (e) {
        return null;
    }
}

export function unauthorizedCommercial() {
    return NextResponse.json({ message: "Unauthorized - Commercial access required" }, { status: 403 });
}
