import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function recordClick(clickData: any) {
    try {
        const dataDir = path.join(process.cwd(), "data");
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        const filePath = path.join(dataDir, "video_clicks.json");
        let clicks: any[] = [];
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, "utf-8");
            try {
                clicks = JSON.parse(raw);
            } catch (e) {
                clicks = [];
            }
        }
        clicks.push(clickData);
        fs.writeFileSync(filePath, JSON.stringify(clicks, null, 2), "utf-8");
    } catch (err) {
        console.warn("[CLICK_TRACKING_SAVE_ERROR]", err);
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("src") || "email";
    const emailId = searchParams.get("utm_content") || searchParams.get("email") || "unknown";
    const targetUrl = searchParams.get("redirect") || searchParams.get("url") || "/carrieres/commercial-independant";
    const campaign = searchParams.get("utm_campaign") || "video_presentation";

    const clickEvent = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        dateFr: new Date().toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }),
        source,
        email: emailId,
        targetUrl,
        campaign,
        ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "anonymous",
        userAgent: request.headers.get("user-agent") || "unknown"
    };

    console.log(`[VIDEO CLICK TRACKING]`, clickEvent);
    recordClick(clickEvent);

    const destination = new URL(targetUrl, request.url);
    destination.searchParams.set("autoplay", "1");
    destination.searchParams.set("utm_source", "email");
    destination.searchParams.set("utm_medium", "email_campaign");
    destination.searchParams.set("utm_campaign", campaign);
    if (emailId !== "unknown") {
        destination.searchParams.set("utm_content", emailId);
    }

    return NextResponse.redirect(destination.toString(), 302);
}
