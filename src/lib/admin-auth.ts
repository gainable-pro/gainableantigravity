import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

export async function verifyAdmin() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token");

        if (!token) return null;

        const decoded = verify(token.value, JWT_SECRET) as any;

        // Verify in DB specifically for ROLE
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { role: true }
        });

        if (user && user.role === 'admin') {
            return user;
        }

        return null;
    } catch (e) {
        return null;
    }
}

export function unauthorized() {
    return NextResponse.json({ message: "Unauthorized - Admin access required" }, { status: 403 });
}
