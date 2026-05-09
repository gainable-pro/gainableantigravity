import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

async function getAdminUser(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;

    try {
        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );
        const user = await prisma.user.findUnique({ where: { id: payload.userId as string } });
        const isAdmin = user?.email === 'gmaroann@gmail.com' || user?.role === 'ADMIN';
        return isAdmin ? user : null;
    } catch {
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const user = await getAdminUser(req);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { platform, content, imageUrl, scheduledAt } = body;

        if (!platform || !content || !scheduledAt) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const scheduledPost = await prisma.scheduledPost.create({
            data: {
                platform,
                content,
                imageUrl,
                scheduledAt: new Date(scheduledAt),
                status: "PENDING"
            }
        });

        return NextResponse.json(scheduledPost);
    } catch (error) {
        console.error("Error scheduling post:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await getAdminUser(req);
        if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const posts = await prisma.scheduledPost.findMany({
            orderBy: { scheduledAt: 'asc' }
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching scheduled posts:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
