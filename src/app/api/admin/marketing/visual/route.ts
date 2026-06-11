import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import * as jose from 'jose';
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

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
            model: "gpt-image-2",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
        });

        const b64Data = response.data?.[0]?.b64_json;
        if (!b64Data) {
            return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
        }

        const imageBuffer = Buffer.from(b64Data, 'base64');
        const filePath = `marketing/visual_${Date.now()}.png`;

        const { error: uploadError } = await supabase.storage.from('gainable-assets').upload(filePath, imageBuffer, {
            contentType: 'image/png',
            upsert: false
        });

        if (uploadError) {
            console.error("Supabase upload error:", uploadError);
            return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
        }

        const { data: publicUrlData } = supabase.storage.from('gainable-assets').getPublicUrl(filePath);
        const imageUrl = publicUrlData.publicUrl;

        return NextResponse.json({ imageUrl });

    } catch (e) {
        console.error("Visual generation error:", e);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
