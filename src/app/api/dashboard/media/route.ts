
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";

async function getUserIdFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

// GET: Fetch expert media including photos
export async function GET() {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const expert = await prisma.expert.findUnique({
            where: { user_id: userId },
            select: {
                logo_url: true,
                video_url: true,
                video_youtube: true,
                photos: {
                    select: { photo_url: true }
                }
            }
        });

        // Flatten photos for frontend convenience: ['url1', 'url2']
        const formattedExpert = expert ? {
            ...expert,
            photos: expert.photos.map(p => p.photo_url)
        } : {};

        return NextResponse.json(formattedExpert);
    } catch (error) {
        console.error("GET Media Error:", error);
        return NextResponse.json({ message: "Error fetching media" }, { status: 500 });
    }
}

// PUT: Update expert media
export async function PUT(req: Request) {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();

        // Find expert ID first
        const currentExpert = await prisma.expert.findUnique({ where: { user_id: userId } });
        if (!currentExpert) return NextResponse.json({ message: "Expert not found" }, { status: 404 });

        await prisma.$transaction(async (tx) => {
            // 1. Update main fields
            await tx.expert.update({
                where: { id: currentExpert.id },
                data: {
                    logo_url: body.logo_url || null,
                    video_url: body.video_url || null,
                    video_youtube: body.video_youtube || null
                }
            });

            // 2. Update Photos Relation
            // Expecting body.photos to be string[]
            if (Array.isArray(body.photos)) {
                await tx.expertPhoto.deleteMany({
                    where: { expert_id: currentExpert.id }
                });

                if (body.photos.length > 0) {
                    await tx.expertPhoto.createMany({
                        data: body.photos.map((url: string) => ({
                            expert_id: currentExpert.id,
                            photo_url: url
                        }))
                    });
                }
            }
        });

        return NextResponse.json({ message: "Media updated successfully" });
    } catch (error) {
        console.error("PUT Media Error:", error);
        return NextResponse.json({ message: "Error updating media" }, { status: 500 });
    }
}
