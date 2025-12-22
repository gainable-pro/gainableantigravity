import { NextResponse } from "next/server";
import { verifyAdmin, unauthorized } from "@/lib/admin-auth";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

export async function POST(req: Request) {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) return unauthorized();

    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate token for the TARGET user
    const token = sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" } // Short session for impersonation
    );

    // Set cookie
    const serialized = serialize("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
    });

    return NextResponse.json(
        { message: "Impersonation successful" },
        {
            status: 200,
            headers: { "Set-Cookie": serialized },
        }
    );
}
