import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email et mot de passe requis." },
                { status: 400 }
            );
        }

        // 1. Find User
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { message: "Identifiants incorrects." },
                { status: 401 }
            );
        }

        // 2. Verify Password
        const isValid = await compare(password, user.password_hash);
        if (!isValid) {
            return NextResponse.json(
                { message: "Identifiants incorrects." },
                { status: 401 }
            );
        }

        // 3. Generate JWT
        // In a real app, payload should be minimal
        const token = sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" } // 7 days session
        );

        // 4. Set Cookie
        const serialized = serialize("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json(
            { message: "Connexion réussie" },
            {
                status: 200,
                headers: { "Set-Cookie": serialized },
            }
        );

    } catch (error: any) {
        console.error("Login Error:", error);

        // DEBUG: Return real error to user
        const errorMsg = error?.message || "Erreur inconnue";
        const errorCode = error?.code || "NO_CODE";

        return NextResponse.json(
            { message: `Erreur technique: ${errorMsg} (Code: ${errorCode})` },
            { status: 500 }
        );
    }
}
