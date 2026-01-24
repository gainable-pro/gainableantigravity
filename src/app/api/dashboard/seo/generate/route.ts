
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const JWT_SECRET = process.env.JWT_SECRET || "default_super_secret_for_dev_only";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// HELPER: Verify User
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

export async function POST(req: Request) {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    try {
        // Fetch full expert profile for context
        const expert = await prisma.expert.findUnique({
            where: { user_id: userId },
            include: {
                technologies: true,
                interventions_clim: true,
            }
        });

        if (!expert) return NextResponse.json({ message: "Expert not found" }, { status: 404 });

        // Construct Prompt
        const systemPrompt = `You are an SEO expert specialized in HVAC (Chauffage, Ventilation, Climatisation).
Your goal is to write a highly optimized Meta Title and Meta Description for a French HVAC company listed on 'Gainable.fr'.
Constraints:
- Language: French
- Tone: Professional, reassuring, expert.
- Highlighting: "Entreprise Vérifiée", "Expert Gainable", Local Presence.
- Meta Title Max Length: 60 characters (strict).
- Meta Description Max Length: 160 characters (strict).
- Format: Return JSON only { "metaTitle": "...", "metaDesc": "..." }`;

        const userPrompt = `Company Name: ${expert.nom_entreprise}
City: ${expert.ville} (${expert.code_postal})
Description provided: ${expert.description || "N/A"}
Technologies: ${expert.technologies.map(t => t.value).join(', ')}
Interventions: ${expert.interventions_clim.map(t => t.value).join(', ')}

Please generate an optimized Meta Title and Meta Description.
Focus on "Climatisation Réversible", "Gainable", and the city.
Mention "Vérifié Gainable.fr" in the description if possible within limits.`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "gpt-4-turbo-preview", // or gpt-3.5-turbo if cost concern, but 4 is better for short copy
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // Validate structure
        if (!result.metaTitle || !result.metaDesc) {
            throw new Error("Invalid AI response format");
        }

        return NextResponse.json({
            message: "SEO Generated",
            data: result
        });

    } catch (error: any) {
        console.error("AI SEO Gen Error:", error);
        return NextResponse.json(
            { message: `Error generating SEO: ${error?.message}` },
            { status: 500 }
        );
    }
}
