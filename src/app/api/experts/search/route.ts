import { NextResponse } from "next/server";
import { getExperts } from "@/lib/experts";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const filters = {
        q: searchParams.get("q")?.trim() || "",
        city: searchParams.get("city")?.trim() || "",
        country: searchParams.get("country")?.trim() || "",
        types: searchParams.getAll("type"),
        technologies: searchParams.get("technologies")?.split(",") || [],
        batiments: searchParams.get("batiments")?.split(",") || [],
        interventions: searchParams.get("interventions")?.split(",") || [],
    };

    try {
        const experts = await getExperts(filters);
        return NextResponse.json(experts);
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ message: "Error searching experts" }, { status: 500 });
    }
}
