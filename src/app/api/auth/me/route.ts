import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
        return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
        const decoded = verify(token.value, JWT_SECRET) as any;

        // Optionally fetch fresh user data from DB if needed, 
        // but for now checking the token is valid is enough for "isLoggedIn"
        // Let's verify user still exists in DB just in case
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                email: true,
                role: true,
                expert: {
                    select: { slug: true }
                }
            } // Don't return hash
        });

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        // Token invalid or expired
        return NextResponse.json({ user: null }, { status: 200 });
    }
}
