import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import * as jose from 'jose';
import OpenAI from "openai";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const { prompt } = await req.json();
        if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );
        
        const user = await prisma.user.findUnique({ where: { id: payload.userId as string } });
        const isAdmin = user?.email === 'gmaroann@gmail.com' || user?.role === 'ADMIN' || user?.role === 'admin';
        if (!isAdmin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
        });

        const imageUrl = response.data[0].url;

        return NextResponse.json({ imageUrl });

    } catch (e) {
        console.error("Visual generation error:", e);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
